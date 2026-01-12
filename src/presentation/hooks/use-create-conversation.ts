import { useMutation } from "@tanstack/react-query";

import { createConversationUseCase } from "@/application/features/chat/use-cases/create-conversation.use-case";
import { CreateConversationDto } from "@/domain/dtos/create-conversation.dto";
import { useChatUIStore } from "@/infrastructure/stores/chat-ui.store";
import { useModels } from "@/presentation/hooks/use-models";

export const useCreateChat = (onSuccessCallback?: () => void) => {
    const { addChat } = useChatUIStore();
    const { models: availableModels } = useModels();

    const mutation = useMutation({
        mutationFn: (data: CreateConversationDto) => createConversationUseCase(data),

        onSuccess: (newChatResponse, variables) => {
            const selectedModel = availableModels.find(
                m => m.id === variables.model_id
            );
            const modelsArray = selectedModel ? [selectedModel] : [];
            addChat(
                newChatResponse.title,
                modelsArray,
                newChatResponse.id
            );

            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        // ... onError
    });

    return {
        createChat: mutation.mutate,
        isCreating: mutation.isPending,
        error: mutation.error
    };
};