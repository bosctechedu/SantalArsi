import React, { useState } from 'react';
import { Sprout, Volume2, ShieldCheck, Layers, Info } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface FiberCraftItem {
  id: string;
  nameDev: string;
  nameRom: string;
  hindiName: string;
  rawMaterial: string;
  craftTechnique: string;
  utility: string;
  icon: string;
}

const FIBER_CRAFTS: FiberCraftItem[] = [
  {
    id: 'babui_rope',
    nameDev: 'बाबुई घास की रस्सी (बाबेर)',
    nameRom: 'Babui Baber (Sabai Grass Rope)',
    hindiName: 'उच्च-तन्यता प्राकृतिक रस्सी',
    rawMaterial: 'पहाड़ी बाबुई / सबई घास (Eulaliopsis binata)',
    craftTechnique: 'सूखी घास को पानी से हल्का नम करके हाथ अथवा "टेकुआ" चरखी से तीन-लड़ी बंटाई (3-ply twisting)।',
    utility: 'खटिया (पारकोम) बुनाई, छप्पर (चाला) बांधने, और हल-जुआठ की रस्सी में बिना सड़े वर्षों टिकाऊ।',
    icon: '🪢'
  },
  {
    id: 'patia_mat',
    nameDev: 'पाटिया चटाई (खजूर पत्ती आसन)',
    nameRom: 'Patia / Chatay (Date-Palm Mat)',
    hindiName: 'पारंपरिक बुनी हुई चटाई',
    rawMaterial: 'जंगली खजूर (केंद/खेजुर) की कोमल सुखाई गई पत्तियाँ',
    craftTechnique: 'पत्तियों को चीरकर प्राकृतिक लाल-काले रंग में रंगा जाता है और फिर तिरछी हेरिंगबोन बुनाई (Twill weave) की जाती है।',
    utility: 'मेहमान के स्वागत (पेड़ा आसन), धान सुखाने व गर्मी में शीतल शयन हेतु।',
    icon: '🧶'
  },
  {
    id: 'ghonghu_cloak',
    nameDev: 'घोंघू / छतरी (पत्ता रेनकोट)',
    nameRom: 'Ghonghu / Chhatok (Monsoon Leaf-Cloak)',
    hindiName: 'मानसून सुरक्षा कवच (वर्षा वस्त्र)',
    rawMaterial: 'सिहोड़ / माल्हान (Bauhinia vahlii) लता के चौड़े पत्ते व बाँस की कमाची',
    craftTechnique: 'सिर से पीठ तक फिट होने वाले बाँस के ढांचे पर सिहोड़ के जलरोधी पत्तों को सीढ़ी-नुमा (overlapping shingles) सिलकर गूंथा जाता है।',
    utility: 'आषाढ़-सावन की मूसलाधार बारिश में धान रोपते समय किसानों के दोनों हाथ काम करने के लिए स्वतंत्र रहते हैं।',
    icon: '🍃'
  },
  {
    id: 'sikwar_sling',
    nameDev: 'सिकवाड़ (कांवर झूला जाल)',
    nameRom: 'Sikwar (Bahangi Carrying Net)',
    hindiName: 'कंधे पर भार ढोने का जालीदार झूला',
    rawMaterial: 'सान (Sunn hemp) व बाबुई की बारीक रस्सी',
    craftTechnique: 'षट्कोणीय गाँठों (Hexagonal knotting) से बना गोल जालीदार झूला जो भार पड़ने पर कस जाता है।',
    utility: 'हाँडी, घड़े और टोकरी को बाँस के बाहंगी डंडे से लटकाकर मीलों दूर हाट ले जाने के लिए।',
    icon: '🧺'
  }
];

export const SantaliFiberMatCraft: React.FC = () => {
  const [selectedCraft, setSelectedCraft] = useState<FiberCraftItem>(FIBER_CRAFTS[0]);
  const [bundles, setBundles] = useState<number>(5);

  const estimatedRopeMeters = bundles * 18;
  const cotCoveragePercent = Math.min(100, Math.round((estimatedRopeMeters / 120) * 100));

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-emerald-50 via-white to-amber-50 border border-emerald-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Sprout className="w-4 h-4" />
              <span>वन-तंतु व प्राकृतिक बुनाई शिल्प | Babui Rope, Patia Mat &amp; Ghonghu Craft</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              बाबुई रस्सी, पाटिया चटाई व घोंघू (पत्ता रेनकोट) शिल्प
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              शून्य-प्लास्टिक ग्रामीण अभियांत्रिकी: सबई घास की ३-लड़ी रस्सी, खजूर चटाई व मानसून पत्ती कवच।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${selectedCraft.nameDev}। निर्माण विधि: ${selectedCraft.craftTechnique}। उपयोगिता: ${selectedCraft.utility}`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>शिल्प विधि सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          {FIBER_CRAFTS.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedCraft(item)}
              className={`w-full p-4 border text-left flex items-start gap-3 transition-all ${
                selectedCraft.id === item.id
                  ? 'bg-emerald-50 border-emerald-400'
                  : 'bg-white border-stone-200 hover:border-emerald-200'
              }`}
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-amber-950">{item.nameDev}</h3>
                <p className="text-[11px] font-mono text-emerald-700">{item.nameRom}</p>
                <p className="text-xs text-stone-600 mt-1">{item.hindiName}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-emerald-200 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
              <span className="text-4xl">{selectedCraft.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-amber-950">{selectedCraft.nameDev}</h2>
                <p className="text-xs text-emerald-700">{selectedCraft.hindiName}</p>
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 border border-stone-200 text-xs">
              <span className="text-stone-600 font-semibold block mb-1">प्राकृतिक कच्चा माल (Raw Material):</span>
              <p className="text-amber-800">{selectedCraft.rawMaterial}</p>
            </div>

            <div className="bg-stone-50 p-3.5 border border-stone-200 text-xs">
              <span className="text-emerald-700 font-semibold block mb-1">पारंपरिक बुनाई व बंटाई तकनीक:</span>
              <p className="text-stone-900 leading-relaxed">{selectedCraft.craftTechnique}</p>
            </div>

            <div className="bg-emerald-50 p-3.5 border border-emerald-200 text-xs">
              <span className="text-amber-700 font-semibold block mb-1">ग्रामीण जीवन में उपयोगिता:</span>
              <p className="text-stone-900 leading-relaxed">{selectedCraft.utility}</p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold text-amber-700">बाबुई रस्सी व खटिया (पारकोम) बुनाई कैलकुलेटर</h3>
              <span className="text-xs font-mono text-emerald-700">{bundles} घास के गट्ठे (Bundles)</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={bundles}
              onChange={(e) => setBundles(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 p-3 border border-stone-200">
                <span className="text-stone-600 block">तैयार रस्सी की लंबाई:</span>
                <span className="text-lg font-bold text-amber-700">{estimatedRopeMeters} मीटर</span>
              </div>
              <div className="bg-stone-50 p-3 border border-stone-200">
                <span className="text-stone-600 block">१ खटिया (पारकोम) बुनाई क्षमता:</span>
                <span className="text-lg font-bold text-emerald-700">{cotCoveragePercent}% पूर्ण</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
