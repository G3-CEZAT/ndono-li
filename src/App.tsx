import React, { useState, useEffect } from 'react';
import { PilgrimApp } from './components/pilgrim/PilgrimApp';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { DashboardView } from './components/dashboard/DashboardView';
import { ValidationQueueView } from './components/validation/ValidationQueueView';
import { ValidationModal } from './components/validation/ValidationModal';
import { HistoryView } from './components/history/HistoryView';
import { CorpusView } from './components/corpus/CorpusView';
import { VectorUploadView } from './components/ingestion/VectorUploadView';
import { RAGSimulatorView } from './components/simulator/RAGSimulatorView';
import { MetricsView } from './components/metrics/MetricsView';
import { 
  ActiveTab, 
  RAGValidationItem, 
  ScholarProfile, 
  ValidationStatus,
  IngestionDocument 
} from './types';
import { 
  INITIAL_SCHOLARS, 
  INITIAL_QUEUE_ITEMS, 
  INITIAL_HISTORY_ITEMS, 
  CORPUS_WORKS,
  INITIAL_INGESTION_DOCUMENTS 
} from './data/mockData';
import { CheckCircle2, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

export default function App() {
  // Check URL query parameters or hash to decouple portals:
  // User Portal: / or ?portal=user
  // Admin Portal: ?portal=admin or ?admin=true or #/admin
  const getInitialPortal = (): 'user' | 'admin' => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isParamAdmin = params.get('portal') === 'admin' || params.get('admin') === 'true';
      const isHashAdmin = window.location.hash === '#/admin' || window.location.hash === '#admin';
      if (isParamAdmin || isHashAdmin) return 'admin';
    }
    return 'user';
  };

  const [portal, setPortal] = useState<'user' | 'admin'>(getInitialPortal);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [scholars, setScholars] = useState<ScholarProfile[]>(INITIAL_SCHOLARS);
  const [currentScholar, setCurrentScholar] = useState<ScholarProfile>(INITIAL_SCHOLARS[0]);
  
  const [queueItems, setQueueItems] = useState<RAGValidationItem[]>(INITIAL_QUEUE_ITEMS);
  const [historyItems, setHistoryItems] = useState<RAGValidationItem[]>(INITIAL_HISTORY_ITEMS);
  const [corpusWorks, setCorpusWorks] = useState(CORPUS_WORKS);
  const [documents, setDocuments] = useState<IngestionDocument[]>(INITIAL_INGESTION_DOCUMENTS);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState<RAGValidationItem | null>(null);
  const [modalInitialAction, setModalInitialAction] = useState<'certify' | 'correct' | 'reject'>('certify');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync URL when portal changes
  const switchPortal = (target: 'user' | 'admin') => {
    setPortal(target);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (target === 'admin') {
        url.searchParams.set('portal', 'admin');
        window.history.pushState({}, '', url.toString());
      } else {
        url.searchParams.delete('portal');
        url.searchParams.delete('admin');
        window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setPortal(getInitialPortal());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenReviewModal = (
    item: RAGValidationItem, 
    initialAction: 'certify' | 'correct' | 'reject' = 'certify'
  ) => {
    setSelectedItemForReview(item);
    setModalInitialAction(initialAction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItemForReview(null);
  };

  const handleSubmitDecision = (
    itemId: string,
    action: ValidationStatus,
    finalText: string,
    theologicalNotes: string,
    rejectionReason?: string
  ) => {
    const targetItem = queueItems.find((i) => i.id === itemId);
    if (!targetItem) return;

    const validationLog = {
      id: `log-${Date.now()}`,
      scholarId: currentScholar.id,
      scholarName: currentScholar.name,
      scholarTitle: currentScholar.title,
      timestamp: new Date().toISOString(),
      action,
      originalText: targetItem.generatedAnswer,
      finalText,
      theologicalNotes: theologicalNotes || 'Conforme aux enseignements authentifiés de Maodo.',
      rejectionReason,
      certifiedSources: targetItem.sources.map((s) => `${s.bookTitle} (${s.pageOrBayt})`),
    };

    const updatedItem: RAGValidationItem = {
      ...targetItem,
      status: action,
      generatedAnswer: finalText,
      validationLog,
    };

    // Remove from queue and prepend to history
    setQueueItems((prev) => prev.filter((i) => i.id !== itemId));
    setHistoryItems((prev) => [updatedItem, ...prev]);

    handleCloseModal();

    const actionLabels: Record<ValidationStatus, string> = {
      certified: 'Réponse certifiée avec succès et transmise au serveur Hadara Tidiane.',
      corrected: 'Correction enregistrée et validée pour diffusion publique.',
      rejected: 'Réponse rejetée avec motif théologique consigné au registre.',
      pending: '',
    };
    showToast(actionLabels[action]);
  };

  const handleQuickApprove = (item: RAGValidationItem) => {
    handleSubmitDecision(
      item.id,
      'certified',
      item.generatedAnswer,
      'Certification rapide par le collège des érudits'
    );
  };

  const handleAddToQueueFromSimulator = (newItem: RAGValidationItem) => {
    setQueueItems((prev) => [newItem, ...prev]);
    setActiveTab('queue');
    showToast("Nouvelle question RAG ajoutée à la file d'attente.");
  };

  const handleAddDocument = (newDoc: IngestionDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Document « ${newDoc.fileName} » indexé avec succès.`);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    showToast('Document retiré de la base vectorielle.');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Données synchronisées avec la Zawiya de Tivaouane.");
    }, 600);
  };

  // 1. ESPACE UTILISATEUR / PÈLERIN : HADARA TIDIANE (PORTAIL PÈLERIN COMPLET)
  // Page d'accueil riche, Biographie, 4 Piliers, Gamou 2026, Traités, Vidéos, Assistant RAG & Tasbih
  if (portal === 'user') {
    return (
      <PilgrimApp
        onOpenAdminWorkstation={() => switchPortal('admin')}
      />
    );
  }

  // 2. ESPACE ÉRUDITS & ADMINISTRATION (HADARA TIDIANE ADMIN)
  // Accessible via ?portal=admin
  return (
    <div className="flex h-screen bg-[#F4F6F5] text-[#1A1A1A] font-sans overflow-hidden">
      {/* Sidebar with Hadara Tidiane Visual Identity */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={queueItems.length}
        currentScholar={currentScholar}
        scholars={scholars}
        onSwitchScholar={setCurrentScholar}
        onReturnToPilgrimView={() => switchPortal('user')}
      />

      {/* Main Administrative Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <TopHeader
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pendingCount={queueItems.length}
          currentScholar={currentScholar}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onReturnToPilgrimView={() => switchPortal('user')}
        />

        {/* Scrollable Workstation Content */}
        <main 
          id="main-admin-content"
          className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#F4F6F5]"
        >
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                queueItems={queueItems}
                historyItems={historyItems}
                corpusWorks={corpusWorks}
                currentScholar={currentScholar}
                onNavigate={setActiveTab}
                onOpenReviewModal={(item) => handleOpenReviewModal(item, 'certify')}
              />
            )}

            {activeTab === 'queue' && (
              <ValidationQueueView
                items={queueItems}
                currentScholar={currentScholar}
                onOpenReviewModal={handleOpenReviewModal}
                onQuickApprove={handleQuickApprove}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'upload' && (
              <VectorUploadView
                documents={documents}
                corpusWorks={corpusWorks}
                onAddDocument={handleAddDocument}
                onDeleteDocument={handleDeleteDocument}
                currentScholarName={currentScholar.name}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView
                historyItems={historyItems}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'corpus' && (
              <CorpusView
                corpusWorks={corpusWorks}
                searchQuery={searchQuery}
                onNavigateToUpload={() => setActiveTab('upload')}
              />
            )}

            {activeTab === 'simulator' && (
              <RAGSimulatorView
                currentScholar={currentScholar}
                onAddToQueue={handleAddToQueueFromSimulator}
              />
            )}

            {activeTab === 'metrics' && <MetricsView />}
          </div>
        </main>
      </div>

      {/* Review & Certification Modal */}
      {isModalOpen && (
        <ValidationModal
          item={selectedItemForReview}
          currentScholar={currentScholar}
          initialAction={modalInitialAction}
          onClose={handleCloseModal}
          onSubmitDecision={handleSubmitDecision}
        />
      )}

      {/* Action Toast Notification */}
      {toastMessage && (
        <div 
          id="admin-toast"
          className="fixed bottom-6 right-6 z-50 bg-[#0E4D3C] text-white px-5 py-3.5 rounded-xl shadow-xl border border-[#D4A72C] flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="w-6 h-6 rounded-full bg-[#D4A72C] text-[#0E4D3C] flex items-center justify-center font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
