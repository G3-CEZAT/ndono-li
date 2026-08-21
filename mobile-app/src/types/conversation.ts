import { ChatMessage } from "./chat";

export interface Conversation {
  id: string;
  // Id de la conversation côté backend (NestJS) : absent tant qu'aucun message n'a
  // encore été envoyé, renseigné après la première réponse pour permettre au serveur
  // de rattacher les messages suivants au bon historique.
  remoteConversationId?: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}
