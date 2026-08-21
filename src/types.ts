export type UserRole = 'scholar' | 'admin' | 'moderator';

export interface ScholarProfile {
  id: string;
  name: string;
  title: string;
  institution: string;
  role: UserRole;
  avatarUrl?: string;
  signatureCertId: string;
}

export interface SourceReference {
  id: string;
  bookTitle: string;
  arabicTitle: string;
  chapter: string;
  pageOrBayt: string;
  originalArabic: string;
  translationFr: string;
  translationWolof?: string;
  reliabilityScore: number;
}

export type ValidationStatus = 'pending' | 'certified' | 'corrected' | 'rejected';
export type PriorityLevel = 'urgent' | 'normal' | 'low';

export interface ValidationLog {
  id: string;
  scholarId: string;
  scholarName: string;
  scholarTitle: string;
  timestamp: string;
  action: ValidationStatus;
  originalText: string;
  finalText: string;
  theologicalNotes?: string;
  rejectionReason?: string;
  certifiedSources: string[];
}

export interface RAGValidationItem {
  id: string;
  userQuery: string;
  userContext?: string;
  generatedAnswer: string;
  confidenceScore: number; // 0 to 1
  sources: SourceReference[];
  status: ValidationStatus;
  priority: PriorityLevel;
  submittedAt: string;
  category: 'Fiqh & Pratiques' | 'Sîra & Hadith' | 'Tariqa Tijaniyya' | 'Éthique & Société' | 'Poésie & Qasaid';
  targetAudience: 'Pèlerin' | 'Talibé' | 'Chercheur' | 'Grand Public';
  validationLog?: ValidationLog;
}

export interface CorpusWork {
  id: string;
  title: string;
  arabicTitle: string;
  category: string;
  description: string;
  totalFragments: number;
  lastIndexed: string;
  verifiedBy: string;
  yearWritten?: string;
}

export interface IngestionDocument {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'txt' | 'docx' | 'arabic_manuscript';
  workCategory: string;
  associatedBook: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'indexed' | 'processing' | 'pending' | 'error';
  chunkCount: number;
  extractedTokens: number;
  previewSnippet: string;
  arabicContent?: string;
  translationFr?: string;
}

export type ActiveTab = 'dashboard' | 'queue' | 'history' | 'upload' | 'corpus' | 'simulator' | 'metrics';
