import {
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
  contactSessionIdAtomFamily,
  conversationIdAtomFamily,
  widgetSettingsAtom,
} from "@/store/widget-atoms";
import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { Spinner } from "@workspace/ui/components/spinner";
import { useAction, useMutation, useQuery } from "convex/react";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

type Init = "storage" | "org" | "session" | "settings" | "vapi" | "done";

interface Props {
  organizationId?: string | null;
}

type NextScreen = "auth" | "chat" | "selection";

export const WidgetLoading = ({ organizationId }: Props) => {
  const setWidgetSettings = useSetAtom(widgetSettingsAtom);
  const [step, setStep] = useState<Init>("org");
  const [nextScreen, setNextScreen] = useState<NextScreen | null>(null);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);

  // Get the contact session and conversation atoms
  // Use empty string as fallback
  const [contactSessionId, setContactSessionId] = useAtom(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const [conversationId] = useAtom(
    conversationIdAtomFamily(organizationId || "")
  );

  const validateOrganization = useAction(api.public.organizations.validate);

  // Query widget settings
  const widgetSettings = useQuery(
    api.public.widgetSettings.getByOrganizationId,
    organizationId ? { organizationId } : "skip"
  );

  // 1. validate organization
  useEffect(() => {
    if (step !== "org") return;

    if (!organizationId) {
      setErrorMessage("Organization ID required");
      setScreen("error");
      return;
    }

    const validate = async () => {
      const result = await validateOrganization({ organizationId });
      if (!result.valid) {
        setErrorMessage(result.reason || "Invalid organization");
        setScreen("error");
      } else {
        setOrganizationId(organizationId);
        setStep("session");
      }
    };

    validate();
  }, [
    step,
    organizationId,
    validateOrganization,
    setErrorMessage,
    setScreen,
    setOrganizationId,
    setStep,
  ]);

  // 2. validate session
  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  );

  useEffect(() => {
    if (step !== "session") return;

    if (!contactSessionId) {
      setNextScreen("auth");
      setStep("settings");
      return;
    }

    const validateSession = async () => {
      try {
        const result = await validateContactSession({
          contactSessionId: contactSessionId as Id<"contactSessions">,
        });

        if (result.valid) {
          setNextScreen(conversationId ? "chat" : "selection");
          setStep("settings");
        } else {
          setContactSessionId(null);
          setNextScreen("auth");
          setStep("settings");
        }
      } catch (error) {
        setContactSessionId(null);
        setNextScreen("auth");
        setStep("settings");
      }
    };

    validateSession();
  }, [
    step,
    contactSessionId,
    conversationId,
    validateContactSession,
    setContactSessionId,
    setStep,
  ]);

  // 3. load widget settings
  useEffect(() => {
    if (step !== "settings") return;
    if (widgetSettings !== undefined) {
      setWidgetSettings(widgetSettings);
      setStep("done");
      if (nextScreen) {
        setScreen(nextScreen);
      }
    }
  }, [step, widgetSettings, nextScreen, setWidgetSettings, setStep, setScreen]);

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Spinner className="size-8" />
    </div>
  );
};
