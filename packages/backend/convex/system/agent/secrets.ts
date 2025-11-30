import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "../../_generated/server";
import { internal } from "../../_generated/api";
import {
  upsertSecret,
  getSecretValue,
  parseSecretValue,
} from "../../lib/secrets";

export const upsert = internalAction({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const secretName = `tenant/${args.organizationId}/${args.service}`;
    await upsertSecret(secretName, args.value);

    await ctx.runMutation(internal.system.agent.plugin.upsert, {
      organizationId: args.organizationId,
      service: args.service,
      secretName,
    });
    return { status: "success" };
  },
});
