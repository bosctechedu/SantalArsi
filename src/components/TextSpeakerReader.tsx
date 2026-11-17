import React, { useState, useEffect } from 'react';
import {
  speakWithFemaleVoice,
  pauseSpeaking,
  resumeSpeaking,
  stopSpeaking,
  playAcousticChime,
  subscribeSpeechState,
  TOP_10_VOICE_MODELS,
  getActiveVoiceProfile,
  setActiveVoiceProfile,
  VoiceModelProfile
} from '../utils/speech';
import { toDevanagariAuto, toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Radio,
  FileText,
  Mic
} from 'lucide-react';

export const TextSpeakerReader: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [inputText, setInputText] = useState('जोहार! होड़ कथा सुइट रे आपे जोतो को सागुनदाराम! आबो रोड़, आबो उपरुम, आबो गोरोब।');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeChunkText, setActiveChunkText] = useState('');
  const [chunkProgress, setChunkProgress] = useState<{ idx: number; total: number }>({ idx: 0, total: 0 });
  const [voiceProfile, setVoiceProfile] = useState<VoiceModelProfile>(() => getActiveVoiceProfile());
  const [speechRate, setSpeechRate] = useState(() => getActiveVoiceProfile().rate);
  const [speechPitch, setSpeechPitch] = useState(() => getActiveVoiceProfile().pitch);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  useEffect(() => {
    const syncVoice = () => {
      const p = getActiveVoiceProfile();
      setVoiceProfile(p);
      setSpeechRate(p.rate);
      setSpeechPitch(p.pitch);
    };
    window.addEventListener('hor-katha-voice-changed', syncVoice);
    return () => window.removeEventListener('hor-katha-voice-changed', syncVoice);
  }, []);

  useEffect(() => {
    return subscribeSpeechState((snap) => {
      setIsSpeaking(snap.isSpeaking && !snap.isPaused);
      setIsPaused(snap.isPaused);
      setActiveChunkText(snap.currentChunkText);
      setChunkProgress({ idx: snap.chunkIndex, total: snap.totalChunks });
    });
  }, []);

  const presets = [
    { label: 'जोहार (Johar)', text: 'जोहार! आबो संताली भाषा आर साहित्य जियाड़ ताहेन मा।' },
    { label: 'सागुन सेताक (सुप्रभात)', text: 'सागुन सेताक! तेहेञाक दिन दो आड़ि नापाय आर रासका ते पेरेज कोक मा।' },
    { label: 'सोहराय पोरोब (सोहराय)', text: 'सोहराय पोरोब रेनाक आयमा आयमा सागुन जोहार आर रासका। गाय-डांगरा को लागीत भक्ति आर सम्मान।' },
    { label: 'आबो उपरुम (ध्वज वाक्य)', text: 'ओल चेमेद्, रोड़ चेमेद्। आबो रोड़, आबो उपरुम, आबो गोरोब।' },
    { label: 'हिन्दी परिचय', text: 'नमस्कार! होड़ कथा सुइट में आपका हार्दिक स्वागत है। यहाँ आप संताली भाषा, संस्कृति और साहित्य पूरा पढ़कर सुन सकते हैं।' },
    { label: 'English Johar', text: 'Johar! Welcome to the Hor Katha Suite digital linguistic platform for Santali language and heritage.' }
  ];

  const handleSpeak = (textToSpeak = inputText) => {
    if (!textToSpeak.trim()) return;

    setTestStatus(`पूरा पाठ "${voiceProfile.labelHi}" में पढ़ा जा रहा है...`);

    speakWithFemaleVoice(textToSpeak, {
      autoDetectLanguage: true,
      voiceProfileId: voiceProfile.id,
      rate: speechRate,
      pitch: speechPitch,
      volume: 1.0,
      onEnd: () => {
        setTestStatus('पूरा पाठ वाचन सफलतापूर्वक पूर्ण हुआ।');
        setTimeout(() => setTestStatus(null), 3500);
      }
    });
  };

  const handleLoadPageText = () => {
    const main = document.querySelector('main[data-workspace-main="true"]') || document.querySelector('main');
    if (!main) return;
    const nodes = main.querySelectorAll('h1, h2, h3, h4, p, blockquote, li, td, dt, dd');
    const seen = new Set<string>();
    const collected: string[] = [];
    nodes.forEach((n) => {
      const el = n as HTMLElement;
      if (el.closest('[data-admin-ui="true"]') || el.closest('[data-reader-bar="true"]')) return;
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (t.length >= 2 && !seen.has(t)) {
        seen.add(t);
        collected.push(t);
      }
    });
    if (collected.length > 0) {
      const full = collected.slice(0, 350).join('। ');
      setInputText(full);
      handleSpeak(full);
    }
  };

  const handleStop = () => {
    stopSpeaking();
    setTestStatus('वाचन रोक दिया गया।');
  };

  const handleHardwareTest = () => {
    playAcousticChime(659.25, 0.28);
    setTimeout(() => {
      speakWithFemaleVoice(`ध्वनि परीक्षण सफल। ${voiceProfile.name} आवाज़ सक्रिय है।`, {
        autoDetectLanguage: true,
        voiceProfileId: voiceProfile.id,
        rate: speechRate,
        pitch: speechPitch,
        onEnd: () => {
          setTestStatus('स्पीकर व आवाज़ परीक्षण 100% सफल रहा!');
        }
      });
    }, 280);
  };

  const wordsPreview = inputText.trim().split(/\s+/).filter(Boolean);

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden font-sans ${compact ? 'p-3' : 'p-6 sm:p-7'} space-y-5`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex flex-wrap items-center gap-2">
              <span>सार्वभौमिक पाठ वाचक (Text Speaker &amp; Full Reader)</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                पूरा पाठ व शब्द वाचन सक्रिय
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              कोई भी संताली, हिन्दी या अंग्रेज़ी पाठ लिखें — केवल स्पीकर ध्वनि नहीं बल्कि हर शब्द पूरा पढ़कर सुनाया जाएगा।
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleLoadPageText}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 font-bold text-xs transition-all cursor-pointer"
            title="वर्तमान स्क्रीन का सारा पाठ लोड कर सुनें"
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>इस पेज का पूरा पाठ पढ़ें</span>
          </button>

          <button
            onClick={handleHardwareTest}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-all shadow-2xs cursor-pointer"
            title="स्पीकर व आवाज़ जाँचें"
          >
            <Radio className="w-3.5 h-3.5 text-amber-600" />
            <span>आवाज़ जांचें (Test Sound)</span>
          </button>
        </div>
      </div>

      {/* Preset Phrases Strip */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>त्वरित संताली व हिन्दी वाक्य (चुनते ही पूरा पढ़ें):</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(p.text);
                handleSpeak(p.text);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-400 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea Input */}
      <div className="relative space-y-2">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-600">पाठ इनपुट (संताली देवनागरी / ओल चिकी / रोमन / हिन्दी):</span>
          <button
            type="button"
            onClick={() => setInputText((prev) => toDevanagariAuto(prev))}
            className="font-bold text-sky-800 hover:underline cursor-pointer"
          >
            रोमन / ओल चिकी → देवनागरी बदलें
          </button>
        </div>
        <textarea
          rows={compact ? 3 : 4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="यहाँ कोई भी संताली देवनागरी, ओल चिकी, रोमन, हिन्दी या अंग्रेज़ी पाठ लिखें या पेस्ट करें..."
          className="w-full p-4 border border-slate-200 rounded-2xl text-sm sm:text-base font-serif font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-inner bg-[#FAFCFF]"
        />

        {inputText.trim() && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200">
              <span className="text-[10px] font-bold uppercase text-sky-900 block">
                संताली देवनागरी लिपि
              </span>
              <p className="text-slate-900 font-semibold truncate">{toDevanagariAuto(inputText)}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-[10px] font-bold uppercase text-amber-900 block">
                ओल चिकी लिपि (ᱚᱞ ᱪᱤᱠᱤ)
              </span>
              <p className="text-amber-950 font-semibold truncate">{toOlChikiAuto(inputText)}</p>
            </div>
          </div>
        )}

        {/* Live Spoken Words Box — Shows the actual words being spoken */}
        {(isSpeaking || isPaused) && activeChunkText && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-amber-900">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>अभी बोला जा रहा अंश (Live Words):</span>
              </span>
              <span className="font-mono tabular-nums">
                {chunkProgress.idx + 1} / {Math.max(1, chunkProgress.total)}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-relaxed">{activeChunkText}</p>
          </div>
        )}

        {/* Word Chips Preview so user sees every word clearly */}
        {!compact && wordsPreview.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-500 mr-1">पाठ के शब्द ({wordsPreview.length}):</span>
            {wordsPreview.slice(0, 24).map((w, i) => {
              const isHighlighted = activeChunkText && activeChunkText.includes(w.replace(/[।.,?!]/g, ''));
              return (
                <button
                  key={`${w}-${i}`}
                  onClick={() => handleSpeak(w)}
                  title="इस शब्द को सुनें"
                  className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isHighlighted
                      ? 'bg-amber-300 text-amber-950 font-bold'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400'
                  }`}
                >
                  {w}
                </button>
              );
            })}
            {wordsPreview.length > 24 && (
              <span className="text-[11px] text-slate-400 font-semibold">+{wordsPreview.length - 24} और शब्द</span>
            )}
          </div>
        )}
      </div>

      {/* Top 10 Male/Female Voice Model Selector */}
      <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-sky-950">
          <Mic className="w-4 h-4 text-sky-700 shrink-0" />
          <span>आवाज़ मॉडल चुनें (Top 10 Male / Female):</span>
        </div>
        <select
          value={voiceProfile.id}
          onChange={(e) => {
            const chosen = TOP_10_VOICE_MODELS.find((m) => m.id === e.target.value);
            if (chosen) {
              setActiveVoiceProfile(chosen.id);
              setVoiceProfile(chosen);
              setSpeechRate(chosen.rate);
              setSpeechPitch(chosen.pitch);
            }
          }}
          className="px-3 py-1.5 rounded-xl border border-sky-300 bg-white text-slate-900 font-bold text-xs cursor-pointer"
        >
          <optgroup label="👩 महिला आवाज़ मॉडल (Top 5 Female)">
            {TOP_10_VOICE_MODELS.filter((m) => m.gender === 'female').map((m) => (
              <option key={m.id} value={m.id}>
                {m.labelHi}
              </option>
            ))}
          </optgroup>
          <optgroup label="👨 पुरुष आवाज़ मॉडल (Top 5 Male)">
            {TOP_10_VOICE_MODELS.filter((m) => m.gender === 'male').map((m) => (
              <option key={m.id} value={m.id}>
                {m.labelHi}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Speed & Pitch Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
        <div>
          <div className="flex justify-between font-bold text-slate-700 mb-1">
            <span>वाचन गति / Speech Rate</span>
            <span className="font-mono text-amber-700 tabular-nums">{speechRate.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min={0.6}
            max={1.3}
            step={0.05}
            value={speechRate}
            onChange={(e) => setSpeechRate(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>धीमी (स्पष्ट)</span>
            <span>सामान्य</span>
            <span>तेज़</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between font-bold text-slate-700 mb-1">
            <span>स्वर पिच / Voice Pitch</span>
            <span className="font-mono text-amber-700 tabular-nums">{speechPitch.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.65}
            max={1.4}
            step={0.05}
            value={speechPitch}
            onChange={(e) => setSpeechPitch(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>पुरुष गंभीर स्वर</span>
            <span>संतुलित</span>
            <span>महिला उच्च स्वर</span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {isSpeaking ? (
            <>
              <button
                onClick={pauseSpeaking}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-white" />
                <span>रोकें (Pause)</span>
              </button>
              <button
                onClick={handleStop}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <VolumeX className="w-4 h-4" />
                <span>बंद करें (Stop)</span>
              </button>
            </>
          ) : isPaused ? (
            <>
              <button
                onClick={resumeSpeaking}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>जारी रखें (Resume)</span>
              </button>
              <button
                onClick={handleStop}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <VolumeX className="w-4 h-4" />
                <span>बंद करें (Stop)</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => handleSpeak()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>पूरा पढ़कर सुनाएं (Speak Full Text)</span>
            </button>
          )}

          <button
            onClick={() => setInputText('')}
            className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
            title="पाठ साफ़ करें"
          >
            <RotateCcw className="w-4 h-4" />
            <span>साफ़ करें</span>
          </button>
        </div>

        {testStatus && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            ✓ {testStatus}
          </span>
        )}
      </div>
    </div>
  );
};
