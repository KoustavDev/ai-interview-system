import axios from "axios";
import { axiosInstance } from "../axios";
import API_ENDPOINTS from "../constant/apiEndpoints";

export const signIn = async ({ name, email, password, role, companyName }) => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, {
    name,
    email,
    password,
    role,
    companyName,
  });
  return await login({ email, password });
};

export const login = async ({ email, password }) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.AUTH.LOGIN,
    {
      email,
      password,
    },
    { withCredentials: true }
  );
  return data.finalUser;
};

export const currentUser = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.AUTH.CURRENT_USER);
  return data;
};

export const renewTokens = async () => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.AUTH.RENEW_ACCESS_TOKEN
  );
  return data;
};

export const logout = async () => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  return data;
};

export const getProfile = async (userId) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE + userId);
  return data;
};

export const getImageUplodeUrl = async ({ fileName, fileType }) => {
  const { data } = await axiosInstance.post(
    API_ENDPOINTS.AUTH.IMAGE_UPLOAD_URL,
    {
      fileName,
      fileType,
    }
  );
  return data;
};

export const imageUpload = async (url, file) => {
  await axios.put(url, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
};

export const forgotPassword = async (email) => {
  const { data, success } = await axiosInstance.post(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    { email }
  );
  return { data, success };
};

export const validateToken = async (token) => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.AUTH.VALIDATE_TOKEN,
    {
      params: {
        token,
      },
    }
  );
  return data;
};

export const resetPassword = async ({ password, id }) => {
  const { data, success } = await axiosInstance.post(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    {
      password,
      id,
    }
  );
  return { data, success };
};
