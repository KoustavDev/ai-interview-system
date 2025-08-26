"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Mail,
  Lock,
  Building2,
  Users,
  Target,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
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
import { signupSchema } from "@/lib/validation";

export function SignupPage({ onSignup, isPending: isLoading }) {
  const [step, setStep] = useState("role");
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "recruiter",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      company: "",
    },
    mode: "onChange",
  });

  const { watch, setValue, trigger } = form;
  const watchedPassword = watch("password");
  const watchedRole = watch("role");

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    setValue("role", role);
    await trigger("role"); // Validate the role field
    setStep("details");
  };

  const onSubmit = async (data) => {
    try {
      if (onSignup) {
        await onSignup(data);
      }

      toast("Account Created! 🎉", {
        description: `Welcome to AI Interview System! Your ${data.role} account has been created successfully.`,
      });

      // In a real app, you would redirect to dashboard or onboarding
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message:
          error?.response?.data?.message || "Sign up failed. Please try again.",
      });
      toast("Signup Failed", {
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: "Weak", color: "text-red-500" };
      case 2:
      case 3:
        return { text: "Medium", color: "text-yellow-500" };
      case 4:
      case 5:
        return { text: "Strong", color: "text-green-500" };
      default:
        return { text: "Weak", color: "text-red-500" };
    }
  };

  const passwordStrength = getPasswordStrength(watchedPassword || "");
  const passwordStrengthInfo = getPasswordStrengthText(passwordStrength);

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

        {step === "role" ? (
          /* Role Selection Step */
          <Card className="shadow-xl bg-background/80 backdrop-blur-sm border-black/[0.1] dark:border-white/[0.2]">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">
                Choose Your Role
              </CardTitle>
              <CardDescription className="text-base">
                Select how you'll be using our AI interview platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full min-h-[80px] sm:h-20 flex items-center justify-between gap-3 p-4 sm:p-6 hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 group bg-transparent text-left"
                  onClick={() => handleRoleSelect("recruiter")}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors flex-shrink-0">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg text-left">
                        I'm a Recruiter
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground text-left">
                        Post jobs and interview candidates
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full min-h-[80px] sm:h-20 flex items-center justify-between gap-3 p-4 sm:p-6 hover:bg-primary/5 hover:border-primary/50 transition-all duration-200 group bg-transparent text-left"
                  onClick={() => handleRoleSelect("candidate")}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0">
                      <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg text-left">
                        I'm a Candidate
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground text-left">
                        Find jobs and attend AI interviews
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </Button>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Details Form Step */
          <Card className="shadow-xl bg-background/80 backdrop-blur-sm border-black/[0.1] dark:border-white/[0.2]">
            <CardHeader className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    selectedRole === "recruiter"
                      ? "bg-blue-100"
                      : "bg-green-100"
                  }`}
                >
                  {selectedRole === "recruiter" ? (
                    <Users className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Target className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <span className="text-sm font-medium text-muted-foreground capitalize">
                  {selectedRole} Account
                </span>
              </div>
              <CardTitle className="text-2xl font-bold">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-base">
                Fill in your details to get started with AI interviews
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                            placeholder="john.doe@example.com"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Company Field (for recruiters only) */}
                  {watchedRole === "recruiter" && (
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Company Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Company Inc."
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              className="h-11 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        {watchedPassword && (
                          <div className="flex items-center gap-2 text-xs">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-1 w-4 rounded-full ${
                                    i < passwordStrength
                                      ? "bg-primary"
                                      : "bg-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={passwordStrengthInfo.color}>
                              {passwordStrengthInfo.text}
                            </span>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className="h-11 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
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
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Create Account
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep("role")}
                      className="w-full"
                      disabled={isLoading}
                    >
                      ← Back to Role Selection
                    </Button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="text-primary hover:underline font-medium"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Benefits Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
              <span>Free to get started</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
              <span>Setup in minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
