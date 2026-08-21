import React, { useState } from 'react';
import { 
  Filter, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Inbox,
  Clock
} from 'lucide-react';
import { RAGValidationItem, ScholarProfile } from '../../types';
import { ValidationCard } from '../cards/ValidationCard';

interface ValidationQueueViewProps {
  items: RAGValidationItem[];
  currentScholar: ScholarProfile;
  onOpenReviewModal: (item: RAGValidationItem, initialAction?: 'certify' | 'correct' | 'reject') => void;
  onQuickApprove: (item: RAGValidationItem) => void;
  searchQuery: string;
}

export const ValidationQueueView: React.FC<ValidationQueueViewProps> = ({
  items,
  currentScholar,
  onOpenReviewModal,
  onQuickApprove,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQuery = item.userQuery.toLowerCase().includes(q);
      const matchAnswer = item.generatedAnswer.toLowerCase().includes(q);
      const matchSource = item.sources.some(
        (s) =>
          s.bookTitle.toLowerCase().includes(q) ||
          s.originalArabic.toLowerCase().includes(q) ||
          s.translationFr.toLowerCase().includes(q)
      );
      if (!matchQuery && !matchAnswer && !matchSource) return false;
    }
    return true;
  });

  const categories = ['all', 'Tariqa Tijaniyya', 'Sîra & Hadith', 'Fiqh & Pratiques', 'Éthique & Société'];

  return (
    <div className="space-y-5">
      {/* Top Quick Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0E4D3C] flex items-center justify-center flex-shrink-0">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#0E4D3C] font-mono leading-none">
              {items.length}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Réponses en attente
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D4A72C] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#D4A72C]" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800 font-mono leading-none">
              {items.length > 0
                ? `${Math.round((items.reduce((acc, curr) => acc + curr.confidenceScore, 0) / items.length) * 100)}%`
                : '95%'}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Fidélité RAG moyenne
            </div>
          </div>
        </div>

        <div className="bg-[#0E4D3C] text-white p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1A6B54] text-[#D4A72C] flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-[#D4A72C] uppercase tracking-wider truncate">
              Protocole Tivaouane
            </div>
            <div className="text-xs text-white/80 truncate mt-0.5">
              Diffusion certifiée par érudit
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0E4D3C] text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Toutes' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Priorité :</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
          >
            <option value="all">Toutes</option>
            <option value="urgent">Urgente</option>
            <option value="normal">Normale</option>
          </select>
        </div>
      </div>

      {/* Queue items list */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0E4D3C] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6 text-[#0E4D3C]" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1 font-serif">
            File de validation à jour
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Toutes les réponses de cette sélection ont été certifiées. Le flux mobile pour les pèlerins est synchronisé.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <ValidationCard
              key={item.id}
              item={item}
              onOpenReviewModal={onOpenReviewModal}
              onQuickApprove={onQuickApprove}
            />
          ))}
        </div>
      )}
    </div>
  );
};
