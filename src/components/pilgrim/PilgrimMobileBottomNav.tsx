import React from 'react';
import { PilgrimTab } from './PilgrimNavbar';
import { 
  Compass, 
  BookOpen, 
  Calendar, 
  Flame, 
  MessageSquare 
} from 'lucide-react';

interface PilgrimMobileBottomNavProps {
  activeTab: PilgrimTab;
  setActiveTab: (tab: PilgrimTab) => void;
}

export const PilgrimMobileBottomNav: React.FC<PilgrimMobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const items: { id: PilgrimTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Accueil', icon: Compass },
    { id: 'chatbot', label: 'Hadara IA', icon: MessageSquare },
    { id: 'tasbih', label: 'Tasbîh', icon: Flame },
    { id: 'gamou', label: 'Gamou', icon: Calendar },
    { id: 'biography', label: 'Maodo', icon: BookOpen },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E4D3C] text-white border-t border-[#D4A72C]/40 shadow-2xl px-2 py-1.5 backdrop-blur-md">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isChat = item.id === 'chatbot';

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#D4A72C] text-[#0E4D3C] font-bold shadow-sm scale-105'
                  : isChat
                  ? 'text-[#E8C158]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#0E4D3C]' : isChat ? 'text-[#D4A72C]' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
