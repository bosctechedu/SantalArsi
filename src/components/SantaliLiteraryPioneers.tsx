import React, { useState } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { BookOpen, Volume2, Square, CheckCircle2, XCircle } from 'lucide-react';

interface Pioneer {
  id: string;
  nameDev: string;
  era: string;
  honor: string;
  notableWorks: string;
  bioHi: string;
  quoteDev: string;
}

const PIONEERS: Pioneer[] = [
  {
    id: 'raghunath',
    nameDev: 'पंडित रघुनाथ मुर्मू (गुरू गोमके)',
    era: '१९०५ – १९८२ · डांड़बोस, मयूरभंज',
    honor: 'ओल चिकी लिपि के आविष्कारक (१९२५)',
    notableWorks: 'बिदु चांदान, खेरवाड़ बीर, दारेगे धोन, हिताल',
    bioHi: 'संताली ध्वनियों के वैज्ञानिक विश्लेषण के आधार पर १९२५ में ओल चिकी लिपि की रचना की और नाटक-साहित्य से जन-जागरण किया।',
    quoteDev: 'ओल मेनाक् ते-दो रोड़ आर समाज जिवेत् ताहेना।'
  },
  {
    id: 'ramdas',
    nameDev: 'मांझी रामदास टुडू (रास्का)',
    era: '१८५४ – १९५१ · पूर्व सिंहभूम',
    honor: 'प्रथम प्रमुख संताली महाकाव्य रचयिता',
    notableWorks: 'खेरवाड़ बोंसो धोरम पुथी (१८९४)',
    bioHi: 'संताली लोकपरंपरा, सृष्टि कथा और धोरम-बिनती को सर्वप्रथम व्यवस्थित पुस्तक के रूप में लिपिबद्ध किया।',
    quoteDev: 'आबो रेयाक् इतिहास आर बिनती दो पुथी रे दोहो जरुड़-आ।'
  },
  {
    id: 'samir',
    nameDev: 'डॉ. डोमन साहु समीर',
    era: '१९२४ – १९९८ · पांडाहा (गोड्डा)',
    honor: 'संताली देवनागरी के प्रवर्तक व "होड़ सोम्बाद" संपादक',
    notableWorks: 'संताली प्रवेशिका, दिसोम बाबा, ४७ वर्षों तक होड़ सोम्बाद',
    bioHi: 'आज़ादी के समय से संताल परगना में देवनागरी लिपि में संताली व्याकरण, पत्रकारिता और अनुवाद की मज़बूत नींव रखी।',
    quoteDev: 'देवनागरी ते संताली ओल आर पाड़हाव दो सहज आर पसर काना।'
  },
  {
    id: 'damayanti',
    nameDev: 'दमयंती बेसरा',
    era: 'ओडिशा · साहित्य अकादमी विजेता (२००९)',
    honor: 'प्रथम संताली महिला साहित्य अकादमी पुरस्कार विजेता',
    notableWorks: 'शाय साहेत् (कविता संग्रह), जीवी झरना',
    bioHi: 'संताली कविता और महिला लेखन को राष्ट्रीय स्तर पर पहचान दिलाने वाली प्रमुख आधुनिक कवयित्री एवं शिक्षिका।',
    quoteDev: 'आयो होपोन रेयाक् रोड़ सेरेञ दो धरती रेयाक् राग काना।'
  },
  {
    id: 'rupchand',
    nameDev: 'रूपचांद हांसदा',
    era: 'झारखंड-बंगाल · साहित्य अकादमी (२०२०)',
    honor: 'आधुनिक संताली काव्य व निबंधकार',
    notableWorks: 'गुड़ दाक् कासा दाक्',
    bioHi: 'समकालीन संताली समाज, प्रकृति और सांस्कृतिक अस्मिता पर संवेदनशील कविताएँ व निबंध रचे।',
    quoteDev: 'जाहेर थान आर बाहा बुरु दो आबो रेयाक् प्रान काना।'
  }
];

export const SantaliLiteraryPioneers: React.FC = () => {
  const [selectedId, setSelectedId] = useState(PIONEERS[0].id);
  const [quizPick, setQuizPick] = useState<string | null>(null);

  const active = PIONEERS.find((p) => p.id === selectedId) || PIONEERS[0];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>संताली साहित्यकार, भाषाविद् व पुस्तक कोष</span>
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-0.5">
            गुरू गोमके, डॉ. समीर व साहित्य अकादमी विभूतियाँ
          </h2>
        </div>
        <button
          type="button"
          onClick={stopSpeaking}
          className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <Square className="w-3.5 h-3.5" />
          <span>रोकें</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-5 space-y-2">
          {PIONEERS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`w-full text-left p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                active.id === p.id
                  ? 'bg-amber-50 border-amber-400'
                  : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="text-xs font-black text-slate-900">{p.nameDev}</div>
              <div className="text-[11px] text-amber-800 font-semibold mt-0.5">{p.honor}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-bold text-amber-800">{active.era}</span>
              <h3 className="text-lg font-black text-slate-900">{active.nameDev}</h3>
              <p className="text-sm font-bold text-indigo-900">{toOlChikiAuto(active.nameDev)}</p>
            </div>
            <button
              type="button"
              onClick={() =>
                speakWithFemaleVoice(`${active.nameDev}. ${active.bioHi}. ${active.quoteDev}`, {
                  autoDetectLanguage: true
                })
              }
              className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>जीवनी सुनें</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-slate-700 leading-relaxed">{active.bioHi}</p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900">प्रमुख रचनाएँ:</strong> {active.notableWorks}
            </div>
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
              <div className="font-black text-slate-900">"{active.quoteDev}"</div>
              <div className="font-bold text-amber-800">{toOlChikiAuto(active.quoteDev)}</div>
            </div>
          </div>

          {/* Literary Quiz */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <p className="font-black text-slate-900">परीक्षा प्रश्न: संताली साप्ताहिक "होड़ सोम्बाद" के संपादक कौन थे?</p>
            <div className="grid grid-cols-2 gap-2">
              {['डॉ. डोमन साहु समीर', 'पंडित रघुनाथ मुर्मू', 'दमयंती बेसरा', 'सिदो मुर्मू'].map((opt) => {
                const right = opt === 'डॉ. डोमन साहु समीर';
                let cls = 'bg-slate-50 border-slate-200 text-slate-800';
                if (quizPick) {
                  if (right) cls = 'bg-emerald-50 border-emerald-500 font-bold text-emerald-950';
                  else if (quizPick === opt) cls = 'bg-rose-50 border-rose-500 text-rose-950';
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQuizPick(opt)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer ${cls}`}
                  >
                    <span>{opt}</span>
                    {quizPick && right && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {quizPick && quizPick === opt && !right && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
