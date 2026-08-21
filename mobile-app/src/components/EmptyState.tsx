import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SUGGESTIONS = [
  "Qui était Seydi El Hadji Malick Sy ?",
  "Que signifie le Khilassou Zahab ?",
  "Où prier pendant le Gamou ?",
  "Comment se rendre à la Zawiya ?",
];

interface EmptyStateProps {
  onSelectSuggestion: (text: string) => void;
}

export function EmptyState({ onSelectSuggestion }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Image
        source={require("../../assets/logo-sombre.jpeg")}
        style={{ width: 84, height: 84, borderRadius: 22, marginBottom: 20 }}
        resizeMode="cover"
      />
      <Text className="mb-2 text-center text-xl font-bold text-primary">
        Assalamu alaikum, cher pèlerin
      </Text>
      <Text className="mb-7 text-center text-base leading-6 text-ink/55">
        Posez une question sur les enseignements de Seydi El Hadji Malick Sy (RTA), ou sur les
        services pratiques de Tivaouane.
      </Text>

      <View className="w-full gap-2.5">
        {SUGGESTIONS.map((suggestion) => (
          <Pressable
            key={suggestion}
            onPress={() => onSelectSuggestion(suggestion)}
            className="flex-row items-center gap-3 rounded-2xl border border-gold/30 bg-white px-5 py-4 shadow-sm active:bg-gold/5"
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#D4A72C" />
            <Text className="flex-1 text-base text-ink">{suggestion}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
