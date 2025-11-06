import { Button } from "@workspace/ui/components/button";
import { Home, Inbox } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface WidgetFooterProps {
  screen?: "home" | "inbox";
  onNavigate?: (screen: "home" | "inbox") => void;
}

export const WidgetFooter = ({ screen = "home", onNavigate }: WidgetFooterProps) => {
  return (
    <div className="flex items-center justify-center gap-2 border-t bg-background p-4">
      <Button
        variant="ghost"
        className="flex-1"
        onClick={() => onNavigate?.("home")}
      >
        <Home
          className={cn(
            "mr-2 h-4 w-4",
            screen === "home" ? "text-primary" : "text-muted-foreground"
          )}
        />
        Home
      </Button>
      <Button
        variant="ghost"
        className="flex-1"
        onClick={() => onNavigate?.("inbox")}
      >
        <Inbox
          className={cn(
            "mr-2 h-4 w-4",
            screen === "inbox" ? "text-primary" : "text-muted-foreground"
          )}
        />
        Inbox
      </Button>
    </div>
  );
};
