import AuthGuard from "@/modules/auth/ui/components/AuthGuard";
import OrganizationGuard from "@/modules/auth/ui/components/OrganizationGuard";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <OrganizationGuard>{children}</OrganizationGuard>
    </AuthGuard>
  );
};

export default layout;
