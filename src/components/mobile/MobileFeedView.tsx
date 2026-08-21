import React, { useState, useEffect } from 'react';
import zawiyaLogo from '../../assets/images/zawiya_logo_emblem_1787278632309.jpg';
import { 
  STORIES_DATA, 
  StoryItem, 
  DAILY_PRAYER_TIMES_TIVAOUANE 
} from '../../data/mobileSpiritualData';
import { PILGRIM_HOME_CONTENT } from '../../data/pilgrimHomeData';
import { 
  Sparkles, 
  Clock, 
  Compass, 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  Volume2, 
  Share2, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Flame,
  Layers,
  Heart
} from 'lucide-react';

interface MobileFeedViewProps {
  onOpenStory: (story: StoryItem) => void;
  onNavigateTab: (tab: 'home' | 'tasbih' | 'chat' | 'ziyara' | 'library') => void;
  onOpenAudio: () => void;
}

export const MobileFeedView: React.FC<MobileFeedViewProps> = ({
  onOpenStory,
  onNavigateTab,
  onOpenAudio,
}) => {
  const { gamou, biography, hadara } = PILGRIM_HOME_CONTENT;

  // Real-time Gamou countdown calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [copiedQuote, setCopiedQuote] = useState(false);

  const handleShareQuote = () => {
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  return (
    <div id="mobile-feed-view" className="space-y-6 pb-24 text-[#1A1A1A]">
      
      {/* 1. Stories Tray (Circular Avatars with Glowing Ring) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-mono font-bold uppercase text-gray-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D4A72C]" />
            Récits & Savoirs de Maodo
          </span>
          <span className="text-[10px] text-[#0E4D3C] font-semibold">
            {STORIES_DATA.length} récits
          </span>
        </div>

        <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 px-1 no-scrollbar">
          {STORIES_DATA.map((story) => (
            <button
              key={story.id}
              onClick={() => onOpenStory(story)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none"
            >
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#D4A72C] via-[#0E4D3C] to-[#E8C158] shadow-sm group-hover:scale-105 transition-transform duration-200">
                <div className="w-15 h-15 rounded-full bg-[#072B21] border-2 border-white flex items-center justify-center text-white overflow-hidden p-1 text-center">
                  <span className="text-[10px] font-serif font-bold leading-tight text-[#E8C158]">
                    {story.title.split(' ')[0]}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-gray-700 max-w-[64px] truncate text-center">
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Gamou 2026 Official Live Countdown Card */}
      <div className="bg-gradient-to-br from-[#072B21] via-[#0E4D3C] to-[#09372B] text-white rounded-3xl p-5 sm:p-6 border-2 border-[#D4A72C]/40 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4A72C]/20 via-transparent to-transparent pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4A72C] text-[#0E4D3C] font-mono shadow-xs">
              {gamou.edition} • {gamou.yearGregorian}
            </span>
            <span className="text-[11px] text-[#E8C158] font-mono">
              {gamou.hijriDate}
            </span>
          </div>

          <span className="text-[10px] text-white/70 font-mono bg-black/30 px-2 py-0.5 rounded-lg border border-white/10">
            {gamou.gregorianDate}
          </span>
        </div>

        <div className="space-y-1 relative z-10">
          <span className="text-[10px] font-mono uppercase text-[#D4A72C] font-bold tracking-wider">
            Thème Officiel de la 124e Édition :
          </span>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-white leading-snug">
            « {gamou.theme} »
          </h3>
          <div className="text-sm font-serif text-[#E8C158]" dir="rtl">
            {gamou.themeArabic}
          </div>
        </div>

        {/* Live Countdown Timer Counters */}
        <div className="grid grid-cols-4 gap-2 pt-1 relative z-10">
          {[
            { label: 'Jours', val: timeLeft.days },
            { label: 'Heures', val: timeLeft.hours },
            { label: 'Minutes', val: timeLeft.minutes },
            { label: 'Secondes', val: timeLeft.seconds },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-black/35 backdrop-blur-xs rounded-2xl p-2.5 text-center border border-white/10"
            >
              <div className="text-xl sm:text-2xl font-mono font-extrabold text-[#D4A72C]">
                {item.val < 10 ? `0${item.val}` : item.val}
              </div>
              <div className="text-[9px] uppercase font-mono text-white/70 mt-0.5">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs relative z-10">
          <span className="text-[11px] text-white/80">
            Cité Sainte de Tivaouane
          </span>
          <button
            onClick={() => onNavigateTab('library')}
            className="text-[11px] text-[#D4A72C] font-bold hover:text-[#E8C158] flex items-center gap-1"
          >
            <span>Guide du Gamou</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Prayer Times & Hadara Timeline Strip */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0E4D3C]" />
            <span className="font-serif font-bold text-xs text-[#0E4D3C]">
              Horaires des Prières à Tivaouane
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-500">
            {DAILY_PRAYER_TIMES_TIVAOUANE.hijriDate}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-1.5 text-center">
          {DAILY_PRAYER_TIMES_TIVAOUANE.prayers.map((p, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-2xl transition-all ${
                p.current
                  ? 'bg-[#0E4D3C] text-white font-bold shadow-md scale-102 border border-[#D4A72C]'
                  : 'bg-[#F9FAF9] text-gray-700'
              }`}
            >
              <div className={`text-[10px] font-medium truncate ${p.current ? 'text-[#D4A72C]' : 'text-gray-500'}`}>
                {p.name.split(' ')[0]}
              </div>
              <div className="text-xs font-mono font-bold mt-0.5">
                {p.time}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-[#0E4D3C]">
          <span className="font-medium text-[11px]">
            🕌 {DAILY_PRAYER_TIMES_TIVAOUANE.nextHadaraWadhifa}
          </span>
          <button
            onClick={() => onNavigateTab('tasbih')}
            className="text-[10px] font-bold text-[#0E4D3C] underline"
          >
            Faire le Zikr
          </button>
        </div>
      </div>

      {/* 4. Quick Action Grid (Tactile Mobile Cards) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigateTab('chat')}
          className="bg-gradient-to-br from-white to-[#F9FAF9] p-4 rounded-3xl border border-gray-200 hover:border-[#0E4D3C] shadow-xs text-left space-y-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#0E4D3C] text-[#D4A72C] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-xs sm:text-sm text-gray-900">
              Assistant Doctrinal
            </h4>
            <p className="text-[11px] text-gray-500 line-clamp-1">
              RAG certifié par la Zawiya
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('tasbih')}
          className="bg-gradient-to-br from-white to-[#F9FAF9] p-4 rounded-3xl border border-gray-200 hover:border-[#0E4D3C] shadow-xs text-left space-y-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-xs sm:text-sm text-gray-900">
              Chapelet & Oraisons
            </h4>
            <p className="text-[11px] text-gray-500 line-clamp-1">
              Lâzim, Wadhîfa & Salawât
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('ziyara')}
          className="bg-gradient-to-br from-white to-[#F9FAF9] p-4 rounded-3xl border border-gray-200 hover:border-[#0E4D3C] shadow-xs text-left space-y-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#072B21] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-[#D4A72C]" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-xs sm:text-sm text-gray-900">
              Guide Ziyâra & Lieux
            </h4>
            <p className="text-[11px] text-gray-500 line-clamp-1">
              Mausolées & Adab
            </p>
          </div>
        </button>

        <button
          onClick={onOpenAudio}
          className="bg-gradient-to-br from-white to-[#F9FAF9] p-4 rounded-3xl border border-gray-200 hover:border-[#0E4D3C] shadow-xs text-left space-y-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Volume2 className="w-5 h-5 text-[#0E4D3C]" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-xs sm:text-sm text-gray-900">
              Écouter Khilâs
            </h4>
            <p className="text-[11px] text-gray-500 line-clamp-1">
              Chants de la Nativité
            </p>
          </div>
        </button>
      </div>

      {/* 5. Daily Spiritual Capsule (Maodo's Wisdom) */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center font-bold text-xs">
              ★
            </div>
            <span className="font-serif font-bold text-xs text-[#0E4D3C]">
              Parole Spirituelle du Jour
            </span>
          </div>

          <button
            onClick={handleShareQuote}
            className="text-xs text-gray-500 hover:text-[#0E4D3C] flex items-center gap-1 font-mono transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedQuote ? 'Copié !' : 'Partager'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#072B21] text-white space-y-2">
          <p className="font-serif text-sm sm:text-base leading-relaxed text-[#E8C158] italic">
            « Ne cherchez la sainteté que dans la stricte conformité au Livre d’Allah et à la noble Sunna du Prophète Mouhammad (PSL). Nul dévoilement ne prévaut sur la Loi révélée. »
          </p>
          <div className="flex items-center justify-between text-[11px] text-white/70 pt-1 border-t border-white/10 font-mono">
            <span>Seydi El Hadji Malick Sy (RTA)</span>
            <span className="text-[#D4A72C]">Kifâyat ar-Râghibîn</span>
          </div>
        </div>
      </div>

      {/* 6. Hadara 4 Pillars Mini Carousel */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-xs sm:text-sm text-[#0E4D3C]">
            Les 4 Piliers de la Hadara Malikiyya
          </h3>
          <span className="text-[10px] font-mono text-gray-400">Socle Éthique</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {hadara.pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="p-3 rounded-2xl bg-[#F9FAF9] border border-gray-100 flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-xl bg-[#0E4D3C] text-[#D4A72C] flex items-center justify-center font-bold text-xs flex-shrink-0">
                {pillar.number}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-serif font-bold text-xs text-gray-900">
                  {pillar.title}
                </h4>
                <p className="text-[11px] text-gray-600 leading-tight">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
