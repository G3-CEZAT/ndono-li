import React, { useState, useEffect } from 'react';
import zawiyaLogo from '../../assets/images/zawiya_logo_emblem_1787278632309.jpg';
import { 
  Compass, 
  BookOpen, 
  Landmark, 
  Calendar, 
  Play, 
  MessageSquare, 
  Library, 
  Menu, 
  X,
  Flame,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export type PilgrimTab = 'home' | 'biography' | 'hadara' | 'gamou' | 'videos' | 'chatbot' | 'library' | 'tasbih';

interface PilgrimNavbarProps {
  activeTab: PilgrimTab;
  setActiveTab: (tab: PilgrimTab) => void;
  onOpenAdmin?: () => void;
}

export const PilgrimNavbar: React.FC<PilgrimNavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks: { id: PilgrimTab; label: string; shortLabel?: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Accueil', shortLabel: 'Accueil', icon: Compass },
    { id: 'biography', label: 'Vie de Maodo', shortLabel: 'Maodo', icon: BookOpen },
    { id: 'hadara', label: 'Les 4 Piliers', shortLabel: '4 Piliers', icon: Landmark },
    { id: 'gamou', label: 'Gamou 2026', shortLabel: 'Gamou', icon: Calendar },
    { id: 'tasbih', label: 'Tasbîh & Wird', shortLabel: 'Tasbîh', icon: Flame },
    { id: 'library', label: 'Traités & Écrits', shortLabel: 'Traités', icon: Library },
    { id: 'videos', label: 'Médiathèque', shortLabel: 'Vidéos', icon: Play },
    { id: 'chatbot', label: 'Hadara IA', shortLabel: 'Hadara IA', icon: MessageSquare },
  ];

  const handleNavClick = (tab: PilgrimTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0E4D3C] text-white border-b-2 border-[#D4A72C] shadow-lg">
      {/* Top micro announcement bar - Fully responsive */}
      <div className="bg-[#072B21] px-3 sm:px-6 py-1 text-[10px] sm:text-[11px] text-[#E8C158] font-mono border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate max-w-full">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D4A72C] animate-pulse flex-shrink-0" />
          <span className="truncate">Portail Spirituel — Hadara Tidiane de Tivaouane</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[10px] text-white/70 font-sans flex-shrink-0">
          <span>Zawiya Tijaniyya</span>
          <span>•</span>
          <span className="text-[#E8C158] font-mono">Mawlid 1448 H / 2026</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo & Title */}
          <button 
            id="brand-header-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 text-left group flex-shrink-0 min-w-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl p-0.5 bg-gradient-to-tr from-[#D4A72C] via-[#0E4D3C] to-[#E8C158] shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[10px] sm:rounded-[14px] bg-[#072B21] overflow-hidden flex items-center justify-center border border-white/10">
                <img 
                  src={zawiyaLogo} 
                  alt="Logo Zawiya Tijaniyya" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-serif font-bold text-sm sm:text-base md:text-lg tracking-wide text-white group-hover:text-[#E8C158] transition-colors leading-tight truncate">
                  Hadara Tidiane
                </span>
                <span className="hidden sm:inline-block px-1.5 sm:px-2 py-0.5 rounded-md bg-[#D4A72C] text-[#0E4D3C] text-[9px] sm:text-[10px] font-bold font-mono flex-shrink-0">
                  Tivaouane
                </span>
              </div>
              <p className="text-[9px] sm:text-[11px] md:text-xs text-[#E8C158] font-serif italic truncate max-w-[150px] sm:max-w-[240px] md:max-w-none">
                Enseignements de Seydi El Hadji Malick Sy (RTA)
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links (For screens >= 1280px - xl) */}
          <nav className="hidden xl:flex items-center gap-1 flex-shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              const isChat = link.id === 'chatbot';

              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-2.5 2xl:px-3.5 py-1.5 2xl:py-2 rounded-xl text-xs 2xl:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#D4A72C] text-[#0E4D3C] shadow-md font-bold'
                      : isChat
                      ? 'bg-white/10 text-[#E8C158] hover:bg-white/20 border border-[#D4A72C]/40'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 2xl:w-4 2xl:h-4 flex-shrink-0 ${isActive ? 'text-[#0E4D3C]' : isChat ? 'text-[#D4A72C]' : 'text-white/70'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Medium Screens Navigation Links (For screens between 1024px and 1279px - lg) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1 flex-shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              const isChat = link.id === 'chatbot';

              return (
                <button
                  key={link.id}
                  id={`nav-link-md-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  title={link.label}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#D4A72C] text-[#0E4D3C] shadow-sm font-bold'
                      : isChat
                      ? 'bg-white/15 text-[#E8C158] border border-[#D4A72C]/40'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#0E4D3C]' : isChat ? 'text-[#D4A72C]' : 'text-white/70'}`} />
                  <span>{link.shortLabel || link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile & Tablet Actions (< 1024px) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden flex-shrink-0">
            {/* Quick Hadara IA button for mobile & tablet */}
            <button
              id="mobile-nav-chatbot"
              onClick={() => handleNavClick('chatbot')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                activeTab === 'chatbot'
                  ? 'bg-[#D4A72C] text-[#0E4D3C]'
                  : 'bg-white/10 text-[#E8C158] border border-[#D4A72C]/40 hover:bg-white/20'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4A72C]" />
              <span className="font-medium">Hadara IA</span>
            </button>

            {/* Hamburger / Close Button */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#D4A72C]"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu de navigation"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#E8C158]" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu with full backdrop */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-start">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-down Drawer Panel */}
          <div className="relative z-50 bg-[#072B21] border-b-2 border-[#D4A72C] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header in Drawer */}
            <div className="px-4 py-3 bg-[#0E4D3C] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4A72C] animate-pulse" />
                <span className="text-xs font-mono font-bold text-[#E8C158] tracking-wider uppercase">
                  Menu Hadara Tidiane
                </span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Nav Links list */}
            <div className="px-3 py-3 space-y-1.5 overflow-y-auto overscroll-contain flex-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                const isChat = link.id === 'chatbot';

                return (
                  <button
                    key={link.id}
                    id={`mobile-link-${link.id}`}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-all active:scale-[0.99] ${
                      isActive
                        ? 'bg-[#D4A72C] text-[#0E4D3C] font-bold shadow-md'
                        : isChat
                        ? 'bg-white/10 text-[#E8C158] border border-[#D4A72C]/40 hover:bg-white/15'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-[#0E4D3C] text-[#D4A72C]' : 'bg-white/10 text-[#D4A72C]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{link.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isChat && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D4A72C] text-[#0E4D3C] font-bold">
                          IA
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#0E4D3C]' : 'text-white/40'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer note */}
            <div className="p-3 bg-[#051F18] border-t border-white/10 text-center text-[10px] text-white/60 font-serif italic">
              Zawiya Tijaniyya de Tivaouane • Édition Mawlid 1448 H
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


