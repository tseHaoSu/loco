import { ConvexError, v } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { getSecretValue, parseSecretValue } from "../lib/secrets";
import { VapiClient } from "@vapi-ai/server-sdk";

export const validateKeys = action({
  args: {
    privateApiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User must be authenticated.",
      });
    }

    const vapiClient = new VapiClient({
      token: args.privateApiKey,
    });

    try {
      await vapiClient.assistants.list();
      return { valid: true };
    } catch {
      throw new ConvexError({
        code: "INVALID_API_KEY",
        message: "Invalid Vapi API key. Please check your credentials.",
      });
    }
  },
});

export const getPhoneNumber = action({
  args: {},
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

    const plugin = await ctx.runQuery(
      internal.system.internal.plugin.getByOrganizationIdAndService,
      {
        organizationId: organizationId,
        service: "vapi",
      }
    );

    if (!plugin) {
      return null;
    }

    const secretName = plugin.secretName;
    const secretValue = await getSecretValue(secretName);
    const secretData = parseSecretValue<{
      privateApiKey: string;
      publicApiKey: string;
    }>(secretValue);

    if (!secretData) {
      return null;
    }

    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      return null;
    }

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });

    try {
      const phoneNumbers = await vapiClient.phoneNumbers.list();
      return phoneNumbers.length > 0 ? phoneNumbers : null;
    } catch {
      return null;
    }
  },
});

export const getAssistant = action({
  args: {},
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

    const plugin = await ctx.runQuery(
      internal.system.internal.plugin.getByOrganizationIdAndService,
      {
        organizationId: organizationId,
        service: "vapi",
      }
    );

    if (!plugin) {
      return null;
    }

    const secretName = plugin.secretName;
    const secretValue = await getSecretValue(secretName);
    const secretData = parseSecretValue<{
      privateApiKey: string;
      publicApiKey: string;
    }>(secretValue);

    if (!secretData) {
      return null;
    }

    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      return null;
    }

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });

    try {
      const assistants = await vapiClient.assistants.list();
      return assistants;
    } catch {
      return null;
    }
  },
});
