// Shared Santali Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ) Transliteration Helper (Devanagari & Roman -> Ol Chiki)

const DEV_TO_OL_DIGRAPH: Array<[string, string]> = [
  ['ख', 'ᱠᱷ'],
  ['घ', 'ᱜᱷ'],
  ['छ', 'ᱪᱷ'],
  ['झ', 'ᱡᱷ'],
  ['ठ', 'ᱴᱷ'],
  ['ढ', 'ᱰᱷ'],
  ['थ', 'ᱛᱷ'],
  ['ध', 'ᱫᱷ'],
  ['फ', 'ᱯᱷ'],
  ['भ', 'ᱵᱷ'],
  ['ढ़', 'ᱲᱷ'],
  ['ड़', 'ᱲ'],
  ['ज्ञ', 'ᱜᱭ'],
  ['क्ष', 'ᱠᱥ'],
  ['त्र', 'ᱛᱨ'],
  ['श्र', 'ᱥᱨ']
];

const DEV_TO_OL_SINGLE: Record<string, string> = {
  'अ': 'ᱚ',
  'आ': 'ᱟ',
  'इ': 'ᱤ',
  'ई': 'ᱤ',
  'उ': 'ᱩ',
  'ऊ': 'ᱩ',
  'ऋ': 'ᱨᱤ',
  'ए': 'ᱮ',
  'ऐ': 'ᱮ',
  'ओ': 'ᱳ',
  'औ': 'ᱳ',
  'ा': 'ᱟ',
  'ि': 'ᱤ',
  'ी': 'ᱤ',
  'ु': 'ᱩ',
  'ू': 'ᱩ',
  'ृ': 'ᱨᱤ',
  'े': 'ᱮ',
  'ै': 'ᱮ',
  'ो': 'ᱳ',
  'ौ': 'ᱳ',
  'क': 'ᱠ',
  'ग': 'ᱜ',
  'ङ': 'ᱝ',
  'च': 'ᱪ',
  'ज': 'ᱡ',
  'ञ': 'ᱧ',
  'ट': 'ᱴ',
  'ड': 'ᱰ',
  'ण': 'ᱬ',
  'त': 'ᱛ',
  'द': 'ᱫ',
  'न': 'ᱱ',
  'प': 'ᱯ',
  'ब': 'ᱵ',
  'म': 'ᱢ',
  'य': 'ᱭ',
  'र': 'ᱨ',
  'ल': 'ᱞ',
  'व': 'ᱣ',
  'स': 'ᱥ',
  'श': 'ᱥ',
  'ष': 'ᱥ',
  'ह': 'ᱦ',
  'ं': 'ᱸ',
  'ँ': 'ᱸ',
  '़': 'ᱹ',
  '्': 'ᱻ',
  '।': '᱾',
  '॥': '᱿',
  '-': 'ᱼ',
  '०': '᱐',
  '१': '᱑',
  '२': '᱒',
  '३': '᱓',
  '४': '᱔',
  '५': '᱕',
  '६': '᱖',
  '७': '᱗',
  '८': '᱘',
  '९': '᱙',
  '0': '᱐',
  '1': '᱑',
  '2': '᱒',
  '3': '᱓',
  '4': '᱔',
  '5': '᱕',
  '6': '᱖',
  '7': '᱗',
  '8': '᱘',
  '9': '᱙'
};

const ROMAN_DIGRAPHS: Array<[string, string]> = [
  ['ng', 'ᱝ'],
  ['ny', 'ᱧ'],
  ['nh', 'ᱶ'],
  ['kh', 'ᱠᱷ'],
  ['gh', 'ᱜᱷ'],
  ['ch', 'ᱪ'],
  ['jh', 'ᱡᱷ'],
  ['th', 'ᱛᱷ'],
  ['dh', 'ᱫᱷ'],
  ['ph', 'ᱯᱷ'],
  ['bh', 'ᱵᱷ'],
  ['sh', 'ᱥ'],
  ['aa', 'ᱟ'],
  ['ee', 'ᱤ'],
  ['oo', 'ᱩ']
];

const ROMAN_SINGLE: Record<string, string> = {
  'a': 'ᱟ',
  'ā': 'ᱟ',
  'o': 'ᱳ',
  'ō': 'ᱳ',
  'ọ': 'ᱚ',
  'i': 'ᱤ',
  'ī': 'ᱤ',
  'u': 'ᱩ',
  'ū': 'ᱩ',
  'e': 'ᱮ',
  'ē': 'ᱮ',
  'k': 'ᱠ',
  'g': 'ᱜ',
  'c': 'ᱪ',
  'j': 'ᱡ',
  't': 'ᱛ',
  'ṭ': 'ᱴ',
  'd': 'ᱫ',
  'ḍ': 'ᱰ',
  'n': 'ᱱ',
  'ṇ': 'ᱬ',
  'ñ': 'ᱧ',
  'ṅ': 'ᱝ',
  'p': 'ᱯ',
  'b': 'ᱵ',
  'm': 'ᱢ',
  'ṃ': 'ᱸ',
  'y': 'ᱭ',
  'r': 'ᱨ',
  'ṛ': 'ᱲ',
  'l': 'ᱞ',
  'w': 'ᱣ',
  'v': 'ᱣ',
  's': 'ᱥ',
  'h': 'ᱦ',
  "'": 'ᱻ',
  '0': '᱐',
  '1': '᱑',
  '2': '᱒',
  '3': '᱓',
  '4': '᱔',
  '5': '᱕',
  '6': '᱖',
  '7': '᱗',
  '8': '᱘',
  '9': '᱙'
};

export function devanagariToOlChiki(text: string): string {
  if (!text) return '';
  let normalized = text;
  for (const [dev, ol] of DEV_TO_OL_DIGRAPH) {
    normalized = normalized.split(dev).join(ol);
  }
  let out = '';
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    out += DEV_TO_OL_SINGLE[ch] !== undefined ? DEV_TO_OL_SINGLE[ch] : ch;
  }
  return out;
}

export function romanToOlChiki(text: string): string {
  if (!text) return '';
  const lower = text.toLowerCase();
  let out = '';
  let i = 0;
  while (i < lower.length) {
    let matchedDigraph = false;
    for (const [dg, ol] of ROMAN_DIGRAPHS) {
      if (lower.startsWith(dg, i)) {
        out += ol;
        i += dg.length;
        matchedDigraph = true;
        break;
      }
    }
    if (matchedDigraph) continue;
    const ch = lower[i];
    out += ROMAN_SINGLE[ch] !== undefined ? ROMAN_SINGLE[ch] : text[i];
    i++;
  }
  return out;
}

export function toOlChikiAuto(text: string): string {
  if (!text) return '';
  // Already contains Ol Chiki characters
  if (/[\u1C50-\u1C7F]/.test(text)) return text;
  // Contains Devanagari script
  if (/[\u0900-\u097F]/.test(text)) return devanagariToOlChiki(text);
  return romanToOlChiki(text);
}

// ─── Reverse & Phonetic: Ol Chiki / Roman -> Santali Devanagari Lipi ───

const OL_CONSONANTS: Record<string, string> = {
  'ᱛ': 'त',
  'ᱜ': 'ग',
  'ᱝ': 'ङ',
  'ᱞ': 'ल',
  'ᱠ': 'क',
  'ᱡ': 'ज',
  'ᱢ': 'म',
  'ᱣ': 'व',
  'ᱥ': 'स',
  'ᱦ': 'ह',
  'ᱧ': 'ञ',
  'ᱨ': 'र',
  'ᱪ': 'च',
  'ᱫ': 'द',
  'ᱬ': 'ण',
  'ᱭ': 'य',
  'ᱯ': 'प',
  'ᱰ': 'ड',
  'ᱱ': 'न',
  'ᱲ': 'ड़',
  'ᱴ': 'ट',
  'ᱵ': 'ब'
};

const OL_VOWELS: Record<string, { standalone: string; matra: string }> = {
  'ᱚ': { standalone: 'अ', matra: 'ो' },
  'ᱟ': { standalone: 'आ', matra: 'ा' },
  'ᱤ': { standalone: 'इ', matra: 'ि' },
  'ᱩ': { standalone: 'उ', matra: 'ु' },
  'ᱮ': { standalone: 'ए', matra: 'े' },
  'ᱳ': { standalone: 'ओ', matra: 'ो' }
};

const OL_DIGITS_AND_PUNCT: Record<string, string> = {
  'ᱸ': 'ं',
  'ᱹ': '़',
  'ᱺ': 'ं',
  'ᱻ': '्',
  'ᱼ': '-',
  'ᱷ': 'ह',
  'ᱶ': 'ं',
  '᱾': '।',
  '᱿': '॥',
  '᱐': '०',
  '᱑': '१',
  '᱒': '२',
  '᱓': '३',
  '᱔': '४',
  '᱕': '५',
  '᱖': '६',
  '᱗': '७',
  '᱘': '८',
  '᱙': '९'
};

const ASPIRABLE_OL_PREFIX: Record<string, string> = {
  'क': 'ख',
  'ग': 'घ',
  'च': 'छ',
  'ज': 'झ',
  'ट': 'ठ',
  'ड': 'ढ',
  'त': 'थ',
  'द': 'ध',
  'प': 'फ',
  'ब': 'भ',
  'ड़': 'ढ़'
};

export function olChikiToDevanagari(text: string): string {
  if (!text) return '';
  let out = '';
  let prevWasConsonant = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    // Aspiration sign ᱷ merges with previous stop consonant when applicable
    if (ch === 'ᱷ' && prevWasConsonant && out.length > 0) {
      const lastTwo = out.slice(-2);
      if (ASPIRABLE_OL_PREFIX[lastTwo]) {
        out = out.slice(0, -2) + ASPIRABLE_OL_PREFIX[lastTwo];
        prevWasConsonant = true;
        continue;
      }
      const last = out.slice(-1);
      if (ASPIRABLE_OL_PREFIX[last]) {
        out = out.slice(0, -1) + ASPIRABLE_OL_PREFIX[last];
        prevWasConsonant = true;
        continue;
      }
    }

    if (OL_CONSONANTS[ch]) {
      out += OL_CONSONANTS[ch];
      prevWasConsonant = true;
      continue;
    }

    if (OL_VOWELS[ch]) {
      const v = OL_VOWELS[ch];
      if (prevWasConsonant) {
        out += v.matra;
      } else {
        out += v.standalone;
      }
      prevWasConsonant = false;
      continue;
    }

    if (OL_DIGITS_AND_PUNCT[ch] !== undefined) {
      out += OL_DIGITS_AND_PUNCT[ch];
      prevWasConsonant = false;
      continue;
    }

    out += ch;
    prevWasConsonant = false;
  }

  return out;
}

const ROMAN_DEV_VOWELS: Array<[string, string, string]> = [
  ['ai', 'ऐ', 'ै'],
  ['au', 'औ', 'ौ'],
  ['aa', 'आ', 'ा'],
  ['ee', 'ई', 'ी'],
  ['oo', 'ऊ', 'ू'],
  ['a', 'आ', 'ा'],
  ['ā', 'आ', 'ा'],
  ['i', 'इ', 'ि'],
  ['ī', 'ई', 'ी'],
  ['u', 'उ', 'ु'],
  ['ū', 'ऊ', 'ू'],
  ['e', 'ए', 'े'],
  ['ē', 'ए', 'े'],
  ['o', 'ओ', 'ो'],
  ['ō', 'ओ', 'ो'],
  ['ọ', 'अ', '']
];

const ROMAN_DEV_CONSONANTS: Array<[string, string]> = [
  ['chh', 'छ'],
  ['kh', 'ख'],
  ['gh', 'घ'],
  ['ch', 'च'],
  ['jh', 'झ'],
  ['th', 'थ'],
  ['dh', 'ध'],
  ['ph', 'फ'],
  ['bh', 'भ'],
  ['sh', 'श'],
  ['ng', 'ङ'],
  ['ny', 'ञ'],
  ['nh', 'ंह'],
  ['rh', 'ड़'],
  ['k', 'क'],
  ['g', 'ग'],
  ['c', 'च'],
  ['j', 'ज'],
  ['t', 'त'],
  ['ṭ', 'ट'],
  ['d', 'द'],
  ['ḍ', 'ड'],
  ['n', 'न'],
  ['ṇ', 'ण'],
  ['ñ', 'ञ'],
  ['ṅ', 'ङ'],
  ['p', 'प'],
  ['b', 'ब'],
  ['m', 'म'],
  ['y', 'य'],
  ['r', 'र'],
  ['ṛ', 'ड़'],
  ['l', 'ल'],
  ['w', 'व'],
  ['v', 'व'],
  ['s', 'स'],
  ['h', 'ह']
];

export function romanToDevanagari(text: string): string {
  if (!text) return '';
  const lower = text.toLowerCase();
  let out = '';
  let i = 0;
  let prevWasConsonant = false;

  while (i < lower.length) {
    const ch = lower[i];

    // Check glottal / checked apostrophe
    if ((ch === "'" || ch === '’') && prevWasConsonant) {
      out += '्';
      prevWasConsonant = false;
      i++;
      continue;
    }

    // Check vowels
    let matchedVowel = false;
    for (const [pat, standalone, matra] of ROMAN_DEV_VOWELS) {
      if (lower.startsWith(pat, i)) {
        if (prevWasConsonant) {
          out += matra;
        } else {
          out += standalone;
        }
        prevWasConsonant = false;
        i += pat.length;
        matchedVowel = true;
        break;
      }
    }
    if (matchedVowel) continue;

    // Check consonants
    let matchedCons = false;
    for (const [pat, dev] of ROMAN_DEV_CONSONANTS) {
      if (lower.startsWith(pat, i)) {
        out += dev;
        prevWasConsonant = true;
        i += pat.length;
        matchedCons = true;
        break;
      }
    }
    if (matchedCons) continue;

    // Passthrough punctuation/digits/whitespace
    out += text[i];
    prevWasConsonant = false;
    i++;
  }

  return out;
}

export function toDevanagariAuto(text: string): string {
  if (!text) return '';
  const hasOlChiki = /[\u1C50-\u1C7F]/.test(text);
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);

  if (hasOlChiki && !hasDevanagari && !hasLatin) {
    return olChikiToDevanagari(text);
  }
  if (hasOlChiki) {
    // Convert Ol Chiki segments while keeping existing Devanagari/punctuation intact
    return text.replace(/[\u1C50-\u1C7F]+/g, (seg) => olChikiToDevanagari(seg));
  }
  if (hasDevanagari) {
    return text;
  }
  return romanToDevanagari(text);
}

