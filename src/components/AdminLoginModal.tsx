import React, { useState } from 'react';
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
  Download
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
    loginAdminWithServerSync,
    logoutAdmin,
    resetAdminPassword
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

  // Reset form state
  const [resetIdOrKey, setResetIdOrKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Active session change password inline toggle
  const [showChangePassInline, setShowChangePassInline] = useState(false);
  const [inlineNewPass, setInlineNewPass] = useState('');
  const [inlineMsg, setInlineMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [downloadingSourceZip, setDownloadingSourceZip] = useState(false);
  const [zipDownloadMsg, setZipDownloadMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const handleDownloadGithubSourceZip = async () => {
    if (downloadingSourceZip) return;
    setDownloadingSourceZip(true);
    setZipDownloadMsg(null);
    try {
      const res = await fetch(`/api/cloudflare-source.zip?v=${Date.now()}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get('content-type') || '';
      const blob = await res.blob();
      if (contentType.includes('text/html') || blob.size < 50000) {
        throw new Error('Invalid ZIP payload');
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
    } catch {
      setZipDownloadMsg({
        success: false,
        text: 'डाउनलोड त्रुटि: कृपया Master Studio → मास्टर बैकअप से पुनः प्रयास करें।'
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

  // Handle Password Reset
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccessMessage(null);

    if (!resetIdOrKey.trim()) {
      setResetError('Please enter your Admin ID, Email, or Master Recovery Key.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setResetError('New password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('New passwords do not match. Please re-enter carefully.');
      return;
    }

    const res = resetAdminPassword(resetIdOrKey.trim(), newPassword.trim());
    if (res.success) {
      setResetSuccessMessage(res.message);
      setPasscode(newPassword);
      setLoginId(SUPER_ADMIN_EMAIL);
      setTimeout(() => {
        setActiveTab('login');
      }, 1500);
    } else {
      setResetError(res.message);
    }
  };

  // Handle inline password update while logged in
  const handleInlineChangePass = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineMsg(null);
    if (!inlineNewPass || inlineNewPass.length < 4) {
      setInlineMsg({ success: false, text: 'Password must be at least 4 characters.' });
      return;
    }
    const res = resetAdminPassword(adminId, inlineNewPass.trim());
    if (res.success) {
      setInlineMsg({ success: true, text: 'Password updated successfully!' });
      setInlineNewPass('');
      setTimeout(() => setShowChangePassInline(false), 1500);
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

              {/* Super Admin Only: Inline Password Security Settings */}
              {isSuperAdmin ? (
                <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-amber-600" />
                      <span>Super Admin Password Settings</span>
                    </span>
                    <button
                      onClick={() => setShowChangePassInline(!showChangePassInline)}
                      className="text-xs text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                    >
                      {showChangePassInline ? 'Hide Form' : 'Change Password'}
                    </button>
                  </div>

                  {showChangePassInline && (
                    <form onSubmit={handleInlineChangePass} className="space-y-2.5 pt-1">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Set New Super Admin Password
                        </label>
                        <input
                          type="password"
                          value={inlineNewPass}
                          onChange={(e) => setInlineNewPass(e.target.value)}
                          placeholder="Enter new secure password (min 4 chars)..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
                        />
                      </div>

                      {inlineMsg && (
                        <p
                          className={`text-xs font-semibold ${
                            inlineMsg.success ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {inlineMsg.text}
                        </p>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                        >
                          Save New Password
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
              {/* Tabs Switcher: Sign In vs Reset Password */}
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
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'reset'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
                  <span>Reset ID &amp; Password</span>
                </button>
              </div>

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
                      <button
                        type="button"
                        onClick={() => setActiveTab('reset')}
                        className="text-[11px] text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                      >
                        Reset Admin Password?
                      </button>
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

              {/* TAB 2: RESET PASSWORD (SUPER ADMIN ONLY) */}
              {activeTab === 'reset' && (
                <form onSubmit={handleResetSubmit} className="space-y-3.5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-600">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-0.5">
                      <Fingerprint className="w-3.5 h-3.5 text-orange-600" />
                      <span>Super Admin Credentials Recovery &amp; Reset</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      केवल पंजीकृत मुख्य एडमिन ईमेल (<code>{SUPER_ADMIN_EMAIL}</code>) या मास्टर रिकवरी कुंजी (<code>BOSC-RECOVERY-KEY</code>) दर्ज करके नया पासवर्ड सेट करें।
                    </p>
                  </div>

                  {/* Verification Key / Admin Email */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Registered Admin Email / Recovery Key
                    </label>
                    <input
                      type="text"
                      value={resetIdOrKey}
                      onChange={(e) => {
                        setResetIdOrKey(e.target.value);
                        setResetError(null);
                      }}
                      placeholder={`e.g. ${SUPER_ADMIN_EMAIL}`}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:outline-none bg-slate-50"
                      autoFocus
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      New Admin Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setResetError(null);
                        }}
                        placeholder="Enter new password (min 4 characters)..."
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
                      placeholder="Re-enter new password..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:outline-none bg-slate-50"
                    />
                  </div>

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
                        <span className="font-bold">Password Reset Successful!</span>
                      </div>
                      <p className="text-[11px] text-emerald-900 font-normal">
                        Your credentials have been updated and saved. Switching to login...
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
                      className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-102"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset &amp; Save Password</span>
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
