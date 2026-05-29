"use client";

import Link from "next/link";
import { useState } from "react";
import MerchantAppBottomNav from "@/components/MerchantAppBottomNav";

const initialTags = ["Hand-thrown", "Cobalt Blue"];
const suggestionByLanguage = {
  EN: `"Step into a world of timeless craftsmanship at our Medina studio. We specialize in hand-thrown pottery, featuring our signature Cobalt Blue glaze that echoes the deep colors of Fès Atlas sky. Each piece tells a story of tradition preserved since 1950."`,
  FR: `"Entrez dans un univers de savoir-faire intemporel dans notre atelier de la médina. Notre poterie tournée à la main et notre émail bleu cobalt racontent une histoire d'artisanat préservé depuis 1950."`,
  AR: `"ادخل إلى عالم من الحرفية الأصيلة في ورشتنا داخل المدينة. نحن متخصصون في الفخار المصنوع يدويا بلمسة من اللون الأزرق الكوبالت المستوحى من سماء فاس."`,
} as const;

export default function MerchantGenerateAiPage({
  params,
}: {
  params: { locale: string };
}) {
  const [prompt, setPrompt] = useState("");
  const [tags, setTags] = useState(initialTags);
  const [activeLanguage, setActiveLanguage] = useState<keyof typeof suggestionByLanguage>("EN");
  const [suggestion, setSuggestion] = useState<string>(suggestionByLanguage.EN);
  const [savedToProfile, setSavedToProfile] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1f3d4a] text-white shadow-sm">
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
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-[#23212c]">Generate with AI</h2>
              <div className="mt-2 flex items-center gap-2 text-[#d5b36a]">
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span className="text-[14px] text-[#7d7468]">
                  Craft the perfect story for your shop in seconds with local flair.
                </span>
              </div>
            </div>

            <div className="mobile-fade-up mt-6 space-y-5" style={{ animationDelay: "120ms" }}>
              <div>
                <label className="mobile-label">Business Type</label>
                <input className="mobile-input" defaultValue="Traditional Pottery Studio" />
              </div>

              <div>
                <label className="mobile-label">Highlights</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setTags((current) => current.filter((item) => item !== tag))
                      }
                      className="mobile-pill h-9 bg-[#8cf0cf] px-4 text-[12px] font-bold text-[#1b7f65]"
                    >
                      {tag}
                      <span className="material-symbols-outlined ml-1 text-[14px]">close</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setTags((current) => [...current, `Highlight ${current.length + 1}`])
                    }
                    className="mobile-pill h-9 bg-[#f2f0eb] px-4 text-[12px] font-bold text-[#8f8578]"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>

              <div>
                <label className="mobile-label">Unique Selling Points</label>
                <textarea
                  className="mobile-input min-h-[120px] resize-none"
                  placeholder="What makes your shop special? e.g. Family-owned since 1950, located in the heart of the Medina"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = prompt
                  ? `"${prompt} Our atelier brings travelers closer to Moroccan craftsmanship with intimate demonstrations, curated storytelling, and signature cobalt pieces made for meaningful souvenirs."`
                  : suggestionByLanguage[activeLanguage];
                setSuggestion(next);
                setSavedToProfile(false);
              }}
              className="mobile-pill mobile-button-gold mobile-fade-up mt-7 h-14 w-full text-base font-extrabold"
              style={{ animationDelay: "180ms" }}
            >
              <span className="material-symbols-outlined mr-2 text-[18px]">auto_fix_high</span>
              Generate Description
            </button>

            <div className="mobile-fade-up mt-8" style={{ animationDelay: "240ms" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-[1.35rem] font-extrabold tracking-[-0.05em] text-[#23212c]">AI Suggestions</h3>
                <div className="flex rounded-full bg-[#f1ece4] p-1">
                  {["EN", "FR", "AR"].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        const language = chip as keyof typeof suggestionByLanguage;
                        setActiveLanguage(language);
                        setSuggestion(suggestionByLanguage[language]);
                      }}
                      className={`mobile-pill h-7 px-3 text-[9px] font-extrabold uppercase tracking-[0.14em] ${
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

              <div className="mt-4 rounded-[28px] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(31,26,10,0.04)]">
                <p className="text-[15px] italic leading-7 text-[#6f675c]">
                  {suggestion}
                </p>
                <div className="mt-5 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#a39a8b]">
                  <span>{suggestion.length} characters</span>
                  <button
                    type="button"
                    onClick={() => setCopied(true)}
                    className="flex items-center gap-1 text-[#2e9c70]"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mobile-fade-up mt-7 flex gap-3 pb-2" style={{ animationDelay: "320ms" }}>
              <button
                type="button"
                onClick={() => setSuggestion(suggestionByLanguage[activeLanguage])}
                className="mobile-pill h-12 flex-1 border border-[#e4d9ca] bg-white text-[13px] font-bold text-[#6f675b]"
              >
                <span className="material-symbols-outlined mr-2 text-[18px]">refresh</span>
                Regenerate
              </button>
              <button
                type="button"
                onClick={() => setSavedToProfile(true)}
                className="mobile-pill h-12 flex-1 bg-[#2c2928] text-[13px] font-extrabold text-white"
              >
                Save to profile
              </button>
            </div>
            {savedToProfile ? (
              <p className="pb-2 text-center text-[12px] font-semibold text-[#5f8e70]">
                AI description saved to your profile.
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
