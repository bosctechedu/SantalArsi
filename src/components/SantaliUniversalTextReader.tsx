import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Copy,
  Check,
  Type,
  FileText,
  Square,
  Languages,
  Search
} from 'lucide-react';
import {
  speakWithFemaleVoice,
  pauseSpeaking,
  resumeSpeaking,
  stopSpeaking,
  splitIntoSpeechChunks,
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
  getUserSpeechPitch
} from '../utils/speech';
import { toDevanagariAuto, toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  PRELOADED_READER_DOCS,
  READER_DOC_GROUPS,
  PreloadedDoc,
  ReaderDocGroup
} from '../data/universalReaderDocs';

const READER_LANG_MODES: { id: ReadingLanguageMode; label: string }[] = [
  { id: 'all', label: '3 भाषा (All)' },
  { id: 'english', label: 'English' },
  { id: 'hindi', label: 'हिन्दी (Hindi)' },
  { id: 'santali_roman', label: 'Santali Roman' }
];

export const SantaliUniversalTextReader: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<PreloadedDoc>(PRELOADED_READER_DOCS[0]);
  const [customText, setCustomText] = useState<string>(PRELOADED_READER_DOCS[0].text);
  const [activeGroup, setActiveGroup] = useState<ReaderDocGroup>('all');
  const [docSearch, setDocSearch] = useState<string>('');
  const deferredSearch = useDeferredValue(docSearch);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [voiceProfile, setVoiceProfile] = useState<VoiceModelProfile>(() => getActiveVoiceProfile());
  const [readingLangMode, setReadingLangModeState] = useState<ReadingLanguageMode>(() =>
    getReadingLanguageMode()
  );
  const [playbackRate, setPlaybackRate] = useState<number>(() => getUserSpeechRate());
  const [playbackPitch, setPlaybackPitch] = useState<number>(() => getUserSpeechPitch());
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [currentChunkIdx, setCurrentChunkIdx] = useState<number>(-1);
  const [activeSpokenLine, setActiveSpokenLine] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>(() => getAvailableSystemVoices());
  const [preferredHiVoice, setPreferredHiVoice] = useState<string>(() => getPreferredHindiSantaliVoiceName());
  const [preferredEnVoice, setPreferredEnVoice] = useState<string>(() => getPreferredEnglishVoiceName());

  const chunks = useMemo(() => splitIntoSpeechChunks(customText), [customText]);

  const filteredDocs = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return PRELOADED_READER_DOCS.filter((doc) => {
      if (activeGroup !== 'all' && doc.group !== activeGroup) return false;
      if (!q) return true;
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.santaliTitle.toLowerCase().includes(q) ||
        doc.santaliDevanagariTitle.toLowerCase().includes(q)
      );
    });
  }, [activeGroup, deferredSearch]);

  const devanagariPreview = useMemo(
    () => (readingLangMode === 'english' || !customText.trim() ? '' : toDevanagariAuto(customText)),
    [customText, readingLangMode]
  );

  const olChikiPreview = useMemo(
    () => (readingLangMode === 'english' || !customText.trim() ? '' : toOlChikiAuto(customText)),
    [customText, readingLangMode]
  );

  const totalWords = useMemo(
    () => customText.trim().split(/\s+/).filter(Boolean).length,
    [customText]
  );

  useEffect(() => {
    const refreshVoices = () => {
      setSystemVoices(getAvailableSystemVoices());
    };
    const syncVoice = () => {
      const p = getActiveVoiceProfile();
      setVoiceProfile(p);
      setPlaybackRate(getUserSpeechRate());
      setPlaybackPitch(getUserSpeechPitch());
      setPreferredHiVoice(getPreferredHindiSantaliVoiceName());
      setPreferredEnVoice(getPreferredEnglishVoiceName());
      refreshVoices();
    };
    const syncLang = () => {
      setReadingLangModeState(getReadingLanguageMode());
    };
    refreshVoices();
    window.addEventListener('hor-katha-voice-changed', syncVoice);
    window.addEventListener('hor-katha-reading-lang-changed', syncLang);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
    }
    return () => {
      window.removeEventListener('hor-katha-voice-changed', syncVoice);
      window.removeEventListener('hor-katha-reading-lang-changed', syncLang);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener?.('voiceschanged', refreshVoices);
      }
    };
  }, []);

  useEffect(() => {
    const unsub = subscribeSpeechState((snap) => {
      if (!snap.isSpeaking) {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentChunkIdx(-1);
        setActiveSpokenLine('');
      } else {
        setIsPlaying(!snap.isPaused);
        setIsPaused(snap.isPaused);
        setActiveSpokenLine(snap.currentChunkText);
      }
    });
    return () => {
      unsub();
      stopSpeaking();
    };
  }, []);

  const handleSelectReadingLang = (mode: ReadingLanguageMode) => {
    setReadingLanguageMode(mode);
    setReadingLangModeState(mode);
    if (isPlaying && customText.trim()) {
      const idx = currentChunkIdx >= 0 ? currentChunkIdx : 0;
      speakWithFemaleVoice(customText, {
        autoDetectLanguage: mode === 'all',
        readingLangMode: mode,
        lang: mode === 'english' ? 'en-IN' : 'hi-IN',
        voiceProfileId: voiceProfile.id,
        rate: playbackRate,
        pitch: playbackPitch,
        startChunkIndex: idx,
        onChunkChange: (cIdx, _total, chunkText) => {
          setCurrentChunkIdx(cIdx);
          setActiveSpokenLine(chunkText);
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentChunkIdx(-1);
          setActiveSpokenLine('');
        }
      });
    }
  };

  const handlePlay = (startFromChunk = 0, modeOverride?: ReadingLanguageMode) => {
    if (!customText.trim()) return;
    const activeMode = modeOverride ?? readingLangMode;
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentChunkIdx(startFromChunk);

    speakWithFemaleVoice(customText, {
      autoDetectLanguage: activeMode === 'all',
      readingLangMode: activeMode,
      lang: activeMode === 'english' ? 'en-IN' : 'hi-IN',
      voiceProfileId: voiceProfile.id,
      rate: playbackRate,
      pitch: playbackPitch,
      startChunkIndex: startFromChunk,
      onChunkChange: (idx, _total, chunkText) => {
        setCurrentChunkIdx(idx);
        setActiveSpokenLine(chunkText);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentChunkIdx(-1);
        setActiveSpokenLine('');
      }
    });
  };

  const handlePause = () => {
    pauseSpeaking();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleResume = () => {
    if (isPaused) {
      resumeSpeaking();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      handlePlay(currentChunkIdx >= 0 ? currentChunkIdx : 0);
    }
  };

  const handleStop = () => {
    stopSpeaking();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentChunkIdx(-1);
    setActiveSpokenLine('');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrilingualFemaleTest = () => {
    let activeFemale = voiceProfile;
    if (voiceProfile.gender !== 'female') {
      const bestFemale = TOP_10_VOICE_MODELS[0];
      setActiveVoiceProfile(bestFemale.id);
      setVoiceProfile(bestFemale);
      setPlaybackRate(bestFemale.rate);
      setPlaybackPitch(bestFemale.pitch);
      activeFemale = bestFemale;
    }
    const demoDoc = PRELOADED_READER_DOCS[0];
    setSelectedDoc(demoDoc);
    setCustomText(demoDoc.text);
    setReadingLanguageMode('all');
    setReadingLangModeState('all');
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentChunkIdx(0);
    speakWithFemaleVoice(demoDoc.text, {
      autoDetectLanguage: true,
      readingLangMode: 'all',
      lang: 'hi-IN',
      voiceProfileId: activeFemale.id,
      rate: activeFemale.rate,
      pitch: activeFemale.pitch,
      startChunkIndex: 0,
      onChunkChange: (idx, _total, chunkText) => {
        setCurrentChunkIdx(idx);
        setActiveSpokenLine(chunkText);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentChunkIdx(-1);
        setActiveSpokenLine('');
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

  const estimatedReadMinutes = Math.max(1, Math.ceil(totalWords / 120));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner — Pure Light Theme */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-sky-50 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-xs border border-sky-200 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-100 text-sky-900 text-xs font-semibold uppercase tracking-wider mb-3 border border-sky-200">
              <Volume2 className="w-4 h-4 text-sky-700" />
              <span>ऑल टेक्स्ट रीडर · {PRELOADED_READER_DOCS.length} दस्तावेज़ · Santali · Hindi · English</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              सार्वभौमिक संताली, हिन्दी व अंग्रेज़ी पाठ वाचक (All Text Reader)
            </h1>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              किसी भी पूरे English, हिन्दी या संताली लेख, परीक्षा नोट्स या अपने पेस्ट किए गए पाठ को शुरू से अंत तक बिना रुके सजीव वाक्य-हाइलाइट के साथ पढ़कर सुनें।
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-sky-200 shadow-2xs text-xs text-slate-700 tabular-nums shrink-0">
            <div>
              <span className="text-slate-500 block font-semibold">लाइब्रेरी</span>
              <span className="font-bold text-indigo-700 text-sm font-mono">{PRELOADED_READER_DOCS.length} पाठ</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <span className="text-slate-500 block font-semibold">शब्द संख्या</span>
              <span className="font-bold text-slate-900 text-sm font-mono">{totalWords} शब्द</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <span className="text-slate-500 block font-semibold">अनुमानित समय</span>
              <span className="font-bold text-emerald-700 text-sm font-mono">~{estimatedReadMinutes} मिनट</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Light Library & Reader Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 36+ Preloaded Light-Theme Document Library & Custom Input */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                <span>पूर्व-लोड दस्तावेज़ लाइब्रेरी ({filteredDocs.length}/{PRELOADED_READER_DOCS.length})</span>
              </h2>
            </div>

            {/* Fast Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                placeholder="36 दस्तावेज़ों में खोजें (हूल, सोहराय, English, JPSC...)"
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Category Filter Tabs (Pure Light Theme) */}
            <div className="flex flex-wrap gap-1">
              {READER_DOC_GROUPS.map((grp) => (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => setActiveGroup(grp.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border ${
                    activeGroup === grp.id
                      ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50 hover:border-sky-300'
                  }`}
                >
                  {grp.label}
                </button>
              ))}
            </div>

            {/* Smooth Scrollable Light Cards List */}
            <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
              {filteredDocs.map((doc, idx) => {
                const isSelected = selectedDoc.id === doc.id;
                const docNum = String(
                  PRELOADED_READER_DOCS.findIndex((d) => d.id === doc.id) + 1 || idx + 1
                ).padStart(2, '0');
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => {
                      handleStop();
                      setSelectedDoc(doc);
                      setCustomText(doc.text);
                      setReadingLanguageMode(doc.defaultLangMode);
                      setReadingLangModeState(doc.defaultLangMode);
                    }}
                    className={`cv-card w-full text-left p-3 rounded-2xl transition-colors border cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-400/40 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider truncate">
                        {doc.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                          isSelected
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        #{docNum}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 text-xs block mt-1 leading-snug">
                      {doc.title}
                    </span>
                    <span className="text-[11px] text-amber-800 font-semibold block mt-0.5 truncate">
                      {doc.santaliDevanagariTitle}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono italic block mt-0.5 truncate">
                      {doc.santaliTitle}
                    </span>
                  </button>
                );
              })}

              {filteredDocs.length === 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  कोई मिलता-जुलता दस्तावेज़ नहीं मिला। कृपया खोज बदलें या “सभी (36)” चुनें।
                </div>
              )}
            </div>

            <div className="pt-2.5 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <span>अपना पाठ लिखें या पेस्ट करें (EN/HI/Santali):</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    handleStop();
                    setCustomText((prev) => toDevanagariAuto(prev));
                  }}
                  className="text-[11px] font-bold text-sky-700 hover:underline cursor-pointer shrink-0"
                >
                  देवनागरी में बदलें
                </button>
              </div>
              <textarea
                value={customText}
                onChange={(e) => {
                  handleStop();
                  setCustomText(e.target.value);
                }}
                rows={4}
                placeholder="यहाँ कोई भी English, हिन्दी या संताली (देवनागरी/ओल चिकी/रोमन) पाठ लिखें या पेस्ट करें..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Light Reading Canvas & Controls */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedDoc.title}
                </h3>
                <p className="text-xs text-amber-800 font-bold mt-0.5">
                  {selectedDoc.santaliDevanagariTitle}
                </p>
                <span className="text-[11px] text-sky-700 font-medium">
                  {selectedDoc.santaliTitle}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={voiceProfile.id}
                  onChange={(e) => {
                    const chosen = TOP_10_VOICE_MODELS.find((m) => m.id === e.target.value);
                    if (chosen) {
                      setActiveVoiceProfile(chosen.id);
                      setVoiceProfile(chosen);
                      setPlaybackRate(chosen.rate);
                      setPlaybackPitch(chosen.pitch);
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-sky-50 border border-sky-300 text-slate-900 text-xs font-bold cursor-pointer max-w-[260px]"
                  title="Top 10 पुरुष व महिला आवाज़ मॉडल"
                >
                  {TOP_10_VOICE_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.gender === 'female' ? '👩' : '👨'} {m.labelHi}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                </button>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
                  <Type className="w-3.5 h-3.5 ml-1 text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setFontSize('normal')}
                    className={`px-2 py-0.5 rounded-lg cursor-pointer ${fontSize === 'normal' ? 'bg-white shadow-2xs font-bold text-slate-900' : ''}`}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('large')}
                    className={`px-2 py-0.5 rounded-lg cursor-pointer ${fontSize === 'large' ? 'bg-white shadow-2xs font-bold text-slate-900' : ''}`}
                  >
                    A+
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('xlarge')}
                    className={`px-2 py-0.5 rounded-lg cursor-pointer ${fontSize === 'xlarge' ? 'bg-white shadow-2xs font-bold text-slate-900' : ''}`}
                  >
                    A++
                  </button>
                </div>
              </div>
            </div>

            {/* Reading Language Switcher Bar (All / English / Hindi / Santali Roman) */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-sky-700 shrink-0" />
                <span>वाचन भाषा चुनें (Reading Language):</span>
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {READER_LANG_MODES.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectReadingLang(opt.id)}
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

            {/* Pure Trilingual Female Voice Pair Controls */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>शुद्ध त्रि-भाषी महिला वाचक जोड़ी (HI+Santali + English Auto-Switch)</span>
                </span>
                <button
                  type="button"
                  onClick={handleTrilingualFemaleTest}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>3-भाषा शुद्ध महिला टेस्ट</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label className="space-y-1 block">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    हिन्दी + संताली महिला आवाज़:
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
                      <option key={`ur-hi-${v.name}-${v.lang}`} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1 block">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    English महिला आवाज़:
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
                      <option key={`ur-en-${v.name}-${v.lang}`} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <p className="text-[11px] text-emerald-900 leading-snug">
                सर्वश्रेष्ठ प्राकृतिक महिला आवाज़ के लिए Microsoft Edge (Swara + Neerja Natural) या Chrome (Google हिन्दी) में यह ऑटोमैटिक चलता है।
              </p>
            </div>

            {/* Live Active Spoken Words Display Banner */}
            {(isPlaying || isPaused) && activeSpokenLine && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-amber-600" />
                    <span>अभी पढ़ा जा रहा पाठ (Live Spoken Words):</span>
                  </span>
                  <span className="font-mono tabular-nums">
                    पंक्ति {Math.max(1, currentChunkIdx + 1)} / {chunks.length}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                  “{activeSpokenLine}”
                </p>
              </div>
            )}

            {/* Reading Viewport with Clickable Line-by-Line Karaoke Highlight — Pure Light Theme */}
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/40 border border-amber-200/80 max-h-96 overflow-y-auto leading-relaxed space-y-2 font-serif">
              <div className="text-[11px] font-sans font-bold text-slate-500 mb-2">
                किसी भी वाक्य पर क्लिक करके वहीं से पूरा वाचन सुनें (Click any line to start reading):
              </div>
              <div className="leading-loose">
                {chunks.map((chunk, idx) => {
                  const isCurrent = currentChunkIdx === idx;
                  return (
                    <span
                      key={idx}
                      onClick={() => handlePlay(idx)}
                      className={`cursor-pointer transition-colors rounded-lg px-1.5 py-0.5 inline ${
                        isCurrent
                          ? 'bg-amber-300 text-amber-950 font-bold ring-2 ring-amber-500 shadow-2xs'
                          : 'hover:bg-sky-100/80 text-slate-800'
                      } ${
                        fontSize === 'normal' ? 'text-sm' : fontSize === 'large' ? 'text-base' : 'text-lg'
                      }`}
                    >
                      {chunk}{' '}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Dual Script Preview or English Mode Status */}
            {customText.trim() && readingLangMode === 'english' ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                  English Reading Mode Active (en-IN / en-US Natural Voice)
                </span>
                <p className="text-slate-800 font-medium leading-relaxed line-clamp-3">
                  {customText}
                </p>
              </div>
            ) : customText.trim() ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-900 block">
                    संताली देवनागरी लिपि (Santali Devanagari)
                  </span>
                  <p className="text-slate-900 font-medium leading-relaxed line-clamp-4">
                    {devanagariPreview}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                    ओल चिकी लिपि (ᱚᱞ ᱪᱤᱠᱤ)
                  </span>
                  <p className="text-amber-950 font-semibold leading-relaxed line-clamp-4">
                    {olChikiPreview}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Audio Control Dock */}
            <div className="p-4 rounded-2xl bg-sky-50/80 text-slate-900 flex flex-wrap items-center justify-between gap-4 shadow-2xs border border-sky-200">
              <div className="flex flex-wrap items-center gap-2">
                {!isPlaying ? (
                  <button
                    type="button"
                    onClick={() => (isPaused ? handleResume() : handlePlay(0))}
                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{isPaused ? 'जारी रखें (Resume)' : 'पूरा पाठ पढ़कर सुनाएं (Play All)'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePause}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Pause className="w-4 h-4 fill-white" />
                    <span>रोकें (Pause)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleStop}
                  className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="बंद करें और रीसेट करें"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>बंद करें (Stop)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePlay(0)}
                  className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="शुरू से पढ़ें"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>शुरू से</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-700">
                <label className="text-slate-600 font-semibold">गति (Speed):</label>
                <select
                  value={playbackRate}
                  onChange={(e) => {
                    const newRate = Number(e.target.value);
                    setPlaybackRate(newRate);
                    setUserSpeechRate(newRate);
                    if (isPlaying) {
                      const idx = currentChunkIdx >= 0 ? currentChunkIdx : 0;
                      speakWithFemaleVoice(customText, {
                        autoDetectLanguage: readingLangMode === 'all',
                        readingLangMode,
                        lang: readingLangMode === 'english' ? 'en-IN' : 'hi-IN',
                        voiceProfileId: voiceProfile.id,
                        rate: newRate,
                        pitch: playbackPitch,
                        startChunkIndex: idx
                      });
                    }
                  }}
                  className="bg-white text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value={0.7}>0.7x (धीमी)</option>
                  <option value={0.85}>0.85x (स्पष्ट)</option>
                  <option value={0.92}>0.92x (प्राकृतिक)</option>
                  <option value={1.0}>1.0x (सामान्य)</option>
                  <option value={1.2}>1.2x (तेज़)</option>
                  <option value={1.4}>1.4x (अति-तेज़)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
