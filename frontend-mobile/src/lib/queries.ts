import { useQuery } from "@tanstack/react-query";
import { api, type SearchFilters } from "@/lib/api";

export const queryKeys = {
  businesses: (filters: SearchFilters) => ["businesses", "search", filters] as const,
  business: (id: number) => ["businesses", id] as const,
  categories: () => ["categories"] as const,
  regions: () => ["regions"] as const,
  reviews: (businessId: number) => ["reviews", "business", businessId] as const,
  averageRating: (businessId: number) => ["reviews", "average", businessId] as const,
};

export function useBusinessesSearch(filters: SearchFilters) {
  return useQuery({
    queryKey: queryKeys.businesses(filters),
    queryFn: () => api.searchBusinesses(filters),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useBusinessDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.business(id),
    queryFn: () => api.getBusinessById(id),
    enabled: Number.isFinite(id),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => api.getCategories(),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useRegions() {
  return useQuery({
    queryKey: queryKeys.regions(),
    queryFn: () => api.getRegions(),
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useBusinessReviews(businessId: number) {
  return useQuery({
    queryKey: queryKeys.reviews(businessId),
    queryFn: () => api.getReviewsByBusiness(businessId),
    enabled: Number.isFinite(businessId),
  });
}

export function useBusinessAverageRating(businessId: number) {
  return useQuery({
    queryKey: queryKeys.averageRating(businessId),
    queryFn: () => api.getAverageRating(businessId),
    enabled: Number.isFinite(businessId),
  });
}
