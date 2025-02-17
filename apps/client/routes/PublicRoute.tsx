"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && isAuthenticated) {
      router.push("/dashboard");
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  if(isLoading) return null;
  return  <>{children}</>;
};

export default PublicRoute;
