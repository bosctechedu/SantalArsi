import { QuizItem, SantaliWord, SiteHeroConfig } from '../types';

export const DEFAULT_HERO_CONFIG: SiteHeroConfig = {
  welcomeTitle: 'जोहार! Hor Katha Suite में आपका स्वागत है',
  subTitle: 'संताली देवनागरी भाषा व संस्कृति मंच · BOSC Tech & Edu',
  motto: 'टाइप करें · सीखें · सुरक्षित करें · प्रचारित करें',
  quoteEnglish: 'Our Language, Our Identity, Our Pride',
  quoteSantali: 'आबो रोड़, आबो उपरुम, आबो गोरोब (Abo Ror, Abo Uprum, Abo Gorob)',
  notice: 'संताली देवनागरी डिजिटलीकरण मंच। 100% निःशुल्क और खुला सामुदायिक मंच।'
};

export const SANTALI_DEV_CHARS: any[] = [
  // Swar (Vowels)
  { char: 'अ', name: 'अ (Short a)', roman: 'a', sound: '/ə/', category: 'vowel', exampleWord: 'अतु', exampleWordRoman: 'Atu', exampleMeaning: 'गाँव (Village)' },
  { char: 'आ', name: 'आ (Long aa)', roman: 'aa', sound: '/ɑː/', category: 'vowel', exampleWord: 'आयो', exampleWordRoman: 'Ayo', exampleMeaning: 'माँ / माता (Mother)' },
  { char: 'इ', name: 'इ (Short i)', roman: 'i', sound: '/i/', category: 'vowel', exampleWord: 'इंज', exampleWordRoman: 'Iny', exampleMeaning: 'मैं (I / Myself)' },
  { char: 'ई', name: 'ई (Long ee)', roman: 'ee', sound: '/iː/', category: 'vowel', exampleWord: 'ईर', exampleWordRoman: 'Ir', exampleMeaning: 'फसल काटना (Harvest)' },
  { char: 'उ', name: 'उ (Short u)', roman: 'u', sound: '/u/', category: 'vowel', exampleWord: 'उप', exampleWordRoman: 'Up', exampleMeaning: 'केश / बाल (Hair)' },
  { char: 'ऊ', name: 'ऊ (Long oo)', roman: 'oo', sound: '/uː/', category: 'vowel', exampleWord: 'ऊत\'', exampleWordRoman: 'Ut’', exampleMeaning: 'निगलना / मशरूम (Swallow/Mushroom)' },
  { char: 'ए', name: 'ए (Vowel e)', roman: 'e', sound: '/e/', category: 'vowel', exampleWord: 'एनेच\'', exampleWordRoman: 'Enej’', exampleMeaning: 'नृत्य / खेल (Dance/Play)' },
  { char: 'ऐ', name: 'ऐ (Vowel ai)', roman: 'ai', sound: '/æ/', category: 'vowel', exampleWord: 'ऐरा', exampleWordRoman: 'Era', exampleMeaning: 'नारी / देवी (Woman/Goddess)' },
  { char: 'ओ', name: 'ओ (Vowel o)', roman: 'o', sound: '/o/', category: 'vowel', exampleWord: 'ओड़ाक', exampleWordRoman: 'Orak’', exampleMeaning: 'घर / भवन (House/Home)' },
  { char: 'औ', name: 'औ (Vowel au)', roman: 'au', sound: '/ɔː/', category: 'vowel', exampleWord: 'औत', exampleWordRoman: 'Ot', exampleMeaning: 'धरती / भूमि (Earth)' },

  // Vyanjan (Consonants)
  { char: 'क', name: 'क (Ka)', roman: 'k', sound: '/k/', category: 'consonant', exampleWord: 'कुल', exampleWordRoman: 'Kul', exampleMeaning: 'बाघ / शेर (Tiger)' },
  { char: 'ख', name: 'ख (Kha)', roman: 'kh', sound: '/kʰ/', category: 'consonant', exampleWord: 'खोबोर', exampleWordRoman: 'Khobor', exampleMeaning: 'समाचार (News)' },
  { char: 'ग', name: 'ग (Ga)', roman: 'g', sound: '/ɡ/', category: 'consonant', exampleWord: 'गाते', exampleWordRoman: 'Gate', exampleMeaning: 'सखा / मित्र (Friend)' },
  { char: 'घ', name: 'घ (Gha)', roman: 'gh', sound: '/ɡʱ/', category: 'consonant', exampleWord: 'घांस', exampleWordRoman: 'Ghas', exampleMeaning: 'घास / तृण (Grass)' },
  { char: 'ङ', name: 'ङ (Nga)', roman: 'ng', sound: '/ŋ/', category: 'consonant', exampleWord: 'आंग', exampleWordRoman: 'Ang', exampleMeaning: 'प्रभात / भोर (Dawn)' },
  { char: 'च', name: 'च (Cha)', roman: 'c / ch', sound: '/tʃ/', category: 'consonant', exampleWord: 'चांदो', exampleWordRoman: 'Chando', exampleMeaning: 'चंद्रमा / सूर्य (Moon/Sun)' },
  { char: 'छ', name: 'छ (Chha)', roman: 'chh', sound: '/tʃʰ/', category: 'consonant', exampleWord: 'छाता', exampleWordRoman: 'Chhata', exampleMeaning: 'छाता (Umbrella)' },
  { char: 'ज', name: 'ज (Ja)', roman: 'j', sound: '/dʒ/', category: 'consonant', exampleWord: 'जोहार', exampleWordRoman: 'Johar', exampleMeaning: 'नमस्कार / प्रणाम (Salute)' },
  { char: 'झ', name: 'झ (Jha)', roman: 'jh', sound: '/dʒʱ/', category: 'consonant', exampleWord: 'झारना', exampleWordRoman: 'Jharna', exampleMeaning: 'झरना (Stream)' },
  { char: 'ञ', name: 'ञ (Nya)', roman: 'ny', sound: '/ɲ/', category: 'consonant', exampleWord: 'ञेल', exampleWordRoman: 'Nyel', exampleMeaning: 'देखना (To see)' },
  { char: 'ट', name: 'ट (Tta)', roman: 'tt', sound: '/ʈ/', category: 'consonant', exampleWord: 'टामाक', exampleWordRoman: 'Tamak', exampleMeaning: 'नगाड़ा (Kettledrum)' },
  { char: 'ठ', name: 'ठ (Ttha)', roman: 'tth', sound: '/ʈʰ/', category: 'consonant', exampleWord: 'ठाकुर', exampleWordRoman: 'Thakur', exampleMeaning: 'सृष्टिकर्ता (Lord/Creator)' },
  { char: 'ड', name: 'ड (Dda)', roman: 'dd', sound: '/ɖ/', category: 'consonant', exampleWord: 'डाका', exampleWordRoman: 'Daka', exampleMeaning: 'भात / भोजन (Boiled Rice)' },
  { char: 'ढ', name: 'ढ (Ddha)', roman: 'ddh', sound: '/ɖʱ/', category: 'consonant', exampleWord: 'ढोल', exampleWordRoman: 'Dhol', exampleMeaning: 'ढोल वाद्य (Drum)' },
  { char: 'त', name: 'त (Ta)', roman: 't', sound: '/t/', category: 'consonant', exampleWord: 'तुमदाग', exampleWordRoman: 'Tumdak’', exampleMeaning: 'मांदर (Sacred Drum)' },
  { char: 'थ', name: 'थ (Tha)', roman: 'th', sound: '/tʰ/', category: 'consonant', exampleWord: 'थान', exampleWordRoman: 'Than', exampleMeaning: 'पवित्र स्थल (Sacred Grove)' },
  { char: 'द', name: 'द (Da)', roman: 'd', sound: '/d/', category: 'consonant', exampleWord: 'दाक', exampleWordRoman: 'Dak’', exampleMeaning: 'जल / पानी (Water/Rain)' },
  { char: 'ध', name: 'ध (Dha)', roman: 'dh', sound: '/dʱ/', category: 'consonant', exampleWord: 'धरती', exampleWordRoman: 'Dharti', exampleMeaning: 'पृथ्वी (Mother Earth)' },
  { char: 'न', name: 'न (Na)', roman: 'n', sound: '/n/', category: 'consonant', exampleWord: 'नायके', exampleWordRoman: 'Naike', exampleMeaning: 'गांव का पुजारी (Priest)' },
  { char: 'प', name: 'प (Pa)', roman: 'p', sound: '/p/', category: 'consonant', exampleWord: 'पारिस', exampleWordRoman: 'Paris', exampleMeaning: 'गोत्र / कुल (Totem Clan)' },
  { char: 'फ', name: 'फ (Pha)', roman: 'ph', sound: '/pʰ/', category: 'consonant', exampleWord: 'फुरग़ल', exampleWordRoman: 'Phurgal', exampleMeaning: 'स्वाधीनता / मुक्ति (Freedom)' },
  { char: 'ब', name: 'ब (Ba)', roman: 'b', sound: '/b/', category: 'consonant', exampleWord: 'बाबा', exampleWordRoman: 'Baba', exampleMeaning: 'पिताजी (Father)' },
  { char: 'भ', name: 'भ (Bha)', roman: 'bh', sound: '/bʱ/', category: 'consonant', exampleWord: 'भारत', exampleWordRoman: 'Bharat', exampleMeaning: 'हमारा देश (India)' },
  { char: 'म', name: 'म (Ma)', roman: 'm', sound: '/m/', category: 'consonant', exampleWord: 'मरांग बुरु', exampleWordRoman: 'Marang Buru', exampleMeaning: 'सर्वोच्च आराध्य देव (Supreme Deity)' },
  { char: 'य', name: 'य (Ya)', roman: 'y', sound: '/j/', category: 'consonant', exampleWord: 'युम', exampleWordRoman: 'Yum', exampleMeaning: 'पथ / रास्ता (Path)' },
  { char: 'र', name: 'र (Ra)', roman: 'r', sound: '/r/', category: 'consonant', exampleWord: 'रस्का', exampleWordRoman: 'Raska', exampleMeaning: 'आनंद / उल्लास (Joy/Festivity)' },
  { char: 'ल', name: 'ल (La)', roman: 'l', sound: '/l/', category: 'consonant', exampleWord: 'लहलहा', exampleWordRoman: 'Lahalaha', exampleMeaning: 'हरा-भरा (Lush green)' },
  { char: 'व', name: 'व (Wa/Va)', roman: 'w / v', sound: '/w/', category: 'consonant', exampleWord: 'वोंगा', exampleWordRoman: 'Bonga / Vonga', exampleMeaning: 'दैवीय शक्ति (Spirit/Deity)' },
  { char: 'स', name: 'स (Sa)', roman: 's', sound: '/s/', category: 'consonant', exampleWord: 'सोहराय', exampleWordRoman: 'Sohrai', exampleMeaning: 'महापर्व (Grand Harvest Festival)' },
  { char: 'ह', name: 'ह (Ha)', roman: 'h', sound: '/h/', category: 'consonant', exampleWord: 'होड़', exampleWordRoman: 'Hor', exampleMeaning: 'संताली मानव (Human / Santal)' },
  { char: 'ड़', name: 'ड़ (Rha)', roman: 'rh', sound: '/ɽ/', category: 'consonant', exampleWord: 'हुड़ु', exampleWordRoman: 'Huru', exampleMeaning: 'धान (Paddy Grain)' }
];

export const SANTALI_DICTIONARY: SantaliWord[] = [
  // 1. RELATIONS ( / नाते-रिश्ते)
  {
    id: 'rel_1',
    wordRoman: 'Aba / Baba',
    wordDevanagari: 'आपा / बाबा',
    phonetic: '/ɑːbɑː/',
    partOfSpeech: 'Noun (Kinship)',
    meaningHindi: 'पिताजी, पिता, जनक',
    meaningEnglish: 'Father, Dad (respected male parent)',
    exampleSantali: 'Inren baba do adi dularia hor.',
    exampleEnglish: 'My father is a very loving person.',
    exampleHindi: 'मेरे पिताजी बहुत स्नेहशील इंसान हैं।',
    category: 'relation'
  },
  {
    id: 'rel_2',
    wordRoman: 'Ayo / Enga',
    wordDevanagari: 'आयो / एंगा',
    phonetic: '/ɑːjɒ/',
    partOfSpeech: 'Noun (Kinship)',
    meaningHindi: 'माताजी, माँ, जननी',
    meaningEnglish: 'Mother, Mom (maternal parent)',
    exampleSantali: 'Ayo do orak re daka isin kanaye.',
    exampleEnglish: 'Mother is cooking rice in the house.',
    exampleHindi: 'माँ घर में खाना बना रही हैं।',
    category: 'relation'
  },
  {
    id: 'rel_3',
    wordRoman: 'Dada',
    wordDevanagari: 'दादा',
    phonetic: '/dɑːdɑː/',
    partOfSpeech: 'Noun (Kinship)',
    meaningHindi: 'बड़ा भाई, अग्रज',
    meaningEnglish: 'Elder Brother',
    exampleSantali: 'Dada do ranchi re ol-parhao kanai.',
    exampleEnglish: 'Elder brother is studying in Ranchi.',
    exampleHindi: 'बड़े भैया राँची में पढ़ाई कर रहे हैं।',
    category: 'relation'
  },
  {
    id: 'rel_4',
    wordRoman: 'Dai',
    wordDevanagari: 'दई',
    phonetic: '/dɑːiː/',
    partOfSpeech: 'Noun (Kinship)',
    meaningHindi: 'बड़ी बहन, दीदी',
    meaningEnglish: 'Elder Sister',
    exampleSantali: 'Dai do baha porob re enej enej kanai.',
    exampleEnglish: 'Elder sister is dancing in the Baha festival.',
    exampleHindi: 'बड़ी दीदी बाहा पर्व में नाच रही हैं।',
    category: 'relation'
  },
  {
    id: 'rel_5',
    wordRoman: 'Boko Kora',
    wordDevanagari: 'बोको कोड़ा',
    phonetic: '/bɒkɒ kɒɽɑː/',
    partOfSpeech: 'Noun (Kinship)',
    meaningHindi: 'छोटा भाई, अनुज',
    meaningEnglish: 'Younger Brother',
    exampleSantali: 'Inren boko kora do guti eneja.',
    exampleEnglish: 'My younger brother plays marbles.',
    exampleHindi: 'मेरा छोटा भाई कंचे खेलता है।',
    category: 'relation'
  },
  {
    id: 'rel_6',
    wordRoman: 'Marangba',
    wordDevanagari: 'मरांगबा',
    phonetic: '/mɑːrɑːŋbɑː/',
    partOfSpeech: 'Noun (Kinship)',
    meaningHindi: 'ताऊ, बड़े पिताजी (पिता के बड़े भाई)',
    meaningEnglish: 'Elder Uncle (father\'s elder brother)',
    exampleSantali: 'Marangba do marang dare latare durup kanai.',
    exampleEnglish: 'Elder uncle is sitting under the big tree.',
    exampleHindi: 'बड़े पिताजी बड़े पेड़ के नीचे बैठे हैं।',
    category: 'relation'
  },
  {
    id: 'rel_7',
    wordRoman: 'Hatom',
    wordDevanagari: 'हातोम',
    phonetic: '/hɑːtɒm/',
    partOfSpeech: 'Noun (Kinship)',
    meaningHindi: 'बुआ, फूफी (पिता की बहन)',
    meaningEnglish: 'Paternal Aunt (father\'s sister)',
    exampleSantali: 'Hatom do disom khon hijuk kanae.',
    exampleEnglish: 'Aunt is coming from the native village.',
    exampleHindi: 'बुआ गाँव से आ रही हैं।',
    category: 'relation'
  },
  {
    id: 'rel_8',
    wordRoman: 'Goya / Gate',
    wordDevanagari: 'गोया / गाते',
    phonetic: '/ɡɒjɑː/',
    partOfSpeech: 'Noun',
    meaningHindi: 'मित्र, सखा, साथी, दोस्त',
    meaningEnglish: 'Friend, Companion, Pal',
    exampleSantali: 'Am do inren adi juri gate.',
    exampleEnglish: 'You are my closest dear friend.',
    exampleHindi: 'तुम मेरे बहुत पक्के दोस्त हो।',
    category: 'relation'
  },
  {
    id: 'rel_9',
    wordRoman: 'Pera',
    wordDevanagari: 'पेड़ा',
    phonetic: '/peɪɽɑː/',
    partOfSpeech: 'Noun',
    meaningHindi: 'अतिथि, मेहमान, रिश्तेदार',
    meaningEnglish: 'Guest, Relative, Kinsman',
    exampleSantali: 'Orak te pera ko hej akana.',
    exampleEnglish: 'Guests and relatives have arrived at our home.',
    exampleHindi: 'घर पर मेहमान व रिश्तेदार आए हैं।',
    category: 'relation'
  },

  // 2. FRUITS ( / फल)
  {
    id: 'frt_1',
    wordRoman: 'Ul',
    wordDevanagari: 'उल',
    phonetic: '/uːl/',
    partOfSpeech: 'Noun (Fruit)',
    meaningHindi: 'आम (फलों का राजा)',
    meaningEnglish: 'Mango (sweet tropical fruit)',
    exampleSantali: 'Ul jo do adi hetem gea.',
    exampleEnglish: 'Mango fruit is remarkably sweet.',
    exampleHindi: 'आम का फल बहुत मीठा होता है।',
    category: 'fruit'
  },
  {
    id: 'frt_2',
    wordRoman: 'Kanthar',
    wordDevanagari: 'कांथाड़',
    phonetic: '/kɑːnthɑːɽ/',
    partOfSpeech: 'Noun (Fruit)',
    meaningHindi: 'कटहल',
    meaningEnglish: 'Jackfruit',
    exampleSantali: 'Kanthar utu do adi sibila.',
    exampleEnglish: 'Jackfruit curry tastes delicious.',
    exampleHindi: 'कटहल की सब्जी बहुत स्वादिष्ट होती है।',
    category: 'fruit'
  },
  {
    id: 'frt_3',
    wordRoman: 'Matkom jo',
    wordDevanagari: 'मातकोम जो',
    phonetic: '/mɑːtkɒm dʒɒ/',
    partOfSpeech: 'Noun (Fruit)',
    meaningHindi: 'महुआ का फल, कोचड़ा',
    meaningEnglish: 'Mahua fruit / seed berry',
    exampleSantali: 'Matkom jo re sunum oloka.',
    exampleEnglish: 'Oil is extracted from Mahua fruit seeds.',
    exampleHindi: 'महुआ के फल (कोचड़ा) से तेल निकलता है।',
    category: 'fruit'
  },
  {
    id: 'frt_4',
    wordRoman: 'Tarop',
    wordDevanagari: 'तारोप',
    phonetic: '/tɑːrɒp/',
    partOfSpeech: 'Noun (Fruit)',
    meaningHindi: 'चिरौंजी फल, पियाल',
    meaningEnglish: 'Buchanania lanzan fruit (Chironji)',
    exampleSantali: 'Bir re tarop bili jom kana ko.',
    exampleEnglish: 'People gather and eat ripe Chironji in forest.',
    exampleHindi: 'जंगल में लोग पकी हुई चिरौंजी खाते हैं।',
    category: 'fruit'
  },
  {
    id: 'frt_5',
    wordRoman: 'Jojo',
    wordDevanagari: 'जोजो',
    phonetic: '/dʒɒdʒɒ/',
    partOfSpeech: 'Noun (Fruit)',
    meaningHindi: 'इमली',
    meaningEnglish: 'Tamarind',
    exampleSantali: 'Jojo do jojo ge soa.',
    exampleEnglish: 'Tamarind tastes tangily sour.',
    exampleHindi: 'इमली खट्टी होती है।',
    category: 'fruit'
  },
  {
    id: 'frt_6',
    wordRoman: 'Bel',
    wordDevanagari: 'बेल',
    phonetic: '/beɪl/',
    partOfSpeech: 'Noun (Fruit)',
    meaningHindi: 'बेल फल, श्रीफल',
    meaningEnglish: 'Wood Apple / Bael fruit',
    exampleSantali: 'Bel sarbat do hotom riar dohoia.',
    exampleEnglish: 'Bael drink keeps the body cool in summer.',
    exampleHindi: 'बेल का शरबत शरीर को ठंडा रखता है।',
    category: 'fruit'
  },
  {
    id: 'frt_7',
    wordRoman: 'Kud',
    wordDevanagari: 'कुद',
    phonetic: '/kuːd/',
    partOfSpeech: 'Noun (Fruit)',
    meaningHindi: 'जामुन',
    meaningEnglish: 'Blackberry, Jamun fruit',
    exampleSantali: 'Kud bili do hende rong gea.',
    exampleEnglish: 'Ripe Jamun berries are deep purple-black.',
    exampleHindi: 'पका जामुन काले रंग का होता है।',
    category: 'fruit'
  },
  {
    id: 'frt_8',
    wordRoman: 'Kend',
    wordDevanagari: 'केंद',
    phonetic: '/keɪnd/',
    partOfSpeech: 'Noun (Fruit)',
    meaningHindi: 'केंदू फल, तेंदू',
    meaningEnglish: 'Ebony fruit, Tendu berry',
    exampleSantali: 'Kend jo do bir hor ko dular-a.',
    exampleEnglish: 'Forest dwellers adore the sweet Kendu fruit.',
    exampleHindi: 'वनवासी तेंदू फल को बड़े चाव से खाते हैं।',
    category: 'fruit'
  },

  // 3. ANIMALS & BIRDS (-   / पशु-पक्षी)
  {
    id: 'anm_1',
    wordRoman: 'Kul',
    wordDevanagari: 'कुल',
    phonetic: '/kuːl/',
    partOfSpeech: 'Noun (Fauna)',
    meaningHindi: 'बाघ, वनराज',
    meaningEnglish: 'Tiger (forest apex predator)',
    exampleSantali: 'Bir re kul do marang saopab.',
    exampleEnglish: 'The tiger reigns magnificent in the jungle.',
    exampleHindi: 'जंगल में बाघ का बड़ा रसूख होता है।',
    category: 'animal'
  },
  {
    id: 'anm_2',
    wordRoman: 'Hati',
    wordDevanagari: 'हाती',
    phonetic: '/hɑːtiː/',
    partOfSpeech: 'Noun (Fauna)',
    meaningHindi: 'हाथी, गजराज',
    meaningEnglish: 'Elephant',
    exampleSantali: 'Hati dal do bir parom calak kanae.',
    exampleEnglish: 'A herd of elephants is passing through the woods.',
    exampleHindi: 'हाथियों का झुंड जंगल पार कर रहा है।',
    category: 'animal'
  },
  {
    id: 'anm_3',
    wordRoman: 'Sadom',
    wordDevanagari: 'सादोम',
    phonetic: '/sɑːdɒm/',
    partOfSpeech: 'Noun (Fauna)',
    meaningHindi: 'घोड़ा, अश्व',
    meaningEnglish: 'Horse',
    exampleSantali: 'Sadom do calte nir darea.',
    exampleEnglish: 'A horse gallops swiftly across plains.',
    exampleHindi: 'घोड़ा तेजी से दौड़ सकता है।',
    category: 'animal'
  },
  {
    id: 'anm_4',
    wordRoman: 'Sim',
    wordDevanagari: 'सीम',
    phonetic: '/siːm/',
    partOfSpeech: 'Noun (Avian)',
    meaningHindi: 'मुर्गा, मुर्गी, कुक्कुट',
    meaningEnglish: 'Fowl, Rooster, Chicken',
    exampleSantali: 'Sandi sim do setah re raga.',
    exampleEnglish: 'The rooster crows early at dawn.',
    exampleHindi: 'मुर्गा सुबह बांग देता है।',
    category: 'animal'
  },
  {
    id: 'anm_5',
    wordRoman: 'Potam',
    wordDevanagari: 'पोताम',
    phonetic: '/pɒtɑːm/',
    partOfSpeech: 'Noun (Avian)',
    meaningHindi: 'कबूतर, पंडुक पक्षी',
    meaningEnglish: 'Dove, Pigeon',
    exampleSantali: 'Potam chenre do dare re tuka menaga.',
    exampleEnglish: 'The dove has a nest in the tree.',
    exampleHindi: 'कबूतर का घोंसला पेड़ पर है।',
    category: 'animal'
  },
  {
    id: 'anm_6',
    wordRoman: 'Miru',
    wordDevanagari: 'मीरु',
    phonetic: '/miːruː/',
    partOfSpeech: 'Noun (Avian)',
    meaningHindi: 'तोता, शुक',
    meaningEnglish: 'Parrot',
    exampleSantali: 'Miru chenre do ror e sena.',
    exampleEnglish: 'The parrot learns to imitate speech.',
    exampleHindi: 'तोता बोलना सीखता है।',
    category: 'animal'
  },

  // 4. FOOD & GRAINS (-   / खान-पान व अनाज)
  {
    id: 'food_1',
    wordRoman: 'Daka',
    wordDevanagari: 'दाका',
    phonetic: '/dɑːkɑː/',
    partOfSpeech: 'Noun (Food)',
    meaningHindi: 'भात, पकाया हुआ चावल, भोजन',
    meaningEnglish: 'Cooked rice, Staple meal',
    exampleSantali: 'Daka jom me, rengej kana.',
    exampleEnglish: 'Eat rice, you must be hungry.',
    exampleHindi: 'भात खा लो, भूख लगी होगी।',
    category: 'food'
  },
  {
    id: 'food_2',
    wordRoman: 'Utu',
    wordDevanagari: 'उतु',
    phonetic: '/uːtuː/',
    partOfSpeech: 'Noun (Food)',
    meaningHindi: 'सब्जी, तरकारी, सालन',
    meaningEnglish: 'Cooked vegetable curry',
    exampleSantali: 'Ara utu do adi pushtikor.',
    exampleEnglish: 'Leafy green vegetable curry is very nutritious.',
    exampleHindi: 'साग की सब्जी बहुत पौष्टिक होती है।',
    category: 'food'
  },
  {
    id: 'food_3',
    wordRoman: 'Chaole',
    wordDevanagari: 'चावले',
    phonetic: '/tʃɑːwleɪ/',
    partOfSpeech: 'Noun (Grain)',
    meaningHindi: 'चावल (कच्चा)',
    meaningEnglish: 'Uncooked rice grain',
    exampleSantali: 'Chaole khon daka hoeoa.',
    exampleEnglish: 'Rice grains are cooked into meals.',
    exampleHindi: 'चावल से भात पकता है।',
    category: 'food'
  },
  {
    id: 'food_4',
    wordRoman: 'Kode',
    wordDevanagari: 'कोडे',
    phonetic: '/kɒdeɪ/',
    partOfSpeech: 'Noun (Grain)',
    meaningHindi: 'मड़ुआ, रागी (पारंपरिक मोटा अनाज)',
    meaningEnglish: 'Finger millet / Ragi (nutritious tribal grain)',
    exampleSantali: 'Kode daka jom le khan shukti hoeoa.',
    exampleEnglish: 'Eating Ragi millet bestows endurance.',
    exampleHindi: 'मड़ुआ खाने से ताकत मिलती है।',
    category: 'food'
  },
  {
    id: 'food_5',
    wordRoman: 'Pitha',
    wordDevanagari: 'पीठा',
    phonetic: '/piːthɑː/',
    partOfSpeech: 'Noun (Food)',
    meaningHindi: 'पीठा, संताली पारंपरिक पकवान / रोटी',
    meaningEnglish: 'Pitha (traditional steamed or baked rice cake)',
    exampleSantali: 'Sohrai porob re pitha isina ko.',
    exampleEnglish: 'Pitha cakes are prepared during Sohrai festival.',
    exampleHindi: 'सोहराय पर्व में पीठा बनाया जाता है।',
    category: 'food'
  },
  {
    id: 'food_6',
    wordRoman: 'Toa',
    wordDevanagari: 'तोवा',
    phonetic: '/tɒwɑː/',
    partOfSpeech: 'Noun (Food)',
    meaningHindi: 'दूध, दुग्ध',
    meaningEnglish: 'Milk',
    exampleSantali: 'Gai toa do bes gea.',
    exampleEnglish: 'Cow milk is pure and good.',
    exampleHindi: 'गाय का दूध अच्छा होता है।',
    category: 'food'
  },

  // 5. BODY PARTS (  / शरीर के अंग)
  {
    id: 'bdy_1',
    wordRoman: 'Bohok',
    wordDevanagari: 'बोहोक',
    phonetic: '/bɒhɒk’/',
    partOfSpeech: 'Noun (Anatomy)',
    meaningHindi: 'सिर, मस्तक',
    meaningEnglish: 'Head, Skull',
    exampleSantali: 'Bohok re pagri bande me.',
    exampleEnglish: 'Tie the ceremonial turban on the head.',
    exampleHindi: 'सिर पर पगड़ी बाँधो।',
    category: 'body'
  },
  {
    id: 'bdy_2',
    wordRoman: 'Med',
    wordDevanagari: 'मेद',
    phonetic: '/meɪd/',
    partOfSpeech: 'Noun (Anatomy)',
    meaningHindi: 'आँख, नेत्र',
    meaningEnglish: 'Eye, Eyesight',
    exampleSantali: 'Med te disom nyel me.',
    exampleEnglish: 'See the magnificent world with eyes.',
    exampleHindi: 'आँखों से दुनिया देखो।',
    category: 'body'
  },
  {
    id: 'bdy_3',
    wordRoman: 'Lutur',
    wordDevanagari: 'लुत्तुर',
    phonetic: '/luːtuːr/',
    partOfSpeech: 'Noun (Anatomy)',
    meaningHindi: 'कान, कर्ण',
    meaningEnglish: 'Ear, Hearing organ',
    exampleSantali: 'Lutur te sereng anjom me.',
    exampleEnglish: 'Listen to the folk song with your ears.',
    exampleHindi: 'कानों से गीत सुनो।',
    category: 'body'
  },
  {
    id: 'bdy_4',
    wordRoman: 'Ti',
    wordDevanagari: 'ती',
    phonetic: '/tiː/',
    partOfSpeech: 'Noun (Anatomy)',
    meaningHindi: 'हाथ, कर, हथेली',
    meaningEnglish: 'Hand, Arm',
    exampleSantali: 'Ti te Santali Devanagari ol me.',
    exampleEnglish: 'Write Santali Devanagari letters with your hand.',
    exampleHindi: 'हाथ से संताली देवनागरी लिखो।',
    category: 'body'
  },
  {
    id: 'bdy_5',
    wordRoman: 'Janga',
    wordDevanagari: 'जांगा',
    phonetic: '/dʒɑːŋɡɑː/',
    partOfSpeech: 'Noun (Anatomy)',
    meaningHindi: 'पैर, पाँव, चरण',
    meaningEnglish: 'Leg, Foot',
    exampleSantali: 'Janga te enej tal re hej me.',
    exampleEnglish: 'Step into the dance rhythm with feet.',
    exampleHindi: 'पैरों से नृत्य की ताल मिलाओ।',
    category: 'body'
  },

  // 6. NATURE & ELEMENTS (   / प्रकृति व तत्व)
  {
    id: 'nat_1',
    wordRoman: 'Dare',
    wordDevanagari: 'दारे',
    phonetic: '/dɑːreɪ/',
    partOfSpeech: 'Noun',
    meaningHindi: 'पेड़, वृक्ष',
    meaningEnglish: 'Tree, Plant',
    exampleSantali: 'Dare sakam joto jioan.',
    exampleEnglish: 'Trees and foliage are alive with soul.',
    exampleHindi: 'पेड़-पौधे जीवन से परिपूर्ण हैं।',
    category: 'nature'
  },
  {
    id: 'nat_2',
    wordRoman: 'Sarjom',
    wordDevanagari: 'सारजोम',
    phonetic: '/sɑːrdʒɒm/',
    partOfSpeech: 'Noun',
    meaningHindi: 'साल वृक्ष (शाल), पवित्र संताल पेड़',
    meaningEnglish: 'Sal tree (Shorea robusta), sacred tree in Santhal heritage',
    exampleSantali: 'Baha porob re sarjom baha bonga-aye.',
    exampleEnglish: 'Sal blossoms are offered during Baha festival.',
    exampleHindi: 'बाहा पर्व में साल के फूल की पूजा की जाती है।',
    category: 'nature'
  },
  {
    id: 'nat_3',
    wordRoman: 'Dak',
    wordDevanagari: 'दाक',
    phonetic: '/dɑːkʼ/',
    partOfSpeech: 'Noun',
    meaningHindi: 'पानी, जल, वर्षा',
    meaningEnglish: 'Water, Rain',
    exampleSantali: 'Dak jorok kana.',
    exampleEnglish: 'Rain is falling / water is leaking.',
    exampleHindi: 'बारिश हो रही है।',
    category: 'nature'
  },
  {
    id: 'nat_4',
    wordRoman: 'Sengel',
    wordDevanagari: 'सेंगेल',
    phonetic: '/seɪŋɡeɪl/',
    partOfSpeech: 'Noun',
    meaningHindi: 'आग, अग्नि',
    meaningEnglish: 'Fire, Flame',
    exampleSantali: 'Sengel jol me.',
    exampleEnglish: 'Light the fire.',
    exampleHindi: 'आग जलाओ।',
    category: 'nature'
  },
  {
    id: 'nat_5',
    wordRoman: 'Hoy',
    wordDevanagari: 'होय',
    phonetic: '/hɔɪ/',
    partOfSpeech: 'Noun',
    meaningHindi: 'हवा, वायु, पवन',
    meaningEnglish: 'Air, Wind, Breeze',
    exampleSantali: 'Riar hoy hijuk kana.',
    exampleEnglish: 'Cool pleasant breeze is blowing.',
    exampleHindi: 'ठंडी हवा चल रही है।',
    category: 'nature'
  },

  // 7. HOUSEHOLD & TOOLS (  / घरेलू सामान व औजार)
  {
    id: 'hsh_1',
    wordRoman: 'Orak',
    wordDevanagari: 'ओड़ाक',
    phonetic: '/ɒɽɑːkʼ/',
    partOfSpeech: 'Noun',
    meaningHindi: 'घर, मकान, गृह',
    meaningEnglish: 'Home, House',
    exampleSantali: 'Abowak orak do bes menaga.',
    exampleEnglish: 'Our home is peaceful and good.',
    exampleHindi: 'हमारा घर अच्छा है।',
    category: 'household'
  },
  {
    id: 'hsh_2',
    wordRoman: 'Kapi',
    wordDevanagari: 'कापी',
    phonetic: '/kɑːpiː/',
    partOfSpeech: 'Noun (Tool)',
    meaningHindi: 'कुल्हाड़ी, कापी (पारंपरिक अस्त्र व औजार)',
    meaningEnglish: 'Axe / Battle-axe (traditional heritage implement)',
    exampleSantali: 'Kapi do hul khon dhorom sapab.',
    exampleEnglish: 'The axe is a symbol of defense and farming.',
    exampleHindi: 'कापी संतालों का पारंपरिक औजार है।',
    category: 'household'
  },
  {
    id: 'hsh_3',
    wordRoman: 'Aa-sar',
    wordDevanagari: 'आग-सार',
    phonetic: '/ɑːkʼ sɑːr/',
    partOfSpeech: 'Noun (Tool)',
    meaningHindi: 'धनुष-बाण',
    meaningEnglish: 'Bow and Arrow (indigenous heritage weapon)',
    exampleSantali: 'Aa-sar do bir jiwali seka lagid.',
    exampleEnglish: 'Bow and arrows represent indigenous bravery.',
    exampleHindi: 'धनुष-बाण वीरता का प्रतीक है।',
    category: 'household'
  },
  {
    id: 'hsh_4',
    wordRoman: 'Parkom',
    wordDevanagari: 'पारकोम',
    phonetic: '/pɑːrkɒm/',
    partOfSpeech: 'Noun (Furniture)',
    meaningHindi: 'खाट, चारपाई',
    meaningEnglish: 'Woven rope cot / Charpai',
    exampleSantali: 'Parkom re giti me.',
    exampleEnglish: 'Rest comfortably on the woven cot.',
    exampleHindi: 'खाट पर आराम से सो जाओ।',
    category: 'household'
  },

  // 8. CULTURE & FESTIVALS (   / संस्कृति व त्योहार)
  {
    id: 'clt_1',
    wordRoman: 'Baha Porob',
    wordDevanagari: 'बाहा परब',
    phonetic: '/bɑːhɑː pɒrɒb/',
    partOfSpeech: 'Proper Noun',
    meaningHindi: 'बाहा पर्व (संतालों का वसंत पुष्प उत्सव)',
    meaningEnglish: 'Baha festival (spring flower ceremony celebrating Sal blooms)',
    exampleSantali: 'Baha porob re nayke bonga sarjom baha arak-aye.',
    exampleEnglish: 'The priest distributes blessed Sal blossoms during Baha.',
    exampleHindi: 'बाहा पर्व में पुजारी साल के पवित्र फूल बाँटते हैं।',
    category: 'culture'
  },
  {
    id: 'clt_2',
    wordRoman: 'Sohrai',
    wordDevanagari: 'सोहराय',
    phonetic: '/sɒhrɑːj/',
    partOfSpeech: 'Proper Noun',
    meaningHindi: 'सोहराय (संतालों का सबसे बड़ा फसल एवं पशु-धन उत्सव)',
    meaningEnglish: 'Sohrai (harvest and livestock thanksgiving festival)',
    exampleSantali: 'Sohrai re danta enej hoeoa.',
    exampleEnglish: 'Danta martial dances are performed during Sohrai.',
    exampleHindi: 'सोहराय में दांता नृत्य होता है।',
    category: 'culture'
  },
  {
    id: 'clt_3',
    wordRoman: 'Tumdak & Tamak',
    wordDevanagari: 'तुमदाक और टामक',
    phonetic: '/tuːmdɑːkʼ/',
    partOfSpeech: 'Noun (Music)',
    meaningHindi: 'मांदर और नगाड़ा (संताली पारंपरिक ताल वाद्य)',
    meaningEnglish: 'Tumdak (clay drum) & Tamak (kettle drum)',
    exampleSantali: 'Tumdak Tamak ru raska ge soa.',
    exampleEnglish: 'The beats of Tumdak and Tamak sound exhilarating.',
    exampleHindi: 'मांदर और नगाड़े की थाप से उत्साह छा जाता है।',
    category: 'culture'
  },
  {
    id: 'clt_4',
    wordRoman: 'Jaher Than',
    wordDevanagari: 'जाहेर थान',
    phonetic: '/dʒɑːheɪr thɑːn/',
    partOfSpeech: 'Proper Noun',
    meaningHindi: 'पवित्र संताल पूज्य स्थल (साल वृक्षों का उपवन)',
    meaningEnglish: 'Sacred grove of Sal trees where village deities are worshiped',
    exampleSantali: 'Jaher Than re baha bonga hoeoa.',
    exampleEnglish: 'Baha puja is performed at Jaher Than sacred grove.',
    exampleHindi: 'जाहेर थान में बाहा पूजा होती है।',
    category: 'culture'
  },

  // 9. ACTIONS & VERBS (   / क्रिया व काम)
  {
    id: 'act_1',
    wordRoman: 'Ol',
    wordDevanagari: 'ओल',
    phonetic: '/ɒl/',
    partOfSpeech: 'Verb',
    meaningHindi: 'लिखना, आलेखन करना',
    meaningEnglish: 'To write, compose, script',
    exampleSantali: 'Santali Devanagari te puthi ol me.',
    exampleEnglish: 'Write the book in Santali Devanagari script.',
    exampleHindi: 'संताली देवनागरी में पुस्तक लिखो।',
    category: 'action'
  },
  {
    id: 'act_2',
    wordRoman: 'Parhao',
    wordDevanagari: 'पढ़ाव',
    phonetic: '/pɑːɽhɑːw/',
    partOfSpeech: 'Verb',
    meaningHindi: 'पढ़ना, अध्ययन करना',
    meaningEnglish: 'To read, study',
    exampleSantali: 'Gidra ko do iskul re parhao kanako.',
    exampleEnglish: 'Children are studying diligently in school.',
    exampleHindi: 'बच्चे स्कूल में पढ़ाई कर रहे हैं।',
    category: 'action'
  },
  {
    id: 'act_3',
    wordRoman: 'Enej',
    wordDevanagari: 'एनेज',
    phonetic: '/eɪneɪdʒ/',
    partOfSpeech: 'Verb / Noun',
    meaningHindi: 'नाचना, संताली पारंपरिक नृत्य',
    meaningEnglish: 'To dance, traditional Santal group dance',
    exampleSantali: 'Lagre enej re sabote enej me.',
    exampleEnglish: 'Join hands and dance in the Lagre circle.',
    exampleHindi: 'लागड़े नृत्य में हाथ पकड़कर नाचो।',
    category: 'action'
  },
  {
    id: 'act_4',
    wordRoman: 'Sereng',
    wordDevanagari: 'सेरेञ',
    phonetic: '/seɪreɪɲ/',
    partOfSpeech: 'Verb / Noun',
    meaningHindi: 'गाना, लोकगीत गाना',
    meaningEnglish: 'To sing, Santal folk song',
    exampleSantali: 'Baha sereng adi hetem.',
    exampleEnglish: 'The spring Baha songs are melodious.',
    exampleHindi: 'बाहा के गीत बहुत मधुर होते हैं।',
    category: 'action'
  },

  // 10. NUMBERS & TIME (   / संख्या व समय)
  {
    id: 'num_1',
    wordRoman: 'Mit',
    wordDevanagari: 'मिद',
    phonetic: '/miːtʼ/',
    partOfSpeech: 'Numeral (1)',
    meaningHindi: 'एक (संख्या १)',
    meaningEnglish: 'One (number 1, )',
    exampleSantali: 'Mit gota dharwa.',
    exampleEnglish: 'A single leafy branch.',
    exampleHindi: 'एक डाल।',
    category: 'number_time'
  },
  {
    id: 'num_2',
    wordRoman: 'Bar',
    wordDevanagari: 'बार',
    phonetic: '/bɑːr/',
    partOfSpeech: 'Numeral (2)',
    meaningHindi: 'दो (संख्या २)',
    meaningEnglish: 'Two (number 2, )',
    exampleSantali: 'Bar hor hej akana kin.',
    exampleEnglish: 'Two people have arrived.',
    exampleHindi: 'दो लोग आए हैं।',
    category: 'number_time'
  },
  {
    id: 'num_5',
    wordRoman: 'More',
    wordDevanagari: 'मोणे',
    phonetic: '/mɒ̃ɽeɪ/',
    partOfSpeech: 'Numeral (5)',
    meaningHindi: 'पाँच (संख्या ५)',
    meaningEnglish: 'Five (number 5, )',
    exampleSantali: 'More hor manjhi than re durup akana ko.',
    exampleEnglish: 'Five village elders are gathered at Manjhi Than.',
    exampleHindi: 'गाँव के पंच (मोणे होड़) मांझी थान में बैठे हैं।',
    category: 'number_time'
  },
  {
    id: 'num_time_1',
    wordRoman: 'Tikin',
    wordDevanagari: 'तिकिन',
    phonetic: '/tiːkiːn/',
    partOfSpeech: 'Noun (Time)',
    meaningHindi: 'दोपहर, मध्याह्न',
    meaningEnglish: 'Noon, Midday',
    exampleSantali: 'Tikin re situng jhaloka.',
    exampleEnglish: 'The sun shines brightly at noon.',
    exampleHindi: 'दोपहर में धूप तेज होती है।',
    category: 'number_time'
  },
  {
    id: 'num_time_2',
    wordRoman: 'Ayub',
    wordDevanagari: 'आयुब',
    phonetic: '/ɑːjuːb/',
    partOfSpeech: 'Noun (Time)',
    meaningHindi: 'शाम, संध्या',
    meaningEnglish: 'Evening, Twilight',
    exampleSantali: 'Ayub re orak te hej me.',
    exampleEnglish: 'Return home by evening.',
    exampleHindi: 'शाम को घर आ जाना।',
    category: 'number_time'
  },

  // 11. OTHERS ( / अन्य)
  {
    id: 'oth_1',
    wordRoman: 'Johar',
    wordDevanagari: 'जोहार',
    phonetic: '/dʒoʊhɑːr/',
    partOfSpeech: 'Interjection / Noun',
    meaningHindi: 'नमस्ते, प्रणाम, अभिवादन',
    meaningEnglish: 'Greeting, Salutation, Hello (traditional Santali respectful greeting)',
    exampleSantali: 'Johar, am celed menama?',
    exampleEnglish: 'Hello, how are you?',
    exampleHindi: 'नमस्ते, आप कैसे हैं?',
    category: 'others'
  },
  {
    id: 'oth_2',
    wordRoman: 'Sarhao',
    wordDevanagari: 'सारहाव',
    phonetic: '/sɑːrhɑːw/',
    partOfSpeech: 'Interjection / Noun',
    meaningHindi: 'धन्यवाद, आभार, साधुवाद',
    meaningEnglish: 'Thank you, Gratitude, Appreciation',
    exampleSantali: 'Amak gomke-en lagid sarhao.',
    exampleEnglish: 'Thank you for your generous help.',
    exampleHindi: 'आपकी सहायता के लिए धन्यवाद।',
    category: 'others'
  },
  {
    id: 'oth_3',
    wordRoman: 'Dular',
    wordDevanagari: 'दुलार',
    phonetic: '/duːlɑːr/',
    partOfSpeech: 'Noun / Verb',
    meaningHindi: 'प्रेम, स्नेह, प्यार',
    meaningEnglish: 'Love, Affection, Deep fondness',
    exampleSantali: 'Inge aming dularama.',
    exampleEnglish: 'I love and cherish you.',
    exampleHindi: 'मैं तुमसे प्यार करता हूँ।',
    category: 'others'
  },
  {
    id: 'oth_4',
    wordRoman: 'Sagun Daram',
    wordDevanagari: 'सागुनदाराम',
    phonetic: '/sɑːɡuːn dɑːrɑːm/',
    partOfSpeech: 'Interjection',
    meaningHindi: 'हार्दिक स्वागत, शुभागमन',
    meaningEnglish: 'Warm Welcome, Auspicious Reception',
    exampleSantali: 'Hor Katha Suite re sagun daram!',
    exampleEnglish: 'Warm welcome to Hor Katha Suite!',
    exampleHindi: 'होड़ कथा सुइट में आपका हार्दिक स्वागत है!',
    category: 'others'
  }
];


export const QUIZ_QUESTIONS: QuizItem[] = [
  {
    id: 'q1',
    question: 'संताली भाषा में पारंपरिक अभिवादन व सत्कार के लिए क्या कहा जाता है?',
    options: ['जोहार (Johar)', 'बाहा (Baha)', 'दुलार (Dular)', 'सारजोम (Sarjom)'],
    correctAnswer: 'जोहार (Johar)',
    explanation: '"जोहार" संताली संस्कृति का पवित्र व पारम्परिक अभिवादन शब्द है, जिसे दोनों हाथ जोड़कर सम्मान व्यक्त किया जाता है।'
  },
  {
    id: 'q2',
    question: 'संताली भाषा को देवनागरी में लिखते समय अवरोधित/हलंत ध्वनियों के लिए किस चिह्न का प्रयोग होता है?',
    options: ["अवरोधक चिह्न ( ' ) व हलंत (्)", "विसर्ग ( : )", "अनुस्वार ( ं )", "चंद्रबिंदु ( ँ )"],
    correctAnswer: "अवरोधक चिह्न ( ' ) व हलंत (्)",
    explanation: "संताली में क', च', त', प' जैसी अवरोधित (Glottalized) ध्वनियों को देवनागरी में स्पष्ट रूप से ऊर्ध्व अल्पविराम (') या हलंत से दर्शाया जाता है।"
  },
  {
    id: 'q3',
    question: 'संताल संस्कृति में किस पवित्र वृक्ष के फूलों से बाहा पर्व की पूजा-अर्चना की जाती है?',
    options: ['सारजोम / सखुआ (Sal tree)', 'नीम का वृक्ष', 'बरगद का वृक्ष', 'आम का वृक्ष'],
    correctAnswer: 'सारजोम / सखुआ (Sal tree)',
    explanation: 'सारजोम (साल/सखुआ) का वृक्ष संतालों के लिए अति पवित्र है, बाहा पर्व पर इसके ताजे फूलों से जाहेर थान में बोंगा की पूजा होती है।'
  },
  {
    id: 'q4',
    question: 'संताली शब्द "दुलार" (Dular) का हिंदी में क्या अर्थ है?',
    options: ['प्यार एवं स्नेह', 'पवित्र जल', 'हरा-भरा वृक्ष', 'अग्नि / आग'],
    correctAnswer: 'प्यार एवं स्नेह',
    explanation: '"दुलार" का अर्थ हृदय का असीम प्रेम, स्नेह और आत्मीयता होता है।'
  },
  {
    id: 'q5',
    question: 'संताली देवनागरी गिनती में संख्या ५ (पाँच) को क्या कहा जाता है?',
    options: ['मोड़े (Mõrẽ)', 'मिद (Mit)', 'पे (Pey)', 'आरे (Are)'],
    correctAnswer: 'मोड़े (Mõrẽ)',
    explanation: 'संताली में ५ को "मोड़े / मोणे" कहा जाता है और ग्राम सभा के पंचों को "मोणे होड़" कहते हैं।'
  },
  {
    id: 'q6',
    question: 'संताल समाज के ग्राम स्वशासन में गाँव के प्रमुख मुखिया को क्या कहा जाता है?',
    options: ['मांझी हड़ाम (Manjhi Haram)', 'गोडेत', 'नायके', 'परानिक'],
    correctAnswer: 'मांझी हड़ाम (Manjhi Haram)',
    explanation: 'संताली स्वशासन व्यवस्था में "मांझी हड़ाम" गाँव के सर्वोच्च प्रशासक एवं ग्राम सभा अध्यक्ष होते हैं।'
  },
  {
    id: 'q7',
    question: 'संताल समाज में मूल रूप से कितने "पारिस" (गोत्र / Totem Clans) होते हैं?',
    options: ['१२ पारिस (12 Clans)', '७ पारिस', '१६ पारिस', '८ पारिस'],
    correctAnswer: '१२ पारिस (12 Clans)',
    explanation: 'संताल समाज में कुल १२ पारिस (मुरमु, किस्कू, हांसदा, हेम्ब्रम, सोरेन, मांडी, टुडू, बास्के, बेसरा, चौंड़े, पौरिया, बेदिया) होते हैं।'
  },
  {
    id: 'q8',
    question: 'संताली पशुपालन व फसल धन्यवाद महापर्व "सोहराय" मुख्यतः किस माह में मनाया जाता है?',
    options: ['पूस / कार्तिक-अगहन (फसल कटाई के बाद)', 'चैत', 'आषाढ़', 'भादो'],
    correctAnswer: 'पूस / कार्तिक-अगहन (फसल कटाई के बाद)',
    explanation: 'सोहराय संतालों का सबसे बड़ा पांच दिवसीय महापर्व है जिसमें धान कटाई के उपरांत गाय-बैलों की पूजा (खूंटाव) की जाती है।'
  },
  {
    id: 'q9',
    question: '१८५५ के ऐतिहासिक "संताल हूल" का प्रारंभ किस स्थान से हुआ था?',
    options: ['भोगनाडीह (साहिबगंज)', 'लुगु बुरु', 'अयोध्या बुरु', 'रांची'],
    correctAnswer: 'भोगनाडीह (साहिबगंज)',
    explanation: '३० जून १८५५ को सिदो, कान्हू, चांद और भैरव के नेतृत्व में भोगनाडीह की ऐतिहासिक सभा से संताल हूल शुरू हुआ।'
  },
  {
    id: 'q10',
    question: 'संताली समाज के किस पारंपरिक वाद्य यंत्र को मिट्टी और चमड़े से बनाया जाता है जिसे दोनों हाथों से बजाते हैं?',
    options: ['तुमदाक (मांदर)', 'तिरियो (बांसुरी)', 'बानाम (सारंगी)', 'भुवांग'],
    correctAnswer: 'तुमदाक (मांदर)',
    explanation: 'तुमदाक (मांदर) मिट्टी के खोल और चमड़े से बना मुख्य ताल वाद्य है।'
  },
  {
    id: 'q11',
    question: 'संताली शब्द "ओड़ाक्" (Orak) का क्या अर्थ होता है?',
    options: ['घर / मकान', 'नदी / तालाब', 'जंगल / पहाड़', 'पुस्तक / कलम'],
    correctAnswer: 'घर / मकान',
    explanation: 'ओड़ाक् का अर्थ घर या निवास स्थान होता है।'
  },
  {
    id: 'q12',
    question: 'संताली व्याकरण में वचन (Number) के कितने भेद होते हैं?',
    options: ['तीन (एकवचन, द्विवचन, बहुवचन)', 'दो (एकवचन, बहुवचन)', 'चार', 'केवल एक'],
    correctAnswer: 'तीन (एकवचन, द्विवचन, बहुवचन)',
    explanation: 'संताली भाषा की विशेषता है कि इसमें एकवचन, द्विवचन (-किन) और बहुवचन (-को) तीनों स्पष्ट रूप से प्रयोग होते हैं।'
  },
  {
    id: 'q13',
    question: 'जाहेर थान में ग्राम पूजा संपन्न कराने वाले पारंपरिक पुजारी को क्या कहते हैं?',
    options: ['नायके (Naike)', 'गोडेत', 'दिहरी', 'परगना'],
    correctAnswer: 'नायके (Naike)',
    explanation: 'नायके बाबा जाहेर थान में मरांग बुरु और जाहेर एरा की पवित्र पूजा-अर्चना करते हैं।'
  },
  {
    id: 'q14',
    question: 'संताली में "महुआ" के पेड़ और फूल को किस नाम से जाना जाता है?',
    options: ['मातकोम (Matkom)', 'सारजोम (Sarjom)', 'मुरुप (Murup)', 'तारोप (Tarop)'],
    correctAnswer: 'मातकोम (Matkom)',
    explanation: 'महुआ को संताली में "मातकोम" कहते हैं, जो भोजन और औषधि दोनों में अत्यंत उपयोगी है।'
  },
  {
    id: 'q15',
    question: 'संतालों का सर्वोच्च पारंपरिक अरण्य न्यायालय "लो बीर बैसी" कहाँ आयोजित होता है?',
    options: ['अयोध्या बुरु (पुरुलिया)', 'देवघर', 'दुमका शहर', 'हजारीबाग'],
    correctAnswer: 'अयोध्या बुरु (पुरुलिया)',
    explanation: 'लो बीर बैसी सदियों से अयोध्या बुरु की पावन पहाड़ी में सेंद्रा और न्याय सभा के रूप में आयोजित होती आ रही है।'
  },
  {
    id: 'q16',
    question: 'संताली भाषा को भारतीय संविधान की किस अनुसूची में शामिल किया गया है?',
    options: ['आठवीं अनुसूची (92वां संशोधन 2003)', 'सातवीं अनुसूची', 'दसवीं अनुसूची', 'पांचवीं अनुसूची'],
    correctAnswer: 'आठवीं अनुसूची (92वां संशोधन 2003)',
    explanation: '92वें संविधान संशोधन अधिनियम 2003 द्वारा संताली भाषा को भारतीय संविधान की आठवीं अनुसूची में स्थान मिला।'
  },
  {
    id: 'q17',
    question: 'संताली में २० (बीस) की इकाई पर आधारित गिनती को क्या कहा जाता है?',
    options: ['इसी (Isi)', 'गेल (Gele)', 'सय (Sai)', 'हजार (Hajar)'],
    correctAnswer: 'इसी (Isi)',
    explanation: 'संताली गिनती २० आधारित "इसी" प्रणाली पर चलती है, जैसे बार-इसी (४०), पे-इसी (६०)।'
  },
  {
    id: 'q18',
    question: 'गाँव में सूचना, बैठक व न्योता पहुंचाने वाले ग्राम दूत को क्या कहा जाता है?',
    options: ['गोडेत (Godet)', 'मांझी', 'नायके', 'जोग मांझी'],
    correctAnswer: 'गोडेत (Godet)',
    explanation: 'गोडेत ग्राम सभा का संदेशवाहक होता है जो हर घर तक बैठक व पर्व का समाचार पहुंचाता है।'
  },
  {
    id: 'q19',
    question: 'संताली शब्द "हापड़ाम" (Hapram) का क्या तात्पर्य है?',
    options: ['पूर्वज व पुरखे', 'छोटे बच्चे', 'जंगली पक्षी', 'नया धान'],
    correctAnswer: 'पूर्वज व पुरखे',
    explanation: 'हापड़ाम का अर्थ हमारे आदरणीय पूर्वज और पुरखे होता है।'
  },
  {
    id: 'q20',
    question: 'पवित्र तीर्थस्थल "लुगु बुरु घांटाबाड़ी धोरोमगाढ़" झारखंड के किस जिले में स्थित है?',
    options: ['बोकारो (ललपनिया)', 'गुमला', 'गिरिडीह', 'पलामू'],
    correctAnswer: 'बोकारो (ललपनिया)',
    explanation: 'लुगु बुरु घांटाबाड़ी धोरोमगाढ़ झारखंड के बोकारो जिले के ललपनिया में स्थित है।'
  },
  {
    id: 'q21',
    question: 'संताली में "आम" के फल को क्या कहा जाता है?',
    options: ['उल (Ul)', 'कांथाड़ (Kanthar)', 'जोजो (Jojo)', 'कुद (Kud)'],
    correctAnswer: 'उल (Ul)',
    explanation: 'आम को संताली में "उल" (Ul), कटहल को "कांथाड़" और इमली को "जोजो" कहते हैं।'
  },
  {
    id: 'q22',
    question: 'संताली लोकपहेलियों को परंपरागत रूप से क्या कहा जाता है?',
    options: ['कुदुम (Kudum)', 'बाखेड़ (Bakher)', 'सेरेंग (Sereng)', 'बिनती (Binti)'],
    correctAnswer: 'कुदुम (Kudum)',
    explanation: 'संताली पहेलियों को "कुदुम" कहा जाता है और कहावतों को "भेंता काथा / मेनकाथा" कहते हैं।'
  },
  {
    id: 'q23',
    question: 'संताली शब्द "चांदो" (Chando) का प्रयोग किसके लिए होता है?',
    options: ['सूर्य / चंद्रमा / ईश्वर', 'नदी', 'पत्थर', 'बैलगाड़ी'],
    correctAnswer: 'सूर्य / चंद्रमा / ईश्वर',
    explanation: 'संताली में सिंगी चांदो (सूर्य), ञिंदा चांदो (चंद्रमा) तथा मरांग चांदो (सृष्टिकर्ता) के लिए "चांदो" शब्द प्रयुक्त होता है।'
  },
  {
    id: 'q24',
    question: 'संताली महिला द्वारा पहना जाने वाला पारंपरिक दो-टुकड़ा बुना वस्त्र क्या कहलाता है?',
    options: ['पंछी-पारहाड़ (Panchi-Parhand)', 'पगड़ी', 'झूला', 'कंधा साड़ी'],
    correctAnswer: 'पंछी-पारहाड़ (Panchi-Parhand)',
    explanation: 'पंछी (निचला वस्त्र) और पारहाड़ (ऊपरी वस्त्र) संताली महिलाओं की पारंपरिक हस्तकरघा वेशभूषा है।'
  },
  {
    id: 'q25',
    question: 'सकरात पर्व (मकर संक्रांति) पर संताली युवाओं द्वारा कौन-सा पारंपरिक तीरंदाजी उत्सव खेला जाता है?',
    options: ['बेझा तुञ (Bejha Tunj)', 'खूंटाव', 'काटी खेल', 'दासांय'],
    correctAnswer: 'बेझा तुञ (Bejha Tunj)',
    explanation: 'सकरात पर केले के स्तंभ पर निशाना साधकर "बेझा तुञ" धनुर्विद्या प्रतियोगिता होती है।'
  },
  {
    id: 'q26',
    question: 'संताली में "सारहाव" (Sarhao) शब्द का प्रयोग कब किया जाता है?',
    options: ['धन्यवाद / आभार प्रकट करने के लिए', 'अलविदा कहने के लिए', 'क्रोध दिखाने के लिए', 'सोने से पहले'],
    correctAnswer: 'धन्यवाद / आभार प्रकट करने के लिए',
    explanation: 'किसी का आभार या धन्यवाद व्यक्त करने के लिए "सारहाव" या "आडी सारहाव" कहा जाता है।'
  },
  {
    id: 'q27',
    question: 'संताली में "बाघ" (Tiger) और "कछुआ" (Tortoise) को क्रमशः क्या कहते हैं?',
    options: ['कुल और होरो', 'बाना और तोयु', 'सेता और पुसी', 'माराक और मिरु'],
    correctAnswer: 'कुल और होरो',
    explanation: 'बाघ को "कुल" और कछुआ को "होरो" कहा जाता है; दोनों संताली लोककथाओं में प्रमुख पात्र हैं।'
  },
  {
    id: 'q28',
    question: 'संताली में "हपड़ाम कोवाक् ञुतुम दोहो" परंपरा किससे जुड़ी है?',
    options: ['नवजात शिशु के नामकरण से', 'विवाह से', 'धान कटाई से', 'मकान निर्माण से'],
    correctAnswer: 'नवजात शिशु के नामकरण से',
    explanation: 'संताली परंपरा में प्रथम पुत्र का नाम दादा (हड़ाम बा) और प्रथम पुत्री का नाम दादी (बुढ़ी आयो) के नाम पर रखा जाता है।'
  },
  {
    id: 'q29',
    question: 'संताली शब्द "दाक्" (Dak) का हिंदी में क्या अर्थ होता है?',
    options: ['जल / पानी / वर्षा', 'आग / अग्नि', 'हवा / पवन', 'धूप / सूर्य'],
    correctAnswer: 'जल / पानी / वर्षा',
    explanation: 'संताली में पानी और बारिश दोनों के लिए "दाक्" शब्द का प्रयोग होता है।'
  },
  {
    id: 'q30',
    question: 'संताल हूल १८५५ में किन दो वीरांगना बहनों ने अदम्य साहस और बलिदान दिया था?',
    options: ['फूलों और झानो मुर्मू', 'रानी और चंपा', 'बाहा और सारजोम', 'पिलचु और करम'],
    correctAnswer: 'फूलों और झानो मुर्मू',
    explanation: 'सिदो-कान्हू की वीर बहनें फूलों मुर्मू और झानो मुर्मू ने हूल के दौरान ब्रिटिश छावनी पर ऐतिहासिक धावा बोला था।'
  }
];

export interface TranslationMapping {
  santaliRoman: string;
  santaliDevanagari: string;
  hindi: string;
  english: string;
}

export const TRANSLATION_DATABASE: TranslationMapping[] = [
  { santaliRoman: 'johar', santaliDevanagari: 'जोहार', hindi: 'नमस्ते / प्रणाम / अभिवादन', english: 'Hello / Greetings / Welcome' },
  { santaliRoman: 'sagundaram', santaliDevanagari: 'सागुनदाराम', hindi: 'हार्दिक स्वागत है', english: 'Warm Welcome' },
  { santaliRoman: 'sagun setak', santaliDevanagari: 'सगुन सेताक', hindi: 'सुप्रभात', english: 'Good morning' },
  { santaliRoman: 'sagun tikin', santaliDevanagari: 'सगुन तिकिन', hindi: 'शुभ दोपहर', english: 'Good afternoon' },
  { santaliRoman: 'sagun ayub', santaliDevanagari: 'सगुन आयुब', hindi: 'शुभ संध्या', english: 'Good evening' },
  { santaliRoman: 'sagun ninda', santaliDevanagari: 'सगुन ञिंदा', hindi: 'शुभ रात्रि', english: 'Good night' },
  { santaliRoman: 'am celed menama', santaliDevanagari: 'आम चेलेद मेनामा', hindi: 'आप कैसे हैं?', english: 'How are you?' },
  { santaliRoman: 'in do bes ge menanya', santaliDevanagari: 'इञ दो बेस गे मेनांञा', hindi: 'मैं ठीक हूँ / मैं अच्छा हूँ', english: 'I am doing well / I am fine' },
  { santaliRoman: 'sarhao', santaliDevanagari: 'सारहाव', hindi: 'धन्यवाद / बहुत आभार', english: 'Thank you very much' },
  { santaliRoman: 'amak nyutum do ched', santaliDevanagari: 'आमाक ञुतुम दो चेद', hindi: 'आपका क्या नाम है?', english: 'What is your name?' },
  { santaliRoman: 'inyak nyutum do', santaliDevanagari: 'इञाक ञुतुम दो', hindi: 'मेरा नाम ... है', english: 'My name is ...' },
  { santaliRoman: 'okateyem calak kana', santaliDevanagari: 'ओकातेम चालाक काना', hindi: 'आप कहाँ जा रहे हैं?', english: 'Where are you going?' },
  { santaliRoman: 'in do iskul te senok kana', santaliDevanagari: 'इञ दो इस्कुल ते सेनोक काना', hindi: 'मैं स्कूल जा रहा हूँ', english: 'I am going to school' },
  { santaliRoman: 'in do orak te senok kana', santaliDevanagari: 'इञ दो ओड़ाक ते सेनोक काना', hindi: 'मैं घर जा रहा हूँ', english: 'I am going home' },
  { santaliRoman: 'daka jom me', santaliDevanagari: 'दाका जोम मे', hindi: 'खाना खाओ', english: 'Eat your meal' },
  { santaliRoman: 'dak nu me', santaliDevanagari: 'दाक ञु मे', hindi: 'पानी पियो', english: 'Drink water' },
  { santaliRoman: 'in dak tetaŋ kana', santaliDevanagari: 'इञ दाक तेतांग काना', hindi: 'मुझे प्यास लगी है', english: 'I am thirsty' },
  { santaliRoman: 'in rengec kana', santaliDevanagari: 'इञ रेंगेच् काना', hindi: 'मुझे भूख लगी है', english: 'I am hungry' },
  { santaliRoman: 'dak', santaliDevanagari: 'दाक', hindi: 'पानी / जल / वर्षा', english: 'Water / Rain' },
  { santaliRoman: 'dular', santaliDevanagari: 'दुलार', hindi: 'प्यार / स्नेह / प्रेम', english: 'Love / Affection' },
  { santaliRoman: 'orak', santaliDevanagari: 'ओड़ाक', hindi: 'घर / मकान', english: 'Home / House' },
  { santaliRoman: 'bonga', santaliDevanagari: 'बोंगा', hindi: 'भगवान / ईश्वर / देव आत्मा', english: 'God / Divine spirit' },
  { santaliRoman: 'dharti', santaliDevanagari: 'धर्ती', hindi: 'धरती / पृथ्वी / भूमंडल', english: 'Earth / World' },
  { santaliRoman: 'sarjom', santaliDevanagari: 'सारजोम', hindi: 'साल का वृक्ष / सखुआ पेड़', english: 'Sal tree / Shorea robusta' },
  { santaliRoman: 'hor', santaliDevanagari: 'होड़', hindi: 'मनुष्य / व्यक्ति / संताल जन', english: 'Human being / Santal person' },
  { santaliRoman: 'disom', santaliDevanagari: 'दिसोम', hindi: 'देश / मातृभूमि', english: 'Country / Homeland' },
  { santaliRoman: 'atu', santaliDevanagari: 'अतु', hindi: 'गाँव / ग्राम', english: 'Village' },
  { santaliRoman: 'bir', santaliDevanagari: 'बीर', hindi: 'जंगल / वन', english: 'Forest / Woods' },
  { santaliRoman: 'buru', santaliDevanagari: 'बुरु', hindi: 'पहाड़ / पर्वत', english: 'Mountain / Hill' },
  { santaliRoman: 'gada', santaliDevanagari: 'गाडा', hindi: 'नदी', english: 'River' },
  { santaliRoman: 'nowa do tinak dam kana', santaliDevanagari: 'नोवा दो तिनाक दाम काना', hindi: 'इसकी कीमत क्या है?', english: 'How much does this cost?' },
  { santaliRoman: 'abo joto hor', santaliDevanagari: 'आबो जोतो होड़', hindi: 'हम सभी लोग', english: 'All of us together' },
  { santaliRoman: 'santali bhasa bon banchaoa', santaliDevanagari: 'संताली भाषा बोन बांचाओ-आ', hindi: 'हम संताली भाषा को बचाएंगे', english: 'We will preserve the Santali language' },
  { santaliRoman: 'baha porob', santaliDevanagari: 'बाहा परब', hindi: 'बाहा पर्व (वसंत पुष्प उत्सव)', english: 'Baha flower festival' },
  { santaliRoman: 'sohrai porob', santaliDevanagari: 'सोहराय परब', hindi: 'सोहराय महापर्व', english: 'Sohrai harvest festival' },
  { santaliRoman: 'jaher than okare menaka', santaliDevanagari: 'जाहेर थान ओकारे मेनाका', hindi: 'जाहेर थान कहाँ स्थित है?', english: 'Where is Jaher Than located?' },
  { santaliRoman: 'gapa bon nyapama', santaliDevanagari: 'गापा बोन ञापामा', hindi: 'कल हम मिलेंगे', english: 'We will meet tomorrow' },
  { santaliRoman: 'goro ema me', santaliDevanagari: 'गोड़ो एमा मे', hindi: 'कृपया मदद कीजिए', english: 'Please help' },
  { santaliRoman: 'sari katha ror me', santaliDevanagari: 'सारी काथा रोड़ मे', hindi: 'सच बात बोलो', english: 'Speak the truth' },
  { santaliRoman: 'ol parhao me', santaliDevanagari: 'ओल पढ़ाव मे', hindi: 'लिखो और पढ़ो', english: 'Read and write' },
  { santaliRoman: 'delabo akhra te', santaliDevanagari: 'देलाबो अखड़ा ते', hindi: 'चलो अखड़ा चलें', english: 'Let us go to the Akhra' },
  { santaliRoman: 'in aming dularama', santaliDevanagari: 'इञ आमिंग दुलारामा', hindi: 'मैं तुमसे प्यार करता हूँ', english: 'I love you' },
  { santaliRoman: 'ma tobe', santaliDevanagari: 'मा तोबे', hindi: 'अच्छा तो फिर मिलते हैं', english: 'Goodbye, see you again' },
  { santaliRoman: 'hoyo', santaliDevanagari: 'होय', hindi: 'हवा / पवन', english: 'Wind / Air' },
  { santaliRoman: 'sengel', santaliDevanagari: 'सेंगेल', hindi: 'आग / अग्नि', english: 'Fire' },
  { santaliRoman: 'chando', santaliDevanagari: 'चांदो', hindi: 'सूर्य / चंद्रमा', english: 'Sun / Moon' },
  { santaliRoman: 'ayo baba', santaliDevanagari: 'आयो बाबा', hindi: 'माता और पिता', english: 'Mother and Father' },
  { santaliRoman: 'pera hor', santaliDevanagari: 'पेड़ा होड़', hindi: 'मेहमान / अतिथि', english: 'Guests / Relatives' }
];
