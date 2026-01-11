"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useMutation, useQuery } from "convex/react";
import { ArrowUp, Loader2, MoreHorizontalIcon, Trash2, User, Wand2Icon } from "lucide-react";
import { z } from "zod";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import {
  AIConversation,
  AIConversationContent,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
} from "@workspace/ui/components/ai/input";
import { InfiniteScrollTrigger } from "@workspace/ui/components/ai/infinite-scroll-trigger";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Button } from "@workspace/ui/components/button";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Form, FormControl, FormField } from "@workspace/ui/components/form";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";

import { ConversationStatus } from "../components/ConversationStatus";
import { useContactPanel } from "../context/ContactPanelContext";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

interface ConversationViewProps {
  conversationId: Id<"conversations">;
}

export const ConversationView = ({ conversationId }: ConversationViewProps) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isContactPanelOpen, toggleContactPanel } = useContactPanel();
  const router = useRouter();

  const conversation = useQuery(api.private.conversations.getOne, { conversationId });

  const messagesResult = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: 10 }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messagesResult?.status ?? "LoadingFirstPage",
      loadMore: messagesResult?.loadMore ?? (() => {}),
      loadSize: 10,
      observerEnabled: true,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useMutation(api.private.messages.create);

  const enhanceResponse = useAction(api.private.messages.enhanceResponse);

  const handleEnhanceResponse = async () => {
    const currentValue = form.getValues("message");
    if (!currentValue.trim()) return;

    setIsEnhancing(true);
    try {
      const response = await enhanceResponse({ prompt: currentValue });
      form.setValue("message", response);
    } catch (error) {
      console.error("Failed to enhance message:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

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

  const updateConversationStatus = useMutation(
    api.private.conversations.updateStatus
  );

  const deleteConversation = useMutation(api.private.conversations.remove);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteConversation({ conversationId });
      router.push("/conversations");
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!conversation) return;

    setIsUpdatingStatus(true);
    let newStatus: "unresolved" | "resolved" | "escalated";

    if (conversation.status === "unresolved") {
      newStatus = "resolved";
    } else if (conversation.status === "resolved") {
      newStatus = "escalated";
    } else {
      newStatus = "unresolved";
    }

    try {
      await updateConversationStatus({
        conversationId: conversationId,
        status: newStatus,
      });
      console.log("Conversation status updated to:", newStatus);
    } catch (error) {
      console.error("Failed to update conversation status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background px-3 py-2.5">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={toggleContactPanel}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                {isContactPanelOpen ? "Hide details" : "Show details"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {conversation && (
            <ConversationStatus
              onClick={handleToggleStatus}
              status={conversation.status}
              disabled={isUpdatingStatus}
            />
          )}
        </div>
      </header>

      <AIConversation className="max-h-[calc(100vh-150px)] md:max-h-[calc(100vh-120px)]">
        <AIConversationContent>
          <InfiniteScrollTrigger
            ref={topElementRef}
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            loadMoreText="Load older messages"
            noMoreText="No older messages"
          />
          {toUIMessages(messagesResult?.results ?? [])?.map((message) => (
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
            <AIInputToolbar className="gap-2">
              <AIInputButton
                disabled={conversation?.status === "resolved" || isEnhancing}
                onClick={handleEnhanceResponse}
                className="hidden sm:inline-flex"
              >
                {isEnhancing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2Icon className="h-4 w-4" />
                )}
                <span className="hidden md:inline">
                  {isEnhancing ? "Enhancing..." : "Enhance"}
                </span>
              </AIInputButton>
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

export const ConversationLoadingSkeleton = () => {
  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background px-3 py-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="hidden h-8 w-8 rounded-md lg:block" />
        </div>
      </header>

      <div className="flex-1 overflow-hidden p-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-64 rounded-md" />
              <Skeleton className="h-4 w-48 rounded-md" />
            </div>
          </div>

          <div className="flex items-start justify-end gap-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-40 rounded-md" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-72 rounded-md" />
              <Skeleton className="h-4 w-56 rounded-md" />
              <Skeleton className="h-4 w-64 rounded-md" />
            </div>
          </div>

          <div className="flex items-start justify-end gap-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-52 rounded-md" />
              <Skeleton className="h-4 w-36 rounded-md" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-60 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-2">
        <div className="flex gap-2 rounded-2xl border bg-background p-2">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
