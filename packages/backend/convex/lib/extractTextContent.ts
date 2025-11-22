import { openai } from "@ai-sdk/openai";
import { StorageActionWriter } from "convex/server";

export type ExtractTextContentArgs = {
  storageId: string;
  filename: string;
  bytes?: ArrayBuffer;
  mimeType: string;
};

const SYSTEM_PROMPTS = {
  image: `You are a text extraction assistant for images. Your task:
- If the image is a photo of a document (text, forms, receipts, screenshots, etc.), transcribe all text accurately
- If the image is NOT a document (photos of objects, scenes, people, etc.), describe what you see
- Preserve formatting and structure when transcribing documents
- Be concise but complete in your output`,

  pdf: `You are a PDF text extraction assistant. Your task:
- Extract all text content from the PDF file
- Preserve the document structure and formatting
- Maintain paragraph breaks and logical sections
- Include all readable text from the document`,

  html: `You are an HTML content extraction assistant. Your task:
- Convert HTML content into clean, readable Markdown format
- Preserve heading hierarchy (h1 → #, h2 → ##, etc.)
- Convert links to [text](url) format
- Convert lists, tables, and other structured content to Markdown equivalents
- Remove navigation, ads, and non-content elements
- Focus on the main content only`,
} as const;

const AI_MODELS = {
  image: openai.chat("gpt-4o-mini"),
  pdf: openai.chat("gpt-4o"),
  html: openai.chat("gpt-4o"),
} as const;

const SUPPORTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
];

export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs
): Promise<string> {
  const { storageId, filename, bytes, mimeType } = args;

  // Get the file blob from storage (replaces deprecated getUrl)
  const blob = await ctx.storage.get(storageId);
  if (!blob) {
    throw new Error(`File not found in storage: ${storageId}`);
  }

  // Use provided bytes or get from storage
  const fileBytes = bytes ?? (await blob.arrayBuffer());

  // TODO: Implement text extraction logic based on mimeType
  return "";
}
