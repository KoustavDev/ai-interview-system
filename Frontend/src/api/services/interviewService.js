import { axiosInstance } from "../axios";
import API_ENDPOINTS from "../constant/apiEndpoints";

export const getReport = async (applicationId) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.INTERVIEW.GET_REPORT, {
    params: { applicationId },
  });
  return data;
};

export const startInterview = async (applicationId) => {
  const { data, success } = await axiosInstance.post(
    API_ENDPOINTS.INTERVIEW.START,
    {
      applicationId,
    }
  );
  return { data, success };
};

export const chatWithAI = async (interviewId, message) => {
  const { data, success } = await axiosInstance.post(
    API_ENDPOINTS.INTERVIEW.CHAT,
    {
      interviewId,
      message,
    }
  );
  return { data, success };
};

export const deleteInterview = async (interviewId) => {
  const { data, success } = await axiosInstance.delete(
    API_ENDPOINTS.INTERVIEW.DELETE_INTERVIEW,
    {
      params: {interviewId},
    }
  );
  return { data, success };
};

export const generateReport = async (interviewId) => {
  const { data, success } = await axiosInstance.post(
    API_ENDPOINTS.INTERVIEW.GENERATE_REPORT,
    {
      interviewId,
    }
  );
  return { data, success };
};
