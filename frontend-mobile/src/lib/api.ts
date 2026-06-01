export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
export const API_MEDIA_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return 'http://localhost:5000';
  }
})();

export type Locale = 'en' | 'fr' | 'es' | 'ar';

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
  reply?: {
    id: number;
    review_id: number;
    user_id: number;
    message: string;
    created_at: string;
  } | null;
}

export interface Business {
  id: number;
  user_id: number;
  category_id?: number;
  name: string;
  city?: string;
  address?: string;
  postal_code?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  lat?: number;
  lng?: number;
  description?: string;
  images: string[];
  opening_hours?: unknown;
  status?: string;
  created_at: string;
  updated_at: string;
  region_id?: number;
  category?: Category;
  regionRel?: Region;
  user?: User;
  reviews?: Review[];
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

async function httpJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}

function applyLocalFilters(businesses: Business[], filters: SearchFilters) {
  const q = (filters.q ?? '').trim().toLowerCase();

  return businesses.filter((business) => {
    if (q) {
      const haystack =
        `${business.name ?? ''} ${business.description ?? ''} ${business.city ?? ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (
      filters.categoryId &&
      business.category_id !== filters.categoryId &&
      business.category?.id !== filters.categoryId
    ) {
      return false;
    }

    if (filters.city && business.city?.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }

    if (
      filters.regionId &&
      business.region_id !== filters.regionId &&
      business.regionRel?.id !== filters.regionId
    ) {
      return false;
    }

    return true;
  });
}

export const api = {
  async getBusinesses(): Promise<Business[]> {
    const businesses = await httpJson<Business[]>(`${API_BASE_URL}/businesses`);
    return businesses.map(normalizeBusiness);
  },

  async searchBusinesses(filters: SearchFilters): Promise<Business[]> {
    const q = (filters.q ?? '').trim();

    const remoteBusinesses = q
      ? await httpJson<Business[]>(`${API_BASE_URL}/businesses/search?q=${encodeURIComponent(q)}`)
      : await httpJson<Business[]>(`${API_BASE_URL}/businesses`);

    const filtered = applyLocalFilters(remoteBusinesses.map(normalizeBusiness), filters);
    if (!filters.rating) return filtered;

    const minimum = filters.rating;
    const ratings = await Promise.all(
      filtered.map(async (business) => {
        try {
          const payload = await httpJson<{ average: number; count?: number }>(
            `${API_BASE_URL}/reviews/average/${business.id}`
          );
          return Number(payload.average) || 0;
        } catch {
          return 0;
        }
      })
    );

    return filtered.filter((business, index) => ratings[index] >= minimum);
  },

  async getBusinessById(id: number): Promise<Business> {
    const business = await httpJson<Business>(`${API_BASE_URL}/businesses/${id}`);
    return normalizeBusiness(business);
  },

  async getCategories(): Promise<Category[]> {
    return httpJson<Category[]>(`${API_BASE_URL}/categories`);
  },

  async getRegions(): Promise<Region[]> {
    return httpJson<Region[]>(`${API_BASE_URL}/regions`);
  },

  async getReviewsByBusiness(businessId: number): Promise<Review[]> {
    const reviews = await httpJson<Review[]>(`${API_BASE_URL}/reviews/business/${businessId}`);
    return reviews.map(normalizeReview);
  },

  async getAverageRating(businessId: number): Promise<{ average: number; count: number }> {
    return httpJson<{ average: number; count: number }>(
      `${API_BASE_URL}/reviews/average/${businessId}`
    );
  },
};
