import React, { useState, useMemo } from 'react';
import { speakWithFemaleVoice } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  Baby,
  Volume2,
  Download,
  Share2,
  Check,
  Search,
  Sparkles
} from 'lucide-react';

interface SeasonalBabyName {
  id: string;
  nameDev: string;
  nameRoman: string;
  gender: 'boy' | 'girl' | 'unisex';
  seasonTag: 'baha' | 'sohrai' | 'karam' | 'maghe' | 'nature';
  seasonLabel: string;
  meaningHi: string;
  meaningEn: string;
}

const SEASONAL_BABY_NAMES: SeasonalBabyName[] = [
  { id: 'cn1', nameDev: 'बाहा', nameRoman: 'Baha', gender: 'girl', seasonTag: 'baha', seasonLabel: 'बाहा / बसंत', meaningHi: 'पवित्र सखुआ फूल व वसंत का सौंदर्य', meaningEn: 'Sacred Sal Blossom' },
  { id: 'cn2', nameDev: 'सागेन', nameRoman: 'Sagen', gender: 'boy', seasonTag: 'baha', seasonLabel: 'बाहा / बसंत', meaningHi: 'नया अंकुर, नवजीवन और समृद्धि', meaningEn: 'Fresh Green Sprout' },
  { id: 'cn3', nameDev: 'फुलमुनी', nameRoman: 'Phulmuni', gender: 'girl', seasonTag: 'baha', seasonLabel: 'बाहा / बसंत', meaningHi: 'फूलों की मणि, कोमल और गुणी', meaningEn: 'Jewel of Blossoms' },
  { id: 'cn4', nameDev: 'सोहराय', nameRoman: 'Sohrai', gender: 'unisex', seasonTag: 'sohrai', seasonLabel: 'सोहराय / शरद', meaningHi: 'फसल उत्सव और आनंद में जन्मा', meaningEn: 'Born in Harvest Celebration' },
  { id: 'cn5', nameDev: 'सोनोत', nameRoman: 'Sonot', gender: 'unisex', seasonTag: 'sohrai', seasonLabel: 'सोहराय / शरद', meaningHi: 'पवित्र, शुद्ध और मंगलकारी', meaningEn: 'Sacred and Auspicious' },
  { id: 'cn6', nameDev: 'चांपा', nameRoman: 'Champa', gender: 'girl', seasonTag: 'sohrai', seasonLabel: 'सोहराय / शरद', meaningHi: 'चंपा के समान सुगंधित व पवित्र इतिहास की प्रतीक', meaningEn: 'Fragrant Blossom' },
  { id: 'cn7', nameDev: 'करमु', nameRoman: 'Karmu', gender: 'boy', seasonTag: 'karam', seasonLabel: 'करम / वर्षा', meaningHi: 'शुभ कर्म और धैर्य का प्रतीक', meaningEn: 'Born during Karam Festival' },
  { id: 'cn8', nameDev: 'रिमिल', nameRoman: 'Rimil', gender: 'unisex', seasonTag: 'karam', seasonLabel: 'करम / वर्षा', meaningHi: 'वर्षा का बादल, शीतलता और हरियाली', meaningEn: 'Monsoon Cloud' },
  { id: 'cn9', nameDev: 'दाक्मुनी', nameRoman: 'Dakmuni', gender: 'girl', seasonTag: 'karam', seasonLabel: 'करम / वर्षा', meaningHi: 'जल की पावन बूँद, जीवनदायिनी', meaningEn: 'Sacred Water Pearl' },
  { id: 'cn10', nameDev: 'माघे', nameRoman: 'Maghe', gender: 'boy', seasonTag: 'maghe', seasonLabel: 'माघ / शिशिर', meaningHi: 'माघ बोंगा और नव-वर्ष ऋतु में जन्मा', meaningEn: 'Born in Maghe New Year' },
  { id: 'cn11', nameDev: 'बिरसा', nameRoman: 'Birsa', gender: 'boy', seasonTag: 'maghe', seasonLabel: 'माघ / शिशिर', meaningHi: 'बृहस्पतिवार और शौर्य का प्रतीक', meaningEn: 'Brave Thursday Child' },
  { id: 'cn12', nameDev: 'चांदो', nameRoman: 'Chando', gender: 'unisex', seasonTag: 'nature', seasonLabel: 'प्रकृति व नक्षत्र', meaningHi: 'सूर्य-चंद्रमा का तेज और दिव्य प्रकाश', meaningEn: 'Celestial Sun & Moon Light' },
  { id: 'cn13', nameDev: 'इपिल', nameRoman: 'Ipil', gender: 'girl', seasonTag: 'nature', seasonLabel: 'प्रकृति व नक्षत्र', meaningHi: 'चमकता हुआ तारा, मार्गदर्शक ज्योति', meaningEn: 'Shining Star' },
  { id: 'cn14', nameDev: 'मारंग', nameRoman: 'Marang', gender: 'boy', seasonTag: 'nature', seasonLabel: 'प्रकृति व नक्षत्र', meaningHi: 'महान, श्रेष्ठ और पर्वत समान अडिग', meaningEn: 'Great and Noble' },
  { id: 'cn15', nameDev: 'दिगी', nameRoman: 'Digi', gender: 'girl', seasonTag: 'nature', seasonLabel: 'प्रकृति व नक्षत्र', meaningHi: 'निर्मल सरोवर, गहरा और शांत स्वभाव', meaningEn: 'Serene Sacred Pond' },
  { id: 'cn16', nameDev: 'सिंगराई', nameRoman: 'Singrai', gender: 'boy', seasonTag: 'nature', seasonLabel: 'प्रकृति व नक्षत्र', meaningHi: 'सूर्य की किरण और वीरता', meaningEn: 'Sunbeam & Valour' }
];

export const SantaliChhatiarNameStudio: React.FC = () => {
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'boy' | 'girl' | 'unisex'>('all');
  const [letterFilter, setLetterFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');

  // Janam Chhatiar Card Form State
  const [babyName, setBabyName] = useState('सागेन (Sagen)');
  const [parentsName, setParentsName] = useState('सोमराय मुर्मू एवं सलोनी टुडू');
  const [parisClan, setParisClan] = useState('मुर्मू पारिस');
  const [village, setVillage] = useState('भोगनाडीह, झारखंड');
  const [ceremonyDate, setCeremonyDate] = useState('2026-11-22 · प्रातः 10:00 बजे');
  const [blessingNote, setBlessingNote] = useState(
    'मरांग बुरु आर जाहेर आयो वाक् आशिर्वाद ते नोवा गिद्रा दो नापाय ते हारा-बुरु मा।'
  );
  const [copied, setCopied] = useState(false);

  const startingLetters = useMemo(() => {
    const set = new Set(SEASONAL_BABY_NAMES.map((n) => n.nameRoman.slice(0, 1).toUpperCase()));
    return Array.from(set).sort();
  }, []);

  const filteredNames = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return SEASONAL_BABY_NAMES.filter((n) => {
      if (seasonFilter !== 'all' && n.seasonTag !== seasonFilter) return false;
      if (genderFilter !== 'all' && n.gender !== genderFilter) return false;
      if (letterFilter !== 'all' && n.nameRoman.slice(0, 1).toUpperCase() !== letterFilter) return false;
      if (
        q &&
        !n.nameDev.toLowerCase().includes(q) &&
        !n.nameRoman.toLowerCase().includes(q) &&
        !n.meaningHi.toLowerCase().includes(q) &&
        !n.meaningEn.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [seasonFilter, genderFilter, letterFilter, searchText]);

  const handleSelectNameForCard = (item: SeasonalBabyName) => {
    setBabyName(`${item.nameDev} (${item.nameRoman})`);
    speakWithFemaleVoice(`${item.nameDev}. ${item.meaningHi}`, { autoDetectLanguage: true });
  };

  const handleDownloadChhatiarCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 10;
    ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('जोहार! जनम छठियार व नामकरण निमंत्रण · JANAM CHHATIAR', 600, 112);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 64px sans-serif';
    ctx.fillText(babyName, 600, 230);

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(toOlChikiAuto(babyName.split('(')[0].trim()), 600, 298);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`माता-पिता: ${parentsName}`, 600, 390);

    ctx.fillStyle = '#475569';
    ctx.font = '600 24px sans-serif';
    ctx.fillText(`पारिस: ${parisClan}  ·  स्थान: ${village}`, 600, 440);
    ctx.fillText(`दिनांक व समय: ${ceremonyDate}`, 600, 485);

    ctx.fillStyle = '#065F46';
    ctx.font = 'italic 22px sans-serif';
    ctx.fillText(blessingNote.slice(0, 80), 600, 585);
    if (blessingNote.length > 80) {
      ctx.fillText(blessingNote.slice(80, 160), 600, 620);
    }

    ctx.fillStyle = '#78350F';
    ctx.font = '600 20px sans-serif';
    ctx.fillText('Santal आ़रसी · संताली संस्कृति व नामकरण मंच', 600, 718);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `janam-chhatiar-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyWhatsApp = () => {
    const cleanName = babyName.split('(')[0].trim();
    const msg = `*जोहार! जनम छठियार निमंत्रण*\n\n*नवजात शिशु का नाम:* ${babyName}\n*ओल चिकी:* ${toOlChikiAuto(cleanName)}\n*माता-पिता:* ${parentsName}\n*पारिस व गाँव:* ${parisClan}, ${village}\n*तिथि व समय:* ${ceremonyDate}\n\n_${blessingNote}_`;
    navigator.clipboard.writeText(msg).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-amber-800">
            ऋतु-आधारित नाम खोज · HD जनम छठियार ई-कार्ड
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            जनम छठियार व संताली बेबी-नेम कार्ड स्टूडियो (Chhatiar Studio)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            पर्व, ऋतु, वर्ण और अर्थ के आधार पर शुभ संताली शिशु नाम खोजें और जनम छठियार संस्कार का निमंत्रण व आशीर्वाद कार्ड बनाएँ।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => speakWithFemaleVoice(`${babyName}. ${blessingNote}`, { autoDetectLanguage: true })}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
            <span>आशीर्वाद सुनें</span>
          </button>
          <button
            onClick={handleCopyWhatsApp}
            className="px-3.5 py-2 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-900 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'निमंत्रण कॉपी हुआ' : 'WhatsApp निमंत्रण कॉपी'}</span>
          </button>
          <button
            onClick={handleDownloadChhatiarCard}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>HD कार्ड PNG डाउनलोड</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Seasonal Name Finder */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Baby className="w-4 h-4 text-amber-700" />
              <span>ऋतु व पर्व आधारित नाम चुनें</span>
            </h2>
            <span className="text-xs text-slate-500 tabular-nums">{filteredNames.length} नाम</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="relative sm:col-span-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="नाम या अर्थ खोजें (जैसे: फूल, चाँद, सागेन)..."
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
              />
            </div>

            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800"
            >
              <option value="all">सभी पर्व / ऋतु</option>
              <option value="baha">बाहा / बसंत</option>
              <option value="sohrai">सोहराय / शरद</option>
              <option value="karam">करम / वर्षा</option>
              <option value="maghe">माघ / शिशिर</option>
              <option value="nature">प्रकृति व नक्षत्र</option>
            </select>

            <div className="flex gap-2">
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="w-1/2 px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-800"
              >
                <option value="all">सभी</option>
                <option value="boy">कोड़ा (लड़का)</option>
                <option value="girl">कुड़ी (लड़की)</option>
                <option value="unisex">दोनों</option>
              </select>
              <select
                value={letterFilter}
                onChange={(e) => setLetterFilter(e.target.value)}
                className="w-1/2 px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-800"
              >
                <option value="all">अक्षर: सभी</option>
                {startingLetters.map((l) => (
                  <option key={l} value={l}>
                    {l} से शुरू
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredNames.map((n) => (
              <div
                key={n.id}
                onClick={() => handleSelectNameForCard(n)}
                className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {n.nameDev} ({n.nameRoman})
                  </span>
                  <Volume2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                </div>
                <p className="text-sm font-semibold text-amber-800">{toOlChikiAuto(n.nameDev)}</p>
                <p className="text-[11px] text-slate-600">{n.meaningHi}</p>
                <p className="text-[10px] text-slate-500">
                  {n.seasonLabel} · {n.gender === 'boy' ? 'कोड़ा' : n.gender === 'girl' ? 'कुड़ी' : 'उभय'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chhatiar Card Designer + Live Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-amber-50/60 border-2 border-amber-400 rounded-2xl p-6 text-center space-y-3 shadow-xs">
            <p className="text-xs font-bold text-amber-900 tracking-wide">
              जोहार! जनम छठियार संस्कार · JANAM CHHATIAR
            </p>
            <h3 className="text-3xl font-bold text-slate-900">{babyName}</h3>
            <p className="text-2xl font-bold text-amber-800">
              {toOlChikiAuto(babyName.split('(')[0].trim())}
            </p>
            <div className="pt-2 border-t border-amber-200/80 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-slate-900">माता-पिता: {parentsName}</p>
              <p>
                {parisClan} <span aria-hidden="true">·</span> {village}
              </p>
              <p className="font-semibold text-amber-900">{ceremonyDate}</p>
            </div>
            <p className="text-xs italic text-emerald-900 pt-2">"{blessingNote}"</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>निमंत्रण कार्ड विवरण संपादित करें</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">शिशु का नाम</label>
                <input
                  type="text"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">माता-पिता का नाम</label>
                <input
                  type="text"
                  value={parentsName}
                  onChange={(e) => setParentsName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">पारिस (गोत्र)</label>
                <input
                  type="text"
                  value={parisClan}
                  onChange={(e) => setParisClan(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">गाँव व जिला</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">तिथि व समय</label>
                <input
                  type="text"
                  value={ceremonyDate}
                  onChange={(e) => setCeremonyDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">संताली आशीर्वाद संदेश</label>
                <textarea
                  rows={2}
                  value={blessingNote}
                  onChange={(e) => setBlessingNote(e.target.value)}
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
