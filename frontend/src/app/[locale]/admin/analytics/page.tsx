'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import DauChart from '@/components/admin/analytics/DauChart';
import SearchHeatmap from '@/components/admin/analytics/SearchHeatmap';
import ApiBudgetMonitor from '@/components/admin/analytics/ApiBudgetMonitor';
import TopBusinessesRanking from '@/components/admin/analytics/TopBusinessesRanking';
import LanguageDistribution from '@/components/admin/analytics/LanguageDistribution';
import { adminFetchJson } from '@/lib/adminApi';

function computeDauValue(dauBreakdown?: { event_type: string; _count: number }[]): string {
  if (!dauBreakdown || dauBreakdown.length === 0) return '';
  const total = dauBreakdown.reduce((s, e) => s + e._count, 0);
  return total >= 1000 ? `${(total / 1000).toFixed(1)}k` : String(total);
}

function computeDauGrowth(_dauBreakdown?: { event_type: string; _count: number }[]): string {
  return '';
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const bgColors = [
  'bg-primary-fixed',
  'bg-secondary-fixed',
  'bg-tertiary-fixed',
  'bg-primary-container',
  'bg-secondary-container',
];
const textColors = [
  'text-primary',
  'text-secondary',
  'text-tertiary',
  'text-on-primary-container',
  'text-on-secondary-container',
];

function computeTopBusinesses(
  raw?: { id: number; name: string; reviewCount: number; eventCount: number }[]
) {
  if (!raw || raw.length === 0) return undefined;
  return raw.map((b, i) => ({
    rank: i + 1,
    initials: initials(b.name),
    name: b.name,
    rating: Math.min(
      5,
      Math.max(0, Math.round((b.reviewCount / Math.max(b.eventCount, 1)) * 20 * 5) / 10)
    ),
    growth: Math.round((b.eventCount / Math.max(b.reviewCount, 1)) * 10) / 10,
    bgColor: bgColors[i % bgColors.length],
    textColor: textColors[i % textColors.length],
  }));
}

const langColors = [
  'bg-primary',
  'bg-secondary',
  'bg-tertiary',
  'bg-outline-variant',
  'bg-primary-container',
];

function computeLanguages(raw?: { lang: string; count: number }[]) {
  if (!raw || raw.length === 0) return undefined;
  const total = raw.reduce((s, l) => s + l.count, 0);
  return raw.map((l, i) => ({
    name: l.lang.charAt(0).toUpperCase() + l.lang.slice(1),
    percentage: Math.round((l.count / total) * 100),
    color: langColors[i % langColors.length],
  }));
}

interface AnalyticsPayload {
  dauBreakdown?: { event_type: string; _count: number }[];
  topBusinesses?: { id: number; name: string; reviewCount: number; eventCount: number }[];
  languages?: { lang: string; count: number }[];
}

export default function AnalyticsPage() {
  const t = useTranslations('admin.analytics');

  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      return adminFetchJson<AnalyticsPayload>('/analytics');
    },
    retry: false,
  });

  const dauValue = computeDauValue(analytics?.dauBreakdown) || t('dauValue');
  const dauGrowth = computeDauGrowth(analytics?.dauBreakdown) || t('dauGrowth');
  const topBusinesses = computeTopBusinesses(analytics?.topBusinesses);
  const languages = computeLanguages(analytics?.languages);

  return (
    <>
      <div
        className="sticky top-0 z-40 flex justify-between items-center px-10 py-5 w-full shadow-sm"
        style={{ background: 'rgba(249, 249, 247, 0.8)', backdropFilter: 'blur(24px)' }}
      >
        <div>
          <h2 className="text-xl font-bold text-primary font-headline">{t('title')}</h2>
          <p className="text-on-surface-variant text-xs">{t('subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container-low px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            {t('last30Days')}
          </div>
        </div>
      </div>

      <div className="p-10 max-w-7xl mx-auto space-y-10">
        <div className="maghrib-grid absolute inset-0 -z-10 pointer-events-none"></div>
        <DauChart dauValue={dauValue} growth={dauGrowth} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SearchHeatmap />
          <ApiBudgetMonitor />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TopBusinessesRanking businesses={topBusinesses} />
          <LanguageDistribution languages={languages} />
        </div>
      </div>
    </>
  );
}
