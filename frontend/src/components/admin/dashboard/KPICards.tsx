'use client';

interface KPICardsProps {
  stats?: {
    total_businesses?: number;
    pending_approvals?: number;
    active_users?: number;
    flagged_reviews?: number;
    business_trend?: string;
    user_trend?: string;
  } | null;
}

export default function KPICards({ stats }: KPICardsProps) {
  const total = stats?.total_businesses ?? 1248;
  const pending = stats?.pending_approvals ?? 12;
  const users = stats?.active_users ?? 8500;
  const flagged = stats?.flagged_reviews ?? 4;
  const bizTrend = stats?.business_trend ?? '+12%';
  const userTrend = stats?.user_trend ?? '+4.2k';

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-primary-container/10 rounded-2xl text-primary">
            <span className="material-symbols-outlined">storefront</span>
          </div>
          <span className="text-xs font-bold text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span> {bizTrend}
          </span>
        </div>
        <h3 className="text-on-surface-variant text-sm font-medium mb-1">Total Businesses</h3>
        <p className="text-3xl font-black text-on-surface font-headline">
          {total.toLocaleString()}
        </p>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-primary-container text-white rounded-2xl">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
          <span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-1 rounded-full">
            URGENT
          </span>
        </div>
        <h3 className="text-on-surface-variant text-sm font-medium mb-1">Pending Approvals</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black text-on-surface font-headline">{pending}</p>
          <span className="text-sm font-bold text-primary">Review now</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-secondary-container/20 text-secondary">
            <span className="material-symbols-outlined">group</span>
          </div>
          <span className="text-xs font-bold text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span> {userTrend}
          </span>
        </div>
        <h3 className="text-on-surface-variant text-sm font-medium mb-1">Active Users</h3>
        <p className="text-3xl font-black text-on-surface font-headline">
          {users.toLocaleString()}
        </p>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-error-container text-error rounded-2xl">
            <span className="material-symbols-outlined">flag</span>
          </div>
          <div className="w-3 h-3 bg-error rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-on-surface-variant text-sm font-medium mb-1">Flagged Reviews</h3>
        <p className="text-3xl font-black text-error font-headline">{flagged}</p>
      </div>
    </section>
  );
}
