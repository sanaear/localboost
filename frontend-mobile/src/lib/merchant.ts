import { API_BASE_URL, type Business, type Review, type User } from "@/lib/api";
import { decodeJwtPayload, getStoredAccessToken } from "@/lib/auth";

async function httpJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  return response.json();
}

export function getMerchantIdentity() {
  const token = getStoredAccessToken();
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload?.id) return null;
  return { token, userId: payload.id, role: payload.role };
}

export async function fetchMe() {
  const identity = getMerchantIdentity();
  if (!identity) return null;
  const user = await httpJson<User>(`${API_BASE_URL}/users/${identity.userId}`, {
    headers: { Authorization: `Bearer ${identity.token}` },
  });
  return user;
}

export async function fetchMyBusinesses() {
  const identity = getMerchantIdentity();
  if (!identity) return [] as Business[];
  const businesses = await httpJson<Business[]>(`${API_BASE_URL}/businesses`);
  return businesses.filter((business) => business.user_id === identity.userId);
}

export async function fetchFavoriteCountForBusiness(businessId: number) {
  const payload = await httpJson<{ count: number }>(`${API_BASE_URL}/favorites/business/${businessId}/count`);
  return Number(payload.count) || 0;
}

export async function fetchApprovedReviewsForBusiness(businessId: number) {
  return httpJson<Review[]>(`${API_BASE_URL}/reviews/business/${businessId}`);
}

