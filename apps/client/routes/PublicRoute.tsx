import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/utils";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) {
    redirect("/dashboard");
  }
  return <>{children}</>;
};

export default PublicRoute;
