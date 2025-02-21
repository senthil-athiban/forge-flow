"use client";

import { columns, Workflow } from "./Columns"
import { DataTable } from "./DataTable"
import { Zap } from "@/types/zap";
import { Loader2 } from "lucide-react";

interface ZapTableProps {
  isLoading: boolean;
  zapData: any;
}

export default function ZapTable ({ isLoading, zapData } : ZapTableProps) {
  
  const transformedData: Workflow[] = isLoading || !zapData?.zaps
    ? []
    : zapData.zaps.map((item: Zap) => ({
        id: item.id,
        name: 'My zap',
        actions: item.actions,
        trigger: item.trigger,
        owner: 'None',
        lastModified: item.updatedAt
    }));
    
  if (isLoading) {
    return <div className="flex justify-center items-center">
      <Loader2 />
    </div>;
  }

  return (
    <div className="m-4 py-4">
      <DataTable columns={columns} data={transformedData} />
    </div>
  );
}