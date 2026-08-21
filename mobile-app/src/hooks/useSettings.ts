import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Langues réellement supportées par le service RAG (ai-service : languagePreference "fr" | "wo").
export type AssistantLanguage = "fr" | "wo";

interface Settings {
  language: AssistantLanguage;
}

const STORAGE_KEY = "pilgrim-app:settings";
const DEFAULT_SETTINGS: Settings = { language: "fr" };

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const hasLoaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
      } catch (err) {
        console.warn("[settings] Échec du chargement", err);
      } finally {
        hasLoaded.current = true;
      }
    })();
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch((err) =>
      console.warn("[settings] Échec de la sauvegarde", err)
    );
  }, [settings]);

  const setLanguage = useCallback((language: AssistantLanguage) => {
    setSettings((prev) => ({ ...prev, language }));
  }, []);

  return { settings, setLanguage };
}
