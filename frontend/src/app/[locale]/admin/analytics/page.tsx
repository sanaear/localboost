"use client";

import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import DauChart from "@/components/admin/analytics/DauChart";
import SearchHeatmap from "@/components/admin/analytics/SearchHeatmap";
import ApiBudgetMonitor from "@/components/admin/analytics/ApiBudgetMonitor";
import TopBusinessesRanking from "@/components/admin/analytics/TopBusinessesRanking";
import LanguageDistribution from "@/components/admin/analytics/LanguageDistribution";

export default function AnalyticsPage() {
  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-container">
      <Sidebar />
      <main className="ml-64 min-h-screen relative overflow-hidden">
        <Header />
        <div className="p-10 max-w-7xl mx-auto space-y-10 relative">
          <div className="maghrib-grid absolute inset-0 -z-10 pointer-events-none"></div>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
                Ecosystem Analytics
              </h2>
              <p className="text-on-surface-variant mt-2">
                Real-time performance metrics across the LocalBoost platform for the 2030 World Cup readiness.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-surface-container-low px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                Last 30 Days
              </div>
            </div>
          </div>
          <DauChart />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <SearchHeatmap />
            <ApiBudgetMonitor />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TopBusinessesRanking />
            <LanguageDistribution />
          </div>
        </div>
      </main>
    </div>
  );
}
