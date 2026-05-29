"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import MobileBottomNav from "@/components/MobileBottomNav";
import LeafletBusinessesMap from "@/components/map/LeafletBusinessesMap";
import type { Category, SearchFilters } from "@/lib/api";
import { haversineKm } from "@/lib/geo";
import { useBusinessesSearch, useCategories, useRegions } from "@/lib/queries";

function getCategoryLabel(category: Category | undefined, locale: string) {
  if (!category) return "";
  if (locale === "ar") return category.name_ar ?? category.name_en ?? "";
  if (locale === "fr") return category.name_fr ?? category.name_en ?? "";
  if (locale === "es") return category.name_es ?? category.name_en ?? "";
  return category.name_en ?? "";
}

function getLatLngForBusiness(business: { lat?: number | null; lng?: number | null; city?: string | null }) {
  if (typeof business.lat === "number" && typeof business.lng === "number") {
    return { lat: business.lat, lng: business.lng };
  }

  const city = (business.city ?? "").trim().toLowerCase();
  if (!city) return null;

  const cityCenters: Record<string, { lat: number; lng: number }> = {
    "fès": { lat: 34.0331, lng: -5.0003 },
    "fes": { lat: 34.0331, lng: -5.0003 },
    "marrakech": { lat: 31.6295, lng: -7.9811 },
    "casablanca": { lat: 33.5731, lng: -7.5898 },
    "rabat": { lat: 34.0209, lng: -6.8416 },
    "tanger": { lat: 35.7595, lng: -5.834 },
    "tangier": { lat: 35.7595, lng: -5.834 },
    "agadir": { lat: 30.4278, lng: -9.5981 },
  };

  return cityCenters[city] ?? null;
}

export default function MapPage({
  params,
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const t = useTranslations("map");
  const categoriesQuery = useCategories();
  const regionsQuery = useRegions();

  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [regionId, setRegionId] = useState<number | undefined>(undefined);
  const [radiusKm, setRadiusKm] = useState(5);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const filters: SearchFilters = useMemo(
    () => ({
      q,
      categoryId,
      regionId,
    }),
    [categoryId, q, regionId],
  );

  const businessesQuery = useBusinessesSearch(filters);
  const businesses = businessesQuery.data ?? [];

  const businessesInRadius = useMemo(() => {
    if (!userLocation) return businesses;
    return businesses.filter((business) => {
      const coords = getLatLngForBusiness(business);
      if (!coords) return false;
      return (
        haversineKm(userLocation.lat, userLocation.lng, coords.lat, coords.lng) <= radiusKm
      );
    });
  }, [businesses, radiusKm, userLocation]);

  const handleLocateMe = () => {
    setLocationError(null);
    setIsLocating(true);

    if (!navigator.geolocation) {
      setLocationError(t("geo.notSupported"));
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLocating(false);
      },
      () => {
        setLocationError(t("geo.failed"));
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light overflow-hidden">
        <div className="mobile-map-surface mobile-content flex min-h-[calc(100vh-32px)] flex-col bg-[#fbfaf6]">
          <div className="px-4 pb-4 pt-5">
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
              <button
                type="button"
                onClick={handleLocateMe}
                disabled={isLocating}
                className={`mobile-pill h-10 shrink-0 px-4 text-[11px] font-extrabold uppercase tracking-[0.12em] ${
                  isLocating ? "bg-[#efede8] text-[#9c9388]" : "bg-[#0c9159] text-white"
                }`}
              >
                <span className="material-symbols-outlined mr-2 text-[16px]">
                  {isLocating ? "hourglass_top" : "my_location"}
                </span>
                {isLocating ? t("geo.locating") : t("geo.locateMe")}
              </button>

              {userLocation ? (
                <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#0c9159]">{t("radius.label")}</span>
                  <select
                    value={radiusKm.toString()}
                    onChange={(event) => setRadiusKm(Number(event.target.value))}
                    className="bg-transparent text-[12px] font-bold text-[#7f7669] outline-none"
                  >
                    <option value="1">1 km</option>
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="25">25 km</option>
                    <option value="50">50 km</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setUserLocation(null)}
                    className="text-[#b27a00]"
                  >
                    {t("radius.clear")}
                  </button>
                </div>
              ) : null}

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
            </div>
          </div>

          <div className="relative flex-1">
            <LeafletBusinessesMap
              businesses={businessesInRadius}
              locale={params.locale}
              userLocation={userLocation}
              radiusKm={userLocation ? radiusKm : null}
              onBusinessClick={(business) => router.push(`/${params.locale}/businesses/${business.id}`)}
            />

            {businessesQuery.isLoading ? (
              <div className="absolute inset-0 grid place-items-center bg-white/60 backdrop-blur-sm">
                <div className="rounded-full bg-white px-4 py-2 text-[13px] font-extrabold text-[#7f7669] shadow-[0_10px_28px_rgba(31,26,10,0.16)]">
                  {t("loading")}
                </div>
              </div>
            ) : null}

            {businessesQuery.isError ? (
              <div className="absolute left-4 right-4 top-4 rounded-[22px] border border-[#f1d0d0] bg-white px-4 py-3 text-[13px] font-bold text-[#9b3e3e] shadow-[0_10px_28px_rgba(31,26,10,0.16)]">
                {t("error")}
              </div>
            ) : null}

            {locationError ? (
              <div className="absolute left-4 right-4 top-4 rounded-[22px] border border-[#f1d0d0] bg-white px-4 py-3 text-[13px] font-bold text-[#9b3e3e] shadow-[0_10px_28px_rgba(31,26,10,0.16)]">
                {locationError}
              </div>
            ) : null}

            <div className="mobile-slide-up absolute bottom-24 left-0 right-0 rounded-t-[34px] bg-[#fbfaf6] px-5 pb-6 pt-6 shadow-[0_-14px_35px_rgba(33,24,8,0.12)]">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-[1.7rem] font-extrabold tracking-[-0.05em] text-[#25222d]">
                    {t("results", { count: businessesInRadius.length })}
                  </h2>
                  <p className="mt-1 text-[13px] text-[#8b816f]">{t("subtitle")}</p>
                </div>
                <Link href={`/${params.locale}/discover`} className="text-sm font-bold text-[#a36e00]">
                  {t("viewAll")}
                </Link>
              </div>

              {businessesInRadius.length === 0 ? (
                <div className="mt-4 rounded-[26px] border border-[#ece2d3] bg-white px-4 py-4 text-[14px] font-bold text-[#7f7669] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
                  {t("noResults")}
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {businessesInRadius.slice(0, 3).map((business) => (
                    <Link
                      key={business.id}
                      href={`/${params.locale}/businesses/${business.id}`}
                      className="flex items-center gap-3 rounded-[22px] border border-[#ece2d3] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(31,26,10,0.05)]"
                    >
                      {business.images?.[0] ? (
                        <img
                          src={business.images[0]}
                          alt={business.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-[#efece6]" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-extrabold text-[#2a2730]">{business.name}</p>
                        <p className="mt-1 truncate text-[12px] font-semibold text-[#8a8173]">
                          {business.city ? business.city : getCategoryLabel(business.category, params.locale)}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-[#c7b9a1]">
                        chevron_right
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <MobileBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
