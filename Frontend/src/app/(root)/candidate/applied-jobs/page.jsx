"use client";

import { useAppliedJobs } from "@/api/queryMutations";
import { AppliedJobsPage } from "@/components/applied-jobs-page";
import Loader from "@/components/ui/Loader";
import { useRouter } from "next/navigation";

export default function AppliedJobsPageDemo() {
  const { data, isPending } = useAppliedJobs();
  const router = useRouter();

  let jobs = [];
  if (!isPending) {
    jobs = data.applications?.map((app) => ({
      id: app.id,
      jobTitle: app.job.title,
      jobId: app.job.id,
      companyName: app.job.company,
      applicationDate: app.appliedAt,
      status: app.status,
      location: app.job.location,
      jobType: app.job.type,
      salary: app.job.salary,
      hrContact: {
        name: app?.recruiter?.name,
        email: app?.recruiter?.email,
        phone: app?.recruiter?.contactNumber,
      },
    }));

    // status.totalApplications = data.totalApplications;
    // status.pendingCount = data.statusCounts.pending;
    // status.interviewedCount = data.statusCounts.interviewed;
    // status.shortlistedCount = data.statusCounts.shortlisted;
    // status.rejectedCount = data.statusCounts.rejected;
  }
  const handleContactHR = (jobId, hrContact) => {
    // In a real app, this might open a contact modal or email client
    console.log(`Contacting HR for job ${jobId}:`, hrContact);
  };

  const handleViewDetails = (jobId) => {
    // In a real app, this would navigate to job details page
    console.log(`Viewing details for job ${jobId}`);
    router.push(`/candidate/job/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {isPending ? (
        <Loader />
      ) : (
        <AppliedJobsPage
          jobs={jobs}
          status = {status}
          onContactHR={handleContactHR}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
}

