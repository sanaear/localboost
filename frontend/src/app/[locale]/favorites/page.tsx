'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useFavorites } from '@/hooks/useFavorites';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import BusinessCard from '@/components/BusinessCard';

export default function FavoritesPage() {
  const params = useParams<{ locale: string }>();
  const { favorites } = useFavorites();

  const {
    data: businesses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const all = await api.getBusinesses();
      return all.filter((b) => favorites.includes(b.id));
    },
    enabled: favorites.length > 0,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/${params.locale}/businesses`}
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to businesses
        </Link>
        <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
        <p className="text-gray-600">
          {favorites.length} {favorites.length === 1 ? 'business' : 'businesses'} saved
        </p>
      </div>

      {isLoading ? (
        <p className="text-lg">Loading favorites...</p>
      ) : error ? (
        <p className="text-red-600">Failed to load favorites</p>
      ) : businesses && businesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} locale={params.locale} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
            favorite_border
          </span>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-4">Start exploring businesses and save your favorites!</p>
          <Link
            href={`/${params.locale}/businesses`}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Businesses
          </Link>
        </div>
      )}
    </div>
  );
}
