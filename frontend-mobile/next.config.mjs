/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";
import nextPWA from "next-pwa";

const runtimeCaching = [
  {
    urlPattern: /\/_next\/static\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "next-static",
      expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
    },
  },
  {
    urlPattern: /^https?.*\.(?:png|gif|jpg|jpeg|webp|svg)$/i,
    handler: "CacheFirst",
    options: {
      cacheName: "images",
      expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
    },
  },
  {
    urlPattern: /\/api\/v1\/businesses\/\d+/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "api-business-details",
      networkTimeoutSeconds: 3,
      expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
    },
  },
  {
    urlPattern: /\/api\/v1\/businesses(?:\/search)?/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "api-business-search",
      networkTimeoutSeconds: 3,
      expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 },
    },
  },
  {
    urlPattern: /\/(en|fr|es|ar)\/businesses\/\d+$/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "pages-business-details",
      networkTimeoutSeconds: 3,
      expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 7 },
    },
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=31536000",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/],
  cleanupOutdatedCaches: true,
});

export default withPWA(withNextIntl(nextConfig));
