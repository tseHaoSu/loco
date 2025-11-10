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
  AIMessage,
  AIMessageAvatar,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import {
  AIInput,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import { AIResponse } from "@workspace/ui/components/ai/response";

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

  const conversation = useQuery(
    api.public.conversations.getOneConversation,
    conversationId && contactSessionId
      ? {
          conversationId: conversationId,
          contactSessionId: contactSessionId,
        }
      : "skip"
  );

  const threadMessages = useThreadMessages(
    api.public.message.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId: contactSessionId,
        }
      : "skip",
    { initialNumItems: 10 }
  );

  const sendMessage = useAction(api.public.message.create);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages.results.length]);

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
        contactSessionId: contactSessionId,
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
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 flex items-center gap-3 border-b px-4 py-3">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium">
            {conversation?.status === "resolved"
              ? "Resolved"
              : "Active Support"}
          </span>
        </div>
      </div>

      {/* Messages and Input wrapper - Scrollable area */}
      <div className="flex-1 overflow-y-auto min-h-0 relative">
        <AIConversation>
          <AIConversationContent className="pb-4">
            {threadMessages.status === "LoadingFirstPage" ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                <p className="text-sm text-muted-foreground">
                  Loading messages...
                </p>
              </div>
            ) : threadMessages.results.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
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
                          src="/assistant-avatar.png"
                          name="AI"
                          className="flex-shrink-0"
                        />
                      )}
                      <AIMessageContent
                        className={`max-w-[80%] ${isUser ? "bg-[#CC785C] text-white border-transparent" : ""}`}
                      >
                        {isUser ? (
                          <p className="text-sm">{content}</p>
                        ) : (
                          <AIResponse>{content}</AIResponse>
                        )}
                      </AIMessageContent>
                      {isUser && (
                        <AIMessageAvatar
                          src="/user-avatar.png"
                          name="Y"
                          className="flex-shrink-0"
                        />
                      )}
                    </div>
                  );
                })}
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </>
            )}
          </AIConversationContent>
          <AIConversationScrollButton />
        </AIConversation>

        {/* Input - Sticky at bottom of scrollable area */}
        <div className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-md border-t p-4 shadow-lg">
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
            <AIInputTools>
              {/* Optional: Add file upload or other tools here */}
            </AIInputTools>
            <Button
              type="submit"
              size="icon"
              className="gap-1.5 rounded-md"
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
