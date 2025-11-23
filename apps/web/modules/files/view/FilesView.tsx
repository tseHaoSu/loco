"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Plus, FileIcon, MoreHorizontal, Trash, Upload } from "lucide-react";
import { InfiniteScrollTrigger } from "@workspace/ui/components/ai/infinite-scroll-trigger";
import { UploadDialog } from "../components/UploadDialog";
import { DeleteFileDialog } from "../components/DeleteFileDialog";

export const FilesView = () => {
  const files = usePaginatedQuery(
    api.private.files.list,
    {},
    { initialNumItems: 10 }
  );

  const deleteFile = useMutation(api.private.files.deleteFile);

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingFirstPage,
    isLoadingMore,
  } = useInfiniteScroll({
    status: files.status,
    loadMore: files.loadMore,
    loadSize: 10,
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{
    id: string & { _: "EntryId" };
    name: string;
  } | null>(null);

  const handleDeleteClick = (
    entryId: string & { _: "EntryId" },
    fileName: string
  ) => {
    setFileToDelete({ id: entryId, name: fileName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    try {
      await deleteFile({ entryId: fileToDelete.id });
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <>
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onFileUploaded={() => {}}
      />
      <DeleteFileDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        fileName={fileToDelete?.name}
      />
      <div className="min-h-screen bg-muted p-8 flex flex-col">
        <div className="mx-auto w-full max-w-screen-md">
          <h1 className="mb-2 text-2xl font-bold">Knowledge Base</h1>
          <p className="mb-6 text-muted-foreground">
            Upload and manage documents for your AI assistant
          </p>
          <div className="mt-8 rounded-lg border bg-background">
            <div className="flex items-center justify-end border-b px-6 py-4">
              <Button onClick={() => setUploadDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Upload
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4 font-medium">Name</TableHead>
                  <TableHead className="px-6 py-4 font-medium">Type</TableHead>
                  <TableHead className="px-6 py-4 font-medium">Size</TableHead>
                  <TableHead className="px-6 py-4 font-medium text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingFirstPage ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      Loading files...
                    </TableCell>
                  </TableRow>
                ) : files.results.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      No files found
                    </TableCell>
                  </TableRow>
                ) : (
                  files.results.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{file.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="secondary">
                          {file.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">{file.size}</TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(file.id, file.name)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {!isLoadingFirstPage && files.results.length > 0 && (
              <InfiniteScrollTrigger
                canLoadMore={canLoadMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
                ref={topElementRef}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
