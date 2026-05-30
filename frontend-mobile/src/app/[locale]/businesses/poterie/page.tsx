"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import OptimizedImage from "@/components/OptimizedImage";
import { API_BASE_URL, api, type Business } from "@/lib/api";
import { haversineKm } from "@/lib/geo";
import { useFavorites } from "@/lib/favorites";

const languageChips = ["EN", "FR", "AR", "ES"] as const;
type LanguageChip = (typeof languageChips)[number];

function localeToChip(locale: string): LanguageChip {
  const normalized = locale.toLowerCase();
  if (normalized === "fr") return "FR";
  if (normalized === "ar") return "AR";
  if (normalized === "es") return "ES";
  return "EN";
}

export default function PoteriePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("poterie");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const favorites = useFavorites();
  const [activeLanguage, setActiveLanguage] = useState<LanguageChip>(() => localeToChip(params.locale));
  const [hoursExpanded, setHoursExpanded] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessError, setBusinessError] = useState(false);
  const [rating, setRating] = useState<{ average: number; count: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [generatedByLang, setGeneratedByLang] = useState<Partial<Record<LanguageChip, string>>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const businessId = 1;
  const primaryImage = useMemo(() => business?.images?.[0] ?? null, [business?.images]);

  useEffect(() => {
    setActiveLanguage(localeToChip(params.locale));
  }, [params.locale]);

  useEffect(() => {
    let cancelled = false;
    setBusiness(null);
    setBusinessError(false);
    setRating(null);
    void (async () => {
      try {
        const [businessData, ratingData] = await Promise.all([
          api.getBusinessById(businessId),
          api.getAverageRating(businessId),
        ]);
        if (cancelled) return;
        setBusiness(businessData);
        setRating(ratingData);
      } catch {
        if (cancelled) return;
        setBusinessError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!business?.lat || !business?.lng) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const km = haversineKm(position.coords.latitude, position.coords.longitude, business.lat!, business.lng!);
        setDistanceKm(km);
      },
      () => {
        setDistanceKm(null);
      },
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 8_000 },
    );
  }, [business?.lat, business?.lng]);

  useEffect(() => {
    if (!business) return;
    if (generatedByLang[activeLanguage]) return;
    if (isGenerating) return;

    let cancelled = false;
    setIsGenerating(true);
    void (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/ai1/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessType: business.name,
            specialties: [business.category?.name_en, business.category?.name_fr, business.category?.name_ar, business.category?.name_es]
              .filter(Boolean)
              .slice(0, 1),
            usps: business.description,
            language: activeLanguage,
            tone: "storytelling",
            audience: "tourists",
            tags: [business.city, business.regionRel?.name].filter(Boolean),
          }),
        });
        if (!response.ok) throw new Error("Request failed");
        const payload = (await response.json()) as { data?: { text?: string } };
        const text = payload.data?.text ?? "";
        if (cancelled) return;
        setGeneratedByLang((current) => ({ ...current, [activeLanguage]: text || current[activeLanguage] || "" }));
      } catch {
        if (cancelled) return;
        setGeneratedByLang((current) => ({ ...current, [activeLanguage]: "" }));
      } finally {
        if (!cancelled) setIsGenerating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeLanguage, business, generatedByLang, isGenerating]);

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone overflow-hidden bg-[#faf8f2]">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col">
          <div className="relative h-[310px]">
            {primaryImage ? (
              <OptimizedImage
                src={primaryImage}
                alt={business?.name ?? t("heroAlt")}
                width={1200}
                height={900}
                sizes="100vw"
                widths={[640, 828, 1080, 1200]}
                priority
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-[#efece6]" />
            )}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
              <Link href={`/${params.locale}/map`} className="grid h-9 w-9 place-items-center rounded-full bg-white/86 text-[#70685c] shadow-sm">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </Link>
              <button
                type="button"
                onClick={() => void favorites.toggleFavorite(businessId)}
                disabled={favorites.isPending(businessId)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/86 text-[#70685c] shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {favorites.isPending(businessId)
                    ? "progress_activity"
                    : favorites.isFavorite(businessId)
                      ? "favorite"
                      : "favorite_border"}
                </span>
              </button>
            </div>
          </div>

          <div className="-mt-8 flex-1 rounded-t-[34px] bg-[#faf8f2] px-5 pb-6 pt-6">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f7d98f] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9a6b03]">
                {t("badges.artisanWorkshop")}
              </span>
              <span className="rounded-full bg-[#dff7ea] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#178f60]">
                {t("badges.localFavorite")}
              </span>
            </div>

            <h1 className="mt-4 text-[2.35rem] font-extrabold leading-[0.95] tracking-[-0.07em] text-[#23212c]">
              {business?.name ?? tCommon("loading")}
            </h1>
            <p className="mt-2 text-[15px] text-[#70685d]">{[business?.user?.address, business?.city].filter(Boolean).join(" · ")}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#7c7367]">
              <span className="flex items-center gap-1 font-extrabold text-[#a36e00]">
                <span className="material-symbols-outlined text-[16px]">star</span>
                {(rating?.average ?? 0).toFixed(1)}{" "}
                <span className="font-semibold text-[#8d8476]">({t("reviewsCount", { count: String(rating?.count ?? 0) })})</span>
              </span>
              <span>{tCommon("openNow")}</span>
              {distanceKm !== null ? (
                <span>{t("distanceAway", { distance: `${distanceKm.toFixed(1)} km` })}</span>
              ) : null}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-full border border-[#ece3d4] bg-white/80 px-2 py-2 shadow-[0_8px_24px_rgba(31,26,10,0.06)]">
              <button
                type="button"
                onClick={() => {
                  const phone = business?.user?.phone;
                  if (!phone) return;
                  if (typeof window !== "undefined") window.location.href = `tel:${phone}`;
                }}
                className="mobile-pill h-11 flex-1 text-[13px] font-bold text-[#7b7367]"
              >
                <span className="material-symbols-outlined mr-2 text-[18px] text-[#a36e00]">call</span>
                {t("actions.call")}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/${params.locale}/map`)}
                className="mobile-pill h-11 flex-1 text-[13px] font-bold text-[#7b7367]"
              >
                <span className="material-symbols-outlined mr-2 text-[18px] text-[#a36e00]">directions</span>
                {t("actions.directions")}
              </button>
              <button
                type="button"
                onClick={() => setHoursExpanded((current) => !current)}
                className="mobile-pill h-11 w-11 text-[#7b7367]"
              >
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
            </div>

            <div className="mt-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[1.5rem] font-extrabold tracking-[-0.05em] text-[#23212c]">{t("generatedLine1")}</h2>
                  <p className="text-[1.45rem] font-semibold tracking-[-0.05em] text-[#23212c]">{t("generatedLine2")}</p>
                </div>
                <div className="flex rounded-full bg-[#f1ece4] p-1">
                  {languageChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setActiveLanguage(chip)}
                      className={`mobile-pill h-8 px-3 text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                        activeLanguage === chip
                          ? "bg-white text-[#a36e00] shadow-sm"
                          : "text-[#a49a8a]"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-[26px] border border-[#eadfce] bg-white px-4 py-4 text-[13px] leading-6 text-[#7a7266] shadow-[0_10px_25px_rgba(31,26,10,0.05)]">
                {businessError ? tCommon("errorDescription") : (generatedByLang[activeLanguage] ?? (isGenerating ? tCommon("loading") : ""))}
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between rounded-[20px] bg-white/70 px-4 py-4 text-[14px] font-bold text-[#5b544b] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#8d8476]">schedule</span>
                {t("openingHours")}
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#8d8476]">expand_more</span>
            </div>
            {hoursExpanded ? (
              <div className="mt-3 rounded-[20px] border border-[#ece2d3] bg-white px-4 py-4 text-[13px] leading-6 text-[#746c61] shadow-[0_8px_24px_rgba(31,26,10,0.04)]">
                <div className="flex items-center justify-between">
                  <span>{t("hours.mondaySaturday")}</span>
                  <span className="font-extrabold text-[#a36e00]">09:00 - 19:00</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>{t("hours.sunday")}</span>
                  <span className="font-extrabold text-[#8d8476]">{t("hours.closed")}</span>
                </div>
              </div>
            ) : null}

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-[1.55rem] font-extrabold tracking-[-0.05em] text-[#23212c]">
                  {t("experienceTitle")}
                </h2>
              </div>

              <div className="mobile-scrollbar-hidden mt-4 grid grid-cols-2 gap-3 overflow-x-auto">
                {(business?.images ?? []).slice(0, 4).map((image, index) => (
                  <div key={image} className="relative overflow-hidden rounded-[22px]">
                    <OptimizedImage
                      src={image}
                      alt={t("galleryAlt", { index: index + 1 })}
                      width={360}
                      height={276}
                      sizes="50vw"
                      widths={[180, 360, 540]}
                      className="h-[92px] w-full object-cover"
                    />
                    {index === 3 && (business?.images?.length ?? 0) > 4 && (
                      <div className="absolute inset-0 grid place-items-center bg-black/45 text-xl font-extrabold text-white">
                        +{(business?.images?.length ?? 4) - 3}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <h2 className="text-[1.45rem] font-extrabold tracking-[-0.05em] text-[#23212c]">
                {t("storiesTitle")}
              </h2>
              <Link href={`/${params.locale}/discover`} className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#b27a00]">
                {t("seeAll")}
              </Link>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/${params.locale}/map`)}
              className="mobile-pill mobile-button-gold mt-5 h-14 w-full text-base font-extrabold"
            >
              <span className="material-symbols-outlined mr-2 text-[18px]">route</span>
              {t("getDirections")}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
