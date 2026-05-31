"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import MerchantAppBottomNav from "@/components/MerchantAppBottomNav";
import { ErrorState, SkeletonLine } from "@/components/UiState";
import { fetchApprovedReviewsForBusiness, fetchFavoriteCountForBusiness, fetchMe, fetchMyBusinesses, getMerchantIdentity } from "@/lib/merchant";

function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return date.toLocaleDateString(locale);
}

export default function MerchantDashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("merchantDashboard");
  const tCommon = useTranslations("common");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [stats, setStats] = useState<Array<{ labelKey: string; value: number; icon: string }>>([]);
  const [recentReviews, setRecentReviews] = useState<Array<{ id: number; rating: number; text: string; age: string }>>([]);

  const identity = useMemo(() => getMerchantIdentity(), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);

    void (async () => {
      if (!identity?.token) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      try {
        const [me, businesses] = await Promise.all([fetchMe(), fetchMyBusinesses()]);
        if (cancelled) return;

        const name =
          [me?.first_name, me?.last_name].filter(Boolean).join(" ") ||
          (me?.email ? me.email.split("@")[0] : "");
        setDisplayName(name || "—");

        const favoriteCounts = await Promise.all(
          businesses.map(async (business) => {
            try {
              return await fetchFavoriteCountForBusiness(business.id);
            } catch {
              return 0;
            }
          }),
        );
        if (cancelled) return;

        const totalSaves = favoriteCounts.reduce((sum, value) => sum + value, 0);

        const reviews = (
          await Promise.all(
            businesses.map(async (business) => {
              try {
                return await fetchApprovedReviewsForBusiness(business.id);
              } catch {
                return [];
              }
            }),
          )
        ).flat();

        if (cancelled) return;

        const sorted = reviews
          .slice()
          .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
        setRecentReviews(
          sorted.slice(0, 3).map((review) => ({
            id: review.id,
            rating: review.rating,
            text: review.content ?? "",
            age: formatDate(review.created_at, params.locale) || "—",
          })),
        );

        setStats([
          { labelKey: "viewsThisWeek", value: 0, icon: "visibility" },
          { labelKey: "profileClicks", value: 0, icon: "touch_app" },
          { labelKey: "totalSaves", value: totalSaves, icon: "bookmark" },
          { labelKey: "savedByTourists", value: totalSaves, icon: "favorite" },
        ]);

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
  }, [identity, params.locale]);

  const statsCards = isLoading
    ? ([
        { labelKey: "viewsThisWeek", value: 0, icon: "visibility" },
        { labelKey: "profileClicks", value: 0, icon: "touch_app" },
        { labelKey: "totalSaves", value: 0, icon: "bookmark" },
        { labelKey: "savedByTourists", value: 0, icon: "favorite" },
      ] as Array<{ labelKey: string; value: number; icon: string }>)
    : stats;

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#d7f2df] text-[#0f8c59] shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                </span>
                <h1 className="text-[1.4rem] font-extrabold tracking-[-0.05em] text-[#a36e00]">{tCommon("brand")}</h1>
              </div>
              <Link href={`/${params.locale}/merchant/updates`} className="text-[#a36e00]">
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
            ) : (
              <>
                <div className="mobile-fade-up mt-3" style={{ animationDelay: "80ms" }}>
                  <h2 className="text-[2.3rem] font-extrabold leading-[0.95] tracking-[-0.07em] text-[#23212c]">
                    {t("goodMorning")}
                    <br />
                    {isLoading ? <SkeletonLine className="mt-2 h-8 w-[140px]" /> : displayName}
                  </h2>
                  <p className="mt-2 text-[15px] text-[#7d7468]">{t("attentionToday")}</p>
                </div>

                <div className="mobile-fade-up mt-6 rounded-[28px] bg-[#d7f2df] px-4 py-4 shadow-[0_12px_22px_rgba(31,26,10,0.04)]" style={{ animationDelay: "140ms" }}>
                  <div className="flex items-center gap-2 text-[15px] font-semibold text-[#18875b]">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#138b58] text-white">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </span>
                    {t("approvedLive")}
                  </div>
                </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {statsCards.map((stat, index) => (
                <div
                  key={stat.labelKey}
                  className="mobile-card mobile-fade-up rounded-[24px] px-4 py-4"
                  style={{ animationDelay: `${180 + index * 60}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="material-symbols-outlined text-[16px] text-[#c5aa73]">
                      {stat.icon}
                    </span>
                  </div>
                  <div className="mt-3 text-[1.9rem] font-extrabold tracking-[-0.05em] text-[#23212c]">
                    {isLoading ? <SkeletonLine className="h-8 w-[70px]" /> : stat.value}
                  </div>
                  <div className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#a39a8b]">
                    {isLoading ? <SkeletonLine className="h-3 w-[90px]" /> : t(`stats.${stat.labelKey}` as any)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mobile-fade-up mt-7" style={{ animationDelay: "360ms" }}>
              <h3 className="text-[1.35rem] font-extrabold tracking-[-0.05em] text-[#23212c]">{t("quickActions")}</h3>
              <div className="mt-4 space-y-3">
                <Link href={`/${params.locale}/merchant/photo-manager`} className="flex items-center justify-between rounded-[26px] bg-white px-4 py-4 shadow-[0_10px_22px_rgba(31,26,10,0.04)]">
                  <span className="flex items-center gap-3 text-[15px] font-semibold text-[#60584d]">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#efe7db] text-[#b08b3b]">
                      <span className="material-symbols-outlined text-[18px]">photo_library</span>
                    </span>
                    {t("photoManager")}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#a39a8b]">chevron_right</span>
                </Link>
                <Link href={`/${params.locale}/merchant/generate-ai`} className="flex items-center justify-between rounded-[26px] bg-white px-4 py-4 shadow-[0_10px_22px_rgba(31,26,10,0.04)]">
                  <span className="flex items-center gap-3 text-[15px] font-semibold text-[#60584d]">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f6edd8] text-[#b08b3b]">
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    </span>
                    {t("generateAiDescription")}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#a39a8b]">chevron_right</span>
                </Link>
                <Link href={`/${params.locale}/merchant/reviews`} className="flex items-center justify-between rounded-[26px] bg-white px-4 py-4 shadow-[0_10px_22px_rgba(31,26,10,0.04)]">
                  <span className="flex items-center gap-3 text-[15px] font-semibold text-[#60584d]">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f4efe4] text-[#b08b3b]">
                      <span className="material-symbols-outlined text-[18px]">rate_review</span>
                    </span>
                    {t("viewReviews")}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#a39a8b]">chevron_right</span>
                </Link>
              </div>
            </div>

            <div className="mobile-fade-up mt-7 pb-2" style={{ animationDelay: "440ms" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-[1.35rem] font-extrabold tracking-[-0.05em] text-[#23212c]">{t("recentReviews")}</h3>
                <Link href={`/${params.locale}/merchant/reviews`} className="text-[12px] font-extrabold text-[#a36e00]">
                  {t("viewAll")}
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {isLoading ? (
                  Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="rounded-[26px] bg-white px-4 py-4 shadow-[0_10px_22px_rgba(31,26,10,0.04)]">
                      <SkeletonLine className="h-4 w-[30%]" />
                      <SkeletonLine className="mt-3 h-4 w-[90%]" />
                      <SkeletonLine className="mt-2 h-4 w-[75%]" />
                    </div>
                  ))
                ) : recentReviews.length === 0 ? (
                  <div className="rounded-[26px] bg-white px-4 py-4 text-[13px] font-semibold text-[#7a7267] shadow-[0_10px_22px_rgba(31,26,10,0.04)]">
                    {t("noReviews")}
                  </div>
                ) : (
                  recentReviews.map((review) => (
                  <div key={review.id} className="rounded-[26px] bg-white px-4 py-4 shadow-[0_10px_22px_rgba(31,26,10,0.04)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-extrabold text-[#d59a24]">{review.rating}</span>
                      <span className="text-[11px] text-[#a39a8b]">{review.age}</span>
                    </div>
                    <p className="mt-3 text-[13px] italic leading-6 text-[#7a7267]">{review.text}</p>
                    <Link
                      href={`/${params.locale}/merchant/reviews`}
                      className="mobile-pill mt-4 h-9 rounded-full bg-[#b27a00] px-4 text-[12px] font-extrabold text-white"
                    >
                      {t("reply")}
                    </Link>
                  </div>
                  ))
                )}
              </div>
            </div>
              </>
            )}
          </div>

          <div className="px-2 pb-3 pt-2">
            <MerchantAppBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
