"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLanguageStore();

  useEffect(() => {
    // Initialize i18n with current language
    const currentLang = language || "en";
    i18n.changeLanguage(currentLang);
    setLanguage(currentLang);
  }, []);

  useEffect(() => {
    // Sync i18n when language changes
    i18n.changeLanguage(language);
  }, [language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

