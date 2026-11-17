import React, { useState, useMemo, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useUserAuth } from '../context/UserAuthContext';
import { speakWithFemaleVoice } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { SantaliWord } from '../types';
import {
  Brain,
  Volume2,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  TrendingUp,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';

interface SrsRecord {
  wordId: string;
  ease: number;
  intervalDays: number;
  repetitions: number;
  nextDueAt: number;
  lastRating: 'again' | 'hard' | 'easy';
  reviewedCount: number;
}

type SrsStore = Record<string, SrsRecord>;

const CATEGORY_LABELS_HI: Record<string, string> = {
  relation: 'रिश्ते-नाते (Relation)',
  food: 'भोजन व व्यंजन (Food)',
  nature: 'प्रकृति व वन (Nature)',
  culture: 'संस्कृति व पर्व (Culture)',
  action: 'क्रिया शब्द (Action)',
  animal: 'पशु-पक्षी (Animal)',
  fruit: 'फल व वनस्पति (Fruit)',
  body: 'शरीर के अंग (Body)',
  household: 'घर-परिवार (Household)',
  number_time: 'अंक व समय (Number/Time)',
  phrases: 'दैनिक वाक्यांश (Phrases)',
  common: 'सामान्य शब्द (Common)'
};

function getSrsStorageKey(email?: string | null): string {
  return email ? `hor_katha_srs_v1_${email.toLowerCase()}` : 'hor_katha_srs_v1_guest';
}

export const SantaliSmartRevisionCoach: React.FC = () => {
  const { words } = useAdmin();
  const { currentUser, isLoggedIn } = useUserAuth();
  const storageKey = getSrsStorageKey(currentUser?.email);

  const [srsMap, setSrsMap] = useState<SrsStore>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setSrsMap(raw ? JSON.parse(raw) : {});
    } catch {
      setSrsMap({});
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(srsMap));
    } catch {
      // ignore storage limit
    }
  }, [srsMap, storageKey]);

  const dailyGoal = currentUser?.preferences.dailyStudyGoalWords || 15;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sessionIndex, setSessionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedToday, setReviewedToday] = useState(0);

  const availableCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    words.forEach((w) => {
      const cat = w.category || 'common';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
  }, [words]);

  // Build smart queue: Due SRS cards first, then unseen high-utility words up to dailyGoal
  const revisionQueue = useMemo<SantaliWord[]>(() => {
    const now = Date.now();
    const pool =
      selectedCategory === 'all'
        ? words
        : words.filter((w) => (w.category || 'common') === selectedCategory);

    const dueWords: SantaliWord[] = [];
    const unseenWords: SantaliWord[] = [];

    for (const w of pool) {
      const rec = srsMap[w.id];
      if (!rec) {
        unseenWords.push(w);
      } else if (rec.nextDueAt <= now) {
        dueWords.push(w);
      }
    }

    dueWords.sort((a, b) => (srsMap[a.id]?.nextDueAt || 0) - (srsMap[b.id]?.nextDueAt || 0));
    const combined = [...dueWords, ...unseenWords].slice(0, Math.max(dailyGoal, 15));
    return combined.length > 0 ? combined : pool.slice(0, 15);
  }, [words, selectedCategory, srsMap, dailyGoal]);

  const currentWord = revisionQueue[sessionIndex % Math.max(1, revisionQueue.length)];

  const categoryAnalytics = useMemo(() => {
    const sampleCategories = availableCategories.slice(0, 8);
    return sampleCategories.map(([cat, total]) => {
      const catWords = words.filter((w) => (w.category || 'common') === cat);
      let mastered = 0;
      let learning = 0;
      for (const w of catWords) {
        const rec = srsMap[w.id];
        if (rec) {
          if (rec.repetitions >= 2 && rec.intervalDays >= 3) {
            mastered++;
          } else {
            learning++;
          }
        }
      }
      const targetBaseline = Math.min(total, 50);
      const pct = Math.min(100, Math.round(((mastered + learning * 0.4) / Math.max(1, targetBaseline)) * 100));
      return {
        cat,
        label: CATEGORY_LABELS_HI[cat] || cat,
        total,
        mastered,
        learning,
        pct
      };
    });
  }, [availableCategories, words, srsMap]);

  const totalMastered = useMemo(
    () => Object.values(srsMap).filter((r: SrsRecord) => r.repetitions >= 2).length,
    [srsMap]
  );
  const totalPracticed = Object.keys(srsMap).length;
  const dueCount = useMemo(() => {
    const now = Date.now();
    return Object.values(srsMap).filter((r: SrsRecord) => r.nextDueAt <= now).length;
  }, [srsMap]);

  const handleRateWord = (rating: 'again' | 'hard' | 'easy') => {
    if (!currentWord) return;
    const prev = srsMap[currentWord.id];
    const prevEase = prev?.ease ?? 2.5;
    const prevInterval = prev?.intervalDays ?? 0;
    const prevReps = prev?.repetitions ?? 0;

    let nextReps = prevReps;
    let nextInterval = 1;
    let nextEase = prevEase;

    if (rating === 'again') {
      nextReps = 0;
      nextInterval = 0.01; // due again in ~15 minutes
      nextEase = Math.max(1.3, prevEase - 0.2);
    } else if (rating === 'hard') {
      nextReps = prevReps + 1;
      nextInterval = prevReps === 0 ? 1 : Math.max(1, Math.round(prevInterval * 1.3));
      nextEase = Math.max(1.4, prevEase - 0.05);
    } else {
      nextReps = prevReps + 1;
      nextInterval = prevReps === 0 ? 3 : prevReps === 1 ? 6 : Math.round(prevInterval * prevEase);
      nextEase = Math.min(3.0, prevEase + 0.15);
    }

    const nextDueAt = Date.now() + nextInterval * 24 * 60 * 60 * 1000;
    setSrsMap((curr) => ({
      ...curr,
      [currentWord.id]: {
        wordId: currentWord.id,
        ease: nextEase,
        intervalDays: nextInterval,
        repetitions: nextReps,
        nextDueAt,
        lastRating: rating,
        reviewedCount: (prev?.reviewedCount || 0) + 1
      }
    }));

    setReviewedToday((n) => n + 1);
    setShowAnswer(false);
    setSessionIndex((idx) => (idx + 1) % Math.max(1, revisionQueue.length));
  };

  const handleResetProgress = () => {
    setSrsMap({});
    setSessionIndex(0);
    setReviewedToday(0);
    setShowAnswer(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold">
              <Brain className="w-4 h-4 text-amber-700" />
              <span>स्पेस्ड रिपिटिशन कोच (SM-2)</span>
              <span aria-hidden="true">·</span>
              <span>
                {isLoggedIn && currentUser
                  ? `${currentUser.displayName} (${currentUser.email})`
                  : 'अतिथि मोड (लोकल सेव)'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              स्मार्ट रिवीजन कोच — आज के {dailyGoal} ज़रूरी शब्द
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              आपके याद रखने और भूलने की गति के आधार पर रोज़ स्वचालित रिवीजन कार्ड तैयार होते हैं, ताकि संताली के कठिन शब्द भी स्थायी रूप से याद रहें।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                speakWithFemaleVoice(
                  'स्मार्ट रिवीजन कोच में आपका स्वागत है। आज के संताली शब्द सुनें और याद रखें।',
                  { autoDetectLanguage: true }
                )
              }
              className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>परिचय सुनें</span>
            </button>
            <button
              type="button"
              onClick={handleResetProgress}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>रीसेट</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Strip (Tabular Numerals) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500">आज दोहराए गए शब्द</div>
            <div className="text-2xl font-black text-slate-900 tabular-nums mt-0.5">
              {reviewedToday} / {dailyGoal}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="text-[11px] font-bold text-amber-800">पक्के याद (Mastered)</div>
            <div className="text-2xl font-black text-amber-950 tabular-nums mt-0.5">
              {totalMastered}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200">
            <div className="text-[11px] font-bold text-sky-800">कुल अभ्यास किए गए</div>
            <div className="text-2xl font-black text-sky-950 tabular-nums mt-0.5">
              {totalPracticed}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-800">अभी देय (Due Now)</div>
            <div className="text-2xl font-black text-emerald-950 tabular-nums mt-0.5">
              {dueCount}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 flex items-center gap-1.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('all');
            setSessionIndex(0);
            setShowAnswer(false);
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          सभी श्रेणियाँ ({words.length.toLocaleString()})
        </button>
        {availableCategories.map(([cat, count]) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setSelectedCategory(cat);
              setSessionIndex(0);
              setShowAnswer(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              selectedCategory === cat
                ? 'bg-amber-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {(CATEGORY_LABELS_HI[cat] || cat).split('(')[0].trim()} ({count})
          </button>
        ))}
      </div>

      {/* Main Two-Zone Split: Flashcard Stage + Category Mastery Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive SRS Stage (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {currentWord ? (
            <>
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>
                    कार्ड {sessionIndex + 1} / {revisionQueue.length}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{CATEGORY_LABELS_HI[currentWord.category] || currentWord.category}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {srsMap[currentWord.id]
                      ? `अभ्यास: ${srsMap[currentWord.id].reviewedCount} बार`
                      : 'नया शब्द'}
                  </span>
                </div>
              </div>

              {/* Prompt Card */}
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <p className="text-xs font-bold text-slate-500">संताली शब्द सुनें व अर्थ याद करें</p>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {currentWord.wordDevanagari}
                </h2>
                <p className="text-xl font-bold text-amber-800">
                  {toOlChikiAuto(currentWord.wordDevanagari)}
                </p>
                <p className="text-sm font-semibold text-slate-600">
                  {currentWord.wordRoman} · {currentWord.phonetic}
                </p>

                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      speakWithFemaleVoice(currentWord.wordDevanagari, { autoDetectLanguage: true })
                    }
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>उच्चारण सुनें</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAnswer((prev) => !prev)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{showAnswer ? 'उत्तर छुपाएं' : 'अर्थ व उदाहरण देखें'}</span>
                  </button>
                </div>
              </div>

              {/* Answer Reveal */}
              {showAnswer && (
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white border border-amber-100">
                      <div className="text-[11px] font-bold text-slate-500">हिन्दी अर्थ</div>
                      <div className="text-base font-black text-slate-900 mt-0.5">
                        {currentWord.meaningHindi}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-amber-100">
                      <div className="text-[11px] font-bold text-slate-500">English Meaning</div>
                      <div className="text-base font-bold text-slate-800 mt-0.5">
                        {currentWord.meaningEnglish}
                      </div>
                    </div>
                  </div>
                  {currentWord.exampleSantali && (
                    <div className="p-3.5 rounded-xl bg-white border border-amber-100 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-amber-800">वाक्य प्रयोग (Example)</span>
                        <button
                          type="button"
                          onClick={() =>
                            speakWithFemaleVoice(
                              `${currentWord.exampleSantali}. ${currentWord.exampleHindi}`,
                              { autoDetectLanguage: true }
                            )
                          }
                          className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>वाक्य सुनें</span>
                        </button>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{currentWord.exampleSantali}</p>
                      <p className="text-xs text-slate-600">{currentWord.exampleHindi}</p>
                    </div>
                  )}
                </div>
              )}

              {/* SM-2 Rating Controls */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-600 text-center">
                  आपको यह शब्द कितना याद रहा? (अगला रिवीजन समय इसी से तय होगा)
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleRateWord('again')}
                    className="py-3 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold flex flex-col items-center gap-0.5 cursor-pointer"
                  >
                    <span>भूल गया (Again)</span>
                    <span className="text-[10px] font-medium text-rose-700">15 मिनट में फिर</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRateWord('hard')}
                    className="py-3 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold flex flex-col items-center gap-0.5 cursor-pointer"
                  >
                    <span>थोड़ा याद है (Hard)</span>
                    <span className="text-[10px] font-medium text-amber-800">1–2 दिन बाद</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRateWord('easy')}
                    className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex flex-col items-center gap-0.5 cursor-pointer"
                  >
                    <span>पक्का याद है (Easy)</span>
                    <span className="text-[10px] font-medium text-emerald-100">3–7 दिन बाद</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              शब्दकोश से शब्द लोड हो रहे हैं...
            </div>
          )}
        </div>

        {/* Category Mastery Analytics Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>श्रेणी-वार दक्षता (Mastery %)</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">लक्ष्य: 50 शब्द/श्रेणी</span>
          </div>

          <div className="space-y-3">
            {categoryAnalytics.map((item) => (
              <div key={item.cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 truncate">{item.label}</span>
                  <span className="font-mono font-bold text-slate-700 tabular-nums shrink-0">
                    {item.mastered} याद · {item.pct}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(item.pct, item.mastered + item.learning > 0 ? 4 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>स्मार्ट नियम</span>
            </div>
            <p className="leading-relaxed">
              जो शब्द आप "भूल गया" चिह्नित करते हैं, वे तुरंत आपकी कतार में ऊपर आ जाते हैं। जब आप किसी शब्द को लगातार 2 बार सही पहचान लेते हैं, तो वह Mastered श्रेणी में जुड़ जाता है।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
