import React, { useState, useEffect, useRef } from 'react';
import { Radio, Volume2, VolumeX, Sparkles, Sliders } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface NoteItem {
  id: string;
  name: string;
  santaliName: string;
  frequency: number; // in Hz
  pitchNote: string;
  holePattern?: string; // for Tirio flute: e.g. "●●●●●●"
  description: string;
}

interface InstrumentProfile {
  id: 'banam' | 'tirio' | 'tamak';
  name: string;
  santaliName: string;
  description: string;
  tuningNotes: NoteItem[];
}

const INSTRUMENT_PROFILES: InstrumentProfile[] = [
  {
    id: 'tirio',
    name: 'तिरिओ (Tirio - Bamboo Flute)',
    santaliName: 'तिरिओ बाहि',
    description: 'संताल बाँस की मुरली/बांसुरी जिसमें ६ से ७ छिद्र होते हैं। इसके सुर शांत वन और नदियों के वातावरण को गुंजायमान करते हैं।',
    tuningNotes: [
      { id: 't1', name: 'सा (Sa)', santaliName: 'मूल सुर (सा)', frequency: 261.63, pitchNote: 'C4', holePattern: '●●●●●●', description: 'सभी ६ छिद्र पूर्ण बंद — गंभीर बेस स्वर' },
      { id: 't2', name: 'रे (Re)', santaliName: 'दूसरा सुर (रे)', frequency: 293.66, pitchNote: 'D4', holePattern: '●●●●●○', description: 'अंतिम १ छिद्र खुला' },
      { id: 't3', name: 'ग (Ga)', santaliName: 'तीसरा सुर (गा)', frequency: 329.63, pitchNote: 'E4', holePattern: '●●●●○○', description: 'निचले २ छिद्र खुले' },
      { id: 't4', name: 'म (Ma)', santaliName: 'मध्यम सुर (मा)', frequency: 349.23, pitchNote: 'F4', holePattern: '●●●○○○', description: 'निचले ३ छिद्र खुले — मध्य सुर' },
      { id: 't5', name: 'प (Pa)', santaliName: 'पंचम सुर (पा)', frequency: 392.00, pitchNote: 'G4', holePattern: '●●○○○○', description: 'निचले ४ छिद्र खुले' },
      { id: 't6', name: 'ध (Dha)', santaliName: 'धैवत सुर (धा)', frequency: 440.00, pitchNote: 'A4', holePattern: '●○○○○○', description: 'निचले ५ छिद्र खुले — मानक ट्यूनिंग सुर' },
      { id: 't7', name: 'नि (Ni)', santaliName: 'निषाद सुर (नी)', frequency: 493.88, pitchNote: 'B4', holePattern: '○○○○○○', description: 'सभी ६ छिद्र खुले — तीव्र तार स्वर' }
    ]
  },
  {
    id: 'banam',
    name: 'धोदरो बानाम (Dhodro Banam - Fiddle)',
    santaliName: 'धोदरो बानाम',
    description: 'एक-तारी या तीन-तारी संताली वाद्ययंत्र जिसे साल या गुलान्ची की लकड़ी से तराशा जाता है। इसमें घोड़े के बाल का कमानी (धनुष) लगता है।',
    tuningNotes: [
      { id: 'b1', name: 'खरज तार (Base String)', santaliName: 'माराङ सुत', frequency: 196.00, pitchNote: 'G3', description: 'मुख्य भारी तार — गहरी लोक गूँज' },
      { id: 'b2', name: 'मध्यम तार (Middle String)', santaliName: 'ताला सुत', frequency: 261.63, pitchNote: 'C4', description: 'मध्य तार — गीत के बोलों के साथ चलने वाला सुर' },
      { id: 'b3', name: 'पंचम तार (High Treble)', santaliName: 'झिलिक सुत', frequency: 392.00, pitchNote: 'G4', description: 'पतला तार — ऊँची तान और ताल सजावट' }
    ]
  },
  {
    id: 'tamak',
    name: 'तामाक नगाड़ा पिच (Tamak Kettle Drum)',
    santaliName: 'तामाक कासा',
    description: 'कांस्य या लोहे के अर्धगोलाकार खोल पर चमड़ा कसकर बनाया जाने वाला विशाल ताल वाद्य।',
    tuningNotes: [
      { id: 'm1', name: 'खुली थाप (Open Resonant)', santaliName: 'राड़ाक् साड़े', frequency: 110.00, pitchNote: 'A2', description: 'हल्की धूप में चमड़ा तपाकर मिलने वाली भारी प्रतिध्वनि' },
      { id: 'm2', name: 'कसी थाप (Tight High Tone)', santaliName: 'चापो साड़े', frequency: 146.83, pitchNote: 'D3', description: 'डोरियों को कसकर प्राप्त होने वाला तीव्र चेतावनी नाद' }
    ]
  }
];

export const SantaliInstrumentTuner: React.FC = () => {
  const [selectedInstId, setSelectedInstId] = useState<'tirio' | 'banam' | 'tamak'>('tirio');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isPlayingTone, setIsPlayingTone] = useState<boolean>(false);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [volume, setVolume] = useState<number>(0.5);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const profile = INSTRUMENT_PROFILES.find((p) => p.id === selectedInstId) || INSTRUMENT_PROFILES[0];
  const activeNote = profile.tuningNotes.find((n) => n.id === activeNoteId) || profile.tuningNotes[0];

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

  const stopActiveTone = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {
        // already stopped
      }
      oscRef.current = null;
    }
    setIsPlayingTone(false);
  };

  const playPitchTone = (note: NoteItem) => {
    stopActiveTone();
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveform;
      osc.frequency.setValueAtTime(note.frequency, ctx.currentTime);

      gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;

      setActiveNoteId(note.id);
      setIsPlayingTone(true);
    } catch {
      // Audio permission or Web Audio API unavailable
    }
  };

  useEffect(() => {
    return () => {
      stopActiveTone();
    };
  }, []);

  const handleSelectInstrument = (id: 'tirio' | 'banam' | 'tamak') => {
    stopActiveTone();
    setSelectedInstId(id);
    const nextProf = INSTRUMENT_PROFILES.find((p) => p.id === id);
    if (nextProf && nextProf.tuningNotes.length > 0) {
      setActiveNoteId(nextProf.tuningNotes[0].id);
    }
  };

  const handleSpeakLore = () => {
    speakWithFemaleVoice(
      `${profile.name}। ${profile.description}। सुर: ${profile.tuningNotes.map((n) => `${n.name} (${n.frequency} हर्ट्ज़)`).join(', ')}`,
      { lang: 'hi-IN', rate: 0.9 }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-800">
              <Radio className="w-4 h-4" />
              <span>लोक-वाद्य सुर विज्ञान | Santali Instrument Tuner &amp; Pitch Guide</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              बानाम व तिरिओ सुर ट्यूनर एवं स्केल मार्गदर्शक
            </h1>
            <p className="text-sm text-slate-600">
              तिरिओ (बांसुरी), धोदरो बानाम और तामाक के पारंपरिक सुरों की वास्तविक आवृत्ति (Hz) सुनकर अपना वाद्य ट्यून करें।
            </p>
          </div>

          <button
            onClick={handleSpeakLore}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-sky-300" />
            <span>सुर विवरण सुनें</span>
          </button>
        </div>

        {/* Instrument Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-xl">
          {INSTRUMENT_PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectInstrument(p.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                selectedInstId === p.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.name.split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Tuner Stage */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs text-sky-700 font-semibold">{profile.santaliName}</span>
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{profile.description}</p>
            </div>

            {isPlayingTone && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 shrink-0 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>सुर बज रहा है: {activeNote.pitchNote} ({activeNote.frequency} Hz)</span>
              </div>
            )}
          </div>

          {/* Tone Generator Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>तरंग प्रकार (Waveform Tone):</span>
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'sine' as OscillatorType, label: 'शुद्ध बांसुरी (Sine)' },
                  { id: 'triangle' as OscillatorType, label: 'बानाम तार (Triangle)' },
                  { id: 'sawtooth' as OscillatorType, label: 'गहरा स्वर (Sawtooth)' }
                ].map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setWaveform(w.id);
                      if (isPlayingTone) playPitchTone(activeNote);
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                      waveform === w.id
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>ध्वनि तीव्रता (Volume):</span>
                <span className="font-mono">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setVolume(val);
                  if (gainRef.current && audioCtxRef.current) {
                    gainRef.current.gain.setValueAtTime(val * 0.4, audioCtxRef.current.currentTime);
                  }
                }}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Notes Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              ट्यूनिंग स्वर सूची (सुर पर क्लिक कर निरंतर ट्यूनिंग ध्वनि सुनें)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {profile.tuningNotes.map((note) => {
                const isSelected = activeNoteId === note.id && isPlayingTone;

                return (
                  <div
                    key={note.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-200 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-sky-800">
                          {note.pitchNote}
                        </span>
                        <span className="text-xs font-mono tabular-nums text-slate-500">
                          {note.frequency} Hz
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1">{note.name}</div>
                      <div className="text-[11px] text-amber-800 font-semibold">{note.santaliName}</div>

                      {note.holePattern && (
                        <div className="mt-2 text-xs font-mono tracking-widest text-slate-700">
                          छिद्र: <span className="text-sky-700 font-bold">{note.holePattern}</span>
                        </div>
                      )}

                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">{note.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (isSelected) {
                          stopActiveTone();
                        } else {
                          playPitchTone(note);
                        }
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isSelected ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSelected ? 'सुर बंद करें' : 'सुर बजाएँ (Play)'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tuning Wisdom */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 text-xs text-slate-600 leading-relaxed">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            संताली वाद्य ट्यूनिंग परंपरा (Acoustic Lore)
          </h3>
          <p>
            • <strong>धोदरो बानाम</strong> को बजाने से पहले उसकी कमानी (धनुष) पर साल पेड़ का सूखा गोंद (धुना/झोर) रगड़ा जाता है, जिससे तारों में मधुर कंपन पैदा होता है।
          </p>
          <p>
            • <strong>तिरिओ</strong> को शुष्क हवा से बचाने के लिए समय-समय पर सरसों या करंज तेल की हल्की बूँद अंदरूनी नलिका में डाली जाती है ताकि बाँस में दरार न आए और सुर शुद्ध रहे।
          </p>
          <p>
            • <strong>तामाक</strong> को बजाने से पूर्व कुछ मिनट हल्की धूप में रखा जाता है ताकि नमी हटकर कड़क खुला नाद उत्पन्न हो सके।
          </p>
        </div>
      </div>
    </div>
  );
};
