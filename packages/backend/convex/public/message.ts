import { ConvexError, v } from "convex/values";
import { action, query } from "../_generated/server";
import { components, internal } from "../_generated/api";
import { supportAgent } from "../system/agent/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { resolveConversationTool } from "../system/agent/resolveConversationTool";
import { escalateConversationTool } from "../system/agent/escalateConversation";
import { saveMessage } from "@convex-dev/agent";
import { searchKnowledgeBaseTool } from "../system/agent/search";

export const create = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.runQuery(
      internal.system.internal.contactSessions.getOne,
      { contactSessionId: args.contactSessionId }
    );

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session is invalid or has expired.",
      });
    }

    const conversation = await ctx.runQuery(
      internal.system.internal.conversations.getByThreadId,
      { threadId: args.threadId }
    );

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found.",
      });
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST ",
        message: "Conversation is resolved.",
      });
    }

    //TODO: Implement subscription checks
    const shouldTriggerAgent = conversation.status === "unresolved";

    if (shouldTriggerAgent) {
      const result = await supportAgent.generateText(
        ctx,
        { threadId: args.threadId },
        {
          prompt: args.prompt,
          tools: {
            escalateConversationTool,
            resolveConversationTool,
            searchKnowledgeBaseTool,
          },
        }
      );

      if (result.toolResults && result.toolResults.length > 0 && !result.text) {
        const toolOutput = result.toolResults[0]?.output as string;

        if (toolOutput && toolOutput.trim()) {
          await saveMessage(ctx, components.agent, {
            threadId: args.threadId,
            agentName: "supportAgent",
            message: {
              role: "assistant",
              content: toolOutput,
            },
          });
        }
      }
    } else {
      await saveMessage(ctx, components.agent, {
        threadId: args.threadId,
        message: {
          role: "user",
          content: args.prompt,
        },
      });
    }
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
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

    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });

    return paginated;
  },
});
