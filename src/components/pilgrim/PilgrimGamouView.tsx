import React from 'react';
import { PILGRIM_HOME_CONTENT } from '../../data/pilgrimHomeData';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  Heart, 
  BookOpen, 
  ShieldCheck, 
  MapPin, 
  Compass, 
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PilgrimGamouViewProps {
  onNavigateToChat: () => void;
}

export const PilgrimGamouView: React.FC<PilgrimGamouViewProps> = ({
  onNavigateToChat,
}) => {
  const { gamou } = PILGRIM_HOME_CONTENT;

  const adabRules = [
    {
      title: "1. Purification rituelle & Intention pure (Niyya)",
      desc: "Accomplir ses ablutions, vêtir des habits blancs et décents, et renouveler son intention sincère de commémorer la naissance de la Miséricorde pour l'Univers (PSL).",
    },
    {
      title: "2. Recueillement & Modération sonore",
      desc: "Garder une attitude de piété, baisser la voix dans l'enceinte des zawiyas et des mausolées, et éviter toute agitation ou encombrement dans les ruelles saintes.",
    },
    {
      title: "3. Récitation & Zikr assidu",
      desc: "Multiplier les Salawât (notamment Salât al-Fâtih), réciter les chapitres du Khilâs az-Zahab et écouter attentivement les causeries des érudits.",
    },
    {
      title: "4. Fraternité & Hospitalité légendaire (Téranga)",
      desc: "Partager les repas de bénédiction (Berndé), accueillir avec bienveillance les pèlerins venus de loin et porter assistance aux personnes âgées.",
    },
  ];

  return (
    <div id="pilgrim-gamou-view" className="space-y-12 pb-16 text-[#1A1A1A]">
      
      {/* Gamou Hero Banner */}
      <div className="bg-gradient-to-br from-[#072B21] via-[#0E4D3C] to-[#09372B] text-white p-8 sm:p-12 rounded-3xl border-2 border-[#D4A72C]/40 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4A72C]/25 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#D4A72C] text-[#0E4D3C] font-mono shadow-sm">
              {gamou.edition} • {gamou.yearGregorian}
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/90 border border-white/15">
              {gamou.hijriDate}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#E8C158] font-mono bg-black/30 px-3 py-1 rounded-xl border border-white/10">
            <Clock className="w-4 h-4 text-[#D4A72C]" />
            <span>Date : {gamou.gregorianDate}</span>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-mono font-bold uppercase text-[#D4A72C] tracking-wider">
            Thème Officiel du Gamou 2026 :
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-snug">
            « {gamou.theme} »
          </h1>
          <div className="text-lg sm:text-xl font-serif text-[#E8C158] pt-1" dir="rtl">
            {gamou.themeArabic}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-white/80 max-w-3xl leading-relaxed">
          {gamou.description}
        </p>
      </div>

      {/* History of the First Gamou (1902) */}
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0E4D3C] uppercase font-mono">
          <Calendar className="w-4 h-4 text-[#D4A72C]" />
          <span>Genèse Historique du Mawlid à Tivaouane</span>
        </div>
        
        <h2 className="text-2xl font-serif font-bold text-[#0E4D3C]">
          De 1902 à nos jours : Plus d'un siècle de commémoration fervente
        </h2>

        <p className="text-sm text-gray-700 leading-relaxed">
          C'est en 1902, peu après son installation à Tivaouane, que Seydi El Hadji Malick Sy (RTA) organisa le premier Gamou public. À l'origine célébré dans la cour familiale et à la zawiya mère avec ses plus proches compagnons, cet événement a grandi au fil des décennies pour devenir le plus grand rassemblement religieux annuel de la Tijâniyya en Afrique de l'Ouest.
        </p>

        <div className="p-4 rounded-2xl bg-[#F4F6F5] border-l-4 border-[#0E4D3C] text-xs text-gray-800 italic font-serif">
          « Célébrer la naissance de Mouhammad (PSL), c'est renouveler son pacte de piété, réconcilier les cœurs et répandre la bénédiction divine sur toute la communauté. »
        </div>
      </div>

      {/* Adab du Pèlerin (Convenances de la Ziyâra) */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-3">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0E4D3C]">
            L'Adab du Pèlerin (Convenances de la Ziyâra et du Gamou)
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Conseils pratiques et éthiques pour vivre une commémoration bénie à Tivaouane.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {adabRules.map((rule, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#D4A72C] shadow-xs hover:shadow-md transition-all space-y-2"
            >
              <h4 className="font-serif font-bold text-base text-[#0E4D3C]">
                {rule.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive FAQ Call to Action */}
      <div className="bg-[#0E4D3C] text-white rounded-3xl p-8 border border-[#D4A72C]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase text-[#D4A72C]">
            Questions Fréquentes sur le Gamou
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Une interrogation sur les horaires, les circuits ou les oraisons ?
          </h3>
          <p className="text-xs text-white/80">
            L'assistant doctrinal pèlerin vous répond avec les sources vérifiées de la Zawiya.
          </p>
        </div>

        <button
          onClick={onNavigateToChat}
          className="px-6 py-3 rounded-xl bg-[#D4A72C] hover:bg-[#E8C158] text-[#0E4D3C] font-bold text-xs sm:text-sm shadow-md whitespace-nowrap"
        >
          Consulter l'Assistant
        </button>
      </div>

    </div>
  );
};
