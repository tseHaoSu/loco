"use client";

import { Loader2 } from "lucide-react";

import { Separator } from "@workspace/ui/components/separator";
import { useWidgetSettings } from "../../../contexts/hooks/useWidgetSettings";

import { CustomizationInput } from "../components/CustomizationInput";

export const CustomizationView = () => {
  const widgetSettings = useWidgetSettings();

  // Loading state
  if (widgetSettings === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted p-4 sm:p-6 md:p-8">
      <div className="mx-auto w-full max-w-screen-md">
        <h1 className="mb-2 text-xl sm:text-2xl font-bold">Customization</h1>
        <p className="mb-6 text-sm sm:text-base text-muted-foreground">
          Customize the appearance and behavior of your widget
        </p>

        <CustomizationInput initialData={widgetSettings} />
      </div>
    </div>
  );
};
