import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ApiError } from "../api/client";

interface ErrorBannerProps {
  error: ApiError;
  onRetry?: () => void;
}

// État d'erreur réseau clair, utile vu l'usage terrain avec connectivité variable à Tivaouane.
export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  return (
    <View className="mx-4 mb-2.5 flex-row items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
      <Ionicons name="alert-circle" size={20} color="#DC2626" />
      <Text className="flex-1 text-base text-red-700">{error.message}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} className="rounded-lg bg-red-100 px-3.5 py-2">
          <Text className="text-sm font-semibold text-red-700">Réessayer</Text>
        </Pressable>
      )}
    </View>
  );
}
