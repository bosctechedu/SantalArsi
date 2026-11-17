import React, { useState, useEffect } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { useUserAuth } from '../context/UserAuthContext';
import {
  Landmark,
  Volume2,
  Square,
  CheckSquare,
  Copy,
  Check,
  Printer,
  Search
} from 'lucide-react';

interface SchemeGuideItem {
  id: string;
  category: 'छात्रवृत्ति व शिक्षा' | 'आवास व किसान' | 'पेंशन व राशन' | 'वन व ग्राम अधिकार';
  titleDev: string;
  titleHi: string;
  benefitHi: string;
  eligibilityHi: string;
  dialogueDev: string;
  dialogueHi: string;
  docsChecklist: string[];
  officeWhere: string;
}

const SCHEMES: SchemeGuideItem[] = [
  {
    id: 'ekalyan_scholarship',
    category: 'छात्रवृत्ति व शिक्षा',
    titleDev: 'प्री-मैट्रिक आर पोस्ट-मैट्रिक छात्रवृत्ति (ई-कल्याण)',
    titleHi: 'प्री-मैट्रिक व पोस्ट-मैट्रिक छात्रवृत्ति (e-Kalyan)',
    benefitHi: 'कक्षा १ से कॉलेज/ITI/डिप्लोमा तक पढ़ रहे ST/SC/OBC छात्रों को वार्षिक शुल्क व छात्रवृत्ति सहायता।',
    eligibilityHi: 'मान्यता प्राप्त स्कूल/कॉलेज में नामांकन, आय सीमा नियम व आधार-सीडेड बैंक खाता।',
    dialogueDev: 'जोहार! इञ दो इस्कूल रेयाक् ई-कल्याण छात्रवृत्ति लागित् बोनाफाइड आर रसीद नेयाय लागीत् हेच् कानाञ।',
    dialogueHi: 'नमस्ते! मैं विद्यालय की ई-कल्याण छात्रवृत्ति के लिए बोनाफाइड प्रमाणपत्र और शुल्क रसीद लेने आया/आई हूँ।',
    docsChecklist: [
      'आधार कार्ड (मोबाइल नंबर लिंक)',
      'बैंक पासबुक (NPCI / आधार सीडेड)',
      'जाति व स्थानीय निवासी प्रमाण-पत्र',
      'अद्यतन आय प्रमाण-पत्र (अभिभावक)',
      'विद्यालय बोनाफाइड व पिछली अंक-तालिका'
    ],
    officeWhere: 'प्रज्ञा केंद्र (CSC) / विद्यालय छात्रवृत्ति डेस्क'
  },
  {
    id: 'abua_awas',
    category: 'आवास व किसान',
    titleDev: 'अबुआ आवास / ग्रामीण पक्का ओड़ाक् योजना',
    titleHi: 'अबुआ आवास / प्रधानमंत्री ग्रामीण आवास योजना',
    benefitHi: 'कच्चे या मिट्टी के घर वाले पात्र ग्रामीण परिवारों को पक्का तीन कमरों का घर निर्माण सहायता।',
    eligibilityHi: 'कच्चे मकान में निवास, पूर्व में पक्का आवास न मिला हो और ग्राम सभा प्राथमिकता सूची में नाम।',
    dialogueDev: 'जोहार! आतो रेयाक् ग्राम सभा सूची रे इञाक् ओड़ाक् निर्माण आवेदन दर्ज काक् ताम।',
    dialogueHi: 'नमस्ते! गाँव की ग्राम सभा आवास प्राथमिकता सूची में मेरा आवास आवेदन दर्ज कीजिए।',
    docsChecklist: [
      'परिवार का आधार कार्ड व राशन कार्ड',
      'मनरेगा जॉब कार्ड (MGNREGA)',
      'बैंक खाता संख्या (आधार से जुड़ा)',
      'वर्तमान कच्चे मकान का फोटो',
      'ग्राम सभा अनुशंसा / वंशावली प्रति'
    ],
    officeWhere: 'ग्राम पंचायत भवन / प्रखंड कार्यालय (BDO)'
  },
  {
    id: 'fra_patta',
    category: 'वन व ग्राम अधिकार',
    titleDev: 'वन अधिकार पट्टा (खेत-बीर पट्टा / FRA)',
    titleHi: 'व्यक्तिगत एवं सामुदायिक वन अधिकार पट्टा (FRA 2006)',
    benefitHi: 'वन भूमि पर पुश्तैनी खेती व जाहेर/चारागाह पर ग्राम सभा को कानूनी संरक्षण व पट्टा।',
    eligibilityHi: '१३ दिसंबर २००५ से पूर्व से वन भूमि पर पारंपरिक जोत या तीन पीढ़ियों का निवास प्रमाण।',
    dialogueDev: 'जोहार! आले आतो रेयाक् वन अधिकार समिति मार्फत खेत् आर जाहेर थान पट्टा लागित् दावा जामा एत्-आले।',
    dialogueHi: 'नमस्ते! हम ग्राम वन अधिकार समिति के माध्यम से खेत और जाहेर थान पट्टे का दावा जमा कर रहे हैं।',
    docsChecklist: [
      'ग्राम सभा व वन अधिकार समिति (FRC) प्रस्ताव',
      'मांझी / बुज़ुर्ग गवाहों का बयान व नक्शा',
      'खतियान / वंशावली व पुराना रसीद प्रमाण',
      'परिवार पहचान पत्र (आधार / वोटर आईडी)'
    ],
    officeWhere: 'ग्राम वन अधिकार समिति (FRC) → अनुमंडल समिति (SDLC)'
  },
  {
    id: 'pension_maiya',
    category: 'पेंशन व राशन',
    titleDev: 'सर्वजन पेंशन, विधवा आर मंईयां सम्मान सहायता',
    titleHi: 'वृद्धावस्था, विधवा, दिव्यांग एवं महिला सम्मान पेंशन',
    benefitHi: 'पात्र बुजुर्ग (५०/६०+ वर्ष), एकल महिला, दिव्यांग व महिलाओं को मासिक सीधे बैंक खाते में सहायता।',
    eligibilityHi: 'नियमानुसार आयु पूर्ण, सरकारी नौकरी या आयकर दाता न होना तथा सक्रिय बैंक खाता।',
    dialogueDev: 'जोहार! इञ दो पेंशन आवेदन रेयाक् केवाईसी आर बैंक खाता जांच काते दस्तखत कराव लागित् हेच् कानाञ।',
    dialogueHi: 'नमस्ते! मैं पेंशन आवेदन के KYC और बैंक खाते की जांच कराकर हस्ताक्षर करवाने आया/आई हूँ।',
    docsChecklist: [
      'आधार कार्ड व वोटर आईडी (आयु प्रमाण)',
      'सिंगल बैंक पासबुक प्रति',
      'पासपोर्ट साइज २ फोटो',
      'स्व-घोषणा पत्र / मुखिया या वार्ड सदस्य सत्यापन'
    ],
    officeWhere: 'पंचायत सचिवालय / अंचल एवं प्रखंड कार्यालय'
  },
  {
    id: 'ration_card',
    category: 'पेंशन व राशन',
    titleDev: 'राशन कार्ड नांवा नाम जोड़ आर ई-केवाईसी',
    titleHi: 'राशन कार्ड में नया सदस्य जोड़ व डीलर e-KYC',
    benefitHi: 'परिवार के नवजात या नए सदस्य का नाम राशन कार्ड में जुड़वाने पर प्रति सदस्य अतिरिक्त खाद्यान्न।',
    eligibilityHi: 'मौजूदा राशन कार्ड (लाल/हरा/पीला) व नए सदस्य का आधार एवं जन्म प्रमाण-पत्र।',
    dialogueDev: 'जोहार! आलेयाक् राशन कार्ड रे नांवा गिदरा रेयाक् नाम जोड़ आर अंगूठा केवाईसी लागीत् हेच् कानाले।',
    dialogueHi: 'नमस्ते! हम अपने राशन कार्ड में नए बच्चे का नाम जुड़वाने और बायोमेट्रिक KYC कराने आए हैं।',
    docsChecklist: [
      'मुख्य राशन कार्ड संख्या की प्रति',
      'नए सदस्य का आधार कार्ड / जन्म प्रमाण-पत्र',
      'परिवार के मुखिया का मोबाइल OTP',
      'डीलर e-POS मशीन से अंगूठा सत्यापन'
    ],
    officeWhere: 'जन वितरण दुकान (PDS डीलर) / BSO ब्लॉक आपूर्ति कार्यालय'
  },
  {
    id: 'pm_kisan_kcc',
    category: 'आवास व किसान',
    titleDev: 'किसान सम्मान निधि आर केसीसी खेती ऋण',
    titleHi: 'पीएम-किसान सम्मान निधि व किसान क्रेडिट कार्ड (KCC)',
    benefitHi: 'पात्र किसान परिवारों को वार्षिक ₹६,००० प्रत्यक्ष किस्त और कम ब्याज पर खाद-बीज ऋण।',
    eligibilityHi: 'कृषि भूमि वंशावली / भूमि स्वामित्व प्रमाण (LPC), e-KYC पूर्ण तथा आधार-लिंक्ड बैंक खाता।',
    dialogueDev: 'जोहार! इञाक् किसान सम्मान निधि ई-केवाईसी आर भूमि वंशावली सत्यापन कराव ताम।',
    dialogueHi: 'नमस्ते! कृपया मेरा किसान सम्मान निधि e-KYC और भूमि वंशावली सत्यापन कर दीजिए।',
    docsChecklist: [
      'खतियान / लगान रसीद / वंशावली प्रति',
      'आधार कार्ड व किसान पंजीकरण संख्या',
      'बैंक पासबुक व e-KYC रसीद',
      'हल्का कर्मचारी / मुखिया सत्यापन'
    ],
    officeWhere: 'प्रज्ञा केंद्र (CSC) / अंचल व कृषि मित्र'
  }
];

export const SantaliPanchayatSchemeGuide: React.FC = () => {
  const { currentUser } = useUserAuth();
  const storageKey = `hor_katha_scheme_docs_${currentUser?.email || 'guest'}`;

  const [categoryFilter, setCategoryFilter] = useState<string>('सभी');
  const [searchText, setSearchText] = useState('');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(SCHEMES[0].id);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setCheckedDocs(raw ? JSON.parse(raw) : {});
    } catch {
      setCheckedDocs({});
    }
  }, [storageKey]);

  const filteredSchemes = SCHEMES.filter((s) => {
    const matchCat = categoryFilter === 'सभी' || s.category === categoryFilter;
    const q = searchText.trim().toLowerCase();
    const matchQ =
      !q ||
      s.titleDev.toLowerCase().includes(q) ||
      s.titleHi.toLowerCase().includes(q) ||
      s.benefitHi.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const activeScheme =
    SCHEMES.find((s) => s.id === selectedSchemeId) || filteredSchemes[0] || SCHEMES[0];

  const toggleDoc = (schemeId: string, idx: number) => {
    const key = `${schemeId}_${idx}`;
    const next = { ...checkedDocs, [key]: !checkedDocs[key] };
    setCheckedDocs(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const readyCount = activeScheme.docsChecklist.filter(
    (_, idx) => checkedDocs[`${activeScheme.id}_${idx}`]
  ).length;

  const handleCopyChecklist = () => {
    const lines = activeScheme.docsChecklist
      .map((d, i) => `${checkedDocs[`${activeScheme.id}_${i}`] ? '[✓]' : '[ ]'} ${d}`)
      .join('\n');
    const text = `${activeScheme.titleDev} (${activeScheme.titleHi})\nकहाँ जमा करें: ${activeScheme.officeWhere}\n\nकागज़ात सूची:\n${lines}\n\nसंताली संवाद: ${activeScheme.dialogueDev}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 uppercase tracking-wider">
            <Landmark className="w-4 h-4 text-indigo-600" />
            <span>सरकारी योजना, छात्रवृत्ति व राशन-पेंशन संदर्शिका</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            ग्राम पंचायत व छात्र योजना चेकलिस्ट + संताली संवाद मदद
          </h2>
          <p className="text-xs text-slate-600">
            छात्रवृत्ति, आवास, वन पट्टा, पेंशन व राशन के जरूरी कागज़ात जांचें और ब्लॉक/प्रज्ञा केंद्र में बोलने के लिए संताली वाक्य सुनें।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() =>
              speakWithFemaleVoice(
                `${activeScheme.titleDev}। ${activeScheme.benefitHi}। संवाद: ${activeScheme.dialogueDev}`,
                { autoDetectLanguage: true }
              )
            }
            className="px-3.5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>योजना व संवाद सुनें</span>
          </button>
          <button
            type="button"
            onClick={stopSpeaking}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5" />
            <span>रोकें</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap gap-1.5">
          {['सभी', 'छात्रवृत्ति व शिक्षा', 'आवास व किसान', 'पेंशन व राशन', 'वन व ग्राम अधिकार'].map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                  categoryFilter === cat
                    ? 'bg-indigo-700 text-white border-indigo-800'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="योजना खोजें (आवास, छात्रवृत्ति)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Scheme List */}
        <div className="lg:col-span-5 space-y-2.5 print:hidden">
          {filteredSchemes.map((s) => {
            const done = s.docsChecklist.filter((_, i) => checkedDocs[`${s.id}_${i}`]).length;
            const active = activeScheme.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSchemeId(s.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-colors cursor-pointer space-y-1.5 ${
                  active
                    ? 'bg-indigo-50/70 border-indigo-400'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
                  <span className="text-indigo-700">{s.category}</span>
                  <span className="text-emerald-700 tabular-nums">
                    कागज़ात तैयार: {done}/{s.docsChecklist.length}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900">{s.titleDev}</h3>
                <p className="text-xs text-slate-600">{s.titleHi}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Scheme Detail */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              {activeScheme.category} · {activeScheme.officeWhere}
            </span>
            <h3 className="text-lg font-black text-slate-900">{activeScheme.titleDev}</h3>
            <p className="text-sm font-bold text-amber-800">{toOlChikiAuto(activeScheme.titleDev)}</p>
            <p className="text-xs text-slate-600 font-semibold">{activeScheme.titleHi}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-1">प्रमुख लाभ</strong>
              <p className="text-slate-700 leading-relaxed">{activeScheme.benefitHi}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-1">पात्रता व शर्त</strong>
              <p className="text-slate-700 leading-relaxed">{activeScheme.eligibilityHi}</p>
            </div>
          </div>

          {/* Interactive Documents Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-slate-900">
              <span>जरूरी कागज़ात की चेकलिस्ट (टिक करें)</span>
              <span className="text-emerald-700 tabular-nums">
                {readyCount} / {activeScheme.docsChecklist.length} पूर्ण
              </span>
            </div>
            <div className="space-y-1.5">
              {activeScheme.docsChecklist.map((doc, idx) => {
                const isDone = Boolean(checkedDocs[`${activeScheme.id}_${idx}`]);
                return (
                  <button
                    key={doc}
                    type="button"
                    onClick={() => toggleDoc(activeScheme.id, idx)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center gap-2.5 cursor-pointer transition-colors ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <CheckSquare
                      className={`w-4 h-4 shrink-0 ${isDone ? 'text-emerald-600' : 'text-slate-400'}`}
                    />
                    <span>{doc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Office Dialogue in Santali Devanagari + Ol Chiki */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                कार्यालय / प्रज्ञा केंद्र में बोलने का संताली वाक्य
              </span>
              <button
                type="button"
                onClick={() =>
                  speakWithFemaleVoice(`${activeScheme.dialogueDev}. ${activeScheme.dialogueHi}`, {
                    autoDetectLanguage: true
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>संवाद सुनें</span>
              </button>
            </div>
            <p className="text-sm font-black text-slate-900">{activeScheme.dialogueDev}</p>
            <p className="text-xs font-bold text-amber-800">{toOlChikiAuto(activeScheme.dialogueDev)}</p>
            <p className="text-xs text-slate-700">हिन्दी: {activeScheme.dialogueHi}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={handleCopyChecklist}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'सूची कॉपी हुई!' : 'चेकलिस्ट कॉपी करें'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>चेकलिस्ट प्रिंट करें</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
