import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  RotateCcw,
  MessageSquare,
  Award,
  Info
} from 'lucide-react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';

interface ComicDialogue {
  speaker: string;
  speakerRole: 'narrator' | 'character1' | 'character2';
  santaliDevanagari: string;
  santaliRoman: string;
  hindiTranslation: string;
  pitch: number;
}

interface ComicFrame {
  frameNumber: number;
  sceneTitle: string;
  illustrationTheme: string;
  backgroundGradient: string;
  soundEffect?: string;
  characterIcons: string[];
  dialogues: ComicDialogue[];
  sceneContext: string;
}

interface ComicStory {
  id: string;
  titleDevanagari: string;
  titleRoman: string;
  hindiTitle: string;
  moralLesson: string;
  culturalInsight: string;
  characters: { name: string; icon: string; role: string }[];
  frames: ComicFrame[];
}

const COMIC_STORIES: ComicStory[] = [
  {
    id: 'tuñiu_kuilu',
    titleDevanagari: 'चालाक तूंईऊ आर कुईलू',
    titleRoman: 'Chalak Tuñiu ar Kuilu',
    hindiTitle: 'चालाक लोमड़ी और सियार की जामुन कथा',
    moralLesson: 'चालाकी से कभी स्थायी फल नहीं मिलता; प्रकृति का सच्चा आनंद मिल-बांटकर खाने में ही है।',
    culturalInsight: 'संताली लोक-कथाओं में तूंईऊ (लोमड़ी) चतुर बुद्धि और कुईलू (सियार) भोली नकलची प्रवृत्ति का प्रतीक माने जाते हैं।',
    characters: [
      { name: 'तूंईऊ (लोमड़ी)', icon: '🦊', role: 'चतुर लोमड़ी' },
      { name: 'कुईलू (सियार)', icon: '🐺', role: 'भोला सियार' },
      { name: 'कथावाचक', icon: '📜', role: 'बुजुर्ग मांझी हड़ाम' }
    ],
    frames: [
      {
        frameNumber: 1,
        sceneTitle: 'साल वन में पके जामुन का पेड़',
        illustrationTheme: 'गहन साल वन, सूर्य की किरणें और लहलहाता जामुन का पेड़',
        backgroundGradient: 'from-amber-50 via-white to-stone-50',
        soundEffect: 'सर्रर... सर्रर...',
        characterIcons: ['🦊'],
        sceneContext: 'बरसात के बाद बीर (जंगल) में जामुन खूब पके थे। तूंईऊ (लोमड़ी) भूख से व्याकुल होकर मीठे फलों को ललचाई नजरों से देख रही थी।',
        dialogues: [
          {
            speaker: 'कथावाचक',
            speakerRole: 'narrator',
            santaliDevanagari: 'बीर ताला रे कुद दारारे बेले कुद झुलौ काना। तूंईऊ दोए लाहा येना।',
            santaliRoman: 'Bir tala re kud darare bele kud jhulo kana. Tuñiu doe laha yena.',
            hindiTranslation: 'जंगल के बीच जामुन की डालियों पर पके-पके जामुन झूल रहे थे। लोमड़ी आगे बढ़ी।',
            pitch: 1.0
          },
          {
            speaker: 'तूंईऊ (लोमड़ी)',
            speakerRole: 'character1',
            santaliDevanagari: 'आहा! चेत् लेकान हेड़ेम कुद! मेनखान चेकातेञ देजा?',
            santaliRoman: 'Aha! Chet lekan heṛem kud! Menkhan chekateñ deja?',
            hindiTranslation: 'अहा! कितने मीठे जामुन हैं! पर मैं ऊपर कैसे चढूँ?',
            pitch: 1.3
          }
        ]
      },
      {
        frameNumber: 2,
        sceneTitle: 'कुईलू (सियार) का आगमन',
        illustrationTheme: 'झाड़ियों से सियार निकलता है, दोनों की मुलाकात',
        backgroundGradient: 'from-stone-50 via-white to-emerald-50',
        soundEffect: 'हुक्का-हू!',
        characterIcons: ['🦊', '🐺'],
        sceneContext: 'तभी वहां कुईलू (सियार) पहुंचा। लोमड़ी ने तुरंत एक मनगढ़ंत योजना बनाई।',
        dialogues: [
          {
            speaker: 'कुईलू (सियार)',
            speakerRole: 'character2',
            santaliDevanagari: 'जोहार गाते तूंईऊ! चेत् एम ञेलोक काना?',
            santaliRoman: 'Johar gate tuñiu! Chet em ñelok kana?',
            hindiTranslation: 'जोहार मित्र लोमड़ी! तुम ऊपर क्या देख रहे हो?',
            pitch: 0.9
          },
          {
            speaker: 'तूंईऊ (लोमड़ी)',
            speakerRole: 'character1',
            santaliDevanagari: 'आम दो गातेञ कानाम, इञाः देया रे देज मे आर डाल हिलेव मे!',
            santaliRoman: 'Am do gateñ kanam, iñaḥ deya re dej me ar dal hilew me!',
            hindiTranslation: 'तुम मेरे सच्चे मित्र हो, मेरी पीठ पर चढ़कर डाल को हिलाओ!',
            pitch: 1.35
          }
        ]
      },
      {
        frameNumber: 3,
        sceneTitle: 'डाल हिलती है और जामुन की बारिश',
        illustrationTheme: 'सियार डाल हिलाता है, जामुनों की बरसात होती है',
        backgroundGradient: 'from-purple-50 via-white to-stone-50',
        soundEffect: 'टप-टप-टप!',
        characterIcons: ['🐺', '🍇', '🦊'],
        sceneContext: 'कुईलू ने पूरी ताकत से डाल हिला दी। जामुनों की बौछार दोनों के ऊपर होने लगी।',
        dialogues: [
          {
            speaker: 'कथावाचक',
            speakerRole: 'narrator',
            santaliDevanagari: 'कुद दारे हिलौ येना, बेले बेले कुद ओत रे ञुर बाड़ाय येना।',
            santaliRoman: 'Kud dare hilow yena, bele bele kud ot re ñur baṛay yena.',
            hindiTranslation: 'पेड़ हिल उठा और काले-काले मीठे जामुन जमीन पर टपकने लगे।',
            pitch: 1.0
          },
          {
            speaker: 'कुईलू (सियार)',
            speakerRole: 'character2',
            santaliDevanagari: 'ञुरुक काना गाते! लाहा रे सांव ते लाम जोमा!',
            santaliRoman: 'Ñuruk kana gate! Laha re sañw te lam joma!',
            hindiTranslation: 'गिर रहे हैं दोस्त! चलो नीचे मिलकर खाते हैं!',
            pitch: 0.9
          }
        ]
      },
      {
        frameNumber: 4,
        sceneTitle: 'साझा भोज और वन की शांति',
        illustrationTheme: 'दोनों पत्तों पर जामुन रखकर आनंद से खा रहे हैं',
        backgroundGradient: 'from-emerald-50 via-white to-stone-50',
        soundEffect: 'हेड़ेम गेया!',
        characterIcons: ['🦊', '🐺', '✨'],
        sceneContext: 'लोमड़ी ने अपनी चालाकी छोड़ी और दोनों ने साल के पत्तों पर जामुन सजाकर खाया। दोनों पक्के मित्र बन गए।',
        dialogues: [
          {
            speaker: 'तूंईऊ व कुईलू',
            speakerRole: 'character1',
            santaliDevanagari: 'हाटिञ काते जोम रे आदो आडी रासका! मारंग बुरु गे सगोय!',
            santaliRoman: 'Hatiñ kate jom re ado aḍi raska! Marang Buru ge sagoy!',
            hindiTranslation: 'बांटकर खाने में ही सच्चा आनंद है! मारंग बुरु की जय!',
            pitch: 1.15
          },
          {
            speaker: 'कथावाचक',
            speakerRole: 'narrator',
            santaliDevanagari: 'नोंका गे अबो मानवा को हों सांव ते ताहेन दोरकार।',
            santaliRoman: 'Nonka ge abo manwa ko hoñ sañw te tahen dorkar.',
            hindiTranslation: 'इसी प्रकार हम सभी मनुष्यों को भी प्रेम और एकता से मिल-जुलकर रहना चाहिए।',
            pitch: 1.0
          }
        ]
      }
    ]
  },
  {
    id: 'tarup_sadom',
    titleDevanagari: 'तारुप आर सादोम',
    titleRoman: 'Tarup ar Sadom',
    hindiTitle: 'चीता और जंगली घोड़े की दौड़',
    moralLesson: 'अपनी क्षमता पर अभिमान नहीं करना चाहिए; प्रत्येक प्राणी की अपनी विशिष्ट विशेषता और शक्ति होती है।',
    culturalInsight: 'संताली संस्कृति में सादोम (घोड़ा) निष्ठा और धैर्य का प्रतीक है, जबकि तारुप (चीता) शक्ति परंतु उतावलेपन का।',
    characters: [
      { name: 'तारुप (चीता)', icon: '🐆', role: 'घमंडी चीता' },
      { name: 'सादोम (घोड़ा)', icon: '🐎', role: 'धैर्यवान जंगली घोड़ा' },
      { name: 'कथावाचक', icon: '📜', role: 'बुजुर्ग नायके' }
    ],
    frames: [
      {
        frameNumber: 1,
        sceneTitle: 'दलमा की ऊंची पहाड़ियों पर चुनौती',
        illustrationTheme: 'दलमा पहाड़ की चट्टान पर चीता दहाड़ता हुआ',
        backgroundGradient: 'from-amber-50 via-white to-stone-50',
        soundEffect: 'गुर्र्र्र...!',
        characterIcons: ['🐆'],
        sceneContext: 'दलमा की पहाड़ियों में तारुप अपने तेज पंजों और छलांग पर बड़ा घमंड करता था।',
        dialogues: [
          {
            speaker: 'तारुप (चीता)',
            speakerRole: 'character1',
            santaliDevanagari: 'इञ खोन चोहोड़ा आर चंचल ओकोए मेनाया नोवा बुरू रे?',
            santaliRoman: 'Iñ khon chohoṛa ar chanchal okoe menaya nowa buru re?',
            hindiTranslation: 'इस पहाड़ पर मुझसे अधिक फुर्तीला और बलवान कौन है?',
            pitch: 0.85
          }
        ]
      },
      {
        frameNumber: 2,
        sceneTitle: 'नदी किनारे सादोम से भेंट',
        illustrationTheme: 'सुवर्णरेखा नदी किनारे शांत खड़ा घोड़ा',
        backgroundGradient: 'from-blue-50 via-white to-cyan-50',
        soundEffect: 'हिन-हिन...!',
        characterIcons: ['🐆', '🐎'],
        sceneContext: 'सादोम नदी पर जल पी रहा था। चीते ने उसे पथरीली घाटी पार करने की दौड़ की चुनौती दी।',
        dialogues: [
          {
            speaker: 'तारुप (चीता)',
            speakerRole: 'character1',
            santaliDevanagari: 'ए सादोम! आम दो दलमा बुरू खोन गाड़ा धारी दोड़ दारेयामा?',
            santaliRoman: 'E Sadom! Am do Dalma buru khon gaṛa dhari doṛ dareyama?',
            hindiTranslation: 'अरे घोड़े! क्या तुम दलमा पहाड़ से नदी तट तक दौड़ लगा सकते हो?',
            pitch: 0.9
          },
          {
            speaker: 'सादोम (घोड़ा)',
            speakerRole: 'character2',
            santaliDevanagari: 'हेँ गाते तारुप, मारंग बुरुवाः दया ते चेदाः बां दोड़ दारेया?',
            santaliRoman: 'Heñ gate Tarup, Marang Buruwaḥ daya te chedaḥ bañ doṛ dareya?',
            hindiTranslation: 'हाँ मित्र चीते, मारंग बुरु की कृपा से क्यों नहीं दौड़ सकूंगा?',
            pitch: 1.1
          }
        ]
      },
      {
        frameNumber: 3,
        sceneTitle: 'पथरीली घाटी की कठिन परीक्षा',
        illustrationTheme: 'तीखे पत्थरों पर दौड़ते हुए दोनों, चीते के पंजे छिलते हैं',
        backgroundGradient: 'from-red-50 via-white to-amber-50',
        soundEffect: 'धम-धम-धम!',
        characterIcons: ['🐎', '💨', '🐆'],
        sceneContext: 'तीखे पत्थरों पर चीते के कोमल पंजे छिल गए, जबकि घोड़े की मजबूत खुरों ने उसे बिना रुके आगे बढ़ाया।',
        dialogues: [
          {
            speaker: 'कथावाचक',
            speakerRole: 'narrator',
            santaliDevanagari: 'धिरि हाट रे तारुप दोए तोहोत् येना, मेनखान सादोम दो खुरा तेय चोड़हौ येना।',
            santaliRoman: 'Dhiri hat re Tarup doe tohot yena, menkhan Sadom doe khura tey choṛhow yena.',
            hindiTranslation: 'पथरीली घाटी में चीता लड़खड़ा गया, पर घोड़ा अपनी मजबूत खुरों से आगे निकल गया।',
            pitch: 1.0
          },
          {
            speaker: 'तारुप (चीता)',
            speakerRole: 'character1',
            santaliDevanagari: 'हाए रे! इञाः रामा दो घाव येना, इञ दोञ हाराव येना!',
            santaliRoman: 'Haye re! Iñaḥ rama do ghaw yena, iñ doñ haraw yena!',
            hindiTranslation: 'हाय! मेरे पंजे छिल गए, मैं हार मान गया!',
            pitch: 0.8
          }
        ]
      },
      {
        frameNumber: 4,
        sceneTitle: 'सद्भाव और परस्पर आदर',
        illustrationTheme: 'सादोम वापस लौटकर चीते की मदद करता है',
        backgroundGradient: 'from-emerald-50 via-white to-stone-50',
        soundEffect: 'जोहार!',
        characterIcons: ['🐎', '🤝', '🐆'],
        sceneContext: 'सादोम ने लौटकर चीते के घावों पर वनस्पति औषधि का लेप लगाया। चीते का घमंड टूट गया।',
        dialogues: [
          {
            speaker: 'सादोम (घोड़ा)',
            speakerRole: 'character2',
            santaliDevanagari: 'तारुप गाते, बुरू रे आम दो राजा कानाम, इञ दो लाहा-तायोम होर। ओकोए हों छोट बां काना!',
            santaliRoman: 'Tarup gate, buru re am do raja kanam, iñ do laha-tayom hor. Okoe hoñ chhot bañ kana!',
            hindiTranslation: 'मित्र चीते, जंगल में तुम राजा हो और मैं पथिक। कोई भी छोटा या बड़ा नहीं होता!',
            pitch: 1.1
          },
          {
            speaker: 'कथावाचक',
            speakerRole: 'narrator',
            santaliDevanagari: 'उन जोखा खोन तारुप आर सादोम बानार गाते किन बेनाव येना।',
            santaliRoman: 'Un jokha khon Tarup ar Sadom banar gate kin benaw yena.',
            hindiTranslation: 'उस दिन से चीता और घोड़ा दोनों आपस में घनिष्ठ मित्र बन गए।',
            pitch: 1.0
          }
        ]
      }
    ]
  }
];

export const SantaliIllustratedComicsReader: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<ComicStory>(COMIC_STORIES[0]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [activeDialogueIndex, setActiveDialogueIndex] = useState<number | null>(null);

  const currentFrame = selectedStory.frames[currentFrameIndex];

  // Stop audio on change
  useEffect(() => {
    stopSpeaking();
    setIsPlayingAudio(false);
    setActiveDialogueIndex(null);
  }, [selectedStory, currentFrameIndex]);

  // Autoplay timer
  useEffect(() => {
    let timer: any;
    if (isAutoPlay) {
      timer = setTimeout(() => {
        if (currentFrameIndex < selectedStory.frames.length - 1) {
          setCurrentFrameIndex(prev => prev + 1);
        } else {
          setIsAutoPlay(false);
        }
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlay, currentFrameIndex, selectedStory.frames.length]);

  const handlePlayFrameAudio = async () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      setActiveDialogueIndex(null);
      return;
    }

    setIsPlayingAudio(true);
    for (let i = 0; i < currentFrame.dialogues.length; i++) {
      setActiveDialogueIndex(i);
      const dialogue = currentFrame.dialogues[i];
      const spokenText = `${dialogue.speaker}: ${dialogue.santaliDevanagari}. अर्थात्: ${dialogue.hindiTranslation}`;
      speakWithFemaleVoice(spokenText, { lang: 'hi-IN', pitch: dialogue.pitch });
      // delay between speakers
      await new Promise(r => setTimeout(r, 2800));
    }
    setIsPlayingAudio(false);
    setActiveDialogueIndex(null);
  };

  const handleNextFrame = () => {
    if (currentFrameIndex < selectedStory.frames.length - 1) {
      setCurrentFrameIndex(prev => prev + 1);
    }
  };

  const handlePrevFrame = () => {
    if (currentFrameIndex > 0) {
      setCurrentFrameIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      {/* Header Banner */}
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200 p-6 rounded-none shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>सचित्र संताली कॉमिक्स व लोककथा वाचक | Santali Illustrated Visual Comic Reader</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950 tracking-tight">
              {selectedStory.titleDevanagari} ({selectedStory.titleRoman})
            </h1>
            <p className="text-amber-800 text-sm mt-1">{selectedStory.hindiTitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors border ${
                isAutoPlay
                  ? 'bg-amber-600 text-white border-amber-400'
                  : 'bg-white hover:bg-stone-100 text-amber-800 border-amber-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAutoPlay ? 'ऑटोप्ले चालू (Auto-Play)' : 'ऑटोप्ले स्लाइडर'}</span>
            </button>

            <button
              onClick={handlePlayFrameAudio}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors border ${
                isPlayingAudio
                  ? 'bg-rose-700 hover:bg-rose-600 text-white border-rose-500'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>वाचन रोकें (Pause)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>फ्रेम संवाद सुनें (Listen Frame)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Story Selector tabs */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-amber-200 overflow-x-auto">
          {COMIC_STORIES.map(story => (
            <button
              key={story.id}
              onClick={() => {
                setSelectedStory(story);
                setCurrentFrameIndex(0);
              }}
              className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedStory.id === story.id
                  ? 'bg-amber-600 text-white border-amber-400 font-bold'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-200'
              }`}
            >
              {story.titleDevanagari} ({story.titleRoman})
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Comic Frame Panel (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div
            className={`border-2 border-amber-200 p-6 shadow-sm relative bg-gradient-to-br ${currentFrame.backgroundGradient} transition-all duration-300 min-h-[460px] flex flex-col justify-between`}
          >
            {/* Top Frame Meta */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-700 border border-amber-500/40 px-2 py-0.5 text-xs font-mono font-bold">
                  FRAME {currentFrame.frameNumber} / {selectedStory.frames.length}
                </span>
                <span className="text-stone-700 text-sm font-semibold">{currentFrame.sceneTitle}</span>
              </div>
              {currentFrame.soundEffect && (
                <span className="bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-0.5 text-xs font-bold tracking-wider animate-pulse">
                  {currentFrame.soundEffect}
                </span>
              )}
            </div>

            {/* Visual Characters Display & Atmosphere */}
            <div className="my-6 flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center gap-6 my-4">
                {currentFrame.characterIcons.map((icon, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 bg-white border-2 border-amber-500/40 flex items-center justify-center text-4xl shadow-inner transform hover:scale-105 transition-transform"
                  >
                    {icon}
                  </div>
                ))}
              </div>
              <p className="text-xs text-amber-700 italic max-w-lg bg-stone-50 px-4 py-2 border border-amber-200">
                दृश्यावलोकन: {currentFrame.sceneContext}
              </p>
            </div>

            {/* Speech Bubbles / Dialogue Area */}
            <div className="space-y-3 mt-4">
              {currentFrame.dialogues.map((dlg, dIdx) => {
                const isActive = activeDialogueIndex === dIdx;
                const isNarrator = dlg.speakerRole === 'narrator';
                return (
                  <div
                    key={dIdx}
                    className={`p-3.5 border transition-all ${
                      isActive
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/50 shadow-lg'
                        : isNarrator
                        ? 'bg-white border-stone-200 text-stone-900'
                        : 'bg-stone-50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{dlg.speaker}</span>
                      </div>
                      <button
                        onClick={() =>
                          speakWithFemaleVoice(
                            `${dlg.speaker}: ${dlg.santaliDevanagari}. हिन्दी अर्थ: ${dlg.hindiTranslation}`,
                            { lang: 'hi-IN', pitch: dlg.pitch }
                          )
                        }
                        className="text-stone-600 hover:text-amber-700 p-1"
                        title="यह संवाद सुनें"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Santali Devanagari */}
                    <p className="text-base font-bold text-amber-950">{dlg.santaliDevanagari}</p>

                    {/* Santali Roman Phonetics */}
                    <p className="text-xs text-amber-700 font-mono mt-0.5">{dlg.santaliRoman}</p>

                    {/* Hindi translation */}
                    <p className="text-xs text-stone-700 mt-1 border-t border-stone-200 pt-1">
                      <span className="text-amber-500 font-semibold">अर्थात्:</span> {dlg.hindiTranslation}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Frame Navigation Controls */}
            <div className="flex items-center justify-between border-t border-amber-500/20 pt-4 mt-4">
              <button
                onClick={handlePrevFrame}
                disabled={currentFrameIndex === 0}
                className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-white border border-amber-200 text-stone-900"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>पिछला फ्रेम</span>
              </button>

              {/* Thumbnails */}
              <div className="flex gap-1.5">
                {selectedStory.frames.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentFrameIndex(idx)}
                    className={`w-7 h-7 text-xs font-bold flex items-center justify-center border transition-all ${
                      currentFrameIndex === idx
                        ? 'bg-amber-600 text-white border-amber-300 shadow'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-amber-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextFrame}
                disabled={currentFrameIndex === selectedStory.frames.length - 1}
                className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:hover:bg-amber-600 border border-amber-400 text-stone-950 font-bold"
              >
                <span>अगला फ्रेम</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info & Characters (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Characters in this Story */}
          <div className="bg-white border border-amber-200 p-4 shadow-md">
            <h3 className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>कथा पात्र (Story Characters)</span>
            </h3>
            <div className="space-y-2">
              {selectedStory.characters.map((char, cIdx) => (
                <div
                  key={cIdx}
                  className="flex items-center gap-3 p-2 bg-stone-50 border border-stone-200 hover:border-amber-200 transition-colors"
                >
                  <span className="text-2xl">{char.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-amber-800">{char.name}</p>
                    <p className="text-[11px] text-stone-600">{char.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Moral Lesson */}
          <div className="bg-white border border-emerald-200 p-4 shadow-md">
            <h3 className="text-xs uppercase tracking-wider text-emerald-700 font-semibold mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>कथा की सीख (Moral Wisdom)</span>
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-2.5 border border-stone-200">
              {selectedStory.moralLesson}
            </p>
          </div>

          {/* Cultural Context */}
          <div className="bg-white border border-amber-200 p-4 shadow-md">
            <h3 className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-700" />
              <span>सांस्कृतिक पृष्ठभूमि (Cultural Context)</span>
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-2.5 border border-stone-200">
              {selectedStory.culturalInsight}
            </p>
          </div>

          {/* Guide Box */}
          <div className="bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
            <p className="font-semibold text-amber-700 mb-1">संताली कॉमिक्स वाचक निर्देश:</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-stone-700">
              <li>प्रत्येक फ्रेम के संवाद को एक-एक करके सुनने हेतु 'फ्रेम संवाद सुनें' दबाएं।</li>
              <li>किसी एक संवाद को सुनने के लिए उसके बगल के स्पीकर आइकॉन पर क्लिक करें।</li>
              <li>ऑटोप्ले मोड चालू करने से हर ७ सेकंड पर अगला फ्रेम स्वतः बदलता है।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
