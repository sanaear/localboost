"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import MobileBottomNav from "@/components/MobileBottomNav";
import OptimizedImage from "@/components/OptimizedImage";
import { feedCards } from "@/lib/mobileData";

const filters = ["all", "restaurants", "cafes"] as const;

export default function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("all");
  const [savedCards, setSavedCards] = useState<Record<string, boolean>>({});

  const subtitleLabelByCard = useMemo(() => {
    return {
      Restaurants: t("filters.restaurants"),
      Cafes: t("filters.cafes"),
      All: t("filters.all"),
    } as Record<string, string>;
  }, [t]);

  const metaById = useMemo(() => {
    return {
      "dar-hatim": t("feed.darHatimMeta"),
    } as Record<string, string>;
  }, [t]);

  const badgeLabel = useMemo(() => {
    return (badge: string) => {
      if (badge === "Open now") return tCommon("openNow");
      const closesMatch = badge.match(/^Closes\s+(.+)$/i);
      if (closesMatch?.[1]) return tCommon("closesAt", { time: closesMatch[1] });
      return badge;
    };
  }, [tCommon]);
  const visibleCards = useMemo(() => {
    if (activeFilter === "all") {
      return feedCards;
    }

    return feedCards.filter((card) =>
      activeFilter === "restaurants" ? card.subtitle === "Restaurants" : card.subtitle === "Cafes",
    );
  }, [activeFilter]);

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
              {visibleCards.map((card, index) => (
                <Link
                  key={card.id}
                  href={card.id === "dar-hatim" ? `/${params.locale}/businesses/poterie` : `/${params.locale}/discover`}
                  className="mobile-card mobile-card-hover mobile-fade-up block overflow-hidden"
                  style={{ animationDelay: `${260 + index * 80}ms` }}
                >
                  <div className="relative h-[190px] overflow-hidden">
                    <OptimizedImage
                      src={card.image}
                      alt={card.name}
                      width={900}
                      height={675}
                      sizes="100vw"
                      widths={[480, 640, 828, 900]}
                      className="h-full w-full object-cover"
                    />
                    <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                      card.badgeTone === "green" ? "mobile-badge-green" : "mobile-badge-gold"
                    }`}>
                      {badgeLabel(card.badge)}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setSavedCards((current) => ({
                          ...current,
                          [card.id]: !current[card.id],
                        }));
                      }}
                      className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/88 text-[#9d958a] shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {savedCards[card.id] ? "bookmark" : "bookmark_add"}
                      </span>
                    </button>
                  </div>
                  <div className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[1.45rem] font-extrabold tracking-[-0.05em] text-[#2a2730]">{card.name}</h3>
                        <p className="mt-1 text-[13px] font-semibold text-[#877c6a]">{subtitleLabelByCard[card.subtitle] ?? card.subtitle}</p>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-sm font-extrabold text-[#a36e00]">
                        <span className="material-symbols-outlined text-[16px]">star</span>
                        {card.rating}
                      </div>
                    </div>
                    <div className="mt-4 rounded-[18px] bg-[#f6f2ec] px-4 py-3 text-[12px] font-semibold leading-5 text-[#8a8173]">
                      <span className="material-symbols-outlined mr-2 align-middle text-[15px] text-[#c59d4a]">directions_walk</span>
                      {metaById[card.id] ?? card.meta}
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
