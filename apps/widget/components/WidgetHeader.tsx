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
        "relative border-b bg-gradient-to-br from-background via-muted/20 to-accent/10 p-4",
        className
      )}
    >
      {children}
    </header>
  );
};
