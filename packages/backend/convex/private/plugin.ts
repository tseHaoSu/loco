import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getOne = query({
  args: {
    service: v.union(v.literal("vapi")),
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

    return await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", organizationId).eq("service", args.service)
      )
      .unique();
  },
});

export const remove = mutation({
  args: {
    service: v.union(v.literal("vapi")),
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

    const plugin = await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", organizationId).eq("service", args.service)
      )
      .unique();

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: `Plugin for service "${args.service}" not found.`,
      });
    }

    await ctx.db.delete(plugin._id);
  },
});
