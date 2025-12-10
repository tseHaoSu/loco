import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "../../_generated/server";

export const refresh = internalMutation({
  args: {
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);
    if (!contactSession) {
      throw new ConvexError({
        code: "not_found",
        message: `Contact session with ID ${args.contactSessionId} not found.`,
      });
    }

    if (contactSession.expiresAt > Date.now()) {
      throw new ConvexError({
        code: "EXPIRED",
        message: `Contact session with ID ${args.contactSessionId} has not expired yet.`,
      });
    }
  },
});

export const getOne = internalQuery({
  args: {
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.contactSessionId);
  },
});
