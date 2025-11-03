import { SignIn } from "@clerk/nextjs";

const SignInView = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
};

export default SignInView;
