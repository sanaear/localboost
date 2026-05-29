"use client";

import Link from "next/link";
import { useState } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";
import { savedPlaces } from "@/lib/mobileData";

export default function SavedPage({
  params,
}: {
  params: { locale: string };
}) {
  const [places, setPlaces] = useState(savedPlaces);

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
                EN
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
                <div className="text-[1.5rem] font-extrabold text-[#8d6513]">{places.length}</div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9a8f7f]">items</div>
              </div>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            <div className="space-y-4">
              {places.map((place, index) => (
                <Link
                  key={place.id}
                  href={place.id === "hassan-mosque" ? `/${params.locale}/map` : `/${params.locale}/businesses/poterie`}
                  className="mobile-card mobile-card-hover mobile-fade-up block overflow-hidden"
                  style={{ animationDelay: `${160 + index * 70}ms` }}
                >
                  <div className="relative h-[170px] overflow-hidden">
                    <img src={place.image} alt={place.name} className="h-full w-full object-cover" />
                    <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] mobile-badge-green">
                      {place.tag}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setPlaces((current) => current.filter((item) => item.id !== place.id));
                      }}
                      className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/88 text-[#d3b157] shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                    </button>
                  </div>
                  <div className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[1.32rem] font-extrabold tracking-[-0.05em] text-[#2a2730]">{place.name}</h3>
                        <p className="mt-1 text-[12px] font-semibold text-[#8b816f]">{place.location}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[12px] font-extrabold text-[#a36e00]">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        {place.rating}
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
          </div>

          <div className="px-4 pb-4 pt-2">
            <MobileBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
