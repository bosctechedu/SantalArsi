import React, { useState } from 'react';
import { Scale, ShieldCheck, Volume2, BookOpen, Landmark, FileText } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface LegalRightSection {
  id: string;
  actName: string;
  sectionBadge: string;
  titleDev: string;
  hindiTitle: string;
  keyProvision: string;
  santaliSummary: string;
  practicalExample: string;
}

const LEGAL_RIGHTS: LegalRightSection[] = [
  {
    id: 'spt_sec20',
    actName: 'संथाल परगना काश्तकारी अधिनियम (SPT Act 1949)',
    sectionBadge: 'धारा २० (Section 20)',
    titleDev: 'आदिवासी हासा बां बिक्री (भूमि संरक्षण कानून)',
    hindiTitle: 'रैयती भूमि के हस्तांतरण पर पूर्ण प्रतिबंध',
    keyProvision: 'संथाल परगना (दुमका, जामताड़ा, देवघर, गोड्डा, साहिबगंज, पाकुड़) में आदिवासी रैयत की जमीन की बिक्री, दान या गैर-कानूनी हस्तांतरण पूर्णतः अवैध है।',
    santaliSummary: 'संताल परगना रे रायोत कोवाः हासा दो गैर-कानूनी ते बां अखरिंग दारेयाक् आ; नेनाः रक्षा दो धारा २० ते मीत् कानूनी कवच काना।',
    practicalExample: 'यदि किसी आदिवासी किसान की जमीन पर सादा कागज या फर्जी तरीके से कब्जा किया जाए, तो अंचल अधिकारी/एसडीओ (SDO) धारा २० के तहत जमीन वापस दिलाने हेतु बाध्य हैं।'
  },
  {
    id: 'pesa_1996',
    actName: 'पेसा अधिनियम (PESA Act 1996)',
    sectionBadge: 'धारा ४ (ग्राम सभा की सर्वोच्च शक्ति)',
    titleDev: 'आतु बैसी आर कुलही दुरुप राः कानूनी अधिकार',
    hindiTitle: '५वीं अनुसूची क्षेत्रों में ग्राम सभा स्वशासन',
    keyProvision: 'लघु वनोपज (महुआ, साल पत्ता, चिरौंजी, बाबुई घास), लघु खनिज खदानों, भूमि अधिग्रहण से पूर्व अनिवार्य सहमति (Prior Consultation) व स्थानीय हाट बाजार का नियंत्रण ग्राम सभा के पास होता है।',
    santaliSummary: 'जाहेर-गाढ़ा, दारे-सकाम आर वीर राः लाहू-जोनोज़ उपर दो ग्राम सभा (आतु बैसी) गे असली मालिक काना।',
    practicalExample: 'गांव में कोई भी सरकारी योजना, जल-संरचना या वनोपज संग्रहण बिना ग्राम सभा की खुली बैठक के प्रस्ताव के लागू नहीं हो सकता।'
  },
  {
    id: 'fra_2006',
    actName: 'वनाधिकार कानून (Forest Rights Act 2006)',
    sectionBadge: 'व्यक्तिगत व सामुदायिक वन पट्टा',
    titleDev: 'बीर-बुरु आर जाहेर थान राः वन अधिकार पट्टा',
    hindiTitle: 'वन भूमि, चारागाह और पवित्र देवस्थल संरक्षण',
    keyProvision: 'पीढ़ियों से जंगल पर आश्रित आदिवासी परिवारों को कृषि व आवास भूमि (IFR) तथा पूरे ग्राम समुदाय को जाहेर थान, मांजही थान, ससानदीरी व वनोपज संग्रहण (CFR) का वैधानिक अधिकार।',
    santaliSummary: 'मांझी थान, जाहेर थान आर सासानदीरी राः सामुदायिक वन पट्टा दो हापड़ाम विरासत बचावाः अडी जाड़ी काना।',
    practicalExample: 'ग्राम सभा अपनी वन अधिकार समिति (FRC) के माध्यम से अपने पारंपरिक देवस्थान और सासानदीरी भूमि का सामुदायिक पट्टा (CFR) प्राप्त कर सकती है।'
  },
  {
    id: 'fifth_schedule',
    actName: 'भारतीय संविधान की पाँचवीं अनुसूची',
    sectionBadge: 'अनुच्छेद २४४(१)',
    titleDev: 'जनजातीय परामर्शदात्री परिषद (TAC) व राज्यपाल संरक्षण',
    hindiTitle: 'अनुसूचित क्षेत्रों का विशेष संवैधानिक प्रशासन',
    keyProvision: 'राज्यपाल को यह संवैधानिक शक्ति है कि वे ऐसे किसी भी सामान्य कानून को अनुसूचित क्षेत्रों में लागू होने से रोक सकते हैं या संशोधित कर सकते हैं जो आदिवासी भूमि या परंपरा के विरुद्ध हो।',
    santaliSummary: 'संविधान राः ५वीं अनुसूची दो अबोवाः जल, जंगल, हासा आर माझी-परगना परंपरा राः सबसे मारंग रक्षा कवच काना।',
    practicalExample: 'ग्रामीण स्तर पर पारंपरिक मांझी शासन और लोक-न्याय प्रणाली को संवैधानिक संरक्षण प्रदान करने का आधार ५वीं अनुसूची ही है।'
  }
];

export const SantaliSptPesaRights: React.FC = () => {
  const [selectedRight, setSelectedRight] = useState<LegalRightSection>(LEGAL_RIGHTS[0]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-sky-50 via-white to-emerald-50 border border-sky-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Scale className="w-4 h-4" />
              <span>संवैधानिक व सामुदायिक अधिकार गाइड | SPT Act, PESA &amp; Gram Sabha Rights</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              SPT एक्ट, PESA कानून व ग्राम सभा अधिकार संदर्शिका
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              जल, जंगल, जमीन की सुरक्षा हेतु धारा २०, पेसा कानून, वनाधिकार (FRA) और ५वीं अनुसूची का सरल ज्ञान।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${selectedRight.actName}, ${selectedRight.sectionBadge}। ${selectedRight.hindiTitle}। ${selectedRight.keyProvision}`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white border border-sky-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>कानूनी अधिकार सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-2.5">
          {LEGAL_RIGHTS.map(right => (
            <button
              key={right.id}
              onClick={() => setSelectedRight(right)}
              className={`w-full text-left p-4 border transition-all ${
                selectedRight.id === right.id
                  ? 'bg-sky-50 border-sky-400 shadow-lg'
                  : 'bg-white border-stone-200 hover:border-sky-200'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider font-bold text-sky-700">{right.sectionBadge}</span>
              <h3 className="text-sm font-bold text-amber-950 mt-1">{right.actName}</h3>
              <p className="text-xs text-stone-600 mt-1">{right.hindiTitle}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white border-2 border-sky-200 p-6 space-y-5 shadow-sm">
            <div className="border-b border-stone-200 pb-4">
              <span className="inline-block bg-sky-100 text-sky-700 border border-sky-200 px-2.5 py-0.5 text-xs font-bold mb-2">
                {selectedRight.actName} · {selectedRight.sectionBadge}
              </span>
              <h2 className="text-xl font-bold text-amber-950">{selectedRight.titleDev}</h2>
              <p className="text-sm text-sky-700 mt-0.5">{selectedRight.hindiTitle}</p>
            </div>

            <div className="bg-stone-50 border border-amber-200 p-4">
              <span className="text-[11px] uppercase tracking-wider text-amber-700 font-bold block mb-1">
                संताली सार (Santali Devanagari):
              </span>
              <p className="text-base font-bold text-amber-950">{selectedRight.santaliSummary}</p>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-4">
              <span className="text-[11px] uppercase tracking-wider text-sky-700 font-bold block mb-1">
                प्रमुख वैधानिक प्रावधान (Key Provision):
              </span>
              <p className="text-sm text-stone-900 leading-relaxed">{selectedRight.keyProvision}</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4">
              <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-bold block mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> व्यावहारिक उपयोग (Gram Sabha Application):
              </span>
              <p className="text-xs text-stone-900 leading-relaxed">{selectedRight.practicalExample}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
