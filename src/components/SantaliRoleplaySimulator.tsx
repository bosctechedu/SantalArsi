import React, { useState, useEffect } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  MessageSquare,
  Volume2,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Award,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface RoleplayOption {
  id: string;
  santaliDev: string;
  santaliRoman: string;
  hindiMeaning: string;
  points: number;
  feedbackHi: string;
  nextNodeId: string | null;
}

interface RoleplayNode {
  id: string;
  npcName: string;
  npcRole: string;
  npcSantaliDev: string;
  npcSantaliRoman: string;
  npcHindiMeaning: string;
  culturalTip?: string;
  options: RoleplayOption[];
}

interface RoleplayScenario {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  difficulty: 'सरल' | 'मध्यम' | 'व्यावहारिक';
  startNodeId: string;
  nodes: Record<string, RoleplayNode>;
}

const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: 'haat_market',
    title: 'हाट-बाज़ार में सब्ज़ी व मोलभाव',
    subtitle: 'साप्ताहिक ग्रामीण हाट में ताज़ी सब्ज़ी व महुआ खरीदने का संवाद',
    location: 'दुमका साप्ताहिक हाट',
    difficulty: 'सरल',
    startNodeId: 'h1',
    nodes: {
      h1: {
        id: 'h1',
        npcName: 'फुलमुनी दीदी',
        npcRole: 'सब्ज़ी विक्रेता',
        npcSantaliDev: 'जोहार दादा! आलौम हातावा, नावा कुहड़ा आर बिलाती मेनाक्-आ। चेत् एम किरीञा?',
        npcSantaliRoman: 'Johar dada! Alom hatawa, nawa kuhda ar bilati menak-a. Chet em kirinja?',
        npcHindiMeaning: 'जोहार भैया! आइए लीजिए, ताज़ा कद्दू और टमाटर हैं। आप क्या खरीदेंगे?',
        culturalTip: 'हाट में बात शुरू करने से पहले "जोहार" कहना आत्मीयता और सम्मान दर्शाता है।',
        options: [
          {
            id: 'h1_a',
            santaliDev: 'जोहार दीदी! नोवा बिलाती दो तिन ते किलो कान ताबोना?',
            santaliRoman: 'Johar didi! Nowa bilati do tin te kilo kan tabona?',
            hindiMeaning: 'जोहार दीदी! यह टमाटर कितने रुपये किलो है?',
            points: 20,
            feedbackHi: 'उत्तम! "तांबोना" जोड़ने से संताली में विनम्र और अपनापन भरा भाव आता है।',
            nextNodeId: 'h2_good'
          },
          {
            id: 'h1_b',
            santaliDev: 'बिलाती तिन दाम काना?',
            santaliRoman: 'Bilati tin dam kana?',
            hindiMeaning: 'टमाटर कितने का है?',
            points: 12,
            feedbackHi: 'सही अर्थ है, पर अभिवादन ("जोहार") जोड़ना अधिक शिष्ट माना जाता है।',
            nextNodeId: 'h2_good'
          },
          {
            id: 'h1_c',
            santaliDev: 'इञ दो दाक् तेतेङ एत्-आ।',
            santaliRoman: 'In do dak teteng et-a.',
            hindiMeaning: 'मुझे प्यास लगी है।',
            points: 5,
            feedbackHi: 'यह प्यास के बारे में वाक्य है, सब्ज़ी के दाम पूछने के लिए "तिन ते किलो" कहें।',
            nextNodeId: 'h2_alt'
          }
        ]
      },
      h2_good: {
        id: 'h2_good',
        npcName: 'फुलमुनी दीदी',
        npcRole: 'सब्ज़ी विक्रेता',
        npcSantaliDev: 'बिलाती दो मोणे गेल टाका किलो काना। आड़ी जोम सोंधे गेया। तिनौक् एम हातावा?',
        npcSantaliRoman: 'Bilati do mone gel taka kilo kana. Adi jom sondhe geya. Tinok em hatawa?',
        npcHindiMeaning: 'टमाटर पचास रुपये किलो है। बहुत ताज़ा और स्वादिष्ट है। आप कितना लेंगे?',
        culturalTip: 'संताली में ५० के लिए "मोणे गेल" (पाँच दहाई) या "बाड़ इसी गेल" बोला जाता है।',
        options: [
          {
            id: 'h2_a',
            santaliDev: 'आधा किलो आर मित् दो काकड़ी एम कातिञ में। दाम दो थोड़ा कोम कामे दादा/दीदी।',
            santaliRoman: 'Adha kilo ar mit do kakdi em katin me. Dam do thoda kom kame didi.',
            hindiMeaning: 'आधा किलो और एक खीरा दे दीजिए। दाम थोड़ा कम कर दीजिए दीदी।',
            points: 20,
            feedbackHi: 'बहुत बढ़िया! आपने माप और विनम्र मोलभाव दोनों सही शब्दों में किया।',
            nextNodeId: 'h3'
          },
          {
            id: 'h2_b',
            santaliDev: 'मित् किलो दोहोय मे, नोय टाका।',
            santaliRoman: 'Mit kilo dohoy me, noy taka.',
            hindiMeaning: 'एक किलो रख दीजिए, यह लीजिए पैसे।',
            points: 18,
            feedbackHi: 'सीधा और स्पष्ट संताली वाक्य!',
            nextNodeId: 'h3'
          }
        ]
      },
      h2_alt: {
        id: 'h2_alt',
        npcName: 'फुलमुनी दीदी',
        npcRole: 'सब्ज़ी विक्रेता',
        npcSantaliDev: 'ओहो, दाक् न्यू लेमे दादा, आर चलो अबोआक् ताज़ा भाजी हौं ञेल लेमे।',
        npcSantaliRoman: 'Oho, dak nyu leme dada, ar chalo aboak taza bhaji hon nyel leme.',
        npcHindiMeaning: 'ओहो, पानी पी लीजिए भैया, और ताज़ी सब्ज़ी भी देख लीजिए।',
        options: [
          {
            id: 'h2_alt_a',
            santaliDev: 'सराहाव दीदी! मित् किलो आराक् साकाम एम कातिञ में।',
            santaliRoman: 'Sarahaav didi! Mit kilo arak sakam em katin me.',
            hindiMeaning: 'धन्यवाद दीदी! एक किलो लाल साग दे दीजिए।',
            points: 18,
            feedbackHi: 'बहुत अच्छा सुधार! "सराहाव" (धन्यवाद) का सुंदर प्रयोग।',
            nextNodeId: 'h3'
          }
        ]
      },
      h3: {
        id: 'h3',
        npcName: 'फुलमुनी दीदी',
        npcRole: 'सब्ज़ी विक्रेता',
        npcSantaliDev: 'एमाद् मेयां, नोवा दो धिरौक् ते इदि में। मा एन्डे खान जोहार!',
        npcSantaliRoman: 'Emad meyan, nowa do dhirok te idi me. Ma ende khan Johar!',
        npcHindiMeaning: 'दे दिया है, इसे संभालकर ले जाइए। तो फिर जोहार!',
        options: [
          {
            id: 'h3_a',
            santaliDev: 'आड़ी सराहाव दीदी! नापाय ते ताहेन में, जोहार!',
            santaliRoman: 'Adi sarahaav didi! Napay te tahen me, Johar!',
            hindiMeaning: 'बहुत धन्यवाद दीदी! कुशल रहिए, जोहार!',
            points: 20,
            feedbackHi: 'संवाद पूर्णतः सफल! आपने संताली बाज़ार शिष्टाचार बखूबी निभाया।',
            nextNodeId: null
          }
        ]
      }
    }
  },
  {
    id: 'health_clinic',
    title: 'स्वास्थ्य केंद्र व डॉक्टर संवाद',
    subtitle: 'अस्पताल में बुखार, दर्द या दवा की मात्रा संताली में समझना',
    location: 'प्रखंड स्वास्थ्य केंद्र',
    difficulty: 'व्यावहारिक',
    startNodeId: 'm1',
    nodes: {
      m1: {
        id: 'm1',
        npcName: 'डॉ. मरांडी',
        npcRole: 'चिकित्सक',
        npcSantaliDev: 'जोहार! दुड़ुप् में। चेत् तकलीफ मेनाक् तामा? ओका रे हासो येत् मेया?',
        npcSantaliRoman: 'Johar! Dudup me. Chet taklif menak tama? Oka re haso yet meya?',
        npcHindiMeaning: 'जोहार! बैठिए। आपको क्या तकलीफ़ है? कहाँ दर्द हो रहा है?',
        culturalTip: '"हासो" का अर्थ दर्द होता है, जैसे "बोहोक् हासो" (सिर दर्द) या "लाच हासो" (पेट दर्द)।',
        options: [
          {
            id: 'm1_a',
            santaliDev: 'जोहार डॉक्टर बाबू! होला खोन बोहोक् आड़ी हासो येत्-आ आर रुआ हौं मेनाक्-आ।',
            santaliRoman: 'Johar Doctor babu! Hola khon bohok adi haso yet-a ar rua hon menak-a.',
            hindiMeaning: 'जोहार डॉक्टर साहब! कल से बहुत सिर दर्द हो रहा है और बुखार भी है।',
            points: 20,
            feedbackHi: 'सटीक! आपने समय ("होला खोन" = कल से) और लक्षण ("बोहोक् हासो", "रुआ") स्पष्ट बताए।',
            nextNodeId: 'm2'
          },
          {
            id: 'm1_b',
            santaliDev: 'लाच हासो येत्-आ डॉक्टर बाबू।',
            santaliRoman: 'Lach haso yet-a Doctor babu.',
            hindiMeaning: 'पेट में दर्द हो रहा है डॉक्टर साहब।',
            points: 16,
            feedbackHi: 'स्पष्ट और उपयोगी स्वास्थ्य वाक्य!',
            nextNodeId: 'm2'
          }
        ]
      },
      m2: {
        id: 'm2',
        npcName: 'डॉ. मरांडी',
        npcRole: 'चिकित्सक',
        npcSantaliDev: 'चिंता आलोम कोरोवा। नोवा रान दो सेताक् आर आयुप् जोम तायोम लोलो दाक् ते जोम मे।',
        npcSantaliRoman: 'Chinta alom korowa. Nowa ran do setak ar ayup jom tayom lolo dak te jom me.',
        npcHindiMeaning: 'चिंता मत कीजिए। यह दवा सुबह और शाम खाना खाने के बाद गुनगुने पानी से खाइए।',
        options: [
          {
            id: 'm2_a',
            santaliDev: 'सराहाव डॉक्टर बाबू! तिनाक् माहा तक नोवा रान दो जोम हुयुक्-आ?',
            santaliRoman: 'Sarahaav Doctor babu! Tinak maha tak nowa ran do jom huyuk-a?',
            hindiMeaning: 'धन्यवाद डॉक्टर साहब! कितने दिनों तक यह दवा खानी होगी?',
            points: 20,
            feedbackHi: 'बिल्कुल सही प्रश्न — "तिनाक् माहा" (कितने दिन) पूछना स्वास्थ्य संवाद में बहुत ज़रूरी है।',
            nextNodeId: 'm3'
          },
          {
            id: 'm2_b',
            santaliDev: 'ठीक गेया, इञ दो नोवा रान जोम आ।',
            santaliRoman: 'Thik geya, in do nowa ran jom a.',
            hindiMeaning: 'ठीक है, मैं यह दवा खाऊँगा।',
            points: 15,
            feedbackHi: 'सरल और स्पष्ट उत्तर।',
            nextNodeId: 'm3'
          }
        ]
      },
      m3: {
        id: 'm3',
        npcName: 'डॉ. मरांडी',
        npcRole: 'चिकित्सक',
        npcSantaliDev: 'मोणे माहा तक जोम मे आर आराम में। साफा दाक् न्यू मे। जोहार!',
        npcSantaliRoman: 'Mone maha tak jom me ar aram me. Safa dak nyu me. Johar!',
        npcHindiMeaning: 'पाँच दिन तक खाइए और आराम कीजिए। साफ़ पानी पीजिए। जोहार!',
        options: [
          {
            id: 'm3_a',
            santaliDev: 'आड़ी सराहाव डॉक्टर बाबू! नापाय ते जोहार!',
            santaliRoman: 'Adi sarahaav Doctor babu! Napay te Johar!',
            hindiMeaning: 'बहुत धन्यवाद डॉक्टर साहब! सादर जोहार!',
            points: 20,
            feedbackHi: 'शानदार! आपने क्लिनिक संवाद पूरी दक्षता से पूरा किया।',
            nextNodeId: null
          }
        ]
      }
    }
  },
  {
    id: 'school_class',
    title: 'विद्यालय व गुरुजी संवाद',
    subtitle: 'कक्षा में ओल चिकी व संताली अध्ययन से जुड़ा आदरपूर्ण संवाद',
    location: 'आदर्श संताली विद्यालय',
    difficulty: 'सरल',
    startNodeId: 's1',
    nodes: {
      s1: {
        id: 's1',
        npcName: 'गुरुजी सोरेन',
        npcRole: 'शिक्षक',
        npcSantaliDev: 'जोहार गिद्रा को! तेहेञ दो ओल चिकी आर संताली काथा बॉन पाड़हावा। आम पुथी एम आगु अकादा?',
        npcSantaliRoman: 'Johar gidra ko! Tehen do Ol Chiki ar Santali katha bon padhawa. Am puthi em agu akada?',
        npcHindiMeaning: 'जोहार बच्चों! आज हम ओल चिकी और संताली भाषा पढ़ेंगे। क्या तुम किताब लाए हो?',
        options: [
          {
            id: 's1_a',
            santaliDev: 'जोहार माचेत् (गुरुजी)! होय, इञ दो पुथी आर कॉपी आगु अकादा।',
            santaliRoman: 'Johar Machet! Hoy, in do puthi ar copy agu akada.',
            hindiMeaning: 'जोहार गुरुजी! हाँ, मैं किताब और कॉपी लेकर आया हूँ।',
            points: 20,
            feedbackHi: 'शाबाश! शिक्षक के लिए "माचेत्" (Machet) संताली का प्रामाणिक शब्द है।',
            nextNodeId: 's2'
          },
          {
            id: 's1_b',
            santaliDev: 'बाङ गुरुजी, तेहेञ दो ओड़ाक् रे हिरिञ काद-आ।',
            santaliRoman: 'Bang Guruji, tehen do orak re hirin kad-a.',
            hindiMeaning: 'नहीं गुरुजी, आज घर पर भूल गया।',
            points: 16,
            feedbackHi: 'विनम्र और ईमानदार उत्तर। "हिरिञ" यानी भूल जाना।',
            nextNodeId: 's2'
          }
        ]
      },
      s2: {
        id: 's2',
        npcName: 'गुरुजी सोरेन',
        npcRole: 'शिक्षक',
        npcSantaliDev: 'आड़ी नापाय! "दाक्" आर "सींग" कुरुमुटु काते ओल मे आर साड़े आञोम में।',
        npcSantaliRoman: 'Adi napay! "Dak" ar "Sing" kurumutu kate ol me ar sade anyom me.',
        npcHindiMeaning: 'बहुत सुंदर! "दाक्" (जल) और "सींग" (सूर्य/पेड़) ध्यान से लिखो और उच्चारण सुनो।',
        options: [
          {
            id: 's2_a',
            santaliDev: 'ठीक गेया माचेत्, इञ दो साफा ते ओल एत्-आ। सराहाव!',
            santaliRoman: 'Thik geya Machet, in do safa te ol et-a. Sarahaav!',
            hindiMeaning: 'ठीक है गुरुजी, मैं साफ़-साफ़ लिख रहा हूँ। धन्यवाद!',
            points: 20,
            feedbackHi: 'विद्यालय संवाद सफलतापूर्वक पूर्ण हुआ!',
            nextNodeId: null
          }
        ]
      }
    }
  },
  {
    id: 'bus_travel',
    title: 'बस व यात्रा मार्गदर्शन',
    subtitle: 'यात्रा के दौरान रास्ता, किराया और बस स्टॉप पूछने का संवाद',
    location: 'रांची-दुमका बस स्टैंड',
    difficulty: 'मध्यम',
    startNodeId: 't1',
    nodes: {
      t1: {
        id: 't1',
        npcName: 'राजू टुडू',
        npcRole: 'बस परिचालक',
        npcSantaliDev: 'देला देला, नोवा गाड़ी दो दुमका सेच् चालाक्-आ। आम दो ओका सेच् एम चालाक्-आ?',
        npcSantaliRoman: 'Dela dela, nowa gadi do Dumka sech chalak-a. Am do oka sech em chalak-a?',
        npcHindiMeaning: 'आइए आइए, यह गाड़ी दुमका की ओर जाएगी। आप किस तरफ़ जाएँगे?',
        options: [
          {
            id: 't1_a',
            santaliDev: 'जोहार दा! इञ दो जामताड़ा हाबिच् चालाक्-आ। भाड़ा तिन ताबोना?',
            santaliRoman: 'Johar da! In do Jamtara habich chalak-a. Bhada tin tabona?',
            hindiMeaning: 'जोहार भैया! मुझे जामताड़ा तक जाना है। किराया कितना है?',
            points: 20,
            feedbackHi: 'सटीक! "हाबिच्" (तक) का प्रयोग गंतव्य बताने के लिए एकदम सही है।',
            nextNodeId: 't2'
          },
          {
            id: 't1_b',
            santaliDev: 'दुमका तिन घड़ी रे सेटेर ओक्-आ?',
            santaliRoman: 'Dumka tin ghadi re seter ok-a?',
            hindiMeaning: 'दुमका कितने बजे पहुँचेगी?',
            points: 18,
            feedbackHi: 'बहुत अच्छा प्रश्न! "सेटेर" का अर्थ पहुँचना होता है।',
            nextNodeId: 't2'
          }
        ]
      },
      t2: {
        id: 't2',
        npcName: 'राजू टुडू',
        npcRole: 'बस परिचालक',
        npcSantaliDev: 'दो घंटा रे सेटेर ओक्-आ। भितरी रे दुड़ुप् में दादा।',
        npcSantaliRoman: 'Do ghanta re seter ok-a. Bhitri re dudup me dada.',
        npcHindiMeaning: 'दो घंटे में पहुँच जाएगी। अंदर बैठ जाइए भैया।',
        options: [
          {
            id: 't2_a',
            santaliDev: 'आड़ी सराहाव दादा, स्टॉप सेटेर लेन् खान बाड़ाय होचोइञ मे।',
            santaliRoman: 'Adi sarahaav dada, stop seter len khan baday hochoin me.',
            hindiMeaning: 'बहुत धन्यवाद भैया, स्टॉप आने पर बता दीजिएगा।',
            points: 20,
            feedbackHi: 'प्रामाणिक और उपयोगी यात्रा संताली संवाद!',
            nextNodeId: null
          }
        ]
      }
    }
  },
  {
    id: 'elder_johar',
    title: 'बुज़ुर्गों व अतिथि से जोहार (अतु सत्कार)',
    subtitle: 'गाँव में बुज़ुर्गों व मेहमानों (पेड़ा होड़) के पारंपरिक स्वागत का शिष्टाचार',
    location: 'अतु कुलही (संताल गाँव)',
    difficulty: 'मध्यम',
    startNodeId: 'e1',
    nodes: {
      e1: {
        id: 'e1',
        npcName: 'मांझी बाबा (बुज़ुर्ग)',
        npcRole: 'ग्राम प्रधान',
        npcSantaliDev: 'आयो हो! ओकोय पेड़ा को हेच् अकाना? देला राचा रे दुड़ुप् पे!',
        npcSantaliRoman: 'Ayo ho! Okoy peda ko hech akana? Dela racha re dudup pe!',
        npcHindiMeaning: 'अरे! कौन मेहमान आए हैं? आइए आँगन में बैठिए!',
        culturalTip: 'संताली परंपरा में अतिथि को "पेड़ा होड़" कहते हैं और लोटे में पानी देकर पैर धुलाने/सत्कार करने की प्रथा है।',
        options: [
          {
            id: 'e1_a',
            santaliDev: 'डोबोक जोहार बाबा! आलोम नापाय गे मेनाक् मेया? गोता ओड़ाक् रे जोहार!',
            santaliRoman: 'Dobok Johar baba! Alom napay ge menak meya? Gota orak re Johar!',
            hindiMeaning: 'सादर झुककर प्रणाम (डोबोक जोहार) बाबा! आप सब कुशल तो हैं? पूरे घर को जोहार!',
            points: 20,
            feedbackHi: 'उत्कृष्ट संस्कार! बुज़ुर्गों से "डोबोक जोहार" और पूरे परिवार का हाल पूछना संताली संस्कृति का हृदय है।',
            nextNodeId: 'e2'
          },
          {
            id: 'e1_b',
            santaliDev: 'जोहार बाबा, इञ दो दुमका खोन हेच् अकाना।',
            santaliRoman: 'Johar baba, in do Dumka khon hech akana.',
            hindiMeaning: 'जोहार बाबा, मैं दुमका से आया हूँ।',
            points: 16,
            feedbackHi: 'सही परिचय, साथ में "डोबोक जोहार" कहने से और आदर झलकता है।',
            nextNodeId: 'e2'
          }
        ]
      },
      e2: {
        id: 'e2',
        npcName: 'मांझी बाबा (बुज़ुर्ग)',
        npcRole: 'ग्राम प्रधान',
        npcSantaliDev: 'आड़ी नापाय बाबू! जोतो को नापाय गे मेनाक् कोआ। दाक् न्यू लेमे आर जिराउ में।',
        npcSantaliRoman: 'Adi napay babu! Joto ko napay ge menak koa. Dak nyu leme ar jirau me.',
        npcHindiMeaning: 'बहुत बढ़िया बेटा! सब कुशल से हैं। पानी पी लीजिए और विश्राम कीजिए।',
        options: [
          {
            id: 'e2_a',
            santaliDev: 'जोहार बाबा, आम आशिर्वाद ताहेन मा!',
            santaliRoman: 'Johar baba, am ashirwad tahen ma!',
            hindiMeaning: 'जोहार बाबा, आपका आशीर्वाद बना रहे!',
            points: 20,
            feedbackHi: 'हृदयस्पर्शी और पूर्ण संताली अतिथि शिष्टाचार!',
            nextNodeId: null
          }
        ]
      }
    }
  }
];

interface HistoryItem {
  sender: 'npc' | 'user';
  speakerName: string;
  santaliDev: string;
  santaliRoman: string;
  hindiMeaning: string;
  feedback?: string;
}

export const SantaliRoleplaySimulator: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(ROLEPLAY_SCENARIOS[0].id);
  const scenario = ROLEPLAY_SCENARIOS.find((s) => s.id === selectedId) || ROLEPLAY_SCENARIOS[0];

  const [currentNodeId, setCurrentNodeId] = useState<string | null>(scenario.startNodeId);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [showHindi, setShowHindi] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const startScenario = (sc: RoleplayScenario) => {
    stopSpeaking();
    const first = sc.nodes[sc.startNodeId];
    setCurrentNodeId(sc.startNodeId);
    setScore(0);
    setMaxScore(0);
    setHistory([
      {
        sender: 'npc',
        speakerName: `${first.npcName} (${first.npcRole})`,
        santaliDev: first.npcSantaliDev,
        santaliRoman: first.npcSantaliRoman,
        hindiMeaning: first.npcHindiMeaning
      }
    ]);
    if (autoSpeak) {
      speakWithFemaleVoice(first.npcSantaliDev, { autoDetectLanguage: true });
    }
  };

  useEffect(() => {
    startScenario(scenario);
    return () => stopSpeaking();
  }, [selectedId]);

  const currentNode = currentNodeId ? scenario.nodes[currentNodeId] : null;

  const handleChooseOption = (opt: RoleplayOption) => {
    const newEntries: HistoryItem[] = [
      {
        sender: 'user',
        speakerName: 'आप (Learner)',
        santaliDev: opt.santaliDev,
        santaliRoman: opt.santaliRoman,
        hindiMeaning: opt.hindiMeaning,
        feedback: opt.feedbackHi
      }
    ];

    setScore((prev) => prev + opt.points);
    setMaxScore((prev) => prev + 20);

    if (opt.nextNodeId && scenario.nodes[opt.nextNodeId]) {
      const nextNode = scenario.nodes[opt.nextNodeId];
      newEntries.push({
        sender: 'npc',
        speakerName: `${nextNode.npcName} (${nextNode.npcRole})`,
        santaliDev: nextNode.npcSantaliDev,
        santaliRoman: nextNode.npcSantaliRoman,
        hindiMeaning: nextNode.npcHindiMeaning
      });
      setCurrentNodeId(opt.nextNodeId);
      if (autoSpeak) {
        speakWithFemaleVoice(nextNode.npcSantaliDev, { autoDetectLanguage: true });
      }
    } else {
      setCurrentNodeId(null);
      if (autoSpeak) {
        speakWithFemaleVoice(opt.santaliDev, { autoDetectLanguage: true });
      }
    }

    setHistory((prev) => [...prev, ...newEntries]);
  };

  const accuracyPct = maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 100;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-amber-800">
            संवादात्मक अभ्यास · 5 वास्तविक परिस्थितियाँ
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            इंटरैक्टिव संताली संवाद सिमुलेटर (Live Role-Play)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            हाट, अस्पताल, विद्यालय, यात्रा और बुज़ुर्गों के सामने सही संताली जवाब चुनें, ऑडियो सुनें और शिष्टाचार स्कोर पाएं।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowHindi((p) => !p)}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            {showHindi ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showHindi ? 'हिन्दी अनुवाद छुपाएं' : 'हिन्दी अनुवाद दिखाएं'}</span>
          </button>
          <button
            onClick={() => setAutoSpeak((p) => !p)}
            className={`px-3.5 py-2 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              autoSpeak
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>ऑटो-वॉइस: {autoSpeak ? 'चालू' : 'बंद'}</span>
          </button>
          <button
            onClick={() => startScenario(scenario)}
            className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>पुनः शुरू करें</span>
          </button>
        </div>
      </div>

      {/* Two-zone layout: Left Scenario selector + Right Conversation Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">
              परिस्थिति चुनें (Scenarios)
            </h2>
            <div className="space-y-2">
              {ROLEPLAY_SCENARIOS.map((sc) => {
                const active = sc.id === selectedId;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedId(sc.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer ${
                      active
                        ? 'bg-amber-50 border-amber-400 text-slate-900'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900">{sc.title}</p>
                    <p className="text-[11px] text-slate-600 mt-1">{sc.subtitle}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                      <span>{sc.location}</span>
                      <span aria-hidden="true">·</span>
                      <span>स्तर: {sc.difficulty}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">संवाद दक्षता स्कोर</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {score} / {maxScore || 20} ({accuracyPct}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-200"
                style={{ width: `${accuracyPct}%` }}
              />
            </div>
            {currentNode?.culturalTip && (
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-amber-800 block mb-0.5">सांस्कृतिक सूत्र:</span>
                {currentNode.culturalTip}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-5">
          {/* Conversation Log */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-700" />
                <h2 className="text-sm font-bold text-slate-900">{scenario.title}</h2>
              </div>
              <span className="text-xs text-slate-500">{scenario.location}</span>
            </div>

            <div className="space-y-3">
              {history.map((item, idx) => {
                const isUser = item.sender === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[82%] rounded-2xl p-4 border ${
                        isUser
                          ? 'bg-sky-50 border-sky-200 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1.5">
                        <span className="text-[11px] font-bold text-slate-600">{item.speakerName}</span>
                        <button
                          onClick={() => speakWithFemaleVoice(item.santaliDev, { autoDetectLanguage: true })}
                          className="text-xs text-amber-800 hover:text-amber-950 font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>सुनें</span>
                        </button>
                      </div>
                      <p className="text-base font-bold text-slate-900 leading-snug">{item.santaliDev}</p>
                      <p className="text-sm font-semibold text-amber-800 mt-1">
                        {toOlChikiAuto(item.santaliDev)}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">{item.santaliRoman}</p>
                      {showHindi && (
                        <p className="text-xs text-slate-700 mt-2 pt-2 border-t border-slate-200/70">
                          {item.hindiMeaning}
                        </p>
                      )}
                      {item.feedback && (
                        <div className="mt-2 pt-2 border-t border-sky-200/70 text-[11px] font-medium text-emerald-800 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item.feedback}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Choice Deck or Completion Card */}
          <div className="pt-4 border-t border-slate-200">
            {currentNode ? (
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-sky-600" />
                  <span>अपना अगला संताली उत्तर चुनें:</span>
                </p>
                <div className="space-y-2">
                  {currentNode.options.map((opt) => (
                    <div
                      key={opt.id}
                      className="rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 p-3.5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900">{opt.santaliDev}</p>
                        <p className="text-xs text-amber-800 font-medium">{toOlChikiAuto(opt.santaliDev)}</p>
                        <p className="text-xs text-slate-500">
                          {opt.santaliRoman}
                          {showHindi ? ` · ${opt.hindiMeaning}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => speakWithFemaleVoice(opt.santaliDev, { autoDetectLanguage: true })}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                          title="पहले उच्चारण सुनें"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleChooseOption(opt)}
                          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                        >
                          <span>यह बोलें</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <Award className="w-5 h-5 text-emerald-700" />
                    <span>संवाद सफलतापूर्वक पूर्ण हुआ!</span>
                  </div>
                  <p className="text-xs text-emerald-800 tabular-nums">
                    अंतिम स्कोर: {score} / {maxScore} ({accuracyPct}%) · आपने इस परिस्थिति का व्यावहारिक अभ्यास पूरा किया।
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startScenario(scenario)}
                    className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>फिर अभ्यास करें</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
