import { axiosInstance } from "../axios";
import API_ENDPOINTS from "../constant/apiEndpoints";

export const createJob = async ({
  recruiterId,
  title,
  description,
  type,
  salary,
  skillsRequired,
  experience,
  location,
  deadline,
  responsibility,
  benefits,
  requirement,
}) => {
  const { data, success } = await axiosInstance.post(
    API_ENDPOINTS.JOBS.CREATE,
    {
      recruiterId,
      title,
      description,
      type,
      salary,
      skillsRequired,
      experience,
      location,
      deadline,
      responsibility,
      benefits,
      requirement,
    }
  );

  return { data, success };
};

export const getJobs = async ({ pageParam = 1 }) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.JOBS.GET_JOB, {
    params: {
      page: pageParam,
      limit: 6,
      query: "",
      sortBy: "createdAt",
      sortType: "desc",
    },
  });
  return data;
};

export const getJobById = async (id) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.JOBS.GET_JOB_BY_ID + id
  );
  return data;
};
