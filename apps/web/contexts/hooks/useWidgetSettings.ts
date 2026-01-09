import { useContext } from "react";
import { ConvexDataContext } from "../ConvexDataContext";

export const useWidgetSettings = () => {
  const context = useContext(ConvexDataContext);
  if (!context) {
    throw new Error(
      "useWidgetSettings must be used within ConvexDataProvider"
    );
  }

  return context.state.widgetSettings;
};
