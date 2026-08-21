import React, { useState } from 'react';
import zawiyaLogo from '../../assets/images/zawiya_logo_emblem_1787278632309.jpg';
import { PILGRIM_HOME_CONTENT, PILGRIM_CHAT_SAMPLES, PilgrimChatSample } from '../../data/pilgrimHomeData';
import { 
  BookOpen, 
  Sparkles, 
  Calendar, 
  Clock, 
  Play, 
  MessageSquare, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  ChevronRight, 
  GraduationCap, 
  Landmark, 
  Sprout, 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  Share2, 
  Info,
  Compass,
  ArrowRight,
  RefreshCw,
  Send,
  X
} from 'lucide-react';

import { PilgrimTab } from './PilgrimNavbar';

interface PilgrimHomeViewProps {
  onNavigateTab?: (tab: PilgrimTab) => void;
  onOpenChatbot?: () => void;
  onNavigateToWorkstation?: () => void;
}

export const PilgrimHomeView: React.FC<PilgrimHomeViewProps> = ({
  onNavigateTab,
  onOpenChatbot,
  onNavigateToWorkstation,
}) => {
  const [content, setContent] = useState(PILGRIM_HOME_CONTENT);
  const [selectedVideo, setSelectedVideo] = useState<typeof PILGRIM_HOME_CONTENT.videoResources.items[0] | null>(null);
  const [showHistoryNote, setShowHistoryNote] = useState<boolean>(true);
  
  // Interactive Chat Drawer / Quick Demo State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [selectedChatSample, setSelectedChatSample] = useState<PilgrimChatSample>(PILGRIM_CHAT_SAMPLES[0]);
  const [userCustomQuery, setUserCustomQuery] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<PilgrimChatSample[]>(PILGRIM_CHAT_SAMPLES);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const handleGoToTab = (tab: PilgrimTab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCustomQuery.trim()) return;

    setIsSynthesizing(true);
    const queryText = userCustomQuery;
    setUserCustomQuery('');

    // Simulate AI generation with source citation
    setTimeout(() => {
      const newResponse: PilgrimChatSample = {
        id: `query-${Date.now()}`,
        question: queryText,
        category: 'Doctrine & Histoire',
        answer: `En réponse à votre question sur « ${queryText} », les sources documentaires de Seydi El Hadji Malick Sy (RTA) soulignent la primauté du Coran, de la Sunna et de la modération spirituelle. Toute transmission dans la Hadara de Tivaouane est ancrée dans l'éthique musulmane et la préservation de la concorde fraternelle.`,
        isCertified: false, // Explicitly non-certified until human review
        theologicalNote: "Réponse générée en direct depuis les écrits de la Hadara — En attente d'arbitrage par les savants de la Zawiya.",
        sources: [
          {
            bookTitle: 'Kifâyat ar-Râghibîn',
            pageOrBayt: 'Section Éthique & Société',
            translationFr: "Les fondements de la droiture morale et de la science utile.",
          },
        ],
      };

      setChatHistory(prev => [newResponse, ...prev]);
      setSelectedChatSample(newResponse);
      setIsSynthesizing(false);
    }, 900);
  };

  return (
    <div id="pilgrim-home-view" className="space-y-12 pb-16 text-[#1A1A1A]">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0E4D3C] via-[#1A6B54] to-[#0E4D3C] text-white p-3.5 sm:p-4 rounded-2xl shadow-md border border-[#D4A72C]/40 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center font-bold flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#E8C158]">Portail Officiel des Pèlerins</span> — Hadara Tidiane de Tivaouane (Enseignements & Médiation Spirituelle)
          </div>
        </div>

        <button
          onClick={() => handleGoToTab('chatbot')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-[#E8C158] font-semibold text-xs transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Interroger Hadara IA</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. BLOC HÉRO */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section 
        id="bloc-hero" 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0E4D3C] via-[#09372B] to-[#072B21] text-white border-2 border-[#D4A72C]/30 shadow-2xl p-6 sm:p-10 lg:p-12"
      >
        {/* Background Islamic Arabesque Decors */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4A72C]/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#1A6B54]/30 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-8 space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4A72C] text-[#0E4D3C] shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0E4D3C]" />
                {content.hero.primaryBadge}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[#E8C158] border border-white/15">
                {content.hero.subBadge}
              </span>
              {content.hero.dates ? (
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-black/30 text-white/80 border border-white/10">
                  {content.hero.dates}
                </span>
              ) : null}
            </div>

            {/* Main Title & Role */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
                {content.hero.title}
              </h1>
              <p className="text-sm sm:text-base text-[#D4A72C] font-serif italic">
                {content.hero.honorific}
              </p>
              <h2 className="text-base sm:text-lg text-white/90 font-medium pt-1">
                {content.hero.role}
              </h2>
            </div>

            {/* Tagline */}
            <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed border-l-2 border-[#D4A72C] pl-4 italic">
              « {content.hero.tagline} »
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                id="hero-cta-ask-question"
                onClick={() => handleGoToTab('chatbot')}
                className="px-6 py-3 rounded-xl bg-[#D4A72C] hover:bg-[#E8C158] text-[#0E4D3C] font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
              >
                <MessageSquare className="w-4 h-4 text-[#0E4D3C] transition-transform group-hover:scale-110" />
                <span>Poser une question sur la Voie</span>
                <ArrowRight className="w-4 h-4 text-[#0E4D3C]" />
              </button>

              <button
                onClick={() => handleGoToTab('biography')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#D4A72C]" />
                <span>Découvrir la Biographie</span>
              </button>
            </div>
          </div>

          {/* Right Column: Logo & Sacred Emblem */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-56 sm:w-64 rounded-3xl p-1 bg-gradient-to-b from-[#D4A72C] via-[#0E4D3C] to-[#1A6B54] shadow-2xl">
              <div className="w-full rounded-[22px] bg-[#072B21] p-5 text-center flex flex-col items-center justify-center space-y-3 border border-white/10">
                <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#D4A72C] to-[#0E4D3C] overflow-hidden shadow-inner">
                  <img 
                    src={zawiyaLogo} 
                    alt="Logo Officiel Zawiya Tijaniyya" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#D4A72C] font-mono">
                    Cellule Zawiya
                  </div>
                  <div className="text-sm font-serif font-bold text-white mt-0.5">
                    Hadara Tidiane
                  </div>
                  <div className="text-[11px] text-[#E8C158] font-serif" dir="rtl">
                    مدينة تيفاوان المحروسة
                  </div>
                </div>
                <div className="w-full pt-2 border-t border-white/10 text-[10px] text-white/70">
                  Tivaouane — Capitale Spirituelle
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. QUI ÉTAIT MAODO — BIOGRAPHIE SYNTHÉTIQUE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="bloc-biographie" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E4D3C] font-mono flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#D4A72C]" />
              Origines & Pérégrinations
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0E4D3C] mt-1">
              {content.biography.title}
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {content.biography.subtitle}
            </p>
          </div>

          <button
            onClick={() => setShowHistoryNote(!showHistoryNote)}
            className="text-xs text-[#0E4D3C] bg-[#0E4D3C]/5 hover:bg-[#0E4D3C]/10 border border-[#0E4D3C]/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span>{showHistoryNote ? 'Masquer la note historiographique' : 'Consulter les repères historiques (Sec. 19)'}</span>
          </button>
        </div>

        {/* Narrative Summary */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm leading-relaxed text-gray-800 text-base space-y-4">
          <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-[#0E4D3C] first-letter:mr-2 first-letter:float-left">
            {content.biography.summary}
          </p>
        </div>

        {/* Historical Precision Alert (Section 19) */}
        {showHistoryNote && (
          <div className="bg-[#FFFDF5] rounded-2xl p-5 border-l-4 border-[#D4A72C] border-y border-r border-amber-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8A6A12] uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-[#D4A72C]" />
              <span>Rigueur Doctrinale & Historiographique (Section 19 du dossier documentaire)</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed font-sans">
              {content.biography.scholarlyNote}
            </p>
          </div>
        )}

        {/* Key Milestones Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {content.biography.keyMilestones.map((milestone, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-[#D4A72C] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-bold font-mono text-[#D4A72C] bg-[#0E4D3C] px-2.5 py-1 rounded-md inline-block">
                  {milestone.period}
                </span>
                <h3 className="font-serif font-bold text-base text-[#0E4D3C] group-hover:text-[#1A6B54] transition-colors pt-2">
                  {milestone.label}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {milestone.description}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>Étape 0{idx + 1}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0E4D3C]/40 group-hover:text-[#0E4D3C]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. LA HADARA MALIKIYYA — LE PROJET EN 4 POINTS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="bloc-hadara" className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E4D3C] font-mono flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-[#D4A72C]" />
            Vision & Organisation
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0E4D3C] mt-1">
            {content.hadara.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1 max-w-3xl leading-relaxed">
            {content.hadara.definition}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {content.hadara.pillars.map((pillar) => {
            const icons = [GraduationCap, Landmark, Sprout, Users];
            const PillarIcon = icons[pillar.number - 1] || Sparkles;

            return (
              <div 
                key={pillar.number}
                className="bg-gradient-to-br from-white to-[#F9FBFA] rounded-2xl p-6 border border-gray-200 hover:border-[#0E4D3C]/40 shadow-xs hover:shadow-md transition-all duration-200 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#0E4D3C] text-[#D4A72C] flex items-center justify-center font-bold text-lg shadow-sm">
                    <PillarIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0E4D3C] bg-[#0E4D3C]/10 px-2.5 py-1 rounded-full">
                    Pilier 0{pillar.number}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-[#0E4D3C]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-2">
                    {pillar.description}
                  </p>
                </div>

                {pillar.hadithOrPrinciple && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-[11px] text-[#0E4D3C] italic font-serif bg-[#0E4D3C]/5 p-2 rounded-lg">
                      {pillar.hadithOrPrinciple}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Status Box */}
        <div className="bg-[#0E4D3C] text-white rounded-2xl p-5 sm:p-6 border border-[#D4A72C]/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center font-bold flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase font-mono text-[#D4A72C] font-bold">
                Cité Sainte de Tivaouane
              </div>
              <p className="text-xs sm:text-sm text-white/90 font-serif mt-0.5">
                {content.hadara.statusTivaouane}
              </p>
            </div>
          </div>

          <button 
            onClick={() => handleGoToTab('library')}
            className="px-4 py-2 rounded-xl bg-[#D4A72C] text-[#0E4D3C] font-bold text-xs hover:bg-[#E8C158] transition-colors whitespace-nowrap"
          >
            Consulter les Traités
          </button>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. LE GAMOU — SECTION ACTUALITÉ / ÉVÉNEMENT 2026 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="bloc-gamou" className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4A72C] font-mono flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#D4A72C]" />
            Événement Majeur & Célébration
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0E4D3C] mt-1">
            Le Gamou de Tivaouane — Mawlid an-Nabawi
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Commémoration unitaire de la naissance du Prophète Mouhammad (PSL)
          </p>
        </div>

        {/* Dynamic Gamou 2026 Card */}
        <div className="bg-gradient-to-br from-[#09372B] via-[#0E4D3C] to-[#072B21] text-white rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-[#D4A72C]/40 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4A72C] text-[#0E4D3C]">
                {content.gamou.edition} (Édition {content.gamou.yearGregorian})
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/90 border border-white/15">
                {content.gamou.hijriDate}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#E8C158] font-mono">
              <Clock className="w-4 h-4 text-[#D4A72C]" />
              <span>{content.gamou.gregorianDate}</span>
            </div>
          </div>

          {/* Theme Display */}
          <div className="space-y-3 bg-black/20 p-5 rounded-2xl border border-white/10">
            <div className="text-xs font-mono uppercase tracking-wider text-[#D4A72C] font-bold">
              Thème Officiel retenu par le Comité Scientifique :
            </div>
            
            <div className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
              « {content.gamou.theme} »
            </div>

            <div className="text-base sm:text-lg font-serif text-[#E8C158] pt-1" dir="rtl">
              {content.gamou.themeArabic}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            {content.gamou.description}
          </p>

          {/* Notice for annual update */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-white/60 font-mono">
            <span>Structure éditable & paramétrable pour chaque édition annuelle</span>
            <span className="text-[#D4A72C] font-bold">Gamou 2026 Confirmé</span>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. RESSOURCES VIDÉO — HISTOIRE DE TIVAOUANE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="bloc-videos" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E4D3C] font-mono flex items-center gap-1.5">
              <Play className="w-4 h-4 text-[#D4A72C]" />
              Archives Audiovisuelles
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0E4D3C] mt-1">
              {content.videoResources.sectionTitle}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {content.videoResources.sectionDescription}
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Protocole : Vérification éditoriale humaine requise avant certification</span>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.videoResources.items.map((vid) => (
            <div
              key={vid.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#0E4D3C] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              {/* Top Video Preview Thumbnail Area */}
              <div className="relative aspect-video bg-[#072B21] flex items-center justify-center p-3 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Play Action Trigger */}
                <button
                  onClick={() => setSelectedVideo(vid)}
                  className="relative z-10 w-12 h-12 rounded-full bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>

                {/* Badge Category */}
                <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-[#E8C158] backdrop-blur-xs font-mono">
                  {vid.badge || vid.source}
                </span>

                {/* Duration */}
                {vid.duration && (
                  <span className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white">
                    {vid.duration}
                  </span>
                )}
              </div>

              {/* Video Info Content */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold font-mono text-[#0E4D3C] uppercase">
                    Source : {vid.source}
                  </div>
                  <h3 className="font-serif font-bold text-sm text-gray-900 group-hover:text-[#0E4D3C] transition-colors leading-snug line-clamp-2">
                    {vid.title}
                  </h3>
                  <div className="text-[11px] text-gray-500 italic">
                    {vid.narratorOrContext}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed pt-1">
                    {vid.synopsis}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedVideo(vid)}
                    className="text-[#0E4D3C] font-semibold hover:text-[#1A6B54] flex items-center gap-1 text-[11px]"
                  >
                    <span>Visionner</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Pré-revue
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. CTA & CHATBOT PÈLERIN (HADARA IA) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="bloc-chatbot" className="relative overflow-hidden rounded-3xl bg-[#0E4D3C] text-white p-6 sm:p-10 border-2 border-[#D4A72C]/40 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4A72C] text-[#0E4D3C] inline-flex items-center gap-1.5 font-mono">
              <MessageSquare className="w-3.5 h-3.5" />
              Hadara IA — Intelligence Spirituelle
            </span>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              {content.ctaChatbot.title}
            </h2>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl">
              {content.ctaChatbot.subtitle}
            </p>

            <div className="p-3.5 rounded-xl bg-black/20 border border-white/10 text-xs text-[#E8C158] flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D4A72C] flex-shrink-0" />
              <span>{content.ctaChatbot.ragCertificationNotice}</span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="btn-open-interactive-chat"
                onClick={() => setIsChatOpen(true)}
                className="px-6 py-3 rounded-xl bg-[#D4A72C] hover:bg-[#E8C158] text-[#0E4D3C] font-bold text-sm shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
              >
                <MessageSquare className="w-4 h-4 text-[#0E4D3C]" />
                <span>{content.ctaChatbot.buttonLabel}</span>
              </button>
            </div>
          </div>

          {/* Right Interactive Preview of Sample Q&A */}
          <div className="lg:col-span-4 bg-[#072B21] rounded-2xl p-4 border border-[#D4A72C]/30 text-xs space-y-3">
            <div className="text-[11px] font-bold font-mono text-[#D4A72C] uppercase border-b border-white/10 pb-2 flex items-center justify-between">
              <span>Exemples Fréquents Pèlerin</span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
            </div>

            <div className="space-y-2">
              {PILGRIM_CHAT_SAMPLES.slice(0, 3).map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setSelectedChatSample(sample);
                    setIsChatOpen(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white/90 text-xs flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{sample.question}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#D4A72C] flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* VIDEO MODAL PLAYER */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0E4D3C] text-white rounded-3xl max-w-2xl w-full overflow-hidden border border-[#D4A72C]/40 shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D4A72C] font-bold">
                  {selectedVideo.source}
                </span>
                <h3 className="font-serif font-bold text-base text-white">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player / External Notice */}
            <div className="bg-[#072B21] rounded-2xl p-6 text-center space-y-4 border border-white/10">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center shadow-lg">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">
                  {selectedVideo.narratorOrContext}
                </p>
                <p className="text-xs text-white/70 max-w-md mx-auto">
                  {selectedVideo.synopsis}
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={selectedVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D4A72C] text-[#0E4D3C] font-bold text-xs hover:bg-[#E8C158] transition-colors shadow-md"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Ouvrir la vidéo sur YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="text-[11px] text-white/60 bg-black/20 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#D4A72C] flex-shrink-0" />
              <span>Conformément aux directives, tout contenu vidéo est audité pour vérifier son adéquation pastorale.</span>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE CHATBOT DRAWER / MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-3xl max-w-3xl w-full h-[90vh] max-h-[750px] flex flex-col overflow-hidden border border-gray-200 shadow-2xl">
            
            {/* Chatbot Header */}
            <div className="p-4 bg-[#0E4D3C] text-white flex items-center justify-between border-b border-[#1A6B54]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#072B21] border border-[#D4A72C] p-1 flex items-center justify-center">
                  <img src={zawiyaLogo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                    <span>Hadara IA — Assistant des Pèlerins</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#D4A72C] text-[#0E4D3C] font-mono">
                      Sources Authentiques
                    </span>
                  </h3>
                  <p className="text-[10px] text-[#E8C158] font-serif">
                    Doctrines, Oraisons (Lâzim, Wadhîfa, Haylala) & Enseignements
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Doctrinal Quick Questions Selector */}
            <div className="bg-[#F4F6F5] p-2.5 border-b border-gray-200 overflow-x-auto flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-bold text-gray-500 uppercase whitespace-nowrap pl-1">
                Thèmes :
              </span>
              {PILGRIM_CHAT_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => setSelectedChatSample(sample)}
                  className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
                    selectedChatSample.id === sample.id
                      ? 'bg-[#0E4D3C] text-white shadow-xs'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {sample.category}
                </button>
              ))}
            </div>

            {/* Conversation Display Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50">
              
              {/* User Question Balloon */}
              <div className="flex justify-end">
                <div className="bg-[#0E4D3C] text-white rounded-2xl rounded-tr-xs p-4 max-w-xl text-xs sm:text-sm shadow-sm">
                  <div className="text-[10px] font-bold text-[#D4A72C] uppercase font-mono mb-1">
                    Question Pèlerin
                  </div>
                  <p>{selectedChatSample.question}</p>
                </div>
              </div>

              {/* Bot Response Balloon */}
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-xs p-4 sm:p-5 max-w-2xl border border-gray-200 shadow-sm space-y-3.5 text-xs sm:text-sm text-gray-800">
                  
                  {/* Doctrinal Status Badge */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    {selectedChatSample.isCertified ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Réponse Arbitrée & Certifiée par la Zawiya</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Généré par Hadara IA — En cours de révision</span>
                      </div>
                    )}

                    {selectedChatSample.certifiedBy && (
                      <span className="text-[10px] text-gray-400 font-mono">
                        {selectedChatSample.certifiedBy}
                      </span>
                    )}
                  </div>

                  {/* Body Text */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {selectedChatSample.answer}
                  </div>

                  {/* Sources Citation */}
                  {selectedChatSample.sources && selectedChatSample.sources.length > 0 && (
                    <div className="p-3 bg-[#F4F6F5] rounded-xl border border-gray-200 text-[11px] space-y-1.5">
                      <div className="font-bold text-[#0E4D3C] font-mono uppercase flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-[#D4A72C]" />
                        <span>Sources Textuelles du Corpus :</span>
                      </div>
                      {selectedChatSample.sources.map((src, i) => (
                        <div key={i} className="text-gray-700 pl-2 border-l-2 border-[#D4A72C]">
                          <strong className="text-[#0E4D3C]">{src.bookTitle}</strong> — {src.pageOrBayt} : <em>« {src.translationFr} »</em>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Theological Note */}
                  {selectedChatSample.theologicalNote && (
                    <div className="text-[11px] text-gray-500 italic bg-white p-2 rounded border border-gray-100">
                      💡 {selectedChatSample.theologicalNote}
                    </div>
                  )}
                </div>
              </div>

              {isSynthesizing && (
                <div className="flex items-center gap-2 text-xs text-[#0E4D3C] italic p-3 bg-emerald-50 rounded-xl border border-emerald-200 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4A72C]" />
                  <span>Recherche dans les écrits authentiques de Maodo en cours...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskQuestion} className="p-3 sm:p-4 bg-white border-t border-gray-200 flex items-center gap-2">
              <input
                type="text"
                value={userCustomQuery}
                onChange={(e) => setUserCustomQuery(e.target.value)}
                placeholder="Posez votre question sur les enseignements, les oraisons ou l'histoire..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:border-[#0E4D3C] focus:ring-1 focus:ring-[#0E4D3C]"
              />
              <button
                type="submit"
                disabled={isSynthesizing || !userCustomQuery.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#0E4D3C] hover:bg-[#1A6B54] text-[#D4A72C] font-bold text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-sm"
              >
                <span>Envoyer</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
