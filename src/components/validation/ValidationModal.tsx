import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Edit3, 
  XCircle, 
  BookOpen, 
  Languages, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  FileCheck2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { RAGValidationItem, ScholarProfile, ValidationStatus } from '../../types';

interface ValidationModalProps {
  item: RAGValidationItem | null;
  currentScholar: ScholarProfile;
  initialAction?: 'certify' | 'correct' | 'reject';
  onClose: () => void;
  onSubmitDecision: (
    itemId: string,
    action: ValidationStatus,
    finalText: string,
    theologicalNotes: string,
    rejectionReason?: string
  ) => void;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  item,
  currentScholar,
  initialAction = 'certify',
  onClose,
  onSubmitDecision,
}) => {
  if (!item) return null;

  const [mode, setMode] = useState<'certify' | 'correct' | 'reject'>(initialAction);
  const [editedAnswer, setEditedAnswer] = useState<string>(item.generatedAnswer);
  const [theologicalNotes, setTheologicalNotes] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [selectedSourceTab, setSelectedSourceTab] = useState<number>(0);

  const currentSource = item.sources[selectedSourceTab] || item.sources[0];

  const handleConfirm = () => {
    if (mode === 'reject' && !rejectionReason.trim()) {
      alert("Veuillez indiquer un motif théologique de rejet.");
      return;
    }

    const actionMap: Record<string, ValidationStatus> = {
      certify: 'certified',
      correct: 'corrected',
      reject: 'rejected',
    };

    onSubmitDecision(
      item.id,
      actionMap[mode],
      mode === 'correct' ? editedAnswer : item.generatedAnswer,
      theologicalNotes,
      mode === 'reject' ? rejectionReason : undefined
    );
  };

  return (
    <div 
      id="validation-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div 
        id="validation-modal-container"
        className="bg-white rounded-2xl border border-[#E2E8E5] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="bg-[#0E4D3C] text-white px-6 py-4 flex items-center justify-between border-b border-[#1A6B54]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1A6B54] text-[#D4A72C] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Arbitrage & Certification Théologique
                </h3>
                <span className="text-[11px] font-mono bg-[#09372B] text-[#E8C158] px-2 py-0.5 rounded border border-[#D4A72C]/30">
                  ID: {item.id}
                </span>
              </div>
              <p className="text-xs text-white/70">
                Examiné sous l'autorité de : <strong className="text-[#E8C158]">{currentScholar.name}</strong> ({currentScholar.signatureCertId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Dual Column Workspace */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#F8F9FA]">
          {/* Left Column: Question & Sources Reference (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* User Question */}
            <div className="bg-white p-4.5 rounded-xl border border-[#E2E8E5] shadow-xs">
              <span className="text-[11px] font-bold text-[#5A6560] uppercase tracking-wider block mb-1">
                Question Reçue du Mobile
              </span>
              <p className="text-sm font-semibold text-[#1A1A1A] leading-relaxed">
                « {item.userQuery} »
              </p>
              <div className="mt-2.5 pt-2 border-t border-[#E2E8E5] flex items-center justify-between text-xs text-[#5A6560]">
                <span>Thème : <strong className="text-[#0E4D3C]">{item.category}</strong></span>
                <span>Public : <strong>{item.targetAudience}</strong></span>
              </div>
            </div>

            {/* Source Inspector Box */}
            <div className="bg-white p-4.5 rounded-xl border border-[#D4A72C]/40 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#0E4D3C] uppercase flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#D4A72C]" />
                  Preuve Textuelle (Corpus Maodo)
                </span>

                {item.sources.length > 1 && (
                  <div className="flex items-center gap-1">
                    {item.sources.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSourceTab(i)}
                        className={`text-xs px-2 py-0.5 rounded font-bold transition-all ${
                          selectedSourceTab === i
                            ? 'bg-[#0E4D3C] text-[#D4A72C]'
                            : 'bg-[#F4F6F5] text-[#5A6560]'
                        }`}
                      >
                        Extrait {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {currentSource && (
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-bold text-[#1A1A1A]">
                      {currentSource.bookTitle}
                    </div>
                    <div className="text-[11px] text-[#5A6560] italic">
                      {currentSource.chapter} • <span className="font-semibold">{currentSource.pageOrBayt}</span>
                    </div>
                  </div>

                  {/* Arabic Original */}
                  <div className="bg-[#FAFBFB] p-3 rounded-lg border border-[#E2E8E5] text-right">
                    <span className="text-[10px] font-bold text-[#5A6560] uppercase block text-left mb-1">
                      Texte Arabe Authentifié :
                    </span>
                    <p className="font-arabic text-base font-bold text-[#0E4D3C] leading-loose">
                      « {currentSource.originalArabic} »
                    </p>
                  </div>

                  {/* Translation */}
                  <div className="bg-[#FDF8EC] p-3 rounded-lg border border-[#D4A72C]/30 text-xs">
                    <span className="text-[10px] font-bold text-[#0E4D3C] uppercase block mb-1 flex items-center gap-1">
                      <Languages className="w-3 h-3 text-[#D4A72C]" />
                      Traduction Française Certifiée :
                    </span>
                    <p className="italic text-[#1A1A1A] leading-relaxed">
                      « {currentSource.translationFr} »
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Review Workspace & Action Selector (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Mode selection tabs */}
            <div className="bg-white p-1.5 rounded-xl border border-[#E2E8E5] flex items-center gap-1 shadow-xs">
              <button
                id="modal-tab-certify"
                onClick={() => setMode('certify')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'certify'
                    ? 'bg-[#0E4D3C] text-white shadow-xs'
                    : 'text-[#5A6560] hover:bg-[#F4F6F5]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#D4A72C]" />
                1. Certifier Tel Quel
              </button>

              <button
                id="modal-tab-correct"
                onClick={() => setMode('correct')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'correct'
                    ? 'bg-[#1A6B54] text-white shadow-xs'
                    : 'text-[#5A6560] hover:bg-[#F4F6F5]'
                }`}
              >
                <Edit3 className="w-4 h-4 text-[#E8C158]" />
                2. Corriger le Texte
              </button>

              <button
                id="modal-tab-reject"
                onClick={() => setMode('reject')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'reject'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-[#5A6560] hover:bg-[#F4F6F5]'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-200" />
                3. Rejeter
              </button>
            </div>

            {/* Main Editor / Review Text Area */}
            <div className="bg-white p-5 rounded-xl border border-[#E2E8E5] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#0E4D3C] flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-[#D4A72C]" />
                  {mode === 'correct' ? 'Texte Définitif Après Correction :' : 'Texte Proposé pour Diffusion Mobile :'}
                </span>
                <span className="text-[11px] text-[#5A6560] font-mono">
                  {editedAnswer.length} caractères
                </span>
              </div>

              {mode === 'correct' ? (
                <div className="space-y-2">
                  <textarea
                    id="scholar-edit-textarea"
                    rows={6}
                    value={editedAnswer}
                    onChange={(e) => setEditedAnswer(e.target.value)}
                    className="w-full bg-[#FAFBFB] border-2 border-[#1A6B54] rounded-lg p-3 text-sm text-[#1A1A1A] leading-relaxed focus:outline-none focus:bg-white"
                    placeholder="Apportez vos rectifications doctrinales ou précisions textuelles..."
                  />
                  <div className="text-[11px] text-[#1A6B54] bg-[#1A6B54]/10 p-2 rounded flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Le texte corrigé remplacera la synthèse automatique dans l'application des pèlerins.
                  </div>
                </div>
              ) : mode === 'reject' ? (
                <div className="space-y-3">
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 leading-relaxed">
                    <strong>Avertissement :</strong> Le rejet empêchera toute diffusion de cette réponse. Un motif précis est exigé pour le registre d'audit.
                  </div>
                  <div>
                    <label className="text-xs font-bold text-rose-900 block mb-1">
                      Motif théologique / Raison du rejet :
                    </label>
                    <textarea
                      id="rejection-reason-textarea"
                      rows={4}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Ex: Citation tronquée risquant d'induire une confusion doctrinale / Hors sujet par rapport aux écrits de Maodo..."
                      className="w-full border border-rose-300 rounded-lg p-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-rose-600"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#FAFBFB] rounded-lg border border-[#E2E8E5] text-sm text-[#1A1A1A] leading-relaxed">
                  {item.generatedAnswer}
                </div>
              )}

              {/* Theological Notes & Scholar Annotations */}
              <div className="pt-2">
                <label className="text-[11px] font-bold uppercase text-[#5A6560] block mb-1">
                  Annotations théologiques & Observations (Facultatif) :
                </label>
                <input
                  id="theological-notes-input"
                  type="text"
                  value={theologicalNotes}
                  onChange={(e) => setTheologicalNotes(e.target.value)}
                  placeholder="Ex: Conforme à Kifayat p. 32. Rien à signaler."
                  className="w-full bg-[#F4F6F5] border border-[#E2E8E5] text-xs rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#D4A72C]"
                />
              </div>
            </div>

            {/* Signature & Audit Notice */}
            <div className="bg-[#0E4D3C]/5 border border-[#0E4D3C]/20 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0E4D3C]" />
                <span className="text-[#0E4D3C] font-medium">
                  Signature numérique horodatée liée au certificat :
                </span>
              </div>
              <span className="font-mono font-bold text-[#0E4D3C] bg-white px-2 py-0.5 rounded border border-[#0E4D3C]/30">
                {currentScholar.signatureCertId}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-6 py-4 border-t border-[#E2E8E5] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#E2E8E5] text-[#5A6560] hover:bg-[#F4F6F5] text-xs font-semibold"
          >
            Annuler
          </button>

          <button
            id="confirm-decision-btn"
            onClick={handleConfirm}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
              mode === 'reject'
                ? 'bg-rose-700 hover:bg-rose-800 text-white'
                : mode === 'correct'
                ? 'bg-[#1A6B54] hover:bg-[#0E4D3C] text-white'
                : 'bg-[#D4A72C] hover:bg-[#E8C158] text-[#0E4D3C]'
            }`}
          >
            <span>
              {mode === 'certify' && "Apposer le Sceau & Certifier pour Mobile"}
              {mode === 'correct' && "Valider la Version Corrigée"}
              {mode === 'reject' && "Confirmer le Rejet Définitif"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
