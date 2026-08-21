import { apiClient } from "../api/client";
import { AssistantLanguage } from "../hooks/useSettings";
import { SendMessageResponse } from "../types/chat";

export interface AskQuestionParams {
  content: string;
  conversationId?: string;
  languagePreference?: AssistantLanguage;
}

export async function askQuestion(params: AskQuestionParams): Promise<SendMessageResponse> {
  const { data } = await apiClient.post<SendMessageResponse>("/chat/message", {
    content: params.content,
    conversationId: params.conversationId,
    languagePreference: params.languagePreference ?? "fr",
  });
  return data;
}
