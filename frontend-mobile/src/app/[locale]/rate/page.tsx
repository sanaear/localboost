"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function RatePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("rate");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-5 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <Link
                href={`/${params.locale}/profile`}
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#6f675b] shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </Link>
              <h1 className="text-[1.6rem] font-extrabold tracking-[-0.05em] text-[#a36e00]">
                {t("title")}
              </h1>
              <span className="h-9 w-9" />
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-5 pb-5">
            <div className="mobile-card mobile-fade-up mt-6 rounded-[30px] px-5 py-6 text-center">
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-[#23212c]">
                {t("question")}
              </h2>
              <div className="mt-6 flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setRating(star);
                      setSubmitted(false);
                    }}
                    className="text-[#e0a11f]"
                  >
                    <span className="material-symbols-outlined text-[30px]">
                      {star <= rating ? "star" : "star_outline"}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="mobile-pill mobile-button-gold mt-8 h-12 w-full text-[14px] font-extrabold"
              >
                {t("submit")}
              </button>
              {submitted ? (
                <p className="mt-4 text-[13px] font-semibold text-[#5f8e70]">
                  {t("thanks")}
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
