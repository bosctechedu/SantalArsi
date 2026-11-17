import React, { useState, useMemo } from 'react';
import { Compass, Volume2, Search, MapPin, Calculator, Mountain } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface LandClassification {
  id: string;
  nameSantaliDev: string;
  nameRoman: string;
  nameHindi: string;
  tierCategory: 'field' | 'water_elevation' | 'sacred_forest';
  elevationDescription: string;
  soilCharacteristics: string;
  suitableCrops: string;
  customaryRights: string;
}

const LAND_CLASSES: LandClassification[] = [
  {
    id: 'goda',
    nameSantaliDev: 'गोड़ा (Goda)',
    nameRoman: 'Gora / Tanr',
    nameHindi: 'ऊंची टांड़ भूमि (Highland)',
    tierCategory: 'field',
    elevationDescription: 'गाँव के ऊपरी ढलान पर स्थित पथरीली या बलुई सूखी ज़मीन, जहाँ जल ठहरता नहीं है।',
    soilCharacteristics: 'लाल-मटियाली, कंकड़युक्त छिद्रदार मिट्टी जो वर्षा के बाद तुरंत सूख जाती है।',
    suitableCrops: 'मड़ुआ (कोदो), गुंदली (बाजरा), सुरगुजा (तिलहन), अरहर व मकई।',
    customaryRights: 'पारंपरिक रूप से ग्राम वासियों के साझे गोचर एवं शुष्क कृषि का अधिकार।'
  },
  {
    id: 'baad',
    nameSantaliDev: 'बाद / बहेरा (Baad / Bahera)',
    nameRoman: 'Baad / Don',
    nameHindi: 'निचला जलमग्न धान खेत (Lowland Paddy Field)',
    tierCategory: 'field',
    elevationDescription: 'घाटी के सबसे निचले हिस्से की सीढ़ीदार भूमि जहाँ पहाड़ी ढलानों का जल स्वतः संचित होता है।',
    soilCharacteristics: 'काली-दोमट, चिकनी उपजाऊ मिट्टी जिसमें नमी महीनों तक सुरक्षित रहती है।',
    suitableCrops: 'देसी धान (करहानी, तुपु, झुमुका), चना व रबी फसलें।',
    customaryRights: 'प्रत्येक परिवार की मूल आजीविका भूमि; SPT Act के तहत गैर-हस्तांतरणीय।'
  },
  {
    id: 'bhitta',
    nameSantaliDev: 'भित्ता / बाड़ी (Bhitta)',
    nameRoman: 'Bhitta / Orak Bari',
    nameHindi: 'गृह-संलग्न बाड़ी भूमि (Homestead Garden)',
    tierCategory: 'field',
    elevationDescription: 'संताली मिट्टी के घरों (ओड़ाक्) के ठीक पीछे या आंगन से लगी बाड़-युक्त निजी भूमि।',
    soilCharacteristics: 'जैविक गोबर खाद और राख से समृद्ध अत्यधिक उर्वर नम मिट्टी।',
    suitableCrops: 'सब्जियाँ, मकई, हल्दी, अदरक, मिर्च, सरसों व पपीता।',
    customaryRights: 'परिवार की निजी संपत्ति; घरेलू उपयोग एवं पोषण संप्रभुता का केंद्र।'
  },
  {
    id: 'dadi_chuan',
    nameSantaliDev: 'डाड़ी / चुआं (Daadi / Chuan)',
    nameRoman: 'Daadi / Natural Seepage Spring',
    nameHindi: 'प्राकृतिक रिसाव कुआं व झरना',
    tierCategory: 'water_elevation',
    elevationDescription: 'पहाड़ी ढलानों के आधार पर चट्टानों से स्वतः रिसने वाला शीतल व स्वच्छ पेयजल स्रोत।',
    soilCharacteristics: 'प्राकृतिक बालू और क्वार्ट्ज पत्थरों से स्वतः छनकर निकलने वाला मिनरल युक्त जल।',
    suitableCrops: 'आसपास साग-सब्जी व पशुओं के लिए बारहों महीने शीतल पेयजल।',
    customaryRights: 'सामुदायिक पवित्र जल अधिकार; इसके पास कपड़े धोना या गंदगी फैलाना वर्जित।'
  },
  {
    id: 'gada_kachar',
    nameSantaliDev: 'गाड़ा कछार (Gada)',
    nameRoman: 'Gada / Riverbank Basin',
    nameHindi: 'नदी तट एवं कछार भूमि',
    tierCategory: 'water_elevation',
    elevationDescription: 'नदी-नालों (गाड़ा) के किनारे बाढ़ के जल से सिंचित जलोढ़ रेतीली भूमि।',
    soilCharacteristics: 'नवीन जलोढ़ बलुई-दोमट मिट्टी जिसमें उच्च नमी धारण क्षमता होती है।',
    suitableCrops: 'तरबूज, ककड़ी, खरबूज, आलू व नदी मत्स्य पालन।',
    customaryRights: 'ग्राम सभा के मल्लाह एवं नदी नौका (डोंगा) घाट अधिकार।'
  },
  {
    id: 'dhipu',
    nameSantaliDev: 'धीपु (Dhipu)',
    nameRoman: 'Dhipu / High Ridge',
    nameHindi: 'ऊँचा टीला व निगरानी कटक',
    tierCategory: 'water_elevation',
    elevationDescription: 'गाँव की सीमाओं पर उभरे प्राकृतिक टीले जो गाँव की प्राकृतिक हवा-ढाल का काम करते हैं।',
    soilCharacteristics: 'कठोर लेटराइट व मुरुम प्रस्तर संरचना।',
    suitableCrops: 'झाड़ियाँ, साल के ठूंठ, बेर और औषधीय घास।',
    customaryRights: 'ग्राम सीमा (हातु सीमाना) का प्राकृतिक ऐतिहासिक लैंडमार्क।'
  },
  {
    id: 'bir_forest',
    nameSantaliDev: 'बीर (Bir)',
    nameRoman: 'Bir / Community Forest',
    nameHindi: 'सामुदायिक ग्राम वन (Forest Area)',
    tierCategory: 'sacred_forest',
    elevationDescription: 'गाँव से लगा प्राकृतिक साल, महुआ, पलाश व असन वृक्षों का वन क्षेत्र।',
    soilCharacteristics: 'गहरे पतझड़ पत्तों के ह्यूमस से ढकी वनीय मिट्टी।',
    suitableCrops: 'महुआ फूल, साल बीज, तसर कोसा, वनौषधि व मशरूम (ओत्)।',
    customaryRights: 'सामुदायिक वन अधिकार (FRA 2006) एवं मांझी बैसी संरक्षण।'
  },
  {
    id: 'jaher_than',
    nameSantaliDev: 'जाहेर थान (Jaher Than)',
    nameRoman: 'Jaher Than / Sacred Grove',
    nameHindi: 'पवित्र देव उपवन (Sacred Grove)',
    tierCategory: 'sacred_forest',
    elevationDescription: 'गाँव के उत्तर-पूर्व में स्थित अक्षुण्ण प्राचीन साल वृक्षों का पवित्र उपवन।',
    soilCharacteristics: 'अछूता प्राकृतिक जंगल जिसमें कभी हल या कुल्हाड़ी नहीं चलती।',
    suitableCrops: 'मरांग बुरु, जाहेर एरा व मोड़ेको-तुरुयको का निवास; केवल पूजा एवं बाखेर।',
    customaryRights: 'सर्वोच्च सामुदायिक पावन स्थल; नायके बाबा द्वारा संरक्षित।'
  },
  {
    id: 'sasandiri',
    nameSantaliDev: 'सासन / ससनदीरी (Sasan)',
    nameRoman: 'Sasan / Ancestral Burial Stone',
    nameHindi: 'पूर्वज समाधि व स्मृति प्रस्तर स्थल',
    tierCategory: 'sacred_forest',
    elevationDescription: 'गाँव का वह स्थल जहाँ कुल-पूर्वजों की अस्थि विसर्जन (दिरी बिद) के बड़े शिलाखंड स्थापित होते हैं।',
    soilCharacteristics: 'घास युक्त शांत भूमि जो गाँव के प्रथम बसाने वालों (खुंटकाटी) का प्रमाण है।',
    suitableCrops: 'अस्थि कलश स्थापन व वार्षिक पूर्वज जोहार।',
    customaryRights: 'खुंटकाटी अधिकार एवं वंशावली की जीवित न्यायिक साक्ष्य।'
  }
];

export const SantaliLandTopography: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Land Area Converter State
  const [kathInput, setKathInput] = useState<number>(20);
  const [bighaResult, setBighaResult] = useState<number>(1);
  const [acreResult, setAcreResult] = useState<number>(0.33);
  const [dismilResult, setDismilResult] = useState<number>(33);

  const handleConvert = (val: number) => {
    setKathInput(val);
    const b = val / 20; // 20 Kath = 1 Bigha
    setBighaResult(Number(b.toFixed(2)));
    setAcreResult(Number((b * 0.3306).toFixed(3)));
    setDismilResult(Number((b * 33.06).toFixed(1)));
  };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return LAND_CLASSES.filter((item) => {
      const matchCat = filterCategory === 'all' || item.tierCategory === filterCategory;
      const matchText =
        !q ||
        item.nameSantaliDev.toLowerCase().includes(q) ||
        item.nameRoman.toLowerCase().includes(q) ||
        item.nameHindi.toLowerCase().includes(q) ||
        item.suitableCrops.toLowerCase().includes(q) ||
        item.soilCharacteristics.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [filterCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Mountain className="w-4 h-4" />
              <span>भूमि विज्ञान, खेत व स्थलाकृति कोष | Land &amp; Soil Topography</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              संताली भूमि, खेत व स्थलाकृति शब्दावली संदर्शिका
            </h1>
            <p className="text-sm text-slate-600">
              गोड़ा (टांड़), बाद/बहेरा (निचला धान खेत), डाड़ी (झरना), जाहेर थान और सासनदीरी भूमि का पारंपरिक वर्गीकरण एवं पैमाइश कैलकुलेटर।
            </p>
          </div>
        </div>

        {/* Traditional Land Area Converter Widget */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>पारंपरिक संताली भूमि पैमाइश कैलकुलेटर (Land Measurement Unit Converter)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
              <label className="font-bold text-slate-700 block">काठ / कट्ठा (Kath)</label>
              <input
                type="number"
                min={1}
                value={kathInput}
                onChange={(e) => handleConvert(Number(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-500">20 काठ = 1 बीघा</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="font-bold text-slate-700">बीघा (Bigha)</div>
              <div className="text-xl font-mono font-bold text-slate-900">{bighaResult}</div>
              <span className="text-[10px] text-slate-500">मानक देहाती बीघा</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="font-bold text-slate-700">एकड़ (Acre)</div>
              <div className="text-xl font-mono font-bold text-slate-900">{acreResult}</div>
              <span className="text-[10px] text-slate-500">राजस्व अभिलेख इकाई</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="font-bold text-slate-700">डिसमिल (Decimal)</div>
              <div className="text-xl font-mono font-bold text-slate-900">{dismilResult}</div>
              <span className="text-[10px] text-slate-500">1 एकड़ = 100 डिसमिल</span>
            </div>
          </div>
        </div>

        {/* Toolbar & Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto">
            {[
              { id: 'all', label: 'सभी भू-प्रकार (9)' },
              { id: 'field', label: 'खेत व कृषि भूमि' },
              { id: 'water_elevation', label: 'जल व स्थलाकृति' },
              { id: 'sacred_forest', label: 'पवित्र वन व सासन' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
                  filterCategory === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="भूमि, फसल या मिट्टी खोजें..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>

        {/* Land Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-3 hover:border-emerald-300 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.nameRoman}
                  </span>
                  <button
                    onClick={() =>
                      speakWithFemaleVoice(
                        `${item.nameSantaliDev}। ${item.nameHindi}। विवरण: ${item.elevationDescription}। उपयुक्त फसलें: ${item.suitableCrops}`,
                        { lang: 'hi-IN', rate: 0.9 }
                      )
                    }
                    className="p-1 text-slate-400 hover:text-emerald-700 rounded-lg cursor-pointer"
                    title="उच्चारण व विवरण सुनें"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {item.nameSantaliDev}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600">{item.nameHindi}</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.elevationDescription}
                </p>

                <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-800">मिट्टी:</span> {item.soilCharacteristics}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">उपयुक्त फसलें:</span> {item.suitableCrops}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">पारंपरिक अधिकार:</span> {item.customaryRights}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
