import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ScriptType } from '../types';
import {
  ReadingLanguageMode,
  setActiveVoiceProfile,
  setReadingLanguageMode,
  getActiveVoiceProfile,
  getReadingLanguageMode
} from '../utils/speech';

const GOOGLE_HINT_KEY = 'hor_katha_google_auth_hint';

export type UserFontScale = 'sm' | 'md' | 'lg' | 'xl';

export interface PersonalFestivalDateOverride {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export interface PersonalFestivalEvent {
  id: string;
  nameDev: string;
  nameRoman: string;
  targetMonthDay: { month: number; day: number };
  approxDateStr: string;
  sacredDeity: string;
  traditionalSeren: { dev: string; roman: string; hindi: string };
  offerings: string[];
  ritualSummary: string;
  prepTasks?: string[];
  isCustomEvent: true;
}

export interface UserSelfPreferences {
  preferredScript: ScriptType;
  readingLangMode: ReadingLanguageMode;
  fontScale: UserFontScale;
  voiceProfileId: string;
  speechRate: number;
  dailyStudyGoalWords: number;
  personalNotes: string;
  bookmarkedTabs: string[];
  personalFestivalOverrides: Record<string, PersonalFestivalDateOverride>;
  personalCustomEvents: PersonalFestivalEvent[];
  personalPrepChecks: Record<string, boolean>;
}

export interface UserProfile {
  email: string;
  displayName: string;
  villageRegion: string;
  photoURL?: string;
  emailVerified?: boolean;
  authProvider?: 'google' | 'email_pin';
  passcodeHash?: string;
  role: 'user'; // Strictly user-level; never grants Admin CMS permissions
  createdAt: number;
  updatedAt: number;
  preferences: UserSelfPreferences;
}

interface UserAuthContextType {
  currentUser: UserProfile | null;
  isLoggedIn: boolean;
  isSyncing: boolean;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  loginOrRegisterWithEmail: (params: {
    email: string;
    displayName: string;
    passcode: string;
    villageRegion?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => void;
  updateMyPreferences: (partial: Partial<UserSelfPreferences>) => void;
  updateMyProfileInfo: (info: { displayName?: string; villageRegion?: string }) => void;
  toggleBookmarkTab: (tabId: string) => void;
  resetMyPreferences: () => void;
}

const ACTIVE_USER_EMAIL_KEY = 'hor_katha_active_user_email';
const USER_PROFILES_INDEX_KEY = 'hor_katha_user_profiles_v1';

export const DEFAULT_USER_PREFERENCES: UserSelfPreferences = {
  preferredScript: 'roman',
  readingLangMode: 'all',
  fontScale: 'md',
  voiceProfileId: 'female_sita',
  speechRate: 0.94,
  dailyStudyGoalWords: 15,
  personalNotes: '',
  bookmarkedTabs: ['lunar_calendar', 'dashboard', 'phrasebook'],
  personalFestivalOverrides: {},
  personalCustomEvents: [],
  personalPrepChecks: {}
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function simpleHash(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `h_${(h >>> 0).toString(16)}`;
}

function loadAllProfilesLocal(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(USER_PROFILES_INDEX_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProfileLocal(profile: UserProfile) {
  try {
    const all = loadAllProfilesLocal();
    all[profile.email] = profile;
    localStorage.setItem(USER_PROFILES_INDEX_KEY, JSON.stringify(all));
  } catch {
    // ignore quota
  }
}

function applyUserPreferencesToRuntime(prefs: UserSelfPreferences) {
  try {
    localStorage.setItem('hor_katha_font_scale', prefs.fontScale || 'md');
  } catch {
    // ignore
  }
  if (prefs.voiceProfileId) {
    setActiveVoiceProfile(prefs.voiceProfileId);
  }
  if (prefs.readingLangMode) {
    setReadingLanguageMode(prefs.readingLangMode);
  }
  window.dispatchEvent(
    new CustomEvent('hor-katha-user-prefs-applied', {
      detail: prefs
    })
  );
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const activeEmail = localStorage.getItem(ACTIVE_USER_EMAIL_KEY);
      if (!activeEmail) return null;
      const all = loadAllProfilesLocal();
      return all[normalizeEmail(activeEmail)] || null;
    } catch {
      return null;
    }
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync user preferences to active browser runtime on mount/switch
  useEffect(() => {
    if (currentUser) {
      applyUserPreferencesToRuntime(currentUser.preferences);
    }
  }, [currentUser?.email]);

  // Listen for Firebase Auth session changes lazily (only loads Firebase if user previously used Google Auth)
  useEffect(() => {
    const hasGoogleSessionHint =
      currentUser?.authProvider === 'google' ||
      (() => {
        try {
          return localStorage.getItem(GOOGLE_HINT_KEY) === '1';
        } catch {
          return false;
        }
      })();
    if (!hasGoogleSessionHint) return;

    let cancelled = false;
    let unsubscribeFn: (() => void) | null = null;
    const timer = window.setTimeout(() => {
      import('../utils/googleAuth')
        .then(({ initGoogleAuth }) => {
          if (cancelled) return;
          unsubscribeFn = initGoogleAuth((fbUser) => {
            if (!fbUser?.email) return;
            const cleanEmail = normalizeEmail(fbUser.email);
            const localAll = loadAllProfilesLocal();
            const existing = localAll[cleanEmail];
            setCurrentUser((prevUser) => {
              if (prevUser && prevUser.email === cleanEmail) return prevUser;
              const synced: UserProfile = existing
                ? {
                    ...existing,
                    emailVerified: fbUser.emailVerified || existing.emailVerified || true,
                    photoURL: fbUser.photoURL || existing.photoURL,
                    authProvider: 'google',
                    role: 'user'
                  }
                : {
                    email: cleanEmail,
                    displayName: fbUser.displayName || cleanEmail.split('@')[0],
                    villageRegion: 'संताल परगना (Dumka / Jharkhand)',
                    photoURL: fbUser.photoURL || '',
                    emailVerified: true,
                    authProvider: 'google',
                    role: 'user',
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    preferences: { ...DEFAULT_USER_PREFERENCES }
                  };
              saveProfileLocal(synced);
              localStorage.setItem(ACTIVE_USER_EMAIL_KEY, cleanEmail);
              return synced;
            });
          });
        })
        .catch(() => {});
    }, 800);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (unsubscribeFn) unsubscribeFn();
    };
  }, [currentUser?.authProvider]);

  const syncProfileToServer = useCallback(async (profile: UserProfile) => {
    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });
    } catch {
      // Offline / PWA mode - localStorage already persisted cleanly
    }
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    setIsSyncing(true);
    try {
      const { signInWithGoogleAccount } = await import('../utils/googleAuth');
      const { user, accessToken } = await signInWithGoogleAccount();
      try {
        localStorage.setItem(GOOGLE_HINT_KEY, '1');
      } catch {}
      const cleanEmail = user.email ? normalizeEmail(user.email) : '';
      if (!cleanEmail) {
        setIsSyncing(false);
        return { success: false, message: 'Google खाते से ईमेल प्राप्त नहीं हो सका।' };
      }

      let serverProfile: UserProfile | null = null;
      try {
        const res = await fetch('/api/user/google-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.profile) {
            serverProfile = data.profile as UserProfile;
          }
        }
      } catch {
        // Offline / local fallback
      }

      const localAll = loadAllProfilesLocal();
      const existingLocal = localAll[cleanEmail];
      const basePrefs: UserSelfPreferences = {
        ...DEFAULT_USER_PREFERENCES,
        readingLangMode: getReadingLanguageMode(),
        fontScale: (localStorage.getItem('hor_katha_font_scale') as UserFontScale) || 'md',
        voiceProfileId: getActiveVoiceProfile().id
      };

      const finalProfile: UserProfile = serverProfile
        ? {
            ...serverProfile,
            role: 'user',
            emailVerified: true,
            authProvider: 'google',
            preferences: { ...DEFAULT_USER_PREFERENCES, ...serverProfile.preferences }
          }
        : existingLocal
        ? {
            ...existingLocal,
            displayName: existingLocal.displayName || user.displayName || cleanEmail.split('@')[0],
            photoURL: user.photoURL || existingLocal.photoURL || '',
            emailVerified: true,
            authProvider: 'google',
            role: 'user',
            updatedAt: Date.now(),
            preferences: { ...DEFAULT_USER_PREFERENCES, ...existingLocal.preferences }
          }
        : {
            email: cleanEmail,
            displayName: user.displayName || cleanEmail.split('@')[0],
            villageRegion: 'संताल परगना (Dumka / Jharkhand)',
            photoURL: user.photoURL || '',
            emailVerified: true,
            authProvider: 'google',
            role: 'user',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            preferences: basePrefs
          };

      saveProfileLocal(finalProfile);
      localStorage.setItem(ACTIVE_USER_EMAIL_KEY, cleanEmail);
      setCurrentUser(finalProfile);
      applyUserPreferencesToRuntime(finalProfile.preferences);
      setIsSyncing(false);

      return {
        success: true,
        message: `जोहार ${finalProfile.displayName}! Google से आपका ईमेल (${cleanEmail}) सत्यापित हो गया।`
      };
    } catch (error: any) {
      setIsSyncing(false);
      const code = error?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return { success: false, message: 'Google साइन-इन पॉपअप बंद हो गया। कृपया पुनः प्रयास करें।' };
      }
      if (code === 'auth/popup-blocked') {
        return {
          success: false,
          message: 'ब्राउज़र ने साइन-इन पॉपअप ब्लॉक किया है। कृपया पॉपअप की अनुमति दें।'
        };
      }
      return {
        success: false,
        message: error?.message || 'Google लॉगिन असफल रहा। कृपया पुनः प्रयास करें।'
      };
    }
  }, []);

  const loginOrRegisterWithEmail = useCallback(
    async ({
      email,
      displayName,
      passcode,
      villageRegion = 'संताल परगना (Dumka / Jharkhand)'
    }: {
      email: string;
      displayName: string;
      passcode: string;
      villageRegion?: string;
    }): Promise<{ success: boolean; message: string }> => {
      const cleanEmail = normalizeEmail(email);
      if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return { success: false, message: 'कृपया एक मान्य ईमेल पता दर्ज करें (e.g. name@gmail.com)।' };
      }
      if (!passcode || passcode.trim().length < 4) {
        return { success: false, message: 'कम से कम 4 अक्षरों/अंकों का पासकोड (PIN) दर्ज करें।' };
      }

      setIsSyncing(true);
      const passHash = simpleHash(passcode.trim());
      const localAll = loadAllProfilesLocal();
      let serverProfile: UserProfile | null = null;

      // Try server sync if online
      try {
        const res = await fetch('/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            displayName: displayName.trim() || cleanEmail.split('@')[0],
            passcodeHash: passHash,
            villageRegion
          })
        });
        const data = await res.json();
        if (res.status === 401) {
          setIsSyncing(false);
          return {
            success: false,
            message: 'इस ईमेल का पासकोड मेल नहीं खा रहा है। कृपया सही निजी पासकोड दर्ज करें।'
          };
        }
        if (res.ok && data?.profile) {
          serverProfile = data.profile as UserProfile;
        }
      } catch {
        // Offline fallback below
      }

      const existingLocal = localAll[cleanEmail];
      if (!serverProfile && existingLocal && existingLocal.passcodeHash && existingLocal.passcodeHash !== passHash) {
        setIsSyncing(false);
        return {
          success: false,
          message: 'इस ईमेल के लिए दर्ज किया गया पासकोड गलत है।'
        };
      }

      const basePrefs: UserSelfPreferences = {
        ...DEFAULT_USER_PREFERENCES,
        preferredScript:
          (localStorage.getItem('hor_katha_guest_script') as ScriptType) || 'roman',
        readingLangMode: getReadingLanguageMode(),
        fontScale:
          (localStorage.getItem('hor_katha_font_scale') as UserFontScale) || 'md',
        voiceProfileId: getActiveVoiceProfile().id
      };

      const finalProfile: UserProfile = serverProfile
        ? {
            ...serverProfile,
            role: 'user',
            authProvider: 'email_pin',
            preferences: { ...DEFAULT_USER_PREFERENCES, ...serverProfile.preferences }
          }
        : existingLocal
        ? {
            ...existingLocal,
            displayName: displayName.trim() || existingLocal.displayName,
            villageRegion: villageRegion || existingLocal.villageRegion,
            authProvider: 'email_pin',
            role: 'user',
            updatedAt: Date.now(),
            preferences: { ...DEFAULT_USER_PREFERENCES, ...existingLocal.preferences }
          }
        : {
            email: cleanEmail,
            displayName: displayName.trim() || cleanEmail.split('@')[0],
            villageRegion,
            passcodeHash: passHash,
            authProvider: 'email_pin',
            role: 'user',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            preferences: basePrefs
          };

      saveProfileLocal(finalProfile);
      localStorage.setItem(ACTIVE_USER_EMAIL_KEY, cleanEmail);
      setCurrentUser(finalProfile);
      applyUserPreferencesToRuntime(finalProfile.preferences);
      setIsSyncing(false);

      return {
        success: true,
        message: existingLocal || serverProfile
          ? `जोहार ${finalProfile.displayName}! आपकी निजी सेटिंग्स लोड हो गईं।`
          : `जोहार ${finalProfile.displayName}! आपका निजी स्व-कस्टमाइज़ेशन प्रोफ़ाइल बन गया।`
      };
    },
    []
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem(ACTIVE_USER_EMAIL_KEY);
    const wasGoogle =
      currentUser?.authProvider === 'google' ||
      localStorage.getItem(GOOGLE_HINT_KEY) === '1';
    try {
      localStorage.removeItem(GOOGLE_HINT_KEY);
    } catch {}
    setCurrentUser(null);
    if (wasGoogle) {
      import('../utils/googleAuth')
        .then(({ signOutGoogleAccount }) => signOutGoogleAccount())
        .catch(() => {});
    }
    window.dispatchEvent(new CustomEvent('hor-katha-user-prefs-applied', { detail: null }));
  }, [currentUser?.authProvider]);

  const updateMyPreferences = useCallback(
    (partial: Partial<UserSelfPreferences>) => {
      setCurrentUser((prev) => {
        if (!prev) return prev;
        const nextPrefs: UserSelfPreferences = {
          ...prev.preferences,
          ...partial
        };
        const updated: UserProfile = {
          ...prev,
          updatedAt: Date.now(),
          preferences: nextPrefs
        };
        saveProfileLocal(updated);
        applyUserPreferencesToRuntime(nextPrefs);
        syncProfileToServer(updated);
        return updated;
      });
    },
    [syncProfileToServer]
  );

  const updateMyProfileInfo = useCallback(
    (info: { displayName?: string; villageRegion?: string }) => {
      setCurrentUser((prev) => {
        if (!prev) return prev;
        const updated: UserProfile = {
          ...prev,
          displayName: info.displayName?.trim() || prev.displayName,
          villageRegion: info.villageRegion?.trim() || prev.villageRegion,
          updatedAt: Date.now()
        };
        saveProfileLocal(updated);
        syncProfileToServer(updated);
        return updated;
      });
    },
    [syncProfileToServer]
  );

  const toggleBookmarkTab = useCallback(
    (tabId: string) => {
      setCurrentUser((prev) => {
        if (!prev) return prev;
        const current = prev.preferences.bookmarkedTabs || [];
        const exists = current.includes(tabId);
        const nextTabs = exists ? current.filter((t) => t !== tabId) : [tabId, ...current].slice(0, 20);
        const nextPrefs = { ...prev.preferences, bookmarkedTabs: nextTabs };
        const updated: UserProfile = {
          ...prev,
          updatedAt: Date.now(),
          preferences: nextPrefs
        };
        saveProfileLocal(updated);
        syncProfileToServer(updated);
        return updated;
      });
    },
    [syncProfileToServer]
  );

  const resetMyPreferences = useCallback(() => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updated: UserProfile = {
        ...prev,
        updatedAt: Date.now(),
        preferences: { ...DEFAULT_USER_PREFERENCES }
      };
      saveProfileLocal(updated);
      applyUserPreferencesToRuntime(updated.preferences);
      syncProfileToServer(updated);
      return updated;
    });
  }, [syncProfileToServer]);

  const contextValue = React.useMemo<UserAuthContextType>(
    () => ({
      currentUser,
      isLoggedIn: Boolean(currentUser),
      isSyncing,
      loginWithGoogle,
      loginOrRegisterWithEmail,
      logoutUser,
      updateMyPreferences,
      updateMyProfileInfo,
      toggleBookmarkTab,
      resetMyPreferences
    }),
    [
      currentUser,
      isSyncing,
      loginWithGoogle,
      loginOrRegisterWithEmail,
      logoutUser,
      updateMyPreferences,
      updateMyProfileInfo,
      toggleBookmarkTab,
      resetMyPreferences
    ]
  );

  return (
    <UserAuthContext.Provider value={contextValue}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const ctx = useContext(UserAuthContext);
  if (!ctx) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return ctx;
};
