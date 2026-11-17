import React, { useState, useEffect } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { useUserAuth } from '../context/UserAuthContext';
import {
  Volume2,
  Square,
  Printer,
  Copy,
  Check,
  GraduationCap,
  Sun,
  Award,
  HelpCircle
} from 'lucide-react';

interface AssemblySegment {
  id: 'prayer' | 'pledge' | 'thought' | 'gk';
  tabLabel: string;
  titleHi: string;
  santaliDev: string;
  hindiTranslation: string;
}

const ASSEMBLY_SEGMENTS: AssemblySegment[] = [
  {
    id: 'prayer',
    tabLabel: '१. प्रातः वंदना (बिनती)',
    titleHi: 'प्रभात बिनती — मारांग बुरु व जाहेर आयो प्रार्थना',
    santaliDev:
      'जोहार मारांग बुरु, जोहार जाहेर आयो, तेहेंञ सेताक् रे आले जोतो गिदरा ज्ञान आर बुद बुद्धि एमा-ले में। आलेयाक् ओल-पाड़हाव रे दाड़े एमोक में, आतो आर दिशोम रे सुलुक आर मोने रास्का दोहो काक् में। जोहार!',
    hindiTranslation:
      'हे मारांग बुरु और जाहेर माँ, प्रणाम! आज की इस सुबह में हम सभी बच्चों को ज्ञान और सद्बुद्धि प्रदान करें। हमारी पढ़ाई-लिखाई में शक्ति दें तथा हमारे गाँव व देश में शांति और सद्भाव बनाए रखें।'
  },
  {
    id: 'pledge',
    tabLabel: '२. छात्र प्रतिज्ञा (Pledge)',
    titleHi: 'संताली विद्यार्थी प्रतिज्ञा (Student Pledge)',
    santaliDev:
      'आले जोतो पाड़हाव-ओक् गिदरा किरिया-येत्-आले जे, आले दो रोज इस्कूल ले सेन-ओक्-आ, गुरू-कोवाक् काथा ले बातावाक्-आ। आलेयाक् गोगा आयो पारसी संताली देवनागरी आर ओल चिकी ले बांचाव-आ आर मान सम्मान ले दोहो-आ। जोहार!',
    hindiTranslation:
      'हम सभी विद्यार्थी यह प्रतिज्ञा करते हैं कि हम प्रतिदिन विद्यालय जाएँगे और अपने गुरुजनों का सम्मान करेंगे। हम अपनी मातृभाषा संताली (देवनागरी व ओल चिकी) की रक्षा करेंगे और समाज व देश की सेवा करेंगे।'
  },
  {
    id: 'thought',
    tabLabel: '३. आज का सुविचार',
    titleHi: 'आज का प्रेरणादायक सुविचार (Thought of the Day)',
    santaliDev:
      'ओल आर पाड़हाव दो मानवा जीविद रेयाक् सेताक् चांदो काना। ओकोय होड़ सेताक् बेड़ा रे मेहनत-ए-आ, उनी दो लाहा सेच् लाहाक्-आ। (भेंता काथा: सोगोम रास्का खोन सुलुक मोने मारांग-आ।)',
    hindiTranslation:
      'लिखना और पढ़ना मानव जीवन का प्रातःकालीन सूर्य है। जो सुबह से परिश्रम करता है, वही आगे बढ़ता है। (लोकोक्ति: दिखावटी खुशी से शांत व सच्चा मन बड़ा होता है।)'
  },
  {
    id: 'gk',
    tabLabel: '४. आज के ५ सामान्य ज्ञान प्रश्न',
    titleHi: 'प्रार्थना सभा सामान्य ज्ञान व भाषा प्रश्नोत्तरी',
    santaliDev:
      'प्रश्न १: संताली भाषा रेयाक् लिपि चेत् काना? (उत्तर: ओल चिकी आर देवनागरी)। प्रश्न २: संताली रे ‘सूर्य’ चेत् को मेताक्-आ? (उत्तर: सिन चांदो)। प्रश्न ३: हूल दिवस तिस मनावाक्-आ? (उत्तर: ३० जून)। प्रश्न ४: बोंगा-थान चेत् को मेताक्-आ? (उत्तर: जाहेर थान)। प्रश्न ५: १२ पारिस रेयाक् मित् पारिस लाय में? (उत्तर: मुरमू, सोरेन, हांस्दा, किसकू...)।',
    hindiTranslation:
      '१. संताली की लिपियाँ ओल चिकी व देवनागरी हैं। २. सूर्य को सिन चांदो कहते हैं। ३. हूल दिवस ३० जून को मनाया जाता है। ४. ग्राम देवस्थान को जाहेर थान कहते हैं। ५. १२ पारिस में मुरमू, सोरेन, हांसदा, किस्कू आदि प्रमुख हैं।'
  }
];

export const SantaliSchoolPrayerAssembly: React.FC = () => {
  const { currentUser } = useUserAuth();
  const storageKey = `hor_katha_school_assembly_${currentUser?.email || 'guest'}`;

  const [schoolName, setSchoolName] = useState('उत्क्रमित उच्च विद्यालय, संताल परगना');
  const [conductorName, setConductorName] = useState('कक्षा ८ विद्यार्थी टोली');
  const [activeId, setActiveId] = useState<AssemblySegment['id']>('prayer');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.schoolName) setSchoolName(parsed.schoolName);
        if (parsed.conductorName) setConductorName(parsed.conductorName);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const saveMeta = (nextSchool: string, nextConductor: string) => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ schoolName: nextSchool, conductorName: nextConductor })
      );
    } catch {
      // ignore
    }
  };

  const activeSegment = ASSEMBLY_SEGMENTS.find((s) => s.id === activeId) || ASSEMBLY_SEGMENTS[0];

  const speakFullAssembly = () => {
    const fullText = `जोहार! ${schoolName} प्रातःकालीन प्रार्थना सभा। संचालक: ${conductorName}। ${activeSegment.titleHi}। ${activeSegment.santaliDev}`;
    speakWithFemaleVoice(fullText, { autoDetectLanguage: true });
  };

  const handleCopy = () => {
    const payload = `${schoolName}\nप्रार्थना सभा संचालक: ${conductorName}\n\n${activeSegment.titleHi}\n\nसंताली देवनागरी:\n${activeSegment.santaliDev}\n\nओल चिकी:\n${toOlChikiAuto(
      activeSegment.santaliDev
    )}\n\nहिन्दी भावार्थ:\n${activeSegment.hindiTranslation}`;
    navigator.clipboard?.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <Sun className="w-4 h-4 text-amber-600" />
            <span>विद्यालय प्रातःकालीन प्रार्थना सभा स्टूडियो</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            संताली वंदना, छात्र प्रतिज्ञा, सुविचार व सामान्य ज्ञान बोर्ड
          </h2>
          <p className="text-xs text-slate-600">
            स्कूल और हॉस्टल की सुबह की असेंबली के लिए तैयार संताली देवनागरी, ओल चिकी और आवाज़ घोषणा किट।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={speakFullAssembly}
            className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>असेंबली वाचन सुनें</span>
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

      {/* School Meta + Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-600 block mb-1">विद्यालय / छात्रावास का नाम</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => {
                setSchoolName(e.target.value);
                saveMeta(e.target.value, conductorName);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1">आज की संचालक कक्षा / टोली</label>
            <input
              type="text"
              value={conductorName}
              onChange={(e) => {
                setConductorName(e.target.value);
                saveMeta(schoolName, e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 print:hidden">
          {ASSEMBLY_SEGMENTS.map((seg) => (
            <button
              key={seg.id}
              type="button"
              onClick={() => setActiveId(seg.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                activeId === seg.id
                  ? 'bg-amber-700 text-white border-amber-800'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {seg.tabLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Active Board View */}
      <div className="bg-white rounded-2xl border border-amber-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              {schoolName} · {new Date().toLocaleDateString('hi-IN')}
            </p>
            <h3 className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-2">
              {activeId === 'prayer' && <Sun className="w-5 h-5 text-amber-600" />}
              {activeId === 'pledge' && <GraduationCap className="w-5 h-5 text-sky-600" />}
              {activeId === 'thought' && <Award className="w-5 h-5 text-emerald-600" />}
              {activeId === 'gk' && <HelpCircle className="w-5 h-5 text-indigo-600" />}
              <span>{activeSegment.titleHi}</span>
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">संचालक: {conductorName}</span>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
              संताली देवनागरी लिपि (असेंबली वाचन पाठ)
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {activeSegment.santaliDev}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 block">
              ओल चिकी लिपि (Ol Chiki Script)
            </span>
            <p className="text-sm sm:text-base font-bold text-indigo-950 leading-relaxed">
              {toOlChikiAuto(activeSegment.santaliDev)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              हिन्दी अर्थ (अर्थ सहित)
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {activeSegment.hindiTranslation}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 print:hidden">
          <button
            type="button"
            onClick={speakFullAssembly}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>लाउडस्पीकर / माइक परीक्षण सुनें</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'कॉपी हो गया!' : 'नोटिस कॉपी करें'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>प्रार्थना बोर्ड प्रिंट (A4)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
