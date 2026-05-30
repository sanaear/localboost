import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

const FAVORITES_STORAGE_KEY = "lb:favorites:v1";
const PENDING_OPS_STORAGE_KEY = "lb:favorites:pending:v1";
const FAVORITES_EVENT_NAME = "lb:favorites:changed";

type PendingOp = { id: number; action: "add" | "remove"; ts: number };

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeIds(ids: number[]) {
  return Array.from(new Set(ids.filter((id) => Number.isFinite(id) && id > 0))).sort((a, b) => a - b);
}

function safeParseJson(value: string | null) {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
}

export function getStoredAuthToken(): string | null {
  if (!isBrowser()) return null;
  const candidates = [
    "lb:authToken",
    "lb:token",
    "lb_token",
    "authToken",
    "token",
    "accessToken",
  ];

  for (const key of candidates) {
    const value = window.localStorage.getItem(key);
    if (value && value.trim()) return value.trim();
  }

  return null;
}

export function readFavoriteIds(): number[] {
  if (!isBrowser()) return [];
  const parsed = safeParseJson(window.localStorage.getItem(FAVORITES_STORAGE_KEY));
  if (Array.isArray(parsed)) return normalizeIds(parsed.map((value) => Number(value)));
  if (parsed && typeof parsed === "object" && "favorites" in (parsed as any) && Array.isArray((parsed as any).favorites)) {
    return normalizeIds((parsed as any).favorites.map((value: unknown) => Number(value)));
  }
  return [];
}

function writeFavoriteIds(ids: number[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(normalizeIds(ids)));
  window.dispatchEvent(new Event(FAVORITES_EVENT_NAME));
}

function readPendingOps(): PendingOp[] {
  if (!isBrowser()) return [];
  const parsed = safeParseJson(window.localStorage.getItem(PENDING_OPS_STORAGE_KEY));
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((raw) => {
      if (!raw || typeof raw !== "object") return null;
      const id = Number((raw as any).id);
      const action = (raw as any).action as PendingOp["action"];
      const ts = Number((raw as any).ts);
      if (!Number.isFinite(id) || id <= 0) return null;
      if (action !== "add" && action !== "remove") return null;
      if (!Number.isFinite(ts)) return null;
      return { id, action, ts } satisfies PendingOp;
    })
    .filter(Boolean) as PendingOp[];
}

function writePendingOps(ops: PendingOp[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PENDING_OPS_STORAGE_KEY, JSON.stringify(ops));
}

function enqueuePendingOp(op: PendingOp) {
  const ops = readPendingOps();
  const next = [...ops, op].slice(-50);
  writePendingOps(next);
}

function coalescePendingOps(ops: PendingOp[]) {
  const latestById = new Map<number, PendingOp>();
  for (const op of ops) {
    const prev = latestById.get(op.id);
    if (!prev || op.ts >= prev.ts) latestById.set(op.id, op);
  }
  return Array.from(latestById.values()).sort((a, b) => a.ts - b.ts);
}

async function fetchJson(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return null;
  return response.json() as Promise<unknown>;
}

function extractFavoriteIdsFromApiPayload(payload: unknown): number[] | null {
  if (Array.isArray(payload)) {
    return normalizeIds(payload.map((value) => Number(value)));
  }

  if (payload && typeof payload === "object") {
    const anyPayload = payload as any;
    const candidates = [anyPayload.favorites, anyPayload.data?.favorites, anyPayload.data];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return normalizeIds(candidate.map((value) => Number(value)));
    }
  }

  return null;
}

async function apiGetFavorites(token: string): Promise<number[] | null> {
  const payload = await fetchJson(`${API_BASE_URL}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return extractFavoriteIdsFromApiPayload(payload);
}

async function apiPutFavorites(token: string, favorites: number[]) {
  const payload = await fetchJson(`${API_BASE_URL}/favorites`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ favorites }),
  });
  const ids = extractFavoriteIdsFromApiPayload(payload);
  return ids ?? normalizeIds(favorites);
}

async function apiAddFavorite(token: string, businessId: number) {
  const payload = await fetchJson(`${API_BASE_URL}/favorites`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ businessId, business_id: businessId }),
  });
  const ids = extractFavoriteIdsFromApiPayload(payload);
  return ids ?? null;
}

async function apiRemoveFavorite(token: string, businessId: number) {
  const payload = await fetchJson(`${API_BASE_URL}/favorites/${businessId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const ids = extractFavoriteIdsFromApiPayload(payload);
  return ids ?? null;
}

export async function syncFavoritesWithApi() {
  const token = getStoredAuthToken();
  if (!token) return;

  const local = readFavoriteIds();
  let remote: number[] | null = null;

  try {
    remote = await apiGetFavorites(token);
  } catch {
    remote = null;
  }

  const merged = normalizeIds([...(remote ?? []), ...local]);
  writeFavoriteIds(merged);

  const pending = coalescePendingOps(readPendingOps());
  if (pending.length > 0) {
    const idsAfterPending = pending.reduce((acc, op) => {
      if (op.action === "add") return normalizeIds([...acc, op.id]);
      return acc.filter((id) => id !== op.id);
    }, merged);

    try {
      await apiPutFavorites(token, idsAfterPending);
      writePendingOps([]);
      writeFavoriteIds(idsAfterPending);
      return;
    } catch {
      return;
    }
  }

  if (!remote) return;
  if (merged.length === remote.length && merged.every((id, index) => id === remote[index])) return;

  try {
    await apiPutFavorites(token, merged);
  } catch {
    return;
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => readFavoriteIds());
  const [pendingById, setPendingById] = useState<Record<number, boolean>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const syncOnceRef = useRef(false);

  useEffect(() => {
    if (!isBrowser()) return;

    const updateFromStorage = () => setFavoriteIds(readFavoriteIds());
    const onStorage = (event: StorageEvent) => {
      if (event.key === FAVORITES_STORAGE_KEY) updateFromStorage();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(FAVORITES_EVENT_NAME, updateFromStorage);
    updateFromStorage();

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(FAVORITES_EVENT_NAME, updateFromStorage);
    };
  }, []);

  useEffect(() => {
    if (syncOnceRef.current) return;
    syncOnceRef.current = true;

    if (!getStoredAuthToken()) return;

    setIsSyncing(true);
    syncFavoritesWithApi()
      .catch(() => {
        setError("Unable to sync favorites");
      })
      .finally(() => {
        setIsSyncing(false);
      });
  }, []);

  const isFavorite = useCallback((id: number) => favoriteIds.includes(id), [favoriteIds]);

  const isPending = useCallback((id: number) => Boolean(pendingById[id]), [pendingById]);

  const setFavorite = useCallback(
    async (id: number, next: boolean) => {
      if (!Number.isFinite(id) || id <= 0) return;
      if (!isBrowser()) return;

      setPendingById((current) => ({ ...current, [id]: true }));
      setError(null);

      const currentIds = readFavoriteIds();
      const updated = next ? normalizeIds([...currentIds, id]) : currentIds.filter((value) => value !== id);
      writeFavoriteIds(updated);

      const token = getStoredAuthToken();
      if (!token) {
        setPendingById((current) => {
          const { [id]: _, ...rest } = current;
          return rest;
        });
        return;
      }

      try {
        if (next) {
          const serverIds = await apiAddFavorite(token, id);
          if (serverIds) writeFavoriteIds(serverIds);
        } else {
          const serverIds = await apiRemoveFavorite(token, id);
          if (serverIds) writeFavoriteIds(serverIds);
        }
      } catch {
        enqueuePendingOp({ id, action: next ? "add" : "remove", ts: Date.now() });
        setError("Network error while syncing favorites");
      } finally {
        setPendingById((current) => {
          const { [id]: _, ...rest } = current;
          return rest;
        });
      }
    },
    [],
  );

  const toggleFavorite = useCallback(
    async (id: number) => {
      await setFavorite(id, !isFavorite(id));
    },
    [isFavorite, setFavorite],
  );

  const favoritesSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const clearError = useCallback(() => setError(null), []);

  return {
    favoriteIds,
    favoritesSet,
    isFavorite,
    isPending,
    toggleFavorite,
    setFavorite,
    isSyncing,
    error,
    clearError,
  };
}

