const CACHE='little-wins-v3';

const ASSETS=[
'./',
'./index.html',
'./manifest.webmanifest',
'./icon-192.png',
'./icon-512.png'
];

self.addEventListener('install', e => {
e.waitUntil(
caches.open(CACHE).then(cache => cache.addAll(ASSETS))
);
self.skipWaiting();
});

self.addEventListener('activate', e => {
e.waitUntil(
Promise.all([
caches.keys().then(keys =>
Promise.all(
keys
.filter(key => key !== CACHE)
.map(key => caches.delete(key))
)
),
self.clients.claim()
])
);
});

self.addEventListener('fetch', e => {
if (e.request.mode === 'navigate') {
e.respondWith(
fetch(e.request)
.then(response => {
const copy = response.clone();

caches.open(CACHE).then(cache => {
cache.put('./index.html', copy);
});

return response;
})
.catch(() => caches.match('./index.html'))
);

return;
}

e.respondWith(
caches.match(e.request).then(response =>
response || fetch(e.request)
)
);
});
