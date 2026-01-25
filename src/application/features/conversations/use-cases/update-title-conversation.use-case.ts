import { httpService } from "@/infrastructure/services/http.service";

export const updateConversationTitleUseCase = async (conversationId: string, newTitle: string): Promise<void> => {
    try {
        await httpService.put(`/v1/conversations/${conversationId}/title`, { title: newTitle });
    } catch (error) {
        console.error("Error updating conversation title:", error);
        throw error;
    }
};