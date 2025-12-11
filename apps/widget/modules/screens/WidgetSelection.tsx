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
    <div className="flex flex-col gap-3 px-4 py-3">
      <Button
        onClick={handleNewConversation}
        variant="ghost"
        size="sm"
        className="justify-start gap-3 rounded-xl bg-muted/50 px-4 py-6 text-sm font-medium transition-all hover:bg-muted"
        disabled={isCreating}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <MessageSquarePlus className="h-4 w-4 text-primary" />
        </div>
        {isCreating ? "Creating..." : "New Conversation"}
      </Button>

      {hasVapiSecrets && assistantId && (
        <Button
          onClick={handleNewVoiceCall}
          variant="ghost"
          size="sm"
          className="justify-start gap-3 rounded-xl bg-muted/50 px-4 py-6 text-sm font-medium transition-all hover:bg-muted"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Phone className="h-4 w-4 text-primary" />
          </div>
          Start Voice Call
        </Button>
      )}

      {phoneNumber && (
        <Button
          onClick={handleContact}
          variant="ghost"
          size="sm"
          className="justify-start gap-3 rounded-xl bg-muted/50 px-4 py-6 text-sm font-medium transition-all hover:bg-muted"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <PhoneCall className="h-4 w-4 text-primary" />
          </div>
          Call Us
        </Button>
      )}
    </div>
  );
};
