import { useRef, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChat } from "../hooks/useChat";
import { useConversations } from "../hooks/useConversations";
import { useSettings } from "../hooks/useSettings";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useKeyboardHeight } from "../hooks/useKeyboardHeight";
import { MessageBubble } from "../components/MessageBubble";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { ErrorBanner } from "../components/ErrorBanner";
import { VoiceRecorderButton } from "../components/VoiceRecorderButton";
import { RecordingBar } from "../components/RecordingBar";
import { PilgrimInfoSheet, PilgrimInfoSheetHandle } from "../components/PilgrimInfoSheet";
import { ChatHeader } from "../components/ChatHeader";
import { EmptyState } from "../components/EmptyState";
import { Sidebar, SidebarHandle } from "../components/Sidebar";
import { SettingsSheet, SettingsSheetHandle } from "../components/SettingsSheet";

export function ChatScreen() {
  const {
    conversations,
    activeId,
    activeMessages,
    activeRemoteConversationId,
    startNewConversation,
    selectConversation,
    deleteConversation,
    clearAllConversations,
    pushMessage,
    replaceMessage,
    setRemoteConversationId,
  } = useConversations();
  const { settings, setLanguage } = useSettings();
  const { isSending, error, sendMessage, sendVoiceMessage } = useChat({
    language: settings.language,
    remoteConversationId: activeRemoteConversationId,
    setRemoteConversationId,
    pushMessage,
    replaceMessage,
  });
  const {
    isRecording,
    isPaused,
    isPreviewPlaying,
    elapsedSeconds,
    startRecording,
    pauseRecording,
    resumeRecording,
    togglePreviewPlayback,
    stopRecording,
    cancelRecording,
    shareDebugRecording,
  } = useVoiceInput();
  const { isConnected } = useNetworkStatus();
  const keyboardHeight = useKeyboardHeight();
  const [draft, setDraft] = useState("");
  const sheetRef = useRef<PilgrimInfoSheetHandle>(null);
  const sidebarRef = useRef<SidebarHandle>(null);
  const settingsRef = useRef<SettingsSheetHandle>(null);

  const handleSend = (overrideText?: string) => {
    const text = overrideText ?? draft;
    setDraft("");
    sendMessage(text);
  };

  const handleSendRecording = async () => {
    const uri = await stopRecording();
    if (uri) await sendVoiceMessage(uri);
  };

  const handleTogglePause = () => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={[]}>
      <ChatHeader onOpenMenu={() => sidebarRef.current?.open()} onOpenServices={() => sheetRef.current?.open()} />

      <View className="flex-1" style={{ paddingBottom: keyboardHeight }}>
        {!isConnected && (
          <View className="pt-2">
            <ErrorBanner error={{ kind: "network", message: "Vous êtes hors ligne." }} />
          </View>
        )}
        {error && (
          <View className="pt-2">
            <ErrorBanner error={error} />
          </View>
        )}

        {activeMessages.length === 0 ? (
          <EmptyState onSelectSuggestion={(text) => handleSend(text)} />
        ) : (
          <FlatList
            data={activeMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
            ListFooterComponent={isSending ? <LoadingIndicator /> : null}
          />
        )}

        {__DEV__ && (
          <Pressable
            onPress={shareDebugRecording}
            className="mx-4 mb-1 flex-row items-center gap-1.5 self-start rounded-full bg-ink/5 px-3 py-1.5"
          >
            <Ionicons name="bug-outline" size={13} color="#1A1A1A" />
            <Text className="text-xs font-medium text-ink/60">Exporter le dernier vocal envoyé (test.m4a)</Text>
          </Pressable>
        )}

        <View className="flex-row items-center gap-2 border-t border-ink/5 bg-white px-3 py-3">
          {isRecording || isPaused ? (
            <RecordingBar
              isPaused={isPaused}
              isPreviewPlaying={isPreviewPlaying}
              seconds={elapsedSeconds}
              onCancel={cancelRecording}
              onTogglePause={handleTogglePause}
              onTogglePreview={togglePreviewPlayback}
              onSend={handleSendRecording}
            />
          ) : (
            <>
              <View className="h-14 flex-1 flex-row items-center rounded-full border border-ink/10 bg-surface px-5">
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  placeholder="Posez votre question…"
                  placeholderTextColor="#8A8A8A"
                  multiline={false}
                  underlineColorAndroid="transparent"
                  style={{
                    flex: 1,
                    height: "100%",
                    padding: 0,
                    margin: 0,
                    fontSize: 16,
                    color: "#1A1A1A",
                    includeFontPadding: false,
                    textAlignVertical: "center",
                  }}
                  onSubmitEditing={() => handleSend()}
                />
              </View>

              {draft.trim() ? (
                <Pressable
                  onPress={() => handleSend()}
                  className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-sm"
                >
                  <Ionicons name="send" size={19} color="#FFFFFF" />
                </Pressable>
              ) : (
                <VoiceRecorderButton onPress={startRecording} />
              )}
            </>
          )}
        </View>
      </View>

      <PilgrimInfoSheet ref={sheetRef} />

      <Sidebar
        ref={sidebarRef}
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={selectConversation}
        onNewConversation={startNewConversation}
        onDeleteConversation={deleteConversation}
        onOpenSettings={() => settingsRef.current?.open()}
      />

      <SettingsSheet
        ref={settingsRef}
        language={settings.language}
        onChangeLanguage={setLanguage}
        onClearHistory={clearAllConversations}
        conversationCount={conversations.length}
      />
    </SafeAreaView>
  );
}
