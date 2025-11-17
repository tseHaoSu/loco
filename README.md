# AI Voice Assistant for Customer Support

An AI-powered voice assistant designed to solve customer issues through natural voice interactions. This application leverages advanced voice AI technology to provide real-time customer support and streamline issue resolution.

## Demo

[Live Demo](https://your-demo-link-here.com)

![Application Screenshot](./docs/screenshot.png)

## Tech Stack

### Core Framework & Runtime
- **Next.js 15.4+** - React framework with App Router and Turbopack bundler
- **React 19.1+** - Latest UI library with concurrent features
- **TypeScript 5.7+** - Type-safe development with strict mode
- **Node.js ≥20** - Runtime environment

### Build & Development Tools
- **Turborepo 2.5+** - High-performance monorepo build system with intelligent caching
- **pnpm 10.20+** - Fast, disk space efficient package manager
- **Turbopack** - Next-generation bundler for development (Next.js `--turbopack` flag)
- **ESLint** - Code quality and linting
- **Prettier** - Consistent code formatting

### Backend & Data
- **Convex 1.28+** - Backend-as-a-Service with real-time database, serverless functions, and file storage
- **@convex-dev/agent 0.2+** - AI agent framework for conversation orchestration
- **Zod 3.25+** - TypeScript-first schema validation with runtime type safety

### Authentication & Authorization
- **Clerk** - Complete authentication solution with multi-organization support
  - `@clerk/nextjs` - Frontend authentication components
  - `@clerk/backend` - Backend authentication for Convex integration

### UI & Styling
- **shadcn/ui** - High-quality component library built on Radix UI primitives
- **Tailwind CSS 4.1+** - Utility-first CSS framework with new CSS-first configuration
- **Radix UI** - Unstyled, accessible component primitives
- **lucide-react** - Beautiful and consistent icon library
- **next-themes** - Theme management with dark mode support
- **class-variance-authority** - CVA for managing component variants
- **Dicebear** - Avatar generation library

### State Management
- **Jotai 2.15+** - Atomic state management for widget application
- **React Hook Form 7.66+** - Performant form state management
- **@hookform/resolvers** - Form validation resolvers for Zod integration

### AI & Voice Integration
- **@ai-sdk/openai** - OpenAI SDK integration
- **@ai-sdk/react** - AI hooks for React components
- **ai** - Vercel AI SDK for AI-powered features
- **@vapi-ai/web** - Voice AI integration for natural voice conversations (widget only)

### Utilities & Other Libraries
- **date-fns 4.1+** - Modern date utility library
- **react-markdown** - Markdown rendering in React
- **recharts** - Composable charting library for data visualization
- **sonner** - Elegant toast notifications

## Monorepo Structure

This project uses **Turborepo** with **pnpm workspaces** to manage a monorepo architecture. The repository is organized into two main directories:

### Apps (`/apps`)

User-facing applications that can be deployed independently:

- **web** - Main web dashboard application
  - Customer management interface
  - Conversation history and analytics
  - Admin panel for configuration
  - Built with Next.js, React, and Clerk authentication

- **widget** - Embeddable voice assistant widget
  - Customer-facing voice interface
  - Integrates with Vapi AI for voice interactions
  - Can be embedded on external websites
  - State management with Jotai

### Packages (`/packages`)

Shared libraries and configurations used across applications:

- **backend** - Convex backend logic
  - Database schemas and queries
  - API endpoints and mutations
  - AI agent configurations
  - Business logic and data validation

- **ui** - Shared React component library
  - shadcn/ui components
  - Reusable UI primitives
  - Consistent design system across apps

- **typescript-config** - Shared TypeScript configurations
  - Base tsconfig settings
  - Type checking rules

- **eslint-config** - Shared ESLint rules
  - Code quality standards
  - Linting configurations

## Code Structure

```
loco/
├── apps/
│   ├── web/                    # Main dashboard application
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # React components
│   │   ├── modules/            # Feature modules
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions
│   │   └── middleware.ts       # Clerk authentication middleware
│   │
│   └── widget/                 # Embeddable voice widget
│       ├── app/                # Next.js App Router pages
│       ├── components/         # React components
│       ├── modules/            # Feature modules
│       ├── hooks/              # Custom React hooks
│       ├── store/              # Jotai state management
│       └── lib/                # Utility functions
│
├── packages/
│   ├── backend/                # Convex backend
│   │   └── convex/             # Convex functions and schemas
│   │
│   ├── ui/                     # Shared UI components
│   │   └── src/                # Component source files
│   │
│   ├── typescript-config/      # TypeScript configurations
│   └── eslint-config/          # ESLint configurations
│
├── turbo.json                  # Turborepo pipeline configuration
├── pnpm-workspace.yaml         # pnpm workspace definition
└── package.json                # Root package configuration
```

## Installation

### Prerequisites

- **Node.js** >= 20
- **pnpm** 10.20.0 or higher

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd loco
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:

Create `.env.local` files in each app directory (`apps/web` and `apps/widget`) with the required API keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Convex Backend
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_deployment

# Vapi AI (widget only)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_key

# OpenAI (backend)
OPENAI_API_KEY=your_openai_key
```

4. Initialize Convex backend:
```bash
cd packages/backend
pnpm setup
```

## Development

Start all applications and packages in development mode:

```bash
pnpm dev
```

This will start:
- Web dashboard on `http://localhost:3000`
- Widget on `http://localhost:3001`
- Convex backend in development mode

### Running Individual Apps

To run a specific app:

```bash
# Web dashboard only
cd apps/web
pnpm dev

# Widget only
cd apps/widget
pnpm dev

# Backend only
cd packages/backend
pnpm dev
```

## Build

Build all applications for production:

```bash
pnpm build
```

Build individual apps:

```bash
cd apps/web
pnpm build
```

## Linting

Run linting across all workspaces:

```bash
pnpm lint
```

## Project Features

- Real-time voice conversations with AI assistant
- Customer conversation history and analytics
- Multi-tenant support with Clerk authentication
- Embeddable widget for external websites
- Real-time database synchronization with Convex
- Type-safe API layer with Zod validation
- Shared component library for consistent UI
- Monorepo architecture for code reusability

## License

[Your License Here]
