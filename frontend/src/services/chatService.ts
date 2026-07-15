import api from "./api";
import { ChatRequest, ChatResponseData } from "../types/chat";

export const sendMessage = async (message: string): Promise<ChatResponseData> => {
  const response = await api.post<ChatResponseData>("/api/symptom/chat", {
    message,
  } as ChatRequest);
  return response.data;
};