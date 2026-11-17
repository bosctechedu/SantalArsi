import React, { useState } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { Volume2, Square, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface WordPair {
  id: string;
  type: 'जोड़ा काथा (युग्म)' | 'उल्टा काथा (विलोम)' | 'समान काथा (पर्यायवाची)';
  leftDev: string;
  rightDev: string;
  meaningHi: string;
  exampleDev: string;
  exampleHi: string;
}

const WORD_PAIRS: WordPair[] = [
  {
    id: 'jk1',
    type: 'जोड़ा काथा (युग्म)',
    leftDev: 'दाक्',
    rightDev: 'माड़ी',
    meaningHi: 'खान-पान व जलपान (पानी-माड़)',
    exampleDev: 'पेड़ा को दो दाक्-माड़ी जोम काक् पे।',
    exampleHi: 'मेहमान लोग, कृपया जलपान कर लीजिए।'
  },
  {
    id: 'jk2',
    type: 'जोड़ा काथा (युग्म)',
    leftDev: 'ओड़ाक्',
    rightDev: 'दुवार',
    meaningHi: 'घर-परिवार व घर-आँगन',
    exampleDev: 'आलेयाक् ओड़ाक्-दुवार रे सुलुक मेनाक्-आ।',
    exampleHi: 'हमारे घर-परिवार में शांति और सद्भाव है।'
  },
  {
    id: 'jk3',
    type: 'जोड़ा काथा (युग्म)',
    leftDev: 'लन्दा',
    rightDev: 'सागाई',
    meaningHi: 'हँसी-खुशी व मेल-मिलाप',
    exampleDev: 'पोरोब रे लन्दा-सागाई दोहो जरुड़-आ।',
    exampleHi: 'पर्व में हँसी-खुशी और मेलजोल रखना जरूरी है।'
  },
  {
    id: 'vk1',
    type: 'उल्टा काथा (विलोम)',
    leftDev: 'मारांग (बड़ा)',
    rightDev: 'हुडिञ (छोटा)',
    meaningHi: 'बड़ा ↔ छोटा',
    exampleDev: 'मारांग दादा आर हुडिञ बोंगा एक साथ मेनाक्-किना।',
    exampleHi: 'बड़े भैया और छोटे भाई साथ में हैं।'
  },
  {
    id: 'vk2',
    type: 'उल्टा काथा (विलोम)',
    leftDev: 'हेन्दे (काला)',
    rightDev: 'पुंड (सफ़ेद)',
    meaningHi: 'काला ↔ सफ़ेद',
    exampleDev: 'सेताक् रे पुंड रिमिल आर निंदा रे हेन्दे आसमान।',
    exampleHi: 'सुबह सफ़ेद बादल और रात में काला आकाश।'
  },
  {
    id: 'vk3',
    type: 'उल्टा काथा (विलोम)',
    leftDev: 'बोगी (अच्छा)',
    rightDev: 'बाड़ीच् (बुरा)',
    meaningHi: 'अच्छा ↔ बुरा',
    exampleDev: 'बोगी काथा रोड़ में, बाड़ीच् काथा बागी में।',
    exampleHi: 'अच्छी बात बोलो, बुरी बात छोड़ दो।'
  },
  {
    id: 'vk4',
    type: 'उल्टा काथा (विलोम)',
    leftDev: 'सेताक् (सुबह)',
    rightDev: 'आयुब (शाम)',
    meaningHi: 'सुबह ↔ शाम',
    exampleDev: 'सेताक् खोन आयुब धाबिच् कामी हुय-एना।',
    exampleHi: 'सुबह से शाम तक काम हुआ।'
  },
  {
    id: 'sk1',
    type: 'समान काथा (पर्यायवाची)',
    leftDev: 'चान्दो (सूर्य/चंद्र)',
    rightDev: 'सिन चान्दो / ञिदा चान्दो',
    meaningHi: 'सूरज व चाँद (दिवस/रात्रि चान्दो)',
    exampleDev: 'सिन चान्दो दो आंगाय तारास एम-ओक्-आ।',
    exampleHi: 'सूर्य देव सुबह प्रकाश देते हैं।'
  },
  {
    id: 'sk2',
    type: 'समान काथा (पर्यायवाची)',
    leftDev: 'होड़ (मनुष्य)',
    rightDev: 'मानवा / खेरवाड़',
    meaningHi: 'मानव / संताल जन',
    exampleDev: 'जोतो मानवा होड़ एक समान काना-बो।',
    exampleHi: 'सभी मनुष्य एक समान हैं।'
  },
  {
    id: 'sk3',
    type: 'समान काथा (पर्यायवाची)',
    leftDev: 'दारे (वृक्ष)',
    rightDev: 'बिर-दारे / रुख',
    meaningHi: 'पेड़ / वनस्पति',
    exampleDev: 'दारे रोहोय ते धरती हरयाड़ ताहेना।',
    exampleHi: 'पेड़ लगाने से धरती हरी-भरी रहती है।'
  }
];

const QUIZ_DATA = [
  {
    q: '"हेन्दे" (काला) का सही विलोम (उल्टा काथा) संताली शब्द चुनें:',
    ans: 'पुंड (सफ़ेद)',
    opts: ['पुंड (सफ़ेद)', 'मारांग (बड़ा)', 'दाक् (पानी)', 'लोलो (गर्म)']
  },
  {
    q: '"ओड़ाक्" (घर) के साथ बोला जाने वाला पारंपरिक संताली युग्म (जोड़ा काथा) है:',
    ans: 'ओड़ाक्-दुवार',
    opts: ['ओड़ाक्-दुवार', 'ओड़ाक्-बुरु', 'ओड़ाक्-हाको', 'ओड़ाक्-पुंड']
  },
  {
    q: '"बोगी" (अच्छा) का उल्टा शब्द संताली में क्या होता है?',
    ans: 'बाड़ीच् (बुरा)',
    opts: ['बाड़ीच् (बुरा)', 'हुडिञ (छोटा)', 'आयुब (शाम)', 'सुख']
  }
];

export const SantaliJoraKathaLab: React.FC = () => {
  const [filter, setFilter] = useState<'सभी' | WordPair['type']>('सभी');
  const [quizIdx, setQuizIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const visiblePairs = WORD_PAIRS.filter((p) => filter === 'सभी' || p.type === filter);
  const currentQ = QUIZ_DATA[quizIdx];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>युग्म-शब्द, विलोम व पर्यायवाची लैब</span>
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-0.5">
            जोड़ा काथा (युग्म), उल्टा काथा (विलोम) व समान काथा
          </h2>
        </div>
        <button
          type="button"
          onClick={stopSpeaking}
          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <Square className="w-3.5 h-3.5" />
          <span>आवाज़ रोकें</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['सभी', 'जोड़ा काथा (युग्म)', 'उल्टा काथा (विलोम)', 'समान काथा (पर्यायवाची)'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
              filter === tab
                ? 'bg-amber-700 text-white border-amber-800'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {visiblePairs.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-amber-800">{item.type}</span>
              <button
                type="button"
                onClick={() =>
                  speakWithFemaleVoice(`${item.leftDev} — ${item.rightDev}. ${item.exampleDev}`, {
                    autoDetectLanguage: true
                  })
                }
                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 cursor-pointer"
                title="सुनें"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-base font-black text-slate-900">
              {item.leftDev} ↔ {item.rightDev}
            </div>
            <div className="text-sm font-bold text-indigo-900">
              {toOlChikiAuto(`${item.leftDev} · ${item.rightDev}`)}
            </div>
            <p className="text-xs font-semibold text-slate-700">अर्थ: {item.meaningHi}</p>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="font-bold text-slate-900">{item.exampleDev}</div>
              <div className="text-slate-600 mt-0.5">{item.exampleHi}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Quiz */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-900 text-sm font-black">त्वरित जोड़ा-विलोम अभ्यास</span>
          <span className="text-emerald-700 tabular-nums">सही उत्तर: {score}</span>
        </div>
        <p className="text-sm font-bold text-slate-900">{currentQ.q}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentQ.opts.map((opt) => {
            const isSel = chosen === opt;
            const isRight = opt === currentQ.ans;
            let cls = 'bg-slate-50 border-slate-200 text-slate-800';
            if (chosen) {
              if (isRight) cls = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
              else if (isSel) cls = 'bg-rose-50 border-rose-500 text-rose-950';
            }
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  if (chosen) return;
                  setChosen(opt);
                  if (opt === currentQ.ans) setScore((s) => s + 1);
                }}
                className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between cursor-pointer ${cls}`}
              >
                <span>{opt}</span>
                {chosen && isRight && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {chosen && isSel && !isRight && <XCircle className="w-4 h-4 text-rose-600" />}
              </button>
            );
          })}
        </div>
        {chosen && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setChosen(null);
                setQuizIdx((i) => (i + 1) % QUIZ_DATA.length);
              }}
              className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
            >
              अगला प्रश्न →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
