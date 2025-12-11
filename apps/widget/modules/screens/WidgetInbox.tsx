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
import {
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Circle,
} from "lucide-react";
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

  const {
    results: conversations,
    status,
    loadMore,
  } = usePaginatedQuery(
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
    <div className="flex flex-col gap-3 px-4 py-3">
      {!contactSessionId ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-sm text-muted-foreground">No conversations yet</p>
            <p className="text-xs text-muted-foreground">
              Start a new conversation from the home screen
            </p>
          </div>
        </div>
      ) : status === "LoadingFirstPage" ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      ) : conversations && conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            Start a new conversation from the home screen
          </p>
        </div>
      ) : (
        <>
          {conversations.map((conversation: any) => (
            <Button
              key={conversation._id}
              onClick={() => handleConversationClick(conversation._id)}
              variant="ghost"
              size="sm"
              className="h-auto justify-start gap-3 rounded-xl bg-muted/50 px-4 py-4 text-left transition-all hover:bg-muted"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                {conversation.status === "resolved" ? (
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                ) : conversation.status === "escalated" ? (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                ) : (
                  <Circle className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {conversation.status === "resolved"
                      ? "Resolved"
                      : conversation.status === "escalated"
                        ? "Escalated"
                        : "Active"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(conversation._creationTime, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                {conversation.lastMessage && (
                  <p className="truncate text-xs text-muted-foreground">
                    {conversation.lastMessage.text || "No message preview"}
                  </p>
                )}
              </div>
            </Button>
          ))}

          {status === "CanLoadMore" && (
            <Button
              onClick={() => loadMore(10)}
              variant="ghost"
              size="sm"
              className="rounded-xl bg-muted/30 text-xs text-muted-foreground hover:bg-muted"
            >
              Load more
            </Button>
          )}
        </>
      )}
    </div>
  );
};
