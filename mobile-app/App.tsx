import "./src/global.css";
import { useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ChatScreen } from "./src/screens/ChatScreen";
import { AccountScreen } from "./src/screens/AccountScreen";
import { BottomTabBar, AppTab } from "./src/components/BottomTabBar";
import { useAuth } from "./src/hooks/useAuth";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("chat");
  const auth = useAuth();

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-surface">
        <View className="flex-1" style={{ display: activeTab === "chat" ? "flex" : "none" }}>
          <ChatScreen />
        </View>
        <View className="flex-1" style={{ display: activeTab === "account" ? "flex" : "none" }}>
          <AccountScreen
            user={auth.user}
            status={auth.status}
            isAuthenticated={auth.isAuthenticated}
            isSubmitting={auth.isSubmitting}
            error={auth.error}
            login={auth.login}
            register={auth.register}
            logout={auth.logout}
            refreshProfile={auth.refreshProfile}
          />
        </View>

        <BottomTabBar activeTab={activeTab} onChangeTab={setActiveTab} isAuthenticated={auth.isAuthenticated} />
      </View>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
