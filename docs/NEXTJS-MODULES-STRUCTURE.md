# Next.js Modules Structure Guide

Thin routes + feature modules pattern for scalable Next.js apps.

---

## Core Principle

**Routes are thin. Modules hold logic.**

```
app/           → Routing only (pages import from modules)
modules/       → All business logic, components, views
```

---

## Directory Structure

```
apps/web/
├── app/                        # Next.js App Router (THIN)
│   ├── (auth)/                 # Auth route group
│   │   ├── sign-in/
│   │   │   └── page.tsx        # Just imports SignInView
│   │   └── layout.tsx          # Just imports AuthLayout
│   ├── (dashboard)/            # Dashboard route group
│   │   ├── conversations/
│   │   │   ├── page.tsx        # Just imports from modules
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── files/
│   │   │   └── page.tsx
│   │   └── layout.tsx          # Just imports DashboardLayout
│   ├── layout.tsx              # Root layout (providers)
│   └── page.tsx                # Landing page
│
├── modules/                    # Feature modules (ALL LOGIC)
│   ├── auth/
│   │   ├── components/
│   │   ├── views/
│   │   └── layouts/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── views/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   └── context/
│   └── {feature}/
│       ├── components/
│       ├── views/
│       └── hooks/
│
├── components/                 # Shared app-level components
│   ├── providers.tsx
│   └── theme-toggle.tsx
│
└── contexts/                   # Shared app-level contexts
```

---

## Route Files (app/)

Routes should be **thin wrappers** that only:
- Import views/layouts from modules
- Handle route params
- Perform server-side redirects

### Example: Page Route

```tsx
// app/(dashboard)/conversations/page.tsx
import { ConversationsView } from "@/modules/dashboard/views/ConversationsView";

export default function ConversationsPage() {
  return <ConversationsView />;
}
```

### Example: Dynamic Route

```tsx
// app/(dashboard)/conversations/[id]/page.tsx
import { ConversationView } from "@/modules/dashboard/views/ConversationView";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ConversationView conversationId={id as Id<"conversations">} />;
}
```

### Example: Layout

```tsx
// app/(dashboard)/layout.tsx
import { DashboardLayout } from "@/modules/dashboard/layouts/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
```

---

## Module Structure

Each feature module is self-contained:

```
modules/{feature}/
├── components/       # Feature-specific components
│   ├── FeatureCard.tsx
│   ├── FeatureList.tsx
│   └── FeatureForm.tsx
│
├── views/            # Page-level components (imported by routes)
│   ├── FeatureListView.tsx
│   └── FeatureDetailView.tsx
│
├── layouts/          # Layout components (if needed)
│   └── FeatureLayout.tsx
│
├── hooks/            # Feature-specific hooks (if needed)
│   └── use-feature-data.ts
│
├── context/          # Feature-specific context (if needed)
│   └── FeatureContext.tsx
│
└── types.ts          # Feature-specific types (if needed)
```

---

## What Goes Where

| Type | Location | Example |
|------|----------|---------|
| Route params, redirects | `app/` | `page.tsx`, `layout.tsx` |
| Page-level UI | `modules/{feature}/views/` | `ConversationView.tsx` |
| Reusable feature components | `modules/{feature}/components/` | `MessageList.tsx` |
| Feature layouts | `modules/{feature}/layouts/` | `DashboardLayout.tsx` |
| Feature hooks | `modules/{feature}/hooks/` | `use-messages.ts` |
| Feature context | `modules/{feature}/context/` | `ChatContext.tsx` |
| App-wide providers | `components/` | `providers.tsx` |
| Shared UI components | `@workspace/ui` | Design system |

---

## Naming Conventions

### Files
- **Components:** `PascalCase.tsx`
- **Hooks:** `use-kebab-case.ts`
- **Context:** `PascalCaseContext.tsx`
- **Views:** `PascalCaseView.tsx`
- **Layouts:** `PascalCaseLayout.tsx`

### Directories
- Always **plural**: `components/`, `views/`, `hooks/`, `layouts/`

---

## Views vs Components

### Views (`views/`)
- Imported directly by route pages
- Page-level orchestration
- Contain layout structure
- Fetch data, manage page state

```tsx
// modules/dashboard/views/ConversationsView.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { ConversationList } from "../components/ConversationList";
import { EmptyState } from "../components/EmptyState";

export const ConversationsView = () => {
  const conversations = useQuery(api.private.conversations.getMany);

  if (!conversations?.length) {
    return <EmptyState />;
  }

  return (
    <div className="flex h-full flex-col">
      <header>...</header>
      <ConversationList conversations={conversations} />
    </div>
  );
};
```

### Components (`components/`)
- Reusable within the feature
- Receive data via props
- Handle specific UI concerns

```tsx
// modules/dashboard/components/ConversationList.tsx
interface Props {
  conversations: Conversation[];
}

export const ConversationList = ({ conversations }: Props) => {
  return (
    <ul>
      {conversations.map((conv) => (
        <ConversationItem key={conv._id} conversation={conv} />
      ))}
    </ul>
  );
};
```

---

## Import Patterns

### From Routes (app/)
```tsx
// Always import from modules
import { FeatureView } from "@/modules/feature/views/FeatureView";
import { FeatureLayout } from "@/modules/feature/layouts/FeatureLayout";
```

### Within Modules
```tsx
// Relative imports within same module
import { FeatureCard } from "../components/FeatureCard";
import { useFeatureData } from "../hooks/use-feature-data";
```

### Cross-Module (avoid when possible)
```tsx
// If needed, use absolute imports
import { AuthGuard } from "@/modules/auth/components/AuthGuard";
```

---

## Anti-Patterns

### Don't put logic in routes
```tsx
// BAD - app/(dashboard)/conversations/page.tsx
export default function Page() {
  const [filter, setFilter] = useState("all");
  const conversations = useQuery(api.conversations.getMany);

  return (
    <div>
      <FilterDropdown value={filter} onChange={setFilter} />
      {conversations.map(...)}
    </div>
  );
}

// GOOD - app/(dashboard)/conversations/page.tsx
import { ConversationsView } from "@/modules/dashboard/views/ConversationsView";

export default function Page() {
  return <ConversationsView />;
}
```

### Don't mix feature boundaries
```tsx
// BAD - modules/dashboard/components/UserProfile.tsx
// User profile belongs in a users or profile module

// GOOD - modules/profile/components/UserProfile.tsx
```

### Don't import components into routes
```tsx
// BAD - app/(dashboard)/page.tsx
import { Button } from "@/modules/dashboard/components/Button";
import { Card } from "@/modules/dashboard/components/Card";

// GOOD - Import the view, which uses the components
import { DashboardView } from "@/modules/dashboard/views/DashboardView";
```

---

## When to Create a New Module

Create a new module when:
- Feature has 3+ related components
- Feature has its own routes
- Feature has isolated state/context
- Feature could be extracted/reused

Keep in existing module when:
- Component is tightly coupled to parent feature
- Only 1-2 simple components
- No isolated state needed

---

## Checklist

- [ ] Route files only import from modules
- [ ] No hooks/state/logic in route files
- [ ] Views handle page-level orchestration
- [ ] Components are reusable within feature
- [ ] Related code is colocated in modules
- [ ] Cross-module imports are minimal
