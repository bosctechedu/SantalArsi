import React, { useState, useMemo } from 'react';
import { Trees, Feather, Volume2, CheckCircle2, XCircle, RotateCcw, Search } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface EcologyEntry {
  id: string;
  category: 'tree' | 'wildlife';
  santaliDev: string;
  santaliRoman: string;
  hindiName: string;
  ecologicalRole: string;
  culturalNote: string;
  quizQuestion: string;
  quizOptions: string[];
  correctIndex: number;
}

const ECOLOGY_ATLAS: EcologyEntry[] = [
  {
    id: 'sarjom',
    category: 'tree',
    santaliDev: 'सरजोम दारे',
    santaliRoman: 'Sarjom (Sal Tree)',
    hindiName: 'साल / सखुआ वृक्ष',
    ecologicalRole: 'झारखंड व जंगल महाल के वनों का आधारभूत वृक्ष, गहरी जड़ों से भू-जल संरक्षण करता है।',
    culturalNote: 'जाहेर थान में मरांग बुरु का मुख्य निवास; बाहा पर्व में इसके नवपल्लव व फूल अर्पित किए जाते हैं।',
    quizQuestion: 'संताल समुदाय में बाहा पूजा का पवित्र वृक्ष कौन-सा है?',
    quizOptions: ['सरजोम (साल)', 'बबूल', 'अशोक', 'खजूर'],
    correctIndex: 0
  },
  {
    id: 'matkom',
    category: 'tree',
    santaliDev: 'मातकोम दारे',
    santaliRoman: 'Matkom (Mahua)',
    hindiName: 'महुआ वृक्ष',
    ecologicalRole: 'वसंत में मीठे फूल और ग्रीष्म में कुइंडी बीज देता है, जिनसे प्राकृतिक खाद्य तेल निकलता है।',
    culturalNote: 'संताल जीवन में कल्पवृक्ष; सूखे महुआ लाडू अकाल-रोधी पोषण देते हैं।',
    quizQuestion: 'संताली में महुआ के बीज को किस नाम से जाना जाता है जिससे तेल पेरा जाता है?',
    quizOptions: ['कुइंडी', 'सरजोम', 'हेसाक्', 'लुती'],
    correctIndex: 0
  },
  {
    id: 'murut',
    category: 'tree',
    santaliDev: 'मुरुत् बाहा',
    santaliRoman: 'Murut (Palash)',
    hindiName: 'पलाश / टेसू वृक्ष',
    ecologicalRole: 'शुष्क पर्णपाती वनों की शोभा; मधुमक्खियों व पक्षियों को प्रारंभिक पराग प्रदान करता है।',
    culturalNote: 'बाहा और सोहराय में इसके केसरिया फूलों से प्राकृतिक वस्त्र रंग तैयार किया जाता है।',
    quizQuestion: 'फाल्गुन में वन को केसरिया रंग से भर देने वाला पलाश संताली में क्या कहलाता है?',
    quizOptions: ['मुरुत्', 'करंज', 'असन', 'बाड़े'],
    correctIndex: 0
  },
  {
    id: 'marak',
    category: 'wildlife',
    santaliDev: 'माराक्',
    santaliRoman: 'Marak (Peacock)',
    hindiName: 'मोर / मयूर',
    ecologicalRole: 'खेतों के हानिकारक कीटों और विषैले साँपों का नियंत्रण कर कृषि संतुलन रखता है।',
    culturalNote: 'मोर की पांखों से पारंपरिक कलगी सजावट और लोक-गीतों में वर्षा आगमन का संकेत मिलता है।',
    quizQuestion: 'संताली भाषा में "माराक्" किस पक्षी को कहते हैं?',
    quizOptions: ['कोयल', 'मोर', 'कबूतर', 'तीतर'],
    correctIndex: 1
  },
  {
    id: 'hans_hansili',
    category: 'wildlife',
    santaliDev: 'हांस-हांसिली',
    santaliRoman: 'Hans-Hansili (Wild Geese)',
    hindiName: 'आदिम हंस युगल',
    ecologicalRole: 'आर्द्रभूमि और तालाब पारिस्थितिकी की शुद्धता के प्राकृतिक सूचक जल-पक्षी।',
    culturalNote: 'सिरजोन सृष्टि गाथा के अनुसार इन्हीं पक्षियों से प्रथम मानव पिलचु हाड़ाम व पिलचु बुढ़ी का जन्म हुआ।',
    quizQuestion: 'संताली सृष्टि गाथा (सिरजोन) किस पक्षी युगल से जुड़ी है?',
    quizOptions: ['हांस-हांसिली', 'चितिर-बटेर', 'कौवा-मैना', 'गरुड़'],
    correctIndex: 0
  },
  {
    id: 'hesak',
    category: 'tree',
    santaliDev: 'हेसाक् दारे',
    santaliRoman: 'Hesak (Pipal Tree)',
    hindiName: 'पीपल वृक्ष',
    ecologicalRole: 'दिन-रात ऑक्सीजन उत्सर्जन व सैकड़ों पक्षियों-गिलहरियों को आश्रय देने वाला महावृक्ष।',
    culturalNote: 'गांव के मांझी थान या कुलही चौक के पास छाया व सामुदायिक बैठकों का केंद्र।',
    quizQuestion: 'मांझी थान के पास बैठक व शीतल छाया के लिए मुख्यतः कौन-सा वृक्ष रहता है?',
    quizOptions: ['हेसाक् (पीपल)', 'कीकर', 'बांस', 'सखुआ झाड़ी'],
    correctIndex: 0
  }
];

export const SantaliWildlifeFloraQuiz: React.FC = () => {
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [category, setCategory] = useState<'all' | 'tree' | 'wildlife'>('all');
  const [query, setQuery] = useState<string>('');
  const [quizIdx, setQuizIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ECOLOGY_ATLAS.filter((item) => {
      const matchCat = category === 'all' || item.category === category;
      const matchQ =
        !q ||
        item.santaliDev.toLowerCase().includes(q) ||
        item.santaliRoman.toLowerCase().includes(q) ||
        item.hindiName.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [category, query]);

  const currentQuiz = ECOLOGY_ATLAS[quizIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    setAnsweredCount((c) => c + 1);
    if (idx === currentQuiz.correctIndex) setScore((s) => s + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <Trees className="w-4 h-4" />
              <span>वनस्पति व जीव-जंतु ज्ञान · Wildlife &amp; Sacred Flora Atlas</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              वन्यजीव, पक्षी व पवित्र वृक्ष क्विज़ विश्वकोश
            </h1>
            <p className="text-sm text-slate-600">
              सरजोम, मातकोम, मुरुत्, हांस-हांसिली व माराक् जैसे वनीय धरोहरों को जानें और क्विज़ खेलें।
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl shrink-0">
            <button
              onClick={() => setMode('explore')}
              className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer ${
                mode === 'explore' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              विश्वकोश देखें
            </button>
            <button
              onClick={() => setMode('quiz')}
              className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer ${
                mode === 'quiz' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              क्विज़ खेलें ({score}/{answeredCount})
            </button>
          </div>
        </div>

        {mode === 'explore' ? (
          <>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
                {[
                  { id: 'all' as const, label: 'सभी प्रविष्टियाँ' },
                  { id: 'tree' as const, label: 'पवित्र वृक्ष' },
                  { id: 'wildlife' as const, label: 'पक्षी व वन्यजीव' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCategory(tab.id)}
                    className={`min-h-[40px] px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                      category === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="वृक्ष या पक्षी खोजें..."
                  className="w-full min-h-[42px] pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold">
                      <span className="flex items-center gap-1">
                        {item.category === 'tree' ? <Trees className="w-3.5 h-3.5" /> : <Feather className="w-3.5 h-3.5" />}
                        {item.santaliRoman}
                      </span>
                      <button
                        onClick={() =>
                          speakWithFemaleVoice(
                            `${item.santaliDev} यानी ${item.hindiName}। ${item.culturalNote}`,
                            { lang: 'hi-IN', rate: 0.9 }
                          )
                        }
                        className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-500 hover:text-emerald-700 cursor-pointer"
                        title="सुनें"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{item.santaliDev}</h3>
                      <div className="text-xs font-semibold text-slate-600">{item.hindiName}</div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{item.ecologicalRole}</p>
                    <p className="text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70 leading-relaxed">
                      {item.culturalNote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-2xl mx-auto space-y-5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                प्रश्न {quizIdx + 1} / {ECOLOGY_ATLAS.length} · {currentQuiz.santaliRoman}
              </span>
              <span className="font-mono tabular-nums font-bold text-emerald-700">
                स्कोर: {score} / {answeredCount}
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900">{currentQuiz.quizQuestion}</h2>

            <div className="space-y-2.5">
              {currentQuiz.quizOptions.map((opt, idx) => {
                const answered = selectedOpt !== null;
                const isCorrect = idx === currentQuiz.correctIndex;
                const isChosen = idx === selectedOpt;

                let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                if (answered) {
                  if (isCorrect) style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                  else if (isChosen) style = 'bg-rose-50 border-rose-400 text-rose-900';
                  else style = 'bg-slate-50 border-slate-200 text-slate-400';
                }

                return (
                  <button
                    key={idx}
                    disabled={answered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full min-h-[44px] text-left px-4 py-3 rounded-xl border text-sm flex items-center justify-between cursor-pointer disabled:cursor-default ${style}`}
                  >
                    <span>{opt}</span>
                    {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {answered && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {selectedOpt !== null && (
              <div
                className={`p-3.5 border rounded-xl text-xs space-y-1 ${
                  selectedOpt === currentQuiz.correctIndex
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {selectedOpt === currentQuiz.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-emerald-800">सही उत्तर!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="text-rose-800">
                        गलत उत्तर! सही उत्तर: {currentQuiz.quizOptions[currentQuiz.correctIndex]}
                      </span>
                    </>
                  )}
                </div>
                <p>
                  <strong>जानकारी:</strong> {currentQuiz.culturalNote}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setQuizIdx(0);
                  setSelectedOpt(null);
                  setScore(0);
                  setAnsweredCount(0);
                }}
                className="min-h-[44px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रीसेट</span>
              </button>

              <button
                onClick={() => {
                  setSelectedOpt(null);
                  setQuizIdx((i) => (i + 1) % ECOLOGY_ATLAS.length);
                }}
                className="min-h-[44px] px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                अगला प्रश्न →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
