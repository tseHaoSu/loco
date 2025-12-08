# CLAUDE.md

## Project Overview

Customer support platform with AI-powered agents. TypeScript monorepo with multi-tenant architecture.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start all services
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm --filter web dev # Run specific workspace
pnpm dlx shadcn@latest add <component> -c apps/web  # Add shadcn component
```

## Repository Structure

```
loco/
├── apps/
│   ├── web/                    # Main dashboard (Next.js)
│   │   ├── app/                # App Router pages
│   │   │   ├── (auth)/         # Public auth routes
│   │   │   └── (dashboard)/    # Protected routes
│   │   └── modules/            # Feature modules
│   │       ├── auth/ui/        # Auth views, layouts, components
│   │       └── dashboard/ui/   # Dashboard views, layouts, components
│   │
│   └── widget/                 # Embeddable chat widget (Next.js)
│       ├── app/
│       ├── modules/
│       └── store/              # Jotai state
│
├── packages/
│   ├── backend/convex/         # Convex backend
│   │   ├── public/             # Public API (no auth)
│   │   ├── private/            # Authenticated API
│   │   ├── system/agent/       # AI agent (supportAgent.ts)
│   │   ├── lib/                # Utilities (secrets.ts, extractTextContent.ts)
│   │   └── schema.ts           # Database schema
│   │
│   └── ui/src/                 # Shared UI (shadcn/ui)
│       ├── components/
│       └── lib/utils.ts        # cn() helper
```

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend:** Convex (real-time DB + functions)
- **Auth:** Clerk (multi-tenant with organizations)
- **AI:** @convex-dev/agent, @convex-dev/rag, Vercel AI SDK, OpenAI
- **State:** Jotai (widget), React hooks (web)

## Coding Rules

### TypeScript
- **NEVER use `any`** - Use proper interfaces or `unknown` with type guards
- Use `import type` for type-only imports
- Infer types from Zod schemas when possible

### React Components
```typescript
"use client";  // Only for client components

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { api } from "@workspace/backend/convex/_generated/api";

interface Props {
  initialValue: string;
}

export const MyComponent = ({ initialValue }: Props) => {
  const [value, setValue] = useState(initialValue);
  return <Button onClick={() => setValue("new")}>{value}</Button>;
};
```

### Styling
- **Always check `packages/ui/src/styles/globals.css` first** for existing styles and CSS variables
- Use Tailwind utility classes
- Use `gap-*` instead of `space-*` for flex/grid spacing
- Use `cn()` from `@workspace/ui/lib/utils` for conditional classes

### Convex Functions
```typescript
// Always check auth and scope by organizationId
export const getMany = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const orgId = identity.orgId;
    if (!orgId) throw new Error("No organization");

    return await ctx.db
      .query("conversations")
      .withIndex("by_organization_id", q => q.eq("organizationId", orgId))
      .collect();
  },
});
```

## Import Order

```typescript
// 1. React/Next.js
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. External libraries
import { useMutation } from "convex/react";

// 3. Workspace packages
import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";

// 4. Relative imports
import { MyComponent } from "./MyComponent";
import type { MyType } from "../types";
```

## Key Patterns

### Multi-Tenancy
Every query MUST filter by `organizationId` from `ctx.auth.getUserIdentity().orgId`

### Module Structure
```
modules/{feature}/ui/
├── views/        # Page-level components
├── layouts/      # Layout wrappers
└── components/   # Feature components
```

### Convex Function Types
- `query` - Read-only, cached
- `mutation` - Read-write
- `action` - External API calls
- `internalQuery/Mutation` - Only callable from backend

## Environment Variables

```bash
# Web/Widget (.env.local)
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Convex (via dashboard)
CLERK_JWT_ISSUER_DOMAIN=
OPENAI_API_KEY=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

## Common Pitfalls

1. Never use `any` type
2. Always filter by `organizationId`
3. Always check auth in Convex functions
4. Use `@workspace/*` imports for shared packages
5. Use shadcn/ui components from `@workspace/ui`
