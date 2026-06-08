'use client';

import Link from 'next/link';
import { use, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import MerchantAppBottomNav from '@/components/MerchantAppBottomNav';
import { ErrorState, SkeletonLine } from '@/components/UiState';
import {
  fetchFavoriteCountForBusiness,
  fetchMerchantAnalyticsSummary,
  fetchMerchantReviews,
  fetchMe,
  fetchMyBusinesses,
  getMerchantIdentity,
} from '@/lib/merchant';

export default function MerchantDashboardPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('merchantDashboard');
  const tCommon = useTranslations('common');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [stats, setStats] = useState<
    Array<{ labelKey: string; value: number; icon: string; badge?: string }>
  >([]);
  const [recentReviews, setRecentReviews] = useState<
    Array<{ id: number; rating: number; text: string; age: string }>
  >([]);

  const identity = useMemo(() => getMerchantIdentity(), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);

    void (async () => {
      if (!identity?.token) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      try {
        const [me, businesses, analytics] = await Promise.all([
          fetchMe(),
          fetchMyBusinesses(),
          fetchMerchantAnalyticsSummary(7),
        ]);
        if (cancelled) return;

        const name =
          [me?.first_name, me?.last_name].filter(Boolean).join(' ') ||
          (me?.email ? me.email.split('@')[0] : '');
        setDisplayName(name || '—');

        const favoriteCounts = await Promise.all(
          businesses.map(async (business) => {
            try {
              return await fetchFavoriteCountForBusiness(business.id);
            } catch {
              return 0;
            }
          })
        );
        if (cancelled) return;

        const totalSaves = favoriteCounts.reduce((sum, value) => sum + value, 0);

        const reviews = await fetchMerchantReviews();

        if (cancelled) return;

        const sorted = reviews
          .slice()
          .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''));
        setRecentReviews(
          sorted.slice(0, 3).map((review) => ({
            id: review.id,
            rating: review.rating,
            text: review.content ?? '',
            age: formatRelativeTime(review.created_at),
          }))
        );

        setStats([
          { labelKey: 'viewsThisWeek', value: analytics.totalViews, icon: 'visibility' },
          { labelKey: 'profileClicks', value: analytics.totalClicks, icon: 'touch_app' },
          { labelKey: 'totalReviews', value: reviews.length, icon: 'grade' },
          { labelKey: 'savedByTourists', value: totalSaves, icon: 'favorite' },
        ]);

        setIsLoading(false);
      } catch {
        if (cancelled) return;
        setHasError(true);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [identity]);

  function formatRelativeTime(dateStr: string) {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  function StarRating({ rating }: { rating: number }) {
    return (
      <div className="flex gap-0.5 text-[#eba020]">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="material-symbols-outlined text-[18px]"
            style={star <= rating ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            star
          </span>
        ))}
      </div>
    );
  }

  const statsCards = isLoading
    ? ([
        { labelKey: 'viewsThisWeek', value: 0, icon: 'visibility' },
        { labelKey: 'profileClicks', value: 0, icon: 'touch_app' },
        { labelKey: 'totalReviews', value: 0, icon: 'grade' },
        { labelKey: 'savedByTourists', value: 0, icon: 'favorite' },
      ] as Array<{ labelKey: string; value: number; icon: string }>)
    : stats;

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col bg-[#f9f9f7]">
          <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#f9f9f7]/80 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eba020] flex items-center justify-center overflow-hidden border-2 border-[#eba020]/20">
                <span className="material-symbols-outlined text-white text-xl">storefront</span>
              </div>
              <span className="text-xl font-extrabold text-[#825500] font-headline tracking-tight">
                {tCommon('brand')}
              </span>
            </div>
            <Link
              href={`/${params.locale}/merchant/updates`}
              className="relative p-2 hover:opacity-80 transition-opacity scale-95 active:scale-90 text-[#eba020]"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ac3400] rounded-full border-2 border-[#f9f9f7]" />
            </Link>
          </header>

          <div className="pt-20 px-6 pb-5 mobile-scrollbar-hidden flex-1 overflow-y-auto space-y-6">
            {hasError ? (
              <ErrorState
                title={tCommon('errorTitle')}
                description={tCommon('errorDescription')}
                onRetry={() => window.location.reload()}
                retryLabel={tCommon('retry')}
              />
            ) : (
              <>
                <section>
                  <h1 className="text-3xl font-bold font-headline text-[#1a1c1b] tracking-tight">
                    {t('goodMorning')}{' '}
                    {isLoading ? (
                      <SkeletonLine className="inline-block h-8 w-[100px] align-middle" />
                    ) : (
                      displayName.split(' ')[0]
                    )}
                  </h1>
                  <p className="text-[#524534] font-body mt-1">{t('attentionToday')}</p>
                </section>

                <div className="bg-[#8af4c5]/30 p-4 rounded-lg flex items-center gap-3">
                  <div className="bg-[#006c4c] text-[#ffffff] w-6 h-6 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                  <span className="font-medium text-[#007150] font-body">{t('approvedLive')}</span>
                </div>

                <section className="grid grid-cols-2 gap-4">
                  {statsCards.map((stat) => (
                    <div
                      key={stat.labelKey}
                      className="bg-[#ffffff] p-5 rounded-lg shadow-[0_12px_48px_rgba(26,28,27,0.06)] flex flex-col justify-between min-h-[120px]"
                    >
                      <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-[#825500]">
                          {stat.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold font-headline mt-2 text-[#1a1c1b]">
                          {isLoading ? <SkeletonLine className="h-8 w-[70px]" /> : stat.value}
                        </h3>
                        <p className="text-[11px] font-label uppercase tracking-wider text-[#524534]">
                          {isLoading ? (
                            <SkeletonLine className="h-3 w-[90px] mt-1" />
                          ) : (
                            t(`stats.${stat.labelKey}` as any)
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </section>

                <section>
                  <h2 className="text-lg font-bold font-headline mb-4 px-1 text-[#1a1c1b]">
                    {t('quickActions')}
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    <Link
                      href={`/${params.locale}/merchant/edit-profile`}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#d7c3ae]/30 hover:bg-[#f4f4f2] transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#ffb952]/20 flex items-center justify-center text-[#825500]">
                          <span className="material-symbols-outlined">edit</span>
                        </div>
                        <span className="font-semibold font-body text-[#1a1c1b]">
                          {t('editProfile')}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[#847562]">
                        chevron_right
                      </span>
                    </Link>
                    <Link
                      href={`/${params.locale}/merchant/generate-ai`}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#d7c3ae]/30 hover:bg-[#f4f4f2] transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#ffb952]/20 flex items-center justify-center text-[#825500]">
                          <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                        <span className="font-semibold font-body text-[#1a1c1b]">
                          {t('generateAiDescription')}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[#847562]">
                        chevron_right
                      </span>
                    </Link>
                    <Link
                      href={`/${params.locale}/merchant/reviews`}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#d7c3ae]/30 hover:bg-[#f4f4f2] transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#ffb952]/20 flex items-center justify-center text-[#825500]">
                          <span className="material-symbols-outlined">rate_review</span>
                        </div>
                        <span className="font-semibold font-body text-[#1a1c1b]">
                          {t('viewReviews')}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[#847562]">
                        chevron_right
                      </span>
                    </Link>
                  </div>
                </section>

                <section className="space-y-4 pb-4">
                  <div className="flex justify-between items-center px-1">
                    <h2 className="text-lg font-bold font-headline text-[#1a1c1b]">
                      {t('recentReviews')}
                    </h2>
                    <Link
                      href={`/${params.locale}/merchant/reviews`}
                      className="text-sm font-bold text-[#825500]"
                    >
                      {t('viewAll')}
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {isLoading ? (
                      Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="bg-[#f4f4f2] p-5 rounded-lg">
                          <SkeletonLine className="h-4 w-[30%]" />
                          <SkeletonLine className="mt-3 h-4 w-[90%]" />
                          <SkeletonLine className="mt-2 h-4 w-[75%]" />
                        </div>
                      ))
                    ) : recentReviews.length === 0 ? (
                      <div className="bg-[#f4f4f2] p-5 rounded-lg text-sm font-semibold text-[#524534]">
                        {t('noReviews')}
                      </div>
                    ) : (
                      recentReviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-[#f4f4f2] p-5 rounded-lg border-l-4 border-[#825500]"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <StarRating rating={review.rating} />
                            <span className="text-xs text-[#524534]">{review.age}</span>
                          </div>
                          <p className="text-sm text-[#1a1c1b] leading-relaxed mb-4 italic">
                            {review.text ? `"${review.text}"` : ''}
                          </p>
                          <Link
                            href={`/${params.locale}/merchant/reviews`}
                            className="bg-[#825500] text-[#ffffff] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all inline-block"
                          >
                            {t('reply')}
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </>
            )}
          </div>

          <div className="px-2 pb-3 pt-2">
            <MerchantAppBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
