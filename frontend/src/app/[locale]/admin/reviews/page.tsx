'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import AdminUserBadge from '@/components/admin/AdminUserBadge';
import ReviewsTable from '@/components/admin/reviews/ReviewsTable';
import ReviewDetailsModal from '@/components/admin/reviews/ReviewDetailsModal';
import { adminFetchJson } from '@/lib/adminApi';

interface ReviewItem {
  id: number;
  business: string;
  businessType: string;
  location: string;
  reviewer: string;
  reviewerAvatar?: string;
  rating: number;
  excerpt: string;
  content?: string;
  created_at?: string;
  moderation_status?: string;
  toxicity: { level: string; score: number; color: string };
  isSelected?: boolean;
}

export default function ReviewsPage() {
  const t = useTranslations('admin.reviews');
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [minScore, setMinScore] = useState<number | null>(null);

  function mapReview(raw: any): ReviewItem {
    const reviewerName = raw.user
      ? `${raw.user.first_name || ''} ${raw.user.last_name || ''}`.trim() ||
        raw.user.email ||
        'Anonymous'
      : raw.reviewer || 'Anonymous';
    const moderationStatus = raw.moderation_status || 'pending';
    const fallbackScore = (raw.content || '').length > 240 ? 0.24 : 0.08;
    const score = Math.min(1, Math.max(0, (raw.toxicity_score as number) ?? fallbackScore));
    return {
      id: raw.id,
      business: raw.business?.name || raw.business_name || '',
      businessType: raw.business?.category?.name_en || raw.business_type || '',
      location: raw.business?.city || raw.location || '',
      reviewer: reviewerName,
      reviewerAvatar: raw.user?.profile_image || undefined,
      rating: raw.rating,
      excerpt: raw.content
        ? raw.content.slice(0, 120) + (raw.content.length > 120 ? '...' : '')
        : '',
      content: raw.content || '',
      created_at: raw.created_at,
      moderation_status: moderationStatus,
      toxicity: {
        level: score > 0.5 ? 'Toxic' : score > 0.2 ? 'Warning' : 'Safe',
        score,
        color: score > 0.5 ? 'bg-error' : score > 0.2 ? 'bg-primary-container' : 'bg-secondary',
      },
      isSelected: false,
    };
  }

  const { data: reviews = [] } = useQuery({
    queryKey: ['admin-reviews', search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      const query = params.toString();
      const raw = await adminFetchJson(`/reviews${query ? `?${query}` : ''}`);
      return Array.isArray(raw) ? raw.map(mapReview) : [];
    },
    retry: false,
  });

  const moderatedReviews = reviews
    .map((review) => ({ ...review, isSelected: selectedIds.has(review.id) }))
    .filter((review) => (minScore === null ? true : review.toxicity.score >= minScore));

  const bulkApproveMutation = useMutation({
    mutationFn: async () => {
      const ids = Array.from(selectedIds);
      if (ids.length === 0) return;
      await Promise.all(
        ids.map((id) =>
          adminFetchJson(`/reviews/${id}/moderate`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'approved' }),
          })
        )
      );
    },
    onSuccess: () => {
      setSelectedIds(new Set());
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
  });

  function toggleScoreFilter() {
    setSelectedReview(null);
    setMinScore((current) => {
      if (current === null) return 0.2;
      if (current === 0.2) return 0.5;
      return null;
    });
  }

  function toggleSelect(id: number) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll(checked: boolean) {
    if (!checked) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(moderatedReviews.map((r) => r.id)));
  }

  const filterLabel =
    minScore === null ? 'Filter by Score' : minScore === 0.2 ? 'Score ≥ 0.20' : 'Score ≥ 0.50';

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F9F9F7] shadow-sm flex justify-between items-center px-6 py-3 w-full">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary w-64 transition-all"
              placeholder={t('searchPlaceholder')}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-600 hover:bg-[#F4F4F2] rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-600 hover:bg-[#F4F4F2] rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <AdminUserBadge showText={false} avatarSize="sm" />
        </div>
      </header>

      <div className="p-8 flex-1">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface">{t('title')}</h2>
            <p className="text-on-surface-variant mt-1">{t('subtitle')}</p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded-full border border-outline-variant text-primary font-semibold hover:bg-surface-container-low transition-colors"
              type="button"
              onClick={toggleScoreFilter}
            >
              {filterLabel}
            </button>
            <button
              className="px-6 py-2 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
              type="button"
              disabled={selectedIds.size === 0 || bulkApproveMutation.isPending}
              onClick={() => bulkApproveMutation.mutate()}
            >
              {bulkApproveMutation.isPending ? 'Approving...' : `Bulk Approve (${selectedIds.size})`}
            </button>
          </div>
        </div>

        <ReviewsTable
          reviews={moderatedReviews}
          onSelect={setSelectedReview}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
        />
      </div>

      {selectedReview && (
        <ReviewDetailsModal review={selectedReview} onClose={() => setSelectedReview(null)} />
      )}
    </>
  );
}
