import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Edit3, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ShieldAlert,
  Languages
} from 'lucide-react';
import { RAGValidationItem } from '../../types';

interface ValidationCardProps {
  item: RAGValidationItem;
  onOpenReviewModal: (item: RAGValidationItem, initialAction?: 'certify' | 'correct' | 'reject') => void;
  onQuickApprove?: (item: RAGValidationItem) => void;
}

export const ValidationCard: React.FC<ValidationCardProps> = ({
  item,
  onOpenReviewModal,
}) => {
  const [showSource, setShowSource] = useState(false);
  const source = item.sources[0];
  const percent = Math.round(item.confidenceScore * 100);

  return (
    <div 
      id={`validation-card-${item.id}`}
      className="bg-white rounded-2xl border border-slate-200 hover:border-[#D4A72C] shadow-sm transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="px-6 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#0E4D3C] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            {item.category}
          </span>
          <span className="text-slate-500 font-medium">
            Pour : <span className="text-slate-700">{item.targetAudience}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3 h-3 text-[#D4A72C]" />
            RAG : {percent}%
          </span>
          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3" />
            {new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-4 flex-1">
        {/* User Query */}
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Question pèlerin</span>
          <h3 className="text-base font-semibold text-slate-900 leading-snug mt-0.5">
            « {item.userQuery} »
          </h3>
        </div>

        {/* AI Answer */}
        <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#0E4D3C] uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A72C]" />
              Réponse générée à valider
            </span>
            <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
              {source?.bookTitle || 'Corpus Tivaouane'}
            </span>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            {item.generatedAnswer}
          </p>
        </div>

        {/* Source citation snippet & toggle */}
        {source && (
          <div>
            <button
              onClick={() => setShowSource(!showSource)}
              className="text-xs font-semibold text-[#0E4D3C] hover:text-[#1A6B54] flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D4A72C]" />
              <span>Source : {source.bookTitle} ({source.pageOrBayt})</span>
              {showSource ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showSource && (
              <div className="mt-2.5 p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/60 space-y-2 text-xs animate-fadeIn">
                <div className="text-right font-serif text-sm text-[#0E4D3C] leading-loose" dir="rtl">
                  « {source.originalArabic} »
                </div>
                <div className="text-slate-600 italic border-t border-amber-200/40 pt-1.5">
                  « {source.translationFr} »
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-[#D4A72C]" />
          En attente de signature
        </span>

        <div className="flex items-center gap-2">
          <button
            id={`reject-btn-${item.id}`}
            onClick={() => onOpenReviewModal(item, 'reject')}
            className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
          >
            Rejeter
          </button>
          <button
            id={`correct-btn-${item.id}`}
            onClick={() => onOpenReviewModal(item, 'correct')}
            className="px-3.5 py-1.5 rounded-xl border border-[#1A6B54] text-[#0E4D3C] hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            Modifier
          </button>
          <button
            id={`certify-btn-${item.id}`}
            onClick={() => onOpenReviewModal(item, 'certify')}
            className="px-4 py-1.5 rounded-xl bg-[#D4A72C] hover:bg-[#E8C158] text-[#0E4D3C] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Certifier
          </button>
        </div>
      </div>
    </div>
  );
};
