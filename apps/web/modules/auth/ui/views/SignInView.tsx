import { SignIn } from "@clerk/nextjs";

const SignInView = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn afterSignInUrl="/conversations" />
    </div>
  );
};

export default SignInView;
