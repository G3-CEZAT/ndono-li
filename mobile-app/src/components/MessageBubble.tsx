import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ChatMessage } from "../types/chat";
import { CertificationBadge } from "./CertificationBadge";

interface MessageBubbleProps {
  message: ChatMessage;
}

function formatTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <View className={`my-2.5 flex-row ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <View className="mr-2.5 mt-0.5 h-9 w-9 items-center justify-center rounded-full bg-primary">
          <Ionicons name="sparkles" size={16} color="#E8C158" />
        </View>
      )}

      <View className={`max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <View
          className={`px-4 py-3.5 shadow-sm ${
            isUser
              ? message.failed
                ? "rounded-t-2xl rounded-bl-2xl border border-red-300 bg-primary/40"
                : "rounded-t-2xl rounded-bl-2xl bg-primary"
              : "rounded-t-2xl rounded-br-2xl border border-ink/5 bg-white"
          }`}
        >
          <Text className={isUser ? "text-base leading-6 text-white" : "text-base leading-6 text-ink"}>
            {message.text}
          </Text>
        </View>

        <View className="mt-1.5 flex-row items-center gap-1.5 px-1">
          {message.failed && (
            <>
              <Ionicons name="alert-circle" size={12} color="#DC2626" />
              <Text className="text-xs font-medium text-red-600">Échec de l'envoi</Text>
              <Text className="text-xs text-ink/25">·</Text>
            </>
          )}
          <Text className="text-xs text-ink/35">{formatTime(message.createdAt)}</Text>
        </View>

        {!isUser && (
          <View className="mt-1.5">
            <CertificationBadge
              certified={message.certified}
              certifiedBy={message.sources?.[0]?.authorScholar}
            />
          </View>
        )}

        {!isUser && message.sources && message.sources.length > 0 && (
          <View className="mt-2 max-w-full gap-1.5 rounded-xl border border-primary/10 bg-primary/5 px-3.5 py-2.5">
            {message.sources.map((source, index) => (
              <View key={index} className="flex-row items-center gap-1.5">
                <Ionicons name="book-outline" size={13} color="#0E4D3C" />
                <Text className="flex-1 text-sm text-primary-accent">{source.documentTitle}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
