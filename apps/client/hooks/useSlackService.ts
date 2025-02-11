"use client";
import SlackService from "@/services/integrations/slack.service";
import { useEffect, useState } from "react";

export const useSlackService = () => {
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  useEffect(() => {
    const fetchChannels = async () => {
      setIsLoading(true);
      try {
        const res = await SlackService.getChannels();
        const channels = res.channels.flatMap((c: any) => c.channels);
        setChannels(channels);
      } catch (error) {
        console.error("Error in fetching slack channels : ", error);
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
