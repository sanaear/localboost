"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import { Business, Locale } from "@/lib/api";
import { useParams } from "next/navigation";

// Helper to calculate distance in km between two points
export function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface BusinessMapProps {
  businesses: Business[];
  selectedBusinessId?: number;
  onBusinessSelect?: (business: Business) => void;
}

export default function BusinessMap({ businesses, selectedBusinessId, onBusinessSelect }: BusinessMapProps) {
  const params = useParams<{ locale: Locale }>();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchRadius, setSearchRadius] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const MOROCCO_CENTER: [number, number] = [31.6295, -7.9811];
  const MOROCCO_ZOOM = 6;

  // Get unique categories
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Map(
        businesses
          .filter((b) => b.category)
          .map((b) => [
            b.category?.id,
            {
              id: b.category?.id!,
              name:
                b.category?.[`name_${params.locale}`] ||
                b.category?.name_en ||
                "Unknown",
            },
          ])
      ).values()
    );
    setCategories(uniqueCategories as any);
  }, [businesses, params.locale]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView(MOROCCO_CENTER, MOROCCO_ZOOM);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    markerClusterGroupRef.current = L.markerClusterGroup({
      maxClusterRadius: 50,
      animate: true,
      zoomToBoundsOnClick: true,
    });
    mapInstanceRef.current.addLayer(markerClusterGroupRef.current);

    return () => {
      mapInstanceRef.current?.remove();
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!markerClusterGroupRef.current || !mapInstanceRef.current) return;
    markerClusterGroupRef.current.clearLayers();

    let filteredBusinesses = businesses.filter((b) => b.lat && b.lng);

    if (selectedCategory) {
      filteredBusinesses = filteredBusinesses.filter(
        (b) => b.category?.id === selectedCategory
      );
    }

    if (selectedCity) {
      filteredBusinesses = filteredBusinesses.filter(
        (b) => b.city?.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    if (userLocation) {
      filteredBusinesses = filteredBusinesses.filter((b) => {
        const distance = haversine(
          userLocation.lat,
          userLocation.lng,
          b.lat!,
          b.lng!
        );
        return distance <= searchRadius;
      });
    }

    filteredBusinesses.forEach((business) => {
      const marker = L.marker([business.lat!, business.lng!]);
      const popupContent = `
        <div style="min-width:200px">
          <h3 style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;margin-bottom:8px">${business.name}</h3>
          ${business.city ? `<p style="color:#524534;margin-bottom:4px">${business.city}</p>` : ""}
          ${business.description ? `<p style="color:#524534">${business.description}</p>` : ""}
        </div>
      `;
      marker.bindPopup(popupContent);
      marker.on("click", () => onBusinessSelect?.(business));
      markerClusterGroupRef.current?.addLayer(marker);
    });

    if (filteredBusinesses.length > 0) {
      const bounds = L.latLngBounds(
        filteredBusinesses.map((b) => [b.lat!, b.lng!])
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [
    businesses,
    selectedCategory,
    selectedCity,
    userLocation,
    searchRadius,
    onBusinessSelect,
  ]);

  const handleLocateMe = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);

        if (mapInstanceRef.current) {
          if (userMarkerRef.current) {
            mapInstanceRef.current.removeLayer(userMarkerRef.current);
          }
          userMarkerRef.current = L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: "custom-user-marker",
              html: `<div style="background-color:#006c4c;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
          }).addTo(mapInstanceRef.current);
          mapInstanceRef.current.setView([latitude, longitude], 12);
        }
      },
      (error) => {
        setIsLocating(false);
        setLocationError(error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const cities = Array.from(
    new Set(businesses.filter((b) => b.city).map((b) => b.city!))
  );

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex flex-wrap gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className="flex items-center gap-2 px-4 py-2 maghrib-gradient text-white rounded-full font-medium hover:opacity-90 transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined">
            {isLocating ? "hourglass_top" : "my_location"}
          </span>
          {isLocating ? "Locating..." : "Locate Me"}
        </button>

        {userLocation && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-on-surface-variant">Search radius:</span>
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(parseInt(e.target.value))}
              className="px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30"
            >
              <option value={1}>1 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
            </select>
            <button
              onClick={() => {
                setUserLocation(null);
                if (userMarkerRef.current && mapInstanceRef.current) {
                  mapInstanceRef.current.removeLayer(userMarkerRef.current);
                  mapInstanceRef.current.setView(MOROCCO_CENTER, MOROCCO_ZOOM);
                }
              }}
              className="text-sm text-primary hover:underline"
            >
              Clear location
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <span className="text-sm text-on-surface-variant">Category:</span>
          <select
            value={selectedCategory || ""}
            onChange={(e) =>
              setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)
            }
            className="px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-on-surface-variant">City:</span>
          <select
            value={selectedCity || ""}
            onChange={(e) => setSelectedCity(e.target.value || null)}
            className="px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {locationError && (
        <div className="p-3 bg-error-container text-error rounded-xl text-sm">
          {locationError}
        </div>
      )}

      <div
        ref={mapRef}
        className="flex-1 min-h-[400px] rounded-xl border border-outline-variant/20 shadow-sm"
        style={{ minHeight: "500px" }}
      />
    </div>
  );
}
