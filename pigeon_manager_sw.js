const CACHE_NAME = 'pigeon-manager-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// تثبيت Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('تم فتح الكاش');
        return cache.addAll(urlsToCache);
      })
  );
});

// تشغيل Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('حذف الكاش القديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// اعتراض طلبات الشبكة
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // إرجاع الاستجابة المحفوظة في الكاش إذا وُجدت
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // التحقق من صحة الاستجابة
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // نسخ الاستجابة
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// التعامل مع الرسائل من التطبيق الرئيسي
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// إشعار بالتحديثات المتاحة
self.addEventListener('updatefound', function() {
  console.log('تحديث جديد متاح');
});

// معالجة أخطاء الشبكة
self.addEventListener('error', function(error) {
  console.error('خطأ في Service Worker:', error);
});

// معالجة الأخطاء غير المعالجة
self.addEventListener('unhandledrejection', function(event) {
  console.error('خطأ غير معالج في Service Worker:', event.reason);
});