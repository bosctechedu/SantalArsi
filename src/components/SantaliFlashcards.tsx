import React, { useState, useMemo, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { SantaliWord } from '../types';
import { speakWithFemaleVoice } from '../utils/speech';
import {
  Layers,
  RotateCw,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  Clock,
  CalendarCheck,
  RotateCcw
} from 'lucide-react';

interface SrsRecord {
  wordId: string;
  intervalDays: number;
  nextReviewAt: number;
  reviews: number;
}

const SRS_STORAGE_KEY = 'hor_katha_srs_cards';
const DAY_MS = 24 * 60 * 60 * 1000;

function loadSrsMap(): Record<string, SrsRecord> {
  try {
    const raw = localStorage.getItem(SRS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export const SantaliFlashcards: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { words } = useAdmin();
  const [srsMap, setSrsMap] = useState<Record<string, SrsRecord>>(() => loadSrsMap());
  const [deckFilter, setDeckFilter] = useState<'due' | 'all'>('due');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(srsMap));
    } catch {
      // ignore storage quota errors
    }
  }, [srsMap]);

  const mountTimestamp = useMemo(() => Date.now(), []);

  const dueWords = useMemo(() => {
    return words.filter((w) => {
      const rec = srsMap[w.id];
      return !rec || rec.nextReviewAt <= mountTimestamp;
    });
  }, [words, srsMap, mountTimestamp]);

  const masteredWordsCount = useMemo(() => {
    return Object.values(srsMap).filter((rec) => rec.intervalDays >= 7).length;
  }, [srsMap]);

  const activeDeck = useMemo(() => {
    if (deckFilter === 'due' && dueWords.length > 0) {
      return dueWords;
    }
    return words;
  }, [deckFilter, dueWords, words]);

  const safeIndex = activeDeck.length > 0 ? currentIndex % activeDeck.length : 0;
  const currentWord: SantaliWord | undefined = activeDeck[safeIndex];
  const currentSrs = currentWord ? srsMap[currentWord.id] : undefined;

  const handleNext = () => {
    setIsFlipped(false);
    if (activeDeck.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (activeDeck.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
  };

  const handleRandom = () => {
    setIsFlipped(false);
    if (activeDeck.length <= 1) return;
    const rand = Math.floor(Math.random() * activeDeck.length);
    setCurrentIndex(rand);
  };

  const handleListen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentWord) return;
    speakWithFemaleVoice(
      `${currentWord.wordDevanagari}. ${currentWord.meaningHindi}. ${currentWord.meaningEnglish}`,
      { autoDetectLanguage: true }
    );
  };

  const handleSrsGrade = (e: React.MouseEvent, days: 0 | 3 | 7) => {
    e.stopPropagation();
    if (!currentWord) return;

    const currentTime = Date.now();
    const prevRec = srsMap[currentWord.id];
    const nextReviewAt = days === 0 ? currentTime : currentTime + days * DAY_MS;

    setSrsMap((prev) => ({
      ...prev,
      [currentWord.id]: {
        wordId: currentWord.id,
        intervalDays: days,
        nextReviewAt,
        reviews: (prevRec?.reviews || 0) + 1
      }
    }));

    setIsFlipped(false);
    if (days === 0 && deckFilter === 'due') {
      // Move to next card if marked hard so user sees another due card before retrying
      setCurrentIndex((prev) => (activeDeck.length > 1 ? (prev + 1) % activeDeck.length : 0));
    } else if (deckFilter === 'all') {
      setCurrentIndex((prev) => (activeDeck.length > 0 ? (prev + 1) % activeDeck.length : 0));
    } else {
      // In due mode with days > 0, the current card leaves dueWords, so keep safe index within remaining due cards
      setCurrentIndex((prev) => (dueWords.length > 1 ? prev % (dueWords.length - 1) : 0));
    }
  };

  const handleResetSrs = () => {
    setSrsMap({});
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!words.length) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="font-bold text-slate-700">शब्दकोश फ़्लैशकार्ड लोड हो रहे हैं...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 max-w-2xl mx-auto ${compact ? 'p-1 text-xs' : 'pb-12'}`}>
      {/* Institutional Header Banner */}
      <header className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-700">
            <Layers className="w-4 h-4 shrink-0" />
            <span>Spaced Repetition System (SRS) · वैज्ञानिक स्मृति अभ्यास</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            संताली स्मार्ट फ़्लैशकार्ड्स (Smart Flashcards)
          </h1>
          <p className="text-xs text-slate-600">
            कार्ड पर टैप करके अर्थ देखें और याददाश्त के अनुसार अगली पुनरावृत्ति का समय चुनें।
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-right">
            <div className="text-[10px] font-bold uppercase text-amber-800">आज दोहराएँ</div>
            <div className="text-base font-black font-mono tabular-nums text-amber-950">
              {dueWords.length}
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-right">
            <div className="text-[10px] font-bold uppercase text-emerald-800">पक्के याद (7d+)</div>
            <div className="text-base font-black font-mono tabular-nums text-emerald-950">
              {masteredWordsCount}
            </div>
          </div>
        </div>
      </header>

      {/* Deck Mode Toggle & Reset */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setDeckFilter('due');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              deckFilter === 'due'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            आज दोहराएँ ({dueWords.length})
          </button>
          <button
            onClick={() => {
              setDeckFilter('all');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              deckFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            सभी कार्ड ({words.length})
          </button>
        </div>

        <button
          onClick={handleResetSrs}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          title="SRS शेड्यूल रीसेट करें"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>शेड्यूल रीसेट</span>
        </button>
      </div>

      {/* All Due Cards Completed Banner */}
      {deckFilter === 'due' && dueWords.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h2 className="text-lg font-bold text-emerald-950">
            बधाई हो! आज के सभी निर्धारित शब्द दोहराए जा चुके हैं।
          </h2>
          <p className="text-xs text-emerald-800">
            आप "सभी कार्ड" मोड चुनकर किसी भी समय अतिरिक्त अभ्यास जारी रख सकते हैं।
          </p>
          <button
            onClick={() => setDeckFilter('all')}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer"
          >
            सभी {words.length} कार्ड खोलें →
          </button>
        </div>
      )}

      {/* Flip Card */}
      {currentWord && !(deckFilter === 'due' && dueWords.length === 0) && (
        <>
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[340px] rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-colors cursor-pointer p-6 sm:p-8 flex flex-col justify-between select-none"
          >
            {/* Card Metadata Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-bold text-violet-800">{currentWord.category || 'शब्दावली'}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums font-semibold">
                  कार्ड {safeIndex + 1} / {activeDeck.length}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500">
                  {currentSrs
                    ? currentSrs.intervalDays > 0
                      ? `अंतराल: ${currentSrs.intervalDays} दिन`
                      : 'आज दोबारा अभ्यास'
                    : 'नया शब्द'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleListen}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="तीनों भाषाओं में सुनें"
                >
                  <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                  <span>सुनें</span>
                </button>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" /> पलटें
                </span>
              </div>
            </div>

            {/* Card Content (Front vs Back) */}
            {!isFlipped ? (
              <div className="my-auto text-center py-8 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                  संताली देवनागरी व रोमन (Tap to Reveal Meaning)
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {currentWord.wordDevanagari}
                </h2>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg sm:text-xl font-bold font-mono text-slate-800 bg-slate-100 px-4 py-1 rounded-xl border border-slate-200">
                    {currentWord.wordRoman}
                  </span>
                </div>
                {currentWord.phonetic && (
                  <p className="text-xs text-slate-500 font-mono">/{currentWord.phonetic}/</p>
                )}
              </div>
            ) : (
              <div className="my-auto text-center py-6 space-y-4 animate-in fade-in duration-150">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                  हिन्दी व अंग्रेज़ी अर्थ + वाक्य प्रयोग
                </span>
                <div className="space-y-1">
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    {currentWord.meaningHindi}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-slate-600">
                    {currentWord.meaningEnglish}
                  </p>
                </div>

                {currentWord.exampleSantali && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-left max-w-md mx-auto space-y-1">
                    <p className="font-bold text-slate-900">
                      <span className="text-violet-700">संताली वाक्य: </span>
                      {currentWord.exampleSantali}
                    </p>
                    <p className="text-slate-600">
                      <span className="text-slate-500 font-semibold">हिन्दी: </span>
                      {currentWord.exampleHindi || currentWord.meaningHindi}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Card Footer: 3-Grade Spaced Repetition Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              {!isFlipped ? (
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>अर्थ देखने के लिए कार्ड पर क्लिक करें</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFlipped(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
                  >
                    अर्थ दिखाएँ ↻
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-slate-500 text-center">
                    यह शब्द आपको कितना याद रहा? अगली पुनरावृत्ति चुनें:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={(e) => handleSrsGrade(e, 0)}
                      className="px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>कठिन — आज फिर</span>
                    </button>

                    <button
                      onClick={(e) => handleSrsGrade(e, 3)}
                      className="px-3 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>ठीक — 3 दिन बाद</span>
                    </button>

                    <button
                      onClick={(e) => handleSrsGrade(e, 7)}
                      className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>याद हो गया — 7 दिन</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Carousel Navigation Toolbar */}
          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>पिछला</span>
            </button>

            <button
              onClick={handleRandom}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="रैंडम कार्ड"
            >
              <Shuffle className="w-3.5 h-3.5 text-violet-700" />
              <span>शफ़ल (Shuffle)</span>
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>अगला शब्द</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
