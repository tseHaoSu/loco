# Convex Backend Guide

Reference for Convex patterns, syntax, and structure.

---

## Directory Structure

```
convex/
├── _generated/           # Auto-generated (DO NOT EDIT)
│   ├── api.ts            # API exports
│   ├── dataModel.ts      # Type definitions
│   └── server.ts         # Server utilities
├── lib/                  # Shared utilities
├── public/               # Unauthenticated endpoints (widget/external)
├── private/              # Authenticated endpoints (dashboard)
├── system/
│   ├── agent/            # AI agent configuration
│   └── internal/         # Internal-only functions
├── schema.ts             # Database schema
├── auth.config.ts        # Auth provider config
└── convex.config.ts      # Component plugins
```

---

## Schema Definition

```typescript
// schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Basic table
  users: defineTable({
    name: v.string(),
    email: v.string(),
  }),

  // Table with indexes
  conversations: defineTable({
    organizationId: v.string(),
    status: v.union(
      v.literal("unresolved"),
      v.literal("escalated"),
      v.literal("resolved")
    ),
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),  // Reference to another table
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_status", ["status"])
    .index("by_thread_id", ["threadId"])
    .index("by_status_and_organization_id", ["status", "organizationId"]),  // Compound index

  // Nested objects
  widgetSettings: defineTable({
    organizationId: v.string(),
    greetMessage: v.string(),
    defaultSuggestions: v.object({
      suggestion1: v.string(),
      suggestion2: v.string(),
    }),
    metadata: v.optional(v.object({
      userAgent: v.optional(v.string()),
      timezone: v.optional(v.string()),
    })),
  }).index("by_organization_id", ["organizationId"]),
});
```

### Validator Types (`v`)

```typescript
// Primitives
v.string()
v.number()
v.boolean()
v.bytes()              // Binary data
v.null()

// References
v.id("tableName")      // Reference to document ID

// Composites
v.object({ ... })
v.array(v.string())

// Unions
v.union(v.literal("a"), v.literal("b"))
v.optional(v.string())  // Can be undefined
```

---

## Function Types

### Query (Read-only, Cached)

```typescript
import { query } from "../_generated/server";
import { v } from "convex/values";

export const getOne = query({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
```

### Mutation (Read/Write)

```typescript
import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    // Insert
    const id = await ctx.db.insert("users", {
      name: args.name,
    });

    // Update
    await ctx.db.patch(id, { name: "Updated" });

    // Delete
    await ctx.db.delete(id);

    return id;
  },
});
```

### Action (External APIs, Side Effects)

```typescript
import { action } from "../_generated/server";
import { v } from "convex/values";

export const addFile = action({
  args: {
    filename: v.string(),
    bytes: v.bytes(),
  },
  handler: async (ctx, args) => {
    // Store file
    const blob = new Blob([args.bytes]);
    const storageId = await ctx.storage.store(blob);

    // Get URL
    const url = await ctx.storage.getUrl(storageId);

    // Call external API
    const response = await fetch("https://api.example.com");

    return { storageId, url };
  },
});
```

### Internal Functions (Backend-only)

```typescript
import { internalQuery, internalMutation } from "../_generated/server";

// Only callable from other Convex functions
export const getByThreadId = internalQuery({
  args: { threadId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique();
  },
});

// Call internal function from another function
import { internal } from "../_generated/api";

await ctx.runQuery(internal.system.internal.conversations.getByThreadId, {
  threadId: "123",
});
```

---

## Database Queries

```typescript
// Get by ID
const doc = await ctx.db.get(args.id);

// Query with index
const results = await ctx.db
  .query("conversations")
  .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
  .collect();

// Compound index query
const results = await ctx.db
  .query("conversations")
  .withIndex("by_status_and_organization_id", (q) =>
    q.eq("status", "unresolved").eq("organizationId", orgId)
  )
  .order("desc")
  .collect();

// Get unique result
const result = await ctx.db
  .query("widgetSettings")
  .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
  .unique();

// Pagination
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
```

---

## Authentication Pattern

```typescript
import { ConvexError } from "convex/values";

export const secureFunction = query({
  args: {},
  handler: async (ctx, args) => {
    // Get identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User must be authenticated.",
      });
    }

    // Multi-tenant: get org ID (Clerk)
    const organizationId = identity.orgId as string;
    if (!organizationId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User does not belong to an organization.",
      });
    }

    // Always filter by organization
    return await ctx.db
      .query("conversations")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", organizationId))
      .collect();
  },
});
```

---

## Error Handling

```typescript
import { ConvexError } from "convex/values";

// Throw structured errors
throw new ConvexError({
  code: "NOT_FOUND",
  message: "Resource not found.",
});

throw new ConvexError({
  code: "UNAUTHORIZED",
  message: "Access denied.",
});

throw new ConvexError({
  code: "VALIDATION_ERROR",
  message: "Invalid input.",
});
```

---

## Configuration Files

### auth.config.ts (Clerk)

```typescript
import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
```

### convex.config.ts (Plugins)

```typescript
import { defineApp } from "convex/server";
import agent from "@convex-dev/agent/convex.config";
import rag from "@convex-dev/rag/convex.config.js";

const app = defineApp();
app.use(agent);  // AI agent component
app.use(rag);    // RAG/vector search component

export default app;
```

---

## AI Agent Setup (Overview)

```typescript
// system/agent/supportAgent.ts
import { components } from "../../_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";

export const supportAgent = new Agent(components.agent, {
  name: "supportAgent",
  languageModel: openai.chat("gpt-4o-mini"),
  instructions: "You are a helpful support agent...",
  tools: {
    searchKnowledgeBase: searchTool,
    resolveConversation: resolveTool,
  },
});

// Usage in mutations
const { threadId } = await supportAgent.createThread(ctx, {
  userId: organizationId,
});

await supportAgent.listMessages(ctx, {
  threadId,
  paginationOpts: { numItems: 10, cursor: null },
});
```

---

## Client Usage (React)

```typescript
import { useQuery, useMutation, useAction } from "convex/react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";

// Query
const data = useQuery(api.private.conversations.getOne, {
  conversationId: id
});

// Mutation
const createConversation = useMutation(api.private.conversations.create);
await createConversation({ organizationId, contactSessionId });

// Action
const uploadFile = useAction(api.private.files.addFile);
await uploadFile({ filename, bytes, mimeType });

// Paginated query
const { results, status, loadMore } = usePaginatedQuery(
  api.private.conversations.getMany,
  { status: "unresolved" },
  { initialNumItems: 10 }
);
```

---

## File Structure Conventions

| Directory | Auth | Purpose |
|-----------|------|---------|
| `public/` | None | Widget/external API endpoints |
| `private/` | Required | Dashboard endpoints |
| `system/internal/` | Backend-only | Called by agent/scheduled jobs |
| `system/agent/` | N/A | Agent configuration |
| `lib/` | N/A | Shared utilities |

---

## Environment Variables

```bash
# Convex Dashboard
CLERK_JWT_ISSUER_DOMAIN=https://xxx.clerk.accounts.dev
OPENAI_API_KEY=sk-...

# Optional: AWS Secrets Manager
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```
