import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

if (import.meta.env.PROD) {
  // Register Service Worker in production (Cloudflare Pages / PWA)
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateSW(true);
    },
    onOfflineReady() {
      try {
        localStorage.setItem('hor_katha_sw_offline_ready', 'true');
        window.dispatchEvent(new CustomEvent('hor-katha-sw-ready'));
      } catch {
        // ignore
      }
    }
  });
} else if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  // In Vite dev server, unregister any stale dev Service Worker so optimized React chunks never conflict
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => Promise.all(registrations.map((reg) => reg.unregister())))
    .catch(() => {});
  if ('caches' in window) {
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.includes('workbox') || name.includes('hor-katha'))
            .map((name) => caches.delete(name))
        )
      )
      .catch(() => {});
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
