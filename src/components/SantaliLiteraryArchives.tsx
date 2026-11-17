import React, { useState } from 'react';
import { BookOpen, Newspaper, Volume2, Sparkles, User, Calendar, Scroll } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface LiteraryWork {
  id: string;
  year: string;
  titleDevanagari: string;
  titleRoman: string;
  author: string;
  genre: string;
  excerptDevanagari: string;
  excerptRoman: string;
  hindiTranslation: string;
  historicalSignificance: string;
}

const LITERARY_WORKS: LiteraryWork[] = [
  {
    id: 'pera_hor',
    year: '१८९० (1890 AD)',
    titleDevanagari: 'पेड़ा होड़ (संताली प्रथम समाचार पत्र)',
    titleRoman: 'Peṛa Hoṛ (First Santali Periodical)',
    author: 'बेनागाड़िया प्रेस, संथाल परगना',
    genre: 'पत्रकारिता व समाज जागरण',
    excerptDevanagari: 'जोहार पेड़ा को! ओल-पाड़ाहाव दो मानव जीवन राः मार्सल काना। जोतो आतु रे इस्कुल बेनाव लाकतीया।',
    excerptRoman: 'Johar peṛa ko! Ol-paṛhaw do manwa jiwon raḥ marsal kana. Joto atu re iskul benaw laktiya.',
    hindiTranslation: 'अतिथियों व बंधुओं को जोहार! लिखना-पढ़ना मानव जीवन का प्रकाश है। प्रत्येक गांव में पाठशाला का निर्माण आवश्यक है।',
    historicalSignificance: 'संताली भाषा की पत्रकारिता का सबसे प्राचीन स्तंभ, जिसने गांव-गांव में शिक्षा और कृषि सुधार का संदेश पहुंचाया।'
  },
  {
    id: 'bidu_chandan',
    year: '१९४२ (1942 AD)',
    titleDevanagari: 'बिदु चांदान (ऐतिहासिक महानाटक)',
    titleRoman: 'Bidu Chandan',
    author: 'ओल गुरु पंडित रघुनाथ मुर्मू',
    genre: 'अमर सांस्कृतिक नाटक',
    excerptDevanagari: 'लिपि बां ताहेन खान पारसी दो बां बांचावाक् आ, आर पारसी बेगोर जाति राः चिन्हा चाबाक् आ।',
    excerptRoman: 'Lipi bañ tahen khan parsi do bañ banchawaḳ a, ar parsi begor jati raḥ chinha chabaḳ a.',
    hindiTranslation: 'यदि अपनी लिपि व लेखन न हो तो भाषा सुरक्षित नहीं रहती, और मातृभाषा के बिना समाज की मौलिक पहचान समाप्त हो जाती है।',
    historicalSignificance: 'रघुनाथ मुर्मू की अमर कृति जिसमें बिदु व चांदान के दिव्य संवादों के माध्यम से लिपि व सांस्कृतिक अस्मिता के संरक्षण का आह्वान है।'
  },
  {
    id: 'kherwal_bir',
    year: '१९४४ (1944 AD)',
    titleDevanagari: 'खेरवाड़ बीर (वीर रस महाकाव्य)',
    titleRoman: 'Kherwal Bir',
    author: 'ओल गुरु पंडित रघुनाथ मुर्मू',
    genre: 'शौर्य नाट्य व इतिहास',
    excerptDevanagari: 'बीर को दो बोरतेद बाको चिनाक् आ; धरती आर धर्म लागित् जिवी एमोक गे सरी बीर राः धरम काना।',
    excerptRoman: 'Bir ko do borted bako chinaḳ a; dharti ar dhorom lagit jiwi emoḳ ge sari bir raḥ dhorom kana.',
    hindiTranslation: 'सच्चे वीर कभी अन्याय के आगे नहीं झुकते; मातृभूमि और सत्य की रक्षा हेतु समर्पण ही वीरता का सच्चा धर्म है।',
    historicalSignificance: 'युवाओं में स्वाभिमान, एकता और अन्याय के विरुद्ध अडिग रहने की प्रेरणा जगाने वाला ऐतिहासिक नाटक।'
  },
  {
    id: 'kherwal_bonso',
    year: '१८९४ (1894 AD)',
    titleDevanagari: 'खेरवाड़ बोंसो धोरम पुथी',
    titleRoman: 'Kherwal Bonso Dhorom Puthi',
    author: 'मांझी रामदास टुडू (रेसका)',
    genre: 'धार्मिक व वंशावली ग्रंथ',
    excerptDevanagari: 'हांस-हासिल खोन खेरवाड़ को सिरजोन एना; चांपा गढ़ रे मारांग बुरु वाः दया ते अबोवाः नेगचारी बेनाव एना।',
    excerptRoman: 'Has-Hasil khon Kherwal ko sirjon ena; Champa garh re Marang Buru waḥ daya te abowaḥ negchari benaw ena.',
    hindiTranslation: 'हंस-हंसिनी से खेरवाड़ वंश की उत्पत्ति हुई; चांपा गढ़ में मारंग बुरु की कृपा से हमारी पावन रीति-नीति का निर्माण हुआ।',
    historicalSignificance: 'संताली समाज के एक स्वदेशी विद्वान द्वारा लिखित प्रथम व्यवस्थित धर्म-संस्कृति व परंपरा ग्रंथ।'
  },
  {
    id: 'sari_dhorom',
    year: '१९६८ (1968 AD)',
    titleDevanagari: 'सरी धोरम सेरेञ पुथी',
    titleRoman: 'Sari Dhorom Seren Puthi',
    author: 'साधु रामचांद मुर्मू',
    genre: 'भक्ति व आध्यात्मिक काव्य',
    excerptDevanagari: 'सिरजोम दारे बुटा रे नायके बाबा बिनती या; हापड़ाम कोवाः आशीष ते आतु रे सुख शांति ताहेना।',
    excerptRoman: 'Sirjom dare buta re Nayke baba binti ya; hapṛam kowaḥ ashish te atu re sukh shanti tahena.',
    hindiTranslation: 'साल वृक्ष की छाया में नायके बाबा प्रार्थना करते हैं; पूर्वजों के आशीर्वाद से पूरे ग्राम में सुख व शांति का वास होता है।',
    historicalSignificance: 'संताली आध्यात्मिक गीतांजलि कहे जाने वाले साधु रामचांद मुर्मू की प्रसिद्ध कविताएं।'
  }
];

export const SantaliLiteraryArchives: React.FC = () => {
  const [selectedWork, setSelectedWork] = useState<LiteraryWork>(LITERARY_WORKS[0]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-amber-50 via-white to-rose-50 border border-amber-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Newspaper className="w-4 h-4" />
              <span>संताली कालजयी साहित्य व समाचार आर्काइव | Classical Literature &amp; Pera Hor</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              पेड़ा होड़ (१८९०) व संताली महाकाव्य पुस्तकालय
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              संताली साहित्य के स्वर्णयुग के दुर्लभ समाचार, नाटक व धर्मग्रंथों का संकलन व ऑडियो वाचन।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${selectedWork.titleDevanagari}। लेखक: ${selectedWork.author}। मूल पाठ: ${selectedWork.excerptDevanagari}। हिन्दी अर्थ: ${selectedWork.hindiTranslation}`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white border border-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>साहित्यिक अंश सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-2.5">
          {LITERARY_WORKS.map(work => (
            <button
              key={work.id}
              onClick={() => setSelectedWork(work)}
              className={`w-full text-left p-4 border transition-all ${
                selectedWork.id === work.id
                  ? 'bg-amber-100 border-amber-400 shadow-lg'
                  : 'bg-white border-stone-200 hover:border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-amber-700 font-mono mb-1">
                <span>{work.year}</span>
                <span>{work.genre}</span>
              </div>
              <h3 className="text-sm font-bold text-amber-950">{work.titleDevanagari}</h3>
              <p className="text-xs text-stone-600 mt-1">{work.author}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white border-2 border-amber-200 p-6 space-y-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider">
                  {selectedWork.genre} · {selectedWork.year}
                </span>
                <h2 className="text-2xl font-bold text-amber-950 mt-1">{selectedWork.titleDevanagari}</h2>
                <p className="text-xs text-stone-600 font-mono">{selectedWork.titleRoman}</p>
              </div>
              <div className="bg-stone-50 px-3 py-2 border border-stone-200 text-xs flex items-center gap-2 text-amber-700">
                <User className="w-4 h-4" />
                <span>{selectedWork.author}</span>
              </div>
            </div>

            <div className="bg-stone-50 border border-amber-200 p-5">
              <span className="text-[11px] uppercase tracking-wider text-amber-500 font-bold block mb-2">
                संताली मूल उद्धरण (Devanagari Script):
              </span>
              <p className="text-xl font-bold text-amber-950 leading-relaxed">
                "{selectedWork.excerptDevanagari}"
              </p>
              <p className="text-xs font-mono text-amber-700 mt-3 pt-2 border-t border-stone-200">
                {selectedWork.excerptRoman}
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-4">
              <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-bold block mb-1">
                हिन्दी भावार्थ:
              </span>
              <p className="text-sm text-stone-900 leading-relaxed">{selectedWork.hindiTranslation}</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4">
              <span className="text-[11px] uppercase tracking-wider text-amber-700 font-bold block mb-1 flex items-center gap-1.5">
                <Scroll className="w-4 h-4" /> ऐतिहासिक व साहित्यिक महत्व:
              </span>
              <p className="text-xs text-stone-700 leading-relaxed">{selectedWork.historicalSignificance}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
