"use client";

import Link from "next/link";
import { useState } from "react";
import MerchantAppBottomNav from "@/components/MerchantAppBottomNav";
import { merchantEditGallery } from "@/lib/mobileData";

const categories = [
  "Luxury Accommodation",
  "Traditional Pottery Studio",
  "Fine Dining",
  "Concept Store",
];

export default function MerchantEditProfilePage({
  params,
}: {
  params: { locale: string };
}) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [gallery, setGallery] = useState(merchantEditGallery);
  const [locationUpdated, setLocationUpdated] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#a36e00] text-white shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                </span>
                <h1 className="text-[1.4rem] font-extrabold tracking-[-0.05em] text-[#a36e00]">LocalBoost</h1>
              </div>
              <Link href={`/${params.locale}/merchant/updates`} className="text-[#a39a8b]">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
              </Link>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            <div className="mobile-fade-up mt-3" style={{ animationDelay: "70ms" }}>
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-[#23212c]">Edit Profile</h2>
              <p className="mt-1 text-[14px] text-[#7d7468]">
                Update your business presence for the local community.
              </p>
            </div>

            <div className="mobile-fade-up mt-6 space-y-6" style={{ animationDelay: "120ms" }}>
              <div>
                <label className="mobile-label">Business Info</label>
                <div className="space-y-3">
                  <input className="mobile-input" defaultValue="The Amber Atlas Riad" />
                  <button
                    type="button"
                    onClick={() =>
                      setCategoryIndex((current) => (current + 1) % categories.length)
                    }
                    className="mobile-input flex items-center justify-between text-left"
                  >
                    <span>{categories[categoryIndex]}</span>
                    <span className="material-symbols-outlined text-[#8a8174]">expand_more</span>
                  </button>
                  <textarea
                    className="mobile-input min-h-[96px] resize-none"
                    defaultValue="A boutique sanctuary in the heart of the Medina, blending ancestral Moroccan craftsmanship with modern comfort for travelers and dreamers."
                  />
                </div>
              </div>

              <div>
                <label className="mobile-label">Location &amp; Map</label>
                <div className="space-y-3">
                  <input className="mobile-input" defaultValue="42 Rue de la Bahia" />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="mobile-input" defaultValue="Marrakech" />
                    <input className="mobile-input" defaultValue="40000" />
                  </div>
                  <div className="mobile-map-surface h-[150px] rounded-[30px] border border-[#e7ddcf] relative overflow-hidden">
                    <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#b27a00] text-white shadow-lg">
                      <span className="material-symbols-outlined">place</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLocationUpdated(true)}
                      className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white/88 text-[#6f675b] shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">my_location</span>
                    </button>
                  </div>
                  {locationUpdated ? (
                    <p className="text-[12px] font-semibold text-[#5f8e70]">
                      Pin refreshed for your current storefront location.
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="mobile-label">Contact Channels</label>
                <div className="space-y-3">
                  <input className="mobile-input" defaultValue="+212 524 300000" />
                  <input className="mobile-input" defaultValue="WhatsApp Business" />
                  <input className="mobile-input" defaultValue="www.amberatlasriad.ma" />
                </div>
              </div>

              <div>
                <label className="mobile-label">Weekly Hours</label>
                <div className="rounded-[28px] bg-[#f4f1eb] px-4 py-2">
                  {[
                    ["Monday", "09:00 - 18:00", true],
                    ["Tuesday", "09:00 - 18:00", true],
                    ["Friday", "Closed", false],
                  ].map(([day, hours, open]) => (
                    <div key={String(day)} className="flex items-center justify-between border-b last:border-b-0 border-[#e7e1d6] py-3">
                      <div>
                        <div className="text-[14px] font-bold text-[#38332d]">{day}</div>
                        <div className={`text-[12px] ${open ? "text-[#8a8174]" : "text-[#c26f55]"}`}>{hours}</div>
                      </div>
                      <span className={`relative h-7 w-12 rounded-full ${open ? "bg-[#2fc08f]" : "bg-[#ddd7cd]"}`}>
                        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white ${open ? "left-5.5" : "left-0.5"}`} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="mobile-label mb-0">Photos &amp; Atmosphere</label>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b9af9d]">4/8 images</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {gallery.map((image) => (
                    <img key={image} src={image} alt="Gallery" className="h-[86px] w-full rounded-[22px] object-cover" />
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setGallery((current) => [
                        ...current,
                        merchantEditGallery[current.length % merchantEditGallery.length],
                      ])
                    }
                    className="flex h-[86px] items-center justify-center rounded-[22px] border border-dashed border-[#e2d5c3] bg-[#faf7f2] text-[#b8ae9f]"
                  >
                    <span className="material-symbols-outlined">add_a_photo</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSaved(true)}
              className="mobile-pill mobile-button-gold mobile-fade-up mt-8 h-14 w-full text-base font-extrabold"
              style={{ animationDelay: "200ms" }}
            >
              <span className="material-symbols-outlined mr-2 text-[18px]">check_circle</span>
              Save Changes
            </button>
            {saved ? (
              <p className="mt-3 text-center text-[12px] font-semibold text-[#5f8e70]">
                Profile changes saved successfully.
              </p>
            ) : null}
          </div>

          <div className="px-2 pb-3 pt-2">
            <MerchantAppBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
