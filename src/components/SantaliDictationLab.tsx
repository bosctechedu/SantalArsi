import React, { useState } from 'react';
import { Headphones, Volume2, CheckCircle2, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface DictationItem {
  id: string;
  level: 'word' | 'sentence';
  devanagari: string;
  roman: string;
  hindiMeaning: string;
}

const DICTATION_BANK: DictationItem[] = [
  { id: 'd1', level: 'word', devanagari: 'जोहार', roman: 'johar', hindiMeaning: 'नमस्कार / अभिवादन' },
  { id: 'd2', level: 'word', devanagari: 'दाक्', roman: 'dak', hindiMeaning: 'पानी' },
  { id: 'd3', level: 'word', devanagari: 'सिंगि', roman: 'singi', hindiMeaning: 'सूर्य / दिन' },
  { id: 'd4', level: 'word', devanagari: 'बुरु', roman: 'buru', hindiMeaning: 'पहाड़ / पर्वत' },
  { id: 'd5', level: 'word', devanagari: 'ओड़ाक्', roman: 'orak', hindiMeaning: 'घर' },
  { id: 'd6', level: 'word', devanagari: 'जाहेर थान', roman: 'jaher than', hindiMeaning: 'पवित्र पूजा वन' },
  { id: 'd7', level: 'sentence', devanagari: 'चेत् लेका मेनामा', roman: 'chet leka menama', hindiMeaning: 'आप कैसे हैं?' },
  { id: 'd8', level: 'sentence', devanagari: 'इञ दो भोगे गेया', roman: 'in do bhoge geya', hindiMeaning: 'मैं ठीक हूँ।' },
  { id: 'd9', level: 'sentence', devanagari: 'आले हातु रे सोहराय परब', roman: 'ale hatu re sohrai parab', hindiMeaning: 'हमारे गांव में सोहराय पर्व।' },
  { id: 'd10', level: 'sentence', devanagari: 'दारे रोहोय तायोन मा', roman: 'dare rohoy tayon ma', hindiMeaning: 'पेड़ लगाते रहें।' }
];

export const SantaliDictationLab: React.FC = () => {
  const [scriptMode, setScriptMode] = useState<'roman' | 'devanagari'>('devanagari');
  const [idx, setIdx] = useState<number>(0);
  const [slowMode, setSlowMode] = useState<boolean>(false);
  const [userText, setUserText] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<{ right: number; total: number }>({ right: 0, total: 0 });

  const item = DICTATION_BANK[idx];
  const expected = (scriptMode === 'roman' ? item.roman : item.devanagari).trim();

  const handlePlayAudio = () => {
    const textToSpeak = scriptMode === 'roman' ? item.roman : item.devanagari;
    speakWithFemaleVoice(textToSpeak, { lang: 'hi-IN', rate: slowMode ? 0.68 : 0.92 });
  };

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[।.,!?'"`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const isExactMatch = normalize(userText) === normalize(expected);

  const handleCheck = () => {
    if (!userText.trim() || checked) return;
    setChecked(true);
    setScore((prev) => ({
      right: prev.right + (isExactMatch ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNext = (nextIdx?: number) => {
    const targetIdx = nextIdx !== undefined ? nextIdx : (idx + 1) % DICTATION_BANK.length;
    setIdx(targetIdx);
    setUserText('');
    setChecked(false);
    setShowHint(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
              <Headphones className="w-4 h-4" />
              <span>संताली श्रुतलेख व वर्तनी अभ्यास (Dictation Lab)</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              सुनें और लिखें — संताली श्रुतलेख प्रयोगशाला
            </h1>
            <p className="text-sm text-slate-600">
              पहले ऑडियो सुनें, फिर सुने हुए संताली शब्द या वाक्य को देवनागरी या रोमन में लिखकर अपनी वर्तनी जांचें।
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-slate-500">सही श्रुतलेख स्कोर</div>
            <div className="text-xl font-mono tabular-nums font-bold text-emerald-700">
              {score.right} / {score.total}
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => {
                  setScriptMode('roman');
                  setUserText('');
                  setChecked(false);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                  scriptMode === 'roman' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Roman लिपि अभ्यास
              </button>
              <button
                onClick={() => {
                  setScriptMode('devanagari');
                  setUserText('');
                  setChecked(false);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                  scriptMode === 'devanagari' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                देवनागरी लिपि अभ्यास
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setSlowMode((s) => !s)}
                className={`px-3 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                  slowMode
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                गति: {slowMode ? 'धीमी (0.68x)' : 'सामान्य (0.92x)'}
              </button>
              <button
                onClick={() => setShowHint((h) => !h)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {showHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showHint ? 'अर्थ छुपाएं' : 'हिन्दी अर्थ देखें'}</span>
              </button>
            </div>
          </div>

          {/* Audio Play Card */}
          <div className="p-6 bg-gradient-to-r from-sky-50 via-white to-amber-50 border border-sky-200 text-slate-900 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs text-slate-600 font-semibold">
                अभ्यास #{idx + 1} / {DICTATION_BANK.length} ·{' '}
                {item.level === 'word' ? 'शब्द अभ्यास' : 'वाक्य अभ्यास'}
              </div>
              <div className="text-lg font-bold text-amber-900">
                {showHint ? `हिन्दी संकेत: ${item.hindiMeaning}` : 'ऑडियो चलाकर ध्यान से सुनें'}
              </div>
            </div>

            <button
              onClick={handlePlayAudio}
              className="px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
            >
              <Volume2 className="w-5 h-5" />
              <span>सुनें (Play Audio)</span>
            </button>
          </div>

          {/* Input & Evaluation */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 block">
              सुना हुआ संताली पाठ यहाँ लिखें ({scriptMode === 'roman' ? 'Roman में' : 'देवनागरी में'}):
            </label>
            <input
              type="text"
              value={userText}
              onChange={(e) => {
                setUserText(e.target.value);
                if (checked) setChecked(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCheck();
              }}
              placeholder={scriptMode === 'roman' ? 'उदाहरण: johar' : 'उदाहरण: जोहार'}
              className="w-full px-4 py-3 text-base font-mono bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCheck}
                  disabled={!userText.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>जाँच करें (Check)</span>
                </button>
                <button
                  onClick={() => {
                    setUserText('');
                    setChecked(false);
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>साफ़ करें</span>
                </button>
              </div>

              <button
                onClick={() => handleNext()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                अगला शब्द / वाक्य →
              </button>
            </div>
          </div>

          {checked && (
            <div
              className={`p-4 rounded-xl border text-sm space-y-1 ${
                isExactMatch
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="font-bold">
                {isExactMatch ? 'उत्कृष्ट! आपकी वर्तनी बिल्कुल सही है।' : 'सही उत्तर देखें:'}
              </div>
              <div className="text-xs space-y-0.5">
                <p>
                  सही रूप ({scriptMode === 'roman' ? 'Roman' : 'देवनागरी'}):{' '}
                  <span className="font-mono font-bold text-slate-900">{expected}</span>
                </p>
                <p>
                  दूसरी लिपि: <span className="font-semibold">{scriptMode === 'roman' ? item.devanagari : item.roman}</span> · अर्थ: {item.hindiMeaning}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
