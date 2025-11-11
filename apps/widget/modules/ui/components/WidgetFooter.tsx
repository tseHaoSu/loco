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
    <div className="flex items-center justify-center gap-2 border-t bg-background p-4">
      <Button
        variant="ghost"
        className="flex-1 hover:bg-orange-700 hover:text-white transition-colors"
        onClick={handleHomeClick}
      >
        <Home
          className={cn(
            "mr-2 h-4 w-4",
            isHomeActive ? "text-primary" : "text-muted-foreground"
          )}
        />
        Home
      </Button>
      <Button
        variant="ghost"
        className="flex-1 hover:bg-orange-700 hover:text-white transition-colors"
        onClick={handleInboxClick}
      >
        <Inbox
          className={cn(
            "mr-2 h-4 w-4",
            isInboxActive ? "text-primary" : "text-muted-foreground"
          )}
        />
        Inbox
      </Button>
    </div>
  );
};
