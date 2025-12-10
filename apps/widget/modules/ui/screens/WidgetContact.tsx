"use client";

import { screenAtom, widgetSettingsAtom } from "@/store/widget-atoms";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeft, Phone } from "lucide-react";

export const WidgetContact = () => {
  const setScreen = useSetAtom(screenAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const phoneNumber = widgetSettings?.vapiSettings?.phoneNumber;

  const handleBack = () => {
    setScreen("selection");
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex shrink-0 items-center gap-3 border-b bg-background px-4 py-3">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">Contact</span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Phone className="h-5 w-5 text-primary" />
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-base font-semibold">Call Us Directly</h2>
          <p className="text-xs text-muted-foreground">Available 24/7</p>
        </div>

        {phoneNumber ? (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-3 rounded-xl bg-muted/50 px-6 py-2 text-sm font-medium transition-all hover:bg-muted"
          >
            <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Phone number not available
          </p>
        )}
      </div>
    </div>
  );
};
