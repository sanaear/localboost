"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import MerchantAppBottomNav from "@/components/MerchantAppBottomNav";
import { ErrorState, SkeletonLine } from "@/components/UiState";
import { API_BASE_URL, type Business } from "@/lib/api";
import { fetchMyBusinesses, getMerchantIdentity } from "@/lib/merchant";

export default function MerchantPhotoManagerPage({
  params,
}: {
  params: { locale: string };
}) {
  const identity = useMemo(() => getMerchantIdentity(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [shots, setShots] = useState<Array<{ id: string; label: string; image: string }>>([]);
  const [selectedId, setSelectedId] = useState("");
  const [optimized, setOptimized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedPhoto = useMemo(
    () =>
      shots.find((shot) => shot.id === selectedId) ??
      shots[0],
    [selectedId, shots],
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    setBusiness(null);
    setShots([]);
    setSelectedId("");

    void (async () => {
      if (!identity?.token) {
        setHasError(true);
        setIsLoading(false);
        return;
      }
      try {
        const businesses = await fetchMyBusinesses();
        const first = businesses[0] ?? null;
        if (cancelled) return;
        setBusiness(first);
        const mapped = (first?.images ?? []).map((image, index) => ({
          id: `${index}-${image}`,
          label: `Photo ${index + 1}`,
          image,
        }));
        setShots(mapped);
        setSelectedId(mapped[0]?.id ?? "");
        setIsLoading(false);
      } catch {
        if (cancelled) return;
        setHasError(true);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [identity]);

  async function updateImages(nextImages: string[]) {
    if (!identity?.token || !business) return;
    const response = await fetch(`${API_BASE_URL}/businesses/${business.id}/images`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${identity.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images: nextImages }),
    });
    if (!response.ok) throw new Error("Request failed");
    const updated = (await response.json()) as Business;
    setBusiness(updated);
    const mapped = (updated.images ?? []).map((image, index) => ({
      id: `${index}-${image}`,
      label: `Photo ${index + 1}`,
      image,
    }));
    setShots(mapped);
    setSelectedId(mapped[0]?.id ?? "");
  }

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  async function handleAddFiles(files: FileList | null) {
    if (!files || files.length === 0 || !identity?.token || !business) return;
    const incoming = Array.from(files).slice(0, 6);
    const dataUrls = await Promise.all(incoming.map((file) => readFileAsDataUrl(file)));
    const response = await fetch(`${API_BASE_URL}/businesses/${business.id}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${identity.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images: dataUrls }),
    });
    if (!response.ok) throw new Error("Request failed");
    const updated = (await response.json()) as Business;
    setBusiness(updated);
    const mapped = (updated.images ?? []).map((image, index) => ({
      id: `${index}-${image}`,
      label: `Photo ${index + 1}`,
      image,
    }));
    setShots(mapped);
    setSelectedId(mapped[0]?.id ?? "");
  }

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#244227,#0e1610_72%)] text-white shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">storefront</span>
                </span>
                <h1 className="text-[1.4rem] font-extrabold tracking-[-0.05em] text-[#a36e00]">
                  LocalBoost
                </h1>
              </div>
              <Link href={`/${params.locale}/merchant/updates`} className="text-[#7f7467]">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
              </Link>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            {hasError ? (
              <div className="mt-6">
                <ErrorState
                  title="Something went wrong"
                  description="Check your connection and try again."
                  onRetry={() => window.location.reload()}
                  retryLabel="Retry"
                />
              </div>
            ) : null}
            <div className="mobile-fade-up mt-4" style={{ animationDelay: "60ms" }}>
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-[#23212c]">
                Photo Manager
              </h2>
              <p className="mt-2 max-w-[310px] text-[14px] leading-6 text-[#8b8174]">
                Organize your shop&apos;s visual story. Drag to reorder photos for your
                profile.
              </p>
            </div>

            {isLoading ? (
              <div className="mt-6 overflow-hidden rounded-[28px] border border-[#221d1a] bg-[#171614] px-4 py-5">
                <SkeletonLine className="h-4 w-[55%]" />
                <SkeletonLine className="mt-3 h-4 w-[80%]" />
              </div>
            ) : selectedPhoto ? (
              <div
                className="mobile-fade-up mt-6 overflow-hidden rounded-[28px] border border-[#221d1a] bg-[#171614] shadow-[0_18px_34px_rgba(17,14,10,0.18)]"
                style={{ animationDelay: "120ms" }}
              >
                <div className="relative h-[160px]">
                  <img
                    src={selectedPhoto.image}
                    alt={selectedPhoto.label}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,15,0.16),rgba(20,18,15,0.38))]" />
                  <div className="absolute left-3 top-3 rounded-full bg-[#d58d14] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.15em] text-white">
                    Main Photo
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const remaining = shots.filter((shot) => shot.id !== selectedPhoto.id);
                      void updateImages(remaining.map((shot) => shot.image));
                    }}
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#c26f55] shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = shots.findIndex((shot) => shot.id === selectedPhoto.id);
                      if (currentIndex > 0) {
                        const reordered = [...shots];
                        const [active] = reordered.splice(currentIndex, 1);
                        reordered.unshift(active);
                        void updateImages(reordered.map((shot) => shot.image));
                      }
                    }}
                    className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-[#2e2b28]/85 text-white shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {shots.slice(1).map((shot, index) => {
                const active = selectedId === shot.id;

                return (
                  <button
                    key={shot.id}
                    type="button"
                    onClick={() => setSelectedId(shot.id)}
                    className={`mobile-fade-up relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-full border-2 ${
                      active ? "border-[#b27a00]" : "border-white"
                    } shadow-[0_10px_20px_rgba(31,26,10,0.08)]`}
                    style={{ animationDelay: `${180 + index * 60}ms` }}
                  >
                    <img src={shot.image} alt={shot.label} className="h-full w-full object-cover" />
                    <div className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-white/92 text-[#c26f55]">
                      <span className="material-symbols-outlined text-[11px]">close</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mobile-fade-up mt-6 flex h-[138px] w-full flex-col items-center justify-center rounded-[28px] border border-dashed border-[#d9d1c5] bg-[#f6f4f0] text-center"
              style={{ animationDelay: "320ms" }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => void handleAddFiles(event.target.files)}
              />
              <span className="material-symbols-outlined text-[26px] text-[#d2a85e]">add_photo_alternate</span>
              <span className="mt-2 text-[1rem] font-extrabold tracking-[-0.03em] text-[#c39128]">
                Add Photos
              </span>
              <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#c4b8a7]">
                Max 10MB per file
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOptimized((current) => !current)}
              className={`mobile-pill mobile-fade-up mt-7 h-12 w-full text-[12px] font-extrabold ${
                optimized
                  ? "bg-[#177f56] text-white shadow-[0_14px_28px_rgba(23,127,86,0.2)]"
                  : "bg-[#dff5ea] text-[#177f56]"
              }`}
              style={{ animationDelay: "380ms" }}
            >
              <span className="material-symbols-outlined mr-2 text-[16px]">
                {optimized ? "check_circle" : "task_alt"}
              </span>
              {optimized ? "Photos optimized and ready" : "Photo auto-optimized for fast loading"}
            </button>
          </div>

          <div className="px-2 pb-3 pt-2">
            <MerchantAppBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
