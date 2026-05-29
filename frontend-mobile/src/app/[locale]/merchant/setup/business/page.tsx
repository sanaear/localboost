"use client";

import Link from "next/link";
import { useState } from "react";
import MerchantBottomNav from "@/components/MerchantBottomNav";

const categories = [
  "Traditional Pottery Studio",
  "Luxury Accommodation",
  "Restaurant",
  "Handmade Souk Shop",
];

export default function MerchantBusinessSetupPage({
  params,
}: {
  params: { locale: string };
}) {
  const [categoryIndex, setCategoryIndex] = useState(0);

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-5 pb-3 pt-5 mobile-fade-up">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#9e9281]">Step 1 of 3</p>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#c08a12]">33% Complete</p>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[#ebe5da]">
              <div className="h-full w-1/3 rounded-full bg-[#eba521]" />
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-5 pb-5">
            <div className="mobile-fade-up mt-14" style={{ animationDelay: "80ms" }}>
              <h1 className="text-[3rem] font-extrabold leading-[0.92] tracking-[-0.08em] text-[#8a5700]">
                Tell us about
                <br />
                your business
              </h1>
              <p className="mt-5 max-w-[305px] text-[18px] leading-8 text-[#7d7468]">
                Help us create a profile that captures the essence of your shop for the 2030 World Cup visitors.
              </p>
            </div>

            <form className="mobile-fade-up mt-14 space-y-8" style={{ animationDelay: "160ms" }}>
              <div>
                <label className="mobile-label">Business Name</label>
                <input className="mobile-input rounded-none border-x-0 border-t-0 bg-transparent px-0 pb-3 pt-1 text-[18px] placeholder:text-[#d3c8b8]" placeholder="e.g. Cafe de la Poste" />
              </div>
              <div>
                <label className="mobile-label">Category</label>
                <button
                  type="button"
                  onClick={() =>
                    setCategoryIndex((current) => (current + 1) % categories.length)
                  }
                  className="flex w-full items-center justify-between border-b border-[#eadcc8] pb-4 text-left text-[18px] text-[#3c3731]"
                >
                  <span>{categories[categoryIndex]}</span>
                  <span className="material-symbols-outlined text-[#8b806f]">expand_more</span>
                </button>
              </div>
            </form>

            <div className="mobile-fade-up mt-14 space-y-5" style={{ animationDelay: "240ms" }}>
              <Link
                href={`/${params.locale}/merchant/setup/photos`}
                className="mobile-pill mobile-button-gold h-16 w-full text-[1.45rem] font-extrabold"
              >
                Next
                <span className="material-symbols-outlined ml-3 text-[22px]">arrow_forward</span>
              </Link>
              <Link href={`/${params.locale}/merchant/dashboard`} className="block w-full text-center text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#9e9383]">
                Save for later
              </Link>
            </div>
          </div>

          <MerchantBottomNav activeIndex={1} locale={params.locale} />
        </div>
      </section>
    </main>
  );
}
