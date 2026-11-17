import React, { useState, useMemo } from 'react';
import { CheckCircle2, AlertTriangle, Volume2, Sparkles, Copy, Check, RotateCcw } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface GrammarDiagnostic {
  id: string;
  ruleTitle: string;
  severity: 'correction' | 'tip';
  issueText: string;
  explanation: string;
  originalSnippet: string;
  replacementSnippet: string;
}

const SAMPLE_SENTENCES = [
  {
    label: 'गलत रुद्ध व्यंजन (दाक / ओड़ाक)',
    text: 'इञ दाक ञू काते ओड़ाक सेनोक् काना।'
  },
  {
    label: 'सर्वनाम व क्रिया प्रयोग (आबो vs आले)',
    text: 'आले सनाम गाते को तेहेञ बाहा परब बोन मानाव एदा।'
  },
  {
    label: 'संजीव-निर्जीव अस्तित्व क्रिया (मेनाक् vs मेनाया)',
    text: 'इञ रेन आयो ओड़ाक् रे मेनाक् आ।'
  },
  {
    label: 'सही उदाहरण (जाँच करें)',
    text: 'जोहार! आबो जोतो होड़ संताली काथा तेबोन रोपोड़ा।'
  }
];

function analyzeSantaliSentence(text: string): GrammarDiagnostic[] {
  const issues: GrammarDiagnostic[] = [];
  const trimmed = text.trim();
  if (!trimmed) return issues;

  if (/दाक(?!्)/.test(trimmed)) {
    issues.push({
      id: 'checked-dak',
      ruleTitle: 'रुद्ध कंठ ध्वनि (Checked Consonant)',
      severity: 'correction',
      issueText: '"दाक" के अंत में हलंत (क्) आवश्यक है।',
      explanation: 'संताली में पानी के लिए "दाक्" (Dak\') बोला जाता है जहाँ अंतिम "क" कंठ में रुका होता है।',
      originalSnippet: 'दाक',
      replacementSnippet: 'दाक्'
    });
  }

  if (/ओड़ाक(?!्)/.test(trimmed)) {
    issues.push({
      id: 'checked-orak',
      ruleTitle: 'रुद्ध कंठ ध्वनि (Checked Consonant)',
      severity: 'correction',
      issueText: '"ओड़ाक" के स्थान पर शुद्ध रूप "ओड़ाक्" (Orak\') लिखें।',
      explanation: 'घर के लिए संताली शब्द के अंत में अर्ध-उच्चारित क् लगता है।',
      originalSnippet: 'ओड़ाक',
      replacementSnippet: 'ओड़ाक्'
    });
  }

  if (/सेत(?!्)/.test(trimmed) && !/सेताक्/.test(trimmed)) {
    issues.push({
      id: 'checked-set',
      ruleTitle: 'रुद्ध कंठ ध्वनि (Checked "त्")',
      severity: 'correction',
      issueText: '"सेत" (कुत्ता/अवधि) में शुद्ध रुद्ध अंत "सेत्" होना चाहिए।',
      explanation: 'संताली की चार रुद्ध ध्वनियों (क्, च्, त्, प्) में हलंत अर्थ स्पष्ट करता है।',
      originalSnippet: 'सेत',
      replacementSnippet: 'सेत्'
    });
  }

  if (trimmed.includes('आले') && trimmed.includes('बोन')) {
    issues.push({
      id: 'pronoun-ale-bon',
      ruleTitle: 'समावेशी बनाम अपवर्जक सर्वनाम मेल',
      severity: 'correction',
      issueText: '"आले" (हम - श्रोता रहित) के साथ क्रिया चिन्ह "ले" आता है, "बोन" नहीं।',
      explanation: '"बोन" समावेशी सर्वनाम "आबो" के साथ लगता है। यदि श्रोता शामिल है तो "आबो" का प्रयोग करें।',
      originalSnippet: 'आले',
      replacementSnippet: 'आबो'
    });
  }

  if ((trimmed.includes('आयो') || trimmed.includes('बाबा') || trimmed.includes('गिदरा') || trimmed.includes('गाते')) && trimmed.includes('मेनाक्')) {
    issues.push({
      id: 'animacy-menak',
      ruleTitle: 'सजीव-निर्जीव (Animacy) क्रिया नियम',
      severity: 'correction',
      issueText: 'सजीव व्यक्ति (आयो/बाबा/गिदरा) के लिए "मेनाक्" नहीं बल्कि "मेनाया" या "मेनाः कोवा" प्रयुक्त होता है।',
      explanation: 'संताली व्याकरण में निर्जीव वस्तुओं के लिए "मेनाक् आ" और सजीव प्राणियों के लिए "मेनाया / मेनाक् कोवा" आता है।',
      originalSnippet: 'मेनाक् आ',
      replacementSnippet: 'मेनाया'
    });
  }

  if (/\bdak\b/i.test(trimmed) && !trimmed.includes("dak'")) {
    issues.push({
      id: 'roman-checked-dak',
      ruleTitle: 'Roman Checked Stop Marker',
      severity: 'tip',
      issueText: 'Roman लिपि में स्पष्ट उच्चारण हेतु "dak" को "dak\'" लिख सकते हैं।',
      explanation: 'Apostrophe (\') रुद्ध कंठ ध्वनि को दर्शाता है।',
      originalSnippet: 'dak',
      replacementSnippet: "dak'"
    });
  }

  return issues;
}

export const SantaliGrammarChecker: React.FC = () => {
  const [inputText, setInputText] = useState<string>(SAMPLE_SENTENCES[0].text);
  const [copied, setCopied] = useState<boolean>(false);

  const diagnostics = useMemo(() => analyzeSantaliSentence(inputText), [inputText]);

  const applySingleFix = (orig: string, repl: string) => {
    setInputText((prev) => prev.replace(orig, repl));
  };

  const applyAllFixes = () => {
    let updated = inputText;
    for (const d of diagnostics) {
      updated = updated.replace(d.originalSnippet, d.replacementSnippet);
    }
    setInputText(updated);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-indigo-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>रोनौड़ वाक्य विश्लेषण · Santali Sentence Proofreader</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              संताली वाक्य-सुधार व व्याकरण जांच लैब
            </h1>
            <p className="text-sm text-slate-600">
              सजीव-निर्जीव क्रिया भेद, समावेशी सर्वनाम (आबो/आले) और रुद्ध कंठ ध्वनियों (क्, च्, त्, प्) की लाइव जांच एवं सुधार।
            </p>
          </div>

          <button
            onClick={() => speakWithFemaleVoice(inputText, { lang: 'hi-IN', rate: 0.88 })}
            disabled={!inputText.trim()}
            className="min-h-[44px] px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-indigo-300" />
            <span>वाक्य सुनें</span>
          </button>
        </div>

        {/* Preset Test Examples */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">उदाहरण चुनें:</span>
          {SAMPLE_SENTENCES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(sample.text)}
              className="min-h-[40px] px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {/* Two-Column Analyzer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Sentence Input Box */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-800">संताली वाक्य लिखें या संपादित करें</span>
              <span className="font-mono tabular-nums">{inputText.length} अक्षर</span>
            </div>

            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="संताली देवनागरी या Roman में वाक्य लिखें..."
              className="w-full p-4 text-base bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!inputText.trim()}
                  className="min-h-[44px] px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'कॉपी हो गया' : 'वाक्य कॉपी करें'}</span>
                </button>
                <button
                  onClick={() => setInputText('')}
                  className="min-h-[44px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>साफ़ करें</span>
                </button>
              </div>

              {diagnostics.length > 0 && (
                <button
                  onClick={applyAllFixes}
                  className="min-h-[44px] px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  सभी सुधार लागू करें ({diagnostics.length})
                </button>
              )}
            </div>
          </div>

          {/* Right: Grammar Diagnostic Cards */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">व्याकरण जाँच परिणाम</h2>
              <span className="font-mono tabular-nums text-xs font-bold text-slate-600">
                {diagnostics.length} सुझाव
              </span>
            </div>

            {!inputText.trim() ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                विश्लेषण देखने के लिए बाएँ बॉक्स में संताली वाक्य लिखें।
              </p>
            ) : diagnostics.length === 0 ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>वाक्य व्याकरण की दृष्टि से शुद्ध है!</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  इस वाक्य में कोई प्रमुख वर्तनी, सर्वनाम मेल या सजीव-निर्जीव क्रिया त्रुटि नहीं मिली।
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {diagnostics.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{d.ruleTitle}</span>
                    </div>
                    <div className="font-semibold text-slate-900">{d.issueText}</div>
                    <p className="text-slate-600 leading-relaxed">{d.explanation}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-amber-200/70">
                      <span className="font-mono text-slate-700">
                        {d.originalSnippet} → <strong className="text-emerald-800">{d.replacementSnippet}</strong>
                      </span>
                      <button
                        onClick={() => applySingleFix(d.originalSnippet, d.replacementSnippet)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        सुधारें
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
