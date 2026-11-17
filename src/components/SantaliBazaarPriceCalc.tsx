import React, { useState, useEffect, useMemo } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { useUserAuth } from '../context/UserAuthContext';
import {
  Calculator,
  Volume2,
  Square,
  Plus,
  Trash2,
  Copy,
  Check,
  Printer,
  ShoppingBag,
  Save
} from 'lucide-react';

interface HaatItemPreset {
  id: string;
  dev: string;
  hindi: string;
  unit: string;
  defaultRate: number;
}

const HAAT_PRESETS: HaatItemPreset[] = [
  { id: 'chaole', dev: 'चावले', hindi: 'चावल', unit: 'किलो', defaultRate: 42 },
  { id: 'huru', dev: 'हूड़ू', hindi: 'धान', unit: 'किलो', defaultRate: 26 },
  { id: 'jondra', dev: 'जोंडरा', hindi: 'मक्का', unit: 'किलो', defaultRate: 30 },
  { id: 'alu', dev: 'आलू', hindi: 'आलू', unit: 'किलो', defaultRate: 28 },
  { id: 'piyaj', dev: 'पियाज', hindi: 'प्याज', unit: 'किलो', defaultRate: 40 },
  { id: 'sunum', dev: 'सुनूम', hindi: 'सरसों तेल', unit: 'लीटर', defaultRate: 145 },
  { id: 'bulung', dev: 'बुलुंग', hindi: 'नमक', unit: 'पैकेट', defaultRate: 22 },
  { id: 'matkom', dev: 'मातकोम', hindi: 'महुआ', unit: 'किलो', defaultRate: 65 },
  { id: 'sakam', dev: 'सारजोम साकाम', hindi: 'सखुआ पत्तल', unit: 'इसी (20)', defaultRate: 35 },
  { id: 'dal', dev: 'राहड़ दाल', hindi: 'अरहर दाल', unit: 'किलो', defaultRate: 130 }
];

interface BillLine {
  id: string;
  nameDev: string;
  nameHi: string;
  unit: string;
  qty: number;
  rate: number;
}

interface SavedReceipt {
  id: string;
  shopName: string;
  customerName: string;
  dateStr: string;
  total: number;
  itemsCount: number;
}

function numberToSantaliWords(n: number): string {
  const num = Math.round(n);
  if (num <= 0) return 'सुन (०)';
  const ones = ['', 'मित्', 'बार', 'पे', 'पोन', 'मोड़े', 'तुरुय', 'एयाय', 'इराल', 'आरे'];
  if (num < 10) return ones[num];
  if (num === 10) return 'गेल';
  if (num === 20) return 'मित् इसी';
  if (num < 20) return `गेल ${ones[num - 10]}`;
  if (num < 100) {
    const kodi = Math.floor(num / 20);
    const rem = num % 20;
    const kodiPart = kodi === 1 ? 'मित् इसी' : `${ones[kodi] || kodi} इसी`;
    if (rem === 0) return kodiPart;
    return `${kodiPart} ${numberToSantaliWords(rem)}`;
  }
  const hundreds = Math.floor(num / 100);
  const rem100 = num % 100;
  const hWord = hundreds < 10 ? `${ones[hundreds]} साय` : `${hundreds} साय`;
  return rem100 > 0 ? `${hWord} ${numberToSantaliWords(rem100)}` : hWord;
}

export const SantaliBazaarPriceCalc: React.FC = () => {
  const { currentUser } = useUserAuth();
  const storageKey = `hor_katha_haat_bills_${currentUser?.email || 'guest'}`;

  const [shopName, setShopName] = useState('मांझी टोला किराना व हाट दुकान');
  const [customerName, setCustomerName] = useState('ग्राहक (पेड़ा)');
  const [lines, setLines] = useState<BillLine[]>([
    { id: 'l1', nameDev: 'चावले', nameHi: 'चावल', unit: 'किलो', qty: 5, rate: 42 },
    { id: 'l2', nameDev: 'सुनूम', nameHi: 'सरसों तेल', unit: 'लीटर', qty: 1, rate: 145 }
  ]);

  const [customDev, setCustomDev] = useState('');
  const [customHi, setCustomHi] = useState('');
  const [customUnit, setCustomUnit] = useState('किलो');
  const [customQty, setCustomQty] = useState('1');
  const [customRate, setCustomRate] = useState('50');

  const [savedReceipts, setSavedReceipts] = useState<SavedReceipt[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setSavedReceipts(raw ? JSON.parse(raw) : []);
    } catch {
      setSavedReceipts([]);
    }
  }, [storageKey]);

  const totalAmount = useMemo(
    () => lines.reduce((sum, item) => sum + item.qty * item.rate, 0),
    [lines]
  );

  const kodiBreakdown = useMemo(() => {
    const rounded = Math.round(totalAmount);
    const kodi = Math.floor(rounded / 20);
    const rem = rounded % 20;
    return {
      kodi,
      rem,
      santaliWords: numberToSantaliWords(rounded)
    };
  }, [totalAmount]);

  const addPreset = (p: HaatItemPreset) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.nameDev === p.dev && l.rate === p.defaultRate);
      if (existing) {
        return prev.map((l) => (l.id === existing.id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [
        ...prev,
        {
          id: `${p.id}_${Date.now()}`,
          nameDev: p.dev,
          nameHi: p.hindi,
          unit: p.unit,
          qty: 1,
          rate: p.defaultRate
        }
      ];
    });
  };

  const addCustomLine = (e: React.FormEvent) => {
    e.preventDefault();
    const dev = customDev.trim() || customHi.trim();
    if (!dev) return;
    const qty = Math.max(0.25, parseFloat(customQty) || 1);
    const rate = Math.max(1, parseFloat(customRate) || 10);
    setLines((prev) => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        nameDev: dev,
        nameHi: customHi.trim() || dev,
        unit: customUnit,
        qty,
        rate
      }
    ]);
    setCustomDev('');
    setCustomHi('');
  };

  const updateLine = (id: string, field: 'qty' | 'rate', val: number) => {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: Math.max(0, val) } : l))
    );
  };

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  const speakBill = () => {
    const itemText = lines
      .map((l) => `${l.nameDev} ${l.qty} ${l.unit}, दाम ${Math.round(l.qty * l.rate)} टाका।`)
      .join(' ');
    const summary = `जोहार! ${shopName}। ${itemText} मोट जोतो दाम ${Math.round(totalAmount)} टाका, यानी ${kodiBreakdown.santaliWords} टाका हुय-एना।`;
    speakWithFemaleVoice(summary, { autoDetectLanguage: true });
  };

  const buildReceiptText = () => {
    const header = `${shopName}\nग्राहक: ${customerName} | दिनांक: ${new Date().toLocaleDateString('hi-IN')}\n--------------------------------`;
    const body = lines
      .map(
        (l, idx) =>
          `${idx + 1}. ${l.nameDev} (${l.nameHi}) — ${l.qty} ${l.unit} × ₹${l.rate} = ₹${(
            l.qty * l.rate
          ).toFixed(0)}`
      )
      .join('\n');
    const footer = `--------------------------------\nकुल राशि: ₹${totalAmount.toFixed(0)}\nसंताली (इसी गिनती): ${kodiBreakdown.santaliWords} टाका (${toOlChikiAuto(
      `${kodiBreakdown.santaliWords} टाका`
    )})`;
    return `${header}\n${body}\n${footer}`;
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(buildReceiptText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSaveReceipt = () => {
    if (lines.length === 0) return;
    const entry: SavedReceipt = {
      id: `rcpt_${Date.now()}`,
      shopName,
      customerName,
      dateStr: new Date().toLocaleString('hi-IN'),
      total: Math.round(totalAmount),
      itemsCount: lines.length
    };
    const next = [entry, ...savedReceipts].slice(0, 15);
    setSavedReceipts(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>हाट-बाज़ार व ग्रामीण दुकान कैलकुलेटर</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            बोलती हाट रसीद व इसी (20-इकाई) दाम कैलकुलेटर
          </h2>
          <p className="text-xs text-slate-600">
            दुकान व साप्ताहिक हाट का तुरंत बिल बनाएं — संताली देवनागरी, ओल चिकी और इसी गिनती में बोलकर रसीद सुनें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={speakBill}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>रसीद बोलकर सुनें</span>
          </button>
          <button
            type="button"
            onClick={stopSpeaking}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5" />
            <span>रोकें</span>
          </button>
        </div>
      </div>

      {/* Quick Item Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 print:hidden">
        <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-amber-600" />
          <span>हाट की प्रमुख वस्तुएँ (1-क्लिक जोड़ें)</span>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {HAAT_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => addPreset(p)}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-black text-slate-900">{p.dev}</div>
              <div className="text-[10px] text-slate-500">
                {p.hindi} · <span className="tabular-nums font-bold text-emerald-700">₹{p.defaultRate}/{p.unit}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Item Row */}
        <form onSubmit={addCustomLine} className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
          <input
            type="text"
            value={customDev}
            onChange={(e) => setCustomDev(e.target.value)}
            placeholder="संताली नाम (जैसे: उल)"
            className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          />
          <input
            type="text"
            value={customHi}
            onChange={(e) => setCustomHi(e.target.value)}
            placeholder="हिन्दी नाम (जैसे: आम)"
            className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          />
          <select
            value={customUnit}
            onChange={(e) => setCustomUnit(e.target.value)}
            className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50"
          >
            <option value="किलो">किलो (Kg)</option>
            <option value="पाइला">पाइला (Paila)</option>
            <option value="पसेरी">पसेरी (5 Kg)</option>
            <option value="लीटर">लीटर</option>
            <option value="इसी (20)">इसी (20 पीस)</option>
            <option value="गोटा">गोटा (पीस)</option>
          </select>
          <input
            type="number"
            step="0.25"
            min="0.25"
            value={customQty}
            onChange={(e) => setCustomQty(e.target.value)}
            placeholder="मात्रा"
            className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 tabular-nums"
          />
          <input
            type="number"
            min="1"
            value={customRate}
            onChange={(e) => setCustomRate(e.target.value)}
            placeholder="दर ₹"
            className="px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 tabular-nums"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>जोड़ें</span>
          </button>
        </form>
      </div>

      {/* Live Receipt Table + Santali Total */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-600 block mb-1">दुकान / हाट का नाम</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">ग्राहक का नाम</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-700">
                <th className="py-2 px-2">वस्तु (संताली देवनागरी · ओल चिकी)</th>
                <th className="py-2 px-2">इकाई</th>
                <th className="py-2 px-2">मात्रा</th>
                <th className="py-2 px-2">दर (₹)</th>
                <th className="py-2 px-2 text-right">राशि (₹)</th>
                <th className="py-2 px-2 print:hidden" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lines.map((l) => (
                <tr key={l.id}>
                  <td className="py-2 px-2">
                    <div className="font-black text-slate-900">{l.nameDev}</div>
                    <div className="text-[11px] text-amber-800 font-semibold">
                      {toOlChikiAuto(l.nameDev)} · {l.nameHi}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-slate-600">{l.unit}</td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      value={l.qty}
                      onChange={(e) => updateLine(l.id, 'qty', parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 font-bold tabular-nums"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      min="0"
                      value={l.rate}
                      onChange={(e) => updateLine(l.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 font-bold tabular-nums"
                    />
                  </td>
                  <td className="py-2 px-2 text-right font-black text-slate-900 tabular-nums">
                    ₹{(l.qty * l.rate).toFixed(0)}
                  </td>
                  <td className="py-2 px-2 text-right print:hidden">
                    <button
                      type="button"
                      onClick={() => removeLine(l.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="हटाएँ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
              संताली कुल दाम (इसी व शब्दों में)
            </span>
            <p className="text-base font-black text-slate-900">{kodiBreakdown.santaliWords} टाका</p>
            <p className="text-sm font-bold text-amber-800">{toOlChikiAuto(`${kodiBreakdown.santaliWords} टाका`)}</p>
            <p className="text-[11px] text-slate-600 tabular-nums">
              {kodiBreakdown.kodi} इसी (×20) + {kodiBreakdown.rem} खुले रुपये
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-slate-500 block">कुल देय राशि</span>
            <span className="text-3xl font-black text-emerald-800 tabular-nums">
              ₹{totalAmount.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handleSaveReceipt}
            className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>हिसाब सेव करें</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'रसीद कॉपी हुई!' : 'WhatsApp रसीद कॉपी'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>प्रिंट रसीद</span>
          </button>
        </div>
      </div>

      {/* Saved Receipts */}
      {savedReceipts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 print:hidden">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
            हाल ही की सहेजी गई हाट रसीदें ({savedReceipts.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {savedReceipts.map((r) => (
              <div key={r.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{r.customerName}</div>
                  <div className="text-[10px] text-slate-500">{r.dateStr} · {r.itemsCount} वस्तु</div>
                </div>
                <span className="font-black text-emerald-800 tabular-nums">₹{r.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
