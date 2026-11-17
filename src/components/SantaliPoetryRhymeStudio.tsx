import React, { useState, useMemo } from 'react';
import { Feather, Volume2, Sparkles, Plus, Trash2, BookmarkCheck } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface RhymeGroup {
  ending: string;
  label: string;
  words: { dev: string; roman: string; hi: string }[];
}

const RHYME_BANKS: RhymeGroup[] = [
  {
    ending: '-आन (-an)',
    label: 'महिमा, दान व सम्मान तुकांत',
    words: [
      { dev: 'थाना / थान', roman: 'than', hi: 'पवित्र स्थान' },
      { dev: 'जान', roman: 'jan', hi: 'प्राण / जीवन' },
      { dev: 'गायान / गाण', roman: 'gan', hi: 'गीत-गान' },
      { dev: 'मान / सोम्मान', roman: 'man', hi: 'आदर व सम्मान' },
      { dev: 'आसान', roman: 'asan', hi: 'सहारा / आश्रय' }
    ]
  },
  {
    ending: '-ओर / -ओड़ (-or)',
    label: 'मनुष्य, भाषा व प्रकृति तुकांत',
    words: [
      { dev: 'होड़', roman: 'hor', hi: 'मनुष्य / संताल' },
      { dev: 'रोड़', roman: 'ror', hi: 'बोली / वाणी' },
      { dev: 'जोहोर / जोहार', roman: 'johar', hi: 'प्रणाम / अभिवादन' },
      { dev: 'मोर / मयूर', roman: 'marah', hi: 'मयूर' },
      { dev: 'बोर', roman: 'bor', hi: 'वरदान' }
    ]
  },
  {
    ending: '-एञ / -एनेच (-ej / -en)',
    label: 'गीत, नृत्य व उत्सव तुकांत',
    words: [
      { dev: 'सेरेञ', roman: 'seren', hi: 'लोकगीत' },
      { dev: 'एनेच', roman: 'enej', hi: 'पारंपरिक नृत्य' },
      { dev: 'तेहेञ', roman: 'tehen', hi: 'आज का दिन' },
      { dev: 'मेनेच', roman: 'menej', hi: 'कहना / वचन' },
      { dev: 'पेरेज', roman: 'perej', hi: 'परिपूर्ण / भरा हुआ' }
    ]
  },
  {
    ending: '-आक् (-ak)',
    label: 'घर, जल व प्रकृति तुकांत',
    words: [
      { dev: 'ओड़ाक्', roman: 'orak', hi: 'घर / आवास' },
      { dev: 'दाक्', roman: 'dak', hi: 'पावन जल' },
      { dev: 'तामाक्', roman: 'tamak', hi: 'नगाड़ा वाद्य' },
      { dev: 'तुम्दाक्', roman: 'tumdak', hi: 'मांदर वाद्य' },
      { dev: 'साकाम् / साक', roman: 'sakam', hi: 'पत्ता / पात' }
    ]
  }
];

interface SavedPoem {
  id: string;
  title: string;
  meter: string;
  lines: string;
  createdAt: string;
}

const POEMS_STORAGE_KEY = 'hor_katha_saved_poems';

export const SantaliPoetryRhymeStudio: React.FC = () => {
  const [selectedRhyme, setSelectedRhyme] = useState(0);
  const [title, setTitle] = useState('जाहेर थान रे सेरेञ (पवित्र उपवन का गीत)');
  const [meter, setMeter] = useState('लांगड़े छंद (८-८ मात्रा)');
  const [poemLines, setPoemLines] = useState(
    'जाहेर थान रे सखुआ बाहा,\nआबो रोड़ गे आबो सहा।\nतुम्दाक् तामाक् साड़े रे,\nरासका ते पेरेज नावा सेरेञ।'
  );
  const [savedPoems, setSavedPoems] = useState<SavedPoem[]>(() => {
    try {
      const raw = localStorage.getItem(POEMS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const syllableStats = useMemo(() => {
    return poemLines
      .split('\n')
      .filter((l) => l.trim().length > 0)
      .map((line) => ({
        line,
        words: line.trim().split(/\s+/).length,
        chars: line.trim().length
      }));
  }, [poemLines]);

  const handleInsertRhymeWord = (word: string) => {
    setPoemLines((prev) => (prev ? `${prev} ${word}` : word));
    speakWithFemaleVoice(word, { autoDetectLanguage: true });
  };

  const handleSavePoem = () => {
    if (!poemLines.trim()) return;
    const item: SavedPoem = {
      id: 'poem_' + Date.now(),
      title: title.trim() || 'शीर्षकहीन संताली कविता',
      meter,
      lines: poemLines.trim(),
      createdAt: new Date().toLocaleDateString('hi-IN')
    };
    const next = [item, ...savedPoems];
    setSavedPoems(next);
    try {
      localStorage.setItem(POEMS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleDeletePoem = (id: string) => {
    const next = savedPoems.filter((p) => p.id !== id);
    setSavedPoems(next);
    try {
      localStorage.setItem(POEMS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const activeGroup = RHYME_BANKS[selectedRhyme];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <Feather className="w-4 h-4" />
              <span>संताली काव्य व सेरेञ रचना स्टूडियो</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              कविता व सेरेञ तुकांत स्टूडियो (Poetry &amp; Seren Studio)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              तुकांत शब्दों (Rhyming Words) और पारंपरिक छंद-लय के साथ अपनी संताली कविता या लोकगीत लिखें और सुनें।
            </p>
          </div>
          <button
            onClick={() => speakWithFemaleVoice(`${title}। ${poemLines}`, { autoDetectLanguage: true })}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>कविता सुनें (Recite)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Rhyme Explorer */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>तुकांत शब्द कोष (Rhyme Finder)</span>
            </h2>

            <div className="flex flex-wrap gap-1.5">
              {RHYME_BANKS.map((grp, idx) => (
                <button
                  key={grp.ending}
                  onClick={() => setSelectedRhyme(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    selectedRhyme === idx
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {grp.ending}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-600 font-semibold">{activeGroup.label}</div>

            <div className="space-y-2">
              {activeGroup.words.map((w) => (
                <div
                  key={w.dev}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">{w.dev}</div>
                    <div className="text-[11px] text-slate-600">
                      {w.roman} — {w.hi}
                    </div>
                  </div>
                  <button
                    onClick={() => handleInsertRhymeWord(w.dev)}
                    className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>जोड़ें</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Poem Composer */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">कविता / गीत का शीर्षक:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">ताम व छंद शैली:</label>
                <select
                  value={meter}
                  onChange={(e) => setMeter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold"
                >
                  <option>लांगड़े छंद (८-८ मात्रा)</option>
                  <option>दोन गीत (विवाह मंगल ताल)</option>
                  <option>बाहा सेरेञ (फूल वंदना)</option>
                  <option>सोहराय छंद (गो-वंदना)</option>
                  <option>मुक्त छंद (आधुनिक संताली कविता)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">कविता की पंक्तियाँ लिखें:</label>
              <textarea
                rows={6}
                value={poemLines}
                onChange={(e) => setPoemLines(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-300 bg-amber-50/30 text-sm font-serif text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Live Meter Bar */}
            {syllableStats.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[11px] font-bold text-slate-600">पंक्ति-दर-पंक्ति मात्रा व शब्द विश्लेषण:</div>
                {syllableStats.map((st, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                    <span className="truncate pr-2">{idx + 1}. {st.line}</span>
                    <span className="font-mono text-[11px] text-amber-800 shrink-0">
                      {st.words} शब्द · {st.chars} अक्षर
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={handleSavePoem}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>मेरी काव्य पुस्तिका में सहेजें</span>
              </button>
              <button
                onClick={() => speakWithFemaleVoice(poemLines, { autoDetectLanguage: true })}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>पूरा काव्य सुनें</span>
              </button>
            </div>
          </div>
        </div>

        {/* Saved Poems Archive */}
        {savedPoems.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">सहेजी गई रचनाएँ ({savedPoems.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedPoems.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                        {p.meter} · {p.createdAt}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{p.title}</h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speakWithFemaleVoice(`${p.title}। ${p.lines}`, { autoDetectLanguage: true })}
                        className="p-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePoem(p.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <pre className="text-xs text-slate-800 whitespace-pre-wrap font-serif leading-relaxed">
                    {p.lines}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
