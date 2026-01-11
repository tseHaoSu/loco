import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignUpView from "@/modules/auth/views/SignUpView";

const SignUpPage = async () => {
  const { userId } = await auth();
  if (userId) {
    redirect("/conversations");
  }

  return <SignUpView />;
};

export default SignUpPage;
