import React, { useState, useEffect } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  CheckCircle2,
  XCircle,
  Volume2,
  RotateCcw,
  Timer,
  Flame,
  ArrowRight
} from 'lucide-react';

interface DrillQuestion {
  id: string;
  subjectLabel: string;
  verbRoot: string;
  tenseTag: 'वर्तमान (Present)' | 'भूत (Past)' | 'भविष्य (Future)';
  animacyNote: string;
  hindiPrompt: string;
  sentencePrefix: string;
  sentenceSuffix: string;
  correctOption: string;
  options: string[];
  explanationHi: string;
}

const DRILL_BANK: DrillQuestion[] = [
  {
    id: 'td1',
    subjectLabel: 'इञ (मैं)',
    verbRoot: 'जोम (खाना)',
    tenseTag: 'वर्तमान (Present)',
    animacyNote: 'निर्जीव कर्म (दाका / भात)',
    hindiPrompt: 'मैं भात खा रहा हूँ।',
    sentencePrefix: 'इञ दो दाका',
    sentenceSuffix: '',
    correctOption: 'जोम-एत्-आञ',
    options: ['जोम-एत्-आञ', 'जोम-केत्-आञ', 'जोम-आ-को', 'जोम-एत्-आम'],
    explanationHi: 'वर्तमान अपूर्ण काल में "-एत्" और कर्ता "इञ" (मैं) के लिए अंत में "-आञ" जुड़ता है।'
  },
  {
    id: 'td2',
    subjectLabel: 'आम (तुम)',
    verbRoot: 'पाड़हाव (पढ़ना)',
    tenseTag: 'भूत (Past)',
    animacyNote: 'निर्जीव कर्म (पुथी / किताब)',
    hindiPrompt: 'तुमने किताब पढ़ ली।',
    sentencePrefix: 'आम दो पुथी',
    sentenceSuffix: '',
    correctOption: 'पाड़हाव-केत्-आम',
    options: ['पाड़हाव-केत्-आम', 'पाड़हाव-एत्-आञ', 'पाड़हाव-आ-ले', 'पाड़हाव-ओक्-आ'],
    explanationHi: 'सकर्मक भूतकाल के लिए "-केत्" तथा "आम" (तुम) के लिए "-आम" लगता है।'
  },
  {
    id: 'td3',
    subjectLabel: 'उनी (वह)',
    verbRoot: 'सेन (जाना)',
    tenseTag: 'भविष्य (Future)',
    animacyNote: 'अकर्मक क्रिया (हाट सेच्)',
    hindiPrompt: 'वह कल हाट जाएगा / जाएगी।',
    sentencePrefix: 'उनी दो गापा हाट सेच्',
    sentenceSuffix: '',
    correctOption: 'सेन-ओक्-आ-ए',
    options: ['सेन-ओक्-आ-ए', 'सेन-एना-ञ', 'सेन-केत्-को', 'सेन-एत्-आबो'],
    explanationHi: 'अकर्मक भविष्य काल में "-ओक्-आ" तथा एकवचन सजीव कर्ता "उनी" के लिए "-ए" जुड़ता है।'
  },
  {
    id: 'td4',
    subjectLabel: 'उनकु (वे लोग)',
    verbRoot: 'ञेल (देखना)',
    tenseTag: 'भूत (Past)',
    animacyNote: 'सजीव कर्म (सादोम / घोड़ा)',
    hindiPrompt: 'उन्होंने घोड़े को देखा।',
    sentencePrefix: 'उनकु दो सादोम को',
    sentenceSuffix: '',
    correctOption: 'ञेल-केद्-ए-आ-को',
    options: ['ञेल-केद्-ए-आ-को', 'ञेल-आ-ञ', 'ञेल-एत्-आ-बेन', 'ञेल-ओक्-आ-ले'],
    explanationHi: 'संताली में सजीव कर्म होने पर क्रिया के बीच "-ए-" आता है और बहुवचन कर्ता "उनकु" के लिए अंत में "-को" लगता है।'
  },
  {
    id: 'td5',
    subjectLabel: 'आबो (हम सब - समावेशी)',
    verbRoot: 'सेरेञ (गाना)',
    tenseTag: 'भविष्य (Future)',
    animacyNote: 'सामान्य सामूहिक क्रिया',
    hindiPrompt: 'हम सब मिलकर गाएँगे।',
    sentencePrefix: 'आबो जोतो होड़ मित् ते',
    sentenceSuffix: '',
    correctOption: 'सेरेञ-आ-बो',
    options: ['सेरेञ-आ-बो', 'सेरेञ-केत्-आञ', 'सेरेञ-एत्-आम', 'सेरेञ-एना-किन'],
    explanationHi: 'श्रोता सहित "हम सब" (आबो) के लिए भविष्य काल में क्रिया के साथ "-आ-बो" (या "-बोन्") प्रयुक्त होता है।'
  },
  {
    id: 'td6',
    subjectLabel: 'आकिन (वे दोनों - द्विवचन)',
    verbRoot: 'एनेच (नाचना)',
    tenseTag: 'वर्तमान (Present)',
    animacyNote: 'द्विवचन कर्ता (Dual)',
    hindiPrompt: 'वे दोनों अखड़ा में नाच रहे हैं।',
    sentencePrefix: 'आकिन दो अखड़ा रे',
    sentenceSuffix: '',
    correctOption: 'एनेच-काना-किन',
    options: ['एनेच-काना-किन', 'एनेच-केत्-आञ', 'एनेच-आ-को', 'एनेच-एत्-आम'],
    explanationHi: 'दो व्यक्तियों (द्विवचन) के लिए संताली में सदा "-किन" प्रत्यय जुड़ता है।'
  },
  {
    id: 'td7',
    subjectLabel: 'इञ (मैं)',
    verbRoot: 'ओल (लिखना)',
    tenseTag: 'भूत (Past)',
    animacyNote: 'निर्जीव कर्म (चिठी / पत्र)',
    hindiPrompt: 'मैंने पत्र लिख दिया।',
    sentencePrefix: 'इञ दो साकाम',
    sentenceSuffix: '',
    correctOption: 'ओल-केत्-आञ',
    options: ['ओल-केत्-आञ', 'ओल-ओक्-आ', 'ओल-एत्-को', 'ओल-आ-ले'],
    explanationHi: 'सकर्मक क्रिया "ओल" के साथ भूतकाल "-केत्" और प्रथम पुरुष एकवचन "-आञ" जुड़ता है।'
  },
  {
    id: 'td8',
    subjectLabel: 'आले (हम - श्रोता रहित)',
    verbRoot: 'कामी (काम करना)',
    tenseTag: 'वर्तमान (Present)',
    animacyNote: 'अपवर्जक बहुवचन (Exclusive We)',
    hindiPrompt: 'हम लोग खेत में काम कर रहे हैं।',
    sentencePrefix: 'आले दो खेत् रे',
    sentenceSuffix: '',
    correctOption: 'कामी-एत्-आ-ले',
    options: ['कामी-एत्-आ-ले', 'कामी-केत्-आबो', 'कामी-ओक्-आम', 'कामी-एना-किन'],
    explanationHi: 'जब श्रोता शामिल न हो ("आले" = हम), तो क्रिया के अंत में "-ले" लगता है।'
  }
];

export const SantaliTenseSuffixDrill: React.FC = () => {
  const [tenseFilter, setTenseFilter] = useState<string>('all');
  const [timedMode, setTimedMode] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [index, setIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [streak, setStreak] = useState(0);

  const pool =
    tenseFilter === 'all' ? DRILL_BANK : DRILL_BANK.filter((q) => q.tenseTag === tenseFilter);
  const current = pool[index % pool.length] || DRILL_BANK[0];

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  useEffect(() => {
    if (!timedMode || secondsLeft <= 0) return;
    const t = setInterval(() => {
      setSecondsLeft((p) => Math.max(0, p - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [timedMode, secondsLeft > 0]);

  const handleSelect = (opt: string) => {
    if (selectedOpt || (timedMode && secondsLeft <= 0)) return;
    setSelectedOpt(opt);
    setAttempted((p) => p + 1);
    if (opt === current.correctOption) {
      setScore((p) => p + 1);
      setStreak((p) => p + 1);
    } else {
      setStreak(0);
    }
    const fullSentence = `${current.sentencePrefix} ${opt.replace(/-/g, '')}`;
    speakWithFemaleVoice(fullSentence, { autoDetectLanguage: true });
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIndex((p) => p + 1);
  };

  const handleReset = () => {
    setIndex(0);
    setSelectedOpt(null);
    setScore(0);
    setAttempted(0);
    setStreak(0);
    setSecondsLeft(60);
  };

  const accuracy = attempted > 0 ? Math.round((score / attempted) * 100) : 100;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-indigo-800">
            कर्ता · काल · सजीव/निर्जीव कर्म प्रत्यय ड्रिल
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            संताली वाक्य-प्रत्यय व काल अभ्यास लैब (Tense &amp; Suffix Drill)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            कर्ता (`इञ`, `आम`, `आबो`, `आकिन`, `उनकु`) और काल के आधार पर सही क्रिया-प्रत्यय चुनें और तुरंत व्याकरण कारण जानें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setTimedMode((p) => !p);
              setSecondsLeft(60);
            }}
            className={`px-3.5 py-2 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              timedMode
                ? 'bg-amber-600 border-amber-600 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span className="tabular-nums">
              {timedMode ? `60s टाइमर: ${secondsLeft}s` : 'टाइमर मोड चालू करें'}
            </span>
          </button>
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>रीसेट</span>
          </button>
        </div>
      </div>

      {/* Filter + KPI Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-7 flex flex-wrap gap-2">
          {['all', 'वर्तमान (Present)', 'भूत (Past)', 'भविष्य (Future)'].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTenseFilter(t);
                setIndex(0);
                setSelectedOpt(null);
              }}
              className={`px-3.5 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap cursor-pointer ${
                tenseFilter === t
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t === 'all' ? 'सभी काल' : t}
            </button>
          ))}
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs shadow-xs">
          <span className="tabular-nums font-bold text-slate-800">
            स्कोर: {score}/{attempted} ({accuracy}%)
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-amber-800 tabular-nums">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            स्ट्रीक: {streak}
          </span>
        </div>
      </div>

      {/* Active Drill Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        {timedMode && secondsLeft <= 0 ? (
          <div className="text-center py-8 space-y-3">
            <h2 className="text-xl font-bold text-slate-900">समय समाप्त! (Time Up)</h2>
            <p className="text-sm text-slate-600 tabular-nums">
              आपने 60 सेकंड में {attempted} प्रश्नों में से {score} सही हल किए ({accuracy}% शुद्धता)।
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold cursor-pointer"
            >
              फिर से 60s ड्रिल शुरू करें
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-indigo-800">{current.tenseTag}</span>
                <span aria-hidden="true">·</span>
                <span>कर्ता: {current.subjectLabel}</span>
                <span aria-hidden="true">·</span>
                <span>धातु: {current.verbRoot}</span>
                <span aria-hidden="true">·</span>
                <span>{current.animacyNote}</span>
              </div>
              <span className="tabular-nums font-semibold">
                प्रश्न {(index % pool.length) + 1} / {pool.length}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500">हिन्दी लक्ष्य वाक्य:</p>
              <p className="text-lg font-bold text-slate-900">{current.hindiPrompt}</p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-2 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block mb-0.5">
                    संताली वाक्य (देवनागरी लिपि)
                  </span>
                  <p className="text-xl font-bold text-slate-900">
                    {current.sentencePrefix}{' '}
                    <span className="text-amber-800 underline decoration-dashed underline-offset-4">
                      {selectedOpt ? selectedOpt.replace(/-/g, '') : '_________'}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-amber-800 mt-1">
                    ओल चिकी (ᱚᱞ ᱪᱤᱠᱤ):{' '}
                    {toOlChikiAuto(
                      `${current.sentencePrefix} ${selectedOpt ? selectedOpt.replace(/-/g, '') : ''}`
                    )}
                  </p>
                </div>
                <button
                  onClick={() =>
                    speakWithFemaleVoice(
                      `${current.sentencePrefix} ${current.correctOption.replace(/-/g, '')}`,
                      { autoDetectLanguage: true }
                    )
                  }
                  className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>पूरा वाक्य सुनें</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {current.options.map((opt) => {
                const isSelected = selectedOpt === opt;
                const isCorrect = opt === current.correctOption;
                let cls = 'bg-white border-slate-200 hover:border-amber-400 text-slate-900';
                if (selectedOpt) {
                  if (isCorrect) cls = 'bg-emerald-50 border-emerald-500 text-emerald-950';
                  else if (isSelected) cls = 'bg-rose-50 border-rose-400 text-rose-950';
                  else cls = 'bg-slate-50 border-slate-200 text-slate-500';
                }
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    disabled={Boolean(selectedOpt)}
                    className={`p-4 rounded-xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${cls}`}
                  >
                    <div>
                      <p className="text-base font-bold">{opt}</p>
                      <p className="text-xs text-amber-800 mt-0.5">{toOlChikiAuto(opt.replace(/-/g, ''))}</p>
                    </div>
                    {selectedOpt && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    {selectedOpt && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOpt && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-800 space-y-1">
                  <p className="font-bold text-amber-950">व्याकरण नियम स्पष्टीकरण:</p>
                  <p>{current.explanationHi}</p>
                </div>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
                >
                  <span>अगला प्रश्न</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
