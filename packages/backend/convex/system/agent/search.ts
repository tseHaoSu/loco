import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { rag } from "./rag";
import { internal } from "../../_generated/api";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { SEARCH_INTERPRETER_PROMPT } from "./constant";
import { supportAgent } from "./supportAgent";

export const searchKnowledgeBaseTool = createTool({
  description:
    "Search the knowledge base for relevant information to help answer user questions. Use this when you need to find specific information from uploaded documents.",
  args: z.object({
    query: z.string().describe("The search query to find relevant information"),
  }),
  handler: async (ctx, args): Promise<string> => {
    if (!ctx.threadId) {
      return "No thread ID found in context.";
    }

    const conversation = await ctx.runQuery(
      internal.system.internal.conversations.getByThreadId,
      { threadId: ctx.threadId }
    );

    if (!conversation) {
      return "No conversation found for the given thread ID.";
    }

    const organizationId = conversation.organizationId;

    const searchResults = await rag.search(ctx, {
      namespace: organizationId,
      query: args.query,
      limit: 3, // Top 3 most relevant results
    });

    if (searchResults.results.length === 0) {
      return "I couldn't find specific information about that in our knowledge base. Would you like me to connect you with a human support agent who can help?";
    }

    // Use AI to interpret the search results with the prompt
    const response = await generateText({
      model: openai.chat("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content: SEARCH_INTERPRETER_PROMPT,
        },
        {
          role: "user",
          content: `User question: ${args.query}\n\nSearch results from knowledge base:\n${searchResults.text}`,
        },
      ],
    });

    return response.text;
  },
});
