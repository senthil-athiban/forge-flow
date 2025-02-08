"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ZapTestProps {
  isOpen: boolean;
  onClose: () => void;
  zapId: string;
}
const ZapTest = ({ isOpen, onClose, zapId }: ZapTestProps) => {
  const [payload, setPayload] = useState("");
  const { user } = useCurrentUser();

  const onSubmit = async () => {
    if (!user?.id || !zapId) {
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOOKS_DOMAIN}/hooks/catch/${user?.id}/${zapId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res) {
        toast.success("Zap has been triggered");
      }
    } catch (error) {
      toast.warning("Failed to test zap");
    } finally {
      setPayload("");
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
    setPayload("");
  }

  useEffect(() => {
    return () => {
      setPayload("");
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={true}>
      <DialogContent className="sm:mad-w-md" onInteractOutside={(e) => {e.preventDefault()}} onEscapeKeyDown={(e) => {e.preventDefault()}}>
        <DialogHeader>
          <DialogTitle>ZAP TEST</DialogTitle>
          <DialogDescription>Test with custom payload</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-between border rounded-lg bg-slate-200 p-2 h-72 w-full">
          <textarea
            id="payload"
            onChange={(e) => setPayload(e.target.value)}
            className="border-2 border-gray-400 rounded-lg text-gray-800 w-full h-56 p-2 bg-slate-200"
          />
          <div className="flex justify-between gap-x-2">
          <Button
            id="cancel"
            type="button"
            size={"sm"}
            className="w-full"
            variant={"destructive"}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            id="submit"
            type="submit"
            className="w-full"
            size={"sm"}
            variant={"primary"}
            onClick={onSubmit}
          >
            Submit
          </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ZapTest;
