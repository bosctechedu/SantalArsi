import React, { useState } from 'react';
import { HelpCircle, Smile, Volume2, Sparkles, CheckCircle2, XCircle, RotateCcw, ChevronRight } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface FolkRiddle {
  id: string;
  riddleSantaliDev: string;
  riddleRoman: string;
  meaningHindi: string;
  hint: string;
  answerSantaliDev: string;
  answerRoman: string;
  answerHindi: string;
  explanation: string;
  options: string[];
  correctIndex: number;
}

interface LandaStory {
  id: string;
  title: string;
  santaliTitle: string;
  storySantaliDev: string;
  storyHindi: string;
  moralWit: string;
}

const FOLK_RIDDLES: FolkRiddle[] = [
  {
    id: 'k1',
    riddleSantaliDev: 'मित् टेंज गाड़ा रे बारया दाड़ा, चेत् काना?',
    riddleRoman: 'Mit tenj gada re barya dara, chet kana?',
    meaningHindi: 'एक नदी में दो धाराएं / शाखाएं, बताओ क्या?',
    hint: 'मानव शरीर का एक अंग जो चलने में काम आता है।',
    answerSantaliDev: 'जांगा (पैर)',
    answerRoman: 'Janga (Legs)',
    answerHindi: 'मनुष्य के दोनों पैर',
    explanation: 'जैसे एक नदी से दो धाराएं निकलती हैं, वैसे ही धड़ से दोनों पैर निकलते हैं।',
    options: ['आँखें (मेद)', 'पैर (जांगा)', 'हाथ (ति)', 'कान (लुतुर)'],
    correctIndex: 1
  },
  {
    id: 'k2',
    riddleSantaliDev: 'सेताक् रे चारी पाँव, तिकिन रे बार पाँव, आ़युब रे पे पाँव, चेत् काना?',
    riddleRoman: 'Setak re chari panw, tikin re bar panw, ayub re pe panw, chet kana?',
    meaningHindi: 'सुबह चार पैर, दोपहर दो पैर, और शाम को तीन पैर, बताओ क्या?',
    hint: 'मनुष्य के जीवन की तीन अवस्थाएं।',
    answerSantaliDev: 'मानवा (मनुष्य का जीवन)',
    answerRoman: 'Manwa (Human Life)',
    answerHindi: 'मानव जीवन (बचपन, युवावस्था, वृद्धावस्था)',
    explanation: 'शिशु अवस्था में घुटनों के बल चलना (4 पैर), युवावस्था में 2 पैर, और बुढ़ापे में लाठी का सहारा (3 पैर)।',
    options: ['बैलगाड़ी', 'मनुष्य (मानवा)', 'पेड़ की छाया', 'सूरज की किरण'],
    correctIndex: 1
  },
  {
    id: 'k3',
    riddleSantaliDev: 'उचुक-कुचुक बुरु रे कासा थाली ढुलौ एना, चेत् काना?',
    riddleRoman: 'Uchuk-kuchuk buru re kasa thali dhulaw ena, chet kana?',
    meaningHindi: 'ऊँचे पहाड़ पर काँसे की थाली चमक रही है, बताओ क्या?',
    hint: 'आकाश में रात को दिखने वाला शीतल देव।',
    answerSantaliDev: 'चांदो (पूर्णिमा का चंद्रमा)',
    answerRoman: 'Chando (Moon)',
    answerHindi: 'चांद / चंद्रमा',
    explanation: 'नीले आकाश रूपी पर्वत पर चमकता हुआ गोल चंद्रमा काँसे की थाली जैसा प्रतीत होता है।',
    options: ['सूरज (सिंगि)', 'चांद (चांदो)', 'ध्रुव तारा', 'बादल'],
    correctIndex: 1
  },
  {
    id: 'k4',
    riddleSantaliDev: 'दाक् रे दो बाङ जुनीक्, सेंगेल रे दो बाङ लोसोक्, चेत् काना?',
    riddleRoman: 'Dak re do bang junik, sengel re do bang losok, chet kana?',
    meaningHindi: 'पानी में भीगती नहीं, और आग में जलती नहीं, बताओ क्या?',
    hint: 'धूप में हमारे साथ चलने वाली छाया।',
    answerSantaliDev: 'उमुल (छाया / परछाई)',
    answerRoman: 'Umul (Shadow)',
    answerHindi: 'परछाई (छाया)',
    explanation: 'परछाई जल में पड़ने पर भीगी नहीं होती और आग के पास जाने पर भी जलती नहीं है।',
    options: ['हवा (होय)', 'परछाई (उमुल)', 'पत्थर (दिरी)', 'धुआं (धुआं)'],
    correctIndex: 1
  },
  {
    id: 'k5',
    riddleSantaliDev: 'दारे चेतान रे काकड़ा डुबा, चेत् काना?',
    riddleRoman: 'Dare chetan re kakra duba, chet kana?',
    meaningHindi: 'पेड़ के ऊपर कछुआ / घोंघा बैठा है, बताओ क्या फल है?',
    hint: 'काँटेदार खोल वाला एक मीठा विशाल फल।',
    answerSantaliDev: 'कंठार (कटहल)',
    answerRoman: 'Kanthar (Jackfruit)',
    answerHindi: 'कटहल का फल',
    explanation: 'कटहल का खुरदरा बाहरी छिलका कछुए के खोल जैसा दिखाई देता है।',
    options: ['महुआ (मातकोम)', 'कटहल (कंठार)', 'बेल (बेले)', 'तरबूज'],
    correctIndex: 1
  }
];

const LANDA_STORIES: LandaStory[] = [
  {
    id: 's1',
    title: 'सियार की हाट-बाजार चतुराई',
    santaliTitle: 'तुयोवाः हाट बुद्दी',
    storySantaliDev:
      'मित् दिन मित् तुयो (सियार) हाट सेनोक् एहोब एना। हाट रे मित् कुम्हार तुकुक (घड़ा) आखरिञ एत् ताहेकाना। तुयो कुम्हार ठेन सेनेर काते मेनाय: "दादा, नोवा तुकुक चेत् ते लेका?" कुम्हार मेनाय: "मित् पाय धान ते।" तुयो चालाकी ते मेनाय: "इञाः धान दो खेत रे गापा हेड़ेज होयोक् आ, तेहेञ तुकुक दो इदी लेगे!" कुम्हार हाँसी काते मेनाय: "धान गापा हेड़ेज होयोक् आ खान, तुकुक दो गापा गे इदी मे!" सनाम हातु होड़ को लांदा केदा।',
    storyHindi:
      'एक दिन एक सियार हाट गया। वहाँ एक कुम्हार मिट्टी के घड़े बेच रहा था। सियार ने दाम पूछा, कुम्हार ने कहा: "एक पाय धान।" सियार ने चालाकी से कहा: "मेरा धान कल खेत में कटेगा, आज घड़ा ले जाने दो!" कुम्हार ने मुस्कुराते हुए कहा: "अगर धान कल कटेगा तो घड़ा भी कल ही ले जाना!" सब लोग जोर से हँस पड़े।',
    moralWit: 'हाट के व्यापारी लोक-व्यवहार और हाज़िरजवाबी में किसी से कम नहीं होते।'
  },
  {
    id: 's2',
    title: 'दादू और नटखट पोते का मज़ाक',
    santaliTitle: 'गोरोम हाड़ाम आर कोड़ा लांदा',
    storySantaliDev:
      'गोरोम हाड़ाम (दादाजी) ओड़ाक् दुवार रे सुतून ताहेकाना। नटखट कोड़ा हेच काते मेताया: "गोरोम बाबा, चांदो चेदाक् राति रे गे उडुक आ? सिंगि लेका दिपेन चेदाक् बाङ?" गोरोम हाड़ाम मेनाय: "गिदरा, चांदो दो आ़डी बुद्धिमान काना! दिपेन दो पहिल खोन गे उजला ताहेना, उनी दो रात रे आलोम बोंटोरोक् ला़गित् उडुक आ!" कोड़ा आर गोरोम बाबा बारहो होड़ रस्का ते किन लांदा केदा।',
    storyHindi:
      'दादाजी दरवाजे पर बैठे थे। नटखट पोता आया और बोला: "दादाजी, चांद केवल रात में ही क्यों निकलता है? सूरज की तरह दिन में क्यों नहीं?" दादाजी ने मुस्कुराकर कहा: "बच्चा, चांद बहुत समझदार है! दिन में तो पहले से ही रोशनी होती है, वह रात के अंधेरे में तुम्हें उजाला देने आता है!" दोनों दादा-पोते ठहाका लगाकर हँसे।',
    moralWit: 'संताल परिवार में दादा और पोते के बीच का रिश्ता हास्य और अपनत्व से भरपूर होता है।'
  }
];

export const SantaliWitRiddlesArena: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'riddles' | 'stories'>('riddles');
  const [currentRiddleIdx, setCurrentRiddleIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [solvedCount, setSolvedCount] = useState<number>(0);

  const riddle = FOLK_RIDDLES[currentRiddleIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    setShowAnswer(true);
    setSolvedCount((c) => c + 1);
    if (idx === riddle.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNextRiddle = () => {
    setSelectedOpt(null);
    setShowAnswer(false);
    setCurrentRiddleIdx((i) => (i + 1) % FOLK_RIDDLES.length);
  };

  const handleResetQuiz = () => {
    setSelectedOpt(null);
    setShowAnswer(false);
    setCurrentRiddleIdx(0);
    setScore(0);
    setSolvedCount(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
              <Smile className="w-4 h-4" />
              <span>संताली लोक पहेलियां व हास्य कथाएं | Kudum &amp; Landa Katha Arena</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              संताली कुदुम (पहेली) व लन्दा काथा (हास्य) अखाड़ा
            </h1>
            <p className="text-sm text-slate-600">
              पारंपरिक संताली पहेलियाँ सुलझाएँ, बुद्धि परखें और लोक-हास्य कथाओं का आनंद लें।
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs text-slate-500">पहेली स्कोर</div>
            <div className="text-xl font-mono tabular-nums font-bold text-amber-700">
              {score} / {solvedCount}
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('riddles')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              activeTab === 'riddles' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            कुदुम पहेली चैलेंज ({FOLK_RIDDLES.length})
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              activeTab === 'stories' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            लन्दा काथा (हास्य कथा मंच)
          </button>
        </div>

        {activeTab === 'riddles' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>पहेली #{currentRiddleIdx + 1} / {FOLK_RIDDLES.length}</span>
              <button
                onClick={() =>
                  speakWithFemaleVoice(
                    `${riddle.riddleSantaliDev}। भावार्थ: ${riddle.meaningHindi}`,
                    { lang: 'hi-IN', rate: 0.9 }
                  )
                }
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                <span>पहेली सुनें</span>
              </button>
            </div>

            {/* Riddle Box */}
            <div className="p-6 bg-gradient-to-r from-amber-50/60 via-white to-amber-50/60 border border-amber-200 rounded-2xl space-y-2 text-center">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">
                कुदुम (Riddle):
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                "{riddle.riddleSantaliDev}"
              </h2>
              <p className="text-xs font-mono text-slate-500">{riddle.riddleRoman}</p>
              <div className="pt-2 text-xs text-slate-600 italic">
                हिन्दी भावार्थ: {riddle.meaningHindi}
              </div>
            </div>

            <div className="text-xs text-slate-500 italic text-center">
              संकेत: {riddle.hint}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {riddle.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === riddle.correctIndex;
                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

                if (showAnswer) {
                  if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                  else if (isSelected) btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                  else btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }

                return (
                  <button
                    key={idx}
                    disabled={showAnswer}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between gap-2 cursor-pointer disabled:cursor-default ${btnStyle}`}
                  >
                    <span>
                      <span className="font-mono text-xs text-slate-400 mr-2">{idx + 1}.</span>
                      {opt}
                    </span>
                    {showAnswer && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {showAnswer && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer & Explanation Reveal */}
            {showAnswer && (
              <div
                className={`p-4 border rounded-xl space-y-1.5 text-xs animate-in fade-in ${
                  selectedOpt === riddle.correctIndex
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div className="font-bold text-sm flex items-center gap-1.5">
                  {selectedOpt === riddle.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-emerald-800">
                        सही उत्तर! {riddle.answerSantaliDev} ({riddle.answerRoman}) — {riddle.answerHindi}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="text-rose-800">
                        गलत उत्तर! सही उत्तर: {riddle.answerSantaliDev} ({riddle.answerRoman}) — {riddle.answerHindi}
                      </span>
                    </>
                  )}
                </div>
                <p className="leading-relaxed">{riddle.explanation}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={handleResetQuiz}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रीसेट</span>
              </button>

              <button
                onClick={handleNextRiddle}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>अगली पहेली</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="space-y-4">
            {LANDA_STORIES.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-amber-800 font-semibold">{s.santaliTitle}</span>
                    <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  </div>

                  <button
                    onClick={() =>
                      speakWithFemaleVoice(`${s.title}। ${s.storySantaliDev}। ${s.storyHindi}`, {
                        lang: 'hi-IN',
                        rate: 0.9
                      })
                    }
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>कहानी सुनें</span>
                  </button>
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-2">
                  <div className="text-sm font-semibold text-slate-900 leading-relaxed whitespace-pre-wrap">
                    {s.storySantaliDev}
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed border-t border-amber-200/50 pt-2">
                    <strong>हिन्दी अनुवाद:</strong> {s.storyHindi}
                  </div>
                </div>

                <div className="text-xs text-amber-900 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>लोक-व्यंग्य व सीख: {s.moralWit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
