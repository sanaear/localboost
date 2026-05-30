"use client";

import { useEffect, useMemo, useState } from "react";
import MerchantAppBottomNav from "@/components/MerchantAppBottomNav";
import { EmptyState, ErrorState, SkeletonLine } from "@/components/UiState";
import { API_BASE_URL } from "@/lib/api";
import { getMerchantIdentity } from "@/lib/merchant";

const accentStyles = {
  gold: "bg-[#f6ead2] text-[#a87918]",
  green: "bg-[#ddf5e8] text-[#15915d]",
  gray: "bg-[#efede9] text-[#9b9286]",
  peach: "bg-[#f8e5da] text-[#cf7a4d]",
};

type Accent = keyof typeof accentStyles;

type MerchantUpdateLatestItem = {
  id: string;
  title: string;
  time: string;
  excerpt: string;
  accent: Accent;
};

type MerchantUpdateOlderItem = {
  id: string;
  title: string;
  time: string;
  accent: Accent;
};

export default function MerchantUpdatesPage({
  params,
}: {
  params: { locale: string };
}) {
  const identity = useMemo(() => getMerchantIdentity(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [latest, setLatest] = useState<MerchantUpdateLatestItem[]>([]);
  const [older, setOlder] = useState<MerchantUpdateOlderItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    setLatest([]);
    setOlder([]);

    void (async () => {
      if (!identity?.token) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/merchant/updates`, {
          headers: { Authorization: `Bearer ${identity.token}` },
        });
        if (!response.ok) throw new Error("Request failed");
        const payload = (await response.json()) as {
          latest: MerchantUpdateLatestItem[];
          older: MerchantUpdateOlderItem[];
        };
        if (cancelled) return;
        setLatest(Array.isArray(payload.latest) ? payload.latest : []);
        setOlder(Array.isArray(payload.older) ? payload.older : []);
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
  }, [identity]);

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#313745] text-white shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">notifications</span>
                </span>
                <h1 className="text-[1.4rem] font-extrabold tracking-[-0.05em] text-[#a36e00]">
                  LocalBoost
                </h1>
              </div>
              <div className="flex items-center gap-2 text-[#bf9230]">
                <span className="rounded-full bg-[#f4efe3] px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em]">
                  New
                </span>
                <span className="material-symbols-outlined text-[18px]">notifications_active</span>
              </div>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            <div className="mobile-fade-up mt-4" style={{ animationDelay: "60ms" }}>
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-[#23212c]">
                Updates
              </h2>
              <p className="mt-2 max-w-[290px] text-[14px] leading-6 text-[#8b8174]">
                Stay informed about your business performance.
              </p>
            </div>

            {hasError ? (
              <div className="mt-6">
                <ErrorState
                  title="Could not load updates"
                  description="Check your connection and try again."
                  onRetry={() => window.location.reload()}
                  retryLabel="Retry"
                />
              </div>
            ) : null}

            {isLoading ? (
              <div className="mt-5 space-y-4">
                {[0, 1, 2].map((value) => (
                  <div key={value} className="mobile-card rounded-[28px] px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#efede9]" />
                      <div className="min-w-0 flex-1">
                        <SkeletonLine className="h-4 w-[70%]" />
                        <SkeletonLine className="mt-2 h-3 w-[40%]" />
                        <div className="mt-4 rounded-[18px] bg-[#f8f5ef] px-4 py-4">
                          <SkeletonLine className="h-3 w-[90%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : latest.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="No updates yet"
                  description="New activity will show up here."
                />
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {latest.map((item, index) => (
                  <div
                    key={item.id}
                    className="mobile-card mobile-fade-up rounded-[28px] px-4 py-4"
                    style={{ animationDelay: `${120 + index * 60}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-full ${
                          accentStyles[item.accent]
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {item.accent === "gold"
                            ? "star"
                            : item.accent === "green"
                              ? "verified"
                              : "description"}
                        </span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-[14px] font-extrabold tracking-[-0.03em] text-[#2b2825]">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-[11px] text-[#b2a697]">{item.time}</p>
                          </div>
                          <span className="h-2 w-2 rounded-full bg-[#c89e31]" />
                        </div>

                        <div className="mt-4 rounded-[18px] bg-[#f8f5ef] px-4 py-3 text-[13px] italic leading-6 text-[#7d7368]">
                          {item.excerpt}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              className="mobile-fade-up mt-10 text-center text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#cdc1b2]"
              style={{ animationDelay: "320ms" }}
            >
              Older Notifications
            </div>

            {older.length ? (
              <div className="mt-5 space-y-4 pb-2">
                {older.map((item, index) => (
                  <div
                    key={item.id}
                    className="mobile-fade-up relative overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(247,242,236,0.92),rgba(242,238,233,0.96))] px-4 py-4 shadow-[0_10px_22px_rgba(31,26,10,0.04)]"
                    style={{ animationDelay: `${360 + index * 60}ms` }}
                  >
                    <div className="absolute bottom-[-40px] right-[-26px] h-28 w-28 rotate-45 rounded-[28px] bg-white/30" />
                    <div className="relative flex items-start gap-3">
                      <span
                        className={`grid h-10 w-10 place-items-center rounded-full ${
                          accentStyles[item.accent]
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">campaign</span>
                      </span>
                      <div>
                        <h3 className="text-[13px] font-extrabold tracking-[-0.03em] text-[#2b2825]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[11px] text-[#b2a697]">{item.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="px-2 pb-3 pt-2">
            <MerchantAppBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
