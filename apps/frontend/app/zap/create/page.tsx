"use client";
import React, { useState } from "react";
import ZapCell from "@/components/Zap/ZapCell";
import { Action } from "@/types/zap";
import PrimaryButton from "@/components/Button/PrimaryButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useTriggerAndActionTypes from "@/hooks/useTriggerAndActionTypes";
import { BACKEND_URL } from "@/app/config";
import axios from "axios";

const ZapCreatePage = () => {
  const [selectedTrigger, setSelectedTrigger] = useState<{
    name: string;
    id: string;
  }>({ name: "", id: "" });
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );
  const [selectedActions, setSelectedActions] = useState<
    { actionId: string; actionName: string }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const { actionTypes, triggerTypes } = useTriggerAndActionTypes();

  const onSubmit = async () => {
    try {
      const payload = {
        triggerTypeId: selectedTrigger?.id,
        actions: selectedActions?.flatMap((item: any) => {
          return {
            actionTypeId: item.actionId,
            actionMetaData: {},
          };
        }),
      };
      console.log(" payload : ", payload);
      const response = await axios.post(`${BACKEND_URL}/api/v1/zap`, payload, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      console.log("respnse : ", response);
    } catch (error) {
      console.log("[ERROR IN CREATING ZAP]:", error);
    }
  };
  return (
    <>
      <div className="flex w-full bg-slate-200 p-2 justify-end">
        <PrimaryButton onClick={onSubmit}>Publish</PrimaryButton>
      </div>
      <div className="flex flex-col justify-center min-h-screen bg-slate-200">
        <div className="flex flex-col justify-center items-center w-full">
          <ZapCell
            name={selectedTrigger?.name ? selectedTrigger?.name : "trigger"}
            index={1}
            onClick={() => {
              setShowModal(true);
              setSelectedItemIndex(1);
            }}
          />
        </div>
        <div className="flex flex-col justify-center items-center w-full gap-y-2 pt-2">
          {selectedActions?.map((action: any, index: number) => (
            <ZapCell
              key={index}
              name={action.actionId ? action.actionName : "Action"}
              index={index + 2}
              onClick={() => {
                setShowModal(true);
                setSelectedItemIndex(index + 2);
              }}
            />
          ))}
        </div>
        <div className="w-full flex justify-center pt-2">
          <PrimaryButton
            className={"w-14 p-0"}
            onClick={() =>
              setSelectedActions((prev) => [
                ...prev,
                { actionId: "", actionName: "" },
              ])
            }
          >
            +
          </PrimaryButton>
        </div>
        {showModal && (
          <ModalComponent
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            availableItems={
              selectedItemIndex === 1 ? triggerTypes : actionTypes
            }
            onSelect={(props: any) => {
              if (selectedItemIndex === null) return;
              else if (selectedItemIndex === 1) {
                setSelectedTrigger({
                  name: props.name,
                  id: props.id,
                });
              } else if (selectedItemIndex > 1) {
                setSelectedActions((prev) => {
                  const updatedActions = [...prev];
                  updatedActions[updatedActions.length - 1] = {
                    actionId: props.id,
                    actionName: props.name,
                  };
                  return updatedActions;
                });
              }
              setShowModal(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default ZapCreatePage;

interface ModalComponentProps {
  isOpen: boolean;
  onClose: (value: React.SetStateAction<boolean>) => void;
  type?: "trigger" | "action";
  availableItems: any;
  onSelect: any;
}
const ModalComponent = ({
  isOpen,
  onClose,
  type,
  availableItems,
  onSelect,
}: ModalComponentProps) => {
  if (!isOpen) return;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Select {type === "trigger" ? "trigger" : "action"}
          </DialogTitle>
          <DialogDescription>
            {availableItems?.map((item: any) => (
              <div
                className="border p-2 w-full mt-2 rounded-lg hover:bg-slate-100 cursor-pointer"
                onClick={() => onSelect({ id: item?.id, name: item?.name })}
              >
                {item.name}
              </div>
            ))}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
