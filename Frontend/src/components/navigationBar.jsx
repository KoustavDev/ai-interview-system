"use client";

import { Navbar } from "./navbar";
import { useAuthProvider } from "@/context/AuthProvider";
import { useLogout } from "@/api/queryMutations";
import { useRouter, usePathname } from "next/navigation";

export default function NavigationBar() {
  const { isAuth, user, setIsAuth, setUser } = useAuthProvider();
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const pathName = usePathname();
  const onInterview = pathName.startsWith("/candidate/interview");

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    setUser(null);
    router.push("/login");
  };

  return (
    <>
      {onInterview ? (
        <></>
      ) : (
        <Navbar
          isAuthenticated={isAuth}
          userRole={user?.role}
          userName={user?.name}
          userAvatar={user?.avatar}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
