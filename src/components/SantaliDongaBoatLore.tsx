import React, { useState } from 'react';
import { Compass, Volume2, Music, Info } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface BoatFeature {
  id: string;
  titleDev: string;
  titleRom: string;
  material: string;
  hydrodynamics: string;
  riverApplication: string;
  icon: string;
}

const BOAT_FEATURES: BoatFeature[] = [
  {
    id: 'tal_donga',
    titleDev: 'ताले डोंगा (ताड़ तना नौका)',
    titleRom: 'Tale Donga (Palmyra Dugout)',
    material: 'परिपक्व ताड़ (Borassus flabellifer) का भारी मोटा तना',
    hydrodynamics: 'प्राकृतिक बंद नोक और खोखली उथली पेंदी जो कम गहरे पानी व कीचड़ में भी बिना फंसे फिसलती है।',
    riverApplication: 'अजय, ब्राह्मणी और बांसलोई नदियों के बरसाती नालों को पार करने तथा सिंघाड़ा-मछली संग्रहण हेतु।',
    icon: '🛶'
  },
  {
    id: 'sarjom_nauka',
    titleDev: 'सरजोम व गमहार लावका (काष्ठ नाव)',
    titleRom: 'Sarjom Lawka (Plank River Boat)',
    material: 'गमहार की हल्की पट्टियाँ और सरजोम (साल) की पसलियाँ',
    hydrodynamics: 'नुकीला अग्रभाग तेज धारा को चीरता है; जोड़ों को सखुआ राल (धुना) और रूई से जलरोधी (caulking) बनाया जाता है।',
    riverApplication: 'दामोदर (नाई गाड़ा) व मयूराक्षी की तेज मानसूनी धारा में यात्रियों और साग़ोड़ माल को पार उतारने हेतु।',
    icon: '⛵'
  },
  {
    id: 'danr_logi',
    titleDev: 'डांड़ व लोगी (पतवार व लग्गी विज्ञान)',
    titleRom: 'Dañr ar Logi (Oar & Bamboo Pole)',
    material: 'बाँस की मजबूत लग्गी (लोगी) व कटहल/साल की चपटी पतवार',
    hydrodynamics: 'उथली नदी में लग्गी से तल को धकेलकर कम ऊर्जा में भारी नाव को आगे बढ़ाने की लीवर तकनीक।',
    riverApplication: 'नदी के भंवर (घुमरी) और जलमग्न चट्टानों से नाव को सुरक्षित दिशा देने में निपुणता।',
    icon: '🚣'
  }
];

export const SantaliDongaBoatLore: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<BoatFeature>(BOAT_FEATURES[0]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-cyan-50 via-white to-blue-50 border border-cyan-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Compass className="w-4 h-4" />
              <span>नदी पार विज्ञान व नौका शिल्प | Donga Canoe &amp; River Craft</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              ताड़-डोंगा नौका निर्माण व नदी-घाट मल्लाह विज्ञान
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              ताड़ के तने से खोदकर बनी डोंगा, धुना जलरोधन, नदी भंवर पहचान व घाट लोकगीत (सेरेञ)।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${selectedFeature.titleDev}। ${selectedFeature.hydrodynamics}। ${selectedFeature.riverApplication}`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white border border-cyan-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>नौका विज्ञान सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          {BOAT_FEATURES.map(feat => (
            <button
              key={feat.id}
              onClick={() => setSelectedFeature(feat)}
              className={`w-full text-left p-4 border flex items-start gap-3 transition-all ${
                selectedFeature.id === feat.id
                  ? 'bg-cyan-50 border-cyan-400'
                  : 'bg-white border-stone-200 hover:border-cyan-200'
              }`}
            >
              <span className="text-3xl">{feat.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-amber-950">{feat.titleDev}</h3>
                <p className="text-[11px] font-mono text-cyan-700">{feat.titleRom}</p>
              </div>
            </button>
          ))}

          <div className="bg-cyan-50 border border-cyan-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-700 flex items-center gap-1.5">
                <Music className="w-4 h-4" /> गाड़ा पार घाट सेरेञ (नदी गीत)
              </span>
              <button
                onClick={() =>
                  speakWithFemaleVoice(
                    'नाई गाड़ा पेरेज दाः दो हो, डोंगा ते पारोम आलिञ दादा। अर्थात बाढ़ आई हुई नदी को डोंगा से पार कर ले चलें।',
                    { lang: 'hi-IN' }
                  )
                }
                className="text-cyan-700 hover:text-cyan-950 p-1"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-bold text-amber-950">नाई गाड़ा पेरेज दाः दो हो, डोंगा ते पारोम आलिञ दादा।</p>
            <p className="text-[11px] font-mono text-cyan-700">Nai gada perej daḥ do ho, donga te parom aliñ dada.</p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white border border-cyan-200 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
              <span className="text-4xl">{selectedFeature.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-amber-950">{selectedFeature.titleDev}</h2>
                <p className="text-xs font-mono text-cyan-700">{selectedFeature.titleRom}</p>
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 border border-stone-200 text-xs">
              <span className="text-cyan-700 font-bold block mb-1">प्रयुक्त काष्ठ व जलरोधी सामग्री:</span>
              <p className="text-amber-800">{selectedFeature.material}</p>
            </div>

            <div className="bg-stone-50 p-4 border border-stone-200 text-xs">
              <span className="text-sky-700 font-bold block mb-1">द्रवगतिकी व संतुलन सिद्धांत:</span>
              <p className="text-stone-900 leading-relaxed">{selectedFeature.hydrodynamics}</p>
            </div>

            <div className="bg-cyan-50 p-4 border border-cyan-200 text-xs">
              <span className="text-emerald-700 font-bold block mb-1">नदी क्षेत्रों में उपयोग:</span>
              <p className="text-stone-900 leading-relaxed">{selectedFeature.riverApplication}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
