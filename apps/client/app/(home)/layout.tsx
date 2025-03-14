"use client";
import { useState } from "react";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Sidebar from "@/components/Dashboard/Sidebar";
import { NO_SIDEBAR_ROUTES } from "../config";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const shouldHideSidebar = NO_SIDEBAR_ROUTES.includes(pathname);
  return (
    <ProtectedRoute>
      <Toaster />
      <div className="flex bg-slate-100 h-screen overflow-hidden">
        {!shouldHideSidebar && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
        <main
          className={`flex-1 overflow-y-auto min-h-screen transition-all duration-300 border bg-indigo-50 rounded-lg mt-2 ${isCollapsed ? "ml-16" : "ml-64"}`}
        >
          <div className="pl-0 p-4 m-2 rounded-lg bg-indigo-50 min-h-[calc(100vh-2rem)]">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
