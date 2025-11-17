import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { internal } from "../../_generated/api";

export const resolveConversationTool = createTool({
  description: "Resolve a conversation and update its status to resolved",
  args: z.object({}),
  handler: async (ctx, args) => {
    if (!ctx.threadId) {
      throw new Error("No thread ID found in context");
    }
  },
});
