"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/store/language-store";
import { useAuthStore } from "@/store/auth-store";
import { Camera, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { language, setLanguage } = useLanguageStore();
  const { username, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-gray-800 px-3 sm:px-4 md:px-6 text-white">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-white hover:bg-gray-700"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg sm:text-xl font-semibold truncate">{t("common.appName")}</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
        {/* Student Photo */}
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 sm:gap-2 text-white hover:bg-gray-700 p-2 sm:px-3"
        >
          <Camera className="h-4 w-4" />
          <span className="hidden sm:inline">{t("common.studentPhoto")}</span>
        </Button>

        {/* Teacher Photo */}
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 sm:gap-2 text-white hover:bg-gray-700 p-2 sm:px-3"
        >
          <Camera className="h-4 w-4" />
          <span className="hidden sm:inline">{t("common.teacherPhoto")}</span>
        </Button>

        {/* User Info */}
        {username && (
          <span className="hidden md:inline text-sm">{username}</span>
        )}

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-1 sm:gap-2 text-white hover:bg-gray-700 p-2 sm:px-3"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{t("login.logout") || "Logout"}</span>
        </Button>

        {/* Language Switcher */}
        <Select
          value={language}
          onValueChange={(value) => setLanguage(value as "en" | "hi" | "ur")}
        >
          <SelectTrigger className="w-24 sm:w-32 bg-gray-700 text-white text-xs sm:text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="hi">हिंदी</SelectItem>
            <SelectItem value="ur">اردو</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

