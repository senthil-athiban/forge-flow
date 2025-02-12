"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MoreHorizontal, Pencil } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Action, Trigger } from "@/types/zap";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";
import ZapTest from "./ZapTest";
import DeleteModal from "../Workflow/DeleteModal";
import ZapService from "@/services/zap.service";


export type Workflow = {
  id: string;
  name: string;
  trigger: Trigger;
  actions: Array<Action>;
  lastModified: any;
  owner: string;
};

const MenuCell = ({ row }: { row: Row<Workflow> }) => {
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const { id } = row.original;

  const handleDeleteWorkflow = async () => {
    if (!id) {
      toast.error("Failed to delete workflow");
      return;
    }
    try {
      const response = await ZapService.deleteZap(id);
      if (response) {
        toast.success("Workflow has been deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete workflow");
      console.error("Failed to delete workflow", error);
    }
  };
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
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)}>
            <Pencil className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isTestOpen && (
        <ZapTest
          isOpen={isTestOpen}
          onClose={() => setIsTestOpen(false)}
          zapId={id}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          key={"Workflow"}
          label="Workflow"
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteWorkflow}
        />
      )}
    </>
  );
};

export const columns: ColumnDef<Workflow>[] = [
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
              className={`h-4 w-4 stroke-[3] p-0 ${isSorted === "asc" ? "text-indigo-600" : "text-gray-400"}`}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp className="h-3 w-3 stroke-[3]" />
            </Button>
            <Button
              variant="ghost"
              className={`h-4 w-4 stroke-[3] p-0 ${isSorted === "desc" ? "text-indigo-600" : "text-gray-400"}`}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown className="h-3 w-3 stroke-[3]" />
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
    accessorKey: "name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <div className="flex items-center gap-x-2">
          <span>Name</span>
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
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;
      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "triggers",
    header: "Triggers",
    cell: ({ row }) => {
      const trigger = row.original.trigger;
      return (
        <TooltipWrapper content={trigger.triggerType.name}>
          <img
            src={trigger.triggerType.image}
            alt=""
            className="h-8 w-8 rounded-full border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-md"
          />
        </TooltipWrapper>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const actions = row.original.actions;
      return (
        <div className="flex gap-x-2 items-center">
          {actions.map((action, index) => (
            <div key={index}>
              <TooltipWrapper content={action.actionType.name}>
                <img
                  key={index}
                  src={action.actionType.image}
                  alt=""
                  className="h-8 w-8 rounded-full border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-md"
                />
              </TooltipWrapper>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "modified",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <div className="flex items-center gap-x-2">
          <span>Last modified</span>
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
      );
    },
    cell: ({ row }) => {
      const lastModified = row.original.lastModified;
      return <div>{format(lastModified, "MMM dd, yyyy")}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const a = new Date(rowA.original.lastModified).getTime();
      const b = new Date(rowB.original.lastModified).getTime();
      return a < b ? -1 : a > b ? 1 : 0;
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "menu",
    header: "Menu",
    cell: MenuCell,
  },
];
