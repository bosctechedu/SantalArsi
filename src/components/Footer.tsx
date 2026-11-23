import React, { useState, Suspense, lazy } from 'react';
import type { PolicyDocId } from './LegalPoliciesModal';
import { SANTALI_KEYBOARD_URL } from '../utils/externalLinks';

const LegalPoliciesModal = lazy(() =>
  import('./LegalPoliciesModal').then((m) => ({ default: m.LegalPoliciesModal }))
);
import {
  Keyboard,
  BookOpen,
  Calendar,
  GraduationCap,
  Languages,
  Smartphone,
  PenTool,
  Grid,
  Repeat,
  Printer,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Cookie,
  Bookmark,
  Eye,
  Mail,
  Sparkles,
  MessageSquareHeart
} from 'lucide-react';

interface FooterProps {
  onOpenAbout?: () => void;
  onNavigateTab?: (tab: string) => void;
  onViewModeChange?: (mode: 'desktop' | 'mobile_simulator' | 'presentation') => void;
  onOpenFeedback?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAbout,
  onNavigateTab,
  onViewModeChange,
  onOpenFeedback
}) => {
  const [activePolicyModal, setActivePolicyModal] = useState<PolicyDocId | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
    scrollToTop();
  };

  const handleSwitchView = (mode: 'desktop' | 'mobile_simulator' | 'presentation') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
    scrollToTop();
  };

  return (
    <>
      <footer data-edit-region="global_footer" className="mt-14 bg-white text-slate-700 border-t border-slate-200 relative select-none font-sans print:hidden shadow-2xs">
        {/* Live Quick Links Navigation Strip */}
        <div className="border-b border-slate-200 bg-slate-50 px-4 lg:px-8 py-3.5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 shrink-0">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600" />
              <span className="uppercase tracking-wider">Live Quick Links:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <a
                href={SANTALI_KEYBOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-slate-800 hover:text-sky-800 border border-slate-200 hover:border-sky-300 font-semibold transition-all shadow-2xs group cursor-pointer"
              >
                <Keyboard className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
                <span>Santali Keyboard</span>
              </a>

              <button
                onClick={() => handleNavigate('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-800 border border-slate-200 hover:border-amber-300 font-semibold transition-all shadow-2xs group cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                <span>50,000+ Dictionary</span>
              </button>

              <button
                onClick={() => handleNavigate('calendar')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-800 border border-slate-200 hover:border-orange-300 font-semibold transition-all shadow-2xs group cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-orange-600 group-hover:scale-110 transition-transform" />
                <span>Festivals (पर्व)</span>
              </button>

              <button
                onClick={() => handleNavigate('learn')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 font-semibold transition-all shadow-2xs group cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Learn Santali</span>
              </button>

              <button
                onClick={() => handleNavigate('translator')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-800 border border-slate-200 hover:border-rose-300 font-semibold transition-all shadow-2xs group cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
                <span>Translator</span>
              </button>

              <button
                onClick={() => handleSwitchView('mobile_simulator')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold transition-all shadow-2xs group cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition-transform" />
                <span>Android App</span>
              </button>

              <button
                onClick={() => handleSwitchView('presentation')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-slate-800 hover:text-sky-800 border border-slate-200 hover:border-sky-300 font-semibold transition-all shadow-2xs group cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
                <span>UI Presentation Sheet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer 4-Column Layout */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
            {/* Column 1: Brand & Heritage Mission Card (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-2xs bg-amber-50 border border-amber-200">
                  <img
                    src="/assets/aistudio/bosc-main-logo_39d98de6.png"
                    alt="BOSC Tech & Education"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Santal आ़रसी
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold">
                    v3.7.4 Pro Ultra · BOSC Tech &amp; Edu
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Standardized digital linguistic platform dedicated to Santali language preservation, Santali Devanagari typography, and accessible community learning. 100% Free &amp; Open Access for the Adivasi indigenous community.
              </p>

              {/* Santali Cultural Heritage & Digital Mission */}
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Bookmark className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Santali Cultural Heritage &amp; Language Mission</span>
                </div>
                <p className="text-[11px] text-amber-900/80 leading-normal pl-6">
                  Empowering the Santali language with modern digital accessibility, keyboards, and lexicon tools.
                </p>
              </div>

              {/* Green Motto Line */}
              <p className="text-xs font-semibold text-emerald-700 tracking-wide">
                Preserving Language Heritage · Digital Empowerment
              </p>
            </div>

            {/* Column 2: CORE PLATFORM */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                CORE PLATFORM
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <a
                    href={SANTALI_KEYBOARD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-slate-900 cursor-pointer transition-colors"
                  >
                    <Keyboard className="w-3.5 h-3.5 text-sky-600" />
                    <span>Santali Keyboard</span>
                  </a>
                </li>
                <li
                  onClick={() => onNavigateTab && onNavigateTab('dashboard')}
                  className="flex items-center gap-2 hover:text-slate-900 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>50,000+ Dictionary</span>
                </li>
                <li
                  onClick={() => onNavigateTab && onNavigateTab('calendar')}
                  className="flex items-center gap-2 hover:text-slate-900 cursor-pointer transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>सांस्कृतिक पर्व (पर्व)</span>
                </li>
                <li
                  onClick={() => onNavigateTab && onNavigateTab('learn')}
                  className="flex items-center gap-2 hover:text-slate-900 cursor-pointer transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Learn Santali Academy</span>
                </li>
                <li
                  onClick={() => onNavigateTab && onNavigateTab('translator')}
                  className="flex items-center gap-2 hover:text-slate-900 cursor-pointer transition-colors"
                >
                  <Languages className="w-3.5 h-3.5 text-rose-600" />
                  <span>Neural Translator</span>
                </li>
                <li
                  onClick={() => handleSwitchView('mobile_simulator')}
                  className="flex items-center gap-2 text-amber-700 hover:text-amber-900 font-semibold cursor-pointer transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Android Suite</span>
                </li>
              </ul>
            </div>

            {/* Column 3: STUDENT TOOLS */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                STUDENT TOOLS
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li
                  onClick={() => onNavigateTab && onNavigateTab('learn')}
                  className="flex items-center gap-2 hover:text-slate-900 cursor-pointer transition-colors"
                >
                  <PenTool className="w-3.5 h-3.5 text-amber-600" />
                  <span>Santali Devanagari Akhar Practice</span>
                </li>
                <li>
                  <a
                    href={SANTALI_KEYBOARD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-slate-900 cursor-pointer transition-colors"
                  >
                    <Grid className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Santali Keyboard &amp; Unicode</span>
                  </a>
                </li>
                <li
                  onClick={() => onNavigateTab && onNavigateTab('translator')}
                  className="flex items-center gap-2 hover:text-slate-900 cursor-pointer transition-colors"
                >
                  <Repeat className="w-3.5 h-3.5 text-sky-600" />
                  <span>Text Script Converter</span>
                </li>
                <li
                  onClick={() => window.print()}
                  className="flex items-center gap-2 hover:text-slate-900 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print Study Reference</span>
                </li>
              </ul>
            </div>

            {/* Column 4: POLICIES & COMPLIANCE */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  POLICIES &amp; COMPLIANCE
                </h4>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  100% Compliant
                </span>
              </div>

              {/* 2-Column Policy Buttons Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setActivePolicyModal('disclaimer')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-800 text-left transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold text-[11px]">Disclaimer</span>
                </button>

                <button
                  onClick={() => setActivePolicyModal('privacy')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 text-left transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[11px]">Privacy Policy</span>
                </button>

                <button
                  onClick={() => setActivePolicyModal('terms')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-800 text-left transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="font-semibold text-[11px]">Terms of Service</span>
                </button>

                <button
                  onClick={() => setActivePolicyModal('cookies')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-800 text-left transition-colors cursor-pointer"
                >
                  <Cookie className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold text-[11px]">Cookie Policy</span>
                </button>

                <button
                  onClick={() => setActivePolicyModal('cultural_ip')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-800 text-left transition-colors cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold text-[11px]">Cultural Heritage IP</span>
                </button>

                <button
                  onClick={() => setActivePolicyModal('accessibility')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-800 text-left transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="font-semibold text-[11px]">Accessibility</span>
                </button>
              </div>

              {/* Email & Credit Contact Line */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <a
                  href="mailto:bosctechedu@gmail.com"
                  className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px]">bosctechedu@gmail.com</span>
                </a>

                {onOpenFeedback && (
                  <button
                    onClick={onOpenFeedback}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold text-emerald-800 transition-colors cursor-pointer"
                  >
                    <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Feedback &amp; Suggestions</span>
                  </button>
                )}

                <span className="text-[11px] font-semibold text-emerald-700">
                  BOSC Tech &amp; Edu
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bilingual Content Source & Regional Dialect Disclaimer Strip */}
        <div className="border-t border-amber-200 bg-amber-50/70 px-4 lg:px-8 py-3.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11.5px] leading-relaxed text-slate-800">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>
                <strong className="text-amber-900">अस्वीकरण (Disclaimer):</strong> इस ऐप की सभी सामग्री विभिन्न पारंपरिक, मौखिक, शैक्षिक एवं सार्वजनिक स्रोतों से संकलित की गई है; हम इसकी १००% पूर्णता या आधिकारिक पुष्टि का दावा नहीं करते हैं। क्षेत्र व स्थानीय बोलियों के आधार पर संताली भाषा के शब्द, उच्चारण व वर्तनी अलग-अलग हो सकते हैं।{' '}
                <span className="text-slate-600">
                  (Content is compiled from diverse sources without 100% accuracy guarantee; words &amp; dialect terms may vary by region.)
                </span>
              </p>
            </div>
            <button
              onClick={() => setActivePolicyModal('disclaimer')}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold text-[11px] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              पूर्ण अस्वीकरण →
            </button>
          </div>
        </div>

        {/* Bottom Copyright & Link Strip */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 lg:px-8 pt-3.5 pb-20 text-xs text-slate-600">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-600">
              © 2026 <strong className="text-amber-800 font-semibold">Santal आ़रसी</strong>. All rights reserved. | <strong className="text-emerald-700 font-semibold">BOSC Tech &amp; Edu</strong> | <span className="text-amber-700 font-semibold">100% Free &amp; Open Access</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
              <button
                onClick={() => setActivePolicyModal('disclaimer')}
                className="hover:text-amber-800 transition-colors cursor-pointer"
              >
                Disclaimer
              </button>
              <span>·</span>
              <button
                onClick={() => setActivePolicyModal('privacy')}
                className="hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <span>·</span>
              <button
                onClick={() => setActivePolicyModal('terms')}
                className="hover:text-sky-700 transition-colors cursor-pointer"
              >
                Terms
              </button>
              <span>·</span>
              <button
                onClick={() => setActivePolicyModal('cookies')}
                className="hover:text-amber-800 transition-colors cursor-pointer"
              >
                Cookies
              </button>
              <span>·</span>
              <button
                onClick={() => setActivePolicyModal('accessibility')}
                className="hover:text-sky-700 transition-colors cursor-pointer"
              >
                Accessibility
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Unified Exact Legal & Governance Policy Modal */}
      {activePolicyModal !== null && (
        <Suspense fallback={null}>
          <LegalPoliciesModal
            isOpen={true}
            initialDoc={activePolicyModal}
            onClose={() => setActivePolicyModal(null)}
          />
        </Suspense>
      )}
    </>
  );
};
