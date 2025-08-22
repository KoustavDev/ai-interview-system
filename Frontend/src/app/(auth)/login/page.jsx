"use client";

import { useLogin } from "@/api/queryMutations";
import { LoginPage } from "@/components/login-page";
import { useAuthProvider } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPageDemo() {
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLogin();
  const { setIsAuth, setUser } = useAuthProvider();
  
  const handleLogin = async (data) => {
    const user = await login(data);
    setIsAuth(true);
    setUser(user);

    if (user.role === "recruiter") {
      router.push("/recruiter/dashboard");
    } else {
      router.push("/candidate/dashboard");
    } 
  };

  return <LoginPage onLogin={handleLogin} isPending={isPending} />;
}
