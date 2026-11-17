import React, { useState, useEffect } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { useUserAuth } from '../context/UserAuthContext';
import { HeartPulse, Volume2, Square, CheckSquare } from 'lucide-react';

interface HealthStep {
  id: string;
  stage: 'गर्भवती देखभाल' | 'जन्म से १.५ माह' | '३.५ से ९ माह' | '१.५ से ५ वर्ष';
  titleDev: string;
  titleHi: string;
  careTipDev: string;
  careTipHi: string;
}

const HEALTH_STEPS: HealthStep[] = [
  {
    id: 'hs1',
    stage: 'गर्भवती देखभाल',
    titleDev: 'आयरन बटी आर टिटनस सूई (ANC जांच)',
    titleHi: 'आयरन-फोलिक गोली, टिटनस व ४ प्रसव-पूर्व जांच',
    careTipDev: 'आंगनवाड़ी रे ओजोन जांच, साकाम आड़ाक् आर दाल जोम दो आडी जरुड़-आ।',
    careTipHi: 'आँगनवाड़ी में वजन व बीपी जांच तथा हरी पत्तेदार सब्ज़ी व दाल खाना अत्यंत आवश्यक है।'
  },
  {
    id: 'hs2',
    stage: 'जन्म से १.५ माह',
    titleDev: 'जनम सूई (BCG, OPV) आर ६ सप्ताह पेंटा-१',
    titleHi: 'जन्म के समय BCG/पोलियो और ६ सप्ताह पर पेंटावेलेंट-१',
    careTipDev: '६ माह धाबिच् गिदरा दो खाली आयो तोवा (माँ का दूध) मात्र नु-इच् पे।',
    careTipHi: '६ महीने तक शिशु को केवल माँ का दूध पिलाएँ (ऊपर से पानी भी नहीं)।'
  },
  {
    id: 'hs3',
    stage: '३.५ से ९ माह',
    titleDev: 'पेंटा-३ आर ९ माह रे खसरा-रुबेला (MR) सूई',
    titleHi: '३.५ माह में पेंटा-३ और ९ माह में खसरा व विटामिन-A',
    careTipDev: '६ माह पूरा हुय-काते मसाला बिना नरम दाका-दाल आर उल-बेल एम-एहोक पे।',
    careTipHi: '६ माह पूरे होने पर नरम मसला हुआ दाल-भात और मौसमी फल देना शुरू करें।'
  },
  {
    id: 'hs4',
    stage: '१.५ से ५ वर्ष',
    titleDev: 'डीपीटी बूस्टर, कृमि दवा आर पोषण जांच',
    titleHi: '१६–२४ माह व ५ वर्ष पर DPT बूस्टर और कृमि की गोली',
    careTipDev: 'गिदरा रेयाक् साफा ती आर सेताक् सेरमा रे पोषण आहार ध्यान दोहो पे।',
    careTipHi: 'बच्चों के हाथ धोने की आदत और आँगनवाड़ी पोषण जांच नियमित करवाएँ।'
  }
];

export const SantaliMaternalChildHealth: React.FC = () => {
  const { currentUser } = useUserAuth();
  const storageKey = `hor_katha_mch_ticks_${currentUser?.email || 'guest'}`;

  const [ticks, setTicks] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setTicks(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, [storageKey]);

  const toggleTick = (id: string) => {
    const next = { ...ticks, [id]: !ticks[id] };
    setTicks(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            <span>आँगनवाड़ी / सहिया माँ-शिशु टीकाकरण व पोषण गाइड</span>
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-0.5">
            आयो आर गिदरा बुगी ताहेन (टीकाकरण व पोषण कैलेंडर)
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HEALTH_STEPS.map((h) => {
          const done = Boolean(ticks[h.id]);
          return (
            <div
              key={h.id}
              className={`rounded-2xl border p-4 shadow-xs space-y-2.5 ${
                done ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                  {h.stage}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      speakWithFemaleVoice(`${h.titleDev}. ${h.careTipDev}. ${h.careTipHi}`, {
                        autoDetectLanguage: true
                      })
                    }
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                    title="सुनें"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTick(h.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                      done ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>{done ? 'पूर्ण ✓' : 'पूर्ण चिह्नित करें'}</span>
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-black text-slate-900">{h.titleDev}</h3>
              <p className="text-xs font-bold text-amber-800">{toOlChikiAuto(h.titleDev)}</p>
              <p className="text-xs text-slate-600">{h.titleHi}</p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">{h.careTipDev}</div>
                <div className="text-slate-600">{h.careTipHi}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
