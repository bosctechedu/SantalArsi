import React, { useState, useEffect, useRef } from 'react';
import { FOLK_RADIO_STORIES } from './SantaliFolkRadio';
import { speakWithFemaleVoice, stopSpeaking, pauseSpeaking, resumeSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Moon,
  Plus,
  Trash2,
  ListMusic,
  Volume2
} from 'lucide-react';

interface PlaylistTrack {
  id: string;
  titleDev: string;
  titleRoman: string;
  category: 'लोककथा' | 'सेरेञ व बिनती' | 'बालगीत' | 'सुभाषित';
  santaliText: string;
  hindiMeaning: string;
  durationEstMin: number;
}

const TRACK_LIBRARY: PlaylistTrack[] = [
  ...FOLK_RADIO_STORIES.map((story) => ({
    id: `story_${story.id}`,
    titleDev: story.titleDev,
    titleRoman: story.titleRoman,
    category: 'लोककथा' as const,
    santaliText: story.paragraphs.map((p) => p.devanagari).join(' '),
    hindiMeaning: story.synopsisHindi,
    durationEstMin: story.durationMinutes || 5
  })),
  {
    id: 'sereng_baha_1',
    titleDev: 'बाहा पर्व स्वागत सेरेञ (सखुआ फूल गीत)',
    titleRoman: 'Baha Parab Swagat Sereng',
    category: 'सेरेञ व बिनती',
    santaliText:
      'आले अतु जाहेर थान रे, सारजोम बाहा फुटाउ एना। मरांग बुरु आर जाहेर आयो, जोतो होड़ बॉन डोबोक जोहार आ।',
    hindiMeaning: 'हमारे गाँव के पवित्र जाहेर थान में सखुआ के फूल खिल उठे हैं। आइए हम सब मरांग बुरु और जाहेर आयो को सादर प्रणाम करें।',
    durationEstMin: 2
  },
  {
    id: 'binti_karam_1',
    titleDev: 'करम बिनती व धरती सिरजोन छंद',
    titleRoman: 'Karam Binti Sirjon Chhand',
    category: 'सेरेञ व बिनती',
    santaliText:
      'ठाकुर जियू सिरजोन केदा, ओते हासा आर सेरमा इपिल। करम डार रे रस्का ताहेन मा, अतु दिशोम रे सुलुक ताहेन मा।',
    hindiMeaning: 'सृष्टिकर्ता ठाकुर जियू ने धरती और आकाश के तारों की रचना की। करम डाल के चारों ओर आनंद और पूरे समाज में एकता बनी रहे।',
    durationEstMin: 2
  },
  {
    id: 'rhyme_kids_1',
    titleDev: 'चांदो मामा व इपिल बालगीत',
    titleRoman: 'Chando Mama ar Ipil Rhyme',
    category: 'बालगीत',
    santaliText:
      'चांदो मामा देला हिजुक् में, इपिल को सालाक् एनेच में। गिद्रा को दो रस्का एना को, सेरेञ आबो जाराव काते।',
    hindiMeaning: 'चंदा मामा आओ पधारो, तारों के संग खेलो। बच्चे सब प्रसन्न हो उठे हैं, आइए हम सब मिलकर गीत गाएं।',
    durationEstMin: 1
  },
  {
    id: 'rhyme_kids_2',
    titleDev: 'मिठू चेँड़े आर दारे (तोता व पेड़ बालगीत)',
    titleRoman: 'Mithu Chene ar Dare',
    category: 'बालगीत',
    santaliText:
      'मारंग दारे रे मिठू चेँड़े, सेताक् खोनाक् सेरेञ एत्-आ। उल जोम काते उड़ौ चालाव एना, जोतो गिद्रा खुशी एना को।',
    hindiMeaning: 'बड़े पेड़ पर तोता पक्षी सुबह से गीत गा रहा है। आम खाकर उड़ चला और सारे बच्चे खुशी से झूम उठे।',
    durationEstMin: 1
  },
  {
    id: 'proverb_wisdom_1',
    titleDev: 'भेंता काथा व जीवन नीति संग्रह',
    titleRoman: 'Bhenta Katha Wisdom Collection',
    category: 'सुभाषित',
    santaliText:
      'मित् ते ताहेन रे दाड़े मेनाक्-आ। जोंका बाङ खान दारे दो ओहोय हारा लेन। नापाय काथा दो सोना लेका दाम आ।',
    hindiMeaning: 'एकजुट रहने में ही शक्ति है। जड़ के बिना वृक्ष कभी बड़ा नहीं हो सकता। मधुर और सत्य वाणी सोने के समान अमूल्य होती है।',
    durationEstMin: 2
  }
];

export const SantaliAudioPlaylistPlayer: React.FC = () => {
  const [queueIds, setQueueIds] = useState<string[]>(() => TRACK_LIBRARY.slice(0, 5).map((t) => t.id));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [repeatAll, setRepeatAll] = useState<boolean>(true);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(0.88);
  const [sleepMinutes, setSleepMinutes] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const isPlayingRef = useRef(isPlaying);
  const autoAdvanceRef = useRef(autoAdvance);
  const shuffleRef = useRef(shuffle);
  const repeatAllRef = useRef(repeatAll);
  const queueIdsRef = useRef(queueIds);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    autoAdvanceRef.current = autoAdvance;
    shuffleRef.current = shuffle;
    repeatAllRef.current = repeatAll;
    queueIdsRef.current = queueIds;
    currentIndexRef.current = currentIndex;
  }, [isPlaying, autoAdvance, shuffle, repeatAll, queueIds, currentIndex]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Real Sleep Timer countdown
  useEffect(() => {
    if (sleepMinutes <= 0) {
      setSecondsLeft(0);
      return;
    }
    setSecondsLeft(sleepMinutes * 60);
  }, [sleepMinutes]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          stopSpeaking();
          setIsPlaying(false);
          setIsPaused(false);
          setSleepMinutes(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft > 0]);

  const queueTracks = queueIds
    .map((id) => TRACK_LIBRARY.find((t) => t.id === id))
    .filter((t): t is PlaylistTrack => Boolean(t));

  const activeTrack = queueTracks[currentIndex] || queueTracks[0] || TRACK_LIBRARY[0];

  const playTrackAt = (index: number) => {
    const q = queueIdsRef.current
      .map((id) => TRACK_LIBRARY.find((t) => t.id === id))
      .filter((t): t is PlaylistTrack => Boolean(t));
    if (q.length === 0) return;
    const bounded = ((index % q.length) + q.length) % q.length;
    const track = q[bounded];
    setCurrentIndex(bounded);
    setIsPlaying(true);
    setIsPaused(false);

    speakWithFemaleVoice(`${track.titleDev}। ${track.santaliText}`, {
      autoDetectLanguage: true,
      rate: speechRate,
      onEnd: () => {
        if (!isPlayingRef.current) return;
        if (!autoAdvanceRef.current) {
          setIsPlaying(false);
          return;
        }
        const len = queueIdsRef.current.length;
        if (len === 0) {
          setIsPlaying(false);
          return;
        }
        let nextIdx = bounded + 1;
        if (shuffleRef.current && len > 1) {
          nextIdx = Math.floor(Math.random() * len);
          if (nextIdx === bounded) nextIdx = (bounded + 1) % len;
        } else if (nextIdx >= len) {
          if (repeatAllRef.current) {
            nextIdx = 0;
          } else {
            setIsPlaying(false);
            return;
          }
        }
        playTrackAt(nextIdx);
      }
    });
  };

  const handleTogglePlayPause = () => {
    if (!isPlaying) {
      playTrackAt(currentIndex);
    } else if (isPaused) {
      resumeSpeaking();
      setIsPaused(false);
    } else {
      pauseSpeaking();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    stopSpeaking();
  };

  const handleNext = () => {
    if (queueTracks.length === 0) return;
    const nextIdx = shuffle && queueTracks.length > 1
      ? Math.floor(Math.random() * queueTracks.length)
      : (currentIndex + 1) % queueTracks.length;
    playTrackAt(nextIdx);
  };

  const handlePrev = () => {
    if (queueTracks.length === 0) return;
    const prevIdx = (currentIndex - 1 + queueTracks.length) % queueTracks.length;
    playTrackAt(prevIdx);
  };

  const loadPreset = (preset: 'night' | 'kids' | 'all') => {
    handleStop();
    if (preset === 'night') {
      setQueueIds(TRACK_LIBRARY.filter((t) => t.category === 'लोककथा' || t.category === 'सुभाषित').map((t) => t.id));
    } else if (preset === 'kids') {
      setQueueIds(TRACK_LIBRARY.filter((t) => t.category === 'बालगीत' || t.category === 'सेरेञ व बिनती').map((t) => t.id));
    } else {
      setQueueIds(TRACK_LIBRARY.map((t) => t.id));
    }
    setCurrentIndex(0);
  };

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-indigo-800">
            स्वतः निरंतर वाचन · लोककथा, सेरेञ व स्लीप टाइमर
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            निरंतर सेरेञ प्लेलिस्ट व स्लीप टाइमर (Audio Playlist)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            एक के बाद एक लोककथाएँ, करम बिनती, बालगीत और भेंता काथा बिना रुके सुनें — रात्रि स्लीप टाइमर के साथ।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => loadPreset('night')}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 whitespace-nowrap cursor-pointer"
          >
            रात्रि कथा संग्रह
          </button>
          <button
            onClick={() => loadPreset('kids')}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 whitespace-nowrap cursor-pointer"
          >
            बालगीत व सेरेञ
          </button>
          <button
            onClick={() => loadPreset('all')}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
          >
            सभी ट्रैक लोड करें
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Now Playing & Controls */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="space-y-2 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{activeTrack.category}</span>
              <span className="tabular-nums">
                ट्रैक {currentIndex + 1} / {Math.max(1, queueTracks.length)} · ~{activeTrack.durationEstMin} मिनट
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{activeTrack.titleDev}</h2>
            <p className="text-base font-semibold text-amber-800">{toOlChikiAuto(activeTrack.titleDev)}</p>
            <p className="text-xs text-slate-500">{activeTrack.titleRoman}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {activeTrack.santaliText}
            </p>
            <p className="text-xs text-amber-800 leading-relaxed">
              {toOlChikiAuto(activeTrack.santaliText)}
            </p>
            <p className="text-xs text-slate-600 pt-2 border-t border-slate-200">
              <strong>भावार्थ:</strong> {activeTrack.hindiMeaning}
            </p>
          </div>

          {/* Player Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
                title="पिछला ट्रैक"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={handleTogglePlayPause}
                className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                {isPlaying && !isPaused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying && !isPaused ? 'रोकें (Pause)' : isPaused ? 'जारी रखें' : 'प्लेलिस्ट चलाएँ'}</span>
              </button>
              <button
                onClick={handleStop}
                className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 cursor-pointer"
                title="रोकें (Stop)"
              >
                <Square className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
                title="अगला ट्रैक"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setShuffle((p) => !p)}
                className={`px-2.5 py-1.5 rounded-lg border font-semibold inline-flex items-center gap-1 cursor-pointer ${
                  shuffle ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>शफल</span>
              </button>
              <button
                onClick={() => setRepeatAll((p) => !p)}
                className={`px-2.5 py-1.5 rounded-lg border font-semibold inline-flex items-center gap-1 cursor-pointer ${
                  repeatAll ? 'bg-amber-50 border-amber-400 text-amber-900' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>रिपीट</span>
              </button>
            </div>
          </div>

          {/* Speed & Sleep Timer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span className="inline-flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>वाचन गति</span>
                </span>
                <span className="tabular-nums">{speechRate.toFixed(2)}×</span>
              </div>
              <input
                type="range"
                min={0.7}
                max={1.2}
                step={0.05}
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span className="inline-flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-indigo-700" />
                  <span>स्लीप टाइमर</span>
                </span>
                <span className="tabular-nums text-indigo-800 font-bold">
                  {secondsLeft > 0 ? formatCountdown(secondsLeft) : 'बंद'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[0, 15, 30, 60].map((min) => (
                  <button
                    key={min}
                    onClick={() => setSleepMinutes(min)}
                    className={`flex-1 py-1.5 rounded-lg border font-semibold tabular-nums cursor-pointer ${
                      sleepMinutes === min
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {min === 0 ? 'Off' : `${min}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Queue & Track Library */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ListMusic className="w-4 h-4 text-amber-700" />
                <span>वर्तमान प्लेलिस्ट कतार ({queueTracks.length})</span>
              </h3>
              <label className="text-[11px] font-semibold text-slate-600 inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                />
                <span>Auto-Next</span>
              </label>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {queueTracks.map((t, idx) => {
                const active = idx === currentIndex && isPlaying;
                return (
                  <div
                    key={`${t.id}_${idx}`}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                      active ? 'bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => playTrackAt(idx)}
                      className="text-left flex-1 min-w-0 cursor-pointer"
                    >
                      <p className="text-xs font-bold text-slate-900 truncate">{t.titleDev}</p>
                      <p className="text-[11px] text-slate-500">
                        {t.category} · ~{t.durationEstMin} मिनट
                      </p>
                    </button>
                    <button
                      onClick={() => {
                        setQueueIds((prev) => prev.filter((_, i) => i !== idx));
                        if (idx < currentIndex) setCurrentIndex((p) => Math.max(0, p - 1));
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="कतार से हटाएँ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
              संग्रह से जोड़ें (Library)
            </h3>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {TRACK_LIBRARY.map((t) => (
                <div
                  key={t.id}
                  className="p-2 rounded-lg border border-slate-100 hover:border-slate-200 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{t.titleDev}</p>
                    <p className="text-[11px] text-slate-500">{t.category}</p>
                  </div>
                  <button
                    onClick={() => setQueueIds((prev) => [...prev, t.id])}
                    className="px-2.5 py-1 rounded border border-slate-200 hover:bg-amber-50 text-slate-700 font-semibold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>जोड़ें</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
