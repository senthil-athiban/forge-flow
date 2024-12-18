"use client";
import ZapButton from "@/components/Button/ZapButton";
import ZapTable from "@/components/Table/ZapTable";
import useZaps from "@/hooks/useZaps";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const { isLoading, data } = useZaps();
  const router = useRouter();
  return (
    <><div className="flex justify-center">
      <div className="flex justify-between max-w-screen-md w-full pt-10">
        <div>My Zaps</div>
        <div>
          <ZapButton onClick={() => router.push('/zap/create')}>+ Create</ZapButton>
        </div>
      </div>
    </div>
    {isLoading ? <Loader /> : <ZapTable zaps={data} />}
  </>
  );
};

export default Dashboard;
