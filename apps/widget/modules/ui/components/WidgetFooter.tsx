"use client";

import { Button } from "@workspace/ui/components/button";
import { Home, Inbox } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useAtom } from "jotai";
import { screenAtom } from "@/store/widget-atoms";

export const WidgetFooter = () => {
  const [screen, setScreen] = useAtom(screenAtom);

  const handleHomeClick = () => {
    setScreen("selection");
  };

  const handleInboxClick = () => {
    setScreen("inbox");
  };

  const isHomeActive = screen === "selection" || screen === "chat" || screen === "voice" || screen === "contact";
  const isInboxActive = screen === "inbox";

  return (
    <div className="flex items-center justify-around border-t bg-background px-4 py-3">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "flex flex-col gap-1 h-auto py-2 px-4 transition-all hover:bg-muted",
          isHomeActive && "text-primary"
        )}
        onClick={handleHomeClick}
      >
        <Home className="h-5 w-5" />
        <span className="text-xs font-medium">Home</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "flex flex-col gap-1 h-auto py-2 px-4 transition-all hover:bg-muted",
          isInboxActive && "text-primary"
        )}
        onClick={handleInboxClick}
      >
        <Inbox className="h-5 w-5" />
        <span className="text-xs font-medium">Inbox</span>
      </Button>
    </div>
  );
};
