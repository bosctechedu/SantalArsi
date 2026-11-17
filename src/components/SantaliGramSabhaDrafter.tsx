import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  FileText,
  Copy,
  Check,
  Printer,
  Download,
  Edit3,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  Square,
  Save,
  Trash2,
  Users,
  Plus,
  BookmarkCheck,
  MessageSquareShare,
  FolderOpen,
  Mic,
  MicOff,
  Stamp,
  PenLine,
  Map as MapIcon,
  Calculator,
  GitBranch,
  ClipboardList,
  Receipt,
  Upload,
  Languages
} from 'lucide-react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';

type DocTemplateKey =
  | 'gram_sabha'
  | 'vanshavali'
  | 'fra_claim'
  | 'jaher_protection'
  | 'community_bdo'
  | 'certificate_rec'
  | 'rti_application'
  | 'bilingual_notice'
  | 'mgnrega_water'
  | 'electricity_transformer'
  | 'school_anganwadi'
  | 'crop_disaster_relief'
  | 'pesa_land_protection'
  | 'vhsc_health_sanitation';

type PrintFontSize = 'compact' | 'normal' | 'large';
type LanguageMode = 'hindi' | 'bilingual_hi_san' | 'trilingual';
type EditorSectionTab = 'basic' | 'tables' | 'sign_stamp' | 'register';
type ApplicationStatus = 'तैयार' | 'जमा किया गया' | 'जांच जारी' | 'स्वीकृत' | 'पुनः आवेदन';

interface AttendanceMember {
  id: string;
  name: string;
  roleOrClan: string;
}

interface LandPlotRow {
  id: string;
  khataNo: string;
  plotNo: string;
  area: string;
  north: string;
  south: string;
  east: string;
  west: string;
}

interface EstimateRow {
  id: string;
  item: string;
  quantity: string;
  amount: number;
}

interface LineageRow {
  id: string;
  generation: string;
  name: string;
  relation: string;
}

interface RegisterEntry {
  id: string;
  refNumber: string;
  docDate: string;
  templateLabel: string;
  village: string;
  applicantName: string;
  subject: string;
  status: ApplicationStatus;
  remarks: string;
}

interface SavedDraft {
  id: string;
  savedAt: string;
  title: string;
  templateKey: DocTemplateKey;
  refNumber: string;
  docDate: string;
  village: string;
  tola: string;
  panchayat: string;
  block: string;
  district: string;
  stateName: string;
  recipient: string;
  applicantName: string;
  guardianName: string;
  clan: string;
  mobileNo: string;
  majhiName: string;
  subjectDetail: string;
  selectedEnclosures: string[];
  attendanceList: AttendanceMember[];
  includeAttendanceTable: boolean;
  blankAttendanceRows: number;
  isDirectEdit: boolean;
  customBodyOverride: string;
  languageMode?: LanguageMode;
  includeLandTable?: boolean;
  landPlots?: LandPlotRow[];
  includeEstimateTable?: boolean;
  beneficiaryFamilies?: string;
  estimateRows?: EstimateRow[];
  includeLineageTable?: boolean;
  lineageRows?: LineageRow[];
  includeStamp?: boolean;
  stampTitle?: string;
  includeReceiptSlip?: boolean;
}

const STORAGE_DRAFTS_KEY = 'hor_katha_gram_sabha_drafts';
const STORAGE_VILLAGE_PROFILE_KEY = 'hor_katha_gram_profile';
const STORAGE_REGISTER_KEY = 'hor_katha_gram_sabha_register';

const CLAN_OPTIONS = [
  'मुर्मू (Murmu)',
  'हांसदा (Hansda)',
  'सोरेन (Soren)',
  'हेम्ब्रम (Hembram)',
  'मांडी (Marndi)',
  'किस्कू (Kisku)',
  'टुडू (Tudu)',
  'बास्के (Baskey)',
  'बेसरा (Besra)',
  'चौड़े (Chonre)',
  'पौरिया (Pauria)',
  'बेदिया (Bedia)'
];

const TEMPLATE_META: {
  id: DocTemplateKey;
  label: string;
  officialTitle: string;
  santaliDev: string;
  santaliRoman: string;
  defaultRecipient: string;
  defaultSubject: string;
}[] = [
  {
    id: 'gram_sabha',
    label: 'ग्राम सभा प्रस्ताव',
    officialTitle: 'ग्राम सभा प्रस्ताव पत्र (PESA / परंपरागत स्वशासन)',
    santaliDev: 'आतु कुलही दुपुब एवं ग्राम सभा निस्पाती',
    santaliRoman: 'Atu Kulhi Dupub ar Gram Sabha Nispati',
    defaultRecipient: 'अध्यक्ष / सचिव, ग्राम सभा एवं प्रखंड विकास पदाधिकारी महोदय',
    defaultSubject: 'गाँव में डाड़ी-पुखरी जल संरक्षण, सौर स्ट्रीट लाइट एवं संपर्क सड़क मरम्मत कार्य'
  },
  {
    id: 'vanshavali',
    label: 'मांझी वंशावली सत्यापन',
    officialTitle: 'मांझी हाड़ाम वंशावली एवं पारिवारिक पहचान सत्यापन पत्र',
    santaliDev: 'मांझी हाड़ाम होराते पारिस व वंशावली पोरमान साकाम',
    santaliRoman: 'Majhi Haram horate Paris ar Vanshavali Porman Sakam',
    defaultRecipient: 'संबंधित अंचलाधिकारी / राजस्व एवं प्रमाण-पत्र निर्गत प्राधिकार महोदय',
    defaultSubject: 'वंशावली, पारिस (गोत्र) एवं स्थायी मूल निवास सत्यापन'
  },
  {
    id: 'fra_claim',
    label: 'वन अधिकार (FRA) दावा',
    officialTitle: 'सामुदायिक वन संसाधन (CFR) अधिकार दावा प्रपत्र — वन अधिकार अधिनियम 2006',
    santaliDev: 'बिर-बुरु सामुदायिक हक एवं संरक्षण दावा पत्र',
    santaliRoman: 'Bir-Buru Samudayik Hok ar Rakhia Dawa Sakam',
    defaultRecipient: 'अध्यक्ष / सचिव, वन अधिकार समिति (FRC) एवं अनुमंडल स्तरीय समिति',
    defaultSubject: 'पारंपरिक वन क्षेत्र, जाहेर थान, गोचर भूमि एवं वनोपज संरक्षण का सामुदायिक वन अधिकार'
  },
  {
    id: 'jaher_protection',
    label: 'जाहेर थान संरक्षण',
    officialTitle: 'जाहेर थान एवं ससनदीरी पवित्र स्थल संरक्षण हेतु आवेदन पत्र',
    santaliDev: 'जाहेर थान आर ससनदीरी जोग़ाव आर साजाव नेहोर',
    santaliRoman: 'Jaher Than ar Sasandiri Jogaw ar Sajaw Nehor',
    defaultRecipient: 'प्रखंड विकास पदाधिकारी / अंचलाधिकारी / जिला कल्याण पदाधिकारी महोदय',
    defaultSubject: 'पावन जाहेर थान एवं पूर्वज स्मृति स्थल की चारदीवारी, साल वृक्ष संरक्षण व पेयजल व्यवस्था'
  },
  {
    id: 'community_bdo',
    label: 'प्रखंड / सामुदायिक आवेदन',
    officialTitle: 'सामुदायिक जन-सुविधा एवं विकास कार्य हेतु आवेदन पत्र',
    santaliDev: 'आतु लाहाती आर आम सुविधा लागीत नेहोर साकाम',
    santaliRoman: 'Atu Lahati ar Aam Subidha Lagit Nehor Sakam',
    defaultRecipient: 'प्रखंड विकास पदाधिकारी (BDO) / मुखिया महोदय',
    defaultSubject: 'टोला में चापाकल / जल मीनार स्थापना, आवास एवं सामाजिक सुरक्षा पेंशन स्वीकृति'
  },
  {
    id: 'certificate_rec',
    label: 'जाति / निवास / छात्रवृत्ति',
    officialTitle: 'ग्राम प्रधान अनुशंसा पत्र (जाति / आवासीय / छात्रवृत्ति सत्यापन)',
    santaliDev: 'पाड़हाक गितिल / जाति आर आवासीय पोरमान अनुशंसा',
    santaliRoman: 'Parhak Gidra / Jati ar Awasiya Porman Anushansa',
    defaultRecipient: 'अंचलाधिकारी / जिला कल्याण एवं छात्रवृत्ति सत्यापन पदाधिकारी महोदय',
    defaultSubject: 'विद्यार्थी / आवेदक की अनुसूचित जनजाति (संताल), पारिस एवं स्थानीय निवास पुष्टि'
  },
  {
    id: 'rti_application',
    label: 'RTI जन-सूचना आवेदन',
    officialTitle: 'सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के अंतर्गत आवेदन पत्र',
    santaliDev: 'सरकारी काम आर हिसाब बुझ़ाव लागीत RTI नेहोर',
    santaliRoman: 'Sarkari Kami ar Hisab Bujhaw Lagit RTI Nehor',
    defaultRecipient: 'लोक सूचना पदाधिकारी (PIO), प्रखंड कार्यालय / ग्राम पंचायत कार्यालय',
    defaultSubject: 'ग्राम पंचायत में वित्तीय वर्ष के अंतर्गत स्वीकृत योजनाओं, मस्टर रोल एवं व्यय की प्रमाणित प्रति उपलब्ध कराने के संबंध में'
  },
  {
    id: 'bilingual_notice',
    label: 'द्विभाषी बैठक सूचना',
    officialTitle: 'ग्राम सभा / कुलही दुपुब बैठक की आम सूचना',
    santaliDev: 'सानाम आतु होड़ को चेताओ — कुलही दुपुब नेवता',
    santaliRoman: 'Sanam Atu Hor Ko Chetao — Kulhi Dupub Newta',
    defaultRecipient: 'समस्त ग्रामवासी, पंच, मांझी बाबा, जोग मांझी, नायके एवं महिला समूह सदस्य',
    defaultSubject: 'आगामी ग्राम सभा बैठक में योजना चयन, जल संरक्षण व सामुदायिक कार्यों पर सर्वसम्मति निर्णय हेतु अनिवार्य उपस्थिति'
  },
  {
    id: 'mgnrega_water',
    label: 'मनरेगा / आहर-पाइन',
    officialTitle: 'मनरेगा / पारंपरिक आहर-पाइन व डाड़ी जीर्णोद्धार कार्य मांग पत्र',
    santaliDev: 'कामी दाबी आर आतु दाअ जोग़ाव (आहर-बांध) नेहोर',
    santaliRoman: 'Kami Dabi ar Atu Daa Jogaw (Ahar-Bandh) Nehor',
    defaultRecipient: 'प्रखंड कार्यक्रम पदाधिकारी (BPO - मनरेगा) / पंचायत सचिव महोदय',
    defaultSubject: 'ग्राम में पारंपरिक आहर-पाइन सफाई, मेड़बंदी, वृक्षारोपण एवं जॉब कार्डधारियों को स्थानीय रोजगार उपलब्ध कराने हेतु कार्य मांग'
  },
  {
    id: 'electricity_transformer',
    label: 'बिजली व ट्रांसफार्मर',
    officialTitle: 'विद्युत आपूर्ति सुधार, नया ट्रांसफार्मर एवं पोल/तार मरम्मत आवेदन',
    santaliDev: 'बिजली बाती आर ट्रांसफार्मर सुधराव नेहोर साकाम',
    santaliRoman: 'Bijli Bati ar Transformer Sudhraw Nehor Sakam',
    defaultRecipient: 'कनीय विद्युत अभियंता (JE) / सहायक विद्युत अभियंता महोदय',
    defaultSubject: 'टोला में जले हुए ट्रांसफार्मर बदलने, जर्जर विद्युत तार ठीक करने एवं नियमित बिजली आपूर्ति बहाल करने हेतु'
  },
  {
    id: 'school_anganwadi',
    label: 'स्कूल / आंगनबाड़ी सुधार',
    officialTitle: 'विद्यालय एवं आंगनबाड़ी केंद्र सुविधा सुधार हेतु ग्राम सभा प्रस्ताव',
    santaliDev: 'इतुन आसड़ा आर आंगनबाड़ी सुधार लागीत निस्पाती',
    santaliRoman: 'Itun Asra ar Anganwadi Sudhar Lagit Nispati',
    defaultRecipient: 'प्रखंड शिक्षा प्रसार पदाधिकारी (BEEO) / बाल विकास परियोजना पदाधिकारी (CDPO)',
    defaultSubject: 'प्राथमिक विद्यालय व आंगनबाड़ी केंद्र में पेयजल, शौचालय, चाहरदीवारी एवं संताली शिक्षण सामग्री उपलब्ध कराने हेतु'
  },
  {
    id: 'crop_disaster_relief',
    label: 'फसल क्षति / आपदा राहत',
    officialTitle: 'फसल क्षति, सुखाड़ / ओलावृष्टि एवं प्राकृतिक आपदा मुआवज़ा आवेदन',
    santaliDev: 'चास-बास नुकसान आर आपदा राहत दाबी नेहोर',
    santaliRoman: 'Chas-Bas Nuksan ar Apda Rahat Dabi Nehor',
    defaultRecipient: 'अंचलाधिकारी (CO) / जिला कृषि पदाधिकारी / आपदा प्रबंधन शाखा',
    defaultSubject: 'अनियमित वर्षा / सुखाड़ / ओलावृष्टि / जंगली हाथी से हुई फसल व मकान क्षति का आकलन कर उचित मुआवज़ा प्रदान करने हेतु'
  },
  {
    id: 'pesa_land_protection',
    label: 'PESA भूमि व वन सुरक्षा',
    officialTitle: 'पांचवीं अनुसूची / PESA अधिनियम के अंतर्गत सामुदायिक भूमि व वन संरक्षण प्रस्ताव',
    santaliDev: 'आतु हासा आर बिर-बुरु रौक्खा लागीत ग्राम सभा रोक',
    santaliRoman: 'Atu Hasa ar Bir-Buru Rokkha Lagit Gram Sabha Bandhon',
    defaultRecipient: 'उपायुक्त / अनुमंडल पदाधिकारी (SDO) / वन प्रमंडल पदाधिकारी महोदय',
    defaultSubject: 'ग्राम की गोचर, मझियस, जाहेर एवं सामुदायिक वन भूमि पर अवैध कटाई व अतिक्रमण पर ग्राम सभा द्वारा रोक व संरक्षण'
  },
  {
    id: 'vhsc_health_sanitation',
    label: 'स्वास्थ्य व स्वच्छता (VHSC)',
    officialTitle: 'ग्राम स्वास्थ्य, पोषण एवं स्वच्छता समिति (VHSC) कार्य-योजना प्रस्ताव',
    santaliDev: 'आतु होड़ कोवाक हौड़मो सफा आर सावांस निस्पाती',
    santaliRoman: 'Atu Hor Kowak Hormo Sapha ar Sawans Nispati',
    defaultRecipient: 'प्रभारी चिकित्सा पदाधिकारी (MOIC) / प्रखंड समन्वयक (स्वास्थ्य व स्वच्छता)',
    defaultSubject: 'ग्राम में मलेरिया-डेंगू रोकथाम छिड़काव, कुआँ-चापाकल शुद्धिकरण, स्वास्थ्य शिविर व पोषण अभियान संचालन हेतु'
  }
];

const QUICK_ENCLOSURES = [
  'आधार कार्ड की स्व-अभिप्रमाणित छायाप्रति',
  'ग्राम सभा उपस्थिति पंजी व प्रस्ताव की प्रति',
  'मांझी हाड़ाम / ग्राम प्रधान द्वारा सत्यापित वंशावली',
  'भूमि खतियान / लगान रसीद की छायाप्रति',
  'पासपोर्ट आकार का फोटो एवं बैंक पासबुक प्रति',
  'मनरेगा जॉब कार्ड / राशन कार्ड की छायाप्रति'
];

const SUBJECT_QUICK_CHIPS = [
  'टोला में नए चापाकल / सोलर जल मीनार की स्थापना',
  'ग्राम संपर्क सड़क व कल्वर्ट पुलिया मरम्मत कार्य',
  'पारंपरिक आहर-पाइन व डाड़ी तालाब जीर्णोद्धार',
  'अबुआ / प्रधानमंत्री आवास योजना में योग्य परिवारों की सूची',
  'जाहेर थान की घेराबंदी एवं साल वृक्ष संरक्षण',
  'जले हुए ट्रांसफार्मर को बदलने व बिजली सुधार कार्य'
];

const CIVIC_SANTALI_TERMS = [
  { term: 'मांझी हाड़ाम', hint: 'ग्राम प्रधान' },
  { term: 'जोग मांझी', hint: 'उप-प्रधान' },
  { term: 'नायके बाबा', hint: 'ग्राम पुरोहित' },
  { term: 'गोडेत', hint: 'ग्राम संदेशवाहक' },
  { term: 'कुलही दुपुब', hint: 'ग्राम सभा बैठक' },
  { term: 'ससनदीरी', hint: 'पूर्वज स्मृति स्थल' }
];

function getTodayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDisplayDate(isoDate: string): string {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const SantaliGramSabhaDrafter: React.FC = () => {
  const savedProfile = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_VILLAGE_PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const [editorTab, setEditorTab] = useState<EditorSectionTab>('basic');
  const [templateKey, setTemplateKey] = useState<DocTemplateKey>('gram_sabha');
  const [languageMode, setLanguageMode] = useState<LanguageMode>('bilingual_hi_san');
  const [refNumber, setRefNumber] = useState('GS/2026/01');
  const [docDate, setDocDate] = useState(getTodayIsoDate);
  const [village, setVillage] = useState(savedProfile?.village || 'भोगनाडीह');
  const [tola, setTola] = useState(savedProfile?.tola || 'मांझी कुल्ही');
  const [panchayat, setPanchayat] = useState(savedProfile?.panchayat || 'भोगनाडीह पंचायत');
  const [block, setBlock] = useState(savedProfile?.block || 'बरहेट');
  const [district, setDistrict] = useState(savedProfile?.district || 'साहिबगंज');
  const [stateName, setStateName] = useState(savedProfile?.stateName || 'झारखंड');
  const [recipient, setRecipient] = useState(TEMPLATE_META[0].defaultRecipient);
  const [applicantName, setApplicantName] = useState('रामदास मुर्मू');
  const [guardianName, setGuardianName] = useState('स्व. सोमाय मुर्मू');
  const [clan, setClan] = useState(CLAN_OPTIONS[0]);
  const [mobileNo, setMobileNo] = useState('');
  const [majhiName, setMajhiName] = useState(savedProfile?.majhiName || 'सीताराम हांसदा');
  const [subjectDetail, setSubjectDetail] = useState(TEMPLATE_META[0].defaultSubject);

  // Enclosures
  const [selectedEnclosures, setSelectedEnclosures] = useState<string[]>([
    QUICK_ENCLOSURES[0],
    QUICK_ENCLOSURES[1]
  ]);
  const [customEnclosureInput, setCustomEnclosureInput] = useState('');

  // Feature: Land / Plot & Boundary Table
  const [includeLandTable, setIncludeLandTable] = useState(false);
  const [landPlots, setLandPlots] = useState<LandPlotRow[]>([
    {
      id: 'plot_1',
      khataNo: '42',
      plotNo: '118',
      area: '1.25 एकड़',
      north: 'सरकारी पोखर',
      south: 'जाहेर थान रास्ता',
      east: 'साल जंगल सीमा',
      west: 'ग्रामीण कृषि भूमि'
    }
  ]);

  // Feature: Beneficiary & Work Estimate Table
  const [includeEstimateTable, setIncludeEstimateTable] = useState(false);
  const [beneficiaryFamilies, setBeneficiaryFamilies] = useState('45 परिवार (लगभग 220 ग्रामवासी)');
  const [estimateRows, setEstimateRows] = useState<EstimateRow[]>([
    { id: 'est_1', item: 'मिट्टी खुदाई / मेड़बंदी कार्य', quantity: '1 इकाई', amount: 45000 },
    { id: 'est_2', item: 'पत्थर / ईंट पिचिंग व सामग्री', quantity: 'आवश्यकतानुसार', amount: 30000 }
  ]);

  // Feature: Lineage / Vanshavali Tree Table
  const [includeLineageTable, setIncludeLineageTable] = useState(false);
  const [lineageRows, setLineageRows] = useState<LineageRow[]>([
    { id: 'lin_1', generation: 'पीढ़ी 1 (पूर्वज / दादा)', name: 'स्व. बुधन मुर्मू', relation: 'मूल खतियानधारी / रैयत' },
    { id: 'lin_2', generation: 'पीढ़ी 2 (पिता)', name: 'स्व. सोमाय मुर्मू', relation: 'पुत्र' },
    { id: 'lin_3', generation: 'पीढ़ी 3 (आवेदक)', name: 'रामदास मुर्मू', relation: 'पौत्र / वर्तमान आवेदक' }
  ]);

  // Feature: Attendance & Witness Roster
  const [includeAttendanceTable, setIncludeAttendanceTable] = useState(true);
  const [blankAttendanceRows, setBlankAttendanceRows] = useState(3);
  const [attendanceList, setAttendanceList] = useState<AttendanceMember[]>([
    { id: 'att_1', name: 'सीताराम हांसदा', roleOrClan: 'मांझी हाड़ाम (अध्यक्ष)' },
    { id: 'att_2', name: 'बुधन सोरेन', roleOrClan: 'जोग मांझी' },
    { id: 'att_3', name: 'बाहामनी टुडू', roleOrClan: 'महिला समिति प्रतिनिधि' }
  ]);
  const [newAttName, setNewAttName] = useState('');
  const [newAttRole, setNewAttRole] = useState('');

  // Feature: Digital Signature Canvas & Official Stamp
  const [activeSigner, setActiveSigner] = useState<'applicant' | 'majhi'>('applicant');
  const [applicantSignatureDataUrl, setApplicantSignatureDataUrl] = useState<string>('');
  const [majhiSignatureDataUrl, setMajhiSignatureDataUrl] = useState<string>('');
  const [includeStamp, setIncludeStamp] = useState(true);
  const [stampTitle, setStampTitle] = useState('मांझी हाड़ाम · ग्राम सभा');
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Feature: Cut-Out Receiving Slip
  const [includeReceiptSlip, setIncludeReceiptSlip] = useState(true);

  // Feature: Voice-to-Text Dictation
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceStatusMsg, setVoiceStatusMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Feature: Saved Drafts + Application Register + Backup
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_DRAFTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [showDraftsPanel, setShowDraftsPanel] = useState(false);

  const [registerEntries, setRegisterEntries] = useState<RegisterEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_REGISTER_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const backupInputRef = useRef<HTMLInputElement | null>(null);

  // Print Customization & Edit Mode
  const [printFontSize, setPrintFontSize] = useState<PrintFontSize>('normal');
  const [isDirectEdit, setIsDirectEdit] = useState(false);
  const [customBodyOverride, setCustomBodyOverride] = useState('');
  const [isFullPreview, setIsFullPreview] = useState(false);
  const [copiedMode, setCopiedMode] = useState<'none' | 'full' | 'whatsapp'>('none');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 2600);
  };

  const activeTemplateMeta = useMemo(
    () => TEMPLATE_META.find((t) => t.id === templateKey) || TEMPLATE_META[0],
    [templateKey]
  );

  const formattedDate = useMemo(() => formatDisplayDate(docDate), [docDate]);

  const totalEstimateAmount = useMemo(
    () => estimateRows.reduce((acc, row) => acc + (Number(row.amount) || 0), 0),
    [estimateRows]
  );

  const handleSelectTemplate = (key: DocTemplateKey) => {
    const meta = TEMPLATE_META.find((t) => t.id === key);
    setTemplateKey(key);
    if (meta) {
      setRecipient(meta.defaultRecipient);
      setSubjectDetail(meta.defaultSubject);
    }
    if (key === 'fra_claim' || key === 'jaher_protection' || key === 'pesa_land_protection') {
      setIncludeLandTable(true);
    }
    if (key === 'vanshavali' || key === 'certificate_rec') {
      setIncludeLineageTable(true);
    }
    setIsDirectEdit(false);
    setCustomBodyOverride('');
  };

  // Voice-to-Text Hindi Dictation
  const handleToggleVoiceDictation = () => {
    if (isListeningVoice) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListeningVoice(false);
      return;
    }

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setVoiceStatusMsg('इस ब्राउज़र में वॉइस डिक्टेशन समर्थित नहीं है (Chrome / Edge का उपयोग करें)।');
      setTimeout(() => setVoiceStatusMsg(null), 3500);
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = 'hi-IN';
      rec.interimResults = false;
      rec.continuous = false;
      rec.onresult = (event: any) => {
        const transcript = event?.results?.[0]?.[0]?.transcript || '';
        if (transcript.trim()) {
          if (isDirectEdit) {
            setCustomBodyOverride((prev) => `${prev}${prev.endsWith(' ') || prev.endsWith('\n') ? '' : ' '}${transcript.trim()}`);
          } else {
            setSubjectDetail((prev) => `${prev}${prev.endsWith(' ') ? '' : ' '}${transcript.trim()}`);
          }
          showToast('बोलकर लिखा गया पाठ जोड़ दिया गया!');
        }
      };
      rec.onerror = () => {
        setIsListeningVoice(false);
        setVoiceStatusMsg('माइक्रोफ़ोन अनुमति या आवाज़ पहचान में समस्या आई।');
        setTimeout(() => setVoiceStatusMsg(null), 3000);
      };
      rec.onend = () => {
        setIsListeningVoice(false);
      };
      recognitionRef.current = rec;
      rec.start();
      setIsListeningVoice(true);
      setVoiceStatusMsg('सुन रहा हूँ... हिंदी में स्पष्ट बोलें');
    } catch {
      setIsListeningVoice(false);
    }
  };

  // Signature Canvas Handlers
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleSigPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const { x, y } = getCanvasPoint(e);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleSigPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = sigCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { x, y } = getCanvasPoint(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleSigPointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    if (activeSigner === 'applicant') {
      setApplicantSignatureDataUrl(dataUrl);
    } else {
      setMajhiSignatureDataUrl(dataUrl);
    }
  };

  const handleClearActiveSignature = () => {
    const canvas = sigCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (activeSigner === 'applicant') {
      setApplicantSignatureDataUrl('');
    } else {
      setMajhiSignatureDataUrl('');
    }
  };

  // Land Plot Handlers
  const handleAddLandPlot = () => {
    setLandPlots((prev) => [
      ...prev,
      {
        id: `plot_${Date.now()}`,
        khataNo: '',
        plotNo: '',
        area: '',
        north: '',
        south: '',
        east: '',
        west: ''
      }
    ]);
  };

  const handleUpdateLandPlot = (id: string, field: keyof LandPlotRow, value: string) => {
    setLandPlots((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleRemoveLandPlot = (id: string) => {
    setLandPlots((prev) => prev.filter((r) => r.id !== id));
  };

  // Estimate Handlers
  const handleAddEstimateRow = () => {
    setEstimateRows((prev) => [
      ...prev,
      { id: `est_${Date.now()}`, item: 'नया कार्य / सामग्री मद', quantity: '1 इकाई', amount: 0 }
    ]);
  };

  const handleUpdateEstimateRow = (id: string, field: keyof EstimateRow, value: string | number) => {
    setEstimateRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleRemoveEstimateRow = (id: string) => {
    setEstimateRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Lineage Handlers
  const handleAddLineageRow = () => {
    setLineageRows((prev) => [
      ...prev,
      { id: `lin_${Date.now()}`, generation: `पीढ़ी ${prev.length + 1}`, name: '', relation: '' }
    ]);
  };

  const handleUpdateLineageRow = (id: string, field: keyof LineageRow, value: string) => {
    setLineageRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleRemoveLineageRow = (id: string) => {
    setLineageRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Enclosures Handlers
  const toggleEnclosure = (item: string) => {
    setSelectedEnclosures((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleAddCustomEnclosure = () => {
    const clean = customEnclosureInput.trim();
    if (!clean) return;
    if (!selectedEnclosures.includes(clean)) {
      setSelectedEnclosures((prev) => [...prev, clean]);
    }
    setCustomEnclosureInput('');
  };

  // Attendance Handlers
  const handleAddAttendanceMember = () => {
    if (!newAttName.trim()) return;
    setAttendanceList((prev) => [
      ...prev,
      {
        id: `att_${Date.now()}`,
        name: newAttName.trim(),
        roleOrClan: newAttRole.trim() || 'ग्राम सदस्य'
      }
    ]);
    setNewAttName('');
    setNewAttRole('');
  };

  const handleRemoveAttendanceMember = (id: string) => {
    setAttendanceList((prev) => prev.filter((m) => m.id !== id));
  };

  // Village Profile & Drafts & Register
  const handleSaveVillageProfile = () => {
    try {
      localStorage.setItem(
        STORAGE_VILLAGE_PROFILE_KEY,
        JSON.stringify({ village, tola, panchayat, block, district, stateName, majhiName })
      );
      showToast('गाँव विवरण डिफ़ॉल्ट प्रोफ़ाइल के रूप में सहेजा गया!');
    } catch {
      // ignore
    }
  };

  const handleSaveDraft = () => {
    const newDraft: SavedDraft = {
      id: `draft_${Date.now()}`,
      savedAt: new Date().toLocaleDateString('hi-IN'),
      title: `${activeTemplateMeta.label} — ${village} (${applicantName})`,
      templateKey,
      refNumber,
      docDate,
      village,
      tola,
      panchayat,
      block,
      district,
      stateName,
      recipient,
      applicantName,
      guardianName,
      clan,
      mobileNo,
      majhiName,
      subjectDetail,
      selectedEnclosures,
      attendanceList,
      includeAttendanceTable,
      blankAttendanceRows,
      isDirectEdit,
      customBodyOverride,
      languageMode,
      includeLandTable,
      landPlots,
      includeEstimateTable,
      beneficiaryFamilies,
      estimateRows,
      includeLineageTable,
      lineageRows,
      includeStamp,
      stampTitle,
      includeReceiptSlip
    };
    const updated = [newDraft, ...savedDrafts].slice(0, 20);
    setSavedDrafts(updated);
    try {
      localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify(updated));
      showToast('आवेदन ड्राफ्ट सुरक्षित रूप से सेव हो गया!');
    } catch {
      // ignore
    }
  };

  const handleLoadDraft = (d: SavedDraft) => {
    setTemplateKey(d.templateKey);
    setRefNumber(d.refNumber);
    setDocDate(d.docDate);
    setVillage(d.village);
    setTola(d.tola);
    setPanchayat(d.panchayat);
    setBlock(d.block);
    setDistrict(d.district);
    setStateName(d.stateName);
    setRecipient(d.recipient);
    setApplicantName(d.applicantName);
    setGuardianName(d.guardianName);
    setClan(d.clan);
    setMobileNo(d.mobileNo);
    setMajhiName(d.majhiName);
    setSubjectDetail(d.subjectDetail);
    setSelectedEnclosures(d.selectedEnclosures || []);
    setAttendanceList(d.attendanceList || []);
    setIncludeAttendanceTable(d.includeAttendanceTable);
    setBlankAttendanceRows(d.blankAttendanceRows ?? 3);
    setIsDirectEdit(d.isDirectEdit);
    setCustomBodyOverride(d.customBodyOverride || '');
    if (d.languageMode) setLanguageMode(d.languageMode);
    if (typeof d.includeLandTable === 'boolean') setIncludeLandTable(d.includeLandTable);
    if (d.landPlots) setLandPlots(d.landPlots);
    if (typeof d.includeEstimateTable === 'boolean') setIncludeEstimateTable(d.includeEstimateTable);
    if (d.beneficiaryFamilies) setBeneficiaryFamilies(d.beneficiaryFamilies);
    if (d.estimateRows) setEstimateRows(d.estimateRows);
    if (typeof d.includeLineageTable === 'boolean') setIncludeLineageTable(d.includeLineageTable);
    if (d.lineageRows) setLineageRows(d.lineageRows);
    if (typeof d.includeStamp === 'boolean') setIncludeStamp(d.includeStamp);
    if (d.stampTitle) setStampTitle(d.stampTitle);
    if (typeof d.includeReceiptSlip === 'boolean') setIncludeReceiptSlip(d.includeReceiptSlip);
    setShowDraftsPanel(false);
    showToast('सहेजा गया ड्राफ्ट लोड हो गया!');
  };

  const handleDeleteDraft = (id: string) => {
    const updated = savedDrafts.filter((d) => d.id !== id);
    setSavedDrafts(updated);
    try {
      localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Register Actions
  const saveRegister = (next: RegisterEntry[]) => {
    setRegisterEntries(next);
    try {
      localStorage.setItem(STORAGE_REGISTER_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleAddToRegister = () => {
    const entry: RegisterEntry = {
      id: `reg_${Date.now()}`,
      refNumber: refNumber || '—',
      docDate,
      templateLabel: activeTemplateMeta.label,
      village,
      applicantName,
      subject: subjectDetail,
      status: 'तैयार',
      remarks: `प्रखंड: ${block}, जिला: ${district}`
    };
    saveRegister([entry, ...registerEntries]);
    showToast('आवेदन रजिस्टर में दर्ज हो गया!');
    setEditorTab('register');
  };

  const handleUpdateRegisterStatus = (id: string, status: ApplicationStatus) => {
    saveRegister(registerEntries.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const handleUpdateRegisterRemarks = (id: string, remarks: string) => {
    saveRegister(registerEntries.map((r) => (r.id === id ? { ...r, remarks } : r)));
  };

  const handleDeleteRegisterEntry = (id: string) => {
    saveRegister(registerEntries.filter((r) => r.id !== id));
  };

  const handleExportRegisterCsv = () => {
    const header = ['पत्रांक', 'दिनांक', 'प्रारूप', 'ग्राम', 'आवेदक', 'विषय', 'स्थिति', 'टिप्पणी'];
    const rows = registerEntries.map((r) =>
      [r.refNumber, formatDisplayDate(r.docDate), r.templateLabel, r.village, r.applicantName, r.subject, r.status, r.remarks]
        .map((val) => `"${String(val || '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = `\uFEFF${header.join(',')}\n${rows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gram_sabha_register_${getTodayIsoDate()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSON Backup & Restore
  const handleExportJsonBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      villageProfile: { village, tola, panchayat, block, district, stateName, majhiName },
      savedDrafts,
      registerEntries
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gram_sabha_backup_${getTodayIsoDate()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('सभी ड्राफ्ट और रजिस्टर बैकअप डाउनलोड हो गया!');
  };

  const handleImportJsonBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(String(ev.target?.result || '{}'));
        if (Array.isArray(parsed.savedDrafts)) {
          setSavedDrafts(parsed.savedDrafts);
          localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify(parsed.savedDrafts));
        }
        if (Array.isArray(parsed.registerEntries)) {
          saveRegister(parsed.registerEntries);
        }
        showToast('बैकअप सफलतापूर्वक रीस्टोर हो गया!');
      } catch {
        showToast('अमान्य बैकअप फ़ाइल। कृपया सही JSON फ़ाइल चुनें।');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const generatedBody = useMemo(() => {
    const fullAddress = `ग्राम (हातु): ${village || '________'}, टोला: ${tola || '________'}, पंचायत: ${panchayat || '________'}, प्रखंड/अंचल: ${block || '________'}, जिला: ${district || '________'} (${stateName || 'झारखंड'})`;
    const applicantLine = `${applicantName || '________'} (पिता/अभिभावक: ${guardianName || '________'}, पारिस/गोत्र: ${clan}${mobileNo ? `, मो.: ${mobileNo}` : ''})`;

    let hindiMain = '';
    if (templateKey === 'gram_sabha') {
      hindiMain = `सेवा में,
${recipient}
${block}, जिला: ${district} (${stateName})

विषय: ${subjectDetail} के संबंध में सर्वसम्मत ग्राम सभा प्रस्ताव।

जोहार!
आज दिनांक ${formattedDate} को ${fullAddress} के मांझी थान / अखड़ा प्रांगण में ग्राम प्रधान (मांझी हाड़ाम) श्री ${majhiName || '________'} की अध्यक्षता एवं समस्त ग्रामीणों की उपस्थिति में परंपरागत ग्राम सभा (PESA) की बैठक संपन्न हुई।

बैठक में विचार-विमर्श के उपरांत सर्वसम्मति से निम्नलिखित प्रस्ताव पारित किए गए:
1. ${subjectDetail} को ग्राम हित में सर्वोच्च प्राथमिकता के आधार पर स्वीकृत किया जाता है।
2. कार्य का संचालन, गुणवत्ता जांच एवं सामाजिक अंकेक्षण ग्राम सभा की चयनित निगरानी समिति द्वारा पारदर्शी रूप से किया जाएगा।
3. ग्राम के जल, जंगल, जमीन एवं पारंपरिक सामुदायिक अधिकारों की रक्षा सुनिश्चित की जाएगी।

अतः संबंधित विभाग से निवेदन है कि ग्राम सभा द्वारा पारित इस प्रस्ताव के अनुरूप आवश्यक प्रशासनिक स्वीकृति एवं क्रियान्वयन सुनिश्चित करने की कृपा करें।

प्रस्ताव प्रस्तुतकर्ता: ${applicantLine}`;
    } else if (templateKey === 'vanshavali') {
      hindiMain = `सेवा में,
${recipient}
प्रखंड/अंचल: ${block}, जिला: ${district} (${stateName})

विषय: ${subjectDetail} के संबंध में मांझी हाड़ाम सत्यापन पत्र।

जोहार!
प्रमाणित किया जाता है कि श्री/श्रीमती/सुश्री ${applicantLine}, ${fullAddress} के मूल एवं स्थायी निवासी हैं।

परंपरागत ग्राम अभिलेख (कुल्ही वंशावली) और ग्राम वासियों की प्रत्यक्ष साक्षी के अनुसार इनका परिवार पीढ़ियों से इस हातु से जुड़ा है तथा संताल समाज की परंपरा और पारिस मर्यादा का पालन करता है।

अतः आवेदक की वंशावली, पारिस पहचान एवं स्थायी निवास प्रमाण-पत्र निर्गत करने हेतु ग्राम सभा / मांझी हाड़ाम स्तर से यह सत्यापन पत्र संस्तुति सहित जारी किया जाता है।`;
    } else if (templateKey === 'fra_claim') {
      hindiMain = `सेवा में,
${recipient}
प्रखंड: ${block}, जिला: ${district} (${stateName})

विषय: ग्राम ${village} के पारंपरिक वन क्षेत्र, जाहेर थान एवं गोचर भूमि पर सामुदायिक वन संसाधन (CFR) अधिकार मान्यता हेतु दावा।

महोदय/महोदया,
अनुसूचित जनजाति और अन्य परंपरागत वन निवासी (वन अधिकारों की मान्यता) अधिनियम, 2006 की धारा 3(1)(झ) एवं नियम 4 के अंतर्गत ग्राम सभा ${village} (पता: ${fullAddress}; प्रमुख आवेदक: ${applicantLine}; मांझी हाड़ाम: ${majhiName}) निम्नलिखित पारंपरिक सामुदायिक वन उपयोग का दावा प्रस्तुत करती है:

1. सामुदायिक वन संसाधन क्षेत्र व उपयोग विवरण: ${subjectDetail}।
2. पारंपरिक चारागाह, महुआ-तसर, सूखी लकड़ी, कंद-मूल, वनौषधि संचयन एवं जाहेर वन संरक्षण परंपरा।
3. ग्राम सभा की सहमति से वन एवं जैव-विविधता संरक्षण प्रबंधन का दायित्व।

अतः अनुरोध है कि ग्राम सभा द्वारा पारित प्रस्ताव एवं संलग्न मानचित्र/साक्ष्यों के आधार पर सामुदायिक वन अधिकार पट्टा निर्गत करने की कृपा करें।`;
    } else if (templateKey === 'jaher_protection') {
      hindiMain = `सेवा में,
${recipient}
प्रखंड: ${block}, जिला: ${district} (${stateName})

विषय: ग्राम ${village} (${tola}) स्थित पावन जाहेर थान एवं ससनदीरी स्मृति स्थल की घेराबंदी व संरक्षण हेतु आवेदन।

जोहार!
सविनय निवेदन है कि ${fullAddress} स्थित जाहेर थान (पवित्र साल वन) एवं पूर्वज ससनदीरी स्थल संताल समाज की आस्था, बाहा-सोहराय पूजा और स्थानीय जैव-विविधता का प्रमुख केंद्र है। कार्य का विशेष विवरण: ${subjectDetail}।

ग्राम प्रधान (मांझी हाड़ाम) श्री ${majhiName} एवं समस्त ग्रामीणों की सर्वसम्मति से आपसे विनम्र अनुरोध है कि उक्त पावन स्थल की पारंपरिक मर्यादा को सुरक्षित रखते हुए संरक्षण, घेराबंदी एवं जन-सुविधा विकास की स्वीकृति प्रदान करने की कृपा करें।

भवदीय (ग्रामवासियों की ओर से): ${applicantLine}`;
    } else if (templateKey === 'community_bdo') {
      hindiMain = `सेवा में,
${recipient}
प्रखंड: ${block}, जिला: ${district} (${stateName})

विषय: ${subjectDetail} की स्वीकृति हेतु सामुदायिक / व्यक्तिगत आवेदन पत्र।

जोहार / महोदय,
सविनय निवेदन है कि मैं ${applicantLine}, ${fullAddress} का/की स्थायी निवासी हूँ। हमारे ग्राम/टोला में जनहित और आजीविका की दृष्टि से निम्न कार्य/सहायता अत्यंत आवश्यक है:

• मुख्य विवरण: ${subjectDetail}।

इस विषय पर ग्राम प्रधान श्री ${majhiName} एवं स्थानीय ग्रामीणों की सहमति भी प्राप्त है। अतः श्रीमान से विनम्र अनुरोध है कि स्थल जांच कर उपरोक्त कार्य/लाभ की त्वरित स्वीकृति प्रदान करने की कृपा करें।

भवदीय: ${applicantLine}`;
    } else if (templateKey === 'rti_application') {
      hindiMain = `सेवा में,
${recipient}
प्रखंड: ${block}, जिला: ${district} (${stateName})

विषय: सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के अंतर्गत जन-सूचना प्राप्त करने हेतु आवेदन।

महोदय/महोदया,
मैं ${applicantLine}, ${fullAddress} का निवासी, सूचना का अधिकार अधिनियम, 2005 के अंतर्गत निम्नलिखित सूचनाओं की प्रमाणित प्रति उपलब्ध कराने का अनुरोध करता/करती हूँ:

1. संबंधित विषय / कार्य: ${subjectDetail}।
2. कार्य से संबंधित प्राक्कलन (Estimate), स्वीकृति पत्र, मापी पुस्तिका (MB) एवं मस्टर रोल की प्रमाणित छायाप्रति।
3. ग्राम सभा प्रस्ताव एवं व्यय वाउचर का विवरण।

आवेदन शुल्क (₹10/- पोस्टल ऑर्डर / कोर्ट फ़ीस स्टाम्प या बीपीएल प्रमाण संलग्न है)। कृपया निर्धारित 30 दिनों की समय-सीमा के भीतर सूचना उपलब्ध कराएँ।

भवदीय आवेदक: ${applicantLine}`;
    } else if (templateKey === 'bilingual_notice') {
      hindiMain = `प्रेषक: ग्राम सभा एवं मांझी हाड़ाम कार्यालय, ग्राम ${village}
प्रति: ${recipient}

समस्त ग्रामवासियों को आम सूचना (कुलही दुपुब बैठक)!

जोहार!
आप सभी ग्रामवासियों (ग्राम: ${village}, टोला: ${tola}, पंचायत: ${panchayat}) को सूचित किया जाता है कि दिनांक ${formattedDate} को मांझी थान / अखड़ा प्रांगण में ग्राम प्रधान (मांझी हाड़ाम) श्री ${majhiName} की अध्यक्षता में विशेष कुलही दुपुब (ग्राम सभा बैठक) आयोजित की गई है।

बैठक का मुख्य उद्देश्य: ${subjectDetail}।

अतः प्रत्येक परिवार से कम से कम एक महिला एवं पुरुष सदस्य की उपस्थिति अनिवार्य है। समय पर उपस्थित होकर ग्राम विकास के निर्णय में सहभागी बनें।

आयोजन संयोजक: ${applicantLine}`;
    } else if (templateKey === 'mgnrega_water') {
      hindiMain = `सेवा में,
${recipient}
प्रखंड: ${block}, जिला: ${district} (${stateName})

विषय: ${subjectDetail}।

जोहार / महोदय,
सविनय निवेदन है कि ${fullAddress} के ग्रामीणों एवं मनरेगा जॉब कार्डधारियों को स्थानीय स्तर पर रोजगार उपलब्ध कराने तथा खेती व पेयजल संरक्षण के लिए निम्नलिखित पारंपरिक जल-स्रोत कार्य अत्यंत आवश्यक है:

1. प्रस्तावित कार्य विवरण: ${subjectDetail}।
2. इस कार्य से ग्राम की कृषि भूमि की सिंचाई क्षमता बढ़ेगी तथा ग्रामीण परिवारों को पलायन से राहत मिलेगी।
3. कार्य की मांग ग्राम सभा एवं मांझी हाड़ाम श्री ${majhiName} की अनुशंसा से की जा रही है।

अतः अनुरोध है कि मनरेगा के अंतर्गत उक्त कार्य की स्वीकृति व मस्टर रोल निर्गत करने की कृपा करें।

प्रमुख आवेदक / मेट: ${applicantLine}`;
    } else if (templateKey === 'electricity_transformer') {
      hindiMain = `सेवा में,
${recipient}
प्रखंड: ${block}, जिला: ${district} (${stateName})

विषय: ${subjectDetail}।

जोहार / महोदय,
सविनय निवेदन है कि ${fullAddress} में विद्युत व्यवस्था बाधित/जर्जर होने के कारण विद्यार्थियों की पढ़ाई, सिंचाई और ग्रामीण जनजीवन अत्यंत प्रभावित हो रहा है।

• समस्या व मांग: ${subjectDetail}।

ग्राम प्रधान श्री ${majhiName} एवं समस्त ग्रामीणों की ओर से निवेदन है कि सुरक्षा की दृष्टि से शीघ्र तकनीकी निरीक्षण कर विद्युत आपूर्ति सुचारु कराने की कृपा करें।

प्रमुख आवेदक: ${applicantLine}`;
    } else if (templateKey === 'school_anganwadi') {
      hindiMain = `सेवा में,
${recipient}
प्रखंड: ${block}, जिला: ${district} (${stateName})

विषय: ${subjectDetail}।

जोहार / महोदय,
${fullAddress} स्थित सरकारी प्राथमिक विद्यालय / आंगनबाड़ी केंद्र में ग्राम के बच्चों के पठन-पाठन, पोषण और सुरक्षा के लिए निम्न सुधार कार्य अत्यंत आवश्यक हैं:

1. प्रस्तावित सुधार: ${subjectDetail}।
2. ग्राम सभा एवं अभिभावक-शिक्षक समिति इस कार्य में पूर्ण सहयोग के लिए तत्पर है।

अतः बच्चों के उज्ज्वल भविष्य हेतु शीघ्र आवश्यक स्वीकृति व संसाधन उपलब्ध कराने की कृपा करें।

प्रस्तुतकर्ता: ${applicantLine}`;
    } else if (templateKey === 'crop_disaster_relief') {
      hindiMain = `सेवा में,
${recipient}
प्रखंड/अंचल: ${block}, जिला: ${district} (${stateName})

विषय: ${subjectDetail}।

जोहार / महोदय,
निवेदन है कि मैं ${applicantLine}, ${fullAddress} का/की खेतिहर किसान हूँ। हाल ही में आई प्राकृतिक आपदा / मौसम मार से मेरी खड़ी फसल व कृषि आजीविका को भारी नुकसान पहुँचा है।

• क्षति विवरण: ${subjectDetail}।

ग्राम प्रधान श्री ${majhiName} एवं स्थानीय किसानों की पुष्टि के साथ आपसे निवेदन है कि स्थल जांच कराकर नियमानुसार आपदा राहत व फसल क्षति मुआवज़ा स्वीकृत करने की कृपा करें।

भवदीय किसान / आवेदक: ${applicantLine}`;
    } else if (templateKey === 'pesa_land_protection') {
      hindiMain = `सेवा में,
${recipient}
प्रखंड: ${block}, जिला: ${district} (${stateName})

विषय: ${subjectDetail}।

जोहार!
भारतीय संविधान की पांचवीं अनुसूची एवं PESA अधिनियम, 1996 की धारा 4 के अंतर्गत ग्राम सभा ${village} (मांझी हाड़ाम: ${majhiName}) अपनी पारंपरिक सामुदायिक भूमि, जल-जंगल और जाहेर क्षेत्र की रक्षा हेतु निम्नलिखित सर्वसम्मत प्रस्ताव प्रस्तुत करती है:

1. ग्राम की पारंपरिक गोचर, जाहेर व वन भूमि पर किसी भी अनधिकृत अतिक्रमण, बाहरी हस्तक्षेप या अवैध वृक्ष कटाई को ग्राम सभा द्वारा अस्वीकार किया जाता है।
2. विशेष विवरण: ${subjectDetail}।

कृपया प्रशासनिक स्तर से ग्राम सभा के इस वैधानिक निर्णय के संरक्षण में आवश्यक सहयोग व कार्रवाई सुनिश्चित करें।

प्रस्तुतकर्ता (ग्राम सभा की ओर से): ${applicantLine}`;
    } else if (templateKey === 'vhsc_health_sanitation') {
      hindiMain = `सेवा में,
${recipient}
प्रखंड: ${block}, जिला: ${district} (${stateName})

विषय: ${subjectDetail}।

जोहार / महोदय,
ग्राम ${village} (${tola}) की ग्राम स्वास्थ्य, पोषण एवं स्वच्छता समिति (VHSC) व ग्रामीणों की बैठक में जनस्वास्थ्य सुरक्षा हेतु निम्नलिखित प्रस्ताव पारित किया गया है:

1. कार्य विवरण: ${subjectDetail}।
2. आंगनबाड़ी सेविका, सहिया (ASHA) एवं ग्राम प्रधान श्री ${majhiName} की देखरेख में जागरूकता व स्वच्छता अभियान संचालित किया जाएगा।

कृपया आवश्यक मेडिकल किट, ब्लीचिंग/लार्वा दवा व स्वास्थ्य शिविर की स्वीकृति प्रदान करें।

प्रमुख आवेदक / समिति प्रतिनिधि: ${applicantLine}`;
    } else {
      hindiMain = `सेवा में,
${recipient}
प्रखंड/अंचल: ${block}, जिला: ${district} (${stateName})

विषय: ${subjectDetail} हेतु ग्राम प्रधान अनुशंसा एवं सत्यापन पत्र।

जोहार / महोदय,
सत्यापित किया जाता है कि श्री/सुश्री ${applicantLine}, ${fullAddress} के वास्तविक एवं स्थायी निवासी हैं। ग्राम अभिलेख एवं स्थानीय निवासियों की पुष्टि के अनुसार आवेदक संताल (अनुसूचित जनजाति) समुदाय व ${clan} पारिस से संबंधित हैं।

इनका शैक्षिक / सामाजिक आचरण उत्तम है तथा छात्रवृत्ति, जाति एवं स्थानीय आवासीय प्रमाण-पत्र निर्माण हेतु इनकी पारिवारिक जानकारी पूर्णतः सत्य है। अतः नियमानुसार प्रमाण-पत्र / सहायता स्वीकृत करने की अनुशंसा की जाती है।`;
    }

    if (languageMode === 'hindi') {
      return hindiMain;
    }

    const santaliDevBlock = `\n\n[संताली संदेश / सामुदायिक निवेदन]\nजोहार! आतु ${village} (टोला: ${tola}) रेन मांझी हाड़ाम श्री ${majhiName} आर सानाम आतु होड़ कोवाक मोने ते नोवा निस्पाती / नेहोर साकाम "${activeTemplateMeta.santaliDev}" लागीत सेटेराकाना। आबोवाक हासा, बिर-बुरु आर आतु लाहाती लागीत सानाम कोवाक सुलाय जरूरी गेया।`;

    if (languageMode === 'bilingual_hi_san') {
      return `${hindiMain}${santaliDevBlock}`;
    }

    const santaliRomanBlock = `\n\n[Santali Roman Translation Note]\nJohar! Atu ${village} (Tola: ${tola}) ren Majhi Haram ${majhiName} ar sanam atu hor kowak mone te nowa "${activeTemplateMeta.santaliRoman}" sakam seter akana. Abowak hasa, bir-buru ar atu lahati lagit sanam kowak sulay joruri geya.`;
    return `${hindiMain}${santaliDevBlock}${santaliRomanBlock}`;
  }, [
    templateKey,
    languageMode,
    activeTemplateMeta,
    recipient,
    block,
    district,
    stateName,
    subjectDetail,
    formattedDate,
    village,
    tola,
    panchayat,
    majhiName,
    applicantName,
    guardianName,
    clan,
    mobileNo
  ]);

  const displayedBody = isDirectEdit ? customBodyOverride : generatedBody;

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleToggleDirectEdit = () => {
    if (!isDirectEdit) {
      setCustomBodyOverride(generatedBody);
      setIsDirectEdit(true);
    } else {
      setIsDirectEdit(false);
    }
  };

  const handleInsertSantaliTerm = (term: string) => {
    if (isDirectEdit) {
      setCustomBodyOverride((prev) => `${prev}${prev.endsWith(' ') || prev.endsWith('\n') ? '' : ' '}${term}`);
    } else {
      setSubjectDetail((prev) => `${prev}${prev.endsWith(' ') ? '' : ' '}${term}`);
    }
  };

  const fullPlainTextForCopy = useMemo(() => {
    const enclosureBlock =
      selectedEnclosures.length > 0
        ? `\n\nसंलग्न दस्तावेज़:\n${selectedEnclosures.map((item, i) => `${i + 1}. ${item}`).join('\n')}`
        : '';
    const attendanceBlock =
      includeAttendanceTable && attendanceList.length > 0
        ? `\n\nउपस्थित ग्राम सभा सदस्य / साक्षी:\n${attendanceList
            .map((m, idx) => `${idx + 1}. ${m.name} (${m.roleOrClan}) — हस्ताक्षर: __________`)
            .join('\n')}`
        : '';
    return `${activeTemplateMeta.officialTitle}
पत्रांक: ${refNumber || '—'} | दिनांक: ${formattedDate}
------------------------------------------------------------
${displayedBody}${enclosureBlock}${attendanceBlock}

आवेदक हस्ताक्षर: ______________________ (${applicantName})
मांझी हाड़ाम / ग्राम प्रधान हस्ताक्षर व मुहर: ______________________ (${majhiName})`;
  }, [
    activeTemplateMeta.officialTitle,
    refNumber,
    formattedDate,
    displayedBody,
    selectedEnclosures,
    includeAttendanceTable,
    attendanceList,
    applicantName,
    majhiName
  ]);

  const handleCopyFull = async () => {
    try {
      await navigator.clipboard.writeText(fullPlainTextForCopy);
      setCopiedMode('full');
      setTimeout(() => setCopiedMode('none'), 1800);
    } catch {
      // ignore
    }
  };

  const handleCopyWhatsAppSummary = async () => {
    const msg = `जोहार! *${activeTemplateMeta.label}*\nग्राम: ${village} (${tola}), प्रखंड: ${block}, जिला: ${district}\nदिनांक: ${formattedDate} | पत्रांक: ${refNumber || '—'}\n\n*मुख्य विषय:* ${subjectDetail}\n*प्रमुख आवेदक:* ${applicantName} (${clan})\n*ग्राम प्रधान (मांझी हाड़ाम):* ${majhiName}\n\n— होड़ काथा ग्राम सभा ड्राफ़्टर`;
    try {
      await navigator.clipboard.writeText(msg);
      setCopiedMode('whatsapp');
      setTimeout(() => setCopiedMode('none'), 1800);
    } catch {
      // ignore
    }
  };

  const buildPrintableDocumentHtml = (forWord: boolean) => {
    const bodyFontPx = printFontSize === 'large' ? '16px' : printFontSize === 'compact' ? '12.5px' : '14.5px';

    const enclosuresHtml =
      selectedEnclosures.length > 0
        ? `<div style="margin-top:16px;"><strong>संलग्न दस्तावेज़ (Enclosures):</strong><ol style="margin:6px 0 0 18px;padding:0;">${selectedEnclosures
            .map((e) => `<li style="margin-bottom:3px;">${escapeHtml(e)}</li>`)
            .join('')}</ol></div>`
        : '';

    const landHtml =
      includeLandTable && landPlots.length > 0
        ? `<div style="margin-top:18px;page-break-inside:avoid;">
            <strong style="font-size:13px;">भूमि / खाता-खेसरा एवं चौहद्दी विवरण:</strong>
            <table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:11.5px;">
              <thead>
                <tr style="background:#f8fafc;">
                  <th style="padding:5px;border:1px solid #cbd5e1;">खाता सं.</th>
                  <th style="padding:5px;border:1px solid #cbd5e1;">प्लॉट/खेसरा</th>
                  <th style="padding:5px;border:1px solid #cbd5e1;">रकबा</th>
                  <th style="padding:5px;border:1px solid #cbd5e1;">उत्तर</th>
                  <th style="padding:5px;border:1px solid #cbd5e1;">दक्षिण</th>
                  <th style="padding:5px;border:1px solid #cbd5e1;">पूर्व</th>
                  <th style="padding:5px;border:1px solid #cbd5e1;">पश्चिम</th>
                </tr>
              </thead>
              <tbody>
                ${landPlots
                  .map(
                    (p) =>
                      `<tr>
                        <td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(p.khataNo)}</td>
                        <td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(p.plotNo)}</td>
                        <td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(p.area)}</td>
                        <td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(p.north)}</td>
                        <td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(p.south)}</td>
                        <td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(p.east)}</td>
                        <td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(p.west)}</td>
                      </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>`
        : '';

    const estimateHtml =
      includeEstimateTable && estimateRows.length > 0
        ? `<div style="margin-top:18px;page-break-inside:avoid;">
            <strong style="font-size:13px;">लाभार्थी संख्या (${escapeHtml(beneficiaryFamilies)}) एवं अनुमानित कार्य/बजट विवरण:</strong>
            <table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:12px;">
              <thead>
                <tr style="background:#f8fafc;">
                  <th style="padding:5px;border:1px solid #cbd5e1;text-align:left;">कार्य / सामग्री मद</th>
                  <th style="padding:5px;border:1px solid #cbd5e1;text-align:left;">मात्रा / इकाई</th>
                  <th style="padding:5px;border:1px solid #cbd5e1;text-align:right;">अनुमानित राशि (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${estimateRows
                  .map(
                    (r) =>
                      `<tr>
                        <td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(r.item)}</td>
                        <td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(r.quantity)}</td>
                        <td style="padding:5px;border:1px solid #cbd5e1;text-align:right;">₹ ${Number(r.amount || 0).toLocaleString('en-IN')}</td>
                      </tr>`
                  )
                  .join('')}
                <tr style="font-weight:bold;background:#f8fafc;">
                  <td colspan="2" style="padding:5px;border:1px solid #cbd5e1;text-align:right;">कुल अनुमानित योग:</td>
                  <td style="padding:5px;border:1px solid #cbd5e1;text-align:right;">₹ ${totalEstimateAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>`
        : '';

    const lineageHtml =
      includeLineageTable && lineageRows.length > 0
        ? `<div style="margin-top:18px;page-break-inside:avoid;">
            <strong style="font-size:13px;">पारंपरिक वंशावली क्रम (Lineage Chart — पारिस: ${escapeHtml(clan)}):</strong>
            <table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:12px;">
              <thead>
                <tr style="background:#f8fafc;">
                  <th style="padding:5px;border:1px solid #cbd5e1;text-align:left;">पीढ़ी स्तर</th>
                  <th style="padding:5px;border:1px solid #cbd5e1;text-align:left;">व्यक्ति / पूर्वज का नाम</th>
                  <th style="padding:5px;border:1px solid #cbd5e1;text-align:left;">संबंध / टिप्पणी</th>
                </tr>
              </thead>
              <tbody>
                ${lineageRows
                  .map(
                    (l) =>
                      `<tr>
                        <td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(l.generation)}</td>
                        <td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(l.name)}</td>
                        <td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(l.relation)}</td>
                      </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>`
        : '';

    const blankRowsHtml = Array.from({ length: blankAttendanceRows })
      .map(
        (_, i) =>
          `<tr><td style="padding:7px;border:1px solid #cbd5e1;text-align:center;">${attendanceList.length + i + 1}</td><td style="padding:7px;border:1px solid #cbd5e1;"></td><td style="padding:7px;border:1px solid #cbd5e1;"></td><td style="padding:7px;border:1px solid #cbd5e1;"></td></tr>`
      )
      .join('');

    const attendanceHtml = includeAttendanceTable
      ? `<div style="margin-top:18px;page-break-inside:avoid;">
          <strong style="font-size:13px;">ग्राम सभा / सामुदायिक उपस्थिति एवं हस्ताक्षर पंजी:</strong>
          <table style="width:100%;border-collapse:collapse;margin-top:6px;font-size:12px;">
            <thead>
              <tr style="background:#f8fafc;">
                <th style="padding:5px;border:1px solid #cbd5e1;width:44px;">क्र.</th>
                <th style="padding:5px;border:1px solid #cbd5e1;text-align:left;">नाम</th>
                <th style="padding:5px;border:1px solid #cbd5e1;text-align:left;">पद / पारिस</th>
                <th style="padding:5px;border:1px solid #cbd5e1;text-align:left;">हस्ताक्षर / अंगूठा निशान</th>
              </tr>
            </thead>
            <tbody>
              ${attendanceList
                .map(
                  (m, idx) =>
                    `<tr><td style="padding:5px;border:1px solid #cbd5e1;text-align:center;">${idx + 1}</td><td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(m.name)}</td><td style="padding:5px;border:1px solid #cbd5e1;">${escapeHtml(m.roleOrClan)}</td><td style="padding:5px;border:1px solid #cbd5e1;"></td></tr>`
                )
                .join('')}
              ${blankRowsHtml}
            </tbody>
          </table>
        </div>`
      : '';

    const appSigImg =
      !forWord && applicantSignatureDataUrl
        ? `<img src="${applicantSignatureDataUrl}" alt="Signature" style="max-height:46px;display:block;margin-bottom:4px;" />`
        : '';
    const majhiSigImg =
      !forWord && majhiSignatureDataUrl
        ? `<img src="${majhiSignatureDataUrl}" alt="Signature" style="max-height:46px;display:block;margin-bottom:4px;" />`
        : '';

    const receiptHtml = includeReceiptSlip
      ? `<div style="margin-top:26px;padding-top:12px;border-top:1.5px dashed #64748b;font-size:12px;page-break-inside:avoid;">
          <div style="font-weight:bold;margin-bottom:6px;">✂ पावती रसीद (Receiving Slip — कार्यालय द्वारा भरकर आवेदक को लौटाएँ)</div>
          <div>पत्रांक: <strong>${escapeHtml(refNumber || '—')}</strong> | दिनांक: <strong>${escapeHtml(formattedDate)}</strong> | ग्राम: ${escapeHtml(village)}</div>
          <div style="margin-top:4px;">आवेदक: ${escapeHtml(applicantName)} | विषय: ${escapeHtml(subjectDetail.slice(0, 90))}</div>
          <div style="margin-top:16px;display:flex;justify-content:space-between;">
            <span>प्राप्ति तिथि: ______________</span>
            <span>प्राप्तकर्ता अधिकारी हस्ताक्षर व मुहर: ______________________</span>
          </div>
        </div>`
      : '';

    return `<!doctype html>
<html lang="hi">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(activeTemplateMeta.officialTitle)}</title>
<style>
  @page { size: A4; margin: 14mm; }
  body { font-family: "Noto Sans Devanagari", system-ui, sans-serif; color: #0f172a; line-height: 1.75; margin: 0; padding: 20px; background: #fff; }
  .sheet { max-width: 780px; margin: 0 auto; }
  .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 16px; }
  .title { font-size: 18px; font-weight: 800; text-align: center; margin: 0; }
  .sub { font-size: 12px; color: #475569; text-align: center; margin: 3px 0 6px 0; }
  .meta { display: flex; justify-content: space-between; font-size: 13px; color: #334155; }
  .body { white-space: pre-wrap; font-size: ${bodyFontPx}; }
  .signs { margin-top: 34px; display: grid; grid-template-columns: 1fr 1fr; gap: 28px; font-size: 13px; page-break-inside: avoid; }
  .sign-box { border-top: 1px solid #475569; padding-top: 6px; margin-top: 18px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div class="title">${escapeHtml(activeTemplateMeta.officialTitle)}</div>
      ${languageMode !== 'hindi' ? `<div class="sub">${escapeHtml(activeTemplateMeta.santaliDev)}${languageMode === 'trilingual' ? ` · ${escapeHtml(activeTemplateMeta.santaliRoman)}` : ''}</div>` : ''}
      <div class="meta">
        <span>पत्रांक / संदर्भ: <strong>${escapeHtml(refNumber || '—')}</strong></span>
        <span>दिनांक: <strong>${escapeHtml(formattedDate)}</strong></span>
      </div>
    </div>
    <div class="body">${escapeHtml(displayedBody)}</div>
    ${landHtml}
    ${estimateHtml}
    ${lineageHtml}
    ${enclosuresHtml}
    ${attendanceHtml}
    <div class="signs">
      <div>${appSigImg}<div class="sign-box"><strong>आवेदक / प्रस्तुतकर्ता के हस्ताक्षर</strong><br/>${escapeHtml(applicantName)} (${escapeHtml(clan)})</div></div>
      <div>${majhiSigImg}<div class="sign-box"><strong>मांझी हाड़ाम / ग्राम प्रधान हस्ताक्षर व मुहर</strong><br/>${escapeHtml(majhiName)} (${escapeHtml(village)})</div></div>
    </div>
    ${receiptHtml}
  </div>
</body>
</html>`;
  };

  const handleDownloadPrintableHtml = () => {
    const html = buildPrintableDocumentHtml(false);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avedan_${templateKey}_${docDate}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadWordDoc = () => {
    const html = buildPrintableDocumentHtml(true);
    const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avedan_${templateKey}_${docDate}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('MS Word (.doc) फ़ाइल डाउनलोड हो गई!');
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speakWithFemaleVoice(`${activeTemplateMeta.officialTitle}. ${displayedBody}`, {
      lang: 'hi-IN',
      rate: 0.9,
      autoDetectLanguage: true,
      readingLangMode: languageMode === 'hindi' ? 'hindi' : 'all',
      onEnd: () => setIsSpeaking(false)
    });
  };

  const previewBodyTextSizeClass =
    printFontSize === 'large'
      ? 'text-[16px] leading-[1.85]'
      : printFontSize === 'compact'
        ? 'text-[12.5px] leading-[1.65]'
        : 'text-[14.5px] leading-[1.8]';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20 print:bg-white print:p-0 print:min-h-0">
      <div className="max-w-7xl mx-auto space-y-5 print:max-w-none print:space-y-0">
        {/* Status Toast (Hidden on Print) */}
        {statusNotice && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 print:hidden">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Header Card (Hidden on Print) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
              <FileText className="w-4 h-4" />
              <span>14 आधिकारिक प्रारूप · डिजिटल मुहर व हस्ताक्षर · भूमि/बजट/वंशावली तालिका · रजिस्टर</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              इंटरैक्टिव ग्राम सभा व सामुदायिक आवेदन ड्राफ़्टर
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              संताली + हिंदी 3-भाषा मोड, बोलकर टाइपिंग, खाता-चौहद्दी, डिजिटल हस्ताक्षर/मुहर और पावती स्लिप सहित तुरंत A4 प्रिंट व Word एक्सपोर्ट करें।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowDraftsPanel((p) => !p)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-amber-700" />
              <span>ड्राफ्ट ({savedDrafts.length})</span>
            </button>

            <button
              onClick={handleSaveDraft}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>सेव करें</span>
            </button>

            <button
              onClick={handleAddToRegister}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ClipboardList className="w-4 h-4" />
              <span>रजिस्टर में दर्ज करें</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>प्रिंट / PDF</span>
            </button>
          </div>
        </div>

        {/* Saved Drafts Drawer (Hidden on Print) */}
        {showDraftsPanel && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 print:hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-900">
                ब्राउज़र में सहेजे गए आवेदन ड्राफ्ट (Saved Drafts)
              </h2>
              <button
                onClick={() => setShowDraftsPanel(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                बंद करें
              </button>
            </div>

            {savedDrafts.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">
                अभी कोई ड्राफ्ट सेव नहीं है। ऊपर "सेव करें" बटन से किसी भी आवेदन को भविष्य के लिए सुरक्षित रखें।
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedDrafts.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{d.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono tabular-nums">
                        दिनांक: {formatDisplayDate(d.docDate)} · सेव: {d.savedAt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/70">
                      <button
                        onClick={() => handleLoadDraft(d)}
                        className="text-sky-700 hover:text-sky-900 font-bold cursor-pointer"
                      >
                        खोलें / लोड करें →
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(d.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        title="ड्राफ्ट हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 14 Templates Selector (Hidden on Print) */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-200/70 rounded-xl print:hidden">
          {TEMPLATE_META.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectTemplate(t.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                templateKey === t.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Two-column Editor & Live A4 Printable Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start print:block">
          {/* Left Form Panel (Hidden on Print or Full Preview) */}
          {!isFullPreview && (
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 text-xs print:hidden">
              {/* Clean Segmented Sub-Tabs inside Editor */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
                {[
                  { id: 'basic' as EditorSectionTab, label: 'विवरण' },
                  { id: 'tables' as EditorSectionTab, label: 'भूमि / बजट' },
                  { id: 'sign_stamp' as EditorSectionTab, label: 'मुहर / साइन' },
                  { id: 'register' as EditorSectionTab, label: `रजिस्टर (${registerEntries.length})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEditorTab(tab.id)}
                    className={`py-2 px-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer truncate ${
                      editorTab === tab.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: BASIC DETAILS + VOICE DICTATION + 3-LANG MODE */}
              {editorTab === 'basic' && (
                <div className="space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-900">मुख्य जानकारी व भाषा मोड</h2>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSaveVillageProfile}
                        className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <BookmarkCheck className="w-3.5 h-3.5" />
                        <span>गाँव याद रखें</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDocDate(getTodayIsoDate());
                          setIsDirectEdit(false);
                          setCustomBodyOverride('');
                        }}
                        className="text-[11px] font-semibold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>रीसेट</span>
                      </button>
                    </div>
                  </div>

                  {/* 3-Language Document Mode */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600 flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-amber-700" />
                      <span>पत्र भाषा प्रारूप</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
                      {[
                        { id: 'hindi' as LanguageMode, label: 'केवल हिंदी' },
                        { id: 'bilingual_hi_san' as LanguageMode, label: 'हिंदी + संताली' },
                        { id: 'trilingual' as LanguageMode, label: 'त्रि-भाषी (रोमन)' }
                      ].map((lm) => (
                        <button
                          key={lm.id}
                          type="button"
                          onClick={() => setLanguageMode(lm.id)}
                          className={`py-1.5 px-2 rounded-md text-[11px] font-semibold cursor-pointer ${
                            languageMode === lm.id
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {lm.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">पत्रांक / संदर्भ सं.</label>
                      <input
                        value={refNumber}
                        onChange={(e) => setRefNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">आवेदन दिनांक</label>
                      <input
                        type="date"
                        value={docDate}
                        onChange={(e) => setDocDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white font-mono tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">प्राप्तकर्ता अधिकारी (सेवा में)</label>
                    <input
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">ग्राम (हातु)</label>
                      <input
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">टोला / कुल्ही</label>
                      <input
                        value={tola}
                        onChange={(e) => setTola(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">ग्राम पंचायत</label>
                      <input
                        value={panchayat}
                        onChange={(e) => setPanchayat(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">प्रखंड / अंचल</label>
                      <input
                        value={block}
                        onChange={(e) => setBlock(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">जिला</label>
                      <input
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">राज्य</label>
                      <input
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">आवेदक का नाम</label>
                      <input
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">पिता / पति का नाम</label>
                      <input
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">पारिस / गोत्र</label>
                      <select
                        value={clan}
                        onChange={(e) => setClan(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                      >
                        {CLAN_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-600 block mb-1">मोबाइल नं. (वैकल्पिक)</label>
                      <input
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                        placeholder="10 अंक"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white font-mono tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">मांझी हाड़ाम (ग्राम प्रधान)</label>
                    <input
                      value={majhiName}
                      onChange={(e) => setMajhiName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                    />
                  </div>

                  {/* Subject with Voice-to-Text Dictation */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <label className="font-semibold text-slate-600">प्रस्ताव / आवेदन का विषय</label>
                      <button
                        type="button"
                        onClick={handleToggleVoiceDictation}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                          isListeningVoice
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                        }`}
                      >
                        {isListeningVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        <span>{isListeningVoice ? 'बंद करें' : 'बोलकर लिखें'}</span>
                      </button>
                    </div>

                    {voiceStatusMsg && (
                      <p className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                        {voiceStatusMsg}
                      </p>
                    )}

                    <textarea
                      rows={3}
                      value={subjectDetail}
                      onChange={(e) => setSubjectDetail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                    />
                    <div className="flex flex-wrap gap-1">
                      {SUBJECT_QUICK_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setSubjectDetail(chip)}
                          className="px-2 py-1 rounded-md bg-slate-100 hover:bg-amber-50 border border-slate-200 text-[10.5px] text-slate-700 cursor-pointer text-left"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {CIVIC_SANTALI_TERMS.map((item) => (
                        <button
                          key={item.term}
                          type="button"
                          onClick={() => handleInsertSantaliTerm(item.term)}
                          title={item.hint}
                          className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[10.5px] font-semibold cursor-pointer"
                        >
                          + {item.term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: LAND BOUNDARY + COST ESTIMATE + VANSHAVALI LINEAGE + ENCLOSURES */}
              {editorTab === 'tables' && (
                <div className="space-y-4">
                  {/* 1. Land Plot & Chauhaddi */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <label className="font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeLandTable}
                        onChange={(e) => setIncludeLandTable(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600"
                      />
                      <MapIcon className="w-3.5 h-3.5 text-amber-700" />
                      <span>भूमि खाता-खेसरा व चौहद्दी तालिका जोड़ें</span>
                    </label>

                    {includeLandTable && (
                      <div className="space-y-2">
                        {landPlots.map((p, idx) => (
                          <div key={p.id} className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                              <span>भूमि खंड #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveLandPlot(p.id)}
                                className="text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              <input
                                value={p.khataNo}
                                onChange={(e) => handleUpdateLandPlot(p.id, 'khataNo', e.target.value)}
                                placeholder="खाता नं."
                                className="px-2 py-1 border border-slate-200 rounded text-[11px]"
                              />
                              <input
                                value={p.plotNo}
                                onChange={(e) => handleUpdateLandPlot(p.id, 'plotNo', e.target.value)}
                                placeholder="प्लॉट / खेसरा"
                                className="px-2 py-1 border border-slate-200 rounded text-[11px]"
                              />
                              <input
                                value={p.area}
                                onChange={(e) => handleUpdateLandPlot(p.id, 'area', e.target.value)}
                                placeholder="रकबा"
                                className="px-2 py-1 border border-slate-200 rounded text-[11px]"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <input
                                value={p.north}
                                onChange={(e) => handleUpdateLandPlot(p.id, 'north', e.target.value)}
                                placeholder="उत्तर चौहद्दी"
                                className="px-2 py-1 border border-slate-200 rounded text-[11px]"
                              />
                              <input
                                value={p.south}
                                onChange={(e) => handleUpdateLandPlot(p.id, 'south', e.target.value)}
                                placeholder="दक्षिण चौहद्दी"
                                className="px-2 py-1 border border-slate-200 rounded text-[11px]"
                              />
                              <input
                                value={p.east}
                                onChange={(e) => handleUpdateLandPlot(p.id, 'east', e.target.value)}
                                placeholder="पूर्व चौहद्दी"
                                className="px-2 py-1 border border-slate-200 rounded text-[11px]"
                              />
                              <input
                                value={p.west}
                                onChange={(e) => handleUpdateLandPlot(p.id, 'west', e.target.value)}
                                placeholder="पश्चिम चौहद्दी"
                                className="px-2 py-1 border border-slate-200 rounded text-[11px]"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddLandPlot}
                          className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          + एक और प्लॉट / चौहद्दी जोड़ें
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 2. Beneficiary & Estimate Table */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <label className="font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeEstimateTable}
                        onChange={(e) => setIncludeEstimateTable(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600"
                      />
                      <Calculator className="w-3.5 h-3.5 text-amber-700" />
                      <span>लाभार्थी व अनुमानित बजट तालिका जोड़ें</span>
                    </label>

                    {includeEstimateTable && (
                      <div className="space-y-2">
                        <input
                          value={beneficiaryFamilies}
                          onChange={(e) => setBeneficiaryFamilies(e.target.value)}
                          placeholder="लाभान्वित परिवारों की संख्या"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px]"
                        />
                        {estimateRows.map((r) => (
                          <div key={r.id} className="grid grid-cols-12 gap-1.5 items-center">
                            <input
                              value={r.item}
                              onChange={(e) => handleUpdateEstimateRow(r.id, 'item', e.target.value)}
                              placeholder="मद विवरण"
                              className="col-span-5 px-2 py-1 border border-slate-200 rounded bg-white text-[11px]"
                            />
                            <input
                              value={r.quantity}
                              onChange={(e) => handleUpdateEstimateRow(r.id, 'quantity', e.target.value)}
                              placeholder="मात्रा"
                              className="col-span-3 px-2 py-1 border border-slate-200 rounded bg-white text-[11px]"
                            />
                            <input
                              type="number"
                              value={r.amount}
                              onChange={(e) => handleUpdateEstimateRow(r.id, 'amount', Number(e.target.value))}
                              placeholder="₹ राशि"
                              className="col-span-3 px-2 py-1 border border-slate-200 rounded bg-white text-[11px] font-mono tabular-nums"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveEstimateRow(r.id)}
                              className="col-span-1 text-rose-600 flex justify-center cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddEstimateRow}
                          className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          + बजट मद जोड़ें (कुल: ₹ {totalEstimateAmount.toLocaleString('en-IN')})
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 3. Vanshavali Lineage Builder */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <label className="font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeLineageTable}
                        onChange={(e) => setIncludeLineageTable(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600"
                      />
                      <GitBranch className="w-3.5 h-3.5 text-amber-700" />
                      <span>पीढ़ी-दर-पीढ़ी वंशावली तालिका जोड़ें</span>
                    </label>

                    {includeLineageTable && (
                      <div className="space-y-2">
                        {lineageRows.map((l) => (
                          <div key={l.id} className="grid grid-cols-12 gap-1.5 items-center">
                            <input
                              value={l.generation}
                              onChange={(e) => handleUpdateLineageRow(l.id, 'generation', e.target.value)}
                              placeholder="पीढ़ी"
                              className="col-span-4 px-2 py-1 border border-slate-200 rounded bg-white text-[11px]"
                            />
                            <input
                              value={l.name}
                              onChange={(e) => handleUpdateLineageRow(l.id, 'name', e.target.value)}
                              placeholder="नाम"
                              className="col-span-4 px-2 py-1 border border-slate-200 rounded bg-white text-[11px]"
                            />
                            <input
                              value={l.relation}
                              onChange={(e) => handleUpdateLineageRow(l.id, 'relation', e.target.value)}
                              placeholder="संबंध"
                              className="col-span-3 px-2 py-1 border border-slate-200 rounded bg-white text-[11px]"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveLineageRow(l.id)}
                              className="col-span-1 text-rose-600 flex justify-center cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddLineageRow}
                          className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          + वंशावली पीढ़ी जोड़ें
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 4. Enclosures Checklist */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="font-bold text-slate-800 block">
                      संलग्न दस्तावेज़ (Enclosures)
                    </label>
                    <div className="space-y-1.5">
                      {QUICK_ENCLOSURES.map((item) => (
                        <label key={item} className="flex items-start gap-2 text-[11px] text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedEnclosures.includes(item)}
                            onChange={() => toggleEnclosure(item)}
                            className="mt-0.5 rounded border-slate-300 text-amber-600"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-1.5 pt-1">
                      <input
                        value={customEnclosureInput}
                        onChange={(e) => setCustomEnclosureInput(e.target.value)}
                        placeholder="अन्य संलग्नक लिखें..."
                        className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomEnclosure}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                      >
                        + जोड़ें
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DIGITAL SIGNATURE CANVAS + CUSTOM STAMP + ATTENDANCE + RECEIPT */}
              {editorTab === 'sign_stamp' && (
                <div className="space-y-4">
                  {/* 1. Digital Signature Pad */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <PenLine className="w-3.5 h-3.5 text-amber-700" />
                        <span>डिजिटल हस्ताक्षर ड्रा करें (Signature Pad)</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleClearActiveSignature}
                        className="text-[11px] font-semibold text-rose-700 hover:underline cursor-pointer"
                      >
                        साफ़ करें
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/70 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setActiveSigner('applicant')}
                        className={`py-1 rounded text-[11px] font-semibold cursor-pointer ${
                          activeSigner === 'applicant' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        आवेदक हस्ताक्षर {applicantSignatureDataUrl ? '✓' : ''}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSigner('majhi')}
                        className={`py-1 rounded text-[11px] font-semibold cursor-pointer ${
                          activeSigner === 'majhi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        मांझी हाड़ाम हस्ताक्षर {majhiSignatureDataUrl ? '✓' : ''}
                      </button>
                    </div>

                    <canvas
                      ref={sigCanvasRef}
                      width={340}
                      height={110}
                      onPointerDown={handleSigPointerDown}
                      onPointerMove={handleSigPointerMove}
                      onPointerUp={handleSigPointerUp}
                      onPointerLeave={handleSigPointerUp}
                      className="w-full h-28 bg-white border border-dashed border-slate-300 rounded-lg touch-none cursor-crosshair"
                    />
                    <p className="text-[10.5px] text-slate-500">
                      माउस या उंगली से ऊपर बॉक्स में हस्ताक्षर करें — यह सीधे A4 प्रिंट शीट पर जुड़ जाएगा।
                    </p>
                  </div>

                  {/* 2. Custom Stamp Builder */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeStamp}
                        onChange={(e) => setIncludeStamp(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600"
                      />
                      <Stamp className="w-3.5 h-3.5 text-indigo-700" />
                      <span>आधिकारिक ग्राम सभा मुहर (Official Stamp) दिखाएं</span>
                    </label>
                    {includeStamp && (
                      <input
                        value={stampTitle}
                        onChange={(e) => setStampTitle(e.target.value)}
                        placeholder="मुहर शीर्षक (जैसे: मांझी हाड़ाम · ग्राम सभा)"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px]"
                      />
                    )}
                  </div>

                  {/* 3. Cut-Out Receipt Slip Toggle */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeReceiptSlip}
                        onChange={(e) => setIncludeReceiptSlip(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600"
                      />
                      <Receipt className="w-3.5 h-3.5 text-amber-700" />
                      <span>नीचे कार्यालय पावती रसीद (Cut-Out Slip) जोड़ें</span>
                    </label>
                  </div>

                  {/* 4. Attendance & Witness Roster */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <label className="font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeAttendanceTable}
                        onChange={(e) => setIncludeAttendanceTable(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600"
                      />
                      <Users className="w-3.5 h-3.5 text-amber-700" />
                      <span>ग्राम सभा उपस्थिति एवं हस्ताक्षर पंजी जोड़ें</span>
                    </label>

                    {includeAttendanceTable && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 font-medium">खाली हस्ताक्षर पंक्तियाँ:</span>
                          <select
                            value={blankAttendanceRows}
                            onChange={(e) => setBlankAttendanceRows(Number(e.target.value))}
                            className="px-2 py-1 border border-slate-200 rounded bg-white font-mono tabular-nums"
                          >
                            <option value={0}>0 पंक्ति</option>
                            <option value={3}>3 पंक्तियाँ</option>
                            <option value={5}>5 पंक्तियाँ</option>
                            <option value={8}>8 पंक्तियाँ</option>
                          </select>
                        </div>

                        <div className="space-y-1 max-h-28 overflow-y-auto">
                          {attendanceList.map((m, idx) => (
                            <div
                              key={m.id}
                              className="flex items-center justify-between gap-2 bg-white px-2.5 py-1 rounded border border-slate-200 text-[11px]"
                            >
                              <span className="truncate">
                                <strong className="font-mono tabular-nums">{idx + 1}.</strong> {m.name} ({m.roleOrClan})
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveAttendanceMember(m.id)}
                                className="text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            value={newAttName}
                            onChange={(e) => setNewAttName(e.target.value)}
                            placeholder="सदस्य का नाम"
                            className="px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px]"
                          />
                          <input
                            value={newAttRole}
                            onChange={(e) => setNewAttRole(e.target.value)}
                            placeholder="पद / पारिस"
                            className="px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-[11px]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddAttendanceMember}
                          className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>सदस्य जोड़ें</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: APPLICATION REGISTER & JSON BACKUP */}
              {editorTab === 'register' && (
                <div className="space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-900">ग्राम सभा आवेदन रजिस्टर</h2>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleAddToRegister}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        + वर्तमान दर्ज करें
                      </button>
                      {registerEntries.length > 0 && (
                        <button
                          type="button"
                          onClick={handleExportRegisterCsv}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          CSV (Excel)
                        </button>
                      )}
                    </div>
                  </div>

                  {registerEntries.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center bg-slate-50 rounded-xl border border-slate-200">
                      रजिस्टर खाली है। ऊपर "+ वर्तमान दर्ज करें" पर क्लिक करके भेजे गए आवेदनों का स्टेटस ट्रैक करें।
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {registerEntries.map((r) => (
                        <div key={r.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{r.templateLabel}</p>
                              <p className="text-[11px] text-slate-500 font-mono tabular-nums">
                                {r.refNumber} · {formatDisplayDate(r.docDate)} · {r.applicantName}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteRegisterEntry(r.id)}
                              className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-700 line-clamp-2">{r.subject}</p>
                          <div className="grid grid-cols-12 gap-1.5 pt-1">
                            <select
                              value={r.status}
                              onChange={(e) =>
                                handleUpdateRegisterStatus(r.id, e.target.value as ApplicationStatus)
                              }
                              className="col-span-5 px-2 py-1 border border-slate-200 rounded bg-white text-[11px] font-semibold"
                            >
                              <option value="तैयार">तैयार</option>
                              <option value="जमा किया गया">जमा किया गया</option>
                              <option value="जांच जारी">जांच जारी</option>
                              <option value="स्वीकृत">स्वीकृत</option>
                              <option value="पुनः आवेदन">पुनः आवेदन</option>
                            </select>
                            <input
                              value={r.remarks}
                              onChange={(e) => handleUpdateRegisterRemarks(r.id, e.target.value)}
                              placeholder="फ़ॉलो-अप टिप्पणी..."
                              className="col-span-7 px-2 py-1 border border-slate-200 rounded bg-white text-[11px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* JSON Backup & Restore */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="font-bold text-slate-700 block text-[11px]">
                      डेटा बैकअप व रीस्टोर (JSON Backup)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleExportJsonBackup}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>बैकअप डाउनलोड</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => backupInputRef.current?.click()}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>रीस्टोर करें</span>
                      </button>
                      <input
                        ref={backupInputRef}
                        type="file"
                        accept=".json,application/json"
                        onChange={handleImportJsonBackup}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right: Printable Official A4 Application Sheet */}
          <div
            className={`${
              isFullPreview ? 'lg:col-span-12' : 'lg:col-span-7'
            } space-y-3 print:w-full print:m-0`}
          >
            {/* Action & Print Settings Toolbar (Hidden on Print) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2.5 print:hidden">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={handleToggleDirectEdit}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition-colors ${
                      isDirectEdit
                        ? 'bg-amber-100 border-amber-300 text-amber-950'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isDirectEdit ? 'स्वतः प्रारूप पर लौटें' : 'सीधे पाठ संपादित करें'}</span>
                  </button>

                  <button
                    onClick={() => setIsFullPreview((p) => !p)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {isFullPreview ? (
                      <>
                        <Minimize2 className="w-3.5 h-3.5" />
                        <span>फॉर्म दिखाएँ</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>A4 फुल प्रीव्यू</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={handleToggleSpeech}
                    className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {isSpeaking ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'रोकें' : 'सुनें'}</span>
                  </button>

                  <button
                    onClick={handleCopyWhatsAppSummary}
                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedMode === 'whatsapp' ? <Check className="w-3.5 h-3.5" /> : <MessageSquareShare className="w-3.5 h-3.5" />}
                    <span>{copiedMode === 'whatsapp' ? 'कॉपी हुआ' : 'WhatsApp'}</span>
                  </button>

                  <button
                    onClick={handleCopyFull}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedMode === 'full' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMode === 'full' ? 'कॉपी हुआ' : 'कॉपी'}</span>
                  </button>

                  <button
                    onClick={handleDownloadWordDoc}
                    className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    title="Microsoft Word (.doc) के रूप में डाउनलोड करें"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Word (.doc)</span>
                  </button>

                  <button
                    onClick={handleDownloadPrintableHtml}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>HTML</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>प्रिंट / PDF</span>
                  </button>
                </div>
              </div>

              {/* Print Layout Controls */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">अक्षर आकार:</span>
                  {(['compact', 'normal', 'large'] as PrintFontSize[]).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setPrintFontSize(sz)}
                      className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                        printFontSize === sz
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {sz === 'compact' ? 'कॉम्पैक्ट' : sz === 'normal' ? 'मानक' : 'बड़ा'}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-500">
                  प्रिंट या Word/HTML में सभी चयनित तालिकाएँ, मुहर, हस्ताक्षर व पावती स्वतः शामिल होंगी।
                </span>
              </div>
            </div>

            {/* Official A4 Printable Document Sheet */}
            <article
              id="printable-gram-sabha-sheet"
              className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-10 shadow-xs text-slate-900 print:border-0 print:rounded-none print:shadow-none print:p-0 print:m-0"
            >
              {/* Letterhead */}
              <div className="border-b-2 border-slate-900 pb-3.5 mb-5 space-y-1.5">
                <h2 className="text-base sm:text-lg font-bold text-center text-slate-950 tracking-tight">
                  {activeTemplateMeta.officialTitle}
                </h2>
                {languageMode !== 'hindi' && (
                  <p className="text-xs text-center font-medium text-slate-600">
                    {activeTemplateMeta.santaliDev}
                    {languageMode === 'trilingual' ? ` · ${activeTemplateMeta.santaliRoman}` : ''}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-700 font-medium">
                  <span className="font-mono tabular-nums">
                    पत्रांक / संदर्भ: <strong className="text-slate-950">{refNumber || '—'}</strong>
                  </span>
                  <span className="font-mono tabular-nums">
                    दिनांक: <strong className="text-slate-950">{formattedDate}</strong>
                  </span>
                </div>
              </div>

              {/* Letter Body */}
              {isDirectEdit ? (
                <textarea
                  rows={15}
                  value={customBodyOverride}
                  onChange={(e) => setCustomBodyOverride(e.target.value)}
                  className={`w-full p-3.5 rounded-xl border border-amber-300 bg-amber-50/30 ${previewBodyTextSizeClass} text-slate-900 font-sans focus:outline-none print:border-0 print:bg-white print:p-0 print:resize-none`}
                />
              ) : (
                <div className={`whitespace-pre-wrap ${previewBodyTextSizeClass} text-slate-900 font-sans`}>
                  {displayedBody}
                </div>
              )}

              {/* Land & Boundary Table */}
              {includeLandTable && landPlots.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-200 break-inside-avoid">
                  <h3 className="text-xs font-bold text-slate-900 mb-2">
                    भूमि / खाता-खेसरा एवं चौहद्दी विवरण:
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[11px] text-slate-800">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-300 px-2 py-1.5 text-left">खाता</th>
                          <th className="border border-slate-300 px-2 py-1.5 text-left">प्लॉट</th>
                          <th className="border border-slate-300 px-2 py-1.5 text-left">रकबा</th>
                          <th className="border border-slate-300 px-2 py-1.5 text-left">उत्तर</th>
                          <th className="border border-slate-300 px-2 py-1.5 text-left">दक्षिण</th>
                          <th className="border border-slate-300 px-2 py-1.5 text-left">पूर्व</th>
                          <th className="border border-slate-300 px-2 py-1.5 text-left">पश्चिम</th>
                        </tr>
                      </thead>
                      <tbody>
                        {landPlots.map((p) => (
                          <tr key={p.id}>
                            <td className="border border-slate-300 px-2 py-1 font-mono tabular-nums">{p.khataNo}</td>
                            <td className="border border-slate-300 px-2 py-1 font-mono tabular-nums">{p.plotNo}</td>
                            <td className="border border-slate-300 px-2 py-1">{p.area}</td>
                            <td className="border border-slate-300 px-2 py-1">{p.north}</td>
                            <td className="border border-slate-300 px-2 py-1">{p.south}</td>
                            <td className="border border-slate-300 px-2 py-1">{p.east}</td>
                            <td className="border border-slate-300 px-2 py-1">{p.west}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Beneficiary & Work Estimate Table */}
              {includeEstimateTable && estimateRows.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-200 break-inside-avoid">
                  <h3 className="text-xs font-bold text-slate-900 mb-1">
                    अनुमानित कार्य / बजट विवरण व लाभार्थी कवरेज:
                  </h3>
                  <p className="text-[11px] text-slate-700 mb-2">
                    लक्षित लाभार्थी: <strong>{beneficiaryFamilies}</strong>
                  </p>
                  <table className="w-full border-collapse text-xs text-slate-800">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-2.5 py-1.5 text-left">कार्य / सामग्री मद</th>
                        <th className="border border-slate-300 px-2.5 py-1.5 text-left">मात्रा / इकाई</th>
                        <th className="border border-slate-300 px-2.5 py-1.5 text-right">अनुमानित राशि (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estimateRows.map((r) => (
                        <tr key={r.id}>
                          <td className="border border-slate-300 px-2.5 py-1">{r.item}</td>
                          <td className="border border-slate-300 px-2.5 py-1">{r.quantity}</td>
                          <td className="border border-slate-300 px-2.5 py-1 text-right font-mono tabular-nums">
                            ₹ {Number(r.amount || 0).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={2} className="border border-slate-300 px-2.5 py-1.5 text-right">
                          कुल अनुमानित योग:
                        </td>
                        <td className="border border-slate-300 px-2.5 py-1.5 text-right font-mono tabular-nums">
                          ₹ {totalEstimateAmount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Vanshavali Lineage Table */}
              {includeLineageTable && lineageRows.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-200 break-inside-avoid">
                  <h3 className="text-xs font-bold text-slate-900 mb-2">
                    पीढ़ी-दर-पीढ़ी वंशावली तालिका (पारिस: {clan}):
                  </h3>
                  <table className="w-full border-collapse text-xs text-slate-800">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-2.5 py-1.5 text-left">पीढ़ी क्रम</th>
                        <th className="border border-slate-300 px-2.5 py-1.5 text-left">पूर्वज / सदस्य का नाम</th>
                        <th className="border border-slate-300 px-2.5 py-1.5 text-left">संबंध / विवरण</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineageRows.map((l) => (
                        <tr key={l.id}>
                          <td className="border border-slate-300 px-2.5 py-1 font-medium">{l.generation}</td>
                          <td className="border border-slate-300 px-2.5 py-1">{l.name}</td>
                          <td className="border border-slate-300 px-2.5 py-1">{l.relation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Enclosures */}
              {selectedEnclosures.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-200 break-inside-avoid">
                  <h3 className="text-xs font-bold text-slate-900 mb-1.5">
                    संलग्न दस्तावेज़ (Enclosures):
                  </h3>
                  <ol className="list-decimal list-inside space-y-0.5 text-xs text-slate-800">
                    {selectedEnclosures.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Attendance & Signature Roster */}
              {includeAttendanceTable && (
                <div className="mt-5 pt-4 border-t border-slate-200 break-inside-avoid">
                  <h3 className="text-xs font-bold text-slate-900 mb-2">
                    ग्राम सभा उपस्थिति एवं साक्षी हस्ताक्षर पंजी:
                  </h3>
                  <table className="w-full border-collapse text-xs text-slate-800">
                    <thead>
                      <tr className="bg-slate-100 print:bg-slate-50">
                        <th className="border border-slate-300 px-2 py-1.5 text-center w-10 font-mono tabular-nums">
                          क्र.
                        </th>
                        <th className="border border-slate-300 px-2.5 py-1.5 text-left">सदस्य का नाम</th>
                        <th className="border border-slate-300 px-2.5 py-1.5 text-left">पद / पारिस</th>
                        <th className="border border-slate-300 px-2.5 py-1.5 text-left w-36">
                          हस्ताक्षर / निशान
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceList.map((member, idx) => (
                        <tr key={member.id}>
                          <td className="border border-slate-300 px-2 py-1.5 text-center font-mono tabular-nums">
                            {idx + 1}
                          </td>
                          <td className="border border-slate-300 px-2.5 py-1.5 font-medium">{member.name}</td>
                          <td className="border border-slate-300 px-2.5 py-1.5">{member.roleOrClan}</td>
                          <td className="border border-slate-300 px-2.5 py-1.5" />
                        </tr>
                      ))}
                      {Array.from({ length: blankAttendanceRows }).map((_, idx) => (
                        <tr key={`blank_${idx}`}>
                          <td className="border border-slate-300 px-2 py-2 text-center font-mono tabular-nums text-slate-500">
                            {attendanceList.length + idx + 1}
                          </td>
                          <td className="border border-slate-300 px-2.5 py-2" />
                          <td className="border border-slate-300 px-2.5 py-2" />
                          <td className="border border-slate-300 px-2.5 py-2" />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Signatories & Custom Official SVG Stamp */}
              <div className="mt-10 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-slate-800 break-inside-avoid items-end">
                <div>
                  {applicantSignatureDataUrl ? (
                    <img
                      src={applicantSignatureDataUrl}
                      alt="आवेदक हस्ताक्षर"
                      className="h-12 object-contain mb-1"
                    />
                  ) : (
                    <div className="h-10" />
                  )}
                  <div className="pt-2 border-t border-slate-400">
                    <p className="font-bold text-slate-950">आवेदक / प्रस्ताव प्रस्तुतकर्ता के हस्ताक्षर</p>
                    <p className="mt-0.5">
                      नाम: {applicantName || '________________'} ({clan})
                    </p>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-3">
                  <div className="flex-1">
                    {majhiSignatureDataUrl ? (
                      <img
                        src={majhiSignatureDataUrl}
                        alt="मांझी हाड़ाम हस्ताक्षर"
                        className="h-12 object-contain mb-1"
                      />
                    ) : (
                      <div className="h-10" />
                    )}
                    <div className="pt-2 border-t border-slate-400">
                      <p className="font-bold text-slate-950">मांझी हाड़ाम / ग्राम प्रधान हस्ताक्षर व मुहर</p>
                      <p className="mt-0.5">
                        नाम: {majhiName || '________________'} ({village || '________'})
                      </p>
                    </div>
                  </div>

                  {includeStamp && (
                    <div className="shrink-0 w-24 h-24 rounded-full border-2 border-indigo-800/80 flex flex-col items-center justify-center text-center p-1.5 text-indigo-900 select-none">
                      <span className="text-[8.5px] font-bold leading-tight">{stampTitle}</span>
                      <span className="w-14 border-t border-indigo-800/60 my-1" />
                      <span className="text-[9px] font-extrabold leading-tight">{village}</span>
                      <span className="text-[7.5px] font-medium leading-tight">{block}, {district}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cut-Out Office Receiving Slip */}
              {includeReceiptSlip && (
                <div className="mt-8 pt-3.5 border-t-2 border-dashed border-slate-400 text-[11px] text-slate-800 space-y-2 break-inside-avoid">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-slate-950">
                    <span>✂ आवेदन पावती रसीद (Receiving Receipt — कार्यालय द्वारा आवेदक को लौटाएँ)</span>
                    <span className="font-mono tabular-nums">संदर्भ: {refNumber || '—'}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                    <span>
                      आवेदक: <strong>{applicantName}</strong> ({village})
                    </span>
                    <span className="font-mono tabular-nums sm:text-right">
                      आवेदन दिनांक: <strong>{formattedDate}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 line-clamp-1">
                    विषय: {subjectDetail}
                  </p>
                  <div className="pt-5 flex flex-wrap items-center justify-between gap-4 text-[11px]">
                    <span>प्राप्ति दिनांक: __________________</span>
                    <span>प्राप्तकर्ता अधिकारी के हस्ताक्षर व कार्यालय मुहर: ________________________</span>
                  </div>
                </div>
              )}

              <p className="mt-5 text-[10.5px] text-slate-500 text-center print:text-slate-600">
                नोट: यह प्रारूप विभिन्न सामुदायिक स्रोतों पर आधारित है; क्षेत्रीय बोली/प्रक्रिया के अनुसार आवश्यकतानुसार संशोधित कर उपयोग करें।
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};
