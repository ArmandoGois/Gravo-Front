import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendChatCompletionUseCase } from "@/application/features/chat/use-cases/send-chat-completion.use-case";
import { useMessageUIStore } from "@/infrastructure/stores/message-ui.store";
import { useModelUIStore } from "@/infrastructure/stores/model-ui.store";


export const useSendMessage = () => {
    const queryClient = useQueryClient();

    // Stores
    const { selectedConversationId, messages, setMessages, selectConversation } = useMessageUIStore();
    const { activeModels } = useModelUIStore();

    // Mutation
    const mutation = useMutation({
        mutationFn: async (content: string) => {
            if (activeModels.length === 0) throw new Error("No model selected");

            // Adjust, if there are multiple models, we pick the first one for now
            const modelId = activeModels[0].id;

            const idToSend = (selectedConversationId === "temp-new-chat")
                ? null
                : selectedConversationId;

            return sendChatCompletionUseCase(modelId, content, idToSend);

        },
        onSuccess: (aiMessage) => {
            setMessages([...messages, aiMessage]);

            if (!selectedConversationId || selectedConversationId === "temp-new-chat") {
                if (aiMessage.conversation_id) {
                    // A. Change temporal id for real id
                    selectConversation(aiMessage.conversation_id);

                    // Update the messages with the correct conversation_id
                    const updatedMessages = [...messages, aiMessage].map(m => ({
                        ...m,
                        conversation_id: aiMessage.conversation_id
                    }));
                    setMessages(updatedMessages);

                    // Refresh conversations list
                    queryClient.invalidateQueries({ queryKey: ["conversations"] });
                }
            }
        },
        onError: (error) => {
            console.error("Failed to send message", error);
        }
    });

    return {
        sendMessage: mutation.mutate,
        isSending: mutation.isPending
    };
};