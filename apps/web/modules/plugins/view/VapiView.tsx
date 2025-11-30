"use client";

import React, { useState } from "react";
import { Feature, PluginCard } from "../components/PluginCard";
import { VapiPluginForm } from "../components/VapiPluginForm";
import { Phone, MessageSquare, Clock, Zap, BarChart3, CheckCircle2 } from "lucide-react";
import { api } from "@workspace/backend/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Button } from "@workspace/ui/components/button";

const vapiFeatures: Feature[] = [
  {
    icon: Phone,
    label: "AI Voice Calls",
    description:
      "Make and receive intelligent voice calls with natural-sounding AI assistants that understand context and intent.",
  },
  {
    icon: MessageSquare,
    label: "Real-time Conversations",
    description:
      "Enable dynamic, real-time voice conversations with low latency and natural speech patterns for seamless interactions.",
  },
  {
    icon: Clock,
    label: "24/7 Availability",
    description:
      "Provide round-the-clock customer support with AI voice assistants that never sleep, ensuring constant availability.",
  },
  {
    icon: Zap,
    label: "Instant Integration",
    description:
      "Quickly integrate voice AI capabilities into your existing workflows with simple API calls and webhooks.",
  },
  {
    icon: BarChart3,
    label: "Call Analytics",
    description:
      "Track and analyze call metrics, conversation quality, and customer interactions with comprehensive analytics dashboards.",
  },
];

export const VapiView = () => {
  const vapiPlugin = useQuery(api.private.plugin.getOne, { service: "vapi" });
  const removePlugin = useMutation(api.private.plugin.remove);

  const [connectOpen, setConnectOpen] = useState(false);

  const handleSubmit = () => {
    setConnectOpen(true);
  };

  const handleDisconnect = async () => {
    await removePlugin({ service: "vapi" });
  };

  const isConnected = vapiPlugin !== null && vapiPlugin !== undefined;

  return (
    <div className="flex min-h-screen flex-col bg-muted p-8">
      <div className="mx-auto w-full max-w-screen-md">
        <h1 className="text-3xl font-bold tracking-tight">Plugin</h1>
        <p className="mt-2 text-muted-foreground">
          Configure and manage your AI voice assistant settings.
        </p>
      </div>

      <div className="mx-auto mt-8 w-full max-w-screen-md">
        {isConnected ? (
          <div className="rounded-lg border bg-background p-8">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <div>
                <h2 className="text-2xl font-semibold text-primary">Connected to Vapi</h2>
                <p className="text-sm text-muted-foreground">
                  Your Vapi integration is active and ready to use.
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                className="w-full"
              >
                Disconnect Vapi
              </Button>
            </div>
          </div>
        ) : (
          <>
            <PluginCard
              serviceImage="/vapi.jpg"
              serviceName="Vapi"
              features={vapiFeatures}
              onSubmit={handleSubmit}
              isDisabled={vapiPlugin === undefined}
            />
            <VapiPluginForm open={connectOpen} setOpen={setConnectOpen} />
          </>
        )}
      </div>
    </div>
  );
};
