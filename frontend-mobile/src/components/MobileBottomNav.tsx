"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function MobileBottomNav({
  locale,
}: {
  locale: string;
}) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const items = [
    { key: "explore", label: t("explore"), icon: "explore", href: "/home" },
    { key: "map", label: t("map"), icon: "map", href: "/map" },
    { key: "chat", label: t("chat"), icon: "auto_awesome", href: "/ai-chat", highlight: true },
    { key: "saved", label: t("saved"), icon: "bookmark", href: "/saved" },
    { key: "profile", label: t("profile"), icon: "person", href: "/profile" },
  ];

  return (
    <nav className="rounded-[28px] border border-[#ece4d6] bg-white/96 px-3 py-2 shadow-[0_-8px_25px_rgba(38,28,10,0.08)]">
      <div className="grid grid-cols-5 items-end gap-1">
        {items.map((item) => {
          const active = pathname.startsWith(`/${locale}${item.href}`);

          if (item.highlight) {
            return (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                className="flex flex-col items-center gap-1 -mt-8"
              >
                <span className="mobile-pill mobile-button-gold h-14 w-14 shadow-[0_12px_26px_rgba(178,122,0,0.35)]">
                  <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#c8b28c]">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className="flex flex-col items-center gap-1 rounded-2xl py-2 text-center transition hover:bg-[#faf7f1]"
            >
              <span className={`material-symbols-outlined text-[20px] ${active ? "text-[#b27a00]" : "text-[#c4c0b6]"}`}>
                {item.icon}
              </span>
              <span className={`text-[9px] font-extrabold uppercase tracking-[0.14em] ${active ? "text-[#b27a00]" : "text-[#c8b28c]"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
