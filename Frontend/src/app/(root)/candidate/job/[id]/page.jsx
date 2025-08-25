"use client";

import { useCreateApplication, useGetJobById } from "@/api/queryMutations";
import { JobNotFound } from "@/components/error-state/job-not-found";
import { JobDetailPage } from "@/components/job-detail-page";
import { JobDetailSkeleton } from "@/components/loading-state/job-detail-skeleton";
import { useAuthProvider } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function JobDetailPageDemo({ params }) {
  const { id } = use(params);
  const { data, isPending, isError } = useGetJobById(id);
  const { mutateAsync: actionApply, isPending: actionLoading } =
    useCreateApplication();
  const { user, loading } = useAuthProvider();
  const router = useRouter();

  let job = null;

  if (!isPending && !loading && !isError ) {
    job = {
      id: data.id,
      title: data.title,
      company: data.recruiter.companyName,
      location: data.location,
      salary: data.salary,
      jobType: data.type,
      description: data.description,
      skillsRequired: data.skillsRequired,
      experienceLevel: data.experience,
      postedDate: data.createdAt,
      applicationDeadline: data.deadline,
      benefits: data.benefits,
      responsibilities: data.responsibility,
      requirements: data.requirement,
      isApplied: data.isApplied,
      status: data?.status,
      isRecruiter: user.role === "recruiter" ? true : false,
    };
  }
  const handleStartInterview = async (jobId, jobTitle) => {
    if (job.isApplied === false && job.status === undefined) {
      const { success } = await actionApply(jobId);
      return {
        success,
        title: "Application Submitted! 🎉",
        description: `Your application for ${jobTitle} has been submitted successfully.`,
      };
    } else if (job.isApplied === true && job.status === "pending") {
      router.push(`/candidate/interview/${data.applications[0]?.id}`);
      return {
        success: true,
        title: "Interview Started! 🚀",
        description: "You'll be redirected to the AI interview in a moment.",
      };
    }
  };

  const handleBack = () => router.back();

  return (
    <div className="min-h-screen bg-background">
      {isPending || loading ? (
        <JobDetailSkeleton />
      ) : isError ? (
        <JobNotFound />
      ) : (
        <JobDetailPage
          job={job}
          onStartInterview={handleStartInterview}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
