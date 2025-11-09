"use client";

import React, { useState } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  conversationIdAtom,
  contactSessionIdAtomFamily,
  organizationIdAtom,
  screenAtom,
} from "@/store/widget-atoms";
import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useQuery } from "convex/react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export const WidgetChat = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const conversation = useQuery(
    api.public.conversations.getOneConversation,
    conversationId && contactSessionId
      ? {
          conversationId: conversationId as Id<"conversations">,
          contactSessionId: contactSessionId as Id<"contactSessions">,
        }
      : "skip"
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    const userMessage: Message = {
      role: "user",
      text: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);

    try {
      // TODO: Send message to backend when available
      setTimeout(() => {
        const assistantMessage: Message = {
          role: "assistant",
          text: "Message received. This is a placeholder response.",
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsSending(false);
      }, 1000);
    } catch (error) {
      setIsSending(false);
    }
  };

  const handleBack = () => {
    setScreen("selection");
  };

  return (
    <div className="px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleBack}
            variant="transparent"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">
              {JSON.stringify(conversation)}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted">
                  <p className="text-sm font-medium mb-1">
                    {message.role === "user" ? "You" : "Assistant"}
                  </p>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            disabled={isSending}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSending}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
