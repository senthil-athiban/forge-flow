"use client";

import React from "react";
import useZaps from "@/hooks/useZap";
import { Plus, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import UserService from "@/services/user.service";
import ZapTable from "../Zap/ZapTable";
import { Button } from "../ui/button";
import Widget from "./Widget";
import Loader from "../ui/loader";

const DashboardContent = () => {
  const { isLoading, data } = useZaps();
  const router = useRouter();
  const handleVerify = async () => {
    try {
      const res = await UserService.getProfile();
    } catch (error) {
      console.log("error in verifying user:", error);
    }
  };

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
      <div className="py-4">
        <div className="flex justify-end mb-2">
          <div className="flex items-center gap-x-3">
            <Button
              onClick={handleVerify}
              variant="outline"
              className="flex items-center gap-x-2 text-slate-700"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={() => router.push("/zap/create")}
              className="flex items-center gap-x-2 bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create Workflow
            </Button>
          </div>
        </div>
        <div className="w-full">
          <Widget zapData={data} />
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg">
        <ZapTable isLoading={isLoading} zapData={data} />
      </div>
    </div>
  );
};

export default DashboardContent;
