import { API_BASE_URL, normalizeUser } from '@/lib/api';
import type { User } from '@/lib/api';

type AuthRole = 'tourist' | 'merchant' | 'admin';

const AUTH_TOKEN_KEY = 'lb:authToken';
const REFRESH_TOKEN_KEY = 'lb:refreshToken';

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeParseJson(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

async function readErrorMessage(response: Response) {
  try {
    const text = await response.text();
    const payload = safeParseJson(text);
    if (
      payload &&
      typeof payload === 'object' &&
      'message' in (payload as any) &&
      typeof (payload as any).message === 'string'
    ) {
      return (payload as any).message as string;
    }
    if (text && text.trim()) return text.trim();
  } catch {
    return undefined;
  }
  return undefined;
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return atob(padded);
}

export function decodeJwtPayload(token: string): { id?: number; role?: AuthRole } | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const json = base64UrlDecode(parts[1]);
    const payload = safeParseJson(json);
    if (!payload || typeof payload !== 'object') return null;
    const anyPayload = payload as any;
    const id = Number(anyPayload.id);
    const role = anyPayload.role as AuthRole | undefined;
    return {
      id: Number.isFinite(id) ? id : undefined,
      role: role === 'tourist' || role === 'merchant' || role === 'admin' ? role : undefined,
    };
  } catch {
    return null;
  }
}

export function getStoredAccessToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredTokens(accessToken: string, refreshToken?: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  if (refreshToken) window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearStoredTokens() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function fetchCurrentUser(): Promise<User | null> {
  const accessToken = getStoredAccessToken();
  const payload = accessToken ? decodeJwtPayload(accessToken) : null;
  if (!accessToken || !payload?.id) return null;

  const response = await fetch(`${API_BASE_URL}/users/${payload.id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) return null;
  return normalizeUser((await response.json()) as User);
}

export async function loginWithBackend({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ accessToken: string; refreshToken?: string }> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    });
  } catch {
    throw new Error(`Cannot reach the backend API at ${API_BASE_URL}. Start the backend server and try again.`);
  }

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message ?? `Request failed (${response.status})`);
  }

  const payload = (await response.json()) as { accessToken?: string; refreshToken?: string };
  if (!payload?.accessToken) throw new Error('Missing access token');
  return { accessToken: payload.accessToken, refreshToken: payload.refreshToken };
}

export async function registerWithBackend({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role: AuthRole;
}) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message ?? `Request failed (${response.status})`);
  }

  return response.json() as Promise<unknown>;
}

export async function updateUserProfile({
  accessToken,
  userId,
  firstName,
  lastName,
  preferredLang,
}: {
  accessToken: string;
  userId: number;
  firstName?: string;
  lastName?: string;
  preferredLang?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...(firstName ? { first_name: firstName } : {}),
      ...(lastName ? { last_name: lastName } : {}),
      ...(preferredLang ? { preferred_lang: preferredLang } : {}),
    }),
  });

  if (!response.ok) return null;
  return response.json() as Promise<unknown>;
}
