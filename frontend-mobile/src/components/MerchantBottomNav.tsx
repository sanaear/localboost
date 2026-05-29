"use client";

import Link from "next/link";

const items = [
  { label: "Progress", icon: "dashboard", href: "/merchant/setup/business" },
  { label: "Identity", icon: "storefront", href: "/merchant/setup/business" },
  { label: "Atmosphere", icon: "photo_library", href: "/merchant/setup/photos" },
  { label: "Submit", icon: "send", href: "/merchant/setup/contact" },
];

export default function MerchantBottomNav({
  activeIndex,
  locale,
}: {
  activeIndex: number;
  locale: string;
}) {
  return (
    <nav className="border-t border-[#eee6da] bg-white/96 px-2 py-2">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item, index) => {
          const active = activeIndex === index;

          return (
            <Link
              key={item.label}
              href={`/${locale}${item.href}`}
              className="flex flex-col items-center gap-1 rounded-2xl py-2"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  active ? "text-[#e5a321]" : "text-[#c9c5bc]"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[8px] font-extrabold uppercase tracking-[0.14em] ${
                  active ? "text-[#c08a12]" : "text-[#cec7bc]"
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
