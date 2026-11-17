import React, { useState, useEffect, useMemo } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { speakWithFemaleVoice } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  Sprout,
  Plus,
  Trash2,
  Download,
  Printer,
  Volume2
} from 'lucide-react';

interface LedgerEntry {
  id: string;
  date: string;
  season: 'खरीफ (बर्षा)' | 'रबी (शिशिर)' | 'बसंत वनोपज';
  cropSantali: string;
  type: 'income' | 'expense';
  quantityLabel: string;
  amountInr: number;
  note: string;
}

const CROP_PRESETS = [
  'होड़ो (धान)',
  'मातकोम (महुआ फूल)',
  'लुगुम / तसर कोसा',
  'सखुआ पत्ता व दातावन',
  'तुड़ी / सरसों',
  'हाट सब्ज़ी बिक्री',
  'बीज व गोबर खाद'
];

const INITIAL_ENTRIES: LedgerEntry[] = [
  {
    id: 'kl1',
    date: '2026-11-10',
    season: 'खरीफ (बर्षा)',
    cropSantali: 'होड़ो (धान)',
    type: 'expense',
    quantityLabel: 'देसी बीज व मजदूरी',
    amountInr: 2400,
    note: 'बाद खेत धान रोपाई व निराई'
  },
  {
    id: 'kl2',
    date: '2026-11-12',
    season: 'खरीफ (बर्षा)',
    cropSantali: 'होड़ो (धान)',
    type: 'income',
    quantityLabel: '5 क्विंटल',
    amountInr: 11500,
    note: 'साप्ताहिक हाट व सहकारी केंद्र बिक्री'
  },
  {
    id: 'kl3',
    date: '2026-11-14',
    season: 'बसंत वनोपज',
    cropSantali: 'मातकोम (महुआ फूल)',
    type: 'income',
    quantityLabel: '60 किग्रा सूखा',
    amountInr: 3600,
    note: 'साफ सूखा महुआ संग्रह बिक्री'
  }
];

export const SantaliKrishiCropLedger: React.FC = () => {
  const { currentUser } = useUserAuth();
  const storageKey = currentUser?.email
    ? `hor_katha_krishi_ledger_v1_${currentUser.email.toLowerCase()}`
    : 'hor_katha_krishi_ledger_v1_guest';

  const [entries, setEntries] = useState<LedgerEntry[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : INITIAL_ENTRIES;
    } catch {
      return INITIAL_ENTRIES;
    }
  });

  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [season, setSeason] = useState<LedgerEntry['season']>('खरीफ (बर्षा)');
  const [cropSantali, setCropSantali] = useState(CROP_PRESETS[0]);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [quantityLabel, setQuantityLabel] = useState('');
  const [amountInr, setAmountInr] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setEntries(JSON.parse(raw));
      else setEntries(INITIAL_ENTRIES);
    } catch {
      setEntries(INITIAL_ENTRIES);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries, storageKey]);

  const visibleEntries = useMemo(() => {
    return seasonFilter === 'all' ? entries : entries.filter((e) => e.season === seasonFilter);
  }, [entries, seasonFilter]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    visibleEntries.forEach((e) => {
      if (e.type === 'income') income += e.amountInr;
      else expense += e.amountInr;
    });
    return { income, expense, net: income - expense, count: visibleEntries.length };
  }, [visibleEntries]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amountInr);
    if (!amt || amt <= 0) return;
    const item: LedgerEntry = {
      id: `kl_${Date.now()}`,
      date,
      season,
      cropSantali,
      type,
      quantityLabel: quantityLabel.trim() || '1 इकाई',
      amountInr: amt,
      note: note.trim()
    };
    setEntries((prev) => [item, ...prev]);
    setQuantityLabel('');
    setAmountInr('');
    setNote('');
  };

  const handleExportCsv = () => {
    const header = 'Date,Season,Crop,Type,Quantity,Amount_INR,Note\n';
    const rows = visibleEntries
      .map(
        (e) =>
          `"${e.date}","${e.season}","${e.cropSantali}","${e.type}","${e.quantityLabel}",${e.amountInr},"${e.note.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `santali-krishi-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-semibold text-emerald-800">
            किसान व वनोपज हिसाब किताब · ऑफ़लाइन सहेजा गया
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            कृषि, वनोपज व हाट हिसाब डायरी (Krishi &amp; Haat Ledger)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            धान (होड़ो), महुआ, तसर, सरसों और साप्ताहिक हाट बिक्री की आय-व्यय डायरी संताली-हिन्दी में रखें व CSV/PDF निकालें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `कुल आय ${totals.income} रुपये, कुल खर्च ${totals.expense} रुपये, और शुद्ध लाभ ${totals.net} रुपये है।`,
                { autoDetectLanguage: true }
              )
            }
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>हिसाब सुनें</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-900 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV डाउनलोड</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>प्रिंट / PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">कुल हाट व फसल आय</span>
          <p className="text-2xl font-bold text-emerald-700 tabular-nums">
            ₹{totals.income.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">कुल बीज, खाद व मजदूरी खर्च</span>
          <p className="text-2xl font-bold text-rose-700 tabular-nums">
            ₹{totals.expense.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">शुद्ध बचत / लाभ</span>
          <p className={`text-2xl font-bold tabular-nums ${totals.net >= 0 ? 'text-slate-900' : 'text-rose-700'}`}>
            ₹{totals.net.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">दर्ज प्रविष्टियाँ</span>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{totals.count}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Add Transaction Form */}
        <form
          onSubmit={handleAddEntry}
          className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs print:hidden"
        >
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>नया कृषि / हाट लेन-देन दर्ज करें</span>
          </h2>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">प्रकार (आय या खर्च)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-2 rounded-lg border font-bold cursor-pointer ${
                  type === 'income'
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                + बिक्री / आय
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2 rounded-lg border font-bold cursor-pointer ${
                  type === 'expense'
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                - लागत / खर्च
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">फसल / वनोपज</label>
            <select
              value={cropSantali}
              onChange={(e) => setCropSantali(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            >
              {CROP_PRESETS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">ऋतु</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as LedgerEntry['season'])}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
              >
                <option value="खरीफ (बर्षा)">खरीफ (बर्षा)</option>
                <option value="रबी (शिशिर)">रबी (शिशिर)</option>
                <option value="बसंत वनोपज">बसंत वनोपज</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">दिनांक</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">मात्रा (जैसे 2 क्विंटल)</label>
              <input
                type="text"
                value={quantityLabel}
                onChange={(e) => setQuantityLabel(e.target.value)}
                placeholder="50 किग्रा"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">राशि (₹) *</label>
              <input
                type="number"
                required
                min={1}
                value={amountInr}
                onChange={(e) => setAmountInr(e.target.value)}
                placeholder="1500"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">विवरण / हाट नोट</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="कहाँ बेचा या किस कार्य में लगा"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>डायरी में जोड़ें</span>
          </button>
        </form>

        {/* Ledger Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">प्रविष्टियों का विवरण (Ledger Entries)</h2>
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 print:hidden"
            >
              <option value="all">सभी ऋतुएँ</option>
              <option value="खरीफ (बर्षा)">खरीफ (बर्षा)</option>
              <option value="रबी (शिशिर)">रबी (शिशिर)</option>
              <option value="बसंत वनोपज">बसंत वनोपज</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-2">दिनांक</th>
                  <th className="py-2 px-2">फसल / वनोपज</th>
                  <th className="py-2 px-2">मात्रा व विवरण</th>
                  <th className="py-2 px-2 text-right tabular-nums">राशि (₹)</th>
                  <th className="py-2 pl-2 text-right print:hidden">हटाएँ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleEntries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-2 text-slate-600 tabular-nums whitespace-nowrap">{item.date}</td>
                    <td className="py-2.5 px-2">
                      <p className="font-bold text-slate-900">{item.cropSantali}</p>
                      <p className="text-[11px] text-amber-800">{toOlChikiAuto(item.cropSantali.split('(')[0])}</p>
                    </td>
                    <td className="py-2.5 px-2 text-slate-700">
                      <p className="font-semibold">{item.quantityLabel}</p>
                      {item.note && <p className="text-[11px] text-slate-500">{item.note}</p>}
                    </td>
                    <td
                      className={`py-2.5 px-2 text-right font-bold tabular-nums whitespace-nowrap ${
                        item.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {item.type === 'income' ? '+' : '-'} ₹{item.amountInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 pl-2 text-right print:hidden">
                      <button
                        onClick={() => setEntries((prev) => prev.filter((x) => x.id !== item.id))}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="प्रविष्टि हटाएँ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
