"use client";

import { useChangeApplicationStatus, useShortList } from "@/api/queryMutations";
import { ShortlistedCandidates } from "@/components/shortlisted-candidates";
import Loader from "@/components/ui/Loader";

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
        <Loader />
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

let a = {
  totalApplications: 3,
  shortlistedCount: 1,
  rejectedCount: 0,
  interviewedApplications: [
    {
      id: "8ab56e39-d323-466f-ac9a-1d2ac32b0195",
      jobId: "9335c989-9c62-4af9-a6f1-165b5cf9a0db",
      candidateId: "22535423-1daf-4175-a73a-6b30bc6147f9",
      resumeId: "163d9a0a-f632-45a7-94a5-ae2016a2fe8e",
      status: "interviewed",
      appliedAt: "2025-08-10T05:33:04.890Z",
      candidate: {
        id: "22535423-1daf-4175-a73a-6b30bc6147f9",
        userId: "bdf8bc48-1f9d-4f0b-ab90-30d395d50af3",
        education: "B.Tech in Computer Science from IIT Delhi (2020)",
        experience: "2 years as a Frontend Developer at TCS",
        about:
          "A passionate developer who loves solving real-world problems using modern web technologies.",
        skills: ["JavaScript", "React", "Node.js", "MongoDB", "Tailwind CSS"],
        user: {
          name: "Koustav Maity",
          email: "koustav.js@mail.com",
          avatar:
            "https://ai-interview-system-bucket.s3.ap-south-1.amazonaws.com/bdf8bc48-1f9d-4f0b-ab90-30d395d50af3/avatar/IMG20240320115524",
        },
      },
      job: {
        title: "Full Stack Developer",
      },
      interview: {
        id: "9cd39e0f-9fbf-4afb-833f-a3317636949e",
        applicationId: "8ab56e39-d323-466f-ac9a-1d2ac32b0195",
        startedAt: "2025-08-10T05:34:17.161Z",
        completedAt: "2025-08-10T05:52:52.672Z",
        report: {
          score: 70,
        },
      },
    },
    {
      id: "b087e2c0-6290-4101-a360-c8d9d536d82e",
      jobId: "244834c1-5b5e-4c38-9a23-3ca1907df2d0",
      candidateId: "22535423-1daf-4175-a73a-6b30bc6147f9",
      resumeId: "163d9a0a-f632-45a7-94a5-ae2016a2fe8e",
      status: "interviewed",
      appliedAt: "2025-08-09T16:23:27.004Z",
      candidate: {
        id: "22535423-1daf-4175-a73a-6b30bc6147f9",
        userId: "bdf8bc48-1f9d-4f0b-ab90-30d395d50af3",
        education: "B.Tech in Computer Science from IIT Delhi (2020)",
        experience: "2 years as a Frontend Developer at TCS",
        about:
          "A passionate developer who loves solving real-world problems using modern web technologies.",
        skills: ["JavaScript", "React", "Node.js", "MongoDB", "Tailwind CSS"],
        user: {
          name: "Koustav Maity",
          email: "koustav.js@mail.com",
          avatar:
            "https://ai-interview-system-bucket.s3.ap-south-1.amazonaws.com/bdf8bc48-1f9d-4f0b-ab90-30d395d50af3/avatar/IMG20240320115524",
        },
      },
      job: {
        title: "Frontend Developer",
      },
      interview: {
        id: "8f0d12fa-b36c-4315-9b65-603fdf2140b3",
        applicationId: "b087e2c0-6290-4101-a360-c8d9d536d82e",
        startedAt: "2025-08-09T16:24:07.623Z",
        completedAt: "2025-08-09T18:27:33.491Z",
        report: {
          score: 78,
        },
      },
    },
  ],
};
