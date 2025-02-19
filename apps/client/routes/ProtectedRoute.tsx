"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
        router.push('/login');
    }
    setIsLoading(false);
  }, [isAuthenticated, router]);

  if(isLoading) return null;
  
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
