import React from "react";
import { cn } from "@workspace/ui/lib/utils";

interface WidgetHeaderProps {
  organizationId?: string;
  className?: string;
}

export const WidgetHeader = ({
  organizationId,
  className,
}: WidgetHeaderProps) => {
  return (
    <header
      className={cn(
        "relative border-b border-white/10 bg-gradient-to-br from-background/80 via-muted/10 to-accent/5 p-4 shadow-lg backdrop-blur-md",
        className
      )}
    >
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold">Voice Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Click the button below to start a conversation
        </p>
      </div>
    </header>
  );
};
