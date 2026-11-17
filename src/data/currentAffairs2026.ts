export type CurrentAffairRegion = 'india' | 'jharkhand';
export type CurrentAffairCategory = 'governance' | 'economy_schemes' | 'science_awards' | 'culture_heritage';

export interface CurrentAffairItem {
  id: string;
  dateLabel: string;
  region: CurrentAffairRegion;
  category: CurrentAffairCategory;
  examRelevance: string;
  titleHindi: string;
  titleEnglish: string;
  summaryHindi: string;
  summaryEnglish: string;
  santaliRoman: string;
  keyFacts: string[];
}

export interface CurrentAffairQuizItem {
  id: string;
  region: CurrentAffairRegion;
  examTag: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const CURRENT_AFFAIRS_2026: CurrentAffairItem[] = [
  {
    id: 'ca_jh_01',
    dateLabel: '2026 · झारखंड विशेष',
    region: 'jharkhand',
    category: 'culture_heritage',
    examRelevance: 'JPSC Prelims / JSSC CGL / JTET',
    titleHindi: 'संताली भाषा व ओल चिकी लिपि डिजिटलीकरण एवं प्राथमिक शिक्षा विस्तार',
    titleEnglish: 'Expansion of Santali Language & Ol Chiki Digitization in Jharkhand Schools',
    summaryHindi: 'झारखंड और ओडिशा के जनजातीय बहुल जिलों में मातृभाषा आधारित बहुभाषी शिक्षा (MLE) के तहत संताली भाषा, ओल चिकी व देवनागरी पाठ्यपुस्तकों तथा डिजिटल शिक्षण सामग्री का विस्तार किया जा रहा है।',
    summaryEnglish: 'Multilingual Education (MLE) programs in tribal districts of Jharkhand and Odisha continue expanding primary textbooks and digital learning materials in Santali (Ol Chiki and Devanagari).',
    santaliRoman: 'Jharkhand ar Odisha re Santali parsi ar Ol Chiki olok parhao lagit iskul ko re nawa digital kitub ar MLE sikha pasnaw idik kana.',
    keyFacts: [
      'संताली को भारतीय संविधान की 8वीं अनुसूची में 92वें संविधान संशोधन (2003) से मान्यता प्राप्त है।',
      'NEP 2020 के अंतर्गत कक्षा 1 से 5 तक मातृभाषा में अध्ययन को प्राथमिकता दी गई है।',
      'ओल चिकी लिपि का आविष्कार पंडित रघुनाथ मुर्मू ने वर्ष 1925 में किया था।'
    ]
  },
  {
    id: 'ca_in_01',
    dateLabel: '2026 · भारत राष्ट्रीय',
    region: 'india',
    category: 'economy_schemes',
    examRelevance: 'UPSC / SSC CGL / Banking / Railway',
    titleHindi: 'धरती आबा जनजातीय ग्राम उत्कर्ष अभियान (DAJGUA) का राष्ट्रव्यापी क्रियान्वयन',
    titleEnglish: 'Nationwide Implementation of Dharti Aaba Janjatiya Gram Utkarsh Abhiyan',
    summaryHindi: 'जनजातीय कार्य मंत्रालय द्वारा देश भर के 63,000 से अधिक आदिवासी बहुल गाँवों में सड़क, जल, स्वास्थ्य, शिक्षा और डिजिटल कनेक्टिविटी की संतृप्ति के लिए 17 मंत्रालयों का समन्वित अभियान चलाया जा रहा है।',
    summaryEnglish: 'Coordinated by the Ministry of Tribal Affairs across 17 ministries, DAJGUA targets saturation of roads, water, healthcare, education, and telecom across over 63,000 tribal-majority villages.',
    santaliRoman: 'Dharti Aaba Janjatiya Gram Utkarsh Abhiyan te desh ren 63,000 khon barhti ato re hor, dak, haspatal ar iskul bhalai kami calak kana.',
    keyFacts: [
      'भगवान बिरसा मुंडा के सम्मान में "धरती आबा" नाम से यह अभियान प्रारंभ किया गया।',
      'इसमें प्रधानमंत्री आवास, हर घर जल, आश्रम विद्यालय और मोबाइल मेडिकल यूनिट शामिल हैं।',
      'झारखंड के संताल परगना और कोल्हान क्षेत्रों के हजारों गाँव इसमें शामिल हैं।'
    ]
  },
  {
    id: 'ca_jh_02',
    dateLabel: '2026 · झारखंड प्रशासन',
    region: 'jharkhand',
    category: 'governance',
    examRelevance: 'JPSC / JSSC / Police / High Court',
    titleHindi: 'झारखंड में PESA नियमावली एवं पारंपरिक ग्राम सभा सशक्तीकरण चर्चा',
    titleEnglish: 'PESA Rules & Traditional Gram Sabha Empowerment in Scheduled Areas of Jharkhand',
    summaryHindi: 'झारखंड की पाँचवीं अनुसूची के जिलों में ग्राम सभा (मांझी-मुंडा-मानकी पारंपरिक स्वशासन) को लघु वनोपज, स्थानीय जल स्रोतों और सामुदायिक संसाधनों के प्रबंधन का कानूनी अधिकार PESA अधिनियम 1996 के तहत प्राप्त है।',
    summaryEnglish: 'Under the PESA Act 1996, traditional Gram Sabhas across Fifth Schedule districts of Jharkhand hold statutory authority over minor forest produce, local water bodies, and community resources.',
    santaliRoman: 'PESA ain 1996 leka te Jharkhand ren scheduled jila ko re Gram Sabha ar Majhi Pargana samaj do bir, dak ar ato sompoti re adhikar ko nam aka-a.',
    keyFacts: [
      'PESA अधिनियम (Panchayats Extension to Scheduled Areas) वर्ष 1996 में भूरिया समिति की सिफारिश पर बना।',
      'झारखंड के कुल 24 में से 13 जिले पूर्णतः और 3 जिले आंशिक रूप से 5वीं अनुसूची में आते हैं।',
      'संथाल परगना में SPT एक्ट 1949 (विशेषकर धारा 20) आदिवासी भूमि की रक्षा करता है।'
    ]
  },
  {
    id: 'ca_in_02',
    dateLabel: '2026 · विज्ञान व अंतरिक्ष',
    region: 'india',
    category: 'science_awards',
    examRelevance: 'UPSC / SSC / NDA-CDS / RRB NTPC',
    titleHindi: 'ISRO का गगनयान मानव अंतरिक्ष मिशन व भारतीय अंतरिक्ष स्टेशन लक्ष्य',
    titleEnglish: 'ISRO Gaganyaan Human Spaceflight Milestones & Bharatiya Antariksh Station Roadmap',
    summaryHindi: 'भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) मानवयुक्त गगनयान मिशन से पूर्व मानवरहित परीक्षण उड़ानों (TV-D व Vyommitra) तथा वर्ष 2035 तक भारतीय अंतरिक्ष स्टेशन स्थापित करने के चरणों पर कार्य कर रहा है।',
    summaryEnglish: 'ISRO is advancing uncrewed Gaganyaan flight tests (including Vyommitra humanoid missions) ahead of crewed low-Earth orbit flight and the 2035 Bharatiya Antariksh Station roadmap.',
    santaliRoman: 'ISRO do Gaganyaan serma gadi mission ar 2035 re Bharatiya Antariksh Station benaw lagit nawa bijyan bikau re mena-a.',
    keyFacts: [
      'ISRO का मुख्यालय बेंगलुरु में है; स्थापना 15 अगस्त 1969 को हुई थी।',
      'LVM3 (Launch Vehicle Mark-3) मानव-रेटेड प्रक्षेपण यान का उपयोग गगनयान में होगा।',
      'चंद्रयान-3 के लैंडिंग स्थल का नाम "शिव शक्ति पॉइंट" रखा गया है।'
    ]
  },
  {
    id: 'ca_jh_03',
    dateLabel: '2026 · झारखंड संस्कृति',
    region: 'jharkhand',
    category: 'culture_heritage',
    examRelevance: 'JPSC / JSSC / JTET / Jharkhand GK',
    titleHindi: 'सोहराय व खोवर भित्तिचित्र कला तथा GI टैग हस्तशिल्प संरक्षण',
    titleEnglish: 'Conservation of GI-Tagged Sohrai-Khovar Mural Art & Dokra Craft in Jharkhand',
    summaryHindi: 'हजारीबाग व संताल परगना की विश्वप्रसिद्ध सोहराय-खोवर चित्रकला (GI टैग प्राप्त) तथा कमार-मल्हार समुदाय की धोकरा धातु-शिल्प कला को आदिवासी संग्रहालय, ग्रामीण पर्यटन और हस्तशिल्प मेलों से जोड़ा जा रहा है।',
    summaryEnglish: 'GI-tagged Sohrai and Khovar wall paintings alongside lost-wax Dokra metal craft are being integrated into rural heritage circuits and artisan cooperatives across Jharkhand.',
    santaliRoman: 'Jharkhand re Sohrai ar Khovar chitra ar Dhokra pital silp do GI Tag te bishwo re upurum nam aka-a.',
    keyFacts: [
      'सोहराय-खोवर पेंटिंग को वर्ष 2020 में भौगोलिक संकेतक (GI Tag) प्राप्त हुआ था।',
      'सोहराय पर्व कार्तिक अमावस्या के आसपास पशु-धन और फसल की वंदना हेतु मनाया जाता है।',
      'प्राकृतिक मिट्टी (चरका हासा, आराक् हासा, हेंदे हासा) और कांगई तकनीक से यह चित्र बनते हैं।'
    ]
  },
  {
    id: 'ca_in_03',
    dateLabel: '2026 · संविधान व शासन',
    region: 'india',
    category: 'governance',
    examRelevance: 'UPSC / State PSC / SSC / Judiciary',
    titleHindi: 'नारी शक्ति वंदन अधिनियम व 16वाँ वित्त आयोग परामर्श प्रक्रिया',
    titleEnglish: '106th Constitutional Amendment & 16th Finance Commission Recommendations Framework',
    summaryHindi: '106वें संविधान संशोधन (नारी शक्ति वंदन अधिनियम) द्वारा लोकसभा व राज्य विधानसभाओं में महिलाओं के लिए 33% आरक्षण का प्रावधान है, वहीं डॉ. अरविंद पनगढ़िया की अध्यक्षता में 16वाँ वित्त आयोग केंद्र-राज्य कर बँटवारे की रूपरेखा तय कर रहा है।',
    summaryEnglish: 'The 106th Amendment reserves 33% seats for women in Lok Sabha and state assemblies, while the 16th Finance Commission chaired by Dr. Arvind Panagariya reviews Union-State fiscal devolution.',
    santaliRoman: 'Bharat re 106-am sambidhan badol te Lok Sabha ar Bidhan Sabha re aimai ko lagit 33% adhikar em akana.',
    keyFacts: [
      '106वाँ संविधान संशोधन अधिनियम 2023 में पारित हुआ (संविधान में अनुच्छेद 330A व 332A जुड़े)।',
      '16वाँ वित्त आयोग की सिफारिशें 1 अप्रैल 2026 से 31 मार्च 2031 की अवधि के लिए लागू होंगी।',
      'भारतीय संविधान के अनुच्छेद 280 के तहत वित्त आयोग का गठन राष्ट्रपति करते हैं।'
    ]
  },
  {
    id: 'ca_jh_04',
    dateLabel: '2026 · झारखंड विकास',
    region: 'jharkhand',
    category: 'economy_schemes',
    examRelevance: 'JPSC / JSSC CGL / JTET / Banking',
    titleHindi: 'झारखंड में वनोपज प्रसंस्करण (लाख, तसर कोसा, महुआ) व आजीविका मिशन',
    titleEnglish: 'Minor Forest Produce Value Addition (Lac, Tasar Silk, Mahua) via JSLPS',
    summaryHindi: 'झारखंड राज्य आजीविका संवर्धन सोसाइटी (JSLPS) की सखी मंडलों के माध्यम से संताल परगना, चाईबासा व राँची क्षेत्र में तसर कोसा रेशम, लाह (लाख) और वनोपज संग्रहण को बाजार व MSP से जोड़ा जा रहा है।',
    summaryEnglish: 'Women Self-Help Groups under JSLPS are scaling value addition and MSP procurement for Tasar silk cocoons, lac, mahua, and sal seeds across Santhal Pargana and Kolhan.',
    santaliRoman: 'JSLPS sakhi mandal dare te Jharkhand ren ato aimai ko Tasar lugum, lah ar bir jinis ko bazar re benaw ar akhring kana.',
    keyFacts: [
      'देश के कुल लाह (Lac) और तसर रेशम उत्पादन में झारखंड अग्रणी राज्यों में शामिल है।',
      'चाईबासा व दुमका क्षेत्रों में असन और अर्जुन वृक्षों पर तसर कीट पालन प्रमुख आजीविका है।',
      'VAN DHAN विकास केंद्रों के तहत जनजातीय संग्राहकों को प्रसंस्करण प्रशिक्षण मिलता है।'
    ]
  },
  {
    id: 'ca_in_04',
    dateLabel: '2026 · शिक्षा व तकनीक',
    region: 'india',
    category: 'science_awards',
    examRelevance: 'UPSC / SSC / Banking / UGC-NET / CTET',
    titleHindi: 'DIKSHA व Bhashini AI द्वारा भारतीय क्षेत्रीय भाषाओं में डिजिटल शिक्षा',
    titleEnglish: 'Multilingual Digital Education & Voice Accessibility via DIKSHA and Bhashini',
    summaryHindi: 'भारत सरकार के इलेक्ट्रॉनिक्स एवं सूचना प्रौद्योगिकी मंत्रालय तथा शिक्षा मंत्रालय की पहलों से संविधान की 8वीं अनुसूची की 22 भाषाओं (संताली सहित) के डिजिटल अनुवाद, उच्चारण व शैक्षणिक सामग्री का विस्तार हो रहा है।',
    summaryEnglish: 'Public digital platforms like DIKSHA and Bhashini are expanding voice, translation, and learning tools across all 22 Eighth Schedule languages including Santali.',
    santaliRoman: 'DIKSHA ar Bhashini lekan digital platform re 8-am anusuci ren 22 bhasa (Santali sahit) te olok parhao subidha jutuk kana.',
    keyFacts: [
      'अनुसूची-8 में कुल 22 भाषाएँ हैं (मूल संविधान में 14 थीं)।',
      'संताली, मैथिली, डोगरी और बोडो को वर्ष 2003 में जोड़ा गया था।',
      'राष्ट्रीय शिक्षा नीति (NEP 2020) के. कस्तूरीरंगन समिति की अनुशंसा पर आधारित है।'
    ]
  }
];

export const CURRENT_AFFAIRS_QUIZ_2026: CurrentAffairQuizItem[] = [
  {
    id: 'caq_01',
    region: 'india',
    examTag: 'UPSC / SSC',
    question: 'संविधान के किस अनुच्छेद के अंतर्गत भारत के राष्ट्रपति द्वारा 16वें वित्त आयोग का गठन किया गया है?',
    options: ['अनुच्छेद 266', 'अनुच्छेद 280', 'अनुच्छेद 324', 'अनुच्छेद 356'],
    correctIndex: 1,
    explanation: 'भारतीय संविधान के अनुच्छेद 280 के तहत प्रत्येक 5 वर्ष (या आवश्यकतानुसार) राष्ट्रपति द्वारा वित्त आयोग का गठन किया जाता है।'
  },
  {
    id: 'caq_02',
    region: 'jharkhand',
    examTag: 'JPSC / JSSC',
    question: 'झारखंड में पारंपरिक ग्राम सभाओं को लघु वनोपज और जल स्रोतों पर अधिकार देने वाला PESA अधिनियम किस वर्ष पारित हुआ था?',
    options: ['1992', '1996', '2000', '2006'],
    correctIndex: 1,
    explanation: 'PESA (Panchayats Extension to Scheduled Areas) अधिनियम वर्ष 1996 में पारित किया गया था।'
  },
  {
    id: 'caq_03',
    region: 'india',
    examTag: 'SSC / Banking',
    question: 'जनजातीय बहुल गाँवों के समग्र विकास हेतु शुरू "धरती आबा जनजातीय ग्राम उत्कर्ष अभियान" किसके नाम पर समर्पित है?',
    options: ['सिदो मुर्मू', 'भगवान बिरसा मुंडा', 'तिलका मांझी', 'अलूरी सीताराम राजू'],
    correctIndex: 1,
    explanation: 'भगवान बिरसा मुंडा को सम्मानपूर्वक "धरती आबा" (धरती के पिता) कहा जाता है; उन्हीं के नाम पर यह राष्ट्रीय अभियान है।'
  },
  {
    id: 'caq_04',
    region: 'jharkhand',
    examTag: 'JSSC / JTET',
    question: 'झारखंड की सोहराय और खोवर भित्तिचित्र कला को किस वर्ष भौगोलिक संकेतक (GI Tag) प्राप्त हुआ?',
    options: ['2016', '2018', '2020', '2023'],
    correctIndex: 2,
    explanation: 'झारखंड की पारंपरिक सोहराय और खोवर पेंटिंग को मई 2020 में GI टैग प्रदान किया गया।'
  },
  {
    id: 'caq_05',
    region: 'india',
    examTag: 'UPSC / CDS',
    question: '106वाँ संविधान संशोधन अधिनियम (नारी शक्ति वंदन अधिनियम) किस विषय से संबंधित है?',
    options: [
      'जीएसटी कर प्रणाली',
      'लोकसभा व विधानसभाओं में महिलाओं को 33% आरक्षण',
      'सहकारी समितियों का गठन',
      'आर्थिक रूप से कमजोर वर्ग आरक्षण'
    ],
    correctIndex: 1,
    explanation: '106वाँ संविधान संशोधन अधिनियम लोकसभा, राज्य विधानसभाओं और दिल्ली विधानसभा में महिलाओं के लिए एक-तिहाई (33%) सीटें आरक्षित करता है।'
  },
  {
    id: 'caq_06',
    region: 'jharkhand',
    examTag: 'JPSC / JSSC',
    question: 'संताली भाषा किस संविधान संशोधन द्वारा भारत की 8वीं अनुसूची की 22 भाषाओं में सम्मिलित हुई?',
    options: ['71वाँ संशोधन', '86वाँ संशोधन', '92वाँ संशोधन (2003)', '97वाँ संशोधन'],
    correctIndex: 2,
    explanation: '92वें संविधान संशोधन अधिनियम (2003) द्वारा संताली, मैथिली, डोगरी और बोडो को 8वीं अनुसूची में जोड़ा गया।'
  },
  {
    id: 'caq_07',
    region: 'india',
    examTag: 'RRB / NDA',
    question: 'ISRO के मानवयुक्त गगनयान मिशन से पहले भेजे जाने वाले महिला ह्यूमनॉइड रोबोट का क्या नाम है?',
    options: ['मित्र-1', 'व्योममित्र (Vyommitra)', 'आदित्य', 'गगन-एआई'],
    correctIndex: 1,
    explanation: 'ISRO गगनयान की मानवरहित परीक्षण उड़ानों में "व्योममित्र" नामक अर्ध-मानवीय रोबोट को अंतरिक्ष में भेज रहा है।'
  },
  {
    id: 'caq_08',
    region: 'jharkhand',
    examTag: 'JPSC Mains / Prelims',
    question: 'संथाल परगना काश्तकारी (SPT) अधिनियम 1949 की कौन-सी धारा आदिवासी रैयती भूमि के हस्तांतरण को रोकती है?',
    options: ['धारा 14', 'धारा 20', 'धारा 35', 'धारा 53'],
    correctIndex: 1,
    explanation: 'SPT अधिनियम 1949 की धारा 20 रैयती भूमि की बिक्री या गैर-कानूनी हस्तांतरण पर पूर्ण प्रतिबंध लगाती है।'
  },
  {
    id: 'caq_09',
    region: 'india',
    examTag: 'UGC-NET / CTET',
    question: 'राष्ट्रीय शिक्षा नीति (NEP 2020) किस समिति की रिपोर्ट पर आधारित है?',
    options: ['कोठारी आयोग', 'के. कस्तूरीरंगन समिति', 'यशपाल समिति', 'मुदालियर आयोग'],
    correctIndex: 1,
    explanation: 'NEP 2020 का मसौदा डॉ. के. कस्तूरीरंगन की अध्यक्षता वाली समिति द्वारा तैयार किया गया था।'
  },
  {
    id: 'caq_10',
    region: 'jharkhand',
    examTag: 'JSSC CGL',
    question: 'झारखंड राज्य में कुल कितने जिले पाँचवीं अनुसूची (Scheduled Areas) के अंतर्गत आते हैं?',
    options: ['13 पूर्ण + 3 आंशिक जिले', 'केवल 5 जिले', 'सभी 24 जिले', '10 जिले'],
    correctIndex: 0,
    explanation: 'झारखंड में 13 जिले पूर्णतः और 3 जिले आंशिक रूप से संविधान की पाँचवीं अनुसूची के अधिसूचित क्षेत्र हैं।'
  }
];
