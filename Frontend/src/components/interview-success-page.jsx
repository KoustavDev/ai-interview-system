"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Sparkles, ArrowRight, Briefcase, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


export function InterviewSuccessPage({
  jobTitle = "Senior Full Stack Developer",
  candidateName = "John Smith",
  onGoToDashboard,
  onBrowseJobs,
}) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Trigger confetti animation on mount
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleGoToDashboard = () => {
    onGoToDashboard?.()
    // In a real app, this would navigate to dashboard
    console.log("Navigating to dashboard")
  }

  const handleBrowseJobs = () => {
    onBrowseJobs?.()
    // In a real app, this would navigate to job listings
    console.log("Navigating to job listings")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {showConfetti && (
          <>
            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <Sparkles className="h-4 w-4 text-green-400 opacity-60" />
              </div>
            ))}
          </>
        )}
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Main Success Card */}
        <Card className="shadow-2xl border-0 bg-background backdrop-blur-sm">
          <CardContent className="p-12 text-center space-y-8">
            {/* Success Icon with Animation */}
            <div className="relative">
              <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <CheckCircle className="h-16 w-16 text-green-600 animate-bounce" />
              </div>
              {/* Success ring animation */}
              <div className="absolute inset-0 mx-auto w-24 h-24 border-4 border-green-200 rounded-full animate-ping opacity-20"></div>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground animate-fade-in">
                Interview Submitted Successfully!
              </h1>
              <div className="flex items-center justify-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>
            </div>

            {/* Job Information */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-muted-foreground">Interview for:</p>
              <p className="font-semibold text-lg text-foreground">
                {jobTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                Candidate: {candidateName}
              </p>
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Thank you for attending the interview. You will be notified once
                your results are ready.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>What happens next?</strong>
                  <br />
                  Our AI will analyze your responses and the hiring team will
                  review your interview. You can expect to hear back within 2-3
                  business days.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="cursor-pointer flex-1 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Home className="mr-2 h-5 w-5" />
                Go to Dashboard
              </Button>
              <Button
                onClick={handleBrowseJobs}
                variant="outline"
                size="lg"
                className="cursor-pointer flex-1 h-12 text-base font-semibold bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <Briefcase className="mr-2 h-5 w-5" />
                Browse Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card className="bg-background backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                AI Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                Your responses are being analyzed by our advanced AI system to
                provide comprehensive insights.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Next Steps</h3>
              <p className="text-sm text-muted-foreground">
                Check your email and dashboard regularly for updates on your
                application status.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Questions about your interview?{" "}
            <button className="text-primary hover:underline font-medium">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
