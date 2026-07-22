import api from "./api";
import { ChatRequest, ChatResponseData, ChatHistoryItem } from "../types/chat";


export const sendMessage = async (message: string, conversationId: string) => {
  const response = await api.post("/api/symptom/chat", { message, conversation_id: conversationId });
  return response.data;
};

export const getChatHistory = async (conversationId: string): Promise<ChatHistoryItem[]> => {
  const response = await api.get("/api/symptom/chat/history", { params: { conversation_id: conversationId } });
  return response.data;
};