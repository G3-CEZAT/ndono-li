import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatMessage } from "../types/chat";
import { Conversation } from "../types/conversation";

const STORAGE_KEY = "pilgrim-app:conversations";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function deriveTitle(messages: ChatMessage[]): string {
  const firstUserMessage = messages.find((m) => m.role === "user");
  if (!firstUserMessage) return "Nouvelle discussion";
  const trimmed = firstUserMessage.text.trim();
  return trimmed.length > 42 ? `${trimmed.slice(0, 42)}…` : trimmed;
}

// Historique des discussions persisté localement (façon ChatGPT) : une conversation
// n'apparaît dans la liste qu'à partir du premier message envoyé (pas d'entrées vides).
export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setConversations(JSON.parse(raw));
      } catch (err) {
        console.warn("[conversations] Échec du chargement", err);
      } finally {
        hasLoaded.current = true;
      }
    })();
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(conversations)).catch((err) =>
      console.warn("[conversations] Échec de la sauvegarde", err)
    );
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;
  const activeMessages = activeConversation?.messages ?? [];
  const activeRemoteConversationId = activeConversation?.remoteConversationId;

  const startNewConversation = useCallback(() => {
    setActiveId(null);
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveId((current) => (current === id ? null : current));
  }, []);

  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setActiveId(null);
  }, []);

  // Garantit qu'une conversation active existe, en créant une nouvelle si besoin.
  const ensureActiveId = useCallback((): string => {
    if (activeId) return activeId;
    const id = generateId();
    const now = new Date().toISOString();
    setConversations((prev) => [{ id, title: "Nouvelle discussion", messages: [], updatedAt: now }, ...prev]);
    setActiveId(id);
    return id;
  }, [activeId]);

  const pushMessage = useCallback(
    (message: ChatMessage) => {
      const id = ensureActiveId();
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const messages = [...c.messages, message];
          return { ...c, messages, title: deriveTitle(messages), updatedAt: new Date().toISOString() };
        })
      );
    },
    [ensureActiveId]
  );

  const replaceMessage = useCallback(
    (messageId: string, updater: (message: ChatMessage) => ChatMessage) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: c.messages.map((m) => (m.id === messageId ? updater(m) : m)) }
            : c
        )
      );
    },
    [activeId]
  );

  const removeMessage = useCallback(
    (messageId: string) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) } : c))
      );
    },
    [activeId]
  );

  // Enregistre l'id de conversation attribué par le backend, pour que les messages
  // suivants de cette même discussion soient bien rattachés côté serveur.
  const setRemoteConversationId = useCallback(
    (remoteId: string) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, remoteConversationId: remoteId } : c))
      );
    },
    [activeId]
  );

  return {
    conversations,
    activeId,
    activeMessages,
    activeRemoteConversationId,
    startNewConversation,
    selectConversation,
    deleteConversation,
    clearAllConversations,
    pushMessage,
    replaceMessage,
    removeMessage,
    setRemoteConversationId,
  };
}
