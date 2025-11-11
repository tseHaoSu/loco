"use client";

import { WidgetFooter } from "@/modules/ui/components/WidgetFooter";
import { WidgetHeader } from "@/modules/ui/components/WidgetHeader";
import { WidgetLoading } from "@/modules/ui/screens/WidgetLoading";
import { screenAtom } from "@/store/widget-atoms";
import { useAtomValue } from "jotai";
import { WidgetAuth } from "../screens/WidgetAuth";
import { WidgetChat } from "../screens/WidgetChat";
import { WidgetError } from "../screens/WidgetError";
import { WidgetSelection } from "../screens/WidgetSelection";
import { WidgetStartCall } from "../screens/WidgetStartCall";
import { WidgetInbox } from "../screens/WidgetInbox";

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom);

  const screenComponents: Record<string, React.ReactNode> = {
    error: <WidgetError />,
    loading: <WidgetLoading organizationId={organizationId} />,
    selection: <WidgetSelection />,
    voice: <WidgetStartCall />,
    auth: <WidgetAuth organizationId={organizationId} />,
    inbox: <WidgetInbox />,
    contact: <p>Contact Screen</p>,
    chat: <WidgetChat />,
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
