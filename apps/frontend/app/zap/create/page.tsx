"use client";
import React, { useState } from "react";
import ZapCell from "@/components/Zap/ZapCell";
import { Action } from "@/types/zap";
import PrimaryButton from "@/components/Button/PrimaryButton";

const ZapCreatePage = () => {
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedActions, setSelectedActions] = useState<{ actionId: string; actionName: string }[]>([]);

  return (
    <div className="flex flex-col justify-center min-h-screen bg-slate-200">
      <div className="flex flex-col justify-center items-center w-full">
        <ZapCell
          name={selectedTrigger ? selectedTrigger : "trigger"}
          index={1}
        />
      </div>
      <div className="flex flex-col justify-center items-center w-full gap-y-2 pt-2">
        {selectedActions?.map((action: any, index: number) => (
          <ZapCell
            key={index}
            name={action.actionId ? action.actionName : "Action"}
            index={index + 2}
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
    </div>
  );
};

export default ZapCreatePage;
