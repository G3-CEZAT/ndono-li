import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Conversation } from "../types/conversation";

export interface SidebarHandle {
  open: () => void;
  close: () => void;
}

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onOpenSettings: () => void;
}

const SIDEBAR_WIDTH = Math.min(320, Dimensions.get("window").width * 0.84);

function formatUpdatedAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  return isToday
    ? date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

export const Sidebar = forwardRef<SidebarHandle, SidebarProps>(
  ({ conversations, activeId, onSelectConversation, onNewConversation, onDeleteConversation, onOpenSettings }, ref) => {
    const [visible, setVisible] = useState(false);
    const [query, setQuery] = useState("");
    const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

    const animateTo = (toValue: number, onDone?: () => void) => {
      Animated.timing(translateX, { toValue, duration: 250, useNativeDriver: true }).start(onDone);
    };

    useImperativeHandle(ref, () => ({
      open: () => setVisible(true),
      close: () => animateTo(-SIDEBAR_WIDTH, () => setVisible(false)),
    }));

    useEffect(() => {
      if (visible) {
        translateX.setValue(-SIDEBAR_WIDTH);
        animateTo(0);
      } else {
        setQuery("");
      }
    }, [visible]);

    const handleClose = () => animateTo(-SIDEBAR_WIDTH, () => setVisible(false));

    const filteredConversations = useMemo(() => {
      const sorted = [...conversations].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      if (!query.trim()) return sorted;
      const needle = query.trim().toLowerCase();
      return sorted.filter(
        (c) =>
          c.title.toLowerCase().includes(needle) ||
          c.messages.some((m) => m.text.toLowerCase().includes(needle))
      );
    }, [conversations, query]);

    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
        <Pressable className="flex-1 flex-row">
          <Animated.View
            style={{ width: SIDEBAR_WIDTH, transform: [{ translateX }] }}
            className="h-full bg-white shadow-lg"
          >
            <SafeAreaView edges={["top", "bottom"]} className="flex-1">
              <View className="flex-row items-center justify-between px-4 pb-3 pt-2">
                <Text className="text-lg font-bold text-primary">Discussions</Text>
                <Pressable onPress={handleClose} className="h-9 w-9 items-center justify-center rounded-full bg-ink/5">
                  <Ionicons name="close" size={20} color="#1A1A1A" />
                </Pressable>
              </View>

              <View className="px-4 pb-3">
                <Pressable
                  onPress={() => {
                    onNewConversation();
                    handleClose();
                  }}
                  className="mb-3 flex-row items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 shadow-sm"
                >
                  <Ionicons name="add-circle" size={18} color="#FFFFFF" />
                  <Text className="text-base font-semibold text-white">Nouvelle discussion</Text>
                </Pressable>

                <View className="flex-row items-center gap-2 rounded-full border border-ink/10 bg-surface px-4 py-2.5">
                  <Ionicons name="search" size={16} color="#8A8A8A" />
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Rechercher…"
                    placeholderTextColor="#8A8A8A"
                    style={{ flex: 1, fontSize: 15, color: "#1A1A1A", padding: 0 }}
                  />
                </View>
              </View>

              <FlatList
                data={filteredConversations}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
                ListEmptyComponent={
                  <Text className="mt-8 text-center text-sm text-ink/40">
                    {query ? "Aucun résultat." : "Aucune discussion pour le moment."}
                  </Text>
                }
                renderItem={({ item }) => {
                  const isActive = item.id === activeId;
                  return (
                    <Pressable
                      onPress={() => {
                        onSelectConversation(item.id);
                        handleClose();
                      }}
                      className={`mb-1.5 flex-row items-center gap-2.5 rounded-xl px-3 py-3 ${
                        isActive ? "bg-primary/10" : "active:bg-ink/5"
                      }`}
                    >
                      <Ionicons
                        name="chatbubble-outline"
                        size={17}
                        color={isActive ? "#0E4D3C" : "#8A8A8A"}
                      />
                      <View className="flex-1">
                        <Text
                          numberOfLines={1}
                          className={`text-[15px] ${isActive ? "font-semibold text-primary" : "text-ink"}`}
                        >
                          {item.title}
                        </Text>
                        <Text className="text-xs text-ink/40">{formatUpdatedAt(item.updatedAt)}</Text>
                      </View>
                      <Pressable
                        onPress={() => onDeleteConversation(item.id)}
                        hitSlop={8}
                        className="h-8 w-8 items-center justify-center rounded-full active:bg-red-50"
                      >
                        <Ionicons name="trash-outline" size={16} color="#DC2626" />
                      </Pressable>
                    </Pressable>
                  );
                }}
              />

              <Pressable
                onPress={() => {
                  handleClose();
                  onOpenSettings();
                }}
                className="flex-row items-center gap-3 border-t border-ink/5 px-4 py-4"
              >
                <View className="h-9 w-9 items-center justify-center rounded-full bg-ink/5">
                  <Ionicons name="settings-outline" size={18} color="#1A1A1A" />
                </View>
                <Text className="text-base font-medium text-ink">Paramètres</Text>
              </Pressable>
            </SafeAreaView>
          </Animated.View>

          <Pressable className="flex-1 bg-black/40" onPress={handleClose} />
        </Pressable>
      </Modal>
    );
  }
);
