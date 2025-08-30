"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { forgotPasswordSchema } from "@/lib/validation";

export function ForgotPasswordPage({ onSubmit, isLoading }) {
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data) => {
    try {
      const success = await onSubmit(data);

      if (success) {
        setSentEmail(data.email);
        setEmailSent(true);

        toast("Email Sent! 📧", {
          description:
            "Please check your email for password reset instructions.",
        });
      } else {
        toast("Failed to Send Email", {
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  const handleResendEmail = async () => {
    const email = form.getValues("email") || sentEmail;
    if (email) {
      await handleSubmit({ email });
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
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

          {/* Success Card */}
          <Card className="bg-background/80 backdrop-blur-sm border-black/[0.1] dark:border-white/[0.2]">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-700">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-base">
                We've sent password reset instructions to:
                <br />
                <span className="font-semibold text-foreground">
                  {sentEmail}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  What's next?
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Check your email inbox (and spam folder)</li>
                  <li>• Click the "Reset Password" link in the email</li>
                  <li>• Follow the instructions to create a new password</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Email
                    </>
                  )}
                </Button>

                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email?{" "}
              <button
                onClick={handleResendEmail}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Resend it
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
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

        {/* Forgot Password Form */}
        <Card className="bg-background/80 backdrop-blur-sm border-black/[0.1] dark:border-white/[0.2]">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-base">
              No worries! Enter your email address and we'll send you a link to
              reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="pt-4 space-y-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 text-base font-semibold shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Email...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Reset Email
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center pt-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 shadow-sm border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <h3 className="text-sm font-medium text-foreground">
                Need Help?
              </h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  • Make sure you enter the email address associated with your
                  account
                </p>
                <p>• Check your spam folder if you don't see the email</p>
                <p>• The reset link will expire in 1 hour for security</p>
              </div>
              <Link
                href="/contact"
                className="text-xs text-primary hover:underline"
              >
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
