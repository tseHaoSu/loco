import {
  contactSessionIdAtomFamily,
  conversationIdAtomFamily,
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
  vapiSecretsAtom,
  widgetSettingsAtom,
} from "@/store/widget-atoms";
import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { Spinner } from "@workspace/ui/components/spinner";
import { useAction, useMutation, useQuery } from "convex/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

interface Props {
  organizationId?: string | null;
}

export const WidgetLoading = ({ organizationId }: Props) => {
  const [isInitializing, setIsInitializing] = useState(false);

  const screen = useAtomValue(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setVapiSecrets = useSetAtom(vapiSecretsAtom);
  const setWidgetSettings = useSetAtom(widgetSettingsAtom);

  const [contactSessionId, setContactSessionId] = useAtom(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const [conversationId] = useAtom(
    conversationIdAtomFamily(organizationId || "")
  );

  const validateOrganization = useAction(api.public.organizations.validate);
  const getVapiSecrets = useAction(api.public.secrets.getVapiSecrets);
  const validateContactSession = useMutation(api.public.contactSessions.validate);

  const widgetSettings = useQuery(
    api.public.widgetSettings.getByOrganizationId,
    organizationId ? { organizationId } : "skip"
  );

  useEffect(() => {
    // Skip if already navigated away or currently initializing
    if (screen !== "loading" || isInitializing) return;

    if (!organizationId) {
      setErrorMessage("Organization ID required");
      setScreen("error");
      return;
    }

    if (widgetSettings === undefined) return;

    setIsInitializing(true);

    const initialize = async () => {
      const orgResult = await validateOrganization({ organizationId });
      if (!orgResult.valid) {
        setErrorMessage(orgResult.reason || "Invalid organization");
        setScreen("error");
        return;
      }
      setOrganizationId(organizationId);

      // 2. Validate session (if exists)
      let validSessionId = contactSessionId;
      if (contactSessionId) {
        try {
          const sessionResult = await validateContactSession({
            contactSessionId: contactSessionId as Id<"contactSessions">,
          });
          if (!sessionResult.valid) {
            setContactSessionId(null);
            validSessionId = null;
          }
        } catch {
          setContactSessionId(null);
          validSessionId = null;
        }
      }

      // 3. Load widget settings
      if (widgetSettings) {
        setWidgetSettings(widgetSettings);
      }

      // 4. Load VAPI secrets
      try {
        const secrets = await getVapiSecrets({ organizationId });
        if (secrets?.publicApiKey) {
          setVapiSecrets({ publicApiKey: secrets.publicApiKey });
        }
      } catch {
        // VAPI secrets are optional
      }

      // 5. Navigate to appropriate screen
      setScreen(validSessionId ? (conversationId ? "chat" : "selection") : "auth");
    };

    initialize();
  }, [
    screen,
    isInitializing,
    organizationId,
    widgetSettings,
    contactSessionId,
    conversationId,
    validateOrganization,
    validateContactSession,
    getVapiSecrets,
    setErrorMessage,
    setScreen,
    setOrganizationId,
    setContactSessionId,
    setWidgetSettings,
    setVapiSecrets,
  ]);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Spinner className="size-8" />
    </div>
  );
};
