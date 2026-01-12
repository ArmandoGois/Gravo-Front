import { CreateConversationDto } from "@/domain/dtos/create-conversation.dto";
import type { Conversation } from "@/domain/entities/conversation.entity";
import { httpService } from "@/infrastructure/services/http.service";

export const createConversationUseCase = async (data: CreateConversationDto): Promise<Conversation> => {
    try {
        const response = await httpService.post<Conversation>("/v1/conversations", data);
        return response;
    } catch (error) {
        console.error("Error creating conversation:", error);
        throw error;
    }
};