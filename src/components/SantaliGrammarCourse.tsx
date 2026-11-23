import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  SANTALI_GRAMMAR_CHAPTERS,
  SANTALI_GRAMMAR_QUIZ_BANK,
  GRAMMAR_TIERS,
  GrammarChapter,
  GrammarQuizQuestion,
  GrammarTierId,
} from '../data/santaliGrammarCourseData';
import { speakWithFemaleVoice } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Copy,
  Check,
  Search,
  Award,
  ListChecks,
  GraduationCap,
  X,
  Menu,
} from 'lucide-react';

const PROGRESS_STORAGE_KEY = 'hor_katha_grammar_course_progress_v1';
const QUIZ_POOL_STORAGE_KEY = 'hor_katha_grammar_quiz_used_v1';

interface ShuffledQuestion {
  id: string;
  chapterId: string;
  questionHi: string;
  questionEn: string;
  options: string[];
  correctIndex: number;
  explanationHi: string;
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function prepareQuestion(q: GrammarQuizQuestion): ShuffledQuestion {
  const indexed = q.options.map((text, idx) => ({ text, isCorrect: idx === q.correctIndex }));
  const shuffled = shuffleArray(indexed);
  const nextCorrectIndex = shuffled.findIndex((item) => item.isCorrect);
  return {
    id: q.id,
    chapterId: q.chapterId,
    questionHi: q.questionHi,
    questionEn: q.questionEn,
    options: shuffled.map((item) => item.text),
    correctIndex: nextCorrectIndex >= 0 ? nextCorrectIndex : 0,
    explanationHi: q.explanationHi,
  };
}

export const SantaliGrammarCourse: React.FC = () => {
  const [workspaceMode, setWorkspaceMode] = useState<'course' | 'mega_quiz'>('course');
  const [activeChapterId, setActiveChapterId] = useState<string>(SANTALI_GRAMMAR_CHAPTERS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<GrammarTierId | 'all'>('all');
  const [showOlChiki, setShowOlChiki] = useState(true);
  const [mobileSyllabusOpen, setMobileSyllabusOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Completed chapters persisted locally
  const [completedChapters, setCompletedChapters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(completedChapters));
    } catch {
      // ignore storage quota errors
    }
  }, [completedChapters]);

  // Embedded Chapter Quiz state (resets on chapter switch)
  const [chapterQuizItems, setChapterQuizItems] = useState<ShuffledQuestion[]>([]);
  const [chapterAnswers, setChapterAnswers] = useState<Record<string, number>>({});

  // Full-Syllabus Mega Quiz state (zero-repeat across sets)
  const [megaQuizSize, setMegaQuizSize] = useState<15 | 30 | 60>(15);
  const [usedMegaIds, setUsedMegaIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(QUIZ_POOL_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [megaQuestions, setMegaQuestions] = useState<ShuffledQuestion[]>([]);
  const [megaIndex, setMegaIndex] = useState(0);
  const [megaAnswers, setMegaAnswers] = useState<Record<string, number>>({});
  const [megaFinished, setMegaFinished] = useState(false);

  const activeChapter: GrammarChapter = useMemo(
    () => SANTALI_GRAMMAR_CHAPTERS.find((c) => c.id === activeChapterId) || SANTALI_GRAMMAR_CHAPTERS[0],
    [activeChapterId]
  );

  const activeChapterIndex = useMemo(
    () => SANTALI_GRAMMAR_CHAPTERS.findIndex((c) => c.id === activeChapter.id),
    [activeChapter.id]
  );

  // Prepare fresh shuffled chapter quiz whenever chapter changes
  useEffect(() => {
    const raw = SANTALI_GRAMMAR_QUIZ_BANK.filter((q) => q.chapterId === activeChapter.id);
    setChapterQuizItems(shuffleArray(raw).map(prepareQuestion));
    setChapterAnswers({});
  }, [activeChapter.id]);

  // Persist used mega-quiz question IDs
  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_POOL_STORAGE_KEY, JSON.stringify(usedMegaIds));
    } catch {
      // ignore
    }
  }, [usedMegaIds]);

  const startMegaQuiz = useCallback(
    (requestedSize: 15 | 30 | 60, resetUsedFirst = false) => {
      const currentUsed = resetUsedFirst ? [] : usedMegaIds;
      const unseen = SANTALI_GRAMMAR_QUIZ_BANK.filter((q) => !currentUsed.includes(q.id));
      let chosenRaw: GrammarQuizQuestion[] = [];
      let nextUsed: string[] = [];

      if (unseen.length >= requestedSize) {
        chosenRaw = shuffleArray(unseen).slice(0, requestedSize);
        nextUsed = [...currentUsed, ...chosenRaw.map((q) => q.id)];
      } else {
        // Use remaining unseen first, then wrap cleanly for a brand-new full cycle
        const shuffledUnseen = shuffleArray(unseen);
        const remainingNeeded = Math.min(requestedSize, SANTALI_GRAMMAR_QUIZ_BANK.length) - shuffledUnseen.length;
        const seenPool = shuffleArray(
          SANTALI_GRAMMAR_QUIZ_BANK.filter((q) => !shuffledUnseen.some((u) => u.id === q.id))
        ).slice(0, remainingNeeded);
        chosenRaw = [...shuffledUnseen, ...seenPool];
        nextUsed = chosenRaw.map((q) => q.id);
      }

      setMegaQuizSize(requestedSize);
      setMegaQuestions(chosenRaw.map(prepareQuestion));
      setMegaIndex(0);
      setMegaAnswers({});
      setMegaFinished(false);
      setUsedMegaIds(nextUsed);
    },
    [usedMegaIds]
  );

  // Initialize mega quiz when first switching to mega_quiz mode
  useEffect(() => {
    if (workspaceMode === 'mega_quiz' && megaQuestions.length === 0) {
      startMegaQuiz(megaQuizSize, false);
    }
  }, [workspaceMode, megaQuestions.length, megaQuizSize, startMegaQuiz]);

  const filteredChapters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SANTALI_GRAMMAR_CHAPTERS.filter((ch) => {
      if (tierFilter !== 'all' && ch.tier !== tierFilter) return false;
      if (!q) return true;
      return (
        ch.titleSantaliDev.toLowerCase().includes(q) ||
        ch.titleSantaliRoman.toLowerCase().includes(q) ||
        ch.titleHi.toLowerCase().includes(q) ||
        ch.titleEn.toLowerCase().includes(q) ||
        ch.number.includes(q) ||
        ch.summaryHi.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, tierFilter]);

  const toggleChapterComplete = (id: string) => {
    setCompletedChapters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectChapter = (id: string) => {
    setActiveChapterId(id);
    setWorkspaceMode('course');
    setMobileSyllabusOpen(false);
  };

  const handleSpeak = (text: string) => {
    speakWithFemaleVoice(text, { lang: 'hi-IN', rate: 0.88 });
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1800);
  };

  const completionPct = Math.round((completedChapters.length / SANTALI_GRAMMAR_CHAPTERS.length) * 100);

  // Chapter quiz tally
  const chapterAnsweredCount = Object.keys(chapterAnswers).length;
  const chapterCorrectCount = chapterQuizItems.reduce(
    (acc, q) => acc + (chapterAnswers[q.id] === q.correctIndex ? 1 : 0),
    0
  );

  // Mega quiz tally
  const currentMegaQ = megaQuestions[megaIndex];
  const megaAnsweredCount = Object.keys(megaAnswers).length;
  const megaCorrectCount = megaQuestions.reduce(
    (acc, q) => acc + (megaAnswers[q.id] === q.correctIndex ? 1 : 0),
    0
  );
  const megaWrongCount = megaAnsweredCount - megaCorrectCount;
  const remainingUnseenCount = Math.max(0, SANTALI_GRAMMAR_QUIZ_BANK.length - usedMegaIds.length);

  const chapterMap = useMemo(() => {
    const map: Record<string, GrammarChapter> = {};
    for (const c of SANTALI_GRAMMAR_CHAPTERS) map[c.id] = c;
    return map;
  }, []);

  const renderSyllabusList = () => (
    <div className="space-y-4">
      {/* Progress Summary */}
      <div className="space-y-2 pb-3 border-b border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold text-slate-800">पाठ्यक्रम प्रगति (Progress)</span>
          <span className="font-semibold tabular-nums text-teal-800">
            {completedChapters.length} / {SANTALI_GRAMMAR_CHAPTERS.length} ({completionPct}%)
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-700 transition-all duration-300"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Search Syllabus */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="अध्याय खोजें (जैसे काल, कारक, निबंध)..."
          className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="खोज साफ़ करें"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Tier Filter Segmented Control */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
        <button
          type="button"
          onClick={() => setTierFilter('all')}
          className={`px-2 py-1.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap truncate ${
            tierFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          सभी २० अध्याय
        </button>
        <button
          type="button"
          onClick={() => setTierFilter('foundations')}
          className={`px-2 py-1.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap truncate ${
            tierFilter === 'foundations' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          खंड १ (01–05)
        </button>
        <button
          type="button"
          onClick={() => setTierFilter('parts_of_speech')}
          className={`px-2 py-1.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap truncate ${
            tierFilter === 'parts_of_speech' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          खंड २ (06–11)
        </button>
        <button
          type="button"
          onClick={() => setTierFilter('syntax_verbs')}
          className={`px-2 py-1.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap truncate ${
            tierFilter === 'syntax_verbs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          खंड ३ (12–16)
        </button>
        <button
          type="button"
          onClick={() => setTierFilter('composition')}
          className={`col-span-2 px-2 py-1.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap truncate ${
            tierFilter === 'composition' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          खंड ४: विलोम, कुदुम, पत्र व निबंध (17–20)
        </button>
      </div>

      {/* Chapter List Grouped by Tier */}
      <div className="space-y-4 max-h-[62vh] overflow-y-auto pr-1">
        {GRAMMAR_TIERS.map((tier) => {
          const tierItems = filteredChapters.filter((c) => c.tier === tier.id);
          if (tierItems.length === 0) return null;
          return (
            <div key={tier.id} className="space-y-1.5">
              <div className="px-1 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">{tier.labelHi}</span>
                <span className="tabular-nums">{tier.range}</span>
              </div>
              <div className="space-y-1">
                {tierItems.map((ch) => {
                  const isActive = workspaceMode === 'course' && activeChapter.id === ch.id;
                  const isDone = completedChapters.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleSelectChapter(ch.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors cursor-pointer flex items-start gap-2.5 ${
                        isActive
                          ? 'bg-teal-50/90 border-teal-600 text-slate-900'
                          : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200 text-slate-700'
                      }`}
                    >
                      <span
                        className={`text-xs font-mono tabular-nums font-semibold shrink-0 mt-0.5 ${
                          isActive ? 'text-teal-800' : 'text-slate-400'
                        }`}
                      >
                        {ch.number}.
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className={`text-xs font-semibold leading-snug ${isActive ? 'text-teal-950' : 'text-slate-900'}`}>
                          {ch.titleSantaliDev}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {ch.titleHi}
                        </div>
                      </div>
                      {isDone && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-label="पूर्ण" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredChapters.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-500">
            कोई अध्याय नहीं मिला। कृपया दूसरा शब्द खोजें।
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-6">
      {/* Top Course Header — Clean Editorial Framing */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-teal-800">Santal आ़रसी व्याकरण पाठ्यक्रम</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">20 मौलिक अध्याय</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{SANTALI_GRAMMAR_QUIZ_BANK.length} अभ्यास प्रश्न</span>
              <span aria-hidden="true">·</span>
              <span>देवनागरी, रोमन व ओल चिकी</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              संपूर्ण संताली व्याकरण पाठ्यक्रम एवं अभ्यास क्विज़
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              ध्वनि, वर्णमाला, रुद्ध व्यंजन, संज्ञा, लिंग, तीन वचन, कारक, समावेशी-अपवर्जक सर्वनाम, काल, वाच्य,
              वाक्य-रचना, विलोम, कुदुम, पत्र-लेखन और मौलिक संताली निबंधों का व्यवस्थित अध्ययन एवं प्रमाणिक परीक्षण।
            </p>
          </div>

          {/* Interactive Workspace Mode Switcher + Mobile Syllabus Toggle */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setMobileSyllabusOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Menu className="w-4 h-4" />
              <span>अध्याय सूची (20)</span>
            </button>

            <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setWorkspaceMode('course')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  workspaceMode === 'course'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>पाठ्यक्रम अध्ययन</span>
              </button>
              <button
                type="button"
                onClick={() => setWorkspaceMode('mega_quiz')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  workspaceMode === 'mega_quiz'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>संपूर्ण व्याकरण क्विज़</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Syllabus Slide-Over */}
      {mobileSyllabusOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-slate-900/45 flex"
          onClick={() => setMobileSyllabusOpen(false)}
        >
          <div
            className="w-80 max-w-[88vw] bg-white h-full p-4 overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-900">व्याकरण अध्याय सूची</span>
              <button
                type="button"
                onClick={() => setMobileSyllabusOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                aria-label="बंद करें"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderSyllabusList()}
          </div>
        </div>
      )}

      {/* Two-Zone Educational Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[296px_1fr] gap-6 items-start">
        {/* Left Zone: Desktop Syllabus Navigator */}
        <aside className="hidden lg:block bg-white border border-slate-200 rounded-2xl p-4 sticky top-[112px]">
          {renderSyllabusList()}
        </aside>

        {/* Right Zone: Main Learning Stage OR Mega Quiz Stage */}
        <div className="min-w-0 space-y-6">
          {workspaceMode === 'course' ? (
            <>
              {/* Active Chapter Card */}
              <article className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-7">
                {/* Chapter Meta & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-slate-200">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono tabular-nums font-semibold text-teal-800">
                        अध्याय {activeChapter.number} / 20
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {GRAMMAR_TIERS.find((t) => t.id === activeChapter.tier)?.labelHi}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{chapterQuizItems.length} अभ्यास प्रश्न</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                      {activeChapter.titleSantaliDev}{' '}
                      <span className="text-base sm:text-lg font-medium text-slate-500">
                        ({activeChapter.titleSantaliRoman})
                      </span>
                    </h2>

                    {showOlChiki && (
                      <div className="text-base font-semibold text-amber-800 tracking-wide">
                        {toOlChikiAuto(activeChapter.titleSantaliDev)}
                      </div>
                    )}

                    <p className="text-sm font-semibold text-slate-800 pt-1">
                      {activeChapter.titleHi} — <span className="font-normal text-slate-600">{activeChapter.titleEn}</span>
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                      {activeChapter.summaryHi}
                    </p>
                  </div>

                  {/* Chapter Controls */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowOlChiki((v) => !v)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        showOlChiki
                          ? 'bg-amber-50 border-amber-300 text-amber-900'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {showOlChiki ? 'ओल चिकी: चालू' : 'ओल चिकी: बंद'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSpeak(`${activeChapter.titleSantaliDev}. ${activeChapter.titleHi}. ${activeChapter.summaryHi}`)
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>अध्याय सुनें</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleChapterComplete(activeChapter.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        completedChapters.includes(activeChapter.id)
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {completedChapters.includes(activeChapter.id) ? 'पूर्ण चिह्नित' : 'पूर्ण चिह्नित करें'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Key Formula Strip (Clean Surface Contrast, No Thick Left Border) */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-xs font-semibold text-teal-800">
                    स्मरण सूत्र (Key Grammar Rule)
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                    {activeChapter.keyFormula}
                  </p>
                </div>

                {/* Concept Explanations */}
                <section className="space-y-5">
                  <h3 className="text-base font-bold text-slate-900">
                    मुख्य व्याकरण नियम (Core Rules &amp; Concepts)
                  </h3>
                  <div className="space-y-4">
                    {activeChapter.rules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="pb-4 border-b border-slate-100 last:border-b-0 last:pb-0 space-y-1.5"
                      >
                        <h4 className="text-sm sm:text-base font-semibold text-slate-900">
                          {rule.heading}
                        </h4>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {rule.explanationHi}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {rule.explanationEn}
                        </p>
                        {rule.santaliDev && (
                          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                            <span className="font-semibold text-teal-900 bg-teal-50/70 px-2.5 py-1 rounded-md border border-teal-200/70">
                              {rule.santaliDev}
                            </span>
                            {rule.santaliRoman && (
                              <span className="font-mono text-slate-600">{rule.santaliRoman}</span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleSpeak(rule.santaliDev!)}
                              className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>सुनें</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Comparative Reference Table (if present) */}
                {activeChapter.table && (
                  <section className="space-y-3">
                    <h3 className="text-base font-bold text-slate-900">
                      {activeChapter.table.title}
                    </h3>
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                            {activeChapter.table.columns.map((col, idx) => (
                              <th key={idx} className="px-4 py-3 font-semibold whitespace-nowrap">
                                {col}
                              </th>
                            ))}
                            <th className="px-3 py-3 font-semibold text-right whitespace-nowrap">उच्चारण</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeChapter.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`px-4 py-3 align-top ${
                                    cIdx === 0 ? 'font-semibold text-slate-900' : 'text-slate-700'
                                  }`}
                                >
                                  <div>{cell}</div>
                                  {showOlChiki && cIdx === 0 && /[\u0900-\u097F]/.test(cell) && (
                                    <div className="text-[11px] text-amber-800 mt-0.5">
                                      {toOlChikiAuto(cell.split('(')[0].trim())}
                                    </div>
                                  )}
                                </td>
                              ))}
                              <td className="px-3 py-3 text-right align-top">
                                <button
                                  type="button"
                                  onClick={() => handleSpeak(row[0].split('(')[0].trim())}
                                  title="उच्चारण सुनें"
                                  className="inline-flex items-center justify-center p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 cursor-pointer"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Practical Examples */}
                {activeChapter.examples.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-base font-bold text-slate-900">
                      संताली वाक्य उदाहरण (Interactive Examples)
                    </h3>
                    <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                      {activeChapter.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="text-sm sm:text-base font-semibold text-slate-900">
                              {ex.santaliDev}
                            </div>
                            {showOlChiki && (
                              <div className="text-xs text-amber-800 font-medium">
                                {toOlChikiAuto(ex.santaliDev)}
                              </div>
                            )}
                            <div className="text-xs font-mono text-slate-500">
                              {ex.santaliRoman}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-700 pt-0.5">
                              <span>{ex.hindi}</span>
                              <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                              <span className="text-slate-500">{ex.english}</span>
                            </div>
                            {ex.note && (
                              <div className="text-[11px] font-medium text-teal-800 pt-0.5">
                                टिप्पणी: {ex.note}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSpeak(ex.santaliDev)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer shrink-0 self-start sm:self-center whitespace-nowrap"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>सुनें</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Original Letters / Essays Compositions (Chapters 19 & 20) */}
                {activeChapter.compositions && activeChapter.compositions.length > 0 && (
                  <section className="space-y-5">
                    <h3 className="text-base font-bold text-slate-900">
                      मौलिक संताली रचनाएँ व अभ्यास प्रारूप (Original Models)
                    </h3>
                    <div className="space-y-5">
                      {activeChapter.compositions.map((comp, idx) => {
                        const compKey = `${activeChapter.id}_comp_${idx}`;
                        return (
                          <div
                            key={compKey}
                            className="border border-slate-200 rounded-xl p-5 bg-slate-50/40 space-y-4"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
                              <div>
                                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                                  {comp.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-0.5">{comp.subtitle}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleSpeak(comp.santaliDev)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>वाचन सुनें</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopyText(
                                      compKey,
                                      `${comp.title}\n\n${comp.santaliDev}\n\n(Roman)\n${comp.santaliRoman}\n\n(हिन्दी अनुवाद)\n${comp.hindiTranslation}`
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  {copiedId === compKey ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>कॉपी हुआ</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>कॉपी करें</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                              <div className="space-y-3">
                                <div className="text-xs font-semibold text-teal-800">
                                  संताली पाठ (देवनागरी)
                                </div>
                                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-900 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
                                  {comp.santaliDev}
                                </pre>
                                <div className="text-xs font-semibold text-slate-600 pt-1">
                                  रोमन लिपि (Roman Script)
                                </div>
                                <pre className="whitespace-pre-wrap font-mono text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
                                  {comp.santaliRoman}
                                </pre>
                              </div>

                              <div className="space-y-3">
                                <div className="text-xs font-semibold text-slate-700">
                                  हिन्दी अनुवाद (Hindi Translation)
                                </div>
                                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
                                  {comp.hindiTranslation}
                                </pre>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Prev / Next Chapter Footer Navigation */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    disabled={activeChapterIndex <= 0}
                    onClick={() => {
                      if (activeChapterIndex > 0) {
                        handleSelectChapter(SANTALI_GRAMMAR_CHAPTERS[activeChapterIndex - 1].id);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>पिछला अध्याय</span>
                  </button>

                  <span className="text-xs text-slate-500 tabular-nums">
                    अध्याय {activeChapterIndex + 1} / {SANTALI_GRAMMAR_CHAPTERS.length}
                  </span>

                  <button
                    type="button"
                    disabled={activeChapterIndex >= SANTALI_GRAMMAR_CHAPTERS.length - 1}
                    onClick={() => {
                      if (activeChapterIndex < SANTALI_GRAMMAR_CHAPTERS.length - 1) {
                        handleSelectChapter(SANTALI_GRAMMAR_CHAPTERS[activeChapterIndex + 1].id);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                  >
                    <span>अगला अध्याय</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </article>

              {/* Embedded Chapter Practice Quiz */}
              <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-semibold text-teal-800">
                        अध्याय {activeChapter.number} अभ्यास क्विज़
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        स्कोर: {chapterCorrectCount} / {chapterQuizItems.length}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      अपनी समझ जाँचें (Chapter Self-Check)
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const raw = SANTALI_GRAMMAR_QUIZ_BANK.filter((q) => q.chapterId === activeChapter.id);
                        setChapterQuizItems(shuffleArray(raw).map(prepareQuestion));
                        setChapterAnswers({});
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>पुनः अभ्यास</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorkspaceMode('mega_quiz')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>संपूर्ण मेगा टेस्ट</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  {chapterQuizItems.map((q, qIdx) => {
                    const selected = chapterAnswers[q.id];
                    const hasAnswered = selected !== undefined;
                    const isRight = hasAnswered && selected === q.correctIndex;

                    return (
                      <div key={q.id} className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-slate-900">
                            <span className="font-mono tabular-nums text-teal-800 mr-1.5">Q{qIdx + 1}.</span>
                            {q.questionHi}
                          </div>
                          <div className="text-xs text-slate-500">{q.questionEn}</div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selected === oIdx;
                            const isCorrectOpt = oIdx === q.correctIndex;

                            let btnClass =
                              'bg-white border-slate-200 text-slate-800 hover:border-teal-500 hover:bg-teal-50/40';
                            if (hasAnswered) {
                              if (isCorrectOpt) {
                                btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
                              } else if (isSelected && !isCorrectOpt) {
                                btnClass = 'bg-rose-50 border-rose-500 text-rose-950 font-semibold';
                              } else {
                                btnClass = 'bg-white border-slate-200 text-slate-400';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={hasAnswered}
                                onClick={() =>
                                  setChapterAnswers((prev) => ({
                                    ...prev,
                                    [q.id]: oIdx,
                                  }))
                                }
                                className={`text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors flex items-center justify-between gap-2 ${
                                  hasAnswered ? 'cursor-default' : 'cursor-pointer'
                                } ${btnClass}`}
                              >
                                <span>
                                  <span className="font-mono mr-2 text-slate-400">
                                    {String.fromCharCode(65 + oIdx)}.
                                  </span>
                                  {opt}
                                </span>
                                {hasAnswered && isCorrectOpt && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                                {hasAnswered && isSelected && !isCorrectOpt && (
                                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {hasAnswered && (
                          <div
                            className={`p-3 rounded-lg border text-xs leading-relaxed ${
                              isRight
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                : 'bg-rose-50/70 border-rose-200 text-rose-950'
                            }`}
                          >
                            <div className="font-bold mb-1">
                              {isRight ? '✓ सही उत्तर (Correct)' : '✗ गलत उत्तर (Incorrect)'}
                              {!isRight && (
                                <span className="font-normal ml-2">
                                  — सही विकल्प: <strong>{q.options[q.correctIndex]}</strong>
                                </span>
                              )}
                            </div>
                            <p className="text-slate-700">{q.explanationHi}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {chapterAnsweredCount === chapterQuizItems.length && chapterQuizItems.length > 0 && (
                  <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-xs sm:text-sm text-teal-950">
                      <strong>अध्याय अभ्यास पूर्ण!</strong> आपने{' '}
                      <span className="tabular-nums font-bold">
                        {chapterCorrectCount} / {chapterQuizItems.length}
                      </span>{' '}
                      सही उत्तर दिए।
                    </div>
                    {!completedChapters.includes(activeChapter.id) && (
                      <button
                        type="button"
                        onClick={() => toggleChapterComplete(activeChapter.id)}
                        className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg cursor-pointer whitespace-nowrap"
                      >
                        अध्याय {activeChapter.number} पूर्ण चिह्नित करें
                      </button>
                    )}
                  </div>
                )}
              </section>
            </>
          ) : (
            /* ─── FULL-SYLLABUS NON-REPEATING MEGA QUIZ STAGE ─── */
            <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-teal-800">संपूर्ण संताली व्याकरण मेगा टेस्ट</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">कुल बैंक: {SANTALI_GRAMMAR_QUIZ_BANK.length} प्रश्न</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">शेष नए प्रश्न: {remainingUnseenCount}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    नो-रिपीट प्रमाणिक व्याकरण परीक्षा (Full-Syllabus Quiz)
                  </h2>
                </div>

                {/* Test Size Selector + Pool Reset */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    {([15, 30, 60] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => startMegaQuiz(size, false)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer tabular-nums whitespace-nowrap ${
                          megaQuizSize === size && megaQuestions.length === size
                            ? 'bg-white text-teal-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {size} प्रश्न
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => startMegaQuiz(megaQuizSize, true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>पूल रीसेट</span>
                  </button>
                </div>
              </div>

              {/* Live Score & Progress Bar */}
              {!megaFinished && currentMegaQ && (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 tabular-nums">
                    <span>
                      प्रश्न <strong className="text-slate-900">{megaIndex + 1}</strong> / {megaQuestions.length}
                      <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                      <span>
                        अध्याय {chapterMap[currentMegaQ.chapterId]?.number}:{' '}
                        {chapterMap[currentMegaQ.chapterId]?.titleSantaliDev}
                      </span>
                    </span>
                    <span className="flex items-center gap-3 font-semibold">
                      <span className="text-emerald-700">✓ सही: {megaCorrectCount}</span>
                      <span className="text-rose-700">✗ गलत: {megaWrongCount}</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-700 transition-all duration-200"
                      style={{ width: `${((megaIndex + 1) / megaQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Active Question Card */}
              {!megaFinished && currentMegaQ && (
                <div className="space-y-5">
                  <div className="p-5 sm:p-6 rounded-xl bg-slate-50/70 border border-slate-200 space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {currentMegaQ.questionHi}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500">{currentMegaQ.questionEn}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentMegaQ.options.map((opt, idx) => {
                        const selected = megaAnswers[currentMegaQ.id];
                        const hasAnswered = selected !== undefined;
                        const isSelected = selected === idx;
                        const isCorrectOpt = idx === currentMegaQ.correctIndex;

                        let optClass =
                          'bg-white border-slate-200 text-slate-900 hover:border-teal-600 hover:bg-teal-50/40';
                        if (hasAnswered) {
                          if (isCorrectOpt) {
                            optClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
                          } else if (isSelected && !isCorrectOpt) {
                            optClass = 'bg-rose-50 border-rose-500 text-rose-950 font-semibold';
                          } else {
                            optClass = 'bg-white border-slate-200 text-slate-400';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={hasAnswered}
                            onClick={() =>
                              setMegaAnswers((prev) => ({
                                ...prev,
                                [currentMegaQ.id]: idx,
                              }))
                            }
                            className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors flex items-center justify-between gap-2 ${
                              hasAnswered ? 'cursor-default' : 'cursor-pointer'
                            } ${optClass}`}
                          >
                            <span>
                              <span className="font-mono text-xs text-slate-400 mr-2">
                                {String.fromCharCode(65 + idx)}.
                              </span>
                              {opt}
                            </span>
                            {hasAnswered && isCorrectOpt && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {hasAnswered && isSelected && !isCorrectOpt && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Instant Honest Explanation */}
                    {megaAnswers[currentMegaQ.id] !== undefined && (
                      <div
                        className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                          megaAnswers[currentMegaQ.id] === currentMegaQ.correctIndex
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50 border-rose-200 text-rose-950'
                        }`}
                      >
                        <div className="font-bold mb-1">
                          {megaAnswers[currentMegaQ.id] === currentMegaQ.correctIndex
                            ? '✓ सही उत्तर (Correct)'
                            : '✗ गलत उत्तर (Incorrect)'}
                          {megaAnswers[currentMegaQ.id] !== currentMegaQ.correctIndex && (
                            <span className="font-normal ml-2">
                              — सही उत्तर: <strong>{currentMegaQ.options[currentMegaQ.correctIndex]}</strong>
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700">{currentMegaQ.explanationHi}</p>
                      </div>
                    )}
                  </div>

                  {/* Next / Finish Controls */}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={megaIndex <= 0}
                      onClick={() => setMegaIndex((i) => Math.max(0, i - 1))}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer whitespace-nowrap"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>पिछला प्रश्न</span>
                    </button>

                    {megaIndex < megaQuestions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setMegaIndex((i) => i + 1)}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-lg bg-teal-700 hover:bg-teal-800 text-white cursor-pointer whitespace-nowrap"
                      >
                        <span>अगला प्रश्न</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setMegaFinished(true)}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer whitespace-nowrap"
                      >
                        <Award className="w-4 h-4" />
                        <span>परिणाम देखें (Finish)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Final Scorecard & Full Answer Review */}
              {megaFinished && (
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-teal-800">
                        संपूर्ण व्याकरण परीक्षण परिणाम
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                        {megaCorrectCount} / {megaQuestions.length} सही (
                        {megaQuestions.length > 0
                          ? Math.round((megaCorrectCount / megaQuestions.length) * 100)
                          : 0}
                        %)
                      </div>
                      <p className="text-xs text-slate-600 tabular-nums">
                        प्रयास किए गए: {megaAnsweredCount} · सही: {megaCorrectCount} · गलत: {megaWrongCount}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startMegaQuiz(megaQuizSize, false)}
                        className="px-4 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg cursor-pointer whitespace-nowrap"
                      >
                        नया {megaQuizSize}-प्रश्न सेट (No Repeat)
                      </button>
                      <button
                        type="button"
                        onClick={() => setWorkspaceMode('course')}
                        className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer whitespace-nowrap"
                      >
                        पाठ्यक्रम पर लौटें
                      </button>
                    </div>
                  </div>

                  {/* Detailed Review List */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900">
                      सभी प्रश्नों की विस्तृत समीक्षा (Answer Review)
                    </h3>
                    <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                      {megaQuestions.map((q, idx) => {
                        const ans = megaAnswers[q.id];
                        const isRight = ans === q.correctIndex;
                        const ch = chapterMap[q.chapterId];
                        return (
                          <div key={q.id} className="p-4 bg-white space-y-1.5 text-xs sm:text-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div className="font-semibold text-slate-900">
                                <span className="font-mono tabular-nums text-slate-400 mr-1.5">
                                  {idx + 1}.
                                </span>
                                {q.questionHi}
                              </div>
                              <span
                                className={`shrink-0 text-xs font-semibold ${
                                  ans === undefined
                                    ? 'text-slate-500'
                                    : isRight
                                    ? 'text-emerald-700'
                                    : 'text-rose-700'
                                }`}
                              >
                                {ans === undefined ? 'अनुत्तरित' : isRight ? '✓ सही' : '✗ गलत'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600">
                              सही उत्तर: <strong className="text-emerald-800">{q.options[q.correctIndex]}</strong>
                              {ans !== undefined && !isRight && (
                                <>
                                  <span className="mx-2 text-slate-300">·</span>
                                  आपका उत्तर: <span className="text-rose-700">{q.options[ans]}</span>
                                </>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{q.explanationHi}</p>
                            {ch && (
                              <button
                                type="button"
                                onClick={() => handleSelectChapter(ch.id)}
                                className="text-[11px] font-semibold text-teal-700 hover:underline cursor-pointer"
                              >
                                अध्याय {ch.number} ({ch.titleSantaliDev}) दोबारा पढ़ें →
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
