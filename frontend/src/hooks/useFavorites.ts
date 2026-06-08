'use client';

import { useState, useEffect, useCallback } from 'react';
import { favoritesService } from '@/lib/api';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize favorites from localStorage on mount
  useEffect(() => {
    const initial = favoritesService.getLocalFavorites();
    setFavorites(initial);
    setIsLoading(false);

    void favoritesService
      .syncWithAPI()
      .then((synced) => setFavorites(synced))
      .catch(() => {
        setError('Unable to sync favorites');
      });
  }, []);

  const isFavorite = useCallback(
    (businessId: number) => {
      return favorites.includes(businessId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(async (businessId: number) => {
    setError(null);
    try {
      await favoritesService.toggleFavorite(businessId);
      // Update state after toggling
      setFavorites(favoritesService.getLocalFavorites());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle favorite');
    }
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    isLoading,
    error,
  };
}
