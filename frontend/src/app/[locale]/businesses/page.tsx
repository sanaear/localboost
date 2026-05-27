"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, Business, SearchFilters } from "@/lib/api";
import SearchFiltersComponent from "@/components/SearchFilters";
import BusinessCard from "@/components/BusinessCard";
import { useParams } from "next/navigation";

export default function BusinessesPage() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const params = useParams<{ locale: string }>();

  const { data: businesses, isLoading, error } = useQuery({
    queryKey: ["businesses", filters],
    queryFn: async () => {
      try {
        if (filters.q) {
          return api.searchBusinesses(filters.q);
        }
        return api.getBusinesses();
      } catch (err) {
        return [];
      }
    },
  });

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const filteredBusinesses = businesses?.filter((business) => {
    if (filters.city && !business.city?.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Local Businesses</h1>
      
      <SearchFiltersComponent onSearch={handleSearch} />

      {isLoading && (
        <div className="text-center py-12">
          <p className="text-lg">Loading businesses...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-700">Error loading businesses. Please try again later.</p>
        </div>
      )}

      {!isLoading && !error && (!filteredBusinesses || filteredBusinesses.length === 0) && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No businesses found matching your criteria.</p>
        </div>
      )}

      {!isLoading && !error && filteredBusinesses && filteredBusinesses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              locale={params.locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
