function getCloudName() {
  return (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '').trim() || null;
}

function normalizeWidths(widths: number[]) {
  return Array.from(
    new Set(
      widths
        .map((w) => Number(w))
        .filter((w) => Number.isFinite(w) && w > 0)
        .map((w) => Math.round(w))
    )
  ).sort((a, b) => a - b);
}

function buildCloudinaryUploadUrl(src: string, transform: string) {
  const match = src.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/);
  if (!match) return null;
  const prefix = match[1];
  const rest = match[2];
  if (rest.startsWith(transform)) return src;
  return `${prefix}${transform}/${rest}`;
}

function canCloudinaryFetch(src: string) {
  if (/^(data:|blob:)/i.test(src)) return false;
  try {
    const url = new URL(src);
    return !['localhost', '127.0.0.1', '[::1]', '::1'].includes(url.hostname);
  } catch {
    return false;
  }
}

export function getCloudinaryOptimizedSrc(src: string, width: number) {
  const cloudName = getCloudName();
  if (!cloudName) return null;
  if (!src || typeof src !== 'string') return null;

  const transform = `f_auto,q_auto,w_${Math.round(width)}`;
  const upload = buildCloudinaryUploadUrl(src, transform);
  if (upload) return upload;
  if (!canCloudinaryFetch(src)) return null;

  return `https://res.cloudinary.com/${cloudName}/image/fetch/${transform}/${encodeURIComponent(src)}`;
}

export function getCloudinaryOptimizedSrcSet(src: string, widths: number[]) {
  const cloudName = getCloudName();
  if (!cloudName) return null;

  const normalized = normalizeWidths(widths);
  if (normalized.length === 0) return null;

  return normalized.map((w) => `${getCloudinaryOptimizedSrc(src, w)} ${w}w`).join(', ');
}
