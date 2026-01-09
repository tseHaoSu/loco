import { useContext } from "react";
import { ConvexDataContext } from "../ConvexDataContext";

export const useVapiPlugin = () => {
  const context = useContext(ConvexDataContext);
  if (!context) {
    throw new Error("useVapiPlugin must be used within ConvexDataProvider");
  }

  return context.state.vapiPlugin;
};
