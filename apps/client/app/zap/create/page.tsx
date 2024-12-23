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
import { Input } from "@/components/ui/input";
import { metadata } from "@/app/layout";

const ZapCreatePage = () => {
  const [selectedTrigger, setSelectedTrigger] = useState<{
    name: string;
    id: string;
  }>({ name: "", id: "" });
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );
  const [selectedActions, setSelectedActions] = useState<
    { actionId: string; actionName: string; metadata: {} }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const { actionTypes, triggerTypes } = useTriggerAndActionTypes();
  console.log("selectedActions: ", selectedActions);
  const onSubmit = async () => {
    try {
      const payload = {
        triggerTypeId: selectedTrigger?.id,
        actions: selectedActions?.flatMap((item: any) => {
          return {
            actionTypeId: item.actionId,
            actionMetaData: item.metadata,
          };
        }),
      };
      console.log(" payload : ", payload);
      const response = await axios.post(`${BACKEND_URL}/api/v1/zap`, payload, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });
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
                { actionId: "", actionName: "", metadata: {} },
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
                    metadata: props.metadata,
                  };
                  return updatedActions;
                });
              }
              // setShowModal(false);
            }}
            selectedItemIndex={selectedItemIndex}
          />
        )}
      </div>
    </>
  );
};

export default ZapCreatePage;

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "trigger" | "action";
  availableItems: any;
  onSelect: any;
  selectedItemIndex: number | null;
}
const ModalComponent = ({
  isOpen,
  onClose,
  type,
  availableItems,
  onSelect,
  selectedItemIndex,
}: ModalComponentProps) => {
  const [selectedAction, setSelectedAction] = useState<{id: string;name: string;}>({ id: "", name: "" });

  if (!isOpen) return;

  const isTrigger = selectedItemIndex === 1;

  const handleData = (metadata: any) => {
    onSelect({...selectedAction, metadata});
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Select {type === "trigger" ? "trigger" : "action"}
          </DialogTitle>
          <DialogDescription>
            {selectedAction?.name?.length ? (
              selectedAction?.name === "email" ? (
                <EmailSelector
                  setMetadata={(metadata: any) => handleData(metadata)}
                />
              ) : (
                selectedAction?.name === "sms" && (
                  <SolSelector
                    setMetadata={(metadata: any) => handleData(metadata)}
                  />
                )
              )
            ) : (
              availableItems?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="border p-2 w-full mt-2 rounded-lg hover:bg-slate-100 cursor-pointer"
                  onClick={() => {
                    if (selectedItemIndex === 1) {
                      onSelect({ id: item?.id, name: item?.name });
                    } else {
                      onSelect({ id: item?.id, name: item?.name });
                      setSelectedAction({ id: item?.id, name: item?.name });
                    }
                  }}
                >
                  {item.name}
                </div>
              ))
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const EmailSelector = ({ setMetadata }: any) => {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = () => {
    setMetadata({
      email,
      body,
    });
  };
  return (
    <div className="flex flex-col gap-y-4 my-2">
      <Input
        type="text"
        placeholder="To"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Input
        type="text"
        placeholder="Body content"
        onChange={(e) => setBody(e.target.value)}
        value={body}
      />
      <PrimaryButton onClick={handleSubmit}>Submit</PrimaryButton>
    </div>
  );
};

const SolSelector = ({ setMetadata }: any) => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const handleSubmit = () => {
    setMetadata({
      email,
      amount,
    });
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Input
        type="text"
        placeholder="To"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Input
        type="text"
        placeholder="amount"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
      />
      <PrimaryButton onClick={handleSubmit}>Submit</PrimaryButton>
    </div>
  );
};
