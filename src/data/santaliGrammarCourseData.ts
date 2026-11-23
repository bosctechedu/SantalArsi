export type GrammarTierId = 'foundations' | 'parts_of_speech' | 'syntax_verbs' | 'composition';

export interface GrammarRulePoint {
  heading: string;
  explanationHi: string;
  explanationEn: string;
  santaliDev?: string;
  santaliRoman?: string;
}

export interface GrammarExampleRow {
  santaliDev: string;
  santaliRoman: string;
  hindi: string;
  english: string;
  note?: string;
}

export interface GrammarTable {
  title: string;
  columns: [string, string, string, string];
  rows: [string, string, string, string][];
}

export interface GrammarSampleComposition {
  title: string;
  subtitle: string;
  santaliDev: string;
  santaliRoman: string;
  hindiTranslation: string;
}

export interface GrammarQuizQuestion {
  id: string;
  chapterId: string;
  questionHi: string;
  questionEn: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanationHi: string;
}

export interface GrammarChapter {
  id: string;
  number: string;
  tier: GrammarTierId;
  titleSantaliDev: string;
  titleSantaliRoman: string;
  titleHi: string;
  titleEn: string;
  summaryHi: string;
  summaryEn: string;
  keyFormula: string;
  rules: GrammarRulePoint[];
  table?: GrammarTable;
  examples: GrammarExampleRow[];
  compositions?: GrammarSampleComposition[];
}

export const GRAMMAR_TIERS: { id: GrammarTierId; labelHi: string; labelEn: string; range: string }[] = [
  { id: 'foundations', labelHi: 'खंड १: भाषा, ध्वनि व शब्द रचना', labelEn: 'Part 1: Language, Sound & Words', range: 'अध्याय 01–05' },
  { id: 'parts_of_speech', labelHi: 'खंड २: लिंग, वचन, कारक व पद-भेद', labelEn: 'Part 2: Inflection & Parts of Speech', range: 'अध्याय 06–11' },
  { id: 'syntax_verbs', labelHi: 'खंड ३: काल, वाच्य, अव्यय व वाक्य', labelEn: 'Part 3: Tenses, Voice & Syntax', range: 'अध्याय 12–16' },
  { id: 'composition', labelHi: 'खंड ४: शब्द-संपदा, पत्र व निबंध', labelEn: 'Part 4: Lexicon, Letters & Essays', range: 'अध्याय 17–20' },
];

export const SANTALI_GRAMMAR_CHAPTERS: GrammarChapter[] = [
  // ─── CHAPTER 01 ──────────────────────────────────────────────────────────
  {
    id: 'ch01_parsi_ronor',
    number: '01',
    tier: 'foundations',
    titleSantaliDev: 'पारसी आर रोनौड़',
    titleSantaliRoman: 'Parsi ar Ronoṛ',
    titleHi: 'भाषा और संताली व्याकरण का परिचय',
    titleEn: 'Language & Introduction to Santali Grammar',
    summaryHi: 'संताली भाषा की पहचान, ऑस्ट्रो-एशियाटिक (मुंडा) भाषा परिवार में इसका स्थान, संवैधानिक दर्जा और व्याकरण (रोनौड़) के तीन मुख्य अंग।',
    summaryEn: 'Origin of Santali in the Austroasiatic (Munda) family, Eighth Schedule recognition, and the three pillars of grammar (Ronoṛ).',
    keyFormula: 'रोनौड़ (व्याकरण) = आड़ाङ-विचार (ध्वनि) + साबाद-विचार (शब्द) + आयात्-विचार (वाक्य)',
    rules: [
      {
        heading: '१. पारसी (भाषा) क्या है?',
        explanationHi: 'मनुष्य अपने मन के विचारों, भावनाओं और अनुभवों को बोलकर या लिखकर जिस माध्यम से दूसरे तक पहुँचाता है, उसे पारसी (भाषा) कहते हैं। संताली भाषा को बोलने वाले स्वयं इसे "होड़ पारसी" या "संताली पारसी" कहते हैं।',
        explanationEn: 'Parsi (language) is the structured system of speech and writing used to share thoughts. Native speakers refer to it as Hoṛ Parsi or Santali Parsi.',
        santaliDev: 'आबोवाक् पारसी दो संताली काना।',
        santaliRoman: 'Abowaq parsi do Santali kana.',
      },
      {
        heading: '२. भाषा परिवार व संवैधानिक सम्मान',
        explanationHi: 'संताली ऑस्ट्रो-एशियाटिक परिवार की मुंडा शाखा की सबसे अधिक बोली जाने वाली भाषा है। भारत के ९२वें संविधान संशोधन (२००३) द्वारा इसे भारतीय संविधान की ८वीं अनुसूची में स्थान मिला। झारखंड, पश्चिम बंगाल, ओडिशा, बिहार, असम और नेपाल-बांग्लादेश में इसके करोड़ों वक्ता हैं।',
        explanationEn: 'Santali is the largest language of the Munda branch of the Austroasiatic family and was added to the 8th Schedule of the Indian Constitution in 2003.',
      },
      {
        heading: '३. रोनौड़ (व्याकरण) के तीन अंग',
        explanationHi: 'शुद्ध पढ़ना, शुद्ध लिखना और शुद्ध बोलना सिखाने वाला शास्त्र ही रोनौड़ (व्याकरण) है। इसके तीन भाग हैं: (क) आड़ाङ आर हा़रोप (ध्वनि व वर्ण विचार), (ख) साबाद (शब्द व प्रत्यय विचार), और (ग) आयात् (वाक्य रचना विचार)।',
        explanationEn: 'Ronoṛ teaches accurate speaking and writing through three branches: Phonology (Arang), Morphology (Sabad), and Syntax (Ayat).',
      },
    ],
    table: {
      title: 'व्याकरण के तीन मुख्य स्तंभ (Three Branches of Ronoṛ)',
      columns: ['संताली नाम', 'रोमन रूप', 'हिंदी अर्थ', 'अध्ययन विषय'],
      rows: [
        ['आड़ाङ / हा़रोप', 'Arang / Harop', 'वर्ण व ध्वनि विचार', 'स्वर, व्यंजन, रुद्ध ध्वनि, लिपि'],
        ['साबाद विचार', 'Sabad Bichar', 'शब्द व रूप विचार', 'संज्ञा, सर्वनाम, क्रिया, प्रत्यय'],
        ['आयात् विचार', 'Ayat Bichar', 'वाक्य विचार', 'पद-क्रम (SOV), वाच्य, काल'],
      ],
    },
    examples: [
      { santaliDev: 'संताली दो मित् गोटाङ मारिच् पारसी काना।', santaliRoman: 'Santali do mit\' gotang marich\' parsi kana.', hindi: 'संताली एक समृद्ध व प्राचीन भाषा है।', english: 'Santali is a rich and ancient language.' },
      { santaliDev: 'रोनौड़ ते पारसी दो सुधरा़क्आ।', santaliRoman: 'Ronoṛ te parsi do sudhraq-a.', hindi: 'व्याकरण से भाषा शुद्ध होती है।', english: 'Grammar refines and standardizes language.' },
      { santaliDev: 'आबो दो संताली तेबोन रोड़ा।', santaliRoman: 'Abo do Santali tebon roṛa.', hindi: 'हम सब संताली में बात करते हैं।', english: 'We all speak in Santali.' },
    ],
  },

  // ─── CHAPTER 02 ──────────────────────────────────────────────────────────
  {
    id: 'ch02_arang_harop',
    number: '02',
    tier: 'foundations',
    titleSantaliDev: 'आड़ाङ आर हा़रोप',
    titleSantaliRoman: 'Arang ar Harop',
    titleHi: 'ध्वनि, वर्णमाला और रुद्ध व्यंजन',
    titleEn: 'Phonology, Alphabet & Checked Consonants',
    summaryHi: 'संताली के स्वर (अ, आ, आ़, इ, उ, ए, ओ), व्यंजन, अनुनासिकता और 4 विशिष्ट रुद्ध कंठ्य ध्वनियाँ (क्\', च्\', त्\', प्\')।',
    summaryEn: 'Santali vowels (including the mid-central ə / आ़), consonants, nasalization, and the four iconic checked consonants.',
    keyFormula: '४ रुद्ध ध्वनियाँ (Checked Stops): क्\' (k\') · च्\' (c\') · त्\' (t\') · प्\' (p\') — श्वास भीतर रोककर उच्चारण',
    rules: [
      {
        heading: '१. स्वर ध्वनियाँ (Vowels / आड़ाङ)',
        explanationHi: 'संताली में ६ आधार स्वर (अ, आ, इ, उ, ए, ओ) के साथ-साथ विशिष्ट केंद्रीय स्वर "आ़ / अ़" (जैसे हा़कू, दा़रे, ना़ड़ी) तथा अनुनासिक स्वर (आँ, ईं, ऊँ) अत्यंत महत्वपूर्ण हैं। स्वर बदलने से शब्द का अर्थ बदल जाता है।',
        explanationEn: 'Santali uses core vowels plus the distinctive central vowel (a़ / ə) and phonemic nasalization that can change word meanings.',
        santaliDev: 'ओल चिकी रे ६ गोटाङ मूल स्वर (अ, आ, इ, उ, ए, ओ) मेनाक्आ।',
        santaliRoman: 'Ol Chiki re 6 gotang mul swar menaq-a.',
      },
      {
        heading: '२. चार रुद्ध ध्वनियाँ (Checked / Glottalized Consonants)',
        explanationHi: 'संताली ध्वनि-विज्ञान की सबसे अनोखी विशेषता चार रुद्ध ध्वनियाँ हैं — क्\', च्\', त्\', प्\'। इनका उच्चारण करते समय हवा बाहर नहीं छोड़ी जाती बल्कि कंठ में हल्के से रोक दी जाती है। इन्हें देवनागरी में हलंत+अपोस्ट्रोफी (क्\') या ओल चिकी में ओहत् चिह्न से दिखाते हैं।',
        explanationEn: 'The four checked consonants (k\', c\', t\', p\') are unreleased glottalized stops where airflow is held rather than exploded outward.',
      },
      {
        heading: '३. ओल चिकी और देवनागरी लिपि परिचय',
        explanationHi: 'पंडित रघुनाथ मुर्मू (गुरु गोमके) ने १९२५ में संताली के लिए ३० अक्षरों वाली "ओल चिकी" लिपि का निर्माण किया। झारखंड, बिहार और हिंदी-भाषी क्षेत्रों में देवनागरी लिपि तथा रोमन लिपि भी व्यापक रूप से प्रचलित हैं।',
        explanationEn: 'Pandit Raghunath Murmu created the 30-letter Ol Chiki script in 1925; Devanagari and Roman scripts are also widely used for Santali education.',
      },
    ],
    table: {
      title: 'संताली की ४ रुद्ध ध्वनियाँ व अर्थ-भेद (Checked Stops)',
      columns: ['रुद्ध ध्वनि', 'संताली उदाहरण', 'रोमन उच्चारण', 'हिंदी / English अर्थ'],
      rows: [
        ['क्\' (अक्)', 'दाक्\' / ओड़ाक्\'', "Dak' / Oṛak'", 'पानी (Water) / घर (House)'],
        ['च्\' (अच्)', 'मित्\' / हेच्\'', "Mit' / Hec'", 'एक (One) / आना (Come)'],
        ['त्\' (अत्)', 'आत्\' / जा़पित्\'', "At' / Japit'", 'खोना (Lose) / सोना (Sleep)'],
        ['प्\' (अप्)', 'दुड़ुप्\' / आ़युप्\'', "Duṛup' / Ayup'", 'बैठना (Sit) / शाम (Evening)'],
      ],
    },
    examples: [
      { santaliDev: 'दाक्\' ञु मे।', santaliRoman: "Dak' ñu me.", hindi: 'पानी पियो।', english: 'Drink water.', note: 'दाक्\' में क्\' रुद्ध ध्वनि है' },
      { santaliDev: 'नोंडे दुड़ुप्\' मे।', santaliRoman: "Nonde duṛup' me.", hindi: 'यहाँ बैठो।', english: 'Sit here.', note: 'दुड़ुप्\' में प्\' रुद्ध ध्वनि है' },
      { santaliDev: 'उनी ओड़ाक्\' ए सेन एना।', santaliRoman: "Uni oṛak' e sen ena.", hindi: 'वह घर चला गया।', english: 'He/She went home.' },
    ],
  },

  // ─── CHAPTER 03 ──────────────────────────────────────────────────────────
  {
    id: 'ch03_chinha',
    number: '03',
    tier: 'foundations',
    titleSantaliDev: 'चिन्हा (विराम चिह्न)',
    titleSantaliRoman: 'Chinha (Punctuation)',
    titleHi: 'संताली लेखन में विराम चिह्नों का प्रयोग',
    titleEn: 'Punctuation Marks in Santali Writing',
    summaryHi: 'वाक्य को स्पष्ट, अर्थपूर्ण और पढ़ने में सरल बनाने वाले विराम चिह्न: मुचा़त् चिन्हा, था़ड़ी चिन्हा, कुली चिन्हा और हाहाड़ा चिन्हा।',
    summaryEn: 'Essential punctuation marks that clarify pauses, questions, exclamations, and quoted speech in Santali prose.',
    keyFormula: 'सही विराम चिह्न = सही ठहराव + स्पष्ट भाव + त्रुटिहीन पठन',
    rules: [
      {
        heading: '१. मुचा़त् चिन्हा (पूर्णविराम — । / .)',
        explanationHi: 'जब कोई सामान्य वाक्य या कथन पूरा हो जाता है, तब अंत में पूर्णविराम (देवनागरी में `।`, ओल चिकी में `᱾`, रोमन में `.`) लगाया जाता है।',
        explanationEn: 'Used at the end of every declarative or imperative statement.',
        santaliDev: 'इञ दो इस्कूल तेञ चलाक् काना।',
        santaliRoman: 'Iñ do iskul teñ chalaq kana.',
      },
      {
        heading: '२. था़ड़ी चिन्हा (अल्पविराम — ,) और योजक (-)',
        explanationHi: 'वाक्य के बीच थोड़ा रुकने, अनेक वस्तुओं की सूची दिखाने या संबोधन अलग करने के लिए अल्पविराम (`,`) लगता है। जोड़ा शब्दों (जैसे दाका-उतु, एंगा-आपा) के बीच योजक (`-`) लगता है।',
        explanationEn: 'Commas separate listed items and brief pauses; hyphens join paired compound words (Jora Katha).',
      },
      {
        heading: '३. कुली चिन्हा (?) और हाहाड़ा चिन्हा (!)',
        explanationHi: 'प्रश्न पूछने वाले वाक्यों (चेत्, ओकोय, ओकारे, तिस) के अंत में प्रश्नवाचक चिह्न (`?`) तथा हर्ष, शोक, आश्चर्य या पुकार के भाव में विस्मयादिबोधक चिह्न (`!`) लगाते हैं।',
        explanationEn: 'Question marks close interrogative sentences; exclamation marks express surprise, joy, or urgent calls.',
      },
    ],
    table: {
      title: 'प्रमुख संताली विराम चिह्न तालिका (Punctuation Reference)',
      columns: ['चिह्न', 'संताली नाम', 'हिंदी नाम', 'उदाहरण प्रयोग'],
      rows: [
        ['। / ᱾', 'मुचा़त् चिन्हा', 'पूर्णविराम', 'दारे रे जो मेनाक्आ।'],
        [',', 'था़ड़ी चिन्हा', 'अल्पविराम', 'उल, कांटाड़ आर का़यरा जोम मे।'],
        ['?', 'कुली चिन्हा', 'प्रश्नवाचक', 'आमाक् ञुतुम दो चेत् काना?'],
        ['!', 'हाहाड़ा चिन्हा', 'विस्मयादिबोधक', 'आहा! तिनैक् नापाय बाहा!'],
        ['-', 'जोनोड़ चिन्हा', 'योजक चिह्न', 'एंगा-आपा, दाका-उतु'],
        ['" "', 'कथा चिन्हा', 'उद्धरण चिह्न', 'मांझी मेन् केदा, "सारी कथा रोड़ पे।"'],
      ],
    },
    examples: [
      { santaliDev: 'आम ओकातेम चलाक् काना?', santaliRoman: 'Am okatem chalaq kana?', hindi: 'तुम कहाँ जा रहे हो?', english: 'Where are you going?' },
      { santaliDev: 'आहा! तेहेञ दो आ़डी नापाय दाक्\' एत्आ!', santaliRoman: "Aha! Teheñ do aḍi napay dak' et'-a!", hindi: 'आहा! आज बहुत अच्छी बारिश हो रही है!', english: 'Aha! It is raining wonderfully today!' },
      { santaliDev: 'बाजार खोन चावले, दाल आर बुलुङ आ़गू मे।', santaliRoman: 'Bajar khon chawle, dal ar bulung agu me.', hindi: 'बाज़ार से चावल, दाल और नमक लाओ।', english: 'Bring rice, lentils, and salt from the market.' },
    ],
  },

  // ─── CHAPTER 04 ──────────────────────────────────────────────────────────
  {
    id: 'ch04_sabad_tongen',
    number: '04',
    tier: 'foundations',
    titleSantaliDev: 'साबाद आर तोंगेन',
    titleSantaliRoman: 'Sabad ar Tongen',
    titleHi: 'शब्द-निर्माण, उपसर्ग, मध्यसर्ग और प्रत्यय',
    titleEn: 'Word Formation, Prefixes, Infixes & Suffixes',
    summaryHi: 'संताली एक संश्लेषणात्मक (Agglutinative) भाषा है जिसमें मूल धातु के आगे, बीच (मध्यसर्ग) और पीछे शब्दांश जोड़कर सैकड़ों नए अर्थ बनते हैं।',
    summaryEn: 'How Santali builds rich vocabulary by attaching prefixes, infixes (-p-, -n-, -m-), and suffixes to root morphemes.',
    keyFormula: 'नया शब्द = [लाहा तोंगेन] + मूल शब्द (ताला तोंगेन सहित) + [तायोम तोंगेन]',
    rules: [
      {
        heading: '१. मूल शब्द व यौगिक शब्द (Root & Compound Words)',
        explanationHi: 'जो शब्द बिना किसी अन्य शब्दांश के स्वतंत्र अर्थ देते हैं वे मूल शब्द हैं (जैसे दाक्\', दारे, होड़)। दो शब्दों के मेल से यौगिक या जोड़ा शब्द बनते हैं (जैसे सिञ-चांदो = सूर्य, दाका-उतु = भोजन)।',
        explanationEn: 'Root words carry independent meaning (dak\', dare); compound words combine two roots to express broader concepts.',
      },
      {
        heading: '२. ताला तोंगेन (मध्यसर्ग / Infixes — संताली की विशेष पहचान)',
        explanationHi: 'संताली में शब्द के पहले स्वर के ठीक बाद मध्यसर्ग जोड़कर नया शब्द बनाया जाता है: `-प-` जोड़ने पर पारस्परिक क्रिया (जैसे `ञेल` देखना → `ञेपेल` आपस में मिलना; `दाल` मारना → `दापाल` आपस में लड़ना) और `-न-` जोड़ने पर संज्ञा (जैसे `ओल` लिखना → `ओनोल` लेख/निबंध; `रोड़` बोलना → `रोनौड़` व्याकरण) बनती है।',
        explanationEn: 'Infixes insert inside the root: -p- creates reciprocal verbs (ñel -> ñepel "meet each other"), while -n- creates nouns (ol -> onol "writing/essay").',
        santaliDev: 'ओल (लिखना) + -न- → ओनोल (लेख/निबंध) · रोड़ (बोलना) + -न- → रोनौड़ (व्याकरण)',
        santaliRoman: 'Ol + -n- -> Onol (essay) · Roṛ + -n- -> Ronoṛ (grammar)',
      },
      {
        heading: '३. तायोम तोंगेन (प्रत्यय / Suffixes)',
        explanationHi: 'शब्द के अंत में जुड़ने वाले प्रत्यय वचन (`-किन`, `-को`), कारक (`-रे`, `-ते`, `-खोन`), और काल (`-केदा`, `-काना`, `-आ`) को प्रकट करते हैं।',
        explanationEn: 'Suffixes attach at the end to mark number (-kin, -ko), case (-re, -te, -khon), and tense (-keda, -kana, -a).',
      },
    ],
    table: {
      title: 'मध्यसर्ग (Infix) से बने अद्भुत संताली शब्द',
      columns: ['मूल शब्द', 'मध्यसर्ग (Infix)', 'नया संताली शब्द', 'नया अर्थ'],
      rows: [
        ['ओल (लिखना)', '-न- (-n-)', 'ओनोल (Onol)', 'लेख, रचना, निबंध'],
        ['रोड़ (बोलना)', '-न- (-n-)', 'रोनौड़ (Ronoṛ)', 'व्याकरण, भाषा-नियम'],
        ['ञेल (देखना)', '-प- (-p-)', 'ञेपेल (Ñepel)', 'एक-दूसरे से मिलना/भेंट'],
        ['दाल (मारना)', '-प- (-p-)', 'दापाल (Dapal)', 'आपस में लड़ाई करना'],
        ['जोम (खाना)', '-न- (-n-)', 'जोनोम / जोनोमाक्', 'भोज्य पदार्थ / जन्म'],
      ],
    },
    examples: [
      { santaliDev: 'आलाङ बाजार रेलाङ ञेपेल एना।', santaliRoman: 'Alang bajar relang ñepel ena.', hindi: 'हम दोनों बाज़ार में एक-दूसरे से मिले।', english: 'The two of us met each other at the market.' },
      { santaliDev: 'नोवा दो मित् गोटाङ नापाय ओनोल काना।', santaliRoman: "Nowa do mit' gotang napay onol kana.", hindi: 'यह एक अच्छा निबंध/लेख है।', english: 'This is a fine essay.' },
      { santaliDev: 'गिदरा़ को दो आलोपे दापाला।', santaliRoman: 'Gidra ko do alope dapala.', hindi: 'बच्चों, आपस में मत लड़ो।', english: 'Children, do not fight with each other.' },
    ],
  },

  // ─── CHAPTER 05 ──────────────────────────────────────────────────────────
  {
    id: 'ch05_nutum',
    number: '05',
    tier: 'foundations',
    titleSantaliDev: 'ञुतुम (संज्ञा)',
    titleSantaliRoman: 'Ñutum (Noun)',
    titleHi: 'संज्ञा, उसके भेद और सजीव-निर्जीव वर्गीकरण',
    titleEn: 'Nouns, Types & Animate vs. Inanimate Distinction',
    summaryHi: 'संज्ञा के पाँच पारंपरिक भेद और संताली व्याकरण का सबसे अहम नियम: जीवीयान (सजीव) बनाम बीना-जीवी (निर्जीव) संज्ञाएँ।',
    summaryEn: 'The five types of nouns plus Santali’s core grammatical divide between Animate (Jiwiyan) and Inanimate (Bina-jiwi) nouns.',
    keyFormula: 'सजीव (जीवीयान) → -किन/-को, रेन · निर्जीव (बीना-जीवी) → रेयाक् / आक्',
    rules: [
      {
        heading: '१. ञुतुम (संज्ञा) के पाँच भेद',
        explanationHi: 'किसी व्यक्ति, प्राणी, स्थान, वस्तु या भाव के नाम को ञुतुम (संज्ञा) कहते हैं। इसके ५ भेद हैं: (१) आसोल ञुतुम (व्यक्तिवाचक — सिदो, कान्हू, दुमका), (२) जा़त ञुतुम (जातिवाचक — होड़, गाय, दारे), (३) गा़देल् ञुतुम (समूहवाचक — आतु, हाट, बा़इसी), (४) जिनिस ञुतुम (द्रव्यवाचक — दाक्\', सोना, चावले), (५) गुन ञुतुम (भाववाचक — दुला़ड़, रा़स्का़, सा़री)।',
        explanationEn: 'Nouns classify into Proper (Asol), Common (Jat), Collective (Gadel), Material (Jinis), and Abstract (Gun).',
      },
      {
        heading: '२. जीवीयान (सजीव) और बीना-जीवी (निर्जीव) का नियम',
        explanationHi: 'संताली व्याकरण में संज्ञा को सजीव और निर्जीव वर्ग में बाँटना अनिवार्य है। मनुष्य, पशु, पक्षी, कीट, और सूर्य-चंद्रमा-तारे (इपिल, चांदो) तथा बोंगा (देवता) को व्याकरण में "जीवीयान" (सजीव) माना जाता है। जबकि पेड़, पत्थर, घर, पानी और पुस्तक "बीना-जीवी" (निर्जीव) हैं।',
        explanationEn: 'Animate nouns include humans, animals, deities, and celestial bodies (sun, moon, stars). Plants, stones, tools, and water are grammatically inanimate.',
        santaliDev: 'हातु रेन होड़ (सजीव) · हातु रेयाक् दारे (निर्जीव)',
        santaliRoman: 'Hatu ren hoṛ (Animate) · Hatu reyaq dare (Inanimate)',
      },
    ],
    table: {
      title: 'संज्ञा के ५ भेद (Five Classes of Ñutum)',
      columns: ['संज्ञा भेद', 'संताली नाम', 'उदाहरण (देवनागरी)', 'अर्थ'],
      rows: [
        ['व्यक्तिवाचक', 'आसोल ञुतुम', 'सिदो, लुगुबुरु, दुमका', 'विशेष नाम, पर्वत, शहर'],
        ['जातिवाचक', 'जा़त ञुतुम', 'होड़, सेता, चेँड़े, दारे', 'मनुष्य, कुत्ता, पक्षी, पेड़'],
        ['समूहवाचक', 'गा़देल् ञुतुम', 'आतु, बा़इसी, पा़ल्टोन', 'गाँव, सभा, दल'],
        ['द्रव्यवाचक', 'जिनिस ञुतुम', 'दाक्\', चावले, मेड़हेत्', 'जल, चावल, लोहा'],
        ['भाववाचक', 'गुन ञुतुम', 'दुला़ड़, रा़स्का़, दा़या', 'प्रेम, खुशी, करुणा'],
      ],
    },
    examples: [
      { santaliDev: 'सिदो आर कान्हू दो हुल रेन वीर कानाकिन।', santaliRoman: 'Sido ar Kanhu do Hul ren bir kanakin.', hindi: 'सिदो और कान्हू हुल के वीर हैं।', english: 'Sido and Kanhu are heroes of the Hul.' },
      { santaliDev: 'ओड़ाक् रेयाक् दुआर झिच् मे।', santaliRoman: "Oṛak' reyaq duar jhic' me.", hindi: 'घर का दरवाज़ा खोलो।', english: 'Open the door of the house.', note: 'दुआर निर्जीव है, इसलिए रेयाक् लगा' },
      { santaliDev: 'आतु रेन गिदरा़ को एनेच् काना।', santaliRoman: "Atu ren gidra ko enec' kana.", hindi: 'गाँव के बच्चे खेल रहे हैं।', english: 'The children of the village are playing.', note: 'गिदरा़ सजीव हैं, इसलिए रेन लगा' },
    ],
  },

  // ─── CHAPTER 06 ──────────────────────────────────────────────────────────
  {
    id: 'ch06_janang',
    number: '06',
    tier: 'parts_of_speech',
    titleSantaliDev: 'जानाङ (लिंग)',
    titleSantaliRoman: 'Janang (Gender)',
    titleHi: 'संताली में लिंग के चार भेद',
    titleEn: 'Four-Way Grammatical Gender in Santali',
    summaryHi: 'हिंदी की तरह क्रिया लिंग के अनुसार नहीं बदलती; संताली में लिंग प्राकृतिक अर्थ पर आधारित चार वर्गों में बँटा है।',
    summaryEn: 'Unlike Hindi, Santali verbs do not inflect for masculine/feminine gender; gender is lexical across four clear categories.',
    keyFormula: '४ लिंग: कोड़ा जानाङ (पुल्लिंग) · कुड़ी जानाङ (स्त्रीलिंग) · बार जानाङ (उभयलिंग) · जानाङ बाङ (निर्जीव)',
    rules: [
      {
        heading: '१. चार प्रकार के जानाङ (लिंग)',
        explanationHi: '(१) कोड़ा जानाङ (पुल्लिंग): पुरुष या नर प्राणी (बाबा, कोड़ा, सांड)। (२) कुड़ी जानाङ (स्त्रीलिंग): स्त्री या मादा प्राणी (गोगो, कुड़ी, गाय)। (३) बार जानाङ (उभयलिंग): नर-मादा दोनों के लिए एक शब्द (होड़, गिदरा़, चेँड़े, हा़कू)। (४) जानाङ बाङ (नपुंसक/निर्जीव): बेजान वस्तुएँ (धिरी, पुथी, दारे, दाक्\')।',
        explanationEn: 'Santali distinguishes Masculine (Koṛa), Feminine (Kuṛi), Common (Bar Janang), and Neuter/Inanimate (Janang Bang).',
      },
      {
        heading: '२. पशु-पक्षियों में लिंग पहचानने की युक्ति',
        explanationHi: 'उभयलिंग पशु-पक्षियों में नर दिखाने के लिए "सांड" या "आ़ड़िया" और मादा दिखाने के लिए "एंगा" या "पाठी" जोड़ा जाता है — जैसे `सिम सांड` (मुर्गा) और `सिम एंगा` (मुर्गी); `मेरोम बोदा` (बकरा) और `मेरोम एंगा` (बकरी)।',
        explanationEn: 'For common animal nouns, add sand/boda for male and enga/kalot for female (e.g., sim sand = rooster, sim enga = hen).',
      },
      {
        heading: '३. क्रिया पर लिंग का प्रभाव नहीं',
        explanationHi: 'संताली में "लड़का खा रहा है" और "लड़की खा रही है" दोनों में क्रिया रूप समान रहता है (`कोड़ा ए जोम काना` / `कुड़ी ए जोम काना`)। यही बात संताली सीखना बेहद सरल बनाती है।',
        explanationEn: 'Santali verbs stay identical for masculine and feminine subjects, making verb conjugation cleaner than Hindi.',
      },
    ],
    table: {
      title: 'प्रमुख पुल्लिंग–स्त्रीलिंग शब्द युग्म (Gender Pairs)',
      columns: ['पुल्लिंग (कोड़ा जानाङ)', 'अर्थ', 'स्त्रीलिंग (कुड़ी जानाङ)', 'अर्थ'],
      rows: [
        ['बाबा / आपात', 'पिता', 'आयो / एंगात', 'माता'],
        ['हाड़ाम', 'वृद्ध पुरुष', 'बुढ़ी', 'वृद्ध स्त्री'],
        ['कोड़ा', 'लड़का / युवक', 'कुड़ी', 'लड़की / युवती'],
        ['दादा', 'बड़ा भाई', 'दा़ई', 'बड़ी बहन'],
        ['सिम सांड', 'मुर्गा', 'सिम एंगा', 'मुर्गी'],
        ['डांगरा / सांड', 'बैल / सांड', 'गाय', 'गाय'],
      ],
    },
    examples: [
      { santaliDev: 'कोड़ा गिदरा़ पुथी ए पढ़ाव काना।', santaliRoman: 'Koṛa gidra puthi e paṛhaw kana.', hindi: 'लड़का किताब पढ़ रहा है।', english: 'The boy is reading a book.' },
      { santaliDev: 'कुड़ी गिदरा़ पुथी ए पढ़ाव काना।', santaliRoman: 'Kuṛi gidra puthi e paṛhaw kana.', hindi: 'लड़की किताब पढ़ रही है।', english: 'The girl is reading a book.', note: 'क्रिया "पढ़ाव काना" दोनों में समान है' },
      { santaliDev: 'सिम सांड सेताक् रे ए राक्आ।', santaliRoman: "Sim sand setaq re e raq-a.", hindi: 'मुर्गा सुबह बाँग देता है।', english: 'The rooster crows in the morning.' },
    ],
  },

  // ─── CHAPTER 07 ──────────────────────────────────────────────────────────
  {
    id: 'ch07_gotang',
    number: '07',
    tier: 'parts_of_speech',
    titleSantaliDev: 'गोटाङ (वचन)',
    titleSantaliRoman: 'Gotang (Number)',
    titleHi: 'तीन वचन: एकवचन, द्विवचन और बहुवचन',
    titleEn: 'Three Grammatical Numbers: Singular, Dual & Plural',
    summaryHi: 'संस्कृत की तरह संताली में भी ठीक दो वस्तुओं या व्यक्तियों के लिए स्वतंत्र द्विवचन (-किन) तथा अनेक के लिए बहुवचन (-को) होता है।',
    summaryEn: 'Santali preserves a distinct three-way number system: Singular (Mit\'), Dual (-kin for exactly two), and Plural (-ko for three or more).',
    keyFormula: 'एकवचन = मूल शब्द · द्विवचन = शब्द + किन (-kin) · बहुवचन = शब्द + को (-ko)',
    rules: [
      {
        heading: '१. मित् गोटाङ (एकवचन / Singular)',
        explanationHi: 'किसी एक व्यक्ति, प्राणी या वस्तु का बोध कराने के लिए मूल संज्ञा बिना किसी वचन प्रत्यय के लिखी जाती है, या आगे `मित्` / `मित् गोटाङ` जोड़ा जाता है (जैसे `होड़`, `मित् सेता`)।',
        explanationEn: 'Singular uses the bare noun or the numeral mit\' (one).',
      },
      {
        heading: '२. बार गोटाङ (द्विवचन / Dual — प्रत्यय -किन)',
        explanationHi: 'जब संख्या ठीक दो हो, तो सजीव संज्ञा के अंत में `-किन` प्रत्यय जुड़ता है और क्रिया में भी `-किन` कर्ता चिह्न आता है — जैसे `होड़किन` (दो लोग), `गायकिन` (दो गायें), `चेँड़ेकिन` (दो पक्षी)।',
        explanationEn: 'Exactly two animate entities take the dual suffix -kin on the noun and matching -kin agreement in the verb.',
      },
      {
        heading: '३. सांगे गोटाङ (बहुवचन / Plural — प्रत्यय -को)',
        explanationHi: 'तीन या तीन से अधिक के लिए `-को` प्रत्यय लगता है — जैसे `होड़को` (बहुत लोग), `गिदरा़को` (बच्चे), `पुथीको` (पुस्तकें)। निर्जीव वस्तुओं में जब संख्या पहले लिखी हो (`मोड़े गोटाङ दारे` = ५ पेड़), तो `-को` लगाना अनिवार्य नहीं होता।',
        explanationEn: 'Three or more take -ko. With inanimate nouns preceded by an explicit numeral, -ko is optional.',
      },
    ],
    table: {
      title: 'एकवचन, द्विवचन व बहुवचन परिवर्तन तालिका',
      columns: ['एकवचन (१)', 'द्विवचन (२)', 'बहुवचन (३+)', 'हिंदी अर्थ'],
      rows: [
        ['होड़ (Hoṛ)', 'होड़किन (Hoṛkin)', 'होड़को (Hoṛko)', 'व्यक्ति / दो लोग / सब लोग'],
        ['गिदरा़ (Gidra)', 'गिदरा़किन (Gidrakin)', 'गिदरा़को (Gidrako)', 'बच्चा / दो बच्चे / बच्चे'],
        ['सेता (Seta)', 'सेताकिन (Setakin)', 'सेताको (Setako)', 'कुत्ता / दो कुत्ते / कुत्ते'],
        ['चेँड़े (Cheṅṛe)', 'चेँड़ेकिन (Cheṅṛekin)', 'चेँड़ेको (Cheṅṛeko)', 'पक्षी / दो पक्षी / पक्षी'],
        ['दारे (Dare)', 'बारया दारे', 'दारेको / सांगे दारे', 'पेड़ / दो पेड़ / अनेक पेड़'],
      ],
    },
    examples: [
      { santaliDev: 'बारया कोड़ाकिन गाते काना।', santaliRoman: 'Barya koṛakin gate kana.', hindi: 'दो लड़के खेल रहे हैं।', english: 'Two boys are playing.' },
      { santaliDev: 'आतु रेन होड़को बा़इसी रेको जाराव आकाना।', santaliRoman: 'Atu ren hoṛko baisi reko jaraw akana.', hindi: 'गाँव के लोग सभा में इकट्ठा हुए हैं।', english: 'The villagers have gathered in the council.' },
      { santaliDev: 'मित् चेँड़े दारे रे दुड़ुप् आकाना।', santaliRoman: "Mit' cheṅṛe dare re duṛup' akana.", hindi: 'एक चिड़िया पेड़ पर बैठी है।', english: 'A bird is perched on the tree.' },
    ],
  },

  // ─── CHAPTER 08 ──────────────────────────────────────────────────────────
  {
    id: 'ch08_sanga_karak',
    number: '08',
    tier: 'parts_of_speech',
    titleSantaliDev: 'सांगा / कारक',
    titleSantaliRoman: 'Sanga / Karak (Case)',
    titleHi: 'संताली के आठ कारक व विभक्ति चिह्न',
    titleEn: 'The Eight Grammatical Cases & Postpositions',
    summaryHi: 'वाक्य में संज्ञा या सर्वनाम का क्रिया के साथ संबंध बताने वाले परसर्ग: ते, ला़गित्, खोन, रेन/रेयाक् और रे।',
    summaryEn: 'How postpositions (te, lagit\', khon, ren/reyaq, re) connect nouns to actions across all eight grammatical cases.',
    keyFormula: 'करण = ते · संप्रदान = ला़गित् · अपादान = खोन · संबंध = रेन (सजीव) / रेयाक् (निर्जीव) · अधिकरण = रे',
    rules: [
      {
        heading: '१. कर्ता और कर्म कारक',
        explanationHi: 'संताली में कर्ता और कर्म के साथ अलग से हिंदी जैसा "ने" या "को" नहीं लगता; बल्कि कर्ता और कर्म की पहचान क्रिया में जुड़े चिह्नों और वाक्य-क्रम (SOV) से होती है।',
        explanationEn: 'Nominative and Accusative generally carry zero case markers on the noun; grammatical roles are tracked by word order and verb markers.',
      },
      {
        heading: '२. करण (`ते`) बनाम अपादान (`खोन`)',
        explanationHi: 'साधन या माध्यम बताने के लिए `ते` लगता है (जैसे `कोलोम ते` = कलम से, `का़टुप् ते` = उँगली से)। अलग होने या शुरुआत का स्थान बताने के लिए `खोन` लगता है (जैसे `दारे खोन साकाम ञूर एना` = पेड़ से पत्ता गिरा)।',
        explanationEn: 'Use te for instruments/means ("with a pen") and khon for separation/source ("from the tree").',
      },
      {
        heading: '३. संबंध कारक में सजीव (`रेन`) और निर्जीव (`रेयाक् / आक्`) का भेद',
        explanationHi: 'यह परीक्षाओं में सबसे अधिक पूछा जाने वाला नियम है: यदि संबंधित वस्तु या व्यक्ति सजीव हो तो `रेन` या `इच्` लगता है (`आतु रेन मांझी` = गाँव का मांझी), और यदि निर्जीव हो तो `रेयाक्` या `आक्` लगता है (`दारे रेयाक् साकाम` = पेड़ का पत्ता)।',
        explanationEn: 'Possessive markers split strictly by animacy of the possessed noun: ren for animate, reyaq/aq for inanimate.',
      },
    ],
    table: {
      title: 'संताली कारक व विभक्ति तालिका (8 Cases)',
      columns: ['कारक (हिंदी)', 'संताली परसर्ग', 'संताली उदाहरण', 'हिंदी अनुवाद'],
      rows: [
        ['कर्ता (Nominative)', '(शून्य)', 'राम दाका ए जोम काना।', 'राम भात खा रहा है।'],
        ['कर्म (Accusative)', '(शून्य)', 'इञ पुथीञ पढ़ाव काना।', 'मैं किताब पढ़ रहा हूँ।'],
        ['करण (Instrumental)', 'ते (te)', 'कोलोम तेञ ओल काना।', 'मैं कलम से लिख रहा हूँ।'],
        ['संप्रदान (Dative)', 'ला़गित् (lagit\')', 'गिदरा़ ला़गित् तोवा आ़गू मे।', 'बच्चे के लिए दूध लाओ।'],
        ['अपादान (Ablative)', 'खोन (khon)', 'दारे खोन साकाम ञूर एना।', 'पेड़ से पत्ता गिर गया।'],
        ['संबंध (Genitive)', 'रेन / रेयाक्', 'आतु रेन होड़ / बुरु रेयाक् दाक्\'', 'गाँव के लोग / पहाड़ का पानी'],
        ['अधिकरण (Locative)', 'रे (re)', 'ओड़ाक् रे बाबा मेनाया।', 'घर में पिताजी हैं।'],
        ['संबोधन (Vocative)', 'ए / ए हो / ए बाबू', 'ए बाबू! नोंडे हिजुक् मे।', 'हे बाबू! यहाँ आओ।'],
      ],
    },
    examples: [
      { santaliDev: 'इञ रांची खोन दुमका तेञ सेन एना।', santaliRoman: 'Iñ Ranchi khon Dumka teñ sen ena.', hindi: 'मैं राँची से दुमका गया।', english: 'I went from Ranchi to Dumka.' },
      { santaliDev: 'दारे रेयाक् जो दो आ़डी सिबिला।', santaliRoman: 'Dare reyaq jo do aḍi sibila.', hindi: 'पेड़ का फल बहुत मीठा है।', english: 'The fruit of the tree is very sweet.' },
      { santaliDev: 'आलेयाक् इस्कूल रेन माचेत् दो आ़डी नापाया।', santaliRoman: 'Aleyaq iskul ren machet\' do aḍi napaya.', hindi: 'हमारे विद्यालय के शिक्षक बहुत अच्छे हैं।', english: 'The teacher of our school is very good.' },
    ],
  },

  // ─── CHAPTER 09 ──────────────────────────────────────────────────────────
  {
    id: 'ch09_unutum',
    number: '09',
    tier: 'parts_of_speech',
    titleSantaliDev: 'उञुतुम (सर्वनाम)',
    titleSantaliRoman: 'Uñutum (Pronoun)',
    titleHi: 'सर्वनाम व समावेशी-अपवर्जक (Inclusive / Exclusive) नियम',
    titleEn: 'Pronouns & Inclusive vs. Exclusive First Person',
    summaryHi: 'संज्ञा के स्थान पर प्रयुक्त होने वाले शब्द और संताली के ११ पुरुषवाचक सर्वनामों की सटीक व्यवस्था।',
    summaryEn: 'Master the 11 personal pronouns—including Santali’s famous distinction between listener-included and listener-excluded "we".',
    keyFormula: 'श्रोता शामिल = आलाङ (हम २), आबोन (हम सब) · श्रोता बाहर = आलिञ (हम २), आले (हम सब)',
    rules: [
      {
        heading: '१. पुरुषवाचक सर्वनाम — ११ रूप (१st, २nd, ३rd Person)',
        explanationHi: 'उत्तम पुरुष में ५ रूप होते हैं: `इञ` (मैं), `आलाङ` (हम दोनों — तू और मैं), `आलिञ` (हम दोनों — वह और मैं, तू नहीं), `आबोन` (हम सब — आप सहित), `आले` (हम सब — आप नहीं)। मध्यम पुरुष में ३ रूप: `आम` (तुम), `आबेन` (तुम दोनों), `आपे` (तुम सब)। अन्य पुरुष में ३ रूप: `उनी` (वह), `उनकिन` (वे दोनों), `उनकु` (वे सब)।',
        explanationEn: 'First person splits dual and plural into inclusive (alang, abon) and exclusive (aliñ, ale); second and third persons each have singular, dual, and plural forms.',
      },
      {
        heading: '२. निश्चयवाचक सर्वनाम में सजीव-निर्जीव भेद',
        explanationHi: 'निकट सजीव के लिए `नुई` (यह व्यक्ति/प्राणी) और निकट निर्जीव के लिए `नोवा` (यह वस्तु) लगता है। दूर सजीव के लिए `उनी` / `हानी` और दूर निर्जीव के लिए `ओना` / `हाना` प्रयोग होता है।',
        explanationEn: 'Demonstratives also respect animacy: nui/uni (this/that animate) vs. nowa/ona (this/that inanimate).',
      },
      {
        heading: '३. प्रश्नवाचक एवं अनिश्चयवाचक सर्वनाम',
        explanationHi: 'सजीव प्रश्न के लिए `ओकोय` (कौन?) और निर्जीव प्रश्न के लिए `चेत्` (क्या?) प्रयुक्त होता है। अनिश्चय के लिए `जाहाँय` (कोई सजीव) और `जाहाँनाक्` (कुछ निर्जीव) आता है।',
        explanationEn: 'Interrogatives: okoy (who, animate) vs. chet\' (what, inanimate). Indefinites: jahany (someone) vs. jahanaq (something).',
      },
    ],
    table: {
      title: 'संताली पुरुषवाचक सर्वनाम पूर्ण सारणी (11 Personal Pronouns)',
      columns: ['पुरुष', 'एकवचन (१)', 'द्विवचन (२)', 'बहुवचन (३+)'],
      rows: [
        ['उत्तम (समावेशी)', 'इञ (मैं)', 'आलाङ (मैं + तू)', 'आबोन (हम + आप सब)'],
        ['उत्तम (अपवर्जक)', '—', 'आलिञ (मैं + वह)', 'आले (हम लोग, आप नहीं)'],
        ['मध्यम पुरुष', 'आम (तुम/तू)', 'आबेन (तुम दोनों)', 'आपे (तुम सब / आप सब)'],
        ['अन्य पुरुष (सजीव)', 'उनी (वह)', 'उनकिन (वे दोनों)', 'उनकु (वे सब)'],
      ],
    },
    examples: [
      { santaliDev: 'आबोन दो जोतो होड़ मित् गीबोन।', santaliRoman: 'Abon do joto hoṛ mit\' gibon.', hindi: 'हम सब लोग एक ही हैं (आप सहित)।', english: 'All of us (including you) are one.' },
      { santaliDev: 'आले दो गापा हातु ले चलाक्आ।', santaliRoman: 'Ale do gapa hatu le chalaq-a.', hindi: 'हम लोग कल गाँव जाएँगे (आप नहीं)।', english: 'We (excluding you) will go to the village tomorrow.' },
      { santaliDev: 'नुई दो इञिच् गाते कानाय आर नोवा दो इञाक् पुथी काना।', santaliRoman: 'Nui do iñic\' gate kanay ar nowa do iñaq puthi kana.', hindi: 'यह मेरा मित्र है और यह मेरी किताब है।', english: 'This is my friend and this is my book.' },
    ],
  },

  // ─── CHAPTER 10 ──────────────────────────────────────────────────────────
  {
    id: 'ch10_gunum',
    number: '10',
    tier: 'parts_of_speech',
    titleSantaliDev: 'गुनुम (विशेषण)',
    titleSantaliRoman: 'Gunum (Adjective)',
    titleHi: 'विशेषण के प्रकार और तुलनात्मक रूप',
    titleEn: 'Adjectives & Degrees of Comparison',
    summaryHi: 'संज्ञा या सर्वनाम के गुण, रंग, आकार, संख्या और परिमाण बताने वाले शब्द तथा "खोन" द्वारा तुलना करने की विधि।',
    summaryEn: 'Descriptive, quantitative, and numeral adjectives, plus comparative (khon) and superlative (joto khon) constructions.',
    keyFormula: 'तुलना (Comparative) = संज्ञा + खोन + विशेषण · सर्वश्रेष्ठ (Superlative) = जोतो खोन + विशेषण',
    rules: [
      {
        heading: '१. विशेषण का स्थान और अपरिवर्तनीय रूप',
        explanationHi: 'संताली में विशेषण सामान्यतः संज्ञा से ठीक पहले आता है (`नापाय होड़` = अच्छा इंसान, `आराक् बाहा` = लाल फूल) और वचन या लिंग के कारण इसका रूप नहीं बदलता।',
        explanationEn: 'Adjectives precede nouns and remain invariant across gender and number.',
      },
      {
        heading: '२. विशेषण के मुख्य प्रकार',
        explanationHi: '(१) गुणवाचक: `नापाय` (अच्छा), `बा़ड़िच्` (बुरा), `माराङ` (बड़ा), `हुडिञ` (छोटा), `पुंड` (सफेद), `हेँदे` (काला)। (२) संख्यावाचक: `मित्` (१), `बार` (२), `पे` (३), `पोन` (४), `मोड़े` (५)। (३) परिमाणवाचक: `आ़डी` (बहुत), `थोड़ान` (थोड़ा), `ढा़ेर` (अधिक)।',
        explanationEn: 'Major categories include Quality (napay, marang), Quantity (aḍi, thoṛan), and Numerals (mit\', bar, pe).',
      },
      {
        heading: '३. तुलनात्मक अवस्थाएँ (Degrees of Comparison)',
        explanationHi: 'संताली में अंग्रेज़ी `-er/-est` जैसे प्रत्यय नहीं लगते, बल्कि जिससे तुलना हो उसके साथ `खोन` (से) लगाया जाता है: `राम खोन मोहन माराङा` (राम से मोहन बड़ा है)। सबसे श्रेष्ठ दिखाने के लिए `जोतो खोन` लगाते हैं: `जोतो खोन नापाय` (सबसे अच्छा)।',
        explanationEn: 'Comparisons use khon ("than") and superlatives use joto khon ("of all").',
      },
    ],
    table: {
      title: 'प्रमुख संताली विशेषण व तुलना उदाहरण',
      columns: ['संताली विशेषण', 'रोमन रूप', 'हिंदी अर्थ', 'उदाहरण वाक्यांश'],
      rows: [
        ['नापाय', 'Napay', 'अच्छा / सुंदर', 'नापाय का़मी (अच्छा कार्य)'],
        ['माराङ', 'Marang', 'बड़ा / महान', 'माराङ बुरु (महान पर्वत)'],
        ['हुडिञ', 'Hudiñ', 'छोटा', 'हुडिञ गिदरा़ (छोटा बच्चा)'],
        ['सिबिल', 'Sibil', 'मीठा / स्वादिष्ट', 'सिबिल दाका (स्वादिष्ट भोजन)'],
        ['आराक्', 'Araq', 'लाल', 'आराक् बाहा (लाल फूल)'],
        ['खोन / जोतो खोन', 'Khon / Joto khon', 'से / सबसे', 'जोतो खोन माराङ (सबसे बड़ा)'],
      ],
    },
    examples: [
      { santaliDev: 'बागान रे आराक् आर सासाङ बाहा फुटा़व आकाना।', santaliRoman: 'Bagan re araq ar sasang baha phuṭaw akana.', hindi: 'बगीचे में लाल और पीले फूल खिले हैं।', english: 'Red and yellow flowers have bloomed in the garden.' },
      { santaliDev: 'नोवा दारे दो ओना दारे खोन उसुला।', santaliRoman: 'Nowa dare do ona dare khon usula.', hindi: 'यह पेड़ उस पेड़ से ऊँचा है।', english: 'This tree is taller than that tree.' },
      { santaliDev: 'इञाक् आतु दो जोतो खोन सोरेसा।', santaliRoman: 'Iñaq atu do joto khon soresa.', hindi: 'मेरा गाँव सबसे सुंदर है।', english: 'My village is the most beautiful of all.' },
    ],
  },

  // ─── CHAPTER 11 ──────────────────────────────────────────────────────────
  {
    id: 'ch11_kami_verb',
    number: '11',
    tier: 'parts_of_speech',
    titleSantaliDev: 'का़मी / काजनुम (क्रिया)',
    titleSantaliRoman: 'Kami / Kajnum (Verb)',
    titleHi: 'क्रिया, सकर्मक-अकर्मक भेद और कर्ता-चिह्न',
    titleEn: 'Verbs, Transitivity & Subject/Object Agreement',
    summaryHi: 'संताली वाक्य की आत्मा उसकी क्रिया है जिसमें धातु, काल, वाच्य, कर्म और कर्ता — सब एक क्रमबद्ध सूत्र में जुड़ते हैं।',
    summaryEn: 'The verb is the structural core of Santali, encoding root, tense, voice, animate object, and subject agreement.',
    keyFormula: 'क्रिया चिह्न: इञ → -ञ · आम → -म · उनी → -ए · आलाङ → -लाङ · आबोन → -बोन · उनकु → -को',
    rules: [
      {
        heading: '१. सकर्मक और अकर्मक क्रिया',
        explanationHi: 'जिस क्रिया को पूरा होने के लिए कर्म (Object) की आवश्यकता हो वह सकर्मक है (जैसे `जोम` खाना, `ञु` पीना, `ओल` लिखना, `ञेल` देखना)। जिस क्रिया का फल सीधे कर्ता पर पड़े वह अकर्मक है (जैसे `सेन` जाना, `हिजुक्` आना, `लांदा` हँसना, `जा़पित्` सोना)।',
        explanationEn: 'Transitive verbs act on an object (jom, ñu, ol); intransitive verbs describe states or motion of the subject (sen, landa, japit\').',
      },
      {
        heading: '२. कर्ता सूचक संक्षिप्त चिह्न (Subject Enclitics)',
        explanationHi: 'संताली में कर्ता के अनुसार क्रिया से ठीक पहले (या क्रिया के अंत में) एक संक्षिप्त सर्वनाम-चिह्न जुड़ता है: `इञ` के लिए `-ञ`, `आम` के लिए `-म`, `उनी` के लिए `-ए/-य`, `उनकिन` के लिए `-किन`, `उनकु` के लिए `-को`। उदाहरण: `इञ दाकाञ जोम काना` (मैं भात खा रहा हूँ)।',
        explanationEn: 'Santali marks the subject directly via enclitics (-ñ, -m, -e, -kin, -ko) placed right before the verb or at the verb’s end.',
      },
      {
        heading: '३. समापिका चिह्न `-आ` (-a)',
        explanationHi: 'संताली में लगभग हर पूर्ण कथनात्मक क्रिया के अंत में `-आ` (Finite Marker) जुड़ता है, जैसे `जोमआ` (खाएगा), `काना` (है), `केदा` (किया)। आज्ञार्थक वाक्यों में `-आ` के स्थान पर `-मे/-बेन/-पे` लगता है।',
        explanationEn: 'Declarative finite verbs close with the finite marker -a (kana, keda, joma), whereas imperatives end in -me/-ben/-pe.',
      },
    ],
    table: {
      title: 'कर्ता के अनुसार क्रिया में जुड़ने वाले चिह्न (Subject Markers)',
      columns: ['कर्ता (सर्वनाम)', 'संक्षिप्त चिह्न', 'उदाहरण वाक्य', 'हिंदी अर्थ'],
      rows: [
        ['इञ (मैं)', '-ञ (-ñ)', 'इञ दाकाञ जोमा।', 'मैं भात खाऊँगा।'],
        ['आम (तुम)', '-म (-m)', 'आम दाकाम जोमा।', 'तुम भात खाओगे।'],
        ['उनी (वह)', '-ए / -य (-e)', 'उनी दाकाए जोमा।', 'वह भात खाएगा।'],
        ['आबोन (हम सब)', '-बोन (-bon)', 'आबोन दाकाबोन जोमा।', 'हम सब भात खाएँगे।'],
        ['उनकिन (वे २)', '-किन (-kin)', 'उनकिन दाकाकिन जोमा।', 'वे दोनों भात खाएँगे।'],
        ['उनकु (वे सब)', '-को (-ko)', 'उनकु दाकाको जोमा।', 'वे सब भात खाएँगे।'],
      ],
    },
    examples: [
      { santaliDev: 'इञ चिठीञ ओल काना।', santaliRoman: 'Iñ chiṭhiñ ol kana.', hindi: 'मैं पत्र लिख रहा हूँ।', english: 'I am writing a letter.' },
      { santaliDev: 'आम चेत् एम का़मी काना?', santaliRoman: "Am chet' em kami kana?", hindi: 'तुम क्या काम कर रहे हो?', english: 'What work are you doing?' },
      { santaliDev: 'उनकु बा़द रेको का़मी काना।', santaliRoman: 'Unku bad reko kami kana.', hindi: 'वे सब खेत में काम कर रहे हैं।', english: 'They are working in the paddy field.' },
    ],
  },

  // ─── CHAPTER 12 ──────────────────────────────────────────────────────────
  {
    id: 'ch12_okte_tense',
    number: '12',
    tier: 'syntax_verbs',
    titleSantaliDev: 'ओकते (काल)',
    titleSantaliRoman: 'Okte (Tense)',
    titleHi: 'वर्तमान, भूत और भविष्यत् काल के प्रत्यय',
    titleEn: 'Present, Past & Future Tense System',
    summaryHi: 'समय के अनुसार क्रिया के रूप कैसे बदलते हैं: सामान्य वर्तमान, अपूर्ण वर्तमान (-काना), पूर्ण भूत (-केदा/-एना) और भविष्यत् (-आ)।',
    summaryEn: 'Clear guide to tense-aspect markers across transitive and intransitive verbs in Santali.',
    keyFormula: 'वर्तमान (जारी) = -एत् काना / काना · भूत (सकर्मक) = -केत् + आ · भूत (अकर्मक) = -एना · भविष्यत् = -आ',
    rules: [
      {
        heading: '१. नीत् ओकते (वर्तमान काल / Present Tense)',
        explanationHi: 'जो काम अभी चल रहा है उसमें `काना` या `-एत् काना` जुड़ता है (सकर्मक: `जोमएत् काना` / `जोम काना`; अकर्मक: `चलाक् काना`)। नियमित आदत या सामान्य सत्य के लिए `-आ` लगता है (`सिंगि दो पूरब रे रकाबा` = सूरज पूरब में उगता है)।',
        explanationEn: 'Present progressive uses -et\' kana / -kana; habitual truths use the simple -a form.',
      },
      {
        heading: '२. पारोमेन ओकते (भूतकाल / Past Tense)',
        explanationHi: 'सकर्मक क्रिया में कार्य पूर्ण होने पर `-केत् + आ = केदा` (जैसे `जोम केदा` = खाया, `ओल केदा` = लिखा) लगता है। अकर्मक क्रिया में `-एना` लगता है (जैसे `सेन एना` = गया, `हेच् एना` = आया, `जा़पित् एना` = सो गया)।',
        explanationEn: 'Transitive past uses -ket\'/-keda (jom keda = ate); intransitive past uses -ena (sen ena = went).',
      },
      {
        heading: '३. हिजुक् ओकते (भविष्यत् काल / Future Tense)',
        explanationHi: 'भविष्य में होने वाले कार्य के लिए धातु के साथ `-आ` (सकर्मक) या `-ओक्आ / -क्आ` (अकर्मक) जुड़ता है — जैसे `गापाञ चलाक्आ` (मैं कल जाऊँगा), `गापाञ पढ़ावा` (मैं कल पढ़ूँगा)।',
        explanationEn: 'Future tense attaches -a (transitive) or -oq-a / -q-a (intransitive), often paired with time adverbs like gapa (tomorrow).',
      },
    ],
    table: {
      title: 'तीन कालों में क्रिया रूपांतरण (Verb Conjugation Across Tenses)',
      columns: ['क्रिया धातु', 'वर्तमान (अभी)', 'भूतकाल (बीता)', 'भविष्यत् (आने वाला)'],
      rows: [
        ['जोम (खाना — सकर्मक)', 'जोमएत् काना', 'जोम केदा', 'जोमा'],
        ['ओल (लिखना — सकर्मक)', 'ओलएत् काना', 'ओल केदा', 'ओला'],
        ['ञु (पीना — सकर्मक)', 'ञुएत् काना', 'ञु केदा', 'ञुया'],
        ['सेन (जाना — अकर्मक)', 'सेनोक् / चलाक् काना', 'सेन एना', 'सेनोक्आ / चलाक्आ'],
        ['हिजुक् (आना — अकर्मक)', 'हिजुक् काना', 'हेच् एना', 'हिजुक्आ'],
      ],
    },
    examples: [
      { santaliDev: 'होला इञ पुथीञ पढ़ाव केदा।', santaliRoman: 'Hola iñ puthiñ paṛhaw keda.', hindi: 'कल मैंने किताब पढ़ी।', english: 'Yesterday I read a book.', note: 'भूतकाल (सकर्मक -केदा)' },
      { santaliDev: 'तेहेञ इञ पुथीञ पढ़ाव काना।', santaliRoman: 'Teheñ iñ puthiñ paṛhaw kana.', hindi: 'आज मैं किताब पढ़ रहा हूँ।', english: 'Today I am reading a book.', note: 'वर्तमान काल (-काना)' },
      { santaliDev: 'गापा इञ इस्कूल तेञ चलाक्आ।', santaliRoman: 'Gapa iñ iskul teñ chalaq-a.', hindi: 'कल मैं स्कूल जाऊँगा।', english: 'Tomorrow I will go to school.', note: 'भविष्यत् काल (-क्आ)' },
    ],
  },

  // ─── CHAPTER 13 ──────────────────────────────────────────────────────────
  {
    id: 'ch13_men_voice',
    number: '13',
    tier: 'syntax_verbs',
    titleSantaliDev: 'मेन / वाच्य',
    titleSantaliRoman: 'Men (Voice: Active, Passive & Reflexive)',
    titleHi: 'कर्तृवाच्य, कर्मवाच्य और पारस्परिक वाच्य',
    titleEn: 'Active, Passive/Middle & Reciprocal Voice',
    summaryHi: 'संताली क्रिया में `-केत्` (सक्रिय/कर्तृवाच्य), `-ओक्/-एना` (कर्म/मध्यम वाच्य) और `-प-` (पारस्परिक वाच्य) का सूक्ष्म उपयोग।',
    summaryEn: 'How voice markers shift focus between actor, patient/event, self-action, and mutual reciprocal action.',
    keyFormula: 'सक्रिय = धातु + केदा · कर्म/निजवाच्य = धातु + ओक् / एना · पारस्परिक = मध्यसर्ग -प-',
    rules: [
      {
        heading: '१. कर्तृवाच्य (Active Voice)',
        explanationHi: 'जब कर्ता स्वयं किसी कर्म पर क्रिया करता है तब सक्रिय रूप (-एत्, -केत्, -आकात्) प्रयुक्त होता है। जैसे: `उनी साकाम ए चिरा़व केदा` (उसने पत्ता फाड़ा)।',
        explanationEn: 'Active voice uses active tense markers (-et\', -ket\', -akat\') when an agent acts on an object.',
      },
      {
        heading: '२. कर्मवाच्य व मध्यम वाच्य (Passive / Middle Voice — प्रत्यय `-ओक्` / `-एना`)',
        explanationHi: 'जब कार्य स्वयं घटित हो या कर्म प्रधान हो, तो क्रिया में `-ओक्` (अपूर्ण/भविष्यत्) या `-एना` (भूतकाल) लगता है। जैसे: `साकाम चिरा़व एना` (पत्ता फट गया), `दाका इसिन एना` (भात पक गया), `दुआर झिच् एना` (दरवाज़ा खुल गया)।',
        explanationEn: 'Middle/Passive voice uses -oq (non-past) and -ena (past) when the subject undergoes a change of state.',
      },
      {
        heading: '३. पारस्परिक वाच्य (Reciprocal Voice — मध्यसर्ग `-प-`)',
        explanationHi: 'दो या अधिक लोगों के बीच परस्पर होने वाली क्रिया के लिए `-प-` मध्यसर्ग लगता है: `रोड़` (बोलना) → `रोपोड़` (आपस में बातचीत करना); `गोड़ो` (मदद करना) → `गोपोड़ो` (एक-दूसरे की मदद करना)।',
        explanationEn: 'The infix -p- expresses mutual action: roṛ -> ropoṛ (converse), goṛo -> gopoṛo (help each other).',
      },
    ],
    table: {
      title: 'सक्रिय बनाम कर्म/मध्यम वाच्य तुलना',
      columns: ['क्रिया मूल', 'कर्तृवाच्य (सक्रिय)', 'कर्म/मध्यम वाच्य', 'अर्थ का अंतर'],
      rows: [
        ['झिच् (खोलना)', 'उनी दुआर ए झिच् केदा।', 'दुआर झिच् एना।', 'उसने खोला / अपने-आप खुला'],
        ['इसिन (पकाना)', 'आयो दाका ए इसिन केदा।', 'दाका इसिन एना।', 'माँ ने पकाया / भात पक गया'],
        ['रापुत् (तोड़ना)', 'गिदरा़ ठा़री ए रापुत् केदा।', 'ठा़री रापुत् एना।', 'बच्चे ने तोड़ा / थाली टूट गई'],
        ['गोड़ो (सहायता)', 'इञ उनिञ गोड़ो आदेया।', 'आबोन बोन गोपोड़ोआ।', 'मैंने मदद की / हम आपस में मदद करेंगे'],
      ],
    },
    examples: [
      { santaliDev: 'आयो दाका ए इसिन केदा, नितोक् दाका इसिन एना।', santaliRoman: 'Ayo daka e isin keda, nitoq daka isin ena.', hindi: 'माँ ने भात पकाया, अब भात पक गया है।', english: 'Mother cooked the rice, now the rice is cooked.' },
      { santaliDev: 'आबोन जोतो होड़ बोन गोपोड़ोआ।', santaliRoman: 'Abon joto hoṛ bon gopoṛo-a.', hindi: 'हम सब एक-दूसरे की मदद करेंगे।', english: 'We will all help one another.' },
      { santaliDev: 'मांझी आर आतु होड़ को रोपोड़ काना।', santaliRoman: 'Majhi ar atu hoṛ ko ropoṛ kana.', hindi: 'मांझी और गाँव वाले आपस में चर्चा कर रहे हैं।', english: 'The village head and villagers are talking with each other.' },
    ],
  },

  // ─── CHAPTER 14 ──────────────────────────────────────────────────────────
  {
    id: 'ch14_kami_gunum',
    number: '14',
    tier: 'syntax_verbs',
    titleSantaliDev: 'का़मी गुनुम (क्रिया-विशेषण)',
    titleSantaliRoman: 'Kami Gunum (Adverb)',
    titleHi: 'क्रिया-विशेषण के चार भेद',
    titleEn: 'Adverbs of Time, Place, Manner & Degree',
    summaryHi: 'क्रिया कब, कहाँ, कैसे और कितनी मात्रा में हो रही है — यह बताने वाले अविकारी शब्द।',
    summaryEn: 'Invariable words specifying when, where, how, and to what extent an action takes place.',
    keyFormula: 'कब = कालवाचक · कहाँ = स्थानवाचक · कैसे = रीतिवाचक · कितना = परिमाणवाचक',
    rules: [
      {
        heading: '१. ओकते उदुक् (कालवाचक क्रिया-विशेषण)',
        explanationHi: 'समय बताने वाले शब्द: `तेहेञ` (आज), `होला` (बीता कल), `गापा` (आने वाला कल), `नितोक्` (अभी), `सेताक्` (सुबह), `आ़युप्` (शाम), `दिनोम` (प्रतिदिन)।',
        explanationEn: 'Time adverbs anchor events: teheñ (today), hola (yesterday), gapa (tomorrow), nitoq (now), dinom (daily).',
      },
      {
        heading: '२. जायगा उदुक् (स्थानवाचक क्रिया-विशेषण)',
        explanationHi: 'स्थान या दिशा बताने वाले शब्द: `नोंडे` (यहाँ), `होंडे` (वहाँ), `ओकारे` (कहाँ), `सांगिञ` (दूर), `सोर` (पास), `भितीर` (अंदर), `बाहरे` (बाहर)।',
        explanationEn: 'Place adverbs locate actions: nonde (here), honde (there), sangiñ (far), sor (near), bhitir (inside).',
      },
      {
        heading: '३. धोरोन आर लेखा उदुक् (रीतिवाचक व परिमाणवाचक)',
        explanationHi: 'ढंग बताने वाले: `लोगोन` / `उसा़रा` (जल्दी), `बा़य-बा़य ते` (धीरे-धीरे), `नापाय ते` (अच्छी तरह)। मात्रा बताने वाले: `आ़डी` (बहुत), `कोम` (कम), `ढा़ेर` (अधिक), `एकेन` (केवल)।',
        explanationEn: 'Manner adverbs (logon, bay-bay te) and degree adverbs (aḍi, kom, ḍher) refine how actions unfold.',
      },
    ],
    table: {
      title: 'चार प्रकार के क्रिया-विशेषण (Four Adverb Classes)',
      columns: ['भेद', 'संताली शब्द', 'रोमन रूप', 'हिंदी अर्थ'],
      rows: [
        ['कालवाचक (Time)', 'तेहेञ, होला, गापा, दिनोम', 'Teheñ, Hola, Gapa, Dinom', 'आज, बीता कल, आने वाला कल, रोज़'],
        ['स्थानवाचक (Place)', 'नोंडे, होंडे, सोर, सांगिञ', 'Nonde, Honde, Sor, Sangiñ', 'यहाँ, वहाँ, पास, दूर'],
        ['रीतिवाचक (Manner)', 'लोगोन, बा़य-बा़य ते, नापाय ते', 'Logon, Bay-bay te, Napay te', 'जल्दी, धीरे-धीरे, भलीभाँति'],
        ['परिमाणवाचक (Degree)', 'आ़डी, ढा़ेर, थोड़ा, कोम', 'Aḍi, Ḍher, Thoṛa, Kom', 'बहुत, ज्यादा, थोड़ा, कम'],
      ],
    },
    examples: [
      { santaliDev: 'बा़य-बा़य ते ताड़ाम मे, डाहार दो लेञेरा।', santaliRoman: 'Bay-bay te taṛam me, ḍahar do leñera.', hindi: 'धीरे-धीरे चलो, रास्ता फिसलन भरा है।', english: 'Walk slowly, the path is slippery.' },
      { santaliDev: 'उनी दिनोम सेताक् रे ए बेरेदा।', santaliRoman: 'Uni dinom setaq re e bereda.', hindi: 'वह रोज़ सुबह उठता है।', english: 'He/She wakes up early every morning.' },
      { santaliDev: 'लोगोन नोंडे हिजुक् मे।', santaliRoman: "Logon nonde hijuq me.", hindi: 'जल्दी यहाँ आओ।', english: 'Come here quickly.' },
    ],
  },

  // ─── CHAPTER 15 ──────────────────────────────────────────────────────────
  {
    id: 'ch15_topol_jonor',
    number: '15',
    tier: 'syntax_verbs',
    titleSantaliDev: 'तोपोल, जोनोड़ आर हाहाड़ा',
    titleSantaliRoman: 'Topol, Jonoṛ ar Hahaṛa',
    titleHi: 'संबंधबोधक, समुच्चयबोधक और विस्मयादिबोधक',
    titleEn: 'Postpositions, Conjunctions & Interjections',
    summaryHi: 'दो शब्दों या दो वाक्यों को जोड़ने वाले अव्यय तथा अचानक उठने वाले भावों को प्रकट करने वाले विस्मयादिबोधक शब्द।',
    summaryEn: 'Connectors and exclamatory words that link clauses smoothly and bring spoken Santali to life.',
    keyFormula: 'संबंधबोधक (चेतान रे, लातार रे) · समुच्चयबोधक (आर, मेनखान, चेदाक् जे) · विस्मयादिबोधक (आहा!, हाय रे!)',
    rules: [
      {
        heading: '१. तोपोल (संबंधबोधक / Postpositions)',
        explanationHi: 'अंग्रेज़ी में Preposition संज्ञा से पहले आता है, पर संताली में Postposition संज्ञा के बाद आता है: `चेतान रे` (ऊपर), `लातार रे` (नीचे), `लाहा रे` (आगे), `तायोम रे` (पीछे), `ताला रे` (बीच में), `साँव ते` (के साथ)।',
        explanationEn: 'Santali uses postpositions after nouns: chetan re (on top), latar re (underneath), laha re (in front), tayom re (behind), sanw te (with).',
      },
      {
        heading: '२. जोनोड़ (समुच्चयबोधक / Conjunctions)',
        explanationHi: 'दो शब्दों या उपवाक्यों को जोड़ने वाले शब्द: `आर` (और), `मेनखान` (लेकिन/परंतु), `बाङखान` (अन्यथा/या), `चेदाक् जे` (क्योंकि), `ओनाते` (इसलिए), `एनाते` (अतः)।',
        explanationEn: 'Conjunctions join words or clauses: ar (and), menkhan (but), bangkhan (or/otherwise), chedaq je (because), onate (therefore).',
      },
      {
        heading: '३. हाहाड़ा उनुदुक् (विस्मयादिबोधक / Interjections)',
        explanationHi: 'आश्चर्य, खुशी, दुख या अभिवादन के तात्कालिक उद्गार: `जोहार!` (सादर अभिवादन), `आहा!` (प्रसन्नता), `हाय रे!` (दुख/संवेदना), `ओहो!` (आश्चर्य), `साबास!` (प्रशंसा)।',
        explanationEn: 'Interjections voice spontaneous emotion or respect: Johar!, Aha!, Hay re!, Oho!, Sabas!.',
      },
    ],
    table: {
      title: 'दैनिक उपयोग के प्रमुख अव्यय शब्द',
      columns: ['वर्ग', 'संताली शब्द', 'रोमन रूप', 'हिंदी अर्थ'],
      rows: [
        ['संबंधबोधक', 'चेतान रे / लातार रे', 'Chetan re / Latar re', 'के ऊपर / के नीचे'],
        ['संबंधबोधक', 'लाहा रे / तायोम रे', 'Laha re / Tayom re', 'के आगे / के पीछे'],
        ['समुच्चयबोधक', 'आर / मेनखान', 'Ar / Menkhan', 'और / लेकिन'],
        ['समुच्चयबोधक', 'चेदाक् जे / ओनाते', 'Chedaq je / Onate', 'क्योंकि / इसलिए'],
        ['विस्मयादिबोधक', 'जोहार! / आहा! / हाय रे!', 'Johar! / Aha! / Hay re!', 'प्रणाम! / वाह! / अरे हाय!'],
      ],
    },
    examples: [
      { santaliDev: 'दारे लातार रे गायको जिरौक् काना।', santaliRoman: 'Dare latar re gayko jirauq kana.', hindi: 'पेड़ के नीचे गायें आराम कर रही हैं।', english: 'Cows are resting under the tree.' },
      { santaliDev: 'इञ सेन सनाञ काना मेनखान दाक्\' एत्आ।', santaliRoman: "Iñ sen sanañ kana menkhan dak' et'-a.", hindi: 'मैं जाना चाहता हूँ लेकिन बारिश हो रही है।', english: 'I want to go, but it is raining.' },
      { santaliDev: 'उनी रूवा़ काना, ओनाते तेहेञ इस्कूल बाय हेच् एना।', santaliRoman: "Uni ruwa kana, onate teheñ iskul bay hec' ena.", hindi: 'वह बीमार है, इसलिए आज स्कूल नहीं आया।', english: 'He is unwell, therefore he did not come to school today.' },
    ],
  },

  // ─── CHAPTER 16 ──────────────────────────────────────────────────────────
  {
    id: 'ch16_ayat_syntax',
    number: '16',
    tier: 'syntax_verbs',
    titleSantaliDev: 'आयात् (वाक्य विचार)',
    titleSantaliRoman: 'Ayat (Sentence & Syntax)',
    titleHi: 'वाक्य संरचना (SOV), निषेध और प्रश्न निर्माण',
    titleEn: 'Sentence Structure, Negation & Question Formation',
    summaryHi: 'शुद्ध संताली वाक्य बनाने के सुनहरे नियम: कर्ता–कर्म–क्रिया (SOV) क्रम, बाङ बनाम आलो निषेध और सरल-संयुक्त-मिश्र वाक्य।',
    summaryEn: 'Build grammatically sound Santali sentences with SOV order, proper negation (bang vs. alo), and clause combinations.',
    keyFormula: 'सामान्य निषेध = बाङ (बाय, बाञ, बाम) · आज्ञा निषेध ("मत करो") = आलो (आलोम, आलोपे)',
    rules: [
      {
        heading: '१. संताली का मानक पद-क्रम (SOV Order)',
        explanationHi: 'संताली में वाक्य का मानक क्रम **कर्ता (Subject) + कर्म (Object) + क्रिया (Verb)** होता है। जैसे: `आयो (कर्ता) + दाका (कर्म) + ए इसिन काना (क्रिया)`।',
        explanationEn: 'Standard Santali follows Subject–Object–Verb order, mirroring Hindi and other Indian languages.',
      },
      {
        heading: '२. नकारात्मक वाक्य: `बाङ` बनाम `आलो` (अत्यंत महत्वपूर्ण नियम)',
        explanationHi: 'सामान्य कथन को नकारने के लिए `बाङ` का प्रयोग होता है, जिसमें कर्ता चिह्न सीधे `बा-` में जुड़ जाता है (`बाञ` = मैं नहीं, `बाम` = तुम नहीं, `बाय` = वह नहीं, `बाको` = वे नहीं)। किंतु मना करने या आज्ञा नकारने ("मत करो") में हमेशा `आलो` लगता है (`आलोम सेना` = मत जाओ, `आलोपे रोड़ा` = मत बोलो)।',
        explanationEn: 'Use bang (inflected as bañ, bam, bay, bako) for factual negation, and alo (alom, alope) strictly for prohibitions ("do not").',
        santaliDev: 'इञ बाञ सेना (मैं नहीं जाऊँगा) · आम आलोम सेना (तुम मत जाओ)',
        santaliRoman: 'Iñ bañ sena (I will not go) · Am alom sena (Do not go)',
      },
      {
        heading: '३. रचना के अनुसार वाक्य के तीन भेद',
        explanationHi: '(१) सरल वाक्य (सुध आयात्): एक ही मुख्य क्रिया (`सिंगि रकाप् एना`)। (२) संयुक्त वाक्य (जोनोड़ आयात्): `आर`, `मेनखान` से जुड़े दो स्वतंत्र उपवाक्य। (३) मिश्र वाक्य (मेसाल आयात्): एक मुख्य व एक आश्रित उपवाक्य (`जे`, `चेदाक् जे`, `तिन रे`)।',
        explanationEn: 'Sentences are Simple (one main verb), Compound (joined by ar/menkhan), or Complex (main + subordinate clause).',
      },
    ],
    table: {
      title: 'वाक्य के प्रमुख प्रकार (Sentence Types)',
      columns: ['वाक्य प्रकार', 'संताली उदाहरण', 'रोमन रूप', 'हिंदी अर्थ'],
      rows: [
        ['विधानवाचक', 'सिंगि पूरब रे रकाबा।', 'Singi purab re rakaba.', 'सूर्य पूरब में उगता है।'],
        ['निषेधवाचक (तथ्य)', 'उनी तेहेञ बाय हिजुक्आ।', 'Uni teheñ bay hijuq-a.', 'वह आज नहीं आएगा।'],
        ['आज्ञा-निषेध (मनाही)', 'एड़े कथा आलोम रोड़ा।', 'Eṛe katha alom roṛa.', 'झूठ मत बोलो।'],
        ['प्रश्नवाचक', 'आम चेत् एम जोम केदा?', "Am chet' em jom keda?", 'तुमने क्या खाया?'],
        ['आज्ञावाचक', 'दिनोम पुथी पढ़ाव मे।', 'Dinom puthi paṛhaw me.', 'रोज़ किताब पढ़ो।'],
      ],
    },
    examples: [
      { santaliDev: 'इञ दो चा बाञ ञुया।', santaliRoman: 'Iñ do cha bañ ñuya.', hindi: 'मैं चाय नहीं पीता।', english: 'I do not drink tea.' },
      { santaliDev: 'बुरू डाहार रे एकला आलोम चलाक्आ।', santaliRoman: 'Buru ḍahar re ekla alom chalaq-a.', hindi: 'पहाड़ी रास्ते पर अकेले मत जाओ।', english: 'Do not go alone on the hill path.' },
      { santaliDev: 'तिन रे दाक्\' एत्आ, उन रे चास नापायओक्आ।', santaliRoman: "Tin re dak' et'-a, un re chas napayoq-a.", hindi: 'जब बारिश होती है, तब खेती अच्छी होती है।', english: 'When it rains, farming flourishes.' },
    ],
  },

  // ─── CHAPTER 17 ──────────────────────────────────────────────────────────
  {
    id: 'ch17_ulta_soman',
    number: '17',
    tier: 'composition',
    titleSantaliDev: 'उल्टा़ साबाद आर जोड़ा काथा',
    titleSantaliRoman: 'Ulta Sabad ar Joṛa Katha',
    titleHi: 'विलोम शब्द, पर्यायवाची व संताली जोड़ा शब्द',
    titleEn: 'Antonyms, Synonyms & Expressive Pair-Words',
    summaryHi: 'संताली लेखन और बोलचाल को समृद्ध बनाने वाले प्रमुख विलोम शब्द, समानार्थी शब्द और पारंपरिक जोड़ा काथा।',
    summaryEn: 'Build expressive Santali fluency with high-frequency opposites, synonyms, and rhythmic paired expressions.',
    keyFormula: 'सटीक विलोम + जोड़ा काथा = प्रभावशाली, जीवंत संताली भाषा',
    rules: [
      {
        heading: '१. उल्टा़ साबाद (विलोम / विपरीतार्थक शब्द)',
        explanationHi: 'संताली में हर रोज़ के गुण, दिशा, स्वाद और समय के स्पष्ट विपरीत शब्द मिलते हैं — जैसे `माराङ` (बड़ा) × `हुडिञ` (छोटा), `सिंगि` (दिन) × `ञिंदा` (रात), `लोलो` (गरम) × `रेयाड़` (ठंडा), `सिबिल` (मीठा) × `हाड़हात्` (कड़वा)।',
        explanationEn: 'Learning antonym pairs doubles vocabulary speed and sharpens descriptive writing.',
      },
      {
        heading: '२. जोड़ा काथा (Paired / Echo Words)',
        explanationHi: 'संताली भाषा की सुंदरता उसके जोड़ा शब्दों में बसती है। ये दो शब्द मिलकर पूरे वर्ग या विस्तृत भाव का संकेत देते हैं: `दाका-उतु` (पूरा भोजन), `एंगा-आपा` (माता-पिता), `दारे-नाड़ी` (पेड़-पौधे व वनस्पति), `हातु-दिशोम` (गाँव-देश), `सुख-दुख` (जीवन के उतार-चढ़ाव)।',
        explanationEn: 'Joṛa Katha pairs two related words to convey an inclusive whole (e.g., dare-naṛi = flora/forest life).',
      },
    ],
    table: {
      title: '१२ आवश्यक संताली विलोम शब्द युग्म (Essential Antonyms)',
      columns: ['शब्द (संताली)', 'अर्थ', 'विलोम (उल्टा़)', 'अर्थ'],
      rows: [
        ['माराङ (Marang)', 'बड़ा', 'हुडिञ (Hudiñ)', 'छोटा'],
        ['सिंगि (Singi)', 'दिन', 'ञिंदा (Ñinda)', 'रात'],
        ['लोलो (Lolo)', 'गरम', 'रेयाड़ (Reyaṛ)', 'ठंडा'],
        ['सिबिल (Sibil)', 'मीठा / स्वादिष्ट', 'हाड़हात् (Haṛhat\')', 'कड़वा'],
        ['सोर (Sor)', 'पास', 'सांगिञ (Sangiñ)', 'दूर'],
        ['चेतान (Chetan)', 'ऊपर', 'लातार (Latar)', 'नीचे'],
        ['नापाय (Napay)', 'अच्छा', 'बा़ड़िच् (Baṛic\')', 'बुरा'],
        ['सा़री (Sari)', 'सच / सत्य', 'एड़े (Eṛe)', 'झूठ / असत्य'],
        ['नावा (Nawa)', 'नया', 'मारे (Mare)', 'पुराना'],
        ['होरमो (Hormo)', 'भारी (हामाल)', 'रावाल (Rawal)', 'हल्का'],
        ['लाहा (Laha)', 'आगे', 'तायोम (Tayom)', 'पीछे'],
        ['रा़स्का़ (Raska)', 'खुशी', 'दुख (Dukh)', 'दुख'],
      ],
    },
    examples: [
      { santaliDev: 'सा़री कथा दो दिनोम जिता़क्आ, एड़े दो हाराक्आ।', santaliRoman: 'Sari katha do dinom jitaq-a, eṛe do haraq-a.', hindi: 'सत्य हमेशा जीतता है, झूठ हारता है।', english: 'Truth always triumphs; falsehood loses.' },
      { santaliDev: 'आबोन दो दारे-नाड़ी बोन बांचावा।', santaliRoman: 'Abon do dare-naṛi bon banchawa.', hindi: 'हम सब पेड़-पौधों की रक्षा करेंगे।', english: 'We will protect trees and nature.' },
      { santaliDev: 'माड़ाङ ते हातु-दिशोम रेयाक् कथा उइहा़र मे।', santaliRoman: 'Maṛang te hatu-dishom reyaq katha uihar me.', hindi: 'सबसे पहले अपने गाँव-देश के बारे में सोचो।', english: 'First think of the welfare of your village and homeland.' },
    ],
  },

  // ─── CHAPTER 18 ──────────────────────────────────────────────────────────
  {
    id: 'ch18_kudum_menkatha',
    number: '18',
    tier: 'composition',
    titleSantaliDev: 'कुदुम आर मेनकाथा',
    titleSantaliRoman: 'Kudum ar Menkatha',
    titleHi: 'पारंपरिक संताली पहेलियाँ और लोकोक्तियाँ',
    titleEn: 'Traditional Santali Riddles & Proverbs',
    summaryHi: 'संताली लोक-साहित्य में बुद्धि-परीक्षा के लिए पूछे जाने वाले कुदुम (पहेलियाँ) और जीवन-दर्शन सिखाने वाली मेनकाथा (लोकोक्तियाँ)।',
    summaryEn: 'Explore folk wisdom through traditional oral riddles (Kudum) and metaphorical proverbs (Menkatha).',
    keyFormula: 'कुदुम (पहेली) = कल्पना व तर्क शक्ति · मेनकाथा (लोकोक्ति) = पूर्वजों का जीवन अनुभव',
    rules: [
      {
        heading: '१. कुदुम (लोक पहेलियाँ)',
        explanationHi: 'शाम के समय गाँव के आँगन में बड़े-बुजुर्ग बच्चों की बुद्धि और प्रकृति-निरीक्षण क्षमता परखने के लिए कुदुम पूछते हैं। कुदुम अक्सर प्रकृति, खेती, आकाश और रोज़मर्रा के औज़ारों पर आधारित होते हैं।',
        explanationEn: 'Elders share Kudum riddles during evening gatherings to sharpen observation of nature, farming, and daily life.',
      },
      {
        heading: '२. मेनकाथा / भेंता काथा (मुहावरे व कहावतें)',
        explanationHi: 'मेनकाथा में शब्दों के सीधे अर्थ से गहरा नैतिक या सामाजिक संदेश छिपा होता है — जैसे एकता, परिश्रम, धैर्य और सत्यनिष्ठा का महत्व।',
        explanationEn: 'Menkatha proverbs pack deep ethical lessons about unity, diligence, and honesty into memorable metaphors.',
      },
    ],
    table: {
      title: 'लोकप्रिय कुदुम (पहेलियाँ) व उनके उत्तर',
      columns: ['संताली कुदुम', 'हिंदी भावार्थ', 'संताली उत्तर', 'हिंदी / English उत्तर'],
      rows: [
        ['ञिंदा दोय आ़डी सांगे, सिंगि दो बाको ञेलोक्।', 'रात में अनगिनत दिखते हैं, दिन में गायब हो जाते हैं।', 'इपिल (Ipil)', 'तारे (Stars)'],
        ['जांगा बानुक् ताया, मेनखान दिनोम ए दारा़ना।', 'पैर नहीं हैं, फिर भी रोज़ चलता है।', 'गाडा दाक्\' (Gaḍa dak\')', 'नदी का पानी (River)'],
        ['बाहरे दो हरियाड़, भितीर दो पुंड आर दाक्\'।', 'बाहर से हरा, भीतर सफेद और मीठा पानी।', 'नाड़केल (Naṛkel)', 'नारियल (Coconut)'],
        ['मित् ओड़ाक् रे बारया खिड़की, ओना ते जोतोबोन ञेला।', 'एक घर में दो खिड़कियाँ, जिनसे हम सब देखते हैं।', 'मेत् (Met\')', 'आँखें (Eyes)'],
      ],
    },
    examples: [
      { santaliDev: 'मित् का़टुप् ते दो दाका बाङ जोमोक्आ।', santaliRoman: "Mit' kaṭup' te do daka bang jomoq-a.", hindi: 'एक उँगली से भात नहीं खाया जाता (भाव: एकता में ही शक्ति है)।', english: 'Rice cannot be eaten with a single finger (Unity is strength).' },
      { santaliDev: 'जेलेका का़मी, ओनका गी जो।', santaliRoman: 'Jeleka kami, onka gi jo.', hindi: 'जैसा कर्म करोगे, वैसा ही फल मिलेगा।', english: 'As you sow, so shall you reap.' },
      { santaliDev: 'बा़य-बा़य ते ताड़ाम रेहोँ सांगिञ बोन सेटेरा।', santaliRoman: 'Bay-bay te taṛam rehoñ sangiñ bon seṭera.', hindi: 'धीरे-धीरे चलकर भी हम दूर मंज़िल तक पहुँच जाते हैं।', english: 'Steady steps carry us even to distant goals.' },
    ],
  },

  // ─── CHAPTER 19 ──────────────────────────────────────────────────────────
  {
    id: 'ch19_chithi_onol',
    number: '19',
    tier: 'composition',
    titleSantaliDev: 'चिठी ओनोल (पत्र लेखन)',
    titleSantaliRoman: 'Chithi Onol (Letter Writing)',
    titleHi: 'औपचारिक एवं अनौपचारिक संताली पत्र-लेखन',
    titleEn: 'Formal & Informal Letter Writing in Santali',
    summaryHi: 'प्रधानाध्यापक/अधिकारी को आवेदन पत्र तथा माता-पिता व मित्र को व्यक्तिगत पत्र लिखने का प्रामाणिक संताली प्रारूप।',
    summaryEn: 'Standard salutations, dates, sign-offs, and two complete original Santali letter models with translations.',
    keyFormula: 'पत्र के ५ अंग: (१) स्थान-दिनांक (२) संबोधन-जोहार (३) मुख्य विषय (४) समापन-आभार (५) प्रेषक का नाम',
    rules: [
      {
        heading: '१. अनौपचारिक पत्र (व्यक्तिगत / पारिवारिक)',
        explanationHi: 'माता-पिता या बड़ों के लिए संबोधन: `मानोतान बाबा / आयो, डोबोक जोहार`। मित्र या छोटे के लिए: `दुला़ड़ गाते, जोहार`। समापन में: `आमिच् दुला़ड़ होपोन / आमिच् गाते`।',
        explanationEn: 'Informal letters open with warm greetings (Dobok\' Johar for elders, Dulaṛ gate for friends) and close affectionately.',
      },
      {
        heading: '२. औपचारिक पत्र (आवेदन / कार्यालयी)',
        explanationHi: 'विद्यालय या ग्राम सभा के लिए संबोधन: `मानोतानीच् हेडमास्टर गोमके` या `मानोतानीच् मांझी हाड़ाम`। विषय पंक्ति `बिसॉय:` स्पष्ट लिखें तथा अंत में `आमिच् मा़ना़व आचेतान` (आपका आज्ञाकारी छात्र) लिखें।',
        explanationEn: 'Formal applications include a clear recipient line, subject (Bisoy), polite request, and courteous sign-off.',
      },
    ],
    examples: [
      { santaliDev: 'मानोतान बाबा, डोबोक जोहार।', santaliRoman: "Manotan Baba, Dobok' Johar.", hindi: 'आदरणीय पिताजी, सादर चरण-स्पर्श।', english: 'Respected Father, humble salutations.' },
      { santaliDev: 'इञ दो नोंडे नापाय गी मेनाञा।', santaliRoman: 'Iñ do nonde napay gi menaña.', hindi: 'मैं यहाँ कुशल-मंगल हूँ।', english: 'I am doing well here.' },
    ],
    compositions: [
      {
        title: 'नमूना १: अवकाश हेतु प्रधानाध्यापक को आवेदन पत्र (Formal Application)',
        subtitle: 'दो दिन की छुट्टी के लिए शुद्ध संताली आवेदन',
        santaliDev:
          'सेवा रे,\nमानोतानीच् हेडमास्टर गोमके,\nराजकीय मध्य विद्यालय, दुमका।\n\nमा़हित्: २० नवंबर २०२६\nबिसॉय: बार दिन रेयाक् छुटी ला़गित् नेहोर चिठी।\n\nमानोतानीच् गोमके,\nनेहोर साँव तेञ ला़य काना जे होला आ़युप् खोन इञ दो आ़डी रूवा़ कानाञ। डाक्टर दो बार दिन जिरौक् ला़गित् ए मेताकादिञा। ओनाते इञ दो २१ आर २२ नवंबर २०२६ हिलोक् इस्कूल बाञ हिजुक् दाड़ेयाक्आ।\n\nओनाते गोमके ठेन नेहोर मेनाक्आ जे इञ दो बार दिन रेयाक् छुटी एम काते दा़याञ मे।\n\nआमिच् मा़ना़व आचेतान,\nञुतुम: बिरसा मुर्मू\nचानोच्: ८ (आठवाँ)',
        santaliRoman:
          'Sewa re,\nManotanic\' Headmaster Gomke,\nRajkiya Madhya Vidyalaya, Dumka.\n\nMahit\': 20 November 2026\nBisoy: Bar din reyaq chhuṭi lagit\' nehor chiṭhi.\n\nManotanic\' Gomke,\nNehor sanw teñ lay kana je hola ayup\' khon iñ do aḍi ruwa kanañ. Doctor do bar din jirauq lagit\' e metakadiña. Onate iñ do 21 ar 22 November 2026 hiloq iskul bañ hijuq daṛeyaq-a.\n\nOnate Gomke ṭhen nehor menaq-a je iñ do bar din reyaq chhuṭi em kate dayañ me.\n\nAmic\' manaw achetan,\nÑutum: Birsa Murmu\nChanoch\': 8',
        hindiTranslation:
          'सेवा में,\nमाननीय प्रधानाध्यापक महोदय,\nराजकीय मध्य विद्यालय, दुमका।\n\nदिनांक: 20 नवंबर 2026\nविषय: दो दिन के अवकाश हेतु प्रार्थना पत्र।\n\nमहोदय,\nसविनय निवेदन है कि कल शाम से मुझे तेज़ बुखार है। चिकित्सक ने दो दिन आराम करने की सलाह दी है। इसलिए मैं 21 और 22 नवंबर 2026 को विद्यालय आने में असमर्थ हूँ।\n\nअतः आपसे विनम्र प्रार्थना है कि मुझे दो दिन का अवकाश प्रदान करने की कृपा करें।\n\nआपका आज्ञाकारी छात्र,\nनाम: बिरसा मुर्मू, कक्षा: 8',
      },
      {
        title: 'नमूना २: मित्र को सोहराय पर्व का निमंत्रण पत्र (Informal Letter)',
        subtitle: 'मित्र को गाँव के सोहराय उत्सव में बुलाने हेतु व्यक्तिगत पत्र',
        santaliDev:
          'आतु: जाहेरडीह, साहिबगंज\nमा़हित्: २० नवंबर २०२६\n\nदुला़ड़ गाते सोमाय,\nजोहार!\n\nइञ दो नोंडे नापाय गी मेनाञा आर आसाञ दोहोयेत्आ जे आम होँ ओड़ाक् रे जोतो होड़ साँव नापाय गी मेनामा। नोवा चिठी तेञ बाडाय ओचोयेत् मेया जे हिजुक् सप्ताह रे आलेयाक् आतु रे माराङ सोहराय परब हुयुक् काना।\n\nआलेयाक् ओड़ाक् रे सोहराय चित्र बानौ आकाना, पीठा-लाड़ु तेयारोक् काना आर अखड़ा रे तुमदाक्-तामाक् साड़ेया। आम दो आमाक् ओड़ाक् होड़ साँव जारुड़ हिजुक् मे। आबोन जोतो होड़ मिसा काते सोहराय परब बोन मानावा।\n\nबाबा आर आयो ठेन इञाक् डोबोक जोहार ला़य आकिन मे।\n\nआमिच् दुला़ड़ गाते,\nचांदू हांसदा',
        santaliRoman:
          'Atu: Jaherḍih, Sahibganj\nMahit\': 20 November 2026\n\nDulaṛ gate Somay,\nJohar!\n\nIñ do nonde napay gi menaña ar asañ dohoyet\'-a je am hoñ oṛak\' re joto hoṛ sanw napay gi menama. Nowa chiṭhi teñ baḍay ochoyet\' meya je hijuq saptah re aleyaq atu re marang Sohrai parab huyuq kana.\n\nAleyaq oṛak\' re Sohrai chitra banaw akana, piṭha-laṛu teyaroq kana ar akhṛa re tumdaq-tamaq saṛeya. Am do amaq oṛak\' hoṛ sanw jaruṛ hijuq me. Abon joto hoṛ misa kate Sohrai parab bon manawa.\n\nBaba ar Ayo ṭhen iñaq dobok\' johar lay akin me.\n\nAmic\' dulaṛ gate,\nChandu Hansda',
        hindiTranslation:
          'गाँव: जाहेरडीह, साहिबगंज\nदिनांक: 20 नवंबर 2026\n\nप्रिय मित्र सोमाय,\nजोहार!\n\nमैं यहाँ सकुशल हूँ और आशा करता हूँ कि तुम भी परिवार सहित कुशल-मंगल होंगे। तुम्हें यह जानकर खुशी होगी कि अगले सप्ताह हमारे गाँव में महापर्व सोहराय मनाया जा रहा है।\n\nहमारे घर की दीवारों पर सोहराय चित्रकारी सजाई गई है, पीठा-पकवान बनेंगे और अखड़ा में मांदार-नगाड़ा गूँजेगा। तुम अपने परिवार के साथ ज़रूर आना। हम सब मिलकर सोहराय पर्व मनाएँगे।\n\nचाचा-चाची को मेरा सादर चरण-स्पर्श कहना।\n\nतुम्हारा प्रिय मित्र,\nचांदू हांसदा',
      },
    ],
  },

  // ─── CHAPTER 20 ──────────────────────────────────────────────────────────
  {
    id: 'ch20_onol_essays',
    number: '20',
    tier: 'composition',
    titleSantaliDev: 'ओनोल (मौलिक संताली निबंध)',
    titleSantaliRoman: 'Onol (Original Santali Essays)',
    titleHi: 'चार मौलिक संताली निबंध — अभ्यास व पठन',
    titleEn: 'Four Original Santali Essays for Reading & Writing',
    summaryHi: 'परीक्षाओं और लेखन अभ्यास के लिए चार विषय-आधारित मौलिक संताली निबंध: हमारा गाँव, सोहराय पर्व, पेड़-पौधे और शिक्षा का महत्व।',
    summaryEn: 'Four freshly authored bilingual Santali essays covering Village Life, Sohrai Festival, Nature Conservation, and Education.',
    keyFormula: 'उत्तम निबंध = भूमिका (परिचय) + मुख्य विषय (२–३ अनुच्छेद) + उपसंहार (संदेश)',
    rules: [
      {
        heading: '१. संताली निबंध लिखने के तीन चरण',
        explanationHi: 'किसी भी विषय पर निबंध लिखते समय पहले संक्षिप्त परिचय (ओनोल एतोहोप्), फिर बीच में विषय के महत्व व उदाहरण (ताला हा़टिञ), और अंत में सकारात्मक संदेश (मुचा़त् कथा) लिखें। वाक्य छोटे, स्पष्ट और शुद्ध SOV क्रम में रखें।',
        explanationEn: 'Structure essays into an opening introduction, two concise body paragraphs with concrete examples, and a clear concluding thought.',
      },
    ],
    examples: [
      { santaliDev: 'सेचेत् दो होड़ जीवन रेयाक् मार्साल काना।', santaliRoman: 'Sechet\' do hoṛ jiwan reyaq marsal kana.', hindi: 'शिक्षा मानव जीवन का प्रकाश है।', english: 'Education is the light of human life.' },
    ],
    compositions: [
      {
        title: 'निबंध १: आलेयाक् आतु (हमारा गाँव / Our Village)',
        subtitle: 'प्रकृति की गोद में बसा स्वच्छ, संगठित संताल गाँव',
        santaliDev:
          'आलेयाक् आतु रेयाक् ञुतुम दो सारजोमडीह काना। नोवा आतु दो बुरु आर हरियाड़ गाजार सोर रे मेनाक्आ। आतु रेयाक् कुलही दो आ़डी साफा आर ओसार गेया। कुलही रेयाक् बार पा़स्टा रे होड़ कोवाक् साजाव ओड़ाक् मेनाक्आ।\n\nआतु रेयाक् मुचा़त् रे पावन जाहेर थान मेनाक्आ, ओकारे सारजोम दारे लातार रे बोंगा-बुरु को सेवा कोआ। आतु रेन होड़ को दो जोतो चास-बास आर बा़नौ का़मी रेको छुटा़क्आ। आलेयाक् आतु रे मित् गोटाङ इस्कूल होँ मेनाक्आ, ओकारे गिदरा़ को दिनोम पढ़ाव ला़गित् को चलाक्आ।\n\nआलेयाक् आतु रेन होड़ को दो आ़डी दुला़ड़ आर एकता साँव को ताहेँना। सुख-दुख रे जोतो होड़ बोन गोपोड़ोआ। इञ दो इञाक् आतु आ़डीञ दुला़ड़ा।',
        santaliRoman:
          'Aleyaq atu reyaq ñutum do Sarjomḍih kana. Nowa atu do buru ar hariyaṛ gajar sor re menaq-a. Atu reyaq kulhi do aḍi sapha ar osar geya. Kulhi reyaq bar pasṭa re hoṛ kowaq sajaw oṛak\' menaq-a.\n\nAtu reyaq muchat\' re pawan Jaher Than menaq-a, okare sarjom dare latar re bonga-buru ko sewa koa. Atu ren hoṛ ko do joto chas-bas ar banaw kami reko chhuṭaq-a. Aleyaq atu re mit\' gotang iskul hoñ menaq-a, okare gidra ko dinom paṛhaw lagit\' ko chalaq-a.\n\nAleyaq atu ren hoṛ ko do aḍi dulaṛ ar ekta sanw ko taheñna. Sukh-dukh re joto hoṛ bon gopoṛo-a. Iñ do iñaq atu aḍiñ dulaṛa.',
        hindiTranslation:
          'हमारे गाँव का नाम सारजोमडीह है। यह गाँव पहाड़ी और हरे-भरे जंगल के पास स्थित है। गाँव की मुख्य गली (कुलही) बहुत साफ-सुथरी और चौड़ी है। गली के दोनों ओर लोगों के सुंदर सजे हुए घर हैं।\n\nगाँव के छोर पर पावन जाहेर थान है, जहाँ साल के वृक्षों के नीचे प्रकृति व देवताओं की आराधना की जाती है। गाँव के लोग खेती-बाड़ी और शिल्प कार्यों में परिश्रम करते हैं। हमारे गाँव में एक विद्यालय भी है जहाँ बच्चे रोज़ पढ़ने जाते हैं।\n\nहमारे गाँव के लोग प्रेम और एकता के साथ रहते हैं। सुख-दुख में सब एक-दूसरे की मदद करते हैं। मुझे अपने गाँव से बहुत प्रेम है।',
      },
      {
        title: 'निबंध २: सोहराय परब (सोहराय महापर्व / Sohrai Festival)',
        subtitle: 'फसल कटाई, पशुधन सम्मान और भाईचारे का पाँच दिवसीय महापर्व',
        santaliDev:
          'सोहराय दो संताल समाज रेयाक् जोतो खोन माराङ आर रा़स्का़ परब काना। नोवा परब दो खेत खोन हूड़ू इर तायोम मोड़े दिन हा़बिच् को मानावा। सोहराय लाहा रे जोतो होड़ आकोवाक् ओड़ाक् को पोता़वा आर भीत रे नाना-हुना़र सोहराय चित्र को तेयारा।\n\nनोवा परब रेयाक् मुख्य दिन रे गाय-डांगरा को दाब्राव कोआ, सुनुम-सिंदूर को ओजोक् आकोआ आर जोम ला़गित् हूड़ू-पीठा को एमाकोआ। गोड़ा रे पशुधन रेयाक् सेवा आर सम्मान दो संताल संस्कृति रेयाक् अनमोल गुण काना।\n\nआ़युप् बेला अखड़ा रे तुमदाक्, तामाक् आर तिरियो रेयाक् सुर रे कोड़ा-कुड़ी जोतो मिसा काते सोहराय सेरेञ आर एनेच् को एतोहोबा। नोवा परब दो आबोन दुला़ड़, प्रकृति रेयाक् सम्मान आर एकता रेयाक् संदेश ए एमाबोना।',
        santaliRoman:
          'Sohrai do Santal samaj reyaq joto khon marang ar raska parab kana. Nowa parab do khet khon huṛu ir tayom moṛe din habic\' ko manawa. Sohrai laha re joto hoṛ akowaq oṛak\' ko potawa ar bhit re nana-hunar Sohrai chitra ko teyara.\n\nNowa parab reyaq mukhya din re gay-ḍangra ko dabraw koa, sunum-sindur ko ojoq akoa ar jom lagit\' huṛu-piṭha ko emakoa. Goṛa re pashudhan reyaq sewa ar samman do Santal sanskriti reyaq anmol gun kana.\n\nAyup\' bela akhṛa re tumdaq, tamaq ar tiriyo reyaq sur re koṛa-kuṛi joto misa kate Sohrai sereñ ar enec\' ko etohoba. Nowa parab do abon dulaṛ, prakriti reyaq samman ar ekta reyaq sandesh e emabona.',
        hindiTranslation:
          'सोहराय संताल समाज का सबसे बड़ा और आनंदमय पर्व है। यह पर्व खेत से धान कटने के बाद पाँच दिनों तक मनाया जाता है। सोहराय से पहले सभी लोग अपने घरों की लिपाई-पुताई करते हैं और दीवारों पर सुंदर सोहराय भित्तिचित्र बनाते हैं।\n\nइस पर्व के मुख्य दिन गाय-बैलों को नहलाया जाता है, तेल-सिंदूर लगाया जाता है और उन्हें पकवान खिलाए जाते हैं। पशुधन के प्रति यह कृतज्ञता संताल संस्कृति का अनमोल गुण है।\n\nशाम को अखड़ा में मांदार, नगाड़ा और बाँसुरी की धुन पर सभी मिलकर सोहराय गीत व नृत्य करते हैं। यह पर्व हमें प्रेम, प्रकृति के सम्मान और एकता का संदेश देता है।',
      },
      {
        title: 'निबंध ३: दारे-नाड़ी आर सिरजोन (पेड़-पौधे और प्रकृति / Trees & Nature)',
        subtitle: 'प्रकृति संरक्षण में साल, महुआ और वनों की भूमिका',
        santaliDev:
          'दारे-नाड़ी दो धरती रेयाक् सास आर जीवन काना। दारे खोन आबोन साफा होय, सिबिल जो, बाहा, काठ आर रान (औषधि) बोन ञामा। सारजोम, मातकोम, करम आर बारें दारे दो संताल जीवन आर संस्कृति साँव गहरा जुड़ाव मेनाक्आ।\n\nजहाँ जायगा रे आ़डी दारे मेनाक्आ, होंडे समय रे दाक्\' एत्आ आर धरती दो हरियाड़ ताहेँना। दारे दो हासा रेयाक् कटाव होँ ए रोकएत्आ। चेँड़े-चिपरुत् कोवाक् बासा होँ दारे रेगी ताहेँना।\n\nतेहेञ आबो जोतो होड़ाक् जिम्मेदारी काना जे दारे आलोबोन माक्आ आर जेतना दाड़ेयाक् नावा दारे बोन रोहोया। दारे बांचाव रेगी मानव जीवन बांचाक्आ।',
        santaliRoman:
          'Dare-naṛi do dharti reyaq sas ar jiwan kana. Dare khon abon sapha hoy, sibil jo, baha, kaṭh ar ran bon ñama. Sarjom, matkom, karam ar bareñ dare do Santal jiwan ar sanskriti sanw gahra juṛaw menaq-a.\n\nJahañ jayga re aḍi dare menaq-a, honde samay re dak\' et\'-a ar dharti do hariyaṛ taheñna. Dare do hasa reyaq kaṭaw hoñ e rok-et\'-a. Cheṅṛe-chiprut\' kowaq basa hoñ dare regi taheñna.\n\nTeheñ abo joto hoṛaq jimmedari kana je dare alobon maq-a ar jetna daṛeyaq nawa dare bon rohoya. Dare banchaw regi manaw jiwan banchaq-a.',
        hindiTranslation:
          'पेड़-पौधे धरती की साँस और जीवन हैं। पेड़ों से हमें शुद्ध वायु, मीठे फल, फूल, लकड़ी और औषधियाँ मिलती हैं। साल (सारजोम), महुआ (मातकोम), करम और बरगद के वृक्ष संताल जीवन और संस्कृति से गहराई से जुड़े हैं।\n\nजहाँ अधिक पेड़ होते हैं, वहाँ समय पर वर्षा होती है और धरती हरी-भरी रहती है। पेड़ मिट्टी के कटाव को भी रोकते हैं और पक्षियों का आवास भी पेड़ों पर ही होता है।\n\nआज हम सभी का कर्तव्य है कि पेड़ न काटें और अधिक से अधिक नए पौधे लगाएँ। पेड़ों के बचने में ही मानव जीवन की सुरक्षा है।',
      },
      {
        title: 'निबंध ४: सेचेत् रेयाक् ला़कती (शिक्षा का महत्व / Importance of Education)',
        subtitle: 'मातृभाषा, ज्ञान और समाज के उत्थान की कुंजी',
        santaliDev:
          'सेचेत् (शिक्षा) दो मानव जीवन रेयाक् जोतो खोन माराङ धोन काना। ओल-पढ़ाव ते होड़ रेयाक् बुद्धि माराङओक्आ आर सा़री-एड़े रेयाक् पहचान हुयुक्आ। सेचेत् बिना समाज रेयाक् पूरा उन्नति दो बाङ संभवओक्आ।\n\nगिदरा़ को आकोवाक् मातृभाषा संताली साँव हिंदी आर अंग्रेज़ी होँ नापाय ते चेत् ला़कतीया। मातृभाषा रे शिक्षा ञाम ले खान गिदरा़ को जाहाँनाक् विषय आ़डी लोगोन को बुझा़वा। तेहेञ डिजिटल युग रे विज्ञान, कंप्यूटर आर साहित्य जोतो क्षेत्र रे आबोवाक् गिदरा़ को लाहा सेन दाड़ेयाक्आ।\n\nओनाते जोतो एंगा-आपा ठेन नेहोर काना जे कोड़ा आर कुड़ी बारया गिदरा़ समान रूप ते इस्कूल कोलाकिन पे। सेचेत् आकान समाज गी मजबूत आर स्वाभिमानी हुयुक्आ।',
        santaliRoman:
          'Sechet\' do manaw jiwan reyaq joto khon marang dhon kana. Ol-paṛhaw te hoṛ reyaq buddhi marangoq-a ar sari-eṛe reyaq pahchan huyuq-a. Sechet\' bina samaj reyaq pura unnati do bang sambhawoq-a.\n\nGidra ko akowaq matribhasha Santali sanw Hindi ar Angrezi hoñ napay te chet\' laktiya. Matribhasha re shiksha ñam le khan gidra ko jahanaq bishay aḍi logon ko bujhawa. Teheñ digital yug re vigyan, computer ar sahitya joto kshetra re abowaq gidra ko laha sen daṛeyaq-a.\n\nOnate joto enga-apa ṭhen nehor kana je koṛa ar kuṛi barya gidra saman rup te iskul kolakin pe. Sechet\' akan samaj gi majbut ar swabhimanī huyuq-a.',
        hindiTranslation:
          'शिक्षा मानव जीवन का सबसे बड़ा धन है। पढ़ने-लिखने से मनुष्य की बुद्धि का विकास होता है और सही-गलत की पहचान आती है। शिक्षा के बिना समाज की पूर्ण उन्नति संभव नहीं है।\n\nबच्चों को अपनी मातृभाषा संताली के साथ हिंदी और अंग्रेज़ी भी अच्छी तरह सीखनी चाहिए। मातृभाषा में शिक्षा मिलने पर बच्चे किसी भी विषय को जल्दी समझते हैं। आज के डिजिटल युग में विज्ञान, कंप्यूटर और साहित्य हर क्षेत्र में हमारे बच्चे आगे बढ़ सकते हैं।\n\nअतः सभी माता-पिता से निवेदन है कि बेटे और बेटी दोनों को समान रूप से विद्यालय भेजें। शिक्षित समाज ही सशक्त और स्वाभिमानी बनता है।',
      },
    ],
  },
];

// ─── 60 ORIGINAL GRAMMAR PRACTICE MCQs (3 PER CHAPTER ACROSS ALL 20 CHAPTERS) ───
export const SANTALI_GRAMMAR_QUIZ_BANK: GrammarQuizQuestion[] = [
  // Chapter 01
  {
    id: 'gq01',
    chapterId: 'ch01_parsi_ronor',
    questionHi: 'संताली भाषा किस प्रमुख भाषा-परिवार से संबंधित है?',
    questionEn: 'Which language family does Santali belong to?',
    options: ['ऑस्ट्रो-एशियाटिक (मुंडा शाखा)', 'द्रविड़ भाषा परिवार', 'भारोपीय (आर्य) परिवार', 'तिब्बती-बर्मी परिवार'],
    correctIndex: 0,
    explanationHi: 'संताली ऑस्ट्रो-एशियाटिक परिवार की मुंडा उपशाखा की सबसे बड़ी और समृद्ध भाषा है।',
  },
  {
    id: 'gq02',
    chapterId: 'ch01_parsi_ronor',
    questionHi: 'संताली भाषा में "व्याकरण" को किस नाम से जाना जाता है?',
    questionEn: 'What is the Santali term for "Grammar"?',
    options: ['ओनोल (Onol)', 'रोनौड़ (Ronoṛ)', 'कुदुम (Kudum)', 'आयात् (Ayat)'],
    correctIndex: 1,
    explanationHi: 'संताली में व्याकरण को "रोनौड़" (Ronoṛ) कहते हैं, जो "रोड़" (बोलना) धातु में -न- मध्यसर्ग जुड़ने से बना है।',
  },
  {
    id: 'gq03',
    chapterId: 'ch01_parsi_ronor',
    questionHi: 'संताली को भारतीय संविधान की ८वीं अनुसूची में किस वर्ष शामिल किया गया?',
    questionEn: 'In which year was Santali added to the 8th Schedule of the Indian Constitution?',
    options: ['1992', '2000', '2003', '2011'],
    correctIndex: 2,
    explanationHi: '९२वें संविधान संशोधन अधिनियम (२००३) द्वारा संताली को ८वीं अनुसूची में संवैधानिक मान्यता प्राप्त हुई।',
  },

  // Chapter 02
  {
    id: 'gq04',
    chapterId: 'ch02_arang_harop',
    questionHi: 'संताली की ४ विशिष्ट रुद्ध ध्वनियाँ (Checked Consonants) कौन-सी हैं?',
    questionEn: 'Which are the four checked consonants of Santali?',
    options: ["क्', च्', त्', प्'", 'क, ख, ग, घ', 'र, ल, व, ह', 'श, ष, स, ह'],
    correctIndex: 0,
    explanationHi: "संताली में क्' (अक्), च्' (अच्), त्' (अत्) और प्' (अप्) चार विशिष्ट रुद्ध कंठ्य ध्वनियाँ होती हैं।",
  },
  {
    id: 'gq05',
    chapterId: 'ch02_arang_harop',
    questionHi: 'ओल चिकी लिपि में कुल कितने मूल अक्षर होते हैं?',
    questionEn: 'How many basic letters are there in the Ol Chiki script?',
    options: ['26 अक्षर', '30 अक्षर', '36 अक्षर', '44 अक्षर'],
    correctIndex: 1,
    explanationHi: 'पंडित रघुनाथ मुर्मू द्वारा १९२५ में निर्मित ओल चिकी लिपि में कुल ३० मूल अक्षर (६ स्वर + २४ व्यंजन) होते हैं।',
  },
  {
    id: 'gq06',
    chapterId: 'ch02_arang_harop',
    questionHi: 'संताली शब्द "दाक्\'" (Dak\') का शुद्ध हिंदी अर्थ क्या है?',
    questionEn: 'What does the Santali word "Dak\'" mean?',
    options: ['भोजन', 'पानी / जल', 'आग', 'पेड़'],
    correctIndex: 1,
    explanationHi: "दाक्' (Dak') का अर्थ जल/पानी होता है, जिसके अंत में रुद्ध ध्वनि क्' का प्रयोग होता है।",
  },

  // Chapter 03
  {
    id: 'gq07',
    chapterId: 'ch03_chinha',
    questionHi: 'संताली में प्रश्नवाचक चिह्न (?) को क्या कहा जाता है?',
    questionEn: 'What is the question mark (?) called in Santali grammar?',
    options: ['मुचा़त् चिन्हा', 'था़ड़ी चिन्हा', 'कुली चिन्हा', 'हाहाड़ा चिन्हा'],
    correctIndex: 2,
    explanationHi: 'संताली में "कुली" का अर्थ पूछना होता है, इसलिए प्रश्नवाचक चिह्न को "कुली चिन्हा" कहते हैं।',
  },
  {
    id: 'gq08',
    chapterId: 'ch03_chinha',
    questionHi: 'वाक्य समाप्त होने पर लगने वाले पूर्णविराम (। / ᱾) का संताली नाम क्या है?',
    questionEn: 'What is the Santali term for the full stop / sentence-ending mark?',
    options: ['मुचा़त् चिन्हा', 'जोनोड़ चिन्हा', 'था़ड़ी चिन्हा', 'कुली चिन्हा'],
    correctIndex: 0,
    explanationHi: 'मुचा़त् का अर्थ समाप्ति होता है; अतः पूर्णविराम को "मुचा़त् चिन्हा" कहा जाता है।',
  },
  {
    id: 'gq09',
    chapterId: 'ch03_chinha',
    questionHi: '"आहा! तिनैक् नापाय बाहा!" — इस वाक्य में किस चिह्न का प्रयोग हुआ है?',
    questionEn: 'Which punctuation mark is used in "Aha! Tinaiq napay baha!"?',
    options: ['अल्पविराम (था़ड़ी चिन्हा)', 'विस्मयादिबोधक (हाहाड़ा चिन्हा)', 'प्रश्नवाचक (कुली चिन्हा)', 'योजक (जोनोड़ चिन्हा)'],
    correctIndex: 1,
    explanationHi: 'आश्चर्य या हर्ष के भाव को दिखाने के लिए विस्मयादिबोधक चिह्न (!) अर्थात् "हाहाड़ा चिन्हा" लगाया जाता है।',
  },

  // Chapter 04
  {
    id: 'gq10',
    chapterId: 'ch04_sabad_tongen',
    questionHi: '"ओल" (लिखना) धातु में "-न-" मध्यसर्ग (Infix) जोड़ने से कौन-सा संज्ञा शब्द बनता है?',
    questionEn: 'Adding the infix -n- to "ol" (to write) produces which noun?',
    options: ['ओपोल', 'ओनोल (लेख/निबंध)', 'ओलको', 'ओलाक्'],
    correctIndex: 1,
    explanationHi: 'ओल + -न- मध्यसर्ग = ओनोल (Onol), जिसका अर्थ लेख, रचना या निबंध होता है।',
  },
  {
    id: 'gq11',
    chapterId: 'ch04_sabad_tongen',
    questionHi: '"ञेल" (देखना) से बना पारस्परिक क्रिया शब्द "ञेपेल" (एक-दूसरे से मिलना) किस मध्यसर्ग से बना है?',
    questionEn: 'Which infix transforms "ñel" (see) into "ñepel" (meet each other)?',
    options: ['-न- (-n-)', '-प- (-p-)', '-को (-ko)', '-ते (-te)'],
    correctIndex: 1,
    explanationHi: 'संताली में -प- (-p-) मध्यसर्ग जोड़कर पारस्परिक क्रिया (Reciprocal verb) बनाई जाती है, जैसे ञेल → ञेपेल, दाल → दापाल।',
  },
  {
    id: 'gq12',
    chapterId: 'ch04_sabad_tongen',
    questionHi: 'संताली व्याकरण में शब्द के बीच में जुड़ने वाले शब्दांश को क्या कहते हैं?',
    questionEn: 'What is an infix called in Santali grammar?',
    options: ['लाहा तोंगेन', 'ताला तोंगेन', 'तायोम तोंगेन', 'मुचा़त् तोंगेन'],
    correctIndex: 1,
    explanationHi: 'ताला का अर्थ बीच होता है; इसलिए मध्यसर्ग को "ताला तोंगेन" कहा जाता है।',
  },

  // Chapter 05
  {
    id: 'gq13',
    chapterId: 'ch05_nutum',
    questionHi: 'संताली व्याकरण में निम्नलिखित में से किसे "जीवीयान" (सजीव) संज्ञा माना जाता है?',
    questionEn: 'Which of the following is classified as Animate (Jiwiyan) in Santali grammar?',
    options: ['ओड़ाक् (घर)', 'इपिल आर चांदो (तारे और चाँद)', 'धिरी (पत्थर)', 'पुथी (पुस्तक)'],
    correctIndex: 1,
    explanationHi: 'संताली व्याकरण में मनुष्यों, पशु-पक्षियों के अलावा सूर्य, चंद्रमा, तारे (इपिल) और बोंगा को भी सजीव (जीवीयान) माना जाता है।',
  },
  {
    id: 'gq14',
    chapterId: 'ch05_nutum',
    questionHi: '"दुला़ड़" (प्रेम) और "रा़स्का़" (खुशी) किस प्रकार की संज्ञाएँ हैं?',
    questionEn: 'Which noun category do "Dulaṛ" (love) and "Raska" (joy) belong to?',
    options: ['व्यक्तिवाचक (आसोल ञुतुम)', 'द्रव्यवाचक (जिनिस ञुतुम)', 'भाववाचक (गुन ञुतुम)', 'समूहवाचक (गा़देल् ञुतुम)'],
    correctIndex: 2,
    explanationHi: 'गुण, भाव या अवस्था को बताने वाले शब्द भाववाचक संज्ञा (गुन ञुतुम) कहलाते हैं।',
  },
  {
    id: 'gq15',
    chapterId: 'ch05_nutum',
    questionHi: 'निर्जीव संज्ञा के साथ संबंध जोड़ने के लिए "रेन" की जगह क्या प्रयोग होता है?',
    questionEn: 'Instead of "ren", which possessive marker is used for inanimate nouns?',
    options: ['रेयाक् / आक्', 'किन', 'मे', 'आलो'],
    correctIndex: 0,
    explanationHi: 'सजीव के लिए "रेन" (आतु रेन होड़) और निर्जीव के लिए "रेयाक्" (दारे रेयाक् साकाम) प्रयुक्त होता है।',
  },

  // Chapter 06
  {
    id: 'gq16',
    chapterId: 'ch06_janang',
    questionHi: 'संताली व्याकरण में लिंग (जानाङ) के कुल कितने भेद माने जाते हैं?',
    questionEn: 'How many gender categories (Janang) are recognized in Santali grammar?',
    options: ['२ भेद', '३ भेद', '४ भेद', '५ भेद'],
    correctIndex: 2,
    explanationHi: 'संताली में ४ लिंग भेद होते हैं: कोड़ा जानाङ (पुल्लिंग), कुड़ी जानाङ (स्त्रीलिंग), बार जानाङ (उभयलिंग) और जानाङ बाङ (निर्जीव)।',
  },
  {
    id: 'gq17',
    chapterId: 'ch06_janang',
    questionHi: '"सिम सांड" (मुर्गा) का शुद्ध स्त्रीलिंग (कुड़ी जानाङ) रूप क्या है?',
    questionEn: 'What is the feminine counterpart of "Sim sand" (rooster)?',
    options: ['सिम एंगा', 'सिम कोड़ा', 'सिम गाय', 'सिम बुढ़ी'],
    correctIndex: 0,
    explanationHi: 'पशु-पक्षियों में मादा रूप दर्शाने के लिए "एंगा" लगाया जाता है — सिम एंगा (मुर्गी)।',
  },
  {
    id: 'gq18',
    chapterId: 'ch06_janang',
    questionHi: 'संताली में कर्ता के पुल्लिंग से स्त्रीलिंग होने पर क्रिया के रूप में क्या परिवर्तन होता है?',
    questionEn: 'How does a Santali verb change when the subject changes from masculine to feminine?',
    options: ['क्रिया के अंत में -ई जुड़ता है', 'क्रिया में कोई परिवर्तन नहीं होता', 'क्रिया के अंत में -किन जुड़ता है', 'क्रिया का काल बदल जाता है'],
    correctIndex: 1,
    explanationHi: 'संताली क्रियाएँ लिंग (पुरुष/स्त्री) के अनुसार नहीं बदलतीं — "कोड़ा ए जोम काना" और "कुड़ी ए जोम काना" दोनों में क्रिया समान है।',
  },

  // Chapter 07
  {
    id: 'gq19',
    chapterId: 'ch07_gotang',
    questionHi: 'संताली में द्विवचन (Dual Number — ठीक दो) दिखाने के लिए कौन-सा प्रत्यय लगता है?',
    questionEn: 'Which suffix indicates the Dual number (exactly two) in Santali?',
    options: ['-को (-ko)', '-किन (-kin)', '-ते (-te)', '-रे (-re)'],
    correctIndex: 1,
    explanationHi: 'ठीक दो सजीव प्राणियों या व्यक्तियों के लिए संताली में "-किन" (जैसे होड़किन = दो लोग) प्रत्यय लगता है।',
  },
  {
    id: 'gq20',
    chapterId: 'ch07_gotang',
    questionHi: '"चेँड़ेको" (Cheṅṛeko) शब्द किस वचन का उदाहरण है?',
    questionEn: 'Which grammatical number is represented by "Cheṅṛeko"?',
    options: ['एकवचन (मित् गोटाङ)', 'द्विवचन (बार गोटाङ)', 'बहुवचन (सांगे गोटाङ)', 'अव्यय'],
    correctIndex: 2,
    explanationHi: 'अंत में "-को" प्रत्यय होने के कारण "चेँड़ेको" (अनेक पक्षी) बहुवचन (सांगे गोटाङ) है।',
  },
  {
    id: 'gq21',
    chapterId: 'ch07_gotang',
    questionHi: '"दो कुत्ते" के लिए शुद्ध संताली शब्द क्या होगा?',
    questionEn: 'What is the correct Santali form for "two dogs"?',
    options: ['सेता', 'सेताकिन', 'सेताको', 'सेतारे'],
    correctIndex: 1,
    explanationHi: 'कुत्ता को "सेता" कहते हैं और द्विवचन के लिए "-किन" जोड़कर "सेताकिन" (दो कुत्ते) बनता है।',
  },

  // Chapter 08
  {
    id: 'gq22',
    chapterId: 'ch08_sanga_karak',
    questionHi: '"दारे खोन साकाम ञूर एना" (पेड़ से पत्ता गिरा) — यहाँ "खोन" किस कारक का चिह्न है?',
    questionEn: 'In "Dare khon sakam ñur ena", which case does "khon" mark?',
    options: ['करण कारक', 'संप्रदान कारक', 'अपादान कारक', 'अधिकरण कारक'],
    correctIndex: 2,
    explanationHi: 'अलग होने का भाव दिखाने वाला "खोन" (से) अपादान कारक (Ablative Case) का विभक्ति चिह्न है।',
  },
  {
    id: 'gq23',
    chapterId: 'ch08_sanga_karak',
    questionHi: 'संताली में अधिकरण कारक (Locative — में / पर) का चिह्न कौन-सा है?',
    questionEn: 'Which postposition marks the Locative case ("in / on") in Santali?',
    options: ['ला़गित्', 'खोन', 'रे', 'ते'],
    correctIndex: 2,
    explanationHi: '"रे" (re) अधिकरण कारक का चिह्न है — जैसे "ओड़ाक् रे" (घर में), "दारे रे" (पेड़ पर)।',
  },
  {
    id: 'gq24',
    chapterId: 'ch08_sanga_karak',
    questionHi: '"कोलोम तेञ ओल काना" (मैं कलम से लिख रहा हूँ) — इसमें "ते" किस कारक को दर्शाता है?',
    questionEn: 'What case does "te" mark in "Kolom teñ ol kana"?',
    options: ['करण कारक (साधन)', 'अपादान कारक', 'संबंध कारक', 'संबोधन कारक'],
    correctIndex: 0,
    explanationHi: 'जिस साधन या माध्यम से कार्य किया जाए, वहाँ करण कारक का चिह्न "ते" लगता है।',
  },

  // Chapter 09
  {
    id: 'gq25',
    chapterId: 'ch09_unutum',
    questionHi: '"हम सब (सुनने वाले को शामिल करते हुए)" के लिए संताली में कौन-सा सर्वनाम प्रयुक्त होता है?',
    questionEn: 'Which Santali pronoun means "We all (Inclusive — including the listener)"?',
    options: ['आले (Ale)', 'आलिञ (Aliñ)', 'आबोन (Abon)', 'उनकु (Unku)'],
    correctIndex: 2,
    explanationHi: 'आबोन (Abon) बहुवचन समावेशी सर्वनाम है जिसमें वक्ता के साथ श्रोता भी शामिल होता है। "आले" अपवर्जक (Exclusive) है।',
  },
  {
    id: 'gq26',
    chapterId: 'ch09_unutum',
    questionHi: '"हम दोनों (मैं और मेरा साथी, आप नहीं)" के लिए शुद्ध सर्वनाम कौन-सा है?',
    questionEn: 'Which pronoun translates to "We two (Exclusive — excluding the listener)"?',
    options: ['आलाङ (Alang)', 'आलिञ (Aliñ)', 'आबेन (Aben)', 'उनकिन (Unkin)'],
    correctIndex: 1,
    explanationHi: 'आलिञ (Aliñ) द्विवचन अपवर्जक सर्वनाम है (श्रोता बाहर); जबकि "आलाङ" द्विवचन समावेशी है (मैं + तू)।',
  },
  {
    id: 'gq27',
    chapterId: 'ch09_unutum',
    questionHi: 'निकट स्थित किसी सजीव व्यक्ति की ओर संकेत करने के लिए किस सर्वनाम का प्रयोग होगा?',
    questionEn: 'Which demonstrative pronoun points to a nearby animate person?',
    options: ['नोवा (Nowa)', 'ओना (Ona)', 'नुई (Nui)', 'चेत् (Chet\')'],
    correctIndex: 2,
    explanationHi: 'निकट सजीव के लिए "नुई" (यह व्यक्ति) और निकट निर्जीव के लिए "नोवा" (यह वस्तु) लगता है।',
  },

  // Chapter 10
  {
    id: 'gq28',
    chapterId: 'ch10_gunum',
    questionHi: 'संताली में सर्वश्रेष्ठ तुलना (Superlative — "सबसे अच्छा") कैसे लिखी जाती है?',
    questionEn: 'How is "the best" (superlative) expressed in Santali?',
    options: ['नापायकिन', 'जोतो खोन नापाय', 'नापायते', 'आलो नापाय'],
    correctIndex: 1,
    explanationHi: 'सर्वश्रेष्ठ तुलना दिखाने के लिए विशेषण से पहले "जोतो खोन" (सबसे) जोड़ा जाता है — जोतो खोन नापाय।',
  },
  {
    id: 'gq29',
    chapterId: 'ch10_gunum',
    questionHi: '"आराक् बाहा" में विशेषण शब्द कौन-सा है और उसका अर्थ क्या है?',
    questionEn: 'Identify the adjective and its meaning in "Araq baha".',
    options: ['बाहा — फूल', 'आराक् — लाल', 'आराक् — पीला', 'बाहा — सुंदर'],
    correctIndex: 1,
    explanationHi: '"आराक्" (लाल) गुणवाचक/रंगवाचक विशेषण है जो "बाहा" (फूल) संज्ञा की विशेषता बता रहा है।',
  },
  {
    id: 'gq30',
    chapterId: 'ch10_gunum',
    questionHi: 'संताली विशेषण "सिबिल" (Sibil) का हिंदी अर्थ क्या है?',
    questionEn: 'What does the Santali adjective "Sibil" mean?',
    options: ['कड़वा', 'मीठा / स्वादिष्ट', 'कठोर', 'ऊँचा'],
    correctIndex: 1,
    explanationHi: '"सिबिल" का अर्थ मीठा या स्वादिष्ट होता है (जैसे सिबिल दाका, सिबिल जो)।',
  },

  // Chapter 11
  {
    id: 'gq31',
    chapterId: 'ch11_kami_verb',
    questionHi: 'कर्ता "आम" (तुम) होने पर क्रिया से पहले कौन-सा संक्षिप्त कर्ता चिह्न जुड़ता है?',
    questionEn: 'Which subject enclitic corresponds to the pronoun "Am" (you)?',
    options: ['-ञ (-ñ)', '-म (-m)', '-ए (-e)', '-को (-ko)'],
    correctIndex: 1,
    explanationHi: 'मध्यम पुरुष एकवचन "आम" के साथ "-म" जुड़ता है, जैसे: आम दाकाम जोमा (तुम भात खाओगे)।',
  },
  {
    id: 'gq32',
    chapterId: 'ch11_kami_verb',
    questionHi: 'निम्नलिखित में से कौन-सी क्रिया अकर्मक (Intransitive) है?',
    questionEn: 'Which of the following is an intransitive verb?',
    options: ['जोम (खाना)', 'ओल (लिखना)', 'जा़पित् (सोना)', 'ञु (पीना)'],
    correctIndex: 2,
    explanationHi: '"जा़पित्" (सोना) अकर्मक क्रिया है क्योंकि इसे किसी कर्म की आवश्यकता नहीं होती।',
  },
  {
    id: 'gq33',
    chapterId: 'ch11_kami_verb',
    questionHi: 'संताली में पूर्ण कथनात्मक क्रिया के अंत में कौन-सा समापिका चिह्न जुड़ता है?',
    questionEn: 'Which finite marker typically closes a declarative verb in Santali?',
    options: ['-आ (-a)', '-मे (-me)', '-खोन (-khon)', '-किन (-kin)'],
    correctIndex: 0,
    explanationHi: 'सामान्य कथनात्मक वाक्य की क्रिया के अंत में "-आ" समापिका चिह्न लगता है (काना, केदा, जोमा)।',
  },

  // Chapter 12
  {
    id: 'gq34',
    chapterId: 'ch12_okte_tense',
    questionHi: '"इञ पुथीञ पढ़ाव केदा" — यह वाक्य किस काल (ओकते) का है?',
    questionEn: 'Which tense is used in "Iñ puthiñ paṛhaw keda"?',
    options: ['वर्तमान काल', 'भूतकाल (सकर्मक पूर्ण)', 'भविष्यत् काल', 'आज्ञार्थक'],
    correctIndex: 1,
    explanationHi: 'सकर्मक क्रिया में "-केदा" प्रत्यय कार्य के पूरा हो चुके होने अर्थात् भूतकाल को दर्शाता है।',
  },
  {
    id: 'gq35',
    chapterId: 'ch12_okte_tense',
    questionHi: 'अकर्मक क्रिया "हिजुक्" (आना) का भूतकाल रूप क्या होता है?',
    questionEn: 'What is the past tense form of the intransitive verb "hijuq" (come)?',
    options: ['हिजुक् केदा', 'हेच् एना', 'हिजुक् काना', 'हेच् आ'],
    correctIndex: 1,
    explanationHi: 'अकर्मक क्रियाओं का भूतकाल "-एना" प्रत्यय से बनता है — हिजुक् → हेच् एना (आया)।',
  },
  {
    id: 'gq36',
    chapterId: 'ch12_okte_tense',
    questionHi: '"गापा इञ इस्कूल तेञ चलाक्आ" — इस वाक्य का सही हिंदी अनुवाद क्या है?',
    questionEn: 'Translate "Gapa iñ iskul teñ chalaq-a" accurately.',
    options: ['कल मैं स्कूल गया था।', 'आज मैं स्कूल जा रहा हूँ।', 'कल मैं स्कूल जाऊँगा।', 'मैं स्कूल नहीं जाता।'],
    correctIndex: 2,
    explanationHi: '"गापा" का अर्थ आने वाला कल है और "चलाक्आ" भविष्यत् काल रूप है — कल मैं स्कूल जाऊँगा।',
  },

  // Chapter 13
  {
    id: 'gq37',
    chapterId: 'ch13_men_voice',
    questionHi: '"दाका इसिन एना" (भात पक गया) किस वाच्य का उदाहरण है?',
    questionEn: 'Which voice is demonstrated in "Daka isin ena" (The rice is cooked)?',
    options: ['कर्तृवाच्य (Active)', 'कर्म / मध्यम वाच्य (Passive / Middle)', 'पारस्परिक वाच्य (Reciprocal)', 'आज्ञावाचक'],
    correctIndex: 1,
    explanationHi: 'यहाँ कर्म (दाका) की अवस्था स्वतः पूर्ण दिखाई गई है और "-एना" लगा है, अतः यह कर्म/मध्यम वाच्य है।',
  },
  {
    id: 'gq38',
    chapterId: 'ch13_men_voice',
    questionHi: '"गोड़ो" (मदद करना) का पारस्परिक वाच्य ("एक-दूसरे की मदद करना") क्या होगा?',
    questionEn: 'What is the reciprocal voice form of "goṛo" (to help)?',
    options: ['गोड़ो केदा', 'गोपोड़ो', 'गोड़ो एना', 'गोनोड़ो'],
    correctIndex: 1,
    explanationHi: '-प- मध्यसर्ग जोड़ने से "गोड़ो" → "गोपोड़ो" (आपस में एक-दूसरे की सहायता करना) बनता है।',
  },
  {
    id: 'gq39',
    chapterId: 'ch13_men_voice',
    questionHi: '"रोपोड़" शब्द का सही अर्थ क्या है?',
    questionEn: 'What does the reciprocal verb "ropoṛ" mean?',
    options: ['अकेले चुप रहना', 'आपस में बातचीत/चर्चा करना', 'तेज़ दौड़ना', 'पत्र लिखना'],
    correctIndex: 1,
    explanationHi: '"रोड़" (बोलना) में -प- मध्यसर्ग जुड़ने से "रोपोड़" बनता है, जिसका अर्थ आपस में संवाद करना होता है।',
  },

  // Chapter 14
  {
    id: 'gq40',
    chapterId: 'ch14_kami_gunum',
    questionHi: 'संताली क्रिया-विशेषण "बा़य-बा़य ते" का सही अर्थ क्या है?',
    questionEn: 'What does the adverb "Bay-bay te" mean?',
    options: ['बहुत तेज़ी से', 'धीरे-धीरे', 'कल शाम', 'बाहर की ओर'],
    correctIndex: 1,
    explanationHi: '"बा़य-बा़य ते" रीतिवाचक क्रिया-विशेषण है जिसका अर्थ "धीरे-धीरे / आराम से" होता है।',
  },
  {
    id: 'gq41',
    chapterId: 'ch14_kami_gunum',
    questionHi: 'निम्नलिखित में से कौन-सा शब्द कालवाचक क्रिया-विशेषण है?',
    questionEn: 'Which of the following is an adverb of time?',
    options: ['नोंडे (यहाँ)', 'होला (बीता कल)', 'सांगिञ (दूर)', 'लोगोन (जल्दी)'],
    correctIndex: 1,
    explanationHi: '"होला" (बीता कल) समय का बोध कराता है, अतः यह कालवाचक क्रिया-विशेषण है।',
  },
  {
    id: 'gq42',
    chapterId: 'ch14_kami_gunum',
    questionHi: '"दिनोम" (Dinom) और "नितोक्" (Nitoq) के क्रमशः हिंदी अर्थ क्या हैं?',
    questionEn: 'What are the meanings of "Dinom" and "Nitoq" respectively?',
    options: ['रोज़ और अभी', 'कल और परसों', 'यहाँ और वहाँ', 'कम और ज्यादा'],
    correctIndex: 0,
    explanationHi: 'दिनोम = प्रतिदिन/रोज़ तथा नितोक् = अभी/इस समय।',
  },

  // Chapter 15
  {
    id: 'gq43',
    chapterId: 'ch15_topol_jonor',
    questionHi: 'दो विपरीत विचारों को जोड़ने वाला संताली समुच्चयबोधक "मेनखान" का हिंदी अर्थ क्या है?',
    questionEn: 'What does the conjunction "Menkhan" mean?',
    options: ['और', 'लेकिन / परंतु', 'इसलिए', 'क्योंकि'],
    correctIndex: 1,
    explanationHi: '"मेनखान" (Menkhan) का अर्थ "लेकिन / किंतु / परंतु" होता है।',
  },
  {
    id: 'gq44',
    chapterId: 'ch15_topol_jonor',
    questionHi: '"दारे लातार रे" का सही हिंदी अर्थ क्या है?',
    questionEn: 'What does "Dare latar re" mean?',
    options: ['पेड़ के ऊपर', 'पेड़ के नीचे', 'पेड़ के पीछे', 'पेड़ के आगे'],
    correctIndex: 1,
    explanationHi: '"लातार रे" संबंधबोधक का अर्थ "के नीचे" होता है (चेतान रे = के ऊपर)।',
  },
  {
    id: 'gq45',
    chapterId: 'ch15_topol_jonor',
    questionHi: 'कारण बताने के लिए संताली में किस समुच्चयबोधक का प्रयोग होता है?',
    questionEn: 'Which conjunction introduces a reason ("because") in Santali?',
    options: ['चेदाक् जे (क्योंकि)', 'बाङखान (वरना)', 'आर (और)', 'आहा!'],
    correctIndex: 0,
    explanationHi: '"चेदाक् जे" का अर्थ "क्योंकि" होता है और "ओनाते" का अर्थ "इसलिए" होता है।',
  },

  // Chapter 16
  {
    id: 'gq46',
    chapterId: 'ch16_ayat_syntax',
    questionHi: '"झूठ मत बोलो" — आज्ञा-निषेध (Prohibition) के लिए कौन-सा संताली वाक्य शुद्ध है?',
    questionEn: 'Which sentence correctly translates the prohibition "Do not tell lies"?',
    options: ['एड़े कथा बाम रोड़ा।', 'एड़े कथा आलोम रोड़ा।', 'एड़े कथा आर रोड़ा।', 'एड़े कथा रे रोड़ा।'],
    correctIndex: 1,
    explanationHi: 'मनाही या आज्ञा-निषेध ("मत करो") के लिए संताली में सदैव "आलो" (आलोम / आलोपे) का प्रयोग होता है, "बाङ" का नहीं।',
  },
  {
    id: 'gq47',
    chapterId: 'ch16_ayat_syntax',
    questionHi: 'संताली वाक्य का मानक पद-क्रम (Word Order) क्या होता है?',
    questionEn: 'What is the standard word order of a Santali sentence?',
    options: ['SVO (कर्ता–क्रिया–कर्म)', 'SOV (कर्ता–कर्म–क्रिया)', 'VSO (क्रिया–कर्ता–कर्म)', 'OSV (कर्म–कर्ता–क्रिया)'],
    correctIndex: 1,
    explanationHi: 'संताली का मानक पद-क्रम कर्ता + कर्म + क्रिया (SOV) होता है, जैसे "आयो दाका ए इसिन काना"।',
  },
  {
    id: 'gq48',
    chapterId: 'ch16_ayat_syntax',
    questionHi: '"मैं चाय नहीं पीता" — यहाँ तथ्य नकारने के लिए "इञ" के साथ कौन-सा निषेध रूप लगेगा?',
    questionEn: 'Which negative form pairs with "Iñ" (I) for factual negation?',
    options: ['आलोञ', 'बाञ (Bañ)', 'बाय (Bay)', 'बाको (Bako)'],
    correctIndex: 1,
    explanationHi: 'सामान्य निषेध में "बा-" के साथ कर्ता चिह्न "-ञ" जुड़कर "बाञ" (मैं नहीं) बनता है: इञ दो चा बाञ ञुया।',
  },

  // Chapter 17
  {
    id: 'gq49',
    chapterId: 'ch17_ulta_soman',
    questionHi: 'संताली शब्द "लोलो" (गरम) का शुद्ध विलोम (उल्टा़ साबाद) क्या है?',
    questionEn: 'What is the antonym of "Lolo" (hot)?',
    options: ['सिबिल (मीठा)', 'रेयाड़ (ठंडा)', 'मारे (पुराना)', 'सांगिञ (दूर)'],
    correctIndex: 1,
    explanationHi: '"लोलो" (गरम) का विलोम "रेयाड़" (ठंडा) होता है।',
  },
  {
    id: 'gq50',
    chapterId: 'ch17_ulta_soman',
    questionHi: '"सा़री" (सत्य) का विपरीत शब्द क्या है?',
    questionEn: 'What is the opposite of "Sari" (truth)?',
    options: ['नापाय', 'एड़े (झूठ)', 'रा़स्का़', 'नावा'],
    correctIndex: 1,
    explanationHi: '"सा़री" (सच) का विलोम "एड़े" (झूठ/असत्य) है।',
  },
  {
    id: 'gq51',
    chapterId: 'ch17_ulta_soman',
    questionHi: 'संताली जोड़ा शब्द "दारे-नाड़ी" का व्यापक अर्थ क्या होता है?',
    questionEn: 'What broad concept does the pair-word "Dare-naṛi" represent?',
    options: ['केवल घर-परिवार', 'पेड़-पौधे और समस्त वनस्पति जगत', 'केवल खेत के औज़ार', 'चाँद और तारे'],
    correctIndex: 1,
    explanationHi: '"दारे" (पेड़) और "नाड़ी" (लता/बेल) मिलकर पूरे पेड़-पौधे व प्रकृति-जगत को दर्शाते हैं।',
  },

  // Chapter 18
  {
    id: 'gq52',
    chapterId: 'ch18_kudum_menkatha',
    questionHi: 'कुदुम: "ञिंदा दोय आ़डी सांगे, सिंगि दो बाको ञेलोक्" — इस पहेली का सही उत्तर क्या है?',
    questionEn: 'Riddle: "Numerous at night, invisible by day" — what is the answer?',
    options: ['दारे (पेड़)', 'इपिल (तारे)', 'गाडा (नदी)', 'मेत् (आँखें)'],
    correctIndex: 1,
    explanationHi: 'तारे (इपिल) रात में असंख्य दिखते हैं लेकिन दिन के उजाले में दिखाई नहीं देते।',
  },
  {
    id: 'gq53',
    chapterId: 'ch18_kudum_menkatha',
    questionHi: 'कहावत "मित् का़टुप् ते दो दाका बाङ जोमोक्आ" का मुख्य संदेश क्या है?',
    questionEn: 'What is the core moral of "Mit\' kaṭup\' te do daka bang jomoq-a"?',
    options: ['अकेले भोजन करना चाहिए', 'एकता और सामूहिक सहयोग में ही शक्ति है', 'जल्दी सोना चाहिए', 'दूर यात्रा नहीं करनी चाहिए'],
    correctIndex: 1,
    explanationHi: 'जैसे एक उँगली से भात नहीं खाया जा सकता, वैसे ही समाज के बड़े काम सबकी एकता से पूरे होते हैं।',
  },
  {
    id: 'gq54',
    chapterId: 'ch18_kudum_menkatha',
    questionHi: 'संताली लोक परंपरा में "कुदुम" का हिंदी अर्थ क्या होता है?',
    questionEn: 'What does "Kudum" mean in Santali folk tradition?',
    options: ['आवेदन पत्र', 'लोक पहेली', 'व्याकरण सूत्र', 'यात्रा वृत्तांत'],
    correctIndex: 1,
    explanationHi: 'कुदुम का अर्थ पहेली होता है, जो पारंपरिक ज्ञान और बुद्धि-चातुर्य को बढ़ाती है।',
  },

  // Chapter 19
  {
    id: 'gq55',
    chapterId: 'ch19_chithi_onol',
    questionHi: 'संताली पत्र में पिताजी या बड़े-बुजुर्गों को सादर अभिवादन के लिए क्या लिखा जाता है?',
    questionEn: 'Which respectful greeting is used for parents/elders in a Santali letter?',
    options: ['बिसॉय', 'डोबोक जोहार', 'मा़हित्', 'आलोम'],
    correctIndex: 1,
    explanationHi: 'बड़ों व माता-पिता के प्रति आदर प्रकट करने हेतु "डोबोक जोहार" लिखा जाता है।',
  },
  {
    id: 'gq56',
    chapterId: 'ch19_chithi_onol',
    questionHi: 'संताली औपचारिक पत्र में "दिनांक (Date)" को किस शब्द से लिखा जाता है?',
    questionEn: 'Which Santali word represents "Date" in a letter header?',
    options: ['मा़हित् (Mahit\')', 'चानोच् (Chanoch\')', 'आतु (Atu)', 'नेहोर (Nehor)'],
    correctIndex: 0,
    explanationHi: 'संताली पत्र-लेखन में तारीख/दिनांक के लिए "मा़हित्" (Mahit\') शब्द प्रयुक्त होता है।',
  },
  {
    id: 'gq57',
    chapterId: 'ch19_chithi_onol',
    questionHi: 'आवेदन पत्र में "प्रार्थना / विनम्र निवेदन" के लिए शुद्ध संताली शब्द क्या है?',
    questionEn: 'What is the Santali word for polite request/application?',
    options: ['नेहोर (Nehor)', 'उल्टा़ (Ulta)', 'गा़देल् (Gadel)', 'बुरु (Buru)'],
    correctIndex: 0,
    explanationHi: '"नेहोर" का अर्थ विनम्र प्रार्थना या निवेदन होता है — "नेहोर चिठी" (प्रार्थना पत्र)।',
  },

  // Chapter 20
  {
    id: 'gq58',
    chapterId: 'ch20_onol_essays',
    questionHi: 'संताली निबंधों में प्रयुक्त "जाहेर थान" गाँव के किस पवित्र स्थल को दर्शाता है?',
    questionEn: 'What does "Jaher Than" signify in Santal village culture?',
    options: ['बाज़ार मैदान', 'पावन देव-उपवन (साल वृक्षों का पूजा स्थल)', 'विद्यालय भवन', 'अनाज गोदाम'],
    correctIndex: 1,
    explanationHi: 'जाहेर थान संताल गाँव के छोर पर साल (सारजोम) वृक्षों का पवित्र पूजा स्थल होता है।',
  },
  {
    id: 'gq59',
    chapterId: 'ch20_onol_essays',
    questionHi: 'संताली में "शिक्षा" के लिए कौन-सा मानक शब्द प्रयोग किया जाता है?',
    questionEn: 'Which standard Santali word means "education"?',
    options: ['सेचेत् (Sechet\')', 'सोहराय (Sohrai)', 'कुलही (Kulhi)', 'तामाक् (Tamaq)'],
    correctIndex: 0,
    explanationHi: '"सेचेत्" (Sechet\') का अर्थ शिक्षा या विद्या होता है (जैसे: सेचेत् रेयाक् ला़कती = शिक्षा का महत्व)।',
  },
  {
    id: 'gq60',
    chapterId: 'ch20_onol_essays',
    questionHi: 'संताली में "साल वृक्ष" को क्या कहा जाता है?',
    questionEn: 'What is the Sal tree called in Santali?',
    options: ['मातकोम', 'सारजोम', 'कांटाड़', 'उल'],
    correctIndex: 1,
    explanationHi: 'साल वृक्ष को संताली में "सारजोम" (Sarjom) और महुआ को "मातकोम" (Matkom) कहते हैं।',
  },
];
