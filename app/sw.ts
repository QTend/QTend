/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope & WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || "🚨 NEW ORDER RECEIVED";

    // Cast options to 'any' to bypass TS missing the standard 'vibrate' property
    const options: any = {
      body: data.body || "Tap to view ticket",
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [300, 100, 300, 100, 300],
      tag: "qtend-kds-order", 
      renotify: true,
      data: {
        url: data.url || "/",
      },
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error("Error rendering push notification in Serwist SW:", err);
  }
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    // Fix: Use 'readonly WindowClient[]' to match the exact return type of matchAll()
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients: readonly WindowClient[]) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});