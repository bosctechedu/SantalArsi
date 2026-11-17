import React, { Suspense, lazy, useEffect, useMemo, useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { useAdmin, CustomContentBlock } from '../context/AdminContext';
import { speakWithFemaleVoice } from '../utils/speech';

const LazyUniversalLiveEditor = lazy(() =>
  import('./UniversalLiveEditor').then((m) => ({ default: m.UniversalLiveEditor }))
);

interface LiveOverridesGateProps {
  activeTab: string;
  onOpenCMS?: () => void;
  hasMappedCMSTab?: boolean;
}

interface TextNodeMeta {
  key: string;
  orig: string;
  region: string;
  leadingSpace: string;
  trailingSpace: string;
}

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

const SKIP_TEXT_PARENTS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'SVG',
  'PATH',
  'INPUT',
  'TEXTAREA',
  'SELECT',
  'OPTION'
]);

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
  return /[a-zA-Z\u0900-\u097F\u1C50-\u1C7F]/.test(cleaned);
}

function isPureTextElement(el: HTMLElement): boolean {
  for (let i = 0; i < el.childNodes.length; i++) {
    if (el.childNodes[i].nodeType !== Node.TEXT_NODE) return false;
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

function getRegionForElement(el: HTMLElement | null, activeTab: string): string {
  if (!el) return activeTab;
  const regionHost = el.closest('[data-edit-region]') as HTMLElement | null;
  if (regionHost?.dataset.editRegion) return regionHost.dataset.editRegion;
  if (el.closest('main[data-workspace-main="true"]')) return activeTab;
  if (el.closest('header')) return 'global_header';
  if (el.closest('aside')) return 'global_sidebar';
  if (el.closest('footer')) return 'global_footer';
  return 'global_modal';
}

const PublicCustomBlocksView: React.FC<{ blocks: CustomContentBlock[] }> = React.memo(({ blocks }) => {
  if (blocks.length === 0) return null;
  return (
    <div data-custom-blocks="true" className="mb-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
          जोड़ी गई विशेष सामग्री ({blocks.length})
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {blocks.map((block) => {
          const fullSpeak = [block.title, block.santaliText, block.hindiText, block.englishText]
            .filter(Boolean)
            .join('. ');
          return (
            <div
              key={block.id}
              data-custom-block-id={block.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-2xs"
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
                <button
                  type="button"
                  onClick={() => speakWithFemaleVoice(fullSpeak, { lang: 'hi-IN', rate: 0.9 })}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  title="पूरा पाठ पढ़कर सुनें"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>पूरा सुनें</span>
                </button>
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
  );
});

const PublicOverridesApplier: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { contentOverrides, hiddenBlocks, imageOverrides } = useAdmin();
  const rafRef = useRef<number | null>(null);

  const hasAnyOverrides = useMemo(
    () =>
      Object.keys(contentOverrides).length > 0 ||
      Object.keys(hiddenBlocks).length > 0 ||
      Object.keys(imageOverrides).length > 0,
    [contentOverrides, hiddenBlocks, imageOverrides]
  );

  useEffect(() => {
    if (!hasAnyOverrides) return;

    const appRoot =
      (document.querySelector('[data-hor-app-root="true"]') as HTMLElement | null) || document.body;
    if (!appRoot) return;

    const applyOverrides = () => {
      const candidates = appRoot.querySelectorAll(EDITABLE_SELECTOR);
      candidates.forEach((node) => {
        const el = node as HTMLElement;
        if (isInsideSkippedAdminContainer(el)) return;
        const leaf = isPureTextElement(el);
        const isStructural = CONTENT_LEAF_TAGS.has(el.tagName);
        if (!leaf && !isStructural) return;

        const region = getRegionForElement(el, activeTab);
        if (leaf || el.children.length === 0) {
          if (!el.dataset.horOrigText || el.dataset.horRegion !== region) {
            const raw = (el.textContent || '').replace(/\s+/g, ' ').trim();
            if (!isMeaningfulText(raw)) return;
            if (!el.dataset.horOrigText) el.dataset.horOrigText = raw;
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
          const ov = contentOverrides[key];
          if (ov !== undefined) {
            if (el.textContent !== ov) el.textContent = ov;
            el.dataset.horOverridden = 'true';
          }
        }
      });

      const walker = document.createTreeWalker(appRoot, NodeFilter.SHOW_TEXT);
      let cur: Node | null = walker.nextNode();
      while (cur) {
        const textNode = cur as Text;
        cur = walker.nextNode();
        const parentEl = textNode.parentElement;
        if (!parentEl || SKIP_TEXT_PARENTS.has(parentEl.tagName)) continue;
        if (isInsideSkippedAdminContainer(parentEl)) continue;
        if (parentEl.dataset.horKey && isPureTextElement(parentEl)) continue;

        let meta = trackedTextNodes.get(textNode);
        const rawVal = textNode.nodeValue || '';
        const region = getRegionForElement(parentEl, activeTab);
        if (!meta || meta.region !== region) {
          const cleaned = rawVal.replace(/\s+/g, ' ').trim();
          if (!isMeaningfulText(cleaned)) continue;
          const orig = meta?.orig || cleaned;
          meta = {
            key: `${region}::TX_${parentEl.tagName}::${stableTextHash(orig)}`,
            orig,
            region,
            leadingSpace: /^\s+/.test(rawVal) ? ' ' : '',
            trailingSpace: /\s+$/.test(rawVal) ? ' ' : ''
          };
          trackedTextNodes.set(textNode, meta);
        }

        if (hiddenBlocks[meta.key]) {
          if (textNode.nodeValue !== '') textNode.nodeValue = '';
        } else if (contentOverrides[meta.key] !== undefined) {
          const target = `${meta.leadingSpace}${contentOverrides[meta.key]}${meta.trailingSpace}`;
          if (textNode.nodeValue !== target) textNode.nodeValue = target;
        }
      }

      if (Object.keys(imageOverrides).length > 0 || Object.keys(hiddenBlocks).length > 0) {
        appRoot.querySelectorAll('img').forEach((imgNode) => {
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
          }
          const ovSrc = imageOverrides[imgKey];
          if (ovSrc && img.src !== ovSrc) {
            img.src = ovSrc;
            img.dataset.horImgOverridden = 'true';
          }
        });
      }
    };

    applyOverrides();

    const observer = new MutationObserver(() => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        applyOverrides();
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
  }, [hasAnyOverrides, activeTab, contentOverrides, hiddenBlocks, imageOverrides]);

  return null;
};

export const LiveOverridesGate: React.FC<LiveOverridesGateProps> = ({
  activeTab,
  onOpenCMS,
  hasMappedCMSTab
}) => {
  const { isAdmin, customBlocks } = useAdmin();
  const blocksForTab = customBlocks[activeTab] || [];

  if (isAdmin) {
    return (
      <Suspense fallback={null}>
        <LazyUniversalLiveEditor
          activeTab={activeTab}
          onOpenCMS={onOpenCMS}
          hasMappedCMSTab={hasMappedCMSTab}
        />
      </Suspense>
    );
  }

  return (
    <>
      <PublicOverridesApplier activeTab={activeTab} />
      <PublicCustomBlocksView blocks={blocksForTab} />
    </>
  );
};
