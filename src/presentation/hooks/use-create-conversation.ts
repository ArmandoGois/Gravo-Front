import { useMutation } from "@tanstack/react-query";

import { createConversationUseCase } from "@/application/features/conversations/use-cases/create-conversation.use-case";
import { CreateConversationDto } from "@/domain/dtos/create-conversation.dto";
import { useConversationUIStore } from "@/infrastructure/stores/conversation-ui.store";
import { useModels } from "@/presentation/hooks/use-models";

export const useCreateConversation = (onSuccessCallback?: () => void) => {
    const { addConversation } = useConversationUIStore();
    const { models: availableModels } = useModels();

    const mutation = useMutation({
        mutationFn: (data: CreateConversationDto) => createConversationUseCase(data),

        onSuccess: (newConversationResponse, variables) => {
            const selectedModel = availableModels.find(
                m => m.id === variables.model_id
            );
            const modelsArray = selectedModel ? [selectedModel] : [];
            addConversation(
                newConversationResponse.title,
                modelsArray,
                newConversationResponse.id
            );

            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        // ... onError
    });

    return {
        createConversation: mutation.mutate,
        isCreating: mutation.isPending,
        error: mutation.error
    };
};