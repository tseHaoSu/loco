"use client";

import {
  contactSessionIdAtomFamily,
  conversationIdAtomFamily,
  organizationIdAtom,
  screenAtom,
} from "@/store/widget-atoms";
import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useAction, useQuery } from "convex/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useThreadMessages } from "@convex-dev/agent/react";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIMessageAvatar,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import {
  AIInput,
  AIInputTextarea,
  AIInputToolbar,
} from "@workspace/ui/components/ai/input";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/ai/infinite-scroll-trigger";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const isInitialLoadRef = useRef<boolean>(true);
  const hasScrolledToBottomRef = useRef<boolean>(false);

  const conversation = useQuery(
    api.public.conversations.getOneConversation,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        }
      : "skip"
  );

  const threadMessages = useThreadMessages(
    api.public.message.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId,
        }
      : "skip",
    { initialNumItems: 7 }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: threadMessages.status,
      loadMore: threadMessages.loadMore,
      loadSize: 5,
      observerEnabled: true,
    });

  useEffect(() => {
    if (
      !hasScrolledToBottomRef.current &&
      threadMessages.status !== "LoadingFirstPage" &&
      threadMessages.results.length > 0
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      hasScrolledToBottomRef.current = true;
    }
  }, [threadMessages.status, threadMessages.results.length]);

  const sendMessage = useAction(api.public.message.create);

  useEffect(() => {
    const messages = threadMessages.results;
    const lastMessage = messages[messages.length - 1];
    const currentLastMessageId = lastMessage?.id || null;

    if (isInitialLoadRef.current && messages.length > 0) {
      isInitialLoadRef.current = false;
      lastMessageIdRef.current = currentLastMessageId;
      return;
    }

    // Only scroll if the last message ID changed (new message at the end)
    // Not when loading older messages at the beginning
    if (
      currentLastMessageId &&
      currentLastMessageId !== lastMessageIdRef.current
    ) {
      console.log("[WidgetChat] New message received:", {
        role: lastMessage?.message?.role,
        content: lastMessage?.text,
        messageId: currentLastMessageId,
      });

      if (lastMessage?.message?.role === "assistant") {
        console.log("[WidgetChat] Assistant reply:", lastMessage.text);
      }

      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      lastMessageIdRef.current = currentLastMessageId;
    }
  }, [threadMessages.results]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !inputValue.trim() ||
      isSending ||
      !conversation?.threadId ||
      !contactSessionId
    )
      return;

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

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          {conversation?.status === "resolved" ? (
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          ) : (
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          )}
          <span className="text-sm font-medium">
            {conversation?.status === "resolved" ? "Resolved" : "Active"}
          </span>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <AIConversation>
          <AIConversationContent className="px-4 pb-4 pt-2">
            <InfiniteScrollTrigger
              ref={topElementRef}
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              loadMoreText="Load more messages"
              noMoreText="No more messages"
            />
            {threadMessages.status === "LoadingFirstPage" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Loading messages...
                </p>
              </div>
            ) : threadMessages.results.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              <>
                {threadMessages.results
                  .filter((message: any) => {
                    // Filter out messages with empty or whitespace-only content
                    const content = message.text || "";
                    return content.trim().length > 0;
                  })
                  .map((message: any, index: number) => {
                    const isUser = message.message?.role === "user";
                    const content = message.text || "";
                    return (
                      <div
                        key={message.id || `message-${index}`}
                        className={`flex w-full gap-3 py-2 ${
                          isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isUser && (
                          <AIMessageAvatar
                            src=""
                            name="AI"
                            className="shrink-0"
                          />
                        )}
                        <AIMessageContent
                          className={`max-w-[80%] overflow-hidden break-words ${isUser ? "border-transparent bg-[#CC785C] text-white" : ""}`}
                        >
                          {isUser ? (
                            <p className="break-words text-sm">{content}</p>
                          ) : (
                            <AIResponse>{content}</AIResponse>
                          )}
                        </AIMessageContent>
                      </div>
                    );
                  })}
                <div ref={messagesEndRef} />
              </>
            )}
          </AIConversationContent>
          <AIConversationScrollButton />
        </AIConversation>

        <div className="sticky bottom-0 z-10 bg-background/80 p-4 shadow-lg backdrop-blur-md">
          <AIInput onSubmit={handleSendMessage} className="rounded-2xl">
            <AIInputTextarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e as any);
                }
              }}
              placeholder="Type your message..."
              disabled={isSending || conversation?.status === "resolved"}
              rows={1}
              className="resize-none"
            />
            <AIInputToolbar>
              <Button
                type="submit"
                size="icon"
                className="m-1 rounded-md"
                disabled={
                  !inputValue.trim() ||
                  isSending ||
                  conversation?.status === "resolved"
                }
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </AIInputToolbar>
          </AIInput>
        </div>
      </div>
    </div>
  );
};
