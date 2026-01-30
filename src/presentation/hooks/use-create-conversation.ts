import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createConversationUseCase } from "@/application/features/conversations/use-cases/create-conversation.use-case";
import { CreateConversationDto } from "@/domain/dtos/create-conversation.dto";
import { useConversationUIStore } from "@/infrastructure/stores/conversation-ui.store";
import { useMessageUIStore } from "@/infrastructure/stores/message-ui.store";
import { useModelUIStore } from "@/infrastructure/stores/model-ui.store";
import { useModels } from "@/presentation/hooks/use-models";

export const useCreateConversation = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    const { addConversation } = useConversationUIStore();
    const { models: availableModels } = useModels();
    const { setModels } = useModelUIStore();
    const { selectConversation } = useMessageUIStore();

    const mutation = useMutation({
        mutationFn: (data: CreateConversationDto) => createConversationUseCase(data),

        onSuccess: (newConversationResponse, variables) => {

            const selectedModels = availableModels.filter(model =>
                variables.model_id.includes(model.id)
            );

            addConversation(
                newConversationResponse.title,
                selectedModels,
                newConversationResponse.id
            );

            if (selectedModels.length > 0) {
                setModels(selectedModels);
            }

            selectConversation(newConversationResponse.id);

            queryClient.invalidateQueries({ queryKey: ["conversations"] });

            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        onError: (error) => {
            console.error("Error creating conversation:", error);
        }
    });

    return {
        createConversation: mutation.mutate,
        isCreating: mutation.isPending,
        error: mutation.error
    };
};