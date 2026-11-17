import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { speakWithFemaleVoice } from '../utils/speech';
import { toDevanagariAuto, toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  Users,
  Download,
  Printer,
  Plus,
  Trash2,
  Volume2,
  RotateCcw,
  TreePine
} from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  santaliRelation: string;
  hindiRelation: string;
  tier: 'grandparents' | 'parents' | 'self_spouse' | 'children';
}

interface FamilyTreeData {
  familyTitle: string;
  parisClan: string;
  ancestralVillage: string;
  members: FamilyMember[];
}

const SANTALI_CLANS = [
  'हंसदा (Hansda)',
  'मुर्मू (Murmu)',
  'किस्कू (Kisku)',
  'हेम्ब्रम (Hembram)',
  'मरांडी (Marndi)',
  'सोरेन (Soren)',
  'टुडू (Tudu)',
  'बास्के (Baske)',
  'बेसरा (Besra)',
  'चोंड़े (Chonde)',
  'पौड़िया (Pauria)',
  'बेदिया (Bedia)'
];

const DEFAULT_TREE: FamilyTreeData = {
  familyTitle: 'मरांडी परिवार वंशावली',
  parisClan: 'मरांडी (Marndi)',
  ancestralVillage: 'दुमका, संताल परगना',
  members: [
    { id: 'gp1', name: 'बुधन मरांडी', santaliRelation: 'गोरोम बाबा', hindiRelation: 'दादाजी', tier: 'grandparents' },
    { id: 'gp2', name: 'फुलमुनी टुडू', santaliRelation: 'गोरोम आयो', hindiRelation: 'दादीजी', tier: 'grandparents' },
    { id: 'p1', name: 'सोमराय मरांडी', santaliRelation: 'बाबा (आपा)', hindiRelation: 'पिताजी', tier: 'parents' },
    { id: 'p2', name: 'सलोनी सोरेन', santaliRelation: 'आयो (गोगो)', hindiRelation: 'माताजी', tier: 'parents' },
    { id: 's1', name: 'बिरसा मरांडी', santaliRelation: 'इञ (स्वयं)', hindiRelation: 'स्वयं', tier: 'self_spouse' },
    { id: 's2', name: 'बहामनी हंसदा', santaliRelation: 'बाहू / एरा', hindiRelation: 'पत्नी', tier: 'self_spouse' },
    { id: 'c1', name: 'सागेन मरांडी', santaliRelation: 'होपोन कोड़ा', hindiRelation: 'पुत्र', tier: 'children' },
    { id: 'c2', name: 'दिगी मरांडी', santaliRelation: 'होपोन कुड़ी', hindiRelation: 'पुत्री', tier: 'children' }
  ]
};

function getTreeKey(email?: string | null) {
  return email ? `hor_katha_family_tree_v1_${email.toLowerCase()}` : 'hor_katha_family_tree_v1_guest';
}

export const SantaliFamilyTreeBuilder: React.FC = () => {
  const { currentUser } = useUserAuth();
  const storageKey = getTreeKey(currentUser?.email);

  const [tree, setTree] = useState<FamilyTreeData>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : DEFAULT_TREE;
    } catch {
      return DEFAULT_TREE;
    }
  });

  const [newName, setNewName] = useState('');
  const [newSantaliRel, setNewSantaliRel] = useState('बोयहा (भाई/बहन)');
  const [newHindiRel, setNewHindiRel] = useState('भाई / बहन');
  const [newTier, setNewTier] = useState<FamilyMember['tier']>('children');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setTree(JSON.parse(saved));
      else setTree(DEFAULT_TREE);
    } catch {
      setTree(DEFAULT_TREE);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tree));
    } catch {
      // ignore
    }
  }, [tree, storageKey]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const item: FamilyMember = {
      id: `fm_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      name: newName.trim(),
      santaliRelation: newSantaliRel.trim() || 'सागेन',
      hindiRelation: newHindiRel.trim() || 'सदस्य',
      tier: newTier
    };
    setTree((prev) => ({ ...prev, members: [...prev.members, item] }));
    setNewName('');
  };

  const handleUpdateMember = (id: string, field: keyof FamilyMember, value: string) => {
    setTree((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    }));
  };

  const handleRemoveMember = (id: string) => {
    setTree((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id)
    }));
  };

  const handleDownloadPngChart = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1440;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 8;
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(toDevanagariAuto(tree.familyTitle), canvas.width / 2, 86);

    ctx.fillStyle = '#334155';
    ctx.font = '600 22px sans-serif';
    ctx.fillText(
      `पारिस: ${tree.parisClan}  ·  मूल गाँव: ${tree.ancestralVillage}  ·  ${toOlChikiAuto(tree.familyTitle)}`,
      canvas.width / 2,
      126
    );

    const tiers: { key: FamilyMember['tier']; label: string; y: number; color: string }[] = [
      { key: 'grandparents', label: 'प्रथम पीढ़ी · गोरोम बाबा / आयो (दादा-दादी)', y: 205, color: '#FEF3C7' },
      { key: 'parents', label: 'द्वितीय पीढ़ी · बाबा / आयो (माता-पिता)', y: 385, color: '#ECFDF5' },
      { key: 'self_spouse', label: 'तृतीय पीढ़ी · स्वयं व जीवनसाथी', y: 565, color: '#EFF6FF' },
      { key: 'children', label: 'चतुर्थ पीढ़ी · संतान व नई पीढ़ी', y: 745, color: '#FFF1F2' }
    ];

    tiers.forEach((t, tierIdx) => {
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t.label, canvas.width / 2, t.y - 18);

      const list = tree.members.filter((m) => m.tier === t.key);
      const count = Math.max(list.length, 1);
      const boxW = Math.min(280, Math.floor((canvas.width - 160) / count) - 20);
      const totalW = list.length * boxW + Math.max(0, list.length - 1) * 24;
      let startX = (canvas.width - totalW) / 2;

      if (tierIdx > 0) {
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, t.y - 68);
        ctx.lineTo(canvas.width / 2, t.y - 36);
        ctx.stroke();
      }

      list.forEach((m) => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(startX, t.y, boxW, 108);
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, t.y, boxW, 108);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(toDevanagariAuto(m.name).slice(0, 22), startX + boxW / 2, t.y + 34);

        ctx.fillStyle = '#B45309';
        ctx.font = 'bold 17px sans-serif';
        ctx.fillText(toOlChikiAuto(m.name).slice(0, 22), startX + boxW / 2, t.y + 62);

        ctx.fillStyle = '#475569';
        ctx.font = '600 15px sans-serif';
        ctx.fillText(
          `${toDevanagariAuto(m.santaliRelation)} · ${m.hindiRelation}`.slice(0, 28),
          startX + boxW / 2,
          t.y + 90
        );

        startX += boxW + 24;
      });
    });

    ctx.fillStyle = '#64748B';
    ctx.font = '600 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Hor Katha Suite · डिजिटल पारिवारिक वंशावली धरोहर', canvas.width / 2, 912);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `santali-family-tree-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const tierConfigs: { key: FamilyMember['tier']; title: string }[] = [
    { key: 'grandparents', title: 'प्रथम पीढ़ी · गोरोम बाबा / गोरोम आयो (दादा-दादी)' },
    { key: 'parents', title: 'द्वितीय पीढ़ी · बाबा / आयो (माता-पिता व चाचा-मामा)' },
    { key: 'self_spouse', title: 'तृतीय पीढ़ी · स्वयं, जीवनसाथी व भाई-बहन' },
    { key: 'children', title: 'चतुर्थ पीढ़ी · होपोन (संतान व अगली पीढ़ी)' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-semibold text-emerald-800">
            पारिस धरोहर · 4-पीढ़ी दृश्य मानचित्र
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            डिजिटल पारिवारिक वंशावली वृक्ष निर्माता (Family Tree Chart Maker)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            अपने परिवार की चार पीढ़ियों, पारिस (गोत्र) और मूल गाँव की वंशावली ओल चिकी व देवनागरी में सहेजें और HD चार्ट डाउनलोड करें।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadPngChart}
            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>HD वंशावली PNG डाउनलोड</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>प्रिंट / PDF</span>
          </button>
          <button
            onClick={() => setTree(DEFAULT_TREE)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>रीसेट</span>
          </button>
        </div>
      </div>

      {/* Config + Add Member Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 print:hidden">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            वंशावली शीर्षक व पारिस विवरण
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">वंशावली शीर्षक</label>
              <input
                type="text"
                value={tree.familyTitle}
                onChange={(e) => setTree((p) => ({ ...p, familyTitle: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">पारिस (संताली गोत्र)</label>
              <select
                value={tree.parisClan}
                onChange={(e) => setTree((p) => ({ ...p, parisClan: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
              >
                {SANTALI_CLANS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">मूल गाँव / अतु व जिला</label>
              <input
                type="text"
                value={tree.ancestralVillage}
                onChange={(e) => setTree((p) => ({ ...p, ancestralVillage: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
              />
            </div>
          </div>
        </div>

        <form
          onSubmit={handleAddMember}
          className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4"
        >
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>नया परिवार सदस्य जोड़ें</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">सदस्य का नाम *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="जैसे: कान्हू मरांडी"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">पीढ़ी (Generation Tier)</label>
              <select
                value={newTier}
                onChange={(e) => setNewTier(e.target.value as FamilyMember['tier'])}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
              >
                <option value="grandparents">प्रथम पीढ़ी (दादा-दादी / नाना-नानी)</option>
                <option value="parents">द्वितीय पीढ़ी (माता-पिता)</option>
                <option value="self_spouse">तृतीय पीढ़ी (स्वयं / जीवनसाथी / भाई-बहन)</option>
                <option value="children">चतुर्थ पीढ़ी (संतान / नई पीढ़ी)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">संताली संबंध</label>
              <input
                type="text"
                value={newSantaliRel}
                onChange={(e) => setNewSantaliRel(e.target.value)}
                placeholder="जैसे: दादा / बोयहा / होपोन"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">हिन्दी संबंध</label>
              <input
                type="text"
                value={newHindiRel}
                onChange={(e) => setNewHindiRel(e.target.value)}
                placeholder="जैसे: बड़े भाई / पुत्र"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>वंशावली में जोड़ें</span>
            </button>
          </div>
        </form>
      </div>

      {/* Visual Generational Tree Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="text-center pb-4 border-b border-slate-200 space-y-1">
          <div className="inline-flex items-center gap-2 text-emerald-800 text-xs font-semibold">
            <TreePine className="w-4 h-4" />
            <span>संताली वंशावली वृक्ष</span>
            <span aria-hidden="true">·</span>
            <span>पारिस: {tree.parisClan}</span>
            <span aria-hidden="true">·</span>
            <span>{tree.ancestralVillage}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{toDevanagariAuto(tree.familyTitle)}</h2>
          <p className="text-sm font-semibold text-amber-800">
            ओल चिकी: {toOlChikiAuto(tree.familyTitle)}
          </p>
        </div>

        <div className="space-y-6">
          {tierConfigs.map((tier, idx) => {
            const members = tree.members.filter((m) => m.tier === tier.key);
            return (
              <div key={tier.key} className="space-y-3">
                {idx > 0 && (
                  <div className="flex justify-center">
                    <div className="w-0.5 h-5 bg-slate-300" />
                  </div>
                )}
                <p className="text-center text-xs font-bold text-slate-600">{tier.title}</p>
                {members.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-2">
                    इस पीढ़ी में अभी कोई सदस्य नहीं है। ऊपर फॉर्म से जोड़ें।
                  </p>
                ) : (
                  <div className="flex flex-wrap justify-center gap-3">
                    {members.map((m) => (
                      <div
                        key={m.id}
                        className="w-full sm:w-60 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={m.name}
                            onChange={(e) => handleUpdateMember(m.id, 'name', e.target.value)}
                            className="text-sm font-bold text-slate-900 bg-transparent border-b border-transparent focus:border-amber-500 focus:outline-none w-full"
                          />
                          <div className="flex items-center gap-1 shrink-0 print:hidden">
                            <button
                              onClick={() =>
                                speakWithFemaleVoice(`${m.name}, ${m.santaliRelation}`, {
                                  autoDetectLanguage: true
                                })
                              }
                              className="p-1 text-slate-500 hover:text-amber-700 cursor-pointer"
                              title="नाम व संबंध सुनें"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRemoveMember(m.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="सदस्य हटाएँ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        {toDevanagariAuto(m.name) !== m.name && (
                          <p className="text-xs font-bold text-sky-900">
                            देवनागरी: {toDevanagariAuto(m.name)}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-amber-800">{toOlChikiAuto(m.name)}</p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <input
                            type="text"
                            value={m.santaliRelation}
                            onChange={(e) => handleUpdateMember(m.id, 'santaliRelation', e.target.value)}
                            className="w-1/2 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-semibold text-slate-800"
                          />
                          <input
                            type="text"
                            value={m.hindiRelation}
                            onChange={(e) => handleUpdateMember(m.id, 'hindiRelation', e.target.value)}
                            className="w-1/2 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[11px] text-slate-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
