"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ZapService from "@/services/zap.service";
import useTriggerAndActionTypes from "@/hooks/useTriggerAndActionTypes";
import ZapCell from "@/components/Zap/ZapCell";
import ChannelSelector from "@/components/Modal/ChannelSelector";
import { Button } from "@/components/ui/button";

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

  const router = useRouter();
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
      const response = await ZapService.createZap(payload);
      if (response) {
        toast.success("Workflow has been created");
        router.push("/dashboard");
      }
    } catch (error) {
      console.log("[ERROR IN CREATING ZAP]:", error);
    }
  };
  return (
    <>
      <div className="flex w-full bg-slate-200 p-2 justify-end">
        <Button variant={"primary"} onClick={onSubmit}>Publish</Button>
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
          <Button
            variant={"primary"}
            className={"w-12 p-0 rounded-lg"}
            onClick={() =>
              setSelectedActions((prev) => [
                ...prev,
                { actionId: "", actionName: "", metadata: {} },
              ])
            }
          >
            +
          </Button>
        </div>
        {showModal && (
          <ChannelSelector
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
