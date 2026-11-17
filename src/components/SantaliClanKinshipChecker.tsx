import React, { useState, useMemo } from 'react';
import { Shield, HeartHandshake, Volume2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface ParisInfo {
  id: string;
  nameDev: string;
  nameRoman: string;
  totem: string;
  role: string;
  originNote: string;
}

const TWELVE_CLANS: ParisInfo[] = [
  { id: 'hansda', nameDev: 'हांसदा (हंस)', nameRoman: 'Hansda', totem: 'जंगली हंस (हाँस)', role: 'प्रथम गोत्र, सृजन परंपरा', originNote: 'पिलचु हाड़ाम के ज्येष्ठ पुत्रों की परंपरा' },
  { id: 'murmu', nameDev: 'मुर्मू', nameRoman: 'Murmu', totem: 'नीलगाय (मुरमू)', role: 'नायके / पुरोहित व धर्म रक्षक', originNote: 'पवित्र पूजा व आध्यात्मिक परंपरा' },
  { id: 'kisku', nameDev: 'किस्कू', nameRoman: 'Kisku', totem: 'किंगफिशर / रापाज़ राजा', role: 'शासक व राजा परंपरा (रापाज़)', originNote: 'प्रशासन व गढ़ रक्षा' },
  { id: 'hembram', nameDev: 'हेम्ब्रम', nameRoman: 'Hembram', totem: 'सुपारी (गुआ)', role: 'कुँवर व परामर्शदाता', originNote: 'राजनीतिक व न्यायिक सलाह' },
  { id: 'marandi', nameDev: 'मरांडी', nameRoman: 'Marandi', totem: 'मांदरा घास / खेरवाड़ धन', role: 'किपिसार (कोषाध्यक्ष व भूमि-प्रबंधक)', originNote: 'संपदा व कृषि प्रबंधन' },
  { id: 'soren', nameDev: 'सोरेन', nameRoman: 'Soren', totem: 'पक्षी व नक्षत्र (सिपाही)', role: 'सिपाही व सैन्य रक्षक', originNote: 'वीरता व ग्राम सुरक्षा' },
  { id: 'tudu', nameDev: 'टुडू', nameRoman: 'Tudu', totem: 'मंडराला पक्षी', role: 'तामाक-तुम्दाक् वादक व कलाकार', originNote: 'लोकसंगीत व धातु-काष्ठ शिल्प' },
  { id: 'baske', nameDev: 'बास्के', nameRoman: 'Baske', totem: 'बासी भात (बास्के दाका)', role: 'सामाजिक सेवा व सत्कार', originNote: 'हाट-बाजार व अतिथि सेवा' },
  { id: 'besra', nameDev: 'बेसरा', nameRoman: 'Besra', totem: 'बाज पक्षी (बेसरा)', role: 'नर्तक व कला-साधक', originNote: 'अखाड़ा नृत्य व सांस्कृतिक नेतृत्व' },
  { id: 'chonre', nameDev: 'चोंड़े', nameRoman: 'Chonre', totem: 'गिरगिट / विशेष प्रतीक', role: 'प्रकृति संरक्षण सहायक', originNote: '१२ पारिस में प्राचीन उप-शाखा' },
  { id: 'pauria', nameDev: 'पाउँरिया', nameRoman: 'Pauria', totem: 'कबूतर / पांडुक', role: 'संदेशवाहक परंपरा', originNote: 'शांति व संवाद परंपरा' },
  { id: 'bediya', nameDev: 'बेदेया', nameRoman: 'Bediya', totem: 'भेड़ / विशेष प्रतीक', role: 'वन-आधारित जीवन रक्षा', originNote: '१२वाँ पारंपरिक गोत्र' }
];

export const SantaliClanKinshipChecker: React.FC = () => {
  const [clanA, setClanA] = useState('hansda');
  const [clanB, setClanB] = useState('murmu');
  const [relationTerm, setRelationTerm] = useState('बाबा-आयो');

  const infoA = useMemo(() => TWELVE_CLANS.find((c) => c.id === clanA) || TWELVE_CLANS[0], [clanA]);
  const infoB = useMemo(() => TWELVE_CLANS.find((c) => c.id === clanB) || TWELVE_CLANS[1], [clanB]);
  const isSameClan = clanA === clanB;

  const ETIQUETTE_RULES = [
    { id: 'बाबा-आयो', title: 'माता-पिता व बुज़ुर्ग (गोरोम / हाड़ाम)', etiquette: 'डोबोक जोहार (दोनों हाथ जोड़कर विनम्र प्रणाम) और आदरसूचक संबोधन।', avoid: 'ऊँची आवाज़ में या एकवचन में बात करना वर्जित।' },
    { id: 'होंहार-बाहा', title: 'बाहान्हार (बड़ी साली / बड़ा साला) व समधी', etiquette: 'बाल-दाह (समधी मिलन), पैर धोकर सम्मान व "बालाया" संबोधन।', avoid: 'मजाक या अनौपचारिक स्पर्श पूर्णतः निषिद्ध (मर्यादा संबंध)।' },
    { id: 'तेनांग-इरील', title: 'तेनांग (जीजा/साली-देवर संबंध)', etiquette: 'सामाजिक उत्सवों में सौहार्दपूर्ण हास्य-परिहास (लन्दा सागाई) मान्य।', avoid: 'परिवार की मर्यादा सीमा का सदैव ध्यान रखना।' },
    { id: 'भोग्दो-सगा', title: 'साझा पूर्वज / एक ही पारिस के भाई-बहन', etiquette: 'आजीवन भाई-बहन (दादा-दाई / बोकोंग) का पवित्र रिश्ता।', avoid: 'एक ही पारिस के भीतर विवाह (बोंगा मर्यादा उल्लंघन) पूर्णतः वर्जित।' }
  ];

  const activeEtiquette = ETIQUETTE_RULES.find((e) => e.id === relationTerm) || ETIQUETTE_RULES[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-1 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
            <Shield className="w-4 h-4" />
            <span>१२ पवित्र पारिस, विवाह मर्यादा व रिश्तेदारी मार्गदर्शक</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            पारिस एवं विवाह मर्यादा परीक्षक (Clan &amp; Kinship Checker)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            संताली समाज के १२ गोत्रों (पारिस) में बापला (विवाह) मर्यादा, टोटेम रक्षा और रिश्तेदारी शिष्टाचार की तुरंत जाँच करें।
          </p>
        </div>

        {/* Interactive Checker */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <label className="font-bold text-slate-800 block">प्रथम पक्ष का पारिस (गोत्र १):</label>
              <select
                value={clanA}
                onChange={(e) => setClanA(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm"
              >
                {TWELVE_CLANS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameDev} ({c.nameRoman})
                  </option>
                ))}
              </select>
              <div className="text-xs text-slate-700 space-y-0.5 pt-1">
                <div><strong>टोटेम चिह्न:</strong> {infoA.totem}</div>
                <div><strong>पारंपरिक भूमिका:</strong> {infoA.role}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
              <label className="font-bold text-slate-800 block">द्वितीय पक्ष का पारिस (गोत्र २):</label>
              <select
                value={clanB}
                onChange={(e) => setClanB(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm"
              >
                {TWELVE_CLANS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameDev} ({c.nameRoman})
                  </option>
                ))}
              </select>
              <div className="text-xs text-slate-700 space-y-0.5 pt-1">
                <div><strong>टोटेम चिह्न:</strong> {infoB.totem}</div>
                <div><strong>पारंपरिक भूमिका:</strong> {infoB.role}</div>
              </div>
            </div>
          </div>

          {/* Verdict Banner */}
          <div
            className={`p-5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isSameClan
                ? 'bg-rose-50 border-rose-400 text-rose-950'
                : 'bg-emerald-50 border-emerald-400 text-emerald-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {isSameClan ? (
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h2 className="text-base font-black">
                  {isSameClan
                    ? `सगोत्र निषेध: ${infoA.nameDev} और ${infoB.nameDev} एक ही पारिस हैं!`
                    : `विवाह मर्यादा मान्य: ${infoA.nameDev} एवं ${infoB.nameDev} भिन्न पारिस हैं!`}
                </h2>
                <p className="text-xs leading-relaxed">
                  {isSameClan
                    ? 'संताली पारंपरिक खेरवाड़ सामाजिक विधान के अनुसार एक ही पारिस (गोत्र) के सदस्य आपस में भाई-बहन माने जाते हैं; अतः बापला (विवाह) वर्जित है।'
                    : `दोनों भिन्न पारिस हैं। पारंपरिक नेग (बापला सागाई) एवं माता के मातृ-वंश गोत्र की पुष्टि के पश्चात शुभ विवाह (बापला) मान्य है।`}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                speakWithFemaleVoice(
                  isSameClan
                    ? `${infoA.nameDev} और ${infoB.nameDev} एक ही पारिस हैं। सगोत्र विवाह निषिद्ध है।`
                    : `${infoA.nameDev} और ${infoB.nameDev} भिन्न पारिस हैं। बापला संबंध सामाजिक रूप से मान्य है।`,
                  { autoDetectLanguage: true }
                )
              }
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-sky-700" />
              <span>निर्णय सुनें</span>
            </button>
          </div>
        </div>

        {/* Kinship Etiquette Matrix */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <HeartHandshake className="w-5 h-5 text-amber-700" />
            <span>रिश्तेदारी व सामाजिक शिष्टाचार नियम (सागाई मर्यादा)</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {ETIQUETTE_RULES.map((rule) => (
              <button
                key={rule.id}
                onClick={() => setRelationTerm(rule.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  relationTerm === rule.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {rule.title}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <strong className="text-sm text-slate-900">{activeEtiquette.title}</strong>
              <button
                onClick={() =>
                  speakWithFemaleVoice(`${activeEtiquette.title}। ${activeEtiquette.etiquette}`, {
                    autoDetectLanguage: true
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" /> सुनें
              </button>
            </div>
            <p className="text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <strong>आदर व शिष्टाचार:</strong> {activeEtiquette.etiquette}
            </p>
            <p className="text-rose-900 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              <strong>ध्यान रखने योग्य वर्जना:</strong> {activeEtiquette.avoid}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
