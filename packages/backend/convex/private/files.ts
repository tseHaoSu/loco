import {
  contentHashFromArrayBuffer,
  Entry,
  EntryId,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  vEntryId,
} from "@convex-dev/rag";
import { ConvexError, v } from "convex/values";
import { action, mutation, query, QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { extractTextContent } from "../lib/extractTextContent";
import { rag } from "../system/agent/rag";
import { paginationOptsValidator } from "convex/server";

// Type Declarations
export interface PublicFile {
  id: EntryId;
  name: string;
  type: string;
  size: string;
  status: "ready" | "processing" | "error";
  url: string | null;
  category?: string;
}

interface EntryMetadata 
extends Record<string, unknown> {
  storageId: string;
  uploadedBy: string;
  filename: string;
  category?: string | null;
  status?: "ready" | "processing" | "error";
}

// Utility Functions
function guessMimeType(filename: string, bytes: ArrayBuffer): string {
  return (
    guessMimeTypeFromExtension(filename) ||
    guessMimeTypeFromContents(bytes) ||
    "application/octet-stream"
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
}

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
        storageId: storageId as string,
        uploadedBy: organizationId,
        filename,
        category: category ?? null,
      } satisfies EntryMetadata,
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

export const list = query({
  args: {
    category: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
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

    const namespace = await rag.getNamespace(ctx, {
      namespace: organizationId,
    });

    if (!namespace) {
      return {
        page: [],
        isDone: true,
        continueCursor: args.paginationOpts.endCursor ?? "",
      };
    }

    const results = await rag.list(ctx, {
      namespaceId: namespace.namespaceId,
      paginationOpts: args.paginationOpts,
    });

    const files = await Promise.all(
      results.page.map(async (entry) => convertEntryToPublicFile(ctx, entry))
    );

    // Filter by category if provided
    const filteredFiles = args.category
      ? files.filter((file) => file.category === args.category)
      : files;

    return {
      page: filteredFiles,
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    };
  },
});

async function convertEntryToPublicFile(
  ctx: Pick<QueryCtx, "storage" | "db">,
  entry: Entry
): Promise<PublicFile> {
  const metadata = entry.metadata as EntryMetadata | undefined;
  const storageId = metadata?.storageId as Id<"_storage"> | undefined;

  let fileSize = "unknown";
  let url: string | null = null;

  if (storageId) {
    try {
      const fileMetadata = await ctx.db.system.get(storageId);
      if (fileMetadata) {
        fileSize = formatFileSize(fileMetadata.size);
      }

      url = await ctx.storage.getUrl(storageId);
    } catch (error) {
      console.error("Error fetching file metadata:", error);
    }
  }

  const filename = entry.key || "Unknown";
  const extension = filename.split(".").pop()?.toLocaleLowerCase() || "";

  // Determine file status
  let status: "ready" | "processing" | "error" = "ready";
  const metadataStatus = metadata?.status as string | undefined;

  if (metadataStatus === "ready") {
    status = "ready";
  } else if (metadataStatus === "processing") {
    status = "processing";
  } else if (metadataStatus === "error") {
    status = "error";
  }

  return {
    id: entry.entryId,
    name: filename,
    type: extension,
    size: fileSize,
    status,
    url,
    category: metadata?.category ?? undefined,
  };
}
