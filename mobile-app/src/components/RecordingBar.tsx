import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RecordingBarProps {
  isPaused: boolean;
  isPreviewPlaying: boolean;
  seconds: number;
  onCancel: () => void;
  onTogglePause: () => void;
  onTogglePreview: () => void;
  onSend: () => void;
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function RecordingBar({
  isPaused,
  isPreviewPlaying,
  seconds,
  onCancel,
  onTogglePause,
  onTogglePreview,
  onSend,
}: RecordingBarProps) {
  const dotOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isPaused) {
      dotOpacity.setValue(1);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, { toValue: 0.2, duration: 500, useNativeDriver: true }),
        Animated.timing(dotOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [isPaused, dotOpacity]);

  return (
    <View className="h-14 flex-1 flex-row items-center gap-3 rounded-full border border-red-100 bg-red-50 px-3.5">
      <Pressable onPress={onCancel} className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
        <Ionicons name="trash-outline" size={18} color="#DC2626" />
      </Pressable>

      <Animated.View
        style={{ opacity: dotOpacity }}
        className={`h-3 w-3 rounded-full ${isPaused ? "bg-red-300" : "bg-red-500"}`}
      />

      <Text className="text-base font-semibold text-red-700">{formatDuration(seconds)}</Text>

      {isPaused ? (
        <Pressable
          onPress={onTogglePreview}
          className="flex-1 flex-row items-center gap-2 rounded-full bg-white px-3.5 py-2"
        >
          <Ionicons name={isPreviewPlaying ? "pause" : "play"} size={16} color="#0E4D3C" />
          <Text className="text-sm font-medium text-primary">
            {isPreviewPlaying ? "Lecture…" : "Écouter"}
          </Text>
        </Pressable>
      ) : (
        <Text className="flex-1 text-sm text-red-400">Enregistrement…</Text>
      )}

      <Pressable
        onPress={onTogglePause}
        className="h-11 w-11 items-center justify-center rounded-full bg-gold shadow-sm"
      >
        <Ionicons name={isPaused ? "mic" : "pause"} size={18} color="#FFFFFF" />
      </Pressable>

      <Pressable onPress={onSend} className="h-11 w-11 items-center justify-center rounded-full bg-primary shadow-sm">
        <Ionicons name="send" size={16} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
