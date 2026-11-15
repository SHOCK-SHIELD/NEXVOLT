/**
 * ShockShield - Service Worker
 * Offline support and caching strategy for PWA
 */

const CACHE_NAME = 'shockshield-v1.0.0';
const STATIC_CACHE = 'shockshield-static-v1';
const DYNAMIC_CACHE = 'shockshield-dynamic-v1';
const IMAGE_CACHE = 'shockshield-images-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/index.html',
  '/register.html',
  '/login.html',
  '/forgot-password.html',
  '/feed.html',
  '/map.html',
  '/styles/main.css',
  '/styles/landing.css',
  '/styles/auth.css',
  '/styles/feed.css',
  '/styles/map.css',
  '/js/main.js',
  '/js/particles.js',
  '/js/landing.js',
  '/js/auth.js',
  '/js/feed.js',
  '/js/map.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syncopate:wght@400;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { credentials: 'same-origin' })));
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('[SW] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== IMAGE_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Handle different resource types
  if (isImageRequest(request)) {
    event.respondWith(imageCacheStrategy(request));
  } else if (isFontRequest(request)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else if (isMapTileRequest(request)) {
    event.respondWith(cacheFirstStrategy(request, DYNAMIC_CACHE));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirstStrategy(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache strategies
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

async function networkFirstStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    return new Response(JSON.stringify({ error: 'Offline', message: 'No cached data available' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

async function imageCacheStrategy(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    // Serve from cache, update in background
    fetch(request).then((response) => {
      if (response.ok) cache.put(request, response);
    }).catch(() => {});
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return placeholder for failed images
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225"><rect fill="#1A2332" width="400" height="225"/><text fill="#64748B" font-family="system-ui" font-size="14" x="50%" y="50%" text-anchor="middle" dominant-baseline="middle">Image unavailable offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Request type detectors
function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg|ico|avif)(\?.*)?$/i.test(request.url);
}

function isFontRequest(request) {
  return request.destination === 'font' ||
         /\.(woff|woff2|ttf|eot|otf)(\?.*)?$/i.test(request.url);
}

function isMapTileRequest(request) {
  return request.url.includes('tile.openstreetmap.org') ||
         request.url.includes('basemaps.cartocdn.com') ||
         request.url.includes('arcgisonline.com');
}

function isAPIRequest(request) {
  return request.url.includes('/api/') || 
         request.url.includes('.json') ||
         request.headers.get('Accept')?.includes('application/json');
}

// Background sync for offline reports
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncReports());
  }
});

async function syncReports() {
  // In a real app, this would sync pending reports from IndexedDB
  console.log('[SW] Syncing pending reports...');
  
  try {
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('[SW] Reports synced successfully');
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New hazard alert in your area',
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/badge-72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'hazard-alert',
    data: data.url || '/map.html',
    actions: [
      { action: 'view', title: 'View on Map' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    requireInteraction: data.priority === 'critical'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'ShockShield Alert', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/map.html')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => cache.addAll(event.data.urls))
    );
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => 
        Promise.all(names.map((name) => caches.delete(name)))
      )
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-hazards') {
    event.waitUntil(updateHazardCache());
  }
});

async function updateHazardCache() {
  // In a real app, this would fetch latest hazard data
  console.log('[SW] Periodic hazard data update');
}

console.log('[SW] Service Worker loaded');