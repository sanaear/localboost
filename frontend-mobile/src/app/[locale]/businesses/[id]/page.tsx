"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ErrorState, SkeletonLine } from "@/components/UiState";
import { useFavorites } from "@/lib/favorites";
import { useBusinessAverageRating, useBusinessDetail, useBusinessReviews } from "@/lib/queries";
import OptimizedImage from "@/components/OptimizedImage";
import MobileBottomNav from "@/components/MobileBottomNav";
import { API_BASE_URL } from "@/lib/api";

function formatBusinessName(name: string) {
  if (name.includes(" ")) return name;
  if (!/[a-z][A-Z]/.test(name)) return name;
  return name.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export default function BusinessDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const t = useTranslations("businessDetail");
  const tCommon = useTranslations("common");
  const businessId = Number(params.id);
  const favorites = useFavorites();
  const [shareOpen, setShareOpen] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const shareMessageTimerRef = useRef<number | null>(null);

  const businessQuery = useBusinessDetail(businessId);
  const ratingQuery = useBusinessAverageRating(businessId);
  const reviewsQuery = useBusinessReviews(businessId);

  const primaryImage = useMemo(() => businessQuery.data?.images?.[0], [businessQuery.data?.images]);
  const displayName = useMemo(() => {
    const fallback = t("imageAltFallback");
    return formatBusinessName(businessQuery.data?.name ?? fallback);
  }, [businessQuery.data?.name, t]);

  useEffect(() => {
    if (!Number.isFinite(businessId)) return;
    void fetch(`${API_BASE_URL}/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId, eventType: "view" }),
    }).catch(() => null);
  }, [businessId]);

  useEffect(() => {
    return () => {
      if (shareMessageTimerRef.current) window.clearTimeout(shareMessageTimerRef.current);
    };
  }, []);

  async function copyText(text: string) {
    if (typeof navigator === "undefined") throw new Error("Clipboard not available");
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  function showShareMessage(message: string) {
    setShareMessage(message);
    if (shareMessageTimerRef.current) window.clearTimeout(shareMessageTimerRef.current);
    shareMessageTimerRef.current = window.setTimeout(() => setShareMessage(null), 2200);
  }

  function getShareUrl() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/${params.locale}/businesses/${businessId}`;
  }

  async function handleCopyLink() {
    setShareBusy(true);
    try {
      await copyText(getShareUrl());
      showShareMessage(t("shareCopied"));
      setShareOpen(false);
    } catch {
      showShareMessage(t("shareCopyFailed"));
    } finally {
      setShareBusy(false);
    }
  }

  function handleOpenLink() {
    try {
      window.open(getShareUrl(), "_blank", "noopener,noreferrer");
      showShareMessage(t("shareOpened"));
      setShareOpen(false);
    } catch {
      showShareMessage(t("shareOpenFailed"));
    }
  }

  function handleShareWhatsApp() {
    try {
      const url = getShareUrl();
      const title = businessQuery.data?.name ? `${businessQuery.data.name} - ` : "";
      const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${title}${url}`)}`;
      window.open(whatsapp, "_blank", "noopener,noreferrer");
      showShareMessage(t("shareWhatsappOpened"));
      setShareOpen(false);
    } catch {
      showShareMessage(t("shareWhatsappFailed"));
    }
  }

  if (!Number.isFinite(businessId)) {
    return (
      <main className="mobile-app-shell">
        <section className="mobile-phone overflow-hidden bg-[#faf8f2]">
          <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col p-6 text-[14px] font-bold text-[#7f7669]">
            {t("invalidId")}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone overflow-hidden bg-[#faf8f2]">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col">
          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto">
            <div className={`relative ${primaryImage ? "h-[310px]" : "h-[220px]"}`}>
              {primaryImage ? (
                <OptimizedImage
                  src={primaryImage}
                  alt={displayName}
                  width={1200}
                  height={900}
                  sizes="100vw"
                  widths={[640, 828, 1080, 1200]}
                  priority
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#efece6] via-[#f7f3eb] to-[#efe6d8]">
                  <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-white/40 blur-2xl" />
                  <div className="absolute -bottom-10 -right-12 h-56 w-56 rounded-full bg-[#e8a620]/20 blur-2xl" />
                  <div className="absolute inset-0 flex items-end p-5">
                    <div className="max-w-[85%] rounded-[22px] bg-white/85 px-4 py-3 text-[14px] font-extrabold tracking-[-0.03em] text-[#2a2730] shadow-[0_10px_30px_rgba(31,26,10,0.12)]">
                      {displayName}
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                <Link href={`/${params.locale}/discover`} className="grid h-9 w-9 place-items-center rounded-full bg-white/86 text-[#70685c] shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void favorites.toggleFavorite(businessId)}
                    disabled={favorites.isPending(businessId)}
                    className={`grid h-9 w-9 place-items-center rounded-full bg-white/86 text-[#70685c] shadow-sm ${favorites.isPending(businessId) ? "opacity-60" : ""}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {favorites.isPending(businessId)
                        ? "progress_activity"
                        : favorites.isFavorite(businessId)
                          ? "favorite"
                          : "favorite_border"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareOpen((current) => !current)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/86 text-[#70685c] shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                  </button>
                </div>
              </div>

              {shareOpen ? (
                <div className="absolute right-3 top-[58px] z-10 w-[210px] overflow-hidden rounded-[18px] border border-white/60 bg-white/95 shadow-[0_14px_40px_rgba(31,26,10,0.18)] backdrop-blur">
                  <button
                    type="button"
                    onClick={() => void handleCopyLink()}
                    disabled={shareBusy}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-left text-[12px] font-extrabold text-[#2a2730] ${shareBusy ? "opacity-60" : ""}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    {t("shareCopy")}
                  </button>
                  <div className="h-px bg-[#ece2d3]" />
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    disabled={shareBusy}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-left text-[12px] font-extrabold text-[#2a2730] ${shareBusy ? "opacity-60" : ""}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    {t("shareWhatsapp")}
                  </button>
                  <div className="h-px bg-[#ece2d3]" />
                  <button
                    type="button"
                    onClick={handleOpenLink}
                    disabled={shareBusy}
                    className={`flex w-full items-center gap-2 px-4 py-3 text-left text-[12px] font-extrabold text-[#2a2730] ${shareBusy ? "opacity-60" : ""}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">link</span>
                    {t("shareOpenUrl")}
                  </button>
                </div>
              ) : null}

              {shareMessage ? (
                <div className="absolute inset-x-0 bottom-3 flex justify-center px-3">
                  <div className="rounded-full bg-[#1f1a0a]/75 px-4 py-2 text-[12px] font-extrabold text-white shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
                    {shareMessage}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="-mt-8 flex-1 rounded-t-[34px] bg-[#faf8f2] px-5 pb-6 pt-6">
              {favorites.error ? (
                <div className="mb-4 flex items-center justify-between gap-3 rounded-[22px] border border-[#f1d0d0] bg-white px-4 py-3 text-[12px] font-bold text-[#9b3e3e] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
                  <span className="min-w-0 flex-1 truncate">{favorites.error}</span>
                  <button type="button" onClick={favorites.clearError} className="shrink-0 text-[#9b3e3e]">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              ) : null}
              {businessQuery.isLoading ? (
                <div className="rounded-[26px] border border-[#ece2d3] bg-white px-4 py-5 shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
                  <div className="space-y-3">
                    <SkeletonLine className="h-7 w-[75%]" />
                    <SkeletonLine className="h-4 w-[55%]" />
                    <div className="mt-5 space-y-2">
                      <SkeletonLine className="h-4 w-[90%]" />
                      <SkeletonLine className="h-4 w-[92%]" />
                      <SkeletonLine className="h-4 w-[70%]" />
                    </div>
                  </div>
                </div>
              ) : businessQuery.isError || !businessQuery.data ? (
                <ErrorState
                  title={t("errorBusiness")}
                  description={tCommon("errorDescription")}
                  onRetry={() => businessQuery.refetch()}
                />
              ) : (
                <>
                  <h1 className="text-[2.15rem] font-extrabold leading-[0.95] tracking-[-0.05em] text-[#23212c]">{displayName}</h1>
                  <p className="mt-2 text-[15px] text-[#70685d]">
                    {[businessQuery.data.city, businessQuery.data.user?.address].filter(Boolean).join(" · ")}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#7c7367]">
                    {ratingQuery.data ? (
                      <span className="flex items-center gap-1 font-extrabold text-[#a36e00]">
                        <span className="material-symbols-outlined text-[16px]">star</span>
                        {ratingQuery.data.average.toFixed(1)}{" "}
                        <span className="font-semibold text-[#8d8476]">
                          ({t("reviewsCount", { count: ratingQuery.data.count }).replace(/\s/g, "\u00a0")})
                        </span>
                      </span>
                    ) : null}
                    {businessQuery.data.category?.name_en ? (
                      <span className="rounded-full bg-[#ebf8ef] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#178f60]">
                        {businessQuery.data.category.name_en}
                      </span>
                    ) : null}
                  </div>

                  {businessQuery.data.description ? (
                    <div className="mt-5 rounded-[26px] border border-[#eadfce] bg-white px-4 py-4 text-[13px] leading-6 text-[#7a7266] shadow-[0_10px_25px_rgba(31,26,10,0.05)]">
                      {businessQuery.data.description}
                    </div>
                  ) : null}

                  <div className="mt-7">
                    <h2 className="text-[1.45rem] font-extrabold tracking-[-0.05em] text-[#23212c]">{t("reviews")}</h2>

                    {reviewsQuery.isLoading ? (
                      <div className="mt-3 space-y-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <div key={index} className="rounded-[20px] border border-[#ece2d3] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(31,26,10,0.04)]">
                            <SkeletonLine className="h-4 w-[45%]" />
                            <div className="mt-3 space-y-2">
                              <SkeletonLine className="h-4 w-[90%]" />
                              <SkeletonLine className="h-4 w-[80%]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : reviewsQuery.isError ? (
                      <div className="mt-3">
                        <ErrorState
                          title={t("errorReviews")}
                          description={t("errorReviewsDescription")}
                          onRetry={() => reviewsQuery.refetch()}
                          retryLabel={tCommon("retry")}
                        />
                      </div>
                    ) : (reviewsQuery.data ?? []).length === 0 ? (
                      <div className="mt-3 rounded-[20px] border border-[#ece2d3] bg-white px-4 py-4 text-[13px] font-bold text-[#7f7669] shadow-[0_8px_24px_rgba(31,26,10,0.04)]">
                        {t("noReviews")}
                      </div>
                    ) : (
                      <div className="mt-3 space-y-3">
                        {(reviewsQuery.data ?? []).slice(0, 6).map((review) => (
                          <div key={review.id} className="rounded-[20px] border border-[#ece2d3] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(31,26,10,0.04)]">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[13px] font-extrabold text-[#2a2730]">
                                {[review.user?.first_name, review.user?.last_name].filter(Boolean).join(" ") || t("anonymous")}
                              </span>
                              <span className="flex items-center gap-1 text-[12px] font-extrabold text-[#a36e00]">
                                <span className="material-symbols-outlined text-[14px]">star</span>
                                {review.rating}
                              </span>
                            </div>
                            {review.content ? <p className="mt-2 text-[12px] leading-5 text-[#7a7266]">{review.content}</p> : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="px-4 pb-4 pt-2">
            <MobileBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
