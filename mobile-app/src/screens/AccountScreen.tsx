import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthStatus } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useSubscription";
import { ErrorBanner } from "../components/ErrorBanner";
import { ApiError } from "../api/client";
import { User } from "../types/auth";

type AuthMode = "login" | "register";

function formatExpiry(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

interface AccountScreenProps {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isSubmitting: boolean;
  error: ApiError | null;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (phone: string, password: string, fullName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export function AccountScreen({
  user,
  status,
  isAuthenticated,
  isSubmitting,
  error,
  login,
  register,
  logout,
  refreshProfile,
}: AccountScreenProps) {
  const { isCheckingOut, error: subscriptionError, subscribe } = useSubscription(refreshProfile);
  const isSubscribed = Boolean(user?.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt).getTime() > Date.now());

  const [mode, setMode] = useState<AuthMode>("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = () => {
    if (mode === "login") {
      login(phone.trim(), password);
    } else {
      register(phone.trim(), password, fullName.trim() || undefined);
    }
  };

  if (status === "loading") {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color="#0E4D3C" />
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: "center" }}>
          <Image
            source={require("../../assets/logo-sombre.jpeg")}
            style={{ width: 88, height: 88, borderRadius: 22, alignSelf: "center" }}
            resizeMode="cover"
          />

          <Text className="mb-1 mt-5 text-center text-xl font-bold text-primary">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </Text>
          <Text className="mb-7 text-center text-base text-ink/55">
            Accédez à votre espace pèlerin et à votre abonnement
          </Text>

          <View className="mb-5 flex-row gap-2 rounded-2xl bg-ink/5 p-1.5">
            <Pressable
              onPress={() => setMode("login")}
              className={`flex-1 items-center rounded-xl py-2.5 ${mode === "login" ? "bg-white shadow-sm" : ""}`}
            >
              <Text className={`text-sm font-semibold ${mode === "login" ? "text-primary" : "text-ink/50"}`}>
                Connexion
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMode("register")}
              className={`flex-1 items-center rounded-xl py-2.5 ${mode === "register" ? "bg-white shadow-sm" : ""}`}
            >
              <Text className={`text-sm font-semibold ${mode === "register" ? "text-primary" : "text-ink/50"}`}>
                Créer un compte
              </Text>
            </Pressable>
          </View>

          {error && <ErrorBanner error={error} />}

          <View className="gap-3.5">
            {mode === "register" && (
              <View className="h-14 flex-row items-center rounded-2xl border border-ink/10 bg-white px-4">
                <Ionicons name="person-outline" size={18} color="#8A8A8A" />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Nom complet (optionnel)"
                  placeholderTextColor="#8A8A8A"
                  style={{ flex: 1, marginLeft: 10, fontSize: 16, color: "#1A1A1A", padding: 0 }}
                />
              </View>
            )}

            <View className="h-14 flex-row items-center rounded-2xl border border-ink/10 bg-white px-4">
              <Ionicons name="call-outline" size={18} color="#8A8A8A" />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Numéro de téléphone"
                placeholderTextColor="#8A8A8A"
                keyboardType="phone-pad"
                style={{ flex: 1, marginLeft: 10, fontSize: 16, color: "#1A1A1A", padding: 0 }}
              />
            </View>

            <View className="h-14 flex-row items-center rounded-2xl border border-ink/10 bg-white px-4">
              <Ionicons name="lock-closed-outline" size={18} color="#8A8A8A" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mot de passe"
                placeholderTextColor="#8A8A8A"
                secureTextEntry
                style={{ flex: 1, marginLeft: 10, fontSize: 16, color: "#1A1A1A", padding: 0 }}
              />
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={!phone.trim() || !password || isSubmitting}
              className="mt-2 h-14 items-center justify-center rounded-2xl bg-primary shadow-sm disabled:opacity-40"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-base font-semibold text-white">
                  {mode === "login" ? "Se connecter" : "Créer mon compte"}
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="mb-5 flex-row items-center gap-4 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Ionicons name="person" size={26} color="#E8C158" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-ink">{user?.fullName || "Pèlerin"}</Text>
            <Text className="text-sm text-ink/50">{user?.phone}</Text>
          </View>
        </View>

        <Text className="mb-2.5 text-sm font-semibold uppercase tracking-wide text-primary-accent">
          Abonnement
        </Text>

        {subscriptionError && <ErrorBanner error={subscriptionError} onRetry={refreshProfile} />}

        <View className="mb-6 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm">
          <View className="mb-3 flex-row items-center gap-2">
            <Ionicons
              name={isSubscribed ? "checkmark-circle" : "close-circle-outline"}
              size={18}
              color={isSubscribed ? "#0E4D3C" : "#8A8A8A"}
            />
            <Text className={`text-base font-semibold ${isSubscribed ? "text-primary" : "text-ink/50"}`}>
              {isSubscribed ? "Abonnement actif" : "Aucun abonnement actif"}
            </Text>
          </View>

          {isSubscribed && user?.subscriptionExpiresAt && (
            <Text className="mb-3 text-sm text-ink/55">
              Valable jusqu'au {formatExpiry(user.subscriptionExpiresAt)}
            </Text>
          )}

          <Text className="mb-3.5 text-sm text-ink/55">500 FCFA / mois · paiement sécurisé via PayDunya</Text>

          <Pressable
            onPress={subscribe}
            disabled={isCheckingOut}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-gold px-4 py-3.5 shadow-sm disabled:opacity-50"
          >
            {isCheckingOut ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="card-outline" size={17} color="#FFFFFF" />
                <Text className="text-base font-semibold text-white">
                  {isSubscribed ? "Renouveler l'abonnement" : "S'abonner · 500 FCFA"}
                </Text>
              </>
            )}
          </Pressable>
        </View>

        <Pressable
          onPress={logout}
          className="flex-row items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-3.5"
        >
          <Ionicons name="log-out-outline" size={17} color="#DC2626" />
          <Text className="text-base font-semibold text-red-600">Se déconnecter</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
