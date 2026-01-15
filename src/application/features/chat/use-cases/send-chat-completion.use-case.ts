import type { ChatRequestDto, ChatCompletionResponse } from "@/domain/dtos/chat-completion.dto";
import type { Message } from "@/domain/entities/message.entity";
import { httpService } from "@/infrastructure/services/http.service";

export const sendChatCompletionUseCase = async (
    modelId: string,
    content: string,
    conversationId?: string | null
): Promise<Message> => {
    try {
        const payload: ChatRequestDto = {
            model: modelId,
            messages: [{ role: "user", content }],
            conversation_id: conversationId || null,
            stream: false,
        };

        const response = await httpService.post<ChatCompletionResponse>("/v1/chat/completions", payload);

        const aiText = response.choices?.[0]?.message?.content || "";

        return {
            id: response.id,
            role: "assistant",
            content: aiText,
            conversation_id: response.conversation_id,
            created_at: new Date().toISOString()
        };

    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};