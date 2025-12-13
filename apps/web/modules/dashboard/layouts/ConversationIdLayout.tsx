"use client";

import type { ReactNode } from "react";

import { User } from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@workspace/ui/components/resizable";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { Button } from "@workspace/ui/components/button";

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
    <>
      {/* Desktop layout */}
      <div className="hidden lg:block h-full">
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
              <ResizableHandle />
              <ResizablePanel
                defaultSize={40}
                minSize={20}
                className="transition-all duration-300 ease-in-out"
              >
                <div className="flex h-full flex-col border-l border-border">
                  <ContactPanel />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Mobile/Tablet layout */}
      <div className="flex lg:hidden h-full flex-col">
        <div className="flex-1 overflow-hidden">{children}</div>

        {/* Mobile contact panel trigger - floating button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg lg:hidden"
            >
              <User className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm p-0">
            <SheetTitle className="sr-only">Contact Details</SheetTitle>
            <ContactPanel />
          </SheetContent>
        </Sheet>
      </div>
    </>
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
