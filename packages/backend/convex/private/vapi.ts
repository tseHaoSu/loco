import { ConvexError } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { getSecretValue, parseSecretValue } from "../lib/secrets";
import { VapiClient } from "@vapi-ai/server-sdk";

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
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Vapi plugin not configured for this organization.",
      });
    }

    const secretName = plugin.secretName;
    const secretValue = await getSecretValue(secretName);
    const secretData = parseSecretValue<{
      privateApiKey: string;
      publicApiKey: string;
    }>(secretValue);

    if (!secretData) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Vapi secret data is invalid.",
      });
    }

    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Vapi secret data is incomplete.",
      });
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
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Vapi plugin not configured for this organization.",
      });
    }

    const secretName = plugin.secretName;
    const secretValue = await getSecretValue(secretName);
    const secretData = parseSecretValue<{
      privateApiKey: string;
      publicApiKey: string;
    }>(secretValue);

    if (!secretData) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Vapi secret data is invalid.",
      });
    }

    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Vapi secret data is incomplete.",
      });
    }

    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });

    const assistants = await vapiClient.assistants.list();

    return assistants;
  },
});
