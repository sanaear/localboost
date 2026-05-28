"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "@/types/admin";

const navLinks: NavLink[] = [
  { id: "dashboard", path: "/en/admin", label: "Dashboard", icon: "dashboard" },
  { id: "businesses", path: "/en/admin/businesses", label: "Businesses", icon: "storefront" },
  { id: "reviews", path: "/en/admin/reviews", label: "Reviews", icon: "rate_review" },
  { id: "users", path: "/en/admin/users", label: "Users", icon: "group" },
  { id: "categories", path: "/en/admin/categories", label: "Categories", icon: "category" },
  { id: "analytics", path: "/en/admin/analytics", label: "Analytics", icon: "analytics" },
  { id: "settings", path: "#", label: "Settings", icon: "settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1A1A2E] flex flex-col h-full py-6 z-50 shadow-2xl">
      <div className="px-6 mb-10">
        <h1 className="text-2xl font-black text-[#EBA020] font-headline">LocalBoost</h1>
        <p className="text-slate-400 text-xs tracking-widest uppercase mt-1">
          Admin Portal
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.id}
              href={link.path}
              className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-[#EBA020]/10 text-[#EBA020] border-r-4 border-[#EBA020] font-bold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="font-['Plus_Jakarta_Sans'] text-sm tracking-wide">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <button className="w-full py-3 px-4 bg-[#EBA020] text-[#291800] font-bold rounded-lg active:scale-95 duration-150 transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">download</span>
          Export Data
        </button>
      </div>
    </aside>
  );
}
