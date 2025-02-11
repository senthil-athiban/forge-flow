"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSlackService } from "@/hooks/useSlackService";

interface SlackSelectorProps {
  setMetadata: (metadata: any) => void;
  onClose: () => void;
}
const SlackSelector = ({ setMetadata, onClose }: SlackSelectorProps) => {
  const { isLoading, error, channels, } = useSlackService();
  const [selectedChannel, setSelectedChannel] = useState<{
    channelId: string;
    name: string;
  }>({ channelId: "", name: "" });
  
  const handleSubmit = () => {
    setMetadata({ channelId: selectedChannel.channelId });
    onClose();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

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
                <ul
                  className={`border p-2 my-2 w-full rounded-lg text-sm text-black hover:bg-indigo-300 hover:text-gray-800 cursor-pointer ${selectedChannel.channelId === c.channelId ? "bg-indigo-300" : ""}`}
                >
                  {c.name}
                </ul>
              </div>
            ))}
          </div>
          <Button variant={"primary"} onClick={handleSubmit}>Submit</Button>
        </div>
      )}
    </div>
  );
};

export default SlackSelector;
