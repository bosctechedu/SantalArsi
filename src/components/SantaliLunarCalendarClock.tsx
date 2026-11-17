import React, { useState, useEffect, useMemo } from 'react';
import {
  Moon,
  Calendar as CalendarIcon,
  Clock,
  Volume2,
  Share2,
  CheckCircle2,
  Flame,
  Compass,
  Bell,
  Plus,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ListChecks,
  ShieldCheck,
  User,
  Megaphone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';
import { useAdmin, OfficialFestivalDateOverride } from '../context/AdminContext';
import { useUserAuth } from '../context/UserAuthContext';
import {
  FestivalCountdownItem,
  MAJOR_FESTIVALS_COUNTDOWN,
  getDefaultTargetDateForFestival,
  formatDateInputValue,
  resolveFestivalTargetDate,
  getNextUpcomingFestivalInfo
} from '../utils/lunarFestivalHelper';

export type { FestivalCountdownItem };
export {
  MAJOR_FESTIVALS_COUNTDOWN,
  getDefaultTargetDateForFestival,
  formatDateInputValue,
  resolveFestivalTargetDate,
  getNextUpcomingFestivalInfo
};

export interface LunarMonth {
  id: string;
  nameSantaliDev: string;
  nameRoman: string;
  gregorianMonths: string;
  keyFestival: string;
  festivalDev: string;
  natureSigns: string;
  agriculturalStage: string;
  traditionalRole: string;
  accentColor: string;
}

export const SANTALI_LUNAR_MONTHS: LunarMonth[] = [
  {
    id: 'cait',
    nameSantaliDev: 'चैत चांदो (Cait)',
    nameRoman: 'Cait Chando',
    gregorianMonths: 'मार्च - अप्रैल',
    keyFestival: 'Baha Parab',
    festivalDev: 'बाहा परोब (फूलों का महापर्व)',
    natureSigns: 'साल (सरजोम) और महुआ के नए फूलों से वन महक उठता है।',
    agriculturalStage: 'नव वर्ष का शुभारंभ, खेतों की प्रथम जुताई।',
    traditionalRole: 'नायके हाड़ाम द्वारा जाहेर थान में प्रथम साल फूल अर्पण।',
    accentColor: 'from-pink-600 to-rose-700'
  },
  {
    id: 'baisakh',
    nameSantaliDev: 'बैसाख चांदो (Baisakh)',
    nameRoman: 'Baisakh Chando',
    gregorianMonths: 'अप्रैल - मई',
    keyFestival: 'Disom Sendra',
    festivalDev: 'दिसोम सेंन्द्रा (सामूहिक शिकार व संसद)',
    natureSigns: 'धूप तेज होती है, केंदु व जामुन के फल पकने लगते हैं।',
    agriculturalStage: 'गोबर खाद खेतों में डालना व जुताई।',
    traditionalRole: 'लोबीर बैसी (पारंपरिक उच्च न्यायालय) की बैठकें।',
    accentColor: 'from-amber-600 to-orange-700'
  },
  {
    id: 'jeth',
    nameSantaliDev: 'जेठ चांदो (Jeth)',
    nameRoman: 'Jeth Chando',
    gregorianMonths: 'मई - जून',
    keyFestival: 'Rohin / Jal Puja',
    festivalDev: 'रोहिन व जल स्रोत संरक्षण',
    natureSigns: 'ग्रीष्म की चरम सीमा, जलस्रोतों (दाड़ी/पुखरी) की सुरक्षा।',
    agriculturalStage: 'धान के बीजों (बीड़ा) का परीक्षण व तैयारी।',
    traditionalRole: 'कुदाम नायके द्वारा ग्राम रक्षा बोंगा पूजन।',
    accentColor: 'from-orange-600 to-red-700'
  },
  {
    id: 'asarh',
    nameSantaliDev: 'आषाढ़ चांदो (Asarh)',
    nameRoman: 'Asarh Chando',
    gregorianMonths: 'जून - जुलाई',
    keyFestival: 'Erok Sim',
    festivalDev: 'एरोक\' सिम (बीज बोनी पर्व)',
    natureSigns: 'आकाश में काले मेघ, प्रथम मानसूनी फुहारें।',
    agriculturalStage: 'खेतों में धान के बीज बोना (एरोक\')।',
    traditionalRole: 'ग्राम प्रधान मांझी द्वारा प्रथम बीज वपन अनुष्ठान।',
    accentColor: 'from-emerald-600 to-teal-800'
  },
  {
    id: 'sawan',
    nameSantaliDev: 'सावन चांदो (Sawan)',
    nameRoman: 'Sawan Chando',
    gregorianMonths: 'जुलाई - अगस्त',
    keyFestival: 'Hariyar Sim',
    festivalDev: 'हरियर सिम (हरियाली वंदना)',
    natureSigns: 'चारों ओर हरियाली, नदियां-नाले उफान पर।',
    agriculturalStage: 'धान की रोपाई (रोपा) और सामूहिक कदमताल।',
    traditionalRole: 'खेतों की हरियाली व कीट-पतंगों से रक्षा की प्रार्थना।',
    accentColor: 'from-green-600 to-emerald-800'
  },
  {
    id: 'bhadov',
    nameSantaliDev: 'भादव चांदो (Bhadov)',
    nameRoman: 'Bhadov Chando',
    gregorianMonths: 'अगस्त - सितंबर',
    keyFestival: 'Karam Parab',
    festivalDev: 'करम परोब (प्रकृति व भाई-बहन का पर्व)',
    natureSigns: 'काशी के फूल खिलते हैं, आकाश स्वच्छ नीला होता है।',
    agriculturalStage: 'धान के पौधों में बालियां आनी शुरू होती हैं।',
    traditionalRole: 'करम डाल की स्थापना, जावो डालियों का नृत्य व जागरण।',
    accentColor: 'from-yellow-600 to-amber-700'
  },
  {
    id: 'asin',
    nameSantaliDev: 'आसीन चांदो (Asin)',
    nameRoman: 'Asin Chando',
    gregorianMonths: 'सितंबर - अक्टूबर',
    keyFestival: 'Dasae Parab',
    festivalDev: 'दासाय परोब (गुरु-चेला भुवांग नृत्य)',
    natureSigns: 'हल्की गुलाबी ठंड, धान में दूध भरने लगता है।',
    agriculturalStage: 'फसलों की सुरक्षा व जंगली जीवों से रखवाली।',
    traditionalRole: 'भुवांग वाद्य के साथ दासाय सेरेञ व चेला दीक्षा।',
    accentColor: 'from-indigo-600 to-blue-800'
  },
  {
    id: 'sohrai_katik',
    nameSantaliDev: 'सोहराय / कातिक चांदो (Sohrai)',
    nameRoman: 'Sohrai / Katik Chando',
    gregorianMonths: 'अक्टूबर - नवंबर',
    keyFestival: 'Sohrai Parab',
    festivalDev: 'सोहराय महापर्व (गोधन व कृषि वंदना)',
    natureSigns: 'सुनहरी धान की बालियां, मिट्टी की दीवारों पर सोहराय चित्र।',
    agriculturalStage: 'धान की पकी फसल, खलिहानों की तैयारी।',
    traditionalRole: 'गोधन को जगाना (खूंटाव), पांच दिवसीय महा उत्सव।',
    accentColor: 'from-amber-600 to-rose-700'
  },
  {
    id: 'aghan',
    nameSantaliDev: 'अगहन चांदो (Aghan)',
    nameRoman: 'Aghan Chando',
    gregorianMonths: 'नवंबर - दिसंबर',
    keyFestival: 'Janthar Parab',
    festivalDev: 'जांथार परोब (नवान्न पर्व)',
    natureSigns: 'शीत ऋतु का आगमन, खलिहानों में धान के ढेर।',
    agriculturalStage: 'नई फसल की कटाई और प्रथम अन्न का भोग।',
    traditionalRole: 'नई फसल का अन्न पहले बोंगा को, फिर पारिवारिक सहभोज।',
    accentColor: 'from-teal-600 to-cyan-800'
  },
  {
    id: 'pus',
    nameSantaliDev: 'पूस चांदो (Pus)',
    nameRoman: 'Pus Chando',
    gregorianMonths: 'दिसंबर - जनवरी',
    keyFestival: 'Sakrat Parab',
    festivalDev: 'साकरात परोब (मकर संक्रांति व तीरंदाजी)',
    natureSigns: 'कड़ाके की ठंड, पाला और कोहरा।',
    agriculturalStage: 'फसल की पूरी कुटाई-सफाई, आराम व खेल।',
    traditionalRole: 'भेंडा बेझा (तीरंदाजी निशाना), पीठा और अखड़ा मिलन।',
    accentColor: 'from-blue-600 to-indigo-900'
  },
  {
    id: 'magh',
    nameSantaliDev: 'माघ चांदो (Magh)',
    nameRoman: 'Magh Chando',
    gregorianMonths: 'जनवरी - फरवरी',
    keyFestival: 'Maghe Parab',
    festivalDev: 'माघे परोब (वार्षिक स्वशासन नवीनीकरण)',
    natureSigns: 'पतझड़ की शुरुआत, महुआ के पेड़ पत्ते गिराते हैं।',
    agriculturalStage: 'कृषि वर्ष की समाप्ति, नए समझौतों की तैयारी।',
    traditionalRole: 'मांझी परगना प्रशासनिक पदाधिकारियों का वार्षिक नवीनीकरण।',
    accentColor: 'from-purple-600 to-fuchsia-800'
  },
  {
    id: 'fagun',
    nameSantaliDev: 'फागुन चांदो (Fagun)',
    nameRoman: 'Fagun Chando',
    gregorianMonths: 'फरवरी - मार्च',
    keyFestival: 'Fagun Baha',
    festivalDev: 'फागुन बाहा व पलाश उत्सव',
    natureSigns: 'पलाश के दहकते लाल फूल, वनों में नई कोपलें।',
    agriculturalStage: 'नव वर्ष की पूर्व-तैयारी, औजारों की मरम्मत।',
    traditionalRole: 'नायके द्वारा वसंत आगमन का स्वागत।',
    accentColor: 'from-rose-600 to-amber-700'
  }
];

interface CustomDateOverride {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

const CUSTOM_DATES_KEY = 'hor_katha_festival_custom_dates';
const CUSTOM_EVENTS_KEY = 'hor_katha_custom_festivals';
const PREP_CHECKS_KEY = 'hor_katha_festival_prep_checks';

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function computeMoonInfoForDate(dateObj: Date) {
  const knownNewMoon = new Date('2024-01-11T11:57:00Z');
  const synodicMonth = 29.53058867;
  const noonDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 12, 0, 0);
  const diffDays = (noonDate.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const cyclePos = (((diffDays % synodicMonth) + synodicMonth) % synodicMonth) / synodicMonth;
  const tithiIndex = Math.min(30, Math.max(1, Math.floor(cyclePos * 30) + 1));
  const isShukla = tithiIndex <= 15;
  const pakshaDay = isShukla ? tithiIndex : tithiIndex - 15;
  let icon = '🌒';
  let phaseShort = 'शुक्ल';
  if (cyclePos < 0.04 || cyclePos > 0.96) {
    icon = '🌑';
    phaseShort = 'मूळ (अमावस्या)';
  } else if (cyclePos < 0.22) {
    icon = '🌒';
    phaseShort = 'चांदो मुलूग्';
  } else if (cyclePos < 0.29) {
    icon = '🌓';
    phaseShort = 'शुक्ल अष्टमी';
  } else if (cyclePos < 0.46) {
    icon = '🌔';
    phaseShort = 'बढ़ता चांद';
  } else if (cyclePos < 0.54) {
    icon = '🌕';
    phaseShort = 'कुनामी (पूर्णिमा)';
  } else if (cyclePos < 0.72) {
    icon = '🌖';
    phaseShort = 'घटता चांद';
  } else if (cyclePos < 0.79) {
    icon = '🌗';
    phaseShort = 'कृष्ण अष्टमी';
  } else {
    icon = '🌘';
    phaseShort = 'चांदो ओतोर';
  }
  return {
    icon,
    phaseShort,
    shortTithi: `${isShukla ? 'शु' : 'कृ'} ${pakshaDay}`,
    fullTithi: `${isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष'} · तिथि ${pakshaDay}`,
    isKunami: cyclePos >= 0.46 && cyclePos < 0.54,
    isMul: cyclePos < 0.04 || cyclePos > 0.96
  };
}

function playCelebrationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + idx * 0.14 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.14 + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.14);
      osc.stop(ctx.currentTime + idx * 0.14 + 0.5);
    });
  } catch {
    // ignore Web Audio block
  }
}

export const SantaliLunarCalendarClock: React.FC = () => {
  const {
    isAdmin,
    officialFestivalOverrides,
    updateOfficialFestivalDate,
    resetOfficialFestivalDate,
    adminLunarAnnouncement,
    updateAdminLunarAnnouncement
  } = useAdmin();
  const { currentUser, isLoggedIn, updateMyPreferences } = useUserAuth();

  // Guest / browser fallback states
  const [guestCustomEvents, setGuestCustomEvents] = useState<FestivalCountdownItem[]>(() =>
    loadJson<FestivalCountdownItem[]>(CUSTOM_EVENTS_KEY, [])
  );
  const [guestCustomOverrides, setGuestCustomOverrides] = useState<Record<string, CustomDateOverride>>(() =>
    loadJson<Record<string, CustomDateOverride>>(CUSTOM_DATES_KEY, {})
  );
  const [guestPrepChecks, setGuestPrepChecks] = useState<Record<string, boolean>>(() =>
    loadJson<Record<string, boolean>>(PREP_CHECKS_KEY, {})
  );

  // Scoped personal data: When signed in with Email, strictly isolated per User Email!
  const customEvents: FestivalCountdownItem[] = isLoggedIn && currentUser
    ? (currentUser.preferences.personalCustomEvents as FestivalCountdownItem[]) || []
    : guestCustomEvents;

  const customOverrides: Record<string, CustomDateOverride> = isLoggedIn && currentUser
    ? currentUser.preferences.personalFestivalOverrides || {}
    : guestCustomOverrides;

  const prepChecks: Record<string, boolean> = isLoggedIn && currentUser
    ? currentUser.preferences.personalPrepChecks || {}
    : guestPrepChecks;

  const setCustomEvents = (
    updater:
      | FestivalCountdownItem[]
      | ((prev: FestivalCountdownItem[]) => FestivalCountdownItem[])
  ) => {
    const nextVal = typeof updater === 'function' ? updater(customEvents) : updater;
    if (isLoggedIn && currentUser) {
      updateMyPreferences({ personalCustomEvents: nextVal as any });
    } else {
      setGuestCustomEvents(nextVal);
    }
  };

  const setCustomOverrides = (
    updater:
      | Record<string, CustomDateOverride>
      | ((prev: Record<string, CustomDateOverride>) => Record<string, CustomDateOverride>)
  ) => {
    const nextVal = typeof updater === 'function' ? updater(customOverrides) : updater;
    if (isLoggedIn && currentUser) {
      updateMyPreferences({ personalFestivalOverrides: nextVal });
    } else {
      setGuestCustomOverrides(nextVal);
    }
  };

  const setPrepChecks = (
    updater:
      | Record<string, boolean>
      | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => {
    const nextVal = typeof updater === 'function' ? updater(prepChecks) : updater;
    if (isLoggedIn && currentUser) {
      updateMyPreferences({ personalPrepChecks: nextVal });
    } else {
      setGuestPrepChecks(nextVal);
    }
  };

  const allFestivals = useMemo(
    () => [...MAJOR_FESTIVALS_COUNTDOWN, ...customEvents],
    [customEvents]
  );

  const [selectedMonth, setSelectedMonth] = useState<LunarMonth>(() => {
    const m = new Date().getMonth(); // 0=Jan..11=Dec; Map roughly to Santali lunar cycle
    const approxIdx = (m + 9) % 12; // March(2)->0 Cait
    return SANTALI_LUNAR_MONTHS[approxIdx] || SANTALI_LUNAR_MONTHS[0];
  });
  const [selectedFestivalId, setSelectedFestivalId] = useState<string>(MAJOR_FESTIVALS_COUNTDOWN[0].id);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Add Custom Festival Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFestName, setNewFestName] = useState('');
  const [newFestDate, setNewFestDate] = useState(() => formatDateInputValue(new Date(Date.now() + 7 * 86400000)));
  const [newFestTime, setNewFestTime] = useState('09:00');
  const [newFestDeity, setNewFestDeity] = useState('मरांग बुरु व ग्राम पूर्वज');
  const [newFestNote, setNewFestNote] = useState('');

  // Admin inline announcement editor
  const [adminNoticeInput, setAdminNoticeInput] = useState(adminLunarAnnouncement || '');
  useEffect(() => {
    setAdminNoticeInput(adminLunarAnnouncement || '');
  }, [adminLunarAnnouncement]);

  // Interactive Monthly Calendar State
  const [calendarMonthDate, setCalendarMonthDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string>(() =>
    formatDateInputValue(new Date())
  );

  // Feedback & Utility States
  const [greetingLang, setGreetingLang] = useState<'hindi' | 'santali' | 'english'>('hindi');
  const [copiedShare, setCopiedShare] = useState(false);
  const [reminderSavedMsg, setReminderSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_DATES_KEY, JSON.stringify(guestCustomOverrides));
    } catch {
      // ignore
    }
  }, [guestCustomOverrides]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(guestCustomEvents));
    } catch {
      // ignore
    }
  }, [guestCustomEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(PREP_CHECKS_KEY, JSON.stringify(guestPrepChecks));
    } catch {
      // ignore
    }
  }, [guestPrepChecks]);

  // Real-time 1-second clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Astronomical Moon Phase, Paksha & Tithi derived cleanly from currentTime
  const moonData = useMemo(() => {
    const knownNewMoon = new Date('2024-01-11T11:57:00Z');
    const synodicMonth = 29.53058867;
    const diffDays = (currentTime.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const cyclePos = (((diffDays % synodicMonth) + synodicMonth) % synodicMonth) / synodicMonth;
    const lunarAgeDays = cyclePos * synodicMonth;
    const tithiIndex = Math.min(30, Math.max(1, Math.floor(cyclePos * 30) + 1));
    const paksha = tithiIndex <= 15 ? 'शुक्ल पक्ष (चांदो मुलूग्)' : 'कृष्ण पक्ष (चांदो ओतोर)';
    const pakshaDay = tithiIndex <= 15 ? tithiIndex : tithiIndex - 15;
    const TITHI_NAMES = [
      'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
      'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
      'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी',
      tithiIndex <= 15 ? 'पूर्णिमा (कुनामी)' : 'अमावस्या (मूळ)'
    ];
    const tithiLabel = `${paksha} · ${TITHI_NAMES[(pakshaDay - 1) % 15]} (${pakshaDay})`;

    let phaseNameDev = '';
    let phaseNameRoman = '';
    let description = '';
    let isWaxing = true;
    let phasePercent = 0;

    if (cyclePos < 0.03 || cyclePos > 0.97) {
      phaseNameDev = 'मूळ चांदो (अमावस्या)';
      phaseNameRoman = 'Mul Chando (New Moon)';
      description = 'अंधकार पर विजय और अंतर्मुखी साधना का समय। नायके हाड़ाम द्वारा गोपनीय बाखेर आराधना।';
      phasePercent = 0;
    } else if (cyclePos < 0.22) {
      phaseNameDev = 'चांदो मुलूग् (शुक्ल प्रतिपदा से पंचमी)';
      phaseNameRoman = 'Chando Mulug (Waxing Crescent)';
      description = 'चांद की पहली किरणें। नए शुभ कार्यों, कृषि तैयारी और बीज संग्रह का उत्तम काल।';
      phasePercent = Math.round(cyclePos * 200);
      isWaxing = true;
    } else if (cyclePos < 0.28) {
      phaseNameDev = 'प्रथम चतुर्थांश (First Quarter)';
      phaseNameRoman = 'Mit Hatiñ Chando';
      description = 'आधा चंद्र। गांव के चौपाल व मांझी परगना में सामाजिक निर्णयों की बेला।';
      phasePercent = 50;
      isWaxing = true;
    } else if (cyclePos < 0.47) {
      phaseNameDev = 'बढ़ता चंद्र (Waxing Gibbous)';
      phaseNameRoman = 'Laha-kater Chando';
      description = 'चांदो पूर्णता की ओर अग्रसर। खेतों में फसलों का तेजी से विकास।';
      phasePercent = Math.round(cyclePos * 180);
      isWaxing = true;
    } else if (cyclePos < 0.53) {
      phaseNameDev = 'कुनामी चांदो (पूर्णमासी / पूर्णिमा)';
      phaseNameRoman = 'Kunami Chando (Full Moon)';
      description = 'अमृतमयी पूर्ण चंद्र! संताल समाज में बाहा, करम और सोहराय अखड़ा नृत्य का सबसे उल्लासपूर्ण दिन।';
      phasePercent = 100;
      isWaxing = false;
    } else if (cyclePos < 0.72) {
      phaseNameDev = 'घटता चंद्र (Waning Gibbous)';
      phaseNameRoman = 'Tayom-kater Chando';
      description = 'कुनामी के बाद का शांति काल। रात में बुजुर्गों द्वारा बच्चों को लोककथाएं सुनाने का समय।';
      phasePercent = Math.round((1 - cyclePos) * 180);
      isWaxing = false;
    } else if (cyclePos < 0.78) {
      phaseNameDev = 'अंतिम चतुर्थांश (Third Quarter)';
      phaseNameRoman = 'Bar Hatiñ Chando';
      description = 'रात्रि के उत्तरार्ध में चंद्र दर्शन। वनों में शांति और प्राकृतिक संतुलन।';
      phasePercent = 50;
      isWaxing = false;
    } else {
      phaseNameDev = 'चांदो ओतोर (कृष्ण पक्ष विदाई)';
      phaseNameRoman = 'Chando Otor (Waning Crescent)';
      description = 'मूळ (अमावस्या) की तैयारी। आत्म-शुद्धि और पूर्वजों (हपड़ाम) को स्मरण करने का समय।';
      phasePercent = Math.round((1 - cyclePos) * 200);
      isWaxing = false;
    }

    return {
      phaseNameDev,
      phaseNameRoman,
      phasePercent: Math.min(100, Math.max(0, phasePercent)),
      description,
      isWaxing,
      tithiLabel,
      lunarDayNum: Math.round(lunarAgeDays * 10) / 10
    };
  }, [currentTime]);

  const selectedFestival = useMemo(
    () => allFestivals.find((f) => f.id === selectedFestivalId) || allFestivals[0],
    [allFestivals, selectedFestivalId]
  );

  // Real-time countdown helper for any festival
  const getCountdownDetails = (fest: FestivalCountdownItem) => {
    const { targetDate, isCustom, source } = resolveFestivalTargetDate(
      fest,
      customOverrides,
      currentTime,
      officialFestivalOverrides
    );
    const diffMs = targetDate.getTime() - currentTime.getTime();
    const isTodaySameDay =
      currentTime.getFullYear() === targetDate.getFullYear() &&
      currentTime.getMonth() === targetDate.getMonth() &&
      currentTime.getDate() === targetDate.getDate();

    const isReached = diffMs <= 0;
    const absMs = Math.max(0, diffMs);
    const days = Math.floor(absMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((absMs / (1000 * 60)) % 60);
    const seconds = Math.floor((absMs / 1000) % 60);

    return {
      targetDate,
      isCustom,
      source,
      diffMs,
      isReached,
      isTodaySameDay,
      days,
      hours,
      minutes,
      seconds
    };
  };

  const activeDetails = getCountdownDetails(selectedFestival);
  const currentOverride = customOverrides[selectedFestival.id];
  const currentAdminOverride = officialFestivalOverrides[selectedFestival.id];
  const dateInputVal =
    currentOverride?.date ||
    currentAdminOverride?.date ||
    formatDateInputValue(activeDetails.targetDate);
  const timeInputVal =
    currentOverride?.time ||
    currentAdminOverride?.time ||
    `${String(activeDetails.targetDate.getHours()).padStart(2, '0')}:${String(
      activeDetails.targetDate.getMinutes()
    ).padStart(2, '0')}`;

  // All festivals sorted nearest first
  const sortedUpcomingRadar = useMemo(() => {
    return allFestivals
      .map((fest) => {
        const det = getCountdownDetails(fest);
        return { fest, ...det };
      })
      .sort((a, b) => a.diffMs - b.diffMs);
  }, [allFestivals, customOverrides, officialFestivalOverrides, currentTime]);

  // Map YYYY-MM-DD -> Festivals falling on that day for Monthly Grid
  const festivalsByDateMap = useMemo(() => {
    const map: Record<string, Array<{ fest: FestivalCountdownItem; source: 'user' | 'admin' | 'default' }>> = {};
    allFestivals.forEach((fest) => {
      const resolved = resolveFestivalTargetDate(
        fest,
        customOverrides,
        calendarMonthDate,
        officialFestivalOverrides
      );
      const key = formatDateInputValue(resolved.targetDate);
      if (!map[key]) map[key] = [];
      map[key].push({ fest, source: resolved.source });
      // Also map major default occurrences for the viewed calendar year
      if (!fest.isCustomEvent && !customOverrides[fest.id] && !officialFestivalOverrides[fest.id]) {
        const altDate = new Date(
          calendarMonthDate.getFullYear(),
          fest.targetMonthDay.month,
          fest.targetMonthDay.day,
          9,
          0,
          0
        );
        const altKey = formatDateInputValue(altDate);
        if (altKey !== key) {
          if (!map[altKey]) map[altKey] = [];
          map[altKey].push({ fest, source: 'default' });
        }
      }
    });
    return map;
  }, [allFestivals, customOverrides, officialFestivalOverrides, calendarMonthDate]);

  const calendarCells = useMemo(() => {
    const yr = calendarMonthDate.getFullYear();
    const mo = calendarMonthDate.getMonth();
    const firstWeekday = new Date(yr, mo, 1).getDay(); // 0=Sun..6=Sat
    const daysInMonth = new Date(yr, mo + 1, 0).getDate();
    const cells: Array<{
      dateKey: string;
      dayNum: number;
      dateObj: Date;
      moon: ReturnType<typeof computeMoonInfoForDate>;
    } | null> = [];
    for (let i = 0; i < firstWeekday; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(yr, mo, d, 12, 0, 0);
      cells.push({
        dateKey: formatDateInputValue(dateObj),
        dayNum: d,
        dateObj,
        moon: computeMoonInfoForDate(dateObj)
      });
    }
    return cells;
  }, [calendarMonthDate]);

  const selectedDayDetails = useMemo(() => {
    const [y, m, d] = selectedCalendarDay.split('-').map(Number);
    const dateObj = new Date(y || 2026, (m || 1) - 1, d || 1, 12, 0, 0);
    return {
      dateKey: selectedCalendarDay,
      dateObj,
      moon: computeMoonInfoForDate(dateObj),
      events: festivalsByDateMap[selectedCalendarDay] || []
    };
  }, [selectedCalendarDay, festivalsByDateMap]);

  // Real-time date/time update handlers (updates immediately as user enters date/time)
  const handleDateEntryChange = (newDate: string) => {
    if (!newDate) return;
    setCustomOverrides((prev) => ({
      ...prev,
      [selectedFestival.id]: {
        date: newDate,
        time: prev[selectedFestival.id]?.time || timeInputVal || '09:00'
      }
    }));
  };

  const handleTimeEntryChange = (newTime: string) => {
    if (!newTime) return;
    setCustomOverrides((prev) => ({
      ...prev,
      [selectedFestival.id]: {
        date: prev[selectedFestival.id]?.date || dateInputVal,
        time: newTime
      }
    }));
  };

  const handleResetDateOverride = () => {
    setCustomOverrides((prev) => {
      const next = { ...prev };
      delete next[selectedFestival.id];
      return next;
    });
  };

  const handlePublishAsOfficialAdminDate = () => {
    if (!isAdmin) return;
    updateOfficialFestivalDate(selectedFestival.id, {
      date: dateInputVal,
      time: timeInputVal
    });
    setReminderSavedMsg(
      `🛡️ "${selectedFestival.nameDev}" की आधिकारिक तिथि (${dateInputVal}) सभी यूज़र्स के लिए प्रकाशित हो गई!`
    );
    setTimeout(() => setReminderSavedMsg(null), 3500);
  };

  const handleAddCustomFestival = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFestName.trim() || !newFestDate) return;
    const [y, m, d] = newFestDate.split('-').map(Number);
    const id = `custom_${Date.now()}`;
    const created: FestivalCountdownItem = {
      id,
      nameDev: newFestName.trim(),
      nameRoman: newFestName.trim(),
      targetMonthDay: { month: (m || 1) - 1, day: d || 1 },
      approxDateStr: `निर्धारित तिथि: ${new Date(y, (m || 1) - 1, d || 1).toLocaleDateString('hi-IN')}`,
      sacredDeity: newFestDeity.trim() || 'मरांग बुरु व ग्राम पूर्वज',
      traditionalSeren: {
        dev: 'जोहार गोसांय, सागुन परोब सेटेरेना... आबोवाग् दिशोम रे रास्का दोहोय मे!',
        roman: 'Johar gosane, sagun parab seterena... Abowag dishom re raska dohoy me!',
        hindi: 'प्रणाम ईश्वर, शुभ पर्व आ गया है... हमारे समाज और गाँव में सदैव खुशियाँ बनी रहें!'
      },
      offerings: ['सखुआ पत्ते व फूल', 'धूप-दीप', 'शुद्ध जल व पारंपरिक पकवान'],
      ritualSummary:
        newFestNote.trim() ||
        'परिवार और ग्रामीण समुदाय द्वारा पारंपरिक रीति-रिवाजों व सामूहिक सद्भाव के साथ उत्सव आयोजन।',
      prepTasks: ['पर्व स्थल की सफाई व सजावट', 'पूजा सामग्री व पकवान तैयारी', 'कुटुम्ब व मित्रों को जोहार निमंत्रण'],
      isCustomEvent: true
    };

    setCustomEvents((prev) => [...prev, created]);
    setCustomOverrides((prev) => ({
      ...prev,
      [id]: { date: newFestDate, time: newFestTime || '09:00' }
    }));
    setSelectedFestivalId(id);
    setNewFestName('');
    setNewFestNote('');
    setShowAddForm(false);
    playCelebrationChime();
  };

  const handleDeleteCustomFestival = (id: string) => {
    setCustomEvents((prev) => prev.filter((f) => f.id !== id));
    setCustomOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (selectedFestivalId === id) {
      setSelectedFestivalId(MAJOR_FESTIVALS_COUNTDOWN[0].id);
    }
  };

  const handleSpeakFestival = () => {
    if (greetingLang === 'english') {
      speakWithFemaleVoice(
        `${selectedFestival.nameRoman}. ${activeDetails.days} days remaining. ${selectedFestival.traditionalSeren.roman}`,
        { lang: 'en-IN', readingLangMode: 'english', autoDetectLanguage: false }
      );
    } else if (greetingLang === 'santali') {
      speakWithFemaleVoice(selectedFestival.traditionalSeren.roman, {
        readingLangMode: 'santali_roman',
        autoDetectLanguage: true
      });
    } else {
      speakWithFemaleVoice(
        `${selectedFestival.nameDev}। ${
          activeDetails.isReached
            ? 'आज पावन महापर्व का शुभ अवसर है!'
            : `शेष समय ${activeDetails.days} दिन और ${activeDetails.hours} घंटे।`
        } ${selectedFestival.traditionalSeren.dev}। ${selectedFestival.traditionalSeren.hindi}`,
        { lang: 'hi-IN', readingLangMode: 'hindi', autoDetectLanguage: false }
      );
    }
  };

  const shareMessageText = useMemo(() => {
    const targetStr = activeDetails.targetDate.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    if (activeDetails.isReached && activeDetails.isTodaySameDay) {
      return `सागुन जोहार! आज ${selectedFestival.nameDev} (${targetStr}) का पावन अवसर है। "${selectedFestival.traditionalSeren.dev}" — आपको व आपके पूरे परिवार को हार्दिक शुभकामनाएँ!`;
    }
    return `सागुन जोहार! ${selectedFestival.nameDev} (${targetStr}) के आगमन में अब ${activeDetails.days} दिन, ${activeDetails.hours} घंटे और ${activeDetails.minutes} मिनट शेष हैं। "${selectedFestival.traditionalSeren.dev}"`;
  }, [activeDetails, selectedFestival]);

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(shareMessageText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2200);
  };

  const handleBellReminder = async () => {
    playCelebrationChime();
    if ('Notification' in window && Notification.permission !== 'denied') {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification(`🔔 ${selectedFestival.nameDev} रिमाइंडर सेट`, {
            body: `तिथि: ${activeDetails.targetDate.toLocaleDateString('hi-IN')} · शेष ${activeDetails.days} दिन ${activeDetails.hours} घंटे`
          });
        }
      } catch {
        // ignore notification errors in sandbox
      }
    }
    setReminderSavedMsg(`${selectedFestival.nameDev} के लिए रिमाइंडर व घंटी अलर्ट सक्रिय है!`);
    setTimeout(() => setReminderSavedMsg(null), 3500);
  };

  // Add to Calendar iCal (.ics) download using exact custom or resolved targetDate
  const handleDownloadCalendarEvent = () => {
    const eventDate = activeDetails.targetDate;
    const dtStart = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z';
    const dtEnd =
      new Date(eventDate.getTime() + 8 * 60 * 60 * 1000)
        .toISOString()
        .replace(/-|:|\.\d\d\d/g, '')
        .slice(0, 15) + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HorKatha//Santali Indigenous Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${selectedFestival.id}_${Date.now()}@horkatha.org`,
      `DTSTAMP:${dtStart}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${selectedFestival.nameDev} - संताली महापर्व`,
      `DESCRIPTION:${selectedFestival.ritualSummary} | आराध्य: ${selectedFestival.sacredDeity}`,
      'LOCATION:जाहेर थान / कुलही अखड़ा (झारखंड, प.बंगाल, ओडिशा, असम)',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFestival.id}_santali_festival.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentPrepTasks = selectedFestival.prepTasks || [];
  const completedPrepCount = currentPrepTasks.filter(
    (_, idx) => prepChecks[`${selectedFestival.id}_${idx}`]
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Top Astronomical Moon Phase Banner (Clean Light Theme) */}
      <header className="bg-gradient-to-r from-amber-50 via-white to-sky-50 text-slate-900 p-6 sm:p-8 rounded-2xl border border-amber-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-amber-800 font-semibold">
            <Moon className="w-4 h-4 shrink-0 text-amber-700" />
            <span>चांदो पंचांग · Indigenous Lunar Astronomy</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700">लाइव चंद्र कला व महापर्व काउंटडाउन</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            पारंपरिक संताली चंद्र पंचांग व महापर्व लाइव टाइमर
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            संताली जीवन चक्र चंद्रमा (चांदो) और ऋतु-नक्षत्रों से संचालित होता है। किसी भी महापर्व की सटीक तिथि व समय दर्ज करें और तुरंत लाइव काउंटडाउन, अनुष्ठान तैयारी सूची व अलर्ट प्राप्त करें।
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2.5 text-xs">
            <div className="px-3.5 py-2 rounded-xl bg-white border border-amber-200 shadow-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="font-mono tabular-nums text-amber-800 font-bold">
                {currentTime.toLocaleTimeString('hi-IN')}
              </span>
              <span className="text-slate-300" aria-hidden="true">|</span>
              <span className="text-slate-700 font-medium">
                {currentTime.toLocaleDateString('hi-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{moonData.tithiLabel}</span>
            </div>
          </div>
        </div>

        {/* Live Moon Visual Card */}
        <div className="lg:col-span-4 bg-white/90 border border-slate-200 shadow-sm p-5 rounded-2xl flex flex-col items-center text-center space-y-2.5">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-100 via-amber-200 to-yellow-50 relative overflow-hidden flex items-center justify-center border-2 border-amber-300 shadow-inner">
            <div className="absolute top-3 left-5 w-4 h-4 rounded-full bg-amber-300/35" />
            <div className="absolute bottom-5 right-4 w-6 h-6 rounded-full bg-amber-300/30" />
            <div className="absolute top-10 right-6 w-3 h-3 rounded-full bg-amber-300/25" />
            {moonData.phasePercent < 95 && (
              <div
                className="absolute inset-0 bg-slate-800/80 transition-all duration-500"
                style={{
                  clipPath: moonData.isWaxing
                    ? `inset(0 0 0 ${moonData.phasePercent}%)`
                    : `inset(0 ${moonData.phasePercent}% 0 0)`
                }}
              />
            )}
          </div>

          <div>
            <p className="font-bold text-amber-800 text-sm">{moonData.phaseNameDev}</p>
            <p className="text-[11px] font-mono text-slate-600">
              {moonData.phaseNameRoman} · प्रदीप्ति <span className="tabular-nums font-bold text-slate-800">{moonData.phasePercent}%</span> · दिन {moonData.lunarDayNum}/29.5
            </p>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">{moonData.description}</p>
        </div>
      </header>

      {/* Admin Official Global Lunar Announcement Banner (or Inline Editor for Admin) */}
      {(adminLunarAnnouncement || isAdmin) && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Megaphone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <span>आधिकारिक पंचांग व पर्व सूचना (Admin Notice)</span>
              </div>
              {adminLunarAnnouncement ? (
                <p className="text-amber-900 font-medium">{adminLunarAnnouncement}</p>
              ) : (
                <p className="text-amber-700 italic">अभी कोई वैश्विक सूचना प्रकाशित नहीं है (नीचे से जोड़ें)।</p>
              )}
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
              <input
                type="text"
                value={adminNoticeInput}
                onChange={(e) => setAdminNoticeInput(e.target.value)}
                placeholder="वैश्विक सूचना लिखें..."
                className="flex-1 md:w-64 px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-slate-900 text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  updateAdminLunarAnnouncement(adminNoticeInput.trim());
                  setReminderSavedMsg('🛡️ आधिकारिक पंचांग सूचना सभी यूज़र्स के लिए अपडेट हो गई!');
                  setTimeout(() => setReminderSavedMsg(null), 3000);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold cursor-pointer shrink-0"
              >
                प्रकाशित करें
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 1: LIVE FESTIVAL COUNTDOWN CLOCK WITH INSTANT DATE ENTRY */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600 shrink-0" />
              <span>आगामी महापर्व लाइव काउंटडाउन (Festival Countdown Clock)</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              अपनी स्थानीय/गाँव की वास्तविक तिथि और समय दर्ज करते ही काउंटडाउन सेकंड-दर-सेकंड तुरंत अपडेट हो जाता है।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddForm((v) => !v)}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>नया पर्व / उत्सव जोड़ें</span>
            </button>
            <button
              onClick={handleBellReminder}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-700" />
              <span>घंटी अलर्ट</span>
            </button>
            <button
              onClick={handleDownloadCalendarEvent}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-amber-300" />
              <span>कैलेंडर (.ics)</span>
            </button>
          </div>
        </div>

        {reminderSavedMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{reminderSavedMsg}</span>
          </div>
        )}

        {/* Inline Add Custom Festival Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddCustomFestival}
            className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
          >
            <div className="font-bold text-slate-900 text-sm">
              कस्टम महापर्व या ग्राम उत्सव काउंटडाउन जोड़ें
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">पर्व / उत्सव का नाम *</label>
                <input
                  type="text"
                  required
                  value={newFestName}
                  onChange={(e) => setNewFestName(e.target.value)}
                  placeholder="उदा. गाँव जाहेर पूजा / बापला"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">तारीख चुनें (Date) *</label>
                <input
                  type="date"
                  required
                  value={newFestDate}
                  onChange={(e) => setNewFestDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">समय (Time)</label>
                <input
                  type="time"
                  value={newFestTime}
                  onChange={(e) => setNewFestTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">आराध्य / स्थान</label>
                <input
                  type="text"
                  value={newFestDeity}
                  onChange={(e) => setNewFestDeity(e.target.value)}
                  placeholder="मरांग बुरु / जाहेर थान"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <input
                type="text"
                value={newFestNote}
                onChange={(e) => setNewFestNote(e.target.value)}
                placeholder="संक्षिप्त अनुष्ठान या आयोजन टिप्पणी (वैकल्पिक)"
                className="flex-1 min-w-[240px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
                >
                  काउंटडाउन जोड़ें ✓
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Festival Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {allFestivals.map((fest) => {
            const isSel = fest.id === selectedFestival.id;
            const det = getCountdownDetails(fest);
            return (
              <button
                key={fest.id}
                onClick={() => setSelectedFestivalId(fest.id)}
                className={`px-3.5 py-2 rounded-xl font-bold transition-colors shrink-0 cursor-pointer flex items-center gap-2 border ${
                  isSel
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="whitespace-nowrap">{fest.nameDev}</span>
                <span
                  className={`font-mono tabular-nums text-[11px] ${
                    isSel ? 'text-amber-300' : 'text-slate-500'
                  }`}
                >
                  {det.isTodaySameDay ? 'आज!' : `${det.days}d`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Countdown Display + Real-Time Date Entry Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left: Live Ticker Clock */}
          <div className="lg:col-span-8 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 text-slate-900 p-6 sm:p-8 rounded-2xl border border-amber-200 flex flex-col justify-between space-y-6">
            <div className="text-center space-y-1.5">
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-amber-800 font-semibold">
                <span>{selectedFestival.approxDateStr}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-700">
                  लक्ष्य तिथि:{' '}
                  {activeDetails.targetDate.toLocaleDateString('hi-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}{' '}
                  ({timeInputVal})
                </span>
                <span aria-hidden="true">·</span>
                {activeDetails.source === 'user' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[11px]">
                    <User className="w-3 h-3" />
                    {isLoggedIn && currentUser
                      ? `${currentUser.displayName} की निजी तिथि`
                      : 'निजी ब्राउज़र तिथि'}
                  </span>
                ) : activeDetails.source === 'admin' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    <ShieldCheck className="w-3 h-3" />
                    एडमिन आधिकारिक तिथि
                  </span>
                ) : (
                  <span className="text-slate-600 font-semibold text-[11px]">
                    चंद्र अनुमानित तिथि
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center gap-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{selectedFestival.nameDev}</h3>
                {selectedFestival.isCustomEvent && (
                  <button
                    onClick={() => handleDeleteCustomFestival(selectedFestival.id)}
                    title="यह कस्टम पर्व हटाएँ"
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-600 font-mono">
                मुख्य आराध्य: {selectedFestival.sacredDeity}
              </p>
            </div>

            {activeDetails.isReached ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <p className="text-xl sm:text-2xl font-bold text-emerald-800">
                  {activeDetails.isTodaySameDay
                    ? `सागुन जोहार! आज ${selectedFestival.nameDev} का पावन दिन है!`
                    : `चयनित तिथि (${activeDetails.targetDate.toLocaleDateString('hi-IN')}) पूर्ण हो चुकी है`}
                </p>
                <p className="text-xs text-slate-600">
                  आप दाईं ओर नई आगामी तिथि दर्ज करके तुरंत अगला काउंटडाउन शुरू कर सकते हैं या डिफ़ॉल्ट पर रीसेट कर सकते हैं।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-xl w-full mx-auto">
                <div className="bg-white border border-amber-200 shadow-sm p-3 sm:p-4 rounded-2xl text-center">
                  <span className="block text-2xl sm:text-5xl font-black text-amber-700 font-mono tabular-nums">
                    {activeDetails.days}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-600 font-semibold">
                    दिन (Days)
                  </span>
                </div>
                <div className="bg-white border border-amber-200 shadow-sm p-3 sm:p-4 rounded-2xl text-center">
                  <span className="block text-2xl sm:text-5xl font-black text-amber-700 font-mono tabular-nums">
                    {String(activeDetails.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-600 font-semibold">
                    घंटे (Hours)
                  </span>
                </div>
                <div className="bg-white border border-amber-200 shadow-sm p-3 sm:p-4 rounded-2xl text-center">
                  <span className="block text-2xl sm:text-5xl font-black text-amber-700 font-mono tabular-nums">
                    {String(activeDetails.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-600 font-semibold">
                    मिनट (Mins)
                  </span>
                </div>
                <div className="bg-white border border-emerald-200 shadow-sm p-3 sm:p-4 rounded-2xl text-center">
                  <span className="block text-2xl sm:text-5xl font-black text-emerald-700 font-mono tabular-nums">
                    {String(activeDetails.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-600 font-semibold">
                    सेकंड (Secs)
                  </span>
                </div>
              </div>
            )}

            {/* 3-Language Audio & Share Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-amber-200/70 text-xs">
              <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
                {(
                  [
                    { id: 'hindi', label: 'हिन्दी' },
                    { id: 'santali', label: 'Santali' },
                    { id: 'english', label: 'English' }
                  ] as const
                ).map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setGreetingLang(l.id)}
                    className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                      greetingLang === l.id ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSpeakFestival}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>पर्व गीत व संदेश सुनें</span>
              </button>

              <button
                onClick={handleCopyShare}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copiedShare ? 'कॉपी हो गया!' : 'शुभकामना संदेश कॉपी'}</span>
              </button>
            </div>
          </div>

          {/* Right: Real-Time Date & Time Entry Panel */}
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 text-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-amber-700" />
                  <span>सटीक तिथि व समय दर्ज करें</span>
                </h4>
                {currentOverride && !selectedFestival.isCustomEvent && (
                  <button
                    onClick={handleResetDateOverride}
                    className="text-[11px] font-bold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> रीसेट
                  </button>
                )}
              </div>

              <p className="text-slate-600 leading-relaxed">
                संताली पर्व चंद्र-तिथि और स्थानीय गाँव/अखड़ा निर्णय के अनुसार होते हैं। नीचे तिथि बदलते ही लाइव घड़ी तुरंत री-कैलकुलेट होगी:
              </p>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label htmlFor="fest-date-input" className="font-bold text-slate-800 block">
                    पर्व की तारीख (Festival Date):
                  </label>
                  <input
                    id="fest-date-input"
                    type="date"
                    value={dateInputVal}
                    onChange={(e) => handleDateEntryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="fest-time-input" className="font-bold text-slate-800 block">
                    पूजा / उत्सव समय (Start Time):
                  </label>
                  <input
                    id="fest-time-input"
                    type="time"
                    value={timeInputVal}
                    onChange={(e) => handleTimeEntryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Quick Test Presets for Instant Real-Time Check */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 block">त्वरित तिथि प्रीसेट:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'कल (Tomorrow)', offsetDays: 1 },
                      { label: '7 दिन बाद', offsetDays: 7 },
                      { label: '30 दिन बाद', offsetDays: 30 }
                    ].map((preset) => (
                      <button
                        key={preset.offsetDays}
                        type="button"
                        onClick={() => {
                          const target = new Date(Date.now() + preset.offsetDays * 86400000);
                          handleDateEntryChange(formatDateInputValue(target));
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-amber-50 hover:border-amber-300 text-slate-700 font-semibold text-[11px] cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role-Scoped Storage & Admin Global Official Control */}
                <div className="pt-2 space-y-2">
                  {isAdmin ? (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-950">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                          एडमिन वैश्विक नियंत्रण:
                        </span>
                        {currentAdminOverride && (
                          <button
                            type="button"
                            onClick={() => resetOfficialFestivalDate(selectedFestival.id)}
                            className="text-rose-700 hover:underline cursor-pointer"
                          >
                            आधिकारिक रीसेट
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handlePublishAsOfficialAdminDate}
                        className="w-full py-2 px-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] cursor-pointer"
                      >
                        🛡️ इसे सभी के लिए आधिकारिक तिथि घोषित करें
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-[11px] text-sky-900 leading-snug">
                      {isLoggedIn && currentUser ? (
                        <span>
                          👤 <strong>{currentUser.email}</strong>: आपके बदलाव केवल आपकी अपनी प्रोफ़ाइल में सेव हो रहे हैं।
                        </span>
                      ) : (
                        <span>
                          💡 ऊपर <strong>User Login</strong> से ईमेल लॉगिन करके अपनी निजी पर्व तिथियाँ व नोट्स हमेशा के लिए सेव करें।
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                <span className="flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                  शुभकामना संदेश पूर्वावलोकन
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                {shareMessageText}
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Festival Radar Grid (Sorted Nearest First) */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            सभी आगामी महापर्व समय-सारणी (नज़दीकी उत्सव सबसे पहले)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {sortedUpcomingRadar.map(({ fest, targetDate, days, hours, isTodaySameDay, isCustom }) => {
              const isSelected = fest.id === selectedFestival.id;
              return (
                <button
                  key={fest.id}
                  onClick={() => setSelectedFestivalId(fest.id)}
                  className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 text-slate-900'
                      : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-800'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{fest.nameDev}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {targetDate.toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {isCustom && ' · कस्टम'}
                    </div>
                  </div>
                  <div className="text-right shrink-0 font-mono tabular-nums">
                    <div className="text-sm font-black text-amber-800">
                      {isTodaySameDay ? 'आज!' : `${days} दिन`}
                    </div>
                    {!isTodaySameDay && (
                      <div className="text-[10px] text-slate-500">{hours} घं. शेष</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Festival Details: Offerings, Seren Song & Prep Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2 border-t border-slate-100 text-xs">
          {/* Offerings & Rituals */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>अनुष्ठान विधि व पवित्र सामग्रियाँ</span>
            </h4>
            <p className="text-slate-700 leading-relaxed">{selectedFestival.ritualSummary}</p>
            <div>
              <p className="font-bold text-slate-800 mb-1.5">चढ़ावा व सामग्रियाँ:</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedFestival.offerings.map((off, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-semibold text-[11px]"
                  >
                    {off}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Authentic Seren Song */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-sky-700 shrink-0" />
                <span>पर्व लोकगीत (सेरेञ)</span>
              </h4>
              <button
                onClick={handleSpeakFestival}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] cursor-pointer"
              >
                सुनें ▶
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                "{selectedFestival.traditionalSeren.dev}"
              </p>
              <p className="text-sky-800 font-mono text-[11px]">
                ({selectedFestival.traditionalSeren.roman})
              </p>
              <p className="text-slate-600 text-xs pt-1.5 border-t border-slate-100">
                भावार्थ: {selectedFestival.traditionalSeren.hindi}
              </p>
            </div>
          </div>

          {/* Interactive Preparation Checklist */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>पर्व तैयारी चेकलिस्ट</span>
              </h4>
              <span className="font-mono tabular-nums text-[11px] font-bold text-emerald-800">
                {completedPrepCount}/{currentPrepTasks.length} पूर्ण
              </span>
            </div>

            <div className="space-y-2">
              {currentPrepTasks.map((task, idx) => {
                const key = `${selectedFestival.id}_${idx}`;
                const checked = Boolean(prepChecks[key]);
                return (
                  <label
                    key={key}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      checked
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100/70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setPrepChecks((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className="mt-0.5 accent-emerald-700 cursor-pointer"
                    />
                    <span className={checked ? 'line-through opacity-75' : 'font-medium'}>{task}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1.5: INTERACTIVE 12-MONTH LUNAR CALENDAR GRID */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-sky-700 shrink-0" />
              <span>इंटरैक्टिव मासिक चंद्र पंचांग कैलेंडर (12-Month Grid)</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              प्रत्येक तिथि पर चंद्र कला (🌑 मूळ / 🌕 कुनामी), तिथि पक्ष व महापर्व देखें — किसी भी दिन पर क्लिक करें:
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                setCalendarMonthDate(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                )
              }
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 cursor-pointer"
              title="पिछला माह"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold text-center min-w-[160px]">
              {calendarMonthDate.toLocaleDateString('hi-IN', {
                month: 'long',
                year: 'numeric'
              })}
              <span className="block text-[10px] text-amber-800 font-semibold">
                {SANTALI_LUNAR_MONTHS[(calendarMonthDate.getMonth() + 10) % 12]?.nameSantaliDev}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setCalendarMonthDate(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                )
              }
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 cursor-pointer"
              title="अगला माह"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setCalendarMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
                setSelectedCalendarDay(formatDateInputValue(now));
              }}
              className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer"
            >
              आज
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* 7-Column Calendar Grid */}
          <div className="lg:col-span-8 space-y-2">
            <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-slate-600 pb-1">
              {['रवि (सिंग)', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'].map((wd) => (
                <div key={wd} className="py-1 rounded-lg bg-slate-50 border border-slate-100">
                  {wd}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {calendarCells.map((cell, idx) => {
                if (!cell) {
                  return <div key={`empty_${idx}`} className="min-h-[64px] sm:min-h-[76px] rounded-xl bg-slate-50/40" />;
                }
                const isToday = cell.dateKey === formatDateInputValue(currentTime);
                const isSelected = cell.dateKey === selectedCalendarDay;
                const dayEvents = festivalsByDateMap[cell.dateKey] || [];

                return (
                  <button
                    key={cell.dateKey}
                    type="button"
                    onClick={() => setSelectedCalendarDay(cell.dateKey)}
                    className={`min-h-[64px] sm:min-h-[76px] p-1.5 sm:p-2 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-400/30'
                        : isToday
                        ? 'bg-amber-50 border-amber-400'
                        : dayEvents.length > 0
                        ? 'bg-emerald-50/60 border-emerald-300 hover:bg-emerald-50'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span
                        className={`text-xs sm:text-sm font-black font-mono tabular-nums ${
                          isToday ? 'text-amber-800' : isSelected ? 'text-sky-800' : 'text-slate-900'
                        }`}
                      >
                        {cell.dayNum}
                      </span>
                      <span className="text-xs leading-none" title={cell.moon.phaseShort}>
                        {cell.moon.icon}
                      </span>
                    </div>

                    <div className="space-y-0.5 w-full">
                      <div className="text-[9px] font-semibold text-slate-500 truncate">
                        {cell.moon.shortTithi}
                      </div>
                      {dayEvents.length > 0 && (
                        <div className="px-1 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold truncate">
                          {dayEvents[0].fest.nameDev.split('(')[0].trim()}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clicked Day Detail Card */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
            <div className="space-y-1 border-b border-slate-200 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                  चयनित तिथि विवरण
                </span>
                <span className="text-lg leading-none">{selectedDayDetails.moon.icon}</span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                {selectedDayDetails.dateObj.toLocaleDateString('hi-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>
              <p className="text-amber-900 font-bold">
                {selectedDayDetails.moon.phaseShort} · {selectedDayDetails.moon.fullTithi}
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-800">
                इस तिथि के महापर्व / निजी आयोजन ({selectedDayDetails.events.length}):
              </div>
              {selectedDayDetails.events.length === 0 ? (
                <p className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  इस दिन कोई निर्धारित महापर्व नहीं है। आप नीचे 1-क्लिक में इस तारीख़ पर अपना कस्टम पर्व या पारिवारिक रिमाइंडर जोड़ सकते हैं।
                </p>
              ) : (
                <div className="space-y-1.5">
                  {selectedDayDetails.events.map(({ fest, source }) => (
                    <button
                      key={fest.id}
                      type="button"
                      onClick={() => setSelectedFestivalId(fest.id)}
                      className="w-full p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 text-left cursor-pointer transition-colors"
                    >
                      <div className="font-bold text-slate-900">{fest.nameDev}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
                        <span>{fest.sacredDeity}</span>
                        <span className="font-bold text-amber-800">
                          {source === 'user' ? 'निजी तिथि' : source === 'admin' ? 'आधिकारिक' : 'अनुमानित'} →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setNewFestDate(selectedDayDetails.dateKey);
                setShowAddForm(true);
                window.scrollTo({ top: 220, behavior: 'smooth' });
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>इस तिथि ({selectedDayDetails.dateObj.toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })}) पर पर्व / रिमाइंडर जोड़ें</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 12 SANTALI LUNAR MONTHS DIRECTORY + SELECTED MONTH DETAIL */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-700 shrink-0" />
              <span>संताली १२ चांदो (महीने) व प्रकृति चक्र</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              प्रत्येक चांदो (माह) का संबंध विशिष्ट वृक्षों, कृषि कार्यों और पारंपरिक अनुष्ठानों से जुड़ा है। किसी भी माह पर क्लिक करें:
            </p>
          </div>
          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${selectedMonth.nameSantaliDev}। ${selectedMonth.festivalDev}। ${selectedMonth.natureSigns} ${selectedMonth.traditionalRole}`,
                { lang: 'hi-IN', readingLangMode: 'hindi', autoDetectLanguage: false }
              )
            }
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-sky-700" />
            <span>चयनित माह सुनें</span>
          </button>
        </div>

        {/* Selected Month Detail Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-[11px] font-semibold text-amber-800">{selectedMonth.gregorianMonths} · {selectedMonth.nameRoman}</div>
            <div className="text-base font-bold text-slate-900 mt-0.5">{selectedMonth.nameSantaliDev}</div>
            <div className="text-amber-900 font-bold mt-0.5">{selectedMonth.festivalDev}</div>
          </div>
          <div>
            <div className="font-bold text-slate-800">प्रकृति व कृषि स्थिति:</div>
            <p className="text-slate-700 mt-0.5">{selectedMonth.natureSigns}</p>
            <p className="text-slate-700 mt-0.5">{selectedMonth.agriculturalStage}</p>
          </div>
          <div>
            <div className="font-bold text-slate-800">पारंपरिक सामाजिक भूमिका:</div>
            <p className="text-slate-700 mt-0.5">{selectedMonth.traditionalRole}</p>
          </div>
        </div>

        {/* 12 Months Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {SANTALI_LUNAR_MONTHS.map((mon, index) => {
            const isSel = mon.id === selectedMonth.id;
            return (
              <button
                key={mon.id}
                type="button"
                onClick={() => setSelectedMonth(mon)}
                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer space-y-2 text-xs ${
                  isSel
                    ? 'bg-amber-50 border-amber-400 text-slate-900'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">
                    माह {index + 1} · {mon.gregorianMonths}
                  </span>
                  <span className="font-mono text-amber-800 font-bold">{mon.nameRoman}</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{mon.nameSantaliDev}</h3>
                  <p className="text-amber-800 font-semibold text-xs mt-0.5">{mon.festivalDev}</p>
                </div>

                <div className="space-y-1 text-slate-600 text-[11px] leading-relaxed pt-1 border-t border-slate-200/70">
                  <p>
                    <strong className="text-slate-800">प्रकृति:</strong> {mon.natureSigns}
                  </p>
                  <p>
                    <strong className="text-slate-800">कृषि:</strong> {mon.agriculturalStage}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
