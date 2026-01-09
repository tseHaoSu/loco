import { useAction } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { FunctionReturnType } from "convex/server";

type VapiPhoneNumbersResponse = FunctionReturnType<typeof api.private.vapi.getPhoneNumber>;
type VapiAssistantsResponse = FunctionReturnType<typeof api.private.vapi.getAssistant>;

const toError = (err: unknown, fallback: string) =>
  err instanceof Error ? err : new Error(fallback);

export const useVapiPhoneNumbers = (): {
  data: VapiPhoneNumbersResponse;
  isLoading: boolean;
  error: Error | null;
} => {
  const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumber);

  const [data, setData] = useState<VapiPhoneNumbersResponse>([] as VapiPhoneNumbersResponse);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getPhoneNumbers({});
        if (!cancelled) {
          setData(result || ([] as VapiPhoneNumbersResponse));
        }
      } catch (err) {
        if (cancelled) return;
        const error = toError(err, "Failed to fetch phone numbers");
        setError(error);

        // Extract user-friendly error message
        let errorMessage = error.message;
        if (errorMessage.includes("secret data is incomplete")) {
          errorMessage =
            "Vapi API keys are not properly configured. Please update your Vapi integration settings.";
        } else if (errorMessage.includes("NOT_FOUND")) {
          errorMessage =
            "Vapi plugin is not configured for this organization. Please set up your Vapi integration.";
        } else if (errorMessage.includes("UNAUTHORIZED")) {
          errorMessage =
            "You don't have permission to access phone numbers. Please contact your administrator.";
        }

        toast.error("Failed to load phone numbers", {
          description: errorMessage,
          duration: 5000,
        });
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isLoading, error };
};

export const useVapiAssistants = (): {
  data: VapiAssistantsResponse;
  isLoading: boolean;
  error: Error | null;
} => {
  const getAssistants = useAction(api.private.vapi.getAssistant);

  const [data, setData] = useState<VapiAssistantsResponse>([] as VapiAssistantsResponse);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getAssistants({});
        if (!cancelled) {
          setData(result || ([] as VapiAssistantsResponse));
        }
      } catch (err) {
        if (cancelled) return;
        const error = toError(err, "Failed to fetch assistants");
        setError(error);
        toast.error("Failed to load assistants", {
          description: error.message,
        });
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, isLoading, error };
};
