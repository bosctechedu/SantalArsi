import React, { useState } from 'react';
import { Landmark, Volume2, Info, Compass, Coins, Sparkles, Scale, ShieldCheck } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface CurrencyItem {
  id: string;
  nameSantali: string;
  nameHindi: string;
  metalMaterial: string;
  exchangeRatio: string;
  historicalEra: string;
  description: string;
  visualEmoji: string;
}

const HISTORICAL_CURRENCY: CurrencyItem[] = [
  {
    id: 'kouri',
    nameSantali: 'Kouri (कौड़ी)',
    nameHindi: 'समुद्री कौड़ी मुद्रा',
    metalMaterial: 'प्राकृतिक समुद्री कौड़ी (Cowrie Shell)',
    exchangeRatio: '४ कौड़ी = १ गंडा; २० गंडा = १ बीसी (८० कौड़ी = १ पण)',
    historicalEra: 'प्राचीन काल से १८वीं शताब्दी तक (हाट-बाजार का मुख्य माध्यम)',
    description: 'चावल, महुआ, नमक और हरी सब्जियों की छोटी खरीदारी के लिए पूरे छोटानागपुर और संताल परगना में कौड़ियों का व्यापक चलन था। मिट्टी की हांडी में गाड़कर इसे संचित किया जाता था।',
    visualEmoji: '🐚'
  },
  {
    id: 'sika',
    nameSantali: 'Sika (सिका / रूपा सिका)',
    nameHindi: 'शुद्ध रजत सिक्का (Silver Token)',
    metalMaterial: 'शुद्ध चांदी (Silver ~ 11.6 ग्राम)',
    exchangeRatio: '१ सिका = १६ आना = ६४ पैसे = १२८० कौड़ी',
    historicalEra: 'चांपा गढ़ व मुगल-मराठा काल',
    description: 'भूमि-क्रय, विवाह में वर-वधू को दिए जाने वाले "सिका-दागा" और परगना स्तर के भारी व्यापार में चांदी के सिक्के का प्रयोग होता था। संताली महिलाएं इसे आभूषण (सिकरी/हार) में भी पिरोती थीं।',
    visualEmoji: '🪙'
  },
  {
    id: 'dhabua',
    nameSantali: 'Dhabua (ढबुआ / तांबा पैसा)',
    nameHindi: 'हाथ से पीटा हुआ तांबे का ढबुआ',
    metalMaterial: 'देशी तांबा (Cast / Hammered Copper)',
    exchangeRatio: '१ ढबुआ = ४ कौड़ी = १ गंडा मूल्य',
    historicalEra: 'मध्यकाल से हूल १८५५ क्रांति तक',
    description: 'लोहारों और तांबे के कारीगरों द्वारा ठोककर बनाया गया भारी मोटा तांबे का सिक्का। इस पर सूर्य अथवा धनुष-बाण का प्रतीक अंकित रहता था।',
    visualEmoji: '🟤'
  },
  {
    id: 'damdi',
    nameSantali: 'Damdi / Adhela (दमड़ी व अधेला)',
    nameHindi: 'अति-लघु तांबे का सिक्का',
    metalMaterial: 'तांबा मिश्रधातु (Copper-Bronze alloy)',
    exchangeRatio: '३ दमड़ी = १ छदाम; २ छदाम = १ पैसा',
    historicalEra: 'ब्रिटिश पूर्व काल',
    description: 'संताली कहावत "दमड़ी ना जाबाव, नाम ना बाचाव" (बिना दमड़ी खर्च किए यश पाना) यहीं से उत्पन्न हुई। यह सबसे छोटी विनिमय इकाई थी।',
    visualEmoji: '🔘'
  }
];

const HISTORICAL_INSCRIPTIONS = [
  {
    garhName: 'चांपा गढ़ प्रस्तर मुहर (Champa Garh Seal)',
    location: 'हजारीबाग-दामोदर घाटी क्षेत्र',
    scriptType: 'आदिम संताली ज्यामितीय चिन्ह व नक्काशी',
    significance: 'संताली समाज की प्राचीन राजधानी चांपा गढ़ के प्रवेश द्वार पर स्थापित शिला। इस पर हिरण (मुर्मू गोत्र), मयूर (मारांडी) और सूर्य के प्रतीक उत्कीर्ण हैं।'
  },
  {
    garhName: 'बादोली गढ़ सीमा प्रस्तर (Badoli Garh Menhir)',
    location: 'सुवर्णरेखा नदी का उच्च बेसिन',
    scriptType: 'संताली पारंपरिक सीमा-चिन्ह (Khonta Diri)',
    significance: 'राजा किस्कू और परगना के बारह गांवों की न्यायिक सीमा निर्धारित करने वाला ऐतिहासिक पत्थर।'
  },
  {
    garhName: 'चाय गढ़ लौह-मुद्रा ताम्रपत्र (Chai Garh Copper Plate)',
    location: 'संथाल परगना सीमांत',
    scriptType: 'ताम्रपत्र पर अंकित संताली कुल-गोत्र प्रतीक',
    significance: 'असुर-संताली धातु कारीगरों द्वारा ताम्रपत्र पर उत्कीर्ण कर-मुक्त ग्राम अधिकार-पत्र।'
  }
];

export const SantaliEpigraphyNumismatics: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyItem>(HISTORICAL_CURRENCY[0]);
  const [activeTab, setActiveTab] = useState<'numismatics' | 'epigraphy' | 'converter'>('numismatics');

  const [inputSika, setInputSika] = useState<number>(1);

  const speakText = (text: string) => {
    speakWithFemaleVoice(text, { autoDetectLanguage: true, rate: 0.88 });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-stone-50 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-sm border border-amber-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-3 border border-amber-200">
              <Coins className="w-4 h-4" />
              गढ़-शिलालेख आर सिका • Epigraphy & Numismatics
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              प्राचीन संताली गढ़-शिलालेख व मुद्रा विज्ञान
            </h1>
            <p className="mt-2 text-amber-700 text-sm sm:text-base max-w-2xl leading-relaxed">
              कौड़ी, रूपा सिका, तांबे के ढबुआ व दमड़ी की विनिमय व्यवस्था, चांपा गढ़ के पाषाण शिलालेख और देशी मुद्रा कैलकुलेटर।
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-2xl border border-amber-200">
            <button
              onClick={() => setActiveTab('numismatics')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'numismatics'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              मुद्रा विज्ञान (Coins)
            </button>
            <button
              onClick={() => setActiveTab('epigraphy')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'epigraphy'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              गढ़-शिलालेख (Epigraphy)
            </button>
            <button
              onClick={() => setActiveTab('converter')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'converter'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              कौड़ी-सिका कनवर्टर
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab: Numismatics */}
      {activeTab === 'numismatics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-600 flex items-center gap-1.5 px-1">
              <Coins className="w-4 h-4 text-amber-600" />
              पारंपरिक ४ देशी मुद्राएं:
            </h2>

            <div className="space-y-3">
              {HISTORICAL_CURRENCY.map((c) => {
                const isSelected = selectedCurrency.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCurrency(c)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-amber-50/80 dark:bg-white/90 border-amber-600 shadow-md ring-2 ring-amber-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 bg-amber-100 dark:bg-white/90 rounded-xl">
                          {c.visualEmoji}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-900 text-base">
                            {c.nameSantali}
                          </div>
                          <div className="text-xs text-amber-700 dark:text-amber-700 font-semibold font-mono">
                            {c.nameHindi}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(`${c.nameSantali}. धातु: ${c.metalMaterial}. विनिमय: ${c.exchangeRatio}`);
                        }}
                        className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-200"
                        title="विवरण सुनें"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Currency Detail */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-900 flex items-center gap-2">
                    {selectedCurrency.visualEmoji} {selectedCurrency.nameSantali}
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-700 font-medium">
                    {selectedCurrency.nameHindi} ({selectedCurrency.metalMaterial})
                  </p>
                </div>
                <button
                  onClick={() => speakText(`${selectedCurrency.nameSantali}. विनिमय दर: ${selectedCurrency.exchangeRatio}. ${selectedCurrency.description}`)}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-white/90 hover:bg-amber-100 text-amber-700 dark:text-amber-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Volume2 className="w-4 h-4" />
                  ऑडियो सुनें
                </button>
              </div>

              {/* Data Specifications */}
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-800 flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    पारंपरिक विनिमय अनुपात (Exchange Ratio):
                  </h4>
                  <p className="text-slate-700 dark:text-slate-600 font-mono font-bold bg-amber-50/60 dark:bg-white/90 p-3.5 rounded-2xl border border-amber-200/60 dark:border-amber-900/30">
                    {selectedCurrency.exchangeRatio}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-800 flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-stone-500"></span>
                    ऐतिहासिक पृष्ठभूमि व सामाजिक उपयोग:
                  </h4>
                  <p className="text-slate-600 dark:text-slate-600 leading-relaxed bg-slate-50 dark:bg-white/90 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {selectedCurrency.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab: Epigraphy */}
      {activeTab === 'epigraphy' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-600" />
              प्राचीन संताली गढ़-शिलालेख व सीमा प्रस्तर
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-600 mt-1">
              दामोदर और सुवर्णरेखा घाटियों में मिले प्राचीन संताली गढ़ों के ऐतिहासिक पाषाण और ताम्रपत्र साक्ष्य।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HISTORICAL_INSCRIPTIONS.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-50 dark:bg-white/90 border border-stone-200 dark:border-stone-700 space-y-3"
              >
                <h3 className="font-bold text-amber-950 dark:text-amber-700 text-sm">
                  {item.garhName}
                </h3>
                <div className="text-xs text-slate-500">स्थान: {item.location}</div>
                <div className="text-xs text-amber-700 dark:text-amber-700 font-semibold">
                  लिपि/प्रतीक: {item.scriptType}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-600 leading-relaxed">
                  {item.significance}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Tab: Currency Converter */}
      {activeTab === 'converter' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600" />
              प्राचीन कौड़ी-सिका-आना विनिमय कैलकुलेटर
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-600 mt-1">
              देखें कि १ चांदी के सिक्के (सिका) में उस काल में कितनी कौड़ियां, ढबुआ और गंडा प्राप्त होते थे।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50/60 dark:bg-white/90 border border-amber-200 dark:border-amber-800 max-w-xl space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-600 block">
                चांदी का सिक्का (सिका) दर्ज करें:
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={inputSika}
                onChange={(e) => setInputSika(Math.max(1, Number(e.target.value)))}
                className="w-32 px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-900 font-mono font-bold text-lg"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700">
                <span className="text-slate-500 block">आना</span>
                <span className="text-base font-bold text-amber-900 dark:text-amber-700 font-mono">
                  {inputSika * 16} आना
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700">
                <span className="text-slate-500 block">तांबा ढबुआ</span>
                <span className="text-base font-bold text-amber-900 dark:text-amber-700 font-mono">
                  {inputSika * 64} ढबुआ
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700">
                <span className="text-slate-500 block">गंडा</span>
                <span className="text-base font-bold text-amber-900 dark:text-amber-700 font-mono">
                  {inputSika * 320} गंडा
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700">
                <span className="text-slate-500 block">कुल कौड़ी</span>
                <span className="text-base font-bold text-sky-600 font-mono">
                  {inputSika * 1280} कौड़ी
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
