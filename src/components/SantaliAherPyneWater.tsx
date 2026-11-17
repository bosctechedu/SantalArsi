import React, { useState } from 'react';
import { Droplets, Volume2, Scale, Users } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface WaterRule {
  id: string;
  titleDev: string;
  titleRom: string;
  mechanism: string;
  communityJustice: string;
  icon: string;
}

const WATER_RULES: WaterRule[] = [
  {
    id: 'aher_bund',
    titleDev: 'आहर (ढलान के नीचे अर्ध-चंद्राकार बाँध)',
    titleRom: 'Aher Retention Bund',
    mechanism: 'पहाड़ी ढलान के निचले सिरे पर तीन ओर से मिट्टी का मजबूत मेड़ (बाँध) बनाकर मानसूनी वर्षा जल का प्राकृतिक संग्रहण।',
    communityJustice: 'बाँध की रखरखाव और मिट्टी भराई में पूरा गाँव "गौम" (सामुदायिक श्रमदान) करता है; किसी एक परिवार का एकाधिकार नहीं होता।',
    icon: '🏞️'
  },
  {
    id: 'pyne_channel',
    titleDev: 'पइन (गुरुत्वाकर्षण नहर नाली)',
    titleRom: 'Pyne Gravity Contour Canal',
    mechanism: 'बिना किसी डीजल या बिजली पंप के ढलान का उपयोग कर आहर या नदी से मीलों दूर खेतों तक जल पहुंचाने वाली पतली नहरें।',
    communityJustice: 'पइन के किनारे पेड़ लगाकर जड़ों से कटाव रोका जाता है और नहर में कूड़ा डालना सामाजिक दंडनीय अपराध माना जाता है।',
    icon: '〰️'
  },
  {
    id: 'padi_system',
    titleDev: 'पाड़ी न्याय (बारी-बारी सिंचाई प्रणाली)',
    titleRom: 'Padi Equitable Rotation',
    mechanism: 'सूखे के समय जब जल सीमित होता है, तो मांझी व गोड़ेत की निगरानी में नीचे से ऊपर या बारी के अनुसार हर किसान के खेत को सिंचाई समय (पाड़ी) मिलता है।',
    communityJustice: 'बड़े और छोटे दोनों किसानों को समान जल अधिकार; रात की पाड़ी में पारदर्शिता रखने हेतु मशाल व जल-घड़ी नियमों का पालन।',
    icon: '⚖️'
  }
];

export const SantaliAherPyneWater: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState<WaterRule>(WATER_RULES[0]);
  const [plotsCount, setPlotsCount] = useState<number>(12);

  const hoursPerPlot = (72 / plotsCount).toFixed(1);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-blue-50 via-white to-teal-50 border border-blue-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Droplets className="w-4 h-4" />
              <span>शून्य-पंप सिंचाई व जल-न्याय | Aher-Pyne Water Governance</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              आहर-पइन सिंचाई बाँध व पाड़ी जल-बँटवारा प्रणाली
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              गुरुत्वाकर्षण आधारित पारंपरिक नहर अभियांत्रिकी, सामुदायिक श्रमदान (गौम) व न्यायपूर्ण सिंचाई चक्र।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${selectedRule.titleDev}। संरचना: ${selectedRule.mechanism}। न्याय विधान: ${selectedRule.communityJustice}`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white border border-blue-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>जल विधान सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          {WATER_RULES.map(rule => (
            <button
              key={rule.id}
              onClick={() => setSelectedRule(rule)}
              className={`w-full text-left p-4 border flex items-start gap-3 transition-all ${
                selectedRule.id === rule.id
                  ? 'bg-blue-50 border-blue-400'
                  : 'bg-white border-stone-200 hover:border-blue-200'
              }`}
            >
              <span className="text-3xl">{rule.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-amber-950">{rule.titleDev}</h3>
                <p className="text-[11px] font-mono text-blue-700">{rule.titleRom}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-blue-200 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
              <span className="text-4xl">{selectedRule.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-amber-950">{selectedRule.titleDev}</h2>
                <p className="text-xs font-mono text-blue-700">{selectedRule.titleRom}</p>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border border-stone-200 text-xs">
              <span className="text-blue-700 font-bold block mb-1">पारंपरिक जल अभियांत्रिकी:</span>
              <p className="text-stone-900 leading-relaxed">{selectedRule.mechanism}</p>
            </div>

            <div className="bg-emerald-50 p-4 border border-emerald-200 text-xs">
              <span className="text-emerald-700 font-bold block mb-1">सामुदायिक पाड़ी व मांझी न्याय:</span>
              <p className="text-stone-900 leading-relaxed">{selectedRule.communityJustice}</p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold text-blue-700">समान पाड़ी (सिंचाई समय चक्र - ७२ घंटे चक्र)</h3>
              <span className="text-xs font-mono text-amber-700">{plotsCount} किसान खेत (Plots)</span>
            </div>
            <input
              type="range"
              min={4}
              max={24}
              value={plotsCount}
              onChange={(e) => setPlotsCount(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="bg-stone-50 p-3 border border-stone-200 text-xs flex justify-between items-center">
              <span className="text-stone-700">प्रत्येक परिवार को आवंटित न्यायसंगत जल समय:</span>
              <span className="text-lg font-bold text-cyan-700">{hoursPerPlot} घंटे प्रति खेत</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
