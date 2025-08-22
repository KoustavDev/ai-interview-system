"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Users,
  Briefcase,
  MessageSquare,
  CheckCircle,
  Clock,
  Star,
  Zap,
  Target,
  FileText,
  Eye,
  Mail,
  Play,
  Sparkles,
  TrendingUp,
  Shield,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "./footer";

export function LandingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      title: "Recruiters Create Job Posts",
      description: "Post detailed job requirements with AI-powered matching",
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      title: "Candidates Apply",
      description: "Browse and apply to relevant positions instantly",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "AI Conducts Interview",
      description: "Smart chat-based interviews with real-time analysis",
      icon: Bot,
      color: "bg-purple-500",
    },
    {
      title: "Recruiters Get Reports",
      description: "Comprehensive AI-generated candidate insights",
      icon: FileText,
      color: "bg-orange-500",
    },
    {
      title: "Shortlisting & HR Contact",
      description: "Quick decisions and direct candidate communication",
      icon: CheckCircle,
      color: "bg-emerald-500",
    },
  ];

  const recruiterFeatures = [
    {
      icon: Briefcase,
      title: "Post Jobs & Manage Listings",
      description:
        "Create detailed job posts with smart categorization and easy management tools",
    },
    {
      icon: Eye,
      title: "View Candidate Profiles",
      description:
        "Access comprehensive profiles with AI-generated interview reports and insights",
    },
    {
      icon: CheckCircle,
      title: "Quick Shortlisting",
      description:
        "Make faster hiring decisions with AI-powered candidate scoring and recommendations",
    },
    {
      icon: MessageSquare,
      title: "Access Transcripts & Insights",
      description:
        "Review complete interview transcripts with AI analysis and behavioral insights",
    },
  ];

  const candidateFeatures = [
    {
      icon: Target,
      title: "Explore & Apply to Jobs",
      description:
        "Discover relevant opportunities with smart job matching and easy application process",
    },
    {
      icon: Bot,
      title: "AI Interview Experience",
      description:
        "Participate in engaging chat-based interviews with real-time AI interaction",
    },
    {
      icon: TrendingUp,
      title: "Track Progress & Feedback",
      description:
        "Monitor application status and receive instant feedback on interview performance",
    },
    {
      icon: Mail,
      title: "Direct HR Communication",
      description:
        "Connect directly with hiring managers when shortlisted for positions",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Instant AI Interviews",
      description:
        "No scheduling conflicts - candidates interview when convenient",
      stat: "24/7 Available",
    },
    {
      icon: Clock,
      title: "Faster Hiring Decisions",
      description:
        "Reduce time-to-hire with immediate AI analysis and insights",
      stat: "70% Faster",
    },
    {
      icon: Star,
      title: "Better Candidate Experience",
      description:
        "Engaging, stress-free interviews that showcase true potential",
      stat: "95% Satisfaction",
    },
    {
      icon: Shield,
      title: "Customizable & Secure",
      description:
        "Tailored questions for any role with enterprise-grade security",
      stat: "100% Secure",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5   lg:px-14">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:py-20 py-7 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-8 ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Recruitment
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Transform Your{" "}
                  <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text ">
                    Hiring
                  </span>{" "}
                  with AI
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  AI-driven interviews, smart screening, and effortless
                  recruitment for modern teams and candidates.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-14 px-8 text-lg font-semibold shadow-lg"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    For Recruiters
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-background hover:bg-muted"
                  >
                    <Target className="mr-2 h-5 w-5" />
                    For Candidates
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>24/7 AI interviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Instant results</span>
                </div>
              </div>
            </div>
            <div
              className={`relative ${
                isVisible ? "animate-fade-in-right" : "opacity-0"
              }`}
            >
              <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 backdrop-blur-sm border">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-background/80 rounded-lg border shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">AI Interviewer</p>
                      <p className="text-xs text-muted-foreground">
                        Tell me about your experience with React...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Candidate</p>
                      <p className="text-xs text-muted-foreground">
                        I have 4+ years of experience building...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Award className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      AI Score: 92/100
                    </span>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Built for Modern Recruitment
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for both recruiters and candidates to
              streamline the hiring process
            </p>
          </div>

          <Tabs defaultValue="recruiters" className="w-full max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-12 h-14">
              <TabsTrigger
                value="recruiters"
                className="text-sm sm:text-lg font-semibold h-12"
              >
                <Users className="sm:mr-2 h-5 w-5" />
                For Recruiters
              </TabsTrigger>
              <TabsTrigger
                value="candidates"
                className="text-sm sm:text-lg font-semibold h-12"
              >
                <Target className="sm:mr-2 h-5 w-5" />
                For Candidates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recruiters" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recruiterFeatures.map((feature, index) => (
                  <Card
                    key={index}
                    className="border-black/[0.1] dark:border-white/[0.2] group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background/80 backdrop-blur-sm"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="candidates" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {candidateFeatures.map((feature, index) => (
                  <Card
                    key={index}
                    className="border-black/[0.1] dark:border-white/[0.2] group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background/80 backdrop-blur-sm"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple 5-step process that transforms traditional hiring
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Horizontal Progress Line - Large screens */}
              <div className="absolute top-16 left-0 right-0 h-1 bg-muted rounded-full hidden lg:block">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>

              {/* Vertical Progress Line - Medium and Small screens */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-muted rounded-full lg:hidden">
                <div
                  className="w-full bg-primary rounded-full transition-all duration-1000 ease-in-out"
                  style={{
                    height: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex flex-col lg:items-center lg:text-center items-start text-left space-y-4">
                      {/* Step circle with different positioning for mobile vs desktop */}
                      <div className="flex items-start gap-6 lg:flex-col lg:gap-4 lg:items-center">
                        <div
                          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                            index <= currentStep
                              ? `${step.color} text-white shadow-lg scale-110`
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <step.icon className="h-8 w-8" />
                          {index <= currentStep && (
                            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                          )}
                        </div>
                        <div className="space-y-2 lg:text-center">
                          <h3 className="text-lg font-semibold text-foreground">
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of recruitment with cutting-edge AI
              technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="border-black/[0.1] dark:border-white/[0.2] group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-background/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {benefit.description}
                  </p>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {benefit.stat}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5 text-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Ready to Redefine <span className="text-primary">Hiring?</span>
            </h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Join thousands of companies and candidates who have transformed
              their recruitment experience with AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-semibold shadow-lg bg-primary"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Get Started as Recruiter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-background hover:bg-muted"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Interviewing
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free to get started</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Setup in minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
