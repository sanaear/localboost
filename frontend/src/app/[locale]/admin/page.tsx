'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import KPICards from '@/components/admin/dashboard/KPICards';
import RegistrationTrends from '@/components/admin/dashboard/RegistrationTrends';
import BusinessesByCity from '@/components/admin/dashboard/BusinessesByCity';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import AdminUserBadge from '@/components/admin/AdminUserBadge';
import { adminFetchJson } from '@/lib/adminApi';

const activityIconMap: Record<string, { icon: string; iconBg: string; iconText: string }> = {
  business: {
    icon: 'add_business',
    iconBg: 'bg-secondary-container',
    iconText: 'text-on-secondary-container',
  },
  review: { icon: 'report', iconBg: 'bg-error-container', iconText: 'text-error' },
  user: { icon: 'person_add', iconBg: 'bg-primary-container/20', iconText: 'text-primary' },
};

interface AdminActivity {
  type: string;
  name?: string;
  action?: string;
  target?: string;
  user?: string;
  time: string;
  details?: string;
}

function mapActivities(raw?: AdminActivity[]) {
  if (!raw || raw.length === 0) return undefined;
  return raw.map((a, i) => ({
    id: String(i + 1),
    ...(activityIconMap[a.type] || {
      icon: 'update',
      iconBg: 'bg-surface-container-high',
      iconText: 'text-on-surface-variant',
    }),
    message:
      a.type === 'business'
        ? 'New business registered:'
        : a.type === 'user'
          ? 'New user registered:'
          : a.type === 'review'
            ? 'Review added:'
            : 'Event:',
    highlight: a.name || a.target || a.user || 'Unknown',
    time: a.time,
    details: a.details || a.action || '',
  }));
}

interface AdminStatsResponse {
  totalBusinesses?: number;
  pendingApprovals?: number;
  activeUsers?: number;
  flaggedReviews?: number;
}

interface DashboardResponse {
  stats?: AdminStatsResponse;
  activities?: AdminActivity[];
  registrationTrends?: Array<{ label: string; count: number }>;
  businessesByCity?: Array<{ name: string; count: number; percentage: number }>;
}

export default function DashboardPage() {
  const t = useTranslations('admin.dashboard');
  const { data: dashboard } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      return adminFetchJson<DashboardResponse>('/admin/dashboard');
    },
    retry: false,
  });

  const stats = dashboard?.stats
    ? {
        total_businesses: dashboard.stats.totalBusinesses,
        pending_approvals: dashboard.stats.pendingApprovals,
        active_users: dashboard.stats.activeUsers,
        flagged_reviews: dashboard.stats.flaggedReviews,
      }
    : undefined;

  const recentActivities = mapActivities(dashboard?.activities) ?? undefined;

  return (
    <>
      <header
        className="sticky top-0 z-40 flex justify-between items-center px-10 py-5 w-full shadow-sm"
        style={{ background: 'rgba(249, 249, 247, 0.8)', backdropFilter: 'blur(24px)' }}
      >
        <div>
          <h2 className="text-xl font-bold text-[#825500] font-headline">{t('title')}</h2>
          <p className="text-on-surface-variant text-xs">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-600 hover:bg-surface-container-low rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full"></span>
            </button>
            <button className="p-2 text-slate-600 hover:bg-surface-container-low rounded-full transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div className="h-8 w-[1px] bg-outline-variant/30"></div>
          <AdminUserBadge />
        </div>
      </header>

      <div className="p-10 space-y-12">
        <KPICards stats={stats} />

        <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
          <div className="space-y-8">
            <RegistrationTrends trends={dashboard?.registrationTrends} />
            <BusinessesByCity cities={dashboard?.businessesByCity} />
          </div>
          <div className="space-y-8">
            <RecentActivity activities={recentActivities} />
            <div className="h-48 rounded-xl bg-surface-container-high relative overflow-hidden flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB1AT5HfIxMBsx96de21DJxUhErvLLKFIr4bZMBPE8kdi7HyVMm7NpYGJZ_vcwFgfeIkZmTUsLQlbefc3Mm32xX_6Evn5wLlhXeV2ZSUdllsoQESNQOiYo6v_iy3eb619MnLudAEetXQIUy8vH-0DJYK-QY_5enL9eva4MSm1m2k_NZ_3HBxsyDcPtHSblE6LvvS-KSQtVt8Hh8ocdYdBjOQ_f_7pZgGO2W7r9IJrltvg2V6nl2KA4UZuWrF5eR5NE6Y-PuU6GgYk4')",
                }}
              ></div>
              <div className="relative text-center p-6">
                <span className="material-symbols-outlined text-4xl text-primary/30 mb-2">
                  auto_awesome
                </span>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">
                  Digital Riad Infrastructure
                </p>
                <p className="text-[10px] text-on-surface-variant/40 mt-1">
                  Optimized for 2030 World Cup Peak Loads
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
