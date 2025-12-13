"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@workspace/ui/components/resizable";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Button } from "@workspace/ui/components/button";
import { ConversationPanel } from "../components/ConversationPanel";

interface ConversationLayoutProps {
  children: React.ReactNode;
}

export const ConversationLayout = ({ children }: ConversationLayoutProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();
  const isConversationSelected = pathname !== "/conversations";

  return (
    <>
      {/* Desktop layout with resizable panels */}
      <div className="hidden md:flex h-screen w-full">
        <ResizablePanelGroup direction="horizontal" className="w-full">
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
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden flex-col h-[calc(100vh-57px)] w-full">
        {/* Mobile conversation list toggle */}
        {isConversationSelected && (
          <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-2">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Menu className="h-4 w-4" />
                  <span>Conversations</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm p-0">
                <div className="h-full pt-10" onClick={() => setIsSheetOpen(false)}>
                  <ConversationPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* Show conversation list if no conversation selected, otherwise show children */}
        {!isConversationSelected ? (
          <div className="flex-1 overflow-hidden">
            <ConversationPanel />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">{children}</div>
        )}
      </div>
    </>
  );
};
