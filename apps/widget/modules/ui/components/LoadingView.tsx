import { Spinner } from "@workspace/ui/components/spinner";

export const LoadingView = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Spinner className="size-8" />
      <p className="text-muted-foreground mt-4">Loading...</p>
    </div>
  );
};
