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
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { usePaginatedQuery } from "convex/react";
import { ArrowUp, Check, Circle, CornerUpLeft, List, X } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type FilterStatus = "all" | "unresolved" | "escalated" | "resolved";

interface MessageContentPart {
  type: string;
  text?: string;
}

type MessageContent = string | MessageContentPart[];

interface LastMessage {
  message?: {
    content?: MessageContent;
  };
}

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
        return <X className="h-4 w-4" />;
      case "escalated":
        return <ArrowUp className="h-4 w-4" />;
      case "resolved":
        return <Check className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (
    status: string
  ):
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "tertiary"
    | "warning" => {
    switch (status) {
      case "unresolved":
        return "destructive";
      case "escalated":
        return "warning";
      case "resolved":
        return "tertiary";
      default:
        return "tertiary";
    }
  };

  const truncateToWords = (text: string, maxWords: number = 5): string => {
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  const getMessageContent = (message: LastMessage): string => {
    const content = message?.message?.content;
    if (!content) return "";

    let text = "";
    if (typeof content === "string") {
      text = content;
    } else if (Array.isArray(content)) {
      text = content.find((c) => c.type === "text")?.text || "";
    }

    return truncateToWords(text);
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
      <div className="border-b p-2">
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

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
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
          <Button
            key={conversation._id}
            onClick={() => handleConversationClick(conversation._id)}
            variant="ghost"
            className={`group h-auto w-full justify-start gap-3 rounded-lg border px-3 py-3 transition-colors hover:bg-accent ${
              isSelected(conversation._id)
                ? "border-primary bg-gradient-to-r from-orange-500/10 to-orange-600/10"
                : "border-border bg-card"
            }`}
          >
            <DicebearAvatar
              seed={conversation.contactSessionId}
              name={conversation.contactSession?.name}
              size={40}
              className="shrink-0"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex min-w-0 flex-nowrap items-center justify-between gap-2">
                <span
                  className={`min-w-0 truncate text-sm font-medium ${
                    isSelected(conversation._id)
                      ? "text-foreground"
                      : "text-foreground group-hover:text-accent-foreground"
                  }`}
                >
                  {conversation.contactSession?.name || "Unknown"}
                </span>
                <span
                  className={`shrink-0 text-xs ${
                    isSelected(conversation._id)
                      ? "text-foreground/70"
                      : "text-muted-foreground group-hover:text-accent-foreground"
                  }`}
                >
                  {getRelativeTime(conversation._creationTime)}
                </span>
              </div>

              <div className="flex min-w-0 flex-nowrap items-center justify-between gap-2">
                {conversation.lastMessage && (
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <CornerUpLeft
                      className={`h-3 w-3 shrink-0 ${
                        isSelected(conversation._id)
                          ? "text-foreground/70"
                          : "text-muted-foreground group-hover:text-accent-foreground"
                      }`}
                    />
                    <p
                      className={`min-w-0 truncate text-sm ${
                        isSelected(conversation._id)
                          ? "text-foreground/70"
                          : "text-muted-foreground group-hover:text-accent-foreground"
                      }`}
                    >
                      {getMessageContent(conversation.lastMessage)}
                    </p>
                  </div>
                )}
                <Badge
                  variant={getStatusVariant(conversation.status)}
                  className="shrink-0 rounded-full p-1.5"
                >
                  {getStatusIcon(conversation.status)}
                </Badge>
              </div>
            </div>
          </Button>
        ))}

      </div>
    </div>
  );
};
