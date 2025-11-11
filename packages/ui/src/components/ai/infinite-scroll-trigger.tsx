import { cn } from "../../lib/utils.js";
import { Button } from "../button.js";

interface InfiniteScrollTriggerProps {
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  loadMoreText?: string;
  noMoreText?: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const InfiniteScrollTrigger = ({
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  loadMoreText = "Load more",
  className,
  ref,
  noMoreText = "No more items to load",
}: InfiniteScrollTriggerProps) => {
  let text = loadMoreText;

  if (isLoadingMore) {
    text = "Loading...";
  } else if (!canLoadMore) {
    text = noMoreText;
  }

  return (
    <div className={cn("flex justify-center w-full py-2", className)} ref={ref}>
      <Button
        onClick={onLoadMore}
        disabled={!canLoadMore || isLoadingMore}
        size="sm"
        variant="ghost"
      >
        {text}
      </Button>
    </div>
  );
};
