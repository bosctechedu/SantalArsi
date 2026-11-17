import React, { useState, useMemo } from 'react';
import { Gamepad2, HelpCircle, Volume2, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface CrosswordClue {
  id: string;
  direction: 'across' | 'down';
  label: string;
  row: number;
  col: number;
  answer: string;
  santaliDev: string;
  clueHindi: string;
}

interface CrosswordPuzzle {
  id: string;
  title: string;
  rows: number;
  cols: number;
  clues: CrosswordClue[];
}

const CROSSWORD_PUZZLES: CrosswordPuzzle[] = [
  {
    id: 'nature_grid',
    title: 'प्रकृति वर्ग-पहेली (Nature)',
    rows: 5,
    cols: 5,
    clues: [
      {
        id: 'a1',
        direction: 'across',
        label: '1 क्षैतिज',
        row: 0,
        col: 0,
        answer: 'DARE',
        santaliDev: 'दारे',
        clueHindi: 'पेड़ / वृक्ष (4 अक्षर)'
      },
      {
        id: 'd1',
        direction: 'down',
        label: '1 लंबवत',
        row: 0,
        col: 0,
        answer: 'DAK',
        santaliDev: 'दाक्',
        clueHindi: 'पानी / जल (3 अक्षर)'
      },
      {
        id: 'd2',
        direction: 'down',
        label: '2 लंबवत',
        row: 0,
        col: 2,
        answer: 'RIPA',
        santaliDev: 'रिपा / क्षेत्र',
        clueHindi: 'रिंग / घेरा अक्षर अभ्यास (4 अक्षर)'
      },
      {
        id: 'a2',
        direction: 'across',
        label: '3 क्षैतिज',
        row: 2,
        col: 0,
        answer: 'KAPI',
        santaliDev: 'कापी',
        clueHindi: 'पारंपरिक संताल कुल्हाड़ी (4 अक्षर)'
      }
    ]
  },
  {
    id: 'family_grid',
    title: 'परिवार वर्ग-पहेली (Family)',
    rows: 5,
    cols: 5,
    clues: [
      {
        id: 'fa1',
        direction: 'across',
        label: '1 क्षैतिज',
        row: 0,
        col: 0,
        answer: 'BABA',
        santaliDev: 'बाबा',
        clueHindi: 'पिताजी / जनक (4 अक्षर)'
      },
      {
        id: 'fd1',
        direction: 'down',
        label: '1 लंबवत',
        row: 0,
        col: 0,
        answer: 'BAHA',
        santaliDev: 'बाहा',
        clueHindi: 'फूल / वसंत महापर्व (4 अक्षर)'
      },
      {
        id: 'fd2',
        direction: 'down',
        label: '2 लंबवत',
        row: 0,
        col: 2,
        answer: 'BURU',
        santaliDev: 'बुरु',
        clueHindi: 'पहाड़ / पर्वत (4 अक्षर)'
      },
      {
        id: 'fa2',
        direction: 'across',
        label: '3 क्षैतिज',
        row: 3,
        col: 0,
        answer: 'AYO',
        santaliDev: 'आयो',
        clueHindi: 'माता / माँ (3 अक्षर)'
      }
    ]
  }
];

const LETTER_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const SantaliCrosswordGame: React.FC = () => {
  const [puzzleIdx, setPuzzleIdx] = useState<number>(0);
  const [gridValues, setGridValues] = useState<Record<string, string>>({});
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>({ row: 0, col: 0 });
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [solvedCount, setSolvedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('hor_katha_crossword_solved');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [completedSaved, setCompletedSaved] = useState<boolean>(false);

  const puzzle = CROSSWORD_PUZZLES[puzzleIdx];

  // Build authoritative solution map from clues
  const solutionMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const clue of puzzle.clues) {
      for (let i = 0; i < clue.answer.length; i++) {
        const r = clue.direction === 'across' ? clue.row : clue.row + i;
        const c = clue.direction === 'across' ? clue.col + i : clue.col;
        map[`${r}_${c}`] = clue.answer[i];
      }
    }
    return map;
  }, [puzzle]);

  const activeCells = Object.keys(solutionMap);
  const totalCells = activeCells.length;

  let correctCells = 0;
  for (const key of activeCells) {
    if ((gridValues[key] || '').toUpperCase() === solutionMap[key]) {
      correctCells++;
    }
  }
  const isSolved = totalCells > 0 && correctCells === totalCells;

  React.useEffect(() => {
    if (isSolved && !completedSaved) {
      setCompletedSaved(true);
      const nextCount = solvedCount + 1;
      setSolvedCount(nextCount);
      try {
        localStorage.setItem('hor_katha_crossword_solved', String(nextCount));
      } catch {
        // ignore
      }
    }
  }, [isSolved, completedSaved, solvedCount]);

  const handleSetLetter = (letter: string) => {
    if (!selectedCell) return;
    const key = `${selectedCell.row}_${selectedCell.col}`;
    if (!solutionMap[key]) return;
    setGridValues((prev) => ({ ...prev, [key]: letter.toUpperCase() }));

    // Auto advance to next active cell
    const idx = activeCells.indexOf(key);
    if (idx !== -1 && idx + 1 < activeCells.length) {
      const [nr, nc] = activeCells[idx + 1].split('_').map(Number);
      setSelectedCell({ row: nr, col: nc });
    }
  };

  const handleRevealOneLetter = () => {
    const nextHint = (hintLevel % 4) + 1;
    setHintLevel(nextHint);
    const targetKey = activeCells.find((k) => (gridValues[k] || '').toUpperCase() !== solutionMap[k]);
    if (targetKey) {
      setGridValues((prev) => ({ ...prev, [targetKey]: solutionMap[targetKey] }));
    }
  };

  const resetPuzzle = (nextIdx?: number) => {
    if (nextIdx !== undefined) setPuzzleIdx(nextIdx);
    setGridValues({});
    setSelectedCell({ row: 0, col: 0 });
    setHintLevel(0);
    setCompletedSaved(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-teal-800 flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4" />
              <span>मस्तिष्क व्यायाम · Santali Crossword &amp; Word Builder</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              संताली वर्ग-पहेली व शब्द-निर्माण खेल
            </h1>
            <p className="text-sm text-slate-600">
              बड़े स्पर्श-अनुकूल खानों में संकेतों की मदद से रोमन-संताली शब्द भरें।
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs text-slate-500">पूर्ण पहेलियाँ</div>
            <div className="font-mono tabular-nums text-xl font-bold text-emerald-700">
              {solvedCount}
            </div>
          </div>
        </div>

        {/* Puzzle Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
            {CROSSWORD_PUZZLES.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => resetPuzzle(idx)}
                className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  puzzleIdx === idx ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRevealOneLetter}
              className="min-h-[44px] px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>अक्षर संकेत ({hintLevel}/4)</span>
            </button>
            <button
              onClick={() => resetPuzzle()}
              className="min-h-[44px] px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>रीसेट</span>
            </button>
          </div>
        </div>

        {isSolved && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-950">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>बहुत बढ़िया! आपने यह पूरी संताली वर्ग-पहेली सही हल कर ली है।</span>
            </div>
            <button
              onClick={() => resetPuzzle((puzzleIdx + 1) % CROSSWORD_PUZZLES.length)}
              className="min-h-[44px] px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              अगली पहेली खेलें →
            </button>
          </div>
        )}

        {/* Interactive Board + Clues */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Crossword Grid & Mobile Letter Keyboard */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>सही अक्षर प्रगति</span>
              <span className="font-mono tabular-nums font-bold text-slate-800">
                {correctCells} / {totalCells}
              </span>
            </div>

            {/* Grid */}
            <div className="flex justify-center">
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${puzzle.cols}, minmax(44px, 54px))` }}
              >
                {Array.from({ length: puzzle.rows }).map((_, r) =>
                  Array.from({ length: puzzle.cols }).map((__, c) => {
                    const key = `${r}_${c}`;
                    const expected = solutionMap[key];
                    if (!expected) {
                      return (
                        <div
                          key={key}
                          className="h-12 bg-slate-900/90 rounded-lg"
                          aria-hidden="true"
                        />
                      );
                    }

                    const val = (gridValues[key] || '').toUpperCase();
                    const isSelected = selectedCell?.row === r && selectedCell?.col === c;
                    const isCorrect = val === expected;

                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCell({ row: r, col: c })}
                        className={`h-12 min-w-[44px] rounded-xl border-2 font-mono text-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : isSelected
                            ? 'bg-sky-50 border-sky-500 text-sky-950 ring-2 ring-sky-200'
                            : 'bg-slate-50 border-slate-300 text-slate-900 hover:border-slate-400'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Touch-First Mobile Virtual Keyboard */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-semibold text-slate-500">
                चयनित खाने में अक्षर भरने के लिए टैप करें:
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {LETTER_KEYS.map((ch) => (
                  <button
                    key={ch}
                    onClick={() => handleSetLetter(ch)}
                    className="min-w-[36px] min-h-[40px] px-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 font-mono text-xs font-bold rounded-lg border border-slate-200 cursor-pointer"
                  >
                    {ch}
                  </button>
                ))}
                <button
                  onClick={() => {
                    if (!selectedCell) return;
                    const key = `${selectedCell.row}_${selectedCell.col}`;
                    setGridValues((prev) => ({ ...prev, [key]: '' }));
                  }}
                  className="px-3 min-h-[40px] bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs rounded-lg border border-rose-200 cursor-pointer"
                >
                  हटाएं
                </button>
              </div>
            </div>
          </div>

          {/* Clues List */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <HelpCircle className="w-4 h-4 text-teal-700" />
              <span>संकेत व शब्द सूची (Clues)</span>
            </h2>

            <div className="space-y-2.5">
              {puzzle.clues.map((clue) => {
                let clueSolved = true;
                for (let i = 0; i < clue.answer.length; i++) {
                  const r = clue.direction === 'across' ? clue.row : clue.row + i;
                  const c = clue.direction === 'across' ? clue.col + i : clue.col;
                  if ((gridValues[`${r}_${c}`] || '').toUpperCase() !== clue.answer[i]) {
                    clueSolved = false;
                  }
                }

                return (
                  <div
                    key={clue.id}
                    onClick={() => setSelectedCell({ row: clue.row, col: clue.col })}
                    className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                      clueSolved
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900">
                        {clue.label} · {clue.santaliDev}
                      </div>
                      <div className="text-xs text-slate-600">{clue.clueHindi}</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWithFemaleVoice(`${clue.santaliDev}। ${clue.clueHindi}`, {
                          lang: 'hi-IN',
                          rate: 0.9
                        });
                      }}
                      className="min-h-[40px] min-w-[40px] flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-teal-700 cursor-pointer shrink-0"
                      title="संकेत सुनें"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
