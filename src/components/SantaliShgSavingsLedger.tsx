import React, { useState, useEffect, useMemo } from 'react';
import { speakWithFemaleVoice, stopSpeaking } from '../utils/speech';
import { toOlChikiAuto } from '../utils/olChikiTranslit';
import { useUserAuth } from '../context/UserAuthContext';
import { Users, Volume2, Square, Plus, Trash2, Printer } from 'lucide-react';

interface ShgMember {
  id: string;
  name: string;
  weeklySaving: number;
  activeLoan: number;
  paidThisWeek: boolean;
}

const DEFAULT_MEMBERS: ShgMember[] = [
  { id: 'm1', name: 'फूलो मुर्मू (अध्यक्षा)', weeklySaving: 500, activeLoan: 2000, paidThisWeek: true },
  { id: 'm2', name: 'बहामनी सोरेन (कोषाध्यक्षा)', weeklySaving: 500, activeLoan: 0, paidThisWeek: true },
  { id: 'm3', name: 'सुमित्रा हांसदा', weeklySaving: 450, activeLoan: 1500, paidThisWeek: false },
  { id: 'm4', name: 'लक्ष्मी टुडू', weeklySaving: 500, activeLoan: 0, paidThisWeek: true }
];

export const SantaliShgSavingsLedger: React.FC = () => {
  const { currentUser } = useUserAuth();
  const storageKey = `hor_katha_shg_ledger_${currentUser?.email || 'guest'}`;

  const [groupName, setGroupName] = useState('जाहेर आयो सखी मंडल (SHG)');
  const [members, setMembers] = useState<ShgMember[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : DEFAULT_MEMBERS;
    } catch {
      return DEFAULT_MEMBERS;
    }
  });
  const [newName, setNewName] = useState('');
  const [newSaving, setNewSaving] = useState('100');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setMembers(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, [storageKey]);

  const persist = (next: ShgMember[]) => {
    setMembers(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const totals = useMemo(() => {
    const totalSaved = members.reduce((s, m) => s + m.weeklySaving, 0);
    const totalLoan = members.reduce((s, m) => s + m.activeLoan, 0);
    const presentCount = members.filter((m) => m.paidThisWeek).length;
    return { totalSaved, totalLoan, presentCount };
  }, [members]);

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    persist([
      ...members,
      {
        id: `shg_${Date.now()}`,
        name: newName.trim(),
        weeklySaving: Math.max(0, Number(newSaving) || 0),
        activeLoan: 0,
        paidThisWeek: true
      }
    ]);
    setNewName('');
  };

  const speakSummary = () => {
    const msg = `जोहार दीदी को! ${groupName} रे तेहेंञ ${totals.presentCount} होड़ हाजिर मेनाक्-आ। मोट संचय ${totals.totalSaved} टाका आर बाकी ऋण ${totals.totalLoan} टाका मेनाक्-आ।`;
    speakWithFemaleVoice(msg, { autoDetectLanguage: true });
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>सखी मंडल (SHG) बचत व ऋण बही</span>
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-0.5">{groupName}</h2>
          <p className="text-xs text-slate-600">{toOlChikiAuto(groupName)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={speakSummary}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>बैठक हिसाब सुनें</span>
          </button>
          <button
            type="button"
            onClick={stopSpeaking}
            className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 tabular-nums">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <span className="text-xs font-bold text-slate-500">इस सप्ताह उपस्थित दीदी</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {totals.presentCount} / {members.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 p-4">
          <span className="text-xs font-bold text-emerald-800">समूह कुल बचत (जामा टाका)</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">₹{totals.totalSaved}</p>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200 p-4">
          <span className="text-xs font-bold text-amber-800">कुल बकाया ऋण</span>
          <p className="text-2xl font-black text-amber-800 mt-1">₹{totals.totalLoan}</p>
        </div>
      </div>

      {/* Add Member + Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs print:hidden">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="समूह का नाम"
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
          />
          <form onSubmit={addMember} className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="नई दीदी का नाम"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
            />
            <input
              type="number"
              value={newSaving}
              onChange={(e) => setNewSaving(e.target.value)}
              className="w-20 px-2 py-2 rounded-xl border border-slate-200 bg-slate-50 tabular-nums"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>जोड़ें</span>
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-700">
                <th className="py-2 px-2">सदस्या का नाम</th>
                <th className="py-2 px-2">जमा बचत (₹)</th>
                <th className="py-2 px-2">बकाया ऋण (₹)</th>
                <th className="py-2 px-2">साप्ताहिक किस्त</th>
                <th className="py-2 px-2 text-right print:hidden">हटाएँ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 tabular-nums">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="py-2 px-2 font-bold text-slate-900">{m.name}</td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      value={m.weeklySaving}
                      onChange={(e) =>
                        persist(
                          members.map((x) =>
                            x.id === m.id ? { ...x, weeklySaving: Math.max(0, Number(e.target.value) || 0) } : x
                          )
                        )
                      }
                      className="w-20 px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      value={m.activeLoan}
                      onChange={(e) =>
                        persist(
                          members.map((x) =>
                            x.id === m.id ? { ...x, activeLoan: Math.max(0, Number(e.target.value) || 0) } : x
                          )
                        )
                      }
                      className="w-20 px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 font-bold"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <button
                      type="button"
                      onClick={() =>
                        persist(
                          members.map((x) =>
                            x.id === m.id ? { ...x, paidThisWeek: !x.paidThisWeek } : x
                          )
                        )
                      }
                      className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                        m.paidThisWeek
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {m.paidThisWeek ? 'जमा ✓' : 'बाकी'}
                    </button>
                  </td>
                  <td className="py-2 px-2 text-right print:hidden">
                    <button
                      type="button"
                      onClick={() => persist(members.filter((x) => x.id !== m.id))}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>बैठक रजिस्टर प्रिंट</span>
          </button>
        </div>
      </div>
    </div>
  );
};
