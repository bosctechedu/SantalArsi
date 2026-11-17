import React, { useState, useEffect, useMemo } from 'react';
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
  Square
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
  VoiceModelProfile
} from '../utils/speech';
import { toDevanagariAuto, toOlChikiAuto } from '../utils/olChikiTranslit';

interface PreloadedDoc {
  id: string;
  title: string;
  category: string;
  santaliTitle: string;
  santaliDevanagariTitle: string;
  text: string;
}

const PRELOADED_DOCS: PreloadedDoc[] = [
  {
    id: 'hul_manifesto',
    title: 'संथाल हूल १८५५ — सिद्धू-कान्हू हुंकार',
    category: 'इतिहास व स्वाधीनता',
    santaliTitle: 'Sidhu-Kanhu Hul 1855 Sandesh',
    santaliDevanagariTitle: 'सीदो-कान्हू हुल १८५५ संदेश (अबुआः दिशोम, अबुआः राज)',
    text: `जोहार! ३० जून १८५५ हिलोक भोगनाडीह अतु रे दस हजार खोन बाड़ती संताल वीर को सीदो-कान्हू मुर्मू वाक् अगुवाई ते अंग्रेजी हुकूमत आर महाजन को विरुद्ध हुल को घोषणा लेत्-आ।
सीदो-कान्हू दो किन मेन लेत्-आ: "नोवा ओत्-हासा दो आबो पूर्वज कोवाक् काना। दाक्, बिर-बुरु आर हासा रे आबो अतु-सभा वाक् हक मेनाक्-आ।"
चांद, भैरव, फूलो आर झानो दो दिशोम लागीत् आकोवाक् जीवोन को दान केत्-आ। आज भी प्रत्येक संथाल परिवार हूल दिवस पर अपने अमर नायकों को जोहार व नमन करता है।`
  },
  {
    id: 'raghunath_murmu',
    title: 'पंडित रघुनाथ मुर्मू — ओल चिकी लिपि संदेश',
    category: 'भाषा व साहित्य',
    santaliTitle: 'Guru Gomke Raghunath Murmu Katha',
    santaliDevanagariTitle: 'गुरु गोमके रघुनाथ मुर्मू वाक् ओल चिकी संदेश',
    text: `गुरु गोमके पंडित रघुनाथ मुर्मू दो १९२५ इसवी रे संताली रोड़ लागीत् "ओल चिकी" लिपि ए बेनाव केत्-आ।
उनकुवाक् अमर काथा दो ताहेकाना:
"ओल चेमेद्, रोड़ चेमेद्,
आबो रोड़, आबो उपरुम, आबो गोरोब।"
अर्थात: अपनी लिपि सीखो, अपनी मातृभाषा बोलो; हमारी भाषा ही हमारी पहचान और गौरव है। प्रत्येक संताली को अपनी मातृभाषा (देवनागरी व ओल चिकी दोनों लिपियों) में पढ़ना व लिखना सीखना चाहिए।`
  },
  {
    id: 'creation_folklore',
    title: 'हास-हासिल व सृष्टि गाथा (सिरजोन काथा)',
    category: 'लोक-दर्शन व सृष्टि',
    santaliTitle: 'Has-Hasil Hans Ar Srijon Lore',
    santaliDevanagariTitle: 'हास-हासिल चेँड़े आर सिरजोन काथा',
    text: `सेदाय जोखोन चारी कोड़ रे खाली दाक् गे ताहेकाना। ठाकुर जिउ दो दाक् चेतान रे हास आर हासिल चेँड़े ए सिरजोन केत् किना।
चेँड़े किन दुड़ुप लागीत् जखन हासा बांय ञाम लेना, उनरे ठाकुर जिउ वाक् हुकुम ते होरो (कछुआ) देया रे लेंडोत (केंचुए) दो समुंदर भितरी खोन हासा ए आगू केत्-आ।
सारजोम दारे साकाम रे हास-हासिल किन बाले केत्-आ, ओना खोन पिलचु हाड़ाम आर पिलचु बूढ़ी किन जनम एना आर बारह पारिस रेयाक् उद्भव हुय एना।`
  },
  {
    id: 'sohrai_blessing',
    title: 'सोहराय महापर्व: गोधन वंदना व लोक-आशीष',
    category: 'सांस्कृतिक पर्व',
    santaliTitle: 'Sohrai Parab Ar Gai Dan Guri',
    santaliDevanagariTitle: 'सोहराय पोरोब — गाय-डांगरा बोंगा आर अतु रस्का',
    text: `सोहराय दो संताल समाज रेयाक् जोतो खोन मारांग मोड़े माहा रेयाक् पोरोब काना, ओका दो होड़ो गेत् चाबा तायोम मानाक्-आ।
पाहिल हिलोक 'उम' (स्नान), दोसर हिलोक 'दाका-गोहाइल पूजा', तेसर हिलोक 'खूंटाव', पोन हिलोक 'जाले' आर मोड़े हिलोक 'हाकू-काटकोम' पोरोब हुयुक्-आ।
आयो को दो मांडी आर ओड़ाक् भित्ती रे सुंदर सोहराय चित्र को बेनावा। यह पर्व सिखाता है कि खेत में हल जोतने वाले पशु हमारे परिवार का अभिन्न अंग हैं।`
  }
];

export const SantaliUniversalTextReader: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<PreloadedDoc>(PRELOADED_DOCS[0]);
  const [customText, setCustomText] = useState<string>(PRELOADED_DOCS[0].text);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [voiceProfile, setVoiceProfile] = useState<VoiceModelProfile>(() => getActiveVoiceProfile());
  const [playbackRate, setPlaybackRate] = useState<number>(() => getActiveVoiceProfile().rate);
  const [playbackPitch, setPlaybackPitch] = useState<number>(() => getActiveVoiceProfile().pitch);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [currentChunkIdx, setCurrentChunkIdx] = useState<number>(-1);
  const [activeSpokenLine, setActiveSpokenLine] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const chunks = useMemo(() => splitIntoSpeechChunks(customText), [customText]);

  useEffect(() => {
    const syncVoice = () => {
      const p = getActiveVoiceProfile();
      setVoiceProfile(p);
      setPlaybackRate(p.rate);
      setPlaybackPitch(p.pitch);
    };
    window.addEventListener('hor-katha-voice-changed', syncVoice);
    return () => window.removeEventListener('hor-katha-voice-changed', syncVoice);
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

  const handlePlay = (startFromChunk = 0) => {
    if (!customText.trim()) return;
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentChunkIdx(startFromChunk);

    speakWithFemaleVoice(customText, {
      autoDetectLanguage: true,
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

  const totalWords = customText.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadMinutes = Math.max(1, Math.ceil(totalWords / 120));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-sky-50 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-sm border border-sky-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-sky-200">
              <Volume2 className="w-4 h-4 text-sky-700" />
              <span>ऑल टेक्स्ट रीडर · शब्द-दर-शब्द वाचन</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              सार्वभौमिक संताली व हिन्दी पाठ वाचक (All Text Reader)
            </h1>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              किसी भी पूरे लेख, घोषणा-पत्र या अपने पेस्ट किए गए पाठ को शुरू से अंत तक बिना रुके सजीव शब्द-हाइलाइट के साथ पढ़कर सुनें।
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-sky-200 shadow-xs text-xs text-slate-700 tabular-nums">
            <div>
              <span className="text-slate-500 block font-semibold">शब्द संख्या</span>
              <span className="font-bold text-slate-900 text-sm font-mono">{totalWords} शब्द</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <span className="text-slate-500 block font-semibold">वाक्य खंड</span>
              <span className="font-bold text-sky-700 text-sm font-mono">{chunks.length} पंक्तियाँ</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <span className="text-slate-500 block font-semibold">अनुमानित समय</span>
              <span className="font-bold text-emerald-700 text-sm font-mono">~{estimatedReadMinutes} मिनट</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Library & Reader Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preloaded Library & Custom Input */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>पूर्व-लोड संताली दस्तावेज़ लाइब्रेरी:</span>
            </h2>

            <div className="space-y-2.5">
              {PRELOADED_DOCS.map((doc) => {
                const isSelected = selectedDoc.id === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      handleStop();
                      setSelectedDoc(doc);
                      setCustomText(doc.text);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-600 ring-2 ring-sky-500/20 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sky-300'
                    }`}
                  >
                    <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">
                      {doc.category}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs block mt-0.5">
                      {doc.title}
                    </span>
                    <span className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold block mt-0.5 truncate">
                      {doc.santaliDevanagariTitle}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono italic block mt-0.5 truncate">
                      {doc.santaliTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <span>अपना पाठ लिखें या पेस्ट करें:</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    handleStop();
                    setCustomText((prev) => toDevanagariAuto(prev));
                  }}
                  className="text-[11px] font-bold text-sky-800 hover:underline cursor-pointer"
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
                rows={5}
                placeholder="यहाँ कोई भी संताली (देवनागरी/ओल चिकी/रोमन) या हिन्दी पाठ लिखें या पेस्ट करें..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Reading Canvas & Controls */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedDoc.title}
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300 font-bold">
                  {selectedDoc.santaliDevanagariTitle}
                </p>
                <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
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
                  className="px-2.5 py-1.5 rounded-xl bg-sky-50 border border-sky-300 text-slate-900 text-xs font-bold cursor-pointer"
                  title="Top 10 पुरुष व महिला आवाज़ मॉडल"
                >
                  {TOP_10_VOICE_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.gender === 'female' ? '👩' : '👨'} {m.labelHi}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCopyText}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
                </button>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Type className="w-3.5 h-3.5 ml-1 text-slate-400" />
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`px-2 py-0.5 rounded-lg cursor-pointer ${fontSize === 'normal' ? 'bg-white dark:bg-slate-700 shadow-2xs font-bold' : ''}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-2 py-0.5 rounded-lg cursor-pointer ${fontSize === 'large' ? 'bg-white dark:bg-slate-700 shadow-2xs font-bold' : ''}`}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('xlarge')}
                    className={`px-2 py-0.5 rounded-lg cursor-pointer ${fontSize === 'xlarge' ? 'bg-white dark:bg-slate-700 shadow-2xs font-bold' : ''}`}
                  >
                    A++
                  </button>
                </div>
              </div>
            </div>

            {/* Live Active Spoken Words Display Banner */}
            {(isPlaying || isPaused) && activeSpokenLine && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
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

            {/* Reading Viewport with Clickable Line-by-Line Karaoke Highlight */}
            <div className="p-6 rounded-2xl bg-amber-50/30 dark:bg-slate-800/40 border border-amber-200/50 dark:border-slate-700 max-h-96 overflow-y-auto leading-relaxed space-y-2 font-serif">
              <div className="text-[11px] font-sans font-bold text-slate-500 mb-2">
                किसी भी वाक्य पर क्लिक करके वहीं से पूरा वाचन सुनें:
              </div>
              <div className="leading-loose">
                {chunks.map((chunk, idx) => {
                  const isCurrent = currentChunkIdx === idx;
                  return (
                    <span
                      key={idx}
                      onClick={() => handlePlay(idx)}
                      className={`cursor-pointer transition-all rounded-lg px-1.5 py-0.5 inline ${
                        isCurrent
                          ? 'bg-amber-300 dark:bg-amber-500/40 text-amber-950 dark:text-amber-50 font-bold ring-2 ring-amber-500 shadow-xs'
                          : 'hover:bg-sky-100/70 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-200'
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

            {/* Dual Script Preview: Santali Devanagari + Ol Chiki */}
            {customText.trim() && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-900 block">
                    संताली देवनागरी लिपि (Santali Devanagari)
                  </span>
                  <p className="text-slate-900 font-medium leading-relaxed line-clamp-4">
                    {toDevanagariAuto(customText)}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                    ओल चिकी लिपि (ᱚᱞ ᱪᱤᱠᱤ)
                  </span>
                  <p className="text-amber-950 font-semibold leading-relaxed line-clamp-4">
                    {toOlChikiAuto(customText)}
                  </p>
                </div>
              </div>
            )}

            {/* Audio Control Dock */}
            <div className="p-4 rounded-2xl bg-sky-50/80 text-slate-900 flex flex-wrap items-center justify-between gap-4 shadow-xs border border-sky-200">
              <div className="flex flex-wrap items-center gap-2">
                {!isPlaying ? (
                  <button
                    onClick={() => (isPaused ? handleResume() : handlePlay(0))}
                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{isPaused ? 'जारी रखें (Resume)' : 'पूरा पाठ पढ़कर सुनाएं (Play All)'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Pause className="w-4 h-4 fill-white" />
                    <span>रोकें (Pause)</span>
                  </button>
                )}

                <button
                  onClick={handleStop}
                  className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="बंद करें और रीसेट करें"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>बंद करें (Stop)</span>
                </button>

                <button
                  onClick={() => handlePlay(0)}
                  className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
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
                    if (isPlaying) {
                      const idx = currentChunkIdx >= 0 ? currentChunkIdx : 0;
                      speakWithFemaleVoice(customText, {
                        autoDetectLanguage: true,
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
                  <option value={0.88}>0.88x (स्पष्ट)</option>
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
