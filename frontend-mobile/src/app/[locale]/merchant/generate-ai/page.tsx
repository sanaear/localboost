'use client';

import Link from 'next/link';
import { use, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MerchantAppBottomNav from '@/components/MerchantAppBottomNav';
import { API_BASE_URL, type Business } from '@/lib/api';
import { fetchMyBusinesses, getMerchantIdentity } from '@/lib/merchant';

const suggestionByLanguage = {
  EN: `"Step into a world of timeless craftsmanship at our Medina studio. We specialize in hand-thrown pottery, featuring our signature Cobalt Blue glaze that echoes the deep colors of the Atlas sky. Each piece tells a story of tradition preserved since 1950."`,
  FR: `"Entrez dans un univers de savoir-faire intemporel dans notre atelier de la médina. Notre poterie tournée à la main et notre émail bleu cobalt racontent une histoire d'artisanat préservé depuis 1950."`,
  AR: `"ادخل إلى عالم من الحرفية الأصيلة في ورشتنا داخل المدينة. نحن متخصصون في الفخار المصنوع يدويا بلمسة من اللون الأزرق الكوبالت المستوحى من سماء الأطلس. كل قطعة تحكي قصة تقاليد محفوظة منذ 1950."`,
  ES: `"Entra en un mundo de artesanía atemporal en nuestro taller de la medina. Creamos piezas de cerámica hechas a mano con nuestro esmalte Azul Cobalto, inspirado en los cielos del Atlas. Cada creación preserva una tradición viva desde 1950."`,
} as const;

type SuggestionLanguage = keyof typeof suggestionByLanguage;

const languageTabs: SuggestionLanguage[] = ['EN', 'FR', 'AR'];
const cleanSuggestionByLanguage: Record<SuggestionLanguage, string> = {
  EN: suggestionByLanguage.EN,
  FR: `"Entrez dans un univers de savoir-faire intemporel dans notre atelier de la medina. Notre poterie tournee a la main et notre email bleu cobalt racontent une histoire d'artisanat preserve depuis 1950."`,
  AR: `"Visit our medina workshop for handmade pottery, cobalt blue glazing, and a craft story preserved by local artisans since 1950."`,
  ES: `"Entra en un mundo de artesania atemporal en nuestro taller de la medina. Creamos piezas de ceramica hechas a mano con esmalte Azul Cobalto, inspirado en los cielos del Atlas."`,
};

function localeToSuggestionLanguage(locale: string): SuggestionLanguage {
  const normalized = locale.toLowerCase();
  if (normalized === 'fr') return 'FR';
  if (normalized === 'ar') return 'AR';
  if (normalized === 'es') return 'ES';
  return 'EN';
}

export default function MerchantGenerateAiPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('merchantAi');
  const tCommon = useTranslations('common');
  const identity = useMemo(() => getMerchantIdentity(), []);
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessType, setBusinessType] = useState('');
  const [prompt, setPrompt] = useState('');
  const defaultTags = useMemo(() => [t('defaultTag1'), t('defaultTag2')], [t]);
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [activeLanguage, setActiveLanguage] = useState<SuggestionLanguage>(() =>
    localeToSuggestionLanguage(params.locale)
  );
  const [suggestion, setSuggestion] = useState<string>(
    () =>
      cleanSuggestionByLanguage[localeToSuggestionLanguage(params.locale)] ??
      cleanSuggestionByLanguage.EN
  );
  const [savedToProfile, setSavedToProfile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const language = localeToSuggestionLanguage(params.locale);
    setActiveLanguage(language);
    setSuggestion(cleanSuggestionByLanguage[language] ?? cleanSuggestionByLanguage.EN);
    setTags(defaultTags);
    setCopied(false);
    setSavedToProfile(false);
  }, [defaultTags, params.locale]);

  useEffect(() => {
    let cancelled = false;
    async function loadMerchantBusiness() {
      if (!identity?.token) return;
      try {
        const businesses = await fetchMyBusinesses();
        if (cancelled) return;
        const firstBusiness = businesses[0] ?? null;
        setBusiness(firstBusiness);
        if (firstBusiness) {
          setBusinessType(
            firstBusiness.category?.name_en ||
              firstBusiness.category?.name_fr ||
              firstBusiness.name ||
              ''
          );
          setPrompt(firstBusiness.description || '');
        }
      } catch {
        if (!cancelled) setError(tCommon('errorDescription'));
      }
    }
    void loadMerchantBusiness();
    return () => {
      cancelled = true;
    };
  }, [identity?.token, tCommon]);

  async function handleGenerateDescription() {
    setError('');
    setSavedToProfile(false);
    setCopied(false);
    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ai1/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(identity?.token ? { Authorization: `Bearer ${identity.token}` } : {}),
        },
        body: JSON.stringify({
          businessType: businessType.trim() || business?.name || 'Local business',
          specialties: tags,
          usps: prompt.trim() || business?.description || undefined,
          language: activeLanguage,
          tone: 'storytelling',
          audience: 'travelers discovering Morocco',
          tags,
        }),
      });
      if (!response.ok) throw new Error('Generation failed');
      const payload = (await response.json()) as { data?: { text?: string } };
      const generatedText = payload.data?.text?.trim();
      if (!generatedText) throw new Error('Missing generated text');
      setSuggestion(`"${generatedText}"`);
    } catch {
      setError(tCommon('errorDescription'));
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSaveToProfile() {
    setError('');
    if (!identity?.token || !business) {
      setError(tCommon('errorDescription'));
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/businesses/${business.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${identity.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: suggestion.replace(/^"|"$/g, '') }),
      });
      if (!response.ok) throw new Error('Save failed');
      const updated = (await response.json()) as Business;
      setBusiness(updated);
      setSavedToProfile(true);
    } catch {
      setError(tCommon('errorDescription'));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <header className="flex items-center justify-between px-4 pb-2 pt-5">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary-container ring-2 ring-primary-container/20 overflow-hidden">
                <span className="text-[14px] font-extrabold text-on-primary-container font-headline">
                  LB
                </span>
              </div>
              <h1 className="text-[1.4rem] font-extrabold tracking-[-0.05em] text-primary font-headline">
                {tCommon('brand')}
              </h1>
            </div>
            <Link href={`/${params.locale}/merchant/updates`} className="text-[#a39a8b]">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
            </Link>
          </header>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            {/* Hero Header */}
            <div className="mobile-fade-up relative mb-8" style={{ animationDelay: '70ms' }}>
              <div className="absolute -top-2 -right-2 opacity-20">
                <span className="material-symbols-outlined text-6xl text-primary">
                  auto_awesome
                </span>
              </div>
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-[#23212c] leading-tight mb-1">
                {t('title')}
              </h2>
              <p className="text-[14px] text-[#7d7468] font-medium">{t('subtitle')}</p>
            </div>

            {/* Input Form */}
            <div className="mobile-fade-up space-y-6 mb-10" style={{ animationDelay: '120ms' }}>
              <div className="group">
                <label className="block text-[10px] uppercase tracking-wider text-on-surface-variant mb-2 ml-1 font-label font-bold">
                  {t('businessTypeLabel')}
                </label>
                <input
                  className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-colors py-2 px-1 text-on-surface placeholder:text-outline/50 font-body font-medium outline-none"
                  placeholder={t('businessTypePlaceholder')}
                  type="text"
                  value={businessType}
                  onChange={(event) => setBusinessType(event.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-on-surface-variant mb-3 ml-1 font-label font-bold">
                  {t('highlightsLabel')}
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-xs font-semibold"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                        className="material-symbols-outlined text-sm cursor-pointer"
                      >
                        close
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setTags((current) => [...current, t('highlightN', { n: current.length + 1 })])
                    }
                    className="inline-flex items-center px-4 py-1.5 border border-dashed border-outline-variant text-outline rounded-full text-xs font-medium hover:bg-surface-container-low transition-colors"
                  >
                    {t('addTag')}
                  </button>
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] uppercase tracking-wider text-on-surface-variant mb-2 ml-1 font-label font-bold">
                  {t('uniqueSellingPointsLabel')}
                </label>
                <textarea
                  className="w-full bg-surface-container-low rounded-lg border-none focus:ring-2 focus:ring-primary/20 transition-all p-4 text-on-surface placeholder:text-outline/50 text-sm leading-relaxed outline-none resize-none"
                  placeholder={t('uniqueSellingPointsPlaceholder')}
                  rows={3}
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                />
              </div>
            </div>

            {/* Generate CTA */}
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating}
              className="mobile-fade-up w-full py-4 bg-primary-container text-on-primary-container font-headline font-bold rounded-full shadow-[0_12px_24px_rgba(235,160,32,0.2)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
              style={{ animationDelay: '180ms' }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              {isGenerating ? tCommon('loading') : t('generateDescription')}
            </button>
            {error ? (
              <p className="mt-3 text-center text-[12px] font-semibold text-error">{error}</p>
            ) : null}

            {/* AI Suggestions */}
            <div className="mobile-fade-up mt-10 space-y-5" style={{ animationDelay: '240ms' }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  {t('aiSuggestions')}
                </h3>
                <div className="flex gap-1 p-1 bg-surface-container-high rounded-full">
                  {languageTabs.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setActiveLanguage(lang);
                        setSuggestion(cleanSuggestionByLanguage[lang] ?? cleanSuggestionByLanguage.EN);
                        setCopied(false);
                      }}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
                        activeLanguage === lang
                          ? 'bg-surface-container-lowest text-primary shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggestion Card */}
              <div className="relative bg-surface-container-lowest rounded-[3rem_1rem_3rem_1rem] p-8 shadow-[0_24px_48px_rgba(26,28,27,0.04)] border border-outline-variant/10">
                <div className="absolute top-6 right-6 flex gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                </div>
                <p className="text-on-surface leading-[1.8] font-body font-medium text-sm mb-6 italic">
                  {suggestion}
                </p>
                <div className="flex items-center justify-between border-t border-surface-container-high pt-4">
                  <div className="flex items-center gap-1.5 text-outline text-[10px] font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">subject</span>
                    {t('charactersCount', { count: suggestion.length })}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCopied(true);
                      void navigator.clipboard?.writeText(suggestion.replace(/"/g, ''));
                    }}
                    className="flex items-center gap-1 text-secondary font-bold text-xs"
                  >
                    <span className="material-symbols-outlined text-base">content_copy</span>
                    {copied ? t('copied') : t('copy')}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="mobile-fade-up mt-6 grid grid-cols-2 gap-4"
              style={{ animationDelay: '300ms' }}
            >
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 py-3 border-2 border-outline-variant/30 rounded-full font-headline font-bold text-on-surface text-sm hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
                {isGenerating ? tCommon('loading') : t('regenerate')}
              </button>
              <button
                type="button"
                onClick={handleSaveToProfile}
                disabled={isSaving || !identity?.token || !business}
                className="flex items-center justify-center gap-2 py-3 bg-inverse-surface text-inverse-on-surface rounded-full font-headline font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                {isSaving ? tCommon('loading') : t('saveToProfile')}
              </button>
            </div>
            {savedToProfile ? (
              <p className="mt-4 text-center text-[12px] font-semibold text-[#5f8e70]">
                {t('savedConfirmation')}
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
