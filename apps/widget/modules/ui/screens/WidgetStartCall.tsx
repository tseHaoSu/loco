"use client";

import { useVAPI } from "@/hooks/use-vapi";
import {
  contactSessionIdAtomFamily,
  conversationIdAtomFamily,
  organizationIdAtom,
  screenAtom,
} from "@/store/widget-atoms";
import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useQuery } from "convex/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ArrowLeft, Mic, MicOff, PhoneOff, Volume2 } from "lucide-react";
import { useEffect } from "react";

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
}

export const WidgetStartCall = () => {
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const [conversationId, setConversationId] = useAtom(
    conversationIdAtomFamily(organizationId || "")
  );
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

  const { endCall, isConnected, isConnecting, isSpeaking, transcript } = useVAPI();

  useEffect(() => {
    if (conversation === null && conversationId) {
      setConversationId(null);
      setScreen("selection");
    }
  }, [conversation, conversationId, setConversationId, setScreen]);

  const handleBack = () => {
    if (isConnected) {
      endCall();
    }
    setScreen("selection");
  };

  const handleEndCall = () => {
    endCall();
    setScreen("selection");
  };

  const getStatusText = () => {
    if (isConnecting) return "Connecting";
    if (isConnected && isSpeaking) return "AI speaking";
    if (isConnected) return "Connected";
    return "Disconnected";
  };

  const getStatusColor = () => {
    if (isConnecting) return "bg-yellow-500";
    if (isConnected) return "bg-green-500";
    return "bg-red-500";
  };

  return (
    <div className="flex h-full flex-col bg-background">
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
            className={cn(
              "h-2 w-2 rounded-full",
              getStatusColor(),
              (isConnecting || (isConnected && isSpeaking)) && "animate-pulse"
            )}
          />
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
      </header>

      <div className="flex shrink-0 items-center justify-center border-b bg-muted/30 py-4">
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300",
              isConnected ? "bg-primary/10" : "bg-muted"
            )}
          >
            {isSpeaking && (
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            )}
            <div
              className={cn(
                "z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                isConnected ? "bg-primary" : "bg-muted-foreground/20"
              )}
            >
              {isConnected ? (
                isSpeaking ? (
                  <Volume2 className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <Mic className="h-5 w-5 text-primary-foreground" />
                )
              ) : (
                <MicOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {isConnecting
              ? "Connecting..."
              : isConnected
                ? isSpeaking
                  ? "Agent Speaking"
                  : "Listening..."
                : "Not connected"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <AIConversation className="h-full">
          <AIConversationContent className="flex flex-col gap-2 p-3">
            {(transcript as TranscriptMessage[]).length === 0 ? (
              <div className="flex flex-1 items-center justify-center py-8" />
            ) : (
              (transcript as TranscriptMessage[]).map((message, index) => {
                const isUser = message.role === "user";
                return (
                  <div
                    key={index}
                    className={cn("flex", isUser ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3 py-2",
                        isUser
                          ? "rounded-br-sm bg-primary text-primary-foreground"
                          : "rounded-bl-sm bg-muted text-foreground"
                      )}
                    >
                      <p className="break-words text-xs leading-relaxed">
                        {message.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            {isSpeaking && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-muted px-3 py-2">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
          </AIConversationContent>
          <AIConversationScrollButton />
        </AIConversation>
      </div>

      <div className="shrink-0 border-t bg-background p-3">
        <Button
          onClick={handleEndCall}
          variant="destructive"
          size="sm"
          className="w-full"
          disabled={!isConnected && !isConnecting}
        >
          <PhoneOff className="mr-1.5 h-4 w-4" />
          End Call
        </Button>
      </div>
    </div>
  );
};
