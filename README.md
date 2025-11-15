# AI Voice Assistant for Customer Support

An AI-powered voice assistant designed to solve customer issues through natural voice interactions. This application leverages advanced voice AI technology to provide real-time customer support and streamline issue resolution.

## Demo

[Live Demo](https://your-demo-link-here.com)

![Application Screenshot](./docs/screenshot.png)

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **shadcn/ui** - Reusable UI component library
- **Tailwind CSS** - Utility-first styling
- **Vapi AI** - Voice AI integration for natural conversations
- **Jotai** - State management

### Backend
- **Convex** - Backend-as-a-service with real-time database
- **Convex Agents** - AI agent orchestration
- **Clerk** - Authentication and user management
- **OpenAI SDK** - AI model integration
- **Zod** - Runtime type validation

### Development Tools
- **Turborepo** - Monorepo build system
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

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
