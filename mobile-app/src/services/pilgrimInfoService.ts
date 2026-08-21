import { apiClient } from "../api/client";
import { PilgrimInfoResponse } from "../types/chat";

export async function getPilgrimInfo(): Promise<PilgrimInfoResponse> {
  const { data } = await apiClient.get<PilgrimInfoResponse>("/api/pilgrim-info");
  return data;
}
