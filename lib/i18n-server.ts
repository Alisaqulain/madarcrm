/**
 * Server-side i18n utilities for API routes
 */

export type SupportedLanguage = 'en' | 'hi' | 'ur';

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'hi', 'ur'];

/**
 * Get language from request headers or query params
 */
export function getLanguageFromRequest(
  headers: Headers | Record<string, string | string[] | undefined>,
  searchParams?: URLSearchParams | Record<string, string | string[] | undefined>
): SupportedLanguage {
  // Check query parameter first
  if (searchParams) {
    const langParam = searchParams instanceof URLSearchParams
      ? searchParams.get('lang')
      : (Array.isArray(searchParams.lang) ? searchParams.lang[0] : searchParams.lang);
    
    if (langParam && SUPPORTED_LANGUAGES.includes(langParam as SupportedLanguage)) {
      return langParam as SupportedLanguage;
    }
  }

  // Check Accept-Language header
  const acceptLanguage = headers instanceof Headers
    ? headers.get('accept-language')
    : (Array.isArray(headers['accept-language']) ? headers['accept-language'][0] : headers['accept-language']);

  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim().toLowerCase());
    
    for (const lang of languages) {
      if (lang.startsWith('en')) return 'en';
      if (lang.startsWith('hi')) return 'hi';
      if (lang.startsWith('ur')) return 'ur';
    }
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Get multi-language field value based on language preference
 */
export function getLocalizedValue<T extends { en: string; hi: string; ur: string }>(
  field: T,
  lang: SupportedLanguage
): string {
  return field[lang] || field.en || field.hi || field.ur || '';
}

/**
 * Check if language is RTL
 */
export function isRTL(lang: SupportedLanguage): boolean {
  return lang === 'ur';
}

/**
 * Format response with language support
 */
export function formatResponse<T>(
  data: T,
  lang: SupportedLanguage,
  message?: string
) {
  return {
    success: true,
    data,
    lang,
    rtl: isRTL(lang),
    message,
  };
}

