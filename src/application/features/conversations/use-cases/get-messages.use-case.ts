import { MessageResponseDto } from "@/domain/dtos/message-response.dto";
import type { Message } from "@/domain/entities/message.entity";
import { httpService } from "@/infrastructure/services/http.service";

export const getMessagesUseCase = async (conversationId: string): Promise<Message[]> => {
    try {
        const response = await httpService.get<MessageResponseDto[]>(
            `/v1/conversations/${conversationId}/messages?limit=100&offset=0`
        );
        const normalizedMessages: Message[] = response.flatMap((dto) => {

            if (typeof dto.content === 'string') {
                return [{
                    id: dto.id,
                    role: dto.role,
                    content: dto.content,
                    conversation_id: dto.conversation_id,
                    created_at: dto.created_at,
                    model: dto.model
                }];
            }

            if (typeof dto.content === 'object' && dto.content !== null) {

                if ('type' in dto.content && dto.content.type === 'multi_model' && 'responses' in dto.content) {

                    return dto.content.responses.map((resp, index) => ({
                        id: `${dto.id}-${index}`,
                        role: "assistant",
                        content: resp.content,
                        model: resp.model,
                        conversation_id: dto.conversation_id,
                        created_at: dto.created_at
                    }));
                }

                if ('text' in dto.content) {
                    return [{
                        id: dto.id,
                        role: dto.role,
                        content: dto.content.text,
                        conversation_id: dto.conversation_id,
                        created_at: dto.created_at,
                        model: dto.model
                    }];
                }
            }

            return [];
        });

        return normalizedMessages.sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
};