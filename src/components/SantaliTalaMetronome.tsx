import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, RotateCcw, Volume2, Sliders } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface SantaliTala {
  id: string;
  name: string;
  santaliName: string;
  beats: number;
  defaultBpm: number;
  description: string;
  bolPattern: string[];
  accentBeats: number[]; // 1-indexed beats that receive accent
}

const SANTALI_TALAS: SantaliTala[] = [
  {
    id: 'lagne',
    name: 'लांगड़े ताल (Lagne Tala)',
    santaliName: 'लागणे ताला',
    beats: 4,
    defaultBpm: 92,
    description: 'संताल समाज का सबसे लोकप्रिय सामुदायिक नृत्य ताल। गोल घेरे में कदमताल के साथ बजाया जाता है।',
    bolPattern: ['धा (Dha)', 'तिन (Tin)', 'ता (Ta)', 'तिन (Tin)'],
    accentBeats: [1, 3]
  },
  {
    id: 'sohrai',
    name: 'सोहराय ताल (Sohrai Tala)',
    santaliName: 'सोहराय ताला',
    beats: 6,
    defaultBpm: 108,
    description: 'पूस महापर्व सोहराय का मुख्य उत्साहवर्धक ताल। खूंटाव और अखड़ा में तुमाक-तामाक की तीव्र गूँज।',
    bolPattern: ['धांग (Dhang)', 'ता (Ta)', 'धिन् (Dhin)', 'ता (Ta)', 'धा (Dha)', 'कत् (Kat)'],
    accentBeats: [1, 4]
  },
  {
    id: 'danta',
    name: 'दांता ताल (Danta Tala)',
    santaliName: 'डांटा ताला',
    beats: 8,
    defaultBpm: 84,
    description: 'पुरुषों के डंडा नृत्य का अनुशासित और धीर-गंभीर ताल। सम और तालियों का संतुलन।',
    bolPattern: ['धा (Dha)', 'धिन् (Dhin)', 'ता (Ta)', 'तिन् (Tin)', 'धा (Dha)', 'ता (Ta)', 'घे (Ghe)', 'ना (Na)'],
    accentBeats: [1, 5]
  },
  {
    id: 'baha',
    name: 'बाहा ताल (Baha Spring Tala)',
    santaliName: 'बाहा ताला',
    beats: 4,
    defaultBpm: 96,
    description: 'फाल्गुन-चैत्र में सरजोम और महुआ फूल खिलने के समय नायके बाबा और महिलाओं के पूजन नृत्य का ताल।',
    bolPattern: ['धिरंग (Dhirang)', 'ता (Ta)', 'तिन (Tin)', 'ता (Ta)'],
    accentBeats: [1, 3]
  },
  {
    id: 'golawari',
    name: 'गोलावरी ताल (Golawari Tala)',
    santaliName: 'गोलावरी ताला',
    beats: 7,
    defaultBpm: 114,
    description: 'तेज़ गति का उत्सव ताल, जिसमें विषम छंद और लयबद्ध छलांगों का समन्वय होता है।',
    bolPattern: ['धिन् (Dhin)', 'ता (Ta)', 'कत् (Kat)', 'धिन् (Dhin)', 'ता (Ta)', 'धिन् (Dhin)', 'ता (Ta)'],
    accentBeats: [1, 4, 6]
  }
];

export const SantaliTalaMetronome: React.FC = () => {
  const [selectedTalaId, setSelectedTalaId] = useState<string>('lagne');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [bpm, setBpm] = useState<number>(SANTALI_TALAS[0].defaultBpm);
  const [volume, setVolume] = useState<number>(0.8);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const tala = SANTALI_TALAS.find((t) => t.id === selectedTalaId) || SANTALI_TALAS[0];

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSynthesizedDrumClick = (isAccent: boolean) => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = isAccent ? 240 : 160;
      osc.type = isAccent ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(volume * (isAccent ? 1.0 : 0.6), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {
      // Audio not permitted or supported
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      setCurrentBeat(0);
      return;
    }

    const intervalMs = (60 / bpm) * 1000;
    const timer = setInterval(() => {
      setCurrentBeat((prev) => {
        const nextBeat = (prev % tala.beats) + 1;
        const isAccent = tala.accentBeats.includes(nextBeat);
        playSynthesizedDrumClick(isAccent);
        return nextBeat;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, bpm, tala, volume]);

  const handleSelectTala = (id: string) => {
    const nextTala = SANTALI_TALAS.find((t) => t.id === id);
    if (!nextTala) return;
    setSelectedTalaId(id);
    setBpm(nextTala.defaultBpm);
    setCurrentBeat(0);
  };

  const handleSpeakTalaIntro = () => {
    speakWithFemaleVoice(
      `${tala.name}। ${tala.description}। कुल मात्रा: ${tala.beats}। बोल हैं: ${tala.bolPattern.join(', ')}`,
      { lang: 'hi-IN', rate: 0.9 }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
              <Music className="w-4 h-4" />
              <span>तुमाक-तामाक व नृत्य अभ्यास निर्देशक | Rhythm &amp; Tala Metronome</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              संताली पारंपरिक ताल व मेट्रोनोम स्टूडियो
            </h1>
            <p className="text-sm text-slate-600">
              लांगड़े, सोहराय, दांता, बाहा व गोलावरी तालों की सटीक मात्रा, बोल चक्र और ऑडियो बीट पर अभ्यास करें।
            </p>
          </div>

          <button
            onClick={handleSpeakTalaIntro}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>ताल परिचय सुनें</span>
          </button>
        </div>

        {/* Tala Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-xl">
          {SANTALI_TALAS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectTala(t.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                selectedTalaId === t.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.name.split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Main Metronome Display */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 text-center">
          <div>
            <span className="text-xs text-amber-800 font-semibold">{tala.santaliName}</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{tala.name}</h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1 leading-relaxed">
              {tala.description}
            </p>
          </div>

          {/* Visual Beat Indicator Circles */}
          <div className="flex items-center justify-center gap-3 md:gap-4 py-4 overflow-x-auto">
            {Array.from({ length: tala.beats }).map((_, idx) => {
              const beatNumber = idx + 1;
              const isActive = currentBeat === beatNumber;
              const isAccent = tala.accentBeats.includes(beatNumber);

              let circleClass = 'bg-slate-100 text-slate-500 border-slate-200';
              if (isActive) {
                circleClass = isAccent
                  ? 'bg-amber-500 text-white border-amber-600 scale-110 shadow-md ring-4 ring-amber-200'
                  : 'bg-sky-600 text-white border-sky-600 scale-105 shadow-sm';
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${circleClass}`}
                  >
                    <span className="text-lg md:text-xl font-mono font-bold">{beatNumber}</span>
                    <span className="text-[9px] font-semibold uppercase">
                      {isAccent ? 'सम/ताल' : 'ताली'}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 font-mono">
                    {tala.bolPattern[idx] || '—'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Tempo Controls (BPM) */}
          <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>लय गति (Tempo):</span>
              </span>
              <span className="font-mono text-base font-bold text-slate-900">{bpm} BPM</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setBpm((b) => Math.max(50, b - 5))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                -5
              </button>
              <input
                type="range"
                min={50}
                max={180}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="flex-1 accent-amber-600 cursor-pointer"
              />
              <button
                onClick={() => setBpm((b) => Math.min(180, b + 5))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                +5
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>धीमी (विलंबित)</span>
              <span>मध्यम लय</span>
              <span>द्रुत (तीव्र)</span>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className={`px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2.5 shadow-md cursor-pointer transition-all ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isPlaying ? 'ताल रोकें (Pause)' : 'ताल बजाएँ (Start Metronome)'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentBeat(0);
                setBpm(tala.defaultBpm);
              }}
              className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-200 cursor-pointer"
              title="रीसेट करें"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tala Guide Details */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            तुमाक व तामाक थाप संरचना (Drum Bol Composition)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {tala.bolPattern.map((bol, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                <div className="text-slate-400 font-mono">मात्रा {idx + 1}</div>
                <div className="font-bold text-slate-900 text-sm">{bol}</div>
                <div className="text-[11px] text-slate-500">
                  {tala.accentBeats.includes(idx + 1) ? 'भारी थाप (खुला स्वर)' : 'हल्की थाप (कसा स्वर)'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
