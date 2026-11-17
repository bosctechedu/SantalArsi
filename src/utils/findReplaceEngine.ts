export interface FindReplaceOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  useRegex: boolean;
}

export interface CompiledSearch {
  regex: RegExp | null;
  error: string | null;
}

export interface HighlightSegment {
  text: string;
  isMatch: boolean;
}

export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function compileSearchRegex(
  query: string,
  options: FindReplaceOptions
): CompiledSearch {
  if (!query) {
    return { regex: null, error: null };
  }

  let pattern = options.useRegex ? query : escapeRegExp(query);

  if (options.wholeWord) {
    // Unicode letter + combining mark boundary so Devanagari matras & Latin words match cleanly
    pattern = `(?<![\\p{L}\\p{M}\\p{N}_])(?:${pattern})(?![\\p{L}\\p{M}\\p{N}_])`;
  }

  const flags = options.caseSensitive ? 'gu' : 'giu';

  try {
    const regex = new RegExp(pattern, flags);
    // Guard against zero-length infinite matches
    if (regex.test('')) {
      return {
        regex: null,
        error: 'यह पैटर्न खाली टेक्स्ट से मेल खा रहा है — कृपया अधिक स्पष्ट शब्द लिखें।'
      };
    }
    regex.lastIndex = 0;
    return { regex, error: null };
  } catch {
    try {
      // Fallback without lookbehind if an older browser lacks Unicode lookbehind
      const fallbackPattern = options.wholeWord ? `\\b(?:${options.useRegex ? query : escapeRegExp(query)})\\b` : (options.useRegex ? query : escapeRegExp(query));
      const fallbackRegex = new RegExp(fallbackPattern, options.caseSensitive ? 'g' : 'gi');
      return { regex: fallbackRegex, error: null };
    } catch (err) {
      return {
        regex: null,
        error: err instanceof Error ? `अमान्य Regex पैटर्न: ${err.message}` : 'अमान्य Regex पैटर्न'
      };
    }
  }
}

export function countMatchesInText(text: string, regex: RegExp | null): number {
  if (!text || !regex) return 0;
  const fresh = new RegExp(regex.source, regex.flags);
  let count = 0;
  let guard = 0;
  let m: RegExpExecArray | null;
  while ((m = fresh.exec(text)) !== null) {
    count++;
    if (m[0].length === 0) {
      fresh.lastIndex++;
    }
    guard++;
    if (guard > 5000) break;
  }
  return count;
}

export function applyTextReplace(
  text: string,
  regex: RegExp | null,
  replaceWith: string,
  useRegex: boolean
): string {
  if (!text || !regex) return text;
  const fresh = new RegExp(regex.source, regex.flags);
  if (useRegex) {
    return text.replace(fresh, replaceWith);
  }
  // Literal replacement so "$" sequences in replaceWith aren't interpreted as capture groups
  return text.replace(fresh, () => replaceWith);
}

export function splitHighlightSegments(
  text: string,
  regex: RegExp | null,
  maxSegments = 120
): HighlightSegment[] {
  if (!text) return [];
  if (!regex) return [{ text, isMatch: false }];

  const fresh = new RegExp(regex.source, regex.flags);
  const segments: HighlightSegment[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = fresh.exec(text)) !== null) {
    if (m.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, m.index), isMatch: false });
    }
    const matchedStr = m[0];
    if (matchedStr.length > 0) {
      segments.push({ text: matchedStr, isMatch: true });
      lastIndex = m.index + matchedStr.length;
    } else {
      fresh.lastIndex++;
    }
    if (segments.length >= maxSegments) break;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), isMatch: false });
  }

  return segments.length > 0 ? segments : [{ text, isMatch: false }];
}
