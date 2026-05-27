"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BusinessDetailPage() {
  const params = useParams<{ locale: string; id: string }>();
  const businessId = Number(params.id);

  const { data: business, isLoading: businessLoading, error: businessError } = useQuery({
    queryKey: ["business", businessId],
    queryFn: async () => {
      try {
        return await api.getBusinessById(businessId);
      } catch (err) {
        return null;
      }
    },
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", businessId],
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
    queryKey: ["averageRating", businessId],
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
    if (!business.category) return "";
    switch (params.locale) {
      case "ar":
        return business.category.name_ar;
      case "fr":
        return business.category.name_fr;
      case "es":
        return business.category.name_es;
      default:
        return business.category.name_en;
    }
  };

  const renderStars = (rating: number) => {
    return "⭐".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={`/${params.locale}/businesses`} className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to businesses
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
        {getCategoryName() && (
          <p className="text-lg text-gray-600 mb-2">{getCategoryName()}</p>
        )}
        {business.city && (
          <p className="text-gray-700 mb-4">{business.city}</p>
        )}
        {!ratingLoading && ratingData && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{renderStars(ratingData.average)}</span>
            <span className="text-gray-600">({ratingData.count} reviews)</span>
          </div>
        )}
      </div>

      {business.images.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {business.images.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <img
                  src={image}
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
                {review.content && (
                  <p className="text-gray-700">{review.content}</p>
                )}
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
