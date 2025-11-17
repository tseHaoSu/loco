"use client";

import { useVAPI } from "@/hooks/use-vapi";
import {
  conversationIdAtom,
  contactSessionIdAtomFamily,
  organizationIdAtom,
  screenAtom,
} from "@/store/widget-atoms";
import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useQuery } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { Mic, MicOff, PhoneOff } from "lucide-react";

export const WidgetStartCall = () => {
  const setScreen = useSetAtom(screenAtom);
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

  const { endCall, isConnected, isSpeaking, transcript } = useVAPI();

  const handleEndCall = () => {
    endCall();
    setScreen("selection");
  };

  return (
    <div className="px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        {/* Connection Status */}
        <div className="flex items-center justify-center gap-2 py-2">
          {isConnected ? (
            <>
              {isSpeaking ? (
                <Mic className="h-5 w-5 text-blue-500 animate-pulse" />
              ) : (
                <MicOff className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-sm">
                {isSpeaking ? "Assistant is speaking..." : "Listening..."}
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              Connecting to call...
            </span>
          )}
        </div>

        {/* Transcript Container */}
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
            {transcript.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
                <p className="text-sm text-muted-foreground">
                  {isConnected
                    ? "Connected! Start speaking to begin the conversation."
                    : "Connecting to call..."}
                </p>
              </div>
            ) : (
              transcript.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">
                      {message.role === "user" ? "You" : "Assistant"}
                    </p>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* End Call Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleEndCall}
            size="lg"
            variant="destructive"
            className="w-full max-w-xs"
            disabled={!isConnected}
          >
            <PhoneOff className="mr-2 h-5 w-5" />
            End Call
          </Button>
        </div>
      </div>
    </div>
  );
};
