'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import AdminUserBadge from '@/components/admin/AdminUserBadge';
import BusinessesTable from '@/components/admin/businesses/BusinessesTable';
import PreviewPanel from '@/components/admin/businesses/PreviewPanel';
import { adminFetchJson } from '@/lib/adminApi';

interface BusinessItem {
  id: number;
  name: string;
  owner: string;
  category: string;
  city: string;
  submittedDate: string;
  status: string;
  images: string[];
  description?: string;
  lbId?: string;
}

export default function BusinessesPage() {
  const t = useTranslations('admin.businesses');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessItem | null>(null);

  function mapBusiness(raw: any): BusinessItem {
    return {
      id: raw.id,
      name: raw.name,
      owner: raw.user
        ? `${raw.user.first_name || ''} ${raw.user.last_name || ''}`.trim() || 'Unknown'
        : raw.owner || 'Unknown',
      category: raw.category?.name_en || raw.category?.name_fr || raw.category || 'Uncategorized',
      city: raw.city || '',
      submittedDate: raw.created_at
        ? new Date(raw.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : raw.submittedDate || '',
      status: raw.status || 'pending',
      images: raw.images || [],
      description: raw.description || undefined,
      lbId: raw.lbId || `#LB-${raw.id}`,
    };
  }

  const { data: businesses = [] } = useQuery({
    queryKey: ['admin-businesses', search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (statusFilter) params.set('status', statusFilter);
      const query = params.toString();
      const raw = await adminFetchJson(`/businesses${query ? `?${query}` : ''}`);
      return Array.isArray(raw) ? raw.map(mapBusiness) : [];
    },
    retry: false,
  });

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F9F9F7] flex justify-between items-center px-10 py-4 w-full shadow-sm">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-outline"
              placeholder={t('searchPlaceholder')}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-6 ml-8">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">
              notifications
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">
              settings
            </span>
          </div>
          <AdminUserBadge showText={false} />
        </div>
      </header>

      <section className="px-10 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
              {t('title')}
            </h2>
            <p className="text-on-surface-variant mt-1">{t('subtitle')}</p>
          </div>
          <div className="flex gap-3">
            <select
              className="bg-surface-container-low border-none rounded-full px-6 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">{t('allStatuses')}</option>
              <option value="pending">{t('pendingReview')}</option>
              <option value="approved">{t('approved')}</option>
              <option value="rejected">{t('rejected')}</option>
              <option value="suspended">{t('suspended')}</option>
            </select>
            <button className="bg-surface-container-highest flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              {t('advancedFilter')}
            </button>
          </div>
        </div>

        <BusinessesTable
          businesses={businesses}
          onSelect={(b) => setSelectedBusiness(b)}
          selectedId={selectedBusiness?.id ?? null}
        />
      </section>

      {selectedBusiness && (
        <PreviewPanel business={selectedBusiness} onClose={() => setSelectedBusiness(null)} />
      )}
    </>
  );
}
