import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  Volume2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Flag,
  Play,
  Sliders,
  AlertTriangle,
  RefreshCw,
  Search,
  BookOpen,
  FileText,
  Printer,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  ExternalLink,
  Layers,
  ArrowRight,
  BarChart3,
  Trash2,
  Download,
  Grid
} from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';
import { useAdmin } from '../context/AdminContext';
import {
  COMPETITIVE_EXAMS_2026,
  ALL_COMPETITIVE_QUESTIONS_2026,
  PAPER_SLOTS_META,
  getQuestionsForExamPaper,
  ExamRegion
} from '../data/competitiveExams2026Data';
import { ExamPaperSlot } from '../data/examQuestionsIndia2026';

export type ExamCategory =
  | 'literature'
  | 'grammar'
  | 'culture'
  | 'history'
  | 'vocabulary'
  | 'india_gk'
  | 'jharkhand_gk';

interface ExamQuestion {
  id: string;
  examTag: string;
  category: ExamCategory;
  question: string;
  santaliNote?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface MistakeBankEntry {
  id: string;
  examTag: string;
  category: ExamCategory;
  question: string;
  santaliNote?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  wrongCount: number;
  lastWrongAt: number;
}

interface SubjectStat {
  attempted: number;
  correct: number;
  wrong: number;
  timeSec: number;
}

type SubjectAnalyticsMap = Partial<Record<ExamCategory, SubjectStat>>;

const USED_Q_STORAGE_KEY = 'hor_katha_used_exam_q_ids';
const MISTAKE_BANK_STORAGE_KEY = 'hor_katha_mistake_bank';
const SUBJECT_ANALYTICS_STORAGE_KEY = 'hor_katha_exam_analytics';

const SUBJECT_LABELS_HI: Record<ExamCategory, string> = {
  india_gk: 'भारत GK (UPSC / SSC / Banking / Rail)',
  jharkhand_gk: 'झारखंड विशेष (JPSC / JSSC / CNT-SPT)',
  literature: 'संताली साहित्य व लेखक',
  grammar: 'संताली व्याकरण (रोनौड़)',
  culture: 'संताली संस्कृति व स्वशासन',
  history: 'संथाल हूल व संविधान',
  vocabulary: 'संताली शब्द-अर्थ'
};

const CURATED_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'ex_lit_01',
    examTag: 'JPSC / UGC-NET',
    category: 'literature',
    question: 'पंडित रघुनाथ मुर्मू द्वारा रचित प्रसिद्ध संताली नाटक "बिदु चांदान" किस वर्ष प्रकाशित हुआ था?',
    santaliNote: 'बिदु चांदान — ओल चिकी और संताली नाट्य साहित्य की आधारशिला',
    options: ['1936', '1942', '1948', '1954'],
    correctIndex: 1,
    explanation: '"बिदु चांदान" (Bidu Chandan) का प्रकाशन वर्ष 1942 में हुआ था। यह संताली साहित्य का एक कालजयी नाटक है।'
  },
  {
    id: 'ex_lit_02',
    examTag: 'JSSC CGL',
    category: 'literature',
    question: 'संताली भाषा की प्रथम ज्ञात पुस्तक "हॉड़ कोरेन मारे हापड़ाम को रेयाः काथा" किसके द्वारा संकलित की गई थी?',
    santaliNote: 'कोलियन हाड़ाम के मौखिक इतिहास का संकलन (1887)',
    options: ['एल. ओ. स्क्रेफस्रुड (L.O. Skrefsrud)', 'पी. ओ. बोडिंग (P.O. Bodding)', 'जे. फिलिप्स (J. Phillips)', 'डोमन साहू समीर'],
    correctIndex: 0,
    explanation: 'रेव. एल. ओ. स्क्रेफस्रुड ने गुरु कोलियन हाड़ाम से सुनकर "हॉड़ कोरेन मारे हापड़ाम को रेयाः काथा" (1887) और "पेड़ा होड़" (1890) का संकलन किया।'
  },
  {
    id: 'ex_lit_03',
    examTag: 'JPSC Mains',
    category: 'literature',
    question: '"खेरवाड़ बोंसो धोरम पुथी" किस प्रसिद्ध संताली विद्वान और लेखक की रचना है?',
    santaliNote: 'आधुनिक संताली गद्य-पद्य का गौरव ग्रंथ (1894)',
    options: ['मांझी रामदास टुडू "रस्का"', 'साधु रामचांद मुर्मू', 'नारायण सोरेन "तोड़े सुताम"', 'शारदा प्रसाद किस्कू'],
    correctIndex: 0,
    explanation: 'मांझी रामदास टुडू "रस्का" द्वारा रचित "खेरवाड़ बोंसो धोरम पुथी" (1894) संताली साहित्य व संस्कृति का अत्यंत महत्वपूर्ण ग्रंथ है।'
  },
  {
    id: 'ex_lit_04',
    examTag: 'JPSC Prelims',
    category: 'literature',
    question: 'साहित्य अकादमी पुरस्कार से सम्मानित प्रथम संताली कृति "भाबना" (काव्य संग्रह, 2005) के रचनाकार कौन हैं?',
    santaliNote: 'प्रथम संताली साहित्य अकादमी विजेता',
    options: ['जदुमणि बेसरा', 'गोमस्ता प्रसाद सोरेन', 'रूपचांद हांसदा', 'कालीचरण हेम्ब्रम'],
    correctIndex: 0,
    explanation: 'जदुमणि बेसरा को उनके संताली कविता संग्रह "भाबना" के लिए वर्ष 2005 में प्रथम संताली साहित्य अकादमी पुरस्कार मिला।'
  },
  {
    id: 'ex_lit_05',
    examTag: 'UGC-NET',
    category: 'literature',
    question: 'प्रसिद्ध संताली समाचार पत्र "होड़ सोम्बाद" (Hor Sombad) की शुरुआत 1947 में किस संपादक ने की थी?',
    santaliNote: 'देवनागरी लिपि में प्रकाशित ऐतिहासिक साप्ताहिक',
    options: ['डोमन साहू "समीर"', 'बाबूलाल मुर्मू "आदिवासी"', 'तेजनारायण मुर्मू', 'भागवत मुर्मू "ठाकुर"'],
    correctIndex: 0,
    explanation: 'डोमन साहू "समीर" (जिन्हें संताली साहित्य का भारतेंदु भी कहा जाता है) ने 1947 में "होड़ सोम्बाद" का संपादन प्रारंभ किया।'
  },
  {
    id: 'ex_lit_06',
    examTag: 'JPSC / NET',
    category: 'literature',
    question: 'पंडित रघुनाथ मुर्मू ने ओल चिकी लिपि का आविष्कार किस वर्ष किया था?',
    santaliNote: 'ओल चेमेद्, रोड़ चेमेद् — 30 मूल अक्षर',
    options: ['1915', '1925', '1938', '1945'],
    correctIndex: 1,
    explanation: 'गुरु गोमके पंडित रघुनाथ मुर्मू ने 1925 ईस्वी में संताली भाषा की वैज्ञानिक लिपि "ओल चिकी" का आविष्कार किया।'
  },
  {
    id: 'ex_lit_07',
    examTag: 'UGC-NET',
    category: 'literature',
    question: 'प्रथम रोमन संताली व्याकरण "एन इंट्रोडक्शन टू द संताल लैंग्वेज" (1852) किसने लिखा था?',
    options: ['जेरेमिया फिलिप्स (J. Phillips)', 'पी. ओ. बोडिंग', 'ए. कैंपबेल', 'डब्ल्यू. जी. आर्चर'],
    correctIndex: 0,
    explanation: 'रेव. जेरेमिया फिलिप्स ने 1852 ईस्वी में "An Introduction to the Santal Language" प्रकाशित किया था।'
  },
  {
    id: 'ex_lit_08',
    examTag: 'JSSC CGL',
    category: 'literature',
    question: '"खेरवाड़ बीर" (Kherwal Bir) और "दाड़े गे धोन" किस महान नाटककार की कृतियाँ हैं?',
    options: ['पंडित रघुनाथ मुर्मू', 'साधु रामचांद मुर्मू', 'गोराचंद टुडू', 'हरिहर हांसदा'],
    correctIndex: 0,
    explanation: '"खेरवाड़ बीर" और "दाड़े गे धोन" दोनों ही गुरु गोमके पंडित रघुनाथ मुर्मू द्वारा रचित प्रसिद्ध नाटक व साहित्यिक कृतियाँ हैं।'
  },
  {
    id: 'ex_lit_09',
    examTag: 'JPSC / NET',
    category: 'literature',
    question: 'पाँच खंडों वाला प्रसिद्ध "A Santal Dictionary" (1929–1936) किस विद्वान द्वारा संपादित किया गया?',
    options: ['पी. ओ. बोडिंग (P.O. Bodding)', 'एल. ओ. स्क्रेफस्रुड', 'कैम्पबेल', 'मार्टिन ओरांव'],
    correctIndex: 0,
    explanation: 'पॉल ओलाफ बोडिंग (P.O. Bodding) ने संताली-अंग्रेज़ी का सबसे विस्तृत 5-खंडीय शब्दकोश व लोककथा संग्रह तैयार किया।'
  },
  {
    id: 'ex_lit_10',
    examTag: 'JTET / JSSC',
    category: 'literature',
    question: 'साधु रामचांद मुर्मू किस प्रसिद्ध काव्य व आध्यात्मिक रचना के रचयिता माने जाते हैं?',
    options: ['सारी धोरम सेरेञ पुथी', 'सिदो-कान्हू हूल', 'मांझी थान कथा', 'सोहराय गाथा'],
    correctIndex: 0,
    explanation: 'कवि साधु रामचांद मुर्मू "सारी धोरम सेरेञ पुथी" और "लिता गोडेत" जैसी उत्कृष्ट भक्ति व लोक-काव्य कृतियों के रचयिता हैं।'
  },
  {
    id: 'ex_lit_11',
    examTag: 'JPSC',
    category: 'literature',
    question: 'महिला लेखिका निर्मला पुतुल किस भाषा और विषय की चर्चित कवयित्री हैं?',
    options: ['संताली और हिन्दी आदिवासी जीवन-संघर्ष', 'भोजपुरी लोकगीत', 'मैथिली व्याकरण', 'कुड़ुख़ उपन्यास'],
    correctIndex: 0,
    explanation: 'दुमका (झारखंड) की निर्मला पुतुल संताली व हिन्दी में आदिवासी महिलाओं के जीवन व प्रकृति पर सशक्त लेखन करती हैं।'
  },
  {
    id: 'ex_grm_01',
    examTag: 'JTET / JSSC',
    category: 'grammar',
    question: 'संताली व्याकरण में "आबो" (Abo) और "आले" (Ale) सर्वनामों के बीच मुख्य अंतर क्या है?',
    santaliNote: 'समावेशी (Inclusive) बनाम अपवर्जक (Exclusive)',
    options: [
      'आबो में श्रोता शामिल होता है, आले में श्रोता शामिल नहीं होता',
      'आबो एकवचन है और आले द्विवचन है',
      'आबो केवल स्त्रियों के लिए और आले पुरुषों के लिए प्रयुक्त होता है',
      'दोनों का अर्थ बिल्कुल समान है'
    ],
    correctIndex: 0,
    explanation: '"आबो" (हम सब - श्रोता सहित) समावेशी बहुवचन है, जबकि "आले" (हम लोग - श्रोता को छोड़कर) अपवर्जक बहुवचन है।'
  },
  {
    id: 'ex_grm_02',
    examTag: 'UGC-NET',
    category: 'grammar',
    question: 'संताली भाषा किस भाषा-परिवार से संबंधित है?',
    santaliNote: 'ऑस्ट्रो-एशियाटिक (मुंडा उप-शाखा)',
    options: ['द्रविड़ भाषा-परिवार', 'इंडो-आर्यन परिवार', 'ऑस्ट्रो-एशियाटिक (मुंडा शाखा)', 'चीनी-तिब्ती परिवार'],
    correctIndex: 2,
    explanation: 'संताली ऑस्ट्रो-एशियाटिक भाषा परिवार की खेरवाड़ी/मुंडा उप-शाखा की प्रमुख भाषा है।'
  },
  {
    id: 'ex_grm_03',
    examTag: 'JTET',
    category: 'grammar',
    question: 'संताली की कौन-सी चार ध्वनियाँ "रुद्ध कंठ ध्वनियाँ" (Checked Consonants) कहलाती हैं?',
    santaliNote: 'अचेत वर्ण / ऑब्ट्यूज कंसोनेंट्स',
    options: ['ख, घ, छ, झ', 'क, च, त, प (अर्ध-उच्चारित / रुद्ध)', 'य, र, ल, व', 'श, ष, स, ह'],
    correctIndex: 1,
    explanation: 'संताली में क (k\'), च (c\'), त (t\'), प (p\') को बिना विस्फोट के कंठ/ओष्ठ में रोककर बोला जाता है (जैसे: दाक्, सेत्)।'
  },
  {
    id: 'ex_grm_04',
    examTag: 'JTET / JSSC',
    category: 'grammar',
    question: 'संताली संख्या प्रणाली किस आधार (Base) पर आधारित है?',
    santaliNote: 'पारंपरिक "इसी" (Isi) गणना प्रणाली',
    options: ['10 के आधार पर', '12 के आधार पर', '20 के आधार पर (इसी / विंशति)', '60 के आधार पर'],
    correctIndex: 2,
    explanation: 'संताली की पारंपरिक गणना 20 (मित् इसी) के आधार पर होती है, जैसे 40 = बार इसी, 60 = पे इसी।'
  },
  {
    id: 'ex_grm_05',
    examTag: 'JSSC CGL',
    category: 'grammar',
    question: 'संताली भाषा में कितने वचन (Number) होते हैं?',
    santaliNote: 'मित् (एक), बार (दो), को (अनेक)',
    options: ['दो (एकवचन, बहुवचन)', 'तीन (एकवचन, द्विवचन, बहुवचन)', 'चार वचन', 'केवल एकवचन'],
    correctIndex: 1,
    explanation: 'संताली में संस्कृत की भाँति तीन वचन होते हैं: एकवचन (कोई प्रत्यय नहीं), द्विवचन (-किन), और बहुवचन (-को)।'
  },
  {
    id: 'ex_grm_06',
    examTag: 'UGC-NET',
    category: 'grammar',
    question: 'संताली में संज्ञा के लिंग वर्गीकरण का मुख्य आधार क्या है?',
    santaliNote: 'जियाड़ (सजीव) बनाम बिन-जियाड़ (निर्जीव)',
    options: [
      'केवल पुल्लिंग व स्त्रीलिंग',
      'सजीव (Animate / जियाड़) और निर्जीव (Inanimate / बिन-जियाड़)',
      'आकार के अनुसार वर्गीकरण',
      'कोई व्याकरणिक भेद नहीं'
    ],
    correctIndex: 1,
    explanation: 'संताली व्याकरण में संज्ञा व क्रिया की संरचना सजीव (Animate) और निर्जीव (Inanimate) वर्गों पर आधारित होती है।'
  },
  {
    id: 'ex_grm_07',
    examTag: 'JSSC CGL',
    category: 'grammar',
    question: 'संताली में "दो लोगों" (द्विवचन) के लिए संज्ञा या सर्वनाम के अंत में कौन-सा प्रत्यय जुड़ता है?',
    options: ['-को (ko)', '-किन (kin)', '-तेत् (tet)', '-रे (re)'],
    correctIndex: 1,
    explanation: 'द्विवचन (दो प्राणी) दर्शाने के लिए "-किन" लगता है (जैसे: गित्राकिन = दो बच्चे, आकिन = वे दोनों)।'
  },
  {
    id: 'ex_grm_08',
    examTag: 'JTET',
    category: 'grammar',
    question: '"ओड़ाक् रे" (Orak\' re) में "-रे" किस कारक का द्योतक है?',
    options: ['कर्ता कारक', 'अधिकरण कारक (में / पर)', 'संप्रदान कारक', 'अपादान कारक'],
    correctIndex: 1,
    explanation: 'संताली में "-रे" अधिकरण कारक (Locative: में/पर) को दर्शाता है। "ओड़ाक् रे" का अर्थ "घर में" है।'
  },
  {
    id: 'ex_grm_09',
    examTag: 'JSSC',
    category: 'grammar',
    question: '"दकाञ जोम एत्-आ" (Dakan jom et-a) वाक्य किस काल (Tense) का उदाहरण है?',
    options: ['अपूर्ण भूतकाल', 'वर्तमान अपूर्ण / चल रहा काल (Present Continuous)', 'सामान्य भविष्यत् काल', 'आज्ञार्थक रूप'],
    correctIndex: 1,
    explanation: 'क्रिया में "-एत्-आ" (-et\'-a) प्रत्यय वर्तमान में जारी कार्य (Continuous Present: मैं खाना खा रहा हूँ) दर्शाता है।'
  },
  {
    id: 'ex_grm_10',
    examTag: 'UGC-NET',
    category: 'grammar',
    question: 'संताली भाषा में "आलांग" (Alang) सर्वनाम का क्या अर्थ है?',
    options: [
      'हम दोनों (वक्ता + श्रोता, समावेशी द्विवचन)',
      'हम दोनों (वक्ता + तीसरा व्यक्ति, श्रोता बाहर)',
      'तुम दोनों',
      'वे सब'
    ],
    correctIndex: 0,
    explanation: '"आलांग" का अर्थ है "हम दोनों (मैं और आप)" जो समावेशी द्विवचन है, जबकि "आलिञ" अपवर्जक द्विवचन है।'
  },
  {
    id: 'ex_cul_01',
    examTag: 'JSSC CGL',
    category: 'culture',
    question: 'संताल पारंपरिक स्वशासन व्यवस्था (मांझी परगना) में गाँव के प्रमुख धार्मिक पुजारी को क्या कहा जाता है?',
    santaliNote: 'जाहेर थान में बोंगा-बुरु पूजा के प्रमुख',
    options: ['गोडेट (Godet)', 'नायके (Naike)', 'जोग मांझी (Jog Majhi)', 'पारानिक (Paranik)'],
    correctIndex: 1,
    explanation: 'गाँव के धार्मिक पुजारी को "नायके" (और सहायक को कुदाम नायके) कहा जाता है, जो जाहेर थान में पूजा-अर्चना करते हैं।'
  },
  {
    id: 'ex_cul_02',
    examTag: 'JSSC CGL',
    category: 'culture',
    question: 'संताल समुदाय में सबसे बड़ा पाँच-दिवसीय कृषि व पशु-वंदना महापर्व कौन-सा है?',
    santaliNote: 'हाथी जैसा विशाल पर्व (हाती लेकान पोरोब)',
    options: ['बाहा परब', 'करम परब', 'सोहराय परब', 'माघ सिम'],
    correctIndex: 2,
    explanation: 'सोहराय संताल समाज का सबसे बड़ा पर्व है जिसे "हाती लेकान परब" भी कहा जाता है; इसमें खूंटाव, गौ-वंदना और भित्तिचित्रण होता है।'
  },
  {
    id: 'ex_cul_03',
    examTag: 'JPSC Prelims',
    category: 'culture',
    question: 'मांझी परगना व्यवस्था में गाँव की संदेशवाहक व सभा बुलाने वाली भूमिका किसकी होती है?',
    options: ['गोडेट (Godet)', 'नायके', 'परगनैत', 'लासेर तंगोय'],
    correctIndex: 0,
    explanation: 'गाँव में प्रत्येक घर तक समाचार, बैठक की सूचना और निमंत्रण पहुँचाने का दायित्व "गोडेट" का होता है।'
  },
  {
    id: 'ex_cul_04',
    examTag: 'JSSC CGL',
    category: 'culture',
    question: 'संतालों के सर्वोच्च न्यायिक व शिकार परिषद सम्मेलन को क्या कहा जाता है?',
    options: ['लो बीर बैसी (Lo Bir Baisi)', 'मोड़े होड़', 'कुलही दुरूप', 'चाती सभा'],
    correctIndex: 0,
    explanation: '"लो बीर बैसी" (सेंदरा पर्व के समय अयोध्य बुरु/जंगल में आयोजित) संताल समाज का सर्वोच्च जन-न्यायालय है।'
  },
  {
    id: 'ex_cul_05',
    examTag: 'JPSC',
    category: 'culture',
    question: 'संताल समाज में कुल कितने मूल पावन गोत्र (पारिस / Paris) होते हैं?',
    options: ['7 गोत्र', '10 गोत्र', '12 गोत्र', '16 गोत्र'],
    correctIndex: 2,
    explanation: 'पिलचु हाड़ाम और पिलचु बूढ़ी की संतानों से 12 पावन पारिस (हांसदा, मुर्मू, किस्कू, हेम्ब्रम, मरांडी, सोरेन, टुडू, बास्के, बेसरा, चोंड़े, पाउँरिया, बेदेया) बने।'
  },
  {
    id: 'ex_cul_06',
    examTag: 'JTET',
    category: 'culture',
    question: 'वसंत ऋतु में सखुआ (साल) वृक्ष के नए फूल आने पर कौन-सा पावन पर्व मनाया जाता है?',
    options: ['एरोक सिम', 'बाहा परब (Baha Parab)', 'जनताड़', 'साकरात'],
    correctIndex: 1,
    explanation: '"बाहा" का अर्थ फूल होता है। फाल्गुन मास में सखुआ के फूल खिलने पर जाहेर थान में बाहा परब मनाया जाता है।'
  },
  {
    id: 'ex_cul_07',
    examTag: 'JSSC CGL',
    category: 'culture',
    question: 'संताली विवाह में वर-वधू की पारिवारिक व सामाजिक देखरेख करने वाला युवा-अभिभावक कौन होता है?',
    options: ['जोग मांझी (Jog Majhi)', 'परगनैत', 'देश मांझी', 'भोग्दो प्रजा'],
    correctIndex: 0,
    explanation: 'जोग मांझी (और जोग पारानिक) गाँव के युवाओं के नैतिक आचरण व बापला (विवाह) संस्कारों के प्रमुख मार्गदर्शक होते हैं।'
  },
  {
    id: 'ex_cul_08',
    examTag: 'JPSC Mains',
    category: 'culture',
    question: 'संताल गाँव के पवित्र देव-उपवन को क्या कहते हैं जहाँ मरांग बुरु व जाहेर एरा का वास माना जाता है?',
    options: ['जाहेर थान (Jaher Than)', 'मांझी थान', 'अखड़ा', 'गोड़ा टांड़'],
    correctIndex: 0,
    explanation: 'सखुआ व महुआ वृक्षों से आच्छादित गाँव का पवित्र उपवन "जाहेर थान" कहलाता है।'
  },
  {
    id: 'ex_cul_09',
    examTag: 'JSSC',
    category: 'culture',
    question: 'संताली नृत्य व संगीत का वह प्रमुख एक-तारा धनुषाकार तंतु वाद्य कौन-सा है जिस पर पिलचु प्रतीक उकेरे जाते हैं?',
    options: ['धोदरो बानाम (Dhodro Banam)', 'तिरिओ (बांसुरी)', 'तामाक (नगाड़ा)', 'तुम्दाक् (मांदर)'],
    correctIndex: 0,
    explanation: 'धोदरो बानाम गम्हार की लकड़ी से निर्मित संतालों का अत्यंत प्राचीन व पवित्र एक-तारा तंतु वाद्य है।'
  },
  {
    id: 'ex_cul_10',
    examTag: 'JTET',
    category: 'culture',
    question: 'शिशु जन्म के बाद नामकरण और शुद्धिकरण संस्कार को संताली में क्या कहा जाता है?',
    options: ['जनम छठियार (Janam Chhatiar)', 'चाचो छठियार', 'भांडान', 'सेंदरा'],
    correctIndex: 0,
    explanation: 'बालक/बालिका जन्म के 5वें या 3रे दिन "जनम छठियार" द्वारा नवजात का नामकरण (पूर्वज के नाम पर) और शुद्धिकरण किया जाता है।'
  },
  {
    id: 'ex_cul_11',
    examTag: 'JSSC CGL',
    category: 'culture',
    question: 'गंभीर सामाजिक दंड या समाज से बहिष्कार (यदि निषिद्ध सगोत्र विवाह हो) को संताली न्याय में क्या कहा जाता है?',
    options: ['बिटलाहा (Bitlaha)', 'जोम जाति', 'गोमांझी', 'सालिस'],
    correctIndex: 0,
    explanation: '"बिटलाहा" परगनैत और बड़ी सभा द्वारा घोषित कठोरतम सामाजिक दंड है, जिसे शुद्धिकरण (जोम जाति) के बाद ही क्षमा किया जाता है।'
  },
  {
    id: 'ex_his_01',
    examTag: 'JPSC Prelims',
    category: 'history',
    question: 'ऐतिहासिक संथाल हूल (1855) के दौरान भोगनाडीह में 30 जून 1855 को कितने संताल वीरों की विशाल सभा हुई थी?',
    santaliNote: 'सिदो-कान्हू, चांद-भैरव व फूलो-झानो का नेतृत्व',
    options: ['लगभग 1,000', 'लगभग 10,000 से अधिक', 'लगभग 2,500', 'लगभग 500'],
    correctIndex: 1,
    explanation: '30 जून 1855 को साहिबगंज के भोगनाडीह में 10,000 से अधिक संताल एकत्र हुए और "अबुआः दिशोम, अबुआः राज" का उद्घोष किया।'
  },
  {
    id: 'ex_his_02',
    examTag: 'JPSC / NET',
    category: 'history',
    question: 'किस संविधान संशोधन द्वारा संताली भाषा को भारतीय संविधान की 8वीं अनुसूची में शामिल किया गया?',
    santaliNote: '2003 में मैथिली, डोगरी और बोडो के साथ मान्यता',
    options: ['71वाँ संशोधन (1992)', '86वाँ संशोधन (2002)', '92वाँ संशोधन (2003)', '101वाँ संशोधन (2016)'],
    correctIndex: 2,
    explanation: '92वें संविधान संशोधन अधिनियम (2003) के तहत संताली भाषा को संविधान की 8वीं अनुसूची में शामिल किया गया।'
  },
  {
    id: 'ex_his_03',
    examTag: 'JPSC',
    category: 'history',
    question: 'संथाल हूल के बाद अंग्रेज़ी सरकार को कौन-सा विशेष प्रशासनिक क्षेत्र और काश्तकारी कानून बनाना पड़ा?',
    options: ['संथाल परगना (1855) व SPT एक्ट', 'बंगाल टेनेंसी एक्ट 1885', 'दामिन-ए-कोह समाप्ति एक्ट', 'कोलहान रेगुलेशन 1837'],
    correctIndex: 0,
    explanation: 'हूल के परिणामस्वरूप 1855 में संथाल परगना जिले का गठन हुआ और भागलपुर के कठोर नियमों के स्थान पर विशेष नॉन-रेगुलेशन कानून लागू हुए।'
  },
  {
    id: 'ex_his_04',
    examTag: 'JSSC CGL',
    category: 'history',
    question: '1855 के संथाल हूल में सिदो और कान्हू की किन दो वीरांगना बहनों ने अदम्य साहस के साथ युद्ध किया था?',
    options: ['फूलो मुर्मू और झानो मुर्मू', 'सिनगी दई और कइली दई', 'माकी और सलोनी', 'जानी और बुधिनी'],
    correctIndex: 0,
    explanation: 'फूलो मुर्मू और झानो मुर्मू ने पाकुड़ के संग्राम में ब्रिगेड की छावनी में घुसकर 21 ब्रिटिश सिपाहियों को परास्त किया था।'
  },
  {
    id: 'ex_his_05',
    examTag: 'JPSC Mains',
    category: 'history',
    question: '1784–85 ईस्वी में अंग्रेजों के विरुद्ध प्रथम आदिवासी सशस्त्र विद्रोह करने वाले अमर नायक कौन थे जिन्होंने क्लीवलैंड को तीर से मारा था?',
    options: ['बाबा तिलका मांझी (जबरा पहाड़िया)', 'बिरसा मुंडा', 'जतरा भगत', 'रघुनाथ महतो'],
    correctIndex: 0,
    explanation: 'बाबा तिलका मांझी (1750–1785) ने भागलपुर व राजमहल पहाड़ियों में अंग्रेज़ी सत्ता के विरुद्ध पहला सशस्त्र जनसंग्राम लड़ा।'
  },
  {
    id: 'ex_his_06',
    examTag: 'JSSC',
    category: 'history',
    question: 'संताली लोक इतिहास में किस प्राचीन स्थान को संतालों की स्वर्ण युग वाली मातृभूमि व 12 द्वारों वाला गढ़ कहा जाता है?',
    options: ['चम्पा गढ़ (Champa Garh)', 'चाय गढ़', 'रोहतास गढ़', 'बादोली गढ़'],
    correctIndex: 0,
    explanation: 'बिनती गाथाओं में "चम्पा गढ़" को संतालों के सांस्कृतिक उत्कर्ष का केंद्र माना जाता है जहाँ 12 पारिसों की परंपराएं व्यवस्थित हुईं।'
  },
  {
    id: 'ex_his_07',
    examTag: 'JPSC Prelims',
    category: 'history',
    question: 'संथाल परगना काश्तकारी (SPT) अधिनियम, 1949 की कौन-सी धारा आदिवासी रैयती भूमि के हस्तांतरण को पूर्णतः प्रतिबंधित करती है?',
    options: ['धारा 12', 'धारा 20 (Section 20)', 'धारा 42', 'धारा 67'],
    correctIndex: 1,
    explanation: 'SPT अधिनियम 1949 की धारा 20 रैयती भूमि की बिक्री, दान या किसी अन्य प्रकार के गैर-कानूनी हस्तांतरण पर पूर्ण रोक लगाती है।'
  },
  {
    id: 'ex_his_08',
    examTag: 'UGC-NET',
    category: 'history',
    question: 'झारखंड की लुगुबुरु घंटाबाड़ी धोरोमगढ़ (बोकारो) में कार्तिक पूर्णिमा पर क्या आयोजित होता है?',
    options: [
      'अंतर्राष्ट्रीय संताल सरना धर्म महासम्मेलन',
      'केवल मकर संक्रांति मेला',
      'सेंदरा शिकार प्रतियोगिता',
      'हूल स्मृति मार्च'
    ],
    correctIndex: 0,
    explanation: 'ललपनिया (बोकारो) स्थित लुगुबुरु घंटाबाड़ी संताल समुदाय का सबसे बड़ा आध्यात्मिक तीर्थ है जहां कार्तिक पूर्णिमा पर विशाल धर्म महासम्मेलन होता है।'
  }
];

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomizeOptions(q: ExamQuestion): ExamQuestion {
  const tagged = q.options.map((text, idx) => ({ text, isCorrect: idx === q.correctIndex }));
  const shuffled = fisherYatesShuffle(tagged);
  return {
    ...q,
    options: shuffled.map((o) => o.text),
    correctIndex: shuffled.findIndex((o) => o.isCorrect)
  };
}

function loadUsedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(USED_Q_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

function saveUsedIds(setIds: Set<string>) {
  try {
    localStorage.setItem(USED_Q_STORAGE_KEY, JSON.stringify(Array.from(setIds)));
  } catch {
    // ignore
  }
}

function loadMistakeBank(): MistakeBankEntry[] {
  try {
    const raw = localStorage.getItem(MISTAKE_BANK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadSubjectAnalytics(): SubjectAnalyticsMap {
  try {
    const raw = localStorage.getItem(SUBJECT_ANALYTICS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

type HubSection = 'exams_directory' | 'paper_preview' | 'custom_cbt' | 'mistake_bank';

export const SantaliExamPrepHub: React.FC = () => {
  const { words } = useAdmin();

  // Dynamic Vocabulary Questions generated deterministically from dictionary words
  const dynamicVocabQuestions: ExamQuestion[] = useMemo(() => {
    const cleanWords: typeof words = [];
    for (let i = 0; i < words.length && cleanWords.length < 120; i++) {
      const w = words[i];
      if (w.wordDevanagari && w.meaningHindi && w.meaningHindi.length > 1) {
        cleanWords.push(w);
      }
    }
    if (cleanWords.length < 8) return [];
    return cleanWords.slice(0, 60).map((w, idx) => {
      const d1 = cleanWords[(idx + 7) % cleanWords.length].meaningHindi;
      const d2 = cleanWords[(idx + 19) % cleanWords.length].meaningHindi;
      const d3 = cleanWords[(idx + 31) % cleanWords.length].meaningHindi;
      const options = Array.from(new Set([w.meaningHindi, d1, d2, d3]));
      while (options.length < 4) {
        options.push(`शब्द अर्थ विकल्प ${options.length + 1}`);
      }
      return {
        id: `ex_voc_${w.id}`,
        examTag: 'शब्दावली / JSSC',
        category: 'vocabulary',
        question: `संताली शब्द "${w.wordDevanagari}" (${w.wordRoman}) का सही हिन्दी अर्थ क्या है?`,
        santaliNote: w.exampleSantali ? `प्रयोग: ${w.exampleSantali}` : undefined,
        options: options.slice(0, 4),
        correctIndex: 0,
        explanation: `"${w.wordDevanagari}" (${w.wordRoman}) का अर्थ "${w.meaningHindi}" (English: ${w.meaningEnglish}) होता है।`
      };
    });
  }, [words]);

  // Convert 2026 competitive questions into unified CBT question bank items
  const competitiveBankQuestions: ExamQuestion[] = useMemo(() => {
    return ALL_COMPETITIVE_QUESTIONS_2026.map((cq) => ({
      id: cq.id,
      examTag: cq.examTag,
      category:
        cq.subject === 'jharkhand_special' || cq.subject === 'santali_language'
          ? 'jharkhand_gk'
          : 'india_gk',
      question: cq.question,
      santaliNote: cq.santaliNote,
      options: [...cq.options],
      correctIndex: cq.correctIndex,
      explanation: cq.explanation
    }));
  }, []);

  const allQuestionsBank = useMemo(
    () => [...CURATED_EXAM_QUESTIONS, ...competitiveBankQuestions, ...dynamicVocabQuestions],
    [competitiveBankQuestions, dynamicVocabQuestions]
  );

  // ==========================================================
  // INDIA + JHARKHAND 2026 DIRECTORY & PAPER PREVIEW STATE
  // ==========================================================
  const [hubSection, setHubSection] = useState<HubSection>('exams_directory');
  const [regionFilter, setRegionFilter] = useState<'all' | ExamRegion>('all');
  const [examSearch, setExamSearch] = useState<string>('');
  const [selectedExamId, setSelectedExamId] = useState<string>('jpsc_ccs');
  const [selectedPaperSlot, setSelectedPaperSlot] = useState<ExamPaperSlot>('pyq_2025');
  const [showPreviewAnswers, setShowPreviewAnswers] = useState<boolean>(true);
  const [previewSelfAnswers, setPreviewSelfAnswers] = useState<Record<string, number>>({});

  const filteredExams2026 = useMemo(() => {
    const q = examSearch.trim().toLowerCase();
    return COMPETITIVE_EXAMS_2026.filter((ex) => {
      if (regionFilter !== 'all' && ex.region !== regionFilter) return false;
      if (!q) return true;
      return (
        ex.shortName.toLowerCase().includes(q) ||
        ex.fullNameHindi.toLowerCase().includes(q) ||
        ex.fullNameEnglish.toLowerCase().includes(q) ||
        ex.conductingBody.toLowerCase().includes(q) ||
        ex.category.toLowerCase().includes(q)
      );
    });
  }, [regionFilter, examSearch]);

  const activeExam = useMemo(
    () => COMPETITIVE_EXAMS_2026.find((e) => e.id === selectedExamId) || COMPETITIVE_EXAMS_2026[0],
    [selectedExamId]
  );

  const activeSlotMeta = useMemo(
    () => PAPER_SLOTS_META.find((p) => p.slot === selectedPaperSlot) || PAPER_SLOTS_META[0],
    [selectedPaperSlot]
  );

  const activePreviewQuestions = useMemo(
    () => getQuestionsForExamPaper(activeExam.id, selectedPaperSlot, 10),
    [activeExam.id, selectedPaperSlot]
  );

  // ==========================================================
  // REAL CBT ENGINE STATE (PRESERVED & ENHANCED)
  // ==========================================================
  const [phase, setPhase] = useState<'setup' | 'running' | 'result'>('setup');
  const [activeCbtTitle, setActiveCbtTitle] = useState<string>('संताली व प्रतियोगी परीक्षा CBT (No-Repeat)');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [marksPerCorrect, setMarksPerCorrect] = useState<number>(2);
  const [negativeMark, setNegativeMark] = useState<number>(0.5);
  const [selectedSubject, setSelectedSubject] = useState<'all' | ExamCategory>('all');
  const [usedIds, setUsedIds] = useState<Set<string>>(() => loadUsedIds());

  // Live Exam Running State
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedReview, setMarkedReview] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(900);
  const [totalDurationSec, setTotalDurationSec] = useState<number>(900);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);
  const [poolWrappedMsg, setPoolWrappedMsg] = useState<string | null>(null);
  const [examDisplayMode, setExamDisplayMode] = useState<'cbt' | 'omr'>('cbt');
  const [isMistakeRetest, setIsMistakeRetest] = useState<boolean>(false);

  // Mistake Bank & Subject-wise Analytics Persistence
  const [mistakeBank, setMistakeBank] = useState<MistakeBankEntry[]>(() => loadMistakeBank());
  const [subjectAnalytics, setSubjectAnalytics] = useState<SubjectAnalyticsMap>(() =>
    loadSubjectAnalytics()
  );

  useEffect(() => {
    try {
      localStorage.setItem(MISTAKE_BANK_STORAGE_KEY, JSON.stringify(mistakeBank));
    } catch {
      // ignore
    }
  }, [mistakeBank]);

  useEffect(() => {
    try {
      localStorage.setItem(SUBJECT_ANALYTICS_STORAGE_KEY, JSON.stringify(subjectAnalytics));
    } catch {
      // ignore
    }
  }, [subjectAnalytics]);

  const recordMistake = useCallback((q: ExamQuestion) => {
    setMistakeBank((prev) => {
      const existing = prev.find((m) => m.id === q.id);
      if (existing) {
        return prev.map((m) =>
          m.id === q.id ? { ...m, wrongCount: m.wrongCount + 1, lastWrongAt: Date.now() } : m
        );
      }
      const entry: MistakeBankEntry = {
        id: q.id,
        examTag: q.examTag,
        category: q.category,
        question: q.question,
        santaliNote: q.santaliNote,
        options: [...q.options],
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        wrongCount: 1,
        lastWrongAt: Date.now()
      };
      return [entry, ...prev];
    });
  }, []);

  const filteredBank = useMemo(() => {
    if (selectedSubject === 'all') return allQuestionsBank;
    return allQuestionsBank.filter((q) => q.category === selectedSubject);
  }, [allQuestionsBank, selectedSubject]);

  const unseenCount = useMemo(
    () => filteredBank.filter((q) => !usedIds.has(q.id)).length,
    [filteredBank, usedIds]
  );

  const submitExam = useCallback(() => {
    const elapsedTotal = Math.max(1, totalDurationSec - secondsLeft);
    const answeredCount = Math.max(1, Object.keys(answers).length);
    const avgSecPerQ = Math.round(elapsedTotal / answeredCount);

    // Update Mistake Bank & Subject Analytics
    setMistakeBank((prev) => {
      let next = [...prev];
      for (const q of examQuestions) {
        const chosen = answers[q.id];
        if (chosen === undefined) continue;
        if (chosen !== q.correctIndex) {
          const existingIdx = next.findIndex((m) => m.id === q.id);
          if (existingIdx >= 0) {
            next[existingIdx] = {
              ...next[existingIdx],
              wrongCount: next[existingIdx].wrongCount + 1,
              lastWrongAt: Date.now()
            };
          } else {
            next = [
              {
                id: q.id,
                examTag: q.examTag,
                category: q.category,
                question: q.question,
                santaliNote: q.santaliNote,
                options: [...q.options],
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                wrongCount: 1,
                lastWrongAt: Date.now()
              },
              ...next
            ];
          }
        } else if (isMistakeRetest) {
          // Graduate question from mistake bank when solved correctly in re-test
          next = next.filter((m) => m.id !== q.id);
        }
      }
      return next;
    });

    setSubjectAnalytics((prev) => {
      const next: SubjectAnalyticsMap = { ...prev };
      for (const q of examQuestions) {
        const chosen = answers[q.id];
        if (chosen === undefined) continue;
        const curr = next[q.category] || { attempted: 0, correct: 0, wrong: 0, timeSec: 0 };
        const isRight = chosen === q.correctIndex;
        next[q.category] = {
          attempted: curr.attempted + 1,
          correct: curr.correct + (isRight ? 1 : 0),
          wrong: curr.wrong + (isRight ? 0 : 1),
          timeSec: curr.timeSec + avgSecPerQ
        };
      }
      return next;
    });

    setShowSubmitConfirm(false);
    setPhase('result');
  }, [answers, examQuestions, isMistakeRetest, secondsLeft, totalDurationSec]);

  // Real Countdown Timer during Running Phase
  useEffect(() => {
    if (phase !== 'running') return;
    if (secondsLeft <= 0) {
      submitExam();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, secondsLeft, submitExam]);

  const handleStartCustomExam = () => {
    const currentUsed = new Set(usedIds);
    let unseen = filteredBank.filter((q) => !currentUsed.has(q.id));
    let wrappedNote: string | null = null;

    if (unseen.length === 0) {
      filteredBank.forEach((q) => currentUsed.delete(q.id));
      unseen = [...filteredBank];
      wrappedNote = 'इस विषय के सभी प्रश्न एक चक्र पूरे कर चुके थे — नया ताज़ा सेट शुरू किया गया है!';
    }

    let picked = fisherYatesShuffle(unseen).slice(0, questionCount);
    if (picked.length < questionCount && unseen.length < filteredBank.length) {
      const remainingNeeded = questionCount - picked.length;
      const seenFallback = fisherYatesShuffle(
        filteredBank.filter((q) => !picked.some((p) => p.id === q.id))
      ).slice(0, remainingNeeded);
      picked = [...picked, ...seenFallback];
      wrappedNote = 'अधिकांश प्रश्न पहले हल किए जा चुके थे; शेष अनदेखे व ताज़ा प्रश्न शामिल किए गए हैं।';
    }

    const randomized = picked.map(randomizeOptions);
    randomized.forEach((q) => currentUsed.add(q.id));
    setUsedIds(currentUsed);
    saveUsedIds(currentUsed);

    const durSec = durationMinutes * 60;
    setActiveCbtTitle(`कस्टम CBT परीक्षा · ${questionCount} प्रश्न (Zero Repeat)`);
    setIsMistakeRetest(false);
    setExamQuestions(randomized);
    setAnswers({});
    setMarkedReview({});
    setCurrentIdx(0);
    setSecondsLeft(durSec);
    setTotalDurationSec(durSec);
    setPoolWrappedMsg(wrappedNote);
    setShowSubmitConfirm(false);
    setPhase('running');
  };

  const handleLaunchMistakeRetest = () => {
    if (mistakeBank.length === 0) return;
    const picked = fisherYatesShuffle(mistakeBank).slice(0, 30).map((m) =>
      randomizeOptions({
        id: m.id,
        examTag: m.examTag,
        category: m.category,
        question: m.question,
        santaliNote: m.santaliNote,
        options: [...m.options],
        correctIndex: m.correctIndex,
        explanation: m.explanation
      })
    );
    const durMin = Math.max(5, Math.ceil(picked.length * 1.2));
    const durSec = durMin * 60;
    setDurationMinutes(durMin);
    setQuestionCount(picked.length);
    setActiveCbtTitle(`गलत प्रश्न बैंक री-टेस्ट (${picked.length} प्रश्न)`);
    setIsMistakeRetest(true);
    setExamQuestions(picked);
    setAnswers({});
    setMarkedReview({});
    setCurrentIdx(0);
    setSecondsLeft(durSec);
    setTotalDurationSec(durSec);
    setPoolWrappedMsg(null);
    setShowSubmitConfirm(false);
    setPhase('running');
  };

  const handleDownloadPaperHtml = () => {
    const html = `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8" />
<title>${activeExam.shortName} - ${activeSlotMeta.yearOrSet} Practice Paper</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; max-width: 820px; margin: 28px auto; padding: 0 20px; line-height: 1.5; }
  .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 18px; }
  .meta { font-size: 12px; color: #475569; margin-top: 6px; }
  .q-block { margin-bottom: 16px; page-break-inside: avoid; }
  .q-title { font-weight: 700; font-size: 14px; margin-bottom: 6px; }
  .opts { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; font-size: 13px; margin-left: 16px; }
  .omr-box { border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; margin-top: 24px; page-break-inside: avoid; }
  .omr-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px; font-family: monospace; }
  .bubble { display: inline-block; width: 18px; height: 18px; border: 1.5px solid #334155; border-radius: 999px; text-align: center; line-height: 16px; margin-right: 4px; font-size: 10px; }
  .page-break { page-break-before: always; margin-top: 32px; border-top: 2px dashed #94a3b8; padding-top: 20px; }
  .ans-item { font-size: 12.5px; margin-bottom: 10px; padding: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
  @media print { body { margin: 12mm; } }
</style>
</head>
<body>
  <div class="header">
    <div style="font-size:11px;font-weight:700;color:#b45309;">${activeExam.conductingBody} · ${activeSlotMeta.label}</div>
    <h1 style="margin:4px 0 0;font-size:20px;">${activeExam.shortName} (${activeSlotMeta.yearOrSet}) — प्रश्न-पत्र</h1>
    <div class="meta">कुल प्रश्न: ${activePreviewQuestions.length} · सही: +${activeExam.defaultCbtConfig.marksPerCorrect} · नेगेटिव: ${activeExam.defaultCbtConfig.negativeMark === 0 ? '0' : `-${activeExam.defaultCbtConfig.negativeMark}`} · समय: ${activeExam.defaultCbtConfig.durationMinutes} मिनट</div>
  </div>
  ${activePreviewQuestions
    .map(
      (q, i) => `
    <div class="q-block">
      <div class="q-title">Q.${i + 1}) ${q.question}</div>
      <div class="opts">
        ${q.options.map((o, oi) => `<div>(${String.fromCharCode(65 + oi)}) ${o}</div>`).join('')}
      </div>
    </div>`
    )
    .join('')}
  <div class="omr-box">
    <div style="font-weight:700;font-size:13px;margin-bottom:8px;">OMR उत्तर पत्रक (Bubble Sheet)</div>
    <div class="omr-grid">
      ${activePreviewQuestions
        .map(
          (_, i) =>
            `<div>Q.${String(i + 1).padStart(2, '0')}: <span class="bubble">A</span><span class="bubble">B</span><span class="bubble">C</span><span class="bubble">D</span></div>`
        )
        .join('')}
    </div>
  </div>
  <div class="page-break">
    <h2 style="font-size:17px;margin-bottom:12px;">उत्तर-कुंजी एवं व्याख्या (Answer Key & Explanations)</h2>
    ${activePreviewQuestions
      .map(
        (q, i) => `
      <div class="ans-item">
        <strong>Q.${i + 1}: सही उत्तर (${String.fromCharCode(65 + q.correctIndex)}) — ${q.options[q.correctIndex]}</strong><br/>
        <span>${q.explanation}</span>
      </div>`
      )
      .join('')}
  </div>
  <script>window.onload = function() { setTimeout(function(){ window.print(); }, 250); };</script>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hor-katha-${activeExam.id}-${selectedPaperSlot}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleLaunchPaperCbt = (examId: string, slot: ExamPaperSlot) => {
    const exam = COMPETITIVE_EXAMS_2026.find((e) => e.id === examId) || activeExam;
    const slotMeta = PAPER_SLOTS_META.find((p) => p.slot === slot) || PAPER_SLOTS_META[0];
    const paperQs = getQuestionsForExamPaper(exam.id, slot, 10).map((cq) =>
      randomizeOptions({
        id: cq.id,
        examTag: cq.examTag,
        category: exam.region === 'jharkhand' ? 'jharkhand_gk' : 'india_gk',
        question: cq.question,
        santaliNote: cq.santaliNote,
        options: [...cq.options],
        correctIndex: cq.correctIndex,
        explanation: cq.explanation
      })
    );

    const cfg = exam.defaultCbtConfig;
    const durSec = cfg.durationMinutes * 60;
    setMarksPerCorrect(cfg.marksPerCorrect);
    setNegativeMark(cfg.negativeMark);
    setDurationMinutes(cfg.durationMinutes);
    setQuestionCount(paperQs.length);
    setActiveCbtTitle(`${exam.shortName} · ${slotMeta.label}`);
    setIsMistakeRetest(false);
    setExamQuestions(paperQs);
    setAnswers({});
    setMarkedReview({});
    setCurrentIdx(0);
    setSecondsLeft(durSec);
    setTotalDurationSec(durSec);
    setPoolWrappedMsg(null);
    setShowSubmitConfirm(false);
    setPhase('running');
  };

  const handleResetQuestionPool = () => {
    const empty = new Set<string>();
    setUsedIds(empty);
    saveUsedIds(empty);
    setPoolWrappedMsg('प्रश्न पूल सफलतापूर्वक रीसेट हो गया! अब सभी प्रश्न पुनः उपलब्ध हैं।');
    setTimeout(() => setPoolWrappedMsg(null), 3500);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQ = examQuestions[currentIdx];

  const resultMetrics = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    for (const q of examQuestions) {
      const ans = answers[q.id];
      if (ans === undefined) {
        unattempted++;
      } else if (ans === q.correctIndex) {
        correct++;
      } else {
        wrong++;
      }
    }

    const rawScore = correct * marksPerCorrect - wrong * negativeMark;
    const totalMarks = examQuestions.length * marksPerCorrect;
    const percentage = totalMarks > 0 ? Math.max(0, Math.round((rawScore / totalMarks) * 100)) : 0;
    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
    const timeTaken = Math.max(0, totalDurationSec - secondsLeft);

    return {
      correct,
      wrong,
      unattempted,
      rawScore: Number(rawScore.toFixed(2)),
      totalMarks: Number(totalMarks.toFixed(2)),
      percentage,
      accuracy,
      timeTaken
    };
  }, [examQuestions, answers, marksPerCorrect, negativeMark, totalDurationSec, secondsLeft]);

  const openPaperPreview = (examId: string, slot: ExamPaperSlot) => {
    setSelectedExamId(examId);
    setSelectedPaperSlot(slot);
    setPreviewSelfAnswers({});
    setHubSection('paper_preview');
    setPhase('setup');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Top Institutional Header */}
        <header className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-800">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>अखिल भारतीय एवं झारखंड राज्य प्रतियोगी परीक्षा हब</span>
              <span aria-hidden="true">·</span>
              <span>2026 पाठ्यक्रम एवं 3-वर्षीय PYQ</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 text-balance">
              India + Jharkhand Competitive Exams 2026 (3-Year PYQ &amp; 2 Practice Sets)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              UPSC, SSC, Banking, Railways, UGC-NET, CTET, Defence से लेकर JPSC, JSSC CGL, Excise/Police, JTET, PGT/TGT व High Court तक — 20 वास्तविक परीक्षाएँ, 2026 के सभी आवश्यक पेपर, 2023–2025 के प्रामाणिक प्रश्न-पत्र व 2 प्रैक्टिस सेट लाइव CBT टाइमर के साथ।
            </p>
          </div>

          {phase === 'running' ? (
            <div className="flex items-center gap-3 shrink-0">
              <div
                className={`px-4 py-2.5 rounded-xl border text-right ${
                  secondsLeft <= 60
                    ? 'bg-rose-50 border-rose-400 text-rose-800'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <div className="text-[11px] font-bold flex items-center justify-end gap-1">
                  <Clock className="w-3.5 h-3.5" /> शेष समय (Countdown)
                </div>
                <div className="font-mono tabular-nums text-xl font-black">{formatTime(secondsLeft)}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 shrink-0 text-xs">
              <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                <div className="text-[11px] text-slate-500 font-medium">कुल प्रश्न बैंक · अनदेखे (No-Repeat)</div>
                <div className="font-mono tabular-nums font-bold text-base text-emerald-800">
                  {unseenCount} / {filteredBank.length} प्रश्न
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Primary Workspace Navigation Tabs (shown when not in active exam run) */}
        {phase === 'setup' && (
          <nav
            aria-label="Exam hub workspace sections"
            className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-xl"
          >
            <button
              onClick={() => setHubSection('exams_directory')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                hubSection === 'exams_directory'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>1. भारत + झारखंड परीक्षा सूची 2026 ({COMPETITIVE_EXAMS_2026.length})</span>
            </button>

            <button
              onClick={() => setHubSection('paper_preview')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                hubSection === 'paper_preview'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>2. रियल एग्जाम प्रीव्यू (3-Year PYQ + 2 Practice Sets)</span>
            </button>

            <button
              onClick={() => setHubSection('custom_cbt')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                hubSection === 'custom_cbt'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>3. कस्टम CBT / OMR टेस्ट (Zero Repeat)</span>
            </button>

            <button
              onClick={() => setHubSection('mistake_bank')}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                hubSection === 'mistake_bank'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>4. गलत प्रश्न बैंक व एनालिटिक्स ({mistakeBank.length})</span>
            </button>
          </nav>
        )}

        {poolWrappedMsg && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{poolWrappedMsg}</span>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 1: INDIA + JHARKHAND COMPETITIVE EXAMS 2026 DIRECTORY         */}
        {/* ================================================================= */}
        {phase === 'setup' && hubSection === 'exams_directory' && (
          <div className="space-y-4">
            {/* Search & Region Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setRegionFilter('all')}
                  className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    regionFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  सभी परीक्षाएँ (20)
                </button>
                <button
                  onClick={() => setRegionFilter('india')}
                  className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    regionFilter === 'india' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-sky-700" />
                  <span>अखिल भारतीय (10)</span>
                </button>
                <button
                  onClick={() => setRegionFilter('jharkhand')}
                  className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                    regionFilter === 'jharkhand' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>झारखंड राज्य (10)</span>
                </button>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={examSearch}
                  onChange={(e) => setExamSearch(e.target.value)}
                  placeholder="परीक्षा खोजें (UPSC, SSC, JPSC, JSSC, JTET...)"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
                />
              </div>
            </div>

            {/* Split Master-Detail Directory */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Exam Selector List */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-3 space-y-1.5 max-h-[680px] overflow-y-auto">
                {filteredExams2026.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    खोज से मेल खाने वाली कोई परीक्षा नहीं मिली। फ़िल्टर रीसेट करके देखें।
                  </div>
                ) : (
                  filteredExams2026.map((exam) => {
                    const isActive = exam.id === activeExam.id;
                    return (
                      <button
                        key={exam.id}
                        onClick={() => setSelectedExamId(exam.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-amber-50 border-amber-400 text-slate-900'
                            : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700">
                            {exam.region === 'india' ? 'अखिल भारतीय' : 'झारखंड राज्य'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{exam.conductingBody}</span>
                        </div>
                        <div className="font-bold text-sm text-slate-900 mt-0.5">{exam.shortName}</div>
                        <div className="text-xs text-slate-600 line-clamp-1 mt-0.5">{exam.fullNameHindi}</div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Right Column: Official Exam Blueprint & All Required 2026 Papers */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="font-semibold text-amber-800">
                      {activeExam.region === 'india' ? 'भारत सरकार / राष्ट्रीय परीक्षा' : 'झारखंड सरकार / राज्य परीक्षा'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{activeExam.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-700 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> {activeExam.officialPortal}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">{activeExam.fullNameHindi}</h2>
                  <p className="text-xs text-slate-500">{activeExam.fullNameEnglish}</p>
                </div>

                {/* Key Fact Grid (No Pill Clutter) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-slate-500 font-medium">संचालन संस्था (Conducting Body)</div>
                    <div className="font-bold text-slate-900">{activeExam.conductingBody}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-slate-500 font-medium">शैक्षणिक योग्यता (Eligibility)</div>
                    <div className="font-bold text-slate-900">{activeExam.eligibility}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-sky-950">2026 परीक्षा चक्र व चयन विवरण:</strong> {activeExam.cycleNote2026}
                </div>

                {/* All Required Exam Papers 2026 Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-700" />
                      <span>2026 के सभी आवश्यक परीक्षा पत्र (Required Exam Papers)</span>
                    </h3>
                    <span className="text-xs font-mono tabular-nums text-slate-500">
                      {activeExam.requiredPapers2026.length} मुख्य चरण/पेपर
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                    {activeExam.requiredPapers2026.map((paper, i) => (
                      <div key={i} className="p-4 bg-white space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-bold text-sm text-slate-900">
                            {paper.paperCode} — {paper.title}
                          </div>
                          <div className="text-xs font-mono tabular-nums text-slate-700 font-semibold">
                            {paper.questionsInfo} · {paper.marksInfo}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600">{paper.subjects}</p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                          <span>समय: <strong className="font-mono text-slate-800">{paper.durationMin} मिनट</strong></span>
                          <span aria-hidden="true">·</span>
                          <span>नेगेटिव मार्किंग: <strong className="text-slate-800">{paper.negativeMarking}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3-Year PYQ + 2 Practice Paper Sets Launcher */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    3 वर्षों के प्रश्न-पत्र (2023–2025 PYQ) व 2026 प्रैक्टिस पेपर (Set 1 &amp; 2)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PAPER_SLOTS_META.map((slotMeta) => (
                      <div
                        key={slotMeta.slot}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="text-[11px] font-mono text-amber-800 font-semibold">
                            {slotMeta.yearOrSet}
                          </div>
                          <div className="text-xs font-bold text-slate-900 mt-0.5">{slotMeta.label}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openPaperPreview(activeExam.id, slotMeta.slot)}
                            className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>प्रीव्यू देखें</span>
                          </button>
                          <button
                            onClick={() => handleLaunchPaperCbt(activeExam.id, slotMeta.slot)}
                            className="flex-1 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>CBT टेस्ट</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: REAL EXAM PREVIEW SHEET (3-YEAR PYQ + 2 PRACTICE SETS)     */}
        {/* ================================================================= */}
        {phase === 'setup' && hubSection === 'paper_preview' && (
          <div className="space-y-4">
            {/* Selector Control Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="preview-exam-select" className="text-xs font-bold text-slate-700 block">
                    परीक्षा चुनें (India + Jharkhand 2026):
                  </label>
                  <select
                    id="preview-exam-select"
                    value={selectedExamId}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <optgroup label="🇮🇳 अखिल भारतीय परीक्षाएँ (All-India 2026)">
                      {COMPETITIVE_EXAMS_2026.filter((e) => e.region === 'india').map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.shortName} — {e.conductingBody}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🌿 झारखंड राज्य परीक्षाएँ (Jharkhand 2026)">
                      {COMPETITIVE_EXAMS_2026.filter((e) => e.region === 'jharkhand').map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.shortName} — {e.conductingBody}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">
                    प्रश्न-पत्र सेट चुनें (3-Year PYQ + 2 Practice Papers):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PAPER_SLOTS_META.map((slotMeta) => (
                      <button
                        key={slotMeta.slot}
                        onClick={() => setSelectedPaperSlot(slotMeta.slot)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          selectedPaperSlot === slotMeta.slot
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {slotMeta.yearOrSet}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Authenticity Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
                <span>
                  <strong className="text-slate-900">प्रामाणिकता सूचना:</strong> यह वास्तविक पिछले वर्षों (2023, 2024, 2025) के पैटर्न व स्मृति-आधारित प्रश्न-संग्रह तथा 2026 पाठ्यक्रम आधारित प्रैक्टिस सेट हैं। कोई फर्जी या मनगढ़ंत आधिकारिक तिथि दावा नहीं जोड़ा गया है।
                </span>
              </div>
            </div>

            {/* Real Exam Paper Preview Sheet */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-6">
              {/* Official Question Paper Masthead */}
              <div className="border-b border-slate-200 pb-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-amber-800">
                    {activeExam.conductingBody} · {activeSlotMeta.label}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {activeExam.shortName} — {activeSlotMeta.yearOrSet} प्रश्न-पत्र पूर्वावलोकन
                  </h2>
                  <p className="text-xs text-slate-600">{activeSlotMeta.subtitle}</p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono tabular-nums text-slate-700">
                    <span>कुल प्रश्न: {activePreviewQuestions.length}</span>
                    <span aria-hidden="true">·</span>
                    <span>सही: +{activeExam.defaultCbtConfig.marksPerCorrect}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      नेगेटिव:{' '}
                      {activeExam.defaultCbtConfig.negativeMark === 0
                        ? 'नहीं (0)'
                        : `-${activeExam.defaultCbtConfig.negativeMark}`}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>समय: {activeExam.defaultCbtConfig.durationMinutes} मिनट</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setShowPreviewAnswers((v) => !v);
                      setPreviewSelfAnswers({});
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {showPreviewAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPreviewAnswers ? 'उत्तर छिपाएँ (Self-Test Mode)' : 'सभी उत्तर दिखाएँ'}</span>
                  </button>

                  <button
                    onClick={handleDownloadPaperHtml}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>पेपर + उत्तर-कुंजी डाउनलोड</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>प्रिंट करें</span>
                  </button>

                  <button
                    onClick={() => handleLaunchPaperCbt(activeExam.id, selectedPaperSlot)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>लाइव CBT टेस्ट शुरू करें</span>
                  </button>
                </div>
              </div>

              {/* Paper Questions List */}
              <div className="space-y-5 divide-y divide-slate-100">
                {activePreviewQuestions.map((q, idx) => (
                  <div key={q.id} className={idx > 0 ? 'pt-5 space-y-3' : 'space-y-3'}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-mono font-bold text-slate-800">Q.{idx + 1}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-amber-800">{q.examTag}</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {q.question}
                        </h3>
                        {q.santaliNote && (
                          <p className="text-xs text-slate-500">{q.santaliNote}</p>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          speakWithFemaleVoice(
                            `प्रश्न ${idx + 1}: ${q.question}। विकल्प: ${q.options.join('। ')}`,
                            { autoDetectLanguage: true }
                          )
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                        title="प्रश्न व विकल्प सुनें"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                        <span>सुनें</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      {q.options.map((opt, optIdx) => {
                        const selfChosen = previewSelfAnswers[q.id];
                        const hasSelfTried = !showPreviewAnswers && selfChosen !== undefined;
                        const isRightOpt = optIdx === q.correctIndex;
                        const isAnsHighlight = (showPreviewAnswers || hasSelfTried) && isRightOpt;
                        const isWrongChosen = hasSelfTried && selfChosen === optIdx && !isRightOpt;

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={showPreviewAnswers || hasSelfTried}
                            onClick={() => {
                              if (showPreviewAnswers || hasSelfTried) return;
                              setPreviewSelfAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                              if (optIdx !== q.correctIndex) {
                                recordMistake({
                                  id: q.id,
                                  examTag: q.examTag,
                                  category: activeExam.region === 'jharkhand' ? 'jharkhand_gk' : 'india_gk',
                                  question: q.question,
                                  santaliNote: q.santaliNote,
                                  options: [...q.options],
                                  correctIndex: q.correctIndex,
                                  explanation: q.explanation
                                });
                              }
                            }}
                            className={`text-left px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors ${
                              isAnsHighlight
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                                : isWrongChosen
                                ? 'bg-rose-50 border-rose-400 text-rose-900 font-semibold'
                                : !showPreviewAnswers && !hasSelfTried
                                ? 'bg-slate-50 hover:bg-sky-50 hover:border-sky-300 border-slate-200 text-slate-800 cursor-pointer'
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <span>
                              <strong className="font-mono text-xs mr-2 text-slate-500">
                                ({String.fromCharCode(65 + optIdx)})
                              </strong>
                              {opt}
                            </span>
                            {isAnsHighlight && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                            {isWrongChosen && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {(showPreviewAnswers || previewSelfAnswers[q.id] !== undefined) && (
                      <div
                        className={`p-3 rounded-xl border text-xs leading-relaxed ${
                          !showPreviewAnswers && previewSelfAnswers[q.id] !== q.correctIndex
                            ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                            : 'bg-amber-50/70 border-amber-200 text-slate-700'
                        }`}
                      >
                        {!showPreviewAnswers && previewSelfAnswers[q.id] !== undefined && (
                          <div className="font-bold mb-1">
                            {previewSelfAnswers[q.id] === q.correctIndex ? (
                              <span className="text-emerald-800">✓ आपका चयन सही है!</span>
                            ) : (
                              <span className="text-rose-800">
                                ✗ आपका चयन गलत है — सही उत्तर ({String.fromCharCode(65 + q.correctIndex)}) है।
                              </span>
                            )}
                          </div>
                        )}
                        <strong className="text-amber-950">सही उत्तर ({String.fromCharCode(65 + q.correctIndex)}) — व्याख्या:</strong>{' '}
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Action Bar */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  इस पेपर में शफ़ल विकल्पों व रियल टाइमर के साथ अभ्यास करें:
                </span>
                <button
                  onClick={() => handleLaunchPaperCbt(activeExam.id, selectedPaperSlot)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer"
                >
                  <span>इस पेपर का लाइव CBT मॉक टेस्ट प्रारंभ करें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: CUSTOM NO-REPEAT CBT CONFIGURATION                         */}
        {/* ================================================================= */}
        {phase === 'setup' && hubSection === 'custom_cbt' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-700" />
                <h2 className="text-lg font-bold text-slate-900">
                  परीक्षा नियम व सेटअप चुनें (Configure Real No-Repeat Test)
                </h2>
              </div>
              <button
                onClick={handleResetQuestionPool}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                title="देखे जा चुके प्रश्नों का इतिहास साफ़ करें"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>प्रश्न पूल रीसेट ({usedIds.size} हल किए गए)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">1. प्रश्नों की संख्या (Number of Questions):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 30, 50].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className={`py-2.5 rounded-xl font-mono font-bold border transition-colors cursor-pointer ${
                        questionCount === num
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num} प्रश्न
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">2. परीक्षा समय सीमा (Real Time Limit):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 20, 30].map((min) => (
                    <button
                      key={min}
                      onClick={() => setDurationMinutes(min)}
                      className={`py-2.5 rounded-xl font-mono font-bold border transition-colors cursor-pointer ${
                        durationMinutes === min
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {min} मिनट
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">3. सही उत्तर अंक (Marks per Question):</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMarksPerCorrect(m)}
                      className={`py-2.5 rounded-xl font-mono font-bold border transition-colors cursor-pointer ${
                        marksPerCorrect === m
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      +{m} अंक
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">4. नेगेटिव मार्किंग (Negative Marking):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: 0, label: 'कोई नहीं (0)' },
                    { val: 0.25, label: '-0.25' },
                    { val: 0.5, label: '-0.50' },
                    { val: 1, label: '-1.0' }
                  ].map((neg) => (
                    <button
                      key={neg.val}
                      onClick={() => setNegativeMark(neg.val)}
                      className={`py-2.5 rounded-xl font-mono font-bold border transition-colors cursor-pointer ${
                        negativeMark === neg.val
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {neg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-800 block">5. विषय चुनें (India + Jharkhand + Santali):</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all' as const, label: `सभी विषय (${allQuestionsBank.length})` },
                  { id: 'india_gk' as const, label: 'भारत GK / SSC / UPSC / Banking / Rail' },
                  { id: 'jharkhand_gk' as const, label: 'झारखंड विशेष (JPSC / JSSC / CNT-SPT)' },
                  { id: 'literature' as const, label: 'संताली साहित्य व लेखक' },
                  { id: 'grammar' as const, label: 'संताली व्याकरण (रोनौड़)' },
                  { id: 'culture' as const, label: 'संताली संस्कृति व स्वशासन' },
                  { id: 'history' as const, label: 'संथाल हूल व संविधान' },
                  { id: 'vocabulary' as const, label: 'संताली शब्द-अर्थ' }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub.id)}
                    className={`px-3.5 py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                      selectedSubject === sub.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-800 block">6. परीक्षा इंटरफ़ेस मोड (Exam Display Mode):</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setExamDisplayMode('cbt')}
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    examDisplayMode === 'cbt'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold">1. लाइव CBT स्क्रीन (1 प्रश्न प्रति स्क्रीन)</div>
                  <div className={`text-[11px] mt-0.5 ${examDisplayMode === 'cbt' ? 'text-slate-300' : 'text-slate-500'}`}>
                    SSC / JSSC ऑनलाइन परीक्षा जैसा प्रश्न पैलेट व नेविगेशन
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setExamDisplayMode('omr')}
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer flex items-start gap-2.5 ${
                    examDisplayMode === 'omr'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Grid className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold">2. ऑफ़लाइन OMR बबल शीट (A/B/C/D गोले)</div>
                    <div className={`text-[11px] mt-0.5 ${examDisplayMode === 'omr' ? 'text-slate-300' : 'text-slate-500'}`}>
                      UPSC / JPSC पेन-पेपर जैसी पूरी OMR बबल शीट पर गोला भरें
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-700 space-y-1">
                <div className="font-bold text-slate-900">
                  कुल पूर्णांक:{' '}
                  <span className="font-mono tabular-nums text-amber-900">
                    {questionCount * marksPerCorrect} अंक
                  </span>{' '}
                  · समय: <span className="font-mono tabular-nums">{durationMinutes} मिनट</span> · नेगेटिव:{' '}
                  <span className="font-mono tabular-nums">{negativeMark === 0 ? 'नहीं' : `-${negativeMark}`}</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  * सभी विकल्प और प्रश्न हर टेस्ट में शफ़ल होंगे और पहले पूछे जा चुके सवाल दोबारा नहीं आएँगे।
                </p>
              </div>

              <button
                onClick={handleStartCustomExam}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>वास्तविक परीक्षा शुरू करें (Start Test)</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* PHASE 2: LIVE CBT OR OMR BUBBLE SHEET EXAM INTERFACE    */}
        {/* ======================================================= */}
        {phase === 'running' && currentQ && (
          <div className="space-y-4">
            {/* Live Mode Switcher Bar */}
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="font-bold text-slate-800">{activeCbtTitle}</div>
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setExamDisplayMode('cbt')}
                  className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                    examDisplayMode === 'cbt' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  CBT 1-by-1
                </button>
                <button
                  onClick={() => setExamDisplayMode('omr')}
                  className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1 cursor-pointer ${
                    examDisplayMode === 'omr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>OMR बबल शीट</span>
                </button>
              </div>
            </div>

            {examDisplayMode === 'omr' ? (
              /* OMR BUBBLE SHEET VIEW */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left: Full Question Paper Scroll */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 max-h-[760px] overflow-y-auto">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900">प्रश्न-पुस्तिका ({examQuestions.length} प्रश्न)</h2>
                    <span className="text-xs text-slate-500">दाईं ओर OMR शीट में गोले भरें</span>
                  </div>
                  {examQuestions.map((q, qIdx) => (
                    <div key={q.id} className="pb-4 border-b border-slate-100 last:border-b-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-slate-900 leading-snug">
                          <span className="font-mono text-amber-800 mr-1.5">Q.{qIdx + 1}</span>
                          {q.question}
                        </p>
                        <button
                          onClick={() =>
                            speakWithFemaleVoice(`${q.question}। ${q.options.join('। ')}`, {
                              autoDetectLanguage: true
                            })
                          }
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 cursor-pointer"
                          title="प्रश्न सुनें"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700 pl-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="py-1">
                            <strong className="font-mono text-slate-500 mr-1.5">
                              ({String.fromCharCode(65 + optIdx)})
                            </strong>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Authentic OMR Bubble Sheet */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 lg:sticky lg:top-24">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Grid className="w-4 h-4 text-amber-700" />
                        <span>OMR उत्तर-पत्रक (Bubble Sheet)</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                        भरे गए गोले: {Object.keys(answers).length} / {examQuestions.length}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                    {examQuestions.map((q, qIdx) => {
                      const chosen = answers[q.id];
                      const isRev = Boolean(markedReview[q.id]);
                      return (
                        <div
                          key={q.id}
                          className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border ${
                            chosen !== undefined
                              ? 'bg-amber-50/40 border-amber-200'
                              : 'bg-slate-50/70 border-slate-200'
                          }`}
                        >
                          <span className="font-mono text-xs font-bold text-slate-700 w-9 shrink-0">
                            {String(qIdx + 1).padStart(2, '0')}
                          </span>
                          <div className="flex items-center gap-2.5">
                            {[0, 1, 2, 3].map((optIdx) => {
                              const filled = chosen === optIdx;
                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() =>
                                    setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                  }
                                  className={`w-8 h-8 rounded-full border-2 font-mono text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                                    filled
                                      ? 'bg-slate-900 border-slate-900 text-white'
                                      : 'bg-white border-slate-400 text-slate-700 hover:border-slate-900'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setMarkedReview((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                              }
                              title="समीक्षा चिह्न"
                              className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                                isRev ? 'bg-purple-100 text-purple-800' : 'text-slate-400 hover:text-slate-700'
                              }`}
                            >
                              <Flag className="w-3.5 h-3.5" />
                            </button>
                            {chosen !== undefined && (
                              <button
                                type="button"
                                onClick={() =>
                                  setAnswers((prev) => {
                                    const next = { ...prev };
                                    delete next[q.id];
                                    return next;
                                  })
                                }
                                title="साफ़ करें"
                                className="px-1.5 py-1 rounded text-[11px] font-bold text-slate-500 hover:text-rose-700 cursor-pointer"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setShowSubmitConfirm(true)}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer"
                    >
                      OMR शीट सबमिट करें (Finish Exam)
                    </button>
                    <button
                      onClick={() => setPhase('setup')}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                    >
                      बाहर निकलें (Back)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* STANDARD 1-BY-1 CBT INTERFACE */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500">{activeCbtTitle}</div>
                  <div className="flex flex-wrap items-center gap-2 font-bold text-slate-800">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 font-mono tabular-nums">
                      प्रश्न {currentIdx + 1} / {examQuestions.length}
                    </span>
                    <span className="text-amber-800">{currentQ.examTag}</span>
                    <span className="font-mono text-emerald-700">+{marksPerCorrect}</span>
                    {negativeMark > 0 && <span className="font-mono text-rose-700">-{negativeMark}</span>}
                  </div>
                </div>

                <button
                  onClick={() =>
                    speakWithFemaleVoice(`${currentQ.question}। ${currentQ.options.join('। ')}`, {
                      autoDetectLanguage: true
                    })
                  }
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                  <span>प्रश्न सुनें</span>
                </button>
              </div>

              <div className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{currentQ.question}</h2>
                {currentQ.santaliNote && (
                  <p className="text-xs text-amber-800 font-medium">{currentQ.santaliNote}</p>
                )}
              </div>

              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = answers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: idx }))}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50 border-sky-600 text-sky-950 font-bold ring-2 ring-sky-200'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-sky-600 bg-sky-600' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span>
                          <span className="font-mono mr-2 text-xs font-bold text-slate-500">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          {opt}
                        </span>
                      </span>
                      {isSelected && (
                        <span className="text-[11px] font-bold text-sky-700 shrink-0">चयनित</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      setMarkedReview((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))
                    }
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                      markedReview[currentQ.id]
                        ? 'bg-purple-100 border-purple-400 text-purple-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{markedReview[currentQ.id] ? 'समीक्षा चिह्नित' : 'पुनः समीक्षा (Review)'}</span>
                  </button>

                  {answers[currentQ.id] !== undefined && (
                    <button
                      onClick={() =>
                        setAnswers((prev) => {
                          const next = { ...prev };
                          delete next[currentQ.id];
                          return next;
                        })
                      }
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      चयन साफ़ करें (Clear)
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    ← पिछला
                  </button>

                  {currentIdx < examQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIdx((i) => Math.min(examQuestions.length - 1, i + 1))}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      सहेजें व अगला →
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSubmitConfirm(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      परीक्षा सबमिट करें ✓
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar: OMR Palette */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">OMR प्रश्न पैलेट</h3>
                <p className="text-xs text-slate-500 font-mono tabular-nums">
                  उत्तरित: {Object.keys(answers).length} / {examQuestions.length}
                </p>
              </div>

              <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                {examQuestions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isMarked = Boolean(markedReview[q.id]);
                  let cls = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (isMarked && isAnswered) cls = 'bg-indigo-600 text-white border-indigo-600';
                  else if (isMarked) cls = 'bg-purple-600 text-white border-purple-600';
                  else if (isAnswered) cls = 'bg-emerald-600 text-white border-emerald-600';
                  if (idx === currentIdx) cls += ' ring-2 ring-amber-500 ring-offset-1';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`py-2 rounded-lg border text-xs font-mono font-bold cursor-pointer ${cls}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> उत्तरित
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-purple-600 inline-block" /> समीक्षा चिह्नित
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-200 inline-block" /> अनुत्तरित
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer"
                >
                  अंतिम परीक्षा सबमिट करें (Finish Exam)
                </button>
                <button
                  onClick={() => setPhase('setup')}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  परीक्षा बाहर निकलें (Back)
                </button>
              </div>
            </div>
          </div>
            )}
          </div>
        )}

        {/* Inline Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowSubmitConfirm(false)}
          >
            <div
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-slate-900">क्या आप परीक्षा सबमिट करना चाहते हैं?</h3>
              <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1 font-mono tabular-nums">
                <div>कुल प्रश्न: <strong>{examQuestions.length}</strong></div>
                <div>हल किए गए: <strong className="text-emerald-700">{Object.keys(answers).length}</strong></div>
                <div>छोड़े गए: <strong className="text-rose-700">{examQuestions.length - Object.keys(answers).length}</strong></div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  वापस लौटें
                </button>
                <button
                  onClick={submitExam}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  हाँ, परिणाम देखें →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* PHASE 3: RESULT SCORECARD & FULL SOLUTION REVIEW        */}
        {/* ======================================================= */}
        {phase === 'result' && (
          <div className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      परीक्षा परिणाम पत्रक — {activeCbtTitle}
                    </h2>
                    <p className="text-xs text-slate-500">
                      सही (+{marksPerCorrect}) · नेगेटिव ({negativeMark === 0 ? '0' : `-${negativeMark}`}) · लिया गया समय: {formatTime(resultMetrics.timeTaken)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setHubSection('mistake_bank');
                      setPhase('setup');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-900 text-xs font-bold cursor-pointer"
                  >
                    गलत प्रश्न बैंक ({mistakeBank.length})
                  </button>
                  <button
                    onClick={() => {
                      setHubSection('exams_directory');
                      setPhase('setup');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
                  >
                    2026 परीक्षा सूची
                  </button>
                  <button
                    onClick={() => setPhase('setup')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>नया टेस्ट / दूसरा पेपर दें</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="text-[11px] font-semibold text-amber-800">प्राप्तांक (Score)</div>
                  <div className="text-xl font-black font-mono tabular-nums text-amber-950">
                    {resultMetrics.rawScore} / {resultMetrics.totalMarks}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[11px] font-semibold text-emerald-800">सही उत्तर</div>
                  <div className="text-xl font-black font-mono tabular-nums text-emerald-700">
                    {resultMetrics.correct}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                  <div className="text-[11px] font-semibold text-rose-800">गलत उत्तर</div>
                  <div className="text-xl font-black font-mono tabular-nums text-rose-700">
                    {resultMetrics.wrong}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-600">अनुत्तरित</div>
                  <div className="text-xl font-black font-mono tabular-nums text-slate-800">
                    {resultMetrics.unattempted}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
                  <div className="text-[11px] font-semibold text-sky-800">सटीकता (Accuracy)</div>
                  <div className="text-xl font-black font-mono tabular-nums text-sky-900">
                    {resultMetrics.accuracy}%
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900">विस्तृत उत्तर-कुंजी व व्याख्या (Solutions):</h3>
              {examQuestions.map((q, idx) => {
                const chosen = answers[q.id];
                const isCorrect = chosen === q.correctIndex;
                const isSkipped = chosen === undefined;

                return (
                  <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isSkipped
                              ? 'bg-slate-100 text-slate-700'
                              : isCorrect
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-rose-100 text-rose-900'
                          }`}
                        >
                          प्रश्न {idx + 1} ·{' '}
                          {isSkipped
                            ? 'छोड़ा गया (0)'
                            : isCorrect
                            ? `सही (+${marksPerCorrect})`
                            : `गलत (-${negativeMark})`}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{q.question}</h4>
                      </div>
                      <button
                        onClick={() =>
                          speakWithFemaleVoice(
                            `${q.question}। सही उत्तर: ${q.options[q.correctIndex]}। ${q.explanation}`,
                            { autoDetectLanguage: true }
                          )
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                        <span>सुनें</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const rightOpt = optIdx === q.correctIndex;
                        const userOpt = optIdx === chosen;
                        return (
                          <div
                            key={optIdx}
                            className={`px-3 py-2 rounded-xl border flex items-center justify-between ${
                              rightOpt
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                                : userOpt
                                ? 'bg-rose-50 border-rose-400 text-rose-900'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span>
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </span>
                            {rightOpt && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                            {userOpt && !rightOpt && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-xs text-slate-700 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                      <strong>व्याख्या:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: MISTAKE BANK & SUBJECT-WISE ANALYTICS                      */}
        {/* ================================================================= */}
        {phase === 'setup' && hubSection === 'mistake_bank' && (
          <div className="space-y-5">
            {/* Subject-wise Performance Analytics Panel */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-sky-700" />
                    <span>विषय-वार प्रदर्शन एनालिटिक्स (Subject Analytics)</span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    आपके द्वारा दिए गए CBT व OMR परीक्षाओं की वास्तविक सटीकता और औसत समय रिपोर्ट।
                  </p>
                </div>
                <button
                  onClick={() => setSubjectAnalytics({})}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  एनालिटिक्स रीसेट करें
                </button>
              </div>

              {(Object.keys(SUBJECT_LABELS_HI) as ExamCategory[]).every(
                (cat) => !subjectAnalytics[cat]?.attempted
              ) ? (
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 space-y-2">
                  <p className="font-semibold">
                    अभी तक कोई CBT या OMR टेस्ट सबमिट नहीं हुआ है — एक टेस्ट हल करते ही हर विषय की सटीकता (%) यहाँ दिखेगी।
                  </p>
                  <button
                    onClick={() => setHubSection('custom_cbt')}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer"
                  >
                    अभी कस्टम CBT टेस्ट शुरू करें →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(Object.keys(SUBJECT_LABELS_HI) as ExamCategory[]).map((cat) => {
                    const st = subjectAnalytics[cat];
                    if (!st || st.attempted === 0) return null;
                    const acc = Math.round((st.correct / st.attempted) * 100);
                    const avgSec = Math.round(st.timeSec / st.attempted);
                    return (
                      <div
                        key={cat}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-slate-900">{SUBJECT_LABELS_HI[cat]}</span>
                          <span className="font-mono tabular-nums font-bold text-slate-900">
                            {acc}% सटीक
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              acc >= 75 ? 'bg-emerald-600' : acc >= 50 ? 'bg-amber-500' : 'bg-rose-600'
                            }`}
                            style={{ width: `${acc}%` }}
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono tabular-nums text-slate-600">
                          <span>कुल हल: {st.attempted}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 font-semibold">सही: {st.correct}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-rose-700 font-semibold">गलत: {st.wrong}</span>
                          <span aria-hidden="true">·</span>
                          <span>औसत: {avgSec}s/प्रश्न</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Mistake Bank Panel */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>गलत प्रश्न बैंक (Mistake Bank · {mistakeBank.length} प्रश्न)</span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    टेस्ट और सेल्फ-चेक में गलत हुए प्रश्न यहाँ अपने-आप सहेजे जाते हैं। री-टेस्ट में सही उत्तर देते ही प्रश्न यहाँ से क्लियर हो जाएगा।
                  </p>
                </div>

                {mistakeBank.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setMistakeBank([])}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>सब साफ़ करें</span>
                    </button>
                    <button
                      onClick={handleLaunchMistakeRetest}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>गलत प्रश्नों का री-टेस्ट शुरू करें</span>
                    </button>
                  </div>
                )}
              </div>

              {mistakeBank.length === 0 ? (
                <div className="p-8 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-emerald-950">
                    आपका गलत प्रश्न बैंक अभी खाली है!
                  </p>
                  <p className="text-xs text-emerald-800">
                    जैसे ही आप किसी परीक्षा में कोई प्रश्न गलत करेंगे, वह त्वरित रिवीज़न के लिए यहाँ जुड़ जाएगा।
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mistakeBank.map((m, idx) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-mono font-bold text-slate-800">#{idx + 1}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-amber-800">{m.examTag}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-rose-700 font-semibold">
                              गलत बार: {m.wrongCount}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900">{m.question}</h3>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() =>
                              speakWithFemaleVoice(
                                `${m.question}। सही उत्तर: ${m.options[m.correctIndex]}। ${m.explanation}`,
                                { autoDetectLanguage: true }
                              )
                            }
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                            title="प्रश्न व सही उत्तर सुनें"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                          </button>
                          <button
                            onClick={() =>
                              setMistakeBank((prev) => prev.filter((item) => item.id !== m.id))
                            }
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 text-slate-500 hover:text-rose-700 cursor-pointer"
                            title="हटाएँ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                        <strong>
                          सही उत्तर ({String.fromCharCode(65 + m.correctIndex)}): {m.options[m.correctIndex]}
                        </strong>
                        <p className="text-slate-700 mt-1">{m.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
