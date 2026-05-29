const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type Locale = "en" | "fr" | "es" | "ar";

const mockUsers: User[] = [
  {
    id: 1,
    role: "merchant",
    email: "merchant1@localboost.test",
    first_name: "Amina",
    last_name: "El Idrissi",
    phone: "+212 5 35 00 00 00",
    address: "Medina, Fès",
  },
  {
    id: 2,
    role: "merchant",
    email: "merchant2@localboost.test",
    first_name: "Youssef",
    last_name: "Bennani",
    phone: "+212 5 24 00 00 00",
    address: "Gueliz, Marrakech",
  },
  {
    id: 3,
    role: "merchant",
    email: "merchant3@localboost.test",
    first_name: "Salma",
    last_name: "Alaoui",
    phone: "+212 5 22 00 00 00",
    address: "Maarif, Casablanca",
  },
];

const mockCategories: Category[] = [
  { id: 1, name_en: "Café & Restaurant", name_fr: "Café & Restaurant", name_ar: "مقهى ومطعم", name_es: "Café y Restaurante", icon: "local_cafe" },
  { id: 2, name_en: "Museum", name_fr: "Musée", name_ar: "متحف", name_es: "Museo", icon: "museum" },
  { id: 3, name_en: "Artisan Workshop", name_fr: "Atelier d'artisanat", name_ar: "ورشة حرفية", name_es: "Taller artesanal", icon: "handyman" },
  { id: 4, name_en: "Hotel & Riad", name_fr: "Hôtel & Riad", name_ar: "فندق ورياض", name_es: "Hotel y Riad", icon: "hotel" },
];

const mockRegions: Region[] = [
  { id: 1, name: "Fès-Meknès" },
  { id: 2, name: "Marrakech-Safi" },
  { id: 3, name: "Casablanca-Settat" },
];

const now = new Date().toISOString();

const mockBusinesses: Business[] = [
  {
    id: 1,
    user_id: 1,
    category_id: 3,
    region_id: 1,
    name: "L'Art de la Poterie",
    city: "Fès",
    lat: 34.0331,
    lng: -5.0003,
    description: "Atelier traditionnel de poterie au cœur de la médina, démonstrations et pièces uniques.",
    images: [
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Moroccan%20artisan%20pottery%20workshop%20interior%2C%20warm%20sunlight%2C%20handcrafted%20ceramics%2C%20premium%20travel%20editorial%20photography%2C%20high%20detail&image_size=portrait_16_9",
    ],
    status: "approved",
    created_at: now,
    updated_at: now,
    category: mockCategories[2],
    regionRel: mockRegions[0],
    user: mockUsers[0],
  },
  {
    id: 2,
    user_id: 2,
    category_id: 1,
    region_id: 2,
    name: "Café des Épices",
    city: "Marrakech",
    lat: 31.6295,
    lng: -7.9811,
    description: "Café chaleureux avec une vue sur les ruelles, pâtisseries maison et thé à la menthe.",
    images: [
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Moroccan%20cafe%20terrace%2C%20mint%20tea%2C%20warm%20golden%20hour%20light%2C%20travel%20editorial%20photography%2C%20high%20detail&image_size=portrait_16_9",
    ],
    status: "approved",
    created_at: now,
    updated_at: now,
    category: mockCategories[0],
    regionRel: mockRegions[1],
    user: mockUsers[1],
  },
  {
    id: 3,
    user_id: 3,
    category_id: 2,
    region_id: 1,
    name: "Musée Zellij",
    city: "Fès",
    lat: 34.0348,
    lng: -5.0014,
    description: "Collection immersive sur l'art du zellij, visites guidées et boutique artisanale.",
    images: [
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Moroccan%20museum%20interior%20zellij%20tiles%2C%20soft%20museum%20lighting%2C%20premium%20travel%20editorial%20photography%2C%20high%20detail&image_size=portrait_16_9",
    ],
    status: "approved",
    created_at: now,
    updated_at: now,
    category: mockCategories[1],
    regionRel: mockRegions[0],
    user: mockUsers[2],
  },
  {
    id: 4,
    user_id: 2,
    category_id: 4,
    region_id: 2,
    name: "Dar Hatim Riad",
    city: "Marrakech",
    lat: 31.6333,
    lng: -7.9896,
    description: "Riad traditionnel avec patio, petit-déjeuner marocain et accueil personnalisé.",
    images: [
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Moroccan%20riad%20courtyard%2C%20fountain%2C%20plants%2C%20warm%20light%2C%20premium%20travel%20editorial%20photography%2C%20high%20detail&image_size=portrait_16_9",
    ],
    status: "approved",
    created_at: now,
    updated_at: now,
    category: mockCategories[3],
    regionRel: mockRegions[1],
    user: mockUsers[1],
  },
];

const mockReviews: Review[] = [
  {
    id: 1,
    user_id: 99,
    business_id: 1,
    rating: 5,
    content: "Expérience incroyable, on apprend beaucoup et les pièces sont magnifiques.",
    created_at: now,
    updated_at: now,
    user: { id: 99, role: "tourist", email: "tourist1@localboost.test", first_name: "Nadia", last_name: "K.", preferred_lang: "fr" },
  },
  {
    id: 2,
    user_id: 98,
    business_id: 1,
    rating: 4,
    content: "Très beau lieu, personnel accueillant. Un peu fréquenté l'après-midi.",
    created_at: now,
    updated_at: now,
    user: { id: 98, role: "tourist", email: "tourist2@localboost.test", first_name: "Omar", last_name: "S.", preferred_lang: "en" },
  },
  {
    id: 3,
    user_id: 97,
    business_id: 2,
    rating: 5,
    content: "Le meilleur thé à la menthe de Marrakech.",
    created_at: now,
    updated_at: now,
    user: { id: 97, role: "tourist", email: "tourist3@localboost.test", first_name: "Sara", last_name: "M.", preferred_lang: "fr" },
  },
];

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
}

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

export interface SearchFilters {
  q?: string;
  categoryId?: number;
  city?: string;
  regionId?: number;
  rating?: number;
  available?: boolean;
}

async function httpJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}

async function safeHttpJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T | undefined> {
  try {
    return await httpJson<T>(input, init);
  } catch {
    return undefined;
  }
}

function applyFilters(businesses: Business[], filters: SearchFilters) {
  const q = (filters.q ?? "").trim().toLowerCase();

  return businesses.filter((business) => {
    if (q) {
      const haystack = `${business.name ?? ""} ${business.description ?? ""} ${business.city ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (filters.categoryId && business.category_id !== filters.categoryId && business.category?.id !== filters.categoryId) {
      return false;
    }

    if (filters.city && business.city?.toLowerCase() !== filters.city.toLowerCase()) {
      return false;
    }

    if (filters.regionId && business.region_id !== filters.regionId && business.regionRel?.id !== filters.regionId) {
      return false;
    }

    if (filters.rating) {
      const reviews = mockReviews.filter((review) => review.business_id === business.id);
      if (reviews.length === 0) return false;
      const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      if (average < filters.rating) return false;
    }

    return true;
  });
}

export const api = {
  async getBusinesses(): Promise<Business[]> {
    const remote = await safeHttpJson<Business[]>(`${API_BASE_URL}/businesses`);
    return remote && remote.length > 0 ? remote : mockBusinesses;
  },

  async searchBusinesses(filters: SearchFilters): Promise<Business[]> {
    const q = (filters.q ?? "").trim();

    const remoteBusinesses = q
      ? await safeHttpJson<Business[]>(`${API_BASE_URL}/businesses/search?q=${encodeURIComponent(q)}`)
      : await safeHttpJson<Business[]>(`${API_BASE_URL}/businesses`);

    const businesses = remoteBusinesses && remoteBusinesses.length > 0 ? remoteBusinesses : mockBusinesses;
    return applyFilters(businesses, filters);
  },

  async getBusinessById(id: number): Promise<Business> {
    const remote = await safeHttpJson<Business>(`${API_BASE_URL}/businesses/${id}`);
    if (remote) return remote;

    const business = mockBusinesses.find((b) => b.id === id);
    if (!business) throw new Error("Business not found");
    const reviews = mockReviews.filter((review) => review.business_id === id);
    return { ...business, reviews };
  },

  async getCategories(): Promise<Category[]> {
    const remote = await safeHttpJson<Category[]>(`${API_BASE_URL}/categories`);
    return remote && remote.length > 0 ? remote : mockCategories;
  },

  async getRegions(): Promise<Region[]> {
    const remote = await safeHttpJson<Region[]>(`${API_BASE_URL}/regions`);
    return remote && remote.length > 0 ? remote : mockRegions;
  },

  async getReviewsByBusiness(businessId: number): Promise<Review[]> {
    const remote = await safeHttpJson<Review[]>(`${API_BASE_URL}/reviews/business/${businessId}`);
    return remote && remote.length > 0 ? remote : mockReviews.filter((review) => review.business_id === businessId);
  },

  async getAverageRating(businessId: number): Promise<{ average: number; count: number }> {
    const remote = await safeHttpJson<{ average: number; count: number }>(`${API_BASE_URL}/reviews/average/${businessId}`);
    if (remote) return remote;

    const reviews = mockReviews.filter((review) => review.business_id === businessId);
    if (reviews.length === 0) return { average: 0, count: 0 };
    const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    return { average, count: reviews.length };
  },
};
