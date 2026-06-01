'use client';

import Link from 'next/link';

const languages = [
  { locale: 'ar', region: 'MA', label: 'AR', selected: false },
  { locale: 'fr', region: 'FR', label: 'FR', selected: false },
  { locale: 'en', region: 'GB', label: 'EN', selected: true },
  { locale: 'es', region: 'ES', label: 'ES', selected: false },
];

export default function LandingPage() {
  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-dark mobile-pattern-dark">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col items-center justify-center px-6 py-10 text-white">
          <div className="mobile-brand-orb mobile-pulse mobile-float mobile-fade-up">
            <span className="material-symbols-outlined text-[42px] text-white">explore</span>
          </div>

          <div className="mt-12 text-center mobile-fade-up" style={{ animationDelay: '120ms' }}>
            <h1 className="text-[3.6rem] font-extrabold leading-none tracking-[-0.06em] text-[#f0aa25]">
              LocalBoost
            </h1>
            <p className="mt-3 text-[15px] font-semibold text-white/82">
              Discover Authentic Morocco
            </p>
          </div>

          <div
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-[10px] font-extrabold uppercase tracking-[0.28em] text-white/72 mobile-fade-up"
            style={{ animationDelay: '220ms' }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.8)]" />
            World Cup 2030 Official Guide
          </div>

          <div className="mt-10 flex w-full flex-col items-center gap-4">
            {languages.map((language, index) => (
              <Link
                key={language.locale}
                href={`/${language.locale}`}
                className={`mobile-pill mobile-press mobile-fade-up w-[164px] border px-6 py-4 text-lg font-extrabold tracking-wide ${
                  language.selected
                    ? 'border-[#c78d18] bg-[#3b3454]/76 text-[#f0aa25] shadow-[0_18px_30px_rgba(11,9,27,0.28)]'
                    : 'border-white/8 bg-white/[0.04] text-white/78 hover:bg-white/[0.08]'
                }`}
                style={{ animationDelay: `${300 + index * 90}ms` }}
              >
                <span
                  className={`mr-3 text-xl ${language.selected ? 'text-[#87661c]' : 'text-[#8f8ba7]'}`}
                >
                  {language.region}
                </span>
                <span>{language.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
