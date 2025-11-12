"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { usePaginatedQuery } from "convex/react";
import { ArrowUp, Check, Circle, List, X } from "lucide-react";
export const ConversationPanel = () => {
  const {
    results: conversations,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.private.conversations.getMany,
    {
      status: undefined,
    },
    {
      initialNumItems: 10,
    }
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unresolved":
        return <X className="h-4 w-4 text-red-500" />;
      case "escalated":
        return <ArrowUp className="h-4 w-4 text-yellow-500" />;
      case "resolved":
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getMessageContent = (message: any) => {
    if (!message?.message) return "";
    const content = message.message.content;
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      const textContent = content.find((c) => c.type === "text");
      return textContent?.text || "";
    }
    return "";
  };

  const getAvatarFallback = (email: string) => {
    const name = email.split("@")[0];
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-full w-full flex-col bg-background text-sidebar-foreground">
      <Select defaultValue="all" onValueChange={() => {}}>
        <SelectTrigger className="h-8 border-none px-1.5 shadow-none ring-0 hover:bg-accent focus-visible:ring-0">
          <List className="h-4 w-4" />
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="unresolved">
            <X className="h-4 w-4" />
            Unresolved
          </SelectItem>
          <SelectItem value="escalated">
            <ArrowUp className="h-4 w-4" />
            Escalated
          </SelectItem>
          <SelectItem value="resolved">
            <Check className="h-4 w-4" />
            Resolved
          </SelectItem>
        </SelectContent>
      </Select>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-3 ">
        {status === "LoadingFirstPage" && (
          <div className="flex items-center justify-center px-4 py-4">
            Loading
          </div>
        )}

        {status !== "LoadingFirstPage" &&
          (!conversations || conversations.length === 0) && (
            <div className="flex items-center justify-center px-4 py-4 text-muted-foreground">
              No conversations found
            </div>
          )}

        {conversations?.map((conversation) => (
          <div
            key={conversation._id}
            className="group flex cursor-pointer gap-3 rounded-lg border border-border bg-card px-3 py-3 transition-colors hover:bg-accent"
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">
                {getAvatarFallback(
                  conversation.contactSession?.email || "UN"
                )}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(conversation.status)}
                    <span className="text-sm font-medium capitalize group-hover:text-accent-foreground">
                      {conversation.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground group-hover:text-accent-foreground">
                    {conversation.contactSession?.email || "Unknown contact"}
                  </p>
                </div>
              </div>

              {conversation.lastMessage && (
                <p className="line-clamp-2 text-sm text-muted-foreground group-hover:text-accent-foreground">
                  {getMessageContent(conversation.lastMessage)}
                </p>
              )}
            </div>
          </div>
        ))}

        {status === "CanLoadMore" && (
          <button
            onClick={() => loadMore(10)}
            className="rounded-lg border border-border bg-card px-2 py-2 text-sm transition-colors hover:bg-accent"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
};
