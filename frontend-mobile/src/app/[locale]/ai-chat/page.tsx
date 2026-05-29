"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import MobileBottomNav from "@/components/MobileBottomNav";
import OptimizedImage from "@/components/OptimizedImage";
import { aiRecommendations } from "@/lib/mobileData";

export default function AiChatPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("aiChat");
  const [messageSent, setMessageSent] = useState(false);
  const [itineraryReady, setItineraryReady] = useState(false);

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2aa79a] text-white shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </span>
                <div>
                  <h1 className="text-xl font-extrabold tracking-[-0.05em] text-[#a36e00]">{t("title")}</h1>
                  <p className="rounded-full bg-[#d8f5df] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.14em] text-[#1f9a60]">
                    {t("modeTourist")}
                  </p>
                </div>
              </div>
              <div className="rounded-full bg-white px-3 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                {params.locale.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            <div className="mobile-fade-up ml-auto max-w-[255px] rounded-[30px] rounded-tr-[12px] bg-[#eba521] px-5 py-5 text-[15px] leading-7 text-white shadow-[0_16px_28px_rgba(235,165,33,0.28)]">
              {t("sampleUserMessage")}
              <div className="mt-2 text-right text-[10px] font-semibold text-white/70">14:32</div>
            </div>

            <div className="mobile-fade-up mt-6 rounded-[30px] border border-[#ecdabf] bg-white px-4 py-5 shadow-[0_14px_28px_rgba(31,26,10,0.06)]" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-2 text-[15px] font-extrabold text-[#a36e00]">
                <span className="material-symbols-outlined text-[17px]">auto_awesome</span>
                {t("guideTitle")}
              </div>
              <p className="mt-3 text-[14px] leading-6 text-[#6f665c]">
                {t("sampleAssistantMessage")}
              </p>
            </div>

            <div className="mobile-scrollbar-hidden mobile-fade-up mt-5 flex gap-3 overflow-x-auto pb-2" style={{ animationDelay: "180ms" }}>
              {aiRecommendations.map((place) => (
                <Link
                  key={place.id}
                  href={`/${params.locale}/businesses/poterie`}
                  className="mobile-card mobile-card-hover w-[175px] shrink-0 overflow-hidden"
                >
                  <div className="relative h-[140px]">
                    <OptimizedImage
                      src={place.image}
                      alt={place.name}
                      width={700}
                      height={525}
                      sizes="175px"
                      widths={[350, 525, 700]}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] mobile-badge-green">
                      {t(`recommendations.${place.id}.badge`)}
                    </span>
                  </div>
                  <div className="px-4 py-4">
                    <h3 className="text-[1.2rem] font-extrabold tracking-[-0.05em] text-[#2a2730]">{place.name}</h3>
                    <div className="mt-2 flex items-center gap-3 text-[12px] font-semibold text-[#7b7267]">
                      <span className="flex items-center gap-1 text-[#a36e00]">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        {place.rating}
                      </span>
                      <span>{t(`recommendations.${place.id}.walk`)}</span>
                    </div>
                    <div className="mt-3 text-[1rem] font-extrabold text-[#8f6510]">{place.price}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mobile-fade-up mt-6" style={{ animationDelay: "240ms" }}>
              <p className="text-[17px] font-semibold italic leading-7 text-[#786f64]">
                {t("questionItinerary")}
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setItineraryReady(true)}
                  className="mobile-pill mobile-button-gold h-12 flex-1 text-[13px] font-extrabold"
                >
                  {t("yesBuildItinerary")}
                </button>
                <Link
                  href={`/${params.locale}/map`}
                  className="mobile-pill h-12 flex-1 border border-[#e4d9ca] bg-white text-[13px] font-bold text-[#6f675b]"
                >
                  {t("showOnMap")}
                </Link>
              </div>
              {itineraryReady ? (
                <div className="mt-4 rounded-[24px] border border-[#eadcc6] bg-white px-4 py-4 text-[13px] leading-6 text-[#6f665c] shadow-[0_10px_22px_rgba(31,26,10,0.05)]">
                  {t("itineraryReady")}
                </div>
              ) : null}
            </div>

            <div className="mobile-fade-up mt-8" style={{ animationDelay: "320ms" }}>
              <p className="mb-3 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#c2b7a2]">{t("quickExplore")}</p>
              <div className="mobile-search-shadow flex items-center gap-3 rounded-full bg-white px-4 py-3">
                <span className="material-symbols-outlined text-[#d2b071]">auto_awesome</span>
                <span className="flex-1 text-[14px] text-[#c2b9aa]">{t("askPlaceholder")}</span>
                <button
                  type="button"
                  onClick={() => setMessageSent(true)}
                  className="mobile-pill h-10 w-10 bg-[#e8a620] text-white"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
              {messageSent ? (
                <p className="mt-3 text-[12px] font-semibold text-[#6f8d72]">
                  {t("messageSent")}
                </p>
              ) : null}
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
