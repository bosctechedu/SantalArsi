import React, { useState, useEffect } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { useUserAuth } from '../context/UserAuthContext';
import {
  Music,
  Volume2,
  Square,
  Download,
  Save,
  Sparkles,
  Trash2,
  Copy,
  Check
} from 'lucide-react';

interface FolkPreset {
  id: string;
  ragaStyle: 'बाहा सेरेञ' | 'सोहराय सेरेञ' | 'करम सेरेञ' | 'लागड़े सेरेञ';
  title: string;
  lines: [string, string, string, string];
  meaningHi: string;
}

const FOLK_PRESETS: FolkPreset[] = [
  {
    id: 'baha1',
    ragaStyle: 'बाहा सेरेञ',
    title: 'जाहेर थान में बाहा फूल',
    lines: [
      'जाहेर थान रे सारजोम बाहा फुटाव काना,',
      'मांझी कुल्ही रे सेताक् जोहार मेनाक्-आ।',
      'तुम्दाक् तामाक् साड़े ते मोने रास्का काना,',
      'आबो जोतो होड़ मित् ते बाहा सेरेञ-आबो।'
    ],
    meaningHi: 'जाहेर थान में सखुआ का फूल खिला है, गाँव की गली में सुबह का जोहार है। मांदल-नगाड़े की गूँज से मन प्रसन्न है, आओ सब मिलकर बाहा गीत गाएँ।'
  },
  {
    id: 'sohrai1',
    ragaStyle: 'सोहराय सेरेञ',
    title: 'सोहराय पर्व व कुल्ही नृत्य',
    lines: [
      'सोहराय चांदो रे आतो कुल्ही साजाव काना,',
      'गोरु-डांगरा सिंङ रे सुनूम सिंदूर मेनाक्-आ।',
      'अखड़ा ताला रे दोहा सेरेञ रस्का काना,',
      'पेड़ा को सांव ते लन्दा-सुलुक ताहेना।'
    ],
    meaningHi: 'सोहराय के महीने में गाँव की गली सजी है, बैलों के सींग पर तेल-सिंदूर लगा है। अखड़ा के बीच दोहा गीत की खुशी है, मेहमानों के साथ हँसी-खुशी बनी रहेगी।'
  },
  {
    id: 'karam1',
    ragaStyle: 'करम सेरेञ',
    title: 'करम डाली व एकता का संदेश',
    lines: [
      'करम डाइर दो अखड़ा रे बाइसव काना,',
      'भादोर ञिदा रे चान्दो तारास मेनाक्-आ।',
      'गुरू गोसाँय बिनती ते आतो सोमाज रास्का काना,',
      'मित् मोने ते अबो दिशोम लाहा ताहेना।'
    ],
    meaningHi: 'करम डाली अखड़ा में स्थापित है, भादो की रात में चाँद की चाँदनी है। बिनती के साथ पूरा समाज आनंदित है, एक मन से हमारा देश आगे बढ़ता रहेगा।'
  }
];

const RHYME_ENDINGS = [
  { word: 'काना', hint: 'है (वर्तमान)' },
  { word: 'ताहेना', hint: 'बना रहेगा' },
  { word: 'मेनाक्-आ', hint: 'विद्यमान है' },
  { word: 'सेरेञ-आबो', hint: 'हम गाएँगे' },
  { word: 'एनेच-आबो', hint: 'हम नाचेंगे' },
  { word: 'रस्का', hint: 'आनंद/खुशी' },
  { word: 'जोहार', hint: 'प्रणाम' },
  { word: 'दिशोम', hint: 'देश/समाज' }
];

interface SavedSong {
  id: string;
  ragaStyle: string;
  title: string;
  lines: [string, string, string, string];
  author: string;
}

export const SantaliSongLyricBuilder: React.FC = () => {
  const { currentUser } = useUserAuth();
  const storageKey = `hor_katha_song_lyrics_${currentUser?.email || 'guest'}`;

  const [ragaStyle, setRagaStyle] = useState<string>('बाहा सेरेञ');
  const [title, setTitle] = useState<string>(FOLK_PRESETS[0].title);
  const [author, setAuthor] = useState<string>(currentUser?.displayName || 'संताली गीतकार');
  const [lines, setLines] = useState<[string, string, string, string]>(FOLK_PRESETS[0].lines);
  const [activeLineIdx, setActiveLineIdx] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const [savedSongs, setSavedSongs] = useState<SavedSong[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setSavedSongs(raw ? JSON.parse(raw) : []);
    } catch {
      setSavedSongs([]);
    }
  }, [storageKey]);

  const updateLine = (idx: number, val: string) => {
    const next: [string, string, string, string] = [...lines] as [string, string, string, string];
    next[idx] = val;
    setLines(next);
  };

  const appendRhymeWord = (word: string) => {
    const cur = lines[activeLineIdx].trim();
    updateLine(activeLineIdx, cur ? `${cur} ${word}` : word);
  };

  const loadPreset = (p: FolkPreset) => {
    setRagaStyle(p.ragaStyle);
    setTitle(p.title);
    setLines([...p.lines] as [string, string, string, string]);
  };

  const fullPoemDev = lines.join('\n');
  const fullPoemOl = toOlChikiAuto(fullPoemDev);

  const saveSong = () => {
    const nextSong: SavedSong = {
      id: `song_${Date.now()}`,
      ragaStyle,
      title: title.trim() || 'नया लोकगीत',
      lines: [...lines] as [string, string, string, string],
      author: author.trim() || 'रचनाकार'
    };
    const next = [nextSong, ...savedSongs].slice(0, 12);
    setSavedSongs(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const deleteSaved = (id: string) => {
    const next = savedSongs.filter((s) => s.id !== id);
    setSavedSongs(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const downloadTxt = () => {
    const content = `${title} (${ragaStyle})\nरचनाकार: ${author}\n\n[संताली देवनागरी]\n${fullPoemDev}\n\n[ओल चिकी]\n${fullPoemOl}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_santali_sereng.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPosterPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 10;
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`Santal आ़रसी सेरेञ स्टूडियो · ${ragaStyle}`, 60, 86);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(title, 60, 140);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 26px sans-serif';
    lines.forEach((line, i) => {
      ctx.fillText(line, 60, 225 + i * 54);
    });

    ctx.fillStyle = '#92400E';
    ctx.font = '22px sans-serif';
    lines.forEach((line, i) => {
      ctx.fillText(toOlChikiAuto(line), 60, 480 + i * 44);
    });

    ctx.fillStyle = '#475569';
    ctx.font = 'italic 20px sans-serif';
    ctx.fillText(`रचनाकार: ${author}`, 60, 700);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${title.replace(/\s+/g, '_')}_poster.png`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(`${title} (${ragaStyle})\n\n${fullPoemDev}\n\n${fullPoemOl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <Music className="w-4 h-4 text-amber-600" />
            <span>सोहराय-बाहा लोकगीत व दोहा रचनाकार</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            संताली सेरेञ (गीत) तुकबंदी व द्वि-लिपि पोस्टर स्टूडियो
          </h2>
          <p className="text-xs text-slate-600">
            बाहा, सोहराय व करम राग के तुकांत शब्दों की सहायता से ४-पदा संताली गीत रचें, सुनें और PNG पोस्टर डाउनलोड करें।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => speakWithFemaleVoice(`${title}. ${lines.join(' ')}`, { autoDetectLanguage: true, rate: 0.85 })}
            className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>गीत पाठ सुनें</span>
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

      {/* Presets */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
        <span className="text-xs font-black text-slate-800 block">प्रसिद्ध पारंपरिक स्टार्टर गीत (१-क्लिक संपादित करें)</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {FOLK_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadPreset(p)}
              className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left cursor-pointer transition-colors"
            >
              <span className="text-[10px] font-bold text-amber-800 block">{p.ragaStyle}</span>
              <span className="text-xs font-black text-slate-900">{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Composer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <label className="font-bold text-slate-600 block mb-1">पर्व / राग शैली</label>
              <select
                value={ragaStyle}
                onChange={(e) => setRagaStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
              >
                <option value="बाहा सेरेञ">बाहा सेरेञ (वसंत)</option>
                <option value="सोहराय सेरेञ">सोहराय सेरेञ (फसल)</option>
                <option value="करम सेरेञ">करम सेरेञ (भादो)</option>
                <option value="लागड़े सेरेञ">लागड़े सेरेञ (अखड़ा)</option>
                <option value="दोंग सेरेञ">दोंग सेरेञ (बापला)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">गीत शीर्षक</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">रचनाकार का नाम</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            {lines.map((line, idx) => (
              <div key={idx} className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500">पंक्ति {idx + 1}</label>
                <input
                  type="text"
                  value={line}
                  onFocus={() => setActiveLineIdx(idx)}
                  onChange={(e) => updateLine(idx, e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 bg-slate-50 focus:bg-white text-sm font-bold text-slate-900"
                />
              </div>
            ))}
          </div>

          {/* Rhyme Word Helper */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
            <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>पंक्ति {activeLineIdx + 1} में तुकांत संताली शब्द जोड़ें:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {RHYME_ENDINGS.map((r) => (
                <button
                  key={r.word}
                  type="button"
                  onClick={() => appendRhymeWord(r.word)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-amber-200 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  {r.word} <span className="text-[10px] text-slate-500">({r.hint})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Bilingual Preview & Export */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-amber-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-amber-100 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">{ragaStyle}</span>
            <h3 className="text-lg font-black text-slate-900">{title}</h3>
          </div>

          <div className="space-y-1.5 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
            <span className="text-[10px] font-bold uppercase text-amber-900 block">संताली देवनागरी</span>
            {lines.map((l, i) => (
              <p key={i} className="text-sm font-black text-slate-900 leading-relaxed">
                {l}
              </p>
            ))}
          </div>

          <div className="space-y-1.5 bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200">
            <span className="text-[10px] font-bold uppercase text-indigo-900 block">ओल चिकी (Ol Chiki)</span>
            {lines.map((l, i) => (
              <p key={i} className="text-sm font-bold text-indigo-950 leading-relaxed">
                {toOlChikiAuto(l)}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={saveSong}
              className="py-2 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>डायरी में सेव</span>
            </button>
            <button
              type="button"
              onClick={downloadPosterPng}
              className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>पोस्टर PNG</span>
            </button>
            <button
              type="button"
              onClick={downloadTxt}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.TXT डाउनलोड</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'कॉपी हुआ!' : 'गीत कॉपी'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Saved Songs */}
      {savedSongs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
            मेरी रचित सेरेञ डायरी ({savedSongs.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedSongs.map((s) => (
              <div key={s.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-amber-800">{s.ragaStyle}</span>
                    <h4 className="text-xs font-black text-slate-900">{s.title}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => speakWithFemaleVoice(s.lines.join(' '), { autoDetectLanguage: true })}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-amber-700 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSaved(s.id)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-700 whitespace-pre-line">{s.lines.join('\n')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
