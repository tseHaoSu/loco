# Backend Package (@repo/backend)

This package contains the Convex backend for your application.

## Schema

The schema is defined in `convex/schema.ts`. It includes example tables for:

- **users** - User profiles with email indexing
- **posts** - Blog posts with author relationships
- **comments** - Nested comments on posts
- **likes** - Like tracking for posts
- **tasks** - Todo/task management system
- **messages** - Messaging system with attachments
- **settings** - User preferences and settings

## Getting Started

1. **Start the development server:**
   ```bash
   pnpm run dev
   ```
   This will start the Convex dev server and generate TypeScript types from your schema.

2. **Create queries and mutations:**

   Create a new file like `convex/users.ts`:

   ```typescript
   import { v } from "convex/values";
   import { query, mutation } from "./_generated/server";

   // Query: Get all users
   export const list = query({
     handler: async (ctx) => {
       return await ctx.db.query("users").collect();
     },
   });

   // Mutation: Create a user
   export const create = mutation({
     args: {
       name: v.string(),
       email: v.string(),
     },
     handler: async (ctx, args) => {
       return await ctx.db.insert("users", {
         name: args.name,
         email: args.email,
         createdAt: Date.now(),
         updatedAt: Date.now(),
       });
     },
   });
   ```

3. **Use in your frontend:**

   ```typescript
   import { api } from "@repo/backend/convex/_generated/api";
   import { useQuery, useMutation } from "convex/react";

   // In your component
   const users = useQuery(api.users.list);
   const createUser = useMutation(api.users.create);
   ```

## Scripts

- `pnpm run dev` - Start Convex development server
- `pnpm run setup` - Setup and wait for Convex to be ready
- `pnpm run build` - Placeholder build command

## Learn More

- [Convex Documentation](https://docs.convex.dev)
- [Schema Guide](https://docs.convex.dev/database/schemas)
- [Writing Queries](https://docs.convex.dev/functions/query-functions)
- [Writing Mutations](https://docs.convex.dev/functions/mutation-functions)
