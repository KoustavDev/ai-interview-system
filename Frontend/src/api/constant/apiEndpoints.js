const API_ENDPOINTS = {
  HEALTH_CHECK: "/healthCheck",

  AUTH: {
    REGISTER: "/users/register",
    LOGIN: "/users/login",
    CURRENT_USER: "/users/current-user",
    RENEW_ACCESS_TOKEN: "/users/renew-tokens",
    LOGOUT: "/users/logout",
    PROFILE: "/users/profile/",
    IMAGE_UPLOAD_URL: "/users/image-uplode-url",
  },
  CANDIDATE: {
    RESUME_UPLOAD_URL: "/candidate/resume-uplode-url",
    UPDATE_PROFILE: "candidate/update-profile",
  },
  RECRUITER: {
    UPDATE_PROFILE: "/recruiter/update-profile",
    DASHBOARD: "/recruiter/dashboard",
  },
  JOBS: {
    CREATE: "/job/create-job",
    GET_JOB: "/job/get-jobs",
    GET_JOB_BY_ID: "/job/get-job/",
  },
  APPLICATION: {
    CREATE_APPLICATION: "/applications/create-application",
    GET_APPLICATION: "/applications/get-application/",
    APPLIED_JOBS: "/applications/applied-jobs",
    SHORTLISTED_APPLICATION: "/applications/shortlisted-applications",
    CHANGE_STATUS: "/applications/status",
  },
  INTERVIEW: {
    START: "/interview/start",
    CHAT: "/interview/chat",
    DELETE_INTERVIEW: "/interview/delete",
    GENERATE_REPORT: "/interview/report",
    GET_REPORT: "/interview/report",
  },
};

export default API_ENDPOINTS