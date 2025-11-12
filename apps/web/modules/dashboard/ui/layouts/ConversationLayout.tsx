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
      {/* Left Panel - Conversation List */}
      <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
        <div className="h-full p-4 bg-background">
          <h2 className="text-lg font-semibold mb-4">Conversations</h2>
          <ConversationPanel />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right Panel - Chat Area */}
      <ResizablePanel defaultSize={70} minSize={60}>
        <div className="h-full">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
