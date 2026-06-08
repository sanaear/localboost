'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { adminFetch } from '@/lib/adminApi';

const navLinks = [
  { id: 'dashboard', path: 'admin', key: 'dashboard', icon: 'dashboard' },
  { id: 'businesses', path: 'admin/businesses', key: 'businesses', icon: 'storefront' },
  { id: 'reviews', path: 'admin/reviews', key: 'reviews', icon: 'rate_review' },
  { id: 'users', path: 'admin/users', key: 'users', icon: 'group' },
  { id: 'categories', path: 'admin/categories', key: 'categories', icon: 'category' },
  { id: 'analytics', path: 'admin/analytics', key: 'analytics', icon: 'analytics' },
  { id: 'settings', path: 'admin/settings', key: 'settings', icon: 'settings' },
];

export default function Sidebar() {
  const t = useTranslations('admin.sidebar');
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const getHref = (path: string) => {
    if (path === 'admin') return `/${locale}/admin`;
    return `/${locale}/${path}`;
  };

  async function handleExportData() {
    setIsExporting(true);
    setExportError('');
    try {
      const response = await adminFetch('/admin/export');
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition') || '';
      const filenameMatch = disposition.match(/filename="?([^"]+)"?/i);
      const filename =
        filenameMatch?.[1] ||
        `localboost-export-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setExportError('Export failed');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1A1A2E] flex flex-col py-6 z-50 shadow-2xl">
      <div className="px-6 mb-10">
        <Link href={`/${locale}/admin`}>
          <h1 className="text-2xl font-black text-[#EBA020] font-headline">LocalBoost</h1>
          <p className="text-slate-400 text-xs tracking-widest uppercase mt-1">{t('portal')}</p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {navLinks.map((link) => {
          const href = getHref(link.path);
          const isActive = pathname === href;
          return (
            <Link
              key={link.id}
              href={href}
              className={`flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
                isActive
                  ? 'bg-[#EBA020]/10 text-[#EBA020] border-r-4 border-[#EBA020] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="text-sm tracking-wide">{t(link.key)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <button
          className="w-full py-3 px-4 bg-[#EBA020] text-[#291800] font-bold rounded-lg active:scale-95 duration-150 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          type="button"
          onClick={() => void handleExportData()}
          disabled={isExporting}
          title={exportError || undefined}
        >
          <span className="material-symbols-outlined text-sm">download</span>
          {isExporting ? 'Exporting...' : t('exportData')}
        </button>
        {exportError ? <p className="mt-2 text-xs font-bold text-[#ffb4ab]">{exportError}</p> : null}
      </div>
    </aside>
  );
}
