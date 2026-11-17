import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Square,
  BookOpen,
  Sliders,
  Mic,
  X,
  Check,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Languages,
  MousePointerClick,
  AlertCircle
} from 'lucide-react';
import {
  subscribeSpeechState,
  speakWithFemaleVoice,
  pauseSpeaking,
  resumeSpeaking,
  stopSpeaking,
  prevSpeechChunk,
  nextSpeechChunk,
  SpeechStateSnapshot,
  TOP_10_VOICE_MODELS,
  VoiceModelProfile,
  getActiveVoiceProfile,
  setActiveVoiceProfile,
  getAvailableSystemVoices,
  getPreferredSystemVoiceName,
  setPreferredSystemVoiceName,
  ReadingLanguageMode,
  getReadingLanguageMode,
  setReadingLanguageMode
} from '../utils/speech';

const FONT_SCALES = [
  { id: 'sm', label: 'A-', percent: 92 },
  { id: 'md', label: 'A', percent: 100 },
  { id: 'lg', label: 'A+', percent: 112 },
  { id: 'xl', label: 'A++', percent: 122 }
] as const;

type FontScaleId = (typeof FONT_SCALES)[number]['id'];

const READING_LANG_OPTIONS: Array<{ id: ReadingLanguageMode; shortLabel: string; fullLabel: string }> = [
  { id: 'all', shortLabel: '3 भाषा (All)', fullLabel: 'सभी 3 भाषाएँ (हिन्दी + English + Santali Roman)' },
  { id: 'hindi', shortLabel: 'हिन्दी', fullLabel: 'केवल हिन्दी (Hindi)' },
  { id: 'english', shortLabel: 'English', fullLabel: 'English Only' },
  { id: 'santali_roman', shortLabel: 'Santali Roman', fullLabel: 'Santali Roman (संताली रोमन)' }
];

const BLOCK_TAGS = new Set([
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'P',
  'LI',
  'BLOCKQUOTE',
  'TD',
  'TH',
  'DT',
  'DD',
  'FIGCAPTION',
  'DIV',
  'SECTION',
  'ARTICLE',
  'HEADER',
  'BUTTON'
]);

const ACTION_ONLY_BUTTON_RE =
  /^(सुनें|पढ़ें|play|pause|stop|resume|copy|copied|edit|delete|save|cancel|close|बंद|रोकें|जारी|reset|clear|साफ़|santali|3 भाषा|next|prev|अगला|पिछला|\d+|×|<|>|\+|-)$/i;

function isActionOnlyButton(btn: Element): boolean {
  if (
    btn.closest('[data-admin-ui="true"]') ||
    btn.closest('[data-reader-bar="true"]') ||
    btn.closest('[data-reader-skip="true"]') ||
    btn.closest('nav')
  ) {
    return true;
  }
  const text = (btn.textContent || '').replace(/\s+/g, ' ').trim();
  if (!text) return true;
  if (ACTION_ONLY_BUTTON_RE.test(text)) return true;

  // Keep rich content card buttons (e.g., Dashboard cards, Month cards, Quiz cards, Phrase cards)
  const hasRichChild = Boolean(btn.querySelector('h1, h2, h3, h4, p, div'));
  if (hasRichChild && text.length >= 10) return false;
  if (text.length >= 22) return false;

  return true;
}

/**
 * Extracts readable text across ALL 3 languages (Hindi, English, Santali Roman + Ol Chiki)
 * using a fast cached-visibility DOM TreeWalker that reads regular text AND rich <button> cards.
 */
function collectAllLanguageTextFromContainer(container: Element, maxItems = 1500): string {
  const seen = new Set<string>();
  const lines: string[] = [];
  const blockBuffers = new Map<Element, string[]>();
  const blockOrder: Element[] = [];
  const visibilityCache = new Map<Element, boolean>();

  const isElementVisible = (el: Element): boolean => {
    const cached = visibilityCache.get(el);
    if (cached !== undefined) return cached;

    let cur: Element | null = el;
    while (cur && cur !== container.parentElement) {
      const hit = visibilityCache.get(cur);
      if (hit === false) {
        visibilityCache.set(el, false);
        return false;
      }
      if (cur.getAttribute('aria-hidden') === 'true') {
        visibilityCache.set(cur, false);
        visibilityCache.set(el, false);
        return false;
      }
      const style = window.getComputedStyle(cur);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        visibilityCache.set(cur, false);
        visibilityCache.set(el, false);
        return false;
      }
      cur = cur.parentElement;
    }
    visibilityCache.set(el, true);
    return true;
  };

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'SVG') {
        return NodeFilter.FILTER_REJECT;
      }
      if (
        parent.closest('[data-admin-ui="true"]') ||
        parent.closest('[data-reader-bar="true"]') ||
        parent.closest('[data-reader-skip="true"]') ||
        parent.closest('select') ||
        parent.closest('nav') ||
        parent.closest('input') ||
        parent.closest('textarea')
      ) {
        return NodeFilter.FILTER_REJECT;
      }
      const btn = parent.closest('button');
      if (btn && isActionOnlyButton(btn)) {
        return NodeFilter.FILTER_REJECT;
      }
      const val = (node.nodeValue || '').replace(/\s+/g, ' ').trim();
      if (!val || !/[A-Za-z0-9\u0900-\u097F\u1C50-\u1C7F]/.test(val)) {
        return NodeFilter.FILTER_REJECT;
      }
      if (!isElementVisible(parent)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  let current = walker.nextNode();
  while (current) {
    const parentEl = current.parentElement!;
    let block: Element | null = parentEl;
    while (block && block !== container && !BLOCK_TAGS.has(block.tagName)) {
      block = block.parentElement;
    }
    const bucketKey = block || parentEl;

    if (!blockBuffers.has(bucketKey)) {
      blockBuffers.set(bucketKey, []);
      blockOrder.push(bucketKey);
    }
    const cleanVal = (current.nodeValue || '').replace(/\s+/g, ' ').trim();
    if (cleanVal) {
      blockBuffers.get(bucketKey)!.push(cleanVal);
    }
    current = walker.nextNode();
  }

  for (const el of blockOrder) {
    const joined = (blockBuffers.get(el) || []).join(' ').replace(/\s+/g, ' ').trim();
    if (!joined || !/[A-Za-z0-9\u0900-\u097F\u1C50-\u1C7F]/.test(joined)) continue;
    if (joined.length < 2 && !/[\u1C50-\u1C7F\u0900-\u097F]/.test(joined)) continue;
    if (seen.has(joined)) continue;
    seen.add(joined);
    lines.push(joined);
    if (lines.length >= maxItems) break;
  }

  return lines.join('। ');
}

function formatChunkLangBadge(lang?: 'hindi' | 'english' | 'santali_roman'): string {
  if (lang === 'english') return 'English';
  if (lang === 'santali_roman') return 'Santali Roman';
  return 'हिन्दी / देवनागरी';
}

function getWorkspaceRoot(): Element {
  return (
    document.querySelector('main[data-workspace-main="true"]') ||
    document.querySelector('main') ||
    document.body
  );
}

/**
 * Header-fitted Reader Controls:
 * 1) Font Scale (A- / A / A+ / A++)
 * 2) Top 10 Male/Female Voices Selector Drawer
 * 3) 3-Language Reader Mode Selector + Full Page / Selection / Tap-to-Read Block Controls
 * 4) Live Spoken Playback Floating Card with < Prev / Next >, Pause/Stop, Speed, and Error Feedback
 */
export const HeaderReaderControls: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const [speech, setSpeech] = useState<SpeechStateSnapshot>({
    isSpeaking: false,
    isPaused: false,
    fullText: '',
    currentChunkText: '',
    chunkIndex: 0,
    totalChunks: 0,
    errorMessage: null
  });

  const [activeProfile, setActiveProfile] = useState<VoiceModelProfile>(() => getActiveVoiceProfile());
  const [readingLangMode, setReadingLangModeState] = useState<ReadingLanguageMode>(() =>
    getReadingLanguageMode()
  );
  const [rate, setRate] = useState<number>(() => getActiveVoiceProfile().rate);
  const [showVoiceDrawer, setShowVoiceDrawer] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedSysVoice, setSelectedSysVoice] = useState<string>(() => getPreferredSystemVoiceName());
  const [readingModeLabel, setReadingModeLabel] = useState<string>('3 भाषा वाचन');
  const [lastClickedSectionTitle, setLastClickedSectionTitle] = useState<string>('');
  const [lastClickedSectionText, setLastClickedSectionText] = useState<string>('');
  const [tapToReadMode, setTapToReadMode] = useState<boolean>(false);
  const [selectedPageText, setSelectedPageText] = useState<string>('');
  const [readerNotice, setReaderNotice] = useState<string | null>(null);
  const drawerWrapperRef = useRef<HTMLDivElement>(null);
  const highlightedElRef = useRef<HTMLElement | null>(null);

  const [fontScale, setFontScale] = useState<FontScaleId>(() => {
    try {
      const saved = localStorage.getItem('hor_katha_font_scale') as FontScaleId | null;
      return saved && FONT_SCALES.some((f) => f.id === saved) ? saved : 'md';
    } catch {
      return 'md';
    }
  });

  useEffect(() => {
    return subscribeSpeechState((snap) => setSpeech(snap));
  }, []);

  useEffect(() => {
    const syncVoice = () => {
      const prof = getActiveVoiceProfile();
      setActiveProfile(prof);
      setRate(prof.rate);
      setSelectedSysVoice(getPreferredSystemVoiceName());
    };
    const syncLangMode = () => {
      setReadingLangModeState(getReadingLanguageMode());
    };
    const syncUserPrefs = (e: Event) => {
      const customEvt = e as CustomEvent;
      const prefs = customEvt.detail;
      if (prefs?.fontScale && FONT_SCALES.some((f) => f.id === prefs.fontScale)) {
        setFontScale(prefs.fontScale);
      }
      syncVoice();
      syncLangMode();
    };
    window.addEventListener('hor-katha-voice-changed', syncVoice);
    window.addEventListener('hor-katha-reading-lang-changed', syncLangMode);
    window.addEventListener('hor-katha-user-prefs-applied', syncUserPrefs);
    return () => {
      window.removeEventListener('hor-katha-voice-changed', syncVoice);
      window.removeEventListener('hor-katha-reading-lang-changed', syncLangMode);
      window.removeEventListener('hor-katha-user-prefs-applied', syncUserPrefs);
    };
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const list = getAvailableSystemVoices();
      if (list.length > 0) setSystemVoices(list);
    };
    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synth.addEventListener?.('voiceschanged', loadVoices);
      const t = setTimeout(loadVoices, 600);
      return () => {
        clearTimeout(t);
        synth.removeEventListener?.('voiceschanged', loadVoices);
      };
    }
  }, [showVoiceDrawer]);

  useEffect(() => {
    try {
      localStorage.setItem('hor_katha_font_scale', fontScale);
    } catch {
      // ignore
    }
  }, [fontScale]);

  useEffect(() => {
    if (!showVoiceDrawer) return;
    const onDocClick = (e: MouseEvent) => {
      if (drawerWrapperRef.current && !drawerWrapperRef.current.contains(e.target as Node)) {
        setShowVoiceDrawer(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [showVoiceDrawer]);

  // Track highlighted text selection cleanly so user can click to read selected passage
  useEffect(() => {
    const onSelectionChange = () => {
      const txt = window.getSelection()?.toString().replace(/\s+/g, ' ').trim() || '';
      setSelectedPageText(txt.length >= 2 ? txt : '');
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, []);

  const activeScaleObj = FONT_SCALES.find((f) => f.id === fontScale) || FONT_SCALES[1];

  // Throttled speaker button enhancer: labels icon-only <Volume2> buttons with "सुनें"
  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const enhanceSpeakerButtons = () => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach((btn) => {
        if (btn.closest('[data-admin-ui="true"]') || btn.closest('[data-reader-bar="true"]')) return;
        const hasVolumeIcon = btn.querySelector('svg.lucide-volume-2');
        if (!hasVolumeIcon) return;

        if (btn.querySelector('[data-auto-speaker-word="true"]')) return;
        const visibleText = (btn.textContent || '').trim();
        if (!visibleText) {
          const wordSpan = document.createElement('span');
          wordSpan.setAttribute('data-auto-speaker-word', 'true');
          wordSpan.textContent = 'सुनें';
          wordSpan.style.fontSize = '11px';
          wordSpan.style.fontWeight = '700';
          wordSpan.style.marginLeft = '4px';
          wordSpan.style.lineHeight = '1';
          wordSpan.style.whiteSpace = 'nowrap';
          btn.style.display = btn.style.display || 'inline-flex';
          btn.style.alignItems = 'center';
          btn.style.gap = '2px';
          btn.appendChild(wordSpan);
        }
      });
    };

    enhanceSpeakerButtons();
    const observer = new MutationObserver((mutations) => {
      const relevant = mutations.some((m) => {
        if (m.type !== 'childList' || m.addedNodes.length === 0) return false;
        const targetEl = m.target as HTMLElement | null;
        return !targetEl?.closest?.('[data-reader-bar="true"]');
      });
      if (!relevant) return;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(enhanceSpeakerButtons, 200);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, [activeTab]);

  // Scoped Section Capture when clicking any card/section speaker
  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const btn = target.closest('button');
      if (!btn || !btn.querySelector('svg.lucide-volume-2')) return;
      if (btn.closest('[data-reader-bar="true"]')) return;

      const mainRoot = getWorkspaceRoot();
      const card = btn.closest('article, .rounded-2xl, .rounded-3xl, section, tr') as HTMLElement | null;
      if (!card || card === mainRoot) {
        setLastClickedSectionText('');
        setLastClickedSectionTitle('');
        setReadingModeLabel('केवल चयनित भाग (Section Only)');
        return;
      }

      const scopedText = collectAllLanguageTextFromContainer(card, 180);
      const headingEl = card.querySelector('h1, h2, h3, h4');
      const heading = (headingEl?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 42);

      setReadingModeLabel(heading ? `सेक्शन: ${heading}` : 'केवल चयनित सेक्शन');
      if (scopedText.length > 12) {
        setLastClickedSectionText(scopedText);
        setLastClickedSectionTitle(heading || 'यह सेक्शन');
      } else {
        setLastClickedSectionText('');
        setLastClickedSectionTitle('');
      }
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, []);

  // Interactive Tap-to-Read Any Content Block Mode
  useEffect(() => {
    if (!tapToReadMode) {
      if (highlightedElRef.current) {
        highlightedElRef.current.style.outline = '';
        highlightedElRef.current.style.outlineOffset = '';
        highlightedElRef.current = null;
      }
      return;
    }

    const findReadableBlock = (target: EventTarget | null): HTMLElement | null => {
      const el = target as HTMLElement | null;
      if (!el) return null;
      if (el.closest('[data-reader-bar="true"]') || el.closest('[data-admin-ui="true"]')) return null;
      const mainRoot = getWorkspaceRoot();
      if (!mainRoot.contains(el)) return null;

      const candidate = el.closest(
        'article, section, .rounded-2xl, .rounded-3xl, .rounded-xl, tr, li, blockquote, p, h1, h2, h3, h4'
      ) as HTMLElement | null;
      if (!candidate || candidate === mainRoot) return null;
      return candidate;
    };

    const onMouseOver = (e: MouseEvent) => {
      const block = findReadableBlock(e.target);
      if (highlightedElRef.current && highlightedElRef.current !== block) {
        highlightedElRef.current.style.outline = '';
        highlightedElRef.current.style.outlineOffset = '';
      }
      if (block) {
        block.style.outline = '2px dashed #d97706';
        block.style.outlineOffset = '2px';
        highlightedElRef.current = block;
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      const block = findReadableBlock(e.target);
      if (!block) return;

      e.preventDefault();
      e.stopPropagation();

      const blockText = collectAllLanguageTextFromContainer(block, 240);
      const fallbackRaw = (block.innerText || block.textContent || '').replace(/\s+/g, ' ').trim();
      const toSpeak = blockText.length >= 2 ? blockText : fallbackRaw;
      if (!toSpeak) return;

      const headingEl = block.querySelector('h1, h2, h3, h4');
      const heading = (headingEl?.textContent || toSpeak).replace(/\s+/g, ' ').trim().slice(0, 38);
      setReadingModeLabel(`चयनित ब्लॉक: ${heading}`);
      setLastClickedSectionText(toSpeak);
      setLastClickedSectionTitle(heading || 'चयनित ब्लॉक');
      setReaderNotice(null);

      speakWithFemaleVoice(toSpeak, {
        autoDetectLanguage: true,
        readingLangMode,
        voiceProfileId: activeProfile.id,
        rate
      });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTapToReadMode(false);
    };

    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('click', onClickCapture, true);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mouseover', onMouseOver, true);
      document.removeEventListener('click', onClickCapture, true);
      document.removeEventListener('keydown', onKeyDown);
      if (highlightedElRef.current) {
        highlightedElRef.current.style.outline = '';
        highlightedElRef.current.style.outlineOffset = '';
        highlightedElRef.current = null;
      }
    };
  }, [tapToReadMode, readingLangMode, activeProfile.id, rate]);

  const handleChangeReadingLang = (mode: ReadingLanguageMode) => {
    setReadingLanguageMode(mode);
    setReadingLangModeState(mode);

    if (speech.isSpeaking && speech.fullText) {
      const meta = READING_LANG_OPTIONS.find((o) => o.id === mode);
      setReadingModeLabel(meta ? meta.shortLabel : '3 भाषा वाचन');
      speakWithFemaleVoice(speech.fullText, {
        autoDetectLanguage: true,
        readingLangMode: mode,
        voiceProfileId: activeProfile.id,
        rate
      });
    }
  };

  const handleReadOnlyThisSection = useCallback(() => {
    if (!lastClickedSectionText) return;
    setReaderNotice(null);
    setReadingModeLabel(`केवल सेक्शन: ${lastClickedSectionTitle}`);
    speakWithFemaleVoice(lastClickedSectionText, {
      autoDetectLanguage: true,
      readingLangMode,
      voiceProfileId: activeProfile.id,
      rate
    });
  }, [lastClickedSectionText, lastClickedSectionTitle, readingLangMode, activeProfile.id, rate]);

  const handleReadSelectedPassage = useCallback(() => {
    const sel = (window.getSelection()?.toString() || selectedPageText).replace(/\s+/g, ' ').trim();
    if (!sel) return;
    setReaderNotice(null);
    setReadingModeLabel('चयनित पाठ (Selected Text)');
    speakWithFemaleVoice(sel, {
      autoDetectLanguage: true,
      readingLangMode,
      voiceProfileId: activeProfile.id,
      rate
    });
  }, [selectedPageText, readingLangMode, activeProfile.id, rate]);

  const handleReadFullPageAllLanguages = useCallback(() => {
    setReaderNotice(null);
    const root = getWorkspaceRoot();
    const fullText = collectAllLanguageTextFromContainer(root, 1500);
    if (!fullText) {
      setReaderNotice('इस दृश्य में पढ़ने योग्य पाठ नहीं मिला — कृपया किसी सामग्री अनुभाग पर टैप करें।');
      return;
    }

    const modeMeta = READING_LANG_OPTIONS.find((m) => m.id === readingLangMode);
    setReadingModeLabel(modeMeta ? modeMeta.shortLabel : '3 भाषा (HI+EN+Santali Roman)');
    speakWithFemaleVoice(fullText, {
      autoDetectLanguage: true,
      readingLangMode,
      voiceProfileId: activeProfile.id,
      rate
    });
  }, [readingLangMode, activeProfile.id, rate]);

  const handleSelectVoiceModel = (model: VoiceModelProfile) => {
    setActiveVoiceProfile(model.id);
    setActiveProfile(model);
    setRate(model.rate);

    if (speech.isSpeaking && speech.fullText) {
      speakWithFemaleVoice(speech.fullText, {
        autoDetectLanguage: true,
        readingLangMode,
        voiceProfileId: model.id,
        rate: model.rate,
        startChunkIndex: speech.chunkIndex
      });
    }
  };

  const handleTestVoiceModel = (model: VoiceModelProfile) => {
    setActiveVoiceProfile(model.id);
    setActiveProfile(model);
    setRate(model.rate);
    setReaderNotice(null);
    setReadingModeLabel(`3-भाषा परीक्षण: ${model.name.split(' ')[0]}`);
    speakWithFemaleVoice(
      `Johar! Abo ror, abo uprum, abo gorob. नमस्कार! मैं ${model.name.split(' ')[0]} हूँ — हिन्दी, अंग्रेज़ी और संताली रोमन तीनों भाषाओं में पाठ वाचन तैयार है। Reading smoothly in Hindi, English, and Santali Roman.`,
      {
        autoDetectLanguage: true,
        readingLangMode: 'all',
        voiceProfileId: model.id,
        rate: model.rate
      }
    );
  };

  const filteredModels = TOP_10_VOICE_MODELS.filter((m) =>
    genderFilter === 'all' ? true : m.gender === genderFilter
  );

  const progressPercent =
    speech.totalChunks > 0
      ? Math.min(100, Math.round(((speech.chunkIndex + 1) / speech.totalChunks) * 100))
      : 0;

  return (
    <div
      ref={drawerWrapperRef}
      data-reader-bar="true"
      data-admin-ui="true"
      className="relative flex flex-wrap items-center gap-1.5"
    >
      {activeScaleObj.percent !== 100 && (
        <style>{`
          main[data-workspace-main="true"] {
            zoom: ${activeScaleObj.percent}%;
          }
        `}</style>
      )}

      {/* 1. Accessibility Font Scale Pills */}
      <div
        className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs h-8"
        title="पठनीयता के लिए अक्षर आकार (Font Size)"
      >
        {FONT_SCALES.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setFontScale(sc.id)}
            className={`px-1.5 py-1 rounded-lg text-[11px] font-black transition-colors cursor-pointer ${
              fontScale === sc.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* 2. Top 10 Voice Models Toggle Button */}
      <button
        onClick={() => setShowVoiceDrawer((s) => !s)}
        className="h-8 inline-flex items-center gap-1.5 px-2.5 rounded-xl bg-white hover:bg-sky-50 text-slate-900 text-xs font-bold shadow-2xs border border-sky-300 transition-colors cursor-pointer whitespace-nowrap"
        title="Top 10 पुरुष व महिला आवाज़ सेटिंग"
      >
        <Mic className="w-3.5 h-3.5 text-sky-700 shrink-0" />
        <span>
          {activeProfile.gender === 'female' ? '👩' : '👨'} {activeProfile.name.split(' ')[0]}
        </span>
        <span className="text-[10px] bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded font-bold">
          10 Voices
        </span>
      </button>

      {/* 3. Tap-to-Read Any Content Card/Block Toggle */}
      <button
        onClick={() => setTapToReadMode((prev) => !prev)}
        className={`h-8 inline-flex items-center gap-1 px-2.5 rounded-xl text-xs font-bold border shadow-2xs transition-colors cursor-pointer whitespace-nowrap ${
          tapToReadMode
            ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-300'
            : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-300'
        }`}
        title="इसे ऑन करके पेज के किसी भी कार्ड, पैराग्राफ या पंक्ति पर क्लिक करें — वह तुरंत पढ़ा जाएगा!"
      >
        <MousePointerClick className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden sm:inline">{tapToReadMode ? 'टैप-वाचन चालू (Esc)' : 'ब्लॉक चुनकर पढ़ें'}</span>
        <span className="sm:hidden">{tapToReadMode ? 'ऑन' : 'टैप-पढ़ें'}</span>
      </button>

      {/* 4. 3-Language Reader Mode Selector + Read Full Page / Selection Button */}
      <div className="inline-flex items-center bg-white border border-amber-300 rounded-xl h-8 shadow-2xs overflow-hidden">
        <div className="flex items-center pl-2 pr-1 border-r border-amber-200 bg-amber-50/50 h-full">
          <Languages className="w-3.5 h-3.5 text-amber-700 mr-1 shrink-0" />
          <select
            value={readingLangMode}
            onChange={(e) => handleChangeReadingLang(e.target.value as ReadingLanguageMode)}
            aria-label="Reader Language (Hindi, English, Santali Roman)"
            title="वाचन भाषा चुनें: सभी 3 भाषाएँ, हिन्दी, English या Santali Roman"
            className="text-[11px] font-bold text-amber-950 bg-transparent focus:outline-none cursor-pointer"
          >
            {READING_LANG_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.shortLabel}
              </option>
            ))}
          </select>
        </div>

        {selectedPageText ? (
          <button
            onClick={handleReadSelectedPassage}
            className="h-full inline-flex items-center gap-1.5 px-2.5 bg-sky-50 hover:bg-sky-100 text-sky-950 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            title="माउस से चुने गए अंश को तुरंत पढ़ें"
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-700 shrink-0" />
            <span>चयनित अंश पढ़ें</span>
          </button>
        ) : !speech.isSpeaking && !speech.isPaused ? (
          <button
            onClick={handleReadFullPageAllLanguages}
            className="h-full inline-flex items-center gap-1.5 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            title="हिन्दी, English और Santali Roman तीनों भाषाओं में पूरा पेज सुनें"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>पूरा पेज पढ़ें</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-1 px-1.5 h-full bg-amber-50">
            {speech.isPaused ? (
              <button
                onClick={resumeSpeaking}
                className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>जारी</span>
              </button>
            ) : (
              <button
                onClick={pauseSpeaking}
                className="px-2 py-0.5 rounded-lg bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Pause className="w-3 h-3 fill-white" />
                <span>रोकें</span>
              </button>
            )}
            <button
              onClick={stopSpeaking}
              className="px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Square className="w-2.5 h-2.5 fill-white" />
              <span>बंद</span>
            </button>
          </div>
        )}
      </div>

      {/* Top 10 Male/Female Voice Models Dropdown Panel */}
      {showVoiceDrawer && (
        <div className="fixed sm:absolute right-2 sm:right-0 top-24 sm:top-10 z-50 w-[calc(100vw-1rem)] sm:w-[410px] bg-white text-slate-900 rounded-2xl border-2 border-amber-500 shadow-2xl p-4 space-y-3 max-h-[78vh] flex flex-col">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 shrink-0">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-amber-600" />
                <span>शीर्ष 10 आवाज़ मॉडल (3-Language TTS)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                हिन्दी · English · Santali Roman तीनों भाषाओं में स्पष्ट वाचन
              </p>
            </div>
            <button
              onClick={() => setShowVoiceDrawer(false)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              aria-label="Close voice settings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 3-Language Filter Bar inside Voice Drawer */}
          <div className="space-y-1 shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
              पाठ वाचन भाषा मोड (Text Read Language):
            </span>
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
              {READING_LANG_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleChangeReadingLang(opt.id)}
                  className={`py-1.5 px-1.5 rounded-lg transition-colors cursor-pointer truncate ${
                    readingLangMode === opt.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                  title={opt.fullLabel}
                >
                  {opt.shortLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0">
            {[
              { id: 'all' as const, label: 'सभी 10 स्वर' },
              { id: 'female' as const, label: 'महिला (5)' },
              { id: 'male' as const, label: 'पुरुष (5)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setGenderFilter(tab.id)}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                  genderFilter === tab.id
                    ? 'bg-white text-amber-900 shadow-2xs border border-amber-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto space-y-1.5 pr-1 flex-1">
            {filteredModels.map((model) => {
              const isSelected = activeProfile.id === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() => handleSelectVoiceModel(model)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-500 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          model.gender === 'female'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-sky-100 text-sky-900'
                        }`}
                      >
                        {model.gender === 'female' ? '👩 महिला' : '👨 पुरुष'}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {model.labelHi}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                      {model.role} · पिच {model.pitch} · गति {model.rate}x
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestVoiceModel(model);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>3 भाषा टेस्ट</span>
                    </button>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1 shrink-0 text-[11px]">
            <label className="font-bold text-slate-700 block">
              डिवाइस की मूल आवाज़ (System OS Voice — {systemVoices.length} उपलब्ध):
            </label>
            {systemVoices.length > 0 ? (
              <select
                value={selectedSysVoice}
                onChange={(e) => {
                  setSelectedSysVoice(e.target.value);
                  setPreferredSystemVoiceName(e.target.value);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs cursor-pointer"
              >
                <option value="">स्वचालित श्रेष्ठ भारतीय/हिन्दी-अंग्रेज़ी स्वर (Auto Recommended)</option>
                {systemVoices.map((v) => (
                  <option key={`${v.name}_${v.lang}`} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                ब्राउज़र से TTS आवाज़ें लोड हो रही हैं — यदि कोई आवाज़ न दिखे तो अपने ब्राउज़र/OS की Text-to-Speech सेटिंग सक्रिय करें।
              </p>
            )}
          </div>
        </div>
      )}

      {/* Helpful Error/Notice Card if TTS fails or needs voice selection */}
      {(speech.errorMessage || readerNotice) && !speech.isSpeaking && !speech.isPaused && (
        <div className="fixed right-3 sm:right-6 top-28 z-40 w-[calc(100vw-1.5rem)] sm:w-[390px] bg-white text-slate-900 rounded-2xl border-2 border-rose-300 shadow-2xl p-3 space-y-2">
          <div className="flex items-start justify-between gap-2 text-xs text-rose-800 font-bold">
            <span className="flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{speech.errorMessage || readerNotice}</span>
            </span>
            <button
              onClick={() => {
                setReaderNotice(null);
                stopSpeaking();
              }}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer shrink-0"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVoiceDrawer(true)}
              className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-[11px] font-bold cursor-pointer"
            >
              10 Voices / सिस्टम आवाज़ जांचें
            </button>
          </div>
        </div>
      )}

      {/* Tap-to-Read Active Hint Pill */}
      {tapToReadMode && !speech.isSpeaking && !speech.isPaused && (
        <div className="fixed left-1/2 -translate-x-1/2 top-20 z-40 bg-amber-50 border-2 border-amber-500 text-amber-950 rounded-full px-4 py-1.5 shadow-lg text-xs font-bold flex items-center gap-2">
          <MousePointerClick className="w-4 h-4 text-amber-700 animate-bounce" />
          <span>पेज के किसी भी कार्ड, शीर्षक या पैराग्राफ पर क्लिक करें — वह तुरंत पढ़ा जाएगा!</span>
          <button
            onClick={() => setTapToReadMode(false)}
            className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] cursor-pointer"
          >
            बंद करें
          </button>
        </div>
      )}

      {/* Live Spoken Words Toast Card (Shows active spoken text, < Prev / Next >, Progress, & Language Switch) */}
      {(speech.isSpeaking || speech.isPaused) && (
        <div className="fixed right-3 sm:right-6 top-28 z-40 w-[calc(100vw-1.5rem)] sm:w-[410px] bg-white/98 backdrop-blur-md text-slate-900 rounded-2xl border-2 border-amber-500 shadow-2xl p-3 space-y-2">
          <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-amber-900">
            <span className="flex items-center gap-1.5 truncate">
              <Volume2 className={`w-4 h-4 text-amber-600 shrink-0 ${!speech.isPaused ? 'animate-pulse' : ''}`} />
              <span className="truncate">{speech.isPaused ? 'वाचन रुका हुआ' : readingModeLabel}</span>
            </span>
            <span className="font-mono text-slate-600 tabular-nums shrink-0">
              {Math.min(speech.chunkIndex + 1, Math.max(1, speech.totalChunks))} / {Math.max(1, speech.totalChunks)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 gap-2">
            <span className="flex items-center gap-1 font-semibold truncate">
              <UserCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{activeProfile.labelHi}</span>
            </span>

            <span className="font-bold text-sky-800 shrink-0">
              {formatChunkLangBadge(speech.activeChunkLang)}
            </span>

            <div className="flex items-center gap-1 shrink-0">
              <Sliders className="w-3 h-3 text-slate-500" />
              <select
                value={rate}
                onChange={(e) => {
                  const newRate = Number(e.target.value);
                  setRate(newRate);
                  if (speech.fullText) {
                    speakWithFemaleVoice(speech.fullText, {
                      autoDetectLanguage: true,
                      readingLangMode,
                      voiceProfileId: activeProfile.id,
                      rate: newRate,
                      startChunkIndex: speech.chunkIndex
                    });
                  }
                }}
                className="bg-white border border-slate-300 rounded px-1 py-0.5 text-[10px] font-mono text-slate-900 cursor-pointer"
              >
                <option value={0.75}>0.75x</option>
                <option value={0.85}>0.85x</option>
                <option value={0.9}>0.9x</option>
                <option value={1.0}>1.0x</option>
                <option value={1.15}>1.15x</option>
                <option value={1.25}>1.25x</option>
              </select>
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-900 bg-amber-50 rounded-xl px-2.5 py-2 border border-amber-200 leading-relaxed max-h-24 overflow-y-auto">
            {speech.currentChunkText || speech.fullText}
          </p>

          {/* Sentence Step Controls + Pause/Stop */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1">
              <button
                onClick={prevSpeechChunk}
                disabled={speech.chunkIndex <= 0}
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
                title="पिछला वाक्य"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>पिछला</span>
              </button>
              <button
                onClick={nextSpeechChunk}
                disabled={speech.chunkIndex >= Math.max(0, speech.totalChunks - 1)}
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
                title="अगला वाक्य"
              >
                <span>अगला</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              {speech.isPaused ? (
                <button
                  onClick={resumeSpeaking}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>जारी</span>
                </button>
              ) : (
                <button
                  onClick={pauseSpeaking}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Pause className="w-3 h-3 fill-white" />
                  <span>रोकें</span>
                </button>
              )}
              <button
                onClick={stopSpeaking}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Square className="w-2.5 h-2.5 fill-white" />
                <span>बंद</span>
              </button>
            </div>
          </div>

          {/* Quick 1-click switch between All 3 / Hindi / English / Santali Roman */}
          <div className="flex items-center gap-1 text-[10px] font-bold">
            {READING_LANG_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleChangeReadingLang(opt.id)}
                className={`flex-1 py-1 px-1 rounded-lg border transition-colors cursor-pointer truncate ${
                  readingLangMode === opt.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {opt.shortLabel}
              </button>
            ))}
          </div>

          {lastClickedSectionText && lastClickedSectionText !== speech.fullText && (
            <button
              onClick={handleReadOnlyThisSection}
              className="w-full py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer truncate px-2"
            >
              📖 पूरा सेक्शन पढ़ें: {lastClickedSectionTitle}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Bottom-Right Corner: Clean Horizontal < > Navigation (Top/Start < and Bottom/End >)
 */
export const GlobalTextReaderBar: React.FC<{ activeTab: string }> = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.querySelector('main[data-workspace-main="true"]');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    const mainEl = document.querySelector('main[data-workspace-main="true"]');
    if (mainEl) mainEl.scrollTo({ top: mainEl.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div
      data-reader-bar="true"
      data-admin-ui="true"
      className="fixed bottom-4 right-4 z-40 flex items-center gap-1 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg p-1 print:hidden"
    >
      <button
        onClick={scrollToTop}
        title="सबसे ऊपर जाएँ (< Top / Start)"
        aria-label="Scroll to Top"
        className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-sky-50 text-sky-700 border border-slate-200 hover:border-sky-300 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
      </button>

      <button
        onClick={scrollToBottom}
        title="सबसे नीचे जाएँ (> Bottom / End)"
        aria-label="Scroll to Bottom"
        className="w-9 h-9 rounded-lg bg-slate-50 hover:bg-amber-50 text-amber-700 border border-slate-200 hover:border-amber-300 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
      </button>
    </div>
  );
};
