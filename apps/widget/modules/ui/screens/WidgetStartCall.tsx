"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeft, Mic, MicOff, PhoneOff, Volume2 } from "lucide-react";

import { useVAPI } from "@/hooks/use-vapi";
import { screenAtom, widgetSettingsAtom } from "@/store/widget-atoms";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

export const WidgetStartCall = () => {
  const setScreen = useSetAtom(screenAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const assistantId = widgetSettings?.vapiSettings?.assistandId;

  const {
    isSpeaking,
    isConnected,
    isConnecting,
    transcript,
    startCall,
    endCall,
  } = useVAPI({ assistantId });

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
            className={cn(
              "h-2 w-2 rounded-full",
              getStatusColor(),
              (isConnecting || (isConnected && isSpeaking)) && "animate-pulse"
            )}
          />
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
      </header>

      {/* Voice Indicator */}
      <div className="flex shrink-0 items-center justify-center border-b bg-muted/30 py-6">
        <div className="flex flex-col items-center gap-4">
          {/* Animated Voice Circle */}
          <div
            className={cn(
              "relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300",
              isConnected ? "bg-primary/10" : "bg-muted"
            )}
          >
            {/* Pulse rings when speaking */}
            {isSpeaking && (
              <>
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div
                  className="absolute inset-0 animate-ping rounded-full bg-primary/10"
                  style={{ animationDelay: "0.2s" }}
                />
              </>
            )}

            {/* Center icon */}
            <div
              className={cn(
                "z-10 flex h-16 w-16 items-center justify-center rounded-full transition-colors",
                isConnected ? "bg-primary" : "bg-muted-foreground/20"
              )}
            >
              {isConnected ? (
                isSpeaking ? (
                  <Volume2 className="h-8 w-8 text-primary-foreground" />
                ) : (
                  <Mic className="h-8 w-8 text-primary-foreground" />
                )
              ) : (
                <MicOff className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Status message */}
          <p className="text-sm text-muted-foreground">
            {isConnecting
              ? "Setting up voice connection..."
              : isConnected
                ? isSpeaking
                  ? "AI is responding"
                  : "Speak now - I'm listening"
                : "Not connected"}
          </p>
        </div>
      </div>

      {/* Transcript Area - Simplified for debugging */}
      <div className="flex-1 overflow-auto p-4">
        <p className="text-sm text-muted-foreground mb-2">
          Transcript:
        </p>
        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
          {JSON.stringify(transcript, null, 2)}
        </pre>
      </div>

      {/* Start/End Call Buttons */}
      <div className="shrink-0 border-t bg-background p-4 flex gap-2">
        <Button
          onClick={startCall}
          size="lg"
          className="flex-1"
          disabled={isConnected || isConnecting}
        >
          <Mic className="mr-2 h-5 w-5" />
          Start Call
        </Button>
        <Button
          onClick={handleEndCall}
          variant="destructive"
          size="lg"
          className="flex-1"
          disabled={!isConnected && !isConnecting}
        >
          <PhoneOff className="mr-2 h-5 w-5" />
          End Call
        </Button>
      </div>
    </div>
  );
};
