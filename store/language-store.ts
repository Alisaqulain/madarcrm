import { create } from "zustand";

interface LanguageState {
  language: "en" | "hi" | "ur";
  setLanguage: (lang: "en" | "hi" | "ur") => void;
  isRTL: boolean;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "en",
  isRTL: false,
  setLanguage: (lang) => {
    set({ language: lang, isRTL: lang === "ur" });
    if (typeof window !== "undefined") {
      document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
    }
  },
}));

