"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { useAtom, useSetAtom } from "jotai";
import { screenAtom, contactSessionIdAtomFamily } from "@/store/widget-atoms";
import { User, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

interface WidgetAuthProps {
  organizationId: string;
}

export const WidgetAuth = ({ organizationId }: WidgetAuthProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const setScreen = useSetAtom(screenAtom);
  const contactSessionIdAtom = contactSessionIdAtomFamily(organizationId);
  const [, setContactSessionId] = useAtom(contactSessionIdAtom);

  const createContactSession = useMutation(api.public.contactSessions.create);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
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

      setContactSessionId(sessionId);
      setScreen("loading");
      form.reset();
    } catch (error) {
      console.error("Failed to create contact session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col px-4 py-3">
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-base font-semibold">Welcome</h2>
          <p className="text-xs text-muted-foreground">
            Enter your details to get started
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        placeholder="Your name"
                        className="h-11 rounded-xl border-muted bg-muted/50 pl-10 text-sm transition-all focus:bg-background"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        type="email"
                        placeholder="Your email"
                        className="h-11 rounded-xl border-muted bg-muted/50 pl-10 text-sm transition-all focus:bg-background"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="ghost"
              disabled={isSubmitting}
              className="mt-1 h-10 w-full gap-2 rounded-xl bg-muted/50 text-sm font-medium transition-all hover:bg-muted"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
