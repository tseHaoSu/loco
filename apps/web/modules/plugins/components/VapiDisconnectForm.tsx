"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";

interface VapiDisconnectFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const VapiDisconnectForm = ({
  open,
  setOpen,
}: VapiDisconnectFormProps) => {
  const removePlugin = useMutation(api.private.plugin.remove);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      await removePlugin({ service: "vapi" });

      toast.success("Vapi disconnected successfully", {
        description: "Your Vapi integration has been removed.",
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to disconnect Vapi:", error);
      toast.error("Failed to disconnect Vapi", {
        description: "Please try again later.",
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Disconnect Vapi</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to disconnect your Vapi integration? This will
            remove all stored credentials and you'll need to reconnect to use
            Vapi features again.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDisconnecting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDisconnect}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? "Disconnecting..." : "Disconnect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
