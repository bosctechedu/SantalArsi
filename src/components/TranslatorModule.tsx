import React, { useState, useRef } from 'react';
import { TranslatorMode } from '../types';
import { TRANSLATION_DATABASE } from '../data/santaliData';
import { useAdmin } from '../context/AdminContext';
import { speakWithFemaleVoice } from '../utils/speech';
import { toDevanagariAuto, toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  Languages,
  ArrowRightLeft,
  Volume2,
  Copy,
  Check,
  Share2,
  Trash2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Send,
  RotateCcw,
  Globe,
  Camera,
  Loader2,
  X
} from 'lucide-react';

interface TranslatorModuleProps {
  initialText?: string;
  compact?: boolean;
}

export const TranslatorModule: React.FC<TranslatorModuleProps> = ({
  initialText = '',
  compact = false
}) => {
  const { words } = useAdmin();
  const [mode, setMode] = useState<TranslatorMode>('santali_roman_to_hindi');
  const [inputText, setInputText] = useState(initialText || 'Johar, am celed menama?');
  const [translatedText, setTranslatedText] = useState('नमस्ते / प्रणाम, आप कैसे हैं?');
  const [secondaryText, setSecondaryText] = useState('Roman Santali: Johar, am celed menama?');
  const [santaliDevText, setSantaliDevText] = useState('जोहार, आम चेलेद मेनामा?');
  const [copied, setCopied] = useState(false);
  const [copiedDev, setCopiedDev] = useState(false);
  const [copiedOlChiki, setCopiedOlChiki] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  // Image OCR Scanner State (Dynamic Tesseract.js)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [ocrRunning, setOcrRunning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrNotice, setOcrNotice] = useState<string | null>(null);
  const [ocrPreviewUrl, setOcrPreviewUrl] = useState<string | null>(null);

  const isReversed =
    mode === 'hindi_to_santali_roman' ||
    mode === 'hindi_to_santali_dev' ||
    mode === 'english_to_santali' ||
    mode === 'english_to_hindi';

  const quickPresets = {
    santali_roman_to_hindi: ['Johar', 'Am celed menama', 'Sarhao', 'Dular', 'Bonga', 'Dak'],
    santali_dev_to_hindi: ['जोहार', 'आम चेलेद मेनामा', 'सारहाव', 'दुलार', 'बोंगा', 'दाक'],
    santali_to_english: ['Johar', 'Am celed menama', 'Sarhao', 'Dular', 'Bonga', 'Dak'],
    hindi_to_english: ['नमस्ते', 'आप कैसे हैं?', 'धन्यवाद', 'प्रेम / प्यार', 'ईश्वर', 'धरती'],
    hindi_to_santali_roman: ['नमस्ते', 'धन्यवाद', 'आप कैसे हैं?', 'प्यार', 'भगवान'],
    hindi_to_santali_dev: ['नमस्ते', 'धन्यवाद', 'आप कैसे हैं?', 'प्यार', 'भगवान'],
    english_to_santali: ['Hello', 'How are you', 'Thank you', 'Love', 'God', 'Water'],
    english_to_hindi: ['Hello', 'How are you', 'Thank you', 'Love', 'God', 'Water'],
    custom: ['Johar', 'नमस्ते', 'Hello', 'Water']
  }[mode] || ['Johar', 'Sarhao'];

  const handleModeChange = (newMode: TranslatorMode) => {
    setMode(newMode);
    if (newMode === 'santali_roman_to_hindi') {
      setInputText('Johar, am celed menama?');
      setTranslatedText('नमस्ते / प्रणाम, आप कैसे हैं?');
      setSecondaryText('Roman Santali: Johar, am celed menama?');
      setSantaliDevText('जोहार, आम चेलेद मेनामा?');
    } else if (newMode === 'santali_dev_to_hindi') {
      setInputText('जोहार, आम चेलेद मेनामा?');
      setTranslatedText('नमस्ते / प्रणाम, आप कैसे हैं?');
      setSecondaryText('Roman: Johar, am celed menama?');
      setSantaliDevText('जोहार, आम चेलेद मेनामा?');
    } else if (newMode === 'santali_to_english') {
      setInputText('Johar, am celed menama?');
      setTranslatedText('Hello, how are you? (Greetings)');
      setSecondaryText('Santali: Johar, am celed menama?');
      setSantaliDevText('जोहार, आम चेलेद मेनामा?');
    } else if (newMode === 'hindi_to_english') {
      setInputText('नमस्ते, आप कैसे हैं?');
      setTranslatedText('Hello, how are you? (Greetings)');
      setSecondaryText('Santali: Johar, am celed menama?');
      setSantaliDevText('जोहार, आम चेलेद मेनामा?');
    } else if (newMode === 'hindi_to_santali_dev') {
      setInputText('नमस्ते, आप कैसे हैं?');
      setTranslatedText('जोहार, आम चेलेद मेनामा?');
      setSecondaryText('Roman Santali: Johar, am celed menama?');
      setSantaliDevText('जोहार, आम चेलेद मेनामा?');
    }
  };

  const handleReverseTranslation = () => {
    let nextMode: TranslatorMode = 'santali_roman_to_hindi';
    if (mode === 'santali_roman_to_hindi') nextMode = 'hindi_to_santali_roman';
    else if (mode === 'hindi_to_santali_roman') nextMode = 'santali_roman_to_hindi';
    else if (mode === 'santali_dev_to_hindi') nextMode = 'hindi_to_santali_dev';
    else if (mode === 'hindi_to_santali_dev') nextMode = 'santali_dev_to_hindi';
    else if (mode === 'santali_to_english') nextMode = 'english_to_santali';
    else if (mode === 'english_to_santali') nextMode = 'santali_to_english';
    else if (mode === 'hindi_to_english') nextMode = 'english_to_hindi';
    else if (mode === 'english_to_hindi') nextMode = 'hindi_to_english';

    setMode(nextMode);
    const oldInput = inputText;
    const oldTranslated = translatedText;
    setInputText(oldTranslated);
    setTranslatedText(oldInput);
  };

  const handleTranslate = (overrideText?: string) => {
    setIsTranslating(true);
    const sourceRaw = typeof overrideText === 'string' ? overrideText : inputText;
    const normalizedInput = /[\u1C50-\u1C7F]/.test(sourceRaw) ? toDevanagariAuto(sourceRaw) : sourceRaw;
    setTimeout(() => {
      const q = normalizedInput.toLowerCase().trim();
      if (!q) {
        setIsTranslating(false);
        return;
      }

      // 1. Exact/substring match in sentence TRANSLATION_DATABASE
      const match = TRANSLATION_DATABASE.find((item) => {
        if (mode === 'santali_roman_to_hindi' || mode === 'santali_to_english') {
          return (
            q === item.santaliRoman.toLowerCase() ||
            q.includes(item.santaliRoman.toLowerCase()) ||
            item.santaliRoman.toLowerCase().includes(q) ||
            q === item.santaliDevanagari
          );
        }
        if (mode === 'santali_dev_to_hindi') {
          return q === item.santaliDevanagari || q.includes(item.santaliDevanagari) || item.santaliDevanagari.includes(q);
        }
        if (mode === 'hindi_to_english' || mode === 'hindi_to_santali_roman' || mode === 'hindi_to_santali_dev') {
          return item.hindi.toLowerCase().includes(q) || q.includes(item.hindi.split('/')[0].trim().toLowerCase());
        }
        if (mode === 'english_to_hindi' || mode === 'english_to_santali') {
          return item.english.toLowerCase().includes(q) || q.includes(item.english.toLowerCase().split('/')[0].trim());
        }
        return false;
      });

      if (match) {
        setSantaliDevText(match.santaliDevanagari);
        if (mode === 'santali_roman_to_hindi') {
          setTranslatedText(match.hindi);
          setSecondaryText(`English: ${match.english} · Devanagari: ${match.santaliDevanagari}`);
        } else if (mode === 'santali_dev_to_hindi') {
          setTranslatedText(match.hindi);
          setSecondaryText(`Roman Santali: ${match.santaliRoman} · English: ${match.english}`);
        } else if (mode === 'santali_to_english') {
          setTranslatedText(match.english);
          setSecondaryText(`Hindi: ${match.hindi} · Devanagari: ${match.santaliDevanagari}`);
        } else if (mode === 'hindi_to_english') {
          setTranslatedText(match.english);
          setSecondaryText(`Roman Santali: ${match.santaliRoman} · Devanagari: ${match.santaliDevanagari}`);
        } else if (mode === 'hindi_to_santali_roman') {
          setTranslatedText(match.santaliRoman);
          setSecondaryText(`Devanagari: ${match.santaliDevanagari} · English: ${match.english}`);
        } else if (mode === 'hindi_to_santali_dev') {
          setTranslatedText(match.santaliDevanagari);
          setSecondaryText(`Roman Santali: ${match.santaliRoman} · English: ${match.english}`);
        } else if (mode === 'english_to_santali') {
          setTranslatedText(match.santaliRoman);
          setSecondaryText(`Hindi: ${match.hindi} · Devanagari: ${match.santaliDevanagari}`);
        } else if (mode === 'english_to_hindi') {
          setTranslatedText(match.hindi);
          setSecondaryText(`Roman Santali: ${match.santaliRoman} · Devanagari: ${match.santaliDevanagari}`);
        }
        setIsTranslating(false);
        return;
      }

      // 2. Direct & token-by-token lookup across the 50,000+ dictionary words
      const tokens = q.replace(/[?!.,।]/g, ' ').split(/\s+/).filter(Boolean);
      const findWord = (tok: string) => {
        for (let i = 0; i < words.length; i++) {
          const w = words[i];
          if (mode === 'santali_roman_to_hindi' || mode === 'santali_to_english') {
            if (
              w.wordRoman.toLowerCase() === tok ||
              w.wordRoman.toLowerCase().split('/')[0].trim() === tok ||
              w.wordDevanagari === tok
            ) {
              return w;
            }
          } else if (mode === 'santali_dev_to_hindi') {
            if (w.wordDevanagari === tok || w.wordDevanagari.split('/')[0].trim() === tok) return w;
          } else if (mode === 'hindi_to_english' || mode === 'hindi_to_santali_roman' || mode === 'hindi_to_santali_dev') {
            if (w.meaningHindi.toLowerCase().split(/[,·/]/).some((p) => p.trim() === tok)) return w;
          } else if (mode === 'english_to_hindi' || mode === 'english_to_santali') {
            if (w.meaningEnglish.toLowerCase().split(/[,·/]/).some((p) => p.trim() === tok)) return w;
          }
        }
        return null;
      };

      const singleMatch = tokens.length === 1 ? findWord(tokens[0]) : null;
      if (singleMatch) {
        setSantaliDevText(toDevanagariAuto(singleMatch.wordDevanagari || singleMatch.wordRoman));
        if (mode === 'santali_roman_to_hindi' || mode === 'santali_dev_to_hindi') {
          setTranslatedText(singleMatch.meaningHindi);
          setSecondaryText(`English: ${singleMatch.meaningEnglish} · Devanagari: ${singleMatch.wordDevanagari}`);
        } else if (mode === 'santali_to_english' || mode === 'hindi_to_english') {
          setTranslatedText(singleMatch.meaningEnglish);
          setSecondaryText(`Hindi: ${singleMatch.meaningHindi} · Santali: ${singleMatch.wordDevanagari} (${singleMatch.wordRoman})`);
        } else if (mode === 'hindi_to_santali_roman' || mode === 'english_to_santali') {
          setTranslatedText(singleMatch.wordRoman);
          setSecondaryText(`Devanagari: ${singleMatch.wordDevanagari} · Hindi: ${singleMatch.meaningHindi}`);
        } else if (mode === 'hindi_to_santali_dev') {
          setTranslatedText(singleMatch.wordDevanagari);
          setSecondaryText(`Roman: ${singleMatch.wordRoman} · English: ${singleMatch.meaningEnglish}`);
        } else {
          setTranslatedText(singleMatch.meaningHindi);
          setSecondaryText(`Santali: ${singleMatch.wordDevanagari} (${singleMatch.wordRoman})`);
        }
        setIsTranslating(false);
        return;
      }

      if (tokens.length > 1) {
        let hitCount = 0;
        const devParts: string[] = [];
        const outParts = tokens.map((t) => {
          const hit = findWord(t);
          if (!hit) {
            devParts.push(toDevanagariAuto(t));
            return t;
          }
          hitCount++;
          devParts.push(toDevanagariAuto(hit.wordDevanagari || hit.wordRoman));
          if (mode === 'santali_roman_to_hindi' || mode === 'santali_dev_to_hindi' || mode === 'english_to_hindi') {
            return hit.meaningHindi.split(/[,·]/)[0].trim();
          }
          if (mode === 'santali_to_english' || mode === 'hindi_to_english') {
            return hit.meaningEnglish.split(/[,·]/)[0].trim();
          }
          if (mode === 'hindi_to_santali_dev') {
            return hit.wordDevanagari.split('/')[0].trim();
          }
          return hit.wordRoman.split('/')[0].trim();
        });

        if (hitCount > 0) {
          setSantaliDevText(devParts.join(' '));
          setTranslatedText(outParts.join(' '));
          setSecondaryText(`ऑफ़लाइन शब्दकोश आधारित अनुवाद (${hitCount}/${tokens.length} शब्द मिलान)`);
          setIsTranslating(false);
          return;
        }
      }

      // 3. Safe informational fallback with automatic Santali Devanagari transliteration
      const fallbackDev = toDevanagariAuto(sourceRaw.trim());
      setSantaliDevText(fallbackDev);
      setTranslatedText(`"${sourceRaw.trim()}" (शब्दकोश में सटीक वाक्य नहीं मिला — नीचे देवनागरी/ओल चिकी व Google Translate देखें)`);
      setSecondaryText('सुझाव: छोटे वाक्य या एक शब्द टाइप करें जैसे Johar, Dak, Sarhao, Orak, Baha, Ul');
      setIsTranslating(false);
    }, 180);
  };

  const handleSpeak = (text: string, lang = 'hi-IN') => {
    speakWithFemaleVoice(text, { lang, rate: 0.88 });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText + '\n' + secondaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageOcrUpload = async (file: File) => {
    if (!file) return;
    setOcrNotice(null);
    setOcrRunning(true);
    setOcrProgress(5);
    const objectUrl = URL.createObjectURL(file);
    setOcrPreviewUrl(objectUrl);

    try {
      const Tesseract = await import('tesseract.js');
      const result = await Tesseract.recognize(file, 'hin+eng', {
        logger: (m: any) => {
          if (m?.status === 'recognizing text' && typeof m.progress === 'number') {
            setOcrProgress(Math.max(10, Math.round(m.progress * 100)));
          }
        }
      });
      const extracted = (result?.data?.text || '').replace(/\s+/g, ' ').trim();
      if (extracted) {
        setInputText(extracted);
        setOcrNotice(`फ़ोटो से पाठ पढ़ा गया (${extracted.length} अक्षर) — नीचे अनुवाद देखें!`);
        setOcrRunning(false);
        setOcrProgress(100);
        handleTranslate(extracted);
      } else {
        setOcrNotice('फ़ोटो में स्पष्ट पाठ नहीं मिला। कृपया साफ़ रोशनी वाली तस्वीर अपलोड करें।');
        setOcrRunning(false);
      }
    } catch (err) {
      console.error('OCR scan error:', err);
      setOcrNotice('फ़ोटो स्कैन करने में त्रुटि आई। कृपया साफ़ PNG/JPG तस्वीर चुनें।');
      setOcrRunning(false);
    }
  };

  const santaliDevanagariPreview =
    santaliDevText ||
    toDevanagariAuto(
      mode === 'santali_roman_to_hindi' || mode === 'santali_dev_to_hindi' || mode === 'santali_to_english'
        ? inputText
        : translatedText
    );

  const olChikiPreview = toOlChikiAuto(santaliDevanagariPreview || inputText);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden ${compact ? 'p-3' : 'p-6'}`}>
      {/* Header with Title & Reverse Swap Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Languages className="w-4 h-4 text-rose-600" />
            <span>Santali, Hindi &amp; English Translator</span>
          </h2>
          <p className="text-xs text-slate-500">
            Bidirectional translation supporting Santali Devanagari (देवनागरी लिपि), Ol Chiki, Roman, Hindi &amp; English
          </p>
        </div>

        {/* Prominent Reverse Translation Toggle */}
        <button
          onClick={handleReverseTranslation}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 rounded-xl text-xs font-bold transition-all shadow-2xs hover:scale-102 cursor-pointer"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-rose-600" />
          <span>Reverse Direction (उल्टा अनुवाद)</span>
        </button>
      </div>

      {/* 4 Translation Modes Bar with Directional Display */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => handleModeChange(isReversed ? 'hindi_to_santali_roman' : 'santali_roman_to_hindi')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center border cursor-pointer ${
            mode === 'santali_roman_to_hindi' || mode === 'hindi_to_santali_roman'
              ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-2xs ring-2 ring-rose-400/20'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="block text-[10px] text-slate-400 font-normal">
            {mode === 'hindi_to_santali_roman' ? 'Reverse Mode' : 'Mode 1'}
          </span>
          {mode === 'hindi_to_santali_roman' ? 'Hindi → Santali (R)' : 'Santali (R) → Hindi'}
        </button>

        <button
          onClick={() => handleModeChange(isReversed ? 'hindi_to_santali_dev' : 'santali_dev_to_hindi')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center border cursor-pointer ${
            mode === 'santali_dev_to_hindi' || mode === 'hindi_to_santali_dev'
              ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-2xs ring-2 ring-rose-400/20'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="block text-[10px] text-slate-400 font-normal">
            {mode === 'hindi_to_santali_dev' ? 'Reverse Mode' : 'Mode 2'}
          </span>
          {mode === 'hindi_to_santali_dev' ? 'Hindi → Santali (Dev)' : 'Santali (Dev) → Hindi'}
        </button>

        <button
          onClick={() => handleModeChange(isReversed ? 'english_to_santali' : 'santali_to_english')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center border cursor-pointer ${
            mode === 'santali_to_english' || mode === 'english_to_santali'
              ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-2xs ring-2 ring-rose-400/20'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="block text-[10px] text-slate-400 font-normal">
            {mode === 'english_to_santali' ? 'Reverse Mode' : 'Mode 3'}
          </span>
          {mode === 'english_to_santali' ? 'English → Santali (R)' : 'Santali (R) → English'}
        </button>

        <button
          onClick={() => handleModeChange(isReversed ? 'english_to_hindi' : 'hindi_to_english')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center border cursor-pointer ${
            mode === 'hindi_to_english' || mode === 'english_to_hindi'
              ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-2xs ring-2 ring-rose-400/20'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="block text-[10px] text-slate-400 font-normal">
            {mode === 'english_to_hindi' ? 'Reverse Mode' : 'Mode 4'}
          </span>
          {mode === 'english_to_hindi' ? 'English → Hindi' : 'Hindi → English'}
        </button>
      </div>

      {/* Quick Preset Words & Image OCR Scanner Button */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Try:
          </span>
          {quickPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => setInputText(preset)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-lg transition-colors shrink-0 text-xs border border-slate-200/70 cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImageOcrUpload(f);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            disabled={ocrRunning}
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {ocrRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-700" />
            ) : (
              <Camera className="w-3.5 h-3.5 text-sky-700" />
            )}
            <span>
              {ocrRunning ? `स्कैन हो रहा है (${ocrProgress}%)` : '📷 फ़ोटो से टेक्स्ट पढ़ें (OCR)'}
            </span>
          </button>
        </div>
      </div>

      {/* OCR Progress & Extracted Thumbnail Strip */}
      {(ocrRunning || ocrNotice || ocrPreviewUrl) && (
        <div className="mt-3 p-3 rounded-xl bg-sky-50/70 border border-sky-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 min-w-0">
            {ocrPreviewUrl && (
              <img
                src={ocrPreviewUrl}
                alt="OCR Scan Preview"
                className="w-11 h-11 rounded-lg object-cover border border-sky-200 shrink-0"
              />
            )}
            <div className="min-w-0">
              <div className="font-bold text-sky-950">
                {ocrRunning ? `इमेज OCR विश्लेषण जारी... ${ocrProgress}%` : 'फ़ोटो OCR स्कैनर (Hindi + English)'}
              </div>
              {ocrNotice && <p className="text-[11px] text-sky-800">{ocrNotice}</p>}
              {ocrRunning && (
                <div className="w-48 h-1.5 bg-sky-200 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-sky-600 transition-all duration-200"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
          {!ocrRunning && (
            <button
              type="button"
              onClick={() => {
                setOcrNotice(null);
                setOcrPreviewUrl(null);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              title="बंद करें"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* 2-Column Split: Input & Output Boxes */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* Input Box */}
        <div className="flex flex-col justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-400 transition-all">
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              <span>
                {mode === 'santali_roman_to_hindi' && 'Source: Santali (Roman)'}
                {mode === 'santali_dev_to_hindi' && 'Source: Santali (Devanagari)'}
                {mode === 'santali_to_english' && 'Source: Santali (Roman)'}
                {mode === 'hindi_to_english' && 'Source: Hindi (हिन्दी)'}
                {mode === 'hindi_to_santali_roman' && 'Source: Hindi (हिन्दी)'}
                {mode === 'hindi_to_santali_dev' && 'Source: Hindi (हिन्दी)'}
                {mode === 'english_to_santali' && 'Source: English'}
                {mode === 'english_to_hindi' && 'Source: English'}
              </span>
              <button
                onClick={() => setInputText('')}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              rows={4}
              className="w-full bg-transparent text-sm text-slate-900 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 mt-2 text-xs">
            <span className="text-slate-400 text-[11px]">{inputText.length} characters</span>
            <button
              onClick={() => handleTranslate()}
              disabled={!inputText || isTranslating}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <span>{isTranslating ? 'Translating...' : 'Translate'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Output Box */}
        <div className="flex flex-col justify-between p-4 bg-rose-50/50 rounded-2xl border border-rose-200 transition-all">
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-rose-800 mb-2">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>
                  {mode === 'hindi_to_english' && 'Target: English'}
                  {mode === 'english_to_hindi' && 'Target: Hindi (हिन्दी)'}
                  {mode === 'hindi_to_santali_roman' && 'Target: Santali (Roman)'}
                  {mode === 'hindi_to_santali_dev' && 'Target: Santali (Devanagari)'}
                  {mode === 'santali_to_english' && 'Target: English'}
                  {mode === 'english_to_santali' && 'Target: Santali (Roman)'}
                  {(mode === 'santali_roman_to_hindi' || mode === 'santali_dev_to_hindi') && 'Target: Hindi (हिन्दी)'}
                </span>
              </span>
              <button
                onClick={handleReverseTranslation}
                title="Swap source & target"
                className="p-1 hover:bg-rose-100 rounded-md text-rose-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>Swap</span>
              </button>
            </div>

            <p className="text-base font-bold text-slate-900 leading-relaxed">
              {translatedText}
            </p>

            {secondaryText && (
              <div className="mt-3 p-2.5 bg-white/90 rounded-xl border border-rose-100 text-xs text-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                  Phonetics &amp; Reference
                </span>
                <p className="font-semibold text-rose-950">
                  {secondaryText}
                </p>
              </div>
            )}

            {santaliDevanagariPreview && (
              <div className="mt-2.5 p-2.5 bg-sky-50/90 rounded-xl border border-sky-200 text-xs flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] text-sky-900 font-bold uppercase block">
                    संताली देवनागरी लिपि (Santali Devanagari)
                  </span>
                  <p className="font-bold text-slate-900 text-sm truncate">
                    {santaliDevanagariPreview}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(santaliDevanagariPreview);
                    setCopiedDev(true);
                    setTimeout(() => setCopiedDev(false), 1800);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-100 border border-sky-300 text-sky-900 font-bold text-[10px] shrink-0 cursor-pointer"
                >
                  {copiedDev ? '✓ कॉपी हुआ' : 'कॉपी देवनागरी'}
                </button>
              </div>
            )}

            {olChikiPreview && (
              <div className="mt-2.5 p-2.5 bg-amber-50/90 rounded-xl border border-amber-200 text-xs flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] text-amber-800 font-bold uppercase block">
                    ओल चिकि लिपि (ᱚᱞ ᱪᱤᱠᱤ Preview)
                  </span>
                  <p className="font-bold text-amber-950 text-sm truncate">
                    {olChikiPreview}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(olChikiPreview);
                    setCopiedOlChiki(true);
                    setTimeout(() => setCopiedOlChiki(false), 1800);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[10px] shrink-0 cursor-pointer"
                >
                  {copiedOlChiki ? '✓ कॉपी हुआ' : 'कॉपी Ol Chiki'}
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-rose-100 mt-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSpeak(translatedText, (mode === 'hindi_to_english' || mode === 'santali_to_english') ? 'en-US' : 'hi-IN')}
                className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                title="Speak translation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                title="Copy result"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  const textToTranslate = inputText || translatedText;
                  const targetLang = (mode.includes('english') || mode === 'santali_to_english') ? 'en' : 'hi';
                  const encoded = encodeURIComponent(textToTranslate);
                  window.open(`https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encoded}&op=translate`, '_blank', 'noopener,noreferrer');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer ml-1"
                title="Open current text in Google Translator"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Translator</span>
              </button>
            </div>

            <span className="text-[10px] text-rose-700 font-semibold">
              BOSC Engine · Bidirectional
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
