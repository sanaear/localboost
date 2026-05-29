"use client";

import Link from "next/link";

export default function MerchantSubmittedPage({
  params,
}: {
  params: { locale: string };
}) {
  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col items-center overflow-hidden px-6 py-8 text-center bg-[#fbfaf6]">
          <div className="mobile-fade-up mt-8 rounded-full bg-white p-4 shadow-[0_18px_32px_rgba(31,26,10,0.08)]">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-[#f2c15d] shadow-[inset_0_0_0_8px_rgba(255,255,255,0.7)]">
              <span className="material-symbols-outlined text-[42px] text-white">check_circle</span>
            </div>
          </div>

          <div className="mobile-fade-up mt-8" style={{ animationDelay: "100ms" }}>
            <h1 className="text-[3rem] font-extrabold leading-[0.9] tracking-[-0.08em] text-[#9c6a00]">
              Profile
              <br />
              Submitted!
            </h1>
            <p className="mx-auto mt-5 max-w-[290px] text-[16px] leading-7 text-[#7d7468]">
              Your profile is under review by our team. We&apos;ll notify you as soon as it&apos;s live.
            </p>
          </div>

          <Link
            href={`/${params.locale}/merchant/dashboard`}
            className="mobile-pill mobile-button-gold mobile-fade-up mt-10 h-14 w-full text-base font-extrabold"
            style={{ animationDelay: "180ms" }}
          >
            Go to Dashboard
          </Link>

          <div className="mobile-fade-up mt-8 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b8af9f]" style={{ animationDelay: "240ms" }}>
            Review typically takes 24-48 hours
          </div>

          <div className="mt-auto grid w-full grid-cols-2 gap-4 pt-10">
            <div className="mobile-fade-up h-36 rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(242,240,234,0.95))] shadow-[0_10px_20px_rgba(31,26,10,0.05)]" style={{ animationDelay: "300ms" }} />
            <div className="mobile-fade-up h-28 self-end rounded-[30px] bg-[linear-gradient(180deg,rgba(226,242,235,0.65),rgba(247,245,240,0.9))] shadow-[0_10px_20px_rgba(31,26,10,0.05)]" style={{ animationDelay: "360ms" }} />
          </div>
        </div>
      </section>
    </main>
  );
}
