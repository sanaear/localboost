'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import MerchantAppBottomNav from '@/components/MerchantAppBottomNav';
import { EmptyState, ErrorState, SkeletonLine } from '@/components/UiState';
import {
  API_BASE_URL,
  api,
  normalizeBusiness,
  resolveMediaUrl,
  type Business,
  type Category,
} from '@/lib/api';
import { clearStoredTokens } from '@/lib/auth';
import { fetchMyBusinesses, getMerchantIdentity } from '@/lib/merchant';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type DayHours = { open: boolean; hours: string };
type OpeningHours = Record<string, DayHours>;

export default function MerchantEditProfilePage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('merchantEditProfile');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const identity = useMemo(() => getMerchantIdentity(), []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');
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

        setName(first?.name ?? '');
        setCategoryId(first?.category_id ?? null);
        setDescription(first?.description ?? '');
        setAddress(first?.address ?? '');
        setCity(first?.city ?? '');
        setPostalCode(first?.postal_code ?? '');
        setPhone(first?.phone ?? '');
        setWhatsapp(first?.whatsapp ?? '');
        setWebsite(first?.website ?? '');
        setLat(typeof first?.lat === 'number' ? first.lat : null);
        setLng(typeof first?.lng === 'number' ? first.lng : null);

        const incoming =
          first?.opening_hours && typeof first.opening_hours === 'object'
            ? (first.opening_hours as OpeningHours)
            : null;

        const nextHours: OpeningHours = {};
        for (const day of weekDays) {
          const value = incoming?.[day];
          nextHours[day] = {
            open: Boolean(value?.open),
            hours: typeof value?.hours === 'string' ? value.hours : '',
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
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  async function handleAddFiles(files: FileList | null) {
    if (!files || files.length === 0 || !identity?.token || !business) return;
    const incoming = Array.from(files).slice(0, 6);
    const dataUrls = await Promise.all(incoming.map((file) => readFileAsDataUrl(file)));
    const response = await fetch(`${API_BASE_URL}/businesses/${business.id}/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${identity.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ images: dataUrls }),
    });
    if (!response.ok) throw new Error('Request failed');
    const updated = normalizeBusiness((await response.json()) as Business);
    setBusiness(updated);
    setGallery(updated.images ?? []);
  }

  async function handleDeleteImage(index: number) {
    if (!identity?.token || !business) return;
    const updated = [...gallery];
    updated.splice(index, 1);
    const response = await fetch(`${API_BASE_URL}/businesses/${business.id}/images`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${identity.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ images: updated }),
    });
    if (!response.ok) throw new Error('Request failed');
    const result = normalizeBusiness((await response.json()) as Business);
    setBusiness(result);
    setGallery(result.images ?? []);
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
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  async function handleSave() {
    if (!identity?.token || !business) return;
    setIsSaving(true);
    setSaved(false);
    try {
      const response = await fetch(`${API_BASE_URL}/businesses/${business.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${identity.token}`,
          'Content-Type': 'application/json',
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
      if (!response.ok) throw new Error('Request failed');
      const updated = normalizeBusiness((await response.json()) as Business);
      setBusiness(updated);
      setSaved(true);
    } catch {
      setHasError(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <header className="flex items-center justify-between px-4 pb-2 pt-5">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-surface-container-high ring-2 ring-primary-container/20 overflow-hidden">
                <span className="text-[18px] font-extrabold text-primary font-headline tracking-tight">
                  LB
                </span>
              </div>
              <h1 className="text-[1.4rem] font-extrabold tracking-[-0.05em] text-primary font-headline">
                {tCommon('brand')}
              </h1>
            </div>
            <Link href={`/${params.locale}/merchant/updates`} className="text-[#a39a8b]">
              <span className="material-symbols-outlined text-[18px]">notifications</span>
            </Link>
          </header>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            {hasError ? (
              <div className="mt-6">
                <ErrorState
                  title={tCommon('errorTitle')}
                  description={tCommon('errorDescription')}
                  onRetry={() => window.location.reload()}
                  retryLabel={tCommon('retry')}
                />
              </div>
            ) : null}

            <div className="mobile-fade-up mt-2" style={{ animationDelay: '70ms' }}>
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-[#23212c]">
                Edit Profile
              </h2>
              <p className="mt-1 text-[14px] text-[#7d7468]">{t('subtitle')}</p>
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
                <EmptyState title={t('noBusinessFound')} description={t('noBusinessDescription')} />
              </div>
            ) : (
              <div className="mobile-fade-up mt-6 space-y-10" style={{ animationDelay: '120ms' }}>
                {/* Business Info */}
                <section>
                  <h3 className="font-label text-[0.75rem] font-bold uppercase tracking-widest text-primary mb-4">
                    {t('businessInfo')}
                  </h3>
                  <div className="space-y-5">
                    <div className="relative">
                      <label className="text-xs font-semibold text-on-surface-variant ml-1 mb-1 block font-label">
                        {t('name')}
                      </label>
                      <input
                        className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary focus:ring-0 px-1 py-2 font-headline font-semibold text-lg outline-none transition-colors"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <label className="text-xs font-semibold text-on-surface-variant ml-1 mb-1 block font-label">
                        {t('category')}
                      </label>
                      <select
                        className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary focus:ring-0 px-1 py-2 font-body text-on-surface outline-none transition-colors appearance-none"
                        value={categoryId ?? ''}
                        onChange={(e) =>
                          setCategoryId(e.target.value ? Number(e.target.value) : null)
                        }
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name_en ||
                              cat.name_fr ||
                              cat.name_ar ||
                              cat.name_es ||
                              `Category ${cat.id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <label className="text-xs font-semibold text-on-surface-variant ml-1 mb-1 block font-label">
                        {t('description')}
                      </label>
                      <textarea
                        className="w-full bg-surface-container-low rounded-lg p-3 font-body text-sm text-on-surface-variant outline-none border-none focus:ring-1 focus:ring-primary/20 resize-none"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                {/* Location & Map */}
                <section>
                  <h3 className="font-label text-[0.75rem] font-bold uppercase tracking-widest text-primary mb-4">
                    {t('location')}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-on-surface-variant ml-1 mb-1 block font-label">
                          {t('streetAddress')}
                        </label>
                        <input
                          className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary focus:ring-0 px-1 py-2 font-body text-on-surface outline-none"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-on-surface-variant ml-1 mb-1 block font-label">
                          {t('city')}
                        </label>
                        <input
                          className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary focus:ring-0 px-1 py-2 font-body text-on-surface outline-none"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-on-surface-variant ml-1 mb-1 block font-label">
                          {t('postalCode')}
                        </label>
                        <input
                          className="w-full bg-transparent border-b border-outline-variant/40 focus:border-primary focus:ring-0 px-1 py-2 font-body text-on-surface outline-none"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="relative mt-4 group h-40 rounded-xl overflow-hidden bg-surface-container-high">
                      <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                        <span
                          className="material-symbols-outlined text-primary text-4xl"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          location_on
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleUseMyLocation()}
                        className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur p-2 rounded-full shadow-lg text-primary"
                      >
                        <span className="material-symbols-outlined text-sm">my_location</span>
                      </button>
                    </div>
                    {locationUpdated ? (
                      <p className="text-[12px] font-semibold text-[#5f8e70]">
                        {t('pinRefreshed')}
                      </p>
                    ) : null}
                  </div>
                </section>

                {/* Contact Channels */}
                <section>
                  <h3 className="font-label text-[0.75rem] font-bold uppercase tracking-widest text-primary mb-4">
                    {t('contactChannels')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-lg">
                      <span className="material-symbols-outlined text-secondary text-[20px]">
                        call
                      </span>
                      <input
                        className="flex-1 bg-transparent border-none focus:ring-0 p-0 font-body text-sm text-on-surface"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-lg">
                      <span className="material-symbols-outlined text-green-600 text-[20px]">
                        chat
                      </span>
                      <input
                        className="flex-1 bg-transparent border-none focus:ring-0 p-0 font-body text-sm text-on-surface"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-lg">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        language
                      </span>
                      <input
                        className="flex-1 bg-transparent border-none focus:ring-0 p-0 font-body text-sm text-on-surface"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                {/* Weekly Hours */}
                <section>
                  <h3 className="font-label text-[0.75rem] font-bold uppercase tracking-widest text-primary mb-4">
                    {t('weeklyHours')}
                  </h3>
                  <div className="bg-surface-container-lowest rounded-lg overflow-hidden">
                    <div className="divide-y divide-outline-variant/10">
                      {weekDays.map((day) => {
                        const value = openingHours[day] ?? { open: false, hours: '' };
                        const open = Boolean(value.open);
                        const hoursLabel = value.hours?.trim() || (open ? '09:00 - 18:00' : '');

                        return (
                          <div key={day} className="flex items-center justify-between p-4">
                            <span className="font-body text-sm font-semibold">{day}</span>
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-xs ${open ? 'text-on-surface-variant' : 'text-[#ac3400] font-medium'}`}
                              >
                                {open ? hoursLabel : t('closed')}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextOpen = !open;
                                  setOpeningHours((current) => ({
                                    ...current,
                                    [day]: {
                                      open: nextOpen,
                                      hours: nextOpen ? current[day]?.hours || '09:00 - 18:00' : '',
                                    },
                                  }));
                                }}
                                className={`w-10 h-5 rounded-full relative p-1 flex items-center transition-colors ${
                                  open
                                    ? 'bg-secondary-container justify-end'
                                    : 'bg-surface-container-highest justify-start'
                                }`}
                              >
                                <div
                                  className={`w-3 h-3 rounded-full ${open ? 'bg-secondary' : 'bg-outline'}`}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* Photos & Atmosphere */}
                <section>
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="font-label text-[0.75rem] font-bold uppercase tracking-widest text-primary">
                      {t('photosAtmosphere')}
                    </h3>
                    <span className="text-[10px] text-on-surface-variant">
                      {t('imagesCount', { current: gallery.length, max: 10 })}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {gallery.map((image, index) => (
                      <div
                        key={image}
                        className="aspect-square rounded-lg overflow-hidden relative"
                      >
                        <img
                          src={resolveMediaUrl(image)}
                          alt="Gallery"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => void handleDeleteImage(index)}
                          className="absolute top-1 right-1 bg-on-surface/50 text-white rounded-full p-0.5 backdrop-blur-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-outline transition-colors hover:border-primary hover:text-primary cursor-pointer"
                    >
                      <span className="material-symbols-outlined mb-1">add_a_photo</span>
                      <span className="text-[10px] font-bold">{t('addPhoto')}</span>
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
                </section>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={!business || isSaving}
                  className="w-full bg-primary-container text-on-primary-container font-headline font-bold py-4 rounded-full shadow-[0_12px_48px_rgba(130,85,0,0.24)] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  {isSaving ? t('saving') : t('saveChanges')}
                </button>
                {saved ? (
                  <p className="text-center text-[12px] font-semibold text-[#5f8e70]">
                    {t('savedConfirmation')}
                  </p>
                ) : null}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                clearStoredTokens();
                router.replace(`/${params.locale}`);
              }}
              className="mobile-pill mt-6 h-12 w-full bg-[#9b3e3e] text-[12px] font-extrabold uppercase tracking-[0.14em] text-white"
            >
              {tCommon('logout')}
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
