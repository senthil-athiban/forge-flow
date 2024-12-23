"use client";
import React from "react";
import ZapButton from "@/components/Button/ZapButton";
import ZapTable from "@/components/Table/ZapTable";
import useAxios from "@/hooks/useAxios";
import useZaps from "@/hooks/useZaps";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardContent = () => {
  const { isLoading, data } = useZaps();
  const axiosInstance = useAxios();
  const router = useRouter();
  const handleVerify = async () => {
    const res = await axiosInstance.get(
      "http://localhost:8000/api/v1/user/verify"
    );
  };
  return (
    <>
      <div className="flex justify-center">
        <div className="flex justify-between max-w-screen-md w-full pt-10">
          <div>My Zaps</div>
          <div>
            <ZapButton onClick={() => router.push("/zap/create")}>
              + Create
            </ZapButton>
            <ZapButton onClick={handleVerify}>Verify</ZapButton>
          </div>
        </div>
      </div>
      {isLoading ? <Loader /> : <ZapTable zaps={data} />}
    </>
  );
};

export default DashboardContent;
