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
      metric: zapData?.zapRunMetrics,
      subMetric: "Last 24 hours",
      icon: <History className="text-yellow-400" />,
      change: `Last created ${getTimeDistance(latestZapRun)}`,
      trend: "up",
    },
    {
      title: "Run Statitics",
      metric: 11,
      subMetric: "98% Success Rate",
      icon: <Activity className="text-green-600" />,
      change: "↑ 5% improvement",
      trend: "up",
    },
    {
      title: "Failed Runs",
      metric: 0,
      subMetric: "This week",
      icon: <AlertTriangle className="text-red-600" />,
      change: "-5% vs last week",
      trend: "down",
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
