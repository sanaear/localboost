"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    label: "Dashboard",
    icon: "dashboard",
    href: "/merchant/dashboard",
    matchPrefixes: ["/merchant/dashboard"],
  },
  {
    label: "Profile",
    icon: "person",
    href: "/merchant/photo-manager",
    matchPrefixes: ["/merchant/photo-manager", "/merchant/edit-profile"],
  },
  {
    label: "AI Tools",
    icon: "auto_awesome",
    href: "/merchant/generate-ai",
    matchPrefixes: ["/merchant/generate-ai"],
  },
  {
    label: "Reviews",
    icon: "rate_review",
    href: "/merchant/reviews",
    matchPrefixes: ["/merchant/reviews", "/merchant/updates"],
  },
  {
    label: "Stats",
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
              key={item.label}
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
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
