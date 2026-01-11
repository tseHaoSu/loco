"use client";

import React from "react";
import { useOrganization } from "@clerk/nextjs";
import AuthLayout from "../layouts/AuthLayout";
import OrgSelectView from "../views/OrgSelectView";

const OrganizationGuard = ({ children }: { children: React.ReactNode }) => {
  const { organization } = useOrganization();

  if (!organization) {
    return (
      <AuthLayout>
        <OrgSelectView />
      </AuthLayout>
    );
  }
  return <>{children}</>;
};

export default OrganizationGuard;
