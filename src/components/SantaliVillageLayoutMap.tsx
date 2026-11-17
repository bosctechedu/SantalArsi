import React, { useState } from 'react';
import {
  MapPin,
  Volume2,
  Trees,
  Home,
  Compass,
  Users,
  Droplets,
  Music
} from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface VillageLandmark {
  id: string;
  santali: string;
  olChiki: string;
  hindi: string;
  english: string;
  zone: string;
  summary: string;
  culturalRole: string;
  seasonalHighlight: string;
  xPercent: number;
  yPercent: number;
  badgeColor: string;
  iconKey: 'trees' | 'home' | 'compass' | 'users' | 'water' | 'music' | 'map';
}

const LANDMARKS: VillageLandmark[] = [
  {
    id: 'jaher_than',
    santali: 'जाहेर थान (Jaher Than)',
    olChiki: 'ᱡᱟᱦᱮᱨ ᱛᱷᱟᱱ',
    hindi: 'पवित्र सखुआ वन / ग्राम देवस्थल',
    english: 'Sacred Sal Grove',
    zone: 'गाँव की पूर्वी/बाहरी सीमा',
    summary: 'संताल गाँव का सर्वोच्च पवित्र आध्यात्मिक केंद्र जहाँ सखुआ व महुआ वृक्षों के नीचे मारांग बुरु, जाहेर आयो व मोणेको-तुरुईको का वास माना जाता है।',
    culturalRole: 'नायके (पुजारी) यहाँ बाहा, एरोक् और माघ पोरोब में सामुदायिक पूजा संपन्न कराते हैं।',
    seasonalHighlight: 'बाहा पर्व (फागुन) में सखुआ फूल अर्पित कर वर्ष भर की खुशहाली मांगी जाती है।',
    xPercent: 80,
    yPercent: 24,
    badgeColor: 'bg-emerald-600',
    iconKey: 'trees'
  },
  {
    id: 'manjhi_than',
    santali: 'मांझी थान (Manjhi Than)',
    olChiki: 'ᱢᱟᱹᱧᱡᱷᱤ ᱛᱷᱟᱱ',
    hindi: 'ग्राम प्रमुख व पंचायत वेदी',
    english: 'Village Headman Shrine & Council Hub',
    zone: 'गाँव के मध्य (कुलही बीच)',
    summary: 'कुलही के मुख्य चौराहे पर स्थित छप्परदार पवित्र स्थान, जो ग्राम संस्थापक पूर्वज मांझी हाड़ाम की स्मृति और न्याय व्यवस्था का प्रतीक है।',
    culturalRole: 'मांझी, पारानिक, जोगमांझी, गोड़ेत और नायके यहीं बैठकर मोड़े होड़ (ग्राम सभा) का निर्णय लेते हैं।',
    seasonalHighlight: 'हर पर्व और विवाह से पहले यहाँ कुलही अनुमति व पारंपरिक आशीर्वाद लिया जाता है।',
    xPercent: 48,
    yPercent: 42,
    badgeColor: 'bg-amber-600',
    iconKey: 'compass'
  },
  {
    id: 'akhada',
    santali: 'अखड़ा (Akhada)',
    olChiki: 'ᱟᱠᱷᱲᱟ',
    hindi: 'सामुदायिक नृत्य व गीत प्रांगण',
    english: 'Community Dance & Cultural Arena',
    zone: 'मांझी थान के समीप खुला मैदान',
    summary: 'गाँव का समतल गोलाकार प्रांगण जहाँ शाम ढलते ही तुम्दाक् (मांदर) और टामक की गूंज पर दोंग, लागड़े व सोहराय नृत्य होते हैं।',
    culturalRole: 'युवाओं और बुजुर्गों के बीच लोकगीत, बांसुरी, बनाम व सामूहिक ताल सीखने का जीवंत मंच।',
    seasonalHighlight: 'सोहराय व करम उत्सव में पूरी रात दीप जलाकर अखड़ा उत्सव मनाया जाता है।',
    xPercent: 32,
    yPercent: 56,
    badgeColor: 'bg-rose-600',
    iconKey: 'music'
  },
  {
    id: 'kulhi_dahar',
    santali: 'कुलही डहर (Kulhi Dahar)',
    olChiki: 'ᱠᱩᱞᱦᱤ ᱰᱟᱦᱟᱨ',
    hindi: 'गाँव की मुख्य स्वच्छ सड़क',
    english: 'Central Village Street',
    zone: 'पूर्व से पश्चिम मुख्य धुरी',
    summary: 'दोनों ओर सजे मिट्टी के घरों के बीच से गुजरने वाला चौड़ा ग्राम मार्ग। संताल गाँव अपनी स्वच्छता और सीधी कुलही संरचना के लिए प्रसिद्ध हैं।',
    culturalRole: 'सोहराय के समय हर घर के बाहर खूंटा गाड़कर डंगरा (मवेशी) बांधे जाते हैं और कुलही अल्पना से सजती है।',
    seasonalHighlight: 'बाहा में नायके के लौटने पर कुलही में जल से पांव पखारकर स्वागत होता है।',
    xPercent: 54,
    yPercent: 62,
    badgeColor: 'bg-indigo-600',
    iconKey: 'map'
  },
  {
    id: 'orak_racha',
    santali: 'ओड़ाक् आर राचा (Orak & Racha)',
    olChiki: 'ᱚᱲᱟᱜ ᱟᱨ ᱨᱟᱪᱟ',
    hindi: 'चित्रित मिट्टी का घर व आंगन',
    english: 'Painted Mud Home & Courtyard',
    zone: 'कुलही के दोनों किनारे',
    summary: 'सफेद, गेरुआ और काली प्राकृतिक मिट्टी से भित्ति-चित्रों (सोहराय कला) से सजे मकान, आंगन (राचा) और भीतरी पूर्वज कक्ष (भितार)।',
    culturalRole: 'भितार में कुलदेवता व पूर्वजों का स्थान होता है, जहाँ बाहरी जूते ले जाना वर्जित रहता है।',
    seasonalHighlight: 'सोहराय से पहले महिलाएं हाथों से प्राकृतिक रंगों द्वारा दीवारों पर कलाकृति बनाती हैं।',
    xPercent: 22,
    yPercent: 28,
    badgeColor: 'bg-orange-600',
    iconKey: 'home'
  },
  {
    id: 'pukhuri_dari',
    santali: 'पुखुरी आर डाड़ी (Pukhuri / Dari)',
    olChiki: 'ᱯᱩᱠᱷᱨᱤ ᱟᱨ ᱰᱟᱹᱰᱤ',
    hindi: 'तालाब व प्राकृतिक जल स्रोत',
    english: 'Village Pond & Natural Spring',
    zone: 'गाँव की दक्षिणी ढलान',
    summary: 'गाँव का सामूहिक जलाशय व पत्थर से बंधा झरना-स्रोत (डाड़ी), जो कृषि, स्नान और धार्मिक शुद्धिकरण का आधार है।',
    culturalRole: 'प्रत्येक पर्व से पहले उमुल आदेर और स्नान अनुष्ठान डाड़ी या पुखुरी किनारे होता है।',
    seasonalHighlight: 'सोहराय के पहले दिन "उम माहा" स्नान उत्सव यहीं संपन्न होता है।',
    xPercent: 76,
    yPercent: 76,
    badgeColor: 'bg-sky-600',
    iconKey: 'water'
  },
  {
    id: 'haat_tand',
    santali: 'हाट टांड़ (Haat Tand)',
    olChiki: 'ᱦᱟᱴ ᱴᱟᱺᱰ',
    hindi: 'साप्ताहिक बाज़ार व खेल मैदान',
    english: 'Weekly Market & Gathering Ground',
    zone: 'गाँव की पश्चिमी सीमा',
    summary: 'गाँव से बाहर ऊंचा खुला मैदान जहाँ साप्ताहिक हाट (हटिया), तीरंदाजी अभ्यास, व आसपास के गाँवों का मेल-मिलाप होता है।',
    culturalRole: 'स्थानीय कृषि उपज, सखुआ दोना, बांस शिल्प व वाद्य यंत्रों का विनिमय केंद्र।',
    seasonalHighlight: 'पर्वों के बाद मेला व पाता नाच का आयोजन हाट टांड़ में किया जाता है।',
    xPercent: 18,
    yPercent: 78,
    badgeColor: 'bg-violet-600',
    iconKey: 'users'
  }
];

const renderIcon = (key: VillageLandmark['iconKey'], className: string) => {
  switch (key) {
    case 'trees': return <Trees className={className} />;
    case 'home': return <Home className={className} />;
    case 'compass': return <Compass className={className} />;
    case 'users': return <Users className={className} />;
    case 'water': return <Droplets className={className} />;
    case 'music': return <Music className={className} />;
    default: return <MapPin className={className} />;
  }
};

export const SantaliVillageLayoutMap: React.FC = () => {
  const [selected, setSelected] = useState<VillageLandmark>(LANDMARKS[0]);

  const handleSelect = (lm: VillageLandmark) => {
    setSelected(lm);
  };

  const handleSpeakLandmark = (lm: VillageLandmark) => {
    const text = `${lm.santali}. ${lm.hindi}. ${lm.summary} ${lm.culturalRole}`;
    speakWithFemaleVoice(text, { autoDetectLanguage: true });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-slate-50 min-h-screen text-slate-900">
      <div className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>संताल आतो (ग्राम) संरचना नक्शा</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            संताल गाँव का मानचित्र व पवित्र स्थल (Village Map)
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            जाहेर थान, मांझी थान, कुलही डहर और अखड़ा की पारंपरिक बसावट पर क्लिक कर विवरण जानें व सुनें।
          </p>
        </div>
        <button
          onClick={() => handleSpeakLandmark(selected)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition self-start md:self-auto"
        >
          <Volume2 className="w-4 h-4" />
          <span>चयनित स्थल सुनें</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Illustrated Map */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>किसी भी स्थान पिन पर क्लिक करें</span>
            <span>दिशा: उत्तर (उपर) • पूर्व (दाएं)</span>
          </div>

          <div className="relative w-full aspect-[16/10] min-h-[320px] rounded-2xl border-2 border-emerald-200 overflow-hidden bg-gradient-to-br from-emerald-50 via-amber-50/70 to-sky-50">
            {/* Decorative SVG Village Roads & River */}
            <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Main Kulhi Street */}
              <path d="M 80 310 Q 400 290 710 310" stroke="#d97706" strokeWidth="18" strokeOpacity="0.22" fill="none" strokeLinecap="round" />
              <path d="M 80 310 Q 400 290 710 310" stroke="#b45309" strokeWidth="3" strokeDasharray="8 6" strokeOpacity="0.45" fill="none" />
              {/* Pond */}
              <ellipse cx="615" cy="395" rx="85" ry="48" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" strokeOpacity="0.4" />
              {/* Sacred Sal Grove canopy */}
              <circle cx="645" cy="120" r="68" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" strokeOpacity="0.4" />
              {/* Akhada Circle */}
              <circle cx="255" cy="275" r="46" fill="#fecdd3" stroke="#e11d48" strokeWidth="2" strokeDasharray="5 5" strokeOpacity="0.5" />
            </svg>

            {/* Landmark Pins */}
            {LANDMARKS.map((lm) => {
              const isActive = selected.id === lm.id;
              return (
                <button
                  key={lm.id}
                  onClick={() => handleSelect(lm)}
                  style={{ left: `${lm.xPercent}%`, top: `${lm.yPercent}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform ${
                    isActive ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                  }`}
                >
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full ${lm.badgeColor} text-white flex items-center justify-center shadow-md border-2 ${
                      isActive ? 'border-slate-900 ring-4 ring-amber-300' : 'border-white'
                    }`}
                  >
                    {renderIcon(lm.iconKey, 'w-5 h-5')}
                  </div>
                  <span
                    className={`mt-1 px-2 py-0.5 rounded-lg text-[11px] font-bold shadow-sm border whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white/95 text-slate-900 border-slate-200'
                    }`}
                  >
                    {lm.santali.split(' (')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Pills Row */}
          <div className="flex flex-wrap gap-2 pt-1">
            {LANDMARKS.map((lm) => (
              <button
                key={lm.id}
                onClick={() => handleSelect(lm)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  selected.id === lm.id
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                }`}
              >
                {lm.santali.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Landmark Detail Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 h-fit shadow-sm">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1">
                {selected.zone}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">{selected.santali}</h2>
              <div className="text-sm font-bold text-amber-700 mt-0.5">{selected.olChiki}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {selected.hindi} • {selected.english}
              </div>
            </div>
            <button
              onClick={() => handleSpeakLandmark(selected)}
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0"
              title="विवरण सुनें"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-500 mb-1">परिचय</div>
              <p className="text-slate-800 leading-relaxed">{selected.summary}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-xs font-bold text-amber-800 mb-1">सामाजिक व सांस्कृतिक भूमिका</div>
              <p className="text-slate-800 leading-relaxed">{selected.culturalRole}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800 mb-1">पर्व-विशेष महत्व</div>
              <p className="text-slate-800 leading-relaxed">{selected.seasonalHighlight}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
