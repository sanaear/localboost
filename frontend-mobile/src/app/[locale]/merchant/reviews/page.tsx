'use client';

import Link from 'next/link';
import { use, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import MerchantAppBottomNav from '@/components/MerchantAppBottomNav';
import { ErrorState, SkeletonLine } from '@/components/UiState';
import { API_BASE_URL, resolveMediaUrl } from '@/lib/api';
import { getMerchantIdentity, fetchMerchantReviews } from '@/lib/merchant';

const filters = ['all', 'replied', 'pendingReply', 'flagged'] as const;

type MerchantReviewItem = {
  id: number;
  name: string;
  avatar?: string;
  flag?: string;
  date: string;
  rating: number;
  status: 'REPLIED' | 'PENDING REPLY' | 'FLAGGED';
  statusTone: 'green' | 'amber' | 'gray' | 'red';
  text: string;
  replyMessage?: string | null;
  replyDate?: string | null;
};

const accentStyles: Record<string, string> = {
  green: 'bg-secondary-container text-on-secondary-container',
  amber: 'bg-tertiary-container text-on-tertiary-container',
  gray: 'bg-surface-container-high text-outline',
  red: 'bg-error-container text-on-error-container',
};

function statusLabel(status: string, t: (_key: string) => string): string {
  if (status === 'REPLIED') return t('replied');
  if (status === 'FLAGGED') return t('flagged');
  return t('pendingReply');
}

function formatAverageResponseTime(hours: number | null) {
  if (hours === null) return '--';
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m`;
  if (hours < 24) return `${hours.toFixed(hours < 10 ? 1 : 0)}h`;
  return `${Math.round(hours / 24)}d`;
}

export default function MerchantReviewsPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('merchantReviews');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [replyState, setReplyState] = useState<Record<string, string>>({});

  const identity = useMemo(() => getMerchantIdentity(), []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['merchant-reviews', identity?.token],
    queryFn: async () => {
      if (!identity?.token) throw new Error('No token');
      return fetchMerchantReviews();
    },
    enabled: !!identity?.token,
  });

  const items: MerchantReviewItem[] = useMemo(() => {
    if (!data) return [];
    return data
      .slice()
      .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))
      .map((review) => {
        const name =
          [review.user?.first_name, review.user?.last_name].filter(Boolean).join(' ') ||
          tCommon('anonymous');
        const isReplied = Boolean(review.reply?.message);
        return {
          id: review.id,
          name,
          avatar: resolveMediaUrl(review.user?.profile_image),
          flag: undefined,
          date: new Date(review.created_at).toLocaleDateString(),
          rating: review.rating,
          status: isReplied ? 'REPLIED' : 'PENDING REPLY',
          statusTone: isReplied ? 'gray' : 'amber',
          text: review.content ? `"${review.content}"` : '',
          replyMessage: review.reply?.message ?? null,
          replyDate: review.reply?.created_at
            ? new Date(review.reply.created_at).toLocaleDateString()
            : null,
        } satisfies MerchantReviewItem;
      });
  }, [data, tCommon]);

  const average = useMemo(() => {
    if (!data || data.length === 0) return { average: 0, count: 0 };
    const sum = data.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return { average: sum / data.length, count: data.length };
  }, [data]);

  const averageResponseLabel = useMemo(() => {
    if (!data) return '--';
    const responseTimes = data
      .filter((review) => review.reply?.created_at && review.created_at)
      .map((review) => {
        const createdAt = new Date(review.created_at).getTime();
        const repliedAt = new Date(review.reply!.created_at).getTime();
        return repliedAt > createdAt ? (repliedAt - createdAt) / 36e5 : null;
      })
      .filter((value): value is number => typeof value === 'number');
    if (responseTimes.length === 0) return formatAverageResponseTime(null);
    const averageHours =
      responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length;
    return formatAverageResponseTime(averageHours);
  }, [data]);

  const visibleReviews = useMemo(() => {
    if (selectedFilter === 'replied') return items.filter((r) => r.status === 'REPLIED');
    if (selectedFilter === 'pendingReply') return items.filter((r) => r.status === 'PENDING REPLY');
    if (selectedFilter === 'flagged') return items.filter((r) => r.status === 'FLAGGED');
    return items;
  }, [items, selectedFilter]);

  const replyMutation = useMutation({
    mutationFn: async ({ reviewId, message }: { reviewId: number; message: string }) => {
      if (!identity?.token) throw new Error('No token');
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${identity.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error('Request failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-reviews'] });
    },
  });

  async function handleSendReply(reviewId: number) {
    const draft = (drafts[String(reviewId)] ?? '').trim();
    if (!draft) return;
    setDrafts((current) => ({ ...current, [String(reviewId)]: '' }));
    replyMutation.mutate(
      { reviewId, message: draft },
      {
        onSuccess: () =>
          setReplyState((current) => ({ ...current, [String(reviewId)]: 'Reply sent' })),
        onError: () =>
          setReplyState((current) => ({
            ...current,
            [String(reviewId)]: tCommon('errorDescription'),
          })),
      }
    );
  }

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#f9f9f7]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-fixed overflow-hidden">
                  <span className="material-symbols-outlined text-[16px] text-primary">person</span>
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
                  title={tCommon('errorTitle')}
                  description={tCommon('errorDescription')}
                  onRetry={() => refetch()}
                  retryLabel={tCommon('retry')}
                />
              </div>
            ) : null}

            <div
              className="mobile-fade-up mt-4 relative overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-[0_12px_48px_rgba(26,28,27,0.04)]"
              style={{ animationDelay: '60ms' }}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-container/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="font-label text-xs uppercase tracking-[0.15em] text-outline mb-2">
                  {t('averageRating')}
                </span>
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-headline font-extrabold text-primary leading-none">
                    {isLoading ? '—' : average.average.toFixed(1)}
                  </span>
                  <span
                    className="material-symbols-outlined text-primary-container text-4xl mb-1"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
                <p className="mt-3 text-sm text-on-surface-variant font-medium">
                  {t('basedOn', { count: average.count })}
                </p>
                <div className="w-full mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-low rounded-lg p-3 text-left">
                    <span className="block text-[10px] uppercase font-bold text-outline tracking-wider">
                      {t('responseRate')}
                    </span>
                    <span className="text-lg font-headline font-bold text-secondary">
                      {isLoading
                        ? '—'
                        : items.length === 0
                          ? '—'
                          : `${Math.round((items.filter((r) => r.status === 'REPLIED').length / items.length) * 100)}%`}
                    </span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 text-left">
                    <span className="block text-[10px] uppercase font-bold text-outline tracking-wider">
                      {t('avgTime')}
                    </span>
                    <span className="text-lg font-headline font-bold text-tertiary">
                      {isLoading ? '--' : averageResponseLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
              {filters.map((filter) => {
                const active = selectedFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedFilter(filter)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm ${
                      active
                        ? 'bg-primary text-on-primary shadow-md'
                        : 'bg-surface-container-high text-on-surface-variant font-semibold'
                    }`}
                  >
                    {t(filter)}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-6 pb-2">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-surface-container-lowest rounded-lg p-5 shadow-[0_8px_24px_rgba(26,28,27,0.03)]"
                  >
                    <SkeletonLine className="h-4 w-[45%]" />
                    <SkeletonLine className="mt-3 h-4 w-[85%]" />
                    <SkeletonLine className="mt-2 h-4 w-[70%]" />
                  </div>
                ))
              ) : visibleReviews.length === 0 ? (
                <div className="text-center py-10 text-on-surface-variant">
                  No reviews match this filter.
                </div>
              ) : (
                visibleReviews.map((review) => {
                  const draft = drafts[review.id] ?? '';
                  const replied = review.status === 'REPLIED';

                  return (
                    <div
                      key={review.id}
                      className={`bg-surface-container-lowest rounded-lg p-5 shadow-[0_8px_24px_rgba(26,28,27,0.03)] ${replied ? 'opacity-80' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3">
                          <div className="relative">
                            {review.avatar ? (
                              <img
                                src={resolveMediaUrl(review.avatar)}
                                alt={review.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                                <span className="material-symbols-outlined text-on-surface-variant">
                                  person
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-headline font-bold text-on-surface">
                              {review.name}
                            </h3>
                            <span className="font-label text-[10px] text-outline uppercase tracking-wider">
                              {review.date}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex text-primary-container">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className="material-symbols-outlined text-[18px]"
                                style={
                                  i < review.rating ? { fontVariationSettings: "'FILL' 1" } : {}
                                }
                              >
                                star
                              </span>
                            ))}
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${accentStyles[review.statusTone]}`}
                          >
                            {statusLabel(review.status, t)}
                          </span>
                        </div>
                      </div>

                      <p className="text-on-surface-variant text-sm leading-relaxed mb-5 italic">
                        {review.text}
                      </p>

                      {replied && review.replyMessage ? (
                        <div className="bg-surface-container-lowest rounded-lg p-4 border-l-4 border-primary mt-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                              {t('youReplied')}
                            </span>
                            <span className="text-[9px] text-outline">{review.replyDate}</span>
                          </div>
                          <p className="text-xs text-on-surface-variant">{review.replyMessage}</p>
                        </div>
                      ) : (
                        <div className="mt-4 pt-4 border-t border-surface-container-high">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                              {t('publicReply')}
                            </span>
                            <button
                              type="button"
                              className="text-outline hover:text-error transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">flag</span>
                            </button>
                          </div>
                          <textarea
                            className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary min-h-[80px] placeholder:text-outline-variant resize-none"
                            placeholder={t('replyPlaceholder', { name: review.name })}
                            value={draft}
                            onChange={(event) =>
                              setDrafts((current) => ({
                                ...current,
                                [review.id]: event.target.value,
                              }))
                            }
                          />
                          <div className="flex justify-end mt-3">
                            <button
                              type="button"
                              onClick={() => void handleSendReply(review.id)}
                              disabled={!draft.trim()}
                              className="px-6 py-2 bg-primary text-on-primary rounded-full font-bold text-xs shadow-sm active:scale-95 transition-transform disabled:opacity-50"
                            >
                              {t('sendReply')}
                            </button>
                          </div>
                          {replyState[review.id] ? (
                            <p className="mt-3 text-right text-[12px] font-semibold text-secondary">
                              {replyState[review.id]}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
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
