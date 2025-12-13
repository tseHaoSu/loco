"use client";

import React, { useState } from "react";
import { Feature, PluginCard } from "../components/PluginCard";
import { VapiPluginForm } from "../components/VapiPluginForm";
import { VapiDisconnectForm } from "../components/VapiDisconnectForm";
import { VapiConnectedView } from "./VapiConnectedView";
import { Phone, MessageSquare, Clock, Zap, BarChart3 } from "lucide-react";
import { api } from "@workspace/backend/convex/_generated/api";
import { useQuery } from "convex/react";

const vapiFeatures: Feature[] = [
  {
    icon: Phone,
    label: "AI Voice Calls",
    description: "Make and receive intelligent voice calls with AI assistants.",
  },
  {
    icon: MessageSquare,
    label: "Real-time Conversations",
    description: "Enable dynamic voice conversations with low latency.",
  },
  {
    icon: Clock,
    label: "24/7 Availability",
    description: "Round-the-clock support with AI voice assistants.",
  },
  {
    icon: Zap,
    label: "Instant Integration",
    description: "Integrate voice AI with simple API calls and webhooks.",
  },
  {
    icon: BarChart3,
    label: "Call Analytics",
    description: "Track call metrics and interactions with analytics.",
  },
];

export const VapiView = () => {
  const vapiPlugin = useQuery(api.private.plugin.getOne, { service: "vapi" });

  const [connectOpen, setConnectOpen] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  const handleSubmit = () => {
    setConnectOpen(true);
  };

  const handleDisconnect = () => {
    setDisconnectOpen(true);
  };

  const isConnected = vapiPlugin !== null && vapiPlugin !== undefined;

  return (
    <div className="flex min-h-screen flex-col bg-muted p-4 sm:p-6 md:p-8">
      <div className="mx-auto w-full max-w-screen-md">
        <h1 className="mb-2 text-xl sm:text-2xl font-bold">Plugin</h1>
        <p className="mb-6 text-sm sm:text-base text-muted-foreground">
          Configure and manage your AI voice assistant settings.
        </p>
      </div>

      <div className="mx-auto mt-8 w-full max-w-screen-md">
        {isConnected ? (
          <>
            <VapiConnectedView onDisconnect={handleDisconnect} />
            <VapiDisconnectForm open={disconnectOpen} setOpen={setDisconnectOpen} />
          </>
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
