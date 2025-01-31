"use client";
import DiscordService from "@/services/integrations/discord.service";
import { useEffect, useState } from "react";
import PrimaryButton from "../Button/PrimaryButton";

const DiscordSelector = ({ setMetadata }: any) => {
  const [selectedChannel, setSelectedChannel] = useState<{
    channelId: string;
    name: string;
  }>({ channelId: "", name: "" });
  const [channels, setChannels] = useState([]);
  const handleSubmit = () => {
    setMetadata({ channelId: selectedChannel.channelId });
  };

  useEffect(() => {
    const fetchChannels = async () => {
      const res = await DiscordService.getChannels();
      const channels = res.channels.flatMap((c: any) => c.channels);
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
                onClick={() =>
                  setSelectedChannel({
                    channelId: c.channelId,
                    name: c.channelName,
                  })
                }
              >
                <ul
                  className={`border p-2 my-2 w-full rounded-lg text-sm text-black hover:bg-slate-200 cursor-pointer ${selectedChannel.channelId === c.channelId ? "bg-slate-200" : ""}`}
                >
                  {c.channelName}
                </ul>
              </div>
            ))}
          </div>
          <PrimaryButton onClick={handleSubmit}>Submit</PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default DiscordSelector;
