import axios from "axios";
import { axiosInstance } from "../axios";
import API_ENDPOINTS from "../constant/apiEndpoints";

export const getResumeUploadUrl = async ({ fileName, fileType }) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.CANDIDATE.RESUME_UPLOAD_URL,
    {
      fileName,
      fileType,
    }
  );
  return data;
};

export const resumeUpload = async (url, file) => {
  await axios.put(url, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
};

export const updateProfile = async ({
  avatar,
  candidateId,
  education,
  experience,
  skills,
  about,
  resumeUrl,
}) => {
  const { data , success} = await axiosInstance.put(API_ENDPOINTS.CANDIDATE.UPDATE_PROFILE, {
    avatar,
    candidateId,
    education,
    experience,
    skills,
    about,
    resumeUrl,
  });
  return {data, success};
};
