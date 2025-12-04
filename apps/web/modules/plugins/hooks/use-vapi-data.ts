import { useAction } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { FunctionReturnType } from "convex/server";

type VapiPhoneNumbersResponse = FunctionReturnType<typeof api.private.vapi.getPhoneNumber>;
type VapiAssistantsResponse = FunctionReturnType<typeof api.private.vapi.getAssistant>;

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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getPhoneNumbers({});
        setData(result || ([] as VapiPhoneNumbersResponse));
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to fetch phone numbers");
        setError(error);
        
        // Extract user-friendly error message
        let errorMessage = error.message;
        if (errorMessage.includes("secret data is incomplete")) {
          errorMessage = "Vapi API keys are not properly configured. Please update your Vapi integration settings.";
        } else if (errorMessage.includes("NOT_FOUND")) {
          errorMessage = "Vapi plugin is not configured for this organization. Please set up your Vapi integration.";
        } else if (errorMessage.includes("UNAUTHORIZED")) {
          errorMessage = "You don't have permission to access phone numbers. Please contact your administrator.";
        }
        
        toast.error("Failed to load phone numbers", {
          description: errorMessage,
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getPhoneNumbers]);

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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getAssistants({});
        setData(result || ([] as VapiAssistantsResponse));
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to fetch assistants");
        setError(error);
        toast.error("Failed to load assistants", {
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getAssistants]);

  return { data, isLoading, error };
};
