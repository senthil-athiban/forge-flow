"use client";
import React from 'react'
import { DataTable } from '../Zap/DataTable'
import useZaps from '@/hooks/useZaps';
import { executionColumns, WorkflowRun } from './ExecutionColumns';

const ExecutionContent = () => {
  const { data, isLoading } = useZaps() as any;
  const transformedData: WorkflowRun[] = isLoading || !data?.zaps
    ? []
    : data.zaps.flatMap((zap: any) => zap.zapRun?.flatMap((item: any) => ({
      id: item.id,
      status: item.status,
      zap: zap,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
  })));

  return (
    <div className='px-4 py-1.5 space-y-4'>
      <span className='text-xl my-2 font-semibold text-indigo-500 tracking-wide'>ZAP EXECUTIONS</span>
      <DataTable columns={executionColumns} data={transformedData} />
    </div>
  )
}

export default ExecutionContent