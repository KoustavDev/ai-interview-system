"use client";
import {
  useGetProfile,
  useUpdateCandidateProfile,
  useUpdateRecruiterProfile,
} from "@/api/queryMutations";
import { getImageUplodeUrl, imageUpload } from "@/api/services/authService";
import {
  getResumeUploadUrl,
  resumeUpload,
} from "@/api/services/candidateService";
import { ProfileUpdateSkeleton } from "@/components/loading-state/profile-update-skeleton";
import { ProfileUpdatePage } from "@/components/profile-update";
import { useAuthProvider } from "@/context/AuthProvider";
import extractFileNameFromUrl from "@/lib/fileNameFinder";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function ProfileUpdatePageRoute({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { user: rootUser } = useAuthProvider();
  const { data: user, isPending } = useGetProfile(id);
  const { mutateAsync: updateCandidateProfile } = useUpdateCandidateProfile(
    rootUser?.id
  );
  const { mutateAsync: updateRecruiterProfile } = useUpdateRecruiterProfile();

  if (!isPending) {
    if (rootUser?.id !== user?.id) router.back();
  }

  let profileData;

  if (user?.role === "recruiter") {
    profileData = {
      id: user?.id,
      role: "recruiter",
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      company: user?.recruiterProfile?.companyName || "",
      position: user?.recruiterProfile?.position || "",
      about: user?.recruiterProfile?.about || "",
      contactNumber: user?.recruiterProfile?.contactNumber || "",
    };
  } else if (user?.role === "candidate") {
    profileData = {
      id: user?.id,
      role: "candidate",
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      education: user?.candidateProfile.education || "",
      experience: user?.candidateProfile.experience || "",
      about: user?.candidateProfile.about || "",
      skills: user?.candidateProfile.skills || [],
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

  const handleUpdateProfile = async (data) => {
    const {
      about,
      avatar,
      education,
      experience,
      resume,
      skills,
      company,
      position,
      contactNumber,
    } = data;
    if (avatar?.lastModified) {
      console.log("Updating image");
      const { uploadUrl } = await getImageUplodeUrl({
        fileName: avatar.name,
        fileType: avatar.type,
      });

      await imageUpload(uploadUrl, avatar);
      console.log("Iamge uploaded");
    }

    if (rootUser.role === "recruiter") {
      console.log("Uploading recruiter...");
      const { success } = await updateRecruiterProfile({
        avatar: avatar?.name,
        recruiterId: rootUser.recruiterProfile.id,
        companyName: company,
        position,
        contactNumber,
        about,
      });
      console.log("Uploaded recruiter!");

      if (success) router.push(`/profile/${rootUser.id}`);
      else console.error("Failed to update");
    } else if (rootUser.role === "candidate") {
      if (resume.lastModified) {
        const { uploadUrl } = await getResumeUploadUrl({
          fileName: resume.name,
          fileType: resume.type,
        });

        await resumeUpload(uploadUrl, resume);
        console.log("Resume upload is done");
      }

      const { success } = await updateCandidateProfile({
        avatar: avatar.name,
        candidateId: rootUser.candidateProfile.id,
        education,
        experience,
        skills,
        about,
        resumeUrl: resume.name,
      });

      if (success) router.push(`/profile/${rootUser.id}`);
      else console.error("Failed to update");
    }
    
  };

  return (
    <>
      {isPending ? (
        <ProfileUpdateSkeleton role={rootUser?.role}/>
      ) : (
        <ProfileUpdatePage
          initialData={profileData}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </>
  );
}

