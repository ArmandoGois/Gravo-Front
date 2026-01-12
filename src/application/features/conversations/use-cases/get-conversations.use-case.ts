import { ConversationResponseDto } from "@/domain/dtos/conversation-response.dto";
import { httpService } from "@/infrastructure/services/http.service";

interface GetConversationsParams {
    limit?: number;
    offset?: number;
    archived?: boolean;
}

export const getConversationsUseCase = async (
    params: GetConversationsParams = {}
): Promise<ConversationResponseDto[]> => {
    try {
        const queryParams = new URLSearchParams({
            limit: (params.limit || 50).toString(),
            offset: (params.offset || 0).toString(),
            archived: (params.archived || false).toString(), // Default false para "Active Chats"
        });

        const response = await httpService.get<ConversationResponseDto[]>(
            `/v1/conversations?${queryParams.toString()}`
        );

        return response;
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return [];
    }
};