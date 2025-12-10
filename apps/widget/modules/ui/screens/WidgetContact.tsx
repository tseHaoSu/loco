"use client";

import { screenAtom, widgetSettingsAtom } from "@/store/widget-atoms";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeft, Clock, Phone } from "lucide-react";

export const WidgetContact = () => {
  const setScreen = useSetAtom(screenAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const phoneNumber = widgetSettings?.vapiSettings?.phoneNumber;

  const handleBack = () => {
    setScreen("selection");
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b bg-background px-4 py-3">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </header>

      <div className="flex flex-1 items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
          <Phone className="h-6 w-6 text-primary-foreground" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-lg font-semibold">Call Us Directly</h2>
          {phoneNumber ? (
            <a
              href={`tel:${phoneNumber}`}
              className="text-2xl font-bold tracking-wide text-primary transition-colors hover:text-primary/80"
            >
              {phoneNumber}
            </a>
          ) : (
            <p className="text-muted-foreground">Phone number not available</p>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2">
          <Clock className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-600">
            Available 24/7
          </span>
        </div>
      </div>
      </div>
    </div>
  );
};
