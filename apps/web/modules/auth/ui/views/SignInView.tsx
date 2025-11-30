import { SignIn } from "@clerk/nextjs";

const SignInView = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        afterSignInUrl="/conversations"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: "mx-auto",
          },
        }}
      />
    </div>
  );
};

export default SignInView;
