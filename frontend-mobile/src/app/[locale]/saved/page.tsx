"use client";

import Link from "next/link";
import { useMemo } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";
import type { SearchFilters } from "@/lib/api";
import { useFavorites } from "@/lib/favorites";
import { useBusinessesSearch } from "@/lib/queries";

export default function SavedPage({
  params,
}: {
  params: { locale: string };
}) {
  const favorites = useFavorites();
  const filters: SearchFilters = useMemo(() => ({}), []);
  const businessesQuery = useBusinessesSearch(filters);
  const businesses = businessesQuery.data ?? [];
  const favoriteBusinesses = useMemo(
    () => businesses.filter((business) => favorites.favoritesSet.has(business.id)),
    [businesses, favorites.favoritesSet],
  );

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1e3345] text-white shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </span>
                <h1 className="text-xl font-extrabold tracking-[-0.05em] text-[#a36e00]">LocalBoost</h1>
              </div>
              <div className="rounded-full bg-white px-3 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                {params.locale.toUpperCase()}
              </div>
            </div>

            <div className="mobile-fade-up mt-6 flex items-start justify-between" style={{ animationDelay: "90ms" }}>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#c4b8a3]">Your collection</p>
                <h2 className="mt-1 text-[2.8rem] font-extrabold leading-[0.92] tracking-[-0.08em] text-[#23212d]">
                  Saved
                  <br />
                  Places
                </h2>
              </div>
              <div className="rounded-[22px] bg-[#f4efe5] px-4 py-3 text-center">
                <div className="text-[1.5rem] font-extrabold text-[#8d6513]">{favoriteBusinesses.length}</div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9a8f7f]">items</div>
              </div>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            {favorites.error ? (
              <div className="mb-4 flex items-center justify-between gap-3 rounded-[18px] border border-[#f1d0d0] bg-white px-4 py-3 text-[12px] font-bold text-[#9b3e3e] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
                <span className="min-w-0 flex-1 truncate">{favorites.error}</span>
                <button type="button" onClick={favorites.clearError} className="shrink-0 text-[#9b3e3e]">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ) : null}

            {businessesQuery.isLoading ? (
              <div className="mt-3 rounded-[26px] border border-[#ece2d3] bg-white px-4 py-4 text-[14px] font-bold text-[#7f7669] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
                Loading…
              </div>
            ) : businessesQuery.isError ? (
              <div className="mt-3 rounded-[26px] border border-[#f1d0d0] bg-white px-4 py-4 text-[14px] font-bold text-[#9b3e3e] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
                Unable to load saved places
              </div>
            ) : favoriteBusinesses.length === 0 ? (
              <div className="mt-3 rounded-[26px] border border-[#ece2d3] bg-white px-4 py-4 text-[14px] font-bold text-[#7f7669] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
                No saved places yet
              </div>
            ) : (
              <div className="space-y-4">
                {favoriteBusinesses.map((business, index) => (
                  <Link
                    key={business.id}
                    href={`/${params.locale}/businesses/${business.id}`}
                    className="mobile-card mobile-card-hover mobile-fade-up block overflow-hidden"
                    style={{ animationDelay: `${160 + index * 70}ms` }}
                  >
                    <div className="relative h-[170px] overflow-hidden">
                      {business.images?.[0] ? (
                        <img src={business.images[0]} alt={business.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-[#efece6]" />
                      )}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          void favorites.setFavorite(business.id, false);
                        }}
                        disabled={favorites.isPending(business.id)}
                        className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/88 text-[#d3b157] shadow-sm ${favorites.isPending(business.id) ? "opacity-60" : ""}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {favorites.isPending(business.id) ? "progress_activity" : "favorite"}
                        </span>
                      </button>
                    </div>
                    <div className="px-4 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-[1.32rem] font-extrabold tracking-[-0.05em] text-[#2a2730]">{business.name}</h3>
                          <p className="mt-1 text-[12px] font-semibold text-[#8b816f]">{business.city ?? ""}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="mobile-pill h-11 w-full bg-[#f2f0eb] text-[13px] font-bold text-[#6f675b]">
                          View Details
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
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
