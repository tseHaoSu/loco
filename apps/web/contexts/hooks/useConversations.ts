import { useContext } from "react";
import { ConvexDataContext } from "../ConvexDataContext";

export const useConversations = () => {
  const context = useContext(ConvexDataContext);
  if (!context) {
    throw new Error("useConversations must be used within ConvexDataProvider");
  }

  const { conversations } = context.state;

  return {
    conversations: conversations.items,
    status: conversations.status,
    filterStatus: conversations.filterStatus,
    isLoading: conversations.isLoading,
    hasMore: conversations.status === "CanLoadMore",
    loadMore: context.loadMoreConversations,
    setFilter: context.setConversationFilter,
  };
};
