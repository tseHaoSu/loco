import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { StorageActionWriter } from "convex/server";
import { assert } from "convex-helpers";

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

async function extractImageText(url: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPTS.image,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract the text in markdown format without explaining that you will do so.",
          },
          {
            type: "image",
            image: url,
          },
        ],
      },
    ],
  });

  return result.text;
}

async function extractPdfText(url: string): Promise<string> {
  // Fetch PDF and convert to base64 (required for FilePart)
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const result = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPTS.pdf,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract the text in markdown format without explaining that you will do so.",
          },
          {
            type: "file",
            data: base64,
            mediaType: "application/pdf",
          },
        ],
      },
    ],
  });

  return result.text;
}

async function extractHtmlText(url: string): Promise<string> {
  const response = await fetch(url);
  const htmlContent = await response.text();

  const result = await generateText({
    model: AI_MODELS.html,
    system: SYSTEM_PROMPTS.html,
    messages: [
      {
        role: "user",
        content: `Extract the text in markdown format without explaining that you will do so.\n\n${htmlContent}`,
      },
    ],
  });

  return result.text;
}

export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs
): Promise<string> {
  const { storageId, mimeType } = args;

  const url = await ctx.storage.getUrl(storageId);
  assert(url, "Failed to get storage URL for text extraction.");

  // Handle images
  if (SUPPORTED_IMAGE_TYPES.some((type) => type === mimeType)) {
    return extractImageText(url);
  }

  // Handle PDFs
  if (mimeType === "application/pdf") {
    return extractPdfText(url);
  }

  // Handle HTML
  if (mimeType === "text/html") {
    return extractHtmlText(url);
  }

  throw new Error(`Unsupported MIME type for text extraction: ${mimeType}`);
}
