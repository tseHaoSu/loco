"use client";

import type { ReactNode } from "react";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@workspace/ui/components/resizable";
import { cn } from "@workspace/ui/lib/utils";

import ContactPanel from "../components/ContactPanel";
import {
  ContactPanelProvider,
  useContactPanel,
} from "../context/ContactPanelContext";

interface ConversationIdLayoutProps {
  children: ReactNode;
}

const ConversationIdLayoutContent = ({
  children,
}: ConversationIdLayoutProps) => {
  const { isContactPanelOpen } = useContactPanel();

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel
        defaultSize={isContactPanelOpen ? 60 : 100}
        minSize={40}
        className="transition-all duration-300"
      >
        <div className="flex h-full flex-col">{children}</div>
      </ResizablePanel>

      {isContactPanelOpen && (
        <>
          <ResizableHandle className="hidden lg:block" />
          <ResizablePanel
            defaultSize={40}
            minSize={20}
            className={cn(
              "hidden lg:block",
              "transition-all duration-300 ease-in-out"
            )}
          >
            <div className="flex h-full flex-col border-l border-border">
              <ContactPanel />
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

const ConversationIdLayout = ({ children }: ConversationIdLayoutProps) => {
  return (
    <ContactPanelProvider defaultOpen={true}>
      <ConversationIdLayoutContent>{children}</ConversationIdLayoutContent>
    </ContactPanelProvider>
  );
};

export default ConversationIdLayout;
