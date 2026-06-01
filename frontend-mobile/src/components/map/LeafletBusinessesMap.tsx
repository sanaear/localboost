'use client';

import { useEffect, useId, useMemo, useRef } from 'react';
import type { Business } from '@/lib/api';

type LatLng = { lat: number; lng: number };

const MOROCCO_CENTER: [number, number] = [31.6295, -7.9811];
const MOROCCO_ZOOM = 6;

function getBusinessLatLng(business: Business): LatLng | null {
  if (typeof business.lat === 'number' && typeof business.lng === 'number') {
    return { lat: business.lat, lng: business.lng };
  }

  const city = (business.city ?? '').trim().toLowerCase();
  if (!city) return null;

  const cityCenters: Record<string, LatLng> = {
    fès: { lat: 34.0331, lng: -5.0003 },
    fes: { lat: 34.0331, lng: -5.0003 },
    marrakech: { lat: 31.6295, lng: -7.9811 },
    casablanca: { lat: 33.5731, lng: -7.5898 },
    rabat: { lat: 34.0209, lng: -6.8416 },
    tanger: { lat: 35.7595, lng: -5.834 },
    tangier: { lat: 35.7595, lng: -5.834 },
    agadir: { lat: 30.4278, lng: -9.5981 },
  };

  return cityCenters[city] ?? null;
}

export default function LeafletBusinessesMap({
  businesses,
  locale,
  userLocation,
  radiusKm,
  onBusinessClick,
}: {
  businesses: Business[];
  locale: string;
  userLocation: LatLng | null;
  radiusKm: number | null;
  onBusinessClick: (business: Business) => void;
}) {
  const mapId = useId();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const markerByIdRef = useRef<Map<number, any>>(new Map());
  const userMarkerRef = useRef<any>(null);
  const userRadiusRef = useRef<any>(null);

  const businessesWithCoords = useMemo(
    () =>
      businesses
        .map((business) => ({ business, coords: getBusinessLatLng(business) }))
        .filter((item): item is { business: Business; coords: LatLng } => Boolean(item.coords)),
    [businesses]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mapRef.current) return;

    let mounted = true;

    const init = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet.markercluster');

      if (!mounted) return;
      leafletRef.current = L;

      if (!mapContainerRef.current) return;
      mapContainerRef.current.innerHTML = '';

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        preferCanvas: true,
      }).setView(MOROCCO_CENTER, MOROCCO_ZOOM);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const markerClusterFactory = (L as any).markerClusterGroup ?? (L as any).MarkerClusterGroup;

      if (typeof markerClusterFactory === 'function') {
        const clusterGroup =
          markerClusterFactory === (L as any).MarkerClusterGroup
            ? markerClusterFactory({
                maxClusterRadius: 56,
                animate: true,
                zoomToBoundsOnClick: true,
                chunkedLoading: true,
              })
            : markerClusterFactory({
                maxClusterRadius: 56,
                animate: true,
                zoomToBoundsOnClick: true,
                chunkedLoading: true,
              });

        markersLayerRef.current = clusterGroup;
        map.addLayer(clusterGroup);
      } else {
        const layer = L.layerGroup();
        markersLayerRef.current = layer;
        layer.addTo(map);
      }

      L.control
        .zoom({
          position: 'bottomright',
        })
        .addTo(map);
    };

    void init();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersLayerRef.current = null;
      markerByIdRef.current.clear();
      userMarkerRef.current = null;
      userRadiusRef.current = null;
    };
  }, [mapId]);

  useEffect(() => {
    if (!mapRef.current || !leafletRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    const nextIds = new Set<number>();

    for (const item of businessesWithCoords) {
      nextIds.add(item.business.id);
    }

    for (const [id, marker] of markerByIdRef.current.entries()) {
      if (!nextIds.has(id)) {
        layer.removeLayer(marker);
        markerByIdRef.current.delete(id);
      }
    }

    for (const item of businessesWithCoords) {
      const existing = markerByIdRef.current.get(item.business.id);
      if (existing) continue;

      const marker = leafletRef.current.marker([item.coords.lat, item.coords.lng], {
        icon: leafletRef.current.divIcon({
          className: 'lb-leaflet-marker',
          html: `<div style="width:18px;height:18px;border-radius:999px;background:#b27a00;border:3px solid #ffffff;box-shadow:0 10px 22px rgba(33,24,8,0.22)"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
      });

      const categoryLabel =
        locale === 'ar'
          ? (item.business.category?.name_ar ?? item.business.category?.name_en)
          : locale === 'fr'
            ? (item.business.category?.name_fr ?? item.business.category?.name_en)
            : locale === 'es'
              ? (item.business.category?.name_es ?? item.business.category?.name_en)
              : item.business.category?.name_en;

      const popupHtml = `
        <div style="min-width:180px">
          <div style="font-weight:800;margin-bottom:6px">${item.business.name}</div>
          ${item.business.city ? `<div style="color:#6d6459;font-weight:700;margin-bottom:4px">${item.business.city}</div>` : ''}
          ${categoryLabel ? `<div style="color:#0c9159;font-weight:800;font-size:12px">${categoryLabel}</div>` : ''}
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: false });
      marker.on('click', () => onBusinessClick(item.business));

      layer.addLayer(marker);
      markerByIdRef.current.set(item.business.id, marker);
    }

    if (userLocation) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 12, { animate: true });
      return;
    }

    if (businessesWithCoords.length > 0) {
      const bounds = leafletRef.current.latLngBounds(
        businessesWithCoords.map((item) => [item.coords.lat, item.coords.lng])
      );
      mapRef.current.fitBounds(bounds, { padding: [60, 60] });
      return;
    }

    mapRef.current.setView(MOROCCO_CENTER, MOROCCO_ZOOM, { animate: false });
  }, [businessesWithCoords, locale, onBusinessClick, userLocation]);

  useEffect(() => {
    if (!mapRef.current || !leafletRef.current) return;

    if (userMarkerRef.current) {
      mapRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userRadiusRef.current) {
      mapRef.current.removeLayer(userRadiusRef.current);
      userRadiusRef.current = null;
    }

    if (!userLocation) return;

    userMarkerRef.current = leafletRef.current
      .marker([userLocation.lat, userLocation.lng], {
        icon: leafletRef.current.divIcon({
          className: 'lb-user-marker',
          html: `<div style="width:18px;height:18px;border-radius:999px;background:#006c4c;border:3px solid #ffffff;box-shadow:0 10px 22px rgba(33,24,8,0.22)"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
      })
      .addTo(mapRef.current);

    if (radiusKm) {
      userRadiusRef.current = leafletRef.current
        .circle([userLocation.lat, userLocation.lng], {
          radius: radiusKm * 1000,
          color: '#006c4c',
          fillColor: '#006c4c',
          fillOpacity: 0.08,
          weight: 2,
        })
        .addTo(mapRef.current);
    }
  }, [radiusKm, userLocation]);

  return <div ref={mapContainerRef} id={mapId} className="h-full w-full" />;
}
