'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import MerchantBottomNav from '@/components/MerchantBottomNav';
import { ErrorState } from '@/components/UiState';
import { API_BASE_URL } from '@/lib/api';
import {
  clearMerchantSetupDraft,
  readMerchantSetupStep1,
  readMerchantSetupStep2,
  readMerchantSetupStep3,
  writeMerchantSetupStep3,
} from '@/lib/merchantSetup';

const DAY_NAMES = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const defaultDays: Record<string, { start: string; end: string; enabled: boolean }> = {
  monday: { start: '09:00', end: '19:00', enabled: true },
  tuesday: { start: '09:00', end: '19:00', enabled: true },
  wednesday: { start: '09:00', end: '19:00', enabled: true },
  thursday: { start: '09:00', end: '19:00', enabled: true },
  friday: { start: '09:00', end: '13:00', enabled: true },
  saturday: { start: '10:00', end: '20:00', enabled: true },
  sunday: { start: '09:00', end: '17:00', enabled: false },
};

function normalizeMoroccanPhone(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('+')) return trimmed.replace(/\s+/g, ' ');
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return undefined;
  if (digits.startsWith('212')) return `+${digits}`;
  if (digits.startsWith('0')) return `+212${digits.slice(1)}`;
  return `+212${digits}`;
}

function normalizeWebsite(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function MerchantContactSetupPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('merchantSetup');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const [days, setDays] =
    useState<Record<string, { start: string; end: string; enabled: boolean }>>(defaultDays);
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = readMerchantSetupStep3();
    if (!saved) return;
    const merged: Record<string, { start: string; end: string; enabled: boolean }> = {};
    for (const day of DAY_NAMES) {
      const existing = saved.openingHours?.[day];
      merged[day] =
        existing && typeof existing === 'object'
          ? {
              start: existing.start || defaultDays[day].start,
              end: existing.end || defaultDays[day].end,
              enabled:
                typeof existing.enabled === 'boolean' ? existing.enabled : defaultDays[day].enabled,
            }
          : { ...defaultDays[day] };
    }
    setDays(merged);
    if (saved.whatsapp) setWhatsapp(saved.whatsapp);
    if (saved.website) setWebsite(saved.website);
  }, []);

  function toggleDay(day: string) {
    setDays((current) => ({
      ...current,
      [day]: { ...current[day], enabled: !current[day].enabled },
    }));
  }

  function updateTime(day: string, field: 'start' | 'end', value: string) {
    setDays((current) => ({
      ...current,
      [day]: { ...current[day], [field]: value },
    }));
  }

  useEffect(() => {
    writeMerchantSetupStep3({
      openingHours: days,
      whatsapp: whatsapp.trim() || undefined,
      website: website.trim() || undefined,
    });
  }, [days, whatsapp, website]);

  const { data: categoryList } = useQuery({
    queryKey: ['setup-categories'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
    staleTime: 600000,
  });

  function findCategoryId(category: string): number | undefined {
    if (!Array.isArray(categoryList)) return undefined;
    const match = categoryList.find((c: any) => {
      const en = (c.name_en || '').toLowerCase();
      return (
        en === category.toLowerCase() || en.startsWith(category.replace(/s$/, '').toLowerCase())
      );
    });
    return match?.id;
  }

  function getAuthHeaders(): Record<string, string> {
    const token =
      typeof window !== 'undefined' ? window.localStorage.getItem('lb:authToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function handleFinish() {
    setSubmitError(false);
    setIsSubmitting(true);

    const step1 = readMerchantSetupStep1();
    const step2 = readMerchantSetupStep2();
    if (!step1 || !step2) {
      setSubmitError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const categoryId = findCategoryId(step1.category);
      const normalizedWhatsapp = normalizeMoroccanPhone(whatsapp);
      const businessPayload: Record<string, unknown> = {
        name: step1.businessName,
        city: step1.city || undefined,
        address: step1.address || undefined,
        phone: normalizeMoroccanPhone(step1.phone),
        whatsapp: normalizedWhatsapp,
        website: normalizeWebsite(website),
        opening_hours: days,
      };
      if (categoryId) businessPayload.category_id = categoryId;

      const createRes = await fetch(`${API_BASE_URL}/businesses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(businessPayload),
      });

      if (!createRes.ok) throw new Error('Failed to create business');
      const business = await createRes.json();

      if (step2.photos.length > 0) {
        const imageRes = await fetch(`${API_BASE_URL}/businesses/${business.id}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ images: step2.photos }),
        });
        if (!imageRes.ok) throw new Error('Failed to upload business images');
      }

      clearMerchantSetupDraft();
      router.replace(`/${params.locale}/merchant/submitted`);
    } catch {
      setSubmitError(true);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#f9f9f7]">
          <nav className="bg-[#f9f9f7] flex justify-between items-center w-full px-6 py-4">
            <div className="flex items-center gap-3">
              <Link href={`/${params.locale}/merchant/setup/photos`} className="text-[#825500]">
                <span className="material-symbols-outlined">chevron_left</span>
              </Link>
              <span className="text-xl font-bold text-[#825500] font-headline tracking-tight">
                {t('headerLine1')}
              </span>
            </div>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#eba020]">
              <span className="material-symbols-outlined text-[#825500] text-xl block text-center leading-10">
                person
              </span>
            </div>
          </nav>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-6 pt-4 pb-40">
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="font-label text-[10px] font-bold uppercase tracking-widest text-[#825500]">
                    {t('finalStep')}
                  </span>
                  <h1 className="text-2xl font-headline font-extrabold tracking-tight mt-1 text-[#1a1c1b]">
                    {t('contactTitleLine1')} &amp; {t('contactTitleLine2')}
                  </h1>
                </div>
                <div className="text-right">
                  <span className="font-headline font-bold text-[#825500]">100%</span>
                  <p className="font-label text-[10px] text-[#847562]">
                    {t('step', { current: 3, total: 3 })}
                  </p>
                </div>
              </div>
              <div className="h-2 w-full bg-[#eeeeec] rounded-full overflow-hidden">
                <div className="h-full bg-[#eba020] w-full rounded-full" />
              </div>
              <p className="text-[#524534] mt-4 max-w-lg leading-relaxed text-sm">
                {t('contactDescription')}
              </p>
            </div>

            {submitError ? (
              <div className="mb-4">
                <ErrorState
                  title={tCommon('errorTitle')}
                  description={tCommon('errorDescription')}
                  onRetry={() => void handleFinish()}
                  retryLabel={tCommon('retry')}
                />
              </div>
            ) : null}

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="material-symbols-outlined text-[#006c4c]">schedule</span>
                <h2 className="font-headline font-bold text-xl text-[#1a1c1b]">
                  {t('weeklySchedule')}
                </h2>
              </div>

              <div className="bg-[#ffffff] p-5 rounded-xl shadow-[0_12px_48px_rgba(26,28,27,0.04)] space-y-2">
                {DAY_NAMES.map((day) => {
                  const d = days[day];
                  const enabled = d?.enabled ?? defaultDays[day].enabled;
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between gap-3 py-3 border-b border-[#d7c3ae]/20 last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-[100px]">
                        <button
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            enabled ? 'bg-[#825500]' : 'bg-[#e2e3e1]'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                              enabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
                            }`}
                          />
                        </button>
                        <span
                          className={`font-headline font-bold text-sm ${enabled ? 'text-[#1a1c1b]' : 'text-[#847562]'}`}
                        >
                          {t(`days.${day}`)}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-2 ${!enabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                      >
                        <input
                          type="time"
                          value={d?.start ?? defaultDays[day].start}
                          onChange={(e) => updateTime(day, 'start', e.target.value)}
                          className="bg-[#f4f4f2] border-0 rounded-lg font-body text-sm px-3 py-2 focus:ring-2 focus:ring-[#eba020] w-24"
                        />
                        <span className="text-[#847562] text-xs font-bold uppercase">to</span>
                        <input
                          type="time"
                          value={d?.end ?? defaultDays[day].end}
                          onChange={(e) => updateTime(day, 'end', e.target.value)}
                          className="bg-[#f4f4f2] border-0 rounded-lg font-body text-sm px-3 py-2 focus:ring-2 focus:ring-[#eba020] w-24"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 mb-1 mt-8">
                <span className="material-symbols-outlined text-[#006c4c]">contact_page</span>
                <h2 className="font-headline font-bold text-xl text-[#1a1c1b]">
                  {t('contactChannels')}
                </h2>
              </div>

              <div className="bg-[#f4f4f2] p-6 rounded-xl space-y-6 border border-[#d7c3ae]/10">
                <div className="space-y-3">
                  <label className="font-label text-[10px] font-bold uppercase tracking-widest text-[#524534] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">chat</span>
                    {t('whatsappLabel')}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <span className="font-headline font-bold text-sm text-[#1a1c1b]">+212</span>
                    </div>
                    <input
                      className="w-full bg-[#ffffff] border-b-2 border-[#d7c3ae]/30 focus:border-[#825500] focus:ring-0 pl-16 pr-4 py-4 rounded-t-lg transition-all font-headline font-medium text-[#1a1c1b]"
                      placeholder="6 00 00 00 00"
                      value={whatsapp}
                      onChange={(event) => setWhatsapp(event.target.value)}
                      type="tel"
                    />
                  </div>
                  <p className="text-[11px] text-[#847562] font-body leading-tight">
                    {t('whatsappDescription')}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="font-label text-[10px] font-bold uppercase tracking-widest text-[#524534] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">language</span>
                    {t('websiteLabel')}
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[#847562]">link</span>
                    </div>
                    <input
                      className="w-full bg-[#ffffff] border-b-2 border-[#d7c3ae]/30 focus:border-[#825500] focus:ring-0 pl-12 pr-4 py-4 rounded-t-lg transition-all font-headline font-medium text-[#1a1c1b]"
                      placeholder={t('websitePlaceholder')}
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                      type="url"
                    />
                  </div>
                </div>

                <div className="relative h-40 rounded-lg overflow-hidden mt-4 group">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt=""
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2f2ohfqwxZRU6s0ZTnucsw6K_eg1xHZ-lWe2j2uc7S0pq2MfXc6HG8_3EFVBzrMipFRaZF4TQwk5rxufEHgXcLdyp4-Z8jA5vBvMgwNp3hu5g67r641u5x4C6bhxoee2a0Va9T1fmNaVuaKE4A9V_M62_ROd60rnoo7fWnAuCkXJzq0NMpyFEg5MbRAzbLF20gJ7tfdU6c7kyrXk5sx31fE40kFfAZEEFwmB1y7tULapCdeTzE6Q7flFH61iEODLKHRS98ELAXuQ"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1b]/60 to-transparent flex items-end p-4">
                    <p className="text-white text-xs font-body italic leading-relaxed">
                      {t('contactQuote')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="absolute bottom-0 left-0 w-full bg-[#f9f9f7]/80 backdrop-blur-xl px-6 py-5 border-t border-[#d7c3ae]/10">
            <div className="flex justify-between items-center gap-4">
              <Link
                href={`/${params.locale}/merchant/setup/photos`}
                className="flex items-center gap-2 text-[#847562] font-headline font-bold hover:text-[#1a1c1b] transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                {t('previousStep')}
              </Link>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void handleFinish()}
                className="bg-[#825500] text-[#ffffff] px-10 py-4 rounded-full font-headline font-extrabold text-base shadow-[0_12px_48px_rgba(130,85,0,0.25)] hover:scale-105 active:scale-95 transition-all disabled:opacity-60"
              >
                {t('finish')}
              </button>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
