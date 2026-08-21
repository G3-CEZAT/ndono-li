import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface VoiceRecorderButtonProps {
  disabled?: boolean;
  onPress: () => void;
}

export function VoiceRecorderButton({ disabled, onPress }: VoiceRecorderButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`h-14 w-14 items-center justify-center rounded-full bg-gold shadow-sm ${
        disabled ? "opacity-40" : ""
      }`}
    >
      <Ionicons name="mic" size={23} color="#FFFFFF" />
    </Pressable>
  );
}
