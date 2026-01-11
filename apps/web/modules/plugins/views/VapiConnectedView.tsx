"use client";

import { useState } from "react";
import { Unplug, Settings, Phone, Bot } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import Image from "next/image";
import { VapiPhoneNumbersTab } from "../components/VapiPhoneNumbersTab";
import { VapiAssistantsTab } from "../components/VapiAssistantsTab";

interface VapiConnectedViewProps {
  onDisconnect: () => void;
}

export const VapiConnectedView = ({ onDisconnect }: VapiConnectedViewProps) => {
  const [activeTab, setActiveTab] = useState("phone-numbers");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 px-4">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border">
              <Image src="/vapi.jpg" alt="Vapi" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg">Connected to Vapi</CardTitle>
              <CardDescription>
                Your Vapi integration is active and ready to use.
              </CardDescription>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={onDisconnect}>
            <Unplug className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 px-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border bg-muted">
              <Settings className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg">Settings</CardTitle>
              <CardDescription>
                Configure your Vapi integration and manage preferences.
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/customization" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Link>
          </Button>
        </CardHeader>
      </Card>

      <Card className="overflow-hidden p-0">
        <Tabs
          defaultValue="phone-numbers"
          onValueChange={setActiveTab}
          value={activeTab}
          className="w-full"
        >
          <TabsList className="w-full rounded-t-lg rounded-b-none border-b bg-transparent p-0 h-auto">
            <TabsTrigger
              value="phone-numbers"
              className="rounded-tl-lg rounded-tr-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-muted/50 hover:bg-muted/30 transition-colors flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Phone Numbers
            </TabsTrigger>
            <TabsTrigger
              value="ai-assistants"
              className="rounded-tr-lg rounded-tl-none rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-muted/50 hover:bg-muted/30 transition-colors flex items-center gap-2"
            >
              <Bot className="h-4 w-4" />
              AI Assistants
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phone-numbers" className="m-0 p-6">
            <VapiPhoneNumbersTab />
          </TabsContent>

          <TabsContent value="ai-assistants" className="m-0 p-6">
            <VapiAssistantsTab />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
