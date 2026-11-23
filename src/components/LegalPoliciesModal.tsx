import React, { useState } from 'react';
import { CulturalTree } from './CulturalTree';
import {
  AlertTriangle,
  ShieldCheck,
  FileText,
  Cookie,
  Bookmark,
  Eye,
  Printer,
  X,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export type PolicyDocId = 'disclaimer' | 'privacy' | 'terms' | 'cookies' | 'cultural_ip' | 'accessibility';

interface LegalPoliciesModalProps {
  isOpen: boolean;
  initialDoc?: PolicyDocId;
  onClose: () => void;
}

interface PolicySection {
  title: string;
  content: string;
}

interface PolicyDoc {
  id: PolicyDocId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  headline: string;
  hindiHeadline: string;
  versionDate: string;
  leadParagraph: string;
  sections: PolicySection[];
}

export const LegalPoliciesModal: React.FC<LegalPoliciesModalProps> = ({
  isOpen,
  initialDoc = 'disclaimer',
  onClose
}) => {
  const [selectedDocId, setSelectedDocId] = useState<PolicyDocId>(initialDoc);

  // Sync initialDoc when modal opens
  React.useEffect(() => {
    if (initialDoc) {
      setSelectedDocId(initialDoc);
    }
  }, [initialDoc, isOpen]);

  if (!isOpen) return null;

  const documents: PolicyDoc[] = [
    {
      id: 'disclaimer',
      label: 'Disclaimer',
      icon: AlertTriangle,
      headline: 'Disclaimer & Cultural Advisory',
      hindiHeadline: 'अस्वीकरण, स्रोत सूचना एवं क्षेत्रीय बोली विविधता',
      versionDate: 'November 2026 (v3.7.4 Pro Ultra)',
      leadParagraph:
        'इस प्लेटफ़ॉर्म पर उपलब्ध सभी शब्द, लोककथाएँ, गीत, परीक्षा प्रश्न, पंचांग एवं सांस्कृतिक जानकारी विभिन्न पारंपरिक, मौखिक, शैक्षिक और सार्वजनिक स्रोतों से संकलित की गई हैं। हम किसी भी सामग्री की १००% पूर्णता या आधिकारिक पुष्टि का दावा नहीं करते हैं। क्षेत्र व बोली के अनुसार संताली शब्द व उच्चारण भिन्न हो सकते हैं। (All content is compiled from diverse sources; 100% accuracy is not guaranteed and vocabulary may vary by region.)',
      sections: [
        {
          title: '1. विभिन्न स्रोतों से संकलन (No 100% Verification Guarantee)',
          content:
            'यह शैक्षिक और सांस्कृतिक मंच विभिन्न पुस्तकों, लोक-परंपराओं, सामुदायिक योगदानों और सार्वजनिक संदर्भ स्रोतों से तैयार किया गया है। यद्यपि सटीकता का पूरा प्रयास किया गया है, फिर भी हम किसी भी जानकारी, तिथि, परीक्षा उत्तर या शब्दार्थ की १००% पुष्टि की गारंटी नहीं देते। आधिकारिक या विधिक कार्यों हेतु मूल/सरकारी स्रोतों से सत्यापन अवश्य करें।'
        },
        {
          title: '2. क्षेत्रीय भाषा एवं बोली विविधता (Regional Dialect & Word Variations)',
          content:
            'संताली भाषा झारखंड (संताल परगना व कोल्हान), पश्चिम बंगाल, ओडिशा, बिहार और असम सहित विभिन्न क्षेत्रों में बोली जाती है। क्षेत्र, स्थान और पारंपरिक उच्चारण के आधार पर एक ही वस्तु या भाव के लिए संताली भाषा के शब्द, मुहावरे और देवनागरी/रोमन वर्तनी अलग-अलग हो सकते हैं।'
        },
        {
          title: '3. Educational & Non-Commercial Preservation Intent',
          content:
            'Santal आ़रसी is designed solely for public educational, linguistic research, and cultural preservation purposes. All features are provided 100% free of charge for community learning.'
        },
        {
          title: '4. Cultural Sanctity & Community Feedback',
          content:
            'The platform deeply respects tribal customs, sacred traditions (Jaher Than, Baha, Sohrai), and ancestral heritage. Users are warmly encouraged to share local regional dialectal terms or corrections via the Feedback form.'
        }
      ]
    },
    {
      id: 'privacy',
      label: 'Privacy Policy',
      icon: ShieldCheck,
      headline: 'Privacy Policy & Data Sovereignty',
      hindiHeadline: 'गोपनीयता नीति एवं डेटा संप्रभुता',
      versionDate: 'October 2026 (v3.7.4 Pro Ultra)',
      leadParagraph:
        'We believe in strict digital privacy. Santal आ़रसी collects zero personal identifiers, uses zero tracking trackers, and operates with full local data sovereignty.',
      sections: [
        {
          title: '1. Zero Personal Data Collection',
          content:
            'We do not ask for, capture, or store your real name, phone number, email address, IP history, or device location. Your learning activities, search queries, and typing remain entirely private to your device.'
        },
        {
          title: '2. Local Browser Storage Only',
          content:
            'All custom dictionary words, favorite entries, quiz progress, and administrative edits are saved strictly in your local browser HTML5 LocalStorage. No user data is synchronized to proprietary remote profiling servers.'
        },
        {
          title: '3. On-Device Speech & Audio Processing',
          content:
            'Voice pronunciations run via your browser standard on-device Web Speech API. Audio playback and interactive modules run locally in browser memory without sending user media or voice data to third parties.'
        },
        {
          title: '4. Indigenous Community Data Sovereignty',
          content:
            'We uphold the CARE principles for Indigenous Data Governance. Linguistic datasets, cultural songs, and orthographic documentation belong collectively to the Santal people and cannot be privatized.'
        }
      ]
    },
    {
      id: 'terms',
      label: 'Terms of Service',
      icon: FileText,
      headline: 'Terms of Service & Usage Governance',
      hindiHeadline: 'सेवा की शर्तें एवं उपयोग नियमावली',
      versionDate: 'October 2026 (v3.7.4 Pro Ultra)',
      leadParagraph:
        'These terms govern the use of Santal आ़रसी as an open cultural asset for educators, learners, researchers, and community organizations worldwide.',
      sections: [
        {
          title: '1. Non-Commercial Public License',
          content:
            'You are granted free, revocable, non-exclusive rights to use all tools, keyboards, character charts, and vocabulary databases for personal study, academic classrooms, community centers, and non-commercial publishing.'
        },
        {
          title: '2. Respect for Script Orthography & Phonetics',
          content:
            'Santali Devanagari character forms, checked diacritics, and phonetic values must be maintained accurately according to authentic Santali orthography and community standards.'
        },
        {
          title: '3. Prohibited Misuse',
          content:
            'Users may not bundle this suite into paywalled commercial software, deploy automated scrapers for predatory monetization, or use community vocabulary for defamatory or derogatory cultural misrepresentation.'
        },
        {
          title: '4. Attribution to BOSC Tech & Edu',
          content:
            'When citing data or incorporating dictionaries into scholarly publications or regional curriculum guides, appropriate credit to Santal आ़रसी and BOSC Tech & Edu is appreciated.'
        }
      ]
    },
    {
      id: 'cookies',
      label: 'Cookie Policy',
      icon: Cookie,
      headline: 'Cookie & Functional Storage Policy',
      hindiHeadline: 'कुकी नीति एवं स्थानीय संग्रहण',
      versionDate: 'October 2026 (v3.7.4 Pro Ultra)',
      leadParagraph:
        'Santal आ़रसी strictly adheres to privacy-by-design principles. We do not use third-party advertising cookies or cross-site tracking beacons.',
      sections: [
        {
          title: '1. Essential Functional Storage Only',
          content:
            'We only utilize standard browser storage to remember your active script choice (Devanagari, Roman), dark/light preference, and local bookmarks so you do not have to reconfigure them on every visit.'
        },
        {
          title: '2. No Third-Party Analytics Beacons',
          content:
            'No Google AdSense, Meta Pixel, tracking pixels, or third-party telemetry scripts are embedded into this platform. Your digital footprint is completely shielded.'
        },
        {
          title: '3. Offline Cache Readiness',
          content:
            'Local storage caching ensures that basic dictionary queries and virtual keyboards function smoothly even during intermittent or low rural internet connectivity.'
        },
        {
          title: '4. Instant User Purge Control',
          content:
            'You have full control over your stored preferences. Clearing your browser site data or cookies instantly resets all saved words and configurations back to clean defaults.'
        }
      ]
    },
    {
      id: 'cultural_ip',
      label: 'Cultural Heritage IP',
      icon: Bookmark,
      headline: 'Cultural Heritage & Intellectual Property',
      hindiHeadline: 'सांस्कृतिक धरोहर एवं बौद्धिक संपदा',
      versionDate: 'October 2026 (v3.7.4 Pro Ultra)',
      leadParagraph:
        'Celebrating and preserving the collective linguistic sovereignty, oral wisdom, and cultural heritage of the Santal community.',
      sections: [
        {
          title: '1. Community Heritage & Historical Legacy',
          content:
            'Santali oral tradition, ancestral folklore, and cultural literature embody centuries of indigenous philosophy. This suite honors the community elders and scholars who preserved this wisdom across generations.'
        },
        {
          title: '2. Authentic Phonetic Representation in Devanagari',
          content:
            'All digital glyphs and diacritics utilized in Santali Devanagari accurately represent checked consonants (k\', c\', t\', p\') and tonal nuances, ensuring cross-platform readability across Android, iOS, Windows, and web browsers.'
        },
        {
          title: '3. Inalienable Collective Tribal Ownership',
          content:
            'No commercial entity or individual may copyright or patent the phonetic sounds, vocabulary, or cultural literature of the Santal people. Santal आ़रसी operates as a steward of this public indigenous heritage.'
        },
        {
          title: '4. Digital Archival of Oral Lore',
          content:
            'Our ongoing mission includes transcribing traditional folk songs (Baha, Sohrai, Karam), historic folklore, and cultural stories into modern searchable, accessible digital archives.'
        }
      ]
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      icon: Eye,
      headline: 'Universal Accessibility & Inclusion',
      hindiHeadline: 'सार्वभौमिक पहुंच एवं समावेशिता',
      versionDate: 'October 2026 (v3.7.4 Pro Ultra)',
      leadParagraph:
        'Santal आ़रसी is architected to ensure barrier-free access for elders, rural learners, visually impaired individuals, and first-time smartphone users.',
      sections: [
        {
          title: '1. WCAG 2.1 AA Visual Contrast Standards',
          content:
            'All text layers, contrast ratios (minimum 4.5:1), and UI controls are calibrated for effortless readability under diverse lighting conditions, including direct outdoor sunlight.'
        },
        {
          title: '2. Auditory Learning & Speech Synthesis',
          content:
            'Built-in audio pronunciation buttons for every dictionary word allow auditory learners, children, and visually impaired users to hear native phonetic pacing without barrier.'
        },
        {
          title: '3. Accessible Multi-Script Literacy Bridge',
          content:
            'By simultaneously presenting Santali in Devanagari alongside phonetic English/Hindi transliteration, learners of varying educational backgrounds can progressively master the language.'
        },
        {
          title: '4. Keyboard Navigation & Assistive Tech',
          content:
            'All interactive components feature full keyboard focus rings, intuitive tab sequences, screen-reader semantic aria landmarks, and large touch targets (minimum 44px) for touch devices.'
        }
      ]
    }
  ];

  const currentDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-5xl w-full h-[90vh] max-h-[820px] shadow-2xl flex flex-col justify-between overflow-hidden relative font-sans">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
              <CulturalTree variant="emblem" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest leading-none">
                Santal आ़रसी LEGAL &amp; GOVERNANCE · v3.7.4 Pro Ultra
              </p>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1">
                Official Compliance &amp; Policies
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Policy Document"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close Modal"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal 2-Column Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-slate-50/50">
          {/* Left Sidebar: Document Selector (4 cols on md) */}
          <div className="md:col-span-4 p-4 border-r border-slate-200 flex flex-col justify-between space-y-4 overflow-y-auto bg-slate-50">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block">
                SELECT DOCUMENT
              </span>

              <div className="space-y-1.5">
                {documents.map((doc) => {
                  const Icon = doc.icon;
                  const isActive = selectedDocId === doc.id;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{doc.label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Commitment Box */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 block">
                BOSC Tech &amp; Edu Commitment:
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                100% Free educational platform for indigenous language rights. Zero ads, zero tracking.
              </p>
            </div>
          </div>

          {/* Right Content Area: Detailed Sectioned Cards (8 cols on md) */}
          <div className="md:col-span-8 p-5 sm:p-7 overflow-y-auto space-y-5 bg-white">
            {/* Document Header Banner */}
            <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {currentDoc.headline}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    {currentDoc.hindiHeadline}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-full border border-slate-300">
                  {currentDoc.versionDate}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                {currentDoc.leadParagraph}
              </p>
            </div>

            {/* Sectioned Checkmark Cards */}
            <div className="space-y-3.5">
              {currentDoc.sections.map((section) => (
                <div
                  key={section.title}
                  className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                      {section.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <span>I Understand &amp; Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
