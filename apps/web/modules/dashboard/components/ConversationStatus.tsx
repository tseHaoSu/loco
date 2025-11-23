import React from "react";

import { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { Hint } from "@workspace/ui/components/hint";
import { Button } from "@workspace/ui/components/button";
import { CheckIcon } from "lucide-react";

export const ConversationStatus = ({
  status,
  onClick,
  disabled,
}: {
  status: Doc<"conversations">["status"];
  onClick: () => void;
  disabled?: boolean;
}) => {
  if (status === "unresolved")
    return (
      <Hint label="Mark as resolved">
        <Button
          onClick={onClick}
          size="sm"
          variant="destructive"
          disabled={disabled}
        >
          <CheckIcon className="h-4 w-4" />
          Unresolved
        </Button>
      </Hint>
    );

  if (status === "resolved")
    return (
      <Hint label="Mark as escalated">
        <Button
          onClick={onClick}
          size="sm"
          variant="tertiary"
          disabled={disabled}
        >
          <CheckIcon className="h-4 w-4" />
          Resolved
        </Button>
      </Hint>
    );

  return (
    <Hint label="Mark as unresolved">
      <Button
        onClick={onClick}
        size="sm"
        variant="warning"
        disabled={disabled}
      >
        <CheckIcon className="h-4 w-4" />
        Escalated
      </Button>
    </Hint>
  );
};
