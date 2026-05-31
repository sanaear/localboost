"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import MerchantAppBottomNav from "@/components/MerchantAppBottomNav";
import { EmptyState, ErrorState, SkeletonLine } from "@/components/UiState";
import { API_BASE_URL, api, type Business, type Category } from "@/lib/api";
import { clearStoredTokens } from "@/lib/auth";
import { fetchMyBusinesses, getMerchantIdentity } from "@/lib/merchant";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type DayHours = { open: boolean; hours: string };
type OpeningHours = Record<string, DayHours>;

export default function MerchantEditProfilePage({
  params,
}: {
  params: { locale: string };
}) {
  const tCommon = useTranslations("common");
  const router = useRouter();
  const identity = useMemo(() => getMerchantIdentity(), []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [openingHours, setOpeningHours] = useState<OpeningHours>({});
  const [gallery, setGallery] = useState<string[]>([]);
  const [locationUpdated, setLocationUpdated] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    setBusiness(null);
    setSaved(false);
    setLocationUpdated(false);

    void (async () => {
      if (!identity?.token) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      try {
        const [resolvedBusinesses, resolvedCategories] = await Promise.all([
          fetchMyBusinesses(),
          api.getCategories(),
        ]);
        if (cancelled) return;
        const first = resolvedBusinesses[0] ?? null;
        setBusiness(first);
        setCategories(resolvedCategories);

        setName(first?.name ?? "");
        setCategoryId(first?.category_id ?? null);
        setDescription(first?.description ?? "");
        setAddress(first?.address ?? "");
        setCity(first?.city ?? "");
        setPostalCode(first?.postal_code ?? "");
        setPhone(first?.phone ?? "");
        setWhatsapp(first?.whatsapp ?? "");
        setWebsite(first?.website ?? "");
        setLat(typeof first?.lat === "number" ? first.lat : null);
        setLng(typeof first?.lng === "number" ? first.lng : null);

        const incoming = first?.opening_hours && typeof first.opening_hours === "object"
          ? (first.opening_hours as OpeningHours)
          : null;

        const nextHours: OpeningHours = {};
        for (const day of weekDays) {
          const value = incoming?.[day];
          nextHours[day] = {
            open: Boolean(value?.open),
            hours: typeof value?.hours === "string" ? value.hours : "",
          };
        }
        setOpeningHours(nextHours);
        setGallery(Array.isArray(first?.images) ? first!.images : []);
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
    setGallery(updated.images ?? []);
  }

  async function handleUseMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLocationUpdated(true);
      },
      () => {
        setLocationUpdated(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  async function handleSave() {
    if (!identity?.token || !business) return;
    setIsSaving(true);
    setSaved(false);
    try {
      const response = await fetch(`${API_BASE_URL}/businesses/${business.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${identity.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category_id: categoryId,
          description,
          address,
          city,
          postal_code: postalCode,
          phone,
          whatsapp,
          website,
          lat,
          lng,
          opening_hours: openingHours,
          images: gallery,
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      const updated = (await response.json()) as Business;
      setBusiness(updated);
      setSaved(true);
    } catch {
      setHasError(true);
    } finally {
      setIsSaving(false);
    }
  }

  const categoryLabel =
    categories.find((category) => category.id === categoryId)?.name_en ??
    categories.find((category) => category.id === categoryId)?.name_fr ??
    categories.find((category) => category.id === categoryId)?.name_ar ??
    categories.find((category) => category.id === categoryId)?.name_es ??
    "";

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#a36e00] text-white shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                </span>
                <h1 className="text-[1.4rem] font-extrabold tracking-[-0.05em] text-[#a36e00]">LocalBoost</h1>
              </div>
              <Link href={`/${params.locale}/merchant/updates`} className="text-[#a39a8b]">
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

            <div className="mobile-fade-up mt-3" style={{ animationDelay: "70ms" }}>
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-[#23212c]">Edit Profile</h2>
              <p className="mt-1 text-[14px] text-[#7d7468]">
                Update your business presence for the local community.
              </p>
            </div>

            {isLoading ? (
              <div className="mt-6 space-y-3 rounded-[28px] bg-[#f4f1eb] px-4 py-5">
                <SkeletonLine className="h-4 w-[45%]" />
                <SkeletonLine className="h-11 w-full rounded-[20px]" />
                <SkeletonLine className="h-11 w-full rounded-[20px]" />
                <SkeletonLine className="h-20 w-full rounded-[20px]" />
              </div>
            ) : !business ? (
              <div className="mt-6">
                <EmptyState
                  title="No business found"
                  description="Create a business profile first to edit it here."
                />
              </div>
            ) : (
              <div className="mobile-fade-up mt-6 space-y-6" style={{ animationDelay: "120ms" }}>
              <div>
                <label className="mobile-label">Business Info</label>
                <div className="space-y-3">
                  <input
                    className="mobile-input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCategoryId((current) => {
                        const ids = categories.map((category) => category.id);
                        if (!ids.length) return current ?? null;
                        if (current == null) return ids[0];
                        const index = ids.indexOf(current);
                        return ids[(index + 1) % ids.length] ?? ids[0];
                      })
                    }
                    className="mobile-input flex items-center justify-between text-left"
                  >
                    <span>{categoryLabel || "Select category"}</span>
                    <span className="material-symbols-outlined text-[#8a8174]">expand_more</span>
                  </button>
                  <textarea
                    className="mobile-input min-h-[96px] resize-none"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mobile-label">Location &amp; Map</label>
                <div className="space-y-3">
                  <input
                    className="mobile-input"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="mobile-input"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                    />
                    <input
                      className="mobile-input"
                      value={postalCode}
                      onChange={(event) => setPostalCode(event.target.value)}
                    />
                  </div>
                  <div className="mobile-map-surface h-[150px] rounded-[30px] border border-[#e7ddcf] relative overflow-hidden">
                    <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#b27a00] text-white shadow-lg">
                      <span className="material-symbols-outlined">place</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleUseMyLocation()}
                      className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white/88 text-[#6f675b] shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">my_location</span>
                    </button>
                  </div>
                  {locationUpdated ? (
                    <p className="text-[12px] font-semibold text-[#5f8e70]">
                      Pin refreshed for your current storefront location.
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="mobile-label">Contact Channels</label>
                <div className="space-y-3">
                  <input
                    className="mobile-input"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                  <input
                    className="mobile-input"
                    value={whatsapp}
                    onChange={(event) => setWhatsapp(event.target.value)}
                  />
                  <input
                    className="mobile-input"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mobile-label">Weekly Hours</label>
                <div className="rounded-[28px] bg-[#f4f1eb] px-4 py-2">
                  {weekDays.map((day) => {
                    const value = openingHours[day] ?? { open: false, hours: "" };
                    const open = Boolean(value.open);
                    const hoursLabel = value.hours?.trim()
                      ? value.hours
                      : open
                        ? "Set hours"
                        : "Closed";

                    return (
                      <div
                        key={day}
                        className="flex items-center justify-between border-b last:border-b-0 border-[#e7e1d6] py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-bold text-[#38332d]">{day}</div>
                          <input
                            className={`mt-1 w-full bg-transparent text-[12px] outline-none ${
                              open ? "text-[#8a8174]" : "text-[#c26f55]"
                            }`}
                            value={hoursLabel}
                            onChange={(event) =>
                              setOpeningHours((current) => ({
                                ...current,
                                [day]: { open, hours: event.target.value },
                              }))
                            }
                            disabled={!open}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setOpeningHours((current) => ({
                              ...current,
                              [day]: { open: !open, hours: current[day]?.hours ?? "" },
                            }))
                          }
                          className={`relative h-7 w-12 rounded-full ${
                            open ? "bg-[#2fc08f]" : "bg-[#ddd7cd]"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${
                              open ? "left-[22px]" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="mobile-label mb-0">Photos &amp; Atmosphere</label>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b9af9d]">
                    {gallery.length}/8 images
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {gallery.map((image) => (
                    <img key={image} src={image} alt="Gallery" className="h-[86px] w-full rounded-[22px] object-cover" />
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-[86px] items-center justify-center rounded-[22px] border border-dashed border-[#e2d5c3] bg-[#faf7f2] text-[#b8ae9f]"
                  >
                    <span className="material-symbols-outlined">add_a_photo</span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => void handleAddFiles(event.target.files)}
                />
              </div>
            </div>
            )}

            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={!business || isSaving}
              className="mobile-pill mobile-button-gold mobile-fade-up mt-8 h-14 w-full text-base font-extrabold"
              style={{ animationDelay: "200ms" }}
            >
              <span className="material-symbols-outlined mr-2 text-[18px]">check_circle</span>
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            {saved ? (
              <p className="mt-3 text-center text-[12px] font-semibold text-[#5f8e70]">
                Profile changes saved successfully.
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => {
                clearStoredTokens();
                router.replace(`/${params.locale}`);
              }}
              className="mobile-pill mt-4 h-12 w-full bg-[#9b3e3e] text-[12px] font-extrabold uppercase tracking-[0.14em] text-white"
            >
              {tCommon("logout")}
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
