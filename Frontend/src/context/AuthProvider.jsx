"use client";
import { currentUser } from "@/api/services/authService";
import Loader from "@/components/ui/Loader";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const INITIAL_STATE = {
  user: {},
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  isAuth: false,
  setIsAuth: () => {},
  checkAuth: async () => false,
};

const AuthContext = createContext(INITIAL_STATE);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const data = await currentUser();

      if (data) {
        setIsAuth(true);
        setUser(data);
        return true;
      }
    } catch (error) {
      console.error("AuthProvider :: checkAuth error:", error);
      return false;
    } finally {
      setLoading(false);
    }
    setIsAuth(false);
    return false;
  }, [setLoading, setIsAuth, setUser]);

  useEffect(() => {
    const checkAndRedirect = async () => {
      const res = await checkAuth();
      if (!res) router.push("/login");
    };
    checkAndRedirect();
  }, [checkAuth, router]);

  useEffect(() => {
    if (!user) return;

    const pathname = window.location.pathname;
    if (user.role === "recruiter" && pathname.includes("candidate")) {
      router.back();
    } else if (user.role === "candidate" && pathname.includes("recruiter")) {
      router.back();
    }
  }, [user, router]);

  // Context value
  const value = {
    user,
    setUser,
    loading,
    setLoading,
    isAuth,
    setIsAuth,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Wrapper component to handle suspense
const AuthProviderWrapper = ({ children }) => (
  <Suspense fallback={<Loader />}>
    <AuthProvider>{children}</AuthProvider>
  </Suspense>
);

const useAuthProvider = () => useContext(AuthContext);

export { AuthProviderWrapper, useAuthProvider };
