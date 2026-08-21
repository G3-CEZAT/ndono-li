import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export type AppTab = "chat" | "account";

interface BottomTabBarProps {
  activeTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
  isAuthenticated: boolean;
}

export function BottomTabBar({ activeTab, onChangeTab, isAuthenticated }: BottomTabBarProps) {
  return (
    <SafeAreaView edges={["bottom"]} className="border-t border-ink/5 bg-white">
      <View className="flex-row items-center px-4 pt-2">
        <Pressable onPress={() => onChangeTab("chat")} className="flex-1 items-center gap-1 py-1.5">
          <Ionicons
            name={activeTab === "chat" ? "chatbubble" : "chatbubble-outline"}
            size={22}
            color={activeTab === "chat" ? "#0E4D3C" : "#8A8A8A"}
          />
          <Text className={`text-xs ${activeTab === "chat" ? "font-semibold text-primary" : "text-ink/50"}`}>
            Discussion
          </Text>
        </Pressable>

        <Pressable onPress={() => onChangeTab("account")} className="flex-1 items-center gap-1 py-1.5">
          <View>
            <Ionicons
              name={activeTab === "account" ? "person-circle" : "person-circle-outline"}
              size={22}
              color={activeTab === "account" ? "#0E4D3C" : "#8A8A8A"}
            />
            {!isAuthenticated && (
              <View className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-white bg-gold" />
            )}
          </View>
          <Text className={`text-xs ${activeTab === "account" ? "font-semibold text-primary" : "text-ink/50"}`}>
            Compte
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
