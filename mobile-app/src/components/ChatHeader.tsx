import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

interface ChatHeaderProps {
  onOpenMenu: () => void;
  onOpenServices: () => void;
}

export function ChatHeader({ onOpenMenu, onOpenServices }: ChatHeaderProps) {
  return (
    <LinearGradient colors={["#0E4D3C", "#1A6B54"]} className="rounded-b-3xl shadow-md">
      <SafeAreaView edges={["top"]}>
        <View className="flex-row items-center justify-between px-4 pb-5 pt-3">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={onOpenMenu}
              className="h-12 w-12 items-center justify-center rounded-full bg-white/15"
            >
              <Ionicons name="menu" size={22} color="#FFFFFF" />
            </Pressable>
            <View>
              <Text className="text-lg font-bold text-white">Assistant Hadara</Text>
              <Text className="text-sm text-white/70">Tivaouane · Seydi El Hadji Malick Sy</Text>
            </View>
          </View>

          <Pressable
            onPress={onOpenServices}
            className="flex-row items-center gap-2 rounded-full bg-gold px-4 py-2.5 shadow-sm active:opacity-80"
          >
            <Ionicons name="location" size={16} color="#FFFFFF" />
            <Text className="text-sm font-semibold text-white">Services</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
