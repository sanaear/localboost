"use client";

import Link from "next/link";

export default function GuidePage({
  params,
}: {
  params: { locale: string };
}) {
  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col px-4 py-5">
          <div className="flex items-center justify-end text-sm font-extrabold uppercase tracking-[0.12em] text-[#9b9488] mobile-fade-up">
            <Link href={`/${params.locale}/home`}>Skip</Link>
          </div>

          <div
            className="mobile-card mobile-fade-up mt-5 rounded-[34px] px-5 py-6"
            style={{ animationDelay: "110ms" }}
          >
            <div className="flex items-start justify-between">
              <span className="mt-10 h-3 w-3 rounded-full bg-[#e2a11b]" />
              <div className="mobile-brand-orb mx-auto h-24 w-24">
                <span className="material-symbols-outlined text-[38px] text-white">auto_awesome</span>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#88f1c7] text-[#226e55] shadow-sm">
                <span className="material-symbols-outlined text-[22px]">translate</span>
              </span>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ffad8a] text-[#8b4429] shadow-sm">
                <span className="material-symbols-outlined text-[20px]">restaurant</span>
              </span>
              <div className="flex-1">
                <div className="h-3 rounded-full bg-[#ede9df]" />
                <div className="mt-3 h-3 w-3/4 rounded-full bg-[#f1ece4]" />
              </div>
            </div>
          </div>

          <div className="mt-16 text-center mobile-fade-up" style={{ animationDelay: "200ms" }}>
            <h1 className="text-[2.8rem] font-extrabold leading-[0.96] tracking-[-0.07em] text-[#2e2a33]">
              Your AI
              <br />
              <span className="text-[#a36e00] underline decoration-[#e2a11b] decoration-[5px] underline-offset-[9px]">
                Travel Guide
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-[300px] text-[17px] leading-8 text-[#7f7668]">
              Ask anything in your language. From hidden souks to local secrets, your guide is always awake.
            </p>
          </div>

          <div className="mt-auto flex items-center gap-4 pb-2">
            <Link
              href={`/${params.locale}/onboarding/discover`}
              className="mobile-pill mobile-button-secondary h-14 w-14 shrink-0"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <Link
              href={`/${params.locale}/onboarding/navigate`}
              className="mobile-pill mobile-button-gold h-14 flex-1 text-base font-extrabold"
            >
              Next
              <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
            </Link>
          </div>

          <div className="mt-5 flex items-center justify-center">
            <div className="mobile-dots">
              <span className="mobile-dot" />
              <span className="mobile-dot active" />
              <span className="mobile-dot" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
