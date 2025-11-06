import React from "react";
import { cn } from "@workspace/ui/lib/utils";

export const WidgetHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <header
      className={cn(
        "relative border-b border-white/10 bg-gradient-to-br from-background/80 via-muted/10 to-accent/5 p-4 backdrop-blur-md shadow-lg",
        className
      )}
    >
      {children}
    </header>
  );
};
