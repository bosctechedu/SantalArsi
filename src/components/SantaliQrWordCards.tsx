import React, { useState, useMemo, useEffect } from 'react';
import QRCode from 'qrcode';
import { useAdmin } from '../context/AdminContext';
import { speakWithFemaleVoice } from '../utils/speech';
import { toDevanagariAuto, toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  QrCode,
  Printer,
  Volume2,
  Shuffle,
  Search,
  Plus
} from 'lucide-react';

interface CardWordItem {
  id: string;
  wordDevanagari: string;
  wordRoman: string;
  meaningHindi: string;
  meaningEnglish: string;
  category: string;
}

export const SantaliQrWordCards: React.FC = () => {
  const { words } = useAdmin();

  const [category, setCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cardCount, setCardCount] = useState<number>(6);
  const [shuffleSeed, setShuffleSeed] = useState<number>(1);
  const [customWordDev, setCustomWordDev] = useState('');
  const [customWordRom, setCustomWordRom] = useState('');
  const [customMeaningHi, setCustomMeaningHi] = useState('');
  const [customCards, setCustomCards] = useState<CardWordItem[]>([]);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});

  const selectedWords = useMemo<CardWordItem[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = words.filter((w) => {
      if (category !== 'all' && (w.category || 'common') !== category) return false;
      if (
        q &&
        !w.wordDevanagari.toLowerCase().includes(q) &&
        !w.wordRoman.toLowerCase().includes(q) &&
        !w.meaningHindi.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    const pool = [...filtered.slice(0, Math.min(filtered.length, 300))];
    let s = shuffleSeed * 7919 + 104729;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const combined = [...customCards, ...pool.slice(0, cardCount)];
    return combined.slice(0, Math.max(cardCount, customCards.length + 2));
  }, [words, category, searchQuery, cardCount, shuffleSeed, customCards]);

  useEffect(() => {
    let cancelled = false;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://horkatha.app';

    Promise.all(
      selectedWords.map(async (item) => {
        const targetUrl = `${origin}/?qrword=${encodeURIComponent(item.wordRoman)}`;
        try {
          const url = await QRCode.toDataURL(targetUrl, { width: 180, margin: 1 });
          return [item.id, url] as const;
        } catch {
          return [item.id, ''] as const;
        }
      })
    ).then((pairs) => {
      if (cancelled) return;
      const next: Record<string, string> = {};
      for (const [id, url] of pairs) {
        if (url) next[id] = url;
      }
      setQrMap(next);
    });

    return () => {
      cancelled = true;
    };
  }, [selectedWords]);

  const handleAddCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWordDev.trim() || !customMeaningHi.trim()) return;
    const devFinal = toDevanagariAuto(customWordDev.trim());
    const item: CardWordItem = {
      id: `qr_custom_${Date.now()}`,
      wordDevanagari: devFinal,
      wordRoman: customWordRom.trim() || customWordDev.trim(),
      meaningHindi: customMeaningHi.trim(),
      meaningEnglish: customWordRom.trim() || customMeaningHi.trim(),
      category: 'classroom'
    };
    setCustomCards((prev) => [item, ...prev]);
    setCustomWordDev('');
    setCustomWordRom('');
    setCustomMeaningHi('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-semibold text-sky-800">
            विद्यालय व दीवार पोस्टर · मोबाइल-स्कैन QR शब्द कार्ड
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            कक्षा व दीवार के लिए QR शब्द फ़्लैशकार्ड जनरेटर
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            प्रिंटेबल संताली शब्द कार्ड बनाएं — प्रत्येक कार्ड पर स्कैन करने योग्य QR कोड है जो मोबाइल पर सीधे उस शब्द का उच्चारण व अर्थ खोलता है।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShuffleSeed((p) => p + 1)}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>नए शब्द बदलें</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>A4 कार्ड प्रिंट / PDF</span>
          </button>
        </div>
      </div>

      {/* Filters & Custom Word Adder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 print:hidden">
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs items-center">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="शब्द खोजें..."
              className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
          >
            <option value="all">सभी श्रेणियाँ</option>
            <option value="nature">प्रकृति व वन</option>
            <option value="relation">रिश्ते-नाते</option>
            <option value="animal">पशु-पक्षी</option>
            <option value="food">भोजन</option>
            <option value="culture">संस्कृति</option>
          </select>
          <select
            value={cardCount}
            onChange={(e) => setCardCount(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 tabular-nums"
          >
            <option value={4}>4 कार्ड</option>
            <option value={6}>6 कार्ड</option>
            <option value={8}>8 कार्ड</option>
          </select>
        </div>

        <form
          onSubmit={handleAddCustomCard}
          className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs items-center"
        >
          <input
            type="text"
            required
            value={customWordDev}
            onChange={(e) => setCustomWordDev(e.target.value)}
            placeholder="संताली शब्द (जैसे: दाक्)"
            className="px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
          />
          <input
            type="text"
            value={customWordRom}
            onChange={(e) => setCustomWordRom(e.target.value)}
            placeholder="Roman (Dak)"
            className="px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
          />
          <input
            type="text"
            required
            value={customMeaningHi}
            onChange={(e) => setCustomMeaningHi(e.target.value)}
            placeholder="हिन्दी अर्थ (पानी)"
            className="px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold inline-flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>कार्ड जोड़ें</span>
          </button>
        </form>
      </div>

      {/* Printable Grid of QR Vocabulary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
        {selectedWords.map((w) => {
          const devWord = toDevanagariAuto(w.wordDevanagari || w.wordRoman);
          return (
            <div
              key={w.id}
              className="bg-white border-2 border-slate-300 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4 break-inside-avoid"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <QrCode className="w-3.5 h-3.5 text-amber-700" />
                  <span>संताली देवनागरी लिपि · {w.category || 'vocabulary'}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 truncate">{devWord}</h2>
                <p className="text-xl font-bold text-amber-800 truncate">{toOlChikiAuto(devWord)}</p>
                <p className="text-xs font-semibold text-slate-600">{w.wordRoman}</p>
                <p className="text-sm font-bold text-slate-800 pt-1 border-t border-slate-100">
                  {w.meaningHindi}
                </p>
                <p className="text-xs text-slate-500">{w.meaningEnglish}</p>
                <button
                  onClick={() =>
                    speakWithFemaleVoice(`${devWord}. ${w.meaningHindi}`, {
                      autoDetectLanguage: true
                    })
                  }
                  className="mt-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 text-xs font-semibold text-slate-800 inline-flex items-center gap-1 print:hidden cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>सुनें</span>
                </button>
              </div>

            <div className="flex flex-col items-center shrink-0">
              {qrMap[w.id] ? (
                <img
                  src={qrMap[w.id]}
                  alt={`QR for ${w.wordRoman}`}
                  className="w-28 h-28 rounded-lg border border-slate-200"
                />
              ) : (
                <div className="w-28 h-28 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] text-slate-400">
                  QR...
                </div>
              )}
              <span className="text-[10px] font-semibold text-slate-500 mt-1">उच्चारण हेतु स्कैन करें</span>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
