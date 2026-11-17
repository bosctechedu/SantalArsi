import React, { useState } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { Award, Volume2, Square, Printer, Download } from 'lucide-react';

const REMARK_PRESETS = [
  'पाड़हाव आर ओल चिकी रे आडी मोज़ (पढ़ाई व लेखन अति उत्तम)।',
  'संताली देवनागरी उच्चारण बोगी मेनाक्-आ (उच्चारण बहुत अच्छा है)।',
  'नियमित इस्कूल हाजिरी आर मेहनत जरुड़-आ (नियमित उपस्थिति व अभ्यास आवश्यक)।'
];

export const SantaliReportCardMaker: React.FC = () => {
  const [school, setSchool] = useState('उत्क्रमित मध्य विद्यालय, भोगनाडीह');
  const [studentName, setStudentName] = useState('बिरसा मुर्मू');
  const [className, setClassName] = useState('कक्षा ६');
  const [attendance, setAttendance] = useState('82 / 90 दिन');
  const [santaliScore, setSantaliScore] = useState(88);
  const [hindiScore, setHindiScore] = useState(84);
  const [mathScore, setMathScore] = useState(79);
  const [remark, setRemark] = useState(REMARK_PRESETS[0]);

  const total = santaliScore + hindiScore + mathScore;
  const pct = Math.round((total / 300) * 100);
  const grade = pct >= 85 ? 'A+ (उत्कृष्ट)' : pct >= 70 ? 'A (अति उत्तम)' : pct >= 50 ? 'B (संतोषजनक)' : 'C (सुधार आवश्यक)';

  const downloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(school, 55, 82);
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText('संताली-हिन्दी विद्यार्थी प्रगति-पत्र (Report Card)', 55, 130);

    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`नाम: ${studentName}   |   कक्षा: ${className}   |   उपस्थिति: ${attendance}`, 55, 195);

    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(55, 225, 850, 210);
    ctx.fillStyle = '#0F172A';
    ctx.fillText(`१. संताली देवनागरी व ओल चिकी: ${santaliScore} / 100`, 80, 275);
    ctx.fillText(`२. हिन्दी भाषा: ${hindiScore} / 100`, 80, 325);
    ctx.fillText(`३. गणित (लेखा-जोखा): ${mathScore} / 100`, 80, 375);
    ctx.fillStyle = '#047857';
    ctx.fillText(`कुल योग: ${total} / 300 (${pct}%) — ग्रेड: ${grade}`, 80, 420);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`शिक्षक टिप्पणी: ${remark}`, 55, 495);
    ctx.fillStyle = '#92400E';
    ctx.fillText(toOlChikiAuto(remark), 55, 540);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${studentName.replace(/\s+/g, '_')}_report_card.png`;
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <span>छात्र उपस्थिति व प्रगति-पत्र (Report Card Maker)</span>
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-0.5">
            संताली-हिन्दी विद्यार्थी अंक-तालिका व शिक्षक टिप्पणी स्टूडियो
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() =>
              speakWithFemaleVoice(
                `${studentName}, ${className}. कुल अंक ${total} यानी ${pct} प्रतिशत। ${remark}`,
                { autoDetectLanguage: true }
              )
            }
            className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>रिपोर्ट सुनें</span>
          </button>
          <button
            type="button"
            onClick={stopSpeaking}
            className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs print:hidden">
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="विद्यालय का नाम"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="छात्र नाम"
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
            />
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="कक्षा"
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
            />
            <input
              type="text"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
              placeholder="उपस्थिति"
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold tabular-nums"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 tabular-nums">
            <div>
              <label className="font-bold text-slate-600 block mb-1">संताली अंक</label>
              <input
                type="number"
                min={0}
                max={100}
                value={santaliScore}
                onChange={(e) => setSantaliScore(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">हिन्दी अंक</label>
              <input
                type="number"
                min={0}
                max={100}
                value={hindiScore}
                onChange={(e) => setHindiScore(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">गणित अंक</label>
              <input
                type="number"
                min={0}
                max={100}
                value={mathScore}
                onChange={(e) => setMathScore(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-600 block">शिक्षक टिप्पणी चुनें या लिखें</label>
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
            />
            <div className="flex flex-wrap gap-1.5">
              {REMARK_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRemark(p)}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] font-semibold cursor-pointer"
                >
                  टिप्पणी {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-amber-300 p-5 shadow-xs space-y-4">
          <div className="border-b border-amber-100 pb-3">
            <p className="text-[11px] font-bold uppercase text-amber-800">{school}</p>
            <h3 className="text-lg font-black text-slate-900">त्रैमासिक प्रगति-पत्र</h3>
            <p className="text-xs text-slate-600 mt-1">
              विद्यार्थी: <strong>{studentName}</strong> · {className} · उपस्थिति: {attendance}
            </p>
          </div>

          <div className="space-y-1.5 text-xs tabular-nums">
            <div className="flex justify-between p-2 rounded-lg bg-slate-50">
              <span>संताली (देवनागरी व ओल चिकी)</span>
              <strong>{santaliScore} / 100</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50">
              <span>हिन्दी भाषा</span>
              <strong>{hindiScore} / 100</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50">
              <span>गणित</span>
              <strong>{mathScore} / 100</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 font-black text-emerald-900">
              <span>कुल योग ({pct}%)</span>
              <span>{total} / 300 · {grade}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
            <p className="text-xs font-bold text-slate-900">{remark}</p>
            <p className="text-xs font-bold text-amber-800">{toOlChikiAuto(remark)}</p>
          </div>

          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              type="button"
              onClick={downloadPng}
              className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>कार्ड PNG</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट (A4)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
