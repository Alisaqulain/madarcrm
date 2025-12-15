"use client";

import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language-store";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Topbar() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-gray-800 px-6 text-white">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Jamia Anwaria</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Student Photo */}
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-white hover:bg-gray-700"
        >
          <Camera className="h-4 w-4" />
          <span className="hidden md:inline">{t("common.studentPhoto")}</span>
        </Button>

        {/* Teacher Photo */}
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-white hover:bg-gray-700"
        >
          <Camera className="h-4 w-4" />
          <span className="hidden md:inline">{t("common.teacherPhoto")}</span>
        </Button>

        {/* User ID */}
        <span className="hidden md:inline">8273074473</span>

        {/* Language Switcher */}
        <Select
          value={language}
          onValueChange={(value) => setLanguage(value as "en" | "hi" | "ur")}
        >
          <SelectTrigger className="w-32 bg-gray-700 text-white">
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

