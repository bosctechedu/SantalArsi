import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { speakWithFemaleVoice } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  HeartPulse,
  Volume2,
  Download,
  Printer,
  ShieldAlert,
  MapPin,
  Train
} from 'lucide-react';

interface EmergencyCardItem {
  id: string;
  category: 'medical' | 'travel' | 'help' | 'address';
  titleHi: string;
  santaliDev: string;
  santaliRoman: string;
  hindiMeaning: string;
}

const EMERGENCY_CARDS: EmergencyCardItem[] = [
  {
    id: 'em1',
    category: 'medical',
    titleHi: 'तुरंत डॉक्टर / अस्पताल मदद चाहिए',
    santaliDev: 'दया काते उसारा डॉक्टर ओड़ाक् इदिञ पे, आड़ी तकलीफ मेनाक्-आ।',
    santaliRoman: 'Daya kate usara doctor orak idin pe, adi taklif menak-a.',
    hindiMeaning: 'कृपया मुझे जल्दी अस्पताल ले चलें, बहुत तकलीफ़ हो रही है।'
  },
  {
    id: 'em2',
    category: 'medical',
    titleHi: 'चक्कर, कमज़ोरी या साँस की दिक्कत',
    santaliDev: 'इञ दो बोहोक् आचुरोक् काना आर साहेत् लेका बाञ बुझाव एत्-आ।',
    santaliRoman: 'In do bohok achurok kana ar sahet leka ban bujhaw et-a.',
    hindiMeaning: 'मुझे चक्कर आ रहा है और साँस लेने में कठिनाई हो रही है।'
  },
  {
    id: 'em3',
    category: 'medical',
    titleHi: 'मेरे परिवार को फ़ोन कर दीजिए',
    santaliDev: 'दया काते नोवा नंबर रे इञ ओड़ाक् होड़ फोन कातिञ पे।',
    santaliRoman: 'Daya kate nowa number re in orak hor phone katin pe.',
    hindiMeaning: 'कृपया इस नंबर पर मेरे घर के लोगों को फ़ोन कर दीजिए।'
  },
  {
    id: 'em4',
    category: 'travel',
    titleHi: 'रेलवे स्टेशन / बस स्टैंड का रास्ता',
    santaliDev: 'जोहार! रेलवे स्टेशन या बस स्टैंड दो ओका सेच् मेनाक्-आ?',
    santaliRoman: 'Johar! Railway station ya bus stand do oka sech menak-a?',
    hindiMeaning: 'जोहार! रेलवे स्टेशन या बस स्टैंड किस तरफ़ है?'
  },
  {
    id: 'em5',
    category: 'travel',
    titleHi: 'रास्ता भटक गया हूँ / मदद करें',
    santaliDev: 'इञ दो होर आत् केदा, दया काते सही होर उदुक् कातिञ पे।',
    santaliRoman: 'In do hor at keda, daya kate sahi hor uduk katin pe.',
    hindiMeaning: 'मैं रास्ता भूल गया हूँ, कृपया सही रास्ता बता दीजिए।'
  },
  {
    id: 'em6',
    category: 'help',
    titleHi: 'पुलिस सहायता / सुरक्षा संपर्क',
    santaliDev: 'इञाक् सामान या बैग आत् एना, थाना रे मदद लाकती काना।',
    santaliRoman: 'Inak saman ya bag at ena, thana re madad lakti kana.',
    hindiMeaning: 'मेरा सामान या बैग खो गया है, थाने में मदद चाहिए।'
  },
  {
    id: 'em7',
    category: 'address',
    titleHi: 'मुझे पानी व बैठने की जगह चाहिए',
    santaliDev: 'दया काते थोड़ा न्यू दाक् एम कातिञ पे आर दुड़ुप् होचोइञ पे।',
    santaliRoman: 'Daya kate thoda nyu dak em katin pe ar dudup hochoin pe.',
    hindiMeaning: 'कृपया थोड़ा पीने का पानी दीजिए और बैठने की जगह दीजिए।'
  }
];

export const SantaliEmergencyVoiceCards: React.FC = () => {
  const [catFilter, setCatFilter] = useState<'all' | 'medical' | 'travel' | 'help' | 'address'>('all');
  const [personName, setPersonName] = useState('सोमराय मुर्मू');
  const [villageAddress, setVillageAddress] = useState('ग्राम काठीकुंड, जिला दुमका, झारखंड');
  const [bloodGroup, setBloodGroup] = useState('O+ (ओ पॉज़िटिव)');
  const [emergencyPhone, setEmergencyPhone] = useState('+91-98765-43210');
  const [medicalNote, setMedicalNote] = useState('कोई दवा एलर्जी नहीं / मधुमेह जाँच आवश्यक');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const visibleCards = EMERGENCY_CARDS.filter((c) => catFilter === 'all' || c.category === catFilter);

  useEffect(() => {
    const payload = `EMERGENCY SOS CARD\nName: ${personName}\nVillage: ${villageAddress}\nBlood Group: ${bloodGroup}\nEmergency Phone: ${emergencyPhone}\nNote: ${medicalNote}`;
    QRCode.toDataURL(payload, { width: 220, margin: 1 })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(''));
  }, [personName, villageAddress, bloodGroup, emergencyPhone, medicalNote]);

  const handleDownloadPocketCard = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1040;
    canvas.height = 620;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#B91C1C';
    ctx.fillRect(0, 0, canvas.width, 96);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('आपातकालीन सहायता एवं पहचान कार्ड · EMERGENCY SOS CARD', 36, 60);

    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(personName, 40, 165);

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(toOlChikiAuto(personName), 40, 206);

    ctx.fillStyle = '#334155';
    ctx.font = '600 22px sans-serif';
    ctx.fillText(`गाँव / पता: ${villageAddress}`, 40, 265);

    ctx.fillStyle = '#B91C1C';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`रक्त समूह: ${bloodGroup}`, 40, 318);
    ctx.fillText(`आपात फ़ोन: ${emergencyPhone}`, 40, 365);

    ctx.fillStyle = '#1E293B';
    ctx.font = '600 20px sans-serif';
    ctx.fillText(`स्वास्थ्य नोट: ${medicalNote.slice(0, 56)}`, 40, 425);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('संताली संदेश: "दया काते नोवा नंबर रे इञ ओड़ाक् होड़ फोन कातिञ पे।"', 40, 515);

    ctx.fillStyle = '#64748B';
    ctx.font = '600 17px sans-serif';
    ctx.fillText('Hor Katha Suite · ग्रामीण व यात्री सुरक्षा पॉकेट कार्ड', 40, 575);

    if (qrDataUrl) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 760, 150, 230, 230);
          ctx.fillStyle = '#475569';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText('स्कैन करें (संपर्क विवरण)', 775, 408);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = qrDataUrl;
      });
    }

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `emergency-sos-card-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-semibold text-rose-800">
            एक-टैप बोलने वाले आपात कार्ड · बुज़ुर्ग व यात्री सहायता
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            आपातकालीन व यात्रा संताली वॉइस-SOS पॉकेट कार्ड
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            अस्पताल, रेलवे स्टेशन या अनजान शहर में बड़े अक्षरों वाले बटन दबाकर संताली में बात सुनवाएं व अपना QR पहचान कार्ड डाउनलोड करें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadPocketCard}
            className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>पॉकेट SOS कार्ड (PNG)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>प्रिंट कार्ड</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        {[
          { id: 'all', label: 'सभी आपात कार्ड', icon: ShieldAlert },
          { id: 'medical', label: 'अस्पताल व स्वास्थ्य', icon: HeartPulse },
          { id: 'travel', label: 'यात्रा व रास्ता', icon: Train },
          { id: 'help', label: 'पुलिस व सुरक्षा', icon: ShieldAlert },
          { id: 'address', label: 'पानी व सहायता', icon: MapPin }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = catFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCatFilter(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
                active
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Big One-Tap Voice Cards */}
        <div className="lg:col-span-7 space-y-3 print:hidden">
          {visibleCards.map((card) => (
            <div
              key={card.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-rose-800">{card.titleHi}</p>
                <p className="text-lg font-bold text-slate-900 leading-snug">{card.santaliDev}</p>
                <p className="text-sm font-semibold text-amber-800">{toOlChikiAuto(card.santaliDev)}</p>
                <p className="text-xs text-slate-500">
                  {card.santaliRoman} · {card.hindiMeaning}
                </p>
              </div>
              <button
                onClick={() =>
                  speakWithFemaleVoice(`${card.santaliDev}। ${card.hindiMeaning}`, {
                    autoDetectLanguage: true,
                    rate: 0.85
                  })
                }
                className="px-4 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>ज़ोर से बोलें</span>
              </button>
            </div>
          ))}
        </div>

        {/* Pocket Emergency ID Card Builder & Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border-2 border-rose-600 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-rose-700 text-white px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-bold tracking-wide">आपातकालीन पहचान कार्ड · SOS</span>
              <span className="text-xs font-semibold tabular-nums">{bloodGroup}</span>
            </div>
            <div className="p-5 flex items-start justify-between gap-4">
              <div className="space-y-1.5 text-xs">
                <p className="text-lg font-bold text-slate-900">{personName}</p>
                <p className="text-sm font-semibold text-amber-800">{toOlChikiAuto(personName)}</p>
                <p className="text-slate-700">
                  <strong>पता:</strong> {villageAddress}
                </p>
                <p className="text-rose-800 font-bold tabular-nums">आपात नंबर: {emergencyPhone}</p>
                <p className="text-slate-600">
                  <strong>स्वास्थ्य नोट:</strong> {medicalNote}
                </p>
              </div>
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Emergency QR"
                  className="w-24 h-24 rounded-lg border border-slate-200 shrink-0"
                />
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs print:hidden">
            <h2 className="text-sm font-bold text-slate-900">पॉकेट पहचान कार्ड विवरण भरें</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">पूरा नाम</label>
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ब्लड ग्रुप</label>
                <input
                  type="text"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">गाँव व जिला पता</label>
                <input
                  type="text"
                  value={villageAddress}
                  onChange={(e) => setVillageAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">आपातकालीन परिवार फ़ोन</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 tabular-nums"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">एलर्जी या दवा जानकारी</label>
                <input
                  type="text"
                  value={medicalNote}
                  onChange={(e) => setMedicalNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
