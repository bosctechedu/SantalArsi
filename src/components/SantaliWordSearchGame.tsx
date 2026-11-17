import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid3X3,
  Volume2,
  RotateCcw,
  Trophy,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface PuzzleWord {
  id: string;
  word: string; // Devanagari spaced-free token list via charTokens
  tokens: string[]; // Visual cell tokens so matras stay intact!
  hindi: string;
  english: string;
}

const WORD_POOL: PuzzleWord[] = [
  { id: 'johar', word: 'जोहार', tokens: ['जो', 'हा', 'र'], hindi: 'नमस्कार / अभिवादन', english: 'Greeting' },
  { id: 'dak', word: 'दाक्', tokens: ['दा', 'क्'], hindi: 'पानी / जल', english: 'Water' },
  { id: 'sereng', word: 'सेरेञ', tokens: ['से', 'रे', 'ञ'], hindi: 'गीत / गाना', english: 'Song' },
  { id: 'orak', word: 'ओड़ाक्', tokens: ['ओ', 'ड़ा', 'क्'], hindi: 'घर', english: 'Home' },
  { id: 'baha', word: 'बाहा', tokens: ['बा', 'हा'], hindi: 'फूल', english: 'Flower' },
  { id: 'bir', word: 'बिर', tokens: ['बि', 'र'], hindi: 'जंगल', english: 'Forest' },
  { id: 'tumdak', word: 'तुम्दाक्', tokens: ['तु', 'म्दा', 'क्'], hindi: 'मांदर (वाद्य)', english: 'Madal Drum' },
  { id: 'marang', word: 'मारांग', tokens: ['मा', 'रां', 'ग'], hindi: 'बड़ा / महान', english: 'Great / Big' },
  { id: 'ayo', word: 'आयो', tokens: ['आ', 'यो'], hindi: 'माँ', english: 'Mother' },
  { id: 'baba', word: 'बाबा', tokens: ['बा', 'बा'], hindi: 'पिता', english: 'Father' },
  { id: 'sagen', word: 'सागेन', tokens: ['सा', 'गे', 'न'], hindi: 'नया पत्ता / विकास', english: 'Sprout' },
  { id: 'katha', word: 'काथा', tokens: ['का', 'था'], hindi: 'बात / भाषा', english: 'Word / Story' }
];

const FILLER_TOKENS = [
  'क', 'ख', 'ग', 'च', 'ज', 'त', 'द', 'न', 'प', 'ब', 'म', 'य', 'र', 'ल', 'स', 'ह',
  'का', 'ता', 'ना', 'पा', 'मा', 'सा', 'हा', 'रा', 'कि', 'नि', 'मि', 'सि', 'ते', 'ने'
];

const GRID_SIZE = 8;

interface Placement {
  wordId: string;
  coords: [number, number][];
}

function buildPuzzle(words: PuzzleWord[]): {
  grid: string[][];
  targets: PuzzleWord[];
  placements: Placement[];
} {
  const chosen = [...words].sort(() => Math.random() - 0.5).slice(0, 6);
  const grid: (string | null)[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
  const placements: Placement[] = [];
  const targets: PuzzleWord[] = [];

  const directions: [number, number][] = [
    [0, 1], // horizontal right
    [1, 0], // vertical down
    [1, 1]  // diagonal
  ];

  for (const w of chosen) {
    let placed = false;
    for (let attempt = 0; attempt < 60 && !placed; attempt++) {
      const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];
      const r0 = Math.floor(Math.random() * GRID_SIZE);
      const c0 = Math.floor(Math.random() * GRID_SIZE);
      const len = w.tokens.length;
      const endR = r0 + dr * (len - 1);
      const endC = c0 + dc * (len - 1);
      if (endR < 0 || endR >= GRID_SIZE || endC < 0 || endC >= GRID_SIZE) continue;

      let fits = true;
      const coords: [number, number][] = [];
      for (let i = 0; i < len; i++) {
        const nr = r0 + dr * i;
        const nc = c0 + dc * i;
        const existing = grid[nr][nc];
        if (existing !== null && existing !== w.tokens[i]) {
          fits = false;
          break;
        }
        coords.push([nr, nc]);
      }

      if (fits) {
        coords.forEach(([nr, nc], idx) => {
          grid[nr][nc] = w.tokens[idx];
        });
        placements.push({ wordId: w.id, coords });
        targets.push(w);
        placed = true;
      }
    }
  }

  const filledGrid: string[][] = grid.map((row) =>
    row.map((cell) => cell ?? FILLER_TOKENS[Math.floor(Math.random() * FILLER_TOKENS.length)])
  );

  return { grid: filledGrid, targets, placements };
}

export const SantaliWordSearchGame: React.FC = () => {
  const [puzzle, setPuzzle] = useState(() => buildPuzzle(WORD_POOL));
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [foundCellKeys, setFoundCellKeys] = useState<Set<string>>(new Set());
  const [seconds, setSeconds] = useState(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('hor_katha_wordsearch_best') || '0');
    } catch {
      return 0;
    }
  });
  const [statusMsg, setStatusMsg] = useState<string>('अक्षरों पर क्रम से क्लिक करके नीचे दिए संताली शब्द खोजें!');

  const allFound = foundIds.length === puzzle.targets.length && puzzle.targets.length > 0;

  useEffect(() => {
    if (allFound) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [allFound]);

  const startNewGame = useCallback(() => {
    setPuzzle(buildPuzzle(WORD_POOL));
    setSelectedCells([]);
    setFoundIds([]);
    setFoundCellKeys(new Set());
    setSeconds(0);
    setStatusMsg('नया शब्द-जाल तैयार है! अक्षरों को क्रम से चुनें।');
  }, []);

  const checkSelection = (nextSelection: string[]) => {
    const selectedTokens = nextSelection
      .map((key) => {
        const [r, c] = key.split('-').map(Number);
        return puzzle.grid[r][c];
      })
      .join('');

    const matched = puzzle.targets.find(
      (t) => !foundIds.includes(t.id) && t.tokens.join('') === selectedTokens
    );

    if (matched) {
      const nextFound = [...foundIds, matched.id];
      const nextKeys = new Set(foundCellKeys);
      nextSelection.forEach((k) => nextKeys.add(k));
      setFoundIds(nextFound);
      setFoundCellKeys(nextKeys);
      setSelectedCells([]);
      setStatusMsg(`शाबाश! "${matched.word}" (${matched.hindi}) मिल गया!`);
      speakWithFemaleVoice(`${matched.word}. ${matched.hindi}`, { autoDetectLanguage: true });

      if (nextFound.length === puzzle.targets.length) {
        const nextTotal = bestScore + 1;
        setBestScore(nextTotal);
        try {
          localStorage.setItem('hor_katha_wordsearch_best', String(nextTotal));
        } catch {
          // ignore
        }
      }
      return;
    }

    // Also allow clicking out if too long
    if (nextSelection.length >= 4) {
      setSelectedCells([]);
      setStatusMsg('मेल नहीं खाया — फिर से सही क्रम चुनें।');
    }
  };

  const handleCellClick = (r: number, c: number) => {
    const key = `${r}-${c}`;
    if (selectedCells.includes(key)) {
      setSelectedCells(selectedCells.filter((k) => k !== key));
      return;
    }
    const next = [...selectedCells, key];
    setSelectedCells(next);
    checkSelection(next);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 bg-slate-50 min-h-screen text-slate-900">
      <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>संताली अक्षर-जाल पहेली (Word Search)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            संताली शब्द-जाल खोज (Word Search Puzzle)
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            8x8 ग्रिड में छिपे संताली शब्दों के अक्षर-खंड (Syllables) क्रम से चुनें और उच्चारण सुनें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2 text-sm font-bold">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>{formatTime(seconds)}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-sm font-bold text-amber-800">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>पूर्ण पहेलियाँ: {bestScore}</span>
          </div>
          <button
            onClick={startNewGame}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>नया ग्रिड</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
        {selectedCells.length > 0 && (
          <button
            onClick={() => setSelectedCells([])}
            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            चयन साफ़ करें ({selectedCells.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 8x8 Grid */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-8 gap-1.5 sm:gap-2 max-w-lg mx-auto">
            {puzzle.grid.map((row, r) =>
              row.map((token, c) => {
                const key = `${r}-${c}`;
                const isSelected = selectedCells.includes(key);
                const isFound = foundCellKeys.has(key);
                return (
                  <button
                    key={key}
                    onClick={() => handleCellClick(r, c)}
                    className={`aspect-square rounded-xl font-bold text-sm sm:text-lg flex items-center justify-center border transition select-none ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 scale-95 shadow-inner'
                        : isFound
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                        : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                    }`}
                  >
                    {token}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Target Words Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-lg">खोजने वाले शब्द</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {foundIds.length} / {puzzle.targets.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {puzzle.targets.map((t) => {
              const isDone = foundIds.includes(t.id);
              return (
                <div
                  key={t.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      <span className={`font-bold text-base ${isDone ? 'line-through text-emerald-800' : 'text-slate-900'}`}>
                        {t.word}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      {t.hindi} ({t.english}) • [{t.tokens.join(' + ')}]
                    </div>
                  </div>
                  <button
                    onClick={() => speakWithFemaleVoice(`${t.word}. ${t.hindi}`, { autoDetectLanguage: true })}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 text-emerald-700"
                    title="शब्द सुनें"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {allFound && (
            <div className="p-4 rounded-xl bg-emerald-600 text-white text-center space-y-2">
              <Trophy className="w-8 h-8 mx-auto text-amber-300" />
              <div className="font-extrabold text-base">अद्भुत! सभी शब्द खोज लिए गए!</div>
              <p className="text-xs text-emerald-100">समय: {formatTime(seconds)}</p>
              <button
                onClick={startNewGame}
                className="w-full py-2 rounded-lg bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50"
              >
                अगला शब्द-जाल खेलें
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
