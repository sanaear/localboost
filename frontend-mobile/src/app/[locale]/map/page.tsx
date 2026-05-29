"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MobileBottomNav from "@/components/MobileBottomNav";
import { mapCards } from "@/lib/mobileData";

export default function MapPage({
  params,
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Open now");

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light overflow-hidden">
        <div className="mobile-map-surface mobile-content flex min-h-[calc(100vh-32px)] flex-col">
          <div className="px-4 pb-4 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1f3d4a] text-white shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </span>
                <span className="text-xl font-extrabold tracking-[-0.05em] text-[#a36e00]">LocalBoost</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                <span className="material-symbols-outlined text-[16px]">globe</span>
                EN
              </div>
            </div>

            <div className="mobile-glass mobile-fade-up mobile-search-shadow mt-4 flex items-center gap-3 rounded-full px-4 py-3" style={{ animationDelay: "80ms" }}>
              <span className="material-symbols-outlined text-[#b9ad99]">search</span>
              <span className="flex-1 text-[14px] font-semibold text-[#9b8f7c]">Search Fès Medina</span>
              <button
                type="button"
                onClick={() => router.push(`/${params.locale}/discover`)}
                className="text-[#c6b796]"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>

            <div className="mobile-scrollbar-hidden mobile-fade-up mt-4 flex gap-3 overflow-x-auto pb-2" style={{ animationDelay: "140ms" }}>
              <button
                type="button"
                onClick={() => setActiveFilter("Open now")}
                className={`mobile-pill h-10 shrink-0 px-4 text-[11px] font-extrabold uppercase tracking-[0.12em] ${
                  activeFilter === "Open now"
                    ? "bg-[#9c6a00] text-white"
                    : "bg-white text-[#7c7468] mobile-search-shadow"
                }`}
              >
                <span className="material-symbols-outlined mr-2 text-[15px]">schedule</span>
                Open now
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("Restaurants")}
                className={`mobile-pill h-10 shrink-0 px-4 text-[11px] font-extrabold uppercase tracking-[0.12em] ${
                  activeFilter === "Restaurants"
                    ? "bg-[#9c6a00] text-white"
                    : "bg-white text-[#7c7468] mobile-search-shadow"
                }`}
              >
                <span className="material-symbols-outlined mr-2 text-[16px]">restaurant</span>
                Restaurants
              </button>
            </div>
          </div>

          <div className="relative flex-1">
            {mapCards.map((card) => (
              <div
                key={card.id}
                className="mobile-scale-in absolute"
                style={{ left: card.markerLeft, top: card.markerTop }}
              >
                <div className="relative rounded-full bg-white p-2 pr-5 shadow-[0_18px_30px_rgba(29,21,8,0.18)]">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=portrait%20of%20Moroccan%20artisan%20guide%2C%20professional%20travel%20profile%20photo%2C%20clean%20background&image_size=square"
                      alt={card.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-[10px] font-semibold text-[#8f8576]">{card.name}</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-[#b27a00] text-white shadow-lg">
                    <span className="material-symbols-outlined text-[20px]">place</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="mobile-slide-up absolute bottom-24 left-0 right-0 rounded-t-[34px] bg-[#fbfaf6] px-5 pb-6 pt-6 shadow-[0_-14px_35px_rgba(33,24,8,0.12)]">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-[1.7rem] font-extrabold tracking-[-0.05em] text-[#25222d]">
                    Businesses nearby
                  </h2>
                  <p className="mt-1 text-[13px] text-[#8b816f]">World Cup 2030 Partner Venues</p>
                </div>
                <Link href={`/${params.locale}/discover`} className="text-sm font-bold text-[#a36e00]">
                  View all
                </Link>
              </div>

              <Link href={`/${params.locale}/businesses/poterie`} className="mobile-card mobile-card-hover mt-4 block overflow-hidden">
                <div className="relative h-[180px]">
                  <img
                    src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Moroccan%20riad%20courtyard%20restaurant%2C%20greenery%2C%20warm%20sunlight%2C%20inviting%20travel%20photo&image_size=portrait_4_3"
                    alt="Businesses nearby"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] mobile-badge-green">
                    Open Now
                  </span>
                </div>
              </Link>
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
