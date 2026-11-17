import React, { useState } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  Bus,
  Volume2,
  Square,
  Copy,
  Check,
  Navigation
} from 'lucide-react';

interface TravelPhrase {
  id: string;
  category: 'बस यात्रा' | 'रेलवे स्टेशन' | 'हॉस्टल व कॉलेज' | 'डाक व कचहरी';
  santaliDev: string;
  roman: string;
  hindi: string;
  english: string;
}

const TRAVEL_PHRASES: TravelPhrase[] = [
  {
    id: 'bus1',
    category: 'बस यात्रा',
    santaliDev: 'नोवा बस दो दुमका सेच् चालाक् काना चे?',
    roman: 'Nowa bus do Dumka sech chalak kana che?',
    hindi: 'क्या यह बस दुमका की ओर जा रही है?',
    english: 'Is this bus going towards Dumka?'
  },
  {
    id: 'bus2',
    category: 'बस यात्रा',
    santaliDev: 'आलिञ लागित् बारया टिकट एम काक् मे। भाड़ा तिनाक् हुय-एना?',
    roman: 'Alinj lagit barya ticket em kak me. Bhada tinak huy-ena?',
    hindi: 'हम दोनों के लिए दो टिकट दे दीजिए। किराया कितना हुआ?',
    english: 'Please give two tickets for us. How much is the fare?'
  },
  {
    id: 'bus3',
    category: 'बस यात्रा',
    santaliDev: 'आतो मोड़ ठेन गाड़ी तेनगो ताबो मे, इञ दो नोडेञ फेड़ोक्-आ।',
    roman: 'Ato mor then gadi tengo tabo me, inj do nodenj fedok-a.',
    hindi: 'गाँव के मोड़ पर गाड़ी रोकिए, मैं यहीं उतरूँगा/उतरूँगी।',
    english: 'Please stop the bus at the village turn, I will get down here.'
  },
  {
    id: 'rail1',
    category: 'रेलवे स्टेशन',
    santaliDev: 'रांची सेन-ओक् रेलगाड़ी दो ओका प्लेटफॉर्म रे हिजुक्-आ?',
    roman: 'Ranchi sen-ok relgadi do oka platform re hijuk-a?',
    hindi: 'रांची जाने वाली ट्रेन किस प्लेटफॉर्म पर आएगी?',
    english: 'Which platform will the Ranchi train arrive on?'
  },
  {
    id: 'rail2',
    category: 'रेलवे स्टेशन',
    santaliDev: 'काउंटर खोन जनरल टिकट ओका ठेन ञामोक्-आ?',
    roman: 'Counter khon general ticket oka then nyamok-a?',
    hindi: 'काउंटर से सामान्य टिकट कहाँ मिलेगा?',
    english: 'Where can I get a general ticket from the counter?'
  },
  {
    id: 'rail3',
    category: 'रेलवे स्टेशन',
    santaliDev: 'गाड़ी दो तिनाक् बाजा रे छोड़ोक्-आ?',
    roman: 'Gadi do tinak baja re chhorok-a?',
    hindi: 'ट्रेन कितने बजे छूटेगी?',
    english: 'At what time will the train depart?'
  },
  {
    id: 'hostel1',
    category: 'हॉस्टल व कॉलेज',
    santaliDev: 'जोहार! इञ दो हॉस्टल रे नाम लिखान (एडमिशन) लागीत् हेच् कानाञ।',
    roman: 'Johar! Inj do hostel re naam likhan lagit hech kananj.',
    hindi: 'नमस्ते! मैं हॉस्टल में नामांकन (प्रवेश) के लिए आया/आई हूँ।',
    english: 'Hello! I have come for hostel admission.'
  },
  {
    id: 'hostel2',
    category: 'हॉस्टल व कॉलेज',
    santaliDev: 'आलेयाक् कॉलेज रे लाइब्रेरी आर छात्रवृत्ति फॉर्म ओका रे ञामोक्-आ?',
    roman: 'Aleyak college re library ar chhatravritti form oka re nyamok-a?',
    hindi: 'हमारे कॉलेज में पुस्तकालय और छात्रवृत्ति फॉर्म कहाँ मिलेगा?',
    english: 'Where is the library and scholarship form counter in our college?'
  },
  {
    id: 'court1',
    category: 'डाक व कचहरी',
    santaliDev: 'नोवा स्पीड पोस्ट चिठी दो बोगी ते भेजा काक् मे।',
    roman: 'Nowa speed post chithi do bogi te bheja kak me.',
    hindi: 'यह स्पीड पोस्ट पत्र सही से भेज दीजिए।',
    english: 'Please send this speed post letter properly.'
  },
  {
    id: 'court2',
    category: 'डाक व कचहरी',
    santaliDev: 'इञाक् जाति आर खतियान नकल पेपर ओका काउंटर रे रेडी-आ?',
    roman: 'Injak jati ar khatiyan nakal paper oka counter re ready-a?',
    hindi: 'मेरा जाति और खतियान नकल कागज़ किस काउंटर पर तैयार मिलेगा?',
    english: 'At which counter will my caste and khatiyan copy be ready?'
  }
];

const DESTINATIONS = ['दुमका', 'रांची', 'जमशेदपुर', 'चाईबासा', 'पाकुड़', 'साहिबगंज', 'देवघर', 'बारीपदा', 'पुरुलिया'];

export const SantaliBusRailHelpline: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'सभी' | TravelPhrase['category']>('सभी');
  const [fromPlace, setFromPlace] = useState('भोगनाडीह');
  const [toPlace, setToPlace] = useState('दुमका');
  const [passengerCount, setPassengerCount] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const countSantaliWord = ['', 'मित् होड़', 'बार होड़', 'पे होड़', 'पोन होड़', 'मोड़े होड़'][passengerCount] || `${passengerCount} होड़`;

  const customRouteSantali = `जोहार! ${fromPlace} खोन ${toPlace} सेच् सेन-ओक् लागीत् ${countSantaliWord} रेयाक् टिकट एम काक् मे।`;
  const customRouteHi = `नमस्ते! ${fromPlace} से ${toPlace} जाने के लिए ${passengerCount} सवारी का टिकट दे दीजिए।`;

  const visiblePhrases = TRAVEL_PHRASES.filter(
    (p) => activeCategory === 'सभी' || p.category === activeCategory
  );

  const copyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider">
            <Bus className="w-4 h-4 text-sky-600" />
            <span>यात्रा, बस-रेल, हॉस्टल व कचहरी संवाद पॉकेट गाइड</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            तुरंत बोलकर मदद माँगने वाले संताली यात्रा व कार्यालय कार्ड
          </h2>
          <p className="text-xs text-slate-600">
            बस कंडक्टर, रेलवे पूछताछ, कॉलेज हॉस्टल और डाकघर में १-टैप पर संताली देवनागरी व ओल चिकी संवाद सुनें।
          </p>
        </div>

        <button
          type="button"
          onClick={stopSpeaking}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Square className="w-3.5 h-3.5" />
          <span>आवाज़ रोकें</span>
        </button>
      </div>

      {/* Custom Route & Ticket Slip Builder */}
      <div className="bg-white rounded-2xl border border-sky-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-sky-600" />
            <span>१. तुरंत टिकट व रास्ता पर्ची निर्माता (Custom Ticket Helper)</span>
          </h3>
          <button
            type="button"
            onClick={() =>
              speakWithFemaleVoice(`${customRouteSantali} ${customRouteHi}`, { autoDetectLanguage: true })
            }
            className="px-3.5 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>टिकट संवाद सुनें</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-600 block mb-1">कहाँ से (खोन)</label>
            <input
              type="text"
              value={fromPlace}
              onChange={(e) => setFromPlace(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">कहाँ जाना है (सेच्)</label>
            <select
              value={toPlace}
              onChange={(e) => setToPlace(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
            >
              {DESTINATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">यात्री संख्या (सवारी)</label>
            <select
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 tabular-nums"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} यात्री
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1.5">
          <p className="text-base font-black text-slate-900">{customRouteSantali}</p>
          <p className="text-sm font-bold text-amber-800">{toOlChikiAuto(customRouteSantali)}</p>
          <p className="text-xs text-slate-700 font-medium">हिन्दी: {customRouteHi}</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {(['सभी', 'बस यात्रा', 'रेलवे स्टेशन', 'हॉस्टल व कॉलेज', 'डाक व कचहरी'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
              activeCategory === cat
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Phrase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {visiblePhrases.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between gap-3"
          >
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
                {p.category}
              </span>
              <h4 className="text-base font-black text-slate-900 leading-snug">{p.santaliDev}</h4>
              <p className="text-sm font-bold text-amber-800">{toOlChikiAuto(p.santaliDev)}</p>
              <p className="text-xs text-slate-500">Roman: {p.roman}</p>
              <p className="text-xs text-slate-800 font-semibold">हिन्दी: {p.hindi}</p>
              <p className="text-[11px] text-slate-500">English: {p.english}</p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  speakWithFemaleVoice(`${p.santaliDev}. ${p.hindi}`, { autoDetectLanguage: true })
                }
                className="flex-1 py-2 px-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>बोलकर सुनें</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  copyText(p.id, `${p.santaliDev}\n${toOlChikiAuto(p.santaliDev)}\n${p.hindi}`)
                }
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedId === p.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === p.id ? 'कॉपी' : 'कॉपी'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
