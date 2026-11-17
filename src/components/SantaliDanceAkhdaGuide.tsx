import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, ChevronLeft, ChevronRight, Volume2, RotateCcw, Users } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface DanceStep {
  beat: number;
  footwork: string;
  handHold: string;
  santaliCue: string;
}

interface DanceChoreography {
  id: string;
  name: string;
  santaliName: string;
  formationType: 'circle' | 'semicircle' | 'line';
  dancersCount: number;
  occasion: string;
  drums: string;
  defaultBpm: number;
  attire: string;
  description: string;
  steps: DanceStep[];
}

const DANCE_CHOREOGRAPHIES: DanceChoreography[] = [
  {
    id: 'lagne',
    name: 'लांगड़े एनेच (Lagne Dance)',
    santaliName: 'लागणे एनेच',
    formationType: 'circle',
    dancersCount: 10,
    occasion: 'अखड़ा शाम, मेला व सामान्य उत्सव',
    drums: 'तुमाक (मदाल) व तामाक (नगाड़ा)',
    defaultBpm: 92,
    attire: 'पांची-पारहाड़ साड़ी व सफेद धोती-गमछा',
    description: 'महिलाएं गोल घेरे में हाथ से हाथ जोड़कर बाईं ओर धीमी और सुंदर लय में कदम बढ़ाती हैं, जबकि बीच में वादक वाद्य बजाते हैं।',
    steps: [
      { beat: 1, footwork: 'दाहिना पैर बाईं ओर हल्का तिरछा आगे रखें', handHold: 'बगल वाली सहेली की कलाई या उंगली थामें', santaliCue: 'जोजोम जांगा लेंगा सेच' },
      { beat: 2, footwork: 'बायां पैर दाहिने के पीछे क्रॉस कर टिकाएं', handHold: 'कोहनी मोड़कर भुजाएं समतल रखें', santaliCue: 'लेंगा जांगा तायोन दोहो' },
      { beat: 3, footwork: 'पुनः बायां कदम थोड़ा आगे बढ़ाएं (हल्का झुकाव)', handHold: 'सिर थोड़ा झुकाकर आगे बढ़ें', santaliCue: 'माड़ाङ सेच झुकौ काते' },
      { beat: 4, footwork: 'दोनों एड़ियां मिलाकर 1 पल विराम (सम)', handHold: 'भुजाओं को हल्का ऊपर उठाकर लय साधें', santaliCue: 'बारो जांगा मिलाव — सम' }
    ]
  },
  {
    id: 'danta',
    name: 'दांता एनेच (Danta Stick Dance)',
    santaliName: 'डांटा एनेच',
    formationType: 'line',
    dancersCount: 8,
    occasion: 'सोहराय व दशहरा-बाहा विशेष उत्सव',
    drums: 'तामाक, तुमाक व झांझ-करताल',
    defaultBpm: 104,
    attire: 'पगड़ी (दाहुड़ी) व कमर में गमछा, हाथ में दो लकड़ी के डंडे',
    description: 'पुरुष नर्तक दो सीधी आमने-सामने की पंक्तियों में छोटे डंडे आपस में टकराते हुए वीरता और अनुशासन के साथ कदमताल करते हैं।',
    steps: [
      { beat: 1, footwork: 'दाहिना पैर मजबूती से आगे बढ़ाकर ठोकें', handHold: 'अपने दोनों डंडे दाईं ओर टकराएं', santaliCue: 'सोजे डांटा थाप (दायें)' },
      { beat: 2, footwork: 'बायां पैर उठाकर घुटने तक मोड़ें', handHold: 'सामने वाले साथी के डंडे से मिलाएं', santaliCue: 'गाते डांटा मिलाव' },
      { beat: 3, footwork: 'एक कदम पीछे हटते हुए शरीर घुमाएं', handHold: 'डंडों को सिर के ऊपर घुमाकर बजाएं', santaliCue: 'चेतान डांटा अचुर' },
      { beat: 4, footwork: 'वापस पंक्ति में सीधे खड़े होकर सम पर आएं', handHold: 'कमर स्तर पर डंडे थामकर विराम', santaliCue: 'ताला रे थिर ताहेन' }
    ]
  },
  {
    id: 'baha',
    name: 'बाहा एनेच (Baha Spring Dance)',
    santaliName: 'बाहा एनेच',
    formationType: 'semicircle',
    dancersCount: 9,
    occasion: 'बाहा परब (फाल्गुन-चैत्र जाहेर पूजा)',
    drums: 'बिना तेज़ शोर के मधुर तुमाक व तिरिओ बांसुरी',
    defaultBpm: 84,
    attire: 'जुड़े में सरजोम (साल) या इचाक् का फूल',
    description: 'प्रकृति व फूलों के सम्मान का अत्यंत पावन नृत्य। अर्ध-गोलाकार कतार में नर्तकियाँ प्रकृति को नमन करने जैसी शांत मुद्रा बनाती हैं।',
    steps: [
      { beat: 1, footwork: 'बायां पैर आगे रखकर धरती को कोमल स्पर्श', handHold: 'हथेलियां कमर के पास फूल अर्पण मुद्रा में', santaliCue: 'ओत आयो जोहार कदम' },
      { beat: 2, footwork: 'दाहिना पैर पास लाकर हल्का घुटना झुकाएं', handHold: 'कंधे से कंधा मिलाकर कतार संतुलित करें', santaliCue: 'हल्का दोबोक मुद्रा' },
      { beat: 3, footwork: 'दाहिनी ओर दो छोटे कदम झूमते हुए लें', handHold: 'दाहिना हाथ थोड़ा आगे बढ़ाकर लहराएं', santaliCue: 'बाहा हिलाव चाल' },
      { beat: 4, footwork: 'सीधे खड़े होकर सामने की ओर नम्र प्रणाम', handHold: 'जुड़े हुए हाथों से शांति विराम', santaliCue: 'सागुन बाहा विराम' }
    ]
  },
  {
    id: 'sohrai',
    name: 'सोहराय एनेच (Sohrai Harvest Dance)',
    santaliName: 'सोहराय एनेच',
    formationType: 'circle',
    dancersCount: 12,
    occasion: 'सोहराय महापर्व (गौ-वंदना व खूंटाव)',
    drums: 'तामाक, तुमाक व सींग तुरही (साकवा)',
    defaultBpm: 112,
    attire: 'रंगीन पारंपरिक वस्त्र व घुंघरू',
    description: 'फसल कटने की खुशी में पूरे कुलही (गांव की मुख्य गली) और अखड़ा में एक विशाल घेरा बनाकर तेज़ और आनंदित कदमों से किया जाने वाला नृत्य।',
    steps: [
      { beat: 1, footwork: 'दोनों पैरों से हल्की उछाल के साथ दायां कदम', handHold: 'कमरे में हाथ बांधकर गोल चक्कर मजबूत करें', santaliCue: 'रस्का उछाल (प्रथम)' },
      { beat: 2, footwork: 'बायां पैर तुरंत दाएं के पास लाकर ठोकें', handHold: 'तामाक की थाप के साथ शरीर आगे झुकाएं', santaliCue: 'तामाक थाप झुकाव' },
      { beat: 3, footwork: 'बाईं दिशा में तीव्र दोहरा कदम बढ़ाएं', handHold: 'सहेलियों के साथ एकसाथ कंधे हिलाएं', santaliCue: 'दुलौड़ चाल (दोहरा)' },
      { beat: 4, footwork: 'दाहिनी एड़ी जमीन पर मारकर विराम लें', handHold: 'सामूहिक हर्ष स्वर के साथ सम पर रुकें', santaliCue: 'सोहराय सम विराम' }
    ]
  },
  {
    id: 'dong',
    name: 'दोङ एनेच (Dong Wedding Dance)',
    santaliName: 'दोंग एनेच',
    formationType: 'semicircle',
    dancersCount: 8,
    occasion: 'विवाह (बापला) व बारात स्वागत नेग',
    drums: 'तुमाक, तामाक व शहनाई/बांसुरी',
    defaultBpm: 98,
    attire: 'हल्दी रंगे वस्त्र व पारंपरिक आभूषण',
    description: 'विवाह के समय वर-वधू पक्ष की महिलाएं आमने-सामने अर्धचंद्राकार समूह बनाकर हास्य और प्रेम भरे गीतों के साथ कदम मिलाती हैं।',
    steps: [
      { beat: 1, footwork: 'बाएं पैर से आगे बढ़ते हुए नृत्य प्रारंभ', handHold: 'पास की साथी की कमर या कंधा थामें', santaliCue: 'बापला दोङ शुरुआत' },
      { beat: 2, footwork: 'दायां पैर आगे क्रॉस कर एड़ी टिकाएं', handHold: 'आगे झुककर मधुर मुस्कान के साथ गीत गाएं', santaliCue: 'सेरेञ साथ आगे झुकाव' },
      { beat: 3, footwork: 'पीछे हटते हुए पुरानी जगह की ओर लौटें', handHold: 'कतार की गोलाई को बनाए रखें', santaliCue: 'तायोन लौट चाल' },
      { beat: 4, footwork: 'पैरों को एक साथ रखकर हल्की ताली/लय', handHold: 'अगले पद के लिए कंधा सीधा करें', santaliCue: 'दोंग सम विराम' }
    ]
  }
];

export const SantaliDanceAkhdaGuide: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('lagne');
  const [activeBeat, setActiveBeat] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(DANCE_CHOREOGRAPHIES[0].defaultBpm);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const dance = DANCE_CHOREOGRAPHIES.find((d) => d.id === selectedId) || DANCE_CHOREOGRAPHIES[0];
  const currentStep = dance.steps.find((s) => s.beat === activeBeat) || dance.steps[0];

  const playPulse = (isStrong: boolean) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isStrong ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isStrong ? 210 : 150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(48, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(isStrong ? 0.35 : 0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Audio playback blocked
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    const ms = Math.round((60 / bpm) * 1000);
    const id = setInterval(() => {
      setActiveBeat((prev) => {
        const next = (prev % dance.steps.length) + 1;
        playPulse(next === 1 || next === 3);
        return next;
      });
    }, ms);
    return () => clearInterval(id);
  }, [isPlaying, bpm, dance.steps.length, soundEnabled]);

  const handleSelectDance = (id: string) => {
    const next = DANCE_CHOREOGRAPHIES.find((d) => d.id === id);
    if (!next) return;
    setIsPlaying(false);
    setSelectedId(id);
    setBpm(next.defaultBpm);
    setActiveBeat(1);
  };

  // Compute dancer positions inside 260x260 SVG viewBox
  const dancerPositions = Array.from({ length: dance.dancersCount }).map((_, idx) => {
    const rotationShift = ((activeBeat - 1) * 14 * Math.PI) / 180;
    if (dance.formationType === 'circle') {
      const angle = (idx / dance.dancersCount) * Math.PI * 2 + rotationShift;
      return {
        x: 130 + Math.cos(angle) * 86,
        y: 130 + Math.sin(angle) * 86
      };
    }
    if (dance.formationType === 'semicircle') {
      const angle = Math.PI * 0.15 + (idx / Math.max(1, dance.dancersCount - 1)) * (Math.PI * 0.7) + rotationShift * 0.35;
      return {
        x: 130 + Math.cos(angle) * 88,
        y: 112 + Math.sin(angle) * 84
      };
    }
    // Two facing lines for Danta
    const half = Math.ceil(dance.dancersCount / 2);
    const isTopRow = idx < half;
    const col = isTopRow ? idx : idx - half;
    const stepShiftX = activeBeat % 2 === 0 ? 8 : -8;
    return {
      x: 52 + col * 52 + (isTopRow ? stepShiftX : -stepShiftX),
      y: isTopRow ? 78 : 182
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Editorial Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>अखड़ा नृत्य कला · संताली कदमताल निर्देशक</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              संताली नृत्य मुद्रा व अखड़ा फॉर्मेशन गाइड
            </h1>
            <p className="text-sm text-slate-600">
              अखड़ा के घेरे में नृत्य विन्यास, पैरों के कदम (१–४ मात्रा) और हाथ पकड़ने की पारंपरिक मुद्रा का सजीव अभ्यास।
            </p>
          </div>

          <button
            onClick={() =>
              speakWithFemaleVoice(
                `${dance.name}। अवसर: ${dance.occasion}। ${dance.description}। कदम ${currentStep.beat}: ${currentStep.footwork}`,
                { lang: 'hi-IN', rate: 0.9 }
              )
            }
            className="min-h-[44px] px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>निर्देश सुनें</span>
          </button>
        </div>

        {/* Dance Style Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-xl overflow-x-auto">
          {DANCE_CHOREOGRAPHIES.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectDance(item.id)}
              className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedId === item.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.name.split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Two-Zone Split Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Stage: Animated SVG Akhda Ring Visualizer */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>अखड़ा नृत्य विन्यास · {dance.santaliName}</span>
              <span className="font-mono tabular-nums font-bold text-amber-800">
                मात्रा {activeBeat} / {dance.steps.length}
              </span>
            </div>

            <div className="flex items-center justify-center py-2">
              <svg
                viewBox="0 0 260 260"
                className="w-64 h-64 sm:w-72 sm:h-72 select-none"
                aria-label={`${dance.name} Akhda formation`}
              >
                {/* Akhda Sacred Ring Floor */}
                <circle cx="130" cy="130" r="114" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
                <circle
                  cx="130"
                  cy="130"
                  r="86"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="1.5"
                  strokeDasharray={dance.formationType === 'circle' ? '4 4' : '2 6'}
                />

                {/* Central Drum Players (Tumak & Tamak) */}
                <g transform={`scale(${activeBeat % 2 === 1 ? 1.04 : 0.98})`} style={{ transformOrigin: '130px 130px', transition: 'transform 160ms ease-out' }}>
                  <circle cx="130" cy="130" r="24" fill="#78350F" />
                  <text x="130" y="128" textAnchor="middle" fill="#FEF3C7" fontSize="9" fontWeight="700">
                    तुमाक-तामाक
                  </text>
                  <text x="130" y="140" textAnchor="middle" fill="#FDE68A" fontSize="8">
                    अखड़ा केंद्र
                  </text>
                </g>

                {/* Dancers */}
                {dancerPositions.map((pos, idx) => {
                  const isLead = idx === 0;
                  return (
                    <g
                      key={idx}
                      style={{
                        transform: `translate(${pos.x}px, ${pos.y}px)`,
                        transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      <circle
                        cx="0"
                        cy="0"
                        r={isLead ? 12 : 9.5}
                        fill={isLead ? '#D97706' : '#0F172A'}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="8.5"
                        fontWeight="700"
                      >
                        {idx + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Cadence & Tempo Controls */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() =>
                    setActiveBeat((b) => (b === 1 ? dance.steps.length : b - 1))
                  }
                  className="min-h-[44px] min-w-[44px] px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>पिछला</span>
                </button>

                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  className={`min-h-[44px] flex-1 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white cursor-pointer transition-colors ${
                    isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'कदमताल रोकें' : 'लाइव कदमताल चलाएं'}</span>
                </button>

                <button
                  onClick={() => setActiveBeat((b) => (b % dance.steps.length) + 1)}
                  className="min-h-[44px] min-w-[44px] px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>अगला</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                  <span className="font-semibold text-slate-700 whitespace-nowrap">
                    गति: <span className="font-mono tabular-nums">{bpm} BPM</span>
                  </span>
                  <input
                    type="range"
                    min={60}
                    max={140}
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="flex-1 accent-amber-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled((s) => !s)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                      soundEnabled
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    ध्वनि: {soundEnabled ? 'चालू' : 'बंद'}
                  </button>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveBeat(1);
                      setBpm(dance.defaultBpm);
                    }}
                    className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                    title="रीसेट"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Deck: Step Breakdown & Cultural Info */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{dance.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  अवसर: {dance.occasion} · वाद्य: {dance.drums}
                </p>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                {dance.description}
              </p>

              {/* Step Sequence Cards */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-amber-700" />
                  <span>मात्रा-वार कदम व मुद्रा निर्देश (टैप करके चुनें):</span>
                </div>

                {dance.steps.map((step) => {
                  const isActive = step.beat === activeBeat;
                  return (
                    <button
                      key={step.beat}
                      onClick={() => {
                        setIsPlaying(false);
                        setActiveBeat(step.beat);
                        playPulse(step.beat === 1 || step.beat === 3);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-50 border-amber-400 text-slate-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-mono font-bold text-amber-900">
                          कदम #{step.beat} · {step.santaliCue}
                        </span>
                        {isActive && <span className="text-[11px] font-bold text-amber-700">सक्रिय</span>}
                      </div>
                      <div className="text-xs font-semibold text-slate-900 mt-1">
                        पैर: {step.footwork}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        हाथ/मुद्रा: {step.handHold}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">पारंपरिक वेशभूषा:</span> {dance.attire}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
