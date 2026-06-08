'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
}

function decodeJwtPayload(token: string): { role?: string } | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const json = base64UrlDecode(parts[1]);
    const payload = JSON.parse(json);
    return { role: payload.role as string | undefined };
  } catch {
    return null;
  }
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) || 'en';
  const [authorized, setAuthorized] = useState(false);
  const isLoginRoute = pathname?.endsWith('/admin/login');

  useEffect(() => {
    if (isLoginRoute) return;
    const token =
      typeof window !== 'undefined' ? window.localStorage.getItem('lb:authToken') : null;
    const decoded = token ? decodeJwtPayload(token) : null;
    if (decoded?.role === 'admin') {
      setAuthorized(true);
    } else {
      router.replace(`/${locale}/admin/login`);
    }
  }, [router, locale, isLoginRoute]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-container min-h-screen">
      <Sidebar />
      <main className="ml-64 min-h-screen min-w-0 w-[calc(100%-16rem)] overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
