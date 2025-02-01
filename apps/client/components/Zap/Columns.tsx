"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, MoreHorizontal, Pencil } from "lucide-react";
import { format } from "date-fns";
import { Action, Trigger } from "@/types/zap";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TooltipWrapper from "@/components/ui/tooltip-wrapper";

export type Workflow = {
  id: string;
  name: string;
  trigger: Trigger;
  actions: Array<Action>;
  lastModified: any;
  owner: string;
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
              className={`h-4 w-4 p-0 ${isSorted === "asc" ? "text-indigo-600" : "text-gray-400"}`}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              className={`h-4 w-4 p-0 ${isSorted === "desc" ? "text-indigo-600" : "text-gray-400"}`}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown className="h-3 w-3" />
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
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              className={`h-4 w-4 p-0 ${isSorted === "desc" ? "text-indigo-600" : "text-gray-400"}`}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown className="h-3 w-3" />
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
            <TooltipWrapper content={action.actionType.name}>
              <img
                key={index}
                src={action.actionType.image}
                alt=""
                className="h-8 w-8 rounded-full border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-md"
              />
            </TooltipWrapper>
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
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              className={`h-4 w-4 p-0 ${isSorted === "desc" ? "text-indigo-600" : "text-gray-400"}`}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown className="h-3 w-3" />
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
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              <Pencil className="w-4 h-4 mr-2" />
              Test
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
