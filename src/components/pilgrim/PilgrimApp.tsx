import React, { useState } from 'react';
import { PilgrimNavbar, PilgrimTab } from './PilgrimNavbar';
import { PilgrimMobileBottomNav } from './PilgrimMobileBottomNav';
import { PilgrimFooter } from './PilgrimFooter';
import { PilgrimHomeView } from './PilgrimHomeView';
import { PilgrimBiographyView } from './PilgrimBiographyView';
import { PilgrimHadaraView } from './PilgrimHadaraView';
import { PilgrimGamouView } from './PilgrimGamouView';
import { PilgrimVideosView } from './PilgrimVideosView';
import { PilgrimLibraryView } from './PilgrimLibraryView';
import { PilgrimChatbotView } from './PilgrimChatbotView';
import { HadaraTasbihView } from '../user/HadaraTasbihView';

interface PilgrimAppProps {
  onOpenAdminWorkstation: () => void;
}

export const PilgrimApp: React.FC<PilgrimAppProps> = ({
  onOpenAdminWorkstation,
}) => {
  const [activePilgrimTab, setActivePilgrimTab] = useState<PilgrimTab>('home');

  const handleTabChange = (tab: PilgrimTab) => {
    setActivePilgrimTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="pilgrim-app-root" className="min-h-screen bg-[#F4F6F5] flex flex-col font-sans selection:bg-[#D4A72C]/30 selection:text-[#0E4D3C]">
      
      {/* Top Pilgrim Navigation Header */}
      <PilgrimNavbar
        activeTab={activePilgrimTab}
        setActiveTab={handleTabChange}
        onOpenAdmin={onOpenAdminWorkstation}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activePilgrimTab === 'home' && (
          <PilgrimHomeView
            onNavigateTab={handleTabChange}
            onOpenChatbot={() => handleTabChange('chatbot')}
            onNavigateToWorkstation={onOpenAdminWorkstation}
          />
        )}

        {activePilgrimTab === 'biography' && (
          <PilgrimBiographyView
            onNavigateToChat={() => handleTabChange('chatbot')}
          />
        )}

        {activePilgrimTab === 'hadara' && (
          <PilgrimHadaraView
            onNavigateToChat={() => handleTabChange('chatbot')}
          />
        )}

        {activePilgrimTab === 'gamou' && (
          <PilgrimGamouView
            onNavigateToChat={() => handleTabChange('chatbot')}
          />
        )}

        {activePilgrimTab === 'videos' && (
          <PilgrimVideosView />
        )}

        {activePilgrimTab === 'library' && (
          <PilgrimLibraryView
            onNavigateToChat={() => handleTabChange('chatbot')}
          />
        )}

        {activePilgrimTab === 'tasbih' && (
          <div className="py-2 sm:py-4">
            <HadaraTasbihView />
          </div>
        )}

        {activePilgrimTab === 'chatbot' && (
          <PilgrimChatbotView />
        )}
      </main>

      {/* Public Pilgrim Footer */}
      <PilgrimFooter
        setActiveTab={handleTabChange}
        onOpenAdmin={onOpenAdminWorkstation}
      />

      {/* Mobile Sticky Bottom Navigation */}
      <PilgrimMobileBottomNav
        activeTab={activePilgrimTab}
        setActiveTab={handleTabChange}
      />
    </div>
  );
};
