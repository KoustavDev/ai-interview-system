"use client";

import { useGetProfile } from "@/api/queryMutations";
import { ProfileNotFound } from "@/components/error-state/profile-not-found";
import { ProfileSkeleton } from "@/components/loading-state/profile-skeleton";
import { ProfilePage } from "@/components/profile-page";
import extractFileNameFromUrl from "@/lib/fileNameFinder";
import { use } from "react";

export default function ProfilePageDemo({ params }) {
  const { id } = use(params);
  const { data: user, isPending, isError } = useGetProfile(id);

  let profileData;

  if (!isPending) {
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
    document.title = `${user?.name} | AI Interview System`;
  }

  return (
    <div className="min-h-screen bg-background">
      {isPending ? (
        <ProfileSkeleton />
      ) : isError ? (
        <ProfileNotFound />
      ) : (
        <ProfilePage profileData={profileData} />
      )}
    </div>
  );
}
