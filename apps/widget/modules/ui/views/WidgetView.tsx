"use client";

import { WidgetHeader } from "@/modules/ui/components/WidgetHeader";
import { WidgetFooter } from "@/modules/ui/components/WidgetFooter";
import { WidgetStartCall } from "@/modules/ui/components/WidgetStartCall";
import { WidgetAuth } from "../screens/WidgetAuth";

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  return (
    <div className="flex flex-col min-h-svh bg-gradient-to-br from-background to-muted/20">
      <WidgetHeader>
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Voice Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Click the button below to start a conversation
            {organizationId && (
              <span className="block text-xs mt-1">
                Organization: {organizationId}
              </span>
            )}
          </p>
        </div>
      </WidgetHeader>
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pt-6">
        <WidgetAuth organizationId={organizationId} />
      </div>
      <WidgetFooter />
    </div>
  );
};
