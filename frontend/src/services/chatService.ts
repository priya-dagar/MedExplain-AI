import api from "./api";
import { ChatRequest, ChatResponseData, ChatHistoryItem } from "../types/chat";


export const sendMessage = async (message: string): Promise<ChatResponseData> => {
  const response = await api.post<ChatResponseData>("/api/symptom/chat", {
    message,
  } as ChatRequest);
  return response.data;
};
export const getChatHistory = async (): Promise<ChatHistoryItem[]> => {
  const response = await api.get<ChatHistoryItem[]>("/api/symptom/chat/history");
  return response.data;
};