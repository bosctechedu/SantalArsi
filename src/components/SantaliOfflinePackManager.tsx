import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { getOfflineCacheStats, saveWordsToIndexedDB } from '../utils/indexedDB';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  HardDrive,
  Download,
  RefreshCw,
  CheckCircle2,
  Wifi,
  WifiOff,
  Database
} from 'lucide-react';

interface StorageAudit {
  indexedDbWords: number;
  lastSyncTime: number | null;
  lexiconVersion: string | null;
  quotaMb: number | null;
  usageMb: number | null;
  cacheBuckets: string[];
  swControlled: boolean;
  isOnline: boolean;
}

export const SantaliOfflinePackManager: React.FC = () => {
  const { words } = useAdmin();
  const [audit, setAudit] = useState<StorageAudit>({
    indexedDbWords: 0,
    lastSyncTime: null,
    lexiconVersion: null,
    quotaMb: null,
    usageMb: null,
    cacheBuckets: [],
    swControlled: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
  });
  const [syncing, setSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const runAudit = async () => {
    const dbStats = await getOfflineCacheStats();
    let quotaMb: number | null = null;
    let usageMb: number | null = null;
    if (typeof navigator !== 'undefined' && navigator.storage?.estimate) {
      try {
        const est = await navigator.storage.estimate();
        if (est.quota) quotaMb = Math.round(est.quota / (1024 * 1024));
        if (est.usage !== undefined) usageMb = Number((est.usage / (1024 * 1024)).toFixed(2));
      } catch {
        // ignore
      }
    }

    let cacheBuckets: string[] = [];
    if (typeof caches !== 'undefined') {
      try {
        cacheBuckets = await caches.keys();
      } catch {
        // ignore
      }
    }

    const swControlled =
      typeof navigator !== 'undefined' &&
      'serviceWorker' in navigator &&
      Boolean(navigator.serviceWorker.controller);

    setAudit({
      indexedDbWords: dbStats.wordCount,
      lastSyncTime: dbStats.lastSyncTime,
      lexiconVersion: dbStats.lexiconVersion,
      quotaMb,
      usageMb,
      cacheBuckets,
      swControlled,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
    });
  };

  useEffect(() => {
    runAudit();
    const onNetChange = () => runAudit();
    window.addEventListener('online', onNetChange);
    window.addEventListener('offline', onNetChange);
    return () => {
      window.removeEventListener('online', onNetChange);
      window.removeEventListener('offline', onNetChange);
    };
  }, []);

  const handleSyncFullLexicon = async () => {
    setSyncing(true);
    setStatusMessage('');
    const ok = await saveWordsToIndexedDB(words);
    await runAudit();
    setSyncing(false);
    setStatusMessage(
      ok
        ? `सफलतापूर्वक ${words.length.toLocaleString()} शब्द ऑफ़लाइन IndexedDB में सुरक्षित कर दिए गए हैं।`
        : 'ऑफ़लाइन सिंक में समस्या आई — कृपया ब्राउज़र स्टोरेज अनुमतियाँ जाँचें।'
    );
  };

  const handleDownloadOfflineJsonPack = () => {
    const bundle = {
      exportedAt: new Date().toISOString(),
      suite: 'Hor Katha Suite · Rural Offline Study Pack',
      totalWords: words.length,
      olChikiSample: toOlChikiAuto('जोहार संताली'),
      words: words.slice(0, 5000).map((w) => ({
        dev: w.wordDevanagari,
        ol: toOlChikiAuto(w.wordDevanagari),
        rom: w.wordRoman,
        hi: w.meaningHindi,
        en: w.meaningEnglish,
        cat: w.category
      }))
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hor-katha-offline-study-pack-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMessage('ऑफ़लाइन अध्ययन पैक (.json) डाउनलोड हो गया है।');
  };

  const isLexiconSynced = audit.indexedDbWords >= Math.min(words.length, 500);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-emerald-800">
            ग्रामीण व कम-नेटवर्क उपयोग · वास्तविक ब्राउज़र स्टोरेज जांच
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            ऑफ़लाइन अध्ययन पैक व स्टोरेज वेरिफ़ायर (Offline Pack Manager)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            बिना इंटरनेट वाले गाँवों में पढ़ाई के लिए अपने डिवाइस की ऑफ़लाइन IndexedDB क्षमता जांचें और पूरा शब्दकोश सुरक्षित करें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={runAudit}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>स्टोरेज जांचें</span>
          </button>
          <button
            onClick={handleSyncFullLexicon}
            disabled={syncing}
            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span>{syncing ? 'सिंक हो रहा है...' : 'पूरा शब्दकोश ऑफ़लाइन सहेजें'}</span>
          </button>
          <button
            onClick={handleDownloadOfflineJsonPack}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>JSON पैक डाउनलोड</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Real Storage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">IndexedDB में सहेजे शब्द</span>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {audit.indexedDbWords.toLocaleString()} / {words.length.toLocaleString()}
          </p>
          <p className="text-xs text-slate-600">
            {isLexiconSynced ? 'ऑफ़लाइन उपयोग हेतु तैयार' : 'सिंक बटन दबाकर सहेजें'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">डिवाइस स्टोरेज उपयोग</span>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {audit.usageMb !== null ? `${audit.usageMb} MB` : 'उपलब्ध नहीं'}
          </p>
          <p className="text-xs text-slate-600 tabular-nums">
            कुल कोटा: {audit.quotaMb !== null ? `${audit.quotaMb} MB` : 'ब्राउज़र पर निर्भर'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">नेटवर्क व सर्विस वर्कर</span>
          <div className="flex items-center gap-2 text-lg font-bold text-slate-900 pt-0.5">
            {audit.isOnline ? (
              <Wifi className="w-5 h-5 text-emerald-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-amber-600" />
            )}
            <span>{audit.isOnline ? 'ऑनलाइन' : 'ऑफ़लाइन मोड'}</span>
          </div>
          <p className="text-xs text-slate-600">
            SW कैश: {audit.swControlled ? 'सक्रिय' : 'मानक ब्राउज़र सत्र'} · {audit.cacheBuckets.length} कैश
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">ओल चिकी फॉन्ट जाँच</span>
          <p className="text-2xl font-bold text-amber-800">ᱚᱞ ᱪᱤᱠᱤ · ᱡᱚᱦᱟᱨ</p>
          <p className="text-xs text-slate-600">
            अंतिम सिंक: {audit.lastSyncTime ? new Date(audit.lastSyncTime).toLocaleString('hi-IN') : 'अभी नहीं'}
          </p>
        </div>
      </div>

      {/* Checklist for Low-Network Readiness */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-emerald-700" />
          <span>ऑफ़लाइन ग्रामीण अध्ययन तैयारी जाँच-सूची</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isLexiconSynced ? 'text-emerald-600' : 'text-slate-400'}`} />
            <div>
              <p className="font-bold text-slate-900">स्थानीय शब्दकोश कैश (IndexedDB)</p>
              <p className="text-slate-600 mt-0.5">
                {audit.indexedDbWords.toLocaleString()} शब्द आपके डिवाइस की स्थायी मेमोरी में मौजूद हैं और बिना नेटवर्क खुलेंगे।
              </p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-bold text-slate-900">त्रि-लिपि और ओल चिकी इंजन</p>
              <p className="text-slate-600 mt-0.5">
                देवनागरी, रोमन और ओल चिकी रूपांतरण १००% डिवाइस के भीतर ही चलता है (कोई सर्वर निर्भरता नहीं)।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
