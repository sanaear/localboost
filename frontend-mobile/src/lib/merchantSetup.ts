type Step1 = {
  businessName: string;
  category: string;
  city?: string;
  address?: string;
};

type Step2 = {
  logo?: string | null;
  photos: string[];
};

type Step3 = {
  openingHours: Record<string, { start: string; end: string; enabled: boolean }>;
  whatsapp?: string;
  phone?: string;
  email?: string;
  website?: string;
};

const STEP1_KEY = "lb:merchantSetup:step1:v1";
const STEP2_KEY = "lb:merchantSetup:step2:v1";
const STEP3_KEY = "lb:merchantSetup:step3:v1";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParseJson(value: string | null) {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
}

export function readMerchantSetupStep1(): Step1 | null {
  if (!isBrowser()) return null;
  const parsed = safeParseJson(window.localStorage.getItem(STEP1_KEY));
  if (!parsed || typeof parsed !== "object") return null;
  const anyValue = parsed as any;
  if (typeof anyValue.businessName !== "string" || typeof anyValue.category !== "string") return null;
  return {
    businessName: anyValue.businessName,
    category: anyValue.category,
    city: typeof anyValue.city === "string" ? anyValue.city : undefined,
    address: typeof anyValue.address === "string" ? anyValue.address : undefined,
  };
}

export function writeMerchantSetupStep1(value: Step1) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STEP1_KEY, JSON.stringify(value));
}

export function readMerchantSetupStep2(): Step2 | null {
  if (!isBrowser()) return null;
  const parsed = safeParseJson(window.localStorage.getItem(STEP2_KEY));
  if (!parsed || typeof parsed !== "object") return null;
  const anyValue = parsed as any;
  const photos = Array.isArray(anyValue.photos) ? anyValue.photos.filter((p: unknown) => typeof p === "string") : [];
  return {
    logo: typeof anyValue.logo === "string" ? anyValue.logo : null,
    photos,
  };
}

export function writeMerchantSetupStep2(value: Step2) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STEP2_KEY, JSON.stringify(value));
}

export function readMerchantSetupStep3(): Step3 | null {
  if (!isBrowser()) return null;
  const parsed = safeParseJson(window.localStorage.getItem(STEP3_KEY));
  if (!parsed || typeof parsed !== "object") return null;
  const anyValue = parsed as any;
  const openingHours = anyValue.openingHours && typeof anyValue.openingHours === "object" ? anyValue.openingHours : {};
  return {
    openingHours,
    whatsapp: typeof anyValue.whatsapp === "string" ? anyValue.whatsapp : undefined,
    phone: typeof anyValue.phone === "string" ? anyValue.phone : undefined,
    email: typeof anyValue.email === "string" ? anyValue.email : undefined,
    website: typeof anyValue.website === "string" ? anyValue.website : undefined,
  };
}

export function writeMerchantSetupStep3(value: Step3) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STEP3_KEY, JSON.stringify(value));
}

export function clearMerchantSetupDraft() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STEP1_KEY);
  window.localStorage.removeItem(STEP2_KEY);
  window.localStorage.removeItem(STEP3_KEY);
}

