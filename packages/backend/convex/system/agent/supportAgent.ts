import { components } from "../../_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { resolveConversationTool } from "./resolveConversationTool";
import { escalateConversationTool } from "./escalateConversation";
import { searchKnowledgeBaseTool } from "./search";
import { SUPPORT_AGENT_PROMPT } from "./constant";

export const supportAgent = new Agent(components.agent, {
  name: "supportAgent",
  languageModel: openai.chat("gpt-4o-mini"),
  instructions: SUPPORT_AGENT_PROMPT,
  tools: {
    searchKnowledgeBase: searchKnowledgeBaseTool,
    resolveConversation: resolveConversationTool,
    escalateConversation: escalateConversationTool,
  },
});
