import React, { useState } from 'react';
import { UtensilsCrossed, Volume2, Sun, ShieldCheck } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface PreservedFood {
  id: string;
  nameDev: string;
  nameRom: string;
  hindiName: string;
  preservationTechnique: string;
  shelfLife: string;
  nutritionBenefit: string;
  icon: string;
}

const PRESERVED_FOODS: PreservedFood[] = [
  {
    id: 'hendwa',
    nameDev: 'हेंडवा / बांस करील (किण्वित कोंपल)',
    nameRom: 'Hendwa / Matkom Karil',
    hindiName: 'किण्वित बांस करील व सांदना',
    preservationTechnique: 'मानसून में कोमल बांस की करील को बारीक काटकर पत्थर के नीचे दबाया जाता है या मिट्टी के मटके में किण्वित करके धूप में सुखाया जाता है।',
    shelfLife: '१२ से १८ माह (बिना किसी फ्रिज के)',
    nutritionBenefit: 'प्राकृतिक प्रोबायोटिक गुण, फाइबर से भरपूर, पाचन तंत्र को मजबूत रखने व अकाल-रोधी भोजन के रूप में उपयोगी।',
    icon: '🎋'
  },
  {
    id: 'sukha_matkom',
    nameDev: 'रोहोड़ मातकोम व लाडू (सूखा महुआ)',
    nameRom: 'Rohor Matkom ar Ladu',
    hindiName: 'धूप में सुखाया महुआ फूल व लड्डू',
    preservationTechnique: 'ताजे टपके हुए महुआ फूलों को गोबर-लीपे आंगन या खजूर चटाई पर ५-७ दिन सुखाकर भाप देकर मिट्टी कोठली में बंद किया जाता है।',
    shelfLife: '२ वर्ष तक पूर्ण सुरक्षित',
    nutritionBenefit: 'लौह, कैल्शियम और प्राकृतिक शर्करा का खजाना; भुने हुए सरसों-तिल के साथ कूटकर ऊर्जावर्धक महुआ लाडू बनाए जाते हैं।',
    icon: '🍯'
  },
  {
    id: 'sukha_arha',
    nameDev: 'रोहोड़ आड़ाः (सूखे वन-साग)',
    nameRom: 'Rohor Aṛaḥ (Sun-Dried Forest Greens)',
    hindiName: 'सूर्य-शुष्क चकोर, मुंगा व कोइनार साग',
    preservationTechnique: 'कोमल पत्तों को भाप या बिना धुले धूप की छाया में सुखाकर बंद बांस की टोकरी में साल पत्ते लपेटकर रखा जाता है।',
    shelfLife: '८ से १० माह',
    nutritionBenefit: 'भीषण गर्मी व पतझड़ में जब हरी सब्जियां दुर्लभ होती हैं तब माइक्रोन्यूट्रिएंट्स की पूर्ति।',
    icon: '🥬'
  },
  {
    id: 'kend_chironji',
    nameDev: 'टेरेंल व तरौप सियाः (सूखा तेंदू व चिरौंजी)',
    nameRom: 'Terel ar Tarop (Dried Wild Berries & Nuts)',
    hindiName: 'सूखे तेंदू, चिरौंजी व आंवला कतरा',
    preservationTechnique: 'जंगली तेंदू फल व चिरौंजी गुठली को धूप में सुखाकर सूखी राख के साथ मटके में बंद करना।',
    shelfLife: '१ वर्ष से अधिक',
    nutritionBenefit: 'विटामिन-सी व स्वस्थ वसा का प्राकृतिक स्रोत।',
    icon: '🫐'
  }
];

export const SantaliFoodPreservationLore: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState<PreservedFood>(PRESERVED_FOODS[0]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-amber-50 via-white to-orange-50 border border-amber-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Sun className="w-4 h-4" />
              <span>शून्य-बिजली खाद्य संरक्षण | Hendwa &amp; Sun-Dried Forest Food Science</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              हेंडवा (बांस करील) व मानसून खाद्य संरक्षण विज्ञान
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              बिना फ्रिज व रसायन के महुआ, बांस करील, वन-साग व कंद-मूल को पूरे वर्ष सुरक्षित रखने का स्वदेशी ज्ञान।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${selectedFood.nameDev}। विधि: ${selectedFood.preservationTechnique}। पोषण लाभ: ${selectedFood.nutritionBenefit}`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white border border-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>संरक्षण विधि सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          {PRESERVED_FOODS.map(food => (
            <button
              key={food.id}
              onClick={() => setSelectedFood(food)}
              className={`w-full text-left p-4 border flex items-start gap-3 transition-all ${
                selectedFood.id === food.id
                  ? 'bg-amber-100 border-amber-400'
                  : 'bg-white border-stone-200 hover:border-amber-200'
              }`}
            >
              <span className="text-3xl">{food.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-amber-950">{food.nameDev}</h3>
                <p className="text-[11px] font-mono text-amber-700">{food.nameRom}</p>
                <p className="text-xs text-stone-600 mt-1">सुरक्षित अवधि: {food.shelfLife}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-amber-200 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
              <span className="text-4xl">{selectedFood.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-amber-950">{selectedFood.nameDev}</h2>
                <p className="text-xs text-amber-700">{selectedFood.hindiName}</p>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border border-stone-200 text-xs">
              <span className="text-amber-700 font-bold block mb-1">पारंपरिक सुखावन व किण्वन विधि:</span>
              <p className="text-stone-900 leading-relaxed">{selectedFood.preservationTechnique}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 p-3 border border-stone-200">
                <span className="text-stone-600 block">भंडारण क्षमता (Shelf Life):</span>
                <p className="text-amber-800 font-bold mt-1">{selectedFood.shelfLife}</p>
              </div>
              <div className="bg-emerald-50 p-3 border border-emerald-200">
                <span className="text-emerald-700 font-bold block">पोषण व स्वास्थ्य लाभ:</span>
                <p className="text-stone-900 mt-1 leading-relaxed">{selectedFood.nutritionBenefit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
