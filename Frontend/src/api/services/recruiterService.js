import { axiosInstance } from "../axios";
import API_ENDPOINTS from "../constant/apiEndpoints";

export const updateRecruiterProfile = async ({
  recruiterId,
  avatar,
  position,
  companyName,
  contactNumber,
  about,
}) => {
  const { data, success } = await axiosInstance.put(
    API_ENDPOINTS.RECRUITER.UPDATE_PROFILE,
    {
      recruiterId,
      avatar,
      companyName,
      position,
      contactNumber,
      about,
    }
  );
  return { data, success };
};

export const dashboard = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.RECRUITER.DASHBOARD);
  return data;
};
