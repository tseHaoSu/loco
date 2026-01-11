import { SignUp } from "@clerk/nextjs";

const SignUpView = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        fallbackRedirectUrl="/org-selection"
        signInUrl="/sign-in"
        appearance={{
          elements: {
            rootBox: "mx-auto",
          },
        }}
      />
    </div>
  );
};

export default SignUpView;
