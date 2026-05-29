"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NavigatePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("onboarding");
  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col px-4 py-5">
          <div className="flex items-center justify-between text-sm font-extrabold uppercase tracking-[0.12em] text-[#9b9488] mobile-fade-up">
            <Link
              href={`/${params.locale}/onboarding/guide`}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-[#7c7264] shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <Link href={`/${params.locale}/home`}>{t("skip")}</Link>
          </div>

          <div className="mobile-fade-up mt-5 rounded-[34px] bg-white px-4 py-4 shadow-[0_20px_42px_rgba(31,26,10,0.1)]" style={{ animationDelay: "100ms" }}>
            <div className="mobile-onboarding-hero flex h-[230px] items-start justify-between rounded-[28px] p-5">
              <div className="mobile-brand-orb mx-auto mt-5 h-24 w-24">
                <span className="material-symbols-outlined text-[34px] text-white">place</span>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-[#d8e5de] bg-[#f4fbf7] text-[#89b7a8]">
                <span className="material-symbols-outlined text-[22px]">lens_blur</span>
              </span>
            </div>
            <div className="mx-auto mt-6 h-2 w-52 rounded-full bg-[#efede8]" />
          </div>

          <div className="mt-10 text-center mobile-fade-up" style={{ animationDelay: "200ms" }}>
            <h1 className="text-[2.45rem] font-extrabold leading-[0.94] tracking-[-0.07em] text-[#2c2934]">
              {t("navigateLine1")}
              <br />
              {t("navigateLine2")}
              <br />
              {t("navigateLine3")}
            </h1>
            <p className="mx-auto mt-6 max-w-[290px] text-[17px] leading-8 text-[#7c7469]">
              {t("navigateDescription")}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div className="mobile-dots">
              <span className="mobile-dot" />
              <span className="mobile-dot" />
              <span className="mobile-dot active" />
            </div>
          </div>

          <Link
            href={`/${params.locale}/home`}
            className="mobile-pill mobile-button-gold mobile-fade-up mt-auto h-14 w-full text-base font-extrabold"
            style={{ animationDelay: "280ms" }}
          >
            {t("getStarted")}
          </Link>
        </div>
      </section>
    </main>
  );
}
