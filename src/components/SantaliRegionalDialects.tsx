import React, { useState } from 'react';
import { Globe, Volume2, ArrowRightLeft, Sparkles, BookOpen } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface DialectComparisonRow {
  id: string;
  conceptHindi: string;
  northSantali: { dev: string; rom: string; note: string };
  southSantali: { dev: string; rom: string; note: string };
  bengalSantali: { dev: string; rom: string; note: string };
}

const DIALECT_DATA: DialectComparisonRow[] = [
  {
    id: 'where_going',
    conceptHindi: 'आप कहाँ जा रहे हैं?',
    northSantali: { dev: 'ओका सेन एम चालाक् काना?', rom: 'Oka sen em chalaḳ kana?', note: 'दुमका-जामताड़ा (संथाल परगना) मानक शैली' },
    southSantali: { dev: 'ओका तेम चालाक् काना?', rom: 'Oka tem chalaḳ kana?', note: 'मयूरभंज-सिंहभूम दक्षिणी बोलचाल' },
    bengalSantali: { dev: 'ओका आड़ेम सेनोक काना?', rom: 'Oka aṛem senoḳ kana?', note: 'बाँकुड़ा-पुरुलिया पश्चिम शैली' }
  },
  {
    id: 'come_here',
    conceptHindi: 'इधर आओ, बैठो।',
    northSantali: { dev: 'नोते हजुः मे, दुड़ुप मे।', rom: 'Note hajuḥ me, duṛup me.', note: 'स्पष्ट उत्तरी क्रिया रूप' },
    southSantali: { dev: 'नेते हेच् मे, दुबुः मे।', rom: 'Nete hech me, dubuḥ me.', note: 'ओडिशा व कोल्हान क्षेत्रीय प्रयोग' },
    bengalSantali: { dev: 'नोडे हजुः मे, दुरुप मे।', rom: 'Node hajuḥ me, durup me.', note: 'मिश्रित राढ़ बंगाल उच्चारण' }
  },
  {
    id: 'water_drink',
    conceptHindi: 'मुझे प्यास लगी है, पानी दीजिए।',
    northSantali: { dev: 'तेतांग ईदीञ काना, दाः एम आञ मे।', rom: 'Tetang idiñ kana, daḥ em añ me.', note: 'संथाल परगना सामान्य वाक्य' },
    southSantali: { dev: 'दाः तेतांग किदीञा, दाः आगुइ मे।', rom: 'Daḥ tetang kidiña, daḥ agui me.', note: 'बारीपदा-चाईबासा शैली' },
    bengalSantali: { dev: 'तेतांग गेया, मीत् गिलास दाः एमोक मे।', rom: 'Tetang geya, mit gilas daḥ emoḳ me.', note: 'मेदिनीपुर-बाँकुड़ा बोली' }
  },
  {
    id: 'market_price',
    conceptHindi: 'इस धान का क्या दाम है?',
    northSantali: { dev: 'नोवा हुड़ू राः दाम दो तिनाः काना?', rom: 'Nowa huṛu raḥ dam do tinaḥ kana?', note: 'संताली हाट-बाजार संवाद' },
    southSantali: { dev: 'नेवा होड़ो राः गोनोङ तिनाः?', rom: 'Newa hoṛo raḥ gonong tinaḥ?', note: 'शुद्ध प्राचीन "गोनोङ" शब्द का प्रयोग' },
    bengalSantali: { dev: 'एया हुड़ू तिनाः टाका?', rom: 'Eya huṛu tinaḥ taka?', note: 'संक्षिप्त क्षेत्रीय व्यापारिक शैली' }
  },
  {
    id: 'greeting_well',
    conceptHindi: 'घर में सब कुशल-मंगल तो हैं?',
    northSantali: { dev: 'ओड़ाक् रे जोतो नापाय ते मेनाक् कोवा?', rom: 'Oṛaḳ re joto napay te menaḳ kowa?', note: 'परंपरागत संथाल परगना अभिवादन' },
    southSantali: { dev: 'ओड़ाक् दुवार जोतो बुगी गेया?', rom: 'Oṛaḳ duwar joto bugi geya?', note: '"बुगी" (कुशल) का प्रिय दक्षिणी प्रयोग' },
    bengalSantali: { dev: 'ओड़ाक् होड़ जोतो बेस गेया को?', rom: 'Oṛaḳ hoṛ joto bes geya ko?', note: 'पूर्वी राढ़ क्षेत्र की मधुर शैली' }
  }
];

export const SantaliRegionalDialects: React.FC = () => {
  const [selectedRow, setSelectedRow] = useState<DialectComparisonRow>(DIALECT_DATA[0]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-sky-50 via-white to-indigo-50 border border-sky-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Globe className="w-4 h-4" />
              <span>क्षेत्रीय संताली बोली व उच्चारण तुलना | Regional Dialect Switcher</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              उत्तर, दक्षिण व बंगाल संताली बोली तुलनात्मक प्रयोगशाला
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              संथाल परगना (दुमका), मयूरभंज-सिंहभूम (दक्षिणी) और बाँकुड़ा-पुरुलिया (बंगाल) की जीवंत बोलियों का अंतर समझें।
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${selectedRow.conceptHindi}। उत्तर संताली: ${selectedRow.northSantali.dev}। दक्षिण संताली: ${selectedRow.southSantali.dev}। बंगाल संताली: ${selectedRow.bengalSantali.dev}`,
                { lang: 'hi-IN' }
              )
            }
            className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white border border-sky-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>तीनों बोलियाँ सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-2.5">
          {DIALECT_DATA.map(row => (
            <button
              key={row.id}
              onClick={() => setSelectedRow(row)}
              className={`w-full text-left p-4 border transition-all ${
                selectedRow.id === row.id
                  ? 'bg-sky-50 border-sky-400'
                  : 'bg-white border-stone-200 hover:border-sky-200'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider text-sky-700 font-bold">वाक्य भावार्थ</span>
              <h3 className="text-sm font-bold text-amber-950 mt-1">{row.conceptHindi}</h3>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-stone-200 p-4 text-center">
            <span className="text-xs uppercase text-stone-600 font-semibold">चयनित संवाद (हिन्दी भाव):</span>
            <h2 className="text-xl font-bold text-amber-800 mt-1">{selectedRow.conceptHindi}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* North */}
            <div className="bg-white border-2 border-amber-200 p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-amber-700">उत्तर संताली (झारखंड)</span>
                  <button
                    onClick={() => speakWithFemaleVoice(selectedRow.northSantali.dev, { lang: 'hi-IN' })}
                    className="text-amber-700 hover:text-amber-800 p-1"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-lg font-bold text-amber-950">{selectedRow.northSantali.dev}</p>
                <p className="text-xs font-mono text-amber-700 mt-2">{selectedRow.northSantali.rom}</p>
              </div>
              <p className="text-[11px] text-stone-600 border-t border-stone-200 pt-2">{selectedRow.northSantali.note}</p>
            </div>

            {/* South */}
            <div className="bg-white border-2 border-emerald-200 p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-emerald-700">दक्षिण संताली (ओडिशा)</span>
                  <button
                    onClick={() => speakWithFemaleVoice(selectedRow.southSantali.dev, { lang: 'hi-IN' })}
                    className="text-emerald-700 hover:text-emerald-800 p-1"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-lg font-bold text-emerald-950">{selectedRow.southSantali.dev}</p>
                <p className="text-xs font-mono text-emerald-700 mt-2">{selectedRow.southSantali.rom}</p>
              </div>
              <p className="text-[11px] text-stone-600 border-t border-stone-200 pt-2">{selectedRow.southSantali.note}</p>
            </div>

            {/* Bengal */}
            <div className="bg-white border-2 border-sky-200 p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-sky-700">राढ़ संताली (बंगाल)</span>
                  <button
                    onClick={() => speakWithFemaleVoice(selectedRow.bengalSantali.dev, { lang: 'hi-IN' })}
                    className="text-sky-700 hover:text-sky-800 p-1"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-lg font-bold text-sky-950">{selectedRow.bengalSantali.dev}</p>
                <p className="text-xs font-mono text-sky-700 mt-2">{selectedRow.bengalSantali.rom}</p>
              </div>
              <p className="text-[11px] text-stone-600 border-t border-stone-200 pt-2">{selectedRow.bengalSantali.note}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
