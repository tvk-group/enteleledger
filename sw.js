/* EnteleLEDGER — secure installable-app service worker */
const CACHE_PREFIX = "enteleledger-pwa";
const CACHE_VERSION = "v3";
const SHELL_CACHE = `${CACHE_PREFIX}-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${CACHE_VERSION}`;

const CORE_ASSETS = [
  "/offline.html",
  "/manifest.webmanifest",
  "/css/style.css",
  "/css/app.css",
  "/js/i18n.js",
  "/js/main.js",
  "/js/app-i18n.js",
  "/js/app.js",
  "/js/pwa.js",
  "/assets/brand/icon.svg",
  "/assets/brand/icon-192.png",
  "/assets/brand/icon-512.png",
  "/assets/brand/maskable-512.png",
  "/assets/brand/apple-touch-icon.png",
  "/assets/brand/logo-dark.svg",
  "/assets/brand/logo-light.svg",
  "/assets/brand/mark-dark.svg",
  "/assets/brand/mark-light.svg"
];

const SENSITIVE_ROUTE =
  /^\/(?:admin|api|auth|callback|case|contact|dashboard|evidence|identity|incident|login|profile|record|register|review|secure|session|settings|upload|vault|verify|wallet|webhook)(?:\/|$|\.html$)/i;
const PUBLIC_STATIC =
  /^\/(?:assets\/(?:brand|icons|logos)\/|css\/|js\/|offline\.html$|manifest\.webmanifest$|robots\.txt$|sitemap\.xml$)/i;
const STATIC_DESTINATIONS = new Set([
  "style",
  "script",
  "image",
  "font",
  "worker"
]);

function isSensitive(url) {
  return (
    url.pathname === "/api" ||
    url.pathname.startsWith("/api/") ||
    SENSITIVE_ROUTE.test(url.pathname)
  );
}

function isPublicStatic(request, url) {
  return (
    PUBLIC_STATIC.test(url.pathname) ||
    STATIC_DESTINATIONS.has(request.destination)
  );
}

function isCacheable(response) {
  if (!response || !response.ok || response.type === "opaque") return false;
  const cacheControl = response.headers.get("cache-control") || "";
  const contentType = response.headers.get("content-type") || "";
  const vary = response.headers.get("vary") || "";
  if (/(?:no-store|private)/i.test(cacheControl)) return false;
  if (vary.trim() === "*" || response.headers.has("set-cookie")) return false;
  if (/text\/html/i.test(contentType)) return false;
  return true;
}

async function safePut(cacheName, request, response) {
  if (!isCacheable(response)) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.all(
        CORE_ASSETS.map(async (path) => {
          try {
            const request = new Request(path, {
              cache: "reload",
              credentials: "omit"
            });
            const response = await fetch(request);
            if (response.ok && response.type !== "opaque") {
              await cache.put(request, response);
            }
          } catch {
            // A temporarily unavailable public shell asset must not abort installation.
          }
        })
      );
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith(CACHE_PREFIX) &&
              ![SHELL_CACHE, RUNTIME_CACHE].includes(key)
          )
          .map((key) => caches.delete(key))
      );

      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.enable();
        } catch {
          // Navigation preload is an optional performance enhancement.
        }
      }

      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (
    request.method !== "GET" ||
    request.headers.has("authorization") ||
    request.headers.has("x-api-key")
  ) {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isSensitive(url)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preload = await event.preloadResponse;
          return preload || (await fetch(request));
        } catch {
          return (await caches.match("/offline.html")) || Response.error();
        }
      })()
    );
    return;
  }

  if (!isPublicStatic(request, url)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(request);
      const network = fetch(request).then(async (response) => {
        await safePut(RUNTIME_CACHE, request, response);
        return response;
      });

      if (cached) {
        event.waitUntil(network.catch(() => undefined));
        return cached;
      }

      try {
        return await network;
      } catch {
        return Response.error();
      }
    })()
  );
});
