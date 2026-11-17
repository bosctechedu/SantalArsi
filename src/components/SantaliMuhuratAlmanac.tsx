import React, { useState } from 'react';
import { Calendar, Moon, Volume2, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface ActivityOption {
  id: string;
  nameDev: string;
  nameRom: string;
  hindi: string;
  bestDays: string[];
  avoidMoon: string[];
  guidance: string;
}

const ACTIVITIES: ActivityOption[] = [
  {
    id: 'erok',
    nameDev: 'एरोक / बीज बोनी (कृषि शुभारंभ)',
    nameRom: 'Erok (Seed Sowing)',
    hindi: 'धान व खेत की बुवाई',
    bestDays: ['सोमवार (ओते माहा)', 'बुधवार (सागुन)', 'शुक्रवार'],
    avoidMoon: ['अमावस (मुळ)'],
    guidance: 'बीज बोने से पहले जाहेर थान में नायके बाबा द्वारा "एरोक सिम" पूजा संपन्न होना शुभ माना जाता है। रोहिणी व आर्द्रा नक्षत्र में बीज बोने से अंकुरण शत-प्रतिशत होता है।'
  },
  {
    id: 'orak_benaw',
    nameDev: 'ओड़ाक् खुंटी गाड़ना (गृह निर्माण)',
    nameRom: 'Orak Khunti (House Foundation)',
    hindi: 'नए घर का खूंटी पूजन',
    bestDays: ['सोमवार', 'गुरुवार', 'शुक्रवार'],
    avoidMoon: ['अमावस (मुळ)', 'मंगलवार'],
    guidance: 'मुख्य खूंटी (मारांग खुंटी) को पूर्व-उत्तर दिशा की ओर मुख करके लगाना सर्वोत्तम है। शुक्ल पक्ष (बढ़ता चांद) घर की समृद्धि का प्रतीक माना जाता है।'
  },
  {
    id: 'bapla',
    nameDev: 'बापला नेग (विवाह व वर-वधू यात्रा)',
    nameRom: 'Bapla (Marriage Ceremonies)',
    hindi: 'विवाह व लगन तय करना',
    bestDays: ['बुधवार', 'शुक्रवार', 'सोमवार'],
    avoidMoon: ['अमावस (मुळ)', 'शनिवार'],
    guidance: 'माघ, फाल्गुन और बैसाख माह में शुक्ल पक्ष के दिन विवाह व "होरोः जोमोक्" (वर-वधू भेंट) हेतु अति शुभ माने जाते हैं। "जोग मांझी" की अनुमति अनिवार्य है।'
  },
  {
    id: 'dahar',
    nameDev: 'डाहर जतरा (लंबी यात्रा व हाट प्रस्थान)',
    nameRom: 'Dahar (Long Journey)',
    hindi: 'महत्वपूर्ण कार्य हेतु प्रस्थान',
    bestDays: ['सोमवार', 'गुरुवार', 'रविवार'],
    avoidMoon: ['मंगलवार', 'शनिवार'],
    guidance: 'प्रस्थान से पूर्व "लोटा दाः" (लोटे में शीतल जल) देखना और "जोग मांझी" या माता-पिता से डोबोक जोहार आशीर्वाद लेना यात्रा को मंगलमय बनाता है।'
  }
];

const WEEKDAYS = [
  'सोमवार',
  'मंगलवार',
  'बुधवार',
  'गुरुवार',
  'शुक्रवार',
  'शनिवार',
  'रविवार'
];

const MOON_PHASES = [
  { id: 'shukla', label: 'शुक्ल पक्ष (बढ़ता चांद - चंद्रमा)' },
  { id: 'kunami', label: 'कुनामी (पूर्णिमा - पूर्ण चांद)' },
  { id: 'krishna', label: 'कृष्ण पक्ष (घटता चांद)' },
  { id: 'amavas', label: 'अमावस (मुळ - अंधेरी रात)' }
];

export const SantaliMuhuratAlmanac: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityOption>(ACTIVITIES[0]);
  const [selectedDay, setSelectedDay] = useState<string>('सोमवार');
  const [selectedMoon, setSelectedMoon] = useState<string>('कुनामी (पूर्णिमा - पूर्ण चांद)');

  const isDayGood = selectedActivity.bestDays.some(d => d.includes(selectedDay));
  const isMoonAvoid = selectedActivity.avoidMoon.some(m => selectedMoon.includes(m));
  const isOverallAuspicious = isDayGood && !isMoonAvoid;

  const summaryText = isOverallAuspicious
    ? `सागुन दिन! ${selectedActivity.nameDev} के लिए ${selectedDay} और ${selectedMoon} अत्यंत शुभ व मंगलमय है।`
    : `सावधानी/वर्जना: पारंपरिक लोक-मान्यताओं के अनुसार इस कार्य के लिए ${selectedActivity.bestDays.join(', ')} व शुक्ल पक्ष/कुनामी को प्राथमिकता दी जाती है।`;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-indigo-50 via-white to-amber-50 border border-indigo-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Moon className="w-4 h-4" />
              <span>चांदो व माहा सागुन विचार | Santali Auspicious Almanac Checker</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              संताली शुभ-अशुभ मुहूर्त व कृषि पंचांग परीक्षक
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              एरोक बोनी, गृह-खूंटी पूजन, बापला व यात्रा हेतु वार व चंद्र-कला आधारित पारंपरिक शुभ मुहूर्त जांचें।
            </p>
          </div>
          <button
            onClick={() => speakWithFemaleVoice(`${summaryText} ${selectedActivity.guidance}`, { lang: 'hi-IN' })}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>मुहूर्त फल सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-5">
          {/* Activity */}
          <div className="bg-white border border-stone-200 p-4">
            <h3 className="text-xs uppercase font-bold text-amber-700 mb-3">१. मांगलिक / कृषि कार्य चुनें</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ACTIVITIES.map(act => (
                <button
                  key={act.id}
                  onClick={() => setSelectedActivity(act)}
                  className={`p-3 text-left border transition-all ${
                    selectedActivity.id === act.id
                      ? 'bg-amber-600 text-white border-amber-400 font-bold'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-200'
                  }`}
                >
                  <div className="text-xs font-bold">{act.nameDev}</div>
                  <div className={`text-[10px] mt-0.5 ${selectedActivity.id === act.id ? 'text-stone-900' : 'text-stone-600'}`}>
                    {act.hindi}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Weekday */}
          <div className="bg-white border border-stone-200 p-4">
            <h3 className="text-xs uppercase font-bold text-sky-700 mb-3">२. सप्ताह का दिन (माहा) चुनें</h3>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 text-xs font-semibold border transition-all ${
                    selectedDay === day
                      ? 'bg-sky-600 text-white border-sky-400'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-sky-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Moon phase */}
          <div className="bg-white border border-stone-200 p-4">
            <h3 className="text-xs uppercase font-bold text-indigo-700 mb-3">३. चंद्र कला (चांदो) चुनें</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MOON_PHASES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMoon(m.label)}
                  className={`p-2.5 text-xs font-semibold text-left border transition-all ${
                    selectedMoon === m.label
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-indigo-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Box */}
        <div className="lg:col-span-6 space-y-4">
          <div
            className={`border-2 p-6 shadow-sm space-y-4 ${
              isOverallAuspicious
                ? 'bg-emerald-50 border-emerald-500/70'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isOverallAuspicious ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-700" />
              ) : (
                <AlertTriangle className="w-7 h-7 text-amber-700" />
              )}
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-stone-600 block">
                  पारंपरिक पंचांग परिणाम
                </span>
                <h2 className={`text-xl font-bold ${isOverallAuspicious ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isOverallAuspicious ? 'सागुन माहा (शुभ व उत्तम मुहूर्त)' : 'साधारण / प्रतीक्षा योग्य समय'}
                </h2>
              </div>
            </div>

            <p className="text-sm text-stone-900 leading-relaxed bg-stone-50 p-4 border border-stone-200">
              {summaryText}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 p-3 border border-stone-200">
                <span className="text-emerald-700 font-bold block mb-1">सर्वश्रेष्ठ शुभ दिन:</span>
                <p className="text-stone-900">{selectedActivity.bestDays.join(' · ')}</p>
              </div>
              <div className="bg-stone-50 p-3 border border-stone-200">
                <span className="text-rose-700 font-bold block mb-1">वर्जित पक्ष / दिन:</span>
                <p className="text-stone-900">{selectedActivity.avoidMoon.join(' · ')}</p>
              </div>
            </div>

            <div className="bg-white p-4 border border-stone-200 text-xs space-y-1">
              <span className="text-amber-700 font-bold block">बुजुर्गों (हापड़ाम) का विशेष मार्गदर्शन:</span>
              <p className="text-stone-700 leading-relaxed">{selectedActivity.guidance}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
