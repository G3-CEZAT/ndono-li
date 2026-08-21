import React from 'react';
import { PILGRIM_HOME_CONTENT } from '../../data/pilgrimHomeData';
import { 
  Landmark, 
  GraduationCap, 
  Sprout, 
  Users, 
  Compass, 
  CheckCircle2, 
  BookOpen, 
  Heart, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';

interface PilgrimHadaraViewProps {
  onNavigateToChat: () => void;
}

export const PilgrimHadaraView: React.FC<PilgrimHadaraViewProps> = ({
  onNavigateToChat,
}) => {
  const { hadara } = PILGRIM_HOME_CONTENT;

  const pillarDetails = [
    {
      number: 1,
      icon: GraduationCap,
      arabicTitle: 'التعليم النافع',
      title: 'Enseigner la science utile (At-Ta‘lîm)',
      summary: "La priorité absolue de Seydi El Hadji Malick Sy : former les esprits par l'apprentissage du Coran, du Fiqh malikite, de la langue arabe et de la spiritualité sans distinction d'origine.",
      actions: [
        "Création d'un maillage d'écoles (Daaras) dans tout le Sénégal",
        "Formation de muqaddams et maîtres itinérants à l'académie de Ndiarndé",
        "Promotion de l'alphabétisation en arabe et en caractères 'Ajami (wolofal)",
        "Traduction et vulgarisation des concepts théologiques pour le peuple"
      ],
      citation: "« Le premier devoir du musulman après la foi est d'acquérir la science qui rend son adoration valide. »",
    },
    {
      number: 2,
      icon: Landmark,
      arabicTitle: 'بناء المساجد والزوايا',
      title: 'Édifier des lieux de prière (Al-Masâjid)',
      summary: "L'organisation spatiale et spirituelle de la société : bâtir des mosquées et des zawiyas comme havres de paix, d'unité confraternelle et de récitation quotidienne des oraisons.",
      actions: [
        "Édification de la Grande Zawiya de Tivaouane et de mosquées régionales",
        "Institutionnalisation de la Wadhîfa communautaire et de la Haylala du vendredi",
        "Lieux de conciliation des litiges civils et d'accueil des voyageurs",
        "Espaces sacrés de prière et de recueillement sous la pureté rituelle"
      ],
      citation: "« Les demeures de Dieu sur terre sont Ses mosquées ; quiconque les fréquente trouve la paix intérieure. »",
    },
    {
      number: 3,
      icon: Sprout,
      arabicTitle: 'الفلاحة والعمل',
      title: 'Cultiver la terre et sanctifier le travail (Al-Filâha)',
      summary: "Le projet économique et social : l'autonomie par l'agriculture, le travail de la terre, la dignité citoyenne et le refus de toute dépendance matérielle.",
      actions: [
        "Champs collectifs et individuels dans le Cayor, Walo et Djolof",
        "Éducation des disciples à l'autosuffisance alimentaire et au labeur honnête",
        "Interdiction morale de la mendicité et de la passivité économique",
        "Sanctification de l'effort physique comme acte d'adoration à part entière"
      ],
      citation: "« Mangez de ce que vos mains ont produit et préservez la dignité de votre foi par le travail assidu. »",
    },
    {
      number: 4,
      icon: Users,
      arabicTitle: 'جمع الكلمة والمولد',
      title: 'Rassembler la communauté (Al-Jam‘ / Le Gamou)',
      summary: "Le rassemblement unitaire par excellence : instituer la commémoration annuelle du Mawlid (Gamou) pour régénérer l'amour du Prophète (PSL) et souder la fraternité humaine.",
      actions: [
        "Lancement du Gamou annuel dès 1902 à Tivaouane",
        "Rassemblement de disciples de toutes les ethnies (Wolofs, Peuls, Sérères, Mandingues)",
        "Récitation poétique du Khilâs az-Zahab et chants d'éloge prophétique",
        "Plaidoyer constant pour la paix sociale et la coexistence harmonieuse"
      ],
      citation: "« Rassembler les croyants autour de l'amour de l'Élu de Dieu est le remède aux divisions du siècle. »",
    },
  ];

  return (
    <div id="pilgrim-hadara-view" className="space-y-12 pb-16 text-[#1A1A1A]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0E4D3C] via-[#09372B] to-[#072B21] text-white p-8 sm:p-12 rounded-3xl border-2 border-[#D4A72C]/40 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4A72C]/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4A72C] text-[#0E4D3C] inline-flex items-center gap-1.5 font-mono">
            <Landmark className="w-3.5 h-3.5" />
            Doctrine & Organisation Sociale
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            La Hadara Tidiane : Les 4 Piliers Fondateurs
          </h1>
          <p className="text-[#E8C158] font-serif text-sm sm:text-base italic">
            « Science, Spiritualité, Travail et Rassemblement fraternel »
          </p>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed pt-2">
            Seydi El Hadji Malick Sy a légué un modèle de société harmonieux, où l'élévation spirituelle ne se sépare jamais de l'engagement citoyen et du développement humain.
          </p>
        </div>
      </div>

      {/* 4 Pillars In-Depth Breakdown */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillarDetails.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <div 
                key={pillar.number}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 hover:border-[#D4A72C] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  {/* Top Badge & Arabic Title */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#0E4D3C] text-[#D4A72C] flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#0E4D3C] bg-[#0E4D3C]/10 px-2.5 py-1 rounded-full">
                        Pilier 0{pillar.number}
                      </span>
                      <div className="text-xs text-[#D4A72C] font-serif font-bold mt-1" dir="rtl">
                        {pillar.arabicTitle}
                      </div>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#0E4D3C] group-hover:text-[#1A6B54] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-2">
                      {pillar.summary}
                    </p>
                  </div>

                  {/* Action Points */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="text-xs font-bold font-mono text-gray-500 uppercase">
                      Applications Concrètes de Maodo :
                    </div>
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      {pillar.actions.map((act, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0E4D3C] flex-shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Citation */}
                <div className="pt-3 border-t border-gray-100 bg-[#F4F6F5] p-3 rounded-2xl">
                  <p className="text-xs text-[#0E4D3C] italic font-serif">
                    {pillar.citation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Capitale Spirituelle Box */}
      <div className="bg-[#0E4D3C] text-white rounded-3xl p-8 border-2 border-[#D4A72C]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-mono font-bold uppercase text-[#D4A72C]">
            Rayonnement & Perpétuation
          </span>
          <h3 className="text-2xl font-serif font-bold text-white">
            Tivaouane : Capitale Spirituelle de la Tijâniyya
          </h3>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Sous la guidance des vénérés Khalifes successifs (Serigne Babacar Sy, El Hadji Mansour Sy, El Hadji Abdoul Aziz Sy Dabakh, Serigne Mansour Sy Borom Daara Ji, Serigne Cheikh Tidiane Sy Al Makhtoum, Serigne Abdoul Aziz Sy Al Amine, Serigne Babacar Sy Mansour), Tivaouane perpétue ce modèle avec fidélité et ouverture.
          </p>
        </div>

        <button
          onClick={onNavigateToChat}
          className="px-6 py-3.5 rounded-2xl bg-[#D4A72C] hover:bg-[#E8C158] text-[#0E4D3C] font-bold text-xs sm:text-sm shadow-lg whitespace-nowrap transition-transform hover:scale-105"
        >
          Poser une question sur la Hadara
        </button>
      </div>

    </div>
  );
};
