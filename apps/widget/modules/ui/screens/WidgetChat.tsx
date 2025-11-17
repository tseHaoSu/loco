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
      observerEnabled: false,
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
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b">
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
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          )}
          <span className="text-sm font-medium">
            {conversation?.status === "resolved" ? "Resolved" : "Active"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 relative">
        <AIConversation>
          <AIConversationContent className="p-0 pt-2 pb-4 px-4">
            <InfiniteScrollTrigger
              ref={topElementRef}
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              loadMoreText="Load more messages"
              noMoreText="No more messages"
            />
            {threadMessages.status === "LoadingFirstPage" ? (
              <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
                <p className="text-sm text-muted-foreground">
                  Loading messages...
                </p>
              </div>
            ) : threadMessages.results.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
                <p className="text-sm text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              <>
                {threadMessages.results.map((message: any, index: number) => {
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
                          className="flex-shrink-0"
                        />
                      )}
                      <AIMessageContent
                        className={`max-w-[80%] break-words overflow-hidden ${isUser ? "bg-[#CC785C] text-white border-transparent" : ""}`}
                      >
                        {isUser ? (
                          <p className="text-sm break-words">{content}</p>
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

        <div className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-md p-4 shadow-lg">
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
