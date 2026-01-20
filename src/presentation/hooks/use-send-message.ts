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
            const modelId = activeModels.map(model => model.id);

            const idToSend = (selectedConversationId === "temp-new-chat")
                ? null
                : selectedConversationId;

            return sendChatCompletionUseCase(modelId, content, idToSend);

        },
        onSuccess: (newMessages) => {
            if (!newMessages || newMessages.length === 0) return;

            setMessages([...messages, ...newMessages]);

            if (!selectedConversationId || selectedConversationId === "temp-new-chat") {

                //Take the conversation_id from the first message
                const firstMessage = newMessages[0];

                if (firstMessage?.conversation_id) {
                    const realId = firstMessage.conversation_id;

                    // Change selected conversation to the real one
                    selectConversation(realId);

                    // Update messages to have the correct conversation_id
                    const updatedMessages = [...messages, ...newMessages].map(m => ({
                        ...m,
                        conversation_id: realId
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