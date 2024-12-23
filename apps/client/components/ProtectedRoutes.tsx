"use client";
import { publicRoutes } from "@/app/config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// TODO: refactor the routes handling in generic way
const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const path = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if(publicRoutes.includes(path)) {
        setIsAuthenticated(true);
        return;
    }
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(Boolean(token && token !== "undefined" && token !== "null"));
    
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router, isAuthenticated, path]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;