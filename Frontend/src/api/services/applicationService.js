import { axiosInstance } from "../axios";
import API_ENDPOINTS from "../constant/apiEndpoints";

export const appliedJobs = async () => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.APPLICATION.APPLIED_JOBS
  );
  return data;
};

export const createApplications = async (jobId) => {
  const { data, success } = await axiosInstance.post(
    API_ENDPOINTS.APPLICATION.CREATE_APPLICATION,
    {
      jobId,
    }
  );
  return { data, success };
};

export const getApplication = async (jobId) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.APPLICATION.GET_APPLICATION + jobId
  );
  return data;
};

export const shortLised = async () => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.APPLICATION.SHORTLISTED_APPLICATION
  );
  return data;
};

export const changeStatus = async ({ applicationId, status }) => {
  const { data, success } = await axiosInstance.patch(
    API_ENDPOINTS.APPLICATION.CHANGE_STATUS,
    { applicationId, status }
  );
  return { data, success };
};