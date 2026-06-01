'use client';

import Link from 'next/link';
import { use, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import MerchantAppBottomNav from '@/components/MerchantAppBottomNav';
import { ErrorState } from '@/components/UiState';
import { API_BASE_URL } from '@/lib/api';
import { getMerchantIdentity } from '@/lib/merchant';

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

async function fetchSummary(token: string, days: number) {
  const response = await fetch(`${API_BASE_URL}/analytics/merchant/summary?days=${days}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Request failed');
  const payload = (await response.json()) as {
    data?: {
      totalViews?: number;
      totalClicks?: number;
      viewsByDay?: Array<{ day: string; count: number }>;
      clicksByDay?: Array<{ day: string; count: number }>;
      viewsByBusiness?: Array<{ business_id: number; name: string; count: number }>;
    };
  };
  return payload.data;
}

export default function MerchantStatsPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('merchantStats');
  const identity = useMemo(() => getMerchantIdentity(), []);
  const [selectedRange, setSelectedRange] = useState<string>('7d');
  const [reportExpanded, setReportExpanded] = useState(false);

  const days = useMemo(() => {
    if (selectedRange === '7d') return 7;
    if (selectedRange === '90d') return 90;
    return 30;
  }, [selectedRange]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['merchant-stats', days, identity?.token],
    queryFn: () => fetchSummary(identity!.token!, days),
    enabled: !!identity?.token,
  });

  const totalViews = data?.totalViews ?? 0;
  const totalClicks = data?.totalClicks ?? 0;
  const viewsByDay = data?.viewsByDay ?? [];
  const clicksByDay = data?.clicksByDay ?? [];
  const viewsByBusiness = data?.viewsByBusiness ?? [];

  const today = new Date();
  const last7 = Array.from({ length: 7 }).map((_, index) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - index));
    return d.toISOString().slice(0, 10);
  });
  const viewsMap = new Map<string, number>(
    viewsByDay.map((row) => [String(row.day).slice(0, 10), Number(row.count) || 0])
  );
  const clicksMap = new Map<string, number>(
    clicksByDay.map((row) => [String(row.day).slice(0, 10), Number(row.count) || 0])
  );
  const viewsActivity = last7.map((key) => viewsMap.get(key) ?? 0);
  const clicksBars = last7.map((key) => clicksMap.get(key) ?? 0);
  const highestBar = Math.max(...(clicksBars.length ? clicksBars : [0]));
  const maxViews = Math.max(...(viewsActivity.length ? viewsActivity : [1]));

  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

  const peakIdx = viewsActivity.indexOf(Math.max(...viewsActivity));
  const peakLabel = peakIdx >= 0 ? dayLabels[peakIdx] : '—';
  const peakValue = peakIdx >= 0 ? viewsActivity[peakIdx] : 0;
  const reportInsight =
    viewsByBusiness.length > 0
      ? `${viewsByBusiness[0].name} is currently your strongest discovery source with ${viewsByBusiness[0].count.toLocaleString()} view${viewsByBusiness[0].count === 1 ? '' : 's'}. Keep profile copy, photos, and offers fresh there first.`
      : 'No discovery trend is available yet. Views will appear here after tourists open your business profile.';

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#f9f9f7]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-[16px] text-on-primary-container">
                    bar_chart
                  </span>
                </div>
                <h1 className="text-[1.4rem] font-extrabold tracking-[-0.05em] text-primary">
                  LocalBoost
                </h1>
              </div>
              <Link href={`/${params.locale}/merchant/updates`} className="text-primary-container">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
              </Link>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            {isError ? (
              <div className="mt-6">
                <ErrorState
                  title="Something went wrong"
                  description="Check your connection and try again."
                  onRetry={() => refetch()}
                  retryLabel="Retry"
                />
              </div>
            ) : null}

            <div className="mobile-fade-up mt-4" style={{ animationDelay: '60ms' }}>
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-on-surface">
                {t('title')}
              </h2>
              <p className="mt-2 text-[14px] leading-6 text-on-surface-variant">{t('subtitle')}</p>
            </div>

            <div className="mt-4 bg-surface-container-low p-1.5 rounded-full flex gap-1 items-center">
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setSelectedRange(range)}
                  className={`flex-1 py-2 text-xs font-label font-bold text-center rounded-full ${
                    selectedRange === range
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high transition-colors'
                  }`}
                >
                  {range}
                </button>
              ))}
              <div className="w-[1px] h-4 bg-outline-variant/30 mx-1"></div>
              <button
                type="button"
                onClick={() => setSelectedRange('30d')}
                className="px-4 py-2 text-xs font-label font-bold text-center rounded-full text-on-surface-variant flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                Custom
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">
              <div className="col-span-2 bg-surface-container-low rounded-lg p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
                <span className="text-on-surface-variant text-xs font-label tracking-wider uppercase mb-2">
                  {t('totalViews')}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-headline font-bold text-primary">
                    {isLoading ? '—' : totalViews.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-5 flex flex-col">
                <span className="text-on-surface-variant text-[10px] font-label tracking-wider uppercase mb-1">
                  {t('ctr')}
                </span>
                <span className="text-xl font-headline font-bold text-on-surface">
                  {isLoading ? '—' : `${ctr}%`}
                </span>
                <span className="text-on-surface-variant text-[10px] mt-1">{t('avgLabel')}</span>
              </div>
              <div className="bg-surface-container-low rounded-lg p-5 flex flex-col">
                <span className="text-on-surface-variant text-[10px] font-label tracking-wider uppercase mb-1">
                  {t('peakDay')}
                </span>
                <span className="text-xl font-headline font-bold text-on-surface">
                  {isLoading ? '—' : peakLabel}
                </span>
                <span className="text-on-surface-variant text-[10px] mt-1">
                  {isLoading
                    ? ''
                    : `${peakValue.toLocaleString()} ${t('viewsCount', { count: peakValue })}`}
                </span>
              </div>
            </div>

            <div className="mt-7">
              <div className="flex justify-between items-end mb-4">
                <h2 className="font-headline font-bold text-lg text-on-surface">
                  {t('viewsActivity')}
                </h2>
                <span className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                  {t('liveUpdates')}
                </span>
              </div>
              <div className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_12px_48px_rgba(26,28,27,0.04)]">
                <div className="h-48 w-full flex items-end gap-2 relative">
                  <div className="absolute inset-0 flex flex-col justify-between py-2">
                    {[0, 1, 2, 3].map((row) => (
                      <div
                        key={row}
                        className="border-b border-outline-variant/10 w-full h-0"
                      ></div>
                    ))}
                  </div>
                  <svg
                    className="absolute inset-0 w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="lineGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#EBA020', stopOpacity: 0.2 }}></stop>
                        <stop offset="100%" style={{ stopColor: '#EBA020', stopOpacity: 0 }}></stop>
                      </linearGradient>
                    </defs>
                    {!isLoading && viewsActivity.length > 0 ? (
                      <>
                        <path
                          d={viewsActivity
                            .map((v, i, arr) => {
                              const x = (i / (arr.length - 1)) * 100;
                              const y = maxViews > 0 ? 100 - (v / maxViews) * 80 : 100;
                              return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
                            })
                            .join(' ')}
                          fill="none"
                          stroke="#825500"
                          strokeLinecap="round"
                          strokeWidth="3"
                        />
                        <path
                          d={`${viewsActivity
                            .map((v, i, arr) => {
                              const x = (i / (arr.length - 1)) * 100;
                              const y = maxViews > 0 ? 100 - (v / maxViews) * 80 : 100;
                              return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
                            })
                            .join(' ')} V100 H0 Z`}
                          fill="url(#lineGrad)"
                        />
                      </>
                    ) : null}
                  </svg>
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-label font-bold text-on-surface-variant/60 uppercase tracking-tighter">
                  {dayLabels.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-7">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-headline font-bold text-lg text-on-surface">
                  {t('clicksByDay')}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                    {t('conversion')}
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_12px_48px_rgba(26,28,27,0.04)]">
                <div className="h-32 w-full flex items-end justify-between gap-3">
                  {clicksBars.length > 0
                    ? clicksBars.map((value, index) => {
                        const pct = highestBar > 0 ? (value / highestBar) * 100 : 0;
                        const isMax = value === highestBar && value > 0;
                        return (
                          <div
                            key={index}
                            className="flex-1 flex items-end justify-center relative"
                          >
                            {isMax ? (
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[8px] py-0.5 px-1.5 rounded font-bold">
                                {value}
                              </div>
                            ) : null}
                            <div
                              className={`w-full rounded-t-sm ${isMax ? 'bg-tertiary' : 'bg-surface-container-high'}`}
                              style={{ height: `${Math.max(pct, 4)}%` }}
                            ></div>
                          </div>
                        );
                      })
                    : Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-surface-container-high rounded-t-sm"
                          style={{ height: '10%' }}
                        ></div>
                      ))}
                </div>
              </div>
            </div>

            <div className="mt-7 pb-2">
              <h2 className="font-headline font-bold text-lg text-on-surface mb-4 px-1">
                {t('howFound')}
              </h2>
              <div className="bg-surface-container-low rounded-lg overflow-hidden">
                <div className="flex flex-col">
                  {(isLoading ? [] : viewsByBusiness).length > 0 ? (
                    viewsByBusiness.map((item, index) => {
                      const icons = ['search', 'explore', 'location_on', 'hotel_class'];
                      return (
                        <div
                          key={item.business_id}
                          className="flex justify-between items-center p-4 hover:bg-surface-container-high transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">
                              {icons[index] || 'search'}
                            </span>
                            <span className="font-medium text-on-surface">{item.name}</span>
                          </div>
                          <span className="bg-primary-fixed-dim text-on-primary-fixed-variant text-[10px] font-bold px-2.5 py-1 rounded-full">
                            {item.count.toLocaleString()}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-on-surface-variant text-sm">
                      No keyword data available
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReportExpanded((current) => !current)}
                className="w-full mt-4 py-4 text-primary font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-primary/5 rounded-full transition-all"
              >
                {t('viewFullReport')}
                <span className="material-symbols-outlined text-sm">
                  {reportExpanded ? 'expand_less' : 'arrow_forward'}
                </span>
              </button>
              {reportExpanded ? (
                <div className="mt-4 rounded-[20px] bg-surface-container-low px-4 py-4 text-[12px] leading-6 text-on-surface-variant">
                  {reportInsight}
                </div>
              ) : null}
            </div>
          </div>

          <div className="px-2 pb-3 pt-2">
            <MerchantAppBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
