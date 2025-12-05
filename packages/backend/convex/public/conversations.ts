import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { supportAgent } from "../system/agent/supportAgent";
import { components } from "../_generated/api";
import { saveMessage } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";

export const getMany = query({
  args: {
    contactSessionId: v.id("contactSessions"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);
    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session is invalid or has expired.",
      });
    }

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_contact_session_id", (q) =>
        q.eq("contactSessionId", args.contactSessionId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const conversationWithLastMessage = await Promise.all(
      conversations.page.map(async (conversation) => {
        const messages = await supportAgent.listMessages(ctx, {
          threadId: conversation.threadId,
          paginationOpts: { numItems: 1, cursor: null },
        });

        const lastMessage = messages.page.length > 0 ? messages.page[0] : null;

        return {
          _id: conversation._id,
          _creationTime: conversation._creationTime,
          status: conversation.status,
          organizationId: conversation.organizationId,
          threadId: conversation.threadId,
          lastMessage,
        };
      })
    );

    return {
      ...conversations,
      page: conversationWithLastMessage,
    };
  },
});

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

    if (!conversation) {
      // Return null instead of throwing error to allow graceful handling in UI
      return null;
    }
    if (conversation.contactSessionId !== session._id) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Conversation does not belong to the contact session.",
      });
    }
    return {
      _id: conversation._id,
      status: conversation.status,
      threadId: conversation.threadId,
    };
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

    const widgetSettings = await ctx.db
      .query("widgetSettings")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .unique();

    await saveMessage(ctx, components.agent, {
      threadId,
      message: {
        role: "assistant",
        content:
          widgetSettings?.greetMessage ?? "Hello! How can I assist you today?",
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
