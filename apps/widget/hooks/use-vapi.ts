import { useEffect, useState, useCallback } from "react";
import { useAtomValue } from "jotai";
import Vapi from "@vapi-ai/web";
import { vapiSecretsAtom, widgetSettingsAtom } from "@/store/widget-atoms";

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
}

const vapiInstances = new Map<string, Vapi>();

const getVapiInstance = (publicApiKey: string) => {
  if (!vapiInstances.has(publicApiKey)) {
    vapiInstances.set(publicApiKey, new Vapi(publicApiKey));
  }
  return vapiInstances.get(publicApiKey)!;
};

export const useVAPI = () => {
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const vapiSecrets = useAtomValue(vapiSecretsAtom);

  const assistantId = widgetSettings?.vapiSettings?.assistandId;
  const publicApiKey = vapiSecrets?.publicApiKey;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    if (!publicApiKey) return;

    const vapi = getVapiInstance(publicApiKey);

    const handleError = (error: {
      message?: string;
      error?: { message?: string };
    }) => {
      const errorMessage = error?.message || error?.error?.message || "";
      if (
        errorMessage.includes("Meeting ended") ||
        errorMessage.includes("ejection") ||
        errorMessage.includes("Meeting has ended")
      ) {
        return;
      }

      console.error("[VAPI] Error:", error);
      setIsConnecting(false);
      setIsConnected(false);
      setIsSpeaking(false);
    };

    const handleCallStart = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setTranscript([]);
    };

    const handleCallEnd = () => {
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    };

    const handleSpeechStart = () => {
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const handleMessage = (message: {
      type: string;
      transcriptType?: string;
      role?: string;
      transcript?: string;
    }) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role === "user" ? "user" : "assistant",
            text: message.transcript || "",
          },
        ]);
      }
    };

    vapi.on("error", handleError);
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("message", handleMessage);

    return () => {
      vapi.off("error", handleError);
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("message", handleMessage);
    };
  }, [publicApiKey]);

  const startCall = useCallback(async () => {
    if (!assistantId || !publicApiKey) return;

    setIsConnecting(true);
    const vapi = getVapiInstance(publicApiKey);

    try {
      await vapi.start(assistantId, {
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en",
        },
      });
    } catch {
      setIsConnecting(false);
    }
  }, [assistantId, publicApiKey]);

  const endCall = useCallback(() => {
    if (!publicApiKey) return;
    const vapi = getVapiInstance(publicApiKey);
    vapi.stop();
  }, [publicApiKey]);

  return {
    isSpeaking,
    isConnected,
    isConnecting,
    transcript,
    startCall,
    endCall,
  };
};
