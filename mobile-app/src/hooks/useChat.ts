import { useCallback, useState } from "react";
import { ApiError } from "../api/client";
import { askQuestion } from "../services/chatService";
import { sendVoiceQuestion } from "../services/voiceService";
import { BackendMessage, ChatMessage } from "../types/chat";
import { AssistantLanguage } from "./useSettings";

export type ChatStatus = "idle" | "sending" | "error";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Le backend ne renvoie pas (encore) de booléen "certified" explicite : on le déduit
// de la présence de sources RAG citées (documents validés par un érudit).
function toChatMessage(message: BackendMessage): ChatMessage {
  return {
    id: message.id,
    role: message.sender === "USER" ? "user" : "assistant",
    text: message.content,
    certified: message.sender === "AI" ? Boolean(message.sources && message.sources.length > 0) : undefined,
    sources: message.sources ?? undefined,
    createdAt: message.createdAt,
  };
}

interface UseChatParams {
  language: AssistantLanguage;
  remoteConversationId?: string;
  setRemoteConversationId: (id: string) => void;
  pushMessage: (message: ChatMessage) => void;
  replaceMessage: (messageId: string, updater: (message: ChatMessage) => ChatMessage) => void;
}

// La persistance des messages (conversation active, historique) est déléguée à
// useConversations ; ce hook ne porte que la logique d'envoi/statut d'appel API.
//
// En cas d'échec (réseau, serveur), le message de l'utilisateur reste visible dans
// l'historique, marqué "failed" — on ne le supprime jamais silencieusement.
export function useChat({
  language,
  remoteConversationId,
  setRemoteConversationId,
  pushMessage,
  replaceMessage,
}: UseChatParams) {
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<ApiError | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const messageId = generateId();
      pushMessage({
        id: messageId,
        role: "user",
        text: trimmed,
        createdAt: new Date().toISOString(),
      });
      setStatus("sending");
      setError(null);

      try {
        const response = await askQuestion({
          content: trimmed,
          conversationId: remoteConversationId,
          languagePreference: language,
        });
        setRemoteConversationId(response.conversationId);
        pushMessage(toChatMessage(response.aiMessage));
        setStatus("idle");
      } catch (err) {
        replaceMessage(messageId, (m) => ({ ...m, failed: true }));
        setStatus("error");
        setError(err as ApiError);
      }
    },
    [language, remoteConversationId, setRemoteConversationId, pushMessage, replaceMessage]
  );

  const sendVoiceMessage = useCallback(
    async (uri: string) => {
      const placeholderId = generateId();
      pushMessage({
        id: placeholderId,
        role: "user",
        text: "Message vocal",
        createdAt: new Date().toISOString(),
      });
      setStatus("sending");
      setError(null);

      try {
        const response = await sendVoiceQuestion({
          uri,
          conversationId: remoteConversationId,
          languagePreference: language,
        });
        setRemoteConversationId(response.conversationId);
        replaceMessage(placeholderId, (m) => ({ ...m, text: response.transcribedQuestion }));
        pushMessage(toChatMessage(response.aiMessage));
        setStatus("idle");
      } catch (err) {
        replaceMessage(placeholderId, (m) => ({ ...m, failed: true }));
        setStatus("error");
        setError(err as ApiError);
      }
    },
    [language, remoteConversationId, setRemoteConversationId, pushMessage, replaceMessage]
  );

  return {
    status,
    error,
    isSending: status === "sending",
    sendMessage,
    sendVoiceMessage,
  };
}
