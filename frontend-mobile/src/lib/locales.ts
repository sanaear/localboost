export const locales = ['en', 'fr', 'es', 'ar'] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getLocaleFromPathname(pathname: string): Locale | undefined {
  const match = pathname.match(/^\/(en|fr|es|ar)(\/|$)/);
  const candidate = match?.[1];
  if (!candidate) return undefined;
  return isLocale(candidate) ? candidate : undefined;
}

export function isRtlLocale(locale: string) {
  return locale === 'ar';
}
