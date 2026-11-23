import React, { useState } from 'react';
import { Award, Sparkles, Copy, Check, Printer, Volume2 } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

type CardMode = 'invitation' | 'certificate';
type CardTheme = 'amber_heritage' | 'slate_formal' | 'emerald_baha';

export const SantaliInvitationCertificateStudio: React.FC = () => {
  const [docMode, setDocMode] = useState<CardMode>('invitation');
  const [theme, setTheme] = useState<CardTheme>('amber_heritage');
  const [recipientName, setRecipientName] = useState<string>('सोमरा हांसदा व सपरिवार');
  const [eventOrAwardTitle, setEventOrAwardTitle] = useState<string>('सोहराय मिलन समारोह एवं सांस्कृतिक अखड़ा');
  const [dateLine, setDateLine] = useState<string>('रविवार, 15 जनवरी · प्रातः 10:00 बजे');
  const [venueLine, setVenueLine] = useState<string>('भोगनाडीह अखड़ा प्रांगण, साहिबगंज');
  const [blessingText, setBlessingText] = useState<string>(
    'जोहार! माड़े जाहेर आयो आर मरांग बुरु आमाः ओड़ाक् रे सुख, शांति आर रस्का दोहो मा।'
  );
  const [issuerLine, setIssuerLine] = useState<string>('मांझी परगना एवं समस्त ग्रामवासी');
  const [copied, setCopied] = useState<boolean>(false);

  const handleSwitchMode = (nextMode: CardMode) => {
    setDocMode(nextMode);
    if (nextMode === 'certificate') {
      setRecipientName('सुनीता मुर्मू');
      setEventOrAwardTitle('संताली भाषा व लोक-संस्कृति उत्कृष्ट सम्मान पत्र');
      setDateLine('13 नवंबर 2026');
      setVenueLine('Santal आ़रसी शिक्षा मंच · BOSC Tech & Edu');
      setBlessingText('संताली देवनागरी लेखन, वाचन और सांस्कृतिक संरक्षण में सराहनीय योगदान हेतु सादर सम्मानित।');
      setIssuerLine('प्राचार्य एवं ग्राम सभा संयोजक');
    } else {
      setRecipientName('सोमरा हांसदा व सपरिवार');
      setEventOrAwardTitle('सोहराय मिलन समारोह एवं सांस्कृतिक अखड़ा');
      setDateLine('रविवार, 15 जनवरी · प्रातः 10:00 बजे');
      setVenueLine('भोगनाडीह अखड़ा प्रांगण, साहिबगंज');
      setBlessingText('जोहार! माड़े जाहेर आयो आर मरांग बुरु आमाः ओड़ाक् रे सुख, शांति आर रस्का दोहो मा।');
      setIssuerLine('मांझी परगना एवं समस्त ग्रामवासी');
    }
  };

  const fullShareText = `${docMode === 'invitation' ? 'नेवता साकाम (सादर निमंत्रण)' : 'सम्मान प्रमाण-पत्र'}
--------------------------------
${eventOrAwardTitle}
नाम / अतिथि: ${recipientName}
संदेश: ${blessingText}
दिनांक व समय: ${dateLine}
स्थान: ${venueLine}
प्रेषक / प्रदत्त: ${issuerLine}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  const cardThemeStyles =
    theme === 'amber_heritage'
      ? 'bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-400 text-amber-950'
      : theme === 'emerald_baha'
      ? 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-500 text-emerald-950'
      : 'bg-white border-slate-800 text-slate-900';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>निमंत्रण व प्रमाण-पत्र डिज़ाइनर | Newta Sakam &amp; Certificate Studio</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              संताली निमंत्रण पत्र (नेवता साकाम) व सम्मान प्रमाण-पत्र स्टूडियो
            </h1>
            <p className="text-sm text-slate-600">
              विवाह, सोहराय, स्कूल समारोह या भाषा सम्मान हेतु सुंदर द्विभाषी कार्ड तैयार करें, कॉपी करें या सीधे प्रिंट करें।
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl shrink-0">
            <button
              onClick={() => handleSwitchMode('invitation')}
              className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer ${
                docMode === 'invitation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              नेवता साकाम (निमंत्रण)
            </button>
            <button
              onClick={() => handleSwitchMode('certificate')}
              className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer ${
                docMode === 'certificate' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              सम्मान प्रमाण-पत्र
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Form Editor */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-3 text-xs print:hidden">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              विवरण संपादित करें
            </h2>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">रंग व बॉर्डर शैली</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'amber_heritage' as CardTheme, label: 'सोहराय स्वर्ण' },
                  { id: 'emerald_baha' as CardTheme, label: 'बाहा वन हरित' },
                  { id: 'slate_formal' as CardTheme, label: 'राजकीय श्वेत' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`min-h-[40px] px-2 py-1.5 rounded-lg border font-semibold cursor-pointer ${
                      theme === t.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">
                {docMode === 'invitation' ? 'अतिथि / आमंत्रित परिवार का नाम' : 'सम्मानित व्यक्ति / छात्र का नाम'}
              </label>
              <input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">आयोजन / प्रमाण-पत्र शीर्षक</label>
              <input
                value={eventOrAwardTitle}
                onChange={(e) => setEventOrAwardTitle(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">संताली आशीर्वाद / मुख्य संदेश</label>
              <textarea
                rows={3}
                value={blessingText}
                onChange={(e) => setBlessingText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">दिनांक व समय</label>
                <input
                  value={dateLine}
                  onChange={(e) => setDateLine(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">स्थान / मंच</label>
                <input
                  value={venueLine}
                  onChange={(e) => setVenueLine(e.target.value)}
                  className="w-full min-h-[40px] px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">प्रेषक / हस्ताक्षरकर्ता</label>
              <input
                value={issuerLine}
                onChange={(e) => setIssuerLine(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Printable Live Card Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className={`rounded-2xl border-4 p-8 md:p-10 text-center space-y-5 shadow-sm ${cardThemeStyles}`}
            >
              <div className="text-xs font-bold uppercase tracking-widest opacity-80 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>
                  {docMode === 'invitation' ? 'सागुन जोहार · नेवता साकाम (सादर निमंत्रण)' : 'Santal आ़रसी सम्मान प्रमाण-पत्र'}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold leading-snug">{eventOrAwardTitle}</h2>

              <div className="py-2 border-y border-current/20">
                <div className="text-xs opacity-75 mb-1">
                  {docMode === 'invitation' ? 'सादर आमंत्रित:' : 'गौरवपूर्वक प्रदत्त:'}
                </div>
                <div className="text-xl md:text-2xl font-bold">{recipientName}</div>
              </div>

              <p className="text-sm md:text-base font-medium leading-relaxed max-w-xl mx-auto">
                "{blessingText}"
              </p>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-current/15">
                <div>
                  <span className="opacity-70 block">तिथि व समय</span>
                  <strong className="font-semibold">{dateLine}</strong>
                </div>
                <div>
                  <span className="opacity-70 block">स्थान</span>
                  <strong className="font-semibold">{venueLine}</strong>
                </div>
              </div>

              <div className="pt-4 text-xs font-bold">
                — {issuerLine} —
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
              <button
                onClick={() =>
                  speakWithFemaleVoice(`${eventOrAwardTitle}। ${recipientName}। ${blessingText}`, {
                    lang: 'hi-IN',
                    rate: 0.9
                  })
                }
                className="min-h-[44px] px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-700" />
                <span>संदेश सुनें</span>
              </button>

              <button
                onClick={handleCopy}
                className="min-h-[44px] px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'कॉपी हो गया' : 'टेक्स्ट कॉपी करें'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="min-h-[44px] px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>प्रिंट / PDF सहेजें</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
