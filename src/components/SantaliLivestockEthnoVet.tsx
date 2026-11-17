import React, { useState } from 'react';
import { HeartPulse, Volume2, ShieldCheck, Sparkles, Info } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface CattleLoreTopic {
  id: string;
  titleDev: string;
  titleRom: string;
  category: string;
  herbalOrRitualDetails: string;
  herbsUsed: string;
  careWisdom: string;
  icon: string;
}

const LIVESTOCK_TOPICS: CattleLoreTopic[] = [
  {
    id: 'sunum_ojok',
    titleDev: 'सुनुम ओजोक् व सींग श्रृंगार (सोहराय)',
    titleRom: 'Sunum Ojok & Horn Oiling',
    category: 'पशु सम्मान व पोषण',
    herbalOrRitualDetails: 'सोहराय के पावन दिनों में बैलों व भैंसों के खुर और सींगों को साफ पानी से धोकर सरसों व महुआ का गुनगुना तेल मला जाता है और धान की बालियों का मुकुट (मोहोर) पहनाया जाता है।',
    herbsUsed: 'करंज तेल, महुआ तेल, हल्दी लेप',
    careWisdom: 'सींगों और खुरों में तेल लगाने से सर्दियों में दरारें नहीं पड़तीं और परजीवियों से रक्षा होती है।',
    icon: '🐂'
  },
  {
    id: 'tuni_tonga',
    titleDev: 'टुनी-टोंगा (लकड़ी की पशु घंटी)',
    titleRom: 'Tuni-Tonga Wooden Cowbell',
    category: 'वन-चराई ध्वनि विज्ञान',
    herbalOrRitualDetails: 'साल या गमहार की खोखली लकड़ी से बनी घंटी जिसके भीतर २ या ३ लकड़ी की लटकन (लोलक) होती हैं। यह धातु की घंटी से अलग मधुर खट-खट ध्वनि करती है।',
    herbsUsed: 'गमहार काष्ठ व बाबुई रस्सी पट्टा',
    careWisdom: 'घने साल जंगल में चरते हुए गाय-बैलों की दिशा का तुरंत पता चलता है और जंगली जानवर ध्वनि से दूर रहते हैं।',
    icon: '🔔'
  },
  {
    id: 'khur_ran',
    titleDev: 'खुरपका व घाव उपचार (गोरु रान)',
    titleRom: 'Khur-Ran (Hoof & Wound Care)',
    category: 'पशु वनौषधि चिकित्सा',
    herbalOrRitualDetails: 'बरसात में बैलों के खुर गलने या घाव होने पर करंज पत्ता, तम्बाकू पत्ता और कांच-कोयला या हल्दी का गाढ़ा लेप लगाया जाता है। पशु को सूखी बालू पर रखा जाता है।',
    herbsUsed: 'करंज खली, चिरचिटा जड़, नीम छाल का काढ़ा',
    careWisdom: 'रसायन-मुक्त कीटाणुनाशक उपचार जो तुरंत कीड़े नष्ट कर घाव को सुखा देता है।',
    icon: '🌿'
  },
  {
    id: 'gohal_puja',
    titleDev: 'गोहाल बोंगा व आंगन सुरक्षा',
    titleRom: 'Gohal Bonga & Barn Hygiene',
    category: 'आवास व स्वच्छता विधान',
    herbalOrRitualDetails: 'गोहाल (पशुशाला) में संध्या को करंज के पत्तों और राल (धुना) का धुआं किया जाता है तथा गोहाल खूंटी की पूजा कर पशुओं के दीर्घायु की कामना की जाती है।',
    herbsUsed: 'साल का धुना (राल), सूखी नीम पत्तियां, गोबर लेप',
    careWisdom: 'संध्या समय धुआं करने से मच्छर, मक्खी और किलनी (ticks) दूर रहते हैं तथा हवा शुद्ध होती है।',
    icon: '🛖'
  }
];

export const SantaliLivestockEthnoVet: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<CattleLoreTopic>(LIVESTOCK_TOPICS[0]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-amber-50 via-white to-emerald-50 border border-amber-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <HeartPulse className="w-4 h-4" />
              <span>पशुधन सेवा व वनौषधि विद्या | Goru-Dangra &amp; Ethno-Veterinary Lore</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              गोरु-डांगरा पालन, सुनुम ओजोक् व पशु चिकित्सा विज्ञान
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              संताली समाज में बैल व गोवंश को परिवार का अन्नदाता मानने की परंपरा और देसी पशु उपचार।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${selectedTopic.titleDev}। ${selectedTopic.herbalOrRitualDetails}। वैज्ञानिक लाभ: ${selectedTopic.careWisdom}`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white border border-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>पशु-ज्ञान सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          {LIVESTOCK_TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className={`w-full p-4 border text-left flex items-start gap-3 transition-all ${
                selectedTopic.id === topic.id
                  ? 'bg-amber-100 border-amber-400'
                  : 'bg-white border-stone-200 hover:border-amber-200'
              }`}
            >
              <span className="text-3xl">{topic.icon}</span>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold">{topic.category}</span>
                <h3 className="text-sm font-bold text-amber-950 mt-0.5">{topic.titleDev}</h3>
                <p className="text-[11px] font-mono text-stone-600">{topic.titleRom}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-amber-200 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
              <span className="text-4xl">{selectedTopic.icon}</span>
              <div>
                <span className="text-xs text-amber-700 uppercase font-bold">{selectedTopic.category}</span>
                <h2 className="text-xl font-bold text-amber-950">{selectedTopic.titleDev}</h2>
              </div>
            </div>

            <div className="bg-stone-50 p-4 border border-stone-200 text-sm text-stone-900 leading-relaxed">
              {selectedTopic.herbalOrRitualDetails}
            </div>

            <div className="bg-stone-50 p-3.5 border border-stone-200 text-xs">
              <span className="text-emerald-700 font-bold block mb-1">प्रयुक्त वनस्पति / सामग्री:</span>
              <p className="text-amber-800">{selectedTopic.herbsUsed}</p>
            </div>

            <div className="bg-emerald-50 p-3.5 border border-emerald-200 text-xs">
              <span className="text-emerald-700 font-bold block mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> पशु स्वास्थ्य व वैज्ञानिक आधार:
              </span>
              <p className="text-stone-900 leading-relaxed">{selectedTopic.careWisdom}</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
            <strong>सावधानी:</strong> गंभीर संक्रामक रोगों (जैसे मुंहपका-खुरपका तीव्र संक्रमण या सर्पदंश) में पारंपरिक प्राथमिक देखभाल के साथ निकटतम पशु चिकित्सालय से टीकाकरण व परामर्श अवश्य लें।
          </div>
        </div>
      </div>
    </div>
  );
};
