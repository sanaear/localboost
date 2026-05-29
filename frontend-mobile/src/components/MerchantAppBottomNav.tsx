"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const items = [
  {
    labelKey: "dashboard",
    icon: "dashboard",
    href: "/merchant/dashboard",
    matchPrefixes: ["/merchant/dashboard"],
  },
  {
    labelKey: "profile",
    icon: "person",
    href: "/merchant/photo-manager",
    matchPrefixes: ["/merchant/photo-manager", "/merchant/edit-profile"],
  },
  {
    labelKey: "aiTools",
    icon: "auto_awesome",
    href: "/merchant/generate-ai",
    matchPrefixes: ["/merchant/generate-ai"],
  },
  {
    labelKey: "reviews",
    icon: "rate_review",
    href: "/merchant/reviews",
    matchPrefixes: ["/merchant/reviews", "/merchant/updates"],
  },
  {
    labelKey: "stats",
    icon: "bar_chart",
    href: "/merchant/stats",
    matchPrefixes: ["/merchant/stats"],
  },
];

export default function MerchantAppBottomNav({
  locale,
}: {
  locale: string;
}) {
  const t = useTranslations("merchantNav");
  const pathname = usePathname();

  return (
    <nav className="border-t border-[#eee6da] bg-white/96 px-2 py-2">
      <div className="grid grid-cols-5 items-end gap-1">
        {items.map((item) => {
          const active = item.matchPrefixes.some((prefix) =>
            pathname.startsWith(`/${locale}${prefix}`),
          );

          return (
            <Link
              key={item.labelKey}
              href={`/${locale}${item.href}`}
              className={`flex flex-col items-center gap-1 rounded-[18px] px-1 py-2 text-center transition ${
                active ? "bg-[#f5efe3]" : "hover:bg-[#faf7f1]"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[19px] ${
                  active ? "text-[#b27a00]" : "text-[#c4c0b6]"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[8px] font-extrabold uppercase tracking-[0.14em] ${
                  active ? "text-[#b27a00]" : "text-[#c8b28c]"
                }`}
              >
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
