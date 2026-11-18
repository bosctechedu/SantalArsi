import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAdmin, CustomContentBlock } from '../context/AdminContext';
import { speakWithFemaleVoice } from '../utils/speech';
import {
  compileSearchRegex,
  countMatchesInText,
  applyTextReplace,
  splitHighlightSegments
} from '../utils/findReplaceEngine';
import {
  Edit3,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Volume2,
  X,
  CheckCircle2,
  EyeOff,
  MousePointerClick,
  Layers,
  Sparkles,
  ExternalLink,
  Image as ImageIcon,
  Upload,
  Search,
  ArrowLeftRight,
  ChevronUp,
  ChevronDown,
  Undo2,
  Copy,
  Replace,
  ListChecks,
  Crosshair
} from 'lucide-react';

interface UniversalLiveEditorProps {
  activeTab: string;
  onOpenCMS?: () => void;
  hasMappedCMSTab?: boolean;
}

interface ClickedTargetInfo {
  key: string;
  cardKey: string | null;
  tagName: string;
  region: string;
  originalText: string;
  currentText: string;
  targetEl: HTMLElement | null;
  targetTextNode: Text | null;
  cardEl: HTMLElement | null;
}

interface TextNodeMeta {
  key: string;
  orig: string;
  tagName: string;
  region: string;
  leadingSpace: string;
  trailingSpace: string;
}

// Track mixed-container direct TEXT_NODEs without wrapping or mutating React DOM structure
const trackedTextNodes = new WeakMap<Text, TextNodeMeta>();

const EDITABLE_SELECTOR =
  'h1, h2, h3, h4, h5, h6, p, li, blockquote, td, th, caption, dt, dd, label, figcaption, summary, strong, b, em, i, small, code, pre, a, button, span, div';

const CONTENT_LEAF_TAGS = new Set([
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
  'CAPTION',
  'DT',
  'DD',
  'LABEL',
  'FIGCAPTION',
  'SUMMARY',
  'STRONG',
  'B',
  'EM',
  'I',
  'SMALL',
  'CODE',
  'PRE',
  'A',
  'BUTTON'
]);

const SKIP_TEXT_PARENTS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION']);

function stableTextHash(str: string): string {
  let hash = 5381;
  const normalized = str.replace(/\s+/g, ' ').trim().slice(0, 180);
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) + hash) ^ normalized.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

function isMeaningfulText(raw: string): boolean {
  const cleaned = raw.replace(/\s+/g, ' ').trim();
  if (cleaned.length >= 2) return true;
  // Allow single meaningful Ol Chiki, Devanagari, or Latin letter/word
  return /[a-zA-Z\u0900-\u097F\u1C50-\u1C7F]/.test(cleaned);
}

function isPureTextElement(el: HTMLElement): boolean {
  if (!el) return false;
  for (let i = 0; i < el.childNodes.length; i++) {
    if (el.childNodes[i].nodeType !== Node.TEXT_NODE) {
      return false;
    }
  }
  return isMeaningfulText(el.textContent || '');
}

function isInsideSkippedAdminContainer(node: Node | null): boolean {
  const el = node instanceof HTMLElement ? node : node?.parentElement || null;
  if (!el) return true;
  if (el.closest('[data-admin-ui="true"]')) return true;
  if (el.closest('[data-custom-blocks="true"]')) return true;
  if (el.closest('[data-reader-bar="true"]')) return true;
  if (el.closest('input, textarea, select, option')) return true;
  if (el.closest('svg, script, style, noscript')) return true;
  return false;
}

function getAppRootElement(): HTMLElement | null {
  return (
    (document.querySelector('[data-hor-app-root="true"]') as HTMLElement | null) ||
    document.body
  );
}

function getRegionForElement(el: HTMLElement | null, activeTab: string): string {
  if (!el) return activeTab;
  const regionHost = el.closest('[data-edit-region]') as HTMLElement | null;
  if (regionHost?.dataset.editRegion) {
    return regionHost.dataset.editRegion;
  }
  if (el.closest('main[data-workspace-main="true"]')) {
    return activeTab;
  }
  if (el.closest('header')) return 'global_header';
  if (el.closest('aside')) return 'global_sidebar';
  if (el.closest('footer')) return 'global_footer';
  return 'global_modal';
}

function getRegionLabel(region: string, activeTab: string): string {
  if (region === 'global_header') return 'Header';
  if (region === 'global_sidebar') return 'Sidebar';
  if (region === 'global_footer') return 'Footer';
  if (region === 'global_modal') return 'Modal / Popup';
  if (region === activeTab) return `Section (${activeTab})`;
  return region;
}

function isElementVisiblyRendered(el: HTMLElement): boolean {
  if (el.style.display === 'none' || el.dataset.horHidden === 'true') return false;
  if (el.getClientRects().length === 0) return false;
  return true;
}

function formatTextNodeWithOriginalSpacing(meta: TextNodeMeta, nextTrimmed: string): string {
  return `${meta.leadingSpace}${nextTrimmed}${meta.trailingSpace}`;
}

export const UniversalLiveEditor: React.FC<UniversalLiveEditorProps> = ({
  activeTab,
  onOpenCMS,
  hasMappedCMSTab
}) => {
  const {
    isAdmin,
    isLiveEditMode,
    setIsLiveEditMode,
    contentOverrides,
    saveContentOverride,
    bulkSaveContentOverrides,
    restoreContentOverridesSnapshot,
    resetContentOverride,
    customBlocks,
    addCustomBlock,
    updateCustomBlock,
    bulkUpdateCustomBlocks,
    restoreCustomBlocksSnapshot,
    deleteCustomBlock,
    hiddenBlocks,
    hideContentBlock,
    restoreContentBlock,
    restoreAllHiddenBlocks,
    imageOverrides,
    saveImageOverride,
    resetImageOverride
  } = useAdmin();

  const [clickedTarget, setClickedTarget] = useState<ClickedTargetInfo | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Live Find, Replace & Replace All State
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findQuery, setFindQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [findScope, setFindScope] = useState<'all_page' | 'section' | 'chrome' | 'custom'>('all_page');
  const [showMatchList, setShowMatchList] = useState(true);
  const [activeMatchIdx, setActiveMatchIdx] = useState(0);
  const [domScanTick, setDomScanTick] = useState(0);
  const [liveUndoStack, setLiveUndoStack] = useState<
    Array<{
      label: string;
      overridesSnapshot: Record<string, string>;
      customBlocksSnapshot: Record<string, CustomContentBlock[]>;
    }>
  >([]);
  const findInputRef = useRef<HTMLInputElement | null>(null);

  // Start-to-End Full Page Content Inspector State
  const [showFullInspector, setShowFullInspector] = useState(false);
  const [inspectorRegionFilter, setInspectorRegionFilter] = useState<
    'all' | 'global_header' | 'global_sidebar' | 'section' | 'global_footer' | 'global_modal' | 'images'
  >('all');
  const [inspectorSearch, setInspectorSearch] = useState('');
  const [inspectorLimit, setInspectorLimit] = useState(80);

  // Image Click-to-Replace Modal State
  const [clickedImage, setClickedImage] = useState<{
    key: string;
    region: string;
    originalSrc: string;
    currentSrc: string;
    altText: string;
    imgEl: HTMLImageElement;
  } | null>(null);
  const [imageDraftUrl, setImageDraftUrl] = useState('');

  // Add / Edit Custom Block Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomBlockId, setEditingCustomBlockId] = useState<string | null>(null);
  const [customForm, setCustomForm] = useState({
    title: '',
    santaliText: '',
    hindiText: '',
    englishText: '',
    badge: 'नया जोड़ा गया'
  });

  const rafRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(null), 2800);
  }, []);

  const moduleCustomBlocks = useMemo(
    () => customBlocks[activeTab] || [],
    [customBlocks, activeTab]
  );

  const hiddenCountForScope = useMemo(
    () =>
      Object.keys(hiddenBlocks).filter(
        (k) =>
          k.startsWith(`${activeTab}::`) ||
          k.startsWith('global_header::') ||
          k.startsWith('global_sidebar::') ||
          k.startsWith('global_footer::') ||
          k.startsWith('global_modal::')
      ).length,
    [hiddenBlocks, activeTab]
  );

  const overrideCountForScope = useMemo(
    () =>
      Object.keys(contentOverrides).filter(
        (k) =>
          k.startsWith(`${activeTab}::`) ||
          k.startsWith('global_header::') ||
          k.startsWith('global_sidebar::') ||
          k.startsWith('global_footer::') ||
          k.startsWith('global_modal::')
      ).length,
    [contentOverrides, activeTab]
  );

  // Apply ALL saved overrides, hidden blocks, and image overrides across the ENTIRE app (Header -> Sidebar -> Main -> Footer -> Modals)
  const syncDomOverrides = useCallback(() => {
    const appRoot = getAppRootElement();
    if (!appRoot) return;

    // 1. Leaf elements pass (headings, paragraphs, table cells, spans, buttons, links, labels, etc.)
    const candidates = appRoot.querySelectorAll(EDITABLE_SELECTOR);
    candidates.forEach((node) => {
      const el = node as HTMLElement;
      if (isInsideSkippedAdminContainer(el)) return;

      const region = getRegionForElement(el, activeTab);
      const leaf = isPureTextElement(el);
      const isStructuralTag = CONTENT_LEAF_TAGS.has(el.tagName);

      if (!leaf && !isStructuralTag) return;

      // For leaf elements or elements with no child HTML elements
      if (leaf || el.children.length === 0) {
        if (!el.dataset.horOrigText || el.dataset.horRegion !== region) {
          const raw = (el.textContent || '').replace(/\s+/g, ' ').trim();
          if (!isMeaningfulText(raw)) return;
          if (!el.dataset.horOrigText) {
            el.dataset.horOrigText = raw;
          }
          el.dataset.horRegion = region;
          el.dataset.horKey = `${region}::${el.tagName}::${stableTextHash(el.dataset.horOrigText)}`;
        }

        const key = el.dataset.horKey;
        if (!key) return;

        if (hiddenBlocks[key]) {
          el.style.display = 'none';
          el.dataset.horHidden = 'true';
        } else if (el.dataset.horHidden === 'true') {
          el.style.display = '';
          delete el.dataset.horHidden;
        }

        const overrideVal = contentOverrides[key];
        if (overrideVal !== undefined) {
          if (el.textContent !== overrideVal) {
            el.textContent = overrideVal;
          }
          el.dataset.horOverridden = 'true';
        } else if (el.dataset.horOverridden === 'true' && el.dataset.horOrigText) {
          el.textContent = el.dataset.horOrigText;
          delete el.dataset.horOverridden;
        }
      } else {
        // Mixed-content structural element (e.g. <p> with <strong> or <button> with <svg>)
        // Ensure card-level hide/restore still works if key was assigned
        if (!el.dataset.horOrigText || el.dataset.horRegion !== region) {
          const raw = (el.textContent || '').replace(/\s+/g, ' ').trim();
          if (isMeaningfulText(raw)) {
            if (!el.dataset.horOrigText) el.dataset.horOrigText = raw;
            el.dataset.horRegion = region;
            el.dataset.horKey = `${region}::${el.tagName}::${stableTextHash(el.dataset.horOrigText)}`;
          }
        }
        const key = el.dataset.horKey;
        if (key) {
          if (hiddenBlocks[key]) {
            el.style.display = 'none';
            el.dataset.horHidden = 'true';
          } else if (el.dataset.horHidden === 'true') {
            el.style.display = '';
            delete el.dataset.horHidden;
          }
        }
      }
    });

    // 2. Direct TextNode pass for mixed containers (preserves sibling <svg> icons, <strong>, <span> badges)
    const walker = document.createTreeWalker(appRoot, NodeFilter.SHOW_TEXT);
    let currentNode: Node | null = walker.nextNode();
    while (currentNode) {
      const textNode = currentNode as Text;
      currentNode = walker.nextNode();

      const parentEl = textNode.parentElement;
      if (!parentEl) continue;
      if (SKIP_TEXT_PARENTS.has(parentEl.tagName)) continue;
      if (isInsideSkippedAdminContainer(parentEl)) continue;

      // Skip if parent is already a pure leaf element handled cleanly in Step 1
      if (parentEl.dataset.horKey && isPureTextElement(parentEl)) continue;

      let meta = trackedTextNodes.get(textNode);
      const rawVal = textNode.nodeValue || '';
      const region = getRegionForElement(parentEl, activeTab);

      if (!meta || meta.region !== region) {
        const cleaned = rawVal.replace(/\s+/g, ' ').trim();
        if (!isMeaningfulText(cleaned)) continue;
        const leadingSpace = /^\s+/.test(rawVal) ? ' ' : '';
        const trailingSpace = /\s+$/.test(rawVal) ? ' ' : '';
        const orig = meta?.orig || cleaned;
        meta = {
          key: `${region}::TX_${parentEl.tagName}::${stableTextHash(orig)}`,
          orig,
          tagName: `TEXT(${parentEl.tagName})`,
          region,
          leadingSpace,
          trailingSpace
        };
        trackedTextNodes.set(textNode, meta);
      }

      if (hiddenBlocks[meta.key]) {
        if (textNode.nodeValue !== '') {
          textNode.nodeValue = '';
        }
      } else if (contentOverrides[meta.key] !== undefined) {
        const targetStr = formatTextNodeWithOriginalSpacing(meta, contentOverrides[meta.key]);
        if (textNode.nodeValue !== targetStr) {
          textNode.nodeValue = targetStr;
        }
      } else {
        const origStr = formatTextNodeWithOriginalSpacing(meta, meta.orig);
        if (textNode.nodeValue !== origStr && textNode.nodeValue === '') {
          textNode.nodeValue = origStr;
        }
      }
    }

    // 3. Card containers hidden directly
    const hiddenCardCandidates = appRoot.querySelectorAll('.rounded-2xl, .rounded-3xl, article, section');
    hiddenCardCandidates.forEach((node) => {
      const card = node as HTMLElement;
      if (card.dataset.horKey && hiddenBlocks[card.dataset.horKey]) {
        card.style.display = 'none';
        card.dataset.horHidden = 'true';
      } else if (card.dataset.horHidden === 'true' && card.dataset.horKey && !hiddenBlocks[card.dataset.horKey]) {
        card.style.display = '';
        delete card.dataset.horHidden;
      }
    });

    // 4. All <img> elements across entire app (Header logo, slideshows, cards, Mobile UI, Presentation, Footer)
    const imgs = appRoot.querySelectorAll('img');
    imgs.forEach((imgNode) => {
      const img = imgNode as HTMLImageElement;
      if (isInsideSkippedAdminContainer(img)) return;
      const region = getRegionForElement(img, activeTab);
      if (!img.dataset.horOrigSrc || img.dataset.horRegion !== region) {
        const rawSrc = img.dataset.horOrigSrc || img.getAttribute('src') || img.src || '';
        if (!rawSrc) return;
        img.dataset.horOrigSrc = rawSrc;
        img.dataset.horRegion = region;
        img.dataset.horImgKey = `${region}::IMG::${stableTextHash(rawSrc + '|' + (img.alt || ''))}`;
      }
      const imgKey = img.dataset.horImgKey;
      if (!imgKey) return;
      if (hiddenBlocks[imgKey]) {
        img.style.display = 'none';
        img.dataset.horHidden = 'true';
      } else if (img.dataset.horHidden === 'true') {
        img.style.display = '';
        delete img.dataset.horHidden;
      }

      const ovSrc = imageOverrides[imgKey];
      if (ovSrc) {
        if (img.src !== ovSrc) {
          img.src = ovSrc;
        }
        img.dataset.horImgOverridden = 'true';
      } else if (img.dataset.horImgOverridden === 'true' && img.dataset.horOrigSrc) {
        img.src = img.dataset.horOrigSrc;
        delete img.dataset.horImgOverridden;
      }
    });
  }, [activeTab, contentOverrides, hiddenBlocks, imageOverrides]);

  useEffect(() => {
    syncDomOverrides();
    const appRoot = getAppRootElement();
    if (!appRoot) return;

    const observer = new MutationObserver(() => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        syncDomOverrides();
      });
    });
    observer.observe(appRoot, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [syncDomOverrides]);

  // Toggle body class for subtle hover outline when Admin Click-to-Edit mode is active
  useEffect(() => {
    if (isAdmin && isLiveEditMode) {
      document.body.classList.add('hor-admin-live-edit');
    } else {
      document.body.classList.remove('hor-admin-live-edit');
    }
    return () => {
      document.body.classList.remove('hor-admin-live-edit');
    };
  }, [isAdmin, isLiveEditMode]);

  const openClickToEditForElement = useCallback(
    (target: HTMLElement, forceInteractiveEdit: boolean) => {
      const appRoot = getAppRootElement();
      if (!appRoot) return false;
      if (isInsideSkippedAdminContainer(target)) return false;

      // Handle <img> click-to-replace
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        const region = getRegionForElement(img, activeTab);
        if (!img.dataset.horOrigSrc) {
          const rawSrc = img.getAttribute('src') || img.src || '';
          img.dataset.horOrigSrc = rawSrc;
          img.dataset.horRegion = region;
          img.dataset.horImgKey = `${region}::IMG::${stableTextHash(rawSrc + '|' + (img.alt || ''))}`;
        }
        const imgKey = img.dataset.horImgKey || `${region}::IMG::${stableTextHash(img.src)}`;
        setClickedImage({
          key: imgKey,
          region,
          originalSrc: img.dataset.horOrigSrc || img.src,
          currentSrc: img.src,
          altText: img.alt || 'चित्र (Image)',
          imgEl: img
        });
        setImageDraftUrl(imageOverrides[imgKey] || img.src);
        return true;
      }

      const btnOrLink = target.closest('button, a') as HTMLElement | null;
      if (btnOrLink && !forceInteractiveEdit) {
        // Always let speaker/audio/reader buttons function normally on left click
        if (
          btnOrLink.getAttribute('data-reader-action') === 'true' ||
          btnOrLink.querySelector(
            'svg.lucide-volume-2, svg.lucide-play, svg.lucide-pause, svg.lucide-square, svg.lucide-mic, svg.lucide-radio, svg.lucide-book-open'
          )
        ) {
          return false;
        }
        // Inside card-style buttons (e.g. Dashboard cards), allow direct click on content headings/descriptions/cells
        const innerContentEl = target.closest(
          'h1, h2, h3, h4, h5, h6, p, blockquote, li, td, th, dt, dd'
        ) as HTMLElement | null;
        if (!innerContentEl || innerContentEl === btnOrLink) return false;
      }

      const candidateEl = (target.closest(EDITABLE_SELECTOR) || target) as HTMLElement;
      if (!candidateEl || !appRoot.contains(candidateEl)) return false;

      const region = getRegionForElement(candidateEl, activeTab);
      const cardEl = candidateEl.closest('.rounded-2xl, .rounded-3xl, article') as HTMLElement | null;
      let cardKey: string | null = null;
      if (cardEl && appRoot.contains(cardEl)) {
        if (!cardEl.dataset.horOrigText) {
          const cardRaw = (cardEl.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 180);
          cardEl.dataset.horOrigText = cardRaw;
          cardEl.dataset.horKey = `${region}::CARD::${stableTextHash(cardRaw)}`;
        }
        cardKey = cardEl.dataset.horKey || null;
      }

      // Case A: Pure text leaf element (or explicitly forced button/link with single text node)
      if (isPureTextElement(candidateEl) || candidateEl.children.length === 0) {
        const text = (candidateEl.textContent || '').replace(/\s+/g, ' ').trim();
        if (!isMeaningfulText(text)) return false;
        if (!candidateEl.dataset.horOrigText || candidateEl.dataset.horRegion !== region) {
          if (!candidateEl.dataset.horOrigText) candidateEl.dataset.horOrigText = text;
          candidateEl.dataset.horRegion = region;
          candidateEl.dataset.horKey = `${region}::${candidateEl.tagName}::${stableTextHash(
            candidateEl.dataset.horOrigText
          )}`;
        }
        const key = candidateEl.dataset.horKey!;
        setClickedTarget({
          key,
          cardKey,
          tagName: candidateEl.tagName,
          region,
          originalText: candidateEl.dataset.horOrigText || text,
          currentText: text,
          targetEl: candidateEl,
          targetTextNode: null,
          cardEl
        });
        setEditDraft(text);
        return true;
      }

      // Case B: Mixed element (has <svg>, <strong>, or child tags along with direct text nodes)
      const directTextNodes: Text[] = [];
      for (let i = 0; i < candidateEl.childNodes.length; i++) {
        const n = candidateEl.childNodes[i];
        if (n.nodeType === Node.TEXT_NODE && isMeaningfulText(n.nodeValue || '')) {
          directTextNodes.push(n as Text);
        }
      }

      if (directTextNodes.length > 0) {
        const firstTN = directTextNodes[0];
        let meta = trackedTextNodes.get(firstTN);
        const cleaned = (firstTN.nodeValue || '').replace(/\s+/g, ' ').trim();
        if (!meta) {
          meta = {
            key: `${region}::TX_${candidateEl.tagName}::${stableTextHash(cleaned)}`,
            orig: cleaned,
            tagName: `TEXT(${candidateEl.tagName})`,
            region,
            leadingSpace: /^\s+/.test(firstTN.nodeValue || '') ? ' ' : '',
            trailingSpace: /\s+$/.test(firstTN.nodeValue || '') ? ' ' : ''
          };
          trackedTextNodes.set(firstTN, meta);
        }
        setClickedTarget({
          key: meta.key,
          cardKey,
          tagName: meta.tagName,
          region,
          originalText: meta.orig,
          currentText: cleaned,
          targetEl: candidateEl,
          targetTextNode: firstTN,
          cardEl
        });
        setEditDraft(cleaned);
        return true;
      }

      // Case C: Container has only child elements (e.g. button wrapping an <svg> + <span>label</span>)
      const firstInnerSpan = candidateEl.querySelector('span, strong, p, h1, h2, h3, h4, h5, h6') as HTMLElement | null;
      if (firstInnerSpan && (isPureTextElement(firstInnerSpan) || firstInnerSpan.children.length === 0)) {
        const text = (firstInnerSpan.textContent || '').replace(/\s+/g, ' ').trim();
        if (isMeaningfulText(text)) {
          const innerRegion = getRegionForElement(firstInnerSpan, activeTab);
          if (!firstInnerSpan.dataset.horOrigText) {
            firstInnerSpan.dataset.horOrigText = text;
            firstInnerSpan.dataset.horRegion = innerRegion;
            firstInnerSpan.dataset.horKey = `${innerRegion}::${firstInnerSpan.tagName}::${stableTextHash(text)}`;
          }
          setClickedTarget({
            key: firstInnerSpan.dataset.horKey!,
            cardKey,
            tagName: firstInnerSpan.tagName,
            region: innerRegion,
            originalText: firstInnerSpan.dataset.horOrigText || text,
            currentText: text,
            targetEl: firstInnerSpan,
            targetTextNode: null,
            cardEl
          });
          setEditDraft(text);
          return true;
        }
      }

      return false;
    },
    [activeTab, imageOverrides]
  );

  // Global Click-to-Edit & Right-Click/Alt+Click interceptor across ENTIRE app (Header, Sidebar, Workspace, Footer, Modals)
  useEffect(() => {
    if (!isAdmin || !isLiveEditMode) return;
    const appRoot = getAppRootElement();
    if (!appRoot) return;

    const handleClickCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const handled = openClickToEditForElement(target, e.altKey);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleContextMenuCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const handled = openClickToEditForElement(target, true);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    appRoot.addEventListener('click', handleClickCapture, true);
    appRoot.addEventListener('contextmenu', handleContextMenuCapture, true);
    return () => {
      appRoot.removeEventListener('click', handleClickCapture, true);
      appRoot.removeEventListener('contextmenu', handleContextMenuCapture, true);
    };
  }, [isAdmin, isLiveEditMode, openClickToEditForElement]);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 900;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setImageDraftUrl(compressed);
        }
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImageOverride = () => {
    if (!clickedImage || !imageDraftUrl.trim()) return;
    saveImageOverride(clickedImage.key, imageDraftUrl.trim());
    if (clickedImage.imgEl) {
      clickedImage.imgEl.src = imageDraftUrl.trim();
      clickedImage.imgEl.dataset.horImgOverridden = 'true';
    }
    setClickedImage(null);
    setDomScanTick((t) => t + 1);
    showToast('तस्वीर सफलतापूर्वक बदल व सहेज दी गई!');
  };

  const handleResetImageOverride = () => {
    if (!clickedImage) return;
    resetImageOverride(clickedImage.key);
    if (clickedImage.imgEl && clickedImage.originalSrc) {
      clickedImage.imgEl.src = clickedImage.originalSrc;
      delete clickedImage.imgEl.dataset.horImgOverridden;
    }
    setClickedImage(null);
    setDomScanTick((t) => t + 1);
    showToast('मूल तस्वीर वापस बहाल कर दी गई!');
  };

  const handleSaveInlineEdit = () => {
    if (!clickedTarget) return;
    const trimmed = editDraft.trim();
    if (!trimmed) return;

    saveContentOverride(clickedTarget.key, trimmed);
    if (clickedTarget.targetTextNode) {
      const meta = trackedTextNodes.get(clickedTarget.targetTextNode);
      clickedTarget.targetTextNode.nodeValue = meta
        ? formatTextNodeWithOriginalSpacing(meta, trimmed)
        : trimmed;
    } else if (clickedTarget.targetEl) {
      if (isPureTextElement(clickedTarget.targetEl) || clickedTarget.targetEl.children.length === 0) {
        clickedTarget.targetEl.textContent = trimmed;
        clickedTarget.targetEl.dataset.horOverridden = 'true';
      } else {
        const firstTextNode = Array.from(clickedTarget.targetEl.childNodes).find(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent || '').trim().length > 0
        );
        if (firstTextNode) {
          firstTextNode.textContent = trimmed;
        } else {
          clickedTarget.targetEl.textContent = trimmed;
        }
        clickedTarget.targetEl.dataset.horOverridden = 'true';
      }
    }
    setClickedTarget(null);
    setDomScanTick((t) => t + 1);
    showToast('कंटेंट सफलतापूर्वक अपडेट व सेव किया गया!');
  };

  const handleResetInlineEdit = () => {
    if (!clickedTarget) return;
    resetContentOverride(clickedTarget.key);
    if (clickedTarget.targetTextNode) {
      const meta = trackedTextNodes.get(clickedTarget.targetTextNode);
      clickedTarget.targetTextNode.nodeValue = meta
        ? formatTextNodeWithOriginalSpacing(meta, clickedTarget.originalText)
        : clickedTarget.originalText;
    } else if (clickedTarget.targetEl && clickedTarget.originalText) {
      clickedTarget.targetEl.textContent = clickedTarget.originalText;
      delete clickedTarget.targetEl.dataset.horOverridden;
    }
    setClickedTarget(null);
    setDomScanTick((t) => t + 1);
    showToast('मूल कंटेंट वापस बहाल कर दिया गया!');
  };

  const handleDeleteInlineElement = (deleteWholeCard: boolean) => {
    if (!clickedTarget) return;
    const keyToHide = deleteWholeCard && clickedTarget.cardKey ? clickedTarget.cardKey : clickedTarget.key;
    hideContentBlock(keyToHide);

    if (deleteWholeCard && clickedTarget.cardEl) {
      clickedTarget.cardEl.style.display = 'none';
      clickedTarget.cardEl.dataset.horHidden = 'true';
    } else if (clickedTarget.targetTextNode) {
      clickedTarget.targetTextNode.nodeValue = '';
    } else if (clickedTarget.targetEl) {
      clickedTarget.targetEl.style.display = 'none';
      clickedTarget.targetEl.dataset.horHidden = 'true';
    }
    setClickedTarget(null);
    setDomScanTick((t) => t + 1);
    showToast(deleteWholeCard ? 'पूरा कार्ड हटा दिया गया!' : 'यह कंटेंट हटा दिया गया!');
  };

  const handleOpenAddCustom = () => {
    setEditingCustomBlockId(null);
    setCustomForm({
      title: '',
      santaliText: '',
      hindiText: '',
      englishText: '',
      badge: 'नया कंटेंट'
    });
    setShowAddModal(true);
  };

  const handleOpenEditCustom = (block: CustomContentBlock) => {
    setEditingCustomBlockId(block.id);
    setCustomForm({
      title: block.title,
      santaliText: block.santaliText,
      hindiText: block.hindiText,
      englishText: block.englishText || '',
      badge: block.badge || 'नया कंटेंट'
    });
    setShowAddModal(true);
  };

  const handleSaveCustomBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.title.trim() && !customForm.santaliText.trim() && !customForm.hindiText.trim()) return;

    if (editingCustomBlockId) {
      updateCustomBlock(activeTab, editingCustomBlockId, {
        title: customForm.title.trim(),
        santaliText: customForm.santaliText.trim(),
        hindiText: customForm.hindiText.trim(),
        englishText: customForm.englishText.trim(),
        badge: customForm.badge.trim() || 'संपादित'
      });
      showToast('कस्टम कंटेंट अपडेट हो गया!');
    } else {
      addCustomBlock(activeTab, {
        title: customForm.title.trim(),
        santaliText: customForm.santaliText.trim(),
        hindiText: customForm.hindiText.trim(),
        englishText: customForm.englishText.trim(),
        badge: customForm.badge.trim() || 'नया जोड़ा गया'
      });
      showToast('नया कंटेंट इस मॉड्यूल में जोड़ दिया गया!');
    }
    setShowAddModal(false);
    setEditingCustomBlockId(null);
    setDomScanTick((t) => t + 1);
  };

  // Global Ctrl+H / Cmd+H shortcut for Admin Find & Replace
  useEffect(() => {
    if (!isAdmin) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setShowFindReplace(true);
        window.setTimeout(() => {
          findInputRef.current?.focus();
          findInputRef.current?.select();
        }, 40);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAdmin]);

  type ScannedDomItem =
    | {
        uid: string;
        kind: 'text';
        key: string;
        cardKey: string | null;
        region: string;
        tagName: string;
        originalText: string;
        currentText: string;
        isOverridden: boolean;
        el: HTMLElement;
        textNode: Text | null;
        cardEl: HTMLElement | null;
      }
    | {
        uid: string;
        kind: 'image';
        key: string;
        region: string;
        tagName: 'IMG';
        altText: string;
        originalSrc: string;
        currentSrc: string;
        isOverridden: boolean;
        imgEl: HTMLImageElement;
      };

  // Start-to-End Full Page Scanner across Header -> Sidebar -> Main Section -> Footer -> Modals
  const scannedAppItems = useMemo<ScannedDomItem[]>(() => {
    if (!isAdmin || (!showFullInspector && !showFindReplace)) return [];
    const appRoot = getAppRootElement();
    if (!appRoot) return [];

    // Ensure keys are stamped before scanning
    syncDomOverrides();

    const items: ScannedDomItem[] = [];
    const seenKeys = new Set<string>();

    const walker = document.createTreeWalker(appRoot, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node: Node | null = walker.nextNode();
    let seq = 0;

    while (node) {
      const current = node;
      node = walker.nextNode();

      if (current.nodeType === Node.ELEMENT_NODE) {
        const el = current as HTMLElement;
        if (isInsideSkippedAdminContainer(el)) continue;

        if (el.tagName === 'IMG') {
          const img = el as HTMLImageElement;
          if (!isElementVisiblyRendered(img)) continue;
          const region = img.dataset.horRegion || getRegionForElement(img, activeTab);
          const key =
            img.dataset.horImgKey ||
            `${region}::IMG::${stableTextHash((img.getAttribute('src') || img.src || '') + '|' + (img.alt || ''))}`;
          if (seenKeys.has(key)) continue;
          seenKeys.add(key);
          items.push({
            uid: `img_${++seq}_${key}`,
            kind: 'image',
            key,
            region,
            tagName: 'IMG',
            altText: img.alt || 'चित्र (Image)',
            originalSrc: img.dataset.horOrigSrc || img.src,
            currentSrc: img.src,
            isOverridden: Boolean(imageOverrides[key]),
            imgEl: img
          });
          continue;
        }

        if (!isElementVisiblyRendered(el)) continue;
        if (!isPureTextElement(el) && el.children.length > 0) continue;
        if (!el.matches(EDITABLE_SELECTOR)) continue;

        const currentText = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!isMeaningfulText(currentText)) continue;

        const region = el.dataset.horRegion || getRegionForElement(el, activeTab);
        const orig = el.dataset.horOrigText || currentText;
        const key = el.dataset.horKey || `${region}::${el.tagName}::${stableTextHash(orig)}`;
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);

        const cardEl = el.closest('.rounded-2xl, .rounded-3xl, article') as HTMLElement | null;
        items.push({
          uid: `el_${++seq}_${key}`,
          kind: 'text',
          key,
          cardKey: cardEl?.dataset.horKey || null,
          region,
          tagName: el.tagName,
          originalText: orig,
          currentText,
          isOverridden: contentOverrides[key] !== undefined,
          el,
          textNode: null,
          cardEl
        });
      } else if (current.nodeType === Node.TEXT_NODE) {
        const textNode = current as Text;
        const parentEl = textNode.parentElement;
        if (!parentEl) continue;
        if (SKIP_TEXT_PARENTS.has(parentEl.tagName)) continue;
        if (isInsideSkippedAdminContainer(parentEl)) continue;
        if (!isElementVisiblyRendered(parentEl)) continue;

        // Already handled by its pure-leaf parent
        if (isPureTextElement(parentEl) && parentEl.matches(EDITABLE_SELECTOR)) continue;

        const cleaned = (textNode.nodeValue || '').replace(/\s+/g, ' ').trim();
        if (!isMeaningfulText(cleaned)) continue;

        const meta = trackedTextNodes.get(textNode);
        const region = meta?.region || getRegionForElement(parentEl, activeTab);
        const orig = meta?.orig || cleaned;
        const key = meta?.key || `${region}::TX_${parentEl.tagName}::${stableTextHash(orig)}`;
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);

        const cardEl = parentEl.closest('.rounded-2xl, .rounded-3xl, article') as HTMLElement | null;
        items.push({
          uid: `tx_${++seq}_${key}`,
          kind: 'text',
          key,
          cardKey: cardEl?.dataset.horKey || null,
          region,
          tagName: meta?.tagName || `TEXT(${parentEl.tagName})`,
          originalText: orig,
          currentText: cleaned,
          isOverridden: contentOverrides[key] !== undefined,
          el: parentEl,
          textNode,
          cardEl
        });
      }
    }

    return items;
  }, [
    isAdmin,
    showFullInspector,
    showFindReplace,
    activeTab,
    contentOverrides,
    hiddenBlocks,
    imageOverrides,
    domScanTick,
    syncDomOverrides
  ]);

  const filteredInspectorItems = useMemo(() => {
    if (!showFullInspector) return [];
    const q = inspectorSearch.trim().toLowerCase();
    return scannedAppItems.filter((item) => {
      if (inspectorRegionFilter === 'images' && item.kind !== 'image') return false;
      if (inspectorRegionFilter === 'section' && item.region !== activeTab) return false;
      if (
        ['global_header', 'global_sidebar', 'global_footer', 'global_modal'].includes(
          inspectorRegionFilter
        ) &&
        item.region !== inspectorRegionFilter
      ) {
        return false;
      }
      if (!q) return true;
      if (item.kind === 'image') {
        return item.altText.toLowerCase().includes(q) || item.currentSrc.toLowerCase().includes(q);
      }
      return (
        item.currentText.toLowerCase().includes(q) ||
        item.originalText.toLowerCase().includes(q) ||
        item.tagName.toLowerCase().includes(q)
      );
    });
  }, [showFullInspector, scannedAppItems, inspectorRegionFilter, inspectorSearch, activeTab]);

  const compiledFind = useMemo(
    () => compileSearchRegex(findQuery, { caseSensitive, wholeWord, useRegex }),
    [findQuery, caseSensitive, wholeWord, useRegex]
  );

  type LiveMatchItem =
    | {
        id: string;
        kind: 'dom';
        key: string;
        cardKey: string | null;
        region: string;
        tagName: string;
        originalText: string;
        currentText: string;
        matchCount: number;
        el: HTMLElement;
        textNode: Text | null;
        cardEl: HTMLElement | null;
      }
    | {
        id: string;
        kind: 'custom';
        block: CustomContentBlock;
        matchedFieldNames: string[];
        matchCount: number;
        previewText: string;
      };

  const liveMatches = useMemo<LiveMatchItem[]>(() => {
    if (!isAdmin || !showFindReplace || !compiledFind.regex) return [];
    const results: LiveMatchItem[] = [];
    const rx = compiledFind.regex;

    if (findScope !== 'custom') {
      scannedAppItems.forEach((item) => {
        if (item.kind !== 'text') return;
        if (findScope === 'section' && item.region !== activeTab) return;
        if (
          findScope === 'chrome' &&
          !['global_header', 'global_sidebar', 'global_footer', 'global_modal'].includes(item.region)
        ) {
          return;
        }
        const count = countMatchesInText(item.currentText, rx);
        if (count > 0) {
          results.push({
            id: `dom_${item.key}`,
            kind: 'dom',
            key: item.key,
            cardKey: item.cardKey,
            region: item.region,
            tagName: item.tagName,
            originalText: item.originalText,
            currentText: item.currentText,
            matchCount: count,
            el: item.el,
            textNode: item.textNode,
            cardEl: item.cardEl
          });
        }
      });
    }

    if (findScope === 'all_page' || findScope === 'custom') {
      moduleCustomBlocks.forEach((block) => {
        const fields: Array<{ key: keyof CustomContentBlock; label: string; val: string }> = [
          { key: 'title', label: 'शीर्षक', val: block.title || '' },
          { key: 'santaliText', label: 'संताली', val: block.santaliText || '' },
          { key: 'hindiText', label: 'हिन्दी', val: block.hindiText || '' },
          { key: 'englishText', label: 'English', val: block.englishText || '' },
          { key: 'badge', label: 'श्रेणी', val: block.badge || '' }
        ];
        let total = 0;
        const matchedFieldNames: string[] = [];
        let previewText = '';
        fields.forEach((f) => {
          const c = countMatchesInText(f.val, rx);
          if (c > 0) {
            total += c;
            matchedFieldNames.push(f.label);
            if (!previewText) previewText = f.val;
          }
        });
        if (total > 0) {
          results.push({
            id: `custom_${block.id}`,
            kind: 'custom',
            block,
            matchedFieldNames,
            matchCount: total,
            previewText
          });
        }
      });
    }

    return results;
  }, [isAdmin, showFindReplace, compiledFind.regex, findScope, scannedAppItems, activeTab, moduleCustomBlocks]);

  const totalLiveOccurrences = useMemo(
    () => liveMatches.reduce((acc, m) => acc + m.matchCount, 0),
    [liveMatches]
  );

  // Clamp & highlight active match on screen
  useEffect(() => {
    document.querySelectorAll('[data-hor-find-active="true"]').forEach((node) => {
      node.removeAttribute('data-hor-find-active');
    });

    if (!showFindReplace || liveMatches.length === 0) {
      setActiveMatchIdx(0);
      return;
    }

    const safeIdx = Math.min(activeMatchIdx, liveMatches.length - 1);
    if (safeIdx !== activeMatchIdx) {
      setActiveMatchIdx(safeIdx);
    }

    const active = liveMatches[safeIdx];
    if (!active) return;

    let targetEl: HTMLElement | null = null;
    if (active.kind === 'dom') {
      targetEl = active.el;
    } else {
      targetEl = document.querySelector(`[data-custom-block-id="${active.block.id}"]`) as HTMLElement | null;
    }

    if (targetEl) {
      targetEl.setAttribute('data-hor-find-active', 'true');
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showFindReplace, liveMatches, activeMatchIdx]);

  const pushLiveUndo = (label: string) => {
    setLiveUndoStack((prev) => [
      {
        label,
        overridesSnapshot: { ...contentOverrides },
        customBlocksSnapshot: JSON.parse(JSON.stringify(customBlocks))
      },
      ...prev.slice(0, 9)
    ]);
  };

  const applySingleDomReplace = (
    item: { key: string; currentText: string; el: HTMLElement; textNode: Text | null },
    nextText: string
  ) => {
    if (item.textNode) {
      const meta = trackedTextNodes.get(item.textNode);
      item.textNode.nodeValue = meta ? formatTextNodeWithOriginalSpacing(meta, nextText) : nextText;
    } else if (item.el) {
      item.el.textContent = nextText;
      item.el.dataset.horOverridden = 'true';
    }
    saveContentOverride(item.key, nextText);
  };

  const handleReplaceSingleMatch = (match: LiveMatchItem) => {
    if (!compiledFind.regex) return;
    pushLiveUndo(`1 बदलाव (${activeTab})`);

    if (match.kind === 'dom') {
      const nextText = applyTextReplace(match.currentText, compiledFind.regex, replaceQuery, useRegex);
      if (nextText !== match.currentText) {
        applySingleDomReplace(match, nextText);
      }
    } else {
      const b = match.block;
      const updates: Partial<CustomContentBlock> = {
        title: applyTextReplace(b.title || '', compiledFind.regex, replaceQuery, useRegex),
        santaliText: applyTextReplace(b.santaliText || '', compiledFind.regex, replaceQuery, useRegex),
        hindiText: applyTextReplace(b.hindiText || '', compiledFind.regex, replaceQuery, useRegex),
        englishText: applyTextReplace(b.englishText || '', compiledFind.regex, replaceQuery, useRegex),
        badge: applyTextReplace(b.badge || '', compiledFind.regex, replaceQuery, useRegex)
      };
      updateCustomBlock(activeTab, b.id, updates);
    }
    setDomScanTick((t) => t + 1);
    showToast('चुना गया पाठ सफलतापूर्वक बदल दिया गया! (Undo उपलब्ध)');
  };

  const handleReplaceAllOnPage = () => {
    if (!compiledFind.regex || liveMatches.length === 0) return;
    pushLiveUndo(`सभी ${totalLiveOccurrences} बदलाव (${activeTab})`);

    const overrideUpdates: Record<string, string> = {};
    const customUpdatesById: Record<string, Partial<CustomContentBlock>> = {};
    let changedCount = 0;

    liveMatches.forEach((m) => {
      if (m.kind === 'dom') {
        const nextText = applyTextReplace(m.currentText, compiledFind.regex, replaceQuery, useRegex);
        if (nextText !== m.currentText) {
          overrideUpdates[m.key] = nextText;
          if (m.textNode) {
            const meta = trackedTextNodes.get(m.textNode);
            m.textNode.nodeValue = meta ? formatTextNodeWithOriginalSpacing(meta, nextText) : nextText;
          } else if (m.el) {
            m.el.textContent = nextText;
            m.el.dataset.horOverridden = 'true';
          }
          changedCount += m.matchCount;
        }
      } else {
        const b = m.block;
        customUpdatesById[b.id] = {
          title: applyTextReplace(b.title || '', compiledFind.regex, replaceQuery, useRegex),
          santaliText: applyTextReplace(b.santaliText || '', compiledFind.regex, replaceQuery, useRegex),
          hindiText: applyTextReplace(b.hindiText || '', compiledFind.regex, replaceQuery, useRegex),
          englishText: applyTextReplace(b.englishText || '', compiledFind.regex, replaceQuery, useRegex),
          badge: applyTextReplace(b.badge || '', compiledFind.regex, replaceQuery, useRegex)
        };
        changedCount += m.matchCount;
      }
    });

    if (Object.keys(overrideUpdates).length > 0) {
      bulkSaveContentOverrides(overrideUpdates);
    }
    if (Object.keys(customUpdatesById).length > 0) {
      bulkUpdateCustomBlocks({ [activeTab]: customUpdatesById });
    }
    setDomScanTick((t) => t + 1);
    showToast(`सभी ${changedCount} स्थान पर सफलतापूर्वक बदल दिया गया!`);
  };

  const handleUndoLiveReplace = () => {
    const latest = liveUndoStack[0];
    if (!latest) return;
    restoreContentOverridesSnapshot(latest.overridesSnapshot);
    restoreCustomBlocksSnapshot(latest.customBlocksSnapshot);
    setLiveUndoStack((prev) => prev.slice(1));
    window.setTimeout(() => {
      syncDomOverrides();
      setDomScanTick((t) => t + 1);
    }, 30);
    showToast(`पूर्ववत किया गया: ${latest.label}`);
  };

  const handleEditMatchedItem = (match: LiveMatchItem) => {
    if (match.kind === 'dom') {
      setClickedTarget({
        key: match.key,
        cardKey: match.cardKey,
        tagName: match.tagName,
        region: match.region,
        originalText: match.originalText,
        currentText: match.currentText,
        targetEl: match.el,
        targetTextNode: match.textNode,
        cardEl: match.cardEl
      });
      setEditDraft(match.currentText);
    } else {
      handleOpenEditCustom(match.block);
    }
  };

  const handleDuplicateMatchToAdd = (match: LiveMatchItem) => {
    setEditingCustomBlockId(null);
    if (match.kind === 'custom') {
      const b = match.block;
      setCustomForm({
        title: `${b.title} (नया)`,
        santaliText: b.santaliText || '',
        hindiText: b.hindiText || '',
        englishText: b.englishText || '',
        badge: b.badge || 'नया जोड़ा गया'
      });
    } else {
      setCustomForm({
        title: match.currentText.slice(0, 70),
        santaliText: match.currentText,
        hindiText: match.currentText,
        englishText: '',
        badge: 'नया जोड़ा गया'
      });
    }
    setShowAddModal(true);
  };

  const handleDeleteMatchedItem = (match: LiveMatchItem) => {
    if (match.kind === 'dom') {
      hideContentBlock(match.key);
      if (match.textNode) {
        match.textNode.nodeValue = '';
      } else if (match.el) {
        match.el.style.display = 'none';
        match.el.dataset.horHidden = 'true';
      }
      showToast('चयनित टेक्स्ट इस सेक्शन से हटा दिया गया!');
    } else {
      deleteCustomBlock(activeTab, match.block.id);
      showToast('कस्टम कार्ड हटा दिया गया!');
    }
    setDomScanTick((t) => t + 1);
  };

  const handleLocateElement = (el: HTMLElement | null) => {
    if (!el) return;
    document.querySelectorAll('[data-hor-find-active="true"]').forEach((node) => {
      node.removeAttribute('data-hor-find-active');
    });
    el.setAttribute('data-hor-find-active', 'true');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => {
      el.removeAttribute('data-hor-find-active');
    }, 2600);
  };

  return (
    <>
      {/* Hover Affordance CSS Across ALL App Regions (Header -> Sidebar -> Main -> Footer -> Modals) */}
      {isAdmin && isLiveEditMode && (
        <style>{`
          body.hor-admin-live-edit [data-hor-app-root="true"] h1:hover,
          body.hor-admin-live-edit [data-hor-app-root="true"] h2:hover,
          body.hor-admin-live-edit [data-hor-app-root="true"] h3:hover,
          body.hor-admin-live-edit [data-hor-app-root="true"] h4:hover,
          body.hor-admin-live-edit [data-hor-app-root="true"] h5:hover,
          body.hor-admin-live-edit [data-hor-app-root="true"] h6:hover,
          body.hor-admin-live-edit [data-hor-app-root="true"] p:hover,
          body.hor-admin-live-edit [data-hor-app-root="true"] li:hover,
          body.hor-admin-live-edit [data-hor-app-root="true"] td:hover,
          body.hor-admin-live-edit [data-hor-app-root="true"] th:hover,
          body.hor-admin-live-edit [data-hor-app-root="true"] label:hover,
          body.hor-admin-live-edit [data-hor-app-root="true"] blockquote:hover {
            outline: 2px dashed #d97706 !important;
            outline-offset: 2px !important;
            background-color: #fef3c7 !important;
            color: #0f172a !important;
            border-radius: 6px;
            cursor: text !important;
          }
          body.hor-admin-live-edit [data-hor-app-root="true"] img:hover {
            outline: 3px dashed #0284c7 !important;
            outline-offset: 3px !important;
            cursor: pointer !important;
            filter: brightness(1.04);
          }
          body.hor-admin-live-edit [data-admin-ui="true"] *:hover {
            outline: none !important;
            background-color: inherit;
          }
          [data-hor-app-root="true"] [data-hor-find-active="true"] {
            outline: 3px solid #d97706 !important;
            outline-offset: 4px !important;
            background-color: #fef3c7 !important;
            color: #0f172a !important;
            border-radius: 8px;
          }
        `}</style>
      )}

      {/* Admin Live Controls Bar + Full Start-to-End Inspector + Find/Replace All */}
      {isAdmin && (
        <div data-admin-ui="true" className="mb-4 space-y-2.5">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-white border border-amber-300 shadow-xs space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsLiveEditMode(!isLiveEditMode)}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
                    isLiveEditMode
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                  }`}
                >
                  <MousePointerClick className="w-4 h-4" />
                  <span>
                    {isLiveEditMode
                      ? 'क्लिक-टू-एडिट मोड: चालू'
                      : 'नेविगेशन मोड (एडिट चालू करें)'}
                  </span>
                </button>

                <button
                  onClick={handleOpenAddCustom}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>नया जोड़ें (Add)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const next = !showFullInspector;
                    setShowFullInspector(next);
                    if (next) {
                      setInspectorLimit(80);
                      setDomScanTick((t) => t + 1);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                    showFullInspector
                      ? 'bg-indigo-700 text-white'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300'
                  }`}
                  title="Header से लेकर Sidebar, मुख्य सेक्शन और Footer तक का हर 1 कंटेंट देखें व एडिट करें"
                >
                  <ListChecks className="w-4 h-4" />
                  <span>शुरू से अंत तक सभी कंटेंट (Full Page Editor)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const next = !showFindReplace;
                    setShowFindReplace(next);
                    if (next) {
                      setDomScanTick((t) => t + 1);
                      window.setTimeout(() => findInputRef.current?.focus(), 40);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                    showFindReplace
                      ? 'bg-slate-900 text-white'
                      : 'bg-white hover:bg-amber-50 text-slate-900 border border-amber-400'
                  }`}
                  title="खोजें, बदलें व सभी बदलें (Ctrl+H)"
                >
                  <Search className="w-4 h-4 text-amber-500" />
                  <span>खोजें व बदलें (Find & Replace All)</span>
                  <span className="hidden sm:inline text-[10px] font-mono opacity-75">Ctrl+H</span>
                </button>

                {hiddenCountForScope > 0 && (
                  <button
                    onClick={() => {
                      restoreAllHiddenBlocks();
                      setDomScanTick((t) => t + 1);
                      showToast('हटाए गए सभी कंटेंट वापस बहाल हो गए!');
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>हटाए गए बहाल ({hiddenCountForScope})</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-amber-900">
                {overrideCountForScope > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 tabular-nums">
                    संपादित: {overrideCountForScope}
                  </span>
                )}
                {moduleCustomBlocks.length > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 tabular-nums">
                    नए जोड़े गए: {moduleCustomBlocks.length}
                  </span>
                )}
                {hasMappedCMSTab && onOpenCMS && (
                  <button
                    onClick={onOpenCMS}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>CMS डेटाबेस</span>
                  </button>
                )}
              </div>
            </div>

            {isLiveEditMode && (
              <p className="text-[11px] text-amber-900/90 font-medium px-1">
                <strong>पूर्ण नियंत्रण (Header → Sidebar → Section → Footer):</strong> किसी भी टेक्स्ट या फ़ोटो पर <strong>क्लिक</strong> करके एडिट करें · किसी भी बटन/मेनू लिंक के लिए <strong>Right-Click</strong> (या Alt+Click) करें · या ऊपर <strong>“शुरू से अंत तक सभी कंटेंट”</strong> खोलकर हर एक आइटम संपादित करें।
              </p>
            )}
          </div>

          {/* Start-to-End Full Page Content Inspector Drawer */}
          {showFullInspector && (
            <div className="bg-white rounded-2xl border-2 border-indigo-300 shadow-sm p-4 space-y-3 text-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-indigo-600" />
                    <span>शुरू से अंत तक सभी कंटेंट संपादक (Start → End: 1 भी न छूटे)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Header, Sidebar, वर्तमान सेक्शन ({activeTab}), Footer, टेबल, बटन, लिंक व तस्वीरें — कुल{' '}
                    <strong className="text-slate-800">{filteredInspectorItems.length}</strong> आइटम मिले।
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDomScanTick((t) => t + 1)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ताज़ा स्कैन</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFullInspector(false)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Region Filter Pills + Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  {[
                    { id: 'all', label: `सभी (${scannedAppItems.length})` },
                    { id: 'global_header', label: 'Header' },
                    { id: 'global_sidebar', label: 'Sidebar' },
                    { id: 'section', label: `मुख्य सेक्शन (${activeTab})` },
                    { id: 'global_footer', label: 'Footer' },
                    { id: 'global_modal', label: 'Modals' },
                    { id: 'images', label: 'तस्वीरें (Images)' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setInspectorRegionFilter(tab.id as typeof inspectorRegionFilter);
                        setInspectorLimit(80);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg font-bold border cursor-pointer transition-colors ${
                        inspectorRegionFilter === tab.id
                          ? 'bg-indigo-700 text-white border-indigo-700'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inspectorSearch}
                    onChange={(e) => setInspectorSearch(e.target.value)}
                    placeholder="किसी भी शब्द/टैग से फ़िल्टर करें..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {inspectorSearch && (
                    <button
                      type="button"
                      onClick={() => setInspectorSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sequential List (Start -> End) */}
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-96 overflow-y-auto bg-slate-50/40">
                {filteredInspectorItems.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    इस श्रेणी में कोई दृश्य आइटम नहीं मिला। यदि कोई पॉपअप/टैब बंद है तो पहले उसे खोलें और “ताज़ा स्कैन” दबाएं।
                  </div>
                ) : (
                  filteredInspectorItems.slice(0, inspectorLimit).map((item, idx) => (
                    <div
                      key={item.uid}
                      className="p-2.5 bg-white hover:bg-indigo-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 tabular-nums">
                            #{idx + 1}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-900">
                            {getRegionLabel(item.region, activeTab)}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                            {item.tagName}
                          </span>
                          {item.isOverridden && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                              संपादित
                            </span>
                          )}
                        </div>

                        {item.kind === 'image' ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={item.currentSrc}
                              alt={item.altText}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate">{item.altText}</p>
                              <p className="text-[11px] text-slate-500 truncate">{item.currentSrc}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-900 font-medium break-words line-clamp-2">
                            {item.currentText}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            handleLocateElement(item.kind === 'image' ? item.imgEl : item.el)
                          }
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          title="पेज पर दिखाएं (Scroll to element)"
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                        </button>

                        {item.kind === 'image' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setClickedImage({
                                  key: item.key,
                                  region: item.region,
                                  originalSrc: item.originalSrc,
                                  currentSrc: item.currentSrc,
                                  altText: item.altText,
                                  imgEl: item.imgEl
                                });
                                setImageDraftUrl(imageOverrides[item.key] || item.currentSrc);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold cursor-pointer"
                            >
                              फ़ोटो बदलें
                            </button>
                            {item.isOverridden && (
                              <button
                                type="button"
                                onClick={() => {
                                  resetImageOverride(item.key);
                                  setDomScanTick((t) => t + 1);
                                  showToast('मूल तस्वीर बहाल हो गई!');
                                }}
                                className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer"
                                title="मूल तस्वीर बहाल करें"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setClickedTarget({
                                  key: item.key,
                                  cardKey: item.cardKey,
                                  tagName: item.tagName,
                                  region: item.region,
                                  originalText: item.originalText,
                                  currentText: item.currentText,
                                  targetEl: item.el,
                                  targetTextNode: item.textNode,
                                  cardEl: item.cardEl
                                });
                                setEditDraft(item.currentText);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>एडिट</span>
                            </button>

                            {item.isOverridden && (
                              <button
                                type="button"
                                onClick={() => {
                                  resetContentOverride(item.key);
                                  setDomScanTick((t) => t + 1);
                                  showToast('मूल पाठ बहाल किया गया!');
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                title="मूल पाठ बहाल करें"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                hideContentBlock(item.key);
                                if (item.textNode) {
                                  item.textNode.nodeValue = '';
                                } else {
                                  item.el.style.display = 'none';
                                  item.el.dataset.horHidden = 'true';
                                }
                                setDomScanTick((t) => t + 1);
                                showToast('यह कंटेंट हटा दिया गया!');
                              }}
                              className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 cursor-pointer"
                              title="हटाएं / छुपाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {filteredInspectorItems.length > inspectorLimit && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setInspectorLimit((n) => n + 80)}
                    className="px-4 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold cursor-pointer"
                  >
                    और आइटम दिखाएं ({filteredInspectorItems.length - inspectorLimit} शेष)
                  </button>
                </div>
              )}

              {/* Hidden items quick restore list */}
              {hiddenCountForScope > 0 && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="font-bold text-rose-800">हटाए गए आइटम बहाल करें:</span>
                  {Object.keys(hiddenBlocks)
                    .filter(
                      (k) =>
                        k.startsWith(`${activeTab}::`) ||
                        k.startsWith('global_header::') ||
                        k.startsWith('global_sidebar::') ||
                        k.startsWith('global_footer::') ||
                        k.startsWith('global_modal::')
                    )
                    .slice(0, 12)
                    .map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          restoreContentBlock(key);
                          setDomScanTick((t) => t + 1);
                          showToast('आइटम वापस बहाल किया गया!');
                        }}
                        className="px-2 py-0.5 rounded-md bg-rose-50 hover:bg-emerald-50 text-rose-800 hover:text-emerald-800 border border-rose-200 font-mono cursor-pointer"
                      >
                        ↺ {key}
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* On-Page Live Find, Replace & Replace All Drawer */}
          {showFindReplace && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3 text-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Replace className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    लाइव पूरा पेज खोजें, बदलें व Add / Edit / Delete ({activeTab})
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {liveUndoStack.length > 0 && (
                    <button
                      type="button"
                      onClick={handleUndoLiveReplace}
                      className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>अंतिम बदलाव वापस लें (Undo)</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowFindReplace(false)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                    title="बंद करें"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inputs & Options Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-center">
                <div className="lg:col-span-4 relative">
                  <input
                    ref={findInputRef}
                    type="text"
                    value={findQuery}
                    onChange={(e) => {
                      setFindQuery(e.target.value);
                      setActiveMatchIdx(0);
                    }}
                    placeholder="खोजें (Find: Header से Footer तक सभी जगह)..."
                    className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {findQuery && (
                    <button
                      type="button"
                      onClick={() => setFindQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="lg:col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const prevF = findQuery;
                      setFindQuery(replaceQuery);
                      setReplaceQuery(prevF);
                    }}
                    title="Find और Replace को आपस में बदलें (Swap)"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="lg:col-span-4">
                  <input
                    type="text"
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    placeholder="इससे बदलें (Replace with)..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="lg:col-span-3 flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCaseSensitive((v) => !v)}
                    title="Case Sensitive (Aa)"
                    className={`px-2.5 py-2 rounded-lg text-xs font-bold border cursor-pointer ${
                      caseSensitive
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Aa
                  </button>
                  <button
                    type="button"
                    onClick={() => setWholeWord((v) => !v)}
                    title="पूरा शब्द मिलान (Whole Word)"
                    className={`px-2.5 py-2 rounded-lg text-xs font-bold border cursor-pointer ${
                      wholeWord
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    अ/W
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseRegex((v) => !v)}
                    title="Regular Expression (.*)"
                    className={`px-2.5 py-2 rounded-lg text-xs font-bold border font-mono cursor-pointer ${
                      useRegex
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    .*
                  </button>

                  <select
                    value={findScope}
                    onChange={(e) => setFindScope(e.target.value as typeof findScope)}
                    className="flex-1 min-w-[115px] px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800"
                  >
                    <option value="all_page">पूरा ऐप (Start → End)</option>
                    <option value="section">केवल वर्तमान सेक्शन</option>
                    <option value="chrome">Header / Sidebar / Footer</option>
                    <option value="custom">केवल कस्टम कार्ड</option>
                  </select>
                </div>
              </div>

              {compiledFind.error && (
                <p className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
                  {compiledFind.error}
                </p>
              )}

              {/* Action Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-bold tabular-nums">
                    {findQuery
                      ? liveMatches.length > 0
                        ? `परिणाम ${activeMatchIdx + 1} / ${liveMatches.length} (${totalLiveOccurrences} मिलान)`
                        : '0 मिलान'
                      : 'खोजने के लिए ऊपर शब्द टाइप करें'}
                  </span>

                  <button
                    type="button"
                    disabled={liveMatches.length === 0}
                    onClick={() =>
                      setActiveMatchIdx((i) => (i - 1 + liveMatches.length) % liveMatches.length)
                    }
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                    title="पिछला मिलान (Prev)"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={liveMatches.length === 0}
                    onClick={() => setActiveMatchIdx((i) => (i + 1) % liveMatches.length)}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                    title="अगला मिलान (Next)"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button
                    type="button"
                    disabled={liveMatches.length === 0}
                    onClick={() => {
                      const active = liveMatches[activeMatchIdx];
                      if (active) handleReplaceSingleMatch(active);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold cursor-pointer whitespace-nowrap"
                  >
                    यह बदलें (Replace)
                  </button>
                  <button
                    type="button"
                    disabled={liveMatches.length === 0}
                    onClick={handleReplaceAllOnPage}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold cursor-pointer whitespace-nowrap"
                  >
                    सभी बदलें (Replace All · {totalLiveOccurrences})
                  </button>
                  {liveMatches.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowMatchList((v) => !v)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold cursor-pointer"
                    >
                      {showMatchList ? 'सूची छुपाएं' : `सूची दिखाएं (${liveMatches.length})`}
                    </button>
                  )}
                </div>
              </div>

              {/* Matched Items Preview + Inline Add/Edit/Replace/Delete List */}
              {showMatchList && liveMatches.length > 0 && (
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-64 overflow-y-auto bg-slate-50/50">
                  {liveMatches.slice(0, 80).map((m, idx) => {
                    const isFocused = idx === activeMatchIdx;
                    const beforeText = m.kind === 'dom' ? m.currentText : m.previewText;
                    const afterText = compiledFind.regex
                      ? applyTextReplace(beforeText, compiledFind.regex, replaceQuery, useRegex)
                      : beforeText;
                    const segments = splitHighlightSegments(beforeText, compiledFind.regex);

                    return (
                      <div
                        key={m.id}
                        onClick={() => setActiveMatchIdx(idx)}
                        className={`p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs cursor-pointer transition-colors ${
                          isFocused ? 'bg-amber-50' : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-500">
                            <span className="tabular-nums text-slate-700">#{idx + 1}</span>
                            <span>·</span>
                            <span>
                              {m.kind === 'dom'
                                ? `${getRegionLabel(m.region, activeTab)} (${m.tagName})`
                                : `कस्टम कार्ड (${m.matchedFieldNames.join(', ')})`}
                            </span>
                            <span className="tabular-nums text-amber-800">({m.matchCount} बार)</span>
                          </div>

                          <p className="text-slate-800 leading-snug break-words line-clamp-2">
                            {segments.map((seg, sIdx) =>
                              seg.isMatch ? (
                                <mark key={sIdx} className="bg-amber-200 text-slate-950 font-bold px-0.5 rounded">
                                  {seg.text}
                                </mark>
                              ) : (
                                <span key={sIdx}>{seg.text}</span>
                              )
                            )}
                          </p>

                          {replaceQuery !== findQuery && (
                            <p className="text-[11px] text-emerald-800 bg-emerald-50/70 px-2 py-0.5 rounded line-clamp-1">
                              <strong>नया:</strong> {afterText}
                            </p>
                          )}
                        </div>

                        <div
                          className="flex flex-wrap items-center gap-1 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleReplaceSingleMatch(m)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
                            title="केवल इस मिलान को बदलें"
                          >
                            बदलें
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditMatchedItem(m)}
                            className="p-1.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 cursor-pointer"
                            title="मैन्युअल संपादित / अपडेट करें (Edit)"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateMatchToAdd(m)}
                            className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 cursor-pointer"
                            title="इस पर आधारित नया कार्ड जोड़ें (Add)"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMatchedItem(m)}
                            className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 cursor-pointer"
                            title="हटाएं (Delete)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Custom Added Content Blocks for Current Module (Visible to all users, editable by Admin) */}
      {moduleCustomBlocks.length > 0 && (
        <div
          data-custom-blocks="true"
          className="mb-5 bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/50 rounded-3xl border border-amber-200 p-4 sm:p-5 space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>एडमिन द्वारा जोड़ी गई सामग्री ({moduleCustomBlocks.length})</span>
            </h3>
            {isAdmin && (
              <button
                data-admin-ui="true"
                onClick={handleOpenAddCustom}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>और जोड़ें</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {moduleCustomBlocks.map((block) => {
              const fullSpeak = [block.title, block.santaliText, block.hindiText, block.englishText]
                .filter(Boolean)
                .join('। ');

              return (
                <div
                  key={block.id}
                  data-custom-block-id={block.id}
                  onClick={() => {
                    if (isAdmin && isLiveEditMode) handleOpenEditCustom(block);
                  }}
                  className={`bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-2xs transition-all ${
                    isAdmin && isLiveEditMode
                      ? 'cursor-pointer hover:border-amber-500 hover:ring-2 hover:ring-amber-200'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {block.badge && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 mb-1">
                          {block.badge}
                        </span>
                      )}
                      <h4 className="text-base font-bold text-slate-900">{block.title}</h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakWithFemaleVoice(fullSpeak, { lang: 'hi-IN', rate: 0.9 });
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="पूरा पाठ पढ़कर सुनें"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>पूरा सुनें</span>
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            data-admin-ui="true"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditCustom(block);
                            }}
                            className="p-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 cursor-pointer"
                            title="संपादित करें"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            data-admin-ui="true"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCustomBlock(activeTab, block.id);
                              showToast('कस्टम कंटेंट हटा दिया गया!');
                            }}
                            className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 cursor-pointer"
                            title="हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {block.santaliText && (
                    <p className="text-sm font-bold text-amber-900 bg-amber-50/70 px-3 py-2 rounded-xl border border-amber-100">
                      {block.santaliText}
                    </p>
                  )}
                  {block.hindiText && (
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{block.hindiText}</p>
                  )}
                  {block.englishText && (
                    <p className="text-xs text-slate-500 italic">{block.englishText}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div
          data-admin-ui="true"
          className="fixed top-28 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-500/40 text-xs font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Inline Click-to-Edit Modal */}
      {clickedTarget && (
        <div
          data-admin-ui="true"
          className="fixed inset-0 z-50 bg-slate-200/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setClickedTarget(null)}
        >
          <div
            className="bg-white rounded-3xl border-2 border-amber-400 shadow-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                    लाइव क्लिक-टू-एडिट ({clickedTarget.tagName})
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900">
                    {getRegionLabel(clickedTarget.region, activeTab)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  कंटेंट संपादित / अपडेट / हटाएं
                </h3>
              </div>
              <button
                onClick={() => setClickedTarget(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">कंटेंट पाठ (संताली / हिन्दी / अंग्रेज़ी):</label>
                <button
                  type="button"
                  onClick={() => speakWithFemaleVoice(editDraft, { lang: 'hi-IN', rate: 0.9 })}
                  className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>पूरा सुनें</span>
                </button>
              </div>
              <textarea
                rows={5}
                value={editDraft}
                onChange={(e) => setEditDraft(e.target.value)}
                autoFocus
                className="w-full p-3.5 rounded-2xl border border-amber-300 bg-amber-50/30 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
              />
              {contentOverrides[clickedTarget.key] !== undefined && (
                <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <strong>मूल पाठ:</strong> {clickedTarget.originalText}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSaveInlineEdit}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>अपडेट सहेजें (Save)</span>
                </button>

                {contentOverrides[clickedTarget.key] !== undefined && (
                  <button
                    onClick={handleResetInlineEdit}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>मूल पाठ बहाल</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setClickedTarget(null);
                    handleOpenAddCustom();
                  }}
                  className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>नया जोड़ें</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => handleDeleteInlineElement(false)}
                  className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>यह पाठ हटाएं</span>
                </button>
                {clickedTarget.cardKey && (
                  <button
                    onClick={() => handleDeleteInlineElement(true)}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>पूरा कार्ड हटाएं</span>
                  </button>
                )}
              </div>
            </div>

            {hasMappedCMSTab && onOpenCMS && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setClickedTarget(null);
                    onOpenCMS();
                  }}
                  className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>इस सेक्शन का पूरा CMS डेटाबेस एडिटर खोलें →</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Custom Content Block Modal */}
      {showAddModal && (
        <div
          data-admin-ui="true"
          className="fixed inset-0 z-50 bg-slate-200/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <form
            onSubmit={handleSaveCustomBlock}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border-2 border-emerald-400 shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 text-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>
                  {editingCustomBlockId
                    ? 'कस्टम कंटेंट संपादित करें'
                    : `नया कंटेंट जोड़ें (${activeTab})`}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">शीर्षक (Title) *</label>
                <input
                  type="text"
                  required
                  value={customForm.title}
                  onChange={(e) => setCustomForm({ ...customForm, title: e.target.value })}
                  placeholder="जैसे: संताली लोक-संस्कार या नया शब्द..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">संताली पाठ (देवनागरी / रोमन)</label>
                <textarea
                  rows={2}
                  value={customForm.santaliText}
                  onChange={(e) => setCustomForm({ ...customForm, santaliText: e.target.value })}
                  placeholder="संताली वाक्य या मुख्य पाठ लिखें..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">हिन्दी विवरण / अर्थ *</label>
                <textarea
                  rows={3}
                  required
                  value={customForm.hindiText}
                  onChange={(e) => setCustomForm({ ...customForm, hindiText: e.target.value })}
                  placeholder="पूरा विवरण लिखें..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">अंग्रेज़ी अनुवाद (वैकल्पिक)</label>
                  <input
                    type="text"
                    value={customForm.englishText}
                    onChange={(e) => setCustomForm({ ...customForm, englishText: e.target.value })}
                    placeholder="English note..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">बैज / श्रेणी</label>
                  <input
                    type="text"
                    value={customForm.badge}
                    onChange={(e) => setCustomForm({ ...customForm, badge: e.target.value })}
                    placeholder="नया जोड़ा गया"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingCustomBlockId ? 'अपडेट करें' : 'नया जोड़ें व सेव करें'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Image Click-to-Replace Modal */}
      {clickedImage && (
        <div
          data-admin-ui="true"
          className="fixed inset-0 z-50 bg-slate-200/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setClickedImage(null)}
        >
          <div
            className="bg-white rounded-3xl border-2 border-sky-500 shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-900">
                    क्लिक-टू-रिप्लेस इमेज
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900">
                    {getRegionLabel(clickedImage.region, activeTab)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-sky-600" />
                  <span>तस्वीर बदलें / अपडेट करें ({clickedImage.altText})</span>
                </h3>
              </div>
              <button
                onClick={() => setClickedImage(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-center">
              <img
                src={imageDraftUrl || clickedImage.currentSrc}
                alt="Preview"
                className="max-h-44 rounded-xl object-contain"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  १. डिवाइस से नई फ़ोटो अपलोड करें (स्वतः कम्प्रेस):
                </label>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 font-bold cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>नई तस्वीर चुनें (Upload File)</span>
                  <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  २. या इमेज URL पेस्ट करें:
                </label>
                <input
                  type="text"
                  value={imageDraftUrl}
                  onChange={(e) => setImageDraftUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveImageOverride}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>नई तस्वीर सहेजें (Save Photo)</span>
              </button>

              {imageOverrides[clickedImage.key] && (
                <button
                  type="button"
                  onClick={handleResetImageOverride}
                  className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>मूल तस्वीर बहाल करें</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
