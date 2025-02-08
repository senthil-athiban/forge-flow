"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgePlus,
  ChevronDown,
  ChevronLeft,
  CircleUser,
  Home,
  LogOut,
  LucideIcon,
  Rocket,
  Workflow,
} from "lucide-react";
import { getUser, logout } from "@/utils/auth";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: any;
}
const Sidebar = ({isCollapsed, setIsCollapsed}:SidebarProps) => {
  
  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-64"} fixed bg-slate-100 top-0 left-0 z-30 h-screen transition-all duration-300 ease-in-out`}
    >
      <div className="h-full flex flex-col">
        <SidebarMenu isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
    </div>
  );
};

export default Sidebar;

interface SideBarMenuProps {
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    isCollapsed: boolean;
}
const SidebarMenu = ({ isCollapsed , setIsCollapsed}: SideBarMenuProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setUser(res);
      } catch (error) {
        console.log('Error in fetching user : ', error);
      }
    }
    fetchUser();
  },[]);
  
  const routes = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Dashboard",
    },
    {
      href: "/zap/create",
      icon: BadgePlus,
      label: "Create Workflow",
    },
    {
      href: "/zap/execution",
      icon: Rocket,
      label: "Executions",
    },
    {
      href: "/login",
      icon: LogOut,
      label: "Logout",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 relative">
        <div className="flex items-center gap-x-3">
          <div className="p-2 rounded-xl bg-indigo-50">
            <Workflow size={24} className="text-indigo-600" />
          </div>
          {!isCollapsed && (
            <h3 className="text-xl font-semibold text-slate-800">FlowForge</h3>
          )}
          <button
            onClick={() => setIsCollapsed(p => !p)}
            className="absolute -right-4 top-3/4 -translate-y-1/2
        h-8 w-8 rounded-full border border-slate-200 bg-white
        flex items-center justify-center
        hover:border-slate-300 hover:bg-slate-50
        transition-all duration-300 shadow-sm"
          >
            <ChevronLeft
              size={16}
              className={`text-slate-600 transition-trasnform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="flex-1 py-6 px-2">
        <div className="space-y-1">
          {routes.map((route) => (
            <SidebarItems
              key={route.href}
              href={route.href}
              label={route.label}
              icon={route.icon}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="p-1.5 rounded-full bg-indigo-50">
            <CircleUser size={20} className="text-indigo-600" />
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

interface SideBarItemsProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isCollapsed: boolean;
}

const SidebarItems = ({
  href,
  label,
  icon: Icon,
  isCollapsed,
}: SideBarItemsProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const isActive = pathName.includes(href);
  const handleNavigation = () => {
    if(href === "/login") {
        logout();
        return;
    }
    router.push(href);
  }
  return (
    <button
      onClick={handleNavigation}
      className={`flex items-center  gap-x-3 p-2.5 rounded-lg transition-all duration-200 ${isActive ? "bg-indigo-100 text-indigo-600" : "text-slate-600 hover:bg-indigo-100 hover:text-indigo-600"} ${!isCollapsed ? "w-full" : ""}`}
    >
      <div className={`flex items-center  p-1.5 rounded-lg ${isActive ? "bg-indigo-100" : ""}`}>
        <Icon size={16} />
      </div>
      {!isCollapsed && <span className="text-xs font-medium">{label}</span>}
    </button>
  );
};
