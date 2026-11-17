import React, { useState, useEffect, useCallback } from 'react';
import {
  Headphones,
  Volume2,
  RotateCcw,
  Trophy,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface MemoryPair {
  pairId: string;
  santali: string;
  hindi: string;
  olChiki: string;
}

const MEMORY_PAIRS: MemoryPair[] = [
  { pairId: 'johar', santali: 'जोहार', hindi: 'नमस्कार / अभिवादन', olChiki: 'ᱡᱚᱦᱟᱨ' },
  { pairId: 'dak', santali: 'दाक्', hindi: 'पानी / जल', olChiki: 'ᱫᱟᱜ' },
  { pairId: 'baha', santali: 'बाहा', hindi: 'फूल', olChiki: 'ᱵᱟᱦᱟ' },
  { pairId: 'bir', santali: 'बिर', hindi: 'जंगल / वन', olChiki: 'ᱵᱤᱨ' },
  { pairId: 'orak', santali: 'ओड़ाक्', hindi: 'घर', olChiki: 'ᱚᱲᱟᱜ' },
  { pairId: 'sereng', santali: 'सेरेञ', hindi: 'गीत / गाना', olChiki: 'ᱥᱮᱨᱮᱧ' },
  { pairId: 'ayo', santali: 'आयो', hindi: 'माँ', olChiki: 'ᱟᱭᱳ' },
  { pairId: 'sirma', santali: 'सिरमा', hindi: 'आसमान / वर्ष', olChiki: 'ᱥᱤᱨᱢᱟ' }
];

interface DeckCard {
  uid: string;
  pairId: string;
  sideType: 'santali' | 'meaning';
  primaryText: string;
  subText: string;
  speakText: string;
}

function createShuffledDeck(pairCount: number): DeckCard[] {
  const chosen = [...MEMORY_PAIRS].sort(() => Math.random() - 0.5).slice(0, pairCount);
  const cards: DeckCard[] = [];
  chosen.forEach((p) => {
    cards.push({
      uid: `${p.pairId}-sa`,
      pairId: p.pairId,
      sideType: 'santali',
      primaryText: p.santali,
      subText: p.olChiki,
      speakText: p.santali
    });
    cards.push({
      uid: `${p.pairId}-hi`,
      pairId: p.pairId,
      sideType: 'meaning',
      primaryText: p.hindi,
      subText: 'हिंदी अर्थ',
      speakText: `${p.santali}. ${p.hindi}`
    });
  });
  return cards.sort(() => Math.random() - 0.5);
}

const BEST_STORAGE_KEY = 'hor_katha_audio_mem_best';

export const SantaliAudioMemoryGame: React.FC = () => {
  const [pairCount, setPairCount] = useState<number>(6);
  const [deck, setDeck] = useState<DeckCard[]>(() => createShuffledDeck(6));
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const [bestMoves, setBestMoves] = useState<number | null>(() => {
    try {
      const val = localStorage.getItem(BEST_STORAGE_KEY);
      return val ? Number(val) : null;
    } catch {
      return null;
    }
  });

  const isWon = matchedPairIds.length === pairCount;

  const resetGame = useCallback((count: number = pairCount) => {
    setPairCount(count);
    setDeck(createShuffledDeck(count));
    setFlippedUids([]);
    setMatchedPairIds([]);
    setMoves(0);
    setIsBusy(false);
  }, [pairCount]);

  useEffect(() => {
    if (isWon && moves > 0) {
      if (bestMoves === null || moves < bestMoves) {
        setBestMoves(moves);
        try {
          localStorage.setItem(BEST_STORAGE_KEY, String(moves));
        } catch {
          // ignore
        }
      }
      speakWithFemaleVoice('शाबाश! आपने सभी ऑडियो मेमोरी कार्ड सही मिला दिए।', { autoDetectLanguage: true });
    }
  }, [isWon, moves, bestMoves]);

  const handleCardClick = (card: DeckCard) => {
    if (isBusy) return;
    if (flippedUids.includes(card.uid) || matchedPairIds.includes(card.pairId)) return;

    speakWithFemaleVoice(card.speakText, { autoDetectLanguage: true });

    const nextFlipped = [...flippedUids, card.uid];
    setFlippedUids(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = deck.find((c) => c.uid === nextFlipped[0]);
      if (firstCard && firstCard.pairId === card.pairId) {
        setMatchedPairIds((prev) => [...prev, card.pairId]);
        setFlippedUids([]);
      } else {
        setIsBusy(true);
        setTimeout(() => {
          setFlippedUids([]);
          setIsBusy(false);
        }, 900);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 bg-slate-50 min-h-screen text-slate-900">
      <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200 mb-2">
            <Headphones className="w-3.5 h-3.5" />
            <span>ध्वनि-आधारित स्मृति खेल</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ऑडियो मेमोरी फ्लिप गेम (Audio Memory Flip)
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            हर कार्ड पलटने पर संताली उच्चारण सुनाई देगा। सही संताली शब्द और उसके हिंदी अर्थ का जोड़ा मिलाएं!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[4, 6, 8].map((cnt) => (
            <button
              key={cnt}
              onClick={() => resetGame(cnt)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                pairCount === cnt
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {cnt} जोड़े ({cnt * 2} कार्ड)
            </button>
          ))}
          <button
            onClick={() => resetGame(pairCount)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>नया खेल</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <div className="text-xs font-semibold text-slate-500">मिले जोड़े</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-0.5">
            {matchedPairIds.length} / {pairCount}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <div className="text-xs font-semibold text-slate-500">कुल चालें (Moves)</div>
          <div className="text-2xl font-extrabold text-indigo-700 mt-0.5">{moves}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <div className="text-xs font-semibold text-slate-500">सर्वश्रेष्ठ रिकॉर्ड</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-0.5">
            {bestMoves !== null ? `${bestMoves} चालें` : '—'}
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {deck.map((card) => {
          const isMatched = matchedPairIds.includes(card.pairId);
          const isFlipped = flippedUids.includes(card.uid) || isMatched;

          return (
            <button
              key={card.uid}
              onClick={() => handleCardClick(card)}
              className={`min-h-[124px] rounded-2xl p-4 border-2 transition-all flex flex-col items-center justify-center text-center shadow-sm ${
                isMatched
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : isFlipped
                  ? card.sideType === 'santali'
                    ? 'bg-amber-50 border-amber-400 text-slate-900'
                    : 'bg-indigo-50 border-indigo-400 text-slate-900'
                  : 'bg-white border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30'
              }`}
            >
              {isFlipped ? (
                <>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide mb-1.5">
                    {isMatched ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                    <span className={card.sideType === 'santali' ? 'text-amber-700' : 'text-indigo-700'}>
                      {card.sideType === 'santali' ? 'संताली शब्द' : 'हिंदी अर्थ'}
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold">{card.primaryText}</div>
                  <div className="text-xs text-slate-600 mt-1">{card.subText}</div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-600">क्लिक कर सुनें</div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isWon && (
        <div className="bg-emerald-600 text-white rounded-2xl p-6 text-center space-y-3 shadow-md">
          <Trophy className="w-10 h-10 mx-auto text-amber-300" />
          <h2 className="text-2xl font-extrabold">बहुत बढ़िया! सभी जोड़े मिल गए!</h2>
          <p className="text-sm text-emerald-100 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>आपने {moves} चालों में पहेली पूरी की।</span>
          </p>
          <button
            onClick={() => resetGame(pairCount)}
            className="px-6 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 transition"
          >
            फिर से खेलें
          </button>
        </div>
      )}
    </div>
  );
};
