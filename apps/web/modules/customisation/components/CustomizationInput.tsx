"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { api } from "@workspace/backend/convex/_generated/api";
import { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { useVapiData } from "../../../contexts/hooks/useVapiData";

const widgetSettingsSchema = z.object({
  greetMessage: z.string().min(1, "Required"),
  defaultSuggestions: z.object({
    suggestion1: z.string().min(1, "Required"),
    suggestion2: z.string().min(1, "Required"),
    suggestion3: z.string().min(1, "Required"),
  }),
  vapiSettings: z.object({
    assistandId: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});

type WidgetSettingsFormValues = z.infer<typeof widgetSettingsSchema>;

interface CustomizationInputProps {
  initialData: Doc<"widgetSettings"> | null;
}

export const CustomizationInput = ({
  initialData,
}: CustomizationInputProps) => {
  const upsertSettings = useMutation(api.private.widgetSettings.upsert);
  const removeSettings = useMutation(api.private.widgetSettings.remove);
  const { assistants, phoneNumbers, isLoading } = useVapiData();

  const assistantsLoading = isLoading;
  const phoneNumbersLoading = isLoading;

  const form = useForm<WidgetSettingsFormValues>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage: initialData?.greetMessage ?? "",
      defaultSuggestions: {
        suggestion1: initialData?.defaultSuggestions.suggestion1 ?? "",
        suggestion2: initialData?.defaultSuggestions.suggestion2 ?? "",
        suggestion3: initialData?.defaultSuggestions.suggestion3 ?? "",
      },
      vapiSettings: {
        assistandId: initialData?.vapiSettings.assistandId ?? "",
        phoneNumber: initialData?.vapiSettings.phoneNumber ?? "",
      },
    },
  });

  const { formState } = form;
  const { isSubmitting } = formState;

  const onClear = async () => {
    try {
      await removeSettings();
      form.reset({
        greetMessage: "",
        defaultSuggestions: {
          suggestion1: "",
          suggestion2: "",
          suggestion3: "",
        },
        vapiSettings: {
          assistandId: "",
          phoneNumber: "",
        },
      });
      toast.success("Widget settings cleared");
    } catch (error) {
      console.error("Failed to clear widget settings:", error);
      toast.error("Failed to clear widget settings");
    }
  };

  const onSubmit = async (data: WidgetSettingsFormValues) => {
    try {
      await upsertSettings({
        greetMessage: data.greetMessage,
        defaultSuggestions: data.defaultSuggestions,
        vapiSettings: {
          assistandId: data.vapiSettings.assistandId || undefined,
          phoneNumber: data.vapiSettings.phoneNumber || undefined,
        },
      });
      toast.success("Widget settings saved successfully");
    } catch (error) {
      console.error("Failed to save widget settings:", error);
      toast.error("Failed to save widget settings");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        {/* Greeting Message Card */}
        <Card>
          <CardHeader>
            <CardTitle>Greeting Message</CardTitle>
            <CardDescription>
              The initial message displayed when customers open the widget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Hello! How can I help you today?"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Default Suggestions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Default Suggestions</CardTitle>
            <CardDescription>
              Quick action buttons displayed to customers for common questions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="defaultSuggestions.suggestion1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suggestion 1</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What are your business hours?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultSuggestions.suggestion2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suggestion 2</FormLabel>
                  <FormControl>
                    <Input placeholder="How do I track my order?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultSuggestions.suggestion3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suggestion 3</FormLabel>
                  <FormControl>
                    <Input placeholder="I need help with a refund" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Vapi Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Vapi Settings</CardTitle>
            <CardDescription>
              Configure voice AI settings for your widget (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="vapiSettings.assistandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assistant</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            assistantsLoading
                              ? "Loading assistants..."
                              : "Select an assistant"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assistants?.map((assistant) => (
                        <SelectItem key={assistant.id} value={assistant.id}>
                          {assistant.name || assistant.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vapiSettings.phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            phoneNumbersLoading
                              ? "Loading phone numbers..."
                              : "Select a phone number"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {phoneNumbers
                        ?.filter((p) => p.number)
                        .map((phoneNumber) => (
                          <SelectItem
                            key={phoneNumber.id}
                            value={phoneNumber.number!}
                          >
                            {phoneNumber.name
                              ? `${phoneNumber.number} (${phoneNumber.name})`
                              : phoneNumber.number}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClear}
            disabled={isSubmitting}
          >
            Clear
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </div>
      </form>
    </Form>
  );
};
