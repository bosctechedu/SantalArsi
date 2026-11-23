import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import { SantaliWord } from '../types';
import { speakWithFemaleVoice } from '../utils/speech';
import {
  Flame,
  Trophy,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Share2,
  Calendar,
  Check,
  Award,
  BookOpen,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface QuizQuestion {
  word: SantaliWord;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface StreakData {
  currentStreak: number;
  bestStreak: number;
  totalCompleted: number;
  totalScore: number;
  lastCompletedDate: string; // 'YYYY-MM-DD'
  history: Record<string, { date: string; score: number; total: number }>;
}

interface DailyQuizPoolStore {
  dailySets: Record<string, string[]>;
  usedWordIds: string[];
}

const DAILY_QUESTION_COUNT = 35;
const STORAGE_KEY = 'hk_daily_vocab_quiz_streak_v1';
const POOL_STORAGE_KEY = 'hk_daily_vocab_quiz_pool_v2';

function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDaySeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) + 17;
}

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffleArray<T>(array: T[], randFn?: () => number): T[] {
  const arr = [...array];
  const rand = randFn || Math.random;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function loadPoolStore(): DailyQuizPoolStore {
  try {
    const raw = localStorage.getItem(POOL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        dailySets: parsed?.dailySets && typeof parsed.dailySets === 'object' ? parsed.dailySets : {},
        usedWordIds: Array.isArray(parsed?.usedWordIds) ? parsed.usedWordIds : []
      };
    }
  } catch {
    // ignore storage errors
  }
  return { dailySets: {}, usedWordIds: [] };
}

function savePoolStore(store: DailyQuizPoolStore): void {
  try {
    // Keep only last 45 days in dailySets map so localStorage stays lean
    const dateKeys = Object.keys(store.dailySets).sort();
    const trimmedDailySets: Record<string, string[]> = {};
    for (const k of dateKeys.slice(-45)) {
      trimmedDailySets[k] = store.dailySets[k];
    }
    localStorage.setItem(
      POOL_STORAGE_KEY,
      JSON.stringify({
        dailySets: trimmedDailySets,
        usedWordIds: store.usedWordIds
      })
    );
  } catch {
    // ignore storage quota errors
  }
}

function buildQuestionsFromWords(
  selectedWords: SantaliWord[],
  allWords: SantaliWord[],
  seedBase: number,
  deterministic: boolean
): QuizQuestion[] {
  const total = allWords.length;
  return selectedWords.map((word, qIdx) => {
    const correctText = `${word.meaningEnglish} · ${word.meaningHindi}`;
    const randFn = deterministic ? seededRandom(seedBase + qIdx * 31 + 7) : Math.random;
    const distractors: SantaliWord[] = [];
    const usedMeanings = new Set<string>([word.meaningEnglish.trim().toLowerCase()]);
    const usedIds = new Set<string>([word.id]);
    let dSafety = 0;

    while (distractors.length < Math.min(3, total - 1) && dSafety < 180) {
      dSafety++;
      const cand = allWords[Math.floor(randFn() * total)];
      if (!cand || usedIds.has(cand.id)) continue;
      const mKey = (cand.meaningEnglish || '').trim().toLowerCase();
      if (!mKey || usedMeanings.has(mKey)) continue;
      usedIds.add(cand.id);
      usedMeanings.add(mKey);
      distractors.push(cand);
    }

    const options = [
      { id: `opt-correct-${word.id}`, text: correctText, isCorrect: true },
      ...distractors.map((o, idx) => ({
        id: `opt-wrong-${o.id}-${idx}`,
        text: `${o.meaningEnglish} · ${o.meaningHindi}`,
        isCorrect: false
      }))
    ];

    return {
      word,
      options: shuffleArray(options, randFn)
    };
  });
}

export const DailyVocabQuiz: React.FC<{
  compact?: boolean;
  onNavigateHome?: () => void;
  onExploreInDictionary?: () => void;
}> = ({ compact = false, onNavigateHome, onExploreInDictionary }) => {
  const { words } = useAdmin();

  const [streakData, setStreakData] = useState<StreakData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return {
      currentStreak: 0,
      bestStreak: 0,
      totalCompleted: 0,
      totalScore: 0,
      lastCompletedDate: '',
      history: {}
    };
  });

  const todayStr = getTodayDateStr();
  const yesterdayStr = getYesterdayDateStr();
  const isAlreadyCompletedToday = streakData.lastCompletedDate === todayStr;

  const [quizMode, setQuizMode] = useState<'daily' | 'practice'>('daily');
  const [practiceRound, setPracticeRound] = useState(0);
  const [poolVersion, setPoolVersion] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [poolNotice, setPoolNotice] = useState<string | null>(null);

  // Deduplicate dictionary words cleanly so no visually duplicate word ever appears
  const uniqueWords = useMemo(() => {
    if (!words || words.length === 0) return [];
    const seenIds = new Set<string>();
    const seenKeys = new Set<string>();
    const result: SantaliWord[] = [];
    for (const w of words) {
      if (!w?.id || !w.wordRoman || !w.meaningEnglish || !w.meaningHindi) continue;
      const key = `${w.wordRoman.trim().toLowerCase()}|${w.meaningEnglish.trim().toLowerCase()}`;
      if (seenIds.has(w.id) || seenKeys.has(key)) continue;
      seenIds.add(w.id);
      seenKeys.add(key);
      result.push(w);
    }
    return result;
  }, [words]);

  const wordMap = useMemo(() => {
    const map = new Map<string, SantaliWord>();
    for (const w of uniqueWords) map.set(w.id, w);
    return map;
  }, [uniqueWords]);

  // Select 35 strictly unique questions per calendar day (auto-changes every day, zero cross-day repeats!)
  const { questions, unseenRemainingCount, totalUsedCount } = useMemo(() => {
    if (uniqueWords.length === 0) {
      return { questions: [] as QuizQuestion[], unseenRemainingCount: 0, totalUsedCount: 0 };
    }

    const store = loadPoolStore();
    const usedSet = new Set<string>(store.usedWordIds);
    const targetCount = Math.min(DAILY_QUESTION_COUNT, uniqueWords.length);

    if (quizMode === 'daily') {
      const savedTodayIds = store.dailySets[todayStr];
      if (Array.isArray(savedTodayIds) && savedTodayIds.length >= Math.min(30, uniqueWords.length)) {
        const resolved = savedTodayIds
          .map((id) => wordMap.get(id))
          .filter((w): w is SantaliWord => Boolean(w));
        if (resolved.length >= Math.min(30, uniqueWords.length)) {
          return {
            questions: buildQuestionsFromWords(resolved, uniqueWords, getDaySeed(todayStr), true),
            unseenRemainingCount: Math.max(0, uniqueWords.length - usedSet.size),
            totalUsedCount: usedSet.size
          };
        }
      }

      // Fresh calendar day: draw 35 brand-new unseen words that never appeared on prior days
      const unseenPool = uniqueWords.filter((w) => !usedSet.has(w.id));
      const prng = seededRandom(getDaySeed(todayStr));
      const chosen: SantaliWord[] = [];

      if (unseenPool.length >= targetCount) {
        const pickedIdx = new Set<number>();
        let safety = 0;
        while (chosen.length < targetCount && safety < 2000) {
          safety++;
          const idx = Math.floor(prng() * unseenPool.length);
          if (!pickedIdx.has(idx)) {
            pickedIdx.add(idx);
            chosen.push(unseenPool[idx]);
          }
        }
      } else {
        // Take all remaining unseen words first, then recycle pool cleanly for any shortage
        chosen.push(...shuffleArray(unseenPool, prng));
        const chosenIds = new Set(chosen.map((w) => w.id));
        const refill = shuffleArray(
          uniqueWords.filter((w) => !chosenIds.has(w.id)),
          prng
        );
        for (const w of refill) {
          if (chosen.length >= targetCount) break;
          chosen.push(w);
        }
        // Reset historical used list cleanly on full exhaustion, keeping today's 35 locked
        usedSet.clear();
      }

      const chosenIds = chosen.map((w) => w.id);
      chosenIds.forEach((id) => usedSet.add(id));
      store.dailySets[todayStr] = chosenIds;
      store.usedWordIds = Array.from(usedSet);
      savePoolStore(store);

      return {
        questions: buildQuestionsFromWords(chosen, uniqueWords, getDaySeed(todayStr), true),
        unseenRemainingCount: Math.max(0, uniqueWords.length - usedSet.size),
        totalUsedCount: usedSet.size
      };
    }

    // Practice mode: strictly unseen 35-question batch, persisted to usedWordIds (zero repeat!)
    const unseenPool = uniqueWords.filter((w) => !usedSet.has(w.id));
    const chosen: SantaliWord[] = [];
    const prng = seededRandom(Date.now() + practiceRound * 997 + poolVersion * 131);

    if (unseenPool.length >= targetCount) {
      const pickedIdx = new Set<number>();
      let safety = 0;
      while (chosen.length < targetCount && safety < 2000) {
        safety++;
        const idx = Math.floor(prng() * unseenPool.length);
        if (!pickedIdx.has(idx)) {
          pickedIdx.add(idx);
          chosen.push(unseenPool[idx]);
        }
      }
    } else {
      chosen.push(...shuffleArray(unseenPool, prng));
      const chosenIds = new Set(chosen.map((w) => w.id));
      const refill = shuffleArray(
        uniqueWords.filter((w) => !chosenIds.has(w.id)),
        prng
      );
      for (const w of refill) {
        if (chosen.length >= targetCount) break;
        chosen.push(w);
      }
      usedSet.clear();
    }

    chosen.forEach((w) => usedSet.add(w.id));
    store.usedWordIds = Array.from(usedSet);
    savePoolStore(store);

    return {
      questions: buildQuestionsFromWords(chosen, uniqueWords, practiceRound * 97 + 11, false),
      unseenRemainingCount: Math.max(0, uniqueWords.length - usedSet.size),
      totalUsedCount: usedSet.size
    };
  }, [uniqueWords, wordMap, quizMode, todayStr, practiceRound, poolVersion]);

  const handleResetPool = useCallback(() => {
    try {
      localStorage.removeItem(POOL_STORAGE_KEY);
    } catch {
      // ignore
    }
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setUserAnswers([]);
    setIsFinished(false);
    setPoolVersion((v) => v + 1);
    setPoolNotice('प्रश्न पूल रीसेट हो गया — अब सभी शब्दों से नया 35-प्रश्न सेट तैयार है।');
    setTimeout(() => setPoolNotice(null), 4000);
  }, []);

  const handleSpeakWord = (word: SantaliWord) => {
    const textToSpeak = word.wordDevanagari || word.wordRoman;
    speakWithFemaleVoice(textToSpeak, { lang: 'hi-IN', rate: 0.85 });
  };

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (selectedOptionId !== null) return;
    setSelectedOptionId(optionId);
    setUserAnswers((prev) => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    const totalQ = questions.length;

    if (quizMode === 'daily') {
      const currentScore = userAnswers.filter(Boolean).length;
      setStreakData((prev) => {
        let newStreak = prev.currentStreak;
        if (prev.lastCompletedDate === todayStr) {
          newStreak = prev.currentStreak;
        } else if (prev.lastCompletedDate === yesterdayStr) {
          newStreak = prev.currentStreak + 1;
        } else {
          newStreak = 1;
        }

        const newBestStreak = Math.max(prev.bestStreak, newStreak);
        const updatedHistory = {
          ...prev.history,
          [todayStr]: {
            date: todayStr,
            score: currentScore,
            total: totalQ
          }
        };

        const updated: StreakData = {
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          totalCompleted: prev.totalCompleted + 1,
          totalScore: prev.totalScore + currentScore,
          lastCompletedDate: todayStr,
          history: updatedHistory
        };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore write error
        }

        return updated;
      });
    }
  };

  const handleStartPractice = () => {
    setQuizMode('practice');
    setPracticeRound((prev) => prev + 1);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setUserAnswers([]);
    setIsFinished(false);
  };

  const handleRestartDaily = () => {
    setQuizMode('daily');
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setUserAnswers([]);
    setIsFinished(false);
  };

  const handleCopyShare = () => {
    const score = userAnswers.filter(Boolean).length;
    const totalQ = questions.length;
    const accuracy = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;
    const shareText = `🔥 Santal आ़रसी Daily Santali Quiz #${todayStr}
Streak: ${streakData.currentStreak} Days | Score: ${score}/${totalQ} (${accuracy}%)
35 Unique Daily Questions · Zero Repeat
Test your Santali vocabulary at Santal आ़रसी (BOSC Tech & Edu)`;

    navigator.clipboard?.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  useEffect(() => {
    // Guard index if word pool changes
    if (currentIndex >= questions.length && questions.length > 0) {
      setCurrentIndex(0);
    }
  }, [questions.length, currentIndex]);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md mx-auto my-8">
        <BookOpen className="w-8 h-8 text-amber-600 mx-auto mb-2 animate-bounce" />
        <h3 className="font-bold text-slate-800">Loading Daily Quiz...</h3>
        <p className="text-xs text-slate-500 mt-1">Preparing today&apos;s {DAILY_QUESTION_COUNT} unique vocabulary words.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const score = userAnswers.filter(Boolean).length;
  const wrongCount = userAnswers.length - score;
  const totalQ = questions.length;
  const progressPct = Math.round(((currentIndex + (selectedOptionId ? 1 : 0)) / totalQ) * 100);

  return (
    <div className={`space-y-4 max-w-4xl mx-auto ${compact ? 'p-2 text-xs' : ''}`}>
      {/* Top Banner & Streak Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white p-4 sm:p-5 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-4">
          <Flame className="w-48 h-48 text-white -rotate-12" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <span>{todayStr}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{totalQ} Unique Today · No Repeat</span>
              </span>
              {quizMode === 'practice' && (
                <span className="px-2 py-0.5 rounded-full bg-amber-300 text-amber-950 text-[10px] font-extrabold uppercase tracking-wider">
                  Fresh Practice Batch #{practiceRound}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1.5 tracking-tight">
              Daily Santali Vocabulary Quiz ({totalQ} Questions / Day)
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 font-medium mt-0.5">
              हर दिन {DAILY_QUESTION_COUNT} नए अनदेखे प्रश्न अपने आप बदलते हैं · कोई प्रश्न रिपीट नहीं (अनदेखे शेष: {unseenRemainingCount.toLocaleString('en-IN')})
            </p>
          </div>

          {/* Gamified Streak & Best Score Cards */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="bg-white/15 border border-white/25 rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xs">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-100 block tracking-wider leading-none">
                  Streak
                </span>
                <span className="text-base sm:text-lg font-black leading-tight text-white">
                  {streakData.currentStreak} <span className="text-xs font-semibold">Days</span>
                </span>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/15 border border-white/25 rounded-2xl px-3.5 py-2 items-center gap-2.5 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-xs">
                <Trophy className="w-5 h-5 text-amber-950" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-100 block tracking-wider leading-none">
                  Best
                </span>
                <span className="text-base sm:text-lg font-black leading-tight text-white">
                  {streakData.bestStreak} <span className="text-xs font-semibold">Days</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher + Zero-Repeat Status Bar */}
      <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRestartDaily}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
              quizMode === 'daily'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            आज का डेली सेट ({DAILY_QUESTION_COUNT})
          </button>
          <button
            onClick={handleStartPractice}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              quizMode === 'practice'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>नए 35 अनदेखे प्रश्न (No Repeat)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
          <span className="font-mono tabular-nums">
            देखे गए: {totalUsedCount} / {uniqueWords.length}
          </span>
          <button
            type="button"
            onClick={handleResetPool}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 cursor-pointer"
            title="यदि आप सभी शब्द दोबारा अभ्यास करना चाहते हैं तो पूल रीसेट करें"
          >
            <RotateCcw className="w-3 h-3" />
            <span>पूल रीसेट</span>
          </button>
        </div>
      </div>

      {poolNotice && (
        <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
          ✓ {poolNotice}
        </div>
      )}

      {/* Screen 1: Already Completed Today Banner */}
      {isAlreadyCompletedToday && quizMode === 'daily' && isFinished === false && currentIndex === 0 && (
        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  आज का {totalQ}-प्रश्न चैलेंज पूरा हो चुका है!
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Completed
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                आपकी स्ट्रीक सुरक्षित है (🔥 {streakData.currentStreak} Days)। कल सुबह अपने आप {DAILY_QUESTION_COUNT} नए अनदेखे प्रश्न आएँगे — या अभी नए 35 Practice प्रश्न खेलें!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={handleStartPractice}
              className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>नए 35 अनदेखे प्रश्न</span>
            </button>
          </div>
        </div>
      )}

      {/* Screen 2: Active Quiz Card */}
      {!isFinished ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Clean Progress Bar Header for 35 Questions */}
          <div className="p-4 sm:p-5 border-b border-slate-100 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <span className="uppercase tracking-wider text-slate-600 font-mono tabular-nums">
                प्रश्न {currentIndex + 1} / {totalQ}
              </span>

              <div className="flex items-center gap-3 font-mono tabular-nums">
                <span className="flex items-center gap-1 text-emerald-700">
                  <Check className="w-4 h-4" /> {score} सही
                </span>
                <span className="flex items-center gap-1 text-rose-600">
                  <XCircle className="w-3.5 h-3.5" /> {wrongCount} गलत
                </span>
                <span className="text-slate-500">{progressPct}%</span>
              </div>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Word Presentation Hero Section */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-amber-50/50 via-white to-white text-center border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-3">
              <span>{currentQ.word.category || 'Vocabulary'}</span>
              <span>•</span>
              <span>{currentQ.word.partOfSpeech || 'Word'}</span>
            </div>

            <div className="space-y-1 my-2">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3">
                <span>{currentQ.word.wordRoman}</span>
                <button
                  onClick={() => handleSpeakWord(currentQ.word)}
                  title="Pronounce word"
                  className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors cursor-pointer shadow-2xs"
                >
                  <Volume2 className="w-5 h-5 text-amber-700" />
                </button>
              </h2>

              <div className="flex flex-wrap items-center justify-center gap-3 text-slate-600 pt-1">
                <span className="text-xl sm:text-2xl font-bold font-serif text-amber-900 bg-amber-50/80 px-3 py-0.5 rounded-lg border border-amber-200/50">
                  {currentQ.word.wordDevanagari}
                </span>
                <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-0.5 rounded-lg border border-slate-200">
                  संताली देवनागरी
                </span>
              </div>
            </div>

            {currentQ.word.phonetic && (
              <p className="text-xs text-slate-400 font-mono mt-2">
                Pronunciation: /{currentQ.word.phonetic}/
              </p>
            )}

            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-4">
              सही English और हिन्दी अर्थ चुनें (Select the correct meaning):
            </p>
          </div>

          {/* Options Grid */}
          <div className="p-4 sm:p-6 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedOptionId === option.id;
                const isAnswered = selectedOptionId !== null;

                let btnStyles =
                  'bg-slate-50/80 hover:bg-amber-50/50 hover:border-amber-300 border-slate-200 text-slate-800';

                if (isAnswered) {
                  if (option.isCorrect) {
                    btnStyles =
                      'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500/20 font-bold';
                  } else if (isSelected && !option.isCorrect) {
                    btnStyles =
                      'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-500/20 font-bold';
                  } else {
                    btnStyles = 'bg-slate-50/40 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={option.id}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(option.id, option.isCorrect)}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${btnStyles}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                        isAnswered && option.isCorrect
                          ? 'bg-emerald-500 text-white'
                          : isAnswered && isSelected && !option.isCorrect
                          ? 'bg-rose-500 text-white'
                          : 'bg-white border border-slate-300 text-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold flex-1 leading-snug">
                      {option.text}
                    </span>
                    {isAnswered && option.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && isSelected && !option.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation & Example sentence */}
            {selectedOptionId !== null && (
              <div
                className={`mt-4 p-4 rounded-xl border space-y-2 ${
                  currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-rose-50 border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    {currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-900">✓ सही उत्तर! (Correct) · व्याख्या व उदाहरण:</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span className="text-rose-900">
                          ✗ गलत उत्तर (Wrong) · सही अर्थ: {currentQ.word.meaningEnglish} · {currentQ.word.meaningHindi}
                        </span>
                      </>
                    )}
                  </span>
                  <button
                    onClick={() =>
                      speakWithFemaleVoice(
                        currentQ.word.exampleHindi || currentQ.word.exampleSantali,
                        { lang: 'hi-IN' }
                      )
                    }
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> सुनें
                  </button>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-semibold text-slate-800">
                    <span className="text-amber-700 font-bold">Santali: </span>
                    {currentQ.word.exampleSantali || `${currentQ.word.wordRoman} adi bhageya.`}
                  </p>
                  <p className="text-slate-600">
                    <span className="text-slate-500 font-medium">Hindi: </span>
                    {currentQ.word.exampleHindi || currentQ.word.meaningHindi}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    <span className="text-slate-400 font-medium">English: </span>
                    {currentQ.word.exampleEnglish || currentQ.word.meaningEnglish}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>{currentIndex + 1 === totalQ ? 'परिणाम देखें (Finish & Results)' : 'अगला प्रश्न (Next)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Screen 3: Results & Celebration Screen */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6 text-center">
          <div className="relative inline-block mx-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-lg mx-auto">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-md">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              {quizMode === 'daily' ? `Today's ${totalQ}-Word Challenge Completed!` : `Fresh ${totalQ}-Word Practice Completed!`}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Johar! {score === totalQ ? `Perfect ${score}/${totalQ} Score!` : `You Scored ${score} / ${totalQ}!`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {score === totalQ
                ? 'Outstanding mastery of Santali vocabulary! Tomorrow brings 35 brand-new unique words.'
                : 'अच्छा प्रयास! नीचे दिए गए सभी शब्दों की समीक्षा करें। कल फिर 35 बिल्कुल नए अनदेखे प्रश्न आएँगे।'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/60">
              <div className="flex items-center justify-center gap-1 text-amber-700 mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Streak</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-amber-950">
                {streakData.currentStreak} <span className="text-xs font-semibold">Days</span>
              </span>
            </div>

            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/60">
              <div className="flex items-center justify-center gap-1 text-emerald-700 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Accuracy</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-emerald-950">
                {Math.round((score / totalQ) * 100)}%
              </span>
            </div>

            <div className="p-3 bg-sky-50/80 rounded-2xl border border-sky-200/60">
              <div className="flex items-center justify-center gap-1 text-sky-700 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">XP Earned</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-sky-950">
                +{score * 10} XP
              </span>
            </div>

            <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200/60">
              <div className="flex items-center justify-center gap-1 text-purple-700 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Completed</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-purple-950">
                {streakData.totalCompleted}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCopyShare}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedShare ? 'Copied to Clipboard!' : 'Share Scorecard'}</span>
            </button>

            <button
              onClick={handleStartPractice}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>नए {DAILY_QUESTION_COUNT} अनदेखे प्रश्न खेलें</span>
            </button>

            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Back to Home Dashboard
              </button>
            )}
          </div>

          {/* Review of Today's 35 Words */}
          <div className="pt-6 border-t border-slate-100 text-left">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>आज के सभी {totalQ} शब्दों की समीक्षा (Full Review):</span>
              </h3>
              {onExploreInDictionary && (
                <button
                  onClick={onExploreInDictionary}
                  className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  View in Dictionary →
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const wasCorrect = userAnswers[idx];
                return (
                  <div
                    key={q.word.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            wasCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {wasCorrect ? '✓' : '✗'}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {idx + 1}. {q.word.wordRoman}
                        </h4>
                        <span className="text-xs font-serif text-amber-800">
                          ({q.word.wordDevanagari})
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        <strong>English: </strong>
                        {q.word.meaningEnglish}
                      </p>
                      <p className="text-xs text-slate-500">
                        <strong>Hindi: </strong>
                        {q.word.meaningHindi}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSpeakWord(q.word)}
                      title="Listen pronunciation"
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-amber-50 text-amber-700 shrink-0 cursor-pointer shadow-2xs"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
