const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const FAVORITES_STORAGE_KEY = "localboost_favorites";

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

export type Locale = "en" | "fr" | "es" | "ar";

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
    // Mock data for testing
    const mockBusinesses: Business[] = [
      {
        id: 1,
        user_id: 1,
        name: "Café des Épices",
        city: "Fès",
        lat: 34.035,
        lng: -5.004,
        description: "A charming café in the heart of Fès",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDrlvOazFFrXLpGPOTtSQFdX0G4-KqytyTFtA0Rj8a2xQj-zN0L7pzA8eJLccN9DwNI3L3jsXZhv9IN8q8GRsD1-Vb0y6ytD45EDwrROmLcdYnEvWarS76vf_YAOypQ3MlnLbYm3sYX1up8xOZ5rAxvNxHBwhhZKbGhZQWnHFnhhjrrXitXI1fQCZIgg7qvAG3Z92IgrlY0cMHOXxQY1IIuHDVTKNa2CdQNOW0COwfDTqRKZiRwfnq6BLYe-fUsGOsOBaVfdQp6kn0"],
        status: "approved",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        category: {
          id: 1,
          name_en: "Café & Restaurant",
          name_fr: "Café & Restaurant",
          name_ar: "مقهى ومطعم",
          name_es: "Café y Restaurante",
          icon: "local_cafe"
        }
      },
      {
        id: 2,
        user_id: 2,
        name: "Dar Hatim",
        city: "Marrakech",
        lat: 31.629,
        lng: -7.981,
        description: "A traditional Moroccan riad",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDrlvOazFFrXLpGPOTtSQFdX0G4-KqytyTFtA0Rj8a2xQj-zN0L7pzA8eJLccN9DwNI3L3jsXZhv9IN8q8GRsD1-Vb0y6ytD45EDwrROmLcdYnEvWarS76vf_YAOypQ3MlnLbYm3sYX1up8xOZ5rAxvNxHBwhhZKbGhZQWnHFnhhjrrXitXI1fQCZIgg7qvAG3Z92IgrlY0cMHOXxQY1IIuHDVTKNa2CdQNOW0COwfDTqRKZiRwfnq6BLYe-fUsGOsOBaVfdQp6kn0"],
        status: "approved",
        created_at: "2024-01-02T00:00:00Z",
        updated_at: "2024-01-02T00:00:00Z",
        category: {
          id: 2,
          name_en: "Hotel & Riad",
          name_fr: "Hôtel & Riad",
          name_ar: "فندق ورياض",
          name_es: "Hotel y Riad",
          icon: "local_hotel"
        }
      },
      {
        id: 3,
        user_id: 3,
        name: "Souk el Had",
        city: "Agadir",
        lat: 30.426,
        lng: -9.593,
        description: "Traditional market in Agadir",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDrlvOazFFrXLpGPOTtSQFdX0G4-KqytyTFtA0Rj8a2xQj-zN0L7pzA8eJLccN9DwNI3L3jsXZhv9IN8q8GRsD1-Vb0y6ytD45EDwrROmLcdYnEvWarS76vf_YAOypQ3MlnLbYm3sYX1up8xOZ5rAxvNxHBwhhZKbGhZQWnHFnhhjrrXitXI1fQCZIgg7qvAG3Z92IgrlY0cMHOXxQY1IIuHDVTKNa2CdQNOW0COwfDTqRKZiRwfnq6BLYe-fUsGOsOBaVfdQp6kn0"],
        status: "approved",
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-03T00:00:00Z",
        category: {
          id: 3,
          name_en: "Market & Shopping",
          name_fr: "Marché et Shopping",
          name_ar: "سوق وتسوق",
          name_es: "Mercado y Compras",
          icon: "shopping_cart"
        }
      },
      {
        id: 4,
        user_id: 4,
        name: "Rick's Café",
        city: "Casablanca",
        lat: 33.573,
        lng: -7.589,
        description: "Iconic café inspired by the film",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDrlvOazFFrXLpGPOTtSQFdX0G4-KqytyTFtA0Rj8a2xQj-zN0L7pzA8eJLccN9DwNI3L3jsXZhv9IN8q8GRsD1-Vb0y6ytD45EDwrROmLcdYnEvWarS76vf_YAOypQ3MlnLbYm3sYX1up8xOZ5rAxvNxHBwhhZKbGhZQWnHFnhhjrrXitXI1fQCZIgg7qvAG3Z92IgrlY0cMHOXxQY1IIuHDVTKNa2CdQNOW0COwfDTqRKZiRwfnq6BLYe-fUsGOsOBaVfdQp6kn0"],
        status: "approved",
        created_at: "2024-01-04T00:00:00Z",
        updated_at: "2024-01-04T00:00:00Z",
        category: {
          id: 1,
          name_en: "Café & Restaurant",
          name_fr: "Café & Restaurant",
          name_ar: "مقهى ومطعم",
          name_es: "Café y Restaurante",
          icon: "local_cafe"
        }
      },
      {
        id: 5,
        user_id: 5,
        name: "Jardin Majorelle",
        city: "Marrakech",
        lat: 31.632,
        lng: -8.007,
        description: "A beautiful garden in Marrakech",
        images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDrlvOazFFrXLpGPOTtSQFdX0G4-KqytyTFtA0Rj8a2xQj-zN0L7pzA8eJLccN9DwNI3L3jsXZhv9IN8q8GRsD1-Vb0y6ytD45EDwrROmLcdYnEvWarS76vf_YAOypQ3MlnLbYm3sYX1up8xOZ5rAxvNxHBwhhZKbGhZQWnHFnhhjrrXitXI1fQCZIgg7qvAG3Z92IgrlY0cMHOXxQY1IIuHDVTKNa2CdQNOW0COwfDTqRKZiRwfnq6BLYe-fUsGOsOBaVfdQp6kn0"],
        status: "approved",
        created_at: "2024-01-05T00:00:00Z",
        updated_at: "2024-01-05T00:00:00Z",
        category: {
          id: 4,
          name_en: "Garden & Park",
          name_fr: "Jardin et Parc",
          name_ar: "حديقة",
          name_es: "Jardín y Parque",
          icon: "park"
        }
      }
    ];
    return mockBusinesses;
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

// Favorites Service with localStorage + API sync
export interface Favorite {
  id?: number;
  user_id?: number;
  business_id: number;
  created_at?: string;
}

export const favoritesService = {
  // Get favorites from localStorage
  getLocalFavorites(): number[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Save favorites to localStorage
  saveLocalFavorites(favorites: number[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  },

  // Check if a business is favorited
  isFavorite(businessId: number): boolean {
    return this.getLocalFavorites().includes(businessId);
  },

  // Toggle favorite (add/remove)
  async toggleFavorite(businessId: number): Promise<void> {
    const current = this.getLocalFavorites();
    let updated: number[];

    if (current.includes(businessId)) {
      updated = current.filter(id => id !== businessId);
      // TODO: Call API to remove favorite
      // await fetch(`${API_BASE_URL}/favorites/${businessId}`, { method: "DELETE" });
    } else {
      updated = [...current, businessId];
      // TODO: Call API to add favorite
      // await fetch(`${API_BASE_URL}/favorites`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ business_id: businessId })
      // });
    }

    this.saveLocalFavorites(updated);
  },

  // Sync with API (TODO: implement when API is ready)
  async syncWithAPI(): Promise<void> {
    // Placeholder for API sync
  }
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
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return true;
      } catch {
        return false;
      }
    }
  },

  // Generate share URL
  getShareURL(businessId: number, locale: Locale = "en"): string {
    const baseURL = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    return `${baseURL}/${locale}/businesses/${businessId}`;
  },

  // WhatsApp share URL
  getWhatsAppURL(text: string, url: string): string {
    return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
  }
};
