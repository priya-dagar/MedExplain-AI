export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponseData {
  response: string;
  intent: string;
}
export interface ChatHistoryItem {
  message: string;
  response: string;
  intent: string;
  created_at: string;
}