"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { useAtomValue } from "jotai";
import { errorMessageAtom } from "@/store/widget-atoms";

export const WidgetError = () => {
  const errorMessage = useAtomValue(errorMessageAtom);
  return (
    <div className="px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">{errorMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
