"use client";

import useZaps from "@/hooks/useZaps";
import { columns, Workflow } from "./Columns";
import { DataTable } from "./DataTable";
import { Zap } from "@/types/zap";
import { Loader2 } from "lucide-react";

export default function ZapRunTable() {
  const { data, isLoading } = useZaps() as any;
  const transformedData: Workflow[] =
    isLoading || !data?.zaps
      ? []
      : data.zaps.map((item: Zap) => ({
          id: item.id,
          name: "My zap",
          actions: item.actions,
          trigger: item.trigger,
          owner: "None",
          lastModified: item.updatedAt,
        }));

  console.log('transformedData: ', transformedData)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 />
      </div>
    );
  }

  return (
    <div className="m-4 py-4">
      <DataTable columns={columns} data={transformedData} />
    </div>
  );
}
