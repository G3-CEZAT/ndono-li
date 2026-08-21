import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function TypingDot({ delay }: { delay: number }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, { toValue: -5, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.delay(300),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay, translateY]);

  return (
    <Animated.View
      style={{ transform: [{ translateY }] }}
      className="h-2.5 w-2.5 rounded-full bg-primary/50"
    />
  );
}

// État de latence explicite pendant l'appel au RAG (peut être lent).
export function LoadingIndicator() {
  return (
    <View className="my-2.5 flex-row items-center self-start">
      <View className="mr-2.5 h-9 w-9 items-center justify-center rounded-full bg-primary">
        <Ionicons name="sparkles" size={16} color="#E8C158" />
      </View>
      <View className="flex-row items-center gap-2 rounded-t-2xl rounded-br-2xl border border-ink/5 bg-white px-4 py-4 shadow-sm">
        <TypingDot delay={0} />
        <TypingDot delay={150} />
        <TypingDot delay={300} />
      </View>
    </View>
  );
}
