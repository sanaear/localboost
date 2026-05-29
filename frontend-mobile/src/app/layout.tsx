import type { Metadata } from "next";
import { headers } from "next/headers";
import { isRtlLocale } from "@/lib/locales";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalBoost Mobile",
  description: "Mobile-first tourist experience for LocalBoost",
  manifest: "/manifest.json",
  themeColor: "#a36e00",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await headers()).get("x-next-intl-locale") ?? "en";
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";
  const themeScript = `(() => {
  try {
    const value = localStorage.getItem("lb:theme");
    const theme = value === "dark" || value === "light" ? value : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {}
})();`;

  return (
    <html lang={locale} dir={dir}>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
