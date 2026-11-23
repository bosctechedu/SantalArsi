import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toDevanagariAuto, toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  BookOpen,
  Volume2,
  Plus,
  Trash2,
  Printer,
  ChevronLeft,
  ChevronRight,
  TreePine,
  Moon,
  Sun,
  Home
} from 'lucide-react';

type SceneTheme = 'forest' | 'night_sky' | 'village' | 'morning';

interface StoryPage {
  id: string;
  scene: SceneTheme;
  santaliText: string;
  hindiText: string;
  englishText: string;
}

const DEFAULT_BOOK_TITLE = 'बिरसा आर सारजोम दारे (बिरसा और सखुआ पेड़)';
const DEFAULT_AUTHOR = 'माचेत् / अभिभावक द्वारा रचित';

const DEFAULT_PAGES: StoryPage[] = [
  {
    id: 'sp1',
    scene: 'morning',
    santaliText: 'सेताक् बेड़ा रे बिरसा दो जाहेर थान सेच् सेन एना। ओंडे आड़ी नापाय होयो हिजुक् कान ताहेकाना।',
    hindiText: 'सुबह के समय बिरसा जाहेर थान की ओर गया। वहाँ बहुत सुंदर और ठंडी हवा चल रही थी।',
    englishText: 'In the morning, Birsa walked toward Jaher Than in a gentle cool breeze.'
  },
  {
    id: 'sp2',
    scene: 'forest',
    santaliText: 'मारंग सारजोम दारे चेतान रे चेँड़े को सेरेञ एत् ताहेकाना। बिरसा दो दारे रे दाक् ए दुल केदा।',
    hindiText: 'बड़े सखुआ पेड़ के ऊपर पक्षी मधुर गीत गा रहे थे। बिरसा ने पेड़ की जड़ में पानी सींचा।',
    englishText: 'Birds sang atop the grand Sal tree while Birsa watered its roots.'
  },
  {
    id: 'sp3',
    scene: 'village',
    santaliText: 'आयुप् बेड़ा रे जोतो गाते को अखड़ा रे जाराव एना आर तुम्दाक् ताल ते एनेच केदा को।',
    hindiText: 'शाम के समय सभी मित्र अखड़ा में इकट्ठा हुए और मांदर की थाप पर नृत्य करने लगे।',
    englishText: 'At dusk, friends gathered at the Akhda and danced to the Tumdak beat.'
  },
  {
    id: 'sp4',
    scene: 'night_sky',
    santaliText: 'चांदो आर इपिल को उदुक् एना। गोरोम आयो दो गिद्रा को सिरजोन काथा ए लाय आत् कोआ।',
    hindiText: 'चाँद और तारे निकल आए। दादी माँ ने बच्चों को सृष्टि की मधुर कहानी सुनाई।',
    englishText: 'The moon and stars rose as Grandmother narrated the creation tale.'
  }
];

const SCENE_OPTIONS: { id: SceneTheme; label: string; bg: string; icon: any }[] = [
  { id: 'morning', label: 'प्रातःकाल व सूर्य', bg: 'bg-amber-50 border-amber-200', icon: Sun },
  { id: 'forest', label: 'जंगल व सारजोम वृक्ष', bg: 'bg-emerald-50 border-emerald-200', icon: TreePine },
  { id: 'village', label: 'गाँव व अखड़ा', bg: 'bg-sky-50 border-sky-200', icon: Home },
  { id: 'night_sky', label: 'चाँद व इपिल रात्रि', bg: 'bg-indigo-50 border-indigo-200', icon: Moon }
];

export const SantaliKidsStorybookMaker: React.FC = () => {
  const { currentUser } = useUserAuth();
  const storageKey = currentUser?.email
    ? `hor_katha_kids_storybook_v1_${currentUser.email.toLowerCase()}`
    : 'hor_katha_kids_storybook_v1_guest';

  const [bookTitle, setBookTitle] = useState<string>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw).bookTitle || DEFAULT_BOOK_TITLE;
    } catch {
      // ignore
    }
    return DEFAULT_BOOK_TITLE;
  });

  const [authorName, setAuthorName] = useState<string>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw).authorName || DEFAULT_AUTHOR;
    } catch {
      // ignore
    }
    return DEFAULT_AUTHOR;
  });

  const [pages, setPages] = useState<StoryPage[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.pages) && parsed.pages.length > 0) return parsed.pages;
      }
    } catch {
      // ignore
    }
    return DEFAULT_PAGES;
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ bookTitle, authorName, pages }));
    } catch {
      // ignore
    }
  }, [bookTitle, authorName, pages, storageKey]);

  useEffect(() => () => stopSpeaking(), []);

  const currentPage = pages[activeIndex] || pages[0];
  const sceneMeta = SCENE_OPTIONS.find((s) => s.id === currentPage.scene) || SCENE_OPTIONS[0];
  const SceneIcon = sceneMeta.icon;

  const updateCurrentPage = (field: keyof StoryPage, value: string) => {
    setPages((prev) =>
      prev.map((p, idx) => (idx === activeIndex ? { ...p, [field]: value } : p))
    );
  };

  const handleAddPage = () => {
    if (pages.length >= 8) return;
    const next: StoryPage = {
      id: `sp_${Date.now()}`,
      scene: 'forest',
      santaliText: 'नावा पन्ना रे आम काथा ओल मे।',
      hindiText: 'नए पृष्ठ पर अपनी कहानी लिखें।',
      englishText: 'Write your story on this new page.'
    };
    setPages((prev) => [...prev, next]);
    setActiveIndex(pages.length);
  };

  const handleRemovePage = (idx: number) => {
    if (pages.length <= 1) return;
    setPages((prev) => prev.filter((_, i) => i !== idx));
    setActiveIndex((prev) => Math.max(0, Math.min(prev, pages.length - 2)));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-semibold text-emerald-800">
            बाल साहित्य निर्माण · सचित्र पृष्ठ व ऑडियो वाचन
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            सचित्र बाल-कहानी पुस्तक निर्माता (Kids Storybook Maker)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            बच्चों और कक्षा के लिए 1 से 8 पृष्ठों की संताली-ओल चिकी-हिन्दी सचित्र कहानी पुस्तक बनाएँ, सुनें व प्रिंट करें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleAddPage}
            disabled={pages.length >= 8}
            className="px-3.5 py-2 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-900 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>नया पृष्ठ जोड़ें ({pages.length}/8)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>पूरी पुस्तक प्रिंट / PDF</span>
          </button>
        </div>
      </div>

      {/* Interactive Book Stage + Editor (hidden on print; dedicated print layout below) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 print:hidden">
        {/* Preview Reader */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">{bookTitle}</h2>
              <p className="text-xs text-slate-500">
                {authorName} · पृष्ठ {activeIndex + 1} / {pages.length}
              </p>
            </div>
            <button
              onClick={() =>
                speakWithFemaleVoice(`${currentPage.santaliText}। ${currentPage.hindiText}`, {
                  autoDetectLanguage: true
                })
              }
              className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>यह पृष्ठ सुनें</span>
            </button>
          </div>

          {/* Illustrated Card */}
          <div className={`rounded-2xl border p-6 space-y-4 ${sceneMeta.bg}`}>
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs">
                <SceneIcon className="w-8 h-8 text-amber-700" />
              </div>
              <span className="text-xs font-bold text-slate-600 tabular-nums">
                पन्ना {activeIndex + 1} · {sceneMeta.label}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-900 block">
                संताली (देवनागरी लिपि)
              </span>
              <p className="text-lg font-bold text-slate-900 leading-relaxed">
                {toDevanagariAuto(currentPage.santaliText)}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                ओल चिकी लिपि (ᱚᱞ ᱪᱤᱠᱤ)
              </span>
              <p className="text-base font-bold text-amber-900 leading-relaxed">
                {toOlChikiAuto(currentPage.santaliText)}
              </p>
            </div>
            <p className="text-sm text-slate-700 pt-2 border-t border-slate-200/70">
              {currentPage.hindiText}
            </p>
            <p className="text-xs text-slate-500">{currentPage.englishText}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveIndex((p) => Math.max(0, p - 1))}
              disabled={activeIndex === 0}
              className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>पिछला पन्ना</span>
            </button>

            <div className="flex items-center gap-1.5">
              {pages.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActiveIndex(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold tabular-nums cursor-pointer ${
                    i === activeIndex
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveIndex((p) => Math.min(pages.length - 1, p + 1))}
              disabled={activeIndex === pages.length - 1}
              className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            >
              <span>अगला पन्ना</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page Editor */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>पृष्ठ {activeIndex + 1} संपादित करें</span>
            </h2>
            {pages.length > 1 && (
              <button
                onClick={() => handleRemovePage(activeIndex)}
                className="text-rose-700 hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>पृष्ठ हटाएँ</span>
              </button>
            )}
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">पुस्तक का शीर्षक</label>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">लेखक / शिक्षक नाम</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">चित्र दृश्य थीम</label>
            <select
              value={currentPage.scene}
              onChange={(e) => updateCurrentPage('scene', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            >
              {SCENE_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">संताली संवाद (देवनागरी लिपि)</label>
              <button
                type="button"
                onClick={() => updateCurrentPage('santaliText', toDevanagariAuto(currentPage.santaliText))}
                className="text-[11px] font-bold text-sky-800 hover:underline cursor-pointer"
              >
                देवनागरी में बदलें
              </button>
            </div>
            <textarea
              rows={3}
              value={currentPage.santaliText}
              onChange={(e) => updateCurrentPage('santaliText', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">हिन्दी कहानी पंक्ति</label>
            <textarea
              rows={2}
              value={currentPage.hindiText}
              onChange={(e) => updateCurrentPage('hindiText', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">English Line</label>
            <input
              type="text"
              value={currentPage.englishText}
              onChange={(e) => updateCurrentPage('englishText', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Print-only Full Multi-Page Booklet */}
      <div className="hidden print:block space-y-6">
        <div className="border-b-2 border-slate-900 pb-4 text-center">
          <h1 className="text-2xl font-bold">{toDevanagariAuto(bookTitle)}</h1>
          <p className="text-lg font-bold text-amber-800">{toOlChikiAuto(bookTitle)}</p>
          <p className="text-xs text-slate-600 mt-1">{authorName} · Santal आ़रसी</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {pages.map((p, idx) => (
            <div key={p.id} className="border border-slate-300 rounded-xl p-4 space-y-2 break-inside-avoid">
              <p className="text-xs font-bold text-slate-500">पृष्ठ {idx + 1}</p>
              <p className="text-base font-bold text-slate-900">{toDevanagariAuto(p.santaliText)}</p>
              <p className="text-sm font-semibold text-amber-900">{toOlChikiAuto(p.santaliText)}</p>
              <p className="text-xs text-slate-700 pt-1 border-t border-slate-200">{p.hindiText}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
