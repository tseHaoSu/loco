"use client";

import {
  contactSessionIdAtomFamily,
  conversationIdAtomFamily,
  organizationIdAtom,
  screenAtom,
} from "@/store/widget-atoms";
import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { MessageSquare, Clock, CheckCircle, AlertTriangle, Circle } from "lucide-react";
import { usePaginatedQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";

export const WidgetInbox = () => {
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const setConversationId = useSetAtom(
    conversationIdAtomFamily(organizationId || "")
  );

  const { results: conversations, status, loadMore } = usePaginatedQuery(
    api.public.conversations.getMany,
    contactSessionId
      ? {
          contactSessionId: contactSessionId,
        }
      : "skip",
    { initialNumItems: 10 }
  );

  const handleConversationClick = (conversationId: any) => {
    setConversationId(conversationId);
    setScreen("chat");
  };

  return (
    <div className="flex flex-col h-full px-4">
      <div className="max-w-2xl mx-auto w-full space-y-4">
        <div className="flex items-center justify-between py-2">
          <h2 className="text-lg font-semibold">Conversations</h2>
        </div>

        {status === "LoadingFirstPage" ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
            <p className="text-sm text-muted-foreground">
              Loading conversations...
            </p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
            <div className="rounded-full bg-muted/50 p-4">
              <MessageSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
              <p className="text-xs text-muted-foreground">
                Start a new conversation from the home screen
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation: any) => (
              <Button
                key={conversation._id}
                onClick={() => handleConversationClick(conversation._id)}
                variant="outline"
                className="w-full h-auto text-left p-4 justify-start hover:bg-orange-700 hover:text-white transition-colors"
              >
                <div className="flex items-start justify-between gap-3 w-full">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {conversation.status === "resolved" ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">Resolved</span>
                        </>
                      ) : conversation.status === "escalated" ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium">Escalated</span>
                        </>
                      ) : (
                        <>
                          <Circle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Active</span>
                        </>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage.text ||
                          "No message preview"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(conversation._creationTime, {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </Button>
            ))}

            {status === "CanLoadMore" && (
              <Button
                onClick={() => loadMore(10)}
                variant="outline"
                className="w-full"
              >
                Load more
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
