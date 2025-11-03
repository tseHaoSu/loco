"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import AuthLayout from "../layouts/AuthLayout";
import SignInView from "../views/SignInView";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <p>Loading...</p>
        </AuthLayout>
      </AuthLoading>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <SignInView />
      </Unauthenticated>
    </>
  );
};

export default AuthGuard;
