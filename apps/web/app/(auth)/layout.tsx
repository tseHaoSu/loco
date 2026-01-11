import AuthLayout from "@/modules/auth/layouts/AuthLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
