import type { Metadata } from "next";
import { headers } from "next/headers";
import { isRtlLocale } from "@/lib/locales";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalBoost Mobile",
  description: "Mobile-first tourist experience for LocalBoost",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await headers()).get("x-next-intl-locale") ?? "en";
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
