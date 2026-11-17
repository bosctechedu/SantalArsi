import React, { useState, useMemo } from 'react';
import { HeartPulse, Volume2, Search } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface MedicalPhrase {
  id: string;
  category: 'general' | 'maternal' | 'emergency' | 'medicine';
  hindiPrompt: string;
  santaliDev: string;
  santaliRoman: string;
  expectedReplyHint: string;
}

const MEDICAL_PHRASES: MedicalPhrase[] = [
  {
    id: 'm1',
    category: 'general',
    hindiPrompt: 'आपको क्या तकलीफ़ है? कहाँ दर्द हो रहा है?',
    santaliDev: 'आमाः चेत् कोस्तोह काना? ओकारे हासुयेत् मेया?',
    santaliRoman: 'Amah chet kostoh kana? Okare hasuyet meya?',
    expectedReplyHint: 'बोहोक हासु (सिर दर्द) / लाच हासु (पेट दर्द) / रुआ (बुखार)'
  },
  {
    id: 'm2',
    category: 'general',
    hindiPrompt: 'आपको बुखार कितने दिनों से है?',
    santaliDev: 'तिनाक् दिन खोन आम दोम रुआ काना?',
    santaliRoman: 'Tinak din khon am dom rua kana?',
    expectedReplyHint: 'बार दिन खोन (2 दिन से) / पे दिन खोन (3 दिन से)'
  },
  {
    id: 'm3',
    category: 'general',
    hindiPrompt: 'क्या उल्टी या दस्त हो रहे हैं?',
    santaliDev: 'चेत् उला आ़र बाङ लाच ओडोक काना?',
    santaliRoman: 'Chet ula ar bang lach odok kana?',
    expectedReplyHint: 'हें (हाँ) / बाङा (नहीं)'
  },
  {
    id: 'm4',
    category: 'maternal',
    hindiPrompt: 'गर्भवती माता को रोज़ आयरन और कैल्शियम की गोली लेनी है।',
    santaliDev: 'हमाल होड़मो आयो दो दिनोम गे रान गुली जोम होयोक् आ।',
    santaliRoman: 'Hamal hormo ayo do dinom ge ran guli jom hoyok a.',
    expectedReplyHint: 'भोजन के बाद साफ पानी के साथ सेवन करें'
  },
  {
    id: 'm5',
    category: 'maternal',
    hindiPrompt: 'बच्चे के नियमित टीकाकरण (सुई) के लिए आंगनवाड़ी केंद्र जरूर आएँ।',
    santaliDev: 'गिदराः सुई लागाओ ला़गित् आंगनवाड़ी केंद्र ते हिजुः पे।',
    santaliRoman: 'Gidrah sui lagao lagit Anganwadi kendra te hijuh pe.',
    expectedReplyHint: 'बीसीजी, पेंटावेलेंट और खसरा टीका सुरक्षा के लिए'
  },
  {
    id: 'm6',
    category: 'emergency',
    hindiPrompt: 'साँप या कीड़े के काटने पर घबराएँ नहीं, तुरंत अस्पताल लाएँ।',
    santaliDev: 'बिञ बाङ कीड़ो गेर लेरे आलोम बोंटोरोक् आ, लोंगोन अस्पताल आगुय पे।',
    santaliRoman: 'Bin bang kiro ger lere alom bontorok a, longon aspatal aguy pe.',
    expectedReplyHint: 'घाव पर चीरा न लगाएँ और अंग को स्थिर रखें'
  },
  {
    id: 'm7',
    category: 'emergency',
    hindiPrompt: 'मलेरिया और खून की जांच के लिए उंगली से एक बूँद रक्त लेंगे।',
    santaliDev: 'मलेरिया आ़र मायाम जाँच ला़गित् कातुप खोन मित् टिपा मायाम ले हातावा।',
    santaliRoman: 'Maleria ar mayam janch lagit katup khon mit tipa mayam le hatawa.',
    expectedReplyHint: 'रक्त परीक्षण पूर्णतः सुरक्षित और दर्द-रहित है'
  },
  {
    id: 'm8',
    category: 'medicine',
    hindiPrompt: 'यह दवा सुबह और रात को खाना खाने के बाद पानी से लें।',
    santaliDev: 'नोवा रान दो सेताक् आ़र आ़युब दाका जोम तायोन दाक् ते जोम मे।',
    santaliRoman: 'Nowa ran do setak ar ayub daka jom tayon dak te jom me.',
    expectedReplyHint: 'सेताक् (सुबह) / तिकिन (दोपहर) / आ़युब (शाम-रात)'
  },
  {
    id: 'm9',
    category: 'medicine',
    hindiPrompt: 'साफ उबला हुआ पानी या ओआरएस (ORS) का घोल बार-बार पिएँ।',
    santaliDev: 'साफा हेड़ेज दाक् बाङ ओआरएस घोल घाने-घाने ञू मे।',
    santaliRoman: 'Sapha herej dak bang ORS ghol ghane-ghane nyu me.',
    expectedReplyHint: 'निर्जलीकरण (कमजोरी) से बचाव के लिए आवश्यक'
  }
];

export const SantaliMedicalTranslator: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const [query, setQuery] = useState<string>('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEDICAL_PHRASES.filter((item) => {
      const catMatch = category === 'all' || item.category === category;
      const qMatch =
        !q ||
        item.hindiPrompt.toLowerCase().includes(q) ||
        item.santaliDev.toLowerCase().includes(q) ||
        item.santaliRoman.toLowerCase().includes(q);
      return catMatch && qMatch;
    });
  }, [category, query]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700">
            <HeartPulse className="w-4 h-4" />
            <span>स्वास्थ्य केंद्र, डॉक्टर व आशा/ANM संवाद सहायक</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            अस्पताल व चिकित्सा संताली संवाद गाइड (Medical Guide)
          </h1>
          <p className="text-sm text-slate-600">
            मरीज़ और स्वास्थ्यकर्मी के बीच बिना भाषा बाधा के स्पष्ट संवाद — लक्षण पूछने, दवा समझाने और आपातकालीन निर्देश सुनने के लिए।
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto">
            {[
              { id: 'all', label: 'सभी संवाद' },
              { id: 'general', label: 'सामान्य व बुखार' },
              { id: 'maternal', label: 'मातृ व शिशु' },
              { id: 'emergency', label: 'आपातकाल व जांच' },
              { id: 'medicine', label: 'दवा निर्देश' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
                  category === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="लक्षण या दवा खोजें..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-500">हिन्दी प्रश्न / निर्देश:</div>
                <div className="text-sm font-bold text-slate-900">{item.hindiPrompt}</div>
                <div className="p-3 bg-rose-50/60 border border-rose-200/70 rounded-xl space-y-1">
                  <div className="text-base font-bold text-rose-950">{item.santaliDev}</div>
                  <div className="text-xs font-mono text-rose-800">{item.santaliRoman}</div>
                </div>
                <div className="text-xs text-slate-600">
                  संकेत / संभावित उत्तर: <span className="font-medium text-slate-800">{item.expectedReplyHint}</span>
                </div>
              </div>

              <button
                onClick={() =>
                  speakWithFemaleVoice(`${item.santaliDev}। ${item.hindiPrompt}`, {
                    lang: 'hi-IN',
                    rate: 0.85
                  })
                }
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-rose-300" />
                <span>संताली व हिन्दी में बोलकर सुनाएँ</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
