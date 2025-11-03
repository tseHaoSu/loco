"use client";

import React from "react";
import { useOrganization } from "@clerk/nextjs";

const OrganizationGuard = ({ children }: { children: React.ReactNode }) => {
  const { organization } = useOrganization();

  if (!organization) {
    return (
      <div>
        <p>Create Organization</p>
      </div>
    );
  }
  return <>{children}</>;
};

export default OrganizationGuard;
