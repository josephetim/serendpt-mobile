import { apiGet, apiPost } from "./client";
import { ChatRequest, ChatResponse, ConversationItem } from "../types/api";

const toConversationItems = (value: unknown): ConversationItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const candidate = item as Record<string, unknown>;

    if (
      (candidate.role === "user" || candidate.role === "assistant") &&
      typeof candidate.text === "string"
    ) {
      return [
        {
          id: typeof candidate.id === "string" ? candidate.id : undefined,
          role: candidate.role,
          text: candidate.text,
          created_at:
            typeof candidate.created_at === "string" ? candidate.created_at : undefined,
        },
      ];
    }

    const userMessage = typeof candidate.user_message === "string" ? candidate.user_message : "";
    const aiResponse = typeof candidate.ai_response === "string" ? candidate.ai_response : "";
    const createdAt = typeof candidate.created_at === "string" ? candidate.created_at : undefined;
    const id = typeof candidate.id === "string" ? candidate.id : undefined;

    const output: ConversationItem[] = [];
    if (userMessage.trim()) {
      output.push({
        id: id ? `${id}:user` : undefined,
        role: "user",
        text: userMessage,
        created_at: createdAt,
      });
    }
    if (aiResponse.trim()) {
      output.push({
        id: id ? `${id}:assistant` : undefined,
        role: "assistant",
        text: aiResponse,
        created_at: createdAt,
      });
    }
    return output;
  });
};

export const sendChatQuestion = (payload: ChatRequest) =>
  apiPost<ChatResponse, ChatRequest>("/chat/", payload);

export const getConversation = async (documentId: string): Promise<ConversationItem[]> => {
  const data = await apiGet<
    ConversationItem[] | { messages?: unknown; conversation?: unknown; history?: unknown }
  >(`/conversations/${documentId}`);

  if (Array.isArray(data)) {
    return toConversationItems(data);
  }

  if ("messages" in data) {
    return toConversationItems(data.messages);
  }

  if ("conversation" in data) {
    return toConversationItems(data.conversation);
  }

  if ("history" in data) {
    return toConversationItems(data.history);
  }

  return [];
};
