"use client";

import {
  contactSessionIdAtomFamily,
  conversationIdAtomFamily,
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "@/store/widget-atoms";
import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { MessageSquarePlus } from "lucide-react";
import React, { useState } from "react";

export const WidgetSelection = () => {
  const setScreen = useSetAtom(screenAtom);
  const setError = useSetAtom(errorMessageAtom);
  const [organizationId] = useAtom(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const setConversationId = useSetAtom(
    conversationIdAtomFamily(organizationId || "")
  );

  const [pending, setPending] = useState(false);
  const createConversation = useMutation(api.public.conversations.create);

  const handleNewConversation = async () => {
    if (!organizationId) {
      setError("Organization ID is missing.");
      setScreen("error");
      return;
    }
    if (!contactSessionId) {
      setScreen("auth");
      return;
    }

    setPending(true);
    try {
      const conversationId = await createConversation({
        organizationId,
        contactSessionId: contactSessionId as Id<"contactSessions">,
      });
      setConversationId(conversationId);
      setScreen("chat");
    } catch (error) {
      setScreen("auth");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="px-4">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center space-y-2">
              <h2 className="text-lg font-semibold">Start a Conversation</h2>
              <p className="text-sm text-muted-foreground">
                Create a new conversation to get help
              </p>
            </div>

            <Button
              onClick={handleNewConversation}
              size="lg"
              className="w-full max-w-xs"
              disabled={pending}
            >
              <MessageSquarePlus className="mr-2 h-5 w-5" />
              {pending ? "Creating..." : "New Conversation"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
