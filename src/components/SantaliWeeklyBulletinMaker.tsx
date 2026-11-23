import React, { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toDevanagariAuto, toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  Newspaper,
  Volume2,
  Square,
  Download,
  Printer,
  RefreshCw
} from 'lucide-react';

export const SantaliWeeklyBulletinMaker: React.FC = () => {
  const { words } = useAdmin();

  const [orgName, setOrgName] = useState('आदर्श अतु-सभा आर संताली आसड़ा, दुमका');
  const [issueLabel, setIssueLabel] = useState(`साप्ताहिक अंक #14 · ${new Date().toLocaleDateString('hi-IN')}`);
  const [headline, setHeadline] = useState('ओल चिकी आर संताली देवनागरी साक्षरता माहा एहोप् एना');
  const [leadStory, setLeadStory] = useState(
    'तेहेञ खोन अतु अखड़ा आर आसड़ा रे गिद्रा आर जुवान को लागीत् संताली पाड़हाव, देवनागरी व ओल चिकी ओल आर काथा सेरेञ सत्र हुयुक्-आ। सानाम आयो-बाबा गिद्रा को समय रे कुल कोपे।'
  );
  const [noticeOne, setNoticeOne] = useState('रविवार सेताक् 8 बजे: जाहेर थान सफा आर दारे रोहोय कामी (पौधरोपण)।');
  const [noticeTwo, setNoticeTwo] = useState('बुधवार आयुप् 4 बजे: साप्ताहिक संताली साबाद आर कुदुम पहेली हपाराव।');
  const [noticeThree, setNoticeThree] = useState('अतु खबर: नावा पुथी ओड़ाक् नाम ओल लागीत् मांझी थान रे ञापाम पे।');
  const [wordOffset, setWordOffset] = useState(0);

  const featuredWord = useMemo(() => {
    if (!words.length) return null;
    const pool = words.slice(0, Math.min(words.length, 200));
    return pool[wordOffset % pool.length];
  }, [words, wordOffset]);

  const handleDownloadBulletinPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1560;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 8;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(32, 32, canvas.width - 64, 150);

    ctx.fillStyle = '#FDE68A';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(issueLabel, 600, 82);

    const devOrg = toDevanagariAuto(orgName);
    const devHeadline = toDevanagariAuto(headline);
    const devLead = toDevanagariAuto(leadStory);
    const devNotices = [noticeOne, noticeTwo, noticeThree].map((n) => toDevanagariAuto(n));

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(devOrg, 600, 138);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText(devHeadline.slice(0, 48), 72, 260);
    if (devHeadline.length > 48) {
      ctx.fillText(devHeadline.slice(48, 96), 72, 310);
    }

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(toOlChikiAuto(devHeadline).slice(0, 56), 72, 365);

    ctx.fillStyle = '#334155';
    ctx.font = '500 24px sans-serif';
    const lines = devLead.match(/.{1,68}/g) || [devLead];
    lines.slice(0, 6).forEach((line, idx) => {
      ctx.fillText(line.trim(), 72, 435 + idx * 38);
    });

    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(72, 700, canvas.width - 144, 320);
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.strokeRect(72, 700, canvas.width - 144, 320);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('प्रमुख सूचनाएँ व कार्यक्रम समय-सारिणी:', 100, 755);

    ctx.font = '600 22px sans-serif';
    ctx.fillStyle = '#1E293B';
    devNotices.forEach((n, idx) => {
      ctx.fillText(`• ${n.slice(0, 72)}`, 100, 815 + idx * 62);
    });

    if (featuredWord) {
      const devFeatured = toDevanagariAuto(featuredWord.wordDevanagari || featuredWord.wordRoman);
      ctx.fillStyle = '#FFFBEB';
      ctx.fillRect(72, 1065, canvas.width - 144, 240);
      ctx.strokeStyle = '#F59E0B';
      ctx.strokeRect(72, 1065, canvas.width - 144, 240);

      ctx.fillStyle = '#92400E';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('सप्ताह का संताली शब्द (देवनागरी + ओल चिकी)', 100, 1112);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 42px sans-serif';
      ctx.fillText(
        `${devFeatured}  ·  ${toOlChikiAuto(devFeatured)}  (${featuredWord.wordRoman})`,
        100,
        1178
      );

      ctx.fillStyle = '#334155';
      ctx.font = '600 24px sans-serif';
      ctx.fillText(`अर्थ: ${featuredWord.meaningHindi} / ${featuredWord.meaningEnglish}`, 100, 1245);
    }

    ctx.fillStyle = '#64748B';
    ctx.font = '600 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Santal आ़रसी · सामुदायिक व विद्यालय साप्ताहिक समाचार-पत्र', 600, 1475);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `santali-weekly-bulletin-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-semibold text-slate-700">
            ग्राम सभा व विद्यालय सूचना-पट्ट · A4 ब्रॉडशीट लेआउट
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            साप्ताहिक संताली बुलेटिन व न्यूज़लेटर निर्माता
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            स्कूल, कॉलेज या ग्राम पंचायत के लिए संताली-हिन्दी साप्ताहिक सूचना-पत्र तैयार कर ऑडियो सुनें, प्रिंट करें या HD PNG डाउनलोड करें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${orgName}। ${headline}। ${leadStory}। ${noticeOne}। ${noticeTwo}। ${noticeThree}`,
                { autoDetectLanguage: true }
              )
            }
            className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>बुलेटिन सुनें</span>
          </button>
          <button
            onClick={() => stopSpeaking()}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <Square className="w-3.5 h-3.5" />
            <span>रोकें</span>
          </button>
          <button
            onClick={handleDownloadBulletinPng}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PNG डाउनलोड</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>A4 प्रिंट / PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Editor Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs print:hidden">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-amber-700" />
              <span>बुलेटिन सामग्री संपादित करें</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setOrgName((p) => toDevanagariAuto(p));
                setHeadline((p) => toDevanagariAuto(p));
                setLeadStory((p) => toDevanagariAuto(p));
                setNoticeOne((p) => toDevanagariAuto(p));
                setNoticeTwo((p) => toDevanagariAuto(p));
                setNoticeThree((p) => toDevanagariAuto(p));
              }}
              className="text-[11px] font-bold text-sky-800 hover:underline cursor-pointer"
            >
              देवनागरी लिपि में बदलें
            </button>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">संस्था / ग्राम सभा नाम</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">अंक व दिनांक</label>
            <input
              type="text"
              value={issueLabel}
              onChange={(e) => setIssueLabel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">मुख्य समाचार शीर्षक</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">मुख्य विवरण</label>
            <textarea
              rows={3}
              value={leadStory}
              onChange={(e) => setLeadStory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">सूचना 1</label>
            <input
              type="text"
              value={noticeOne}
              onChange={(e) => setNoticeOne(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">सूचना 2</label>
            <input
              type="text"
              value={noticeTwo}
              onChange={(e) => setNoticeTwo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">सूचना 3</label>
            <input
              type="text"
              value={noticeThree}
              onChange={(e) => setNoticeThree(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>
        </div>

        {/* Printable Broadsheet Preview */}
        <div className="lg:col-span-7 bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-xs print:border-2">
          <div className="bg-slate-900 text-white px-6 py-5 text-center space-y-1">
            <p className="text-xs font-semibold text-amber-300">{issueLabel}</p>
            <h2 className="text-xl font-bold">{toDevanagariAuto(orgName)}</h2>
            <p className="text-xs text-slate-300">{toOlChikiAuto(orgName)}</p>
          </div>

          <div className="p-6 space-y-5">
            <div className="space-y-2 pb-4 border-b border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
                संताली (देवनागरी लिपि)
              </span>
              <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                {toDevanagariAuto(headline)}
              </h3>
              <p className="text-base font-bold text-amber-800">{toOlChikiAuto(headline)}</p>
              <p className="text-sm text-slate-700 leading-relaxed pt-1">
                {toDevanagariAuto(leadStory)}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                प्रमुख सूचनाएँ व कार्यक्रम (देवनागरी लिपि)
              </h4>
              <ul className="space-y-1.5 text-sm text-slate-800">
                <li>1. {toDevanagariAuto(noticeOne)}</li>
                <li>2. {toDevanagariAuto(noticeTwo)}</li>
                <li>3. {toDevanagariAuto(noticeThree)}</li>
              </ul>
            </div>

            {featuredWord && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-amber-900">
                    सप्ताह का संताली शब्द (देवनागरी + ओल चिकी)
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {toDevanagariAuto(featuredWord.wordDevanagari || featuredWord.wordRoman)} ·{' '}
                    {toOlChikiAuto(featuredWord.wordDevanagari || featuredWord.wordRoman)} ({featuredWord.wordRoman})
                  </p>
                  <p className="text-xs text-slate-700">
                    {featuredWord.meaningHindi} · {featuredWord.meaningEnglish}
                  </p>
                </div>
                <button
                  onClick={() => setWordOffset((p) => p + 7)}
                  className="px-3 py-1.5 rounded-lg border border-amber-300 bg-white hover:bg-amber-100 text-xs font-semibold text-amber-900 inline-flex items-center gap-1 shrink-0 print:hidden cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>शब्द बदलें</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
