import { useContext } from "react";
import { ConvexDataContext } from "../ConvexDataContext";

export const useFiles = () => {
  const context = useContext(ConvexDataContext);
  if (!context) {
    throw new Error("useFiles must be used within ConvexDataProvider");
  }

  const { files } = context.state;

  return {
    files: files.items,
    status: files.status,
    isLoading: files.isLoading,
    hasMore: files.status === "CanLoadMore",
    loadMore: context.loadMoreFiles,
  };
};
