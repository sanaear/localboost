"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MerchantAppBottomNav from "@/components/MerchantAppBottomNav";
import { ErrorState } from "@/components/UiState";
import { API_BASE_URL } from "@/lib/api";
import { getMerchantIdentity } from "@/lib/merchant";

export default function MerchantStatsPage({
  params,
}: {
  params: { locale: string };
}) {
  const identity = useMemo(() => getMerchantIdentity(), []);
  const [selectedRange, setSelectedRange] = useState("30d");
  const [reportExpanded, setReportExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [summary, setSummary] = useState<{
    totalViews: number;
    totalClicks: number;
    viewsActivity: number[];
    clicksByDay: number[];
    bucketLabels: string[];
    viewsByBusiness: Array<{ business_id: number; name: string; count: number }>;
  } | null>(null);

  const ranges = useMemo(() => ["7d", "30d", "90d", "Custom"], []);
  const days = useMemo(() => {
    if (selectedRange === "7d") return 7;
    if (selectedRange === "90d") return 90;
    if (selectedRange === "Custom") return 30;
    return 30;
  }, [selectedRange]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    setSummary(null);

    void (async () => {
      if (!identity?.token) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/analytics/merchant/summary?days=${days}`, {
          headers: { Authorization: `Bearer ${identity.token}` },
        });
        if (!response.ok) throw new Error("Request failed");
        const payload = (await response.json()) as {
          data?: {
            totalViews?: number;
            totalClicks?: number;
            viewsByDay?: Array<{ day: string; count: number }>;
            clicksByDay?: Array<{ day: string; count: number }>;
            viewsByBusiness?: Array<{ business_id: number; name: string; count: number }>;
          };
        };
        const viewsByDay = Array.isArray(payload.data?.viewsByDay) ? payload.data!.viewsByDay! : [];
        const clicksByDay = Array.isArray(payload.data?.clicksByDay) ? payload.data!.clicksByDay! : [];

        const today = new Date();
        const dates = Array.from({ length: days }).map((_, index) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (days - 1 - index));
          return d.toISOString().slice(0, 10);
        });
        const viewsMap = new Map<string, number>(
          viewsByDay.map((row) => [String(row.day).slice(0, 10), Number(row.count) || 0]),
        );
        const clicksMap = new Map<string, number>(
          clicksByDay.map((row) => [String(row.day).slice(0, 10), Number(row.count) || 0]),
        );

        const bucketSize = Math.max(1, Math.ceil(days / 7));
        const viewsActivity = Array.from({ length: 7 }).map((_, bucketIndex) => {
          const start = bucketIndex * bucketSize;
          const slice = dates.slice(start, start + bucketSize);
          return slice.reduce((sum, key) => sum + (viewsMap.get(key) ?? 0), 0);
        });
        const clicksBars = Array.from({ length: 7 }).map((_, bucketIndex) => {
          const start = bucketIndex * bucketSize;
          const slice = dates.slice(start, start + bucketSize);
          return slice.reduce((sum, key) => sum + (clicksMap.get(key) ?? 0), 0);
        });
        const bucketLabels = Array.from({ length: 7 }).map((_, bucketIndex) => {
          const start = bucketIndex * bucketSize;
          const slice = dates.slice(start, start + bucketSize);
          const endKey = slice[slice.length - 1] ?? dates[dates.length - 1] ?? today.toISOString().slice(0, 10);
          const end = new Date(endKey);
          if (days === 7) {
            return new Intl.DateTimeFormat(params.locale, { weekday: "short" }).format(end);
          }
          return new Intl.DateTimeFormat(params.locale, { month: "short", day: "numeric" }).format(end);
        });

        const viewsByBusiness = Array.isArray(payload.data?.viewsByBusiness) ? payload.data!.viewsByBusiness! : [];

        if (cancelled) return;
        setSummary({
          totalViews: Number(payload.data?.totalViews) || 0,
          totalClicks: Number(payload.data?.totalClicks) || 0,
          viewsActivity,
          clicksByDay: clicksBars,
          bucketLabels,
          viewsByBusiness,
        });
        setIsLoading(false);
      } catch {
        if (cancelled) return;
        setHasError(true);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [days, identity, params.locale]);

  const highestBar = Math.max(...(summary?.clicksByDay ?? [0]));

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#303741] text-white shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                </span>
                <h1 className="text-[1.4rem] font-extrabold tracking-[-0.05em] text-[#a36e00]">
                  LocalBoost
                </h1>
              </div>
              <Link href={`/${params.locale}/merchant/updates`} className="text-[#d19923]">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
              </Link>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            {hasError ? (
              <div className="mt-6">
                <ErrorState
                  title="Something went wrong"
                  description="Check your connection and try again."
                  onRetry={() => window.location.reload()}
                  retryLabel="Retry"
                />
              </div>
            ) : null}
            <div className="mobile-fade-up mt-4" style={{ animationDelay: "60ms" }}>
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-[#23212c]">
                Visibility Stats
              </h2>
              <p className="mt-2 text-[14px] leading-6 text-[#8b8174]">
                Real-time performance for your shop.
              </p>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {ranges.map((range, index) => {
                const active = selectedRange === range;

                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setSelectedRange(range)}
                    className={`mobile-pill mobile-fade-up h-9 shrink-0 px-4 text-[11px] font-extrabold ${
                      active
                        ? "bg-[#f1ece5] text-[#4a4037] shadow-[0_10px_20px_rgba(31,26,10,0.08)]"
                        : "bg-transparent text-[#9d9386]"
                    }`}
                    style={{ animationDelay: `${100 + index * 40}ms` }}
                  >
                    {range}
                  </button>
                );
              })}
            </div>

            <div
              className="mobile-card mobile-fade-up mt-5 rounded-[30px] px-5 py-5"
              style={{ animationDelay: "200ms" }}
            >
              <div className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#c1b4a6]">
                Total Views
              </div>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-[2.2rem] font-extrabold tracking-[-0.06em] text-[#b27a00]">
                  {isLoading ? "—" : (summary?.totalViews ?? 0).toLocaleString()}
                </span>
                <span className="pb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2caa72]">
                  {isLoading ? "" : ""}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[22px] bg-[#f7f4ef] px-4 py-3">
                  <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#c0b3a4]">
                    CTR (%)
                  </div>
                  <div className="mt-1 text-[1.7rem] font-extrabold tracking-[-0.05em] text-[#2a2826]">
                    {isLoading || !summary?.totalViews
                      ? "—"
                      : `${Math.round(((summary.totalClicks ?? 0) / summary.totalViews) * 1000) / 10}%`}
                  </div>
                  <div className="text-[10px] text-[#a49a8d]">Avg. interaction</div>
                </div>
                <div className="rounded-[22px] bg-[#f7f4ef] px-4 py-3">
                  <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#c0b3a4]">
                    Peak Day
                  </div>
                  <div className="mt-1 text-[1.5rem] font-extrabold tracking-[-0.05em] text-[#2a2826]">
                    {isLoading || !summary ? "—" : (() => {
                      const max = Math.max(...summary.viewsActivity, 0);
                      const idx = summary.viewsActivity.findIndex((v) => v === max);
                      return idx >= 0 ? (summary.bucketLabels[idx] ?? "—") : "—";
                    })()}
                  </div>
                  <div className="text-[10px] text-[#a49a8d]">2.3x views</div>
                </div>
              </div>
            </div>

            <div className="mobile-fade-up mt-7" style={{ animationDelay: "260ms" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-[1.3rem] font-extrabold tracking-[-0.05em] text-[#23212c]">
                  Views Activity
                </h3>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#b7aa9b]">
                  Live updates
                </span>
              </div>
              <div className="mt-4 rounded-[28px] bg-[#f7f4ee] px-4 py-5">
                <div className="relative h-[180px] rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(243,239,232,0.92))] px-3 pb-6 pt-4">
                  <div className="absolute inset-x-3 top-6 bottom-10 grid grid-rows-4">
                    {[0, 1, 2, 3].map((row) => (
                      <div key={row} className="border-b border-[#eee4d7]" />
                    ))}
                  </div>
                  <svg
                    viewBox="0 0 220 120"
                    className="relative z-10 h-full w-full"
                    aria-label="Views activity chart"
                  >
                    <polyline
                      fill="none"
                      stroke="#b27a00"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      points={(summary?.viewsActivity ?? Array.from({ length: 7 }).map(() => 0))
                        .map((value, index, array) => {
                          const max = Math.max(...array, 1);
                          const y = 115 - (value / max) * 90;
                          return `${index * 30},${y}`;
                        })
                        .join(" ")}
                    />
                  </svg>
                  <div className="mt-2 flex justify-between text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#baaf9e]">
                    {(summary?.bucketLabels ?? Array.from({ length: 7 }).map(() => "")).map((day, index) => (
                      <span key={`${day}-${index}`}>{day}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mobile-fade-up mt-7" style={{ animationDelay: "320ms" }}>
              <h3 className="text-[1.3rem] font-extrabold tracking-[-0.05em] text-[#23212c]">
                Clicks by Day
              </h3>
              <div className="mt-4 rounded-[28px] bg-[#f7f4ee] px-4 py-4">
                <div className="flex h-[120px] items-end gap-3 rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(243,239,232,0.95))] px-4 py-4">
                  {(summary?.clicksByDay ?? Array.from({ length: 7 }).map(() => 0)).map((value, index) => {
                    const active = value === highestBar;

                    return (
                      <div key={`${value}-${index}`} className="flex flex-1 items-end justify-center">
                        <div
                          className={`w-full rounded-t-[8px] ${
                            active ? "bg-[#bd5300]" : "bg-[#dfdad1]"
                          }`}
                          style={{ height: `${highestBar > 0 ? (value / highestBar) * 84 : 0}px` }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mobile-fade-up mt-7 pb-2" style={{ animationDelay: "380ms" }}>
              <h3 className="text-[1.3rem] font-extrabold tracking-[-0.05em] text-[#23212c]">
                How tourists found you
              </h3>
              <div className="mt-4 rounded-[28px] bg-white px-4 py-4 shadow-[0_10px_22px_rgba(31,26,10,0.04)]">
                <div className="space-y-4">
                  {(summary?.viewsByBusiness ?? []).map((item, index) => (
                    <div key={item.business_id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[16px] text-[#b27a00]">
                          {index === 0
                            ? "search"
                            : index === 1
                              ? "explore"
                              : index === 2
                                ? "location_on"
                                : "hotel_class"}
                        </span>
                        <span className="text-[13px] leading-5 text-[#5f564b]">{item.name}</span>
                      </div>
                      <span className="rounded-full bg-[#f4efe5] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#b27a00]">
                        {String(item.count)}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setReportExpanded((current) => !current)}
                  className="mt-5 text-[12px] font-extrabold text-[#9b6d19]"
                >
                  View Full Keyword Report
                  <span className="material-symbols-outlined ml-1 align-middle text-[14px]">
                    arrow_right_alt
                  </span>
                </button>
                {reportExpanded ? (
                  <div className="mt-4 rounded-[20px] bg-[#f8f5ef] px-4 py-4 text-[12px] leading-6 text-[#6f675b]">
                    Best growth comes from discovery queries tied to crafts, souks, and nearby
                    landmarks. Focus your profile copy and photos on those themes.
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="px-2 pb-3 pt-2">
            <MerchantAppBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
