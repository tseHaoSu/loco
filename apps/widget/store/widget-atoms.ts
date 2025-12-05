import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { atomWithStorage } from "jotai/utils";
import { WidgetScreen } from "./types";
import { CONTACT_SESSION_STORAGE_KEY } from "./constants";
import { Id, Doc } from "@workspace/backend/convex/_generated/dataModel.js";

export const screenAtom = atom<WidgetScreen>("loading");
export const errorMessageAtom = atom<string | null>(
  "An unexpected error occurred."
);
export const loadingMessageAtom = atom<string | null>("Loading...");
export const organizationIdAtom = atom<string | null>(null);

// Contact session ID stored in localStorage, scoped by organization, dynamically created
export const contactSessionIdAtomFamily = atomFamily((organizationId: string) =>
  atomWithStorage<Id<"contactSessions"> | null>(
    `${CONTACT_SESSION_STORAGE_KEY}_${organizationId}`,
    null
  )
);

export const conversationIdAtomFamily = atomFamily((organizationId: string) =>
  atomWithStorage<Id<"conversations"> | null>(
    `widget_conversation_${organizationId}`,
    null
  )
);

export const conversationIdAtom = atom<Id<"conversations"> | null>(null);
export const widgetSettingsAtom = atom<Doc<"widgetSettings"> | null>(null);
export const vapiSecretsAtom = atom<{
  publicApiKey: string;
} | null>(null);

export const hasVapiSecretsAtom = atom((get) => get(vapiSecretsAtom) !== null);
