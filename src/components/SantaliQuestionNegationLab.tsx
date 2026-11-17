import React, { useState } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { HelpCircle, Volume2, Square, CheckCircle2, XCircle } from 'lucide-react';

interface WhWord {
  id: string;
  dev: string;
  meaningHi: string;
  sampleDev: string;
  sampleHi: string;
}

const WH_WORDS: WhWord[] = [
  { id: 'cet', dev: 'चेत्', meaningHi: 'क्या (What)', sampleDev: 'आम चेत्-एम जोम-एत्-आ?', sampleHi: 'तुम क्या खा रहे हो?' },
  { id: 'okoy', dev: 'ओकोय', meaningHi: 'कौन (Who)', sampleDev: 'नोवा आतो रे ओकोय हेच् काना?', sampleHi: 'इस गाँव में कौन आया है?' },
  { id: 'oka', dev: 'ओका रे', meaningHi: 'कहाँ (Where)', sampleDev: 'आमाक् इस्कूल दो ओका रे मेनाक्-आ?', sampleHi: 'तुम्हारा विद्यालय कहाँ है?' },
  { id: 'tis', dev: 'तिस', meaningHi: 'कब (When)', sampleDev: 'हाट दो तिस हुय-ओक्-आ?', sampleHi: 'हाट कब लगेगा?' },
  { id: 'tinak', dev: 'तिनाक्', meaningHi: 'कितना (How much)', sampleDev: 'नोवा रेयाक् दाम तिनाक् काना?', sampleHi: 'इसका दाम कितना है?' },
  { id: 'chedak', dev: 'चेदाक्', meaningHi: 'क्यों (Why)', sampleDev: 'आम तेहेंञ चेदाक् बाम सेन-लेना?', sampleHi: 'तुम आज क्यों नहीं गए थे?' }
];

interface NegMode {
  id: 'bang' | 'banuk' | 'alo';
  markerDev: string;
  ruleTitle: string;
  usageHi: string;
  sampleDev: string;
  sampleHi: string;
}

const NEG_MODES: NegMode[] = [
  {
    id: 'bang',
    markerDev: 'बाङ (नहीं — क्रिया/कथन निषेध)',
    ruleTitle: 'सामान्य "नहीं" (बाङ / बा-)',
    usageHi: 'किसी बात या क्रिया को मना करने में "बाङ" या कर्ता के साथ "बाञ / बाम / बाए" लगता है।',
    sampleDev: 'इञ दो नित् बाञ सेन-ओक्-आ।',
    sampleHi: 'मैं अभी नहीं जाऊँगा।'
  },
  {
    id: 'banuk',
    markerDev: 'बानुक् (पास नहीं / मौजूद नहीं)',
    ruleTitle: 'अस्तित्व निषेध ("नहीं है" = बानुक्-आ)',
    usageHi: 'जब कोई चीज़ या व्यक्ति मौजूद न हो ("मेनाक्-आ" का उल्टा "बानुक्-आ")।',
    sampleDev: 'ओड़ाक् रे चावले बानुक्-आ।',
    sampleHi: 'घर में चावल नहीं है।'
  },
  {
    id: 'alo',
    markerDev: 'आलो (मत करो — आज्ञा निषेध)',
    ruleTitle: 'निवेदन या मनाही ("मत..." = आलो)',
    usageHi: 'किसी को काम करने से रोकने या "मत करो" कहने के लिए "आलो" का प्रयोग होता है।',
    sampleDev: 'नोंडे कोचा रे आलो-म दुड़ुप-आ।',
    sampleHi: 'यहाँ कोने में मत बैठो।'
  }
];

export const SantaliQuestionNegationLab: React.FC = () => {
  const [activeWh, setActiveWh] = useState<WhWord>(WH_WORDS[0]);
  const [activeNeg, setActiveNeg] = useState<NegMode>(NEG_MODES[0]);
  const [chosenOpt, setChosenOpt] = useState<string | null>(null);

  const negQuiz = {
    questionHi: '"यहाँ शोर मत करो" या "ऐसा मत बोलो" के लिए संताली में कौन-सा निषेध शब्द आएगा?',
    correct: 'आलो (आलो-पे रोड़-आ)',
    options: ['आलो (आलो-पे रोड़-आ)', 'बानुक्-आ', 'चेत्', 'तिनाक्']
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>प्रश्नवाचक व निषेध वाक्य स्टूडियो</span>
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-0.5">
            चेत् / ओकोय / तिस प्रश्न व बाङ / बानुक् / आलो निषेध नियम
          </h2>
        </div>
        <button
          type="button"
          onClick={stopSpeaking}
          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <Square className="w-3.5 h-3.5" />
          <span>रोकें</span>
        </button>
      </div>

      {/* Part 1: Wh-Questions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900">१. संताली प्रश्नवाचक शब्द (क्लिक कर वाक्य देखें व सुनें)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {WH_WORDS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setActiveWh(w)}
              className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                activeWh.id === w.id
                  ? 'bg-sky-700 text-white border-sky-800'
                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-sky-300'
              }`}
            >
              <div className="text-sm font-black">{w.dev}</div>
              <div className={`text-[10px] ${activeWh.id === w.id ? 'text-sky-100' : 'text-slate-500'}`}>
                {w.meaningHi}
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-base font-black text-slate-900">{activeWh.sampleDev}</div>
            <div className="text-sm font-bold text-amber-800">{toOlChikiAuto(activeWh.sampleDev)}</div>
            <div className="text-xs text-slate-700 font-semibold">हिन्दी: {activeWh.sampleHi}</div>
          </div>
          <button
            type="button"
            onClick={() =>
              speakWithFemaleVoice(`${activeWh.sampleDev}. ${activeWh.sampleHi}`, { autoDetectLanguage: true })
            }
            className="px-3.5 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>सुनें</span>
          </button>
        </div>
      </div>

      {/* Part 2: 3 Negation Forms */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900">२. संताली के ३ प्रमुख निषेध रूप (बाङ · बानुक् · आलो)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {NEG_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveNeg(m)}
              className={`p-3 rounded-xl border text-left cursor-pointer ${
                activeNeg.id === m.id
                  ? 'bg-amber-700 text-white border-amber-800'
                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="text-xs font-black">{m.markerDev}</div>
            </button>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-black text-slate-900">{activeNeg.ruleTitle}</h4>
            <button
              type="button"
              onClick={() =>
                speakWithFemaleVoice(`${activeNeg.sampleDev}. ${activeNeg.sampleHi}`, { autoDetectLanguage: true })
              }
              className="px-3 py-1.5 rounded-xl bg-amber-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>सुनें</span>
            </button>
          </div>
          <p className="text-xs text-slate-700">{activeNeg.usageHi}</p>
          <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
            <div className="text-sm font-black text-slate-900">{activeNeg.sampleDev}</div>
            <div className="text-xs font-bold text-amber-800">{toOlChikiAuto(activeNeg.sampleDev)}</div>
            <div className="text-xs text-slate-600">{activeNeg.sampleHi}</div>
          </div>
        </div>
      </div>

      {/* Mini Check */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-black text-slate-900">३. त्वरित नियम जाँच</h3>
        <p className="text-xs font-bold text-slate-800">{negQuiz.questionHi}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {negQuiz.options.map((opt) => {
            const isRight = opt === negQuiz.correct;
            const isSel = chosenOpt === opt;
            let cls = 'bg-slate-50 border-slate-200 text-slate-800';
            if (chosenOpt) {
              if (isRight) cls = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
              else if (isSel) cls = 'bg-rose-50 border-rose-500 text-rose-950';
            }
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setChosenOpt(opt)}
                className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between cursor-pointer ${cls}`}
              >
                <span>{opt}</span>
                {chosenOpt && isRight && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {chosenOpt && isSel && !isRight && <XCircle className="w-4 h-4 text-rose-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
