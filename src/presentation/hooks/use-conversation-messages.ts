import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getMessagesUseCase } from "@/application/features/conversations/use-cases/get-messages.use-case";
import { useMessageUIStore } from "@/infrastructure/stores/message-ui.store";


export const useConversationMessages = (isEnabled: boolean = true) => {
    const {
        selectedConversationId,
        setMessages
    } = useMessageUIStore();

    const { data, isLoading } = useQuery({
        queryKey: ["messages", selectedConversationId],
        queryFn: async () => {
            if (!isEnabled || !selectedConversationId) {
                return [];
            }

            return await getMessagesUseCase(selectedConversationId);
        },

        enabled: !!selectedConversationId && isEnabled,
        staleTime: 0,
    });

    useEffect(() => {
        if (data && isEnabled) {
            setMessages(data);
        }
    }, [data, setMessages, isEnabled]);

    return {
        messages: data || [],
        isLoading
    };
};