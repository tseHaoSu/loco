"use client";

import { useVAPI } from "@/hooks/use-vapi";
import {
  contactSessionIdAtomFamily,
  conversationIdAtomFamily,
  errorMessageAtom,
  hasVapiSecretsAtom,
  organizationIdAtom,
  screenAtom,
  widgetSettingsAtom,
} from "@/store/widget-atoms";
import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { MessageSquarePlus, Phone, PhoneCall } from "lucide-react";
import { useState } from "react";

export const WidgetSelection = () => {
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const [, setConversationId] = useAtom(
    conversationIdAtomFamily(organizationId || "")
  );

  const [isCreating, setIsCreating] = useState(false);

  const assistantId = widgetSettings?.vapiSettings?.assistandId;
  const phoneNumber = widgetSettings?.vapiSettings?.phoneNumber;

  const { startCall } = useVAPI();

  const createConversation = useMutation(api.public.conversations.create);

  const handleNewConversation = async () => {
    if (!organizationId || !contactSessionId || isCreating) return;

    setIsCreating(true);
    try {
      const newConversationId = await createConversation({
        organizationId,
        contactSessionId: contactSessionId as Id<"contactSessions">,
      });
      setConversationId(newConversationId);
      setScreen("chat");
    } catch (error) {
      setErrorMessage("Failed to create conversation. Please try again.");
      setScreen("error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleNewVoiceCall = () => {
    startCall();
    setScreen("voice");
  };

  const handleContact = () => {
    setScreen("contact");
  };

  return (
    <div className="px-4 pt-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Start a Conversation</h2>
              <p className="text-sm text-muted-foreground">
                Create a new conversation to get help
              </p>
            </div>

            <Button
              onClick={handleNewConversation}
              size="lg"
              className="w-full max-w-xs"
              disabled={isCreating}
            >
              <MessageSquarePlus className="mr-2 h-5 w-5" />
              {isCreating ? "Creating..." : "New Conversation"}
            </Button>

            {hasVapiSecrets && assistantId && (
              <Button
                onClick={handleNewVoiceCall}
                size="lg"
                className="w-full max-w-xs"
              >
                <Phone className="mr-2 h-5 w-5" />
                Start Voice Call
              </Button>
            )}

            {phoneNumber && (
              <Button
                onClick={handleContact}
                className="w-full max-w-xs"
              >
                <PhoneCall className="mr-2 h-5 w-5" />
                Call Us
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
