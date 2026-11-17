export interface FestivalCountdownItem {
  id: string;
  nameDev: string;
  nameRoman: string;
  targetMonthDay: { month: number; day: number }; // 0-indexed month
  approxDateStr: string;
  sacredDeity: string;
  traditionalSeren: {
    dev: string;
    roman: string;
    hindi: string;
  };
  offerings: string[];
  ritualSummary: string;
  prepTasks?: string[];
  isCustomEvent?: boolean;
}

export interface OfficialFestivalDateOverrideLite {
  date: string;
  time: string;
  note?: string;
  updatedAt?: number;
}

interface CustomDateOverride {
  date: string;
  time: string;
}

export const MAJOR_FESTIVALS_COUNTDOWN: FestivalCountdownItem[] = [
  {
    id: 'sohrai',
    nameDev: 'सोहराय महापर्व (Sohrai Parab)',
    nameRoman: 'Sohrai Parab',
    targetMonthDay: { month: 10, day: 15 },
    approxDateStr: 'कार्तिक अमावस्या के पश्चात ५ दिवसीय पर्व',
    sacredDeity: 'मरांग बुरु, गोठ बोंगा, गौ-वंश पूर्वज',
    traditionalSeren: {
      dev: 'हासा रेनाग् ओड़ाग् दो, सोहराय रे साजावा... गाय-काड़ा कोवाग् गोरोब गे आबोवाग्!',
      roman: 'Hasa renag orag do, sohrai re sajawa... Gay-kara kowag gorob ge abowag!',
      hindi: 'मिट्टी के घरों को सोहराय कला से सजाया है... मूक पशुधन ही हमारी असली शान है!'
    },
    offerings: ['उम-नाड़के (पवित्र स्नान)', 'गोठ पूजा पर तपान हांडी', 'धूप-दीप', 'घास व धान की नई मालाएं'],
    ritualSummary:
      'उम (प्रथम दिन), दाका (द्वितीय दिन), खुंटाव (तृतीय दिन - बैलों को नचाना), जाले (चौथा दिन) और साकराट (पांचवा दिन)।',
    prepTasks: [
      'मिट्टी की दीवारों पर सोहराय भित्तिचित्र (काली-लाल-सफेद मिट्टी) सजाना',
      'तुमदाक व तामाक वाद्ययंत्रों की ट्यूनिंग और मरम्मत',
      'गौ-धन के सींगों के लिए सरसों तेल, सिंदूर व धान की माला तैयार करना',
      'नए धान के चावल से पीठा व रानू सामग्री संग्रह करना'
    ]
  },
  {
    id: 'sakrat',
    nameDev: 'साकरात परोब (Sakrat Parab)',
    nameRoman: 'Sakrat Parab',
    targetMonthDay: { month: 0, day: 14 },
    approxDateStr: 'पूस संक्रांति (१३ - १५ जनवरी)',
    sacredDeity: 'मरांग बुरु, तीरंदाज पूर्वज',
    traditionalSeren: {
      dev: 'आ-सार साबोक् पे, भेंडा बेझा तुञ पे... साकरात रेनाग् पीठा जोम पे!',
      roman: 'Aa-sar sabok pe, bhenda bejha tun pe... Sakrat renag pitha jom pe!',
      hindi: 'धनुष-बाण थामो, केले के निशाने पर तीर चलाओ... और साकरात का स्वादिष्ट पीठा खाओ!'
    },
    offerings: ['जिल पीठा (मांस युक्त पीठा)', 'तपान हांडी', 'निशाना बेझा'],
    ritualSummary:
      'तीरंदाजी प्रतियोगिता (भेंडा बेझा) का आयोजन होता है जहां विजेता को गांव में कंधे पर उठाकर सम्मानित किया जाता है।',
    prepTasks: [
      'बांस के धनुष (आक) व तीर (सार) की जांच व निशाना बेझा स्थापना',
      'जिल पीठा और गुड़ पीठा के लिए चावल का आटा तैयार करना',
      'परिवार व कुटुम्ब निमंत्रण (नेवता) भेजना'
    ]
  },
  {
    id: 'maghe',
    nameDev: 'माघे परोब (Maghe Parab)',
    nameRoman: 'Maghe Parab',
    targetMonthDay: { month: 1, day: 10 },
    approxDateStr: 'माघ मास पूर्णिमा (फरवरी प्रथम-द्वितीय सप्ताह)',
    sacredDeity: 'मरांग बुरु, ग्राम स्वशासन पूर्वज',
    traditionalSeren: {
      dev: 'माघ चांदो रे अतु होड़ जारवा, मांझी-पारानिक नवा दारमाहा!',
      roman: 'Magh chando re atu hor jarwa, majhi-paranik nawa darmaha!',
      hindi: 'माघ माह में पूरा गाँव एकत्र होता है, मांझी-पारानिक का पावन नवीनीकरण होता है!'
    },
    offerings: ['जाहेर पूजा अर्घ्य', 'सखुआ पत्ता दोना', 'सामूहिक ग्राम भोज'],
    ritualSummary:
      'मांझी, पारानिक, गोडेट, नायके आदि ग्राम स्वशासन पदाधिकारियों के वार्षिक दायित्व व भूमि समझौतों का लोकतांत्रिक नवीनीकरण होता है।',
    prepTasks: [
      'मांझी थान में वार्षिक ग्राम सभा की पूर्व सूचना (गोडेट द्वारा)',
      'खेत-मजदूरी व वार्षिक समझौते की समीक्षा',
      'सामूहिक नृत्य अखड़ा की साफ-सफाई'
    ]
  },
  {
    id: 'baha',
    nameDev: 'बाहा परोब (Baha Parab)',
    nameRoman: 'Baha Parab',
    targetMonthDay: { month: 2, day: 25 },
    approxDateStr: 'फागुन पूर्णिमा से चैत शुक्ल तृतीया काल',
    sacredDeity: 'जाहेर एरा, मरांग बुरु, मोड़ेको-तुरुयको',
    traditionalSeren: {
      dev: 'सरजोम बाहा, मातकोम बाहा... चेलेका सोदोरोक् काना, जोहार तोबे ठाकुर जिउ!',
      roman: 'Sarjom baha, matkom baha... cheleka sodorok kana, johar tobe thakur jiu!',
      hindi: 'साल और महुआ के पावन फूल खिले हैं... हे ईश्वर, हम आपको नमन करते हैं!'
    },
    offerings: ['सरजोम (साल) के नए फूल', 'तपान हांडी (पवित्र जल/मद्य)', 'सिंदूर', 'सफेद व चितकबरे मुर्गे'],
    ritualSummary:
      'नायके हाड़ाम पवित्र जाहेर थान में साल के नए फूलों की पूजा करते हैं, फिर गांव की कुंवारी कन्याएं घर-घर जाकर सबको फूल भेंट करती हैं और पवित्र जल का छिड़काव होता है।',
    prepTasks: [
      'जाहेर थान प्रांगण की सामूहिक सफाई व गोबर लिपाई',
      'सरजोम (सखुआ) और महुआ के ताजे फूलों की टोकरी सजना',
      'बाहा जल-क्रीड़ा हेतु पीतल के लोटे और शुद्ध जल की व्यवस्था'
    ]
  },
  {
    id: 'erok',
    nameDev: "एरोक' सिम (Erok' Sim)",
    nameRoman: 'Erok Sim',
    targetMonthDay: { month: 5, day: 15 },
    approxDateStr: 'आषाढ़ मास की शुरुआत (प्रथम मानसूनी वर्षा)',
    sacredDeity: 'धरती माता, जाहेर एरा',
    traditionalSeren: {
      dev: "दाग् गे जारि येना, एरोक' बेड़ा सेतेर येना... हासा रे बीड़ा हेर मे!",
      roman: 'Dag ge jari yena, erok bera seter yena... Hasa re bira her me!',
      hindi: 'वर्षा की बूंदें बरस पड़ीं, बीज बोने की बेला आ गई... उपजाऊ मिट्टी में बीज डालो!'
    },
    offerings: ["एरोक' सिम (पवित्र मुर्गा)", 'धान के बीज', 'तपान हांडी', 'सरजोम पत्ते'],
    ritualSummary:
      'खेतों में धान बोने से पहले ग्राम देवता और धरती माता से उत्तम फसल और कीट-व्याधियों से मुक्ति की सामूहिक याचना की जाती है।',
    prepTasks: [
      'बंधी से देशी धान (करहनी, तुपु) के बीज निकालकर धूप दिखाना',
      'नाहेल (हल) व कृषि औजारों की जांच',
      'जाहेर थान में एरोक सिम पूजा तिथि तय करना'
    ]
  },
  {
    id: 'karam',
    nameDev: 'करम परोब (Karam Parab)',
    nameRoman: 'Karam Parab',
    targetMonthDay: { month: 8, day: 20 },
    approxDateStr: 'भाद्रपद एकादशी (करम एकादशी)',
    sacredDeity: 'करम बोंगा, धरम बोंगा',
    traditionalSeren: {
      dev: 'जावो-जावो गो, करम डाल दो साजाव पे... भायवा कोवाग् आयुक् बाढ़ाव मा!',
      roman: 'Jawo-jawo go, karam dal do sajaw pe... Bhaywa kowag ayuk barhaw ma!',
      hindi: 'अंकुरित जावो से करम डाल सजाओ... हमारे भाइयों की दीर्घायु और समृद्धि हो!'
    },
    offerings: ['जावो (अंकुरित अन्न)', 'करम की दो पवित्र डालियां', 'कच्चा दूध', 'अरवा चावल व धूप'],
    ritualSummary:
      'गांव के अखड़ा में करम की डाली स्थापित कर रात भर करम सेरेञ और नृत्य होता है, जहां बुजुर्ग कर्म और धर्म की कथा सुनाते हैं।',
    prepTasks: [
      '7 दिन पूर्व बांस की टोकरी में जावो (अंकुरित धान-जौ-मूंग) बोना',
      'अखड़ा के मध्य करम डाली रोपण स्थल सजाना',
      'करम-धरम लोककथा व रात्रि जागरण की तैयारी'
    ]
  }
];

const CUSTOM_DATES_KEY = 'hor_katha_festival_custom_dates';
const CUSTOM_EVENTS_KEY = 'hor_katha_custom_festivals';

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function getDefaultTargetDateForFestival(
  fest: FestivalCountdownItem,
  now: Date = new Date()
): Date {
  const targetYear = now.getFullYear();
  let targetDate = new Date(targetYear, fest.targetMonthDay.month, fest.targetMonthDay.day, 9, 0, 0);
  const sameDay =
    now.getFullYear() === targetDate.getFullYear() &&
    now.getMonth() === targetDate.getMonth() &&
    now.getDate() === targetDate.getDate();
  if (!sameDay && now.getTime() > targetDate.getTime()) {
    targetDate = new Date(targetYear + 1, fest.targetMonthDay.month, fest.targetMonthDay.day, 9, 0, 0);
  }
  return targetDate;
}

export function formatDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function resolveFestivalTargetDate(
  fest: FestivalCountdownItem,
  personalOverrides: Record<string, CustomDateOverride>,
  now: Date = new Date(),
  officialOverrides: Record<string, OfficialFestivalDateOverrideLite> = {}
): { targetDate: Date; isCustom: boolean; source: 'user' | 'admin' | 'default' } {
  const userOv = personalOverrides[fest.id];
  if (userOv && /^\d{4}-\d{2}-\d{2}$/.test(userOv.date)) {
    const [y, m, d] = userOv.date.split('-').map(Number);
    const [hh, mm] = (userOv.time || '09:00').split(':').map(Number);
    const parsed = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0);
    if (!isNaN(parsed.getTime())) {
      return { targetDate: parsed, isCustom: true, source: 'user' };
    }
  }
  const adminOv = officialOverrides[fest.id];
  if (adminOv && /^\d{4}-\d{2}-\d{2}$/.test(adminOv.date)) {
    const [y, m, d] = adminOv.date.split('-').map(Number);
    const [hh, mm] = (adminOv.time || '09:00').split(':').map(Number);
    const parsed = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0);
    if (!isNaN(parsed.getTime())) {
      return { targetDate: parsed, isCustom: true, source: 'admin' };
    }
  }
  return { targetDate: getDefaultTargetDateForFestival(fest, now), isCustom: false, source: 'default' };
}

export function getNextUpcomingFestivalInfo(now: Date = new Date()): {
  nameDev: string;
  daysLeft: number;
  dateLabel: string;
} {
  let overrides = loadJson<Record<string, CustomDateOverride>>(CUSTOM_DATES_KEY, {});
  let customEvents = loadJson<FestivalCountdownItem[]>(CUSTOM_EVENTS_KEY, []);

  try {
    const activeEmail = localStorage.getItem('hor_katha_active_user_email');
    if (activeEmail) {
      const profilesRaw = localStorage.getItem('hor_katha_user_profiles_v1');
      if (profilesRaw) {
        const profiles = JSON.parse(profilesRaw);
        const u = profiles[activeEmail.trim().toLowerCase()];
        if (u?.preferences) {
          overrides = u.preferences.personalFestivalOverrides || {};
          customEvents = u.preferences.personalCustomEvents || [];
        }
      }
    }
  } catch {
    // ignore
  }

  const officialOverrides = loadJson<Record<string, OfficialFestivalDateOverrideLite>>(
    'hor_katha_admin_official_festivals_v1',
    {}
  );
  const all = [...MAJOR_FESTIVALS_COUNTDOWN, ...customEvents];

  let nearest = all[0];
  let nearestDiff = Infinity;
  let nearestDate = new Date();

  for (const fest of all) {
    const { targetDate } = resolveFestivalTargetDate(fest, overrides, now, officialOverrides);
    const diff = targetDate.getTime() - now.getTime();
    if (diff >= -86400000 && diff < nearestDiff) {
      nearestDiff = diff;
      nearest = fest;
      nearestDate = targetDate;
    }
  }

  const daysLeft = Math.max(0, Math.floor(Math.max(0, nearestDiff) / (1000 * 60 * 60 * 24)));
  return {
    nameDev: nearest.nameDev,
    daysLeft,
    dateLabel: nearestDate.toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })
  };
}
