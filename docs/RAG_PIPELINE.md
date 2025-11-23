# RAG Pipeline Documentation

> **RAG (Retrieval-Augmented Generation)** enables AI agents to search and reference uploaded documents when answering customer questions.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Upload Pipeline](#upload-pipeline)
3. [Search Pipeline](#search-pipeline)
4. [Multi-Tenancy Architecture](#multi-tenancy-architecture)
5. [Technical Implementation](#technical-implementation)
6. [Code Examples](#code-examples)

---

## System Overview

### What is RAG?

RAG combines:
- **Retrieval**: Finding relevant information from a knowledge base
- **Augmented**: Enhancing AI responses with retrieved context
- **Generation**: Creating answers using both AI knowledge and retrieved documents

### Our Implementation

```
┌─────────────────────────────────────────────────────────────┐
│                     Loco RAG System                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📁 Document Storage    →  🧠 Vector Database               │
│  (Convex Storage)          (OpenAI Embeddings)              │
│                                                             │
│  🔍 Semantic Search     →  🤖 AI Agents                     │
│  (Similarity Search)       (Answer Questions)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Components:**
- **Convex Storage**: Stores original files (PDFs, images, HTML)
- **@convex-dev/rag**: Manages vector embeddings and search
- **OpenAI API**: Generates embeddings and extracts text
- **Multi-tenant Isolation**: Each organization has a separate namespace

---

## Upload Pipeline

### Complete File Upload Flow

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Step 1: User Uploads File                                  │
│  ┌────────────────────┐                                     │
│  │  📄 document.pdf    │                                     │
│  │  🖼️  screenshot.png │                                     │
│  │  📝 webpage.html    │                                     │
│  └─────────┬──────────┘                                     │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────────────────────────┐                │
│  │  File → Blob → ArrayBuffer              │                │
│  │  MIME type detection                    │                │
│  └─────────┬───────────────────────────────┘                │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────────────────────────┐                │
│  │  Step 2: Store in Convex Storage        │                │
│  │  ┌────────────────────────┐             │                │
│  │  │ ctx.storage.store()    │             │                │
│  │  │ → Returns: storageId   │             │                │
│  │  └────────────────────────┘             │                │
│  └─────────┬───────────────────────────────┘                │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────────────────────────┐                │
│  │  Step 3: AI Text Extraction             │                │
│  │  ┌────────────────────────────────────┐ │                │
│  │  │  extractTextContent()              │ │                │
│  │  │                                    │ │                │
│  │  │  📄 PDF → GPT-4o                   │ │                │
│  │  │    "Extract structured text..."   │ │                │
│  │  │                                    │ │                │
│  │  │  🖼️ Image → GPT-4o-mini (Vision)  │ │                │
│  │  │    "Describe and transcribe..."   │ │                │
│  │  │                                    │ │                │
│  │  │  📝 HTML → GPT-4o                  │ │                │
│  │  │    "Convert to Markdown..."       │ │                │
│  │  │                                    │ │                │
│  │  │  → Returns: Extracted text        │ │                │
│  │  └────────────────────────────────────┘ │                │
│  └─────────┬───────────────────────────────┘                │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────────────────────────┐                │
│  │  Step 4: RAG Processing                 │                │
│  │  ┌────────────────────────────────────┐ │                │
│  │  │  rag.add(ctx, {                    │ │                │
│  │  │    namespace: "org_xyz123",        │ │                │
│  │  │    text: extractedText,            │ │                │
│  │  │    metadata: {...}                 │ │                │
│  │  │  })                                │ │                │
│  │  │                                    │ │                │
│  │  │  What happens inside:              │ │                │
│  │  │  ┌──────────────────────────────┐ │ │                │
│  │  │  │ 1. Chunk text into pieces    │ │ │                │
│  │  │  │    (overlap for context)     │ │ │                │
│  │  │  └──────────────────────────────┘ │ │                │
│  │  │  ┌──────────────────────────────┐ │ │                │
│  │  │  │ 2. Generate embeddings       │ │ │                │
│  │  │  │    OpenAI text-embedding-3   │ │ │                │
│  │  │  │    → 1536-dim vectors        │ │ │                │
│  │  │  └──────────────────────────────┘ │ │                │
│  │  │  ┌──────────────────────────────┐ │ │                │
│  │  │  │ 3. Store in vector DB        │ │ │                │
│  │  │  │    - Text chunks             │ │ │                │
│  │  │  │    - Vector embeddings       │ │ │                │
│  │  │  │    - Metadata                │ │ │                │
│  │  │  │    - Content hash (dedup)    │ │ │                │
│  │  │  └──────────────────────────────┘ │ │                │
│  │  └────────────────────────────────────┘ │                │
│  └─────────┬───────────────────────────────┘                │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────────────────────────┐                │
│  │  Step 5: Ready for Search!              │                │
│  │  ✅ File stored                          │                │
│  │  ✅ Text extracted                       │                │
│  │  ✅ Vectors generated                    │                │
│  │  ✅ AI can now reference this document  │                │
│  └─────────────────────────────────────────┘                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Key Features

#### 1. **Content Deduplication**
```typescript
contentHash: await contentHashFromArrayBuffer(bytes)
```
- Generates a unique hash from file contents
- If the same file is uploaded twice, it's detected
- Only one copy stored in vector DB
- Duplicate storage entries are cleaned up

#### 2. **AI-Powered Text Extraction**
| File Type | AI Model | Purpose |
|-----------|----------|---------|
| Images (PNG, JPG, GIF, WebP) | GPT-4o-mini | Cost-effective vision for OCR & description |
| PDFs | GPT-4o | Better structured text extraction |
| HTML | GPT-4o | Convert to clean Markdown |

#### 3. **Metadata Storage**
```typescript
metadata: {
  storageId: "kg2abc...",
  uploadedBy: "org_xyz123",
  filename: "Q3_Report.pdf",
  category: "financial"
}
```
- Stores file reference and context
- Links back to original file in storage
- Enables filtering and categorization

---

## Search Pipeline

### How AI Agents Find Relevant Documents

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  User Question                                               │
│  ┌────────────────────────────────────┐                     │
│  │ "What was our Q3 revenue?"         │                     │
│  └─────────┬──────────────────────────┘                     │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────────────────────────┐                │
│  │  Step 1: Generate Query Embedding       │                │
│  │  ┌────────────────────────────────────┐ │                │
│  │  │  OpenAI Embedding API              │ │                │
│  │  │  "What was our Q3 revenue?"        │ │                │
│  │  │  → [0.123, -0.456, 0.789, ...]     │ │                │
│  │  │  (1536-dimensional vector)         │ │                │
│  │  └────────────────────────────────────┘ │                │
│  └─────────┬───────────────────────────────┘                │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────────────────────────┐                │
│  │  Step 2: Vector Similarity Search       │                │
│  │  ┌────────────────────────────────────┐ │                │
│  │  │  rag.search(ctx, {                 │ │                │
│  │  │    namespace: "org_xyz123",        │ │                │
│  │  │    query: "Q3 revenue",            │ │                │
│  │  │    limit: 10                       │ │                │
│  │  │  })                                │ │                │
│  │  │                                    │ │                │
│  │  │  Compares query vector with all    │ │                │
│  │  │  document vectors in namespace     │ │                │
│  │  │                                    │ │                │
│  │  │  Returns top 10 most similar:      │ │                │
│  │  │  ┌──────────────────────────────┐ │ │                │
│  │  │  │ 1. "Q3 revenue: $5M..." ✅   │ │ │                │
│  │  │  │    Similarity: 0.92          │ │ │                │
│  │  │  │ 2. "Q4 forecast..." ✅       │ │ │                │
│  │  │  │    Similarity: 0.78          │ │ │                │
│  │  │  │ 3. "Revenue growth..." ✅    │ │ │                │
│  │  │  │    Similarity: 0.75          │ │ │                │
│  │  │  └──────────────────────────────┘ │ │                │
│  │  └────────────────────────────────────┘ │                │
│  └─────────┬───────────────────────────────┘                │
│            │                                                 │
│            ▼                                                 │
│  ┌─────────────────────────────────────────┐                │
│  │  Step 3: AI Agent Uses Context          │                │
│  │  ┌────────────────────────────────────┐ │                │
│  │  │  System Prompt:                    │ │                │
│  │  │  "You are a support agent.         │ │                │
│  │  │   Use these documents to answer:"  │ │                │
│  │  │                                    │ │                │
│  │  │  Context:                          │ │                │
│  │  │  - Q3 revenue: $5M...              │ │                │
│  │  │  - Q4 forecast...                  │ │                │
│  │  │  - Revenue growth...               │ │                │
│  │  │                                    │ │                │
│  │  │  Question: "What was Q3 revenue?"  │ │                │
│  │  │                                    │ │                │
│  │  │  → AI Response:                    │ │                │
│  │  │  "Our Q3 revenue was $5M,          │ │                │
│  │  │   as shown in the Q3 report."      │ │                │
│  │  └────────────────────────────────────┘ │                │
│  └─────────────────────────────────────────┘                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Multi-Tenancy Architecture

### Namespace Isolation

**Critical Feature:** Each organization's documents are completely isolated.

```
┌─────────────────────────────────────────────────────────────┐
│                     Vector Database                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Namespace: "org_acme_corp"                                 │
│  ┌───────────────────────────────────────────────┐         │
│  │ 📄 "Our Q3 revenue is $5M"                     │         │
│  │ 📄 "Product roadmap for 2025"                  │         │
│  │ 📄 "Customer support policies"                 │         │
│  └───────────────────────────────────────────────┘         │
│                                                             │
│  Namespace: "org_startup_xyz"                               │
│  ┌───────────────────────────────────────────────┐         │
│  │ 📄 "Our Q3 revenue is $2M"                     │         │
│  │ 📄 "Investor pitch deck"                       │         │
│  │ 📄 "Hiring guidelines"                         │         │
│  └───────────────────────────────────────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**How It Works:**

```typescript
// Upload (automatically scoped to org)
const organizationId = identity.orgId; // "org_acme_corp"

await rag.add(ctx, {
  namespace: organizationId,  // ✅ Isolated to this org
  text: "Our Q3 revenue is $5M",
  // ...
});

// Search (automatically filtered)
const results = await rag.search(ctx, {
  namespace: organizationId,  // ✅ Only searches this org's docs
  query: "Q3 revenue",
});
// Returns: "Our Q3 revenue is $5M" (from org_acme_corp only)
```

**Security Guarantees:**
- ✅ Org A **cannot** see Org B's documents
- ✅ Org A **cannot** search Org B's documents
- ✅ Each namespace is completely isolated
- ✅ No cross-organization data leakage

---

## Technical Implementation

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Technology Stack                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📦 @convex-dev/rag v0.6+                                   │
│     - Vector database management                            │
│     - Embedding generation                                  │
│     - Similarity search                                     │
│                                                             │
│  🤖 OpenAI APIs                                             │
│     - text-embedding-3-small (1536 dims)                    │
│     - gpt-4o (text extraction)                              │
│     - gpt-4o-mini (vision/OCR)                              │
│                                                             │
│  💾 Convex Storage                                          │
│     - Blob storage for original files                       │
│     - URL generation for downloads                          │
│                                                             │
│  🔐 Clerk Authentication                                    │
│     - Organization ID (orgId) for namespacing               │
│     - User identity and permissions                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

```typescript
// RAG stores these internally:
{
  entryId: "entry_abc123",           // Unique ID
  namespace: "org_xyz123",           // Organization isolation
  text: "Full extracted text...",    // Searchable text
  chunks: [                          // Text split into chunks
    { text: "Chunk 1...", embedding: [...] },
    { text: "Chunk 2...", embedding: [...] }
  ],
  metadata: {                        // Custom metadata
    storageId: "kg2abc...",          // Link to storage
    uploadedBy: "org_xyz123",
    filename: "report.pdf",
    category: "financial",
    status: "ready"
  },
  contentHash: "sha256...",          // Deduplication
  _creationTime: 1234567890
}
```

### Key Configuration

**File:** `packages/backend/convex/system/agent/rag.ts`

```typescript
export const rag = new Rag({
  model: "text-embedding-3-small",  // Embedding model
  dimensions: 1536,                 // Vector dimensions
});
```

**File:** `packages/backend/convex/convex.config.ts`

```typescript
import { defineConfig } from "convex/server";
import { rag } from "./system/agent/rag";

export default defineConfig({
  app: {
    rag: rag.component,  // ✅ RAG system enabled
  },
});
```

---

## Code Examples

### Complete Upload Example

```typescript
// File: packages/backend/convex/private/files.ts

export const addFile = action({
  args: {
    filename: v.string(),
    mimeType: v.string(),
    bytes: v.bytes(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication & Authorization
    const identity = await ctx.auth.getUserIdentity();
    const organizationId = identity.orgId;

    // 2. Store file in Convex Storage
    const blob = new Blob([args.bytes], { type: args.mimeType });
    const storageId = await ctx.storage.store(blob);

    // 3. Extract text using AI
    const text = await extractTextContent(ctx, {
      storageId,
      filename: args.filename,
      bytes: args.bytes,
      mimeType: args.mimeType,
    });

    // 4. Add to RAG system
    const { entryId, created } = await rag.add(ctx, {
      namespace: organizationId,       // Multi-tenant isolation
      text,                            // Searchable text
      key: args.filename,
      title: args.filename,
      metadata: {                      // Custom metadata
        storageId,
        uploadedBy: organizationId,
        filename: args.filename,
        category: args.category ?? null,
      },
      contentHash: await contentHashFromArrayBuffer(args.bytes),
    });

    // 5. Cleanup duplicates
    if (!created) {
      await ctx.storage.delete(storageId as Id<"_storage">);
    }

    return { url: await ctx.storage.getUrl(storageId), entryId };
  },
});
```

### Search Example

```typescript
// Example: AI agent searching for relevant documents

const results = await rag.search(ctx, {
  namespace: organizationId,  // Only search this org's docs
  query: "What are our support hours?",
  limit: 5,                   // Top 5 most relevant chunks
});

// Use results in AI prompt
const context = results.map(r => r.text).join("\n\n");
const systemPrompt = `
You are a support agent. Use these documents to answer:

${context}

Question: What are our support hours?
`;
```

### List Files Example

```typescript
export const list = query({
  args: {
    category: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const organizationId = identity.orgId;

    // Get namespace for organization
    const namespace = await rag.getNamespace(ctx, {
      namespace: organizationId,
    });

    if (!namespace) {
      // No files uploaded yet
      return {
        page: [],
        isDone: true,
        continueCursor: args.paginationOpts.endCursor ?? "",
      };
    }

    // List all entries in namespace
    const results = await rag.list(ctx, {
      namespaceId: namespace.namespaceId,
      paginationOpts: args.paginationOpts,
    });

    // Convert to public file format
    const files = await Promise.all(
      results.page.map(entry => convertEntryToPublicFile(ctx, entry))
    );

    return {
      page: files,
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    };
  },
});
```

---

## Performance & Optimization

### Embedding Costs

| Operation | Model | Cost (per 1M tokens) |
|-----------|-------|---------------------|
| Generate embeddings | text-embedding-3-small | ~$0.02 |
| Extract PDF text | gpt-4o | ~$2.50 input |
| OCR images | gpt-4o-mini | ~$0.15 input |

### Best Practices

1. **Chunking Strategy**
   - Default chunk size: ~500 tokens
   - Overlap between chunks for context
   - Automatic by `@convex-dev/rag`

2. **Deduplication**
   - Content hash prevents duplicate processing
   - Saves embedding costs
   - Keeps vector DB clean

3. **Metadata Filtering**
   - Use categories to filter results
   - Store relevant context in metadata
   - Enables semantic + metadata filtering

4. **Error Handling**
   - Graceful fallbacks if files are deleted
   - Status tracking (ready/processing/error)
   - Detailed error logging

---

## Troubleshooting

### Common Issues

**Q: Why can't I find my uploaded document?**
- Check namespace is correct (organizationId)
- Verify text extraction succeeded
- Check if file was deduplicated

**Q: Search results are not relevant**
- Embeddings might not match query type
- Try more specific queries
- Increase result limit

**Q: File upload fails**
- Check MIME type is supported
- Verify file size limits
- Check OpenAI API key is valid

---

## Future Enhancements

- [ ] Support more file types (DOCX, Excel, etc.)
- [ ] Custom chunking strategies
- [ ] Hybrid search (semantic + keyword)
- [ ] File version tracking
- [ ] Batch upload API
- [ ] Advanced metadata filtering

---

**Last Updated:** 2025-11-23
**Maintained by:** Loco Development Team
