import React, { useState, useRef, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useUserAuth } from '../context/UserAuthContext';
import { speakWithFemaleVoice } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  Mic,
  Square,
  Volume2,
  ThumbsUp,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Plus,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

interface SantaliCommunityBoardProps {
  onOpenUserAuth?: () => void;
}

const REGIONS = [
  'सभी क्षेत्र',
  'संताल परगना (Dumka / Jharkhand)',
  'कोल्हान (Singhbhum / Jharkhand)',
  'मयूरभंज / क्योंझर (Odisha)',
  'बांकुड़ा / पुरुलिया (West Bengal)',
  'असम चाय बागान क्षेत्र (Assam)'
];

const CURATED_SAMPLE_VOICES = [
  {
    id: 'sample_vn_1',
    wordDevanagari: 'जोहार गोमके',
    wordRoman: 'Johar Gomke',
    olChiki: 'ᱡᱚᱦᱟᱨ ᱜᱚᱢᱠᱮ',
    meaningHindi: 'आदरणीय महोदय / सम्मानजनक अभिवादन',
    regionDialect: 'संताल परगना (Dumka / Jharkhand)',
    phoneticTip: 'दुमका बोली में "गोमके" का उच्चारण कोमल और मध्यम स्वर में होता है।',
    submittedByName: 'संपादकीय संग्रह',
    upvotes: 24,
    status: 'approved' as const
  },
  {
    id: 'sample_vn_2',
    wordDevanagari: 'चेत् लेका मेनाक् मेया?',
    wordRoman: 'Chet leka menah meya?',
    olChiki: 'ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱜ ᱢᱮᱭᱟ?',
    meaningHindi: 'आप कैसे हैं? (हाल-चाल पूछना)',
    regionDialect: 'मयूरभंज / क्योंझर (Odisha)',
    phoneticTip: 'ओडिशा संताली में अंत का "-क्" हल्का रुद्ध कंठ रुकता है।',
    submittedByName: 'संपादकीय संग्रह',
    upvotes: 19,
    status: 'approved' as const
  }
];

const CURATED_SAMPLE_EVENTS = [
  {
    id: 'sample_ev_1',
    title: 'आखड़ा बाहा व पारंपरिक मांदर-तामाक मिलन',
    eventType: 'बाहा पर्व / सांस्कृतिक कार्यक्रम',
    eventDate: '2026-03-18',
    villageDistrict: 'दुमका — संताल परगना',
    regionDialect: 'संताल परगना (Dumka / Jharkhand)',
    description: 'जाहेर थान में पारंपरिक सखुआ फूल पूजा, सामूहिक दोंग सेरेञ और युवाओं के लिए ओल चिकी कार्यशाला।',
    organizerName: 'ग्राम मांझी समिति',
    status: 'approved' as const
  },
  {
    id: 'sample_ev_2',
    title: 'भोगनाडीह हूल स्मृति व भाषा संगोष्ठी',
    eventType: 'हूल स्मृति सभा',
    eventDate: '2026-06-30',
    villageDistrict: 'भोगनाडीह, साहिबगंज',
    regionDialect: 'संताल परगना (Dumka / Jharkhand)',
    description: 'सिदो-कान्हू, चांद-भैरव और फूलो-झानो को श्रद्धांजलि एवं संताली साहित्य पुस्तक प्रदर्शनी।',
    organizerName: 'क्षेत्रीय परगनैत मंच',
    status: 'approved' as const
  }
];

export const SantaliCommunityBoard: React.FC<SantaliCommunityBoardProps> = ({
  onOpenUserAuth
}) => {
  const {
    isAdmin,
    communityVoiceNotes,
    villageEvents,
    refreshCommunityBoard,
    submitCommunityVoiceNote,
    upvoteVoiceNote,
    submitVillageEvent
  } = useAdmin();
  const { currentUser, isLoggedIn } = useUserAuth();

  const [activeSubTab, setActiveSubTab] = useState<'voices' | 'events'>('voices');
  const [regionFilter, setRegionFilter] = useState('सभी क्षेत्र');

  // Voice Note Form & MediaRecorder
  const [vnWordDev, setVnWordDev] = useState('');
  const [vnWordRom, setVnWordRom] = useState('');
  const [vnMeaning, setVnMeaning] = useState('');
  const [vnTip, setVnTip] = useState('');
  const [vnRegion, setVnRegion] = useState(
    currentUser?.villageRegion || 'संताल परगना (Dumka / Jharkhand)'
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState('');
  const [recordError, setRecordError] = useState<string | null>(null);
  const [vnSubmitMsg, setVnSubmitMsg] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Event Notice Form
  const [evTitle, setEvTitle] = useState('');
  const [evType, setEvType] = useState('पर्व / सांस्कृतिक कार्यक्रम');
  const [evDate, setEvDate] = useState('');
  const [evLocation, setEvLocation] = useState('');
  const [evRegion, setEvRegion] = useState(
    currentUser?.villageRegion || 'संताल परगना (Dumka / Jharkhand)'
  );
  const [evDesc, setEvDesc] = useState('');
  const [evSubmitMsg, setEvSubmitMsg] = useState<string | null>(null);

  const visibleVoices = useMemo(() => {
    const approvedUser = communityVoiceNotes.filter(
      (v) =>
        v.status === 'approved' ||
        isAdmin ||
        (currentUser && v.submittedByEmail === currentUser.email)
    );
    const merged = [...approvedUser, ...CURATED_SAMPLE_VOICES];
    if (regionFilter === 'सभी क्षेत्र') return merged;
    return merged.filter((v) => v.regionDialect === regionFilter);
  }, [communityVoiceNotes, isAdmin, currentUser, regionFilter]);

  const visibleEvents = useMemo(() => {
    const approvedEvents = villageEvents.filter(
      (e) =>
        e.status === 'approved' ||
        isAdmin ||
        (currentUser && e.submittedByEmail === currentUser.email)
    );
    const merged = [...approvedEvents, ...CURATED_SAMPLE_EVENTS];
    if (regionFilter === 'सभी क्षेत्र') return merged;
    return merged.filter((e) => e.regionDialect === regionFilter);
  }, [villageEvents, isAdmin, currentUser, regionFilter]);

  const startMicRecording = async () => {
    setRecordError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecordError('इस ब्राउज़र में माइक्रोफोन रिकॉर्डिंग समर्थित नहीं है। आप बिना ऑडियो के उच्चारण टिप भेज सकते हैं।');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setRecordedAudioUrl(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setRecordError('माइक्रोफोन की अनुमति नहीं मिली। कृपया ब्राउज़र से माइक अनुमति दें।');
    }
  };

  const stopMicRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmitVoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !currentUser) {
      onOpenUserAuth?.();
      return;
    }
    const res = await submitCommunityVoiceNote({
      wordDevanagari: vnWordDev,
      wordRoman: vnWordRom || vnWordDev,
      olChiki: toOlChikiAuto(vnWordDev || vnWordRom),
      meaningHindi: vnMeaning,
      regionDialect: vnRegion,
      audioDataUrl: recordedAudioUrl,
      phoneticTip: vnTip,
      submittedByEmail: currentUser.email,
      submittedByName: currentUser.displayName
    });
    setVnSubmitMsg(res.message);
    if (res.success) {
      setVnWordDev('');
      setVnWordRom('');
      setVnMeaning('');
      setVnTip('');
      setRecordedAudioUrl('');
    }
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !currentUser) {
      onOpenUserAuth?.();
      return;
    }
    const res = await submitVillageEvent({
      title: evTitle,
      eventType: evType,
      eventDate: evDate,
      villageDistrict: evLocation,
      regionDialect: evRegion,
      description: evDesc,
      organizerName: currentUser.displayName,
      submittedByEmail: currentUser.email
    });
    setEvSubmitMsg(res.message);
    if (res.success) {
      setEvTitle('');
      setEvDate('');
      setEvLocation('');
      setEvDesc('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>सामुदायिक सहभागिता</span>
              <span aria-hidden="true">·</span>
              <span>Admin अनुमोदन द्वारा नियंत्रित</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              सामुदायिक बोली ऑडियो बैंक व ग्राम पर्व नोटिस बोर्ड
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              मातृभाषी साथियों द्वारा रिकॉर्ड किए गए क्षेत्रीय उच्चारण सुनें, पसंदीदा बोली को Upvote करें और अपने गाँव/इलाके के सोहराय, बाहा या ग्राम सभा कार्यक्रमों की सूचना साझा करें।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => refreshCommunityBoard()}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ताज़ा करें</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs & Region Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveSubTab('voices')}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                activeSubTab === 'voices'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              क्षेत्रीय बोली ऑडियो बैंक ({visibleVoices.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('events')}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                activeSubTab === 'events'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ग्राम पर्व व मेला नोटिस बोर्ड ({visibleEvents.length})
            </button>
          </div>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab 1: Community Voice Bank */}
      {activeSubTab === 'voices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Submission Form (5 cols) */}
          <form
            onSubmit={handleSubmitVoice}
            className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
          >
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-700" />
                <span>अपनी बोली में उच्चारण भेजें</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin स्वीकृति के बाद यह ऑडियो सभी सीखने वालों को दिखेगा।
              </p>
            </div>

            {!isLoggedIn && (
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between gap-2 text-xs text-sky-950">
                <span>ऑडियो योगदान भेजने के लिए Google / Email लॉगिन करें।</span>
                {onOpenUserAuth && (
                  <button
                    type="button"
                    onClick={onOpenUserAuth}
                    className="px-3 py-1.5 rounded-lg bg-sky-700 text-white font-bold whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    लॉगिन करें
                  </button>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">संताली शब्द (देवनागरी)</label>
                <input
                  type="text"
                  value={vnWordDev}
                  onChange={(e) => setVnWordDev(e.target.value)}
                  placeholder="जैसे: सेताक् जोहार"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">रोमन वर्तनी (Roman)</label>
                <input
                  type="text"
                  value={vnWordRom}
                  onChange={(e) => setVnWordRom(e.target.value)}
                  placeholder="Setak Johar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-bold text-slate-700 block mb-1">हिन्दी अर्थ *</label>
              <input
                type="text"
                value={vnMeaning}
                onChange={(e) => setVnMeaning(e.target.value)}
                placeholder="सुबह का नमस्कार"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                required
              />
            </div>

            <div className="text-xs">
              <label className="font-bold text-slate-700 block mb-1">क्षेत्रीय बोली (Region)</label>
              <select
                value={vnRegion}
                onChange={(e) => setVnRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold"
              >
                {REGIONS.filter((r) => r !== 'सभी क्षेत्र').map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs">
              <label className="font-bold text-slate-700 block mb-1">उच्चारण टिप (वैकल्पिक)</label>
              <input
                type="text"
                value={vnTip}
                onChange={(e) => setVnTip(e.target.value)}
                placeholder="उदा. अंत में हल्का ठहराव..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>

            {/* Real Mic Recorder */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800">माइक्रोफोन से उच्चारण रिकॉर्ड करें</span>
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startMicRecording}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>रिकॉर्ड शुरू</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopMicRecording}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>रोकें</span>
                  </button>
                )}
              </div>
              {recordError && <p className="text-xs text-rose-700 font-medium">{recordError}</p>}
              {recordedAudioUrl && (
                <audio controls src={recordedAudioUrl} className="w-full h-9" />
              )}
            </div>

            {vnSubmitMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{vnSubmitMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>समीक्षा के लिए भेजें</span>
            </button>
          </form>

          {/* Voice Bank Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {visibleVoices.map((vn: any) => (
              <div
                key={vn.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{vn.regionDialect}</span>
                      <span aria-hidden="true">·</span>
                      <span>{vn.submittedByName}</span>
                      {vn.status === 'pending' && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-700 font-bold">Admin समीक्षा लंबित</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-1">
                      {vn.wordDevanagari}{' '}
                      <span className="text-sm font-semibold text-amber-800">
                        ({vn.olChiki || toOlChikiAuto(vn.wordDevanagari)})
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {vn.wordRoman} — <strong>{vn.meaningHindi}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        speakWithFemaleVoice(vn.wordDevanagari, { autoDetectLanguage: true })
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>TTS</span>
                    </button>
                    {!String(vn.id).startsWith('sample_') && (
                      <button
                        type="button"
                        onClick={() => upvoteVoiceNote(vn.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1 tabular-nums cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{vn.upvotes || 1}</span>
                      </button>
                    )}
                  </div>
                </div>

                {vn.phoneticTip && (
                  <p className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    {vn.phoneticTip}
                  </p>
                )}

                {vn.audioDataUrl && (
                  <audio controls src={vn.audioDataUrl} className="w-full h-9" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Village Event Noticeboard */}
      {activeSubTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Submit Event Form (5 cols) */}
          <form
            onSubmit={handleSubmitEvent}
            className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
          >
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>गाँव का पर्व / कार्यक्रम जोड़ें</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin सत्यापन के बाद यह सूचना नोटिस बोर्ड पर प्रकाशित होगी।
              </p>
            </div>

            {!isLoggedIn && (
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between gap-2 text-xs text-sky-950">
                <span>कार्यक्रम सूचना जोड़ने के लिए साइन-इन करें।</span>
                {onOpenUserAuth && (
                  <button
                    type="button"
                    onClick={onOpenUserAuth}
                    className="px-3 py-1.5 rounded-lg bg-sky-700 text-white font-bold whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    लॉगिन करें
                  </button>
                )}
              </div>
            )}

            <div className="text-xs space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">कार्यक्रम का नाम *</label>
                <input
                  type="text"
                  value={evTitle}
                  onChange={(e) => setEvTitle(e.target.value)}
                  placeholder="जैसे: सामूहिक सोहराय अखड़ा व नृत्य प्रतियोगिता"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">प्रकार</label>
                  <select
                    value={evType}
                    onChange={(e) => setEvType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  >
                    <option>पर्व / सांस्कृतिक कार्यक्रम</option>
                    <option>बाहा / सोहराय / करम</option>
                    <option>ग्राम सभा / मांझी बैठक</option>
                    <option>ओल चिकी कार्यशाला / शिक्षा</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">तिथि *</label>
                  <input
                    type="date"
                    value={evDate}
                    onChange={(e) => setEvDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">गाँव / प्रखंड / जिला *</label>
                <input
                  type="text"
                  value={evLocation}
                  onChange={(e) => setEvLocation(e.target.value)}
                  placeholder="जैसे: जामा प्रखंड, दुमका"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">क्षेत्र</label>
                <select
                  value={evRegion}
                  onChange={(e) => setEvRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                >
                  {REGIONS.filter((r) => r !== 'सभी क्षेत्र').map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">संक्षिप्त विवरण</label>
                <textarea
                  value={evDesc}
                  onChange={(e) => setEvDesc(e.target.value)}
                  rows={3}
                  placeholder="समय, मुख्य अतिथि व कार्यक्रम रूपरेखा..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>
            </div>

            {evSubmitMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{evSubmitMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Admin स्वीकृति के लिए भेजें</span>
            </button>
          </form>

          {/* Events Feed (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {visibleEvents.map((ev: any) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-800">{ev.eventType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono font-bold text-slate-700">{ev.eventDate}</span>
                    {ev.status === 'pending' && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-700 font-bold">लंबित</span>
                      </>
                    )}
                  </div>
                  <span className="text-slate-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {ev.organizerName}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900">{ev.title}</h3>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{ev.villageDistrict}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">{ev.regionDialect}</span>
                </div>

                {ev.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ev.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
