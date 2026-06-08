'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

function decodeJwtRole(token: string): string | undefined {
  try {
    const [, payload] = token.split('.');
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded)).role;
  } catch {
    return undefined;
  }
}

export default function AdminLoginPage() {
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const locale = params.locale || 'en';
  const [email, setEmail] = useState('admin@localboost.dev');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.accessToken) {
        throw new Error(payload.message || 'Unable to sign in');
      }
      if (decodeJwtRole(payload.accessToken) !== 'admin') {
        throw new Error('This account is not an administrator.');
      }
      window.localStorage.setItem('lb:authToken', payload.accessToken);
      if (payload.refreshToken) window.localStorage.setItem('lb:refreshToken', payload.refreshToken);
      router.replace(`/${locale}/admin`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to sign in');
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#252118]">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-[#15130f] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(235,160,32,0.28),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(0,108,76,0.28),transparent_28%)]" />
          <div className="relative">
            <div className="flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.22em] text-[#f5cf86]">
              <span className="material-symbols-outlined">admin_panel_settings</span>
              LocalBoost Admin
            </div>
            <h1 className="mt-16 max-w-xl text-6xl font-black leading-[0.94] tracking-tight">
              Moderate Morocco's local discovery network.
            </h1>
          </div>
          <div className="relative grid grid-cols-3 gap-3">
            {['Listings', 'Reviews', 'Analytics'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/58">{item}</p>
                <p className="mt-3 text-2xl font-black text-white">Live</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-[430px]">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#825500]">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to LocalBoost
            </Link>
            <div className="mt-8 rounded-[28px] border border-[#eadfce] bg-white px-7 py-8 shadow-[0_24px_70px_rgba(67,49,21,0.12)]">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#825500] text-white">
                <span className="material-symbols-outlined">shield_person</span>
              </div>
              <h2 className="mt-6 text-3xl font-black tracking-tight">Admin sign in</h2>
              <p className="mt-2 text-sm font-medium text-[#756b5d]">
                Review businesses, users, reviews, categories, and platform health.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.16em] text-[#756b5d]">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 h-12 w-full rounded-2xl border border-[#dfd4c3] bg-[#fbfaf6] px-4 text-sm font-bold outline-none focus:border-[#825500]"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.16em] text-[#756b5d]">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    className="mt-2 h-12 w-full rounded-2xl border border-[#dfd4c3] bg-[#fbfaf6] px-4 text-sm font-bold outline-none focus:border-[#825500]"
                    autoComplete="current-password"
                  />
                </div>
                {error ? <p className="text-sm font-bold text-[#ac3400]">{error}</p> : null}
                <button
                  type="submit"
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#825500] px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_16px_32px_rgba(130,85,0,0.22)] disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {busy ? 'progress_activity' : 'login'}
                  </span>
                  {busy ? 'Signing in' : 'Enter dashboard'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
