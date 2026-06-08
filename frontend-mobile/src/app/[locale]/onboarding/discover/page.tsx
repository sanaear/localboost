'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function DiscoverPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('onboarding');
  const tCommon = useTranslations('common');
  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col px-4 py-5">
          <div className="flex items-center justify-between text-sm font-extrabold uppercase tracking-[0.12em] text-[#b27a00] mobile-fade-up">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e8a823] text-white">
                +
              </span>
              <span className="text-base normal-case tracking-normal">{tCommon('brand')}</span>
            </div>
            <Link href={`/${params.locale}/home`} className="text-[#9b9488]">
              {t('skip')}
            </Link>
          </div>

          <div
            className="mobile-fade-up mt-7 rounded-[34px] bg-[#f6e6d9] p-4 shadow-[0_20px_40px_rgba(163,110,0,0.12)]"
            style={{ animationDelay: '120ms' }}
          >
            <div className="mobile-hero-image h-[305px] rounded-[28px] p-5">
              <div className="flex h-full items-end">
                <div className="mobile-card flex w-full items-center gap-4 rounded-[22px] px-4 py-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#fff6e3] text-[#d69a17]">
                    <span className="material-symbols-outlined">diamond</span>
                  </span>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#ccad76]">
                      {t('topRated')}
                    </p>
                    <p className="text-xl font-extrabold leading-tight text-[#4b4238]">
                      Le Jardin Secret
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-9 text-center mobile-fade-up" style={{ animationDelay: '220ms' }}>
            <h1 className="text-[2.6rem] font-extrabold leading-[0.92] tracking-[-0.07em] text-[#2e2a33]">
              {t('headlineLine1')} <span className="text-[#e2a11b]">{t('headlineHighlight1')}</span>
              <br />
              <span className="text-[#e2a11b]">{t('headlineHighlight2')}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-[290px] text-[17px] leading-7 text-[#8c836f]">
              {t('description')}
            </p>
          </div>

          <Link
            href={`/${params.locale}/onboarding/guide`}
            className="mobile-pill mobile-button-gold mobile-fade-up mt-auto h-14 w-full text-base font-extrabold"
            style={{ animationDelay: '320ms' }}
          >
            {t('next')}
            <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
          </Link>

          <div className="mt-6 flex items-center justify-center pb-2">
            <div className="mobile-dots">
              <span className="mobile-dot active" />
              <span className="mobile-dot" />
              <span className="mobile-dot" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
