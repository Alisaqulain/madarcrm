/**
 * API client utility with language support
 */

import { useLanguageStore } from "@/store/language-store";

/**
 * Get API URL with language parameter
 */
export function getApiUrl(url: string, includeLang: boolean = true): string {
  if (!includeLang) return url;
  
  const language = useLanguageStore.getState().language;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}lang=${language}`;
}

/**
 * Fetch with language support
 */
export async function fetchWithLang(url: string, options?: RequestInit): Promise<Response> {
  const language = useLanguageStore.getState().language;
  const urlWithLang = getApiUrl(url);
  
  return fetch(urlWithLang, {
    ...options,
    headers: {
      ...options?.headers,
      'Accept-Language': language,
    },
  });
}



