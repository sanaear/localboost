'use client';

import Link from 'next/link';
import { use, useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import MerchantAppBottomNav from '@/components/MerchantAppBottomNav';
import { ErrorState, SkeletonLine } from '@/components/UiState';
import { API_BASE_URL, normalizeBusiness, resolveMediaUrl, type Business } from '@/lib/api';
import { fetchMyBusinesses, getMerchantIdentity } from '@/lib/merchant';

async function updateBusinessImages(token: string, businessId: number, images: string[]) {
  const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/images`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ images }),
  });
  if (!response.ok) throw new Error('Request failed');
  return normalizeBusiness((await response.json()) as Business);
}

async function addBusinessImages(token: string, businessId: number, images: string[]) {
  const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ images }),
  });
  if (!response.ok) throw new Error('Request failed');
  return normalizeBusiness((await response.json()) as Business);
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function MerchantPhotoManagerPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('merchantPhotoManager');
  const identity = useMemo(() => getMerchantIdentity(), []);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    data: business,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['merchant-photos', identity?.token],
    queryFn: async () => {
      if (!identity?.token) throw new Error('No token');
      const businesses = await fetchMyBusinesses();
      return businesses[0] ?? null;
    },
    enabled: !!identity?.token,
  });

  const shots = useMemo(() => {
    if (!business?.images) return [];
    return (business.images as string[]).map((image, index) => ({
      id: `${index}-${image}`,
      label: `Photo ${index + 1}`,
      image: resolveMediaUrl(image) ?? image,
    }));
  }, [business?.images]);

  const updateMutation = useMutation({
    mutationFn: (images: string[]) => {
      if (!identity?.token || !business) throw new Error('Not authenticated');
      return updateBusinessImages(identity.token, business.id, images);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-photos'] });
    },
  });

  const addMutation = useMutation({
    mutationFn: (images: string[]) => {
      if (!identity?.token || !business) throw new Error('Not authenticated');
      return addBusinessImages(identity.token, business.id, images);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-photos'] });
    },
  });

  async function handleDelete(shotId: string) {
    const remaining = shots.filter((s) => s.id !== shotId);
    updateMutation.mutate(remaining.map((s) => s.image));
  }

  async function handleAddFiles(files: FileList | null) {
    if (!files || files.length === 0 || !identity?.token || !business) return;
    const incoming = Array.from(files).slice(0, 6);
    const dataUrls = await Promise.all(incoming.map((file) => readFileAsDataUrl(file)));
    addMutation.mutate(dataUrls);
  }

  async function handleMakeMain(shotId: string) {
    const currentIndex = shots.findIndex((s) => s.id === shotId);
    if (currentIndex > 0) {
      const reordered = [...shots];
      const [active] = reordered.splice(currentIndex, 1);
      reordered.unshift(active);
      updateMutation.mutate(reordered.map((s) => s.image));
    }
  }

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#f9f9f7]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-[16px] text-on-primary-container">
                    store
                  </span>
                </div>
                <h1 className="text-[1.4rem] font-extrabold tracking-[-0.05em] text-primary">
                  LocalBoost
                </h1>
              </div>
              <Link href={`/${params.locale}/merchant/updates`} className="text-primary-container">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
              </Link>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            {isError ? (
              <div className="mt-6">
                <ErrorState
                  title="Something went wrong"
                  description="Check your connection and try again."
                  onRetry={() => refetch()}
                  retryLabel="Retry"
                />
              </div>
            ) : null}

            <div className="mobile-fade-up mt-4" style={{ animationDelay: '60ms' }}>
              <h2 className="text-[1.75rem] font-bold font-headline text-on-surface leading-tight mb-2">
                {t('title')}
              </h2>
              <p className="text-on-surface-variant text-sm">{t('subtitle')}</p>
            </div>

            {isLoading ? (
              <div className="mt-6 overflow-hidden rounded-[28px] border border-surface-container-high bg-surface-container-low px-4 py-5">
                <SkeletonLine className="h-4 w-[55%]" />
                <SkeletonLine className="mt-3 h-4 w-[80%]" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {shots.slice(0, 1).map((shot) => (
                    <div
                      key={shot.id}
                      className="col-span-3 relative group overflow-hidden rounded-lg aspect-[16/10] bg-surface-container-low shadow-sm"
                    >
                      <img
                        src={resolveMediaUrl(shot.image)}
                        alt={shot.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                        <span
                          className="material-symbols-outlined !text-[14px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        {t('mainPhoto')}
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(shot.id)}
                          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-error hover:scale-110 transition-transform"
                        >
                          <span className="material-symbols-outlined !text-[18px]">close</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleMakeMain(shot.id)}
                        className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white"
                      >
                        <span className="material-symbols-outlined">drag_indicator</span>
                      </button>
                    </div>
                  ))}

                  {shots.slice(1).map((shot) => (
                    <div
                      key={shot.id}
                      className="relative group aspect-square rounded-lg overflow-hidden bg-surface-container-low"
                    >
                      <img
                        src={resolveMediaUrl(shot.image)}
                        alt={shot.label}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleDelete(shot.id)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-error hover:scale-110 transition-transform"
                      >
                        <span className="material-symbols-outlined !text-[14px]">close</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMakeMain(shot.id)}
                        className="absolute bottom-2 left-2 text-white/80"
                      >
                        <span className="material-symbols-outlined !text-[16px]">drag_handle</span>
                      </button>
                    </div>
                  ))}

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="col-span-3 mt-2 h-32 rounded-lg bg-surface-container-lowest flex flex-col items-center justify-center group cursor-pointer hover:bg-primary/5 transition-colors"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23847562FF' stroke-width='2' stroke-dasharray='8%2c8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => void handleAddFiles(event.target.files)}
                    />
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">add_a_photo</span>
                    </div>
                    <span className="text-sm font-semibold text-primary font-headline">
                      {t('addPhotos')}
                    </span>
                    <span className="text-[10px] text-outline mt-1 font-label uppercase tracking-widest">
                      {t('maxFileSize')}
                    </span>
                  </div>
                </div>

                <div className="mt-10 flex items-center justify-center gap-2 py-4 bg-secondary-container/20 rounded-xl">
                  <span
                    className="material-symbols-outlined text-secondary !text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <p className="text-[11px] font-medium text-white bg-secondary p-1 rounded px-2 font-label">
                    {t('photoOptimized')}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="px-2 pb-3 pt-2">
            <MerchantAppBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
