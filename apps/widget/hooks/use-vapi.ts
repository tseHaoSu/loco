import { useEffect, useState, useCallback } from "react";
import Vapi from "@vapi-ai/web";

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
}

interface UseVAPIProps {
  assistantId?: string;
}

const API_KEY = "e7ba5216-a907-460a-8fe4-7be1f4a9353c";

let vapiInstance: Vapi | null = null;

const getVapiInstance = () => {
  if (!vapiInstance) {
    vapiInstance = new Vapi(API_KEY);
  }
  return vapiInstance;
};

export const useVAPI = ({ assistantId }: UseVAPIProps = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    const vapi = getVapiInstance();

    const handleError = () => {
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
      // Note: transcript is preserved so user can see the conversation after call ends
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
      console.log("[VAPI] Message received:", message.type, message);
      if (message.type === "transcript" && message.transcriptType === "final") {
        console.log("[VAPI] Adding transcript:", message.transcript);
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
  }, []);

  const startCall = useCallback(async () => {
    if (!assistantId) return;

    setIsConnecting(true);
    const vapi = getVapiInstance();

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
  }, [assistantId]);

  const endCall = useCallback(() => {
    const vapi = getVapiInstance();
    vapi.stop();
  }, []);

  return {
    isSpeaking,
    isConnected,
    isConnecting,
    transcript,
    startCall,
    endCall,
  };
};
