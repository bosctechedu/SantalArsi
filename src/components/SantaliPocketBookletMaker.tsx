import React, { useState, useMemo } from 'react';
import { BookOpen, Printer, Volume2, CheckSquare, Square, Download } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { speakWithFemaleVoice } from '../utils/speech';
import { ALL_COMPETITIVE_QUESTIONS_2026 } from '../data/competitiveExams2026Data';
import { CURRENT_AFFAIRS_2026 } from '../data/currentAffairs2026';

const CORE_PHRASES_FOR_BOOKLET = [
  { cat: 'अभिवादन', sa: 'जोहार गोमके!', ro: 'Johar gomke!', hi: 'नमस्कार श्रीमान!' },
  { cat: 'अभिवादन', sa: 'चेट लेका मेनाक् मेया?', ro: 'Chet leka menak meya?', hi: 'आप कैसे हैं?' },
  { cat: 'अभिवादन', sa: 'आड़ि नापाय गेया।', ro: 'Adi napay geya.', hi: 'बहुत अच्छा हूँ।' },
  { cat: 'दैनिक', sa: 'दाक् इञ खाजाक् काना।', ro: 'Dak in khajak kana.', hi: 'मुझे पानी चाहिए।' },
  { cat: 'दैनिक', sa: 'इञाक् ञुतुम ... काना।', ro: 'Inak nyutum ... kana.', hi: 'मेरा नाम ... है।' },
  { cat: 'दैनिक', sa: 'आयमा सारहाव।', ro: 'Ayma sarhaw.', hi: 'बहुत-बहुत धन्यवाद।' }
];

export const SantaliPocketBookletMaker: React.FC = () => {
  const { words } = useAdmin();
  const [bookTitle, setBookTitle] = useState('संताली व प्रतियोगी परीक्षा अध्ययन पुस्तिका 2026');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [includePhrases, setIncludePhrases] = useState(true);
  const [includeExamMcqs, setIncludeExamMcqs] = useState(true);
  const [includeCurrentAffairs, setIncludeCurrentAffairs] = useState(true);
  const [maxWords, setMaxWords] = useState(16);
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const set = new Set<string>(['all']);
    words.slice(0, 150).forEach((w) => {
      if (w.category) set.add(w.category);
    });
    return Array.from(set);
  }, [words]);

  const bookletWords = useMemo(() => {
    if (selectedCategory === 'all') {
      return words.slice(0, maxWords);
    }
    const filtered: typeof words = [];
    for (let i = 0; i < words.length && filtered.length < maxWords; i++) {
      if (words[i].category === selectedCategory) {
        filtered.push(words[i]);
      }
    }
    return filtered;
  }, [words, selectedCategory, maxWords]);

  const examSetSample = useMemo(() => ALL_COMPETITIVE_QUESTIONS_2026.slice(0, 10), []);
  const caSample = useMemo(() => CURRENT_AFFAIRS_2026.slice(0, 4), []);

  const handleTogglePin = (id: string) => {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownloadHtml = () => {
    const html = `<!doctype html>
<html lang="hi">
<head><meta charset="utf-8"><title>${bookTitle}</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 28px; color: #0f172a; line-height: 1.5; }
  h1 { border-bottom: 2px solid #d97706; padding-bottom: 8px; font-size: 22px; }
  h2 { margin-top: 24px; font-size: 16px; color: #92400e; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
  .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 12px; }
  .card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; }
  .sa { font-weight: bold; font-size: 15px; color: #92400e; }
  .qbox { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; margin-bottom: 8px; }
</style>
</head>
<body>
  <h1>${bookTitle}</h1>
  <h2>1. शब्दकोश शब्द संग्रह (${bookletWords.length} शब्द)</h2>
  <div class="grid">
    ${bookletWords
      .map(
        (w) =>
          `<div class="card"><div class="sa">${w.wordDevanagari} (${w.wordRoman})</div><div>${w.meaningHindi} · ${w.meaningEnglish}</div></div>`
      )
      .join('')}
  </div>
  ${
    includeExamMcqs
      ? `<h2>2. प्रमुख परीक्षा प्रश्न व उत्तर-कुंजी 2026</h2>
      ${examSetSample
        .map(
          (q, idx) =>
            `<div class="qbox"><strong>Q${idx + 1}. ${q.question}</strong><div>${q.options
              .map((o, oi) => `(${String.fromCharCode(65 + oi)}) ${o}`)
              .join(' &nbsp; ')}</div><div style="color:#065f46;margin-top:4px;"><strong>सही उत्तर:</strong> (${String.fromCharCode(
              65 + q.correctIndex
            )}) ${q.options[q.correctIndex]} — ${q.explanation}</div></div>`
        )
        .join('')}`
      : ''
  }
  ${
    includeCurrentAffairs
      ? `<h2>3. करेंट अफेयर्स 2026 नोट्स (भारत + झारखंड)</h2>
      ${caSample
        .map(
          (c) =>
            `<div class="qbox"><strong>${c.titleHindi}</strong><div>${c.summaryHindi}</div><div style="font-size:12px;color:#475569;margin-top:4px;">Santali Roman: ${c.santaliRoman}</div></div>`
        )
        .join('')}`
      : ''
  }
</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hor-katha-study-booklet-2026.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-2xs print:hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <BookOpen className="w-4 h-4" />
              <span>वन-क्लिक स्टडी बुकलेट व प्रिंटेबल A4 हैंडआउट (PDF/HTML)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Study Booklet &amp; Printable Exam Worksheet Maker
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              संताली शब्दकोश, बोलचाल वाक्य, 2026 करेंट अफेयर्स और परीक्षा प्रश्न-पत्र (उत्तर-कुंजी सहित) की प्रिंटेबल A4 पुस्तिका बनाएं।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>A4 प्रिंट / PDF सहेजें</span>
            </button>
            <button
              onClick={handleDownloadHtml}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>HTML बुकलेट डाउनलोड</span>
            </button>
          </div>
        </div>

        {/* Config Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 text-xs print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">पुस्तिका का शीर्षक:</label>
              <input
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">शब्द श्रेणी चुनें:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'सभी श्रेणियाँ' : c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">शब्द संख्या:</label>
              <select
                value={maxWords}
                onChange={(e) => setMaxWords(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold"
              >
                <option value={8}>8 शब्द</option>
                <option value={16}>16 शब्द</option>
                <option value={24}>24 शब्द</option>
                <option value={36}>36 शब्द</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer font-bold">
              <input type="checkbox" checked={includePhrases} onChange={(e) => setIncludePhrases(e.target.checked)} />
              <span>दैनिक वाक्य जोड़ें</span>
            </label>
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer font-bold">
              <input type="checkbox" checked={includeExamMcqs} onChange={(e) => setIncludeExamMcqs(e.target.checked)} />
              <span>10 परीक्षा प्रश्न + उत्तर-कुंजी जोड़ें</span>
            </label>
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer font-bold">
              <input type="checkbox" checked={includeCurrentAffairs} onChange={(e) => setIncludeCurrentAffairs(e.target.checked)} />
              <span>करेंट अफेयर्स 2026 नोट्स जोड़ें</span>
            </label>
          </div>
        </div>

        {/* Printable Booklet Preview Sheet */}
        <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-500 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">{bookTitle}</h2>
              <p className="text-xs text-slate-500">होड़ कथा सुइट · A4 प्रिंटेबल अध्ययन पुस्तिका व अभ्यास शीट</p>
            </div>
            <button
              onClick={() =>
                speakWithFemaleVoice(
                  `${bookTitle}। ${bookletWords.map((w) => `${w.wordDevanagari}, ${w.meaningHindi}`).join('। ')}`,
                  { autoDetectLanguage: true }
                )
              }
              className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1.5 print:hidden cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>पूरी बुकलेट सुनें</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {bookletWords.map((w) => {
              const isDone = Boolean(checkedIds[w.id]);
              return (
                <div
                  key={w.id}
                  onClick={() => handleTogglePin(w.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                    isDone ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50/70 border-slate-200 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-base text-amber-900">{w.wordDevanagari}</span>
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">{w.wordRoman}</div>
                  <div className="text-xs font-bold text-slate-900">{w.meaningHindi}</div>
                  <div className="text-[11px] text-slate-600">{w.meaningEnglish}</div>
                </div>
              );
            })}
          </div>

          {includePhrases && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="text-sm font-black text-slate-900">प्रमुख बोलचाल वाक्यांश (Quick Reference Phrases)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {CORE_PHRASES_FOR_BOOKLET.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900">{p.sa}</div>
                      <div className="text-[11px] text-slate-600">{p.ro} — {p.hi}</div>
                    </div>
                    <button
                      onClick={() => speakWithFemaleVoice(`${p.sa}। ${p.hi}`, { autoDetectLanguage: true })}
                      className="p-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 print:hidden cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {includeExamMcqs && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="text-sm font-black text-slate-900">प्रतियोगी परीक्षा 2026 अभ्यास शीट (उत्तर-कुंजी सहित)</h3>
              <div className="space-y-2.5 text-xs">
                {examSetSample.map((q, idx) => (
                  <div key={q.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">
                      Q{idx + 1}. {q.question}
                    </div>
                    <div className="text-slate-700">
                      {q.options.map((o, oi) => `(${String.fromCharCode(65 + oi)}) ${o}`).join('   ')}
                    </div>
                    <div className="text-emerald-800 font-semibold pt-0.5">
                      सही उत्तर: ({String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {includeCurrentAffairs && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="text-sm font-black text-slate-900">करेंट अफेयर्स 2026 संक्षिप्त नोट्स (भारत + झारखंड)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {caSample.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">{c.titleHindi}</div>
                    <p className="text-slate-600">{c.summaryHindi}</p>
                    <p className="text-[11px] text-amber-900 font-medium">Santali: {c.santaliRoman}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
