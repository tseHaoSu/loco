import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { internal } from "../../_generated/api";

export const resolveConversationTool = createTool({
  description:
    "Resolve a conversation and update its status to resolved. Use this when the customer's issue has been fully addressed and they are satisfied with the support provided.",
  args: z.object({
    resolution: z
      .string()
      .describe("Brief summary of how the issue was resolved"),
  }),
  handler: async (ctx, _args): Promise<string> => {
    if (!ctx.threadId) {
      throw new Error("No thread ID found in context");
    }

    await ctx.runMutation(internal.system.internal.conversations.resolve, {
      threadId: ctx.threadId,
    });

    return "Great! I'm glad I could help resolve your issue. If you need any further assistance in the future, please don't hesitate to reach out. Have a wonderful day!";
  },
});
