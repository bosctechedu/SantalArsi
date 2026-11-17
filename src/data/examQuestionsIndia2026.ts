export type ExamPaperSlot = 'pyq_2023' | 'pyq_2024' | 'pyq_2025' | 'practice_set_1' | 'practice_set_2';

export type ExamDomainSubject =
  | 'polity_constitution'
  | 'history_culture'
  | 'geography_environment'
  | 'economy_banking'
  | 'general_science_tech'
  | 'quantitative_aptitude'
  | 'reasoning_logic'
  | 'english_hindi'
  | 'computer_it'
  | 'teaching_pedagogy'
  | 'jharkhand_special'
  | 'santali_language';

export interface CompetitiveQuestion {
  id: string;
  examIds: string[];
  paperSlot: ExamPaperSlot;
  subject: ExamDomainSubject;
  examTag: string;
  question: string;
  santaliNote?: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export const INDIA_COMPETITIVE_QUESTIONS: CompetitiveQuestion[] = [
  // ==========================================================
  // PYQ 2023 PATTERN QUESTIONS (ALL-INDIA EXAMS)
  // ==========================================================
  {
    id: 'ind_23_01',
    examIds: ['upsc_cse', 'ssc_cgl', 'nda_cds', 'cuet_neet_gate'],
    paperSlot: 'pyq_2023',
    subject: 'polity_constitution',
    examTag: 'UPSC CSE / SSC CGL · 2023 Pattern',
    question: 'भारतीय संविधान में "विधि द्वारा स्थापित प्रक्रिया" (Procedure Established by Law) और "सम्यक् विधिक प्रक्रिया" (Due Process of Law) के संदर्भ में सर्वोच्च न्यायालय ने किस ऐतिहासिक वाद में अनुच्छेद 21 के दायरे को विस्तृत कर दोनों का समन्वय किया?',
    options: ['ए. के. गोपालन बनाम मद्रास राज्य (1950)', 'मेनका गांधी बनाम भारत संघ (1978)', 'गोलकनाथ बनाम पंजाब राज्य (1967)', 'मिनर्वा मिल्स वाद (1980)'],
    correctIndex: 1,
    explanation: '1978 के मेनका गांधी बनाम भारत संघ वाद में उच्चतम न्यायालय ने अनुच्छेद 21 की व्याख्या करते हुए कहा कि कोई भी कानून न्यायसंगत, निष्पक्ष और तर्कसंगत (Due Process) होना चाहिए।'
  },
  {
    id: 'ind_23_02',
    examIds: ['upsc_cse', 'ssc_cgl', 'ssc_chsl_mts', 'rrb_ntpc_alp'],
    paperSlot: 'pyq_2023',
    subject: 'history_culture',
    examTag: 'UPSC / SSC CGL · 2023 Pattern',
    question: 'सिंधु घाटी सभ्यता का वह कौन-सा पुरास्थल है जहाँ से "जुते हुए खेत" (Ploughed Field) और एक साथ दो फसलें उगाने के प्राचीनतम प्रमाण मिले हैं?',
    options: ['लोथल (गुजरात)', 'कालीबंगा (राजस्थान)', 'धौलावीरा (गुजरात)', 'राखीगढ़ी (हरियाणा)'],
    correctIndex: 1,
    explanation: 'राजस्थान के हनुमानगढ़ जिले में घग्गर नदी के किनारे स्थित कालीबंगा से प्राक्-हड़प्पा स्तर के जुते हुए खेत के साक्ष्य मिले हैं।'
  },
  {
    id: 'ind_23_03',
    examIds: ['upsc_cse', 'nda_cds', 'ssc_cgl'],
    paperSlot: 'pyq_2023',
    subject: 'geography_environment',
    examTag: 'UPSC / NDA · 2023 Pattern',
    question: 'भारत में निम्नलिखित में से कौन-सी नदी "भ्रंश घाटी" (Rift Valley) से होकर बहती है और डेल्टा के स्थान पर ज्वारनदमुख (Estuary) बनाती है?',
    options: ['महानदी', 'गोदावरी', 'नर्मदा', 'कावेरी'],
    correctIndex: 2,
    explanation: 'नर्मदा और तापी नदियाँ विंध्य व सतपुड़ा पर्वत श्रेणियों के बीच भ्रंश घाटी से पश्चिम दिशा की ओर प्रवाहित होती हैं और अरब सागर में एश्चुअरी बनाती हैं।'
  },
  {
    id: 'ind_23_04',
    examIds: ['ibps_sbi_po', 'upsc_cse', 'ssc_cgl'],
    paperSlot: 'pyq_2023',
    subject: 'economy_banking',
    examTag: 'IBPS PO / UPSC · 2023 Pattern',
    question: 'भारतीय रिज़र्व बैंक (RBI) द्वारा वाणिज्यिक बैंकों को अल्पकालिक आवश्यकताओं के लिए जिस ब्याज दर पर ऋण दिया जाता है, उसे क्या कहा जाता है?',
    options: ['रिवर्स रेपो दर (Reverse Repo Rate)', 'रेपो दर (Repo Rate)', 'नकद आरक्षित अनुपात (CRR)', 'वैधानिक तरलता अनुपात (SLR)'],
    correctIndex: 1,
    explanation: 'रेपो दर वह दर है जिस पर RBI सरकारी प्रतिभूतियों के बदले वाणिज्यिक बैंकों को अल्पकालिक तरलता (ऋण) प्रदान करता है।'
  },
  {
    id: 'ind_23_05',
    examIds: ['rrb_ntpc_alp', 'ssc_cgl', 'ssc_gd', 'cuet_neet_gate'],
    paperSlot: 'pyq_2023',
    subject: 'general_science_tech',
    examTag: 'RRB ALP / SSC · 2023 Pattern',
    question: 'मानव शरीर में रक्त का थक्का (Blood Clotting) जमाने में निम्नलिखित में से कौन-सा विटामिन और प्रोटीन मुख्य भूमिका निभाते हैं?',
    options: ['विटामिन A और एल्ब्यूमिन', 'विटामिन K और फाइब्रिनोजेन', 'विटामिन C और हीमोग्लोबिन', 'विटामिन D और केराटिन'],
    correctIndex: 1,
    explanation: 'विटामिन K यकृत में प्रोथ्रॉम्बिन के संश्लेषण के लिए आवश्यक है, और फाइब्रिनोजेन प्रोटीन थक्का बनाने वाले तंतु (फाइब्रिन) का निर्माण करता है।'
  },
  {
    id: 'ind_23_06',
    examIds: ['ssc_cgl', 'ssc_chsl_mts', 'rrb_ntpc_alp', 'ibps_sbi_po'],
    paperSlot: 'pyq_2023',
    subject: 'quantitative_aptitude',
    examTag: 'SSC CGL / RRB NTPC · 2023 Pattern',
    question: 'यदि कोई रेलगाड़ी 72 किमी/घंटा की गति से चलते हुए एक बिजली के खंभे को 15 सेकंड में पार करती है, तो रेलगाड़ी की लंबाई कितने मीटर है?',
    options: ['250 मीटर', '300 मीटर', '360 मीटर', '275 मीटर'],
    correctIndex: 1,
    explanation: 'गति = 72 × (5/18) = 20 मीटर/सेकंड। रेलगाड़ी की लंबाई = गति × समय = 20 × 15 = 300 मीटर।'
  },
  {
    id: 'ind_23_07',
    examIds: ['ssc_cgl', 'ssc_gd', 'ibps_sbi_po', 'ugc_net'],
    paperSlot: 'pyq_2023',
    subject: 'reasoning_logic',
    examTag: 'SSC / IBPS / UGC-NET · 2023 Pattern',
    question: 'संख्या श्रेणी में अगला पद ज्ञात कीजिए: 7, 15, 31, 63, 127, ?',
    options: ['253', '255', '256', '249'],
    correctIndex: 1,
    explanation: 'प्रत्येक पद पिछले पद के दोगुने से 1 अधिक है (×2 + 1): 127 × 2 + 1 = 254 + 1 = 255।'
  },
  {
    id: 'ind_23_08',
    examIds: ['ssc_cgl', 'ssc_chsl_mts', 'ibps_sbi_po', 'ugc_net'],
    paperSlot: 'pyq_2023',
    subject: 'computer_it',
    examTag: 'SSC CGL Tier-II / IBPS · 2023 Pattern',
    question: 'कंप्यूटर नेटवर्किंग में OSI मॉडल की किस परत (Layer) पर "राउटर" (Router) कार्य करता है और IP एड्रेसिंग संभालता है?',
    options: ['डेटा लिंक लेयर (Layer 2)', 'नेटवर्क लेयर (Layer 3)', 'ट्रांसपोर्ट लेयर (Layer 4)', 'फिजिकल लेयर (Layer 1)'],
    correctIndex: 1,
    explanation: 'राउटर OSI मॉडल की तीसरी परत यानी नेटवर्क लेयर (Layer 3) पर काम करता है और लॉजिकल (IP) एड्रेस के आधार पर पैकेट रूट करता है।'
  },
  {
    id: 'ind_23_09',
    examIds: ['ctet', 'ugc_net'],
    paperSlot: 'pyq_2023',
    subject: 'teaching_pedagogy',
    examTag: 'CTET / UGC-NET · 2023 Pattern',
    question: 'लेव वायगोत्स्की (Lev Vygotsky) के सामाजिक-सांस्कृतिक सिद्धांत के अनुसार "समीपस्थ विकास का क्षेत्र" (ZPD) किसे दर्शाता है?',
    options: [
      'बालक जो कार्य बिना किसी सहायता के कर सकता है',
      'बालक के स्वतंत्र प्रदर्शन और किसी वयस्क/सक्षम साथी के मार्गदर्शन (Scaffolding) में किए जा सकने वाले प्रदर्शन के बीच का अंतर',
      'जन्मजात जैविक परिपक्वता स्तर',
      'केवल परीक्षा में प्राप्त अंकों का अंतर'
    ],
    correctIndex: 1,
    explanation: 'ZPD (Zone of Proximal Development) वह क्षेत्र है जहाँ शिक्षार्थी उपयुक्त सहायता (पाड़/Scaffolding) मिलने पर कठिन कार्य भी सीख लेता है।'
  },
  {
    id: 'ind_23_10',
    examIds: ['ssc_chsl_mts', 'ssc_gd', 'nda_cds', 'ibps_sbi_po'],
    paperSlot: 'pyq_2023',
    subject: 'english_hindi',
    examTag: 'SSC / IBPS / CDS · 2023 Pattern',
    question: 'Choose the correct one-word substitution for: "A person who can use both hands with equal skill".',
    options: ['Ambiguous', 'Ambidextrous', 'Omnipotent', 'Polyglot'],
    correctIndex: 1,
    explanation: '"Ambidextrous" का अर्थ होता है वह व्यक्ति जो अपने दोनों हाथों (दाएँ और बाएँ) का समान कुशलता से उपयोग कर सके।'
  },

  // ==========================================================
  // PYQ 2024 PATTERN QUESTIONS (ALL-INDIA EXAMS)
  // ==========================================================
  {
    id: 'ind_24_01',
    examIds: ['upsc_cse', 'ssc_cgl', 'nda_cds'],
    paperSlot: 'pyq_2024',
    subject: 'polity_constitution',
    examTag: 'UPSC CSE / SSC · 2024 Pattern',
    question: 'भारतीय संविधान का कौन-सा अनुच्छेद भारत के नियंत्रक एवं महालेखा परीक्षक (CAG) की नियुक्ति व कर्तव्यों से संबंधित है?',
    options: ['अनुच्छेद 148 से 151', 'अनुच्छेद 76 से 78', 'अनुच्छेद 280 से 281', 'अनुच्छेद 324 से 329'],
    correctIndex: 0,
    explanation: 'संविधान के भाग V के अंतर्गत अनुच्छेद 148 में CAG की नियुक्ति और अनुच्छेद 149-151 में उनके कर्तव्य, शक्तियाँ तथा लेखा प्रतिवेदन वर्णित हैं।'
  },
  {
    id: 'ind_24_02',
    examIds: ['upsc_cse', 'ssc_chsl_mts', 'rrb_ntpc_alp'],
    paperSlot: 'pyq_2024',
    subject: 'history_culture',
    examTag: 'UPSC / RRB NTPC · 2024 Pattern',
    question: '1928 के बारडोली सत्याग्रह का सफल नेतृत्व किस नेता ने किया था, जिसके उपरांत वहाँ की महिलाओं ने उन्हें "सरदार" की उपाधि प्रदान की?',
    options: ['महात्मा गांधी', 'वल्लभभाई पटेल', 'जवाहरलाल नेहरू', 'राजेंद्र प्रसाद'],
    correctIndex: 1,
    explanation: 'गुजरात के बारडोली तालुका में बढ़े हुए भू-राजस्व के विरोध में 1928 के आंदोलन के सफल नेतृत्व के बाद वल्लभभाई पटेल को "सरदार" की उपाधि मिली।'
  },
  {
    id: 'ind_24_03',
    examIds: ['upsc_cse', 'nda_cds', 'cuet_neet_gate'],
    paperSlot: 'pyq_2024',
    subject: 'geography_environment',
    examTag: 'UPSC / CUET · 2024 Pattern',
    question: 'वायुमंडल की किस परत में ओज़ोन गैस (O₃) की सर्वाधिक सांद्रता पाई जाती है, जो सूर्य की पराबैंगनी (UV) किरणों को अवशोषित करती है?',
    options: ['क्षोभमंडल (Troposphere)', 'समतापमंडल (Stratosphere)', 'मध्यमंडल (Mesosphere)', 'आयनमंडल (Ionosphere)'],
    correctIndex: 1,
    explanation: 'ओज़ोन परत मुख्यतः समतापमंडल (Stratosphere) में पृथ्वी से लगभग 15 से 35 किमी की ऊँचाई पर पाई जाती है।'
  },
  {
    id: 'ind_24_04',
    examIds: ['ibps_sbi_po', 'upsc_cse', 'cuet_neet_gate'],
    paperSlot: 'pyq_2024',
    subject: 'economy_banking',
    examTag: 'SBI / IBPS PO · 2024 Pattern',
    question: 'भारत में वस्तु एवं सेवा कर (GST) किस संविधान संशोधन अधिनियम द्वारा लागू किया गया और यह किस प्रकार का कर है?',
    options: [
      '100वाँ संशोधन · प्रत्यक्ष कर',
      '101वाँ संशोधन (2016) · गंतव्य-आधारित अप्रत्यक्ष कर',
      '102वाँ संशोधन · संपत्ति कर',
      '99वाँ संशोधन · आयात शुल्क'
    ],
    correctIndex: 1,
    explanation: '101वें संविधान संशोधन अधिनियम (2016) के तहत 1 जुलाई 2017 से GST लागू हुआ, जो एक राष्ट्र-एक कर प्रणाली पर आधारित गंतव्य-आधारित अप्रत्यक्ष कर है।'
  },
  {
    id: 'ind_24_05',
    examIds: ['rrb_ntpc_alp', 'cuet_neet_gate', 'nda_cds', 'ssc_gd'],
    paperSlot: 'pyq_2024',
    subject: 'general_science_tech',
    examTag: 'RRB / NEET / NDA · 2024 Pattern',
    question: 'विद्युत परिपथ में किसी चालक का प्रतिरोध (Resistance) किस भौतिक कारक पर निर्भर नहीं करता है?',
    options: ['चालक की लंबाई पर', 'चालक के अनुप्रस्थ काट के क्षेत्रफल पर', 'चालक के पदार्थ की प्रकृति और ताप पर', 'चालक के बाहरी रंग पर'],
    correctIndex: 3,
    explanation: 'R = ρ(L/A) के अनुसार प्रतिरोध लंबाई (L), अनुप्रस्थ काट क्षेत्रफल (A), पदार्थ की प्रतिरोधकता (ρ) तथा तापमान पर निर्भर करता है, रंग पर नहीं।'
  },
  {
    id: 'ind_24_06',
    examIds: ['ssc_cgl', 'ibps_sbi_po', 'rrb_ntpc_alp', 'ssc_chsl_mts'],
    paperSlot: 'pyq_2024',
    subject: 'quantitative_aptitude',
    examTag: 'SSC CGL / IBPS · 2024 Pattern',
    question: 'A और B मिलकर किसी कार्य को 12 दिनों में पूरा कर सकते हैं और अकेला A उसी कार्य को 20 दिनों में पूरा कर सकता है। अकेला B उस कार्य को कितने दिनों में पूरा करेगा?',
    options: ['25 दिन', '30 दिन', '32 दिन', '28 दिन'],
    correctIndex: 1,
    explanation: 'कुल कार्य = LCM(12, 20) = 60 इकाई। (A+B) की क्षमता = 5, A की क्षमता = 3। अतः B की क्षमता = 5 - 3 = 2 इकाई/दिन। B द्वारा समय = 60 / 2 = 30 दिन।'
  },
  {
    id: 'ind_24_07',
    examIds: ['ssc_cgl', 'ssc_gd', 'rrb_ntpc_alp', 'ugc_net'],
    paperSlot: 'pyq_2024',
    subject: 'reasoning_logic',
    examTag: 'SSC / RRB · 2024 Pattern',
    question: 'एक कूट भाषा में "RANCHI" को "SBODIJ" लिखा जाता है, तो उसी कूट भाषा में "BHARAT" को कैसे लिखा जाएगा?',
    options: ['CIBSBU', 'CIBTBU', 'CIBSBV', 'CHBSBU'],
    correctIndex: 0,
    explanation: 'प्रत्येक अक्षर में +1 जोड़ा गया है: B(+1)=C, H(+1)=I, A(+1)=B, R(+1)=S, A(+1)=B, T(+1)=U → CIBSBU।'
  },
  {
    id: 'ind_24_08',
    examIds: ['ssc_cgl', 'ibps_sbi_po', 'ugc_net', 'cuet_neet_gate'],
    paperSlot: 'pyq_2024',
    subject: 'computer_it',
    examTag: 'IBPS Clerk / SSC CGL · 2024 Pattern',
    question: 'डेटाबेस प्रबंधन प्रणाली (DBMS) में किसी तालिका (Table) की प्रत्येक पंक्ति को विशिष्ट रूप से पहचानने के लिए किस कुंजी (Key) का उपयोग किया जाता है जिसमें NULL मान नहीं हो सकता?',
    options: ['Foreign Key', 'Primary Key', 'Alternate Key', 'Duplicate Key'],
    correctIndex: 1,
    explanation: 'Primary Key किसी टेबल के प्रत्येक रिकॉर्ड को अद्वितीय (Unique) रूप से पहचानती है और इसमें NOT NULL बाधा लागू होती है।'
  },
  {
    id: 'ind_24_09',
    examIds: ['ctet', 'ugc_net'],
    paperSlot: 'pyq_2024',
    subject: 'teaching_pedagogy',
    examTag: 'CTET / UGC-NET · 2024 Pattern',
    question: 'राष्ट्रीय शिक्षा नीति (NEP) 2020 द्वारा प्रस्तावित नई विद्यालयी पाठ्यचर्या एवं शैक्षणिक संरचना कौन-सी है?',
    options: ['10 + 2 प्रणाली', '5 + 3 + 3 + 4 संरचना', '6 + 3 + 3 प्रणाली', '4 + 4 + 4 संरचना'],
    correctIndex: 1,
    explanation: 'NEP 2020 ने पुरानी 10+2 प्रणाली के स्थान पर 5+3+3+4 संरचना (Foundational, Preparatory, Middle, Secondary) लागू की है।'
  },
  {
    id: 'ind_24_10',
    examIds: ['ssc_gd', 'ssc_chsl_mts', 'ctet', 'ibps_sbi_po'],
    paperSlot: 'pyq_2024',
    subject: 'english_hindi',
    examTag: 'SSC GD / CTET · 2024 Pattern',
    question: 'हिन्दी व्याकरण की दृष्टि से "नीलकमल" शब्द में कौन-सा समास प्रयुक्त हुआ है?',
    options: ['द्वंद्व समास', 'कर्मधारय समास', 'अव्ययीभाव समास', 'तत्पुरुष समास'],
    correctIndex: 1,
    explanation: '"नीलकमल" (नीला है जो कमल) में विशेषण-विशेष्य का संबंध होने के कारण कर्मधारय समास है।'
  },

  // ==========================================================
  // PYQ 2025 PATTERN QUESTIONS (ALL-INDIA EXAMS)
  // ==========================================================
  {
    id: 'ind_25_01',
    examIds: ['upsc_cse', 'ssc_cgl', 'nda_cds', 'cuet_neet_gate'],
    paperSlot: 'pyq_2025',
    subject: 'polity_constitution',
    examTag: 'UPSC / SSC / CDS · 2025 Pattern',
    question: 'संविधान के 106वें संशोधन अधिनियम (नारी शक्ति वंदन अधिनियम) के अंतर्गत लोकसभा तथा राज्य विधानसभाओं में महिलाओं के लिए कितने प्रतिशत सीटें आरक्षित करने का प्रावधान है?',
    options: ['25%', '33% (एक-तिहाई)', '50%', '40%'],
    correctIndex: 1,
    explanation: '106वें संविधान संशोधन अधिनियम (2023) के तहत लोकसभा, राज्य विधानसभाओं और दिल्ली विधानसभा में महिलाओं के लिए 33% सीटें आरक्षित की गई हैं।'
  },
  {
    id: 'ind_25_02',
    examIds: ['upsc_cse', 'ssc_cgl', 'rrb_ntpc_alp'],
    paperSlot: 'pyq_2025',
    subject: 'history_culture',
    examTag: 'UPSC / SSC · 2025 Pattern',
    question: 'मौर्य सम्राट अशोक के किस शिलालेख में कलिंग युद्ध (261 ई.पू.) के भयावह परिणामों और "धम्म विजय" की नीति का विस्तृत वर्णन मिलता है?',
    options: ['प्रथम शिलालेख', 'सातवाँ शिलालेख', 'तेरहवाँ प्रमुख शिलालेख (XIII Rock Edict)', 'दूसरा स्तंभ लेख'],
    correctIndex: 2,
    explanation: 'अशोक के 13वें प्रमुख शिलालेख में कलिंग युद्ध में हुए नरसंहार पर उनके पश्चात्ताप और भेरीघोष के स्थान पर धम्मघोष अपनाने का वर्णन है।'
  },
  {
    id: 'ind_25_03',
    examIds: ['upsc_cse', 'nda_cds', 'ssc_chsl_mts'],
    paperSlot: 'pyq_2025',
    subject: 'geography_environment',
    examTag: 'UPSC / NDA · 2025 Pattern',
    question: 'भारत का एकमात्र सक्रिय ज्वालामुखी "बैरन द्वीप" (Barren Island) निम्नलिखित में से किस द्वीप समूह में स्थित है?',
    options: ['लक्षद्वीप समूह', 'अंडमान और निकोबार द्वीप समूह', 'मन्नार की खाड़ी', 'दमन व दीव'],
    correctIndex: 1,
    explanation: 'बैरन द्वीप अंडमान सागर (अंडमान व निकोबार द्वीप समूह) में पोर्ट ब्लेयर से लगभग 135 किमी उत्तर-पूर्व में स्थित दक्षिण एशिया का एकमात्र सक्रिय ज्वालामुखी है।'
  },
  {
    id: 'ind_25_04',
    examIds: ['ibps_sbi_po', 'upsc_cse', 'ssc_cgl'],
    paperSlot: 'pyq_2025',
    subject: 'economy_banking',
    examTag: 'IBPS / SBI PO · 2025 Pattern',
    question: 'भारतीय बैंकिंग प्रणाली में UPI (Unified Payments Interface) का संचालन और विकास किस संस्था द्वारा किया जाता है?',
    options: ['SEBI', 'NPCI (भारतीय राष्ट्रीय भुगतान निगम)', 'NABARD', 'SIDBI'],
    correctIndex: 1,
    explanation: 'NPCI (National Payments Corporation of India) की स्थापना RBI और IBA की पहल पर हुई थी; यही UPI, RuPay, IMPS और BHIM का संचालन करता है।'
  },
  {
    id: 'ind_25_05',
    examIds: ['rrb_ntpc_alp', 'cuet_neet_gate', 'nda_cds'],
    paperSlot: 'pyq_2025',
    subject: 'general_science_tech',
    examTag: 'RRB ALP / CUET / GATE · 2025 Pattern',
    question: 'भारत के चंद्रयान-3 मिशन के लैंडर (विक्रम) ने चंद्रमा के किस क्षेत्र के समीप ऐतिहासिक सॉफ्ट लैंडिंग की थी?',
    options: ['चंद्रमा के उत्तरी ध्रुव पर', 'चंद्रमा के दक्षिणी ध्रुवीय क्षेत्र के समीप (शिव शक्ति पॉइंट)', 'मेयर ट्रैंक्विलिटाटिस पर', 'भूमध्यरेखीय क्रेटर में'],
    correctIndex: 1,
    explanation: '23 अगस्त 2023 को चंद्रयान-3 के विक्रम लैंडर ने चंद्रमा के दक्षिणी ध्रुवीय क्षेत्र (शिव शक्ति पॉइंट) पर सफलतापूर्वक सॉफ्ट लैंडिंग की।'
  },
  {
    id: 'ind_25_06',
    examIds: ['ssc_cgl', 'ibps_sbi_po', 'rrb_ntpc_alp', 'ssc_gd'],
    paperSlot: 'pyq_2025',
    subject: 'quantitative_aptitude',
    examTag: 'SSC CGL / IBPS · 2025 Pattern',
    question: '₹10,000 की राशि पर 10% वार्षिक चक्रवृद्धि ब्याज दर से 2 वर्षों का चक्रवृद्धि ब्याज (Compound Interest) कितना होगा?',
    options: ['₹2,000', '₹2,100', '₹2,200', '₹1,950'],
    correctIndex: 1,
    explanation: '2 वर्ष की प्रभावी चक्रवृद्धि दर = 10 + 10 + (10×10)/100 = 21%। अतः ब्याज = 10,000 का 21% = ₹2,100।'
  },
  {
    id: 'ind_25_07',
    examIds: ['ssc_cgl', 'ibps_sbi_po', 'rrb_ntpc_alp', 'ugc_net'],
    paperSlot: 'pyq_2025',
    subject: 'reasoning_logic',
    examTag: 'SSC / IBPS / UGC-NET · 2025 Pattern',
    question: 'कथन: (1) सभी नदियाँ जल हैं। (2) कुछ जल पर्वत हैं। निष्कर्ष I: कुछ पर्वत जल हैं। निष्कर्ष II: सभी पर्वत नदियाँ हैं। सही विकल्प चुनें:',
    options: ['केवल निष्कर्ष I अनुसरण करता है', 'केवल निष्कर्ष II अनुसरण करता है', 'दोनों I और II अनुसरण करते हैं', 'न तो I न II अनुसरण करता है'],
    correctIndex: 0,
    explanation: '"कुछ जल पर्वत हैं" से निश्चित रूप से "कुछ पर्वत जल हैं" (निष्कर्ष I) सत्य है, लेकिन पर्वत और नदी में प्रत्यक्ष निश्चित संबंध नहीं दिया है।'
  },
  {
    id: 'ind_25_08',
    examIds: ['ssc_cgl', 'ibps_sbi_po', 'cuet_neet_gate'],
    paperSlot: 'pyq_2025',
    subject: 'computer_it',
    examTag: 'SSC CGL / GATE / IBPS · 2025 Pattern',
    question: 'कंप्यूटर मेमोरी पदानुक्रम (Memory Hierarchy) में CPU के सबसे निकट और सबसे तीव्र गति वाली अस्थायी मेमोरी कौन-सी होती है?',
    options: ['रजिस्टर (CPU Registers) एवं कैश मेमोरी', 'हार्ड डिस्क ड्राइव (HDD)', 'फ्लैश मेमोरी (SSD)', 'ऑप्टिकल डिस्क (DVD)'],
    correctIndex: 0,
    explanation: 'CPU के अंदर स्थित रजिस्टर (Registers) सबसे तेज़ मेमोरी होते हैं और उसके ठीक बाद L1/L2/L3 कैश (Cache) मेमोरी आती है।'
  },
  {
    id: 'ind_25_09',
    examIds: ['ctet', 'ugc_net'],
    paperSlot: 'pyq_2025',
    subject: 'teaching_pedagogy',
    examTag: 'UGC-NET / CTET · 2025 Pattern',
    question: 'सतत एवं व्यापक मूल्यांकन (CCE) में "रचनात्मक आकलन" (Formative Assessment) का मुख्य उद्देश्य क्या होता है?',
    options: [
      'सत्र के अंत में केवल ग्रेड और रैंक प्रदान करना',
      'शिक्षण-अधिगम प्रक्रिया के दौरान विद्यार्थियों की प्रगति की निगरानी और समय पर सुधारात्मक प्रतिपुष्टि (Feedback) देना',
      'विद्यार्थियों को उत्तीर्ण या अनुत्तीर्ण घोषित करना',
      'केवल वार्षिक परीक्षा के अंकों का योग करना'
    ],
    correctIndex: 1,
    explanation: 'Formative Assessment सीखने के दौरान (Assessment for Learning) त्रुटियों की पहचान कर शिक्षण विधि में तुरंत सुधार करने में सहायक होता है।'
  },
  {
    id: 'ind_25_10',
    examIds: ['ssc_cgl', 'ibps_sbi_po', 'nda_cds', 'ssc_chsl_mts'],
    paperSlot: 'pyq_2025',
    subject: 'english_hindi',
    examTag: 'SSC / IBPS / CDS · 2025 Pattern',
    question: 'Identify the correct passive voice for: "The committee approved the 2026 examination schedule."',
    options: [
      'The 2026 examination schedule is approved by the committee.',
      'The 2026 examination schedule was approved by the committee.',
      'The 2026 examination schedule had approved by the committee.',
      'The committee was approved by the 2026 examination schedule.'
    ],
    correctIndex: 1,
    explanation: 'Simple Past Tense (V2: approved) का Passive Voice "was/were + V3" (was approved) के रूप में बनता है।'
  },

  // ==========================================================
  // 2026 PRACTICE PAPER SET 1 (ALL-INDIA EXAMS)
  // ==========================================================
  {
    id: 'ind_p1_01',
    examIds: ['upsc_cse', 'ssc_cgl', 'nda_cds'],
    paperSlot: 'practice_set_1',
    subject: 'polity_constitution',
    examTag: '2026 Practice Set 1 · Polity',
    question: 'भारतीय संविधान की प्रस्तावना में "समाजवादी", "पंथनिरपेक्ष" और "अखंडता" शब्द किस संविधान संशोधन द्वारा जोड़े गए थे?',
    options: ['24वाँ संशोधन (1971)', '42वाँ संशोधन (1976)', '44वाँ संशोधन (1978)', '52वाँ संशोधन (1985)'],
    correctIndex: 1,
    explanation: '42वें संविधान संशोधन अधिनियम (1976) द्वारा प्रस्तावना में समाजवादी, पंथनिरपेक्ष तथा राष्ट्र की एकता के साथ "और अखंडता" शब्द जोड़े गए।'
  },
  {
    id: 'ind_p1_02',
    examIds: ['upsc_cse', 'ssc_chsl_mts', 'rrb_ntpc_alp'],
    paperSlot: 'practice_set_1',
    subject: 'history_culture',
    examTag: '2026 Practice Set 1 · Modern History',
    question: '1905 में बंगाल विभाजन के विरोध में स्वदेशी आंदोलन के दौरान "वंदे मातरम्" और रक्षाबंधन के सांस्कृतिक प्रतीकों का आह्वान प्रमुखता से कहाँ हुआ?',
    options: ['बंगाल में (रवींद्रनाथ टैगोर व अन्य के नेतृत्व में)', 'पंजाब के अमृतसर में', 'मद्रास प्रेसीडेंसी में', 'अवध प्रांत में'],
    correctIndex: 0,
    explanation: '16 अक्टूबर 1905 को बंगाल विभाजन प्रभावी होने पर शोक दिवस मनाया गया तथा रवींद्रनाथ टैगोर के आह्वान पर एकता के प्रतीक रूप में रक्षाबंधन मनाया गया।'
  },
  {
    id: 'ind_p1_03',
    examIds: ['upsc_cse', 'ssc_cgl', 'nda_cds', 'rrb_ntpc_alp'],
    paperSlot: 'practice_set_1',
    subject: 'geography_environment',
    examTag: '2026 Practice Set 1 · Geography',
    question: 'भारत की मानक समय रेखा (IST: 82°30\' पूर्वी देशांतर) निम्नलिखित में से किस राज्य से होकर नहीं गुजरती है?',
    options: ['उत्तर प्रदेश', 'छत्तीसगढ़', 'ओडिशा', 'झारखंड'],
    correctIndex: 3,
    explanation: '82°30\' पूर्वी देशांतर भारत के 5 राज्यों—उत्तर प्रदेश, मध्य प्रदेश, छत्तीसगढ़, ओडिशा और आंध्र प्रदेश—से होकर गुजरती है (झारखंड से नहीं)।'
  },
  {
    id: 'ind_p1_04',
    examIds: ['ibps_sbi_po', 'upsc_cse', 'ssc_cgl'],
    paperSlot: 'practice_set_1',
    subject: 'economy_banking',
    examTag: '2026 Practice Set 1 · Economy',
    question: 'भारतीय मुद्रास्फीति को नियंत्रित करने के लिए गठित "मौद्रिक नीति समिति" (MPC) में कुल कितने सदस्य होते हैं और इसके पदेन अध्यक्ष कौन होते हैं?',
    options: [
      '4 सदस्य · केंद्रीय वित्त मंत्री',
      '6 सदस्य · भारतीय रिज़र्व बैंक (RBI) के गवर्नर',
      '5 सदस्य · नीति आयोग के उपाध्यक्ष',
      '8 सदस्य · मुख्य आर्थिक सलाहकार'
    ],
    correctIndex: 1,
    explanation: 'RBI अधिनियम 1934 (संशोधित 2016) के अनुसार MPC में 6 सदस्य होते हैं (3 RBI से व 3 केंद्र सरकार द्वारा नामित) और RBI गवर्नर इसके पदेन अध्यक्ष होते हैं।'
  },
  {
    id: 'ind_p1_05',
    examIds: ['rrb_ntpc_alp', 'ssc_gd', 'cuet_neet_gate', 'nda_cds'],
    paperSlot: 'practice_set_1',
    subject: 'general_science_tech',
    examTag: '2026 Practice Set 1 · Science',
    question: 'प्रकाश के किस घटना के कारण आकाश का रंग नीला दिखाई देता है तथा सूर्योदय/सूर्यास्त के समय सूर्य रक्ताभ प्रतीत होता है?',
    options: ['प्रकाश का पूर्ण आंतरिक परावर्तन', 'प्रकाश का प्रकीर्णन (Scattering of Light)', 'प्रकाश का विवर्तन', 'प्रकाश का व्यतिकरण'],
    correctIndex: 1,
    explanation: 'रेले प्रकीर्णन (Rayleigh Scattering) के अनुसार छोटी तरंगदैर्घ्य (नीले प्रकाश) का वायुमंडलीय कणों द्वारा सर्वाधिक प्रकीर्णन होता है।'
  },
  {
    id: 'ind_p1_06',
    examIds: ['ssc_cgl', 'ibps_sbi_po', 'rrb_ntpc_alp', 'ssc_chsl_mts'],
    paperSlot: 'practice_set_1',
    subject: 'quantitative_aptitude',
    examTag: '2026 Practice Set 1 · Maths',
    question: 'यदि एक वस्तु को ₹1,440 में बेचने पर 20% का लाभ होता है, तो 25% का लाभ कमाने के लिए उस वस्तु का विक्रय मूल्य क्या होना चाहिए?',
    options: ['₹1,480', '₹1,500', '₹1,550', '₹1,600'],
    correctIndex: 1,
    explanation: 'क्रय मूल्य = (1440 / 120) × 100 = ₹1,200। अब 25% लाभ पर नया विक्रय मूल्य = 1200 × (125/100) = ₹1,500।'
  },
  {
    id: 'ind_p1_07',
    examIds: ['ssc_cgl', 'ibps_sbi_po', 'ssc_gd', 'ugc_net'],
    paperSlot: 'practice_set_1',
    subject: 'reasoning_logic',
    examTag: '2026 Practice Set 1 · Reasoning',
    question: 'एक व्यक्ति उत्तर की ओर 5 किमी चलता है, फिर दाएँ मुड़कर 12 किमी चलता है। वह अपने प्रारंभिक बिंदु से सीधी (न्यूनतम) कितनी दूरी पर है?',
    options: ['17 किमी', '13 किमी', '15 किमी', '11 किमी'],
    correctIndex: 1,
    explanation: 'पाइथागोरस प्रमेय द्वारा न्यूनतम दूरी = √(5² + 12²) = √(25 + 144) = √169 = 13 किमी।'
  },
  {
    id: 'ind_p1_08',
    examIds: ['ssc_cgl', 'ibps_sbi_po', 'cuet_neet_gate', 'ugc_net'],
    paperSlot: 'practice_set_1',
    subject: 'computer_it',
    examTag: '2026 Practice Set 1 · Computer',
    question: 'वेब ब्राउज़र और सर्वर के बीच सुरक्षित एन्क्रिप्टेड संचार के लिए प्रयुक्त "HTTPS" में "S" किस प्रोटोकॉल सुरक्षा को दर्शाता है?',
    options: ['Static', 'Secure (TLS / SSL आधारित एन्क्रिप्शन)', 'Server', 'Syntax'],
    correctIndex: 1,
    explanation: 'HTTPS (Hypertext Transfer Protocol Secure) डेटा को TLS/SSL क्रिप्टोग्राफिक प्रोटोकॉल से एन्क्रिप्ट कर सुरक्षित संचार सुनिश्चित करता है।'
  },
  {
    id: 'ind_p1_09',
    examIds: ['ctet', 'ugc_net'],
    paperSlot: 'practice_set_1',
    subject: 'teaching_pedagogy',
    examTag: '2026 Practice Set 1 · Pedagogy',
    question: 'समावेशी शिक्षा (Inclusive Education) की मूल भावना निम्नलिखित में से किस सिद्धांत पर आधारित है?',
    options: [
      'दिव्यांग बच्चों के लिए केवल अलग विद्यालय खोलना',
      'सभी पृष्ठभूमि व क्षमताओं वाले बच्चों को उनकी आवश्यकताओं के अनुरूप सहयोग देकर एक ही सामान्य कक्षा में समान अवसर प्रदान करना',
      'केवल मेधावी छात्रों का पृथक चयन करना',
      'एकसमान रटने की पद्धति लागू करना'
    ],
    correctIndex: 1,
    explanation: 'समावेशी शिक्षा विविध सीखने की शैलियों और विशेष आवश्यकताओं वाले सभी बच्चों को सम्मानजनक रूप से मुख्यधारा की कक्षा में जोड़ती है।'
  },
  {
    id: 'ind_p1_10',
    examIds: ['ssc_cgl', 'ibps_sbi_po', 'nda_cds', 'ssc_chsl_mts'],
    paperSlot: 'practice_set_1',
    subject: 'english_hindi',
    examTag: '2026 Practice Set 1 · Verbal',
    question: 'Select the most appropriate synonym of the word "PRAGMATIC":',
    options: ['Impractical', 'Practical / Realistic', 'Hostile', 'Obsolete'],
    correctIndex: 1,
    explanation: '"Pragmatic" का अर्थ व्यावहारिक या यथार्थवादी होता है जो सिद्धांतों से अधिक वास्तविक परिणामों पर ध्यान देता है।'
  },

  // ==========================================================
  // 2026 PRACTICE PAPER SET 2 (ALL-INDIA EXAMS)
  // ==========================================================
  {
    id: 'ind_p2_01',
    examIds: ['upsc_cse', 'ssc_cgl', 'nda_cds'],
    paperSlot: 'practice_set_2',
    subject: 'polity_constitution',
    examTag: '2026 Practice Set 2 · Constitution',
    question: 'भारतीय संविधान की 5वीं और 6वीं अनुसूची का मुख्य विषय क्या है?',
    options: [
      'राज्यों के बीच नदी जल विवाद',
      'अनुसूचित क्षेत्रों एवं अनुसूचित जनजातियों का प्रशासन व नियंत्रण',
      'दलबदल विरोधी कानून',
      'नगरपालिकाओं की शक्तियाँ'
    ],
    correctIndex: 1,
    explanation: '5वीं अनुसूची (झारखंड सहित 10 राज्यों के अनुसूचित क्षेत्र) और 6वीं अनुसूची (असम, मेघालय, त्रिपुरा, मिजोरम) जनजातीय क्षेत्रों के प्रशासन से संबंधित हैं।'
  },
  {
    id: 'ind_p2_02',
    examIds: ['upsc_cse', 'ssc_chsl_mts', 'rrb_ntpc_alp'],
    paperSlot: 'practice_set_2',
    subject: 'history_culture',
    examTag: '2026 Practice Set 2 · Art & History',
    question: 'भारतीय राष्ट्रीय कांग्रेस के किस अधिवेशन में "पूर्ण स्वराज" (Complete Independence) का ऐतिहासिक प्रस्ताव पारित किया गया था?',
    options: ['कलकत्ता अधिवेशन (1928)', 'लाहौर अधिवेशन (1929)', 'कराची अधिवेशन (1931)', 'लखनऊ अधिवेशन (1916)'],
    correctIndex: 1,
    explanation: 'दिसंबर 1929 के लाहौर अधिवेशन (अध्यक्ष: जवाहरलाल नेहरू) में पूर्ण स्वराज का प्रस्ताव पारित हुआ और 26 जनवरी 1930 को प्रथम स्वाधीनता दिवस मनाया गया।'
  },
  {
    id: 'ind_p2_03',
    examIds: ['upsc_cse', 'nda_cds', 'ssc_cgl'],
    paperSlot: 'practice_set_2',
    subject: 'geography_environment',
    examTag: '2026 Practice Set 2 · Environment',
    question: 'भारत में "रामसर कन्वेंशन" (Ramsar Convention) का संबंध निम्नलिखित में से किसके संरक्षण से है?',
    options: ['हिमनदों के पिघलने से रोकथाम', 'आर्द्रभूमियों (Wetlands) के संरक्षण एवं सतत उपयोग से', 'प्रवाल भित्तियों के खनन से', 'औद्योगिक अपशिष्ट प्रबंधन से'],
    correctIndex: 1,
    explanation: '2 फरवरी 1971 को ईरान के रामसर शहर में हस्ताक्षरित रामसर संधि विश्व भर की महत्वपूर्ण आर्द्रभूमियों (Wetlands) के संरक्षण से संबंधित है।'
  },
  {
    id: 'ind_p2_04',
    examIds: ['ibps_sbi_po', 'upsc_cse', 'ssc_cgl'],
    paperSlot: 'practice_set_2',
    subject: 'economy_banking',
    examTag: '2026 Practice Set 2 · Banking',
    question: 'बैंकिंग क्षेत्र में "बेसल-III मानदंड" (Basel III Norms) का मुख्य उद्देश्य क्या सुनिश्चित करना है?',
    options: [
      'केवल कृषि ऋण पर सब्सिडी देना',
      'बैंकों की पूँजी पर्याप्तता (Capital Adequacy) और जोखिम प्रबंधन क्षमता को सुदृढ़ करना',
      'मुद्रा नोटों की छपाई की गति बढ़ाना',
      'निर्यात शुल्क में छूट देना'
    ],
    correctIndex: 1,
    explanation: 'Basel III अंतरराष्ट्रीय बैंकिंग विनियमन मानक हैं जो वित्तीय संकटों से बचाव के लिए बैंकों की न्यूनतम पूँजी (CRAR) व तरलता अनुपात तय करते हैं।'
  },
  {
    id: 'ind_p2_05',
    examIds: ['rrb_ntpc_alp', 'cuet_neet_gate', 'ssc_gd', 'nda_cds'],
    paperSlot: 'practice_set_2',
    subject: 'general_science_tech',
    examTag: '2026 Practice Set 2 · Physics/Chem',
    question: 'शुद्ध जल का pH मान 25°C पर कितना होता है और मानव रक्त की प्रकृति किस प्रकार की होती है?',
    options: ['pH = 7 (उदासीन), रक्त हल्का क्षारीय (pH ≈ 7.4)', 'pH = 5 (अम्लीय), रक्त प्रबल अम्लीय', 'pH = 9 (क्षारीय), रक्त उदासीन', 'pH = 7, रक्त pH = 4.5'],
    correctIndex: 0,
    explanation: '25°C पर शुद्ध जल उदासीन (pH = 7.0) होता है, जबकि सामान्य मानव रक्त का pH मान 7.35 से 7.45 (हल्का क्षारीय) के बीच रहता है।'
  },
  {
    id: 'ind_p2_06',
    examIds: ['ssc_cgl', 'ibps_sbi_po', 'rrb_ntpc_alp', 'ssc_chsl_mts'],
    paperSlot: 'practice_set_2',
    subject: 'quantitative_aptitude',
    examTag: '2026 Practice Set 2 · Arithmetic',
    question: 'पाँच क्रमागत विषम संख्याओं का औसत 27 है। इनमें सबसे बड़ी संख्या और सबसे छोटी संख्या का गुणनफल क्या होगा?',
    options: ['713', '729', '695', '725'],
    correctIndex: 0,
    explanation: 'औसत 27 मध्य संख्या है, अतः संख्याएँ 23, 25, 27, 29, 31 हैं। सबसे छोटी (23) × सबसे बड़ी (31) = 713।'
  },
  {
    id: 'ind_p2_07',
    examIds: ['ssc_cgl', 'ibps_sbi_po', 'rrb_ntpc_alp', 'ugc_net'],
    paperSlot: 'practice_set_2',
    subject: 'reasoning_logic',
    examTag: '2026 Practice Set 2 · Logic',
    question: 'यदि 15 जनवरी 2026 को गुरुवार (Thursday) था, तो 15 मार्च 2026 को कौन-सा दिन होगा?',
    options: ['शनिवार', 'रविवार', 'सोमवार', 'शुक्रवार'],
    correctIndex: 1,
    explanation: '2026 सामान्य वर्ष है (फरवरी = 28 दिन)। 15 जनवरी से 15 मार्च तक कुल दिन = 16 (जन) + 28 (फर) + 15 (मार्च) = 59 दिन। 59 mod 7 = 3 विषम दिन। गुरुवार + 3 दिन = रविवार।'
  },
  {
    id: 'ind_p2_08',
    examIds: ['ssc_cgl', 'ibps_sbi_po', 'cuet_neet_gate', 'ugc_net'],
    paperSlot: 'practice_set_2',
    subject: 'computer_it',
    examTag: '2026 Practice Set 2 · IT & Cyber',
    question: 'कंप्यूटर सुरक्षा में "फिशिंग" (Phishing) हमले से क्या अभिप्राय है?',
    options: [
      'हार्डवेयर के तापमान को कम करना',
      'नकली ईमेल या वेबसाइट के माध्यम से उपयोगकर्ता की संवेदनशील जानकारी (पासवर्ड, OTP, बैंक विवरण) चुराने का प्रयास',
      'डेटा को संपीड़ित (Compress) करना',
      'नेटवर्क की गति बढ़ाना'
    ],
    correctIndex: 1,
    explanation: 'Phishing एक साइबर सोशल-इंजीनियरिंग हमला है जिसमें विश्वसनीय संस्था जैसा छद्म रूप बनाकर यूज़र के लॉगिन या वित्तीय क्रेडेंशियल ठगे जाते हैं।'
  },
  {
    id: 'ind_p2_09',
    examIds: ['ctet', 'ugc_net'],
    paperSlot: 'practice_set_2',
    subject: 'teaching_pedagogy',
    examTag: '2026 Practice Set 2 · Research/Edu',
    question: 'जीन पियाजे (Jean Piaget) के संज्ञानात्मक विकास सिद्धांत की किस अवस्था में बच्चे में "वस्तु स्थायित्व" (Object Permanence) का गुण विकसित होता है?',
    options: [
      'संवेदी-गामक अवस्था (Sensorimotor Stage: 0–2 वर्ष)',
      'पूर्व-संक्रियात्मक अवस्था (2–7 वर्ष)',
      'मूर्त संक्रियात्मक अवस्था (7–11 वर्ष)',
      'औपचारिक संक्रियात्मक अवस्था (11+ वर्ष)'
    ],
    correctIndex: 0,
    explanation: 'संवेदी-गामक अवस्था (0–2 वर्ष) के अंत तक शिशु समझने लगता है कि आँखों से ओझल होने पर भी वस्तु का अस्तित्व बना रहता है (Object Permanence)।'
  },
  {
    id: 'ind_p2_10',
    examIds: ['ssc_gd', 'ssc_chsl_mts', 'ctet', 'ibps_sbi_po'],
    paperSlot: 'practice_set_2',
    subject: 'english_hindi',
    examTag: '2026 Practice Set 2 · Grammar',
    question: 'निम्नलिखित में से शुद्ध वर्तनी वाला शब्द कौन-सा है?',
    options: ['उज्वल', 'उज्ज्वल', 'उज्जवल', 'उजज्वल'],
    correctIndex: 1,
    explanation: 'संधि नियम (उत् + ज्वल) के अनुसार दोनों "ज" आधे होते हैं — शुद्ध रूप "उज्ज्वल" है।'
  }
];
