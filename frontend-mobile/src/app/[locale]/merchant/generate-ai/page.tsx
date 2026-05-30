"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import MerchantAppBottomNav from "@/components/MerchantAppBottomNav";

const suggestionByLanguage = {
  EN: `"Step into a world of timeless craftsmanship at our Medina studio. We specialize in hand-thrown pottery, featuring our signature Cobalt Blue glaze that echoes the deep colors of Fès Atlas sky. Each piece tells a story of tradition preserved since 1950."`,
  FR: `"Entrez dans un univers de savoir-faire intemporel dans notre atelier de la médina. Notre poterie tournée à la main et notre émail bleu cobalt racontent une histoire d'artisanat préservé depuis 1950."`,
  AR: `"ادخل إلى عالم من الحرفية الأصيلة في ورشتنا داخل المدينة. نحن متخصصون في الفخار المصنوع يدويا بلمسة من اللون الأزرق الكوبالت المستوحى من سماء فاس."`,
  ES: `"Entra en un mundo de artesanía atemporal en nuestro taller de la medina. Creamos piezas de cerámica hechas a mano con nuestro esmalte Azul Cobalto, inspirado en los cielos de Fez. Cada creación preserva una tradición viva desde 1950."`,
} as const;

type SuggestionLanguage = keyof typeof suggestionByLanguage;

function localeToSuggestionLanguage(locale: string): SuggestionLanguage {
  const normalized = locale.toLowerCase();
  if (normalized === "fr") return "FR";
  if (normalized === "ar") return "AR";
  if (normalized === "es") return "ES";
  return "EN";
}

export default function MerchantGenerateAiPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("merchantAi");
  const tCommon = useTranslations("common");
  const [prompt, setPrompt] = useState("");
  const defaultTags = useMemo(() => [t("defaultTag1"), t("defaultTag2")], [t]);
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [activeLanguage, setActiveLanguage] = useState<SuggestionLanguage>(() => localeToSuggestionLanguage(params.locale));
  const [suggestion, setSuggestion] = useState<string>(() => suggestionByLanguage[localeToSuggestionLanguage(params.locale)]);
  const [savedToProfile, setSavedToProfile] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const language = localeToSuggestionLanguage(params.locale);
    setActiveLanguage(language);
    setSuggestion(suggestionByLanguage[language]);
    setTags(defaultTags);
    setCopied(false);
    setSavedToProfile(false);
  }, [defaultTags, params.locale]);

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
                <h1 className="text-[1.4rem] font-extrabold tracking-[-0.05em] text-[#a36e00]">{tCommon("brand")}</h1>
              </div>
              <Link href={`/${params.locale}/merchant/updates`} className="text-[#a39a8b]">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
              </Link>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            <div className="mobile-fade-up mt-3" style={{ animationDelay: "70ms" }}>
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-[#23212c]">{t("title")}</h2>
              <div className="mt-2 flex items-center gap-2 text-[#d5b36a]">
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span className="text-[14px] text-[#7d7468]">
                  {t("subtitle")}
                </span>
              </div>
            </div>

            <div className="mobile-fade-up mt-6 space-y-5" style={{ animationDelay: "120ms" }}>
              <div>
                <label className="mobile-label">{t("businessTypeLabel")}</label>
                <input className="mobile-input" defaultValue={t("defaultBusinessType")} />
              </div>

              <div>
                <label className="mobile-label">{t("highlightsLabel")}</label>
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
                      setTags((current) => [...current, t("highlightN", { n: current.length + 1 })])
                    }
                    className="mobile-pill h-9 bg-[#f2f0eb] px-4 text-[12px] font-bold text-[#8f8578]"
                  >
                    {t("addTag")}
                  </button>
                </div>
              </div>

              <div>
                <label className="mobile-label">{t("uniqueSellingPointsLabel")}</label>
                <textarea
                  className="mobile-input min-h-[120px] resize-none"
                  placeholder={t("uniqueSellingPointsPlaceholder")}
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = prompt
                  ? `"${prompt} ${t("promptSuffix")}"`
                  : suggestionByLanguage[activeLanguage];
                setSuggestion(next);
                setSavedToProfile(false);
              }}
              className="mobile-pill mobile-button-gold mobile-fade-up mt-7 h-14 w-full text-base font-extrabold"
              style={{ animationDelay: "180ms" }}
            >
              <span className="material-symbols-outlined mr-2 text-[18px]">auto_fix_high</span>
              {t("generateDescription")}
            </button>

            <div className="mobile-fade-up mt-8" style={{ animationDelay: "240ms" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-[1.35rem] font-extrabold tracking-[-0.05em] text-[#23212c]">{t("aiSuggestions")}</h3>
                <div className="flex rounded-full bg-[#f1ece4] p-1">
                  {(["EN", "FR", "AR", "ES"] as SuggestionLanguage[]).map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        const language = chip as SuggestionLanguage;
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
                  <span>{t("charactersCount", { count: suggestion.length })}</span>
                  <button
                    type="button"
                    onClick={() => setCopied(true)}
                    className="flex items-center gap-1 text-[#2e9c70]"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    {copied ? t("copied") : t("copy")}
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
              {t("regenerate")}
              </button>
              <button
                type="button"
                onClick={() => setSavedToProfile(true)}
                className="mobile-pill h-12 flex-1 bg-[#2c2928] text-[13px] font-extrabold text-white"
              >
              {t("saveToProfile")}
              </button>
            </div>
            {savedToProfile ? (
              <p className="pb-2 text-center text-[12px] font-semibold text-[#5f8e70]">
              {t("savedConfirmation")}
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
