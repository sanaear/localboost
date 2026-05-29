"use client";

import Link from "next/link";
import { useState } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";
import { resultCards } from "@/lib/mobileData";

const chips = ["All", "Restaurants", "Museums"];

export default function DiscoverPage({
  params,
}: {
  params: { locale: string };
}) {
  const [activeChip, setActiveChip] = useState("Restaurants");
  const [query, setQuery] = useState("restaurant fes medina");
  const [savedCards, setSavedCards] = useState<Record<string, boolean>>({});
  const [sortLabel, setSortLabel] = useState("Popularity");

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <span className="text-xl font-extrabold tracking-[-0.05em] text-[#a36e00]">LocalBoost</span>
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                <span className="material-symbols-outlined text-[16px]">globe</span>
                EN
              </div>
            </div>

            <div className="mobile-fade-up mt-4 flex items-center gap-3 rounded-full bg-white px-4 py-3 mobile-search-shadow" style={{ animationDelay: "80ms" }}>
              <span className="material-symbols-outlined text-[#b9ad99]">search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="flex-1 bg-transparent text-[14px] font-semibold text-[#6d6459] outline-none"
              />
              <button type="button" onClick={() => setQuery("")} className="text-[#c7b79d]">
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            </div>

            <div className="mobile-scrollbar-hidden mobile-fade-up mt-4 flex items-center gap-3 overflow-x-auto pb-2" style={{ animationDelay: "140ms" }}>
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActiveChip(chip)}
                  className={`mobile-pill h-10 shrink-0 px-4 text-[11px] font-extrabold uppercase tracking-[0.12em] ${
                    activeChip === chip
                      ? "bg-[#9c6a00] text-white"
                      : "bg-[#efede8] text-[#9c9388]"
                  }`}
                >
                  {chip === "Restaurants" && <span className="material-symbols-outlined mr-2 text-[16px]">restaurant</span>}
                  {chip}
                </button>
              ))}
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
                <h2 className="text-[1.7rem] font-extrabold tracking-[-0.05em] text-[#25222d]">12 results</h2>
                <p className="text-[13px] text-[#8b816f]">
                  Sorted by <span className="font-extrabold text-[#b27a00]">{sortLabel}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-5">
              {resultCards.map((card, index) => (
                <div
                  key={card.id}
                  className="mobile-fade-up"
                  style={{ animationDelay: `${260 + index * 80}ms` }}
                >
                  {card.id === "dar-tajine" && (
                    <div className="mb-4 rounded-[26px] border border-[#eedeb2] bg-[#f5eed8] p-4">
                      <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#a67918]">
                        <span className="material-symbols-outlined text-[15px]">emoji_events</span>
                        World Cup 2030 Partner
                      </div>
                      <h3 className="mt-2 text-[1.35rem] font-extrabold tracking-[-0.05em] text-[#332f29]">
                        Fan Zone Favorites
                      </h3>
                      <p className="mt-1 max-w-[260px] text-[13px] leading-5 text-[#7f7667]">
                        Top-rated spots near the Official FIFA Fan Festival at the Medina gates.
                      </p>
                    </div>
                  )}

                  <Link
                    href={card.id === "dar-tajine" ? `/${params.locale}/businesses/poterie` : `/${params.locale}/map`}
                    className="flex items-start gap-4"
                  >
                    <img src={card.image} alt={card.name} className="h-[82px] w-[82px] rounded-full object-cover shadow-md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[1.4rem] font-extrabold leading-tight tracking-[-0.05em] text-[#2a2730]">
                            {card.name}
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="rounded-full bg-[#ebf8ef] px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0c9159]">
                              {card.category}
                            </span>
                            <span className="flex items-center gap-1 text-[13px] font-extrabold text-[#a36e00]">
                              <span className="material-symbols-outlined text-[14px]">star</span>
                              {card.rating}
                            </span>
                          </div>
                        </div>
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
                          className="text-[#c7b9a1]"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {savedCards[card.id] ? "bookmark" : "bookmark_add"}
                          </span>
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold text-[#8a8173]">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">place</span>
                          {card.distance}
                        </span>
                        <span>{card.price}</span>
                        <span>{card.area}</span>
                      </div>
                      <div className="mt-3">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${
                          card.statusTone === "green"
                            ? "mobile-badge-green"
                            : card.statusTone === "amber"
                              ? "mobile-badge-amber"
                              : "mobile-badge-gray"
                        }`}>
                          {card.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
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
