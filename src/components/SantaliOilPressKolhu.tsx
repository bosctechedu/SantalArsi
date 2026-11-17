import React, { useState } from 'react';
import { Droplets, Volume2, Hammer, ShieldCheck } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface OilSeed {
  id: string;
  nameDev: string;
  nameRom: string;
  oilYieldPercent: number;
  pressingMethod: string;
  culinaryAndMedicinalUse: string;
  icon: string;
}

const OIL_SEEDS: OilSeed[] = [
  {
    id: 'kuindi',
    nameDev: 'कुइंडी सुनुम (महुआ बीज का तेल)',
    nameRom: 'Kuindi / Matkom Sunum',
    oilYieldPercent: 35,
    pressingMethod: 'पके महुआ फल की गुठली (कुइंडी) को धूप में सुखाकर ढेंकी से कूटते हैं, भाप देते हैं और फिर भारी लकड़ी के पाटा-कोल्हू से दबाते हैं।',
    culinaryAndMedicinalUse: 'पीठा व साकमा तड़का बनाने, सर्दियों में जोड़ों के दर्द की मालिश, नवजात शिशु अभ्यंग और मिट्टी के दीये जलाने में श्रेष्ठ।',
    icon: '🌰'
  },
  {
    id: 'karanj',
    nameDev: 'करुंज / करंज सुनुम',
    nameRom: 'Karanj / Kurunj Sunum',
    oilYieldPercent: 28,
    pressingMethod: 'करंज की फलियों से बीज निकालकर साल लकड़ी के कोल्हू (चक्की) में ठंडे दबाव (Cold Press) द्वारा निकाला गया शुद्ध कड़वा तेल।',
    culinaryAndMedicinalUse: 'यह खाने में नहीं आता; बल्कि चर्म रोग, खुजली, मच्छर भगाने, बैलगाड़ी धुरी स्नेहक और फसल कीटनाशक के रूप में रामबाण है।',
    icon: '🌿'
  },
  {
    id: 'surguja',
    nameDev: 'सुरगुजा सुनुम (रामतिल तेल)',
    nameRom: 'Surguja Sunum (Niger Seed Oil)',
    oilYieldPercent: 38,
    pressingMethod: 'हल्की भराई व साल काष्ठ के कोल्हू से धीमी पिराई द्वारा निकाला गया सुगंधित सुनहरा खाद्य तेल।',
    culinaryAndMedicinalUse: 'पहाड़ी क्षेत्रों का मुख्य रसोई तेल, जो ओमेगा-३ फैटी एसिड व हृदय स्वास्थ्य से भरपूर होता है।',
    icon: '🌼'
  },
  {
    id: 'kusum',
    nameDev: 'कुसुम सुनुम (कुसुम बीज तेल)',
    nameRom: 'Baru / Kusum Sunum',
    oilYieldPercent: 32,
    pressingMethod: 'कठोर कुसुम बीजों को कूटकर गर्म भाप देने के बाद लकड़ी के भारी दबाने वाले तख्तों (पाटा) के बीच से निचोड़ना।',
    culinaryAndMedicinalUse: 'केश पोषण, रूखी त्वचा उपचार व पर्व-त्योहारों में दीपक प्रज्वलन हेतु अत्यंत शुभ।',
    icon: '🌻'
  }
];

export const SantaliOilPressKolhu: React.FC = () => {
  const [selectedSeed, setSelectedSeed] = useState<OilSeed>(OIL_SEEDS[0]);
  const [seedWeightKg, setSeedWeightKg] = useState<number>(20);

  const oilOutputKg = ((seedWeightKg * selectedSeed.oilYieldPercent) / 100).toFixed(1);
  const cakeResidueKg = (seedWeightKg - Number(oilOutputKg)).toFixed(1);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-yellow-50 via-white to-amber-50 border border-yellow-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Droplets className="w-4 h-4" />
              <span>शून्य-रसायन ठंडी पेराई | Traditional Wooden Oil Press (Kolhu)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              कुइंडी, करंज व सुरगुजा काष्ठ कोल्हू (पाटा) तेल पेराई विज्ञान
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              बिना किसी रसायन या बिजली के जंगली बीजों से शुद्ध कोल्ड-प्रेस्ड तेल (सुनुम) और जैविक खली उत्पादन।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${selectedSeed.nameDev}। विधि: ${selectedSeed.pressingMethod}। उपयोग: ${selectedSeed.culinaryAndMedicinalUse}`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-stone-950 border border-yellow-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>तेल विधि सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          {OIL_SEEDS.map(seed => (
            <button
              key={seed.id}
              onClick={() => setSelectedSeed(seed)}
              className={`w-full text-left p-4 border flex items-start gap-3 transition-all ${
                selectedSeed.id === seed.id
                  ? 'bg-yellow-50 border-yellow-400'
                  : 'bg-white border-stone-200 hover:border-yellow-200'
              }`}
            >
              <span className="text-3xl">{seed.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-amber-950">{seed.nameDev}</h3>
                <p className="text-[11px] font-mono text-yellow-700">{seed.nameRom}</p>
                <p className="text-xs text-stone-600 mt-1">औसत तेल मात्रा: {seed.oilYieldPercent}%</p>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-yellow-200 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
              <span className="text-4xl">{selectedSeed.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-amber-950">{selectedSeed.nameDev}</h2>
                <p className="text-xs font-mono text-yellow-700">{selectedSeed.nameRom}</p>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border border-stone-200 text-xs">
              <span className="text-yellow-700 font-bold block mb-1">पाटा व कोल्हू पेराई विधि:</span>
              <p className="text-stone-900 leading-relaxed">{selectedSeed.pressingMethod}</p>
            </div>

            <div className="bg-emerald-50 p-4 border border-emerald-200 text-xs">
              <span className="text-emerald-700 font-bold block mb-1">औषधीय व पाक-कला उपयोग:</span>
              <p className="text-stone-900 leading-relaxed">{selectedSeed.culinaryAndMedicinalUse}</p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold text-yellow-700">कोल्हू तेल व खली (करें) उत्पादन कैलकुलेटर</h3>
              <span className="text-xs font-mono text-amber-700">{seedWeightKg} किग्रा सूखे बीज</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={seedWeightKg}
              onChange={(e) => setSeedWeightKg(Number(e.target.value))}
              className="w-full accent-yellow-500"
            />
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 p-3 border border-stone-200">
                <span className="text-stone-600 block">शुद्ध प्राप्त तेल (सुनुम):</span>
                <span className="text-lg font-bold text-yellow-700">{oilOutputKg} किग्रा / लीटर</span>
              </div>
              <div className="bg-stone-50 p-3 border border-stone-200">
                <span className="text-stone-600 block">जैविक खली (खेत की खाद/पशु आहार):</span>
                <span className="text-lg font-bold text-emerald-700">{cakeResidueKg} किग्रा</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
