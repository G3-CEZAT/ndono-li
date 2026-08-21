import React, { useState } from 'react';
import { PILGRIM_HOME_CONTENT } from '../../data/pilgrimHomeData';
import { triggerHaptic, speakText, stopSpeech } from '../../utils/audioFeedback';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Heart, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Volume2, 
  VolumeX,
  Sparkles, 
  Check, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const HadaraZiyaraView: React.FC = () => {
  const { gamou, biography } = PILGRIM_HOME_CONTENT;
  const [activeTab, setActiveTab] = useState<'sanctuaries' | 'adab' | 'gamou'>('sanctuaries');
  const [playingZikrId, setPlayingZikrId] = useState<string | null>(null);
  const [visitedSanctuaries, setVisitedSanctuaries] = useState<Record<string, boolean>>({
    'maodo': false,
    'babacar': false,
    'dabakh': false,
    'grande-mosquee': false,
  });

  const sanctuaries = [
    {
      id: 'maodo',
      name: 'Mausolée de Seydi El Hadji Malick Sy (RTA)',
      location: 'Grande Zawiya de Tivaouane',
      description: 'Lieu saint de recueillement et foyer originel de la Hadara Malikiyya.',
      recommendedZikr: 'Salât al-Fâtih (11x ou 100x), Fâtiha, Sourate Yâ Sîn.',
      recitationVoice: 'As-Salâmu ‘alayka yâ Walîy Allâh Seydi El Hadji Malick Sy. Qu’Allah vous accorde Sa grâce et sanctifie votre précieux secret. Réciter la Salât al-Fâtih et la sourate Yâ Sîn.',
    },
    {
      id: 'babacar',
      name: 'Mausolée de Serigne Babacar Sy (RTA)',
      location: 'Zawiya Serigne Babacar Sy',
      description: 'Premier Khalife général des Tidianes (1922-1957), bâtisseur du pacte spirituel et éducatif.',
      recommendedZikr: 'Salât al-Fâtih, Invocations de guidance, fidélité et constance.',
      recitationVoice: 'As-Salâmu ‘alayka yâ Khalîfat ar-Râshid Serigne Babacar Sy. Prières pour la fermeté dans la foi, la droiture morale et la concorde.',
    },
    {
      id: 'dabakh',
      name: 'Mausolée de Serigne Abdoul Aziz Sy Dabakh (RTA)',
      location: 'Esplanade des Mausolées',
      description: 'Troisième Khalife (1957-1997), apôtre de la paix, de l’humilité et de la concorde nationale.',
      recommendedZikr: 'Prières pour la paix des cœurs, l’unité du Sénégal et la concorde fraternelle.',
      recitationVoice: 'As-Salâmu ‘alayka yâ Dabakh Malick. Invocations pour l’apaisement des épreuves, la paix universelle et la générosité d’esprit.',
    },
    {
      id: 'grande-mosquee',
      name: 'La Grande Mosquée de Tivaouane',
      location: 'Centre-ville de Tivaouane',
      description: 'Édifice majestueux rénové accueillant les grandes prières du vendredi et la Wadhîfa collective.',
      recommendedZikr: '2 Rak‘ats de salutation de la mosquée, Wadhîfa collective fraternelle.',
      recitationVoice: 'Deux génuflexions de salutation de la Maison d’Allah et participation à la Wadhîfa collective.',
    },
  ];

  const adabRules = [
    {
      title: '1. Pureté Rituelle & Intention (Niyya)',
      text: 'Se munir d’ablutions complètes à l’eau et orienter son cœur uniquement vers la satisfaction divine et l’amour du Prophète (PSL).',
    },
    {
      title: '2. Sérénité & Respect du Silence',
      text: 'Éviter toute bousculade, baisser la voix et maintenir une attitude digne et recueillie au sein des sanctuaires.',
    },
    {
      title: '3. Formules de Salutations',
      text: 'Saluer le Saint inhumé avec déférence (As-Salâmu ‘alayka yâ Walîy Allâh) et réciter le Coran en lui dédiant la récompense.',
    },
    {
      title: '4. Préservation de la Propreté',
      text: 'Respecter scrupuleusement la propreté des lieux sacrés et faire preuve de bienveillance envers tous les pèlerins.',
    },
  ];

  const togglePlayAudio = (id: string, text: string) => {
    triggerHaptic(10);
    if (playingZikrId === id) {
      stopSpeech();
      setPlayingZikrId(null);
    } else {
      setPlayingZikrId(id);
      speakText(text, () => setPlayingZikrId(null));
    }
  };

  const toggleVisited = (id: string) => {
    triggerHaptic(15);
    setVisitedSanctuaries((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div id="hadara-ziyara-view" className="max-w-2xl mx-auto w-full space-y-4">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-[#072B21] to-[#0E4D3C] text-white p-4 sm:p-5 rounded-2xl border border-[#D4A72C]/30 shadow-sm space-y-1.5">
        <div className="flex items-center gap-1.5 text-[#D4A72C] text-[11px] font-mono font-bold uppercase">
          <Compass className="w-3.5 h-3.5" />
          <span>Guide Pèlerin • Cité Sainte de Tivaouane</span>
        </div>
        <h2 className="text-lg sm:text-xl font-serif font-bold text-white leading-tight">
          Ziyâra & Gamou 2026
        </h2>
        <p className="text-xs text-gray-200 leading-relaxed font-sans">
          Repères géographiques, bienséances et oraisons pour vivre une visite pieuse bénie.
        </p>
      </div>

      {/* Segmented Buttons (Touch Optimized) */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-200 shadow-2xs">
        {[
          { id: 'sanctuaries' as const, label: 'Lieux Saints' },
          { id: 'adab' as const, label: 'Bienséances (Adab)' },
          { id: 'gamou' as const, label: 'Gamou 2026' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              triggerHaptic(10);
              setActiveTab(tab.id);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all touch-manipulation min-h-[38px] ${
              activeTab === tab.id
                ? 'bg-[#0E4D3C] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Sanctuaries */}
      {activeTab === 'sanctuaries' && (
        <div className="space-y-3">
          {sanctuaries.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-2xs space-y-3 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#072B21]">
                    {s.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 font-mono mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4A72C]" />
                    <span>{s.location}</span>
                  </div>
                </div>

                {/* Mark as visited button */}
                <button
                  onClick={() => toggleVisited(s.id)}
                  className={`flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-xl transition-colors touch-manipulation ${
                    visitedSanctuaries[s.id]
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${visitedSanctuaries[s.id] ? 'text-emerald-700' : 'text-gray-400'}`} />
                  <span>{visitedSanctuaries[s.id] ? 'Visité' : 'À visiter'}</span>
                </button>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed font-sans">
                {s.description}
              </p>

              {/* Recommended Zikr with Audio button */}
              <div className="pt-2.5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F8FAF9] p-3 rounded-xl">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#0E4D3C] font-mono uppercase text-[10px] block">
                    Récitations conseillées :
                  </span>
                  <span className="text-xs text-gray-700 font-sans">{s.recommendedZikr}</span>
                </div>

                <button
                  onClick={() => togglePlayAudio(s.id, s.recitationVoice)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all touch-manipulation self-start sm:self-auto min-h-[36px] ${
                    playingZikrId === s.id
                      ? 'bg-[#072B21] text-[#E8C158]'
                      : 'bg-[#0E4D3C]/10 text-[#0E4D3C] hover:bg-[#0E4D3C] hover:text-white'
                  }`}
                >
                  {playingZikrId === s.id ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                      <span>Arrêter</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#D4A72C]" />
                      <span>Écouter Salutations</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Adab */}
      {activeTab === 'adab' && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#072B21]">
              Bienséances Spirituelles de la Visite (Adab az-Ziyâra)
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Tirées des écrits de Seydi El Hadji Malick Sy (RTA), voici les 4 règles fondamentales pour honorer la sainteté des lieux :
            </p>
          </div>

          <div className="space-y-2.5">
            {adabRules.map((rule, idx) => (
              <div key={idx} className="p-3.5 bg-[#F8FAF9] rounded-xl border border-gray-200 space-y-1">
                <h4 className="font-bold text-xs text-[#072B21] font-serif">
                  {rule.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">
                  {rule.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Gamou 2026 */}
      {activeTab === 'gamou' && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D4A72C] font-bold">
                {gamou.edition} • Tivaouane
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#072B21]">
                Gamou de Tivaouane {gamou.yearGregorian}
              </h3>
              <p className="text-xs text-gray-500 font-mono">
                {gamou.hijriDate} • {gamou.gregorianDate}
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-mono text-[11px] font-bold">
              1448 H
            </span>
          </div>

          {/* Theme Banner */}
          <div className="p-4 rounded-xl bg-[#072B21] text-white space-y-2">
            <span className="text-[10px] uppercase font-mono text-[#D4A72C] tracking-wider block font-bold">
              Thème Scientifique Officiel :
            </span>
            <div className="text-sm font-serif font-bold text-white leading-relaxed">
              « {gamou.theme} »
            </div>
            <div className="text-xs text-[#E8C158] font-serif" dir="rtl">
              {gamou.themeArabic}
            </div>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed font-sans">
            {gamou.description}
          </p>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-sans space-y-1">
            <strong className="block font-semibold">Mémoire de 1902 à nos jours :</strong>
            <span>
              Le Gamou de Tivaouane a été instauré par Seydi El Hadji Malick Sy (RTA) en 1902 pour vivifier l’amour du Prophète Mouhammad (PSL) et rassembler tous les musulmans dans la concorde.
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
