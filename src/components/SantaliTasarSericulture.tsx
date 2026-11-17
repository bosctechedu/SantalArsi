import React, { useState } from 'react';
import { Sprout, Volume2, ShieldCheck, Info } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface SericultureStage {
  stageNumber: number;
  titleDev: string;
  titleRom: string;
  hostTree: string;
  ecologicalCare: string;
  spiritualTaboo: string;
  icon: string;
}

const TASAR_STAGES: SericultureStage[] = [
  {
    stageNumber: 1,
    titleDev: 'असन व अर्जुन वृक्ष चयन (लुगुम बगान)',
    titleRom: 'Asan & Arjun Host Trees',
    hostTree: 'असन (Terminalia tomentosa), अर्जुन व साल (सरजोम)',
    ecologicalCare: 'वर्षा से पहले पेड़ों की छंटाई (pruning) की जाती है ताकि नई रसीली व कोमल पत्तियाँ निकलें जिन पर रेशम कीट पलते हैं।',
    spiritualTaboo: 'बगान में प्रवेश से पूर्व रेशम पालक (लुगुम होड़) सात्विक आचरण और स्वच्छता का कठोर नियम निभाते हैं।',
    icon: '🌳'
  },
  {
    stageNumber: 2,
    titleDev: 'अंडा व इल्ली (लुगुम) पालन',
    titleRom: 'Lugum Silkworm Rearing',
    hostTree: 'ताजी असन पत्तियों पर कीटों का स्थानांतरण',
    ecologicalCare: 'पत्ते समाप्त होने पर कीटों को हाथ से नहीं, बल्कि टहनी काटकर अगले हरे पेड़ पर स्थानांतरित किया जाता है। पक्षियों व चींटियों से सतत रक्षा की जाती है।',
    spiritualTaboo: 'कीट-रक्षा काल में जंगल में शोर, धूम्रपान या अशुद्ध पदार्थ ले जाना वर्जित माना जाता है।',
    icon: '🐛'
  },
  {
    stageNumber: 3,
    titleDev: 'कोया (कोसा) निर्माण व संचयन',
    titleRom: 'Kosa Cocoon Formation',
    hostTree: 'असन की टहनियों से लटकते सुनहरे-भूरे कोया',
    ecologicalCare: 'लगभग ३५-४० दिनों में इल्ली अपने चारों ओर रेशम का अभेद्य कवच (कोसा) बुन लेती है। अगले वर्ष की नस्ल के लिए २०% श्रेष्ठ कोया बीज हेतु सुरक्षित छोड़े जाते हैं।',
    spiritualTaboo: 'प्रथम कोया उतारने के बाद ग्राम के नायके द्वारा "बीर बोंगा" को धन्यवाद अर्पण किया जाता है।',
    icon: '🥚'
  },
  {
    stageNumber: 4,
    titleDev: 'अहिंसक तसर धागा कताई (घीचा व रीला)',
    titleRom: 'Tasar Silk Reeling & Ghicha Yarn',
    hostTree: 'प्राकृतिक राख (सारजोम तोरोच्) के घोल में कोया उबालना',
    ecologicalCare: 'साल की लकड़ी की राख के क्षारीय जल में कोया को हल्का उबालकर जांघ या चरखे से सुनहरा मजबूत तसर धागा काता जाता है।',
    spiritualTaboo: 'यह अहिंसक "अहिंसा तसर" और पारंपरिक वस्त्र पांची-पारहाड़ के लिए अमूल्य रेशम प्रदान करता है।',
    icon: '🧵'
  }
];

export const SantaliTasarSericulture: React.FC = () => {
  const [activeStage, setActiveStage] = useState<SericultureStage>(TASAR_STAGES[0]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-amber-50 via-white to-emerald-50 border border-amber-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Sprout className="w-4 h-4" />
              <span>वन-आधारित तसर रेशम विज्ञान | Santali Tasar Silk Sericulture</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              तसर कोसा (लुगुम) रेशम कीट पालन व असन वन संवर्धन
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              संथाल परगना व कोल्हान के असन-साल वनों में बिना किसी पेड़ को काटे रेशम उत्पादन का स्वदेशी पर्यावरण-विज्ञान।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `चरण ${activeStage.stageNumber}: ${activeStage.titleDev}। ${activeStage.ecologicalCare}`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white border border-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>प्रक्रिया सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          {TASAR_STAGES.map(st => (
            <button
              key={st.stageNumber}
              onClick={() => setActiveStage(st)}
              className={`w-full text-left p-4 border flex items-start gap-3 transition-all ${
                activeStage.stageNumber === st.stageNumber
                  ? 'bg-amber-100 border-amber-400'
                  : 'bg-white border-stone-200 hover:border-amber-200'
              }`}
            >
              <span className="text-3xl">{st.icon}</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700">चरण {st.stageNumber}</span>
                <h3 className="text-sm font-bold text-amber-950">{st.titleDev}</h3>
                <p className="text-[11px] font-mono text-stone-600">{st.titleRom}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-amber-200 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
              <span className="text-4xl">{activeStage.icon}</span>
              <div>
                <span className="text-xs text-amber-700 uppercase font-bold">कोसा पालन चरण {activeStage.stageNumber}</span>
                <h2 className="text-xl font-bold text-amber-950">{activeStage.titleDev}</h2>
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 border border-stone-200 text-xs">
              <span className="text-emerald-700 font-bold block mb-1">प्रमुख पोषक वृक्ष / माध्यम:</span>
              <p className="text-amber-800">{activeStage.hostTree}</p>
            </div>

            <div className="bg-stone-50 p-4 border border-stone-200 text-sm text-stone-900 leading-relaxed">
              {activeStage.ecologicalCare}
            </div>

            <div className="bg-amber-50 p-3.5 border border-amber-200 text-xs">
              <span className="text-amber-700 font-bold block mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> आचार-संहिता व पारिस्थितिक नियम:
              </span>
              <p className="text-stone-900 leading-relaxed">{activeStage.spiritualTaboo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
