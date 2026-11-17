import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Volume2,
  Calendar,
  IndianRupee,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface HaatItem {
  id: string;
  santali: string;
  hindi: string;
  english?: string;
  qty: string;
  estPrice: number;
  category: 'पूजा सामग्री' | 'रसोई व अन्न' | 'वस्त्र व श्रृंगार' | 'वाद्य व सजावट';
  bought: boolean;
}

interface FestivalPreset {
  id: string;
  titleSantali: string;
  titleHindi: string;
  season: string;
  description: string;
  items: Omit<HaatItem, 'id' | 'bought'>[];
}

const PRESETS: FestivalPreset[] = [
  {
    id: 'sohrai',
    titleSantali: 'सोहराय पोरोब हाट सूची',
    titleHindi: 'सोहराय महापर्व बाज़ार लिस्ट',
    season: 'पूस माह (जनवरी)',
    description: 'गाय-बैल पूजन, पीठा, और अखड़ा उत्सव की संपूर्ण हाट सामग्री।',
    items: [
      { santali: 'अदवा चावले (अरवा चावल)', hindi: 'अरवा चावल (पीठा व चौक के लिए)', qty: '5 किग्रा', estPrice: 260, category: 'रसोई व अन्न' },
      { santali: 'सुनुम आर सिंदूर', hindi: 'सरसों तेल व सिंदूर (गोरैया पूजन)', qty: '1 सेट', estPrice: 120, category: 'पूजा सामग्री' },
      { santali: 'ताड़ी / हंड़िया राणु', hindi: 'राणु जड़ी (पारंपरिक पेय हेतु)', qty: '6 नग', estPrice: 90, category: 'पूजा सामग्री' },
      { santali: 'लुगरी / पांची कापड़ा', hindi: 'नया पांची-पड़हाण वस्त्र', qty: '2 जोड़ी', estPrice: 1200, category: 'वस्त्र व श्रृंगार' },
      { santali: 'लेटो व गुड़ पीठा सामग्री', hindi: 'गुड़, तिल व बेसन', qty: '2 किग्रा', estPrice: 220, category: 'रसोई व अन्न' },
      { santali: 'गाय-डांगरा माला (बाबा-रस्सी)', hindi: 'नया पगहा व घंटी', qty: '2 नग', estPrice: 180, category: 'वाद्य व सजावट' }
    ]
  },
  {
    id: 'baha',
    titleSantali: 'बाहा पोरोब हाट सूची',
    titleHindi: 'बाहा (फूल पर्व) बाज़ार लिस्ट',
    season: 'फागुन (फरवरी–मार्च)',
    description: 'जाहेर थान में सखुआ-महुआ अर्पण व प्रकृति वंदना की तैयारी।',
    items: [
      { santali: 'नावा साड़्गी (नया सूप व टोकरी)', hindi: 'बाँस का नया सूप (हाटाक्)', qty: '2 नग', estPrice: 160, category: 'पूजा सामग्री' },
      { santali: 'सखुआ साकाम आर बाहा', hindi: 'सखुआ पत्ता दोना व फूल', qty: '1 गड्डी', estPrice: 50, category: 'पूजा सामग्री' },
      { santali: 'अरवा चावले व धूना', hindi: 'धूप-धुना व अरवा चावल', qty: '2 किग्रा', estPrice: 150, category: 'पूजा सामग्री' },
      { santali: 'पियड़ / सफेद पांची साड़ी', hindi: 'पीले किनारी वाली सफेद साड़ी', qty: '1 नग', estPrice: 650, category: 'वस्त्र व श्रृंगार' },
      { santali: 'तुम्दाक् आर टामक रस्सी', hindi: 'मांदर व नगाड़ा कसने की बद्धी', qty: '1 सेट', estPrice: 200, category: 'वाद्य व सजावट' }
    ]
  },
  {
    id: 'bapla',
    titleSantali: 'बापला (विवाह) नेवता व हाट',
    titleHindi: 'संताली विवाह रस्म बाज़ार लिस्ट',
    season: 'विवाह ऋतु',
    description: 'मड़वा सजावट, सिंदूरदान, बारात स्वागत और नेवता भोज की सामग्री।',
    items: [
      { santali: 'सारजोम मड़वा साकाम', hindi: 'मड़वा छाजन हेतु सखुआ डाली', qty: '20 डाली', estPrice: 150, category: 'वाद्य व सजावट' },
      { santali: 'बापला सिंदूर व काजल', hindi: 'विवाह सिंदूर डिबिया व दर्पण', qty: '1 सेट', estPrice: 140, category: 'पूजा सामग्री' },
      { santali: 'कांसा बाटी आर लोटा', hindi: 'कांसे की थाली-लोटा (गोड़ दोहाय)', qty: '2 सेट', estPrice: 950, category: 'पूजा सामग्री' },
      { santali: 'दाल-चावल आर मसाला', hindi: 'सामुदायिक भोज राशन', qty: '25 किग्रा', estPrice: 2100, category: 'रसोई व अन्न' },
      { santali: 'आतेन-पांची उपहार वस्त्र', hindi: 'सगे-संबंधियों हेतु वस्त्र (बांदिया)', qty: '5 नग', estPrice: 2500, category: 'वस्त्र व श्रृंगार' }
    ]
  },
  {
    id: 'weekly_haat',
    titleSantali: 'साप्ताहिक गांव हाट (हटिया)',
    titleHindi: 'साप्ताहिक ग्रामीण हाट टोकरी',
    season: 'हर सप्ताह',
    description: 'रोज़मर्रा की ग्रामीण रसोई, वनोपज और घरेलू ज़रूरत की चीज़ें।',
    items: [
      { santali: 'माड़वा आर बाजरु आटा', hindi: 'मड़ुआ / रागी आटा', qty: '2 किग्रा', estPrice: 110, category: 'रसोई व अन्न' },
      { santali: 'अड़ाक् साक (केंदु/बथुआ साग)', hindi: 'ताज़ा जंगली साग व कोयनाड़', qty: '3 गड्डी', estPrice: 60, category: 'रसोई व अन्न' },
      { santali: 'कुसुम / महुआ तेल', hindi: 'कोल्हू का तेल', qty: '1 लीटर', estPrice: 190, category: 'रसोई व अन्न' },
      { santali: 'माटी चुक्का आर घडिया', hindi: 'मिट्टी का घड़ा व हंडिया बर्तन', qty: '2 नग', estPrice: 130, category: 'वाद्य व सजावट' }
    ]
  }
];

const STORAGE_KEY = 'hor_katha_haat_planner_v1';

export const SantaliHaatFestivalPlanner: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sohrai');
  const [listsByPreset, setListsByPreset] = useState<Record<string, HaatItem[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage errors
    }
    const init: Record<string, HaatItem[]> = {};
    PRESETS.forEach((p) => {
      init[p.id] = p.items.map((it, idx) => ({
        ...it,
        id: `${p.id}-${idx}`,
        bought: false
      }));
    });
    return init;
  });

  const [newSantali, setNewSantali] = useState('');
  const [newHindi, setNewHindi] = useState('');
  const [newQty, setNewQty] = useState('1 नग');
  const [newPrice, setNewPrice] = useState('100');
  const [newCategory, setNewCategory] = useState<HaatItem['category']>('पूजा सामग्री');
  const [filterCat, setFilterCat] = useState<string>('ALL');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(listsByPreset));
    } catch {
      // ignore
    }
  }, [listsByPreset]);

  const activePreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];
  const currentItems = useMemo(
    () => listsByPreset[selectedPresetId] || [],
    [listsByPreset, selectedPresetId]
  );

  const visibleItems = useMemo(
    () =>
      filterCat === 'ALL'
        ? currentItems
        : currentItems.filter((item) => item.category === filterCat),
    [currentItems, filterCat]
  );

  const stats = useMemo(() => {
    const total = currentItems.reduce((acc, it) => acc + (Number(it.estPrice) || 0), 0);
    const spent = currentItems
      .filter((it) => it.bought)
      .reduce((acc, it) => acc + (Number(it.estPrice) || 0), 0);
    const boughtCount = currentItems.filter((it) => it.bought).length;
    return { total, spent, boughtCount, count: currentItems.length };
  }, [currentItems]);

  const toggleItem = (id: string) => {
    setListsByPreset((prev) => ({
      ...prev,
      [selectedPresetId]: (prev[selectedPresetId] || []).map((it) =>
        it.id === id ? { ...it, bought: !it.bought } : it
      )
    }));
  };

  const deleteItem = (id: string) => {
    setListsByPreset((prev) => ({
      ...prev,
      [selectedPresetId]: (prev[selectedPresetId] || []).filter((it) => it.id !== id)
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSantali.trim() && !newHindi.trim()) return;
    const item: HaatItem = {
      id: `${selectedPresetId}-custom-${Date.now()}`,
      santali: newSantali.trim() || newHindi.trim(),
      hindi: newHindi.trim() || newSantali.trim(),
      english: 'Custom item',
      qty: newQty.trim() || '1 नग',
      estPrice: Math.max(0, Number(newPrice) || 0),
      category: newCategory,
      bought: false
    };
    setListsByPreset((prev) => ({
      ...prev,
      [selectedPresetId]: [...(prev[selectedPresetId] || []), item]
    }));
    setNewSantali('');
    setNewHindi('');
    setNewQty('1 नग');
    setNewPrice('100');
  };

  const handleResetPreset = () => {
    setListsByPreset((prev) => ({
      ...prev,
      [selectedPresetId]: activePreset.items.map((it, idx) => ({
        ...it,
        id: `${activePreset.id}-${idx}-${Date.now()}`,
        bought: false
      }))
    }));
  };

  const handleSpeakChecklist = () => {
    const remaining = currentItems.filter((it) => !it.bought);
    const listToSpeak = remaining.length > 0 ? remaining : currentItems;
    const text = `${activePreset.titleSantali}. ` +
      listToSpeak.map((it) => `${it.santali}, ${it.qty}`).join('. ');
    speakWithFemaleVoice(text, { autoDetectLanguage: true });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-slate-50 min-h-screen text-slate-900">
      {/* Header */}
      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>सांस्कृतिक हाट व पर्व बजट प्लानर</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            हाट व पर्व सामग्री प्लानर (Haat & Festival Planner)
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            सोहराय, बाहा, बापला और साप्ताहिक हटिया की खरीदारी, अनुमानित खर्च और चेकलिस्ट संभालें।
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSpeakChecklist}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-sm transition"
          >
            <Volume2 className="w-4 h-4" />
            <span>बची सूची सुनें</span>
          </button>
          <button
            onClick={handleResetPreset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>रीसेट करें</span>
          </button>
        </div>
      </div>

      {/* Festival Preset Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRESETS.map((preset) => {
          const active = preset.id === selectedPresetId;
          const presetItems = listsByPreset[preset.id] || [];
          const done = presetItems.filter((i) => i.bought).length;
          return (
            <button
              key={preset.id}
              onClick={() => setSelectedPresetId(preset.id)}
              className={`text-left p-4 rounded-2xl border transition ${
                active
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-200 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-amber-700 mb-1">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {preset.season}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-amber-200">
                  {done}/{presetItems.length}
                </span>
              </div>
              <div className="font-bold text-slate-900 text-base">{preset.titleSantali}</div>
              <div className="text-xs text-slate-600 mt-0.5">{preset.titleHindi}</div>
            </button>
          );
        })}
      </div>

      {/* Budget & Progress Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">खरीदे गए आइटम</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">
              {stats.boughtCount} / {stats.count}
            </p>
          </div>
          <CheckCircle2 className="w-9 h-9 text-emerald-500" />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">खर्च हो चुकी राशि</p>
            <p className="text-2xl font-extrabold text-amber-700 mt-1">₹ {stats.spent}</p>
          </div>
          <IndianRupee className="w-9 h-9 text-amber-500" />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">कुल अनुमानित बजट</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">₹ {stats.total}</p>
          </div>
          <Sparkles className="w-9 h-9 text-indigo-500" />
        </div>
      </div>

      {/* Main Content Split: Checklist + Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{activePreset.titleSantali}</h2>
              <p className="text-xs text-slate-500">{activePreset.description}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'पूजा सामग्री', 'रसोई व अन्न', 'वस्त्र व श्रृंगार', 'वाद्य व सजावट'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                    filterCat === cat
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'ALL' ? 'सभी' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition ${
                  item.bought
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="flex items-start gap-3 text-left flex-1 min-w-0"
                >
                  {item.bought ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <div
                      className={`font-bold text-sm sm:text-base ${
                        item.bought ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {item.santali}
                    </div>
                    <div className="text-xs text-slate-600">
                      {item.hindi} • <span className="font-semibold text-amber-700">{item.qty}</span> •{' '}
                      <span className="text-slate-500">{item.category}</span>
                    </div>
                  </div>
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                    ₹{item.estPrice}
                  </span>
                  <button
                    onClick={() => speakWithFemaleVoice(`${item.santali}. ${item.hindi}. ${item.qty}`, { autoDetectLanguage: true })}
                    className="p-2 rounded-lg text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition"
                    title="सुनें"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                    title="हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {visibleItems.length === 0 && (
              <p className="text-center py-8 text-sm text-slate-500">
                इस श्रेणी में कोई सामग्री नहीं है। दाईं ओर से नया आइटम जोड़ें।
              </p>
            )}
          </div>
        </div>

        {/* Add Custom Item Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 h-fit space-y-4">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-600" />
            <span>नई सामग्री जोड़ें</span>
          </h3>
          <form onSubmit={handleAddItem} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                संताली नाम (Devanagari / Roman)
              </label>
              <input
                type="text"
                value={newSantali}
                onChange={(e) => setNewSantali(e.target.value)}
                placeholder="उदा. सारजोम साकाम"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                हिंदी अर्थ / विवरण
              </label>
              <input
                type="text"
                value={newHindi}
                onChange={(e) => setNewHindi(e.target.value)}
                placeholder="उदा. सखुआ पत्ता बंडल"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">मात्रा</label>
                <input
                  type="text"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  placeholder="2 किग्रा"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">अनुमानित मूल्य (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">श्रेणी</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as HaatItem['category'])}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="पूजा सामग्री">पूजा सामग्री</option>
                <option value="रसोई व अन्न">रसोई व अन्न</option>
                <option value="वस्त्र व श्रृंगार">वस्त्र व श्रृंगार</option>
                <option value="वाद्य व सजावट">वाद्य व सजावट</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>लिस्ट में जोड़ें</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
