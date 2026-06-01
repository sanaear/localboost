'use client';

import { useQuery } from '@tanstack/react-query';
import { api, sharingService, Locale, resolveMediaUrl } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';

export default function BusinessDetailPage() {
  const params = useParams<{ locale: Locale; id: string }>();
  const businessId = Number(params.id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    data: business,
    isLoading: businessLoading,
    error: businessError,
  } = useQuery({
    queryKey: ['business', businessId],
    queryFn: async () => {
      try {
        return await api.getBusinessById(businessId);
      } catch (err) {
        return null;
      }
    },
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', businessId],
    queryFn: async () => {
      try {
        return await api.getReviewsByBusiness(businessId);
      } catch (err) {
        return [];
      }
    },
    enabled: !!businessId,
  });

  const { data: ratingData, isLoading: ratingLoading } = useQuery({
    queryKey: ['averageRating', businessId],
    queryFn: async () => {
      try {
        return await api.getAverageRating(businessId);
      } catch (err) {
        return { average: 0, count: 0 };
      }
    },
    enabled: !!businessId,
  });

  if (businessError || (!businessLoading && !business)) {
    notFound();
  }

  if (businessLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-lg">Loading business details...</p>
      </div>
    );
  }

  if (!business) {
    notFound();
  }

  const getCategoryName = () => {
    if (!business.category) return '';
    switch (params.locale) {
      case 'ar':
        return business.category.name_ar;
      case 'fr':
        return business.category.name_fr;
      case 'es':
        return business.category.name_es;
      default:
        return business.category.name_en;
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  };

  const handleShare = async (type: 'url' | 'whatsapp' | 'copy') => {
    if (!business) return;
    const url = sharingService.getShareURL(business.id, params.locale);
    const text = `Check out ${business.name} on LocalBoost!`;

    switch (type) {
      case 'copy':
        const success = await sharingService.copyToClipboard(url);
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        break;
      case 'whatsapp':
        window.open(sharingService.getWhatsAppURL(text, url), '_blank');
        break;
      case 'url':
        window.open(url, '_blank');
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/${params.locale}/businesses`}
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to businesses
      </Link>

      <div className="mb-8 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
            {getCategoryName() && <p className="text-lg text-gray-600 mb-2">{getCategoryName()}</p>}
            {business.city && <p className="text-gray-700 mb-4">{business.city}</p>}
            {!ratingLoading && ratingData && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{renderStars(ratingData.average)}</span>
                <span className="text-gray-600">({ratingData.count} reviews)</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(business.id)}
              className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <span
                className={`material-symbols-outlined text-3xl ${isFavorite(business.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
              >
                {isFavorite(business.id) ? 'favorite' : 'favorite_border'}
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined text-3xl text-gray-600">share</span>
              </button>

              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 w-48 z-50">
                  <button
                    onClick={() => handleShare('url')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">link</span>
                    Open Link
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">content_copy</span>
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-md flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">whatsapp</span>
                    Share on WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {business.images.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {business.images.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <img
                  src={resolveMediaUrl(image)}
                  alt={`${business.name} - Image ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {business.description && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-700">{business.description}</p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {reviewsLoading ? (
          <p>Loading reviews...</p>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{renderStars(review.rating)}</span>
                  <span className="font-medium">
                    {review.user?.first_name} {review.user?.last_name}
                  </span>
                </div>
                {review.content && <p className="text-gray-700">{review.content}</p>}
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
