import React, { useState } from 'react';
import { Flame, Volume2, Droplets, Info, Sparkles } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface PotteryVessel {
  id: string;
  nameDev: string;
  nameRom: string;
  hindiName: string;
  clayType: string;
  coolingScience: string;
  ritualUse: string;
  icon: string;
}

const VESSELS: PotteryVessel[] = [
  {
    id: 'tukuk',
    nameDev: "तुकुक' (पकाने की चौड़ी हांडी)",
    nameRom: "Tukuk' (Cooking Pot)",
    hindiName: 'चावल व पीठा पकाने का पात्र',
    clayType: 'काली व लाल दोमट मिट्टी + बारीक रेत मिश्रण',
    coolingScience: 'सूक्ष्म छिद्रों के माध्यम से भाप का संतुलित वितरण और भोजन में लौह तत्वों का संरक्षण।',
    ritualUse: 'सोहराय व माघ सिम में नई फसल का भात (नवान्न) केवल नई तुकुक में ही पकाया जाता है।',
    icon: '🏺'
  },
  {
    id: 'chilan',
    nameDev: 'चीलां / हांडी (किण्वन पात्र)',
    nameRom: 'Chilan (Fermentation Jar)',
    hindiName: 'हांडिया व रासी संग्रहण मटका',
    clayType: 'महीन कुम्हारी लाल मिट्टी + गेरू पॉलिश',
    coolingScience: 'बाहरी सूक्ष्म-छिद्र वाष्पीकरण द्वारा अंदर के पेय को प्राकृतिक रूप से १०-१२°C ठंडा रखते हैं।',
    ritualUse: 'जाहेर थान में मारांग बुरु को अर्पित किए जाने वाले "पावन रासी" का निर्माण इसी पात्र में होता है।',
    icon: '🍶'
  },
  {
    id: 'donga',
    nameDev: 'डोंगा / डाक’ कलसी (जलघड़ा)',
    nameRom: 'Donga / Kalsi (Water Pitcher)',
    hindiName: 'शीतल पेयजल घड़ा',
    clayType: 'नदी किनारे की छिद्रयुक्त कछारी मिट्टी',
    coolingScience: 'प्राकृतिक फ्रिज सिद्धांत (Evaporative Cooling) से तपती जेठ की गर्मी में भी मीठा शीतल जल।',
    ritualUse: 'विवाह (बापला) में "दाक् बापेर" संस्कार में सुसज्जित कलश के रूप में पूजित।',
    icon: '💧'
  },
  {
    id: 'kothli',
    nameDev: 'माटी कोठली (अनाज कोठी)',
    nameRom: 'Mati Kothli (Earthen Grain Silo)',
    hindiName: 'धान व बीज सुरक्षा कोठी',
    clayType: 'पीली मिट्टी + धान की भूसी + गोबर लेप',
    coolingScience: 'आर्द्रता-रोधी दीवारें भीतर के बीजों को नमी, घुन और चूहों से पूर्णतः सुरक्षित रखती हैं।',
    ritualUse: 'घर के भीतर (भितरी) पूर्वजों के स्थान के निकट स्थापित।',
    icon: '🌾'
  }
];

export const SantaliTerracottaPottery: React.FC = () => {
  const [selectedVessel, setSelectedVessel] = useState<PotteryVessel>(VESSELS[0]);
  const [kilnTemp, setKilnTemp] = useState<number>(750);

  const kilnStage =
    kilnTemp < 400
      ? 'जल-वाष्पन चरण (कच्ची मिट्टी का सूखना)'
      : kilnTemp < 700
      ? 'कार्बन दहन (लाल-काला रंग परिवर्तन)'
      : 'विट्रिफिकेशन व दृढ़ीकरण (पात्र का पक्का होना)';

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-orange-50 via-white to-stone-50 border border-orange-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Flame className="w-4 h-4" />
              <span>कुम्हार मृदा कला व ऊष्मा विज्ञान | Terracotta Pottery &amp; Kiln Lore</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              संताली मिट्टी पात्र व भट्ठा (आंवा) ताप विज्ञान
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              तुकुक&apos;, चीलां, डोंगा कलसी की वाष्पीकरण शीतलता व भट्ठे में मिट्टी पकने का रसायन।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${selectedVessel.nameDev}। ${selectedVessel.coolingScience}। सांस्कृतिक महत्व: ${selectedVessel.ritualUse}`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white border border-orange-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>पात्र विवरण सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 grid grid-cols-1 gap-3">
          {VESSELS.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedVessel(v)}
              className={`p-4 border text-left flex items-start gap-3 transition-all ${
                selectedVessel.id === v.id
                  ? 'bg-orange-50 border-orange-400'
                  : 'bg-white border-stone-200 hover:border-orange-200'
              }`}
            >
              <span className="text-3xl">{v.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-amber-950">{v.nameDev}</h3>
                <p className="text-[11px] font-mono text-orange-700">{v.nameRom}</p>
                <p className="text-xs text-stone-600 mt-1">{v.hindiName}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-orange-200 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
              <span className="text-4xl">{selectedVessel.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-amber-950">{selectedVessel.nameDev}</h2>
                <p className="text-xs text-orange-700">{selectedVessel.hindiName}</p>
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 border border-stone-200 text-xs">
              <span className="text-stone-600 font-semibold block mb-1">मृदा व गेरू मिश्रण:</span>
              <p className="text-amber-800">{selectedVessel.clayType}</p>
            </div>

            <div className="bg-stone-50 p-3.5 border border-stone-200 text-xs">
              <span className="text-sky-700 font-semibold block mb-1">ऊष्मा व शीतलता विज्ञान:</span>
              <p className="text-stone-900 leading-relaxed">{selectedVessel.coolingScience}</p>
            </div>

            <div className="bg-orange-50 p-3.5 border border-orange-200 text-xs">
              <span className="text-amber-700 font-semibold block mb-1">पवित्र अनुष्ठानिक उपयोग:</span>
              <p className="text-stone-900 leading-relaxed">{selectedVessel.ritualUse}</p>
            </div>
          </div>

          {/* Interactive Kiln Firing Slider */}
          <div className="bg-white border border-stone-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold text-orange-700">भट्ठा (आंवा) ताप चरण सिमुलेटर</h3>
              <span className="text-xs font-mono text-amber-700">{kilnTemp} °C</span>
            </div>
            <input
              type="range"
              min={100}
              max={950}
              step={50}
              value={kilnTemp}
              onChange={(e) => setKilnTemp(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="p-3 bg-stone-50 border border-stone-200 text-xs text-amber-800 font-semibold">
              वर्तमान अवस्था: {kilnStage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
