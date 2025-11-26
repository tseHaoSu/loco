# Knowledge Base & Smart Search

> Your AI support agent can learn from your documents and answer customer questions accurately.

---

## What This Does

Think of it like giving your support agent a photographic memory. Upload your product docs, FAQs, pricing guides, or policies, and the AI will instantly reference them when chatting with customers.

**The magic:** Customers get accurate answers from *your* documents, not generic AI responses.

---

## How It Works

### 1. Upload Your Documents

Drag and drop files into the dashboard:
- **PDFs** (product manuals, guides)
- **Images** (screenshots, diagrams with text)
- **HTML pages** (website FAQs, blog posts)

We support most common file types up to 100MB.

### 2. AI Reads Everything

Here's what happens behind the scenes:

**For PDFs:** AI extracts all the text and structure
**For images:** AI reads any visible text (OCR) and describes what it sees
**For web pages:** AI converts HTML to clean, readable text

This all happens automatically—no manual work needed.

### 3. Smart Indexing

Your content gets broken into searchable chunks and stored as "vector embeddings" (fancy math that helps find relevant info). Each chunk is linked back to the original file.

**Pro tip:** If you upload the same file twice, we detect it and skip the duplicate processing. Smart, right?

### 4. AI Searches When Needed

When a customer asks a question, here's what happens:

```
Customer: "What's included in your Starter Plan?"
    ↓
AI Agent: "Let me check our pricing docs..."
    ↓
Searches knowledge base: finds top 3 relevant sections
    ↓
AI Agent: "Our Starter Plan is $9.99/month and includes:
           • 5 projects
           • 10GB storage
           • Email support
           • Basic analytics

           Would you like to know about our other plans?"
```

The AI automatically decides when to search your docs vs. using its general knowledge. It's context-aware and seamless.

---

## Your Data is Isolated

Each organization has its own private knowledge base. Your docs are completely separate from other companies using the platform.

**Security guarantee:** Company A can never see or search Company B's documents. Ever.

---

## What Happens to Your Files

When you upload a file:

1. **Stored securely** in Convex Storage (the original file is kept)
2. **Text extracted** using AI (GPT-4o for accuracy)
3. **Indexed** for instant semantic search
4. **Ready** for your AI agent to reference

You can delete files anytime, and they'll be removed from both storage and the search index.

---

## Technical Details (For Developers)

### Architecture

- **Storage:** Convex file storage
- **Embeddings:** OpenAI `text-embedding-3-small` (1536 dimensions)
- **Text extraction:** GPT-4o (PDFs/HTML), GPT-4o-mini (images)
- **Vector DB:** `@convex-dev/rag` component
- **Multi-tenancy:** Namespace isolation per organization

### Code Reference

**Upload handler:** `packages/backend/convex/private/files.ts`
**Search tool:** `packages/backend/convex/system/agent/search.ts`
**RAG config:** `packages/backend/convex/system/agent/rag.ts`

### Search Tool Implementation

```typescript
// When the agent needs info, it calls this tool
export const searchKnowledgeBaseTool = createTool({
  handler: async (ctx, args) => {
    // Get the conversation to find which organization
    const conversation = await ctx.runQuery(
      internal.system.internal.conversations.getByThreadId,
      { threadId: ctx.threadId }
    );

    // Search only that org's documents
    const results = await rag.search(ctx, {
      namespace: conversation.organizationId,
      query: args.query,
      limit: 3, // Top 3 most relevant chunks
    });

    // Return formatted results for the agent to use
    return results.text;
  },
});
```

The agent automatically uses this tool whenever it detects a question that might be in your knowledge base.

---

## Supported File Types

| Type | Formats | Max Size |
|------|---------|----------|
| Documents | PDF, TXT | 100MB |
| Images | PNG, JPG, GIF, WebP | 100MB |
| Web | HTML | 100MB |

---

## Performance & Costs

### Processing Time
- **Small files** (< 1MB): ~5-10 seconds
- **Large PDFs** (10-50MB): ~30-60 seconds
- **Images:** ~10-15 seconds

### AI Costs (per file)
- **Embeddings:** ~$0.02 per 1M tokens (very cheap)
- **Text extraction:** ~$0.10-2.50 depending on file size
- **OCR (images):** ~$0.15 per image (using GPT-4o-mini for cost efficiency)

We automatically deduplicate files to save on processing costs.

---

## Tips for Best Results

**1. Keep docs focused**
Upload specific guides rather than giant PDFs with everything. Smaller, focused documents = better search results.

**2. Use clear filenames**
"Pricing_Guide.pdf" is better than "doc_final_v3.pdf"

**3. Update regularly**
When you change policies or pricing, replace the old document. The AI will always use the latest version.

**4. Test your agent**
After uploading docs, chat with your agent to see if it finds the right info. Adjust your documents if needed.

---

## Troubleshooting

**"My agent isn't finding my documents"**
- Check that the file uploaded successfully
- Try asking more specific questions
- Make sure the content is actually in the document (we only search the extracted text)

**"Upload failed"**
- Check file size (max 100MB)
- Verify file type is supported
- Make sure the file isn't corrupted

**"Search results aren't relevant"**
- Try rephrasing the question
- Upload more specific documents about that topic
- Check if the content exists in your uploaded files

---

## What's Next

We're working on:
- Support for more file types (DOCX, Excel, etc.)
- Bulk upload via API
- Advanced filtering by category/date
- File versioning
- Better duplicate detection

---

**Questions?** Check out the main docs or contact support.

**Last Updated:** 2025-11-26
