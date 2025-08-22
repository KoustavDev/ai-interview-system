"use client";

import { useRecruiterDashboard } from "@/api/queryMutations";
import { RecruiterDashboard } from "@/components/recruiter-dashboard";
import Loader from "@/components/ui/Loader";

export default function DashboardPage() {
  const {data, isPending} = useRecruiterDashboard();

  let jobsData = [];
  if (!isPending) {
    jobsData = data.jobs.map((job) => ({
      id: job.id,
      title: job.title,
      skills: job.skillsRequired,
      location: job.location,
      salary: job.salary,
      type: job.type,
      description: job.description,
      postedDate: job.createdAt,
      applications: job._count.applications
    }));
  }

  return (
    <div className="min-h-screen bg-background">
      {isPending ? (
        <Loader />
      ) : (
        <RecruiterDashboard
          jobData={jobsData}
        />
      )}
    </div>
  );
}
