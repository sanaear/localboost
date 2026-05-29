"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import MerchantAppBottomNav from "@/components/MerchantAppBottomNav";
import {
  merchantDetailedReviews,
  merchantReviewInsights,
} from "@/lib/mobileData";

const filters = ["All", "Replied", "Pending Reply"] as const;

export default function MerchantReviewsPage({
  params,
}: {
  params: { locale: string };
}) {
  const [selectedFilter, setSelectedFilter] =
    useState<(typeof filters)[number]>("All");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [replyState, setReplyState] = useState<Record<string, string>>({});

  const visibleReviews = useMemo(() => {
    if (selectedFilter === "Replied") {
      return merchantDetailedReviews.filter((review) => review.status === "REPLIED");
    }

    if (selectedFilter === "Pending Reply") {
      return merchantDetailedReviews.filter((review) => review.status !== "REPLIED");
    }

    return merchantDetailedReviews;
  }, [selectedFilter]);

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2b2a2a] text-white shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                </span>
                <h1 className="text-[1.4rem] font-extrabold tracking-[-0.05em] text-[#a36e00]">
                  LocalBoost
                </h1>
              </div>
              <Link href={`/${params.locale}/merchant/updates`} className="text-[#c49730]">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
              </Link>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            <div
              className="mobile-card mobile-fade-up mt-4 rounded-[34px] px-5 py-5 text-center"
              style={{ animationDelay: "60ms" }}
            >
              <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b8ad9c]">
                Average Rating
              </div>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-[3.2rem] font-extrabold leading-none tracking-[-0.08em] text-[#b27a00]">
                  4.8
                </span>
                <span className="material-symbols-outlined text-[32px] text-[#e0a11f]">
                  star
                </span>
              </div>
              <p className="mx-auto mt-2 max-w-[200px] text-[13px] leading-6 text-[#7f7467]">
                Based on 1,248 reviews this season
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-left">
                {merchantReviewInsights.map((item, index) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] bg-[#f6f2eb] px-4 py-3"
                    style={{ animationDelay: `${120 + index * 50}ms` }}
                  >
                    <div className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#c3b7a8]">
                      {item.label}
                    </div>
                    <div
                      className={`mt-1 text-[1.75rem] font-extrabold tracking-[-0.05em] ${
                        item.tone === "green" ? "text-[#0a9157]" : "text-[#c26f38]"
                      }`}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
              {filters.map((filter, index) => {
                const active = selectedFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedFilter(filter)}
                    className={`mobile-pill mobile-fade-up h-10 shrink-0 px-4 text-[12px] font-extrabold ${
                      active
                        ? "bg-[#a36e00] text-white shadow-[0_12px_24px_rgba(163,110,0,0.18)]"
                        : "bg-[#efebe4] text-[#8d8377]"
                    }`}
                    style={{ animationDelay: `${180 + index * 40}ms` }}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-4 pb-2">
              {visibleReviews.map((review, index) => {
                const draft = drafts[review.id] ?? "";
                const statusTone =
                  review.statusTone === "green"
                    ? "mobile-badge-green"
                    : review.statusTone === "amber"
                      ? "mobile-badge-amber"
                      : "mobile-badge-gray";

                return (
                  <div
                    key={review.id}
                    className="mobile-card mobile-fade-up rounded-[28px] px-4 py-4"
                    style={{ animationDelay: `${240 + index * 70}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[1rem] font-extrabold tracking-[-0.04em] text-[#2d2a27]">
                              {review.name}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b0a394]">
                              <span className="material-symbols-outlined text-[13px]">schedule</span>
                              {review.date}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[13px] font-extrabold text-[#e0a11f]">
                              {"★".repeat(review.rating)}
                            </div>
                            <span
                              className={`mt-2 inline-flex rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] ${statusTone}`}
                            >
                              {review.status}
                            </span>
                          </div>
                        </div>

                        <p className="mt-4 text-[14px] italic leading-6 text-[#72685c]">
                          {review.text}
                        </p>

                        {review.id === "jean-pierre" ? (
                          <div className="mt-5">
                            <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#b28a37]">
                              Public Reply
                            </div>
                            <textarea
                              className="mobile-input mt-3 min-h-[86px] resize-none"
                              placeholder={review.replyPlaceholder}
                              value={draft}
                              onChange={(event) =>
                                setDrafts((current) => ({
                                  ...current,
                                  [review.id]: event.target.value,
                                }))
                              }
                            />
                            <div className="mt-4 flex justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  setReplyState((current) => ({
                                    ...current,
                                    [review.id]: "Reply sent",
                                  }))
                                }
                                className="mobile-pill h-10 min-w-[118px] bg-[#b27a00] px-4 text-[12px] font-extrabold text-white"
                              >
                                Send Reply
                              </button>
                            </div>
                            {replyState[review.id] ? (
                              <p className="mt-3 text-right text-[12px] font-semibold text-[#5f8e70]">
                                {replyState[review.id]}
                              </p>
                            ) : null}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setReplyState((current) => ({
                                ...current,
                                [review.id]:
                                  review.status === "REPLIED" ? "Reply already sent" : "Reply draft opened",
                              }))
                            }
                            className="mobile-pill mt-5 h-11 w-full bg-[#f4efe7] text-[13px] font-extrabold text-[#9a6f1e]"
                          >
                            <span className="material-symbols-outlined mr-2 text-[15px]">reply</span>
                            {replyState[review.id] ?? review.replyPlaceholder}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
