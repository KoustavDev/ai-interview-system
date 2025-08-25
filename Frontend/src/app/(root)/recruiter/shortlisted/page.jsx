"use client";

import { useChangeApplicationStatus, useShortList } from "@/api/queryMutations";
import { ShortlistedCandidatesSkeleton } from "@/components/loading-state/shortlisted-candidates-skeleton";
import { ShortlistedCandidates } from "@/components/shortlisted-candidates";

export default function ShortlistedPage() {
  const { data, isPending } = useShortList();
  const { mutateAsync: changeStatus } = useChangeApplicationStatus();
  let candidates = [];
  let status = {};

  if (!isPending) {
    candidates = data.interviewedApplications.map((cand) => ({
      id: cand.id,
      name: cand.candidate.user.name,
      email: cand.candidate.user.email,
      avatar: cand.candidate.user.avatar,
      jobTitle: cand.job.title,
      aiScore: cand.interview.report.score,
      maxScore: 100,
      applicationDate: cand.appliedAt,
      interviewDate: cand.interview.startedAt,
      skills: cand.candidate.skills,
      experience: cand.candidate.experience,
      status: cand.status,
    }));
    status.shortlisted = data.totalApplications;
    status.hired = data.shortlistedCount;
    status.rejected = data.rejectedCount;
  }

  const onAction = async (applicationId, status) => {
    const { success } = await changeStatus({ applicationId, status });
    return success;
  };

  return (
    <div className="min-h-screen bg-background">
      {isPending ? (
        <ShortlistedCandidatesSkeleton />
      ) : (
        <ShortlistedCandidates
          candidates={candidates}
          status={status}
          onAction={onAction}
        />
      )}
    </div>
  );
}

