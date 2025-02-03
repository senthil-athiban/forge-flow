"use client";
import React from "react";

interface CardProps {
  title: string;
  metric: number;
  icon: any;
  change?: string;
  subMetric?: string;
  trend: 'up' | 'down'
}

const Card = ({ title, metric, icon, change, subMetric, trend }: CardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <h3 className="text-sm font-medium uppercase tracking-wide text-slate-500">
            {title}
          </h3>
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-slate-900">
              {metric}
            </p>
            {/* {subMetric && <p className="text-sm text-slate-600">{subMetric}</p>} */}
          </div>
          {change && (
            <p className={`
              flex items-center text-xs
              ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}
            `}>
              {change}
            </p>
          )}
        </div>

        <div className="rounded-lg bg-slate-50 p-3 transition-colors group-hover:bg-slate-100">
          {icon}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
};

export default Card;
