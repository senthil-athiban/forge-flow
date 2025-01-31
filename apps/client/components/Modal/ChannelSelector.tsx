"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUser } from "@/utils/auth";
import DiscordService from "@/services/integrations/discord.service";
import EmailSelector from "../Actions/Email";
import SolSelector from "../Actions/Sol";
import SlackSelector from "../Actions/Slack";
import PrimaryButton from "../Button/PrimaryButton";
import DiscordSelector from "../Actions/Discord";

interface ChannelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "trigger" | "action";
  availableItems: any;
  onSelect: any;
  selectedItemIndex: number | null;
}
const ChannelSelector = ({
  isOpen,
  onClose,
  type,
  availableItems,
  onSelect,
  selectedItemIndex,
}: ChannelSelectorProps) => {
  const [selectedAction, setSelectedAction] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });

  const [showChannelSelector, setShowChannelSelector] = useState(false);
  const [showDiscordChannels, setShowDiscordChannels] = useState(false);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  if (!isOpen) return;
  const isTrigger = selectedItemIndex === 1;

  const handleData = (metadata: any) => {
    onSelect({ ...selectedAction, metadata });
    onClose();
  };
  const state = btoa(JSON.stringify({ userId: user.id }));

  const handleSlackIntegration = async () => {
    const slackUrl = `https://slack.com/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}&scope=channels:join,channels:read,chat:write&state=${state}`;
    window.open(slackUrl, "_blank", "noopener,noreferrer,width=600,height=700");
  };

  const handleDiscordIntegration = async () => {
    try {
      const response = await DiscordService.add();
      const { redirectUrl } = response;
      const url = `${redirectUrl}&state=${state}`;
      window.open(url, "_blank", "noopener,noreferrer,width=600,height=700");
    } catch (error) {
      console.error("Discord integration error:", error);
    }
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
                    case "discord":
                      return showDiscordChannels ? (
                        <DiscordSelector
                          setMetadata={(metadata: any) => handleData(metadata)}
                        />
                      ) : (
                        <div className="flex flex-col gap-y-2">
                          <PrimaryButton onClick={handleDiscordIntegration}>
                            Add discord
                          </PrimaryButton>
                          <PrimaryButton
                            onClick={() => setShowDiscordChannels(true)}
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
export default ChannelSelector;