"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "@clerk/nextjs";

import { EmbedCodeCard } from "../components/EmbedCodeCard";
import { InstructionsCard } from "../components/InstructionsCard";
import { WidgetConfigCard } from "../components/WidgetConfigCard";

const WIDGET_SCRIPT_URL = "https://loco-web-gules.vercel.app/widget.js";

const widgetFormSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
  position: z.enum(["bottom-right", "bottom-left"]),
});

export type WidgetFormValues = z.infer<typeof widgetFormSchema>;

const generateEmbedCode = (values: WidgetFormValues) => `<script
  src="${WIDGET_SCRIPT_URL}"
  data-organization-id="${values.organizationId}"
  data-position="${values.position}">
</script>`;

const cleanupWidget = () => {
  document.getElementById("loco-widget-button")?.remove();
  document.getElementById("loco-widget-container")?.remove();
};

export const IntegrationsView = () => {
  const { orgId } = useAuth();
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<WidgetFormValues>({
    resolver: zodResolver(widgetFormSchema),
    defaultValues: {
      organizationId: orgId ?? "",
      position: "bottom-right",
    },
  });

  const watchedValues = form.watch();
  const embedCode = generateEmbedCode(watchedValues);

  useEffect(() => {
    if (!showPreview || !watchedValues.organizationId) return;

    cleanupWidget();

    const script = document.createElement("script");
    script.src = WIDGET_SCRIPT_URL;
    script.setAttribute("data-organization-id", watchedValues.organizationId);
    script.setAttribute("data-position", watchedValues.position);
    document.body.appendChild(script);

    return () => {
      script.remove();
      cleanupWidget();
    };
  }, [showPreview, watchedValues.organizationId, watchedValues.position]);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Integrations/Preview</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Add the widget to your website and preview it live.
        </p>
      </div>
      <InstructionsCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <WidgetConfigCard
          form={form}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
        />
        <EmbedCodeCard embedCode={embedCode} />
      </div>
    </div>
  );
};
