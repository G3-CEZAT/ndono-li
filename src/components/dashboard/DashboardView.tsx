import React, { useState, useEffect } from 'react';
import zawiyaLogo from '../../assets/images/zawiya_logo_emblem_1787278632309.jpg';
import { 
  Inbox, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  UploadCloud, 
  Cpu, 
  History, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  AlertTriangle,
  FileText,
  Users,
  ChevronRight,
  Bookmark,
  Share2,
  Compass,
  Award,
  ScrollText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { RAGValidationItem, CorpusWork, ScholarProfile, ActiveTab } from '../../types';

interface DashboardViewProps {
  queueItems: RAGValidationItem[];
  historyItems: RAGValidationItem[];
  corpusWorks: CorpusWork[];
  currentScholar: ScholarProfile;
  onNavigate: (tab: ActiveTab) => void;
  onOpenReviewModal: (item: RAGValidationItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  queueItems,
  historyItems,
  corpusWorks,
  currentScholar,
  onNavigate,
  onOpenReviewModal,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Hero carousel slides inspired by Seydi El Hadji Malick Sy (RTA)
  const slides = [
    {
      badge: "Héritage vivant de",
      title: "Seydi El Hadji Malick Sy (RTA)",
      arabicTitle: "سيدي الحاج مالك سي رضي الله عنه",
      quote: "Transmettre la lumière, guider les cœurs, servir l'Humanité.",
      actionText: "Découvrir ses enseignements",
      targetTab: "corpus" as ActiveTab,
      highlight: "Tivaouane — Ville Sainte de la Tijaniyya",
    },
    {
      badge: "Traité Majeur d'Éthique & Fiqh",
      title: "Kifâyat ar-Râghibîn",
      arabicTitle: "كفاية الراغبين في حكم المسائل الشرعية",
      quote: "L'harmonie sociale, la probité et la concorde fraternelle au cœur de la cité.",
      actionText: "Consulter le manuscrit",
      targetTab: "corpus" as ActiveTab,
      highlight: "342 fragments vectorisés",
    },
    {
      badge: "Chef-d'œuvre de la Sîra",
      title: "Khilâs az-Zahab fî Sîrat Khayr al-'Arab",
      arabicTitle: "خلاص الذهب في سيرة خير العرب",
      quote: "L'or pur de la biographie prophétique, célébré lors des nuits du Gamou.",
      actionText: "Explorer les versets du Mawlid",
      targetTab: "corpus" as ActiveTab,
      highlight: "Panégyrique & Sîra",
    },
    {
      badge: "Doctrines & Voie Spirituelle",
      title: "Ifhâm al-Munkir al-Jânî",
      arabicTitle: "إفهام المنكر الجاني في الدفاع عن الطريقة",
      quote: "Rigueur des preuves théologiques et clarté doctrinale de la Tariqa Tijaniyya.",
      actionText: "Accéder au traité",
      targetTab: "corpus" as ActiveTab,
      highlight: "Théologie & Lazim",
    },
  ];

  // Auto rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Chart data: Weekly Activity
  const activityData = [
    { day: 'Lun', questions: 24, certifies: 22, urgents: 3 },
    { day: 'Mar', questions: 38, certifies: 35, urgents: 5 },
    { day: 'Mer', questions: 45, certifies: 42, urgents: 7 },
    { day: 'Jeu', questions: 52, certifies: 49, urgents: 8 },
    { day: 'Ven', questions: 85, certifies: 81, urgents: 14 },
    { day: 'Sam', questions: 68, certifies: 65, urgents: 9 },
    { day: 'Dim', questions: 56, certifies: 54, urgents: 6 },
  ];

  // Chart data: Category distribution
  const categoryData = [
    { name: 'Tariqa Tijaniyya', value: 38, color: '#0E4D3C' },
    { name: 'Fiqh & Pratiques', value: 26, color: '#1A6B54' },
    { name: 'Sîra & Hadith', value: 18, color: '#D4A72C' },
    { name: 'Éthique & Société', value: 12, color: '#E8C158' },
    { name: 'Poésie & Qasaid', value: 6, color: '#3B82F6' },
  ];

  const currentSlide = slides[activeSlide];
  const urgentCount = queueItems.filter((i) => i.priority === 'urgent').length;
  const recentValidations = historyItems.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER - HERITAGE SEYDI EL HADJI MALICK SY (RTA) */}
      <div 
        id="hero-heritage-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0E4D3C] via-[#0B4032] to-[#072B21] text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-[#1A6B54]"
      >
        {/* Subtle Islamic Geometric Star Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="islamic-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#D4A72C" strokeWidth="1" />
                <circle cx="30" cy="30" r="12" fill="none" stroke="#D4A72C" strokeWidth="0.8" />
                <path d="M0 0 L60 60 M60 0 L0 60" stroke="#D4A72C" strokeWidth="0.5" strokeDasharray="2 2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-grid)" />
          </svg>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#D4A72C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#1A6B54]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A6B54]/70 border border-[#D4A72C]/40 text-[#E8C158] text-xs font-semibold backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#D4A72C] animate-pulse" />
              <span>{currentSlide.badge}</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-white tracking-tight leading-tight">
                {currentSlide.title}
              </h1>
              <p className="font-serif text-lg text-[#D4A72C] font-semibold" dir="rtl">
                {currentSlide.arabicTitle}
              </p>
            </div>

            <p className="text-sm sm:text-base text-white/90 font-light max-w-xl leading-relaxed">
              « {currentSlide.quote} »
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="btn-banner-action"
                onClick={() => onNavigate(currentSlide.targetTab)}
                className="px-5 py-2.5 rounded-xl bg-[#D4A72C] hover:bg-[#E8C158] text-[#0E4D3C] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#D4A72C]/20 transition-all hover:translate-x-0.5 active:translate-y-0.5"
              >
                <span>{currentSlide.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-banner-queue"
                onClick={() => onNavigate('queue')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/20 backdrop-blur-xs transition-colors flex items-center gap-2"
              >
                <Inbox className="w-4 h-4 text-[#D4A72C]" />
                <span>Arbitrer ({queueItems.length})</span>
              </button>
            </div>

            {/* Dots Carousel Controller */}
            <div className="pt-3 flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === idx 
                      ? 'w-7 bg-[#D4A72C]' 
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
              <span className="text-[11px] text-white/50 ml-2 font-mono">
                {activeSlide + 1} / {slides.length}
              </span>
            </div>
          </div>

          {/* Right Column: Sacred Emblem & Corpus Highlights Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group w-full max-w-sm">
              {/* Outer Golden Border & Container */}
              <div className="w-full rounded-3xl p-1 bg-gradient-to-b from-[#D4A72C] via-[#0E4D3C] to-[#1A6B54] shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]">
                <div className="w-full rounded-[22px] bg-[#072B21] overflow-hidden relative flex flex-col justify-between p-5 border border-white/15 space-y-4">
                  
                  {/* Decorative Header */}
                  <div className="flex items-center justify-between text-[11px] text-[#D4A72C] font-mono border-b border-white/10 pb-3">
                    <span className="flex items-center gap-1.5 font-serif">
                      <Bookmark className="w-3.5 h-3.5 text-[#D4A72C]" />
                      Zawiya de Tivaouane
                    </span>
                    <span className="font-bold text-white/90">1855 — 1922</span>
                  </div>

                  {/* Central Sacred Calligraphy & Official Golden Zawiya Logo */}
                  <div className="text-center py-1 space-y-3">
                    <div className="w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-b from-[#D4A72C] via-[#0E4D3C] to-[#1A6B54] shadow-xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#072B21] flex items-center justify-center border border-white/10">
                        <img 
                          src={zawiyaLogo} 
                          alt="Logo Zawiya Tijaniyya" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="font-serif text-base sm:text-lg font-bold text-white tracking-wide">
                        Seydi El Hadji Malick Sy (RTA)
                      </div>
                      <div className="text-xs text-[#E8C158] font-serif font-semibold" dir="rtl">
                        سيدي الحاج مالك بن عثمان سي رضي الله عنه
                      </div>
                    </div>
                  </div>

                  {/* Micro Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 text-left pt-1">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Indexation</div>
                      <div className="text-xs font-bold text-[#E8C158] font-mono mt-0.5">5 Traités Majeurs</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Vecteurs</div>
                      <div className="text-xs font-bold text-[#E8C158] font-mono mt-0.5">2 147 Fragments</div>
                    </div>
                  </div>

                  {/* Footer Tag */}
                  <div className="w-full bg-[#0E4D3C]/80 rounded-xl p-2.5 border border-[#D4A72C]/30 text-center">
                    <p className="text-[11px] text-white/90 italic font-serif">
                      « La science sans l'éthique est une source d'égarement. »
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Badge Overlay */}
              <div className="absolute -bottom-3 -left-3 bg-[#0E4D3C] text-[#D4A72C] border-2 border-[#D4A72C] px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 text-xs font-bold backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-[#D4A72C]" />
                <span>Corpus Originel Certifié</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS & KEY METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Queue */}
        <div 
          id="stat-queue-card"
          onClick={() => onNavigate('queue')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#0E4D3C] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">File d'Arbitrage</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0E4D3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#0E4D3C]">
              {queueItems.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">réponses en attente</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-amber-700 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {urgentCount} priorité haute
            </span>
            <span className="text-[#0E4D3C] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Examiner <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Confidence / RAG Fidelity */}
        <div 
          id="stat-fidelity-card"
          onClick={() => onNavigate('metrics')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#D4A72C] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Fidélité RAG Moyenne</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#D4A72C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-800">
              95.8%
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +1.2%
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Alignement corpus Maodo</span>
            <span className="text-slate-800 font-medium font-mono">0.96 max</span>
          </div>
        </div>

        {/* Card 3: Indexed Corpus */}
        <div 
          id="stat-corpus-card"
          onClick={() => onNavigate('corpus')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#0E4D3C] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Corpus & Traités Indexés</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0E4D3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-800">
              {corpusWorks.length} Ouvrages
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>2 147 fragments vectorisés</span>
            <span className="text-[#0E4D3C] font-semibold">100% numérisé</span>
          </div>
        </div>

        {/* Card 4: Certified Output */}
        <div 
          id="stat-certified-card"
          onClick={() => onNavigate('history')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#0E4D3C] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Décisions Érudits</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100/60 text-[#0E4D3C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#0E4D3C]">
              1 482
            </span>
            <span className="text-xs text-slate-500 font-medium">réponses mobiles</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Sceau Zawiya actif</span>
            <span className="font-mono text-xs font-semibold text-slate-700">98.4% accord</span>
          </div>
        </div>
      </div>

      {/* 3. CHARTS ROW: ACTIVITY & CATEGORY REPARTITION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Weekly Activity Area Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                Flux des Requêtes Pèlerins & Validations Érudits
              </h3>
              <p className="text-xs text-slate-500">
                Volume journalier reçu vs réponses certifiées pour diffusion mobile
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0E4D3C]" />
                Questions
              </span>
              <span className="flex items-center gap-1.5 text-[#D4A72C] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4A72C]" />
                Certifiées
              </span>
            </div>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorQuestions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0E4D3C" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0E4D3C" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCertifies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A72C" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#D4A72C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="questions" 
                  stroke="#0E4D3C" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorQuestions)" 
                  name="Requêtes Pèlerins"
                />
                <Area 
                  type="monotone" 
                  dataKey="certifies" 
                  stroke="#D4A72C" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorCertifies)" 
                  name="Certifications"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Thematic Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-serif">
              Répartition par Domaine Théologique
            </h3>
            <p className="text-xs text-slate-500">
              Thèmes les plus interrogés par les fidèles sur le corpus
            </p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 35, bottom: 5 }}>
                <XAxis type="number" stroke="#94A3B8" fontSize={10} hide />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={11} tickLine={false} width={100} />
                <Tooltip 
                  formatter={(val: number) => [`${val}% des requêtes`, 'Part']}
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0',
                    fontSize: '12px' 
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Dominante : <strong>Tariqa & Fiqh</strong> (64%)</span>
            <button 
              onClick={() => onNavigate('corpus')}
              className="text-[#0E4D3C] font-semibold hover:underline flex items-center gap-0.5"
            >
              Explorer les sources <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. QUICK ACTIONS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-3">
          Raccourcis & Actions Rapides de la Zawiya
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            id="action-btn-queue"
            onClick={() => onNavigate('queue')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-[#0E4D3C]/40 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0E4D3C] text-[#D4A72C] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-800">File d'Arbitrage</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{queueItems.length} en attente</div>
          </button>

          <button
            id="action-btn-upload"
            onClick={() => onNavigate('upload')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-[#0E4D3C]/40 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1A6B54] text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-4 h-4 text-[#D4A72C]" />
            </div>
            <div className="text-xs font-bold text-slate-800">Ingérer Manuscrits</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Upload PDF & Textes</div>
          </button>

          <button
            id="action-btn-simulator"
            onClick={() => onNavigate('simulator')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-[#0E4D3C]/40 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0E4D3C] text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4 text-[#D4A72C]" />
            </div>
            <div className="text-xs font-bold text-slate-800">Simulateur RAG</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Tester une question</div>
          </button>

          <button
            id="action-btn-corpus"
            onClick={() => onNavigate('corpus')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-[#0E4D3C]/40 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#0E4D3C] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4 text-[#0E4D3C]" />
            </div>
            <div className="text-xs font-bold text-slate-800">Corpus de Maodo</div>
            <div className="text-[11px] text-slate-500 mt-0.5">5 œuvres numérisées</div>
          </button>
        </div>
      </div>

      {/* 5. DUAL BOTTOM SECTION: RECENT CERTIFIED ARBITRATIONS & DAILY HIKMA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Certified Activity Feed (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0E4D3C]" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Dernières Réponses Certifiées & Diffusées
              </h3>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-[#0E4D3C] hover:underline flex items-center gap-0.5"
            >
              Voir tout <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentValidations.map((item) => (
              <div key={item.id} className="py-3 first:pt-1 last:pb-1 flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#0E4D3C] bg-emerald-50 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      #{item.id}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                    « {item.userQuery} »
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                    {item.validationLog?.finalText || item.generatedAnswer}
                  </p>
                </div>

                <div className="text-right flex-shrink-0 space-y-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Certifié
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {item.validationLog?.scholarName.split(' ')[0]}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Daily Hikma & Zawiya Ethics (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0E4D3C] to-[#0A362A] text-white p-6 rounded-2xl shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A72C] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Hikma du Jour — Seydi El Hadji Malick Sy
              </span>
              <span className="text-[10px] font-mono text-white/60 bg-black/20 px-2 py-0.5 rounded">
                Kifâyat ar-Râghibîn
              </span>
            </div>

            <div className="pt-2 text-right">
              <p className="font-serif text-base text-[#E8C158] font-semibold leading-relaxed" dir="rtl">
                « وعليكم بلزوم الجماعة، وحسن المعاملة مع الخلق كافة، فإن الدين المعاملة. »
              </p>
            </div>

            <div className="text-xs text-white/90 italic leading-relaxed pt-1">
              « Attachez-vous à la concorde fraternelle et au noble comportement avec l'ensemble des créatures, car la religion réside dans les transactions bienveillantes. »
            </div>
          </div>

          <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs">
            <div className="text-[11px] text-white/70">
              Session active : <strong className="text-[#D4A72C]">{currentScholar.name}</strong>
            </div>
            <button
              onClick={() => onNavigate('corpus')}
              className="text-[11px] font-semibold text-[#D4A72C] hover:text-white flex items-center gap-1 transition-colors"
            >
              Voir le traité <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
