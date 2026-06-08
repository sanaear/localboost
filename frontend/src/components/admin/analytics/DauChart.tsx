'use client';

import { useTranslations } from 'next-intl';

interface DauChartProps {
  title?: string;
  touristsLabel?: string;
  shopsLabel?: string;
  dauValue?: string;
  growth?: string;
}

export default function DauChart({
  title: _title,
  touristsLabel: _touristsLabel,
  shopsLabel: _shopsLabel,
  dauValue = '42.8k',
  growth = '+12% vs last month',
}: DauChartProps) {
  const t = useTranslations('admin.analytics');

  return (
    <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-headline font-bold text-on-surface">{t('dauTitle')}</h3>
          <div className="flex gap-6 mt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="text-xs font-label text-on-surface-variant uppercase tracking-wider">
                {t('dauTourists')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary"></span>
              <span className="text-xs font-label text-on-surface-variant uppercase tracking-wider">
                {t('dauShops')}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-headline font-black text-primary">{dauValue}</span>
          <p className="text-xs font-label text-secondary font-bold">{growth}</p>
        </div>
      </div>

      <div className="h-64 w-full relative flex items-end gap-1">
        <svg className="w-full h-full" viewBox="0 0 1000 200">
          <defs>
            <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#eba020', stopOpacity: 0.2 }}></stop>
              <stop offset="100%" style={{ stopColor: '#eba020', stopOpacity: 0 }}></stop>
            </linearGradient>
            <linearGradient id="grad2" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#2D9E75', stopOpacity: 0.2 }}></stop>
              <stop offset="100%" style={{ stopColor: '#2D9E75', stopOpacity: 0 }}></stop>
            </linearGradient>
          </defs>
          <path
            d="M0,150 Q50,120 100,140 T200,100 T300,130 T400,80 T500,110 T600,60 T700,90 T800,40 T900,70 T1000,30 L1000,200 L0,200 Z"
            fill="url(#grad1)"
          ></path>
          <path
            d="M0,150 Q50,120 100,140 T200,100 T300,130 T400,80 T500,110 T600,60 T700,90 T800,40 T900,70 T1000,30"
            fill="none"
            stroke="#825500"
            strokeWidth="3"
          ></path>
          <path
            d="M0,180 Q50,170 100,175 T200,160 T300,165 T400,150 T500,155 T600,140 T700,145 T800,130 T900,135 T1000,120 L1000,200 L0,200 Z"
            fill="url(#grad2)"
          ></path>
          <path
            d="M0,180 Q50,170 100,175 T200,160 T300,165 T400,150 T500,155 T600,140 T700,145 T800,130 T900,135 T1000,120"
            fill="none"
            stroke="#006C4C"
            strokeWidth="3"
          ></path>
        </svg>
      </div>

      <div className="flex justify-between mt-4 text-[10px] font-label text-slate-400 uppercase tracking-widest px-2">
        <span>Oct 01</span>
        <span>Oct 08</span>
        <span>Oct 15</span>
        <span>Oct 22</span>
        <span>Oct 30</span>
      </div>
    </section>
  );
}
