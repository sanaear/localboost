'use client';

import Link from 'next/link';
import { use, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MobileBottomNav from '@/components/MobileBottomNav';
import OptimizedImage from '@/components/OptimizedImage';
import { ErrorState, SkeletonLine } from '@/components/UiState';
import { API_BASE_URL, type Business } from '@/lib/api';

type AiSuggestion = Partial<Business> & {
  id?: number | string;
  avgRating?: number;
  estimatedPrice?: number;
};

type ItineraryPayload = {
  city?: string;
  steps?: Array<{
    order?: number;
    time?: string;
    tip?: string;
    business?: {
      name?: string;
      city?: string;
      description?: string;
      estimatedPrice?: number;
    };
  }>;
  totalEstimatedCost?: number;
  message?: string;
};

function normalizeAiSuggestions(suggestions: AiSuggestion[] | undefined): Business[] {
  if (!Array.isArray(suggestions)) return [];

  return suggestions
    .map((suggestion) => {
      const id = Number(suggestion.id);
      if (!Number.isFinite(id) || id <= 0) return null;
      return {
        id,
        user_id: Number(suggestion.user_id) || 0,
        category_id: suggestion.category_id,
        name: suggestion.name ?? '',
        city: suggestion.city,
        lat: suggestion.lat,
        lng: suggestion.lng,
        description: suggestion.description,
        images: Array.isArray(suggestion.images) ? suggestion.images : [],
        status: suggestion.status,
        created_at: suggestion.created_at ?? new Date().toISOString(),
        updated_at: suggestion.updated_at ?? new Date().toISOString(),
        region_id: suggestion.region_id,
        category: suggestion.category,
        regionRel: suggestion.regionRel,
        user: suggestion.user,
        reviews: suggestion.reviews,
      } satisfies Business;
    })
    .filter(Boolean) as Business[];
}

function formatItineraryPayload(payload: unknown) {
  if (typeof payload === 'string') return payload;
  if (!payload || typeof payload !== 'object') return '';

  const data = payload as ItineraryPayload;
  if (data.message && (!data.steps || data.steps.length === 0)) return data.message;
  if (!Array.isArray(data.steps) || data.steps.length === 0) return JSON.stringify(payload);

  const lines = data.steps.map((step, index) => {
    const name = step.business?.name ?? 'LocalBoost stop';
    const time = step.time ? `${step.time} - ` : '';
    const tip = step.tip ? ` (${step.tip})` : '';
    return `${step.order ?? index + 1}. ${time}${name}${tip}`;
  });

  if (data.totalEstimatedCost) {
    lines.push(`Estimated total: ${data.totalEstimatedCost} MAD`);
  }

  return lines.join('\n');
}

export default function AiChatPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('aiChat');
  const tCommon = useTranslations('common');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [recommendations, setRecommendations] = useState<Business[] | null>(null);
  const [recommendationsError, setRecommendationsError] = useState(false);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [itineraryError, setItineraryError] = useState(false);
  const [isBuildingItinerary, setIsBuildingItinerary] = useState(false);

  const recommendationsLabel = useMemo(() => {
    return params.locale === 'ar'
      ? 'مقترحات'
      : params.locale === 'fr'
        ? 'Suggestions'
        : params.locale === 'es'
          ? 'Sugerencias'
          : 'Suggestions';
  }, [params.locale]);

  useEffect(() => {
    let cancelled = false;
    setRecommendations(null);
    setRecommendationsError(false);
    void (async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/ai/recommend?lang=${encodeURIComponent(params.locale)}`
        );
        if (!response.ok) throw new Error('Request failed');
        const payload = (await response.json()) as { data?: Business[] };
        if (cancelled) return;
        setRecommendations(Array.isArray(payload.data) ? payload.data : []);
      } catch {
        if (cancelled) return;
        setRecommendationsError(true);
        setRecommendations([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params.locale]);

  async function handleSend() {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setSendError(false);
    setMessage('');
    setMessages((current) => [...current, { role: 'user', text: trimmed }]);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, lang: params.locale }),
      });
      if (!response.ok) throw new Error('Request failed');
      const payload = (await response.json()) as {
        data?: { text?: string; suggestions?: AiSuggestion[] };
      };
      const text = payload.data?.text ?? '';
      const suggestions = normalizeAiSuggestions(payload.data?.suggestions);
      if (suggestions.length > 0) {
        setRecommendations(suggestions);
        setRecommendationsError(false);
      }
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: text || tCommon('errorDescription') },
      ]);
    } catch {
      setSendError(true);
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: tCommon('errorDescription') },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  async function handleBuildItinerary() {
    if (isBuildingItinerary) return;
    setIsBuildingItinerary(true);
    setItineraryError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: 'Fès', lang: params.locale }),
      });
      if (!response.ok) throw new Error('Request failed');
      const payload = (await response.json()) as { data?: unknown };
      setItinerary(formatItineraryPayload(payload.data));
    } catch {
      setItineraryError(true);
      setItinerary(null);
    } finally {
      setIsBuildingItinerary(false);
    }
  }

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
                  <h1 className="text-xl font-extrabold tracking-[-0.05em] text-[#a36e00]">
                    {t('title')}
                  </h1>
                  <p className="rounded-full bg-[#d8f5df] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.14em] text-[#1f9a60]">
                    {t('modeTourist')}
                  </p>
                </div>
              </div>
              <div className="rounded-full bg-white px-3 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                {params.locale.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            {messages.length === 0 ? (
              <div className="mobile-fade-up mt-4 rounded-[30px] border border-[#ecdabf] bg-white px-4 py-5 shadow-[0_14px_28px_rgba(31,26,10,0.06)]">
                <div className="flex items-center gap-2 text-[15px] font-extrabold text-[#a36e00]">
                  <span className="material-symbols-outlined text-[17px]">auto_awesome</span>
                  {t('guideTitle')}
                </div>
                <p className="mt-3 text-[14px] leading-6 text-[#6f665c]">
                  {t('sampleAssistantMessage')}
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {messages.map((item, index) =>
                  item.role === 'user' ? (
                    <div
                      key={index}
                      className="mobile-fade-up ml-auto max-w-[255px] rounded-[30px] rounded-tr-[12px] bg-[#eba521] px-5 py-5 text-[15px] leading-7 text-white shadow-[0_16px_28px_rgba(235,165,33,0.28)]"
                    >
                      {item.text}
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="mobile-fade-up rounded-[30px] border border-[#ecdabf] bg-white px-4 py-5 shadow-[0_14px_28px_rgba(31,26,10,0.06)]"
                    >
                      <div className="flex items-center gap-2 text-[15px] font-extrabold text-[#a36e00]">
                        <span className="material-symbols-outlined text-[17px]">auto_awesome</span>
                        {t('title')}
                      </div>
                      <p className="mt-3 text-[14px] leading-6 text-[#6f665c]">{item.text}</p>
                    </div>
                  )
                )}
              </div>
            )}

            <div
              className="mobile-scrollbar-hidden mobile-fade-up mt-5 flex gap-3 overflow-x-auto pb-2"
              style={{ animationDelay: '180ms' }}
            >
              {recommendations === null ? (
                <div className="flex gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="mobile-card w-[175px] shrink-0 overflow-hidden">
                      <div className="h-[140px] bg-[#efece6]" />
                      <div className="px-4 py-4">
                        <SkeletonLine className="h-5 w-[75%]" />
                        <SkeletonLine className="mt-2 h-4 w-[55%]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendationsError ? (
                <div className="w-full">
                  <ErrorState
                    title={tCommon('errorTitle')}
                    description={tCommon('errorDescription')}
                    onRetry={() => {
                      setRecommendations(null);
                      setRecommendationsError(false);
                      void (async () => {
                        try {
                          const response = await fetch(
                            `${API_BASE_URL}/ai/recommend?lang=${encodeURIComponent(params.locale)}`
                          );
                          if (!response.ok) throw new Error('Request failed');
                          const payload = (await response.json()) as { data?: Business[] };
                          setRecommendations(Array.isArray(payload.data) ? payload.data : []);
                        } catch {
                          setRecommendationsError(true);
                          setRecommendations([]);
                        }
                      })();
                    }}
                    retryLabel={tCommon('retry')}
                  />
                </div>
              ) : (
                recommendations.slice(0, 8).map((place) => (
                  <Link
                    key={place.id}
                    href={`/${params.locale}/businesses/${place.id}`}
                    className="mobile-card mobile-card-hover w-[175px] shrink-0 overflow-hidden"
                  >
                    <div className="relative h-[140px]">
                      {place.images?.[0] ? (
                        <OptimizedImage
                          src={place.images[0]}
                          alt={place.name}
                          width={700}
                          height={525}
                          sizes="175px"
                          widths={[350, 525, 700]}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-[#efece6]" />
                      )}
                      <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] mobile-badge-green">
                        {recommendationsLabel}
                      </span>
                    </div>
                    <div className="px-4 py-4">
                      <h3 className="text-[1.2rem] font-extrabold tracking-[-0.05em] text-[#2a2730]">
                        {place.name}
                      </h3>
                      <div className="mt-2 text-[12px] font-semibold text-[#7b7267]">
                        {[place.city, place.regionRel?.name].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="mobile-fade-up mt-6" style={{ animationDelay: '240ms' }}>
              <p className="text-[17px] font-semibold italic leading-7 text-[#786f64]">
                {t('questionItinerary')}
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => void handleBuildItinerary()}
                  disabled={isBuildingItinerary}
                  className="mobile-pill mobile-button-gold h-12 flex-1 text-[13px] font-extrabold disabled:opacity-60"
                >
                  {t('yesBuildItinerary')}
                </button>
                <Link
                  href={`/${params.locale}/map`}
                  className="mobile-pill h-12 flex-1 border border-[#e4d9ca] bg-white text-[13px] font-bold text-[#6f675b]"
                >
                  {t('showOnMap')}
                </Link>
              </div>
              {itineraryError ? (
                <div className="mt-4">
                  <ErrorState
                    title={tCommon('errorTitle')}
                    description={tCommon('errorDescription')}
                    onRetry={() => void handleBuildItinerary()}
                    retryLabel={tCommon('retry')}
                  />
                </div>
              ) : itinerary ? (
                <div className="mt-4 whitespace-pre-line rounded-[24px] border border-[#eadcc6] bg-white px-4 py-4 text-[13px] leading-6 text-[#6f665c] shadow-[0_10px_22px_rgba(31,26,10,0.05)]">
                  {itinerary}
                </div>
              ) : null}
            </div>

            <div className="mobile-fade-up mt-8" style={{ animationDelay: '320ms' }}>
              <p className="mb-3 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#c2b7a2]">
                {t('quickExplore')}
              </p>
              <div className="mobile-search-shadow flex items-center gap-3 rounded-full bg-white px-4 py-3">
                <span className="material-symbols-outlined text-[#d2b071]">auto_awesome</span>
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={t('askPlaceholder')}
                  className="w-full flex-1 bg-transparent text-[14px] text-[#2a2730] placeholder:text-[#c2b9aa] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={isSending}
                  className="mobile-pill h-10 w-10 bg-[#e8a620] text-white disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
              {sendError ? (
                <p className="mt-3 text-[12px] font-semibold text-[#6f8d72]">
                  {tCommon('errorDescription')}
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
