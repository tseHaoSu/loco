"use client";

import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import {
  AIConversation,
  AIConversationContent
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Button } from "@workspace/ui/components/button";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { Form, FormControl, FormField } from "@workspace/ui/components/form";
import { useMutation, useQuery } from "convex/react";
import { ArrowUp, MoreHorizontalIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const ConversationView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) => {
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: 10 }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useMutation(api.private.messages.create);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessage({
        prompt: values.message,
        conversationId: conversationId,
      });
      form.reset();
    } catch (error) {
      console.error("Failed to create message:", error);
    }
  };

  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </header>

      <AIConversation className="max-h-[calc(100vh-53px)]">
        <AIConversationContent>
          {toUIMessages(messages.results ?? [])?.map((message) => (
            <AIMessage
              key={message.key}
              from={message.role === "user" ? "assistant" : "user"}
            >
              <AIMessageContent>
                <AIResponse>{message.text}</AIResponse>
              </AIMessageContent>
              {message.role === "user" && (
                <DicebearAvatar
                  seed={conversation?.contactSessionId}
                  size={32}
                />
              )}
            </AIMessage>
          ))}
        </AIConversationContent>
      </AIConversation>

      <div className="p-2">
        <Form {...form}>
          <AIInput onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={conversation?.status === "resolved"}
              name="message"
              render={({ field }) => (
                <FormControl>
                  <AIInputTextarea
                    disabled={conversation?.status === "resolved"}
                    {...field}
                    placeholder="Type your message..."
                    rows={1}
                    onChange={field.onChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                  />
                </FormControl>
              )}
            />
            <AIInputToolbar>
              <AIInputSubmit>
                <ArrowUp className="h-4 w-4" />
              </AIInputSubmit>
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </div>
  );
};
