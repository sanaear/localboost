"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import MerchantAppBottomNav from "@/components/MerchantAppBottomNav";
import { merchantPhotoManagerShots } from "@/lib/mobileData";

export default function MerchantPhotoManagerPage({
  params,
}: {
  params: { locale: string };
}) {
  const [shots, setShots] = useState(merchantPhotoManagerShots);
  const [selectedId, setSelectedId] = useState(merchantPhotoManagerShots[0]?.id ?? "");
  const [optimized, setOptimized] = useState(false);

  const selectedPhoto = useMemo(
    () =>
      shots.find((shot) => shot.id === selectedId) ??
      shots[0],
    [selectedId, shots],
  );

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#244227,#0e1610_72%)] text-white shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">storefront</span>
                </span>
                <h1 className="text-[1.4rem] font-extrabold tracking-[-0.05em] text-[#a36e00]">
                  LocalBoost
                </h1>
              </div>
              <Link href={`/${params.locale}/merchant/updates`} className="text-[#7f7467]">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
              </Link>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            <div className="mobile-fade-up mt-4" style={{ animationDelay: "60ms" }}>
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-[#23212c]">
                Photo Manager
              </h2>
              <p className="mt-2 max-w-[310px] text-[14px] leading-6 text-[#8b8174]">
                Organize your shop&apos;s visual story. Drag to reorder photos for your
                profile.
              </p>
            </div>

            {selectedPhoto ? (
              <div
                className="mobile-fade-up mt-6 overflow-hidden rounded-[28px] border border-[#221d1a] bg-[#171614] shadow-[0_18px_34px_rgba(17,14,10,0.18)]"
                style={{ animationDelay: "120ms" }}
              >
                <div className="relative h-[160px]">
                  <img
                    src={selectedPhoto.image}
                    alt={selectedPhoto.label}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,15,0.16),rgba(20,18,15,0.38))]" />
                  <div className="absolute left-3 top-3 rounded-full bg-[#d58d14] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.15em] text-white">
                    Main Photo
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const remaining = shots.filter((shot) => shot.id !== selectedPhoto.id);
                      setShots(remaining);
                      setSelectedId(remaining[0]?.id ?? "");
                    }}
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#c26f55] shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = shots.findIndex((shot) => shot.id === selectedPhoto.id);
                      if (currentIndex > 0) {
                        const reordered = [...shots];
                        const [active] = reordered.splice(currentIndex, 1);
                        reordered.unshift(active);
                        setShots(reordered);
                        setSelectedId(active.id);
                      }
                    }}
                    className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-[#2e2b28]/85 text-white shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {shots.slice(1).map((shot, index) => {
                const active = selectedId === shot.id;

                return (
                  <button
                    key={shot.id}
                    type="button"
                    onClick={() => setSelectedId(shot.id)}
                    className={`mobile-fade-up relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-full border-2 ${
                      active ? "border-[#b27a00]" : "border-white"
                    } shadow-[0_10px_20px_rgba(31,26,10,0.08)]`}
                    style={{ animationDelay: `${180 + index * 60}ms` }}
                  >
                    <img src={shot.image} alt={shot.label} className="h-full w-full object-cover" />
                    <div className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-white/92 text-[#c26f55]">
                      <span className="material-symbols-outlined text-[11px]">close</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                const nextShot = merchantPhotoManagerShots[shots.length % merchantPhotoManagerShots.length];
                const nextId = `${nextShot.id}-${shots.length}`;
                setShots((current) => [...current, { ...nextShot, id: nextId }]);
                setSelectedId(nextId);
              }}
              className="mobile-fade-up mt-6 flex h-[138px] w-full flex-col items-center justify-center rounded-[28px] border border-dashed border-[#d9d1c5] bg-[#f6f4f0] text-center"
              style={{ animationDelay: "320ms" }}
            >
              <span className="material-symbols-outlined text-[26px] text-[#d2a85e]">add_photo_alternate</span>
              <span className="mt-2 text-[1rem] font-extrabold tracking-[-0.03em] text-[#c39128]">
                Add Photos
              </span>
              <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#c4b8a7]">
                Max 10MB per file
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOptimized((current) => !current)}
              className={`mobile-pill mobile-fade-up mt-7 h-12 w-full text-[12px] font-extrabold ${
                optimized
                  ? "bg-[#177f56] text-white shadow-[0_14px_28px_rgba(23,127,86,0.2)]"
                  : "bg-[#dff5ea] text-[#177f56]"
              }`}
              style={{ animationDelay: "380ms" }}
            >
              <span className="material-symbols-outlined mr-2 text-[16px]">
                {optimized ? "check_circle" : "task_alt"}
              </span>
              {optimized ? "Photos optimized and ready" : "Photo auto-optimized for fast loading"}
            </button>
          </div>

          <div className="px-2 pb-3 pt-2">
            <MerchantAppBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
