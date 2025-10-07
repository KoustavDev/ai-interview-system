"use client"

import { InterviewSuccessPage } from "@/components/interview-success-page"
import { useRouter } from "next/navigation";

export default function InterviewSuccessPageDemo() {
  const router = useRouter();
  const handleGoToDashboard = () => {
    router.push("/candidate/dashboard");
  }

  const handleBrowseJobs = () => {
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
