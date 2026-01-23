import type { ChatRequestDto, ChatCompletionResponse, MultiModelConfig } from "@/domain/dtos/chat-completion.dto";
import type { Message } from "@/domain/entities/message.entity";
import { httpService } from "@/infrastructure/services/http.service";

export const sendChatCompletionUseCase = async (
    modelId: string[],
    content: string,
    conversationId?: string | null
): Promise<Message[]> => {
    try {
        let modelPayload: string | string[];
        let multiModelConfig: MultiModelConfig | null;

        if (modelId.length === 1) {
            // Case Simple
            modelPayload = modelId[0];
            multiModelConfig = null;
        } else {
            // Case Multiple
            modelPayload = modelId;
            multiModelConfig = {
                mode: "parallel",
                timeout_per_model: 30,
                stop_on_first_error: false,
                aggregate_responses: false
            };
        }

        const payload: ChatRequestDto = {
            model: modelPayload,
            messages: [{ role: "user", content }],
            multi_model_config: multiModelConfig,
            conversation_id: conversationId || null,
            stream: false,
        };

        const response = await httpService.post<ChatCompletionResponse>("/v1/chat/completions", payload);

        if (response.responses && response.responses.length > 0) {
            return response.responses.map((individualResponse, index) => {
                const messageContent = individualResponse.choices[0]?.message?.content || "";

                return {
                    id: `${response.id}-${index}`,
                    role: "assistant",
                    content: messageContent,
                    model: individualResponse.model,
                    conversation_id: response.conversation_id,
                    created_at: new Date().toISOString()
                };
            });
        }

        // Ask Armando

        return response.choices.map((choice, index) => ({
            id: `${response.id}-${index}`,
            role: "assistant",
            content: choice.message.content || "",
            model: (Array.isArray(response.model) ? response.model[0] : response.model) || "unknown",
            conversation_id: response.conversation_id,
            created_at: new Date().toISOString()
        }));

    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};