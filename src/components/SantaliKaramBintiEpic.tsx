import React, { useState } from 'react';
import { Scroll, Volume2, Info, Compass, Sparkles, BookOpen, Music, CheckCircle2 } from 'lucide-react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';

interface KaramBintiCanto {
  cantoNumber: number;
  santaliTitle: string;
  hindiTitle: string;
  theme: string;
  verseDevanagari: string;
  verseRoman: string;
  hindiMeaning: string;
  spiritualContext: string;
}

const KARAM_BINTI_CANTOS: KaramBintiCanto[] = [
  {
    cantoNumber: 1,
    santaliTitle: 'सिरजोन बिनती (Srijon Binti)',
    hindiTitle: 'सृष्टि उत्पत्ति व जलीय जीवों का सहयोग',
    theme: 'अथाह जल में धरती की स्थापना',
    verseDevanagari: `चारों कोने दाः गे दाः, ठाकुर जी दोए हुदिश एदा।
चेले तेञ सिरजोना धर्ती, चेले तेञ सिरजोना मानवा?
राघव बोआल, होरो आर केंचुवा,
होरो पीठ रे लेंडोत हासाए सांबाव केदा।`,
    verseRoman: `Charo kone dah ge dah, Thakur Ji doe hudish eda.
Chele tegn sirjona dharti, chele tegn sirjona manwa?
Raghav Boal, Horo ar Kenchuwa,
Horo pith re lendot hasae sambaw keda.`,
    hindiMeaning: 'चारों ओर केवल अथाह जल था। ठाकुर जी ने विचार किया कि मैं इस धरती और मानव की रचना कैसे करूँ? तब राघव बोआल (विशाल मत्स्य), होरो (कछुआ) और लेंडोत (केंचुआ) ने सहयोग किया। कछुए की विशाल पीठ पर केंचुए ने पाताल से मिट्टी लाकर बिछा दी।',
    spiritualContext: 'करम रात का प्रथम प्रहर: सृष्टि की नींव में सबसे छोटे और मूक जलीय जीवों के त्याग और सहयोग का पावन स्मरण।'
  },
  {
    cantoNumber: 2,
    santaliTitle: 'हास-हासिल हंस बिनती (Has-Hasil Binti)',
    hindiTitle: 'हंस युगल व प्रथम मानव अंडों का जन्म',
    theme: 'पवित्र पक्षी युगल व मानव बीज',
    verseDevanagari: `ठाकुर जी दो सिरजोन केत् किना,
हास आर हासिल चेँड़े जोड़ा।
सिरजोम साकाम छांव रे,
तुरूय माह रे बारया बिलि कीन बिलि केदा।`,
    verseRoman: `Thakur Ji do sirjon ket kina,
Has ar Hasil chenre jora.
Sirjom sakam chhanw re,
Turuy mah re barya bili kin bili keda.`,
    hindiMeaning: 'ठाकुर जी ने हंस और हंसली (हास-हासिल) के पावन युगल की रचना की। साल के पत्तों की छांव में छठे माह में उन्होंने दो सुनहरे अंडे दिए, जिनसे प्रथम मानव बालक और बालिका का जन्म हुआ।',
    spiritualContext: 'द्वितीय प्रहर: समस्त मानव जाति पक्षियों के अंडों से उत्पन्न हुई है, इसलिए वन्य-पक्षियों की हत्या संताली समाज में निषिद्ध मानी गई।'
  },
  {
    cantoNumber: 3,
    santaliTitle: 'पिलचु हाड़ाम-बूढ़ी बिनती (Pilchu Hadam-Budhi)',
    hindiTitle: 'आदि-मानव दंपति व हिहिड़ी-पिहिड़ी प्रवास',
    theme: 'हिहिड़ी-पिहिड़ी में प्रथम गृहस्थी',
    verseDevanagari: `हिहिड़ी-पिहिड़ी दिशोम रे,
पिलचु हाड़ाम आर पिलचु बूढ़ी।
सात कोड़ा आर सात कुड़ी,
खोज-कमान रे कुलही कीन बेनाओ केदा।`,
    verseRoman: `Hihiri-Pihiri dishom re,
Pilchu Hadam ar Pilchu Budhi.
Sat kora ar sat kuri,
Khoj-Kaman re kulhi kin benao keda.`,
    hindiMeaning: 'हिहिड़ी-पिहिड़ी के पावन देश में पिलचु हाड़ाम और पिलचु बूढ़ी ने प्रथम कुटिया बनाई। उनके सात पुत्र और सात पुत्रियां हुईं, जिन्होंने खोज-कमान और हरता-गढ़ में प्रथम समाज का विस्तार किया।',
    spiritualContext: 'तृतीय प्रहर: मानव सभ्यता, कृषि, वस्त्र और परिवार व्यवस्था की उत्पत्ति का महाकाव्य आख्यान।'
  },
  {
    cantoNumber: 4,
    santaliTitle: '१२ पारिस व कुल उत्पत्ति (12 Clans Genesis)',
    hindiTitle: '१२ पवित्र पारिस (कुल) व गोत्र चिन्ह',
    theme: 'पारिस व्यवस्था और सामाजिक मर्यादा',
    verseDevanagari: `हांसदाक\', मुर्मू, किस्कू, हेम्ब्रोम,
मरांडी, सोरेन, टुडू आर बास्के।
बेसरा, चोड़े, पौरिया आर बेदिया,
बारो पारिस ते संताल दिशोम सोंझोव एना।`,
    verseRoman: `Hansdak', Murmu, Kisku, Hembrom,
Marandi, Soren, Tudu ar Baskey.
Besra, Chore, Pauria ar Bedea,
Baro Paris te Santal Dishom sonjhow ena.`,
    hindiMeaning: 'हांसदाक, मुर्मू (पुजारी), किस्कू (राजा), हेम्ब्रोम (कुलीन), मरांडी (धनी), सोरेन (सैनिक), टुडू (संगीतकार) और बास्के कुल बने। १२ कुलों में विभाजित होकर संताली समाज ने अटूट सामाजिक अनुशासन पाया।',
    spiritualContext: 'चतुर्थ प्रहर: सगोत्रीय विवाह निषेध और प्रत्येक कुल के टोटेम (प्रकृति प्रतीक) की रक्षा का संकल्प।'
  },
  {
    cantoNumber: 5,
    santaliTitle: 'चांपा गढ़ स्वर्ण-काल (Champa Garh Lore)',
    hindiTitle: 'चांपा गढ़ का गौरवशाली युग व प्रवास',
    theme: 'संताली सभ्यता की स्वर्णभूमि',
    verseDevanagari: `चांपा गढ़ रे सोना लेका दिन ताहे काना,
हरियर खेत, धान्य कोठार आर गाड़ा दाः।
दिशोम होड़ को रासका तेको ताहे काना,
करम धरम को मानावेद् ताहे काना।`,
    verseRoman: `Champa Garh re sona leka din tahe kana,
Hariyar khet, dhanya kothar ar gada dah.
Dishom hor ko raska teko tahe kana,
Karam Dharam ko manawed tahe kana.`,
    hindiMeaning: 'चांपा गढ़ में सोने जैसे पावन दिन थे। हरे-भरे खेत, धान्य से भरे भंडार और निर्मल नदियां थीं। सभी संताली सुख-शांति से रहते थे और करम धरम का निष्ठा से पालन करते थे।',
    spiritualContext: 'पंचम प्रहर: चांपा गढ़ के ऐतिहासिक गौरव और विदेशी आक्रमणों के समय आत्मसम्मान हेतु प्रवास की गाथा।'
  },
  {
    cantoNumber: 6,
    santaliTitle: 'करम गोसाएं आशीष बिनती (Karam Gosane)',
    hindiTitle: 'करम वृक्ष की डाल व अंतिम लोक-आशीष',
    theme: 'कर्म, बंधुत्व और हरियाली की वंदना',
    verseDevanagari: `करम गोसाएं, जाहेर एरा आर मरांग बुरु,
आबो हातु रे दया ताहेन मा।
धान्य पेरेज मा, गोधन बाढ़ाव मा,
आबो संताल समाज जियाड़ ताहेन मा!`,
    verseRoman: `Karam Gosane, Jaher Era ar Marang Buru,
Abo hatu re daya tahen ma.
Dhanya perej ma, godhan barhaw ma,
Abo Santal samaj jiyar tahen ma!`,
    hindiMeaning: 'हे करम देव, जाहेर एरा और मरांग बुरु! हमारे गांव पर आपकी कृपा बनी रहे। हमारे खलिहान धान से भरे रहें, पशुधन में वृद्धि हो और हमारा संताली समाज चिरकाल तक अमर रहे!',
    spiritualContext: 'प्रातःकाल (अंतिम प्रहर): करम डाल की विदाई और पूरे गांव को सुख-समृद्धि का अंतिम सामूहिक आशीर्वाद।'
  }
];

export const SantaliKaramBintiEpic: React.FC = () => {
  const [selectedCanto, setSelectedCanto] = useState<KaramBintiCanto>(KARAM_BINTI_CANTOS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const speakText = (text: string) => {
    setIsPlayingAudio(true);
    speakWithFemaleVoice(text, {
      autoDetectLanguage: true,
      rate: 0.88,
      onEnd: () => setIsPlayingAudio(false)
    });
  };

  const handleStopAudio = () => {
    stopSpeaking();
    setIsPlayingAudio(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-amber-50 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-sm border border-emerald-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-200">
              <Scroll className="w-4 h-4" />
              काराम बिनती महाकाव्य • Oral Epic Recitation Suite
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              काराम बिनती महाकाव्य संपूर्ण मौखिक पाठ
            </h1>
            <p className="mt-2 text-emerald-700 text-sm sm:text-base max-w-2xl leading-relaxed">
              करम पर्व की रात गुरु (करम डारहा) द्वारा गाए जाने वाले सृष्टि, हंस-हंसली, पिलचु हाड़ाम, १२ कुल और चांपा गढ़ के संपूर्ण ३६-सर्गीय मौखिक महाकाव्य का गायन व व्याख्या।
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/90 p-2 rounded-2xl border border-emerald-200 text-xs text-emerald-700">
            <Music className="w-4 h-4 text-emerald-700" />
            <span>६ प्रमुख सर्ग संग्रह</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Canto Selector & Epic Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Canto Nav */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-600 flex items-center gap-1.5 px-1">
            <Compass className="w-4 h-4 text-emerald-600" />
            महाकाव्य के ६ पावन प्रहर व सर्ग:
          </h2>

          <div className="space-y-2.5">
            {KARAM_BINTI_CANTOS.map((canto) => {
              const isSelected = selectedCanto.cantoNumber === canto.cantoNumber;
              return (
                <button
                  key={canto.cantoNumber}
                  onClick={() => {
                    handleStopAudio();
                    setSelectedCanto(canto);
                  }}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-white/90 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-700 uppercase">
                      सर्ग {canto.cantoNumber}
                    </span>
                    <span className="text-xs text-slate-600 font-mono">
                      {canto.theme}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-slate-900 text-sm mt-1.5">
                    {canto.santaliTitle}
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-700 mt-0.5">
                    {canto.hindiTitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Karam Guru Lore Note */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-white/90 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-700 leading-relaxed">
            <div className="font-bold text-amber-900 dark:text-amber-700 flex items-center gap-1.5 mb-1">
              <Info className="w-4 h-4" />
              करम डारहा गुरु की परंपरा:
            </div>
            काराम बिनती कोई साधारण गीत नहीं है। इसे केवल वही गुरु (डारहा) गाते हैं जो उपवास रखकर पवित्र स्नान करते हैं। यह पाठ पूरी रात बिना रुके अखंड चलता है और भोर में करम डाल विसर्जन के साथ समाप्त होता है।
          </div>
        </div>

        {/* Right Column: Active Canto Verses & Meaning */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-700 uppercase tracking-wider block">
                  सर्ग {selectedCanto.cantoNumber}: {selectedCanto.theme}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-900 mt-0.5">
                  {selectedCanto.santaliTitle}
                </h3>
                <p className="text-xs text-slate-500">{selectedCanto.hindiTitle}</p>
              </div>

              {/* Audio Play Button */}
              <button
                onClick={() => {
                  if (isPlayingAudio) {
                    handleStopAudio();
                  } else {
                    speakText(`${selectedCanto.santaliTitle}। ${selectedCanto.verseDevanagari}। हिन्दी अर्थ: ${selectedCanto.hindiMeaning}`);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
                  isPlayingAudio
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                {isPlayingAudio ? 'वाचन रोकें (Stop)' : 'सर्ग का सस्वर पाठ सुनें'}
              </button>
            </div>

            {/* Sacred Verse in Devanagari & Roman */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-white/90 border border-emerald-200 dark:border-emerald-800/50 space-y-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-700 uppercase tracking-wider block mb-2">
                  संताली देवनागरी छंद (Devanagari Verses):
                </span>
                <pre className="whitespace-pre-wrap font-serif text-base sm:text-lg font-bold text-emerald-950 dark:text-slate-900 leading-relaxed">
                  {selectedCanto.verseDevanagari}
                </pre>
              </div>

              <div className="pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40">
                <span className="text-xs font-mono text-emerald-700 dark:text-emerald-700 uppercase tracking-wider block mb-1">
                  रोमन लिप्यंतरण (Phonetic Roman):
                </span>
                <pre className="whitespace-pre-wrap font-mono text-xs text-slate-600 dark:text-slate-600 leading-relaxed italic">
                  {selectedCanto.verseRoman}
                </pre>
              </div>
            </div>

            {/* Hindi Meaning */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-600 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                महाकाव्यीय हिन्दी भावार्थ:
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-600 leading-relaxed bg-slate-50 dark:bg-white/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {selectedCanto.hindiMeaning}
              </p>
            </div>

            {/* Spiritual Context */}
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-white/90 border border-amber-200/50 dark:border-amber-900/40 text-xs text-slate-700 dark:text-slate-600 space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-700 block">
                आध्यात्मिक प्रहर व रहस्य:
              </span>
              <p>{selectedCanto.spiritualContext}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
