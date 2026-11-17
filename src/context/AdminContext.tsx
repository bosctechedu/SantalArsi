import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SantaliWord, QuizItem, SiteHeroConfig } from '../types';
import {
  SANTALI_DICTIONARY,
  QUIZ_QUESTIONS,
  DEFAULT_HERO_CONFIG
} from '../data/santaliData';
import {
  saveWordsToIndexedDB,
  getWordsFromIndexedDB,
  saveSingleWordToIndexedDB,
  deleteWordFromIndexedDB,
  getOfflineCacheStats,
  LEXICON_CACHE_VERSION
} from '../utils/indexedDB';
import { safeLoadFromStorage, safeSaveToStorage } from '../utils/storage';

export interface CustomContentBlock {
  id: string;
  moduleTab: string;
  title: string;
  santaliText: string;
  hindiText: string;
  englishText?: string;
  badge?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface OfficialFestivalDateOverride {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  note?: string;
  updatedAt?: number;
}

export interface CommunityWordSubmission {
  id: string;
  wordDevanagari: string;
  wordRoman: string;
  olChiki?: string;
  meaningHindi: string;
  meaningEnglish: string;
  regionDialect: string;
  category: string;
  exampleSantali?: string;
  submittedByEmail: string;
  submittedByName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: number;
  reviewedAt?: number;
}

export interface CommunityVoiceNote {
  id: string;
  wordDevanagari: string;
  wordRoman: string;
  olChiki?: string;
  meaningHindi: string;
  regionDialect: string;
  audioDataUrl?: string;
  phoneticTip?: string;
  submittedByEmail: string;
  submittedByName: string;
  upvotes: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: number;
  reviewedAt?: number;
}

export interface VillageEventNotice {
  id: string;
  title: string;
  eventType: string;
  eventDate: string;
  villageDistrict: string;
  regionDialect: string;
  description: string;
  organizerName: string;
  submittedByEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: number;
  reviewedAt?: number;
}

export const SUPER_ADMIN_EMAIL = 'bosctechedu@gmail.com';
export type AdminRole = 'super_admin' | 'operator';

export interface AdminOperator {
  id: string;
  operatorId: string;
  name: string;
  passcode: string;
  roleLabel: string;
  isActive: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface SafeUserSummary {
  email: string;
  displayName: string;
  villageRegion: string;
  photoURL?: string;
  authProvider?: 'google' | 'email_pin';
  emailVerified?: boolean;
  bookmarksCount: number;
  customEventsCount: number;
  hasNotes: boolean;
  createdAt: number;
  updatedAt: number;
}

interface AdminContextType {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  adminRole: AdminRole;
  isLiveEditMode: boolean;
  setIsLiveEditMode: (val: boolean) => void;
  adminId: string;
  operators: AdminOperator[];
  loginAdmin: (passcodeOrId: string, passcode?: string) => boolean;
  loginAdminWithServerSync: (
    id: string,
    passcode: string
  ) => Promise<{ success: boolean; role?: AdminRole; message?: string }>;
  logoutAdmin: () => void;
  resetAdminPassword: (adminIdOrRecoveryKey: string, newPassword: string) => { success: boolean; message: string };
  updateAdminId: (newId: string) => void;
  createOperator: (input: {
    operatorId: string;
    name: string;
    passcode: string;
    roleLabel?: string;
  }) => Promise<{ success: boolean; operator?: AdminOperator; message: string }>;
  updateOperator: (
    id: string,
    updates: Partial<Pick<AdminOperator, 'name' | 'passcode' | 'roleLabel' | 'isActive'>>
  ) => Promise<{ success: boolean; message: string }>;
  deleteOperator: (id: string) => Promise<boolean>;
  refreshOperators: () => Promise<void>;
  heroConfig: SiteHeroConfig;
  updateHeroConfig: (cfg: Partial<SiteHeroConfig>) => void;
  resetHeroConfig: () => void;

  // Global Admin Control over Official Santali Lunar Festival Dates, Notice & Breaking Ticker
  officialFestivalOverrides: Record<string, OfficialFestivalDateOverride>;
  updateOfficialFestivalDate: (festivalId: string, data: OfficialFestivalDateOverride) => void;
  resetOfficialFestivalDate: (festivalId: string) => void;
  adminLunarAnnouncement: string;
  updateAdminLunarAnnouncement: (msg: string) => void;
  globalTickerText: string;
  globalTickerEnabled: boolean;
  updateGlobalTicker: (text: string, enabled: boolean) => void;

  // Community Word Submissions & Admin Approval Queue
  communitySubmissions: CommunityWordSubmission[];
  refreshSubmissions: () => Promise<void>;
  submitCommunityWord: (input: {
    wordDevanagari: string;
    wordRoman: string;
    olChiki?: string;
    meaningHindi: string;
    meaningEnglish?: string;
    regionDialect: string;
    category?: string;
    exampleSantali?: string;
    submittedByEmail: string;
    submittedByName: string;
  }) => Promise<{ success: boolean; submission?: CommunityWordSubmission; message: string }>;
  reviewCommunitySubmission: (id: string, action: 'approved' | 'rejected') => Promise<boolean>;

  // Community Dialect Voice Bank & Village Event Board (Admin Moderated)
  communityVoiceNotes: CommunityVoiceNote[];
  villageEvents: VillageEventNotice[];
  refreshCommunityBoard: () => Promise<void>;
  submitCommunityVoiceNote: (input: {
    wordDevanagari: string;
    wordRoman: string;
    olChiki?: string;
    meaningHindi: string;
    regionDialect: string;
    audioDataUrl?: string;
    phoneticTip?: string;
    submittedByEmail: string;
    submittedByName: string;
  }) => Promise<{ success: boolean; message: string }>;
  upvoteVoiceNote: (id: string) => Promise<void>;
  reviewVoiceNote: (id: string, action: 'approved' | 'rejected') => Promise<boolean>;
  submitVillageEvent: (input: {
    title: string;
    eventType: string;
    eventDate: string;
    villageDistrict: string;
    regionDialect: string;
    description: string;
    organizerName: string;
    submittedByEmail: string;
  }) => Promise<{ success: boolean; message: string }>;
  reviewVillageEvent: (id: string, action: 'approved' | 'rejected') => Promise<boolean>;

  words: SantaliWord[];
  addWord: (word: Omit<SantaliWord, 'id'>) => void;
  updateWord: (id: string, word: Partial<SantaliWord>) => void;
  deleteWord: (id: string) => void;
  bulkReplaceWords: (updatedWords: SantaliWord[]) => void;

  quizItems: QuizItem[];
  addQuizItem: (item: Omit<QuizItem, 'id'>) => void;
  updateQuizItem: (id: string, updates: Partial<QuizItem>) => void;
  deleteQuizItem: (id: string) => void;
  bulkReplaceQuizItems: (items: QuizItem[]) => void;

  // Universal inline click-to-edit & custom content Add/Edit/Update/Delete across all 145 modules
  contentOverrides: Record<string, string>;
  saveContentOverride: (key: string, value: string) => void;
  bulkSaveContentOverrides: (updates: Record<string, string>) => void;
  restoreContentOverridesSnapshot: (snapshot: Record<string, string>) => void;
  resetContentOverride: (key: string) => void;
  clearAllContentOverrides: () => void;

  customBlocks: Record<string, CustomContentBlock[]>;
  addCustomBlock: (moduleTab: string, block: Omit<CustomContentBlock, 'id' | 'moduleTab' | 'createdAt'>) => void;
  updateCustomBlock: (moduleTab: string, id: string, updates: Partial<CustomContentBlock>) => void;
  bulkUpdateCustomBlocks: (updatesByTab: Record<string, Record<string, Partial<CustomContentBlock>>>) => void;
  restoreCustomBlocksSnapshot: (snapshot: Record<string, CustomContentBlock[]>) => void;
  deleteCustomBlock: (moduleTab: string, id: string) => void;

  hiddenBlocks: Record<string, boolean>;
  hideContentBlock: (key: string) => void;
  restoreContentBlock: (key: string) => void;
  restoreAllHiddenBlocks: (moduleTab?: string) => void;

  // Click-to-Replace any <img> across all modules
  imageOverrides: Record<string, string>;
  saveImageOverride: (key: string, src: string) => void;
  resetImageOverride: (key: string) => void;
  clearAllImageOverrides: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [operators, setOperators] = useState<AdminOperator[]>(() => {
    return safeLoadFromStorage<AdminOperator[]>('hor_katha_admin_operators_v1', []);
  });

  const [adminRole, setAdminRole] = useState<AdminRole>(() => {
    const savedRole = localStorage.getItem('hor_katha_admin_role');
    return savedRole === 'operator' ? 'operator' : 'super_admin';
  });

  const [adminId, setAdminId] = useState<string>(() => {
    const savedRole = localStorage.getItem('hor_katha_admin_role');
    const savedId = (localStorage.getItem('hor_katha_admin_id') || '').trim();
    if (savedRole === 'operator' && savedId && savedId.toLowerCase() !== SUPER_ADMIN_EMAIL) {
      return savedId;
    }
    return SUPER_ADMIN_EMAIL;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (localStorage.getItem('hor_katha_admin_active') !== 'true') return false;
    const savedRole = localStorage.getItem('hor_katha_admin_role');
    const savedId = (localStorage.getItem('hor_katha_admin_id') || '').trim().toLowerCase();
    if (savedRole === 'operator') {
      return Boolean(savedId && savedId !== SUPER_ADMIN_EMAIL);
    }
    return savedId === SUPER_ADMIN_EMAIL;
  });

  const isSuperAdmin =
    isAdmin &&
    adminRole === 'super_admin' &&
    adminId.trim().toLowerCase() === SUPER_ADMIN_EMAIL;

  const [isLiveEditMode, setIsLiveEditMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('hor_katha_live_edit_mode');
    if (saved !== null) return saved === 'true';
    return isAdmin;
  });

  const [heroConfig, setHeroConfig] = useState<SiteHeroConfig>(() => {
    return safeLoadFromStorage('hor_katha_hero_config', DEFAULT_HERO_CONFIG);
  });

  const [officialFestivalOverrides, setOfficialFestivalOverrides] = useState<
    Record<string, OfficialFestivalDateOverride>
  >(() => {
    return safeLoadFromStorage<Record<string, OfficialFestivalDateOverride>>(
      'hor_katha_admin_official_festivals_v1',
      {}
    );
  });

  const [adminLunarAnnouncement, setAdminLunarAnnouncement] = useState<string>(() => {
    try {
      return localStorage.getItem('hor_katha_admin_lunar_announcement') || '';
    } catch {
      return '';
    }
  });

  const [globalTickerText, setGlobalTickerText] = useState<string>(() => {
    try {
      return localStorage.getItem('hor_katha_global_ticker_text') || '';
    } catch {
      return '';
    }
  });

  const [globalTickerEnabled, setGlobalTickerEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hor_katha_global_ticker_enabled') === 'true';
    } catch {
      return false;
    }
  });

  const [communitySubmissions, setCommunitySubmissions] = useState<CommunityWordSubmission[]>(() => {
    return safeLoadFromStorage<CommunityWordSubmission[]>('hor_katha_community_submissions_v1', []);
  });

  const [communityVoiceNotes, setCommunityVoiceNotes] = useState<CommunityVoiceNote[]>(() => {
    return safeLoadFromStorage<CommunityVoiceNote[]>('hor_katha_community_voice_notes_v1', []);
  });

  const [villageEvents, setVillageEvents] = useState<VillageEventNotice[]>(() => {
    return safeLoadFromStorage<VillageEventNotice[]>('hor_katha_village_events_v1', []);
  });

  const [words, setWords] = useState<SantaliWord[]>(() => {
    const customWords = safeLoadFromStorage<SantaliWord[]>('hor_katha_custom_words', []);
    return customWords.length > 0 ? [...customWords, ...SANTALI_DICTIONARY] : SANTALI_DICTIONARY;
  });

  const [quizItems, setQuizItems] = useState<QuizItem[]>(() => {
    const saved = safeLoadFromStorage<QuizItem[]>('hor_katha_quiz_db', QUIZ_QUESTIONS);
    const savedIds = new Set(saved.map((q) => q.id));
    const missing = QUIZ_QUESTIONS.filter((q) => !savedIds.has(q.id));
    return missing.length > 0 ? [...saved, ...missing] : saved;
  });

  const [contentOverrides, setContentOverrides] = useState<Record<string, string>>(() => {
    return safeLoadFromStorage<Record<string, string>>('hor_katha_inline_overrides', {});
  });

  const [customBlocks, setCustomBlocks] = useState<Record<string, CustomContentBlock[]>>(() => {
    return safeLoadFromStorage<Record<string, CustomContentBlock[]>>('hor_katha_custom_blocks', {});
  });

  const [hiddenBlocks, setHiddenBlocks] = useState<Record<string, boolean>>(() => {
    return safeLoadFromStorage<Record<string, boolean>>('hor_katha_hidden_blocks', {});
  });

  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>(() => {
    return safeLoadFromStorage<Record<string, string>>('hor_katha_image_overrides', {});
  });

  const didMountStorageRef = React.useRef(false);

  useEffect(() => {
    if (isAdmin) {
      setIsLiveEditMode(true);
    }
    if (!didMountStorageRef.current) return;
    localStorage.setItem('hor_katha_admin_active', isAdmin ? 'true' : 'false');
    localStorage.setItem('hor_katha_admin_role', adminRole);
    localStorage.setItem('hor_katha_admin_id', adminId);
  }, [isAdmin, adminRole, adminId]);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    safeSaveToStorage('hor_katha_admin_operators_v1', operators);
  }, [operators]);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    localStorage.setItem('hor_katha_live_edit_mode', isLiveEditMode ? 'true' : 'false');
  }, [isLiveEditMode]);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    safeSaveToStorage('hor_katha_hero_config', heroConfig);
  }, [heroConfig]);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    safeSaveToStorage('hor_katha_admin_official_festivals_v1', officialFestivalOverrides);
  }, [officialFestivalOverrides]);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    try {
      localStorage.setItem('hor_katha_admin_lunar_announcement', adminLunarAnnouncement);
    } catch {
      // ignore
    }
  }, [adminLunarAnnouncement]);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    try {
      localStorage.setItem('hor_katha_global_ticker_text', globalTickerText);
      localStorage.setItem('hor_katha_global_ticker_enabled', globalTickerEnabled ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [globalTickerText, globalTickerEnabled]);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    safeSaveToStorage('hor_katha_community_submissions_v1', communitySubmissions);
  }, [communitySubmissions]);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    safeSaveToStorage('hor_katha_community_voice_notes_v1', communityVoiceNotes);
  }, [communityVoiceNotes]);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    safeSaveToStorage('hor_katha_village_events_v1', villageEvents);
  }, [villageEvents]);

  // Fetch global Admin-published official dates, announcements, ticker & community feeds from backend on mount
  useEffect(() => {
    let mounted = true;
    fetch('/api/global-state')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted || !data?.adminGlobalState) return;
        const gs = data.adminGlobalState;
        if (gs.officialFestivalOverrides && Object.keys(gs.officialFestivalOverrides).length > 0) {
          setOfficialFestivalOverrides((prev) => ({ ...gs.officialFestivalOverrides, ...prev }));
        }
        if (typeof gs.adminLunarAnnouncement === 'string' && gs.adminLunarAnnouncement.trim()) {
          setAdminLunarAnnouncement((prev) => prev || gs.adminLunarAnnouncement);
        }
        if (typeof gs.globalTickerText === 'string') {
          setGlobalTickerText((prev) => (prev ? prev : gs.globalTickerText));
        }
        if (typeof gs.globalTickerEnabled === 'boolean') {
          setGlobalTickerEnabled(gs.globalTickerEnabled);
        }
      })
      .catch(() => {
        // Offline / localStorage mode
      });

    fetch('/api/community/submissions')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted || !Array.isArray(data?.submissions)) return;
        if (data.submissions.length > 0) {
          setCommunitySubmissions(data.submissions);
        }
      })
      .catch(() => {});

    fetch('/api/community/voice-notes')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted || !Array.isArray(data?.voiceNotes)) return;
        if (data.voiceNotes.length > 0) {
          setCommunityVoiceNotes(data.voiceNotes);
        }
      })
      .catch(() => {});

    fetch('/api/community/events')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted || !Array.isArray(data?.events)) return;
        if (data.events.length > 0) {
          setVillageEvents(data.events);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    safeSaveToStorage('hor_katha_quiz_db', quizItems);
  }, [quizItems]);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    safeSaveToStorage('hor_katha_inline_overrides', contentOverrides);
  }, [contentOverrides]);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    safeSaveToStorage('hor_katha_custom_blocks', customBlocks);
  }, [customBlocks]);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    safeSaveToStorage('hor_katha_hidden_blocks', hiddenBlocks);
  }, [hiddenBlocks]);

  useEffect(() => {
    if (!didMountStorageRef.current) return;
    safeSaveToStorage('hor_katha_image_overrides', imageOverrides);
  }, [imageOverrides]);

  useEffect(() => {
    didMountStorageRef.current = true;
  }, []);

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('hor_katha_admin_password') || 'admin123';
  });

  const refreshOperators = async () => {
    if (!isSuperAdmin) return;
    try {
      const res = await fetch('/api/admin/operators', {
        headers: {
          'x-bosc-admin-role': 'super_admin',
          'x-bosc-admin-id': SUPER_ADMIN_EMAIL
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.operators)) {
          setOperators(data.operators);
        }
      }
    } catch {
      // Offline mode keeps localStorage operators
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      refreshOperators();
    }
  }, [isSuperAdmin]);

  const loginAdmin = (idInput: string, passcode?: string): boolean => {
    if (passcode === undefined) {
      return false;
    }

    const inputId = idInput.trim().toLowerCase();
    const inputPass = passcode.trim();
    if (!inputId || !inputPass) return false;

    // 1. Strict Super Admin ONLY: bosctechedu@gmail.com
    if (inputId === SUPER_ADMIN_EMAIL && inputPass === adminPassword) {
      setAdminRole('super_admin');
      setAdminId(SUPER_ADMIN_EMAIL);
      setIsAdmin(true);
      localStorage.setItem('hor_katha_admin_active', 'true');
      localStorage.setItem('hor_katha_admin_role', 'super_admin');
      localStorage.setItem('hor_katha_admin_id', SUPER_ADMIN_EMAIL);
      return true;
    }

    // 2. Admin-created active Operators only (local store check)
    const matchedOp = operators.find(
      (op) => op.isActive && op.operatorId.toLowerCase() === inputId && op.passcode === inputPass
    );
    if (matchedOp) {
      setAdminRole('operator');
      setAdminId(matchedOp.operatorId);
      setIsAdmin(true);
      localStorage.setItem('hor_katha_admin_active', 'true');
      localStorage.setItem('hor_katha_admin_role', 'operator');
      localStorage.setItem('hor_katha_admin_id', matchedOp.operatorId);
      return true;
    }

    return false;
  };

  const loginAdminWithServerSync = async (
    id: string,
    passcode: string
  ): Promise<{ success: boolean; role?: AdminRole; message?: string }> => {
    const cleanId = id.trim();
    const cleanPass = passcode.trim();
    if (!cleanId || !cleanPass) {
      return { success: false, message: 'कृपया ID / ईमेल और पासवर्ड दर्ज करें।' };
    }

    if (loginAdmin(cleanId, cleanPass)) {
      return {
        success: true,
        role: cleanId.toLowerCase() === SUPER_ADMIN_EMAIL ? 'super_admin' : 'operator'
      };
    }

    if (cleanId.toLowerCase() === SUPER_ADMIN_EMAIL) {
      return {
        success: false,
        message: 'अमान्य Super Admin पासवर्ड। कृपया सही पासवर्ड दर्ज करें।'
      };
    }

    try {
      const res = await fetch('/api/admin/operator-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorId: cleanId, passcode: cleanPass })
      });
      const data = await res.json();
      if (res.ok && data?.success && data?.operator) {
        const opRecord: AdminOperator = {
          ...data.operator,
          passcode: cleanPass
        };
        setOperators((prev) => {
          const rest = prev.filter((p) => p.id !== opRecord.id && p.operatorId.toLowerCase() !== opRecord.operatorId.toLowerCase());
          return [opRecord, ...rest];
        });
        setAdminRole('operator');
        setAdminId(opRecord.operatorId);
        setIsAdmin(true);
        localStorage.setItem('hor_katha_admin_active', 'true');
        localStorage.setItem('hor_katha_admin_role', 'operator');
        localStorage.setItem('hor_katha_admin_id', opRecord.operatorId);
        return { success: true, role: 'operator' };
      }
      return {
        success: false,
        message: data?.error || 'अमान्य Operator ID या पासवर्ड।'
      };
    } catch {
      return {
        success: false,
        message: 'अमान्य ID या पासवर्ड। केवल bosctechedu@gmail.com या Admin द्वारा बनाया गया सक्रिय Operator ही मान्य है।'
      };
    }
  };

  const resetAdminPassword = (
    adminIdOrRecoveryKey: string,
    newPassword: string
  ): { success: boolean; message: string } => {
    if (isAdmin && !isSuperAdmin) {
      return {
        success: false,
        message: 'केवल मुख्य एडमिन (bosctechedu@gmail.com) ही Admin पासवर्ड बदल सकते हैं।'
      };
    }

    const key = adminIdOrRecoveryKey.trim().toLowerCase();
    const validVerificationKeys = [SUPER_ADMIN_EMAIL, 'bosc-recovery-key'];

    if (!validVerificationKeys.includes(key)) {
      return {
        success: false,
        message: 'केवल पंजीकृत मुख्य एडमिन ईमेल (bosctechedu@gmail.com) या मास्टर रिकवरी कुंजी मान्य है।'
      };
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return {
        success: false,
        message: 'नया पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।'
      };
    }

    const trimmed = newPassword.trim();
    setAdminPassword(trimmed);
    localStorage.setItem('hor_katha_admin_password', trimmed);
    return {
      success: true,
      message: 'Super Admin पासवर्ड सफलतापूर्वक अपडेट हो गया!'
    };
  };

  // Super Admin ID is permanently locked to bosctechedu@gmail.com
  const updateAdminId = (_newId: string) => {
    if (adminRole === 'super_admin') {
      setAdminId(SUPER_ADMIN_EMAIL);
      localStorage.setItem('hor_katha_admin_id', SUPER_ADMIN_EMAIL);
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setIsLiveEditMode(false);
    setAdminRole('super_admin');
    setAdminId(SUPER_ADMIN_EMAIL);
    localStorage.setItem('hor_katha_admin_active', 'false');
    localStorage.setItem('hor_katha_admin_role', 'super_admin');
    localStorage.setItem('hor_katha_admin_id', SUPER_ADMIN_EMAIL);
  };

  // STRICTLY Super Admin (bosctechedu@gmail.com) ONLY: Create Operator
  const createOperator: AdminContextType['createOperator'] = async (input) => {
    if (!isSuperAdmin) {
      return {
        success: false,
        message: 'अनुमति अस्वीकृत: केवल मुख्य एडमिन (bosctechedu@gmail.com) ही ऑपरेटर बना सकते हैं।'
      };
    }
    const cleanOpId = input.operatorId.trim();
    const cleanName = input.name.trim();
    const cleanPass = input.passcode.trim();
    const cleanRoleLabel = input.roleLabel?.trim() || 'Content & Dictionary Operator';

    if (cleanOpId.toLowerCase() === SUPER_ADMIN_EMAIL) {
      return {
        success: false,
        message: 'मुख्य एडमिन ईमेल (bosctechedu@gmail.com) को ऑपरेटर ID के रूप में नहीं बनाया जा सकता।'
      };
    }
    if (cleanOpId.length < 3 || !cleanName || cleanPass.length < 4) {
      return {
        success: false,
        message: 'ऑपरेटर ID (कम से कम 3 अक्षर), नाम और पासवर्ड (कम से कम 4 अक्षर) अनिवार्य हैं।'
      };
    }
    if (operators.some((op) => op.operatorId.toLowerCase() === cleanOpId.toLowerCase())) {
      return {
        success: false,
        message: 'यह Operator ID पहले से मौजूद है। कृपया दूसरा ID चुनें।'
      };
    }

    const now = Date.now();
    const newOp: AdminOperator = {
      id: `op_${now}_${Math.random().toString(36).slice(2, 6)}`,
      operatorId: cleanOpId,
      name: cleanName,
      passcode: cleanPass,
      roleLabel: cleanRoleLabel,
      isActive: true,
      createdBy: SUPER_ADMIN_EMAIL,
      createdAt: now,
      updatedAt: now
    };

    try {
      const res = await fetch('/api/admin/operators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bosc-admin-role': 'super_admin',
          'x-bosc-admin-id': SUPER_ADMIN_EMAIL
        },
        body: JSON.stringify(newOp)
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.operators)) {
          setOperators(data.operators);
        } else {
          setOperators((prev) => [newOp, ...prev]);
        }
        return {
          success: true,
          operator: data?.operator || newOp,
          message: `ऑपरेटर "${cleanName}" (${cleanOpId}) सफलतापूर्वक बनाया गया!`
        };
      }
    } catch {
      // Offline mode saves to localStorage below
    }

    setOperators((prev) => [newOp, ...prev]);
    return {
      success: true,
      operator: newOp,
      message: `ऑपरेटर "${cleanName}" (${cleanOpId}) बनाया गया!`
    };
  };

  // STRICTLY Super Admin (bosctechedu@gmail.com) ONLY: Update Operator
  const updateOperator: AdminContextType['updateOperator'] = async (id, updates) => {
    if (!isSuperAdmin) {
      return {
        success: false,
        message: 'केवल मुख्य एडमिन (bosctechedu@gmail.com) ही ऑपरेटर में बदलाव कर सकते हैं।'
      };
    }
    const existing = operators.find((o) => o.id === id);
    if (!existing) {
      return { success: false, message: 'ऑपरेटर नहीं मिला।' };
    }
    const updated: AdminOperator = {
      ...existing,
      ...updates,
      passcode:
        updates.passcode && updates.passcode.trim().length >= 4
          ? updates.passcode.trim()
          : existing.passcode,
      updatedAt: Date.now()
    };

    setOperators((prev) => prev.map((o) => (o.id === id ? updated : o)));

    try {
      await fetch('/api/admin/operators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bosc-admin-role': 'super_admin',
          'x-bosc-admin-id': SUPER_ADMIN_EMAIL
        },
        body: JSON.stringify(updated)
      });
    } catch {
      // keep local state
    }

    return { success: true, message: 'ऑपरेटर विवरण अपडेट हो गया!' };
  };

  // STRICTLY Super Admin (bosctechedu@gmail.com) ONLY: Delete Operator
  const deleteOperator: AdminContextType['deleteOperator'] = async (id) => {
    if (!isSuperAdmin) return false;
    setOperators((prev) => prev.filter((o) => o.id !== id));
    try {
      await fetch(`/api/admin/operators/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'x-bosc-admin-role': 'super_admin',
          'x-bosc-admin-id': SUPER_ADMIN_EMAIL
        }
      });
    } catch {
      // keep local deletion
    }
    return true;
  };

  const updateHeroConfig = (cfg: Partial<SiteHeroConfig>) => {
    setHeroConfig((prev) => ({ ...prev, ...cfg }));
  };

  const resetHeroConfig = () => {
    setHeroConfig(DEFAULT_HERO_CONFIG);
  };

  // Hydrate full 50,000+ lexicon & IndexedDB cache right after first paint (zero main-thread startup block)
  useEffect(() => {
    let isMounted = true;
    const timerId = window.setTimeout(async () => {
      try {
        const stats = await getOfflineCacheStats();
        if (!isMounted) return;

        if (stats.wordCount >= 10000 && stats.lexiconVersion === LEXICON_CACHE_VERSION) {
          const cached = await getWordsFromIndexedDB();
          if (cached && cached.length >= 10000 && isMounted) {
            setWords((current) => {
              const customIds = new Set(current.filter((w) => w.id.startsWith('word_')).map((w) => w.id));
              const customNew = current.filter((w) => customIds.has(w.id));
              if (customNew.length === 0) return cached;
              const cachedIds = new Set(cached.map((w) => w.id));
              const extra = customNew.filter((w) => !cachedIds.has(w.id));
              return extra.length > 0 ? [...extra, ...cached] : cached;
            });
            return;
          }
        }

        const { generate10kLexicon } = await import('../data/lexiconGenerator');
        if (!isMounted) return;
        const baseLexicon = generate10kLexicon();
        const customWords = safeLoadFromStorage<SantaliWord[]>('hor_katha_custom_words', []);
        const fullWords = customWords.length > 0 ? [...customWords, ...baseLexicon] : baseLexicon;
        if (!isMounted) return;
        setWords(fullWords);

        window.setTimeout(() => {
          if (isMounted) {
            saveWordsToIndexedDB(fullWords).catch(() => {});
          }
        }, 400);
      } catch (e) {
        console.warn('IDB/lexicon async hydration error in AdminContext:', e);
      }
    }, 35);
    return () => {
      isMounted = false;
      window.clearTimeout(timerId);
    };
  }, []);

  const addWord = (newWordData: Omit<SantaliWord, 'id'>) => {
    const newWord: SantaliWord = {
      ...newWordData,
      id: 'word_' + Date.now()
    };
    setWords((prev) => [newWord, ...prev]);
    saveSingleWordToIndexedDB(newWord);
  };

  const updateWord = (id: string, updatedFields: Partial<SantaliWord>) => {
    setWords((prev) => {
      const updated = prev.map((w) => {
        if (w.id === id) {
          const mod = { ...w, ...updatedFields };
          saveSingleWordToIndexedDB(mod);
          return mod;
        }
        return w;
      });
      return updated;
    });
  };

  const deleteWord = (id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
    deleteWordFromIndexedDB(id);
  };

  const bulkReplaceWords = (updatedWords: SantaliWord[]) => {
    setWords(updatedWords);
    window.setTimeout(() => {
      saveWordsToIndexedDB(updatedWords).catch(() => {});
    }, 50);
  };

  const addQuizItem = (itemData: Omit<QuizItem, 'id'>) => {
    const newItem: QuizItem = {
      ...itemData,
      id: 'quiz_' + Date.now()
    };
    setQuizItems((prev) => [...prev, newItem]);
  };

  const updateQuizItem = (id: string, updates: Partial<QuizItem>) => {
    setQuizItems((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuizItem = (id: string) => {
    setQuizItems((prev) => prev.filter((q) => q.id !== id));
  };

  const bulkReplaceQuizItems = (items: QuizItem[]) => {
    setQuizItems(items);
  };

  const saveContentOverride = (key: string, value: string) => {
    setContentOverrides((prev) => ({ ...prev, [key]: value }));
  };

  const bulkSaveContentOverrides = (updates: Record<string, string>) => {
    setContentOverrides((prev) => ({ ...prev, ...updates }));
  };

  const restoreContentOverridesSnapshot = (snapshot: Record<string, string>) => {
    setContentOverrides(snapshot);
  };

  const resetContentOverride = (key: string) => {
    setContentOverrides((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearAllContentOverrides = () => {
    setContentOverrides({});
  };

  const addCustomBlock = (
    moduleTab: string,
    block: Omit<CustomContentBlock, 'id' | 'moduleTab' | 'createdAt'>
  ) => {
    const newBlock: CustomContentBlock = {
      ...block,
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      moduleTab,
      createdAt: Date.now()
    };
    setCustomBlocks((prev) => ({
      ...prev,
      [moduleTab]: [newBlock, ...(prev[moduleTab] || [])]
    }));
  };

  const updateCustomBlock = (
    moduleTab: string,
    id: string,
    updates: Partial<CustomContentBlock>
  ) => {
    setCustomBlocks((prev) => ({
      ...prev,
      [moduleTab]: (prev[moduleTab] || []).map((b) =>
        b.id === id ? { ...b, ...updates, updatedAt: Date.now() } : b
      )
    }));
  };

  const bulkUpdateCustomBlocks = (
    updatesByTab: Record<string, Record<string, Partial<CustomContentBlock>>>
  ) => {
    setCustomBlocks((prev) => {
      const next = { ...prev };
      Object.entries(updatesByTab).forEach(([tab, byId]) => {
        if (!next[tab]) return;
        next[tab] = next[tab].map((b) =>
          byId[b.id] ? { ...b, ...byId[b.id], updatedAt: Date.now() } : b
        );
      });
      return next;
    });
  };

  const restoreCustomBlocksSnapshot = (snapshot: Record<string, CustomContentBlock[]>) => {
    setCustomBlocks(snapshot);
  };

  const deleteCustomBlock = (moduleTab: string, id: string) => {
    setCustomBlocks((prev) => ({
      ...prev,
      [moduleTab]: (prev[moduleTab] || []).filter((b) => b.id !== id)
    }));
  };

  const hideContentBlock = (key: string) => {
    setHiddenBlocks((prev) => ({ ...prev, [key]: true }));
  };

  const restoreContentBlock = (key: string) => {
    setHiddenBlocks((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const restoreAllHiddenBlocks = (moduleTab?: string) => {
    if (!moduleTab) {
      setHiddenBlocks({});
      return;
    }
    setHiddenBlocks((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`${moduleTab}::`)) {
          delete next[k];
        }
      });
      return next;
    });
  };

  const saveImageOverride = (key: string, src: string) => {
    setImageOverrides((prev) => ({ ...prev, [key]: src }));
  };

  const resetImageOverride = (key: string) => {
    setImageOverrides((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearAllImageOverrides = () => {
    setImageOverrides({});
  };

  const syncGlobalStateToServer = (
    nextOverrides: Record<string, OfficialFestivalDateOverride>,
    nextAnnouncement: string,
    nextTickerText: string = globalTickerText,
    nextTickerEnabled: boolean = globalTickerEnabled
  ) => {
    if (!isAdmin) return;
    fetch('/api/admin/global-state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-bosc-admin-role': adminRole,
        'x-bosc-admin-id': adminId
      },
      body: JSON.stringify({
        officialFestivalOverrides: nextOverrides,
        adminLunarAnnouncement: nextAnnouncement,
        globalTickerText: nextTickerText,
        globalTickerEnabled: nextTickerEnabled
      })
    }).catch(() => {
      // Offline / PWA mode - localStorage already updated
    });
  };

  const updateOfficialFestivalDate = (
    festivalId: string,
    data: OfficialFestivalDateOverride
  ) => {
    if (!isAdmin) return;
    setOfficialFestivalOverrides((prev) => {
      const next = {
        ...prev,
        [festivalId]: { ...data, updatedAt: Date.now() }
      };
      syncGlobalStateToServer(next, adminLunarAnnouncement);
      return next;
    });
  };

  const resetOfficialFestivalDate = (festivalId: string) => {
    if (!isAdmin) return;
    setOfficialFestivalOverrides((prev) => {
      const next = { ...prev };
      delete next[festivalId];
      syncGlobalStateToServer(next, adminLunarAnnouncement);
      return next;
    });
  };

  const updateAdminLunarAnnouncement = (msg: string) => {
    if (!isAdmin) return;
    setAdminLunarAnnouncement(msg);
    syncGlobalStateToServer(officialFestivalOverrides, msg);
  };

  const updateGlobalTicker = (text: string, enabled: boolean) => {
    if (!isAdmin) return;
    setGlobalTickerText(text);
    setGlobalTickerEnabled(enabled);
    syncGlobalStateToServer(officialFestivalOverrides, adminLunarAnnouncement, text, enabled);
  };

  const refreshSubmissions = async () => {
    try {
      const res = await fetch('/api/community/submissions');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.submissions)) {
          setCommunitySubmissions(data.submissions);
        }
      }
    } catch {
      // keep localStorage state in offline mode
    }
  };

  const submitCommunityWord: AdminContextType['submitCommunityWord'] = async (input) => {
    const cleanDev = input.wordDevanagari.trim();
    const cleanRom = input.wordRoman.trim();
    const cleanHindi = input.meaningHindi.trim();
    if ((!cleanDev && !cleanRom) || !cleanHindi) {
      return { success: false, message: 'कृपया संताली शब्द व उसका हिन्दी अर्थ अवश्य भरें।' };
    }

    const fallbackItem: CommunityWordSubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      wordDevanagari: cleanDev || cleanRom,
      wordRoman: cleanRom || cleanDev,
      olChiki: input.olChiki?.trim() || '',
      meaningHindi: cleanHindi,
      meaningEnglish: input.meaningEnglish?.trim() || cleanHindi,
      regionDialect: input.regionDialect.trim() || 'संताल परगना',
      category: input.category || 'community',
      exampleSantali: input.exampleSantali?.trim() || '',
      submittedByEmail: input.submittedByEmail.trim().toLowerCase(),
      submittedByName: input.submittedByName.trim() || input.submittedByEmail.split('@')[0],
      status: 'pending',
      submittedAt: Date.now()
    };

    try {
      const res = await fetch('/api/community/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (res.ok) {
        const data = await res.json();
        const saved: CommunityWordSubmission = data?.submission || fallbackItem;
        setCommunitySubmissions((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
        return {
          success: true,
          submission: saved,
          message: 'धन्यवाद! आपका शब्द सुझाव Admin समीक्षा कतार में भेज दिया गया है।'
        };
      }
    } catch {
      // Offline fallback saves locally
    }

    setCommunitySubmissions((prev) => [fallbackItem, ...prev]);
    return {
      success: true,
      submission: fallbackItem,
      message: 'सुझाव आपके ब्राउज़र में सहेजा गया (Admin समीक्षा के लिए तैयार)।'
    };
  };

  const reviewCommunitySubmission = async (
    id: string,
    action: 'approved' | 'rejected'
  ): Promise<boolean> => {
    if (!isAdmin) return false;
    const target = communitySubmissions.find((s) => s.id === id);
    if (!target) return false;

    try {
      await fetch(`/api/admin/submissions/${encodeURIComponent(id)}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bosc-admin-role': adminRole,
          'x-bosc-admin-id': adminId
        },
        body: JSON.stringify({ action })
      });
    } catch {
      // Proceed offline cleanly
    }

    setCommunitySubmissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: action, reviewedAt: Date.now() } : item
      )
    );

    if (action === 'approved' && target.status !== 'approved') {
      addWord({
        wordDevanagari: target.wordDevanagari,
        wordRoman: target.wordRoman,
        phonetic: target.olChiki ? `${target.olChiki} · ${target.regionDialect}` : target.regionDialect,
        partOfSpeech: 'noun/common',
        meaningHindi: target.meaningHindi,
        meaningEnglish: target.meaningEnglish || target.meaningHindi,
        exampleSantali: target.exampleSantali || target.wordDevanagari,
        exampleHindi: target.meaningHindi,
        exampleEnglish: target.meaningEnglish || target.meaningHindi,
        category: target.category || 'community'
      });
    }
    return true;
  };

  const refreshCommunityBoard = async () => {
    try {
      const [vnRes, evRes] = await Promise.all([
        fetch('/api/community/voice-notes'),
        fetch('/api/community/events')
      ]);
      if (vnRes.ok) {
        const vnData = await vnRes.json();
        if (Array.isArray(vnData?.voiceNotes)) setCommunityVoiceNotes(vnData.voiceNotes);
      }
      if (evRes.ok) {
        const evData = await evRes.json();
        if (Array.isArray(evData?.events)) setVillageEvents(evData.events);
      }
    } catch {
      // keep local fallback
    }
  };

  const submitCommunityVoiceNote: AdminContextType['submitCommunityVoiceNote'] = async (input) => {
    if ((!input.wordDevanagari.trim() && !input.wordRoman.trim()) || !input.meaningHindi.trim()) {
      return { success: false, message: 'कृपया संताली शब्द और हिन्दी अर्थ भरें।' };
    }
    const fallbackNote: CommunityVoiceNote = {
      id: `vn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      wordDevanagari: input.wordDevanagari.trim() || input.wordRoman.trim(),
      wordRoman: input.wordRoman.trim() || input.wordDevanagari.trim(),
      olChiki: input.olChiki?.trim() || '',
      meaningHindi: input.meaningHindi.trim(),
      regionDialect: input.regionDialect.trim() || 'संताल परगना',
      audioDataUrl: input.audioDataUrl || '',
      phoneticTip: input.phoneticTip?.trim() || '',
      submittedByEmail: input.submittedByEmail.trim().toLowerCase(),
      submittedByName: input.submittedByName.trim() || input.submittedByEmail.split('@')[0],
      upvotes: 1,
      status: 'pending',
      submittedAt: Date.now()
    };
    try {
      const res = await fetch('/api/community/voice-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (res.ok) {
        const data = await res.json();
        const saved = data?.voiceNote || fallbackNote;
        setCommunityVoiceNotes((prev) => [saved, ...prev.filter((v) => v.id !== saved.id)]);
        return { success: true, message: 'आपकी आवाज़ रिकॉर्डिंग Admin समीक्षा कतार में भेज दी गई है!' };
      }
    } catch {
      // offline fallback
    }
    setCommunityVoiceNotes((prev) => [fallbackNote, ...prev]);
    return { success: true, message: 'ऑडियो नोट ब्राउज़र में सहेजा गया (Admin समीक्षा के लिए तैयार)।' };
  };

  const upvoteVoiceNote = async (id: string) => {
    setCommunityVoiceNotes((prev) =>
      prev.map((v) => (v.id === id ? { ...v, upvotes: (v.upvotes || 0) + 1 } : v))
    );
    try {
      await fetch(`/api/community/voice-notes/${encodeURIComponent(id)}/upvote`, { method: 'POST' });
    } catch {
      // ignore offline
    }
  };

  const reviewVoiceNote = async (id: string, action: 'approved' | 'rejected'): Promise<boolean> => {
    if (!isAdmin) return false;
    try {
      await fetch(`/api/admin/voice-notes/${encodeURIComponent(id)}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bosc-admin-role': adminRole,
          'x-bosc-admin-id': adminId
        },
        body: JSON.stringify({ action })
      });
    } catch {
      // offline proceed
    }
    setCommunityVoiceNotes((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: action, reviewedAt: Date.now() } : v))
    );
    return true;
  };

  const submitVillageEvent: AdminContextType['submitVillageEvent'] = async (input) => {
    if (!input.title.trim() || !input.eventDate.trim() || !input.villageDistrict.trim()) {
      return { success: false, message: 'कृपया कार्यक्रम का नाम, तिथि व गाँव/जिला भरें।' };
    }
    const fallbackEvent: VillageEventNotice = {
      id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: input.title.trim(),
      eventType: input.eventType.trim() || 'पर्व / सांस्कृतिक कार्यक्रम',
      eventDate: input.eventDate.trim(),
      villageDistrict: input.villageDistrict.trim(),
      regionDialect: input.regionDialect.trim() || 'संताल परगना',
      description: input.description.trim(),
      organizerName: input.organizerName.trim() || input.submittedByEmail.split('@')[0],
      submittedByEmail: input.submittedByEmail.trim().toLowerCase(),
      status: 'pending',
      submittedAt: Date.now()
    };
    try {
      const res = await fetch('/api/community/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (res.ok) {
        const data = await res.json();
        const saved = data?.event || fallbackEvent;
        setVillageEvents((prev) => [saved, ...prev.filter((e) => e.id !== saved.id)]);
        return { success: true, message: 'गाँव कार्यक्रम सूचना Admin अप्रूवल के लिए भेज दी गई है!' };
      }
    } catch {
      // offline fallback
    }
    setVillageEvents((prev) => [fallbackEvent, ...prev]);
    return { success: true, message: 'कार्यक्रम सूचना सहेजी गई (Admin समीक्षा के लिए तैयार)।' };
  };

  const reviewVillageEvent = async (id: string, action: 'approved' | 'rejected'): Promise<boolean> => {
    if (!isAdmin) return false;
    try {
      await fetch(`/api/admin/events/${encodeURIComponent(id)}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bosc-admin-role': adminRole,
          'x-bosc-admin-id': adminId
        },
        body: JSON.stringify({ action })
      });
    } catch {
      // offline proceed
    }
    setVillageEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: action, reviewedAt: Date.now() } : e))
    );
    return true;
  };

  const contextValue = useMemo<AdminContextType>(
    () => ({
      isAdmin,
      isSuperAdmin,
      adminRole,
      isLiveEditMode,
      setIsLiveEditMode,
      adminId,
      operators,
      loginAdmin,
      loginAdminWithServerSync,
      logoutAdmin,
      resetAdminPassword,
      updateAdminId,
      createOperator,
      updateOperator,
      deleteOperator,
      refreshOperators,
      heroConfig,
      updateHeroConfig,
      resetHeroConfig,
      officialFestivalOverrides,
      updateOfficialFestivalDate,
      resetOfficialFestivalDate,
      adminLunarAnnouncement,
      updateAdminLunarAnnouncement,
      globalTickerText,
      globalTickerEnabled,
      updateGlobalTicker,
      communitySubmissions,
      refreshSubmissions,
      submitCommunityWord,
      reviewCommunitySubmission,
      communityVoiceNotes,
      villageEvents,
      refreshCommunityBoard,
      submitCommunityVoiceNote,
      upvoteVoiceNote,
      reviewVoiceNote,
      submitVillageEvent,
      reviewVillageEvent,
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
      contentOverrides,
      saveContentOverride,
      bulkSaveContentOverrides,
      restoreContentOverridesSnapshot,
      resetContentOverride,
      clearAllContentOverrides,
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
      resetImageOverride,
      clearAllImageOverrides
    }),
    [
      isAdmin,
      isSuperAdmin,
      adminRole,
      isLiveEditMode,
      adminId,
      operators,
      heroConfig,
      officialFestivalOverrides,
      adminLunarAnnouncement,
      globalTickerText,
      globalTickerEnabled,
      communitySubmissions,
      communityVoiceNotes,
      villageEvents,
      words,
      quizItems,
      contentOverrides,
      customBlocks,
      hiddenBlocks,
      imageOverrides
    ]
  );

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
