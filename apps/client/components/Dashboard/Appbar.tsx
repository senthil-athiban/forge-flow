import React from 'react';
import { Bell, ChevronDown, CircleUser, Search, Workflow } from 'lucide-react';

const Appbar = () => {
  return (
    <div className="sticky top-0 z-50 bg-slate-100 border-b mt-2 mx-2 rounded-lg">
      <div className="mx-auto max-w-8xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-x-4">
          <Workflow size={24} className="text-indigo-600" />
          <h2 className="text-xl font-bold text-indigo-600">FlowForge</h2>
          </div>

          <div className="flex items-center gap-x-4">
            <button className="relative p-2 text-gray-600 hover:text-indigo-600">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <button className="flex items-center gap-x-2 rounded-full border px-3 py-1.5 hover:bg-gray-50">
              <CircleUser size={20} className="text-gray-600" />
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appbar;