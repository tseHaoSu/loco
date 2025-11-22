"use client";

import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import {
  contactSessionIdAtomFamily,
  conversationIdAtomFamily,
  organizationIdAtom,
  screenAtom,
} from "@/store/widget-atoms";
import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIMessage,
  AIMessageAvatar,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
} from "@workspace/ui/components/ai/input";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/ai/infinite-scroll-trigger";
import { useAction, useQuery } from "convex/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export const WidgetChat = () => {
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const [conversationId, setConversationId] = useAtom(
    conversationIdAtomFamily(organizationId || "")
  );
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const conversation = useQuery(
    api.public.conversations.getOneConversation,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        }
      : "skip"
  );

  const messages = useThreadMessages(
    api.public.message.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId,
        }
      : "skip",
    { initialNumItems: 10 }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
      observerEnabled: true,
    });

  const sendMessage = useAction(api.public.message.create);

  // Handle conversation not found - redirect to selection screen
  useEffect(() => {
    if (conversation === null && conversationId) {
      console.log(
        "[WidgetChat] Conversation not found, redirecting to selection"
      );
      setConversationId(null);
      setScreen("selection");
    }
  }, [conversation, conversationId, setConversationId, setScreen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !inputValue.trim() ||
      isSending ||
      !conversation?.threadId ||
      !contactSessionId
    ) {
      return;
    }

    const messageText = inputValue.trim();
    setInputValue("");
    setIsSending(true);

    try {
      await sendMessage({
        prompt: messageText,
        threadId: conversation.threadId,
        contactSessionId,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  const isResolved = conversation?.status === "resolved";

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-3 border-b bg-background px-4 py-3">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 animate-pulse rounded-full ${
              isResolved ? "bg-red-500" : "bg-green-500"
            }`}
          />
          <span className="text-sm font-medium">
            {isResolved ? "Resolved" : "Active"}
          </span>
        </div>
      </header>

      {/* Messages */}
      <AIConversation className="max-h-[calc(100vh-140px)]">
        <AIConversationContent className="px-4 pb-4 pt-2">
          <InfiniteScrollTrigger
            ref={topElementRef}
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            loadMoreText="Load older messages"
            noMoreText="No older messages"
          />

          {messages.status === "LoadingFirstPage" ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Loading messages...
              </p>
            </div>
          ) : toUIMessages(messages.results ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            toUIMessages(messages.results ?? []).map((message) => {
              const isUser = message.role === "user";
              return (
                <AIMessage
                  key={message.key}
                  from={isUser ? "user" : "assistant"}
                >
                  
                  <AIMessageContent
                    className={
                      isUser
                        ? "border-transparent bg-[#CC785C] text-white"
                        : ""
                    }
                  >
                    {isUser ? (
                      <p className="break-words text-sm">{message.text}</p>
                    ) : (
                      <AIResponse>{message.text}</AIResponse>
                    )}
                  </AIMessageContent>
                </AIMessage>
              );
            })
          )}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>

      {/* Input */}
      <div className="shrink-0 bg-background p-4">
        <AIInput onSubmit={handleSendMessage} className="rounded-2xl">
          <AIInputTextarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e as React.FormEvent);
              }
            }}
            placeholder="Type your message..."
            disabled={isSending || isResolved}
            rows={1}
            className="resize-none"
          />
          <AIInputToolbar>
            <AIInputSubmit disabled={!inputValue.trim() || isSending || isResolved}>
              <ArrowUp className="h-4 w-4" />
            </AIInputSubmit>
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  );
};
