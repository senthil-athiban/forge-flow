"use client";

import { Activity, AlertTriangle, History, Workflow } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import Card from "./Card";

const Widget = ({ zapData }: { zapData: any }) => {
  const latestZap = zapData.latestZap?.updatedAt;
  const latestZapRun = zapData.latestZapRun?.updatedAt;
  
  const getTimeDistance = (date: Date | null) => {
    if (!date) return 'No activity';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  const calculateRate = (success: number, total: number) => {
    if(!total) return 0;
    return Math.round((success/total) * 100) || 0
  }
  
  const successRuns = zapData?.successZapRun || 0;
  const failedRuns = zapData?.failedZapRun || 0;
  const totalRuns = zapData?.zapRunMetrics || 0;
  const successRate = calculateRate(successRuns, totalRuns);
  const failureRate = calculateRate(failedRuns, totalRuns);
  
  const statictics = [
    {
      title: "Total Workflows",
      metric: zapData?.zaps?.length,
      subMetric: "12 active",
      icon: <Workflow className="text-indigo-600" />,
      change: `Last created ${getTimeDistance(latestZap)}`,
      trend: "up",
    },
    {
      title: "Total Executions",
      metric: totalRuns,
      subMetric: "Last 24 hours",
      icon: <History className="text-yellow-400" />,
      change: `Last created ${getTimeDistance(latestZapRun)}`,
      trend: "up",
    },
    {
      title: "Run Statitics",
      metric: zapData?.successZapRun,
      subMetric: "98% Success Rate",
      icon: <Activity className="text-green-600" />,
      change: totalRuns ? `${successRuns} of ${totalRuns} runs` : "No runs yet",
      trend: successRate >= totalRuns/2 ? "up" : "down",
    },
    {
      title: "Failed Runs",
      metric: zapData?.failedZapRun,
      subMetric: "This week",
      icon: <AlertTriangle className="text-red-600" />,
      change: totalRuns ? `${failedRuns} of ${totalRuns} runs` : "No runs yet",
      trend: failureRate <= totalRuns/2 ? "up" : "down",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-2 px-3 py-1">
      {statictics?.map((stat) => (
        <Card
          title={stat.title}
          icon={stat.icon}
          metric={stat.metric}
          key={stat.title}
          subMetric={stat.subMetric}
          trend={stat.trend as "up" | "down"}
          change={stat.change}
        />
      ))}
    </div>
  );
};

export default Widget;
