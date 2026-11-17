import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, Trash2, Volume2, Copy, Check } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface PinnedNote {
  id: string;
  santali: string;
  meaning: string;
  tag: string;
}

const DEFAULT_NOTES: PinnedNote[] = [
  { id: 'n1', santali: 'जोहार गाते (Johar Gate)', meaning: 'नमस्ते मित्र', tag: 'अभिवादन' },
  { id: 'n2', santali: 'सगुन सेताः (Sagun Setaḥ)', meaning: 'सुप्रभात (शुभ प्रातः)', tag: 'दैनिक' },
  { id: 'n3', santali: 'दाः एम आञ मे (Daḥ em añ me)', meaning: 'कृपया मुझे पानी दीजिए', tag: 'वाक्य' }
];

export const SantaliWordPinboard: React.FC = () => {
  const [notes, setNotes] = useState<PinnedNote[]>(() => {
    try {
      const saved = localStorage.getItem('hor_katha_word_pinboard');
      return saved ? JSON.parse(saved) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  });

  const [santaliInput, setSantaliInput] = useState('');
  const [meaningInput, setMeaningInput] = useState('');
  const [tagInput, setTagInput] = useState('मेरा शब्द');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('hor_katha_word_pinboard', JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!santaliInput.trim()) return;
    const newNote: PinnedNote = {
      id: `note_${Date.now()}`,
      santali: santaliInput.trim(),
      meaning: meaningInput.trim() || 'अर्थ जोड़ें',
      tag: tagInput.trim() || 'नोट'
    };
    setNotes([newNote, ...notes]);
    setSantaliInput('');
    setMeaningInput('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-5xl mx-auto mb-6 bg-gradient-to-r from-amber-50 via-white to-stone-50 border border-amber-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-amber-700 text-xs tracking-wider uppercase font-semibold mb-1">
          <Bookmark className="w-4 h-4" />
          <span>त्वरित शब्द पिन-बोर्ड | Santali Quick Word Pinboard</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
          संताली त्वरित शब्द व वाक्य पिन-बोर्ड (Sticky Notes)
        </h1>
        <p className="text-stone-700 text-sm mt-1">
          पढ़ाई के समय सीखे गए नए संताली शब्द, कहावतें और वाक्य तुरंत यहाँ सेव करें और एक क्लिक में सुनें।
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        <form onSubmit={handleAdd} className="bg-white border border-stone-200 p-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            value={santaliInput}
            onChange={e => setSantaliInput(e.target.value)}
            placeholder="संताली शब्द / वाक्य लिखें..."
            className="sm:col-span-5 bg-stone-50 border border-stone-200 px-3 py-2 text-sm text-amber-950"
          />
          <input
            type="text"
            value={meaningInput}
            onChange={e => setMeaningInput(e.target.value)}
            placeholder="हिन्दी अर्थ..."
            className="sm:col-span-4 bg-stone-50 border border-stone-200 px-3 py-2 text-sm text-stone-900"
          />
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            placeholder="टैग"
            className="sm:col-span-2 bg-stone-50 border border-stone-200 px-3 py-2 text-xs text-amber-700"
          />
          <button
            type="submit"
            className="sm:col-span-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center p-2 border border-amber-400"
            title="जोड़ें"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <div key={note.id} className="bg-white border border-amber-200 p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="inline-block text-[10px] uppercase font-bold bg-stone-50 border border-stone-200 px-2 py-0.5 text-amber-700 mb-2">
                  {note.tag}
                </span>
                <h3 className="text-base font-bold text-amber-950">{note.santali}</h3>
                <p className="text-xs text-stone-700 mt-1">{note.meaning}</p>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-stone-200 pt-2">
                <button
                  onClick={() => speakWithFemaleVoice(`${note.santali}। अर्थ: ${note.meaning}`, { lang: 'hi-IN' })}
                  className="p-1.5 text-amber-700 hover:text-amber-800 bg-stone-50 border border-stone-200"
                  title="सुनें"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleCopy(note.id, `${note.santali} - ${note.meaning}`)}
                  className="p-1.5 text-sky-700 hover:text-sky-800 bg-stone-50 border border-stone-200"
                  title="कॉपी करें"
                >
                  {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setNotes(prev => prev.filter(n => n.id !== note.id))}
                  className="p-1.5 text-rose-700 hover:text-rose-800 bg-stone-50 border border-stone-200"
                  title="हटाएं"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
