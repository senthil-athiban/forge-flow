"use client";
import React, { useState } from "react";
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
  const { user, isLoading } = useCurrentUser();
  
  const onSubmit = async () => {
    if ( !user?.id || !zapId ) {
      return;
    }
    
    try {
      const res = await axios.post(
        `http://localhost:8080/hooks/catch/${user?.id}/${zapId}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if(res) {
        toast.success('Zap has been triggered');
      }
    } catch (error) {
      toast.warning("Failed to test zap");
    } finally {
      setPayload("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test with custom payload</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col justify-between border rounded-lg bg-slate-200 p-2 h-72 w-full">
              <textarea
                id="payload"
                onChange={(e) => setPayload(e.target.value)}
                className="border-2 border-gray-400 rounded-lg text-gray-800 w-full h-56 p-2 bg-slate-200"
              />
              <Button
                onClick={onSubmit}
                variant={"primary"}
                className="w-full"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ZapTest;
