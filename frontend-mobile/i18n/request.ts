import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { isLocale } from "../src/lib/locales";

export default getRequestConfig(async ({ requestLocale }) => {
  const resolvedLocale = await requestLocale;
  if (!isLocale(resolvedLocale)) notFound();

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
    timeZone: "UTC",
    now: new Date(),
  } as any;
});
