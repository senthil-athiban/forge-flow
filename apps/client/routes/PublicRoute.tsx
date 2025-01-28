"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated: ', isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
};

export default PublicRoute;
