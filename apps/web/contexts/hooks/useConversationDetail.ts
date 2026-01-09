import { useContext, useEffect } from "react";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import { ConvexDataContext } from "../ConvexDataContext";

export const useConversationDetail = (conversationId: Id<"conversations">) => {
  const context = useContext(ConvexDataContext);
  if (!context) {
    throw new Error(
      "useConversationDetail must be used within ConvexDataProvider"
    );
  }

  // Register this conversation for subscription
  useEffect(() => {
    context.registerConversation(conversationId);
    return () => {
      context.unregisterConversation(conversationId);
    };
  }, [conversationId, context]);

  const detail = context.state.conversationDetails.get(conversationId);

  return {
    conversation: detail?.conversation ?? null,
    messages: detail?.messages ?? [],
    messagesStatus: detail?.messagesStatus ?? "LoadingFirstPage",
    isLoading: detail?.isLoading ?? true,
    loadMore: () => context.loadMoreMessages(conversationId),
  };
};
