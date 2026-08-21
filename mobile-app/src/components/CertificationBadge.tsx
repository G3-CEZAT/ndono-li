import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CertificationBadgeProps {
  certified?: boolean;
  certifiedBy?: string;
}

// Marqueur visuel obligatoire : distingue une réponse validée par un érudit
// d'une réponse RAG brute encore en attente de validation.
export function CertificationBadge({ certified, certifiedBy }: CertificationBadgeProps) {
  if (certified) {
    return (
      <View className="flex-row items-center gap-1.5 self-start rounded-full bg-gold px-3.5 py-1.5 shadow-sm">
        <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
        <Text className="text-sm font-semibold text-white">
          Certifié{certifiedBy ? ` · ${certifiedBy}` : ""}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-1.5 self-start rounded-full border border-ink/15 bg-white px-3.5 py-1.5">
      <Ionicons name="time-outline" size={14} color="#8A8A8A" />
      <Text className="text-sm font-medium text-ink/50">En attente de validation</Text>
    </View>
  );
}
