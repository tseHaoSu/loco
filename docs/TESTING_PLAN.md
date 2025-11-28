# Testing Plan for Loco Application

> **Last Updated:** 2025-11-28
> **Status:** Planning Phase
> **Coverage Target:** 80% overall, 100% for critical paths

## Table of Contents

1. [Overview](#overview)
2. [Testing Strategy](#testing-strategy)
3. [Technology Stack](#technology-stack)
4. [Implementation Phases](#implementation-phases)
5. [Test Coverage Targets](#test-coverage-targets)
6. [Testing Checklist](#testing-checklist)
7. [Maintenance & Best Practices](#maintenance--best-practices)
8. [Resources](#resources)

---

## Overview

This document outlines a comprehensive testing strategy for the Loco customer support platform. The plan follows modern 2025 best practices for testing Next.js 15+ monorepo applications with Convex backend.

### Goals

- ✅ Ensure code quality and reliability
- ✅ Prevent regressions in critical features
- ✅ Maintain multi-tenancy isolation
- ✅ Validate authentication and authorization
- ✅ Ensure accessibility compliance
- ✅ Monitor performance benchmarks

### Testing Pyramid

```
                    /\
                   /  \
                  / E2E \          10% - End-to-End Tests
                 /______\
                /        \
               /  Integ.  \        30% - Integration Tests
              /____________\
             /              \
            /   Unit Tests   \     60% - Unit Tests
           /__________________\
```

---

## Testing Strategy

### 1. **Unit Testing**
- Test isolated functions and components
- Fast execution, no external dependencies
- Mock all external calls (Convex, Clerk, APIs)
- **Tools:** Vitest, React Testing Library

### 2. **Integration Testing**
- Test component interactions and data flow
- Mock backend but test real UI workflows
- Validate form submissions and state management
- **Tools:** Vitest, React Testing Library, MSW

### 3. **End-to-End Testing**
- Test complete user journeys
- Run against real or staging environment
- Cover critical business flows
- **Tools:** Playwright

### 4. **Backend Testing**
- Test Convex queries and mutations
- Validate schema constraints
- Test AI agent behaviors
- **Tools:** convex-test, Vitest

### 5. **Accessibility Testing**
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader compatibility
- **Tools:** axe-core, Playwright

### 6. **Performance Testing**
- Lighthouse CI scores
- Bundle size analysis
- Real User Monitoring (RUM)
- **Tools:** Lighthouse, Playwright

---

## Technology Stack

### Core Testing Frameworks

| Tool | Version | Purpose | Documentation |
|------|---------|---------|---------------|
| **Vitest** | ^2.0.0 | Fast unit/integration testing framework | [docs](https://vitest.dev) |
| **Playwright** | ^1.48.0 | End-to-end testing | [docs](https://playwright.dev) |
| **React Testing Library** | ^16.0.0 | Component testing utilities | [docs](https://testing-library.com/react) |
| **Testing Library User Event** | ^14.5.0 | User interaction simulation | [docs](https://testing-library.com/docs/user-event/intro) |
| **convex-test** | latest | Convex backend testing | [docs](https://docs.convex.dev/testing) |

### Supporting Libraries

| Tool | Purpose |
|------|---------|
| **@vitest/ui** | Visual test UI and debugging |
| **@vitest/coverage-v8** | Code coverage reports |
| **@testing-library/jest-dom** | Custom DOM matchers |
| **@axe-core/playwright** | Accessibility testing |
| **happy-dom / jsdom** | DOM environment for tests |
| **MSW (Mock Service Worker)** | API mocking |

---

## Implementation Phases

### **Phase 1: Foundation Setup** (Week 1)

#### 1.1 Install Dependencies

**Root workspace:**
```bash
pnpm add -D -w vitest @vitest/ui @vitest/coverage-v8 \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom happy-dom
```

**Web app:**
```bash
pnpm add -D --filter web @playwright/test playwright
```

**UI package:**
```bash
pnpm add -D --filter @workspace/ui @testing-library/react @testing-library/jest-dom
```

**Backend package:**
```bash
pnpm add -D --filter @workspace/backend convex-test
```

#### 1.2 Configure Vitest

**Create `vitest.config.ts` in root:**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/dist',
        '**/.next'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  },
  resolve: {
    alias: {
      '@workspace/ui': path.resolve(__dirname, './packages/ui/src'),
      '@workspace/backend': path.resolve(__dirname, './packages/backend')
    }
  }
});
```

**Create workspace-specific configs:**

`apps/web/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@workspace/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@workspace/backend': path.resolve(__dirname, '../../packages/backend')
    }
  }
});
```

`packages/ui/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

`packages/backend/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['convex/**/*.{test,spec}.ts'],
    exclude: ['convex/_generated/**']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './convex')
    }
  }
});
```

#### 1.3 Configure Playwright

**Create `apps/web/playwright.config.ts`:**

```typescript
import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use */
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'retain-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },

    /* Test against mobile viewports */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
});
```

#### 1.4 Setup Test Utilities

**Create `test/setup.ts` in root:**

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/**
 * Cleanup after each test case
 */
afterEach(() => {
  cleanup();
});

/**
 * Mock Next.js router
 */
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn()
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({})),
  redirect: vi.fn(),
  notFound: vi.fn()
}));

/**
 * Mock Clerk authentication
 */
vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(() => ({
    userId: 'test-user-id',
    orgId: 'test-org-id',
    isLoaded: true,
    isSignedIn: true,
    signOut: vi.fn()
  })),
  useUser: vi.fn(() => ({
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }]
    },
    isLoaded: true,
    isSignedIn: true
  })),
  useOrganization: vi.fn(() => ({
    organization: {
      id: 'test-org-id',
      name: 'Test Organization',
      slug: 'test-org'
    },
    isLoaded: true
  })),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  SignIn: () => null,
  SignUp: () => null,
  UserButton: () => null,
  OrganizationSwitcher: () => null
}));

/**
 * Mock window.matchMedia
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

/**
 * Mock IntersectionObserver
 */
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));
```

**Create `apps/web/test/setup.ts`:**

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

**Create `packages/ui/test/setup.ts`:**

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for UI components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});
```

#### 1.5 Update Turbo Configuration

**Update `turbo.json`:**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "cache": false
    },
    "test:unit": {
      "dependsOn": ["^build"],
      "cache": false
    },
    "test:integration": {
      "dependsOn": ["^build"],
      "cache": false
    },
    "test:e2e": {
      "dependsOn": ["^build"],
      "cache": false
    },
    "test:coverage": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:watch": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

#### 1.6 Add NPM Scripts

**Update root `package.json`:**

```json
{
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "count": "npx cloc --exclude-dir=node_modules,.next,dist,.turbo,.convex,_generated --exclude-ext=json,lock .",

    "test": "turbo test",
    "test:unit": "vitest run",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",
    "test:all": "pnpm test:unit && pnpm test:e2e"
  }
}
```

**Update `apps/web/package.json`:**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "typecheck": "tsc --noEmit",

    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

**Update `packages/ui/package.json`:**

```json
{
  "scripts": {
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Update `packages/backend/package.json`:**

```json
{
  "scripts": {
    "dev": "convex dev",
    "setup": "convex dev --until-success",
    "build": "echo 'Convex backend - run pnpm dev to start'",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

### **Phase 2: Unit Testing** (Week 2)

#### 2.1 Test Shared UI Components

**Location:** `packages/ui/src/components/__tests__/`

**Example: Button Component Test**

```typescript
// packages/ui/src/components/__tests__/button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../ui/button';

describe('Button Component', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button variant="outline">Outline</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('border');

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(button).toHaveClass('destructive');
  });

  it('applies size variants correctly', () => {
    render(<Button size="sm">Small</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-9');
  });

  it('supports disabled state', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('combines custom className with variant classes', () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
```

**Priority UI Components to Test:**

- ✅ Button (`button.test.tsx`)
- ✅ Input (`input.test.tsx`)
- ✅ Select (`select.test.tsx`)
- ✅ Dialog (`dialog.test.tsx`)
- ✅ Form components (`form.test.tsx`)
- ✅ Card (`card.test.tsx`)
- ✅ Avatar (`avatar.test.tsx`)
- ✅ DicebarAvatar (`dicebear-avatar.test.tsx`)
- ✅ Tabs (`tabs.test.tsx`)
- ✅ Dropdown Menu (`dropdown-menu.test.tsx`)

#### 2.2 Test Utility Functions

**Location:** `packages/ui/src/lib/__tests__/`

**Example: Utils Test**

```typescript
// packages/ui/src/lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn (className utility)', () => {
  it('merges multiple class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'conditional')).toBe('base conditional');
    expect(cn('base', false && 'conditional')).toBe('base');
  });

  it('merges Tailwind classes with precedence', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', 'text-blue-600')).toBe('text-blue-600');
  });

  it('handles undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('handles arrays of classes', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('handles object with boolean values', () => {
    expect(cn({
      'class1': true,
      'class2': false,
      'class3': true
    })).toBe('class1 class3');
  });
});
```

#### 2.3 Test Custom Hooks

**Location:** `packages/ui/src/hooks/__tests__/`

**Example: Custom Hook Test**

```typescript
// packages/ui/src/hooks/__tests__/use-toast.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../use-toast';

describe('useToast', () => {
  it('adds a toast notification', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'This is a test'
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
  });

  it('dismisses a toast', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;

    act(() => {
      const toast = result.current.toast({
        title: 'Test Toast'
      });
      toastId = toast.id;
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});
```

---

### **Phase 3: Component Integration Testing** (Week 3)

#### 3.1 Test Dashboard Components

**Location:** `apps/web/modules/dashboard/ui/components/__tests__/`

**Example: ConversationPanel Test**

```typescript
// apps/web/modules/dashboard/ui/components/__tests__/ConversationPanel.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConversationPanel } from '../ConversationPanel';
import { ConvexProvider } from 'convex/react';
import { ConvexReactClient } from 'convex/react';

// Mock Convex client
const mockConvex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ConvexProvider client={mockConvex}>{children}</ConvexProvider>
);

describe('ConversationPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders filter tabs correctly', () => {
    render(<ConversationPanel />, { wrapper });

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Unresolved')).toBeInTheDocument();
    expect(screen.getByText('Escalated')).toBeInTheDocument();
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('filters conversations by status', async () => {
    const user = userEvent.setup();
    render(<ConversationPanel />, { wrapper });

    const unresolvedTab = screen.getByText('Unresolved');
    await user.click(unresolvedTab);

    await waitFor(() => {
      expect(unresolvedTab).toHaveAttribute('data-state', 'active');
    });
  });

  it('displays loading state while fetching', () => {
    render(<ConversationPanel />, { wrapper });

    // Check for loading indicator
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('handles empty conversation list', async () => {
    render(<ConversationPanel />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/no conversations/i)).toBeInTheDocument();
    });
  });
});
```

**Priority Dashboard Components to Test:**

- ✅ ConversationPanel
- ✅ ConversationList
- ✅ ConversationItem
- ✅ MessageList
- ✅ MessageInput
- ✅ StatusBadge
- ✅ FilterTabs
- ✅ DashboardLayout
- ✅ ConversationLayout

#### 3.2 Test Auth Components

**Location:** `apps/web/modules/auth/ui/components/__tests__/`

**Example: AuthGuard Test**

```typescript
// apps/web/modules/auth/ui/components/__tests__/AuthGuard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthGuard } from '../AuthGuard';
import { useAuth } from '@clerk/nextjs';

vi.mock('@clerk/nextjs');

describe('AuthGuard', () => {
  it('renders children when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
      userId: 'test-user-id'
    } as any);

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects when not authenticated', () => {
    const mockPush = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
      userId: null
    } as any);

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows loading state while auth is loading', () => {
    vi.mocked(useAuth).mockReturnValue({
      isSignedIn: false,
      isLoaded: false,
      userId: null
    } as any);

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
});
```

---

### **Phase 4: Convex Backend Testing** (Week 4)

#### 4.1 Test Convex Queries

**Location:** `packages/backend/convex/__tests__/`

**Example: Conversation Queries Test**

```typescript
// packages/backend/convex/__tests__/conversations.query.test.ts
import { convexTest } from 'convex-test';
import { describe, it, expect } from 'vitest';
import schema from '../schema';
import { getMany } from '../private/conversations';
import { api } from '../_generated/api';
import type { Id } from '../_generated/dataModel';

describe('Conversation Queries', () => {
  it('filters conversations by organization', async () => {
    const t = convexTest(schema);

    // Seed test data
    const orgId = await t.run(async (ctx) => {
      const orgId = await ctx.db.insert('organizations', {
        id: 'org-1',
        name: 'Test Organization',
        createdAt: Date.now()
      });

      await ctx.db.insert('conversations', {
        threadId: 'thread-1',
        organizationId: 'org-1',
        status: 'unresolved',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      await ctx.db.insert('conversations', {
        threadId: 'thread-2',
        organizationId: 'org-2',
        status: 'unresolved',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      return orgId;
    });

    // Test query with organization filter
    const results = await t.query(api.private.conversations.getMany, {
      organizationId: 'org-1'
    });

    expect(results).toHaveLength(1);
    expect(results[0].organizationId).toBe('org-1');
  });

  it('filters conversations by status', async () => {
    const t = convexTest(schema);

    await t.run(async (ctx) => {
      await ctx.db.insert('conversations', {
        threadId: 'thread-1',
        organizationId: 'org-1',
        status: 'unresolved',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      await ctx.db.insert('conversations', {
        threadId: 'thread-2',
        organizationId: 'org-1',
        status: 'resolved',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    const unresolvedResults = await t.query(api.private.conversations.getMany, {
      status: 'unresolved'
    });

    expect(unresolvedResults).toHaveLength(1);
    expect(unresolvedResults[0].status).toBe('unresolved');
  });

  it('requires authentication', async () => {
    const t = convexTest(schema);

    // Query without auth should fail
    await expect(
      t.query(api.private.conversations.getMany, {})
    ).rejects.toThrow('Unauthorized');
  });
});
```

#### 4.2 Test Convex Mutations

**Example: Message Creation Test**

```typescript
// packages/backend/convex/__tests__/messages.mutation.test.ts
import { convexTest } from 'convex-test';
import { describe, it, expect } from 'vitest';
import schema from '../schema';
import { api } from '../_generated/api';

describe('Message Mutations', () => {
  it('creates message in conversation', async () => {
    const t = convexTest(schema);

    const conversationId = await t.run(async (ctx) => {
      return await ctx.db.insert('conversations', {
        threadId: 'thread-1',
        organizationId: 'org-1',
        status: 'unresolved',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    const messageId = await t.mutation(api.private.messages.create, {
      conversationId,
      content: 'Test message',
      role: 'user'
    });

    expect(messageId).toBeDefined();

    const message = await t.run(async (ctx) => {
      return await ctx.db.get(messageId);
    });

    expect(message?.content).toBe('Test message');
    expect(message?.role).toBe('user');
  });

  it('validates message content', async () => {
    const t = convexTest(schema);

    const conversationId = await t.run(async (ctx) => {
      return await ctx.db.insert('conversations', {
        threadId: 'thread-1',
        organizationId: 'org-1',
        status: 'unresolved',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    // Empty content should fail
    await expect(
      t.mutation(api.private.messages.create, {
        conversationId,
        content: '',
        role: 'user'
      })
    ).rejects.toThrow();
  });

  it('updates conversation timestamp on message creation', async () => {
    const t = convexTest(schema);

    const conversationId = await t.run(async (ctx) => {
      return await ctx.db.insert('conversations', {
        threadId: 'thread-1',
        organizationId: 'org-1',
        status: 'unresolved',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    const originalConversation = await t.run(async (ctx) => {
      return await ctx.db.get(conversationId);
    });

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 10));

    await t.mutation(api.private.messages.create, {
      conversationId,
      content: 'Test message',
      role: 'user'
    });

    const updatedConversation = await t.run(async (ctx) => {
      return await ctx.db.get(conversationId);
    });

    expect(updatedConversation!.updatedAt).toBeGreaterThan(originalConversation!.updatedAt);
  });
});
```

#### 4.3 Test Multi-Tenancy Isolation

**Example: Tenant Isolation Test**

```typescript
// packages/backend/convex/__tests__/multi-tenancy.test.ts
import { convexTest } from 'convex-test';
import { describe, it, expect } from 'vitest';
import schema from '../schema';
import { api } from '../_generated/api';

describe('Multi-Tenancy Isolation', () => {
  it('prevents cross-organization data access in queries', async () => {
    const t = convexTest(schema);

    // Create two organizations with conversations
    await t.run(async (ctx) => {
      // Organization 1
      await ctx.db.insert('conversations', {
        threadId: 'org1-thread',
        organizationId: 'org-1',
        status: 'unresolved',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      // Organization 2
      await ctx.db.insert('conversations', {
        threadId: 'org2-thread',
        organizationId: 'org-2',
        status: 'unresolved',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    // Query as org-1 user
    const org1Results = await t.query(api.private.conversations.getMany, {
      organizationId: 'org-1'
    });

    expect(org1Results).toHaveLength(1);
    expect(org1Results[0].organizationId).toBe('org-1');
    expect(org1Results.some(c => c.organizationId === 'org-2')).toBe(false);
  });

  it('prevents cross-organization mutations', async () => {
    const t = convexTest(schema);

    const org1ConversationId = await t.run(async (ctx) => {
      return await ctx.db.insert('conversations', {
        threadId: 'org1-thread',
        organizationId: 'org-1',
        status: 'unresolved',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    // Attempt to update conversation from different org should fail
    await expect(
      t.mutation(api.private.conversations.update, {
        conversationId: org1ConversationId,
        organizationId: 'org-2', // Different org!
        status: 'resolved'
      })
    ).rejects.toThrow();
  });

  it('isolates RAG file storage by organization namespace', async () => {
    const t = convexTest(schema);

    // Test RAG file isolation
    // Files uploaded by org-1 should not be searchable by org-2
    // This would test the RAG namespace isolation
  });
});
```

#### 4.4 Test RAG System

**Example: RAG Pipeline Test**

```typescript
// packages/backend/convex/__tests__/rag.test.ts
import { convexTest } from 'convex-test';
import { describe, it, expect } from 'vitest';
import schema from '../schema';
import { api } from '../_generated/api';

describe('RAG System', () => {
  it('uploads and indexes file successfully', async () => {
    const t = convexTest(schema);

    const fileData = new Blob(['Test document content'], { type: 'text/plain' });

    const result = await t.mutation(api.private.files.upload, {
      file: fileData,
      filename: 'test.txt',
      organizationId: 'org-1',
      category: 'knowledge-base'
    });

    expect(result.entryId).toBeDefined();
    expect(result.created).toBe(true);
  });

  it('prevents duplicate file uploads via content hash', async () => {
    const t = convexTest(schema);

    const fileData = new Blob(['Duplicate content'], { type: 'text/plain' });

    // Upload first time
    const result1 = await t.mutation(api.private.files.upload, {
      file: fileData,
      filename: 'test1.txt',
      organizationId: 'org-1',
      category: 'knowledge-base'
    });

    // Upload same content again
    const result2 = await t.mutation(api.private.files.upload, {
      file: fileData,
      filename: 'test2.txt',
      organizationId: 'org-1',
      category: 'knowledge-base'
    });

    expect(result1.created).toBe(true);
    expect(result2.created).toBe(false);
    expect(result2.entryId).toBe(result1.entryId);
  });

  it('performs semantic search within organization namespace', async () => {
    const t = convexTest(schema);

    // Upload some documents
    await t.mutation(api.private.files.upload, {
      file: new Blob(['Information about product pricing'], { type: 'text/plain' }),
      filename: 'pricing.txt',
      organizationId: 'org-1',
      category: 'knowledge-base'
    });

    // Search for related content
    const searchResults = await t.query(api.private.files.search, {
      query: 'How much does the product cost?',
      organizationId: 'org-1'
    });

    expect(searchResults.length).toBeGreaterThan(0);
  });

  it('deletes file and removes from vector index', async () => {
    const t = convexTest(schema);

    const uploadResult = await t.mutation(api.private.files.upload, {
      file: new Blob(['Test content'], { type: 'text/plain' }),
      filename: 'test.txt',
      organizationId: 'org-1',
      category: 'knowledge-base'
    });

    await t.mutation(api.private.files.delete, {
      entryId: uploadResult.entryId,
      organizationId: 'org-1'
    });

    // Verify file is deleted
    const searchResults = await t.query(api.private.files.search, {
      query: 'Test content',
      organizationId: 'org-1'
    });

    expect(searchResults).toHaveLength(0);
  });
});
```

---

### **Phase 5: End-to-End Testing** (Week 5)

#### 5.1 Authentication Flow Tests

**Location:** `apps/web/e2e/auth.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('sign in with valid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill('input[name="identifier"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');

    // Should redirect to conversations or org selection
    await expect(page).toHaveURL(/\/(conversations|org-selection)/);
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');

    await page.fill('input[name="identifier"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=/incorrect|invalid/i')).toBeVisible();
  });

  test('organization selection flow', async ({ page }) => {
    await page.goto('/org-selection');

    // Wait for organizations to load
    await page.waitForSelector('[data-testid="org-card"]');

    // Select first organization
    await page.click('[data-testid="org-card"]:first-child');

    // Should redirect to conversations
    await expect(page).toHaveURL('/conversations');
  });

  test('redirects unauthenticated users to sign-in', async ({ page }) => {
    // Try to access protected route without auth
    await page.goto('/conversations');

    // Should redirect to sign-in
    await expect(page).toHaveURL(/sign-in/);
  });

  test('sign out successfully', async ({ page, context }) => {
    // Sign in first
    await page.goto('/sign-in');
    await page.fill('input[name="identifier"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL(/conversations/);

    // Click user menu
    await page.click('[data-testid="user-button"]');

    // Click sign out
    await page.click('text=/sign out/i');

    // Should redirect to sign-in
    await expect(page).toHaveURL(/sign-in/);

    // Should not be able to access protected routes
    await page.goto('/conversations');
    await expect(page).toHaveURL(/sign-in/);
  });
});
```

#### 5.2 Conversation Management Tests

**Location:** `apps/web/e2e/conversations.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Conversation Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login helper
    await page.goto('/sign-in');
    await page.fill('input[name="identifier"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL(/conversations/);
  });

  test('displays conversation list', async ({ page }) => {
    await page.goto('/conversations');

    // Wait for conversations to load
    await page.waitForSelector('[data-testid="conversation-list"]');

    // Should show at least the "All" tab
    await expect(page.locator('text=All')).toBeVisible();
  });

  test('filters conversations by status', async ({ page }) => {
    await page.goto('/conversations');

    // Click "Unresolved" tab
    await page.click('text=Unresolved');

    // Tab should be active
    await expect(page.locator('[data-state="active"]:has-text("Unresolved")')).toBeVisible();

    // List should update (check for loading state first)
    await page.waitForLoadState('networkidle');
  });

  test('opens conversation detail view', async ({ page }) => {
    await page.goto('/conversations');

    // Wait for conversations to load
    await page.waitForSelector('[data-testid="conversation-item"]');

    // Click first conversation
    await page.click('[data-testid="conversation-item"]:first-child');

    // Should navigate to conversation detail
    await expect(page).toHaveURL(/conversations\/[a-zA-Z0-9]+/);

    // Message list should be visible
    await expect(page.locator('[data-testid="message-list"]')).toBeVisible();
  });

  test('sends message in conversation', async ({ page }) => {
    await page.goto('/conversations');

    // Open first conversation
    await page.click('[data-testid="conversation-item"]:first-child');
    await page.waitForURL(/conversations\/[a-zA-Z0-9]+/);

    // Type message
    const messageText = `Test message ${Date.now()}`;
    await page.fill('textarea[name="message"]', messageText);

    // Send message
    await page.click('button[type="submit"]');

    // Message should appear in list
    await expect(page.locator(`text=${messageText}`)).toBeVisible();
  });

  test('changes conversation status', async ({ page }) => {
    await page.goto('/conversations');

    // Open first conversation
    await page.click('[data-testid="conversation-item"]:first-child');
    await page.waitForURL(/conversations\/[a-zA-Z0-9]+/);

    // Open status dropdown
    await page.click('[data-testid="status-dropdown"]');

    // Select "Resolved"
    await page.click('text=Resolved');

    // Status should update
    await expect(page.locator('text=Resolved')).toBeVisible();
  });

  test('searches conversations', async ({ page }) => {
    await page.goto('/conversations');

    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('test query');

    // Wait for search results
    await page.waitForLoadState('networkidle');

    // Results should be filtered
    // (Add specific assertions based on your search implementation)
  });

  test('displays empty state when no conversations', async ({ page }) => {
    await page.goto('/conversations');

    // Filter to a status with no conversations (e.g., Escalated)
    await page.click('text=Escalated');
    await page.waitForLoadState('networkidle');

    // Should show empty state (if no escalated conversations exist)
    // Adjust based on actual data
  });
});
```

#### 5.3 Real-time Updates Test

**Location:** `apps/web/e2e/realtime.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Real-time Updates', () => {
  test('receives new messages in real-time', async ({ page, context }) => {
    // Open conversation in first tab
    await page.goto('/sign-in');
    await page.fill('input[name="identifier"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL(/conversations/);

    await page.click('[data-testid="conversation-item"]:first-child');
    await page.waitForURL(/conversations\/[a-zA-Z0-9]+/);

    const conversationUrl = page.url();

    // Open same conversation in second tab
    const page2 = await context.newPage();
    await page2.goto(conversationUrl);

    // Send message from first tab
    const messageText = `Real-time test ${Date.now()}`;
    await page.fill('textarea[name="message"]', messageText);
    await page.click('button[type="submit"]');

    // Message should appear in second tab without refresh
    await expect(page2.locator(`text=${messageText}`)).toBeVisible({ timeout: 5000 });

    await page2.close();
  });

  test('updates conversation list when new message arrives', async ({ page, context }) => {
    // Similar test for conversation list updates
  });
});
```

#### 5.4 Widget Integration Tests

**Location:** `apps/widget/e2e/widget.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Customer Support Widget', () => {
  test('widget loads and displays correctly', async ({ page }) => {
    await page.goto('/widget-demo'); // Your widget test page

    // Wait for widget to load
    await page.waitForSelector('[data-testid="support-widget"]');

    // Widget button should be visible
    await expect(page.locator('[data-testid="widget-button"]')).toBeVisible();
  });

  test('opens chat interface on button click', async ({ page }) => {
    await page.goto('/widget-demo');

    // Click widget button
    await page.click('[data-testid="widget-button"]');

    // Chat interface should appear
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
  });

  test('sends message through widget', async ({ page }) => {
    await page.goto('/widget-demo');

    // Open widget
    await page.click('[data-testid="widget-button"]');

    // Type and send message
    const messageText = `Widget test ${Date.now()}`;
    await page.fill('[data-testid="widget-input"]', messageText);
    await page.click('[data-testid="send-button"]');

    // Message should appear in chat
    await expect(page.locator(`text=${messageText}`)).toBeVisible();
  });

  test('receives AI response', async ({ page }) => {
    await page.goto('/widget-demo');

    // Open widget and send message
    await page.click('[data-testid="widget-button"]');
    await page.fill('[data-testid="widget-input"]', 'Hello');
    await page.click('[data-testid="send-button"]');

    // Wait for AI response
    await expect(page.locator('[data-testid="ai-message"]')).toBeVisible({ timeout: 10000 });
  });

  test('minimizes and restores chat', async ({ page }) => {
    await page.goto('/widget-demo');

    // Open widget
    await page.click('[data-testid="widget-button"]');
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();

    // Minimize
    await page.click('[data-testid="minimize-button"]');
    await expect(page.locator('[data-testid="chat-interface"]')).not.toBeVisible();

    // Restore
    await page.click('[data-testid="widget-button"]');
    await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();
  });
});
```

---

### **Phase 6: Accessibility Testing** (Week 6)

#### 6.1 WCAG Compliance Tests

**Location:** `apps/web/e2e/accessibility.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility (WCAG 2.1 Level AA)', () => {
  test('dashboard has no accessibility violations', async ({ page }) => {
    await page.goto('/conversations');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('conversation detail has no accessibility violations', async ({ page }) => {
    await page.goto('/conversations');
    await page.click('[data-testid="conversation-item"]:first-child');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('form inputs have proper labels', async ({ page }) => {
    await page.goto('/conversations');

    const results = await new AxeBuilder({ page })
      .include('[data-testid="message-form"]')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('all interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/conversations');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement);

    // Continue tabbing
    await page.keyboard.press('Tab');
    focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT', 'TEXTAREA']).toContain(focusedElement);
  });

  test('skip navigation link works', async ({ page }) => {
    await page.goto('/conversations');

    // Press Tab to focus skip link
    await page.keyboard.press('Tab');

    // Press Enter to activate
    await page.keyboard.press('Enter');

    // Main content should be focused
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('main-content');
  });

  test('color contrast meets WCAG AA standards', async ({ page }) => {
    await page.goto('/conversations');

    const results = await new AxeBuilder({ page })
      .withTags(['cat.color'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/conversations');

    const results = await new AxeBuilder({ page })
      .withTags(['cat.text-alternatives'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('heading hierarchy is correct', async ({ page }) => {
    await page.goto('/conversations');

    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements =>
      elements.map(el => ({
        level: parseInt(el.tagName[1]),
        text: el.textContent
      }))
    );

    // Should have exactly one h1
    const h1Count = headings.filter(h => h.level === 1).length;
    expect(h1Count).toBe(1);

    // Heading levels should not skip (e.g., h1 -> h3)
    for (let i = 1; i < headings.length; i++) {
      const diff = headings[i].level - headings[i - 1].level;
      expect(diff).toBeLessThanOrEqual(1);
    }
  });

  test('ARIA landmarks are properly used', async ({ page }) => {
    await page.goto('/conversations');

    // Check for main landmark
    await expect(page.locator('main, [role="main"]')).toBeVisible();

    // Check for navigation landmark
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
  });
});
```

#### 6.2 Keyboard Navigation Tests

**Location:** `apps/web/e2e/keyboard-navigation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test('navigates conversation list with arrow keys', async ({ page }) => {
    await page.goto('/conversations');

    // Focus first conversation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Adjust based on actual tab order

    // Press down arrow
    await page.keyboard.press('ArrowDown');

    // Second item should be focused
    const focusedItem = await page.evaluate(() =>
      document.activeElement?.getAttribute('data-testid')
    );
    expect(focusedItem).toContain('conversation-item');
  });

  test('opens conversation with Enter key', async ({ page }) => {
    await page.goto('/conversations');

    // Navigate to conversation and press Enter
    await page.focus('[data-testid="conversation-item"]:first-child');
    await page.keyboard.press('Enter');

    // Should navigate to conversation detail
    await expect(page).toHaveURL(/conversations\/[a-zA-Z0-9]+/);
  });

  test('closes dialog with Escape key', async ({ page }) => {
    await page.goto('/conversations');

    // Open a dialog (adjust based on your app)
    await page.click('[data-testid="settings-button"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Dialog should close
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('dropdown menu accessible via keyboard', async ({ page }) => {
    await page.goto('/conversations');

    // Focus dropdown trigger
    await page.focus('[data-testid="user-menu"]');

    // Open with Space or Enter
    await page.keyboard.press('Enter');

    // Menu should be visible
    await expect(page.locator('[role="menu"]')).toBeVisible();

    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');

    // Select with Enter
    await page.keyboard.press('Enter');
  });

  test('form submission with Enter key', async ({ page }) => {
    await page.goto('/conversations');
    await page.click('[data-testid="conversation-item"]:first-child');

    // Focus message input
    await page.focus('textarea[name="message"]');

    // Type message
    await page.keyboard.type('Test message');

    // Submit with keyboard (Ctrl+Enter or similar)
    await page.keyboard.press('Control+Enter');

    // Message should be sent
    await expect(page.locator('text=Test message')).toBeVisible();
  });

  test('focus management in modals', async ({ page }) => {
    await page.goto('/conversations');

    // Open modal
    await page.click('[data-testid="new-conversation"]');

    // Focus should move to modal
    const focusInModal = await page.evaluate(() => {
      const activeElement = document.activeElement;
      const modal = document.querySelector('[role="dialog"]');
      return modal?.contains(activeElement);
    });

    expect(focusInModal).toBe(true);
  });
});
```

---

### **Phase 7: Performance Testing** (Week 7)

#### 7.1 Lighthouse CI Configuration

**Create `.lighthouserc.js`:**

```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/conversations',
        'http://localhost:3000/conversations/test-id'
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

**Install Lighthouse CI:**

```bash
pnpm add -D @lhci/cli
```

**Add script to `package.json`:**

```json
{
  "scripts": {
    "lighthouse": "lhci autorun",
    "lighthouse:collect": "lhci collect",
    "lighthouse:assert": "lhci assert"
  }
}
```

#### 7.2 Performance Tests

**Location:** `apps/web/e2e/performance.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('page load time is acceptable', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/conversations');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Page should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('conversation list renders within performance budget', async ({ page }) => {
    await page.goto('/conversations');

    // Start measuring
    await page.evaluate(() => performance.mark('list-render-start'));

    // Wait for list to render
    await page.waitForSelector('[data-testid="conversation-list"]');

    // End measuring
    const renderTime = await page.evaluate(() => {
      performance.mark('list-render-end');
      performance.measure('list-render', 'list-render-start', 'list-render-end');
      const measure = performance.getEntriesByName('list-render')[0];
      return measure.duration;
    });

    // Should render in under 500ms
    expect(renderTime).toBeLessThan(500);
  });

  test('bundle size is within limits', async ({ page }) => {
    await page.goto('/conversations');

    // Get all loaded resources
    const resources = await page.evaluate(() =>
      performance.getEntriesByType('resource')
        .filter((r: any) => r.initiatorType === 'script')
        .reduce((total: number, r: any) => total + r.transferSize, 0)
    );

    // Total JS should be under 500KB (adjust based on your needs)
    expect(resources).toBeLessThan(500 * 1024);
  });

  test('Core Web Vitals are within thresholds', async ({ page }) => {
    await page.goto('/conversations');
    await page.waitForLoadState('networkidle');

    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals: any = {};

          entries.forEach((entry: any) => {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime;
            }
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              vitals.cls = (vitals.cls || 0) + entry.value;
            }
          });

          resolve(vitals);
        });

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });

        // Timeout after 10 seconds
        setTimeout(() => resolve({}), 10000);
      });
    });

    // FCP should be under 2 seconds
    if (vitals.fcp) expect(vitals.fcp).toBeLessThan(2000);

    // LCP should be under 2.5 seconds
    if (vitals.lcp) expect(vitals.lcp).toBeLessThan(2500);

    // CLS should be under 0.1
    if (vitals.cls) expect(vitals.cls).toBeLessThan(0.1);
  });

  test('infinite scroll performance', async ({ page }) => {
    await page.goto('/conversations');

    // Scroll to bottom multiple times
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(100);

      const scrollTime = Date.now() - startTime;

      // Each scroll should complete quickly
      expect(scrollTime).toBeLessThan(500);
    }
  });
});
```

---

### **Phase 8: CI/CD Integration** (Week 8)

#### 8.1 GitHub Actions Workflow

**Create `.github/workflows/test.yml`:**

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'

jobs:
  install:
    name: Install Dependencies
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.20.0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Cache node modules
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/pnpm-lock.yaml') }}

  lint:
    name: Lint
    runs-on: ubuntu-latest
    needs: install
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.20.0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/pnpm-lock.yaml') }}

      - name: Run linter
        run: pnpm lint

  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    needs: install
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.20.0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/pnpm-lock.yaml') }}

      - name: Type check
        run: pnpm check-types

  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: install
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.20.0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/pnpm-lock.yaml') }}

      - name: Run unit tests
        run: pnpm test:unit

      - name: Generate coverage report
        run: pnpm test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json
          token: ${{ secrets.CODECOV_TOKEN }}
          fail_ci_if_error: true

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: install
    env:
      NEXT_PUBLIC_CONVEX_URL: ${{ secrets.CONVEX_URL }}
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY }}
      CLERK_SECRET_KEY: ${{ secrets.CLERK_SECRET_KEY }}
      TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
      TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.20.0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/pnpm-lock.yaml') }}

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build application
        run: pnpm build

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload Playwright report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  lighthouse:
    name: Lighthouse CI
    runs-on: ubuntu-latest
    needs: install
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.20.0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/pnpm-lock.yaml') }}

      - name: Build application
        run: pnpm build

      - name: Run Lighthouse CI
        run: |
          pnpm add -g @lhci/cli
          lhci autorun

      - name: Upload Lighthouse results
        uses: actions/upload-artifact@v4
        with:
          name: lighthouse-report
          path: .lighthouseci/

  test-summary:
    name: Test Summary
    runs-on: ubuntu-latest
    needs: [lint, type-check, unit-tests, e2e-tests, lighthouse]
    if: always()
    steps:
      - name: Check test results
        run: |
          echo "All tests completed"
          if [ "${{ needs.lint.result }}" != "success" ]; then exit 1; fi
          if [ "${{ needs.type-check.result }}" != "success" ]; then exit 1; fi
          if [ "${{ needs.unit-tests.result }}" != "success" ]; then exit 1; fi
          if [ "${{ needs.e2e-tests.result }}" != "success" ]; then exit 1; fi
```

#### 8.2 Pre-commit Hooks

**Install Husky:**

```bash
pnpm add -D husky lint-staged
```

**Create `.husky/pre-commit`:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

**Add to `package.json`:**

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

## Test Coverage Targets

### Priority Levels

#### 🔴 **Critical (100% coverage required)**

- Authentication logic (`apps/web/modules/auth/`)
- Multi-tenancy isolation (`packages/backend/convex/`)
- Payment processing (if applicable)
- Data security functions
- User authorization checks

#### 🟡 **High (80%+ coverage)**

- Core business logic
- Convex mutations (`packages/backend/convex/private/`)
- Form validations
- Error handling
- RAG system (`packages/backend/convex/system/agent/rag.ts`)

#### 🟢 **Medium (60%+ coverage)**

- UI components (`packages/ui/src/components/`)
- Utility functions (`packages/ui/src/lib/`)
- Formatting helpers
- Dashboard components (`apps/web/modules/dashboard/`)

#### ⚪ **Low (40%+ coverage)**

- Layout components
- Static content
- Configuration files
- Type definitions

---

## Testing Checklist

### Before Each Release

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Coverage meets thresholds (80% overall)
- [ ] No accessibility violations (WCAG 2.1 AA)
- [ ] Performance benchmarks met (Lighthouse scores >90)
- [ ] Type checking passes (`pnpm check-types`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Visual regression tests reviewed
- [ ] Cross-browser testing complete (Chrome, Firefox, Safari)
- [ ] Mobile testing complete (iOS, Android)
- [ ] Real-time features tested
- [ ] Multi-tenancy isolation verified
- [ ] RAG system tested with sample documents

### Before Production Deployment

- [ ] Security audit complete
- [ ] Performance testing in staging
- [ ] Load testing complete
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured
- [ ] Error tracking enabled (Sentry, etc.)

---

## Maintenance & Best Practices

### Weekly Tasks

- [ ] Review failed tests in CI
- [ ] Update snapshots if UI changed
- [ ] Check coverage reports
- [ ] Review and close flaky test tickets

### Monthly Tasks

- [ ] Review and update E2E tests
- [ ] Audit test performance
- [ ] Update testing dependencies
- [ ] Review test documentation
- [ ] Analyze test execution time
- [ ] Refactor slow tests

### Quarterly Tasks

- [ ] Review testing strategy
- [ ] Add tests for new patterns
- [ ] Refactor flaky tests
- [ ] Update testing documentation
- [ ] Benchmark against industry standards
- [ ] Team training on testing best practices

### Best Practices

1. **Write Tests First (TDD)**
   - Define expected behavior before implementation
   - Helps design better APIs and interfaces

2. **Keep Tests Independent**
   - Each test should run in isolation
   - No shared state between tests
   - Use `beforeEach` for setup

3. **Use Descriptive Test Names**
   - Describe what the test does and expects
   - Use "should" or "it" pattern
   - Example: `it('should filter conversations by status')`

4. **Mock External Dependencies**
   - Mock API calls, databases, third-party services
   - Use MSW for HTTP mocking
   - Mock time-dependent functions

5. **Test User Behavior, Not Implementation**
   - Test what the user sees and does
   - Avoid testing internal state
   - Use Testing Library queries (getByRole, getByText)

6. **Maintain Test Data**
   - Use factories or builders for test data
   - Keep test data realistic
   - Clean up after tests

7. **Monitor Test Performance**
   - Keep tests fast (< 100ms for unit tests)
   - Parallelize where possible
   - Profile slow tests

8. **Review Coverage Reports**
   - Focus on critical paths first
   - Don't chase 100% coverage everywhere
   - Identify untested edge cases

---

## Resources

### Documentation

- **Vitest:** https://vitest.dev
- **Playwright:** https://playwright.dev
- **React Testing Library:** https://testing-library.com/react
- **Convex Testing:** https://docs.convex.dev/testing
- **axe-core:** https://github.com/dequelabs/axe-core
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

### Tools

- **Codecov:** Code coverage reporting
- **Lighthouse CI:** Performance monitoring
- **Chromatic:** Visual regression testing
- **Sentry:** Error tracking
- **Datadog / New Relic:** Performance monitoring

### Learning Resources

- [Testing JavaScript (Kent C. Dodds)](https://testingjavascript.com/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Web.dev - Testing](https://web.dev/learn/testing/)
- [A11y Project](https://www.a11yproject.com/)

---

## Next Steps

1. **Phase 1:** Set up testing infrastructure (Week 1)
2. **Phase 2:** Write unit tests for UI components (Week 2)
3. **Phase 3:** Add integration tests for features (Week 3)
4. **Phase 4:** Test Convex backend (Week 4)
5. **Phase 5:** Implement E2E tests (Week 5)
6. **Phase 6:** Add accessibility tests (Week 6)
7. **Phase 7:** Performance testing (Week 7)
8. **Phase 8:** CI/CD integration (Week 8)

---

**Document Maintainers:** Development Team
**Last Review:** 2025-11-28
**Next Review:** 2025-12-28
