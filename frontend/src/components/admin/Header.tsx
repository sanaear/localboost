'use client';

import { ReactNode } from 'react';
import AdminUserBadge from './AdminUserBadge';

interface HeaderProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children?: ReactNode;
}

export default function Header({
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  children,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#F9F9F7] flex justify-between items-center px-10 py-4 w-full shadow-sm">
      <div className="flex items-center gap-4">
        {onSearchChange ? (
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-64 focus:ring-2 focus:ring-primary/20 text-sm"
              placeholder={searchPlaceholder}
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        ) : (
          children
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          <button className="p-2 text-slate-600 hover:bg-[#F4F4F2] transition-colors rounded-full relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full"></span>
          </button>
          <button className="p-2 text-slate-600 hover:bg-[#F4F4F2] transition-colors rounded-full">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-slate-200"></div>

        <AdminUserBadge />
      </div>
    </header>
  );
}
