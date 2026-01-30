import { httpService } from "@/infrastructure/services/http.service";

export const deleteConversationUseCase = async (conversationId: string): Promise<void> => {
    try {
        await httpService.put(`/v1/conversations/${conversationId}/archive`);
    } catch (error) {
        console.error("Error deleting conversation:", error);
        throw error;
    }
};