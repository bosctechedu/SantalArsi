import React, { useState } from 'react';
import { Mic, Volume2, Copy, Check, Sparkles, Users } from 'lucide-react';
import { speakWithFemaleVoice } from '../utils/speech';

interface SpeechTemplate {
  id: string;
  occasion: string;
  santaliTitle: string;
  scriptDevanagari: (eventName: string, guestName: string, villageName: string) => string;
  hindiSummary: string;
}

const SPEECH_TEMPLATES: SpeechTemplate[] = [
  {
    id: 'welcome_johar',
    occasion: 'मंच स्वागत व अतिथि अभिनंदन',
    santaliTitle: 'सागुनदाराम आर पेड़ा जोहार संबोधन',
    scriptDevanagari: (ev, gu, vil) =>
      `जोहार! मारंग बुरु आर हापड़ाम कोवाः आशीर्वाद ते, तेहेञ ${vil} आतु रे सापाड़ो आकान "${ev}" कार्यक्रम रे आम मानोतान ${gu} गोमके, मांझी हाड़ाम, नायके बाबा आर जोतो आतु पेड़ा को सागुनदाराम जोहार! आबोवाः भाषा, संस्कृति आर एकता गे अबोवाः सबसे मारंग शक्ति काना।`,
    hindiSummary: 'मारंग बुरु और पूर्वजों के आशीर्वाद से आज ग्राम में आयोजित कार्यक्रम में माननीय मुख्य अतिथि, मांझी हड़ाम, नायके बाबा व सभी ग्रामीणों का सादर जोहार अभिनंदन!'
  },
  {
    id: 'hul_diwas',
    occasion: '३० जून हूल दिवस (सिद्धू-कान्हू नमन)',
    santaliTitle: 'हूल १८५५ शौर्य स्मृति भाषण',
    scriptDevanagari: (ev, gu, vil) =>
      `जोहार गोटेन को! तेहेञ ${vil} रे "${ev}" पावन अवसर रे, १८५५ हूल राः अमर शहीद सिद्धू, कान्हू, चांद, भैरव आर फूलो-झानो तिकिन के इञ सेन खोन दोबोक् जोहार। माननीय ${gu} जी, उनकुवाः "अबुवाः दिशोम, अबुवाः राज" नारा दो तेहेञ हों अबोवाः हृदय रे जिवेत् मेनाक् आ।`,
    hindiSummary: 'आज के पावन हूल दिवस पर १८५५ के अमर शहीद सिद्धू-कान्हू, चांद-भैरव और फूलो-झानो को कोटि-कोटि नमन। उनका स्वशासन का संकल्प आज भी हमारे हृदय में जीवित है।'
  },
  {
    id: 'baha_karam',
    occasion: 'बाहा / करम व सोहराय महोत्सव',
    santaliTitle: 'पावन पर्व व अखड़ा शुभारंभ उद्घोष',
    scriptDevanagari: (ev, gu, vil) =>
      `जोहार! ${vil} अखड़ा रे "${ev}" राः पावन बेला रे जोतो को सागुन परब जोहार। मानोतान ${gu} जी आर नायके बाबा वाः उपस्थिति ते तुमदाक् आर तामाक राः ताल रे अबो जोतो हपड़ाम रिति-रिवाज ते एनेच्-सेरेञ आबो। जोहार!`,
    hindiSummary: 'ग्राम के अखड़ा में आयोजित पावन पर्व महोत्सव पर सभी को हार्दिक शुभकामनाएँ! तुमदाक् और तामाक की मधुर ताल पर हम सब अपनी पूर्वज परंपरा से नृत्य व गीत गाएंगे।'
  },
  {
    id: 'vote_of_thanks',
    occasion: 'समापन व धन्यवाद ज्ञापन',
    santaliTitle: 'सराय जोहार (धन्यवाद ज्ञापन)',
    scriptDevanagari: (ev, gu, vil) =>
      `तेहेञ "${ev}" कार्यक्रम के सफल बेनाव लागित् ${vil} आतु राः जोतो मांझी पाराणिक, जोग मांझी, युवा को आर विशेष काते माननीय ${gu} गोमके के मने खोन सराय जोहार। अबो नोंका गे मीत् सांव ते लाहाक् आबो। जोहार!`,
    hindiSummary: 'आज के इस आयोजन को सफल बनाने हेतु समस्त ग्राम वासियों, युवा साथियों तथा विशेष रूप से मुख्य अतिथि महोदय का हृदय से धन्यवाद व जोहार!'
  }
];

export const SantaliAnchoringSpeechKit: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<SpeechTemplate>(SPEECH_TEMPLATES[0]);
  const [eventName, setEventName] = useState<string>('बाहा-करम सांस्कृतिक महोत्सव');
  const [guestName, setGuestName] = useState<string>('परगना बाबा श्री सोरेन');
  const [villageName, setVillageName] = useState<string>('भोगनाडीह');
  const [copied, setCopied] = useState<boolean>(false);

  const generatedSpeech = selectedTemplate.scriptDevanagari(eventName, guestName, villageName);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSpeech);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-rose-50 via-white to-amber-50 border border-rose-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-700 text-xs tracking-wider uppercase font-semibold mb-1">
              <Mic className="w-4 h-4" />
              <span>मंच संचालन व उद्घोषणा किट | Santali Anchoring &amp; Public Speaking Kit</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-950">
              संताली मंच संचालन, अतिथि जोहार व भाषण जनरेटर
            </h1>
            <p className="text-stone-700 text-sm mt-1">
              ग्राम सभा, हूल दिवस, अखड़ा उत्सव व स्कूल समारोह के लिए तुरंत संताली देवनागरी भाषण तैयार करें व अभ्यास करें।
            </p>
          </div>
          <button
            onClick={() => speakWithFemaleVoice(generatedSpeech, { lang: 'hi-IN' })}
            className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white border border-rose-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>भाषण अभ्यास सुनें</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-stone-200 p-4 space-y-3">
            <h3 className="text-xs uppercase font-bold text-amber-700">१. कार्यक्रम का अवसर चुनें</h3>
            <div className="space-y-2">
              {SPEECH_TEMPLATES.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`w-full text-left p-3 border transition-all ${
                    selectedTemplate.id === tpl.id
                      ? 'bg-rose-50 border-rose-400 font-bold'
                      : 'bg-stone-50 border-stone-200 hover:border-rose-200'
                  }`}
                >
                  <div className="text-xs text-rose-700">{tpl.occasion}</div>
                  <div className="text-sm text-amber-950 mt-0.5">{tpl.santaliTitle}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-4 space-y-3">
            <h3 className="text-xs uppercase font-bold text-amber-700">२. नाम व स्थान दर्ज करें</h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-stone-600 block mb-1">कार्यक्रम का नाम:</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={e => setEventName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-amber-950"
                />
              </div>
              <div>
                <label className="text-stone-600 block mb-1">मुख्य अतिथि / अध्यक्ष का नाम:</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-amber-950"
                />
              </div>
              <div>
                <label className="text-stone-600 block mb-1">गाँव / स्थल (आतु):</label>
                <input
                  type="text"
                  value={villageName}
                  onChange={e => setVillageName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-amber-950"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border-2 border-rose-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-xs uppercase text-rose-700 font-bold">{selectedTemplate.occasion}</span>
                <h2 className="text-xl font-bold text-amber-950">{selectedTemplate.santaliTitle}</h2>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-bold text-amber-700 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'कॉपी हुआ!' : 'कॉपी करें'}</span>
              </button>
            </div>

            <div className="bg-stone-50 p-5 border border-amber-200">
              <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold block mb-2">
                संताली मंच भाषण (Devanagari Script):
              </span>
              <p className="text-lg font-bold text-amber-950 leading-relaxed">{generatedSpeech}</p>
            </div>

            <div className="bg-stone-50 p-4 border border-stone-200">
              <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold block mb-1">
                हिन्दी भावार्थ:
              </span>
              <p className="text-xs text-stone-700 leading-relaxed">{selectedTemplate.hindiSummary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
