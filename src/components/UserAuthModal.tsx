import React, { useState, useEffect, useMemo } from 'react';
import { useUserAuth, UserFontScale } from '../context/UserAuthContext';
import { useAdmin } from '../context/AdminContext';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { ScriptType, ActiveDesktopTab } from '../types';
import {
  TOP_10_VOICE_MODELS,
  ReadingLanguageMode,
  speakWithFemaleVoice
} from '../utils/speech';
import {
  X,
  Mail,
  User,
  Lock,
  CheckCircle2,
  LogOut,
  MapPin,
  Sliders,
  Volume2,
  Bookmark,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  FileText,
  Target,
  ArrowRight,
  Calendar,
  Send,
  Clock,
  BookPlus
} from 'lucide-react';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: ActiveDesktopTab) => void;
}

const REGION_OPTIONS = [
  'संताल परगना (Dumka / Sahibganj / Pakur)',
  'कोल्हान व सिंहभूम (Jamshedpur / Chaibasa)',
  'मयूरभंज व क्योंझर (Odisha)',
  'बांकुड़ा व पुरुलिया (West Bengal)',
  'कोकराझार / चिरांग (Assam)',
  'अन्य क्षेत्र / प्रवासी (Global)'
];

const QUICK_MODULE_LABELS: Record<string, string> = {
  lunar_calendar: 'चंद्र पंचांग व महापर्व टाइमर',
  dashboard: '१०,०००+ शब्दकोश (Dictionary)',
  phrasebook: 'दैनिक संताली बोलचाल',
  keyboard: 'संताली कीबोर्ड',
  learn: 'संताली सीखें (Learn)',
  gram_sabha_form_drafter: 'ग्राम सभा आवेदन ड्राफ़्टर',
  daily_quiz: 'दैनिक प्रश्नोत्तरी (Quiz)',
  folk_songs: 'लोकगीत व सेरेञ'
};

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const {
    currentUser,
    isLoggedIn,
    isSyncing,
    loginWithGoogle,
    loginOrRegisterWithEmail,
    logoutUser,
    updateMyPreferences,
    updateMyProfileInfo,
    toggleBookmarkTab,
    resetMyPreferences
  } = useUserAuth();

  const { communitySubmissions, submitCommunityWord, refreshSubmissions } = useAdmin();

  // Login Form State
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [villageRegion, setVillageRegion] = useState(REGION_OPTIONS[0]);
  const [authMsg, setAuthMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Logged-in Tab & Profile Edit State
  const [activeUserTab, setActiveUserTab] = useState<'customize' | 'community'>('customize');
  const [editName, setEditName] = useState('');
  const [editRegion, setEditRegion] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Community Word Suggestion Form State
  const [subDev, setSubDev] = useState('');
  const [subRoman, setSubRoman] = useState('');
  const [subOlChiki, setSubOlChiki] = useState('');
  const [subHindi, setSubHindi] = useState('');
  const [subEnglish, setSubEnglish] = useState('');
  const [subCategory, setSubCategory] = useState('common');
  const [subExample, setSubExample] = useState('');
  const [subSubmitting, setSubSubmitting] = useState(false);
  const [subStatusMsg, setSubStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.displayName);
      setEditRegion(currentUser.villageRegion);
      setEditNotes(currentUser.preferences.personalNotes || '');
    }
  }, [currentUser, isOpen]);

  useEffect(() => {
    if (isOpen && isLoggedIn && activeUserTab === 'community') {
      refreshSubmissions();
    }
  }, [isOpen, isLoggedIn, activeUserTab]);

  const mySubmissions = useMemo(() => {
    if (!currentUser) return [];
    const targetEmail = currentUser.email.toLowerCase();
    return communitySubmissions.filter(
      (s) => s.submittedByEmail.toLowerCase() === targetEmail
    );
  }, [communitySubmissions, currentUser]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 2400);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMsg(null);
    const res = await loginOrRegisterWithEmail({
      email,
      displayName,
      passcode,
      villageRegion
    });
    setAuthMsg({ ok: res.success, text: res.message });
    if (res.success) {
      setPasscode('');
      setTimeout(() => {
        setAuthMsg(null);
      }, 1500);
    }
  };

  const handleSaveProfileMeta = () => {
    updateMyProfileInfo({ displayName: editName, villageRegion: editRegion });
    updateMyPreferences({ personalNotes: editNotes });
    showToast('आपकी निजी प्रोफ़ाइल और नोट्स सेव हो गए!');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/55 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer z-10"
          title="बंद करें"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 shrink-0">
          {isLoggedIn && currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName}
              className="w-12 h-12 rounded-2xl border border-sky-200 shadow-sm object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
              <User className="w-6 h-6" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {isLoggedIn
                  ? 'मेरा स्व-कस्टमाइज़ेशन (Self-Customize)'
                  : 'यूज़र ईमेल लॉगिन (User Email Login)'}
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wider">
                Self-Customize Only
              </span>
              {isLoggedIn && currentUser?.emailVerified && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Google Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {isLoggedIn && currentUser
                ? `${currentUser.displayName} · ${currentUser.email}`
                : 'असली Google / Gmail खाते से साइन-इन करें और अपनी निजी सेटिंग्स सेव करें'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto pt-4 space-y-4 pr-1">
          {/* Role Clarity Notice (Light Theme) */}
          <div className="p-3.5 rounded-2xl bg-sky-50/90 border border-sky-200 text-xs text-sky-950 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-sky-900">
                निजी स्व-कस्टमाइज़ेशन सुरक्षा नियम (User Scope Only)
              </p>
              <p className="text-[11px] text-sky-800 leading-relaxed">
                यह लॉगिन केवल <strong>आपके अपने अनुभव</strong> (पसंदीदा लिपि, आवाज़, फ़ॉन्ट साइज, निजी पंचांग तिथियाँ, और अध्ययन नोट्स) को आपके ईमेल पर सहेजता है। मुख्य वेबसाइट के लेख, शब्दकोश या स्लाइड्स में कोई बदलाव नहीं होगा — वैश्विक नियंत्रण केवल <strong>Admin</strong> के पास रहता है।
              </p>
            </div>
          </div>

          {!isLoggedIn ? (
            /* LOGGED OUT: Official Sign in with Google + Offline Email/PIN fallback */
            <div className="space-y-4">
              {/* Primary: Official Sign in with Google (Real Verified Email) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-center">
                <p className="text-xs font-bold text-slate-800">
                  1-क्लिक में अपने असली Gmail / Google खाते से प्रवेश करें:
                </p>
                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={async () => {
                    setAuthMsg(null);
                    const res = await loginWithGoogle();
                    setAuthMsg({ ok: res.success, text: res.message });
                  }}
                  className="w-full max-w-sm mx-auto py-3 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 shadow-sm text-slate-800 font-bold text-sm flex items-center justify-center gap-3 cursor-pointer transition-all disabled:opacity-60"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isSyncing ? 'Google से जुड़ रहा है...' : 'Sign in with Google'}</span>
                </button>
                <p className="text-[11px] text-slate-500">
                  आपकी अनुमति से केवल आपका असली नाम व ईमेल पता निजी सेटिंग्स सेव करने हेतु उपयोग होगा।
                </p>
              </div>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-slate-200" />
                <span className="shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  अथवा ऑफ़लाइन ईमेल + PIN से प्रवेश करें
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

            <form onSubmit={handleSignIn} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    आपका ईमेल पता (Email ID) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    आपका नाम (Display Name)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="उदा. रमेश मुर्मू"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    निजी पासकोड / PIN (कम से कम 4 अक्षर) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="नया या पुराना निजी PIN"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    क्षेत्र / बोली (Region / Dialect)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={villageRegion}
                      onChange={(e) => setVillageRegion(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    >
                      {REGION_OPTIONS.map((reg) => (
                        <option key={reg} value={reg}>
                          {reg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('PARISHMRD1432@gmail.com');
                    setDisplayName('परिश्रम सोरेन');
                    setPasscode('1234');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>डेमो ईमेल भरें</span>
                </button>
                <span className="text-[11px] text-slate-500">
                  पहली बार लॉगिन करने पर आपका निजी प्रोफ़ाइल स्वतः बन जाएगा।
                </span>
              </div>

              {authMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                    authMsg.ok
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{authMsg.text}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  बंद करें
                </button>
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{isSyncing ? 'सत्यापित हो रहा है...' : 'ईमेल + PIN से प्रवेश करें'}</span>
                </button>
              </div>
            </form>
            </div>
          ) : (
            /* LOGGED IN: 2-Tab Self-Customization + Community Word Submission */
            currentUser && (
              <div className="space-y-4 text-xs">
                {/* Tab Switcher */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveUserTab('customize')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      activeUserTab === 'customize'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-sky-600" />
                    <span>स्व-कस्टमाइज़ेशन</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveUserTab('community')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      activeUserTab === 'community'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookPlus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>नया शब्द सुझाव ({mySubmissions.length})</span>
                  </button>
                </div>

                {savedNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{savedNotice}</span>
                  </div>
                )}

                {activeUserTab === 'customize' ? (
                  <>
                    {/* Personal Progress & Saved Wallet Summary Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                        <div className="text-base font-black text-amber-800 font-mono tabular-nums">
                          {currentUser.preferences.bookmarkedTabs.length}
                        </div>
                        <div className="text-[10px] font-bold text-amber-900">पसंदीदा मॉड्यूल</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-center">
                        <div className="text-base font-black text-sky-800 font-mono tabular-nums">
                          {(currentUser.preferences.personalCustomEvents || []).length}
                        </div>
                        <div className="text-[10px] font-bold text-sky-900">निजी पंचांग पर्व</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                        <div className="text-base font-black text-emerald-800 font-mono tabular-nums">
                          {currentUser.preferences.dailyStudyGoalWords} शब्द
                        </div>
                        <div className="text-[10px] font-bold text-emerald-900">दैनिक अध्ययन लक्ष्य</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
                        <div className="text-base font-black text-indigo-800 font-mono tabular-nums">
                          {mySubmissions.filter((s) => s.status === 'approved').length}/{mySubmissions.length}
                        </div>
                        <div className="text-[10px] font-bold text-indigo-900">स्वीकृत शब्द योगदान</div>
                      </div>
                    </div>

                    {/* 1. Profile Identity & Region */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-sky-600" />
                          <span>मेरी पहचान व क्षेत्रीय बोली</span>
                        </h4>
                        <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-600">
                          {currentUser.email}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">प्रदर्शित नाम</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">क्षेत्र / जिला</label>
                          <select
                            value={editRegion}
                            onChange={(e) => setEditRegion(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium"
                          >
                            {REGION_OPTIONS.map((reg) => (
                              <option key={reg} value={reg}>
                                {reg}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 2. Reading, Font & Script Self-Customization */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-indigo-600" />
                        <span>मेरी पठन शैली, फ़ॉन्ट व आवाज़ प्राथमिकताएँ</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">पसंदीदा मुख्य लिपि (Script)</label>
                          <select
                            value={currentUser.preferences.preferredScript}
                            onChange={(e) => {
                              updateMyPreferences({ preferredScript: e.target.value as ScriptType });
                              showToast('लिपि प्राथमिकता अपडेट हो गई');
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium"
                          >
                            <option value="roman">Santali (Roman + देवनागरी)</option>
                            <option value="hindi">हिन्दी (Hindi Focus)</option>
                            <option value="english">English (Latin Focus)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">ऑडियो वाचन भाषा (Reader Mode)</label>
                          <select
                            value={currentUser.preferences.readingLangMode}
                            onChange={(e) => {
                              updateMyPreferences({
                                readingLangMode: e.target.value as ReadingLanguageMode
                              });
                              showToast('रीडर भाषा अपडेट हो गई');
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium"
                          >
                            <option value="all">सभी 3 भाषाएँ (हिन्दी + English + Santali)</option>
                            <option value="hindi">केवल हिन्दी</option>
                            <option value="english">English Only</option>
                            <option value="santali_roman">Santali Roman</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">फ़ॉन्ट साइज (Font Scale)</label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {(
                              [
                                { id: 'sm', label: 'A-' },
                                { id: 'md', label: 'A' },
                                { id: 'lg', label: 'A+' },
                                { id: 'xl', label: 'A++' }
                              ] as Array<{ id: UserFontScale; label: string }>
                            ).map((fs) => (
                              <button
                                key={fs.id}
                                type="button"
                                onClick={() => {
                                  updateMyPreferences({ fontScale: fs.id });
                                  showToast(`फ़ॉन्ट साइज (${fs.label}) सेव हो गया`);
                                }}
                                className={`py-2 rounded-xl border font-bold cursor-pointer ${
                                  currentUser.preferences.fontScale === fs.id
                                    ? 'bg-sky-600 text-white border-sky-600'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                {fs.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">पसंदीदा स्पीकर आवाज़ (Voice)</label>
                          <div className="flex gap-1.5">
                            <select
                              value={currentUser.preferences.voiceProfileId}
                              onChange={(e) => {
                                updateMyPreferences({ voiceProfileId: e.target.value });
                                showToast('पसंदीदा आवाज़ सेव हो गई');
                              }}
                              className="flex-1 px-2.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium"
                            >
                              {TOP_10_VOICE_MODELS.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.labelHi}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() =>
                                speakWithFemaleVoice(`जोहार ${currentUser.displayName}!`, {
                                  autoDetectLanguage: true
                                })
                              }
                              className="px-2.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-sky-50 text-sky-700 font-bold cursor-pointer flex items-center gap-1"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Personal Daily Goal & Study Notes */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-emerald-700" />
                          <span>मेरे निजी अध्ययन नोट्स व लक्ष्य</span>
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                          <Target className="w-3.5 h-3.5" />
                          <span>दैनिक लक्ष्य:</span>
                          <select
                            value={currentUser.preferences.dailyStudyGoalWords}
                            onChange={(e) =>
                              updateMyPreferences({ dailyStudyGoalWords: Number(e.target.value) })
                            }
                            className="px-2 py-0.5 rounded-lg border border-emerald-300 bg-white text-emerald-900"
                          >
                            <option value={10}>10 शब्द</option>
                            <option value={15}>15 शब्द</option>
                            <option value={25}>25 शब्द</option>
                            <option value={50}>50 शब्द</option>
                          </select>
                        </div>
                      </div>

                      <textarea
                        rows={3}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="यहाँ अपने निजी संताली शब्द, ग्राम उत्सव की तारीख़ या अभ्यास नोट्स लिखें (केवल आपको दिखेंगे)..."
                        className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveProfileMeta}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                        >
                          नाम व नोट्स सेव करें ✓
                        </button>
                      </div>
                    </div>

                    {/* 4. Personal Bookmarked Modules & Lunar Link */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Bookmark className="w-4 h-4 text-amber-600" />
                          <span>मेरे पसंदीदा मॉड्यूल ({currentUser.preferences.bookmarkedTabs.length})</span>
                        </h4>
                        {onNavigateTab && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onNavigateTab('lunar_calendar');
                            }}
                            className="text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>मेरा निजी चंद्र पंचांग खोलें</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(QUICK_MODULE_LABELS).map(([tabId, label]) => {
                          const active = currentUser.preferences.bookmarkedTabs.includes(tabId);
                          return (
                            <button
                              key={tabId}
                              type="button"
                              onClick={() => toggleBookmarkTab(tabId)}
                              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                                active
                                  ? 'bg-amber-50 border-amber-400 text-amber-900'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {active ? '★ ' : '+ '}
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  /* TAB 2: COMMUNITY WORD & REGIONAL DIALECT SUBMISSION */
                  <div className="space-y-4">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setSubStatusMsg(null);
                        setSubSubmitting(true);
                        const res = await submitCommunityWord({
                          wordDevanagari: subDev,
                          wordRoman: subRoman,
                          olChiki: subOlChiki || toOlChikiAuto(subDev || subRoman),
                          meaningHindi: subHindi,
                          meaningEnglish: subEnglish,
                          regionDialect: currentUser.villageRegion,
                          category: subCategory,
                          exampleSantali: subExample,
                          submittedByEmail: currentUser.email,
                          submittedByName: currentUser.displayName
                        });
                        setSubSubmitting(false);
                        setSubStatusMsg({ ok: res.success, text: res.message });
                        if (res.success) {
                          setSubDev('');
                          setSubRoman('');
                          setSubOlChiki('');
                          setSubHindi('');
                          setSubEnglish('');
                          setSubExample('');
                        }
                      }}
                      className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                          <BookPlus className="w-4 h-4 text-emerald-700" />
                          <span>अपने क्षेत्र का संताली शब्द / कहावत सुझाव भेजें</span>
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                          Admin समीक्षा के बाद शब्दकोश में जुड़ेगा
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">संताली शब्द (देवनागरी) *</label>
                          <input
                            type="text"
                            required
                            value={subDev}
                            onChange={(e) => {
                              setSubDev(e.target.value);
                              if (!subOlChiki) {
                                // Live preview shown below
                              }
                            }}
                            placeholder="उदा. सारहाव / बाहा"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Roman Santali वर्तनी</label>
                          <input
                            type="text"
                            value={subRoman}
                            onChange={(e) => setSubRoman(e.target.value)}
                            placeholder="e.g. Sarhao / Baha"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">हिन्दी अर्थ *</label>
                          <input
                            type="text"
                            required
                            value={subHindi}
                            onChange={(e) => setSubHindi(e.target.value)}
                            placeholder="उदा. धन्यवाद / फूल"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">English Meaning</label>
                          <input
                            type="text"
                            value={subEnglish}
                            onChange={(e) => setSubEnglish(e.target.value)}
                            placeholder="e.g. Thank you / Flower"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            ओल चिकि (ᱚᱞ ᱪᱤᱠᱤ — स्वतः preview)
                          </label>
                          <input
                            type="text"
                            value={subOlChiki}
                            onChange={(e) => setSubOlChiki(e.target.value)}
                            placeholder={toOlChikiAuto(subDev || subRoman) || 'ᱚᱞ ᱪᱤᱠᱤ'}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">श्रेणी (Category)</label>
                          <select
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                          >
                            <option value="common">सामान्य / दैनिक बोली (Common)</option>
                            <option value="culture">संस्कृति व पर्व (Culture)</option>
                            <option value="nature">प्रकृति व वनस्पति (Nature)</option>
                            <option value="relation">रिश्ते-नाते (Relation)</option>
                            <option value="food">खान-पान व कृषि (Food &amp; Agri)</option>
                            <option value="phrases">मुहावरा / कहावत (Proverb)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">वाक्य प्रयोग / क्षेत्रीय संदर्भ (वैकल्पिक)</label>
                        <input
                          type="text"
                          value={subExample}
                          onChange={(e) => setSubExample(e.target.value)}
                          placeholder="संताली या हिन्दी में उदाहरण वाक्य..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                        />
                      </div>

                      {subStatusMsg && (
                        <div
                          className={`p-2.5 rounded-xl border font-semibold flex items-center gap-2 ${
                            subStatusMsg.ok
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-rose-50 border-rose-200 text-rose-700'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{subStatusMsg.text}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] text-slate-600">
                          क्षेत्र: <strong>{currentUser.villageRegion}</strong>
                        </span>
                        <button
                          type="submit"
                          disabled={subSubmitting}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{subSubmitting ? 'भेजा जा रहा है...' : 'Admin को सुझाव भेजें'}</span>
                        </button>
                      </div>
                    </form>

                    {/* User's Submitted Words History */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-sky-600" />
                        <span>मेरे भेजे गए शब्द सुझाव ({mySubmissions.length})</span>
                      </h4>

                      {mySubmissions.length === 0 ? (
                        <p className="text-[11px] text-slate-500 py-2">
                          अभी तक आपने कोई नया शब्द नहीं भेजा है। ऊपर दिए फ़ॉर्म से अपने क्षेत्र का पहला संताली शब्द जोड़ने हेतु भेजें!
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {mySubmissions.map((item) => (
                            <div
                              key={item.id}
                              className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate">
                                  {item.wordDevanagari}{' '}
                                  <span className="font-normal text-slate-500">({item.wordRoman})</span>
                                  {item.olChiki && (
                                    <span className="ml-1.5 text-amber-800">{item.olChiki}</span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-600 truncate">
                                  {item.meaningHindi} · {item.meaningEnglish}
                                </div>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                                  item.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : item.status === 'rejected'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {item.status === 'approved'
                                  ? '✅ शब्दकोश में जुड़ा'
                                  : item.status === 'rejected'
                                  ? '❌ अस्वीकृत'
                                  : '⏳ समीक्षा में'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      resetMyPreferences();
                      showToast('आपकी सभी निजी सेटिंग्स डिफ़ॉल्ट पर रीसेट हो गई हैं');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>मेरी सेटिंग्स रीसेट</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>लॉग आउट</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
