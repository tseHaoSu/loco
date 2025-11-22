import {
  contentHashFromArrayBuffer,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  vEntryId,
} from "@convex-dev/rag";
import { ConvexError, v } from "convex/values";
import { action, mutation } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { extractTextContent } from "../lib/extractTextContent";

function guessMimeType(filename: string, bytes: ArrayBuffer): string {
  return (
    guessMimeTypeFromExtension(filename) ||
    guessMimeTypeFromContents(bytes) ||
    "application/octet-stream"
  );
}

import { rag } from "../system/agent/rag";

//Pipeline: User uploads file → Store blob → Extract text via AI
// → Generate embeddings → Store in vector DB
export const addFile = action({
  args: {
    filename: v.string(),
    mimeType: v.string(),
    bytes: v.bytes(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User must be authenticated.",
      });
    }

    const organizationId = identity.orgId as string;
    if (!organizationId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User does not belong to an organization.",
      });
    }

    const { bytes, filename, category } = args;
    const mimeType = args.mimeType || guessMimeType(filename, bytes);
    const blob = new Blob([bytes], { type: mimeType });
    const storageId = await ctx.storage.store(blob);
    const text = await extractTextContent(ctx, {
      storageId,
      filename,
      bytes,
      mimeType,
    });

    const { entryId, created } = await rag.add(ctx, {
      // cannot search across namespace, if not add will be global
      namespace: organizationId,
      text,
      key: filename,
      title: filename,
      metadata: {
        storageId,
        uploadedBy: organizationId,
        filename,
        category: category ?? null,
      },
      contentHash: await contentHashFromArrayBuffer(bytes),
    });

    if (!created) {
      // Clean up storage if the entry already exists
      await ctx.storage.delete(storageId as Id<"_storage">);
    }

    return {
      url: await ctx.storage.getUrl(storageId),
      entryId,
    };
  },
});

export const deleteFile = mutation({
  args: { entryId: vEntryId },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User must be authenticated.",
      });
    }

    const organizationId = identity.orgId as string;
    if (!organizationId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User does not belong to an organization.",
      });
    }

    const entry = await rag.getEntry(ctx, {
      entryId: args.entryId,
    });

    if (!entry) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "File not found.",
      });
    }

    // Verify ownership - ensure metadata exists and uploadedBy matches
    const uploadedBy = entry.metadata?.uploadedBy;
    if (!uploadedBy || uploadedBy !== organizationId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User does not have permission to delete this file.",
      });
    }

    // Delete RAG entry first (if this fails, storage is preserved)
    await rag.deleteAsync(ctx, {
      entryId: args.entryId,
    });

    // Then delete from storage
    if (entry.metadata?.storageId) {
      await ctx.storage.delete(entry.metadata.storageId as Id<"_storage">);
    }

    return { success: true, entryId: args.entryId };
  },
});
