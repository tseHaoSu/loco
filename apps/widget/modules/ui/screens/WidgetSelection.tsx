"use client";

import {
  hasVapiSecretsAtom,
  screenAtom,
  widgetSettingsAtom,
} from "@/store/widget-atoms";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { MessageSquarePlus, Mic, Phone } from "lucide-react";

export const WidgetSelection = () => {
  const setScreen = useSetAtom(screenAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);

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
              onClick={() => setScreen("chat")}
              size="lg"
              className="w-full max-w-xs"
            >
              <MessageSquarePlus className="mr-2 h-5 w-5" />
              New Conversation
            </Button>

            {hasVapiSecrets && widgetSettings?.vapiSettings?.assistandId && (
              <Button
                onClick={() => setScreen("voice")}
                size="lg"
                className="w-full max-w-xs"
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Voice Call
              </Button>
            )}
            {widgetSettings?.vapiSettings?.phoneNumber && (
              <Button
                onClick={() => setScreen("contact")}
                size="lg"
                className="w-full max-w-xs"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call us
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
