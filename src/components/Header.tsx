import React from 'react';
import { ActiveDesktopTab, GlobalViewMode, ScriptType } from '../types';
import { useAdmin } from '../context/AdminContext';
import { useUserAuth } from '../context/UserAuthContext';
import { OfflineIndicator } from './OfflineIndicator';
import { HeaderReaderControls } from './GlobalTextReaderBar';
import {
  Monitor,
  Smartphone,
  LayoutGrid,
  Flame,
  PanelLeftClose,
  PanelLeftOpen,
  Lock,
  Unlock,
  Languages,
  Globe,
  Search,
  Home,
  User
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveDesktopTab;
  viewMode: GlobalViewMode;
  onViewModeChange: (mode: GlobalViewMode) => void;
  activeScript: ScriptType;
  onScriptChange: (script: ScriptType) => void;
  onOpenAbout: () => void;
  onOpenAdmin: () => void;
  onOpenUserAuth?: () => void;
  onOpenFeedback: () => void;
  onOpenDailyQuiz?: () => void;
  onOpenSearch?: () => void;
  onGoHome: () => void;
  isHomeActive?: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({
  activeTab,
  viewMode,
  onViewModeChange,
  activeScript,
  onScriptChange,
  onOpenAdmin,
  onOpenUserAuth,
  onOpenDailyQuiz,
  onOpenSearch,
  onGoHome,
  isHomeActive = true,
  sidebarOpen,
  onToggleSidebar
}) => {
  const { isAdmin } = useAdmin();
  const { currentUser, isLoggedIn } = useUserAuth();
  const [isOnline, setIsOnline] = React.useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header data-edit-region="global_header" className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs print:hidden">
      {/* Row 1: Brand + View Switcher + Top-Right Icon-Only Home Button */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-2 shrink-0">
          {viewMode === 'desktop' && (
            <button
              onClick={onToggleSidebar}
              title={sidebarOpen ? 'मेनू छुपाएं (Collapse Menu)' : 'मेनू खोलें (Open Menu)'}
              aria-label={sidebarOpen ? 'Collapse Menu' : 'Open Menu'}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/80 cursor-pointer"
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-4 h-4 text-slate-600" />
              ) : (
                <PanelLeftOpen className="w-4 h-4 text-sky-600" />
              )}
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              <img
                src="/assets/aistudio/bosc-main-logo_39d98de6.png"
                alt="BOSC Tech & Education"
                className="w-full h-full object-contain drop-shadow-xs"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
                  Santal आ़रसी
                </span>
                <span className="text-[9px] font-bold tracking-wider uppercase text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                  v3.7.4 Pro
                </span>
              </div>
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                Santali Platform · 154 Modules · Offline Ready
              </span>
            </div>
          </div>
        </div>

        {/* Center: View Mode Switcher */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 text-xs font-medium overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => onViewModeChange('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'desktop'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => onViewModeChange('mobile_simulator')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'mobile_simulator'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Mobile UI</span>
          </button>

          <button
            onClick={() => onViewModeChange('presentation')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'presentation'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>UI Sheet</span>
          </button>
        </div>

        {/* Right Top: Strictly Icon-Only Home Button */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onGoHome}
            title="मुख्य पृष्ठ (Home)"
            aria-label="Home"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border shadow-2xs hover:scale-105 active:scale-95 ${
              isHomeActive
                ? 'bg-sky-600 text-white border-sky-600 shadow-sky-500/20'
                : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200'
            }`}
          >
            <Home className="w-4 h-4" strokeWidth={2.25} />
          </button>
        </div>
      </div>

      {/* Row 2: Dedicated Utility Toolbar + Fitted 3 Reader Controls (Font, 10 Voices, Full Page Reader) */}
      <div className="border-t border-slate-200/70 bg-slate-50/90 px-3 sm:px-6 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left Side: Offline/PWA, Language, Search, Translator, Daily Quiz, Admin */}
          <div className="flex flex-wrap items-center gap-1.5">
            <OfflineIndicator />

            <div className="flex items-center bg-white border border-slate-200/90 rounded-xl px-2 py-1 shadow-2xs hover:bg-slate-100 transition-colors h-8">
              <Languages className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />
              <select
                value={activeScript === 'english' ? 'english' : activeScript === 'hindi' || activeScript === 'devanagari' ? 'hindi' : 'santali'}
                onChange={(e) => onScriptChange(e.target.value as ScriptType)}
                aria-label="Select Language Script"
                className="text-xs bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer pr-0.5"
              >
                <option value="santali">Santali</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
              </select>
            </div>

            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                title="Global Search (Ctrl+K)"
                className="flex items-center gap-1.5 px-2.5 h-8 text-xs font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/90 transition-all shadow-2xs cursor-pointer whitespace-nowrap"
              >
                <Search className="w-3.5 h-3.5 text-amber-600" />
                <span>Search</span>
                <kbd className="hidden sm:inline-flex items-center font-mono text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-1 rounded">
                  Ctrl K
                </kbd>
              </button>
            )}

            {isOnline && (
              <a
                href="https://translate.google.com/?sl=auto&tl=hi&op=translate"
                target="_blank"
                rel="noopener noreferrer"
                title="Google Translator"
                className="h-8 px-2.5 rounded-xl flex items-center justify-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all shadow-2xs whitespace-nowrap"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Translator</span>
              </a>
            )}

            {onOpenDailyQuiz && (
              <button
                onClick={onOpenDailyQuiz}
                title="Daily Santali Vocabulary Quiz"
                className="flex items-center gap-1 px-2.5 h-8 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 border border-orange-400/40 transition-all shadow-2xs cursor-pointer whitespace-nowrap"
              >
                <Flame className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Quiz</span>
              </button>
            )}

            {onOpenUserAuth && (
              <button
                onClick={onOpenUserAuth}
                title={
                  isLoggedIn && currentUser
                    ? `User Self-Customize Active (${currentUser.email})`
                    : 'User Email Login (Google / Email Self-Customize)'
                }
                className={`h-8 px-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-2xs whitespace-nowrap border ${
                  isLoggedIn
                    ? 'bg-sky-50 hover:bg-sky-100 text-sky-900 border-sky-300'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                {isLoggedIn && currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    className="w-4 h-4 rounded-full object-cover shrink-0 border border-sky-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className={`w-3.5 h-3.5 shrink-0 ${isLoggedIn ? 'text-sky-600' : 'text-slate-600'}`} />
                )}
                <span className="max-w-[95px] truncate">
                  {isLoggedIn && currentUser ? currentUser.displayName : 'User Login'}
                </span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              title={isAdmin ? 'Admin Mode Active (Full Control)' : 'Admin Login (Full Control)'}
              className={`h-8 px-2.5 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer shadow-2xs whitespace-nowrap ${
                isAdmin
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500'
                  : 'bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border border-amber-400/50'
              }`}
            >
              {isAdmin ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Admin</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>Admin</span>
                </>
              )}
            </button>
          </div>

          {/* Right Side of Header Toolbar: The 3 Reader Controls (Font Size, 10 Voices, Full Page Reader) */}
          <HeaderReaderControls activeTab={activeTab} />
        </div>
      </div>
    </header>
  );
});
