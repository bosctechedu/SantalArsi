import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Download, RefreshCw, Volume2, Award, Sun, Moon } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface OlChikiChar {
  char: string;
  name: string;
  devanagariEquiv: string;
  romanPhonetic: string;
  meaning: string;
  strokeHint: string;
}

const OL_CHIKI_CHARS: OlChikiChar[] = [
  // Row 1 (La family)
  { char: 'ᱚ', name: 'La (ओल)', devanagariEquiv: 'अ / ऑ', romanPhonetic: 'O / Aw', meaning: 'जलती हुई अग्नि व मुड़े होंठ', strokeHint: 'ऊपर से गोल घुमाकर नीचे लाएँ' },
  { char: 'ᱛ', name: 'At', devanagariEquiv: 'त', romanPhonetic: 'T', meaning: 'पृथ्वी की गोल मेड़ व आधार', strokeHint: 'ऊपर से नीचे सीधी रेखा फिर बायाँ वक्र' },
  { char: 'ᱜ', name: 'Ag', devanagariEquiv: 'ग', romanPhonetic: 'G', meaning: 'उल्टी कुल्हाड़ी का सिरा', strokeHint: 'बाएँ से दाएँ अर्धवृत्त बनाएँ' },
  { char: 'ᱝ', name: 'Ang', devanagariEquiv: 'ङ (अनुस्वार)', romanPhonetic: 'Ng', meaning: 'पक्षी की चोंच', strokeHint: 'ऊपर की ओर तिरछा स्ट्रोक खींचें' },
  { char: 'ᱞ', name: 'Al', devanagariEquiv: 'ल', romanPhonetic: 'L', meaning: 'झरने का गिरता जल प्रवाह', strokeHint: 'ऊपर से नीचे लहराती रेखा बनाएँ' },

  // Row 2 (Aa family)
  { char: 'ᱟ', name: 'Aak (आ)', devanagariEquiv: 'आ', romanPhonetic: 'Aa', meaning: 'फावड़ा चलाते किसान का हाथ', strokeHint: 'गोल वृत्त बनाकर दाएँ लकीर खींचें' },
  { char: 'ᱠ', name: 'Aak (क)', devanagariEquiv: 'क', romanPhonetic: 'K', meaning: 'पक्षी का खुला पंख', strokeHint: 'खड़ी रेखा पर दो छोटे वक्र जोड़ें' },
  { char: 'ᱡ', name: 'Aaj', devanagariEquiv: 'ज', romanPhonetic: 'J', meaning: 'बैठने का पारंपरिक पीढ़ा', strokeHint: 'नीचे क्षैतिज रेखा और ऊपर चाप' },
  { char: 'ᱢ', name: 'Aam', devanagariEquiv: 'म', romanPhonetic: 'M', meaning: 'मुस्कुराता हुआ चेहरा', strokeHint: 'दो जुड़े हुए अर्धवृत्त बनाएँ' },
  { char: 'ᱣ', name: 'Aaw', devanagariEquiv: 'व', romanPhonetic: 'W', meaning: 'उड़ता हुआ धनुष-बाण', strokeHint: 'तिरछी रेखा के साथ नुकीला सिरा' },

  // Row 3 (I family)
  { char: 'ᱤ', name: 'Is (इ)', devanagariEquiv: 'इ', romanPhonetic: 'I', meaning: 'हँसी व प्रसन्नता की लकीर', strokeHint: 'ऊपर से नीचे सीधी लकीर व मोड़' },
  { char: 'ᱥ', name: 'Is (स)', devanagariEquiv: 'स', romanPhonetic: 'S', meaning: 'धान काटने का हंसिया (दातरोम)', strokeHint: 'अर्धचंद्राकार घुमाव बनाएँ' },
  { char: 'ᱦ', name: 'Ih', devanagariEquiv: 'ह', romanPhonetic: 'H', meaning: 'हवा छोड़ता खुला मुँह', strokeHint: 'खुला दायाँ वक्र स्ट्रोक' },
  { char: 'ᱧ', name: 'Iny', devanagariEquiv: 'ञ', romanPhonetic: 'Ny', meaning: 'बैल के मुड़े हुए सींग', strokeHint: 'ऊपर से नीचे दोहरा घुमाव' },
  { char: 'ᱨ', name: 'Ir', devanagariEquiv: 'र', romanPhonetic: 'R', meaning: 'छलाँग लगाता हिरण', strokeHint: 'ऊपर दाएँ से नीचे बायाँ मोड़' },

  // Row 4 (U family)
  { char: 'ᱩ', name: 'Uch (उ)', devanagariEquiv: 'उ', romanPhonetic: 'U', meaning: 'गहरा कुआँ या जल पात्र', strokeHint: 'नीचे गहरा कटोरा आकार बनाएँ' },
  { char: 'ᱪ', name: 'Uch (च)', devanagariEquiv: 'च', romanPhonetic: 'Ch', meaning: 'लोहार का चिमटा', strokeHint: 'दो परस्पर मुड़े हुए छोर' },
  { char: 'ᱫ', name: 'Ud', devanagariEquiv: 'द', romanPhonetic: 'D', meaning: 'तुम्दाक् (मांदर) का गोल सिरा', strokeHint: 'बाएँ गोल सिरा और दाईं डंडी' },
  { char: 'ᱬ', name: 'Unn', devanagariEquiv: 'ण', romanPhonetic: 'Nn', meaning: 'घोड़े की नाल की आकृति', strokeHint: 'नीचे की ओर खुला गोल चाप' },
  { char: 'ᱭ', name: 'Uy', devanagariEquiv: 'य', romanPhonetic: 'Y', meaning: 'उछलता हुआ मेंढक', strokeHint: 'ऊपर उठता हुआ वक्र' },

  // Row 5 (E family)
  { char: 'ᱮ', name: 'Le (ए)', devanagariEquiv: 'ए', romanPhonetic: 'E', meaning: 'टेढ़ी-मेढ़ी पगडंडी', strokeHint: 'बाएँ से दाएँ लहराता घुमाव' },
  { char: 'ᱯ', name: 'Ep', devanagariEquiv: 'प', romanPhonetic: 'P', meaning: 'बच्चों के ताली बजाते हाथ', strokeHint: 'खड़ी रेखा के साथ छोटा गोल सिरा' },
  { char: 'ᱰ', name: 'Edd', devanagariEquiv: 'ड', romanPhonetic: 'Dd', meaning: 'खोखले पेड़ का तना', strokeHint: 'गोल वक्र और नीचे आधार रेखा' },
  { char: 'ᱱ', name: 'En', devanagariEquiv: 'न', romanPhonetic: 'N', meaning: 'खेत की समतल मेड़', strokeHint: 'सीधा खड़ा स्तंभ और क्षैतिज मोड़' },
  { char: 'ᱲ', name: 'Err', devanagariEquiv: 'ड़', romanPhonetic: 'Rr', meaning: 'लुढ़कता हुआ पहिया', strokeHint: 'सर्कल घुमाकर नीचे की ओर पूँछ' },

  // Row 6 (O family)
  { char: 'ᱳ', name: 'Lo (ओ)', devanagariEquiv: 'ओ', romanPhonetic: 'O (long)', meaning: 'मुँह से निकलती गोल ध्वनि', strokeHint: 'पूर्ण अंडाकार वक्र बनाएँ' },
  { char: 'ᱴ', name: 'Ott', devanagariEquiv: 'ट', romanPhonetic: 'Tt', meaning: 'ऊँट की मुड़ी गर्दन', strokeHint: 'ऊपर गोल मोड़ और सीधी डंडी' },
  { char: 'ᱵ', name: 'Ob', devanagariEquiv: 'ब', romanPhonetic: 'B', meaning: 'घुँघराले बालों की लट', strokeHint: 'बाएँ वक्र से गोल सिरा' },
  { char: 'ᱶ', name: 'Ov', devanagariEquiv: 'ँ (अनुनासिक)', romanPhonetic: 'V / Nasal', meaning: 'अनाज उड़ाने का सूप', strokeHint: 'अर्धगोलाकार सूप की आकृति' },
  { char: 'ᱷ', name: 'Oh (ह्)', devanagariEquiv: 'ह् (महाप्राण)', romanPhonetic: 'H (aspirated)', meaning: 'साँस बाहर छोड़ने का चिह्न', strokeHint: 'छोटा घुमावदार महाप्राण चिह्न' }
];

export const SantaliOlChikiPenmanshipWorkbook: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState<OlChikiChar>(OL_CHIKI_CHARS[0]);
  const [slateTheme, setSlateTheme] = useState<'light' | 'chalk'>('light');
  const [brushColor, setBrushColor] = useState<string>('#0f766e');
  const [brushSize, setBrushSize] = useState<number>(8);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [dottedGuide, setDottedGuide] = useState<boolean>(true);
  const [strokePoints, setStrokePoints] = useState<number>(0);
  const [completedLetters, setCompletedLetters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hor_katha_traced_ol_chiki');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isLight = slateTheme === 'light';
    ctx.fillStyle = isLight ? '#fffdf7' : '#1c1917';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Notebook lines
    ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    [90, 200, 310].forEach((y) => {
      ctx.beginPath();
      ctx.moveTo(28, y);
      ctx.lineTo(canvas.width - 28, y);
      ctx.stroke();
    });

    // Vertical center crosshair
    ctx.beginPath();
    ctx.setLineDash([6, 6]);
    ctx.moveTo(canvas.width / 2, 35);
    ctx.lineTo(canvas.width / 2, canvas.height - 35);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dotted / Solid Tracing Guide
    if (showWatermark) {
      ctx.font = 'bold 210px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (dottedGuide) {
        ctx.strokeStyle = isLight ? 'rgba(217, 119, 6, 0.45)' : 'rgba(45, 212, 191, 0.45)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.strokeText(selectedChar.char, canvas.width / 2, 205);
        ctx.setLineDash([]);
      } else {
        ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.11)' : 'rgba(255, 255, 255, 0.14)';
        ctx.fillText(selectedChar.char, canvas.width / 2, 205);
      }
    }
    setStrokePoints(0);
  };

  useEffect(() => {
    resetCanvas();
  }, [selectedChar, showWatermark, dottedGuide, slateTheme]);

  const getPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e, canvas);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setStrokePoints((prev) => {
      const next = prev + 1;
      if (next === 18 && !completedLetters.includes(selectedChar.char)) {
        const updated = [...completedLetters, selectedChar.char];
        setCompletedLetters(updated);
        try {
          localStorage.setItem('hor_katha_traced_ol_chiki', JSON.stringify(updated));
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  const stopDrawing = () => setIsDrawing(false);

  const downloadWorksheet = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `ol-chiki-slate-${selectedChar.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const speakPhonetic = () => {
    speakWithFemaleVoice(
      `${selectedChar.name}। देवनागरी ध्वनि ${selectedChar.devanagariEquiv}। ${selectedChar.meaning}`,
      { lang: 'hi-IN' }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Header Banner */}
        <header className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
              <PenTool className="w-4 h-4" />
              <span>ओल चिकी सुलेखन व बच्चों की उंगली स्लेट (All 30 Ol Chiki Letters)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Ol Chiki Finger Tracing Slate &amp; 30-Letter Penmanship Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              पंडित रघुनाथ मुर्मू द्वारा रचित ओल चिकी (ᱚᱞ ᱪᱤᱠᱤ) के सभी 30 मूल अक्षरों को बच्चों के लिए डॉटेड ट्रेसिंग गाइड और उंगली/माउस स्लेट पर लिखकर अभ्यास करें।
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs shrink-0">
            <div className="text-teal-800 font-semibold">अभ्यास पूर्ण अक्षर</div>
            <div className="text-lg font-black font-mono tabular-nums text-teal-950">
              {completedLetters.length} / {OL_CHIKI_CHARS.length} वर्ण
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Full 30-Letter Matrix & Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 text-xs font-bold text-slate-700">
                <span>सभी 30 ओल चिकी वर्ण चुनें</span>
                <span className="text-teal-700 font-mono">
                  {selectedChar.char} = {selectedChar.devanagariEquiv}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {OL_CHIKI_CHARS.map((item) => {
                  const isSelected = selectedChar.char === item.char;
                  const isDone = completedLetters.includes(item.char);
                  return (
                    <button
                      key={item.char}
                      onClick={() => setSelectedChar(item)}
                      className={`h-15 rounded-xl border flex flex-col items-center justify-center transition-colors relative cursor-pointer ${
                        isSelected
                          ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                          : isDone
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-300'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200'
                      }`}
                    >
                      <span className="text-xl font-bold leading-none">{item.char}</span>
                      <span className="text-[10px] opacity-80 mt-1 font-mono truncate max-w-full px-1">
                        {item.devanagariEquiv.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-4xl font-bold text-teal-800">{selectedChar.char}</span>
                  <span className="text-sm text-slate-800 font-bold ml-3">
                    {selectedChar.name} · {selectedChar.devanagariEquiv}
                  </span>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Roman Phonetic: {selectedChar.romanPhonetic}
                  </p>
                </div>
                <button
                  onClick={speakPhonetic}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                  <span>सुनें</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <strong className="text-slate-900 block mb-0.5">आकृति व अर्थ:</strong>
                {selectedChar.meaning}
              </div>
              <div className="text-xs text-amber-900 font-semibold bg-amber-50 p-3 rounded-xl border border-amber-200">
                लिखने की दिशा: {selectedChar.strokeHint}
              </div>
            </div>
          </div>

          {/* Right: Finger Tracing Canvas */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-semibold">स्याही:</span>
                {['#0f766e', '#d97706', '#0284c7', '#dc2626', '#1e293b'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setBrushColor(c)}
                    style={{ backgroundColor: c }}
                    aria-label={`Select color ${c}`}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                      brushColor === c ? 'border-slate-900 ring-2 ring-amber-400' : 'border-slate-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-semibold">मोटाई:</span>
                <input
                  type="range"
                  min="3"
                  max="16"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-20 accent-teal-600 cursor-pointer"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => {
                    const nextTheme = slateTheme === 'light' ? 'chalk' : 'light';
                    setSlateTheme(nextTheme);
                    if (nextTheme === 'chalk' && brushColor === '#1e293b') setBrushColor('#10b981');
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {slateTheme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                  <span>{slateTheme === 'light' ? 'ब्लैकबोर्ड' : 'सफेद पेपर'}</span>
                </button>

                <button
                  onClick={() => setDottedGuide((v) => !v)}
                  className={`px-2.5 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                    dottedGuide
                      ? 'bg-amber-50 border-amber-400 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {dottedGuide ? 'डॉटेड गाइड ✓' : 'सॉलिड गाइड'}
                </button>

                <button
                  onClick={() => setShowWatermark((v) => !v)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  {showWatermark ? 'गाइड छुपाएँ' : 'गाइड दिखाएँ'}
                </button>

                <button
                  onClick={resetCanvas}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>साफ़ करें</span>
                </button>

                <button
                  onClick={downloadWorksheet}
                  className="flex items-center gap-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PNG सेव</span>
                </button>
              </div>
            </div>

            <div className="flex justify-center touch-none">
              <canvas
                ref={canvasRef}
                width={520}
                height={400}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="rounded-xl shadow-sm cursor-crosshair border-2 border-slate-300 max-w-full h-auto"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500">
                मोबाइल पर उंगली या कंप्यूटर पर माउस से डॉटेड रेखाओं पर ट्रेस करें।
              </span>
              {strokePoints >= 18 && (
                <span className="text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>शाबाश! अक्षर अभ्यास दर्ज हो गया ✓</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
