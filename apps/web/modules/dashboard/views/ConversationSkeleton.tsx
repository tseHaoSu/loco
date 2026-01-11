import { Skeleton } from "@workspace/ui/components/skeleton";

export const ConversationLoadingSkeleton = () => {
  return (
    <div className="flex h-full flex-col bg-muted">
      {/* Header Skeleton */}
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </header>

      {/* Messages Area Skeleton */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="flex flex-col gap-6">
          {/* AI Message Skeleton */}
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-64 rounded-md" />
              <Skeleton className="h-4 w-48 rounded-md" />
            </div>
          </div>

          {/* User Message Skeleton */}
          <div className="flex items-start justify-end gap-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-40 rounded-md" />
            </div>
          </div>

          {/* AI Message Skeleton */}
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-72 rounded-md" />
              <Skeleton className="h-4 w-56 rounded-md" />
              <Skeleton className="h-4 w-64 rounded-md" />
            </div>
          </div>

          {/* User Message Skeleton */}
          <div className="flex items-start justify-end gap-3">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-52 rounded-md" />
              <Skeleton className="h-4 w-36 rounded-md" />
            </div>
          </div>

          {/* AI Message Skeleton */}
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-60 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Input Area Skeleton */}
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
