import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Database,
  Cpu,
  BookOpen
} from 'lucide-react';
import { RAGValidationItem, ScholarProfile } from '../../types';

interface RAGSimulatorViewProps {
  currentScholar: ScholarProfile;
  onAddToQueue: (newItem: RAGValidationItem) => void;
}

export const RAGSimulatorView: React.FC<RAGSimulatorViewProps> = ({
  currentScholar,
  onAddToQueue,
}) => {
  const [testQuery, setTestQuery] = useState(
    "Quel est le conseil donné par Maodo dans Kifâyat ar-Râghibîn aux jeunes mourides concernant la préservation de la paix sociale et la tolérance religieuse ?"
  );
  const [targetAudience, setTargetAudience] = useState<'Pèlerin' | 'Talibé' | 'Chercheur'>('Pèlerin');
  const [isGenerating, setIsGenerating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    answer: string;
    confidence: number;
    sources: {
      title: string;
      arabic: string;
      french: string;
      ref: string;
    }[];
  } | null>({
    answer: "Dans Kifâyat ar-Râghibîn, Seydi El Hadji Malick Sy (RTA) exhorte les jeunes mourides à être des modèles de concorde, de probité et de respect mutuel au sein de la société. Il préconise d'éviter les polémiques stériles et de faire prévaloir le dialogue courtois.",
    confidence: 0.95,
    sources: [
      {
        title: 'Kifâyat ar-Râghibîn',
        ref: 'Chapitre sur la concorde civile (p. 48)',
        arabic: 'وعليكم بلزوم الجماعة، وحسن المعاملة مع الخلق كافة، فإن الدين المعاملة...',
        french: "Attachez-vous à la concorde communautaire et au noble comportement avec l'ensemble des créatures.",
      },
    ],
  });

  const handleSimulate = () => {
    if (!testQuery.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setSimulationResult({
        answer: `Selon les traités numérisés de Seydi El Hadji Malick Sy (RTA), la réponse s'appuie sur le texte source extrait. Maodo souligne la constance dans la foi, le renoncement aux polémiques et l'observance des devoirs de fraternité.`,
        confidence: 0.94,
        sources: [
          {
            title: 'Ifhâm al-Munkir al-Jânî',
            ref: 'Section Litanies & Convenances',
            arabic: 'والحق أحق أن يتبع، والنصح للمسلمين من أوجب الواجبات.',
            french: "La vérité est la plus digne d'être suivie, et le conseil sincère aux fidèles fait partie des devoirs impérieux.",
          },
        ],
      });
    }, 600);
  };

  const handlePushToQueue = () => {
    if (!simulationResult) return;
    const newItem: RAGValidationItem = {
      id: `val-sim-${Date.now()}`,
      userQuery: testQuery,
      generatedAnswer: simulationResult.answer,
      confidenceScore: simulationResult.confidence,
      category: 'Éthique & Société',
      targetAudience: targetAudience,
      priority: 'normal',
      submittedAt: new Date().toISOString(),
      status: 'pending',
      sources: simulationResult.sources.map((s, idx) => ({
        id: `sim-src-${idx}`,
        bookTitle: s.title,
        arabicTitle: 'سيدي الحاج مالك سي',
        chapter: s.ref,
        pageOrBayt: 'Extrait vectorisé',
        originalArabic: s.arabic,
        translationFr: s.french,
        reliabilityScore: 0.95,
      })),
    };
    onAddToQueue(newItem);
  };

  return (
    <div className="space-y-6">
      {/* Simulation query box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0E4D3C]" />
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Simulateur de Requête RAG
            </label>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Profil :</span>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
            >
              <option value="Pèlerin">Pèlerin</option>
              <option value="Talibé">Talibé</option>
              <option value="Chercheur">Chercheur</option>
            </select>
          </div>
        </div>

        <textarea
          rows={3}
          value={testQuery}
          onChange={(e) => setTestQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 focus:border-[#0E4D3C] rounded-xl p-3.5 text-xs text-slate-800 leading-relaxed focus:outline-none focus:bg-white transition-colors"
          placeholder="Ex: Quelle est la position de Maodo sur..."
        />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Database className="w-3.5 h-3.5 text-[#0E4D3C]" />
            <span>Recherche sémantique sur l'ensemble du corpus Tivaouane</span>
          </div>

          <button
            id="btn-simulate-rag"
            onClick={handleSimulate}
            disabled={isGenerating}
            className="px-5 py-2 bg-[#0E4D3C] hover:bg-[#1A6B54] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#D4A72C]" />
                <span>Recherche Vectorielle...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#D4A72C]" />
                <span>Tester la Réponse RAG</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {simulationResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0E4D3C] uppercase tracking-wider">
                Synthèse Sémantique Générée
              </span>
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Fidélité : {Math.round(simulationResult.confidence * 100)}%
              </span>
            </div>

            <button
              id="btn-push-to-queue"
              onClick={handlePushToQueue}
              className="px-3.5 py-1.5 bg-[#D4A72C] hover:bg-[#E8C158] text-[#0E4D3C] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmettre en Validation</span>
            </button>
          </div>

          {/* Generated Text */}
          <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100 text-sm text-slate-800 leading-relaxed">
            {simulationResult.answer}
          </div>

          {/* Extracted Sources */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Extraits du corpus récupérés (Top Matches)
            </span>

            {simulationResult.sources.map((src, i) => (
              <div key={i} className="bg-amber-50/30 border border-amber-200/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#0E4D3C]">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#D4A72C]" />
                    <span>{src.title}</span>
                  </div>
                  <span className="text-slate-400 font-normal">{src.ref}</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-right">
                  <p className="font-serif text-sm text-[#0E4D3C] font-semibold leading-relaxed" dir="rtl">
                    « {src.arabic} »
                  </p>
                </div>

                <div className="text-xs text-slate-600 italic px-1">
                  « {src.french} »
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
