export type MessageRole = "user" | "assistant";

// Un chunk de source cité par le RAG (document validé par un érudit).
export interface ChatSource {
  documentTitle: string;
  authorScholar: string;
  score: number;
  chunkContent: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  // Dérivé côté client : sources.length > 0 (le backend ne renvoie pas encore
  // de booléen "certified" explicite, voir useChat.ts).
  certified?: boolean;
  sources?: ChatSource[];
  createdAt: string;
  // Message conservé dans l'historique mais dont l'envoi a échoué (réseau/serveur) :
  // reste visible, contrairement à une suppression silencieuse.
  failed?: boolean;
}

// Ligne "Message" telle que renvoyée par le backend NestJS (Prisma).
export interface BackendMessage {
  id: string;
  conversationId: string;
  sender: "USER" | "AI";
  content: string;
  sources: ChatSource[] | null;
  audioUrl: string | null;
  createdAt: string;
}

export interface SendMessageResponse {
  conversationId: string;
  userMessage: BackendMessage;
  aiMessage: BackendMessage;
}

export interface SendVoiceMessageResponse extends SendMessageResponse {
  transcribedQuestion: string;
}

export interface PilgrimInfoItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  location?: string;
}

export interface PilgrimInfoCategory {
  id: string;
  title: string;
  items: PilgrimInfoItem[];
}

export interface PilgrimInfoResponse {
  categories: PilgrimInfoCategory[];
}
