'use client';

import { useTranslations } from 'next-intl';

interface BusinessRow {
  rank: number;
  initials: string;
  name: string;
  rating: number;
  growth: number;
  bgColor: string;
  textColor: string;
}

interface TopBusinessesRankingProps {
  businesses?: BusinessRow[];
  showEntitiesTotal?: string;
}

export default function TopBusinessesRanking({
  businesses,
  showEntitiesTotal,
}: TopBusinessesRankingProps) {
  const t = useTranslations('admin.analytics');

  const defaultBusinesses: BusinessRow[] = [
    {
      rank: 1,
      initials: 'RK',
      name: 'Riad Kniza Gastronomy',
      rating: 4.9,
      growth: 18.2,
      bgColor: 'bg-primary-fixed',
      textColor: 'text-primary',
    },
    {
      rank: 2,
      initials: 'BA',
      name: 'Blue Alley Textiles',
      rating: 4.8,
      growth: 12.5,
      bgColor: 'bg-secondary-fixed',
      textColor: 'text-secondary',
    },
    {
      rank: 3,
      initials: 'MJ',
      name: 'Majorelle Jewelry',
      rating: 4.8,
      growth: 9.1,
      bgColor: 'bg-tertiary-fixed',
      textColor: 'text-tertiary',
    },
  ];

  const data = businesses ?? defaultBusinesses;

  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-headline font-bold text-on-surface">{t('topBusinesses')}</h3>
        <button className="text-xs font-bold text-primary hover:underline">{t('viewAll')}</button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-label text-slate-400 uppercase tracking-widest border-b border-surface-container">
          <div className="col-span-1">#</div>
          <div className="col-span-7">{t('businessName')}</div>
          <div className="col-span-2 text-right">{t('rating')}</div>
          <div className="col-span-2 text-right">{t('growth')}</div>
        </div>

        {data.map((business) => (
          <div
            key={business.rank}
            className="grid grid-cols-12 px-4 py-3 text-sm items-center hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group"
          >
            <div className="col-span-1 font-bold text-slate-400">
              {business.rank.toString().padStart(2, '0')}
            </div>
            <div className="col-span-7 flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full ${business.bgColor} flex items-center justify-center ${business.textColor} font-bold text-xs`}
              >
                {business.initials}
              </div>
              <span className="font-bold text-on-surface">{business.name}</span>
            </div>
            <div className="col-span-2 text-right flex items-center justify-end gap-1">
              <span className="text-primary font-bold">{business.rating}</span>
              <span
                className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
            <div className="col-span-2 text-right text-secondary font-bold">
              +{business.growth}%
            </div>
          </div>
        ))}

        <div className="py-2 text-center">
          <span className="text-[10px] font-label text-slate-300 uppercase tracking-widest">
            {showEntitiesTotal ?? t('topBusinessesCount', { count: 842 })}
          </span>
        </div>
      </div>
    </div>
  );
}
