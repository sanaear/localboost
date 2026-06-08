'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminFetchJson } from '@/lib/adminApi';

interface Review {
  id: number;
  business: string;
  businessType?: string;
  location?: string;
  reviewer: string;
  rating: number;
  excerpt: string;
  toxicity: { level: string; score: number };
  content?: string;
  created_at?: string;
  moderation_status?: string;
}

interface ReviewDetailsModalProps {
  review: Review;
  onClose: () => void;
}

export default function ReviewDetailsModal({ review, onClose }: ReviewDetailsModalProps) {
  const queryClient = useQueryClient();
  const [rejectReason, setRejectReason] = useState('');

  const moderateMutation = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: 'approved' | 'rejected' }) => {
      return adminFetchJson(`/reviews/${id}/moderate`, {
        method: 'PUT',
        body: JSON.stringify({ status: action, reason: rejectReason }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      onClose();
    },
  });

  const status = review.moderation_status || 'pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1C1B]/60 backdrop-blur-sm">
      <div className="bg-surface rounded-lg shadow-2xl max-w-2xl w-full max-h-[921px] overflow-hidden flex flex-col border border-outline-variant/20">
        <div className="p-6 border-b border-surface-container-high flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg overflow-hidden border-2 border-primary-container shadow-md bg-primary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">rate_review</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Review by {review.reviewer}</h3>
              <p className="text-on-surface-variant text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">calendar_today</span>
                {review.created_at
                  ? `Posted on ${new Date(review.created_at).toLocaleDateString()}`
                  : 'Date unknown'}{' '}
                • {review.business}
              </p>
            </div>
          </div>
          <button
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 space-y-8">
          <section className="space-y-4">
            <label className="font-label font-bold text-xs uppercase tracking-widest text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-base">translate</span>
              Review Content
            </label>
            <p className="text-lg italic font-body text-on-surface-variant leading-relaxed">
              &quot;{review.content || review.excerpt}&quot;
            </p>
          </section>

          <section className="bg-surface-container-low rounded-lg p-6 grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">
                Rating
              </label>
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">
                Toxicity Level
              </label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">verified_user</span>
                <span
                  className={`text-lg font-bold ${review.toxicity.score > 0.5 ? 'text-error' : 'text-secondary'}`}
                >
                  {review.toxicity.level} ({review.toxicity.score.toFixed(2)})
                </span>
              </div>
            </div>
          </section>

          <div className="flex justify-center">
            <span
              className={`px-4 py-1 rounded-full text-sm font-bold border ${
                status === 'approved'
                  ? 'bg-secondary-container text-on-secondary-container border-secondary/20'
                  : status === 'rejected'
                    ? 'bg-error-container text-on-error-container border-error/20'
                    : 'bg-primary-fixed text-on-primary-fixed border-primary/20'
              }`}
            >
              {status === 'approved'
                ? 'Approved'
                : status === 'rejected'
                  ? 'Rejected'
                  : 'Pending Moderation'}
            </span>
          </div>

          {status === 'pending' && (
            <section className="space-y-2">
              <label className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">
                Rejection reason
              </label>
              <textarea
                className="w-full min-h-24 rounded-lg border border-outline-variant/30 bg-surface-container-low p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Optional note for the moderation log"
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
              />
            </section>
          )}
        </div>

        <div className="p-6 bg-surface-container-low flex justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {status === 'pending' && (
              <>
                <button
                  className="px-6 py-2.5 bg-error text-on-error font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                  onClick={() => moderateMutation.mutate({ id: review.id, action: 'rejected' })}
                  disabled={moderateMutation.isPending}
                >
                  <span className="material-symbols-outlined text-sm">block</span>
                  {moderateMutation.isPending ? '...' : 'Reject'}
                </button>
                <button
                  className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                  onClick={() => moderateMutation.mutate({ id: review.id, action: 'approved' })}
                  disabled={moderateMutation.isPending}
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {moderateMutation.isPending ? '...' : 'Approve'}
                </button>
              </>
            )}
            {status !== 'pending' && (
              <span className="text-sm text-on-surface-variant">
                This review has already been {status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
