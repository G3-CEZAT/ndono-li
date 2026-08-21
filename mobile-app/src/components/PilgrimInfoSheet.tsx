import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePilgrimInfo } from "../hooks/usePilgrimInfo";
import { ErrorBanner } from "./ErrorBanner";

export interface PilgrimInfoSheetHandle {
  open: () => void;
  close: () => void;
}

const SHEET_HEIGHT = Dimensions.get("window").height * 0.75;

export const PilgrimInfoSheet = forwardRef<PilgrimInfoSheetHandle>((_props, ref) => {
  const [visible, setVisible] = useState(false);
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const { categories, loading, error, reload } = usePilgrimInfo();

  const animateTo = (toValue: number, onDone?: () => void) => {
    Animated.timing(translateY, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start(onDone);
  };

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => animateTo(SHEET_HEIGHT, () => setVisible(false)),
  }));

  useEffect(() => {
    if (visible) {
      translateY.setValue(SHEET_HEIGHT);
      animateTo(0);
    }
  }, [visible]);

  const handleClose = () => animateTo(SHEET_HEIGHT, () => setVisible(false));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable className="flex-1 bg-black/40" onPress={handleClose} />

      <Animated.View
        style={{ height: SHEET_HEIGHT, transform: [{ translateY }] }}
        className="rounded-t-3xl bg-surface px-4 pt-3 shadow-lg"
      >
        <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-ink/15" />

        <View className="mb-5 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <Ionicons name="location" size={20} color="#0E4D3C" />
            <Text className="text-xl font-bold text-primary">Services pratiques</Text>
          </View>
          <Pressable onPress={handleClose} className="h-9 w-9 items-center justify-center rounded-full bg-ink/5">
            <Ionicons name="close" size={20} color="#1A1A1A" />
          </Pressable>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {loading && <ActivityIndicator color="#0E4D3C" />}
          {error && <ErrorBanner error={error} onRetry={reload} />}

          {categories.map((category) => (
            <View key={category.id} className="mb-5">
              <Text className="mb-2.5 text-base font-semibold uppercase tracking-wide text-primary-accent">
                {category.title}
              </Text>
              {category.items.map((item) => (
                <View
                  key={item.id}
                  className="mb-3 flex-row items-start gap-3.5 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                    <Ionicons name={(item.icon as any) ?? "information-circle-outline"} size={19} color="#D4A72C" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-ink">{item.title}</Text>
                    <Text className="mt-1 text-sm leading-5 text-ink/55">{item.description}</Text>
                    {item.location && (
                      <View className="mt-2 flex-row items-center gap-1.5">
                        <Ionicons name="navigate" size={13} color="#0E4D3C" />
                        <Text className="text-sm font-medium text-primary-accent">{item.location}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
});
