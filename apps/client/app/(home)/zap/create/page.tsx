"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ZapService from "@/services/zap.service";
import useTriggerAndActionTypes from "@/hooks/useTriggerAndActionTypes";
import ChannelSelector from "@/components/Modal/ChannelSelector";
import { Button } from "@/components/ui/button";
import WorkflowBuilder from "@/components/Workflow/WorkflowBuilder";
import { Action, Trigger, WorkflowPayload } from "@/types/workflow";

const ZapCreatePage = () => {
  const router = useRouter();
  const { actionTypes, triggerTypes } = useTriggerAndActionTypes();

  const [trigger, setTrigger] = useState<Trigger>({ id: "", name: "" });
  const [actions, setActions] = useState<Action[]>([]);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "",
    selectedIndex: null as number | null,
  });

  const handleTriggerClick = () => {
    setModalConfig({
      isOpen: true,
      type: "trigger",
      selectedIndex: 1,
    });
  };

  const handleActionClick = (index: number) => {
    setModalConfig({
      isOpen: true,
      type: "action",
      selectedIndex: index + 2,
    });
  };

  const handleActionDelete = (index: number) => {
    setActions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddAction = () => {
    setActions((prev) => [...prev, { actionId: "", actionName: "", metadata: {} }]);
  };

  const handleModalSelect = (selectedItem: any) => {
    if (modalConfig.type === "trigger") {
      setTrigger({
        id: selectedItem.id,
        name: selectedItem.name,
      });
    } else {
      setActions((prev) => {
        const newActions = [...prev];
        const index = modalConfig.selectedIndex! - 2;
        newActions[index] = {
          actionId: selectedItem.id,
          actionName: selectedItem.name,
          metadata: selectedItem.metadata || {},
        };
        return newActions;
      });
    }
  };

  const handlePublish = async () => {
    try {
      const payload: WorkflowPayload = {
        triggerTypeId: trigger.id,
        actions: actions.map(action => ({
          actionTypeId: action.actionId,
          actionMetaData: action.metadata,
        })),
      };

      const response = await ZapService.createZap(payload);
      if (response) {
        toast.success("Workflow has been created");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to create workflow");
      console.error("[ERROR IN CREATING ZAP]:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-indigo-600">
          Create Workflow
        </h1>
        <Button
          variant="primary"
          onClick={handlePublish}
          disabled={!trigger.id || actions.length === 0}
        >
          Publish
        </Button>
      </div>

      <WorkflowBuilder
        trigger={trigger}
        actions={actions}
        onTriggerClick={handleTriggerClick}
        onActionClick={handleActionClick}
        onActionDelete={handleActionDelete}
        onAddAction={handleAddAction}
      />

      <ChannelSelector
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        type={modalConfig.type as "trigger" | "action"}
        availableItems={modalConfig.type === "trigger" ? triggerTypes : actionTypes}
        onSelect={handleModalSelect}
        selectedItemIndex={modalConfig.selectedIndex}
      />
    </div>
  );
};

export default ZapCreatePage;