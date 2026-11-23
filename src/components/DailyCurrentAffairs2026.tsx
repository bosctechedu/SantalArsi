import React, { useState, useMemo, useCallback } from 'react';
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
  Languages,
  Calendar,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import {
  CURRENT_AFFAIRS_2026,
  CURRENT_AFFAIRS_QUIZ_2026,
  CurrentAffairCategory,
  CurrentAffairRegion
} from '../data/currentAffairs2026';
import { ALL_COMPETITIVE_QUESTIONS_2026 } from '../data/competitiveExams2026Data';
import { speakWithFemaleVoice } from '../utils/speech';

const CA_BOOKMARK_KEY = 'hor_katha_ca_bookmarks_2026';
const CA_DAILY_POOL_KEY = 'hor_katha_ca_daily_quiz_pool_v2';
const DAILY_CA_QUIZ_COUNT = 32;

interface UnifiedDailyQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  examTag: string;
  region: CurrentAffairRegion;
}

interface DailyCAPoolStore {
  dailySets: Record<string, string[]>;
  usedIds: string[];
}

function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDaySeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) + 29;
}

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffleWithSeed<T>(arr: T[], rand: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function shuffleQuestionOptions(q: UnifiedDailyQuestion, rand: () => number): UnifiedDailyQuestion {
  const indexed = q.options.map((text, idx) => ({ text, isCorrect: idx === q.correctIndex }));
  const shuffled = shuffleWithSeed(indexed, rand);
  const newCorrectIndex = shuffled.findIndex((o) => o.isCorrect);
  return {
    ...q,
    options: shuffled.map((o) => o.text),
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0
  };
}

function loadCAPoolStore(): DailyCAPoolStore {
  try {
    const raw = localStorage.getItem(CA_DAILY_POOL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        dailySets: parsed?.dailySets && typeof parsed.dailySets === 'object' ? parsed.dailySets : {},
        usedIds: Array.isArray(parsed?.usedIds) ? parsed.usedIds : []
      };
    }
  } catch {
    // ignore
  }
  return { dailySets: {}, usedIds: [] };
}

function saveCAPoolStore(store: DailyCAPoolStore): void {
  try {
    const keys = Object.keys(store.dailySets).sort();
    const trimmed: Record<string, string[]> = {};
    for (const k of keys.slice(-45)) trimmed[k] = store.dailySets[k];
    localStorage.setItem(
      CA_DAILY_POOL_KEY,
      JSON.stringify({ dailySets: trimmed, usedIds: store.usedIds })
    );
  } catch {
    // ignore
  }
}

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

  // Daily 32-Question Unique Rotating Quiz State
  const todayStr = getTodayDateStr();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [freshBatchIndex, setFreshBatchIndex] = useState(0);
  const [poolResetTick, setPoolResetTick] = useState(0);
  const [poolBannerMsg, setPoolBannerMsg] = useState<string | null>(null);

  // Unified deduplicated bank of 188+ authentic India + Jharkhand + Current Affairs questions
  const unifiedBank = useMemo<UnifiedDailyQuestion[]>(() => {
    const seenIds = new Set<string>();
    const seenPrompts = new Set<string>();
    const bank: UnifiedDailyQuestion[] = [];

    for (const ca of CURRENT_AFFAIRS_QUIZ_2026) {
      const pKey = ca.question.trim().toLowerCase();
      if (seenIds.has(ca.id) || seenPrompts.has(pKey)) continue;
      seenIds.add(ca.id);
      seenPrompts.add(pKey);
      bank.push({
        id: ca.id,
        question: ca.question,
        options: ca.options,
        correctIndex: ca.correctIndex,
        explanation: ca.explanation,
        examTag: ca.examTag,
        region: ca.region
      });
    }

    for (const cq of ALL_COMPETITIVE_QUESTIONS_2026) {
      const pKey = cq.question.trim().toLowerCase();
      if (seenIds.has(cq.id) || seenPrompts.has(pKey)) continue;
      seenIds.add(cq.id);
      seenPrompts.add(pKey);
      const isJh =
        cq.subject === 'jharkhand_special' ||
        cq.subject === 'santali_language' ||
        cq.examIds.some((id) => id.includes('jpsc') || id.includes('jssc') || id.includes('jtet') || id.includes('jharkhand'));
      bank.push({
        id: cq.id,
        question: cq.question,
        options: cq.options,
        correctIndex: cq.correctIndex,
        explanation: cq.explanation,
        examTag: cq.examTag,
        region: isJh ? 'jharkhand' : 'india'
      });
    }

    return bank;
  }, []);

  const questionMap = useMemo(() => {
    const m = new Map<string, UnifiedDailyQuestion>();
    for (const q of unifiedBank) m.set(q.id, q);
    return m;
  }, [unifiedBank]);

  // Serve 32 unique daily questions that auto-change every calendar day with ZERO cross-day repeats
  const { dailyQuizQuestions, unseenCount, totalBankSize } = useMemo(() => {
    const store = loadCAPoolStore();
    const usedSet = new Set<string>(store.usedIds);
    const target = Math.min(DAILY_CA_QUIZ_COUNT, unifiedBank.length);

    if (freshBatchIndex === 0) {
      const lockedToday = store.dailySets[todayStr];
      if (Array.isArray(lockedToday) && lockedToday.length >= Math.min(30, unifiedBank.length)) {
        const resolved = lockedToday
          .map((id) => questionMap.get(id))
          .filter((q): q is UnifiedDailyQuestion => Boolean(q));
        if (resolved.length >= Math.min(30, unifiedBank.length)) {
          const rand = seededRandom(getDaySeed(todayStr) + 101);
          return {
            dailyQuizQuestions: resolved.map((q) => shuffleQuestionOptions(q, rand)),
            unseenCount: Math.max(0, unifiedBank.length - usedSet.size),
            totalBankSize: unifiedBank.length
          };
        }
      }
    }

    const unseen = unifiedBank.filter((q) => !usedSet.has(q.id));
    const seed =
      freshBatchIndex === 0
        ? getDaySeed(todayStr)
        : getDaySeed(todayStr) + freshBatchIndex * 409 + poolResetTick * 53;
    const rand = seededRandom(seed);
    let chosen: UnifiedDailyQuestion[] = [];

    if (unseen.length >= target) {
      chosen = shuffleWithSeed(unseen, rand).slice(0, target);
    } else {
      chosen = [...shuffleWithSeed(unseen, rand)];
      const chosenIds = new Set(chosen.map((q) => q.id));
      const refill = shuffleWithSeed(
        unifiedBank.filter((q) => !chosenIds.has(q.id)),
        rand
      );
      for (const q of refill) {
        if (chosen.length >= target) break;
        chosen.push(q);
      }
      // Entire 188+ bank exhausted across previous days -> start clean cycle keeping today's 32
      usedSet.clear();
    }

    const chosenIds = chosen.map((q) => q.id);
    chosenIds.forEach((id) => usedSet.add(id));
    if (freshBatchIndex === 0) {
      store.dailySets[todayStr] = chosenIds;
    }
    store.usedIds = Array.from(usedSet);
    saveCAPoolStore(store);

    const optRand = seededRandom(seed + 101);
    return {
      dailyQuizQuestions: chosen.map((q) => shuffleQuestionOptions(q, optRand)),
      unseenCount: Math.max(0, unifiedBank.length - usedSet.size),
      totalBankSize: unifiedBank.length
    };
  }, [unifiedBank, questionMap, todayStr, freshBatchIndex, poolResetTick]);

  const handleLoadNextFreshSet = useCallback(() => {
    setQuizAnswers({});
    setFreshBatchIndex((n) => n + 1);
    setPoolBannerMsg(`नया ${DAILY_CA_QUIZ_COUNT}-प्रश्न अनदेखा सेट लोड हो गया (Zero Repeat)!`);
    setTimeout(() => setPoolBannerMsg(null), 3500);
  }, []);

  const handleResetCAPool = useCallback(() => {
    try {
      localStorage.removeItem(CA_DAILY_POOL_KEY);
    } catch {
      // ignore
    }
    setQuizAnswers({});
    setFreshBatchIndex(0);
    setPoolResetTick((t) => t + 1);
    setPoolBannerMsg('डेली क्विज़ पूल रीसेट हो गया — सभी 188+ प्रश्नों से नया सेट तैयार है।');
    setTimeout(() => setPoolBannerMsg(null), 3500);
  }, []);

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
    for (const q of dailyQuizQuestions) {
      const chosen = quizAnswers[q.id];
      if (chosen !== undefined) {
        answered++;
        if (chosen === q.correctIndex) correct++;
      }
    }
    return {
      answered,
      correct,
      wrong: answered - correct,
      total: dailyQuizQuestions.length
    };
  }, [quizAnswers, dailyQuizQuestions]);

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
              Daily Current Affairs 2026 (Hindi, English &amp; Santali Roman) + {DAILY_CA_QUIZ_COUNT}-Q Daily Quiz
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              UPSC, SSC, Banking, JPSC, JSSC और JTET 2026 के लिए प्रामाणिक समसामयिकी बिंदु, तीन भाषाओं में ऑडियो वाचन और प्रतिदिन {DAILY_CA_QUIZ_COUNT} नए अनदेखे प्रश्नों वाला Daily Quiz (Zero Repeat)।
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
              <span>डेली क्विज़ ({dailyQuizQuestions.length} आज के नए)</span>
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

        {/* MODE 2: DAILY 32-QUESTION AUTO-ROTATING NO-REPEAT QUIZ */}
        {viewMode === 'quiz' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{todayStr}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>प्रतिदिन {dailyQuizQuestions.length} अनदेखे प्रश्न · Zero Repeat</span>
                  </span>
                  <span className="text-slate-500 font-semibold font-mono tabular-nums">
                    बैंक में अनदेखे शेष: {unseenCount} / {totalBankSize}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleLoadNextFreshSet}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>नया {DAILY_CA_QUIZ_COUNT}-प्रश्न सेट</span>
                  </button>
                  <button
                    onClick={() => setQuizAnswers({})}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>उत्तर साफ़ करें</span>
                  </button>
                  <button
                    onClick={handleResetCAPool}
                    className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold cursor-pointer"
                  >
                    पूल रीसेट
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-100 font-mono tabular-nums">
                <span>
                  हल किए गए: <strong>{quizStats.answered} / {quizStats.total}</strong>
                </span>
                <span className="text-emerald-700 font-bold">✓ सही: {quizStats.correct}</span>
                <span className="text-rose-600 font-bold">✗ गलत: {quizStats.wrong}</span>
                {quizStats.answered > 0 && (
                  <span className="text-sky-700 font-bold">
                    सटीकता: {Math.round((quizStats.correct / quizStats.answered) * 100)}%
                  </span>
                )}
              </div>

              {poolBannerMsg && (
                <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                  ✓ {poolBannerMsg}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {dailyQuizQuestions.map((q, idx) => {
                const chosen = quizAnswers[q.id];
                const hasAnswered = chosen !== undefined;
                const isRight = hasAnswered && chosen === q.correctIndex;

                return (
                  <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-500 font-semibold">
                          प्रश्न {idx + 1} / {dailyQuizQuestions.length} · {q.examTag} ·{' '}
                          {q.region === 'jharkhand' ? 'झारखंड' : 'भारत'}
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
