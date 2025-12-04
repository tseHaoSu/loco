# CLAUDE.md - AI Assistant Guide for Loco Codebase

> **Last Updated:** 2025-11-28
> **Purpose:** This document provides AI assistants with comprehensive context about the codebase structure, development workflows, and coding conventions to enable effective code assistance.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Technology Stack](#technology-stack)
4. [Development Workflows](#development-workflows)
5. [Code Organization](#code-organization)
6. [Coding Conventions](#coding-conventions)
7. [Key Architectural Patterns](#key-architectural-patterns)
8. [Common Operations](#common-operations)
9. [Important Files and Directories](#important-files-and-directories)
10. [Environment and Configuration](#environment-and-configuration)

---

## Project Overview

This is a **customer support/conversation management platform** built as a TypeScript monorepo. The application enables organizations to manage customer conversations through AI-powered support agents with features for conversation tracking, escalation, and resolution.

### Key Features
- Multi-organization support with Clerk authentication
- Real-time conversation management using Convex
- AI-powered support agents (@convex-dev/agent)
- **RAG-powered document intelligence** (@convex-dev/rag) - File upload, text extraction, and semantic search
- Contact session tracking with metadata
- Conversation status management (unresolved, escalated, resolved)
- Multiple deployment targets (web dashboard and embeddable widget)

---

## Repository Structure

```
loco/
├── apps/                          # Application packages
│   ├── web/                       # Main web application (Next.js)
│   │   ├── app/                   # Next.js App Router
│   │   │   ├── (auth)/           # Auth route group
│   │   │   └── (dashboard)/      # Dashboard route group
│   │   ├── modules/              # Feature modules (see Code Organization)
│   │   │   ├── auth/             # Authentication module
│   │   │   └── dashboard/        # Dashboard module
│   │   ├── components/           # Shared components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utility functions
│   │   └── middleware.ts         # Clerk authentication middleware
│   │
│   └── widget/                    # Embeddable widget application
│       ├── app/                   # Widget app router
│       ├── modules/              # Widget-specific modules
│       ├── components/           # Widget components
│       ├── hooks/                # Widget hooks
│       ├── lib/                  # Widget utilities
│       └── store/                # State management (Jotai)
│
├── packages/                      # Shared packages
│   ├── backend/                   # Convex backend (BaaS)
│   │   └── convex/
│   │       ├── public/           # Public Convex functions
│   │       ├── private/          # Private Convex functions (auth required)
│   │       │   └── files.ts      # RAG file upload/delete mutations
│   │       ├── system/           # System-level functions
│   │       │   ├── agent/        # AI agent implementations
│   │       │   │   └── rag.ts    # RAG configuration and initialization
│   │       │   └── internal/     # Internal system functions
│   │       ├── lib/              # Utility functions
│   │       │   ├── extractTextContent.ts  # AI-powered text extraction
│   │       │   └── secrets.ts    # AWS Secrets Manager integration
│   │       ├── schema.ts         # Database schema
│   │       ├── auth.config.ts    # Clerk authentication config
│   │       └── convex.config.ts  # Convex app configuration (includes RAG)
│   │
│   ├── ui/                        # Shared UI component library
│   │   └── src/
│   │       ├── components/       # shadcn/ui components
│   │       ├── hooks/            # Shared React hooks
│   │       ├── lib/              # UI utilities (cn, etc.)
│   │       └── styles/           # Global styles
│   │
│   ├── eslint-config/            # Shared ESLint configuration
│   └── typescript-config/        # Shared TypeScript configuration
│
├── turbo.json                     # Turborepo configuration
├── pnpm-workspace.yaml           # pnpm workspace definition
└── package.json                   # Root package.json
```

---

## Technology Stack

### Core Framework & Runtime
- **Next.js 15.4+** - React framework with App Router
- **React 19.1+** - UI library (latest version)
- **TypeScript 5.7+** - Type safety
- **Node.js ≥20** - Runtime requirement

### Build & Development Tools
- **Turborepo 2.5+** - Monorepo build system
- **pnpm 10.20+** - Package manager
- **Turbopack** - Next.js development bundler (`--turbopack` flag)

### Backend & Data
- **Convex 1.28+** - Backend-as-a-Service (real-time database, functions, file storage)
- **@convex-dev/agent 0.2+** - AI agent framework
- **@convex-dev/rag 0.6+** - Retrieval-Augmented Generation with vector embeddings
- **@aws-sdk/client-secrets-manager** - AWS Secrets Manager SDK for secure credential storage
- **Zod 3.25+** - Schema validation
- **convex-helpers** - Utility functions for Convex (assertions, validators)

### Authentication & Authorization
- **Clerk** - User authentication and organization management
  - `@clerk/nextjs` (frontend)
  - `@clerk/backend` (Convex integration)

### UI & Styling
- **shadcn/ui** - Component library (Radix UI primitives)
- **Tailwind CSS 4.1+** - Utility-first CSS
- **Radix UI** - Unstyled, accessible component primitives
- **lucide-react** - Icon library
- **next-themes** - Theme management
- **class-variance-authority** - Variant styling

### State Management
- **Jotai 2.15+** - Atomic state management (widget app)
- **React Hook Form 7.66+** - Form state management
- **@hookform/resolvers** - Form validation

### AI & Integrations
- **@ai-sdk/openai** - OpenAI SDK
- **@ai-sdk/react** - AI hooks for React
- **@vapi-ai/web** - Voice API (widget only)
- **ai** - Vercel AI SDK

### Other Libraries
- **date-fns 4.1+** - Date utilities
- **react-markdown** - Markdown rendering
- **dicebear** - Avatar generation
- **recharts** - Data visualization
- **sonner** - Toast notifications

---

## Development Workflows

### Package Manager Commands

**Install dependencies:**
```bash
pnpm install
```

**Development (all workspaces):**
```bash
pnpm dev
```

**Build (all workspaces):**
```bash
pnpm build
```

**Lint (all workspaces):**
```bash
pnpm lint
```

**Format code:**
```bash
pnpm format
```

**Count lines of code:**
```bash
# Total lines of code
find /Users/eastinsu/Desktop/PP/loco/apps /Users/eastinsu/Desktop/PP/loco/packages -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" ! -path "*/_generated/*" -exec wc -l {} + | tail -1

# Detailed breakdown by package
printf "=== LOCO CODEBASE STATISTICS ===\n\n" && \
printf "Total Files:\n" && \
find /Users/eastinsu/Desktop/PP/loco/apps /Users/eastinsu/Desktop/PP/loco/packages -type f \( -name "*.ts" -o -name "*.tsx" \) | grep -v node_modules | grep -v .next | grep -v _generated | wc -l && \
printf "\nWeb App:\n" && \
find /Users/eastinsu/Desktop/PP/loco/apps/web -type f -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .next | xargs wc -l | tail -1 && \
printf "\nWidget App:\n" && \
find /Users/eastinsu/Desktop/PP/loco/apps/widget -type f -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .next | xargs wc -l | tail -1 && \
printf "\nBackend (Convex):\n" && \
find /Users/eastinsu/Desktop/PP/loco/packages/backend/convex -type f -name "*.ts" | grep -v node_modules | grep -v _generated | xargs wc -l | tail -1 && \
printf "\nUI Package:\n" && \
find /Users/eastinsu/Desktop/PP/loco/packages/ui/src -type f -name "*.tsx" -o -name "*.ts" | xargs wc -l | tail -1
```

### Workspace-Specific Commands

**Run commands in specific workspace:**
```bash
# Web app
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web typecheck

# Widget app
pnpm --filter widget dev
pnpm --filter widget build

# Backend
pnpm --filter @workspace/backend dev
pnpm --filter @workspace/backend setup

# UI package
pnpm --filter @workspace/ui lint
```

### Turborepo Task Execution

Turborepo automatically handles:
- **Task dependencies** - Builds run in correct order (^build)
- **Caching** - Skips unchanged tasks
- **Parallel execution** - Runs independent tasks concurrently

**Tasks defined in turbo.json:**
- `build` - Build outputs to `.next/`, `dist/`
- `dev` - Start development servers (no cache, persistent)
- `lint` - Run linters
- `check-types` - TypeScript type checking

### Adding shadcn/ui Components

**Add components to the shared UI package:**
```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Components are automatically placed in `packages/ui/src/components/` and available to all apps.

### Convex Backend Development

**Start Convex development:**
```bash
cd packages/backend
pnpm dev
```

**Initial setup:**
```bash
pnpm setup
```

This runs `convex dev --until-success` to initialize the backend.

---

## Code Organization

### Module-Based Architecture

Both `web` and `widget` apps follow a **feature module pattern**:

```
apps/web/modules/
├── auth/
│   └── ui/
│       ├── views/              # Page-level components
│       │   ├── SignInView.tsx
│       │   ├── SignUpView.tsx
│       │   └── OrgSelectView.tsx
│       ├── layouts/            # Layout components
│       │   └── AuthLayout.tsx
│       └── components/         # Feature components
│           ├── AuthGuard.tsx
│           └── OrganizationGuard.tsx
│
└── dashboard/
    └── ui/
        ├── view/               # Page-level components
        │   └── ConversationView.tsx
        ├── layouts/            # Layout components
        │   ├── DashboardLayout.tsx
        │   └── ConversationLayout.tsx
        └── components/         # Feature components
            └── ConversationPanel.tsx
```

**Module Guidelines:**
- Each module encapsulates a specific feature domain
- Modules contain their own UI components, organized by type
- Cross-module imports should be minimal
- Shared components go in `apps/{web|widget}/components/`

### App Router Structure

Next.js App Router with route groups:

```
apps/web/app/
├── (auth)/                     # Auth route group (public routes)
│   ├── sign-in/
│   ├── sign-up/
│   └── org-selection/
│
├── (dashboard)/                # Dashboard route group (protected routes)
│   ├── conversations/
│   │   └── [conversationId]/
│   └── settings/
│
├── layout.tsx                  # Root layout
└── favicon.ico
```

**Route Group Benefits:**
- Logical route organization without affecting URL structure
- Shared layouts per group
- Middleware applies based on route patterns

### Convex Backend Organization

```
packages/backend/convex/
├── public/                     # Public API (no auth required)
│   ├── users.ts
│   ├── contactSessions.ts
│   ├── conversations.ts
│   ├── message.ts
│   └── organizations.ts
│
├── private/                    # Authenticated API
│   ├── conversations.ts
│   └── messages.ts
│
├── system/                     # System-level functions
│   ├── agent/                  # AI agent implementations
│   │   └── supportAgent.ts
│   └── internal/               # Internal system functions
│       ├── contactSessions.ts
│       └── conversations.ts
│
├── schema.ts                   # Database schema
├── auth.config.ts             # Authentication configuration
└── convex.config.ts           # Convex configuration
```

**Convex Function Types:**
- **query** - Read-only, cacheable
- **mutation** - Read-write, not cacheable
- **action** - Can call external APIs, non-transactional
- **internalQuery/internalMutation** - Only callable from other Convex functions

### UI Package Structure

```
packages/ui/src/
├── components/                 # shadcn/ui components
│   ├── ui/                    # Base UI primitives
│   │   ├── button.tsx
│   │   ├── select.tsx
│   │   └── ...
│   └── dicebear-avatar.tsx   # Custom components
│
├── hooks/                     # Shared React hooks
├── lib/                       # Utilities
│   └── utils.ts              # cn() and other helpers
└── styles/
    └── globals.css           # Global Tailwind styles
```

**Package Exports (package.json):**
```json
{
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./lib/*": "./src/lib/*.ts",
    "./components/*": "./src/components/*.tsx",
    "./hooks/*": "./src/hooks/*.ts"
  }
}
```

**Import Pattern:**
```typescript
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
```

---

## Coding Conventions

### TypeScript

1. **Strict Type Safety - NEVER USE `any`**
   - **CRITICAL:** Never use the `any` type. Always create proper type definitions or interfaces.
   - Define explicit interfaces/types for all component props, function parameters, and return values
   - Use Zod for runtime validation and infer types from schemas
   - If the type is truly unknown, use `unknown` and perform type guards
   - For edge cases, prefer `Record<string, unknown>` over `any`

2. **Type Definitions**
   ```typescript
   // ❌ WRONG - Never use any
   function handleData(data: any) {
     return data.value;
   }

   // ✅ CORRECT - Define proper interfaces
   interface DataPayload {
     value: string;
     timestamp: number;
   }
   function handleData(data: DataPayload) {
     return data.value;
   }

   // ✅ CORRECT - Use unknown with type guards
   function handleUnknownData(data: unknown) {
     if (typeof data === 'object' && data !== null && 'value' in data) {
       return (data as { value: string }).value;
     }
     throw new Error('Invalid data structure');
   }

   // ✅ CORRECT - Explicit prop interfaces
   interface ConversationPanelProps {
     initialStatus?: FilterStatus;
     onStatusChange?: (status: FilterStatus) => void;
   }

   // ✅ CORRECT - Infer types from Zod schemas
   const messageSchema = z.object({
     content: z.string(),
     role: z.enum(["user", "assistant"])
   });
   type Message = z.infer<typeof messageSchema>;
   ```

3. **Type Imports**
   ```typescript
   // Use type imports for types only
   import type { Id } from "convex/_generated/dataModel";
   import type { FC } from "react";
   ```

### React Components

1. **Function Components (Arrow Functions)**
   ```typescript
   export const ConversationPanel = () => {
     // Component logic
     return <div>...</div>;
   };
   ```

2. **Client vs Server Components**
   - Mark client components with `"use client"` directive
   - Default to Server Components in Next.js App Router
   - Use client components for:
     - Hooks (useState, useEffect, etc.)
     - Event handlers
     - Browser APIs
     - Third-party libraries requiring client-side

3. **Prefer shadcn/ui Components**
   - **ALWAYS use shadcn/ui components from `@workspace/ui` when available**
   - Use pre-built components (Button, Input, Dialog, Form, etc.) instead of building from scratch
   - Only create custom components when shadcn/ui doesn't provide the needed functionality
   - Benefits: Consistent styling, accessibility, type safety, and maintainability

   ```typescript
   // ✅ CORRECT - Use shadcn/ui components
   import { Button } from "@workspace/ui/components/button";
   import { Input } from "@workspace/ui/components/input";
   import { Dialog, DialogContent } from "@workspace/ui/components/dialog";

   <Button variant="outline" onClick={handleClick}>
     Click me
   </Button>

   // ❌ AVOID - Creating custom button components
   <button className="px-4 py-2 rounded border" onClick={handleClick}>
     Click me
   </button>
   ```

4. **Component Organization**
   ```typescript
   "use client";

   // Imports
   import { useState } from "react";
   import { api } from "@workspace/backend/convex/_generated/api";

   // Types
   type FilterStatus = "all" | "unresolved" | "escalated" | "resolved";

   // Component
   export const ConversationPanel = () => {
     // State
     const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

     // Hooks
     const { results, status } = usePaginatedQuery(...);

     // Event handlers
     const handleClick = () => {...};

     // Render helpers
     const getStatusIcon = (status: string) => {...};

     // JSX
     return <div>...</div>;
   };
   ```

### Styling

1. **Tailwind CSS First**
   - Use Tailwind utility classes for styling
   - Follow mobile-first responsive design
   - Use semantic color tokens (e.g., `text-muted-foreground`)

2. **Component Variants**
   ```typescript
   import { cva } from "class-variance-authority";

   const buttonVariants = cva(
     "inline-flex items-center justify-center rounded-md",
     {
       variants: {
         variant: {
           default: "bg-primary text-primary-foreground",
           outline: "border border-input",
         },
         size: {
           default: "h-10 px-4 py-2",
           sm: "h-9 px-3",
         },
       },
       defaultVariants: {
         variant: "default",
         size: "default",
       },
     }
   );
   ```

3. **Utility Function**
   ```typescript
   import { cn } from "@workspace/ui/lib/utils";

   <div className={cn(
     "base-classes",
     condition && "conditional-classes",
     className
   )} />
   ```

4. **Spacing Utilities**
   - **Prefer `gap-*` over `space-*`** for spacing between flex/grid children
   - `gap-*` applies consistent spacing without margin collapsing issues
   - Only use `space-*` when you specifically need margin-based spacing

   ```typescript
   // ✅ CORRECT - Use gap for flex/grid spacing
   <div className="flex gap-4">
     <div>Item 1</div>
     <div>Item 2</div>
   </div>

   // ❌ AVOID - space-* utilities (use gap instead)
   <div className="flex space-x-4">
     <div>Item 1</div>
     <div>Item 2</div>
   </div>

   // ✅ CORRECT - gap works for both horizontal and vertical
   <div className="flex flex-col gap-6">
     <div>Item 1</div>
     <div>Item 2</div>
   </div>
   ```

### Convex Backend

1. **Function Naming**
   - Use descriptive names: `getMany`, `create`, `update`, `delete`
   - Prefix internal functions with `_` or use `internalQuery/internalMutation`

2. **Schema Definitions**
   ```typescript
   import { defineSchema, defineTable } from "convex/server";
   import { v } from "convex/values";

   export default defineSchema({
     conversations: defineTable({
       threadId: v.string(),
       organizationId: v.string(),
       status: v.union(
         v.literal("unresolved"),
         v.literal("escalated"),
         v.literal("resolved")
       ),
     })
       .index("by_organization_id", ["organizationId"])
       .index("by_status", ["status"]),
   });
   ```

3. **Authentication**
   ```typescript
   import { query, mutation } from "./_generated/server";

   export const getConversations = query({
     handler: async (ctx) => {
       const identity = await ctx.auth.getUserIdentity();
       if (!identity) {
         throw new Error("Unauthorized");
       }

       const orgId = identity.orgId;
       // Use orgId for queries
     },
   });
   ```

### File Naming

- **Components:** PascalCase - `ConversationPanel.tsx`
- **Utilities:** camelCase - `formatDate.ts`
- **Hooks:** camelCase with `use` prefix - `useConversation.ts`
- **Types:** PascalCase - `ConversationTypes.ts`
- **Constants:** SCREAMING_SNAKE_CASE in files like `constants.ts`

### Import Order

```typescript
// 1. React and Next.js
import { useState } from "react";
import { useRouter } from "next/navigation";

// 2. External libraries
import { usePaginatedQuery } from "convex/react";
import { ArrowUp, Check } from "lucide-react";

// 3. Workspace packages
import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";

// 4. Relative imports
import { formatDate } from "../lib/utils";
import type { Conversation } from "../types";
```

---

## Key Architectural Patterns

### Authentication Flow

1. **Clerk Middleware** (`apps/web/middleware.ts`)
   - Protects routes based on authentication state
   - Enforces organization selection
   - Redirects unauthenticated users to sign-in

2. **Convex Auth** (`packages/backend/convex/auth.config.ts`)
   - Validates Clerk JWT tokens
   - Provides `ctx.auth.getUserIdentity()` in functions
   - Multi-tenant isolation via `organizationId`

### Data Flow

```
User Interaction
    ↓
React Component (Client)
    ↓
Convex Hook (usePaginatedQuery/useMutation)
    ↓
Convex Function (Backend)
    ↓
Database Query/Mutation
    ↓
Real-time Update (Subscriptions)
    ↓
Component Re-render
```

**Example:**
```typescript
// Component
const { results } = usePaginatedQuery(
  api.private.conversations.getMany,
  { status: "unresolved" }
);

// Convex function (packages/backend/convex/private/conversations.ts)
export const getMany = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const orgId = identity.orgId;

    return await ctx.db
      .query("conversations")
      .filter(q => q.eq(q.field("organizationId"), orgId))
      .collect();
  },
});
```

### Multi-Tenancy

**Organization Isolation:**
- Every database query filters by `organizationId`
- Clerk provides `orgId` in JWT token
- Convex functions extract `orgId` from `ctx.auth.getUserIdentity()`

**Pattern:**
```typescript
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Unauthorized");

const orgId = identity.orgId;
if (!orgId) throw new Error("No organization selected");

// All queries scoped to orgId
const conversations = await ctx.db
  .query("conversations")
  .withIndex("by_organization_id", q => q.eq("organizationId", orgId))
  .collect();
```

### AI Agent Integration

**Support Agent Pattern:**
```typescript
// packages/backend/convex/system/agent/supportAgent.ts
import { Agent } from "@convex-dev/agent";

// Agent handles conversation threads
// Integrates with Convex for state management
// Uses AI SDK for LLM interactions
```

### RAG System Architecture

**Overview:**
The RAG (Retrieval-Augmented Generation) system enables semantic search over uploaded documents, allowing AI agents to find and reference relevant information when answering customer questions.

**File Upload Pipeline:**
```typescript
User uploads file (PDF/Image/HTML)
    ↓
1. Store blob in Convex storage (ctx.storage.store)
    ↓
2. Extract text using AI (extractTextContent)
    ├─ Images → GPT-4o-mini vision (transcribe/describe)
    ├─ PDFs → GPT-4o (extract structured text)
    └─ HTML → GPT-4o (convert to Markdown)
    ↓
3. Generate embeddings (OpenAI text-embedding-3-small)
    ↓
4. Store in vector DB (rag.add)
    ├─ Text chunks
    ├─ Vector embeddings (1536 dimensions)
    └─ Metadata (filename, storageId, organizationId, category)
    ↓
5. AI agents can now search semantically
```

**Key Files:**
- `packages/backend/convex/private/files.ts` - File upload/delete mutations
- `packages/backend/convex/lib/extractTextContent.ts` - AI text extraction
- `packages/backend/convex/system/agent/rag.ts` - RAG initialization

**Multi-Tenancy:**
- Files are isolated by `namespace` (set to `organizationId`)
- Each organization can only search their own documents
- Prevents cross-organization data leakage

**Content Deduplication:**
```typescript
const { entryId, created } = await rag.add(ctx, {
  namespace: organizationId,
  text: extractedText,
  contentHash: await contentHashFromArrayBuffer(bytes), // Deduplication
  metadata: { storageId, filename, category }
});

if (!created) {
  // File already exists, clean up duplicate storage
  await ctx.storage.delete(storageId as Id<"_storage">);
}
```

**Supported MIME Types:**
- Images: `image/png`, `image/jpeg`, `image/jpg`, `image/gif`, `image/webp`
- Documents: `application/pdf`
- Web: `text/html`

**AI Models Used:**
- Embeddings: `text-embedding-3-small` (1536 dimensions)
- Image extraction: `gpt-4o-mini` (cost-effective for vision tasks)
- PDF/HTML extraction: `gpt-4o` (better structured output)

### Secrets Management with AWS

**Overview:**
The application uses AWS Secrets Manager for secure storage and retrieval of sensitive credentials and API keys. This provides centralized secret management with encryption at rest and in transit, audit logging, and automatic rotation capabilities.

**Architecture:**
```typescript
Convex Action/Mutation
    ↓
1. createSecretsManagerClient()
    ├─ Credentials from environment variables
    │  ├─ AWS_REGION
    │  ├─ AWS_ACCESS_KEY_ID
    │  └─ AWS_SECRET_ACCESS_KEY
    └─ Returns authenticated SecretsManagerClient
    ↓
2. getSecretValue(secretName) or upsertSecret(secretName, secretValue)
    ├─ getSecretValue → Retrieves secret from AWS
    └─ upsertSecret → Creates new or updates existing secret
    ↓
3. parseSecretValue<T>(secretValue)
    ├─ Parses JSON string from AWS
    ├─ Type-safe extraction with generics
    └─ Returns typed object
```

**Key Functions (`packages/backend/convex/lib/secrets.ts`):**

1. **createSecretsManagerClient()**
   - Creates an authenticated AWS Secrets Manager client
   - Uses environment variables for AWS credentials
   - Required env vars: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

2. **getSecretValue(secretName: string)**
   - Retrieves a secret value from AWS Secrets Manager
   - Returns `GetSecretValueCommandOutput` containing the secret data
   - Use with `parseSecretValue()` for type-safe extraction

3. **upsertSecret(secretName: string, secretValue: Record<string, unknown>)**
   - Creates a new secret or updates an existing one (upsert operation)
   - Automatically handles `ResourceExistsException` to update existing secrets
   - Stores secrets as JSON strings for structured data

4. **parseSecretValue<T>(secretValue: GetSecretValueCommandOutput)**
   - Parses the JSON secret string into a typed object
   - Provides type safety with TypeScript generics
   - Throws descriptive errors if secret is empty or invalid JSON

**Usage Pattern:**
```typescript
import {
  createSecretsManagerClient,
  getSecretValue,
  upsertSecret,
  parseSecretValue
} from "./lib/secrets";

// Store a secret
await upsertSecret("my-api-credentials", {
  apiKey: "sk_live_...",
  apiSecret: "secret_...",
  endpoint: "https://api.example.com"
});

// Retrieve and parse a secret
interface ApiCredentials {
  apiKey: string;
  apiSecret: string;
  endpoint: string;
}

const secretValue = await getSecretValue("my-api-credentials");
const credentials = parseSecretValue<ApiCredentials>(secretValue);

// Use the credentials
const response = await fetch(credentials.endpoint, {
  headers: {
    Authorization: `Bearer ${credentials.apiKey}`
  }
});
```

**Security Best Practices:**
- Never commit AWS credentials to version control
- Use IAM roles with least-privilege permissions
- Rotate secrets regularly using AWS Secrets Manager rotation
- Use different AWS accounts/secrets for dev/staging/production
- All secrets are encrypted at rest using AWS KMS
- Access to secrets is logged in AWS CloudTrail for audit

**Multi-Tenancy Considerations:**
- Secrets can be namespaced by organization (e.g., `org-{orgId}-api-key`)
- Each organization's secrets should be isolated
- Use organization-specific secret names to prevent cross-tenant access

### State Management

**Web App:**
- Server state: Convex hooks (`usePaginatedQuery`, `useMutation`)
- Client state: React hooks (`useState`, `useReducer`)
- URL state: Next.js router (`useRouter`, `usePathname`)

**Widget App:**
- Server state: Convex hooks
- Client state: Jotai atoms (atomic state management)
- Local state: React hooks

---

## Common Operations

### Adding a New Feature Module

1. **Create module structure:**
   ```bash
   mkdir -p apps/web/modules/new-feature/ui/{views,layouts,components}
   ```

2. **Add route in App Router:**
   ```bash
   mkdir -p apps/web/app/\(dashboard\)/new-feature
   touch apps/web/app/\(dashboard\)/new-feature/page.tsx
   ```

3. **Create Convex functions:**
   ```bash
   touch packages/backend/convex/private/newFeature.ts
   ```

4. **Define schema (if needed):**
   ```typescript
   // packages/backend/convex/schema.ts
   export default defineSchema({
     // Add new table
     newFeature: defineTable({...}).index(...),
   });
   ```

### Adding a Convex Function

1. **Choose visibility:** public/ or private/
2. **Define function:**
   ```typescript
   import { query, mutation } from "../_generated/server";
   import { v } from "convex/values";

   export const create = mutation({
     args: { name: v.string() },
     handler: async (ctx, args) => {
       const identity = await ctx.auth.getUserIdentity();
       const orgId = identity?.orgId;

       return await ctx.db.insert("tableName", {
         name: args.name,
         organizationId: orgId,
       });
     },
   });
   ```

3. **Use in frontend:**
   ```typescript
   import { useMutation } from "convex/react";
   import { api } from "@workspace/backend/convex/_generated/api";

   const create = useMutation(api.private.newFeature.create);
   await create({ name: "Example" });
   ```

### Adding a UI Component

**For shadcn/ui components:**
```bash
pnpm dlx shadcn@latest add dialog -c apps/web
```

**For custom components:**
```typescript
// packages/ui/src/components/custom-component.tsx
export const CustomComponent = () => {
  return <div>Custom</div>;
};

// Update package.json exports if needed
```

### Database Migrations

Convex handles migrations automatically:
1. Update `schema.ts`
2. Convex detects changes on `pnpm dev`
3. Migrations applied automatically

**Breaking changes:** Use Convex dashboard or migrations for data transformation.

### Environment Variables

**Web App (.env.local):**
```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

**Convex Backend:**
Set via Convex dashboard or CLI:
```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://your-clerk-domain.clerk.accounts.dev
```

---

## Important Files and Directories

### Configuration Files

| File | Purpose |
|------|---------|
| `turbo.json` | Turborepo task configuration |
| `pnpm-workspace.yaml` | Workspace package definitions |
| `package.json` | Root dependencies and scripts |
| `apps/web/next.config.mjs` | Next.js configuration (web) |
| `apps/widget/next.config.mjs` | Next.js configuration (widget) |
| `apps/web/middleware.ts` | Clerk authentication middleware |
| `packages/backend/convex/schema.ts` | Database schema |
| `packages/backend/convex/auth.config.ts` | Authentication configuration |
| `packages/backend/convex/convex.config.ts` | Convex configuration |

### Key Source Directories

| Directory | Purpose |
|-----------|---------|
| `apps/web/app/` | Next.js App Router (pages) |
| `apps/web/modules/` | Feature modules (web) |
| `apps/widget/modules/` | Feature modules (widget) |
| `packages/backend/convex/public/` | Public API functions |
| `packages/backend/convex/private/` | Authenticated API functions |
| `packages/backend/convex/lib/` | Shared utilities (text extraction, secrets management) |
| `packages/ui/src/components/` | Shared UI components |
| `packages/ui/src/styles/` | Global styles |

### Generated Files (Do Not Edit)

- `packages/backend/convex/_generated/` - Convex type definitions
- `apps/*/next-env.d.ts` - Next.js type definitions
- `.next/` - Next.js build output
- `node_modules/` - Dependencies

---

## Environment and Configuration

### Required Environment Variables

**All apps need:**
- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key

**Convex backend needs:**
- `CLERK_JWT_ISSUER_DOMAIN` - Clerk JWT issuer (set via Convex dashboard)
- `OPENAI_API_KEY` - OpenAI API key (for AI features)
- `AWS_REGION` - AWS region for Secrets Manager (e.g., `us-east-1`)
- `AWS_ACCESS_KEY_ID` - AWS access key for Secrets Manager
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key for Secrets Manager

**Widget app additional:**
- `NEXT_PUBLIC_VAPI_API_KEY` - Vapi voice API key (optional)

### Build Configuration

**Next.js:**
- App Router enabled by default
- Turbopack in development (`--turbopack`)
- Transpiles `@workspace/ui` package

**TypeScript:**
- Strict mode enabled
- Path aliases via `tsconfig.json`
- Shared configs from `@workspace/typescript-config`

**Tailwind CSS:**
- Version 4.1+ (new CSS-first configuration)
- Shared components from `@workspace/ui`
- Custom theme tokens

---

## Best Practices for AI Assistants

### When Adding Features

1. **Understand the domain** - Review existing module structure
2. **Follow patterns** - Use established conventions (modules, layouts, views)
3. **Type safety** - Define types/interfaces upfront
4. **Multi-tenancy** - Always filter by `organizationId`
5. **Authentication** - Check `ctx.auth.getUserIdentity()` in Convex functions
6. **Real-time** - Use Convex subscriptions for live updates

### When Modifying Code

1. **Read before write** - Understand existing implementation
2. **Preserve patterns** - Match existing code style
3. **Test isolation** - Ensure changes don't break multi-tenancy
4. **Update types** - Keep TypeScript types in sync
5. **Check imports** - Use workspace packages correctly

#pros a## When Debugging

1. **Check auth** - Verify Clerk and Convex auth setup
2. **Inspect queries** - Review Convex dashboard for query performance
3. **Console logs** - Use structured logging
4. **Type errors** - Run `pnpm typecheck` in affected workspace
5. **Build errors** - Run `pnpm build` to catch issues early

### Common Pitfalls to Avoid

1. ❌ **NEVER use `any` type** - ALWAYS create proper interfaces and type definitions
2. ❌ **Forgetting `organizationId` filter** - Always scope queries to organizations
3. ❌ **Importing from wrong package** - Use `@workspace/*` packages
4. ❌ **Ignoring auth** - Always check authentication in Convex functions
5. ❌ **Breaking module boundaries** - Keep modules decoupled
6. ❌ **Hardcoding values** - Use environment variables
7. ❌ **Skipping error handling** - Handle errors gracefully

---

## Getting Help

### Documentation Resources

- **Next.js:** https://nextjs.org/docs
u- **Convex:** https://docs.convex.dev
- **Clerk:** https://clerk.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Turborepo:** https://turbo.build/repo/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

### Project-Specific Help

For project-specific questions:
1. Review this CLAUDE.md
2. Check existing module implementations
3. Review Convex schema for data model
4. Check middleware.ts for auth flow

---

## Changelog

| Date | Changes |
|------|---------|
| 2025-11-30 | Added code counting commands to Development Workflows section - provides quick ways to analyze codebase size and breakdown by package |
| 2025-11-28 | Added Secrets Management with AWS section - documented `secrets.ts` utility for AWS Secrets Manager integration, including architecture, key functions, usage patterns, security best practices, and multi-tenancy considerations |
| 2025-11-23 | Added React component guideline - prefer shadcn/ui components from `@workspace/ui` for consistency, accessibility, and maintainability |
| 2025-11-17 | Added spacing utilities guideline - prefer `gap-*` over `space-*` utilities for flex/grid layouts with examples |
| 2025-11-16 | Strengthened TypeScript conventions - made `any` type prohibition absolute with clear examples and moved to top priority in Common Pitfalls |
| 2025-11-15 | Initial CLAUDE.md creation - comprehensive documentation of codebase structure, tech stack, development workflows, and conventions |

---

**End of CLAUDE.md** - This document should be updated as the project evolves.
