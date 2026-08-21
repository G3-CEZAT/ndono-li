import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Alert, Animated, Dimensions, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AssistantLanguage } from "../hooks/useSettings";

export interface SettingsSheetHandle {
  open: () => void;
  close: () => void;
}

interface SettingsSheetProps {
  language: AssistantLanguage;
  onChangeLanguage: (language: AssistantLanguage) => void;
  onClearHistory: () => void;
  conversationCount: number;
}

const SHEET_HEIGHT = Dimensions.get("window").height * 0.6;

const LANGUAGE_OPTIONS: { value: AssistantLanguage; label: string }[] = [
  { value: "fr", label: "Français" },
  { value: "wo", label: "Wolof" },
];

export const SettingsSheet = forwardRef<SettingsSheetHandle, SettingsSheetProps>(
  ({ language, onChangeLanguage, onClearHistory, conversationCount }, ref) => {
    const [visible, setVisible] = useState(false);
    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

    const animateTo = (toValue: number, onDone?: () => void) => {
      Animated.timing(translateY, { toValue, duration: 250, useNativeDriver: true }).start(onDone);
    };

    useImperativeHandle(ref, () => ({
      open: () => setVisible(true),
      close: () => animateTo(SHEET_HEIGHT, () => setVisible(false)),
    }));

    useEffect(() => {
      if (visible) {
        translateY.setValue(SHEET_HEIGHT);
        animateTo(0);
      }
    }, [visible]);

    const handleClose = () => animateTo(SHEET_HEIGHT, () => setVisible(false));

    const handleClearHistory = () => {
      Alert.alert(
        "Effacer tout l'historique ?",
        `${conversationCount} discussion${conversationCount > 1 ? "s" : ""} seront supprimées définitivement.`,
        [
          { text: "Annuler", style: "cancel" },
          { text: "Effacer", style: "destructive", onPress: onClearHistory },
        ]
      );
    };

    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
        <Pressable className="flex-1 bg-black/40" onPress={handleClose} />

        <Animated.View
          style={{ height: SHEET_HEIGHT, transform: [{ translateY }] }}
          className="rounded-t-3xl bg-surface px-4 pt-3 shadow-lg"
        >
          <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-ink/15" />

          <View className="mb-5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <Ionicons name="settings" size={20} color="#0E4D3C" />
              <Text className="text-xl font-bold text-primary">Paramètres</Text>
            </View>
            <Pressable onPress={handleClose} className="h-9 w-9 items-center justify-center rounded-full bg-ink/5">
              <Ionicons name="close" size={20} color="#1A1A1A" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="mb-2.5 text-sm font-semibold uppercase tracking-wide text-primary-accent">
              Langue de l'assistant
            </Text>
            <View className="mb-6 flex-row gap-2.5">
              {LANGUAGE_OPTIONS.map((option) => {
                const isActive = option.value === language;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => onChangeLanguage(option.value)}
                    className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 ${
                      isActive ? "border-gold bg-gold/10" : "border-ink/10 bg-white"
                    }`}
                  >
                    {isActive && <Ionicons name="checkmark-circle" size={16} color="#D4A72C" />}
                    <Text className={`text-base ${isActive ? "font-semibold text-primary" : "text-ink"}`}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text className="mb-2.5 text-sm font-semibold uppercase tracking-wide text-primary-accent">
              Données
            </Text>
            <Pressable
              onPress={handleClearHistory}
              className="mb-6 flex-row items-center gap-3.5 rounded-2xl border border-red-100 bg-white p-4"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-red-50">
                <Ionicons name="trash-outline" size={18} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-red-600">Effacer tout l'historique</Text>
                <Text className="mt-0.5 text-sm text-ink/50">Supprime toutes les discussions de cet appareil</Text>
              </View>
            </Pressable>

            <Text className="mb-2.5 text-sm font-semibold uppercase tracking-wide text-primary-accent">
              À propos
            </Text>
            <View className="rounded-2xl border border-ink/5 bg-white p-4">
              <Text className="text-base font-semibold text-ink">Assistant Hadara</Text>
              <Text className="mt-1 text-sm leading-5 text-ink/55">
                Médiation numérique des enseignements de Seydi El Hadji Malick Sy (RTA) et assistance
                aux pèlerins de Tivaouane.
              </Text>
              <Text className="mt-2 text-xs text-ink/35">Hackathon CEZAT 2026 · v1.0.0</Text>
            </View>
          </ScrollView>
        </Animated.View>
      </Modal>
    );
  }
);
