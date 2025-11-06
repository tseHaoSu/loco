"use client";

import { useState } from "react";
import { useVAPI } from "@/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { WidgetHeader } from "@/components/WidgetHeader";
import { WidgetFooter } from "@/components/WidgetFooter";

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  const { startCall, endCall, isConnected, isSpeaking, transcript } = useVAPI();
  const [screen, setScreen] = useState<"home" | "inbox">("home");

  return (
    <div className="flex flex-col min-h-svh bg-gradient-to-br from-background to-muted/20">
      <WidgetHeader>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Voice Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Click the button below to start a conversation
            {organizationId && <span className="block text-xs mt-1">Organization: {organizationId}</span>}
          </p>
        </div>
      </WidgetHeader>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Status Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    isConnected ? "bg-green-500 animate-pulse" : "bg-gray-300"
                  }`}
                />
                <span className="text-sm font-medium">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>

              {/* Speaking Indicator */}
              {isConnected && (
                <div className="flex items-center gap-2">
                  {isSpeaking ? (
                    <Mic className="h-5 w-5 text-blue-500 animate-pulse" />
                  ) : (
                    <MicOff className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm">
                    {isSpeaking ? "Assistant is speaking..." : "Listening..."}
                  </span>
                </div>
              )}

              {/* Call Button */}
              <Button
                onClick={isConnected ? endCall : startCall}
                size="lg"
                variant={isConnected ? "destructive" : "default"}
                className="w-full max-w-xs"
              >
                {isConnected ? (
                  <>
                    <PhoneOff className="mr-2 h-5 w-5" />
                    End Call
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-5 w-5" />
                    Start Call
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Transcript Card */}
          {transcript.length > 0 && (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Conversation</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transcript.map((message, index) => (
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <WidgetFooter screen={screen} onNavigate={setScreen} />
    </div>
  );
};
