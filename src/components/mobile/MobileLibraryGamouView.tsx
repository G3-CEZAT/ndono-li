import React, { useState } from 'react';
import { CORPUS_WORKS } from '../../data/mockData';
import { PILGRIM_HOME_CONTENT } from '../../data/pilgrimHomeData';
import { 
  BookOpen, 
  Film, 
  Calendar, 
  Search, 
  ExternalLink, 
  Play, 
  ChevronRight, 
  CheckCircle2, 
  Phone, 
  ShieldAlert, 
  MapPin,
  Clock,
  Sparkles,
  X
} from 'lucide-react';

interface MobileLibraryGamouViewProps {
  onOpenChatWithTopic?: (topic: string) => void;
}

export const MobileLibraryGamouView: React.FC<MobileLibraryGamouViewProps> = ({
  onOpenChatWithTopic,
}) => {
  const [activeSegment, setActiveSegment] = useState<'gamou' | 'books' | 'videos'>('gamou');
  const [searchBook, setSearchBook] = useState('');
  const [selectedBook, setSelectedBook] = useState(CORPUS_WORKS[0]);
  const [selectedVideo, setSelectedVideo] = useState<typeof PILGRIM_HOME_CONTENT.videoResources.items[0] | null>(null);

  const { gamou, videoResources } = PILGRIM_HOME_CONTENT;

  const filteredBooks = CORPUS_WORKS.filter(
    (b) =>
      b.title.toLowerCase().includes(searchBook.toLowerCase()) ||
      b.arabicTitle.includes(searchBook) ||
      b.category.toLowerCase().includes(searchBook.toLowerCase())
  );

  return (
    <div id="mobile-library-gamou-view" className="space-y-5 pb-24 text-[#1A1A1A]">
      
      {/* Segmented Control Selector */}
      <div className="bg-white p-1 rounded-2xl border border-gray-200 shadow-xs flex gap-1">
        <button
          onClick={() => setActiveSegment('gamou')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeSegment === 'gamou'
              ? 'bg-[#0E4D3C] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Gamou 2026</span>
        </button>

        <button
          onClick={() => setActiveSegment('books')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeSegment === 'books'
              ? 'bg-[#0E4D3C] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Traités ({CORPUS_WORKS.length})</span>
        </button>

        <button
          onClick={() => setActiveSegment('videos')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeSegment === 'videos'
              ? 'bg-[#0E4D3C] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Vidéos</span>
        </button>
      </div>

      {/* 1. GAMOU 2026 TAB */}
      {activeSegment === 'gamou' && (
        <div className="space-y-4">
          
          {/* Main Hero Card */}
          <div className="bg-gradient-to-br from-[#072B21] via-[#0E4D3C] to-[#09372B] text-white p-5 rounded-3xl border border-[#D4A72C]/40 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4A72C] text-[#0E4D3C] font-mono">
                {gamou.edition} • {gamou.yearGregorian}
              </span>
              <span className="text-[11px] text-[#E8C158] font-mono">
                {gamou.hijriDate}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#D4A72C] font-bold">
                Thème Officiel :
              </span>
              <h3 className="font-serif font-bold text-lg text-white leading-snug">
                « {gamou.theme} »
              </h3>
              <div className="text-sm font-serif text-[#E8C158]" dir="rtl">
                {gamou.themeArabic}
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed">
              {gamou.description}
            </p>
          </div>

          {/* Historical Genesis 1902 */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-2">
            <h4 className="font-serif font-bold text-sm text-[#0E4D3C] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4A72C]" />
              <span>De 1902 à 2026 : Plus d’un siècle de ferveur</span>
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              Le premier Gamou public organisé à Tivaouane par Seydi El Hadji Malick Sy a posé les bases d’une tradition d’élévation spirituelle, de partage de repas bénis (Berndé) et de concorde sociale.
            </p>
          </div>

          {/* Practical Pilgrim Guide & Emergency contacts */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-3">
            <h4 className="font-serif font-bold text-xs uppercase font-mono text-gray-500">
              Guide Pratique du Pèlerin à Tivaouane
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-[#F9FAF9] border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0E4D3C]" />
                  <span>Secours Médicaux / Samu Tivaouane</span>
                </div>
                <span className="font-mono font-bold text-[#0E4D3C]">1515 / 800 00 50 50</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F9FAF9] border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#0E4D3C]" />
                  <span>Sécurité & Commissariat Central</span>
                </div>
                <span className="font-mono font-bold text-[#0E4D3C]">17 / 33 955 10 20</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F9FAF9] border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0E4D3C]" />
                  <span>Accueil Pèlerins & Hébergement</span>
                </div>
                <span className="font-mono font-bold text-[#0E4D3C]">Dahiras Fédérés</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. BOOKS & TREATIES TAB */}
      {activeSegment === 'books' && (
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchBook}
              onChange={(e) => setSearchBook(e.target.value)}
              placeholder="Rechercher un traité (ex: Kifâyat, Khilâs)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-300 bg-white text-xs focus:outline-none focus:border-[#0E4D3C]"
            />
          </div>

          {/* Book Cards */}
          <div className="space-y-3">
            {filteredBooks.map((book) => {
              const isSelected = selectedBook.id === book.id;
              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#0E4D3C] text-white border-[#D4A72C] shadow-md'
                      : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-[#D4A72C] text-[#0E4D3C]' : 'bg-[#0E4D3C]/10 text-[#0E4D3C]'
                    }`}>
                      {book.category}
                    </span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                      {book.yearWritten || ''}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm sm:text-base">
                    {book.title}
                  </h3>

                  <div className={`text-xs font-serif ${isSelected ? 'text-[#E8C158]' : 'text-[#D4A72C]'}`} dir="rtl">
                    {book.arabicTitle}
                  </div>

                  <p className={`text-xs leading-relaxed line-clamp-2 ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                    {book.description}
                  </p>

                  <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                    isSelected ? 'border-white/15 text-[#D4A72C]' : 'border-gray-100 text-[#0E4D3C]'
                  }`}>
                    <span>✓ Indexé dans la mémoire RAG</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 3. VIDEOS TAB */}
      {activeSegment === 'videos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {videoResources.items.map((vid) => (
              <div
                key={vid.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div 
                  className="relative aspect-video bg-[#072B21] flex items-center justify-center cursor-pointer group"
                  onClick={() => setSelectedVideo(vid)}
                >
                  <button className="w-12 h-12 rounded-full bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-[#E8C158] font-mono">
                    {vid.source}
                  </span>
                  {vid.duration && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] bg-black/80 text-white font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D4A72C]" />
                      {vid.duration}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-gray-900 leading-snug">
                    {vid.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 italic">
                    {vid.narratorOrContext}
                  </p>
                  <p className="text-xs text-gray-600 leading-tight line-clamp-2">
                    {vid.synopsis}
                  </p>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedVideo(vid)}
                      className="text-xs text-[#0E4D3C] font-bold hover:text-[#D4A72C] flex items-center gap-1"
                    >
                      <span>Visionner</span>
                      <Play className="w-3 h-3 fill-current" />
                    </button>

                    <a
                      href={vid.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#072B21] text-white rounded-3xl max-w-md w-full p-5 space-y-4 border border-[#D4A72C]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] font-mono uppercase text-[#D4A72C]">
                {selectedVideo.source}
              </span>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1 rounded-full bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center space-y-2 py-4">
              <h3 className="font-serif font-bold text-base text-white">
                {selectedVideo.title}
              </h3>
              <p className="text-xs text-white/70">
                {selectedVideo.synopsis}
              </p>
            </div>

            <a
              href={selectedVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl bg-[#D4A72C] text-[#0E4D3C] font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-[#E8C158] transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Ouvrir sur YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
