import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { internal } from "../../_generated/api";

export const escalateConversationTool = createTool({
  description:
    "Escalate a conversation to a human agent. Use this when the customer's issue is complex, sensitive, or requires human judgment that the AI cannot provide. Examples include refund requests, technical issues beyond your knowledge, or when the customer explicitly requests human support.",
  args: z.object({
    reason: z
      .string()
      .describe(
        "The reason for escalation - explain why human assistance is needed"
      ),
  }),
  handler: async (ctx, _args): Promise<string> => {
    if (!ctx.threadId) {
      throw new Error("No thread ID found in context");
    }

    await ctx.runMutation(internal.system.internal.conversations.escalated, {
      threadId: ctx.threadId,
    });

    return "I've connected you with our support team. One of our team members will be with you shortly to assist you further. Thank you for your patience!";
  },
});
