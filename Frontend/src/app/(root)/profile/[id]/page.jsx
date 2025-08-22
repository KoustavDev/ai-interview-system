"use client";

import { useGetProfile } from "@/api/queryMutations";
import { ProfilePage } from "@/components/profile-page";
import Loader from "@/components/ui/Loader";
import extractFileNameFromUrl from "@/lib/fileNameFinder";
import { use } from "react";

export default function ProfilePageDemo({ params }) {
  const { id } = use(params);
  const { data: user, isPending } = useGetProfile(id);

  let profileData;

  if (user?.role === "recruiter") {
    profileData = {
      id: user?.id,
      role: "recruiter",
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      company: user?.recruiterProfile?.companyName,
      position: user?.recruiterProfile?.position,
      about: user?.recruiterProfile?.about,
      contactNumber: user?.recruiterProfile?.contactNumber,
    };
  } else if (user?.role === "candidate") {
    profileData = {
      id: user?.id,
      role: "candidate",
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      education: user?.candidateProfile.education,
      experience: user?.candidateProfile.experience,
      about: user?.candidateProfile.about,
      skills: user?.candidateProfile.skills,
      resume: {
        fileName: extractFileNameFromUrl(
          user?.candidateProfile?.resumes?.fileUrl
        ),
        fileUrl: user?.candidateProfile?.resumes?.fileUrl,
        uploadDate: user?.candidateProfile?.resumes?.uploadedAt,
        fileSize: "2.4 MB",
      },
    };
  }
  return (
    <div className="min-h-screen bg-background">
      {isPending ? <Loader /> : <ProfilePage profileData={profileData} />}
    </div>
  );
}

