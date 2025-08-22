import {axiosInstance} from "../axios";
import API_ENDPOINTS from "../constant/apiEndpoints";

export const healthCheck = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.HEALTH_CHECK);
  return data;
};
