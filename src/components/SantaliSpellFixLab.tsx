import React, { useState } from 'react';
import { speakWithFemaleVoice } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { CheckCircle2, XCircle, Volume2, RotateCcw, PenTool } from 'lucide-react';

interface SpellChallenge {
  id: string;
  hindiMeaning: string;
  wrongOptions: string[];
  correctDev: string;
  ruleExplainHi: string;
}

const SPELL_CHALLENGES: SpellChallenge[] = [
  {
    id: 'sp1',
    hindiMeaning: 'घर (House)',
    wrongOptions: ['ओड़ाक', 'ओड़ाख', 'ओराका'],
    correctDev: 'ओड़ाक्',
    ruleExplainHi: 'संताली में "घर" के अंत में रुद्ध कंठ व्यंजन (क्) होता है: "ओड़ाक्"।'
  },
  {
    id: 'sp2',
    hindiMeaning: 'पानी / जल (Water)',
    wrongOptions: ['दाक', 'डाक्', 'दाख'],
    correctDev: 'दाक्',
    ruleExplainHi: '"दाक्" के अंत में हलंत रुद्ध "क्" लगता है (दाका = भात/भोजन होता है)।'
  },
  {
    id: 'sp3',
    hindiMeaning: 'गीत (Song)',
    wrongOptions: ['सेरेन', 'सेरेङग', 'सेरे'],
    correctDev: 'सेरेञ',
    ruleExplainHi: 'अंत में तालव्य अनुनासिक "ञ" उच्चारित होता है: "सेरेञ"।'
  },
  {
    id: 'sp4',
    hindiMeaning: 'एक (Number 1)',
    wrongOptions: ['मित', 'मीत्', 'मिठ्'],
    correctDev: 'मित्',
    ruleExplainHi: 'संख्या १ के लिए अंत में रुद्ध "त्" आता है: "मित्"।'
  },
  {
    id: 'sp5',
    hindiMeaning: 'नाच / नृत्य (Dance)',
    wrongOptions: ['एनेच', 'एनेज्', 'ऐनेच'],
    correctDev: 'एनेच्',
    ruleExplainHi: '"एनेच्" के अंत में रुद्ध "च्" का संक्षिप्त उच्चारण होता है।'
  }
];

export const SantaliSpellFixLab: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const item = SPELL_CHALLENGES[idx];
  const allOptions = [item.correctDev, ...item.wrongOptions].sort((a, b) => a.localeCompare(b, 'hi'));

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
            <PenTool className="w-4 h-4 text-indigo-600" />
            <span>संताली वर्तनी सुधार व रुद्ध व्यंजन (क्/च्/त्/प्) अखाड़ा</span>
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-0.5">
            शुद्ध संताली देवनागरी व ओल चिकी वर्तनी पहचानें
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold tabular-nums">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            स्कोर: {score} / {SPELL_CHALLENGES.length}
          </span>
          <button
            type="button"
            onClick={() => {
              setIdx(0);
              setPicked(null);
              setScore(0);
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">
            प्रश्न {idx + 1} / {SPELL_CHALLENGES.length}
          </span>
          <button
            type="button"
            onClick={() => speakWithFemaleVoice(`${item.correctDev}. ${item.hindiMeaning}`, { autoDetectLanguage: true })}
            className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>सही उच्चारण सुनें</span>
          </button>
        </div>

        <p className="text-base font-black text-slate-900">
          अर्थ: "{item.hindiMeaning}" के लिए शुद्ध संताली वर्तनी चुनें:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {allOptions.map((opt) => {
            const isSel = picked === opt;
            const isRight = opt === item.correctDev;
            let cls = 'bg-slate-50 border-slate-200 text-slate-900 hover:border-indigo-400';
            if (picked) {
              if (isRight) cls = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
              else if (isSel) cls = 'bg-rose-50 border-rose-500 text-rose-950';
            }
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  if (picked) return;
                  setPicked(opt);
                  if (isRight) setScore((s) => s + 1);
                }}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer ${cls}`}
              >
                <div>
                  <div className="text-base font-black">{opt}</div>
                  <div className="text-xs font-bold text-amber-800">{toOlChikiAuto(opt)}</div>
                </div>
                {picked && isRight && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {picked && isSel && !isRight && <XCircle className="w-4 h-4 text-rose-600" />}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-amber-950 font-semibold">{item.ruleExplainHi}</p>
            <button
              type="button"
              onClick={() => {
                setPicked(null);
                setIdx((i) => (i + 1) % SPELL_CHALLENGES.length);
              }}
              className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shrink-0 cursor-pointer"
            >
              अगला शब्द →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
