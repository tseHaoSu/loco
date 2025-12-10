import { ConvexError, v } from "convex/values";
import { query } from "../_generated/server";

export const getOneByConversationId = query({
  args: {
    conversationId: v.id("conversations"),
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

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation || conversation.organizationId !== organizationId) {
      return null;
    }

    const contactSession = await ctx.db.get(conversation.contactSessionId);

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      return null;
    }

    return contactSession;
  },
});