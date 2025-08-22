"use client";

import { useGetApplicationByJobId } from "@/api/queryMutations";
import { ApplicantsList } from "@/components/applicants-list";
import Loader from "@/components/ui/Loader";
import { use } from "react";

export default function ApplicantsDemoPage({ params }) {
  const { id } = use(params);
  const { data, isPending } = useGetApplicationByJobId(id);

  let candidates = [];
  let jobTitle = "";

  if (!isPending) {
    candidates = data.applications.map((app) => ({
      id: app.id,
      name: app.candidate.user.name,
      email: app.candidate.user.email,
      avatar: app.candidate.user.avatar,
      resumeUrl: app.resume.fileUrl,
      interviewStatus: app.status,
      appliedDate: app.appliedAt,
      experience: app.candidate.experience,
      skills: app.candidate.skills,
      aiScore: app.interview?.report.score,
    }));
    jobTitle = data.jobTitle.title;
  }
  
  const handleDownloadResume = (candidateId, resumeUrl) => {
    // Simulate file download
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = `resume-${candidateId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      {isPending ? (
        <Loader />
      ) : (
        <ApplicantsList
          jobTitle={jobTitle}
          candidates={candidates}
          onDownloadResume={handleDownloadResume}
        />
      )}
    </div>
  );
}


