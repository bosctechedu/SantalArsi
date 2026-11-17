import React, { useState, useEffect, useMemo } from 'react';
import { Gamepad2, RotateCcw, Volume2, Trophy, Clock } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface WordPair {
  id: string;
  santaliDev: string;
  santaliRoman: string;
  hindi: string;
}

const DECKS: Record<string, { label: string; pairs: WordPair[] }> = {
  nature: {
    label: 'प्रकृति व वन (Nature)',
    pairs: [
      { id: 'n1', santaliDev: 'दारे', santaliRoman: 'Dare', hindi: 'पेड़ / वृक्ष' },
      { id: 'n2', santaliDev: 'बुरु', santaliRoman: 'Buru', hindi: 'पहाड़' },
      { id: 'n3', santaliDev: 'दाक्', santaliRoman: 'Dak', hindi: 'पानी / जल' },
      { id: 'n4', santaliDev: 'सेंगेल', santaliRoman: 'Sengel', hindi: 'आग' },
      { id: 'n5', santaliDev: 'ओत', santaliRoman: 'Ot', hindi: 'धरती / भूमि' },
      { id: 'n6', santaliDev: 'चांदो', santaliRoman: 'Chando', hindi: 'चांद / सूर्य' }
    ]
  },
  family: {
    label: 'परिवार व रिश्ते (Family)',
    pairs: [
      { id: 'f1', santaliDev: 'आयो', santaliRoman: 'Ayo', hindi: 'माता / माँ' },
      { id: 'f2', santaliDev: 'बाबा', santaliRoman: 'Baba', hindi: 'पिता' },
      { id: 'f3', santaliDev: 'दादा', santaliRoman: 'Dada', hindi: 'बड़ा भाई' },
      { id: 'f4', santaliDev: 'दीदी', santaliRoman: 'Didi', hindi: 'बड़ी बहन' },
      { id: 'f5', santaliDev: 'मामो', santaliRoman: 'Mamo', hindi: 'मामा' },
      { id: 'f6', santaliDev: 'गोरम', santaliRoman: 'Gorom', hindi: 'दादा / नाना' }
    ]
  },
  daily: {
    label: 'दैनिक जीवन (Daily Life)',
    pairs: [
      { id: 'd1', santaliDev: 'ओड़ाक्', santaliRoman: 'Orak', hindi: 'घर' },
      { id: 'd2', santaliDev: 'हातु', santaliRoman: 'Hatu', hindi: 'गाँव' },
      { id: 'd3', santaliDev: 'दाका', santaliRoman: 'Daka', hindi: 'भात / भोजन' },
      { id: 'd4', santaliDev: 'कामी', santaliRoman: 'Kami', hindi: 'काम / कार्य' },
      { id: 'd5', santaliDev: 'पुथी', santaliRoman: 'Puthi', hindi: 'किताब / पुस्तक' },
      { id: 'd6', santaliDev: 'गाते', santaliRoman: 'Gate', hindi: 'मित्र / दोस्त' }
    ]
  }
};

function shuffleList<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const SantaliWordMatchGame: React.FC = () => {
  const [deckKey, setDeckKey] = useState<string>('nature');
  const [roundSeed, setRoundSeed] = useState<number>(1);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [mismatchPair, setMismatchPair] = useState<boolean>(false);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    try {
      const val = localStorage.getItem('hor_katha_match_best');
      return val ? Number(val) : null;
    } catch {
      return null;
    }
  });

  const currentDeck = DECKS[deckKey];

  const leftItems = useMemo(() => shuffleList(currentDeck.pairs), [deckKey, roundSeed]);
  const rightItems = useMemo(() => shuffleList(currentDeck.pairs), [deckKey, roundSeed]);

  const isGameComplete = matchedIds.length === currentDeck.pairs.length;

  useEffect(() => {
    if (isGameComplete) {
      if (bestTime === null || seconds < bestTime) {
        setBestTime(seconds);
        try {
          localStorage.setItem('hor_katha_match_best', String(seconds));
        } catch {
          // ignore
        }
      }
      return;
    }
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isGameComplete, seconds, bestTime]);

  const tryEvaluate = (leftId: string | null, rightId: string | null) => {
    if (!leftId || !rightId) return;
    setMoves((m) => m + 1);
    if (leftId === rightId) {
      setMatchedIds((prev) => [...prev, leftId]);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setMismatchPair(true);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setMismatchPair(false);
      }, 450);
    }
  };

  const resetRound = (nextDeck?: string) => {
    if (nextDeck) setDeckKey(nextDeck);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds([]);
    setMoves(0);
    setSeconds(0);
    setMismatchPair(false);
    setRoundSeed((r) => r + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
              <Gamepad2 className="w-4 h-4" />
              <span>तेज़ शब्द-मिलान खेल (Santali Word Match)</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              संताली ⇄ हिन्दी जोड़ी मिलान खेल
            </h1>
            <p className="text-sm text-slate-600">
              बाएँ कॉलम से संताली शब्द और दाएँ कॉलम से उसका सही हिन्दी अर्थ चुनकर सभी जोड़ियाँ मिलाएँ।
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0">
            <div className="text-right">
              <div className="text-slate-500 flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5" /> समय
              </div>
              <div className="text-base font-mono tabular-nums font-bold text-slate-900">{seconds}s</div>
            </div>
            <div className="text-right">
              <div className="text-slate-500">चालें (Moves)</div>
              <div className="text-base font-mono tabular-nums font-bold text-slate-900">{moves}</div>
            </div>
            {bestTime !== null && (
              <div className="text-right">
                <div className="text-amber-700 flex items-center justify-end gap-1">
                  <Trophy className="w-3.5 h-3.5" /> सर्वश्रेष्ठ
                </div>
                <div className="text-base font-mono tabular-nums font-bold text-amber-800">{bestTime}s</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
            {Object.entries(DECKS).map(([key, deck]) => (
              <button
                key={key}
                onClick={() => resetRound(key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                  deckKey === key ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {deck.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => resetRound()}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>नया खेल</span>
          </button>
        </div>

        {isGameComplete && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm font-bold text-emerald-900">
              बधाई हो! आपने {seconds} सेकंड और {moves} चालों में सभी {currentDeck.pairs.length} जोड़ियाँ सही मिलाईं।
            </div>
            <button
              onClick={() => resetRound()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              फिर से खेलें
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Left Column: Santali */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-500 px-1">संताली शब्द (बायाँ कॉलम)</h3>
            {leftItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedLeft === item.id;
              return (
                <div
                  key={`L_${item.id}`}
                  onClick={() => {
                    if (isMatched || mismatchPair) return;
                    setSelectedLeft(item.id);
                    tryEvaluate(item.id, selectedRight);
                  }}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60 cursor-default'
                      : isSelected
                      ? mismatchPair
                        ? 'bg-rose-50 border-rose-500 text-rose-900'
                        : 'bg-sky-50 border-sky-500 text-sky-950 font-bold'
                      : 'bg-white border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold">{item.santaliDev}</div>
                    <div className="text-xs text-slate-500">{item.santaliRoman}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWithFemaleVoice(item.santaliDev, { lang: 'hi-IN', rate: 0.85 });
                    }}
                    title="उच्चारण सुनें"
                    className="p-1.5 text-slate-400 hover:text-sky-700 rounded-lg cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Column: Hindi Meanings */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-500 px-1">हिन्दी अर्थ (दायाँ कॉलम)</h3>
            {rightItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedRight === item.id;
              return (
                <button
                  key={`R_${item.id}`}
                  disabled={isMatched}
                  onClick={() => {
                    if (isMatched || mismatchPair) return;
                    setSelectedRight(item.id);
                    tryEvaluate(selectedLeft, item.id);
                  }}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer disabled:cursor-default ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                      : isSelected
                      ? mismatchPair
                        ? 'bg-rose-50 border-rose-500 text-rose-900'
                        : 'bg-sky-50 border-sky-500 text-sky-950 font-bold'
                      : 'bg-white border-slate-200 hover:border-sky-300 text-slate-800'
                  }`}
                >
                  {item.hindi}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
