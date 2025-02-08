"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, MoreHorizontal, Pencil } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export interface WorkflowRun {
  id: string;
  status:
    | "PENDING"
    | "TRIGGERED"
    | "IN_PROGRESS"
    | "FAILED"
    | "SUCCESS"
    | "TIMED_OUT"
    | "CANCELLED"
    | "SKIPPED";
  createdAt: Date;
  updatedAt: Date;
  zap: {
    trigger: {
      triggerType: {
        name: string;
      };
    };
    actions: Array<any>;
  };
  metadata: any;
}

const statusPriority = {
  IN_PROGRESS: 1,
  PENDING: 2,
  TRIGGERED: 3,
  SUCCESS: 4,
  FAILED: 5,
  TIMED_OUT: 6,
  CANCELLED: 7,
  SKIPPED: 8,
} as const;

const statusColors = {
  PENDING: "gray",
  TRIGGERED: "blue",
  IN_PROGRESS: "yellow",
  FAILED: "red",
  SUCCESS: "green",
  TIMED_OUT: "orange",
  CANCELLED: "purple",
  SKIPPED: "slate",
};

const TestMenuCell = ({ row }: { row: any }) => {
  const [isTestOpen, setIsTestOpen] = useState(false);
  const { id } = row.original;
  
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsTestOpen(true)}>
            <Pencil className="w-4 h-4 mr-2" />
            Test 
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const executionColumns: ColumnDef<WorkflowRun>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <div className="flex items-center gap-x-2">
          <span>Id</span>
          <div className="flex flex-col">
            <Button
              variant="ghost"
              className={`h-4 w-4 p-0 ${isSorted === "asc" ? "text-indigo-600" : "text-gray-400"}`}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp className="h-3 w-3 stroke-[3] hover:bg-indigo-600" />
            </Button>
            <Button
              variant="ghost"
              className={`h-4 w-4 p-0 ${isSorted === "desc" ? "text-indigo-600" : "text-gray-400"}`}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown className="h-3 w-3 stroke-[3] hover:bg-indigo-600" />
            </Button>
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="font-medium">
          {id.charAt(0).toLocaleUpperCase() + id.substring(1, 6)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ( { column }) => {
      const isSorted = column.getIsSorted();
      return (
        <div className="flex items-center gap-x-2">
          <span>Status</span>
          <div className="flex flex-col">
          <Button
              variant="ghost"
              className={`h-4 w-4 p-0 ${isSorted === "asc" ? "text-indigo-600" : "text-gray-400"}`}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp className="h-3 w-3 stroke-[3]" />
            </Button>
            <Button
              variant="ghost"
              className={`h-4 w-4 p-0 ${isSorted === "desc" ? "text-indigo-600" : "text-gray-400"}`}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown className="h-3 w-3 stroke-[3]" />
            </Button>
          </div>
        </div>
      )
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={"outline"} className={`bg-${statusColors[status]}-200 rounded-full`}>
          <p className={`text-${statusColors[status]}-600 text-xs font-normal `}>{status}</p>
        </Badge>
      );
    },
    sortingFn: (rowA, rowB) => {
      const statusA = rowA.original.status;
      const statusB = rowB.original.status;
      return statusPriority[statusA] - statusPriority[statusB];
    }
  },
  {
    accessorKey: "trigger",
    header: "Trigger",
    cell: ({ row }) => {
      const triggerName = row.original.zap.trigger.triggerType.name;
      return triggerName || "No Trigger";
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return row.original.zap.actions.length || 0;
    },
  },
  {
    accessorKey: "duration",
    header: "Time taken",
    cell: ({ row }) => {
      const startDateTime = new Date(row.original.createdAt);
      const modifiedDateTime = new Date(row.original.updatedAt);
      const durationMs = modifiedDateTime.getTime() - startDateTime.getTime();
      const seconds = Math.floor(durationMs / 1000);
      return `${seconds} s`;
    },
  },
  {
    accessorKey: "menu",
    header: "Menu",
    cell: TestMenuCell
  },
];
