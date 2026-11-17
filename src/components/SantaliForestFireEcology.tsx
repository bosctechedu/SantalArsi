import React, { useState } from 'react';
import { Flame, Volume2, TreePine, ShieldCheck } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface FireEcologyRule {
  id: string;
  titleDev: string;
  titleRom: string;
  season: string;
  technique: string;
  ecologicalImpact: string;
  icon: string;
}

const FIRE_RULES: FireEcologyRule[] = [
  {
    id: 'sakam_jharaw',
    titleDev: 'पत्ता अग्नि-रेखा (सकाम डाहार सफा)',
    titleRom: 'Sakam Agni-Rekha (Leaf Fireline)',
    season: 'फाल्गुन-चैत (मार्च-अप्रैल पतझड़)',
    technique: 'महुआ व साल पेड़ों के नीचे से सूखे पत्तों को ५-१० फीट चौड़ी पट्टियों में झाड़कर अलग कर दिया जाता है ताकि कोई चिंगारी बड़े वन क्षेत्र में न फैल सके।',
    ecologicalImpact: 'यह वैज्ञानिक "फायर-ब्रेक" (Firebreak) प्रणाली है जो भूमिगत नमी व नवजात पौधों को दावानल की भीषण गर्मी से बचाती है।',
    icon: '🍂'
  },
  {
    id: 'controlled_sweep',
    titleDev: 'महुआ तले नियंत्रित सफ़ाई (आतु नियम)',
    titleRom: 'Controlled Base Clearance',
    season: 'महुआ टपकने का समय',
    technique: 'गाँव की सहमति से केवल बड़े महुआ वृक्षों के निचले घेरे को साफ किया जाता है; पूरे जंगल में आग लगाने पर माँझी बैसी द्वारा भारी सामाजिक दंड लगाया जाता है।',
    ecologicalImpact: 'जंगली केंचुए, मशरूम (रुगड़ा) के बीज तंतु और घोंसले सुरक्षित बच जाते हैं।',
    icon: '🪵'
  },
  {
    id: 'sengel_irich',
    titleDev: 'सेंगोल ईरीच् (सामुदायिक अग्नि-शमन दल)',
    titleRom: 'Sengel Irich (Community Fire Watch)',
    season: 'ग्रीष्म ऋतु',
    technique: 'गोड़ेत द्वारा डुगडुगी या सूचना मिलने पर पूरे गाँव के युवा हरे साल की टहनियों और रेत-मिट्टी के साथ मिलकर वन अग्नि को पीटकर शांत करते हैं।',
    ecologicalImpact: 'बिना दमकल गाड़ी के भी सैकड़ों एकड़ साल व तसर कोसा वन नष्ट होने से बच जाते हैं।',
    icon: '🔥'
  }
];

export const SantaliForestFireEcology: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState<FireEcologyRule>(FIRE_RULES[0]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-red-50 via-white to-emerald-50 border border-red-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Flame className="w-4 h-4" />
              <span>वन-अग्नि रोकथाम पारिस्थितिकी | Forest Firebreak Ecology</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              बीर सेंगोल: वन-अग्नि नियंत्रण व पत्ता अग्नि-रेखा विज्ञान
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              पतझड़ में दावानल रोकने की स्वदेशी पत्ता-पट्टी तकनीक, रुगड़ा-मशरूम रक्षा व सामुदायिक अग्नि-शमन कर्तव्य।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${selectedRule.titleDev}। विधि: ${selectedRule.technique}। पर्यावरणीय लाभ: ${selectedRule.ecologicalImpact}`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white border border-rose-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>वन-रक्षा नियम सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          {FIRE_RULES.map(rule => (
            <button
              key={rule.id}
              onClick={() => setSelectedRule(rule)}
              className={`w-full text-left p-4 border flex items-start gap-3 transition-all ${
                selectedRule.id === rule.id
                  ? 'bg-rose-50 border-rose-400'
                  : 'bg-white border-stone-200 hover:border-rose-200'
              }`}
            >
              <span className="text-3xl">{rule.icon}</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-700">{rule.season}</span>
                <h3 className="text-sm font-bold text-amber-950 mt-0.5">{rule.titleDev}</h3>
                <p className="text-[11px] font-mono text-stone-600">{rule.titleRom}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-rose-200 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
              <span className="text-4xl">{selectedRule.icon}</span>
              <div>
                <span className="text-xs text-rose-700 uppercase font-bold">{selectedRule.season}</span>
                <h2 className="text-xl font-bold text-amber-950">{selectedRule.titleDev}</h2>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border border-stone-200 text-xs">
              <span className="text-amber-700 font-bold block mb-1">पारंपरिक अग्नि-नियंत्रण विधि:</span>
              <p className="text-stone-900 leading-relaxed">{selectedRule.technique}</p>
            </div>

            <div className="bg-emerald-50 p-4 border border-emerald-200 text-xs">
              <span className="text-emerald-700 font-bold block mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> पारिस्थितिकी व जैव-विविधता संरक्षण:
              </span>
              <p className="text-stone-900 leading-relaxed">{selectedRule.ecologicalImpact}</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
            <strong>संताली संकल्प:</strong> "बीर बां ताहेन खान, दारे-नाड़ी आर मानवा हों बांको बांचावाक् आ" — जंगल में आग न लगाएं, साल वनों और जीवों की रक्षा करें।
          </div>
        </div>
      </div>
    </div>
  );
};
