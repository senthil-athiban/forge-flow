import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/utils";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    redirect("/");
  }
  return <>{children}</>;
};

export default ProtectedRoute;
