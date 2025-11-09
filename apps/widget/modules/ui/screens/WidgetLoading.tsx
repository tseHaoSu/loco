import {
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
  contactSessionIdAtomFamily,
} from "@/store/widget-atoms";
import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { Spinner } from "@workspace/ui/components/spinner";
import { useAction, useMutation } from "convex/react";
import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

type Init = "storage" | "org" | "session" | "settings" | "vapi" | "done";

interface Props {
  organizationId?: string | null;
}

export const WidgetLoading = ({ organizationId }: Props) => {
  const [step, setStep] = useState<Init>("org");
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom);
  const setScreen = useSetAtom(screenAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);

  // Get the contact session atom for this specific organization
  const contactSessionIdAtom = organizationId
    ? contactSessionIdAtomFamily(organizationId)
    : atom<string | null>(null);
  const [contactSessionId, setContactSessionId] = useAtom(contactSessionIdAtom);
  const validateOrganization = useAction(api.public.organizations.validate);

  // 1. validate organization
  useEffect(() => {
    if (step !== "org") return;

    if (!organizationId) {
      setErrorMessage("Organization ID required");
      setScreen("error");
      return;
    }

    setLoadingMessage("Validating organization...");

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
    setLoadingMessage,
    setOrganizationId,
    setStep,
  ]);

  // 2. validate session
  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  );

  useEffect(() => {
    if (step !== "session") return;

    setLoadingMessage("Checking session...");

    if (!contactSessionId) {
      setStep("done");
      setScreen("auth");
      return;
    }

    const validateSession = async () => {
      try {
        const result = await validateContactSession({
          contactSessionId: contactSessionId as Id<"contactSessions">,
        });

        if (result.valid) {
          setStep("done");
          setScreen("selection");
        } else {
          setContactSessionId(null);
          setStep("done");
          setScreen("auth");
        }
      } catch (error) {
        setContactSessionId(null);
        setStep("done");
        setScreen("auth");
      }
    };

    validateSession();
  }, [
    step,
    contactSessionId,
    validateContactSession,
    setContactSessionId,
    setLoadingMessage,
    setScreen,
    setStep,
  ]);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Spinner className="size-8" />
      <p className="text-muted-foreground mt-4">
        {loadingMessage || "Loading..."}
      </p>
    </div>
  );
};
