import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateConversationTitleUseCase } from "@/application/features/conversations/use-cases/update-title-conversation.use-case";

export const useUpdateConversation = (onSuccessCallback: () => void) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, title }: { id: string; title: string }) =>
            updateConversationTitleUseCase(id, title),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            if (onSuccessCallback) onSuccessCallback();

        },
        onError: (error) => {
            console.error("Could not update conversation", error);
        }
    });

    return {
        updateConversation: mutation.mutate,
        isUpdating: mutation.isPending
    };
};