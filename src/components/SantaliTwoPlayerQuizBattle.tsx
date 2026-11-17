import React, { useState, useEffect, useMemo } from 'react';
import {
  Swords,
  Trophy,
  RotateCcw,
  Play,
  Volume2,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ALL_COMPETITIVE_QUESTIONS_2026 } from '../data/competitiveExams2026Data';
import { speakWithFemaleVoice } from '../utils/speech';

interface BattleQuestion {
  id: string;
  tag: string;
  question: string;
  options: string[];
  correctIndex: number;
}

type BattleTopic = 'mixed' | 'santali_vocab' | 'jharkhand_gk' | 'india_gk';

export const SantaliTwoPlayerQuizBattle: React.FC = () => {
  const { words } = useAdmin();
  const [p1Name, setP1Name] = useState('खिलाड़ी 1 (Player 1)');
  const [p2Name, setP2Name] = useState('खिलाड़ी 2 (Player 2)');
  const [topic, setTopic] = useState<BattleTopic>('mixed');
  const [roundCount, setRoundCount] = useState<number>(10);

  const [phase, setPhase] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [questions, setQuestions] = useState<BattleQuestion[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [secLeft, setSecLeft] = useState(15);

  // Per-question resolution state
  const [lockedBy, setLockedBy] = useState<1 | 2 | null>(null);
  const [chosenOpt, setChosenOpt] = useState<number | null>(null);
  const [roundResult, setRoundResult] = useState<'correct' | 'wrong' | 'timeout' | null>(null);

  const vocabPool: BattleQuestion[] = useMemo(() => {
    const clean: typeof words = [];
    for (let i = 0; i < words.length && clean.length < 60; i++) {
      if (words[i].wordDevanagari && words[i].meaningHindi) {
        clean.push(words[i]);
      }
    }
    return clean.slice(0, 30).map((w, i) => {
      const d1 = clean[(i + 5) % clean.length]?.meaningHindi || 'जल';
      const d2 = clean[(i + 11) % clean.length]?.meaningHindi || 'पेड़';
      const d3 = clean[(i + 17) % clean.length]?.meaningHindi || 'गाँव';
      const opts = Array.from(new Set([w.meaningHindi, d1, d2, d3]));
      while (opts.length < 4) opts.push(`विकल्प ${opts.length + 1}`);
      const tagged = opts.slice(0, 4).map((t, idx) => ({ t, ok: idx === 0 }));
      tagged.sort(() => Math.random() - 0.5);
      return {
        id: `bat_voc_${w.id}`,
        tag: 'संताली शब्द-अर्थ',
        question: `संताली शब्द "${w.wordDevanagari}" (${w.wordRoman}) का सही हिन्दी अर्थ क्या है?`,
        options: tagged.map((x) => x.t),
        correctIndex: tagged.findIndex((x) => x.ok)
      };
    });
  }, [words]);

  const startBattle = () => {
    const compPool: BattleQuestion[] = ALL_COMPETITIVE_QUESTIONS_2026.map((q) => ({
      id: `bat_${q.id}`,
      tag:
        q.subject === 'jharkhand_special' || q.subject === 'santali_language'
          ? 'झारखंड GK'
          : 'भारत GK',
      question: q.question,
      options: [...q.options],
      correctIndex: q.correctIndex
    }));

    let pool: BattleQuestion[] = [];
    if (topic === 'santali_vocab') pool = vocabPool;
    else if (topic === 'jharkhand_gk') pool = compPool.filter((q) => q.tag === 'झारखंड GK');
    else if (topic === 'india_gk') pool = compPool.filter((q) => q.tag === 'भारत GK');
    else pool = [...vocabPool, ...compPool];

    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, roundCount);
    setQuestions(shuffled);
    setRoundIdx(0);
    setP1Score(0);
    setP2Score(0);
    setLockedBy(null);
    setChosenOpt(null);
    setRoundResult(null);
    setSecLeft(15);
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing' || roundResult !== null) return;
    if (secLeft <= 0) {
      setRoundResult('timeout');
      return;
    }
    const timer = setInterval(() => setSecLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, secLeft, roundResult]);

  const currentQ = questions[roundIdx];

  const handlePlayerPick = (player: 1 | 2, optIdx: number) => {
    if (!currentQ || roundResult !== null) return;
    const isRight = optIdx === currentQ.correctIndex;
    setLockedBy(player);
    setChosenOpt(optIdx);
    setRoundResult(isRight ? 'correct' : 'wrong');

    if (isRight) {
      if (player === 1) setP1Score((s) => s + 10);
      else setP2Score((s) => s + 10);
    } else {
      // Opponent gets +5 bonus for opponent miss
      if (player === 1) setP2Score((s) => s + 5);
      else setP1Score((s) => s + 5);
    }
  };

  const nextRound = () => {
    if (roundIdx + 1 >= questions.length) {
      setPhase('finished');
      return;
    }
    setRoundIdx((i) => i + 1);
    setLockedBy(null);
    setChosenOpt(null);
    setRoundResult(null);
    setSecLeft(15);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-24">
      <div className="max-w-5xl mx-auto space-y-5">
        <header className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
              <Swords className="w-4 h-4" />
              <span>2-Player Quiz Battle (1v1 एक ही स्क्रीन पर मुकाबला)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              संताली व सामान्य ज्ञान 1v1 बज़र क्विज़ मुकाबला
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              दो खिलाड़ी एक ही मोबाइल या लैपटॉप पर आमने-सामने बज़र दबाकर तेज़ उत्तर देने का मुकाबला खेलें। सही उत्तर पर +10 अंक, गलत चुनने पर विरोधी को +5 बोनस।
            </p>
          </div>
          {phase !== 'setup' && (
            <button
              onClick={() => setPhase('setup')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>नया मुकाबला सेटअप</span>
            </button>
          )}
        </header>

        {/* SETUP PHASE */}
        {phase === 'setup' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-sky-900 block mb-1">खिलाड़ी 1 का नाम (Blue Corner):</label>
                <input
                  type="text"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-amber-900 block mb-1">खिलाड़ी 2 का नाम (Amber Corner):</label>
                <input
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">मुकाबले का विषय:</label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'mixed', label: 'मिश्रित (All Topics)' },
                      { id: 'santali_vocab', label: 'संताली शब्दावली' },
                      { id: 'jharkhand_gk', label: 'झारखंड GK' },
                      { id: 'india_gk', label: 'भारत GK 2026' }
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTopic(t.id)}
                      className={`py-2.5 px-3 rounded-xl border font-bold cursor-pointer ${
                        topic === t.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">कुल राउंड (प्रश्नों की संख्या):</label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setRoundCount(cnt)}
                      className={`py-2.5 rounded-xl border font-mono font-bold cursor-pointer ${
                        roundCount === cnt
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {cnt} प्रश्न
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={startBattle}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>1v1 क्विज़ मुकाबला शुरू करें</span>
            </button>
          </div>
        )}

        {/* PLAYING PHASE */}
        {phase === 'playing' && currentQ && (
          <div className="space-y-4">
            {/* Scoreboard Strip */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-center">
                <div className="text-xs font-bold text-sky-900 truncate">{p1Name}</div>
                <div className="text-2xl font-black font-mono tabular-nums text-sky-700 mt-0.5">{p1Score}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center flex flex-col justify-center">
                <div className="text-[11px] font-semibold text-slate-500">
                  राउंड {roundIdx + 1} / {questions.length}
                </div>
                <div className="text-lg font-black font-mono tabular-nums text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{secLeft}s</span>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                <div className="text-xs font-bold text-amber-900 truncate">{p2Name}</div>
                <div className="text-2xl font-black font-mono tabular-nums text-amber-700 mt-0.5">{p2Score}</div>
              </div>
            </div>

            {/* Central Question */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-800">{currentQ.tag}</span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">{currentQ.question}</h2>
              </div>
              <button
                onClick={() => speakWithFemaleVoice(currentQ.question, { autoDetectLanguage: true })}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                <span>सुनें</span>
              </button>
            </div>

            {/* Split Buzzer Buttons: Player 1 vs Player 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Player 1 Pad */}
              <div className="bg-white border border-sky-200 rounded-2xl p-4 space-y-2.5">
                <div className="text-xs font-bold text-sky-900 pb-2 border-b border-sky-100">
                  {p1Name} — तुरंत सही विकल्प चुनें
                </div>
                {currentQ.options.map((opt, idx) => {
                  const isTrueOpt = idx === currentQ.correctIndex;
                  const isReveal = roundResult !== null && isTrueOpt;
                  const isWrongPick = roundResult !== null && lockedBy === 1 && chosenOpt === idx && !isTrueOpt;

                  return (
                    <button
                      key={idx}
                      disabled={roundResult !== null}
                      onClick={() => handlePlayerPick(1, idx)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors ${
                        isReveal
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                          : isWrongPick
                          ? 'bg-rose-50 border-rose-500 text-rose-900 font-bold'
                          : roundResult === null
                          ? 'bg-sky-50/50 hover:bg-sky-100 border-sky-200 text-slate-800 cursor-pointer'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <span>
                        <strong className="font-mono mr-2">{String.fromCharCode(65 + idx)}.</strong>
                        {opt}
                      </span>
                      {isReveal && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isWrongPick && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Player 2 Pad */}
              <div className="bg-white border border-amber-200 rounded-2xl p-4 space-y-2.5">
                <div className="text-xs font-bold text-amber-900 pb-2 border-b border-amber-100">
                  {p2Name} — तुरंत सही विकल्प चुनें
                </div>
                {currentQ.options.map((opt, idx) => {
                  const isTrueOpt = idx === currentQ.correctIndex;
                  const isReveal = roundResult !== null && isTrueOpt;
                  const isWrongPick = roundResult !== null && lockedBy === 2 && chosenOpt === idx && !isTrueOpt;

                  return (
                    <button
                      key={idx}
                      disabled={roundResult !== null}
                      onClick={() => handlePlayerPick(2, idx)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors ${
                        isReveal
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                          : isWrongPick
                          ? 'bg-rose-50 border-rose-500 text-rose-900 font-bold'
                          : roundResult === null
                          ? 'bg-amber-50/50 hover:bg-amber-100 border-amber-200 text-slate-800 cursor-pointer'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <span>
                        <strong className="font-mono mr-2">{String.fromCharCode(65 + idx)}.</strong>
                        {opt}
                      </span>
                      {isReveal && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isWrongPick && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {roundResult !== null && (
              <div
                className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
                  roundResult === 'correct'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold">
                  {roundResult === 'timeout'
                    ? `समय समाप्त! सही उत्तर: (${String.fromCharCode(65 + currentQ.correctIndex)}) ${currentQ.options[currentQ.correctIndex]}`
                    : roundResult === 'correct'
                    ? `${lockedBy === 1 ? p1Name : p2Name} ने सबसे तेज़ सही उत्तर दिया! (+10 अंक)`
                    : `${lockedBy === 1 ? p1Name : p2Name} ने गलत विकल्प चुना! सही उत्तर (${String.fromCharCode(65 + currentQ.correctIndex)}) है — विरोधी को +5 बोनस।`}
                </div>
                <button
                  onClick={nextRound}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  {roundIdx + 1 >= questions.length ? 'अंतिम परिणाम देखें →' : 'अगला राउंड →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* FINISHED PHASE */}
        {phase === 'finished' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {p1Score === p2Score
                  ? 'मैच बराबरी (Tie) पर छूटा!'
                  : `विजेता: ${p1Score > p2Score ? p1Name : p2Name}`}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {questions.length} राउंड का 1v1 मुकाबला पूरा हुआ
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                <div className="text-xs font-bold text-sky-900">{p1Name}</div>
                <div className="text-3xl font-black font-mono tabular-nums text-sky-700 mt-1">{p1Score}</div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="text-xs font-bold text-amber-900">{p2Name}</div>
                <div className="text-3xl font-black font-mono tabular-nums text-amber-700 mt-1">{p2Score}</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={startBattle}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
              >
                फिर से खेलें (Rematch)
              </button>
              <button
                onClick={() => setPhase('setup')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
              >
                विषय बदलें
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
