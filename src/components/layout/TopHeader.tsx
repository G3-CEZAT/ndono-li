import React from 'react';
import { 
  Search, 
  RefreshCw, 
  Bell, 
  BookMarked, 
  ShieldCheck, 
  Sparkles, 
  SlidersHorizontal 
} from 'lucide-react';
import { ActiveTab, ScholarProfile } from '../../types';

interface TopHeaderProps {
  activeTab: ActiveTab;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  pendingCount: number;
  currentScholar: ScholarProfile;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  searchQuery,
  setSearchQuery,
  pendingCount,
  currentScholar,
  onRefresh,
  isRefreshing,
}) => {
  const getTabDetails = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: "Tableau de Bord — Zawiya Tijaniyya",
          description: "Vue d'ensemble de la médiation RAG, héritage de Maodo, flux des requêtes et arbitrages des érudits.",
          badge: "Plateforme Active",
        };
      case 'queue':
        return {
          title: "File de Validation des Réponses RAG",
          description: "Examen critique, certification théologique et correction avant diffusion aux fidèles et pèlerins mobiles.",
          badge: `${pendingCount} en attente d'arbitrage`,
        };
      case 'upload':
        return {
          title: "Ingestion Vectorielle & Fichiers",
          description: "Téléversement de manuscrits PDF, textes originaux et enrichissement du RAG Tivaouane.",
          badge: "Pipeline Vectoriel Actif",
        };
      case 'history':
        return {
          title: "Registre Immuable & Traçabilité",
          description: "Historique complet des approbations, corrections et rejets signés par le collège des érudits.",
          badge: "Conforme Cahier des Charges",
        };
      case 'corpus':
        return {
          title: "Corpus de Référence — Seydi El Hadji Malick Sy (RTA)",
          description: "Textes originaux en arabe, traductions certifiées (Français & Wolof) et métadonnées vectorielles.",
          badge: "5 Ouvrages Indexés",
        };
      case 'simulator':
        return {
          title: "Simulateur RAG & Recherche Vectorielle",
          description: "Testez une question en direct pour inspecter les fragments du corpus extraits et la synthèse générée.",
          badge: "Module d'Évaluation",
        };
      case 'metrics':
        return {
          title: "Supervision Système & Contrat API Mobile",
          description: "Endpoints partagés, volume de requêtes, temps de validation et taux de certification théologique.",
          badge: "API v1.2 Connectée",
        };
    }
  };

  const details = getTabDetails();

  return (
    <header 
      id="admin-top-header"
      className="bg-white border-b border-[#E2E8E5] px-8 py-4.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-20 shadow-xs"
    >
      {/* Title & Context */}
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#0E4D3C] tracking-tight">
            {details.title}
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#0E4D3C]/10 text-[#0E4D3C] border border-[#0E4D3C]/20">
            {details.badge}
          </span>
        </div>
        <p className="text-xs text-[#5A6560] mt-0.5 max-w-2xl">
          {details.description}
        </p>
      </div>

      {/* Action Controls & Search */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Search input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-[#5A6560] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Rechercher question, source, érudit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4F6F5] border border-[#E2E8E5] text-xs text-[#1A1A1A] rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#D4A72C] focus:bg-white transition-colors"
          />
        </div>

        {/* Refresh button */}
        <button
          id="refresh-queue-btn"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Actualiser la file depuis le serveur backend"
          className="p-2 rounded-lg border border-[#E2E8E5] text-[#0E4D3C] hover:bg-[#F4F6F5] hover:border-[#1A6B54] transition-all flex items-center gap-1.5 text-xs font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#D4A72C]' : ''}`} />
          <span className="hidden sm:inline">Actualiser</span>
        </button>

        {/* Institutional signature pill */}
        <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-[#E2E8E5]">
          <div className="w-8 h-8 rounded-full bg-[#0E4D3C] text-[#D4A72C] flex items-center justify-center font-bold text-xs">
            {currentScholar.name.charAt(0)}
          </div>
          <div className="text-right">
            <div className="text-[11px] font-bold text-[#0E4D3C] leading-none">
              {currentScholar.name}
            </div>
            <div className="text-[10px] text-[#5A6560] font-mono mt-0.5">
              {currentScholar.signatureCertId}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
