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

export interface BiographyMilestone {
  period: string;
  label: string;
  description: string;
  historicalNote?: string;
}

export interface HadaraPillar {
  number: number;
  title: string;
  description: string;
  hadithOrPrinciple?: string;
  iconName?: string;
}

export interface GamouEventData {
  edition: string;
  yearGregorian: number;
  hijriDate: string;
  gregorianDate: string;
  theme: string;
  themeArabic: string;
  description: string;
  isUpcoming: boolean;
  committeeSpeaker?: string;
}

export interface PilgrimVideoResource {
  id: string;
  title: string;
  source: string;
  narratorOrContext: string;
  synopsis: string;
  youtubeUrl: string;
  verifiedByEditorial: boolean;
  duration?: string;
  badge?: string;
}

export interface PilgrimHomeContent {
  hero: {
    title: string;
    honorific: string;
    dates: string;
    role: string;
    tagline: string;
    primaryBadge: string;
    subBadge: string;
  };
  biography: {
    title: string;
    subtitle: string;
    summary: string;
    scholarlyNote: string;
    keyMilestones: BiographyMilestone[];
  };
  hadara: {
    title: string;
    definition: string;
    pillars: HadaraPillar[];
    statusTivaouane: string;
  };
  gamou: GamouEventData;
  videoResources: {
    sectionTitle: string;
    sectionDescription: string;
    editorialValidationStatus: 'draft_pending_human_review' | 'certified_by_scholars';
    items: PilgrimVideoResource[];
  };
  ctaChatbot: {
    title: string;
    subtitle: string;
    buttonLabel: string;
    ragCertificationNotice: string;
  };
}

export type ActiveTab = 'pilgrim-home' | 'dashboard' | 'queue' | 'history' | 'upload' | 'corpus' | 'simulator' | 'metrics';
