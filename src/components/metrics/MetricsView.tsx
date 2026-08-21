import React from 'react';
import { 
  CheckCircle2, 
  Code2,
  Cpu,
  Clock,
  Database
} from 'lucide-react';

export const MetricsView: React.FC = () => {
  const apiEndpoints = [
    {
      method: 'POST',
      path: '/api/mobile/v1/ask',
      consumer: 'App Mobile Pèlerin',
      description: "Soumission de la question pèlerin. RAG sémantique et mise en file d'arbitrage.",
    },
    {
      method: 'GET',
      path: '/api/mobile/v1/answer/:id',
      consumer: 'App Mobile Pèlerin',
      description: "Consultation du statut. Retourne la réponse uniquement si certifiée par un érudit.",
    },
    {
      method: 'GET',
      path: '/api/admin/v1/queue',
      consumer: 'Web Admin Érudits',
      description: "Récupération des réponses générées avec sources bibliographiques à vérifier.",
    },
    {
      method: 'POST',
      path: '/api/admin/v1/validate',
      consumer: 'Web Admin Érudits',
      description: "Approbation, correction textuelle ou rejet avec sceau et horodatage.",
    },
    {
      method: 'POST',
      path: '/api/admin/v1/ingest',
      consumer: 'Web Admin Ingestion',
      description: "Extraction OCR, chunking et vectorisation des manuscrits PDF et textes.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Certification Globale</span>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              98.4%
            </span>
          </div>
          <div className="text-2xl font-bold text-[#0E4D3C] font-mono">
            1 482
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Réponses certifiées conformes aux sources
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Délai Moyen d'Arbitrage</span>
            <span className="font-bold text-[#D4A72C] bg-amber-50 px-2 py-0.5 rounded">
              ~ 8 min
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-800 font-mono">
            Rapide
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Haute disponibilité Gamou & Ziarra
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Corpus Vectoriel</span>
            <span className="font-bold text-[#0E4D3C] bg-emerald-50 px-2 py-0.5 rounded">
              5 Ouvrages
            </span>
          </div>
          <div className="text-2xl font-bold text-[#0E4D3C] font-mono">
            2 147 frags
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Poèmes et traités en arabe et français
          </p>
        </div>
      </div>

      {/* Shared API Contract Table (for Mobile alignment) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#0E4D3C]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Contrat d'API Mobile & Backend
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#0E4D3C] text-white px-2.5 py-0.5 rounded">
            REST v1
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-4">Méthode</th>
                <th className="py-2.5 px-4">Endpoint</th>
                <th className="py-2.5 px-4">Consommateur</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apiEndpoints.map((ep, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      ep.method === 'POST' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    }`}>
                      {ep.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#0E4D3C]">
                    {ep.path}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {ep.consumer}
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-sm">
                    {ep.description}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Actif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
