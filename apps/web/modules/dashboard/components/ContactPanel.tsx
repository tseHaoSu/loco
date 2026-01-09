"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { Globe, Mail, Monitor, Clock } from "lucide-react";

import { api } from "@workspace/backend/convex/_generated/api";
import type { Id } from "@workspace/backend/convex/_generated/dataModel";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";

interface MetadataItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
}

const MetadataItem = ({ icon, label, value }: MetadataItemProps) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="truncate text-sm text-foreground">{value}</span>
      </div>
    </div>
  );
};

const ContactPanel = () => {
  const params = useParams();
  const conversationId = params.conversationId as Id<"conversations">;

  const contactSession = useQuery(
    api.private.contactSessions.getOneByConversationId,
    { conversationId }
  );

  if (!contactSession) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-background p-6 text-muted-foreground">
        <div className="h-16 w-16 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  const { metadata } = contactSession;

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex flex-col items-center gap-4 p-6">
        <div
          className={cn(
            "rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-1",
            "ring-2 ring-border ring-offset-2 ring-offset-background"
          )}
        >
          <DicebearAvatar
            seed={conversationId}
            name={contactSession.name}
            size={80}
            className="shrink-0"
          />
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            {contactSession.name}
          </h2>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            {contactSession.email}
          </p>
        </div>
      </div>

      <Separator />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Session Details
        </h3>

        <div className="flex flex-col gap-4">
          <MetadataItem
            icon={<Globe className="h-4 w-4" />}
            label="Language"
            value={metadata?.language}
          />

          <MetadataItem
            icon={<Monitor className="h-4 w-4" />}
            label="Platform"
            value={metadata?.platform}
          />

          <MetadataItem
            icon={<Monitor className="h-4 w-4" />}
            label="Screen Resolution"
            value={metadata?.screenResolution}
          />

          <MetadataItem
            icon={<Clock className="h-4 w-4" />}
            label="Timezone"
            value={metadata?.timezone}
          />

          {metadata?.referrer && (
            <MetadataItem
              icon={<Globe className="h-4 w-4" />}
              label="Referrer"
              value={metadata.referrer}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPanel;
