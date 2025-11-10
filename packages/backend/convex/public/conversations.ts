import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { supportAgent } from "../system/agent/supportAgent";
import { components } from "../_generated/api";
import { saveMessage } from "@convex-dev/agent";

export const getOneConversation = query({
  args: {
    conversationId: v.id("conversations"),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session is invalid or has expired.",
      });
    }

    const conversation = await ctx.db.get(args.conversationId);
    return conversation;
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);

    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session is invalid or has expired.",
      });
    }

    //Create the thread ID
    const { threadId } = await supportAgent.createThread(ctx, {
      userId: args.organizationId,
    });

    await saveMessage(ctx, components.agent, {
      threadId,
      message: {
        role: "assistant",
        content: "Hello! How can I assist you today?",
      },
    });

    const conversationId = await ctx.db.insert("conversations", {
      contactSessionId: args.contactSessionId,
      status: "unresolved",
      organizationId: args.organizationId,
      threadId: threadId,
    });

    return conversationId;
  },
});
