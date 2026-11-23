import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner if not dismissed before
      const dismissed = localStorage.getItem('hor_katha_pwa_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Online / Offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('hor_katha_pwa_dismissed', 'true');
  };

  return (
    <>
      {/* Offline Alert Strip (Only visible when offline) */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md sticky top-0 z-50 animate-in fade-in print:hidden">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
            <span>
              <strong>ऑफ़लाइन मोड (Offline Mode):</strong> आपका इंटरनेट कनेक्शन बंद है। Santal आ़रसी शब्दकोश, कहानियां व टूल्स सुरक्षित रूप से ऑफ़लाइन चल रहे हैं।
            </span>
          </div>
          <span className="bg-amber-800/80 px-2 py-0.5 rounded text-[10px]">लोकल कैश्ड</span>
        </div>
      )}

      {/* PWA Install Promotion Banner */}
      {showBanner && !isInstalled && (
        <div className="mx-3 sm:mx-6 my-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-amber-50 text-slate-900 border border-indigo-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-2 print:hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm flex flex-wrap items-center gap-2 text-slate-900">
                <span>फोन में ऐप इंस्टॉल करें (Install Santal आ़रसी App)</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                  बिना इंटरनेट भी चलेगा
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                १०,०००+ शब्दकोश, बाल कथाएं, वर्णमाला व सांस्कृतिक टूल्स को ऑफ़लाइन उपयोग के लिए होम स्क्रीन पर जोड़ें।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-105"
            >
              <Download className="w-3.5 h-3.5" />
              <span>इंस्टॉल करें</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
              title="बंद करें"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
