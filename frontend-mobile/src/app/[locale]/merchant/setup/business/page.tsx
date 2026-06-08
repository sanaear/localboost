'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import MerchantBottomNav from '@/components/MerchantBottomNav';
import { readMerchantSetupStep1, writeMerchantSetupStep1 } from '@/lib/merchantSetup';
import { API_BASE_URL, api, type Category } from '@/lib/api';

const cities = ['Casablanca', 'Marrakech', 'Fès', 'Rabat', 'Tanger', 'Agadir', 'Other'] as const;

export default function MerchantBusinessSetupPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('merchantSetup');
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [suggestions, setSuggestions] = useState<Category[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    api
      .getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    const saved = readMerchantSetupStep1();
    if (saved) {
      setBusinessName(saved.businessName ?? '');
      setCategory(saved.category ?? categories[0].name_en ?? '');
      setCity(saved.city ?? '');
      setAddress(saved.address ?? '');
      setPhone(saved.phone ?? '');
    } else {
      setCategory(categories[0].name_en ?? '');
    }
  }, [categories]);

  useEffect(() => {
    if (businessName.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories/suggest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(typeof window !== 'undefined' && window.localStorage.getItem('lb:authToken')
              ? { Authorization: `Bearer ${window.localStorage.getItem('lb:authToken')}` }
              : {}),
          },
          body: JSON.stringify({ name: businessName }),
        });
        if (!res.ok) return;
        const data = await res.json();
        const scored = (Array.isArray(data) ? data : (data.suggestions ?? [])).filter(
          (c: any) => c.score > 0 && c.name_en !== category
        );
        setSuggestions(scored);
        setShowSuggestions(scored.length > 0);
      } catch {
        // silently fail
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [businessName, category]);

  function handleNext() {
    if (!businessName.trim() || !category || !city.trim()) {
      setFormError('Business name, category, and city are required.');
      return;
    }
    setFormError('');
    writeMerchantSetupStep1({
      businessName: businessName.trim(),
      category,
      city: city.trim() || undefined,
      address: address.trim() || undefined,
      phone: phone.trim() || undefined,
    });
    router.push(`/${params.locale}/merchant/setup/photos`);
  }

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#f9f9f7]">
          <div className="px-6 pb-4 pt-8">
            <div className="flex items-center justify-between mb-3">
              <p className="font-label text-[10px] font-bold uppercase tracking-widest text-[#524534]">
                {t('step', { current: 1, total: 3 })}
              </p>
              <p className="font-label text-[10px] font-bold uppercase tracking-widest text-[#825500]">
                {t('progress', { percent: 33 })}
              </p>
            </div>
            <div className="h-1.5 w-full bg-[#e8e8e6] rounded-full overflow-hidden">
              <div className="h-full bg-[#eba020] w-1/3 rounded-full" />
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-8 pt-6 pb-32">
            <div className="mb-10">
              <h1 className="font-headline text-[2rem] font-extrabold leading-tight tracking-tight text-[#825500] mb-2">
                {t('titleLine1')}
              </h1>
              <p className="text-[#524534] text-base leading-relaxed">{t('description')}</p>
            </div>

            <form className="space-y-8">
              <div className="relative">
                <label className="block font-label text-[0.75rem] font-bold uppercase tracking-wider text-[#847562] mb-1">
                  {t('businessNameLabel')}
                </label>
                <input
                  className="w-full bg-transparent border-b-2 border-[#d7c3ae] focus:border-[#825500] focus:ring-0 transition-colors py-2 text-lg font-medium placeholder:text-[#dadad8]"
                  placeholder={t('businessNamePlaceholder')}
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                />
              </div>

              <div className="relative">
                <label className="block font-label text-[0.75rem] font-bold uppercase tracking-wider text-[#847562] mb-1">
                  {t('categoryLabel')}
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-transparent border-b-2 border-[#d7c3ae] focus:border-[#825500] focus:ring-0 transition-colors py-2 text-lg font-medium appearance-none text-[#1a1c1b]"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name_en ?? ''}>
                        {cat.name_en ?? cat.name_fr ?? ''}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-2 text-[#847562] pointer-events-none">
                    expand_more
                  </span>
                </div>
                {showSuggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setCategory(s.name_en ?? '');
                          setShowSuggestions(false);
                        }}
                        className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-[#eba020] text-[#825500] bg-[#eba020]/10 hover:bg-[#eba020]/20 transition-colors"
                      >
                        {s.name_en ?? s.name_fr ?? ''}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block font-label text-[0.75rem] font-bold uppercase tracking-wider text-[#847562] mb-1">
                  {t('cityLabel')}
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-transparent border-b-2 border-[#d7c3ae] focus:border-[#825500] focus:ring-0 transition-colors py-2 text-lg font-medium appearance-none text-[#1a1c1b]"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="" disabled>
                      {t('selectCity')}
                    </option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-2 text-[#847562] pointer-events-none">
                    location_on
                  </span>
                </div>
              </div>

              <div className="relative">
                <label className="block font-label text-[0.75rem] font-bold uppercase tracking-wider text-[#847562] mb-1">
                  {t('addressLabel')}
                </label>
                <input
                  className="w-full bg-transparent border-b-2 border-[#d7c3ae] focus:border-[#825500] focus:ring-0 transition-colors py-2 text-lg font-medium placeholder:text-[#dadad8]"
                  placeholder={t('addressPlaceholder')}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>

              <div className="relative">
                <label className="block font-label text-[0.75rem] font-bold uppercase tracking-wider text-[#847562] mb-1">
                  {t('phoneLabel')}
                </label>
                <div className="flex items-center">
                  <span className="text-[#524534] font-medium mr-2">+212</span>
                  <input
                    className="w-full bg-transparent border-b-2 border-[#d7c3ae] focus:border-[#825500] focus:ring-0 transition-colors py-2 text-lg font-medium placeholder:text-[#dadad8]"
                    placeholder={t('phonePlaceholder')}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    type="tel"
                  />
                </div>
              </div>
            </form>
            {formError ? (
              <p className="mt-5 rounded-lg bg-error-container px-4 py-3 text-sm font-bold text-on-error-container">
                {formError}
              </p>
            ) : null}

            <div className="mt-12 rounded-xl overflow-hidden aspect-[4/3] relative shadow-xl">
              <img
                alt="Moroccan marketplace"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp3mQ2IuBtGmI7I_LN9cYhJ8b0Z-hQ4Rhl3Zaey5RJZY9eIefo7tXka8fPmAENUlFFbQfxpNvR1oTXuwp9jSegWt4V3dOlrXtv4WdCrHa05Yre94Qyp6fkjq2qWflOdRXugBWifIJl0Lh8sJoV7yFXPSjAiIJY8jym3qrxG-oEN1aZkwd_6dPMwGNftQkxK0xmk7rL7XUqhDUKOXx9mxbjc8QOoYbycOf4v8E3TSuZsgwVeTxGnykj1GxxgfBt1nyAiDRcgCQTzzE"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#825500]/40 to-transparent" />
            </div>
          </div>

          <footer className="absolute bottom-0 left-0 w-full p-6 bg-[#f9f9f7]/80 backdrop-blur-xl flex flex-col items-center">
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-4 bg-[#eba020] text-[#5d3b00] font-headline font-bold text-lg rounded-full flex items-center justify-center gap-2 shadow-lg shadow-[#eba020]/20 active:scale-95 transition-transform"
            >
              {t('next')}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <Link
              href={`/${params.locale}/merchant/dashboard`}
              className="mt-4 text-[#847562] font-label text-xs uppercase tracking-widest font-bold hover:text-[#825500] transition-colors"
            >
              {t('saveForLater')}
            </Link>
          </footer>
        </div>
      </section>
    </main>
  );
}
