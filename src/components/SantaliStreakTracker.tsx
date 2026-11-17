import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  CheckCircle2,
  Trophy,
  Volume2,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Target
} from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface DailyGoal {
  id: string;
  labelDev: string;
  hindiDesc: string;
  points: number;
}

const DAILY_GOALS: DailyGoal[] = [
  { id: 'alphabet', labelDev: '20 नए संताली शब्द सीखें', hindiDesc: 'शब्दकोश या SRS फ़्लैशकार्ड से कम से कम 20 नए शब्द दोहराएँ।', points: 25 },
  { id: 'exam_mock', labelDev: '1 रियल परीक्षा मॉक टेस्ट', hindiDesc: 'Exam Hub से JPSC / JSSC / SSC / UPSC का 1 समयबद्ध सेट हल करें।', points: 30 },
  { id: 'current_affairs', labelDev: 'करेंट अफेयर्स 2026 रिवीज़न', hindiDesc: 'आज के भारत + झारखंड करेंट अफेयर्स और मिनी क्विज़ पूरा करें।', points: 20 },
  { id: 'dialogue', labelDev: 'बोलचाल व उच्चारण अभ्यास', hindiDesc: 'संताली रोमन / हिंदी / अंग्रेज़ी स्पीकर के साथ 5 संवाद दोहराएँ।', points: 25 }
];

type PomodoroPreset = 'focus_25' | 'sprint_15' | 'break_5';

const PRESET_SECONDS: Record<PomodoroPreset, { sec: number; label: string }> = {
  focus_25: { sec: 25 * 60, label: '25 मिनट गहन पढ़ाई (Focus)' },
  sprint_15: { sec: 15 * 60, label: '15 मिनट त्वरित रिवीज़न' },
  break_5: { sec: 5 * 60, label: '5 मिनट विश्राम (Break)' }
};

function playChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.14 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.14);
      osc.stop(ctx.currentTime + i * 0.14 + 0.42);
    });
  } catch {
    // ignore audio block
  }
}

export const SantaliStreakTracker: React.FC = () => {
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hor_katha_daily_goals');
      return saved ? JSON.parse(saved) : ['alphabet'];
    } catch {
      return ['alphabet'];
    }
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('hor_katha_streak_days');
      return saved ? Number(saved) : 3;
    } catch {
      return 3;
    }
  });

  const [focusMinutesToday, setFocusMinutesToday] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('hor_katha_focus_minutes');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [dailyWordTarget, setDailyWordTarget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('hor_katha_word_target');
      return saved ? Number(saved) : 20;
    } catch {
      return 20;
    }
  });

  // Pomodoro Timer State
  const [preset, setPreset] = useState<PomodoroPreset>('focus_25');
  const [secondsLeft, setSecondsLeft] = useState<number>(PRESET_SECONDS.focus_25.sec);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const completedSessionRef = useRef<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('hor_katha_daily_goals', JSON.stringify(completedIds));
      localStorage.setItem('hor_katha_streak_days', String(streakDays));
      localStorage.setItem('hor_katha_focus_minutes', String(focusMinutesToday));
      localStorage.setItem('hor_katha_word_target', String(dailyWordTarget));
    } catch {
      // ignore storage errors
    }
  }, [completedIds, streakDays, focusMinutesToday, dailyWordTarget]);

  useEffect(() => {
    if (!timerRunning) return;
    if (secondsLeft <= 0) {
      setTimerRunning(false);
      if (!completedSessionRef.current) {
        completedSessionRef.current = true;
        playChime();
        if (preset !== 'break_5') {
          const addedMin = Math.round(PRESET_SECONDS[preset].sec / 60);
          setFocusMinutesToday((m) => m + addedMin);
        }
      }
      return;
    }
    const id = window.setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning, secondsLeft, preset]);

  const handleSelectPreset = (p: PomodoroPreset) => {
    setTimerRunning(false);
    completedSessionRef.current = false;
    setPreset(p);
    setSecondsLeft(PRESET_SECONDS[p].sec);
  };

  const toggleGoal = (id: string) => {
    setCompletedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const totalScore = DAILY_GOALS.filter((g) => completedIds.includes(g.id)).reduce((sum, g) => sum + g.points, 0);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-24">
      <div className="max-w-5xl mx-auto space-y-5">
        <header className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
              <Flame className="w-4 h-4" />
              <span>दैनिक अध्ययन लक्ष्य व पोमोडोरो फोकस टाइमर (Study Goal &amp; Focus Timer)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              दैनिक संताली व परीक्षा तैयारी लक्ष्य ट्रैकर
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              प्रतिदिन के लक्ष्य तय करें, 25-मिनट फोकस टाइमर के साथ एकाग्र अध्ययन करें और अपनी स्ट्रीक बढ़ाएँ।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `आपका आज का अध्ययन स्कोर ${totalScore} प्रतिशत, स्ट्रीक ${streakDays} दिन और कुल फोकस समय ${focusMinutesToday} मिनट है।`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 self-start cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>प्रगति सुनें</span>
          </button>
        </header>

        {/* Top KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5">
            <Flame className="w-9 h-9 text-orange-600 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">निरंतर दिन (Streak)</span>
              <span className="text-xl font-black font-mono tabular-nums text-slate-900">{streakDays} दिन</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5">
            <Trophy className="w-9 h-9 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">आज की पूर्णता</span>
              <span className="text-xl font-black font-mono tabular-nums text-emerald-700">{totalScore}%</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5">
            <Timer className="w-9 h-9 text-sky-600 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">आज का फोकस समय</span>
              <span className="text-xl font-black font-mono tabular-nums text-sky-800">{focusMinutesToday} मिनट</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">उपस्थिति दर्ज</span>
              <span className="text-xs font-bold text-slate-900">दैनिक चेक-इन</span>
            </div>
            <button
              onClick={() => setStreakDays((d) => d + 1)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              +1 दिन
            </button>
          </div>
        </div>

        {/* Pomodoro Exam Focus Timer */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-800">
              <Timer className="w-4 h-4" />
              <span>पोमोडोरो परीक्षा फोकस टाइमर (Pomodoro Study Timer)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PRESET_SECONDS) as PomodoroPreset[]).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    preset === key
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {PRESET_SECONDS[key].label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-700" />
                <span>दैनिक शब्द लक्ष्य:</span>
              </label>
              <select
                value={dailyWordTarget}
                onChange={(e) => setDailyWordTarget(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
              >
                <option value={10}>10 शब्द / दिन</option>
                <option value={20}>20 शब्द / दिन</option>
                <option value={30}>30 शब्द / दिन</option>
                <option value={50}>50 शब्द / दिन</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-3">
            <div className="text-4xl font-black font-mono tabular-nums text-slate-900 tracking-tight">
              {mm}:{ss}
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  completedSessionRef.current = false;
                  setTimerRunning((r) => !r);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-white cursor-pointer ${
                  timerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{timerRunning ? 'रोकें (Pause)' : 'शुरू करें (Start)'}</span>
              </button>

              <button
                onClick={() => handleSelectPreset(preset)}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रीसेट</span>
              </button>
            </div>
          </div>
        </section>

        {/* Progress Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-slate-800">आज के लक्ष्य प्रगति स्तर</span>
            <span className="text-emerald-700 font-mono tabular-nums">{totalScore} / 100 अंक</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 transition-all duration-300"
              style={{ width: `${totalScore}%` }}
            />
          </div>
        </div>

        {/* Goal Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DAILY_GOALS.map((goal) => {
            const done = completedIds.includes(goal.id);
            return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                  done
                    ? 'bg-emerald-50 border-emerald-400'
                    : 'bg-white border-slate-200 hover:border-amber-400'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${done ? 'text-emerald-600' : 'text-slate-300'}`} />
                <div>
                  <div className="text-sm font-bold text-slate-900 flex flex-wrap items-center gap-2">
                    <span>{goal.labelDev}</span>
                    <span className="text-[11px] font-mono text-amber-800">+{goal.points} अंक</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{goal.hindiDesc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
