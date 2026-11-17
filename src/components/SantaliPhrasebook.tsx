import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { speakWithFemaleVoice } from '../utils/speech';
import { useAdmin } from '../context/AdminContext';
import { safeLoadFromStorage, safeSaveToStorage } from '../utils/storage';
import {
  MessageSquare,
  Volume2,
  Search,
  Copy,
  Check,
  Edit2,
  Trash2,
  Plus,
  X,
  Save
} from 'lucide-react';

export interface PhraseItem {
  id: string;
  category: string;
  santaliRoman: string;
  santaliDevanagari: string;
  hindi: string;
  english: string;
  context?: string;
}

export const DEFAULT_PHRASES_DATA: PhraseItem[] = [
  // 1. Greetings & Respect (10)
  {
    id: 'ph-1',
    category: 'Greetings',
    santaliRoman: 'Johar! Cheleka menak-pea?',
    santaliDevanagari: 'जोहार! चेलेका मेनाक-पेया?',
    hindi: 'नमस्ते! आप सब कैसे हैं?',
    english: 'Greetings! How are you all?',
    context: 'Standard respectful tribal greeting'
  },
  {
    id: 'ph-2',
    category: 'Greetings',
    santaliRoman: 'Iņ do bhagē ge menaņa.',
    santaliDevanagari: 'इञ दो भागे गे मेनाञा।',
    hindi: 'मैं ठीक / सकुशल हूँ।',
    english: 'I am doing well / fine.',
    context: 'Polite reply to greeting'
  },
  {
    id: 'ph-3',
    category: 'Greetings',
    santaliRoman: 'Aam do okoe kanaam?',
    santaliDevanagari: 'आम दो ओकोय कानाम?',
    hindi: 'आप कौन हैं?',
    english: 'Who are you?',
    context: 'Asking identity politely'
  },
  {
    id: 'ph-4',
    category: 'Greetings',
    santaliRoman: 'Adi sarhao!',
    santaliDevanagari: 'अ़डि सारहाव!',
    hindi: 'बहुत-बहुत धन्यवाद!',
    english: 'Thank you very much!',
    context: 'Expression of gratitude'
  },
  {
    id: 'ph-15',
    category: 'Greetings',
    santaliRoman: 'Iņak nyutum do Soma kana.',
    santaliDevanagari: 'इञाक् ञुतुम दो सोमा काना।',
    hindi: 'मेरा नाम सोमा है।',
    english: 'My name is Soma.',
    context: 'Introducing yourself'
  },
  {
    id: 'ph-16',
    category: 'Greetings',
    santaliRoman: 'Aamaḱ nyutum do chet kana?',
    santaliDevanagari: 'आमाक् ञुतुम दो चेत् काना?',
    hindi: 'आपका शुभ नाम क्या है?',
    english: 'What is your name?',
    context: 'Asking someone’s name'
  },
  {
    id: 'ph-17',
    category: 'Greetings',
    santaliRoman: 'Orak re sanam ko bhage gea?',
    santaliDevanagari: 'ओड़ाक् रे सानम को भागे गेया?',
    hindi: 'घर में सभी लोग कुशल-मंगल हैं?',
    english: 'Is everyone well at home?',
    context: 'Inquiring about family wellbeing'
  },
  {
    id: 'ph-18',
    category: 'Greetings',
    santaliRoman: 'Bhage te tahen me, Johar!',
    santaliDevanagari: 'भागे ते ताहेन मे, जोहार!',
    hindi: 'अपना ध्यान रखिए, नमस्ते (फिर मिलेंगे)!',
    english: 'Stay well, goodbye!',
    context: 'Parting greeting'
  },
  {
    id: 'ph-19',
    category: 'Greetings',
    santaliRoman: 'Dela, orak te bolok me, durup me.',
    santaliDevanagari: 'देला, ओड़ाक् ते बोलोक मे, दुरुप् मे।',
    hindi: 'आइए, घर के अंदर आइए और बैठिए।',
    english: 'Come inside the house and please sit down.',
    context: 'Welcoming guests with warmth'
  },
  {
    id: 'ph-20',
    category: 'Greetings',
    santaliRoman: 'Aam saw nyapam kate adi khushi bujhau-ena.',
    santaliDevanagari: 'आम साव ञापाम काते अ़डि खुशी बुझाउ-एना।',
    hindi: 'आपसे मिलकर बहुत खुशी हुई।',
    english: 'Very happy to meet you.',
    context: 'Warm welcome'
  },

  // 2. Family & Home (10)
  {
    id: 'ph-5',
    category: 'Family & Home',
    santaliRoman: 'Aboaḱ orak do nawa gea.',
    santaliDevanagari: 'आबोवाक् ओड़ाक् दो नावा गेया।',
    hindi: 'हमारा घर नया है।',
    english: 'Our house is new.',
    context: 'Talking about home'
  },
  {
    id: 'ph-6',
    category: 'Family & Home',
    santaliRoman: 'Daka jom me, daka ready gea.',
    santaliDevanagari: 'दाका जोम मे, दाका रेडी गेया।',
    hindi: 'खाना खा लो, भोजन तैयार है।',
    english: 'Have your meal, the food is ready.',
    context: 'Calling family to eat'
  },
  {
    id: 'ph-7',
    category: 'Family & Home',
    santaliRoman: 'Iņren hopon do school teye sen akana.',
    santaliDevanagari: 'इञरेन होपोन दो स्कूल तेये सेन आकाना।',
    hindi: 'मेरा बच्चा स्कूल गया हुआ है।',
    english: 'My child has gone to school.',
    context: 'Parental conversation'
  },
  {
    id: 'ph-21',
    category: 'Family & Home',
    santaliRoman: 'Mit glass daḱ aguime, tetang idiñ kana.',
    santaliDevanagari: 'मिद गिलास दाक् आगुइमे, तेतांग इदिञ काना।',
    hindi: 'एक गिलास पानी लाओ, मुझे प्यास लगी है।',
    english: 'Bring a glass of water, I am feeling thirsty.',
    context: 'Requesting water at home'
  },
  {
    id: 'ph-22',
    category: 'Family & Home',
    santaliRoman: 'Ayo-baba do khet tekin chalaw akana.',
    santaliDevanagari: 'आयो-बाबा दो खेत तेकिन चालाव आकाना।',
    hindi: 'माता-पिता खेत गए हुए हैं।',
    english: 'Mother and father have gone to the field.',
    context: 'Explaining parents’ whereabouts'
  },
  {
    id: 'ph-23',
    category: 'Family & Home',
    santaliRoman: 'Marań dada ar huding boko do mit saw menak-kina.',
    santaliDevanagari: 'मारांग दादा आर हुडिंग बोको दो मिद साव मेनाक-किना।',
    hindi: 'बड़े भाई और छोटे भाई साथ में हैं।',
    english: 'Elder brother and younger brother are together.',
    context: 'Sibling conversation'
  },
  {
    id: 'ph-24',
    category: 'Family & Home',
    santaliRoman: 'Ayup ena, nitok do japid hoyo-a.',
    santaliDevanagari: 'आयुप एना, नितोक दो जापिद होयो-आ।',
    hindi: 'शाम/रात हो गई है, अब सोना चाहिए।',
    english: 'It is late evening, now it is time to sleep.',
    context: 'Bedtime routine'
  },
  {
    id: 'ph-25',
    category: 'Family & Home',
    santaliRoman: 'Setag behal re beret kate kaami etohob me.',
    santaliDevanagari: 'सेताक बेहाल रे बेरेत काते कामी एतोहोब मे।',
    hindi: 'सुबह जल्दी उठकर अपना काम शुरू करो।',
    english: 'Wake up early in the morning and start your work.',
    context: 'Morning household routine'
  },
  {
    id: 'ph-26',
    category: 'Family & Home',
    santaliRoman: 'Gidra ko do racha reko khelau-kan kana.',
    santaliDevanagari: 'गिदरा को दो राचा रेको खेलाव-कान काना।',
    hindi: 'बच्चे आँगन में खेल रहे हैं।',
    english: 'The children are playing in the courtyard.',
    context: 'Evening at village courtyard'
  },
  {
    id: 'ph-27',
    category: 'Family & Home',
    santaliRoman: 'Orak duwar sapha te doho me.',
    santaliDevanagari: 'ओड़ाक् दुवार साफा ते दोहो मे।',
    hindi: 'घर और दरवाज़ा साफ-सुथरा रखो।',
    english: 'Keep the house and entrance clean.',
    context: 'Household cleanliness'
  },

  // 3. Market & Trade (9)
  {
    id: 'ph-8',
    category: 'Market & Trade',
    santaliRoman: 'Noa do tinaḱ dam kana?',
    santaliDevanagari: 'नोवा दो तिना़क् दाम काना?',
    hindi: 'इसकी क्या कीमत है / यह कितने का है?',
    english: 'How much does this cost?',
    context: 'Bargaining at weekly bazaar'
  },
  {
    id: 'ph-9',
    category: 'Market & Trade',
    santaliRoman: 'Mit kilo aalu emān me.',
    santaliDevanagari: 'मिद किलो आलु एमा़ञ मे।',
    hindi: 'मुझे एक किलो आलू दीजिए।',
    english: 'Please give me one kilogram of potatoes.',
    context: 'Buying grocery items'
  },
  {
    id: 'ph-10',
    category: 'Market & Trade',
    santaliRoman: 'Teheñ hāt khon kiriņ aguime.',
    santaliDevanagari: 'तेहेञ हाट खोन किरिञ आगुइमे।',
    hindi: 'आज साप्ताहिक हाट से खरीद कर ले आओ।',
    english: 'Buy and bring it from today’s village market.',
    context: 'Village market day shopping'
  },
  {
    id: 'ph-28',
    category: 'Market & Trade',
    santaliRoman: 'Dam do thora kom me.',
    santaliDevanagari: 'दाम दो थोड़ा कोम मे।',
    hindi: 'कीमत थोड़ा कम कीजिए।',
    english: 'Please reduce the price a little.',
    context: 'Polite bargaining in Haat'
  },
  {
    id: 'ph-29',
    category: 'Market & Trade',
    santaliRoman: 'Nawa ar hariyar aarak menak-a chi?',
    santaliDevanagari: 'नावा आर हारियाड़ आराक मेनाक-आ चि?',
    hindi: 'क्या ताज़ा और हरी सब्ज़ी (साग) उपलब्ध है?',
    english: 'Are fresh green leafy vegetables available?',
    context: 'Buying leafy greens at haat'
  },
  {
    id: 'ph-30',
    category: 'Market & Trade',
    santaliRoman: 'Bulung, sunum ar marich hat khon kiriņ me.',
    santaliDevanagari: 'बुलुंग, सुनुम आर मारीच हाट खोन किरिञ मे।',
    hindi: 'नमक, तेल और मिर्च बाजार से खरीद लो।',
    english: 'Buy salt, oil, and chillies from the market.',
    context: 'Kitchen essentials list'
  },
  {
    id: 'ph-31',
    category: 'Market & Trade',
    santaliRoman: 'Iņ thech barti poysa banug-a.',
    santaliDevanagari: 'इञ ठेच बार्ती पोयसा बानुग-आ।',
    hindi: 'मेरे पास खुले पैसे (चिल्लर) नहीं हैं।',
    english: 'I do not have extra loose change.',
    context: 'Cash payment at shop'
  },
  {
    id: 'ph-32',
    category: 'Market & Trade',
    santaliRoman: 'Tula-jokha do thik te kora me.',
    santaliDevanagari: 'तुला-जोखा दो ठीक ते कोरा मे।',
    hindi: 'तौल-माप बिल्कुल सही से कीजिए।',
    english: 'Please weigh the goods accurately.',
    context: 'Ensuring fair weight'
  },
  {
    id: 'ph-33',
    category: 'Market & Trade',
    santaliRoman: 'Nawa chawle tinak taka ser akana?',
    santaliDevanagari: 'नावा चावले तिनाक टाका सेर आकाना?',
    hindi: 'नया चावल कितने रुपये किलो मिल रहा है?',
    english: 'How much per kilo is the new rice selling for?',
    context: 'Grain purchase'
  },

  // 4. Farming & Nature (9)
  {
    id: 'ph-11',
    category: 'Farming & Nature',
    santaliRoman: 'Dak jorok kana, khet te chalak hoyo-a.',
    santaliDevanagari: 'दाग जोरोक काना, खेत ते चालाक होयो-आ।',
    hindi: 'बारिश हो रही है, खेत जाना होगा।',
    english: 'It is raining, we must go to the field.',
    context: 'Paddy sowing season'
  },
  {
    id: 'ph-12',
    category: 'Farming & Nature',
    santaliRoman: 'Sal baha do adi bēsh so-a.',
    santaliDevanagari: 'साल बाहा दो अ़डि बेश सो-आ।',
    hindi: 'साल का फूल बहुत सुगंधित होता है।',
    english: 'The Sal flower has a very pleasant fragrance.',
    context: 'Baha festival nature conversation'
  },
  {
    id: 'ph-34',
    category: 'Farming & Nature',
    santaliRoman: 'Huru rohoy renak oktho seter ena.',
    santaliDevanagari: 'हुड़ु रोहोय रेनाक ओकथो सेतेर एना।',
    hindi: 'धान रोपनी का समय आ गया है।',
    english: 'The time for paddy transplantation has arrived.',
    context: 'Monsoon agriculture'
  },
  {
    id: 'ph-35',
    category: 'Farming & Nature',
    santaliRoman: 'Bir-buru ar dare-nari banchao dohoi jarura.',
    santaliDevanagari: 'बीर-बुरु आर दारे-नारी बांचाव दोहोय जरूड़ा।',
    hindi: 'जंगल-पहाड़ और पेड़-पौधों की रक्षा करना ज़रूरी है।',
    english: 'It is essential to protect forests, hills, and trees.',
    context: 'Environmental conservation'
  },
  {
    id: 'ph-36',
    category: 'Farming & Nature',
    santaliRoman: 'Gada re dak perech akana.',
    santaliDevanagari: 'गाडा रे दाक पेरेच आकाना।',
    hindi: 'नदी में पानी लबालब भर गया है।',
    english: 'The river is full of water.',
    context: 'Rainy season landscape'
  },
  {
    id: 'ph-37',
    category: 'Farming & Nature',
    santaliRoman: 'Hoyo adi raban bujhau-kan kana.',
    santaliDevanagari: 'होयो अ़डि राबान बुझाउ-कान काना।',
    hindi: 'हवा बहुत ठंडी महसूस हो रही है।',
    english: 'The breeze feels very cold.',
    context: 'Winter season weather'
  },
  {
    id: 'ph-38',
    category: 'Farming & Nature',
    santaliRoman: 'Tehenj setonj adi kera gea.',
    santaliDevanagari: 'तेहेंञ सेतोञ अ़डि केड़ा गेया।',
    hindi: 'आज धूप बहुत तेज़ है।',
    english: 'The sunlight is very strong today.',
    context: 'Summer afternoon'
  },
  {
    id: 'ph-39',
    category: 'Farming & Nature',
    santaliRoman: 'Huru ir kate kharihan reko doho-a.',
    santaliDevanagari: 'हुड़ु इर काते खरिहान रेको दोहो-आ।',
    hindi: 'धान काटकर खलिहान में रखा जाता है।',
    english: 'After harvesting paddy, it is kept in the threshing floor.',
    context: 'Harvest season work'
  },
  {
    id: 'ph-40',
    category: 'Farming & Nature',
    santaliRoman: 'Sarjom dare do Jaher Than re pujak-a.',
    santaliDevanagari: 'सारजोम दारे दो जाहेर थान रे पुजाक-आ।',
    hindi: 'साल के वृक्ष की जाहेर थान में पूजा होती है।',
    english: 'The Sal tree is revered at the sacred Jaher Than grove.',
    context: 'Sacred forest culture'
  },

  // 5. Festivals & Culture (9)
  {
    id: 'ph-13',
    category: 'Festivals',
    santaliRoman: 'Sohrai parab re dāngra ko bhāgē te arso-koya.',
    santaliDevanagari: 'सोहराय परोब रे दांग्रा को भागे ते आ़र्सो-कोया।',
    hindi: 'सोहराय पर्व में बैलों और मवेशियों की पूजा की जाती है।',
    english: 'During the Sohrai festival, cattle and oxen are blessed and honored.',
    context: 'Winter harvest festival'
  },
  {
    id: 'ph-14',
    category: 'Festivals',
    santaliRoman: 'Tiryo ar Tamak ru-kan kana.',
    santaliDevanagari: 'तिर्यो आर टामाक रु-कान काना।',
    hindi: 'बांसुरी और नगाड़ा बज रहा है।',
    english: 'The bamboo flute and traditional kettle drum are playing.',
    context: 'Traditional music gathering'
  },
  {
    id: 'ph-41',
    category: 'Festivals',
    santaliRoman: 'Sohrai parab renak sagun johar!',
    santaliDevanagari: 'सोहराय परोब रेनाक सागुन जोहार!',
    hindi: 'सोहराय महापर्व की मंगलमय शुभकामनाएँ (जोहार)!',
    english: 'Blessed greetings for the Sohrai festival!',
    context: 'Festival greeting card phrase'
  },
  {
    id: 'ph-42',
    category: 'Festivals',
    santaliRoman: 'Baha parab re Naeke baba bonga-eya.',
    santaliDevanagari: 'बाहा परोब रे नायके बाबा बोंगा-एया।',
    hindi: 'बाहा पर्व में नायके बाबा पूजा-अर्चना करते हैं।',
    english: 'During the Baha festival, the village priest Naeke offers prayers.',
    context: 'Spring Baha celebration'
  },
  {
    id: 'ph-43',
    category: 'Festivals',
    santaliRoman: 'Dela, Akhra re lagre enech bon chalak-a.',
    santaliDevanagari: 'देला, आखड़ा रे लागड़े एनेच बोन चालाक-आ।',
    hindi: 'चलो, अखाड़ा में लागड़े नृत्य देखने व नाचने चलते हैं।',
    english: 'Come, let us go to the Akhra courtyard for the Lagre dance.',
    context: 'Village festival night'
  },
  {
    id: 'ph-44',
    category: 'Festivals',
    santaliRoman: 'Karam parab re karam dare ko bid-a.',
    santaliDevanagari: 'करम परोब रे करम दारे को बिद-आ।',
    hindi: 'करम पर्व में करम की डाल रोपकर पूजा की जाती है।',
    english: 'During Karam festival, the sacred Karam branch is planted and revered.',
    context: 'Monsoon festival tradition'
  },
  {
    id: 'ph-45',
    category: 'Festivals',
    santaliRoman: 'Erok Sim parab re nawa itak ko jom-a.',
    santaliDevanagari: 'एरोक सिम परोब रे नावा इताक को जोम-आ।',
    hindi: 'एरोक सिम पर्व के बाद नए बीज की बुआई शुरू होती है।',
    english: 'Sowing of new seeds begins after the Erok Sim festival.',
    context: 'Sowing season ritual'
  },
  {
    id: 'ph-46',
    category: 'Festivals',
    santaliRoman: 'Tumdak sade anjom kate mon raska-ok kana.',
    santaliDevanagari: 'तुमदाक सादे आंजोम काते मोन रास्का-ओक काना।',
    hindi: 'मांदर (तुमदाक) की आवाज़ सुनकर मन प्रसन्न हो रहा है।',
    english: 'Hearing the rhythm of the Tumdak drum fills the heart with joy.',
    context: 'Cultural celebration'
  },
  {
    id: 'ph-47',
    category: 'Festivals',
    santaliRoman: 'Magh Sim parab do serma mudchat re hoyok-a.',
    santaliDevanagari: 'माघ सिम परोब दो सेरमा मुदचात रे होयोक-आ।',
    hindi: 'माघ सिम पर्व वर्ष के समापन और नव-साल के आरंभ में मनाया जाता है।',
    english: 'Magh Sim marks the conclusion of the traditional agricultural year.',
    context: 'Annual village thanksgiving'
  },

  // 6. Health & Help (8)
  {
    id: 'ph-48',
    category: 'Health & Help',
    santaliRoman: 'Iņak hormo banug bhage kana.',
    santaliDevanagari: 'इञाक् होड़मो बानुग भागे काना।',
    hindi: 'मेरी तबीयत ठीक नहीं लग रही है।',
    english: 'I am not feeling well.',
    context: 'Reporting illness'
  },
  {
    id: 'ph-49',
    category: 'Health & Help',
    santaliRoman: 'Iņak bohok haso-edinj kana.',
    santaliDevanagari: 'इञाक् बोहोक हासो-एदिञ काना।',
    hindi: 'मेरे सिर में दर्द हो रहा है।',
    english: 'I have a headache.',
    context: 'Describing symptoms'
  },
  {
    id: 'ph-50',
    category: 'Health & Help',
    santaliRoman: 'Layar haso ar rua menak-tinja.',
    santaliDevanagari: 'लायार हासो आर रुआ मेनाक-तिञा।',
    hindi: 'मुझे पेट दर्द और बुखार है।',
    english: 'I have stomach pain and fever.',
    context: 'Speaking to a doctor or health worker'
  },
  {
    id: 'ph-51',
    category: 'Health & Help',
    santaliRoman: 'Dayakate iņ goro anj me!',
    santaliDevanagari: 'दयाकाते इञ गोड़ो आञ मे!',
    hindi: 'कृपया मेरी मदद कीजिए!',
    english: 'Please help me!',
    context: 'Asking for urgent assistance'
  },
  {
    id: 'ph-52',
    category: 'Health & Help',
    santaliRoman: 'Aspatal do okare menak-a?',
    santaliDevanagari: 'अस्पताल दो ओकारे मेनाक-आ?',
    hindi: 'अस्पताल / स्वास्थ्य केंद्र कहाँ स्थित है?',
    english: 'Where is the hospital or clinic located?',
    context: 'Seeking medical care'
  },
  {
    id: 'ph-53',
    category: 'Health & Help',
    santaliRoman: 'Ran oktho re jom me, jirauk me.',
    santaliDevanagari: 'रान ओकथो रे जोम मे, जिराउक मे।',
    hindi: 'दवाई समय पर लें और आराम करें।',
    english: 'Take your medicine on time and take rest.',
    context: 'Caring for a patient'
  },
  {
    id: 'ph-54',
    category: 'Health & Help',
    santaliRoman: 'Sapha dak nu me ar pharcha daka jom me.',
    santaliDevanagari: 'साफा दाक नु मे आर फारचा दाका जोम मे।',
    hindi: 'साफ पानी पिएं और ताज़ा भोजन खाएं।',
    english: 'Drink clean water and eat fresh food.',
    context: 'Daily hygiene & health advice'
  },
  {
    id: 'ph-55',
    category: 'Health & Help',
    santaliRoman: 'Nitoḱ do cheleka bujhau-edam?',
    santaliDevanagari: 'नितोक् दो चेलेका बुझाउ-एदाम?',
    hindi: 'अब आपको कैसा महसूस हो रहा है?',
    english: 'How are you feeling now?',
    context: 'Checking on recovery'
  },

  // 7. Travel & Village (8)
  {
    id: 'ph-56',
    category: 'Travel & Village',
    santaliRoman: 'Aam do oka ato khon em hech akana?',
    santaliDevanagari: 'आम दो ओका आतो खोन एम हेच आकाना?',
    hindi: 'आप किस गांव से आए हैं?',
    english: 'Which village have you come from?',
    context: 'Friendly village inquiry'
  },
  {
    id: 'ph-57',
    category: 'Travel & Village',
    santaliRoman: 'Noa hor do oka te chala-ak-a?',
    santaliDevanagari: 'नोवा होर दो ओका ते चाला-आक-आ?',
    hindi: 'यह रास्ता किस ओर जाता है?',
    english: 'Where does this road lead to?',
    context: 'Asking for directions'
  },
  {
    id: 'ph-58',
    category: 'Travel & Village',
    santaliRoman: 'Bus stand do tinak sangiņ re menak-a?',
    santaliDevanagari: 'बस स्टैंड दो तिना़क् सांगिञ रे मेनाक-आ?',
    hindi: 'बस स्टैंड यहाँ से कितनी दूर है?',
    english: 'How far is the bus stand from here?',
    context: 'Travel inquiry'
  },
  {
    id: 'ph-59',
    category: 'Travel & Village',
    santaliRoman: 'Manjhi Than do ato talare menak-a.',
    santaliDevanagari: 'मांझी थान दो आतो तालारे मेनाक-आ।',
    hindi: 'मांझी थान गांव के बीच में स्थित है।',
    english: 'The Manjhi Than is located in the center of the village.',
    context: 'Village landmarks'
  },
  {
    id: 'ph-60',
    category: 'Travel & Village',
    santaliRoman: 'Sida sen me, ena tayom jom seč achur me.',
    santaliDevanagari: 'सिदा सेन मे, एना तायोम जोम सेच आचुर मे।',
    hindi: 'सीधे जाइए, उसके बाद दाहिनी तरफ मुड़ जाइए।',
    english: 'Go straight, then turn to the right.',
    context: 'Giving clear directions'
  },
  {
    id: 'ph-61',
    category: 'Travel & Village',
    santaliRoman: 'Bas do tin baje seter-ok-a?',
    santaliDevanagari: 'बस दो तिन बाजे सेतेर-ओक-आ?',
    hindi: 'बस कितने बजे पहुँचेगी?',
    english: 'What time will the bus arrive?',
    context: 'Public transit timing'
  },
  {
    id: 'ph-62',
    category: 'Travel & Village',
    santaliRoman: 'Gapa iņ Ranchi teń chalak-a.',
    santaliDevanagari: 'गापा इञ रांची तेञ चालाक-आ।',
    hindi: 'कल मैं रांची जाऊँगा।',
    english: 'Tomorrow I will travel to Ranchi.',
    context: 'Travel plans'
  },
  {
    id: 'ph-63',
    category: 'Travel & Village',
    santaliRoman: 'Gram Sabha baithak re sanam hor seter-pe.',
    santaliDevanagari: 'ग्राम सभा बैठक रे सानम होड़ सेतेर-पे।',
    hindi: 'ग्राम सभा की बैठक में सभी लोग उपस्थित रहें।',
    english: 'Everyone please attend the Gram Sabha meeting.',
    context: 'Community notice'
  },

  // 8. School & Office (7)
  {
    id: 'ph-64',
    category: 'School & Office',
    santaliRoman: 'Potob parhao me ar ol ched me.',
    santaliDevanagari: 'पोतोब पढ़ाव मे आर ओल चेद मे।',
    hindi: 'किताब पढ़ो और लिखना सीखो।',
    english: 'Read the book and learn to write.',
    context: 'Classroom encouragement'
  },
  {
    id: 'ph-65',
    category: 'School & Office',
    santaliRoman: 'Santali parsi parhao do adi jarura.',
    santaliDevanagari: 'संताली पारसी पढ़ाव दो अ़डि जरूड़ा।',
    hindi: 'संताली भाषा पढ़ना और सीखना बहुत आवश्यक है।',
    english: 'Learning and reading the Santali language is very important.',
    context: 'Mother tongue education'
  },
  {
    id: 'ph-66',
    category: 'School & Office',
    santaliRoman: 'Noa kagaj re sohi korao me.',
    santaliDevanagari: 'नोवा कागज रे सोही कोराव मे।',
    hindi: 'इस कागज़ (दस्तावेज़) पर हस्ताक्षर कीजिए।',
    english: 'Please sign on this document.',
    context: 'Official paperwork'
  },
  {
    id: 'ph-67',
    category: 'School & Office',
    santaliRoman: 'Kalam ar kagaj aguime, ol hoyo-a.',
    santaliDevanagari: 'कलम आर कागज आगुइमे, ओल होयो-आ।',
    hindi: 'कलम और कागज़ लाओ, लिखना है।',
    english: 'Bring a pen and paper, we need to write.',
    context: 'Study or application writing'
  },
  {
    id: 'ph-68',
    category: 'School & Office',
    santaliRoman: 'Banao katha bujhao anj me.',
    santaliDevanagari: 'बानाव काथा बुझाव आञ मे।',
    hindi: 'कृपया इस विषय को मुझे समझा दीजिए।',
    english: 'Please explain this matter to me.',
    context: 'Asking teacher or officer'
  },
  {
    id: 'ph-69',
    category: 'School & Office',
    santaliRoman: 'Tehenj school re pariksha menak-a.',
    santaliDevanagari: 'तेहेंञ स्कूल रे परीक्षा मेनाक-आ।',
    hindi: 'आज विद्यालय में परीक्षा है।',
    english: 'There is an exam at school today.',
    context: 'Student conversation'
  },
  {
    id: 'ph-70',
    category: 'School & Office',
    santaliRoman: 'Oktho re kami pura me.',
    santaliDevanagari: 'ओकथो रे कामी पुरा मे।',
    hindi: 'समय पर अपना कार्य पूरा करो।',
    english: 'Complete your task on time.',
    context: 'Workplace or study discipline'
  }
];

const CATEGORIES = [
  'All',
  'Greetings',
  'Family & Home',
  'Market & Trade',
  'Farming & Nature',
  'Festivals',
  'Health & Help',
  'Travel & Village',
  'School & Office'
];

export const SantaliPhrasebook: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isAdmin } = useAdmin();
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // Persistent Phrases state (merges newly shipped default phrases by ID without overwriting custom edits)
  const [phrasesList, setPhrasesList] = useState<PhraseItem[]>(() => {
    const saved = safeLoadFromStorage<PhraseItem[]>('hor_katha_phrasebook_db', DEFAULT_PHRASES_DATA);
    const existingIds = new Set(saved.map((p) => p.id));
    const missingDefaults = DEFAULT_PHRASES_DATA.filter((p) => !existingIds.has(p.id));
    return missingDefaults.length > 0 ? [...saved, ...missingDefaults] : saved;
  });

  useEffect(() => {
    safeSaveToStorage('hor_katha_phrasebook_db', phrasesList);
  }, [phrasesList]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhraseId, setEditingPhraseId] = useState<string | null>(null);
  const [phraseForm, setPhraseForm] = useState<Omit<PhraseItem, 'id'>>({
    category: 'Greetings',
    santaliRoman: '',
    santaliDevanagari: '',
    hindi: '',
    english: '',
    context: ''
  });

  const handleOpenAdd = () => {
    setEditingPhraseId(null);
    setFormError('');
    setPhraseForm({
      category: 'Greetings',
      santaliRoman: '',
      santaliDevanagari: '',
      hindi: '',
      english: '',
      context: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (phrase: PhraseItem) => {
    setEditingPhraseId(phrase.id);
    setFormError('');
    setPhraseForm({
      category: phrase.category,
      santaliRoman: phrase.santaliRoman,
      santaliDevanagari: phrase.santaliDevanagari,
      hindi: phrase.hindi,
      english: phrase.english,
      context: phrase.context || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setPhrasesList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phraseForm.santaliRoman.trim() || !phraseForm.hindi.trim()) {
      setFormError('कृपया संताली रोमन वाक्य और हिंदी अर्थ अवश्य भरें।');
      return;
    }

    if (editingPhraseId) {
      setPhrasesList((prev) =>
        prev.map((p) => (p.id === editingPhraseId ? { ...phraseForm, id: editingPhraseId } : p))
      );
    } else {
      const newPhrase: PhraseItem = {
        ...phraseForm,
        id: `ph_${Date.now()}`
      };
      setPhrasesList((prev) => [newPhrase, ...prev]);
    }
    setIsModalOpen(false);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: phrasesList.length };
    for (const p of phrasesList) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [phrasesList]);

  const filteredPhrases = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return phrasesList.filter((p) => {
      const matchesCat = selectedCat === 'All' || p.category === selectedCat;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        p.santaliRoman.toLowerCase().includes(q) ||
        p.santaliDevanagari.toLowerCase().includes(q) ||
        p.hindi.toLowerCase().includes(q) ||
        p.english.toLowerCase().includes(q)
      );
    });
  }, [phrasesList, selectedCat, deferredSearch]);

  const handleSpeak = (text: string) => {
    speakWithFemaleVoice(text, { autoDetectLanguage: true, rate: 0.88 });
  };

  const handleCopy = (phrase: PhraseItem) => {
    const text = `${phrase.santaliRoman} (${phrase.santaliDevanagari})\nHindi: ${phrase.hindi}\nEnglish: ${phrase.english}`;
    navigator.clipboard.writeText(text);
    setCopiedId(phrase.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`space-y-4 max-w-5xl mx-auto ${compact ? 'p-1 text-xs' : ''}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-[11px] font-bold uppercase tracking-wider inline-block">
            Daily Indigenous Conversations
          </span>
          <h1 className="text-xl sm:text-2xl font-black mt-1 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span>Everyday Santali Phrasebook</span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
            Essential spoken Santali dialogues with voice pronunciation in Roman, Santali Devanagari, Hindi &amp; English.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Phrase (वाक्य जोड़ें)</span>
            </button>
          )}

          <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-2 text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-100 block">Total Phrases</span>
            <span className="text-lg font-black text-white tabular-nums">{phrasesList.length} Spoken Dialogues</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phrases by Santali words, Devanagari, Hindi or English meaning..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedCat === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md tabular-nums ${
                  selectedCat === cat ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                }`}
              >
                {categoryCounts[cat] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Phrases Grid */}
      {filteredPhrases.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500 font-medium">
          कोई वाक्य नहीं मिला। कृपया खोज शब्द या श्रेणी बदलकर देखें।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredPhrases.map((phrase) => (
            <div
              key={phrase.id}
              className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all space-y-2.5 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  {phrase.category}
                </span>

                <div className="flex items-center gap-1">
                  {/* Admin Pen (Edit) and Delete Icons */}
                  {isAdmin && (
                    <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-lg border border-amber-200">
                      <button
                        onClick={() => handleOpenEdit(phrase)}
                        className="p-1 text-slate-500 hover:text-amber-700 rounded-md transition-colors cursor-pointer"
                        title="Edit Phrase"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(phrase.id)}
                        className="p-1 text-slate-500 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                        title="Delete Phrase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleCopy(phrase)}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Copy Phrase"
                  >
                    {copiedId === phrase.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleSpeak(phrase.santaliDevanagari || phrase.santaliRoman)}
                    className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-all hover:scale-105 cursor-pointer shadow-2xs"
                    title="Listen Pronunciation"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-700" />
                  </button>
                </div>
              </div>

              {/* Santali Text */}
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {phrase.santaliRoman}
                </h3>
                <p className="text-sm font-serif font-bold text-amber-900 bg-amber-50/60 px-2.5 py-0.5 rounded-lg inline-block border border-amber-200/40">
                  {phrase.santaliDevanagari}
                </p>
              </div>

              {/* Meanings */}
              <div className="pt-1 border-t border-slate-100 text-xs space-y-1">
                <p className="text-slate-700">
                  <strong className="text-emerald-700 font-semibold">Hindi: </strong>
                  {phrase.hindi}
                </p>
                <p className="text-slate-500">
                  <strong className="text-slate-400 font-semibold">English: </strong>
                  {phrase.english}
                </p>
              </div>

              {phrase.context && (
                <p className="text-[10px] text-slate-400 italic">
                  Context: {phrase.context}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PHRASE ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[92vh] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>{editingPhraseId ? 'Edit Phrase' : 'Add New Phrase (नया वाक्य जोड़ें)'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Santali in Roman Script *</label>
                <input
                  type="text"
                  required
                  value={phraseForm.santaliRoman}
                  onChange={(e) => setPhraseForm({ ...phraseForm, santaliRoman: e.target.value })}
                  placeholder="e.g. Johar! Cheleka menak-pea?"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Santali in Devanagari (संताली देवनागरी)</label>
                <input
                  type="text"
                  value={phraseForm.santaliDevanagari}
                  onChange={(e) => setPhraseForm({ ...phraseForm, santaliDevanagari: e.target.value })}
                  placeholder="e.g. जोहार! चेलेका मेनाक-पेया?"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hindi Translation (हिंदी अर्थ) *</label>
                <input
                  type="text"
                  required
                  value={phraseForm.hindi}
                  onChange={(e) => setPhraseForm({ ...phraseForm, hindi: e.target.value })}
                  placeholder="e.g. नमस्ते! आप सब कैसे हैं?"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">English Translation</label>
                <input
                  type="text"
                  value={phraseForm.english}
                  onChange={(e) => setPhraseForm({ ...phraseForm, english: e.target.value })}
                  placeholder="e.g. Greetings! How are you all?"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={phraseForm.category}
                    onChange={(e) => setPhraseForm({ ...phraseForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Context / Usage Note</label>
                  <input
                    type="text"
                    value={phraseForm.context}
                    onChange={(e) => setPhraseForm({ ...phraseForm, context: e.target.value })}
                    placeholder="e.g. Standard respectful tribal greeting"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPhraseId ? 'Update Phrase' : 'Add to Phrasebook'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
