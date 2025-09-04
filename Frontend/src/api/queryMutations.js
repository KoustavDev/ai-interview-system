import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  currentUser,
  forgotPassword,
  getProfile,
  login,
  logout,
  renewTokens,
  resetPassword,
  signIn,
  validateToken,
} from "./services/authService";
import QUERY_KEYS from "./constant/queryKeys";
import { getResumeUploadUrl, updateProfile } from "./services/candidateService";
import { dashboard, updateRecruiterProfile } from "./services/recruiterService";
import { createJob, getJobById, getJobs } from "./services/jobService";
import {
  appliedJobs,
  changeStatus,
  createApplications,
  getApplication,
  shortLised,
} from "./services/applicationService";
import {
  chatWithAI,
  deleteInterview,
  generateReport,
  getReport,
  startInterview,
} from "./services/interviewService";

export const useCreateAccount = () => {
  return useMutation({
    mutationFn: (user) => signIn(user),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (user) => login(user),
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: () => currentUser(),
    staleTime: 6000,
  });
};

export const useRenewTokens = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.RENEW_TOKENS],
    queryFn: () => renewTokens(),
    staleTime: 28 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => logout(),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email) => forgotPassword(email),
  });
};

export const useValidateToken = (token) => {
  return useQuery({
    queryKey: ["validate-token", token], // include token so it reruns when token changes
    queryFn: () => validateToken(token),
    enabled: !!token, // only run if token is provided
    refetchOnWindowFocus: false, // no refetch on tab focus
    refetchOnReconnect: false, // no refetch on network reconnect
    retry: false, // don't retry automatically (optional)
    staleTime: Infinity, // data never becomes stale
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ password, id }) => resetPassword({ password, id }),
  });
};

export const useGetProfile = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROFILE, id],
    queryFn: () => getProfile(id), // use id from props
    enabled: !!id, // avoid running if id is undefined/null
  });
};

export const useUpdateCandidateProfile = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      avatar,
      candidateId,
      education,
      experience,
      skills,
      about,
      resumeUrl,
    }) =>
      updateProfile({
        avatar,
        candidateId,
        education,
        experience,
        skills,
        about,
        resumeUrl,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROFILE, id],
      });
    },
  });
};

export const useUpdateRecruiterProfile = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      recruiterId,
      avatar,
      companyName,
      position,
      contactNumber,
      about,
    }) =>
      updateRecruiterProfile({
        recruiterId,
        avatar,
        companyName,
        position,
        contactNumber,
        about,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROFILE, id],
      });
    },
  });
};

export const useRecruiterDashboard = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.RECRUITER_DASHBOARD],
    queryFn: () => dashboard(),
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
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
    }) =>
      createJob({
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
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RECRUITER_DASHBOARD],
      });
    },
  });
};

export const useJobs = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_JOBS, "infinity"],
    queryFn: ({ pageParam = 1 }) => getJobs({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage?.currentPage < lastPage?.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
};

export const useGetJobById = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_JOB, id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
};

export const useAppliedJobs = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.APPLIED_JOBS],
    queryFn: () => appliedJobs(),
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId) => createApplications(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APPLIED_JOBS] });
      queryClient.setQueryData([QUERY_KEYS.GET_JOBS], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            jobs: page.jobs.map((job) =>
              job.id === jobId ? { ...job, isApplied: true } : job
            ),
          })),
        };
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_JOB] });
    },
  });
};

export const useGetApplicationByJobId = (jobId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_APPLICATION],
    queryFn: () => getApplication(jobId),
  });
};

export const useShortList = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SHORTLISTED_APPLICATION],
    queryFn: () => shortLised(),
  });
};

export const useChangeApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, status }) =>
      changeStatus({ applicationId, status }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SHORTLISTED_APPLICATION],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_REPORT, variables.applicationId],
      });
    },
  });
};

export const useGetReport = (applicationId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_REPORT, applicationId],
    queryFn: () => getReport(applicationId),
    enabled: !!applicationId,
  });
};

export const useStartInterview = () => {
  return useMutation({
    mutationFn: (applicationId) => startInterview(applicationId),
  });
};

export const useChat = () => {
  return useMutation({
    mutationFn: ({ interviewId, message }) => chatWithAI(interviewId, message),
  });
};

export const useDeleteInterview = () => {
  return useMutation({
    mutationFn: (interviewId) => deleteInterview(interviewId),
  });
};

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: (interviewId) => generateReport(interviewId),
  });
};
