"use client";

import { type PropsWithChildren, useState, useCallback, useMemo, useRef, useEffect } from "react";
import { usePaginatedQuery, useQuery, useAction } from "convex/react";
import { useThreadMessages } from "@convex-dev/agent/react";
import { useOrganization } from "@clerk/nextjs";
import type { FunctionReturnType } from "convex/server";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";

import {
  ConvexDataContext,
  type FilterStatus,
  type ConvexDataContextValue,
  type VapiAssistant,
  type VapiPhoneNumber,
} from "./ConvexDataContext";

type VapiPhoneNumbersResponse = FunctionReturnType<typeof api.private.vapi.getPhoneNumber>;
type VapiAssistantsResponse = FunctionReturnType<typeof api.private.vapi.getAssistant>;

export const ConvexDataProvider = ({ children }: PropsWithChildren) => {
  const { organization } = useOrganization();
  const prevOrgIdRef = useRef(organization?.id);

  // Filter state
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("conversationFilter");
      return (saved as FilterStatus) || "all";
    }
    return "all";
  });

  // Active conversation IDs for dynamic subscription
  const [activeConversationIds, setActiveConversationIds] = useState<Set<Id<"conversations">>>(
    new Set()
  );

  // Conversations list
  const conversations = usePaginatedQuery(
    api.private.conversations.getMany,
    {
      status: filterStatus === "all" ? undefined : filterStatus,
    },
    { initialNumItems: 10 }
  );

  // Files list
  const files = usePaginatedQuery(
    api.private.files.list,
    {},
    { initialNumItems: 10 }
  );

  // Widget settings
  const widgetSettings = useQuery(api.private.widgetSettings.getOne);

  // Vapi plugin
  const vapiPlugin = useQuery(api.private.plugin.getOne, { service: "vapi" });

  // Vapi actions
  const getVapiPhoneNumbers = useAction(api.private.vapi.getPhoneNumber);
  const getVapiAssistants = useAction(api.private.vapi.getAssistant);

  // Vapi data state
  const [vapiData, setVapiData] = useState<{
    assistants: VapiAssistant[];
    phoneNumbers: VapiPhoneNumber[];
    isLoading: boolean;
  }>({
    assistants: [],
    phoneNumbers: [],
    isLoading: false,
  });

  // Conversation details map
  const conversationDetailsMapRef = useRef<Map<
    Id<"conversations">,
    {
      conversation: ReturnType<typeof useQuery>;
      messages: ReturnType<typeof useThreadMessages>;
    }
  >>(new Map());

  // Contact sessions map
  const contactSessionsMapRef = useRef<Map<
    Id<"conversations">,
    ReturnType<typeof useQuery>
  >>(new Map());

  // Register conversation for subscription
  const registerConversation = useCallback((id: Id<"conversations">) => {
    setActiveConversationIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Unregister conversation
  const unregisterConversation = useCallback((id: Id<"conversations">) => {
    setActiveConversationIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Set filter and persist to localStorage
  const setConversationFilter = useCallback((filter: FilterStatus) => {
    setFilterStatus(filter);
    if (typeof window !== "undefined") {
      localStorage.setItem("conversationFilter", filter);
    }
  }, []);

  // Wrapper functions for pagination
  const wrappedLoadMoreConversations = useCallback(() => {
    conversations.loadMore(10);
  }, [conversations]);

  const wrappedLoadMoreFiles = useCallback(() => {
    files.loadMore(10);
  }, [files]);

  // Refresh Vapi data
  const refreshVapiData = useCallback(async () => {
    setVapiData((prev) => ({ ...prev, isLoading: true }));
    try {
      const [phoneNumbers, assistants] = await Promise.all([
        getVapiPhoneNumbers({}).catch(() => [] as VapiPhoneNumbersResponse),
        getVapiAssistants({}).catch(() => [] as VapiAssistantsResponse),
      ]);

      setVapiData({
        phoneNumbers: (phoneNumbers || []) as VapiPhoneNumber[],
        assistants: (assistants || []) as VapiAssistant[],
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to refresh Vapi data:", error);
      setVapiData({
        assistants: [],
        phoneNumbers: [],
        isLoading: false,
      });
    }
  }, [getVapiPhoneNumbers, getVapiAssistants]);

  // Load Vapi data on mount if plugin is connected
  useEffect(() => {
    if (vapiPlugin) {
      refreshVapiData();
    }
  }, [vapiPlugin, refreshVapiData]);

  // Reset cache on org change
  useEffect(() => {
    if (prevOrgIdRef.current && prevOrgIdRef.current !== organization?.id) {
      conversationDetailsMapRef.current.clear();
      contactSessionsMapRef.current.clear();
      setActiveConversationIds(new Set());
      setFilterStatus("all");
      setVapiData({
        assistants: [],
        phoneNumbers: [],
        isLoading: false,
      });
    }
    prevOrgIdRef.current = organization?.id;
  }, [organization?.id]);

  // Build conversation details map
  const conversationDetailsMap = useMemo(() => {
    const map = new Map();
    activeConversationIds.forEach((id) => {
      const data = conversationDetailsMapRef.current.get(id);
      if (data) {
        map.set(id, {
          conversation: data.conversation,
          messages: data.messages?.results ?? [],
          messagesStatus: data.messages?.status ?? "LoadingFirstPage",
          isLoading: data.conversation === undefined,
        });
      }
    });
    return map;
  }, [activeConversationIds]);

  // Build contact sessions map
  const contactSessionsMap = useMemo(() => {
    const map = new Map();
    activeConversationIds.forEach((id) => {
      const data = contactSessionsMapRef.current.get(id);
      if (data !== undefined) {
        map.set(id, data);
      }
    });
    return map;
  }, [activeConversationIds]);

  // Load more for messages
  const loadMoreMessages = useCallback((conversationId: Id<"conversations">) => {
    const data = conversationDetailsMapRef.current.get(conversationId);
    if (data?.messages?.loadMore) {
      data.messages.loadMore(10);
    }
  }, []);

  // Context value
  const value: ConvexDataContextValue = useMemo(
    () => ({
      state: {
        conversations: {
          items: conversations.results ?? [],
          status: conversations.status,
          filterStatus,
          isLoading: conversations.status === "LoadingFirstPage",
        },
        conversationDetails: conversationDetailsMap,
        contactSessions: contactSessionsMap,
        files: {
          items: files.results ?? [],
          status: files.status,
          isLoading: files.status === "LoadingFirstPage",
        },
        widgetSettings,
        vapiPlugin,
        vapiData,
      },
      loadMoreConversations: wrappedLoadMoreConversations,
      loadMoreFiles: wrappedLoadMoreFiles,
      loadMoreMessages,
      setConversationFilter,
      registerConversation,
      unregisterConversation,
      refreshVapiData,
    }),
    [
      conversations.results,
      conversations.status,
      wrappedLoadMoreConversations,
      filterStatus,
      conversationDetailsMap,
      contactSessionsMap,
      files.results,
      files.status,
      wrappedLoadMoreFiles,
      widgetSettings,
      vapiPlugin,
      vapiData,
      loadMoreMessages,
      setConversationFilter,
      registerConversation,
      unregisterConversation,
      refreshVapiData,
    ]
  );

  return (
    <ConvexDataContext.Provider value={value}>
      {children}
      <ConversationDetailsSubscriber
        activeIds={activeConversationIds}
        conversationDetailsMapRef={conversationDetailsMapRef}
        contactSessionsMapRef={contactSessionsMapRef}
      />
    </ConvexDataContext.Provider>
  );
};

// Separate component to handle dynamic subscriptions
interface ConversationDetailsSubscriberProps {
  activeIds: Set<Id<"conversations">>;
  conversationDetailsMapRef: React.MutableRefObject<Map<Id<"conversations">, unknown>>;
  contactSessionsMapRef: React.MutableRefObject<Map<Id<"conversations">, unknown>>;
}

const ConversationDetailsSubscriber = ({
  activeIds,
  conversationDetailsMapRef,
  contactSessionsMapRef,
}: ConversationDetailsSubscriberProps) => {
  const idsArray = Array.from(activeIds);

  return (
    <>
      {idsArray.map((id) => (
        <ConversationDetailLoader
          key={id}
          conversationId={id}
          conversationDetailsMapRef={conversationDetailsMapRef}
          contactSessionsMapRef={contactSessionsMapRef}
        />
      ))}
    </>
  );
};

interface ConversationDetailLoaderProps {
  conversationId: Id<"conversations">;
  conversationDetailsMapRef: React.MutableRefObject<Map<Id<"conversations">, unknown>>;
  contactSessionsMapRef: React.MutableRefObject<Map<Id<"conversations">, unknown>>;
}

const ConversationDetailLoader = ({
  conversationId,
  conversationDetailsMapRef,
  contactSessionsMapRef,
}: ConversationDetailLoaderProps) => {
  const conversation = useQuery(api.private.conversations.getOne, { conversationId });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: 10 }
  );

  const contactSession = useQuery(
    api.private.contactSessions.getOneByConversationId,
    { conversationId }
  );

  // Store in refs
  useEffect(() => {
    conversationDetailsMapRef.current.set(conversationId, {
      conversation,
      messages,
    });
  }, [conversationId, conversation, messages, conversationDetailsMapRef]);

  useEffect(() => {
    contactSessionsMapRef.current.set(conversationId, contactSession);
  }, [conversationId, contactSession, contactSessionsMapRef]);

  return null;
};
