if (!self.define) {
  let e,
    s = {};
  const a = (a, c) => (
    (a = new URL(a + '.js', c).href),
    s[a] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = a), (e.onload = s), document.head.appendChild(e));
        } else ((e = a), importScripts(a), s());
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, n) => {
    const t = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[t]) return;
    let i = {};
    const r = (e) => a(e, t),
      p = { module: { uri: t }, exports: i, require: r };
    s[t] = Promise.all(c.map((e) => p[e] || r(e))).then((e) => (n(...e), i));
  };
}
define(['./workbox-9d23c89f'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: '7de3b280dafbeefa86820ac09bdbb3da' },
        { url: '/_next/static/chunks/182.35f69d94c7b5a2f3.js', revision: '35f69d94c7b5a2f3' },
        { url: '/_next/static/chunks/279.fe17f46441398548.js', revision: 'fe17f46441398548' },
        { url: '/_next/static/chunks/362-8c1d3b06ca6d4324.js', revision: 'zGpNcehUd6LySYx5mrL0O' },
        { url: '/_next/static/chunks/364-f4369d69acc0ff8f.js', revision: 'zGpNcehUd6LySYx5mrL0O' },
        { url: '/_next/static/chunks/469-b7b652193a5f2bb7.js', revision: 'zGpNcehUd6LySYx5mrL0O' },
        { url: '/_next/static/chunks/542-26d67de1dd4a10ee.js', revision: 'zGpNcehUd6LySYx5mrL0O' },
        { url: '/_next/static/chunks/567-b7bdb6d73172bf58.js', revision: 'zGpNcehUd6LySYx5mrL0O' },
        {
          url: '/_next/static/chunks/618f8807-9ab8935770a54dcb.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        { url: '/_next/static/chunks/77cbbdfc.8a51e5b80e7a8fee.js', revision: '8a51e5b80e7a8fee' },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/about/page-c0a2226601b7c817.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/ai-chat/page-eba656eeb2bd6358.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/businesses/%5Bid%5D/page-09657743ceec9495.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/businesses/poterie/page-d1ea8b1916541827.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/discover/page-57a0d29ac1de54f5.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/home/page-eb970a0024e9e5b3.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/layout-83406054bf30af44.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/map/page-6a0f20ad597446ac.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/merchant/dashboard/page-3b4dcb5e70ad9448.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/merchant/edit-profile/page-2c09974912821096.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/merchant/generate-ai/page-e98b17ebebb3e788.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/merchant/photo-manager/page-545af8ea4e493b70.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/merchant/reviews/page-585de76e721c15c9.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/merchant/setup/business/page-af6545dbcfb71d17.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/merchant/setup/contact/page-af2eac653cdd6ae0.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/merchant/setup/photos/page-2eb886a3da38fed9.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/merchant/stats/page-fe5c84fb81c99d1e.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/merchant/submitted/page-560a9955c11010f4.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/merchant/updates/page-c12ead8c10300044.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/onboarding/discover/page-81acb20d67f32055.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/onboarding/guide/page-5c0a822e9fb8acd1.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/onboarding/navigate/page-9feb8866f9ba7145.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/page-457b8076f4b3b1ea.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/profile/page-bea927ec55ebf8b0.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/rate/page-ca850e76f770e752.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/saved/page-a44a69aad4fe2d49.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/%5Blocale%5D/signup/page-ea3074f764417050.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-c3b009a6ca3fbdfc.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/layout-974b01ae06217755.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/app/page-8fef4f40aa2ff778.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/framework-748f0c0865827d8f.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        { url: '/_next/static/chunks/main-2893f45351cd96c2.js', revision: 'zGpNcehUd6LySYx5mrL0O' },
        {
          url: '/_next/static/chunks/main-app-18ef2b8b2a9c930f.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/pages/_app-f11c2271d7889283.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/pages/_error-75f8d7cb7042c79d.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-ec37d62159a503d5.js',
          revision: 'zGpNcehUd6LySYx5mrL0O',
        },
        { url: '/_next/static/css/7423d11185926f07.css', revision: '7423d11185926f07' },
        { url: '/_next/static/media/layers-2x.9859cd12.png', revision: '9859cd12' },
        { url: '/_next/static/media/layers.ef6db872.png', revision: 'ef6db872' },
        { url: '/_next/static/media/marker-icon.d577052a.png', revision: 'd577052a' },
        {
          url: '/_next/static/zGpNcehUd6LySYx5mrL0O/_buildManifest.js',
          revision: '6c42e543a47ca7da7c8cc36d94ed3927',
        },
        {
          url: '/_next/static/zGpNcehUd6LySYx5mrL0O/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/icon.svg', revision: '759f4f0eed2b3e3c929274e51c95f679' },
        { url: '/manifest.json', revision: 'd0b4abfd2b2436d47e5eb9aee936508e' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: a, state: c }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, { status: 200, statusText: 'OK', headers: s.headers })
                : s,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/static\/.*/i,
      new e.CacheFirst({
        cacheName: 'next-static',
        plugins: [new e.ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 31536e3 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https?.*\.(?:png|gif|jpg|jpeg|webp|svg)$/i,
      new e.CacheFirst({
        cacheName: 'images',
        plugins: [new e.ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 2592e3 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/api\/v1\/businesses\/\d+/i,
      new e.NetworkFirst({
        cacheName: 'api-business-details',
        networkTimeoutSeconds: 3,
        plugins: [new e.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 604800 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/api\/v1\/businesses(?:\/search)?/i,
      new e.NetworkFirst({
        cacheName: 'api-business-search',
        networkTimeoutSeconds: 3,
        plugins: [new e.ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/(en|fr|es|ar)\/businesses\/\d+$/i,
      new e.NetworkFirst({
        cacheName: 'pages-business-details',
        networkTimeoutSeconds: 3,
        plugins: [new e.ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 604800 })],
      }),
      'GET'
    ));
});
