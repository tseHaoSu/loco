import { ConversationView } from "@/modules/dashboard/view/ConversationView";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import React from "react";

const Conversations = async ({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) => {
  const { conversationId } = await params;

  return (
    <ConversationView conversationId={conversationId as Id<"conversations">} />
  );
};

export default Conversations;
