# CLAUDE.md

## Project Overview

<!-- Describe your project: what it does, its purpose, and key features -->

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm lint             # Run linter
pnpm test             # Run tests
```

## Repository Structure

<!--
Example structure - customize for your project:

project/
├── src/
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utility functions
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript types
├── public/             # Static assets
└── tests/              # Test files
-->

## Tech Stack

<!--
Example - customize for your project:

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Auth:** NextAuth.js
-->

## Coding Rules

### TypeScript
- **NEVER use `any`** - Use proper interfaces or `unknown` with type guards
- Use `import type` for type-only imports
- Infer types from Zod schemas when possible
- Define explicit return types for functions

### React Components
```typescript
"use client"; // Only for client components

import { useState } from "react";

interface Props {
  initialValue: string;
}

export const MyComponent = ({ initialValue }: Props) => {
  const [value, setValue] = useState(initialValue);
  return <button onClick={() => setValue("new")}>{value}</button>;
};
```

### Styling
- Check existing global styles before adding new CSS
- Use Tailwind utility classes
- Use `gap-*` instead of `space-*` for flex/grid spacing
- Use `cn()` helper for conditional class merging

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `camelCase.types.ts`
- Tests: `*.test.ts` or `*.spec.ts`

## Import Order

```typescript
// 1. React/Framework imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. External libraries
import { clsx } from "clsx";

// 3. Internal/workspace packages
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 4. Relative imports
import { MyComponent } from "./MyComponent";
import type { MyType } from "../types";
```

## Module Structure

```
modules/{feature}/
├── components/   # Feature-specific components
├── hooks/        # Feature-specific hooks
├── utils/        # Feature-specific utilities
└── types.ts      # Feature-specific types
```

## API/Backend Patterns

<!--
Add your API patterns here. Example:

- Always validate request body with Zod
- Return consistent error responses
- Use proper HTTP status codes
- Implement rate limiting on public endpoints
-->

## Environment Variables

```bash
# Required
DATABASE_URL=
API_KEY=

# Optional
DEBUG=
```

## Common Pitfalls

1. Never use `any` type - use `unknown` with type guards instead
2. Always validate user input on the server
3. Never commit secrets or API keys
4. Always handle loading and error states in UI
5. Use proper error boundaries for React components

## Testing

<!--
Add your testing conventions here. Example:

- Write unit tests for utility functions
- Write integration tests for API routes
- Use React Testing Library for component tests
- Aim for 80% code coverage on critical paths
-->

## Git Conventions

```bash
# Commit message format
<type>: <description>

# Types: feat, fix, docs, style, refactor, test, chore

# Examples
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
```
