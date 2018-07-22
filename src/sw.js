importScripts('workbox-sw.prod.v2.1.2.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "css/style.css",
    "revision": "0d39a19b0556e37e10846e864bd5a8ba"
  },
  {
    "url": "fonts/cryptocoins-colors.css",
    "revision": "0223bc8ad5cf0d6e8b71ec9d424bd9ab"
  },
  {
    "url": "fonts/cryptocoins.css",
    "revision": "d94c8ff1c51b80d1e7e242270917ad72"
  },
  {
    "url": "index.html",
    "revision": "19a5eb8f880cf8336dbfab4284e665d5"
  },
  {
    "url": "js/index.js",
    "revision": "19653c0145a65691fde401f3e584b8f3"
  }
];

const workboxSW = new self.WorkboxSW({
  "skipWaiting": true,
  "clientsClaim": true
});
workboxSW.precache(fileManifest);
