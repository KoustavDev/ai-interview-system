"use client";

import { useCreateJob } from "@/api/queryMutations";
import { JobPostingForm } from "@/components/job-posting-form";
import { useAuthProvider } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const { mutateAsync: postJob, isPending } = useCreateJob();
  const { user } = useAuthProvider();
  const router = useRouter();

  const handleSubmitJob = async (data) => {
    // console.log("Submitting job data:", data);
    const {
      benefits,
      deadline,
      description,
      experience,
      jobType,
      location,
      requirements,
      responsibilities,
      salary,
      skills,
      title,
    } = data;
    const { success } = await postJob({
      recruiterId: user.recruiterProfile.id,
      title,
      description,
      type: jobType,
      salary,
      skillsRequired: skills,
      experience,
      location,
      deadline,
      responsibility: responsibilities,
      benefits,
      requirement: requirements,
    });

    console.log(success);
    return success;
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background">
      <JobPostingForm onSubmit={handleSubmitJob} onCancel={handleCancel} isLoading = {isPending}/>
    </div>
  );
}

let a = {
  title: "aksjdhfakjsdf",
  description:
    "OIhdfciASDGFykhdfgbqsjodfbASIHKDBkhasdfgbasouiyvbhnSOJDKVB QSUFHVBskjdcvbfqsjkohfgqisuvncOWKSJFDGBVOWIYUDE",
  benefits: ["kjcnvaksjcvbkjhbvss"],
  deadline: "2025-08-30T00:00:00+05:30",
  jobType: "part-time",
  experience: "2-4",
  location: "kjabdfjHABDF",
  requirements: ["ohandskjcABHD"],
  responsibilities: ["osnsdckjsndfvj"],
  salary: "KJqebiHSDB",
  skills: ["kasjdbhk"],
};
