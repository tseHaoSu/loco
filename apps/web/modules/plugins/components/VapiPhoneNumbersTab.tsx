"use client";

import { Check, Loader2, Phone } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { useVapiPhoneNumbers } from "../hooks/use-vapi-data";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

export const VapiPhoneNumbersTab = () => {
  const { data: phoneNumbers, isLoading, error } = useVapiPhoneNumbers();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Phone number copied to clipboard", {
        description: "You can now paste it into your phone's contacts.",
      });
    } catch (error) {
      toast.error("Failed to copy to clipboard", {
        description: "Please try copying the phone number manually.",
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Phone Number</TableHead>
          <TableHead className="font-semibold">Name</TableHead>
          <TableHead className="font-semibold">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(() => {
          if (isLoading) {
            return (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            );
          }

          if (!phoneNumbers || phoneNumbers.length === 0) {
            return (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No phone numbers configured
                </TableCell>
              </TableRow>
            );
          }

          return phoneNumbers.map((phoneNumber) => (
            <TableRow key={phoneNumber.id} className="hover:bg-muted/50">
              <TableCell className="font-mono">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {phoneNumber.number || "-"}
                </div>
              </TableCell>
              <TableCell>{phoneNumber.name || "-"}</TableCell>
              <TableCell>
                {phoneNumber.status === "active" ? (
                  <Badge variant="default" className="gap-1">
                    <Check className="h-3 w-3" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="destructive">{phoneNumber.status || "-"}</Badge>
                )}
              </TableCell>
            </TableRow>
          ));
        })()}
      </TableBody>
    </Table>
  );
};
