import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignInView from "@/modules/auth/views/SignInView";

const SignInPage = async () => {
  const { userId } = await auth();

  // If user is already signed in, redirect to conversations
  if (userId) {
    redirect("/conversations");
  }

  return <SignInView />;
};

export default SignInPage;
