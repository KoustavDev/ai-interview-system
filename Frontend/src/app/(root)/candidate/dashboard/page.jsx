"use client";

import React, { useEffect } from "react";
import Loader from "@/components/ui/Loader";
import { useCreateApplication, useJobs } from "@/api/queryMutations";
import { useInView } from "react-intersection-observer";
import { CandidateDashboard } from "@/components/candidate-dashboard";

export default function CandidateDashboardPage() {
  const { ref, inView } = useInView();
  const { mutateAsync: createApplication} =
    useCreateApplication();
  const { data, fetchNextPage, hasNextPage, isPending } = useJobs();

  const jobs = data
    ? data.pages.flatMap((page) =>
        page.jobsWithIsApplied?.map((job) => ({
          id: job.id,
          title: job.title,
          description: job.description,
          company: job.recruiter.companyName,
          location: job?.location,
          salary: job?.salary,
          jobType: job?.type,
          skillsRequired: job?.skillsRequired,
          postedDate: job.createdAt,
          applicationDeadline: job?.deadline,
          experienceLevel: job?.experience,
          isApplied: job.isApplied,
        }))
      )
    : [];

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const handleApply = async (jobId) => {
    const { success } = await createApplication(jobId);
    return success;
  };

  return (
    <div className="min-h-screen bg-background">
      {isPending ? (
        <Loader />
      ) : (
        <CandidateDashboard
          onApply={handleApply}
          jobs={jobs}
          ref={ref}
          hasNextPage={hasNextPage}
        />
      )}
    </div>
  );
}
