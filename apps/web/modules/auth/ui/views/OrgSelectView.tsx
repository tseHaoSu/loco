import React from "react";
import { OrganizationList } from "@clerk/nextjs";

const OrgSelectView = () => {
  return (
    <div>
      <OrganizationList
        afterCreateOrganizationUrl="/"
        afterSelectOrganizationUrl="/"
        hidePersonal
        skipInvitationScreen
      />
    </div>
  );
};

export default OrgSelectView;
