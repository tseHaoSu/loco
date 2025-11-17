"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { useAtom, useSetAtom } from "jotai";
import { screenAtom, contactSessionIdAtomFamily } from "@/store/widget-atoms";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

interface WidgetAuthProps {
  organizationId: string;
}

export const WidgetAuth = ({ organizationId }: WidgetAuthProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const setScreen = useSetAtom(screenAtom);
  const contactSessionIdAtom = contactSessionIdAtomFamily(organizationId);
  const [contactSessionId, setContactSessionId] = useAtom(contactSessionIdAtom);

  const createContactSession = useMutation(api.public.contactSessions.create);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const sessionId = await createContactSession({
        name: data.name,
        email: data.email,
        organizationId,
        metadata: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screenResolution: `${screen.width}x${screen.height}`,
          viewportSize: `${window.innerWidth}x${window.innerHeight}`,
          referrer: document.referrer || undefined,
        },
      });

      // Save session ID to localStorage and navigate to selection
      setContactSessionId(sessionId);
      setScreen("selection");
      form.reset();
    } catch (error) {
      console.error("Failed to create contact session:", error);
    }
  };

  return (
    <div className="px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
