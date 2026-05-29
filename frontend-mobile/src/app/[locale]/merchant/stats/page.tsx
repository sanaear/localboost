"use client";

import Link from "next/link";
import { useState } from "react";
import MerchantAppBottomNav from "@/components/MerchantAppBottomNav";
import {
  merchantClicksByDay,
  merchantDiscoveryKeywords,
  merchantVisibilityRanges,
  merchantViewsActivity,
} from "@/lib/mobileData";

export default function MerchantStatsPage({
  params,
}: {
  params: { locale: string };
}) {
  const [selectedRange, setSelectedRange] = useState("30d");
  const [reportExpanded, setReportExpanded] = useState(false);
  const highestBar = Math.max(...merchantClicksByDay);

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
            <div className="mobile-fade-up mt-4" style={{ animationDelay: "60ms" }}>
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-[#23212c]">
                Visibility Stats
              </h2>
              <p className="mt-2 text-[14px] leading-6 text-[#8b8174]">
                Real-time performance for your shop.
              </p>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {merchantVisibilityRanges.map((range, index) => {
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
                  12,482
                </span>
                <span className="pb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2caa72]">
                  +143%
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[22px] bg-[#f7f4ef] px-4 py-3">
                  <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#c0b3a4]">
                    CTR (%)
                  </div>
                  <div className="mt-1 text-[1.7rem] font-extrabold tracking-[-0.05em] text-[#2a2826]">
                    4.2%
                  </div>
                  <div className="text-[10px] text-[#a49a8d]">Avg. interaction</div>
                </div>
                <div className="rounded-[22px] bg-[#f7f4ef] px-4 py-3">
                  <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#c0b3a4]">
                    Peak Day
                  </div>
                  <div className="mt-1 text-[1.5rem] font-extrabold tracking-[-0.05em] text-[#2a2826]">
                    Saturday
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
                      points={merchantViewsActivity
                        .map((value, index) => `${index * 30},${115 - value}`)
                        .join(" ")}
                    />
                  </svg>
                  <div className="mt-2 flex justify-between text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#baaf9e]">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <span key={day}>{day}</span>
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
                  {merchantClicksByDay.map((value, index) => {
                    const active = value === highestBar;

                    return (
                      <div key={`${value}-${index}`} className="flex flex-1 items-end justify-center">
                        <div
                          className={`w-full rounded-t-[8px] ${
                            active ? "bg-[#bd5300]" : "bg-[#dfdad1]"
                          }`}
                          style={{ height: `${(value / highestBar) * 84}px` }}
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
                  {merchantDiscoveryKeywords.map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between gap-3">
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
                        <span className="text-[13px] leading-5 text-[#5f564b]">{item.label}</span>
                      </div>
                      <span className="rounded-full bg-[#f4efe5] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#b27a00]">
                        {item.value}
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
