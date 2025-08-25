"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ApplicantReport } from "@/components/applicant-report";
import { useChangeApplicationStatus, useGetReport } from "@/api/queryMutations";
import { ApplicantReportSkeleton } from "@/components/loading-state/applicant-report-skeleton";
import { ApplicantReportNotFound } from "@/components/error-state/applicant-report-not-found";

export default function ApplicantReportPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { mutateAsync: changeStatus } = useChangeApplicationStatus();
  const { data, isPending, isError } = useGetReport(id);

  let reportData = {};

  if (!isPending && !isError) {
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
        <ApplicantReportSkeleton />
      ) : (
        isError ? (
          <ApplicantReportNotFound />
        ) : (
          <ApplicantReport
            reportData={reportData}
            onBack={handleBack}
            onAction={onAction}
          />
        )
      )}
    </div>
  );
}

