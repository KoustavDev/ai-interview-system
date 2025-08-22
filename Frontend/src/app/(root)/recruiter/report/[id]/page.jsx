"use client";

import { use } from "react";
import Loader from "@/components/ui/Loader";
import { useRouter } from "next/navigation";
import { ApplicantReport } from "@/components/applicant-report";
import { useChangeApplicationStatus, useGetReport } from "@/api/queryMutations";

export default function ApplicantReportPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { mutateAsync: changeStatus } = useChangeApplicationStatus();
  const { data, isPending } = useGetReport(id);

  let reportData = {};

  if (!isPending) {
    if (!data.interview) router.back();
    reportData = {
      candidateId: data.id,
      candidateName: data.candidate.user.name,
      candidateEmail: data.candidate.user.email,
      candidateAvatar: data.candidate.user.avatar,
      jobTitle: data.job.title,
      status: data.status,
      aiScore: data.interview?.report.score,
      maxScore: 100,
      appliedDate: data.appliedAt,
      interviewDate: data.interview?.startedAt,
      summary: data.interview?.report.summary,
      skills: data.candidate.skills,
      experience: data.candidate.experience,
      interviewScript: data.interview?.chatMessages.map((message) => ({
        sender:
        message.sender === "ai" ? "AI Interviewer" : data.candidate.user.name,
        message: message.message,
        timestamp: message.timestamp,
      })),
      reportId: data.interview?.report.id,
    };
  }

  const handleBack = () => router.back();

  const onAction = async (applicationId, status) => {
    const { success } = await changeStatus({ applicationId, status });
    return success;
  };

  return (
    <div className="min-h-screen bg-background">
      {isPending ? (
        <Loader />
      ) : (
        <ApplicantReport
          onBack={handleBack}
          reportData={reportData}
          onAction={onAction}
        />
      )}
    </div>
  );
}

