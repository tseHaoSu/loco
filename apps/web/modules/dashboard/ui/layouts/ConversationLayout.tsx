"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@workspace/ui/components/resizable";
import { ConversationPanel } from "../components/ConversationPanel";

interface ConversationLayoutProps {
  children: React.ReactNode;
}

export const ConversationLayout = ({ children }: ConversationLayoutProps) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen w-full">
      <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
        <div className="h-full bg-background">
          <ConversationPanel />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70} minSize={60}>
        <div className="h-full">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
