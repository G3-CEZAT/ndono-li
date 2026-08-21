import React from 'react';
import zawiyaLogo from '../../assets/images/zawiya_logo_emblem_1787278632309.jpg';
import { 
  LayoutDashboard,
  Inbox, 
  History, 
  BookOpen, 
  UploadCloud, 
  Cpu, 
  BarChart3, 
  ShieldCheck, 
  Sparkles,
  Compass
} from 'lucide-react';
import { ActiveTab, ScholarProfile } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingCount: number;
  currentScholar: ScholarProfile;
  scholars: ScholarProfile[];
  onSwitchScholar: (scholar: ScholarProfile) => void;
  onReturnToPilgrimView?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount,
  currentScholar,
  scholars,
  onSwitchScholar,
  onReturnToPilgrimView,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Tableau de Bord',
      subtitle: 'Vue d’ensemble & Héritage',
      icon: LayoutDashboard,
    },
    {
      id: 'queue' as ActiveTab,
      label: 'File de Validation',
      subtitle: 'Réponses RAG à certifier',
      icon: Inbox,
      badge: pendingCount > 0 ? pendingCount : undefined,
      badgeColor: 'bg-[#D4A72C] text-[#0E4D3C]',
    },
    {
      id: 'upload' as ActiveTab,
      label: 'Ingestion & Fichiers',
      subtitle: 'Upload PDF & DB Vectorielle',
      icon: UploadCloud,
    },
    {
      id: 'history' as ActiveTab,
      label: 'Historique & Certificats',
      subtitle: 'Audit des décisions',
      icon: History,
    },
    {
      id: 'corpus' as ActiveTab,
      label: 'Corpus de Maodo',
      subtitle: 'Ouvrages & sources certifiées',
      icon: BookOpen,
    },
    {
      id: 'simulator' as ActiveTab,
      label: 'Simulateur RAG',
      subtitle: 'Test de requêtes & sources',
      icon: Cpu,
    },
    {
      id: 'metrics' as ActiveTab,
      label: 'Métriques & API',
      subtitle: 'Flux mobile & précision',
      icon: BarChart3,
    },
  ];

  return (
    <aside 
      id="admin-sidebar"
      className="w-72 bg-[#0E4D3C] text-white flex flex-col flex-shrink-0 min-h-screen border-r border-[#1A6B54] select-none shadow-lg"
    >
      {/* Top Header / Hadara Tidiane Emblem */}
      <div className="p-4 border-b border-[#1A6B54] bg-[#09372B]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl border-2 border-[#D4A72C] bg-[#0E4D3C] overflow-hidden flex items-center justify-center shadow-md flex-shrink-0">
            <img 
              src={zawiyaLogo} 
              alt="Hadara Tidiane Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A72C]">
                Hadara Tidiane
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-sm font-semibold text-white truncate">
              Espace Érudits & Admin
            </h1>
            <p className="text-[11px] text-[#E8C158] font-serif italic truncate">
              Seydi El Hadji Malick Sy (RTA)
            </p>
          </div>
        </div>
      </div>

      {/* Back to Pilgrim Public View Button */}
      {onReturnToPilgrimView && (
        <div className="px-3 pt-3">
          <button
            onClick={onReturnToPilgrimView}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#D4A72C] hover:bg-[#E8C158] text-[#0E4D3C] font-bold text-xs shadow-md transition-all duration-200"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>← Espace Pèlerins (Public)</span>
          </button>
        </div>
      )}

      {/* Active Scholar Switcher */}
      <div className="p-3 mx-3 my-2.5 bg-[#1A6B54]/40 rounded-xl border border-[#D4A72C]/20 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase text-[#E8C158] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#D4A72C]" />
            Érudit Actif
          </span>
          <span className="font-mono text-[9px] text-white/70 bg-black/20 px-1 py-0.5 rounded">
            {currentScholar.signatureCertId}
          </span>
        </div>
        
        <div className="font-semibold text-white text-xs truncate">
          {currentScholar.name}
        </div>

        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-white/60">Changer :</span>
          <select 
            id="scholar-role-switcher"
            value={currentScholar.id}
            onChange={(e) => {
              const selected = scholars.find(s => s.id === e.target.value);
              if (selected) onSwitchScholar(selected);
            }}
            className="bg-[#09372B] text-white border border-[#D4A72C]/30 text-[10px] rounded px-1.5 py-0.5 focus:outline-none focus:border-[#D4A72C] max-w-[140px] truncate"
          >
            {scholars.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name.split(' ')[0]} {s.name.split(' ')[1] || ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="px-2 flex-1 overflow-y-auto space-y-1 py-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                isActive
                  ? 'bg-[#1A6B54] text-white font-medium shadow-sm border-l-4 border-[#D4A72C]'
                  : 'text-white/80 hover:bg-[#1A6B54]/30 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#0E4D3C] text-[#D4A72C]' : 'bg-black/15 text-white/70 group-hover:text-[#E8C158]'}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold leading-tight">{item.label}</div>
                  <div className="text-[10px] text-white/60 truncate">
                    {item.subtitle}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ml-2 shadow-sm ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#1A6B54] bg-[#09372B] text-xs">
        <div className="flex items-center justify-between text-white/70 text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            API RAG Mobile
          </span>
          <span className="font-mono text-[#D4A72C]">En direct</span>
        </div>
      </div>
    </aside>
  );
};
