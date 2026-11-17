import {
  INDIA_COMPETITIVE_QUESTIONS,
  CompetitiveQuestion,
  ExamPaperSlot
} from './examQuestionsIndia2026';
import { JHARKHAND_COMPETITIVE_QUESTIONS } from './examQuestionsJharkhand2026';
import { EXTRA_COMPETITIVE_QUESTIONS_2026 } from './examQuestionsExtra2026';

export type ExamRegion = 'india' | 'jharkhand';

export interface RequiredExamPaper2026 {
  paperCode: string;
  title: string;
  subjects: string;
  questionsInfo: string;
  marksInfo: string;
  durationMin: number;
  negativeMarking: string;
}

export interface PaperSetMeta {
  slot: ExamPaperSlot;
  label: string;
  yearOrSet: string;
  subtitle: string;
}

export interface CompetitiveExam2026 {
  id: string;
  region: ExamRegion;
  shortName: string;
  fullNameHindi: string;
  fullNameEnglish: string;
  conductingBody: string;
  category: string;
  eligibility: string;
  officialPortal: string;
  cycleNote2026: string;
  defaultCbtConfig: {
    marksPerCorrect: number;
    negativeMark: number;
    durationMinutes: number;
  };
  requiredPapers2026: RequiredExamPaper2026[];
}

export const PAPER_SLOTS_META: PaperSetMeta[] = [
  {
    slot: 'pyq_2023',
    label: 'PYQ 2023 (पिछला प्रश्नपत्र)',
    yearOrSet: '2023 Cycle',
    subtitle: '2023 परीक्षा पैटर्न व स्मृति-आधारित वास्तविक प्रश्न-पत्र पूर्वावलोकन'
  },
  {
    slot: 'pyq_2024',
    label: 'PYQ 2024 (पिछला प्रश्नपत्र)',
    yearOrSet: '2024 Cycle',
    subtitle: '2024 परीक्षा पैटर्न व स्मृति-आधारित वास्तविक प्रश्न-पत्र पूर्वावलोकन'
  },
  {
    slot: 'pyq_2025',
    label: 'PYQ 2025 (नवीनतम PYQ)',
    yearOrSet: '2025 Cycle',
    subtitle: '2025 परीक्षा चक्र पैटर्न पर आधारित प्रामाणिक प्रश्न-पत्र पूर्वावलोकन'
  },
  {
    slot: 'practice_set_1',
    label: '2026 Practice Paper Set 1',
    yearOrSet: '2026 Set 1',
    subtitle: 'आधिकारिक 2026 पाठ्यक्रम (Syllabus) आधारित पूर्ण अभ्यास सेट - 1'
  },
  {
    slot: 'practice_set_2',
    label: '2026 Practice Paper Set 2',
    yearOrSet: '2026 Set 2',
    subtitle: 'आधिकारिक 2026 पाठ्यक्रम (Syllabus) आधारित पूर्ण अभ्यास सेट - 2'
  }
];

export const COMPETITIVE_EXAMS_2026: CompetitiveExam2026[] = [
  // =========================================================================
  // 🇮🇳 ALL-INDIA COMPETITIVE EXAMS 2026 (10 REAL MAJOR EXAMS)
  // =========================================================================
  {
    id: 'upsc_cse',
    region: 'india',
    shortName: 'UPSC CSE 2026',
    fullNameHindi: 'संघ लोक सेवा आयोग — सिविल सेवा परीक्षा (IAS / IPS / IFS)',
    fullNameEnglish: 'UPSC Civil Services Examination 2026',
    conductingBody: 'UPSC (संघ लोक सेवा आयोग)',
    category: 'अखिल भारतीय सिविल सेवा',
    eligibility: 'मान्यता प्राप्त विश्वविद्यालय से स्नातक (Graduation)',
    officialPortal: 'upsc.gov.in',
    cycleNote2026: 'वार्षिक 3-चरणीय चयन (प्रारंभिक परीक्षा, मुख्य परीक्षा एवं साक्षात्कार) — आधिकारिक UPSC वार्षिक कैलेंडर के अनुसार आयोजित।',
    defaultCbtConfig: { marksPerCorrect: 2, negativeMark: 0.66, durationMinutes: 20 },
    requiredPapers2026: [
      {
        paperCode: 'Prelims Paper I',
        title: 'सामान्य अध्ययन (General Studies)',
        subjects: 'इतिहास, राजव्यवस्था, भूगोल, अर्थव्यवस्था, पर्यावरण, विज्ञान एवं समसामयिकी',
        questionsInfo: '100 प्रश्न',
        marksInfo: '200 अंक',
        durationMin: 120,
        negativeMarking: '1/3 (-0.66 प्रति गलत)'
      },
      {
        paperCode: 'Prelims Paper II (CSAT)',
        title: 'सिविल सेवा अभिरुचि परीक्षा (Qualifying 33%)',
        subjects: 'बोधगम्यता, तार्किक कौशल, गणितीय क्षमता एवं निर्णय निर्माण',
        questionsInfo: '80 प्रश्न',
        marksInfo: '200 अंक (क्वालीफाइंग)',
        durationMin: 120,
        negativeMarking: '1/3 (-0.83 प्रति गलत)'
      },
      {
        paperCode: 'Mains (9 Papers)',
        title: 'वर्णनात्मक मुख्य परीक्षा (Descriptive)',
        subjects: 'Paper A (8वीं अनुसूची भाषा जैसे संताली/हिन्दी), Paper B (English), Essay, GS-I से GS-IV, Optional I & II',
        questionsInfo: '9 वर्णनात्मक पेपर',
        marksInfo: '1750 मेरिट + 275 साक्षात्कार',
        durationMin: 180,
        negativeMarking: 'लागू नहीं (वर्णनात्मक)'
      }
    ]
  },
  {
    id: 'ssc_cgl',
    region: 'india',
    shortName: 'SSC CGL 2026',
    fullNameHindi: 'कर्मचारी चयन आयोग — संयुक्त स्नातक स्तरीय परीक्षा',
    fullNameEnglish: 'SSC Combined Graduate Level (CGL) 2026',
    conductingBody: 'SSC (कर्मचारी चयन आयोग)',
    category: 'केंद्रीय स्नातक स्तरीय भर्ती',
    eligibility: 'किसी भी संकाय में स्नातक (Bachelor Degree)',
    officialPortal: 'ssc.gov.in',
    cycleNote2026: 'ASO, आयकर निरीक्षक, CBI, ऑडिटर एवं केंद्रीय मंत्रालयों हेतु Tier-I (स्क्रीनिंग) व Tier-II (मेरिट) CBT परीक्षा।',
    defaultCbtConfig: { marksPerCorrect: 2, negativeMark: 0.5, durationMinutes: 15 },
    requiredPapers2026: [
      {
        paperCode: 'Tier-I (CBT)',
        title: 'प्रारंभिक ऑनलाइन परीक्षा (Qualifying)',
        subjects: 'तर्कशक्ति (25), सामान्य जागरूकता (25), गणित (25), अंग्रेज़ी बोध (25)',
        questionsInfo: '100 प्रश्न',
        marksInfo: '200 अंक',
        durationMin: 60,
        negativeMarking: '-0.50 प्रति गलत'
      },
      {
        paperCode: 'Tier-II Paper I',
        title: 'मुख्य मेरिट CBT (Session I & II)',
        subjects: 'Sec-I: गणित + रीजनिंग (60Q) · Sec-II: अंग्रेज़ी + सामान्य अध्ययन (70Q) · Sec-III: कंप्यूटर (20Q) + DEST टाइपिंग',
        questionsInfo: '150 प्रश्न (मेरिट + कंप्यूटर)',
        marksInfo: '390 मेरिट + 60 कंप्यूटर (क्वालीफाइंग)',
        durationMin: 150,
        negativeMarking: '-1.00 प्रति गलत (+3 अंक/सही)'
      }
    ]
  },
  {
    id: 'ssc_chsl_mts',
    region: 'india',
    shortName: 'SSC CHSL & MTS 2026',
    fullNameHindi: 'SSC 10+2 (LDC / DEO) एवं मल्टी टास्किंग स्टाफ (MTS)',
    fullNameEnglish: 'SSC CHSL (10+2) & MTS / Havaldar 2026',
    conductingBody: 'SSC (कर्मचारी चयन आयोग)',
    category: 'केंद्रीय 10वीं / 12वीं भर्ती',
    eligibility: 'CHSL हेतु 12वीं पास · MTS हेतु 10वीं पास',
    officialPortal: 'ssc.gov.in',
    cycleNote2026: 'LDC, JSA, डेटा एंट्री ऑपरेटर एवं केंद्रीय कार्यालय MTS/हवलदार पदों के लिए SSC आधिकारिक कैलेंडर के अनुसार CBT।',
    defaultCbtConfig: { marksPerCorrect: 2, negativeMark: 0.5, durationMinutes: 15 },
    requiredPapers2026: [
      {
        paperCode: 'CHSL Tier-I & II',
        title: 'अंग्रेज़ी, रीजनिंग, गणित, GA व कंप्यूटर + टाइपिंग टेस्ट',
        subjects: 'Tier-I (100 Q / 200 अंक) · Tier-II मॉड्यूल I-III + Skill/Typing Test',
        questionsInfo: '100 (Tier-I) / 135 (Tier-II)',
        marksInfo: '200 (Tier-I) / 360 (Tier-II मेरिट)',
        durationMin: 60,
        negativeMarking: 'Tier-I (-0.50) · Tier-II (-1.00)'
      },
      {
        paperCode: 'MTS Session I & II',
        title: 'सिंगल-स्टेज CBT परीक्षा',
        subjects: 'Session I: गणित + रीजनिंग (बिना नेगेटिव, क्वालीफाइंग) · Session II: GA + अंग्रेज़ी (मेरिट)',
        questionsInfo: '40 + 50 = 90 प्रश्न',
        marksInfo: '120 + 150 अंक (+3 प्रति सही)',
        durationMin: 90,
        negativeMarking: 'Session I: 0 · Session II: -1 प्रति गलत'
      }
    ]
  },
  {
    id: 'ssc_gd',
    region: 'india',
    shortName: 'SSC GD Constable 2026',
    fullNameHindi: 'SSC GD कांस्टेबल (BSF, CISF, CRPF, SSB, ITBP, AR)',
    fullNameEnglish: 'SSC Constable (GD) in CAPFs & Assam Rifles 2026',
    conductingBody: 'SSC (CBT) व CAPF नोडल बल (PET/PST)',
    category: 'अर्धसैनिक बल भर्ती',
    eligibility: 'मान्यता प्राप्त बोर्ड से 10वीं (Matriculation) उत्तीर्ण',
    officialPortal: 'ssc.gov.in',
    cycleNote2026: 'कंप्यूटर आधारित परीक्षा (CBT) हिन्दी, अंग्रेज़ी व संताली सहित 13 क्षेत्रीय भाषाओं में उपलब्ध + शारीरिक दक्षता परीक्षा।',
    defaultCbtConfig: { marksPerCorrect: 2, negativeMark: 0.25, durationMinutes: 15 },
    requiredPapers2026: [
      {
        paperCode: 'Stage-I (CBT)',
        title: 'कंप्यूटर आधारित लिखित परीक्षा (80 प्रश्न)',
        subjects: 'सामान्य बुद्धिमत्ता व रीजनिंग (20), सामान्य ज्ञान (20), प्रारंभिक गणित (20), हिन्दी/अंग्रेज़ी (20)',
        questionsInfo: '80 प्रश्न',
        marksInfo: '160 अंक (+2 प्रति प्रश्न)',
        durationMin: 60,
        negativeMarking: '-0.25 प्रति गलत (आधिकारिक नवीनतम पैटर्न अनुसार)'
      },
      {
        paperCode: 'Stage-II (PET/PST/DME)',
        title: 'शारीरिक दक्षता, माप-तौल एवं चिकित्सा जांच',
        subjects: 'दौड़ (पुरुष 5 किमी / 24 मिनट · महिला 1.6 किमी / 8.5 मिनट), ऊँचाई/सीना जांच',
        questionsInfo: 'क्वालीफाइंग चरण',
        marksInfo: 'अनिवार्य अर्हता',
        durationMin: 30,
        negativeMarking: 'लागू नहीं'
      }
    ]
  },
  {
    id: 'rrb_ntpc_alp',
    region: 'india',
    shortName: 'RRB NTPC / ALP / Group-D 2026',
    fullNameHindi: 'भारतीय रेल भर्ती बोर्ड — NTPC, लोको पायलट, तकनीशियन व लेवल-1',
    fullNameEnglish: 'Railway Recruitment Board (RRB) Exams 2026',
    conductingBody: 'RRB (रेलवे भर्ती बोर्ड — राँची, कोलकाता आदि)',
    category: 'भारतीय रेल भर्ती',
    eligibility: '10वीं+ITI (ALP/Group-D), 12वीं व स्नातक (NTPC)',
    officialPortal: 'rrbcdg.gov.in / rrbranchi.gov.in',
    cycleNote2026: 'कैलेंडर चक्र अनुसार स्टेशन मास्टर, गुड्स ट्रेन मैनेजर, ALP, तकनीशियन व ग्रुप-D पदों के लिए CBT-1, CBT-2 व CBAT।',
    defaultCbtConfig: { marksPerCorrect: 1, negativeMark: 0.33, durationMinutes: 15 },
    requiredPapers2026: [
      {
        paperCode: 'NTPC CBT-1 / CBT-2',
        title: 'गणित, सामान्य बुद्धिमत्ता एवं सामान्य जागरूकता',
        subjects: 'CBT-1: 100 Q (90 मिनट) · CBT-2: 120 Q (GA 50, गणित 35, रीजनिंग 35)',
        questionsInfo: '100 / 120 प्रश्न',
        marksInfo: '100 / 120 अंक',
        durationMin: 90,
        negativeMarking: '1/3 (-0.33 प्रति गलत)'
      },
      {
        paperCode: 'ALP CBT-2 (Part A & B)',
        title: 'गणित, बेसिक साइंस व इंजीनियरिंग + संबंधित ट्रेड टेस्ट',
        subjects: 'Part A (100 Q मेरिट) · Part B (75 Q संबंधित ITI/इंजीनियरिंग ट्रेड — 35% क्वालीफाइंग)',
        questionsInfo: '100 + 75 प्रश्न',
        marksInfo: '100 मेरिट + 75 क्वालीफाइंग',
        durationMin: 150,
        negativeMarking: '1/3 प्रति गलत'
      }
    ]
  },
  {
    id: 'ibps_sbi_po',
    region: 'india',
    shortName: 'IBPS & SBI PO / Clerk 2026',
    fullNameHindi: 'बैंकिंग परीक्षा — IBPS PO/Clerk, SBI PO/Clerk व RRB ग्रामीण बैंक',
    fullNameEnglish: 'IBPS & SBI Banking Examinations 2026',
    conductingBody: 'IBPS / भारतीय स्टेट बैंक (SBI)',
    category: 'बैंकिंग एवं वित्तीय संस्थान',
    eligibility: 'किसी भी मान्यता प्राप्त विश्वविद्यालय से स्नातक',
    officialPortal: 'ibps.in / sbi.co.in',
    cycleNote2026: 'IBPS वार्षिक कैलेंडर 2026 एवं SBI भर्ती के अंतर्गत प्रारंभिक (Prelims), मुख्य (Mains) व PO साक्षात्कार चरण।',
    defaultCbtConfig: { marksPerCorrect: 1, negativeMark: 0.25, durationMinutes: 15 },
    requiredPapers2026: [
      {
        paperCode: 'Bank Prelims',
        title: 'English Language, Quantitative Aptitude & Reasoning',
        subjects: 'English (30 Q), Numerical/Quant (35 Q), Reasoning (35 Q) — अनुभागीय समय (20-20-20 मिनट)',
        questionsInfo: '100 प्रश्न',
        marksInfo: '100 अंक',
        durationMin: 60,
        negativeMarking: '1/4 (-0.25 प्रति गलत)'
      },
      {
        paperCode: 'Bank Mains + Descriptive',
        title: 'Reasoning & Computer, Banking/GA, English व Data Interpretation',
        subjects: 'वस्तुनिष्ठ (155 Q / 200 अंक) + PO हेतु Descriptive (Letter & Essay - 25 अंक)',
        questionsInfo: '155 वस्तुनिष्ठ + 2 निबंध/पत्र',
        marksInfo: '200 + 25 अंक',
        durationMin: 210,
        negativeMarking: '1/4 (-0.25 प्रति गलत)'
      }
    ]
  },
  {
    id: 'ugc_net',
    region: 'india',
    shortName: 'UGC-NET / JRF 2026',
    fullNameHindi: 'विश्वविद्यालय अनुदान आयोग — सहायक प्राध्यापक व JRF (संताली विषय कोड सहित)',
    fullNameEnglish: 'UGC-NET / JRF June & December 2026',
    conductingBody: 'NTA (राष्ट्रीय परीक्षा एजेंसी)',
    category: 'उच्च शिक्षा एवं शोध पात्रता',
    eligibility: 'स्नातकोत्तर (Master Degree — न्यूनतम 55% / आरक्षित वर्ग 50%)',
    officialPortal: 'ugcnet.nta.ac.in',
    cycleNote2026: 'जून व दिसंबर चक्र में JRF, Assistant Professor व Ph.D. प्रवेश हेतु एकल 3-घंटे की बिना नेगेटिव मार्किंग CBT परीक्षा।',
    defaultCbtConfig: { marksPerCorrect: 2, negativeMark: 0, durationMinutes: 20 },
    requiredPapers2026: [
      {
        paperCode: 'Paper I (General)',
        title: 'शिक्षण एवं शोध अभिवृत्ति (Teaching & Research Aptitude)',
        subjects: 'शिक्षण, शोध, बोधगम्यता, संप्रेषण, गणितीय तर्क, DI, ICT, लोक-पर्यावरण, उच्च शिक्षा प्रणाली',
        questionsInfo: '50 प्रश्न',
        marksInfo: '100 अंक (+2 प्रति प्रश्न)',
        durationMin: 60,
        negativeMarking: 'कोई नेगेटिव मार्किंग नहीं (0)'
      },
      {
        paperCode: 'Paper II (Subject / Santali)',
        title: 'संताली / संबंधित स्नातकोत्तर विषय (विषय कोड 95 संताली)',
        subjects: 'ओल चिकी, संताली भाषा विज्ञान, लोक साहित्य, आधुनिक काव्य-नाटक, सांस्कृतिक परंपरा व इतिहास',
        questionsInfo: '100 प्रश्न',
        marksInfo: '200 अंक (+2 प्रति प्रश्न)',
        durationMin: 120,
        negativeMarking: 'कोई नेगेटिव मार्किंग नहीं (0)'
      }
    ]
  },
  {
    id: 'ctet',
    region: 'india',
    shortName: 'CTET 2026 (CBSE)',
    fullNameHindi: 'केंद्रीय शिक्षक पात्रता परीक्षा (प्राथमिक एवं उच्च प्राथमिक)',
    fullNameEnglish: 'Central Teacher Eligibility Test (CTET) 2026',
    conductingBody: 'CBSE (केंद्रीय माध्यमिक शिक्षा बोर्ड)',
    category: 'केंद्रीय शिक्षक पात्रता',
    eligibility: '12वीं/स्नातक + D.El.Ed. / B.Ed.',
    officialPortal: 'ctet.nic.in',
    cycleNote2026: 'KVS, NVS, EMRS एवं केंद्रीय विद्यालयों में कक्षा 1–5 (Paper I) व 6–8 (Paper II) शिक्षक पात्रता हेतु।',
    defaultCbtConfig: { marksPerCorrect: 1, negativeMark: 0, durationMinutes: 15 },
    requiredPapers2026: [
      {
        paperCode: 'Paper I (Class 1–5)',
        title: 'बाल विकास, भाषा-I, भाषा-II, गणित व पर्यावरण अध्ययन',
        subjects: 'CDP (30), Language-I (30), Language-II (30), Mathematics (30), EVS (30)',
        questionsInfo: '150 प्रश्न',
        marksInfo: '150 अंक (क्वालीफाइंग 60% / आरक्षित 55%)',
        durationMin: 150,
        negativeMarking: 'कोई नेगेटिव मार्किंग नहीं (0)'
      },
      {
        paperCode: 'Paper II (Class 6–8)',
        title: 'बाल विकास, भाषा-I, भाषा-II, गणित-विज्ञान या सामाजिक अध्ययन',
        subjects: 'CDP (30), Lang-I (30), Lang-II (30), Maths & Science या Social Studies (60)',
        questionsInfo: '150 प्रश्न',
        marksInfo: '150 अंक',
        durationMin: 150,
        negativeMarking: 'कोई नेगेटिव मार्किंग नहीं (0)'
      }
    ]
  },
  {
    id: 'nda_cds',
    region: 'india',
    shortName: 'UPSC NDA & CDS 2026',
    fullNameHindi: 'रक्षा सेवा परीक्षा — NDA/NA एवं CDS (थल, जल, वायु सेना अधिकारी)',
    fullNameEnglish: 'UPSC NDA & NA / CDS (I & II) 2026',
    conductingBody: 'UPSC (लिखित) एवं SSB (सेवा चयन बोर्ड)',
    category: 'रक्षा एवं सशस्त्र बल अधिकारी',
    eligibility: 'NDA: 12वीं (अविवाहित) · CDS: स्नातक',
    officialPortal: 'upsc.gov.in',
    cycleNote2026: 'वर्ष में दो बार (NDA/CDS I एवं II) आयोजित लिखित परीक्षा व 5-दिवसीय SSB साक्षात्कार।',
    defaultCbtConfig: { marksPerCorrect: 2.5, negativeMark: 0.83, durationMinutes: 20 },
    requiredPapers2026: [
      {
        paperCode: 'NDA Paper I & II',
        title: 'Mathematics (300 अंक) + GAT (अंग्रेज़ी व सामान्य ज्ञान 600 अंक)',
        subjects: 'त्रिकोणमिति, कलन, बीजगणित, भौतिकी, रसायन, इतिहास, भूगोल, करंट अफेयर्स',
        questionsInfo: '120 (Math) + 150 (GAT) प्रश्न',
        marksInfo: '900 अंक + 900 SSB',
        durationMin: 300,
        negativeMarking: '1/3 नेगेटिव मार्किंग'
      },
      {
        paperCode: 'CDS (IMA/INA/AFA/OTA)',
        title: 'English (100), General Knowledge (100) व Elementary Maths (100)',
        subjects: 'OTA के लिए केवल English + GK; IMA/INA/AFA के लिए तीनों पेपर अनिवार्य',
        questionsInfo: '100–120 प्रश्न प्रति पेपर',
        marksInfo: '300 अंक (OTA: 200)',
        durationMin: 120,
        negativeMarking: '1/3 नेगेटिव मार्किंग'
      }
    ]
  },
  {
    id: 'cuet_neet_gate',
    region: 'india',
    shortName: 'CUET / NEET / GATE 2026',
    fullNameHindi: 'राष्ट्रीय प्रवेश परीक्षाएँ — CUET-UG, NEET-UG एवं GATE',
    fullNameEnglish: 'CUET-UG, NEET-UG & GATE 2026',
    conductingBody: 'NTA / IIT-IISc',
    category: 'विश्वविद्यालय / मेडिकल / अभियांत्रिकी प्रवेश',
    eligibility: '12वीं विज्ञान/कला/वाणिज्य (CUET/NEET) · B.Tech/M.Sc (GATE)',
    officialPortal: 'exams.nta.ac.in / gate2026',
    cycleNote2026: 'केंद्रीय विश्वविद्यालय प्रवेश (CUET), MBBS/BDS (NEET) एवं M.Tech/PSU भर्ती (GATE) हेतु राष्ट्रीय मानक पैटर्न।',
    defaultCbtConfig: { marksPerCorrect: 4, negativeMark: 1, durationMinutes: 20 },
    requiredPapers2026: [
      {
        paperCode: 'CUET-UG (NTA)',
        title: 'Languages, Domain Subjects एवं General Test',
        subjects: 'भाषा खंड, NCERT कक्षा 12 विषय (डोमेन) एवं सामान्य अभिरुचि परीक्षण',
        questionsInfo: '50 प्रश्न प्रति पेपर (50 अनिवार्य या पैटर्न अनुसार)',
        marksInfo: '250 अंक प्रति पेपर (+5/-1)',
        durationMin: 60,
        negativeMarking: '-1 प्रति गलत (+5 प्रति सही)'
      },
      {
        paperCode: 'NEET-UG / GATE',
        title: 'NEET: Physics, Chemistry, Biology (180Q / 720 अंक) · GATE: Engg/Aptitude (65Q / 100 अंक)',
        subjects: 'NEET (+4/-1, 180 मिनट) · GATE (15 अंक General Aptitude + 85 अंक Core Branch)',
        questionsInfo: '180 (NEET) / 65 (GATE)',
        marksInfo: '720 (NEET) / 100 (GATE)',
        durationMin: 180,
        negativeMarking: 'NEET (-1) · GATE MCQ (1/3 या 2/3)'
      }
    ]
  },

  // =========================================================================
  // 🌿 JHARKHAND STATE COMPETITIVE EXAMS 2026 (10 REAL STATE EXAMS)
  // =========================================================================
  {
    id: 'jpsc_ccs',
    region: 'jharkhand',
    shortName: 'JPSC Civil Services 2026',
    fullNameHindi: 'झारखंड लोक सेवा आयोग — संयुक्त सिविल सेवा परीक्षा (डिप्टी कलेक्टर / DSP)',
    fullNameEnglish: 'JPSC Combined Civil Services Examination 2026',
    conductingBody: 'JPSC (झारखंड लोक सेवा आयोग, राँची)',
    category: 'झारखंड राज्य सिविल सेवा (प्रशासनिक/पुलिस)',
    eligibility: 'किसी भी मान्यता प्राप्त विश्वविद्यालय से स्नातक (Graduation)',
    officialPortal: 'jpsc.gov.in',
    cycleNote2026: 'प्रारंभिक (Prelims Paper I & II — कोई नेगेटिव मार्किंग नहीं), मुख्य परीक्षा (6 पेपर) एवं 100 अंकों के साक्षात्कार पर आधारित चयन।',
    defaultCbtConfig: { marksPerCorrect: 2, negativeMark: 0, durationMinutes: 20 },
    requiredPapers2026: [
      {
        paperCode: 'Prelims Paper I',
        title: 'सामान्य अध्ययन-I (भारत व सामान्य विज्ञान/झारखंड)',
        subjects: 'भारतीय इतिहास (15), भूगोल (10), राजव्यवस्था (10), अर्थव्यवस्था (10), विज्ञान/प्रौद्योगिकी (15), झारखंड GK (10), करंट (15), विविध (15)',
        questionsInfo: '100 प्रश्न (MCQ)',
        marksInfo: '200 अंक',
        durationMin: 120,
        negativeMarking: 'कोई नेगेटिव मार्किंग नहीं (0)'
      },
      {
        paperCode: 'Prelims Paper II',
        title: 'झारखंड विशेष सामान्य अध्ययन (100% झारखंड)',
        subjects: 'झारखंड का इतिहास (8), आंदोलन (7), विशिष्ट पहचान (5), साहित्य-लोकनृत्य (5), भाषा-साहित्य (5), शिक्षण संस्थान/खेल (8), CNT/SPT भूमि कानून (12), आर्थिक विकास/पर्यावरण/योजना (50)',
        questionsInfo: '100 प्रश्न (MCQ)',
        marksInfo: '200 अंक',
        durationMin: 120,
        negativeMarking: 'कोई नेगेटिव मार्किंग नहीं (0)'
      },
      {
        paperCode: 'Mains Papers I–VI',
        title: '6 वर्णनात्मक मुख्य पेपर + 100 अंक साक्षात्कार',
        subjects: 'Paper I (हिन्दी-अंग्रेज़ी क्वालीफाइंग), Paper II (संताली/हिन्दी/क्षेत्रीय भाषा साहित्य 150 अंक), Paper III–VI (इतिहास-भूगोल, राजव्यवस्था, अर्थव्यवस्था, विज्ञान — 200×4 = 800 अंक)',
        questionsInfo: '6 वर्णनात्मक पेपर',
        marksInfo: '950 मेरिट + 100 साक्षात्कार = 1050 कुल',
        durationMin: 180,
        negativeMarking: 'लागू नहीं'
      }
    ]
  },
  {
    id: 'jssc_cgl',
    region: 'jharkhand',
    shortName: 'JSSC CGL 2026 (JGGLCCE)',
    fullNameHindi: 'झारखंड कर्मचारी चयन आयोग — संयुक्त स्नातक स्तरीय (ASO / BSO / प्रखंड अधिकारी)',
    fullNameEnglish: 'JSSC Combined Graduate Level (JGGLCCE) 2026',
    conductingBody: 'JSSC (झारखंड कर्मचारी चयन आयोग)',
    category: 'झारखंड राज्य स्नातक स्तरीय सेवा',
    eligibility: 'स्नातक + झारखंड राज्य की क्षेत्रीय/जनजातीय भाषा का ज्ञान',
    officialPortal: 'jssc.nic.in',
    cycleNote2026: 'एक दिवसीय 3-पाली मुख्य परीक्षा प्रणाली (Paper 1 क्वालीफाइंग; Paper 2 संताली/क्षेत्रीय भाषा + Paper 3 सामान्य ज्ञान मेरिट बनाते हैं)।',
    defaultCbtConfig: { marksPerCorrect: 3, negativeMark: 1, durationMinutes: 20 },
    requiredPapers2026: [
      {
        paperCode: 'Paper 1 (Qualifying)',
        title: 'भाषा ज्ञान (हिन्दी 60 प्रश्न + अंग्रेज़ी 60 प्रश्न)',
        subjects: 'अनुच्छेद व व्याकरण आधारित प्रश्न (मेरिट में अंक नहीं जुड़ते, न्यूनतम 30% अनिवार्य)',
        questionsInfo: '120 प्रश्न',
        marksInfo: '360 अंक (30% क्वालीफाइंग)',
        durationMin: 120,
        negativeMarking: '-1 प्रति गलत (+3 प्रति सही)'
      },
      {
        paperCode: 'Paper 2 (मेरिट)',
        title: 'जनजातीय एवं क्षेत्रीय भाषा (संताली / हिन्दी / हो / मुंडारी / नागपुरी / खोरठा आदि)',
        subjects: 'संताली व्याकरण, ओल चिकी व देवनागरी साहित्य, लोकगीत, मुहावरे, लोककथाएँ एवं प्रमुख संताली लेखक',
        questionsInfo: '100 प्रश्न',
        marksInfo: '300 अंक (मेरिट में जुड़ेगा)',
        durationMin: 120,
        negativeMarking: '-1 प्रति गलत (+3 प्रति सही)'
      },
      {
        paperCode: 'Paper 3 (मेरिट)',
        title: 'सामान्य ज्ञान (सामान्य अध्ययन, विज्ञान, गणित, रीजनिंग, कंप्यूटर व झारखंड GK)',
        subjects: 'सामान्य अध्ययन (30), सामान्य विज्ञान (20), सामान्य गणित (20), मानसिक क्षमता (20), कंप्यूटर (20), झारखंड राज्य ज्ञान (40)',
        questionsInfo: '150 प्रश्न',
        marksInfo: '450 अंक (कुल मेरिट: 300+450 = 750)',
        durationMin: 120,
        negativeMarking: '-1 प्रति गलत (+3 प्रति सही)'
      }
    ]
  },
  {
    id: 'jssc_excise_police',
    region: 'jharkhand',
    shortName: 'JSSC Excise & Jharkhand Police 2026',
    fullNameHindi: 'झारखंड उत्पाद सिपाही एवं झारखंड जिला पुलिस आरक्षी भर्ती',
    fullNameEnglish: 'JSSC Excise Constable & Jharkhand Police Constable 2026',
    conductingBody: 'JSSC (झारखंड कर्मचारी चयन आयोग)',
    category: 'झारखंड पुलिस एवं उत्पाद सुरक्षा बल',
    eligibility: '10वीं (मैट्रिक) उत्तीर्ण एवं निर्धारित शारीरिक मानदंड',
    officialPortal: 'jssc.nic.in',
    cycleNote2026: '3-चरणीय प्रक्रिया: (1) शारीरिक दक्षता परीक्षा (दौड़ व माप-तौल), (2) मेडिकल जांच एवं (3) OMR/CBT लिखित परीक्षा।',
    defaultCbtConfig: { marksPerCorrect: 3, negativeMark: 1, durationMinutes: 15 },
    requiredPapers2026: [
      {
        paperCode: 'Stage 1 (PET/PST)',
        title: 'शारीरिक दक्षता दौड़ एवं ऊँचाई/सीना परीक्षण',
        subjects: 'दौड़ व शारीरिक मानक (क्वालीफाइंग होने पर ही लिखित परीक्षा की पात्रता)',
        questionsInfo: 'क्वालीफाइंग चरण',
        marksInfo: 'अनिवार्य अर्हता',
        durationMin: 60,
        negativeMarking: 'लागू नहीं'
      },
      {
        paperCode: 'Paper 1 (क्षेत्रीय/जनजातीय भाषा)',
        title: 'संताली / हिन्दी / खोरठा / नागपुरी / मुंडारी / हो / कुड़ुख़',
        subjects: 'व्याकरण, शब्दावली, लोक संस्कृति व साहित्य से बहुविकल्पीय प्रश्न',
        questionsInfo: '100 प्रश्न',
        marksInfo: '300 अंक (मेरिट आधारित)',
        durationMin: 120,
        negativeMarking: '-1 प्रति गलत (+3 प्रति सही)'
      },
      {
        paperCode: 'Paper 2 (सामान्य ज्ञान व संख्यात्मक)',
        title: 'हिन्दी भाषा (50 Q) + सामान्य ज्ञान (25 Q) + संख्यात्मक/गणित (25 Q)',
        subjects: 'व्याकरण, झारखंड व भारत सामान्य ज्ञान एवं बुनियादी अंकगणित',
        questionsInfo: '100 प्रश्न',
        marksInfo: '300 अंक',
        durationMin: 120,
        negativeMarking: '-1 प्रति गलत (+3 प्रति सही)'
      }
    ]
  },
  {
    id: 'jtet',
    region: 'jharkhand',
    shortName: 'JTET 2026 (JAC)',
    fullNameHindi: 'झारखंड शिक्षक पात्रता परीक्षा (कक्षा 1–5 व 6–8)',
    fullNameEnglish: 'Jharkhand Teacher Eligibility Test (JTET) 2026',
    conductingBody: 'JAC (झारखंड अधिविद्य परिषद्, राँची)',
    category: 'झारखंड राज्य शिक्षक पात्रता',
    eligibility: '12वीं/स्नातक + D.El.Ed. / B.Ed.',
    officialPortal: 'jac.jharkhand.gov.in',
    cycleNote2026: 'नियमावली अनुसार Paper I (प्राथमिक 1–5) व Paper II (उच्च प्राथमिक 6–8) में संताली सहित क्षेत्रीय भाषा अनिवार्य खंड।',
    defaultCbtConfig: { marksPerCorrect: 1, negativeMark: 0, durationMinutes: 15 },
    requiredPapers2026: [
      {
        paperCode: 'JTET Level 1 (1–5)',
        title: 'CDP, भाषा-I (हिन्दी/अंग्रेज़ी), भाषा-II (संताली/क्षेत्रीय), गणित व EVS',
        subjects: 'बाल विकास व शिक्षण शास्त्र, क्षेत्रीय भाषा, गणित व पर्यावरण अध्ययन',
        questionsInfo: '200 प्रश्न (नियमावली अनुसार)',
        marksInfo: '200 अंक (बिना नेगेटिव मार्किंग)',
        durationMin: 150,
        negativeMarking: 'कोई नेगेटिव मार्किंग नहीं (0)'
      },
      {
        paperCode: 'JTET Level 2 (6–8)',
        title: 'CDP, भाषा-I, क्षेत्रीय भाषा (संताली आदि) व विषय-विशेष (गणित-विज्ञान / SST / भाषा शिक्षक)',
        subjects: 'स्नातक प्रशिक्षित शिक्षक पात्रता के लिए विषय विशिष्ट ज्ञान एवं शिक्षाशास्त्र',
        questionsInfo: '250 प्रश्न (नियमावली अनुसार)',
        marksInfo: '250 अंक',
        durationMin: 180,
        negativeMarking: 'कोई नेगेटिव मार्किंग नहीं (0)'
      }
    ]
  },
  {
    id: 'jssc_pgt_tgt',
    region: 'jharkhand',
    shortName: 'JSSC PGT / TGT / सहायक आचार्य 2026',
    fullNameHindi: 'झारखंड उच्च व +2 विद्यालय शिक्षक एवं सहायक आचार्य भर्ती',
    fullNameEnglish: 'JSSC PGT / TGT & Sahayak Acharya 2026',
    conductingBody: 'JSSC (झारखंड कर्मचारी चयन आयोग)',
    category: 'झारखंड विद्यालय शिक्षक भर्ती',
    eligibility: 'स्नातकोत्तर + B.Ed. (PGT) · स्नातक/12वीं + D.El.Ed./B.Ed. + JTET/CTET (सहायक आचार्य)',
    officialPortal: 'jssc.nic.in',
    cycleNote2026: 'पेपर 1 क्वालीफाइंग (सामान्य ज्ञान व भाषा) एवं विषय-विशिष्ट पेपर के मेरिट अंकों के आधार पर चयन।',
    defaultCbtConfig: { marksPerCorrect: 2, negativeMark: 0, durationMinutes: 20 },
    requiredPapers2026: [
      {
        paperCode: 'Paper 1 (Qualifying)',
        title: 'सामान्य ज्ञान व हिन्दी भाषा ज्ञान (33% अर्हक)',
        subjects: 'झारखंड सामान्य ज्ञान, भारत GK, कंप्यूटर, तार्किक क्षमता व हिन्दी अनुच्छेद',
        questionsInfo: '100 प्रश्न',
        marksInfo: '100 अंक (क्वालीफाइंग)',
        durationMin: 180,
        negativeMarking: 'नहीं (अधिसूचना के अनुसार)'
      },
      {
        paperCode: 'Paper 2 (Subject Merit)',
        title: 'संताली / इतिहास / भौतिकी / गणित / हिन्दी / वाणिज्य आदि विषय पेपर',
        subjects: 'चयनित विषय का गहन स्नातकोत्तर / स्नातक स्तरीय पाठ्यक्रम',
        questionsInfo: '150 प्रश्न (300 अंक)',
        marksInfo: '300 अंक (+2 प्रति प्रश्न)',
        durationMin: 180,
        negativeMarking: 'नहीं (अधिसूचना के अनुसार)'
      }
    ]
  },
  {
    id: 'jssc_ldc_panchayat',
    region: 'jharkhand',
    shortName: 'JSSC Inter Clerk / Panchayat 2026',
    fullNameHindi: 'JSSC इंटरमीडिएट स्तर — निम्नवर्गीय लिपिक (LDC), पंचायत सचिव व स्टेनोग्राफर',
    fullNameEnglish: 'JSSC Intermediate Level (JICKCE) Clerk & Steno 2026',
    conductingBody: 'JSSC (झारखंड कर्मचारी चयन आयोग)',
    category: 'झारखंड सचिवालय एवं समाहरणालय लिपिकीय सेवा',
    eligibility: 'मान्यता प्राप्त बोर्ड से 10+2 (इंटरमीडिएट) + कंप्यूटर टाइपिंग ज्ञान',
    officialPortal: 'jssc.nic.in',
    cycleNote2026: '3 मुख्य लिखित पेपर (Paper 1 क्वालीफाइंग, Paper 2 क्षेत्रीय भाषा, Paper 3 झारखंड GK व कंप्यूटर टंकण आधारित प्रश्न) + टाइपिंग स्किल टेस्ट।',
    defaultCbtConfig: { marksPerCorrect: 3, negativeMark: 1, durationMinutes: 15 },
    requiredPapers2026: [
      {
        paperCode: 'Paper 1 (हिन्दी + अंग्रेज़ी)',
        title: 'भाषा ज्ञान (120 प्रश्न · 30% क्वालीफाइंग)',
        subjects: 'हिन्दी (60) + अंग्रेज़ी (60)',
        questionsInfo: '120 प्रश्न',
        marksInfo: '360 अंक',
        durationMin: 120,
        negativeMarking: '-1 प्रति गलत (+3 सही)'
      },
      {
        paperCode: 'Paper 2 & Paper 3 (मेरिट)',
        title: 'क्षेत्रीय भाषा (100 Q) + सामान्य ज्ञान, झारखंड GK व कंप्यूटर टंकण (120 Q)',
        subjects: 'Paper 3: भारत सामान्य अध्ययन (30), झारखंड ज्ञान (40), कंप्यूटर ज्ञान व टंकण (50)',
        questionsInfo: '100 + 120 प्रश्न',
        marksInfo: '300 + 360 = 660 मेरिट अंक',
        durationMin: 240,
        negativeMarking: '-1 प्रति गलत (+3 सही)'
      }
    ]
  },
  {
    id: 'jpsc_cdpo_fro',
    region: 'jharkhand',
    shortName: 'JPSC CDPO & Forest Officer 2026',
    fullNameHindi: 'JPSC बाल विकास परियोजना पदाधिकारी (CDPO) एवं वन क्षेत्र पदाधिकारी (FRO/ACF)',
    fullNameEnglish: 'JPSC CDPO & Forest Range Officer / ACF 2026',
    conductingBody: 'JPSC (झारखंड लोक सेवा आयोग)',
    category: 'झारखंड राजपत्रित अधिकारी (महिला विकास / वन सेवा)',
    eligibility: 'स्नातक (FRO/ACF हेतु विज्ञान/वानिकी/अभियांत्रिकी विषय)',
    officialPortal: 'jpsc.gov.in',
    cycleNote2026: 'प्रारंभिक (वस्तुनिष्ठ), मुख्य लिखित परीक्षा, (FRO/ACF हेतु शारीरिक परीक्षण) एवं साक्षात्कार।',
    defaultCbtConfig: { marksPerCorrect: 2, negativeMark: 0, durationMinutes: 15 },
    requiredPapers2026: [
      {
        paperCode: 'CDPO Prelims (I & II)',
        title: 'सामान्य अध्ययन-I (100 अंक) व सामान्य अध्ययन-II (100 अंक)',
        subjects: 'भारत व झारखंड इतिहास, भूगोल, राजव्यवस्था, अर्थव्यवस्था, राज्य-केंद्र कल्याण योजनाएँ',
        questionsInfo: '100 + 100 प्रश्न',
        marksInfo: '200 अंक',
        durationMin: 240,
        negativeMarking: 'कोई नेगेटिव मार्किंग नहीं (0)'
      },
      {
        paperCode: 'FRO / ACF Prelims',
        title: 'सामान्य अध्ययन एवं सामान्य विज्ञान / वानिकी अभिरुचि',
        subjects: 'झारखंड वन संसाधन, पर्यावरण, जैव विविधता, सामान्य अध्ययन व विज्ञान',
        questionsInfo: '150 प्रश्न (अधिसूचना अनुसार)',
        marksInfo: '150–300 अंक',
        durationMin: 120,
        negativeMarking: 'अधिसूचना अनुसार'
      }
    ]
  },
  {
    id: 'jssc_municipal_tech',
    region: 'jharkhand',
    shortName: 'JSSC JE / Municipal / Technical 2026',
    fullNameHindi: 'JSSC कनीय अभियंता (डिप्लोमा JE), नगरपालिका सेवा एवं औद्योगिक प्रशिक्षण अधिकारी',
    fullNameEnglish: 'JSSC Diploma JE, Municipal & Technical Services 2026',
    conductingBody: 'JSSC (झारखंड कर्मचारी चयन आयोग)',
    category: 'झारखंड तकनीकी एवं अभियंत्रण सेवा',
    eligibility: 'सिविल/मैकेनिकल/इलेक्ट्रिकल डिप्लोमा / B.Tech / ITI+NCVT / संबंधित स्नातक',
    officialPortal: 'jssc.nic.in',
    cycleNote2026: 'सामान्य अभियांत्रिकी + विशिष्ट ट्रेड/शाखा विषय + झारखंड राज्य सामान्य ज्ञान व कंप्यूटर।',
    defaultCbtConfig: { marksPerCorrect: 3, negativeMark: 1, durationMinutes: 15 },
    requiredPapers2026: [
      {
        paperCode: 'JDLCCE Paper I',
        title: 'सामान्य अभियांत्रिकी (80 Q) एवं सामान्य ज्ञान (40 Q)',
        subjects: 'सिविल, इलेक्ट्रिकल, मैकेनिकल बुनियादी सिद्धांत + झारखंड GK व सामान्य विज्ञान/रीजनिंग',
        questionsInfo: '120 प्रश्न',
        marksInfo: '360 अंक',
        durationMin: 120,
        negativeMarking: '-1 प्रति गलत (+3 सही)'
      },
      {
        paperCode: 'JDLCCE Paper II',
        title: 'संबंधित इंजीनियरिंग शाखा (Civil / Electrical / Mechanical)',
        subjects: 'कोर तकनीकी विषय (120 वस्तुनिष्ठ प्रश्न)',
        questionsInfo: '120 प्रश्न',
        marksInfo: '360 अंक',
        durationMin: 120,
        negativeMarking: '-1 प्रति गलत (+3 सही)'
      }
    ]
  },
  {
    id: 'jhc_assistant',
    region: 'jharkhand',
    shortName: 'Jharkhand High Court Assistant 2026',
    fullNameHindi: 'झारखंड उच्च न्यायालय — सहायक (Assistant), क्लर्क एवं टाइपिस्ट भर्ती',
    fullNameEnglish: 'High Court of Jharkhand Assistant / Clerk Recruitment 2026',
    conductingBody: 'झारखंड उच्च न्यायालय, राँची (धुर्वा)',
    category: 'झारखंड न्यायिक प्रशासनिक सेवा',
    eligibility: 'किसी भी मान्यता प्राप्त विश्वविद्यालय से स्नातक + कंप्यूटर दक्षता (DCA)',
    officialPortal: 'jharkhandhighcourt.nic.in',
    cycleNote2026: 'लिखित परीक्षा (अंग्रेज़ी, सामान्य ज्ञान व रीजनिंग), कंप्यूटर टाइपिंग टेस्ट व मौखिक साक्षात्कार।',
    defaultCbtConfig: { marksPerCorrect: 1, negativeMark: 0, durationMinutes: 15 },
    requiredPapers2026: [
      {
        paperCode: 'Written Exam (90 Marks)',
        title: 'General English, General Knowledge & Numerical/Reasoning Ability',
        subjects: 'English Grammar & Essay/Precis (30), GK & Current Affairs (30), Numerical/Reasoning (30)',
        questionsInfo: '90 अंक (लिखित)',
        marksInfo: '90 अंक (30% न्यूनतम अर्हक)',
        durationMin: 120,
        negativeMarking: 'सामान्यतः 0 (विज्ञापन अनुसार)'
      },
      {
        paperCode: 'Skill Test + Interview',
        title: 'कंप्यूटर टाइपिंग टेस्ट (20 WPM) एवं साक्षात्कार (15 अंक)',
        subjects: 'कंप्यूटर पर अंग्रेज़ी टाइपिंग (क्वालीफाइंग) + व्यक्तित्व परीक्षण',
        questionsInfo: 'टाइपिंग + साक्षात्कार',
        marksInfo: '15 अंक (साक्षात्कार)',
        durationMin: 30,
        negativeMarking: 'लागू नहीं'
      }
    ]
  },
  {
    id: 'jharkhand_anm_cho',
    region: 'jharkhand',
    shortName: 'Jharkhand ANM / GNM / CHO 2026',
    fullNameHindi: 'झारखंड स्वास्थ्य विभाग — ANM, GNM, CHO एवं पैरामेडिकल भर्ती (JCECEB / NHM / JSSC)',
    fullNameEnglish: 'Jharkhand Health Services (ANM / GNM / CHO / Paramedical) 2026',
    conductingBody: 'JSSC / JCECEB / NHM झारखंड',
    category: 'झारखंड स्वास्थ्य एवं नर्सिंग सेवा',
    eligibility: '10+2 विज्ञान + ANM/GNM/B.Sc Nursing पंजीकरण (JNRC)',
    officialPortal: 'jceceb.jharkhand.gov.in / jrhms.jharkhand.gov.in',
    cycleNote2026: 'सामुदायिक स्वास्थ्य, मातृ-शिशु देखभाल, राष्ट्रीय स्वास्थ्य कार्यक्रम एवं झारखंड स्वास्थ्य योजनाओं पर आधारित।',
    defaultCbtConfig: { marksPerCorrect: 1, negativeMark: 0.25, durationMinutes: 15 },
    requiredPapers2026: [
      {
        paperCode: 'Technical Nursing CBT',
        title: 'मातृ एवं शिशु स्वास्थ्य, सामुदायिक स्वास्थ्य, पोषण व प्राथमिक चिकित्सा',
        subjects: 'टीकाकरण अनुसूची, प्रसवपूर्व देखभाल, संक्रामक रोग नियंत्रण, आयुष्मान भारत व NHM योजनाएँ',
        questionsInfo: '50–100 प्रश्न (विज्ञापन अनुसार)',
        marksInfo: '50–100 अंक',
        durationMin: 90,
        negativeMarking: '0.25 (JCECEB) / विज्ञापन अनुसार'
      }
    ]
  }
];

export const ALL_COMPETITIVE_QUESTIONS_2026: CompetitiveQuestion[] = [
  ...INDIA_COMPETITIVE_QUESTIONS,
  ...JHARKHAND_COMPETITIVE_QUESTIONS,
  ...EXTRA_COMPETITIVE_QUESTIONS_2026
];

/**
 * Returns deterministic, zero-duplicate question set for any Exam + PaperSlot (pyq_2023/2024/2025/practice_set_1/2).
 * Prioritizes exact examIds match in that paperSlot first, then fills to targetSize (default 10) from same region & paperSlot so every paper preview is rich and authentic.
 */
export function getQuestionsForExamPaper(
  examId: string,
  paperSlot: ExamPaperSlot,
  targetSize = 10
): CompetitiveQuestion[] {
  const exam = COMPETITIVE_EXAMS_2026.find((e) => e.id === examId);
  const directMatches = ALL_COMPETITIVE_QUESTIONS_2026.filter(
    (q) => q.paperSlot === paperSlot && q.examIds.includes(examId)
  );

  const seen = new Set(directMatches.map((q) => q.id));
  const result = [...directMatches];

  if (result.length < targetSize) {
    // Secondary fill from same paperSlot matching same region or general aptitude/GS
    const regionalPrefix = exam?.region === 'jharkhand' ? 'jhk_' : 'ind_';
    const secondary = ALL_COMPETITIVE_QUESTIONS_2026.filter(
      (q) =>
        !seen.has(q.id) &&
        q.paperSlot === paperSlot &&
        (q.id.startsWith(regionalPrefix) || q.id.startsWith('ext_'))
    );
    for (const q of secondary) {
      if (result.length >= targetSize) break;
      seen.add(q.id);
      result.push(q);
    }
  }

  if (result.length < targetSize) {
    const anySlot = ALL_COMPETITIVE_QUESTIONS_2026.filter(
      (q) => !seen.has(q.id) && q.paperSlot === paperSlot
    );
    for (const q of anySlot) {
      if (result.length >= targetSize) break;
      seen.add(q.id);
      result.push(q);
    }
  }

  return result;
}
