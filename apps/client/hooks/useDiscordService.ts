"use client";

import { useEffect, useState } from "react";
import DiscordService from "@/services/integrations/discord.service";

export const useDiscordService = () => {
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  useEffect(() => {
    const fetchChannels = async () => {
      setIsLoading(true);
      try {
        const res = await DiscordService.getChannels();
        const channels = res.channels.flatMap((c: any) => c.channels);
        setChannels(channels);
      } catch (error) {
        console.error("Error in fetching discord channels : ", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChannels();
  }, []);

  return {
    channels,
    isLoading,
    error,
  };
};
