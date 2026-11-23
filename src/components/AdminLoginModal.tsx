import React, { useEffect, useState } from 'react';
import { useAdmin, SUPER_ADMIN_EMAIL } from '../context/AdminContext';
import {
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  X,
  LogOut,
  AlertTriangle,
  Eye,
  EyeOff,
  UserX,
  RotateCcw,
  Fingerprint,
  Edit3,
  Users,
  Download,
  Mail,
  Send,
  ShieldCheck,
  Trash2
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCMS?: (initialTab?: string) => void;
  onOpenUserAuth?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onOpenCMS,
  onOpenUserAuth
}) => {
  const {
    isAdmin,
    isSuperAdmin,
    isLiveEditMode,
    setIsLiveEditMode,
    adminId,
    hasAdminPasswordSet,
    loginAdminWithServerSync,
    logoutAdmin,
    getAdminOtpStatus,
    requestAdminEmailOtp,
    verifyAdminOtpAndSetPassword,
    verifyAdminGoogleAndSetPassword,
    deleteAdminPassword
  } = useAdmin();

  // Active view tab: 'login' | 'reset'
  const [activeTab, setActiveTab] = useState<'login' | 'reset'>('login');

  // Login form state
  const [loginId, setLoginId] = useState(adminId || SUPER_ADMIN_EMAIL);
  const [passcode, setPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // Email OTP server status & cooldown state
  const [otpConfigStatus, setOtpConfigStatus] = useState<{
    emailOtpConfigured: boolean;
    provider: 'emailjs' | 'resend' | 'webhook' | 'none';
    hasCustomServerPassword?: boolean;
  } | null>(null);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [confirmDeletePass, setConfirmDeletePass] = useState(false);
  const [deletingPass, setDeletingPass] = useState(false);

  const isPasswordLocked =
    hasAdminPasswordSet || Boolean(otpConfigStatus?.hasCustomServerPassword);

  // Logged-out Reset by Email OTP form state
  const [resetEmail, setResetEmail] = useState(SUPER_ADMIN_EMAIL);
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [sendingResetOtp, setSendingResetOtp] = useState(false);
  const [verifyingResetOtp, setVerifyingResetOtp] = useState(false);
  const [verifyingGoogleReset, setVerifyingGoogleReset] = useState(false);
  const [resetOtpNotice, setResetOtpNotice] = useState<string | null>(null);
  const [resetOtpToken, setResetOtpToken] = useState('');
  const [resetSetupRequired, setResetSetupRequired] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Logged-in Super Admin change password by Email OTP inline state
  const [showChangePassInline, setShowChangePassInline] = useState(false);
  const [inlineOtp, setInlineOtp] = useState('');
  const [inlineOtpToken, setInlineOtpToken] = useState('');
  const [inlineNewPass, setInlineNewPass] = useState('');
  const [inlineConfirmPass, setInlineConfirmPass] = useState('');
  const [showInlinePass, setShowInlinePass] = useState(false);
  const [sendingInlineOtp, setSendingInlineOtp] = useState(false);
  const [verifyingInlineOtp, setVerifyingInlineOtp] = useState(false);
  const [verifyingGoogleInline, setVerifyingGoogleInline] = useState(false);
  const [inlineSetupRequired, setInlineSetupRequired] = useState(false);
  const [inlineMsg, setInlineMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [downloadingSourceZip, setDownloadingSourceZip] = useState(false);
  const [zipDownloadMsg, setZipDownloadMsg] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    getAdminOtpStatus().then((status) => {
      if (mounted) {
        setOtpConfigStatus({
          emailOtpConfigured: status.emailOtpConfigured,
          provider: status.provider,
          hasCustomServerPassword: status.hasCustomServerPassword
        });
      }
    });
    return () => {
      mounted = false;
    };
  }, [isOpen, getAdminOtpStatus]);

  useEffect(() => {
    if (isPasswordLocked && activeTab === 'reset') {
      setActiveTab('login');
    }
    if (isPasswordLocked && showChangePassInline) {
      setShowChangePassInline(false);
    }
  }, [isPasswordLocked, activeTab, showChangePassInline]);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setOtpCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpCooldown]);

  if (!isOpen) return null;

  const handleDownloadGithubSourceZip = async () => {
    if (downloadingSourceZip) return;
    setDownloadingSourceZip(true);
    setZipDownloadMsg({
      success: true,
      text: '⏳ नया santalarsi-cloudflare-source.zip (dist सहित) तैयार व डाउनलोड हो रहा है...'
    });
    try {
      const res = await fetch(`/api/cloudflare-source.zip?v=${Date.now()}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      });
      if (!res.ok) {
        const isPagesHost =
          typeof window !== 'undefined' && window.location.hostname.endsWith('.pages.dev');
        if (isPagesHost && res.status === 404) {
          throw new Error('PAGES_STATIC_HOST');
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const contentType = res.headers.get('content-type') || '';
      const blob = await res.blob();
      if (contentType.includes('text/html') || blob.size < 50000) {
        throw new Error('INVALID_ZIP');
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'santalarsi-cloudflare-source.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      setZipDownloadMsg({
        success: true,
        text: `✅ santalarsi-cloudflare-source.zip (${(blob.size / (1024 * 1024)).toFixed(2)} MB) डाउनलोड हो गया!`
      });
    } catch (err: any) {
      const code = err?.message || '';
      setZipDownloadMsg({
        success: false,
        text:
          code === 'PAGES_STATIC_HOST'
            ? 'यह बटन AI Studio Preview में काम करता है (लाइव Cloudflare साइट पर Source ZIP उपलब्ध नहीं होता)।'
            : `डाउनलोड त्रुटि (${code || 'नेटवर्क'}): कृपया 5 सेकंड बाद पुनः क्लिक करें।`
      });
    } finally {
      setDownloadingSourceZip(false);
    }
  };

  // Handle Admin or Admin-created Operator Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginId.trim()) {
      setLoginError('कृपया Admin Email (bosctechedu@gmail.com) या Operator ID दर्ज करें।');
      return;
    }
    if (!passcode.trim()) {
      setLoginError('कृपया पासवर्ड / पिन दर्ज करें।');
      return;
    }

    setIsSubmitting(true);
    const res = await loginAdminWithServerSync(loginId.trim(), passcode.trim());
    setIsSubmitting(false);

    if (res.success) {
      setLoginSuccess(
        res.role === 'super_admin'
          ? 'Super Admin (bosctechedu@gmail.com) सत्यापित! पूर्ण नियंत्रण अनलॉक हो रहा है...'
          : 'Operator खाता सत्यापित! संपादन नियंत्रण अनलॉक हो रहा है...'
      );
      setTimeout(() => {
        setLoginSuccess(null);
        setPasscode('');
        onClose();
      }, 700);
    } else {
      setLoginError(
        res.message ||
          'अमान्य ID या पासवर्ड। केवल bosctechedu@gmail.com (Admin) या Admin द्वारा बनाया गया सक्रिय Operator ही मान्य है।'
      );
    }
  };

  // Request Email OTP for Logged-out Reset tab
  const handleSendResetOtp = async () => {
    if (sendingResetOtp || otpCooldown > 0) return;
    setResetError(null);
    setResetOtpNotice(null);
    setResetSetupRequired(false);
    setSendingResetOtp(true);
    const res = await requestAdminEmailOtp(resetEmail);
    setSendingResetOtp(false);

    if (res.success) {
      setResetOtpNotice(res.message);
      if (res.otpToken) setResetOtpToken(res.otpToken);
      setOtpCooldown(45);
    } else {
      setResetError(res.message);
      if (res.setupRequired) setResetSetupRequired(true);
      if (res.retryAfterSeconds) setOtpCooldown(res.retryAfterSeconds);
    }
  };

  // Verify Email OTP & Reset Password (Logged-out Reset tab)
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccessMessage(null);

    if (resetEmail.trim().toLowerCase() !== SUPER_ADMIN_EMAIL) {
      setResetError(`केवल मुख्य एडमिन ईमेल (${SUPER_ADMIN_EMAIL}) मान्य है।`);
      return;
    }
    if (!/^\d{6}$/.test(resetOtp.trim())) {
      setResetError('कृपया ईमेल में प्राप्त 6 अंकों का OTP दर्ज करें।');
      return;
    }
    if (!newPassword || newPassword.trim().length < 6) {
      setResetError('नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setResetError('दोनों नए पासवर्ड मेल नहीं खा रहे हैं। कृपया दोबारा जांचें।');
      return;
    }

    setVerifyingResetOtp(true);
    const res = await verifyAdminOtpAndSetPassword(resetEmail, resetOtp, newPassword, resetOtpToken);
    setVerifyingResetOtp(false);

    if (res.success) {
      setResetSuccessMessage(res.message);
      setPasscode(newPassword.trim());
      setLoginId(SUPER_ADMIN_EMAIL);
      setResetOtp('');
      setResetOtpToken('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setActiveTab('login');
      }, 1500);
    } else {
      setResetError(res.message);
    }
  };

  // Google Sign-In verified backup for Logged-out Reset tab
  const handleGoogleVerifiedReset = async () => {
    setResetError(null);
    setResetSuccessMessage(null);
    if (!newPassword || newPassword.trim().length < 6) {
      setResetError('Google सत्यापन से पहले नीचे कम से कम 6 अक्षरों का नया पासवर्ड भरें।');
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setResetError('दोनों नए पासवर्ड मेल नहीं खा रहे हैं।');
      return;
    }
    setVerifyingGoogleReset(true);
    const res = await verifyAdminGoogleAndSetPassword(newPassword);
    setVerifyingGoogleReset(false);
    if (res.success) {
      setResetSuccessMessage(res.message);
      setPasscode(newPassword.trim());
      setLoginId(SUPER_ADMIN_EMAIL);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setActiveTab('login');
      }, 1500);
    } else {
      setResetError(res.message);
    }
  };

  // Request Email OTP for Logged-in Super Admin inline password change
  const handleSendInlineOtp = async () => {
    if (sendingInlineOtp || otpCooldown > 0) return;
    setInlineMsg(null);
    setInlineSetupRequired(false);
    setSendingInlineOtp(true);
    const res = await requestAdminEmailOtp(SUPER_ADMIN_EMAIL);
    setSendingInlineOtp(false);

    if (res.success) {
      setInlineMsg({ success: true, text: res.message });
      if (res.otpToken) setInlineOtpToken(res.otpToken);
      setOtpCooldown(45);
    } else {
      setInlineMsg({ success: false, text: res.message });
      if (res.setupRequired) setInlineSetupRequired(true);
      if (res.retryAfterSeconds) setOtpCooldown(res.retryAfterSeconds);
    }
  };

  // Verify Email OTP & Update Password (Logged-in Super Admin)
  const handleInlineChangePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineMsg(null);
    if (!/^\d{6}$/.test(inlineOtp.trim())) {
      setInlineMsg({ success: false, text: 'कृपया ईमेल में प्राप्त 6 अंकों का OTP दर्ज करें।' });
      return;
    }
    if (!inlineNewPass || inlineNewPass.trim().length < 6) {
      setInlineMsg({ success: false, text: 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' });
      return;
    }
    if (inlineNewPass.trim() !== inlineConfirmPass.trim()) {
      setInlineMsg({ success: false, text: 'दोनों नए पासवर्ड मेल नहीं खा रहे हैं।' });
      return;
    }
    setVerifyingInlineOtp(true);
    const res = await verifyAdminOtpAndSetPassword(
      SUPER_ADMIN_EMAIL,
      inlineOtp,
      inlineNewPass,
      inlineOtpToken
    );
    setVerifyingInlineOtp(false);

    if (res.success) {
      setInlineMsg({ success: true, text: res.message });
      setInlineOtp('');
      setInlineOtpToken('');
      setInlineNewPass('');
      setInlineConfirmPass('');
      setTimeout(() => setShowChangePassInline(false), 1600);
    } else {
      setInlineMsg({ success: false, text: res.message });
    }
  };

  // Google Sign-In verified backup for Logged-in Super Admin
  const handleInlineGoogleVerifyPass = async () => {
    setInlineMsg(null);
    if (!inlineNewPass || inlineNewPass.trim().length < 6) {
      setInlineMsg({ success: false, text: 'Google सत्यापन से पहले नीचे कम से कम 6 अक्षरों का नया पासवर्ड भरें।' });
      return;
    }
    if (inlineNewPass.trim() !== inlineConfirmPass.trim()) {
      setInlineMsg({ success: false, text: 'दोनों नए पासवर्ड मेल नहीं खा रहे हैं।' });
      return;
    }
    setVerifyingGoogleInline(true);
    const res = await verifyAdminGoogleAndSetPassword(inlineNewPass);
    setVerifyingGoogleInline(false);

    if (res.success) {
      setInlineMsg({ success: true, text: res.message });
      setInlineNewPass('');
      setInlineConfirmPass('');
      setTimeout(() => setShowChangePassInline(false), 1600);
    } else {
      setInlineMsg({ success: false, text: res.message });
    }
  };

  const handleDeleteAdminPassword = async () => {
    if (deletingPass) return;
    setDeletingPass(true);
    setInlineMsg(null);
    const res = await deleteAdminPassword();
    setDeletingPass(false);
    setConfirmDeletePass(false);
    if (res.success) {
      setOtpConfigStatus((prev) =>
        prev ? { ...prev, hasCustomServerPassword: false } : prev
      );
      setInlineMsg({ success: true, text: res.message });
    } else {
      setInlineMsg({ success: false, text: res.message });
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-200/90 relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer z-10"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header with Golden Shield & Lock */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/25 shrink-0">
            {isAdmin ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Admin Authentication Portal
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                BOSC Suite
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAdmin ? 'Active Editorial Session · Full Access' : 'Secure Login & Credential Recovery'}
            </p>
          </div>
        </div>

        {/* Main Body */}
        <div className="overflow-y-auto pt-3 space-y-4 pr-1">
          {/* Active Admin / Operator Session View */}
          {isAdmin ? (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-sm text-emerald-900">
                      {isSuperAdmin ? 'Super Admin Full Control Active' : 'Operator Editorial Session Active'}
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-mono text-[10px] font-bold">
                      {adminId}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {isSuperAdmin
                      ? 'आप मुख्य Super Admin (bosctechedu@gmail.com) हैं — आपके पास सभी १५४ मॉड्यूल, शब्दकोश, पंचांग व ऑपरेटर (Operators) बनाने/हटाने का पूर्ण अधिकार है।'
                      : 'आप Admin द्वारा अधिकृत Operator हैं — आप सामग्री, शब्दकोश, पंचांग व समुदाय सुझावों का संपादन कर सकते हैं। नए ऑपरेटर केवल मुख्य एडमिन ही बना सकते हैं।'}
                  </p>
                </div>
              </div>

              {/* Quick Launch Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {onOpenCMS && (
                  <>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCMS('calendar');
                      }}
                      className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 font-bold text-left cursor-pointer transition-colors"
                    >
                      <div className="text-xs">📅 आधिकारिक पंचांग व टाइमर</div>
                      <div className="text-[10px] text-amber-700 font-normal mt-0.5">महापर्व तिथियाँ व सूचना</div>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCMS('dictionary');
                      }}
                      className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-950 font-bold text-left cursor-pointer transition-colors"
                    >
                      <div className="text-xs">📖 शब्दकोश व प्रश्नोत्तरी</div>
                      <div className="text-[10px] text-sky-700 font-normal mt-0.5">Add / Edit / Delete</div>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCMS('live_overrides');
                      }}
                      className="p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-950 font-bold text-left cursor-pointer transition-colors"
                    >
                      <div className="text-xs">✨ लाइव पेज एडिट कंट्रोल</div>
                      <div className="text-[10px] text-indigo-700 font-normal mt-0.5">154 मॉड्यूल ब्लॉक व चित्र</div>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCMS('users_approvals');
                      }}
                      className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold text-left cursor-pointer transition-colors col-span-2"
                    >
                      <div className="text-xs flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-700" />
                        <span>
                          {isSuperAdmin
                            ? 'ऑपरेटर बनाएं (Operators), यूज़र्स डायरेक्टरी व समुदाय अप्रूवल'
                            : 'यूज़र्स डायरेक्टरी, ब्रेकिंग टिकर व शब्द सुझाव अप्रूवल'}
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-normal mt-0.5">
                        {isSuperAdmin
                          ? 'केवल bosctechedu@gmail.com द्वारा ऑपरेटर निर्माण · पट्टी सूचना · शब्दकोश समीक्षा'
                          : 'Google यूज़र्स सारांश · पट्टी सूचना · शब्दकोश समीक्षा'}
                      </div>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setIsLiveEditMode(!isLiveEditMode)}
                  className={`p-3 rounded-xl border font-bold text-left cursor-pointer transition-colors col-span-2 ${
                    isLiveEditMode
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="text-xs">
                    {isLiveEditMode ? '🟢 लाइव क्लिक-एडिट: चालू' : '⚪ लाइव क्लिक-एडिट: बंद'}
                  </div>
                  <div className="text-[10px] opacity-75 font-normal mt-0.5">तुरंत टॉगल करें</div>
                </button>
              </div>

              {/* Master CMS Launch Button */}
              {onOpenCMS && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenCMS('hero');
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs flex items-center justify-center gap-2.5 shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Launch Master Content Studio (Full CMS)</span>
                </button>
              )}

              {/* Direct 1-Click GitHub Source ZIP Download (Super Admin Only) */}
              {isSuperAdmin && (
                <div className="space-y-1.5">
                  <button
                    type="button"
                    disabled={downloadingSourceZip}
                    onClick={handleDownloadGithubSourceZip}
                    className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>
                      {downloadingSourceZip
                        ? 'GitHub Source ZIP तैयार हो रहा है...'
                        : 'GitHub + Auto-Update Source ZIP डाउनलोड करें'}
                    </span>
                  </button>
                  {zipDownloadMsg && (
                    <p
                      className={`text-[11px] font-semibold px-2 ${
                        zipDownloadMsg.success ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {zipDownloadMsg.text}
                    </p>
                  )}
                </div>
              )}

              {/* Super Admin Only: Admin Password Lock & Email OTP Security Settings */}
              {isSuperAdmin ? (
                <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-amber-600" />
                        <span>Admin Password Security</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isPasswordLocked
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPasswordLocked ? '🔒 Password Set & Locked' : 'Password Not Set'}
                      </span>
                    </div>
                    {!isPasswordLocked && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowChangePassInline(!showChangePassInline);
                          setInlineMsg(null);
                        }}
                        className="text-xs text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer shrink-0"
                      >
                        {showChangePassInline ? 'Hide' : 'Set by Email OTP'}
                      </button>
                    )}
                  </div>

                  {isPasswordLocked ? (
                    <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2.5">
                      <p className="text-[11px] text-emerald-950 leading-relaxed">
                        आपका Admin पासवर्ड १ बार सेट व लॉक हो चुका है। जब तक आप इसे Delete नहीं करेंगे, लॉगिन या सेटिंग्स में दोबारा Reset Password नहीं मांगा जाएगा।
                      </p>
                      {!confirmDeletePass ? (
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDeletePass(true);
                            setInlineMsg(null);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-[11px] cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Admin Password Delete करें</span>
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            disabled={deletingPass}
                            onClick={handleDeleteAdminPassword}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold text-[11px] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{deletingPass ? 'Deleting...' : 'हाँ, पासवर्ड Delete करें'}</span>
                          </button>
                          <button
                            type="button"
                            disabled={deletingPass}
                            onClick={() => setConfirmDeletePass(false)}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-[11px] cursor-pointer"
                          >
                            रद्द करें
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    inlineMsg &&
                    !showChangePassInline && (
                      <p
                        className={`text-xs font-semibold p-2 rounded-xl border ${
                          inlineMsg.success
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-rose-700 bg-rose-50 border-rose-200'
                        }`}
                      >
                        {inlineMsg.text}
                      </p>
                    )
                  )}

                  {!isPasswordLocked && showChangePassInline && (
                    <form onSubmit={handleInlineChangePass} className="space-y-3 pt-1">
                      {/* Step 1: Send OTP to bosctechedu@gmail.com */}
                      <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-amber-600" />
                            <span>{SUPER_ADMIN_EMAIL}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">Step 1: Email OTP</span>
                        </div>
                        <button
                          type="button"
                          disabled={sendingInlineOtp || otpCooldown > 0}
                          onClick={handleSendInlineOtp}
                          className="w-full py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 disabled:opacity-60 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>
                            {sendingInlineOtp
                              ? 'OTP भेजा जा रहा है...'
                              : otpCooldown > 0
                                ? `पुनः OTP भेजें (${otpCooldown}s)`
                                : 'bosctechedu@gmail.com पर 6-अंकीय OTP भेजें'}
                          </span>
                        </button>
                      </div>

                      {/* Step 2: Enter OTP & New Password */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            6-Digit Email OTP
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={inlineOtp}
                            onChange={(e) => setInlineOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="ईमेल में आया 6 अंकों का कोड दर्ज करें"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono tracking-widest focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            New Password (min 6 chars)
                          </label>
                          <div className="relative">
                            <input
                              type={showInlinePass ? 'text' : 'password'}
                              value={inlineNewPass}
                              onChange={(e) => setInlineNewPass(e.target.value)}
                              placeholder="नया पासवर्ड (6+ अक्षर)"
                              className="w-full px-3 py-2 pr-8 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowInlinePass(!showInlinePass)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              {showInlinePass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type={showInlinePass ? 'text' : 'password'}
                            value={inlineConfirmPass}
                            onChange={(e) => setInlineConfirmPass(e.target.value)}
                            placeholder="पासवर्ड पुनः दर्ज करें"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                          />
                        </div>
                      </div>

                      {inlineMsg && (
                        <p
                          className={`text-xs font-semibold p-2 rounded-xl border ${
                            inlineMsg.success
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-rose-700 bg-rose-50 border-rose-200'
                          }`}
                        >
                          {inlineMsg.text}
                        </p>
                      )}

                      {(inlineSetupRequired || (otpConfigStatus && !otpConfigStatus.emailOtpConfigured)) && (
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950 space-y-2">
                          <p>
                            Gmail पर असली Email OTP पाने के लिए Cloudflare Pages → Settings → Variables and Secrets में{' '}
                            <code className="font-mono font-bold">EMAILJS_SERVICE_ID</code>,{' '}
                            <code className="font-mono font-bold">EMAILJS_TEMPLATE_ID</code>,{' '}
                            <code className="font-mono font-bold">EMAILJS_PUBLIC_KEY</code> (या <code className="font-mono font-bold">RESEND_API_KEY</code>) जोड़ें।
                          </p>
                          <button
                            type="button"
                            disabled={verifyingGoogleInline}
                            onClick={handleInlineGoogleVerifyPass}
                            className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 border border-amber-300 text-slate-800 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              {verifyingGoogleInline
                                ? 'Google सत्यापन जारी...'
                                : 'या Google (bosctechedu@gmail.com) से तुरंत पासवर्ड सेट करें'}
                            </span>
                          </button>
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          disabled={verifyingInlineOtp}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                        >
                          {verifyingInlineOtp ? 'Verifying OTP...' : 'Verify OTP & Save Password'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 text-[11px] text-slate-600">
                  पासवर्ड परिवर्तन या नए ऑपरेटर बनाने का अधिकार केवल मुख्य एडमिन (<strong>{SUPER_ADMIN_EMAIL}</strong>) के पास है।
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Return to Suite
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isSuperAdmin ? 'Log Out Admin' : 'Log Out Operator'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged Out: Tabbed Navigation (Sign In & Reset Password) */
            <div className="space-y-4">
              {/* Tabs Switcher: Hide Set/Reset Password tab once password is set & locked */}
              {!isPasswordLocked ? (
                <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setLoginError(null);
                    }}
                    className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'login'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Admin Sign In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('reset');
                      setResetError(null);
                      setResetSuccessMessage(null);
                      setResetOtpNotice(null);
                    }}
                    className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'reset'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-orange-600" />
                    <span>Set Password (Email OTP)</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Admin Sign In</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    🔒 पासवर्ड सेट व लॉक है
                  </span>
                </div>
              )}

              {/* Strict Requirement Notice: Only bosctechedu@gmail.com Super Admin + Admin-created Operators */}
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <UserX className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-[11px] uppercase tracking-wider font-extrabold">
                    Super Admin (bosctechedu@gmail.com) &amp; Authorized Operators
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900">
                  मुख्य एडमिन ईमेल केवल <strong>{SUPER_ADMIN_EMAIL}</strong> है। नए ऑपरेटर केवल मुख्य एडमिन द्वारा ही बनाए जा सकते हैं।
                </p>
                {onOpenUserAuth && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenUserAuth();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 underline cursor-pointer"
                  >
                    <span>सामान्य यूज़र? केवल अपनी निजी सेटिंग्स के लिए User Email Login खोलें →</span>
                  </button>
                )}
              </div>

              {/* TAB 1: ADMIN / OPERATOR SIGN IN */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  {/* Admin Email / Operator ID Field */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Admin Email ({SUPER_ADMIN_EMAIL}) या Operator ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginId}
                        onChange={(e) => {
                          setLoginId(e.target.value);
                          setLoginError(null);
                        }}
                        placeholder="bosctechedu@gmail.com या Operator ID दर्ज करें"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50 font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Password / Operator Passcode
                      </label>
                      {!isPasswordLocked && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('reset')}
                          className="text-[11px] text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                        >
                          1 बार Password सेट करें (Email OTP)?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={passcode}
                        onChange={(e) => {
                          setPasscode(e.target.value);
                          setLoginError(null);
                        }}
                        placeholder="Enter password or operator passcode..."
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50 font-medium"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {loginError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  {/* Success Message */}
                  {loginSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{loginSuccess}</span>
                    </div>
                  )}

                  {/* Form Footer */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Verifying...' : 'Sign In'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: SET SUPER ADMIN PASSWORD BY EMAIL OTP (Only visible when no password is set / after deletion) */}
              {!isPasswordLocked && activeTab === 'reset' && (
                <form onSubmit={handleResetSubmit} className="space-y-3.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Fingerprint className="w-3.5 h-3.5 text-orange-600" />
                        <span>Super Admin Email OTP Password Setup</span>
                      </p>
                      {otpConfigStatus && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            otpConfigStatus.emailOtpConfigured
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {otpConfigStatus.emailOtpConfigured ? 'OTP Ready' : 'Key Setup Needed'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      नया Admin पासवर्ड सेट या रीसेट करने के लिए <code>{SUPER_ADMIN_EMAIL}</code> पर 6-अंकीय Email OTP मंगाकर सत्यापित करें।
                    </p>
                  </div>

                  {/* Step 1: Registered Super Admin Email + Send OTP Button */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Step 1: Registered Super Admin Email
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          setResetError(null);
                        }}
                        placeholder={SUPER_ADMIN_EMAIL}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:outline-none bg-slate-50"
                      />
                      <button
                        type="button"
                        disabled={sendingResetOtp || otpCooldown > 0}
                        onClick={handleSendResetOtp}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {sendingResetOtp
                            ? 'Sending...'
                            : otpCooldown > 0
                              ? `Resend (${otpCooldown}s)`
                              : 'Send Email OTP'}
                        </span>
                      </button>
                    </div>
                    {resetOtpNotice && (
                      <p className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                        {resetOtpNotice}
                      </p>
                    )}
                  </div>

                  {/* Step 2: 6-Digit Email OTP */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Step 2: Enter 6-Digit Email OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={resetOtp}
                      onChange={(e) => {
                        setResetOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                        setResetError(null);
                      }}
                      placeholder="Gmail इनबॉक्स में आया 6-अंकीय OTP (जैसे 482910)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono tracking-widest focus:ring-2 focus:ring-amber-500/20 focus:outline-none bg-slate-50"
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      New Admin Password (min 6 chars)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setResetError(null);
                        }}
                        placeholder="नया सुरक्षित पासवर्ड दर्ज करें (कम से कम 6 अक्षर)..."
                        className="w-full px-3.5 py-2 pr-10 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:outline-none bg-slate-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      >
                        {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setResetError(null);
                      }}
                      placeholder="नया पासवर्ड दोबारा दर्ज करें..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:outline-none bg-slate-50"
                    />
                  </div>

                  {/* Optional Setup Notice + Google Verify Backup when Email Key not configured yet */}
                  {(resetSetupRequired || (otpConfigStatus && !otpConfigStatus.emailOtpConfigured)) && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950 space-y-2">
                      <p className="font-semibold">
                        Gmail में Email OTP पाने के लिए Cloudflare Pages → Settings → Variables and Secrets में{' '}
                        <code className="font-mono font-bold">EMAILJS_SERVICE_ID</code>,{' '}
                        <code className="font-mono font-bold">EMAILJS_TEMPLATE_ID</code>,{' '}
                        <code className="font-mono font-bold">EMAILJS_PUBLIC_KEY</code> (या <code className="font-mono font-bold">RESEND_API_KEY</code>) जोड़ें।
                      </p>
                      <button
                        type="button"
                        disabled={verifyingGoogleReset}
                        onClick={handleGoogleVerifiedReset}
                        className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-amber-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>
                          {verifyingGoogleReset
                            ? 'Google सत्यापन हो रहा है...'
                            : 'तुरंत विकल्प: Google (bosctechedu@gmail.com) से पासवर्ड सेट करें'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Reset Error */}
                  {resetError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  {/* Reset Success Message */}
                  {resetSuccessMessage && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-bold">Admin Password Verified &amp; Saved!</span>
                      </div>
                      <p className="text-[11px] text-emerald-900 font-normal">
                        {resetSuccessMessage}
                      </p>
                    </div>
                  )}

                  {/* Reset Form Actions */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Back to Sign In
                    </button>

                    <button
                      type="submit"
                      disabled={verifyingResetOtp}
                      className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-102"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{verifyingResetOtp ? 'Verifying OTP...' : 'Verify OTP & Save Password'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
