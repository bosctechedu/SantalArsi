import React, { useState, useMemo, useDeferredValue } from 'react';
import { useAdmin, CustomContentBlock } from '../context/AdminContext';
import { CULTURAL_MODULES_REGISTRY } from './AdminCulturalModulesStudio';
import { safeLoadFromStorage, safeSaveToStorage } from '../utils/storage';
import { SantaliWord, QuizItem } from '../types';
import {
  compileSearchRegex,
  countMatchesInText,
  applyTextReplace,
  splitHighlightSegments
} from '../utils/findReplaceEngine';
import {
  Search,
  Replace,
  ArrowLeftRight,
  Undo2,
  Edit3,
  Trash2,
  Plus,
  Copy,
  Save,
  X,
  CheckSquare,
  Square,
  Layers,
  Filter
} from 'lucide-react';

export interface CoreCmsDatasetBinding {
  key: string;
  label: string;
  storageKey: string;
  items: any[];
  setItems: (next: any[]) => void;
}

interface AdminFindReplacePanelProps {
  coreDatasets: CoreCmsDatasetBinding[];
  onSyncHeroForm?: (hero: any) => void;
  onNotification: (msg: string) => void;
}

type SearchScope =
  | 'all'
  | 'dictionary'
  | 'core_cms'
  | 'cultural_36'
  | 'hero_notices'
  | 'live_custom'
  | 'quizzes';

type FieldFilter = 'all' | 'devanagari' | 'roman' | 'hindi' | 'english';

interface MatchedFieldEntry {
  path: string; // e.g. 'wordDevanagari' | 'traditionalSongSnippet.santaliDev' | 'ingredients.0'
  label: string;
  value: string;
  matchCount: number;
}

interface UnifiedMatchRecord {
  uid: string;
  scope: Exclude<SearchScope, 'all'>;
  datasetKey: string;
  datasetLabel: string;
  recordId: string;
  recordTitle: string;
  matchedFields: MatchedFieldEntry[];
  totalOccurrences: number;
  rawRecord: any;
  extraMeta?: {
    tab?: string;
    storageKey?: string;
    index?: number;
  };
}

interface UndoBatchSnapshot {
  label: string;
  wordsSnapshot?: SantaliWord[];
  quizSnapshot?: QuizItem[];
  overridesSnapshot?: Record<string, string>;
  customBlocksSnapshot?: Record<string, CustomContentBlock[]>;
  heroSnapshot?: any;
  tickerSnapshot?: { text: string; enabled: boolean };
  lunarSnapshot?: string;
  coreSnapshots?: Record<string, { storageKey: string; items: any[] }>;
  culturalSnapshots?: Record<string, { storageKey: string; items: any[] }>;
}

function getFieldCategory(fieldName: string): FieldFilter {
  const lower = fieldName.toLowerCase();
  if (
    lower.includes('devanagari') ||
    lower.includes('santali') ||
    lower.includes('santalidev') ||
    lower.includes('namedev') ||
    lower.includes('riddledev') ||
    lower.includes('answerdev') ||
    lower.includes('warcrysantali') ||
    lower.includes('baplaseren') ||
    lower.includes('titledev')
  ) {
    return 'devanagari';
  }
  if (lower.includes('roman') || lower.includes('phonetic') || lower.includes('olchiki')) {
    return 'roman';
  }
  if (
    lower.includes('hindi') ||
    lower.includes('meaning') ||
    lower.includes('description') ||
    lower.includes('summary') ||
    lower.includes('significance') ||
    lower.includes('explanation') ||
    lower.includes('rituals') ||
    lower.includes('context') ||
    lower.includes('biography') ||
    lower.includes('title') ||
    lower.includes('notice') ||
    lower.includes('badge') ||
    lower.includes('question')
  ) {
    return 'hindi';
  }
  if (lower.includes('english')) {
    return 'english';
  }
  return 'all';
}

function humanizeFieldLabel(path: string): string {
  const map: Record<string, string> = {
    wordDevanagari: 'संताली (देवनागरी)',
    wordRoman: 'संताली (रोमन)',
    phonetic: 'उच्चारण',
    meaningHindi: 'हिन्दी अर्थ',
    meaningEnglish: 'English Meaning',
    exampleSantali: 'संताली उदाहरण',
    exampleHindi: 'हिन्दी उदाहरण',
    exampleEnglish: 'English Example',
    santaliDevanagari: 'संताली (देवनागरी)',
    santaliRoman: 'संताली (रोमन)',
    santaliText: 'संताली पाठ',
    hindiText: 'हिन्दी पाठ',
    englishText: 'English पाठ',
    nameDevanagari: 'नाम (देवनागरी)',
    nameRoman: 'नाम (रोमन)',
    nameHindi: 'हिन्दी नाम',
    titleDevanagari: 'शीर्षक (देवनागरी)',
    titleHindi: 'हिन्दी शीर्षक',
    riddleDevanagari: 'पहेली (संताली)',
    riddleHindi: 'पहेली (हिन्दी)',
    answerDevanagari: 'उत्तर (संताली)',
    answerHindi: 'उत्तर (हिन्दी)',
    title: 'शीर्षक',
    hindi: 'हिन्दी',
    english: 'English',
    description: 'विवरण',
    descriptionHindi: 'हिन्दी विवरण',
    explanation: 'व्याख्या',
    question: 'प्रश्न',
    welcomeTitle: 'मुख्य शीर्षक',
    subTitle: 'उप-शीर्षक',
    quoteSantali: 'संताली स्लोगन',
    quoteEnglish: 'English स्लोगन',
    notice: 'दैनिक नोटिस'
  };
  const top = path.split('.')[0];
  return map[path] || map[top] || path;
}

function extractStringFieldsFromObject(
  obj: any,
  prefix = '',
  depth = 0
): Array<{ path: string; value: string }> {
  if (!obj || typeof obj !== 'object' || depth > 2) return [];
  const skipKeys = new Set([
    'id',
    'createdAt',
    'updatedAt',
    'moduleTab',
    'themeColor',
    'gradient',
    'badgeColor',
    'accentColor',
    'imageUrl',
    'audioDataUrl',
    'icon'
  ]);
  const out: Array<{ path: string; value: string }> = [];

  if (Array.isArray(obj)) {
    obj.forEach((val, idx) => {
      if (typeof val === 'string' && val.trim().length > 0) {
        out.push({ path: `${prefix}.${idx}`, value: val });
      }
    });
    return out;
  }

  Object.entries(obj).forEach(([k, v]) => {
    if (skipKeys.has(k)) return;
    const fullPath = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string' && v.trim().length > 0) {
      out.push({ path: fullPath, value: v });
    } else if (Array.isArray(v)) {
      v.forEach((item, idx) => {
        if (typeof item === 'string' && item.trim().length > 0) {
          out.push({ path: `${fullPath}.${idx}`, value: item });
        }
      });
    } else if (v && typeof v === 'object') {
      out.push(...extractStringFieldsFromObject(v, fullPath, depth + 1));
    }
  });

  return out;
}

function setNestedFieldValue(obj: any, path: string, nextVal: string): any {
  const parts = path.split('.');
  if (parts.length === 1) {
    return { ...obj, [parts[0]]: nextVal };
  }
  const [head, ...rest] = parts;
  if (Array.isArray(obj[head]) && rest.length === 1 && !Number.isNaN(Number(rest[0]))) {
    const arrCopy = [...obj[head]];
    arrCopy[Number(rest[0])] = nextVal;
    return { ...obj, [head]: arrCopy };
  }
  if (obj[head] && typeof obj[head] === 'object') {
    return {
      ...obj,
      [head]: setNestedFieldValue(obj[head], rest.join('.'), nextVal)
    };
  }
  return obj;
}

export const AdminFindReplacePanel: React.FC<AdminFindReplacePanelProps> = ({
  coreDatasets,
  onSyncHeroForm,
  onNotification
}) => {
  const {
    words,
    addWord,
    updateWord,
    deleteWord,
    bulkReplaceWords,
    quizItems,
    addQuizItem,
    updateQuizItem,
    deleteQuizItem,
    bulkReplaceQuizItems,
    heroConfig,
    updateHeroConfig,
    globalTickerText,
    globalTickerEnabled,
    updateGlobalTicker,
    adminLunarAnnouncement,
    updateAdminLunarAnnouncement,
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
    deleteCustomBlock
  } = useAdmin();

  const [findQuery, setFindQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [scope, setScope] = useState<SearchScope>('all');
  const [fieldFilter, setFieldFilter] = useState<FieldFilter>('all');
  const [culturalTick, setCulturalTick] = useState(0);
  const [visibleLimit, setVisibleLimit] = useState(60);

  const [selectedUids, setSelectedUids] = useState<Record<string, boolean>>({});
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editDraftFields, setEditDraftFields] = useState<Record<string, string>>({});
  const [undoStack, setUndoStack] = useState<UndoBatchSnapshot[]>([]);

  // Quick Add New Content Drawer State
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [addTargetType, setAddTargetType] = useState<'word' | 'phrase' | 'kudum' | 'quiz' | 'custom'>('word');
  const [newWordDraft, setNewWordDraft] = useState({
    wordDevanagari: '',
    wordRoman: '',
    phonetic: '',
    meaningHindi: '',
    meaningEnglish: '',
    exampleSantali: '',
    exampleHindi: '',
    category: 'daily'
  });
  const [newPhraseDraft, setNewPhraseDraft] = useState({
    category: 'Greetings',
    santaliDevanagari: '',
    santaliRoman: '',
    hindi: '',
    english: '',
    context: ''
  });
  const [newKudumDraft, setNewKudumDraft] = useState({
    riddleDevanagari: '',
    riddleRoman: '',
    riddleHindi: '',
    answerDevanagari: '',
    answerRoman: '',
    answerHindi: '',
    explanation: ''
  });
  const [newQuizDraft, setNewQuizDraft] = useState({
    question: '',
    opt0: '',
    opt1: '',
    opt2: '',
    opt3: '',
    correctAnswerIndex: 0,
    explanation: ''
  });
  const [newCustomDraft, setNewCustomDraft] = useState({
    moduleTab: 'home',
    title: '',
    santaliText: '',
    hindiText: '',
    englishText: '',
    badge: 'नया जोड़ा गया'
  });

  const deferredFindQuery = useDeferredValue(findQuery);

  const compiled = useMemo(
    () => compileSearchRegex(deferredFindQuery, { caseSensitive, wholeWord, useRegex }),
    [deferredFindQuery, caseSensitive, wholeWord, useRegex]
  );

  // Load 22+ Cultural Modules snapshot when needed
  const culturalModulesData = useMemo(() => {
    return CULTURAL_MODULES_REGISTRY.map((mod) => ({
      mod,
      items: safeLoadFromStorage<any[]>(mod.storageKey, mod.defaultData)
    }));
  }, [culturalTick]);

  // Unified Scan across All Databases
  const allMatches = useMemo<UnifiedMatchRecord[]>(() => {
    const rx = compiled.regex;
    if (!rx) return [];

    const matches: UnifiedMatchRecord[] = [];

    const checkFields = (fields: Array<{ path: string; value: string }>) => {
      const matchedFields: MatchedFieldEntry[] = [];
      let total = 0;
      fields.forEach((f) => {
        if (fieldFilter !== 'all') {
          const cat = getFieldCategory(f.path);
          if (cat !== 'all' && cat !== fieldFilter) return;
        }
        const c = countMatchesInText(f.value, rx);
        if (c > 0) {
          total += c;
          matchedFields.push({
            path: f.path,
            label: humanizeFieldLabel(f.path),
            value: f.value,
            matchCount: c
          });
        }
      });
      return { matchedFields, total };
    };

    // 1. Dictionary Words (10k+)
    if (scope === 'all' || scope === 'dictionary') {
      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        const fields = extractStringFieldsFromObject(w);
        const { matchedFields, total } = checkFields(fields);
        if (total > 0) {
          matches.push({
            uid: `dict::${w.id}`,
            scope: 'dictionary',
            datasetKey: 'dictionary',
            datasetLabel: 'शब्दकोश (Dictionary)',
            recordId: w.id,
            recordTitle: `${w.wordDevanagari || w.wordRoman} (${w.wordRoman})`,
            matchedFields,
            totalOccurrences: total,
            rawRecord: w,
            extraMeta: { index: i }
          });
        }
      }
    }

    // 2. Hero, Global Ticker & Lunar Notice
    if (scope === 'all' || scope === 'hero_notices') {
      const heroFields = extractStringFieldsFromObject(heroConfig);
      const heroRes = checkFields(heroFields);
      if (heroRes.total > 0) {
        matches.push({
          uid: 'hero::main',
          scope: 'hero_notices',
          datasetKey: 'hero',
          datasetLabel: 'मुख्य बैनर (Hero)',
          recordId: 'hero_main',
          recordTitle: heroConfig.welcomeTitle || 'Hero Banner Config',
          matchedFields: heroRes.matchedFields,
          totalOccurrences: heroRes.total,
          rawRecord: heroConfig
        });
      }

      if (globalTickerText) {
        const tc = checkFields([{ path: 'globalTickerText', value: globalTickerText }]);
        if (tc.total > 0) {
          matches.push({
            uid: 'hero::ticker',
            scope: 'hero_notices',
            datasetKey: 'ticker',
            datasetLabel: 'ताज़ा सूचना टिकर',
            recordId: 'global_ticker',
            recordTitle: 'Global Breaking Notice Ticker',
            matchedFields: tc.matchedFields,
            totalOccurrences: tc.total,
            rawRecord: { globalTickerText, globalTickerEnabled }
          });
        }
      }

      if (adminLunarAnnouncement) {
        const lc = checkFields([{ path: 'adminLunarAnnouncement', value: adminLunarAnnouncement }]);
        if (lc.total > 0) {
          matches.push({
            uid: 'hero::lunar',
            scope: 'hero_notices',
            datasetKey: 'lunar',
            datasetLabel: 'पंचांग विशेष सूचना',
            recordId: 'lunar_notice',
            recordTitle: 'Official Santali Lunar Notice',
            matchedFields: lc.matchedFields,
            totalOccurrences: lc.total,
            rawRecord: { adminLunarAnnouncement }
          });
        }
      }
    }

    // 3. Core 17 CMS Datasets
    if (scope === 'all' || scope === 'core_cms') {
      coreDatasets.forEach((ds) => {
        ds.items.forEach((item, idx) => {
          const fields = extractStringFieldsFromObject(item);
          const { matchedFields, total } = checkFields(fields);
          if (total > 0) {
            const title =
              item.nameDevanagari ||
              item.titleDevanagari ||
              item.riddleDevanagari ||
              item.santaliDevanagari ||
              item.nameHindi ||
              item.title ||
              item.stageName ||
              item.nameRoman ||
              `Record #${idx + 1}`;
            const recId = String(item.id || idx);
            matches.push({
              uid: `core::${ds.key}::${recId}::${idx}`,
              scope: 'core_cms',
              datasetKey: ds.key,
              datasetLabel: ds.label,
              recordId: recId,
              recordTitle: title,
              matchedFields,
              totalOccurrences: total,
              rawRecord: item,
              extraMeta: { storageKey: ds.storageKey, index: idx }
            });
          }
        });
      });
    }

    // 4. Cultural 22+ Modules Registry
    if (scope === 'all' || scope === 'cultural_36') {
      culturalModulesData.forEach(({ mod, items }) => {
        items.forEach((item, idx) => {
          const fields = extractStringFieldsFromObject(item);
          const { matchedFields, total } = checkFields(fields);
          if (total > 0) {
            const title =
              item.nameDevanagari ||
              item.titleDevanagari ||
              item.santaliDevanagari ||
              item.titleHindi ||
              item.name ||
              item.title ||
              `Item #${idx + 1}`;
            const recId = String(item.id || idx);
            matches.push({
              uid: `cult::${mod.key}::${recId}::${idx}`,
              scope: 'cultural_36',
              datasetKey: mod.key,
              datasetLabel: mod.titleDevanagari,
              recordId: recId,
              recordTitle: title,
              matchedFields,
              totalOccurrences: total,
              rawRecord: item,
              extraMeta: { storageKey: mod.storageKey, index: idx }
            });
          }
        });
      });
    }

    // 5. Live Overrides & Custom Added Blocks
    if (scope === 'all' || scope === 'live_custom') {
      Object.entries(contentOverrides).forEach(([k, val]) => {
        const { matchedFields, total } = checkFields([{ path: 'overrideText', value: val }]);
        if (total > 0) {
          const tabPart = k.split('::')[0] || 'page';
          matches.push({
            uid: `ov::${k}`,
            scope: 'live_custom',
            datasetKey: 'live_override',
            datasetLabel: `लाइव टेक्स्ट (${tabPart})`,
            recordId: k,
            recordTitle: k,
            matchedFields,
            totalOccurrences: total,
            rawRecord: { key: k, value: val },
            extraMeta: { tab: tabPart }
          });
        }
      });

      Object.entries(customBlocks).forEach(([tab, blocks]) => {
        (blocks || []).forEach((b) => {
          const fields = extractStringFieldsFromObject(b);
          const { matchedFields, total } = checkFields(fields);
          if (total > 0) {
            matches.push({
              uid: `cb::${tab}::${b.id}`,
              scope: 'live_custom',
              datasetKey: 'custom_block',
              datasetLabel: `कस्टम कार्ड (${tab})`,
              recordId: b.id,
              recordTitle: b.title || b.santaliText || 'Custom Card',
              matchedFields,
              totalOccurrences: total,
              rawRecord: b,
              extraMeta: { tab }
            });
          }
        });
      });
    }

    // 6. Quiz Items
    if (scope === 'all' || scope === 'quizzes') {
      quizItems.forEach((q, idx) => {
        const fields = extractStringFieldsFromObject(q);
        const { matchedFields, total } = checkFields(fields);
        if (total > 0) {
          matches.push({
            uid: `quiz::${q.id}`,
            scope: 'quizzes',
            datasetKey: 'quiz',
            datasetLabel: 'प्रश्नोत्तरी (Quiz)',
            recordId: q.id,
            recordTitle: q.question,
            matchedFields,
            totalOccurrences: total,
            rawRecord: q,
            extraMeta: { index: idx }
          });
        }
      });
    }

    return matches;
  }, [
    compiled.regex,
    scope,
    fieldFilter,
    words,
    heroConfig,
    globalTickerText,
    globalTickerEnabled,
    adminLunarAnnouncement,
    coreDatasets,
    culturalModulesData,
    contentOverrides,
    customBlocks,
    quizItems
  ]);

  const scopeCounts = useMemo(() => {
    const counts: Record<SearchScope, number> = {
      all: allMatches.length,
      dictionary: 0,
      core_cms: 0,
      cultural_36: 0,
      hero_notices: 0,
      live_custom: 0,
      quizzes: 0
    };
    allMatches.forEach((m) => {
      counts[m.scope]++;
    });
    return counts;
  }, [allMatches]);

  const totalOccurrences = useMemo(
    () => allMatches.reduce((acc, m) => acc + m.totalOccurrences, 0),
    [allMatches]
  );

  const selectedList = useMemo(
    () => allMatches.filter((m) => selectedUids[m.uid]),
    [allMatches, selectedUids]
  );

  const buildReplacedRecord = (record: any, matchedFields: MatchedFieldEntry[], rx: RegExp): any => {
    let nextObj = { ...record };
    matchedFields.forEach((mf) => {
      const updatedStr = applyTextReplace(mf.value, rx, replaceQuery, useRegex);
      if (updatedStr !== mf.value) {
        nextObj = setNestedFieldValue(nextObj, mf.path, updatedStr);
      }
    });
    return nextObj;
  };

  // Core batch executor used by both Replace Selected & Replace All & Single Replace
  const executeBatchReplace = (targets: UnifiedMatchRecord[], label: string) => {
    if (!compiled.regex || targets.length === 0) return;
    const rx = compiled.regex;

    // 1. Capture Undo snapshot
    const snapshot: UndoBatchSnapshot = { label };

    // Group targets by storage bucket so each React state/localStorage key updates once atomically!
    const dictMap = new Map<string, SantaliWord>();
    const quizMap = new Map<string, QuizItem>();
    const overrideUpdates: Record<string, string> = {};
    const customUpdatesByTab: Record<string, Record<string, Partial<CustomContentBlock>>> = {};
    const coreUpdatesByKey = new Map<string, Map<number, any>>();
    const cultUpdatesByKey = new Map<string, Map<number, any>>();

    let heroUpdated: any = null;
    let tickerUpdated: string | null = null;
    let lunarUpdated: string | null = null;
    let replacedOccCount = 0;

    targets.forEach((t) => {
      replacedOccCount += t.totalOccurrences;
      if (t.scope === 'dictionary') {
        const nextWord = buildReplacedRecord(t.rawRecord, t.matchedFields, rx);
        dictMap.set(t.recordId, nextWord);
      } else if (t.scope === 'quizzes') {
        const nextQuiz = buildReplacedRecord(t.rawRecord, t.matchedFields, rx);
        quizMap.set(t.recordId, nextQuiz);
      } else if (t.scope === 'hero_notices') {
        if (t.datasetKey === 'hero') {
          heroUpdated = buildReplacedRecord(heroUpdated || heroConfig, t.matchedFields, rx);
        } else if (t.datasetKey === 'ticker') {
          tickerUpdated = applyTextReplace(globalTickerText, rx, replaceQuery, useRegex);
        } else if (t.datasetKey === 'lunar') {
          lunarUpdated = applyTextReplace(adminLunarAnnouncement, rx, replaceQuery, useRegex);
        }
      } else if (t.scope === 'live_custom') {
        if (t.datasetKey === 'live_override') {
          overrideUpdates[t.recordId] = applyTextReplace(t.rawRecord.value, rx, replaceQuery, useRegex);
        } else if (t.datasetKey === 'custom_block' && t.extraMeta?.tab) {
          const tab = t.extraMeta.tab;
          if (!customUpdatesByTab[tab]) customUpdatesByTab[tab] = {};
          customUpdatesByTab[tab][t.recordId] = buildReplacedRecord(t.rawRecord, t.matchedFields, rx);
        }
      } else if (t.scope === 'core_cms' && t.extraMeta?.index !== undefined) {
        if (!coreUpdatesByKey.has(t.datasetKey)) {
          coreUpdatesByKey.set(t.datasetKey, new Map());
        }
        coreUpdatesByKey
          .get(t.datasetKey)!
          .set(t.extraMeta.index, buildReplacedRecord(t.rawRecord, t.matchedFields, rx));
      } else if (t.scope === 'cultural_36' && t.extraMeta?.index !== undefined) {
        if (!cultUpdatesByKey.has(t.datasetKey)) {
          cultUpdatesByKey.set(t.datasetKey, new Map());
        }
        cultUpdatesByKey
          .get(t.datasetKey)!
          .set(t.extraMeta.index, buildReplacedRecord(t.rawRecord, t.matchedFields, rx));
      }
    });

    // Apply snapshots & updates cleanly
    if (dictMap.size > 0) {
      snapshot.wordsSnapshot = words;
      bulkReplaceWords(words.map((w) => dictMap.get(w.id) || w));
    }

    if (quizMap.size > 0) {
      snapshot.quizSnapshot = quizItems;
      bulkReplaceQuizItems(quizItems.map((q) => quizMap.get(q.id) || q));
    }

    if (heroUpdated) {
      snapshot.heroSnapshot = { ...heroConfig };
      updateHeroConfig(heroUpdated);
      if (onSyncHeroForm) onSyncHeroForm(heroUpdated);
    }

    if (tickerUpdated !== null) {
      snapshot.tickerSnapshot = { text: globalTickerText, enabled: globalTickerEnabled };
      updateGlobalTicker(tickerUpdated, globalTickerEnabled);
    }

    if (lunarUpdated !== null) {
      snapshot.lunarSnapshot = adminLunarAnnouncement;
      updateAdminLunarAnnouncement(lunarUpdated);
    }

    if (Object.keys(overrideUpdates).length > 0) {
      snapshot.overridesSnapshot = { ...contentOverrides };
      bulkSaveContentOverrides(overrideUpdates);
    }

    if (Object.keys(customUpdatesByTab).length > 0) {
      snapshot.customBlocksSnapshot = JSON.parse(JSON.stringify(customBlocks));
      bulkUpdateCustomBlocks(customUpdatesByTab);
    }

    if (coreUpdatesByKey.size > 0) {
      snapshot.coreSnapshots = {};
      coreDatasets.forEach((ds) => {
        const updatesForDs = coreUpdatesByKey.get(ds.key);
        if (!updatesForDs) return;
        snapshot.coreSnapshots![ds.key] = { storageKey: ds.storageKey, items: [...ds.items] };
        const nextItems = ds.items.map((item, idx) => updatesForDs.get(idx) || item);
        ds.setItems(nextItems);
        safeSaveToStorage(ds.storageKey, nextItems);
      });
    }

    if (cultUpdatesByKey.size > 0) {
      snapshot.culturalSnapshots = {};
      culturalModulesData.forEach(({ mod, items }) => {
        const updatesForMod = cultUpdatesByKey.get(mod.key);
        if (!updatesForMod) return;
        snapshot.culturalSnapshots![mod.key] = { storageKey: mod.storageKey, items: [...items] };
        const nextItems = items.map((item, idx) => updatesForMod.get(idx) || item);
        safeSaveToStorage(mod.storageKey, nextItems);
      });
      setCulturalTick((t) => t + 1);
    }

    setUndoStack((prev) => [snapshot, ...prev.slice(0, 7)]);
    setSelectedUids({});
    onNotification(`सफल! ${targets.length} रिकॉर्ड (${replacedOccCount} स्थानों) पर बदलाव लागू किए गए।`);
  };

  const handleUndoLastBatch = () => {
    const snap = undoStack[0];
    if (!snap) return;

    if (snap.wordsSnapshot) bulkReplaceWords(snap.wordsSnapshot);
    if (snap.quizSnapshot) bulkReplaceQuizItems(snap.quizSnapshot);
    if (snap.heroSnapshot) {
      updateHeroConfig(snap.heroSnapshot);
      if (onSyncHeroForm) onSyncHeroForm(snap.heroSnapshot);
    }
    if (snap.tickerSnapshot) updateGlobalTicker(snap.tickerSnapshot.text, snap.tickerSnapshot.enabled);
    if (snap.lunarSnapshot !== undefined) updateAdminLunarAnnouncement(snap.lunarSnapshot);
    if (snap.overridesSnapshot) restoreContentOverridesSnapshot(snap.overridesSnapshot);
    if (snap.customBlocksSnapshot) restoreCustomBlocksSnapshot(snap.customBlocksSnapshot);

    if (snap.coreSnapshots) {
      coreDatasets.forEach((ds) => {
        const prev = snap.coreSnapshots![ds.key];
        if (prev) {
          ds.setItems(prev.items);
          safeSaveToStorage(prev.storageKey, prev.items);
        }
      });
    }

    if (snap.culturalSnapshots) {
      Object.values(snap.culturalSnapshots).forEach((prev) => {
        safeSaveToStorage(prev.storageKey, prev.items);
      });
      setCulturalTick((t) => t + 1);
    }

    setUndoStack((prev) => prev.slice(1));
    onNotification(`पूर्ववत किया गया: ${snap.label}`);
  };

  // Start Inline Edit on ANY matched record
  const handleStartInlineEdit = (m: UnifiedMatchRecord) => {
    const draft: Record<string, string> = {};
    if (m.datasetKey === 'live_override') {
      draft.overrideText = m.rawRecord.value || '';
    } else if (m.datasetKey === 'ticker') {
      draft.globalTickerText = globalTickerText;
    } else if (m.datasetKey === 'lunar') {
      draft.adminLunarAnnouncement = adminLunarAnnouncement;
    } else {
      extractStringFieldsFromObject(m.rawRecord).forEach((f) => {
        draft[f.path] = f.value;
      });
    }
    setEditingUid(m.uid);
    setEditDraftFields(draft);
  };

  const handleSaveInlineEdit = (m: UnifiedMatchRecord) => {
    if (m.datasetKey === 'live_override') {
      saveContentOverride(m.recordId, editDraftFields.overrideText || '');
    } else if (m.datasetKey === 'ticker') {
      updateGlobalTicker(editDraftFields.globalTickerText || '', globalTickerEnabled);
    } else if (m.datasetKey === 'lunar') {
      updateAdminLunarAnnouncement(editDraftFields.adminLunarAnnouncement || '');
    } else {
      let updatedObj = { ...m.rawRecord };
      Object.entries(editDraftFields).forEach(([path, val]) => {
        updatedObj = setNestedFieldValue(updatedObj, path, val);
      });

      if (m.scope === 'dictionary') {
        updateWord(m.recordId, updatedObj);
      } else if (m.scope === 'quizzes') {
        updateQuizItem(m.recordId, updatedObj);
      } else if (m.datasetKey === 'hero') {
        updateHeroConfig(updatedObj);
        if (onSyncHeroForm) onSyncHeroForm(updatedObj);
      } else if (m.datasetKey === 'custom_block' && m.extraMeta?.tab) {
        updateCustomBlock(m.extraMeta.tab, m.recordId, updatedObj);
      } else if (m.scope === 'core_cms' && m.extraMeta?.index !== undefined) {
        const ds = coreDatasets.find((d) => d.key === m.datasetKey);
        if (ds) {
          const next = ds.items.map((it, idx) => (idx === m.extraMeta!.index ? updatedObj : it));
          ds.setItems(next);
          safeSaveToStorage(ds.storageKey, next);
        }
      } else if (m.scope === 'cultural_36' && m.extraMeta?.index !== undefined) {
        const found = culturalModulesData.find((c) => c.mod.key === m.datasetKey);
        if (found) {
          const next = found.items.map((it, idx) => (idx === m.extraMeta!.index ? updatedObj : it));
          safeSaveToStorage(found.mod.storageKey, next);
          setCulturalTick((t) => t + 1);
        }
      }
    }

    setEditingUid(null);
    onNotification(`"${m.recordTitle}" सफलतापूर्वक अपडेट व सहेजा गया!`);
  };

  const handleDuplicateRecord = (m: UnifiedMatchRecord) => {
    if (m.scope === 'dictionary') {
      const { id: _old, ...rest } = m.rawRecord;
      addWord({
        ...rest,
        wordDevanagari: `${rest.wordDevanagari || ''} (नया)`
      });
      onNotification('शब्दकोश में एक नई प्रतिलिपि जोड़ी गई!');
    } else if (m.scope === 'quizzes') {
      const { id: _old, ...rest } = m.rawRecord;
      addQuizItem({ ...rest, question: `${rest.question} (नया)` });
      onNotification('प्रश्नोत्तरी में एक नया प्रश्न जोड़ा गया!');
    } else if (m.datasetKey === 'custom_block' && m.extraMeta?.tab) {
      const b = m.rawRecord as CustomContentBlock;
      addCustomBlock(m.extraMeta.tab, {
        title: `${b.title} (नया)`,
        santaliText: b.santaliText,
        hindiText: b.hindiText,
        englishText: b.englishText,
        badge: b.badge || 'नया जोड़ा गया'
      });
      onNotification('कस्टम कार्ड की प्रतिलिपि जोड़ी गई!');
    } else if (m.scope === 'core_cms') {
      const ds = coreDatasets.find((d) => d.key === m.datasetKey);
      if (ds) {
        const clone = {
          ...JSON.parse(JSON.stringify(m.rawRecord)),
          id: `${m.datasetKey}_${Date.now()}`
        };
        const next = [clone, ...ds.items];
        ds.setItems(next);
        safeSaveToStorage(ds.storageKey, next);
        onNotification(`"${ds.label}" में नई प्रविष्टि जोड़ी गई!`);
      }
    } else if (m.scope === 'cultural_36') {
      const found = culturalModulesData.find((c) => c.mod.key === m.datasetKey);
      if (found) {
        const clone = {
          ...JSON.parse(JSON.stringify(m.rawRecord)),
          id: `${m.datasetKey}_${Date.now()}`
        };
        const next = [clone, ...found.items];
        safeSaveToStorage(found.mod.storageKey, next);
        setCulturalTick((t) => t + 1);
        onNotification(`"${found.mod.titleDevanagari}" में नया आइटम जोड़ा गया!`);
      }
    }
  };

  const handleDeleteRecord = (m: UnifiedMatchRecord) => {
    if (!confirm(`क्या आप सचमुच "${m.recordTitle}" को हटाना चाहते हैं?`)) return;

    if (m.scope === 'dictionary') {
      deleteWord(m.recordId);
    } else if (m.scope === 'quizzes') {
      deleteQuizItem(m.recordId);
    } else if (m.datasetKey === 'live_override') {
      resetContentOverride(m.recordId);
    } else if (m.datasetKey === 'custom_block' && m.extraMeta?.tab) {
      deleteCustomBlock(m.extraMeta.tab, m.recordId);
    } else if (m.scope === 'core_cms' && m.extraMeta?.index !== undefined) {
      const ds = coreDatasets.find((d) => d.key === m.datasetKey);
      if (ds) {
        const next = ds.items.filter((_, idx) => idx !== m.extraMeta!.index);
        ds.setItems(next);
        safeSaveToStorage(ds.storageKey, next);
      }
    } else if (m.scope === 'cultural_36' && m.extraMeta?.index !== undefined) {
      const found = culturalModulesData.find((c) => c.mod.key === m.datasetKey);
      if (found) {
        const next = found.items.filter((_, idx) => idx !== m.extraMeta!.index);
        safeSaveToStorage(found.mod.storageKey, next);
        setCulturalTick((t) => t + 1);
      }
    } else if (m.datasetKey === 'ticker') {
      updateGlobalTicker('', false);
    } else if (m.datasetKey === 'lunar') {
      updateAdminLunarAnnouncement('');
    }
    onNotification(`"${m.recordTitle}" सफलतापूर्वक हटा दिया गया!`);
  };

  const handleAddNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addTargetType === 'word') {
      if (!newWordDraft.wordDevanagari.trim() || !newWordDraft.meaningHindi.trim()) return;
      addWord({
        wordDevanagari: newWordDraft.wordDevanagari.trim(),
        wordRoman: newWordDraft.wordRoman.trim() || newWordDraft.wordDevanagari.trim(),
        phonetic: newWordDraft.phonetic.trim(),
        partOfSpeech: 'noun/common',
        category: newWordDraft.category || 'daily',
        meaningHindi: newWordDraft.meaningHindi.trim(),
        meaningEnglish: newWordDraft.meaningEnglish.trim() || newWordDraft.meaningHindi.trim(),
        exampleSantali: newWordDraft.exampleSantali.trim(),
        exampleHindi: newWordDraft.exampleHindi.trim(),
        exampleEnglish: ''
      });
      setNewWordDraft({
        wordDevanagari: '',
        wordRoman: '',
        phonetic: '',
        meaningHindi: '',
        meaningEnglish: '',
        exampleSantali: '',
        exampleHindi: '',
        category: 'daily'
      });
      onNotification('नया संताली शब्द शब्दकोश में जुड़ गया!');
    } else if (addTargetType === 'phrase') {
      const ds = coreDatasets.find((d) => d.key === 'phrases');
      if (ds && newPhraseDraft.santaliDevanagari.trim() && newPhraseDraft.hindi.trim()) {
        const next = [
          {
            id: `phr_${Date.now()}`,
            ...newPhraseDraft
          },
          ...ds.items
        ];
        ds.setItems(next);
        safeSaveToStorage(ds.storageKey, next);
        setNewPhraseDraft({
          category: 'Greetings',
          santaliDevanagari: '',
          santaliRoman: '',
          hindi: '',
          english: '',
          context: ''
        });
        onNotification('नया संताली वाक्य बोलचाल संग्रह में जुड़ गया!');
      }
    } else if (addTargetType === 'kudum') {
      const ds = coreDatasets.find((d) => d.key === 'riddles');
      if (ds && newKudumDraft.riddleDevanagari.trim() && newKudumDraft.answerHindi.trim()) {
        const next = [
          {
            id: `kudum_${Date.now()}`,
            ...newKudumDraft,
            category: 'nature'
          },
          ...ds.items
        ];
        ds.setItems(next);
        safeSaveToStorage(ds.storageKey, next);
        setNewKudumDraft({
          riddleDevanagari: '',
          riddleRoman: '',
          riddleHindi: '',
          answerDevanagari: '',
          answerRoman: '',
          answerHindi: '',
          explanation: ''
        });
        onNotification('नई कुदुम पहेली जुड़ गई!');
      }
    } else if (addTargetType === 'quiz') {
      if (!newQuizDraft.question.trim()) return;
      const options = [
        newQuizDraft.opt0.trim() || 'विकल्प 1',
        newQuizDraft.opt1.trim() || 'विकल्प 2',
        newQuizDraft.opt2.trim() || 'विकल्प 3',
        newQuizDraft.opt3.trim() || 'विकल्प 4'
      ];
      addQuizItem({
        question: newQuizDraft.question.trim(),
        options,
        correctAnswer: options[newQuizDraft.correctAnswerIndex] || options[0],
        explanation: newQuizDraft.explanation.trim()
      });
      setNewQuizDraft({
        question: '',
        opt0: '',
        opt1: '',
        opt2: '',
        opt3: '',
        correctAnswerIndex: 0,
        explanation: ''
      });
      onNotification('नया क्विज़ प्रश्न जुड़ गया!');
    } else if (addTargetType === 'custom') {
      if (!newCustomDraft.title.trim() && !newCustomDraft.hindiText.trim()) return;
      addCustomBlock(newCustomDraft.moduleTab || 'home', {
        title: newCustomDraft.title.trim(),
        santaliText: newCustomDraft.santaliText.trim(),
        hindiText: newCustomDraft.hindiText.trim(),
        englishText: newCustomDraft.englishText.trim(),
        badge: newCustomDraft.badge.trim() || 'नया जोड़ा गया'
      });
      setNewCustomDraft({
        moduleTab: 'home',
        title: '',
        santaliText: '',
        hindiText: '',
        englishText: '',
        badge: 'नया जोड़ा गया'
      });
      onNotification('नया कस्टम कार्ड लाइव मॉड्यूल में जुड़ गया!');
    }
    setShowAddDrawer(false);
  };

  const visibleMatches = allMatches.slice(0, visibleLimit);
  const allVisibleSelected =
    visibleMatches.length > 0 && visibleMatches.every((m) => Boolean(selectedUids[m.uid]));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      const next = { ...selectedUids };
      visibleMatches.forEach((m) => delete next[m.uid]);
      setSelectedUids(next);
    } else {
      const next = { ...selectedUids };
      visibleMatches.forEach((m) => {
        next[m.uid] = true;
      });
      setSelectedUids(next);
    }
  };

  const quickPresets = [
    { label: 'संताली -> संथाली', find: 'संताली', replace: 'संथाली' },
    { label: 'संथाली -> संताली', find: 'संथाली', replace: 'संताली' },
    { label: 'जोहार -> जोहार (Johar)', find: 'जोहार', replace: 'जोहार (Johar)' }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6 text-slate-900">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Replace className="w-5 h-5 text-amber-600" />
            <span>मास्टर खोजें, बदलें व Add / Edit / Update / Delete केंद्र</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            शब्दकोश ({words.length.toLocaleString()} शब्द), १७ मुख्य सेक्शन, २२+ सांस्कृतिक मॉड्यूल्स, लाइव संपादन व क्विज़ — सभी में एक साथ खोजें, सुधारें, बदलें या हटाएं।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {undoStack.length > 0 && (
            <button
              type="button"
              onClick={handleUndoLastBatch}
              className="px-3.5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
              <span>अंतिम बैच वापस लें (Undo)</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowAddDrawer((v) => !v)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>नया कंटेंट जोड़ें (Add New)</span>
          </button>
        </div>
      </div>

      {/* Add New Record Drawer */}
      {showAddDrawer && (
        <form
          onSubmit={handleAddNewSubmit}
          className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-4 text-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-200/70">
            <h3 className="text-sm font-bold text-slate-900">
              सीधे किसी भी डेटाबेस में नई प्रविष्टि जोड़ें (Add Content)
            </h3>
            <button
              type="button"
              onClick={() => setShowAddDrawer(false)}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'word', label: '📖 शब्दकोश शब्द' },
                { id: 'phrase', label: '💬 दैनिक बोलचाल वाक्य' },
                { id: 'kudum', label: '🧩 कुदुम पहेली' },
                { id: 'quiz', label: '❓ प्रश्नोत्तरी प्रश्न' },
                { id: 'custom', label: '✨ कस्टम पेज कार्ड' }
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAddTargetType(opt.id)}
                className={`px-3 py-2 rounded-xl font-bold cursor-pointer ${
                  addTargetType === opt.id
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {addTargetType === 'word' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="संताली शब्द (देवनागरी) *"
                value={newWordDraft.wordDevanagari}
                onChange={(e) => setNewWordDraft({ ...newWordDraft, wordDevanagari: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="रोमन शब्द (Word Roman)"
                value={newWordDraft.wordRoman}
                onChange={(e) => setNewWordDraft({ ...newWordDraft, wordRoman: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                required
                placeholder="हिन्दी अर्थ *"
                value={newWordDraft.meaningHindi}
                onChange={(e) => setNewWordDraft({ ...newWordDraft, meaningHindi: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="English Meaning"
                value={newWordDraft.meaningEnglish}
                onChange={(e) => setNewWordDraft({ ...newWordDraft, meaningEnglish: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="संताली वाक्य उदाहरण"
                value={newWordDraft.exampleSantali}
                onChange={(e) => setNewWordDraft({ ...newWordDraft, exampleSantali: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="हिन्दी वाक्य उदाहरण"
                value={newWordDraft.exampleHindi}
                onChange={(e) => setNewWordDraft({ ...newWordDraft, exampleHindi: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          )}

          {addTargetType === 'phrase' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="संताली वाक्य (देवनागरी) *"
                value={newPhraseDraft.santaliDevanagari}
                onChange={(e) => setNewPhraseDraft({ ...newPhraseDraft, santaliDevanagari: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="संताली वाक्य (रोमन)"
                value={newPhraseDraft.santaliRoman}
                onChange={(e) => setNewPhraseDraft({ ...newPhraseDraft, santaliRoman: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                required
                placeholder="हिन्दी अनुवाद *"
                value={newPhraseDraft.hindi}
                onChange={(e) => setNewPhraseDraft({ ...newPhraseDraft, hindi: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="English Translation"
                value={newPhraseDraft.english}
                onChange={(e) => setNewPhraseDraft({ ...newPhraseDraft, english: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          )}

          {addTargetType === 'kudum' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="कुदुम पहेली (देवनागरी) *"
                value={newKudumDraft.riddleDevanagari}
                onChange={(e) => setNewKudumDraft({ ...newKudumDraft, riddleDevanagari: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="हिन्दी प्रश्न भावार्थ"
                value={newKudumDraft.riddleHindi}
                onChange={(e) => setNewKudumDraft({ ...newKudumDraft, riddleHindi: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="उत्तर (संताली)"
                value={newKudumDraft.answerDevanagari}
                onChange={(e) => setNewKudumDraft({ ...newKudumDraft, answerDevanagari: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                required
                placeholder="उत्तर (हिन्दी) *"
                value={newKudumDraft.answerHindi}
                onChange={(e) => setNewKudumDraft({ ...newKudumDraft, answerHindi: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          )}

          {addTargetType === 'quiz' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="प्रश्न (Question) *"
                value={newQuizDraft.question}
                onChange={(e) => setNewQuizDraft({ ...newQuizDraft, question: e.target.value })}
                className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="विकल्प 1"
                value={newQuizDraft.opt0}
                onChange={(e) => setNewQuizDraft({ ...newQuizDraft, opt0: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="विकल्प 2"
                value={newQuizDraft.opt1}
                onChange={(e) => setNewQuizDraft({ ...newQuizDraft, opt1: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="विकल्प 3"
                value={newQuizDraft.opt2}
                onChange={(e) => setNewQuizDraft({ ...newQuizDraft, opt2: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="विकल्प 4"
                value={newQuizDraft.opt3}
                onChange={(e) => setNewQuizDraft({ ...newQuizDraft, opt3: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          )}

          {addTargetType === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="मॉड्यूल टैब (उदा. home, dictionary, culture)"
                value={newCustomDraft.moduleTab}
                onChange={(e) => setNewCustomDraft({ ...newCustomDraft, moduleTab: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                required
                placeholder="कार्ड शीर्षक (Title) *"
                value={newCustomDraft.title}
                onChange={(e) => setNewCustomDraft({ ...newCustomDraft, title: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="संताली पाठ (देवनागरी)"
                value={newCustomDraft.santaliText}
                onChange={(e) => setNewCustomDraft({ ...newCustomDraft, santaliText: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
              <input
                type="text"
                required
                placeholder="हिन्दी विवरण *"
                value={newCustomDraft.hindiText}
                onChange={(e) => setNewCustomDraft({ ...newCustomDraft, hindiText: e.target.value })}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>नया जोड़ें व लाइव सहेजें</span>
            </button>
          </div>
        </form>
      )}

      {/* Search & Replace Control Surface */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-5 space-y-1">
            <label className="text-xs font-bold text-slate-700 block">खोजें (Find What):</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={findQuery}
                onChange={(e) => {
                  setFindQuery(e.target.value);
                  setVisibleLimit(60);
                  setSelectedUids({});
                }}
                placeholder="कोई भी संताली (देवनागरी/रोमन), हिन्दी या English शब्द लिखें..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {findQuery && (
                <button
                  type="button"
                  onClick={() => setFindQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 flex justify-center pt-5">
            <button
              type="button"
              onClick={() => {
                const temp = findQuery;
                setFindQuery(replaceQuery);
                setReplaceQuery(temp);
              }}
              title="Find और Replace आपस में बदलें (Swap)"
              className="p-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-6 space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              इससे बदलें (Replace With — खाली छोड़ने पर शब्द हट जाएगा):
            </label>
            <input
              type="text"
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder="नया शब्द या सुधारित पाठ लिखें..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Search Options + Field Filter + Quick Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setCaseSensitive((v) => !v)}
              className={`px-3 py-2 rounded-xl font-bold border cursor-pointer ${
                caseSensitive
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="अक्षर के बड़े/छोटे रूप का मिलान (Case Sensitive)"
            >
              Aa · Case Sensitive
            </button>
            <button
              type="button"
              onClick={() => setWholeWord((v) => !v)}
              className={`px-3 py-2 rounded-xl font-bold border cursor-pointer ${
                wholeWord
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="केवल पूरा शब्द खोजें (Whole Word)"
            >
              अ/W · पूरा शब्द
            </button>
            <button
              type="button"
              onClick={() => setUseRegex((v) => !v)}
              className={`px-3 py-2 rounded-xl font-bold border font-mono cursor-pointer ${
                useRegex
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Regular Expression मोड"
            >
              .* · Regex
            </button>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={fieldFilter}
                onChange={(e) => setFieldFilter(e.target.value as FieldFilter)}
                className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="all">सभी भाषा फ़ील्ड</option>
                <option value="devanagari">केवल संताली (देवनागरी)</option>
                <option value="roman">केवल संताली (रोमन)</option>
                <option value="hindi">केवल हिन्दी अर्थ/विवरण</option>
                <option value="english">केवल English फ़ील्ड</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 font-semibold">त्वरित सुझाव:</span>
            {quickPresets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setFindQuery(p.find);
                  setReplaceQuery(p.replace);
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {compiled.error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {compiled.error}
          </div>
        )}
      </div>

      {/* Scope Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {(
          [
            { id: 'all', label: 'सभी डेटाबेस' },
            { id: 'dictionary', label: 'शब्दकोश' },
            { id: 'core_cms', label: '१७ मुख्य सेक्शन' },
            { id: 'cultural_36', label: '२२+ सांस्कृतिक मॉड्यूल्स' },
            { id: 'hero_notices', label: 'बैनर व टिकर' },
            { id: 'live_custom', label: 'लाइव एडिट व कस्टम' },
            { id: 'quizzes', label: 'प्रश्नोत्तरी' }
          ] as Array<{ id: SearchScope; label: string }>
        ).map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setScope(s.id);
              setVisibleLimit(60);
            }}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              scope === s.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{s.label}</span>
            {findQuery && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] tabular-nums ${
                  scope === s.id ? 'bg-amber-500 text-slate-950' : 'bg-white text-slate-700'
                }`}
              >
                {scopeCounts[s.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Batch Action Strip */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={visibleMatches.length === 0}
            onClick={toggleSelectAllVisible}
            className="flex items-center gap-1.5 font-bold text-slate-800 disabled:opacity-40 cursor-pointer"
          >
            {allVisibleSelected ? (
              <CheckSquare className="w-4 h-4 text-amber-700" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
            <span>दृश्य परिणाम चुनें ({visibleMatches.length})</span>
          </button>

          <span className="text-slate-600 font-semibold tabular-nums">
            {deferredFindQuery
              ? `कुल ${allMatches.length.toLocaleString()} रिकॉर्ड में ${totalOccurrences.toLocaleString()} बार मिला`
              : 'खोज शुरू करने के लिए ऊपर शब्द टाइप करें'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={selectedList.length === 0 || !compiled.regex}
            onClick={() => executeBatchReplace(selectedList, `${selectedList.length} चयनित बदलाव`)}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold cursor-pointer whitespace-nowrap"
          >
            चयनित बदलें (Replace Selected · {selectedList.length})
          </button>
          <button
            type="button"
            disabled={allMatches.length === 0 || !compiled.regex}
            onClick={() => executeBatchReplace(allMatches, `सभी ${totalOccurrences} बदलाव`)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold cursor-pointer whitespace-nowrap"
          >
            सभी बदलें (Replace All · {totalOccurrences.toLocaleString()})
          </button>
        </div>
      </div>

      {/* Results List / Empty States */}
      {!deferredFindQuery ? (
        <div className="p-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-center space-y-2">
          <Layers className="w-8 h-8 text-amber-600 mx-auto" />
          <p className="text-sm font-bold text-slate-800">
            पूरे ऐप की सामग्री एक स्थान से खोजें, सुधारें और बदलें
          </p>
          <p className="text-xs text-slate-600 max-w-xl mx-auto">
            ऊपर कोई भी संताली (देवनागरी/रोमन), हिन्दी या अंग्रेज़ी शब्द दर्ज करें। आप प्रीव्यू में पुराना और नया पाठ देखकर १ क्लिक में सिंगल या Replace All कर सकते हैं, या किसी भी रिकॉर्ड को सीधे Edit, Copy (Add) या Delete कर सकते हैं।
          </p>
        </div>
      ) : allMatches.length === 0 ? (
        <div className="p-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-center space-y-2">
          <p className="text-sm font-bold text-slate-800">
            “{deferredFindQuery}” के लिए इस श्रेणी में कोई मिलान नहीं मिला।
          </p>
          <p className="text-xs text-slate-600">
            कृपया वर्तनी जांचें, फ़ील्ड फ़िल्टर बदलें या ऊपर “सभी डेटाबेस” चुनें।
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleMatches.map((m, idx) => {
            const isSelected = Boolean(selectedUids[m.uid]);
            const isEditing = editingUid === m.uid;

            return (
              <div
                key={m.uid}
                className={`rounded-2xl border p-4 space-y-3 transition-colors ${
                  isSelected
                    ? 'bg-amber-50/50 border-amber-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Row Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedUids((prev) => ({ ...prev, [m.uid]: !prev[m.uid] }))
                      }
                      className="mt-0.5 sm:mt-0 text-slate-600 hover:text-amber-700 cursor-pointer shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500">
                        <span className="tabular-nums text-slate-700">#{idx + 1}</span>
                        <span>·</span>
                        <span className="text-amber-800">{m.datasetLabel}</span>
                        <span>·</span>
                        <span className="tabular-nums text-emerald-700">
                          {m.totalOccurrences} मिलान
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{m.recordTitle}</h4>
                    </div>
                  </div>

                  {/* CRUD + Single Replace Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs shrink-0">
                    <button
                      type="button"
                      onClick={() => executeBatchReplace([m], `1 रिकॉर्ड (${m.recordTitle})`)}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer whitespace-nowrap"
                    >
                      यह बदलें (Replace)
                    </button>

                    <button
                      type="button"
                      onClick={() => (isEditing ? setEditingUid(null) : handleStartInlineEdit(m))}
                      className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer ${
                        isEditing
                          ? 'bg-slate-900 text-white'
                          : 'bg-sky-100 hover:bg-sky-200 text-sky-900'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditing ? 'बंद करें' : 'संपादित (Edit)'}</span>
                    </button>

                    {m.scope !== 'hero_notices' && m.datasetKey !== 'live_override' && (
                      <button
                        type="button"
                        onClick={() => handleDuplicateRecord(m)}
                        className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 cursor-pointer"
                        title="प्रतिलिपि बनाकर नया जोड़ें (Add Copy)"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {m.datasetKey !== 'hero' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(m)}
                        className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 cursor-pointer"
                        title="हटाएं (Delete)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Before -> After Diff Preview OR Full Inline Edit Form */}
                {isEditing ? (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(editDraftFields).map(([path, val]) => (
                        <div key={path} className={val.length > 75 ? 'md:col-span-2' : ''}>
                          <label className="font-bold text-slate-700 block mb-1">
                            {humanizeFieldLabel(path)}
                          </label>
                          {val.length > 75 ? (
                            <textarea
                              rows={2}
                              value={val}
                              onChange={(e) =>
                                setEditDraftFields((prev) => ({ ...prev, [path]: e.target.value }))
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          ) : (
                            <input
                              type="text"
                              value={val}
                              onChange={(e) =>
                                setEditDraftFields((prev) => ({ ...prev, [path]: e.target.value }))
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setEditingUid(null)}
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold cursor-pointer"
                      >
                        रद्द करें
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveInlineEdit(m)}
                        className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>अपडेट सहेजें (Update & Save)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    {m.matchedFields.map((mf) => {
                      const segs = splitHighlightSegments(mf.value, compiled.regex);
                      const afterVal = applyTextReplace(
                        mf.value,
                        compiled.regex,
                        replaceQuery,
                        useRegex
                      );
                      return (
                        <div
                          key={mf.path}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1"
                        >
                          <div className="text-[11px] font-bold text-slate-500">{mf.label}</div>
                          <p className="text-slate-900 leading-relaxed break-words">
                            {segs.map((seg, sIdx) =>
                              seg.isMatch ? (
                                <mark
                                  key={sIdx}
                                  className="bg-amber-200 text-slate-950 font-bold px-0.5 rounded"
                                >
                                  {seg.text}
                                </mark>
                              ) : (
                                <span key={sIdx}>{seg.text}</span>
                              )
                            )}
                          </p>
                          {afterVal !== mf.value && (
                            <p className="text-emerald-900 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-lg break-words">
                              <strong>नया पाठ:</strong> {afterVal}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {allMatches.length > visibleLimit && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setVisibleLimit((l) => l + 60)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer tabular-nums"
              >
                और परिणाम दिखाएं ({allMatches.length - visibleLimit} शेष)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
