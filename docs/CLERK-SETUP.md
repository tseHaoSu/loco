# Clerk + Convex Setup Guide

Multi-tenant authentication with Clerk Organizations and Convex.

---

## 1. Install Dependencies

```bash
pnpm add @clerk/nextjs
```

---

## 2. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/conversations
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/conversations

# Convex
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
```

---

## 3. Root Layout

```tsx
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

---

## 4. Providers (Convex + Clerk)

```tsx
// components/providers.tsx
"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
```

---

## 5. Middleware

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// Routes that don't require organization selection
const isOrgFreeRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/org-selection(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Redirect to org selection if user has no org
  if (userId && !orgId && !isOrgFreeRoute(req)) {
    const searchParams = new URLSearchParams({ redirect_url: req.url });
    const orgSelection = new URL(
      `/org-selection?${searchParams.toString()}`,
      req.url
    );
    return Response.redirect(orgSelection);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

---

## 6. Auth Views

### Sign In

```tsx
// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

export default async function SignInPage() {
  const { userId } = await auth();
  if (userId) redirect("/conversations");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        fallbackRedirectUrl="/conversations"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
```

### Sign Up

```tsx
// app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

export default async function SignUpPage() {
  const { userId } = await auth();
  if (userId) redirect("/conversations");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        fallbackRedirectUrl="/conversations"
        signInUrl="/sign-in"
      />
    </div>
  );
}
```

### Organization Selection

```tsx
// app/(auth)/org-selection/[[...org-selection]]/page.tsx
import { OrganizationList } from "@clerk/nextjs";

export default function OrgSelectionPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <OrganizationList
        afterCreateOrganizationUrl="/"
        afterSelectOrganizationUrl="/"
        hidePersonal
        skipInvitationScreen
      />
    </div>
  );
}
```

---

## 7. Auth Guards

### AuthGuard (Check Authentication)

```tsx
// components/auth-guard.tsx
"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthLoading>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AuthLoading>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <UnauthenticatedRedirect />
      </Unauthenticated>
    </>
  );
}

function UnauthenticatedRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/sign-in");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
```

### OrganizationGuard (Check Org Selected)

```tsx
// components/organization-guard.tsx
"use client";

import { useOrganization } from "@clerk/nextjs";
import { OrganizationList } from "@clerk/nextjs";

export default function OrganizationGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { organization } = useOrganization();

  if (!organization) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <OrganizationList
          afterCreateOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          hidePersonal
        />
      </div>
    );
  }

  return <>{children}</>;
}
```

### Usage in Layout

```tsx
// app/(dashboard)/layout.tsx
import AuthGuard from "@/components/auth-guard";
import OrganizationGuard from "@/components/organization-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <OrganizationGuard>
        {children}
      </OrganizationGuard>
    </AuthGuard>
  );
}
```

---

## 8. UI Components

### User Button

```tsx
import { UserButton } from "@clerk/nextjs";

<UserButton afterSignOutUrl="/sign-in" />
```

### Organization Switcher

```tsx
import { OrganizationSwitcher } from "@clerk/nextjs";

<OrganizationSwitcher
  hidePersonal
  afterCreateOrganizationUrl="/"
  afterSelectOrganizationUrl="/"
/>
```

---

## 9. Convex Backend (auth.config.ts)

```typescript
// convex/auth.config.ts
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

### Clerk Dashboard Setup

1. Go to Clerk Dashboard → JWT Templates
2. Create new template named `convex`
3. Use Convex template preset
4. Copy the Issuer URL to `CLERK_JWT_ISSUER_DOMAIN` in Convex Dashboard

---

## 10. Getting User Identity in Convex

```typescript
// convex/private/example.ts
import { query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const getData = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Must be authenticated",
      });
    }

    // Get organization ID (multi-tenant)
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Must belong to an organization",
      });
    }

    // Always filter by organization
    return await ctx.db
      .query("items")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
      .collect();
  },
});
```

---

## Route Structure

```
app/
├── (auth)/
│   ├── layout.tsx              # Auth layout (centered)
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx
│   ├── sign-up/
│   │   └── [[...sign-up]]/
│   │       └── page.tsx
│   └── org-selection/
│       └── [[...org-selection]]/
│           └── page.tsx
├── (dashboard)/
│   ├── layout.tsx              # Uses AuthGuard + OrganizationGuard
│   └── ...protected routes
└── layout.tsx                  # ClerkProvider wrapper
```

---

## Checklist

- [ ] Install `@clerk/nextjs`
- [ ] Add environment variables
- [ ] Wrap app in `ClerkProvider`
- [ ] Create `ConvexProviderWithClerk` provider
- [ ] Add middleware with route matchers
- [ ] Create sign-in/sign-up/org-selection pages
- [ ] Create AuthGuard and OrganizationGuard components
- [ ] Set up Clerk JWT template for Convex
- [ ] Add `CLERK_JWT_ISSUER_DOMAIN` to Convex Dashboard
