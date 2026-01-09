import { useContext, useEffect } from "react";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import { ConvexDataContext } from "../ConvexDataContext";

export const useContactSession = (conversationId: Id<"conversations">) => {
  const context = useContext(ConvexDataContext);
  if (!context) {
    throw new Error(
      "useContactSession must be used within ConvexDataProvider"
    );
  }

  // Register this conversation for subscription
  useEffect(() => {
    context.registerConversation(conversationId);
    return () => {
      context.unregisterConversation(conversationId);
    };
  }, [conversationId, context]);

  const contactSession = context.state.contactSessions.get(conversationId);

  return contactSession;
};
