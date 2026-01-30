import { ConversationResponseDto } from "@/domain/dtos/conversation-response.dto";
import { Conversation } from "@/domain/entities/conversation.entity";
import { httpService } from "@/infrastructure/services/http.service";

import { getModelsUseCase } from "../../models/use-cases/get-models.use-case";

interface GetConversationsParams {
    limit?: number;
    offset?: number;
    archived?: boolean;
}

const availableModels = await getModelsUseCase();

export const getConversationsUseCase = async (
    params: GetConversationsParams = {}
): Promise<Conversation[]> => {
    try {
        const queryParams = new URLSearchParams({
            limit: (params.limit || 50).toString(),
            offset: (params.offset || 0).toString(),
            archived: (params.archived || false).toString(), // Default false para "Active Chats"
        });

        const response = await httpService.get<ConversationResponseDto[]>(
            `/v1/conversations?${queryParams.toString()}`
        );

        const conversations: Conversation[] = response.map((dto) => {

            const backendModelIds = dto.model_id || (dto.model_id ? [dto.model_id] : []);

            const resolvedModels = availableModels.filter(m =>
                backendModelIds.includes(m.id)
            );

            return {
                id: dto.id,
                title: dto.title,
                models: resolvedModels,
                createdAt: new Date(dto.created_at),
                user_id: dto.user_id,
            };
        });
        return conversations;
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return [];
    }
};