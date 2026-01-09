"use client";

import { createContext } from "react";
import type { PaginationStatus } from "convex/react";
import type { Doc, Id } from "@workspace/backend/convex/_generated/dataModel";

// EntryId type from RAG
type EntryId = string & { _: "EntryId" };

export type FilterStatus = "all" | "unresolved" | "escalated" | "resolved";

export interface VapiAssistant {
  id: string;
  name: string;
}

export interface VapiPhoneNumber {
  id: string;
  number: string;
  name?: string;
}

// Message content type
interface MessageContentPart {
  type: string;
  text?: string;
}

type MessageContent = string | MessageContentPart[];

// Last message type from backend
interface LastMessage {
  message?: {
    content?: MessageContent;
  };
}

// Enriched conversation type with joined data
export type EnrichedConversation = Doc<"conversations"> & {
  lastMessage: LastMessage | null;
  contactSession: Doc<"contactSessions"> | null;
};

export interface ConversationData {
  items: EnrichedConversation[];
  status: PaginationStatus;
  filterStatus: FilterStatus;
  isLoading: boolean;
}

export interface ConversationDetailData {
  conversation: Doc<"conversations"> | null | undefined;
  messages: MessageDoc[];
  messagesStatus: PaginationStatus;
  isLoading: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MessageDoc = any;

export interface PublicFile {
  id: EntryId;
  name: string;
  type: string;
  size: string;
  status: "ready" | "processing" | "error";
  url: string | null;
  category?: string;
}

export interface FilesData {
  items: PublicFile[];
  status: PaginationStatus;
  isLoading: boolean;
}

export interface ConvexCacheState {
  conversations: ConversationData;
  conversationDetails: Map<Id<"conversations">, ConversationDetailData>;
  contactSessions: Map<Id<"conversations">, Doc<"contactSessions"> | null | undefined>;
  files: FilesData;
  widgetSettings: Doc<"widgetSettings"> | null | undefined;
  vapiPlugin: Doc<"plugins"> | null | undefined;
  vapiData: {
    assistants: VapiAssistant[];
    phoneNumbers: VapiPhoneNumber[];
    isLoading: boolean;
  };
}

export interface ConvexDataContextValue {
  state: ConvexCacheState;

  // Actions
  loadMoreConversations: () => void;
  loadMoreFiles: () => void;
  loadMoreMessages: (conversationId: Id<"conversations">) => void;
  setConversationFilter: (filter: FilterStatus) => void;

  // Dynamic subscription management
  registerConversation: (id: Id<"conversations">) => void;
  unregisterConversation: (id: Id<"conversations">) => void;

  // Vapi data refresh
  refreshVapiData: () => void;
}

export const ConvexDataContext = createContext<ConvexDataContextValue | null>(
  null
);
