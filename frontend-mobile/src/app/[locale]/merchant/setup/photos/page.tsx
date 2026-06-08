'use client';

import Link from 'next/link';
import { use, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import MerchantBottomNav from '@/components/MerchantBottomNav';
import { readMerchantSetupStep2, writeMerchantSetupStep2 } from '@/lib/merchantSetup';

export default function MerchantPhotosSetupPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('merchantSetup');
  const [uploads, setUploads] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const saved = readMerchantSetupStep2();
    if (!saved) return;
    setUploads(saved.photos ?? []);
  }, []);

  useEffect(() => {
    writeMerchantSetupStep2({ photos: uploads, logo: null });
  }, [uploads]);

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files).slice(0, 10);
    const dataUrls = await Promise.all(incoming.map((file) => readFileAsDataUrl(file)));
    setUploads((current) => [...current, ...dataUrls].slice(0, 10));
  }

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#f9f9f7]">
          <header className="bg-[#f4f4f2] flex justify-between items-center w-full px-6 py-4">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#825500] text-2xl">menu</span>
              <span className="font-headline font-bold tracking-tight text-xl text-[#825500]">
                {t('headerLine1')}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#eba020] overflow-hidden ring-2 ring-[#eba020]/10">
              <span className="material-symbols-outlined text-white text-xl block text-center leading-10">
                person
              </span>
            </div>
          </header>

          <div className="px-6 pt-6 pb-2">
            <div className="flex justify-between items-end mb-3">
              <span className="font-label text-xs font-bold uppercase tracking-widest text-[#825500]">
                {t('step', { current: 2, total: 3 })}
              </span>
              <span className="font-label text-xs font-bold text-[#524534]">
                {t('progress', { percent: 66 })}
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#eeeeec] rounded-full overflow-hidden">
              <div className="h-full bg-[#eba020] w-[66%] rounded-full transition-all duration-700" />
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-6 pb-32">
            <section className="w-full text-center mb-6 mt-4">
              <h1 className="font-headline text-3xl font-bold text-[#1a1c1b] mb-3 tracking-tight">
                {t('photosTitleLine2')}
              </h1>
              <p className="text-[#524534] text-base max-w-sm mx-auto">{t('photosDescription')}</p>
            </section>

            <div className="w-full space-y-6">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => void handleFiles(event.target.files)}
                />
                <div className="w-full h-56 border-2 border-dashed border-[#d7c3ae] rounded-xl flex flex-col items-center justify-center bg-[#f4f4f2] hover:bg-[#e8e8e6] transition-colors group-hover:border-[#825500]">
                  <div className="w-16 h-16 bg-[#825500]/10 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-[#825500] text-3xl">
                      camera
                    </span>
                  </div>
                  <span className="font-headline font-bold text-[#825500] text-xl">
                    {t('photosUploadCta')}
                  </span>
                  <p className="text-[#524534] text-sm mt-2">{t('photosSupport')}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {uploads.map((image, index) => (
                  <div
                    key={image}
                    className="aspect-square bg-[#e2e3e1] rounded-lg overflow-hidden relative shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-[#eba020]/20"
                  >
                    <img
                      src={image}
                      alt={t('uploadAlt', { index: index + 1 })}
                      className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setUploads((current) => current.filter((item) => item !== image))
                      }
                      className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md cursor-pointer hover:bg-[#ba1a1a] hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm block">delete</span>
                    </button>
                  </div>
                ))}
                {uploads.length < 10 && (
                  <div
                    className="aspect-square rounded-lg border-2 border-dashed border-[#d7c3ae] flex flex-col items-center justify-center bg-[#ffffff]/40 text-[#847562] hover:text-[#825500] transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="material-symbols-outlined text-4xl mb-2">add</span>
                    <span className="text-xs font-bold uppercase tracking-widest font-label">
                      {t('addMore')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <footer className="absolute bottom-0 left-0 w-full p-6 bg-[#f9f9f7]/80 backdrop-blur-xl flex flex-col items-center">
            <Link
              href={`/${params.locale}/merchant/setup/contact`}
              className="w-full py-4 bg-[#eba020] text-[#5d3b00] font-headline font-bold text-lg rounded-full flex items-center justify-center gap-2 shadow-xl shadow-[#eba020]/20 hover:scale-105 active:scale-95 transition-all"
            >
              {t('continue')}
            </Link>
            <Link
              href={`/${params.locale}/merchant/dashboard`}
              className="mt-4 text-[#847562] font-label text-xs uppercase tracking-widest font-bold hover:text-[#825500] transition-colors border-b border-transparent hover:border-[#825500] pb-1"
            >
              {t('saveForLater')}
            </Link>
          </footer>
        </div>
      </section>
    </main>
  );
}
