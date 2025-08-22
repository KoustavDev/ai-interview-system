import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true
});

let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    console.log("From response err");
    if (
      error.response &&
      error.response.status === 401 &&
      !isRefreshing &&
      !error.config.url.includes("/renew-tokens")
    ) {
      isRefreshing = true;
      try {
        const response = await axiosInstance.get("users/renew-tokens", {
          withCredentials: true,
        });

        if (response.status === 200) {
          return axiosInstance({
            ...error.config,
            withCredentials: true,
          });
        }
      } catch (err) {
        console.error("Token refresh failed", err);
        console.log("Faulty tokens");
        // redirect to login or logout
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
