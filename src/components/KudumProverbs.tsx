import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { speakWithFemaleVoice } from '../utils/speech';
import { useAdmin } from '../context/AdminContext';
import { safeLoadFromStorage, safeSaveToStorage } from '../utils/storage';
import {
  HelpCircle,
  Lightbulb,
  Volume2,
  Copy,
  Check,
  Search,
  BookOpen,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Plus,
  X,
  Save
} from 'lucide-react';

export interface KudumItem {
  id: string;
  riddleDevanagari: string;
  riddleRoman: string;
  riddleHindi: string;
  answerDevanagari: string;
  answerRoman: string;
  answerHindi: string;
  explanation: string;
  category: 'nature' | 'household' | 'animal' | 'food';
}

export const DEFAULT_KUDUM_LIST: KudumItem[] = [
  {
    id: 'k1',
    riddleDevanagari: 'सेताक रे पुन जांगा, तिकिन रे बार जांगा, आयुप रे पे जांगा?',
    riddleRoman: 'Setag re pun janga, tikin re bar janga, ayup re pe janga?',
    riddleHindi: 'सुबह चार पैर पर, दोपहर दो पैर पर, शाम को तीन पैर पर चलता है?',
    answerDevanagari: 'मानमी (होड़)',
    answerRoman: 'Manmi (Hor) — Man',
    answerHindi: 'मनुष्य (इंसान का जीवनकाल - बचपन, जवानी, बुढ़ापा)',
    explanation: 'बचपन में घुटनों के बल (4), जवानी में सीधे (2), और बुढ़ापे में लाठी लेकर (3 पैर)।',
    category: 'nature'
  },
  {
    id: 'k2',
    riddleDevanagari: 'जिल बानुग ताय, हासा बानुग ताय, एनहोँ ओड़ाक बेनावाय?',
    riddleRoman: 'Jil banug tay, hasa banug tay, enho orag benaway?',
    riddleHindi: 'न मांस है, न मिट्टी है, फिर भी अपना सुंदर घर बनाता है?',
    answerDevanagari: 'बिंदी (Spider / मकड़ी)',
    answerRoman: 'Bindi (Spider / Makdi)',
    answerHindi: 'मकड़ी (जाल बुनती है)',
    explanation: 'मकड़ी बिना किसी सामग्री के केवल अपने रेशम से सुंदर जाल का घर बनाती है।',
    category: 'animal'
  },
  {
    id: 'k3',
    riddleDevanagari: 'मिदटांग गाय आड़ि आयमा बाछुर ए तोवा कोवा?',
    riddleRoman: 'Midtang gay adi ayma bachur e towa kowa?',
    riddleHindi: 'एक गाय बहुत सारे बछड़ों को दूध पिलाती है?',
    answerDevanagari: 'हुड़ु दाड़ी (धान की बाली / ढेंकी)',
    answerRoman: 'Huru Dari / Okhli & Dhenki',
    answerHindi: 'धान की बाली / ढेंकी',
    explanation: 'धान का एक पौधा सैकड़ों दानों को जीवन देता है।',
    category: 'food'
  },
  {
    id: 'k4',
    riddleDevanagari: 'बार बोयहा मिद साव तेकिन दाड़ा, मेनखान तिस होँ बाकिन ञापामा?',
    riddleRoman: 'Bar boyha mid saw tekin dara, menkhan tis ho bakin nyapama?',
    riddleHindi: 'दो भाई साथ-साथ दौड़ते हैं, लेकिन कभी आपस में मिल नहीं पाते?',
    answerDevanagari: 'सागाड़ चाका (बैलगाड़ी के पहिए)',
    answerRoman: 'Sagar Chaka (Wheels of Bullock Cart)',
    answerHindi: 'बैलगाड़ी के दोनों पहिये',
    explanation: 'पहिए हमेशा बराबर दूरी पर साथ चलते हैं मगर आपस में टकराते नहीं।',
    category: 'household'
  },
  {
    id: 'k5',
    riddleDevanagari: 'हारियाड़ ओड़ाक रे आराक ओड़ाक, आराक ओड़ाक रे हेँदे गिदरा?',
    riddleRoman: 'Hariyar orag re arag orag, arag orag re hende gidra?',
    riddleHindi: 'हरे घर में लाल घर, लाल घर में काले बच्चे?',
    answerDevanagari: 'तरबुज (Watermelon)',
    answerRoman: 'Torbuj (Watermelon)',
    answerHindi: 'तरबूज (हरा छिलका, लाल गूदा, काले बीज)',
    explanation: 'तरबूज की प्राकृतिक बनावट का अद्भुत संताली रूपक।',
    category: 'food'
  },
  {
    id: 'k6',
    riddleDevanagari: 'दाक रे उनुम लेखान बाय लोहोदोक-आ?',
    riddleRoman: 'Dag re unum lekhan bay lohodog-a?',
    riddleHindi: 'पानी में डूबने पर भी गीला नहीं होता?',
    answerDevanagari: 'उमुल (परछाई / छाया)',
    answerRoman: 'Umul (Shadow / Chhaya)',
    answerHindi: 'परछाई (छाया)',
    explanation: 'परछाई पानी की गहराई में भी बिना भीगे दिखाई देती है।',
    category: 'nature'
  },
  {
    id: 'k7',
    riddleDevanagari: 'बाहरे खोन चाकचोक, भितरी खोन आराक गे?',
    riddleRoman: 'Bahre khon chakchok, bhitri khon arag ge?',
    riddleHindi: 'बाहर से सख्त और अंदर से लाल दानेदार, बताओ क्या?',
    answerDevanagari: 'अनार (Dalim)',
    answerRoman: 'Dalim (Pomegranate)',
    answerHindi: 'अनार का फल',
    explanation: 'अनार के छिलके के भीतर सैकड़ों मोती जैसे लाल दाने सजे होते हैं।',
    category: 'food'
  },
  {
    id: 'k8',
    riddleDevanagari: 'पोंद सुताम, पोंद लुगड़ी, लेपेत मेनाय बारो मोड़ो?',
    riddleRoman: 'Pond sutam, pond lugri, lepet menay baro moro?',
    riddleHindi: 'सफेद कपड़ों की कई परतें ओढ़े रहता है, पर काटने पर आँखों से आँसू ला दे?',
    answerDevanagari: 'पेयाज (Onion)',
    answerRoman: 'Peyaj (Onion)',
    answerHindi: 'प्याज',
    explanation: 'प्याज की परत-दर-परत खोल और तीखी गंध का सुंदर वर्णन।',
    category: 'food'
  },
  {
    id: 'k9',
    riddleDevanagari: 'जांगा बानुग ताय, हात बानुग ताय, एनहोँ कुदाव ए दाड़ा?',
    riddleRoman: 'Janga banug tay, hat banug tay, enho kudaw e dara?',
    riddleHindi: 'न पैर हैं, न हाथ हैं, फिर भी बिना रुके दौड़ता चला जाता है?',
    answerDevanagari: 'दाक (गाडा दाक)',
    answerRoman: 'Gada Dak (Flowing River)',
    answerHindi: 'बहती हुई नदी की धारा',
    explanation: 'नदी बिना पैरों के पहाड़ों से मैदानों तक अनवरत बहती रहती है।',
    category: 'nature'
  },
  {
    id: 'k10',
    riddleDevanagari: 'ञिदा होयोक खान को उदुक-आ, सेताक होयोक खान को उकु-आ?',
    riddleRoman: 'Nyida hoyok khan ko uduk-a, setag hoyok khan ko uku-a?',
    riddleHindi: 'रात होते ही सब निकल आते हैं, सुबह होते ही कहाँ छिप जाते हैं?',
    answerDevanagari: 'इपिल (तारे)',
    answerRoman: 'Ipil (Stars)',
    answerHindi: 'आसमान के तारे',
    explanation: 'रात्रि के आकाश में असंख्य इपिल (तारे) सूर्य उगने पर ओझल हो जाते हैं।',
    category: 'nature'
  },
  {
    id: 'k11',
    riddleDevanagari: 'मिदटांग चेँड़े, बुट-बुट दाड़ा, आंगोय चालाक खान ए दुबुम-आ?',
    riddleRoman: 'Midtang chene, but-but dara, angoy chalak khan e dubum-a?',
    riddleHindi: 'छोटा-सा पक्षी जो दिनभर फुदकता है और घर आँगन की रखवाली करता है?',
    answerDevanagari: 'गोरैया (Ghar-Chatiya)',
    answerRoman: 'Gharchatiya (Sparrow)',
    answerHindi: 'गौरैया चिड़िया',
    explanation: 'ग्रामीण आँगन और छप्पर के बीच रहने वाली नन्ही चिड़िया।',
    category: 'animal'
  },
  {
    id: 'k12',
    riddleDevanagari: 'मिद मोचा रे बत्तीश गोतांग पोंद सिपाई?',
    riddleRoman: 'Mid mocha re battish gotang pond sipai?',
    riddleHindi: 'एक गुफा में बत्तीस सफेद सिपाही एक साथ पहरा देते हैं?',
    answerDevanagari: 'डाटा (दाँत)',
    answerRoman: 'Data (Teeth)',
    answerHindi: 'मुँह के बत्तीस दाँत',
    explanation: 'मनुष्य के मुख में स्थित 32 दाँतों का पहेली रूप।',
    category: 'nature'
  },
  {
    id: 'k13',
    riddleDevanagari: 'तीस होँ बाय जापिद-आ, गोता सिरमा ए ओंगोर-आ?',
    riddleRoman: 'Tis ho bay japid-a, gota sirma e ongor-a?',
    riddleHindi: 'जो कभी सोता नहीं, दिन-रात पहरा देता और धड़कता रहता है?',
    answerDevanagari: 'इमिड़ (दिल / हृदय)',
    answerRoman: 'Imir (Heart)',
    answerHindi: 'मनुष्य का हृदय (दिल)',
    explanation: 'जीवन के पहले क्षण से अंतिम क्षण तक हृदय बिना विश्राम धड़कता है।',
    category: 'nature'
  },
  {
    id: 'k14',
    riddleDevanagari: 'सिरि पोंद, हुरू लेकान मारांग कोरो?',
    riddleRoman: 'Siri pond, huru lekan marang koro?',
    riddleHindi: 'एक कटोरी में छोटे-छोटे मोती भरे हैं, पकाने पर सबको पेट भरते हैं?',
    answerDevanagari: 'चावले (चावल)',
    answerRoman: 'Chawle (Rice Grains)',
    answerHindi: 'चावल के दाने',
    explanation: 'संताली समाज का मुख्य आहार दाका/चावले।',
    category: 'food'
  },
  {
    id: 'k15',
    riddleDevanagari: 'काट रेनाक होड़मो, लोहा रेनाक लाता?',
    riddleRoman: 'Kat renak hormo, loha renak lata?',
    riddleHindi: 'लकड़ी का शरीर और लोहे का मुँह, धरती का सीना चीरकर अन्न उगाता है?',
    answerDevanagari: 'नाहेल (हल)',
    answerRoman: 'Nahel (Plough)',
    answerHindi: 'खेती का हल (नाहेल)',
    explanation: 'पारंपरिक काष्ठ व लौह फाल से बना कृषि हल।',
    category: 'household'
  },
  {
    id: 'k16',
    riddleDevanagari: 'आपांग ते तुपुर, लातार ते खांदुक, दाक बाहार उदुग-आ?',
    riddleRoman: 'Apang te tupur, latar te khanduk, dak bahar udug-a?',
    riddleHindi: 'तेज़ आंधी और बारिश में सिर पर छतरी की तरह खड़ा हो जाता है?',
    answerDevanagari: 'छोतोम (छतरी / बाँस की टोपी)',
    answerRoman: 'Chhotom / Chhata (Umbrella)',
    answerHindi: 'छाता या बाँस का गुंगु (टोपली)',
    explanation: 'खेत में वर्षा से बचाने वाला पारंपरिक बाँस का आवरण।',
    category: 'household'
  },
  {
    id: 'k17',
    riddleDevanagari: 'बारया सिका, मिदटांग आराक, दाग रें चोरोक-चोरोक?',
    riddleRoman: 'Barya sika, midtang arag, dag re chorok-chorok?',
    riddleHindi: 'दो सींग और लाल कलगी, सुबह होते ही पूरा गाँव जगाता है?',
    answerDevanagari: 'सांडी सिम (मुर्गा)',
    answerRoman: 'Sandi Sim (Rooster)',
    answerHindi: 'मुर्गा (भोर का अलार्म)',
    explanation: 'भोर में बाँग देकर गाँव को जगाने वाला मुर्गा।',
    category: 'animal'
  },
  {
    id: 'k18',
    riddleDevanagari: 'हासा लातार ते जावरा-आ, सेरमा खोन जाराक-आ?',
    riddleRoman: 'Hasa latar te jawra-a, serma khon jarak-a?',
    riddleHindi: 'मिट्टी के नीचे छिपा रहता है, किसान खोदकर निकालते हैं?',
    answerDevanagari: 'आलु / सकरकंद (Sakarkanda)',
    answerRoman: 'Aalu / Sakarkand (Tuber)',
    answerHindi: 'आलू या शकरकंद',
    explanation: 'धरती के भीतर उगने वाला कंद-मूल।',
    category: 'food'
  },
  {
    id: 'k19',
    riddleDevanagari: 'जिल बाय जom-आ, दाक बाय नु-आ, एनहोँ ताहेनाय?',
    riddleRoman: 'Jil bay jom-a, dak bay nu-a, enho tahenay?',
    riddleHindi: 'न खाना खाता है, न पानी पीता है, फिर भी हर चीज़ निगल सकता है?',
    answerDevanagari: 'सेंगेल (आग)',
    answerRoman: 'Sengel (Fire)',
    answerHindi: 'आग (अग्नि)',
    explanation: 'आग को जल डालने पर वह बुझ जाती है, पर सूखी लकड़ी तुरंत भस्म करती है।',
    category: 'nature'
  },
  {
    id: 'k20',
    riddleDevanagari: 'मिदटांग बुढ़ी, गोटा कुंडा साफा एदे-आ?',
    riddleRoman: 'Midtang budhi, gota kunda sapha ede-a?',
    riddleHindi: 'एक सहेली सुबह-शाम पूरा आँगन और घर चमका देती है?',
    answerDevanagari: 'जोनोंक (झाड़ू)',
    answerRoman: 'Jonok (Broom)',
    answerHindi: 'झाड़ू (सफाई का प्रतीक)',
    explanation: 'सिरहाना या काँस की घास से बना पारंपरिक झाड़ू।',
    category: 'household'
  },
  {
    id: 'k21',
    riddleDevanagari: 'ताड़ामुख रे उड़ाक-आ, दाक ञेल ते रास्का-ओक-आ?',
    riddleRoman: 'Taramukh re urak-a, dak nyel te raska-ok-a?',
    riddleHindi: 'आसमान में नाचता है और बादल देख कर सुंदर पंख फैलाता है?',
    answerDevanagari: 'मारा (मोर)',
    answerRoman: 'Mara (Peacock)',
    answerHindi: 'मोर (मयूर)',
    explanation: 'वर्षा ऋतु में पंख फैलाकर नृत्य करने वाला मोर।',
    category: 'animal'
  },
  {
    id: 'k22',
    riddleDevanagari: 'बारया गोटांग आड़ें, दिन भोर जोगावा-मेया?',
    riddleRoman: 'Barya gotang aren, din bhor jogawa-meya?',
    riddleHindi: 'दो छोटे चमकते दर्पण, जो पूरी दुनिया दिखाते हैं पर खुद को नहीं देख पाते?',
    answerDevanagari: 'मेत् (आँखें)',
    answerRoman: 'Met (Eyes)',
    answerHindi: 'मनुष्य की दोनों आँखें',
    explanation: 'आँखें सारा संसार देखती हैं पर स्वयं को दर्पण में ही देख सकती हैं।',
    category: 'nature'
  },
  {
    id: 'k23',
    riddleDevanagari: 'हाथा रे मेनाक-आ, दोरोम रे मेनाक-आ, अखड़ा रे सदे-आ?',
    riddleRoman: 'Hatha re menak-a, dorom re menak-a, akhra re sade-a?',
    riddleHindi: 'माटी और चमड़े से बना है, थाप पड़ते ही पूरे गाँव को नचा देता है?',
    answerDevanagari: 'तुमदाक (मांदर)',
    answerRoman: 'Tumdak (Traditional Drum)',
    answerHindi: 'तुमदाक (संताली मांदर)',
    explanation: 'संताली अखाड़े और हर पर्व की जान तुमदाक वाद्ययंत्र।',
    category: 'household'
  },
  {
    id: 'k24',
    riddleDevanagari: 'तीर लेकान सोझ, बान लेकान चापो, बियार-बुरु रे दाड़ा?',
    riddleRoman: 'Tir lekan sojh, ban lekan chapo, biyar-buru re dara?',
    riddleHindi: 'छोटा-सा पर चार पाँव से बिजली की तरह जंगल में दौड़ता है?',
    answerDevanagari: 'कुलाई (खरगोश)',
    answerRoman: 'Kulai (Rabbit / Hare)',
    answerHindi: 'जंगली खरगोश',
    explanation: 'जंगल में फुर्ती से दौड़ने वाला कुलाई (खरगोश)।',
    category: 'animal'
  }
];

export interface ProverbItem {
  id: string;
  devanagari: string;
  roman: string;
  hindi: string;
  meaning: string;
  category: 'wisdom' | 'unity' | 'work' | 'nature';
}

const DEFAULT_PROVERB_LIST: ProverbItem[] = [
  {
    id: 'p1',
    devanagari: 'जाँहाय ए सिया, उनी गे एरा',
    roman: 'Jahay e siya, uni ge era',
    hindi: 'जो हल चलाएगा, वही फसल बोएगा।',
    meaning: 'कर्म और परिश्रम करने वाले को ही सफलता का फल प्राप्त होता है।',
    category: 'work'
  },
  {
    id: 'p2',
    devanagari: 'मिद टांग काटुब ते सुनुम बांग हालांगोक-आ',
    roman: 'Mid tang katub te sunum bang halangog-a',
    hindi: 'एक अंगुली से तेल नहीं उठाया जा सकता।',
    meaning: 'एकता में ही बल है; बड़े कार्य समाज के सामूहिक सहयोग से ही संभव होते हैं।',
    category: 'unity'
  },
  {
    id: 'p3',
    devanagari: 'पड़हाव बांग बाड़ाय होड़ दो काँणा साव समान',
    roman: 'Ol bang baday hor do kana saw soman',
    hindi: 'जो पढ़ना-लिखना नहीं जानता, वह अंधे के समान है।',
    meaning: 'शिक्षा और भाषा का ज्ञान जीवन में प्रकाश और स्वाभिमान लाता है।',
    category: 'wisdom'
  },
  {
    id: 'p4',
    devanagari: 'दारे ताहेन खान उमुल, होड़ ताहेन खान गोड़ो',
    roman: 'Dare tahen khan umul, hor tahen khan goro',
    hindi: 'पेड़ होगा तो छाया मिलेगी, स्वजन होंगे तो सहारा मिलेगा।',
    meaning: 'प्रकृति और समाज दोनों ही मनुष्य के जीवन की वास्तविक ढाल हैं।',
    category: 'nature'
  },
  {
    id: 'p5',
    devanagari: 'आलोम कुड़ियाक-आ, जीवी दो सारि गे चालाक-आ',
    roman: 'Alom kuriyag-a, jiwi do sari ge chalag-a',
    hindi: 'आलस मत करो, समय और जीवन निरंतर बहता जा रहा है।',
    meaning: 'समय अनमोल है; युवाओं को समय नष्ट न कर अपने हुनर को निखारना चाहिए।',
    category: 'work'
  },
  {
    id: 'p6',
    devanagari: 'आतो ताहेन खान मांझी, मांझी ताहेन खान नियाव',
    roman: 'Ato tahen khan Manjhi, Manjhi tahen khan niyaw',
    hindi: 'गाँव रहेगा तो मांझी रहेगा, और मांझी रहेगा तो न्याय रहेगा।',
    meaning: 'पारंपरिक ग्राम स्वशासन व्यवस्था ही समाज में शांति और न्याय की नींव है।',
    category: 'unity'
  },
  {
    id: 'p7',
    devanagari: 'दाक बानुग खान धुरती रे जीवी बानुग-आ',
    roman: 'Dak banug khan dhurti re jiwi banug-a',
    hindi: 'जल नहीं होगा तो धरती पर जीवन नहीं बचेगा।',
    meaning: 'जल, जंगल और जमीन का संरक्षण समस्त प्राणियों के अस्तित्व की प्रथम शर्त है।',
    category: 'nature'
  },
  {
    id: 'p8',
    devanagari: 'होड़ मोचा खोन बाहा रोड़ ओडोक ले रे सुख बुझाउ-आ',
    roman: 'Hor mocha khon baha ror odok le re sukh bujhau-a',
    hindi: 'मनुष्य के मुख से फूल जैसी मधुर वाणी निकले तो सबको सुख मिलता है।',
    meaning: 'मीठी और सम्मानजनक भाषा आपसी संबंधों को मज़बूत बनाती है।',
    category: 'wisdom'
  },
  {
    id: 'p9',
    devanagari: 'सारि काथा दो तिरो होँ बांग उकु-आ',
    roman: 'Sari katha do tiro ho bang uku-a',
    hindi: 'सच्ची बात कभी छिप नहीं सकती।',
    meaning: 'सत्य चाहे जितना दबाया जाए, अंततः सूर्य की तरह चमक कर सामने आ ही जाता है।',
    category: 'wisdom'
  },
  {
    id: 'p10',
    devanagari: 'मिद मोंए ते कामि ले खान बुरु होँ हिलउ-आ',
    roman: 'Mid mone te kami le khan buru ho hilau-a',
    hindi: 'एक मन और एकता से काम करें तो पहाड़ भी हिल जाता है।',
    meaning: 'सामुदायिक एकता से असंभव प्रतीत होने वाले लक्ष्य भी पूरे किए जा सकते हैं।',
    category: 'unity'
  },
  {
    id: 'p11',
    devanagari: 'सीतंग रे जोखाय काते राबांग रे जom मे',
    roman: 'Sitang re jokhay kate rabang re jom me',
    hindi: 'गर्मी और बरसात में मेहनत करोगे, तभी सर्दी में चैन से खा पाओगे।',
    meaning: 'भविष्य की सुरक्षा के लिए समय रहते परिश्रम और बचत आवश्यक है।',
    category: 'work'
  },
  {
    id: 'p12',
    devanagari: 'बुरु रेनाक दारे आलोम माक-आ, ओना गे आबोवाक जीवी',
    roman: 'Buru renak dare alom mak-a, ona ge abowak jiwi',
    hindi: 'पहाड़ के हरे पेड़ों को मत काटो, वही हमारा जीवन और साँस हैं।',
    meaning: 'संताली संस्कृति में वन को देवता और जीवनदायिनी माँ माना गया है।',
    category: 'nature'
  },
  {
    id: 'p13',
    devanagari: 'गिदरा को चेद ले खान दिसोम चेद-ओक-आ',
    roman: 'Gidra ko ched le khan disom ched-ok-a',
    hindi: 'बच्चे सीखेंगे तो पूरा देश और समाज शिक्षित होगा।',
    meaning: 'नई पीढ़ी को मातृभाषा और आधुनिक शिक्षा से जोड़ना समाज की सबसे बड़ी सेवा है।',
    category: 'wisdom'
  },
  {
    id: 'p14',
    devanagari: 'कामी सेरमा खोन चेतान बानुग-आ',
    roman: 'Kami serma khon chetan banug-a',
    hindi: 'परिश्रम से बढ़कर आसमान में भी कुछ नहीं है।',
    meaning: 'आलस्य छोड़कर ईमानदार मेहनत करना ही असली पूजा और धर्म है।',
    category: 'work'
  },
  {
    id: 'p15',
    devanagari: 'बाहा बिर रे सो काना, होड़ सावता रे भालाय सो काना',
    roman: 'Baha bir re so kana, hor sawta re bhalay so kana',
    hindi: 'फूल जंगल को महकाता है, और भलाई समाज को महकाती है।',
    meaning: 'अच्छे कर्म और परोपकार से समाज में व्यक्ति की कीर्ति फैलती है।',
    category: 'nature'
  },
  {
    id: 'p16',
    devanagari: 'अपनार पारसी ताहेन खान अपना अपनार उयुप ताहेना',
    roman: 'Apnar parsi tahen khan apna apnar uprum tahena',
    hindi: 'अपनी मातृभाषा बची रहेगी, तभी अपनी असली पहचान बची रहेगी।',
    meaning: 'भाषा ही किसी समुदाय की संस्कृति, इतिहास और स्वाभिमान की रक्षा करती है।',
    category: 'unity'
  },
  {
    id: 'p17',
    devanagari: 'दारे जो रे खोन बुट रे चेपेर आ',
    roman: 'Dare jo re khon but re cheper a',
    hindi: 'पेड़ जब फलों से भरता है तो उसकी डालियाँ झुक जाती हैं।',
    meaning: 'सच्चा ज्ञानी और समर्थ व्यक्ति हमेशा विनम्र और सरल स्वभाव का होता है।',
    category: 'wisdom'
  },
  {
    id: 'p18',
    devanagari: 'होड़ आलोम हेतेर-आ, जोतोवाक जीवी मिद गेया',
    roman: 'Hor alom heter-a, jotowak jiwi mid geya',
    hindi: 'किसी मनुष्य को छोटा मत समझो, सबके भीतर एक ही प्राण है।',
    meaning: 'समानता और भाईचारा संताली सामाजिक दर्शन का मूल आधार है।',
    category: 'unity'
  },
  {
    id: 'p19',
    devanagari: 'नावा दाक रे नावा उमिद हिजु-आ',
    roman: 'Nawa dak re nawa umid hiju-a',
    hindi: 'नई बारिश के साथ नई उम्मीद और हरियाली आती है।',
    meaning: 'कठिन समय के बाद हमेशा सुखद परिवर्तन और नए अवसर आते हैं।',
    category: 'nature'
  },
  {
    id: 'p20',
    devanagari: 'सिरिजोन रेनाक मान दोहो मे, बोंगा-बुरु को रास्का-ओक-आ',
    roman: 'Sirijon renak man doho me, bonga-buru ko raska-ok-a',
    hindi: 'प्रकृति और सृष्टि का सम्मान करो, तभी देवता और पूर्वज प्रसन्न रहेंगे।',
    meaning: 'प्रकृति के साथ संतुलन बनाकर जीना ही सच्चा जीवन मार्ग है।',
    category: 'nature'
  },
  {
    id: 'p21',
    devanagari: 'तेहेञ रेनाक कामी गापा लागित आलोम दोहोय मे',
    roman: 'Tehenj renak kami gapa lagit alom dohoy me',
    hindi: 'आज का काम कल पर मत टालो।',
    meaning: 'तत्परता और अनुशासन से ही हर कार्य समय पर सफल होता है।',
    category: 'work'
  },
  {
    id: 'p22',
    devanagari: 'हाड़ाम-बुढ़ी वाक काथा दो सुना रेनाक सिकड़ी कान',
    roman: 'Haram-budhi wag katha do suna renak sikri kana',
    hindi: 'बुजुर्गों की सीख सोने की जंजीर के समान अमूल्य होती है।',
    meaning: 'बड़ों का अनुभव और मार्गदर्शन कठिन परिस्थितियों में सही राह दिखाता है।',
    category: 'wisdom'
  }
];

export const KudumProverbs: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState<'kudum' | 'proverbs'>('kudum');
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);
  const [kudumCatFilter, setKudumCatFilter] = useState<string>('all');
  const [proverbCatFilter, setProverbCatFilter] = useState<string>('all');
  const [formError, setFormError] = useState('');

  // Persistent lists (merge newly shipped defaults by ID without overwriting user additions)
  const [kudumList, setKudumList] = useState<KudumItem[]>(() => {
    const saved = safeLoadFromStorage<KudumItem[]>('hor_katha_kudum_db', DEFAULT_KUDUM_LIST);
    const existingIds = new Set(saved.map((k) => k.id));
    const missing = DEFAULT_KUDUM_LIST.filter((k) => !existingIds.has(k.id));
    return missing.length > 0 ? [...saved, ...missing] : saved;
  });

  const [proverbList, setProverbList] = useState<ProverbItem[]>(() => {
    const saved = safeLoadFromStorage<ProverbItem[]>('hor_katha_proverbs_db', DEFAULT_PROVERB_LIST);
    const existingIds = new Set(saved.map((p) => p.id));
    const missing = DEFAULT_PROVERB_LIST.filter((p) => !existingIds.has(p.id));
    return missing.length > 0 ? [...saved, ...missing] : saved;
  });

  useEffect(() => {
    safeSaveToStorage('hor_katha_kudum_db', kudumList);
  }, [kudumList]);

  useEffect(() => {
    safeSaveToStorage('hor_katha_proverbs_db', proverbList);
  }, [proverbList]);

  // Modal State for Kudum
  const [isKudumModalOpen, setIsKudumModalOpen] = useState(false);
  const [editingKudumId, setEditingKudumId] = useState<string | null>(null);
  const [kudumForm, setKudumForm] = useState<Omit<KudumItem, 'id'>>({
    riddleDevanagari: '',
    riddleRoman: '',
    riddleHindi: '',
    answerDevanagari: '',
    answerRoman: '',
    answerHindi: '',
    explanation: '',
    category: 'nature'
  });

  // Modal State for Proverb
  const [isProverbModalOpen, setIsProverbModalOpen] = useState(false);
  const [editingProverbId, setEditingProverbId] = useState<string | null>(null);
  const [proverbForm, setProverbForm] = useState<Omit<ProverbItem, 'id'>>({
    devanagari: '',
    roman: '',
    hindi: '',
    meaning: '',
    category: 'wisdom'
  });

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Kudum CRUD
  const handleOpenAddKudum = () => {
    setEditingKudumId(null);
    setFormError('');
    setKudumForm({
      riddleDevanagari: '',
      riddleRoman: '',
      riddleHindi: '',
      answerDevanagari: '',
      answerRoman: '',
      answerHindi: '',
      explanation: '',
      category: 'nature'
    });
    setIsKudumModalOpen(true);
  };

  const handleOpenEditKudum = (item: KudumItem) => {
    setEditingKudumId(item.id);
    setFormError('');
    setKudumForm({
      riddleDevanagari: item.riddleDevanagari,
      riddleRoman: item.riddleRoman,
      riddleHindi: item.riddleHindi,
      answerDevanagari: item.answerDevanagari,
      answerRoman: item.answerRoman,
      answerHindi: item.answerHindi,
      explanation: item.explanation,
      category: item.category
    });
    setIsKudumModalOpen(true);
  };

  const handleDeleteKudum = (id: string) => {
    setKudumList((prev) => prev.filter((k) => k.id !== id));
  };

  const handleSaveKudum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kudumForm.riddleHindi.trim() || !kudumForm.answerHindi.trim()) {
      setFormError('कृपया पहेली और उत्तर (हिंदी में) अवश्य भरें।');
      return;
    }
    if (editingKudumId) {
      setKudumList((prev) =>
        prev.map((k) => (k.id === editingKudumId ? { ...kudumForm, id: editingKudumId } : k))
      );
    } else {
      const newItem: KudumItem = {
        ...kudumForm,
        id: `k_${Date.now()}`
      };
      setKudumList((prev) => [newItem, ...prev]);
    }
    setIsKudumModalOpen(false);
  };

  // Proverb CRUD
  const handleOpenAddProverb = () => {
    setEditingProverbId(null);
    setFormError('');
    setProverbForm({
      devanagari: '',
      roman: '',
      hindi: '',
      meaning: '',
      category: 'wisdom'
    });
    setIsProverbModalOpen(true);
  };

  const handleOpenEditProverb = (item: ProverbItem) => {
    setEditingProverbId(item.id);
    setFormError('');
    setProverbForm({
      devanagari: item.devanagari,
      roman: item.roman,
      hindi: item.hindi,
      meaning: item.meaning,
      category: item.category
    });
    setIsProverbModalOpen(true);
  };

  const handleDeleteProverb = (id: string) => {
    setProverbList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveProverb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proverbForm.hindi.trim() || !proverbForm.meaning.trim()) {
      setFormError('कृपया कहावत और उसका भावार्थ अवश्य भरें।');
      return;
    }
    if (editingProverbId) {
      setProverbList((prev) =>
        prev.map((p) => (p.id === editingProverbId ? { ...proverbForm, id: editingProverbId } : p))
      );
    } else {
      const newItem: ProverbItem = {
        ...proverbForm,
        id: `p_${Date.now()}`
      };
      setProverbList((prev) => [newItem, ...prev]);
    }
    setIsProverbModalOpen(false);
  };

  const filteredKudum = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return kudumList.filter((k) => {
      const matchesCat = kudumCatFilter === 'all' || k.category === kudumCatFilter;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        k.riddleHindi.toLowerCase().includes(q) ||
        k.riddleRoman.toLowerCase().includes(q) ||
        k.riddleDevanagari.toLowerCase().includes(q) ||
        k.answerHindi.toLowerCase().includes(q)
      );
    });
  }, [kudumList, kudumCatFilter, deferredSearch]);

  const filteredProverbs = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    return proverbList.filter((p) => {
      const matchesCat = proverbCatFilter === 'all' || p.category === proverbCatFilter;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        p.hindi.toLowerCase().includes(q) ||
        p.roman.toLowerCase().includes(q) ||
        p.devanagari.toLowerCase().includes(q) ||
        p.meaning.toLowerCase().includes(q)
      );
    });
  }, [proverbList, proverbCatFilter, deferredSearch]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-sky-800 text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-[11px] font-bold uppercase tracking-wider">
              Oral Folklore &amp; Wisdom
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
              Kudum &amp; Bhent-Katha
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1.5 tracking-tight flex items-center gap-2.5">
            <HelpCircle className="w-7 h-7 text-amber-300" />
            <span>Kudum (साओताली पहेलियाँ) &amp; Proverbs</span>
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 font-medium mt-1">
            Explore centuries of Santali wit, clever folklore riddles, and timeless community proverbs.
          </p>
        </div>

        {/* View Switcher & Admin Add Button */}
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <button
              onClick={activeTab === 'kudum' ? handleOpenAddKudum : handleOpenAddProverb}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{activeTab === 'kudum' ? 'Add Kudum (पहेली)' : 'Add Proverb (कहावत)'}</span>
            </button>
          )}

          <div className="flex items-center bg-black/25 p-1 rounded-2xl border border-white/20 shrink-0">
            <button
              onClick={() => setActiveTab('kudum')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 tabular-nums ${
                activeTab === 'kudum'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Kudum Riddles ({kudumList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('proverbs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 tabular-nums ${
                activeTab === 'proverbs'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Wise Proverbs ({proverbList.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar & Category Filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search riddles, questions, answers, or keywords in Santali Devanagari, Roman or Hindi..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {activeTab === 'kudum' ? (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
            {[
              { id: 'all', label: 'सभी पहेलियाँ' },
              { id: 'nature', label: 'प्रकृति (Nature)' },
              { id: 'animal', label: 'जीव-जंतु (Animals)' },
              { id: 'food', label: 'खान-पान व कृषि (Food)' },
              { id: 'household', label: 'घरेलू व वाद्य (Household)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setKudumCatFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl shrink-0 cursor-pointer transition-colors ${
                  kudumCatFilter === cat.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
            {[
              { id: 'all', label: 'सभी कहावतें' },
              { id: 'wisdom', label: 'ज्ञान व शिक्षा (Wisdom)' },
              { id: 'unity', label: 'एकता व समाज (Unity)' },
              { id: 'work', label: 'कर्म व परिश्रम (Work)' },
              { id: 'nature', label: 'प्रकृति दर्शन (Nature)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setProverbCatFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl shrink-0 cursor-pointer transition-colors ${
                  proverbCatFilter === cat.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Rendering: Riddles (Kudum) */}
      {activeTab === 'kudum' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredKudum.map((kudum) => {
            const isRevealed = revealedIds.includes(kudum.id);
            return (
              <div
                key={kudum.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-teal-500/50 transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      Category: {kudum.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Admin Edit / Delete Icons */}
                      {isAdmin && (
                        <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-lg border border-amber-200">
                          <button
                            onClick={() => handleOpenEditKudum(kudum)}
                            className="p-1 text-slate-500 hover:text-amber-700 rounded-md transition-colors cursor-pointer"
                            title="Edit Kudum"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteKudum(kudum.id)}
                            className="p-1 text-slate-500 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                            title="Delete Kudum"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => speakWithFemaleVoice(kudum.riddleHindi, { lang: 'hi-IN' })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
                        title="Listen Riddle"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Riddle Text */}
                  <h3 className="text-base sm:text-lg font-black font-serif text-slate-900 leading-snug">
                    {kudum.riddleDevanagari}
                  </h3>
                  <p className="text-xs font-semibold text-teal-700">{kudum.riddleRoman}</p>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    "{kudum.riddleHindi}"
                  </p>
                </div>

                {/* Answer Reveal Area */}
                <div className="pt-2 border-t border-slate-100">
                  {isRevealed ? (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3.5 space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                          Answer / उत्तर:
                        </span>
                        <button
                          onClick={() => toggleReveal(kudum.id)}
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Hide</span>
                        </button>
                      </div>
                      <p className="font-serif font-black text-amber-950 text-base">
                        {kudum.answerDevanagari}
                      </p>
                      <p className="text-xs font-bold text-amber-900">{kudum.answerRoman}</p>
                      <p className="text-xs text-slate-700 leading-relaxed pt-1">
                        {kudum.answerHindi} — <span className="text-slate-500">{kudum.explanation}</span>
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleReveal(kudum.id)}
                      className="w-full py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer group hover:scale-[1.01]"
                    >
                      <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>Tap to Reveal Answer (उत्तर देखें)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content Rendering: Wise Proverbs (Bhent-Katha) */}
      {activeTab === 'proverbs' && (
        <div className="space-y-3">
          {filteredProverbs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-400/50 transition-all space-y-3 relative group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    Theme: {item.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-black font-serif text-slate-900 pt-1">
                    {item.devanagari}
                  </h3>
                  <p className="text-xs font-bold text-amber-800">{item.roman}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Admin Edit / Delete Icons */}
                  {isAdmin && (
                    <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-lg border border-amber-200">
                      <button
                        onClick={() => handleOpenEditProverb(item)}
                        className="p-1 text-slate-500 hover:text-amber-700 rounded-md transition-colors cursor-pointer"
                        title="Edit Proverb"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProverb(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                        title="Delete Proverb"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => speakWithFemaleVoice(`${item.hindi}. ${item.meaning}`, { lang: 'hi-IN' })}
                    className="p-2 rounded-xl text-slate-400 hover:text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer"
                    title="Pronounce proverb"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleCopy(item.id, `${item.devanagari}\n${item.roman}\n"${item.hindi}"`)}
                    className="p-2 rounded-xl text-slate-400 hover:text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer"
                    title="Copy proverb"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                <p className="font-bold text-slate-800">"{item.hindi}"</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>भावार्थ:</strong> {item.meaning}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KUDUM ADD / EDIT MODAL */}
      {isKudumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[92vh] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-teal-600" />
                <span>{editingKudumId ? 'Edit Kudum Riddle' : 'Add New Kudum Riddle (नई पहेली)'}</span>
              </h3>
              <button
                onClick={() => setIsKudumModalOpen(false)}
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

            <form onSubmit={handleSaveKudum} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Riddle in Santali Devanagari (संताली देवनागरी कुदुम)</label>
                <input
                  type="text"
                  value={kudumForm.riddleDevanagari}
                  onChange={(e) => setKudumForm({ ...kudumForm, riddleDevanagari: e.target.value })}
                  placeholder="e.g. सेताक रे पुन जांगा..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Riddle in Roman Santali</label>
                <input
                  type="text"
                  value={kudumForm.riddleRoman}
                  onChange={(e) => setKudumForm({ ...kudumForm, riddleRoman: e.target.value })}
                  placeholder="e.g. Setag re pun janga..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Riddle in Hindi (पहेली - हिंदी में) *</label>
                <input
                  type="text"
                  required
                  value={kudumForm.riddleHindi}
                  onChange={(e) => setKudumForm({ ...kudumForm, riddleHindi: e.target.value })}
                  placeholder="e.g. सुबह चार पैर पर..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Answer Santali Devanagari</label>
                  <input
                    type="text"
                    value={kudumForm.answerDevanagari}
                    onChange={(e) => setKudumForm({ ...kudumForm, answerDevanagari: e.target.value })}
                    placeholder="e.g. मानमी (होड़)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Answer Roman</label>
                  <input
                    type="text"
                    value={kudumForm.answerRoman}
                    onChange={(e) => setKudumForm({ ...kudumForm, answerRoman: e.target.value })}
                    placeholder="e.g. Manmi (Human)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Answer in Hindi (उत्तर) *</label>
                <input
                  type="text"
                  required
                  value={kudumForm.answerHindi}
                  onChange={(e) => setKudumForm({ ...kudumForm, answerHindi: e.target.value })}
                  placeholder="e.g. मनुष्य (इंसान)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cultural Explanation / भावार्थ</label>
                <textarea
                  rows={2}
                  value={kudumForm.explanation}
                  onChange={(e) => setKudumForm({ ...kudumForm, explanation: e.target.value })}
                  placeholder="e.g. बचपन में घुटनों के बल, जवानी में..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={kudumForm.category}
                  onChange={(e) => setKudumForm({ ...kudumForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="nature">Nature / प्रकृति</option>
                  <option value="animal">Animal / जीव-जंतु</option>
                  <option value="food">Food &amp; Agriculture / खान-पान</option>
                  <option value="household">Household / घरेलू वस्तुएं</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsKudumModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingKudumId ? 'Update Kudum' : 'Add to Kudum List'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROVERB ADD / EDIT MODAL */}
      {isProverbModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[92vh] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>{editingProverbId ? 'Edit Proverb' : 'Add New Proverb (नई कहावत)'}</span>
              </h3>
              <button
                onClick={() => setIsProverbModalOpen(false)}
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

            <form onSubmit={handleSaveProverb} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Proverb in Santali Devanagari (संताली देवनागरी कहावत)</label>
                <input
                  type="text"
                  value={proverbForm.devanagari}
                  onChange={(e) => setProverbForm({ ...proverbForm, devanagari: e.target.value })}
                  placeholder="e.g. जाँहाय ए सिया, उनी गे एरा..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Proverb in Roman Santali</label>
                <input
                  type="text"
                  value={proverbForm.roman}
                  onChange={(e) => setProverbForm({ ...proverbForm, roman: e.target.value })}
                  placeholder="e.g. Jahay e siya, uni ge era..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Proverb in Hindi (कहावत) *</label>
                <input
                  type="text"
                  required
                  value={proverbForm.hindi}
                  onChange={(e) => setProverbForm({ ...proverbForm, hindi: e.target.value })}
                  placeholder="e.g. जो हल चलाएगा, वही फसल बोएगा..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Meaning &amp; Wisdom (भावार्थ) *</label>
                <textarea
                  rows={2}
                  required
                  value={proverbForm.meaning}
                  onChange={(e) => setProverbForm({ ...proverbForm, meaning: e.target.value })}
                  placeholder="e.g. कर्म और परिश्रम करने वाले को ही..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category / Theme</label>
                <select
                  value={proverbForm.category}
                  onChange={(e) => setProverbForm({ ...proverbForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="wisdom">Wisdom / ज्ञान</option>
                  <option value="work">Work &amp; Labor / कर्म</option>
                  <option value="unity">Unity / एकता</option>
                  <option value="nature">Nature / प्रकृति</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProverbModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProverbId ? 'Update Proverb' : 'Add to Proverb List'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
