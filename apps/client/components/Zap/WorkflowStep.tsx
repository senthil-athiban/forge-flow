import React, { useState } from "react";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowStepProps {
  type?: string;
  name?: string;
  index: number;
  onClick: any;
  isConfigured?: boolean;
  onDelete?: () => void;
}

const StepConnector = () => {
  return (
    <div className="h-14 w-[2px] my-1 bg-gray-200 relative mx-auto">
      <div className="absolute top-0 rounded-full bg-slate-300 left-1/2 -translate-x-1/2 w-2 h-2 " />
      <div className="absolute bottom-0 rounded-full bg-slate-300 left-1/2 -translate-x-1/2 w-2 h-2 " />
    </div>
  );
};

const WorkflowStep = ({
  type,
  name,
  index,
  onClick,
  isConfigured = false,
  onDelete,
}: WorkflowStepProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };
  return (
    <>
      <div
        onClick={onClick}
        className={cn(
          "group relative px-6 py-4 flex items-center gap-x-4",
          "w-[400px] border-2 rounded-lg transition-all duration-200 shadow-sm",
          "hover:shadow-md cursor-pointer",
          isConfigured
            ? "bg-green-50 border-green-200 hover:border-green-300"
            : "border-slate-200 hover:border-slate-300"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full border-2",
            "text-sm font-medium transition-colors",
            isConfigured
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-700"
          )}
        >
          {index}
        </div>

        <div className="flex-1">
          <h3 className={cn("text-sm font-medium")}>
            {type === "trigger" ? "Trigger" : "Action"}
          </h3>
          <p className="text-sm text-slate-500">
            {name || `Add ${type === "trigger" ? "trigger" : "action"}`}
          </p>
        </div>

        {isConfigured ? (
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
        ) : (
          <div className="flex gap-x-2">
            <Plus className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
            {type === "action" && (
              <Trash2
                className="w-5 h-5 text-slate-400 group-hover:text-slate-600"
                onClick={handleDelete}
              />
            )}
          </div>
        )}
      </div>
      <StepConnector />
    </>
  );
};

export default WorkflowStep;
