# Secrets Manager Integration

> **Last Updated:** 2025-11-30
>
> **Purpose:** This document explains how the application uses AWS Secrets Manager to securely store and retrieve sensitive credentials (API keys, tokens, etc.) for third-party integrations like Vapi.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Data Flow](#data-flow)
4. [Step-by-Step Process](#step-by-step-process)
5. [Code Structure](#code-structure)
6. [Security Considerations](#security-considerations)
7. [Usage Examples](#usage-examples)
8. [Environment Variables](#environment-variables)

---

## Overview

The Secrets Manager system provides a secure way to store third-party API credentials without exposing them in the codebase or database. It uses AWS Secrets Manager for encryption at rest and in transit, with automatic secret rotation capabilities.

**Key Features:**
- Centralized secret storage in AWS Secrets Manager
- Multi-tenant isolation (secrets namespaced by organization)
- Type-safe secret handling with TypeScript
- Automatic encryption and audit logging via AWS
- Upsert operations (create new or update existing secrets)

---

## Architecture

```
┌─────────────────┐
│  Client (Web)   │
│  VapiPluginForm │
└────────┬────────┘
         │
         │ useMutation(api.private.secrets.upsert)
         │ { service: "vapi", value: { publicKey, privateKey } }
         ▼
┌────────────────────────────────────────────────┐
│ Convex Backend (packages/backend/convex)       │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ private/secrets.ts (Public Mutation)     │  │
│  │                                          │  │
│  │ - Authenticates user                    │  │
│  │ - Extracts organizationId               │  │
│  │ - Schedules internal action             │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                               │
│                 │ ctx.scheduler.runAfter(0, ...)│
│                 ▼                               │
│  ┌──────────────────────────────────────────┐  │
│  │ system/agent/secrets.ts (Internal Action)│  │
│  │                                          │  │
│  │ - Constructs secret name                │  │
│  │ - Calls AWS SDK upsertSecret()          │  │
│  │ - Calls plugin.upsert mutation          │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                               │
└─────────────────┼───────────────────────────────┘
                  │
                  │ AWS SDK API Call
                  ▼
         ┌────────────────────┐
         │  AWS Secrets       │
         │  Manager           │
         │                    │
         │  Secret:           │
         │  tenant/{orgId}/   │
         │  {service}         │
         │                    │
         │  Value: {          │
         │    publicKey: "...",│
         │    privateKey: "..."│
         │  }                 │
         └────────────────────┘
                  │
                  │ Success
                  ▼
         ┌────────────────────┐
         │  Convex Database   │
         │  "plugins" table   │
         │                    │
         │  {                 │
         │    organizationId, │
         │    service,        │
         │    secretName      │
         │  }                 │
         └────────────────────┘
```

---

## Data Flow

### Phase 1: Client Mutation Call

1. **User submits form** in `VapiPluginForm.tsx`
2. **Client calls mutation**:
   ```typescript
   await upsertSecret({
     service: "vapi",
     value: {
       publicKey: "pk_...",
       privateKey: "sk_..."
     }
   });
   ```

### Phase 2: Authentication & Authorization

3. **Mutation handler** (`private/secrets.ts`) receives the request
4. **Authenticates user** via `ctx.auth.getUserIdentity()`
5. **Extracts organizationId** from the authenticated identity
6. **Validates organization membership** (throws error if missing)

### Phase 3: Internal Action Scheduling

7. **Schedules internal action** using `ctx.scheduler.runAfter(0, ...)`
   - Why schedule? To execute AWS SDK calls outside the Convex transaction
   - Actions can make external API calls (mutations cannot)

### Phase 4: AWS Secrets Manager Upsert

8. **Internal action** (`system/agent/secrets.ts`) executes
9. **Constructs secret name**:
   ```typescript
   const secretName = `tenant/${organizationId}/${service}`;
   // Example: "tenant/org_2abc123/vapi"
   ```
10. **Calls `upsertSecret()`** from `lib/secrets.ts`:
    - Creates AWS Secrets Manager client with credentials
    - Attempts to create the secret
    - If secret exists (`ResourceExistsException`), updates it instead
    - Stores the value as a JSON string

### Phase 5: Database Record Creation

11. **Calls plugin upsert mutation** (`system/agent/plugin.ts`)
12. **Stores plugin reference** in Convex database:
    ```typescript
    {
      organizationId: "org_2abc123",
      service: "vapi",
      secretName: "tenant/org_2abc123/vapi"
    }
    ```
13. **Returns success** to the client

---

## Step-by-Step Process

### Step 1: Client Initiates Request

**File:** `apps/web/modules/plugins/components/VapiPluginForm.tsx`

```typescript
const onSubmit = async (values: FormValues) => {
  try {
    await upsertSecret({
      service: "vapi",
      value: {
        publicKey: values.publicKey,
        privateKey: values.privateKey,
      },
    });

    toast.success("Vapi connected successfully!");
    setOpen(false);
  } catch (error) {
    toast.error("Failed to connect Vapi");
  }
};
```

**What happens:**
- Form values are collected and validated by Zod schema
- `upsertSecret` mutation is called with service type and credentials
- UI shows loading state during submission

---

### Step 2: Public Mutation Handler

**File:** `packages/backend/convex/private/secrets.ts`

```typescript
export const upsert = mutation({
  args: {
    service: v.union(v.literal("vapi")),
    value: v.any(), // { publicKey: string, privateKey: string }
  },

  handler: async (ctx, args) => {
    // 1. Authenticate
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User must be authenticated.",
      });
    }

    // 2. Extract organization ID
    const organizationId = identity.orgId as string;
    if (!organizationId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User does not belong to an organization.",
      });
    }

    // 3. Schedule internal action (async, non-blocking)
    await ctx.scheduler.runAfter(0, internal.system.agent.secrets.upsert, {
      service: args.service,
      organizationId: organizationId,
      value: args.value,
    });
  },
});
```

**What happens:**
- Validates user is authenticated via Clerk JWT
- Ensures user belongs to an organization (multi-tenancy)
- Schedules the AWS API call as an internal action
- Returns immediately (doesn't wait for AWS response)

---

### Step 3: Internal Action Execution

**File:** `packages/backend/convex/system/agent/secrets.ts`

```typescript
export const upsert = internalAction({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },

  handler: async (ctx, args) => {
    // 1. Construct namespaced secret name
    const secretName = `tenant/${args.organizationId}/${args.service}`;
    // Example: "tenant/org_2abc123/vapi"

    // 2. Upsert to AWS Secrets Manager
    await upsertSecret(secretName, args.value);

    // 3. Store plugin reference in database
    await ctx.runMutation(internal.system.agent.plugin.upsert, {
      organizationId: args.organizationId,
      service: args.service,
      secretName,
    });

    return { status: "success" };
  },
});
```

**What happens:**
- Constructs a namespaced secret name (tenant isolation)
- Calls AWS SDK to create or update the secret
- Stores a reference in the Convex database for querying
- Returns success status

---

### Step 4: AWS SDK Interaction

**File:** `packages/backend/convex/lib/secrets.ts`

```typescript
export async function upsertSecret(
  secretName: string,
  secretValue: Record<string, unknown>
): Promise<void> {
  const client = createSecretsManagerClient();
  const secretString = JSON.stringify(secretValue);

  try {
    // Try to create the secret
    await client.send(
      new CreateSecretCommand({
        Name: secretName,
        SecretString: secretString,
      })
    );
  } catch (error) {
    // If secret exists, update it instead
    if (error instanceof ResourceExistsException) {
      await client.send(
        new PutSecretValueCommand({
          SecretId: secretName,
          SecretString: secretString,
        })
      );
    } else {
      throw error;
    }
  }
}
```

**What happens:**
- Converts the secret object to a JSON string
- Attempts to create a new secret in AWS
- If secret already exists, updates it with new values
- AWS encrypts the secret using KMS and logs the operation

---

### Step 5: Database Reference Storage

**File:** `packages/backend/convex/system/agent/plugin.ts`

```typescript
export const upsert = internalMutation({
  args: {
    service: v.union(v.literal("vapi")),
    secretName: v.string(),
    organizationId: v.string(),
  },

  handler: async (ctx, args) => {
    const existingPlugin = await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", args.organizationId)
         .eq("service", args.service)
      )
      .unique();

    if (existingPlugin) {
      // Update existing plugin
      await ctx.db.patch(existingPlugin._id, {
        service: args.service,
        secretName: args.secretName,
      });
    } else {
      // Create new plugin record
      await ctx.db.insert("plugins", {
        organizationId: args.organizationId,
        service: args.service,
        secretName: args.secretName,
      });
    }
  },
});
```

**What happens:**
- Checks if plugin record already exists for this org + service
- Updates existing record or creates new one
- Stores the AWS secret name for future retrieval
- Enables querying which plugins are connected

---

## Code Structure

```
packages/backend/convex/
├── private/
│   └── secrets.ts              # Public mutation (client-facing)
│       └── upsert()            # Entry point from client
│
├── system/agent/
│   ├── secrets.ts              # Internal action (AWS operations)
│   │   └── upsert()            # AWS Secrets Manager interaction
│   │
│   └── plugin.ts               # Internal mutation (database)
│       └── upsert()            # Store plugin reference
│
└── lib/
    └── secrets.ts              # AWS SDK utility functions
        ├── createSecretsManagerClient()
        ├── upsertSecret()      # Create or update secret
        ├── getSecretValue()    # Retrieve secret from AWS
        └── parseSecretValue()  # Parse JSON secret
```

---

## Security Considerations

### 1. Multi-Tenancy Isolation

**Secret Naming Convention:**
```
tenant/{organizationId}/{service}
```

**Example:**
- Org A: `tenant/org_2abc123/vapi` → `{ publicKey: "pk_A", privateKey: "sk_A" }`
- Org B: `tenant/org_2xyz789/vapi` → `{ publicKey: "pk_B", privateKey: "sk_B" }`

**Isolation guarantees:**
- Each organization's secrets are stored under a unique namespace
- Users can only create/update secrets for their own organization
- No cross-tenant access possible

### 2. Authentication & Authorization

**Authentication:**
- Clerk JWT tokens validate user identity
- `ctx.auth.getUserIdentity()` verifies the token

**Authorization:**
- User must belong to an organization (`identity.orgId`)
- Only organization members can manage that org's secrets

### 3. Encryption

**At Rest:**
- AWS Secrets Manager encrypts all secrets using AWS KMS
- Keys are managed by AWS (no manual key management required)

**In Transit:**
- All AWS API calls use HTTPS/TLS encryption
- Convex → AWS communication is encrypted

### 4. Audit Logging

**AWS CloudTrail:**
- All secret operations are logged automatically
- Track who accessed secrets and when
- Compliance and security monitoring

### 5. Secret Rotation

**AWS Automatic Rotation:**
- Can be configured in AWS Secrets Manager console
- Rotates secrets on a schedule (e.g., every 30 days)
- Application retrieves the latest secret value automatically

### 6. Never Store Secrets in Database

**Best Practice:**
- Only store the **secret name** in Convex database
- Actual secret values stay in AWS Secrets Manager
- Prevents accidental exposure in database backups

---

## Usage Examples

### Creating a New Plugin Integration

**1. Add service type to schema:**

```typescript
// packages/backend/convex/schema.ts
plugins: defineTable({
  organizationId: v.string(),
  service: v.union(v.literal("vapi"), v.literal("openai")), // Add new service
  secretName: v.string(),
})
```

**2. Update mutation types:**

```typescript
// packages/backend/convex/private/secrets.ts
export const upsert = mutation({
  args: {
    service: v.union(v.literal("vapi"), v.literal("openai")), // Add here
    value: v.any(),
  },
  // ...
});
```

**3. Create a form component:**

```typescript
// apps/web/modules/plugins/components/OpenAIPluginForm.tsx
const formSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
});

const onSubmit = async (values: FormValues) => {
  await upsertSecret({
    service: "openai",
    value: {
      apiKey: values.apiKey,
    },
  });
};
```

### Retrieving Secrets in Backend

**Example: Using secrets in an AI agent**

```typescript
// packages/backend/convex/system/agent/vapiAgent.ts
import { getSecretValue, parseSecretValue } from "../../lib/secrets";

export const callVapiAPI = internalAction({
  args: { organizationId: v.string() },

  handler: async (ctx, args) => {
    // 1. Construct secret name
    const secretName = `tenant/${args.organizationId}/vapi`;

    // 2. Retrieve from AWS
    const secretValue = await getSecretValue(secretName);

    // 3. Parse the JSON
    interface VapiCredentials {
      publicKey: string;
      privateKey: string;
    }
    const credentials = parseSecretValue<VapiCredentials>(secretValue);

    // 4. Use the credentials
    const response = await fetch("https://api.vapi.ai/call", {
      headers: {
        Authorization: `Bearer ${credentials.privateKey}`,
      },
    });

    return response.json();
  },
});
```

### Deleting a Plugin (Remove Secrets)

**Note:** Currently, the `remove` mutation only deletes the database record, not the AWS secret.

**To fully remove secrets:**

```typescript
// packages/backend/convex/lib/secrets.ts
import { DeleteSecretCommand } from "@aws-sdk/client-secrets-manager";

export async function deleteSecret(secretName: string): Promise<void> {
  const client = createSecretsManagerClient();

  await client.send(
    new DeleteSecretCommand({
      SecretId: secretName,
      ForceDeleteWithoutRecovery: true, // Immediate deletion
    })
  );
}
```

---

## Environment Variables

### Required for Convex Backend

Set these in the Convex dashboard or via CLI:

```bash
# AWS Credentials
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...

# Clerk (for authentication)
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev
```

### Setting Environment Variables

**Via Convex CLI:**
```bash
cd packages/backend
npx convex env set AWS_REGION us-east-1
npx convex env set AWS_ACCESS_KEY_ID AKIA...
npx convex env set AWS_SECRET_ACCESS_KEY ...
```

**Via Convex Dashboard:**
1. Go to https://dashboard.convex.dev
2. Select your project
3. Navigate to Settings → Environment Variables
4. Add the variables

---

## Best Practices

### 1. Use IAM Roles with Least Privilege

**Example IAM Policy for Secrets Manager:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:CreateSecret",
        "secretsmanager:GetSecretValue",
        "secretsmanager:PutSecretValue",
        "secretsmanager:UpdateSecret"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:123456789012:secret:tenant/*"
    }
  ]
}
```

### 2. Namespace Secrets by Environment

**Development:**
```
dev/tenant/{organizationId}/{service}
```

**Staging:**
```
staging/tenant/{organizationId}/{service}
```

**Production:**
```
prod/tenant/{organizationId}/{service}
```

### 3. Validate Secret Structure

```typescript
// Define schema for each service
const vapiSecretSchema = z.object({
  publicKey: z.string().startsWith("pk_"),
  privateKey: z.string().startsWith("sk_"),
});

// Validate before storing
const validatedValue = vapiSecretSchema.parse(args.value);
await upsertSecret(secretName, validatedValue);
```

### 4. Handle Missing Secrets Gracefully

```typescript
try {
  const credentials = await getSecretValue(secretName);
  // Use credentials
} catch (error) {
  if (error.name === "ResourceNotFoundException") {
    throw new ConvexError({
      code: "NOT_CONFIGURED",
      message: "Vapi integration not configured for this organization.",
    });
  }
  throw error;
}
```

---

## Troubleshooting

### Issue: "ResourceNotFoundException"

**Cause:** Secret doesn't exist in AWS Secrets Manager

**Solution:**
- Verify the secret name is correct
- Check the organization ID is valid
- Ensure the secret was created successfully

### Issue: "UnrecognizedClientException"

**Cause:** Invalid AWS credentials

**Solution:**
- Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are set correctly
- Check IAM user has necessary permissions
- Ensure credentials haven't expired

### Issue: Secrets not updating

**Cause:** Caching or wrong secret ID

**Solution:**
- AWS Secrets Manager has eventual consistency
- Use `SecretId` (ARN or name) correctly in `PutSecretValueCommand`
- Check CloudTrail logs for API call success

---

## Additional Resources

- [AWS Secrets Manager Documentation](https://docs.aws.amazon.com/secretsmanager/)
- [Convex Actions Documentation](https://docs.convex.dev/functions/actions)
- [Clerk Authentication](https://clerk.com/docs)

---

**End of SECRETS_MANAGER.md**
