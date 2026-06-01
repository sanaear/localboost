'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar />
      <div className="ml-64 min-w-0 w-[calc(100%-16rem)] overflow-x-hidden">
        <Header />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
