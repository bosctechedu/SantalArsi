interface KVNamespaceLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface CloudflareEnv {
  HOR_KATHA_KV?: KVNamespaceLike;
  GEMINI_API_KEY?: string;
  RESEND_API_KEY?: string;
  ADMIN_OTP_FROM_EMAIL?: string;
  ADMIN_OTP_WEBHOOK_URL?: string;
  EMAILJS_SERVICE_ID?: string;
  EMAILJS_TEMPLATE_ID?: string;
  EMAILJS_PUBLIC_KEY?: string;
  EMAILJS_PRIVATE_KEY?: string;
  DEFAULT_ADMIN_PASSWORD?: string;
}

interface PagesEventContext {
  request: Request;
  env: CloudflareEnv;
  params: Record<string, string | string[]>;
}

interface CommunityWordSubmission {
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

interface CommunityVoiceNote {
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

interface VillageEventNotice {
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

interface AdminOperatorRecord {
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

interface AdminAuthRecord {
  passwordHash?: string;
  passwordSalt?: string;
  otpHash?: string;
  otpSalt?: string;
  otpExpiresAt?: number;
  otpAttempts?: number;
  lastOtpSentAt?: number;
  updatedAt?: number;
}

interface PersistentStore {
  adminGlobalState: {
    officialFestivalOverrides?: Record<string, { date: string; time: string; note?: string }>;
    adminLunarAnnouncement?: string;
    globalTickerText?: string;
    globalTickerEnabled?: boolean;
    updatedAt?: number;
  };
  userProfiles: Record<string, any>;
  communityWordSubmissions: CommunityWordSubmission[];
  communityVoiceNotes: CommunityVoiceNote[];
  villageEventNotices: VillageEventNotice[];
  operators: AdminOperatorRecord[];
  adminAuth?: AdminAuthRecord;
}

const SUPER_ADMIN_EMAIL = 'bosctechedu@gmail.com';
const KV_STORE_KEY = 'hor_katha_suite_store_v1';

let isolateMemoryStore: PersistentStore = {
  adminGlobalState: {},
  userProfiles: {},
  communityWordSubmissions: [],
  communityVoiceNotes: [],
  villageEventNotices: [],
  operators: [],
  adminAuth: {}
};

function isSuperAdminReq(request: Request): boolean {
  const role = String(request.headers.get('x-bosc-admin-role') || '').trim().toLowerCase();
  const id = String(request.headers.get('x-bosc-admin-id') || '').trim().toLowerCase();
  return role === 'super_admin' && id === SUPER_ADMIN_EMAIL;
}

function isEditorialAdminReq(request: Request, store: PersistentStore): boolean {
  if (isSuperAdminReq(request)) return true;
  const role = String(request.headers.get('x-bosc-admin-role') || '').trim().toLowerCase();
  const id = String(request.headers.get('x-bosc-admin-id') || '').trim().toLowerCase();
  if (role === 'operator' && id) {
    return (store.operators || []).some(
      (op) => op.isActive && op.operatorId.toLowerCase() === id
    );
  }
  return false;
}

function randomHex(bytesLen = 16): string {
  const bytes = new Uint8Array(bytesLen);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function generateSixDigitOtp(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(100000 + (buf[0] % 900000));
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

async function hashSecretWithSalt(secret: string, salt?: string): Promise<{ salt: string; hash: string }> {
  const finalSalt = salt || randomHex(16);
  const hash = await sha256Hex(`${finalSalt}::${secret}`);
  return { salt: finalSalt, hash };
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function cleanEnvVar(value?: string): string {
  return String(value || '').trim().replace(/^["']|["']$/g, '').trim();
}

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64: string): string {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64.length + 3) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function signStatelessOtpToken(
  payload: { email: string; otpHash: string; otpSalt: string; exp: number },
  secretSeed: string
): Promise<string> {
  const encoded = toBase64Url(JSON.stringify(payload));
  const sig = await sha256Hex(`${secretSeed}::${encoded}`);
  return `${encoded}.${sig}`;
}

async function verifyStatelessOtpToken(
  token: string,
  secretSeed: string
): Promise<{ email: string; otpHash: string; otpSalt: string; exp: number } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;
    const expectedSig = await sha256Hex(`${secretSeed}::${encoded}`);
    if (!constantTimeEqual(sig, expectedSig)) return null;
    const parsed = JSON.parse(fromBase64Url(encoded));
    if (!parsed?.otpHash || !parsed?.otpSalt || !parsed?.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function dispatchAdminOtpEmail(opts: {
  to: string;
  otp: string;
  expiresMinutes: number;
  resendApiKey?: string;
  fromEmail?: string;
  webhookUrl?: string;
  emailJs?: {
    serviceId?: string;
    templateId?: string;
    publicKey?: string;
    privateKey?: string;
  };
}): Promise<{ ok: boolean; error?: string }> {
  const { to, otp, expiresMinutes, resendApiKey, fromEmail, webhookUrl, emailJs } = opts;
  const subject = `[Santal Arsi] Admin Password OTP: ${otp}`;
  const text = [
    'Johar!',
    '',
    `Your Super Admin Password Verification OTP for Santal Arsi (Hor Katha Suite) is: ${otp}`,
    '',
    `This code is valid for ${expiresMinutes} minutes and applies strictly to ${to}.`,
    'If you did not request this password change, please ignore this email.'
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:16px;background:#ffffff;">
      <div style="font-size:12px;font-weight:700;color:#b45309;letter-spacing:0.08em;text-transform:uppercase;">BOSC Tech &amp; Edu · Santal Arsi</div>
      <h2 style="margin:8px 0 12px;color:#0f172a;font-size:20px;">Super Admin Email OTP Verification</h2>
      <p style="color:#475569;font-size:14px;line-height:1.5;margin:0 0 16px;">
        Use the 6-digit verification code below to set or reset the Super Admin password for <strong>${to}</strong>:
      </p>
      <div style="text-align:center;margin:20px 0;padding:16px;background:#fffbeb;border:2px dashed #f59e0b;border-radius:12px;">
        <span style="font-size:32px;font-weight:800;letter-spacing:0.25em;color:#92400e;font-family:monospace;">${otp}</span>
      </div>
      <p style="color:#64748b;font-size:12px;line-height:1.5;margin:0;">
        Valid for <strong>${expiresMinutes} minutes</strong>. Never share this OTP with anyone.
      </p>
    </div>
  `;

  if (emailJs?.serviceId && emailJs?.templateId && emailJs?.publicKey) {
    try {
      const payload: Record<string, any> = {
        service_id: emailJs.serviceId,
        template_id: emailJs.templateId,
        user_id: emailJs.publicKey,
        template_params: {
          to_email: to,
          email: to,
          otp,
          passcode: otp,
          time: `${expiresMinutes} minutes`,
          expires_in: `${expiresMinutes} minutes`,
          app_name: 'Santal Arsi',
          subject,
          message: `Your Santal Arsi Super Admin OTP is ${otp}. Valid for ${expiresMinutes} minutes.`
        }
      };
      if (emailJs.privateKey) {
        payload.accessToken = emailJs.privateKey;
      }
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        if (res.status === 403 || /non-browser/i.test(errText)) {
          return {
            ok: false,
            error:
              'EmailJS Security त्रुटि (403): EmailJS → Account → Security में "Allow EmailJS API for non-browser applications" को ON (Tick) करें, या EMAILJS_PRIVATE_KEY जोड़ें।'
          };
        }
        return {
          ok: false,
          error: `EmailJS त्रुटि (${res.status}): ${errText.slice(0, 160) || 'Service/Template/Public Key जांचें।'}`
        };
      }
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Failed to connect to EmailJS.' };
    }
  }

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, otp, subject, text, html, app: 'Santal Arsi', expiresMinutes })
      });
      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        return { ok: false, error: `OTP webhook error (${res.status}): ${errBody.slice(0, 140)}` };
      }
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'OTP webhook connection failed.' };
    }
  }

  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail || 'Santal Arsi Admin <onboarding@resend.dev>',
          to: [to],
          subject,
          text,
          html
        })
      });
      if (!res.ok) {
        const errData = (await res.json().catch(() => null)) as { message?: string } | null;
        return {
          ok: false,
          error: errData?.message || `Email provider error (${res.status}). Check RESEND_API_KEY / sender.`
        };
      }
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Failed to reach Resend email service.' };
    }
  }

  return { ok: false, error: 'Email OTP service is not configured.' };
}

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

async function loadStore(env: CloudflareEnv): Promise<PersistentStore> {
  if (env.HOR_KATHA_KV) {
    try {
      const raw = await env.HOR_KATHA_KV.get(KV_STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          adminGlobalState: parsed.adminGlobalState || {},
          userProfiles: parsed.userProfiles || {},
          communityWordSubmissions: Array.isArray(parsed.communityWordSubmissions)
            ? parsed.communityWordSubmissions
            : [],
          communityVoiceNotes: Array.isArray(parsed.communityVoiceNotes)
            ? parsed.communityVoiceNotes
            : [],
          villageEventNotices: Array.isArray(parsed.villageEventNotices)
            ? parsed.villageEventNotices
            : [],
          operators: Array.isArray(parsed.operators) ? parsed.operators : [],
          adminAuth: parsed.adminAuth || {}
        };
      }
    } catch {
      // Fallback cleanly to isolate memory store
    }
  }
  return isolateMemoryStore;
}

async function saveStore(env: CloudflareEnv, nextStore: PersistentStore): Promise<void> {
  isolateMemoryStore = nextStore;
  if (env.HOR_KATHA_KV) {
    try {
      await env.HOR_KATHA_KV.put(KV_STORE_KEY, JSON.stringify(nextStore));
    } catch {
      // Ignore KV write failure gracefully
    }
  }
}

async function parseJsonBody(request: Request): Promise<Record<string, any>> {
  try {
    return (await request.json()) as Record<string, any>;
  } catch {
    return {};
  }
}

export async function onRequest(context: PagesEventContext): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  // Health Check
  if (path === '/api/health' && method === 'GET') {
    return jsonResponse({
      status: 'ok',
      platform: 'cloudflare-pages',
      kvBound: Boolean(env.HOR_KATHA_KV),
      aiAvailable: Boolean(env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    });
  }

  // Global Admin State (Read)
  if (path === '/api/global-state' && method === 'GET') {
    const store = await loadStore(env);
    return jsonResponse({
      success: true,
      adminGlobalState: store.adminGlobalState || {}
    });
  }

  // Global Admin State (Write)
  if (path === '/api/admin/global-state' && method === 'POST') {
    const store = await loadStore(env);
    if (!isEditorialAdminReq(request, store)) {
      return jsonResponse({ error: 'Admin or active Operator authorization required for global modifications.' }, 403);
    }
    const body = await parseJsonBody(request);
    const next: PersistentStore = {
      ...store,
      adminGlobalState: {
        officialFestivalOverrides:
          body.officialFestivalOverrides ?? store.adminGlobalState.officialFestivalOverrides ?? {},
        adminLunarAnnouncement:
          typeof body.adminLunarAnnouncement === 'string'
            ? body.adminLunarAnnouncement
            : store.adminGlobalState.adminLunarAnnouncement || '',
        globalTickerText:
          typeof body.globalTickerText === 'string'
            ? body.globalTickerText
            : store.adminGlobalState.globalTickerText || '',
        globalTickerEnabled:
          typeof body.globalTickerEnabled === 'boolean'
            ? body.globalTickerEnabled
            : Boolean(store.adminGlobalState.globalTickerEnabled),
        updatedAt: Date.now()
      }
    };
    await saveStore(env, next);
    return jsonResponse({ success: true, adminGlobalState: next.adminGlobalState });
  }

  // Community Submissions
  if (path === '/api/community/submissions' && method === 'GET') {
    const store = await loadStore(env);
    const emailFilter = (url.searchParams.get('email') || '').trim().toLowerCase();
    const list = [...(store.communityWordSubmissions || [])].sort(
      (a, b) => (b.submittedAt || 0) - (a.submittedAt || 0)
    );
    const filtered = emailFilter
      ? list.filter((s) => s.submittedByEmail.toLowerCase() === emailFilter)
      : list;
    return jsonResponse({ success: true, submissions: filtered });
  }

  if (path === '/api/community/submissions' && method === 'POST') {
    const body = await parseJsonBody(request);
    const wordDevanagari = typeof body.wordDevanagari === 'string' ? body.wordDevanagari.trim() : '';
    const wordRoman = typeof body.wordRoman === 'string' ? body.wordRoman.trim() : '';
    const meaningHindi = typeof body.meaningHindi === 'string' ? body.meaningHindi.trim() : '';
    const meaningEnglish = typeof body.meaningEnglish === 'string' ? body.meaningEnglish.trim() : '';
    const submittedByEmail =
      typeof body.submittedByEmail === 'string' ? body.submittedByEmail.trim().toLowerCase() : '';

    if ((!wordDevanagari && !wordRoman) || !meaningHindi || !submittedByEmail) {
      return jsonResponse(
        { error: 'Word text, Hindi meaning, and signed-in email are required.' },
        400
      );
    }

    const store = await loadStore(env);
    const submission: CommunityWordSubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      wordDevanagari: wordDevanagari || wordRoman,
      wordRoman: wordRoman || wordDevanagari,
      olChiki: typeof body.olChiki === 'string' ? body.olChiki.trim() : '',
      meaningHindi,
      meaningEnglish: meaningEnglish || meaningHindi,
      regionDialect:
        typeof body.regionDialect === 'string' && body.regionDialect.trim()
          ? body.regionDialect.trim()
          : 'संताल परगना',
      category:
        typeof body.category === 'string' && body.category.trim() ? body.category.trim() : 'community',
      exampleSantali: typeof body.exampleSantali === 'string' ? body.exampleSantali.trim() : '',
      submittedByEmail,
      submittedByName:
        typeof body.submittedByName === 'string' && body.submittedByName.trim()
          ? body.submittedByName.trim()
          : submittedByEmail.split('@')[0],
      status: 'pending',
      submittedAt: Date.now()
    };

    store.communityWordSubmissions = [submission, ...(store.communityWordSubmissions || [])].slice(0, 500);
    await saveStore(env, store);
    return jsonResponse({ success: true, submission });
  }

  const subReviewMatch = path.match(/^\/api\/admin\/submissions\/([^/]+)\/review$/);
  if (subReviewMatch && method === 'POST') {
    const store = await loadStore(env);
    if (!isEditorialAdminReq(request, store)) {
      return jsonResponse({ error: 'Admin or active Operator authorization required to review community words.' }, 403);
    }
    const id = decodeURIComponent(subReviewMatch[1]);
    const body = await parseJsonBody(request);
    const action = body.action;
    if (action !== 'approved' && action !== 'rejected') {
      return jsonResponse({ error: 'Action must be "approved" or "rejected".' }, 400);
    }
    let updatedItem: CommunityWordSubmission | null = null;
    store.communityWordSubmissions = (store.communityWordSubmissions || []).map((item) => {
      if (item.id === id) {
        updatedItem = { ...item, status: action, reviewedAt: Date.now() };
        return updatedItem;
      }
      return item;
    });
    if (!updatedItem) {
      return jsonResponse({ error: 'Submission not found.' }, 404);
    }
    await saveStore(env, store);
    return jsonResponse({ success: true, submission: updatedItem });
  }

  // Community Voice Notes
  if (path === '/api/community/voice-notes' && method === 'GET') {
    const store = await loadStore(env);
    const statusFilter = url.searchParams.get('status') || '';
    const list = [...(store.communityVoiceNotes || [])].sort(
      (a, b) => (b.submittedAt || 0) - (a.submittedAt || 0)
    );
    const filtered = statusFilter ? list.filter((v) => v.status === statusFilter) : list;
    return jsonResponse({ success: true, voiceNotes: filtered });
  }

  if (path === '/api/community/voice-notes' && method === 'POST') {
    const body = await parseJsonBody(request);
    const wordDevanagari = typeof body.wordDevanagari === 'string' ? body.wordDevanagari.trim() : '';
    const wordRoman = typeof body.wordRoman === 'string' ? body.wordRoman.trim() : '';
    const meaningHindi = typeof body.meaningHindi === 'string' ? body.meaningHindi.trim() : '';
    const submittedByEmail =
      typeof body.submittedByEmail === 'string' ? body.submittedByEmail.trim().toLowerCase() : '';
    const audioDataUrl = typeof body.audioDataUrl === 'string' ? body.audioDataUrl : '';

    if ((!wordDevanagari && !wordRoman) || !meaningHindi || !submittedByEmail) {
      return jsonResponse({ error: 'Word, Hindi meaning, and signed-in email are required.' }, 400);
    }
    if (audioDataUrl.length > 2_000_000) {
      return jsonResponse({ error: 'Audio clip too large (max ~1.5 MB).' }, 400);
    }

    const store = await loadStore(env);
    const voiceNote: CommunityVoiceNote = {
      id: `vn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      wordDevanagari: wordDevanagari || wordRoman,
      wordRoman: wordRoman || wordDevanagari,
      olChiki: typeof body.olChiki === 'string' ? body.olChiki.trim() : '',
      meaningHindi,
      regionDialect:
        typeof body.regionDialect === 'string' && body.regionDialect.trim()
          ? body.regionDialect.trim()
          : 'संताल परगना',
      audioDataUrl: audioDataUrl.startsWith('data:audio/') ? audioDataUrl : '',
      phoneticTip: typeof body.phoneticTip === 'string' ? body.phoneticTip.trim() : '',
      submittedByEmail,
      submittedByName:
        typeof body.submittedByName === 'string' && body.submittedByName.trim()
          ? body.submittedByName.trim()
          : submittedByEmail.split('@')[0],
      upvotes: 1,
      status: 'pending',
      submittedAt: Date.now()
    };

    store.communityVoiceNotes = [voiceNote, ...(store.communityVoiceNotes || [])].slice(0, 250);
    await saveStore(env, store);
    return jsonResponse({ success: true, voiceNote });
  }

  const voiceUpvoteMatch = path.match(/^\/api\/community\/voice-notes\/([^/]+)\/upvote$/);
  if (voiceUpvoteMatch && method === 'POST') {
    const id = decodeURIComponent(voiceUpvoteMatch[1]);
    const store = await loadStore(env);
    let updated: CommunityVoiceNote | null = null;
    store.communityVoiceNotes = (store.communityVoiceNotes || []).map((vn) => {
      if (vn.id === id) {
        updated = { ...vn, upvotes: (vn.upvotes || 0) + 1 };
        return updated;
      }
      return vn;
    });
    if (!updated) {
      return jsonResponse({ error: 'Voice note not found.' }, 404);
    }
    await saveStore(env, store);
    return jsonResponse({ success: true, voiceNote: updated });
  }

  const voiceReviewMatch = path.match(/^\/api\/admin\/voice-notes\/([^/]+)\/review$/);
  if (voiceReviewMatch && method === 'POST') {
    const store = await loadStore(env);
    if (!isEditorialAdminReq(request, store)) {
      return jsonResponse({ error: 'Admin or active Operator authorization required.' }, 403);
    }
    const id = decodeURIComponent(voiceReviewMatch[1]);
    const body = await parseJsonBody(request);
    const action = body.action;
    if (action !== 'approved' && action !== 'rejected') {
      return jsonResponse({ error: 'Invalid action.' }, 400);
    }
    let updated: CommunityVoiceNote | null = null;
    store.communityVoiceNotes = (store.communityVoiceNotes || []).map((vn) => {
      if (vn.id === id) {
        updated = { ...vn, status: action, reviewedAt: Date.now() };
        return updated;
      }
      return vn;
    });
    if (!updated) {
      return jsonResponse({ error: 'Voice note not found.' }, 404);
    }
    await saveStore(env, store);
    return jsonResponse({ success: true, voiceNote: updated });
  }

  // Village Cultural & Festival Event Notices
  if (path === '/api/community/events' && method === 'GET') {
    const store = await loadStore(env);
    const statusFilter = url.searchParams.get('status') || '';
    const list = [...(store.villageEventNotices || [])].sort(
      (a, b) => (b.submittedAt || 0) - (a.submittedAt || 0)
    );
    const filtered = statusFilter ? list.filter((e) => e.status === statusFilter) : list;
    return jsonResponse({ success: true, events: filtered });
  }

  if (path === '/api/community/events' && method === 'POST') {
    const body = await parseJsonBody(request);
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const eventDate = typeof body.eventDate === 'string' ? body.eventDate.trim() : '';
    const villageDistrict =
      typeof body.villageDistrict === 'string' ? body.villageDistrict.trim() : '';
    const submittedByEmail =
      typeof body.submittedByEmail === 'string' ? body.submittedByEmail.trim().toLowerCase() : '';

    if (!title || !eventDate || !villageDistrict || !submittedByEmail) {
      return jsonResponse(
        { error: 'Event title, date, village/district, and email are required.' },
        400
      );
    }

    const store = await loadStore(env);
    const notice: VillageEventNotice = {
      id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title,
      eventType:
        typeof body.eventType === 'string' && body.eventType.trim()
          ? body.eventType.trim()
          : 'पर्व / सांस्कृतिक कार्यक्रम',
      eventDate,
      villageDistrict,
      regionDialect:
        typeof body.regionDialect === 'string' && body.regionDialect.trim()
          ? body.regionDialect.trim()
          : 'संताल परगना',
      description: typeof body.description === 'string' ? body.description.trim() : '',
      organizerName:
        typeof body.organizerName === 'string' && body.organizerName.trim()
          ? body.organizerName.trim()
          : submittedByEmail.split('@')[0],
      submittedByEmail,
      status: 'pending',
      submittedAt: Date.now()
    };

    store.villageEventNotices = [notice, ...(store.villageEventNotices || [])].slice(0, 300);
    await saveStore(env, store);
    return jsonResponse({ success: true, event: notice });
  }

  const eventReviewMatch = path.match(/^\/api\/admin\/events\/([^/]+)\/review$/);
  if (eventReviewMatch && method === 'POST') {
    const store = await loadStore(env);
    if (!isEditorialAdminReq(request, store)) {
      return jsonResponse({ error: 'Admin or active Operator authorization required.' }, 403);
    }
    const id = decodeURIComponent(eventReviewMatch[1]);
    const body = await parseJsonBody(request);
    const action = body.action;
    if (action !== 'approved' && action !== 'rejected') {
      return jsonResponse({ error: 'Invalid action.' }, 400);
    }
    let updated: VillageEventNotice | null = null;
    store.villageEventNotices = (store.villageEventNotices || []).map((ev) => {
      if (ev.id === id) {
        updated = { ...ev, status: action, reviewedAt: Date.now() };
        return updated;
      }
      return ev;
    });
    if (!updated) {
      return jsonResponse({ error: 'Event notice not found.' }, 404);
    }
    await saveStore(env, store);
    return jsonResponse({ success: true, event: updated });
  }

  // Community Hall of Fame Leaderboard
  if (path === '/api/community/leaderboard' && method === 'GET') {
    const store = await loadStore(env);
    type Entry = {
      email: string;
      name: string;
      region: string;
      approvedWords: number;
      approvedVoiceNotes: number;
      voiceUpvotes: number;
      approvedEvents: number;
      totalScore: number;
    };
    const map = new Map<string, Entry>();
    const ensure = (emailRaw: string, nameRaw: string, regionRaw: string): Entry => {
      const email = (emailRaw || 'contributor@horkatha.in').trim().toLowerCase();
      const existing = map.get(email);
      if (existing) {
        if (!existing.name && nameRaw) existing.name = nameRaw;
        if (!existing.region && regionRaw) existing.region = regionRaw;
        return existing;
      }
      const created: Entry = {
        email,
        name: (nameRaw || email.split('@')[0]).trim(),
        region: (regionRaw || 'संताल परगना (Dumka / Jharkhand)').trim(),
        approvedWords: 0,
        approvedVoiceNotes: 0,
        voiceUpvotes: 0,
        approvedEvents: 0,
        totalScore: 0
      };
      map.set(email, created);
      return created;
    };

    for (const w of store.communityWordSubmissions || []) {
      if (w.status === 'approved') {
        ensure(w.submittedByEmail, w.submittedByName, w.regionDialect).approvedWords += 1;
      }
    }
    for (const v of store.communityVoiceNotes || []) {
      if (v.status === 'approved') {
        const e = ensure(v.submittedByEmail, v.submittedByName, v.regionDialect);
        e.approvedVoiceNotes += 1;
        e.voiceUpvotes += v.upvotes || 0;
      }
    }
    for (const ev of store.villageEventNotices || []) {
      if (ev.status === 'approved') {
        ensure(ev.submittedByEmail, ev.organizerName, ev.regionDialect).approvedEvents += 1;
      }
    }

    const contributors = Array.from(map.values())
      .map((c) => ({
        ...c,
        totalScore:
          c.approvedWords * 15 +
          c.approvedVoiceNotes * 20 +
          c.voiceUpvotes * 5 +
          c.approvedEvents * 15
      }))
      .sort((a, b) => b.totalScore - a.totalScore);

    return jsonResponse({ success: true, contributors });
  }

  // Admin Users Summary
  if (path === '/api/admin/users-summary' && method === 'GET') {
    const store = await loadStore(env);
    if (!isEditorialAdminReq(request, store)) {
      return jsonResponse({ error: 'Admin authorization required.' }, 403);
    }
    const profiles = Object.values(store.userProfiles || {});
    const regionCounts: Record<string, number> = {};
    let googleVerifiedUsers = 0;

    const users = profiles
      .map((u: any) => {
        const region = u.villageRegion || 'अन्य क्षेत्र';
        regionCounts[region] = (regionCounts[region] || 0) + 1;
        if (u.authProvider === 'google' || u.emailVerified) {
          googleVerifiedUsers++;
        }
        const prefs = u.preferences || {};
        return {
          email: u.email,
          displayName: u.displayName || (u.email ? String(u.email).split('@')[0] : 'User'),
          villageRegion: region,
          photoURL: u.photoURL || '',
          authProvider: u.authProvider || 'email_pin',
          emailVerified: Boolean(u.emailVerified),
          bookmarksCount: Array.isArray(prefs.bookmarkedTabs) ? prefs.bookmarkedTabs.length : 0,
          customEventsCount: Array.isArray(prefs.personalCustomEvents)
            ? prefs.personalCustomEvents.length
            : 0,
          hasNotes: Boolean(prefs.personalNotes && String(prefs.personalNotes).trim()),
          createdAt: u.createdAt || 0,
          updatedAt: u.updatedAt || 0
        };
      })
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    return jsonResponse({
      success: true,
      totalUsers: users.length,
      googleVerifiedUsers,
      regionCounts,
      users
    });
  }

  // STRICTLY Super Admin (bosctechedu@gmail.com) ONLY: List Operators
  if (path === '/api/admin/operators' && method === 'GET') {
    if (!isSuperAdminReq(request)) {
      return jsonResponse({ error: 'Only Super Admin (bosctechedu@gmail.com) can access operators.' }, 403);
    }
    const store = await loadStore(env);
    return jsonResponse({ success: true, operators: store.operators || [] });
  }

  // STRICTLY Super Admin (bosctechedu@gmail.com) ONLY: Create or Update Operator
  if (path === '/api/admin/operators' && method === 'POST') {
    if (!isSuperAdminReq(request)) {
      return jsonResponse({ error: 'Only Super Admin (bosctechedu@gmail.com) can create or update operators.' }, 403);
    }
    const body = await parseJsonBody(request);
    const id = typeof body.id === 'string' ? body.id.trim() : '';
    const operatorId = typeof body.operatorId === 'string' ? body.operatorId.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const passcode = typeof body.passcode === 'string' ? body.passcode.trim() : '';
    const roleLabel =
      typeof body.roleLabel === 'string' && body.roleLabel.trim()
        ? body.roleLabel.trim()
        : 'Content & Dictionary Operator';
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;

    if (operatorId.toLowerCase() === SUPER_ADMIN_EMAIL) {
      return jsonResponse({ error: 'Super Admin email cannot be assigned as an Operator.' }, 400);
    }

    const store = await loadStore(env);
    const list = [...(store.operators || [])];

    if (id) {
      const idx = list.findIndex((op) => op.id === id);
      if (idx !== -1) {
        const existing = list[idx];
        const nextOp: AdminOperatorRecord = {
          ...existing,
          name: name || existing.name,
          passcode: passcode && passcode.length >= 4 ? passcode : existing.passcode,
          roleLabel: body.roleLabel ? roleLabel : existing.roleLabel,
          isActive,
          updatedAt: Date.now()
        };
        list[idx] = nextOp;
        store.operators = list;
        await saveStore(env, store);
        return jsonResponse({ success: true, operator: nextOp, operators: list });
      }
    }

    if (!operatorId || operatorId.length < 3 || !name || passcode.length < 4) {
      return jsonResponse(
        { error: 'Operator ID (min 3 chars), Name, and Passcode (min 4 chars) are required.' },
        400
      );
    }

    if (list.some((op) => op.operatorId.toLowerCase() === operatorId.toLowerCase())) {
      return jsonResponse({ error: 'An Operator with this ID already exists.' }, 409);
    }

    const now = Date.now();
    const created: AdminOperatorRecord = {
      id: id || `op_${now}_${Math.random().toString(36).slice(2, 6)}`,
      operatorId,
      name,
      passcode,
      roleLabel,
      isActive,
      createdBy: SUPER_ADMIN_EMAIL,
      createdAt: now,
      updatedAt: now
    };
    store.operators = [created, ...list];
    await saveStore(env, store);
    return jsonResponse({ success: true, operator: created, operators: store.operators });
  }

  // STRICTLY Super Admin (bosctechedu@gmail.com) ONLY: Delete Operator
  const opDeleteMatch = path.match(/^\/api\/admin\/operators\/([^/]+)$/);
  if (opDeleteMatch && method === 'DELETE') {
    if (!isSuperAdminReq(request)) {
      return jsonResponse({ error: 'Only Super Admin (bosctechedu@gmail.com) can delete operators.' }, 403);
    }
    const id = decodeURIComponent(opDeleteMatch[1]);
    const store = await loadStore(env);
    store.operators = (store.operators || []).filter((op) => op.id !== id);
    await saveStore(env, store);
    return jsonResponse({ success: true, operators: store.operators });
  }

  // Operator Login Verification (Admin-created active Operators only)
  if (path === '/api/admin/operator-login' && method === 'POST') {
    const body = await parseJsonBody(request);
    const cleanId = typeof body.operatorId === 'string' ? body.operatorId.trim().toLowerCase() : '';
    const cleanPass = typeof body.passcode === 'string' ? body.passcode.trim() : '';
    if (!cleanId || !cleanPass || cleanId === SUPER_ADMIN_EMAIL) {
      return jsonResponse({ error: 'Invalid Operator ID or Passcode.' }, 401);
    }
    const store = await loadStore(env);
    const found = (store.operators || []).find(
      (op) => op.operatorId.toLowerCase() === cleanId && op.passcode === cleanPass
    );
    if (!found) {
      return jsonResponse({ error: 'Invalid Operator ID or Passcode.' }, 401);
    }
    if (!found.isActive) {
      return jsonResponse(
        { error: 'यह ऑपरेटर खाता मुख्य एडमिन द्वारा अस्थायी रूप से बंद किया गया है।' },
        403
      );
    }
    return jsonResponse({
      success: true,
      operator: {
        id: found.id,
        operatorId: found.operatorId,
        name: found.name,
        roleLabel: found.roleLabel,
        isActive: found.isActive,
        createdBy: found.createdBy,
        createdAt: found.createdAt,
        updatedAt: found.updatedAt
      }
    });
  }

  // Super Admin Email OTP Configuration Status
  if (path === '/api/admin/otp-status' && method === 'GET') {
    const resendKey = cleanEnvVar(env.RESEND_API_KEY);
    const webhookUrl = cleanEnvVar(env.ADMIN_OTP_WEBHOOK_URL);
    const emailJsConfigured = Boolean(
      cleanEnvVar(env.EMAILJS_SERVICE_ID) &&
        cleanEnvVar(env.EMAILJS_TEMPLATE_ID) &&
        cleanEnvVar(env.EMAILJS_PUBLIC_KEY)
    );
    const store = await loadStore(env);
    const provider = emailJsConfigured
      ? 'emailjs'
      : webhookUrl
        ? 'webhook'
        : resendKey
          ? 'resend'
          : 'none';
    return jsonResponse({
      success: true,
      emailOtpConfigured: provider !== 'none',
      provider,
      targetEmail: SUPER_ADMIN_EMAIL,
      hasCustomServerPassword: Boolean(store.adminAuth?.passwordHash)
    });
  }

  // STRICTLY Super Admin (bosctechedu@gmail.com): Request 6-digit Email OTP
  if (path === '/api/admin/request-otp' && method === 'POST') {
    const body = await parseJsonBody(request);
    const cleanEmail = String(body.email || SUPER_ADMIN_EMAIL).trim().toLowerCase();
    if (cleanEmail !== SUPER_ADMIN_EMAIL) {
      return jsonResponse(
        { error: `Email OTP केवल मुख्य एडमिन (${SUPER_ADMIN_EMAIL}) के लिए ही भेजा जा सकता है।` },
        403
      );
    }

    const resendApiKey = cleanEnvVar(env.RESEND_API_KEY);
    const webhookUrl = cleanEnvVar(env.ADMIN_OTP_WEBHOOK_URL);
    const fromEmail = cleanEnvVar(env.ADMIN_OTP_FROM_EMAIL);
    const emailJs = {
      serviceId: cleanEnvVar(env.EMAILJS_SERVICE_ID),
      templateId: cleanEnvVar(env.EMAILJS_TEMPLATE_ID),
      publicKey: cleanEnvVar(env.EMAILJS_PUBLIC_KEY),
      privateKey: cleanEnvVar(env.EMAILJS_PRIVATE_KEY)
    };
    const hasEmailJs = Boolean(emailJs.serviceId && emailJs.templateId && emailJs.publicKey);

    if (!hasEmailJs && !resendApiKey && !webhookUrl) {
      return jsonResponse(
        {
          error:
            'Email OTP सेवा अभी कॉन्फ़िगर नहीं है। Cloudflare Variables में EMAILJS_SERVICE_ID / EMAILJS_TEMPLATE_ID / EMAILJS_PUBLIC_KEY या RESEND_API_KEY जोड़ें।',
          setupRequired: true
        },
        503
      );
    }

    const store = await loadStore(env);
    const now = Date.now();
    const lastSent = store.adminAuth?.lastOtpSentAt || 0;
    const elapsedMs = now - lastSent;
    if (elapsedMs < 45_000) {
      const waitSec = Math.ceil((45_000 - elapsedMs) / 1000);
      return jsonResponse(
        {
          error: `कृपया ${waitSec} सेकंड प्रतीक्षा करें और फिर नया OTP मंगाएं।`,
          retryAfterSeconds: waitSec
        },
        429
      );
    }

    const otp = generateSixDigitOtp();
    const { salt, hash } = await hashSecretWithSalt(otp);
    const exp = now + 10 * 60 * 1000;
    store.adminAuth = {
      ...(store.adminAuth || {}),
      otpHash: hash,
      otpSalt: salt,
      otpExpiresAt: exp,
      otpAttempts: 0,
      lastOtpSentAt: now
    };
    await saveStore(env, store);

    const mailResult = await dispatchAdminOtpEmail({
      to: SUPER_ADMIN_EMAIL,
      otp,
      expiresMinutes: 10,
      resendApiKey,
      fromEmail,
      webhookUrl,
      emailJs: hasEmailJs ? emailJs : undefined
    });

    if (!mailResult.ok) {
      store.adminAuth = {
        ...(store.adminAuth || {}),
        otpHash: undefined,
        otpSalt: undefined,
        otpExpiresAt: undefined,
        otpAttempts: 0,
        lastOtpSentAt: 0
      };
      await saveStore(env, store);
      return jsonResponse({ error: mailResult.error || 'Email OTP भेजने में त्रुटि हुई।' }, 502);
    }

    const tokenSecret =
      emailJs.privateKey ||
      resendApiKey ||
      emailJs.publicKey ||
      webhookUrl ||
      cleanEnvVar(env.GEMINI_API_KEY) ||
      'bosc_santalarsi_otp_key';
    const otpToken = await signStatelessOtpToken(
      { email: SUPER_ADMIN_EMAIL, otpHash: hash, otpSalt: salt, exp },
      tokenSecret
    );

    return jsonResponse({
      success: true,
      message: `6-अंकीय सत्यापन OTP (${SUPER_ADMIN_EMAIL}) के इनबॉक्स में भेज दिया गया है (10 मिनट मान्य)।`,
      expiresInSeconds: 600,
      otpToken
    });
  }

  // STRICTLY Super Admin (bosctechedu@gmail.com): Verify 6-digit Email OTP & Set New Password
  if (path === '/api/admin/verify-otp-password' && method === 'POST') {
    const body = await parseJsonBody(request);
    const cleanEmail = String(body.email || SUPER_ADMIN_EMAIL).trim().toLowerCase();
    const otp = String(body.otp || '').trim();
    const newPassword = String(body.newPassword || '').trim();
    const otpToken = String(body.otpToken || '').trim();

    if (cleanEmail !== SUPER_ADMIN_EMAIL) {
      return jsonResponse({ error: `केवल ${SUPER_ADMIN_EMAIL} मान्य है।` }, 403);
    }
    if (!/^\d{6}$/.test(otp)) {
      return jsonResponse({ error: 'कृपया 6 अंकों का सही OTP दर्ज करें।' }, 400);
    }
    if (newPassword.length < 6) {
      return jsonResponse({ error: 'नया Admin पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' }, 400);
    }

    const store = await loadStore(env);
    const auth = store.adminAuth || {};

    let activeHash = auth.otpHash;
    let activeSalt = auth.otpSalt;
    let activeExp = auth.otpExpiresAt;
    let usingStateless = false;

    if ((!activeHash || !activeSalt || !activeExp) && otpToken) {
      const tokenSecret =
        cleanEnvVar(env.EMAILJS_PRIVATE_KEY) ||
        cleanEnvVar(env.RESEND_API_KEY) ||
        cleanEnvVar(env.EMAILJS_PUBLIC_KEY) ||
        cleanEnvVar(env.ADMIN_OTP_WEBHOOK_URL) ||
        cleanEnvVar(env.GEMINI_API_KEY) ||
        'bosc_santalarsi_otp_key';
      const verifiedToken = await verifyStatelessOtpToken(otpToken, tokenSecret);
      if (verifiedToken && verifiedToken.email === SUPER_ADMIN_EMAIL) {
        activeHash = verifiedToken.otpHash;
        activeSalt = verifiedToken.otpSalt;
        activeExp = verifiedToken.exp;
        usingStateless = true;
      }
    }

    if (!activeHash || !activeSalt || !activeExp) {
      return jsonResponse(
        { error: 'कोई सक्रिय OTP नहीं मिला। कृपया पहले "Send Email OTP" पर क्लिक करें।' },
        400
      );
    }
    if (Date.now() > activeExp) {
      return jsonResponse(
        { error: 'OTP की समय-सीमा (10 मिनट) समाप्त हो गई है। कृपया नया OTP मंगाएं।' },
        400
      );
    }
    if (!usingStateless && (auth.otpAttempts || 0) >= 5) {
      return jsonResponse(
        { error: 'गलत OTP के 5 से अधिक प्रयास। सुरक्षा के लिए नया OTP मंगाएं।' },
        429
      );
    }

    const candidate = await hashSecretWithSalt(otp, activeSalt);
    if (!constantTimeEqual(candidate.hash, activeHash)) {
      if (!usingStateless) {
        store.adminAuth = {
          ...auth,
          otpAttempts: (auth.otpAttempts || 0) + 1
        };
        await saveStore(env, store);
        const remaining = Math.max(0, 5 - (store.adminAuth.otpAttempts || 0));
        return jsonResponse({ error: `अमान्य OTP। शेष प्रयास: ${remaining}` }, 401);
      }
      return jsonResponse({ error: 'अमान्य 6-अंकीय OTP। कृपया सही कोड दर्ज करें।' }, 401);
    }

    const passDigest = await hashSecretWithSalt(newPassword);
    store.adminAuth = {
      passwordHash: passDigest.hash,
      passwordSalt: passDigest.salt,
      otpHash: undefined,
      otpSalt: undefined,
      otpExpiresAt: undefined,
      otpAttempts: 0,
      lastOtpSentAt: 0,
      updatedAt: Date.now()
    };
    await saveStore(env, store);

    return jsonResponse({
      success: true,
      message: 'Email OTP सत्यापित! नया Super Admin पासवर्ड सुरक्षित रूप से सेव हो गया है।'
    });
  }

  // Google OAuth Verified Password Set/Reset Backup (strictly bosctechedu@gmail.com)
  if (path === '/api/admin/google-verify-password' && method === 'POST') {
    try {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      const body = await parseJsonBody(request);
      const newPassword = String(body.newPassword || '').trim();

      if (!token) {
        return jsonResponse({ error: 'Google OAuth टोकन आवश्यक है।' }, 401);
      }
      if (newPassword.length < 6) {
        return jsonResponse({ error: 'नया Admin पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' }, 400);
      }

      const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!googleRes.ok) {
        return jsonResponse({ error: 'Google सत्यापन विफल रहा। कृपया पुनः Google Sign-In करें।' }, 401);
      }

      const info = (await googleRes.json()) as { email?: string; email_verified?: boolean };
      const verifiedEmail = (info.email || '').trim().toLowerCase();
      if (verifiedEmail !== SUPER_ADMIN_EMAIL || info.email_verified === false) {
        return jsonResponse(
          {
            error: `अनुमति अस्वीकृत: केवल ${SUPER_ADMIN_EMAIL} से Google Sign-In करने पर ही पासवर्ड बदला जा सकता है।`
          },
          403
        );
      }

      const store = await loadStore(env);
      const passDigest = await hashSecretWithSalt(newPassword);
      store.adminAuth = {
        passwordHash: passDigest.hash,
        passwordSalt: passDigest.salt,
        otpHash: undefined,
        otpSalt: undefined,
        otpExpiresAt: undefined,
        otpAttempts: 0,
        lastOtpSentAt: 0,
        updatedAt: Date.now()
      };
      await saveStore(env, store);

      return jsonResponse({
        success: true,
        message: `Google खाता (${SUPER_ADMIN_EMAIL}) सत्यापित! नया Admin पासवर्ड सेव हो गया।`
      });
    } catch {
      return jsonResponse({ error: 'Google सत्यापन के दौरान सर्वर त्रुटि।' }, 500);
    }
  }

  // Super Admin Server-Synced Login Verification
  if (path === '/api/admin/super-login' && method === 'POST') {
    const body = await parseJsonBody(request);
    const cleanEmail = String(body.email || '').trim().toLowerCase();
    const cleanPassword = String(body.password || '').trim();

    if (cleanEmail !== SUPER_ADMIN_EMAIL || !cleanPassword) {
      return jsonResponse({ error: `केवल ${SUPER_ADMIN_EMAIL} और सही पासवर्ड मान्य है।` }, 401);
    }

    const store = await loadStore(env);
    const auth = store.adminAuth;
    if (auth?.passwordHash && auth?.passwordSalt) {
      const candidate = await hashSecretWithSalt(cleanPassword, auth.passwordSalt);
      if (!constantTimeEqual(candidate.hash, auth.passwordHash)) {
        return jsonResponse({ error: 'अमान्य Super Admin पासवर्ड।' }, 401);
      }
      return jsonResponse({
        success: true,
        role: 'super_admin',
        email: SUPER_ADMIN_EMAIL,
        hasServerPassword: true
      });
    }

    const defaultPass = (env.DEFAULT_ADMIN_PASSWORD || 'admin123').trim();
    if (!constantTimeEqual(cleanPassword, defaultPass)) {
      return jsonResponse({ error: 'अमान्य Super Admin पासवर्ड।' }, 401);
    }

    return jsonResponse({
      success: true,
      role: 'super_admin',
      email: SUPER_ADMIN_EMAIL,
      hasServerPassword: false
    });
  }

  // User Email Login
  if (path === '/api/user/login' && method === 'POST') {
    const body = await parseJsonBody(request);
    const { email, displayName, passcodeHash, villageRegion } = body;
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return jsonResponse({ error: 'Valid email is required.' }, 400);
    }

    const store = await loadStore(env);
    const existing = store.userProfiles[cleanEmail];
    if (existing) {
      if (existing.passcodeHash && passcodeHash && existing.passcodeHash !== passcodeHash) {
        return jsonResponse({ error: 'Invalid personal passcode.' }, 401);
      }
      const updated = {
        ...existing,
        displayName: displayName || existing.displayName,
        villageRegion: villageRegion || existing.villageRegion,
        role: 'user',
        updatedAt: Date.now()
      };
      store.userProfiles[cleanEmail] = updated;
      await saveStore(env, store);
      return jsonResponse({ success: true, profile: updated });
    }

    const created = {
      email: cleanEmail,
      displayName: displayName || cleanEmail.split('@')[0],
      villageRegion: villageRegion || 'संताल परगना (Dumka / Jharkhand)',
      passcodeHash: passcodeHash || '',
      role: 'user',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      preferences: {
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
      }
    };
    store.userProfiles[cleanEmail] = created;
    await saveStore(env, store);
    return jsonResponse({ success: true, profile: created });
  }

  // Verified Google Login
  if (path === '/api/user/google-login' && method === 'POST') {
    try {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      if (!token) {
        return jsonResponse({ error: 'Authorization Bearer token is required.' }, 401);
      }

      const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!googleRes.ok) {
        return jsonResponse({ error: 'Invalid or expired Google OAuth token.' }, 401);
      }

      const info = (await googleRes.json()) as {
        email?: string;
        email_verified?: boolean;
        name?: string;
        picture?: string;
      };
      const cleanEmail = info.email ? info.email.trim().toLowerCase() : '';
      if (!cleanEmail) {
        return jsonResponse({ error: 'Google account email could not be verified.' }, 400);
      }

      const store = await loadStore(env);
      const existing = store.userProfiles[cleanEmail];
      const verifiedProfile = existing
        ? {
            ...existing,
            email: cleanEmail,
            displayName: existing.displayName || info.name || cleanEmail.split('@')[0],
            photoURL: info.picture || existing.photoURL || '',
            emailVerified: Boolean(info.email_verified ?? true),
            authProvider: 'google',
            role: 'user',
            updatedAt: Date.now()
          }
        : {
            email: cleanEmail,
            displayName: info.name || cleanEmail.split('@')[0],
            photoURL: info.picture || '',
            emailVerified: Boolean(info.email_verified ?? true),
            authProvider: 'google',
            villageRegion: 'संताल परगना (Dumka / Jharkhand)',
            role: 'user',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            preferences: {
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
            }
          };

      store.userProfiles[cleanEmail] = verifiedProfile;
      await saveStore(env, store);
      return jsonResponse({ success: true, profile: verifiedProfile });
    } catch {
      return jsonResponse({ error: 'Failed to verify Google account.' }, 500);
    }
  }

  // Save User Profile Preferences
  if (path === '/api/user/profile' && method === 'POST') {
    const body = await parseJsonBody(request);
    const profile = body.profile;
    const cleanEmail = profile?.email ? String(profile.email).trim().toLowerCase() : '';
    if (!cleanEmail) {
      return jsonResponse({ error: 'Email profile required.' }, 400);
    }
    const store = await loadStore(env);
    const existing = store.userProfiles[cleanEmail] || {};
    store.userProfiles[cleanEmail] = {
      ...existing,
      ...profile,
      email: cleanEmail,
      role: 'user',
      updatedAt: Date.now()
    };
    await saveStore(env, store);
    return jsonResponse({ success: true, profile: store.userProfiles[cleanEmail] });
  }

  return jsonResponse({ error: 'API endpoint not found' }, 404);
}
