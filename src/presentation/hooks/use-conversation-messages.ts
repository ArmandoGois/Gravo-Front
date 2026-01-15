import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getMessagesUseCase } from "@/application/features/conversations/use-cases/get-messages.use-case";
import { useMessageUIStore } from "@/infrastructure/stores/message-ui.store";


export const useConversationMessages = () => {
    const {
        selectedConversationId,
        setMessages,
        setLoadingMessages
    } = useMessageUIStore();

    const { data, isLoading } = useQuery({
        queryKey: ["messages", selectedConversationId],
        queryFn: () => getMessagesUseCase(selectedConversationId!),

        enabled: !!selectedConversationId && selectedConversationId !== "temp-new-chat",
        staleTime: 0,
    });

    useEffect(() => {
        if (selectedConversationId && selectedConversationId !== "temp-new-chat") {
            setLoadingMessages(isLoading);
            if (data) {
                setMessages(data);
            }
        }
    }, [data, isLoading, selectedConversationId, setMessages, setLoadingMessages]);

    return {
        messages: data || [],
        isLoading
    };
};