"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, Business, SearchFilters } from "@/lib/api";
import SearchFiltersComponent from "@/components/SearchFilters";
import BusinessCard from "@/components/BusinessCard";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

// Dynamically import BusinessMap with no SSR
const BusinessMap = dynamic(() => import("@/components/BusinessMap"), { ssr: false });

export default function BusinessesPage() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list" | "both">("both");
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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
          Discover Local Businesses
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex bg-surface-container-low rounded-full p-1 border border-outline-variant/20">
            <button
              onClick={() => setViewMode("both")}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                viewMode === "both" ? "bg-primary text-white" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Both
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                viewMode === "map" ? "bg-primary text-white" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                viewMode === "list" ? "bg-primary text-white" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* List Panel */}
        {(viewMode === "both" || viewMode === "list") && (
          <div className="w-full md:w-1/2 lg:w-1/3 overflow-y-auto p-6 border-r border-outline-variant/10">
            <SearchFiltersComponent onSearch={handleSearch} />

            {isLoading && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-4">progress_activity</span>
                <p className="text-lg text-on-surface-variant">Loading businesses...</p>
              </div>
            )}

            {error && (
              <div className="bg-error-container text-error rounded-xl p-6 mb-8">
                <p>Error loading businesses. Please try again later.</p>
              </div>
            )}

            {!isLoading && !error && (!filteredBusinesses || filteredBusinesses.length === 0) && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">search_off</span>
                <p className="text-lg text-on-surface-variant">No businesses found matching your criteria.</p>
              </div>
            )}

            {!isLoading && !error && filteredBusinesses && filteredBusinesses.length > 0 && (
              <div className="space-y-4 mt-4">
                {filteredBusinesses.map((business) => (
                  <div
                    key={business.id}
                    onClick={() => setSelectedBusiness(business)}
                    className={`cursor-pointer transition-all ${
                      selectedBusiness?.id === business.id ? "ring-2 ring-primary rounded-xl" : ""
                    }`}
                  >
                    <BusinessCard business={business} locale={params.locale} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map Panel */}
        {(viewMode === "both" || viewMode === "map") && (
          <div className="flex-1">
            <BusinessMap
              businesses={filteredBusinesses || []}
              selectedBusinessId={selectedBusiness?.id}
              onBusinessSelect={setSelectedBusiness}
            />
          </div>
        )}
      </div>
    </div>
  );
}
