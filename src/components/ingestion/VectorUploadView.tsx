import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Database, 
  Sparkles, 
  Clock, 
  Trash2, 
  Eye, 
  Play, 
  FileCode, 
  FileUp, 
  RefreshCw,
  Search,
  Check
} from 'lucide-react';
import { IngestionDocument, CorpusWork } from '../../types';

interface VectorUploadViewProps {
  documents: IngestionDocument[];
  corpusWorks: CorpusWork[];
  onAddDocument: (doc: IngestionDocument) => void;
  onDeleteDocument: (docId: string) => void;
  currentScholarName: string;
}

export const VectorUploadView: React.FC<VectorUploadViewProps> = ({
  documents,
  corpusWorks,
  onAddDocument,
  onDeleteDocument,
  currentScholarName,
}) => {
  const [activeMode, setActiveMode] = useState<'file' | 'text'>('file');
  const [selectedBook, setSelectedBook] = useState<string>(corpusWorks[0]?.title || 'Kifâyat ar-Râghibîn');
  const [category, setCategory] = useState<string>('Fiqh, Société & Éthique');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progressStep, setProgressStep] = useState<string>('');
  
  // Manual text input state
  const [manualTitle, setManualTitle] = useState('');
  const [arabicText, setArabicText] = useState('');
  const [frenchTranslation, setFrenchTranslation] = useState('');
  
  // Preview modal/drawer state
  const [previewDoc, setPreviewDoc] = useState<IngestionDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateIngestion = (fileName: string, fileSize: string, type: 'pdf' | 'txt' | 'docx' | 'arabic_manuscript', preview: string, arText?: string, frText?: string) => {
    setIsProcessing(true);
    setUploadProgress(15);
    setProgressStep('Extraction du texte et normalisation des caractères arabes...');

    setTimeout(() => {
      setUploadProgress(45);
      setProgressStep('Découpage sémantique (Chunking 512 tokens, 64 overlap)...');
    }, 600);

    setTimeout(() => {
      setUploadProgress(78);
      setProgressStep('Génération des embeddings vectoriels multilingues...');
    }, 1200);

    setTimeout(() => {
      setUploadProgress(100);
      setProgressStep('Indexation vectorielle terminée avec succès.');

      const newDoc: IngestionDocument = {
        id: `doc-${Date.now()}`,
        fileName,
        fileSize,
        fileType: type,
        workCategory: category,
        associatedBook: selectedBook,
        uploadedAt: new Date().toISOString(),
        uploadedBy: currentScholarName,
        status: 'indexed',
        chunkCount: Math.floor(Math.random() * 250) + 50,
        extractedTokens: Math.floor(Math.random() * 80000) + 15000,
        previewSnippet: preview,
        arabicContent: arText || preview,
        translationFr: frText || 'Traduction et annotations validées par le comité.',
      };

      onAddDocument(newDoc);
      setIsProcessing(false);
      setUploadProgress(0);
      setProgressStep('');
      // Reset manual forms if any
      setManualTitle('');
      setArabicText('');
      setFrenchTranslation('');
    }, 1800);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processSelectedFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    let ext: 'pdf' | 'txt' | 'docx' | 'arabic_manuscript' = 'pdf';
    if (file.name.endsWith('.txt')) ext = 'txt';
    else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) ext = 'docx';
    
    simulateIngestion(
      file.name,
      sizeStr,
      ext,
      `Document téléversé : ${file.name} associé à l'œuvre ${selectedBook}. Traitement OCR et vectorisation terminés.`
    );
  };

  const handleManualTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arabicText.trim() && !frenchTranslation.trim()) return;

    const title = manualTitle.trim() || `Extrait_${selectedBook.replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}`;
    simulateIngestion(
      `${title}.txt`,
      `${((arabicText.length + frenchTranslation.length) / 1024).toFixed(1)} KB`,
      'txt',
      arabicText || frenchTranslation,
      arabicText,
      frenchTranslation
    );
  };

  const filteredDocs = documents.filter(doc => 
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.associatedBook.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.workCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalChunks = documents.reduce((acc, d) => acc + d.chunkCount, 0);
  const totalTokens = documents.reduce((acc, d) => acc + d.extractedTokens, 0);

  return (
    <div id="vector-upload-view" className="space-y-6">
      {/* Top Header Banner - Clean & Modern */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4A72C]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E4D3C]">
              Ingestion Vectorielle RAG
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 font-serif">
            Enrichissement du Corpus & Base Vectorielle
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Téléversez des manuscrits PDF, textes ou traductions certifiées pour alimenter la recherche sémantique RAG.
          </p>
        </div>

        {/* Quick Stats Chips */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">Documents Indexés</div>
            <div className="text-lg font-bold text-[#0E4D3C] font-mono">{documents.length}</div>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-xs text-slate-500 font-medium">Fragments (Chunks)</div>
            <div className="text-lg font-bold text-[#D4A72C] font-mono">{totalChunks.toLocaleString()}</div>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center hidden sm:block">
            <div className="text-xs text-emerald-700 font-medium">Tokens Vectorisés</div>
            <div className="text-lg font-bold text-emerald-800 font-mono">{(totalTokens / 1000).toFixed(0)}k</div>
          </div>
        </div>
      </div>

      {/* Upload Control Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upload Box (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          {/* Mode Switcher */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <button
                id="tab-upload-file"
                onClick={() => setActiveMode('file')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeMode === 'file'
                    ? 'bg-[#0E4D3C] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileUp className="w-4 h-4" />
                  <span>Fichiers PDF / DOCX</span>
                </div>
              </button>

              <button
                id="tab-upload-text"
                onClick={() => setActiveMode('text')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeMode === 'text'
                    ? 'bg-[#0E4D3C] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  <span>Saisie Manuelle de Textes</span>
                </div>
              </button>
            </div>

            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Format UTF-8 / Arabe Vocalisé
            </span>
          </div>

          {/* Book and Category Mapping Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ouvrage de Référence
              </label>
              <select
                id="select-corpus-book"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0E4D3C] focus:bg-white transition-all font-medium"
              >
                {corpusWorks.map((work) => (
                  <option key={work.id} value={work.title}>
                    {work.title}
                  </option>
                ))}
                <option value="Autre Écrit ou Correspondance">Autre Écrit ou Correspondance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Thématique / Catégorie
              </label>
              <select
                id="select-work-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0E4D3C] focus:bg-white transition-all font-medium"
              >
                <option value="Fiqh, Société & Éthique">Fiqh, Société & Éthique</option>
                <option value="Sîra Prophétique & Poésie">Sîra Prophétique & Poésie</option>
                <option value="Tariqa Tijaniyya & Soufisme">Tariqa Tijaniyya & Soufisme</option>
                <option value="Pédagogie Spirituelle & Adab">Pédagogie Spirituelle & Adab</option>
                <option value="Panégyriques & Invocations">Panégyriques & Invocations</option>
              </select>
            </div>
          </div>

          {/* Mode 1: Drag & Drop Zone */}
          {activeMode === 'file' ? (
            <div className="space-y-4">
              <div
                id="dropzone-area"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-[#D4A72C] bg-[#D4A72C]/10 scale-[1.01]' 
                    : 'border-slate-300 hover:border-[#0E4D3C] hover:bg-slate-50/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.docx,.doc"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="file-upload-input"
                />
                
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0E4D3C] flex items-center justify-center mx-auto mb-3 shadow-sm border border-emerald-100">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <div className="text-base font-semibold text-slate-800">
                  Glissez-déposez votre fichier ici, ou <span className="text-[#0E4D3C] underline">parcourez vos dossiers</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Prend en charge les PDF de manuscrits (avec OCR arabe), fichiers Word et documents texte (max 50 MB).
                </p>

                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Normalisation arabe</span>
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Découpage sémantique</span>
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Embeddings RAG</span>
                </div>
              </div>

              {/* Sample quick upload helper buttons */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-medium">Charger un exemple :</span>
                <button
                  type="button"
                  id="btn-sample-pdf-1"
                  onClick={() => simulateIngestion(
                    'Manuscrit_Ifham_Al_Munkir_Chapitre4.pdf',
                    '3.2 MB',
                    'pdf',
                    'Extrait manuscrit original sur les convenances de la récitation collective de la Wazifa.'
                  )}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  + Chapitre Ifham.pdf
                </button>
                <button
                  type="button"
                  id="btn-sample-pdf-2"
                  onClick={() => simulateIngestion(
                    'Poeme_Nuniyya_Annoté_Wolof_Fr.pdf',
                    '2.1 MB',
                    'arabic_manuscript',
                    'La Qasida Nûniyya de Seydi El Hadji Malick Sy avec glose en Wolofal et français.'
                  )}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  + Qasida Nûniyya.pdf
                </button>
              </div>
            </div>
          ) : (
            /* Mode 2: Manual Text / Arabic Extraction */
            <form onSubmit={handleManualTextSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Intitulé du fragment ou sous-chapitre
                </label>
                <input
                  type="text"
                  id="input-manual-title"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Ex: Bayt sur la quête du savoir (Fâkihat at-Tullâb, p. 12)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#0E4D3C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Texte en Arabe (avec diacritiques si possible)</span>
                  <span className="text-[#0E4D3C] font-mono text-[11px]">النص العربي</span>
                </label>
                <textarea
                  id="input-arabic-text"
                  rows={3}
                  dir="rtl"
                  value={arabicText}
                  onChange={(e) => setArabicText(e.target.value)}
                  placeholder="اكتب هنا النص العربي الأصلي أو الأبيات الشعرية..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#0E4D3C] focus:bg-white font-serif leading-relaxed text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Traduction & Explication (Français / Wolof)
                </label>
                <textarea
                  id="input-french-text"
                  rows={3}
                  value={frenchTranslation}
                  onChange={(e) => setFrenchTranslation(e.target.value)}
                  placeholder="Traduction certifiée ou commentaire explicatif..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#0E4D3C] focus:bg-white leading-relaxed"
                />
              </div>

              <button
                type="submit"
                id="btn-submit-manual-text"
                disabled={!arabicText.trim() && !frenchTranslation.trim()}
                className="w-full py-2.5 px-4 bg-[#0E4D3C] hover:bg-[#1A6B54] disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Database className="w-4 h-4 text-[#D4A72C]" />
                <span>Vectoriser et Enregistrer dans le Corpus</span>
              </button>
            </form>
          )}

          {/* Live Progress Bar when Processing */}
          {isProcessing && (
            <div id="upload-progress-container" className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-[#0E4D3C] animate-spin" />
                  {progressStep}
                </span>
                <span className="font-mono">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#0E4D3C] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Vector Pipeline Architecture Explainer & Pipeline Status (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0E4D3C] to-[#09372B] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#D4A72C]" />
                <h3 className="text-base font-bold text-white font-serif">Pipeline RAG Tivaouane</h3>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#D4A72C] text-[#0E4D3C] rounded">
                Vector DB Active
              </span>
            </div>

            <p className="text-xs text-white/80 leading-relaxed">
              Chaque texte injecté passe par notre chaîne de traitement certifiée avant d’être interrogé par le modèle Gemini RAG.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/20 text-[#D4A72C] flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="text-xs font-bold text-white">OCR & Tashkeel Preservation</div>
                  <div className="text-[11px] text-white/70">Conservation rigoureuse des voyelles et de la métrique poétique.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-[#D4A72C]/20 text-[#D4A72C] flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Segmentation Sémantique</div>
                  <div className="text-[11px] text-white/70">Découpage par verset, bayt ou paragraphe juridique sans rupture de sens.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-[#D4A72C] w-7 h-7 rounded-lg bg-[#D4A72C]/20 flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Embeddings Multilingues</div>
                  <div className="text-[11px] text-white/70">Vectorisation conjointe Arabe / Français / Wolof pour recherche hybride.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span>Indexation en temps réel</span>
            <span className="font-mono text-[#D4A72C]">Top-K: 5 fragments</span>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              Documents du Corpus Indexés ({filteredDocs.length})
            </h2>
            <p className="text-xs text-slate-500">
              Gérez les fichiers sources et inspectez les fragments vectoriels actifs.
            </p>
          </div>

          {/* Search filter input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="search-documents-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre ou ouvrage..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0E4D3C] focus:bg-white"
            />
          </div>
        </div>

        {/* Table list of documents */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Fichier & Format</th>
                <th className="py-3 px-4">Ouvrage Associé</th>
                <th className="py-3 px-4">Chunks / Tokens</th>
                <th className="py-3 px-4">Statut Vectoriel</th>
                <th className="py-3 px-4">Téléversé le</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0E4D3C] flex items-center justify-center font-bold flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate max-w-xs">{doc.fileName}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">{doc.fileType} • {doc.fileSize}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800 block truncate max-w-[200px]">{doc.associatedBook}</span>
                    <span className="text-[10px] text-slate-400">{doc.workCategory}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-800 font-semibold">{doc.chunkCount} chunks</div>
                    <div className="text-[10px] text-slate-400 font-mono">{(doc.extractedTokens / 1000).toFixed(1)}k tokens</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Indexé
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[130px]">Par {doc.uploadedBy}</div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        id={`btn-view-doc-${doc.id}`}
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#0E4D3C] hover:bg-emerald-50 transition-colors"
                        title="Inspecter les extraits et chunks"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        id={`btn-delete-doc-${doc.id}`}
                        onClick={() => onDeleteDocument(doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Supprimer du corpus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Inspector Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-5 bg-[#0E4D3C] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A72C]">
                  Inspection Vectorielle
                </span>
                <h3 className="text-base font-bold text-white font-serif truncate mt-0.5">
                  {previewDoc.fileName}
                </h3>
              </div>
              <button
                id="btn-close-doc-preview"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Ouvrage rattaché</span>
                  <span className="font-semibold text-slate-800">{previewDoc.associatedBook}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Chunks générés</span>
                  <span className="font-mono font-bold text-[#0E4D3C]">{previewDoc.chunkCount} segments vectorisés</span>
                </div>
              </div>

              {previewDoc.arabicContent && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Extrait Arabe Récupéré
                  </label>
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-sm font-serif text-slate-800 text-right leading-relaxed" dir="rtl">
                    {previewDoc.arabicContent}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Traduction & Aperçu Sémantique
                </label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {previewDoc.translationFr || previewDoc.previewSnippet}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                id="btn-modal-close"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-[#0E4D3C] text-white text-xs font-semibold rounded-xl hover:bg-[#1A6B54] transition-colors"
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
