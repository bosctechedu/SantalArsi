import React, { useState, useMemo, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toDevanagariAuto, toOlChikiAuto } from '../utils/olChikiTranslit';
import { SantaliWord } from '../types';
import {
  FileText,
  Upload,
  Volume2,
  Square,
  Copy,
  Check,
  Download,
  Printer,
  Bookmark,
  BookOpen,
  ArrowRightLeft,
  Search
} from 'lucide-react';

interface SampleDocument {
  id: string;
  title: string;
  authorNote: string;
  text: string;
}

const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'doc_hul',
    title: 'संथाल हुल 1855 — भोगनाडीह की हुंकार',
    authorNote: 'ऐतिहासिक पाठ · संताली देवनागरी + हिन्दी',
    text: `सिरजोन रे संताल दिशोम रेयाक् नाम दो आडी मानोत गेया। 30 जून 1855 रे साहिबगंज रेयाक् भोगनाडीह आतु रे सिदो-कान्हू, चांद-भैरव आर फूलो-झानो तिकिन कोवाक् अगुवाइ ते दस हजार खोन बाड़ती होड़ को जावरा लेत्-आ।
उनकुवाक् नारा ताहेकाना— "अबुआः दिशोम, अबुआः राज!"। नोवा हुल दो अपने हासा, जमी आर आत्मसम्मान बांचाव लागीत् ताहेकाना।
आज भी भोगनाडीह और हुल दिवस पर सारा समाज अपने पूर्वजों को जोहार और नमन करता है।`
  },
  {
    id: 'doc_sohrai',
    title: 'सोहराय महापर्व गीत व सांस्कृतिक निबंध',
    authorNote: 'लोकगीत व परंपरा · 5 दिवसीय पर्व',
    text: `सोहराय दो संताल समाज रेयाक् जोतो खोन मारांग पोरोब काना। नोवा दो कार्तिक बांय पूस चान्दो रे धांन गेत् चाबा तायोम मानाक्-आ।
पहिले हिलोक उम्म (स्नान), दोसर हिलोक गोहाइल पूजा (बोंगा), तेसर हिलोक खूंटाव, आर तायोम ते जाले आर हाकू काटकोम सेरेञ एनेच हुयुक्-आ।
आतु रे ओड़ाक् को माटी रंग ते सजाव हुयुक्-आ आर गोरु-डांगरा को सुनूम-सिंदूर ते आसीरवाद एमाक् कोवा।`
  },
  {
    id: 'doc_jaher',
    title: 'जाहेर थान आर प्रकृति रक्षा (प्रकृति दर्शन)',
    authorNote: 'पर्यावरण व आध्यात्मिक पाठ',
    text: `सानाम संताल आतु रे मित् टान् पवित्र उपवन ताहेना, ओका दो जाहेर थान मेताक्-आ। नोंडे सखुआ (सरजोम) दारे आर मातकोम (महुआ) दारे बूटा रे मरांग बुरु, जाहेर एरा आर मोड़े को-तुरूई को को पूजा कोवा।
बाहा पोरोब जोखोन नायके बाबा सखुआ बाहा को राकाप-आ आर चेँड़े-चुपड़ी सानाव को आसीरवाद एमाकोवा।
दारे बांचाव दो संताल संस्कृति रेयाक् मूल मंत्र काना।`
  }
];

function extractReadableTextFromPdfBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const raw = new TextDecoder('latin1').decode(bytes);
  const chunks: string[] = [];

  // Extract parenthesized PDF literal strings inside BT ... ET text blocks
  const matches = raw.match(/\(([^()\\]{2,200})\)/g);
  if (matches && matches.length > 0) {
    for (const m of matches) {
      const inner = m.slice(1, -1).replace(/\\n/g, ' ').replace(/\\r/g, ' ').trim();
      // Filter PDF internal operator/font metadata strings
      if (
        inner.length >= 2 &&
        !/^(PDF|Type|Font|Encoding|MediaBox|Filter|FlateDecode|Creator|Producer)/i.test(inner) &&
        /[a-zA-Z\u0900-\u097F\u1C50-\u1C7F]/.test(inner)
      ) {
        chunks.push(inner);
      }
    }
  }

  const joined = chunks.join(' ').replace(/\s+/g, ' ').trim();
  if (joined.length >= 40) {
    // Reflow into clean sentences/paragraphs
    return joined
      .replace(/([।.!?])\s+/g, '$1\n\n')
      .trim();
  }
  return '';
}

export const SantaliDocumentBookReader: React.FC = () => {
  const { words } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [docTitle, setDocTitle] = useState(SAMPLE_DOCUMENTS[0].title);
  const [rawText, setRawText] = useState(SAMPLE_DOCUMENTS[0].text);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [activeParaIndex, setActiveParaIndex] = useState<number>(0);
  const [bookmarkedParas, setBookmarkedParas] = useState<Record<number, boolean>>({});
  const [showDevanagariLines, setShowDevanagariLines] = useState(true);
  const [showOlChikiLines, setShowOlChikiLines] = useState(true);
  const [copiedMode, setCopiedMode] = useState<string | null>(null);
  const [tappedWord, setTappedWord] = useState<{
    token: string;
    devanagari: string;
    olChiki: string;
    dictMatch?: SantaliWord;
  } | null>(null);

  const paragraphs = useMemo(() => {
    return rawText
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [rawText]);

  const devanagariConvertedFull = useMemo(() => {
    return paragraphs.map((p) => toDevanagariAuto(p)).join('\n\n');
  }, [paragraphs]);

  const olChikiConvertedFull = useMemo(() => {
    return paragraphs.map((p) => toOlChikiAuto(p)).join('\n\n');
  }, [paragraphs]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadNotice(null);
    const lowerName = file.name.toLowerCase();

    try {
      if (lowerName.endsWith('.pdf')) {
        const buffer = await file.arrayBuffer();
        const extracted = extractReadableTextFromPdfBuffer(buffer);
        if (extracted) {
          setDocTitle(file.name.replace(/\.pdf$/i, ''));
          setRawText(extracted);
          setActiveParaIndex(0);
          setBookmarkedParas({});
          setUploadNotice(`"${file.name}" से टेक्स्ट सफलतापूर्वक लोड हो गया!`);
        } else {
          setUploadNotice(
            `"${file.name}" एक स्कैन/इमेज-आधारित या संपीड़ित (Compressed) PDF है। इसका फोटो/स्क्रीनशॉट लेकर "अनुवादक → फोटो OCR स्कैनर" में अपलोड करें या टेक्स्ट यहाँ पेस्ट करें।`
          );
        }
      } else {
        const text = await file.text();
        const clean = text.trim();
        if (!clean) {
          setUploadNotice('चुनी गई फ़ाइल में कोई पठनीय टेक्स्ट नहीं मिला।');
          return;
        }
        setDocTitle(file.name.replace(/\.[^.]+$/, ''));
        setRawText(clean);
        setActiveParaIndex(0);
        setBookmarkedParas({});
        setUploadNotice(`"${file.name}" सफलतापूर्वक लोड हो गया (${clean.length.toLocaleString()} अक्षर)।`);
      }
    } catch {
      setUploadNotice('फ़ाइल पढ़ने में त्रुटि हुई। कृपया .txt, .md या टेक्स्ट-आधारित .pdf आज़माएं।');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTapWord = (rawToken: string) => {
    const clean = rawToken.replace(/[।॥,.;:!?'"()[\]—\-]/g, '').trim();
    if (!clean) return;
    const devToken = toDevanagariAuto(clean);
    const lower = clean.toLowerCase();
    const devLower = devToken.toLowerCase();
    const match = words.find(
      (w) =>
        w.wordDevanagari.toLowerCase() === lower ||
        w.wordDevanagari.toLowerCase() === devLower ||
        w.wordRoman.toLowerCase() === lower ||
        w.wordDevanagari.includes(clean) ||
        w.wordDevanagari.includes(devToken) ||
        w.meaningHindi.toLowerCase().includes(lower)
    );
    setTappedWord({
      token: clean,
      devanagari: devToken,
      olChiki: toOlChikiAuto(clean),
      dictMatch: match
    });
    speakWithFemaleVoice(clean, { autoDetectLanguage: true });
  };

  const handleCopyAll = (kind: 'original' | 'devanagari' | 'olchiki' | 'bilingual') => {
    let payload = rawText;
    if (kind === 'devanagari') {
      payload = devanagariConvertedFull;
    } else if (kind === 'olchiki') {
      payload = olChikiConvertedFull;
    } else if (kind === 'bilingual') {
      payload = paragraphs
        .map(
          (p, idx) =>
            `${idx + 1}. [देवनागरी]: ${toDevanagariAuto(p)}\n   [ओल चिकी]: ${toOlChikiAuto(p)}`
        )
        .join('\n\n');
    }
    navigator.clipboard.writeText(payload).catch(() => {});
    setCopiedMode(kind);
    setTimeout(() => setCopiedMode(null), 2000);
  };

  const handleDownloadTxt = () => {
    const content =
      `${toDevanagariAuto(docTitle)}\n${'='.repeat(40)}\n\n` +
      paragraphs
        .map(
          (p, idx) =>
            `[अनुच्छेद ${idx + 1}]\nसंताली (देवनागरी): ${toDevanagariAuto(p)}\nओल चिकी: ${toOlChikiAuto(p)}`
        )
        .join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.replace(/[^a-zA-Z0-9\u0900-\u097F_-]/g, '_').slice(0, 40) || 'santali-notes'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-sky-800 font-semibold">
              <FileText className="w-4 h-4 text-sky-700" />
              <span>दस्तावेज़ व बुक ऑडियो रीडर</span>
              <span aria-hidden="true">·</span>
              <span>PDF / TXT अपलोड</span>
              <span aria-hidden="true">·</span>
              <span>बल्क ओल चिकी कनवर्टर</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              दस्तावेज़ ऑडियो रीडर व द्वि-लिपि बुक स्टूडियो
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              कोई भी संताली/हिन्दी पुस्तक, गीत या लेख (.txt, .md, .pdf) अपलोड करें या पेस्ट करें — अनुच्छेद-वार सुनें, किसी भी शब्द पर टैप कर अर्थ देखें और एक क्लिक में ओल चिकी नोट्स डाउनलोड करें।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.csv,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>फ़ाइल अपलोड (PDF / TXT)</span>
            </button>
            <button
              type="button"
              onClick={() => speakWithFemaleVoice(rawText, { autoDetectLanguage: true })}
              className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>पूरा पाठ सुनें</span>
            </button>
            <button
              type="button"
              onClick={stopSpeaking}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>रोकें</span>
            </button>
          </div>
        </div>

        {uploadNotice && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-950">
            {uploadNotice}
          </div>
        )}

        {/* Quick Sample Books */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500">तैयार पाठ चुनें:</span>
          {SAMPLE_DOCUMENTS.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => {
                setDocTitle(doc.title);
                setRawText(doc.text);
                setActiveParaIndex(0);
                setBookmarkedParas({});
                setUploadNotice(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                docTitle === doc.title
                  ? 'bg-sky-700 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {doc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Editor & Batch Export (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-sky-700" />
              <span>पाठ संपादक व बल्क कनवर्टर</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {paragraphs.length} अनुच्छेद · {rawText.length} अक्षर
            </span>
          </div>

          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            placeholder="अध्याय / दस्तावेज़ का शीर्षक..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={10}
            placeholder="संताली गीत, कविता, निबंध या PDF से निकाला गया पाठ यहाँ पेस्ट करें..."
            className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRawText(toDevanagariAuto(rawText))}
              className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>देवनागरी लिपि में बदलें</span>
            </button>
            <button
              type="button"
              onClick={() => handleCopyAll('devanagari')}
              className="px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedMode === 'devanagari' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>देवनागरी कॉपी</span>
            </button>
            <button
              type="button"
              onClick={() => handleCopyAll('olchiki')}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedMode === 'olchiki' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>ओल चिकी कॉपी</span>
            </button>
            <button
              type="button"
              onClick={() => handleCopyAll('bilingual')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedMode === 'bilingual' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>द्वि-लिपि कॉपी</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>नोट्स (.TXT)</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट / PDF</span>
            </button>
          </div>
        </div>

        {/* Right: Interactive Paragraph Reader + Tap-Word Lookup (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>{docTitle || 'अध्ययन पाठ'}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                किसी भी शब्द पर टैप करें → तुरंत अर्थ, संताली देवनागरी, ओल चिकी व उच्चारण देखें
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDevanagariLines}
                  onChange={(e) => setShowDevanagariLines(e.target.checked)}
                  className="accent-sky-700 w-4 h-4 cursor-pointer"
                />
                <span>संताली देवनागरी लिपि</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOlChikiLines}
                  onChange={(e) => setShowOlChikiLines(e.target.checked)}
                  className="accent-amber-700 w-4 h-4 cursor-pointer"
                />
                <span>ओल चिकी (ᱚᱞ ᱪᱤᱠᱤ)</span>
              </label>
            </div>
          </div>

          {/* Tapped Word Instant Lookup Card */}
          {tappedWord && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-sm font-black text-slate-900">
                  <Search className="w-4 h-4 text-amber-700" />
                  <span>{tappedWord.token}</span>
                  {tappedWord.devanagari !== tappedWord.token && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-sky-900">देवनागरी: {tappedWord.devanagari}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-800">{tappedWord.olChiki}</span>
                </div>
                {tappedWord.dictMatch ? (
                  <p className="text-xs text-slate-700">
                    <strong>अर्थ:</strong> {tappedWord.dictMatch.meaningHindi} ({tappedWord.dictMatch.meaningEnglish}) ·{' '}
                    <span className="text-slate-500">{tappedWord.dictMatch.wordRoman}</span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-600">
                    सीधा ओल चिकी रूपांतरण व उच्चारण तैयार है (शब्दकोश में सटीक प्रविष्टि उपलब्ध नहीं)।
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => speakWithFemaleVoice(tappedWord.token, { autoDetectLanguage: true })}
                className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>सुनें</span>
              </button>
            </div>
          )}

          {/* Paragraphs List */}
          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {paragraphs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl">
                बाईं ओर पाठ लिखें या ऊपर से कोई फ़ाइल अपलोड करें।
              </div>
            ) : (
              paragraphs.map((para, idx) => {
                const isActive = idx === activeParaIndex;
                const isMarked = Boolean(bookmarkedParas[idx]);
                const tokens = para.split(/(\s+)/);
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveParaIndex(idx)}
                    className={`p-4 rounded-2xl border transition-colors space-y-2 ${
                      isActive
                        ? 'bg-sky-50/70 border-sky-300'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold tabular-nums">अनुच्छेद {idx + 1}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookmarkedParas((prev) => ({ ...prev, [idx]: !prev[idx] }));
                          }}
                          className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                            isMarked
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                          title="बुकमार्क करें"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveParaIndex(idx);
                            speakWithFemaleVoice(para, { autoDetectLanguage: true });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>सुनें</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Tappable Words */}
                    <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-medium">
                      {tokens.map((tok, tIdx) =>
                        /^\s+$/.test(tok) ? (
                          <span key={tIdx}>{tok}</span>
                        ) : (
                          <button
                            key={tIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTapWord(tok);
                            }}
                            className="hover:bg-amber-200/70 hover:text-amber-950 rounded px-0.5 transition-colors cursor-pointer inline"
                          >
                            {tok}
                          </button>
                        )
                      )}
                    </p>

                    {showDevanagariLines && toDevanagariAuto(para) !== para && (
                      <p className="text-sm text-sky-950 bg-sky-50/80 px-3 py-2 rounded-xl border border-sky-200/80 leading-relaxed font-semibold">
                        <span className="text-[10px] uppercase tracking-wider text-sky-800 font-bold block mb-0.5">
                          संताली (देवनागरी लिपि)
                        </span>
                        {toDevanagariAuto(para)}
                      </p>
                    )}

                    {showOlChikiLines && (
                      <p className="text-sm text-amber-900 bg-white/80 px-3 py-2 rounded-xl border border-amber-200/70 leading-relaxed font-semibold">
                        <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold block mb-0.5">
                          ओल चिकी लिपि (ᱚᱞ ᱪᱤᱠᱤ)
                        </span>
                        {toOlChikiAuto(para)}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
