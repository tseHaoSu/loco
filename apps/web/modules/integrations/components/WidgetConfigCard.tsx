"use client";

import type { UseFormReturn } from "react-hook-form";

import { Code, Eye } from "lucide-react";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import type { WidgetFormValues } from "../view/IntegrationsView";

interface WidgetConfigCardProps {
  form: UseFormReturn<WidgetFormValues>;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export const WidgetConfigCard = ({
  form,
  showPreview,
  onTogglePreview,
}: WidgetConfigCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Widget Configuration
        </CardTitle>
        <CardDescription>
          Configure your widget settings and get the embed code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="organizationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization ID</FormLabel>
                  <FormControl>
                    <Input placeholder="org_xxxxxxxxx" {...field} readOnly />
                  </FormControl>
                  <FormDescription>
                    This ID is linked to your account. Use this exact ID when
                    embedding the widget on your website.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Where the widget button appears on the page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant={showPreview ? "default" : "outline"}
              onClick={onTogglePreview}
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "Hide Preview" : "Show Live Preview"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
