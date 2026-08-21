import React, { useState } from 'react';
import { CORPUS_WORKS } from '../../data/mockData';
import { CorpusWork } from '../../types';
import { triggerHaptic } from '../../utils/audioFeedback';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  MessageSquare, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  X,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface HadaraCorpusViewProps {
  onAskAboutWork: (workTitle: string) => void;
}

export const HadaraCorpusView: React.FC<HadaraCorpusViewProps> = ({ onAskAboutWork }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [previewWork, setPreviewWork] = useState<CorpusWork | null>(null);

  const categories = ['Tous', 'Poésie & Panégyrique', 'Jurisprudence & Fiqh', 'Soufisme & Adab'];

  const filteredWorks = CORPUS_WORKS.filter((work) => {
    const matchesSearch = 
      work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.arabicTitle.includes(searchTerm);

    const matchesCategory = selectedCategory === 'Tous' || work.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="hadara-corpus-view" className="space-y-4 max-w-2xl mx-auto w-full">
      
      {/* Top Mobile-Friendly Header Card */}
      <div className="bg-gradient-to-br from-[#072B21] to-[#0E4D3C] text-white p-4 sm:p-5 rounded-2xl border border-[#D4A72C]/30 shadow-sm space-y-1.5">
        <div className="flex items-center gap-1.5 text-[#D4A72C] text-[11px] font-mono font-bold uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Bibliothèque Authentifiée de Maodo (RTA)</span>
        </div>
        <h2 className="text-lg sm:text-xl font-serif font-bold text-white leading-tight">
          Traités & Poèmes Fondateurs
        </h2>
        <p className="text-xs text-gray-200 leading-relaxed font-sans">
          Indexés et certifiés pour la médiation RAG. Touchez un ouvrage pour l'explorer ou interroger l'IA.
        </p>
      </div>

      {/* Search & Fast Filter Pill Row */}
      <div className="space-y-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un ouvrage (Kifâyat, Khilâs, Ifhâm...)"
            className="w-full pl-9 pr-8 py-2.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#0E4D3C] shadow-2xs font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 touch-pan-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                triggerHaptic(10);
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap min-h-[36px] transition-all touch-manipulation active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-[#0E4D3C] text-white shadow-xs font-semibold'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Works List / Compact Tactile Cards */}
      <div className="space-y-3">
        {filteredWorks.map((work) => (
          <div
            key={work.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-2xs hover:border-[#D4A72C] transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#072B21]">
                    {work.title}
                  </h3>
                  <div className="text-xs text-[#D4A72C] font-serif font-medium mt-0.5" dir="rtl">
                    {work.arabicTitle}
                  </div>
                </div>

                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex-shrink-0">
                  {work.totalFragments} passages
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed font-sans line-clamp-2">
                {work.description}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                <span className="px-2 py-0.5 bg-[#F4F6F5] rounded-lg">
                  {work.category}
                </span>
                {work.yearWritten && (
                  <span className="text-gray-400">
                    • {work.yearWritten}
                  </span>
                )}
              </div>
            </div>

            {/* Tactile Action Buttons */}
            <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  triggerHaptic(10);
                  setPreviewWork(work);
                }}
                className="px-3 py-1.5 rounded-xl text-gray-600 hover:text-[#072B21] bg-gray-100 hover:bg-gray-200 text-xs font-semibold transition-all touch-manipulation min-h-[36px]"
              >
                Aperçu de l'ouvrage
              </button>

              <button
                onClick={() => {
                  triggerHaptic(15);
                  onAskAboutWork(work.title);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0E4D3C] hover:bg-[#155e4b] text-white text-xs font-semibold transition-all shadow-xs touch-manipulation active:scale-95 min-h-[36px]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>Interroger l'IA</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Excerpt Preview Drawer/Modal */}
      {previewWork && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0E4D3C] text-[#D4A72C] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#072B21]">
                    {previewWork.title}
                  </h4>
                  <p className="text-xs text-[#D4A72C] font-serif" dir="rtl">
                    {previewWork.arabicTitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewWork(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-3 text-xs text-gray-700 leading-relaxed font-sans">
              <div className="p-3 bg-[#F4F6F5] rounded-xl space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#0E4D3C] font-bold block">
                  Résumé Doctrinal
                </span>
                <p>{previewWork.description}</p>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-gray-400 font-bold block">
                  Structure & Détails du manuscrit
                </span>
                <ul className="space-y-1 text-[11px] font-mono text-gray-600">
                  <li>• Catégorie : <strong>{previewWork.category}</strong></li>
                  <li>• Fragments vectorisés : <strong>{previewWork.totalFragments} passages</strong></li>
                  <li>• Période de composition : <strong>{previewWork.yearWritten || 'Hadara de Tivaouane'}</strong></li>
                  <li>• Statut théologique : <strong className="text-emerald-700">Certifié par la Zawiya</strong></li>
                </ul>
              </div>
            </div>

            {/* Modal Bottom Action */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setPreviewWork(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Fermer
              </button>

              <button
                onClick={() => {
                  setPreviewWork(null);
                  onAskAboutWork(previewWork.title);
                }}
                className="px-4 py-2 bg-[#0E4D3C] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>Interroger Hadara IA sur ce traité</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
