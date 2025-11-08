import { v } from "convex/values";
import { action, mutation } from "../_generated/server";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export const validate = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (_, args) => {
    try {
      const organization = await clerkClient.organizations.getOrganization({
        organizationId: args.organizationId,
      });
      // Only return serializable data
      return {
        valid: true,
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
        },
      };
    } catch (error) {
      return { valid: false, reason: "Organization not found" };
    }
  },
});
