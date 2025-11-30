"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
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

const formSchema = z.object({
  publicKey: z.string().min(1, "Public API key is required"),
  privateKey: z.string().min(1, "Private API key is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface VapiPluginFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const VapiPluginForm = ({ open, setOpen }: VapiPluginFormProps) => {
  const upsertSecret = useMutation(api.private.secrets.upsert);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicKey: "",
      privateKey: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await upsertSecret({
        service: "vapi",
        value: {
          publicKey: values.publicKey,
          privateKey: values.privateKey,
        },
      });

      toast.success("Vapi connected successfully!", {
        description: "Your Vapi credentials have been saved.",
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to save Vapi credentials:", error);
      toast.error("Failed to connect Vapi", {
        description: "Please check your credentials and try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Vapi</DialogTitle>
          <DialogDescription>
            Enter your Vapi API keys to connect your account. You can find these
            in your Vapi dashboard.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="publicKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public API Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your public API key"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="privateKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Private API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your private API key"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Connecting..." : "Connect"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
