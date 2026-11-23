import React, { useState, useMemo, useEffect, useDeferredValue } from 'react';
import { ActiveDesktopTab, ScriptType } from '../types';
import { CulturalTree } from './CulturalTree';
import { SantaliHeritageSlideshow } from './SantaliHeritageSlideshow';
import { useAdmin } from '../context/AdminContext';
import { speakWithFemaleVoice } from '../utils/speech';
import {
  Keyboard,
  BookOpen,
  GraduationCap,
  Languages,
  Search,
  ArrowRight,
  Mic,
  Volume2,
  FileText,
  Printer,
  Flame,
  Trophy,
  Edit3,
  Check,
  X,
  RotateCcw,
  Globe,
  PenTool,
  MessageSquare,
  Layers,
  Sparkles,
  Palette,
  HelpCircle,
  Calendar,
  Gamepad2,
  Headphones,
  Music,
  Users,
  Smile,
  Clock,
  Shield,
  TreePine,
  Baby,
  Hammer,
  Coffee,
  Target,
  UtensilsCrossed,
  HeartHandshake,
  Compass,
  Scroll,
  Heart,
  Swords,
  Radio,
  Sprout,
  Scale,
  Home,
  Droplets,
  Shirt,
  Trees,
  Bookmark,
  Award,
  Activity,
  Drama,
  Moon,
  Landmark,
  Leaf,
  HeartPulse,
  Smartphone,
  ArrowRightLeft,
  Feather,
  Fish,
  Calculator,
  Scissors,
  Coins,
  Shuffle,
  ShoppingBag,
  Grid3X3,
  MapPin,
  Newspaper
} from 'lucide-react';
import { getNextUpcomingFestivalInfo } from '../utils/lunarFestivalHelper';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { SANTALI_KEYBOARD_URL } from '../utils/externalLinks';
import { Download, Share2, ListMusic, HardDrive, ClipboardList, QrCode, Sun, Bus } from 'lucide-react';

const TextSpeakerReader = React.lazy(() =>
  import('./TextSpeakerReader').then((m) => ({ default: m.TextSpeakerReader }))
);

interface DashboardProps {
  onNavigate: (tab: ActiveDesktopTab) => void;
  activeScript: ScriptType;
  onScriptChange: (script: ScriptType) => void;
  onOpenSearch?: () => void;
  onOpenAdmin?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = React.memo(({
  onNavigate,
  activeScript,
  onScriptChange,
  onOpenSearch,
  onOpenAdmin
}) => {
  const { isAdmin, heroConfig, updateHeroConfig, resetHeroConfig, words } = useAdmin();
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [editedTitle, setEditedTitle] = useState(heroConfig.welcomeTitle);
  const [editedSub, setEditedSub] = useState(heroConfig.subTitle);
  const [editedMotto, setEditedMotto] = useState(heroConfig.motto);
  const [editedQuote, setEditedQuote] = useState(heroConfig.quoteEnglish);
  const [editedQuoteSantali, setEditedQuoteSantali] = useState(heroConfig.quoteSantali);
  const [nextFestival, setNextFestival] = useState(() => getNextUpcomingFestivalInfo());

  useEffect(() => {
    const refreshFestival = () => {
      const info = getNextUpcomingFestivalInfo();
      setNextFestival((prev) =>
        prev.daysLeft === info.daysLeft &&
        prev.nameDev === info.nameDev &&
        prev.dateLabel === info.dateLabel
          ? prev
          : info
      );
    };
    refreshFestival();
    const id = setInterval(refreshFestival, 60000);
    window.addEventListener('hor-katha-user-prefs-applied', refreshFestival);
    return () => {
      clearInterval(id);
      window.removeEventListener('hor-katha-user-prefs-applied', refreshFestival);
    };
  }, []);

  const recentWords = useMemo(() => words.slice(0, 5), [words]);
  const lexiconCount = words.length >= 10000 ? words.length : 50000;
  const [wotdCopied, setWotdCopied] = useState(false);

  const wordOfTheDay = useMemo(() => {
    if (!words || words.length === 0) return null;
    const now = new Date();
    const daySeed = now.getFullYear() * 366 + now.getMonth() * 31 + now.getDate();
    const pool = words.slice(0, Math.min(words.length, 300));
    return pool[daySeed % pool.length];
  }, [words]);

  const handleDownloadWordOfDayCard = () => {
    if (!wordOfTheDay) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 10;
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('आज का संताली शब्द · Word of the Day · Santal आ़रसी', 68, 92);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 68px sans-serif';
    ctx.fillText(wordOfTheDay.wordDevanagari, 68, 195);

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText(toOlChikiAuto(wordOfTheDay.wordDevanagari), 68, 260);

    ctx.fillStyle = '#334155';
    ctx.font = '600 30px sans-serif';
    ctx.fillText(`${wordOfTheDay.wordRoman} (${wordOfTheDay.phonetic})`, 68, 320);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(`हिन्दी: ${wordOfTheDay.meaningHindi}`, 68, 405);

    ctx.fillStyle = '#475569';
    ctx.font = '600 28px sans-serif';
    ctx.fillText(`English: ${wordOfTheDay.meaningEnglish}`, 68, 458);

    ctx.fillStyle = '#78350F';
    ctx.font = 'italic 24px sans-serif';
    ctx.fillText('BOSC Tech & Edu · संताली भाषा और संस्कृति मंच', 68, 535);

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `santali-word-${wordOfTheDay.wordRoman.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'daily'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyWordOfDayWhatsApp = () => {
    if (!wordOfTheDay) return;
    const msg = `*आज का संताली शब्द (Santal आ़रसी)*\n\n*शब्द:* ${wordOfTheDay.wordDevanagari}\n*ओल चिकी:* ${toOlChikiAuto(wordOfTheDay.wordDevanagari)}\n*उच्चारण:* ${wordOfTheDay.wordRoman}\n*हिन्दी अर्थ:* ${wordOfTheDay.meaningHindi}\n*English:* ${wordOfTheDay.meaningEnglish}\n\nसीखें: ${window.location.origin}`;
    navigator.clipboard.writeText(msg).catch(() => {});
    setWotdCopied(true);
    setTimeout(() => setWotdCopied(false), 2000);
  };

  const handleSaveHero = () => {
    updateHeroConfig({
      welcomeTitle: editedTitle,
      subTitle: editedSub,
      motto: editedMotto,
      quoteEnglish: editedQuote,
      quoteSantali: editedQuoteSantali
    });
    setIsEditingHero(false);
  };

  const handleSpeak = (text: string) => {
    speakWithFemaleVoice(text, { lang: 'hi-IN', rate: 0.88 });
  };

  const [moduleCategory, setModuleCategory] = useState<string>('all');
  const [moduleFilterText, setModuleFilterText] = useState<string>('');
  const [showAllModules, setShowAllModules] = useState<boolean>(false);
  const deferredModuleFilterText = useDeferredValue(moduleFilterText);

  const featureCards = useMemo<{
    id: ActiveDesktopTab;
    targetTab?: ActiveDesktopTab;
    title: string;
    subtitle: string;
    icon: any;
    gradient: string;
    actionText: string;
    category: 'language' | 'culture' | 'crafts' | 'nature' | 'games';
  }[]>(() => [
    // ─── 1. भाषा, लिपि व अध्ययन (15 Modules) ───
    {
      id: 'keyboard',
      title: 'संताली कीबोर्ड (Keyboard)',
      subtitle: 'देवनागरी व रोमन में सहज संताली टाइपिंग व फॉन्ट',
      icon: Keyboard,
      gradient: 'from-sky-500 to-blue-600',
      actionText: 'Open Keyboard',
      category: 'language'
    },
    {
      id: 'dashboard',
      targetTab: 'dashboard',
      title: '५०,०००+ संताली शब्दकोश (Dictionary)',
      subtitle: `${lexiconCount.toLocaleString()}+ शब्द, ऑडियो उच्चारण व त्रैभाषिक अर्थ`,
      icon: BookOpen,
      gradient: 'from-amber-500 to-orange-600',
      actionText: 'Explore Words',
      category: 'language'
    },
    {
      id: 'learn',
      title: 'संताली देवनागरी सीखें (Learn)',
      subtitle: 'वर्णमाला, बारहखड़ी, प्राथमिक नियम व शब्दावली',
      icon: GraduationCap,
      gradient: 'from-emerald-500 to-teal-600',
      actionText: 'Start Learning',
      category: 'language'
    },
    {
      id: 'translator',
      title: 'बहुभाषी अनुवादक (Translator)',
      subtitle: 'संताली (देवनागरी/रोमन) ↔ हिन्दी व अंग्रेज़ी अनुवाद',
      icon: Languages,
      gradient: 'from-rose-500 to-pink-600',
      actionText: 'Translate',
      category: 'language'
    },
    {
      id: 'santali_grammar_course',
      title: 'संपूर्ण संताली व्याकरण कोर्स व क्विज़ (20 अध्याय)',
      subtitle: 'ध्वनि, रुद्ध व्यंजन, ३ वचन, कारक, सर्वनाम, काल, वाच्य, पत्र व निबंध + 60 अभ्यास प्रश्न',
      icon: GraduationCap,
      gradient: 'from-teal-700 to-emerald-800',
      actionText: 'Start Course',
      category: 'language'
    },
    {
      id: 'grammar',
      title: 'संताली व्याकरण (रोनौड़)',
      subtitle: 'काल, कारक, क्रियापद, वचन व वाक्य संरचना',
      icon: BookOpen,
      gradient: 'from-indigo-600 to-blue-700',
      actionText: 'Learn Grammar',
      category: 'language'
    },
    {
      id: 'phonetics_lab',
      title: '४ रुद्ध कंठ ध्वनियां (Phonetics Lab)',
      subtitle: 'अचेत वर्ण (क, च, त, प) का शुद्ध उच्चारण अभ्यास',
      icon: Activity,
      gradient: 'from-teal-600 to-cyan-700',
      actionText: 'Practice Sounds',
      category: 'language'
    },
    {
      id: 'phrasebook',
      title: 'दैनिक बोलचाल वाक्यांश (Phrasebook)',
      subtitle: 'अभिवादन, यात्रा, बाजार व घरेलू संवाद ऑडियो सहित',
      icon: MessageSquare,
      gradient: 'from-emerald-600 to-teal-700',
      actionText: 'Browse Phrases',
      category: 'language'
    },
    {
      id: 'spoken_dialogues',
      title: 'दैनिक संताली बोलचाल संवाद',
      subtitle: 'हाट-बाजार, सत्कार, कृषि व पारस्परिक वार्तालाप',
      icon: MessageSquare,
      gradient: 'from-blue-800 to-indigo-950',
      actionText: 'Learn Dialogues',
      category: 'language'
    },
    {
      id: 'speech_coach',
      title: 'उच्चारण प्रशिक्षक (Speech Coach)',
      subtitle: 'ध्वनि पहचान व माइक्रोफोन स्कोरिंग फीडबैक',
      icon: Mic,
      gradient: 'from-teal-600 to-cyan-700',
      actionText: 'Test Accent',
      category: 'language'
    },
    {
      id: 'speaker',
      title: 'आवाज वाचक (Voice Reader)',
      subtitle: 'किसी भी संताली देवनागरी टेक्स्ट का सजीव ऑडियो वाचन',
      icon: Volume2,
      gradient: 'from-amber-500 to-orange-600',
      actionText: 'Read Aloud',
      category: 'language'
    },
    {
      id: 'letter_templates',
      title: 'औपचारिक पत्र व नेवता साकाम',
      subtitle: 'विवाह निमंत्रण, मांझी हाड़ाम आवेदन व सभा सूचना',
      icon: FileText,
      gradient: 'from-stone-800 to-amber-950',
      actionText: 'Open Templates',
      category: 'language'
    },
    {
      id: 'clock_numbers',
      title: 'बोलती घड़ी व १-१०० अंक (Numbers)',
      subtitle: 'लाइव संताली समय वाचन व १ से १०० तक गिनती चार्ट',
      icon: Clock,
      gradient: 'from-indigo-600 to-purple-700',
      actionText: 'Check Time',
      category: 'language'
    },
    {
      id: 'flashcards',
      title: 'शब्दावली फ़्लैशकार्ड्स (Flashcards)',
      subtitle: 'कार्ड पलटकर संताली शब्द व अर्थ का त्वरित अभ्यास',
      icon: Layers,
      gradient: 'from-violet-600 to-purple-700',
      actionText: 'Flip Cards',
      category: 'language'
    },
    {
      id: 'certification',
      title: 'भाषा परीक्षा व प्रमाणपत्र (Certificate)',
      subtitle: 'वस्तुनिष्ठ परीक्षा दें और सम्मानजनक डिजिटल प्रमाणपत्र पाएं',
      icon: Award,
      gradient: 'from-amber-600 to-yellow-700',
      actionText: 'Take Exam',
      category: 'language'
    },
    {
      id: 'favorites_notebook',
      title: 'इञाक् साकाम (मेरी डायरी)',
      subtitle: 'पसंदीदा शब्द, सूक्तियां व संताली नोट्स सहेजें',
      icon: Bookmark,
      gradient: 'from-purple-700 to-pink-800',
      actionText: 'My Notebook',
      category: 'language'
    },
    {
      id: 'script_converter',
      title: 'ऑल चिकी ⇄ देवनागरी ⇄ रोमन कनवर्टर',
      subtitle: 'लाइव त्रि-लिपि संताली लिप्यंतरण व वर्णमाला चार्ट',
      icon: ArrowRightLeft,
      gradient: 'from-indigo-900 to-slate-950',
      actionText: 'Convert Script',
      category: 'language'
    },
    {
      id: 'calligraphy_workbook',
      title: 'ओल चिकी व संताली सुलेखन अभ्यास पुस्तिका',
      subtitle: '३० मूल वर्णों का डिजिटल स्ट्रोक ट्रेसिंग व प्रिंटेबल वर्कशीट',
      icon: PenTool,
      gradient: 'from-teal-800 to-emerald-950',
      actionText: 'Practice Calligraphy',
      category: 'language'
    },
    {
      id: 'universal_text_reader',
      title: 'संताली सर्व-पाठ व दस्तावेज वाचक (Text Reader)',
      subtitle: 'दीर्घ पाठ, कराओके हाइलाइटिंग, गति-पिच नियंत्रण व ऐतिहासिक संदेश',
      icon: FileText,
      gradient: 'from-amber-950 via-stone-900 to-emerald-950',
      actionText: 'Open Text Reader',
      category: 'language'
    },
    {
      id: 'illustrated_comics_reader',
      title: 'सचित्र संताली कॉमिक्स व लोक-कथा वाचक (Comics Reader)',
      subtitle: 'फ्रेम-दर-फ्रेम संवाद, बहु-चरित्र ऑडियो व संताली लोक-कथाएं',
      icon: BookOpen,
      gradient: 'from-amber-900 via-orange-950 to-stone-900',
      actionText: 'Read Visual Comics',
      category: 'language'
    },
    {
      id: 'santali_verb_conjugator',
      title: 'रोनौड़ क्रिया-काल कंजुगेटर लैब (Verb & Tense Lab)',
      subtitle: 'सजीव/निर्जीव कर्म, द्विवचन, समावेशी-अपवर्जक सर्वनाम व सजीव वाक्य निर्माण',
      icon: Languages,
      gradient: 'from-indigo-950 via-stone-900 to-sky-950',
      actionText: 'Open Verb Lab',
      category: 'language'
    },
    {
      id: 'pera_hor_literature',
      title: 'पेड़ा होड़ (१८९०) व क्लासिक संताली साहित्य आर्काइव',
      subtitle: 'बिदु चांदान, खेरवाड़ बीर, खेरवाड़ बोंसो व साधु रामचांद के कालजयी अंश',
      icon: BookOpen,
      gradient: 'from-amber-950 via-rose-950 to-stone-900',
      actionText: 'Read Classics',
      category: 'language'
    },
    {
      id: 'santali_dialects_comparative',
      title: 'क्षेत्रीय संताली बोली तुलना लैब (उत्तर, दक्षिण व बंगाल)',
      subtitle: 'दुमका, मयूरभंज-सिंहभूम व बाँकुड़ा उच्चारण व संवाद का तुलनात्मक कोष',
      icon: Globe,
      gradient: 'from-sky-950 via-stone-900 to-indigo-950',
      actionText: 'Compare Dialects',
      category: 'language'
    },
    {
      id: 'santali_anchoring_speeches',
      title: 'संताली मंच संचालन, अतिथि जोहार व भाषण जनरेटर',
      subtitle: 'ग्राम सभा, हूल दिवस, बाहा-करम उत्सव हेतु तैयार संताली भाषण स्क्रिप्ट',
      icon: Mic,
      gradient: 'from-rose-950 via-stone-900 to-amber-950',
      actionText: 'Generate Speech',
      category: 'language'
    },
    {
      id: 'santali_typing_speed',
      title: 'संताली टाइपिंग स्पीड व शुद्धता टेस्ट (WPM Test)',
      subtitle: 'देवनागरी व रोमन में लाइव WPM, सटीकता प्रतिशत व अभ्यास वाक्य',
      icon: Keyboard,
      gradient: 'from-sky-900 via-blue-950 to-indigo-950',
      actionText: 'Start Typing Test',
      category: 'language'
    },
    {
      id: 'santali_pahada_tables',
      title: 'संताली पहाड़ा और इसी (२०) गणित सारणी (Tables 1-10)',
      subtitle: '१ से १० तक बोलता पहाड़ा ऑडियो व इसी (Kodi) पद्धति से गुणन अभ्यास',
      icon: Calculator,
      gradient: 'from-emerald-900 via-teal-950 to-stone-900',
      actionText: 'Learn Pahada',
      category: 'language'
    },
    {
      id: 'learning_streak_tracker',
      title: 'दैनिक संताली अभ्यास स्ट्रीक व लक्ष्य ट्रैकर',
      subtitle: 'रोजाना अध्ययन लक्ष्य, ७-दिवसीय गतिविधि व माइलस्टोन बैज सहेजें',
      icon: Flame,
      gradient: 'from-orange-800 via-amber-900 to-stone-900',
      actionText: 'Track Progress',
      category: 'language'
    },
    {
      id: 'word_pinboard_notes',
      title: 'त्वरित शब्द पिनबोर्ड व त्वरित नोट्स (Pinboard)',
      subtitle: 'प्रमुख संताली शब्द, रंगीन स्टिकी कार्ड्स व त्वरित वाचन डायरी',
      icon: Bookmark,
      gradient: 'from-violet-900 via-purple-950 to-slate-900',
      actionText: 'Open Pinboard',
      category: 'language'
    },
    {
      id: 'santali_exam_prep_jpsc',
      title: 'India + Jharkhand परीक्षा हब 2026 (UPSC/SSC/JPSC/JSSC)',
      subtitle: '20 वास्तविक परीक्षाएँ, 2026 के सभी आवश्यक पेपर, 3-वर्षीय PYQ व 2 प्रैक्टिस सेट',
      icon: GraduationCap,
      gradient: 'from-amber-800 via-stone-900 to-slate-900',
      actionText: 'Open 2026 Exam Hub',
      category: 'language'
    },
    {
      id: 'santali_dictation_lab',
      title: 'संताली श्रुतलेख व वर्तनी प्रयोगशाला (Dictation Lab)',
      subtitle: 'ऑडियो सुनकर देवनागरी व रोमन में लिखने व वर्तनी जांचने का अभ्यास',
      icon: Headphones,
      gradient: 'from-indigo-800 via-slate-900 to-sky-950',
      actionText: 'Practice Dictation',
      category: 'language'
    },
    {
      id: 'santali_word_match_game',
      title: 'तेज़ संताली ⇄ हिन्दी शब्द-मिलान खेल (Word Match)',
      subtitle: 'समयबद्ध जोड़ी मिलान मेमोरी गेम व सर्वश्रेष्ठ स्कोर ट्रैकिंग',
      icon: Gamepad2,
      gradient: 'from-teal-800 via-emerald-950 to-slate-900',
      actionText: 'Play Word Match',
      category: 'games'
    },
    {
      id: 'santali_medical_translator',
      title: 'अस्पताल व स्वास्थ्य संवाद गाइड (Medical Guide)',
      subtitle: 'डॉक्टर, आशा व ANM कर्मियों के लिए मरीज़ लक्षण व दवा संवाद',
      icon: HeartPulse,
      gradient: 'from-rose-800 via-stone-900 to-red-950',
      actionText: 'Open Medical Guide',
      category: 'culture'
    },
    {
      id: 'gram_sabha_form_drafter',
      title: 'ग्राम सभा प्रस्ताव व वंशावली ड्राफ़्टर (Form Drafter)',
      subtitle: 'PESA ग्राम सभा प्रस्ताव, मांझी सत्यापन व FRA दावा एक क्लिक में तैयार करें',
      icon: FileText,
      gradient: 'from-amber-900 via-stone-900 to-neutral-900',
      actionText: 'Draft Document',
      category: 'culture'
    },
    {
      id: 'santali_news_bulletin_studio',
      title: 'संताली समाचार व टेलीप्रॉम्प्टर स्टूडियो (News Studio)',
      subtitle: 'कम्युनिटी रेडियो, यूट्यूब व स्कूल सभा के लिए स्क्रॉलिंग टेलीप्रॉम्प्टर',
      icon: Radio,
      gradient: 'from-sky-900 via-slate-900 to-indigo-950',
      actionText: 'Open Teleprompter',
      category: 'language'
    },
    {
      id: 'data_backup_manager',
      title: 'सुरक्षित डेटा बैकअप व रिस्टोर मैनेजर (Data Backup)',
      subtitle: 'पिनबोर्ड नोट्स, स्ट्रीक व अभ्यास डेटा को JSON फ़ाइल में सहेजें व रिस्टोर करें',
      icon: Shield,
      gradient: 'from-emerald-900 via-slate-900 to-stone-950',
      actionText: 'Manage Backup',
      category: 'language'
    },
    {
      id: 'santali_tala_metronome',
      title: 'संताली पारंपरिक ताल व मेट्रोनोम स्टूडियो (Tala Metronome)',
      subtitle: 'लांगड़े, सोहराय, दांता, बाहा व गोलावरी तालों की लाइव बीट व तुमाक बोल',
      icon: Music,
      gradient: 'from-amber-800 via-orange-950 to-stone-900',
      actionText: 'Play Metronome',
      category: 'games'
    },
    {
      id: 'santali_instrument_tuner',
      title: 'बानाम व तिरिओ सुर ट्यूनर एवं स्केल मार्गदर्शक (Instrument Tuner)',
      subtitle: 'बांसुरी (तिरिओ), धोदरो बानाम और तामाक के वास्तविक आवृत्तियों (Hz) का सिंथेसाइज़र',
      icon: Radio,
      gradient: 'from-sky-900 via-indigo-950 to-slate-900',
      actionText: 'Tune Instrument',
      category: 'games'
    },
    {
      id: 'santali_land_topography',
      title: 'संताली भूमि, खेत व स्थलाकृति शब्दावली (Land Topography)',
      subtitle: 'गोड़ा, बाद/बहेरा, डाड़ी, जाहेर थान व पारंपरिक भूमि पैमाइश कैलकुलेटर',
      icon: Compass,
      gradient: 'from-emerald-900 via-teal-950 to-stone-900',
      actionText: 'Explore Land Lore',
      category: 'nature'
    },
    {
      id: 'santali_micro_journal',
      title: 'दैनिक संताली डायरी व विचार प्रेरक (Daily Micro-Journal)',
      subtitle: 'संताली भाव-दशा (रस्का, कुरुमुटु), दैनिक आभार व आत्म-चिंतन प्रविष्टियाँ सहेजें',
      icon: Bookmark,
      gradient: 'from-purple-900 via-slate-900 to-amber-950',
      actionText: 'Write in Journal',
      category: 'language'
    },
    {
      id: 'santali_wit_riddles_arena',
      title: 'संताली कुदुम (पहेली) व लन्दा काथा अखाड़ा (Riddles & Wit)',
      subtitle: 'पारंपरिक संताली पहेलियाँ, हास्य कथाएँ व त्वरित स्कोरिंग चुनौती',
      icon: Smile,
      gradient: 'from-amber-900 via-yellow-950 to-slate-900',
      actionText: 'Solve Riddles',
      category: 'games'
    },
    {
      id: 'dance_akhda_formations',
      title: 'संताली नृत्य मुद्रा व अखड़ा फॉर्मेशन गाइड (Dance & Akhda)',
      subtitle: 'दोन, लांगड़े, बाहा, दासांय और सोहराय के इंटरैक्टिव स्टेप-बाय-स्टेप फ़ॉर्मेशन व बीट सिंक',
      icon: Users,
      gradient: 'from-rose-900 via-amber-950 to-slate-900',
      actionText: 'Explore Akhda',
      category: 'culture'
    },
    {
      id: 'santali_grammar_checker',
      title: 'संताली व्याकरण व प्रत्यय परीक्षक (Grammar Checker)',
      subtitle: 'सजीव/निर्जीव विभेद, सर्वनाम वचन (-किन/-को), काल प्रत्यय (-एत्/-केत्) व वाक्य जाँच',
      icon: Sparkles,
      gradient: 'from-indigo-900 via-slate-900 to-cyan-950',
      actionText: 'Check Grammar',
      category: 'language'
    },
    {
      id: 'santali_crossword_puzzle',
      title: 'संताली शब्द-पहेली (Crossword Grid Puzzle)',
      subtitle: 'टच-फ़्रेंडली ग्रिड में प्रकृति, रिश्ते, त्योहार व वाद्ययंत्र पर आधारित इंटरैक्टिव क्रॉसवर्ड',
      icon: Gamepad2,
      gradient: 'from-amber-800 via-orange-950 to-slate-900',
      actionText: 'Play Crossword',
      category: 'games'
    },
    {
      id: 'wildlife_flora_quiz',
      title: 'वन्यजीव व जड़ी-बूटी पहचान क्विज़ (Wildlife & Flora)',
      subtitle: 'सखुआ, महुआ, करम, नीलगाय व जंगल की औषधियों पर आधारित चित्र-संकेत प्रश्नोत्तरी',
      icon: Trees,
      gradient: 'from-emerald-900 via-teal-950 to-slate-900',
      actionText: 'Start Nature Quiz',
      category: 'nature'
    },
    {
      id: 'invitation_certificate_maker',
      title: 'बापला निमंत्रण कार्ड व प्रमाण-पत्र स्टूडियो (Card Studio)',
      subtitle: 'नेवता पाती, बापला निमंत्रण और सांस्कृतिक सम्मान प्रमाण-पत्र बनाएँ व प्रिंट/डाउनलोड करें',
      icon: Award,
      gradient: 'from-fuchsia-950 via-rose-950 to-amber-950',
      actionText: 'Create Card',
      category: 'culture'
    },

    // ─── 2. संस्कृति, पूर्वज व परंपरा (24 Modules) ───
    {
      id: 'creation',
      title: 'धरती की सृष्टि गाथा (सिरजोन)',
      subtitle: 'हांच-हांसिली पक्षी, कछुआ, केकड़ा व पिलचु हाड़ाम दर्शन',
      icon: Globe,
      gradient: 'from-blue-700 to-indigo-900',
      actionText: 'Explore Myth',
      category: 'culture'
    },
    {
      id: 'bonga_buru',
      title: 'पूजा-पाठ बोंगा-बुरु (१५ देव शक्तियां)',
      subtitle: 'मरांग बुरु, जाहेर एरा, गोसाईं एरा व पवित्र बाखेर मंत्र',
      icon: Flame,
      gradient: 'from-amber-600 to-rose-700',
      actionText: 'View Deities',
      category: 'culture'
    },
    {
      id: 'hul_heroes',
      title: 'संथाल हुल १८५५ (अमर महापुरुष)',
      subtitle: 'सिदो-कान्हू, चांद-भैरव, तिलका मांझी व फूलो-झानो इतिहास',
      icon: Swords,
      gradient: 'from-rose-700 to-red-900',
      actionText: 'Read Heroes',
      category: 'culture'
    },
    {
      id: 'marriage_bapla',
      title: 'विवाह संस्कार (८ पारंपरिक बापla)',
      subtitle: 'गोलायती, सांगा, दुवार बापला व सामाजिक मर्यादा',
      icon: Heart,
      gradient: 'from-pink-600 to-rose-700',
      actionText: 'Explore Bapla',
      category: 'culture'
    },
    {
      id: 'marriage_rituals',
      title: '७ विवाह प्रकार व ३ जीवन संस्कार',
      subtitle: 'दुवार बापला, टुंकी दिपिल, निम दाहाक् व चाचो छातियार',
      icon: HeartHandshake,
      gradient: 'from-rose-800 to-red-950',
      actionText: 'View Rituals',
      category: 'culture'
    },
    {
      id: 'life_rites',
      title: 'जीवन-संस्कार दर्शन (Life Rites)',
      subtitle: 'जन्म छठियार, चाचो छातियार, बाहा बपला व भांडान संस्कार',
      icon: Baby,
      gradient: 'from-amber-700 to-stone-900',
      actionText: 'Explore Rites',
      category: 'culture'
    },
    {
      id: 'governance',
      title: 'मांझी परगना स्वशासन प्रणाली',
      subtitle: 'मांझी हाड़ाम, पारानिक, गोडेट, जोग मांझी व कुलही बैसी',
      icon: Landmark,
      gradient: 'from-amber-800 to-stone-900',
      actionText: 'Governance Law',
      category: 'culture'
    },
    {
      id: 'clans',
      title: '१२ पवित्र पारिस व गोत्र (Clans)',
      subtitle: 'मुर्मू, हांसदा, सोरेन, हेम्ब्रम, किस्कू गोत्र चिन्ह व नियम',
      icon: Shield,
      gradient: 'from-amber-700 to-stone-800',
      actionText: 'View Clans',
      category: 'culture'
    },
    {
      id: 'family_tree',
      title: 'नाते-रिश्तेदार व कुल संबंध (साग़य)',
      subtitle: 'चाचा, मामा, बुआ, ससुराल रिश्ते व आदर परंपरा',
      icon: Users,
      gradient: 'from-teal-600 to-cyan-700',
      actionText: 'View Family Tree',
      category: 'culture'
    },
    {
      id: 'baby_names',
      title: 'पारंपरिक नामकरण गाइड (२००+ नाम)',
      subtitle: 'दादा-दादी के नाम पर नामकरण के ५ शास्त्रीय नियम',
      icon: Baby,
      gradient: 'from-rose-500 to-amber-600',
      actionText: 'Explore Names',
      category: 'culture'
    },
    {
      id: 'historical_garhs',
      title: '१२ ऐतिहासिक गढ़ व महाप्रवासन',
      subtitle: 'चांपा गढ़, बादोली गढ़, चाय गढ़ व आदिम प्रवासन मार्ग',
      icon: Compass,
      gradient: 'from-purple-800 to-indigo-950',
      actionText: 'Explore Garhs',
      category: 'culture'
    },
    {
      id: 'pilgrimage',
      title: 'पवित्र तीर्थ स्थल (Pilgrimages)',
      subtitle: 'लुगु बुरु घंटाबाड़ी, पारसनाथ व भोगनाडीह हूल स्मारक',
      icon: Compass,
      gradient: 'from-emerald-700 to-teal-900',
      actionText: 'View Sites',
      category: 'culture'
    },
    {
      id: 'sacred_pilgrimages',
      title: 'पावन तीर्थ व ऐतिहासिक गढ़ दर्शन',
      subtitle: 'लुगु बुरु, अयोध्या बुरु, भोगनाडीह व चांपा गढ़ विवरण',
      icon: Compass,
      gradient: 'from-emerald-800 to-teal-950',
      actionText: 'Visit Pilgrimages',
      category: 'culture'
    },
    {
      id: 'attire_ornaments',
      title: 'पारंपरिक वस्त्र व आभूषण (Attire)',
      subtitle: 'पांची-पारहांड, गमछा, लुंगी व पारंपरिक सज्जा',
      icon: Sparkles,
      gradient: 'from-amber-600 to-rose-700',
      actionText: 'Explore Attire',
      category: 'culture'
    },
    {
      id: 'ornaments_jewellery',
      title: 'पारंपरिक आभूषण व शृंगार (Jewellery)',
      subtitle: 'हांसली, खागड़ा, साकम, रासा व तोड़ा कांसा कला',
      icon: Sparkles,
      gradient: 'from-amber-600 to-orange-700',
      actionText: 'View Ornaments',
      category: 'culture'
    },
    {
      id: 'calendar',
      title: 'सांस्कृतिक महापर्व पंचांग (Festivals)',
      subtitle: 'सोहराय, बाहा, करम, साकरात पर्वों का विस्तृत लेख',
      icon: Calendar,
      gradient: 'from-orange-600 to-red-700',
      actionText: 'View Seasons',
      category: 'culture'
    },
    {
      id: 'lunar_calendar',
      title: 'चंद्र पंचांग व महापर्व टाइमर (Chando Clock)',
      subtitle: 'लाइव चंद्र कला (कुनामी/मूळ) व आगामी महापर्व काउंटडाउन',
      icon: Moon,
      gradient: 'from-indigo-900 to-slate-950',
      actionText: 'View Chando Clock',
      category: 'culture'
    },
    {
      id: 'greetings',
      title: 'पावन पर्व ई-कार्ड व बधाई जनरेटर',
      subtitle: 'सोहराय, बाहा व करम की डिजिटल बधाई कार्ड बनाएं',
      icon: Sparkles,
      gradient: 'from-pink-600 to-rose-700',
      actionText: 'Create E-Card',
      category: 'culture'
    },
    {
      id: 'social_cards',
      title: 'सोशल मीडिया कार्ड व पोस्टर जनरेटर',
      subtitle: '१०५+ संताली विचार, सोहराय बॉर्डर्स व WhatsApp HD शेयर',
      icon: Sparkles,
      gradient: 'from-rose-800 to-amber-950',
      actionText: 'Create Poster',
      category: 'culture'
    },
    {
      id: 'village_tour',
      title: 'संताल गांव (हातु) का पवित्र मानचित्र',
      subtitle: 'जाहेर थान, मांझी थान, कुलही, अखड़ा व सासन 3D संरचना',
      icon: Compass,
      gradient: 'from-emerald-950 to-stone-900',
      actionText: 'Explore Village',
      category: 'culture'
    },
    {
      id: 'festival_cards',
      title: 'व्हाट्सऐप व पावन पर्व ग्रीटिंग्स जनरेटर',
      subtitle: 'सोहराय, बाहा, करम, माघ सिम की ई-कार्ड इमेज व WhatsApp शेयर',
      icon: Sparkles,
      gradient: 'from-rose-800 to-pink-950',
      actionText: 'Create Greeting',
      category: 'culture'
    },
    {
      id: 'calligraphy',
      title: 'देवनागरी सुलेखन व पोस्टर (Calligraphy)',
      subtitle: 'सुंदर संताली सुविचार पोस्टर तैयार करें व डाउनलोड करें',
      icon: Palette,
      gradient: 'from-amber-700 to-orange-800',
      actionText: 'Design Poster',
      category: 'culture'
    },
    {
      id: 'wallpaper_studio',
      title: 'मोबाइल लॉकस्क्रीन वॉलपेपर व 9:16 स्टेटस',
      subtitle: 'सुविचार वॉलपेपर, सोहराय बॉर्डर व WhatsApp स्टेटस',
      icon: Smartphone,
      gradient: 'from-amber-950 to-stone-900',
      actionText: 'Create Wallpaper',
      category: 'culture'
    },
    {
      id: 'clan_genealogy',
      title: 'पारिस, खूंट व वंशावली पारिवारिक डायरी',
      subtitle: '१२ गोत्र टोटेम, कुल-देवता व घारोज साकाम प्रमाण-पत्र',
      icon: Shield,
      gradient: 'from-amber-900 to-yellow-950',
      actionText: 'View Clan Book',
      category: 'culture'
    },
    {
      id: 'bapla_chants',
      title: 'संताली विवाह (बापला) गीत व संपूर्ण नेग-दस्तूर',
      subtitle: 'तोरण, दाक् बापेर, सिंदूर दान व अश्रुपूर्ण बिदाई सेरेञ',
      icon: Heart,
      gradient: 'from-rose-800 to-pink-950',
      actionText: 'Explore Wedding',
      category: 'culture'
    },
    {
      id: 'godna_body_art',
      title: 'सिका दागा व गोदना: अमर देह-कला व हाना पुरी दर्शन',
      subtitle: 'पुरुषों की कलाई का सिका (३, ५, ७ दागा), नारी गोदना व डिजिटल स्टूडियो',
      icon: Sparkles,
      gradient: 'from-amber-900 to-stone-900',
      actionText: 'Open Godna Studio',
      category: 'culture'
    },
    {
      id: 'kinship_etiquette',
      title: 'संथाल जोहार, नाता-गोता व पारंपरिक पारिवारिक शिष्टाचार',
      subtitle: 'डोबोक जोहार, बालाया जोहार, मामा-भांजा सम्मान व मर्यादा वर्जनाएं',
      icon: Users,
      gradient: 'from-teal-800 to-stone-900',
      actionText: 'Explore Etiquette',
      category: 'culture'
    },
    {
      id: 'lo_bir_court',
      title: 'लो बीर बैसी: सर्वोच्च आदिवासी जन-अदालत सिमुलेटर',
      subtitle: 'सेंदरा पशु बंटवारा, चराई विवाद व प्राचीन मौखिक विधि संहिता',
      icon: Scale,
      gradient: 'from-amber-950 to-stone-900',
      actionText: 'Explore Court Cases',
      category: 'culture'
    },
    {
      id: 'customary_oaths_justice',
      title: 'संताली पावन शपथ, साक्षी व जोम जाति शुद्धिकरण',
      subtitle: 'गुरी-घांस, बाहा दाः, सार-कापी किरिया व सामुदायिक पुनर्प्रवेश भोज',
      icon: Scale,
      gradient: 'from-amber-950 via-stone-900 to-slate-950',
      actionText: 'Explore Oaths',
      category: 'culture'
    },
    {
      id: 'sasandiri_megalithic_lore',
      title: 'सासानदीरी व महापाषाण स्मृति प्रस्तर विद्या',
      subtitle: 'दिरी बिद, चापाड़ दिरी, नाई गाड़ा जांग बाहा तीर्थ व पाषाण संतुलन भौतिकी',
      icon: Landmark,
      gradient: 'from-stone-900 via-neutral-900 to-amber-950',
      actionText: 'Explore Megaliths',
      category: 'culture'
    },
    {
      id: 'indigenous_midwifery_care',
      title: 'दाया बुढ़ी व संताली प्रसूति-शिशु रक्षा विज्ञान',
      subtitle: 'नाड़ी-स्पर्श विद्या, महुआ तेल अभ्यंग, बांस चोई नाल-छेदन व जनम छठियार',
      icon: Baby,
      gradient: 'from-rose-950 via-pink-950 to-stone-900',
      actionText: 'Explore Midwifery Lore',
      category: 'culture'
    },
    {
      id: 'karam_binti_epic_reader',
      title: 'करम बिनती पावन मौखिक महाकाव्य (Karam Binti Epic)',
      subtitle: 'सृष्टि, हंस युगल, चांपा गढ़ प्रवास व करम रात के ६ पवित्र अध्याय',
      icon: Scroll,
      gradient: 'from-amber-950 via-yellow-950 to-emerald-950',
      actionText: 'Recite Karam Binti',
      category: 'culture'
    },
    {
      id: 'epigraphy_numismatics_lore',
      title: 'गढ़ प्रस्तर मुहर, ताम्रपत्र व संताली प्राचीन मुद्रा ज्ञान',
      subtitle: 'कौड़ी, सिका, ढबुआ, दमड़ी विनिमय कैलकुलेटर व चांपा गढ़ शिलालेख',
      icon: Coins,
      gradient: 'from-stone-900 via-amber-950 to-yellow-950',
      actionText: 'Explore Numismatics',
      category: 'culture'
    },
    {
      id: 'muhurat_almanac_checker',
      title: 'संताली शुभ-अशुभ मुहूर्त व कृषि पंचांग परीक्षक',
      subtitle: 'एरोक बोनी, गृह खूंटी, बापला व यात्रा हेतु वार व चंद्र-कला मुहूर्त विचार',
      icon: Moon,
      gradient: 'from-indigo-950 via-slate-900 to-amber-950',
      actionText: 'Check Muhurat',
      category: 'culture'
    },
    {
      id: 'spt_pesa_rights_guide',
      title: 'SPT एक्ट, PESA कानून व ग्राम सभा अधिकार संदर्शिका',
      subtitle: 'धारा २० भूमि सुरक्षा, ग्राम सभा शक्तियाँ, वनाधिकार (FRA) व ५वीं अनुसूची',
      icon: Scale,
      gradient: 'from-sky-950 via-stone-900 to-emerald-950',
      actionText: 'Read Legal Rights',
      category: 'culture'
    },

    // ─── 3. पारंपरिक शिल्प, कला व वास्तु (8 Modules) ───
    {
      id: 'sohrai_art',
      title: 'सोहराय व खोवर भित्तिचित्र कला (Mural Art)',
      subtitle: 'प्राकृतिक रंगों, कंघी व अंगुलियों से बनी भित्ति कला',
      icon: Palette,
      gradient: 'from-amber-600 to-orange-800',
      actionText: 'Explore Murals',
      category: 'crafts'
    },
    {
      id: 'dhokra_art',
      title: 'ढोकरा धातु ढलाई शिल्प (Dhokra Art)',
      subtitle: 'मोम ढलाई तकनीक, घंटी धातु व लोक मूर्तियां',
      icon: Hammer,
      gradient: 'from-amber-700 to-stone-900',
      actionText: 'View Dhokra',
      category: 'crafts'
    },
    {
      id: 'handloom_weaving',
      title: 'पारंपरिक हथकरघा व बुनाई (Handloom)',
      subtitle: 'पांची-पारहांड बुनाई व प्राकृतिक वनस्पति रंगाई',
      icon: Shirt,
      gradient: 'from-purple-600 to-indigo-800',
      actionText: 'Explore Weaving',
      category: 'crafts'
    },
    {
      id: 'woodcraft_carpentry',
      title: 'काष्ठ शिल्प व ढेंकी-नाहेल निर्माण',
      subtitle: 'नाहेल (हल), ढेंकी, पाल्हा व काष्ठ नक्काशी',
      icon: Trees,
      gradient: 'from-stone-700 to-amber-950',
      actionText: 'View Woodcraft',
      category: 'crafts'
    },
    {
      id: 'nahel_dhenki_craft',
      title: 'नाहेल (हल), ढेंकी व जुआठ: काष्ठ-शिल्प वास्तुकला',
      subtitle: 'साल लकड़ी के प्राकृतिक वक्र, उत्तोलक भौतिकी सिद्धांत व अंग-ब्लूप्रिंट',
      icon: Trees,
      gradient: 'from-amber-950 via-stone-800 to-emerald-950',
      actionText: 'Explore Woodcraft',
      category: 'crafts'
    },
    {
      id: 'bamboo_craft',
      title: 'बांस शिल्प व मछली पकड़ने के औजार',
      subtitle: 'सूप, दौरा, पांची व कुमनी नदी जाल निर्माण',
      icon: TreePine,
      gradient: 'from-emerald-700 to-green-900',
      actionText: 'View Bamboo',
      category: 'crafts'
    },
    {
      id: 'blacksmithy_iron',
      title: 'कामार लोहार शिल्प व पारंपरिक औजार',
      subtitle: 'दातरम, तांगा, सार-फासी व देशी धौंकनी भट्टी',
      icon: Hammer,
      gradient: 'from-stone-700 to-neutral-900',
      actionText: 'Discover Craft',
      category: 'crafts'
    },
    {
      id: 'architecture',
      title: 'संताली वास्तुकला व ओड़ाग् लेआउट',
      subtitle: 'कुंभा शैली, मिट्टी की दीवारें, खपरैल व प्राकृतिक शीतलता',
      icon: Home,
      gradient: 'from-orange-700 to-stone-900',
      actionText: 'View Architecture',
      category: 'crafts'
    },
    {
      id: 'puppetry_theater',
      title: 'चादर बादनी काष्ठ कठपुतली नाट्य',
      subtitle: 'अखड़ा लोकनाट्य, काष्ठ कठपुतली व कथा गायन',
      icon: Drama,
      gradient: 'from-rose-600 to-purple-800',
      actionText: 'View Puppetry',
      category: 'crafts'
    },
    {
      id: 'traditional_fishing_craft',
      title: 'हाकू सांदरा व पारम्परिक मत्स्य जाल शिल्प',
      subtitle: 'तोरोदान, घूनी, पिल्ही, झाली व हकु रान वनौषधि विद्या',
      icon: Fish,
      gradient: 'from-teal-800 to-cyan-950',
      actionText: 'Explore Fishing Lore',
      category: 'crafts'
    },
    {
      id: 'natural_pigments_craft',
      title: 'प्राकृतिक भित्ति वर्ण द्रव्य व सोहराय माटी रसायन',
      subtitle: 'दुधी माटी, लाल हासबा, हेन्डे हासबा व डिजिटल वॉल कैनवास',
      icon: Palette,
      gradient: 'from-amber-900 to-red-950',
      actionText: 'Explore Pigments',
      category: 'crafts'
    },
    {
      id: 'banam_tamak_luthier',
      title: 'लोक-वाद्य निर्माण विद्या व बानाम ल्युथियर शिल्प',
      subtitle: 'धोदरो बानाम, टुमदाक, तामाक छिलाई व खिरन सुर-लेप',
      icon: Hammer,
      gradient: 'from-stone-900 via-amber-950 to-orange-950',
      actionText: 'Explore Luthier',
      category: 'crafts'
    },
    {
      id: 'indigenous_math_geometry',
      title: 'संताली लोक-गणित, गांठी लेखा व वास्तु ज्यामिति',
      subtitle: 'गांठी लेखा डोरी, २०-आधारित (इसी) कनवर्टर व २-चाला/४-चाला छप्पर भौतिकी',
      icon: Calculator,
      gradient: 'from-sky-950 via-indigo-950 to-slate-900',
      actionText: 'Explore Math & Geometry',
      category: 'crafts'
    },
    {
      id: 'indigenous_textile_dyes',
      title: 'पांची-पारहाड़ वनस्पति रंगाई व देशी ब्लॉक-प्रिंट',
      subtitle: 'गाबा (बबूल-लोहा), पलाश पीत-केसरिया व लकड़ी के ठप्पा छपाई स्टूडियो',
      icon: Scissors,
      gradient: 'from-red-950 via-stone-900 to-amber-950',
      actionText: 'Explore Block Print',
      category: 'crafts'
    },
    {
      id: 'sagar_bullock_cart',
      title: 'साग़ोड़ (बैलगाड़ी) निर्माण व पहाड़ी परिवहन यांत्रिकी',
      subtitle: '१२-तीलियों वाला साल का पहिया, धूरा, जुआठ व डहर सेरेञ गीत',
      icon: Hammer,
      gradient: 'from-amber-950 via-stone-900 to-stone-950',
      actionText: 'Inspect Sagar Cart',
      category: 'crafts'
    },
    {
      id: 'terracotta_pottery_lore',
      title: 'कुम्हार मृदा कला व भट्ठा (आंवा) ताप विज्ञान',
      subtitle: 'तुकुक, चीलां, डोंगा कलसी की वाष्पीकरण शीतलता व भट्ठा सिमुलेटर',
      icon: Flame,
      gradient: 'from-orange-950 via-stone-900 to-red-950',
      actionText: 'Explore Pottery',
      category: 'crafts'
    },
    {
      id: 'babui_rope_mat_craft',
      title: 'बाबुई रस्सी, पाटिया चटाई व घोंघू (पत्ता रेनकोट) शिल्प',
      subtitle: '३-लड़ी सबई बंटाई, खजूर पत्ती बुनाई, सिकवाड़ व मानसून पत्ती कवच',
      icon: Sprout,
      gradient: 'from-emerald-950 via-stone-900 to-amber-950',
      actionText: 'Explore Fiber Craft',
      category: 'crafts'
    },
    {
      id: 'tasar_silk_sericulture',
      title: 'तसर कोसा (लुगुम) रेशम कीट पालन व असन वन विज्ञान',
      subtitle: 'असन-अर्जुन वृक्ष प्रबंधन, कोया निर्माण, अहिंसक घीचा कताई व बोंगा नेग',
      icon: Sprout,
      gradient: 'from-amber-950 via-stone-900 to-emerald-950',
      actionText: 'Explore Sericulture',
      category: 'crafts'
    },
    {
      id: 'mahua_oil_press_kolhu',
      title: 'कुइंडी, करंज व सुरगुजा काष्ठ कोल्हू (पाटा) तेल पेराई विज्ञान',
      subtitle: 'शून्य-रसायन कोल्ड-प्रेस तेल उत्पादन, खली उपयोग व तेल मात्रा कैलकुलेटर',
      icon: Droplets,
      gradient: 'from-yellow-950 via-stone-900 to-amber-950',
      actionText: 'Explore Oil Press',
      category: 'crafts'
    },
    {
      id: 'donga_boat_river_lore',
      title: 'ताड़-डोंगा नौका निर्माण व नदी-घाट मल्लाह विज्ञान',
      subtitle: 'सखुआ-ताड़ खोदाई डोंगा, धुना जलरोधन, नदी भंवर पहचान व घाट सेरेञ गीत',
      icon: Compass,
      gradient: 'from-cyan-950 via-stone-900 to-blue-950',
      actionText: 'Explore River Craft',
      category: 'crafts'
    },

    // ─── 4. प्रकृति, वन, कृषि व पर्यावरण (11 Modules) ───
    {
      id: 'herbal',
      title: 'पारंपरिक वन-औषधियां (रान - Ethnobotany)',
      subtitle: 'जड़ी-बूटी, छाल, कंद-मूल व आदिम प्राकृतिक चिकित्सा',
      icon: Leaf,
      gradient: 'from-emerald-600 to-green-800',
      actionText: 'Explore Remedies',
      category: 'nature'
    },
    {
      id: 'herbal_drinks',
      title: 'पारंपरिक पेय व प्राकृतिक शरबत (Herbal Drinks)',
      subtitle: 'महुआ रस, इचाक् चाय, मांडी दाक् व पोचोई मर्यादा',
      icon: Coffee,
      gradient: 'from-emerald-700 to-teal-900',
      actionText: 'View Drinks',
      category: 'nature'
    },
    {
      id: 'flora_worksheets',
      title: 'पवित्र वनस्पति व कार्यपत्रक (Worksheets)',
      subtitle: 'सरजोम, महुआ, करम व प्रिंटेबल A4 कार्यपत्रक',
      icon: TreePine,
      gradient: 'from-green-700 to-emerald-900',
      actionText: 'Print Worksheets',
      category: 'nature'
    },
    {
      id: 'agri_seasons',
      title: 'पारंपरिक कृषि एवं ऋतु-चक्र (Agriculture)',
      subtitle: 'बीज बोनी, रोपाई, कटाई व नक्षत्र आधारित खेती',
      icon: Sprout,
      gradient: 'from-emerald-600 to-teal-800',
      actionText: 'View Agri Lore',
      category: 'nature'
    },
    {
      id: 'seasons_weather',
      title: '६ ऋतुएँ व मौसम पूर्वानुमान (Weather Lore)',
      subtitle: 'सितांग, जापानी, दासांय व चींटियों-पक्षियों के संकेत',
      icon: Clock,
      gradient: 'from-teal-600 to-cyan-700',
      actionText: 'Check Seasons',
      category: 'nature'
    },
    {
      id: 'water_harvesting',
      title: 'पारंपरिक जल संचयन (Water Harvesting)',
      subtitle: 'दाड़ी कुआं, जोभिला, पुखरी व ढलानदार बांध खेती',
      icon: Droplets,
      gradient: 'from-blue-600 to-cyan-800',
      actionText: 'View Water Lore',
      category: 'nature'
    },
    {
      id: 'traditional_measures',
      title: 'पारंपरिक नाप-तौल इकाइयां (Measures)',
      subtitle: 'पाय-कथा, सेर, काठ, बीता, हाथ व प्राचीन वस्तु-विनिमय',
      icon: Scale,
      gradient: 'from-amber-700 to-yellow-800',
      actionText: 'View Measures',
      category: 'nature'
    },
    {
      id: 'livestock_khuntau',
      title: 'पशु-धन, खूंटाव परंपरा व पशु-चिकित्सा',
      subtitle: 'गौ-धन वंदना, सोहराय खूंटाव व पारंपरिक वनौषधि उपचार',
      icon: Sparkles,
      gradient: 'from-orange-600 to-amber-800',
      actionText: 'View Cattle Lore',
      category: 'nature'
    },
    {
      id: 'astronomy_lore',
      title: 'संताली खगोल व नक्षत्र ज्ञान (Sky Lore)',
      subtitle: 'इपिल (तारे), भूरका इपिल (शुक्र तारा) व चांदो डाहार',
      icon: Moon,
      gradient: 'from-indigo-800 to-slate-950',
      actionText: 'Explore Stars',
      category: 'nature'
    },
    {
      id: 'cuisine',
      title: 'खान-पान व प्रामाणिक व्यंजन (Cuisine)',
      subtitle: 'जिल पीठा, लेटे मंडी, रुगड़ा-ओत् व घोंघी रसा विधियां',
      icon: UtensilsCrossed,
      gradient: 'from-amber-700 to-orange-900',
      actionText: 'Explore Dishes',
      category: 'nature'
    },
    {
      id: 'traditional_cuisine',
      title: 'संताली पारंपरिक पाककला व व्यंजन',
      subtitle: 'साकाम पीठा, लेटे मंडी, रुगड़ा-ओत् व घोंघी रसा विधियां',
      icon: UtensilsCrossed,
      gradient: 'from-amber-800 to-orange-950',
      actionText: 'Explore Cuisine',
      category: 'nature'
    },

    {
      id: 'wild_foods',
      title: 'संताली वन-साग व पोषण संदर्शिका (वीर आड़ा़)',
      subtitle: 'गेंधारी, मुंगा, मातथा साग, जिल पीठा व पारंपरिक पौष्टिक विधियां',
      icon: Leaf,
      gradient: 'from-teal-900 to-emerald-950',
      actionText: 'Explore Wild Foods',
      category: 'nature'
    },
    {
      id: 'ethno_medicine',
      title: 'पारंपरिक वनौषधि व प्राथमिक उपचार (रान रेहेत)',
      subtitle: 'चोट-मोच, हड्डी संधान, ज्वर, पेचिश व घाव के देसी नुस्खे',
      icon: HeartPulse,
      gradient: 'from-emerald-800 to-teal-950',
      actionText: 'Explore Remedies',
      category: 'nature'
    },
    {
      id: 'haat_barter',
      title: 'संताली पारंपरिक हाट व वस्तु-विनिमय बाज़ार',
      subtitle: 'धान्य, बर्तन, औजार विनिमय, माप-तौल व बाजार संवाद',
      icon: Scale,
      gradient: 'from-amber-800 to-stone-900',
      actionText: 'Explore Haat',
      category: 'nature'
    },
    {
      id: 'bird_lore',
      title: 'चेँड़े चिन्हा: संथाल पक्षी दर्शन, बोली व मौसम पूर्वानुमान',
      subtitle: 'चितिर, कोयल, डाहुक, मोर, फाख्ता की आवाज सिंथेसाइज़र व शकुन ज्ञान',
      icon: Feather,
      gradient: 'from-emerald-900 to-teal-950',
      actionText: 'Listen Bird Calls',
      category: 'nature'
    },
    {
      id: 'heirloom_seeds',
      title: 'संथाल देशज धान, मिलेट्स व "बंधी" बीज संरक्षण वास्तुकला',
      subtitle: 'करहानी, तुपु, दानगोड़, झुमुका धान, ५-वर्षीय बंधी तकनीक व एरोक सिम',
      icon: Sprout,
      gradient: 'from-amber-800 to-emerald-950',
      actionText: 'Explore Heirloom Seeds',
      category: 'nature'
    },
    {
      id: 'bone_setting_healing',
      title: 'संथाल पारंपरिक हड्डी संधानशाला व वनौषधि लेप विद्या',
      subtitle: 'हातु कविराज (रूग-फाड़ो), बांस की पाती, हाड़जोड़ा लेप व अस्पताल रेफरल',
      icon: HeartPulse,
      gradient: 'from-emerald-950 to-teal-900',
      actionText: 'Explore Bone Healing',
      category: 'nature'
    },
    {
      id: 'handi_fermentation_lore',
      title: 'संथाल पारंपरिक वनौषधि किण्वन, रानू व हांडिया विज्ञान',
      subtitle: '१५+ वनौषधियों की रानू, ५-चरणीय मटका किण्वन व देव-तर्पण विधान',
      icon: Droplets,
      gradient: 'from-amber-950 via-yellow-950 to-stone-900',
      actionText: 'Explore Fermentation',
      category: 'nature'
    },
    {
      id: 'ipil_astronomy',
      title: 'इपिल: संथाल पारंपरिक खगोल, नक्षत्र व रात्रि नेविगेशन',
      subtitle: 'हर-काटा (हलवाहा), बुधु-बुधु, हती डाहार व सूर्य-चंद्र प्रभामंडल',
      icon: Moon,
      gradient: 'from-indigo-950 via-slate-900 to-emerald-950',
      actionText: 'Explore Sky Lore',
      category: 'nature'
    },
    {
      id: 'jaher_sacred_grove_ecology',
      title: 'पवित्र जाहेर थान वन पारिस्थितिकी व वृक्ष विद्या',
      subtitle: 'सरजोम, मातकोम, हेसाः-बाड़े का जैव-विविधता तंत्र व संरक्षण संहिता',
      icon: TreePine,
      gradient: 'from-emerald-950 via-teal-950 to-stone-900',
      actionText: 'Explore Sacred Grove',
      category: 'nature'
    },
    {
      id: 'wild_honey_harvesting',
      title: 'संताली वन-शहद संचयन व वन्य-मधुमक्खी विद्या',
      subtitle: 'तेरोम, लुती व हुरुम प्रजातियां, आधा छत्ता काटने की सतत परंपरा व औषधीय शहद',
      icon: Droplets,
      gradient: 'from-amber-950 via-yellow-950 to-stone-900',
      actionText: 'Explore Honey Lore',
      category: 'nature'
    },
    {
      id: 'animal_behavior_omens',
      title: 'संताली पशु-ध्वनि, जैव-संकेत व लोक-शकुन विद्या',
      subtitle: 'चीतल की चेतावनी पुकार, वर्षा-मेंढक नाद व यात्रा के शुभ-अशुभ शकुन',
      icon: Radio,
      gradient: 'from-emerald-950 via-teal-950 to-stone-900',
      actionText: 'Explore Animal Omens',
      category: 'nature'
    },
    {
      id: 'livestock_ethno_vet',
      title: 'गोरु-डांगरा पालन, सुनुम ओजोक् व पशु चिकित्सा विज्ञान',
      subtitle: 'सोहराय सींग-तेल मालिश, टुनी-टोंगा घंटी, खुर-रान व गोहाल रक्षा विधान',
      icon: HeartPulse,
      gradient: 'from-amber-950 via-stone-900 to-emerald-950',
      actionText: 'Explore Cattle Care',
      category: 'nature'
    },
    {
      id: 'sun_dried_forest_preservation',
      title: 'हेंडवा (बांस करील) व मानसून खाद्य संरक्षण विज्ञान',
      subtitle: 'बिना फ्रिज के महुआ लाडू, किण्वित बांस करील, सूखे वन-साग व दीर्घकालीन भंडारण',
      icon: Leaf,
      gradient: 'from-amber-950 via-stone-900 to-orange-950',
      actionText: 'Explore Preservation',
      category: 'nature'
    },
    {
      id: 'aher_pyne_water_governance',
      title: 'आहर-पइन सिंचाई बाँध व पाड़ी जल-बँटवारा प्रणाली',
      subtitle: 'शून्य-पंप ढलान नहर अभियांत्रिकी, सामुदायिक श्रमदान व पाड़ी समय कैलकुलेटर',
      icon: Droplets,
      gradient: 'from-blue-950 via-stone-900 to-teal-950',
      actionText: 'Explore Water Law',
      category: 'nature'
    },
    {
      id: 'bir_sengel_fire_ecology',
      title: 'बीर सेंगोल: वन-अग्नि नियंत्रण व पत्ता अग्नि-रेखा विज्ञान',
      subtitle: 'फाल्गुन पतझड़ फायर-ब्रेक पट्टी, महुआ वृक्ष सुरक्षा व सामुदायिक अग्नि-शमन',
      icon: Flame,
      gradient: 'from-red-950 via-stone-900 to-emerald-950',
      actionText: 'Explore Fire Ecology',
      category: 'nature'
    },

    // ─── 5. खेल, संगीत, नृत्य व लोक-मनोरंजन (18 Modules) ───
    {
      id: 'dances',
      title: 'पारंपरिक शीर्ष १० नृत्य (एनेच)',
      subtitle: 'लागणे, डंता, बाहा, सोहराय, गोलावरी व अखड़ा कदमताल',
      icon: Music,
      gradient: 'from-pink-600 to-rose-700',
      actionText: 'Watch Dances',
      category: 'games'
    },
    {
      id: 'folk_songs',
      title: 'संताली लोकगीत एवं सेरेञ आर्काइव',
      subtitle: 'लागणे सेरेञ, बाहा सेरेञ, सोहराय व दासाय सेरेञ गीत',
      icon: Radio,
      gradient: 'from-amber-600 to-orange-700',
      actionText: 'Listen Seren',
      category: 'games'
    },
    {
      id: 'instruments',
      title: 'पारंपरिक वाद्ययंत्र पैड (Instruments)',
      subtitle: 'तुमाक, तामाक, बनम व तिरियो की ताल बजाएं',
      icon: Music,
      gradient: 'from-red-600 to-amber-700',
      actionText: 'Play Drums',
      category: 'games'
    },
    {
      id: 'sports_sendra',
      title: 'पारंपरिक खेल व शिकार (सेंन्दरा)',
      subtitle: 'आक-सार तीरंदाजी, कटी खेल, छूर खेल व जंगल खेल',
      icon: Target,
      gradient: 'from-emerald-700 to-teal-900',
      actionText: 'Explore Sports',
      category: 'games'
    },
    {
      id: 'sendra_lobir',
      title: 'सेंन्द्रा व लोबीर बैसी (वन नियम व संसद)',
      subtitle: 'पारंपरिक वन संसद, पर्यावरण नैतिकता व न्याय विधान',
      icon: Shield,
      gradient: 'from-teal-800 to-slate-900',
      actionText: 'View Lobir Law',
      category: 'games'
    },
    {
      id: 'archery_simulator',
      title: 'आक-सार धनुर्विद्या सिमुलेटर (Archery Game)',
      subtitle: 'पारंपरिक भेंडा बेझा तुञ व संताली शब्द निशाना खेल',
      icon: Target,
      gradient: 'from-orange-600 to-amber-700',
      actionText: 'Play Archery',
      category: 'games'
    },
    {
      id: 'kudum',
      title: 'कुदुम (पहेलियां) व मुहावरे (Riddles)',
      subtitle: 'पारंपरिक संताली लोक पहेलियां, ज्ञान व व्याख्या',
      icon: HelpCircle,
      gradient: 'from-teal-600 to-emerald-700',
      actionText: 'Solve Riddles',
      category: 'games'
    },
    {
      id: 'riddles_kudum',
      title: 'कुदुम पहेली प्रतियोगिता खेल',
      subtitle: 'लोक पहेलियां, स्कोर बोर्ड, संकेत व ऑडियो उच्चारण',
      icon: HelpCircle,
      gradient: 'from-violet-800 to-purple-950',
      actionText: 'Play Kudum',
      category: 'games'
    },
    {
      id: 'idioms_menkatha',
      title: 'संताली मुहावरे (मेनकाथा)',
      subtitle: 'दार्शनिक जीवन-दर्शन, लाक्षणिक अर्थ व बोलचाल सीख',
      icon: MessageSquare,
      gradient: 'from-amber-700 to-orange-800',
      actionText: 'Learn Idioms',
      category: 'games'
    },
    {
      id: 'proverbs_bhenta',
      title: 'संताली लोकोक्तियां (भेंता काथा)',
      subtitle: 'गूढ़ अर्थ वाली लोक नीति, आचरण व अनुभव वचन',
      icon: MessageSquare,
      gradient: 'from-orange-700 to-amber-900',
      actionText: 'Learn Bhenta',
      category: 'games'
    },
    {
      id: 'wordle',
      title: 'संताली वर्डले (Wordle Game)',
      subtitle: '५ अक्षरी संताली शब्द पहेली खेल व दैनिक अभ्यास',
      icon: Gamepad2,
      gradient: 'from-purple-600 to-indigo-700',
      actionText: 'Play Wordle',
      category: 'games'
    },
    {
      id: 'daily_quiz',
      title: 'दैनिक प्रश्नोत्तरी (Daily Vocab Quiz)',
      subtitle: 'प्रतिदिन ५ नए संताली शब्द, स्ट्रीक व बैज जीतें',
      icon: Flame,
      gradient: 'from-amber-500 via-orange-500 to-rose-600',
      actionText: "Take Today's Quiz",
      category: 'games'
    },
    {
      id: 'stories',
      title: 'लोककथा ऑडियो वाचक (Folk Stories)',
      subtitle: 'पं. रघुनाथ मुर्मू, हूल १८५५ व लोक इतिहास ऑडियो',
      icon: Headphones,
      gradient: 'from-stone-700 to-amber-900',
      actionText: 'Listen Stories',
      category: 'games'
    },
    {
      id: 'illustrated_stories',
      title: 'सचित्र संताली लोककथाएं (Tales)',
      subtitle: 'पिलचु हाड़ाम-बूढ़ी, चालाक तूंईऊ व करम-धरम सचित्र कथाएं',
      icon: BookOpen,
      gradient: 'from-teal-800 to-emerald-950',
      actionText: 'Read Stories',
      category: 'games'
    },
    {
      id: 'kids_rhymes',
      title: 'बालगीत जुगलबंदी (Kids Rhymes Jukebox)',
      subtitle: 'रंग-बिरंगी सचित्र संताली बाल कविताएं व गायन',
      icon: Smile,
      gradient: 'from-pink-600 to-rose-600',
      actionText: 'Sing Rhymes',
      category: 'games'
    },
    {
      id: 'sereng_karaoke',
      title: 'संताली सेरेंग कराओके व ताल अखाड़ा',
      subtitle: 'तुमाक-तामाक थाप लूप, लांगड़े-दोंगेड़ ताल व कराओके गायन',
      icon: Music,
      gradient: 'from-amber-900 to-rose-950',
      actionText: 'Play & Sing',
      category: 'games'
    },
    {
      id: 'folk_radio',
      title: 'संताली लोककथा रेडियो व एम्बिएंट साउंड',
      subtitle: 'जंगल की रात, बहती नदी व बांसुरी के साथ लोककथाएं',
      icon: Radio,
      gradient: 'from-emerald-950 to-stone-900',
      actionText: 'Listen Radio',
      category: 'games'
    },
    {
      id: 'kids_soundboard',
      title: 'संताली सचित्र बाल-साउंडबोर्ड (Kids)',
      subtitle: '१००+ रंग-बिरंगे सचित्र कार्ड्स, आवाज व पहचानो क्विज़',
      icon: Smile,
      gradient: 'from-rose-500 to-amber-500',
      actionText: 'Play Soundboard',
      category: 'games'
    },
    {
      id: 'instruments_orchestra',
      title: 'रुया-गाबुर: ५ पारंपरिक संताली वाद्ययंत्र ऑर्केस्ट्रा',
      subtitle: 'तुम्दाक्, तामाक्, बानाम, तिरिओ और घोंघोर का १६-स्टेप लूपर व मिक्सर',
      icon: Music,
      gradient: 'from-amber-950 via-rose-950 to-stone-900',
      actionText: 'Play Orchestra',
      category: 'games'
    },
    {
      id: 'indigenous_sports_kati',
      title: 'काटी एनेच, बेझा तुन व संताली पारंपरिक लोक-खेल',
      subtitle: 'इंटरैक्टिव काटी गोटी सिमुलेटर, साकरात तीरंदाजी व खेल नियम',
      icon: Trophy,
      gradient: 'from-orange-950 via-amber-900 to-stone-900',
      actionText: 'Play Kati Game',
      category: 'games'
    },
    {
      id: 'sentence_scramble_builder',
      title: 'संताली वाक्य-निर्माण पहेली (Sentence Scramble)',
      subtitle: 'बिखरे संताली शब्दों को सही व्याकरणिक क्रम (SOV) में जोड़कर अभ्यास करें',
      icon: Shuffle,
      gradient: 'from-sky-600 to-indigo-700',
      actionText: 'Build Sentences',
      category: 'language'
    },
    {
      id: 'poetry_sereng_studio',
      title: 'सेरेंग व तुकबंदी काव्य स्टूडियो (Poetry Studio)',
      subtitle: 'सोहराय, बाहा और दोंग शैली में कविता रचना, तुकांत शब्द बैंक व वाचन',
      icon: Feather,
      gradient: 'from-rose-600 to-amber-600',
      actionText: 'Compose Poetry',
      category: 'language'
    },
    {
      id: 'pocket_study_booklet',
      title: 'पॉकेट अध्ययन पुस्तिका निर्माता (Pocket Booklet)',
      subtitle: 'शब्दकोश से चुने गए शब्दों की प्रिंटेबल 8-पेज फ़्लैशकार्ड पुस्तिका बनाएं',
      icon: BookOpen,
      gradient: 'from-teal-600 to-emerald-700',
      actionText: 'Make Booklet',
      category: 'language'
    },
    {
      id: 'clan_kinship_checker',
      title: 'पारिस व गोत्र मर्यादा परीक्षक (Clan & Kinship)',
      subtitle: '१२ संताली पारिस, खूंट, विवाह मर्यादा व गोत्र टोटेम (जंतु/वृक्ष) जांचें',
      icon: Shield,
      gradient: 'from-amber-700 to-orange-700',
      actionText: 'Check Clan',
      category: 'culture'
    },
    {
      id: 'civic_bank_dialogue_kit',
      title: 'बैंक, डाकघर व प्रखंड संवाद किट (Civic Dialogue)',
      subtitle: 'सरकारी दफ्तर, बैंक पासबुक, पेंशन व डाकघर हेतु संताली-हिंदी-अंग्रेज़ी वाक्य',
      icon: Landmark,
      gradient: 'from-blue-700 to-slate-800',
      actionText: 'Open Civic Kit',
      category: 'language'
    },
    {
      id: 'haat_festival_planner',
      title: 'हाट व पर्व सामग्री प्लानर (Haat & Festival)',
      subtitle: 'सोहराय, बाहा, बापला और साप्ताहिक हाट के लिए चेकलिस्ट व अनुमानित बजट',
      icon: ShoppingBag,
      gradient: 'from-amber-600 to-yellow-600',
      actionText: 'Plan Haat List',
      category: 'culture'
    },
    {
      id: 'santali_word_search_puzzle',
      title: 'संताली शब्द-जाल खोज (Word Search Puzzle)',
      subtitle: '8x8 देवनागरी अक्षर-खंड ग्रिड में छिपे संताली शब्द ढूंढें व उच्चारण सुनें',
      icon: Grid3X3,
      gradient: 'from-emerald-600 to-teal-700',
      actionText: 'Play Word Search',
      category: 'games'
    },
    {
      id: 'audio_memory_flip_game',
      title: 'ऑडियो मेमोरी फ्लिप गेम (Audio Memory)',
      subtitle: 'ध्वनि सुनकर संताली शब्द और उसके हिंदी अर्थ की सही जोड़ी मिलाएं',
      icon: Headphones,
      gradient: 'from-indigo-600 to-violet-700',
      actionText: 'Play Memory',
      category: 'games'
    },
    {
      id: 'village_layout_landmark_map',
      title: 'संताल गाँव का मानचित्र व पवित्र स्थल (Village Map)',
      subtitle: 'जाहेर थान, मांझी थान, अखड़ा व कुलही डहर की पारंपरिक ग्राम संरचना देखें',
      icon: MapPin,
      gradient: 'from-emerald-700 to-green-800',
      actionText: 'Explore Village Map',
      category: 'culture'
    },
    {
      id: 'daily_current_affairs',
      title: 'दैनिक करेंट अफेयर्स 2026 (India + Jharkhand)',
      subtitle: '2026 के प्रमुख राष्ट्रीय व झारखंड समसामयिकी नोट्स + 3-भाषा वाचन व मिनी क्विज़',
      icon: Newspaper,
      gradient: 'from-sky-700 to-indigo-800',
      actionText: 'Read Current Affairs',
      category: 'language'
    },
    {
      id: 'native_voice_recorder',
      title: 'मातृभाषी स्वर रिकॉर्डर (Native Voice Bank)',
      subtitle: 'शब्दकोश या कस्टम शब्दों के लिए बुज़ुर्गों की असली संताली आवाज़ ऑफ़लाइन सहेजें',
      icon: Mic,
      gradient: 'from-rose-700 to-amber-800',
      actionText: 'Open Voice Studio',
      category: 'language'
    },
    {
      id: 'two_player_battle',
      title: '2-प्लेयर क्विज़ बैटल (1v1 Same-Device Duel)',
      subtitle: 'एक ही फ़ोन/स्क्रीन पर दो खिलाड़ियों के बीच लाइव बज़र व स्कोर मुकाबला',
      icon: Swords,
      gradient: 'from-amber-700 to-rose-800',
      actionText: 'Start 1v1 Battle',
      category: 'games'
    },
    {
      id: 'smart_srs_coach',
      title: 'स्मार्ट रिवीजन कोच (आज के 15 शब्द · SRS)',
      subtitle: 'भूलने की दर के अनुसार स्मार्ट रिवीजन व श्रेणी-वार Mastery % रिपोर्ट',
      icon: Target,
      gradient: 'from-emerald-700 to-teal-800',
      actionText: 'Start Smart Revision',
      category: 'language'
    },
    {
      id: 'document_book_reader',
      title: 'दस्तावेज़ व PDF बुक रीडर + बल्क कनवर्टर',
      subtitle: 'PDF / TXT किताब अपलोड कर सुनें, शब्द-टैप अर्थ देखें व ओल चिकी नोट्स पाएं',
      icon: FileText,
      gradient: 'from-sky-700 to-blue-800',
      actionText: 'Open Book Reader',
      category: 'language'
    },
    {
      id: 'community_voice_events',
      title: 'समुदाय बोली ऑडियो बैंक व ग्राम पर्व बोर्ड',
      subtitle: 'मातृभाषी आवाज़ रिकॉर्ड करें, Upvote करें व ग्राम पर्व की सूचना देखें',
      icon: Users,
      gradient: 'from-amber-700 to-orange-800',
      actionText: 'Join Community',
      category: 'culture'
    },
    {
      id: 'santhal_belt_atlas',
      title: 'संताल बेल्ट सांस्कृतिक व बोली एटलस',
      subtitle: 'झारखंड, ओडिशा, बंगाल व असम के 7 प्रमुख सांस्कृतिक केंद्र व बोली तुलना',
      icon: Compass,
      gradient: 'from-teal-700 to-emerald-800',
      actionText: 'Explore Atlas',
      category: 'culture'
    },
    {
      id: 'roleplay_conversation',
      title: 'इंटरैक्टिव संताली संवाद सिमुलेटर (Role-Play)',
      subtitle: 'हाट, अस्पताल, स्कूल, बस यात्रा व बुज़ुर्गों से जोहार का बहु-चरणीय अभ्यास',
      icon: MessageSquare,
      gradient: 'from-sky-700 to-indigo-800',
      actionText: 'Start Role-Play',
      category: 'language'
    },
    {
      id: 'family_tree_builder',
      title: 'डिजिटल पारिवारिक वंशावली वृक्ष निर्माता',
      subtitle: '4 पीढ़ियों का पारिस आधारित संताली वंश वृक्ष बनाएँ व HD PNG चार्ट डाउनलोड करें',
      icon: TreePine,
      gradient: 'from-emerald-700 to-teal-800',
      actionText: 'Build Family Tree',
      category: 'culture'
    },
    {
      id: 'teacher_worksheet_maker',
      title: 'शिक्षक व अभिभावक टेस्ट / वर्कशीट जनरेटर',
      subtitle: 'जोड़ी मिलान, रिक्त स्थान, MCQ व ओल चिकी ट्रेसिंग का प्रिंटेबल A4 टेस्ट पेपर',
      icon: ClipboardList,
      gradient: 'from-slate-800 to-sky-900',
      actionText: 'Create Worksheet',
      category: 'language'
    },
    {
      id: 'chhatiar_name_studio',
      title: 'जनम छठियार व संताली बेबी-नेम कार्ड स्टूडियो',
      subtitle: 'पर्व-ऋतु आधारित नाम खोज व डाउनलोड करने योग्य HD जनम छठियार निमंत्रण कार्ड',
      icon: Baby,
      gradient: 'from-amber-600 to-rose-700',
      actionText: 'Open Chhatiar Studio',
      category: 'culture'
    },
    {
      id: 'audio_playlist_player',
      title: 'निरंतर सेरेञ प्लेलिस्ट व स्लीप टाइमर',
      subtitle: 'लोककथा, सेरेञ व बालगीत का बिना रुके वाचन, शफल व 15-60 मिनट स्लीप टाइमर',
      icon: ListMusic,
      gradient: 'from-indigo-700 to-violet-800',
      actionText: 'Play Continuous',
      category: 'language'
    },
    {
      id: 'community_hall_of_fame',
      title: 'सामुदायिक योगदान सम्मान बोर्ड व प्रमाण-पत्र',
      subtitle: 'अनुमोदित शब्द, बोली व ग्राम आयोजनों के योगदानकर्ताओं का लाइव बोर्ड व सर्टिफिकेट',
      icon: Award,
      gradient: 'from-amber-700 to-yellow-700',
      actionText: 'View Hall of Fame',
      category: 'culture'
    },
    {
      id: 'offline_pack_manager',
      title: 'ग्रामीण ऑफ़लाइन पैक व स्टोरेज वेरिफ़ायर',
      subtitle: 'बिना नेटवर्क पढ़ाई हेतु IndexedDB कैश जांच व 1-क्लिक पूर्ण शब्दकोश सिंक',
      icon: HardDrive,
      gradient: 'from-emerald-800 to-slate-800',
      actionText: 'Verify Offline Pack',
      category: 'language'
    },
    {
      id: 'smart_essay_writer',
      title: 'स्मार्ट संताली लेखन व निबंध संपादक',
      subtitle: 'शब्दकोश ऑटोकम्प्लीट, लाइव ओल चिकी प्रीव्यू व वॉइस प्रूफ़रीड के साथ लेखन',
      icon: FileText,
      gradient: 'from-sky-700 to-blue-800',
      actionText: 'Open Smart Writer',
      category: 'language'
    },
    {
      id: 'emergency_voice_cards',
      title: 'आपातकालीन व यात्रा वॉइस-SOS पॉकेट कार्ड',
      subtitle: 'अस्पताल, सफ़र व मदद के लिए 1-टैप लाउड SOS कार्ड व स्कैनेबल QR आईडी PNG',
      icon: HeartPulse,
      gradient: 'from-rose-600 to-red-700',
      actionText: 'Open SOS Cards',
      category: 'culture'
    },
    {
      id: 'weekly_bulletin_maker',
      title: 'ग्राम व विद्यालय साप्ताहिक बुलेटिन निर्माता',
      subtitle: 'ग्राम सभा सूचना, सप्ताह का शब्द व ओल चिकी सहित प्रिंटेबल A4 न्यूज़लेटर',
      icon: Newspaper,
      gradient: 'from-amber-700 to-orange-700',
      actionText: 'Create Bulletin',
      category: 'culture'
    },
    {
      id: 'kids_storybook_maker',
      title: 'सचित्र बाल-कहानी पुस्तक निर्माता',
      subtitle: '1 से 8 पन्नों की संताली-ओल चिकी-हिन्दी चित्रकथा पुस्तक, ऑडियो व प्रिंट बुकलेट',
      icon: BookOpen,
      gradient: 'from-teal-600 to-emerald-700',
      actionText: 'Make Storybook',
      category: 'language'
    },
    {
      id: 'tense_suffix_drill',
      title: 'संताली वाक्य-प्रत्यय व काल अभ्यास ड्रिल लैब',
      subtitle: 'काल व सजीव-निर्जीव प्रत्यय अभ्यास — वैकल्पिक 60-सेकंड टाइमर व स्ट्रीक सहित',
      icon: Flame,
      gradient: 'from-indigo-700 to-sky-700',
      actionText: 'Start Grammar Drill',
      category: 'games'
    },
    {
      id: 'krishi_crop_ledger',
      title: 'कृषि, वनोपज व हाट हिसाब डायरी',
      subtitle: 'धान, महुआ, तसर व हाट आय-व्यय का ऑफ़लाइन बही-खाता, ऑडियो सारांश व CSV',
      icon: Sprout,
      gradient: 'from-emerald-700 to-green-800',
      actionText: 'Open Krishi Ledger',
      category: 'nature'
    },
    {
      id: 'qr_word_cards',
      title: 'कक्षा व दीवार QR शब्द फ़्लैशकार्ड जनरेटर',
      subtitle: 'असली QR कोड वाली प्रिंटेबल A4 शब्द-पट्टियाँ — स्कैन करते ही उच्चारण व अर्थ खुले',
      icon: QrCode,
      gradient: 'from-slate-800 to-indigo-900',
      actionText: 'Generate QR Cards',
      category: 'language'
    },
    {
      id: 'santali_pronoun_case_lab',
      title: 'सर्वनाम, द्विवचन (-किन) व कारक प्रयोगशाला',
      subtitle: 'आबो/आले, द्विवचन व रे-खोन-ते विभक्ति का इंटरैक्टिव वाक्य व क्विज़ लैब',
      icon: Layers,
      gradient: 'from-amber-600 to-orange-700',
      actionText: 'Open Case Lab',
      category: 'language'
    },
    {
      id: 'santali_bazaar_price_calc',
      title: 'हाट-बाज़ार दुकान व बोलती रसीद कैलकुलेटर',
      subtitle: 'चावले-तेल का तुरंत बिल, संताली इसी (20-इकाई) गिनती व बोलती ऑडियो रसीद',
      icon: Calculator,
      gradient: 'from-emerald-600 to-teal-700',
      actionText: 'Calculate Bill',
      category: 'culture'
    },
    {
      id: 'santali_school_prayer_assembly',
      title: 'विद्यालय प्रार्थना सभा व छात्र प्रतिज्ञा स्टूडियो',
      subtitle: 'जाहेर बिनती, विद्यार्थी प्रतिज्ञा, सुविचार व GK बोर्ड (ऑडियो + A4 प्रिंट)',
      icon: Sun,
      gradient: 'from-amber-500 to-rose-600',
      actionText: 'Open Assembly Kit',
      category: 'language'
    },
    {
      id: 'santali_panchayat_scheme_guide',
      title: 'सरकारी योजना, छात्रवृत्ति व राशन-पेंशन गाइड',
      subtitle: 'ई-कल्याण, आवास, FRA वन पट्टा व पेंशन कागज़ात चेकलिस्ट + संताली संवाद',
      icon: Landmark,
      gradient: 'from-indigo-600 to-sky-700',
      actionText: 'Check Schemes',
      category: 'culture'
    },
    {
      id: 'santali_bus_rail_helpline',
      title: 'यात्रा, बस-रेल, हॉस्टल व कचहरी संवाद कार्ड',
      subtitle: '१-टैप बोलकर टिकट, प्लेटफॉर्म व कॉलेज सहायता + कस्टम रास्ता पर्ची',
      icon: Bus,
      gradient: 'from-sky-600 to-blue-800',
      actionText: 'Open Travel Cards',
      category: 'language'
    },
    {
      id: 'santali_audio_listening_test',
      title: 'संताली श्रवण बोध (सुनकर समझें) परीक्षा',
      subtitle: 'धीमी/सामान्य आवाज़ में संताली सुनकर प्रश्न हल करें व प्रतिलेख देखें',
      icon: Headphones,
      gradient: 'from-emerald-700 to-green-900',
      actionText: 'Start Listening Test',
      category: 'language'
    },
    {
      id: 'santali_song_lyric_builder',
      title: 'सोहराय-बाहा लोकगीत व दोहा रचनाकार',
      subtitle: 'तुकबंदी सहायता से ४-पदा संताली गीत रचें, सुनें व HD पोस्टर डाउनलोड करें',
      icon: Music,
      gradient: 'from-rose-600 to-amber-700',
      actionText: 'Compose Sereng',
      category: 'games'
    },
    {
      id: 'santali_jora_katha_lab',
      title: 'संताली जोड़ा काथा, विलोम व पर्यायवाची लैब',
      subtitle: 'दाक्-माड़ी, चांदो-माहिट जैसे युग्म शब्द, विलोम जोड़े व तुकबंदी क्विज़',
      icon: Sparkles,
      gradient: 'from-amber-600 to-rose-700',
      actionText: 'Explore Jora Katha',
      category: 'language'
    },
    {
      id: 'santali_question_negation_lab',
      title: 'प्रश्न-वाचक व नकारात्मक वाक्य प्रयोगशाला',
      subtitle: 'चेत्, ओकोय, तिस, तिनाक् व बाङ/बानुक्/आलो से तुरंत संताली वाक्य बनाएँ',
      icon: HelpCircle,
      gradient: 'from-sky-600 to-indigo-700',
      actionText: 'Build Sentences',
      category: 'language'
    },
    {
      id: 'santali_spell_fix_lab',
      title: 'संताली वर्तनी व रुद्ध-ध्वनि शुद्धि लैब',
      subtitle: 'ओड़ाक् बनाम ओड़ाक जैसी अशुद्धियाँ पहचानें और सही देवनागरी-ओल चिकी सीखें',
      icon: PenTool,
      gradient: 'from-emerald-600 to-teal-700',
      actionText: 'Practice Spelling',
      category: 'language'
    },
    {
      id: 'santali_shg_savings_ledger',
      title: 'सखी मंडल (SHG) बचत व ऋण बही-खाता',
      subtitle: 'साप्ताहिक बचत टिक, सदस्य ऋण शेष, कुल कोष व बोलती ऑडियो रिपोर्ट (ऑफ़लाइन)',
      icon: Users,
      gradient: 'from-teal-700 to-emerald-800',
      actionText: 'Open SHG Ledger',
      category: 'culture'
    },
    {
      id: 'santali_maternal_child_health',
      title: 'मातृ-शिशु स्वास्थ्य, टीकाकरण व पोषण गाइड',
      subtitle: 'प्रसव-पूर्व जांच, शिशु टीका टिक-लिस्ट व संताली देवनागरी पोषण सलाह',
      icon: HeartPulse,
      gradient: 'from-rose-600 to-red-700',
      actionText: 'View Health Guide',
      category: 'nature'
    },
    {
      id: 'santali_report_card_maker',
      title: 'विद्यालय संताली प्रगति-पत्र (Report Card)',
      subtitle: 'संताली-हिन्दी-गणित अंक, ग्रेड व संताली टिप्पणी सहित प्रिंटेबल A4 व PNG कार्ड',
      icon: Award,
      gradient: 'from-indigo-600 to-violet-700',
      actionText: 'Create Report Card',
      category: 'language'
    },
    {
      id: 'santali_literary_pioneers',
      title: 'संताली साहित्यकार व ओल चिकी पुरोधा',
      subtitle: 'रघुनाथ मुर्मू, माझी रामदास टुडू व पॉल जुझार सोरेन जीवनी, कृतियाँ व क्विज़',
      icon: BookOpen,
      gradient: 'from-amber-700 to-orange-800',
      actionText: 'Read Biographies',
      category: 'culture'
    },

    ...(isAdmin
      ? [
          {
            id: 'admin_cms' as ActiveDesktopTab,
            title: 'Admin Master CMS',
            subtitle: 'Direct Add/Edit/Update access across all sections',
            icon: Edit3,
            gradient: 'from-slate-900 via-amber-900 to-slate-900',
            actionText: 'Open Master CMS',
            category: 'language' as const
          }
        ]
      : [])
  ], [lexiconCount, isAdmin]);

  const categoryCounts = useMemo(() => {
    const counts = { language: 0, culture: 0, crafts: 0, nature: 0, games: 0 };
    for (const c of featureCards) {
      counts[c.category] += 1;
    }
    return counts;
  }, [featureCards]);

  const filteredFeatureCards = useMemo(() => {
    const q = deferredModuleFilterText.toLowerCase().trim();
    return featureCards.filter((card) => {
      const matchesCat = moduleCategory === 'all' || card.category === moduleCategory;
      const matchesQuery =
        !q ||
        card.title.toLowerCase().includes(q) ||
        card.subtitle.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [featureCards, moduleCategory, deferredModuleFilterText]);

  const isDefaultUnfilteredAll = moduleCategory === 'all' && !deferredModuleFilterText.trim();
  const displayedFeatureCards = useMemo(() => {
    if (isDefaultUnfilteredAll && !showAllModules) {
      return filteredFeatureCards.slice(0, 24);
    }
    return filteredFeatureCards;
  }, [filteredFeatureCards, isDefaultUnfilteredAll, showAllModules]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Search Bar & Script Selector (No Bengali) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div
          onClick={onOpenSearch}
          className="relative flex-1 w-full cursor-pointer group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            readOnly
            onClick={onOpenSearch}
            placeholder={`Search ${lexiconCount.toLocaleString()}+ words, Santali Devanagari, grammar, tools... (Ctrl+K)`}
            className="w-full pl-10 pr-20 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 bg-slate-50/80 hover:bg-slate-100 border border-slate-200/90 rounded-xl focus:outline-none transition-all cursor-pointer"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="hidden sm:inline-block font-mono text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
              Ctrl K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <select
            value={activeScript === 'english' ? 'english' : activeScript === 'hindi' || activeScript === 'devanagari' ? 'hindi' : 'santali'}
            onChange={(e) => onScriptChange(e.target.value as ScriptType)}
            className="text-xs bg-slate-100 hover:bg-slate-200 border-none rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="santali">Santali</option>
            <option value="hindi">Hindi (हिन्दी)</option>
            <option value="english">English</option>
          </select>

          <button
            onClick={() => onNavigate('learn')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="Speech search"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ═══ FULL-PAGE HERO BANNER WITH SLIDESHOW ═══ */}
      <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border border-amber-200/80 shadow-xs p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 mb-6">
        {/* Admin Live-Edit Trigger */}
        {isAdmin && !isEditingHero && (
          <button
            onClick={() => {
              setEditedTitle(heroConfig.welcomeTitle);
              setEditedSub(heroConfig.subTitle);
              setEditedMotto(heroConfig.motto);
              setEditedQuote(heroConfig.quoteEnglish);
              setEditedQuoteSantali(heroConfig.quoteSantali);
              setIsEditingHero(true);
            }}
            className="absolute top-3 right-3 z-30 px-3 py-1.5 bg-white/90 hover:bg-white text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
            <span>Edit Hero Content</span>
          </button>
        )}

        {isEditingHero ? (
          /* Hero Inline Admin Editor */
          <div className="w-full z-20 bg-white/95 p-5 rounded-2xl border border-amber-300 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-100">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>Live Edit Hero Banner</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetHeroConfig}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Default
                </button>
                <button
                  onClick={() => setIsEditingHero(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Welcome Headline</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subtitle / Platform</label>
                <input
                  type="text"
                  value={editedSub}
                  onChange={(e) => setEditedSub(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Motto</label>
                <input
                  type="text"
                  value={editedMotto}
                  onChange={(e) => setEditedMotto(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">English Quote ("Our Language...")</label>
                <input
                  type="text"
                  value={editedQuote}
                  onChange={(e) => setEditedQuote(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Santali Slogan ("Abo Ror, Abo Uprum, Abo Gorob")</label>
                <input
                  type="text"
                  value={editedQuoteSantali}
                  onChange={(e) => setEditedQuoteSantali(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-serif"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditingHero(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHero}
                className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        ) : (
          /* Regular Hero Display */
          <>
            <div className="space-y-4 z-10 max-w-lg shrink-0 flex flex-col justify-between">
              {/* Brand Emblem & Organization Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-amber-300 shadow-2xs w-fit">
                <img
                  src="/assets/aistudio/bosc-main-logo_39d98de6.png"
                  alt="BOSC"
                  className="w-5 h-5 object-contain"
                />
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-950">
                  BOSC Tech &amp; Edu
                </span>
                <span className="text-[10px] text-amber-800 font-semibold border-l border-amber-200 pl-2">
                  Official Platform
                </span>
              </div>

              {/* Main Welcome Heading */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-950 tracking-tight leading-tight">
                  Johar! Welcome to Santal आ़रसी
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-amber-900/90 mt-1.5 leading-relaxed">
                  Santali Language &amp; Learning Platform · BOSC Tech &amp; Edu
                </p>
              </div>

              {/* Mission Pillars (Type · Learn · Preserve · Promote) */}
              <div className="flex flex-wrap items-center gap-2 py-0.5">
                {['Type', 'Learn', 'Preserve', 'Promote'].map((pill) => (
                  <span
                    key={pill}
                    className="px-2.5 py-1 text-[11px] font-bold text-amber-950 bg-amber-200/90 border border-amber-300 rounded-lg shadow-2xs"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              {/* Professional Action Area: Explore Suite Features & Direct Jumps */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('dashboard-modules-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-900 to-amber-950 hover:from-amber-800 hover:to-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer ring-2 ring-amber-900/20"
                >
                  <span>Explore Suite Features</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-2.5 py-1.5 text-[11px] font-bold bg-white/80 hover:bg-white text-amber-950 border border-amber-300/80 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    📖 Lexicon
                  </button>
                  <button
                    onClick={() => onNavigate('calendar')}
                    className="px-2.5 py-1.5 text-[11px] font-bold bg-white/80 hover:bg-white text-amber-950 border border-amber-300/80 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    📅 पर्व (Festivals)
                  </button>
                  <button
                    onClick={() => onNavigate('learn')}
                    className="px-2.5 py-1.5 text-[11px] font-bold bg-white/80 hover:bg-white text-amber-950 border border-amber-300/80 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    🎓 Learn
                  </button>
                  <button
                    onClick={() => onNavigate('daily_quiz')}
                    className="px-2.5 py-1.5 text-[11px] font-bold bg-white/80 hover:bg-white text-amber-950 border border-amber-300/80 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Flame className="w-3 h-3 text-orange-600 animate-pulse" />
                    <span>Daily Quiz</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Rotating Heritage Slideshow (Admin-Only Upload) & Cultural Motto */}
            <div className="relative z-10 flex flex-col items-center justify-center shrink-0 w-full lg:flex-1 lg:max-w-xl xl:max-w-2xl space-y-2">
              <SantaliHeritageSlideshow className="w-full" onOpenAdminLogin={onOpenAdmin} />
              <div className="text-center w-full px-2">
                <p className="font-serif italic text-amber-950 text-xs md:text-sm font-bold tracking-wide">
                  "{heroConfig.quoteEnglish || 'Our Language, Our Identity, Our Pride'}"
                </p>
                <p className="text-xs text-amber-900 font-medium italic mt-0.5">
                  "{heroConfig.quoteSantali || 'Abo Ror, Abo Uprum, Abo Gorob'}"
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ═══ WORD OF THE DAY (आज का संताली शब्द) WITH WHATSAPP & PNG CARD EXPORT ═══ */}
      {wordOfTheDay && (
        <section className="bg-white rounded-3xl border border-amber-200 shadow-xs p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-800">
              <span>आज का संताली शब्द (Word of the Day)</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">{wordOfTheDay.category}</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {wordOfTheDay.wordDevanagari}
              </h2>
              <span className="text-lg font-bold text-amber-800">
                {toOlChikiAuto(wordOfTheDay.wordDevanagari)}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {wordOfTheDay.wordRoman} ({wordOfTheDay.phonetic})
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700">
              <strong>हिन्दी:</strong> {wordOfTheDay.meaningHindi} ·{' '}
              <strong>English:</strong> {wordOfTheDay.meaningEnglish}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                speakWithFemaleVoice(
                  `${wordOfTheDay.wordDevanagari}. ${wordOfTheDay.meaningHindi}`,
                  { autoDetectLanguage: true }
                )
              }
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>सुनें</span>
            </button>
            <button
              type="button"
              onClick={handleCopyWordOfDayWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {wotdCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{wotdCopied ? 'कॉपी हो गया!' : 'WhatsApp कॉपी'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadWordOfDayCard}
              className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>कार्ड PNG</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('smart_srs_coach')}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold cursor-pointer"
            >
              आज के 15 शब्द →
            </button>
          </div>
        </section>
      )}

      {/* ═══ TOP 10 FLAGSHIP FEATURES SHOWCASE (All-Device Responsive) ═══ */}
      <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
              <Trophy className="w-3 h-3 text-amber-700" />
              <span>Top 10 Features</span>
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
              Santal आ़रसी की शीर्ष १० प्रमुख विशेषताएँ (Top 10 Platform Features)
            </h2>
          </div>
          <button
            onClick={() =>
              handleSpeak(
                'Santal आ़रसी की शीर्ष १० विशेषताएँ: ५०,०००+ शब्दकोश, वर्चुअल कीबोर्ड, रियल सीबीटी परीक्षा हब, सर्व-भाषा ऑडियो रीडर, त्रि-लिपि कनवर्टर, संताली अनुवादक, नृत्य अखड़ा व वाद्ययंत्र ऑर्केस्ट्रा, मांझी परगना न्याय, गाँव का मानचित्र, और इंटरैक्टिव शैक्षिक खेल।'
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
            <span>शीर्ष १० सुनें</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { num: '01', tab: 'dashboard' as ActiveDesktopTab, title: `${lexiconCount.toLocaleString()}+ शब्दकोश`, sub: 'संताली-हिन्दी-अंग्रेज़ी शब्द व उच्चारण', icon: BookOpen, color: 'bg-amber-600' },
            { num: '02', tab: 'keyboard' as ActiveDesktopTab, title: 'संताली कीबोर्ड व स्पीड', sub: 'देवनागरी, रोमन व ओल चिकी टाइपिंग', icon: Keyboard, color: 'bg-sky-600' },
            { num: '03', tab: 'santali_exam_prep_jpsc' as ActiveDesktopTab, title: 'रियल CBT परीक्षा हब', sub: 'लाइव टाइमर, OMR व ज़ीरो-रिपीट टेस्ट', icon: GraduationCap, color: 'bg-emerald-600' },
            { num: '04', tab: 'universal_text_reader' as ActiveDesktopTab, title: 'सर्व-भाषा ऑडियो रीडर', sub: '10 महिला-पुरुष आवाज़ें व पूर्ण वाचन', icon: Volume2, color: 'bg-indigo-600' },
            { num: '05', tab: 'script_converter' as ActiveDesktopTab, title: 'त्रि-लिपि कनवर्टर', sub: 'Ol Chiki ↔ देवनागरी ↔ Roman', icon: ArrowRightLeft, color: 'bg-violet-600' },
            { num: '06', tab: 'translator' as ActiveDesktopTab, title: 'संताली अनुवादक', sub: 'तुरंत वाक्य अनुवाद व दैनिक संवाद', icon: Languages, color: 'bg-teal-600' },
            { num: '07', tab: 'dance_akhda_formations' as ActiveDesktopTab, title: 'नृत्य व वाद्य ऑर्केस्ट्रा', sub: 'अखड़ा गाइड, तुम्दाक्-तामाक् ताल लूप', icon: Music, color: 'bg-rose-600' },
            { num: '08', tab: 'governance' as ActiveDesktopTab, title: 'मांझी परगना व अधिकार', sub: 'लो बीर बैसी, SPT व PESA ग्राम सभा', icon: Scale, color: 'bg-orange-600' },
            { num: '09', tab: 'village_layout_landmark_map' as ActiveDesktopTab, title: 'गाँव मानचित्र व पारिस', sub: 'जाहेर थान, १२ गोत्र व बापला संस्कार', icon: MapPin, color: 'bg-green-700' },
            { num: '10', tab: 'santali_word_search_puzzle' as ActiveDesktopTab, title: 'गेम्स व पॉकेट बुकलेट', sub: 'वर्ड सर्च, ऑडियो मेमोरी व प्रिंट किताब', icon: Gamepad2, color: 'bg-fuchsia-600' }
          ].map((feat) => {
            const FeatIcon = feat.icon;
            return (
              <button
                key={feat.num}
                onClick={() => onNavigate(feat.tab)}
                className="group text-left p-3.5 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-2 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-8 h-8 rounded-xl ${feat.color} text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                    <FeatIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-black text-slate-400 group-hover:text-amber-600 font-mono">
                    #{feat.num}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 group-hover:text-amber-800 line-clamp-1">
                    {feat.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-snug">
                    {feat.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Left Column & Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-5">

          {/* New Additions Spotlight Banners (Crisp Light Theme) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div
              onClick={() => onNavigate('social_cards')}
              className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50/70 to-white text-slate-900 cursor-pointer shadow-xs hover:shadow-md transition-all hover:scale-[1.01] flex items-center justify-between border border-amber-200 group"
            >
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[10px] uppercase tracking-wider inline-block">
                  ✨ नया स्टूडियो (HD Card)
                </span>
                <h3 className="font-black text-sm text-slate-900 group-hover:text-amber-800">
                  सोशल मीडिया कार्ड व पोस्टर
                </h3>
                <p className="text-[11px] text-slate-600 leading-snug">
                  सोहराय भित्तिचित्र, संताली विचार व WhatsApp स्टेटस HD शेयर
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 text-amber-700 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            <div
              onClick={() => onNavigate('lunar_calendar')}
              className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/70 to-white text-slate-900 cursor-pointer shadow-xs hover:shadow-md transition-all hover:scale-[1.01] flex items-center justify-between border border-sky-200 group"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">
                  लाइव पंचांग · {nextFestival.dateLabel} ·{' '}
                  {nextFestival.daysLeft === 0 ? 'आज महापर्व!' : `${nextFestival.daysLeft} दिन शेष`}
                </span>
                <h3 className="font-black text-sm text-slate-900 group-hover:text-indigo-800">
                  चंद्र पंचांग व महापर्व टाइमर
                </h3>
                <p className="text-[11px] text-slate-600 leading-snug">
                  आगामी: {nextFestival.nameDev} (तिथि एडिट व लाइव काउंटडाउन)
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0 text-indigo-700 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* 60+ Core Feature Cards Grid with Categories & Live Search */}
          <div id="dashboard-modules-grid" className="space-y-3 scroll-mt-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Interactive Cultural &amp; Learning Modules</span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  संताली भाषा, संस्कृति, शिल्प, प्रकृति और लोक-मनोरंजन के सभी मॉड्यूल्स
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-amber-900 font-black bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
                  {filteredFeatureCards.length} / {featureCards.length} मॉड्यूल्स (Live)
                </span>
              </div>
            </div>

            {/* Filter Pills & Live Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar text-xs">
                {[
                  { id: 'all', label: `🌟 सभी (${featureCards.length})` },
                  { id: 'language', label: `📖 भाषा व व्याकरण (${categoryCounts.language})` },
                  { id: 'culture', label: `🪔 संस्कृति व पूर्वज (${categoryCounts.culture})` },
                  { id: 'crafts', label: `🎨 शिल्प व कला (${categoryCounts.crafts})` },
                  { id: 'nature', label: `🌿 प्रकृति व कृषि (${categoryCounts.nature})` },
                  { id: 'games', label: `🏹 खेल व संगीत (${categoryCounts.games})` }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setModuleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer text-xs ${
                      moduleCategory === cat.id
                        ? 'bg-amber-600 text-white font-black shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Module Search Input */}
              <div className="relative shrink-0 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={moduleFilterText}
                  onChange={(e) => setModuleFilterText(e.target.value)}
                  placeholder="मॉड्यूल खोजें..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                {moduleFilterText && (
                  <button
                    onClick={() => setModuleFilterText('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Grid of Interactive Module Cards (Windowed initially for zero-lag rendering) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {displayedFeatureCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={`${card.id}_${card.title}`}
                    onClick={() => onNavigate(card.targetTab || card.id)}
                    className="group cursor-pointer rounded-2xl p-3.5 bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between h-40 relative overflow-hidden"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="my-1.5">
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                        {card.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {card.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-600 group-hover:text-amber-800">
                      <span>{card.actionText}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {isDefaultUnfilteredAll && filteredFeatureCards.length > 24 && (
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => setShowAllModules((prev) => !prev)}
                  className="px-5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold shadow-2xs transition-colors cursor-pointer tabular-nums"
                >
                  {showAllModules
                    ? 'केवल शीर्ष 24 दिखाएँ (Show Less)'
                    : `सभी ${filteredFeatureCards.length} मॉड्यूल्स दिखाएँ (Show All)`}
                </button>
              </div>
            )}

            {filteredFeatureCards.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                <p className="font-bold text-slate-700">कोई मॉड्यूल नहीं मिला।</p>
                <p className="mt-1">कृपया दूसरा शब्द खोजें या श्रेणी बदलें।</p>
              </div>
            )}
          </div>

          {/* Quick Tools Row with Professional Icons */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Quick Tools:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <a
                href={SANTALI_KEYBOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200/70 transition-colors font-medium text-xs cursor-pointer"
              >
                <Keyboard className="w-3.5 h-3.5 text-sky-600" />
                <span>Virtual Keyboard ↗</span>
              </a>
              <button
                onClick={() => handleSpeak('जोहार! Johar! Welcome to Santali Devanagari Suite.')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200/70 transition-colors font-medium text-xs cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Listen Audio</span>
              </button>
              <button
                onClick={() => handleSpeak('ध्वनि परीक्षण सफल। स्पीकर ठीक से काम कर रहा है। Sound test passed. Speaker active.')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-lg border border-amber-300 transition-colors font-bold text-xs cursor-pointer shadow-2xs"
                title="Verify Speaker Hardware and Female Voice"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                <span>Test Speaker</span>
              </button>
              <button
                onClick={() => onNavigate('calendar')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200/70 transition-colors font-medium text-xs cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>पर्व (Festivals)</span>
              </button>
              <button
                onClick={() => onNavigate('learn')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200/70 transition-colors font-medium text-xs cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Letter Quiz</span>
              </button>
              <a
                href="https://translate.google.com/?sl=auto&tl=hi&op=translate"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors font-bold text-xs cursor-pointer"
                title="Open Google Translator (Online Instant)"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Translator</span>
              </a>
              <button
                onClick={() => onNavigate('daily_quiz')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 rounded-lg border border-amber-300 transition-colors font-bold text-xs cursor-pointer shadow-2xs"
                title="Daily Santali Vocabulary Quiz & Streak"
              >
                <Flame className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                <span>Daily Quiz</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200/70 transition-colors font-medium text-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print PDF</span>
              </button>
            </div>
          </div>

          {/* Universal Live Voice Speaker & Reader */}
          <React.Suspense fallback={<div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500">ऑडियो रीडर लोड हो रहा है...</div>}>
            <TextSpeakerReader />
          </React.Suspense>
        </div>

        {/* Right Column (4 cols on lg): Script Selector + Recent Words + Tree Quote */}
        <div className="lg:col-span-4 space-y-5">
          {/* Script Modes (Only Santali, Hindi, English) */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Language &amp; Script
              </h3>
              <span className="text-[10px] text-slate-400">3 Languages</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => onScriptChange('santali_dev')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  activeScript === 'santali_dev'
                    ? 'bg-amber-500 text-white font-bold shadow-2xs border-amber-600'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                संताली देवनागरी
              </button>
              <button
                onClick={() => onScriptChange('hindi')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  activeScript === 'hindi' || activeScript === 'devanagari'
                    ? 'bg-amber-500 text-white font-bold shadow-2xs border-amber-600'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Hindi (हिंदी)
              </button>
              <button
                onClick={() => onScriptChange('english')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  activeScript === 'english' || activeScript === 'santali_roman'
                    ? 'bg-amber-500 text-white font-bold shadow-2xs border-amber-600'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Recent Words List */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Featured Words
              </h3>
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-[11px] text-sky-600 hover:underline font-semibold"
              >
                View all ({Math.max(words.length, 50000).toLocaleString()}+) →
              </button>
            </div>

            <div className="space-y-1.5">
              {recentWords.map((word) => (
                <div
                  key={word.id}
                  onClick={() => onNavigate('dashboard')}
                  className="p-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                      {word.wordRoman.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-amber-800">
                          {word.wordRoman}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({word.wordDevanagari})
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {word.phonetic} · {word.meaningEnglish} · {word.meaningHindi.split(',')[0]}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(word.wordRoman);
                    }}
                    className="p-1.5 text-slate-400 hover:text-amber-700 rounded-md transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Quote Card & Sacred Tree */}
          <div className="p-4 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 rounded-2xl border border-amber-200/70 shadow-xs text-center space-y-2">
            <div className="p-2.5 bg-amber-100/40 rounded-xl">
              <p className="text-xs italic text-amber-950 font-serif leading-relaxed">
                "Santali bhasha, amag gorob, jioom m or katna."
              </p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                — Santal आ़रसी · BOSC Tech &amp; Edu
              </p>
            </div>
            <div className="w-full flex items-center justify-center">
              <CulturalTree variant="banner" className="w-44 h-28" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Source & Regional Dialect Advisory */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 text-xs text-slate-700 space-y-1.5 print:hidden">
        <p className="font-bold text-amber-950">
          सामग्री स्रोत एवं क्षेत्रीय बोली सूचना (Content Source &amp; Regional Dialect Disclaimer)
        </p>
        <p className="leading-relaxed">
          इस प्लेटफ़ॉर्म पर उपलब्ध सभी शब्द, लोककथाएँ, गीत, परीक्षा सामग्री, पंचांग एवं सांस्कृतिक विवरण विभिन्न पारंपरिक, मौखिक, शैक्षिक और सार्वजनिक स्रोतों से संकलित किए गए हैं। हम किसी भी सामग्री की १००% पूर्णता या आधिकारिक पुष्टि का दावा नहीं करते हैं। क्षेत्र, राज्य एवं स्थानीय बोलियों (झारखंड, पश्चिम बंगाल, ओडिशा, असम आदि) के आधार पर संताली भाषा के शब्दों, उच्चारण और वर्तनी में भिन्नता हो सकती है।
        </p>
      </div>
    </div>
  );
});
