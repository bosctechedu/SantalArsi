import { ReadingLanguageMode } from '../utils/speech';

export type ReaderDocGroup =
  | 'all'
  | 'trilingual'
  | 'history'
  | 'culture'
  | 'grammar'
  | 'english'
  | 'exams';

export interface PreloadedDoc {
  id: string;
  group: Exclude<ReaderDocGroup, 'all'>;
  title: string;
  category: string;
  santaliTitle: string;
  santaliDevanagariTitle: string;
  defaultLangMode: ReadingLanguageMode;
  text: string;
}

export const READER_DOC_GROUPS: { id: ReaderDocGroup; label: string }[] = [
  { id: 'all', label: 'सभी (36)' },
  { id: 'trilingual', label: 'त्रि-भाषी व संवाद' },
  { id: 'history', label: 'इतिहास व नायक' },
  { id: 'culture', label: 'संस्कृति व पर्व' },
  { id: 'grammar', label: 'व्याकरण व साहित्य' },
  { id: 'english', label: 'English Reading' },
  { id: 'exams', label: 'परीक्षा तैयारी' }
];

export const PRELOADED_READER_DOCS: PreloadedDoc[] = [
  // ═══ 1. त्रि-भाषी व दैनिक संताली संवाद (6 Docs) ═══
  {
    id: 'trilingual_pure_demo',
    group: 'trilingual',
    title: '3-भाषा शुद्ध महिला वाचन (संताली + हिन्दी + English)',
    category: 'त्रि-भाषी शुद्ध परीक्षण',
    santaliTitle: 'Pure Trilingual Female Reader Demo (HI + EN + Santali)',
    santaliDevanagariTitle: 'जोहार! संताली, हिन्दी आर अंग्रेज़ी शुद्ध वाचन',
    defaultLangMode: 'all',
    text: `जोहार! संताली पारसी आ़डी नापाय काना, आबोन जोतो होड़ संताली बोन पढ़ावा। आबो रोड़, आबो उपरुम, आबो गोरोब।
हिन्दी हमारी गौरवशाली भाषा है और यह पूरे भारत को संस्कृति व साहित्य के सूत्र में जोड़ती है।
And now the pure female reader seamlessly switches to natural English so you can study Santali, Hindi, and English together without robotic distortion.`
  },
  {
    id: 'johar_etiquette',
    group: 'trilingual',
    title: 'जोहार, शिष्टाचार व दैनिक संताली अभिवादन',
    category: 'दैनिक संवाद · संताली-हिन्दी',
    santaliTitle: 'Johar & Daily Santali Greetings',
    santaliDevanagariTitle: 'सागुन सेताक्, जोहार आर भला-कुशल काथा',
    defaultLangMode: 'all',
    text: `जोहार! आम चेत् लेका मेनामा? इञ दो नापाय गे मेनाञा। ओड़ाक् रे जोतो होड़ नापाय गे मेनाक् कोवा से बाङ?
सुबह मिलने पर हम कहते हैं "सागुन सेताक्", दिन में "सागुन तिकिन" और शाम को "सागुन आयुप"।
Johar is not just a greeting; it expresses deep respect for nature, elders, community harmony, and human dignity.`
  },
  {
    id: 'family_relations',
    group: 'trilingual',
    title: 'संताल परिवार, रिश्ते और आदर-सम्मान (घारोंज काथा)',
    category: 'परिवार व समाज',
    santaliTitle: 'Santal Family Relations & Respect',
    santaliDevanagariTitle: 'आयो-बाबा, दादा-दाई आर घारोंज दुलाड़',
    defaultLangMode: 'all',
    text: `आबो घारोंज रे आयो (माँ), बाबा (पिता), दादा (बड़े भाई), दाई (बड़ी बहन), बोको कोड़ा आर बोको कुड़ी जोतो मिसा काते को ताहेना।
मारांग होड़ कोवाक् काथा आंजोम आर मानोत दोहो दो संताल समाज रेयाक् जोतो खोन मारांग गुण काना।
A strong family teaches children kindness, honesty, mother tongue pride, and respect for elders from an early age.`
  },
  {
    id: 'village_morning',
    group: 'trilingual',
    title: 'अतु सेताक् — संताल गाँव की शांत प्रभात बेला',
    category: 'ग्रामीण जीवन',
    santaliTitle: 'Atu Setaq — Morning in a Santal Village',
    santaliDevanagariTitle: 'अतु सेताक् — सिम राक्, सिंगि राकाब आर चास',
    defaultLangMode: 'all',
    text: `सेताक् जोखोन सिम को राक्-आ आर सिंगि बुरु देया खोन राकाब हिजुक्-आ, उनरे अतु रेयाक् डाहार साफा आर शांत ताहेना।
आयो को दो रचा को जोक् साफाया आर कुञ खोन साफ दाक् को आगूया। किसान को दो डांगरा साँव खेत सेन को तैयार एना।
Morning in a Jharkhand village brings fresh air, birdsong, clean courtyards, and the rhythmic energy of rural life.`
  },
  {
    id: 'market_conversation',
    group: 'trilingual',
    title: 'हाट-बाज़ार संवाद (संताली + हिन्दी + English)',
    category: 'व्यावहारिक संवाद',
    santaliTitle: 'Weekly Haat & Market Dialogue',
    santaliDevanagariTitle: 'हाटिया रे किरिन-आखरिञ काथा',
    defaultLangMode: 'all',
    text: `जोहार गाते! तेहेञ हाटिया रे नोवा आड़ाक् आर जो रेयाक् दाम तिनाक् काना? इञ दो बार किलो चावले आर साफा दाल किरिन सानाञ काना।
बाज़ार में ताज़ी सब्ज़ियाँ, महुआ, साल के पत्ते और मिट्टी के बर्तन देखकर गाँव की आत्मनिर्भर अर्थव्यवस्था झलकती है।
Excuse me, how much is this fresh produce per kilogram? Please give me one kilogram of green vegetables.`
  },
  {
    id: 'school_student_pledge',
    group: 'trilingual',
    title: 'छात्र संकल्प व शिक्षा का महत्व (सेचेत् आर लाहा)',
    category: 'शिक्षा व प्रेरणा',
    santaliTitle: 'Student Pledge for Education & Growth',
    santaliDevanagariTitle: 'सेचेत् दो आबोवाक् जोतो खोन मारांग दाड़े काना',
    defaultLangMode: 'all',
    text: `सेचेत् आर ओल-पढ़ाव ते गे समाज लाहा सेन चालाक्-आ। दिनोम इस्कूल सेन आर मेहनत ते पढ़ाव दो जोतो गिदरा कोवाक् धर्म काना।
हम संकल्प लेते हैं कि अपनी मातृभाषा संताली, राष्ट्रभाषा हिन्दी और वैश्विक भाषा English तीनों को शुद्धता व आत्मविश्वास के साथ सीखेंगे।
Consistent daily reading builds sharp memory, strong vocabulary, and lifelong confidence for every student.`
  },

  // ═══ 2. इतिहास व महानायक (6 Docs) ═══
  {
    id: 'hul_manifesto',
    group: 'history',
    title: 'संथाल हूल १८५५ — सिद्धू-कान्हू हुंकार',
    category: 'इतिहास व स्वाधीनता',
    santaliTitle: 'Sidhu-Kanhu Hul 1855 Sandesh',
    santaliDevanagariTitle: 'सीदो-कान्हू हुल १८५५ संदेश (अबुआः दिशोम, अबुआः राज)',
    defaultLangMode: 'all',
    text: `जोहार! ३० जून १८५५ हिलोक भोगनाडीह अतु रे दस हजार खोन बाड़ती संताल वीर को सीदो-कान्हू मुर्मू वाक् अगुवाई ते अंग्रेजी हुकूमत आर महाजन को विरुद्ध हुल को घोषणा लेत्-आ।
सीदो-कान्हू दो किन मेन लेत्-आ: "नोवा ओत्-हासा दो आबो पूर्वज कोवाक् काना। दाक्, बिर-बुरु आर हासा रे आबो अतु-सभा वाक् हक मेनाक्-आ।"
चांद, भैरव, फूलो आर झानो दो दिशोम लागीत् आकोवाक् जीवोन को दान केत्-आ। आज भी प्रत्येक संथाल परिवार हूल दिवस पर अपने अमर नायकों को जोहार व नमन करता है।`
  },
  {
    id: 'phulo_jhano_bravery',
    group: 'history',
    title: 'वीरांगना फूलो-झानो मुर्मू की अमर गाथा',
    category: 'नारी शक्ति · इतिहास',
    santaliTitle: 'Phulo & Jhano Murmu Courage Chronicle',
    santaliDevanagariTitle: 'वीर कुड़ी फूलो आर झानो मुर्मू वाक् साहस',
    defaultLangMode: 'all',
    text: `१८५५ रेयाक् संताल हुल रे सीदो-कान्हू, चांद-भैरव साँव उंकु रेन मिसेरा फूलो आर झानो मुर्मू दो अदम्य साहस किन उदुक् लेत्-आ।
रात्रि के अंधकार में दोनों वीरांगनाओं ने अंग्रेजी शिविर में प्रवेश कर अन्याय के विरुद्ध अद्भुत वीरता दिखाई और हजारों महिलाओं को स्वाभिमान की प्रेरणा दी।
Phulo and Jhano Murmu remain eternal symbols of tribal women's leadership, bravery, and sacrifice in India's freedom struggle.`
  },
  {
    id: 'tilka_majhi_revolt',
    group: 'history',
    title: 'अमर शहीद बाबा तिलका मांझी (१७८४)',
    category: 'प्रथम विद्रोह · इतिहास',
    santaliTitle: 'Baba Tilka Majhi — Pioneer of 1784 Freedom Struggle',
    santaliDevanagariTitle: 'बाबा तिलका मांझी आर साखुवा साकाम संदेश',
    defaultLangMode: 'all',
    text: `बाबा तिलका मांझी (जबरा पहाड़िया) दो १७८४ इसवी रे ईस्ट इंडिया कंपनी विरुद्ध पहाड़िया आर संताल वीर को मिसा काते पाहिल स्वाधीनता संग्राम ए एहोब लेत्-आ।
उन्होंने साल के पत्ते (सारजोम साकाम) को संदेश का प्रतीक बनाकर गाँव-गाँव में एकता का आह्वान किया।
भागलपुर के तिलकामांझी चौक पर आज भी उनके बलिदान को श्रद्धा और गौरव के साथ स्मरण किया जाता है।`
  },
  {
    id: 'birsa_munda_ulgulan',
    group: 'history',
    title: 'धरती आबा भगवान बिरसा मुंडा और उलगुलान',
    category: 'झारखंड महानायक',
    santaliTitle: 'Bhagwan Birsa Munda & The Ulgulan Movement',
    santaliDevanagariTitle: 'धरती आबा बिरसा मुंडा आर अबुआ दिशोम अबुआ राज',
    defaultLangMode: 'all',
    text: `१५ नवंबर १८७५ को उलिहातू (खूंटी) में जन्मे भगवान बिरसा मुंडा ने "अबुआ दिशोम, अबुआ राज" का नारा देकर जल, जंगल और ज़मीन की रक्षा के लिए ऐतिहासिक उलगुलान किया।
उनके संघर्ष के परिणामस्वरूप १९०८ में छोटानागपुर काश्तकारी अधिनियम (CNT Act) बना, जिसने आदिवासी भूमि के अधिकारों को कानूनी सुरक्षा दी।
Every year on 15 November, India celebrates Janjatiya Gaurav Diwas in honour of Bhagwan Birsa Munda.`
  },
  {
    id: 'raghunath_murmu',
    group: 'history',
    title: 'गुरु गोमके पंडित रघुनाथ मुर्मू — ओल चिकी लिपि संदेश',
    category: 'भाषा व साहित्य',
    santaliTitle: 'Guru Gomke Raghunath Murmu Katha',
    santaliDevanagariTitle: 'गुरु गोमके रघुनाथ मुर्मू वाक् ओल चिकी संदेश',
    defaultLangMode: 'all',
    text: `गुरु गोमके पंडित रघुनाथ मुर्मू दो १९२५ इसवी रे संताली रोड़ लागीत् "ओल चिकी" लिपि ए बेनाव केत्-आ।
उनकुवाक् अमर काथा दो ताहेकाना:
"ओल चेमेद्, रोड़ चेमेद्,
आबो रोड़, आबो उपरुम, आबो गोरोब।"
अर्थात: अपनी लिपि सीखो, अपनी मातृभाषा बोलो; हमारी भाषा ही हमारी पहचान और गौरव है। प्रत्येक संताली को अपनी मातृभाषा (देवनागरी व ओल चिकी दोनों लिपियों) में पढ़ना व लिखना सीखना चाहिए।`
  },
  {
    id: 'jharkhand_foundation',
    group: 'history',
    title: 'झारखंड राज्य निर्माण व सांस्कृतिक पहचान (१५ नवंबर २०००)',
    category: 'झारखंड विरासत',
    santaliTitle: 'Formation & Heritage of Jharkhand State',
    santaliDevanagariTitle: 'झारखंड दिशोम — बिर-बुरु, झरना आर लोक-संस्कृति',
    defaultLangMode: 'all',
    text: `१५ नवंबर २००० को भगवान बिरसा मुंडा की जयंती के पावन अवसर पर झारखंड भारत का २८वाँ राज्य बना।
"झारखंड" का अर्थ है वनों की भूमि — जहाँ संथाल, मुंडा, उरांव, हो, खड़िया और अन्य सभी समुदाय मिल-जुलकर समृद्ध लोक-संस्कृति, संगीत और प्रकृति-प्रेम की परंपरा को जीवित रखते हैं।
Jharkhand is blessed with lush plateaus, waterfalls, rich mineral reserves, and vibrant multilingual literature.`
  },

  // ═══ 3. लोक-संस्कृति व पर्व (6 Docs) ═══
  {
    id: 'creation_folklore',
    group: 'culture',
    title: 'हास-हासिल व सृष्टि गाथा (सिरजोन काथा)',
    category: 'लोक-दर्शन व सृष्टि',
    santaliTitle: 'Has-Hasil Hans Ar Srijon Lore',
    santaliDevanagariTitle: 'हास-हासिल चेँड़े आर सिरजोन काथा',
    defaultLangMode: 'all',
    text: `सेदाय जोखोन चारी कोड़ रे खाली दाक् गे ताहेकाना। ठाकुर जिउ दो दाक् चेतान रे हास आर हासिल चेँड़े ए सिरजोन केत् किना।
चेँड़े किन दुड़ुप लागीत् जखन हासा बांय ञाम लेना, उनरे ठाकुर जिउ वाक् हुकुम ते होरो (कछुआ) देया रे लेंडोत (केंचुए) दो समुंदर भितरी खोन हासा ए आगू केत्-आ।
सारजोम दारे साकाम रे हास-हासिल किन बाले केत्-आ, ओना खोन पिलचु हाड़ाम आर पिलचु बूढ़ी किन जनम एना आर बारह पारिस रेयाक् उद्भव हुय एना।`
  },
  {
    id: 'sohrai_blessing',
    group: 'culture',
    title: 'सोहराय महापर्व: गोधन वंदना व लोक-आशीष',
    category: 'सांस्कृतिक पर्व',
    santaliTitle: 'Sohrai Parab Ar Gai Dan Guri',
    santaliDevanagariTitle: 'सोहराय पोरोब — गाय-डांगरा बोंगा आर अतु रस्का',
    defaultLangMode: 'all',
    text: `सोहराय दो संताल समाज रेयाक् जोतो खोन मारांग मोड़े माहा रेयाक् पोरोब काना, ओका दो होड़ो गेत् चाबा तायोम मानाक्-आ।
पाहिल हिलोक 'उम' (स्नान), दोसर हिलोक 'दाका-गोहाइल पूजा', तेसर हिलोक 'खूंटाव', पोन हिलोक 'जाले' आर मोड़े हिलोक 'हाकू-काटकोम' पोरोब हुयुक्-आ।
आयो को दो मांडी आर ओड़ाक् भित्ती रे सुंदर सोहराय चित्र को बेनावा। यह पर्व सिखाता है कि खेत में हल जोतने वाले पशु हमारे परिवार का अभिन्न अंग हैं।`
  },
  {
    id: 'baha_porob_spring',
    group: 'culture',
    title: 'बाहा पोरोब — सारजोम और मातकोम का वसंत उत्सव',
    category: 'प्रकृति पर्व · बाहा',
    santaliTitle: 'Baha Porob — Spring Blossom Festival',
    santaliDevanagariTitle: 'बाहा पोरोब — जाहेर थान बोंगा आर नावा साकाम',
    defaultLangMode: 'all',
    text: `फागुन चांदो रे जखन बिर-बुरु रे सारजोम (साल) आर मातकोम (महुआ) रे नावा बाहा फुटाक्-आ, उनरे संताल अतु रे बाहा पोरोब मानाक्-आ।
नायके बाबा जाहेर थान रे जाहेर आयो आर मरांग बुरु के सारजोम बाहा अर्पित करते हैं। बाहा पर्व में केवल शुद्ध जल से प्रेम और भाईचारे का उत्सव मनाया जाता है।
Baha Porob celebrates ecological harmony, fresh spring blossoms, and pure community joy without artificial colours.`
  },
  {
    id: 'karam_festival',
    group: 'culture',
    title: 'करम पर्व: प्रकृति संरक्षण व भाई-बहन का प्रेम',
    category: 'लोक-पर्व · करम',
    santaliTitle: 'Karam Festival — Trees, Harvest & Sibling Bond',
    santaliDevanagariTitle: 'करम पोरोब — जावा, अखड़ा एनेच् आर काहनी',
    defaultLangMode: 'all',
    text: `भादो चांदो रेयाक् एकादशी हिलोक करम पोरोब मानाक्-आ। अखड़ा रे करम दारे रेयाक् डाल रोहोय काते बहनों द्वारा जावा की पूजा और भाइयों की लंबी आयु की कामना की जाती है।
रात भर अखड़ा में मांदर की थाप पर करम गीत और नृत्य होता है, और सुबह करम डाल को सम्मानपूर्वक नदी या तालाब में प्रवाहित किया जाता है।
यह पर्व हमें सिखाता है कि वृक्षों और कृषि की रक्षा करना ही सच्चा धर्म है।`
  },
  {
    id: 'manjhi_pargana_system',
    group: 'culture',
    title: 'मांझी परगना स्वशासन व्यवस्था व ग्राम लोकतंत्र',
    category: 'पारंपरिक शासन',
    santaliTitle: 'Manjhi Pargana Traditional Self-Governance',
    santaliDevanagariTitle: 'मांझी हाड़ाम, जोग-मांझी, नायके आर परगनैत व्यवस्था',
    defaultLangMode: 'all',
    text: `संताल समाज रेयाक् पारंपरिक स्वशासन व्यवस्था दो "मांझी परगना शासन व्यवस्था" मेन्ते बाडायोक्-आ।
प्रत्येक गाँव में मांझी हाड़ाम प्रमुख होते हैं, जिनकी सहायता पारानिक, जोग-मांझी, गोडैत और धार्मिक कार्यों में नायके बाबा करते हैं।
अनेक गाँवों के समूह (बंगला/देश) के स्तर पर परगनैत न्याय और सामाजिक समरसता सुनिश्चित करते हैं। यह विश्व की प्राचीनतम लोकतांत्रिक ग्राम-सभा प्रणालियों में से एक है।`
  },
  {
    id: 'akhra_dance_music',
    group: 'culture',
    title: 'अखड़ा, मांदर-धामसा और संताली लोक-संगीत',
    category: 'नृत्य व वाद्ययंत्र',
    santaliTitle: 'Akhra, Tumdak (Mandar), Tamak & Santali Music',
    santaliDevanagariTitle: 'तुमदाक्, टामाक्, तिरियो आर बानाम सेरेञ',
    defaultLangMode: 'all',
    text: `संताल अतु रेयाक् अखड़ा दो केवल नाच-गान रेयाक् जागा बाङ काना, बोरों एकता आर संस्कृति रेयाक् केंद्र काना।
तुमदाक् (मांदर), टामाक् (धामसा), तिरियो (बाँसुरी), बानाम आर करताल रेयाक् मधुर ताल रे लांगड़े, दोन, सोहराय आर बाहा एनेच् हुयुक्-आ।
Santali folk music unites rhythm, poetry, seasonal gratitude, and collective community celebration.`
  },

  // ═══ 4. संताली व्याकरण व साहित्य (6 Docs) ═══
  {
    id: 'santali_grammar_overview',
    group: 'grammar',
    title: 'संताली पारसी आर रोनौड़ (व्याकरण परिचय)',
    category: 'संताली व्याकरण',
    santaliTitle: 'Santali Parsi & Ronor (Grammar Introduction)',
    santaliDevanagariTitle: 'पारसी, रोनौड़, सादे आर गोटांग नियम',
    defaultLangMode: 'all',
    text: `ओका माध्यम ते आबोन आबोवाक् मोने रेयाक् भाब आर विचार एटाक् होड़ साँव बोन साझाया, ओना गे "पारसी" (भाषा) मेताक्-आ।
पारसी के शुद्ध रूप से बोलने, पढ़ने और लिखने के नियमों के शास्त्र को संताली में "रोनौड़" (व्याकरण) कहा जाता है।
संताली वाक्य की मूल संरचना कर्ता + कर्म + क्रिया (SOV) होती है, जैसे: "इञ पुथीञ पढ़ाव-एत्-आ" — मैं पुस्तक पढ़ रहा हूँ।`
  },
  {
    id: 'animacy_and_numbers',
    group: 'grammar',
    title: 'जीवेद-बिनाजीवेद (सजीव-निर्जीव) और तीन वचन',
    category: 'व्याकरण · वचन व संज्ञा',
    santaliTitle: 'Animacy & Three Numbers (Singular, Dual, Plural)',
    santaliDevanagariTitle: 'मित्-गोटांग, बार-गोटांग (-किन) आर सांगे-गोटांग (-को)',
    defaultLangMode: 'all',
    text: `संताली व्याकरण की सबसे अनोखी विशेषता यह है कि इसमें संज्ञाओं का वर्गीकरण मुख्यतः जीवेद (सजीव) और बिनाजीवेद (निर्जीव) के आधार पर होता है।
संताली में तीन वचन (गोटांग) होते हैं: एकवचन (होड़), द्विवचन (होड़किन — दो व्यक्ति), और बहुवचन (होड़को — अनेक व्यक्ति)।
Unlike Hindi and English which have only two numbers, Santali preserves a distinct Dual Number using the suffix "-kin".`
  },
  {
    id: 'santali_proverbs_menkatha',
    group: 'grammar',
    title: 'संताली मेनेकाथा (लोकोक्तियाँ) व जीवन-दर्शन',
    category: 'साहित्य · लोकोक्तियाँ',
    santaliTitle: 'Santali Proverbs (Menkatha) & Folk Wisdom',
    santaliDevanagariTitle: 'मेनेकाथा — सेदाय होड़ कोवाक् गहिर ज्ञान',
    defaultLangMode: 'all',
    text: `संताली लोक-साहित्य में मेनेकाथा (कहावतें) पूर्वजों के गहन अनुभव और नैतिक शिक्षा को संक्षिप्त शब्दों में प्रकट करती हैं।
जैसे: "मित् ती ते दो तापाय बाङ साडेक्-आ" — अर्थात एक हाथ से ताली नहीं बजती, सफलता के लिए आपसी सहयोग आवश्यक है।
"ओत्-हासा आर पारसी बांचाव दोहोय पे" — अपनी भूमि और मातृभाषा की रक्षा करना ही सच्चा स्वाभिमान है।`
  },
  {
    id: 'santali_riddles_kudum',
    group: 'grammar',
    title: 'संताली कुदुम (पहेलियाँ) — बुद्धि व लोक-ज्ञान',
    category: 'साहित्य · कुदुम',
    santaliTitle: 'Traditional Santali Riddles (Kudum)',
    santaliDevanagariTitle: 'कुदुम-कुदुम — रास्का आर बुद्धि रेयाक् खेल',
    defaultLangMode: 'all',
    text: `शाम के समय गाँव के आँगन में बच्चे और बुज़ुर्ग मिलकर संताली कुदुम (पहेलियाँ) पूछते हैं, जिससे कल्पनाशक्ति और भाषा-ज्ञान दोनों तेज़ होते हैं।
पहेली एक: "सेताक् दो पोन काटा, तिकिन दो बार काटा, आयुप दो पे काटा — चेत् काना?" उत्तर: मानवा (मनुष्य का बचपन, जवानी और बुढ़ापा)।
पहेली दो: "मित् बिर रे लाखो बाती जुलुक् काना — चेत् काना?" उत्तर: इपिल (आकाश के तारे)।`
  },
  {
    id: 'santali_roman_practice',
    group: 'grammar',
    title: 'Santali Roman Pronunciation Guide (रोमन संताली अभ्यास)',
    category: 'Santali Roman · उच्चारण',
    santaliTitle: 'Santali Roman Reading & Phonetic Practice',
    santaliDevanagariTitle: 'रोमन संताली वाक्य वाचन अभ्यास',
    defaultLangMode: 'santali_roman',
    text: `Johar! Abon joto hor Santali parsi bon parhaw-a ar bon ol-a.
Abo ror, abo uprum, abo gorob. Tehen din do adi napay kana.
Orak' re ayo baba menaq kina. Gidra ko iskul chalak' kana.
Bir buru, dak' ar hasa do abo jiwon reyaq mul adhar kana.`
  },
  {
    id: 'ol_chiki_unicode_guide',
    group: 'grammar',
    title: 'ओल चिकी लिपि (ᱚᱞ ᱪᱤᱠᱤ) और 8वीं अनुसूची का गौरव',
    category: 'लिपि व संवैधानिक दर्जा',
    santaliTitle: 'Ol Chiki Unicode & 8th Schedule Recognition',
    santaliDevanagariTitle: 'संताली ओल चिकी लिपि — ३० अक्षर आर वैज्ञानिक बनावट',
    defaultLangMode: 'all',
    text: `ओल चिकी लिपि में कुल ३० वैज्ञानिक अक्षर होते हैं — ६ स्वर और २४ व्यंजन, जिन्हें प्रकृति की आकृतियों से प्रेरित होकर बनाया गया है।
वर्ष २००३ में ९२वें संविधान संशोधन अधिनियम द्वारा संताली भाषा को भारत के संविधान की आठवीं अनुसूची में स्थान मिला।
आज Unicode समर्थन के कारण ओल चिकी और संताली देवनागरी दोनों लिपियों में डिजिटल पुस्तकें, समाचार और शिक्षा सामग्री तेजी से बढ़ रही हैं।`
  },

  // ═══ 5. English Reading & Spoken Mastery (6 Docs) ═══
  {
    id: 'english_heritage',
    group: 'english',
    title: 'Santali Heritage & Ol Chiki Script (English Reader)',
    category: 'English Reading · Heritage',
    santaliTitle: 'English Passage — Santali Language & Jharkhand',
    santaliDevanagariTitle: 'संताली विरासत और ओल चिकी लिपि (अंग्रेज़ी पाठ)',
    defaultLangMode: 'english',
    text: `Johar and welcome to the Santal आ़रसी English and Multilingual Text Reader.
Santali is one of the richest Austroasiatic languages spoken widely across Jharkhand, West Bengal, Odisha, Bihar, Assam, Bangladesh, and Nepal.
In 1925, Guru Gomke Pandit Raghunath Murmu invented the Ol Chiki script to preserve the authentic sounds and cultural identity of the Santal people.
Later, through the 92nd Constitutional Amendment Act of 2003, Santali was officially included in the Eighth Schedule of the Constitution of India.
You can paste any English textbook chapter, news article, or competitive exam passage here and listen to clear word-by-word pronunciation at your preferred speed.`
  },
  {
    id: 'english_constitution',
    group: 'english',
    title: 'Indian Constitution & PESA Act 1996 (English Study)',
    category: 'English Reading · Exam Prep',
    santaliTitle: 'English Competitive Study Passage (UPSC / JPSC)',
    santaliDevanagariTitle: 'भारतीय संविधान व पेसा अधिनियम (अंग्रेज़ी अभ्यास)',
    defaultLangMode: 'english',
    text: `The Constitution of India guarantees equality, liberty, and justice to every citizen through Fundamental Rights in Part Three.
Under the Fifth Schedule, special constitutional safeguards protect the land, forests, and self-governance of Scheduled Areas in states like Jharkhand.
The Panchayats Extension to Scheduled Areas Act of 1996, popularly known as PESA, empowers the Gram Sabha to manage community resources, minor forest produce, and traditional dispute resolution.
Regular reading and listening practice in English helps students build vocabulary, improve comprehension, and score higher in UPSC, SSC, Banking, JPSC, and JSSC examinations.`
  },
  {
    id: 'english_daily_conversation',
    group: 'english',
    title: 'Daily Spoken English for Students & Office',
    category: 'English Speaking Practice',
    santaliTitle: 'Everyday Clear English Conversation Sentences',
    santaliDevanagariTitle: 'दैनिक अंग्रेज़ी बोलचाल व उच्चारण अभ्यास',
    defaultLangMode: 'english',
    text: `Good morning everyone! How are you doing today? I am ready to learn something new and productive.
Could you please repeat that sentence slowly so I can understand every word clearly?
Thank you very much for your kind guidance. I truly appreciate your time and support.
Practicing ten minutes of clear English listening and speaking every morning builds natural fluency and confidence.`
  },
  {
    id: 'english_forest_ecology',
    group: 'english',
    title: 'Sacred Groves (Jaher Than) & Forest Conservation',
    category: 'English · Environment',
    santaliTitle: 'Ecological Wisdom of Jaher Than Sacred Groves',
    santaliDevanagariTitle: 'जाहेर थान और पर्यावरण संरक्षण (अंग्रेज़ी पाठ)',
    defaultLangMode: 'english',
    text: `Across Santal villages, the sacred grove known as Jaher Than stands as a living model of community-led biodiversity conservation.
Ancient Sal and Mahua trees inside the grove are protected for generations, providing shelter to birds, pollinators, and medicinal plants.
Modern climate scientists recognize that indigenous forest stewardship plays a vital role in storing carbon, protecting watersheds, and sustaining rural livelihoods.`
  },
  {
    id: 'english_digital_literacy',
    group: 'english',
    title: 'Digital Literacy, Cyber Safety & Smart Learning',
    category: 'English · Technology',
    santaliTitle: 'Safe & Smart Use of Digital Learning Tools',
    santaliDevanagariTitle: 'डिजिटल साक्षरता और साइबर सुरक्षा (अंग्रेज़ी पाठ)',
    defaultLangMode: 'english',
    text: `Digital literacy empowers rural and urban students alike to access dictionaries, grammar lessons, mock exams, and libraries right from their mobile phones.
While using online platforms, always protect your personal passwords, avoid suspicious links, and never share one-time passwords with strangers.
When technology is paired with discipline and curiosity, every learner can achieve excellence from any village or town.`
  },
  {
    id: 'english_interview_confidence',
    group: 'english',
    title: 'Job Interview & Public Speaking Confidence',
    category: 'English · Career Skills',
    santaliTitle: 'Self-Introduction & Interview Speaking Tips',
    santaliDevanagariTitle: 'इंटरव्यू परिचय व आत्मविश्वास अभ्यास',
    defaultLangMode: 'english',
    text: `Good morning, Sir and Madam. Thank you for giving me this wonderful opportunity to introduce myself.
I am a dedicated learner from Jharkhand with strong communication skills in Santali, Hindi, and English.
My strengths include teamwork, punctuality, problem-solving, and a sincere commitment to community service.
I look forward to contributing positively and growing continuously in this organisation.`
  },

  // ═══ 6. परीक्षा तैयारी व समसामयिकी — UPSC / JPSC / JSSC / SSC (6 Docs) ═══
  {
    id: 'cnt_spt_act_brief',
    group: 'exams',
    title: 'छोटानागपुर (CNT 1908) व संथाल परगना काश्तकारी (SPT 1949) अधिनियम',
    category: 'JPSC · JSSC स्पेशल',
    santaliTitle: 'CNT Act 1908 & SPT Act 1949 Revision Summary',
    santaliDevanagariTitle: 'झारखंड भूमि सुरक्षा कानून — मुख्य बिंदु',
    defaultLangMode: 'all',
    text: `छोटानागपुर काश्तकारी अधिनियम (CNT Act) ११ नवंबर १९०८ को लागू हुआ, जिसमें कुल १९ अध्याय और २७१ धाराएँ हैं। इसकी धारा ४६ आदिवासी भूमि के हस्तांतरण पर सख़्त सुरक्षा प्रदान करती है।
संथाल परगना काश्तकारी अधिनियम (SPT Act) १९४९ में लागू हुआ, जो दुमका, देवघर, गोड्डा, साहिबगंज, पाकुड़ और जामताड़ा जिलों में रैयती भूमि की गैर-हस्तांतरणीयता (धारा २०) की रक्षा करता है।
JPSC और JSSC परीक्षाओं में इन दोनों अधिनियमों की प्रमुख धाराएँ, भूमि प्रकार और ग्राम प्रधान (मांझी) के अधिकारों से नियमित प्रश्न पूछे जाते हैं।`
  },
  {
    id: 'indian_polity_fundamentals',
    group: 'exams',
    title: 'भारतीय संविधान: मौलिक अधिकार, नीति-निर्देशक तत्व व अनुसूचियाँ',
    category: 'UPSC · SSC · JPSC',
    santaliTitle: 'Indian Polity Key Constitutional Articles',
    santaliDevanagariTitle: 'संविधान भाग ३, भाग ४ और प्रमुख अनुच्छेद',
    defaultLangMode: 'all',
    text: `भारतीय संविधान २६ नवंबर १९४९ को अंगीकृत और २६ जनवरी १९५० को लागू हुआ।
भाग ३ (अनुच्छेद १२ से ३५) में छह मौलिक अधिकार हैं: समानता का अधिकार, स्वतंत्रता का अधिकार, शोषण के विरुद्ध अधिकार, धार्मिक स्वतंत्रता, संस्कृति एवं शिक्षा संबंधी अधिकार और संवैधानिक उपचारों का अधिकार (अनुच्छेद ३२)।
पाँचवीं अनुसूची अनुसूचित क्षेत्रों के प्रशासन से संबंधित है, जबकि आठवीं अनुसूची में संताली सहित २२ मान्यता प्राप्त भाषाएँ शामिल हैं।`
  },
  {
    id: 'jharkhand_geography_rivers',
    group: 'exams',
    title: 'झारखंड का भूगोल: प्रमुख नदियाँ, जलप्रपात व खनिज संपदा',
    category: 'JPSC · झारखंड भूगोल',
    santaliTitle: 'Geography of Jharkhand — Rivers, Plateaus & Minerals',
    santaliDevanagariTitle: 'दामोदर, सुवर्णरेखा, पारसनाथ और हुंडरू जलप्रपात',
    defaultLangMode: 'all',
    text: `झारखंड छोटानागपुर पठार और संथाल परगना क्षेत्र में फैला है। इसकी सर्वोच्च चोटी पारसनाथ (सम्मेद शिखर, १३६५ मीटर) गिरिडीह जिले में स्थित है।
दामोदर झारखंड की सबसे लंबी नदी है, जबकि सुवर्णरेखा नदी स्वतंत्र रूप से बंगाल की खाड़ी में गिरती है और हुंडरू जलप्रपात का निर्माण करती है।
कोयला, लौह अयस्क, अभ्रक, तांबा और यूरेनियम (जादूगोड़ा) के समृद्ध भंडार के कारण झारखंड को भारत का "रूर प्रदेश" कहा जाता है।`
  },
  {
    id: 'science_environment_notes',
    group: 'exams',
    title: 'सामान्य विज्ञान, जलवायु परिवर्तन व नवीकरणीय ऊर्जा',
    category: 'सामान्य विज्ञान · Exam',
    santaliTitle: 'General Science & Renewable Energy Revision',
    santaliDevanagariTitle: 'प्रकाश संश्लेषण, सौर ऊर्जा और पर्यावरण संतुलन',
    defaultLangMode: 'all',
    text: `पौधे सूर्य के प्रकाश, जल और कार्बन डाइऑक्साइड की सहायता से प्रकाश संश्लेषण (Photosynthesis) द्वारा भोजन बनाते हैं और ऑक्सीजन मुक्त करते हैं।
जलवायु परिवर्तन को रोकने के लिए सौर ऊर्जा, पवन ऊर्जा और जल विद्युत जैसे स्वच्छ नवीकरणीय स्रोतों का उपयोग तेज़ी से बढ़ रहा है।
Sustainable development ensures that economic progress and environmental protection move forward hand in hand.`
  },
  {
    id: 'rural_health_nutrition',
    group: 'exams',
    title: 'ग्रामीण स्वास्थ्य, पोषण व स्वच्छ जल जागरूकता',
    category: 'स्वास्थ्य व समाज',
    santaliTitle: 'Community Health, Nutrition & Clean Water',
    santaliDevanagariTitle: 'साफा दाक्, पोषण आर सुस्त जीवोन',
    defaultLangMode: 'all',
    text: `सुस्त होड़मो लागीत् साफा दाक् ञू, ताजा आड़ाक्-साकाम जोम आर ओड़ाक्-रचा साफा दोहो दो आ़डी जरूरी काना।
संतुलित आहार में दाल, हरी सब्ज़ियाँ, मौसमी फल, रागी (मड़ुआ) और पर्याप्त स्वच्छ जल शामिल करने से एनीमिया व कुपोषण से बचाव होता है।
Clean drinking water, hand hygiene, timely vaccination, and balanced nutrition build a healthy and prosperous community.`
  },
  {
    id: 'effective_exam_strategy',
    group: 'exams',
    title: 'JPSC / JSSC / UPSC परीक्षा की स्मार्ट रणनीति व समय प्रबंधन',
    category: 'परीक्षा रणनीति',
    santaliTitle: 'Smart Revision & Zero-Stress Exam Strategy',
    santaliDevanagariTitle: 'प्रतियोगी परीक्षा में सफलता के सुनहरे सूत्र',
    defaultLangMode: 'all',
    text: `किसी भी प्रतियोगी परीक्षा में सफलता के लिए तीन स्तंभ सबसे महत्वपूर्ण हैं: सीमित प्रामाणिक स्रोत, नियमित पुनरावृत्ति (Revision), और ईमानदार मॉक टेस्ट अभ्यास।
प्रतिदिन ३० नए प्रश्नों का अभ्यास करें, गलत उत्तरों की व्याख्या ध्यान से पढ़ें और ऑडियो रीडर से महत्वपूर्ण तथ्यों को सुनकर दोहराएँ।
Small disciplined daily steps compound into extraordinary success in UPSC, JPSC, JSSC, SSC, and Banking examinations.`
  }
];
