import React, { useState, useMemo } from 'react';
import {
  Newspaper,
  Volume2,
  Bookmark,
  CheckCircle2,
  XCircle,
  Globe,
  MapPin,
  HelpCircle,
  RotateCcw,
  Languages
} from 'lucide-react';
import {
  CURRENT_AFFAIRS_2026,
  CURRENT_AFFAIRS_QUIZ_2026,
  CurrentAffairCategory,
  CurrentAffairRegion
} from '../data/currentAffairs2026';
import { speakWithFemaleVoice } from '../utils/speech';

const CA_BOOKMARK_KEY = 'hor_katha_ca_bookmarks_2026';

export const DailyCurrentAffairs2026: React.FC = () => {
  const [viewMode, setViewMode] = useState<'feed' | 'quiz'>('feed');
  const [regionFilter, setRegionFilter] = useState<'all' | CurrentAffairRegion>('all');
  const [catFilter, setCatFilter] = useState<'all' | CurrentAffairCategory>('all');
  const [readLang, setReadLang] = useState<'hindi' | 'english' | 'santali'>('hindi');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CA_BOOKMARK_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Mini Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(CA_BOOKMARK_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    return CURRENT_AFFAIRS_2026.filter((item) => {
      if (regionFilter !== 'all' && item.region !== regionFilter) return false;
      if (catFilter !== 'all' && item.category !== catFilter) return false;
      if (onlyBookmarked && !bookmarks.includes(item.id)) return false;
      return true;
    });
  }, [regionFilter, catFilter, onlyBookmarked, bookmarks]);

  const quizStats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    for (const q of CURRENT_AFFAIRS_QUIZ_2026) {
      const chosen = quizAnswers[q.id];
      if (chosen !== undefined) {
        answered++;
        if (chosen === q.correctIndex) correct++;
      }
    }
    return { answered, correct, total: CURRENT_AFFAIRS_QUIZ_2026.length };
  }, [quizAnswers]);

  const handleReadItem = (item: (typeof CURRENT_AFFAIRS_2026)[number]) => {
    if (readLang === 'english') {
      speakWithFemaleVoice(`${item.titleEnglish}. ${item.summaryEnglish}`, {
        lang: 'en-IN',
        readingLangMode: 'english',
        autoDetectLanguage: false
      });
    } else if (readLang === 'santali') {
      speakWithFemaleVoice(item.santaliRoman, {
        readingLangMode: 'santali_roman',
        autoDetectLanguage: true
      });
    } else {
      speakWithFemaleVoice(`${item.titleHindi}। ${item.summaryHindi}`, {
        lang: 'hi-IN',
        readingLangMode: 'hindi',
        autoDetectLanguage: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Institutional Header */}
        <header className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-800">
              <Newspaper className="w-4 h-4 shrink-0" />
              <span>करेंट अफेयर्स 2026</span>
              <span aria-hidden="true">·</span>
              <span>भारत राष्ट्रीय + झारखंड विशेष</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 text-balance">
              Daily Current Affairs 2026 (Hindi, English &amp; Santali Roman) + Mini Quiz
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              UPSC, SSC, Banking, JPSC, JSSC और JTET 2026 के लिए प्रामाणिक समसामयिकी बिंदु, तीन भाषाओं में ऑडियो वाचन और तुरंत अभ्यास क्विज़।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('feed')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                viewMode === 'feed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5 text-amber-700" />
              <span>मुख्य करेंट बिंदु ({CURRENT_AFFAIRS_2026.length})</span>
            </button>
            <button
              onClick={() => setViewMode('quiz')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                viewMode === 'quiz' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>डेली मिनी क्विज़ ({CURRENT_AFFAIRS_QUIZ_2026.length})</span>
            </button>
          </div>
        </header>

        {/* MODE 1: CURRENT AFFAIRS FEED */}
        {viewMode === 'feed' && (
          <div className="space-y-4">
            {/* Filters & Language Selector */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setRegionFilter('all')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                      regionFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    सभी क्षेत्र
                  </button>
                  <button
                    onClick={() => setRegionFilter('india')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                      regionFilter === 'india' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-700" />
                    <span>भारत</span>
                  </button>
                  <button
                    onClick={() => setRegionFilter('jharkhand')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                      regionFilter === 'jharkhand' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>झारखंड</span>
                  </button>
                </div>

                <select
                  value={catFilter}
                  onChange={(e) => setCatFilter(e.target.value as 'all' | CurrentAffairCategory)}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <option value="all">सभी विषय</option>
                  <option value="governance">संविधान व प्रशासन</option>
                  <option value="economy_schemes">योजनाएं व अर्थव्यवस्था</option>
                  <option value="science_awards">विज्ञान, शिक्षा व तकनीक</option>
                  <option value="culture_heritage">संस्कृति, कला व भाषा</option>
                </select>

                <button
                  onClick={() => setOnlyBookmarked((v) => !v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 cursor-pointer ${
                    onlyBookmarked
                      ? 'bg-amber-50 border-amber-400 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>सहेजे गए ({bookmarks.length})</span>
                </button>
              </div>

              {/* 3-Language Audio & Display Mode */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5" /> भाषा:
                </span>
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  {(
                    [
                      { id: 'hindi', label: 'हिन्दी' },
                      { id: 'english', label: 'English' },
                      { id: 'santali', label: 'Santali Roman' }
                    ] as const
                  ).map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setReadLang(lang.id)}
                      className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                        readLang === lang.id ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-white'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
                चुने गए फ़िल्टर में कोई करेंट अफेयर्स बिंदु नहीं मिला। फ़िल्टर बदलें।
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => {
                  const isSaved = bookmarks.includes(item.id);
                  return (
                    <article
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3.5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-amber-800">{item.dateLabel}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium text-slate-700">{item.examRelevance}</span>
                          </div>
                          <h2 className="text-base sm:text-lg font-bold text-slate-900">
                            {readLang === 'english' ? item.titleEnglish : item.titleHindi}
                          </h2>
                          {readLang !== 'english' && (
                            <p className="text-xs text-slate-500 font-medium">{item.titleEnglish}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleReadItem(item)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                            title="चुनी हुई भाषा में सुनें"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                            <span>सुनें</span>
                          </button>
                          <button
                            onClick={() => toggleBookmark(item.id)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                              isSaved
                                ? 'bg-amber-50 border-amber-400 text-amber-900'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>{isSaved ? 'सहेजा गया' : 'सहेजें'}</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed">
                        {readLang === 'english'
                          ? item.summaryEnglish
                          : readLang === 'santali'
                          ? item.santaliRoman
                          : item.summaryHindi}
                      </p>

                      {readLang !== 'santali' && (
                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950">
                          <strong>Santali Roman:</strong> {item.santaliRoman}
                        </div>
                      )}

                      <ul className="space-y-1.5 text-xs text-slate-700 pt-1">
                        {item.keyFacts.map((fact, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-mono font-bold text-amber-700 shrink-0">•</span>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MODE 2: DAILY CURRENT AFFAIRS MINI QUIZ */}
        {viewMode === 'quiz' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-slate-700">
                हल किए गए: <strong className="font-mono tabular-nums">{quizStats.answered} / {quizStats.total}</strong>
                <span aria-hidden="true" className="mx-2">·</span>
                सही उत्तर: <strong className="font-mono tabular-nums text-emerald-700">{quizStats.correct}</strong>
              </div>
              <button
                onClick={() => setQuizAnswers({})}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>क्विज़ रीसेट करें</span>
              </button>
            </div>

            <div className="space-y-4">
              {CURRENT_AFFAIRS_QUIZ_2026.map((q, idx) => {
                const chosen = quizAnswers[q.id];
                const hasAnswered = chosen !== undefined;
                const isRight = hasAnswered && chosen === q.correctIndex;

                return (
                  <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-500 font-semibold">
                          प्रश्न {idx + 1} · {q.examTag} · {q.region === 'jharkhand' ? 'झारखंड' : 'भारत'}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">{q.question}</h3>
                      </div>
                      <button
                        onClick={() =>
                          speakWithFemaleVoice(`प्रश्न ${idx + 1}: ${q.question}`, { lang: 'hi-IN' })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                        <span>सुनें</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      {q.options.map((opt, optIdx) => {
                        const isTrueOpt = optIdx === q.correctIndex;
                        const isWrongChosen = hasAnswered && chosen === optIdx && !isTrueOpt;
                        const isRightReveal = hasAnswered && isTrueOpt;

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={hasAnswered}
                            onClick={() => {
                              if (hasAnswered) return;
                              setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                            }}
                            className={`text-left px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors ${
                              isRightReveal
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                                : isWrongChosen
                                ? 'bg-rose-50 border-rose-400 text-rose-900 font-semibold'
                                : !hasAnswered
                                ? 'bg-slate-50 hover:bg-sky-50 hover:border-sky-300 border-slate-200 text-slate-800 cursor-pointer'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span>
                              <strong className="font-mono text-xs mr-2 text-slate-500">
                                ({String.fromCharCode(65 + optIdx)})
                              </strong>
                              {opt}
                            </span>
                            {isRightReveal && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                            {isWrongChosen && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <div
                        className={`p-3 rounded-xl border text-xs leading-relaxed ${
                          isRight
                            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/80 border-rose-200 text-rose-950'
                        }`}
                      >
                        <div className="font-bold mb-0.5">
                          {isRight
                            ? '✓ बिल्कुल सही उत्तर!'
                            : `✗ गलत उत्तर! सही उत्तर (${String.fromCharCode(65 + q.correctIndex)}) है।`}
                        </div>
                        <p className="text-slate-700">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
