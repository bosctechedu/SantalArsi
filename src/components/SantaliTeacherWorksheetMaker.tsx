import React, { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { speakWithFemaleVoice } from '../utils/speech';
import {
  Printer,
  Shuffle,
  Eye,
  EyeOff,
  Volume2,
  ClipboardList
} from 'lucide-react';

const OL_CHIKI_TRACING_SET: Array<{ char: string; name: string; dev: string }> = [
  { char: 'ᱚ', name: 'La', dev: 'अ' },
  { char: 'ᱛ', name: 'At', dev: 'त' },
  { char: 'ᱜ', name: 'Ag', dev: 'ग' },
  { char: 'ᱝ', name: 'Ang', dev: 'ङ' },
  { char: 'ᱞ', name: 'Al', dev: 'ल' },
  { char: 'ᱟ', name: 'Laa', dev: 'आ' },
  { char: 'ᱠ', name: 'Aak', dev: 'क' },
  { char: 'ᱡ', name: 'Aaj', dev: 'ज' },
  { char: 'ᱢ', name: 'Aam', dev: 'म' },
  { char: 'ᱣ', name: 'Aaw', dev: 'व' },
  { char: 'ᱤ', name: 'Li', dev: 'इ' },
  { char: 'ᱥ', name: 'Is', dev: 'स' },
  { char: 'ᱦ', name: 'Ih', dev: 'ह' },
  { char: 'ᱧ', name: 'Iny', dev: 'ञ' },
  { char: 'ᱨ', name: 'Ir', dev: 'र' },
  { char: 'ᱩ', name: 'Lu', dev: 'उ' },
  { char: 'ᱪ', name: 'Uch', dev: 'च' },
  { char: 'ᱫ', name: 'Ud', dev: 'द' },
  { char: 'ᱬ', name: 'Unn', dev: 'ण' },
  { char: 'ᱭ', name: 'Uy', dev: 'य' },
  { char: 'ᱮ', name: 'Le', dev: 'ए' },
  { char: 'ᱯ', name: 'Ep', dev: 'प' },
  { char: 'ᱰ', name: 'Edd', dev: 'ड' },
  { char: 'ᱱ', name: 'En', dev: 'न' },
  { char: 'ᱲ', name: 'Err', dev: 'ड़' },
  { char: 'ᱳ', name: 'Lo', dev: 'ओ' },
  { char: 'ᱴ', name: 'Ott', dev: 'ट' },
  { char: 'ᱵ', name: 'Ob', dev: 'ब' },
  { char: 'ᱶ', name: 'Ov', dev: 'वं' },
  { char: 'ᱷ', name: 'Oh', dev: 'ह्' }
];

export const SantaliTeacherWorksheetMaker: React.FC = () => {
  const { words } = useAdmin();

  const [schoolName, setSchoolName] = useState('आदर्श संताली प्राथमिक विद्यालय, दुमका');
  const [className, setClassName] = useState('कक्षा 5 / स्तर-1');
  const [teacherName, setTeacherName] = useState('शिक्षक / अभिभावक');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [itemCount, setItemCount] = useState<number>(6);
  const [seed, setSeed] = useState<number>(1);
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const [includeMatch, setIncludeMatch] = useState(true);
  const [includeFill, setIncludeFill] = useState(true);
  const [includeMcq, setIncludeMcq] = useState(true);
  const [includeTracing, setIncludeTracing] = useState(true);

  const filteredPool = useMemo(() => {
    const base =
      categoryFilter === 'all'
        ? words
        : words.filter((w) => (w.category || 'common') === categoryFilter);
    return base.length >= 8 ? base : words;
  }, [words, categoryFilter]);

  const worksheetData = useMemo(() => {
    const pool = [...filteredPool];
    // Deterministic seeded shuffle
    let s = seed * 9301 + 49297;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    const samplePool = pool.slice(0, Math.min(pool.length, 400));
    for (let i = samplePool.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [samplePool[i], samplePool[j]] = [samplePool[j], samplePool[i]];
    }

    const matchItems = samplePool.slice(0, itemCount);
    const matchShuffledRight = [...matchItems].sort((a, b) =>
      a.meaningHindi.localeCompare(b.meaningHindi)
    );
    const fillItems = samplePool.slice(itemCount, itemCount * 2);
    const mcqItems = samplePool.slice(itemCount * 2, itemCount * 3).map((target, idx) => {
      const distractors = samplePool
        .filter((w) => w.id !== target.id && w.meaningHindi !== target.meaningHindi)
        .slice(idx * 3, idx * 3 + 3);
      const opts = [target.meaningHindi, ...distractors.map((d) => d.meaningHindi)];
      // Shuffle options deterministically
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      return { word: target, options: opts };
    });

    const tracingStart = ((seed - 1) * 10) % OL_CHIKI_TRACING_SET.length;
    const tracingLetters = Array.from({ length: 10 }, (_, k) =>
      OL_CHIKI_TRACING_SET[(tracingStart + k) % OL_CHIKI_TRACING_SET.length]
    );

    return { matchItems, matchShuffledRight, fillItems, mcqItems, tracingLetters };
  }, [filteredPool, itemCount, seed]);

  const totalMarks =
    (includeMatch ? itemCount : 0) +
    (includeFill ? itemCount : 0) +
    (includeMcq ? itemCount : 0) +
    (includeTracing ? 10 : 0);

  return (
    <div className="space-y-6">
      {/* Control Panel (hidden when printing) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-sky-800">
              A4 प्रिंट रेडी · शब्दकोश व ओल चिकी अभ्यास पत्र
            </p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              शिक्षक व अभिभावक टेस्ट / वर्कशीट जनरेटर (Worksheet Maker)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              शब्दकोश से जोड़ी मिलान, रिक्त स्थान, MCQ प्रश्न और ओल चिकी वर्ण ट्रेसिंग अभ्यास पत्र एक क्लिक में प्रिंट या PDF में सेव करें।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setSeed((p) => p + 1)}
              className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>नए प्रश्न बदलें</span>
            </button>
            <button
              onClick={() => setShowAnswerKey((p) => !p)}
              className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              {showAnswerKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showAnswerKey ? 'उत्तर कुंजी छुपाएं' : 'उत्तर कुंजी दिखाएं'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>A4 प्रिंट / PDF सेव</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs pt-3 border-t border-slate-100">
          <div className="lg:col-span-2">
            <label className="font-semibold text-slate-700 block mb-1">विद्यालय / संस्था का नाम</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">कक्षा / स्तर</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">विषय श्रेणी</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            >
              <option value="all">सभी श्रेणियाँ</option>
              <option value="relation">रिश्ते-नाते (Relation)</option>
              <option value="nature">प्रकृति व वन (Nature)</option>
              <option value="food">भोजन व व्यंजन (Food)</option>
              <option value="animal">पशु-पक्षी (Animal)</option>
              <option value="action">क्रिया (Action)</option>
              <option value="culture">संस्कृति (Culture)</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">प्रति खंड प्रश्न</label>
            <select
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 tabular-nums"
            >
              <option value={5}>5 प्रश्न</option>
              <option value={6}>6 प्रश्न</option>
              <option value={8}>8 प्रश्न</option>
              <option value={10}>10 प्रश्न</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-sky-700" />
            शामिल खंड:
          </span>
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeMatch} onChange={(e) => setIncludeMatch(e.target.checked)} />
            <span>जोड़ी मिलाओ</span>
          </label>
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeFill} onChange={(e) => setIncludeFill(e.target.checked)} />
            <span>रिक्त स्थान भरो</span>
          </label>
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeMcq} onChange={(e) => setIncludeMcq(e.target.checked)} />
            <span>बहुविकल्पीय प्रश्न</span>
          </label>
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={includeTracing} onChange={(e) => setIncludeTracing(e.target.checked)} />
            <span>ओल चिकी ट्रेसिंग</span>
          </label>
          <input
            type="text"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="शिक्षक नाम"
            className="ml-auto px-2.5 py-1 rounded border border-slate-200 text-xs"
          />
        </div>
      </div>

      {/* Printable A4 Sheet */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-7 print:border-none print:shadow-none print:p-0">
        {/* Sheet Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{schoolName}</h2>
            <p className="text-sm font-semibold text-amber-800 mt-0.5">
              संताली भाषा व ओल चिकी अभ्यास कार्यपत्रक ({toOlChikiAuto('संताली कार्यपत्रक')})
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
              <span>कक्षा: {className}</span>
              <span aria-hidden="true">·</span>
              <span>परीक्षक: {teacherName}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">पूर्णांक: {totalMarks} अंक</span>
            </div>
          </div>
          <div className="text-xs text-slate-700 space-y-1.5 sm:text-right">
            <p>विद्यार्थी का नाम: ________________________</p>
            <p>क्रमांक / रोल नं.: ____________ · दिनांक: ________</p>
          </div>
        </div>

        {/* Section A: Match the Following */}
        {includeMatch && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                खंड अ · सही जोड़ी मिलाइए (Match the Following — {itemCount} अंक)
              </h3>
              <button
                onClick={() =>
                  speakWithFemaleVoice('खंड अ: बाएँ स्तंभ के संताली शब्दों को दाएँ स्तंभ के सही हिन्दी अर्थ से मिलाएँ।', {
                    autoDetectLanguage: true
                  })
                }
                className="text-xs text-sky-700 font-semibold inline-flex items-center gap-1 print:hidden cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>निर्देश सुनें</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                {worksheetData.matchItems.map((w, i) => (
                  <div
                    key={w.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between"
                  >
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {i + 1}. {w.wordDevanagari} ({toOlChikiAuto(w.wordDevanagari)})
                    </span>
                    <span className="text-xs text-slate-400">[ ___ ]</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {worksheetData.matchShuffledRight.map((w, i) => (
                  <div
                    key={`r_${w.id}`}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <span className="text-slate-800">
                      ({String.fromCharCode(65 + i)}) {w.meaningHindi}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section B: Fill in the Blanks */}
        {includeFill && (
          <section className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              खंड ब · संताली में अनुवाद लिखिए (Write Santali Word — {itemCount} अंक)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {worksheetData.fillItems.map((w, i) => (
                <div key={w.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                  <p className="text-slate-800 font-medium tabular-nums">
                    {i + 1}. हिन्दी: <strong>{w.meaningHindi}</strong> ({w.meaningEnglish})
                  </p>
                  <p className="text-slate-600 text-xs">
                    संताली उत्तर: ______________________________
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section C: MCQ */}
        {includeMcq && (
          <section className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              खंड स · सही विकल्प चुनें (Multiple Choice — {itemCount} अंक)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {worksheetData.mcqItems.map(({ word, options }, idx) => (
                <div key={word.id} className="p-3 rounded-lg border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-900 text-sm tabular-nums">
                    प्र.{idx + 1}: "{word.wordDevanagari}" ({toOlChikiAuto(word.wordDevanagari)} / {word.wordRoman}) का सही अर्थ क्या है?
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 text-slate-700">
                    {options.map((opt, oi) => (
                      <div key={oi} className="flex items-start gap-1">
                        <span className="font-semibold">({String.fromCharCode(65 + oi)})</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section D: Ol Chiki Tracing Grid */}
        {includeTracing && (
          <section className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              खंड द · ओल चिकी (ᱚᱞ ᱪᱤᱠᱤ) वर्ण सुलेखन व ट्रेसिंग अभ्यास (10 अंक)
            </h3>
            <div className="space-y-2">
              {worksheetData.tracingLetters.map((item) => (
                <div
                  key={item.char}
                  className="grid grid-cols-8 gap-1.5 items-center border border-slate-200 rounded-lg p-1.5"
                >
                  <div className="col-span-2 flex items-center gap-2 px-2">
                    <span className="text-2xl font-bold text-amber-800">{item.char}</span>
                    <span className="text-xs text-slate-600">
                      {item.name} ({item.dev})
                    </span>
                  </div>
                  {Array.from({ length: 6 }).map((_, boxIdx) => (
                    <div
                      key={boxIdx}
                      className="h-10 border border-dashed border-slate-300 rounded flex items-center justify-center text-xl font-bold text-slate-300 select-none"
                    >
                      {boxIdx < 2 ? item.char : ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Answer Key */}
        {showAnswerKey && (
          <section className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
            <h3 className="font-bold text-amber-950 text-sm">शिक्षक उत्तर कुंजी (Answer Key)</h3>
            {includeMatch && (
              <p className="text-slate-800">
                <strong>जोड़ी मिलान:</strong>{' '}
                {worksheetData.matchItems
                  .map((w, i) => `${i + 1} → ${w.meaningHindi}`)
                  .join(' · ')}
              </p>
            )}
            {includeFill && (
              <p className="text-slate-800">
                <strong>रिक्त स्थान:</strong>{' '}
                {worksheetData.fillItems
                  .map((w, i) => `${i + 1} → ${w.wordDevanagari} (${toOlChikiAuto(w.wordDevanagari)})`)
                  .join(' · ')}
              </p>
            )}
            {includeMcq && (
              <p className="text-slate-800">
                <strong>बहुविकल्पीय:</strong>{' '}
                {worksheetData.mcqItems
                  .map(({ word }, i) => `प्र.${i + 1} → ${word.meaningHindi}`)
                  .join(' · ')}
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
