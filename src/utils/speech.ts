/**
 * Robust Multi-Voice Synthesis & 3-Language Audio Engine for Santal आ़रसी.
 * Features:
 * - True 3-Language Support: Hindi (Devanagari), English, and Santali Roman (plus Ol Chiki)
 * - Phonetic Santali Roman -> Devanagari acoustic bridge for authentic Santali-Indian pronunciation
 * - Top 10 Curated Voice Models (5 Female + 5 Male) persisted in localStorage
 * - Automatic sentence/clause chunking so long paragraphs read 100% completely
 * - Chromium 15s-pause watchdog & cancel-to-speak stabilization delay
 * - Live speech state broadcaster with active language indicator
 */

export type VoiceGender = 'female' | 'male';
export type ReadingLanguageMode = 'all' | 'hindi' | 'english' | 'santali_roman';
export type DetectedChunkLang = 'hindi' | 'english' | 'santali_roman';

export interface VoiceModelProfile {
  id: string;
  name: string;
  labelHi: string;
  gender: VoiceGender;
  role: string;
  pitch: number;
  rate: number;
  voiceKeywords: string[];
}

export const TOP_10_VOICE_MODELS: VoiceModelProfile[] = [
  // 5 Female Voice Models (Natural studio pitch — never shrill or distorted)
  {
    id: 'swara_female',
    name: 'Swara (Pure Trilingual Female — Best)',
    labelHi: '१. स्वरा (सर्वश्रेष्ठ शुद्ध त्रि-भाषी महिला स्वर — HI+EN+Santali)',
    gender: 'female',
    role: 'हिन्दी, अंग्रेज़ी और संताली तीनों का शुद्ध प्राकृतिक महिला वाचन',
    pitch: 1.0,
    rate: 0.92,
    voiceKeywords: ['swara online', 'swara', 'google हिन्दी', 'hi-in-x-hia', 'hi-in-x-hic', 'neerja online', 'lekha', 'heera', 'kalpana', 'zira']
  },
  {
    id: 'aditi_teacher',
    name: 'Aditi (Clear Tutor Female)',
    labelHi: '२. अदिति (स्पष्ट शिक्षिका महिला स्वर)',
    gender: 'female',
    role: 'धीमा व शब्द-दर-शब्द शुद्ध व्याकरण शिक्षण',
    pitch: 1.0,
    rate: 0.82,
    voiceKeywords: ['swara online', 'google हिन्दी', 'aditi', 'lekha', 'veena', 'isha', 'neerja online', 'heera', 'kalpana']
  },
  {
    id: 'kavya_storyteller',
    name: 'Kavya (Folk Storyteller Female)',
    labelHi: '३. काव्या (सौम्य लोककथा वाचिका)',
    gender: 'female',
    role: 'कहानी, निबंध व सेरेञ भाव-वाचन',
    pitch: 1.04,
    rate: 0.87,
    voiceKeywords: ['swara online', 'kavya', 'google हिन्दी', 'shruti', 'neerja online', 'samantha', 'victoria', 'heera']
  },
  {
    id: 'neerja_anchor',
    name: 'Neerja (News Anchor Female)',
    labelHi: '४. नीरजा (समाचार वाचक महिला स्वर)',
    gender: 'female',
    role: 'स्पष्ट व त्वरित अंग्रेज़ी-हिन्दी बुलेटिन वाचन',
    pitch: 0.99,
    rate: 0.96,
    voiceKeywords: ['neerja online', 'neerja', 'aria online', 'swara online', 'google uk english female', 'google हिन्दी', 'zira', 'heera']
  },
  {
    id: 'fulo_youth',
    name: 'Fulo (Bright Youth Female)',
    labelHi: '५. फूलो (जीवंत संवाद महिला स्वर)',
    gender: 'female',
    role: 'संवादात्मक व सुस्पष्ट आधुनिक स्वर',
    pitch: 1.06,
    rate: 0.94,
    voiceKeywords: ['aria online', 'jenny online', 'swara online', 'google हिन्दी', 'samantha', 'zira', 'heera']
  },

  // 5 Male Voice Models
  {
    id: 'madhur_male',
    name: 'Madhur (Natural Male)',
    labelHi: '६. मधुर (संतुलित पुरुष स्वर)',
    gender: 'male',
    role: 'प्रामाणिक व सौम्य पुरुष आवाज़',
    pitch: 0.86,
    rate: 0.90,
    voiceKeywords: ['madhur', 'hemant', 'prabhat', 'ravi', 'male', 'david']
  },
  {
    id: 'sidhu_anchor',
    name: 'Sidhu (Deep Baritone Male)',
    labelHi: '७. सिद्धू (गंभीर समाचार व मंच स्वर)',
    gender: 'male',
    role: 'मंच, हूल कथा व घोषणा वाचन',
    pitch: 0.74,
    rate: 0.88,
    voiceKeywords: ['ravi', 'george', 'daniel', 'mark', 'male']
  },
  {
    id: 'prabhat_teacher',
    name: 'Prabhat (Guruji Tutor Male)',
    labelHi: '८. प्रभात (गुरुजी स्पष्ट वाचन)',
    gender: 'male',
    role: 'परीक्षा व व्याकरण अभ्यास',
    pitch: 0.82,
    rate: 0.78,
    voiceKeywords: ['prabhat', 'hemant', 'rishabh', 'male', 'david']
  },
  {
    id: 'marang_elder',
    name: 'Marang Haram (Elder Storyteller)',
    labelHi: '९. मरांग हाड़ाम (बुज़ुर्ग लोक-वाचक)',
    gender: 'male',
    role: 'गाथा, बोंगा-बुरु व नीति कथा',
    pitch: 0.68,
    rate: 0.82,
    voiceKeywords: ['daniel', 'ravi', 'george', 'male']
  },
  {
    id: 'kisku_youth',
    name: 'Kisku (Energetic Youth Male)',
    labelHi: '१०. किस्कू (तेज़ व ऊर्जावान पुरुष स्वर)',
    gender: 'male',
    role: 'क्विज़, खेल व त्वरित संवाद',
    pitch: 0.94,
    rate: 0.98,
    voiceKeywords: ['alex', 'mark', 'guy', 'madhur', 'male']
  }
];

const VOICE_PROFILE_STORAGE_KEY = 'hor_katha_voice_profile';
const CUSTOM_SYSTEM_VOICE_STORAGE_KEY = 'hor_katha_system_voice_name';
const CUSTOM_HINDI_VOICE_STORAGE_KEY = 'hor_katha_hindi_santali_voice_name';
const CUSTOM_ENGLISH_VOICE_STORAGE_KEY = 'hor_katha_english_voice_name';
const READING_LANG_MODE_STORAGE_KEY = 'hor_katha_reading_lang_mode';
const USER_SPEECH_RATE_STORAGE_KEY = 'hor_katha_speech_rate';
const USER_SPEECH_PITCH_STORAGE_KEY = 'hor_katha_speech_pitch';

export function getReadingLanguageMode(): ReadingLanguageMode {
  if (typeof window === 'undefined') return 'all';
  try {
    const saved = localStorage.getItem(READING_LANG_MODE_STORAGE_KEY) as ReadingLanguageMode | null;
    if (saved === 'all' || saved === 'hindi' || saved === 'english' || saved === 'santali_roman') {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'all';
}

export function setReadingLanguageMode(mode: ReadingLanguageMode) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(READING_LANG_MODE_STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent('hor-katha-reading-lang-changed', { detail: mode }));
  } catch {
    // ignore
  }
}

export function getActiveVoiceProfile(): VoiceModelProfile {
  if (typeof window === 'undefined') return TOP_10_VOICE_MODELS[0];
  try {
    const savedId = localStorage.getItem(VOICE_PROFILE_STORAGE_KEY);
    const found = TOP_10_VOICE_MODELS.find((v) => v.id === savedId);
    return found || TOP_10_VOICE_MODELS[0];
  } catch {
    return TOP_10_VOICE_MODELS[0];
  }
}

export function setActiveVoiceProfile(profileId: string) {
  if (typeof window === 'undefined') return;
  try {
    unreliableVoiceNames.clear();
    localStorage.setItem(VOICE_PROFILE_STORAGE_KEY, profileId);
    const chosen = TOP_10_VOICE_MODELS.find((v) => v.id === profileId);
    if (chosen) {
      localStorage.setItem(USER_SPEECH_RATE_STORAGE_KEY, String(chosen.rate));
      localStorage.setItem(USER_SPEECH_PITCH_STORAGE_KEY, String(chosen.pitch));
    }
    window.dispatchEvent(new CustomEvent('hor-katha-voice-changed', { detail: profileId }));
  } catch {
    // ignore
  }
}

export function getUserSpeechRate(): number {
  const fallback = getActiveVoiceProfile().rate;
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(USER_SPEECH_RATE_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 0.55 || parsed > 1.6) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export function setUserSpeechRate(rate: number) {
  if (typeof window === 'undefined') return;
  const clamped = Math.max(0.6, Math.min(1.5, Number(rate.toFixed(2))));
  try {
    localStorage.setItem(USER_SPEECH_RATE_STORAGE_KEY, String(clamped));
    window.dispatchEvent(new CustomEvent('hor-katha-voice-changed', { detail: { rate: clamped } }));
  } catch {
    // ignore
  }
}

export function getUserSpeechPitch(): number {
  const fallback = getActiveVoiceProfile().pitch;
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(USER_SPEECH_PITCH_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 0.6 || parsed > 1.5) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export function setUserSpeechPitch(pitch: number) {
  if (typeof window === 'undefined') return;
  const clamped = Math.max(0.65, Math.min(1.4, Number(pitch.toFixed(2))));
  try {
    localStorage.setItem(USER_SPEECH_PITCH_STORAGE_KEY, String(clamped));
    window.dispatchEvent(new CustomEvent('hor-katha-voice-changed', { detail: { pitch: clamped } }));
  } catch {
    // ignore
  }
}

export function getPreferredSystemVoiceName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(CUSTOM_SYSTEM_VOICE_STORAGE_KEY) || '';
}

export function setPreferredSystemVoiceName(name: string) {
  if (typeof window === 'undefined') return;
  unreliableVoiceNames.clear();
  if (!name) localStorage.removeItem(CUSTOM_SYSTEM_VOICE_STORAGE_KEY);
  else localStorage.setItem(CUSTOM_SYSTEM_VOICE_STORAGE_KEY, name);
  window.dispatchEvent(new CustomEvent('hor-katha-voice-changed', { detail: name }));
}

export function getPreferredHindiSantaliVoiceName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(CUSTOM_HINDI_VOICE_STORAGE_KEY) || '';
}

export function setPreferredHindiSantaliVoiceName(name: string) {
  if (typeof window === 'undefined') return;
  unreliableVoiceNames.clear();
  if (!name) localStorage.removeItem(CUSTOM_HINDI_VOICE_STORAGE_KEY);
  else localStorage.setItem(CUSTOM_HINDI_VOICE_STORAGE_KEY, name);
  window.dispatchEvent(new CustomEvent('hor-katha-voice-changed', { detail: name }));
}

export function getPreferredEnglishVoiceName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(CUSTOM_ENGLISH_VOICE_STORAGE_KEY) || '';
}

export function setPreferredEnglishVoiceName(name: string) {
  if (typeof window === 'undefined') return;
  unreliableVoiceNames.clear();
  if (!name) localStorage.removeItem(CUSTOM_ENGLISH_VOICE_STORAGE_KEY);
  else localStorage.setItem(CUSTOM_ENGLISH_VOICE_STORAGE_KEY, name);
  window.dispatchEvent(new CustomEvent('hor-katha-voice-changed', { detail: name }));
}

export function getAvailableSystemVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const list = window.speechSynthesis.getVoices();
  if (list && list.length > 0) cachedVoices = list;
  return cachedVoices;
}

export interface SpeechStateSnapshot {
  isSpeaking: boolean;
  isPaused: boolean;
  fullText: string;
  currentChunkText: string;
  chunkIndex: number;
  totalChunks: number;
  activeVoiceName?: string;
  activeSystemVoiceName?: string;
  activeChunkLang?: DetectedChunkLang;
  errorMessage?: string | null;
}

type SpeechStateListener = (state: SpeechStateSnapshot) => void;

let currentSpeechState: SpeechStateSnapshot = {
  isSpeaking: false,
  isPaused: false,
  fullText: '',
  currentChunkText: '',
  chunkIndex: 0,
  totalChunks: 0,
  activeVoiceName: TOP_10_VOICE_MODELS[0].labelHi,
  activeSystemVoiceName: '',
  activeChunkLang: 'hindi',
  errorMessage: null
};

const speechListeners = new Set<SpeechStateListener>();

function emitSpeechState(next: Partial<SpeechStateSnapshot>) {
  currentSpeechState = { ...currentSpeechState, ...next };
  speechListeners.forEach((fn) => {
    try {
      fn(currentSpeechState);
    } catch {
      // Ignore listener errors
    }
  });
}

export function getSpeechState(): SpeechStateSnapshot {
  return currentSpeechState;
}

export function subscribeSpeechState(listener: SpeechStateListener): () => void {
  speechListeners.add(listener);
  listener(currentSpeechState);
  return () => {
    speechListeners.delete(listener);
  };
}

// Syllabic Ol Chiki (᱐-᱿) -> Devanagari transliterator so Ol Chiki reads as smooth natural words (not letter-by-letter!)
const OL_CHIKI_VOWELS: Record<string, [string, string]> = {
  'ᱚ': ['अ', ''],
  'ᱟ': ['आ', 'ा'],
  'ᱤ': ['इ', 'ि'],
  'ᱩ': ['उ', 'ु'],
  'ᱮ': ['ए', 'े'],
  'ᱳ': ['ओ', 'ो']
};

const OL_CHIKI_CONSONANTS: Record<string, string> = {
  'ᱛ': 'त', 'ᱜ': 'ग', 'ᱝ': 'ंग', 'ᱞ': 'ल',
  'ᱠ': 'क', 'ᱡ': 'ज', 'ᱢ': 'म', 'ᱣ': 'व',
  'ᱥ': 'स', 'ᱦ': 'ह', 'ᱧ': 'ंय', 'ᱨ': 'र',
  'ᱪ': 'च', 'ᱫ': 'द', 'ᱬ': 'ण', 'ᱭ': 'य',
  'ᱯ': 'प', 'ᱰ': 'ड', 'ᱱ': 'न', 'ᱲ': 'ड़',
  'ᱴ': 'ट', 'ᱵ': 'ब', 'ᱶ': 'ँ', 'ᱷ': 'ह'
};

const OL_CHIKI_DIGITS_AND_MARKS: Record<string, string> = {
  '᱐': '0', '᱑': '1', '᱒': '2', '᱓': '3', '᱔': '4',
  '᱕': '5', '᱖': '6', '᱗': '7', '᱘': '8', '᱙': '9',
  'ᱸ': 'ं', 'ᱹ': '', 'ᱺ': 'ं', 'ᱻ': '', 'ᱼ': '', 'ᱽ': '्', '᱾': '।', '᱿': '।'
};

export function transliterateOlChikiIfPresent(input: string): string {
  if (!/[\u1C50-\u1C7F]/.test(input)) return input;
  const chars = Array.from(input);
  let out = '';
  let prevWasConsonant = false;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (OL_CHIKI_VOWELS[ch]) {
      const [indep, matra] = OL_CHIKI_VOWELS[ch];
      out += prevWasConsonant ? matra : indep;
      prevWasConsonant = false;
      continue;
    }
    if (OL_CHIKI_CONSONANTS[ch]) {
      out += OL_CHIKI_CONSONANTS[ch];
      prevWasConsonant = ch !== 'ᱝ' && ch !== 'ᱧ' && ch !== 'ᱶ';
      continue;
    }
    if (OL_CHIKI_DIGITS_AND_MARKS[ch] !== undefined) {
      out += OL_CHIKI_DIGITS_AND_MARKS[ch];
      if (ch === '᱾' || ch === '᱿' || ch === 'ᱽ') prevWasConsonant = false;
      continue;
    }
    out += ch;
    prevWasConsonant = false;
  }
  return out;
}

// High-frequency Santali Roman lexicon & phonetic pronunciations
const SANTALI_ROMAN_LEXICON_PHONETIC: Record<string, string> = {
  johar: 'जोहार',
  hor: 'होड़',
  katha: 'काथा',
  ror: 'रोड़',
  uprum: 'उपरुम',
  gorob: 'गोरोब',
  abo: 'आबो',
  abua: 'अबुआ',
  ale: 'आले',
  alang: 'आलांग',
  alin: 'आलिञ',
  ape: 'आपे',
  ako: 'आको',
  kana: 'काना',
  kanabo: 'कानाबो',
  kanan: 'कानाञ',
  orak: 'ओड़ाक',
  "orak'": 'ओड़ाक्',
  dak: 'दाक',
  "dak'": 'दाक्',
  daka: 'दका',
  dakan: 'दकाञ',
  jom: 'जोम',
  nui: 'नुई',
  hoyo: 'होयो',
  menak: 'मेनाक्',
  "menak'": 'मेनाक्',
  banuk: 'बानुक्',
  "banuk'": 'बानुक्',
  disom: 'दिशोम',
  ato: 'आतो',
  bonga: 'बोंगा',
  marang: 'मरांग',
  maran: 'मरान',
  buru: 'बुरु',
  jaher: 'जाहेर',
  than: 'थान',
  manjhi: 'मांझी',
  majhi: 'मांझी',
  naike: 'नायके',
  godet: 'गोडेट',
  paranik: 'पारानिक',
  pargana: 'परगना',
  parganait: 'परगनैत',
  binti: 'बिन्ती',
  sohrai: 'सोहराय',
  baha: 'बाहा',
  porob: 'पोरोब',
  parab: 'परब',
  karam: 'करम',
  sakrat: 'साकरात',
  sendra: 'सेंदरा',
  baisi: 'बैसी',
  chhatiar: 'छठियार',
  chacho: 'चाचो',
  janam: 'जनम',
  bitlaha: 'बिटलाहा',
  hul: 'हूल',
  kherwal: 'खेरवाड़',
  bir: 'बीर',
  pilchu: 'पिलचु',
  haram: 'हाड़ाम',
  budhi: 'बूढ़ी',
  ol: 'ओल',
  chiki: 'चिकी',
  sereng: 'सेरेञ',
  seren: 'सेरेञ',
  tumdak: 'तुम्दाक्',
  "tumdak'": 'तुम्दाक्',
  tamak: 'तामाक',
  banam: 'बानाम',
  dhodro: 'धोदरो',
  tirio: 'तिरिओ',
  bapla: 'बापला',
  hopon: 'होपोन',
  hoponera: 'होपोनेरा',
  ayo: 'आयो',
  baba: 'बाबा',
  dada: 'दादा',
  didi: 'दीदी',
  chando: 'चांदो',
  dharti: 'धरती',
  setak: 'सेताक्',
  tikin: 'तिकिन',
  ayub: 'आयुब',
  ninda: 'निंदा',
  mit: 'मित्',
  "mit'": 'मित्',
  bar: 'बार',
  pe: 'पे',
  pon: 'पोन',
  more: 'मोड़े',
  turui: 'तुरुय',
  eyae: 'एयाय',
  iral: 'इराल',
  are: 'आरे',
  gel: 'गेल',
  isi: 'इसी',
  sidu: 'सिदो',
  sido: 'सिदो',
  kanhu: 'कान्हू',
  tilka: 'तिलका',
  bhogna: 'भोगना',
  damin: 'दामिन',
  soren: 'सोरेन',
  murmu: 'मुर्मू',
  hansda: 'हांसदा',
  tudu: 'टुडू',
  marandi: 'मरांडी',
  kisku: 'किस्कू',
  hembrom: 'हेम्ब्रम',
  baske: 'बास्के',
  besra: 'बेसरा',
  pauria: 'पाउँरिया',
  chore: 'चोंड़े',
  bedeya: 'बेदेया',
  khuntau: 'खूंटाव',
  kuli: 'कुलही',
  daru: 'दारू',
  sengel: 'सेंगेल',
  aher: 'आहर',
  pyne: 'पइन',
  donga: 'डोंगा',
  dhorom: 'धोरम',
  puthi: 'पुथी',
  sari: 'सारी',
  bhabna: 'भाबना',
  cet: 'चेत्',
  "cet'": 'चेत्',
  oka: 'ओका',
  okoy: 'ओकोय',
  tinak: 'तिनाक्',
  lagit: 'लागित्',
  khon: 'खोन',
  then: 'ठेन',
  sao: 'साँव',
  delabon: 'देलाबोन',
  bidu: 'बिदु',
  chandan: 'चांदान',
  kherwar: 'खेरवाड़',
  erok: 'एरोक',
  sim: 'सिम',
  janom: 'जनम',
  bhandan: 'भांडान',
  lugu: 'लुगु',
  ghantabari: 'घंटाबाड़ी',
  dhoromgarh: 'धोरोमगढ़',
  ene: 'एनेच्',
  "enec'": 'एनेच्',
  santal: 'संताल',
  santali: 'संताली',
  santhal: 'संथाल',
  sagai: 'सगाई',
  gapa: 'गपा',
  tehen: 'तेहेंञ',
  hola: 'होला',
  seta: 'सेता',
  pusi: 'पुसी',
  dangra: 'डांगरा',
  merom: 'मेरोम',
  hako: 'हाको',
  dare: 'दाड़े',
  da: 'दाः',
  jondra: 'जोंडरा',
  huru: 'हूड़ू',
  caole: 'चावले',
  chawle: 'चावले',
  parsi: 'पारसी',
  ronor: 'रोनौड़',
  onol: 'ओनोल',
  kudum: 'कुदुम',
  nutum: 'ञुतुम',
  janang: 'जानांग',
  gotang: 'गोटांग',
  okte: 'ओकते',
  menkhan: 'मेनखान',
  chedaq: 'चेदाक',
  onate: 'ओनाते',
  napay: 'नापाय',
  sibil: 'सिबिल',
  hudin: 'हुडिंय',
  gidra: 'गिदरा',
  gidrako: 'गिदराको',
  iskul: 'इस्कूल',
  parhaw: 'पढ़ाव',
  chalaq: 'चलाक',
  hijuq: 'हिजुक',
  sena: 'सेना',
  menaq: 'मेनाक',
  banuq: 'बानुक',
  ere: 'एड़े',
  nawa: 'नावा',
  mare: 'मारे',
  lolo: 'लोलो',
  reyar: 'रेयाड़',
  sangin: 'सांगिंय',
  nonde: 'नोंडे',
  honde: 'होंडे',
  dinom: 'दिनोम',
  nitoq: 'नितोक',
  keda: 'केदा',
  ena: 'एना',
  kanay: 'कानाय',
  kanakin: 'कानाकिन',
  kanako: 'कानाको',
  abon: 'आबोन',
  aben: 'आबेन',
  unkin: 'उनकिन',
  unku: 'उनकु',
  uni: 'उनी',
  nowa: 'नोवा',
  ona: 'ओना',
  sarjom: 'सारजोम',
  matkom: 'मातकोम',
  sechet: 'सेचेत',
  dular: 'दुलाड़',
  raska: 'रास्का',
  arsi: 'आरसी',
  horko: 'होड़को',
  horkin: 'होड़किन',
  daka_utu: 'दाका उतु',
  chithi: 'चिठी',
  nehor: 'नेहोर',
  mahit: 'माहित',
  sakam: 'साकाम',
  singi: 'सिंगि',
  ipil: 'इपिल',
  gada: 'गाडा',
  bajar: 'बाजार'
};

const SANTALI_ROMAN_WORD_SET = new Set(Object.keys(SANTALI_ROMAN_LEXICON_PHONETIC));

/**
 * Checks whether a Latin-script chunk is Santali Roman rather than standard English.
 */
export function isRomanSantaliChunk(chunk: string): boolean {
  const trimmed = chunk.trim();
  if (!trimmed) return false;

  // 1. Santali-specific Roman diacritics or checked-consonant apostrophes (e.g. orak', dak', et'-a, ạ, ọ, ñ, ṅ, ḍ, ṭ, ṛ)
  if (/[ạọẹịụñṅḍṭṛáéíóú]/i.test(trimmed)) return true;
  if (/\b[a-z]+[kctp]['’](?:\s|$|-|[.,?!])/i.test(trimmed)) return true;
  if (/\b[a-z]+-(?:a|re|te|ko|kin|et|ak)\b/i.test(trimmed)) return true;

  // 2. Token-level lexicon & Santali suffix check
  const words = trimmed
    .toLowerCase()
    .replace(/[^a-z'\-\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return false;

  let santaliHits = 0;
  for (const w of words) {
    const bare = w.replace(/^'+|'+$/g, '');
    if (SANTALI_ROMAN_WORD_SET.has(w) || SANTALI_ROMAN_WORD_SET.has(bare)) {
      santaliHits++;
    }
  }

  // Single Santali Roman word (e.g., Dictionary entry "Orak'", "Johar", "Bapla")
  if (words.length <= 2 && santaliHits >= 1) return true;
  // Multi-word sentence with strong Santali presence
  if (santaliHits >= 2 || santaliHits / words.length >= 0.34) return true;

  return false;
}

/**
 * Transliterates a single Roman Santali word into phonetic Devanagari for crisp Indian TTS playback.
 */
function transliterateSantaliRomanWordToDevanagari(rawWord: string): string {
  const lower = rawWord.toLowerCase();
  if (SANTALI_ROMAN_LEXICON_PHONETIC[lower]) {
    return SANTALI_ROMAN_LEXICON_PHONETIC[lower];
  }
  const strippedPunct = lower.replace(/[.,!?;:()"]/g, '');
  if (SANTALI_ROMAN_LEXICON_PHONETIC[strippedPunct]) {
    return SANTALI_ROMAN_LEXICON_PHONETIC[strippedPunct];
  }

  // Normalize Santali Roman diacritics
  let s = lower
    .replace(/ạ/g, 'a')
    .replace(/ọ/g, 'o')
    .replace(/ẹ/g, 'e')
    .replace(/ị/g, 'i')
    .replace(/ụ/g, 'u')
    .replace(/ñ/g, 'ny')
    .replace(/ṅ/g, 'ng')
    .replace(/ḍ/g, 'd')
    .replace(/ṭ/g, 't')
    .replace(/ṛ/g, 'r');

  // If word doesn't look alphabetic, return as-is
  if (!/[a-z]/.test(s)) return rawWord;

  const CONSONANTS: Array<[string, string]> = [
    ['chh', 'छ'],
    ['ch', 'च'],
    ['sh', 'श'],
    ['kh', 'ख'],
    ['gh', 'घ'],
    ['th', 'थ'],
    ['dh', 'ध'],
    ['ph', 'फ'],
    ['bh', 'भ'],
    ['jh', 'झ'],
    ['ng', 'ंग'],
    ['ny', 'ञ'],
    ['k', 'क'],
    ['g', 'ग'],
    ['c', 'च'],
    ['j', 'ज'],
    ['t', 'त'],
    ['d', 'द'],
    ['n', 'न'],
    ['p', 'प'],
    ['b', 'ब'],
    ['m', 'म'],
    ['y', 'य'],
    ['r', 'र'],
    ['l', 'ल'],
    ['w', 'व'],
    ['v', 'व'],
    ['s', 'स'],
    ['h', 'ह'],
    ['f', 'फ'],
    ['z', 'ज़'],
    ['q', 'क'],
    ['x', 'क्स']
  ];

  const VOWELS: Array<[string, string, string]> = [
    ['aa', 'आ', 'ा'],
    ['ee', 'ई', 'ी'],
    ['ii', 'ई', 'ी'],
    ['oo', 'ऊ', 'ू'],
    ['uu', 'ऊ', 'ू'],
    ['ai', 'ऐ', 'ै'],
    ['au', 'औ', 'ौ'],
    ['a', 'अ', ''],
    ['e', 'ए', 'े'],
    ['i', 'इ', 'ि'],
    ['o', 'ओ', 'ो'],
    ['u', 'उ', 'ु']
  ];

  let out = '';
  let i = 0;
  let prevWasConsonant = false;

  while (i < s.length) {
    const ch = s[i];
    if (ch === "'" || ch === '’') {
      if (prevWasConsonant) out += '्';
      prevWasConsonant = false;
      i++;
      continue;
    }

    // Try vowel match
    let matchedVowel = false;
    for (const [rom, indep, matra] of VOWELS) {
      if (s.startsWith(rom, i)) {
        if (prevWasConsonant) {
          out += matra;
        } else {
          out += indep;
        }
        prevWasConsonant = false;
        i += rom.length;
        matchedVowel = true;
        break;
      }
    }
    if (matchedVowel) continue;

    // Try consonant match
    let matchedCons = false;
    for (const [rom, dev] of CONSONANTS) {
      if (s.startsWith(rom, i)) {
        if (prevWasConsonant && rom !== 'ng') {
          out += '्' + dev;
        } else {
          out += dev;
        }
        prevWasConsonant = rom !== 'ng';
        i += rom.length;
        matchedCons = true;
        break;
      }
    }
    if (matchedCons) continue;

    out += ch;
    prevWasConsonant = false;
    i++;
  }

  return out;
}

/**
 * Converts a Santali Roman sentence/phrase to smooth phonetic Devanagari for TTS synthesis,
 * keeping non-word punctuation intact.
 */
export function transliterateRomanSantaliToPhoneticDevanagari(text: string): string {
  return text.replace(/[A-Za-zạọẹịụñṅḍṭṛáéíóú'’]+/g, (token) =>
    transliterateSantaliRomanWordToDevanagari(token)
  );
}

const DEVANAGARI_CONSONANTS: Record<string, string> = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
  'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
  'ड़': 'r', 'ढ़': 'rh', 'क़': 'q', 'ख़': 'kh', 'ग़': 'gh', 'ज़': 'z', 'फ़': 'f', 'य़': 'y'
};

const DEVANAGARI_INDEP_VOWELS: Record<string, string> = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
  'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ऑ': 'o', 'ऍ': 'e'
};

const DEVANAGARI_MATRAS: Record<string, string> = {
  'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
  'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ॉ': 'o', 'ॅ': 'e'
};

const DEVANAGARI_DIGITS: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
};

/**
 * Converts Devanagari words into pronounceable Roman phonetic text so English-only OS voices
 * (when a user's browser/OS has no hi-IN speech pack) still speak Hindi & Santali aloud instead of staying silent.
 */
export function transliterateDevanagariToPhoneticRoman(input: string): string {
  if (!/[\u0900-\u097F]/.test(input)) return input;
  const normalized = input.replace(/[।॥]/g, '. ');
  return normalized.replace(/[\u0900-\u097F]+/g, (word) => {
    const chars = Array.from(word);
    let out = '';
    let consCount = 0;

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      if (DEVANAGARI_DIGITS[ch] !== undefined) {
        out += DEVANAGARI_DIGITS[ch];
        continue;
      }
      if (DEVANAGARI_INDEP_VOWELS[ch] !== undefined) {
        out += DEVANAGARI_INDEP_VOWELS[ch];
        continue;
      }
      if (ch === 'ं' || ch === 'ँ') {
        out += 'n';
        continue;
      }
      if (ch === 'ः') {
        out += 'h';
        continue;
      }
      if (ch === '़' || ch === '्') {
        continue;
      }

      // Check nukta digraphs (e.g. ज + ़)
      const next = chars[i + 1];
      const pair = next === '़' ? ch + next : ch;
      const consVal = DEVANAGARI_CONSONANTS[pair] ?? DEVANAGARI_CONSONANTS[ch];
      if (consVal !== undefined) {
        if (pair.length === 2) i++;
        consCount++;
        out += consVal;
        const after = chars[i + 1];
        if (after === '्') {
          i++; // Virama suppresses inherent 'a'
        } else if (after && DEVANAGARI_MATRAS[after] !== undefined) {
          out += DEVANAGARI_MATRAS[after];
          i++;
        } else if (after && after !== 'ं' && after !== 'ँ' && after !== 'ः') {
          out += 'a';
        } else if (!after && consCount === 1) {
          out += 'a';
        } else if (after === 'ं' || after === 'ँ' || after === 'ः') {
          out += 'a';
        }
        continue;
      }
      if (DEVANAGARI_MATRAS[ch] !== undefined) {
        out += DEVANAGARI_MATRAS[ch];
      }
    }
    return out;
  });
}

/**
 * Normalizes Santali Devanagari special orthography ONLY for speech synthesis playback
 * so Hindi/Indian neural female voices (Swara, Google हिन्दी, Lekha) read Santali words
 * smoothly & authentically without stuttering on vowel nuktas, glottal apostrophes, or final ञ/ङ.
 */
export function normalizeSantaliDevanagariForPureTTS(text: string): string {
  if (!/[\u0900-\u097F]/.test(text)) return text;
  return text
    // 1. Strip Santali vowel nukta (आ़, अ़, ा़, े़, ो़, ि़, ु़) which breaks standard Hindi TTS
    .replace(/([अआइईउऊएऐओऔािीुूेैोौ])़/g, '$1')
    // 2. Smooth Santali hyphenated verb/suffix joins (केत्-आ -> केता, मेनाक्-आ -> मेनाका, चलाक्आ -> चलाका)
    .replace(/क्['’]?-आ/g, 'का')
    .replace(/क्आ/g, 'का')
    .replace(/त्['’]?-आ/g, 'ता')
    .replace(/त्आ/g, 'ता')
    .replace(/च्['’]?-आ/g, 'चा')
    .replace(/प्['’]?-आ/g, 'पा')
    // 3. Smooth Santali checked-consonant apostrophes (दाक्' -> दाक, मित्' -> मित, दुड़ुप्' -> दुड़ुप, एनेच्' -> एनेच)
    .replace(/क्['’]/g, 'क')
    .replace(/च्['’]/g, 'च')
    .replace(/त्['’]/g, 'त')
    .replace(/प्['’]/g, 'प')
    .replace(/([\u0900-\u097F])['’]/g, '$1')
    // 4. Smooth standalone velar/palatal nasals (ङ -> ंग, word-final/medial ञ -> ंय) for crisp Indian female pronunciation
    .replace(/([\u0900-\u097F])ङ(?![\u093E-\u094D])/g, '$1ंग')
    .replace(/इञाक्/g, 'इंयाक')
    .replace(/इञाक/g, 'इंयाक')
    .replace(/इञिच्/g, 'इंयिच')
    .replace(/इञ/g, 'इंय')
    .replace(/आलिञ/g, 'आलिंय')
    .replace(/तेहेञ/g, 'तेहेंय')
    .replace(/सेरेञ/g, 'सेरेंग')
    .replace(/हुडिञ/g, 'हुडिंय')
    .replace(/सांगिञ/g, 'सांगिंय')
    .replace(/([\u0900-\u097F])ञ(?![\u093E-\u094D])/g, '$1ंय')
    // 5. Remove trailing bare halant on Santali final checked stops so TTS doesn't swallow the last syllable
    .replace(/([कचतप])्(?=\s|[।.,?!;:]|$)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

// Santali Devanagari / Multi-Script phonetic text formatter
export function formatSpeechText(input: string): string {
  if (!input) return '';
  const withOlChiki = transliterateOlChikiIfPresent(input);
  return withOlChiki
    .replace(/\s+/g, ' ')
    .replace(/[•|·]/g, ', ')
    .trim();
}

/**
 * Classifies a chunk into one of the 3 primary supported reading languages:
 * 'hindi' | 'english' | 'santali_roman'
 */
export function classifyChunkLanguage(
  chunk: string,
  preferredMode: ReadingLanguageMode = 'all'
): DetectedChunkLang {
  const devChars = (chunk.match(/[\u0900-\u097F]/g) || []).length;
  const latinChars = (chunk.match(/[A-Za-z]/g) || []).length;

  if (preferredMode === 'santali_roman' && latinChars > 0 && devChars === 0) {
    return 'santali_roman';
  }
  if (devChars === 0 && latinChars > 0) {
    return isRomanSantaliChunk(chunk) ? 'santali_roman' : 'english';
  }
  if (latinChars > devChars * 1.8 && latinChars >= 3) {
    return isRomanSantaliChunk(chunk) ? 'santali_roman' : 'english';
  }
  return 'hindi';
}

/**
 * Maps DetectedChunkLang -> BCP-47 speech locale ('hi-IN' for Hindi & Santali Roman phonetic; 'en-IN' for English).
 */
export function detectChunkLang(chunk: string, fallbackLang = 'hi-IN'): string {
  const kind = classifyChunkLanguage(chunk);
  if (kind === 'english') return 'en-IN';
  if (kind === 'hindi' || kind === 'santali_roman') return 'hi-IN';
  return fallbackLang;
}

function hasSpeakableContent(text: string): boolean {
  return /[A-Za-z0-9\u0900-\u097F\u1C50-\u1C7F]/.test(text);
}

/**
 * Splits a single mixed-script sentence into consecutive script-homogeneous micro-segments
 * so a single sentence mixing Hindi/Santali + English (e.g. "जोहार! Welcome to Santal आ़रसी")
 * routes Hindi/Santali spans to the pure Hindi Female Voice and English spans to the pure English Female Voice!
 */
export function splitMixedScriptSentence(sentence: string): string[] {
  const hasDev = /[\u0900-\u097F]/.test(sentence);
  const hasLatin = /[A-Za-z]{2,}/.test(sentence);
  if (!hasDev || !hasLatin) return [sentence];

  const tokens = sentence.split(/\s+/).filter(Boolean);
  const segments: Array<{ script: 'dev' | 'lat'; parts: string[] }> = [];

  for (const tok of tokens) {
    const tokHasDev = /[\u0900-\u097F]/.test(tok);
    const tokHasLat = /[A-Za-z]/.test(tok);
    const script: 'dev' | 'lat' = tokHasDev
      ? 'dev'
      : tokHasLat
      ? 'lat'
      : segments.length > 0
      ? segments[segments.length - 1].script
      : 'dev';

    const last = segments[segments.length - 1];
    if (last && last.script === script) {
      last.parts.push(tok);
    } else {
      segments.push({ script, parts: [tok] });
    }
  }

  return segments
    .map((s) => s.parts.join(' ').trim())
    .filter((s) => s.length > 0 && hasSpeakableContent(s));
}

/**
 * Splits arbitrarily long text into clean sentence/clause chunks (<= 145 chars)
 * so Chromium/Android/WebView SpeechSynthesis reads 100% of the content
 * without hitting the ~15-second utterance cutoff bug.
 */
export function splitIntoSpeechChunks(text: string, maxLen = 145, fineSplitForLanguageFilter = false): string[] {
  const cleaned = formatSpeechText(text);
  if (!cleaned) return [];

  const splitPattern = fineSplitForLanguageFilter
    ? /(?<=[।.?!\n])\s+|\s*[()\[\]/—–|·•:]+\s*/
    : /(?<=[।.?!\n])\s+/;

  const rawSentences = cleaned
    .split(splitPattern)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && hasSpeakableContent(s));

  const chunks: string[] = [];

  for (const sentence of rawSentences) {
    if (sentence.length <= maxLen) {
      chunks.push(sentence);
      continue;
    }

    const subParts = sentence
      .split(/(?<=[,;:\-–—])\s+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0 && hasSpeakableContent(p));

    let buffer = '';
    for (const part of subParts) {
      if (part.length > maxLen) {
        if (buffer) {
          chunks.push(buffer.trim());
          buffer = '';
        }
        const words = part.split(/\s+/);
        let wordBuf = '';
        for (const w of words) {
          if ((wordBuf + ' ' + w).trim().length > maxLen) {
            if (wordBuf) chunks.push(wordBuf.trim());
            wordBuf = w;
          } else {
            wordBuf = wordBuf ? `${wordBuf} ${w}` : w;
          }
        }
        if (wordBuf) chunks.push(wordBuf.trim());
      } else if ((buffer + ' ' + part).trim().length > maxLen) {
        if (buffer) chunks.push(buffer.trim());
        buffer = part;
      } else {
        buffer = buffer ? `${buffer} ${part}` : part;
      }
    }
    if (buffer) chunks.push(buffer.trim());
  }

  return chunks.length > 0 ? chunks : hasSpeakableContent(cleaned) ? [cleaned] : [];
}

// Global reference array & session token to prevent Chrome GC bug and stale callbacks
let activeUtterances: SpeechSynthesisUtterance[] = [];
let cachedVoices: SpeechSynthesisVoice[] = [];
const unreliableVoiceNames = new Set<string>();
let speechSessionId = 0;
let pendingStartTimer: ReturnType<typeof setTimeout> | null = null;
let resumeWatchdogTimer: ReturnType<typeof setInterval> | null = null;
let stallWatchdogTimer: ReturnType<typeof setTimeout> | null = null;

// Active session playback state for prev/next/jump controls
let activeSessionMeta: {
  text: string;
  chunks: string[];
  chunkIndex: number;
  options?: SpeakOptions;
} | null = null;

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const refreshVoices = () => {
    try {
      const list = window.speechSynthesis.getVoices();
      if (list && list.length > 0) cachedVoices = list;
    } catch {
      // ignore
    }
  };
  refreshVoices();
  if (typeof window.speechSynthesis.addEventListener === 'function') {
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
  } else {
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
}

function clearTimers() {
  if (pendingStartTimer) {
    clearTimeout(pendingStartTimer);
    pendingStartTimer = null;
  }
  if (resumeWatchdogTimer) {
    clearInterval(resumeWatchdogTimer);
    resumeWatchdogTimer = null;
  }
  if (stallWatchdogTimer) {
    clearTimeout(stallWatchdogTimer);
    stallWatchdogTimer = null;
  }
}

function isVoiceUsableNow(v: SpeechSynthesisVoice): boolean {
  if (unreliableVoiceNames.has(v.name)) return false;
  // Remote network voices fail when offline
  if (v.localService === false && typeof navigator !== 'undefined' && navigator.onLine === false) {
    return false;
  }
  return true;
}

const KNOWN_MALE_VOICE_RE =
  /\b(male|hemant|madhur|prabhat|ravi|david|mark|george|daniel|alex|guy|rishabh|ryan|christopher|eric|andrew|brian|roger|steffan|liam|connor|william|james|aaron|fred)\b|hi-in-x-(?:hib|hid)|en-in-x-(?:end|ene)|en-us-x-(?:tpd|iom|iol)|en-gb-x-(?:gbb|gbd)/i;

const KNOWN_FEMALE_VOICE_RE =
  /\b(female|swara|neerja|heera|kalpana|aditi|kavya|lekha|veena|isha|shruti|sunita|geeta|zira|aria|jenny|sonia|samantha|victoria|karen|natasha|ava|emma|michelle|libby|maisie|hazel|susan|moira|tessa|fiona|veena)\b|google हिन्दी|google us english|hi-in-x-(?:hia|hic|hie)|en-in-x-(?:ena|enc)|en-us-x-(?:sfg|tpf|iob|iog)|en-gb-x-(?:gba|gbc|rjs)/i;

function scoreVoiceQuality(
  v: SpeechSynthesisVoice,
  isEnglishTarget: boolean,
  profile: VoiceModelProfile
): number {
  const name = v.name.toLowerCase();
  const lang = v.lang.toLowerCase();
  const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine !== false;
  let score = 0;

  // 1. Strict Gender Accuracy (never pick a male voice for a female reader!)
  const looksMale = KNOWN_MALE_VOICE_RE.test(name);
  const looksFemale = KNOWN_FEMALE_VOICE_RE.test(name);

  if (profile.gender === 'female') {
    if (looksMale && !looksFemale) score -= 2200;
    if (looksFemale) score += 320;
  } else {
    if (looksFemale && !looksMale) score -= 2200;
    if (looksMale) score += 320;
  }

  // 2. Language Accuracy + Studio Neural Quality Ranking
  if (!isEnglishTarget) {
    // Target: Hindi + Santali (Devanagari / Phonetic)
    if (lang.startsWith('hi')) {
      score += 650;
      if (profile.gender === 'female') {
        if (name.includes('swara') && name.includes('natural')) score += 520;
        else if (name.includes('swara')) score += 450;
        else if (name.includes('google') && (name.includes('हिन्दी') || name.includes('hindi') || lang.startsWith('hi'))) score += 470;
        else if (/hi-in-x-(?:hia|hic|hie)/i.test(name)) score += 430;
        else if (name.includes('lekha')) score += 390;
        else if (name.includes('kalpana') || name.includes('aditi')) score += 290;
      } else {
        if (name.includes('madhur') && name.includes('natural')) score += 520;
        else if (name.includes('madhur')) score += 440;
        else if (name.includes('hemant')) score += 300;
      }
    } else if (lang.includes('-in')) {
      // Indian English fallback when device lacks Hindi voice
      score += 180;
    } else if (lang.startsWith('en')) {
      score += 60;
    } else {
      score -= 400;
    }
  } else {
    // Target: English (Natural Indian English Female preferred, then UK/US Neural Female)
    if (lang.includes('en-in')) {
      score += 620;
      if (profile.gender === 'female') {
        if (name.includes('neerja') && name.includes('natural')) score += 520;
        else if (name.includes('neerja')) score += 440;
        else if (/en-in-x-(?:ena|enc)/i.test(name)) score += 420;
        else if (name.includes('veena') || name.includes('isha')) score += 390;
        else if (name.includes('heera')) score += 340;
      } else {
        if (name.includes('prabhat') && name.includes('natural')) score += 500;
        else if (name.includes('ravi')) score += 320;
      }
    } else if (lang.startsWith('en-gb') || lang.startsWith('en-us') || lang.startsWith('en')) {
      score += 520;
      if (profile.gender === 'female') {
        if ((name.includes('aria') || name.includes('jenny') || name.includes('sonia') || name.includes('ava')) && name.includes('natural')) {
          score += 470;
        } else if (name.includes('google uk english female') || name.includes('google us english')) {
          score += 440;
        } else if (name.includes('samantha') || name.includes('karen') || name.includes('zira')) {
          score += 310;
        }
      }
    } else {
      score -= 400;
    }
  }

  // 3. Natural / Neural bonus when online
  if (isOnline && (name.includes('natural') || name.includes('neural') || name.includes('online'))) {
    score += 140;
  }

  // 4. Profile keyword affinity bonus
  if (profile.voiceKeywords.some((k) => name.includes(k))) {
    score += 90;
  }

  return score;
}

/**
 * Selects the highest-quality SpeechSynthesisVoice matching the requested language
 * AND the user's selected Male/Female profile (or explicit per-language pinned system voice).
 */
export function getVoiceForProfile(
  preferredLang = 'hi-IN',
  profile: VoiceModelProfile = getActiveVoiceProfile(),
  preferLocalOnly = false
): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const liveVoices = window.speechSynthesis.getVoices();
  if (liveVoices && liveVoices.length > 0) cachedVoices = liveVoices;
  const allVoices = cachedVoices;
  if (!allVoices || allVoices.length === 0) return null;

  const usable = allVoices.filter((v) => isVoiceUsableNow(v) && (!preferLocalOnly || v.localService));
  const voices = usable.length > 0 ? usable : allVoices.filter((v) => !unreliableVoiceNames.has(v.name));
  const pool = voices.length > 0 ? voices : allVoices;

  const isEnglish = preferredLang.toLowerCase().startsWith('en');

  // 0. Per-language explicit user-pinned voice (best for pure Hindi+Santali & English dual female setup)
  if (!preferLocalOnly) {
    const pinnedLangVoice = isEnglish ? getPreferredEnglishVoiceName() : getPreferredHindiSantaliVoiceName();
    if (pinnedLangVoice) {
      const found = pool.find((v) => v.name === pinnedLangVoice);
      if (found) return found;
    }
    const customSysName = getPreferredSystemVoiceName();
    if (customSysName) {
      const pinned = pool.find((v) => v.name === customSysName);
      if (pinned) {
        const pinnedIsEn = pinned.lang.toLowerCase().startsWith('en');
        const pinnedIsHi = pinned.lang.toLowerCase().startsWith('hi');
        if ((isEnglish && pinnedIsEn) || (!isEnglish && pinnedIsHi)) {
          return pinned;
        }
      }
    }
  }

  // Deterministic tie-breaking by alphabetical voice name so the same voice stays locked across chunks & reloads
  const sortedPool = [...pool].sort((a, b) => a.name.localeCompare(b.name));
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -Infinity;
  for (const v of sortedPool) {
    const s = scoreVoiceQuality(v, isEnglish, profile);
    if (s > bestScore) {
      bestScore = s;
      best = v;
    }
  }
  return best || sortedPool.find((v) => v.localService) || sortedPool[0] || null;
}

/**
 * Returns the live resolved voice pair (Hindi+Santali voice + English voice) for UI transparency.
 */
export function getResolvedTrilingualVoices(profile: VoiceModelProfile = getActiveVoiceProfile()): {
  hindiSantaliVoice: SpeechSynthesisVoice | null;
  englishVoice: SpeechSynthesisVoice | null;
} {
  return {
    hindiSantaliVoice: getVoiceForProfile('hi-IN', profile, false),
    englishVoice: getVoiceForProfile('en-IN', profile, false)
  };
}

export function getImmediateFemaleVoice(preferredLang = 'hi-IN'): SpeechSynthesisVoice | null {
  return getVoiceForProfile(preferredLang, getActiveVoiceProfile());
}

/**
 * AudioContext Web Audio acoustic test chime.
 * Used explicitly for hardware speaker check — NOT fired over normal speech playback.
 */
export function playAcousticChime(frequency = 587.33, duration = 0.28) {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.4, ctx.currentTime + duration * 0.5);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Silent catch
  }
}

export interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  autoDetectLanguage?: boolean;
  readingLangMode?: ReadingLanguageMode;
  voiceProfileId?: string;
  startChunkIndex?: number;
  onChunkChange?: (chunkIndex: number, totalChunks: number, chunkText: string) => void;
  onEnd?: () => void;
}

/**
 * Main Full-Text 3-Language Speech Recitation function.
 * Reads Hindi, English, AND Santali Roman seamlessly via sequential sentence chunking,
 * converts Santali Roman chunks to accurate phonetic Devanagari for natural pronunciation,
 * and supports Top-10 Male/Female Voice Profiles.
 */
export function speakWithFemaleVoice(text: string, options?: SpeakOptions) {
  if (typeof window === 'undefined') return;

  const cleaned = formatSpeechText(text);
  if (!cleaned) return;

  const sessionId = ++speechSessionId;
  clearTimers();

  const activeProfile = options?.voiceProfileId
    ? TOP_10_VOICE_MODELS.find((v) => v.id === options.voiceProfileId) || getActiveVoiceProfile()
    : getActiveVoiceProfile();

  // Content modules that do NOT pass readingLangMode explicitly always read in full 3-language Auto mode
  // so no card/lesson sentence is ever silently skipped when the global reader bar filter is set to a single language.
  const effectiveMode: ReadingLanguageMode = options?.readingLangMode ?? 'all';

  let parentChunks = splitIntoSpeechChunks(cleaned, 145, effectiveMode !== 'all');

  if (effectiveMode !== 'all' && parentChunks.length > 1) {
    const filtered = parentChunks.filter((c) => {
      const kind = classifyChunkLanguage(c, effectiveMode);
      return kind === effectiveMode;
    });
    if (filtered.length > 0) {
      parentChunks = filtered;
    } else {
      parentChunks = splitIntoSpeechChunks(cleaned, 145, false);
    }
  }

  if (parentChunks.length === 0) return;

  // Map each spoken micro-segment back to its exact parent sentence chunk so karaoke highlighting,
  // progress counts, and < Prev / Next > controls stay 100% synchronized even when intra-sentence switching happens!
  interface SpeechSegment {
    spokenRaw: string;
    parentIdx: number;
    parentText: string;
  }

  const segments: SpeechSegment[] = [];
  parentChunks.forEach((pText, pIdx) => {
    if (effectiveMode === 'all' && options?.autoDetectLanguage !== false) {
      const microParts = splitMixedScriptSentence(pText);
      for (const part of microParts) {
        segments.push({ spokenRaw: part, parentIdx: pIdx, parentText: pText });
      }
    } else {
      segments.push({ spokenRaw: pText, parentIdx: pIdx, parentText: pText });
    }
  });

  if (segments.length === 0) return;

  const requestedParentIdx = Math.max(0, Math.min(options?.startChunkIndex ?? 0, parentChunks.length - 1));
  const startSegIdx = Math.max(
    0,
    segments.findIndex((s) => s.parentIdx >= requestedParentIdx)
  );
  activeSessionMeta = { text, chunks: parentChunks, chunkIndex: requestedParentIdx, options };

  if (!('speechSynthesis' in window)) {
    playAcousticChime(659.25, 0.35);
    emitSpeechState({
      isSpeaking: false,
      isPaused: false,
      fullText: cleaned,
      currentChunkText: cleaned,
      chunkIndex: 0,
      totalChunks: parentChunks.length,
      activeVoiceName: activeProfile.labelHi,
      activeSystemVoiceName: '',
      activeChunkLang: classifyChunkLanguage(cleaned, effectiveMode),
      errorMessage: 'आपका ब्राउज़र Web Speech Audio का समर्थन नहीं करता।'
    });
    options?.onEnd?.();
    return;
  }

  const synth = window.speechSynthesis;
  const wasBusy = synth.speaking || synth.pending || synth.paused;

  if (wasBusy) {
    try {
      if (synth.paused) synth.resume();
      synth.cancel();
      activeUtterances = [];
    } catch {
      // Ignore cancel errors
    }
  }

  const initialSeg = segments[startSegIdx] || segments[0];
  const initialLang = classifyChunkLanguage(initialSeg.spokenRaw, effectiveMode);
  emitSpeechState({
    isSpeaking: true,
    isPaused: false,
    fullText: cleaned,
    currentChunkText: initialSeg.parentText,
    chunkIndex: initialSeg.parentIdx,
    totalChunks: parentChunks.length,
    activeVoiceName: activeProfile.labelHi,
    activeChunkLang: initialLang,
    errorMessage: null
  });

  // Start watchdog to prevent Chromium's 15-second pause deadlock
  resumeWatchdogTimer = setInterval(() => {
    if (sessionId !== speechSessionId) {
      clearTimers();
      return;
    }
    try {
      if (synth.speaking && synth.paused && !currentSpeechState.isPaused) {
        synth.resume();
      }
    } catch {
      // Ignore
    }
  }, 2500);

  let consecutiveErrors = 0;
  let lastReportedParentIdx = -1;

  const speakSegment = (segIdx: number, attemptMode: 'primary' | 'local_fallback' | 'roman_fallback' = 'primary') => {
    if (sessionId !== speechSessionId) return;

    while (segIdx < segments.length && !hasSpeakableContent(segments[segIdx].spokenRaw)) {
      segIdx++;
    }

    if (segIdx >= segments.length) {
      clearTimers();
      activeSessionMeta = null;
      emitSpeechState({
        isSpeaking: false,
        isPaused: false,
        currentChunkText: '',
        chunkIndex: 0,
        totalChunks: 0,
        activeVoiceName: activeProfile.labelHi,
        activeSystemVoiceName: '',
        errorMessage: null
      });
      options?.onEnd?.();
      return;
    }

    const seg = segments[segIdx];
    if (activeSessionMeta) {
      activeSessionMeta.chunkIndex = seg.parentIdx;
    }

    const rawChunkText = seg.spokenRaw;
    const detectedKind = classifyChunkLanguage(rawChunkText, effectiveMode);

    let spokenPayload = rawChunkText;
    let targetLocale = 'hi-IN';

    if (detectedKind === 'english') {
      targetLocale = 'en-IN';
      spokenPayload = rawChunkText;
    } else if (detectedKind === 'santali_roman') {
      targetLocale = 'hi-IN';
      spokenPayload =
        attemptMode === 'roman_fallback'
          ? rawChunkText
          : normalizeSantaliDevanagariForPureTTS(transliterateRomanSantaliToPhoneticDevanagari(rawChunkText));
    } else {
      targetLocale = 'hi-IN';
      spokenPayload = normalizeSantaliDevanagariForPureTTS(rawChunkText);
    }

    if (options?.autoDetectLanguage === false && options?.lang) {
      targetLocale = options.lang;
      if (targetLocale.toLowerCase().startsWith('en')) {
        spokenPayload = rawChunkText;
      } else {
        spokenPayload = normalizeSantaliDevanagariForPureTTS(rawChunkText);
      }
    }

    try {
      const available = getAvailableSystemVoices();
      const voice =
        attemptMode === 'primary'
          ? getVoiceForProfile(targetLocale, activeProfile, false)
          : getVoiceForProfile(
              attemptMode === 'roman_fallback' ? 'en-IN' : targetLocale,
              activeProfile,
              true
            ) ||
            available.find((v) => v.localService && !unreliableVoiceNames.has(v.name)) ||
            available.find((v) => v.default) ||
            available[0] ||
            null;

      emitSpeechState({
        isSpeaking: true,
        isPaused: false,
        currentChunkText: seg.parentText,
        chunkIndex: seg.parentIdx,
        totalChunks: parentChunks.length,
        activeVoiceName: activeProfile.labelHi,
        activeSystemVoiceName: voice?.name || '',
        activeChunkLang: detectedKind,
        errorMessage: null
      });

      if (seg.parentIdx !== lastReportedParentIdx) {
        lastReportedParentIdx = seg.parentIdx;
        options?.onChunkChange?.(seg.parentIdx, parentChunks.length, seg.parentText);
      }

      // If voice does NOT support Hindi/Devanagari (e.g. en-US / en-IN SAPI only), convert Devanagari to phonetic Roman
      // so the browser speaks aloud instead of silently skipping all Hindi/Santali words!
      const voiceIsHindi = Boolean(voice && voice.lang.toLowerCase().startsWith('hi'));
      if (
        (attemptMode === 'roman_fallback' || (voice && !voiceIsHindi && /[\u0900-\u097F]/.test(spokenPayload))) &&
        /[\u0900-\u097F]/.test(spokenPayload)
      ) {
        spokenPayload =
          detectedKind === 'santali_roman'
            ? rawChunkText
            : transliterateDevanagariToPhoneticRoman(spokenPayload);
      }

      const utterance = new SpeechSynthesisUtterance(spokenPayload);
      activeUtterances.push(utterance);

      if (voice) {
        utterance.voice = voice;
        // Align utterance.lang with the chosen voice's own locale so Chromium/Windows never rejects or mutes it
        utterance.lang = voice.lang || targetLocale;
      } else {
        utterance.lang =
          attemptMode === 'roman_fallback'
            ? 'en-US'
            : targetLocale || 'hi-IN';
      }

      const requestedPitch = options?.pitch ?? getUserSpeechPitch();
      const requestedRate = options?.rate ?? getUserSpeechRate();
      // Cloud Neural voices (Swara/Neerja Natural, Google हिन्दी) sound cleanest and most consistent near natural pitch 1.0
      const isNeuralVoice = Boolean(
        voice && (voice.localService === false || /natural|neural|online|google/i.test(voice.name))
      );
      const effectivePitch =
        isNeuralVoice && activeProfile.gender === 'female' && options?.pitch === undefined
          ? Math.max(0.95, Math.min(1.06, requestedPitch))
          : Math.max(0.5, Math.min(2, requestedPitch));

      utterance.pitch = effectivePitch;
      utterance.rate = Math.max(0.5, Math.min(2, requestedRate));
      utterance.volume = options?.volume ?? 1.0;

      let didStart = false;
      let settled = false;
      const queuedAt = Date.now();

      if (stallWatchdogTimer) {
        clearTimeout(stallWatchdogTimer);
        stallWatchdogTimer = null;
      }

      const cleanup = () => {
        if (stallWatchdogTimer) {
          clearTimeout(stallWatchdogTimer);
          stallWatchdogTimer = null;
        }
        const uIdx = activeUtterances.indexOf(utterance);
        if (uIdx !== -1) activeUtterances.splice(uIdx, 1);
      };

      // Generous grace window for cloud neural female voices (Swara Online Natural / Google हिन्दी / Neerja Natural)
      // so first-chunk network warmup never gets falsely blacklisted!
      const stallGraceMs = voice && voice.localService === false ? 4500 : 2600;
      stallWatchdogTimer = setTimeout(() => {
        if (settled || didStart || sessionId !== speechSessionId) return;
        settled = true;
        if (voice && !voice.localService) {
          unreliableVoiceNames.add(voice.name);
        }
        cleanup();
        try {
          synth.cancel();
        } catch {
          // ignore
        }
        if (attemptMode === 'primary') {
          speakSegment(segIdx, 'local_fallback');
        } else if (attemptMode === 'local_fallback') {
          speakSegment(segIdx, 'roman_fallback');
        } else {
          speakSegment(segIdx + 1, 'primary');
        }
      }, stallGraceMs);

      utterance.onstart = () => {
        didStart = true;
        if (stallWatchdogTimer) {
          clearTimeout(stallWatchdogTimer);
          stallWatchdogTimer = null;
        }
      };

      utterance.onend = () => {
        if (settled) return;
        settled = true;
        cleanup();
        if (sessionId !== speechSessionId) return;

        // Detect Windows/Chrome silent Devanagari skip (utterance finishes in <110ms without starting)
        const elapsed = Date.now() - queuedAt;
        if (!didStart && elapsed < 110 && spokenPayload.length > 8 && attemptMode !== 'roman_fallback') {
          if (voice) unreliableVoiceNames.add(voice.name);
          speakSegment(segIdx, 'roman_fallback');
          return;
        }

        consecutiveErrors = 0;
        speakSegment(segIdx + 1, 'primary');
      };

      utterance.onerror = (e) => {
        if (settled) return;
        settled = true;
        cleanup();
        if (sessionId !== speechSessionId) return;
        if (e.error === 'interrupted' || e.error === 'canceled') return;

        if (e.error === 'not-allowed') {
          clearTimers();
          emitSpeechState({
            isSpeaking: false,
            isPaused: false,
            errorMessage: 'ब्राउज़र ने ध्वनि अनुमति रोकी है — कृपया पेज पर क्लिक करके "सुनें" दोबारा दबाएँ।'
          });
          options?.onEnd?.();
          return;
        }

        if (voice) {
          unreliableVoiceNames.add(voice.name);
        }

        if (attemptMode === 'primary') {
          speakSegment(segIdx, 'local_fallback');
          return;
        }
        if (attemptMode === 'local_fallback') {
          speakSegment(segIdx, 'roman_fallback');
          return;
        }

        consecutiveErrors++;
        if (consecutiveErrors >= 2 || available.length === 0) {
          clearTimers();
          emitSpeechState({
            isSpeaking: false,
            isPaused: false,
            errorMessage:
              available.length === 0
                ? 'इस डिवाइस/ब्राउज़र में अभी कोई TTS Voice इंस्टॉल या लोड नहीं है। कृपया Chrome/Edge का उपयोग करें या OS TTS सेटिंग जांचें।'
                : 'ऑडियो वाचन में अस्थायी बाधा आई — कृपया 10 Voices मेनू से कोई अन्य सिस्टम आवाज़ चुनें।'
          });
          options?.onEnd?.();
          return;
        }

        speakSegment(segIdx + 1, 'primary');
      };

      synth.speak(utterance);
      if (synth.paused) {
        synth.resume();
      }
    } catch (err) {
      console.error('TTS chunk execution error:', err);
      speakSegment(segIdx + 1, 'primary');
    }
  };

  // Cold-start safety: if browser hasn't populated voices yet on the very first click,
  // wait briefly (max 240ms) for voiceschanged so chunk 0 also uses the exact pure female voice.
  const startPlayback = () => {
    if (sessionId !== speechSessionId) return;
    speakSegment(startSegIdx, 'primary');
  };

  const initialVoices = getAvailableSystemVoices();
  if (initialVoices.length === 0) {
    let launched = false;
    const launchOnce = () => {
      if (launched) return;
      launched = true;
      synth.removeEventListener?.('voiceschanged', launchOnce);
      startPlayback();
    };
    synth.addEventListener?.('voiceschanged', launchOnce);
    pendingStartTimer = setTimeout(launchOnce, 240);
  } else if (wasBusy) {
    pendingStartTimer = setTimeout(startPlayback, 75);
  } else {
    startPlayback();
  }
}

/**
 * Jump to a specific sentence/chunk in the currently loaded speech session.
 */
export function jumpToSpeechChunk(targetIndex: number) {
  if (!activeSessionMeta) return;
  const clamped = Math.max(0, Math.min(targetIndex, activeSessionMeta.chunks.length - 1));
  speakWithFemaleVoice(activeSessionMeta.text, {
    ...activeSessionMeta.options,
    startChunkIndex: clamped
  });
}

export function prevSpeechChunk() {
  if (!activeSessionMeta) return;
  jumpToSpeechChunk(activeSessionMeta.chunkIndex - 1);
}

export function nextSpeechChunk() {
  if (!activeSessionMeta) return;
  jumpToSpeechChunk(activeSessionMeta.chunkIndex + 1);
}

/**
 * Pause current speech playback.
 */
export function pauseSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.pause();
      emitSpeechState({ isPaused: true, isSpeaking: true });
    } catch {
      // Ignore
    }
  }
}

/**
 * Resume paused speech playback.
 */
export function resumeSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.resume();
      emitSpeechState({ isPaused: false, isSpeaking: true });
    } catch {
      // Ignore
    }
  }
}

/**
 * Stop any current speech playback immediately.
 */
export function stopSpeaking() {
  speechSessionId++;
  clearTimers();
  activeSessionMeta = null;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      activeUtterances = [];
    } catch {
      // Ignore
    }
  }
  emitSpeechState({
    isSpeaking: false,
    isPaused: false,
    currentChunkText: '',
    chunkIndex: 0,
    totalChunks: 0,
    errorMessage: null
  });
}

