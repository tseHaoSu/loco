"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { useAction } from "convex/react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  Dropzone,
  DropzoneEmptyState,
  DropzoneContent,
} from "@workspace/ui/components/dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const uploadSchema = z.object({
  category: z.string().min(1, "Category is required"),
  filename: z.string().optional(),
});

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded: () => void;
}

type UploadFormValues = z.infer<typeof uploadSchema>;

export const UploadDialog = ({
  open,
  onOpenChange,
  onFileUploaded,
}: UploadDialogProps) => {
  const addFile = useAction(api.private.files.addFile);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      category: "",
      filename: "",
    },
  });

  const handleFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file) {
      setUploadFiles([file]);
      if (!form.getValues("filename")) {
        form.setValue("filename", file.name);
      }
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setUploadFiles([]);
    form.reset();
  };

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const file = uploadFiles[0];
      if (!file) return;

      const filename = form.getValues("filename") || file.name;
      const category = form.getValues("category");

      const arrayBuffer = await file.arrayBuffer();

      await addFile({
        filename,
        mimeType: file.type || "text/plain",
        bytes: arrayBuffer,
        category,
      });

      onFileUploaded();
      handleCancel();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a document to your knowledge base for AI-assisted access.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="filename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Filename{" "}
                    <span className="text-sm text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Overwrite" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Documentation, Support, FAQ"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <Dropzone
          accept={{
            "application/pdf": [".pdf"],
            "text/csv": [".csv"],
            "text/plain": [".txt"],
          }}
          disabled={isUploading}
          maxFiles={1}
          onDrop={handleFileDrop}
          src={uploadFiles}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={
              uploadFiles.length === 0 ||
              isUploading ||
              !form.watch("category")
            }
            onClick={handleUpload}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
