import type { Message } from "@/domain/entities/message.entity";
import { httpService } from "@/infrastructure/services/http.service";


export const getMessagesUseCase = async (conversationId: string): Promise<Message[]> => {
    try {
        // Backend params: limit 100 default, offset 0 default
        const response = await httpService.get<Message[]>(
            `/v1/conversations/${conversationId}/messages?limit=100&offset=0`
        );

        // Sorting messages by creation date ascending
        return response.sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
};