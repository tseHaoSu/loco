"use client";

import { Bot, Check, Loader2 } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { useVapiAssistants } from "../hooks/use-vapi-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

export const VapiAssistantsTab = () => {
  const { data: assistants, isLoading } = useVapiAssistants();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Assistant</TableHead>
          <TableHead className="font-semibold">Model</TableHead>
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

          if (!assistants || assistants.length === 0) {
            return (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No assistants configured
                </TableCell>
              </TableRow>
            );
          }

          return assistants.map((assistant) => (
            <TableRow key={assistant.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-muted-foreground" />
                  {assistant.name || "-"}
                </div>
              </TableCell>
              <TableCell className="font-mono">
                {assistant.model?.model || "-"}
              </TableCell>
              <TableCell>
                {assistant.id ? (
                  <Badge variant="default" className="gap-1">
                    <Check className="h-3 w-3" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="destructive">Inactive</Badge>
                )}
              </TableCell>
            </TableRow>
          ));
        })()}
      </TableBody>
    </Table>
  );
};
