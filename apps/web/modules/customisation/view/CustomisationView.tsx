"use client";

import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";

import { api } from "@workspace/backend/convex/_generated/api";
import { Separator } from "@workspace/ui/components/separator";

import { CustomisationInput } from "../components/CustomisationInput";

export const CustomisationView = () => {
  const widgetSettings = useQuery(api.private.widgetSettings.getOne);

  // Loading state
  if (widgetSettings === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted p-8">
      <div className="mx-auto w-full max-w-screen-md">
        <h1 className="mb-2 text-2xl font-bold">Customisation</h1>
        <p className="mb-6 text-muted-foreground">
          Customize the appearance and behavior of your widget
        </p>

        <CustomisationInput initialData={widgetSettings} />
      </div>
    </div>
  );
};
