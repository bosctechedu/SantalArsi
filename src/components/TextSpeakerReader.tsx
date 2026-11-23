import React, { useState, useEffect, useMemo } from 'react';
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
  VoiceModelProfile,
  ReadingLanguageMode,
  getReadingLanguageMode,
  setReadingLanguageMode,
  getAvailableSystemVoices,
  getResolvedTrilingualVoices,
  getPreferredHindiSantaliVoiceName,
  setPreferredHindiSantaliVoiceName,
  getPreferredEnglishVoiceName,
  setPreferredEnglishVoiceName,
  getUserSpeechRate,
  setUserSpeechRate,
  getUserSpeechPitch,
  setUserSpeechPitch
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
  Mic,
  Languages
} from 'lucide-react';

const SPEAKER_LANG_OPTIONS: { id: ReadingLanguageMode; label: string }[] = [
  { id: 'all', label: '3 भाषा (All)' },
  { id: 'english', label: 'English' },
  { id: 'hindi', label: 'हिन्दी (Hindi)' },
  { id: 'santali_roman', label: 'Santali Roman' }
];

export const TextSpeakerReader: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [inputText, setInputText] = useState('जोहार! Santal आ़रसी रे आपे जोतो को सागुनदाराम! आबो रोड़, आबो उपरुम, आबो गोरोब।');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeChunkText, setActiveChunkText] = useState('');
  const [chunkProgress, setChunkProgress] = useState<{ idx: number; total: number }>({ idx: 0, total: 0 });
  const [voiceProfile, setVoiceProfile] = useState<VoiceModelProfile>(() => getActiveVoiceProfile());
  const [readingLangMode, setReadingLangModeState] = useState<ReadingLanguageMode>(() =>
    getReadingLanguageMode()
  );
  const [speechRate, setSpeechRate] = useState(() => getUserSpeechRate());
  const [speechPitch, setSpeechPitch] = useState(() => getUserSpeechPitch());
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>(() => getAvailableSystemVoices());
  const [preferredHiVoice, setPreferredHiVoice] = useState<string>(() => getPreferredHindiSantaliVoiceName());
  const [preferredEnVoice, setPreferredEnVoice] = useState<string>(() => getPreferredEnglishVoiceName());

  useEffect(() => {
    const refreshSystemVoices = () => {
      setSystemVoices(getAvailableSystemVoices());
    };
    const syncVoice = () => {
      const p = getActiveVoiceProfile();
      setVoiceProfile(p);
      setSpeechRate(getUserSpeechRate());
      setSpeechPitch(getUserSpeechPitch());
      setPreferredHiVoice(getPreferredHindiSantaliVoiceName());
      setPreferredEnVoice(getPreferredEnglishVoiceName());
      refreshSystemVoices();
    };
    const syncLang = () => {
      setReadingLangModeState(getReadingLanguageMode());
    };
    refreshSystemVoices();
    window.addEventListener('hor-katha-voice-changed', syncVoice);
    window.addEventListener('hor-katha-reading-lang-changed', syncLang);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener?.('voiceschanged', refreshSystemVoices);
    }
    return () => {
      window.removeEventListener('hor-katha-voice-changed', syncVoice);
      window.removeEventListener('hor-katha-reading-lang-changed', syncLang);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener?.('voiceschanged', refreshSystemVoices);
      }
    };
  }, []);

  useEffect(() => {
    return subscribeSpeechState((snap) => {
      setIsSpeaking(snap.isSpeaking && !snap.isPaused);
      setIsPaused(snap.isPaused);
      setActiveChunkText(snap.currentChunkText);
      setChunkProgress({ idx: snap.chunkIndex, total: snap.totalChunks });
    });
  }, []);

  const presets: { label: string; text: string; langMode: ReadingLanguageMode }[] = [
    {
      label: '3-भाषा शुद्ध परीक्षण (HI+EN+Santali)',
      text: 'जोहार! संताली पारसी आ़डी नापाय काना, आबोन जोतो होड़ संताली बोन पढ़ावा। हिन्दी हमारी गौरवशाली भाषा है। And now I am reading clear, natural English smoothly for you.',
      langMode: 'all'
    },
    { label: 'जोहार (Johar)', text: 'जोहार! आबो संताली भाषा आर साहित्य जियाड़ ताहेन मा।', langMode: 'all' },
    { label: 'सागुन सेताक (सुप्रभात)', text: 'सागुन सेताक! तेहेञाक दिन दो आड़ि नापाय आर रासका ते पेरेज कोक मा।', langMode: 'all' },
    { label: 'सोहराय पोरोब (सोहराय)', text: 'सोहराय पोरोब रेनाक आयमा आयमा सागुन जोहार आर रासका। गाय-डांगरा को लागीत भक्ति आर सम्मान।', langMode: 'all' },
    { label: 'हिन्दी परिचय', text: 'नमस्कार! Santal आ़रसी में आपका हार्दिक स्वागत है। यहाँ आप संताली, हिन्दी और अंग्रेज़ी भाषा पूरा पढ़कर सुन सकते हैं।', langMode: 'hindi' },
    { label: 'English Johar', text: 'Johar! Welcome to the Santal आ़रसी digital linguistic platform for Santali language, English learning, and Jharkhand heritage.', langMode: 'english' },
    { label: 'English Study Passage', text: 'Daily listening and reading in English improves pronunciation, comprehension, and confidence for UPSC, SSC, Banking, JPSC, and JSSC examinations.', langMode: 'english' },
    { label: 'English Conversation', text: 'Good morning! How are you today? Let us practice clear English speaking and vocabulary together step by step.', langMode: 'english' }
  ];

  const handleChangeLangMode = (mode: ReadingLanguageMode) => {
    setReadingLanguageMode(mode);
    setReadingLangModeState(mode);
  };

  const handleSpeak = (textToSpeak = inputText, modeOverride?: ReadingLanguageMode) => {
    if (!textToSpeak.trim()) return;
    const activeMode = modeOverride ?? readingLangMode;
    const modeLabel =
      activeMode === 'english'
        ? 'English'
        : activeMode === 'hindi'
        ? 'हिन्दी'
        : activeMode === 'santali_roman'
        ? 'Santali Roman'
        : '3-भाषा Auto';

    setTestStatus(`पूरा पाठ "${voiceProfile.labelHi}" (${modeLabel}) में पढ़ा जा रहा है...`);

    speakWithFemaleVoice(textToSpeak, {
      autoDetectLanguage: activeMode === 'all',
      readingLangMode: activeMode,
      lang: activeMode === 'english' ? 'en-IN' : 'hi-IN',
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
      const sample =
        readingLangMode === 'english'
          ? `Audio test successful. ${voiceProfile.name} English voice is active and ready.`
          : `ध्वनि परीक्षण सफल। ${voiceProfile.name} आवाज़ सक्रिय है। English and Hindi reading ready.`;
      speakWithFemaleVoice(sample, {
        autoDetectLanguage: readingLangMode === 'all',
        readingLangMode,
        lang: readingLangMode === 'english' ? 'en-IN' : 'hi-IN',
        voiceProfileId: voiceProfile.id,
        rate: speechRate,
        pitch: speechPitch,
        onEnd: () => {
          setTestStatus('स्पीकर व आवाज़ परीक्षण 100% सफल रहा!');
        }
      });
    }, 280);
  };

  const handleTrilingualFemaleTest = () => {
    let activeFemale = voiceProfile;
    if (voiceProfile.gender !== 'female') {
      const bestFemale = TOP_10_VOICE_MODELS[0];
      setActiveVoiceProfile(bestFemale.id);
      setVoiceProfile(bestFemale);
      setSpeechRate(bestFemale.rate);
      setSpeechPitch(bestFemale.pitch);
      activeFemale = bestFemale;
    }
    handleChangeLangMode('all');
    const demoText =
      'जोहार! संताली पारसी आ़डी नापाय काना, आबोन जोतो होड़ संताली बोन पढ़ावा। हिन्दी हमारी गौरवशाली भाषा है। And now I am reading clear, natural English smoothly for you.';
    setInputText(demoText);
    setTestStatus('शुद्ध त्रि-भाषी महिला वाचन (संताली + हिन्दी + English) चल रहा है...');
    speakWithFemaleVoice(demoText, {
      autoDetectLanguage: true,
      readingLangMode: 'all',
      lang: 'hi-IN',
      voiceProfileId: activeFemale.id,
      rate: activeFemale.rate,
      pitch: activeFemale.pitch,
      volume: 1.0,
      onEnd: () => {
        setTestStatus('3-भाषा शुद्ध महिला उच्चारण परीक्षण सफलतापूर्वक पूर्ण हुआ!');
        setTimeout(() => setTestStatus(null), 4000);
      }
    });
  };

  const resolvedVoices = useMemo(
    () => getResolvedTrilingualVoices(voiceProfile),
    [voiceProfile, systemVoices, preferredHiVoice, preferredEnVoice]
  );
  const hindiCandidateVoices = useMemo(
    () =>
      systemVoices.filter(
        (v) =>
          v.lang.toLowerCase().startsWith('hi') ||
          v.lang.toLowerCase().includes('-in') ||
          /hindi|swara|kalpana|lekha|aditi|madhur|hemant/i.test(v.name)
      ),
    [systemVoices]
  );
  const englishCandidateVoices = useMemo(
    () => systemVoices.filter((v) => v.lang.toLowerCase().startsWith('en')),
    [systemVoices]
  );

  const wordsPreview = useMemo(
    () => inputText.trim().split(/\s+/).filter(Boolean),
    [inputText]
  );
  const devanagariPreview = useMemo(
    () => (readingLangMode === 'english' || !inputText.trim() ? '' : toDevanagariAuto(inputText)),
    [inputText, readingLangMode]
  );
  const olChikiPreview = useMemo(
    () => (readingLangMode === 'english' || !inputText.trim() ? '' : toOlChikiAuto(inputText)),
    [inputText, readingLangMode]
  );

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
                Santali · Hindi · English
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              कोई भी संताली, हिन्दी या English पाठ लिखें — हर शब्द स्पष्ट उच्चारण के साथ पूरा पढ़कर सुनाया जाएगा।
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

      {/* Reading Language Selector (All / English / Hindi / Santali Roman) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <Languages className="w-4 h-4 text-sky-700 shrink-0" />
          <span>वाचन भाषा चुनें (Reading Language):</span>
        </span>
        <div className="flex flex-wrap items-center gap-1">
          {SPEAKER_LANG_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleChangeLangMode(opt.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                readingLangMode === opt.id
                  ? 'bg-sky-700 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Phrases Strip */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>त्वरित संताली, हिन्दी व English वाक्य (चुनते ही पूरा पढ़ें):</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(p.text);
                handleChangeLangMode(p.langMode);
                handleSpeak(p.text, p.langMode);
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
          <span className="font-bold text-slate-600">पाठ इनपुट (English / हिन्दी / संताली देवनागरी / ओल चिकी / रोमन):</span>
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
          placeholder="यहाँ कोई भी English, हिन्दी या संताली (देवनागरी/ओल चिकी/रोमन) पाठ लिखें या पेस्ट करें..."
          className="w-full p-4 border border-slate-200 rounded-2xl text-sm sm:text-base font-serif font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-inner bg-[#FAFCFF]"
        />

        {inputText.trim() && readingLangMode === 'english' ? (
          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 font-semibold">
            <span className="text-[10px] font-bold uppercase text-emerald-800 block">
              English Voice Mode Active (Natural English Pronunciation)
            </span>
            <p className="truncate">{inputText}</p>
          </div>
        ) : inputText.trim() ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200">
              <span className="text-[10px] font-bold uppercase text-sky-900 block">
                संताली देवनागरी लिपि
              </span>
              <p className="text-slate-900 font-semibold truncate">{devanagariPreview}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-[10px] font-bold uppercase text-amber-900 block">
                ओल चिकी लिपि (ᱚᱞ ᱪᱤᱠᱤ)
              </span>
              <p className="text-amber-950 font-semibold truncate">{olChikiPreview}</p>
            </div>
          </div>
        ) : null}

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

      {/* Pure Trilingual Female Voice Pair Selector */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="font-bold text-emerald-950 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>शुद्ध त्रि-भाषी महिला वाचक सेटअप (HI + Santali + English Auto-Switch)</span>
          </div>
          <button
            type="button"
            onClick={handleTrilingualFemaleTest}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>3-भाषा शुद्ध महिला टेस्ट सुनें</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <label className="space-y-1 block">
            <span className="text-[11px] font-bold text-slate-700 block">
              हिन्दी + संताली आवाज़ (Hindi &amp; Santali Voice):
            </span>
            <select
              value={preferredHiVoice}
              onChange={(e) => {
                const val = e.target.value;
                setPreferredHindiSantaliVoiceName(val);
                setPreferredHiVoice(val);
              }}
              className="w-full px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-white text-slate-900 font-semibold text-xs cursor-pointer"
            >
              <option value="">
                ऑटो सर्वश्रेष्ठ ({resolvedVoices.hindiSantaliVoice?.name || 'System Hindi Voice'})
              </option>
              {(hindiCandidateVoices.length > 0 ? hindiCandidateVoices : systemVoices).map((v) => (
                <option key={`hi-${v.name}-${v.lang}`} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 block">
            <span className="text-[11px] font-bold text-slate-700 block">
              अंग्रेज़ी आवाज़ (English Voice):
            </span>
            <select
              value={preferredEnVoice}
              onChange={(e) => {
                const val = e.target.value;
                setPreferredEnglishVoiceName(val);
                setPreferredEnVoice(val);
              }}
              className="w-full px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-white text-slate-900 font-semibold text-xs cursor-pointer"
            >
              <option value="">
                ऑटो सर्वश्रेष्ठ ({resolvedVoices.englishVoice?.name || 'System English Voice'})
              </option>
              {(englishCandidateVoices.length > 0 ? englishCandidateVoices : systemVoices).map((v) => (
                <option key={`en-${v.name}-${v.lang}`} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="text-[11px] text-emerald-900/90 leading-snug">
          टिप: सर्वश्रेष्ठ प्राकृतिक महिला आवाज़ के लिए Microsoft Edge (Swara + Neerja Natural) या Chrome (Google हिन्दी) में यह ऑटोमैटिक चलता है।
        </p>
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
            onChange={(e) => {
              const val = Number(e.target.value);
              setSpeechRate(val);
              setUserSpeechRate(val);
            }}
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
            onChange={(e) => {
              const val = Number(e.target.value);
              setSpeechPitch(val);
              setUserSpeechPitch(val);
            }}
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
