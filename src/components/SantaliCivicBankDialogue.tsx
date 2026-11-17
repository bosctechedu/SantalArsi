import React, { useState } from 'react';
import { Landmark, Volume2, Copy, Check } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface CivicPhrase {
  id: string;
  role: 'नागरिक / ग्राहक' | 'अधिकारी / कर्मी';
  santaliDev: string;
  santaliRoman: string;
  hindi: string;
  english: string;
}

interface CivicDomain {
  id: 'bank' | 'post' | 'block' | 'court';
  label: string;
  title: string;
  dialogues: CivicPhrase[];
}

const CIVIC_DOMAINS: CivicDomain[] = [
  {
    id: 'bank',
    label: '🏦 बैंक सेवा (Bank)',
    title: 'बैंक खाता, पासबुक व केवाईसी संवाद',
    dialogues: [
      {
        id: 'b1',
        role: 'नागरिक / ग्राहक',
        santaliDev: 'जोहार गोमके, इञ नावा बैंक खाता खुलवाव सानाञ काना।',
        santaliRoman: 'Johar gomke, in nawa bank khata khulwaw sanan kana.',
        hindi: 'नमस्कार महोदय, मैं नया बैंक खाता खुलवाना चाहता हूँ।',
        english: 'Greetings sir, I would like to open a new bank account.'
      },
      {
        id: 'b2',
        role: 'अधिकारी / कर्मी',
        santaliDev: 'दया काते आमआक् आधार कार्ड आर पैन कार्ड एमोक् मे।',
        santaliRoman: 'Daya kate amak Aadhaar card ar PAN card emok me.',
        hindi: 'कृपया अपना आधार कार्ड और पैन कार्ड दीजिए।',
        english: 'Please provide your Aadhaar card and PAN card.'
      },
      {
        id: 'b3',
        role: 'नागरिक / ग्राहक',
        santaliDev: 'पासबुक रे ताका को प्रिंट काते एमोक पे।',
        santaliRoman: 'Passbook re taka ko print kate emok pe.',
        hindi: 'पासबुक में राशि का विवरण प्रिंट कर दीजिए।',
        english: 'Please update and print the passbook entries.'
      }
    ]
  },
  {
    id: 'post',
    label: '📮 डाकघर (Post Office)',
    title: 'पार्सल, स्पीड पोस्ट व मनी ऑर्डर संवाद',
    dialogues: [
      {
        id: 'p1',
        role: 'नागरिक / ग्राहक',
        santaliDev: 'इञ नोवा चिठी स्पीड पोस्ट ते कोल सानाञ काना।',
        santaliRoman: 'In nowa chithi speed post te kol sanan kana.',
        hindi: 'मैं यह पत्र स्पीड पोस्ट से भेजना चाहता हूँ।',
        english: 'I want to send this letter via Speed Post.'
      },
      {
        id: 'p2',
        role: 'अधिकारी / कर्मी',
        santaliDev: 'पिन कोड आर पाता ठीक ते ओल काते एमोक् मे।',
        santaliRoman: 'Pin code ar pata thik te ol kate emok me.',
        hindi: 'पिन कोड और पूरा पता सही से लिखकर दीजिए।',
        english: 'Please write the PIN code and full address clearly.'
      }
    ]
  },
  {
    id: 'block',
    label: '🏛️ प्रखंड / पंचायत (Block)',
    title: 'जाति, आवासीय, राशन व मनरेगा संवाद',
    dialogues: [
      {
        id: 'bl1',
        role: 'नागरिक / ग्राहक',
        santaliDev: 'इञ आवासीय आर जाति प्रमाण-पत्र लागीत् आवेदान एमोक् कानाञ।',
        santaliRoman: 'In awasiya ar jati praman-patra lagit awedan emok kanan.',
        hindi: 'मैं आवासीय और जाति प्रमाण-पत्र के लिए आवेदन दे रहा हूँ।',
        english: 'I am submitting an application for residence and caste certificate.'
      },
      {
        id: 'bl2',
        role: 'अधिकारी / कर्मी',
        santaliDev: 'मांझी हाड़ाम आर ग्राम सभा रेनाक सिफ़ारिश कागज दोहो मे।',
        santaliRoman: 'Majhi haram ar Gram Sabha renak sifarish kagaj doho me.',
        hindi: 'मांझी हाड़ाम और ग्राम सभा की अनुशंसा प्रति संलग्न करें।',
        english: 'Please attach the Majhi Haram and Gram Sabha recommendation letter.'
      }
    ]
  },
  {
    id: 'court',
    label: '⚖️ तहसील / कचहरी (Court)',
    title: 'भूमि रसीद, खतियान व विधिक सहायता संवाद',
    dialogues: [
      {
        id: 'c1',
        role: 'नागरिक / ग्राहक',
        santaliDev: 'आलेयाक् खतियान आर ज़मीन रसीद रे सुधार लाकती काना।',
        santaliRoman: 'Aleyak khatiyan ar jamin rasid re sudhar lakti kana.',
        hindi: 'हमारे खतियान और भूमि रसीद में सुधार आवश्यक है।',
        english: 'Correction is required in our land Khatiyan and rent receipt.'
      },
      {
        id: 'c2',
        role: 'अधिकारी / कर्मी',
        santaliDev: 'वंशावली आर पुराने दाग-खाता संख्या जमा मे।',
        santaliRoman: 'Vanshawali ar purane dag-khata sankhya jama me.',
        hindi: 'वंशावली और पुराना दाग-खाता नंबर जमा कीजिए।',
        english: 'Please submit the genealogy chart and old plot/khata number.'
      }
    ]
  }
];

export const SantaliCivicBankDialogue: React.FC = () => {
  const [domainId, setDomainId] = useState<'bank' | 'post' | 'block' | 'court'>('bank');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeDomain = CIVIC_DOMAINS.find((d) => d.id === domainId) || CIVIC_DOMAINS[0];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800">
            <Landmark className="w-4 h-4" />
            <span>जन-सेवा व प्रशासनिक संवाद सहायता</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            बैंक, डाकघर, प्रखंड व कचहरी संवाद किट (Civic Dialogue Kit)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            सरकारी कार्यालयों, बैंक, डाकघर और तहसील में संताली ↔ हिन्दी ↔ अंग्रेज़ी बोलचाल व दस्तावेज़ संवाद एक क्लिक में सुनें।
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {CIVIC_DOMAINS.map((dom) => (
            <button
              key={dom.id}
              onClick={() => setDomainId(dom.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                domainId === dom.id
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {dom.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">{activeDomain.title}</h2>
            <button
              onClick={() =>
                speakWithFemaleVoice(
                  activeDomain.dialogues.map((d) => `${d.santaliDev}। ${d.hindi}`).join('। '),
                  { autoDetectLanguage: true }
                )
              }
              className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>पूरा संवाद सुनें</span>
            </button>
          </div>

          <div className="space-y-3">
            {activeDomain.dialogues.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                      item.role === 'नागरिक / ग्राहक'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-sky-100 text-sky-900'
                    }`}
                  >
                    {item.role}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        speakWithFemaleVoice(`${item.santaliDev}। ${item.hindi}। ${item.english}`, {
                          autoDetectLanguage: true
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-slate-300 text-slate-900 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>सुनें</span>
                    </button>
                    <button
                      onClick={() => handleCopy(item.id, `${item.santaliDev}\n${item.hindi}`)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === item.id ? 'कॉपी' : 'कॉपी'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-base font-bold text-amber-950">{item.santaliDev}</div>
                <div className="text-xs font-mono text-slate-500">{item.santaliRoman}</div>
                <div className="text-sm font-semibold text-slate-800">{item.hindi}</div>
                <div className="text-xs text-slate-500 italic">{item.english}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
