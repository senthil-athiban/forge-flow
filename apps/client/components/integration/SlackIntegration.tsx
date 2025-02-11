"use client";
import React from "react";
import { Check, Plus, AlertCircle, Loader2, Slack } from "lucide-react";
import { useSlackService } from "@/hooks/useSlackService";
import { Button } from "@/components/ui/button";

interface SlackIntegrationProps {
  onAddSlack: () => void;
  onSelectChannel: () => void;
}

export const SlackIntegration = ({
  onAddSlack,
  onSelectChannel,
}: SlackIntegrationProps) => {
  const { isLoading, error, channels } = useSlackService();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const hasExistingIntegration = !!channels?.length;

  return (
    <div className="space-y-4 p-2">
      <div className="p-4 border shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Slack />
            <div>
              <h3 className="font-medium">Slack Integration</h3>
              <p className="text-sm text-gray-500">
                {hasExistingIntegration
                  ? "Your Slack workspace is connected"
                  : "Connect your Slack workspace"}
              </p>
            </div>
          </div>
          {hasExistingIntegration ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onAddSlack}
              className="space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Connect</span>
            </Button>
          )}
        </div>
      </div>

      {hasExistingIntegration && (
        <div className="flex flex-col items-center justify-center gap-y-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={onSelectChannel}
          >
            Continue to Channel Selection
          </Button>
          <p>OR</p>
          <Button variant="primary" className="w-full" onClick={onAddSlack}>
            Add another workspace
          </Button>
        </div>
      )}

      {!hasExistingIntegration && (
        <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
          <AlertCircle className="w-4 h-4" />
          <p>Please connect your Slack workspace first</p>
        </div>
      )}
    </div>
  );
};
