import { SignUp } from "@clerk/nextjs";

const SignUpView = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
        afterSignUpUrl="/org-selection"
        afterSignInUrl="/conversations"
      />
    </div>
  );
};

export default SignUpView;
