"use client";

import { useCreateAccount } from "@/api/queryMutations";
import { SignupPage } from "@/components/signup-page";
import { useAuthProvider } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

export default function SignupPageDemo() {
  const router = useRouter();
  const { mutateAsync: signup, isPending } = useCreateAccount();
  const { setIsAuth, setUser, checkAuth } = useAuthProvider();

  const handleSignup = async (data) => {
    // In a real app, this would make an API call to create the account
    console.log("Signup data:", data);

    const user = await signup({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      role: data.role,
      companyName: data.company, // recruiter only
    });

    const isLogin = await checkAuth();
    if (isLogin) {
      setIsAuth(true);
      setUser(user);

      if (user.role === "recruiter") router.push("/recruiter/dashboard");
      else router.push("/candidate/dashboard");

      // In a real app, you would redirect to dashboard or onboarding
      console.log("Account created successfully!");
    }
  };

  return <SignupPage onSignup={handleSignup} isPending={isPending} />;
}
