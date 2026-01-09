import { useContext } from "react";
import { ConvexDataContext } from "../ConvexDataContext";

export const useVapiData = () => {
  const context = useContext(ConvexDataContext);
  if (!context) {
    throw new Error("useVapiData must be used within ConvexDataProvider");
  }

  return {
    assistants: context.state.vapiData.assistants,
    phoneNumbers: context.state.vapiData.phoneNumbers,
    isLoading: context.state.vapiData.isLoading,
    refresh: context.refreshVapiData,
  };
};
