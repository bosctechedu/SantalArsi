import React, { useState, useMemo, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useUserAuth } from '../context/UserAuthContext';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toDevanagariAuto, toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  FileText,
  Volume2,
  Square,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  Trash2
} from 'lucide-react';

const ESSAY_TEMPLATES = [
  {
    id: 'baha_essay',
    label: 'बाहा पर्व निबंध',
    title: 'बाहा परब आर सिरजोन दुलाड़ (बाहा पर्व व प्रकृति प्रेम)',
    body: 'बाहा परब दो संताल समाज रेयाक् आड़ी मारंग आर सोनोत परब काना। फागुन चांदो रे जखन सारजोम दारे रे नावा बाहा फुटाक्-आ, उनरे जाहेर थान रे नायके बाबा दो बोंगा बुरु या। जोतो होड़ दो रस्का ते दोंग सेरेञ आर एनेच आबो।'
  },
  {
    id: 'leave_app',
    label: 'अवकाश आवेदन पत्र',
    title: 'छुट्टी लागिच् नेहोर साकाम (अवकाश आवेदन)',
    body: 'सेवा रे, मानोतान माचेत् गोमके। जोहार! इञ दो आम विद्यालय रेयाक् छात्र कानाञ। होला खोन रुआ मेनाक् तिञ ते तेहेञ आर गापा विद्यालय बाञ हिजुक् दाड़ेयाक्-आ। दया काते बार माहा रेयाक् छुट्टी एम कातिञ में। सराहाव!'
  },
  {
    id: 'village_note',
    label: 'अतु ग्राम संदेश',
    title: 'आले अतु (हमारा गाँव व एकता)',
    body: 'आले अतु रे दो जोतो होड़ मित् ते सुलुक ते ले ताहेना। सेताक् रे जाहेर थान सेच् दाक् दुलाड़ आर आयुप् रे अखड़ा रे सेरेञ हुयुक्-आ। बोयहा-मिसि को ताहेन रे अतु रे दाड़े मेनाक्-आ।'
  }
];

export const SantaliSmartWriter: React.FC = () => {
  const { words } = useAdmin();
  const { currentUser } = useUserAuth();

  const storageKey = currentUser?.email
    ? `hor_katha_smart_writer_v1_${currentUser.email.toLowerCase()}`
    : 'hor_katha_smart_writer_v1_guest';

  const [title, setTitle] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved).title || ESSAY_TEMPLATES[0].title;
    } catch {
      // ignore
    }
    return ESSAY_TEMPLATES[0].title;
  });

  const [content, setContent] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved).content || ESSAY_TEMPLATES[0].body;
    } catch {
      // ignore
    }
    return ESSAY_TEMPLATES[0].body;
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ title, content }));
    } catch {
      // ignore
    }
  }, [title, content, storageKey]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  // Extract last typed word token for live dictionary autocomplete
  const lastToken = useMemo(() => {
    const parts = content.trimEnd().split(/\s+/);
    const tail = parts[parts.length - 1] || '';
    // Only suggest if user didn't just press space
    if (/\s$/.test(content)) return '';
    return tail.replace(/[।,!?"'()]/g, '').trim();
  }, [content]);

  const suggestions = useMemo(() => {
    if (!lastToken || lastToken.length < 1) return [];
    const q = lastToken.toLowerCase();
    const matches = [];
    for (let i = 0; i < words.length && matches.length < 8; i++) {
      const w = words[i];
      if (
        w.wordDevanagari.toLowerCase().includes(q) ||
        w.wordRoman.toLowerCase().startsWith(q) ||
        w.meaningHindi.toLowerCase().includes(q)
      ) {
        matches.push(w);
      }
    }
    return matches;
  }, [lastToken, words]);

  const insertSuggestedWord = (wordDevanagari: string) => {
    if (!lastToken) {
      setContent((prev) => `${prev}${wordDevanagari} `);
      return;
    }
    const idx = content.lastIndexOf(lastToken);
    if (idx >= 0) {
      const next = content.slice(0, idx) + wordDevanagari + ' ';
      setContent(next);
    } else {
      setContent((prev) => `${prev} ${wordDevanagari} `);
    }
  };

  const devanagariTitle = useMemo(() => toDevanagariAuto(title), [title]);
  const devanagariBody = useMemo(() => toDevanagariAuto(content), [content]);
  const olChikiTitle = useMemo(() => toOlChikiAuto(devanagariTitle), [devanagariTitle]);
  const olChikiBody = useMemo(() => toOlChikiAuto(devanagariBody), [devanagariBody]);

  const stats = useMemo(() => {
    const trimmed = content.trim();
    const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
    const charCount = content.length;
    const sentenceCount = trimmed ? trimmed.split(/[।.!?]+/).filter((s) => s.trim()).length : 0;
    return { wordCount, charCount, sentenceCount };
  }, [content]);

  const handleDownloadTxt = () => {
    const body = `${devanagariTitle}\n${olChikiTitle}\n\n--- संताली देवनागरी पाठ ---\n${devanagariBody}\n\n--- ओल चिकी (Ol Chiki) ---\n${olChikiBody}\n`;
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `santali-lekh-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyBilingual = () => {
    const text = `${devanagariTitle}\n${olChikiTitle}\n\n${devanagariBody}\n\n${olChikiBody}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConvertEditorToDevanagari = () => {
    setTitle((prev) => toDevanagariAuto(prev));
    setContent((prev) => toDevanagariAuto(prev));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-semibold text-sky-800">
            लाइव शब्दकोश सुझाव · देवनागरी + ओल चिकी सिंक
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            स्मार्ट संताली लेखन व निबंध संपादक (Autocomplete Writer)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            टाइप करते समय शब्दकोश से स्वतः संताली शब्द-सुझाव पाएं, साथ-साथ ओल चिकी रूप देखें, बोलकर प्रूफ़रीड करें व प्रिंट/डाउनलोड करें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => speakWithFemaleVoice(`${title}। ${content}`, { autoDetectLanguage: true })}
            className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>प्रूफ़रीड सुनें</span>
          </button>
          <button
            onClick={() => stopSpeaking()}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <Square className="w-3.5 h-3.5" />
            <span>रोकें</span>
          </button>
          <button
            onClick={handleCopyBilingual}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'कॉपी हुआ' : 'द्वि-लिपि कॉपी'}</span>
          </button>
          <button
            onClick={handleDownloadTxt}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.TXT डाउनलोड</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>प्रिंट / PDF</span>
          </button>
        </div>
      </div>

      {/* Starter Templates */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-700">तैयार प्रारूप चुनें:</span>
          {ESSAY_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => {
                setTitle(tpl.title);
                setContent(tpl.body);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-slate-800 font-semibold whitespace-nowrap cursor-pointer"
            >
              {tpl.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleConvertEditorToDevanagari}
            className="px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-semibold whitespace-nowrap cursor-pointer"
          >
            रोमन / ओल चिकी → देवनागरी बदलें
          </button>
          <button
            onClick={() => {
              setTitle('');
              setContent('');
            }}
            className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>खाली पृष्ठ</span>
          </button>
        </div>
      </div>

      {/* Two-Column Editor & Live Ol Chiki Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 print:hidden">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">शीर्षक (Title)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="निबंध, पत्र या नोट का शीर्षक लिखें..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">संताली / हिन्दी लेखन क्षेत्र</label>
              <span className="text-xs text-slate-500 tabular-nums">
                {stats.wordCount} शब्द · {stats.sentenceCount} वाक्य · {stats.charCount} अक्षर
              </span>
            </div>
            <textarea
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="संताली या हिन्दी में लिखना शुरू करें — जैसे 'दाक्', 'जोहार', 'अतु', 'होड़', 'पानी'..."
              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Live Autocomplete Suggestion Strip */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>
                शब्दकोश लाइव सुझाव {lastToken ? `("${lastToken}" के आधार पर)` : '(कोई शब्द टाइप करें)'}
              </span>
            </p>
            {suggestions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => insertSuggestedWord(w.wordDevanagari)}
                    className="px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-left text-xs transition cursor-pointer"
                  >
                    <span className="font-bold text-slate-900">{w.wordDevanagari}</span>
                    <span className="text-amber-800 ml-1.5 font-semibold">{toOlChikiAuto(w.wordDevanagari)}</span>
                    <span className="text-slate-600 ml-1.5">· {w.meaningHindi.split(',')[0]}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                जैसे ही आप किसी शब्द के शुरुआती अक्षर टाइप करेंगे, 50,000+ शब्दकोश से जुड़े संताली शब्द यहाँ क्लिक करके डालने के लिए दिखेंगे।
              </p>
            )}
          </div>
        </div>

        {/* Synchronized Ol Chiki & Print Preview */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>जीवंत ओल चिकी व प्रिंट पूर्वावलोकन</span>
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1.5">
              <p className="text-base font-bold text-slate-900">{devanagariTitle || 'बिना शीर्षक'}</p>
              <p className="text-lg font-bold text-amber-900">{olChikiTitle || '—'}</p>
            </div>

            <div className="space-y-3 text-sm leading-relaxed">
              <div>
                <p className="text-xs font-bold text-sky-800 mb-1">संताली देवनागरी पाठ (देवनागरी लिपि)</p>
                <p className="text-slate-900 whitespace-pre-wrap">{devanagariBody || 'लेखन क्षेत्र खाली है।'}</p>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-amber-800 mb-1">ओल चिकी लिपि (ᱚᱞ ᱪᱤᱠᱤ)</p>
                <p className="text-amber-950 font-semibold whitespace-pre-wrap leading-loose">
                  {olChikiBody || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
