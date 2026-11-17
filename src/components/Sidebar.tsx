import React, { useState, useMemo, useDeferredValue } from 'react';
import { ActiveDesktopTab } from '../types';
import { CulturalTree } from './CulturalTree';
import { useAdmin } from '../context/AdminContext';
import { SANTALI_KEYBOARD_URL } from '../utils/externalLinks';
import {
  Home,
  Keyboard as KeyboardIcon,
  LayoutDashboard,
  GraduationCap,
  Languages,
  Settings,
  Info,
  HelpCircle,
  PanelLeftClose,
  ShieldCheck,
  Flame,
  MessageSquareHeart,
  MessageSquare,
  Layers,
  Palette,
  Calendar,
  Gamepad2,
  Headphones,
  Volume2,
  Music,
  Users,
  Smile,
  Clock,
  Shield,
  TreePine,
  Mic,
  BookOpen,
  Landmark,
  Leaf,
  Sparkles,
  Globe,
  Heart,
  Swords,
  UtensilsCrossed,
  Target,
  Radio,
  Compass,
  Baby,
  Award,
  Quote,
  Sprout,
  Scale,
  Drama,
  Moon,
  Droplets,
  Scissors,
  Hammer,
  HeartHandshake,
  Trees,
  ShoppingBag,
  Activity,
  FileText,
  Bookmark,
  HeartPulse,
  Smartphone,
  ArrowRightLeft,
  Feather,
  PenTool,
  Trophy,
  Fish,
  Calculator,
  Coins,
  Scroll,
  Search,
  X,
  Shuffle,
  Grid3X3,
  MapPin,
  Newspaper,
  ListMusic,
  HardDrive,
  ClipboardList,
  QrCode,
  Sun,
  Bus,
  Star
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveDesktopTab;
  onTabChange: (tab: ActiveDesktopTab) => void;
  onOpenAbout: () => void;
  onOpenHelp: () => void;
  onOpenFeedback?: () => void;
  onToggleSidebar?: () => void;
  recentTabs?: ActiveDesktopTab[];
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({
  activeTab,
  onTabChange,
  onOpenAbout,
  onOpenHelp,
  onOpenFeedback,
  onToggleSidebar,
  recentTabs = []
}) => {
  const { isAdmin } = useAdmin();
  const [sidebarQuery, setSidebarQuery] = useState('');
  const deferredSidebarQuery = useDeferredValue(sidebarQuery);
  const [pinnedTabs, setPinnedTabs] = useState<ActiveDesktopTab[]>(() => {
    try {
      const saved = localStorage.getItem('hor_katha_pinned_tabs_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return ['keyboard', 'dashboard', 'learn', 'lunar_calendar'];
  });

  const togglePinTab = (e: React.MouseEvent, tabId: ActiveDesktopTab) => {
    e.stopPropagation();
    setPinnedTabs((prev) => {
      const next = prev.includes(tabId)
        ? prev.filter((id) => id !== tabId)
        : [tabId, ...prev].slice(0, 12);
      try {
        localStorage.setItem('hor_katha_pinned_tabs_v1', JSON.stringify(next));
      } catch {
        // ignore quota errors
      }
      return next;
    });
  };

  // Clean menu items (memoized once for zero per-render array allocation)
  const mainNav = useMemo(() => [
    { id: 'home' as ActiveDesktopTab, label: 'मुख्य पृष्ठ (Home)', icon: Home },
    { id: 'sereng_karaoke' as ActiveDesktopTab, label: 'सेरेंग कराओके व ताल अखाड़ा', icon: Music, badge: 'ताल' },
    { id: 'folk_radio' as ActiveDesktopTab, label: 'लोककथा रेडियो व एम्बिएंट', icon: Radio, badge: 'रेडियो' },
    { id: 'village_tour' as ActiveDesktopTab, label: 'संताल गांव का पवित्र मानचित्र', icon: Compass, badge: '3D' },
    { id: 'wild_foods' as ActiveDesktopTab, label: 'वन-साग व पोषण संदर्शिका', icon: Leaf, badge: 'पोषण' },
    { id: 'ethno_medicine' as ActiveDesktopTab, label: 'पारंपरिक वनौषधि व प्राथमिक उपचार', icon: HeartPulse, badge: 'उपचार' },
    { id: 'festival_cards' as ActiveDesktopTab, label: 'व्हाट्सऐप व पर्व ग्रीटिंग्स', icon: Sparkles, badge: 'शेयर' },
    { id: 'social_cards' as ActiveDesktopTab, label: 'सोशल मीडिया कार्ड व पोस्टर', icon: Sparkles, badge: 'HD' },
    { id: 'lunar_calendar' as ActiveDesktopTab, label: 'चंद्र पंचांग व पर्व टाइमर', icon: Moon, badge: 'लाइव' },
    { id: 'keyboard' as ActiveDesktopTab, label: 'संताली कीबोर्ड (Keyboard)', icon: KeyboardIcon },
    { id: 'dashboard' as ActiveDesktopTab, label: '50,000+ डिक्शनरी (शब्दकोश)', icon: LayoutDashboard },
    { id: 'learn' as ActiveDesktopTab, label: 'संताली देवनागरी सीखें', icon: GraduationCap },
    { id: 'favorites_notebook' as ActiveDesktopTab, label: 'इञाक् साकाम (मेरी डायरी)', icon: Bookmark, badge: '⭐' },
    { id: 'script_converter' as ActiveDesktopTab, label: 'त्रि-लिपि कनवर्टर (3-Script)', icon: ArrowRightLeft, badge: 'कनवर्टर' },
    { id: 'kids_soundboard' as ActiveDesktopTab, label: 'सचित्र बाल-साउंडबोर्ड', icon: Smile, badge: 'बच्चों का' },
    { id: 'wallpaper_studio' as ActiveDesktopTab, label: 'मोबाइल वॉलपेपर व स्टेटस', icon: Smartphone, badge: '9:16' },
    { id: 'clan_genealogy' as ActiveDesktopTab, label: 'पारिस व वंशावली डायरी', icon: Shield, badge: 'धरोहर' },
    { id: 'haat_barter' as ActiveDesktopTab, label: 'हाट व वस्तु-विनिमय बाज़ार', icon: Scale, badge: 'हाट' },
    { id: 'bapla_chants' as ActiveDesktopTab, label: 'विवाह (बापला) गीत व नेग', icon: Heart, badge: 'बापला' },
    { id: 'bird_lore' as ActiveDesktopTab, label: 'पक्षी दर्शन व बोली (चेँड़े चिन्हा)', icon: Feather, badge: 'ध्वनि' },
    { id: 'godna_body_art' as ActiveDesktopTab, label: 'सिका दागा व गोदना स्टूडियो', icon: Sparkles, badge: 'देह-कला' },
    { id: 'heirloom_seeds' as ActiveDesktopTab, label: 'देशज धान व बंधी बीज बैंक', icon: Sprout, badge: 'बीज' },
    { id: 'kinship_etiquette' as ActiveDesktopTab, label: 'डोबोक जोहार व शिष्टाचार', icon: Users, badge: 'मर्यादा' },
    { id: 'instruments_orchestra' as ActiveDesktopTab, label: '५ वाद्ययंत्र ऑर्केस्ट्रा व लूपर', icon: Music, badge: 'लूपर' },
    { id: 'bone_setting_healing' as ActiveDesktopTab, label: 'हातु कविराज व हड्डी संधान', icon: HeartPulse, badge: 'आयुर्वेद' },
    { id: 'lo_bir_court' as ActiveDesktopTab, label: 'लो बीर बैसी सर्वोच्च जन-अदालत', icon: Scale, badge: 'न्याय' },
    { id: 'calligraphy_workbook' as ActiveDesktopTab, label: 'ओल चिकी सुलेखन अभ्यास पुस्तिका', icon: PenTool, badge: 'सुलेखन' },
    { id: 'handi_fermentation_lore' as ActiveDesktopTab, label: 'हांडिया व रानू किण्वन विज्ञान', icon: Droplets, badge: 'किण्वन' },
    { id: 'ipil_astronomy' as ActiveDesktopTab, label: 'इपिल: नक्षत्र व खगोल दर्शन', icon: Moon, badge: 'इपिल' },
    { id: 'nahel_dhenki_craft' as ActiveDesktopTab, label: 'नाहेल (हल) व ढेंकी काष्ठ-शिल्प', icon: Trees, badge: 'काष्ठ' },
    { id: 'indigenous_sports_kati' as ActiveDesktopTab, label: 'काटी एनेच व पारंपरिक खेल', icon: Trophy, badge: 'खेल' },
    { id: 'traditional_fishing_craft' as ActiveDesktopTab, label: 'हाकू सांदरा व मत्स्य जाल शिल्प', icon: Fish, badge: 'जाल' },
    { id: 'natural_pigments_craft' as ActiveDesktopTab, label: 'सोहराय माटी रसायन व प्राकृतिक रंग', icon: Palette, badge: 'रंग' },
    { id: 'banam_tamak_luthier' as ActiveDesktopTab, label: 'बानाम व तामाक ल्युथियर शिल्प', icon: Hammer, badge: 'वाद्य' },
    { id: 'jaher_sacred_grove_ecology' as ActiveDesktopTab, label: 'जाहेर थान पवित्र वन पारिस्थितिकी', icon: TreePine, badge: 'उपवन' },
    { id: 'customary_oaths_justice' as ActiveDesktopTab, label: 'किरिया व जोम जाति न्याय विधान', icon: Scale, badge: 'न्याय' },
    { id: 'sasandiri_megalithic_lore' as ActiveDesktopTab, label: 'सासानदीरी व महापाषाण प्रस्तर', icon: Landmark, badge: 'पाषाण' },
    { id: 'indigenous_math_geometry' as ActiveDesktopTab, label: 'गांठी लेखा, इसी गणित व ज्यामिति', icon: Calculator, badge: 'गणित' },
    { id: 'wild_honey_harvesting' as ActiveDesktopTab, label: 'तेरोम व लुती वन-शहद संचयन', icon: Droplets, badge: 'शहद' },
    { id: 'animal_behavior_omens' as ActiveDesktopTab, label: 'जीव-जन्तु साड़े व लोक-शकुन विद्या', icon: Radio, badge: 'शकुन' },
    { id: 'indigenous_textile_dyes' as ActiveDesktopTab, label: 'पांची-पारहाड़ रंगाई व ब्लॉक प्रिंट', icon: Scissors, badge: 'रंगाई' },
    { id: 'indigenous_midwifery_care' as ActiveDesktopTab, label: 'दाया बुढ़ी प्रसूति व शिशु रक्षा', icon: Baby, badge: 'प्रसूति' },
    { id: 'universal_text_reader' as ActiveDesktopTab, label: 'सर्व-पाठ वाचक (Text Reader)', icon: FileText, badge: 'वाचक' },
    { id: 'karam_binti_epic_reader' as ActiveDesktopTab, label: 'करम बिनती महाकाव्य (Karam Binti)', icon: Scroll, badge: 'महाकाव्य' },
    { id: 'epigraphy_numismatics_lore' as ActiveDesktopTab, label: 'गढ़ प्रस्तर मुहर व मुद्रा ज्ञान', icon: Coins, badge: 'मुद्रा' },
    { id: 'illustrated_comics_reader' as ActiveDesktopTab, label: 'सचित्र संताली कॉमिक्स वाचक', icon: BookOpen, badge: 'कॉमिक्स' },
    { id: 'santali_verb_conjugator' as ActiveDesktopTab, label: 'रोनौड़ क्रिया-काल लैब (Verb Lab)', icon: Languages, badge: 'व्याकरण' },
    { id: 'pera_hor_literature' as ActiveDesktopTab, label: 'पेड़ा होड़ (१८९०) व क्लासिक साहित्य', icon: FileText, badge: 'साहित्य' },
    { id: 'sagar_bullock_cart' as ActiveDesktopTab, label: 'साग़ोड़ (बैलगाड़ी) निर्माण अभियांत्रिकी', icon: Compass, badge: 'परिवहन' },
    { id: 'terracotta_pottery_lore' as ActiveDesktopTab, label: 'कुम्हार मृदा कला व भट्ठा विज्ञान', icon: Flame, badge: 'मृदा' },
    { id: 'babui_rope_mat_craft' as ActiveDesktopTab, label: 'बाबुई रस्सी, पाटिया व घोंघू शिल्प', icon: Sprout, badge: 'तंतु' },
    { id: 'livestock_ethno_vet' as ActiveDesktopTab, label: 'गोरु-डांगरा पालन व पशु वनौषधि', icon: HeartPulse, badge: 'पशु' },
    { id: 'muhurat_almanac_checker' as ActiveDesktopTab, label: 'शुभ-अशुभ मुहूर्त व कृषि पंचांग', icon: Moon, badge: 'मुहूर्त' },
    { id: 'spt_pesa_rights_guide' as ActiveDesktopTab, label: 'SPT एक्ट, PESA व ग्राम सभा अधिकार', icon: Scale, badge: 'अधिकार' },
    { id: 'santali_dialects_comparative' as ActiveDesktopTab, label: 'उत्तर-दक्षिण-बंगाल बोली तुलना', icon: Globe, badge: 'बोली' },
    { id: 'santali_anchoring_speeches' as ActiveDesktopTab, label: 'मंच संचालन व अतिथि जोहार भाषण', icon: Mic, badge: 'भाषण' },
    { id: 'tasar_silk_sericulture' as ActiveDesktopTab, label: 'तसर (कोसा) रेशम कीट पालन', icon: Sprout, badge: 'रेशम' },
    { id: 'mahua_oil_press_kolhu' as ActiveDesktopTab, label: 'कुइंडी-करंज कोल्हू तेल पेराई', icon: Droplets, badge: 'तेल' },
    { id: 'sun_dried_forest_preservation' as ActiveDesktopTab, label: 'हेंडवा व मानसून खाद्य संरक्षण', icon: Leaf, badge: 'भंडारण' },
    { id: 'donga_boat_river_lore' as ActiveDesktopTab, label: 'ताड़-डोंगा नौका व नदी मल्लाह', icon: Compass, badge: 'नौका' },
    { id: 'aher_pyne_water_governance' as ActiveDesktopTab, label: 'आहर-पइन सिंचाई व पाड़ी न्याय', icon: Droplets, badge: 'सिंचाई' },
    { id: 'bir_sengel_fire_ecology' as ActiveDesktopTab, label: 'बीर सेंगोल वन-अग्नि रक्षा विज्ञान', icon: Flame, badge: 'रक्षा' },
    { id: 'santali_typing_speed' as ActiveDesktopTab, label: 'संताली टाइपिंग स्पीड टेस्ट', icon: KeyboardIcon, badge: 'WPM' },
    { id: 'santali_pahada_tables' as ActiveDesktopTab, label: 'संताली पहाड़ा (Tables 1-10)', icon: Calculator, badge: '1-10' },
    { id: 'learning_streak_tracker' as ActiveDesktopTab, label: 'दैनिक अभ्यास स्ट्रीक ट्रैकर', icon: Flame, badge: 'लक्ष्य' },
    { id: 'word_pinboard_notes' as ActiveDesktopTab, label: 'शब्द पिनबोर्ड (Sticky Notes)', icon: Bookmark, badge: 'नोट्स' },
    { id: 'santali_exam_prep_jpsc' as ActiveDesktopTab, label: 'India + Jharkhand परीक्षा 2026', icon: GraduationCap, badge: '2026' },
    { id: 'santali_dictation_lab' as ActiveDesktopTab, label: 'श्रुतलेख व वर्तनी लैब', icon: Headphones, badge: 'श्रुतलेख' },
    { id: 'santali_word_match_game' as ActiveDesktopTab, label: 'तेज़ शब्द-मिलान खेल', icon: Gamepad2, badge: 'खेल' },
    { id: 'santali_medical_translator' as ActiveDesktopTab, label: 'अस्पताल व स्वास्थ्य संवाद', icon: HeartPulse, badge: 'स्वास्थ्य' },
    { id: 'gram_sabha_form_drafter' as ActiveDesktopTab, label: 'ग्राम सभा प्रस्ताव ड्राफ़्टर', icon: FileText, badge: 'प्रस्ताव' },
    { id: 'santali_news_bulletin_studio' as ActiveDesktopTab, label: 'समाचार टेलीप्रॉम्प्टर स्टूडियो', icon: Radio, badge: 'समाचार' },
    { id: 'data_backup_manager' as ActiveDesktopTab, label: 'डेटा बैकअप व रिस्टोर', icon: Shield, badge: 'बैकअप' },
    { id: 'santali_tala_metronome' as ActiveDesktopTab, label: 'पारंपरिक ताल व मेट्रोनोम', icon: Music, badge: 'ताल' },
    { id: 'santali_instrument_tuner' as ActiveDesktopTab, label: 'बानाम व तिरिओ सुर ट्यूनर', icon: Radio, badge: 'सुर' },
    { id: 'santali_land_topography' as ActiveDesktopTab, label: 'भूमि व खेत स्थलाकृति संदर्शिका', icon: Compass, badge: 'भूमि' },
    { id: 'santali_micro_journal' as ActiveDesktopTab, label: 'दैनिक संताली डायरी व चिंतन', icon: Bookmark, badge: 'डायरी' },
    { id: 'santali_wit_riddles_arena' as ActiveDesktopTab, label: 'कुदुम पहेली व लन्दा काथा', icon: Smile, badge: 'हास्य' },
    { id: 'dance_akhda_formations' as ActiveDesktopTab, label: 'नृत्य मुद्रा व अखड़ा गाइड', icon: Users, badge: 'नृत्य' },
    { id: 'santali_grammar_checker' as ActiveDesktopTab, label: 'संताली व्याकरण व प्रत्यय परीक्षक', icon: Sparkles, badge: 'व्याकरण' },
    { id: 'santali_crossword_puzzle' as ActiveDesktopTab, label: 'संताली शब्द-पहेली (Crossword)', icon: Gamepad2, badge: 'पहेली' },
    { id: 'wildlife_flora_quiz' as ActiveDesktopTab, label: 'वन्यजीव व जड़ी-बूटी पहचान क्विज़', icon: Trees, badge: 'प्रकृति' },
    { id: 'invitation_certificate_maker' as ActiveDesktopTab, label: 'निमंत्रण कार्ड व प्रमाण-पत्र स्टूडियो', icon: Award, badge: 'कार्ड' },
    { id: 'sentence_scramble_builder' as ActiveDesktopTab, label: 'वाक्य-निर्माण पहेली (Sentence Scramble)', icon: Shuffle, badge: 'वाक्य' },
    { id: 'poetry_sereng_studio' as ActiveDesktopTab, label: 'सेरेंग व तुकबंदी काव्य स्टूडियो', icon: Feather, badge: 'काव्य' },
    { id: 'pocket_study_booklet' as ActiveDesktopTab, label: 'पॉकेट अध्ययन पुस्तिका निर्माता', icon: BookOpen, badge: 'प्रिंट' },
    { id: 'clan_kinship_checker' as ActiveDesktopTab, label: 'पारिस व गोत्र मर्यादा परीक्षक', icon: Shield, badge: 'पारिस' },
    { id: 'civic_bank_dialogue_kit' as ActiveDesktopTab, label: 'बैंक, डाकघर व प्रखंड संवाद किट', icon: Landmark, badge: 'संवाद' },
    { id: 'haat_festival_planner' as ActiveDesktopTab, label: 'हाट व पर्व सामग्री प्लानर', icon: ShoppingBag, badge: 'बजट' },
    { id: 'santali_word_search_puzzle' as ActiveDesktopTab, label: 'संताली शब्द-जाल खोज (Word Search)', icon: Grid3X3, badge: 'पहेली' },
    { id: 'audio_memory_flip_game' as ActiveDesktopTab, label: 'ऑडियो मेमोरी फ्लिप गेम', icon: Headphones, badge: 'ध्वनि' },
    { id: 'village_layout_landmark_map' as ActiveDesktopTab, label: 'संताल गाँव का मानचित्र व स्थल', icon: MapPin, badge: 'नक्शा' },
    { id: 'daily_current_affairs' as ActiveDesktopTab, label: 'दैनिक करेंट अफेयर्स 2026 व क्विज़', icon: Newspaper, badge: 'CA 2026' },
    { id: 'native_voice_recorder' as ActiveDesktopTab, label: 'मातृभाषी स्वर रिकॉर्डर (Voice Bank)', icon: Mic, badge: 'ऑफ़लाइन' },
    { id: 'two_player_battle' as ActiveDesktopTab, label: '2-प्लेयर क्विज़ बैटल (1v1 अखाड़ा)', icon: Swords, badge: '1v1' },
    { id: 'smart_srs_coach' as ActiveDesktopTab, label: 'स्मार्ट रिवीजन कोच (SRS)', icon: Target, badge: '15 शब्द' },
    { id: 'document_book_reader' as ActiveDesktopTab, label: 'दस्तावेज़ व PDF बुक रीडर', icon: FileText, badge: 'PDF' },
    { id: 'community_voice_events' as ActiveDesktopTab, label: 'समुदाय बोली व ग्राम पर्व बोर्ड', icon: Users, badge: 'समुदाय' },
    { id: 'santhal_belt_atlas' as ActiveDesktopTab, label: 'संताल बेल्ट सांस्कृतिक एटलस', icon: Compass, badge: 'एटलस' },
    { id: 'roleplay_conversation' as ActiveDesktopTab, label: 'संताली संवाद सिमुलेटर (Role-Play)', icon: MessageSquare, badge: 'संवाद' },
    { id: 'family_tree_builder' as ActiveDesktopTab, label: 'पारिवारिक वंशावली वृक्ष निर्माता', icon: TreePine, badge: 'वंशावली' },
    { id: 'teacher_worksheet_maker' as ActiveDesktopTab, label: 'शिक्षक व अभिभावक वर्कशीट जनरेटर', icon: ClipboardList, badge: 'टेस्ट' },
    { id: 'chhatiar_name_studio' as ActiveDesktopTab, label: 'जनम छठियार व बेबी-नेम कार्ड', icon: Baby, badge: 'नामकरण' },
    { id: 'audio_playlist_player' as ActiveDesktopTab, label: 'निरंतर सेरेञ प्लेलिस्ट व स्लीप टाइमर', icon: ListMusic, badge: 'प्लेलिस्ट' },
    { id: 'community_hall_of_fame' as ActiveDesktopTab, label: 'सामुदायिक योगदान सम्मान बोर्ड', icon: Award, badge: 'सम्मान' },
    { id: 'offline_pack_manager' as ActiveDesktopTab, label: 'ऑफ़लाइन पैक व स्टोरेज वेरिफ़ायर', icon: HardDrive, badge: 'ऑफ़लाइन' },
    { id: 'smart_essay_writer' as ActiveDesktopTab, label: 'स्मार्ट संताली लेखन व निबंध संपादक', icon: FileText, badge: 'लेखन' },
    { id: 'emergency_voice_cards' as ActiveDesktopTab, label: 'आपातकालीन व यात्रा वॉइस-SOS कार्ड', icon: HeartPulse, badge: 'SOS' },
    { id: 'weekly_bulletin_maker' as ActiveDesktopTab, label: 'ग्राम व विद्यालय साप्ताहिक बुलेटिन', icon: Newspaper, badge: 'अख़बार' },
    { id: 'kids_storybook_maker' as ActiveDesktopTab, label: 'सचित्र बाल-कहानी पुस्तक निर्माता', icon: BookOpen, badge: 'कहानी' },
    { id: 'tense_suffix_drill' as ActiveDesktopTab, label: 'संताली वाक्य-प्रत्यय व काल ड्रिल लैब', icon: Flame, badge: 'अभ्यास' },
    { id: 'krishi_crop_ledger' as ActiveDesktopTab, label: 'कृषि, वनोपज व हाट हिसाब डायरी', icon: Sprout, badge: 'हिसाब' },
    { id: 'qr_word_cards' as ActiveDesktopTab, label: 'कक्षा व दीवार QR शब्द फ़्लैशकार्ड', icon: QrCode, badge: 'QR' },
    { id: 'santali_pronoun_case_lab' as ActiveDesktopTab, label: 'सर्वनाम, द्विवचन व कारक प्रयोगशाला', icon: Layers, badge: 'व्याकरण' },
    { id: 'santali_bazaar_price_calc' as ActiveDesktopTab, label: 'हाट-बाज़ार दुकान व बोलती रसीद', icon: Calculator, badge: 'रसीद' },
    { id: 'santali_school_prayer_assembly' as ActiveDesktopTab, label: 'विद्यालय प्रार्थना सभा व प्रतिज्ञा', icon: Sun, badge: 'स्कूल' },
    { id: 'santali_panchayat_scheme_guide' as ActiveDesktopTab, label: 'सरकारी योजना व छात्रवृत्ति गाइड', icon: Landmark, badge: 'योजना' },
    { id: 'santali_bus_rail_helpline' as ActiveDesktopTab, label: 'यात्रा, बस-रेल व कचहरी संवाद कार्ड', icon: Bus, badge: 'यात्रा' },
    { id: 'santali_audio_listening_test' as ActiveDesktopTab, label: 'संताली श्रवण बोध (सुनकर समझें) परीक्षा', icon: Headphones, badge: 'ऑडियो' },
    { id: 'santali_song_lyric_builder' as ActiveDesktopTab, label: 'सोहराय-बाहा लोकगीत व दोहा रचनाकार', icon: Music, badge: 'सेरेञ' },
    { id: 'santali_jora_katha_lab' as ActiveDesktopTab, label: 'जोड़ा काथा, विलोम व पर्यायवाची लैब', icon: Sparkles, badge: 'शब्द' },
    { id: 'santali_question_negation_lab' as ActiveDesktopTab, label: 'प्रश्न-वाचक व नकारात्मक वाक्य लैब', icon: HelpCircle, badge: 'वाक्य' },
    { id: 'santali_spell_fix_lab' as ActiveDesktopTab, label: 'संताली वर्तनी व रुद्ध-ध्वनि सुधार लैब', icon: PenTool, badge: 'शुद्धि' },
    { id: 'santali_shg_savings_ledger' as ActiveDesktopTab, label: 'सखी मंडल (SHG) बचत व ऋण बही-खाता', icon: Users, badge: 'SHG' },
    { id: 'santali_maternal_child_health' as ActiveDesktopTab, label: 'मातृ-शिशु स्वास्थ्य, टीका व पोषण गाइड', icon: HeartPulse, badge: 'स्वास्थ्य' },
    { id: 'santali_report_card_maker' as ActiveDesktopTab, label: 'स्कूल प्रगति-पत्र (Report Card) निर्माता', icon: Award, badge: 'प्रिंट' },
    { id: 'santali_literary_pioneers' as ActiveDesktopTab, label: 'संताली साहित्यकार व ओल चिकी पुरोधा', icon: BookOpen, badge: 'साहित्य' },
  ], []);

  const culturalNav = useMemo(() => [
    { id: 'creation' as ActiveDesktopTab, label: 'धरती की सृष्टि (सिरजोन)', icon: Globe, badge: 'सृष्टि' },
    { id: 'dances' as ActiveDesktopTab, label: 'पारंपरिक शीर्ष १० नृत्य (एनेच)', icon: Music, badge: 'नृत्य' },
    { id: 'bonga_buru' as ActiveDesktopTab, label: 'पूजा-पाठ बोंगा-बुरु (१५)', icon: Flame, badge: 'पवित्र' },
    { id: 'hul_heroes' as ActiveDesktopTab, label: 'संथाल हुल १८५५ (महापुरुष)', icon: Swords, badge: 'हुल' },
    { id: 'marriage_bapla' as ActiveDesktopTab, label: 'विवाह संस्कार (बापला ८)', icon: Heart, badge: 'बापला' },
    { id: 'attire_ornaments' as ActiveDesktopTab, label: 'पारंपरिक वस्त्र व आभूषण', icon: Sparkles, badge: 'वस्त्र' },
    { id: 'cuisine' as ActiveDesktopTab, label: 'खान-पान व व्यंजन (जिल पीठा)', icon: UtensilsCrossed, badge: 'स्वाद' },
    { id: 'sports_sendra' as ActiveDesktopTab, label: 'पारंपरिक खेल व शिकार (सेंन्दरा)', icon: Target, badge: 'खेल' },
    { id: 'folk_songs' as ActiveDesktopTab, label: 'लोकगीत एवं सेरेञ आर्काइव', icon: Radio, badge: 'गीत' },
    { id: 'sohrai_art' as ActiveDesktopTab, label: 'सोहराय व खोवर भित्तिचित्र कला', icon: Palette, badge: 'कला' },
    { id: 'proverbs_bhenta' as ActiveDesktopTab, label: 'भेंता काथा एवं लोकोक्तियाँ', icon: Quote, badge: 'काथा' },
    { id: 'agri_seasons' as ActiveDesktopTab, label: 'पारंपरिक कृषि व ऋतु-चक्र', icon: Sprout, badge: 'कृषि' },
    { id: 'traditional_measures' as ActiveDesktopTab, label: 'पारंपरिक नाप-तौल व हाट', icon: Scale, badge: 'नाप' },
    { id: 'architecture' as ActiveDesktopTab, label: 'पारंपरिक वास्तु व ओड़ाक् विन्यास', icon: Home, badge: 'वास्तु' },
    { id: 'historical_garhs' as ActiveDesktopTab, label: 'ऐतिहासिक प्रवास व १२ गढ़', icon: Compass, badge: 'गढ़' },
    { id: 'puppetry_theater' as ActiveDesktopTab, label: 'चादर बदनी कठपुतली व नाटक', icon: Drama, badge: 'नाट्य' },
    { id: 'astronomy_lore' as ActiveDesktopTab, label: 'खगोल-विज्ञान व आकाश-ज्ञान', icon: Moon, badge: 'इपिल' },
    { id: 'sendra_lobir' as ActiveDesktopTab, label: 'बीर-सेंदरा व लोबीर बैसी विधान', icon: TreePine, badge: 'लोबीर' },
    { id: 'dhokra_art' as ActiveDesktopTab, label: 'धोकरा धातु-कला व कमार विरासत', icon: Hammer, badge: 'धोकरा' },
    { id: 'water_harvesting' as ActiveDesktopTab, label: 'डाड़ी-पुखुरी व ढलान जल-विज्ञान', icon: Droplets, badge: 'जल' },
    { id: 'handloom_weaving' as ActiveDesktopTab, label: 'पंछी-पारहाड़ व वनस्पति रंगाई', icon: Scissors, badge: 'वस्त्र' },
    { id: 'livestock_khuntau' as ActiveDesktopTab, label: 'खूंटाव परंपरा, गोड़ा व गौ-रान', icon: HeartHandshake, badge: 'खूंटाव' },
    { id: 'woodcraft_carpentry' as ActiveDesktopTab, label: 'ढेंकी, नाहेल व काठ-शिल्प', icon: Trees, badge: 'काष्ठ' },
    { id: 'bamboo_craft' as ActiveDesktopTab, label: 'हाताक\' (सूप), कुमुनी व बांस-शिल्प', icon: ShoppingBag, badge: 'बांस' },
    { id: 'baby_names' as ActiveDesktopTab, label: 'पारंपरिक नामकरण गाइड (200+)', icon: Baby, badge: 'नाम' },
    { id: 'ornaments_jewellery' as ActiveDesktopTab, label: 'पारंपरिक आभूषण व शृंगार (12)', icon: Sparkles, badge: 'आभूषण' },
    { id: 'blacksmithy_iron' as ActiveDesktopTab, label: 'कामार लोहार शिल्प व औजार', icon: Hammer, badge: 'लोहा' },
    { id: 'seasons_weather' as ActiveDesktopTab, label: '६ ऋतुएँ व मौसम पूर्वानुमान', icon: Sprout, badge: 'ऋतु' },
    { id: 'herbal_drinks' as ActiveDesktopTab, label: 'पारंपरिक पेय व रान दाक् (8)', icon: Leaf, badge: 'पेय' },
    { id: 'pilgrimage' as ActiveDesktopTab, label: 'तीर्थ स्थल (लुगुबुरु व भोगनाडीह)', icon: Compass, badge: 'तीर्थ' },
    { id: 'life_rites' as ActiveDesktopTab, label: 'जीवन-संस्कार (छठियार-भांडान)', icon: Baby, badge: 'संस्कार' },
    { id: 'calendar' as ActiveDesktopTab, label: 'सांस्कृतिक पर्व (पर्व पंचांग)', icon: Calendar, badge: 'पर्व' },
    { id: 'governance' as ActiveDesktopTab, label: 'मांझी परगना स्वशासन', icon: Landmark, badge: 'नया' },
    { id: 'herbal' as ActiveDesktopTab, label: 'पारंपरिक वन-औषधियां (रान)', icon: Leaf, badge: 'ज्ञान' },
    { id: 'kudum' as ActiveDesktopTab, label: 'कुदुम (पहेलियां) व मुहावरे', icon: HelpCircle },
    { id: 'traditional_cuisine' as ActiveDesktopTab, label: 'पारंपरिक व्यंजन (साकाम पीठा)', icon: UtensilsCrossed, badge: 'पाककला' },
    { id: 'marriage_rituals' as ActiveDesktopTab, label: '७ विवाह व ३ जीवन संस्कार', icon: HeartHandshake, badge: 'संस्कार' },
    { id: 'riddles_kudum' as ActiveDesktopTab, label: 'कुदुम पहेली खेल (Kudum)', icon: HelpCircle, badge: 'पहेली' },
    { id: 'sacred_pilgrimages' as ActiveDesktopTab, label: 'पावन तीर्थ व ऐतिहासिक गढ़', icon: Compass, badge: 'तीर्थ' },
    { id: 'spoken_dialogues' as ActiveDesktopTab, label: 'दैनिक बोलचाल संवाद (हाट-बाजार)', icon: MessageSquare, badge: 'संवाद' },
    { id: 'letter_templates' as ActiveDesktopTab, label: 'औपचारिक पत्र व नेवता साकाम', icon: FileText, badge: 'पत्र' },
    { id: 'illustrated_stories' as ActiveDesktopTab, label: 'सचित्र लोककथाएं (पिलचु हाड़ाम)', icon: BookOpen, badge: 'कथा' },
    { id: 'clans' as ActiveDesktopTab, label: '12 पवित्र पारिस व गोत्र', icon: Shield },
    { id: 'family_tree' as ActiveDesktopTab, label: 'नाते-रिश्तेदार (Kinship)', icon: Users },
    { id: 'flora_worksheets' as ActiveDesktopTab, label: 'पवित्र वनस्पति व कार्यपत्रक', icon: TreePine },
  ], []);

  const learningNav = useMemo(() => [
    { id: 'certification' as ActiveDesktopTab, label: 'भाषा परीक्षा व प्रमाणपत्र', icon: Award, badge: 'प्रमाणपत्र' },
    { id: 'phonetics_lab' as ActiveDesktopTab, label: '४ रुद्ध कंठ ध्वनियां (Phonetics)', icon: Activity, badge: 'रुद्ध ध्वनि' },
    { id: 'grammar' as ActiveDesktopTab, label: 'संताली व्याकरण (रोनौड़)', icon: BookOpen, badge: 'नया' },
    { id: 'greetings' as ActiveDesktopTab, label: 'पावन पर्व ई-कार्ड (बधाई)', icon: Sparkles, badge: 'कार्ड' },
    { id: 'phrasebook' as ActiveDesktopTab, label: 'दैनिक बोलचाल (Phrasebook)', icon: MessageSquare },
    { id: 'speech_coach' as ActiveDesktopTab, label: 'उच्चारण प्रशिक्षक (Coach)', icon: Mic },
    { id: 'speaker' as ActiveDesktopTab, label: 'आवाज वाचक (Voice Reader)', icon: Volume2 },
    { id: 'kids_rhymes' as ActiveDesktopTab, label: 'बालगीत जुगलबंदी (Kids)', icon: Smile },
    { id: 'clock_numbers' as ActiveDesktopTab, label: 'बोलती घड़ी व 1-100 अंक', icon: Clock },
    { id: 'flashcards' as ActiveDesktopTab, label: 'शब्दावली फ़्लैशकार्ड्स', icon: Layers },
    { id: 'daily_quiz' as ActiveDesktopTab, label: 'दैनिक प्रश्नोत्तरी (Quiz)', icon: Flame },
    { id: 'instruments' as ActiveDesktopTab, label: 'पारंपरिक वाद्ययंत्र (धुन)', icon: Music },
    { id: 'calligraphy' as ActiveDesktopTab, label: 'देवनागरी सुलेखन व पोस्टर', icon: Palette },
    { id: 'wordle' as ActiveDesktopTab, label: 'वर्डले खेल (Wordle Game)', icon: Gamepad2 },
    { id: 'idioms_menkatha' as ActiveDesktopTab, label: 'संताली मुहावरे (मेनकाथा)', icon: Quote, badge: 'मुहावरा' },
    { id: 'archery_simulator' as ActiveDesktopTab, label: 'आक-सार धनुर्विद्या सिमुलेटर', icon: Target, badge: 'तीरंदाजी' },
    { id: 'translator' as ActiveDesktopTab, label: 'संताली अनुवादक (Translator)', icon: Languages },
  ], []);

  const normalizedQuery = deferredSidebarQuery.trim().toLowerCase();

  const filteredMainNav = useMemo(() => {
    if (!normalizedQuery) return mainNav;
    return mainNav.filter(
      (item) =>
        item.label.toLowerCase().includes(normalizedQuery) ||
        (item.badge && item.badge.toLowerCase().includes(normalizedQuery)) ||
        item.id.toLowerCase().includes(normalizedQuery)
    );
  }, [mainNav, normalizedQuery]);

  const filteredCulturalNav = useMemo(() => {
    if (!normalizedQuery) return culturalNav;
    return culturalNav.filter(
      (item) =>
        item.label.toLowerCase().includes(normalizedQuery) ||
        (item.badge && item.badge.toLowerCase().includes(normalizedQuery)) ||
        item.id.toLowerCase().includes(normalizedQuery)
    );
  }, [culturalNav, normalizedQuery]);

  const filteredLearningNav = useMemo(() => {
    if (!normalizedQuery) return learningNav;
    return learningNav.filter(
      (item) =>
        item.label.toLowerCase().includes(normalizedQuery) ||
        (item.badge && item.badge.toLowerCase().includes(normalizedQuery)) ||
        item.id.toLowerCase().includes(normalizedQuery)
    );
  }, [learningNav, normalizedQuery]);

  const recentItems = useMemo(() => {
    if (!recentTabs || recentTabs.length === 0) return [];
    const allItems = [...mainNav, ...culturalNav, ...learningNav];
    return recentTabs
      .map((tabId) => allItems.find((item) => item.id === tabId))
      .filter((item): item is (typeof allItems)[number] => Boolean(item));
  }, [recentTabs, mainNav, culturalNav, learningNav]);

  const pinnedItems = useMemo(() => {
    if (!pinnedTabs || pinnedTabs.length === 0) return [];
    const allItems = [...mainNav, ...culturalNav, ...learningNav];
    return pinnedTabs
      .map((tabId) => allItems.find((item) => item.id === tabId))
      .filter((item): item is (typeof allItems)[number] => Boolean(item));
  }, [pinnedTabs, mainNav, culturalNav, learningNav]);

  return (
    <aside data-edit-region="global_sidebar" className="w-64 bg-white border-r border-slate-200/90 flex flex-col shrink-0 h-[calc(100vh-100px)] sticky top-[100px] select-none shadow-xs transition-all duration-200 z-20 print:hidden">
      {/* Top Header - Sticky Header Area */}
      <div className="p-3 border-b border-slate-100 shrink-0 space-y-2 bg-slate-50/70 z-10">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-300/60 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="/assets/aistudio/bosc-main-logo_39d98de6.png"
                alt="BOSC"
                className="w-full h-full object-contain p-0.5 drop-shadow-xs"
              />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 leading-tight">Hor Katha Suite</h2>
              <p className="text-[10px] text-amber-800 font-bold">संताली देवनागरी मंच</p>
            </div>
          </div>

          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              title="मेनू छुपाएं (Hide Menu)"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Instant Sidebar Quick-Filter Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={sidebarQuery}
            onChange={(e) => setSidebarQuery(e.target.value)}
            placeholder="मेनू में तुरंत खोजें (Filter 168)..."
            className="w-full pl-8 pr-7 py-1.5 text-[11px] bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400"
          />
          {sidebarQuery && (
            <button
              onClick={() => setSidebarQuery('')}
              aria-label="Clear filter"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Admin Mode Button */}
        {isAdmin && (
          <button
            onClick={() => onTabChange('admin_cms')}
            className="w-full px-2.5 py-1.5 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 hover:from-amber-500/25 rounded-xl border border-amber-300 text-[11px] font-bold text-amber-950 flex items-center justify-between shadow-2xs transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Admin Master CMS</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700">सक्रिय</span>
          </button>
        )}
      </div>

      {/* Nav Items Scroll Box - Perfect Fit Scrollable Area with Smooth Slim Scrollbar */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-3 space-y-4 overscroll-contain scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
        
        {/* Pinned Favorites Quick-Access Dock */}
        {!normalizedQuery && pinnedItems.length > 0 && (
          <div className="space-y-1 pb-2 border-b border-slate-100">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                पिन किए गए (Pinned)
              </span>
              <span className="tabular-nums text-slate-500">{pinnedItems.length}</span>
            </span>
            <nav className="space-y-0.5">
              {pinnedItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <div key={`pin_${item.id}`} className="group flex items-center gap-0.5">
                    {item.id === 'keyboard' ? (
                      <a
                        href={SANTALI_KEYBOARD_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-0 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer text-slate-700 hover:bg-amber-50/80 hover:text-amber-950"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <Icon className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                          <span className="truncate">{item.label}</span>
                        </span>
                        <span className="text-[10px] font-bold text-sky-600 shrink-0">↗</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => onTabChange(item.id)}
                        className={`flex-1 min-w-0 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-amber-100/80 text-amber-950 border border-amber-300 font-bold'
                            : 'text-slate-700 hover:bg-amber-50/80 hover:text-amber-950'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-700' : 'text-amber-600'}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => togglePinTab(e, item.id)}
                      title="पिन हटाएं"
                      className="p-1 rounded-md text-amber-500 hover:bg-slate-100 opacity-60 group-hover:opacity-100 cursor-pointer shrink-0"
                    >
                      <Star className="w-3 h-3 fill-amber-500" />
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        )}

        {/* Recent Tabs Quick-Launch Dock */}
        {!normalizedQuery && recentItems.length > 0 && (
          <div className="space-y-1 pb-2 border-b border-slate-100">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              हाल के मॉड्यूल (Recent)
            </span>
            <nav className="space-y-0.5">
              {recentItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={`recent_${item.id}`}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold'
                        : 'text-slate-700 hover:bg-emerald-50/60 hover:text-emerald-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-emerald-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Section 1: मुख्य साधन (Core Tools) */}
        {filteredMainNav.length > 0 && (
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              मुख्य साधन
            </span>
            <nav className="space-y-0.5">
              {filteredMainNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isPinned = pinnedTabs.includes(item.id);
              return (
                <div key={item.id} className="group flex items-center gap-0.5">
                  {item.id === 'keyboard' ? (
                    <a
                      href={SANTALI_KEYBOARD_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-0 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-slate-700 hover:text-slate-900 hover:bg-slate-100/80"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 shrink-0 text-sky-600" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded shrink-0">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <button
                      onClick={() => onTabChange(item.id)}
                      className={`flex-1 min-w-0 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-sky-50 text-sky-900 shadow-2xs border border-sky-300 font-bold scale-[1.01]'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isAdmin && (
                        <span title="एडमिन संपादन अधिकार सक्रिय" className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 font-bold shrink-0">
                          ✏️
                        </span>
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => togglePinTab(e, item.id)}
                    title={isPinned ? 'पिन हटाएं' : 'ऊपर पिन करें'}
                    className={`p-1 rounded-md cursor-pointer shrink-0 transition-opacity ${
                      isPinned
                        ? 'text-amber-500 opacity-100'
                        : 'text-slate-300 hover:text-amber-500 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${isPinned ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>
              );
              })}
            </nav>
          </div>
        )}

        {/* Section 2: संस्कृति, पर्व व समाज (Culture & Festivals) */}
        {filteredCulturalNav.length > 0 && (
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              संस्कृति, पर्व व समाज
            </span>
            <nav className="space-y-0.5">
              {filteredCulturalNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isPinned = pinnedTabs.includes(item.id);
              return (
                <div key={item.id} className="group flex items-center gap-0.5">
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`flex-1 min-w-0 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-50 text-amber-950 shadow-2xs border border-amber-300 font-bold scale-[1.01]'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-700' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-200 text-amber-900 font-bold">
                          {item.badge}
                        </span>
                      )}
                      {isAdmin && (
                        <span title="एडमिन संपादन अधिकार सक्रिय" className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">
                          ✏️
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => togglePinTab(e, item.id)}
                    title={isPinned ? 'पिन हटाएं' : 'ऊपर पिन करें'}
                    className={`p-1 rounded-md cursor-pointer shrink-0 transition-opacity ${
                      isPinned
                        ? 'text-amber-500 opacity-100'
                        : 'text-slate-300 hover:text-amber-500 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${isPinned ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>
              );
              })}
            </nav>
          </div>
        )}

        {/* Section 3: भाषा, ऑडियो व बालगीत (Language & Media) */}
        {filteredLearningNav.length > 0 && (
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              भाषा, संगीत व बालगीत
            </span>
            <nav className="space-y-0.5">
              {filteredLearningNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isPinned = pinnedTabs.includes(item.id);
              return (
                <div key={item.id} className="group flex items-center gap-0.5">
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={`flex-1 min-w-0 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-50 text-sky-900 shadow-2xs border border-sky-300 font-bold scale-[1.01]'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-sky-100 text-sky-800 font-bold">
                          {item.badge}
                        </span>
                      )}
                      {isAdmin && (
                        <span title="एडमिन संपादन अधिकार सक्रिय" className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">
                          ✏️
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => togglePinTab(e, item.id)}
                    title={isPinned ? 'पिन हटाएं' : 'ऊपर पिन करें'}
                    className={`p-1 rounded-md cursor-pointer shrink-0 transition-opacity ${
                      isPinned
                        ? 'text-amber-500 opacity-100'
                        : 'text-slate-300 hover:text-amber-500 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Star className={`w-3 h-3 ${isPinned ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>
              );
              })}
            </nav>
          </div>
        )}

        {normalizedQuery && filteredMainNav.length === 0 && filteredCulturalNav.length === 0 && filteredLearningNav.length === 0 && (
          <div className="px-3 py-6 text-center text-xs text-slate-500">
            <p className="font-semibold">"{sidebarQuery}" से कोई मॉड्यूल नहीं मिला</p>
            <button
              onClick={() => setSidebarQuery('')}
              className="mt-2 text-amber-700 font-bold underline cursor-pointer"
            >
              फ़िल्टर साफ़ करें
            </button>
          </div>
        )}

        {/* Section 4: सेटिंग्स व सहायता (Utilities) */}
        <div className="pt-2 border-t border-slate-100 space-y-0.5">
          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-sky-50 text-sky-800 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400 shrink-0" />
            <span>पसंद एवं सेटिंग्स (Preferences)</span>
          </button>

          {onOpenFeedback && (
            <button
              onClick={onOpenFeedback}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-200/80 transition-all cursor-pointer"
            >
              <MessageSquareHeart className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>प्रतिक्रिया व सुझाव (Feedback)</span>
            </button>
          )}

          <button
            onClick={onOpenAbout}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>संस्थान परिचय (About BOSC)</span>
          </button>

          <button
            onClick={onOpenHelp}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>सहायता एवं मार्गदर्शन (FAQ)</span>
          </button>
        </div>
      </div>

      {/* Bottom Credit Box - Clean & Fixed */}
      <div className="p-2.5 border-t border-slate-100 bg-slate-50/90 shrink-0">
        <CulturalTree variant="silhouette" className="w-full h-7 mb-1 opacity-70" />
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-800">BOSC Tech &amp; Education</p>
          <p className="text-[9px] text-amber-800 font-bold">संताली देवनागरी डिजिटल प्रतिष्ठान</p>
        </div>
      </div>
    </aside>
  );
});
