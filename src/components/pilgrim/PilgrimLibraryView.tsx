import React, { useState } from 'react';
import { CORPUS_WORKS } from '../../data/mockData';
import { 
  Library, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ScrollText, 
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface PilgrimLibraryViewProps {
  onNavigateToChat: () => void;
}

export const PilgrimLibraryView: React.FC<PilgrimLibraryViewProps> = ({
  onNavigateToChat,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWork, setSelectedWork] = useState(CORPUS_WORKS[0]);

  const filteredWorks = CORPUS_WORKS.filter((w) =>
    w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.arabicTitle.includes(searchTerm) ||
    w.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="pilgrim-library-view" className="space-y-12 pb-16 text-[#1A1A1A]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0E4D3C] via-[#09372B] to-[#072B21] text-white p-8 sm:p-12 rounded-3xl border-2 border-[#D4A72C]/40 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D4A72C]/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4A72C] text-[#0E4D3C] inline-flex items-center gap-1.5 font-mono">
            <Library className="w-3.5 h-3.5" />
            Corpus Littéraire & Doctrinal
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Les Traités & Écrits de Seydi El Hadji Malick Sy
          </h1>
          <p className="text-[#E8C158] font-serif text-sm sm:text-base italic">
            « Ouvrages majeurs en vers et en prose servant de référence à l'Assistant Hadara »
          </p>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed pt-2">
            Explorez les œuvres théologiques, hagiographiques, juridiques et poétiques de Maodo. Chaque traité est numérisé, indexé et intégré à la mémoire de l'assistant de médiation.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un traité par titre (ex: Kifâyat, Khilâs, Ifhâm)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-[#0E4D3C] focus:ring-1 focus:ring-[#0E4D3C] shadow-xs"
        />
      </div>

      {/* Works Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredWorks.map((work) => {
            const isSelected = selectedWork.id === work.id;

            return (
              <button
                key={work.id}
                onClick={() => setSelectedWork(work)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#0E4D3C] text-white border-[#D4A72C] shadow-md'
                    : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-200 shadow-xs'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-[#D4A72C] text-[#0E4D3C]' : 'bg-[#0E4D3C]/10 text-[#0E4D3C]'
                    }`}>
                      {work.category}
                    </span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                      {work.yearWritten ? work.yearWritten : ''}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base mt-1">
                    {work.title}
                  </h3>

                  <div className={`text-xs font-serif ${isSelected ? 'text-[#E8C158]' : 'text-gray-500'}`} dir="rtl">
                    {work.arabicTitle}
                  </div>
                </div>

                <ChevronRight className={`w-5 h-5 flex-shrink-0 mt-2 ${isSelected ? 'text-[#D4A72C]' : 'text-gray-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Detail Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6">
          <div className="border-b border-gray-100 pb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#D4A72C] bg-[#0E4D3C] px-3 py-1 rounded-md">
                {selectedWork.category}
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Indexé & Vérifié</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0E4D3C]">
              {selectedWork.title}
            </h2>

            <div className="text-xl font-serif text-[#D4A72C]" dir="rtl">
              {selectedWork.arabicTitle}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono">
                Présentation & Thématique Principale :
              </h4>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1">
                {selectedWork.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#F4F6F5] border border-gray-100">
                <div className="text-[10px] text-gray-500 uppercase font-mono">Forme d'écriture</div>
                <div className="text-xs font-bold text-[#0E4D3C] mt-0.5">Vers poétiques & Prose rythmée</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F4F6F5] border border-gray-100">
                <div className="text-[10px] text-gray-500 uppercase font-mono">Autorité pastorale</div>
                <div className="text-xs font-bold text-[#0E4D3C] mt-0.5">Référence canonique Tijâniyya</div>
              </div>
            </div>
          </div>

          {/* Action to ask questions on this book */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={onNavigateToChat}
              className="px-5 py-2.5 rounded-xl bg-[#0E4D3C] hover:bg-[#1A6B54] text-[#D4A72C] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Interroger l'assistant sur ce traité</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
