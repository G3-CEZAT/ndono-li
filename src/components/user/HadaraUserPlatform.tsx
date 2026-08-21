import React, { useState } from 'react';
import zawiyaLogo from '../../assets/images/zawiya_logo_emblem_1787278632309.jpg';
import { HadaraChatView } from './HadaraChatView';
import { HadaraCorpusView } from './HadaraCorpusView';
import { HadaraTasbihView } from './HadaraTasbihView';
import { HadaraZiyaraView } from './HadaraZiyaraView';
import { triggerHaptic } from '../../utils/audioFeedback';
import { 
  MessageSquare, 
  BookOpen, 
  Flame, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Moon,
  Clock
} from 'lucide-react';

export type UserTab = 'chat' | 'corpus' | 'tasbih' | 'ziyara';

interface HadaraUserPlatformProps {
  onOpenAdminPortal?: () => void;
}

export const HadaraUserPlatform: React.FC<HadaraUserPlatformProps> = ({ onOpenAdminPortal }) => {
  const [activeTab, setActiveTab] = useState<UserTab>('chat');
  const [chatTopic, setChatTopic] = useState<string | undefined>(undefined);

  const handleSwitchTab = (tab: UserTab) => {
    triggerHaptic(10);
    setActiveTab(tab);
    if (tab === 'chat') setChatTopic(undefined);
  };

  const handleAskAboutWork = (workTitle: string) => {
    triggerHaptic(15);
    setChatTopic(workTitle);
    setActiveTab('chat');
  };

  const navItems = [
    { 
      id: 'chat' as const, 
      label: 'Hadara IA', 
      sublabel: 'RAG Doctrinal',
      icon: MessageSquare, 
    },
    { 
      id: 'corpus' as const, 
      label: 'Traités', 
      sublabel: 'Écrits de Maodo',
      icon: BookOpen 
    },
    { 
      id: 'tasbih' as const, 
      label: 'Tasbîh', 
      sublabel: 'Chapelet virtuel',
      icon: Flame 
    },
    { 
      id: 'ziyara' as const, 
      label: 'Ziyâra', 
      sublabel: 'Gamou & Adab',
      icon: Compass 
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F5F4] text-[#1E2923] font-sans flex flex-col antialiased selection:bg-[#D4A72C]/30 selection:text-[#072B21]">
      
      {/* Sleek Mobile-First Top App Bar */}
      <header className="bg-[#072B21] text-white sticky top-0 z-40 border-b border-[#D4A72C]/25 shadow-sm backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-3.5 sm:px-5 py-2.5 flex items-center justify-between">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={zawiyaLogo}
                alt="Hadara Tidiane"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D4A72C] object-cover shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#072B21]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif font-bold text-base sm:text-lg text-white tracking-wide leading-tight">
                  Hadara Tidiane
                </h1>
                <span className="text-[9px] bg-[#D4A72C] text-[#072B21] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                  Pèlerin
                </span>
              </div>
              <p className="text-[11px] text-[#E8C158] font-sans truncate max-w-[200px] sm:max-w-xs leading-none mt-0.5">
                Zawiya de Tivaouane • Maodo (RTA)
              </p>
            </div>
          </div>

          {/* Right Header Status / Quick Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tivaouane Time / Hijri Chip */}
            <div className="bg-[#0E4D3C]/80 border border-[#D4A72C]/30 rounded-xl px-2.5 py-1 text-right flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-[#D4A72C] hidden xs:block" />
              <div>
                <div className="text-[10px] sm:text-xs font-serif text-[#D4A72C] font-semibold leading-tight">
                  Gamou 1448 H
                </div>
                <div className="text-[9px] text-white/70 font-mono leading-none">
                  Tivaouane la Sainte
                </div>
              </div>
            </div>

            {/* Subtle Desktop Switch to Admin if available */}
            {onOpenAdminPortal && (
              <button
                onClick={() => {
                  triggerHaptic(10);
                  onOpenAdminPortal();
                }}
                className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-white/60 hover:text-[#D4A72C] p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                title="Accès Érudits & Administration"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Érudits</span>
              </button>
            )}
          </div>

        </div>

        {/* Desktop Tab Strip */}
        <div className="hidden md:block bg-[#09372B] border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-1.5 flex items-center justify-between">
            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSwitchTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#D4A72C] text-[#072B21] font-bold shadow-xs'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">({item.sublabel})</span>
                  </button>
                );
              })}
            </nav>

            <div className="text-[11px] font-mono text-white/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Médiation RAG Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main View Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-5 py-3 sm:py-5 flex flex-col justify-start pb-24 md:pb-12">
        {activeTab === 'chat' && (
          <HadaraChatView initialTopic={chatTopic} />
        )}

        {activeTab === 'corpus' && (
          <HadaraCorpusView onAskAboutWork={handleAskAboutWork} />
        )}

        {activeTab === 'tasbih' && (
          <HadaraTasbihView />
        )}

        {activeTab === 'ziyara' && (
          <HadaraZiyaraView />
        )}
      </main>

      {/* Floating Modern Mobile Bottom Navigation Bar (Thumb Zone Optimized) */}
      <nav 
        aria-label="Navigation principale mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#072B21]/95 backdrop-blur-lg border-t border-[#D4A72C]/30 shadow-2xl px-2 py-1.5 pb-safe"
      >
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSwitchTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl min-h-[50px] transition-all touch-manipulation active:scale-95 ${
                  isActive
                    ? 'text-[#D4A72C]'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                {/* Active Pill Indicator */}
                {isActive && (
                  <span className="absolute inset-x-2 top-1 bottom-1 bg-[#D4A72C]/15 rounded-xl border border-[#D4A72C]/30 -z-10" />
                )}

                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                
                <span className={`text-[11px] font-sans font-semibold mt-0.5 tracking-tight leading-none ${isActive ? 'font-bold text-[#E8C158]' : ''}`}>
                  {item.label}
                </span>

                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[#D4A72C] mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Discreet Desktop Footer */}
      <footer className="hidden md:block bg-white border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-500">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono">
          <span className="text-[#0E4D3C] font-semibold">
            Hadara Tidiane © 2026
          </span>
          <span>•</span>
          <span>Zawiya de Tivaouane</span>
          <span>•</span>
          <span>Médiation Doctrinale RAG</span>
          <span>•</span>
          <a
            href="?portal=admin"
            onClick={(e) => {
              if (onOpenAdminPortal) {
                e.preventDefault();
                onOpenAdminPortal();
              }
            }}
            className="text-[#0E4D3C] hover:underline font-semibold"
          >
            Accès Collège des Érudits
          </a>
        </div>
      </footer>

    </div>
  );
};
