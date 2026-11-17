import React, { useState } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  Volume2,
  Square,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  Layers
} from 'lucide-react';

interface PronounItem {
  id: string;
  dev: string;
  roman: string;
  numberLabel: 'एकवचन (Singular)' | 'द्विवचन (Dual)' | 'बहुवचन (Plural)';
  inclusivity: string;
  hindi: string;
  verbSuffix: string;
}

const PRONOUNS: PronounItem[] = [
  { id: 'inj', dev: 'इञ', roman: 'Inj', numberLabel: 'एकवचन (Singular)', inclusivity: 'उत्तम पुरुष', hindi: 'मैं', verbSuffix: '-आञ' },
  { id: 'alinj', dev: 'अलिञ', roman: 'Alinj', numberLabel: 'द्विवचन (Dual)', inclusivity: 'अपवर्जी (तुम्हें छोड़कर)', hindi: 'हम दोनों (मैं और वह)', verbSuffix: '-आ-लिञ' },
  { id: 'alang', dev: 'आलांग', roman: 'Alang', numberLabel: 'द्विवचन (Dual)', inclusivity: 'समावेशी (तुम सहित)', hindi: 'हम दोनों (मैं और तुम)', verbSuffix: '-आ-लांग' },
  { id: 'ale', dev: 'आले', roman: 'Ale', numberLabel: 'बहुवचन (Plural)', inclusivity: 'अपवर्जी (तुम्हें छोड़कर)', hindi: 'हम सब (श्रोता छोड़कर)', verbSuffix: '-आ-ले' },
  { id: 'abo', dev: 'आबो', roman: 'Abo / Abon', numberLabel: 'बहुवचन (Plural)', inclusivity: 'समावेशी (तुम सहित)', hindi: 'हम सब (सब मिलकर)', verbSuffix: '-आ-बो' },
  { id: 'am', dev: 'आम', roman: 'Am', numberLabel: 'एकवचन (Singular)', inclusivity: 'मध्यम पुरुष', hindi: 'तुम / आप', verbSuffix: '-आम' },
  { id: 'aben', dev: 'आबेन', roman: 'Aben', numberLabel: 'द्विवचन (Dual)', inclusivity: 'मध्यम पुरुष', hindi: 'तुम दोनों', verbSuffix: '-आ-बेन' },
  { id: 'ape', dev: 'आपे', roman: 'Ape', numberLabel: 'बहुवचन (Plural)', inclusivity: 'मध्यम पुरुष', hindi: 'तुम सब / आप लोग', verbSuffix: '-आ-पे' },
  { id: 'uni', dev: 'उनी', roman: 'Uni', numberLabel: 'एकवचन (Singular)', inclusivity: 'अन्य पुरुष (सजीव)', hindi: 'वह (व्यक्ति)', verbSuffix: '-आ-ए' },
  { id: 'akin', dev: 'आकिन', roman: 'Akin', numberLabel: 'द्विवचन (Dual)', inclusivity: 'अन्य पुरुष (दो सजीव)', hindi: 'वे दोनों', verbSuffix: '-आ-किन' },
  { id: 'unku', dev: 'उनकु', roman: 'Unku', numberLabel: 'बहुवचन (Plural)', inclusivity: 'अन्य पुरुष (बहुवचन)', hindi: 'वे सब / वे लोग', verbSuffix: '-आ-को' }
];

interface CaseMarker {
  id: string;
  dev: string;
  roman: string;
  karakHi: string;
  meaningHi: string;
  usageTip: string;
}

const CASE_MARKERS: CaseMarker[] = [
  { id: 're', dev: 'रे', roman: 're', karakHi: 'अधिकरण (में / पर)', meaningHi: 'में / पर', usageTip: 'स्थान या समय बताने के लिए (जैसे: आतो रे = गाँव में)' },
  { id: 'khon', dev: 'खोन', roman: 'khon', karakHi: 'अपादान (से)', meaningHi: 'से', usageTip: 'अलग होने या शुरुआत बताने के लिए (जैसे: ओड़ाक् खोन = घर से)' },
  { id: 'te', dev: 'ते', roman: 'te', karakHi: 'करण / दिशा (से / को)', meaningHi: 'के द्वारा / की ओर', usageTip: 'साधन या दिशा के लिए (जैसे: हाट ते = हाट की ओर)' },
  { id: 'then', dev: 'ठेन', roman: 'then', karakHi: 'समीपता (के पास)', meaningHi: 'के पास', usageTip: 'किसी व्यक्ति या स्थान के पास (जैसे: आतो ठेन = गाँव के पास)' },
  { id: 'sao', dev: 'सांव', roman: 'sao', karakHi: 'सहचार (के साथ)', meaningHi: 'के साथ', usageTip: 'साथ होने का भाव (जैसे: गाते सांव = दोस्त के साथ)' },
  { id: 'lagit', dev: 'लागित्', roman: 'lagit', karakHi: 'संप्रदान (के लिए)', meaningHi: 'के लिए', usageTip: 'उद्देश्य या लाभ बताने के लिए (जैसे: पाड़हाव लागित् = पढ़ने के लिए)' },
  { id: 'ren', dev: 'रेन / रेयाक्', roman: 'ren / reyak', karakHi: 'संबंध (का / की / के)', meaningHi: 'का / की / के', usageTip: 'सजीव के लिए "रेन", निर्जीव के लिए "रेयाक्"' }
];

interface NounPlace {
  id: string;
  dev: string;
  roman: string;
  hindi: string;
  isAnimate: boolean;
}

const PLACES: NounPlace[] = [
  { id: 'ato', dev: 'आतो', roman: 'ato', hindi: 'गाँव', isAnimate: false },
  { id: 'orak', dev: 'ओड़ाक्', roman: 'orak', hindi: 'घर', isAnimate: false },
  { id: 'iskul', dev: 'इस्कूल', roman: 'iskul', hindi: 'विद्यालय', isAnimate: false },
  { id: 'haat', dev: 'हाट', roman: 'haat', hindi: 'बाज़ार', isAnimate: false },
  { id: 'jaher', dev: 'जाहेर थान', roman: 'jaher than', hindi: 'जाहेर थान', isAnimate: false },
  { id: 'gate', dev: 'गाते', roman: 'gate', hindi: 'मित्र', isAnimate: true }
];

interface QuizItem {
  id: string;
  questionHi: string;
  hint: string;
  correct: string;
  options: string[];
  explainHi: string;
}

const QUIZ_BANK: QuizItem[] = [
  {
    id: 'q1',
    questionHi: '"हम सब (सुनने वाले को शामिल करते हुए)" के लिए संताली सर्वनाम क्या है?',
    hint: 'समावेशी बहुवचन (Inclusive Plural)',
    correct: 'आबो (अबोन्)',
    options: ['आबो (अबोन्)', 'आले', 'अलिञ', 'उनकु'],
    explainHi: 'श्रोता को साथ जोड़कर "हम सब" कहने के लिए "आबो" या "अबोन्" का उपयोग होता है।'
  },
  {
    id: 'q2',
    questionHi: '"वे दोनों जा रहे हैं" में द्विवचन (Dual) का कौन-सा प्रत्यय लगेगा?',
    hint: '2 व्यक्तियों के लिए संताली संख्या-चिह्न',
    correct: '-किन (आकिन सेन-ओक् काना-किन)',
    options: ['-किन (आकिन सेन-ओक् काना-किन)', '-को (उनकु सेन-ओक् काना-को)', '-आञ', '-ले'],
    explainHi: 'संताली में ठीक दो लोगों (द्विवचन) के लिए सर्वनाम "आकिन" और क्रिया में "-किन" जुड़ता है।'
  },
  {
    id: 'q3',
    questionHi: '"घर से" के लिए सही संताली विभक्ति (कारक) रूप चुनें:',
    hint: 'ओड़ाक् = घर',
    correct: 'ओड़ाक् खोन',
    options: ['ओड़ाक् खोन', 'ओड़ाक् रे', 'ओड़ाक् सांव', 'ओड़ाक् लागित्'],
    explainHi: '"खोन" का अर्थ "से" (अपादान कारक) होता है, इसलिए "ओड़ाक् खोन" = घर से।'
  },
  {
    id: 'q4',
    questionHi: '"हम दोनों (तुम्हें छोड़कर, यानी मैं और मेरा भाई)" के लिए सही शब्द है:',
    hint: 'अपवर्जी द्विवचन (Exclusive Dual)',
    correct: 'अलिञ',
    options: ['अलिञ', 'आलांग', 'आबेन', 'आबो'],
    explainHi: 'सुनने वाले को छोड़कर "हम दोनों" कहने पर "अलिञ" और शामिल करने पर "आलांग" कहते हैं।'
  },
  {
    id: 'q5',
    questionHi: 'निर्जीव वस्तु से संबंध ("गाँव का पानी") बताने के लिए कौन-सी विभक्ति लगेगी?',
    hint: 'सजीव = रेन, निर्जीव = रेयाक्',
    correct: 'आतो रेयाक् दाक्',
    options: ['आतो रेयाक् दाक्', 'आतो खोन दाक्', 'आतो ठेन दाक्', 'आतो सांव दाक्'],
    explainHi: 'निर्जीव संज्ञा के साथ संबंध बताने के लिए "रेयाक्" (आतो रेयाक् = गाँव का) लगता है।'
  }
];

export const SantaliPronounCaseLab: React.FC = () => {
  const [selectedPronoun, setSelectedPronoun] = useState<PronounItem>(PRONOUNS[4]); // आबो default
  const [selectedPlace, setSelectedPlace] = useState<NounPlace>(PLACES[0]); // आतो
  const [selectedCase, setSelectedCase] = useState<CaseMarker>(CASE_MARKERS[0]); // रे

  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const builtSentence = (() => {
    let caseWord = selectedCase.dev;
    let caseRoman = selectedCase.roman;
    let caseHi = selectedCase.meaningHi;

    if (selectedCase.id === 'ren') {
      caseWord = selectedPlace.isAnimate ? 'रेन' : 'रेयाक्';
      caseRoman = selectedPlace.isAnimate ? 'ren' : 'reyak';
      caseHi = 'का / की';
    }

    const santaliDev =
      selectedCase.id === 'ren'
        ? `${selectedPronoun.dev} दो ${selectedPlace.dev} ${caseWord} होड़ काना${selectedPronoun.verbSuffix.replace('-आ', '-')}`
        : selectedCase.id === 'khon'
        ? `${selectedPronoun.dev} दो ${selectedPlace.dev} ${caseWord} ले हेच्-एना`
        : `${selectedPronoun.dev} दो ${selectedPlace.dev} ${caseWord} मेनाक्${selectedPronoun.verbSuffix}`;

    const cleanDev =
      selectedCase.id === 'ren'
        ? `${selectedPlace.dev} ${caseWord} ${selectedPronoun.dev}`
        : `${selectedPronoun.dev} दो ${selectedPlace.dev} ${caseWord} मेनाक्${selectedPronoun.verbSuffix}`;

    const cleanRoman =
      selectedCase.id === 'ren'
        ? `${selectedPlace.roman} ${caseRoman} ${selectedPronoun.roman.toLowerCase()}`
        : `${selectedPronoun.roman} do ${selectedPlace.roman} ${caseRoman} menak${selectedPronoun.verbSuffix}`;

    const hindiMeaning =
      selectedCase.id === 'ren'
        ? `${selectedPlace.hindi} ${caseHi} (${selectedPronoun.hindi})`
        : `${selectedPronoun.hindi} ${selectedPlace.hindi} ${caseHi} हैं / हूँ।`;

    return {
      dev: cleanDev,
      olChiki: toOlChikiAuto(cleanDev),
      roman: cleanRoman,
      hindi: hindiMeaning
    };
  })();

  const currentQuiz = QUIZ_BANK[quizIndex];

  const handleAnswer = (opt: string) => {
    if (selectedOpt) return;
    setSelectedOpt(opt);
    setAnsweredCount((c) => c + 1);
    if (opt === currentQuiz.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOpt(null);
    setQuizIndex((prev) => (prev + 1) % QUIZ_BANK.length);
  };

  const resetQuiz = () => {
    setSelectedOpt(null);
    setQuizIndex(0);
    setScore(0);
    setAnsweredCount(0);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>सर्वनाम, वचन-भेद व कारक प्रयोगशाला</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            संताली सर्वनाम, द्विवचन (-किन) व विभक्ति (रे / खोन / ते) लैब
          </h2>
          <p className="text-xs text-slate-600">
            एकवचन, द्विवचन व बहुवचन तथा समावेशी (आबो) बनाम अपवर्जी (आले) सर्वनामों को लाइव वाक्य बनाकर समझें और सुनें।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() =>
              speakWithFemaleVoice(`${builtSentence.dev}. ${builtSentence.hindi}`, { autoDetectLanguage: true })
            }
            className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>बनाया वाक्य सुनें</span>
          </button>
          <button
            type="button"
            onClick={stopSpeaking}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5" />
            <span>रोकें</span>
          </button>
        </div>
      </div>

      {/* Interactive Sentence Composer */}
      <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>१. इंटरैक्टिव वाक्य व विभक्ति निर्माता (सर्वनाम + स्थान + कारक)</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {selectedPronoun.numberLabel} · {selectedPronoun.inclusivity}
          </span>
        </div>

        {/* Live Output Box */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                संताली देवनागरी लिपि
              </span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{builtSentence.dev}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 block">
                ओल चिकी (ᱚᱞ ᱪᱤᱠᱤ)
              </span>
              <p className="text-lg sm:text-xl font-bold text-indigo-950 mt-0.5">{builtSentence.olChiki}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-600 font-semibold">Roman: {builtSentence.roman}</span>
            <span className="text-slate-900 font-bold">हिन्दी अर्थ: {builtSentence.hindi}</span>
          </div>
        </div>

        {/* 3 Columns Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pronouns */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2">
            <span className="text-xs font-black text-slate-800 block">क. सर्वनाम चुनें (Pronoun)</span>
            <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-1">
              {PRONOUNS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPronoun(p)}
                  className={`p-2 rounded-xl border text-left transition-colors cursor-pointer ${
                    selectedPronoun.id === p.id
                      ? 'bg-amber-700 text-white border-amber-800'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-sm font-black">{p.dev}</span>
                    <span className={`text-[10px] font-mono ${selectedPronoun.id === p.id ? 'text-amber-100' : 'text-slate-500'}`}>
                      {p.verbSuffix}
                    </span>
                  </div>
                  <div className={`text-[10px] truncate ${selectedPronoun.id === p.id ? 'text-amber-100' : 'text-slate-500'}`}>
                    {p.hindi}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Noun / Place */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2">
            <span className="text-xs font-black text-slate-800 block">ख. संज्ञा / स्थान चुनें (Noun)</span>
            <div className="grid grid-cols-2 gap-1.5">
              {PLACES.map((pl) => (
                <button
                  key={pl.id}
                  type="button"
                  onClick={() => setSelectedPlace(pl)}
                  className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    selectedPlace.id === pl.id
                      ? 'bg-sky-700 text-white border-sky-800'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <div className="text-sm font-black">{pl.dev}</div>
                  <div className={`text-[10px] ${selectedPlace.id === pl.id ? 'text-sky-100' : 'text-slate-500'}`}>
                    {pl.hindi} · {pl.isAnimate ? 'सजीव' : 'निर्जीव'}
                  </div>
                </button>
              ))}
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700">
              <strong>चयनित कारक नियम:</strong> {selectedCase.usageTip}
            </div>
          </div>

          {/* Case Postpositions */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2">
            <span className="text-xs font-black text-slate-800 block">ग. विभक्ति / परसर्ग चुनें (Case)</span>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {CASE_MARKERS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCase(c)}
                  className={`w-full p-2 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                    selectedCase.id === c.id
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    <span className="text-sm font-black">{c.dev}</span>{' '}
                    <span className={`text-[11px] ${selectedCase.id === c.id ? 'text-emerald-100' : 'text-slate-500'}`}>
                      ({toOlChikiAuto(c.dev)})
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold ${selectedCase.id === c.id ? 'text-emerald-50' : 'text-slate-600'}`}>
                    {c.karakHi}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reference Table: Pronoun 3-Number Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-600" />
          <span>२. संताली सर्वनाम व वचन तालिका (एकवचन · द्विवचन · बहुवचन)</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-700">
                <th className="py-2 px-3 font-bold">संताली देवनागरी</th>
                <th className="py-2 px-3 font-bold">ओल चिकी</th>
                <th className="py-2 px-3 font-bold">वचन व भेद</th>
                <th className="py-2 px-3 font-bold">हिन्दी अर्थ</th>
                <th className="py-2 px-3 font-bold">क्रिया प्रत्यय</th>
                <th className="py-2 px-3 font-bold text-right">ध्वनि</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PRONOUNS.map((p) => (
                <tr key={p.id} className="hover:bg-amber-50/40">
                  <td className="py-2 px-3 font-black text-slate-900">{p.dev}</td>
                  <td className="py-2 px-3 font-bold text-amber-800">{toOlChikiAuto(p.dev)}</td>
                  <td className="py-2 px-3 text-slate-600">
                    {p.numberLabel} · {p.inclusivity}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-800">{p.hindi}</td>
                  <td className="py-2 px-3 font-mono font-bold text-sky-700">{p.verbSuffix}</td>
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => speakWithFemaleVoice(`${p.dev}. ${p.hindi}`, { autoDetectLanguage: true })}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 cursor-pointer"
                      title="सुनें"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Practice Quiz */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900">३. त्वरित अभ्यास परीक्षा (वचन व विभक्ति जाँच)</h3>
            <p className="text-[11px] text-slate-500">
              प्रश्न {quizIndex + 1} / {QUIZ_BANK.length}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold tabular-nums">
            <span className="text-emerald-700">अंक: {score} / {answeredCount}</span>
            <button
              type="button"
              onClick={resetQuiz}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>रीसेट</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-extrabold text-slate-900">{currentQuiz.questionHi}</p>
            <p className="text-xs text-amber-800 mt-0.5">संकेत: {currentQuiz.hint}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentQuiz.options.map((opt) => {
              const isChosen = selectedOpt === opt;
              const isCorrect = opt === currentQuiz.correct;
              let cls = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-amber-400';
              if (selectedOpt) {
                if (isCorrect) cls = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                else if (isChosen) cls = 'bg-rose-50 border-rose-500 text-rose-950';
              }
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleAnswer(opt)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer transition-colors ${cls}`}
                >
                  <div>
                    <div>{opt}</div>
                    <div className="text-[11px] text-amber-800 font-bold mt-0.5">{toOlChikiAuto(opt)}</div>
                  </div>
                  {selectedOpt && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {selectedOpt && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {selectedOpt && (
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-sky-950 font-medium">{currentQuiz.explainHi}</p>
              <button
                type="button"
                onClick={handleNextQuiz}
                className="px-4 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold shrink-0 cursor-pointer"
              >
                अगला प्रश्न →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
