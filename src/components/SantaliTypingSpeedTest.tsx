import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, Volume2, RotateCcw, Trophy, Clock, CheckCircle2 } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface TypingPrompt {
  id: string;
  mode: 'roman' | 'devanagari';
  text: string;
  hindiMeaning: string;
}

const TYPING_PROMPTS: TypingPrompt[] = [
  {
    id: 'rom_1',
    mode: 'roman',
    text: 'Johar! Abo joto hor katha tebon ropora ar ol-parhaw bon sikhawa.',
    hindiMeaning: 'जोहार! हम सब संताली भाषा में बात करेंगे और लिखना-पढ़ना सीखेंगे।'
  },
  {
    id: 'rom_2',
    mode: 'roman',
    text: 'Bir buru ar jaher than do abowah dhorom ar jiwon rah adhar kana.',
    hindiMeaning: 'जंगल, पहाड़ और जाहेर थान हमारे धर्म और जीवन के आधार हैं।'
  },
  {
    id: 'dev_1',
    mode: 'devanagari',
    text: 'जोहार गाते को! तेहेञ दो बाहा परब काना, जोतो को सागुन जोहार।',
    hindiMeaning: 'जोहार मित्रों! आज बाहा पर्व है, सभी को शुभ जोहार।'
  },
  {
    id: 'dev_2',
    mode: 'devanagari',
    text: 'साल दारे बुटा रे नायके बाबा बिनती काना, सुख शांति ताहेन मा।',
    hindiMeaning: 'साल वृक्ष के नीचे नायके बाबा प्रार्थना कर रहे हैं, सुख-शांति बनी रहे।'
  }
];

export const SantaliTypingSpeedTest: React.FC = () => {
  const [promptIndex, setPromptIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentPrompt = TYPING_PROMPTS[promptIndex];

  useEffect(() => {
    if (!isRunning || isFinished) return;
    if (timeLeft <= 0) {
      setIsRunning(false);
      setIsFinished(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft, isFinished]);

  const handleInputChange = (val: string) => {
    if (isFinished) return;
    if (!isRunning && val.length > 0) {
      setIsRunning(true);
    }
    setUserInput(val);
    if (val.trim() === currentPrompt.text.trim()) {
      setIsRunning(false);
      setIsFinished(true);
    }
  };

  const resetTest = (nextIdx?: number) => {
    const idx = nextIdx !== undefined ? nextIdx : promptIndex;
    setPromptIndex(idx);
    setUserInput('');
    setTimeLeft(60);
    setIsRunning(false);
    setIsFinished(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const elapsedSeconds = Math.max(1, 60 - timeLeft);
  const wordsTyped = userInput.trim() ? userInput.trim().split(/\s+/).length : 0;
  const wpm = Math.round((wordsTyped / elapsedSeconds) * 60);

  let correctChars = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === currentPrompt.text[i]) correctChars++;
  }
  const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-5xl mx-auto mb-6 bg-gradient-to-r from-sky-50 via-white to-indigo-50 border border-sky-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Keyboard className="w-4 h-4" />
              <span>सुपर-फास्ट टाइपिंग अभ्यास | Santali Typing Speed &amp; WPM Test</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              संताली टाइपिंग स्पीड टेस्ट (Roman &amp; Devanagari)
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              ६० सेकंड में अपनी संताली टाइपिंग गति (WPM) और सटीकता (Accuracy %) परखें।
            </p>
          </div>
          <button
            onClick={() => speakWithFemaleVoice(`${currentPrompt.text}। अर्थ: ${currentPrompt.hindiMeaning}`, { lang: 'hi-IN' })}
            className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white border border-sky-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>वाक्य सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-5">
        {/* Prompt selector */}
        <div className="flex flex-wrap gap-2">
          {TYPING_PROMPTS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => resetTest(idx)}
              className={`px-3 py-1.5 text-xs font-bold border transition-all ${
                promptIndex === idx
                  ? 'bg-sky-600 text-white border-sky-400'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-sky-200'
              }`}
            >
              {p.mode === 'roman' ? 'Roman अभ्यास' : 'देवनागरी अभ्यास'} #{idx + 1}
            </button>
          ))}
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-stone-200 p-4 text-center">
            <div className="text-[11px] uppercase text-stone-600 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-700" /> शेष समय
            </div>
            <div className="text-2xl font-bold font-mono text-amber-700 mt-1">{timeLeft}s</div>
          </div>
          <div className="bg-white border border-stone-200 p-4 text-center">
            <div className="text-[11px] uppercase text-stone-600 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-sky-700" /> गति (WPM)
            </div>
            <div className="text-2xl font-bold font-mono text-sky-700 mt-1">{wpm}</div>
          </div>
          <div className="bg-white border border-stone-200 p-4 text-center">
            <div className="text-[11px] uppercase text-stone-600 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> सटीकता (Accuracy)
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{accuracy}%</div>
          </div>
        </div>

        {/* Target Display with live character highlight */}
        <div className="bg-white border-2 border-amber-200 p-6 space-y-3">
          <div className="text-xs text-amber-700 uppercase font-bold">टाइप करने हेतु लक्षित वाक्य:</div>
          <div className="text-xl md:text-2xl font-mono leading-relaxed tracking-wide select-none bg-stone-50 p-4 border border-stone-200">
            {currentPrompt.text.split('').map((char, idx) => {
              let colorClass = 'text-stone-600';
              if (idx < userInput.length) {
                colorClass = userInput[idx] === char ? 'text-emerald-700 font-bold' : 'text-rose-700 bg-rose-50 underline';
              }
              return (
                <span key={idx} className={colorClass}>
                  {char}
                </span>
              );
            })}
          </div>
          <p className="text-xs text-stone-600">भावार्थ: {currentPrompt.hindiMeaning}</p>
        </div>

        {/* Typing Area */}
        <div className="space-y-3">
          <textarea
            ref={inputRef}
            rows={3}
            value={userInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="ऊपर लिखा वाक्य यहाँ टाइप करना शुरू करें..."
            className="w-full bg-white border-2 border-sky-200 focus:border-sky-400 outline-none p-4 text-lg font-mono text-amber-950"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => resetTest()}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>पुनः शुरू करें (Restart)</span>
            </button>

            {isFinished && (
              <div className="bg-emerald-50 border border-emerald-500 px-4 py-2 text-xs font-bold text-emerald-700">
                पूर्ण! आपकी गति: {wpm} WPM | सटीकता: {accuracy}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
