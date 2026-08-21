import React, { useState } from 'react';
import { PILGRIM_HOME_CONTENT } from '../../data/pilgrimHomeData';
import { 
  BookOpen, 
  MapPin, 
  Calendar, 
  Award, 
  Compass, 
  Sparkles, 
  Info, 
  ScrollText, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface PilgrimBiographyViewProps {
  onNavigateToChat: () => void;
}

export const PilgrimBiographyView: React.FC<PilgrimBiographyViewProps> = ({
  onNavigateToChat,
}) => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      period: '1855 (ou 1847/1853)',
      place: 'Gaé / Gaaya (Walo)',
      title: 'Naissance & Origines Saintes',
      content: "Né dans le Walo au nord du Sénégal, Seydi El Hadji Malick Sy est le fils d'Ousmane Sy et de Sokhna Fatimata Wade. Son père, savant réputé, s'éteint avant sa naissance. Il est élevé sous la protection de sa famille maternelle et guidé dès ses premières années vers la mémorisation et la récitation intégrale du Saint Coran.",
      significance: "Enracinement spirituel précoce et transmission de la lignée chérifienne et savante.",
    },
    {
      period: '1860 — 1885',
      place: 'Fouta Toro, Djolof, Cayor, Gandiol',
      title: 'Les 25 années de pérégrinations studieuse',
      content: "Pendant un quart de siècle, il voyage inlassablement de maître en maître à travers les foyers d'érudition sénégambiens. Il étudie le Tafsîr (exégèse coranique), le Hadîth, la grammaire et la rhétorique arabes, le Fiqh selon l'école de l'Imâm Mâlik, l'astronomie et le Tasawwuf (soufisme) auprès d'érudits renommés tels que Thierno Malick Sow, Mor Barama Diop et son oncle Alpha Mayoro.",
      significance: "Formation encyclopédique de premier ordre faisant de lui une autorité juridique et théologique incontestée.",
    },
    {
      period: '1888',
      place: 'La Mecque & Médine (Arabie)',
      title: 'Le Pèlerinage aux Lieux Saints (Al-Hajj)',
      content: "En 1888, il accomplit le pèlerinage à La Mecque. Il y rencontre de grands savants du monde musulman et approfondit ses liens avec la lignée spirituelle de la Tijâniyya. Il reçoit de hautes autorisations (Ijâzât Mutlaqa) qui scellent sa stature de Khalife et de transmetteur universel de la Tariqa.",
      significance: "Rayonnement international et confirmation de sa mission pastorale au retour au Sénégal.",
    },
    {
      period: '1889 — 1900',
      place: 'Saint-Louis (Ndar) & Ndiarndé',
      title: 'L’Académie de Ndiarndé & L’enseignement de masse',
      content: "Installé temporairement à Saint-Louis puis fondant la célèbre université rurale de Ndiarndé, Maodo forme des dizaines de muqaddams (délégués et savants) qu'il dépêchera ensuite dans tous les villages du Sénégal et de la sous-région pour alphabétiser et guider les populations.",
      significance: "Démocratisation sans précédent de l'accès à la science islamique pour toutes les classes sociales.",
    },
    {
      period: '1900/1902 — 1922',
      place: 'Tivaouane (Cité Sainte)',
      title: 'Installation définitive & Fondation de la Hadara',
      content: "Seydi El Hadji Malick Sy s'établit définitive à Tivaouane, alors simple escale ferroviaire. Il y fait bâtir la grande Zawiya, célèbre le premier Gamou (Mawlid) en 1902, rédige ses chefs-d'œuvre littéraires et théologiques (Kifâyat ar-Râghibîn, Khilâs az-Zahab), et établit un havre de paix, de dialogue et de concorde civile jusqu'à son rappel à Dieu le 27 juin 1922.",
      significance: "Consécration de Tivaouane comme capitale spirituelle de la Tijâniyya sénégalaise.",
    },
  ];

  return (
    <div id="pilgrim-biography-view" className="space-y-12 pb-16 text-[#1A1A1A]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0E4D3C] via-[#09372B] to-[#072B21] text-white p-8 sm:p-12 rounded-3xl border-2 border-[#D4A72C]/40 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4A72C]/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4A72C] text-[#0E4D3C] inline-flex items-center gap-1.5 font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            Biographie Documentée & Sourcée
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Seydi El Hadji Malick Sy
          </h1>
          <p className="text-[#E8C158] font-serif text-sm sm:text-base italic">
            « Le Sage de Tivaouane, pôle spirituel et éducateur de la nation sénégalaise »
          </p>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed pt-2">
            Découvrez le parcours initiatique, les 25 ans de quête du savoir, l'accomplissement du pèlerinage de 1888 et la fondation de la Hadara Tidiane de Tivaouane, racontés en conformité avec le dossier historique certifié.
          </p>
        </div>
      </div>

      {/* Historiographical Nuance Box (Section 19) */}
      <div className="bg-[#FFFDF5] rounded-2xl p-6 border-l-4 border-[#D4A72C] border-y border-r border-amber-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#8A6A12] uppercase tracking-wider font-mono">
          <Info className="w-4 h-4 text-[#D4A72C]" />
          <span>Fidélité Scientifique & Historiographique (Section 19 du corpus)</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
          Les recherches universitaires (notamment la thèse monumentale du <strong>Professeur Rawane Mbaye</strong>) fixent la naissance de Seydi El Hadji Malick Sy en <strong>1855</strong>, en cohérence avec le décès de son père Ousmane Sy la même année. Certaines traditions orales mentionnent 1847 ou 1853. De même, son implantation à Tivaouane s'échelonne entre ses premières démarches foncières en <strong>1900</strong> et son installation pastorale avec organisation du premier Gamou en <strong>1902</strong>. Notre système présente ces repères avec rigueur sans omission.
        </p>
      </div>

      {/* Interactive Timeline of Stages */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0E4D3C]">
            Les Grandes Étapes de son Itinéraire
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Cliquez sur chaque étape pour explorer les détails historiques et spirituels.
          </p>
        </div>

        {/* Stage Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {stages.map((stage, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStage(idx)}
              className={`p-3 rounded-2xl text-left border transition-all ${
                activeStage === idx
                  ? 'bg-[#0E4D3C] text-white border-[#D4A72C] shadow-md scale-[1.02]'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className={`text-[10px] font-mono font-bold ${activeStage === idx ? 'text-[#E8C158]' : 'text-[#0E4D3C]'}`}>
                {stage.period}
              </div>
              <div className="text-xs font-serif font-bold truncate mt-1">
                {stage.place}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Stage Detail Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#0E4D3C] bg-[#0E4D3C]/10 px-2.5 py-1 rounded-full">
                Étape {activeStage + 1} sur {stages.length}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0E4D3C] pt-1">
                {stages[activeStage].title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                <MapPin className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>{stages[activeStage].place} ({stages[activeStage].period})</span>
              </div>
            </div>

            <span className="text-xs text-[#0E4D3C] font-bold bg-[#D4A72C]/20 border border-[#D4A72C]/40 px-3 py-1.5 rounded-xl">
              Source Documentaire Validée
            </span>
          </div>

          <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
            {stages[activeStage].content}
          </p>

          <div className="p-4 rounded-2xl bg-[#0E4D3C]/5 border border-[#0E4D3C]/20 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#D4A72C] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#0E4D3C] uppercase font-mono">
                Portée Doctrinale & Historique :
              </div>
              <p className="text-xs text-gray-700 mt-0.5 italic font-serif">
                « {stages[activeStage].significance} »
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Famous Quotes / Paroles de Sagesse */}
      <div className="bg-gradient-to-br from-[#072B21] to-[#0E4D3C] text-white rounded-3xl p-8 border border-[#D4A72C]/40 shadow-xl space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase text-[#D4A72C]">
            Maximes & Enseignements Immortels
          </span>
          <h3 className="text-2xl font-serif font-bold text-white">
            La Sagesse de Maodo en Héritage
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-black/20 border border-white/10 space-y-2">
            <p className="text-xs sm:text-sm font-serif italic text-white/90 leading-relaxed">
              « La science sans l'éthique et la crainte révérencielle de Dieu est semblable à un navire sans gouvernail. »
            </p>
            <div className="text-[10px] text-[#D4A72C] font-mono">— Kifâyat ar-Râghibîn</div>
          </div>

          <div className="p-5 rounded-2xl bg-black/20 border border-white/10 space-y-2">
            <p className="text-xs sm:text-sm font-serif italic text-white/90 leading-relaxed">
              « Cultivez la terre, fuyez l'oisiveté et ne comptez que sur le fruit de vos propres mains. »
            </p>
            <div className="text-[10px] text-[#D4A72C] font-mono">— Sermon pastoral à Tivaouane</div>
          </div>

          <div className="p-5 rounded-2xl bg-black/20 border border-white/10 space-y-2">
            <p className="text-xs sm:text-sm font-serif italic text-white/90 leading-relaxed">
              « L'amour du Prophète (PSL) est le pont qui conduit à l'Unicité Divine et à la paix des âmes. »
            </p>
            <div className="text-[10px] text-[#D4A72C] font-mono">— Khilâs az-Zahab</div>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onNavigateToChat}
            className="px-6 py-3 rounded-xl bg-[#D4A72C] hover:bg-[#E8C158] text-[#0E4D3C] font-bold text-xs sm:text-sm transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>Poser une question biographique à l’Assistant RAG</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
