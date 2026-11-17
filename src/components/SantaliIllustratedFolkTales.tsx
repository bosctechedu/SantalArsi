import React, { useState, useEffect } from 'react';
import { speakWithFemaleVoice } from '../utils/speech';
import { toggleFavorite, isFavorite } from '../utils/favoritesStorage';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { useAdmin } from '../context/AdminContext';
import { SantaliWord } from '../types';
import {
  BookOpen,
  Volume2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Heart,
  Search
} from 'lucide-react';

interface StoryScene {
  sceneNumber: number;
  santaliDev: string;
  santaliRoman: string;
  hindiTranslation: string;
  illustrationNote: string;
}

interface FolkStory {
  id: string;
  titleDevanagari: string;
  titleRoman: string;
  categoryLabel: string;
  summary: string;
  moralWisdom: string;
  scenes: StoryScene[];
}

const STORY_GLOSSARY: Record<string, { hindi: string; english: string; roman: string }> = {
  'सेदाय-सेदाय': { hindi: 'बहुत प्राचीन काल में', english: 'Long ago / ancient times', roman: 'Seday-seday' },
  'ओते-धर्ती': { hindi: 'भूमि / पृथ्वी', english: 'Land / Earth', roman: 'Ote-dharti' },
  'दाहाक्': { hindi: 'जल / पानी', english: 'Water', roman: 'Dahah' },
  'ठाकुर': { hindi: 'सृष्टिकर्ता ईश्वर', english: 'Supreme Creator', roman: 'Thakur' },
  'जियू': { hindi: 'प्राण / आत्मा / भगवान', english: 'Life / Soul / Spirit', roman: 'Jiyu' },
  'हांस-हाँसिल': { hindi: 'हंस और हंसिनी', english: 'Pair of sacred swans', roman: 'Hans-Hansil' },
  'चेँड़े': { hindi: 'पक्षी / चिड़िया', english: 'Bird', roman: 'Chenre' },
  'करम': { hindi: 'करम वृक्ष / शुभ कर्म', english: 'Karam tree / Karma', roman: 'Karam' },
  'दारे': { hindi: 'पेड़ / वृक्ष', english: 'Tree', roman: 'Dare' },
  'तुका': { hindi: 'घोंसला', english: 'Nest', roman: 'Tuka' },
  'बिल्ली': { hindi: 'अंडा', english: 'Egg', roman: 'Billi' },
  'बिलि': { hindi: 'अंडा', english: 'Egg', roman: 'Bili' },
  'हाड़ाम': { hindi: 'बुज़ुर्ग पुरुष / पूर्वज', english: 'Elder / Forefather', roman: 'Haram' },
  'बूढ़ी': { hindi: 'बुज़ुर्ग महिला / आदि जननी', english: 'Elder woman / Foremother', roman: 'Budhi' },
  'कोड़ा': { hindi: 'लड़का / युवक', english: 'Boy / Young man', roman: 'Kora' },
  'कुड़ी': { hindi: 'लड़की / युवती', english: 'Girl / Young woman', roman: 'Kuri' },
  'गिद्रा': { hindi: 'बच्चे / संतान', english: 'Children', roman: 'Gidra' },
  'पारिस': { hindi: 'गोत्र / कुल', english: 'Clan / Lineage', roman: 'Paris' },
  'सिरजोन': { hindi: 'सृष्टि / निर्माण', english: 'Creation', roman: 'Sirjon' },
  'आतु': { hindi: 'गाँव', english: 'Village', roman: 'Atu' },
  'बोयहा': { hindi: 'भाई', english: 'Brother', roman: 'Boyha' },
  'सेंदरा': { hindi: 'वार्षिक वन शिकार / अभियान', english: 'Traditional forest hunt', roman: 'Sendra' },
  'बिर': { hindi: 'जंगल / वन', english: 'Forest', roman: 'Bir' },
  'तूंईऊ': { hindi: 'सियार / लोमड़ी', english: 'Jackal / Fox', roman: 'Tuiu' },
  'दाका': { hindi: 'पका हुआ भात / भोजन', english: 'Cooked rice / Meal', roman: 'Daka' },
  'अकिल': { hindi: 'बुद्धि / समझदारी', english: 'Wisdom / Intelligence', roman: 'Akil' },
  'सानाम': { hindi: 'सभी / समस्त', english: 'All / Entire', roman: 'Sanam' },
  'होड़': { hindi: 'मनुष्य / संताल व्यक्ति', english: 'Human / Santal person', roman: 'Hor' },
  'रासका': { hindi: 'आनंद / खुशी', english: 'Joy / Happiness', roman: 'Raska' },
  'सेरेञ': { hindi: 'गीत / गाना', english: 'Song', roman: 'Serenj' },
  'मांदर': { hindi: 'पारंपरिक ढोल (तुम्दाक्)', english: 'Traditional drum', roman: 'Tumdak' },
  'अखड़ा': { hindi: 'गाँव का नृत्य व सभा स्थल', english: 'Village dance & gathering ground', roman: 'Akhra' },
  'बोंगा': { hindi: 'देवता / पवित्र शक्ति', english: 'Deity / Sacred spirit', roman: 'Bonga' },
  'चावले': { hindi: 'चावल', english: 'Rice', roman: 'Chawle' },
  'रेंगेच्': { hindi: 'गरीबी / भूख', english: 'Hunger / Poverty', roman: 'Rengech' }
};

const FOLK_STORIES: FolkStory[] = [
  {
    id: 's1',
    titleDevanagari: 'पिलचु हाड़ाम आर पिलचु बूढ़ी (मानव उत्पत्ति व 12 कुलों का जन्म)',
    titleRoman: 'Pilchu Haram & Pilchu Budhi',
    categoryLabel: 'सृष्टि उत्पत्ति गाथा (Origin Myth)',
    summary:
      'हंस-हंसिनी (हाँस-हाँसिल) के अंडों से उत्पन्न मानव के आदि पुरखे पिलचु हाड़ाम और पिलचु बूढ़ी की अमर गाथा, जिनसे संताल समाज के 12 गोत्रों (पारिस) की उत्पत्ति हुई।',
    moralWisdom:
      'प्रकृति और सभी जीवों के साथ संतुलन, सह-अस्तित्व और अपने पूर्वजों के संस्कारों का सदैव स्मरण रखना।',
    scenes: [
      {
        sceneNumber: 1,
        santaliDev:
          'सेदाय-सेदाय रे, ओका रे हों ओते-धर्ती बां ताहेकाना। सानाम सेन् खाली दाहाक् आर दाहाक् गे ताहेकाना।',
        santaliRoman:
          'Seday-seday re, oka re hon ote-dharti ban tahekana. Sanam sen khali dahah ar dahah ge tahekana.',
        hindiTranslation:
          'बहुत प्राचीन काल में, कहीं भी भूमि अथवा धरती नहीं थी। चारों ओर केवल और केवल अथाह जल ही जल था।',
        illustrationNote: 'चारों ओर नीले जल की अनंत लहरें और ऊपर खुला आकाश।'
      },
      {
        sceneNumber: 2,
        santaliDev:
          'ठाकुर जियू दो मित् जोड़ा हांस-हाँसिल चेँड़े तेयार केत् किना। उकिन दो करम दारे रे तुका बेनाव काते बारया बिल्ली (बिलि) किन एरात्-आ।',
        santaliRoman:
          'Thakur Jiyu do mit jora Hans-Hansil chenre teyar ket kina. Ukin do Karam dare re tuka benaw kate barya billi kin erat-a.',
        hindiTranslation:
          'सृष्टिकर्ता ठाकुर जियू ने हंस और हंसिनी (हाँस-हाँसिल) का एक जोड़ा बनाया। उन्होंने करम वृक्ष पर घोंसला बनाकर दो अंडे दिए।',
        illustrationNote: 'करम वृक्ष की हरी शाखा पर दिव्य हंस-हंसिनी और उनके दो सुनहरे अंडे।'
      },
      {
        sceneNumber: 3,
        santaliDev:
          'उना बिलि खोन गे मानव कोवाक् आदि पुरखा ‘पिलचु हाड़ाम’ आर ‘पिलचु बूढ़ी’ किन जनम एना। उकिन दो हिहिड़ी-पिपिड़ी रे हारा-बुरु एनाकिन।',
        santaliRoman:
          'Una bili khon ge manaw kowah adi purkha Pilchu Haram ar Pilchu Budhi kin janam ena. Ukin do Hihiri-Pipiri re hara-buru enakin.',
        hindiTranslation:
          'उन अंडों से मानव जाति के आदि जनक "पिलचु हाड़ाम" और आदि जननी "पिलचु बूढ़ी" का जन्म हुआ। वे पावन हिहिड़ी-पिपिड़ी देश में बड़े हुए।',
        illustrationNote: 'फूलों और वन्य लताओं से घिरे हिहिड़ी-पिपिड़ी के वन में प्रथम मानव युगल।'
      },
      {
        sceneNumber: 4,
        santaliDev:
          'उकिन रेन एयात कोड़ा आर एयात कुड़ी गिद्रा को जनम एना। उकु-चुकु खेल तायोम उकुन कोवाक् मिलान एना आर संताल कोवाक् बारो पारिस (12 कुलों) रेयाक् सिरजोन एना।',
        santaliRoman:
          'Ukin ren eyat kora ar eyat kuri gidra ko janam ena. Uku-chuku khel tayom ukun kowah milan ena ar Santal kowah baro paris reyah sirjon ena.',
        hindiTranslation:
          'उनके सात पुत्र और सात पुत्रियां हुईं। लुका-छिपी के खेल के बाद उनका विवाह संस्कार हुआ और संतालों के 12 पावन कुलों (मुर्मू, हेम्ब्रम, सोरेन, किस्कू आदि) की स्थापना हुई।',
        illustrationNote: 'खुशहाल 12 कुलों के पूर्वज जो अखंड प्रकृति की गोद में नृत्य और संगीत कर रहे हैं।'
      }
    ]
  },
  {
    id: 's2',
    titleDevanagari: 'तुरूई कोड़ा आर चालाक तूंईऊ (छह भाई और चतुर सियार की लोककथा)',
    titleRoman: 'Turui Koda ar Chalak Tuiu',
    categoryLabel: 'नैतिक नीति कथा (Fable & Wisdom)',
    summary:
      'वनों में शिकार करने गए छह सीधे-सादे संताल भाइयों और एक धूर्त सियार (तूंईऊ) के बीच घटी हास्यप्रद व शिक्षाप्रद लोककथा।',
    moralWisdom:
      'दूसरों की मीठी बातों और चापलूसी में बिना सोचे-समझे विश्वास नहीं करना चाहिए; बुद्धि बल से बड़ी होती है।',
    scenes: [
      {
        sceneNumber: 1,
        santaliDev:
          'मित् टान् आतु रे तुरूई बोयहा कोड़ा को ताहेकाना। उकुन दो सांव ते सेंदरा (शिकार) चालाव को कुशी-आक् ताहेना।',
        santaliRoman:
          'Mit tan atu re turui boyha kora ko tahekana. Ukun do sanw te sendra chalaw ko kushi-ah tahena.',
        hindiTranslation:
          'एक गांव में छह सगे भाई रहते थे। वे सभी एक साथ वनों में शिकार (सेंदरा) करने जाना बहुत पसंद करते थे।',
        illustrationNote: 'तीर-धनुष लिए छह उत्साही नौजवान भाई घने साल वन की ओर बढ़ते हुए।'
      },
      {
        sceneNumber: 2,
        santaliDev:
          'बिर ताला रे मित् टान् आडी चालाक तूंईऊ (सियार) उकुन ठीन् सेतेर एना आर रोड़ केत्-आ— "ए दा को! आपे सांव इञ हों सेंदरा चालाव इञ मेन्-एदा।"',
        santaliRoman:
          'Bir tala re mit tan adi chalak tuiu ukun thin seter ena ar ror ket-a— "E da ko! Ape sanw iny hon sendra chalaw iny men-eda."',
        hindiTranslation:
          'जंगल के बीच एक बहुत चतुर सियार उनके पास आया और बोला— "अरे बड़े भाइयों! मैं भी आप सबके साथ शिकार पर चलना चाहता हूँ।"',
        illustrationNote: 'पेड़ों की ओट से झांकता हुआ चालाक सियार जो मुस्कुराकर भाइयों को रिझा रहा है।'
      },
      {
        sceneNumber: 3,
        santaliDev:
          'तूंईऊ दो सानाम दाका आर शिकार को खुद गे जोम चाबा केत्-आ आर भाइ को धोका-ए एम-आत् कोवा।',
        santaliRoman:
          'Tuiu do sanam daka ar shikar ko khud ge jom chaba ket-a ar bhai ko dhoka-e em-at kowa.',
        hindiTranslation:
          'सियार ने चालाकी से सारा भोजन और शिकार स्वयं चट कर लिया और भाइयों को धोखा दे दिया।',
        illustrationNote: 'मिट्टी की हांडी से चुपके-चुपके भोजन चुराता हुआ धूर्त सियार।'
      },
      {
        sceneNumber: 4,
        santaliDev:
          'तायोम ते हुडिंग बोयहा वाक् अकिल ते तूंईऊ-वाक् चालाकी साबो एना आर उनी बिर खोन ताड़ाव ओड़ोक केदेयाको।',
        santaliRoman:
          'Tayom te huding boyha wah akil te tuiu-wah chalaki sabo ena ar uni bir khon taraw odok kedeyako.',
        hindiTranslation:
          'अंत में सबसे छोटे भाई की बुद्धिमत्ता से सियार की पोल खुल गई और भाइयों ने उसे जंगल से दूर खदेड़ दिया।',
        illustrationNote: 'छोटा भाई उंगली दिखाकर सच उजागर करता हुआ और सियार दुम दबाकर भागता हुआ।'
      }
    ]
  },
  {
    id: 's3',
    titleDevanagari: 'करम आर धरम (दो भाइयों और करम वृक्ष का पावन विधान)',
    titleRoman: 'Karam & Dharam',
    categoryLabel: 'पर्व कथा (Festival Myth)',
    summary:
      'करम और धरम नामक दो भाइयों की कथा, जिन्होंने करम वृक्ष की डाल की पूजा कर दरिद्रता पर विजय पाई और समृद्धि प्राप्त की।',
    moralWisdom:
      'कर्म और धर्म दोनों जीवन के दो पहिए हैं; प्रकृति के वृक्षों का सम्मान करने से ही जीवन में सुख और वैभव आता है।',
    scenes: [
      {
        sceneNumber: 1,
        santaliDev:
          'करम आर धरम दो बारया बोयहा किन ताहेकाना। करम दो आडी कामिया आर धरम दो धरमीक मोने-आनिच् ताहेकाना।',
        santaliRoman:
          'Karam ar Dharam do barya boyha kin tahekana. Karam do adi kamiya ar Dharam do dharmik mone-anich tahekana.',
        hindiTranslation:
          'करम और धरम दो भाई थे। करम बहुत परिश्रमी था और धरम धर्म व संतों की सेवा करने वाला परोपकारी था।',
        illustrationNote: 'खेतों में परिश्रम करता करम और आंगन में अतिथि सेवा करता धरम।'
      },
      {
        sceneNumber: 2,
        santaliDev:
          'मित् धाव अकाल एना आर घरौंदा रे आडी रेंगेच्-जाला हेच् एना। उना बेला रे उकिन करम दारेवाक् साखा आगु काते अखड़ा रे किन रोवा केत्-आ।',
        santaliRoman:
          'Mit dhaw akal ena ar gharaunda re adi rengech-jala hech ena. Una bela re ukin Karam darewah sakha agu kate Akhra re kin rowa ket-a.',
        hindiTranslation:
          'एक बार भीषण सूखा पड़ा और परिवार में घोर दरिद्रता आ गई। तब दोनों भाइयों ने वन से करम वृक्ष की दो हरी डालियां लाकर अखड़ा में रोपीं।',
        illustrationNote: 'अखड़ा के बीच में रोपी गई पवित्र करम डाल और उसके चारों ओर जलते दीप।'
      },
      {
        sceneNumber: 3,
        santaliDev:
          'सानाम आतु होड़ सांव ते रासका ते करम गाथा को सेरेञ केत्-आ आर पूजा केत्-आको। रात-भर मांदर साड़े एना।',
        santaliRoman:
          'Sanam atu hor sanw te raska te Karam gatha ko serenj ket-a ar puja ket-ako. Rat-bhar tumdak sare ena.',
        hindiTranslation:
          'पूरे गांव वालों के साथ मिलकर उन्होंने करम गीतों का गायन किया और विधिवत आराधना की। रात भर मांदर की गूंजती थाप पर नृत्य हुआ।',
        illustrationNote: 'पारंपरिक परिधानों में सजे ग्रामीण जो करम डाल के चारों ओर घेरा बनाकर झूमर नाच रहे हैं।'
      },
      {
        sceneNumber: 4,
        santaliDev:
          'करम बोंगावाक् दया ते मुसलाधार दाहाक् जड़ी एना, खेत रे सोना लेका चावले ओदोक् एना आर रेंगेच् दूर एना।',
        santaliRoman:
          'Karam Bongawah daya te musladhar dahah jari ena, khet re sona leka chawle odok ena ar rengech dur ena.',
        hindiTranslation:
          'करम देवता की कृपा से मूसलाधार अमृत वर्षा हुई, खेतों में सोने जैसी सुनहरी फसल लहलहा उठी और भुखमरी सदा के लिए दूर हो गई।',
        illustrationNote: 'हरे-भरे लहलहाते धान के खेत और आसमान में बरसते बादल।'
      }
    ]
  }
];

export const SantaliIllustratedFolkTales: React.FC = () => {
  const { words } = useAdmin();
  const [activeStory, setActiveStory] = useState<FolkStory>(FOLK_STORIES[0]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [starred, setStarred] = useState<boolean>(false);
  const [tappedEntry, setTappedEntry] = useState<{
    word: string;
    olChiki: string;
    hindi?: string;
    english?: string;
    roman?: string;
    dictWord?: SantaliWord;
  } | null>(null);

  useEffect(() => {
    setStarred(isFavorite(activeStory.id));
    setTappedEntry(null);
  }, [activeStory.id]);

  const handleToggleFavorite = () => {
    const isNowFav = toggleFavorite({
      id: activeStory.id,
      category: 'story',
      categoryLabel: activeStory.categoryLabel,
      titleDevanagari: activeStory.titleDevanagari,
      titleRoman: activeStory.titleRoman,
      subtitle: activeStory.moralWisdom,
      summary: activeStory.summary
    });
    setStarred(isNowFav);
  };

  const currentScene = activeStory.scenes[currentSceneIndex];

  const handleStoryChange = (story: FolkStory) => {
    setActiveStory(story);
    setCurrentSceneIndex(0);
    setTappedEntry(null);
  };

  const handleNextScene = () => {
    if (currentSceneIndex < activeStory.scenes.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
      setTappedEntry(null);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
      setTappedEntry(null);
    }
  };

  const handleTapStoryWord = (rawToken: string) => {
    const clean = rawToken.replace(/[।॥,.;:!?'"()[\]—‘’“”]/g, '').trim();
    if (!clean) return;
    const gloss = STORY_GLOSSARY[clean];
    const lower = clean.toLowerCase();
    const dictWord = words.find(
      (w) =>
        w.wordDevanagari.toLowerCase() === lower ||
        w.wordRoman.toLowerCase() === lower ||
        w.wordDevanagari.includes(clean)
    );
    setTappedEntry({
      word: clean,
      olChiki: toOlChikiAuto(clean),
      hindi: gloss?.hindi || dictWord?.meaningHindi,
      english: gloss?.english || dictWord?.meaningEnglish,
      roman: gloss?.roman || dictWord?.wordRoman,
      dictWord
    });
    speakWithFemaleVoice(clean, { autoDetectLanguage: true });
  };

  const sceneTokens = currentScene.santaliDev.split(/(\s+)/);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner (Clean Light Theme) */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xs border border-teal-200">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
            <Sparkles size={14} className="text-teal-700" />
            <span>हापड़ाम कोवाक् काहिनी</span>
            <span aria-hidden="true">·</span>
            <span>टैप-शब्द अर्थ व ओल चिकी सहित</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <span>सचित्र संताली लोककथाएं (Folk Tales)</span>
            <button
              type="button"
              onClick={() =>
                speakWithFemaleVoice('सांतार हापड़ाम कोवाक् काहिनी आर लोककथा', {
                  autoDetectLanguage: true
                })
              }
              className="p-2 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors cursor-pointer"
              title="सुनें"
            >
              <Volume2 size={20} />
            </button>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            पिलचु हाड़ाम-पिलचु बूढ़ी, तुरूई कोड़ा आर चालाक तूंईऊ, तथा करम-धरम कथा — पढ़ते समय किसी भी संताली शब्द पर टैप करें और तुरंत उसका हिंदी/अंग्रेज़ी अर्थ व उच्चारण पाएं।
          </p>
        </div>
      </div>

      {/* Story Selectors */}
      <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        {FOLK_STORIES.map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => handleStoryChange(st)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl shrink-0 transition-all cursor-pointer ${
              activeStory.id === st.id
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {st.titleDevanagari}
          </button>
        ))}
      </div>

      {/* Interactive Story Reader Frame */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Story Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-teal-800 font-bold">
              <BookOpen className="w-4 h-4" />
              <span>{activeStory.categoryLabel}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1.5">
              {activeStory.titleDevanagari}
            </h2>
            <p className="text-sm font-semibold text-teal-700">{activeStory.titleRoman}</p>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">{activeStory.summary}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleFavorite}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                starred
                  ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="डायरी में सुरक्षित करें"
            >
              <Bookmark size={14} />
              <span>{starred ? 'सुरक्षित है' : 'सेव करें'}</span>
            </button>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 tabular-nums">
              दृश्य {currentSceneIndex + 1} / {activeStory.scenes.length}
            </span>
          </div>
        </div>

        {/* Visual Scene Canvas */}
        <div className="rounded-2xl p-6 sm:p-8 bg-slate-50 border border-teal-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl w-fit">
              <Bookmark size={14} />
              <span>दृश्य परिकल्पना: {currentScene.illustrationNote}</span>
            </div>
            <span className="text-xs font-semibold text-amber-800">
              शब्द का अर्थ देखने के लिए किसी भी शब्द पर टैप करें
            </span>
          </div>

          {/* Tappable Santali Words */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-relaxed">
                {sceneTokens.map((tok, idx) =>
                  /^\s+$/.test(tok) ? (
                    <span key={idx}>{tok}</span>
                  ) : (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTapStoryWord(tok)}
                      className="hover:bg-amber-200/80 hover:text-amber-950 rounded px-0.5 transition-colors cursor-pointer inline underline decoration-dotted decoration-teal-400 underline-offset-4"
                    >
                      {tok}
                    </button>
                  )
                )}
              </h3>
              <button
                type="button"
                onClick={() =>
                  speakWithFemaleVoice(currentScene.santaliDev, { autoDetectLanguage: true })
                }
                className="p-3 rounded-2xl bg-teal-700 text-white hover:bg-teal-800 transition-colors shadow-xs shrink-0 cursor-pointer"
                title="कथा वाचन सुनें"
              >
                <Volume2 size={20} />
              </button>
            </div>

            <p className="text-base font-bold text-amber-800">
              {toOlChikiAuto(currentScene.santaliDev)}
            </p>
            <p className="text-sm font-semibold text-teal-700">{currentScene.santaliRoman}</p>
          </div>

          {/* Live Tap-Word Meaning Popover */}
          {tappedEntry && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <Search className="w-4 h-4 text-amber-700" />
                  <span>{tappedEntry.word}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-800">{tappedEntry.olChiki}</span>
                  {tappedEntry.roman && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-600 font-semibold">{tappedEntry.roman}</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-800">
                  {tappedEntry.hindi ? (
                    <>
                      <strong>अर्थ:</strong> {tappedEntry.hindi}
                      {tappedEntry.english ? ` (${tappedEntry.english})` : ''}
                    </>
                  ) : (
                    'इस शब्द का ओल चिकी रूप और उच्चारण ऊपर दिखाया गया है।'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  speakWithFemaleVoice(tappedEntry.word, { autoDetectLanguage: true })
                }
                className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>दोबारा सुनें</span>
              </button>
            </div>
          )}

          {/* Hindi Translation */}
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <span className="text-xs font-bold text-slate-500 block mb-1">हिन्दी अनुवाद:</span>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
              {currentScene.hindiTranslation}
            </p>
          </div>
        </div>

        {/* Moral Wisdom Box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
          <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
            <Heart size={14} className="text-amber-600" />
            <span>नैतिक शिक्षा व जीवन दर्शन (Moral Wisdom)</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {activeStory.moralWisdom}
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={currentSceneIndex === 0}
            onClick={handlePrevScene}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>पिछला दृश्य</span>
          </button>

          <div className="flex items-center gap-1.5">
            {activeStory.scenes.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Scene ${idx + 1}`}
                onClick={() => {
                  setCurrentSceneIndex(idx);
                  setTappedEntry(null);
                }}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentSceneIndex ? 'w-6 bg-teal-700' : 'w-2.5 bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            disabled={currentSceneIndex === activeStory.scenes.length - 1}
            onClick={handleNextScene}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-700 text-white hover:bg-teal-800 text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs cursor-pointer"
          >
            <span>अगला दृश्य</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
