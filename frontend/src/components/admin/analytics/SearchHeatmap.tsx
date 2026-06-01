'use client';

import { useTranslations } from 'next-intl';

interface CityIntensity {
  name: string;
  intensity: number[];
}

interface SearchHeatmapProps {
  cities?: CityIntensity[];
}

export default function SearchHeatmap({ cities }: SearchHeatmapProps) {
  const t = useTranslations('admin.analytics');

  const defaultCities: CityIntensity[] = [
    { name: 'Casablanca', intensity: [20, 40, 60, 90, 100, 100] },
    { name: 'Marrakech', intensity: [10, 20, 40, 60, 80, 40] },
    { name: 'Rabat', intensity: [30, 50, 20, 10, 40, 60] },
    { name: 'Tangier', intensity: [60, 80, 90, 50, 30, 20] },
  ];

  const data = cities ?? defaultCities;

  return (
    <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-headline font-bold text-on-surface">{t('searchIntensity')}</h3>
        <span className="text-xs font-label text-on-surface-variant uppercase">
          {t('updatedMinAgo')}
        </span>
      </div>

      <div className="space-y-4">
        {data.map((city, index) => (
          <div key={index} className="flex items-center gap-4">
            <span className="w-24 text-sm font-medium text-on-surface-variant">{city.name}</span>
            <div className="flex-1 flex gap-1 h-8">
              {city.intensity.map((intensity, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    backgroundColor: `rgba(130, 85, 0, ${intensity / 100})`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end items-center gap-4">
        <span className="text-[10px] font-label text-slate-400 uppercase">
          {t('intensityScale')}
        </span>
        <div className="flex h-2 w-32 rounded-full overflow-hidden">
          <div className="flex-1 bg-primary/20"></div>
          <div className="flex-1 bg-primary/50"></div>
          <div className="flex-1 bg-primary"></div>
        </div>
      </div>
    </div>
  );
}
