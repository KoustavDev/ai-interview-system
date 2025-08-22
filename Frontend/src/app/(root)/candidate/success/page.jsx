"use client"

import { InterviewSuccessPage } from "@/components/interview-success-page"
import { useRouter } from "next/navigation";

export default function InterviewSuccessPageDemo() {
  const router = useRouter();
  const handleGoToDashboard = () => {
    // In a real app, this would navigate to the candidate dashboard
    console.log("Navigating to candidate dashboard")
    router.push("/candidate/dashboard");
  }

  const handleBrowseJobs = () => {
    // In a real app, this would navigate to job listings
    console.log("Navigating to job listings")
    router.push("/candidate/applied-jobs");
  }

  return (
    <div className="min-h-screen bg-background">
      
      <InterviewSuccessPage
        jobTitle="Senior Full Stack Developer"
        candidateName="John Smith"
        onGoToDashboard={handleGoToDashboard}
        onBrowseJobs={handleBrowseJobs}
      />
    </div>
  )
}
