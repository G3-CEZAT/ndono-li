import React, { useState } from 'react';
import zawiyaLogo from '../../assets/images/zawiya_logo_emblem_1787278632309.jpg';
import { StoryItem } from '../../data/mobileSpiritualData';
import { MobileStoriesModal } from './MobileStoriesModal';
import { MobileAudioPlayer } from './MobileAudioPlayer';
import { MobileFeedView } from './MobileFeedView';
import { MobileTasbihView } from './MobileTasbihView';
import { MobileChatView } from './MobileChatView';
import { MobileZiyaraView } from './MobileZiyaraView';
import { MobileLibraryGamouView } from './MobileLibraryGamouView';
import { 
  Home, 
  Flame, 
  MessageSquare, 
  Compass, 
  BookOpen, 
  Smartphone, 
  Maximize2, 
  Shield, 
  Sparkles, 
  Radio, 
  Bell, 
  Search,
  Volume2
} from 'lucide-react';

interface ModernMobilePlatformProps {
  onSwitchToScholarView: () => void;
}

type MobileTab = 'home' | 'tasbih' | 'chat' | 'ziyara' | 'library';

export const ModernMobilePlatform: React.FC<ModernMobilePlatformProps> = ({
  onSwitchToScholarView,
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('home');
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true); // Smartphone chassis vs Fluid Fullscreen
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F6F5] text-gray-900 font-sans flex flex-col items-center justify-start antialiased select-none">
      
      {/* Top Floating Control Bar (Desktop view control) */}
      <header className="w-full bg-[#072B21] text-white border-b border-[#D4A72C]/30 px-4 py-2.5 flex items-center justify-between shadow-md z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <img
            src={zawiyaLogo}
            alt="Zawiya Tivaouane"
            className="w-8 h-8 rounded-full border border-[#D4A72C] object-cover"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-sm text-white">
                Hadara Tivaouane Mobile
              </span>
              <span className="text-[10px] bg-[#D4A72C] text-[#0E4D3C] px-1.5 py-0.2 rounded font-mono font-bold">
                V2 Mobile
              </span>
            </div>
            <p className="text-[10px] text-[#E8C158] font-mono">
              Plateforme Pèlerin & Enseignements de Maodo (RTA)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Frame Toggle */}
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors border ${
              deviceFrameMode
                ? 'bg-[#D4A72C] text-[#0E4D3C] border-[#D4A72C] font-bold shadow-xs'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
            title="Basculer entre le cadre smartphone et le plein écran"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{deviceFrameMode ? 'Châssis Mobile' : 'Plein Écran'}</span>
          </button>

          {/* Scholar Dashboard Switcher */}
          <button
            onClick={onSwitchToScholarView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#E8C158] border border-[#D4A72C]/40 text-xs font-serif transition-colors"
            title="Accéder au tableau de bord administrateur & arbitrage"
          >
            <Shield className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span className="hidden sm:inline">Espace Érudits (Admin)</span>
            <span className="sm:hidden">Érudits</span>
          </button>
        </div>
      </header>

      {/* Main Container : Either Phone Chassis or Fluid Mobile Screen */}
      <main className="w-full flex-1 flex justify-center items-start p-0 sm:py-6">
        <div
          className={`w-full transition-all duration-300 ${
            deviceFrameMode
              ? 'max-w-[430px] min-h-[844px] bg-[#F7F9F8] sm:rounded-[44px] sm:border-[10px] sm:border-[#1A2E26] sm:shadow-[0_25px_60px_-15px_rgba(7,43,33,0.4)] overflow-hidden relative flex flex-col'
              : 'max-w-xl min-h-screen bg-[#F7F9F8] overflow-hidden relative flex flex-col'
          }`}
        >
          {/* Smartphone Top Notch / Dynamic Island Bar (Visual Touch) */}
          {deviceFrameMode && (
            <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 bg-[#072B21] text-white text-[11px] font-mono">
              <span>09:41</span>
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Mobile App Header (Inside App View) */}
          <div className="bg-[#072B21] text-white px-4 pt-3 pb-3.5 flex items-center justify-between border-b border-[#D4A72C]/30 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={zawiyaLogo}
                  alt="Zawiya"
                  className="w-9 h-9 rounded-full border border-[#D4A72C] object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#072B21] rounded-full" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-[#D4A72C] flex items-center gap-1">
                  <span>السلام عليكم</span>
                  <span>• 12 Rabî' 1448 H</span>
                </div>
                <h1 className="font-serif font-bold text-sm text-white leading-tight">
                  Tivaouane Pèlerin
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white relative transition-colors"
                title="Notifications Gamou"
              >
                <Bell className="w-4 h-4 text-[#E8C158]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4A72C] rounded-full animate-ping" />
              </button>
            </div>
          </div>

          {/* Notification Toast Modal */}
          {notificationOpen && (
            <div className="bg-[#0E4D3C] text-white p-3 mx-3 my-2 rounded-2xl text-xs border border-[#D4A72C] shadow-lg flex items-start justify-between gap-2 animate-fadeIn">
              <div className="space-y-0.5">
                <div className="font-bold text-[#D4A72C] font-serif">
                  Alerte Gamou 2026 :
                </div>
                <p className="text-[11px] text-white/90">
                  Wadhîfa collective à la Grande Zawiya ce soir à 17h15. Préparez vos ablutions à l'eau.
                </p>
              </div>
              <button
                onClick={() => setNotificationOpen(false)}
                className="text-white/60 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>
          )}

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto px-3.5 pt-3.5 pb-20 no-scrollbar">
            {activeTab === 'home' && (
              <MobileFeedView
                onOpenStory={(s) => setActiveStory(s)}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenAudio={() => {}}
              />
            )}

            {activeTab === 'tasbih' && <MobileTasbihView />}

            {activeTab === 'chat' && <MobileChatView />}

            {activeTab === 'ziyara' && <MobileZiyaraView />}

            {activeTab === 'library' && (
              <MobileLibraryGamouView
                onOpenChatWithTopic={() => setActiveTab('chat')}
              />
            )}
          </div>

          {/* Persistent Mini Audio Bar */}
          <MobileAudioPlayer currentTrackId="audio-khilas-01" />

          {/* Mobile Bottom Dock Navigation Bar */}
          <nav
            id="mobile-bottom-dock-nav"
            className="fixed sm:absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 flex items-center justify-around shadow-2xl"
          >
            {[
              { id: 'home' as const, label: 'Accueil', icon: Home },
              { id: 'tasbih' as const, label: 'Tasbîh', icon: Flame },
              { id: 'chat' as const, label: 'Assistant', icon: MessageSquare, highlight: true },
              { id: 'ziyara' as const, label: 'Ziyâra', icon: Compass },
              { id: 'library' as const, label: 'Savoirs', icon: BookOpen },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all relative ${
                    isActive
                      ? 'text-[#0E4D3C] font-bold scale-105'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-[#0E4D3C] text-[#D4A72C] shadow-md -translate-y-1'
                        : tab.highlight
                        ? 'bg-[#D4A72C]/20 text-[#0E4D3C]'
                        : 'text-gray-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-sans tracking-tight mt-0.5">
                    {tab.label}
                  </span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-[#D4A72C] -bottom-0.5 absolute" />
                  )}
                </button>
              );
            })}
          </nav>

        </div>
      </main>

      {/* Stories Full Screen Overlay Modal */}
      {activeStory && (
        <MobileStoriesModal
          story={activeStory}
          onClose={() => setActiveStory(null)}
        />
      )}

    </div>
  );
};
