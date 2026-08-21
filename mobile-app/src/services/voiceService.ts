import { apiClient } from "../api/client";
import { AssistantLanguage } from "../hooks/useSettings";
import { SendVoiceMessageResponse } from "../types/chat";

export interface SendVoiceParams {
  uri: string;
  fileName?: string;
  mimeType?: string;
  conversationId?: string;
  languagePreference?: AssistantLanguage;
}

// Upload de l'audio brut : la transcription et la réponse RAG sont faites côté serveur
// (POST /chat/message-voice, multipart/form-data, champ "file").
export async function sendVoiceQuestion(params: SendVoiceParams): Promise<SendVoiceMessageResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri: params.uri,
    name: params.fileName ?? "recording.m4a",
    type: params.mimeType ?? "audio/m4a",
  } as unknown as Blob);
  if (params.conversationId) {
    formData.append("conversationId", params.conversationId);
  }
  formData.append("languagePreference", params.languagePreference ?? "fr");

  const { data } = await apiClient.post<SendVoiceMessageResponse>("/chat/message-voice", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
