/// <reference lib="webworker" />

import { defaultCache } from '@serwist/next/worker';
import {
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  Serwist,
  type PrecacheEntry,
  type RuntimeCaching,
  type SerwistGlobalConfig,
} from 'serwist';

type ServiceWorkerWithManifest = ServiceWorkerGlobalScope &
  SerwistGlobalConfig & {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  };

declare const self: ServiceWorkerWithManifest;

const appRuntimeCaching: RuntimeCaching[] = [
  {
    matcher: /\/_next\/static\/.*/i,
    handler: new CacheFirst({
      cacheName: 'next-static',
      plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 })],
    }),
  },
  {
    matcher: /^https?.*\.(?:png|gif|jpg|jpeg|webp|svg)$/i,
    handler: new CacheFirst({
      cacheName: 'images',
      plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 })],
    }),
  },
  {
    matcher: /\/api\/v1\/businesses\/\d+/i,
    handler: new NetworkFirst({
      cacheName: 'api-business-details',
      networkTimeoutSeconds: 3,
      plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 })],
    }),
  },
  {
    matcher: /\/api\/v1\/businesses(?:\/search)?/i,
    handler: new NetworkFirst({
      cacheName: 'api-business-search',
      networkTimeoutSeconds: 3,
      plugins: [new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 })],
    }),
  },
  {
    matcher: /\/(en|fr|es|ar)\/businesses\/\d+$/i,
    handler: new NetworkFirst({
      cacheName: 'pages-business-details',
      networkTimeoutSeconds: 3,
      plugins: [new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 7 })],
    }),
  },
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [...appRuntimeCaching, ...defaultCache],
});

serwist.addEventListeners();
