"use client";

import { useForgotPassword } from "@/api/queryMutations";
import { ForgotPasswordPage } from "@/components/forgot-password-page";

export default function Page() {
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();
  const handleForgotPassword = async (data) => {
    const { data: token, success } = await forgotPassword(data.email);
    console.log(token);
    return success;
  };

  return (
    <ForgotPasswordPage onSubmit={handleForgotPassword} isLoading={isPending} />
  );
}
