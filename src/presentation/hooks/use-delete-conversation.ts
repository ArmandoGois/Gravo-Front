import { useMutation } from "@tanstack/react-query";

import { deleteConversationUseCase } from "@/application/features/conversations/use-cases/delete-conversation.use-case";
import { useConversationUIStore } from "@/infrastructure/stores/conversation-ui.store";
import { useMessageUIStore } from "@/infrastructure/stores/message-ui.store";
import { useModelUIStore } from "@/infrastructure/stores/model-ui.store";

export const useDeleteConversation = () => {
    const { removeConversation: removeLocalConversation } = useConversationUIStore();

    const { selectedConversationId, selectConversation } = useMessageUIStore();
    const { setModels } = useModelUIStore();

    const mutation = useMutation({
        mutationFn: (id: string) => deleteConversationUseCase(id),

        onSuccess: (_, deletedId) => {
            removeLocalConversation(deletedId);

            if (deletedId === selectedConversationId) {
                selectConversation(null);
                setModels([]);
            }
        },
        onError: (error) => {
            console.error("Could not delete conversation", error);
        }
    });

    return {
        deleteConversation: mutation.mutate,
        isDeleting: mutation.isPending
    };
};