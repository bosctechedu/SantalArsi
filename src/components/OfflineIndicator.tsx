import React, { useState, useEffect } from 'react';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Wifi, WifiOff, Download, Database, CheckCircle2, Share, X } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, cachedWordsCount } = useOfflineStatus();
  const { canInstall, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [dismissBanner, setDismissBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [swReady, setSwReady] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hor_katha_sw_offline_ready') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const onSwReady = () => setSwReady(true);
    window.addEventListener('hor-katha-sw-ready', onSwReady);
    return () => window.removeEventListener('hor-katha-sw-ready', onSwReady);
  }, []);

  return (
    <>
      {/* Offline Alert Strip when disconnected */}
      {!isOnline && !dismissBanner && (
        <div className="bg-amber-50 border-b border-amber-300 text-amber-950 px-3 sm:px-6 py-2 text-xs flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-700 animate-pulse shrink-0" />
            <span>
              <strong>ऑफ़लाइन मोड सक्रिय (Offline Active):</strong> बिना इंटरनेट के भी{' '}
              <strong className="text-emerald-800">
                {cachedWordsCount > 0 ? `${cachedWordsCount.toLocaleString()}+ शब्द` : 'सभी मॉड्यूल'}
              </strong>{' '}
              व कीबोर्ड लोकल IndexedDB व Service Worker से सुचारु चल रहे हैं।
            </span>
          </div>
          <button
            onClick={() => setDismissBanner(true)}
            className="text-amber-700 hover:text-amber-950 hover:bg-amber-100 p-1 rounded transition-colors cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Status & PWA Install Controls in Header Utility Bar */}
      <div className="flex items-center gap-1.5">
        <div
          className={`flex items-center gap-1.5 px-2.5 h-8 rounded-xl border transition-all text-xs font-semibold whitespace-nowrap ${
            isOnline
              ? 'bg-emerald-50 border-emerald-200/90 text-emerald-800'
              : 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse'
          }`}
          title={
            isOnline
              ? `Online · ${cachedWordsCount > 0 ? cachedWordsCount.toLocaleString() + ' words cached offline' : 'Offline cache active'}${swReady ? ' · PWA Ready' : ''}`
              : `Offline · ${cachedWordsCount.toLocaleString()} words loaded from IndexedDB`
          }
        >
          {isOnline ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          )}
          <span className="font-bold">
            {isOnline ? 'Online' : 'Offline'}
          </span>
          {cachedWordsCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] bg-emerald-100/80 text-emerald-900 px-1.5 py-0.5 rounded-md font-bold">
              <Database className="w-2.5 h-2.5 text-emerald-700" />
              <span>{cachedWordsCount >= 1000 ? `${(cachedWordsCount / 1000).toFixed(0)}k+` : cachedWordsCount}</span>
            </span>
          )}
        </div>

        {/* Chromium / Android / Desktop PWA Install */}
        {canInstall && (
          <button
            onClick={() => promptInstall()}
            className="h-8 px-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-2xs transition-all flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer border border-emerald-500/40 whitespace-nowrap"
            title="Install Santal आ़रसी App on Device"
            aria-label="Install App"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Install App</span>
          </button>
        )}

        {/* iOS Safari Fallback Install Button */}
        {!canInstall && !isInstalled && isIOS && (
          <button
            onClick={() => setShowIOSGuide(true)}
            className="h-8 px-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer whitespace-nowrap"
            title="Install on iPhone / iPad"
          >
            <Share className="w-3.5 h-3.5" />
            <span>Install iOS</span>
          </button>
        )}

        {(isInstalled || swReady) && !canInstall && (
          <div
            className="h-8 px-2 rounded-xl flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-2xs whitespace-nowrap"
            title="PWA Offline & Online Ready"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isInstalled ? 'Installed' : 'PWA Ready'}</span>
          </div>
        )}
      </div>

      {/* iOS Safari Installation Instructions Modal */}
      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 text-slate-900 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold">Install Santal आ़रसी on iPhone / iPad</h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ol className="text-xs text-slate-700 space-y-2 list-decimal pl-4">
              <li>Safari टूलबार में नीचे <strong>Share (↑)</strong> बटन पर टैप करें।</li>
              <li>नीचे स्क्रॉल करके <strong>Add to Home Screen</strong> चुनें।</li>
              <li>ऊपर दाईं ओर <strong>Add</strong> दबाएं — ऐप ऑफ़लाइन भी चलेगा!</li>
            </ol>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer"
            >
              समझ गया (Close)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
