"use client";
import { Activity, AlertTriangle, History, Workflow } from "lucide-react";
import React from "react";
import Card from "./Card";

const Widget = ({ zapData }: { zapData: any }) => {
  console.log("zapData: ", zapData);
  const statictics = [
    {
      title: "Total Workflows",
      metric: zapData?.zaps?.length,
      subMetric: "12 active",
      icon: <Workflow className="text-indigo-600" />,
      change: "Last created 2h ago",
      trend: "up",
    },
    {
      title: "Total Executions",
      metric: zapData?.zapRunMetrics,
      subMetric: "Last 24 hours",
      icon: <History className="text-yellow-400" />,
      change: "Last run 5m ago",
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
