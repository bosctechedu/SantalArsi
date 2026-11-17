import React, { useState } from 'react';
import { Languages, Volume2, Sparkles, BookOpen, CheckCircle2, Info, ArrowRightLeft } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface VerbRoot {
  id: string;
  rootDevanagari: string;
  rootRoman: string;
  hindiMeaning: string;
  transitivity: 'transitive' | 'intransitive';
  sampleObject?: { dev: string; rom: string; hi: string; animacy: 'inanimate' | 'animate' };
}

interface PronounOption {
  id: string;
  labelDevanagari: string;
  labelRoman: string;
  hindiLabel: string;
  subjectSuffix: string;
  subjectSuffixRoman: string;
}

interface TenseOption {
  id: string;
  nameDevanagari: string;
  nameHindi: string;
  tenseMarkerTransitive: string;
  tenseMarkerTransitiveRom: string;
  tenseMarkerIntransitive: string;
  tenseMarkerIntransitiveRom: string;
  hindiTenseEnding: string;
}

const VERB_ROOTS: VerbRoot[] = [
  {
    id: 'jom',
    rootDevanagari: 'जोम',
    rootRoman: 'Jom',
    hindiMeaning: 'खाना (To Eat)',
    transitivity: 'transitive',
    sampleObject: { dev: 'दाका', rom: 'Daka', hi: 'भात / भोजन', animacy: 'inanimate' }
  },
  {
    id: 'ñu',
    rootDevanagari: 'ञू',
    rootRoman: 'Ñu',
    hindiMeaning: 'पीना (To Drink)',
    transitivity: 'transitive',
    sampleObject: { dev: 'दाः', rom: 'Daḥ', hi: 'पानी', animacy: 'inanimate' }
  },
  {
    id: 'ñel',
    rootDevanagari: 'ञेल',
    rootRoman: 'Ñel',
    hindiMeaning: 'देखना (To See)',
    transitivity: 'transitive',
    sampleObject: { dev: 'चेँड़े', rom: 'Cheñṛe', hi: 'पक्षी', animacy: 'animate' }
  },
  {
    id: 'ol',
    rootDevanagari: 'ओल',
    rootRoman: 'Ol',
    hindiMeaning: 'लिखना (To Write)',
    transitivity: 'transitive',
    sampleObject: { dev: 'साकाम', rom: 'Sakam', hi: 'पत्र / चिट्ठी', animacy: 'inanimate' }
  },
  {
    id: 'chalak',
    rootDevanagari: 'चालाक्',
    rootRoman: 'Chalaḳ',
    hindiMeaning: 'जाना (To Go)',
    transitivity: 'intransitive'
  },
  {
    id: 'hech',
    rootDevanagari: 'हेच्',
    rootRoman: 'Hech',
    hindiMeaning: 'आना (To Come)',
    transitivity: 'intransitive'
  },
  {
    id: 'seren',
    rootDevanagari: 'सेरेञ',
    rootRoman: 'Sereñ',
    hindiMeaning: 'गाना (To Sing)',
    transitivity: 'intransitive'
  },
  {
    id: 'enec',
    rootDevanagari: 'एनेच्',
    rootRoman: 'Enech',
    hindiMeaning: 'नाचना (To Dance)',
    transitivity: 'intransitive'
  }
];

const PRONOUNS: PronounOption[] = [
  { id: '1s', labelDevanagari: 'इञ', labelRoman: 'Iñ', hindiLabel: 'मैं (एकवचन)', subjectSuffix: 'ञ', subjectSuffixRoman: 'ñ' },
  { id: '2s', labelDevanagari: 'आम', labelRoman: 'Am', hindiLabel: 'तुम (एकवचन)', subjectSuffix: 'म', subjectSuffixRoman: 'm' },
  { id: '3s', labelDevanagari: 'उनी', labelRoman: 'Uni', hindiLabel: 'वह (एकवचन)', subjectSuffix: 'ए', subjectSuffixRoman: 'e' },
  { id: '1di', labelDevanagari: 'आलांग', labelRoman: 'Alang', hindiLabel: 'हम दोनों (समावेशी - आप व मैं)', subjectSuffix: 'लांग', subjectSuffixRoman: 'lang' },
  { id: '1de', labelDevanagari: 'आलिञ', labelRoman: 'Aliñ', hindiLabel: 'हम दोनों (अपवर्जक - आप को छोड़कर)', subjectSuffix: 'लिञ', subjectSuffixRoman: 'liñ' },
  { id: '1pi', labelDevanagari: 'आबो', labelRoman: 'Abo', hindiLabel: 'हम सब (समावेशी - सब सहित)', subjectSuffix: 'बो', subjectSuffixRoman: 'bo' },
  { id: '1pe', labelDevanagari: 'आले', labelRoman: 'Ale', hindiLabel: 'हम सब (अपवर्जक - केवल हम)', subjectSuffix: 'ले', subjectSuffixRoman: 'le' },
  { id: '3p', labelDevanagari: 'उंकू', labelRoman: 'Unku', hindiLabel: 'वे सब (बहुवचन)', subjectSuffix: 'को', subjectSuffixRoman: 'ko' }
];

const TENSES: TenseOption[] = [
  {
    id: 'present',
    nameDevanagari: 'नितोगाः नांग (वर्तमान)',
    nameHindi: 'सामान्य / अपूर्ण वर्तमान काल',
    tenseMarkerTransitive: 'एत्-आ',
    tenseMarkerTransitiveRom: 'ed-a',
    tenseMarkerIntransitive: 'काना',
    tenseMarkerIntransitiveRom: 'kana',
    hindiTenseEnding: 'रहा हूँ / रहे हैं'
  },
  {
    id: 'past',
    nameDevanagari: 'परोम नांग (भूतकाल)',
    nameHindi: 'पूर्ण भूतकाल',
    tenseMarkerTransitive: 'केत्-आ',
    tenseMarkerTransitiveRom: 'ked-a',
    tenseMarkerIntransitive: 'एना',
    tenseMarkerIntransitiveRom: 'ena',
    hindiTenseEnding: 'चुका / लिया'
  },
  {
    id: 'future',
    nameDevanagari: 'हाजूः नांग (भविष्यत्)',
    nameHindi: 'सामान्य भविष्यत् काल',
    tenseMarkerTransitive: 'आ',
    tenseMarkerTransitiveRom: 'a',
    tenseMarkerIntransitive: 'आ',
    tenseMarkerIntransitiveRom: 'a',
    hindiTenseEnding: 'गा / गे / गी'
  }
];

export const SantaliVerbConjugator: React.FC = () => {
  const [selectedVerb, setSelectedVerb] = useState<VerbRoot>(VERB_ROOTS[0]);
  const [selectedPronoun, setSelectedPronoun] = useState<PronounOption>(PRONOUNS[0]);
  const [selectedTense, setSelectedTense] = useState<TenseOption>(TENSES[0]);

  const buildSentence = () => {
    const isTrans = selectedVerb.transitivity === 'transitive';
    const obj = selectedVerb.sampleObject;

    let verbPhraseDev = '';
    let verbPhraseRom = '';

    if (selectedTense.id === 'present') {
      if (isTrans) {
        const animSuffix = obj?.animacy === 'animate' ? 'ए' : '';
        const animSuffixRom = obj?.animacy === 'animate' ? 'e' : '';
        verbPhraseDev = `${selectedVerb.rootDevanagari} एदा${selectedPronoun.subjectSuffix}${animSuffix ? ` (${animSuffix})` : ''}`;
        verbPhraseRom = `${selectedVerb.rootRoman.toLowerCase()} eda${selectedPronoun.subjectSuffixRoman}`;
        const devSentence = `${selectedPronoun.labelDevanagari} ${obj?.dev || ''} ${selectedPronoun.subjectSuffix} ${selectedVerb.rootDevanagari} एदा।`;
        const romSentence = `${selectedPronoun.labelRoman} ${obj?.rom.toLowerCase() || ''}${selectedPronoun.subjectSuffixRoman} ${selectedVerb.rootRoman.toLowerCase()} eda.`;
        return {
          dev: devSentence,
          rom: romSentence,
          hi: `${selectedPronoun.hindiLabel} ${obj?.hi || ''} ${selectedVerb.hindiMeaning.split(' ')[0]} ${selectedTense.hindiTenseEnding}।`,
          verbDecomp: `${selectedVerb.rootDevanagari} (धातु) + एत् (वर्तमान चिन्ह) + आ (वाक्य समापक) + ${selectedPronoun.subjectSuffix} (कर्ता चिन्ह)`
        };
      } else {
        const devSentence = `${selectedPronoun.labelDevanagari} ${selectedVerb.rootDevanagari} काना${selectedPronoun.subjectSuffix}।`;
        const romSentence = `${selectedPronoun.labelRoman} ${selectedVerb.rootRoman.toLowerCase()} kana${selectedPronoun.subjectSuffixRoman}.`;
        return {
          dev: devSentence,
          rom: romSentence,
          hi: `${selectedPronoun.hindiLabel} ${selectedVerb.hindiMeaning.split(' ')[0]} ${selectedTense.hindiTenseEnding}।`,
          verbDecomp: `${selectedVerb.rootDevanagari} (धातु) + काना (अकर्मक वर्तमान) + ${selectedPronoun.subjectSuffix} (कर्ता चिन्ह)`
        };
      }
    } else if (selectedTense.id === 'past') {
      if (isTrans) {
        const animTag = obj?.animacy === 'animate' ? 'को/ए' : '';
        const devSentence = `${selectedPronoun.labelDevanagari} ${obj?.dev || ''}${selectedPronoun.subjectSuffix} ${selectedVerb.rootDevanagari} केदा${animTag ? ' (सजीव)' : ''}।`;
        const romSentence = `${selectedPronoun.labelRoman} ${obj?.rom.toLowerCase() || ''}${selectedPronoun.subjectSuffixRoman} ${selectedVerb.rootRoman.toLowerCase()} keda.`;
        return {
          dev: devSentence,
          rom: romSentence,
          hi: `${selectedPronoun.hindiLabel} ने ${obj?.hi || ''} ${selectedVerb.hindiMeaning.split(' ')[0]} ${selectedTense.hindiTenseEnding}।`,
          verbDecomp: `${selectedVerb.rootDevanagari} (धातु) + केत् (सकर्मक भूतकाल) + आ (वाक्य समापक)`
        };
      } else {
        const devSentence = `${selectedPronoun.labelDevanagari} ${selectedVerb.rootDevanagari} एना${selectedPronoun.subjectSuffix}।`;
        const romSentence = `${selectedPronoun.labelRoman} ${selectedVerb.rootRoman.toLowerCase()} ena${selectedPronoun.subjectSuffixRoman}.`;
        return {
          dev: devSentence,
          rom: romSentence,
          hi: `${selectedPronoun.hindiLabel} ${selectedVerb.hindiMeaning.split(' ')[0]} ${selectedTense.hindiTenseEnding}।`,
          verbDecomp: `${selectedVerb.rootDevanagari} (धातु) + एना (अकर्मक भूतकाल) + ${selectedPronoun.subjectSuffix} (कर्ता चिन्ह)`
        };
      }
    } else {
      // Future
      if (isTrans) {
        const devSentence = `${selectedPronoun.labelDevanagari} ${obj?.dev || ''}${selectedPronoun.subjectSuffix} ${selectedVerb.rootDevanagari} आ।`;
        const romSentence = `${selectedPronoun.labelRoman} ${obj?.rom.toLowerCase() || ''}${selectedPronoun.subjectSuffixRoman} ${selectedVerb.rootRoman.toLowerCase()} a.`;
        return {
          dev: devSentence,
          rom: romSentence,
          hi: `${selectedPronoun.hindiLabel} ${obj?.hi || ''} ${selectedVerb.hindiMeaning.split(' ')[0]} ${selectedTense.hindiTenseEnding}।`,
          verbDecomp: `${selectedVerb.rootDevanagari} (धातु) + आ (भविष्यत्/समापक चिन्ह) | कर्ता प्रत्यय '${selectedPronoun.subjectSuffix}' कर्म के अंत में`
        };
      } else {
        const devSentence = `${selectedPronoun.labelDevanagari} ${selectedVerb.rootDevanagari} आ${selectedPronoun.subjectSuffix}।`;
        const romSentence = `${selectedPronoun.labelRoman} ${selectedVerb.rootRoman.toLowerCase()} a${selectedPronoun.subjectSuffixRoman}.`;
        return {
          dev: devSentence,
          rom: romSentence,
          hi: `${selectedPronoun.hindiLabel} ${selectedVerb.hindiMeaning.split(' ')[0]} ${selectedTense.hindiTenseEnding}।`,
          verbDecomp: `${selectedVerb.rootDevanagari} (धातु) + आ (भविष्यत् चिन्ह) + ${selectedPronoun.subjectSuffix} (कर्ता चिन्ह)`
        };
      }
    }
  };

  const result = buildSentence();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-indigo-50 via-white to-sky-50 border border-indigo-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Languages className="w-4 h-4" />
              <span>संताली क्रिया-काल व प्रत्यय प्रयोगशाला | Santali Verb Conjugator Lab</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              रोनौड़ क्रिया रूपांतरण लैब (Verb &amp; Tense Conjugator)
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              संताली की अनूठी ३-वचन (द्विवचन सहित), समावेशी-अपवर्जक सर्वनाम व सजीव/निर्जीव क्रिया संरचना सीखें।
            </p>
          </div>
          <button
            onClick={() => speakWithFemaleVoice(`${result.dev} अर्थात् ${result.hi}`, { lang: 'hi-IN' })}
            className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white border border-sky-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>बना वाक्य सुनें (Speak)</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1: Pronoun / Subject */}
          <div className="bg-white border border-stone-200 p-4">
            <h3 className="text-xs uppercase tracking-wider text-amber-700 font-bold mb-3">
              १. कर्ता चुनें (एकवचन / द्विवचन / बहुवचन - समावेशी व अपवर्जक)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRONOUNS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPronoun(p)}
                  className={`p-2.5 text-left border transition-all ${
                    selectedPronoun.id === p.id
                      ? 'bg-amber-600 text-white border-amber-400 font-bold'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-200'
                  }`}
                >
                  <div className="text-sm font-bold">{p.labelDevanagari} ({p.labelRoman})</div>
                  <div className={`text-[10px] mt-0.5 ${selectedPronoun.id === p.id ? 'text-stone-900' : 'text-stone-600'}`}>
                    {p.hindiLabel}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Verb Root */}
          <div className="bg-white border border-stone-200 p-4">
            <h3 className="text-xs uppercase tracking-wider text-sky-700 font-bold mb-3">
              २. मुख्य क्रिया धातु चुनें (Verb Root)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {VERB_ROOTS.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVerb(v)}
                  className={`p-2.5 text-left border transition-all ${
                    selectedVerb.id === v.id
                      ? 'bg-sky-600 text-white border-sky-400 font-bold'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-sky-200'
                  }`}
                >
                  <div className="text-sm font-bold">{v.rootDevanagari} ({v.rootRoman})</div>
                  <div className={`text-[10px] mt-0.5 ${selectedVerb.id === v.id ? 'text-sky-950' : 'text-stone-600'}`}>
                    {v.hindiMeaning}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Tense */}
          <div className="bg-white border border-stone-200 p-4">
            <h3 className="text-xs uppercase tracking-wider text-emerald-700 font-bold mb-3">
              ३. काल चुनें (Tense)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TENSES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTense(t)}
                  className={`p-3 text-left border transition-all ${
                    selectedTense.id === t.id
                      ? 'bg-emerald-700 text-white border-emerald-400 font-bold'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-emerald-200'
                  }`}
                >
                  <div className="text-xs font-bold">{t.nameDevanagari}</div>
                  <div className={`text-[10px] mt-1 ${selectedTense.id === t.id ? 'text-emerald-950' : 'text-stone-600'}`}>
                    {t.nameHindi}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Output Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-stone-50 to-indigo-50 border-2 border-amber-500/60 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>निर्मित संताली वाक्य (Live Result)</span>
              </span>
              <span className="text-[11px] bg-stone-50 px-2 py-0.5 border border-stone-200 text-sky-700">
                {selectedVerb.transitivity === 'transitive' ? 'सकर्मक (Transitive)' : 'अकर्मक (Intransitive)'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-stone-50 border border-amber-200 p-4">
                <span className="text-[10px] uppercase text-stone-600 block mb-1">संताली देवनागरी:</span>
                <p className="text-2xl font-bold text-amber-800 tracking-wide">{result.dev}</p>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-3">
                <span className="text-[10px] uppercase text-stone-600 block mb-1">रोमन लिप्यंतरण (Roman Phonetics):</span>
                <p className="text-sm font-mono text-sky-700">{result.rom}</p>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-3">
                <span className="text-[10px] uppercase text-stone-600 block mb-1">हिन्दी अर्थ:</span>
                <p className="text-sm font-semibold text-emerald-700">{result.hi}</p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 p-3">
                <span className="text-[10px] uppercase text-indigo-700 font-bold block mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> व्याकरणिक विश्लेषण (Morphology Breakdown):
                </span>
                <p className="text-xs text-stone-900 leading-relaxed">{result.verbDecomp}</p>
              </div>
            </div>
          </div>

          {/* Golden Rule */}
          <div className="bg-white border border-stone-200 p-4 text-xs space-y-2">
            <h4 className="font-bold text-amber-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>संताली व्याकरण का स्वर्णिम नियम (Inclusive vs Exclusive)</span>
            </h4>
            <p className="text-stone-700 leading-relaxed">
              • <strong>आलांग / आबो (Inclusive):</strong> जब बोलने वाला श्रोता (सुनने वाले) को भी अपने साथ शामिल करता है (जैसे "हम सब मिलकर गाएंगे - आबो")।
            </p>
            <p className="text-stone-700 leading-relaxed">
              • <strong>आलिञ / आले (Exclusive):</strong> जब बोलने वाला श्रोता को छोड़कर केवल अपने समूह की बात करता है (जैसे "हम घर जा रहे हैं, आप नहीं - आले")।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
