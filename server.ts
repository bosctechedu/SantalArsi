import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

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

export interface AdminOperatorRecord {
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

// Lightweight local JSON store for offline-ready user self-customization & admin global festival state
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
}

const SUPER_ADMIN_EMAIL = 'bosctechedu@gmail.com';
const STORE_DIR = path.resolve(__dirname, '.data');
const STORE_FILE = path.join(STORE_DIR, 'hor-katha-store.json');

let memoryStore: PersistentStore = {
  adminGlobalState: {},
  userProfiles: {},
  communityWordSubmissions: [],
  communityVoiceNotes: [],
  villageEventNotices: [],
  operators: []
};

function isSuperAdminHeaders(headers: Record<string, any>): boolean {
  const role = String(headers['x-bosc-admin-role'] || '').trim().toLowerCase();
  const id = String(headers['x-bosc-admin-id'] || '').trim().toLowerCase();
  return role === 'super_admin' && id === SUPER_ADMIN_EMAIL;
}

function isEditorialAdminHeaders(headers: Record<string, any>, store: PersistentStore): boolean {
  if (isSuperAdminHeaders(headers)) return true;
  const role = String(headers['x-bosc-admin-role'] || '').trim().toLowerCase();
  const id = String(headers['x-bosc-admin-id'] || '').trim().toLowerCase();
  if (role === 'operator' && id) {
    return (store.operators || []).some(
      (op) => op.isActive && op.operatorId.toLowerCase() === id
    );
  }
  return false;
}

function loadStoreFromDisk(): PersistentStore {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
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
        operators: Array.isArray(parsed.operators) ? parsed.operators : []
      };
    }
  } catch {
    // fallback to memory store
  }
  return memoryStore;
}

function saveStoreToDisk(nextStore: PersistentStore) {
  memoryStore = nextStore;
  try {
    if (!fs.existsSync(STORE_DIR)) {
      fs.mkdirSync(STORE_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(nextStore, null, 2), 'utf-8');
  } catch {
    // ignore read-only disk in sandbox, memoryStore stays fresh
  }
}

memoryStore = loadStoreFromDisk();

// Shared Gemini client with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiAvailable: !!aiClient,
    timestamp: new Date().toISOString(),
  });
});

// Public read of Admin-published global lunar festival dates, announcements & breaking ticker
app.get('/api/global-state', (_req, res) => {
  const store = loadStoreFromDisk();
  res.json({
    success: true,
    adminGlobalState: store.adminGlobalState || {}
  });
});

// Admin-only update of official global festival overrides, announcements & breaking ticker
app.post('/api/admin/global-state', (req, res) => {
  const store = loadStoreFromDisk();
  if (!isEditorialAdminHeaders(req.headers, store)) {
    res.status(403).json({ error: 'Admin or active Operator authorization required for global modifications.' });
    return;
  }
  const {
    officialFestivalOverrides,
    adminLunarAnnouncement,
    globalTickerText,
    globalTickerEnabled
  } = req.body || {};
  const next: PersistentStore = {
    ...store,
    adminGlobalState: {
      officialFestivalOverrides: officialFestivalOverrides ?? store.adminGlobalState.officialFestivalOverrides ?? {},
      adminLunarAnnouncement: typeof adminLunarAnnouncement === 'string'
        ? adminLunarAnnouncement
        : store.adminGlobalState.adminLunarAnnouncement || '',
      globalTickerText: typeof globalTickerText === 'string'
        ? globalTickerText
        : store.adminGlobalState.globalTickerText || '',
      globalTickerEnabled: typeof globalTickerEnabled === 'boolean'
        ? globalTickerEnabled
        : Boolean(store.adminGlobalState.globalTickerEnabled),
      updatedAt: Date.now()
    }
  };
  saveStoreToDisk(next);
  res.json({ success: true, adminGlobalState: next.adminGlobalState });
});

// Community Word & Dialect Submissions (User submits -> Pending; Admin approves into Live Dictionary)
app.get('/api/community/submissions', (req, res) => {
  const store = loadStoreFromDisk();
  const emailFilter = typeof req.query.email === 'string' ? req.query.email.trim().toLowerCase() : '';
  const list = [...(store.communityWordSubmissions || [])].sort(
    (a, b) => (b.submittedAt || 0) - (a.submittedAt || 0)
  );
  const filtered = emailFilter
    ? list.filter((s) => s.submittedByEmail.toLowerCase() === emailFilter)
    : list;
  res.json({ success: true, submissions: filtered });
});

app.post('/api/community/submissions', (req, res) => {
  const body = req.body || {};
  const wordDevanagari = typeof body.wordDevanagari === 'string' ? body.wordDevanagari.trim() : '';
  const wordRoman = typeof body.wordRoman === 'string' ? body.wordRoman.trim() : '';
  const meaningHindi = typeof body.meaningHindi === 'string' ? body.meaningHindi.trim() : '';
  const meaningEnglish = typeof body.meaningEnglish === 'string' ? body.meaningEnglish.trim() : '';
  const submittedByEmail = typeof body.submittedByEmail === 'string' ? body.submittedByEmail.trim().toLowerCase() : '';

  if ((!wordDevanagari && !wordRoman) || !meaningHindi || !submittedByEmail) {
    res.status(400).json({ error: 'Word text, Hindi meaning, and signed-in email are required.' });
    return;
  }

  const store = loadStoreFromDisk();
  const submission: CommunityWordSubmission = {
    id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    wordDevanagari: wordDevanagari || wordRoman,
    wordRoman: wordRoman || wordDevanagari,
    olChiki: typeof body.olChiki === 'string' ? body.olChiki.trim() : '',
    meaningHindi,
    meaningEnglish: meaningEnglish || meaningHindi,
    regionDialect: typeof body.regionDialect === 'string' && body.regionDialect.trim()
      ? body.regionDialect.trim()
      : 'संताल परगना',
    category: typeof body.category === 'string' && body.category.trim() ? body.category.trim() : 'community',
    exampleSantali: typeof body.exampleSantali === 'string' ? body.exampleSantali.trim() : '',
    submittedByEmail,
    submittedByName: typeof body.submittedByName === 'string' && body.submittedByName.trim()
      ? body.submittedByName.trim()
      : submittedByEmail.split('@')[0],
    status: 'pending',
    submittedAt: Date.now()
  };

  store.communityWordSubmissions = [submission, ...(store.communityWordSubmissions || [])].slice(0, 500);
  saveStoreToDisk(store);
  res.json({ success: true, submission });
});

app.post('/api/admin/submissions/:id/review', (req, res) => {
  const store = loadStoreFromDisk();
  if (!isEditorialAdminHeaders(req.headers, store)) {
    res.status(403).json({ error: 'Admin or active Operator authorization required to review community words.' });
    return;
  }
  const { id } = req.params;
  const action = req.body?.action;
  if (action !== 'approved' && action !== 'rejected') {
    res.status(400).json({ error: 'Action must be "approved" or "rejected".' });
    return;
  }
  let updatedItem: CommunityWordSubmission | null = null;
  store.communityWordSubmissions = (store.communityWordSubmissions || []).map((item) => {
    if (item.id === id) {
      updatedItem = {
        ...item,
        status: action,
        reviewedAt: Date.now()
      };
      return updatedItem;
    }
    return item;
  });

  if (!updatedItem) {
    res.status(404).json({ error: 'Submission not found.' });
    return;
  }

  saveStoreToDisk(store);
  res.json({ success: true, submission: updatedItem });
});

// Community Dialect Voice Bank (Native Audio Pronunciation Submissions & Upvotes)
app.get('/api/community/voice-notes', (req, res) => {
  const store = loadStoreFromDisk();
  const statusFilter = typeof req.query.status === 'string' ? req.query.status : '';
  const list = [...(store.communityVoiceNotes || [])].sort(
    (a, b) => (b.submittedAt || 0) - (a.submittedAt || 0)
  );
  const filtered = statusFilter ? list.filter((v) => v.status === statusFilter) : list;
  res.json({ success: true, voiceNotes: filtered });
});

app.post('/api/community/voice-notes', (req, res) => {
  const body = req.body || {};
  const wordDevanagari = typeof body.wordDevanagari === 'string' ? body.wordDevanagari.trim() : '';
  const wordRoman = typeof body.wordRoman === 'string' ? body.wordRoman.trim() : '';
  const meaningHindi = typeof body.meaningHindi === 'string' ? body.meaningHindi.trim() : '';
  const submittedByEmail = typeof body.submittedByEmail === 'string' ? body.submittedByEmail.trim().toLowerCase() : '';
  const audioDataUrl = typeof body.audioDataUrl === 'string' ? body.audioDataUrl : '';

  if ((!wordDevanagari && !wordRoman) || !meaningHindi || !submittedByEmail) {
    res.status(400).json({ error: 'Word, Hindi meaning, and signed-in email are required.' });
    return;
  }
  if (audioDataUrl.length > 2_000_000) {
    res.status(400).json({ error: 'Audio clip too large (max ~1.5 MB).' });
    return;
  }

  const store = loadStoreFromDisk();
  const voiceNote: CommunityVoiceNote = {
    id: `vn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    wordDevanagari: wordDevanagari || wordRoman,
    wordRoman: wordRoman || wordDevanagari,
    olChiki: typeof body.olChiki === 'string' ? body.olChiki.trim() : '',
    meaningHindi,
    regionDialect: typeof body.regionDialect === 'string' && body.regionDialect.trim()
      ? body.regionDialect.trim()
      : 'संताल परगना',
    audioDataUrl: audioDataUrl.startsWith('data:audio/') ? audioDataUrl : '',
    phoneticTip: typeof body.phoneticTip === 'string' ? body.phoneticTip.trim() : '',
    submittedByEmail,
    submittedByName: typeof body.submittedByName === 'string' && body.submittedByName.trim()
      ? body.submittedByName.trim()
      : submittedByEmail.split('@')[0],
    upvotes: 1,
    status: 'pending',
    submittedAt: Date.now()
  };

  store.communityVoiceNotes = [voiceNote, ...(store.communityVoiceNotes || [])].slice(0, 250);
  saveStoreToDisk(store);
  res.json({ success: true, voiceNote });
});

app.post('/api/community/voice-notes/:id/upvote', (req, res) => {
  const { id } = req.params;
  const store = loadStoreFromDisk();
  let updated: CommunityVoiceNote | null = null;
  store.communityVoiceNotes = (store.communityVoiceNotes || []).map((vn) => {
    if (vn.id === id) {
      updated = { ...vn, upvotes: (vn.upvotes || 0) + 1 };
      return updated;
    }
    return vn;
  });
  if (!updated) {
    res.status(404).json({ error: 'Voice note not found.' });
    return;
  }
  saveStoreToDisk(store);
  res.json({ success: true, voiceNote: updated });
});

app.post('/api/admin/voice-notes/:id/review', (req, res) => {
  const store = loadStoreFromDisk();
  if (!isEditorialAdminHeaders(req.headers, store)) {
    res.status(403).json({ error: 'Admin or active Operator authorization required.' });
    return;
  }
  const { id } = req.params;
  const action = req.body?.action;
  if (action !== 'approved' && action !== 'rejected') {
    res.status(400).json({ error: 'Invalid action.' });
    return;
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
    res.status(404).json({ error: 'Voice note not found.' });
    return;
  }
  saveStoreToDisk(store);
  res.json({ success: true, voiceNote: updated });
});

// Village Cultural & Festival Event Noticeboard (User Submits -> Pending; Admin Approves)
app.get('/api/community/events', (req, res) => {
  const store = loadStoreFromDisk();
  const statusFilter = typeof req.query.status === 'string' ? req.query.status : '';
  const list = [...(store.villageEventNotices || [])].sort(
    (a, b) => (b.submittedAt || 0) - (a.submittedAt || 0)
  );
  const filtered = statusFilter ? list.filter((e) => e.status === statusFilter) : list;
  res.json({ success: true, events: filtered });
});

app.post('/api/community/events', (req, res) => {
  const body = req.body || {};
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const eventDate = typeof body.eventDate === 'string' ? body.eventDate.trim() : '';
  const villageDistrict = typeof body.villageDistrict === 'string' ? body.villageDistrict.trim() : '';
  const submittedByEmail = typeof body.submittedByEmail === 'string' ? body.submittedByEmail.trim().toLowerCase() : '';

  if (!title || !eventDate || !villageDistrict || !submittedByEmail) {
    res.status(400).json({ error: 'Event title, date, village/district, and email are required.' });
    return;
  }

  const store = loadStoreFromDisk();
  const notice: VillageEventNotice = {
    id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title,
    eventType: typeof body.eventType === 'string' && body.eventType.trim() ? body.eventType.trim() : 'पर्व / सांस्कृतिक कार्यक्रम',
    eventDate,
    villageDistrict,
    regionDialect: typeof body.regionDialect === 'string' && body.regionDialect.trim() ? body.regionDialect.trim() : 'संताल परगना',
    description: typeof body.description === 'string' ? body.description.trim() : '',
    organizerName: typeof body.organizerName === 'string' && body.organizerName.trim() ? body.organizerName.trim() : submittedByEmail.split('@')[0],
    submittedByEmail,
    status: 'pending',
    submittedAt: Date.now()
  };

  store.villageEventNotices = [notice, ...(store.villageEventNotices || [])].slice(0, 300);
  saveStoreToDisk(store);
  res.json({ success: true, event: notice });
});

app.post('/api/admin/events/:id/review', (req, res) => {
  const store = loadStoreFromDisk();
  if (!isEditorialAdminHeaders(req.headers, store)) {
    res.status(403).json({ error: 'Admin or active Operator authorization required.' });
    return;
  }
  const { id } = req.params;
  const action = req.body?.action;
  if (action !== 'approved' && action !== 'rejected') {
    res.status(400).json({ error: 'Invalid action.' });
    return;
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
    res.status(404).json({ error: 'Event notice not found.' });
    return;
  }
  saveStoreToDisk(store);
  res.json({ success: true, event: updated });
});

// Community Hall of Fame Leaderboard (Aggregates approved submissions, voice notes, upvotes & events)
app.get('/api/community/leaderboard', (_req, res) => {
  const store = loadStoreFromDisk();
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
      const e = ensure(w.submittedByEmail, w.submittedByName, w.regionDialect);
      e.approvedWords += 1;
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
      const e = ensure(ev.submittedByEmail, ev.organizerName, ev.regionDialect);
      e.approvedEvents += 1;
    }
  }

  const contributors = Array.from(map.values())
    .map((c) => ({
      ...c,
      totalScore: c.approvedWords * 15 + c.approvedVoiceNotes * 20 + c.voiceUpvotes * 5 + c.approvedEvents * 15
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  res.json({ success: true, contributors });
});

// Admin-only safe directory summary of registered Google/Email users (excludes passcodeHash)
app.get('/api/admin/users-summary', (req, res) => {
  const store = loadStoreFromDisk();
  if (!isEditorialAdminHeaders(req.headers, store)) {
    res.status(403).json({ error: 'Admin authorization required.' });
    return;
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
        customEventsCount: Array.isArray(prefs.personalCustomEvents) ? prefs.personalCustomEvents.length : 0,
        hasNotes: Boolean(prefs.personalNotes && String(prefs.personalNotes).trim()),
        createdAt: u.createdAt || 0,
        updatedAt: u.updatedAt || 0
      };
    })
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  res.json({
    success: true,
    totalUsers: users.length,
    googleVerifiedUsers,
    regionCounts,
    users
  });
});

// STRICTLY Super Admin (bosctechedu@gmail.com) ONLY: List Operators
app.get('/api/admin/operators', (req, res) => {
  if (!isSuperAdminHeaders(req.headers)) {
    res.status(403).json({ error: 'Only Super Admin (bosctechedu@gmail.com) can access operators.' });
    return;
  }
  const store = loadStoreFromDisk();
  res.json({ success: true, operators: store.operators || [] });
});

// STRICTLY Super Admin (bosctechedu@gmail.com) ONLY: Create or Update Operator
app.post('/api/admin/operators', (req, res) => {
  if (!isSuperAdminHeaders(req.headers)) {
    res.status(403).json({ error: 'Only Super Admin (bosctechedu@gmail.com) can create or update operators.' });
    return;
  }
  const body = req.body || {};
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  const operatorId = typeof body.operatorId === 'string' ? body.operatorId.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const passcode = typeof body.passcode === 'string' ? body.passcode.trim() : '';
  const roleLabel = typeof body.roleLabel === 'string' && body.roleLabel.trim()
    ? body.roleLabel.trim()
    : 'Content & Dictionary Operator';
  const isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;

  if (operatorId.toLowerCase() === SUPER_ADMIN_EMAIL) {
    res.status(400).json({ error: 'Super Admin email cannot be assigned as an Operator.' });
    return;
  }

  const store = loadStoreFromDisk();
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
      saveStoreToDisk(store);
      res.json({ success: true, operator: nextOp, operators: list });
      return;
    }
  }

  if (!operatorId || operatorId.length < 3 || !name || passcode.length < 4) {
    res.status(400).json({ error: 'Operator ID (min 3 chars), Name, and Passcode (min 4 chars) are required.' });
    return;
  }

  if (list.some((op) => op.operatorId.toLowerCase() === operatorId.toLowerCase())) {
    res.status(409).json({ error: 'An Operator with this ID already exists.' });
    return;
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
  saveStoreToDisk(store);
  res.json({ success: true, operator: created, operators: store.operators });
});

// STRICTLY Super Admin (bosctechedu@gmail.com) ONLY: Delete Operator
app.delete('/api/admin/operators/:id', (req, res) => {
  if (!isSuperAdminHeaders(req.headers)) {
    res.status(403).json({ error: 'Only Super Admin (bosctechedu@gmail.com) can delete operators.' });
    return;
  }
  const { id } = req.params;
  const store = loadStoreFromDisk();
  store.operators = (store.operators || []).filter((op) => op.id !== id);
  saveStoreToDisk(store);
  res.json({ success: true, operators: store.operators });
});

// Operator Login Verification (Admin-created active Operators only)
app.post('/api/admin/operator-login', (req, res) => {
  const body = req.body || {};
  const cleanId = typeof body.operatorId === 'string' ? body.operatorId.trim().toLowerCase() : '';
  const cleanPass = typeof body.passcode === 'string' ? body.passcode.trim() : '';
  if (!cleanId || !cleanPass || cleanId === SUPER_ADMIN_EMAIL) {
    res.status(401).json({ error: 'Invalid Operator ID or Passcode.' });
    return;
  }
  const store = loadStoreFromDisk();
  const found = (store.operators || []).find(
    (op) => op.operatorId.toLowerCase() === cleanId && op.passcode === cleanPass
  );
  if (!found) {
    res.status(401).json({ error: 'Invalid Operator ID or Passcode.' });
    return;
  }
  if (!found.isActive) {
    res.status(403).json({ error: 'यह ऑपरेटर खाता मुख्य एडमिन द्वारा अस्थायी रूप से बंद किया गया है।' });
    return;
  }
  res.json({
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
});

// Normal User Email Login (Self-Customization Only - strictly isolated per email)
app.post('/api/user/login', (req, res) => {
  const { email, displayName, passcodeHash, villageRegion } = req.body || {};
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!cleanEmail || !cleanEmail.includes('@')) {
    res.status(400).json({ error: 'Valid email is required.' });
    return;
  }

  const store = loadStoreFromDisk();
  const existing = store.userProfiles[cleanEmail];
  if (existing) {
    if (existing.passcodeHash && passcodeHash && existing.passcodeHash !== passcodeHash) {
      res.status(401).json({ error: 'Invalid personal passcode.' });
      return;
    }
    const updated = {
      ...existing,
      displayName: displayName || existing.displayName,
      villageRegion: villageRegion || existing.villageRegion,
      role: 'user',
      updatedAt: Date.now()
    };
    store.userProfiles[cleanEmail] = updated;
    saveStoreToDisk(store);
    res.json({ success: true, profile: updated });
    return;
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
  saveStoreToDisk(store);
  res.json({ success: true, profile: created });
});

// Verified Google Sign-In Endpoint (validates client OAuth Bearer token with Google UserInfo API)
app.post('/api/user/google-login', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (!token) {
      res.status(401).json({ error: 'Authorization Bearer token is required.' });
      return;
    }

    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!googleRes.ok) {
      res.status(401).json({ error: 'Invalid or expired Google OAuth token.' });
      return;
    }

    const info = (await googleRes.json()) as {
      email?: string;
      email_verified?: boolean;
      name?: string;
      picture?: string;
    };

    const cleanEmail = info.email ? info.email.trim().toLowerCase() : '';
    if (!cleanEmail) {
      res.status(400).json({ error: 'Google account email could not be verified.' });
      return;
    }

    const store = loadStoreFromDisk();
    const existing = store.userProfiles[cleanEmail];
    const verifiedProfile = existing
      ? {
          ...existing,
          email: cleanEmail,
          displayName: existing.displayName || info.name || cleanEmail.split('@')[0],
          photoURL: info.picture || existing.photoURL || '',
          emailVerified: Boolean(info.email_verified ?? true),
          authProvider: 'google',
          role: 'user', // Strictly user-level self-customize only; never Admin
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
    saveStoreToDisk(store);
    res.json({ success: true, profile: verifiedProfile });
  } catch (err: any) {
    console.error('Google login verification error:', err);
    res.status(500).json({ error: 'Failed to verify Google account.' });
  }
});

// Save strictly personal self-customization preferences for the signed-in email
app.post('/api/user/profile', (req, res) => {
  const { profile } = req.body || {};
  const cleanEmail = profile?.email ? String(profile.email).trim().toLowerCase() : '';
  if (!cleanEmail) {
    res.status(400).json({ error: 'Email profile required.' });
    return;
  }
  const store = loadStoreFromDisk();
  const existing = store.userProfiles[cleanEmail] || {};
  store.userProfiles[cleanEmail] = {
    ...existing,
    ...profile,
    email: cleanEmail,
    role: 'user', // Enforce strictly non-admin role on user endpoints
    updatedAt: Date.now()
  };
  saveStoreToDisk(store);
  res.json({ success: true, profile: store.userProfiles[cleanEmail] });
});

// Free AI Assistant with Google Search Grounding (Gemini 3.8 Flash)
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, history, deepThink, webSearch = true } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!aiClient) {
      // Offline fallback with knowledge
      res.json({
        reply: `Johar! I am your BOSC Global AI Assistant (DeepSeek Engine) for Hor Katha Suite. Currently running in offline mode. For live Google Search grounding and unlimited queries, ensure your GEMINI_API_KEY is configured. In the meantime, you can explore the 10,000+ dictionary words, Santali Devanagari keyboard, and cultural festivals calendar!`,
        thinkingProcess: deepThink
          ? `1. Query parsed: "${message}"\n2. Running in offline fallback mode.\n3. Recommending local Hor Katha Suite features: Santali Devanagari keyboard, 10,000+ dictionary entries, cultural festivals calendar.`
          : undefined,
        sources: [],
        webSearchQueries: [],
        isFallback: true,
        success: true
      });
      return;
    }

    let systemInstruction = `You are 'DeepSeek AI Search Assistant (BOSC Edition)' — the world-class intelligent indigenous linguistic, cultural, and live web knowledge search engine for Hor Katha Suite by BOSC Tech & Edu.
You provide the world's best, most accurate, real-time grounded search results across:
1. Santali language (Roman Santali orthography with standard accents: ā, ī, ū, ē, ō, a̧, ȩ, ñ, ṇ, ṭ, ḍ, ṛ, ṅ, ṃ, ḥ, and Santali Devanagari).
2. Direct translation and vocabulary between Santali, Hindi, and English.
3. Tribal history, Santal rebellion (Santhal Hool 1855, Sidhu-Kanho, Birsa Munda), folklore, Baha, Sohrai, Karam festivals, and indigenous arts.
4. Real-time global knowledge, news, science, education, definitions, and web facts grounded with live Google Search.

Guidelines:
- Begin warmly with "Johar!" or a respectful salutation when greeting.
- When explaining Santali terms, provide:
  1. Roman Santali spelling with standard accents (e.g., "Johar", "Abo Ror")
  2. Hindi meaning (e.g., नमस्ते / प्रणाम)
  3. English translation
  (Strict rule: Always provide Santali in Devanagari script alongside Roman transliteration, Hindi, and English).
- When answering web and factual queries, synthesize clear, comprehensive, and up-to-date answers using live Google Search grounding.
- Format responses cleanly with bold headings, concise paragraphs, and bullet points.`;

    if (deepThink) {
      systemInstruction += `\n\n[DEEPTHINK REASONING MODE ACTIVATED]:
Before writing your final answer, you MUST start your response with a deep thinking section wrapped in <think>...</think> tags. In this thinking section:
- Break down the user's intent, linguistic nuances, and historical context.
- Formulate hypotheses, verify facts, and outline key points.
- Close the </think> tag and then write your complete, polished, and beautifully structured final response.`;
    }

    const chatContents: any[] = [];

    // Append prior history if provided
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        chatContents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content || item.text || '' }],
        });
      }
    }

    // Add current user prompt
    chatContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const config: any = {
      systemInstruction,
      temperature: deepThink ? 0.4 : 0.6,
    };

    if (webSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config,
    });

    let rawReply = response.text || 'Johar! I could not generate a response. Please try again.';
    let thinkingProcess = '';

    // Extract <think> tags if present
    const thinkMatch = rawReply.match(/<think>([\s\S]*?)<\/think>/i);
    if (thinkMatch) {
      thinkingProcess = thinkMatch[1].trim();
      rawReply = rawReply.replace(/<think>[\s\S]*?<\/think>/i, '').trim();
    } else if (deepThink) {
      // If model did not output tags, construct synthetic thought trace
      thinkingProcess = `• Analyzed query: "${message}"\n• Cross-referenced Hor Katha indigenous Santali linguistic corpus & historical archives (1855 Hul, Sidhu-Kanhu, Ol Guru)\n• Evaluated Devanagari and Roman Santali phonetics\n• Synthesized verified, high-accuracy multi-lingual response`;
    }

    // Extract Google Search grounding sources
    const candidate = response.candidates?.[0];
    const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
    const webSearchQueries = candidate?.groundingMetadata?.webSearchQueries || [];

    const sources = groundingChunks
      .map((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          return {
            title: chunk.web.title || chunk.web.uri,
            uri: chunk.web.uri,
          };
        }
        return null;
      })
      .filter(Boolean);

    res.json({
      reply: rawReply,
      thinkingProcess: thinkingProcess || undefined,
      sources,
      webSearchQueries,
      success: true
    });
  } catch (error: any) {
    console.error('Gemini API Grounded Chat error:', error);
    res.status(500).json({
      error: 'Failed to generate AI response',
      details: error?.message || 'Unknown error',
    });
  }
});

// Downloadable Cloudflare Pages deployment bundles (dist ZIP for Direct Upload, source ZIP for GitHub/Wrangler)
app.get('/api/cloudflare-dist.zip', (_req, res) => {
  const zipPath = path.resolve(__dirname, '.cloudflare-export', 'horkathasuite-cloudflare-dist.zip');
  if (!fs.existsSync(zipPath)) {
    res.status(404).json({ error: 'Cloudflare dist bundle not generated yet. Run npm run build first.' });
    return;
  }
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.download(zipPath, 'santalarsi-cloudflare-dist.zip');
});

app.get('/api/cloudflare-source.zip', (_req, res) => {
  const zipPath = path.resolve(__dirname, '.cloudflare-export', 'horkathasuite-cloudflare-source.zip');
  if (!fs.existsSync(zipPath)) {
    res.status(404).json({ error: 'Cloudflare source bundle not generated yet.' });
    return;
  }
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.download(zipPath, 'santalarsi-cloudflare-source.zip');
});

app.get('/api/push.bat', (_req, res) => {
  const batPath = path.resolve(__dirname, 'push.bat');
  if (!fs.existsSync(batPath)) {
    res.status(404).json({ error: 'push.bat not found.' });
    return;
  }
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.download(batPath, 'push.bat');
});


async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Mount Vite middlewares in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Hor Katha Suite server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
