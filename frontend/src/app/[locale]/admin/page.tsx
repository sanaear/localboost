"use client";

import Sidebar from "@/components/admin/Sidebar";
import KPICards from "@/components/admin/dashboard/KPICards";
import RegistrationTrends from "@/components/admin/dashboard/RegistrationTrends";
import BusinessesByCity from "@/components/admin/dashboard/BusinessesByCity";
import RecentActivity from "@/components/admin/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="bg-background font-body text-on-surface">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-40 flex justify-between items-center px-10 py-5 w-full shadow-sm" style={{ background: "rgba(249, 249, 247, 0.8)", backdropFilter: "blur(24px)" }}>
          <div>
            <h2 className="text-xl font-bold text-[#825500] font-headline">LocalBoost Admin</h2>
            <p className="text-on-surface-variant text-xs">Welcome back, Administrator</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-600 hover:bg-surface-container-low rounded-full transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full"></span>
              </button>
              <button className="p-2 text-slate-600 hover:bg-surface-container-low rounded-full transition-colors">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/30"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-on-surface leading-none">Karim Al-Fassi</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                  Super Admin
                </p>
              </div>
              <img
                alt="Admin Profile Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-container"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkTt_Gimju8nwPlnqDt_ZAQ5t8ToFqLjrwpybFOvhCiyyAIYU4dSWU7ZrMGDNZM7MaH60PSMDqbLDQoHTYpT6sEkEIHKQjmAaQTGtMHznw-uvbmJ0U_nBJyhROKS8-6AbICd7SCrwUQGIU4HZ_9XPQe-kuzJNZC2ubUKNvQqvuB8V_0jcoPHkuqf7gu7SzOCq4QwkWPxG9hCtHlUxRnqQ08TsnPWV-74MC_9CVwt7aUIlaVsqnRJH0pNCsl513_wUutdzlLzBK0Ck"
              />
            </div>
          </div>
        </header>

        <div className="p-10 space-y-12">
          <KPICards />

          <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
            <div className="space-y-8">
              <RegistrationTrends />
              <BusinessesByCity />
            </div>
            <div className="space-y-8">
              <RecentActivity />
              <div className="h-48 rounded-xl bg-surface-container-high relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB1AT5HfIxMBsx96de21DJxUhErvLLKFIr4bZMBPE8kdi7HyVMm7NpYGJZ_vcwFgfeIkZmTUsLQlbefc3Mm32xX_6Evn5wLlhXeV2ZSUdllsoQESNQOiYo6v_iy3eb619MnLudAEetXQIUy8vH-0DJYK-QY_5enL9eva4MSm1m2k_NZ_3HBxsyDcPtHSblE6LvvS-KSQtVt8Hh8ocdYdBjOQ_f_7pZgGO2W7r9IJrltvg2V6nl2KA4UZuWrF5eR5NE6Y-PuU6GgYk4')" }}></div>
                <div className="relative text-center p-6">
                  <span className="material-symbols-outlined text-4xl text-primary/30 mb-2">auto_awesome</span>
                  <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">
                    Digital Riad Infrastructure
                  </p>
                  <p className="text-[10px] text-on-surface-variant/40 mt-1">
                    Optimized for 2030 World Cup Peak Loads
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
