import React, { useState } from 'react';
import { Compass, Volume2, Hammer, Music, Info, ShieldCheck } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface CartPart {
  id: string;
  nameDevanagari: string;
  nameRoman: string;
  woodUsed: string;
  engineeringRole: string;
  description: string;
}

const CART_PARTS: CartPart[] = [
  {
    id: 'chaka',
    nameDevanagari: 'चाका व आरी (१२-तीलियों वाला पहिया)',
    nameRoman: 'Chaka ar Ari (12-Spoke Wheel)',
    woodUsed: 'साल (Sarjom) और शीशम (Sisu) की पक्की लकड़ी',
    engineeringRole: 'पत्थरीले व कीचड़युक्त जंगल मार्ग पर भार का समान वितरण',
    description: 'बिना कील के "मोर्टिज़ व टेनॉन" जोड़ से बना विशाल पहिया। बाहरी परिधि पर लोहे की पट्टी (हाला) लोहार द्वारा तपाकर चढ़ाई जाती है जिससे घिसाव नहीं होता।'
  },
  {
    id: 'dhura',
    nameDevanagari: 'धूरा (मुख्य धुरी)',
    nameRoman: 'Dhura (Main Axle)',
    woodUsed: 'असन / साल का सीधा गोल लट्ठा व लोहे की बांह',
    engineeringRole: 'दोनों पहियों को संतुलन में रखकर मुख्य ढांचे का वजन संभालना',
    description: 'पहियों और धुरी के बीच घर्षण कम करने के लिए करंज या महुआ के तेल और काले कोयले का प्राकृतिक लुब्रिकेंट (ऑंग) लगाया जाता है।'
  },
  {
    id: 'juath',
    nameDevanagari: 'जुआठ व जुती (बैलों का जुआ)',
    nameRoman: 'Juath ar Juti (Bullock Yoke)',
    woodUsed: 'गमहार (Gamar) की हल्की व चिकनी लकड़ी',
    engineeringRole: 'बैलों के कंधों पर खिंचाव बल को बिना घाव पहुंचाए संतुलित करना',
    description: 'बैलों की गर्दन की गोलाई के अनुरूप गमहार की हल्की लकड़ी को तराशा जाता है ताकि लंबे सफर में बैलों को कष्ट न हो।'
  },
  {
    id: 'macha',
    nameDevanagari: 'मांचा / बांस पटरी (भार मंच)',
    nameRoman: 'Macha (Bamboo Platform)',
    woodUsed: 'बाँस की खपच्ची और सखुआ की पट्टियाँ',
    engineeringRole: 'धान के बोरे, महुआ, जलावन व परिवार के बैठने का लचीला मंच',
    description: 'गड्ढों वाले पहाड़ी रास्तों में झटकों को सहन करने के लिए बाँस की बुनाई प्राकृतिक शॉक-एब्जॉर्बर का काम करती है।'
  }
];

const DAHAR_SONGS = [
  {
    title: 'साग़ोड़ गाड़ी डहर सेरेञ (राहगीर गाड़ी गीत)',
    lyricsDev: 'साग़ोड़ गाड़ी चाका दो चिरि-चिरि साड़े काना, हाट होर रे डांगरा दो दाप-दाप ताड़ाम काना।',
    lyricsRom: 'Sagor gadi chaka do chiri-chiri sade kana, hat hor re dangra do dap-dap taram kana.',
    meaning: 'बैलगाड़ी के पहिए रात्रि के सन्नाटे में मधुर चिर-चिर ध्वनि कर रहे हैं और हाट के रास्ते पर बैल तालबद्ध कदमों से आगे बढ़ रहे हैं।'
  }
];

export const SantaliBullockCartCraft: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<CartPart>(CART_PARTS[0]);
  const [axleLoadKg, setAxleLoadKg] = useState<number>(350);

  const bullockEffortPercent = Math.round((axleLoadKg / 600) * 100);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-amber-50 via-white to-stone-50 border border-amber-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Hammer className="w-4 h-4" />
              <span>पारंपरिक परिवहन यांत्रिकी | Sagar Bullock Cart Engineering</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              साग़ोड़ (संताली बैलगाड़ी) व पहाड़ी पथ अभियंत्रिकी
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              १२-तीलियों वाले लकड़ी के पहिए की ज्यामिति, प्राकृतिक स्नेहक (ऑंग) व राहगीर डहर सेरेञ।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${selectedPart.nameDevanagari}। उपयोग की जाने वाली लकड़ी: ${selectedPart.woodUsed}। ${selectedPart.description}`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white border border-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>विवरण सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-2.5">
          {CART_PARTS.map(part => (
            <button
              key={part.id}
              onClick={() => setSelectedPart(part)}
              className={`w-full text-left p-4 border transition-all ${
                selectedPart.id === part.id
                  ? 'bg-amber-100 border-amber-400'
                  : 'bg-white border-stone-200 hover:border-amber-200'
              }`}
            >
              <h3 className="text-sm font-bold text-amber-950">{part.nameDevanagari}</h3>
              <p className="text-[11px] font-mono text-amber-700 mt-0.5">{part.nameRoman}</p>
              <p className="text-xs text-stone-600 mt-1">{part.engineeringRole}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-amber-200 p-6 space-y-4">
            <h2 className="text-xl font-bold text-amber-800">{selectedPart.nameDevanagari}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 p-3 border border-stone-200">
                <span className="text-stone-600 block">प्रयुक्त काष्ठ / सामग्री:</span>
                <p className="text-amber-800 font-semibold mt-1">{selectedPart.woodUsed}</p>
              </div>
              <div className="bg-stone-50 p-3 border border-stone-200">
                <span className="text-stone-600 block">यांत्रिक कार्य:</span>
                <p className="text-emerald-700 font-semibold mt-1">{selectedPart.engineeringRole}</p>
              </div>
            </div>
            <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 border border-stone-200">
              {selectedPart.description}
            </p>
          </div>

          {/* Interactive Load Simulator */}
          <div className="bg-white border border-stone-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold text-sky-700">संतुलित भार-वितरण परीक्षक (Load Balancer)</h3>
              <span className="text-xs font-mono text-amber-700">{axleLoadKg} किग्रा (Kg)</span>
            </div>
            <input
              type="range"
              min={100}
              max={600}
              step={25}
              value={axleLoadKg}
              onChange={(e) => setAxleLoadKg(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex items-center justify-between text-xs text-stone-700">
              <span>बैलों के कंधे पर खिंचाव भार:</span>
              <span className={`font-bold ${bullockEffortPercent > 80 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {bullockEffortPercent}% ({bullockEffortPercent > 80 ? 'ढलान पर पीछे गुटका आवश्यक' : 'सामान्य सुरक्षित गति'})
              </span>
            </div>
          </div>

          {/* Dahar Song */}
          <div className="bg-amber-50 border border-amber-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                <Music className="w-4 h-4" /> {DAHAR_SONGS[0].title}
              </span>
              <button
                onClick={() =>
                  speakWithFemaleVoice(`${DAHAR_SONGS[0].lyricsDev}। अर्थ: ${DAHAR_SONGS[0].meaning}`, { lang: 'hi-IN' })
                }
                className="text-amber-700 hover:text-amber-800 p-1"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-bold text-amber-950">{DAHAR_SONGS[0].lyricsDev}</p>
            <p className="text-[11px] font-mono text-amber-700">{DAHAR_SONGS[0].lyricsRom}</p>
            <p className="text-xs text-stone-700">{DAHAR_SONGS[0].meaning}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
