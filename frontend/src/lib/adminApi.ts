const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface AdminUser {
  id: number;
  role: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  status?: string;
}

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('lb:authToken');
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
}

export function getAdminTokenPayload(): { id?: number; role?: string } | null {
  const token = getAdminToken();
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1])) as { id?: unknown; role?: unknown };
    const id = Number(payload.id);
    return {
      id: Number.isFinite(id) ? id : undefined,
      role: typeof payload.role === 'string' ? payload.role : undefined,
    };
  } catch {
    return null;
  }
}

export function adminApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init.headers);

  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(adminApiUrl(path), {
    ...init,
    headers,
  });
}

export async function adminFetchJson<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await adminFetch(path, init);
  if (!res.ok) {
    const message = await res.text().catch(() => '');
    throw new Error(message || `Admin API request failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchCurrentAdminUser(): Promise<AdminUser | null> {
  const payload = getAdminTokenPayload();
  if (!payload?.id) return null;
  return adminFetchJson<AdminUser>(`/users/${payload.id}`);
}
