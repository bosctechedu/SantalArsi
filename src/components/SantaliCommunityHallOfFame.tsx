import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useUserAuth } from '../context/UserAuthContext';
import { toDevanagariAuto, toOlChikiAuto } from '../utils/olChikiTranslit';
import {
  Award,
  Download,
  RefreshCw,
  Search,
  Printer,
  Users
} from 'lucide-react';

interface ContributorSummary {
  email: string;
  name: string;
  region: string;
  approvedWords: number;
  approvedVoiceNotes: number;
  voiceUpvotes: number;
  approvedEvents: number;
  totalScore: number;
}

export const SantaliCommunityHallOfFame: React.FC = () => {
  const { communitySubmissions, communityVoiceNotes, villageEvents, refreshCommunityBoard, refreshSubmissions } =
    useAdmin();
  const { currentUser } = useUserAuth();

  const [serverContributors, setServerContributors] = useState<ContributorSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [regionFilter, setRegionFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedCertContributor, setSelectedCertContributor] = useState<ContributorSummary | null>(null);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      await Promise.all([refreshCommunityBoard(), refreshSubmissions()]);
      const res = await fetch('/api/community/leaderboard');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.contributors)) {
          setServerContributors(data.contributors);
        }
      }
    } catch {
      // fallback cleanly to AdminContext live arrays
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const contributors = useMemo<ContributorSummary[]>(() => {
    const map = new Map<string, ContributorSummary>();

    const ensure = (emailRaw: string, nameRaw: string, regionRaw: string) => {
      const email = (emailRaw || 'contributor@horkatha.in').trim().toLowerCase();
      const prev = map.get(email);
      if (prev) return prev;
      const item: ContributorSummary = {
        email,
        name: (nameRaw || email.split('@')[0]).trim(),
        region: (regionRaw || 'संताल परगना (Dumka / Jharkhand)').trim(),
        approvedWords: 0,
        approvedVoiceNotes: 0,
        voiceUpvotes: 0,
        approvedEvents: 0,
        totalScore: 0
      };
      map.set(email, item);
      return item;
    };

    // Merge local AdminContext approved data
    for (const w of communitySubmissions) {
      if (w.status === 'approved') {
        ensure(w.submittedByEmail, w.submittedByName, w.regionDialect).approvedWords += 1;
      }
    }
    for (const v of communityVoiceNotes) {
      if (v.status === 'approved') {
        const entry = ensure(v.submittedByEmail, v.submittedByName, v.regionDialect);
        entry.approvedVoiceNotes += 1;
        entry.voiceUpvotes += v.upvotes || 0;
      }
    }
    for (const ev of villageEvents) {
      if (ev.status === 'approved') {
        ensure(ev.submittedByEmail, ev.organizerName, ev.regionDialect).approvedEvents += 1;
      }
    }

    // Reconcile with server snapshot (take max per field to avoid double counting)
    for (const s of serverContributors) {
      const entry = ensure(s.email, s.name, s.region);
      entry.approvedWords = Math.max(entry.approvedWords, s.approvedWords);
      entry.approvedVoiceNotes = Math.max(entry.approvedVoiceNotes, s.approvedVoiceNotes);
      entry.voiceUpvotes = Math.max(entry.voiceUpvotes, s.voiceUpvotes);
      entry.approvedEvents = Math.max(entry.approvedEvents, s.approvedEvents);
    }

    return Array.from(map.values())
      .map((c) => ({
        ...c,
        totalScore:
          c.approvedWords * 15 +
          c.approvedVoiceNotes * 20 +
          c.voiceUpvotes * 5 +
          c.approvedEvents * 15
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [communitySubmissions, communityVoiceNotes, villageEvents, serverContributors]);

  const regions = useMemo(() => {
    const set = new Set(contributors.map((c) => c.region));
    return Array.from(set);
  }, [contributors]);

  const filteredContributors = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contributors.filter((c) => {
      if (regionFilter !== 'all' && c.region !== regionFilter) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.region.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [contributors, regionFilter, query]);

  const activeCertificateSubject: ContributorSummary = selectedCertContributor || {
    email: currentUser?.email || 'sathi@horkatha.in',
    name: currentUser?.displayName || 'संताली भाषा साधक',
    region: currentUser?.villageRegion || 'संताल परगना (Dumka / Jharkhand)',
    approvedWords: 0,
    approvedVoiceNotes: 0,
    voiceUpvotes: 0,
    approvedEvents: 0,
    totalScore: 0
  };

  const handleDownloadCertificatePng = (subject: ContributorSummary) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 980;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#92400E';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 3;
    ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Santal आ़रसी सामुदायिक भाषा संरक्षण सम्मान-पत्र', 700, 140);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('संताली भाषा रक्षक प्रमाण-पत्र', 700, 220);

    ctx.fillStyle = '#B45309';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(toOlChikiAuto('संताली भाषा रक्षक प्रमाण पत्र'), 700, 275);

    ctx.fillStyle = '#334155';
    ctx.font = '600 24px sans-serif';
    ctx.fillText('यह सम्मान-पत्र सादर प्रदान किया जाता है:', 700, 360);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText(toDevanagariAuto(subject.name), 700, 445);

    ctx.fillStyle = '#065F46';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`क्षेत्र / बोली केंद्र: ${subject.region}`, 700, 515);

    ctx.fillStyle = '#334155';
    ctx.font = '600 23px sans-serif';
    ctx.fillText(
      `स्वीकृत शब्द: ${subject.approvedWords}  ·  बोली ऑडियो: ${subject.approvedVoiceNotes}  ·  समर्थन वोट: ${subject.voiceUpvotes}  ·  ग्राम आयोजन: ${subject.approvedEvents}`,
      700,
      585
    );

    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`कुल सामुदायिक योगदान अंक: ${subject.totalScore} अंक`, 700, 645);

    ctx.fillStyle = '#475569';
    ctx.font = '600 20px sans-serif';
    ctx.fillText(`दिनांक: ${new Date().toLocaleDateString('hi-IN')}  ·  Santal आ़रसी · BOSC Tech & Edu`, 700, 820);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `santali-contributor-certificate-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-semibold text-amber-800">
            Admin-अनुमोदित लाइव योगदान · शब्द, बोली व ग्राम आयोजन
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            सामुदायिक योगदान सम्मान बोर्ड व प्रमाण-पत्र (Hall of Fame)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            शब्दकोश, क्षेत्रीय बोली ऑडियो और ग्राम पर्व सूचनाओं में स्वीकृत योगदान देने वाले भाषा रक्षकों की लाइव सूची व प्रमाण-पत्र।
          </p>
        </div>

        <button
          onClick={loadLeaderboard}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 self-start lg:self-auto whitespace-nowrap cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'अपडेट हो रहा है...' : 'रैंकिंग ताज़ा करें'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Leaderboard Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-700" />
              <span>सत्यापित भाषा योगदानकर्ता ({filteredContributors.length})</span>
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="नाम खोजें..."
                  className="pl-7 pr-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 w-36"
                />
              </div>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800"
              >
                <option value="all">सभी क्षेत्र</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredContributors.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-800">अभी तक कोई Admin-अनुमोदित सामुदायिक योगदान दर्ज नहीं है।</p>
              <p>
                जब सदस्य समुदाय बोर्ड या शब्दकोश में शब्द, बोली ऑडियो या ग्राम पर्व सूचना भेजेंगे और Admin उन्हें स्वीकृत करेंगे, तब उनका नाम और स्कोर यहाँ स्वतः दिखाई देगा।
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-2">क्रम</th>
                    <th className="py-2 px-2">योगदानकर्ता</th>
                    <th className="py-2 px-2 text-right tabular-nums">शब्द</th>
                    <th className="py-2 px-2 text-right tabular-nums">आवाज़</th>
                    <th className="py-2 px-2 text-right tabular-nums">वोट</th>
                    <th className="py-2 px-2 text-right tabular-nums">अंक</th>
                    <th className="py-2 pl-2 text-right">प्रमाण-पत्र</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContributors.map((c, idx) => (
                    <tr key={c.email} className="hover:bg-slate-50">
                      <td className="py-2.5 pr-2 font-bold text-slate-700 tabular-nums">#{idx + 1}</td>
                      <td className="py-2.5 px-2">
                        <p className="font-bold text-slate-900">{c.name}</p>
                        <p className="text-[11px] text-slate-500">{c.region}</p>
                      </td>
                      <td className="py-2.5 px-2 text-right tabular-nums">{c.approvedWords}</td>
                      <td className="py-2.5 px-2 text-right tabular-nums">{c.approvedVoiceNotes}</td>
                      <td className="py-2.5 px-2 text-right tabular-nums">{c.voiceUpvotes}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-amber-800 tabular-nums">
                        {c.totalScore}
                      </td>
                      <td className="py-2.5 pl-2 text-right">
                        <button
                          onClick={() => setSelectedCertContributor(c)}
                          className="px-2.5 py-1 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold whitespace-nowrap cursor-pointer"
                        >
                          चुनें
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            अंक गणना नियम: स्वीकृत शब्द = 15 अंक · स्वीकृत बोली ऑडियो = 20 अंक · प्रत्येक समुदाय वोट = 5 अंक · स्वीकृत ग्राम आयोजन = 15 अंक।
          </p>
        </div>

        {/* Certificate Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-amber-50/70 border-2 border-amber-500 rounded-2xl p-6 text-center space-y-3 shadow-xs">
            <Award className="w-8 h-8 text-amber-700 mx-auto" />
            <p className="text-xs font-bold text-amber-900">सामुदायिक भाषा रक्षक सम्मान-पत्र</p>
            <h3 className="text-xl font-bold text-slate-900">
              {toDevanagariAuto(activeCertificateSubject.name)}
            </h3>
            {toDevanagariAuto(activeCertificateSubject.name) !== activeCertificateSubject.name && (
              <p className="text-xs font-semibold text-slate-600">{activeCertificateSubject.name}</p>
            )}
            <p className="text-sm font-semibold text-amber-800">
              {toOlChikiAuto(activeCertificateSubject.name)}
            </p>
            <p className="text-xs text-slate-600">{activeCertificateSubject.region}</p>
            <div className="py-2 border-y border-amber-200 text-xs text-slate-700 tabular-nums">
              शब्द: {activeCertificateSubject.approvedWords} · ऑडियो: {activeCertificateSubject.approvedVoiceNotes} · वोट: {activeCertificateSubject.voiceUpvotes} · कुल स्कोर: <strong>{activeCertificateSubject.totalScore}</strong>
            </div>
            <p className="text-[11px] text-slate-500">
              Santal आ़रसी · BOSC Tech &amp; Edu · {new Date().toLocaleDateString('hi-IN')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              onClick={() => handleDownloadCertificatePng(activeCertificateSubject)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>HD सम्मान-पत्र PNG</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>प्रिंट</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
