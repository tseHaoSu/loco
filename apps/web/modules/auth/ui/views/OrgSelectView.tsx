import { OrganizationList } from "@clerk/nextjs";

const OrgSelectView = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <OrganizationList
        afterCreateOrganizationUrl="/"
        afterSelectOrganizationUrl="/"
        hidePersonal
        skipInvitationScreen
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
          },
        }}
      />
    </div>
  );
};

export default OrgSelectView;
