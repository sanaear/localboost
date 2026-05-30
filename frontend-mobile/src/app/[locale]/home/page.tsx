"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import MobileBottomNav from "@/components/MobileBottomNav";
import OptimizedImage from "@/components/OptimizedImage";
import { ErrorState, SkeletonLine } from "@/components/UiState";
import { api, type Category } from "@/lib/api";
import { useFavorites } from "@/lib/favorites";
import { useBusinessesSearch } from "@/lib/queries";

const filters = ["all", "restaurants", "cafes"] as const;

export default function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const favorites = useFavorites();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("all");
  const businessesQuery = useBusinessesSearch({});
  const [averageById, setAverageById] = useState<Record<number, number>>({});

  const localizedCategoryName = useMemo(() => {
    return (category?: Category) => {
      if (!category) return "";
      if (params.locale === "ar") return category.name_ar ?? category.name_en ?? category.name_fr ?? category.name_es ?? "";
      if (params.locale === "fr") return category.name_fr ?? category.name_en ?? category.name_es ?? category.name_ar ?? "";
      if (params.locale === "es") return category.name_es ?? category.name_en ?? category.name_fr ?? category.name_ar ?? "";
      return category.name_en ?? category.name_fr ?? category.name_es ?? category.name_ar ?? "";
    };
  }, [params.locale]);

  const visibleBusinesses = useMemo(() => {
    const businesses = businessesQuery.data ?? [];
    if (activeFilter === "all") return businesses;
    return businesses.filter((business) => {
      const label = localizedCategoryName(business.category).toLowerCase();
      if (activeFilter === "restaurants") return label.includes("restaurant");
      return label.includes("cafe") || label.includes("café");
    });
  }, [activeFilter, businessesQuery.data, localizedCategoryName]);

  useEffect(() => {
    if (!businessesQuery.data) return;
    const ids = visibleBusinesses.slice(0, 10).map((b) => b.id);
    if (ids.length === 0) return;

    let cancelled = false;
    void (async () => {
      const entries = await Promise.all(
        ids.map(async (id) => {
          try {
            const { average } = await api.getAverageRating(id);
            return [id, average] as const;
          } catch {
            return [id, 0] as const;
          }
        }),
      );
      if (cancelled) return;
      setAverageById((current) => {
        const next = { ...current };
        for (const [id, value] of entries) next[id] = value;
        return next;
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [businessesQuery.data, visibleBusinesses]);

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1f3d4a] text-white shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </span>
                <span className="text-xl font-extrabold tracking-[-0.05em] text-[#a36e00]">{tCommon("brand")}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                <span className="material-symbols-outlined text-[16px]">globe</span>
                {params.locale.toUpperCase()}
              </div>
            </div>

            <div className="mobile-fade-up mt-4 flex items-center gap-3 rounded-full bg-white px-4 py-3 mobile-search-shadow" style={{ animationDelay: "80ms" }}>
              <span className="material-symbols-outlined text-[#b9ad99]">search</span>
              <Link href={`/${params.locale}/discover`} className="flex-1 text-[14px] text-[#c0b7aa]">
                {t("searchCta")}
              </Link>
              <button
                type="button"
                onClick={() => router.push(`/${params.locale}/discover`)}
                className="mobile-pill h-9 w-9 bg-[#e2a11b] text-white"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>

            <div className="mobile-scrollbar-hidden mobile-fade-up mt-4 flex gap-3 overflow-x-auto pb-2" style={{ animationDelay: "140ms" }}>
              <button
                type="button"
              onClick={() => setActiveFilter("all")}
                className={`mobile-pill h-10 shrink-0 px-5 text-[12px] font-extrabold ${
                activeFilter === "all" ? "bg-[#9c6a00] text-white" : "bg-white text-[#746d64] mobile-search-shadow"
                }`}
              >
              {t("filters.all")}
              </button>
              <button
                type="button"
              onClick={() => setActiveFilter("restaurants")}
                className={`mobile-pill h-10 shrink-0 px-4 text-[12px] font-bold ${
                activeFilter === "restaurants"
                    ? "bg-[#9c6a00] text-white"
                    : "bg-white text-[#746d64] mobile-search-shadow"
                }`}
              >
                <span className="material-symbols-outlined mr-2 text-[16px] text-[#7b7b7b]">restaurant</span>
              {t("filters.restaurants")}
              </button>
              <button
                type="button"
              onClick={() => setActiveFilter("cafes")}
                className={`mobile-pill h-10 shrink-0 px-4 text-[12px] font-bold ${
                activeFilter === "cafes"
                    ? "bg-[#9c6a00] text-white"
                    : "bg-white text-[#746d64] mobile-search-shadow"
                }`}
              >
                <span className="material-symbols-outlined mr-2 text-[16px] text-[#d9a11a]">local_cafe</span>
              {t("filters.cafes")}
              </button>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            <div className="mobile-fade-up flex items-end justify-between" style={{ animationDelay: "200ms" }}>
              <div>
              <h2 className="text-[1.75rem] font-extrabold tracking-[-0.05em] text-[#25222d]">{t("nearYou")}</h2>
                <p className="mt-1 max-w-[220px] text-[13px] leading-5 text-[#7b7266]">
                {t("nearYouSubtitle")}
                </p>
              </div>
              <Link href={`/${params.locale}/discover`} className="text-sm font-bold text-[#a36e00]">
              {t("viewAll")}
              </Link>
            </div>

            <div className="mt-4 space-y-5">
              {businessesQuery.isLoading ? (
                <div className="space-y-5">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="mobile-card overflow-hidden">
                      <div className="h-[190px] bg-[#efece6]" />
                      <div className="px-4 py-4">
                        <SkeletonLine className="h-6 w-[70%]" />
                        <SkeletonLine className="mt-2 h-4 w-[45%]" />
                        <div className="mt-4 rounded-[18px] bg-[#f6f2ec] px-4 py-3">
                          <SkeletonLine className="h-4 w-[90%]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : businessesQuery.isError ? (
                <ErrorState
                  title={tCommon("errorTitle")}
                  description={tCommon("errorDescription")}
                  onRetry={() => businessesQuery.refetch()}
                  retryLabel={tCommon("retry")}
                />
              ) : visibleBusinesses.map((business, index) => (
                <Link
                  key={business.id}
                  href={`/${params.locale}/businesses/${business.id}`}
                  className="mobile-card mobile-card-hover mobile-fade-up block overflow-hidden"
                  style={{ animationDelay: `${260 + index * 80}ms` }}
                >
                  <div className="relative h-[190px] overflow-hidden">
                    {business.images?.[0] ? (
                      <OptimizedImage
                        src={business.images[0]}
                        alt={business.name}
                        width={900}
                        height={675}
                        sizes="100vw"
                        widths={[480, 640, 828, 900]}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#efece6]" />
                    )}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        void favorites.toggleFavorite(business.id);
                      }}
                      className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/88 text-[#9d958a] shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {favorites.isPending(business.id)
                          ? "progress_activity"
                          : favorites.isFavorite(business.id)
                            ? "bookmark"
                            : "bookmark_add"}
                      </span>
                    </button>
                  </div>
                  <div className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[1.45rem] font-extrabold tracking-[-0.05em] text-[#2a2730]">{business.name}</h3>
                        <p className="mt-1 text-[13px] font-semibold text-[#877c6a]">
                          {localizedCategoryName(business.category)}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-sm font-extrabold text-[#a36e00]">
                        <span className="material-symbols-outlined text-[16px]">star</span>
                        {(averageById[business.id] ?? 0).toFixed(1)}
                      </div>
                    </div>
                    <div className="mt-4 rounded-[18px] bg-[#f6f2ec] px-4 py-3 text-[12px] font-semibold leading-5 text-[#8a8173]">
                      <span className="material-symbols-outlined mr-2 align-middle text-[15px] text-[#c59d4a]">directions_walk</span>
                      {[business.city, business.regionRel?.name].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                </Link>
              ))}
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
