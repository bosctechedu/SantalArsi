import React, { useState, useEffect, useRef } from 'react';
import { Radio, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface BulletinPreset {
  id: string;
  label: string;
  script: string;
}

const BULLETIN_PRESETS: BulletinPreset[] = [
  {
    id: 'morning',
    label: 'प्रभात ग्राम समाचार',
    script:
      'जोहार! सागुन सेताक्! Santal आ़रसी आकाशवाणी खबर रे जोतो गाते को सागुन दाराम।\n\nतेहेञाः माराङ खबोर: भोगनाडीह आर दुमका इलाके रे किसान को एरोक सिम खोन पाछे रोपा ला़गित् खेत तेयार एहोब अकादा।\n\nमांझी परगना बैसी पाहाटा खोन सनाम हातु रे दारे रोहोय आ़र जाहेर थान साफा दोहो ला़गित् नेहोरा मेनाः आ।\n\nधोरोम आर भाषा मानोत दोहो ताबोन पे। जोहार!'
  },
  {
    id: 'agri_weather',
    label: 'कृषि व मौसम सलाह',
    script:
      'जोहार किसान गाते को!\n\nचास आ़र मौसम खबोर: आनेच दो रिमझिम दाः हिजुः रेयाः सोम्भाबना मेनाः आ। नोवा ऑक्तो रे धान आर बाजरा खेत्र रे आहर-पइन दाः डाहार साफा दोहो पे।\n\nगोहाल रे गोरु-डांगरा को ला़गित् सुखा घाँस आर साफ दाः रेयाः बोन्दोबोस्त दोहो ताबोन पे। जोहार!'
  },
  {
    id: 'festival_notice',
    label: 'हूल व पर्व घोषणा',
    script:
      'जोहार हातु होड़ को!\n\nगापा सेताक् ८ बाजे अखड़ा रे पारंपरिक सभा आर लोक-सेरेंग जुगलबंदी होयोक् आ। सिदो-कान्हू, चांद-भैरव आर फूलो-झानो रेयाः बीर गाथा सेरेञ ते याद होयोक् आ।\n\nजोतो गिदरा, आयो-बाबा आर जुवान को सोंगे ते हिजुः तायोन मा। सागुन जोहार!'
  }
];

export const SantaliNewsTeleprompter: React.FC = () => {
  const [presetId, setPresetId] = useState<string>('morning');
  const [scriptText, setScriptText] = useState<string>(BULLETIN_PRESETS[0].script);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(3);
  const [fontSize, setFontSize] = useState<number>(26);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isScrolling) return;
    const interval = setInterval(() => {
      if (stageRef.current) {
        stageRef.current.scrollTop += scrollSpeed * 0.7;
      }
    }, 35);
    return () => clearInterval(interval);
  }, [isScrolling, scrollSpeed]);

  const handleSelectPreset = (id: string) => {
    const found = BULLETIN_PRESETS.find((p) => p.id === id);
    if (!found) return;
    setPresetId(id);
    setScriptText(found.script);
    setIsScrolling(false);
    if (stageRef.current) stageRef.current.scrollTop = 0;
  };

  const resetScroll = () => {
    setIsScrolling(false);
    if (stageRef.current) stageRef.current.scrollTop = 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-800">
              <Radio className="w-4 h-4" />
              <span>कम्युनिटी रेडियो, यूट्यूब व स्कूल समाचार टेलीप्रॉम्प्टर</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              संताली समाचार व उद्घोषणा टेलीप्रॉम्प्टर स्टूडियो
            </h1>
            <p className="text-sm text-slate-600">
              रेडियो बुलेटिन, मंच घोषणा या वीडियो रिकॉर्डिंग के लिए स्क्रॉलिंग स्क्रीन पर अपनी गति से संताली समाचार पढ़ें।
            </p>
          </div>
          <button
            onClick={() => speakWithFemaleVoice(scriptText, { lang: 'hi-IN', rate: 0.9 })}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-sky-300" />
            <span>ऑडियो प्रीव्यू सुनें</span>
          </button>
        </div>

        {/* Presets & Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {BULLETIN_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                    presetId === p.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsScrolling((s) => !s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer text-white ${
                  isScrolling ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {isScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isScrolling ? 'रोकें (Pause)' : 'स्क्रॉल शुरू करें'}</span>
              </button>
              <button
                onClick={resetScroll}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>शुरू पर लाएँ</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-between gap-3 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200">
              <label className="font-semibold text-slate-700">स्क्रॉल गति: {scrollSpeed}x</label>
              <input
                type="range"
                min={1}
                max={8}
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="w-40 accent-sky-600"
              />
            </div>
            <div className="flex items-center justify-between gap-3 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200">
              <label className="font-semibold text-slate-700">अक्षर आकार: {fontSize}px</label>
              <input
                type="range"
                min={18}
                max={40}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-40 accent-sky-600"
              />
            </div>
          </div>
        </div>

        {/* Teleprompter Stage */}
        <div
          ref={stageRef}
          className="h-72 overflow-y-auto bg-amber-50/40 text-slate-900 rounded-2xl border-2 border-amber-200 p-6 md:p-8 leading-relaxed shadow-inner"
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="whitespace-pre-wrap font-semibold pb-36">{scriptText}</div>
        </div>

        {/* Editable Script Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            समाचार / उद्घोषणा स्क्रिप्ट संपादित करें (Custom Script Editor):
          </label>
          <textarea
            rows={5}
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
