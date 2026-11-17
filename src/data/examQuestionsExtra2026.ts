import { CompetitiveQuestion } from './examQuestionsIndia2026';

export const EXTRA_COMPETITIVE_QUESTIONS_2026: CompetitiveQuestion[] = [
  // ================= PYQ 2023 EXTRA =================
  {
    id: 'ext_23_01',
    examIds: ['nda_cds', 'upsc_cse', 'cuet_neet_gate'],
    paperSlot: 'pyq_2023',
    subject: 'quantitative_aptitude',
    examTag: 'NDA / CDS / GATE · 2023 Pattern',
    question: 'यदि sin θ + cos θ = √2 हो (जहाँ 0° < θ < 90°), तो tan θ + cot θ का मान क्या होगा?',
    options: ['1', '2', '√2', '4'],
    correctIndex: 1,
    explanation: 'दोनों पक्षों का वर्ग करने पर sin²θ + cos²θ + 2sinθcosθ = 2 ⇒ 1 + 2sinθcosθ = 2 ⇒ sinθcosθ = 1/2। अब tanθ + cotθ = 1/(sinθcosθ) = 2।'
  },
  {
    id: 'ext_23_02',
    examIds: ['ibps_sbi_po', 'ssc_cgl', 'rrb_ntpc_alp'],
    paperSlot: 'pyq_2023',
    subject: 'economy_banking',
    examTag: 'IBPS PO / SBI · 2023 Pattern',
    question: 'बैंकिंग परिभाषा में "NPA" (Non-Performing Asset) उस ऋण खाते को कहा जाता है जिसका मूलधन या ब्याज कितने दिनों से अधिक अवधि के लिए बकाया (Overdue) रहता है?',
    options: ['30 दिन', '60 दिन', '90 दिन', '180 दिन'],
    correctIndex: 2,
    explanation: 'RBI दिशानिर्देशों के अनुसार, यदि किसी टर्म लोन की किस्त या ब्याज 90 दिनों से अधिक समय तक बकाया रहता है, तो वह संपत्ति NPA श्रेणी में आ जाती है।'
  },
  {
    id: 'ext_23_03',
    examIds: ['rrb_ntpc_alp', 'ssc_gd', 'jssc_excise_police'],
    paperSlot: 'pyq_2023',
    subject: 'general_science_tech',
    examTag: 'RRB ALP / SSC GD · 2023 Pattern',
    question: 'रेलवे पटरियों के दो खंडों के बीच थोड़ा खाली स्थान (Expansion Gap) क्यों छोड़ा जाता है?',
    options: [
      'पहियों की गति कम करने के लिए',
      'गर्मियों में तापीय प्रसार (Thermal Expansion) के कारण पटरियों को टेढ़ा होने (Buckling) से बचाने के लिए',
      'वर्षा जल निकासी के लिए',
      'सिग्नल करंट रोकने के लिए'
    ],
    correctIndex: 1,
    explanation: 'धातु गर्म होने पर फैलती है; अतः रेखीय तापीय प्रसार को समायोजित करने के लिए पटरियों के जोड़ों पर गैप रखा जाता है।'
  },
  {
    id: 'ext_23_04',
    examIds: ['jhc_assistant', 'jssc_ldc_panchayat', 'ssc_chsl_mts'],
    paperSlot: 'pyq_2023',
    subject: 'english_hindi',
    examTag: 'JHC / SSC CHSL · 2023 Pattern',
    question: 'Identify the part with a grammatical error: "Neither the clerk nor the assistants (A) / was present (B) / in the registry room yesterday (C). / No error (D)"',
    options: ['Part (A)', 'Part (B) — should be "were present"', 'Part (C)', 'Part (D)'],
    correctIndex: 1,
    explanation: '"Neither...nor" से जुड़े दो कर्ताओं में क्रिया (Verb) निकटतम कर्ता ("the assistants" - बहुवचन) के अनुसार होती है, अतः "was" के स्थान पर "were present" होगा।'
  },
  {
    id: 'ext_23_05',
    examIds: ['jtet', 'ctet', 'jssc_pgt_tgt'],
    paperSlot: 'pyq_2023',
    subject: 'teaching_pedagogy',
    examTag: 'JTET / CTET · 2023 Pattern',
    question: 'ब्लूम की टैक्सोनॉमी (Bloom’s Taxonomy) के संशोधित संज्ञानात्मक क्षेत्र (Revised Cognitive Domain) में उच्चतम स्तर का कौशल कौन-सा है?',
    options: ['याद रखना (Remembering)', 'लागू करना (Applying)', 'विश्लेषण (Analyzing)', 'सृजन करना (Creating)'],
    correctIndex: 3,
    explanation: 'एंडरसन व क्रैथवोह्ल (2001) के संशोधित ब्लूम वर्गीकरण का क्रम: Remember → Understand → Apply → Analyze → Evaluate → Create (उच्चतम)।'
  },

  // ================= PYQ 2024 EXTRA =================
  {
    id: 'ext_24_01',
    examIds: ['nda_cds', 'upsc_cse', 'cuet_neet_gate'],
    paperSlot: 'pyq_2024',
    subject: 'geography_environment',
    examTag: 'NDA / CDS / UPSC · 2024 Pattern',
    question: 'निम्नलिखित में से कौन-सी जलसंधि (Strait) भारत और श्रीलंका को अलग करती है तथा मन्नार की खाड़ी को पाक खाड़ी से जोड़ती है?',
    options: ['मलाक्का जलसंधि', 'पाक जलडमरूमध्य (Palk Strait)', 'होर्मुज जलसंधि', 'बेयरिंग जलसंधि'],
    correctIndex: 1,
    explanation: 'पाक जलसंधि (Palk Strait) तमिलनाडु (भारत) और जाफना जिला (श्रीलंका) के बीच स्थित है।'
  },
  {
    id: 'ext_24_02',
    examIds: ['ibps_sbi_po', 'ssc_cgl', 'jssc_ldc_panchayat'],
    paperSlot: 'pyq_2024',
    subject: 'quantitative_aptitude',
    examTag: 'IBPS Clerk / SSC · 2024 Pattern',
    question: 'किसी कक्षा में 40 छात्रों का औसत वजन 45 किग्रा है। यदि शिक्षक का वजन भी शामिल कर लिया जाए, तो औसत 46 किग्रा हो जाता है। शिक्षक का वजन कितने किग्रा है?',
    options: ['82 किग्रा', '86 किग्रा', '85 किग्रा', '90 किग्रा'],
    correctIndex: 1,
    explanation: '40 छात्रों का कुल वजन = 40 × 45 = 1800 किग्रा। 41 व्यक्तियों का कुल वजन = 41 × 46 = 1886 किग्रा। शिक्षक का वजन = 1886 - 1800 = 86 किग्रा।'
  },
  {
    id: 'ext_24_03',
    examIds: ['rrb_ntpc_alp', 'ssc_gd', 'jssc_excise_police'],
    paperSlot: 'pyq_2024',
    subject: 'reasoning_logic',
    examTag: 'RRB NTPC / SSC GD · 2024 Pattern',
    question: 'एक पंक्ति में राम बाएँ से 14वें स्थान पर और श्याम दाएँ से 18वें स्थान पर है। यदि उनके बीच में ठीक 5 छात्र बैठे हैं (न्यूनतम अतिव्यापन बिना), तो पंक्ति में कुल कितने छात्र हैं?',
    options: ['35', '37', '36', '38'],
    correctIndex: 1,
    explanation: 'सामान्य (गैर-अतिव्याप्त) स्थिति में कुल छात्र = बायाँ स्थान + दायाँ स्थान + बीच के छात्र = 14 + 18 + 5 = 37।'
  },
  {
    id: 'ext_24_04',
    examIds: ['jhc_assistant', 'jssc_municipal_tech', 'cuet_neet_gate'],
    paperSlot: 'pyq_2024',
    subject: 'polity_constitution',
    examTag: 'JHC / UPSC / SSC · 2024 Pattern',
    question: 'भारतीय संविधान का कौन-सा अनुच्छेद उच्च न्यायालयों को मौलिक अधिकारों एवं अन्य विधिक अधिकारों के प्रवर्तन के लिए "रिट" (Writ) जारी करने की शक्ति देता है?',
    options: ['अनुच्छेद 32', 'अनुच्छेद 226', 'अनुच्छेद 136', 'अनुच्छेद 214'],
    correctIndex: 1,
    explanation: 'अनुच्छेद 32 के तहत सर्वोच्च न्यायालय और अनुच्छेद 226 के तहत प्रत्येक उच्च न्यायालय बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण व अधिकार-पृच्छा रिट जारी कर सकते हैं।'
  },
  {
    id: 'ext_24_05',
    examIds: ['jssc_pgt_tgt', 'jtet', 'ugc_net'],
    paperSlot: 'pyq_2024',
    subject: 'santali_language',
    examTag: 'UGC-NET / JSSC PGT · 2024 Pattern',
    question: 'केंद्रीय साहित्य अकादमी पुरस्कार से सम्मानित प्रसिद्ध संताली रचनाकार "बाड़हा सोरेन", "कालीचरण हेम्ब्रम" और "रूपचांद हांसदा" ने संताली साहित्य की किस विधा को समृद्ध किया?',
    santaliNote: 'आधुनिक संताली कविता, नाटक एवं कथा साहित्य',
    options: [
      'केवल संस्कृत व्याकरण अनुवाद',
      'आधुनिक संताली नाटक, काव्य एवं लघु-कथा साहित्य',
      'ज्योतिष पंचांग लेखन',
      'केवल अंग्रेजी पत्रकारिता'
    ],
    correctIndex: 1,
    explanation: 'इन सभी साहित्यकारों को उनकी मौलिक संताली नाटक, काव्य व कहानी संग्रह कृतियों (जैसे रूपचांद हांसदा को "गुड़ दाक् कासा दाक्", कालीचरण हेम्ब्रम को "शिशिरजली") के लिए साहित्य अकादमी मिला।'
  },

  // ================= PYQ 2025 EXTRA =================
  {
    id: 'ext_25_01',
    examIds: ['nda_cds', 'rrb_ntpc_alp', 'cuet_neet_gate'],
    paperSlot: 'pyq_2025',
    subject: 'general_science_tech',
    examTag: 'NDA / GATE / RRB · 2025 Pattern',
    question: 'सौर ऊर्जा को सीधे विद्युत ऊर्जा में परिवर्तित करने वाले "फोटोवोल्टाइक सेल" (Solar Cell) मुख्यतः किस अर्धचालक पदार्थ से बनाए जाते हैं?',
    options: ['ताँबा (Copper)', 'सिलिकॉन (Silicon)', 'पारा (Mercury)', 'मैग्नीशियम'],
    correctIndex: 1,
    explanation: 'सोलर सेल मुख्यतः उच्च शुद्धता वाले मोनोक्रिस्टलाइन या पॉलीक्रिस्टलाइन सिलिकॉन (Si) अर्धचालक जंक्शन (p-n junction) से निर्मित होते हैं।'
  },
  {
    id: 'ext_25_02',
    examIds: ['ibps_sbi_po', 'jssc_ldc_panchayat', 'jhc_assistant'],
    paperSlot: 'pyq_2025',
    subject: 'computer_it',
    examTag: 'IBPS / JHC Skill Test · 2025 Pattern',
    question: 'MS Word या LibreOffice Writer में किसी दस्तावेज़ में "Find and Replace" संवाद बॉक्स खोलने के लिए मानक कीबोर्ड शॉर्टकट क्या है?',
    options: ['Ctrl + F', 'Ctrl + H', 'Ctrl + R', 'Ctrl + G'],
    correctIndex: 1,
    explanation: 'Ctrl + F केवल Find के लिए और Ctrl + H सीधे "Find and Replace" डायलॉग खोलने के लिए प्रयुक्त होता है।'
  },
  {
    id: 'ext_25_03',
    examIds: ['ssc_gd', 'jssc_excise_police', 'rrb_ntpc_alp'],
    paperSlot: 'pyq_2025',
    subject: 'history_culture',
    examTag: 'SSC GD / Police · 2025 Pattern',
    question: 'भारत का राष्ट्रीय चिह्न "अशोक स्तंभ" (चार सिंहों वाली आकृति) उत्तर प्रदेश के किस ऐतिहासिक स्थान से लिया गया है?',
    options: ['साँची', 'सारनाथ', 'बोधगया', 'कुशीनगर'],
    correctIndex: 1,
    explanation: '26 जनवरी 1950 को भारत सरकार ने वाराणसी के समीप सारनाथ स्थित अशोक के सिंह स्तंभ शीर्ष को राष्ट्रीय प्रतीक के रूप में अपनाया।'
  },
  {
    id: 'ext_25_04',
    examIds: ['jharkhand_anm_cho', 'cuet_neet_gate', 'jpsc_cdpo_fro'],
    paperSlot: 'pyq_2025',
    subject: 'general_science_tech',
    examTag: 'NEET / CHO / CDPO · 2025 Pattern',
    question: 'मानव हृदय में कौन-सा प्राकृतिक भाग "पेसमेकर" (Natural Pacemaker) कहलाता है जो हृदय की धड़कन की विद्युत तरंग प्रारंभ करता है?',
    options: ['AV नोड', 'SA नोड (Sinoatrial Node)', 'पुर्किंजे तंतु', 'महाधमनी वाल्व'],
    correctIndex: 1,
    explanation: 'दाएँ अलिंद (Right Atrium) की ऊपरी भित्ति में स्थित SA Node (साइनोएट्रियल नोड) स्वतः विद्युत आवेग उत्पन्न कर हृदय गति नियंत्रित करता है।'
  },
  {
    id: 'ext_25_05',
    examIds: ['jssc_pgt_tgt', 'ugc_net', 'jtet'],
    paperSlot: 'pyq_2025',
    subject: 'santali_language',
    examTag: 'JSSC PGT / UGC-NET · 2025 Pattern',
    question: 'संताली भाषा के प्रथम ज्ञानपीठ/पद्मश्री या साहित्यिक योगदानकर्ता के रूप में भारत सरकार द्वारा 2022 में पद्मश्री से किसे सम्मानित किया गया (संताली साहित्य/शिक्षा)?',
    options: ['डॉ. दमयंती बेसरा / गुरु चरण मुर्मू परंपरा', 'कालिदास', 'रामधारी सिंह दिनकर', 'फणीश्वरनाथ रेणु'],
    correctIndex: 0,
    explanation: 'ओडिशा/झारखंड क्षेत्र में संताली भाषा, शिक्षा व संस्कृति के संरक्षण में उल्लेखनीय योगदान के लिए प्रमुख संताली विदुषियों व लेखकों (जैसे दमयंती बेसरा व अन्य विद्वानों) को राष्ट्रीय सम्मान प्राप्त हुए हैं।'
  },

  // ================= PRACTICE SET 1 EXTRA =================
  {
    id: 'ext_p1_01',
    examIds: ['nda_cds', 'cuet_neet_gate', 'ssc_cgl'],
    paperSlot: 'practice_set_1',
    subject: 'quantitative_aptitude',
    examTag: '2026 Practice Set 1 · Geometry',
    question: 'एक समबाहु त्रिभुज (Equilateral Triangle) की प्रत्येक भुजा 12 सेमी है। इस त्रिभुज का क्षेत्रफल कितना वर्ग सेमी होगा?',
    options: ['24√3 वर्ग सेमी', '36√3 वर्ग सेमी', '48√3 वर्ग सेमी', '18√3 वर्ग सेमी'],
    correctIndex: 1,
    explanation: 'समबाहु त्रिभुज का क्षेत्रफल = (√3 / 4) × भुजा² = (√3 / 4) × 144 = 36√3 वर्ग सेमी।'
  },
  {
    id: 'ext_p1_02',
    examIds: ['ibps_sbi_po', 'jssc_ldc_panchayat', 'jhc_assistant'],
    paperSlot: 'practice_set_1',
    subject: 'economy_banking',
    examTag: '2026 Practice Set 1 · Finance',
    question: 'भारत में डिजिटल भुगतान व वित्तीय समावेशन के लिए आरंभ की गई "PM जन धन योजना" (PMJDY) की टैगलाइन क्या रही है?',
    options: ['मेरा खाता — भाग्य विधाता', 'सबका बैंक एक साथ', 'डिजिटल भारत कैशलेस', 'जन-जन का ऋण'],
    correctIndex: 0,
    explanation: '28 अगस्त 2014 को शुरू की गई प्रधानमंत्री जन धन योजना का आधिकारिक सूत्रवाक्य "मेरा खाता — भाग्य विधाता" है।'
  },
  {
    id: 'ext_p1_03',
    examIds: ['jssc_excise_police', 'ssc_gd', 'rrb_ntpc_alp'],
    paperSlot: 'practice_set_1',
    subject: 'polity_constitution',
    examTag: '2026 Practice Set 1 · Civics',
    question: 'भारतीय संविधान के किस भाग में "मौलिक कर्तव्यों" (Fundamental Duties — अनुच्छेद 51A) का उल्लेख किया गया है?',
    options: ['भाग III', 'भाग IV', 'भाग IV-क (Part IV-A)', 'भाग V'],
    correctIndex: 2,
    explanation: 'सरदार स्वर्ण सिंह समिति की सिफारिश पर 42वें संशोधन (1976) द्वारा संविधान में भाग IV-क और अनुच्छेद 51A जोड़कर मौलिक कर्तव्य शामिल किए गए।'
  },
  {
    id: 'ext_p1_04',
    examIds: ['jssc_municipal_tech', 'cuet_neet_gate', 'rrb_ntpc_alp'],
    paperSlot: 'practice_set_1',
    subject: 'general_science_tech',
    examTag: '2026 Practice Set 1 · Technical',
    question: 'विद्युत शक्ति (Electrical Power) की SI इकाई क्या है और 1 हॉर्सपावर (1 HP) लगभग कितने वॉट के बराबर होता है?',
    options: ['जूल · 500 W', 'वॉट (Watt) · 746 W', 'एम्पियर · 1000 W', 'ओम · 736 W'],
    correctIndex: 1,
    explanation: 'विद्युत शक्ति की SI इकाई वॉट (Joule/sec) है तथा मानक यांत्रिक हॉर्सपावर (1 HP) = 746 वॉट होता है।'
  },

  // ================= PRACTICE SET 2 EXTRA =================
  {
    id: 'ext_p2_01',
    examIds: ['nda_cds', 'cuet_neet_gate', 'ssc_cgl'],
    paperSlot: 'practice_set_2',
    subject: 'quantitative_aptitude',
    examTag: '2026 Practice Set 2 · Mensuration',
    question: 'एक लंबवृत्तीय बेलन (Right Circular Cylinder) की त्रिज्या 7 सेमी और ऊँचाई 10 सेमी है। इसका आयतन (π = 22/7 लेते हुए) कितना घन सेमी होगा?',
    options: ['1,440 घन सेमी', '1,540 घन सेमी', '1,640 घन सेमी', '1,320 घन सेमी'],
    correctIndex: 1,
    explanation: 'बेलन का आयतन = πr²h = (22/7) × 7 × 7 × 10 = 22 × 70 = 1,540 घन सेमी।'
  },
  {
    id: 'ext_p2_02',
    examIds: ['ibps_sbi_po', 'jssc_ldc_panchayat', 'jhc_assistant'],
    paperSlot: 'practice_set_2',
    subject: 'computer_it',
    examTag: '2026 Practice Set 2 · Networking',
    question: 'इंटरनेट पर किसी डोमेन नाम (जैसे jpsc.gov.in) को उसके वास्तविक IP एड्रेस में बदलने वाली प्रणाली को क्या कहते हैं?',
    options: ['DHCP', 'DNS (Domain Name System)', 'FTP', 'SMTP'],
    correctIndex: 1,
    explanation: 'DNS (Domain Name System) मानव-पठनीय डोमेन नामों को कंप्यूटर-पठनीय IP पतों (IPv4/IPv6) में अनुवादित करता है।'
  },
  {
    id: 'ext_p2_03',
    examIds: ['jssc_excise_police', 'ssc_gd', 'rrb_ntpc_alp'],
    paperSlot: 'practice_set_2',
    subject: 'reasoning_logic',
    examTag: '2026 Practice Set 2 · Analogy',
    question: 'सादृश्यता पूर्ण कीजिए — राँची : झारखंड :: भुवनेश्वर : ?',
    options: ['छत्तीसगढ़', 'ओडिशा', 'बिहार', 'असम'],
    correctIndex: 1,
    explanation: 'जिस प्रकार राँची झारखंड की राजधानी है, उसी प्रकार भुवनेश्वर ओडिशा की राजधानी है।'
  },
  {
    id: 'ext_p2_04',
    examIds: ['jssc_municipal_tech', 'cuet_neet_gate', 'jharkhand_anm_cho'],
    paperSlot: 'practice_set_2',
    subject: 'general_science_tech',
    examTag: '2026 Practice Set 2 · Science',
    question: 'जल की स्थायी कठोरता (Permanent Hardness) मुख्यतः किन लवणों की उपस्थिति के कारण होती है?',
    options: [
      'सोडियम क्लोराइड',
      'कैल्शियम और मैग्नीशियम के सल्फेट व क्लोराइड लवण',
      'केवल कैल्शियम बाइकार्बोनेट',
      'पोटैशियम नाइट्रेट'
    ],
    correctIndex: 1,
    explanation: 'जल में कैल्शियम व मैग्नीशियम के क्लोराइड और सल्फेट घुलने पर स्थायी कठोरता होती है (जबकि बाइकार्बोनेट से अस्थायी कठोरता होती है)।'
  }
];
