"use client";
import React from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  label: string;
}
const DeleteModal = ({
  label,
  onClose,
  onConfirm,
  isOpen,
}: DeleteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent
        className="sm:mad-w-md"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Workflow</DialogTitle>
          <DialogDescription>
            Are you sure about to delete {label} ?
          </DialogDescription>
        </DialogHeader>
        <div className="flex px-2.5 py-1.5 justify-between">
          <Button
            id="cancel-btn"
            type="button"
            variant={"destructive"}
            size={"sm"}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            id="confirm-btn"
            type="button"
            variant={"primary"}
            size={"sm"}
            onClick={async (e) => {
              e.preventDefault();
              await onConfirm();
            }}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
