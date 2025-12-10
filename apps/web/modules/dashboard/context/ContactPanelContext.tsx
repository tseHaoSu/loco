"use client";

import { createContext, useContext, useState, useCallback } from "react";

import type { ReactNode } from "react";

interface ContactPanelContextValue {
  isContactPanelOpen: boolean;
  toggleContactPanel: () => void;
  setContactPanelOpen: (open: boolean) => void;
}

const ContactPanelContext = createContext<ContactPanelContextValue | null>(
  null
);

interface ContactPanelProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export const ContactPanelProvider = ({
  children,
  defaultOpen = true,
}: ContactPanelProviderProps) => {
  const [isContactPanelOpen, setIsContactPanelOpen] = useState(defaultOpen);

  const toggleContactPanel = useCallback(() => {
    setIsContactPanelOpen((prev) => !prev);
  }, []);

  const setContactPanelOpen = useCallback((open: boolean) => {
    setIsContactPanelOpen(open);
  }, []);

  return (
    <ContactPanelContext.Provider
      value={{
        isContactPanelOpen,
        toggleContactPanel,
        setContactPanelOpen,
      }}
    >
      {children}
    </ContactPanelContext.Provider>
  );
};

export const useContactPanel = (): ContactPanelContextValue => {
  const context = useContext(ContactPanelContext);
  if (!context) {
    throw new Error(
      "useContactPanel must be used within a ContactPanelProvider"
    );
  }
  return context;
};
