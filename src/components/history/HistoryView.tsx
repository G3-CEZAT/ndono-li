import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Edit3, 
  XCircle, 
  Calendar, 
  BookOpen, 
  Eye,
  ShieldCheck
} from 'lucide-react';
import { RAGValidationItem, ValidationStatus } from '../../types';

interface HistoryViewProps {
  historyItems: RAGValidationItem[];
  searchQuery: string;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  historyItems,
  searchQuery,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItemForAudit, setSelectedItemForAudit] = useState<RAGValidationItem | null>(null);

  const filtered = historyItems.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQuery = item.userQuery.toLowerCase().includes(q);
      const matchScholar = item.validationLog?.scholarName.toLowerCase().includes(q);
      const matchNotes = item.validationLog?.theologicalNotes?.toLowerCase().includes(q);
      if (!matchQuery && !matchScholar && !matchNotes) return false;
    }
    return true;
  });

  const getStatusBadge = (status: ValidationStatus) => {
    switch (status) {
      case 'certified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Certifié
          </span>
        );
      case 'corrected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Edit3 className="w-3.5 h-3.5" />
            Corrigé
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Rejeté
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header and Filter bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          {(['all', 'certified', 'corrected', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-[#0E4D3C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' && 'Tous les arbitrages'}
              {st === 'certified' && 'Certifiés'}
              {st === 'corrected' && 'Corrigés'}
              {st === 'rejected' && 'Rejetés'}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#0E4D3C]" />
          <span>Journal d'audit horodaté</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">ID & Date</th>
                <th className="py-3 px-5">Question</th>
                <th className="py-3 px-5">Décision</th>
                <th className="py-3 px-5">Érudit</th>
                <th className="py-3 px-5">Source</th>
                <th className="py-3 px-5 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    Aucun historique correspondant aux filtres.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const log = item.validationLog;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* ID & Date */}
                      <td className="py-3.5 px-5 align-top">
                        <div className="font-mono font-bold text-[#0E4D3C]">
                          {item.id}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {log?.timestamp
                            ? new Date(log.timestamp).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                              })
                            : 'Récent'}
                        </div>
                      </td>

                      {/* Question */}
                      <td className="py-3.5 px-5 align-top max-w-xs">
                        <div className="font-medium text-slate-800 line-clamp-2">
                          {item.userQuery}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {item.category}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 align-top">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Scholar */}
                      <td className="py-3.5 px-5 align-top">
                        <div className="font-semibold text-slate-800">
                          {log?.scholarName || 'Commission'}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-5 align-top">
                        <div className="flex items-center gap-1.5 text-[#0E4D3C] font-semibold">
                          <BookOpen className="w-3.5 h-3.5 text-[#D4A72C]" />
                          <span>{item.sources[0]?.bookTitle || 'Corpus Maodo'}</span>
                        </div>
                      </td>

                      {/* Action Detail */}
                      <td className="py-3.5 px-5 align-top text-right">
                        <button
                          onClick={() => setSelectedItemForAudit(item)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-[#0E4D3C] hover:bg-slate-50 font-medium inline-flex items-center gap-1 text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Voir PV</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedItemForAudit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0E4D3C] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-serif">
                    Procès-Verbal de Certification
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    #{selectedItemForAudit.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItemForAudit(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Question */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Question Pèlerin
              </span>
              <p className="text-xs font-semibold text-slate-800">
                « {selectedItemForAudit.userQuery} »
              </p>
            </div>

            {/* Final Text Broadcasted to Mobile */}
            <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 space-y-1">
              <span className="text-[10px] font-bold text-[#0E4D3C] uppercase tracking-wider block">
                Texte Diffusé aux Pèlerins
              </span>
              <p className="text-xs text-slate-800 leading-relaxed">
                {selectedItemForAudit.validationLog?.finalText || selectedItemForAudit.generatedAnswer}
              </p>
            </div>

            {/* Theological Notes */}
            {selectedItemForAudit.validationLog?.theologicalNotes && (
              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 text-xs">
                <span className="text-[10px] font-bold text-[#D4A72C] uppercase tracking-wider block mb-0.5">
                  Note d'arbitrage
                </span>
                <p className="text-xs text-slate-700 italic">
                  « {selectedItemForAudit.validationLog.theologicalNotes} »
                </p>
              </div>
            )}

            {/* Signature Block */}
            <div className="bg-[#0E4D3C] text-white p-3.5 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-[#D4A72C]">
                  {selectedItemForAudit.validationLog?.scholarName}
                </div>
                <div className="text-[10px] text-white/70">
                  {selectedItemForAudit.validationLog?.scholarTitle}
                </div>
              </div>
              <div className="text-right text-[10px] text-white/70 font-mono">
                {new Date(selectedItemForAudit.validationLog?.timestamp || '').toLocaleDateString('fr-FR')}
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setSelectedItemForAudit(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
