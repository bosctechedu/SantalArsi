import React, { useState, useEffect, useRef, useMemo, useDeferredValue } from 'react';
import { useAdmin } from '../context/AdminContext';
import { ActiveDesktopTab, SantaliWord } from '../types';
import { speakWithFemaleVoice } from '../utils/speech';
import { useVoiceSearch } from '../utils/voiceSearch';
import {
  Search,
  X,
  Keyboard,
  BookOpen,
  Leaf,
  GraduationCap,
  Languages,
  Flame,
  Settings,
  ShieldCheck,
  Volume2,
  ArrowRight,
  Sparkles,
  Landmark,
  Compass,
  CornerDownLeft,
  PenTool,
  MessageSquare,
  Layers,
  Palette,
  HelpCircle,
  Calendar,
  Gamepad2,
  Headphones,
  Mic,
  Music,
  Users,
  Smile,
  Clock,
  Shield,
  TreePine,
  Edit3,
  Globe,
  Quote,
  Scale,
  Sprout,
  Drama,
  Moon,
  Home,
  Droplets,
  Scissors,
  Hammer,
  HeartHandshake,
  Trees,
  ShoppingBag,
  Activity,
  Baby,
  Coffee,
  Target,
  FileText,
  Bookmark,
  HeartPulse,
  Smartphone,
  ArrowRightLeft,
  Feather,
  Heart,
  Radio,
  Trophy,
  Fish,
  Calculator,
  Coins,
  Scroll,
  Award,
  Shuffle,
  Grid3X3,
  MapPin,
  Newspaper,
  Swords,
  ListMusic,
  HardDrive,
  ClipboardList,
  QrCode,
  Sun,
  Bus
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveDesktopTab) => void;
  onSendToTranslator?: (text: string) => void;
  onOpenAdmin?: () => void;
}

interface SearchItem {
  id: string;
  type: 'word' | 'module' | 'culture' | 'action';
  title: string;
  subtitle: string;
  scriptDevanagari?: string;
  category?: string;
  targetTab?: ActiveDesktopTab;
  wordData?: SantaliWord;
  description?: string;
  icon?: any;
}

// Built-in cultural & historical knowledge base entries
const CULTURAL_TOPICS: SearchItem[] = [
  {
    id: 'cult-raghunath',
    type: 'culture',
    title: 'Pandit Raghunath Murmu (Guru Gomke)',
    subtitle: 'Linguistic pioneer & philosopher · Visionary cultural guardian',
    scriptDevanagari: 'गुरु गोमके पण्डित रघुनाथ मुर्मू',
    category: 'History & Pioneers',
    targetTab: 'learn',
    description: 'Born in Mayurbhanj, Odisha (1905–1982). Cultural pioneer who unified and revitalized Santali education.'
  },
  {
    id: 'cult-hool',
    type: 'culture',
    title: 'Santhal Hool 1855 (Santali Revolution)',
    subtitle: 'Sidhu & Kanhu Murmu · The historic 1855 tribal revolution for self-rule and freedom',
    scriptDevanagari: 'सान्ताल हुल',
    category: 'Freedom & Heritage',
    targetTab: 'learn',
    description: 'On 30 June 1855, over 10,000 Santals led by Sidhu, Kanhu, Chand, and Bhairav declared independence against British colonial exploitation.'
  },
  {
    id: 'cult-sohrai',
    type: 'culture',
    title: 'Sohrai Mahaparv (सोहराय महापर्व)',
    subtitle: 'The five-day harvest and cattle thanksgiving festival with folk music and mural art',
    scriptDevanagari: 'सोहराय',
    category: 'Festivals',
    targetTab: 'calendar',
    description: 'Celebrated after the winter paddy harvest (November–January). Marked by cattle blessings, Sohrai songs, and earth murals.'
  },
  {
    id: 'cult-baha',
    type: 'culture',
    title: 'Baha Parab (बाहा परब)',
    subtitle: 'Spring Flower Festival · Welcoming Sal blossoms and nature renewal',
    scriptDevanagari: 'बाहा परब',
    category: 'Festivals',
    targetTab: 'calendar',
    description: 'The Spring festival celebrated when Sal trees bloom. Offerings made at Jaher Than by Naike (priest).'
  },
  {
    id: 'cult-birsa',
    type: 'culture',
    title: 'Dharti Aaba Birsa Munda (1875–1900)',
    subtitle: 'Ulgulan leader, tribal rights guardian, and legendary Indian freedom fighter',
    scriptDevanagari: 'बिरसा मुंडा',
    category: 'Pioneers',
    targetTab: 'learn',
    description: 'Led the Ulgulan movement against the British and oppressive land laws in Chotanagpur.'
  },
  {
    id: 'cult-santali-devnagari',
    type: 'culture',
    title: 'Santali Devanagari (संताली देवनागरी)',
    subtitle: 'Standardized Devanagari orthography for Santali literature and daily communication',
    scriptDevanagari: 'संताली देवनागरी',
    category: 'Linguistics',
    targetTab: 'learn',
    description: 'Enables millions of Santali speakers across Jharkhand, Bihar, and Bengal to read, write, and publish accurately.'
  }
];

// App Modules list
const APP_MODULES: SearchItem[] = [
  {
    id: 'mod-keyboard',
    type: 'module',
    title: 'Santali Virtual Keyboard',
    subtitle: 'Type in Santali Devanagari and Roman with live diacritics',
    targetTab: 'keyboard',
    icon: Keyboard,
    category: 'Input Tools',
    description: 'Multilingual keyboard with real-time Indian phonetic suggestions and themes.'
  },
  {
    id: 'mod-dict',
    type: 'module',
    title: 'Santali Dictionary (50,000+ Words)',
    subtitle: 'Multilingual vocabulary with female voice pronunciation and sentence examples',
    targetTab: 'dashboard',
    icon: BookOpen,
    category: 'Dictionary',
    description: 'Search English, Hindi, and Santali Devanagari with instant phonetics and audio playback.'
  },
  {
    id: 'mod-learn',
    type: 'module',
    title: 'Learn Santali Devanagari',
    subtitle: 'Master letters, vowels, numbers, and interactive daily vocabulary quizzes',
    targetTab: 'learn',
    icon: GraduationCap,
    category: 'Education',
    description: 'Interactive letter chart, audio phonetics, shape mnemonics, and knowledge quizzes.'
  },
  {
    id: 'mod-trans',
    type: 'module',
    title: 'Multilingual Translator',
    subtitle: 'Instant translation between Santali (Devanagari/Roman), Hindi, and English',
    targetTab: 'translator',
    icon: Languages,
    category: 'Translation',
    description: 'Bidirectional sentence translator with offline fallback and Google Translate bridge.'
  },
  {
    id: 'mod-quiz',
    type: 'module',
    title: 'Daily Santali Vocabulary Quiz',
    subtitle: '5 daily words from the dictionary · Daily streak counter and XP rewards',
    targetTab: 'daily_quiz',
    icon: Flame,
    category: 'Gamification',
    description: 'Track your daily streak, learn 5 indigenous words, and share your score.'
  },
  {
    id: 'mod-phrasebook',
    type: 'module',
    title: 'Everyday Santali Phrasebook',
    subtitle: 'Spoken daily dialogues with female voice audio in Roman, Santali Devanagari, Hindi & English',
    targetTab: 'phrasebook',
    icon: MessageSquare,
    category: 'Spoken Language',
    description: 'Categorized daily phrases for greetings, market, home, farming, and festivals with audio playback.'
  },
  {
    id: 'mod-flashcards',
    type: 'module',
    title: 'Santali Vocabulary Flashcards',
    subtitle: '3D interactive flip cards for memory retention & vocabulary mastery',
    targetTab: 'flashcards',
    icon: Layers,
    category: 'Memory & Retention',
    description: 'Flip card memory tool with audio pronunciation and XP rewards.'
  },
  {
    id: 'mod-calligraphy',
    type: 'module',
    title: 'Santali Devanagari Calligraphy & Festival Posters',
    subtitle: 'Craft high-definition festival greeting posters, Sohrai banners, and status cards',
    targetTab: 'calligraphy',
    icon: Palette,
    category: 'Cultural Art',
    description: 'Design custom Santali typography with tribal borders, symbol stamps, and PNG export.'
  },
  {
    id: 'mod-kudum',
    type: 'module',
    title: 'Kudum (साओताली पहेलियाँ) & Wise Proverbs',
    subtitle: 'Centuries-old Santali folklore riddles with tap-to-reveal answers and Bhent-Katha',
    targetTab: 'kudum',
    icon: HelpCircle,
    category: 'Folklore & Wisdom',
    description: 'Interactive Santali riddles and cultural wisdom proverbs with female voice audio.'
  },
  {
    id: 'mod-calendar',
    type: 'module',
    title: 'Santali Cultural Calendar & Festivals',
    subtitle: 'Sohrai, Baha Parab, Karam, Maghe and traditional agricultural seasonal almanac',
    targetTab: 'calendar',
    icon: Calendar,
    category: 'Heritage Almanac',
    description: 'Discover sacred Adivasi lunar months, deity veneration rituals, and traditional festive folk songs.'
  },
  {
    id: 'mod-wordle',
    type: 'module',
    title: 'Santali Wordle 5-Letter Game',
    subtitle: 'Guess daily 5-letter Santali words in 6 tries with virtual keyboard and hints',
    targetTab: 'wordle',
    icon: Gamepad2,
    category: 'Gamification',
    description: 'Daily Wordle puzzle in Santali Devanagari and Roman with streak rewards and hints.'
  },
  {
    id: 'mod-stories',
    type: 'module',
    title: 'Santali Folk Stories & History Player',
    subtitle: 'Listen to narrated audio stories of Pandit Raghunath Murmu, Santhal Hul 1855, and Pilchu Haram',
    targetTab: 'stories',
    icon: Headphones,
    category: 'Audio Storyteller',
    description: 'Synchronized karaoke-style multilingual audio reader for Santali folk tales and history.'
  },
  {
    id: 'mod-speech-coach',
    type: 'module',
    title: 'Pronunciation Coach & Accent Scoring',
    subtitle: 'Microphone speech recognition with phonetic feedback and pronunciation accuracy scores',
    targetTab: 'speech_coach',
    icon: Mic,
    category: 'Voice AI & Speech',
    description: 'Test your spoken Santali accent with instant 0-100% accuracy ratings and glottal check tips.'
  },
  {
    id: 'mod-speaker',
    type: 'module',
    title: 'Universal Voice Speaker & Reader',
    subtitle: 'High-clarity female speech synthesizer for Santali Devanagari, Hindi, and English',
    targetTab: 'speaker',
    icon: Volume2,
    category: 'Speech & Audio',
    description: 'Universal read-aloud tool with speed and pitch controls, preset dialogues, and speaker hardware test.'
  },
  {
    id: 'mod-instruments',
    type: 'module',
    title: 'Traditional Instruments & Rhythm Pad',
    subtitle: 'Playable Tumdak, Tamak, Tiriyo, and Banam with authentic festive rhythm loops',
    targetTab: 'instruments',
    icon: Music,
    category: 'Acoustic Studio',
    description: 'Interactive drumheads and bamboo flute with Sohrai and Lagre rhythm loops.'
  },
  {
    id: 'mod-family-tree',
    type: 'module',
    title: 'Santali Kinship & Family Tree Relations',
    subtitle: 'Comprehensive guide to maternal, paternal, in-law, and sibling kinship relations with audio',
    targetTab: 'family_tree',
    icon: Users,
    category: 'Kinship & Social',
    description: 'Master respectful Santali relations like Honyhar, Hanhar, Kaka, Hatom, and Tejang.'
  },
  {
    id: 'mod-kids-rhymes',
    type: 'module',
    title: 'Santali Kids Rhymes & Nursery Jukebox',
    subtitle: 'Cheerful animated children poems and songs with synchronized female voice singing',
    targetTab: 'kids_rhymes',
    icon: Smile,
    category: 'Children & Education',
    description: 'Popular poems like Hapa Hapa Chene, Dag Hijug Me, and Chando Mala.'
  },
  {
    id: 'mod-clock-numbers',
    type: 'module',
    title: 'Santali Talking Clock & 1-100 Numbers Master',
    subtitle: 'Real-time spoken time in Santali Devanagari and complete 1 to 100 counting chart with audio',
    targetTab: 'clock_numbers',
    icon: Clock,
    category: 'Numeracy & Time',
    description: 'Listen to current time announced in Santali and practice counting from Mit to Say.'
  },
  {
    id: 'mod-clans',
    type: 'module',
    title: 'The 12 Sacred Santali Clans (Paris) & Totems',
    subtitle: 'Murmu, Kisku, Hembram, Soren, Marndi, Tudu and all 12 clans with totem animals and history',
    targetTab: 'clans',
    icon: Shield,
    category: 'Ancestral Lineages',
    description: 'Discover your clan totem symbol, traditional duties, and ancestral marriage laws.'
  },
  {
    id: 'mod-flora-worksheets',
    type: 'module',
    title: 'Sacred Flora & Printable A4 Worksheets',
    subtitle: 'Ecological lore of Sal, Mahua, Karam plus 1-click printable PDF handwriting worksheets',
    targetTab: 'flora_worksheets',
    icon: TreePine,
    category: 'Environment & Worksheets',
    description: 'Printable Santali Devanagari practice sheets and Sohrai coloring sheets for schools.'
  },
  {
    id: 'mod-creation',
    type: 'module',
    title: 'धरती की सृष्टि व मानव उत्पत्ति (सिरजोन काहनी)',
    subtitle: 'ठाकुर जिउ, हांस-हांसिल, कछुआ, केंचुआ और पिलचु हाड़ाम-पिलचु बुढ़ी से १२ गोत्रों का उद्भव',
    targetTab: 'creation',
    icon: Globe,
    category: 'Mythology & Cosmology',
    description: 'संताली पवित्र सृष्टि गाथा: कैसे जलमग्न संसार से धरती का निर्माण हुआ और मानव जाति की शुरुआत हुई।'
  },
  {
    id: 'mod-dances',
    type: 'module',
    title: 'संताली पारंपरिक शीर्ष १० नृत्य (एनेच)',
    subtitle: 'लागड़े, सोहराय, बाहा, दांता, दोंग, करम, दहर, पांता, सेंदरा और गोलवारी नृत्य',
    targetTab: 'dances',
    icon: Music,
    category: 'Folk Dance & Music',
    description: 'पारंपरिक संताली लोकनृत्यों की पदताल, वेशभूषा, वाद्य यंत्र और प्रामाणिक लोकगीत।'
  },
  {
    id: 'mod-bonga-buru',
    type: 'module',
    title: 'शीर्ष १५ पूजा-पाठ एवं बोंगा-बुरु परंपरा',
    subtitle: 'मारांग बुरु, जाहेर एरा, मोड़ेको-तुरुईको, ओड़ाक् बोंगा, आबगे बोंगा व पवित्र बाखेर वंदना',
    targetTab: 'bonga_buru',
    icon: Flame,
    category: 'Spiritual & Sacred Lore',
    description: 'संताल धर्म की शीर्ष १५ पवित्र देव शक्तियां, थान, पुजारी, पारंपरिक भोग और पवित्र बाखेर मंत्र।'
  },
  {
    id: 'mod-governance',
    type: 'module',
    title: 'मांझी परगना स्वशासन व्यवस्था (Majhi Pargana System)',
    subtitle: 'मांझी हाड़ाम, परानिक, जोग मांझी, नायके, गोड़ेत व लोबीर बैसी की लोकतांत्रिक परंपरा',
    targetTab: 'governance',
    icon: Landmark,
    category: 'Governance & Heritage',
    description: 'पारंपरिक संताली ग्राम स्वशासन और कुलही दुरुप न्याय प्रणाली का सचित्र ज्ञानकोश।'
  },
  {
    id: 'mod-grammar',
    type: 'module',
    title: 'संताली व्याकरण व वाक्य निर्माता (Grammar & Sentence Lab)',
    subtitle: 'रोनौड़ (Ronoṛ): 3 वचन (द्विवचन सहित), समावेशी-अपवर्जक सर्वनाम और ड्रैग-एंड-टैप वाक्य निर्माण',
    targetTab: 'grammar',
    icon: BookOpen,
    category: 'Education & Linguistics',
    description: 'संताली व्याकरण के नियम सीखें और स्वयं नए शुद्ध संताली वाक्य बनाएं।'
  },
  {
    id: 'mod-greetings',
    type: 'module',
    title: 'पावन पर्व ई-कार्ड जेनरेटर (Festive E-Cards)',
    subtitle: 'सोहराय, बाहा, करम, सरहुल और नववर्ष पर सुंदर संताली देवनागरी ई-कार्ड बनाएं व शेयर करें',
    targetTab: 'greetings',
    icon: Sparkles,
    category: 'Creativity & Social',
    description: 'पारंपरिक संताली शुभकामना पत्र बनाकर WhatsApp पर 1-क्लिक शेयर करें।'
  },
  {
    id: 'mod-herbal',
    type: 'module',
    title: 'पारंपरिक वन-औषधियां व रान-रानाब (Ethnobotany)',
    subtitle: 'साल, महुआ, करंज, पलाश, चिरौंजी के पारंपरिक आदिवासी औषधीय उपयोग व तैयारी विधि',
    targetTab: 'herbal',
    icon: Leaf,
    category: 'Environment & Health',
    description: 'सदियों पुराना संताली पारंपरिक वन-औषधि ज्ञान व प्राकृतिक उपचार।'
  },
  {
    id: 'mod-sohrai-art',
    type: 'module',
    title: 'सोहराय व खोवर भित्तिचित्र कला स्टूडियो (Sohrai Mural Art)',
    subtitle: 'पारंपरिक मिट्टी की दीवारों पर प्राकृतिक रंगों व कांगई तकनीक से उकेरी जाने वाली आकृतियां',
    targetTab: 'sohrai_art',
    icon: Palette,
    category: 'Art & Heritage',
    description: 'इंटरैक्टिव सोहराय कला कैनवास, मारोक (मोर), डांगरा, हाकु आकृतियां और पूर्ण एडमिन संपादन।'
  },
  {
    id: 'mod-proverbs-bhenta',
    type: 'module',
    title: 'संताली भेंता काथा एवं लोकोक्तियाँ कोश (Proverbs & Wisdom)',
    subtitle: 'पीढ़ियों से संताली अखड़ा में गूंजती अनमोल भेंता काथा, रूपक व मेनकाथा का अर्थ व संदर्भ',
    targetTab: 'proverbs_bhenta',
    icon: Quote,
    category: 'Literature & Philosophy',
    description: 'दार्शनिक जीवन-दर्शन, आज की भेंता काथा, ऑडियो उच्चारण, व्हाट्सएप शेयर व एडमिन संपादन।'
  },
  {
    id: 'mod-agri-seasons',
    type: 'module',
    title: 'संताली पारम्परिक कृषि, ऋतु-चक्र व नक्षत्र ज्ञान (Agro-Ecology)',
    subtitle: 'रोहिणी नक्षत्र, देशी धान किस्में (करहनी, कनकचूर), प्राकृतिक मौसम सूचक व पारंपरिक काष्ठ औजार',
    targetTab: 'agri_seasons',
    icon: Sprout,
    category: 'Agriculture & Ecology',
    description: 'आदिवासी कृषि पंचांग, धुरिया एरा, मौसम संकेत, देशी हल नाहेल, दात्रोम व संपूर्ण प्रबंधन।'
  },
  {
    id: 'mod-traditional-measures',
    type: 'module',
    title: 'संताली पारंपरिक नाप-तौल व हाट-बाजार प्रणाली (Traditional Measures)',
    subtitle: 'पाय, कथा, गौनी, खांडी, एक हल जमीन (हाल) व 20 आधारित बीसा संख्या गणना प्रणाली',
    targetTab: 'traditional_measures',
    icon: Scale,
    category: 'Traditional Economy',
    description: 'इंटरैक्टिव नाप-तौल परिवर्तक गणक (Pai to Kg Calculator), हाट-हटिया विनिमय व एडमिन संपादन।'
  },
  {
    id: 'mod-architecture',
    type: 'module',
    title: 'संताली पारंपरिक वास्तु व ओड़ाक् विन्यास (Eco-Architecture)',
    subtitle: 'पिंडा, भीतर ओड़ाक्, कुलही, दुआर, गौहाल व पुआल बांदी की प्राकृतिक वास्तुकला',
    targetTab: 'architecture',
    icon: Home,
    category: 'Traditional Architecture',
    description: 'मिट्टी, साल खंभों व गोबर लिपाई से निर्मित भूकंप-रोधी व प्राकृतिक वातानुकूलित घर और एडमिन संपादन।'
  },
  {
    id: 'mod-historical-garhs',
    type: 'module',
    title: 'संताली ऐतिहासिक प्रवास व १२ प्राचीन गढ़ (Historical Migrations & 12 Garhs)',
    subtitle: 'हियारी-पिपरी, चाय-चंपा, कोयंडा, बादाम से संताल परगना दामिन-इ-कोह तक की ऐतिहासिक यात्रा',
    targetTab: 'historical_garhs',
    icon: Compass,
    category: 'History & Migrations',
    description: '१२ पारिस (गोत्रों) के १२ अजेय राजधानी गढ़, समय-रेखा, हुल तीर्थ व संपूर्ण एडमिन संपादन।'
  },
  {
    id: 'mod-puppetry-theater',
    type: 'module',
    title: 'चादर बदनी कठपुतली कला व अखड़ा लोक-नाट्य (Puppetry & Theater)',
    subtitle: 'संतालों की दुर्लभ काष्ठ कठपुतली कला चादर बदनी, मांदार वादक, नर्तक पुतलियां व जात्रा नाटक',
    targetTab: 'puppetry_theater',
    icon: Drama,
    category: 'Folk Theater & Puppetry',
    description: 'इंटरैक्टिव कठपुतली रंगमंच सिमुलेटर, लागड़े-सोहराय धुन, अखड़ा जात्रा और एडमिन संपादन।'
  },
  {
    id: 'mod-astronomy-lore',
    type: 'module',
    title: 'संताली खगोल-विज्ञान व आकाश-ज्ञान (Astronomy & Sky Lore)',
    subtitle: 'भुरका इपिल (भोर का तारा), बोंगा डाहार (आकाशगंगा), मोड़ेको-तुरुईको (सप्तर्षि) व कातरा इपिल (ध्रुव)',
    targetTab: 'astronomy_lore',
    icon: Moon,
    category: 'Astronomy & Sky Lore',
    description: 'संताली पुरखों का रात्रि तारा ज्ञान, दिशा-निर्धारण, ग्रहण लोककथा व संपूर्ण एडमिन संपादन।'
  },
  {
    id: 'mod-sendra-lobir',
    type: 'module',
    title: 'बीर-सेंदरा, लोबीर बैसी व अरण्य संरक्षण विधान (Sendra & Lobir Baisi)',
    subtitle: 'अयोध्या बुरु सर्वोच्च अरण्य न्यायालय, दिहरी न्याय विधान, गाभिन पशु संरक्षण व आखेट नीति',
    targetTab: 'sendra_lobir',
    icon: TreePine,
    category: 'Governance & Forest Law',
    description: 'संतालों का सर्वोच्च अरण्य लोकतंत्र लोबीर बैसी, समतावादी न्याय, पशु संरक्षण आचार संहिता व पूर्ण एडमिन संपादन।'
  },
  {
    id: 'mod-dhokra-art',
    type: 'module',
    title: 'संताली धोकरा धातु-कला व कमार विरासत (Dhokra Bell-Metal Casting)',
    subtitle: 'खोया-मोम पद्धति (Cire-Perdue), पवित्र धान माप पाई-सेर, बोंगा सादोम (अश्व) व हांसली आभूषण',
    targetTab: 'dhokra_art',
    icon: Hammer,
    category: 'Art & Metallurgy',
    description: '४००० वर्ष प्राचीन मोम तार ढलाई तकनीक, ६-चरणीय प्रक्रिया सिमुलेटर व संपूर्ण एडमिन संपादन।'
  },
  {
    id: 'mod-water-harvesting',
    type: 'module',
    title: 'संताली पारंपरिक जल-संरक्षण, डाड़ी-पुखुरी व ढलान खेती (Water Harvesting)',
    subtitle: 'अमृत डाड़ी सोते, आहार-बांध, पवित्र दाः बाखेड़ वर्षा प्रार्थना व टांड़-बायद-कनाली-बहल ढलान मैट्रिक्स',
    targetTab: 'water_harvesting',
    icon: Droplets,
    category: 'Ecology & Water Wisdom',
    description: 'संताली सूक्ष्म-वाटरशेड प्रबंधन, गुरुत्वाकर्षण सिंचाई, सामूहिक श्रमदान व पूर्ण एडमिन संपादन।'
  },
  {
    id: 'mod-handloom-weaving',
    type: 'module',
    title: 'संताली पारंपरिक वस्त्र बुनाई, करघा व प्राकृतिक वनस्पति रंगाई (Handloom & Dyes)',
    subtitle: 'पंछी-पारहाड़, तसर रेशम ककून (Kosa), पलाश व हर्रे प्राकृतिक रंगाई सूत्र व गढ़ा तंत करघा',
    targetTab: 'handloom_weaving',
    icon: Scissors,
    category: 'Handloom & Textiles',
    description: 'देशी कपास व रेशम बुनाई, बुरु चूड़ा ज्यामितीय बॉर्डर, वनस्पति रंग प्रयोगशाला व पूर्ण एडमिन संपादन।'
  },
  {
    id: 'mod-livestock-khuntau',
    type: 'module',
    title: 'संताली गोड़ा-पशुधन ज्ञान, खूंटाव परंपरा व गौ-रान (Livestock & Khuntau)',
    subtitle: 'सोहराय खूंटाव नर्तन, सींग रंगाई, दांगरा बाखेड़ पशु प्रार्थना व पारंपरिक वन-औषधि चिकित्सा (गौ-रान)',
    targetTab: 'livestock_khuntau',
    icon: HeartHandshake,
    category: 'Pastoral & Ethno-Veterinary',
    description: 'पशुधन सम्मान, गाई जगावे गीत, ४-चरणीय खूंटाव अनुष्ठान, खुरपका-मुंहपका देशी इलाज व पूर्ण एडमिन संपादन।'
  },
  {
    id: 'mod-woodcraft-carpentry',
    type: 'module',
    title: 'संताली पारंपरिक काष्ठ-कला, ढेंकी, नाहेल व काठ-शिल्प (Woodcraft & Carpentry)',
    subtitle: 'वैज्ञानिक पैर-चालित ढेंकी, कठोर पठार का साल नाहेल (हल), पारकोम-माची व तोका पशु घंटी',
    targetTab: 'woodcraft_carpentry',
    icon: Trees,
    category: 'Indigenous Carpentry',
    description: 'साल व शीशम की लकड़ी से बने आदिम कृषि व घरेलू यंत्र, काष्ठ भौतिकी सिमुलेटर व पूर्ण एडमिन संपादन।'
  },
  {
    id: 'mod-bamboo-craft',
    type: 'module',
    title: 'संताली बांस-शिल्प, मत्स्य आखेट उपकरण व टोकरी निर्माण (Bamboo Craft & Traps)',
    subtitle: 'हाताक\' (पवित्र सूप), कुमुनी व झिमरी (मछली फंदा), दउरा पेटारी व कृष्ण पक्ष बांस कटाई विज्ञान',
    targetTab: 'bamboo_craft',
    icon: ShoppingBag,
    category: 'Bamboo Craft & Basketry',
    description: 'देशी बांस की कमचियों से बनी आजीविका व मांगलिक वस्तुएं, धुआं उपचार ज्ञान व पूर्ण एडमिन संपादन।'
  },
  {
    id: 'mod-phonetics-lab',
    type: 'module',
    title: 'संताली ४ विशिष्ट कंठ ध्वनियां व उच्चारण प्रयोगशाला (Checked Consonants Lab)',
    subtitle: 'क\' (Ag), च\' (Uch), त\' (At), प\' (Ep) की रुद्ध कंठ्य ध्वनियां, न्यूनतम युग्म (Minimal Pairs) व अभ्यास',
    targetTab: 'phonetics_lab',
    icon: Activity,
    category: 'Linguistics & Phonetics',
    description: 'संताली भाषाविज्ञान की अद्वितीय रुद्ध ध्वनियों का ध्वन्यात्मक विश्लेषण, अर्थ-भेद तुलना व पूर्ण एडमिन संपादन।'
  },
  {
    id: 'mod-baby-names',
    type: 'module',
    title: 'संताली पारंपरिक नामकरण गाइड (Traditional Baby Names & Naming System)',
    subtitle: 'हपड़ाम कोवाक् ञुतुम दोहो नियम, दादा-दादी के नाम पर नामकरण, २००+ लड़कों व लड़कियों के अर्थपूर्ण नाम',
    targetTab: 'baby_names',
    icon: Baby,
    category: 'Culture & Naming',
    description: 'संताली समाज की पवित्र नामकरण पद्धति, हपड़ाम नियम, २००+ नाम, अर्थ, पारिस संबंध व महिला स्वर उच्चारण।'
  },
  {
    id: 'mod-ornaments-jewellery',
    type: 'module',
    title: 'संताली पारंपरिक आभूषण व शृंगार (Authentic Jewellery & Ornaments)',
    subtitle: 'हांसली, खागड़ा, साकम (कड़ा), रासा (झुमका), तरपत, बांक, तोड़ा, सिकरी व सीथी रजत कला',
    targetTab: 'ornaments_jewellery',
    icon: Sparkles,
    category: 'Art & Ornaments',
    description: 'चांदी व कांसे के १२ पारंपरिक संताली आभूषण, अंग-वार फ़िल्टर, धातु ढलाई विधि, सांस्कृतिक मर्यादा व ऑडियो।'
  },
  {
    id: 'mod-blacksmithy-iron',
    type: 'module',
    title: 'संताली पारंपरिक लोहार शिल्प व हथियार (Iron Smelting & Blacksmithy)',
    subtitle: 'दातरम (हँसिया), तांगा (कुल्हाड़ी), सार-फासी (तीर के फल), कुड़ी, खुरपी व चापुआ (दोहरी धौंकनी)',
    targetTab: 'blacksmithy_iron',
    icon: Hammer,
    category: 'Craft & Metallurgy',
    description: 'कामार और असुर-संताली प्राचीन धातुकर्म, कुटी भट्ठी, औजार निर्माण विधि, माप-भार व ऑडियो उच्चारण।'
  },
  {
    id: 'mod-seasons-weather',
    type: 'module',
    title: 'संताली ६ ऋतुएँ व प्राकृतिक मौसम पूर्वानुमान (6 Seasons & Weather Lore)',
    subtitle: 'सितांग, जेठ-दाक्, जापानी (वर्षा), दासांय, राभांग (शीत) व बाहा (वसंत) ऋतु एवं चींटियों-पक्षियों के संकेत',
    targetTab: 'seasons_weather',
    icon: Clock,
    category: 'Seasons & Weather Lore',
    description: 'संताली ६ ऋतुएं, कृषि-चक्र, पर्व और प्राकृतिक संकेतों द्वारा वर्षा का पारंपरिक अचूक पूर्वानुमान।'
  },
  {
    id: 'mod-idioms-menkatha',
    type: 'module',
    title: 'संताली मुहावरे, लोकोक्तियां व भेंता काथा (Santali Idioms & Menkatha)',
    subtitle: 'लाक्षणिक मुहावरे, शाब्दिक अर्थ, गहरा भावार्थ, दैनिक बोलचाल में सटीक उदाहरण वाक्य व ऑडियो',
    targetTab: 'idioms_menkatha',
    icon: MessageSquare,
    category: 'Linguistics & Proverbs',
    description: 'संताली भाषा के गहन मुहावरे (मेनकाथा / भेंता काथा), शाब्दिक व लाक्षणिक अर्थ और महिला स्वर उच्चारण।'
  },
  {
    id: 'mod-herbal-drinks',
    type: 'module',
    title: 'संताली पारंपरिक पेय व प्राकृतिक शरबत (Native Teas & Herbal Drinks)',
    subtitle: 'मातकोम रसा (महुआ शरबत), इचाक् बाहा लाल चाय, मांडी दाक्, बेल शरबत व पावन पोचोई मर्यादा',
    targetTab: 'herbal_drinks',
    icon: Coffee,
    category: 'Ethnobotany & Health',
    description: '८ पारंपरिक देशी पेय, रानू-रान २१ जड़ी-बूटियों का रहस्य, स्वास्थ्य लाभ, निर्माण विधि व सांस्कृतिक मर्यादा।'
  },
  {
    id: 'mod-archery-simulator',
    type: 'module',
    title: 'संताली आक-सार धनुर्विद्या व शब्द निशाना सिमुलेटर (Archery Master & Target Game)',
    subtitle: 'पारंपरिक आक (धनुष), सार (बाण), बेझा तुञ परंपरा और इंटरएक्टिव संताली शब्द निशाना खेल',
    targetTab: 'archery_simulator',
    icon: Target,
    category: 'Traditional Games & Sports',
    description: 'धनुष-बाण की शास्त्रीय बनावट, बेझा तुञ सकरात उत्सव और शब्दों पर सटीक तीरंदाजी खेल सिमुलेटर।'
  },
  {
    id: 'mod-traditional-cuisine',
    type: 'module',
    title: 'संताली पारंपरिक व्यंजन व पाककला (Traditional Cuisine & Recipes)',
    subtitle: 'साकाम पीठा, लेटे मंडी, रुगड़ा-ओत् व घोंघी-सुतली रसा की पौष्टिक विधियां व स्वास्थ्य रहस्य',
    targetTab: 'traditional_cuisine',
    icon: BookOpen,
    category: 'Traditional Cuisine',
    description: 'साल के पत्तों में भाप से पके व्यंजन, शून्य वसा, प्राकृतिक मशरूम और औषधीय सूप का संपूर्ण कोश।'
  },
  {
    id: 'mod-marriage-rituals',
    type: 'module',
    title: 'संताली ७ विवाह प्रकार व ३ जीवन संस्कार (Marriage & Life-cycle Rites)',
    subtitle: 'दुवार बापला, टुंकी दिपिल, गोलात, घरदी जांवाए, निम दाहाक्, चाचो छातियार व भांडान विधान',
    targetTab: 'marriage_rituals',
    icon: Users,
    category: 'Culture & Samskaras',
    description: 'संताली समाज के ७ पारंपरिक विवाह रूप, जन्म शुद्धि, सामाजिक वयस्कता और पूर्वज मिलन संस्कार।'
  },
  {
    id: 'mod-riddles-kudum',
    type: 'module',
    title: 'कुदुम पहेली प्रतियोगिता खेल (Kudum Folk Riddles Game)',
    subtitle: 'संताली लोक पहेलियां, विकल्प, उत्तर, स्कोर बोर्ड, संकेत और महिला स्वर उच्चारण',
    targetTab: 'riddles_kudum',
    icon: HelpCircle,
    category: 'Games & Riddles',
    description: 'हापड़ाम बुजुर्गों द्वारा संध्या चौपाल पर पूछे जाने वाले कुदुम का इंटरैक्टिव बौद्धिक खेल।'
  },
  {
    id: 'mod-sacred-pilgrimages',
    type: 'module',
    title: 'संताली पावन तीर्थ व ऐतिहासिक गढ़ (Sacred Pilgrimages & Garhs)',
    subtitle: 'लुगु बुरु घांटाबाड़ी धोरोमगाढ़, अयोध्या बुरु, भोगनाडीह हूल स्थल, चांपा गढ़ व मरांग बुरु',
    targetTab: 'sacred_pilgrimages',
    icon: Compass,
    category: 'Pilgrimage & History',
    description: 'संताल समाज के सर्वोच्च पावन पीठ, ऐतिहासिक युद्धस्थल, धार्मिक मेले और आचार संहिता।'
  },
  {
    id: 'mod-spoken-dialogues',
    type: 'module',
    title: 'दैनिक संताली बोलचाल संवाद (Everyday Spoken Dialogues)',
    subtitle: 'हाट-बाजार मोलभाव, अतिथि सत्कार, खेत-खामार रोपाई, रास्ता पूछना व वैद्य परामर्श',
    targetTab: 'spoken_dialogues',
    icon: MessageSquare,
    category: 'Spoken Language',
    description: 'वास्तविक जीवन परिस्थितियों में शुद्ध संताली देवनागरी और रोमन में धाराप्रवाह बोलचाल संवाद।'
  },
  {
    id: 'mod-letter-templates',
    type: 'module',
    title: 'संताली औपचारिक पत्र व नेवता साकाम (Formal Letter & Invitation Templates)',
    subtitle: 'विवाह निमंत्रण (बापला नेवता साकाम), मांझी हाड़ाम आवेदन, कुलही बैसी नोटिस व शोक पत्र',
    targetTab: 'letter_templates',
    icon: FileText,
    category: 'Formal Documents',
    description: 'संताली देवनागरी में तैयार पत्र प्रारूप, कॉपी, संपादन और 1-क्लिक प्रिंट सुविधा के साथ।'
  },
  {
    id: 'mod-illustrated-stories',
    type: 'module',
    title: 'सचित्र संताली लोककथाएं व नीति बोध (Illustrated Folk Tales & Wisdom)',
    subtitle: 'पिलचु हाड़ाम-बूढ़ी, तुरूई कोड़ा आर चालाक तूंईऊ, व करम-धरम सचित्र कथा वाचन',
    targetTab: 'illustrated_stories',
    icon: BookOpen,
    category: 'Folklore & Literature',
    description: 'दृश्य-दर-दृश्य सचित्र संताली लोककथाएं, देवनागरी लिपि, ऑडियो वाचन और नैतिक संदेश।'
  },
  {
    id: 'mod-favorites-notebook',
    type: 'module',
    title: 'इञाक् साकाम (मेरी पसंदीदा डायरी व ऑफ़लाइन नोटबुक)',
    subtitle: 'स्टार (⭐) किए गए व्यंजन, औपचारिक पत्र, तीर्थ स्थल, कुदुम पहेलियां और शब्दावली',
    targetTab: 'favorites_notebook',
    icon: Bookmark,
    category: 'Notebook & Saved Items',
    description: 'ऑफ़लाइन सुरक्षित व्यक्तिगत संताली डायरी, खोज, 1-क्लिक कॉपी और प्रबंधन।'
  },
  {
    id: 'mod-social-cards',
    type: 'module',
    title: 'सोशल मीडिया कार्ड व पोस्टर स्टूडियो (Social Cards)',
    subtitle: 'पारंपरिक संताली मोटिफ्स, कोट्स व 1080p HD पोस्टर जेनरेटर',
    targetTab: 'social_cards',
    icon: Sparkles,
    category: 'Creatives & Social',
    description: 'सांस्कृतिक कोट्स, पर्व पोस्टर, इंस्टाग्राम व फेसबुक शेयरिंग कार्ड्स।'
  },
  {
    id: 'mod-lunar-calendar',
    type: 'module',
    title: 'संताली चंद्र पंचांग व पर्व टाइमर (Lunar Calendar)',
    subtitle: 'चांदो माह, तिथि, नक्षत्र व आगामी त्योहारों का लाइव काउंटडाउन',
    targetTab: 'lunar_calendar',
    icon: Moon,
    category: 'Calendar & Astronomy',
    description: 'माघ, बाहा, सोहराय, करम का पारंपरिक चंद्र कैलेंडर व समय गणना।'
  },
  {
    id: 'mod-sereng-karaoke',
    type: 'module',
    title: 'सेरेंग कराओके व ताल अखाड़ा (Karaoke Studio)',
    subtitle: 'तुम्दाक्-तामाक् ड्रम सिंथेसाइज़र, ५ ताल (लागणे, डंता, सोहराय) व सिंक गीत',
    targetTab: 'sereng_karaoke',
    icon: Music,
    category: 'Music & Performance',
    description: 'वेब ऑडियो ड्रम लूप्स, बीपीएम स्पीड, लाइव माइक टेस्ट और ८ लोकगीत।'
  },
  {
    id: 'mod-village-tour',
    type: 'module',
    title: 'संताल गांव का पवित्र मानचित्र (Virtual Village Tour)',
    subtitle: 'जाहेर थान, मांझी थान, कुलही, अखड़ा, होड़ ओड़ाक् का 3D/SVG ब्लूप्रिंट',
    targetTab: 'village_tour',
    icon: Compass,
    category: 'Geography & Sacred Spaces',
    description: 'गांव के ५ प्रमुखों (मोड़े होड़) की मार्गदर्शिका और इंटरैक्टिव क्विज़।'
  },
  {
    id: 'mod-wild-foods',
    type: 'module',
    title: 'वन-साग, जंगली कंद-मूल व पोषण संदर्शिका (Wild Foods)',
    subtitle: '१८+ दुर्लभ औषधीय पत्ते (गेंधारी, मुंगा, सारु), पारंपरिक व्यंजन व रेसिपी',
    targetTab: 'wild_foods',
    icon: Leaf,
    category: 'Cuisine & Nutrition',
    description: 'जेकेद मांडी, लाठे, डुम्बु जिल पीठा, लेटो और डायनामिक सर्विंग स्केलर।'
  },
  {
    id: 'mod-festival-cards',
    type: 'module',
    title: 'व्हाट्सऐप व पर्व ग्रीटिंग्स कार्ड्स (Festival Cards)',
    subtitle: 'सोहराय, बाहा, करम, साकरात, सगुन बापला ग्रीटिंग्स व HD PNG एक्सपोर्ट',
    targetTab: 'festival_cards',
    icon: Sparkles,
    category: 'Greetings & Festivals',
    description: 'सीधे व्हाट्सऐप पर शेयर करें, कस्टम नाम व संदेश जोड़ें।'
  },
  {
    id: 'mod-folk-radio',
    type: 'module',
    title: 'संताली लोककथा रेडियो व एम्बिएंट साउंड (Folk Radio)',
    subtitle: 'वन की हवा, झींगुरों की गूंज व ४ नाटकीय लोककथाएं (हांस-हांसिली, हुल)',
    targetTab: 'folk_radio',
    icon: Radio,
    category: 'Folklore & Audio',
    description: 'एम्बिएंट सिंथेसाइज़र, पंक्ति-दर-पंक्ति ऑडियो वाचन और नैतिक सीख।'
  },
  {
    id: 'mod-ethno-medicine',
    type: 'module',
    title: 'पारंपरिक वनौषधि व प्राथमिक उपचार (Ethno-Medicine)',
    subtitle: '१० रोगों के देसी नुस्खे (हड्डी संधान, ज्वर, बिच्छू दंश, पेचिश) व अस्पताल प्रोटोकॉल',
    targetTab: 'ethno_medicine',
    icon: HeartPulse,
    category: 'Herbal Medicine & Health',
    description: 'हातु कविराज की जड़ी-बूटियां, काढ़े, खुराक और आपातकालीन दिशा-निर्देश।'
  },
  {
    id: 'mod-script-converter',
    type: 'module',
    title: 'त्रि-लिपि कनवर्टर (3-Way Script Converter)',
    subtitle: 'ओल चिकी ⇄ देवनागरी ⇄ रोमन का रियल-टाइम लाइव लिप्यंतरण',
    targetTab: 'script_converter',
    icon: ArrowRightLeft,
    category: 'Linguistics & Scripts',
    description: 'वर्णमाला चार्ट, त्वरित परीक्षण बटन और पूर्ण संताली कीबोर्ड पैलेट।'
  },
  {
    id: 'mod-kids-soundboard',
    type: 'module',
    title: 'सचित्र बाल-साउंडबोर्ड व ध्वनि क्विज़ (Kids Soundboard)',
    subtitle: '१००+ सचित्र कार्ड्स, पशु, पक्षी, वाद्य, परिवार व पहचानो कौन क्विज़',
    targetTab: 'kids_soundboard',
    icon: Smile,
    category: 'Children & Education',
    description: 'बाउंस एनिमेशन, संताली महिला उच्चारण और बाल ऑडियो गेम्स।'
  },
  {
    id: 'mod-wallpaper-studio',
    type: 'module',
    title: 'मोबाइल वॉलपेपर व स्टेटस स्टूडियो (Wallpaper Studio)',
    subtitle: '९:१६ HD लॉकस्क्रीन व इंस्टाग्राम/व्हाट्सऐप स्टोरी पोस्टर जेनरेटर',
    targetTab: 'wallpaper_studio',
    icon: Smartphone,
    category: 'Creatives & Art',
    description: '१०८०x१९२० कैनवास, ६ थीम, ८ कबीलाई प्रतीक, संताली कोट्स डाउनलोड।'
  },
  {
    id: 'mod-clan-genealogy',
    type: 'module',
    title: 'पारिस व वंशावली डायरी (Clan Genealogy Archive)',
    subtitle: '१२ पारिस (गोत्र), खूंट, टोटेम, ओड़ाक् बोंगा व घारोज साकाम प्रमाण-पत्र',
    targetTab: 'clan_genealogy',
    icon: Shield,
    category: 'Clans & Genealogy',
    description: 'पारिवारिक धरोहर प्रमाण-पत्र जेनरेटर, गोत्र वर्जनाएं व वंशावली वृक्ष।'
  },
  {
    id: 'mod-haat-barter',
    type: 'module',
    title: 'हाट व वस्तु-विनिमय बाज़ार सिमुलेटर (Haat & Barter)',
    subtitle: 'पाई, काठ, सेर, पोया नाप-तौल, हाट संवाद ऑडियो व खरीदारी खेल',
    targetTab: 'haat_barter',
    icon: Scale,
    category: 'Culture & Commerce',
    description: 'धान्य विनिमय कैलकुलेटर, मोल-भाव वार्तालाप और संताली बाजार अनुभव।'
  },
  {
    id: 'mod-bapla-chants',
    type: 'module',
    title: 'विवाह (बापला) गीत व संपूर्ण नेग-दस्तूर (Bapla Chants)',
    subtitle: 'तोरण, दाक् बापेर, सिंदूर दान, बिदाई सेरेञ ऑडियो व आशीर्वाद पत्रक',
    targetTab: 'bapla_chants',
    icon: Heart,
    category: 'Rites of Passage',
    description: '५ पावन वैवाहिक विधियां, पवित्र सामग्री चेकलिस्ट और मंत्र उच्चारण।'
  },
  {
    id: 'mod-bird-lore',
    type: 'module',
    title: 'चेँड़े चिन्हा: पक्षी दर्शन, बोली व मौसम पूर्वानुमान (Bird Lore)',
    subtitle: 'चितिर, कोयल, डाहुक, मोर की बोलियों का वेब ऑडियो सिंथेसाइज़र व क्विज़',
    targetTab: 'bird_lore',
    icon: Feather,
    category: 'Ecology & Birds',
    description: '९ पवित्र वन-पक्षी, मौसम शकुन, मेनकाथा कहावतें और बोली पहचान खेल।'
  },
  {
    id: 'mod-godna-body-art',
    type: 'module',
    title: 'सिका दागा व गोदना: अमर देह-कला व हाना पुरी दर्शन (Body Art)',
    subtitle: 'पुरुषों का सिका (३, ५, ७ दागा), नारी गोदना व डिजिटल टैटू स्टूडियो',
    targetTab: 'godna_body_art',
    icon: Sparkles,
    category: 'Traditional Body Art',
    description: 'कैनवास पर पारंपरिक गोदना स्टैम्प करें, त्वचा टोन चुनें और PNG डाउनलोड करें।'
  },
  {
    id: 'mod-heirloom-seeds',
    type: 'module',
    title: 'देशज धान, मिलेट्स व "बंधी" बीज बैंक वास्तुकला (Heirloom Seeds)',
    subtitle: 'करहानी, तुपु, दानगोड़ धान, ५-वर्षीय बंधी तकनीक व एरोक सिम प्रार्थना',
    targetTab: 'heirloom_seeds',
    icon: Sprout,
    category: 'Agriculture & Seeds',
    description: 'सूखारोधी व बाढ़रोधी देशज बीज, पुआल बोड़ रस्सी वास्तुकला व बुआई नेग।'
  },
  {
    id: 'mod-kinship-etiquette',
    type: 'module',
    title: 'डोबोक जोहार, नाता-गोता व पारिवारिक शिष्टाचार (Kinship Etiquette)',
    subtitle: 'डोबोक, बालाया, आतु जोहार, मामा-भांजा सम्मान व जेठ-बहू मर्यादा वर्जनाएं',
    targetTab: 'kinship_etiquette',
    icon: Users,
    category: 'Kinship & Social Code',
    description: 'पारस्परिक संथाली अभिवादन संवाद, ऑडियो उच्चारण व मर्यादा क्विज़।'
  },
  {
    id: 'mod-instruments-orchestra',
    type: 'module',
    title: 'रुया-गाबुर: ५ पारंपरिक संताली वाद्ययंत्र ऑर्केस्ट्रा (Orchestra)',
    subtitle: 'तुम्दाक्, तामाक्, बानाम, तिरिओ और घोंघोर का १६-स्टेप लूपर व मिक्सर',
    targetTab: 'instruments_orchestra',
    icon: Music,
    category: 'Music & Instruments',
    description: 'लागणे, सोहराय, करम ताल प्रीसेट्स, बीपीएम गति नियंत्रण व लाइव लूपिंग।'
  },
  {
    id: 'mod-bone-setting-healing',
    type: 'module',
    title: 'हातु कविराज व पारंपरिक हड्डी संधानशाला (Bone Setting)',
    subtitle: 'रूग-फाड़ो, बांस की कमानी (पाती), हाड़जोड़ा लता लेप व सुरक्षा प्रोटोकॉल',
    targetTab: 'bone_setting_healing',
    icon: HeartPulse,
    category: 'Indigenous Orthopedics',
    description: 'अस्थि भंग, मोच, कंधा उतरने की पारंपरिक संधान विधियां व अस्पताल रेफरल।'
  },
  {
    id: 'mod-lo-bir-court',
    type: 'module',
    title: 'लो बीर बैसी: सर्वोच्च आदिवासी जन-अदालत सिमुलेटर (Lo Bir Court)',
    subtitle: 'सेंदरा पशु बंटवारा, चराई विवाद, प्राचीन मौखिक विधि-संहिता व विचार-सभा',
    targetTab: 'lo_bir_court',
    icon: Scale,
    category: 'Customary Jurisprudence',
    description: 'बिना वकीलों व फीस के आम सहमति का न्याय, हापड़ाम काथा और ऐतिहासिक केस।'
  },
  {
    id: 'mod-calligraphy-workbook',
    type: 'module',
    title: 'ओल चिकी व संताली सुलेखन अभ्यास पुस्तिका (Penmanship)',
    subtitle: '३० मूल वर्णों का डिजिटल स्ट्रोक ट्रेसिंग व A4 प्रिंटेबल वर्कशीट PNG',
    targetTab: 'calligraphy_workbook',
    icon: PenTool,
    category: 'Ol Chiki & Penmanship',
    description: 'पंडित रघुनाथ मुर्मू कृत लिपि वर्णमाला, स्ट्रोक दिशा और सुलेखन अभ्यास।'
  },
  {
    id: 'mod-handi-fermentation-lore',
    type: 'module',
    title: 'संथाल पारंपरिक वनौषधि किण्वन, रानू व हांडिया विज्ञान',
    subtitle: '१५+ वनौषधियों की रानू, ५-चरणीय मटका किण्वन, रासी अमृत व बोंगा अर्पण',
    targetTab: 'handi_fermentation_lore',
    icon: Droplets,
    category: 'Fermentation Science & Sacred Lore',
    description: 'रूहें, हरड़, चिचिड़ी की रानू टिकिया, साल पत्ते की परत, शीतलता व सामाजिक मर्यादा।'
  },
  {
    id: 'mod-ipil-astronomy',
    type: 'module',
    title: 'इपिल: संथाल पारंपरिक खगोल, नक्षत्र व रात्रि नेविगेशन',
    subtitle: 'हर-काटा (हलवाहा), बुधु-बुधु (कृत्तिका), हती डाहार व सूर्य-चंद्र प्रभामंडल',
    targetTab: 'ipil_astronomy',
    icon: Moon,
    category: 'Indigenous Astronomy & Starlight',
    description: 'इंटरैक्टिव रात्रि तारा-मानचित्र (Sky Map), कृषि समय निर्धारण व नक्षत्र कथाएं।'
  },
  {
    id: 'mod-nahel-dhenki-craft',
    type: 'module',
    title: 'नाहेल (हल), ढेंकी व जुआठ: काष्ठ-शिल्प वास्तुकला',
    subtitle: 'साल लकड़ी के प्राकृतिक वक्र, उत्तोलक भौतिकी सिद्धांत व अंग-ब्लूप्रिंट',
    targetTab: 'nahel_dhenki_craft',
    icon: Trees,
    category: 'Carpentry & Traditional Mechanics',
    description: 'ईस, कुरहा, फाड़, पारहा, ढेंकी गाड़ व सामठ का ब्लूप्रिंट और काष्ठ चयन विज्ञान।'
  },
  {
    id: 'mod-indigenous-sports-kati',
    type: 'module',
    title: 'काटी एनेच, बेझा तुन व संताली पारंपरिक लोक-खेल',
    subtitle: 'इंटरैक्टिव काटी गोटी सिमुलेटर, साकरात तीरंदाजी व खेल नियम',
    targetTab: 'indigenous_sports_kati',
    icon: Trophy,
    category: 'Traditional Sports & Games',
    description: 'काटी गोटी फेंकने का भौतिकी खेल, गेंद-धुकड़ी और अंतर-ग्रामीण प्रतियोगिताएं।'
  },
  {
    id: 'mod-traditional-fishing-craft',
    type: 'module',
    title: 'हाकू सांदरा व पारम्परिक मत्स्य आखेट शिल्प (Traditional Fishing Traps)',
    subtitle: 'तोरोदान, घूनी, पिल्ही, झाली व हकु रान (मत्स्य-मूर्छा वनौषधि) विद्या',
    targetTab: 'traditional_fishing_craft',
    icon: Fish,
    category: 'Fishing & Bamboo Traps',
    description: 'बहते जल व स्थिर पोखरों के बांस उपकरण, जल-प्रवाह गति विज्ञान, गाड़ा बोंगा आभार व जलीय संरक्षण।'
  },
  {
    id: 'mod-natural-pigments-craft',
    type: 'module',
    title: 'प्राकृतिक भित्ति वर्ण द्रव्य व सोहराय माटी रसायन (Mineral Earth Alchemy)',
    subtitle: 'दुधी माटी (सफेद केओलिन), लाल हासबा (गेरू), हेन्डे हासबा (काला मैंगनीज) व पीली गेरू',
    targetTab: 'natural_pigments_craft',
    icon: Palette,
    category: 'Sohrai Minerals & Mural Craft',
    description: 'दातुन कूची व नाखी कंधी टूल्स, माटी शोधन विधि और इंटरएक्टिव डिजिटल भित्ति कैनवास सैंडबॉक्स।'
  },
  {
    id: 'mod-banam-tamak-luthier',
    type: 'module',
    title: 'लोक-वाद्य निर्माण विद्या व बानाम ल्युथियर शिल्प (Indigenous Luthier Lore)',
    subtitle: 'धोदरो बानाम (मानव काया वाद्य), टुमदाक (मृत्तिका मांदर) व तामाक छिलाई एवं सुर-लेप',
    targetTab: 'banam_tamak_luthier',
    icon: Hammer,
    category: 'Luthier Craft & Acoustics',
    description: 'गूलर पोड़ो लकड़ी नक्काशी, गोह-चमड़ा मढ़ना, खिरन सुर-लेप विधि और ऑडियो सुर अनुनाद परीक्षण।'
  },
  {
    id: 'mod-jaher-sacred-grove-ecology',
    type: 'module',
    title: 'पवित्र जाहेर थान वन पारिस्थितिकी व वृक्ष विद्या (Sacred Grove Ecology)',
    subtitle: 'सरजोम (साल), मातकोम (महुआ), हेसाः-बाड़े (पीपल-बरगद) का जैव-विविधता तंत्र व संरक्षण संहिता',
    targetTab: 'jaher_sacred_grove_ecology',
    icon: TreePine,
    category: 'Sacred Grove & Ethno-Ecology',
    description: 'जाहेर थान का आध्यात्मिक विन्यास, शून्य-दोहन नियम, भूजल संचयन और आदिम जीन बैंक संरक्षण।'
  },
  {
    id: 'mod-customary-oaths-justice',
    type: 'module',
    title: 'संताली पावन शपथ, साक्षी व जोम जाति शुद्धिकरण (Oaths & Restorative Justice)',
    subtitle: 'गुरी-घांस, बाहा दाः, सार-कापी किरिया व सामुदायिक पुनर्प्रवेश भोज',
    targetTab: 'customary_oaths_justice',
    icon: Scale,
    category: 'Customary Law & Oaths',
    description: 'पवित्र सत्य शपथ विधान, मांझी सभा की प्रक्रिया, सिम बोंगा साक्षी और जोम जाति पुनर्मिलन संस्कार।'
  },
  {
    id: 'mod-sasandiri-megalithic-lore',
    type: 'module',
    title: 'सासानदीरी व महापाषाण स्मृति प्रस्तर विद्या (Megalithic Memorials)',
    subtitle: 'दिरी बिद, चापाड़ दिरी, नाई गाड़ा जांग बाहा तीर्थ व पाषाण संतुलन भौतिकी',
    targetTab: 'sasandiri_megalithic_lore',
    icon: Landmark,
    category: 'Megaliths & Ancestral Sites',
    description: 'जीवित महापाषाण परंपरा, दामोदर नदी अस्थि विसर्जन तीर्थ, बिना गारे की प्रस्तर इंजीनियरिंग व कुल सासान।'
  },
  {
    id: 'mod-indigenous-math-geometry',
    type: 'module',
    title: 'संताली लोक-गणित, गांठी लेखा व वास्तु ज्यामिति (Math & Geometry)',
    subtitle: 'गांठी लेखा डोरी, २०-आधारित (इसी) कनवर्टर व २-चाला/४-चाला छप्पर भौतिकी',
    targetTab: 'indigenous_math_geometry',
    icon: Calculator,
    category: 'Indigenous Math & Architecture',
    description: 'गांठों द्वारा दिनों व धान्य की गिनती, बेस-२० विगेसिमल अंकगणित और तूफानों को झेलने वाली चाला छत ज्यामिति।'
  },
  {
    id: 'mod-wild-honey-harvesting',
    type: 'module',
    title: 'संताली वन-शहद संचयन व वन्य-मधुमक्खी विद्या (Wild Honey Harvesting)',
    subtitle: 'तेरोम (विशाल रॉक बी), लुती (डंक-रहित मधुमक्खी) व हुरुम प्रजातियां एवं सतत संचयन',
    targetTab: 'wild_honey_harvesting',
    icon: Droplets,
    category: 'Forest Produce & Ecology',
    description: 'धुएं की मशाल, आधा छत्ता छोड़ने की परंपरा, बीर बोंगा अनुज्ञा और जंगली शहद-मोम के औषधीय नुस्खे।'
  },
  {
    id: 'mod-animal-behavior-omens',
    type: 'module',
    title: 'संताली पशु-ध्वनि, जैव-संकेत व लोक-शकुन विद्या (Animal Bioacoustics)',
    subtitle: 'चीतल हिरण की चेतावनी पुकार, वर्षा-मेंढक नाद व यात्रा के शुभ-अशुभ शकुन',
    targetTab: 'animal_behavior_omens',
    icon: Radio,
    category: 'Ethno-Bioacoustics & Omens',
    description: 'जंगली जीवों की चेतावनी पुकारें, चींटियों व बाबुई पक्षी के वर्षा संकेत और सुगुन काथा लोक-शकुन।'
  },
  {
    id: 'mod-indigenous-textile-dyes',
    type: 'module',
    title: 'पांची-पारहाड़ वनस्पति रंगाई व देशी ब्लॉक-प्रिंट (Natural Dyes & Block Print)',
    subtitle: 'गाबा (बबूल-लोहा), पलाश पीत-केसरिया, हरड़ व लकड़ी के ठप्पा छपाई स्टूडियो',
    targetTab: 'indigenous_textile_dyes',
    icon: Scissors,
    category: 'Textiles & Handloom Craft',
    description: 'प्राकृतिक रंग रसायन व रंग-बंधक, हैंडलूम फैब्रिक कैनवास और संताली पारंपरिक ब्लॉक प्रिंटिंग।'
  },
  {
    id: 'mod-indigenous-midwifery-care',
    type: 'module',
    title: 'दाया बुढ़ी व संताली प्रसूति-शिशु रक्षा विज्ञान (Indigenous Midwifery)',
    subtitle: 'नाड़ी-स्पर्श विद्या, महुआ तेल अभ्यंग, बांस चोई नाल-छेदन व जनम छठियार',
    targetTab: 'indigenous_midwifery_care',
    icon: Baby,
    category: 'Midwifery & Neonatal Lore',
    description: 'दाया बुढ़ी की प्राकृतिक प्रसव परिचर्या, मातृ-शिशु वनौषधियां और हपड़ाम वंशानुगत नामकरण विधान।'
  },
  {
    id: 'mod-universal-text-reader',
    type: 'module',
    title: 'संताली सर्व-पाठ व दस्तावेज वाचक (Universal Text & Audio Reader)',
    subtitle: 'दीर्घ पाठ, कराओके हाइलाइटिंग, गति-पिच नियंत्रण व ऐतिहासिक संदेश',
    targetTab: 'universal_text_reader',
    icon: FileText,
    category: 'Text & Audio Reader',
    description: 'दीर्घ लेखों, ऐतिहासिक हूल संदेशों व लोककथाओं का लाइव ऑडियो वाचन, गति-पिच नियंत्रण और कराओके हाइलाइटिंग।'
  },
  {
    id: 'mod-karam-binti-epic',
    type: 'module',
    title: 'करम बिनती पावन मौखिक महाकाव्य (Karam Binti Sacred Oral Epic)',
    subtitle: 'सृष्टि उत्पत्ति, हंस युगल, चांपा गढ़ प्रवास व करम रात के ६ पवित्र अध्याय',
    targetTab: 'karam_binti_epic_reader',
    icon: Scroll,
    category: 'Sacred Oral Epics',
    description: 'करम पर्व की पवित्र रात गुरु-चेला द्वारा गाए जाने वाले ६ पवित्र अध्याय, देवनागरी गीत, रोमन व आध्यात्मिक व्याख्या।'
  },
  {
    id: 'mod-epigraphy-numismatics',
    type: 'module',
    title: 'गढ़ प्रस्तर मुहर, ताम्रपत्र व संताली प्राचीन मुद्रा ज्ञान (Epigraphy & Numismatics)',
    subtitle: 'कौड़ी, सिका, ढबुआ, दमड़ी विनिमय कैलकुलेटर व चांपा गढ़ शिलालेख',
    targetTab: 'epigraphy_numismatics_lore',
    icon: Coins,
    category: 'Epigraphy & Currency Lore',
    description: 'प्राचीन संताली मुद्राओं का इतिहास, सिका-कौड़ी लाइव विनिमय कैलकुलेटर और ऐतिहासिक गढ़ शिलालेख।'
  },
  {
    id: 'mod-illustrated-comics',
    type: 'module',
    title: 'सचित्र संताली कॉमिक्स व लोक-कथा वाचक (Illustrated Comics Reader)',
    subtitle: 'फ्रेम-दर-फ्रेम संवाद, बहु-चरित्र ऑडियो व संताली लोक-कथाएं',
    targetTab: 'illustrated_comics_reader',
    icon: BookOpen,
    category: 'Visual Comics & Folklore',
    description: 'चालाक तूंईऊ आर कुईलू, तारुप आर सादोम आदि लोककथाओं का दृश्य कॉमिक्स प्रारूप, वाचन व नैतिक सीख।'
  },
  {
    id: 'mod-santali-verb-conjugator',
    type: 'module',
    title: 'रोनौड़ क्रिया-काल कंजुगेटर लैब (Verb & Tense Conjugator)',
    subtitle: 'सजीव/निर्जीव कर्म, द्विवचन, समावेशी-अपवर्जक सर्वनाम व सजीव वाक्य निर्माण',
    targetTab: 'santali_verb_conjugator',
    icon: Languages,
    category: 'Grammar & Verb Morphology',
    description: 'संताली धातु, काल प्रत्यय (-एत्, -केत्, -एना) और समावेशी/अपवर्जक सर्वनामों की इंटरैक्टिव प्रयोगशाला।'
  },
  {
    id: 'mod-pera-hor-literature',
    type: 'module',
    title: 'पेड़ा होड़ (१८९०) व क्लासिक संताली साहित्य आर्काइव',
    subtitle: 'बिदु चांदान, खेरवाड़ बीर, खेरवाड़ बोंसो व साधु रामचांद के कालजयी अंश',
    targetTab: 'pera_hor_literature',
    icon: FileText,
    category: 'Classical Literature & Archives',
    description: '१८९० का प्रथम संताली पत्र पेड़ा होड़, पं. रघुनाथ मुर्मू के महानाटक व ऐतिहासिक ग्रंथों का संकलन।'
  },
  {
    id: 'mod-sagar-bullock-cart',
    type: 'module',
    title: 'साग़ोड़ (बैलगाड़ी) निर्माण व पहाड़ी परिवहन यांत्रिकी',
    subtitle: '१२-तीलियों वाला साल का पहिया, धूरा, जुआठ व डहर सेरेञ गीत',
    targetTab: 'sagar_bullock_cart',
    icon: Compass,
    category: 'Traditional Transport Engineering',
    description: 'साल व गमहार काष्ठ से निर्मित बैलगाड़ी के यांत्रिक अंग, भार संतुलन सिमुलेटर व राहगीर लोकगीत।'
  },
  {
    id: 'mod-terracotta-pottery',
    type: 'module',
    title: 'कुम्हार मृदा कला व भट्ठा (आंवा) ताप विज्ञान',
    subtitle: 'तुकुक, चीलां, डोंगा कलसी की वाष्पीकरण शीतलता व भट्ठा सिमुलेटर',
    targetTab: 'terracotta_pottery_lore',
    icon: Flame,
    category: 'Pottery & Kiln Thermodynamics',
    description: 'पारंपरिक मिट्टी के पात्रों की निर्माण शैली, प्राकृतिक जल-शीतलन सिद्धांत व आंवा ताप परीक्षण।'
  },
  {
    id: 'mod-babui-rope-mat',
    type: 'module',
    title: 'बाबुई रस्सी, पाटिया चटाई व घोंघू (पत्ता रेनकोट) शिल्प',
    subtitle: '३-लड़ी सबई बंटाई, खजूर पत्ती बुनाई, सिकवाड़ व मानसून पत्ती कवच',
    targetTab: 'babui_rope_mat_craft',
    icon: Sprout,
    category: 'Natural Fiber & Mat Craft',
    description: 'वन-तंतु आधारित रस्सी, खजूर की चटाई, कांवर झूला व मानसून सुरक्षा के प्राकृतिक पत्ती वस्त्र।'
  },
  {
    id: 'mod-livestock-ethno-vet',
    type: 'module',
    title: 'गोरु-डांगरा पालन, सुनुम ओजोक् व पशु चिकित्सा विज्ञान',
    subtitle: 'सोहराय सींग-तेल मालिश, टुनी-टोंगा घंटी, खुर-रान व गोहाल रक्षा विधान',
    targetTab: 'livestock_ethno_vet',
    icon: HeartPulse,
    category: 'Livestock & Ethno-Veterinary',
    description: 'बैलों व गोवंश का सम्मान, लकड़ी की घंटी, पशु रोगों की देसी वनौषधि व गोहाल स्वच्छता।'
  },
  {
    id: 'mod-muhurat-almanac',
    type: 'module',
    title: 'संताली शुभ-अशुभ मुहूर्त व कृषि पंचांग परीक्षक',
    subtitle: 'एरोक बोनी, गृह खूंटी, बापला व यात्रा हेतु वार व चंद्र-कला मुहूर्त विचार',
    targetTab: 'muhurat_almanac_checker',
    icon: Moon,
    category: 'Traditional Almanac & Muhurat',
    description: 'सप्ताह के दिनों व शुक्ल-कुनामी चंद्र कलाओं के आधार पर मांगलिक व कृषि कार्यों का शुभ दिन परीक्षक।'
  },
  {
    id: 'mod-spt-pesa-rights',
    type: 'module',
    title: 'SPT एक्ट, PESA कानून व ग्राम सभा अधिकार संदर्शिका',
    subtitle: 'धारा २० भूमि सुरक्षा, ग्राम सभा शक्तियाँ, वनाधिकार (FRA) व ५वीं अनुसूची',
    targetTab: 'spt_pesa_rights_guide',
    icon: Scale,
    category: 'Constitutional & Community Rights',
    description: 'संथाल परगना काश्तकारी अधिनियम, पेसा अधिनियम १९९६ व ग्राम सभा के वैधानिक अधिकारों का सरल कोश।'
  },
  {
    id: 'mod-santali-dialects',
    type: 'module',
    title: 'क्षेत्रीय संताली बोली तुलना लैब (उत्तर, दक्षिण व बंगाल)',
    subtitle: 'दुमका, मयूरभंज-सिंहभूम व बाँकुड़ा उच्चारण व संवाद का तुलनात्मक कोष',
    targetTab: 'santali_dialects_comparative',
    icon: Globe,
    category: 'Dialects & Linguistics',
    description: 'उत्तर, दक्षिण व बंगाल क्षेत्र की संताली बोलियों के शब्दों और सर्वनामों की सीधी तुलना व ऑडियो।'
  },
  {
    id: 'mod-anchoring-speeches',
    type: 'module',
    title: 'संताली मंच संचालन, अतिथि जोहार व भाषण जनरेटर',
    subtitle: 'ग्राम सभा, हूल दिवस, बाहा-करम उत्सव हेतु तैयार संताली भाषण स्क्रिप्ट',
    targetTab: 'santali_anchoring_speeches',
    icon: Mic,
    category: 'Public Speaking & Events',
    description: 'अतिथि स्वागत जोहार, हूल दिवस संबोधन व धन्यवाद ज्ञापन हेतु कस्टम भाषण स्क्रिप्ट जनरेटर।'
  },
  {
    id: 'mod-tasar-sericulture',
    type: 'module',
    title: 'तसर कोसा (लुगुम) रेशम कीट पालन व असन वन विज्ञान',
    subtitle: 'असन-अर्जुन वृक्ष प्रबंधन, कोया निर्माण, अहिंसक घीचा कताई व बोंगा नेग',
    targetTab: 'tasar_silk_sericulture',
    icon: Sprout,
    category: 'Sericulture & Forest Craft',
    description: 'साल-असन वनों में बिना पेड़ काटे तसर कोसा कीट पालन और क्षारीय राख से रेशम कताई विज्ञान।'
  },
  {
    id: 'mod-oil-press-kolhu',
    type: 'module',
    title: 'कुइंडी, करंज व सुरगुजा काष्ठ कोल्हू (पाटा) तेल पेराई विज्ञान',
    subtitle: 'शून्य-रसायन कोल्ड-प्रेस तेल उत्पादन, खली उपयोग व तेल मात्रा कैलकुलेटर',
    targetTab: 'mahua_oil_press_kolhu',
    icon: Droplets,
    category: 'Agro-Processing Craft',
    description: 'महुआ बीज कुइंडी, करंज, सुरगुजा और कुसुम बीजों की पारंपरिक काष्ठ कोल्हू पिराई व लाभ।'
  },
  {
    id: 'mod-food-preservation',
    type: 'module',
    title: 'हेंडवा (बांस करील) व मानसून खाद्य संरक्षण विज्ञान',
    subtitle: 'बिना फ्रिज के महुआ लाडू, किण्वित बांस करील, सूखे वन-साग व दीर्घकालीन भंडारण',
    targetTab: 'sun_dried_forest_preservation',
    icon: Leaf,
    category: 'Food Preservation Science',
    description: 'सूर्य-शुष्क खाद्य प्रसंस्करण, किण्वित हेंडवा प्रोबायोटिक गुण व अकाल-रोधी भंडारण विज्ञान।'
  },
  {
    id: 'mod-donga-boat',
    type: 'module',
    title: 'ताड़-डोंगा नौका निर्माण व नदी-घाट मल्लाह विज्ञान',
    subtitle: 'सखुआ-ताड़ खोदाई डोंगा, धुना जलरोधन, नदी भंवर पहचान व घाट सेरेञ गीत',
    targetTab: 'donga_boat_river_lore',
    icon: Compass,
    category: 'Boat Craft & River Lore',
    description: 'दामोदर व अजय नदियों में डोंगा नौका की द्रवगतिकी, पतवार संतुलन व मल्लाह लोकगीत।'
  },
  {
    id: 'mod-aher-pyne-water',
    type: 'module',
    title: 'आहर-पइन सिंचाई बाँध व पाड़ी जल-बँटवारा प्रणाली',
    subtitle: 'शून्य-पंप ढलान नहर अभियांत्रिकी, सामुदायिक श्रमदान व पाड़ी समय कैलकुलेटर',
    targetTab: 'aher_pyne_water_governance',
    icon: Droplets,
    category: 'Water Governance & Irrigation',
    description: 'आहर-पइन गुरुत्वाकर्षण जल प्रणाली, सामुदायिक गौम व पाड़ी सिंचाई चक्र का न्यायपूर्ण विज्ञान।'
  },
  {
    id: 'mod-bir-sengel-fire',
    type: 'module',
    title: 'बीर सेंगोल: वन-अग्नि नियंत्रण व पत्ता अग्नि-रेखा विज्ञान',
    subtitle: 'फाल्गुन पतझड़ फायर-ब्रेक पट्टी, महुआ वृक्ष सुरक्षा व सामुदायिक अग्नि-शमन',
    targetTab: 'bir_sengel_fire_ecology',
    icon: Flame,
    category: 'Forest Fire Ecology',
    description: 'पतझड़ में दावानल रोकने की पत्ता-सफाई पट्टी तकनीक व सामुदायिक वन रक्षा नियम।'
  },
  {
    id: 'mod-typing-speed',
    type: 'module',
    title: 'संताली टाइपिंग स्पीड व शुद्धता टेस्ट (WPM Test)',
    subtitle: 'देवनागरी व रोमन में लाइव WPM, सटीकता प्रतिशत व अभ्यास वाक्य',
    targetTab: 'santali_typing_speed',
    icon: Keyboard,
    category: 'Typing & Speed',
    description: 'संताली देवनागरी और रोमन टाइपिंग गति (WPM) व सटीकता जांचने का लाइव अभ्यास परीक्षण।'
  },
  {
    id: 'mod-pahada-tables',
    type: 'module',
    title: 'संताली पहाड़ा और इसी (२०) गणित सारणी (Tables 1-10)',
    subtitle: '१ से १० तक बोलता पहाड़ा ऑडियो व इसी (Kodi) पद्धति से गुणन अभ्यास',
    targetTab: 'santali_pahada_tables',
    icon: Calculator,
    category: 'Math & Tables',
    description: 'संताली भाषा में १ से १० तक के पहाड़े, ऑडियो वाचन व पारंपरिक २०-आधारित इसी गुणन समझ।'
  },
  {
    id: 'mod-streak-tracker',
    type: 'module',
    title: 'दैनिक संताली अभ्यास स्ट्रीक व लक्ष्य ट्रैकर',
    subtitle: 'रोजाना अध्ययन लक्ष्य, ७-दिवसीय गतिविधि व माइलस्टोन बैज सहेजें',
    targetTab: 'learning_streak_tracker',
    icon: Flame,
    category: 'Learning & Progress',
    description: 'दैनिक अध्ययन स्ट्रीक, लक्ष्य प्रगति और संताली सीखने की उपलब्धियां ट्रैक करें।'
  },
  {
    id: 'mod-word-pinboard',
    type: 'module',
    title: 'त्वरित शब्द पिनबोर्ड व त्वरित नोट्स (Sticky Pinboard)',
    subtitle: 'प्रमुख संताली शब्द, रंगीन स्टिकी कार्ड्स व त्वरित वाचन डायरी',
    targetTab: 'word_pinboard_notes',
    icon: Bookmark,
    category: 'Notes & Quick Words',
    description: 'नए संताली शब्द और मुहावरे रंगीन पिनबोर्ड कार्ड्स पर तुरंत सहेजें और सुनें।'
  },
  {
    id: 'mod-exam-prep-jpsc',
    type: 'module',
    title: 'India + Jharkhand Competitive Exams 2026 (UPSC, SSC, JPSC, JSSC, JTET)',
    subtitle: 'भारत व झारखंड की 20 परीक्षाएँ, 3-वर्षीय PYQ (2023-25), 2 प्रैक्टिस पेपर व रियल CBT टेस्ट',
    targetTab: 'santali_exam_prep_jpsc',
    icon: GraduationCap,
    category: 'Competitive Exams 2026',
    description: 'UPSC, SSC CGL/GD, RRB, IBPS/SBI, UGC-NET, CTET, NDA, JPSC, JSSC CGL, Police, JTET, PGT व High Court के 2026 पेपर व PYQ।'
  },
  {
    id: 'mod-dictation-lab',
    type: 'module',
    title: 'संताली श्रुतलेख व वर्तनी प्रयोगशाला (Dictation Lab)',
    subtitle: 'ऑडियो सुनकर देवनागरी व रोमन में लिखने व वर्तनी जांचने का अभ्यास',
    targetTab: 'santali_dictation_lab',
    icon: Headphones,
    category: 'Listening & Spelling',
    description: 'संताली ऑडियो सुनकर सटीक वर्तनी लिखने और गति नियंत्रित करने का अभ्यास।'
  },
  {
    id: 'mod-word-match',
    type: 'module',
    title: 'तेज़ संताली ⇄ हिन्दी शब्द-मिलान खेल (Word Match)',
    subtitle: 'समयबद्ध जोड़ी मिलान मेमोरी गेम व सर्वश्रेष्ठ स्कोर ट्रैकिंग',
    targetTab: 'santali_word_match_game',
    icon: Gamepad2,
    category: 'Games & Vocabulary',
    description: 'प्रकृति, परिवार और दैनिक शब्दों की संताली-हिन्दी जोड़ियाँ मिलाने का तेज़ खेल।'
  },
  {
    id: 'mod-medical-translator',
    type: 'module',
    title: 'अस्पताल व स्वास्थ्य संवाद गाइड (Medical & Clinic Guide)',
    subtitle: 'डॉक्टर, आशा व ANM कर्मियों के लिए मरीज़ लक्षण व दवा संवाद',
    targetTab: 'santali_medical_translator',
    icon: HeartPulse,
    category: 'Healthcare & Utility',
    description: 'ग्रामीण स्वास्थ्य केंद्रों में मरीज़ों से लक्षण पूछने और दवा समझाने का संताली-हिन्दी ऑडियो संवाद।'
  },
  {
    id: 'mod-gram-sabha-drafter',
    type: 'module',
    title: 'ग्राम सभा प्रस्ताव व वंशावली ड्राफ़्टर (Form Drafter)',
    subtitle: 'PESA ग्राम सभा प्रस्ताव, मांझी सत्यापन व FRA दावा एक क्लिक में तैयार करें',
    targetTab: 'gram_sabha_form_drafter',
    icon: FileText,
    category: 'Governance & Forms',
    description: 'गांव, टोला, पारिस व मांझी नाम भरकर ग्राम सभा प्रस्ताव, वंशावली व वन पट्टा दावा प्रारूप तैयार करें।'
  },
  {
    id: 'mod-news-teleprompter',
    type: 'module',
    title: 'संताली समाचार व टेलीप्रॉम्प्टर स्टूडियो (News Studio)',
    subtitle: 'कम्युनिटी रेडियो, यूट्यूब व स्कूल सभा के लिए स्क्रॉलिंग टेलीप्रॉम्प्टर',
    targetTab: 'santali_news_bulletin_studio',
    icon: Radio,
    category: 'Media & Broadcasting',
    description: 'गति व फ़ॉन्ट आकार नियंत्रण के साथ संताली समाचार बुलेटिन एवं घोषणा टेलीप्रॉम्प्टर।'
  },
  {
    id: 'mod-data-backup',
    type: 'module',
    title: 'सुरक्षित डेटा बैकअप व रिस्टोर मैनेजर (Local Storage Sync)',
    subtitle: 'पिनबोर्ड नोट्स, स्ट्रीक व अभ्यास डेटा को JSON फ़ाइल में सहेजें व रिस्टोर करें',
    targetTab: 'data_backup_manager',
    icon: Shield,
    category: 'System & Backup',
    description: 'स्थानीय ब्राउज़र डेटा का एक-क्लिक JSON बैकअप डाउनलोड और रिस्टोर टूल।'
  },
  {
    id: 'mod-tala-metronome',
    type: 'module',
    title: 'संताली पारंपरिक ताल व मेट्रोनोम स्टूडियो (Tala Metronome)',
    subtitle: 'लांगड़े, सोहराय, दांता, बाहा व गोलावरी तालों की लाइव बीट व तुमाक बोल',
    targetTab: 'santali_tala_metronome',
    icon: Music,
    category: 'Music & Rhythm',
    description: 'संताली नृत्य और वाद्य अभ्यास के लिए बीट, मात्रा और बोलों का सिंथेसाइज्ड मेट्रोनोम।'
  },
  {
    id: 'mod-instrument-tuner',
    type: 'module',
    title: 'बानाम व तिरिओ सुर ट्यूनर एवं स्केल मार्गदर्शक (Instrument Tuner)',
    subtitle: 'बांसुरी (तिरिओ), धोदरो बानाम और तामाक के वास्तविक आवृत्तियों (Hz) का सिंथेसाइज़र',
    targetTab: 'santali_instrument_tuner',
    icon: Radio,
    category: 'Acoustics & Tuning',
    description: 'तिरिओ मुरली, धोदरो बानाम तारों और तामाक के वास्तविक पिच आवृत्तियों पर आधारित ट्यूनर।'
  },
  {
    id: 'mod-land-topography',
    type: 'module',
    title: 'संताली भूमि, खेत व स्थलाकृति शब्दावली (Land Topography)',
    subtitle: 'गोड़ा, बाद/बहेरा, डाड़ी, जाहेर थान व पारंपरिक भूमि पैमाइश कैलकुलेटर',
    targetTab: 'santali_land_topography',
    icon: Compass,
    category: 'Land & Agriculture Lore',
    description: 'संताली में गोड़ा टांड़, बाद निचली धान भूमि, डाड़ी जल स्रोत और काठ-बीघा पैमाइश कैलकुलेटर।'
  },
  {
    id: 'mod-micro-journal',
    type: 'module',
    title: 'दैनिक संताली डायरी व विचार प्रेरक (Daily Micro-Journal)',
    subtitle: 'संताली भाव-दशा (रस्का, कुरुमुटु), दैनिक आभार व आत्म-चिंतन प्रविष्टियाँ सहेजें',
    targetTab: 'santali_micro_journal',
    icon: Bookmark,
    category: 'Journal & Daily Reflection',
    description: 'रस्का, कुरुमुटु, शांति भाव-दशा और दैनिक कृतज्ञता प्रविष्टियों के साथ संताली डायरी।'
  },
  {
    id: 'mod-wit-riddles-arena',
    type: 'module',
    title: 'संताली कुदुम (पहेली) व लन्दा काथा अखाड़ा (Riddles & Wit)',
    subtitle: 'पारंपरिक संताली पहेलियाँ, हास्य कथाएँ व त्वरित स्कोरिंग चुनौती',
    targetTab: 'santali_wit_riddles_arena',
    icon: Smile,
    category: 'Folklore & Brain Teasers',
    description: 'पारंपरिक संताली कुदुम पहेलियां, उत्तर व्याख्या और लन्दा काथा लोक-हास्य कथाएं।'
  },
  {
    id: 'mod-dance-akhda-formations',
    type: 'module',
    title: 'संताली नृत्य मुद्रा व अखड़ा फॉर्मेशन गाइड (Dance & Akhda)',
    subtitle: 'दोन, लांगड़े, बाहा, दासांय व सोहराय की गोल-अर्धचंद्राकार मुद्राएं व ताल सिंक',
    targetTab: 'dance_akhda_formations',
    icon: Users,
    category: 'Culture, Dance & Akhda',
    description: 'इंटरैक्टिव अखड़ा फॉर्मेशन डायग्राम, 8-बीट फुटवर्क टाइमलाइन और टमाक-तुमदाक ताल अभ्यास।'
  },
  {
    id: 'mod-santali-grammar-checker',
    type: 'module',
    title: 'संताली व्याकरण व प्रत्यय परीक्षक (Grammar Checker)',
    subtitle: 'सजीव/निर्जीव नियम, सर्वनाम वचन (-किन/-को), काल प्रत्यय (-एत्/-केत्) व वाक्य जाँच',
    targetTab: 'santali_grammar_checker',
    icon: Sparkles,
    category: 'Grammar & Linguistics',
    description: 'संताली वाक्यों का व्याकरणिक विश्लेषण, प्रत्यय विभाजक और संवादात्मक उदाहरण परीक्षक।'
  },
  {
    id: 'mod-santali-crossword-puzzle',
    type: 'module',
    title: 'संताली शब्द-पहेली (Crossword Grid Puzzle)',
    subtitle: 'प्रकृति, रिश्ते, त्योहार व वाद्ययंत्र पर आधारित टच-फ़्रेंडली संताली क्रॉसवर्ड',
    targetTab: 'santali_crossword_puzzle',
    icon: Gamepad2,
    category: 'Word Games & Vocabulary',
    description: 'सिंगल-स्क्रीन टच कीबोर्ड के साथ संताली शब्द-पहेली खेलें और स्कोर सहेजें।'
  },
  {
    id: 'mod-wildlife-flora-quiz',
    type: 'module',
    title: 'वन्यजीव व जड़ी-बूटी पहचान क्विज़ (Wildlife & Flora)',
    subtitle: 'सखुआ, महुआ, करम, नीलगाय व जंगल की औषधियों का सांस्कृतिक व पर्यावरणीय ज्ञान',
    targetTab: 'wildlife_flora_quiz',
    icon: Trees,
    category: 'Ecology & Forest Heritage',
    description: 'वन्यजीवों और पवित्र वृक्षों-जड़ी-बूटियों के संताली नाम व उपयोग पर त्वरित क्विज़।'
  },
  {
    id: 'mod-invitation-certificate-maker',
    type: 'module',
    title: 'बापला निमंत्रण कार्ड व प्रमाण-पत्र स्टूडियो (Card Studio)',
    subtitle: 'नेवता पाती, बापला निमंत्रण कार्ड व सम्मान प्रमाण-पत्र बनाएँ व प्रिंट/सेव करें',
    targetTab: 'invitation_certificate_maker',
    icon: Award,
    category: 'Digital Tools & Templates',
    description: 'सोहराय कला बॉर्डर वाले संताली-हिंदी द्विभाषी निमंत्रण और सम्मान प्रमाण-पत्र स्टूडियो।'
  },
  {
    id: 'mod-sentence-scramble',
    type: 'module',
    title: 'संताली वाक्य-निर्माण पहेली (Sentence Scramble)',
    subtitle: 'बिखरे संताली शब्दों को सही व्याकरणिक क्रम में जोड़कर अभ्यास करें',
    targetTab: 'sentence_scramble_builder',
    icon: Shuffle,
    category: 'Language & Grammar',
    description: 'SOV क्रम में संताली वाक्य बनाने और उच्चारण सुनने का इंटरैक्टिव अभ्यास खेल।'
  },
  {
    id: 'mod-poetry-sereng-studio',
    type: 'module',
    title: 'सेरेंग व तुकबंदी काव्य स्टूडियो (Poetry Studio)',
    subtitle: 'सोहराय, बाहा और दोंग शैली में कविता रचना, तुकांत शब्द बैंक व वाचन',
    targetTab: 'poetry_sereng_studio',
    icon: Feather,
    category: 'Literature & Poetry',
    description: 'तुकांत शब्दों की सहायता से संताली लोकगीत और कविता लिखें, सेव करें और सुनें।'
  },
  {
    id: 'mod-pocket-study-booklet',
    type: 'module',
    title: 'पॉकेट अध्ययन पुस्तिका निर्माता (Pocket Booklet)',
    subtitle: 'शब्दकोश से चुने गए शब्दों की प्रिंटेबल 8-पेज फ़्लैशकार्ड पुस्तिका बनाएं',
    targetTab: 'pocket_study_booklet',
    icon: BookOpen,
    category: 'Study Tools & Printables',
    description: 'अध्ययन व रिवीज़न के लिए संताली-हिंदी-अंग्रेज़ी पॉकेट बुकलेट तैयार व प्रिंट करें।'
  },
  {
    id: 'mod-clan-kinship-checker',
    type: 'module',
    title: 'पारिस व गोत्र मर्यादा परीक्षक (Clan & Kinship)',
    subtitle: '१२ संताली पारिस, खूंट, विवाह मर्यादा व गोत्र टोटेम जांचें',
    targetTab: 'clan_kinship_checker',
    icon: Shield,
    category: 'Culture & Heritage',
    description: 'पारिस आधारित पारंपरिक रिश्तेदारी, मर्यादा नियम और टोटेम प्रतीक जानें।'
  },
  {
    id: 'mod-civic-bank-dialogue-kit',
    type: 'module',
    title: 'बैंक, डाकघर व प्रखंड संवाद किट (Civic Dialogue)',
    subtitle: 'सरकारी दफ्तर, बैंक पासबुक, पेंशन व डाकघर हेतु संताली-हिंदी-अंग्रेज़ी वाक्य',
    targetTab: 'civic_bank_dialogue_kit',
    icon: Landmark,
    category: 'Spoken Santali & Daily Utility',
    description: 'नागरिक सेवाओं व बैंकिंग कार्य के लिए व्यावहारिक संताली संवाद व ऑडियो गाइड।'
  },
  {
    id: 'mod-haat-festival-planner',
    type: 'module',
    title: 'हाट व पर्व सामग्री प्लानर (Haat & Festival)',
    subtitle: 'सोहराय, बाहा, बापला और साप्ताहिक हाट के लिए चेकलिस्ट व अनुमानित बजट',
    targetTab: 'haat_festival_planner',
    icon: ShoppingBag,
    category: 'Culture & Daily Planning',
    description: 'पर्वों व साप्ताहिक हाट की खरीदारी सूची, खर्च ट्रैकिंग और ऑडियो रीडर।'
  },
  {
    id: 'mod-santali-word-search',
    type: 'module',
    title: 'संताली शब्द-जाल खोज (Word Search Puzzle)',
    subtitle: '8x8 देवनागरी अक्षर-खंड ग्रिड में छिपे संताली शब्द ढूंढें व उच्चारण सुनें',
    targetTab: 'santali_word_search_puzzle',
    icon: Grid3X3,
    category: 'Word Games & Vocabulary',
    description: 'इंटरैक्टिव 8x8 ग्रिड में संताली शब्द खोजकर अपनी शब्दावली मज़बूत करें।'
  },
  {
    id: 'mod-audio-memory-flip',
    type: 'module',
    title: 'ऑडियो मेमोरी फ्लिप गेम (Audio Memory)',
    subtitle: 'ध्वनि सुनकर संताली शब्द और उसके हिंदी अर्थ की सही जोड़ी मिलाएं',
    targetTab: 'audio_memory_flip_game',
    icon: Headphones,
    category: 'Word Games & Vocabulary',
    description: 'ध्वनि-आधारित कार्ड मिलान खेल जिसमें हर कार्ड संताली उच्चारण सुनाता है।'
  },
  {
    id: 'mod-village-layout-map',
    type: 'module',
    title: 'संताल गाँव का मानचित्र व पवित्र स्थल (Village Map)',
    subtitle: 'जाहेर थान, मांझी थान, अखड़ा व कुलही डहर की पारंपरिक ग्राम संरचना देखें',
    targetTab: 'village_layout_landmark_map',
    icon: MapPin,
    category: 'Culture & Heritage',
    description: 'संताली गाँव के प्रमुख पवित्र व सामाजिक स्थलों का संवादात्मक मानचित्र।'
  },
  {
    id: 'mod-daily-current-affairs',
    type: 'module',
    title: 'दैनिक करेंट अफेयर्स 2026 (India + Jharkhand) व क्विज़',
    subtitle: '2026 के प्रमुख राष्ट्रीय व झारखंड समसामयिकी नोट्स, बुकमार्क व 3-भाषा ऑडियो',
    targetTab: 'daily_current_affairs',
    icon: Newspaper,
    category: 'Competitive Exams & GK',
    description: 'JPSC, JSSC, UPSC व SSC 2026 के लिए समसामयिकी नोट्स और 10-प्रश्न मिनी क्विज़।'
  },
  {
    id: 'mod-native-voice-recorder',
    type: 'module',
    title: 'मातृभाषी स्वर रिकॉर्डर व उच्चारण संग्रह (Voice Bank)',
    subtitle: 'असली मातृभाषी उच्चारण ऑफ़लाइन IndexedDB में रिकॉर्ड, प्ले व डाउनलोड करें',
    targetTab: 'native_voice_recorder',
    icon: Mic,
    category: 'Language & Audio Preservation',
    description: 'बुज़ुर्गों व मूल वक्ताओं की संताली आवाज़ ऑफ़लाइन सहेजने व साझा करने का स्टूडियो।'
  },
  {
    id: 'mod-two-player-battle',
    type: 'module',
    title: '2-प्लेयर क्विज़ बैटल (1v1 Split Buzzer Duel)',
    subtitle: 'एक ही स्क्रीन पर दो खिलाड़ियों के बीच संताली, झारखंड व भारत GK का लाइव मुकाबला',
    targetTab: 'two_player_battle',
    icon: Swords,
    category: 'Games & Competitive Practice',
    description: 'दो-खिलाड़ी स्प्लिट-पैड टाइमर क्विज़ जिसमें सही उत्तर व बोनस अंक मिलते हैं।'
  },
  {
    id: 'mod-admin-cms',
    type: 'module',
    title: 'Admin Master Content Studio (CMS)',
    subtitle: 'Complete Add / Edit / Update access across all sections, hero text, and lexicon',
    targetTab: 'admin_cms',
    icon: Edit3,
    category: 'Administration & CMS',
    description: 'Full live editor with ready formats to add, edit, or delete words, phrases, and folklore.'
  },
  {
    id: 'mod-admin',
    type: 'action',
    title: 'Admin Authentication Portal',
    subtitle: 'Super Admin Login, Editorial Control & ID/Password Reset Recovery',
    icon: ShieldCheck,
    category: 'Administration',
    description: 'Manage dictionary words, edit Hero banner text, and manage security settings.'
  },
  {
    id: 'mod-smart-srs-coach',
    type: 'module',
    title: 'स्मार्ट रिवीजन कोच (Spaced Repetition SRS)',
    subtitle: 'आज के 15 ज़रूरी शब्द · भूलने की गति आधारित स्मार्ट रिवीजन व Mastery % रिपोर्ट',
    targetTab: 'smart_srs_coach',
    icon: Target,
    category: 'Smart Learning',
    description: 'Google प्रोफ़ाइल आधारित SM-2 स्पेस्ड रिपिटिशन कोच और श्रेणी-वार शब्द दक्षता विश्लेषण।'
  },
  {
    id: 'mod-document-book-reader',
    type: 'module',
    title: 'दस्तावेज़ व PDF बुक ऑडियो रीडर + बल्क कनवर्टर',
    subtitle: 'PDF / TXT किताब अपलोड कर अनुच्छेद-वार ऑडियो सुनें व ओल चिकी में बदलें',
    targetTab: 'document_book_reader',
    icon: FileText,
    category: 'Reading & Script Tools',
    description: 'मल्टी-पेज दस्तावेज़, गीत व निबंध का अनुच्छेद वाचन, शब्द-टैप अर्थ व द्वि-लिपि एक्सपोर्ट।'
  },
  {
    id: 'mod-community-voice-events',
    type: 'module',
    title: 'सामुदायिक बोली ऑडियो बैंक व ग्राम पर्व नोटिस बोर्ड',
    subtitle: 'मातृभाषी आवाज़ रिकॉर्डिंग, Upvote व गाँव के बाहा-सोहराय कार्यक्रम की सूचना',
    targetTab: 'community_voice_events',
    icon: Users,
    category: 'Community & Events',
    description: 'क्षेत्रीय बोली उच्चारण बैंक और Admin-अनुमोदित ग्राम सांस्कृतिक कार्यक्रम नोटिस बोर्ड।'
  },
  {
    id: 'mod-santhal-belt-atlas',
    type: 'module',
    title: 'संताल बेल्ट इंटरैक्टिव सांस्कृतिक व बोली एटलस',
    subtitle: 'झारखंड, ओडिशा, बंगाल व असम के 7 प्रमुख सांस्कृतिक केंद्र व बोली तुलना',
    targetTab: 'santhal_belt_atlas',
    icon: Compass,
    category: 'Heritage Geography',
    description: 'भोगनाडीह, दुमका, लुगुबुरु, कोल्हान, मयूरभंज, अयोध्या बुरु व असम चाय बेल्ट का इंटरैक्टिव मानचित्र।'
  },
  {
    id: 'mod-roleplay-conversation',
    type: 'module',
    title: 'इंटरैक्टिव संताली संवाद सिमुलेटर (Live Role-Play)',
    subtitle: 'हाट, अस्पताल, स्कूल, बस यात्रा व बुज़ुर्ग अभिवादन में बहु-चरणीय संवाद अभ्यास',
    targetTab: 'roleplay_conversation',
    icon: MessageSquare,
    category: 'Spoken Practice',
    description: 'प्रश्नों व उत्तर विकल्पों के साथ वास्तविक जीवन संताली संवाद व शिष्टाचार स्कोरिंग सिमुलेटर।'
  },
  {
    id: 'mod-family-tree-builder',
    type: 'module',
    title: 'डिजिटल पारिवारिक वंशावली वृक्ष निर्माता (Family Tree Chart Maker)',
    subtitle: '4 पीढ़ियों का पारिस आधारित संताली वंश वृक्ष बनाएँ व HD PNG चार्ट डाउनलोड करें',
    targetTab: 'family_tree_builder',
    icon: TreePine,
    category: 'Heritage & Family',
    description: 'दादा-दादी से संतान तक पारिस, मूल गाँव और ओल चिकी के साथ पारिवारिक वंशावली वृक्ष निर्माता।'
  },
  {
    id: 'mod-teacher-worksheet-maker',
    type: 'module',
    title: 'शिक्षक व अभिभावक टेस्ट / वर्कशीट जनरेटर (Worksheet Maker)',
    subtitle: 'जोड़ी मिलान, रिक्त स्थान, MCQ व ओल चिकी ट्रेसिंग का प्रिंटेबल A4 टेस्ट पेपर',
    targetTab: 'teacher_worksheet_maker',
    icon: ClipboardList,
    category: 'Teaching & Printables',
    description: 'शब्दकोश से स्वतः तैयार होने वाले प्रश्नपत्र, उत्तर कुंजी और ओल चिकी अभ्यास कार्यपत्रक।'
  },
  {
    id: 'mod-chhatiar-name-studio',
    type: 'module',
    title: 'जनम छठियार व संताली बेबी-नेम कार्ड स्टूडियो',
    subtitle: 'पर्व-ऋतु आधारित नाम खोज और डाउनलोड करने योग्य HD जनम छठियार निमंत्रण कार्ड',
    targetTab: 'chhatiar_name_studio',
    icon: Baby,
    category: 'Family & Rituals',
    description: 'बाहा, सोहराय व करम ऋतुओं के अनुसार शिशु नाम खोजें और जनम छठियार PNG ई-कार्ड बनाएँ।'
  },
  {
    id: 'mod-audio-playlist-player',
    type: 'module',
    title: 'निरंतर सेरेञ प्लेलिस्ट व स्लीप टाइमर (Audio Playlist)',
    subtitle: 'लोककथा, सेरेञ, करम बिनती व बालगीत की ऑटो-एडवांस प्लेलिस्ट व स्लीप टाइमर',
    targetTab: 'audio_playlist_player',
    icon: ListMusic,
    category: 'Audio & Stories',
    description: 'शफल, रिपीट, गति नियंत्रण और 15/30/60 मिनट स्लीप टाइमर के साथ निरंतर संताली वाचन।'
  },
  {
    id: 'mod-community-hall-of-fame',
    type: 'module',
    title: 'सामुदायिक योगदान सम्मान बोर्ड व प्रमाण-पत्र (Hall of Fame)',
    subtitle: 'Admin-अनुमोदित शब्द, बोली ऑडियो व ग्राम आयोजन योगदानकर्ता रैंकिंग व सर्टिफिकेट',
    targetTab: 'community_hall_of_fame',
    icon: Award,
    category: 'Community & Recognition',
    description: 'भाषा रक्षकों का लाइव स्कोरबोर्ड और डाउनलोड करने योग्य HD सम्मान-पत्र।'
  },
  {
    id: 'mod-offline-pack-manager',
    type: 'module',
    title: 'ग्रामीण कम-नेटवर्क ऑफ़लाइन पैक व स्टोरेज वेरिफ़ायर',
    subtitle: 'IndexedDB शब्दकोश कैश जांच, डिवाइस कोटा व JSON ऑफ़लाइन अध्ययन पैक एक्सपोर्ट',
    targetTab: 'offline_pack_manager',
    icon: HardDrive,
    category: 'Offline & Rural Access',
    description: 'ग्रामीण क्षेत्रों में बिना इंटरनेट पढ़ाई हेतु ब्राउज़र स्टोरेज वेरिफ़ायर व 1-क्लिक सिंक।'
  },
  {
    id: 'mod-smart-essay-writer',
    type: 'module',
    title: 'स्मार्ट संताली लेखन व निबंध संपादक (Smart Essay Writer)',
    subtitle: 'शब्दकोश ऑटोकम्प्लीट, लाइव ओल चिकी प्रीव्यू, वॉइस प्रूफ़रीड व .TXT/प्रिंट एक्सपोर्ट',
    targetTab: 'smart_essay_writer',
    icon: FileText,
    category: 'Writing & Study',
    description: 'टाइप करते समय शब्दकोश से लाइव सुझाव, स्टार्टर टेम्पलेट और ओल चिकी में साथ-साथ रूपांतरण।'
  },
  {
    id: 'mod-emergency-voice-cards',
    type: 'module',
    title: 'आपातकालीन व यात्रा संताली वॉइस-SOS पॉकेट कार्ड',
    subtitle: 'अस्पताल, यात्रा व सहायता के 1-टैप तेज़ आवाज़ SOS कार्ड व QR पॉकेट आईडी PNG',
    targetTab: 'emergency_voice_cards',
    icon: HeartPulse,
    category: 'Safety & Travel',
    description: 'आपात स्थिति में 1-क्लिक लाउड संताली-हिन्दी आवाज़ कार्ड और स्कैन करने योग्य QR पहचान पत्र।'
  },
  {
    id: 'mod-weekly-bulletin-maker',
    type: 'module',
    title: 'ग्राम व विद्यालय साप्ताहिक बुलेटिन / न्यूज़लेटर निर्माता',
    subtitle: 'संपादकीय, ग्राम सभा सूचना, सप्ताह का शब्द व ओल चिकी वाला प्रिंटेबल A4 बुलेटिन',
    targetTab: 'weekly_bulletin_maker',
    icon: Newspaper,
    category: 'Community & Teaching',
    description: 'स्कूल या गाँव के साप्ताहिक नोटिस बोर्ड के लिए द्विभाषी A4 बुलेटिन, वॉइस वाचन और HD PNG एक्सपोर्ट।'
  },
  {
    id: 'mod-kids-storybook-maker',
    type: 'module',
    title: 'सचित्र बाल-कहानी पुस्तक निर्माता (Kids Storybook Maker)',
    subtitle: '1 से 8 पन्नों की संताली-ओल चिकी-हिन्दी चित्रकथा पुस्तक, ऑडियो वाचन व प्रिंट बुकलेट',
    targetTab: 'kids_storybook_maker',
    icon: BookOpen,
    category: 'Kids & Creative',
    description: 'बच्चों के लिए कस्टम दृश्य थीम वाली 8-पेज कहानी पुस्तिका बनाएँ, सुनें और प्रिंट करें।'
  },
  {
    id: 'mod-tense-suffix-drill',
    type: 'module',
    title: 'संताली वाक्य-प्रत्यय व काल अभ्यास ड्रिल लैब',
    subtitle: 'वर्तमान, भूत, भविष्य काल व सजीव-निर्जीव (-ए/-आक/-केदा) प्रत्यय अभ्यास टाइमर के साथ',
    targetTab: 'tense_suffix_drill',
    icon: Flame,
    category: 'Grammar & Practice',
    description: 'संताली क्रिया प्रत्यय और काल की सटीक पहचान के लिए 60-सेकंड ड्रिल, स्ट्रीक और व्याख्या।'
  },
  {
    id: 'mod-krishi-crop-ledger',
    type: 'module',
    title: 'कृषि, वनोपज व हाट हिसाब डायरी (Crop & Haat Ledger)',
    subtitle: 'धान, महुआ, तसर कोसा व साप्ताहिक हाट आय-व्यय का ऑफ़लाइन हिसाब, ऑडियो सारांश व CSV',
    targetTab: 'krishi_crop_ledger',
    icon: Sprout,
    category: 'Rural Livelihood',
    description: 'किसानों व ग्रामीण परिवारों के लिए उपज बिक्री व खर्च का सरल बही-खाता, मुनाफ़ा ग्राफ़ और CSV एक्सपोर्ट।'
  },
  {
    id: 'mod-qr-word-cards',
    type: 'module',
    title: 'कक्षा व दीवार के लिए QR शब्द फ़्लैशकार्ड जनरेटर',
    subtitle: 'असली QR कोड वाले A4 शब्द कार्ड प्रिंट करें — स्कैन करते ही शब्दकोश व ऑडियो खुले',
    targetTab: 'qr_word_cards',
    icon: QrCode,
    category: 'Teaching & Printables',
    description: 'स्कूल की दीवारों व स्टडी कॉर्नर के लिए कस्टम या शब्दकोश आधारित स्कैनेबल QR फ़्लैशकार्ड शीट।'
  },
  {
    id: 'mod-pronoun-case-lab',
    type: 'module',
    title: 'संताली सर्वनाम, द्विवचन (-किन) व विभक्ति प्रयोगशाला',
    subtitle: 'समावेशी (आबो) बनाम अपवर्जी (आले), वचन-भेद व रे/खोन/ते कारक का लाइव वाक्य निर्माता',
    targetTab: 'santali_pronoun_case_lab',
    icon: Layers,
    category: 'Grammar & Practice',
    description: 'इञ, अलिञ, आलांग, आबो, आम, आकिन व उनकु के साथ विभक्ति अभ्यास व प्रश्नोत्तरी।'
  },
  {
    id: 'mod-bazaar-price-calc',
    type: 'module',
    title: 'हाट-बाज़ार व ग्रामीण दुकान बोलती रसीद कैलकुलेटर',
    subtitle: 'चावले-तेल का तुरंत बिल, संताली इसी (20-इकाई) गिनती व बोलकर सुनाई देने वाली रसीद',
    targetTab: 'santali_bazaar_price_calc',
    icon: Calculator,
    category: 'Rural Livelihood',
    description: 'गाँव के हाट और किराना दुकानों के लिए द्विभाषी संताली-हिन्दी बिल व WhatsApp/प्रिंट रसीद।'
  },
  {
    id: 'mod-school-prayer-assembly',
    type: 'module',
    title: 'विद्यालय प्रार्थना सभा, छात्र प्रतिज्ञा व सुविचार स्टूडियो',
    subtitle: 'सुबह की असेंबली हेतु जाहेर बिनती, विद्यार्थी प्रतिज्ञा, सुविचार व GK बोर्ड (A4 प्रिंट)',
    targetTab: 'santali_school_prayer_assembly',
    icon: Sun,
    category: 'Teaching & Printables',
    description: 'स्कूल और छात्रावास की प्रार्थना सभा के लिए संताली देवनागरी व ओल चिकी वंदना किट।'
  },
  {
    id: 'mod-panchayat-scheme-guide',
    type: 'module',
    title: 'सरकारी योजना, ई-कल्याण छात्रवृत्ति व राशन-पेंशन गाइड',
    subtitle: 'आवास, वन पट्टा (FRA), पेंशन, KCC दस्तावेज़ चेकलिस्ट व ब्लॉक-प्रज्ञा केंद्र संताली संवाद',
    targetTab: 'santali_panchayat_scheme_guide',
    icon: Landmark,
    category: 'Civic & Rights',
    description: 'पात्रता, जरूरी कागज़ात टिक-लिस्ट और प्रज्ञा केंद्र में बोलने के लिए संताली वाक्य सहायता।'
  },
  {
    id: 'mod-bus-rail-helpline',
    type: 'module',
    title: 'यात्रा, बस-रेल, हॉस्टल व कचहरी संवाद पॉकेट कार्ड',
    subtitle: '१-टैप बोलकर टिकट, प्लेटफॉर्म, डाकघर व कॉलेज प्रवेश संवाद + कस्टम रास्ता पर्ची',
    targetTab: 'santali_bus_rail_helpline',
    icon: Bus,
    category: 'Safety & Travel',
    description: 'दुमका, रांची, जमशेदपुर आदि यात्रा मार्ग के लिए तुरंत बोलने वाला संताली संवाद सहायक।'
  },
  {
    id: 'mod-audio-listening-test',
    type: 'module',
    title: 'संताली श्रवण बोध (सुनकर समझें) परीक्षा लैब',
    subtitle: 'धीमी/सामान्य आवाज़ में संताली संवाद सुनें, प्रश्न हल करें व देवनागरी-ओल चिकी प्रतिलेख देखें',
    targetTab: 'santali_audio_listening_test',
    icon: Headphones,
    category: 'Audio & Practice',
    description: 'बिना देखे संताली सुनकर समझने की क्षमता बढ़ाने वाला इंटरैक्टिव ऑडियो टेस्ट।'
  },
  {
    id: 'mod-song-lyric-builder',
    type: 'module',
    title: 'सोहराय-बाहा लोकगीत व दोहा रचनाकार (Sereng Builder)',
    subtitle: 'तुकबंदी शब्द सहायता से ४-पदा संताली गीत रचें, सुनें व HD PNG पोस्टर/.TXT डाउनलोड करें',
    targetTab: 'santali_song_lyric_builder',
    icon: Music,
    category: 'Culture & Music',
    description: 'बाहा, सोहराय, करम व लागड़े गीत लेखन व द्वि-लिपि पोस्टर निर्माता।'
  },
  {
    id: 'mod-jora-katha-lab',
    type: 'module',
    title: 'संताली जोड़ा काथा, विलोम व पर्यायवाची प्रयोगशाला',
    subtitle: 'दाक्-माड़ी, चांदो-माहिट जैसे युग्म शब्द, विलोम जोड़े व तुकबंदी क्विज़',
    targetTab: 'santali_jora_katha_lab',
    icon: Sparkles,
    category: 'Grammar & Vocabulary',
    description: 'संताली जोड़ा काथा युग्म शब्द, उल्टा काथा (विलोम) और समानार्थक शब्द अभ्यास।'
  },
  {
    id: 'mod-question-negation-lab',
    type: 'module',
    title: 'संताली प्रश्न-वाचक व नकारात्मक वाक्य लैब',
    subtitle: 'चेत्, ओकोय, ओका, तिस, तिनाक् व बाङ/बानुक्/आलो से तुरंत वाक्य निर्माण',
    targetTab: 'santali_question_negation_lab',
    icon: HelpCircle,
    category: 'Grammar & Practice',
    description: 'प्रश्न पूछने और मना करने (नेगेशन) के सही संताली वाक्य रूप व ऑडियो।'
  },
  {
    id: 'mod-spell-fix-lab',
    type: 'module',
    title: 'संताली वर्तनी व रुद्ध-ध्वनि (क्/त्/च्/प्) शुद्धि लैब',
    subtitle: 'ओड़ाक् बनाम ओड़ाक जैसी अशुद्धियाँ पहचानें और सही देवनागरी व ओल चिकी वर्तनी सीखें',
    targetTab: 'santali_spell_fix_lab',
    icon: PenTool,
    category: 'Grammar & Practice',
    description: 'संताली रुद्ध व्यंजनों और सही वर्तनी अभ्यास की इंटरैक्टिव शुद्धि प्रयोगशाला।'
  },
  {
    id: 'mod-shg-savings-ledger',
    type: 'module',
    title: 'सखी मंडल (SHG) महिला समूह बचत व ऋण बही-खाता',
    subtitle: 'साप्ताहिक बचत टिक, सदस्य ऋण शेष, कुल कोष सारांश व बोलती ऑडियो रिपोर्ट (ऑफ़लाइन)',
    targetTab: 'santali_shg_savings_ledger',
    icon: Users,
    category: 'Rural Livelihood',
    description: 'गाँव की स्वयं सहायता समूह (SHG) दीदियों की बैठक, बचत और ऋण का सरल डिजिटल रजिस्टर।'
  },
  {
    id: 'mod-maternal-child-health',
    type: 'module',
    title: 'मातृ-शिशु स्वास्थ्य, टीकाकरण व पोषण गाइड',
    subtitle: 'गर्भावस्था जांच, शिशु टीका टिक-लिस्ट व संताली देवनागरी + ओल चिकी पोषण सलाह',
    targetTab: 'santali_maternal_child_health',
    icon: HeartPulse,
    category: 'Health & Community',
    description: 'आँगनवाड़ी जांच, टीकों की समय-सारणी और माँ-शिशु पोषण की बोलती संताली गाइड।'
  },
  {
    id: 'mod-report-card-maker',
    type: 'module',
    title: 'विद्यालय संताली प्रगति-पत्र (Report Card) निर्माता',
    subtitle: 'संताली-हिन्दी-गणित अंक, स्वतः ग्रेड व टिप्पणी सहित प्रिंटेबल A4 व PNG कार्ड',
    targetTab: 'santali_report_card_maker',
    icon: Award,
    category: 'Teaching & Printables',
    description: 'विद्यालय व कोचिंग छात्रों के लिए द्वि-लिपि संताली रिपोर्ट कार्ड जनरेटर।'
  },
  {
    id: 'mod-literary-pioneers',
    type: 'module',
    title: 'संताली साहित्यकार, भाषा-सेनानी व ओल चिकी पुरोधा',
    subtitle: 'पंडित रघुनाथ मुर्मू, माझी रामदास टुडू, पॉल जुझार सोरेन व दमयंती बेसरा परिचय + क्विज़',
    targetTab: 'santali_literary_pioneers',
    icon: BookOpen,
    category: 'Literature & History',
    description: 'संताली भाषा और साहित्य के प्रमुख रचनाकारों की जीवनी, कृतियाँ व परीक्षा क्विज़।'
  },
  {
    id: 'mod-settings',
    type: 'module',
    title: 'Settings & Preferences',
    subtitle: 'Default script configuration, voice speech options, and app data',
    targetTab: 'settings',
    icon: Settings,
    category: 'System',
    description: 'Customize suite preferences, script selection, and offline caching.'
  }
];

// Helper to highlight matching text query with a warm amber mark
export function highlightMatch(text: string, query: string) {
  if (!query || !text) return text;
  const trimmed = query.trim();
  if (!trimmed) return text;

  try {
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === trimmed.toLowerCase() ? (
            <mark
              key={index}
              className="bg-amber-200 text-amber-950 font-bold px-1 rounded-sm shadow-2xs"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  } catch {
    return text;
  }
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSendToTranslator,
  onOpenAdmin
}) => {
  const { words } = useAdmin();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'words' | 'modules' | 'culture'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Voice Search Integration
  const {
    isListening,
    interimTranscript,
    lang: voiceLang,
    setLang: setVoiceLang,
    errorMessage: voiceError,
    clearError: clearVoiceError,
    toggleListening,
    stopListening
  } = useVoiceSearch({
    defaultLang: 'hi-IN',
    onResult: (transcriptText) => {
      setQuery(transcriptText);
      inputRef.current?.focus();
    }
  });

  // Focus input on open & stop listening when closed
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
      if (isListening) {
        stopListening();
      }
    }
  }, [isOpen, isListening, stopListening]);

  const deferredQuery = useDeferredValue(query);

  // Combined search dataset (skipped when closed; early-exit word loop for instant speed)
  const searchResults = useMemo(() => {
    if (!isOpen) return [];
    const q = deferredQuery.trim().toLowerCase();

    // 1. Filter Modules
    const matchedModules = APP_MODULES.filter((m) => {
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.subtitle.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q)
      );
    });

    // 2. Filter Culture
    const matchedCulture = CULTURAL_TOPICS.filter((c) => {
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.scriptDevanagari?.includes(q) ||
        c.category?.toLowerCase().includes(q)
      );
    });

    // 3. Filter Dictionary Words (early-exit at 50 results so 50,000+ words search in < 1ms)
    const matchedWords: SearchItem[] = [];
    if (q) {
      for (let i = 0; i < words.length && matchedWords.length < 50; i++) {
        const w = words[i];
        const hit =
          w.wordRoman.toLowerCase().includes(q) ||
          w.wordDevanagari.toLowerCase().includes(q) ||
          w.meaningEnglish.toLowerCase().includes(q) ||
          w.meaningHindi.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          (w.exampleSantali ? w.exampleSantali.toLowerCase().includes(q) : false);
        if (hit) {
          matchedWords.push({
            id: `word-${w.id}`,
            type: 'word' as const,
            title: w.wordRoman,
            subtitle: `${w.meaningEnglish} · ${w.meaningHindi}`,
            scriptDevanagari: w.wordDevanagari,
            category: w.category,
            targetTab: 'dashboard' as ActiveDesktopTab,
            wordData: w,
            description: w.exampleSantali || w.exampleEnglish || undefined
          });
        }
      }
    } else {
      const limit = Math.min(15, words.length);
      for (let i = 0; i < limit; i++) {
        const w = words[i];
        matchedWords.push({
          id: `word-${w.id}`,
          type: 'word' as const,
          title: w.wordRoman,
          subtitle: `${w.meaningEnglish} · ${w.meaningHindi}`,
          scriptDevanagari: w.wordDevanagari,
          category: w.category,
          targetTab: 'dashboard' as ActiveDesktopTab,
          wordData: w,
          description: w.exampleSantali || undefined
        });
      }
    }

    // Apply active filter
    if (activeFilter === 'modules') return matchedModules;
    if (activeFilter === 'culture') return matchedCulture;
    if (activeFilter === 'words') return matchedWords;
    return [...matchedModules, ...matchedCulture, ...matchedWords];
  }, [isOpen, deferredQuery, words, activeFilter]);

  // Keep selected index in range
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults.length, activeFilter]);

  // Handle Keyboard Navigation (ArrowUp, ArrowDown, Enter, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < searchResults.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : searchResults.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = searchResults[selectedIndex];
        if (item) {
          handleSelectItem(item);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex]);

  // Select Item handler
  const handleSelectItem = (item: SearchItem) => {
    if (item.id === 'mod-admin') {
      if (onOpenAdmin) onOpenAdmin();
      onClose();
      return;
    }

    if (item.targetTab) {
      onNavigateTab(item.targetTab);
    }
    onClose();
  };

  const handleSpeak = (text: string) => {
    speakWithFemaleVoice(text, { lang: 'hi-IN' });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input Bar */}
        <div className={`p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 transition-colors ${
          isListening
            ? 'bg-gradient-to-r from-rose-50 via-white to-amber-50/30'
            : 'bg-gradient-to-r from-amber-50/40 via-white to-white'
        }`}>
          <Search className={`w-5 h-5 shrink-0 transition-colors ${isListening ? 'text-rose-600' : 'text-amber-600'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isListening
                ? 'सुन रहे हैं... बोलिए (बोलें: "जोहार", "सारना", "मातकोम", "बापला")...'
                : `Search ${words.length.toLocaleString()}+ Santali words, Devanagari, culture... (Ctrl+K)`
            }
            className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 font-semibold text-base sm:text-lg focus:outline-none"
          />

          {/* Voice Search Button */}
          <button
            type="button"
            onClick={toggleListening}
            title={
              isListening
                ? 'वॉइस सर्च बंद करें (Stop Voice Search)'
                : 'बोलकर खोजें (Voice Search - हिंदी / संताली देवनागरी / English)'
            }
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-md ring-4 ring-rose-200'
                : 'text-amber-800 bg-amber-100/80 hover:bg-amber-200 hover:text-amber-900 border border-amber-300/50'
            }`}
          >
            <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce text-white' : 'text-amber-700'}`} />
            <span className="hidden sm:inline text-xs font-bold">
              {isListening ? 'सुन रहे हैं...' : 'वॉइस सर्च'}
            </span>
          </button>

          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
              <span>ESC</span>
            </div>
          )}
        </div>

        {/* Live Voice Search Bar (Listening / Interim transcript feedback) */}
        {isListening && (
          <div className="px-4 py-2 bg-gradient-to-r from-rose-50 via-rose-100/60 to-amber-50 border-b border-rose-200 flex flex-wrap items-center justify-between gap-2 text-xs text-rose-900 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
              </span>
              <span className="font-semibold text-rose-800">
                {interimTranscript ? (
                  <span className="italic font-bold text-rose-950">"{interimTranscript}"</span>
                ) : (
                  'माइक्रोफ़ोन चालू है... संताली या हिन्दी में बोलिए'
                )}
              </span>
            </div>

            {/* Language Switcher for Voice Search */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-500 font-medium">भाषा:</span>
              <button
                type="button"
                onClick={() => setVoiceLang('hi-IN')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  voiceLang === 'hi-IN'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-rose-200'
                }`}
              >
                🇮🇳 हिन्दी / संताली
              </button>
              <button
                type="button"
                onClick={() => setVoiceLang('en-IN')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  voiceLang === 'en-IN'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-rose-200'
                }`}
              >
                🔤 English / Roman
              </button>
              <button
                type="button"
                onClick={stopListening}
                className="ml-1 text-rose-700 hover:text-rose-900 font-bold px-1.5 py-0.5 rounded hover:bg-rose-200/60"
                title="Stop Listening"
              >
                बंद करें ✕
              </button>
            </div>
          </div>
        )}

        {/* Voice Error Banner */}
        {voiceError && (
          <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900 animate-in fade-in duration-150">
            <span className="flex items-center gap-1.5">
              <span>⚠️</span>
              <span>{voiceError}</span>
            </span>
            <button
              type="button"
              onClick={clearVoiceError}
              className="text-amber-800 hover:text-amber-950 font-bold px-1.5 py-0.5 rounded hover:bg-amber-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Results ({searchResults.length})
          </button>
          <button
            onClick={() => setActiveFilter('words')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'words'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            📖 Words &amp; Dictionary
          </button>
          <button
            onClick={() => setActiveFilter('modules')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'modules'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            ⚡ Features &amp; Tools
          </button>
          <button
            onClick={() => setActiveFilter('culture')}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'culture'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            🌿 Culture &amp; History
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-3 space-y-1.5 flex-1 min-h-[280px]">
          {searchResults.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">No matches found for "{query}"</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching by Roman spelling (e.g., <em>Johar</em>, <em>Dare</em>, <em>Sohrai</em>), English/Hindi meaning, or feature name.
              </p>
            </div>
          ) : (
            searchResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon || (item.type === 'word' ? BookOpen : Landmark);

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-300 shadow-xs ring-1 ring-amber-400/30'
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        item.type === 'word'
                          ? 'bg-amber-100 text-amber-800'
                          : item.type === 'culture'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {highlightMatch(item.title, query)}
                        </span>
                        {item.scriptDevanagari && (
                          <span className="text-xs sm:text-sm font-bold text-amber-950 bg-amber-100/90 px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-2xs">
                            {highlightMatch(item.scriptDevanagari, query)}
                          </span>
                        )}
                        {item.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            • {highlightMatch(item.category, query)}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        {highlightMatch(item.subtitle, query)}
                      </p>

                      {item.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                          {highlightMatch(item.description, query)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Action Shortcuts */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-1">
                    {item.wordData && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(item.wordData?.wordDevanagari || item.title);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 transition-colors cursor-pointer"
                        title="Listen Audio Pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="hidden sm:flex items-center text-xs font-bold text-slate-400">
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-md font-mono text-[10px]">
                          <span>ENTER</span>
                          <CornerDownLeft className="w-3 h-3" />
                        </span>
                      ) : (
                        <ArrowRight className="w-4 h-4 opacity-30" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 px-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-[10px]">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-[10px]">
                Enter
              </kbd>
              <span>to open</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-[10px]">
                ESC
              </kbd>
              <span>to close</span>
            </span>
          </div>

          <span className="hidden sm:inline font-semibold text-amber-800">
            Hor Katha Suite · Global Spotlight
          </span>
        </div>
      </div>
    </div>
  );
};
