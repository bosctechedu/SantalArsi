import React, { useState } from 'react';
import { speakWithFemaleVoice } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { MapPin, Volume2, Compass, Globe, Landmark } from 'lucide-react';

interface BeltRegionNode {
  id: string;
  nameHi: string;
  nameEn: string;
  state: string;
  x: number;
  y: number;
  dialectName: string;
  sampleGreetingDev: string;
  sampleGreetingRom: string;
  dialectNote: string;
  sacredSites: string[];
  historicalFact: string;
}

const SANTHAL_BELT_NODES: BeltRegionNode[] = [
  {
    id: 'sahibganj_bhognadih',
    nameHi: 'भोगनाडीह व दामिन-ए-कोह (साहिबगंज)',
    nameEn: 'Bhognadih & Damin-i-Koh',
    state: 'झारखंड (संताल परगना)',
    x: 410,
    y: 120,
    dialectName: 'उत्तरी संताली (राजमहल–दामिन बोली)',
    sampleGreetingDev: 'जोहार गोमके! अबुआः दिशोम अबुआः राज!',
    sampleGreetingRom: 'Johar Gomke! Abuaḥ disom abuaḥ raj!',
    dialectNote: 'यहाँ शब्द स्पष्ट विराम और ऐतिहासिक महाकाव्य शैली के साथ बोले जाते हैं।',
    sacredSites: ['भोगनाडीह हुल स्मारक', 'पंचकठिया शहीद स्थल', 'बरहेट राजमहल पहाड़ी'],
    historicalFact: '30 जून 1855 को सिदो-कान्हू, चांद-भैरव और फूलो-झानो के नेतृत्व में ऐतिहासिक संथाल हुल यहीं से आरंभ हुआ।'
  },
  {
    id: 'dumka',
    nameHi: 'दुमका (संताल परगना हृदय)',
    nameEn: 'Dumka Heartland',
    state: 'झारखंड (संताल परगना)',
    x: 360,
    y: 195,
    dialectName: 'मानक उत्तरी संताली (Standard Northern)',
    sampleGreetingDev: 'सेताक् जोहार, चेत् लेका मेनाक् मेया?',
    sampleGreetingRom: 'Setak johar, chet leka menah meya?',
    dialectNote: 'आकाशवाणी, साहित्य और पाठ्यपुस्तकों में सर्वाधिक प्रचलित मानक देवनागरी-संताली रूप।',
    sacredSites: ['मसानजोर (मयूराक्षी तट)', 'हिजला मेला मैदान', 'बाबा वासुकीनाथ क्षेत्र'],
    historicalFact: '1890 से हिजला मेला और "होड़ संवाद" जैसे ऐतिहासिक संताली पत्रों का प्रमुख सांस्कृतिक केंद्र।'
  },
  {
    id: 'luguburu_giridih',
    nameHi: 'लुगुबुरु घंटाबाड़ी व मारंग बुरु (पारसनाथ)',
    nameEn: 'Luguburu & Marang Buru',
    state: 'झारखंड (बोकारो–गिरिडीह)',
    x: 245,
    y: 230,
    dialectName: 'हजारीबाग–दामोदर घाटी बोली',
    sampleGreetingDev: 'मरांग बुरु रे जोहार, लुगु बाबा आसीरवाद!',
    sampleGreetingRom: 'Marang Buru re johar, Lugu Baba asirwad!',
    dialectNote: 'धार्मिक व बिनती मंत्रों के लिए प्राचीन संस्कृतनिष्ठ व मौखिक परंपरा से समृद्ध शब्दावली।',
    sacredSites: ['लुगुबुरु घंटाबाड़ी धोरोमगढ़ (ललपनिया)', 'मारंग बुरु शिखर (पारसनाथ)', 'तेनुघाट'],
    historicalFact: 'कार्तिक पूर्णिमा पर लुगुबुरु घंटाबाड़ी में विश्व का सबसे बड़ा अंतरराष्ट्रीय संताल धर्म महासम्मेलन होता है।'
  },
  {
    id: 'kolhan_chaibasa',
    nameHi: 'कोल्हान व पूर्वी सिंहभूम (चाईबासा–घाटशिला)',
    nameEn: 'Kolhan & East Singhbhum',
    state: 'झारखंड (दक्षिणी क्षेत्र)',
    x: 280,
    y: 345,
    dialectName: 'दक्षिणी-सिंहभूम बोली (Karmali-Santal Mix)',
    sampleGreetingDev: 'जोहार दादा, ओड़ाक् सेन् तिञ चालाक् काना।',
    sampleGreetingRom: 'Johar dada, orak sen tin chalak kana.',
    dialectNote: 'हो और मुंडारी पड़ोस के कारण यहाँ स्वर-संकोच और मधुर तान देखने को मिलती है।',
    sacredSites: ['जदुगोड़ा जाहेर थान', 'घाटशिला स्वर्णरेखा तट', 'धालभूम गढ़'],
    historicalFact: 'तामाक-तुम्दाक् और बानाम लोक-संगीत तथा औद्योगिक श्रमिक-आंदोलनों की वीर भूमि।'
  },
  {
    id: 'mayurbhanj_odisha',
    nameHi: 'मयूरभंज व रायरंगपुर (ओल चिकी जन्मभूमि)',
    nameEn: 'Mayurbhanj & Rairangpur',
    state: 'ओडिशा',
    x: 335,
    y: 430,
    dialectName: 'दक्षिणी संताली (मयूरभंज मानक)',
    sampleGreetingDev: 'सागुन जोहार! ओल गुरु रघुनाथ मुर्मू आतु।',
    sampleGreetingRom: 'Sagun johar! Ol Guru Raghunath Murmu atu.',
    dialectNote: 'ओड़िया व दक्षिणी संताली प्रभाव; "सागुन" और "नापाय" जैसे शब्द अधिक प्रचलित हैं।',
    sacredSites: ['डांडबोस (गुरु गोमके जन्मस्थली)', 'रायरंगपुर', 'बारीपदा'],
    historicalFact: '1925 में गुरु गोमके पंडित रघुनाथ मुर्मू ने यहीं ओल चिकी लिपि का आविष्कार कर जन-शिक्षा क्रांति की।'
  },
  {
    id: 'purulia_bankura_wb',
    nameHi: 'पुरुलिया, बांकुड़ा व झाड़ग्राम (बंगाल)',
    nameEn: 'Purulia, Bankura & Jhargram',
    state: 'पश्चिम बंगाल (जंगलमहल)',
    x: 455,
    y: 310,
    dialectName: 'पूर्वी संताली (बंगाल–राढ़ बोली)',
    sampleGreetingDev: 'भागे गेया, अयोध्य बुरु लो बीर बैसी रे देला।',
    sampleGreetingRom: 'Bhage geya, Ayodhya Buru lo bir baisi re dela.',
    dialectNote: 'बंगाली लहजे के कारण "अ" ध्वनि अधिक गोल (ओ-कारांत) सुनाई देती है।',
    sacredSites: ['अयोध्या पहाड़ (लो बीर बैसी)', 'झाड़ग्राम', 'बांकुड़ा सुशुनिया'],
    historicalFact: 'अयोध्या बुरु की वार्षिक सेंदरा और लो बीर बैसी जन-अदालत सदियों से प्रसिद्ध है।'
  },
  {
    id: 'assam_tea_belt',
    nameHi: 'कोकराझाड़, तेजपुर व चाय बागान बेल्ट',
    nameEn: 'Assam Tea Belt',
    state: 'असम',
    x: 615,
    y: 120,
    dialectName: 'प्रवासी असम संताली बोली',
    sampleGreetingDev: 'सैंगेल जोहार! सानाम बोयहा को सुखी ताहेन पे।',
    sampleGreetingRom: 'Sengel johar! Sanam boyha ko sukhi tahen pe.',
    dialectNote: '19वीं सदी में झारखंड-बंगाल से गए संताल परिवारों की संरक्षित प्राचीन शब्दावली असम में आज भी जीवंत है।',
    sacredSites: ['कोकराझाड़ सामुदायिक केंद्र', 'सोणितपुर–तेजपुर बस्तियाँ'],
    historicalFact: 'आसाम के लाखों टी-ट्राइब संताल भाइयों ने अपने पारंपरिक बाहा, सोहराय और बापला गीतों को सहेजकर रखा है।'
  }
];

export const SantaliBeltAtlas: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(SANTHAL_BELT_NODES[0].id);
  const activeNode = SANTHAL_BELT_NODES.find((n) => n.id === selectedId) || SANTHAL_BELT_NODES[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold">
          <Compass className="w-4 h-4 text-amber-700" />
          <span>सांस्कृतिक भूगोल</span>
          <span aria-hidden="true">·</span>
          <span>झारखंड · ओडिशा · बंगाल · असम</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          संताल बेल्ट इंटरैक्टिव सांस्कृतिक व बोली एटलस
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          नक्शे पर किसी भी प्रमुख केंद्र पर क्लिक करें — उस क्षेत्र के पावन तीर्थ, हुल इतिहास और संताली बोली के क्षेत्रीय उच्चारण का अंतर सुनें।
        </p>
      </div>

      {/* Interactive Split: Map Canvas (7 cols) + Region Detail Card (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Map Canvas */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-sky-700" />
              <span>क्लिक करें: 7 प्रमुख संताल सांस्कृतिक केंद्र</span>
            </span>
            <span>पूर्वी भारत व असम कॉरिडोर</span>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 overflow-x-auto">
            <svg
              viewBox="0 0 720 500"
              className="w-full h-auto min-w-[520px]"
              role="img"
              aria-label="Santhal Belt Interactive Map"
            >
              {/* Subtle Geographic Grid */}
              <defs>
                <pattern id="atlasGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="720" height="500" rx="16" fill="url(#atlasGrid)" />

              {/* Stylized Regional Zones */}
              <path
                d="M 180 140 Q 290 70 460 110 L 495 275 Q 430 355 310 390 L 200 330 Z"
                fill="#fef3c7"
                fillOpacity="0.65"
                stroke="#d97706"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />
              <text x="275" y="165" fontSize="13" fontWeight="800" fill="#92400e">
                झारखंड (संताल परगना व छोटानागपुर)
              </text>

              <path
                d="M 435 235 Q 535 235 555 345 L 440 395 L 385 320 Z"
                fill="#e0f2fe"
                fillOpacity="0.7"
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text x="455" y="270" fontSize="12" fontWeight="700" fill="#075985">
                पश्चिम बंगाल (राढ़)
              </text>

              <path
                d="M 245 385 L 425 385 L 405 475 L 255 465 Z"
                fill="#dcfce7"
                fillOpacity="0.7"
                stroke="#16a34a"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text x="295" y="458" fontSize="12" fontWeight="700" fill="#166534">
                ओडिशा (मयूरभंज)
              </text>

              <path
                d="M 525 70 L 685 65 L 680 175 L 535 165 Z"
                fill="#fce7f3"
                fillOpacity="0.7"
                stroke="#db2777"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text x="560" y="92" fontSize="12" fontWeight="700" fill="#9d174d">
                असम (चाय बेल्ट)
              </text>

              {/* Cultural Migration Corridor Line */}
              <path
                d="M 245 230 L 360 195 L 410 120 L 615 120"
                fill="none"
                stroke="#b45309"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.55"
              />
              <path
                d="M 245 230 L 280 345 L 335 430 L 455 310 L 360 195"
                fill="none"
                stroke="#0369a1"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.5"
              />

              {/* Clickable Nodes */}
              {SANTHAL_BELT_NODES.map((node) => {
                const isSelected = node.id === activeNode.id;
                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedId(node.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 20 : 13}
                      fill={isSelected ? '#b45309' : '#ffffff'}
                      stroke={isSelected ? '#78350f' : '#0f172a'}
                      strokeWidth={isSelected ? 3 : 2}
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="800"
                      fill={isSelected ? '#ffffff' : '#0f172a'}
                    >
                      {node.nameHi.slice(0, 2)}
                    </text>
                    <rect
                      x={node.x - 68}
                      y={node.y + 22}
                      width="136"
                      height="20"
                      rx="6"
                      fill="#ffffff"
                      stroke={isSelected ? '#b45309' : '#cbd5e1'}
                    />
                    <text
                      x={node.x}
                      y={node.y + 36}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="700"
                      fill="#0f172a"
                    >
                      {node.nameHi.split('(')[0].trim().slice(0, 20)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Region Selector Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {SANTHAL_BELT_NODES.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelectedId(n.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  n.id === activeNode.id
                    ? 'bg-amber-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {n.nameHi.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Active Region Detail Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold">
                <MapPin className="w-4 h-4" />
                <span>{activeNode.state}</span>
                <span aria-hidden="true">·</span>
                <span>{activeNode.nameEn}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">{activeNode.nameHi}</h2>
            </div>

            {/* Regional Dialect Sample */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-amber-900">{activeNode.dialectName}</span>
                <button
                  type="button"
                  onClick={() =>
                    speakWithFemaleVoice(activeNode.sampleGreetingDev, { autoDetectLanguage: true })
                  }
                  className="px-3 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>बोली सुनें</span>
                </button>
              </div>
              <p className="text-sm font-black text-slate-900">{activeNode.sampleGreetingDev}</p>
              <p className="text-sm font-bold text-amber-800">
                {toOlChikiAuto(activeNode.sampleGreetingDev)}
              </p>
              <p className="text-xs text-slate-600">{activeNode.sampleGreetingRom}</p>
              <p className="text-xs text-slate-700 pt-1 border-t border-amber-200/60">
                {activeNode.dialectNote}
              </p>
            </div>

            {/* Sacred Sites */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-sky-700" />
                <span>प्रमुख पावन तीर्थ व सांस्कृतिक स्थल</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeNode.sacredSites.map((site) => (
                  <li
                    key={site}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold"
                  >
                    {site}
                  </li>
                ))}
              </ul>
            </div>

            {/* Historical Fact */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-900">ऐतिहासिक महत्व</div>
              <p className="text-xs text-slate-700 leading-relaxed">{activeNode.historicalFact}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              speakWithFemaleVoice(
                `${activeNode.nameHi}. ${activeNode.historicalFact}`,
                { autoDetectLanguage: true }
              )
            }
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>इस क्षेत्र का पूरा परिचय सुनें</span>
          </button>
        </div>
      </div>
    </div>
  );
};
