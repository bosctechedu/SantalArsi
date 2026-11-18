/**
 * Robust Multi-Voice Synthesis & 3-Language Audio Engine for Hor Katha Suite.
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
  // 5 Female Voice Models
  {
    id: 'swara_female',
    name: 'Swara (Standard Female)',
    labelHi: '१. स्वरा (मधुर मानक महिला स्वर)',
    gender: 'female',
    role: 'संतुलित व मधुर उच्चारण',
    pitch: 1.12,
    rate: 0.90,
    voiceKeywords: ['swara', 'google हिन्दी', 'heera', 'kalpana', 'female', 'zira']
  },
  {
    id: 'aditi_teacher',
    name: 'Aditi (Clear Tutor Female)',
    labelHi: '२. अदिति (स्पष्ट शिक्षिका स्वर)',
    gender: 'female',
    role: 'धीमा व शब्द-दर-शब्द शिक्षण',
    pitch: 1.08,
    rate: 0.78,
    voiceKeywords: ['aditi', 'lekha', 'veena', 'sunita', 'geeta', 'female']
  },
  {
    id: 'kavya_storyteller',
    name: 'Kavya (Folk Storyteller Female)',
    labelHi: '३. काव्या (लोककथा वाचिका)',
    gender: 'female',
    role: 'कहानी व सेरेञ भाव-वाचन',
    pitch: 1.18,
    rate: 0.85,
    voiceKeywords: ['kavya', 'shruti', 'neerja', 'victoria', 'samantha', 'female']
  },
  {
    id: 'neerja_anchor',
    name: 'Neerja (News Anchor Female)',
    labelHi: '४. नीरजा (समाचार वाचक महिला)',
    gender: 'female',
    role: 'स्पष्ट व त्वरित बुलेटिन वाचन',
    pitch: 1.04,
    rate: 0.98,
    voiceKeywords: ['neerja', 'natasha', 'karen', 'zira', 'heera', 'female']
  },
  {
    id: 'fulo_youth',
    name: 'Fulo (Bright Youth Female)',
    labelHi: '५. फूलो (युवा संवाद स्वर)',
    gender: 'female',
    role: 'संवादात्मक व जीवंत स्वर',
    pitch: 1.24,
    rate: 0.95,
    voiceKeywords: ['samantha', 'victoria', 'swara', 'female']
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
const READING_LANG_MODE_STORAGE_KEY = 'hor_katha_reading_lang_mode';

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
    localStorage.setItem(VOICE_PROFILE_STORAGE_KEY, profileId);
    window.dispatchEvent(new CustomEvent('hor-katha-voice-changed', { detail: profileId }));
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
  if (!name) localStorage.removeItem(CUSTOM_SYSTEM_VOICE_STORAGE_KEY);
  else localStorage.setItem(CUSTOM_SYSTEM_VOICE_STORAGE_KEY, name);
  window.dispatchEvent(new CustomEvent('hor-katha-voice-changed', { detail: name }));
}

export function getAvailableSystemVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const list = window.speechSynthesis.getVoices();
  return list.length > 0 ? list : cachedVoices;
}

export interface SpeechStateSnapshot {
  isSpeaking: boolean;
  isPaused: boolean;
  fullText: string;
  currentChunkText: string;
  chunkIndex: number;
  totalChunks: number;
  activeVoiceName?: string;
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

// Ol Chiki (᱐-᱿) phonetic Devanagari transliterator so Ol Chiki scripts are spoken aloud!
const OL_CHIKI_TO_DEV: Record<string, string> = {
  '᱐': '0', '᱑': '1', '᱒': '2', '᱓': '3', '᱔': '4',
  '᱕': '5', '᱖': '6', '᱗': '7', '᱘': '8', '᱙': '9',
  'ᱚ': 'अ', 'ᱛ': 'त', 'ᱜ': 'ग', 'ᱝ': 'ङ', 'ᱞ': 'ल',
  'ᱟ': 'आ', 'क': 'क', 'ᱡ': 'ज', 'ᱢ': 'म', 'ᱣ': 'व',
  'ᱠ': 'क',
  'ᱤ': 'इ', 'ᱥ': 'स', 'ᱦ': 'ह', 'ᱧ': 'ञ', 'ᱨ': 'र',
  'ᱩ': 'उ', 'ᱪ': 'च', 'ᱫ': 'द', 'ᱬ': 'ण', 'ᱭ': 'य',
  'ᱮ': 'ए', 'ᱯ': 'प', 'ᱰ': 'ड', 'ᱱ': 'न', 'ᱲ': 'ड़',
  'ᱳ': 'ओ', 'ᱴ': 'ट', 'ᱵ': 'ब', 'ᱶ': 'ँ', 'ᱷ': 'ह',
  'ᱸ': 'ं', 'ᱹ': '़', 'ᱺ': 'ं', 'ᱻ': '', 'ᱼ': '', 'ᱽ': '्', '᱾': '।', '᱿': '।'
};

export function transliterateOlChikiIfPresent(input: string): string {
  if (!/[\u1C50-\u1C7F]/.test(input)) return input;
  let out = '';
  for (const ch of input) {
    out += OL_CHIKI_TO_DEV[ch] !== undefined ? OL_CHIKI_TO_DEV[ch] : ch;
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
  caole: 'चावले'
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
  if (latinChars > devChars * 2.2 && latinChars > 5) {
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

/**
 * Selects the best browser SpeechSynthesisVoice matching the requested language
 * AND the user's selected Male/Female Top-10 voice profile (or explicit system voice).
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

  // 0. Explicit user-pinned OS voice if not marked broken
  const customSysName = getPreferredSystemVoiceName();
  if (customSysName && !preferLocalOnly) {
    const pinned = pool.find((v) => v.name === customSysName);
    if (pinned) return pinned;
  }

  const isEnglish = preferredLang.toLowerCase().startsWith('en');
  const genderKeywords =
    profile.gender === 'male'
      ? ['male', 'madhur', 'hemant', 'prabhat', 'ravi', 'david', 'george', 'daniel', 'mark', 'alex', 'guy', 'rishabh']
      : ['female', 'swara', 'kavya', 'heera', 'kalpana', 'zira', 'aditi', 'veena', 'sunita', 'geeta', 'shruti', 'neerja', 'samantha', 'victoria', 'karen', 'natasha', 'lekha'];

  if (!isEnglish) {
    // Prefer genuine Hindi voices (local OS Hindi first, then remote Hindi)
    const localHiExact = pool.find(
      (v) =>
        v.localService &&
        v.lang.toLowerCase().startsWith('hi') &&
        profile.voiceKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (localHiExact) return localHiExact;

    const localHiGender = pool.find(
      (v) =>
        v.localService &&
        v.lang.toLowerCase().startsWith('hi') &&
        genderKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (localHiGender) return localHiGender;

    const localAnyHi = pool.find((v) => v.localService && v.lang.toLowerCase().startsWith('hi'));
    if (localAnyHi) return localAnyHi;

    const hiExact = pool.find(
      (v) =>
        v.lang.toLowerCase().startsWith('hi') &&
        profile.voiceKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (hiExact) return hiExact;

    const anyHindi = pool.find((v) => v.lang.toLowerCase().startsWith('hi'));
    if (anyHindi) return anyHindi;

    // Fallback to Indian English local voice, then any local voice
    const inGender = pool.find(
      (v) =>
        v.lang.toLowerCase().includes('-in') &&
        genderKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (inGender) return inGender;

    const indianAny = pool.find((v) => v.lang.toLowerCase().includes('-in'));
    if (indianAny) return indianAny;
  } else {
    const enInGender = pool.find(
      (v) =>
        v.lang.toLowerCase().includes('en-in') &&
        genderKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (enInGender) return enInGender;

    const enInAny = pool.find((v) => v.lang.toLowerCase().includes('en-in'));
    if (enInAny) return enInAny;

    const enGender = pool.find(
      (v) =>
        v.lang.toLowerCase().startsWith('en') &&
        genderKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (enGender) return enGender;

    const anyEn = pool.find((v) => v.lang.toLowerCase().startsWith('en'));
    if (anyEn) return anyEn;
  }

  const anyGender = pool.find((v) =>
    genderKeywords.some((k) => v.name.toLowerCase().includes(k))
  );
  if (anyGender) return anyGender;

  return pool.find((v) => v.localService) || pool[0] || null;
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

  const effectiveMode: ReadingLanguageMode = options?.readingLangMode ?? getReadingLanguageMode();

  // When a specific language filter is requested, split mixed-language clauses finely first
  let chunks = splitIntoSpeechChunks(cleaned, 145, effectiveMode !== 'all');

  if (effectiveMode !== 'all' && chunks.length > 1) {
    const filtered = chunks.filter((c) => {
      const kind = classifyChunkLanguage(c, effectiveMode);
      return kind === effectiveMode;
    });
    if (filtered.length > 0) {
      chunks = filtered;
    } else {
      // Fallback to standard chunks if filter leaves empty
      chunks = splitIntoSpeechChunks(cleaned, 145, false);
    }
  }

  if (chunks.length === 0) return;

  const startIdx = Math.max(0, Math.min(options?.startChunkIndex ?? 0, chunks.length - 1));
  activeSessionMeta = { text, chunks, chunkIndex: startIdx, options };

  if (!('speechSynthesis' in window)) {
    playAcousticChime(659.25, 0.35);
    emitSpeechState({
      isSpeaking: false,
      isPaused: false,
      fullText: cleaned,
      currentChunkText: cleaned,
      chunkIndex: 0,
      totalChunks: chunks.length,
      activeVoiceName: activeProfile.labelHi,
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

  const initialLang = classifyChunkLanguage(chunks[startIdx] || cleaned, effectiveMode);
  emitSpeechState({
    isSpeaking: true,
    isPaused: false,
    fullText: cleaned,
    currentChunkText: chunks[startIdx] || cleaned,
    chunkIndex: startIdx,
    totalChunks: chunks.length,
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

  const speakChunk = (idx: number, attemptMode: 'primary' | 'local_fallback' | 'roman_fallback' = 'primary') => {
    if (sessionId !== speechSessionId) return;

    while (idx < chunks.length && !hasSpeakableContent(chunks[idx])) {
      idx++;
    }

    if (idx >= chunks.length) {
      clearTimers();
      activeSessionMeta = null;
      emitSpeechState({
        isSpeaking: false,
        isPaused: false,
        currentChunkText: '',
        chunkIndex: 0,
        totalChunks: 0,
        activeVoiceName: activeProfile.labelHi,
        errorMessage: null
      });
      options?.onEnd?.();
      return;
    }

    if (activeSessionMeta) {
      activeSessionMeta.chunkIndex = idx;
    }

    const rawChunkText = chunks[idx];
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
          : transliterateRomanSantaliToPhoneticDevanagari(rawChunkText);
    } else {
      targetLocale = 'hi-IN';
      spokenPayload = rawChunkText;
    }

    if (options?.autoDetectLanguage === false && options?.lang) {
      targetLocale = options.lang;
      if (targetLocale.toLowerCase().startsWith('en')) {
        spokenPayload = rawChunkText;
      }
    }

    emitSpeechState({
      isSpeaking: true,
      isPaused: false,
      currentChunkText: rawChunkText,
      chunkIndex: idx,
      totalChunks: chunks.length,
      activeVoiceName: activeProfile.labelHi,
      activeChunkLang: detectedKind,
      errorMessage: null
    });
    options?.onChunkChange?.(idx, chunks.length, rawChunkText);

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

      utterance.pitch = Math.max(0.5, Math.min(2, options?.pitch ?? activeProfile.pitch));
      utterance.rate = Math.max(0.5, Math.min(2, options?.rate ?? activeProfile.rate));
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

      // Stall watchdog: if a remote/cloud voice (e.g. Google हिन्दी) hangs silently without calling onstart/onerror within 2.2s,
      // cancel and retry cleanly with a local/phonetic fallback voice!
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
          speakChunk(idx, 'local_fallback');
        } else if (attemptMode === 'local_fallback') {
          speakChunk(idx, 'roman_fallback');
        } else {
          speakChunk(idx + 1, 'primary');
        }
      }, 2200);

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
          speakChunk(idx, 'roman_fallback');
          return;
        }

        consecutiveErrors = 0;
        speakChunk(idx + 1, 'primary');
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
          speakChunk(idx, 'local_fallback');
          return;
        }
        if (attemptMode === 'local_fallback') {
          speakChunk(idx, 'roman_fallback');
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

        speakChunk(idx + 1, 'primary');
      };

      synth.speak(utterance);
      if (synth.paused) {
        synth.resume();
      }
    } catch (err) {
      console.error('TTS chunk execution error:', err);
      speakChunk(idx + 1, 'primary');
    }
  };

  // Preserve synchronous user-gesture activation when speechSynthesis is idle;
  // only defer slightly when interrupting a prior speaking utterance.
  if (wasBusy) {
    pendingStartTimer = setTimeout(() => {
      if (sessionId === speechSessionId) {
        speakChunk(startIdx, 'primary');
      }
    }, 75);
  } else {
    speakChunk(startIdx, 'primary');
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

