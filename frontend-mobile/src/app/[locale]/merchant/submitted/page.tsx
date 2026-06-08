'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function MerchantSubmittedPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('merchantSetup');
  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content relative z-10 min-h-[calc(100vh-32px)] flex flex-col items-center justify-center px-6 py-8 overflow-hidden bg-[#f9f9f7]">
          <div className="w-full max-w-sm text-center space-y-8">
            <div className="relative flex justify-center">
              <div className="w-28 h-28 rounded-full border-2 border-[#d7c3ae]/30 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#f4f4f2] flex items-center justify-center shadow-[0_12px_48px_rgba(130,85,0,0.12)]">
                  <div className="w-16 h-16 rounded-full bg-[#eba020] flex items-center justify-center text-[#5d3b00] shadow-lg">
                    <span
                      className="material-symbols-outlined text-4xl font-bold"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-[#825500]">
                {t('profileSubmitted')}
              </h1>
              <p className="text-[#524534] text-base max-w-xs mx-auto leading-relaxed">
                {t('profileSubmittedDescription')}
              </p>
            </div>

            <div className="pt-4 flex flex-col items-center gap-5">
              <Link
                href={`/${params.locale}/merchant/dashboard`}
                className="relative px-10 py-5 bg-[#825500] text-[#ffffff] rounded-full font-headline font-bold text-base shadow-[0_16px_32px_rgba(130,85,0,0.2)] hover:shadow-[0_24px_48px_rgba(130,85,0,0.3)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
              >
                <span className="relative z-10">{t('goToDashboard')}</span>
              </Link>

              <div className="flex items-center gap-2 text-[#524534]/60 font-label text-xs uppercase tracking-[0.2em] font-bold">
                <span className="material-symbols-outlined text-base">verified_user</span>
                <span>{t('reviewTypically')}</span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3 mt-8 max-w-xs mx-auto opacity-40">
              <div className="col-span-8 h-28 rounded-lg bg-[#e8e8e6] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d7c3ae]/20 to-transparent" />
              </div>
              <div className="col-span-4 h-28 rounded-lg bg-[#8af4c5]/20" />
              <div className="col-span-3 h-28 rounded-lg bg-[#ff926d]/10" />
              <div className="col-span-9 h-28 rounded-lg bg-[#eeeeec] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-bl from-[#006c4c]/10 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
