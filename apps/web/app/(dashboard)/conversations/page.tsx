import React from "react";
import { LassoSelect } from "lucide-react";

const Conversations = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <LassoSelect className="h-16 w-16" />
        <p className="text-lg">Select a conversation to view details</p>
      </div>
    </div>
  );
};

export default Conversations;
