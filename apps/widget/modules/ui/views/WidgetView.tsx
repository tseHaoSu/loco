"use client";

import { WidgetFooter } from "@/modules/ui/components/WidgetFooter";
import { WidgetHeader } from "@/modules/ui/components/WidgetHeader";
import { WidgetLoading } from "@/modules/ui/screens/WidgetLoading";
import { screenAtom } from "@/store/widget-atoms";
import { useAtomValue } from "jotai";
import { WidgetAuth } from "../screens/WidgetAuth";
import { WidgetChat } from "../screens/WidgetChat";
import { WidgetContact } from "../screens/WidgetContact";
import { WidgetError } from "../screens/WidgetError";
import { WidgetInbox } from "../screens/WidgetInbox";
import { WidgetSelection } from "../screens/WidgetSelection";
import { WidgetStartCall } from "../screens/WidgetStartCall";

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
    contact: <WidgetContact />,
    chat: <WidgetChat />,
  };

  const showFooter = screen !== "chat";

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-gradient-to-br from-background to-muted/20">
      <WidgetHeader organizationId={organizationId} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {screenComponents[screen]}
      </div>
      {showFooter && <WidgetFooter />}
    </div>
  );
};
