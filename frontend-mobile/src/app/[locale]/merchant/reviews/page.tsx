"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import MerchantAppBottomNav from "@/components/MerchantAppBottomNav";
import { ErrorState, SkeletonLine } from "@/components/UiState";
import { API_BASE_URL, type Review } from "@/lib/api";
import { getMerchantIdentity, fetchMyBusinesses, fetchApprovedReviewsForBusiness } from "@/lib/merchant";

const filters = ["All", "Replied", "Pending Reply"] as const;

type MerchantReviewItem = {
  id: number;
  name: string;
  avatar?: string;
  date: string;
  rating: number;
  status: "REPLIED" | "PENDING REPLY";
  statusTone: "green" | "amber" | "gray";
  text: string;
  replyPlaceholder: string;
  replyMessage?: string | null;
};

export default function MerchantReviewsPage({
  params,
}: {
  params: { locale: string };
}) {
  const tCommon = useTranslations("common");
  const [selectedFilter, setSelectedFilter] =
    useState<(typeof filters)[number]>("All");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [replyState, setReplyState] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reviews, setReviews] = useState<MerchantReviewItem[]>([]);
  const [average, setAverage] = useState<{ average: number; count: number } | null>(null);

  const identity = useMemo(() => getMerchantIdentity(), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    setReviews([]);
    setAverage(null);

    void (async () => {
      if (!identity?.token) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      try {
        const businesses = await fetchMyBusinesses();
        const allReviews = (
          await Promise.all(
            businesses.map(async (business) => {
              try {
                return await fetchApprovedReviewsForBusiness(business.id);
              } catch {
                return [] as Review[];
              }
            }),
          )
        ).flat();

        if (cancelled) return;

        const items = allReviews
          .slice()
          .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
          .map((review) => {
            const name = [review.user?.first_name, review.user?.last_name].filter(Boolean).join(" ") || tCommon("anonymous");
            const isReplied = Boolean(review.reply?.message);
            return {
              id: review.id,
              name,
              avatar: review.user?.profile_image ?? undefined,
              date: new Date(review.created_at).toLocaleDateString(),
              rating: review.rating,
              status: isReplied ? "REPLIED" : "PENDING REPLY",
              statusTone: isReplied ? "gray" : "amber",
              text: review.content ? `"${review.content}"` : "",
              replyPlaceholder: isReplied ? "Reply already sent" : "Write a public reply…",
              replyMessage: review.reply?.message ?? null,
            } satisfies MerchantReviewItem;
          });

        const sum = allReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
        const count = allReviews.length;
        setAverage({ average: count > 0 ? sum / count : 0, count });
        setReviews(items);
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
  }, [identity, tCommon]);

  const visibleReviews = useMemo(() => {
    if (selectedFilter === "Replied") {
      return reviews.filter((review) => review.status === "REPLIED");
    }

    if (selectedFilter === "Pending Reply") {
      return reviews.filter((review) => review.status !== "REPLIED");
    }

    return reviews;
  }, [reviews, selectedFilter]);

  async function handleSendReply(reviewId: number) {
    if (!identity?.token) return;
    const draft = (drafts[String(reviewId)] ?? "").trim();
    if (!draft) return;
    setReplyState((current) => ({ ...current, [String(reviewId)]: "" }));

    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${identity.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: draft }),
      });
      if (!response.ok) throw new Error("Request failed");

      setReviews((current) =>
        current.map((review) =>
          review.id === reviewId
            ? { ...review, status: "REPLIED", statusTone: "gray", replyMessage: draft, replyPlaceholder: "Reply already sent" }
            : review,
        ),
      );
      setReplyState((current) => ({ ...current, [String(reviewId)]: "Reply sent" }));
    } catch {
      setReplyState((current) => ({ ...current, [String(reviewId)]: tCommon("errorDescription") }));
    }
  }

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
            {hasError ? (
              <div className="mt-6">
                <ErrorState
                  title={tCommon("errorTitle")}
                  description={tCommon("errorDescription")}
                  onRetry={() => window.location.reload()}
                  retryLabel={tCommon("retry")}
                />
              </div>
            ) : null}
            <div
              className="mobile-card mobile-fade-up mt-4 rounded-[34px] px-5 py-5 text-center"
              style={{ animationDelay: "60ms" }}
            >
              <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b8ad9c]">
                Average Rating
              </div>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-[3.2rem] font-extrabold leading-none tracking-[-0.08em] text-[#b27a00]">
                  {isLoading ? "—" : (average?.average ?? 0).toFixed(1)}
                </span>
                <span className="material-symbols-outlined text-[32px] text-[#e0a11f]">
                  star
                </span>
              </div>
              <p className="mx-auto mt-2 max-w-[200px] text-[13px] leading-6 text-[#7f7467]">
                {isLoading ? "—" : `Based on ${average?.count ?? 0} reviews`}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-left">
                {[
                  {
                    label: "Response rate",
                    value:
                      reviews.length === 0
                        ? "—"
                        : `${Math.round((reviews.filter((r) => r.status === "REPLIED").length / reviews.length) * 100)}%`,
                    tone: "green" as const,
                  },
                  {
                    label: "Pending replies",
                    value: String(reviews.filter((r) => r.status !== "REPLIED").length),
                    tone: "amber" as const,
                  },
                ].map((item, index) => (
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
              {isLoading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="mobile-card rounded-[28px] px-4 py-4">
                    <SkeletonLine className="h-4 w-[45%]" />
                    <SkeletonLine className="mt-3 h-4 w-[85%]" />
                    <SkeletonLine className="mt-2 h-4 w-[70%]" />
                  </div>
                ))
              ) : (
              visibleReviews.map((review, index) => {
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
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="grid h-11 w-11 place-items-center rounded-full bg-[#2b2a2a] text-white">
                          <span className="material-symbols-outlined text-[16px]">person</span>
                        </div>
                      )}
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

                        <div className="mt-5">
                          <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#b28a37]">
                            Public Reply
                          </div>
                          <textarea
                            className="mobile-input mt-3 min-h-[86px] resize-none"
                            placeholder={review.replyPlaceholder}
                            value={review.status === "REPLIED" ? review.replyMessage ?? "" : draft}
                            disabled={review.status === "REPLIED"}
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
                              disabled={review.status === "REPLIED"}
                              onClick={() => void handleSendReply(review.id)}
                              className="mobile-pill h-10 min-w-[118px] bg-[#b27a00] px-4 text-[12px] font-extrabold text-white disabled:opacity-60"
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
                      </div>
                    </div>
                  </div>
                );
              })
              )}
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
