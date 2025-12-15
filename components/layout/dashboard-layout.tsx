"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { useLanguageStore } from "@/store/language-store";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isRTL } = useLanguageStore();

  return (
    <div className="flex h-screen overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

