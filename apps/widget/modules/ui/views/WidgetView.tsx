"use client";

import { WidgetHeader } from "@/modules/ui/components/WidgetHeader";
import { WidgetFooter } from "@/modules/ui/components/WidgetFooter";
import { LoadingView } from "@/modules/ui/components/LoadingView";
import { WidgetAuth } from "../screens/WidgetAuth";
import { screenAtom } from "@/store/widget-atoms";
import { useAtomValue } from "jotai";

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom);

  const screenComponents: Record<string, React.ReactNode> = {
    error: <p>Error Screen</p>,
    loading: <LoadingView />,
    selection: <p>Selection Screen</p>,
    voice: <p>Voice Screen</p>,
    auth: <WidgetAuth organizationId={organizationId} />,
    inbox: <p>Inbox Screen</p>,
    contact: <p>Contact Screen</p>,
    chat: <p>Chat Screen</p>,
  };

  return (
    <div className="flex flex-col min-h-svh bg-gradient-to-br from-background to-muted/20">
      <WidgetHeader organizationId={organizationId} />
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pt-6">
        {screenComponents[screen]}
      </div>
      <WidgetFooter />
    </div>
  );
};
