"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import MobileBottomNav from "@/components/MobileBottomNav";
import OptimizedImage from "@/components/OptimizedImage";
import type { Category, SearchFilters } from "@/lib/api";
import { useFavorites } from "@/lib/favorites";
import { useBusinessesSearch, useCategories, useRegions } from "@/lib/queries";

function getCategoryLabel(category: Category | undefined, locale: string) {
  if (!category) return "";
  if (locale === "ar") return category.name_ar ?? category.name_en ?? "";
  if (locale === "fr") return category.name_fr ?? category.name_en ?? "";
  if (locale === "es") return category.name_es ?? category.name_en ?? "";
  return category.name_en ?? "";
}

export default function DiscoverPage({
  params,
}: {
  params: { locale: string };
}) {
  const tCommon = useTranslations("common");
  const t = useTranslations("discover");
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [city, setCity] = useState("");
  const [regionId, setRegionId] = useState<number | undefined>(undefined);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [available, setAvailable] = useState(false);
  const [sortLabel, setSortLabel] = useState("Popularity");
  const [visibleCount, setVisibleCount] = useState(10);
  const favorites = useFavorites();

  const categoriesQuery = useCategories();
  const regionsQuery = useRegions();

  const filters: SearchFilters = useMemo(
    () => ({
      q,
      categoryId,
      city: city.trim() ? city.trim() : undefined,
      regionId,
      rating,
      available: available ? true : undefined,
    }),
    [available, categoryId, city, q, rating, regionId],
  );

  useEffect(() => {
    setVisibleCount(10);
  }, [filters]);

  const businessesQuery = useBusinessesSearch(filters);
  const businesses = businessesQuery.data ?? [];
  const visibleBusinesses = businesses.slice(0, visibleCount);
  const hasMore = visibleCount < businesses.length;

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <span className="text-xl font-extrabold tracking-[-0.05em] text-[#a36e00]">{tCommon("brand")}</span>
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                <span className="material-symbols-outlined text-[16px]">globe</span>
                {params.locale.toUpperCase()}
              </div>
            </div>

            <div className="mobile-fade-up mt-4 flex items-center gap-3 rounded-full bg-white px-4 py-3 mobile-search-shadow" style={{ animationDelay: "80ms" }}>
              <span className="material-symbols-outlined text-[#b9ad99]">search</span>
              <input
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="flex-1 bg-transparent text-[14px] font-semibold text-[#6d6459] outline-none"
              />
              <button type="button" onClick={() => setQ("")} className="text-[#c7b79d]">
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            </div>

            <div className="mobile-scrollbar-hidden mobile-fade-up mt-4 flex items-center gap-3 overflow-x-auto pb-2" style={{ animationDelay: "140ms" }}>
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#b27a00]">{t("filters.category")}</span>
                <select
                  value={categoryId?.toString() ?? ""}
                  onChange={(event) => setCategoryId(event.target.value ? Number(event.target.value) : undefined)}
                  className="bg-transparent text-[12px] font-bold text-[#7f7669] outline-none"
                >
                  <option value="">{t("filters.all")}</option>
                  {(categoriesQuery.data ?? []).map((category) => (
                    <option key={category.id} value={category.id}>
                      {getCategoryLabel(category, params.locale)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#b27a00]">{t("filters.city")}</span>
                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="w-[120px] bg-transparent text-[12px] font-bold text-[#7f7669] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#b27a00]">{t("filters.region")}</span>
                <select
                  value={regionId?.toString() ?? ""}
                  onChange={(event) => setRegionId(event.target.value ? Number(event.target.value) : undefined)}
                  className="bg-transparent text-[12px] font-bold text-[#7f7669] outline-none"
                >
                  <option value="">{t("filters.all")}</option>
                  {(regionsQuery.data ?? []).map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#b27a00]">{t("filters.rating")}</span>
                <select
                  value={rating?.toString() ?? ""}
                  onChange={(event) => setRating(event.target.value ? Number(event.target.value) : undefined)}
                  className="bg-transparent text-[12px] font-bold text-[#7f7669] outline-none"
                >
                  <option value="">{t("filters.all")}</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setAvailable((current) => !current)}
                className={`mobile-pill h-10 shrink-0 px-4 text-[11px] font-extrabold uppercase tracking-[0.12em] ${
                  available ? "bg-[#9c6a00] text-white" : "bg-[#efede8] text-[#9c9388]"
                }`}
              >
                {t("filters.availability")}
              </button>

              <button
                type="button"
                onClick={() =>
                  setSortLabel((current) =>
                    current === "Popularity" ? "Distance" : "Popularity",
                  )
                }
                className="mobile-pill h-10 w-10 shrink-0 bg-white text-[#b7aa95] mobile-search-shadow"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            <div className="mobile-fade-up mt-3 flex items-end justify-between" style={{ animationDelay: "200ms" }}>
              <div className="flex items-baseline gap-2">
                <h2 className="text-[1.7rem] font-extrabold tracking-[-0.05em] text-[#25222d]">
                  {t("results", { count: businesses.length })}
                </h2>
                <p className="text-[13px] text-[#8b816f]">
                  {t("sortedBy")}{" "}
                  <span className="font-extrabold text-[#b27a00]">{sortLabel}</span>
                </p>
              </div>
            </div>

            {favorites.error ? (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-[18px] border border-[#f1d0d0] bg-white px-4 py-3 text-[12px] font-bold text-[#9b3e3e] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
                <span className="min-w-0 flex-1 truncate">{favorites.error}</span>
                <button type="button" onClick={favorites.clearError} className="shrink-0 text-[#9b3e3e]">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ) : null}

            {businessesQuery.isLoading ? (
              <div className="mt-6 rounded-[26px] border border-[#ece2d3] bg-white px-4 py-4 text-[14px] font-bold text-[#7f7669] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
                Loading…
              </div>
            ) : businessesQuery.isError ? (
              <div className="mt-6 rounded-[26px] border border-[#f1d0d0] bg-white px-4 py-4 text-[14px] font-bold text-[#9b3e3e] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
                {t("error")}
              </div>
            ) : businesses.length === 0 ? (
              <div className="mt-6 rounded-[26px] border border-[#ece2d3] bg-white px-4 py-4 text-[14px] font-bold text-[#7f7669] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
                {t("noResults")}
              </div>
            ) : (
              <div className="mt-4 space-y-5">
                {visibleBusinesses.map((business, index) => (
                  <div
                    key={business.id}
                    className="mobile-fade-up"
                    style={{ animationDelay: `${260 + index * 80}ms` }}
                  >
                    <Link
                      href={`/${params.locale}/businesses/${business.id}`}
                      className="flex items-start gap-4"
                    >
                      {business.images?.[0] ? (
                        <OptimizedImage
                          src={business.images[0]}
                          alt={business.name}
                          width={82}
                          height={82}
                          sizes="82px"
                          widths={[82, 164]}
                          className="h-[82px] w-[82px] rounded-full object-cover shadow-md"
                        />
                      ) : (
                        <div className="h-[82px] w-[82px] rounded-full bg-[#efece6]" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-[1.4rem] font-extrabold leading-tight tracking-[-0.05em] text-[#2a2730]">
                              {business.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-2">
                              {getCategoryLabel(business.category, params.locale) ? (
                                <span className="rounded-full bg-[#ebf8ef] px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0c9159]">
                                  {getCategoryLabel(business.category, params.locale)}
                                </span>
                              ) : null}
                              {business.city ? (
                                <span className="text-[12px] font-semibold text-[#8a8173]">
                                  {business.city}
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              void favorites.toggleFavorite(business.id);
                            }}
                            disabled={favorites.isPending(business.id)}
                            className={`text-[#c7b9a1] ${favorites.isPending(business.id) ? "opacity-60" : ""}`}
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

                        {business.description ? (
                          <p className="mt-2 max-h-10 overflow-hidden text-[12px] leading-5 text-[#8a8173]">
                            {business.description}
                          </p>
                        ) : null}

                        {business.status ? (
                          <div className="mt-3">
                            <span className="mobile-badge-gray rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em]">
                              {business.status}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </Link>
                  </div>
                ))}

                {hasMore ? (
                  <button
                    type="button"
                    onClick={() => setVisibleCount((current) => current + 10)}
                    className="mobile-pill mobile-button-secondary h-12 w-full text-[13px] font-extrabold uppercase tracking-[0.14em]"
                  >
                    {t("loadMore")}
                  </button>
                ) : null}
              </div>
            )}
          </div>

          <div className="px-4 pb-4 pt-2">
            <MobileBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
