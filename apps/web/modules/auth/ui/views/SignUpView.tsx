import { SignUp } from "@clerk/nextjs";

const SignUpView = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        afterSignUpUrl="/org-selection"
        afterSignInUrl="/conversations"
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
