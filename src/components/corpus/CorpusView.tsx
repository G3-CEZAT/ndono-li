import React, { useState } from 'react';
import { 
  BookOpen, 
  UploadCloud, 
  CheckCircle2, 
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CorpusWork } from '../../types';

interface CorpusViewProps {
  corpusWorks: CorpusWork[];
  searchQuery: string;
  onNavigateToUpload?: () => void;
}

export const CorpusView: React.FC<CorpusViewProps> = ({
  corpusWorks,
  searchQuery,
  onNavigateToUpload,
}) => {
  const [selectedWork, setSelectedWork] = useState<CorpusWork>(corpusWorks[0]);

  const fragments = [
    {
      id: 'frag-1',
      page: 'Section Préliminaire - Versets d’ouverture',
      arabic: 'باسم الإله أبتدئ النظما *** حمدا له مصليا مسلما / على النبي المصطفى المختار *** وآله وصحبه الأبرار',
      french: "Au nom d'Allah je commence cette versification, Le louant et priant avec salut sur le Prophète Élu, sa sainte famille et ses compagnons.",
      theme: 'Doxologie & Ouverture',
    },
    {
      id: 'frag-2',
      page: 'Chapitre 2 - Adab et Fraternité',
      arabic: 'وعامل الإخوان بالإنصاف *** والزم طريق الحق والعفاف / وكن رفيقا بالضعيف الجاهل *** وذاك شأن العارف الفاضل',
      french: "Traite tes frères avec équité, attache-toi à la voie de la vérité et sois bienveillant envers le faible et l'ignorant.",
      theme: 'Éthique & Adab',
    },
    {
      id: 'frag-3',
      page: 'Chapitre 5 - Litanies & Présence du Cœur',
      arabic: 'ولا تصح عندنا الوظيفة *** إلا إذا كانت بها لطيفة / من الطهارات وجمع البال *** فاحذر أخي من سائر الأشغال',
      french: "La récitation des litanies (Wazifa) ne saurait être parfaite sans la pureté intérieure et le recueillement de l'esprit.",
      theme: 'Litanies & Wazifa',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0E4D3C]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E4D3C]">
              Corpus Fondamental
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-serif mt-1">
            Écrits & Œuvres de Seydi El Hadji Malick Sy (RTA)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            5 ouvrages majeurs indexés dans la base vectorielle pour le RAG de Tivaouane.
          </p>
        </div>

        {onNavigateToUpload && (
          <button
            id="btn-corpus-to-upload"
            onClick={onNavigateToUpload}
            className="px-4 py-2 bg-[#0E4D3C] hover:bg-[#1A6B54] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
          >
            <UploadCloud className="w-4 h-4 text-[#D4A72C]" />
            <span>Téléverser des Manuscrits PDF</span>
          </button>
        )}
      </div>

      {/* Main Grid: Works list (left) & Fragment viewer (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Works selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Ouvrages Indexés ({corpusWorks.length})
          </div>

          <div className="space-y-2.5">
            {corpusWorks.map((work) => {
              const isSelected = selectedWork.id === work.id;
              return (
                <div
                  key={work.id}
                  id={`work-card-${work.id}`}
                  onClick={() => setSelectedWork(work)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#0E4D3C] shadow-md ring-2 ring-[#0E4D3C]/10'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-[#0E4D3C] bg-emerald-50 px-2 py-0.5 rounded-md">
                      {work.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {work.totalFragments} frags
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {work.title}
                  </h4>
                  <div className="font-serif text-xs text-[#0E4D3C] font-semibold my-1 text-right" dir="rtl">
                    {work.arabicTitle}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {work.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Work Details & Fragments (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    {selectedWork.title}
                  </h3>
                  <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {selectedWork.yearWritten || 'Tivaouane'}
                  </span>
                </div>
                <div className="font-serif text-base text-[#1A6B54] font-semibold mt-1" dir="rtl">
                  {selectedWork.arabicTitle}
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {selectedWork.description}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Vectorisé
              </span>
            </div>
          </div>

          {/* Fragments list */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Extraits vectoriels actifs pour ce traité
            </div>

            {fragments.map((frag) => (
              <div key={frag.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
                  <span className="font-semibold text-slate-800">{frag.page}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{frag.theme}</span>
                </div>

                <div className="bg-emerald-50/30 p-3 rounded-xl border border-emerald-100 text-right">
                  <p className="font-serif text-sm text-[#0E4D3C] font-semibold leading-relaxed" dir="rtl">
                    « {frag.arabic} »
                  </p>
                </div>

                <div className="text-xs text-slate-600 italic px-1">
                  « {frag.french} »
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
