import React, { useState, useEffect } from 'react';
import { Bookmark, Sparkles, Volume2, Save, Trash2, Calendar, Smile } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface JournalEntry {
  id: string;
  dateStr: string;
  moodSantali: string;
  moodHindi: string;
  title: string;
  gratitudePoints: string[];
  content: string;
}

const SANTALI_MOODS = [
  { id: 'raska', santali: 'रस्का (Raska)', hindi: 'आनन्दित / हर्षित', icon: '🌟' },
  { id: 'kurumutu', santali: 'कुरुमुटु (Kurumutu)', hindi: 'परिश्रमी / कर्मठ', icon: '🌾' },
  { id: 'shanti', santali: 'शांति (Shanti)', hindi: 'प्रशांत व स्थिर', icon: '🕊️' },
  { id: 'churuk', santali: 'चुरुक (Churuk)', hindi: 'ऊर्जावान / सक्रिय', icon: '⚡' },
  { id: 'seba', santali: 'सेबा (Seba)', hindi: 'सेवाभावी व समर्पित', icon: '🤝' },
  { id: 'duk', santali: 'दुक (Duk)', hindi: 'चिंतित या थका हुआ', icon: '🌧️' }
];

const DAILY_PROMPTS = [
  {
    santaliPrompt: 'तेहेञ आम जाहेर थान, दारे-नाड़ी बाङ प्रकृति रे चेत् सुंदरताम ञेल केदा?',
    hindiPrompt: 'आज आपने पेड़ों, प्रकृति या अपने गाँव में क्या सुंदरता देखी?'
  },
  {
    santaliPrompt: 'तेहेञाः कामी रे आमाः मोने रे चेत् लेकान रस्का हेच एना?',
    hindiPrompt: 'आज के काम में आपके मन में कौन-सा संतोष या खुशी आई?'
  },
  {
    santaliPrompt: 'ओकोय गाते बाङ परिवार सदस्य आम-ए साहाज्य केत् मेया?',
    hindiPrompt: 'आज किस मित्र या परिजन ने आपका सहयोग किया?'
  },
  {
    santaliPrompt: 'संताली भाषा रे गापा ला़गित् आम चेत् नोवा काथा सेड़ा सानयेत् मेया?',
    hindiPrompt: 'संताली भाषा में कल के लिए आप कौन-सी नई बात सीखना चाहते हैं?'
  }
];

export const SantaliMicroJournal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('hor_katha_journal_entries');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedMood, setSelectedMood] = useState(SANTALI_MOODS[0]);
  const [title, setTitle] = useState('');
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [content, setContent] = useState('');
  const [saveAlert, setSaveAlert] = useState(false);

  // Rotating prompt
  const todayPrompt = DAILY_PROMPTS[new Date().getDate() % DAILY_PROMPTS.length];

  const handleSaveEntry = () => {
    if (!title.trim() && !content.trim()) return;

    const newEntry: JournalEntry = {
      id: `j_${Date.now()}`,
      dateStr: new Date().toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      moodSantali: selectedMood.santali,
      moodHindi: selectedMood.hindi,
      title: title.trim() || 'संताली दैनिक विचार',
      gratitudePoints: [gratitude1.trim(), gratitude2.trim()].filter(Boolean),
      content: content.trim()
    };

    const nextEntries = [newEntry, ...entries];
    setEntries(nextEntries);
    try {
      localStorage.setItem('hor_katha_journal_entries', JSON.stringify(nextEntries));
    } catch {
      // ignore
    }

    setTitle('');
    setGratitude1('');
    setGratitude2('');
    setContent('');
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 2000);
  };

  const handleDeleteEntry = (id: string) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    try {
      localStorage.setItem('hor_katha_journal_entries', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-800">
              <Bookmark className="w-4 h-4" />
              <span>आत्म-चिंतन व सकारात्मक डायरी | Daily Reflection Micro-Journal</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              दैनिक संताली डायरी व विचार प्रेरक
            </h1>
            <p className="text-sm text-slate-600">
              संताली भाव-दशा (रस्का/कुरुमुटु/शांति), दैनिक आभार और मन के विचार अपनी भाषा में दर्ज करें।
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs text-slate-500">कुल सहेजी गई प्रविष्टियाँ</div>
            <div className="text-xl font-mono tabular-nums font-bold text-purple-900">
              {entries.length}
            </div>
          </div>
        </div>

        {/* Daily Inspiring Thought Prompt Card */}
        <div className="bg-gradient-to-r from-purple-50 via-amber-50 to-purple-50 border border-purple-200/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-purple-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>आज का प्रेरक संताली प्रश्न (Prompt of the Day):</span>
            </span>
            <button
              onClick={() =>
                speakWithFemaleVoice(
                  `${todayPrompt.santaliPrompt}। ${todayPrompt.hindiPrompt}`,
                  { lang: 'hi-IN', rate: 0.88 }
                )
              }
              className="text-purple-800 hover:text-purple-950 flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>सुनें</span>
            </button>
          </div>
          <div className="text-base font-bold text-slate-900 leading-snug">
            "{todayPrompt.santaliPrompt}"
          </div>
          <div className="text-xs text-slate-600 italic">
            भावार्थ: {todayPrompt.hindiPrompt}
          </div>
        </div>

        {/* Entry Creator Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              आज आपका मन कैसा है? (संताली भाव-दशा चुनें):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {SANTALI_MOODS.map((m) => {
                const isSelected = selectedMood.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="text-lg">{m.icon}</div>
                    <div className="text-xs font-bold text-slate-900 mt-1">{m.santali}</div>
                    <div className="text-[10px] text-slate-500">{m.hindi}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">डायरी शीर्षक (Title):</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदा. हातु सेरेंग आर खेत रे दाका जोम..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Gratitude Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                १. आज किस बात के लिए प्रकृति या समाज के प्रति आभारी हैं:
              </label>
              <input
                type="text"
                value={gratitude1}
                onChange={(e) => setGratitude1(e.target.value)}
                placeholder="उदा. साल दारे बुटा रे शीतल हवा..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                २. आज का कोई सुखद क्षण या संताली शब्द:
              </label>
              <input
                type="text"
                value={gratitude2}
                onChange={(e) => setGratitude2(e.target.value)}
                placeholder="उदा. आयो-बाबा सोंगे हाट सेनोक्..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              आज के विचार व संस्मरण (Reflections in Santali or Devanagari):
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="तेहेञ दो आ़डी भोगे दिन ताहेकाना..."
              className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleSaveEntry}
              disabled={!title.trim() && !content.trim()}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4 text-purple-300" />
              <span>डायरी में सहेजें (Save Entry)</span>
            </button>

            {saveAlert && (
              <span className="text-xs font-bold text-emerald-700">
                ✓ प्रविष्टि सफलतापूर्वक सहेजी गई!
              </span>
            )}
          </div>
        </div>

        {/* Saved Entries List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            पिछली डायरी प्रविष्टियाँ ({entries.length})
          </h2>

          {entries.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-xs text-slate-500">
              अभी कोई डायरी प्रविष्टि नहीं है। ऊपर दिए गए फॉर्म से आज की पहली प्रविष्टि सहेजें।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entries.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.dateStr}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-900 font-bold border border-purple-200">
                        {item.moodSantali}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>

                    {item.gratitudePoints.length > 0 && (
                      <div className="p-2.5 bg-amber-50/60 border border-amber-200/60 rounded-xl space-y-1 text-xs">
                        <span className="font-bold text-amber-900">आभार (Gratitude):</span>
                        <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                          {item.gratitudePoints.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.content && (
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {item.content}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() =>
                        speakWithFemaleVoice(
                          `${item.title}। भाव-दशा: ${item.moodSantali}। ${item.content}`,
                          { lang: 'hi-IN', rate: 0.9 }
                        )
                      }
                      className="text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>वाचन सुनें</span>
                    </button>

                    <button
                      onClick={() => handleDeleteEntry(item.id)}
                      className="text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>हटाएँ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
