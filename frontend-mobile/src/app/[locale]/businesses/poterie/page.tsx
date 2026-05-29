"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { detailGallery } from "@/lib/mobileData";

const languageChips = ["EN", "FR", "AR", "ES"];

export default function PoteriePage({
  params,
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("EN");
  const [hoursExpanded, setHoursExpanded] = useState(false);
  const primaryImage = useMemo(
    () =>
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Moroccan%20artisan%20working%20on%20pottery%20in%20studio%2C%20warm%20window%20light%2C%20high-end%20travel%20editorial%20photography&image_size=portrait_16_9",
    [],
  );

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone overflow-hidden bg-[#faf8f2]">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col">
          <div className="relative h-[310px]">
            <img src={primaryImage} alt="L'Art de la Poterie" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
              <Link href={`/${params.locale}/map`} className="grid h-9 w-9 place-items-center rounded-full bg-white/86 text-[#70685c] shadow-sm">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </Link>
              <button
                type="button"
                onClick={() => setSaved((current) => !current)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/86 text-[#70685c] shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {saved ? "favorite" : "favorite_border"}
                </span>
              </button>
            </div>
          </div>

          <div className="-mt-8 flex-1 rounded-t-[34px] bg-[#faf8f2] px-5 pb-6 pt-6">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f7d98f] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9a6b03]">
                Artisan Workshop
              </span>
              <span className="rounded-full bg-[#dff7ea] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#178f60]">
                Local Favorite
              </span>
            </div>

            <h1 className="mt-4 text-[2.35rem] font-extrabold leading-[0.95] tracking-[-0.07em] text-[#23212c]">
              L'Art de la
              <br />
              Poterie
            </h1>
            <p className="mt-2 text-[15px] text-[#70685d]">2 Medina, Fès</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#7c7367]">
              <span className="flex items-center gap-1 font-extrabold text-[#a36e00]">
                <span className="material-symbols-outlined text-[16px]">star</span>
                4.8 <span className="font-semibold text-[#8d8476]">(1.2k reviews)</span>
              </span>
              <span>Open Now</span>
              <span>1.2 km away</span>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-full border border-[#ece3d4] bg-white/80 px-2 py-2 shadow-[0_8px_24px_rgba(31,26,10,0.06)]">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = "tel:+212535000000";
                  }
                }}
                className="mobile-pill h-11 flex-1 text-[13px] font-bold text-[#7b7367]"
              >
                <span className="material-symbols-outlined mr-2 text-[18px] text-[#a36e00]">call</span>
                Call
              </button>
              <button
                type="button"
                onClick={() => router.push(`/${params.locale}/map`)}
                className="mobile-pill h-11 flex-1 text-[13px] font-bold text-[#7b7367]"
              >
                <span className="material-symbols-outlined mr-2 text-[18px] text-[#a36e00]">directions</span>
                Directions
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
                  <h2 className="text-[1.5rem] font-extrabold tracking-[-0.05em] text-[#23212c]">Generated</h2>
                  <p className="text-[1.45rem] font-semibold tracking-[-0.05em] text-[#23212c]">by AI</p>
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
                Discover the soul of this thorough local atelier in Fès. Led by a Potter's
                presence in the historic Zellīj patterns and the famous cobalt-blue tones that
                define local craftsmanship, each piece is hand-thrown and painted using natural
                mineral pigments. Visitors can witness the wheel-turn, master hands forming
                simple clay into eye-glaze masterpieces.
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between rounded-[20px] bg-white/70 px-4 py-4 text-[14px] font-bold text-[#5b544b] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#8d8476]">schedule</span>
                Opening Hours
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#8d8476]">expand_more</span>
            </div>
            {hoursExpanded ? (
              <div className="mt-3 rounded-[20px] border border-[#ece2d3] bg-white px-4 py-4 text-[13px] leading-6 text-[#746c61] shadow-[0_8px_24px_rgba(31,26,10,0.04)]">
                <div className="flex items-center justify-between">
                  <span>Monday - Saturday</span>
                  <span className="font-extrabold text-[#a36e00]">09:00 - 19:00</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>Sunday</span>
                  <span className="font-extrabold text-[#8d8476]">Closed</span>
                </div>
              </div>
            ) : null}

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-[1.55rem] font-extrabold tracking-[-0.05em] text-[#23212c]">
                  Experience the Craft
                </h2>
              </div>

              <div className="mobile-scrollbar-hidden mt-4 grid grid-cols-2 gap-3 overflow-x-auto">
                {detailGallery.slice(0, 4).map((image, index) => (
                  <div key={image} className="relative overflow-hidden rounded-[22px]">
                    <img src={image} alt={`Gallery ${index + 1}`} className="h-[92px] w-full object-cover" />
                    {index === 3 && (
                      <div className="absolute inset-0 grid place-items-center bg-black/45 text-xl font-extrabold text-white">
                        +12
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <h2 className="text-[1.45rem] font-extrabold tracking-[-0.05em] text-[#23212c]">
                Tourist Stories
              </h2>
              <Link href={`/${params.locale}/discover`} className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#b27a00]">
                See all
              </Link>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/${params.locale}/map`)}
              className="mobile-pill mobile-button-gold mt-5 h-14 w-full text-base font-extrabold"
            >
              <span className="material-symbols-outlined mr-2 text-[18px]">route</span>
              Get Directions
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
