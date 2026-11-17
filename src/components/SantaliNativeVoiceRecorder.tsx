import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Play,
  Trash2,
  Download,
  Volume2,
  UserCheck,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { speakWithFemaleVoice } from '../utils/speech';

interface VoiceClipRecord {
  id: string;
  wordDevanagari: string;
  wordRoman: string;
  meaningHindi: string;
  speakerName: string;
  villageRegion: string;
  durationSec: number;
  createdAt: string;
  mimeType: string;
  blob: Blob;
}

const DB_NAME = 'HorKathaVoiceBankDB';
const STORE_NAME = 'recordings';

function openVoiceDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getAllClips(): Promise<VoiceClipRecord[]> {
  try {
    const db = await openVoiceDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result || []).reverse());
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

async function saveClip(record: VoiceClipRecord): Promise<void> {
  const db = await openVoiceDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function deleteClipById(id: string): Promise<void> {
  const db = await openVoiceDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export const SantaliNativeVoiceRecorder: React.FC = () => {
  const { words } = useAdmin();
  const [wordDevanagari, setWordDevanagari] = useState('जोहार गोमके');
  const [wordRoman, setWordRoman] = useState('Johar gomke');
  const [meaningHindi, setMeaningHindi] = useState('सादर नमस्कार / अभिवादन');
  const [speakerName, setSpeakerName] = useState('गाँव बुज़ुर्ग / पारिवारिक आवाज़');
  const [villageRegion, setVillageRegion] = useState('दुमका / संताल परगना');

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSec, setRecordingSec] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [clips, setClips] = useState<VoiceClipRecord[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recSecRef = useRef<number>(0);

  useEffect(() => {
    getAllClips().then(setClips);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleSelectDictionaryWord = (wordId: string) => {
    const found = words.find((w) => w.id === wordId);
    if (!found) return;
    setWordDevanagari(found.wordDevanagari);
    setWordRoman(found.wordRoman);
    setMeaningHindi(found.meaningHindi);
  };

  const startRecording = async () => {
    setMicError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError('इस ब्राउज़र या डिवाइस पर माइक्रोफोन रिकॉर्डिंग समर्थित नहीं है।');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recSecRef.current = 0;
      setRecordingSec(0);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const newRecord: VoiceClipRecord = {
          id: `voice_${Date.now()}`,
          wordDevanagari: wordDevanagari.trim() || 'संताली शब्द',
          wordRoman: wordRoman.trim() || 'Santali',
          meaningHindi: meaningHindi.trim() || 'अर्थ',
          speakerName: speakerName.trim() || 'स्थानीय वक्ता',
          villageRegion: villageRegion.trim() || 'झारखंड',
          durationSec: Math.max(1, recSecRef.current),
          createdAt: new Date().toLocaleDateString('hi-IN'),
          mimeType,
          blob
        };
        await saveClip(newRecord);
        const all = await getAllClips();
        setClips(all);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
      };

      recorder.start();
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        recSecRef.current += 1;
        setRecordingSec(recSecRef.current);
        if (recSecRef.current >= 60) {
          stopRecording();
        }
      }, 1000);
    } catch {
      setMicError('माइक्रोफोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग से माइक्रोफोन Allow करें।');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const playClip = (clip: VoiceClipRecord) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const url = URL.createObjectURL(clip.blob);
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingId(clip.id);
    audio.onended = () => {
      setPlayingId(null);
      URL.revokeObjectURL(url);
    };
    audio.play().catch(() => setPlayingId(null));
  };

  const downloadClip = (clip: VoiceClipRecord) => {
    const url = URL.createObjectURL(clip.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clip.wordRoman.replace(/[^a-zA-Z0-9_-]/g, '_')}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const removeClip = async (id: string) => {
    await deleteClipById(id);
    const all = await getAllClips();
    setClips(all);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-24">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <header className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
            <Mic className="w-4 h-4" />
            <span>स्थानीय व बुज़ुर्ग आवाज़ संरक्षण (Offline Voice Bank)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Native Voice Recorder — अपनी या बुज़ुर्गों की असली आवाज़ रिकॉर्ड करें
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            डिजिटल आवाज़ के साथ-साथ गाँव के बुज़ुर्गों, लोकगायकों या अपनी शुद्ध संताली उच्चारण को ऑफलाइन ब्राउज़र डेटाबेस में सुरक्षित सहेजें।
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Recorder Studio */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-700" />
                <span>नया उच्चारण रिकॉर्ड करें</span>
              </h2>
              <button
                onClick={() =>
                  speakWithFemaleVoice(wordRoman, {
                    readingLangMode: 'santali_roman',
                    autoDetectLanguage: true
                  })
                }
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                <span>AI संदर्भ सुनें</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">शब्दकोश से त्वरित शब्द चुनें (वैकल्पिक):</label>
              <select
                onChange={(e) => handleSelectDictionaryWord(e.target.value)}
                defaultValue=""
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium"
              >
                <option value="" disabled>-- शब्द चुनें --</option>
                {words.slice(0, 60).map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.wordDevanagari} ({w.wordRoman}) — {w.meaningHindi}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">संताली (देवनागरी):</label>
                <input
                  type="text"
                  value={wordDevanagari}
                  onChange={(e) => setWordDevanagari(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Santali Roman:</label>
                <input
                  type="text"
                  value={wordRoman}
                  onChange={(e) => setWordRoman(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">हिन्दी अर्थ / वाक्य:</label>
                <input
                  type="text"
                  value={meaningHindi}
                  onChange={(e) => setMeaningHindi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">वक्ता का नाम:</label>
                <input
                  type="text"
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">गाँव / बोली क्षेत्र:</label>
                <input
                  type="text"
                  value={villageRegion}
                  onChange={(e) => setVillageRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900"
                />
              </div>
            </div>

            {micError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{micError}</span>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  {isRecording ? 'रिकॉर्डिंग चालू है... साफ बोलें' : 'रिकॉर्डिंग के लिए तैयार'}
                </div>
                <div className="text-lg font-mono tabular-nums font-black text-amber-800">
                  00:{String(recordingSec).padStart(2, '0')} / 01:00
                </div>
              </div>

              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>रिकॉर्ड शुरू करें</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>रोकें व सेव करें</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Saved Offline Audio Bank */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>सहेजी गई आवाज़ें ({clips.length})</span>
              </h2>
              <span className="text-[11px] text-slate-500">ऑफलाइन IndexedDB में सुरक्षित</span>
            </div>

            {clips.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                अभी कोई स्थानीय आवाज़ रिकॉर्ड नहीं की गई है। बाईं ओर से अपना पहला उच्चारण रिकॉर्ड करें।
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {clips.map((clip) => (
                  <div
                    key={clip.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-900 truncate">
                        {clip.wordDevanagari}{' '}
                        <span className="text-xs font-mono text-slate-500">({clip.wordRoman})</span>
                      </div>
                      <div className="text-xs text-slate-600 truncate">{clip.meaningHindi}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono tabular-nums">
                        {clip.speakerName} · {clip.villageRegion} · {clip.durationSec}s · {clip.createdAt}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => playClip(clip)}
                        className={`p-2 rounded-lg border text-xs font-bold cursor-pointer ${
                          playingId === clip.id
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-emerald-50'
                        }`}
                        title="चलाएं"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => downloadClip(clip)}
                        className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                        title="ऑडियो डाउनलोड करें"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeClip(clip.id)}
                        className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 text-rose-600 cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
