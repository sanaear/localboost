'use client';

import { use, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import MerchantAppBottomNav from '@/components/MerchantAppBottomNav';
import { EmptyState, ErrorState, SkeletonLine } from '@/components/UiState';
import { API_BASE_URL } from '@/lib/api';
import { getMerchantIdentity } from '@/lib/merchant';

const accentStyles: Record<string, string> = {
  gold: 'bg-primary-fixed text-primary',
  green: 'bg-secondary-container text-secondary',
  gray: 'bg-surface-container-high text-on-surface-variant',
  peach: 'bg-surface-container-low text-tertiary',
};

type Accent = keyof typeof accentStyles;

type UpdateItem = {
  id: string;
  title: string;
  time: string;
  excerpt?: string;
  accent: Accent;
};

async function fetchUpdates(token: string) {
  const response = await fetch(`${API_BASE_URL}/merchant/updates`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Request failed');
  const payload = (await response.json()) as {
    latest: UpdateItem[];
    older: UpdateItem[];
  };
  return {
    latest: Array.isArray(payload.latest) ? payload.latest : [],
    older: Array.isArray(payload.older) ? payload.older : [],
  };
}

export default function MerchantUpdatesPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('merchantUpdates');
  const identity = useMemo(() => getMerchantIdentity(), []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['merchant-updates', identity?.token],
    queryFn: () => fetchUpdates(identity!.token!),
    enabled: !!identity?.token,
  });

  const latest = data?.latest ?? [];
  const older = data?.older ?? [];

  const iconMap: Record<Accent, string> = {
    gold: 'star',
    green: 'verified',
    gray: 'analytics',
    peach: 'campaign',
  };

  return (
    <div className="flex justify-center bg-surface-dim min-h-screen">
      <div className="w-[390px] bg-background min-h-screen flex flex-col relative overflow-hidden">
        <header
          className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#F9F9F7] backdrop-blur-xl"
          style={{ maxWidth: 390, left: '50%', transform: 'translateX(-50%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-[16px] text-on-primary-container">
                store
              </span>
            </div>
            <h1 className="font-headline font-extrabold tracking-tight text-xl text-primary">
              LocalBoost
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <span className="w-6 h-4 object-cover rounded-sm bg-primary-fixed"></span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">
                expand_more
              </span>
            </button>
            <button
              type="button"
              className="text-primary-container scale-95 active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        <main className="mt-20 px-6 pb-32 flex-grow">
          <div className="mb-8">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">{t('title')}</h2>
            <p className="font-body text-sm text-on-surface-variant">{t('subtitle')}</p>
          </div>

          {isError ? (
            <div className="mt-6">
              <ErrorState
                title="Could not load updates"
                description="Check your connection and try again."
                onRetry={() => refetch()}
                retryLabel="Retry"
              />
            </div>
          ) : null}

          {isLoading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((value) => (
                <div
                  key={value}
                  className="bg-surface-container-lowest p-5 rounded-lg shadow-[0_12px_48px_rgba(26,28,27,0.06)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-surface-container-high" />
                    <div className="min-w-0 flex-1">
                      <SkeletonLine className="h-4 w-[70%]" />
                      <SkeletonLine className="mt-2 h-3 w-[40%]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : latest.length === 0 && older.length === 0 ? (
            <EmptyState title={t('noUpdates')} description={t('noUpdatesDesc')} />
          ) : (
            <div className="space-y-4">
              {latest.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest p-5 rounded-lg shadow-[0_12px_48px_rgba(26,28,27,0.06)] flex gap-4 relative"
                >
                  <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-primary"></div>
                  <div
                    className={`w-12 h-12 rounded-full ${accentStyles[item.accent]} flex items-center justify-center flex-shrink-0`}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {iconMap[item.accent]}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-body text-[15px] font-semibold text-on-surface leading-tight">
                      {item.title}
                    </p>
                    <p className="font-body text-xs text-on-surface-variant opacity-70">
                      {item.time}
                    </p>
                    {item.excerpt ? (
                      <div className="mt-2 p-3 bg-surface-container-low rounded-md">
                        <p className="text-sm italic text-on-surface-variant line-clamp-2">
                          {item.excerpt}
                        </p>
                      </div>
                    ) : null}
                    {item.accent === 'gray' ? (
                      <button
                        type="button"
                        className="mt-3 text-xs font-bold text-primary flex items-center gap-1 uppercase tracking-wider"
                      >
                        {t('viewReport')}{' '}
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}

              {older.length > 0 ? (
                <>
                  <div className="py-8 flex flex-col items-center text-center opacity-40">
                    <div className="w-px h-12 bg-outline-variant mb-4"></div>
                    <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                      {t('older')}
                    </p>
                  </div>
                  {older.map((item) => (
                    <div
                      key={item.id}
                      className="bg-surface-container-low/50 p-5 rounded-lg flex gap-4 opacity-90"
                    >
                      <div
                        className={`w-12 h-12 rounded-full ${accentStyles[item.accent] || 'bg-surface-container-high'} flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="material-symbols-outlined text-on-surface-variant">
                          {iconMap[item.accent] || 'campaign'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-body text-[15px] font-medium text-on-surface leading-tight">
                          {item.title}
                        </p>
                        <p className="font-body text-xs text-on-surface-variant opacity-70">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : null}
            </div>
          )}
        </main>

        <div className="px-2 pb-3 pt-2">
          <MerchantAppBottomNav locale={params.locale} />
        </div>

        <div className="absolute -bottom-24 -right-24 w-64 h-64 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full text-primary fill-current" viewBox="0 0 100 100">
            <path d="M50 0 L100 50 L50 100 L0 50 Z M50 10 L90 50 L50 90 L10 50 Z M50 20 L80 50 L50 80 L20 50 Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
