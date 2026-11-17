import React, { useState, useEffect } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { useUserAuth } from '../context/UserAuthContext';
import {
  Headphones,
  Volume2,
  Square,
  CheckCircle2,
  XCircle,
  Eye,
  RotateCcw
} from 'lucide-react';

interface ListeningClip {
  id: string;
  level: string;
  titleHi: string;
  audioScriptDev: string;
  hindiMeaning: string;
  questionHi: string;
  options: string[];
  correctAnswer: string;
  vocabNote: string;
}

const LISTENING_CLIPS: ListeningClip[] = [
  {
    id: 'lc1',
    level: 'स्तर १ · हाट संवाद',
    titleHi: 'हाट से चावल व सब्ज़ी लाना',
    audioScriptDev:
      'जोहार दादा! तेहेंञ सेताक् बेड़ा रे बाबू दो साइकिल ते हाट सेन-एना। उनी दो मोड़े किलो चावले आर बार किलो आलू किरिन आगु-केदा।',
    hindiMeaning:
      'नमस्ते भैया! आज सुबह बाबू साइकिल से हाट गया था। वह पाँच किलो चावल और दो किलो आलू खरीदकर लाया।',
    questionHi: 'ऑडियो के अनुसार बाबू ने हाट से कितने किलो चावल (चावले) खरीदे?',
    options: ['मोड़े किलो (५ किलो)', 'बार किलो (२ किलो)', 'गेल किलो (१० किलो)', 'मित् किलो (१ किलो)'],
    correctAnswer: 'मोड़े किलो (५ किलो)',
    vocabNote: '"मोड़े" = ५, "बार" = २, "चावले" = चावल, "किरिन आगु-केदा" = खरीदकर लाया।'
  },
  {
    id: 'lc2',
    level: 'स्तर २ · विद्यालय सूचना',
    titleHi: 'मांझी टोला स्कूल में बाहा उत्सव',
    audioScriptDev:
      'आतो रेन जोतो गिदरा आर आयो-बाबा खोबोर पे: गापा सेताक् आठ बाजा रे इस्कूल प्रांगण रे बाहा पोरोब आर सेरेञ एनेच प्रोग्राम हुय-ओक्-आ।',
    hindiMeaning:
      'गाँव के सभी बच्चों और माता-पिता को सूचना: कल सुबह आठ बजे विद्यालय प्रांगण में बाहा पर्व व गीत-नृत्य कार्यक्रम होगा।',
    questionHi: 'ऑडियो में बताया गया बाहा पर्व कार्यक्रम कितने बजे शुरू होगा?',
    options: ['सेताक् आठ बाजा रे (सुबह ८ बजे)', 'आयुब चार बाजा रे (शाम ४ बजे)', 'तिकिन बारह बाजा रे (दोपहर १२ बजे)', 'निंदा नौ बाजा रे (रात ९ बजे)'],
    correctAnswer: 'सेताक् आठ बाजा रे (सुबह ८ बजे)',
    vocabNote: '"गापा" = कल (आने वाला), "सेताक्" = सुबह, "पोरोब" = पर्व।'
  },
  {
    id: 'lc3',
    level: 'स्तर २ · ग्राम सभा संदेश',
    titleHi: 'जाहेर थान में पौधारोपण',
    audioScriptDev:
      'मांझी हाड़ाम मेताक्-एत्-आ जे अबो जोतो होड़ मित् ते जाहेर थान सोर रे बार साय सारजोम आर नीम दारे रोहोय-आबो।',
    hindiMeaning:
      'मांझी बाबा कह रहे हैं कि हम सभी लोग मिलकर जाहेर थान के पास दो सौ सखुआ और नीम के पेड़ लगाएँगे।',
    questionHi: 'ग्राम सभा मिलकर जाहेर थान के पास किस चीज़ के पेड़ लगाने वाली है?',
    options: ['सारजोम (सखुआ) और नीम', 'केवल आम और केला', 'बांस और खजूर', 'कोई पेड़ नहीं'],
    correctAnswer: 'सारजोम (सखुआ) और नीम',
    vocabNote: '"सारजोम दारे" = सखुआ/साल का पेड़, "रोहोय-आबो" = हम सब लगाएँगे।'
  },
  {
    id: 'lc4',
    level: 'स्तर ३ · पारिवारिक संवाद',
    titleHi: 'मेहमान (पेड़ा) स्वागत व जलपान',
    audioScriptDev:
      'ओड़ाक् ते पेड़ा को हेच् काना। दिदी दो लोटा दाक् आगु काते जोहार-आत्-कोवा आर अकील मामा लागित् पीठा आर चाहा बनायाव-केदा।',
    hindiMeaning:
      'घर पर मेहमान आए हैं। दीदी ने लोटा भर पानी लाकर उन्हें जोहार किया और अकील मामा के लिए पीठा और चाय बनाई।',
    questionHi: 'मेहमानों के आने पर दीदी ने सबसे पहले क्या लाकर उनका स्वागत (जोहार) किया?',
    options: ['लोटा दाक् (लोटा भर पानी)', 'सिर्फ़ मिठाई', 'चावल की थाली', 'किताबें'],
    correctAnswer: 'लोटा दाक् (लोटा भर पानी)',
    vocabNote: 'संताल अतिथि सत्कार में सर्वप्रथम लोटे में स्वच्छ जल (लोटा दाक्) व जोहार से स्वागत होता है।'
  },
  {
    id: 'lc5',
    level: 'स्तर ३ · खेती व मौसम',
    titleHi: 'आषाढ़ में धान रोपनी',
    audioScriptDev:
      'आसाड़ चांदो रे दाक् जाड़ी खूब ञुर्-ओक् काना। किसान दादा को दो नाहेल आर डांगरा सांव बाईद खेत् रे हूड़ू एर लागीत् सेन काना-को।',
    hindiMeaning:
      'आषाढ़ महीने में वर्षा खूब हो रही है। किसान भाई हल और बैल के साथ धान के खेत में बुवाई के लिए जा रहे हैं।',
    questionHi: 'किसान हल और बैल (नाहेल आर डांगरा) लेकर खेत में किस कार्य के लिए जा रहे हैं?',
    options: ['हूड़ू एर (धान बोने/रोपने)', 'फसल काटने', 'तालाब खोदने', 'हाट जाने'],
    correctAnswer: 'हूड़ू एर (धान बोने/रोपने)',
    vocabNote: '"नाहेल" = हल, "डांगरा" = बैल, "हूड़ू" = धान, "बाईद" = निचला धान खेत।'
  }
];

export const SantaliAudioListeningTest: React.FC = () => {
  const { currentUser } = useUserAuth();
  const storageKey = `hor_katha_listening_best_${currentUser?.email || 'guest'}`;

  const [clipIndex, setClipIndex] = useState(0);
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [playCount, setPlayCount] = useState(0);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(storageKey) || '0');
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      setBestScore(Number(localStorage.getItem(storageKey) || '0'));
    } catch {
      setBestScore(0);
    }
  }, [storageKey]);

  const clip = LISTENING_CLIPS[clipIndex];

  const handlePlayAudio = () => {
    setPlayCount((c) => c + 1);
    speakWithFemaleVoice(clip.audioScriptDev, { autoDetectLanguage: true, rate: speechRate });
  };

  const handleChoose = (opt: string) => {
    if (selectedAns) return;
    setSelectedAns(opt);
    setShowTranscript(true);
    const nextAttempted = attempted + 1;
    const nextScore = opt === clip.correctAnswer ? score + 1 : score;
    setAttempted(nextAttempted);
    setScore(nextScore);
    if (nextScore > bestScore) {
      setBestScore(nextScore);
      try {
        localStorage.setItem(storageKey, String(nextScore));
      } catch {
        // ignore
      }
    }
  };

  const goNext = () => {
    stopSpeaking();
    setSelectedAns(null);
    setShowTranscript(false);
    setPlayCount(0);
    setClipIndex((i) => (i + 1) % LISTENING_CLIPS.length);
  };

  const resetAll = () => {
    stopSpeaking();
    setSelectedAns(null);
    setShowTranscript(false);
    setPlayCount(0);
    setClipIndex(0);
    setScore(0);
    setAttempted(0);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Headphones className="w-4 h-4 text-emerald-600" />
            <span>संताली श्रवण बोध परीक्षा (Listening Comprehension Lab)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            सुनकर संताली समझें — प्रश्नोत्तरी व प्रतिलेख विश्लेषण
          </h2>
          <p className="text-xs text-slate-600">
            पहले संताली ऑडियो ध्यान से सुनें, बिना देखे सही उत्तर चुनें और फिर देवनागरी व ओल चिकी पाठ मिलाएँ।
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold tabular-nums shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            स्कोर: {score}/{attempted} · सर्वश्रेष्ठ: {bestScore}
          </div>
          <button
            type="button"
            onClick={resetAll}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            title="रीसेट करें"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Audio Test Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              {clip.level} · पाठ {clipIndex + 1} / {LISTENING_CLIPS.length}
            </span>
            <h3 className="text-base font-black text-slate-900">{clip.titleHi}</h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">गति:</span>
            <button
              type="button"
              onClick={() => setSpeechRate(0.75)}
              className={`px-2.5 py-1 rounded-lg font-bold border cursor-pointer ${
                speechRate === 0.75
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              धीमा (0.75x)
            </button>
            <button
              type="button"
              onClick={() => setSpeechRate(0.95)}
              className={`px-2.5 py-1 rounded-lg font-bold border cursor-pointer ${
                speechRate === 0.95
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              सामान्य (0.95x)
            </button>
          </div>
        </div>

        {/* Play Controls */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handlePlayAudio}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{playCount === 0 ? 'ऑडियो चलाएँ (सुनें)' : `दोबारा सुनें (${playCount} बार सुना)`}</span>
            </button>
            <button
              type="button"
              onClick={stopSpeaking}
              className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>रोकें</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowTranscript((v) => !v)}
            className="px-3 py-2 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-700" />
            <span>{showTranscript ? 'पाठ छिपाएँ' : 'सहायता हेतु पाठ देखें'}</span>
          </button>
        </div>

        {/* Question */}
        <div className="space-y-3">
          <p className="text-sm font-black text-slate-900">{clip.questionHi}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {clip.options.map((opt) => {
              const isChosen = selectedAns === opt;
              const isRight = opt === clip.correctAnswer;
              let cls = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-400';
              if (selectedAns) {
                if (isRight) cls = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                else if (isChosen) cls = 'bg-rose-50 border-rose-500 text-rose-950';
              }
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleChoose(opt)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer transition-colors ${cls}`}
                >
                  <span>{opt}</span>
                  {selectedAns && isRight && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {selectedAns && isChosen && !isRight && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Revealed Transcript */}
        {showTranscript && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
              पूर्ण श्रवण प्रतिलेख (संताली देवनागरी व ओल चिकी)
            </span>
            <p className="text-sm font-black text-slate-900 leading-relaxed">{clip.audioScriptDev}</p>
            <p className="text-sm font-bold text-amber-800 leading-relaxed">
              {toOlChikiAuto(clip.audioScriptDev)}
            </p>
            <p className="text-xs text-slate-800 font-semibold">हिन्दी अनुवाद: {clip.hindiMeaning}</p>
            <p className="text-xs text-sky-900 bg-white/80 p-2 rounded-xl border border-amber-200">
              <strong>मुख्य शब्दावली:</strong> {clip.vocabNote}
            </p>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={goNext}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
          >
            अगला श्रवण पाठ →
          </button>
        </div>
      </div>
    </div>
  );
};
