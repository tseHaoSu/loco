"use client";

import { useState } from "react";

import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

interface EmbedCodeCardProps {
  embedCode: string;
}

export const EmbedCodeCard = ({ embedCode }: EmbedCodeCardProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Code</CardTitle>
        <CardDescription>
          Copy this code and paste it before the closing {"</body>"} tag on your
          website.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
            <code>{embedCode}</code>
          </pre>
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2 right-2"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          The widget will automatically appear as a chat button on your website.
        </p>
      </CardContent>
    </Card>
  );
};
