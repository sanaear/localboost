export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
export const API_MEDIA_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return 'http://localhost:5000';
  }
})();
const FAVORITES_STORAGE_KEY = 'localboost_favorites';

export interface Business {
  id: number;
  user_id: number;
  category_id?: number;
  name: string;
  city?: string;
  lat?: number;
  lng?: number;
  description?: string;
  images: string[];
  status?: string;
  created_at: string;
  updated_at: string;
  region_id?: number;
  category?: Category;
  regionRel?: Region;
  user?: User;
  reviews?: Review[];
}

export type Locale = 'en' | 'fr' | 'es' | 'ar';

export interface Category {
  id: number;
  name_ar?: string;
  name_fr?: string;
  name_en?: string;
  name_es?: string;
  icon?: string;
}

export interface Region {
  id: number;
  name: string;
}

export interface User {
  id: number;
  role: string;
  preferred_lang?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  address?: string;
  profile_image?: string;
}

export interface Review {
  id: number;
  user_id: number;
  business_id: number;
  rating: number;
  content?: string;
  moderation_status?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface SearchFilters {
  q?: string;
  categoryId?: number;
  city?: string;
  regionId?: number;
  rating?: number;
  available?: boolean;
}

export function resolveMediaUrl(value?: string | null): string | undefined {
  const src = typeof value === 'string' ? value.trim() : '';
  if (!src) return undefined;
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith('/uploads/')) return `${API_MEDIA_ORIGIN}${src}`;
  return src;
}

export function normalizeUser(user: User): User {
  return {
    ...user,
    profile_image: resolveMediaUrl(user.profile_image) ?? user.profile_image,
  };
}

export function normalizeReview(review: Review): Review {
  return {
    ...review,
    user: review.user ? normalizeUser(review.user) : review.user,
  };
}

export function normalizeBusiness(business: Business): Business {
  return {
    ...business,
    images: (business.images ?? [])
      .map((image) => resolveMediaUrl(image))
      .filter((image): image is string => Boolean(image)),
    user: business.user ? normalizeUser(business.user) : business.user,
    reviews: business.reviews?.map(normalizeReview),
  };
}

export const api = {
  async getBusinesses(): Promise<Business[]> {
    const response = await fetch(`${API_BASE_URL}/businesses`);
    if (!response.ok) throw new Error('Failed to fetch businesses');
    const businesses = (await response.json()) as Business[];
    return businesses.map(normalizeBusiness);
  },

  async searchBusinesses(query: string): Promise<Business[]> {
    const response = await fetch(
      `${API_BASE_URL}/businesses/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error('Failed to search businesses');
    const businesses = (await response.json()) as Business[];
    return businesses.map(normalizeBusiness);
  },

  async getBusinessById(id: number): Promise<Business> {
    const response = await fetch(`${API_BASE_URL}/businesses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch business');
    const business = (await response.json()) as Business;
    return normalizeBusiness(business);
  },

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async getRegions(): Promise<Region[]> {
    const response = await fetch(`${API_BASE_URL}/regions`);
    if (!response.ok) throw new Error('Failed to fetch regions');
    return response.json();
  },

  async getReviewsByBusiness(businessId: number): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/reviews/business/${businessId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    const reviews = (await response.json()) as Review[];
    return reviews.map(normalizeReview);
  },

  async getAverageRating(businessId: number): Promise<{ average: number; count: number }> {
    const response = await fetch(`${API_BASE_URL}/reviews/average/${businessId}`);
    if (!response.ok) throw new Error('Failed to fetch average rating');
    return response.json();
  },
};

// Favorites Service with localStorage + API sync
export interface Favorite {
  id?: number;
  user_id?: number;
  business_id: number;
  created_at?: string;
}

export const favoritesService = {
  getStoredAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    const candidates = [
      'lb:authToken',
      'lb:token',
      'lb_token',
      'authToken',
      'token',
      'accessToken',
    ];
    for (const key of candidates) {
      const value = window.localStorage.getItem(key);
      if (value?.trim()) return value.trim();
    }
    return null;
  },

  // Get favorites from localStorage
  getLocalFavorites(): number[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Save favorites to localStorage
  saveLocalFavorites(favorites: number[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  },

  // Check if a business is favorited
  isFavorite(businessId: number): boolean {
    return this.getLocalFavorites().includes(businessId);
  },

  // Toggle favorite (add/remove)
  async toggleFavorite(businessId: number): Promise<void> {
    const current = this.getLocalFavorites();
    const token = this.getStoredAuthToken();
    let updated: number[];

    if (current.includes(businessId)) {
      updated = current.filter((id) => id !== businessId);
      if (token) {
        await fetch(`${API_BASE_URL}/favorites/${businessId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } else {
      updated = [...current, businessId];
      if (token) {
        await fetch(`${API_BASE_URL}/favorites`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ business_id: businessId, businessId }),
        });
      }
    }

    this.saveLocalFavorites(updated);
  },

  async syncWithAPI(): Promise<number[]> {
    const token = this.getStoredAuthToken();
    const local = this.getLocalFavorites();
    if (!token) return local;

    const response = await fetch(`${API_BASE_URL}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return local;

    const remote = (await response.json()) as unknown;
    const remoteIds = Array.isArray(remote)
      ? remote.map((value) => Number(value)).filter((id) => Number.isFinite(id) && id > 0)
      : [];
    const merged = Array.from(new Set([...local, ...remoteIds])).sort((a, b) => a - b);
    this.saveLocalFavorites(merged);

    await fetch(`${API_BASE_URL}/favorites`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favorites: merged }),
    });

    return merged;
  },
};

// Sharing Service
export const sharingService = {
  // Copy to clipboard
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch {
        return false;
      }
    }
  },

  // Generate share URL
  getShareURL(businessId: number, locale: Locale = 'en'): string {
    const baseURL =
      typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return `${baseURL}/${locale}/businesses/${businessId}`;
  },

  // WhatsApp share URL
  getWhatsAppURL(text: string, url: string): string {
    return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
  },
};
