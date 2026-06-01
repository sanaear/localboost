'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import MobileBottomNav from '@/components/MobileBottomNav';

export default function AboutPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(paramsPromise);
  const t = useTranslations('about');
  const tCommon = useTranslations('common');
  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-5 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <Link
                href={`/${params.locale}/profile`}
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#6f675b] shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </Link>
              <h1 className="text-[1.6rem] font-extrabold tracking-[-0.05em] text-[#a36e00]">
                {t('title')}
              </h1>
              <span className="h-9 w-9" />
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-5 pb-5">
            <div className="mobile-card mobile-fade-up mt-5 rounded-[30px] px-5 py-6">
              <h2 className="text-[2rem] font-extrabold tracking-[-0.06em] text-[#23212c]">
                {tCommon('brand')}
              </h2>
              <p className="mt-4 text-[14px] leading-7 text-[#786f64]">{t('body1')}</p>
              <div className="mt-6 rounded-[22px] bg-[#f4efe5] px-4 py-4 text-[13px] leading-6 text-[#6f675b]">
                {t('body2')}
              </div>
            </div>
          </div>

          <div className="px-4 pb-4 pt-2">
            <MobileBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
