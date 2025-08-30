"use client";

import { useResetPassword, useValidateToken } from "@/api/queryMutations";
import { ResetPasswordPage } from "@/components/reset-password-page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Page({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const {
    data,
    isPending: isValidating,
    isError: tokenExpired,
  } = useValidateToken(id);
  const { mutateAsync: resetPassword, isPending: isLoading } =
    useResetPassword();

  const handleResetPassword = async (password) => {
    const { success } = await resetPassword({ password, id: data.userId });
    return success;
  };

  // Token validation loading state
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  AI
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                AI Interview System
              </span>
            </Link>
          </div>

          <Card className="bg-background/80 backdrop-blur-sm border-black/[0.1] dark:border-white/[0.2]">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Validating Reset Link
              </CardTitle>
              <CardDescription className="text-base">
                Please wait while we verify your password reset token...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  // Token expired state
  if (tokenExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  AI
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                AI Interview System
              </span>
            </Link>
          </div>

          <Card className="bg-background/80 backdrop-blur-sm border-black/[0.1] dark:border-white/[0.2]">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-700">
                Token Expired
              </CardTitle>
              <CardDescription className="text-base">
                This password reset link has expired or is invalid.
                <br />
                Please request a new password reset email.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">
                  Why did this happen?
                </h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Reset links expire after 1 hour for security</li>
                  <li>• The link may have been used already</li>
                  <li>• The link might be malformed or incomplete</li>
                </ul>
              </div>

              <Button
                onClick={() => router.push("/forgot-password")}
                className="w-full h-12 text-base font-semibold"
              >
                Request New Reset Link
              </Button>

              <Link href="/login" className="block">
                <Button variant="ghost" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <ResetPasswordPage
      isLoading={isLoading}
      onResetPassword={handleResetPassword}
    />
  );
}
