const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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

export const api = {
  async getBusinesses(): Promise<Business[]> {
    const response = await fetch(`${API_BASE_URL}/businesses`);
    if (!response.ok) throw new Error("Failed to fetch businesses");
    return response.json();
  },

  async searchBusinesses(query: string): Promise<Business[]> {
    const response = await fetch(`${API_BASE_URL}/businesses/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Failed to search businesses");
    return response.json();
  },

  async getBusinessById(id: number): Promise<Business> {
    const response = await fetch(`${API_BASE_URL}/businesses/${id}`);
    if (!response.ok) throw new Error("Failed to fetch business");
    return response.json();
  },

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  },

  async getRegions(): Promise<Region[]> {
    const response = await fetch(`${API_BASE_URL}/regions`);
    if (!response.ok) throw new Error("Failed to fetch regions");
    return response.json();
  },

  async getReviewsByBusiness(businessId: number): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/reviews/business/${businessId}`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    return response.json();
  },

  async getAverageRating(businessId: number): Promise<{ average: number; count: number }> {
    const response = await fetch(`${API_BASE_URL}/reviews/average/${businessId}`);
    if (!response.ok) throw new Error("Failed to fetch average rating");
    return response.json();
  },
};
