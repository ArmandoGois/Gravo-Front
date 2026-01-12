import { httpService } from "@/infrastructure/services/http.service";

export const deleteConversationUseCase = async (conversationId: string): Promise<void> => {
    try {
        await httpService.delete(`/v1/conversations/${conversationId}`);
    } catch (error) {
        console.error("Error deleting conversation:", error);
        throw error;
    }
};