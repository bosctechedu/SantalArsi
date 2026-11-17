import React, { useState, useRef } from 'react';
import { Shield, Download, Upload, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface StorageEntrySummary {
  key: string;
  label: string;
  sizeBytes: number;
  previewCount: string;
}

const KNOWN_LABELS: Record<string, string> = {
  hor_katha_recent_tabs: 'हाल ही में खोले गए मॉड्यूल (Recent Tabs)',
  hor_katha_pinboard: 'शब्द पिनबोर्ड नोट्स (Pinboard Notes)',
  hor_katha_streak: 'दैनिक अभ्यास स्ट्रीक व लक्ष्य (Streak Tracker)',
  hor_katha_favorites: 'इञाक् साकाम पसंदीदा शब्द (Favorites)',
  hor_katha_match_best: 'शब्द-मिलान खेल सर्वश्रेष्ठ समय (Match Best Time)'
};

function inspectAppStorage(): StorageEntrySummary[] {
  const entries: StorageEntrySummary[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (!key.startsWith('hor_katha') && !key.startsWith('santali')) continue;
      const raw = localStorage.getItem(key) || '';
      let previewCount = `${raw.length} अक्षर`;
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) previewCount = `${parsed.length} आइटम`;
        else if (typeof parsed === 'object' && parsed !== null)
          previewCount = `${Object.keys(parsed).length} फ़ील्ड`;
      } catch {
        // plain string value
      }
      entries.push({
        key,
        label: KNOWN_LABELS[key] || key,
        sizeBytes: new Blob([raw]).size,
        previewCount
      });
    }
  } catch {
    // ignore storage restriction
  }
  return entries;
}

export const SantaliDataBackupManager: React.FC = () => {
  const [entries, setEntries] = useState<StorageEntrySummary[]>(() => inspectAppStorage());
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmClearKey, setConfirmClearKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = () => setEntries(inspectAppStorage());

  const totalBytes = entries.reduce((acc, item) => acc + item.sizeBytes, 0);

  const handleExportJson = () => {
    try {
      const payload: Record<string, string> = {};
      for (const entry of entries) {
        const val = localStorage.getItem(entry.key);
        if (val !== null) payload[entry.key] = val;
      }
      const blob = new Blob(
        [
          JSON.stringify(
            {
              app: 'Hor Katha Suite',
              exportedAt: new Date().toISOString(),
              data: payload
            },
            null,
            2
          )
        ],
        { type: 'application/json' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hor-katha-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage({ type: 'success', text: 'बैकअप JSON फ़ाइल सफलतापूर्वक डाउनलोड की गई।' });
    } catch {
      setStatusMessage({ type: 'error', text: 'बैकअप निर्यात करने में समस्या आई।' });
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        const dataMap = parsed.data && typeof parsed.data === 'object' ? parsed.data : parsed;
        let restored = 0;
        for (const [k, v] of Object.entries(dataMap)) {
          if ((k.startsWith('hor_katha') || k.startsWith('santali')) && typeof v === 'string') {
            localStorage.setItem(k, v);
            restored++;
          }
        }
        refresh();
        setStatusMessage({
          type: 'success',
          text: `${restored} सुरक्षित डेटा अनुभाग सफलतापूर्वक रिस्टोर किए गए।`
        });
      } catch {
        setStatusMessage({ type: 'error', text: 'अमान्य बैकअप फ़ाइल। कृपया सही JSON फ़ाइल चुनें।' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleRemoveKey = (key: string) => {
    try {
      localStorage.removeItem(key);
      setConfirmClearKey(null);
      refresh();
      setStatusMessage({ type: 'success', text: `"${KNOWN_LABELS[key] || key}" डेटा साफ़ किया गया।` });
    } catch {
      setStatusMessage({ type: 'error', text: 'डेटा हटाने में त्रुटि।' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <Shield className="w-4 h-4" />
              <span>सुरक्षित डेटा बैकअप एवं रिस्टोर केंद्र</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              डेटा बैकअप व रिस्टोर मैनेजर (Local Storage Sync)
            </h1>
            <p className="text-sm text-slate-600">
              अपने शब्द पिनबोर्ड, स्ट्रीक इतिहास, पसंदीदा नोट्स व अभ्यास स्कोर का JSON बैकअप सुरक्षित रखें या दूसरे ब्राउज़र में रिस्टोर करें।
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-slate-500">सहेजा गया कुल आकार</div>
            <div className="text-lg font-mono tabular-nums font-bold text-slate-900">
              {(totalBytes / 1024).toFixed(2)} KB
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportJson}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>बैकअप डाउनलोड करें (Export JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>फ़ाइल से रिस्टोर करें (Import JSON)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>

          <button
            onClick={refresh}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
          >
            सूची रिफ्रेश करें
          </button>
        </div>

        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Stored Entries Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">ब्राउज़र में सहेजे गए अनुभाग ({entries.length})</h2>
          </div>

          {entries.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              अभी कोई स्थानीय डेटा सहेजा नहीं गया है। जैसे ही आप पिनबोर्ड, स्ट्रीक ट्रैकर या हाल के मॉड्यूल उपयोग करेंगे, वे यहाँ दिखाई देंगे।
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <div
                  key={entry.key}
                  className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{entry.label}</div>
                    <div className="text-slate-500 font-mono">
                      {entry.key} · {entry.previewCount} · {entry.sizeBytes} bytes
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {confirmClearKey === entry.key ? (
                      <>
                        <button
                          onClick={() => handleRemoveKey(entry.key)}
                          className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold cursor-pointer"
                        >
                          पुष्टि करें (हटाएँ)
                        </button>
                        <button
                          onClick={() => setConfirmClearKey(null)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-semibold cursor-pointer"
                        >
                          रद्द करें
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmClearKey(entry.key)}
                        className="px-2.5 py-1.5 text-rose-700 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>साफ़ करें</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
