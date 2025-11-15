"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { usePaginatedQuery } from "convex/react";
import { ArrowUp, Check, Circle, CornerUpLeft, List, X } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type FilterStatus = "all" | "unresolved" | "escalated" | "resolved";

export const ConversationPanel = () => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const pathname = usePathname();
  const router = useRouter();

  const {
    results: conversations,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.private.conversations.getMany,
    {
      status: filterStatus === "all" ? undefined : filterStatus,
    },
    {
      initialNumItems: 10,
    }
  );

  const handleConversationClick = (conversationId: string) => {
    router.push(`/conversations/${conversationId}`);
  };

  const isSelected = (conversationId: string) => {
    return pathname === `/conversations/${conversationId}`;
  };

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

  const getStatusBorderColor = (status: string): string => {
    switch (status) {
      case "unresolved":
        return "border-red-500";
      case "escalated":
        return "border-yellow-500";
      case "resolved":
        return "border-green-500";
      default:
        return "border-gray-500";
    }
  };

  const getMessageContent = (message: any): string => {
    const content = message?.message?.content;
    if (!content) return "";

    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content.find((c) => c.type === "text")?.text || "";
    }

    return "";
  };

  const getRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="flex h-full w-full flex-col bg-background text-sidebar-foreground">
      <div className="flex flex-col gap-3.5 border-b p-2">
        <Select
          value={filterStatus}
          onValueChange={(value) => setFilterStatus(value as FilterStatus)}
        >
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
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-3">
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
            onClick={() => handleConversationClick(conversation._id)}
            className={`group flex cursor-pointer gap-3 rounded-lg border px-3 py-3 transition-colors hover:bg-accent ${
              isSelected(conversation._id)
                ? "border-primary bg-accent"
                : "border-border bg-card"
            }`}
          >
            <DicebearAvatar
              seed={conversation.contactSessionId}
              name={conversation.contactSession?.name}
              size={40}
              className="shrink-0"
            />

            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${
                      isSelected(conversation._id)
                        ? "text-accent-foreground"
                        : "group-hover:text-accent-foreground"
                    }`}
                  >
                    {conversation.contactSession?.name || "Unknown"}
                  </span>
                  <div
                    className={`flex items-center gap-1 rounded-md border px-1.5 py-0.5 ${getStatusBorderColor(
                      conversation.status
                    )}`}
                  >
                    {getStatusIcon(conversation.status)}
                    <span
                      className={`text-xs capitalize ${
                        isSelected(conversation._id)
                          ? "text-accent-foreground"
                          : "group-hover:text-accent-foreground"
                      }`}
                    >
                      {conversation.status}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs ${
                    isSelected(conversation._id)
                      ? "text-accent-foreground"
                      : "text-muted-foreground group-hover:text-accent-foreground"
                  }`}
                >
                  {getRelativeTime(conversation._creationTime)}
                </span>
              </div>

              {conversation.lastMessage && (
                <div className="flex items-center gap-2">
                  <CornerUpLeft
                    className={`h-3 w-3 shrink-0 ${
                      isSelected(conversation._id)
                        ? "text-accent-foreground"
                        : "text-muted-foreground group-hover:text-accent-foreground"
                    }`}
                  />
                  <p
                    className={`line-clamp-1 text-sm ${
                      isSelected(conversation._id)
                        ? "text-accent-foreground"
                        : "text-muted-foreground group-hover:text-accent-foreground"
                    }`}
                  >
                    {getMessageContent(conversation.lastMessage)}
                  </p>
                </div>
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
