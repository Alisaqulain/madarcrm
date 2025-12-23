"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language-store";
import {
  LayoutDashboard,
  UserPlus,
  DollarSign,
  BookOpen,
  FileText,
  Printer,
  ChevronRight,
  Circle,
  X,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "admissionRegister",
    icon: UserPlus,
    href: "/student/list",
    children: [
      { title: "add", href: "/student/add" },
      { title: "list", href: "/student/list" },
    ],
  },
  {
    title: "studentFees",
    icon: DollarSign,
    href: "/fees/monthly",
  },
  {
    title: "examsResults",
    icon: BookOpen,
    href: "/exams",
    children: [
      { title: "examResults", href: "/exams" },
      { title: "examSheetPrint", href: "/exams/print-sheet" },
      { title: "examSignaturePrint", href: "/exams/print-signature" },
    ],
  },
  {
    title: "bookDistribution",
    icon: FileText,
    href: "/books",
    children: [
      { title: "bookInventory", href: "/books" },
      { title: "manageBooks", href: "/books/manage" },
      { title: "bookIssueReturn", href: "/books/issue-return" },
    ],
  },
  {
    title: "kitchenManagement",
    icon: Utensils,
    href: "/kitchen",
    children: [
      { title: "kitchenDashboard", href: "/kitchen" },
      { title: "manageKitchen", href: "/kitchen/manage" },
      { title: "stockIn", href: "/kitchen/stock-in" },
      { title: "dailyConsumption", href: "/kitchen/consumption" },
      { title: "kitchenIssueReturn", href: "/kitchen/issue-return" },
    ],
  },
  {
    title: "printReport",
    icon: Printer,
    href: "/reports",
    children: [
      { title: "generalListPrint", href: "/reports/general" },
      { title: "printIdCard", href: "/reports/id-card" },
      { title: "printLibraryCard", href: "/reports/library-card" },
      { title: "printLiuCard", href: "/reports/liu-card" },
      { title: "addressPrint", href: "/reports/address-print" },
      { title: "attendanceRegister", href: "/reports/attendance-register" },
      { title: "attendanceDaily", href: "/attendance/daily" },
      { title: "submitPlan", href: "/reports/submit-plan" },
    ],
  },
];

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:bg-gray-800 lg:text-white">
        {/* Logo Section */}
        <div className="flex items-center gap-3 border-b border-gray-700 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <span className="text-lg font-bold">NET</span>
            </div>
          <div>
            <h2 className="text-lg font-semibold">{t("common.appName")}</h2>
            <p className="text-xs text-gray-400">8273074473</p>
          </div>
        </div>

        {/* Year Selector */}
        <div className="border-b border-gray-700 p-4">
          <select className="w-full rounded bg-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>2023-24</option>
            <option>2024-25</option>
          </select>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const hasChildren = item.children && item.children.length > 0;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{t(`nav.${item.title}`)}</span>
                    {hasChildren && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Link>
                  {hasChildren && isActive && (
                    <ul className="mt-1 space-y-1 pl-8">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                              pathname === child.href
                                ? "bg-blue-600 text-white"
                                : "text-gray-400 hover:bg-gray-700 hover:text-white"
                            )}
                          >
                            <Circle className="h-2 w-2 fill-current" />
                            <span>{t(`nav.${child.title}`)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-800 text-white transition-transform duration-300 ease-in-out lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section with Close Button */}
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <span className="text-lg font-bold">NET</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t("common.appName")}</h2>
              <p className="text-xs text-gray-400">8273074473</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Year Selector */}
        <div className="border-b border-gray-700 p-4">
          <select className="w-full rounded bg-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>2023-24</option>
            <option>2024-25</option>
          </select>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const hasChildren = item.children && item.children.length > 0;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{t(`nav.${item.title}`)}</span>
                    {hasChildren && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Link>
                  {hasChildren && isActive && (
                    <ul className="mt-1 space-y-1 pl-8">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={handleLinkClick}
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                              pathname === child.href
                                ? "bg-blue-600 text-white"
                                : "text-gray-400 hover:bg-gray-700 hover:text-white"
                            )}
                          >
                            <Circle className="h-2 w-2 fill-current" />
                            <span>{t(`nav.${child.title}`)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

