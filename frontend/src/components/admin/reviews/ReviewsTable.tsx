'use client';

import { resolveMediaUrl } from '@/lib/api';

interface Review {
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
  toxicity: {
    level: string;
    score: number;
    color: string;
  };
  isSelected?: boolean;
}

interface ReviewsTableProps {
  reviews: Review[];
  onSelect: (_review: Review) => void;
  onToggleSelect: (_id: number) => void;
  onToggleSelectAll: (_checked: boolean) => void;
}

const toxicityStyles: Record<string, { text: string; bar: string }> = {
  Safe: { text: 'text-secondary', bar: 'bg-secondary' },
  Warning: { text: 'text-on-primary-container', bar: 'bg-primary-container' },
  Toxic: { text: 'text-error', bar: 'bg-error' },
};

export default function ReviewsTable({
  reviews,
  onSelect,
  onToggleSelect,
  onToggleSelectAll,
}: ReviewsTableProps) {
  const allSelected = reviews.length > 0 && reviews.every((r) => r.isSelected);
  const someSelected = reviews.some((r) => r.isSelected);

  return (
    <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low text-on-surface-variant text-sm font-label uppercase tracking-wider">
            <th className="p-4 w-12">
              <input
                className="rounded border-outline-variant text-primary focus:ring-primary"
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = !allSelected && someSelected;
                }}
                onChange={(e) => onToggleSelectAll(e.target.checked)}
              />
            </th>
            <th className="p-4 font-semibold">Business</th>
            <th className="p-4 font-semibold">Reviewer</th>
            <th className="p-4 font-semibold">Rating</th>
            <th className="p-4 font-semibold w-1/3">Excerpt</th>
            <th className="p-4 font-semibold">AI Toxicity</th>
            <th className="p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container-high">
          {reviews.map((review) => {
            const reviewerAvatarSrc = resolveMediaUrl(review.reviewerAvatar);
            const tox = toxicityStyles[review.toxicity.level] || {
              text: 'text-on-surface-variant',
              bar: 'bg-surface',
            };
            return (
              <tr
                key={review.id}
                className={`hover:bg-surface-container-low/50 transition-colors cursor-pointer ${review.isSelected ? 'bg-primary-fixed/5' : ''}`}
                onClick={() => onSelect(review)}
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    checked={Boolean(review.isSelected)}
                    className="rounded border-outline-variant text-primary focus:ring-primary"
                    type="checkbox"
                    onChange={() => onToggleSelect(review.id)}
                  />
                </td>
                <td className="p-4">
                  <span className="font-bold text-on-surface">{review.business}</span>
                  <p className="text-xs text-on-surface-variant">
                    {review.businessType} • {review.location}
                  </p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-full ${
                        review.reviewer === 'Anonymous'
                          ? 'bg-error-container'
                          : 'bg-secondary-container'
                      } flex-shrink-0 overflow-hidden`}
                    >
                      {reviewerAvatarSrc && (
                        <img
                          alt={review.reviewer}
                          className="w-full h-full object-cover rounded-full"
                          src={reviewerAvatarSrc}
                        />
                      )}
                    </div>
                    <span className="font-medium">{review.reviewer}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-sm"
                        style={{
                          fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-sm text-on-surface-variant">{review.excerpt}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className={`h-full ${tox.bar}`}
                        style={{ width: `${review.toxicity.score * 100}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-tighter ${tox.text}`}
                    >
                      {review.toxicity.level} ({review.toxicity.score.toFixed(2)})
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <button
                    className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(review);
                    }}
                  >
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="p-4 bg-surface-container-low flex justify-between items-center text-sm text-on-surface-variant">
        <span>
          Showing {reviews.length} of {reviews.length} reviews
        </span>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-surface-container-high rounded transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="p-1 hover:bg-surface-container-high rounded transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
