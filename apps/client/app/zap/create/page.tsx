"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import useTriggerAndActionTypes from "@/hooks/useTriggerAndActionTypes";
import useAuth from "@/hooks/useAuth";
import PrimaryButton from "@/components/Button/PrimaryButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ZapCell from "@/components/Zap/ZapCell";

const ZapCreatePage = () => {
  const { user } = useAuth();
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
            user={user}
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
  user: any;
}
const ModalComponent = ({
  isOpen,
  onClose,
  type,
  availableItems,
  onSelect,
  selectedItemIndex,
  user,
}: ModalComponentProps) => {
  const [selectedAction, setSelectedAction] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  if (!isOpen) return;
  const isTrigger = selectedItemIndex === 1;

  const handleData = (metadata: any) => {
    onSelect({ ...selectedAction, metadata });
    onClose();
  };
  const handleSlackIntegration = async () => {
    const state = btoa(JSON.stringify({ userId: user.id }));
    const slackUrl = `https://slack.com/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}&scope=channels:join,channels:read,chat:write&state=${state}`;
    window.open(slackUrl, "_blank", "noopener,noreferrer,width=600,height=700");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Select {type === "trigger" ? "trigger" : "action"}
          </DialogTitle>
          <DialogDescription>
            {selectedAction?.name?.length
              ? (() => {
                  switch (selectedAction?.name) {
                    case "email":
                      return (
                        <EmailSelector
                          setMetadata={(metadata: any) => handleData(metadata)}
                        />
                      );
                    case "sms":
                      return (
                        <SolSelector
                          setMetadata={(metadata: any) => handleData(metadata)}
                        />
                      );
                    case "slack":
                      return showChannelSelector ? (
                        <SlackSelector
                          setMetadata={(metadata: any) => handleData(metadata)}
                        />
                      ) : (
                        <div className="flex flex-col gap-y-2">
                          <PrimaryButton onClick={handleSlackIntegration}>
                            Add slack
                          </PrimaryButton>
                          <PrimaryButton
                            onClick={() => setShowChannelSelector(true)}
                          >
                            Select channel
                          </PrimaryButton>
                        </div>
                      );
                    default:
                      return <div>Select an action type</div>;
                  }
                })()
              : availableItems?.map((item: any, index: number) => (
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
                ))}
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

const SlackSelector = ({setMetadata}: any) => {
  const [selectedChannel, setSelectedChannel] = useState<{
    channelId: string;
    name: string;
  }>({ channelId: "", name: "" });
  const [channels, setChannels] = useState([]);
  const handleSubmit = () => {
    setMetadata({ channelId: selectedChannel.channelId });
  };

  useEffect( () => {
    const fetchChannels = async () => {
      const res = await axios.get(`${BACKEND_URL}/api/v1/slack/channels`, {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        }
      });
      const channels  = res.data.channels.flatMap((c:any) => c.channels);
      setChannels(channels);
    };
    fetchChannels();
  }, []);

  return (
    <div className="flex flex-col">
      {!channels?.length ? (
        <p>No channels available</p>
      ) : (
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col gap-y-2">
            {channels?.map((c: any) => (
              <div
                key={c.channelId}
                onClick={() => setSelectedChannel({ channelId: c.channelId, name: c.name })}
              >
                <ul className={`border p-2 my-2 w-full rounded-lg text-sm text-black hover:bg-slate-200 cursor-pointer ${selectedChannel.channelId === c.channelId ? "bg-slate-200" : ""}`}>{c.name}</ul>
              </div>
            ))}
          </div>
          <PrimaryButton onClick={handleSubmit}>Submit</PrimaryButton>
        </div>
      )}
    </div>
  );
};
