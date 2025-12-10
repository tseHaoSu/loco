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
        "relative border-b bg-muted/30 px-4 py-4",
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        <h1 className="text-base font-semibold">Loco Assistant</h1>
        <p className="text-xs text-muted-foreground">
          AI-powered support
        </p>
      </div>
    </header>
  );
};
