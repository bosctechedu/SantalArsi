import React, { useState, useMemo } from 'react';
import { Shuffle, Volume2, CheckCircle2, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface ScramblePuzzle {
  id: string;
  level: 'सरल' | 'मध्यम' | 'कठिन';
  hindiHint: string;
  englishHint: string;
  tokens: string[];
  romanSentence: string;
  grammarTip: string;
}

const SCRAMBLE_BANK: ScramblePuzzle[] = [
  {
    id: 'sc1',
    level: 'सरल',
    hindiHint: 'मैं घर जा रहा हूँ।',
    englishHint: 'I am going home.',
    tokens: ['इञ', 'ओड़ाक्', 'तेञ', 'चालाक्', 'काना'],
    romanSentence: 'In orak ten chalak kana.',
    grammarTip: 'संताली वाक्य क्रम: कर्ता (इञ) + स्थान (ओड़ाक् तेञ) + क्रिया (चालाक् काना)।'
  },
  {
    id: 'sc2',
    level: 'सरल',
    hindiHint: 'आज बहुत अच्छी धूप खिली है।',
    englishHint: 'Today there is very bright sunshine.',
    tokens: ['तेहेञ', 'दो', 'आड़ि', 'नापाय', 'सितुंग', 'आकाना'],
    romanSentence: 'Tehej do adi napay situng akana.',
    grammarTip: '"आड़ि नापाय" विशेषण है और "सितुंग" का अर्थ धूप होता है।'
  },
  {
    id: 'sc3',
    level: 'मध्यम',
    hindiHint: 'हम सब मिलकर सोहराय नृत्य करेंगे।',
    englishHint: 'All of us together will dance Sohrai.',
    tokens: ['आबो', 'जोतो', 'मेसा', 'काते', 'सोहराय', 'बो', 'एनेच-आ'],
    romanSentence: 'Abo joto mesa kate Sohrai bo enej-a.',
    grammarTip: '"आबो" समावेशी सर्वनाम है जिसमें श्रोता भी शामिल होता है।'
  },
  {
    id: 'sc4',
    level: 'मध्यम',
    hindiHint: 'अपनी लिपि सीखो, अपनी भाषा बोलो।',
    englishHint: 'Learn your script, speak your language.',
    tokens: ['ओल', 'चेमेद्', 'रोड़', 'चेमेद्', 'आबो', 'गोरोब'],
    romanSentence: 'Ol chemed, ror chemed, abo gorob.',
    grammarTip: 'पंडित रघुनाथ मुर्मू का प्रसिद्ध भाषा-संरक्षण सूत्र वाक्य।'
  },
  {
    id: 'sc5',
    level: 'कठिन',
    hindiHint: 'गांव के सभी लोग जाहेर थान में पूजा कर रहे हैं।',
    englishHint: 'All villagers are worshipping at Jaher Than.',
    tokens: ['आतू', 'होड़', 'को', 'जाहेर', 'थान', 'रे', 'को', 'बोंगा', 'एत्-आ'],
    romanSentence: 'Atu hor ko Jaher Than re ko bonga et-a.',
    grammarTip: '"-को" बहुवचन और "-रे" अधिकरण कारक (में) दर्शाता है।'
  },
  {
    id: 'sc6',
    level: 'कठिन',
    hindiHint: 'हमारे दोनों मित्र नदी से स्वच्छ पानी ला रहे हैं।',
    englishHint: 'Our two friends are bringing clean water from the river.',
    tokens: ['आलांग', 'गित्राकिन', 'गाडा', 'खोन', 'साफा', 'दाक्', 'किन', 'आगू', 'एत्-आ'],
    romanSentence: 'Alang gitrakin gada khon safa dak kin agu et-a.',
    grammarTip: '"-किन" द्विवचन (दो लोगों) का सूचक प्रत्यय है।'
  }
];

function deterministicShuffle(arr: string[], seedIdx: number): string[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (i * 7 + seedIdx * 3 + 1) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  if (copy.join(' ') === arr.join(' ') && copy.length > 1) {
    [copy[0], copy[copy.length - 1]] = [copy[copy.length - 1], copy[0]];
  }
  return copy;
}

export const SantaliSentenceScramble: React.FC = () => {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [pickedIndices, setPickedIndices] = useState<number[]>([]);
  const [score, setScore] = useState(() => {
    try {
      return Number(localStorage.getItem('hor_katha_scramble_score') || 0);
    } catch {
      return 0;
    }
  });
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const currentPuzzle = SCRAMBLE_BANK[puzzleIdx];
  const scrambledBank = useMemo(
    () => deterministicShuffle(currentPuzzle.tokens, puzzleIdx + 1),
    [currentPuzzle, puzzleIdx]
  );

  const builtWords = pickedIndices.map((idx) => scrambledBank[idx]);

  const handleTogglePoolIndex = (idx: number) => {
    if (status === 'correct') return;
    setStatus('idle');
    if (pickedIndices.includes(idx)) {
      setPickedIndices((prev) => prev.filter((i) => i !== idx));
    } else {
      const next = [...pickedIndices, idx];
      setPickedIndices(next);
      speakWithFemaleVoice(scrambledBank[idx], { autoDetectLanguage: true });
    }
  };

  const handleCheck = () => {
    const target = currentPuzzle.tokens.join(' ');
    const userStr = builtWords.join(' ');
    if (userStr === target) {
      setStatus('correct');
      const nextScore = score + 10;
      setScore(nextScore);
      try {
        localStorage.setItem('hor_katha_scramble_score', String(nextScore));
      } catch {
        // ignore
      }
      speakWithFemaleVoice(`शाबाश! सही वाक्य: ${target}`, { autoDetectLanguage: true });
    } else {
      setStatus('wrong');
    }
  };

  const handleResetCurrent = () => {
    setPickedIndices([]);
    setStatus('idle');
  };

  const handleNext = () => {
    setPuzzleIdx((i) => (i + 1) % SCRAMBLE_BANK.length);
    setPickedIndices([]);
    setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <Shuffle className="w-4 h-4" />
              <span>इंटरैक्टिव संताली वाक्य संरचना पहेली</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              संताली वाक्य-निर्माण पहेली (Sentence Scramble Builder)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              बिखरे हुए संताली शब्दों को सही व्याकरण क्रम में सजाएँ और पूरा वाक्य बोलकर सुनें।
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-300 text-right">
            <div className="text-[10px] font-bold text-amber-800">कुल अंक (Score)</div>
            <div className="font-mono tabular-nums text-xl font-black text-amber-950">{score}</div>
          </div>
        </div>

        {/* Puzzle Workspace */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 font-bold">
              पहेली {puzzleIdx + 1} / {SCRAMBLE_BANK.length} · स्तर: {currentPuzzle.level}
            </span>
            <button
              onClick={() =>
                speakWithFemaleVoice(`${currentPuzzle.hindiHint}। ${currentPuzzle.tokens.join(' ')}`, {
                  autoDetectLanguage: true
                })
              }
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>वाक्य संकेत सुनें</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
            <div className="text-[11px] font-bold text-amber-900">इस हिन्दी/अंग्रेज़ी वाक्य का संताली रूप बनाएं:</div>
            <h2 className="text-lg font-bold text-slate-900">{currentPuzzle.hindiHint}</h2>
            <p className="text-xs text-slate-600 italic">{currentPuzzle.englishHint}</p>
          </div>

          {/* Target Answer Tray */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700">आपका निर्मित संताली वाक्य (Click tile to remove):</div>
            <div className="min-h-[68px] p-3.5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-wrap items-center gap-2">
              {pickedIndices.length === 0 ? (
                <span className="text-xs text-slate-400">नीचे दिए गए शब्दों पर क्रम से क्लिक करें...</span>
              ) : (
                pickedIndices.map((idx, pos) => (
                  <button
                    key={`${idx}-${pos}`}
                    onClick={() => handleTogglePoolIndex(idx)}
                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold shadow-xs cursor-pointer"
                  >
                    {scrambledBank[idx]}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Scrambled Word Bank */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700">शब्द खंड चुनें (Word Tiles):</div>
            <div className="flex flex-wrap gap-2">
              {scrambledBank.map((word, idx) => {
                const used = pickedIndices.includes(idx);
                return (
                  <button
                    key={`${word}-${idx}`}
                    disabled={used}
                    onClick={() => handleTogglePoolIndex(idx)}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      used
                        ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-default'
                        : 'bg-white hover:bg-amber-50 text-slate-900 border-slate-300 hover:border-amber-500 shadow-2xs'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Banner */}
          {status === 'correct' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>बिल्कुल सही संताली वाक्य! (+10 अंक)</span>
              </div>
              <p className="text-xs text-slate-700">
                <strong>रोमन उच्चारण:</strong> {currentPuzzle.romanSentence}
              </p>
              <p className="text-xs text-emerald-800">{currentPuzzle.grammarTip}</p>
            </div>
          )}

          {status === 'wrong' && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-xs font-semibold text-rose-900">
              अभी क्रम थोड़ा अलग है। ऊपर के शब्दों पर क्लिक करके क्रम बदलें या "सही उत्तर देखें" से मदद लें।
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCheck}
                disabled={pickedIndices.length !== currentPuzzle.tokens.length}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
              >
                वाक्य जांचें (Check Answer)
              </button>
              <button
                onClick={handleResetCurrent}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रीसेट</span>
              </button>
              <button
                onClick={() => {
                  const answerIndices = currentPuzzle.tokens.map((t) => scrambledBank.indexOf(t));
                  setPickedIndices(answerIndices);
                  setStatus('idle');
                  speakWithFemaleVoice(currentPuzzle.tokens.join(' '), { autoDetectLanguage: true });
                }}
                className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>सही क्रम दिखाएं</span>
              </button>
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>अगला वाक्य</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
